<template>
  <div class="renewal-customer-list-module">
    <div class="renewal-customer-list-module__header">
      <h3 class="renewal-customer-list-module__title">续费客户名单</h3>
      <div class="header-controls">
        <div class="status-filter">
          <button
            v-for="status in statusOptions"
            :key="status.value"
            class="status-filter-btn"
            :class="{ 'status-filter-btn--active': currentStatus === status.value }"
            @click="currentStatus = status.value"
          >
            {{ status.label }}
            <span class="count-badge">{{ getStatusCount(status.value) }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="renewal-customer-list-module__content">
      <!-- 统计概览 -->
      <div class="renewal-stats">
        <div class="stat-card">
          <div class="stat-card__value">{{ totalCustomers }}</div>
          <div class="stat-card__label">待续费客户</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">{{ formatCurrency(totalRenewalValue) }}</div>
          <div class="stat-card__label">预估续费金额</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">{{ averageRenewalProbability.toFixed(1) }}%</div>
          <div class="stat-card__label">平均续费概率</div>
        </div>
        <div class="stat-card">
          <div class="stat-card__value">{{ highPriorityCount }}</div>
          <div class="stat-card__label">高优先级客户</div>
        </div>
      </div>

      <!-- 客户列表 -->
      <div class="customer-list">
        <div class="customer-list__header">
          <div class="col-name">客户名称</div>
          <div class="col-end-date">合同到期</div>
          <div class="col-status">续费状态</div>
          <div class="col-revenue">去年收入</div>
          <div class="col-renewal-value">预估续费额</div>
          <div class="col-probability">续费概率</div>
          <div class="col-sales">负责销售</div>
          <div class="col-priority">优先级</div>
          <div class="col-actions">操作</div>
        </div>

        <div class="customer-list__body">
          <div 
            v-for="customer in filteredCustomers"
            :key="customer.id"
            class="customer-item"
            :class="getPriorityClass(customer.priority)"
          >
            <div class="col-name">
              <div class="customer-info">
                <span class="customer-name">{{ customer.customerName }}</span>
                <span class="days-left">{{ getDaysLeft(customer.contractEndDate) }}天后到期</span>
              </div>
            </div>
            <div class="col-end-date">
              <span class="end-date" :class="getEndDateClass(customer.contractEndDate)">
                {{ formatDate(customer.contractEndDate) }}
              </span>
            </div>
            <div class="col-status">
              <div class="status-badge" :class="getStatusBadgeClass(customer.renewalStatus)">
                {{ getStatusText(customer.renewalStatus) }}
              </div>
            </div>
            <div class="col-revenue">
              <span class="revenue-value">{{ formatCurrency(customer.lastYearRevenue) }}</span>
            </div>
            <div class="col-renewal-value">
              <span class="renewal-value">{{ formatCurrency(customer.estimatedRenewalValue) }}</span>
            </div>
            <div class="col-probability">
              <div class="probability-display">
                <div class="probability-bar">
                  <div 
                    class="probability-fill"
                    :class="getProbabilityClass(customer.renewalProbability)"
                    :style="{ width: `${customer.renewalProbability}%` }"
                  ></div>
                </div>
                <span class="probability-text">{{ customer.renewalProbability }}%</span>
              </div>
            </div>
            <div class="col-sales">
              <span class="sales-person">{{ customer.salesPerson }}</span>
            </div>
            <div class="col-priority">
              <div class="priority-badge" :class="getPriorityBadgeClass(customer.priority)">
                {{ getPriorityText(customer.priority) }}
              </div>
            </div>
            <div class="col-actions">
              <button class="action-btn primary" @click="followUp(customer)">
                跟进
              </button>
              <button class="action-btn secondary" @click="viewDetails(customer)">
                详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { RenewalCustomerData } from '@/types'

interface Props {
  renewalCustomers: RenewalCustomerData[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  followUp: [customer: RenewalCustomerData]
  viewDetails: [customer: RenewalCustomerData]
}>()

const currentStatus = ref<string>('all')

const statusOptions = [
  { value: 'all', label: '全部' },
  { value: 'pending', label: '待联系' },
  { value: 'contacted', label: '已联系' },
  { value: 'negotiating', label: '商谈中' },
  { value: 'confirmed', label: '已确认' },
  { value: 'declined', label: '已拒绝' }
]

const filteredCustomers = computed(() => {
  if (currentStatus.value === 'all') {
    return props.renewalCustomers
  }
  return props.renewalCustomers.filter(customer => customer.renewalStatus === currentStatus.value)
})

const totalCustomers = computed(() => props.renewalCustomers.length)

const totalRenewalValue = computed(() => {
  return props.renewalCustomers.reduce((sum, customer) => sum + customer.estimatedRenewalValue, 0)
})

const averageRenewalProbability = computed(() => {
  if (props.renewalCustomers.length === 0) return 0
  const totalProbability = props.renewalCustomers.reduce((sum, customer) => sum + customer.renewalProbability, 0)
  return totalProbability / props.renewalCustomers.length
})

const highPriorityCount = computed(() => {
  return props.renewalCustomers.filter(customer => customer.priority === 'high').length
})

const getStatusCount = (status: string) => {
  if (status === 'all') return props.renewalCustomers.length
  return props.renewalCustomers.filter(customer => customer.renewalStatus === status).length
}

const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`
  } else {
    return `¥${value.toLocaleString()}`
  }
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit' 
  })
}

const getDaysLeft = (endDate: string): number => {
  const today = new Date()
  const end = new Date(endDate)
  const diffTime = end.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

const getEndDateClass = (endDate: string) => {
  const daysLeft = getDaysLeft(endDate)
  if (daysLeft <= 7) return 'urgent'
  if (daysLeft <= 30) return 'warning'
  return 'normal'
}

const getPriorityClass = (priority: string) => {
  return `priority-${priority}`
}

const getStatusBadgeClass = (status: string) => {
  return `status-${status}`
}

const getStatusText = (status: string) => {
  const statusMap = {
    pending: '待联系',
    contacted: '已联系',
    negotiating: '商谈中',
    confirmed: '已确认',
    declined: '已拒绝'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getProbabilityClass = (probability: number) => {
  if (probability >= 80) return 'probability-high'
  if (probability >= 50) return 'probability-medium'
  return 'probability-low'
}

const getPriorityBadgeClass = (priority: string) => {
  return `priority-badge-${priority}`
}

const getPriorityText = (priority: string) => {
  const priorityMap = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return priorityMap[priority as keyof typeof priorityMap] || priority
}

const followUp = (customer: RenewalCustomerData) => {
  emit('followUp', customer)
}

const viewDetails = (customer: RenewalCustomerData) => {
  emit('viewDetails', customer)
}
</script>

<style scoped>
.renewal-customer-list-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.renewal-customer-list-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.renewal-customer-list-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.status-filter {
  display: flex;
  gap: 4px;
}

.status-filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  color: #595959;
  cursor: pointer;
  font-size: 13px;
  transition: all 0.2s;
}

.status-filter-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.status-filter-btn--active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.count-badge {
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 11px;
  min-width: 16px;
  text-align: center;
}

.status-filter-btn:not(.status-filter-btn--active) .count-badge {
  background: #f0f0f0;
  color: #8c8c8c;
}

.renewal-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.stat-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.stat-card__value {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 8px;
}

.stat-card__label {
  font-size: 14px;
  color: #8c8c8c;
}

.customer-list {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.customer-list__header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 0.8fr 1.2fr;
  background: #fafafa;
  padding: 16px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #8c8c8c;
  border-bottom: 1px solid #f0f0f0;
}

.customer-list__body {
  background: #fff;
}

.customer-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr 1fr 1fr 0.8fr 1.2fr;
  padding: 16px 12px;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
  transition: background-color 0.2s;
}

.customer-item:hover {
  background: #fafafa;
}

.customer-item:last-child {
  border-bottom: none;
}

.customer-item.priority-high {
  border-left: 4px solid #ff4d4f;
}

.customer-item.priority-medium {
  border-left: 4px solid #faad14;
}

.customer-item.priority-low {
  border-left: 4px solid #52c41a;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.customer-name {
  font-weight: 600;
  color: #262626;
  font-size: 14px;
}

.days-left {
  font-size: 12px;
  color: #8c8c8c;
}

.end-date.urgent {
  color: #ff4d4f;
  font-weight: 600;
}

.end-date.warning {
  color: #faad14;
  font-weight: 600;
}

.end-date.normal {
  color: #8c8c8c;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.status-badge.status-pending {
  background: #fff2f0;
  color: #ff4d4f;
}

.status-badge.status-contacted {
  background: #e6f7ff;
  color: #1890ff;
}

.status-badge.status-negotiating {
  background: #fff7e6;
  color: #fa8c16;
}

.status-badge.status-confirmed {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.status-declined {
  background: #f5f5f5;
  color: #8c8c8c;
}

.revenue-value,
.renewal-value {
  font-weight: 600;
  color: #262626;
  font-size: 13px;
}

.probability-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.probability-bar {
  flex: 1;
  height: 6px;
  background: #f5f5f5;
  border-radius: 3px;
  overflow: hidden;
}

.probability-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.probability-fill.probability-high {
  background: #52c41a;
}

.probability-fill.probability-medium {
  background: #faad14;
}

.probability-fill.probability-low {
  background: #ff4d4f;
}

.probability-text {
  font-size: 12px;
  font-weight: 600;
  color: #595959;
  min-width: 30px;
}

.sales-person {
  font-size: 13px;
  color: #595959;
}

.priority-badge {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
  margin: 0 auto;
}

.priority-badge-high {
  background: #ff4d4f;
  color: #fff;
}

.priority-badge-medium {
  background: #faad14;
  color: #fff;
}

.priority-badge-low {
  background: #52c41a;
  color: #fff;
}

.col-actions {
  display: flex;
  gap: 6px;
  justify-content: center;
}

.action-btn {
  padding: 4px 8px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn.primary {
  background: #1890ff;
  border: 1px solid #1890ff;
  color: #fff;
}

.action-btn.primary:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

.action-btn.secondary {
  background: #fff;
  border: 1px solid #d9d9d9;
  color: #595959;
}

.action-btn.secondary:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

@media (max-width: 1400px) {
  .customer-list__header,
  .customer-item {
    grid-template-columns: 1.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.8fr 0.6fr 1fr;
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .renewal-customer-list-module {
    padding: 16px;
  }

  .renewal-customer-list-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .status-filter {
    flex-wrap: wrap;
    justify-content: center;
  }

  .renewal-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .customer-list {
    overflow-x: auto;
  }

  .customer-list__header,
  .customer-item {
    min-width: 1000px;
  }
}
</style>