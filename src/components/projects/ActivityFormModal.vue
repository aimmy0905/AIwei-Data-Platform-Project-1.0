<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>{{ isEdit ? '编辑活动' : '新建活动' }}</h3>
        <button class="btn btn-icon" @click="$emit('close')">
          <X :size="20" />
        </button>
      </div>

      <form @submit.prevent="handleSubmit" class="modal-body">
        <!-- 基础信息 -->
        <div class="form-section">
          <h4 class="section-title">基础信息</h4>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">活动名称</label>
              <input
                v-model="formData.name"
                type="text"
                class="form-input"
                :class="{ error: errors.name }"
                placeholder="请输入活动名称"
                maxlength="100"
              />
              <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">活动内容</label>
              <textarea
                v-model="formData.content"
                class="form-textarea"
                :class="{ error: errors.content }"
                placeholder="请详细描述活动内容、优惠政策等"
                rows="4"
                maxlength="1000"
              ></textarea>
              <div class="char-count">{{ formData.content.length }}/1000</div>
              <span v-if="errors.content" class="error-text">{{ errors.content }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">活动类型</label>
              <select
                v-model="formData.type"
                class="form-select"
                :class="{ error: errors.type }"
              >
                <option value="">请选择活动类型</option>
                <option value="promotion">促销活动</option>
                <option value="brand">品牌推广</option>
                <option value="holiday">节日活动</option>
                <option value="other">其他</option>
              </select>
              <span v-if="errors.type" class="error-text">{{ errors.type }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">活动阶段</label>
              <select
                v-model="formData.stage"
                class="form-select"
                :class="{ error: errors.stage }"
              >
                <option value="">请选择活动阶段</option>
                <option value="warm_up">预热</option>
                <option value="formal">正式</option>
              </select>
              <span v-if="errors.stage" class="error-text">{{ errors.stage }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">目标市场</label>
              <input
                v-model="formData.targetMarket"
                type="text"
                class="form-input"
                :class="{ error: errors.targetMarket }"
                placeholder="如：北美市场、欧洲市场等"
                maxlength="100"
              />
              <span v-if="errors.targetMarket" class="error-text">{{ errors.targetMarket }}</span>
            </div>
          </div>
        </div>

        <!-- 项目关联 -->
        <div class="form-section">
          <h4 class="section-title">项目关联</h4>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">关联项目</label>
              <select
                v-model="formData.projectId"
                class="form-select"
                :class="{ error: errors.projectId }"
                @change="handleProjectChange"
              >
                <option value="">请选择关联项目</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.project_name }}
                </option>
              </select>
              <span v-if="errors.projectId" class="error-text">{{ errors.projectId }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">负责人</label>
              <select
                v-model="formData.ownerId"
                class="form-select"
                :class="{ error: errors.ownerId }"
              >
                <option value="">请选择负责人</option>
                <option v-for="user in users" :key="user.id" :value="user.id">
                  {{ user.username }}
                </option>
              </select>
              <span v-if="errors.ownerId" class="error-text">{{ errors.ownerId }}</span>
            </div>
          </div>
        </div>

        <!-- 时间设置 -->
        <div class="form-section">
          <h4 class="section-title">时间设置</h4>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">开始时间</label>
              <input
                v-model="formData.startTime"
                type="datetime-local"
                class="form-input"
                :class="{ error: errors.startTime }"
              />
              <span v-if="errors.startTime" class="error-text">{{ errors.startTime }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">结束时间</label>
              <input
                v-model="formData.endTime"
                type="datetime-local"
                class="form-input"
                :class="{ error: errors.endTime }"
              />
              <span v-if="errors.endTime" class="error-text">{{ errors.endTime }}</span>
            </div>
          </div>
        </div>

        <!-- 目标设置 -->
        <div class="form-section">
          <h4 class="section-title">目标设置</h4>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">活动预算（元）</label>
              <input
                v-model.number="formData.budget"
                type="number"
                class="form-input"
                :class="{ error: errors.budget }"
                placeholder="请输入活动预算"
                min="0"
                step="100"
              />
              <span v-if="errors.budget" class="error-text">{{ errors.budget }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">目标销售额（元）</label>
              <input
                v-model.number="formData.targetSales"
                type="number"
                class="form-input"
                :class="{ error: errors.targetSales }"
                placeholder="请输入目标销售额"
                min="0"
                step="100"
              />
              <span v-if="errors.targetSales" class="error-text">{{ errors.targetSales }}</span>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label class="form-label required">目标ROI</label>
              <input
                v-model.number="formData.targetROI"
                type="number"
                class="form-input"
                :class="{ error: errors.targetROI }"
                placeholder="请输入目标ROI"
                min="0"
                step="0.1"
              />
              <span v-if="errors.targetROI" class="error-text">{{ errors.targetROI }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">目标转化率（%）</label>
              <input
                v-model.number="formData.targetConversionRate"
                type="number"
                class="form-input"
                :class="{ error: errors.targetConversionRate }"
                placeholder="请输入目标转化率"
                min="0"
                max="100"
                step="0.1"
              />
              <span v-if="errors.targetConversionRate" class="error-text">{{ errors.targetConversionRate }}</span>
            </div>
          </div>
        </div>

        <!-- 渠道设置 -->
        <div class="form-section">
          <h4 class="section-title">参与渠道</h4>

          <div class="form-group">
            <label class="form-label required">选择渠道</label>
            <div class="checkbox-group">
              <label
                v-for="channel in availableChannels"
                :key="channel.value"
                class="checkbox-item"
              >
                <input
                  type="checkbox"
                  :value="channel.value"
                  v-model="formData.channels"
                  class="checkbox-input"
                />
                <span class="checkbox-label">{{ channel.label }}</span>
              </label>
            </div>
            <span v-if="errors.channels" class="error-text">{{ errors.channels }}</span>
          </div>
        </div>

        <!-- 模板选择（仅新建时显示） -->
        <div v-if="!isEdit" class="form-section">
          <h4 class="section-title">快速设置</h4>

          <div class="form-group">
            <label class="form-label">选择模板（可选）</label>
            <div class="template-grid">
              <div
                v-for="template in templates"
                :key="template.id"
                class="template-card"
                :class="{ active: selectedTemplate?.id === template.id }"
                @click="applyTemplate(template)"
              >
                <div class="template-header">
                  <h5>{{ template.name }}</h5>
                  <span class="template-type">{{ getTemplateTypeText(template.type) }}</span>
                </div>
                <p class="template-description">{{ template.description }}</p>
              </div>
            </div>
          </div>
        </div>
      </form>

      <div class="modal-footer">
        <button type="button" class="btn btn-outline" @click="$emit('close')">
          取消
        </button>
        <button
          type="button"
          class="btn btn-primary"
          @click="handleSubmit"
          :disabled="submitting"
        >
          <Loader v-if="submitting" :size="16" class="spin" />
          {{ submitting ? '保存中...' : (isEdit ? '保存修改' : '创建活动') }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { X, Loader } from 'lucide-vue-next'
import type { Activity, ActivityTemplate } from '@/types'
import { mockProjects } from '@/mock/projects'
import { mockUsers } from '@/mock/auth'
import { mockGetActivityTemplates, mockCreateActivity, mockUpdateActivity } from '@/mock/activities'

interface Props {
  isEdit?: boolean
  activity?: Activity | null
}

interface Emits {
  (e: 'close'): void
  (e: 'success', activity: Activity): void
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false,
  activity: null
})

const emit = defineEmits<Emits>()

// 响应式数据
const submitting = ref(false)
const projects = ref(mockProjects)
const users = ref(mockUsers)
const templates = ref<ActivityTemplate[]>([])
const selectedTemplate = ref<ActivityTemplate | null>(null)

// 表单数据
const formData = reactive({
  name: '',
  content: '',
  type: '' as 'promotion' | 'brand' | 'holiday' | 'other' | '',
  stage: 'warm_up' as 'warm_up' | 'formal',
  targetMarket: '',
  projectId: 0,
  ownerId: 0,
  startTime: '',
  endTime: '',
  budget: 0,
  targetSales: 0,
  targetROI: 0,
  targetConversionRate: 0,
  channels: [] as string[]
})

// 错误状态
const errors = reactive({
  name: '',
  content: '',
  type: '',
  stage: '',
  targetMarket: '',
  projectId: '',
  ownerId: '',
  startTime: '',
  endTime: '',
  budget: '',
  targetSales: '',
  targetROI: '',
  targetConversionRate: '',
  channels: ''
})

// 可用渠道
const availableChannels = [
  { value: 'Google Ads', label: 'Google Ads' },
  { value: 'Facebook Ads', label: 'Facebook Ads' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'TikTok', label: 'TikTok' },
  { value: 'YouTube', label: 'YouTube' },
  { value: 'Bing Ads', label: 'Bing Ads' },
  { value: 'Criteo', label: 'Criteo' },
  { value: 'Amazon DSP', label: 'Amazon DSP' },
  { value: 'Email Marketing', label: '邮件营销' },
  { value: 'SMS Marketing', label: '短信营销' },
  { value: 'Display Network', label: '展示广告网络' },
  { value: 'Snapchat', label: 'Snapchat' }
]

// 计算属性
const isEdit = computed(() => props.isEdit && props.activity)

// 方法
const loadTemplates = async () => {
  try {
    const response = await mockGetActivityTemplates()
    if (response.success && response.data) {
      templates.value = response.data
    }
  } catch (error) {
    console.error('加载模板失败:', error)
  }
}

const initializeForm = () => {
  if (props.activity) {
    // 编辑模式，填充现有数据
    Object.assign(formData, {
      name: props.activity.name,
      content: props.activity.content,
      type: props.activity.type,
      stage: props.activity.stage,
      targetMarket: props.activity.targetMarket,
      projectId: props.activity.projectId,
      ownerId: props.activity.ownerId,
      startTime: formatDateTimeLocal(props.activity.startTime),
      endTime: formatDateTimeLocal(props.activity.endTime),
      budget: props.activity.budget,
      targetSales: props.activity.targetSales,
      targetROI: props.activity.targetROI,
      targetConversionRate: props.activity.targetConversionRate,
      channels: [...props.activity.channels]
    })
  } else {
    // 新建模式，设置默认值
    const now = new Date()
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000)
    formData.startTime = formatDateTimeLocal(now.toISOString())
    formData.endTime = formatDateTimeLocal(tomorrow.toISOString())
  }
}

const formatDateTimeLocal = (isoString: string): string => {
  const date = new Date(isoString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const validateForm = (): boolean => {
  // 清空之前的错误
  Object.keys(errors).forEach(key => {
    errors[key as keyof typeof errors] = ''
  })

  let isValid = true

  // 验证必填字段
  if (!formData.name.trim()) {
    errors.name = '请输入活动名称'
    isValid = false
  } else if (formData.name.length < 2) {
    errors.name = '活动名称至少2个字符'
    isValid = false
  }

  if (!formData.content.trim()) {
    errors.content = '请输入活动内容'
    isValid = false
  } else if (formData.content.length < 10) {
    errors.content = '活动内容至少10个字符'
    isValid = false
  }

  if (!formData.type) {
    errors.type = '请选择活动类型'
    isValid = false
  }

  if (!formData.stage) {
    errors.stage = '请选择活动阶段'
    isValid = false
  }

  if (!formData.targetMarket.trim()) {
    errors.targetMarket = '请输入目标市场'
    isValid = false
  }

  if (!formData.projectId) {
    errors.projectId = '请选择关联项目'
    isValid = false
  }

  if (!formData.ownerId) {
    errors.ownerId = '请选择负责人'
    isValid = false
  }

  if (!formData.startTime) {
    errors.startTime = '请选择开始时间'
    isValid = false
  }

  if (!formData.endTime) {
    errors.endTime = '请选择结束时间'
    isValid = false
  } else if (formData.startTime && formData.endTime <= formData.startTime) {
    errors.endTime = '结束时间必须晚于开始时间'
    isValid = false
  }

  if (!formData.budget || formData.budget <= 0) {
    errors.budget = '请输入有效的活动预算'
    isValid = false
  }

  if (!formData.targetSales || formData.targetSales <= 0) {
    errors.targetSales = '请输入有效的目标销售额'
    isValid = false
  }

  if (!formData.targetROI || formData.targetROI <= 0) {
    errors.targetROI = '请输入有效的目标ROI'
    isValid = false
  }

  if (!formData.targetConversionRate || formData.targetConversionRate <= 0) {
    errors.targetConversionRate = '请输入有效的目标转化率'
    isValid = false
  }

  if (formData.channels.length === 0) {
    errors.channels = '请至少选择一个参与渠道'
    isValid = false
  }

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  submitting.value = true
  try {
    const activityData: Partial<Activity> = {
      name: formData.name,
      content: formData.content,
      type: formData.type as 'promotion' | 'brand' | 'holiday' | 'other',
      stage: formData.stage,
      targetMarket: formData.targetMarket,
      projectId: formData.projectId,
      ownerId: formData.ownerId,
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
      budget: formData.budget,
      targetSales: formData.targetSales,
      targetROI: formData.targetROI,
      targetConversionRate: formData.targetConversionRate,
      channels: formData.channels,
      projectName: projects.value.find(p => p.id === formData.projectId)?.project_name || '',
      ownerName: users.value.find(u => u.id === formData.ownerId)?.username || ''
    }

    let response
    if (isEdit.value) {
      response = await mockUpdateActivity(props.activity!.id, activityData)
    } else {
      response = await mockCreateActivity(activityData)
    }

    if (response.success && response.data) {
      emit('success', response.data)
      emit('close')
    } else {
      alert(response.message || '操作失败')
    }
  } catch (error) {
    console.error('提交失败:', error)
    alert('提交失败，请重试')
  } finally {
    submitting.value = false
  }
}

const handleOverlayClick = () => {
  emit('close')
}

const handleProjectChange = () => {
  // 项目变化时可以做一些联动操作，比如自动设置负责人等
}

const applyTemplate = (template: ActivityTemplate) => {
  selectedTemplate.value = template

  // 应用模板配置
  if (template.config) {
    if (template.config.type) formData.type = template.config.type
    if (template.config.stage) formData.stage = template.config.stage
    if (template.config.channels) formData.channels = [...template.config.channels]
    if (template.config.targetROI) formData.targetROI = template.config.targetROI
    if (template.config.targetConversionRate) formData.targetConversionRate = template.config.targetConversionRate
  }
}

const getTemplateTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    promotion: '促销',
    brand: '品牌',
    holiday: '节日',
    custom: '自定义'
  }
  return typeMap[type] || type
}

// 生命周期
onMounted(() => {
  initializeForm()
  if (!props.isEdit) {
    loadTemplates()
  }
})

// 监听props变化
watch(() => props.activity, initializeForm, { deep: true })
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  overflow-y: auto;
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  flex-shrink: 0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
  flex-shrink: 0;
}

/* 表单样式 */
.form-section {
  margin-bottom: 32px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-row:last-child {
  margin-bottom: 0;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group:only-child {
  grid-column: 1 / -1;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-label.required::after {
  content: ' *';
  color: #f44336;
}

.form-input,
.form-select,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: #f44336;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: 4px;
}

.error-text {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}

/* 复选框组 */
.checkbox-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.checkbox-item:hover {
  background: #f5f5f5;
}

.checkbox-input {
  width: 16px;
  height: 16px;
  cursor: pointer;
}

.checkbox-label {
  font-size: 14px;
  color: #333;
  cursor: pointer;
}

/* 模板卡片 */
.template-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-top: 8px;
}

.template-card {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.template-card:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.template-card.active {
  border-color: #1976d2;
  background: #f3f8ff;
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.template-header h5 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.template-type {
  font-size: 12px;
  color: #666;
  background: #f0f0f0;
  padding: 2px 6px;
  border-radius: 3px;
}

.template-description {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1565c0;
}

.btn-outline {
  background: transparent;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.btn-outline:hover {
  background: #1976d2;
  color: white;
}

.btn-icon {
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: #f5f5f5;
  border-color: #1976d2;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 10px;
  }

  .modal-content {
    max-width: 100%;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .checkbox-group {
    grid-template-columns: 1fr;
  }

  .template-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>
