<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">编辑客户</h3>
        <button class="close-btn" @click="close">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <form @submit.prevent="handleSubmit">
          <div class="form-tabs">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              class="tab-btn"
              :class="{ 'tab-btn--active': activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              {{ tab.label }}
            </button>
          </div>

          <div class="form-content">
            <!-- 基本信息 -->
            <div v-if="activeTab === 'basic'" class="tab-content">
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label required">客户名称</label>
                  <input
                    v-model="formData.cooperationDetails.customerName"
                    type="text"
                    class="form-input"
                    :class="{ 'form-input--error': errors.customerName }"
                    placeholder="请输入客户名称"
                    @blur="validateField('customerName')"
                  />
                  <span v-if="errors.customerName" class="error-message">{{ errors.customerName }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label required">合作方式</label>
                  <select
                    v-model="formData.cooperationDetails.cooperationType"
                    class="form-select"
                    :class="{ 'form-input--error': errors.cooperationType }"
                    @change="validateField('cooperationType')"
                  >
                    <option value="">请选择合作方式</option>
                    <option value="代运营">代运营</option>
                    <option value="咨询服务">咨询服务</option>
                    <option value="技术支持">技术支持</option>
                    <option value="培训服务">培训服务</option>
                  </select>
                  <span v-if="errors.cooperationType" class="error-message">{{ errors.cooperationType }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label required">服务团队</label>
                  <select
                    v-model="formData.basicInfo.serviceTeam"
                    class="form-select"
                    :class="{ 'form-input--error': errors.serviceTeam }"
                    @change="validateField('serviceTeam')"
                  >
                    <option value="">请选择服务团队</option>
                    <option value="时尚组">时尚组</option>
                    <option value="科技组">科技组</option>
                    <option value="美妆组">美妆组</option>
                    <option value="运动组">运动组</option>
                    <option value="家居组">家居组</option>
                    <option value="综合组">综合组</option>
                  </select>
                  <span v-if="errors.serviceTeam" class="error-message">{{ errors.serviceTeam }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label required">客户行业</label>
                  <select
                    v-model="formData.basicInfo.industry"
                    class="form-select"
                    :class="{ 'form-input--error': errors.industry }"
                    @change="validateField('industry')"
                  >
                    <option value="">请选择客户行业</option>
                    <option value="时尚服装">时尚服装</option>
                    <option value="数码科技">数码科技</option>
                    <option value="美容护肤">美容护肤</option>
                    <option value="体育用品">体育用品</option>
                    <option value="家居装饰">家居装饰</option>
                    <option value="其他">其他</option>
                  </select>
                  <span v-if="errors.industry" class="error-message">{{ errors.industry }}</span>
                </div>

                <div class="form-group">
                  <label class="form-label">客户分级</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input
                        v-model="formData.cooperationDetails.customerGrade"
                        type="radio"
                        value="A"
                        class="radio-input"
                      />
                      <span class="radio-label">A级客户</span>
                    </label>
                    <label class="radio-item">
                      <input
                        v-model="formData.cooperationDetails.customerGrade"
                        type="radio"
                        value="B"
                        class="radio-input"
                      />
                      <span class="radio-label">B级客户</span>
                    </label>
                    <label class="radio-item">
                      <input
                        v-model="formData.cooperationDetails.customerGrade"
                        type="radio"
                        value="C"
                        class="radio-input"
                      />
                      <span class="radio-label">C级客户</span>
                    </label>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">客户状态</label>
                  <div class="radio-group">
                    <label class="radio-item">
                      <input
                        v-model="formData.cooperationDetails.customerStatus"
                        type="radio"
                        value="active"
                        class="radio-input"
                      />
                      <span class="radio-label">活跃</span>
                    </label>
                    <label class="radio-item">
                      <input
                        v-model="formData.cooperationDetails.customerStatus"
                        type="radio"
                        value="inactive"
                        class="radio-input"
                      />
                      <span class="radio-label">非活跃</span>
                    </label>
                    <label class="radio-item">
                      <input
                        v-model="formData.cooperationDetails.customerStatus"
                        type="radio"
                        value="suspended"
                        class="radio-input"
                      />
                      <span class="radio-label">暂停</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- 联系人信息 -->
            <div v-if="activeTab === 'contact'" class="tab-content">
              <div class="section-header">
                <h4 class="section-title">联系人信息</h4>
                <button type="button" class="add-btn" @click="addContact">
                  <Plus :size="16" />
                  添加联系人
                </button>
              </div>

              <div class="contact-list">
                <div v-for="(contact, index) in formData.basicInfo.contactPersons" :key="contact.id" class="contact-item">
                  <div class="contact-header">
                    <span class="contact-index">联系人 {{ index + 1 }}</span>
                    <button v-if="formData.basicInfo.contactPersons.length > 1" type="button" class="remove-btn" @click="removeContact(index)">
                      <Trash2 :size="14" />
                    </button>
                  </div>
                  <div class="contact-form">
                    <div class="form-group">
                      <label class="form-label required">姓名</label>
                      <input
                        v-model="contact.name"
                        type="text"
                        class="form-input"
                        placeholder="请输入联系人姓名"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label required">职位</label>
                      <input
                        v-model="contact.position"
                        type="text"
                        class="form-input"
                        placeholder="请输入职位"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label required">电话</label>
                      <input
                        v-model="contact.phone"
                        type="tel"
                        class="form-input"
                        placeholder="请输入联系电话"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label required">邮箱</label>
                      <input
                        v-model="contact.email"
                        type="email"
                        class="form-input"
                        placeholder="请输入邮箱地址"
                      />
                    </div>
                    <div class="form-group">
                      <label class="checkbox-item">
                        <input
                          v-model="contact.isPrimary"
                          type="checkbox"
                          class="checkbox-input"
                          @change="handlePrimaryContact(index)"
                        />
                        <span class="checkbox-label">主要联系人</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 备注信息 -->
            <div v-if="activeTab === 'notes'" class="tab-content">
              <div class="form-group">
                <label class="form-label">特殊合作条件</label>
                <textarea
                  v-model="formData.cooperationDetails.specialConditions"
                  class="form-textarea"
                  placeholder="请描述特殊的合作条件或要求"
                  rows="4"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">续费跟进备注</label>
                <textarea
                  v-model="formData.renewalNotes"
                  class="form-textarea"
                  placeholder="请输入续费跟进需要注意的事项"
                  rows="4"
                ></textarea>
              </div>
            </div>
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
import { ref, reactive, watch, nextTick } from 'vue'
import { X, Plus, Trash2, Check } from 'lucide-vue-next'
import { mockUpdateCustomer } from '@/mock/customer'
import type { CustomerDetail, ContactPerson } from '@/types'

// 属性定义
interface Props {
  visible: boolean
  customerData: CustomerDetail | null
}

const props = defineProps<Props>()

// 事件定义
const emit = defineEmits<{
  close: []
  success: [customer: CustomerDetail]
}>()

// 响应式数据
const activeTab = ref('basic')
const submitting = ref(false)
const formData = reactive<CustomerDetail>({
  id: 0,
  cooperationDetails: {
    customerName: '',
    cooperationStartTime: '',
    serviceStartTime: '',
    cooperationType: '',
    signingSales: '',
    specialConditions: '',
    customerGrade: 'B',
    customerStatus: 'active'
  },
  basicInfo: {
    serviceTeam: '',
    contactPersons: [],
    industry: '',
    regions: [],
    businessModel: '',
    overseasSalesScale: '',
    overseasSalesRatio: 0,
    targetSalesScale: '',
    mainSalesChannel: '',
    hasTechTeam: false,
    hasOperationTeam: false,
    hasBrandTeam: false,
    cooperationTransfer: ''
  },
  websiteInfo: {
    newProductFrequency: '',
    websiteLaunchTime: '',
    lastYearSales: 0,
    targetMarkets: [],
    mainProducts: '',
    productAdvantages: '',
    pricingStrategy: '',
    inventoryStatus: true,
    annualSalesTarget: 0,
    annualCostTarget: 0,
    costRatio: 0
  },
  competitorInfo: {
    competitorWebsites: []
  },
  specialAttention: {
    customerExpectations: '',
    communicationPreferences: '',
    specialRequirements: '',
    culturalConsiderations: '',
    timeZonePreferences: '',
    languagePreferences: '',
    decisionMakers: '',
    budgetConstraints: '',
    complianceRequirements: '',
    riskFactors: '',
    successFactors: '',
    historicalIssues: ''
  },
  qaRecords: [],
  renewalNotes: '',
  projects: [],
  adAccounts: [],
  createdAt: '',
  lastUpdated: ''
})

const errors = reactive<Record<string, string>>({})

// 标签页配置
const tabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'contact', label: '联系人' },
  { key: 'notes', label: '备注信息' }
]

// 验证规则
const validationRules = {
  customerName: (value: string) => {
    if (!value) return '请输入客户名称'
    if (value.length < 2) return '客户名称至少2个字符'
    if (value.length > 100) return '客户名称不能超过100个字符'
    return ''
  },
  cooperationType: (value: string) => {
    if (!value) return '请选择合作方式'
    return ''
  },
  serviceTeam: (value: string) => {
    if (!value) return '请选择服务团队'
    return ''
  },
  industry: (value: string) => {
    if (!value) return '请选择客户行业'
    return ''
  }
}

// 方法
const validateField = (fieldName: string) => {
  const rule = validationRules[fieldName as keyof typeof validationRules]
  if (rule) {
    let value: any
    if (['customerName', 'cooperationType'].includes(fieldName)) {
      value = formData.cooperationDetails[fieldName as keyof typeof formData.cooperationDetails]
    } else if (['serviceTeam', 'industry'].includes(fieldName)) {
      value = formData.basicInfo[fieldName as keyof typeof formData.basicInfo]
    }

    const error = rule(value)
    if (error) {
      errors[fieldName] = error
    } else {
      delete errors[fieldName]
    }
  }
}

const validateForm = (): boolean => {
  const fieldsToValidate = ['customerName', 'cooperationType', 'serviceTeam', 'industry']
  let isValid = true

  fieldsToValidate.forEach(field => {
    validateField(field)
    if (errors[field]) {
      isValid = false
    }
  })

  return isValid
}

const addContact = () => {
  const newContact: ContactPerson = {
    id: Date.now(),
    name: '',
    position: '',
    phone: '',
    email: '',
    isPrimary: false
  }
  formData.basicInfo.contactPersons.push(newContact)
}

const removeContact = (index: number) => {
  formData.basicInfo.contactPersons.splice(index, 1)
}

const handlePrimaryContact = (index: number) => {
  // 确保只有一个主要联系人
  formData.basicInfo.contactPersons.forEach((contact, i) => {
    if (i !== index) {
      contact.isPrimary = false
    }
  })
}

const handleSubmit = async () => {
  if (!validateForm()) {
    return
  }

  submitting.value = true
  try {
    const response = await mockUpdateCustomer(formData.id, formData)
    if (response.success && response.data) {
      emit('success', response.data)
      close()
    }
  } catch (error) {
    console.error('更新客户失败:', error)
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

// 监听props变化，初始化表单数据
watch(() => props.customerData, (newData) => {
  if (newData) {
    Object.assign(formData, newData)
  }
}, { immediate: true, deep: true })

// 监听visible变化，重置表单状态
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    activeTab.value = 'basic'
    Object.keys(errors).forEach(key => delete errors[key])
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
  max-width: 800px;
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

.form-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: var(--spacing-lg);
}

.tab-btn {
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.tab-btn:hover {
  color: var(--color-primary);
}

.tab-btn--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.form-content {
  min-height: 300px;
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
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

.radio-item,
.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.radio-input,
.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

.radio-label,
.checkbox-label {
  color: var(--color-text-primary);
  user-select: none;
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-top: var(--spacing-xs);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.add-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.add-btn:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: 1px solid var(--color-error);
  border-radius: var(--border-radius-sm);
  color: var(--color-error);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.remove-btn:hover {
  background: var(--color-error);
  color: white;
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.contact-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.contact-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.contact-index {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.contact-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-md);
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

  .contact-form {
    grid-template-columns: 1fr;
  }

  .modal-footer {
    flex-direction: column;
  }
}
</style>
