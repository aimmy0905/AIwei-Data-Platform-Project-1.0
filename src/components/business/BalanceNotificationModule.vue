<template>
  <div class="balance-notification-module">
    <div class="module-header">
      <div class="header-left">
        <h3 class="module-title">余额通知</h3>
        <p class="module-subtitle">客户账户余额监控与预警</p>
      </div>
      <div class="header-right">
        <button class="refresh-btn" @click="refreshData">
          <span class="refresh-icon">🔄</span>
          刷新数据
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载余额数据...</p>
    </div>

    <div v-else class="balance-content">
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>客户名称</th>
              <th>客户分级</th>
              <th>账户余额</th>
              <th>过去7天日均花费</th>
              <th>预计使用天数</th>
              <th>状态</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="customer in balanceData" :key="customer.customerId" :class="['data-row', getRowClass(customer.status)]">
              <td class="customer-name">
                <div class="customer-info">
                  <span class="name">{{ customer.customerName }}</span>
                  <span class="id">#{{ customer.customerId }}</span>
                </div>
              </td>
              <td>
                <span :class="['grade-badge', `grade-${customer.customerGrade.toLowerCase()}`]">
                  {{ customer.customerGrade }}
                </span>
              </td>
              <td class="balance-amount">
                <span class="currency">$</span>
                <span class="amount">{{ formatCurrency(customer.accountBalance) }}</span>
              </td>
              <td class="daily-spend">
                <span class="currency">$</span>
                <span class="amount">{{ formatCurrency(customer.avgDailySpend) }}</span>
              </td>
              <td class="estimated-days">
                <span :class="['days-number', getDaysClass(customer.estimatedDays)]">
                  {{ customer.estimatedDays }}
                </span><span class="days-text">天</span>
              </td>
              <td>
                <span :class="['status-badge', `status-${customer.status}`]">
                  {{ getStatusText(customer.status) }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>


    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

// 客户余额数据接口
interface CustomerBalanceData {
  customerId: string
  customerName: string
  customerGrade: 'A+' | 'A' | 'B+' | 'B' | 'C'
  accountBalance: number
  avgDailySpend: number
  estimatedDays: number
  status: 'critical' | 'warning' | 'normal'
}

const loading = ref(false)
const balanceData = ref<CustomerBalanceData[]>([])

// 模拟数据
const mockBalanceData: CustomerBalanceData[] = [
  {
    customerId: 'C001',
    customerName: '星光电商',
    customerGrade: 'A+',
    accountBalance: 15420.50,
    avgDailySpend: 1250.80,
    estimatedDays: 12,
    status: 'warning'
  },
  {
    customerId: 'C002',
    customerName: '蓝海科技',
    customerGrade: 'A',
    accountBalance: 8750.20,
    avgDailySpend: 980.45,
    estimatedDays: 9,
    status: 'critical'
  },
  {
    customerId: 'C003',
    customerName: '创新工厂',
    customerGrade: 'B+',
    accountBalance: 25680.75,
    avgDailySpend: 850.30,
    estimatedDays: 30,
    status: 'normal'
  },
  {
    customerId: 'C004',
    customerName: '智能家居',
    customerGrade: 'A',
    accountBalance: 6420.90,
    avgDailySpend: 720.15,
    estimatedDays: 9,
    status: 'critical'
  },
  {
    customerId: 'C005',
    customerName: '绿色能源',
    customerGrade: 'B',
    accountBalance: 18950.40,
    avgDailySpend: 650.80,
    estimatedDays: 29,
    status: 'normal'
  },
  {
    customerId: 'C006',
    customerName: '时尚品牌',
    customerGrade: 'A+',
    accountBalance: 12300.25,
    avgDailySpend: 1100.50,
    estimatedDays: 11,
    status: 'warning'
  }
]

// 加载数据
const loadBalanceData = async () => {
  try {
    loading.value = true
    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 800))
    balanceData.value = mockBalanceData
  } catch (error) {
    console.error('Failed to load balance data:', error)
  } finally {
    loading.value = false
  }
}

// 刷新数据
const refreshData = () => {
  loadBalanceData()
}

// 格式化货币
const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })
}

// 获取行样式类
const getRowClass = (status: string): string => {
  return `row-${status}`
}

// 获取天数样式类
const getDaysClass = (days: number): string => {
  if (days <= 7) return 'critical'
  if (days <= 14) return 'warning'
  return 'normal'
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusMap = {
    critical: '紧急',
    warning: '预警',
    normal: '正常'
  }
  return statusMap[status as keyof typeof statusMap] || '未知'
}



// 组件挂载时加载数据
onMounted(() => {
  loadBalanceData()
})
</script>

<style scoped>
.balance-notification-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 0 24px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 24px;
  padding-bottom: 16px;
}

.header-left .module-title {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.header-left .module-subtitle {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  color: #0369a1;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.refresh-btn:hover {
  background: #e0f2fe;
  border-color: #7dd3fc;
}

.refresh-icon {
  font-size: 12px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-container p {
  color: #8c8c8c;
  font-size: 14px;
  margin: 0;
}

.balance-content {
  padding: 0 24px 24px 24px;
}

.data-table-wrapper {
  overflow-x: auto;
  margin-bottom: 24px;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  border: 1px solid #e8e8e8;
}

.data-table th {
  background: #f5f5f5;
  padding: 8px 12px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  border-bottom: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  white-space: nowrap;
}

.data-table th:last-child {
  border-right: none;
}

.data-table td {
  padding: 8px 12px;
  border-bottom: 1px solid #e8e8e8;
  border-right: 1px solid #e8e8e8;
  text-align: center;
  vertical-align: middle;
}

.data-table td:last-child {
  border-right: none;
}

.data-row:nth-child(even) {
  background: #fafafa;
}

.data-row:hover {
  background: #e6f7ff;
}

.row-critical {
  background: rgba(239, 68, 68, 0.05);
}

.row-warning {
  background: rgba(245, 158, 11, 0.05);
}

.customer-name {
  text-align: left !important;
}

.customer-info {
  min-width: 120px;
}

.customer-info .name {
  font-weight: 500;
  color: #262626;
  margin-bottom: 2px;
  display: block;
  font-size: 13px;
}

.customer-info .id {
  font-size: 11px;
  color: #8c8c8c;
}

.grade-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
}

.grade-a\+ {
  background: #f0f9ff;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.grade-a {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #bbf7d0;
}

.grade-b\+ {
  background: #fef3c7;
  color: #92400e;
  border: 1px solid #fde68a;
}

.grade-b {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.grade-c {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.balance-amount,
.daily-spend {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  font-size: 12px;
}

.currency {
  color: #8c8c8c;
  margin-right: 1px;
  font-size: 11px;
}

.amount {
  font-weight: 500;
  color: #262626;
}

.estimated-days {
  text-align: center !important;
}

.days-number {
  font-weight: 600;
  font-size: 13px;
}

.days-number.critical {
  color: #ff4d4f;
}

.days-number.warning {
  color: #fa8c16;
}

.days-number.normal {
  color: #52c41a;
}

.days-text {
  color: #8c8c8c;
  font-size: 11px;
  margin-left: 1px;
}

.status-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 11px;
  font-weight: 500;
}

.status-critical {
  background: #fff2f0;
  color: #ff4d4f;
  border: 1px solid #ffccc7;
}

.status-warning {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.status-normal {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}



/* 响应式设计 */
@media (max-width: 768px) {
  .module-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .balance-table {
    font-size: 12px;
  }

  .balance-table th,
  .balance-table td {
    padding: 8px 12px;
  }


}
</style>
