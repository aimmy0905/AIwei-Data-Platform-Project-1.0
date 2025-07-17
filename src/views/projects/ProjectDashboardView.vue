<template>
  <div class="project-dashboard-view">
    <div class="dashboard-header">
      <div class="header-main">
        <button class="back-btn" @click="goBack">
          <ArrowLeft :size="20" />
          返回项目列表
        </button>
        <div class="project-info">
          <h1 class="project-title">{{ project?.project_name }}</h1>
          <p class="project-subtitle">{{ project?.customer_name }}</p>
        </div>
      </div>
      <div class="header-actions">
        <button class="action-btn action-btn--secondary" @click="exportData">
          <Download :size="16" />
          导出数据
        </button>
        <button class="action-btn action-btn--primary" @click="openProjectGoals">
          <Target :size="16" />
          管理目标
        </button>
      </div>
    </div>

    <!-- 项目概览卡片 -->
    <div class="overview-cards">
      <div class="overview-card">
        <div class="card-icon">
          <DollarSign :size="24" />
        </div>
        <div class="card-content">
          <div class="card-value">¥{{ formatNumber(project?.service_fee || 0) }}</div>
          <div class="card-label">项目服务费</div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <Wallet :size="24" />
        </div>
        <div class="card-content">
          <div class="card-value">¥{{ formatNumber(project?.balance_info || 0) }}</div>
          <div class="card-label">账户余额</div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <ShoppingCart :size="24" />
        </div>
        <div class="card-content">
          <div class="card-value">{{ project?.new_order_count || 0 }}</div>
          <div class="card-label">核算新单数</div>
        </div>
      </div>

      <div class="overview-card">
        <div class="card-icon">
          <Calendar :size="24" />
        </div>
        <div class="card-content">
          <div class="card-value">{{ getDaysRemaining() }}</div>
          <div class="card-label">剩余天数</div>
        </div>
      </div>
    </div>

    <!-- 目标完成情况 -->
    <div class="dashboard-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">目标完成情况</h2>
          <button class="section-action" @click="openProjectGoals">
            查看详情
          </button>
        </div>

        <div class="goals-overview">
          <div
            v-for="goal in recentGoals"
            :key="goal.id"
            class="goal-item"
          >
            <div class="goal-header">
              <span class="goal-type">{{ goal.goal_type }}目标</span>
              <span class="goal-period">{{ goal.goal_period }}</span>
            </div>

            <div class="goal-metrics">
              <div class="metric-item">
                <div class="metric-label">销量完成率</div>
                <div class="metric-progress">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: Math.min(goal.completion_rate?.sales || 0, 100) + '%' }"
                      :class="getCompletionClass(goal.completion_rate?.sales || 0)"
                    ></div>
                  </div>
                  <span class="progress-text">{{ goal.completion_rate?.sales || 0 }}%</span>
                </div>
              </div>

              <div class="metric-item">
                <div class="metric-label">ROI完成率</div>
                <div class="metric-progress">
                  <div class="progress-bar">
                    <div
                      class="progress-fill"
                      :style="{ width: Math.min(goal.completion_rate?.roi || 0, 100) + '%' }"
                      :class="getCompletionClass(goal.completion_rate?.roi || 0)"
                    ></div>
                  </div>
                  <span class="progress-text">{{ goal.completion_rate?.roi || 0 }}%</span>
                </div>
              </div>
            </div>
          </div>

          <div v-if="recentGoals.length === 0" class="empty-goals">
            <Target :size="32" />
            <p>暂无目标数据</p>
            <button class="action-btn action-btn--primary" @click="openProjectGoals">
              设置目标
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 投放账号状态 -->
    <div class="dashboard-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">投放账号状态</h2>
          <button class="section-action" @click="openAdAccounts">
            管理账号
          </button>
        </div>

        <div class="accounts-overview">
          <div
            v-for="account in projectAccounts"
            :key="account.id"
            class="account-item"
          >
            <div class="account-header">
              <div class="platform-info">
                <component :is="getPlatformIcon(account.platform)" :size="16" />
                <span class="platform-name">{{ account.platform }}</span>
              </div>
              <div class="account-status" :class="getAccountStatusClass(account)">
                {{ getAccountStatus(account) }}
              </div>
            </div>

            <div class="account-details">
              <div class="detail-item">
                <span class="label">余额：</span>
                <span class="value">¥{{ formatNumber(account.balance) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">预计可用：</span>
                <span class="value">{{ account.estimated_available_time }}</span>
              </div>
            </div>

            <div class="account-usage">
              <div class="usage-bar">
                <div
                  class="usage-fill"
                  :style="{ width: getUsagePercentage(account) + '%' }"
                  :class="getUsageClass(getUsagePercentage(account))"
                ></div>
              </div>
              <span class="usage-text">已使用 {{ getUsagePercentage(account) }}%</span>
            </div>
          </div>

          <div v-if="projectAccounts.length === 0" class="empty-accounts">
            <Monitor :size="32" />
            <p>暂无投放账号</p>
            <button class="action-btn action-btn--primary" @click="openAdAccounts">
              添加账号
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近续费记录 -->
    <div class="dashboard-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">最近续费记录</h2>
          <button class="section-action" @click="openRenewalRecords">
            查看全部
          </button>
        </div>

        <div class="renewals-overview">
          <div
            v-for="renewal in recentRenewals"
            :key="renewal.id"
            class="renewal-item"
          >
            <div class="renewal-date">
              <Calendar :size="14" />
              {{ formatDate(renewal.renewal_date) }}
            </div>
            <div class="renewal-amount">¥{{ formatNumber(renewal.renewal_amount) }}</div>
            <div class="renewal-type">{{ renewal.renewal_type }}</div>
            <div class="renewal-status" :class="getConfirmationClass(renewal.payment_confirmed)">
              {{ renewal.payment_confirmed }}
            </div>
          </div>

          <div v-if="recentRenewals.length === 0" class="empty-renewals">
            <DollarSign :size="32" />
            <p>暂无续费记录</p>
            <button class="action-btn action-btn--primary" @click="openRenewalRecords">
              添加续费记录
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 项目信息详情 -->
    <div class="dashboard-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">项目信息</h2>
        </div>

        <div class="project-details" v-if="project">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="label">项目类型：</span>
              <span class="value type-badge" :class="getTypeClass(project.project_type)">
                {{ project.project_type }}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">项目状态：</span>
              <span class="value status-badge" :class="getStatusClass(project.project_status)">
                {{ project.project_status }}
              </span>
            </div>
            <div class="detail-item">
              <span class="label">合作周期：</span>
              <span class="value">{{ project.cooperation_period }}</span>
            </div>
            <div class="detail-item">
              <span class="label">合同编号：</span>
              <span class="value">{{ project.contract_number }}</span>
            </div>
            <div class="detail-item">
              <span class="label">负责团队：</span>
              <span class="value">{{ project.operation_team }}</span>
            </div>
            <div class="detail-item">
              <span class="label">销售人员：</span>
              <span class="value">{{ project.sales_person }}</span>
            </div>
            <div class="detail-item">
              <span class="label">合作平台：</span>
              <div class="platform-tags">
                <span
                  v-for="platform in project.cooperation_platform"
                  :key="platform"
                  class="platform-tag"
                >
                  {{ platform }}
                </span>
              </div>
            </div>
            <div class="detail-item">
              <span class="label">项目时间：</span>
              <span class="value">
                {{ formatDate(project.project_duration.start_date) }} -
                {{ formatDate(project.project_duration.end_date) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 弹窗组件 -->
    <ProjectGoalsModal
      v-if="showProjectGoalsModal && project"
      :project-id="project.id"
      :project-info="project"
      @close="showProjectGoalsModal = false"
    />

    <AdAccountsModal
      v-if="showAdAccountsModal && project"
      :project-id="project.id"
      :project-info="project"
      @close="showAdAccountsModal = false"
    />

    <RenewalRecordsModal
      v-if="showRenewalRecordsModal && project"
      :project-id="project.id"
      :project-info="project"
      @close="showRenewalRecordsModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft,
  Download,
  Target,
  DollarSign,
  Wallet,
  ShoppingCart,
  Calendar,
  Monitor,
  Chrome,
  Search
} from 'lucide-vue-next'

import ProjectGoalsModal from '@/components/projects/ProjectGoalsModal.vue'
import AdAccountsModal from '@/components/projects/AdAccountsModal.vue'
import RenewalRecordsModal from '@/components/projects/RenewalRecordsModal.vue'

import {
  mockProjects,
  mockProjectGoals,
  mockAdAccounts,
  mockRenewalRecords,
  type Project,
  type ProjectGoal,
  type AdAccount,
  type RenewalRecord
} from '@/mock/projects'

const route = useRoute()
const router = useRouter()

// 响应式数据
const project = ref<Project | null>(null)
const showProjectGoalsModal = ref(false)
const showAdAccountsModal = ref(false)
const showRenewalRecordsModal = ref(false)

// 初始化数据
onMounted(() => {
  const projectId = parseInt(route.params.id as string)
  project.value = mockProjects.find(p => p.id === projectId) || null

  if (!project.value) {
    router.push('/projects')
  }
})

// 计算属性
const recentGoals = computed(() => {
  if (!project.value) return []
  return mockProjectGoals
    .filter(goal => goal.project_id === project.value!.id)
    .slice(0, 2)
})

const projectAccounts = computed(() => {
  if (!project.value) return []
  return mockAdAccounts.filter(account => account.project_id === project.value!.id)
})

const recentRenewals = computed(() => {
  if (!project.value) return []
  return mockRenewalRecords
    .filter(renewal => renewal.project_id === project.value!.id)
    .sort((a, b) => new Date(b.renewal_date).getTime() - new Date(a.renewal_date).getTime())
    .slice(0, 3)
})

// 方法
const goBack = () => {
  router.push('/projects')
}

const getDaysRemaining = () => {
  if (!project.value) return 0
  const endDate = new Date(project.value.project_duration.end_date)
  const today = new Date()
  const diffTime = endDate.getTime() - today.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return Math.max(0, diffDays)
}

const getCompletionClass = (rate: number) => {
  if (rate >= 110) return 'excellent'
  if (rate >= 90) return 'good'
  if (rate >= 70) return 'warning'
  return 'danger'
}

const getPlatformIcon = (platform: string) => {
  const iconMap: Record<string, any> = {
    'Google': Chrome,
    'Meta': 'div',
    'Criteo': Monitor,
    'Bing': Search
  }
  return iconMap[platform] || Monitor
}

const getAccountStatus = (account: AdAccount) => {
  if (account.balance <= 1000) return '余额不足'
  if (account.balance <= 5000) return '余额偏低'
  return '状态正常'
}

const getAccountStatusClass = (account: AdAccount) => {
  if (account.balance <= 1000) return 'status-danger'
  if (account.balance <= 5000) return 'status-warning'
  return 'status-success'
}

const getUsagePercentage = (account: AdAccount) => {
  const total = account.balance + account.spent_amount
  if (total === 0) return 0
  return Math.round((account.spent_amount / total) * 100)
}

const getUsageClass = (percentage: number) => {
  if (percentage >= 90) return 'usage-danger'
  if (percentage >= 70) return 'usage-warning'
  return 'usage-normal'
}

const getConfirmationClass = (status: string) => {
  return status === '已确认' ? 'status-confirmed' : 'status-pending'
}

const getTypeClass = (type: string) => {
  const typeMap: Record<string, string> = {
    '新客户': 'type-new',
    '二次开发': 'type-development',
    '失效复活': 'type-revival'
  }
  return typeMap[type] || 'type-default'
}

const getStatusClass = (status: string) => {
  const statusMap: Record<string, string> = {
    '活跃': 'status-active',
    '流失': 'status-lost',
    '暂停服务': 'status-paused'
  }
  return statusMap[status] || 'status-default'
}

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 操作方法
const exportData = () => {
  console.log('导出项目数据')
}

const openProjectGoals = () => {
  showProjectGoalsModal.value = true
}

const openAdAccounts = () => {
  showAdAccountsModal.value = true
}

const openRenewalRecords = () => {
  showRenewalRecordsModal.value = true
}
</script>

<style scoped>
.project-dashboard-view {
  padding: 24px;
  background: var(--color-background);
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--color-border);
}

.header-main {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background-secondary);
  color: var(--color-text-secondary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.project-info .project-title {
  font-size: 28px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.project-info .project-subtitle {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 16px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
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

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.overview-card {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.card-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-content .card-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.card-content .card-label {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.dashboard-section {
  margin-bottom: 32px;
}

.section-card {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.section-action {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.section-action:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.goals-overview,
.accounts-overview,
.renewals-overview {
  padding: 24px;
}

.goal-item,
.account-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 16px;
  margin-bottom: 16px;
}

.goal-item:last-child,
.account-item:last-child {
  margin-bottom: 0;
}

.goal-header,
.account-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.goal-type {
  font-weight: 600;
  color: var(--color-text-primary);
}

.goal-period {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.goal-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.metric-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-background-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-fill.excellent {
  background: var(--color-success);
}

.progress-fill.good {
  background: var(--color-primary);
}

.progress-fill.warning {
  background: var(--color-warning);
}

.progress-fill.danger {
  background: var(--color-danger);
}

.progress-text {
  font-size: 12px;
  font-weight: 600;
  color: var(--color-text-secondary);
  min-width: 35px;
}

.platform-info {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.account-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-success {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.status-danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.account-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
}

.detail-item .label {
  color: var(--color-text-secondary);
}

.detail-item .value {
  color: var(--color-text-primary);
  font-weight: 500;
}

.account-usage {
  display: flex;
  align-items: center;
  gap: 8px;
}

.usage-bar {
  flex: 1;
  height: 4px;
  background: var(--color-background-tertiary);
  border-radius: 2px;
  overflow: hidden;
}

.usage-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.3s ease;
}

.usage-normal {
  background: var(--color-success);
}

.usage-warning {
  background: var(--color-warning);
}

.usage-danger {
  background: var(--color-danger);
}

.usage-text {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.renewal-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 16px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.renewal-item:last-child {
  border-bottom: none;
}

.renewal-date {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: var(--color-text-secondary);
}

.renewal-amount {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-success);
}

.renewal-type {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.renewal-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-confirmed {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-pending {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.project-details {
  padding: 24px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.detail-grid .detail-item {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.detail-grid .detail-item:last-child {
  border-bottom: none;
}

.type-badge,
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.type-new {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.type-development {
  background: var(--color-info-light);
  color: var(--color-info);
}

.type-revival {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.status-active {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-lost {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.status-paused {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.platform-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.platform-tag {
  padding: 2px 6px;
  background: var(--color-background-tertiary);
  border: 1px solid var(--color-border);
  border-radius: 3px;
  font-size: 11px;
  color: var(--color-text-secondary);
}

.empty-goals,
.empty-accounts,
.empty-renewals {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
}

.empty-goals p,
.empty-accounts p,
.empty-renewals p {
  margin: 16px 0 20px 0;
  font-size: 16px;
}

@media (max-width: 768px) {
  .project-dashboard-view {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .overview-cards {
    grid-template-columns: 1fr;
  }

  .goal-metrics {
    grid-template-columns: 1fr;
  }

  .account-details {
    grid-template-columns: 1fr;
  }

  .detail-grid {
    grid-template-columns: 1fr;
  }

  .renewal-item {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: left;
  }
}
</style>
