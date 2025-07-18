<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>{{ isEdit ? '编辑红人数据' : '添加红人数据' }}</h2>
        <button class="close-button" @click="$emit('close')">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-content">
        <!-- 基础信息区域 -->
        <div class="section">
          <h3 class="section-title">基础信息</h3>
          <div class="form-row">
            <div class="form-item">
              <label class="required">客户</label>
              <select
                v-model="formData.customerId"
                class="form-select"
                @change="onCustomerChange"
              >
                <option value="">请选择客户</option>
                <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                  {{ customer.name }}
                </option>
              </select>
              <span v-if="errors.customerId" class="error-text">{{ errors.customerId }}</span>
            </div>

            <div class="form-item">
              <label class="required">项目</label>
              <select
                v-model="formData.projectId"
                class="form-select"
                :disabled="!formData.customerId"
              >
                <option value="">请选择项目</option>
                <option v-for="project in filteredProjects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
              <span v-if="errors.projectId" class="error-text">{{ errors.projectId }}</span>
            </div>

            <div class="form-item">
              <label class="required">统计月份</label>
              <input
                v-model="formData.month"
                type="month"
                class="form-input"
                :max="currentMonth"
              />
              <span v-if="errors.month" class="error-text">{{ errors.month }}</span>
            </div>
          </div>
        </div>

        <!-- 数据录入区域 -->
        <div class="section">
          <h3 class="section-title">红人数据录入</h3>
          <div class="form-grid">
            <div class="form-item">
              <label class="required">总网红数</label>
              <input
                v-model.number="formData.totalInfluencers"
                type="number"
                class="form-input"
                placeholder="请输入总网红数"
                min="1"
                max="9999"
              />
              <span v-if="errors.totalInfluencers" class="error-text">{{ errors.totalInfluencers }}</span>
            </div>

            <div class="form-item">
              <label class="required">提及内容总数</label>
              <input
                v-model.number="formData.contentMentions"
                type="number"
                class="form-input"
                placeholder="请输入提及内容总数"
                min="0"
                max="99999"
              />
              <span v-if="errors.contentMentions" class="error-text">{{ errors.contentMentions }}</span>
            </div>

            <div class="form-item">
              <label class="required">总观看量</label>
              <input
                v-model.number="formData.totalViews"
                type="number"
                class="form-input"
                placeholder="请输入总观看量"
                min="0"
                max="999999999"
              />
              <span v-if="errors.totalViews" class="error-text">{{ errors.totalViews }}</span>
            </div>

            <div class="form-item">
              <label class="required">评论数</label>
              <input
                v-model.number="formData.commentsCount"
                type="number"
                class="form-input"
                placeholder="请输入评论数"
                min="0"
                max="999999"
              />
              <span v-if="errors.commentsCount" class="error-text">{{ errors.commentsCount }}</span>
            </div>

            <div class="form-item">
              <label class="required">点赞数</label>
              <input
                v-model.number="formData.likesCount"
                type="number"
                class="form-input"
                placeholder="请输入点赞数"
                min="0"
                max="999999999"
              />
              <span v-if="errors.likesCount" class="error-text">{{ errors.likesCount }}</span>
            </div>

            <div class="form-item">
              <label class="required">互动率 (%)</label>
              <input
                v-model.number="formData.interactionRate"
                type="number"
                class="form-input"
                placeholder="请输入互动率"
                min="0"
                max="100"
                step="0.1"
              />
              <span v-if="errors.interactionRate" class="error-text">{{ errors.interactionRate }}</span>
            </div>
          </div>
        </div>

        <!-- 数据预览 -->
        <div class="section" v-if="isDataComplete">
          <h3 class="section-title">数据预览</h3>
          <div class="preview-card">
            <div class="preview-row">
              <span class="preview-label">客户项目：</span>
              <span class="preview-value">{{ selectedCustomerName }} - {{ selectedProjectName }}</span>
            </div>
            <div class="preview-row">
              <span class="preview-label">统计月份：</span>
              <span class="preview-value">{{ formData.month }}</span>
            </div>
            <div class="preview-row">
              <span class="preview-label">点赞及互动率：</span>
              <span class="preview-value">{{ formData.likesCount?.toLocaleString() }}/{{ formData.interactionRate }}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">
          取消
        </button>
        <button class="btn btn-primary" @click="handleSave" :disabled="!isFormValid">
          {{ isEdit ? '保存修改' : '保存数据' }}
        </button>
        <button v-if="!isEdit" class="btn btn-success" @click="handleSaveAndContinue" :disabled="!isFormValid">
          保存并继续
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { InfluencerDataForm } from '@/types'

interface Props {
  isVisible: boolean
  isEdit?: boolean
  editData?: any
  customers: Array<{ id: string; name: string }>
  projects: Array<{ id: string; name: string; customerId: string }>
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: InfluencerDataForm): void
  (e: 'save-and-continue', data: InfluencerDataForm): void
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<Emits>()

// 表单数据
const formData = ref<InfluencerDataForm>({
  month: '',
  totalInfluencers: null,
  contentMentions: null,
  totalViews: null,
  commentsCount: null,
  likesCount: null,
  interactionRate: null,
  customerId: '',
  projectId: ''
})

// 错误信息
const errors = ref<Record<string, string>>({})

// 当前月份（用于限制选择）
const currentMonth = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}`
})

// 根据选择的客户筛选项目
const filteredProjects = computed(() => {
  if (!formData.value.customerId) return []
  return props.projects.filter(project => project.customerId === formData.value.customerId)
})

// 选中的客户名称
const selectedCustomerName = computed(() => {
  const customer = props.customers.find(c => c.id === formData.value.customerId)
  return customer?.name || ''
})

// 选中的项目名称
const selectedProjectName = computed(() => {
  const project = filteredProjects.value.find(p => p.id === formData.value.projectId)
  return project?.name || ''
})

// 数据是否完整
const isDataComplete = computed(() => {
  return formData.value.customerId &&
         formData.value.projectId &&
         formData.value.month &&
         formData.value.totalInfluencers !== null &&
         formData.value.likesCount !== null &&
         formData.value.interactionRate !== null
})

// 表单是否有效
const isFormValid = computed(() => {
  return Object.keys(errors.value).length === 0 &&
         formData.value.customerId &&
         formData.value.projectId &&
         formData.value.month &&
         formData.value.totalInfluencers !== null &&
         formData.value.contentMentions !== null &&
         formData.value.totalViews !== null &&
         formData.value.commentsCount !== null &&
         formData.value.likesCount !== null &&
         formData.value.interactionRate !== null
})

// 客户改变时重置项目选择
const onCustomerChange = () => {
  formData.value.projectId = ''
}

// 验证表单
const validateForm = () => {
  errors.value = {}

  if (!formData.value.customerId) {
    errors.value.customerId = '请选择客户'
  }

  if (!formData.value.projectId) {
    errors.value.projectId = '请选择项目'
  }

  if (!formData.value.month) {
    errors.value.month = '请选择统计月份'
  }

  if (formData.value.totalInfluencers === null || formData.value.totalInfluencers < 1) {
    errors.value.totalInfluencers = '总网红数必须大于0'
  }

  if (formData.value.contentMentions === null || formData.value.contentMentions < 0) {
    errors.value.contentMentions = '提及内容总数不能为负数'
  }

  if (formData.value.totalViews === null || formData.value.totalViews < 0) {
    errors.value.totalViews = '总观看量不能为负数'
  }

  if (formData.value.commentsCount === null || formData.value.commentsCount < 0) {
    errors.value.commentsCount = '评论数不能为负数'
  }

  if (formData.value.likesCount === null || formData.value.likesCount < 0) {
    errors.value.likesCount = '点赞数不能为负数'
  }

  if (formData.value.interactionRate === null || formData.value.interactionRate < 0 || formData.value.interactionRate > 100) {
    errors.value.interactionRate = '互动率必须在0-100之间'
  }
}

// 处理保存
const handleSave = () => {
  validateForm()
  if (Object.keys(errors.value).length === 0) {
    emit('save', formData.value)
  }
}

// 处理保存并继续
const handleSaveAndContinue = () => {
  validateForm()
  if (Object.keys(errors.value).length === 0) {
    emit('save-and-continue', formData.value)
  }
}

// 处理遮罩层点击
const handleOverlayClick = () => {
  emit('close')
}

// 重置表单
const resetForm = () => {
  formData.value = {
    month: '',
    totalInfluencers: null,
    contentMentions: null,
    totalViews: null,
    commentsCount: null,
    likesCount: null,
    interactionRate: null,
    customerId: '',
    projectId: ''
  }
  errors.value = {}
}

// 监听模态框显示状态
watch(() => props.isVisible, (newVal) => {
  if (newVal) {
    if (props.isEdit && props.editData) {
      // 编辑模式下填充数据
      formData.value = { ...props.editData }
    } else {
      // 新增模式下重置表单
      resetForm()
    }
  }
})

// 实时验证
watch(formData, () => {
  if (Object.keys(errors.value).length > 0) {
    validateForm()
  }
}, { deep: true })
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
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.modal-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.close-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #666;
  transition: all 0.2s;
}

.close-button:hover {
  background: #e0e0e0;
  color: #333;
}

.modal-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #1976d2;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.form-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-item label {
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-item label.required::after {
  content: ' *';
  color: #f44336;
}

.form-input,
.form-select {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.form-input:disabled,
.form-select:disabled {
  background: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

.error-text {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
}

.preview-card {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.preview-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.preview-row:last-child {
  margin-bottom: 0;
}

.preview-label {
  font-weight: 500;
  color: #666;
}

.preview-value {
  font-weight: 600;
  color: #333;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
  background: #f8f9fa;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1565c0;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background: #5a6268;
}

.btn-success {
  background: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background: #218838;
}
</style>
