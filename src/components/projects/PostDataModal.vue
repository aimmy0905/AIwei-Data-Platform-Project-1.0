<template>
  <div v-if="isVisible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h2>{{ isEdit ? '编辑发帖数据' : '新建帖子' }}</h2>
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
              <label class="required">红人姓名</label>
              <input
                v-model="formData.influencerName"
                type="text"
                class="form-input"
                placeholder="请输入红人姓名或昵称"
                maxlength="50"
              />
              <span v-if="errors.influencerName" class="error-text">{{ errors.influencerName }}</span>
            </div>

            <div class="form-item">
              <label class="required">发帖平台</label>
              <select v-model="formData.platform" class="form-select">
                <option value="">请选择平台</option>
                <option v-for="platform in platformOptions" :key="platform.value" :value="platform.value">
                  {{ platform.label }}
                </option>
              </select>
              <span v-if="errors.platform" class="error-text">{{ errors.platform }}</span>
            </div>

            <div class="form-item">
              <label class="required">发帖日期</label>
              <input
                v-model="formData.postDate"
                type="date"
                class="form-input"
                :max="currentDate"
              />
              <span v-if="errors.postDate" class="error-text">{{ errors.postDate }}</span>
            </div>
          </div>
        </div>

        <!-- 内容信息区域 -->
        <div class="section">
          <h3 class="section-title">内容信息</h3>
          <div class="form-row">
            <div class="form-item">
              <label class="required">发帖类型</label>
              <select v-model="formData.postType" class="form-select">
                <option value="">请选择类型</option>
                <option v-for="type in postTypeOptions" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
              <span v-if="errors.postType" class="error-text">{{ errors.postType }}</span>
            </div>

            <div class="form-item">
              <label class="required">关联项目</label>
              <select v-model="formData.projectId" class="form-select">
                <option value="">请选择项目</option>
                <option v-for="project in projects" :key="project.id" :value="project.id">
                  {{ project.name }}
                </option>
              </select>
              <span v-if="errors.projectId" class="error-text">{{ errors.projectId }}</span>
            </div>
          </div>

          <div class="form-item">
            <label class="required">发帖内容摘要</label>
            <textarea
              v-model="formData.contentSummary"
              class="form-textarea"
              placeholder="请输入发帖内容摘要或标题（10-500字符）"
              rows="3"
              maxlength="500"
            ></textarea>
            <div class="char-count">{{ formData.contentSummary.length }}/500</div>
            <span v-if="errors.contentSummary" class="error-text">{{ errors.contentSummary }}</span>
          </div>
        </div>

        <!-- 数据信息区域 -->
        <div class="section">
          <h3 class="section-title">互动数据</h3>
          <div class="form-grid">
            <div class="form-item">
              <label class="required">观看量</label>
              <input
                v-model.number="formData.viewsCount"
                type="number"
                class="form-input"
                placeholder="观看量"
                min="0"
              />
              <span v-if="errors.viewsCount" class="error-text">{{ errors.viewsCount }}</span>
            </div>

            <div class="form-item">
              <label class="required">点赞数</label>
              <input
                v-model.number="formData.likesCount"
                type="number"
                class="form-input"
                placeholder="点赞数"
                min="0"
              />
              <span v-if="errors.likesCount" class="error-text">{{ errors.likesCount }}</span>
            </div>

            <div class="form-item">
              <label class="required">评论数</label>
              <input
                v-model.number="formData.commentsCount"
                type="number"
                class="form-input"
                placeholder="评论数"
                min="0"
              />
              <span v-if="errors.commentsCount" class="error-text">{{ errors.commentsCount }}</span>
            </div>

            <div class="form-item">
              <label class="required">分享数</label>
              <input
                v-model.number="formData.sharesCount"
                type="number"
                class="form-input"
                placeholder="分享数"
                min="0"
              />
              <span v-if="errors.sharesCount" class="error-text">{{ errors.sharesCount }}</span>
            </div>

            <div class="form-item">
              <label>点击数</label>
              <input
                v-model.number="formData.clickCount"
                type="number"
                class="form-input"
                placeholder="点击数"
                min="0"
              />
            </div>

            <div class="form-item">
              <label>转化数</label>
              <input
                v-model.number="formData.conversionCount"
                type="number"
                class="form-input"
                placeholder="转化数"
                min="0"
              />
            </div>
          </div>
        </div>

        <!-- 效果评估区域 -->
        <div class="section">
          <h3 class="section-title">效果评估</h3>
          <div class="form-row">
            <div class="form-item">
              <label class="required">效果评分</label>
              <div class="score-input">
                <input
                  v-model.number="formData.effectScore"
                  type="number"
                  class="form-input"
                  placeholder="评分"
                  min="1"
                  max="10"
                  step="1"
                />
                <span class="score-unit">分 (1-10分)</span>
              </div>
              <span v-if="errors.effectScore" class="error-text">{{ errors.effectScore }}</span>
            </div>
          </div>

          <!-- 评分说明 -->
          <div class="score-guide">
            <div class="score-item">
              <span class="score-range">9-10分</span>
              <span class="score-desc">优秀：超出预期效果</span>
            </div>
            <div class="score-item">
              <span class="score-range">7-8分</span>
              <span class="score-desc">良好：达到预期效果</span>
            </div>
            <div class="score-item">
              <span class="score-range">5-6分</span>
              <span class="score-desc">一般：基本达到效果</span>
            </div>
            <div class="score-item">
              <span class="score-range">1-4分</span>
              <span class="score-desc">较差：未达到预期</span>
            </div>
          </div>
        </div>

        <!-- 数据预览 -->
        <div class="section" v-if="isDataComplete">
          <h3 class="section-title">数据预览</h3>
          <div class="preview-card">
            <div class="preview-row">
              <span class="preview-label">红人平台：</span>
              <span class="preview-value">{{ formData.influencerName }} - {{ getPlatformText(formData.platform) }}</span>
            </div>
            <div class="preview-row">
              <span class="preview-label">互动数据：</span>
              <span class="preview-value">{{ formatNumber(formData.viewsCount || 0) }}观看 / {{ formatNumber(formData.likesCount || 0) }}点赞 / {{ formatNumber(formData.commentsCount || 0) }}评论</span>
            </div>
            <div class="preview-row">
              <span class="preview-label">效果评分：</span>
              <span class="preview-value">{{ formData.effectScore }}/10分</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="$emit('close')">
          取消
        </button>
        <button class="btn btn-primary" @click="handleSave" :disabled="!isFormValid">
          {{ isEdit ? '保存修改' : '保存帖子' }}
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
import type { PostDataForm } from '@/types'
import { platformOptions, postTypeOptions } from '@/mock/influencer-data'

interface Props {
  isVisible: boolean
  isEdit?: boolean
  editData?: any
  projects: Array<{ id: string; name: string }>
}

interface Emits {
  (e: 'close'): void
  (e: 'save', data: PostDataForm): void
  (e: 'save-and-continue', data: PostDataForm): void
}

const props = withDefaults(defineProps<Props>(), {
  isEdit: false
})

const emit = defineEmits<Emits>()

// 表单数据
const formData = ref<PostDataForm>({
  postDate: '',
  influencerName: '',
  platform: '',
  contentSummary: '',
  postType: '',
  projectId: '',
  likesCount: null,
  commentsCount: null,
  sharesCount: null,
  viewsCount: null,
  clickCount: null,
  conversionCount: null,
  effectScore: null
})

// 错误信息
const errors = ref<Record<string, string>>({})

// 当前日期（用于限制选择）
const currentDate = computed(() => {
  const now = new Date()
  return now.toISOString().split('T')[0]
})

// 数据是否完整
const isDataComplete = computed(() => {
  return formData.value.influencerName &&
         formData.value.platform &&
         formData.value.viewsCount !== null &&
         formData.value.likesCount !== null &&
         formData.value.effectScore !== null
})

// 表单是否有效
const isFormValid = computed(() => {
  return Object.keys(errors.value).length === 0 &&
         formData.value.postDate &&
         formData.value.influencerName &&
         formData.value.platform &&
         formData.value.contentSummary &&
         formData.value.postType &&
         formData.value.projectId &&
         formData.value.viewsCount !== null &&
         formData.value.likesCount !== null &&
         formData.value.commentsCount !== null &&
         formData.value.sharesCount !== null &&
         formData.value.effectScore !== null
})

// 验证表单
const validateForm = () => {
  errors.value = {}

  if (!formData.value.postDate) {
    errors.value.postDate = '请选择发帖日期'
  }

  if (!formData.value.influencerName || formData.value.influencerName.length < 2) {
    errors.value.influencerName = '红人姓名至少2个字符'
  }

  if (!formData.value.platform) {
    errors.value.platform = '请选择发帖平台'
  }

  if (!formData.value.contentSummary || formData.value.contentSummary.length < 10) {
    errors.value.contentSummary = '内容摘要至少10个字符'
  }

  if (!formData.value.postType) {
    errors.value.postType = '请选择发帖类型'
  }

  if (!formData.value.projectId) {
    errors.value.projectId = '请选择关联项目'
  }

  if (formData.value.viewsCount === null || formData.value.viewsCount < 0) {
    errors.value.viewsCount = '观看量不能为负数'
  }

  if (formData.value.likesCount === null || formData.value.likesCount < 0) {
    errors.value.likesCount = '点赞数不能为负数'
  }

  if (formData.value.commentsCount === null || formData.value.commentsCount < 0) {
    errors.value.commentsCount = '评论数不能为负数'
  }

  if (formData.value.sharesCount === null || formData.value.sharesCount < 0) {
    errors.value.sharesCount = '分享数不能为负数'
  }

  if (formData.value.effectScore === null || formData.value.effectScore < 1 || formData.value.effectScore > 10) {
    errors.value.effectScore = '效果评分必须在1-10之间'
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
    postDate: '',
    influencerName: '',
    platform: '',
    contentSummary: '',
    postType: '',
    projectId: '',
    likesCount: null,
    commentsCount: null,
    sharesCount: null,
    viewsCount: null,
    clickCount: null,
    conversionCount: null,
    effectScore: null
  }
  errors.value = {}
}

// 获取平台文本
const getPlatformText = (platform: string): string => {
  const platformMap: Record<string, string> = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    xiaohongshu: '小红书',
    weibo: '微博'
  }
  return platformMap[platform] || platform
}

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString()
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
  max-width: 900px;
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
.form-select,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
  font-family: inherit;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.char-count {
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: -4px;
}

.score-input {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score-input .form-input {
  flex: 1;
}

.score-unit {
  font-size: 14px;
  color: #666;
  white-space: nowrap;
}

.score-guide {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 12px;
  margin-top: 12px;
}

.score-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
  font-size: 12px;
}

.score-item:last-child {
  margin-bottom: 0;
}

.score-range {
  font-weight: 600;
  color: #1976d2;
}

.score-desc {
  color: #666;
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
