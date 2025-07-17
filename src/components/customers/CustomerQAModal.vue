<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">添加Q&A记录</h3>
        <button class="close-btn" @click="close">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label required">问题分类</label>
              <select
                v-model="formData.issueCategory"
                class="form-select"
                :class="{ 'form-input--error': errors.issueCategory }"
                @change="validateField('issueCategory')"
              >
                <option value="">请选择问题分类</option>
                <option value="服务质量问题">服务质量问题</option>
                <option value="技术问题">技术问题</option>
                <option value="商务问题">商务问题</option>
                <option value="沟通问题">沟通问题</option>
                <option value="其他问题">其他问题</option>
              </select>
              <span v-if="errors.issueCategory" class="error-message">{{ errors.issueCategory }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">影响程度</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input
                    v-model="formData.impactLevel"
                    type="radio"
                    value="low"
                    class="radio-input"
                  />
                  <span class="radio-label">低</span>
                </label>
                <label class="radio-item">
                  <input
                    v-model="formData.impactLevel"
                    type="radio"
                    value="medium"
                    class="radio-input"
                  />
                  <span class="radio-label">中</span>
                </label>
                <label class="radio-item">
                  <input
                    v-model="formData.impactLevel"
                    type="radio"
                    value="high"
                    class="radio-input"
                  />
                  <span class="radio-label">高</span>
                </label>
                <label class="radio-item">
                  <input
                    v-model="formData.impactLevel"
                    type="radio"
                    value="critical"
                    class="radio-input"
                  />
                  <span class="radio-label">严重</span>
                </label>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label required">问题发生日期</label>
              <input
                v-model="formData.issueDate"
                type="date"
                class="form-input"
                :class="{ 'form-input--error': errors.issueDate }"
                @change="validateField('issueDate')"
              />
              <span v-if="errors.issueDate" class="error-message">{{ errors.issueDate }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">负责人</label>
              <select
                v-model="formData.responsiblePerson"
                class="form-select"
                :class="{ 'form-input--error': errors.responsiblePerson }"
                @change="validateField('responsiblePerson')"
              >
                <option value="">请选择负责人</option>
                <option value="张小明">张小明</option>
                <option value="李美丽">李美丽</option>
                <option value="王强">王强</option>
                <option value="赵敏">赵敏</option>
                <option value="陈华">陈华</option>
              </select>
              <span v-if="errors.responsiblePerson" class="error-message">{{ errors.responsiblePerson }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">完成期限</label>
              <input
                v-model="formData.dueDate"
                type="date"
                class="form-input"
                :class="{ 'form-input--error': errors.dueDate }"
                @change="validateField('dueDate')"
              />
              <span v-if="errors.dueDate" class="error-message">{{ errors.dueDate }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">状态</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input
                    v-model="formData.status"
                    type="radio"
                    value="pending"
                    class="radio-input"
                  />
                  <span class="radio-label">待处理</span>
                </label>
                <label class="radio-item">
                  <input
                    v-model="formData.status"
                    type="radio"
                    value="in_progress"
                    class="radio-input"
                  />
                  <span class="radio-label">处理中</span>
                </label>
                <label class="radio-item">
                  <input
                    v-model="formData.status"
                    type="radio"
                    value="completed"
                    class="radio-input"
                  />
                  <span class="radio-label">已完成</span>
                </label>
              </div>
            </div>
          </div>

          <div class="form-section">
            <div class="form-group">
              <label class="form-label required">问题详细描述</label>
              <textarea
                v-model="formData.issueDescription"
                class="form-textarea"
                :class="{ 'form-input--error': errors.issueDescription }"
                placeholder="请详细描述问题的具体情况"
                rows="4"
                @blur="validateField('issueDescription')"
              ></textarea>
              <span v-if="errors.issueDescription" class="error-message">{{ errors.issueDescription }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">根本原因分析</label>
              <textarea
                v-model="formData.rootCause"
                class="form-textarea"
                :class="{ 'form-input--error': errors.rootCause }"
                placeholder="请分析问题的根本原因"
                rows="3"
                @blur="validateField('rootCause')"
              ></textarea>
              <span v-if="errors.rootCause" class="error-message">{{ errors.rootCause }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">即时解决方案</label>
              <textarea
                v-model="formData.immediateSolution"
                class="form-textarea"
                :class="{ 'form-input--error': errors.immediateSolution }"
                placeholder="请描述即时采取的解决方案"
                rows="3"
                @blur="validateField('immediateSolution')"
              ></textarea>
              <span v-if="errors.immediateSolution" class="error-message">{{ errors.immediateSolution }}</span>
            </div>

            <div class="form-group">
              <label class="form-label required">改正措施</label>
              <textarea
                v-model="formData.correctiveMeasures"
                class="form-textarea"
                :class="{ 'form-input--error': errors.correctiveMeasures }"
                placeholder="请描述具体的改正措施"
                rows="3"
                @blur="validateField('correctiveMeasures')"
              ></textarea>
              <span v-if="errors.correctiveMeasures" class="error-message">{{ errors.correctiveMeasures }}</span>
            </div>

            <div class="form-group">
              <label class="form-label">预防措施</label>
              <textarea
                v-model="formData.preventiveMeasures"
                class="form-textarea"
                placeholder="请描述预防类似问题的措施"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">后续行动</label>
              <textarea
                v-model="formData.followUpActions"
                class="form-textarea"
                placeholder="请描述后续需要采取的行动"
                rows="3"
              ></textarea>
            </div>

            <div class="form-group">
              <label class="form-label">经验教训</label>
              <textarea
                v-model="formData.lessonsLearned"
                class="form-textarea"
                placeholder="请总结从此问题中得到的经验教训"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div class="form-group" v-if="formData.status === 'completed'">
            <label class="form-label">实际完成日期</label>
            <input
              v-model="formData.actualCompletionDate"
              type="date"
              class="form-input"
            />
          </div>
        </form>
      </div>

      <div class="modal-footer">
        <button type="button" class="action-btn action-btn--secondary" @click="close">
          取消
        </button>
        <button type="button" class="action-btn action-btn--primary" @click="handleSubmit" :disabled="submitting">
          <Check :size="16" />
          {{ submitting ? '保存中...' : '保存' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { X, Check } from 'lucide-vue-next'
import { mockAddCustomerQA } from '@/mock/customer'
import type { CustomerQA } from '@/types'

// 属性定义
interface Props {
  visible: boolean
  customerId: number
}

const props = defineProps<Props>()

// 事件定义
const emit = defineEmits<{
  close: []
  success: [qa: CustomerQA]
}>()

// 响应式数据
const submitting = ref(false)
const formData = reactive<Partial<CustomerQA>>({
  issueCategory: '',
  impactLevel: 'medium',
  issueDate: new Date().toISOString().split('T')[0],
  issueDescription: '',
  rootCause: '',
  immediateSolution: '',
  correctiveMeasures: '',
  preventiveMeasures: '',
  responsiblePerson: '',
  dueDate: '',
  actualCompletionDate: '',
  status: 'pending',
  followUpActions: '',
  lessonsLearned: ''
})

const errors = reactive<Record<string, string>>({})

// 验证规则
const validationRules = {
  issueCategory: (value: string) => {
    if (!value) return '请选择问题分类'
    return ''
  },
  issueDate: (value: string) => {
    if (!value) return '请选择问题发生日期'
    if (new Date(value) > new Date()) return '问题发生日期不能晚于当前日期'
    return ''
  },
  issueDescription: (value: string) => {
    if (!value) return '请输入问题详细描述'
    if (value.length < 10) return '问题描述至少10个字符'
    return ''
  },
  rootCause: (value: string) => {
    if (!value) return '请输入根本原因分析'
    if (value.length < 10) return '根本原因分析至少10个字符'
    return ''
  },
  immediateSolution: (value: string) => {
    if (!value) return '请输入即时解决方案'
    if (value.length < 10) return '即时解决方案至少10个字符'
    return ''
  },
  correctiveMeasures: (value: string) => {
    if (!value) return '请输入改正措施'
    if (value.length < 10) return '改正措施至少10个字符'
    return ''
  },
  responsiblePerson: (value: string) => {
    if (!value) return '请选择负责人'
    return ''
  },
  dueDate: (value: string) => {
    if (!value) return '请选择完成期限'
    if (formData.issueDate && new Date(value) < new Date(formData.issueDate)) {
      return '完成期限不能早于问题发生日期'
    }
    return ''
  }
}

// 方法
const validateField = (fieldName: string) => {
  const rule = validationRules[fieldName as keyof typeof validationRules]
  if (rule) {
    const value = formData[fieldName as keyof typeof formData] as string
    const error = rule(value)
    if (error) {
      errors[fieldName] = error
    } else {
      delete errors[fieldName]
    }
  }
}

const validateForm = (): boolean => {
  const fieldsToValidate = [
    'issueCategory', 'issueDate', 'issueDescription', 'rootCause',
    'immediateSolution', 'correctiveMeasures', 'responsiblePerson', 'dueDate'
  ]
  let isValid = true

  fieldsToValidate.forEach(field => {
    validateField(field)
    if (errors[field]) {
      isValid = false
    }
  })

  return isValid
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  submitting.value = true
  try {
    const response = await mockAddCustomerQA(props.customerId, formData)
    if (response.success && response.data) {
      emit('success', response.data)
      close()
    }
  } catch (error) {
    console.error('添加Q&A记录失败:', error)
  } finally {
    submitting.value = false
  }
}

const close = () => {
  emit('close')
}

const handleOverlayClick = () => {
  close()
}

const resetForm = () => {
  Object.assign(formData, {
    issueCategory: '',
    impactLevel: 'medium',
    issueDate: new Date().toISOString().split('T')[0],
    issueDescription: '',
    rootCause: '',
    immediateSolution: '',
    correctiveMeasures: '',
    preventiveMeasures: '',
    responsiblePerson: '',
    dueDate: '',
    actualCompletionDate: '',
    status: 'pending',
    followUpActions: '',
    lessonsLearned: ''
  })
  Object.keys(errors).forEach(key => delete errors[key])
}

// 监听visible变化，重置表单
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    resetForm()
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
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.close-btn:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.form-section {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-label.required::after {
  content: ' *';
  color: var(--color-error);
}

.form-input,
.form-select,
.form-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--duration-fast);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-input--error,
.form-select--error,
.form-textarea--error {
  border-color: var(--color-error);
}

.form-input--error:focus,
.form-select--error:focus,
.form-textarea--error:focus {
  box-shadow: 0 0 0 3px rgba(245, 34, 45, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.radio-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.radio-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.radio-input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

.radio-label {
  color: var(--color-text-primary);
  user-select: none;
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-top: var(--spacing-xs);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.action-btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.action-btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.action-btn--secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.action-btn--secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .modal-content {
    max-width: 95vw;
    max-height: 95vh;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>
