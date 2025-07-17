<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">服务续费记录</h3>
        <button class="modal-close" @click="$emit('close')">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-content">
        <!-- 项目信息 -->
        <div class="project-info">
          <h4>{{ projectInfo.project_name }}</h4>
          <p>客户：{{ projectInfo.customer_name }}</p>
        </div>

        <!-- 续费记录列表 -->
        <div class="renewals-section">
          <div class="section-header">
            <h5>续费记录</h5>
            <button class="action-btn action-btn--primary" @click="showCreateRenewal = true">
              <Plus :size="16" />
              新增续费
            </button>
          </div>

          <div class="renewals-list">
            <div
              v-for="renewal in renewals"
              :key="renewal.id"
              class="renewal-card"
            >
              <div class="renewal-card__header">
                <div class="renewal-date">
                  <Calendar :size="16" />
                  {{ formatDate(renewal.renewal_date) }}
                </div>
                <div class="renewal-amount">
                  ¥{{ formatNumber(renewal.renewal_amount) }}
                </div>
                <div class="renewal-actions">
                  <button
                    class="action-btn-small action-btn-small--secondary"
                    @click="editRenewal(renewal)"
                    title="编辑"
                  >
                    <Edit :size="14" />
                  </button>
                  <button
                    class="action-btn-small action-btn-small--danger"
                    @click="deleteRenewal(renewal.id)"
                    title="删除"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>

              <div class="renewal-details">
                <div class="detail-row">
                  <div class="detail-item">
                    <span class="label">续费周期：</span>
                    <span class="value">{{ renewal.renewal_period }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">续费类型：</span>
                    <span class="value type-badge" :class="getRenewalTypeClass(renewal.renewal_type)">
                      {{ renewal.renewal_type }}
                    </span>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-item">
                    <span class="label">付款方式：</span>
                    <span class="value">{{ renewal.payment_method }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">收款确认：</span>
                    <span class="value status-badge" :class="getConfirmationClass(renewal.payment_confirmed)">
                      {{ renewal.payment_confirmed }}
                    </span>
                  </div>
                </div>

                <div class="detail-row">
                  <div class="detail-item">
                    <span class="label">操作人：</span>
                    <span class="value">{{ renewal.operator }}</span>
                  </div>
                  <div class="detail-item">
                    <span class="label">创建时间：</span>
                    <span class="value">{{ formatDate(renewal.created_at) }}</span>
                  </div>
                </div>

                <div class="detail-row" v-if="renewal.remarks">
                  <div class="detail-item full-width">
                    <span class="label">备注：</span>
                    <span class="value remarks">{{ renewal.remarks }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div v-if="renewals.length === 0" class="empty-state">
              <div class="empty-icon">
                <DollarSign :size="48" />
              </div>
              <div class="empty-text">暂无续费记录</div>
              <button class="action-btn action-btn--primary" @click="showCreateRenewal = true">
                添加第一条续费记录
              </button>
            </div>
          </div>

          <!-- 续费统计 -->
          <div class="renewal-stats" v-if="renewals.length > 0">
            <div class="stats-item">
              <div class="stats-label">总续费次数</div>
              <div class="stats-value">{{ renewals.length }}</div>
            </div>
            <div class="stats-item">
              <div class="stats-label">总续费金额</div>
              <div class="stats-value">¥{{ formatNumber(totalRenewalAmount) }}</div>
            </div>
            <div class="stats-item">
              <div class="stats-label">已确认金额</div>
              <div class="stats-value">¥{{ formatNumber(confirmedAmount) }}</div>
            </div>
            <div class="stats-item">
              <div class="stats-label">待确认金额</div>
              <div class="stats-value">¥{{ formatNumber(pendingAmount) }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 新建/编辑续费弹窗 -->
      <div v-if="showCreateRenewal || editingRenewal" class="sub-modal-overlay" @click="closeRenewalForm">
        <div class="sub-modal-container" @click.stop>
          <div class="sub-modal-header">
            <h4>{{ editingRenewal ? '编辑续费记录' : '新增续费记录' }}</h4>
            <button class="modal-close" @click="closeRenewalForm">
              <X :size="18" />
            </button>
          </div>

          <div class="sub-modal-content">
            <form @submit.prevent="saveRenewal">
              <div class="form-row">
                <div class="form-group">
                  <label>续费日期 *</label>
                  <input
                    type="date"
                    v-model="renewalForm.renewal_date"
                    required
                    :max="new Date().toISOString().split('T')[0]"
                  />
                </div>
                <div class="form-group">
                  <label>续费金额 *</label>
                  <input
                    type="number"
                    v-model.number="renewalForm.renewal_amount"
                    placeholder="0"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>续费周期 *</label>
                  <input
                    type="text"
                    v-model="renewalForm.renewal_period"
                    placeholder="例如：6个月"
                    required
                  />
                </div>
                <div class="form-group">
                  <label>续费类型 *</label>
                  <select v-model="renewalForm.renewal_type" required>
                    <option value="">请选择续费类型</option>
                    <option value="正常续费">正常续费</option>
                    <option value="补充续费">补充续费</option>
                    <option value="特殊续费">特殊续费</option>
                  </select>
                </div>
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>付款方式 *</label>
                  <select v-model="renewalForm.payment_method" required>
                    <option value="">请选择付款方式</option>
                    <option value="银行转账">银行转账</option>
                    <option value="支付宝">支付宝</option>
                    <option value="微信">微信</option>
                    <option value="其他">其他</option>
                  </select>
                </div>
                <div class="form-group">
                  <label>收款确认 *</label>
                  <select v-model="renewalForm.payment_confirmed" required>
                    <option value="">请选择确认状态</option>
                    <option value="已确认">已确认</option>
                    <option value="待确认">待确认</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label>备注</label>
                <textarea
                  v-model="renewalForm.remarks"
                  placeholder="请输入续费相关备注信息..."
                  rows="3"
                  maxlength="500"
                ></textarea>
              </div>

              <div class="form-actions">
                <button type="button" class="action-btn action-btn--secondary" @click="closeRenewalForm">
                  取消
                </button>
                <button type="submit" class="action-btn action-btn--primary">
                  {{ editingRenewal ? '更新' : '创建' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { X, Plus, Edit, Trash2, DollarSign, Calendar } from 'lucide-vue-next'
import { mockRenewalRecords, type RenewalRecord, type Project } from '@/mock/projects'

interface Props {
  projectId: number
  projectInfo: Project
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// 响应式数据
const renewals = ref<RenewalRecord[]>([])
const showCreateRenewal = ref(false)
const editingRenewal = ref<RenewalRecord | null>(null)

const renewalForm = ref({
  renewal_date: '',
  renewal_amount: 0,
  renewal_period: '',
  renewal_type: '',
  payment_method: '',
  payment_confirmed: '',
  remarks: ''
})

// 初始化数据
onMounted(() => {
  loadRenewals()
})

// 计算属性
const totalRenewalAmount = computed(() => {
  return renewals.value.reduce((sum, renewal) => sum + renewal.renewal_amount, 0)
})

const confirmedAmount = computed(() => {
  return renewals.value
    .filter(renewal => renewal.payment_confirmed === '已确认')
    .reduce((sum, renewal) => sum + renewal.renewal_amount, 0)
})

const pendingAmount = computed(() => {
  return renewals.value
    .filter(renewal => renewal.payment_confirmed === '待确认')
    .reduce((sum, renewal) => sum + renewal.renewal_amount, 0)
})

// 方法
const loadRenewals = () => {
  // 模拟从API加载数据
  renewals.value = mockRenewalRecords
    .filter(renewal => renewal.project_id === props.projectId)
    .sort((a, b) => new Date(b.renewal_date).getTime() - new Date(a.renewal_date).getTime())
}

const getRenewalTypeClass = (type: string) => {
  const typeMap: Record<string, string> = {
    '正常续费': 'type-normal',
    '补充续费': 'type-supplement',
    '特殊续费': 'type-special'
  }
  return typeMap[type] || 'type-default'
}

const getConfirmationClass = (status: string) => {
  const statusMap: Record<string, string> = {
    '已确认': 'status-confirmed',
    '待确认': 'status-pending'
  }
  return statusMap[status] || 'status-default'
}

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const handleOverlayClick = () => {
  emit('close')
}

const editRenewal = (renewal: RenewalRecord) => {
  editingRenewal.value = renewal
  renewalForm.value = {
    renewal_date: renewal.renewal_date,
    renewal_amount: renewal.renewal_amount,
    renewal_period: renewal.renewal_period,
    renewal_type: renewal.renewal_type,
    payment_method: renewal.payment_method,
    payment_confirmed: renewal.payment_confirmed,
    remarks: renewal.remarks || ''
  }
}

const deleteRenewal = (renewalId: number) => {
  if (confirm('确定要删除这条续费记录吗？')) {
    renewals.value = renewals.value.filter(renewal => renewal.id !== renewalId)
    console.log('删除续费记录:', renewalId)
  }
}

const closeRenewalForm = () => {
  showCreateRenewal.value = false
  editingRenewal.value = null
  renewalForm.value = {
    renewal_date: '',
    renewal_amount: 0,
    renewal_period: '',
    renewal_type: '',
    payment_method: '',
    payment_confirmed: '',
    remarks: ''
  }
}

const saveRenewal = () => {
  if (editingRenewal.value) {
    // 更新现有续费记录
    const index = renewals.value.findIndex(renewal => renewal.id === editingRenewal.value!.id)
    if (index !== -1) {
      renewals.value[index] = {
        ...renewals.value[index],
        ...renewalForm.value,
        renewal_type: renewalForm.value.renewal_type as '正常续费' | '补充续费' | '特殊续费',
        payment_method: renewalForm.value.payment_method as '银行转账' | '支付宝' | '微信' | '其他',
        payment_confirmed: renewalForm.value.payment_confirmed as '已确认' | '待确认'
      }
    }
    console.log('更新续费记录:', editingRenewal.value.id)
  } else {
    // 创建新续费记录
    const newRenewal: RenewalRecord = {
      id: Date.now(),
      project_id: props.projectId,
      ...renewalForm.value,
      renewal_type: renewalForm.value.renewal_type as '正常续费' | '补充续费' | '特殊续费',
      payment_method: renewalForm.value.payment_method as '银行转账' | '支付宝' | '微信' | '其他',
      payment_confirmed: renewalForm.value.payment_confirmed as '已确认' | '待确认',
      operator: '当前用户', // 实际应用中从用户状态获取
      created_at: new Date().toISOString()
    }
    renewals.value.unshift(newRenewal)
    console.log('创建续费记录:', newRenewal)
  }

  closeRenewalForm()
}
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
  background: var(--color-background);
  border-radius: 8px;
  width: 90%;
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
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.modal-close {
  padding: 4px;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.modal-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.project-info {
  background: var(--color-background-secondary);
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 24px;
}

.project-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.project-info p {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 14px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h5 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn--primary {
  background: var(--color-primary);
  color: white;
}

.action-btn--primary:hover {
  background: var(--color-primary-hover);
}

.action-btn--secondary {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.action-btn--secondary:hover {
  background: var(--color-background-hover);
}

.renewals-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}

.renewal-card {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.renewal-card__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.renewal-date {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.renewal-amount {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-success);
}

.renewal-actions {
  display: flex;
  gap: 8px;
}

.action-btn-small {
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-small--secondary {
  background: var(--color-background-tertiary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.action-btn-small--secondary:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.action-btn-small--danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.action-btn-small--danger:hover {
  background: var(--color-danger);
  color: white;
}

.renewal-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-item .label {
  color: var(--color-text-secondary);
  min-width: 80px;
}

.detail-item .value {
  color: var(--color-text-primary);
  font-weight: 500;
}

.detail-item .value.remarks {
  line-height: 1.5;
}

.type-badge,
.status-badge {
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.type-normal {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.type-supplement {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.type-special {
  background: var(--color-info-light);
  color: var(--color-info);
}

.status-confirmed {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-pending {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.renewal-stats {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stats-item {
  text-align: center;
}

.stats-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.stats-value {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 20px;
}

.sub-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.sub-modal-container {
  background: var(--color-background);
  border-radius: 8px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sub-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
}

.sub-modal-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.sub-modal-content {
  padding: 20px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 14px;
  background: var(--color-background);
  color: var(--color-text-primary);
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .detail-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .renewal-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .renewal-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
