<template>
  <div class="customer-detail-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-header__main">
        <div class="breadcrumb">
          <button class="breadcrumb-btn" @click="goBack">
            <ArrowLeft :size="16" />
            返回客户列表
          </button>
        </div>
        <div class="customer-header">
          <div class="customer-avatar-large">
            {{ customerDetail?.cooperationDetails?.customerName?.charAt(0).toUpperCase() }}
          </div>
          <div class="customer-info">
            <h1 class="customer-name">{{ customerDetail?.cooperationDetails?.customerName }}</h1>
            <div class="customer-meta">
              <span class="status-badge" :class="`status-badge--${customerDetail?.cooperationDetails?.customerStatus}`">
                {{ getStatusText(customerDetail?.cooperationDetails?.customerStatus) }}
              </span>
              <span class="grade-badge" :class="`grade-badge--${customerDetail?.cooperationDetails?.customerGrade}`">
                {{ customerDetail?.cooperationDetails?.customerGrade }}级客户
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="page-header__actions">
        <button class="action-btn action-btn--secondary" @click="editCustomer">
          <Edit :size="16" />
          编辑客户
        </button>
        <button class="action-btn action-btn--secondary" @click="addQA">
          <MessageSquare :size="16" />
          添加Q&A
        </button>
        <button class="action-btn action-btn--primary" @click="showMoreActions">
          <MoreHorizontal :size="16" />
          更多操作
        </button>
      </div>
    </div>

    <!-- 标签页导航 -->
    <div class="tabs-container">
      <div class="tabs-nav">
        <button
          v-for="tab in tabs"
          :key="tab.key"
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === tab.key }"
          @click="activeTab = tab.key"
        >
          <component :is="tab.icon" :size="16" />
          {{ tab.label }}
        </button>
      </div>
    </div>

    <!-- 标签页内容 -->
    <div class="tabs-content">
      <div v-if="loading" class="loading-container">
        <Loader :size="48" class="loading-spinner" />
        <span>加载客户详情中...</span>
      </div>

      <div v-else-if="customerDetail">
        <!-- 合作详情 -->
        <div v-if="activeTab === 'cooperation'" class="tab-content">
          <div class="content-section">
            <h3 class="section-title">合作详情</h3>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">客户名称</label>
                <span class="info-value">{{ customerDetail.cooperationDetails.customerName }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">合作方式</label>
                <span class="info-value">{{ customerDetail.cooperationDetails.cooperationType }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">合作起始时间</label>
                <span class="info-value">{{ formatDate(customerDetail.cooperationDetails.cooperationStartTime) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">实际服务开始时间</label>
                <span class="info-value">{{ formatDate(customerDetail.cooperationDetails.serviceStartTime) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">签单销售</label>
                <span class="info-value">{{ customerDetail.cooperationDetails.signingSales }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">客户分级</label>
                <span class="grade-badge" :class="`grade-badge--${customerDetail.cooperationDetails.customerGrade}`">
                  {{ customerDetail.cooperationDetails.customerGrade }}级
                </span>
              </div>
            </div>
            <div class="info-item info-item--full">
              <label class="info-label">特殊合作条件</label>
              <div class="info-value info-value--text">
                {{ customerDetail.cooperationDetails.specialConditions || '无特殊条件' }}
              </div>
            </div>
          </div>
        </div>

        <!-- 客户基础信息 -->
        <div v-if="activeTab === 'basic'" class="tab-content">
          <div class="content-section">
            <h3 class="section-title">基础信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">服务团队</label>
                <span class="info-value">{{ customerDetail.basicInfo.serviceTeam }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">客户行业</label>
                <span class="info-value">{{ customerDetail.basicInfo.industry }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">商业模式</label>
                <span class="info-value">{{ customerDetail.basicInfo.businessModel }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">海外销售规模</label>
                <span class="info-value">{{ customerDetail.basicInfo.overseasSalesScale }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">海外销售占比</label>
                <span class="info-value">{{ customerDetail.basicInfo.overseasSalesRatio }}%</span>
              </div>
              <div class="info-item">
                <label class="info-label">目标销售规模</label>
                <span class="info-value">{{ customerDetail.basicInfo.targetSalesScale }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">主要销售渠道</label>
                <span class="info-value">{{ customerDetail.basicInfo.mainSalesChannel }}</span>
              </div>
            </div>

            <div class="info-section">
              <h4 class="subsection-title">客户地区</h4>
              <div class="tag-list">
                <span v-for="region in customerDetail.basicInfo.regions" :key="region" class="tag">
                  {{ region }}
                </span>
              </div>
            </div>

            <div class="info-section">
              <h4 class="subsection-title">团队配置</h4>
              <div class="team-config">
                <div class="team-item">
                  <Check v-if="customerDetail.basicInfo.hasTechTeam" :size="16" class="check-icon check-icon--success" />
                  <X v-else :size="16" class="check-icon check-icon--error" />
                  <span>技术及素材制作团队</span>
                </div>
                <div class="team-item">
                  <Check v-if="customerDetail.basicInfo.hasOperationTeam" :size="16" class="check-icon check-icon--success" />
                  <X v-else :size="16" class="check-icon check-icon--error" />
                  <span>投放或运营团队</span>
                </div>
                <div class="team-item">
                  <Check v-if="customerDetail.basicInfo.hasBrandTeam" :size="16" class="check-icon check-icon--success" />
                  <X v-else :size="16" class="check-icon check-icon--error" />
                  <span>品牌及内容团队</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <h4 class="subsection-title">联系人信息</h4>
              <div class="contact-list">
                <div v-for="contact in customerDetail.basicInfo.contactPersons" :key="contact.id" class="contact-card">
                  <div class="contact-header">
                    <div class="contact-avatar">
                      {{ contact.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="contact-info">
                      <div class="contact-name">
                        {{ contact.name }}
                        <span v-if="contact.isPrimary" class="primary-badge">主要联系人</span>
                      </div>
                      <div class="contact-position">{{ contact.position }}</div>
                    </div>
                  </div>
                  <div class="contact-details">
                    <div class="contact-item">
                      <Phone :size="14" />
                      <span>{{ contact.phone }}</span>
                    </div>
                    <div class="contact-item">
                      <Mail :size="14" />
                      <span>{{ contact.email }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 独立站情况及目标 -->
        <div v-if="activeTab === 'website'" class="tab-content">
          <div class="content-section">
            <h3 class="section-title">独立站情况及目标</h3>
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">网站上线时间</label>
                <span class="info-value">{{ formatDate(customerDetail.websiteInfo.websiteLaunchTime) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">新品上线频率</label>
                <span class="info-value">{{ customerDetail.websiteInfo.newProductFrequency }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">去年销售额</label>
                <span class="info-value">${{ formatNumber(customerDetail.websiteInfo.lastYearSales) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">年度销售目标</label>
                <span class="info-value">${{ formatNumber(customerDetail.websiteInfo.annualSalesTarget) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">年度成本目标</label>
                <span class="info-value">${{ formatNumber(customerDetail.websiteInfo.annualCostTarget) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">成本占比</label>
                <span class="info-value">{{ customerDetail.websiteInfo.costRatio }}%</span>
              </div>
              <div class="info-item">
                <label class="info-label">价格定位策略</label>
                <span class="info-value">{{ customerDetail.websiteInfo.pricingStrategy }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">库存状态</label>
                <span class="status-indicator" :class="customerDetail.websiteInfo.inventoryStatus ? 'status-indicator--success' : 'status-indicator--warning'">
                  {{ customerDetail.websiteInfo.inventoryStatus ? '有库存' : '无库存' }}
                </span>
              </div>
            </div>

            <div class="info-section">
              <h4 class="subsection-title">目标市场</h4>
              <div class="tag-list">
                <span v-for="market in customerDetail.websiteInfo.targetMarkets" :key="market" class="tag">
                  {{ market }}
                </span>
              </div>
            </div>

            <div class="info-item info-item--full">
              <label class="info-label">主要推广产品</label>
              <div class="info-value info-value--text">
                {{ customerDetail.websiteInfo.mainProducts }}
              </div>
            </div>

            <div class="info-item info-item--full">
              <label class="info-label">产品优势卖点</label>
              <div class="info-value info-value--text">
                {{ customerDetail.websiteInfo.productAdvantages }}
              </div>
            </div>
          </div>
        </div>

        <!-- 竞对情况 -->
        <div v-if="activeTab === 'competitor'" class="tab-content">
          <div class="content-section">
            <h3 class="section-title">竞争对手情况</h3>
            <div class="competitor-list">
              <div v-for="competitor in customerDetail.competitorInfo.competitorWebsites" :key="competitor.id" class="competitor-card">
                <div class="competitor-header">
                  <div class="competitor-info">
                    <h4 class="competitor-name">{{ competitor.companyName }}</h4>
                    <a :href="competitor.websiteUrl" target="_blank" class="competitor-url">
                      <ExternalLink :size="14" />
                      {{ competitor.websiteUrl }}
                    </a>
                  </div>
                </div>
                <div v-if="competitor.notes" class="competitor-notes">
                  <p>{{ competitor.notes }}</p>
                </div>
              </div>
            </div>
            <div v-if="customerDetail.competitorInfo.competitorWebsites.length === 0" class="empty-state">
              <p>暂无竞争对手信息</p>
            </div>
          </div>
        </div>

        <!-- 特别关注事项 -->
        <div v-if="activeTab === 'attention'" class="tab-content">
          <div class="content-section">
            <h3 class="section-title">特别关注事项</h3>
            <div class="attention-grid">
              <div class="attention-item">
                <h4 class="attention-title">
                  <Target :size="16" />
                  客户期望
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.customerExpectations || '无特殊期望' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <MessageCircle :size="16" />
                  沟通偏好
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.communicationPreferences || '无特殊偏好' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <AlertTriangle :size="16" />
                  特殊要求
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.specialRequirements || '无特殊要求' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <Globe :size="16" />
                  文化考虑
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.culturalConsiderations || '无特殊考虑' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <Clock :size="16" />
                  时区偏好
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.timeZonePreferences || '无特殊偏好' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <Languages :size="16" />
                  语言偏好
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.languagePreferences || '无特殊偏好' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <Users :size="16" />
                  决策者信息
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.decisionMakers || '信息不详' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <DollarSign :size="16" />
                  预算限制
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.budgetConstraints || '无特殊限制' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <Shield :size="16" />
                  合规要求
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.complianceRequirements || '无特殊要求' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <AlertTriangle :size="16" />
                  风险因素
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.riskFactors || '无特殊风险' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <TrendingUp :size="16" />
                  成功因素
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.successFactors || '无特殊因素' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <History :size="16" />
                  历史问题
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.historicalIssues || '无历史问题' }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Q&A记录 -->
        <div v-if="activeTab === 'qa'" class="tab-content">
          <div class="content-section">
            <div class="section-header">
              <h3 class="section-title">Q&A记录</h3>
              <button class="action-btn action-btn--primary" @click="addQA">
                <Plus :size="16" />
                添加Q&A
              </button>
            </div>
            <div class="qa-list">
              <div v-for="qa in customerDetail.qaRecords" :key="qa.id" class="qa-card">
                <div class="qa-header">
                  <div class="qa-meta">
                    <span class="qa-category">{{ qa.issueCategory }}</span>
                    <span class="qa-date">{{ formatDate(qa.issueDate) }}</span>
                    <span class="impact-badge" :class="`impact-badge--${qa.impactLevel}`">
                      {{ getImpactText(qa.impactLevel) }}
                    </span>
                    <span class="qa-status-badge" :class="`qa-status-badge--${qa.status}`">
                      {{ getQAStatusText(qa.status) }}
                    </span>
                  </div>
                </div>
                <div class="qa-content">
                  <div class="qa-section">
                    <h5 class="qa-section-title">问题描述</h5>
                    <p class="qa-text">{{ qa.issueDescription }}</p>
                  </div>
                  <div class="qa-section">
                    <h5 class="qa-section-title">根本原因</h5>
                    <p class="qa-text">{{ qa.rootCause }}</p>
                  </div>
                  <div class="qa-section">
                    <h5 class="qa-section-title">解决方案</h5>
                    <p class="qa-text">{{ qa.immediateSolution }}</p>
                  </div>
                  <div class="qa-section">
                    <h5 class="qa-section-title">改正措施</h5>
                    <p class="qa-text">{{ qa.correctiveMeasures }}</p>
                  </div>
                  <div class="qa-footer">
                    <div class="qa-info">
                      <span>负责人：{{ qa.responsiblePerson }}</span>
                      <span>完成期限：{{ formatDate(qa.dueDate) }}</span>
                      <span v-if="qa.actualCompletionDate">实际完成：{{ formatDate(qa.actualCompletionDate) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="customerDetail.qaRecords.length === 0" class="empty-state">
              <MessageSquare :size="48" />
              <p>暂无Q&A记录</p>
              <button class="action-btn action-btn--primary" @click="addQA">
                <Plus :size="16" />
                添加第一条Q&A
              </button>
            </div>
          </div>
        </div>

        <!-- 续费跟进 -->
        <div v-if="activeTab === 'renewal'" class="tab-content">
          <div class="content-section">
            <h3 class="section-title">续费跟进需注意</h3>
            <div class="renewal-content">
              <div class="renewal-notes">
                <h4 class="renewal-title">续费备注</h4>
                <div class="renewal-text">
                  {{ customerDetail.renewalNotes || '暂无续费备注' }}
                </div>
              </div>

              <div class="renewal-accounts">
                <h4 class="renewal-title">关联广告账户</h4>
                <div class="account-list">
                  <div v-for="account in customerDetail.adAccounts" :key="account.id" class="account-card">
                    <div class="account-header">
                      <div class="platform-icon" :class="`platform-icon--${account.platform}`">
                        {{ getPlatformIcon(account.platform) }}
                      </div>
                      <div class="account-info">
                        <h5 class="account-name">{{ account.accountName }}</h5>
                        <span class="account-id">{{ account.accountId }}</span>
                      </div>
                      <span class="account-status" :class="`account-status--${account.status}`">
                        {{ getAccountStatusText(account.status) }}
                      </span>
                    </div>
                    <div class="account-balance">
                      <span class="balance-label">余额：</span>
                      <span class="balance-value" :class="account.balance < 1000 ? 'balance-low' : ''">
                        ${{ formatNumber(account.balance) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="error-state">
        <AlertTriangle :size="48" />
        <p>客户信息加载失败</p>
        <button class="action-btn action-btn--primary" @click="loadCustomerDetail">
          <RefreshCw :size="16" />
          重新加载
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Edit, MessageSquare, MoreHorizontal, Loader,
  Handshake, User, Globe, Users, AlertTriangle, MessageCircle,
  RefreshCw, Plus, Check, X, Phone, Mail, ExternalLink,
  Target, Clock, Languages, Shield, TrendingUp, History, DollarSign
} from 'lucide-vue-next'
import { mockGetCustomerDetail } from '@/mock/customer'
import type { CustomerDetail } from '@/types'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const customerDetail = ref<CustomerDetail | null>(null)
const activeTab = ref('cooperation')

// 标签页配置
const tabs = [
  { key: 'cooperation', label: '合作详情', icon: Handshake },
  { key: 'basic', label: '基础信息', icon: User },
  { key: 'website', label: '独立站情况', icon: Globe },
  { key: 'competitor', label: '竞对情况', icon: Users },
  { key: 'attention', label: '特别关注', icon: AlertTriangle },
  { key: 'qa', label: 'Q&A记录', icon: MessageCircle },
  { key: 'renewal', label: '续费跟进', icon: RefreshCw }
]

// 计算属性
const customerId = computed(() => {
  return parseInt(route.params.id as string)
})

// 方法
const formatDate = (dateString: string): string => {
  if (!dateString) return '未设置'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toLocaleString()
}

const getStatusText = (status?: string): string => {
  const statusMap = {
    active: '活跃',
    inactive: '非活跃',
    suspended: '暂停'
  }
  return statusMap[status as keyof typeof statusMap] || '未知'
}

const getImpactText = (level: string): string => {
  const levelMap = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '严重'
  }
  return levelMap[level as keyof typeof levelMap] || level
}

const getQAStatusText = (status: string): string => {
  const statusMap = {
    pending: '待处理',
    in_progress: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getPlatformIcon = (platform: string): string => {
  const iconMap = {
    google: 'G',
    facebook: 'F',
    bing: 'B',
    criteo: 'C',
    other: 'O'
  }
  return iconMap[platform as keyof typeof iconMap] || platform.charAt(0).toUpperCase()
}

const getAccountStatusText = (status: string): string => {
  const statusMap = {
    active: '正常',
    paused: '暂停',
    limited: '受限',
    suspended: '停用'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const goBack = () => {
  router.push('/customers')
}

const editCustomer = () => {
  console.log('编辑客户')
  // 这里可以跳转到编辑页面或打开编辑弹窗
}

const addQA = () => {
  console.log('添加Q&A')
  // 这里可以打开Q&A添加弹窗
}

const showMoreActions = () => {
  console.log('显示更多操作')
  // 这里可以显示更多操作菜单
}

const loadCustomerDetail = async () => {
  loading.value = true
  try {
    const response = await mockGetCustomerDetail(customerId.value)
    if (response.success && response.data) {
      customerDetail.value = response.data
    }
  } catch (error) {
    console.error('加载客户详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 生命周期
onMounted(() => {
  loadCustomerDetail()
})
</script>

<style scoped>
.customer-detail-view {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.page-header__main {
  flex: 1;
  min-width: 300px;
}

.breadcrumb {
  margin-bottom: var(--spacing-md);
}

.breadcrumb-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
  font-size: var(--font-size-sm);
}

.breadcrumb-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.customer-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.customer-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-2xl);
}

.customer-info {
  flex: 1;
}

.customer-name {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.customer-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.page-header__actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  flex-wrap: wrap;
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
  text-decoration: none;
}

.action-btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.action-btn--primary:hover {
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

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-badge--active {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.status-badge--inactive,
.status-badge--suspended {
  background: rgba(140, 140, 140, 0.1);
  color: var(--color-text-secondary);
}

.grade-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-align: center;
  min-width: 24px;
}

.grade-badge--A {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.grade-badge--B {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.grade-badge--C {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.tabs-container {
  margin-bottom: var(--spacing-xl);
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
  gap: var(--spacing-xs);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--color-primary);
}

.tab-btn--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tabs-content {
  min-height: 400px;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
}

.loading-spinner {
  animation: spin 1s linear infinite;
  color: var(--color-primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.content-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-lg) 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-item--full {
  grid-column: 1 / -1;
}

.info-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.info-value {
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}

.info-value--text {
  background: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
  line-height: var(--line-height-relaxed);
}

.info-section {
  margin-bottom: var(--spacing-xl);
}

.subsection-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.team-config {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.team-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.check-icon {
  flex-shrink: 0;
}

.check-icon--success {
  color: var(--color-success);
}

.check-icon--error {
  color: var(--color-error);
}

.contact-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.contact-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.contact-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.contact-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
}

.contact-info {
  flex: 1;
}

.contact-name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.primary-badge {
  padding: 2px var(--spacing-xs);
  background: var(--color-primary);
  color: white;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.contact-position {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.status-indicator {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-indicator--success {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.status-indicator--warning {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.competitor-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.competitor-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.competitor-header {
  margin-bottom: var(--spacing-md);
}

.competitor-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.competitor-url {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.competitor-url:hover {
  text-decoration: underline;
}

.competitor-notes {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

.attention-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.attention-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.attention-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.attention-content {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.qa-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.qa-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.qa-header {
  margin-bottom: var(--spacing-md);
}

.qa-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.qa-category {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.qa-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.impact-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.impact-badge--low {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.impact-badge--medium {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.impact-badge--high {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.impact-badge--critical {
  background: rgba(245, 34, 45, 0.1);
  color: var(--color-error);
}

.qa-status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.qa-status-badge--pending {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.qa-status-badge--in_progress {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.qa-status-badge--completed {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.qa-status-badge--cancelled {
  background: rgba(140, 140, 140, 0.1);
  color: var(--color-text-secondary);
}

.qa-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.qa-section {
  border-left: 3px solid var(--color-border);
  padding-left: var(--spacing-md);
}

.qa-section-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.qa-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.qa-footer {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.qa-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.renewal-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.renewal-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.renewal-notes {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.renewal-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

.account-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.account-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.account-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.platform-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  color: white;
  font-size: var(--font-size-lg);
}

.platform-icon--google {
  background: #4285f4;
}

.platform-icon--facebook {
  background: #1877f2;
}

.platform-icon--bing {
  background: #00809d;
}

.platform-icon--criteo {
  background: #ff6900;
}

.platform-icon--other {
  background: var(--color-text-secondary);
}

.account-info {
  flex: 1;
}

.account-name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.account-id {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-family: monospace;
}

.account-status {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.account-status--active {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.account-status--paused {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.account-status--limited,
.account-status--suspended {
  background: rgba(245, 34, 45, 0.1);
  color: var(--color-error);
}

.account-balance {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.balance-label {
  color: var(--color-text-secondary);
}

.balance-value {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.balance-low {
  color: var(--color-error);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
  text-align: center;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
  text-align: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .attention-grid {
    grid-template-columns: 1fr;
  }

  .contact-list {
    grid-template-columns: 1fr;
  }

  .account-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .customer-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-md);
  }

  .page-header__actions {
    justify-content: center;
  }

  .tabs-nav {
    flex-wrap: wrap;
  }

  .content-section {
    padding: var(--spacing-lg);
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .qa-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .qa-info {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .account-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}
</style>
