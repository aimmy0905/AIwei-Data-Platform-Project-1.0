<template>
  <div class="account-balance-module">
    <div class="balance-module__header">
      <h3 class="balance-module__title">账户余额监控</h3>
      <div class="balance-module__controls">
        <div class="balance-summary">
          <span class="summary-item">
            <span class="summary-label">预警账户:</span>
            <span class="summary-value warning">{{ balanceData.summary.warningAccounts }}个</span>
          </span>
          <span class="summary-item">
            <span class="summary-label">总余额:</span>
            <span class="summary-value">{{ formatCurrency(balanceData.summary.totalBalance) }}</span>
          </span>
        </div>
        <button class="refresh-btn" @click="$emit('refresh-data')" :disabled="loading">
          <RotateCcw :size="16" />
          刷新数据
        </button>
      </div>
    </div>

    <div class="balance-module__content">
      <!-- 余额预警统计 -->
      <div class="balance-statistics">
        <div class="stats-cards">
          <div class="stats-card">
            <div class="stats-card__header">
              <AlertTriangle :size="20" />
              <span>预警账户数</span>
            </div>
            <div class="stats-card__content">
              <div class="stats-value warning-value">{{ balanceData.summary.warningAccounts }}</div>
              <div class="stats-description">占总账户 {{ getWarningPercentage() }}%</div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-card__header">
              <Wallet :size="20" />
              <span>总余额</span>
            </div>
            <div class="stats-card__content">
              <div class="stats-value">{{ formatCurrency(balanceData.summary.totalBalance) }}</div>
              <div class="stats-description">{{ balanceData.summary.totalAccounts }}个账户</div>
            </div>
          </div>

          <div class="stats-card">
            <div class="stats-card__header">
              <Clock :size="20" />
              <span>平均剩余天数</span>
            </div>
            <div class="stats-card__content">
              <div class="stats-value">{{ balanceData.summary.averageRemainingDays.toFixed(1) }}天</div>
              <div class="stats-description" :class="getAverageDaysClass()">
                {{ getAverageDaysStatus() }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户账户列表 -->
      <div class="customer-accounts-section">
        <div class="accounts-header">
          <h4>客户账户详情</h4>
          <div class="accounts-controls">
            <div class="filter-controls">
              <select v-model="filterLevel" class="filter-select">
                <option value="all">全部账户</option>
                <option value="critical">严重预警</option>
                <option value="warning">一般预警</option>
                <option value="normal">正常状态</option>
              </select>
            </div>
            <div class="sort-controls">
              <select v-model="sortBy" class="sort-select">
                <option value="estimatedDays">按剩余天数</option>
                <option value="balance">按账户余额</option>
                <option value="spend">按日均花费</option>
                <option value="customerName">按客户名称</option>
              </select>
            </div>
          </div>
        </div>

        <div class="accounts-table-container">
          <div class="accounts-table" v-if="filteredAndSortedAccounts.length > 0">
            <div class="table-header">
              <div class="header-cell customer-name">客户名称</div>
              <div class="header-cell ad-account">广告账户</div>
              <div class="header-cell balance">账户余额</div>
              <div class="header-cell avg-spend">7天平均花费</div>
              <div class="header-cell estimated-days">预计剩余天数</div>
              <div class="header-cell status">状态</div>
              <div class="header-cell actions">操作</div>
            </div>
            
            <div class="table-body">
              <div 
                v-for="account in paginatedAccounts" 
                :key="account.customerId"
                class="table-row"
                :class="getRowClass(account.warningLevel)"
              >
                <div class="table-cell customer-name">
                  <div class="customer-info">
                    <div class="customer-name-text">{{ account.customerName }}</div>
                    <div class="customer-id">ID: {{ account.customerId }}</div>
                  </div>
                </div>
                <div class="table-cell ad-account">
                  <span class="account-code">{{ account.adAccount }}</span>
                </div>
                <div class="table-cell balance">
                  <div class="balance-info">
                    <div class="balance-amount">{{ formatCurrency(account.accountBalance) }}</div>
                    <div class="balance-updated">{{ formatLastUpdated(account.lastUpdated) }}</div>
                  </div>
                </div>
                <div class="table-cell avg-spend">
                  <span class="spend-amount">{{ formatCurrency(account.past7DaysAvgSpend) }}</span>
                </div>
                <div class="table-cell estimated-days">
                  <div class="days-info" :class="getDaysClass(account.estimatedDays)">
                    <span class="days-number">{{ account.estimatedDays.toFixed(1) }}</span>
                    <span class="days-unit">天</span>
                  </div>
                </div>
                <div class="table-cell status">
                  <div class="status-badge" :class="getStatusClass(account.warningLevel)">
                    {{ getStatusText(account.warningLevel) }}
                  </div>
                </div>
                <div class="table-cell actions">
                  <div class="action-buttons">
                    <button 
                      class="action-btn remind-btn"
                      @click="handleRemindCustomer(account)"
                      :disabled="loading"
                    >
                      <Bell :size="14" />
                      提醒
                    </button>
                    <button 
                      class="action-btn detail-btn"
                      @click="handleViewDetails(account)"
                    >
                      <Eye :size="14" />
                      详情
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 无数据状态 -->
          <div v-else class="no-data">
            <div class="no-data-icon">
              <Wallet :size="48" />
            </div>
            <div class="no-data-text">暂无匹配的账户数据</div>
            <div class="no-data-description">请调整筛选条件或刷新数据</div>
          </div>
        </div>

        <!-- 分页控件 -->
        <div class="pagination-controls" v-if="totalPages > 1">
          <button 
            class="page-btn"
            :disabled="currentPage <= 1"  
            @click="currentPage--"
          >
            <ChevronLeft :size="16" />
          </button>
          <span class="page-info">
            第 {{ currentPage }} 页，共 {{ totalPages }} 页
          </span>
          <button 
            class="page-btn"
            :disabled="currentPage >= totalPages"
            @click="currentPage++"
          >
            <ChevronRight :size="16" />
          </button>
        </div>
      </div>

      <!-- 批量操作区域 -->
      <div class="batch-operations" v-if="selectedAccounts.length > 0">
        <div class="batch-info">
          已选择 {{ selectedAccounts.length }} 个账户
        </div>
        <div class="batch-actions">
          <button class="batch-btn" @click="handleBatchRemind">
            <Bell :size="16" />
            批量提醒
          </button>
          <button class="batch-btn" @click="handleBatchExport">
            <Download :size="16" />
            导出数据
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { AlertTriangle, Wallet, Clock, RotateCcw, Bell, Eye, ChevronLeft, ChevronRight, Download } from 'lucide-vue-next'
import type { AccountBalanceData, CustomerAccountBalance } from '@/types'

interface Props {
  balanceData: AccountBalanceData
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'refresh-data': []
  'remind-customer': [account: CustomerAccountBalance]
  'view-details': [account: CustomerAccountBalance]
  'batch-remind': [accounts: CustomerAccountBalance[]]
  'batch-export': [accounts: CustomerAccountBalance[]]
}>()

// 响应式数据
const filterLevel = ref<string>('all')
const sortBy = ref<string>('estimatedDays')
const currentPage = ref(1)
const pageSize = ref(10)
const selectedAccounts = ref<CustomerAccountBalance[]>([])

// 计算属性
const filteredAndSortedAccounts = computed(() => {
  let filtered = props.balanceData.customerAccounts

  // 筛选
  if (filterLevel.value !== 'all') {
    filtered = filtered.filter(account => account.warningLevel === filterLevel.value)
  }

  // 排序
  filtered.sort((a, b) => {
    switch (sortBy.value) {
      case 'estimatedDays':
        return a.estimatedDays - b.estimatedDays
      case 'balance':
        return b.accountBalance - a.accountBalance
      case 'spend':
        return b.past7DaysAvgSpend - a.past7DaysAvgSpend
      case 'customerName':
        return a.customerName.localeCompare(b.customerName)
      default:
        return 0
    }
  })

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredAndSortedAccounts.value.length / pageSize.value)
})

const paginatedAccounts = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredAndSortedAccounts.value.slice(start, end)
})

// 方法
const formatCurrency = (value: number): string => {
  if (value >= 100000) {
    return `$${(value / 1000).toFixed(1)}K`
  } else {
    return `$${value.toLocaleString()}`
  }
}

const formatLastUpdated = (dateString: string): string => {
  const date = new Date(dateString)
  const now = new Date()
  const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
  
  if (diffHours < 1) return '刚刚更新'
  if (diffHours < 24) return `${diffHours}小时前`
  return `${Math.floor(diffHours / 24)}天前`
}

const getWarningPercentage = (): string => {
  const total = props.balanceData.summary.totalAccounts
  const warning = props.balanceData.summary.warningAccounts
  return total > 0 ? ((warning / total) * 100).toFixed(1) : '0'
}

const getAverageDaysClass = () => {
  const days = props.balanceData.summary.averageRemainingDays
  if (days <= 3) return 'status-critical'
  if (days <= 7) return 'status-warning'
  return 'status-normal'
}

const getAverageDaysStatus = () => {
  const days = props.balanceData.summary.averageRemainingDays
  if (days <= 3) return '紧急关注'
  if (days <= 7) return '需要关注'
  return '状态良好'
}

const getRowClass = (warningLevel: string) => {
  return `row-${warningLevel}`
}

const getDaysClass = (days: number) => {
  if (days <= 3) return 'days-critical'
  if (days <= 7) return 'days-warning'
  return 'days-normal'
}

const getStatusClass = (warningLevel: string) => {
  return `status-${warningLevel}`
}

const getStatusText = (warningLevel: string) => {
  const statusMap = {
    critical: '严重预警',
    warning: '一般预警',
    normal: '正常'
  }
  return statusMap[warningLevel as keyof typeof statusMap] || warningLevel
}

const handleRemindCustomer = (account: CustomerAccountBalance) => {
  emit('remind-customer', account)
}

const handleViewDetails = (account: CustomerAccountBalance) => {
  emit('view-details', account)
}

const handleBatchRemind = () => {
  emit('batch-remind', selectedAccounts.value)
}

const handleBatchExport = () => {
  emit('batch-export', selectedAccounts.value)
}
</script>

<style scoped>
.account-balance-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.balance-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.balance-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.balance-module__controls {
  display: flex;
  align-items: center;
  gap: 16px;
}

.balance-summary {
  display: flex;
  gap: 16px;
  font-size: 14px;
}

.summary-item {
  display: flex;
  align-items: center;
  gap: 4px;
}

.summary-label {
  color: #8c8c8c;
}

.summary-value {
  font-weight: 600;
  color: #262626;
}

.summary-value.warning {
  color: #fa8c16;
}

.refresh-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.refresh-btn:hover:not(:disabled) {
  background: #40a9ff;
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.balance-module__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 余额统计卡片 */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.stats-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
}

.stats-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #1890ff;
  font-size: 14px;
  font-weight: 500;
}

.stats-value {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 4px;
}

.stats-value.warning-value {
  color: #fa8c16;
}

.stats-description {
  font-size: 12px;
  color: #8c8c8c;
}

.stats-description.status-critical {
  color: #ff4d4f;
}

.stats-description.status-warning {
  color: #fa8c16;
}

.stats-description.status-normal {
  color: #52c41a;
}

/* 账户列表 */
.accounts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.accounts-header h4 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.accounts-controls {
  display: flex;
  gap: 12px;
}

.filter-select,
.sort-select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  color: #262626;
  font-size: 14px;
  outline: none;
}

.accounts-table-container {
  border-radius: 8px;
  border: 1px solid #f0f0f0;
  overflow: hidden;
}

.accounts-table {
  width: 100%;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.2fr 1.2fr 1fr 0.8fr 1fr;
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.header-cell {
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #595959;
  border-right: 1px solid #f0f0f0;
}

.header-cell:last-child {
  border-right: none;
}

.table-body {
  max-height: 600px;
  overflow-y: auto;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.2fr 1.2fr 1fr 0.8fr 1fr;
  border-bottom: 1px solid #f0f0f0;
  transition: background-color 0.2s;
}

.table-row:hover {
  background: #f9f9f9;
}

.table-row.row-critical {
  background: rgba(255, 77, 79, 0.05);
}

.table-row.row-warning {
  background: rgba(250, 140, 22, 0.05);
}

.table-cell {
  padding: 12px 16px;
  font-size: 14px;
  color: #262626;
  border-right: 1px solid #f0f0f0;
  display: flex;
  align-items: center;
}

.table-cell:last-child {
  border-right: none;
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-name-text {
  font-weight: 500;
}

.customer-id {
  font-size: 12px;
  color: #8c8c8c;
}

.account-code {
  font-family: monospace;
  background: #f5f5f5;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.balance-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.balance-amount {
  font-weight: 600;
}

.balance-updated {
  font-size: 12px;
  color: #8c8c8c;
}

.spend-amount {
  font-weight: 500;
}

.days-info {
  display: flex;
  align-items: center;
  gap: 2px;
  font-weight: 600;
}

.days-info.days-critical {
  color: #ff4d4f;
}

.days-info.days-warning {
  color: #fa8c16;
}

.days-info.days-normal {
  color: #52c41a;
}

.days-unit {
  font-size: 12px;
  color: #8c8c8c;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge.status-critical {
  background: #fff2f0;
  color: #ff4d4f;
}

.status-badge.status-warning {
  background: #fff7e6;
  color: #fa8c16;
}

.status-badge.status-normal {
  background: #f6ffed;
  color: #52c41a;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.remind-btn {
  background: #fa8c16;
  color: #fff;
}

.remind-btn:hover {
  background: #ffa940;
}

.detail-btn {
  background: #1890ff;
  color: #fff;
}

.detail-btn:hover {
  background: #40a9ff;
}

/* 无数据状态 */
.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #8c8c8c;
}

.no-data-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-data-text {
  font-size: 16px;
  font-weight: 500;
  margin-bottom: 8px;
}

.no-data-description {
  font-size: 14px;
}

/* 分页控件 */
.pagination-controls {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
}

.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #40a9ff;
  color: #40a9ff;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #595959;
}

/* 批量操作 */
.batch-operations {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #e6f7ff;
  border: 1px solid #91d5ff;
  border-radius: 6px;
}

.batch-info {
  font-size: 14px;
  color: #1890ff;
  font-weight: 500;
}

.batch-actions {
  display: flex;
  gap: 12px;
}

.batch-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.batch-btn:hover {
  background: #40a9ff;
}

@media (max-width: 1200px) {
  .table-header,
  .table-row {
    grid-template-columns: 2fr 1fr 1fr 1fr 0.8fr 0.8fr 1fr;
  }
}

@media (max-width: 768px) {
  .account-balance-module {
    padding: 16px;
  }

  .balance-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .balance-summary {
    justify-content: space-between;
  }

  .stats-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .accounts-controls {
    flex-direction: column;
    gap: 8px;
  }

  .accounts-table-container {
    overflow-x: auto;
  }

  .table-header,
  .table-row {
    min-width: 800px;
  }

  .batch-operations {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }
}
</style>