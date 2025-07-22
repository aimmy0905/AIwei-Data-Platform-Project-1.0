<template>
  <div class="customer-profit-details-module">
    <div class="customer-profit-details-module__header">
      <h3 class="customer-profit-details-module__title">客户毛利明细</h3>
      <div class="module-controls">
        <button class="export-btn">
          <component :is="DownloadIcon" :size="16" />
          导出数据
        </button>
      </div>
    </div>

    <div class="customer-profit-details-module__content">
      <!-- 概览统计 -->
      <div class="summary-stats">
        <div class="stat-item">
          <span class="stat-label">总客户数</span>
          <span class="stat-value">{{ customerDetails.length }}家</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">总毛利</span>
          <span class="stat-value">{{ formatCurrency(totalProfit) }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">平均毛利率</span>
          <span class="stat-value">{{ averageProfitMargin.toFixed(1) }}%</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">A级客户</span>
          <span class="stat-value grade-a">{{ gradeACount }}家</span>
        </div>
      </div>

      <!-- 客户表格 -->
      <div class="customer-table">
        <div class="customer-table__header">
          <div class="col-name">客户名称</div>
          <div class="col-industry">行业</div>
          <div class="col-sales">负责销售</div>
          <div class="col-profit">总毛利</div>
          <div class="col-margin">毛利率</div>
          <div class="col-status">状态</div>
          <div class="col-grade">分级</div>
          <div class="col-actions">操作</div>
        </div>

        <div class="customer-table__body">
          <div 
            v-for="customer in displayCustomers"
            :key="customer.id"
            class="customer-row"
            :class="getRowClass(customer.status)"
          >
            <div class="col-name">
              <div class="customer-info">
                <span class="customer-name">{{ customer.customerName }}</span>
                <span class="cooperation-time">{{ formatDate(customer.cooperationStartDate) }}</span>
              </div>
            </div>
            <div class="col-industry">
              <span class="industry-tag">{{ customer.industry }}</span>
            </div>
            <div class="col-sales">
              <span class="sales-person">{{ customer.salesPerson }}</span>
            </div>
            <div class="col-profit">
              <div class="profit-info">
                <span class="profit-value">{{ formatCurrency(customer.totalProfit) }}</span>
                <span class="service-fee">服务费: {{ formatCurrency(customer.totalServiceFee) }}</span>
              </div>
            </div>
            <div class="col-margin">
              <div class="margin-display" :class="getMarginClass(customer.profitMargin)">
                {{ customer.profitMargin.toFixed(1) }}%
              </div>
            </div>
            <div class="col-status">
              <div class="status-badge" :class="getStatusClass(customer.status)">
                {{ getStatusText(customer.status) }}
              </div>
            </div>
            <div class="col-grade">
              <div class="grade-badge" :class="getGradeClass(customer.grade)">
                {{ customer.grade }}级
              </div>
            </div>
            <div class="col-actions">
              <button class="action-btn" @click="viewDetails(customer)">
                详情
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页 -->
      <div class="pagination">
        <button 
          class="pagination-btn" 
          :disabled="currentPage === 1"
          @click="currentPage--"
        >
          上一页
        </button>
        <span class="pagination-info">
          第 {{ currentPage }} 页，共 {{ totalPages }} 页
        </span>
        <button 
          class="pagination-btn"
          :disabled="currentPage === totalPages"
          @click="currentPage++"
        >
          下一页
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Download } from 'lucide-vue-next'
import type { CustomerProfitDetail } from '@/types'

interface Props {
  customerDetails: CustomerProfitDetail[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  customerClick: [customer: CustomerProfitDetail]
  export: []
}>()

const DownloadIcon = Download
const currentPage = ref(1)
const pageSize = 10

const totalPages = computed(() => Math.ceil(props.customerDetails.length / pageSize))

const displayCustomers = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  const end = start + pageSize
  return props.customerDetails.slice(start, end)
})

const totalProfit = computed(() => {
  return props.customerDetails.reduce((sum, customer) => sum + customer.totalProfit, 0)
})

const averageProfitMargin = computed(() => {
  if (props.customerDetails.length === 0) return 0
  const totalMargin = props.customerDetails.reduce((sum, customer) => sum + customer.profitMargin, 0)
  return totalMargin / props.customerDetails.length
})

const gradeACount = computed(() => {
  return props.customerDetails.filter(customer => customer.grade === 'A').length
})

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
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  })
}

const getRowClass = (status: string) => {
  return `row-${status}`
}

const getMarginClass = (margin: number) => {
  if (margin >= 30) return 'margin-excellent'
  if (margin >= 20) return 'margin-good'
  if (margin >= 10) return 'margin-warning'
  return 'margin-danger'
}

const getStatusClass = (status: 'active' | 'at_risk' | 'churned') => {
  return `status-${status.replace('_', '-')}`
}

const getStatusText = (status: 'active' | 'at_risk' | 'churned') => {
  const statusMap = {
    active: '正常',
    at_risk: '风险',
    churned: '流失'
  }
  return statusMap[status]
}

const getGradeClass = (grade: 'A' | 'B' | 'C') => {
  return `grade-${grade.toLowerCase()}`
}

const viewDetails = (customer: CustomerProfitDetail) => {
  emit('customerClick', customer)
}
</script>

<style scoped>
.customer-profit-details-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.customer-profit-details-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.customer-profit-details-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: #1890ff;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.2s;
}

.export-btn:hover {
  background: #40a9ff;
}

.summary-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 14px;
  color: #8c8c8c;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.stat-value.grade-a {
  color: #52c41a;
}

.customer-table {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 16px;
}

.customer-table__header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr 1fr 1fr 1fr 1fr;
  background: #fafafa;
  padding: 16px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #8c8c8c;
  border-bottom: 1px solid #f0f0f0;
}

.customer-table__body {
  background: #fff;
}

.customer-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr 1fr 1fr 1fr 1fr;
  padding: 16px 12px;
  border-bottom: 1px solid #f5f5f5;
  align-items: center;
  transition: background-color 0.2s;
}

.customer-row:hover {
  background: #fafafa;
}

.customer-row:last-child {
  border-bottom: none;
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

.cooperation-time {
  font-size: 12px;
  color: #8c8c8c;
}

.industry-tag {
  display: inline-block;
  padding: 2px 8px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 12px;
  font-size: 12px;
}

.sales-person {
  font-size: 13px;
  color: #595959;
}

.profit-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profit-value {
  font-weight: 600;
  color: #262626;
  font-size: 14px;
}

.service-fee {
  font-size: 12px;
  color: #8c8c8c;
}

.margin-display {
  font-weight: 600;
  font-size: 14px;
}

.margin-display.margin-excellent {
  color: #52c41a;
}

.margin-display.margin-good {
  color: #1890ff;
}

.margin-display.margin-warning {
  color: #faad14;
}

.margin-display.margin-danger {
  color: #ff4d4f;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  text-align: center;
}

.status-badge.status-active {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.status-at-risk {
  background: #fff7e6;
  color: #fa8c16;
}

.status-badge.status-churned {
  background: #fff2f0;
  color: #ff4d4f;
}

.grade-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  margin: 0 auto;
}

.grade-badge.grade-a {
  background: #52c41a;
  color: #fff;
}

.grade-badge.grade-b {
  background: #1890ff;
  color: #fff;
}

.grade-badge.grade-c {
  background: #faad14;
  color: #fff;
}

.action-btn {
  padding: 4px 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #595959;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.action-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  padding: 16px 0;
}

.pagination-btn {
  padding: 6px 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  color: #595959;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  border-color: #40a9ff;
  color: #40a9ff;
}

.pagination-btn:disabled {
  color: #d9d9d9;
  cursor: not-allowed;
  border-color: #f0f0f0;
}

.pagination-info {
  font-size: 14px;
  color: #8c8c8c;
}

@media (max-width: 1200px) {
  .customer-table__header,
  .customer-row {
    grid-template-columns: 2fr 1fr 1fr 1.2fr 0.8fr 0.8fr 0.8fr 0.8fr;
    font-size: 12px;
  }
}

@media (max-width: 768px) {
  .customer-profit-details-module {
    padding: 16px;
  }

  .customer-profit-details-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .summary-stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .customer-table {
    overflow-x: auto;
  }

  .customer-table__header,
  .customer-row {
    min-width: 800px;
  }
}
</style>