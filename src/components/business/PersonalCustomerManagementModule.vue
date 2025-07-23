<template>
  <div class="personal-customer-management-module">
    <div class="customer-management-module__header">
      <h3 class="customer-management-module__title">客户管理</h3>
      <div class="customer-management-module__controls">
        <div class="category-filter">
          <button
            v-for="category in categoryOptions"
            :key="category.value"
            class="category-filter-btn"
            :class="{ 'category-filter-btn--active': currentCategory === category.value }"
            @click="currentCategory = category.value"
          >
            {{ category.label }}
            <span class="category-count">{{ getCategoryCount(category.value) }}</span>
          </button>
        </div>
      </div>
    </div>

    <div class="customer-management-module__content">
      <!-- 客户分类统计 -->
      <div class="customer-categories-stats">
        <div 
          v-for="categoryData in customerCategories"
          :key="categoryData.categoryType"
          class="category-stat-card"
          :class="getCategoryCardClass(categoryData.categoryType)"
        >
          <div class="category-stat-card__header">
            <component :is="getCategoryIcon(categoryData.categoryType)" :size="20" />
            <span class="category-name">{{ getCategoryName(categoryData.categoryType) }}</span>
          </div>
          <div class="category-stat-card__content">
            <div class="stat-item">
              <span class="stat-label">客户数</span>
              <span class="stat-value">{{ categoryData.customerCount }}家</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">服务费</span>
              <span class="stat-value">{{ formatCurrency(categoryData.totalServiceFee) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">毛利率</span>
              <span class="stat-value" :class="getProfitMarginClass(categoryData.averageProfitMargin)">
                {{ categoryData.averageProfitMargin.toFixed(1) }}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 客户详情列表 -->
      <div class="customer-details-list">
        <div class="customer-details-list__header">
          <h4 class="customer-list-title">{{ getCurrentCategoryName() }}客户列表</h4>
          <button class="add-customer-btn" @click="$emit('add-customer')">
            <Plus :size="16" />
            添加客户
          </button>
        </div>

        <div class="customer-table">
          <div class="customer-table__header">
            <div class="col-name">客户名称</div>
            <div class="col-industry">行业</div>
            <div class="col-profit">毛利</div>
            <div class="col-risk">风险等级</div>
            <div class="col-contact">最后联系</div>
            <div class="col-actions">操作</div>
          </div>

          <div class="customer-table__body">
            <div 
              v-for="customer in filteredCustomers"
              :key="customer.id"
              class="customer-row"
              :class="getCustomerRowClass(customer.category)"
            >
              <div class="col-name">
                <div class="customer-info">
                  <span class="customer-name">{{ customer.customerName }}</span>
                  <div class="customer-platforms">
                    <span 
                      v-for="platform in customer.platforms.slice(0, 3)"
                      :key="platform"
                      class="platform-tag"
                    >
                      {{ platform }}
                    </span>
                    <span v-if="customer.platforms.length > 3" class="more-platforms">
                      +{{ customer.platforms.length - 3 }}
                    </span>
                  </div>
                </div>
              </div>
              <div class="col-industry">
                <span class="industry-tag">{{ customer.industry }}</span>
              </div>
              <div class="col-profit">
                <div class="profit-info">
                  <span class="profit-value">{{ formatCurrency(customer.totalProfit) }}</span>
                  <span class="profit-margin" :class="getProfitMarginClass(customer.profitMargin)">
                    {{ customer.profitMargin.toFixed(1) }}%
                  </span>
                </div>
              </div>
              <div class="col-risk">
                <div class="risk-badge" :class="getRiskBadgeClass(customer.churnRisk)">
                  {{ getRiskText(customer.churnRisk) }}
                </div>
              </div>
              <div class="col-contact">
                <div class="contact-info">
                  <span class="contact-date">{{ formatDate(customer.lastContactDate) }}</span>
                  <span class="next-followup" :class="getFollowupClass(customer.nextFollowUpDate)">
                    下次: {{ formatDate(customer.nextFollowUpDate) }}
                  </span>
                </div>
              </div>
              <div class="col-actions">
                <div class="action-buttons">
                  <button class="action-btn primary" @click="handleContact(customer)">
                    联系
                  </button>
                  <button class="action-btn secondary" @click="handleViewDetails(customer)">
                    详情
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Crown, TrendingUp, Shield, AlertTriangle, Plus } from 'lucide-vue-next'
import type { PersonalCustomerCategory, PersonalCustomerDetail } from '@/types'

interface Props {
  customerCategories: PersonalCustomerCategory[]
  customerDetails: PersonalCustomerDetail[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<{
  'add-customer': []
  'contact-customer': [customer: PersonalCustomerDetail]
  'view-customer-details': [customer: PersonalCustomerDetail]
}>()

const currentCategory = ref<string>('all')

const categoryOptions = [
  { value: 'all', label: '全部' },
  { value: 'key', label: '重点客户' },
  { value: 'growth', label: '成长客户' },
  { value: 'maintenance', label: '维护客户' },
  { value: 'risk', label: '风险客户' }
]

const filteredCustomers = computed(() => {
  if (currentCategory.value === 'all') {
    return props.customerDetails
  }
  return props.customerDetails.filter(customer => customer.category === currentCategory.value)
})

const formatCurrency = (value: number): string => {
  if (value >= 10000) {
    return `¥${(value / 10000).toFixed(1)}万`
  }
  return `¥${value.toLocaleString()}`
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN', { 
    month: '2-digit', 
    day: '2-digit' 
  })
}

const getCategoryCount = (category: string) => {
  if (category === 'all') return props.customerDetails.length
  return props.customerDetails.filter(customer => customer.category === category).length
}

const getCategoryName = (categoryType: string) => {
  const nameMap = {
    key: '重点客户',
    growth: '成长客户', 
    maintenance: '维护客户',
    risk: '风险客户'
  }
  return nameMap[categoryType as keyof typeof nameMap] || categoryType
}

const getCurrentCategoryName = () => {
  const option = categoryOptions.find(opt => opt.value === currentCategory.value)
  return option?.label || '全部'
}

const getCategoryIcon = (categoryType: string) => {
  const iconMap = {
    key: Crown,
    growth: TrendingUp,
    maintenance: Shield,
    risk: AlertTriangle
  }
  return iconMap[categoryType as keyof typeof iconMap] || Shield
}

const getCategoryCardClass = (categoryType: string) => {
  return `category-stat-card--${categoryType}`
}

const getCustomerRowClass = (category: string) => {
  return `customer-row--${category}`
}

const getProfitMarginClass = (margin: number) => {
  if (margin >= 30) return 'margin-excellent'
  if (margin >= 20) return 'margin-good'
  if (margin >= 10) return 'margin-average'
  return 'margin-poor'
}

const getRiskBadgeClass = (risk: string) => {
  return `risk-badge--${risk}`
}

const getRiskText = (risk: string) => {
  const textMap = {
    high: '高风险',
    medium: '中风险',
    low: '低风险'
  }
  return textMap[risk as keyof typeof textMap] || risk
}

const getFollowupClass = (dateString: string) => {
  const followupDate = new Date(dateString)
  const today = new Date()
  const diffDays = Math.ceil((followupDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  
  if (diffDays < 0) return 'followup-overdue'
  if (diffDays <= 3) return 'followup-urgent'
  return 'followup-normal'
}

const handleContact = (customer: PersonalCustomerDetail) => {
  emit('contact-customer', customer)
}

const handleViewDetails = (customer: PersonalCustomerDetail) => {
  emit('view-customer-details', customer)
}
</script>

<style scoped>
.personal-customer-management-module {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 24px;
  margin-bottom: 24px;
}

.customer-management-module__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.customer-management-module__title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.category-filter {
  display: flex;
  gap: 4px;
}

.category-filter-btn {
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

.category-filter-btn:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.category-filter-btn--active {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.category-count {
  background: rgba(255, 255, 255, 0.2);
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 11px;
  min-width: 16px;
  text-align: center;
}

.category-filter-btn:not(.category-filter-btn--active) .category-count {
  background: #f0f0f0;
  color: #8c8c8c;
}

.customer-management-module__content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.customer-categories-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.category-stat-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
}

.category-stat-card--key {
  border-left: 4px solid #722ed1;
}

.category-stat-card--growth {
  border-left: 4px solid #52c41a;
}

.category-stat-card--maintenance {
  border-left: 4px solid #1890ff;
}

.category-stat-card--risk {
  border-left: 4px solid #ff4d4f;
}

.category-stat-card__header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  color: #262626;
}

.category-name {
  font-size: 14px;
  font-weight: 600;
}

.category-stat-card__content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.stat-label {
  font-size: 13px;
  color: #8c8c8c;
}

.stat-value {
  font-size: 13px;
  font-weight: 600;
  color: #262626;
}

.customer-details-list__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.customer-list-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.add-customer-btn {
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

.add-customer-btn:hover {
  background: #40a9ff;
}

.customer-table {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.customer-table__header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr 1fr;
  background: #fafafa;
  padding: 12px 16px;
  font-size: 13px;
  font-weight: 600;
  color: #8c8c8c;
  border-bottom: 1px solid #f0f0f0;
}

.customer-table__body {
  background: #fff;
}

.customer-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1.2fr 1fr;
  padding: 16px;
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

.customer-platforms {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
}

.platform-tag {
  padding: 1px 6px;
  background: #e6f7ff;
  color: #1890ff;
  border-radius: 10px;
  font-size: 10px;
}

.more-platforms {
  padding: 1px 6px;
  background: #f0f0f0;
  color: #8c8c8c;
  border-radius: 10px;
  font-size: 10px;
}

.industry-tag {
  padding: 2px 8px;
  background: #f0f0f0;
  color: #595959;
  border-radius: 12px;
  font-size: 12px;
}

.profit-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.profit-value {
  font-weight: 600;
  color: #262626;
  font-size: 13px;
}

.profit-margin {
  font-size: 11px;
  font-weight: 600;
}

.margin-excellent { color: #52c41a; }
.margin-good { color: #1890ff; }
.margin-average { color: #faad14; }
.margin-poor { color: #ff4d4f; }

.risk-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.risk-badge--high {
  background: #fff2f0;
  color: #ff4d4f;
}

.risk-badge--medium {
  background: #fff7e6;
  color: #fa8c16;
}

.risk-badge--low {
  background: #f6ffed;
  color: #52c41a;
}

.contact-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.contact-date {
  font-size: 12px;
  color: #595959;
}

.next-followup {
  font-size: 11px;
  font-weight: 500;
}

.followup-overdue {
  color: #ff4d4f;
}

.followup-urgent {
  color: #fa8c16;
}

.followup-normal {
  color: #52c41a;
}

.action-buttons {
  display: flex;
  gap: 6px;
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

@media (max-width: 768px) {
  .personal-customer-management-module {
    padding: 16px;
  }

  .customer-management-module__header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .category-filter {
    flex-wrap: wrap;
    justify-content: center;
  }

  .customer-categories-stats {
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