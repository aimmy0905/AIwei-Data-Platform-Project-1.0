<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">{{ isEdit ? '编辑客户评价' : '新建客户评价' }}</h2>
        <button class="modal-close" @click="$emit('close')">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit" class="review-form">
          <!-- 基础信息 -->
          <div class="form-section">
            <h3 class="section-title">基础信息</h3>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">客户 <span class="required">*</span></label>
                <select
                  v-model="formData.customerId"
                  @change="handleCustomerChange"
                  class="form-select"
                  :class="{ error: errors.customerId }"
                >
                  <option value="">请选择客户</option>
                  <option v-for="customer in customers" :key="customer.id" :value="customer.id">
                    {{ customer.name }}
                  </option>
                </select>
                <span v-if="errors.customerId" class="error-text">{{ errors.customerId }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">项目 <span class="required">*</span></label>
                <select
                  v-model="formData.projectId"
                  class="form-select"
                  :class="{ error: errors.projectId }"
                  :disabled="!formData.customerId"
                >
                  <option value="">请选择项目</option>
                  <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                    {{ project.name }}
                  </option>
                </select>
                <span v-if="errors.projectId" class="error-text">{{ errors.projectId }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">评价月份 <span class="required">*</span></label>
                <input
                  type="month"
                  v-model="formData.evaluationMonth"
                  class="form-input"
                  :class="{ error: errors.evaluationMonth }"
                  :max="currentMonth"
                />
                <span v-if="errors.evaluationMonth" class="error-text">{{ errors.evaluationMonth }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">评价人 <span class="required">*</span></label>
                <input
                  type="text"
                  v-model="formData.evaluator"
                  placeholder="请输入客户方评价人员姓名"
                  class="form-input"
                  :class="{ error: errors.evaluator }"
                  maxlength="50"
                />
                <span v-if="errors.evaluator" class="error-text">{{ errors.evaluator }}</span>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">评价日期 <span class="required">*</span></label>
                <input
                  type="date"
                  v-model="formData.evaluationDate"
                  class="form-input"
                  :class="{ error: errors.evaluationDate }"
                  :max="today"
                />
                <span v-if="errors.evaluationDate" class="error-text">{{ errors.evaluationDate }}</span>
              </div>
            </div>
          </div>

          <!-- 评分信息 -->
          <div class="form-section">
            <h3 class="section-title">评分信息</h3>

            <div class="rating-grid">
              <div class="rating-item">
                <label class="rating-label">综合评分 <span class="required">*</span></label>
                <div class="rating-input">
                  <StarRating
                    v-model="formData.overallRating"
                    :max="10"
                    :step="1"
                    show-number
                  />
                </div>
                <span v-if="errors.overallRating" class="error-text">{{ errors.overallRating }}</span>
              </div>

              <div class="rating-item">
                <label class="rating-label">问题处理及时性 <span class="required">*</span></label>
                <div class="rating-input">
                  <StarRating
                    v-model="formData.problemHandlingRating"
                    :max="10"
                    :step="1"
                    show-number
                  />
                </div>
                <span v-if="errors.problemHandlingRating" class="error-text">{{ errors.problemHandlingRating }}</span>
              </div>

              <div class="rating-item">
                <label class="rating-label">专业能力达标 <span class="required">*</span></label>
                <div class="rating-input">
                  <StarRating
                    v-model="formData.professionalRating"
                    :max="10"
                    :step="1"
                    show-number
                  />
                </div>
                <span v-if="errors.professionalRating" class="error-text">{{ errors.professionalRating }}</span>
              </div>

              <div class="rating-item">
                <label class="rating-label">服务态度 <span class="required">*</span></label>
                <div class="rating-input">
                  <StarRating
                    v-model="formData.serviceAttitudeRating"
                    :max="10"
                    :step="1"
                    show-number
                  />
                </div>
                <span v-if="errors.serviceAttitudeRating" class="error-text">{{ errors.serviceAttitudeRating }}</span>
              </div>
            </div>
          </div>

          <!-- 改进建议 -->
          <div class="form-section">
            <h3 class="section-title">改进建议</h3>

            <div class="form-group">
              <label class="form-label">改进建议</label>
              <textarea
                v-model="formData.improvementSuggestions"
                placeholder="请输入客户提出的改进建议（可选）"
                class="form-textarea"
                :class="{ error: errors.improvementSuggestions }"
                rows="4"
                maxlength="500"
              ></textarea>
              <div class="char-count">{{ formData.improvementSuggestions?.length || 0 }}/500</div>
              <span v-if="errors.improvementSuggestions" class="error-text">{{ errors.improvementSuggestions }}</span>
            </div>
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('close')">
          取消
        </button>
        <button type="submit" class="btn btn-primary" @click="handleSubmit" :disabled="isSubmitting">
          {{ isSubmitting ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { X } from 'lucide-vue-next'
import StarRating from './StarRating.vue'
import { createCustomerReview, updateCustomerReview, type CustomerReview } from '@/mock/customer-reviews'

interface Props {
  visible: boolean
  review?: CustomerReview | null
  customers: Array<{id: string, name: string}>
  projects: Array<{id: string, customerId: string, name: string}>
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  save: [review: CustomerReview]
}>()

// 响应式数据
const isSubmitting = ref(false)
const formData = ref({
  customerId: '',
  customerName: '',
  projectId: '',
  projectName: '',
  evaluationMonth: '',
  evaluator: '',
  evaluationDate: '',
  overallRating: 0,
  problemHandlingRating: 0,
  professionalRating: 0,
  serviceAttitudeRating: 0,
  improvementSuggestions: ''
})

const errors = ref<Record<string, string>>({})

// 计算属性
const isEdit = computed(() => !!props.review)

const availableProjects = computed(() => {
  if (!formData.value.customerId) return []
  return props.projects.filter(project => project.customerId === formData.value.customerId)
})

const currentMonth = computed(() => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
})

const today = computed(() => {
  return new Date().toISOString().split('T')[0]
})

// 方法
const initFormData = () => {
  if (props.review) {
    // 编辑模式
    formData.value = {
      customerId: props.review.customerId,
      customerName: props.review.customerName,
      projectId: props.review.projectId,
      projectName: props.review.projectName,
      evaluationMonth: props.review.evaluationMonth,
      evaluator: props.review.evaluator,
      evaluationDate: props.review.evaluationDate,
      overallRating: props.review.overallRating,
      problemHandlingRating: props.review.problemHandlingRating,
      professionalRating: props.review.professionalRating,
      serviceAttitudeRating: props.review.serviceAttitudeRating,
      improvementSuggestions: props.review.improvementSuggestions || ''
    }
  } else {
    // 新建模式
    const now = new Date()
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1)

    formData.value = {
      customerId: '',
      customerName: '',
      projectId: '',
      projectName: '',
      evaluationMonth: `${lastMonth.getFullYear()}-${String(lastMonth.getMonth() + 1).padStart(2, '0')}`,
      evaluator: '',
      evaluationDate: today.value,
      overallRating: 0,
      problemHandlingRating: 0,
      professionalRating: 0,
      serviceAttitudeRating: 0,
      improvementSuggestions: ''
    }
  }

  // 清空错误
  errors.value = {}
}

const handleCustomerChange = () => {
  // 当客户改变时，清空项目选择
  formData.value.projectId = ''
  formData.value.projectName = ''

  // 更新客户名称
  const customer = props.customers.find(c => c.id === formData.value.customerId)
  formData.value.customerName = customer?.name || ''
}

const validateForm = (): boolean => {
  errors.value = {}

  // 必填字段验证
  if (!formData.value.customerId) {
    errors.value.customerId = '请选择客户'
  }

  if (!formData.value.projectId) {
    errors.value.projectId = '请选择项目'
  }

  if (!formData.value.evaluationMonth) {
    errors.value.evaluationMonth = '请选择评价月份'
  }

  if (!formData.value.evaluator.trim()) {
    errors.value.evaluator = '请输入评价人'
  } else if (formData.value.evaluator.length > 50) {
    errors.value.evaluator = '评价人姓名不能超过50个字符'
  }

  if (!formData.value.evaluationDate) {
    errors.value.evaluationDate = '请选择评价日期'
  }

  // 评分验证
  if (formData.value.overallRating < 1 || formData.value.overallRating > 10) {
    errors.value.overallRating = '综合评分必须在1-10分之间'
  }

  if (formData.value.problemHandlingRating < 1 || formData.value.problemHandlingRating > 10) {
    errors.value.problemHandlingRating = '问题处理评分必须在1-10分之间'
  }

  if (formData.value.professionalRating < 1 || formData.value.professionalRating > 10) {
    errors.value.professionalRating = '专业能力评分必须在1-10分之间'
  }

  if (formData.value.serviceAttitudeRating < 1 || formData.value.serviceAttitudeRating > 10) {
    errors.value.serviceAttitudeRating = '服务态度评分必须在1-10分之间'
  }

  // 改进建议长度验证
  if (formData.value.improvementSuggestions && formData.value.improvementSuggestions.length > 500) {
    errors.value.improvementSuggestions = '改进建议不能超过500个字符'
  }

  // 月份不能晚于当前月份
  if (formData.value.evaluationMonth > currentMonth.value) {
    errors.value.evaluationMonth = '评价月份不能晚于当前月份'
  }

  // 评价日期不能晚于今天
  if (formData.value.evaluationDate > today.value) {
    errors.value.evaluationDate = '评价日期不能晚于今天'
  }

  return Object.keys(errors.value).length === 0
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // 更新项目名称
    const project = props.projects.find(p => p.id === formData.value.projectId)
    formData.value.projectName = project?.name || ''

    let result: CustomerReview

    if (isEdit.value && props.review) {
      // 编辑模式
      result = updateCustomerReview(props.review.id, {
        customerId: formData.value.customerId,
        customerName: formData.value.customerName,
        projectId: formData.value.projectId,
        projectName: formData.value.projectName,
        evaluationMonth: formData.value.evaluationMonth,
        evaluator: formData.value.evaluator,
        evaluationDate: formData.value.evaluationDate,
        overallRating: formData.value.overallRating,
        problemHandlingRating: formData.value.problemHandlingRating,
        professionalRating: formData.value.professionalRating,
        serviceAttitudeRating: formData.value.serviceAttitudeRating,
        improvementSuggestions: formData.value.improvementSuggestions
      }) as CustomerReview
    } else {
      // 新建模式
      result = createCustomerReview({
        customerId: formData.value.customerId,
        customerName: formData.value.customerName,
        projectId: formData.value.projectId,
        projectName: formData.value.projectName,
        evaluationMonth: formData.value.evaluationMonth,
        evaluator: formData.value.evaluator,
        evaluationDate: formData.value.evaluationDate,
        overallRating: formData.value.overallRating,
        problemHandlingRating: formData.value.problemHandlingRating,
        professionalRating: formData.value.professionalRating,
        serviceAttitudeRating: formData.value.serviceAttitudeRating,
        improvementSuggestions: formData.value.improvementSuggestions
      })
    }

    emit('save', result)
  } catch (error) {
    console.error('保存评价失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

const handleOverlayClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}

// 监听器
watch(() => props.visible, (visible) => {
  if (visible) {
    initFormData()
  }
})

// 生命周期
onMounted(() => {
  if (props.visible) {
    initFormData()
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.modal-close {
  padding: 8px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f1f5f9;
  color: #374151;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.review-form {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label,
.rating-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.required {
  color: #dc2626;
}

.form-input,
.form-select,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: #dc2626;
}

.form-select:disabled {
  background-color: #f9fafb;
  color: #9ca3af;
  cursor: not-allowed;
}

.form-textarea {
  resize: vertical;
  min-height: 100px;
}

.char-count {
  font-size: 12px;
  color: #6b7280;
  text-align: right;
}

.error-text {
  font-size: 12px;
  color: #dc2626;
}

.rating-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.rating-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-input {
  display: flex;
  align-items: center;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .form-row,
  .rating-grid {
    grid-template-columns: 1fr;
  }

  .modal-container {
    margin: 10px;
    max-width: none;
  }
}
</style>
