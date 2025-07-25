<template>
  <div class="campaign-data-panel">
    <div class="panel-header">
      <h2 class="panel-title">活动数据</h2>
      <p class="panel-description">营销活动的运营数据和效果评估</p>
    </div>



    <!-- 活动数据标签页 -->
    <div class="campaign-tabs">
      <div class="tab-header">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          :class="['tab-button', { active: activeTab === tab.id }]"
          @click="activeTab = tab.id"
        >
          <component :is="tab.icon" :size="16" />
          {{ tab.name }}
        </button>

        <div class="tab-actions">
          <button class="action-button" @click="showAllCampaigns">
            <List :size="16" />
            查看全部活动
          </button>
        </div>
      </div>

      <div class="tab-content">
        <!-- 最新活动列表 -->
        <div v-if="activeTab === 'list'" class="tab-pane">
          <div class="campaign-list">
            <div class="list-header">
              <h3>最新活动列表</h3>
              <div class="filter-controls">
                <select v-model="statusFilter" class="filter-select">
                  <option value="">全部阶段</option>
                  <option value="warmup">预热</option>
                  <option value="official">正式</option>
                </select>
                <select v-model="typeFilter" class="filter-select">
                  <option value="">全部类型</option>
                  <option value="promotion">促销活动</option>
                  <option value="acquisition">获客活动</option>
                  <option value="seasonal">季节性活动</option>
                  <option value="branding">品牌推广</option>
                </select>
              </div>
            </div>

            <div class="campaign-table-container">
              <table class="campaign-table">
                <thead>
                  <tr>
                    <th>活动名称</th>
                    <th>活动类型</th>
                    <th>活动阶段</th>
                    <th>活动开始时间</th>
                    <th>活动截止时间</th>
                    <th>目标市场</th>
                    <th>参与渠道</th>
                    <th>总销售额</th>
                    <th>用户数</th>
                    <th>ROI</th>
                    <th>转化率</th>
                    <th>操作</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="campaign in filteredCampaigns" :key="campaign.id">
                    <td>
                      <div class="campaign-name">
                        <span class="name">{{ campaign.name }}</span>
                        <span class="status-badge" :class="`status-${campaign.status}`">
                          {{ getStatusText(campaign.status) }}
                        </span>
                      </div>
                    </td>
                    <td>{{ getTypeText(campaign.type) }}</td>
                    <td>
                      <span class="stage-badge" :class="`stage-${campaign.stage}`">
                        {{ getStageText(campaign.stage) }}
                      </span>
                    </td>
                    <td>{{ formatActivityDate(campaign.startDate) }}</td>
                    <td>{{ formatActivityDate(campaign.endDate) }}</td>
                    <td>{{ campaign.targetMarket }}</td>
                    <td>
                      <div class="channels">
                        <span v-for="channel in campaign.channels.slice(0, 2)" :key="channel" class="channel-tag">
                          {{ channel }}
                        </span>
                        <span v-if="campaign.channels.length > 2" class="channel-more">
                          +{{ campaign.channels.length - 2 }}
                        </span>
                      </div>
                    </td>
                    <td class="currency">${{ formatNumber(campaign.totalSales) }}</td>
                    <td>{{ formatNumber(campaign.userCount) }}</td>
                    <td class="roi-value">{{ campaign.roi }}x</td>
                    <td class="percentage">{{ campaign.conversionRate }}%</td>
                    <td>
                      <button
                        class="detail-button"
                        @click="navigateToCampaignDetails(campaign.id)"
                      >
                        查看详情
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- 活动详情 -->
        <div v-else-if="activeTab === 'details'" class="tab-pane">
          <div v-if="selectedCampaign" class="campaign-details">
            <div class="detail-header">
              <div class="header-left">
                <h3>{{ selectedCampaign.name }}</h3>
                <div class="campaign-meta">
                  <span class="meta-item">{{ getTypeText(selectedCampaign.type) }}</span>
                  <span class="meta-item">{{ selectedCampaign.targetMarket }}</span>
                  <span class="meta-item">{{ selectedCampaign.startDate }} - {{ selectedCampaign.endDate }}</span>
                </div>
              </div>
              <button class="back-button" @click="activeTab = 'list'">
                <ArrowLeft :size="16" />
                返回列表
              </button>
            </div>

            <div class="campaign-content">
              <div class="content-description">
                <h4>活动内容</h4>
                <p>{{ selectedCampaign.content }}</p>
              </div>

              <div class="detail-sections">
                <!-- 基础数据 -->
                <div class="detail-section">
                  <h4>基础数据</h4>
                  <div class="metrics-grid">
                    <div class="metric-card">
                      <div class="metric-label">预算</div>
                      <div class="metric-value">${{ formatNumber(selectedCampaign.budget) }}</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">已花费</div>
                      <div class="metric-value">${{ formatNumber(selectedCampaign.spent) }}</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">总收入</div>
                      <div class="metric-value">${{ formatNumber(selectedCampaign.revenue) }}</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">ROI</div>
                      <div class="metric-value">{{ selectedCampaign.roi }}x</div>
                    </div>
                  </div>
                </div>

                <!-- 详细指标 -->
                <div class="detail-section">
                  <h4>详细指标</h4>
                  <div class="metrics-grid">
                    <div class="metric-card">
                      <div class="metric-label">用户数</div>
                      <div class="metric-value">{{ formatNumber(selectedCampaign.userCount) }}</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">转化率</div>
                      <div class="metric-value">{{ selectedCampaign.conversionRate }}%</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">平均订单价值</div>
                      <div class="metric-value">${{ selectedCampaign.averageOrderValue }}</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">订单数</div>
                      <div class="metric-value">{{ formatNumber(selectedCampaign.orderCount) }}</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">退货率</div>
                      <div class="metric-value">{{ selectedCampaign.returnRate }}%</div>
                    </div>
                    <div class="metric-card">
                      <div class="metric-label">退货金额</div>
                      <div class="metric-value">${{ formatNumber(selectedCampaign.returnAmount) }}</div>
                    </div>
                  </div>
                </div>

                <!-- 广告平台数据 -->
                <div class="detail-section">
                  <h4>广告平台数据</h4>
                  <div class="platform-data">
                    <div v-if="selectedCampaign.googleSpend" class="platform-card">
                      <div class="platform-header">
                        <div class="platform-icon google"></div>
                        <span class="platform-name">Google Ads</span>
                      </div>
                      <div class="platform-metrics">
                        <div class="platform-metric">
                          <span class="metric-label">花费</span>
                          <span class="metric-value">${{ formatNumber(selectedCampaign.googleSpend) }}</span>
                        </div>
                        <div class="platform-metric">
                          <span class="metric-label">收入</span>
                          <span class="metric-value">${{ formatNumber(selectedCampaign.googleRevenue || 0) }}</span>
                        </div>
                        <div class="platform-metric">
                          <span class="metric-label">ROI</span>
                          <span class="metric-value">{{ selectedCampaign.googleROI }}x</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="selectedCampaign.facebookSpend" class="platform-card">
                      <div class="platform-header">
                        <div class="platform-icon facebook"></div>
                        <span class="platform-name">Facebook Ads</span>
                      </div>
                      <div class="platform-metrics">
                        <div class="platform-metric">
                          <span class="metric-label">花费</span>
                          <span class="metric-value">${{ formatNumber(selectedCampaign.facebookSpend) }}</span>
                        </div>
                        <div class="platform-metric">
                          <span class="metric-label">收入</span>
                          <span class="metric-value">${{ formatNumber(selectedCampaign.facebookRevenue || 0) }}</span>
                        </div>
                        <div class="platform-metric">
                          <span class="metric-label">ROI</span>
                          <span class="metric-value">{{ selectedCampaign.facebookROI }}x</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="selectedCampaign.bingSpend" class="platform-card">
                      <div class="platform-header">
                        <div class="platform-icon bing"></div>
                        <span class="platform-name">Bing Ads</span>
                      </div>
                      <div class="platform-metrics">
                        <div class="platform-metric">
                          <span class="metric-label">花费</span>
                          <span class="metric-value">${{ formatNumber(selectedCampaign.bingSpend) }}</span>
                        </div>
                        <div class="platform-metric">
                          <span class="metric-label">收入</span>
                          <span class="metric-value">${{ formatNumber(selectedCampaign.bingRevenue || 0) }}</span>
                        </div>
                        <div class="platform-metric">
                          <span class="metric-label">ROI</span>
                          <span class="metric-value">{{ selectedCampaign.bingROI }}x</span>
                        </div>
                      </div>
                    </div>

                    <div v-if="selectedCampaign.criteoSpend" class="platform-card">
                      <div class="platform-header">
                        <div class="platform-icon criteo"></div>
                        <span class="platform-name">Criteo</span>
                      </div>
                      <div class="platform-metrics">
                        <div class="platform-metric">
                          <span class="metric-label">花费</span>
                          <span class="metric-value">${{ formatNumber(selectedCampaign.criteoSpend) }}</span>
                        </div>
                        <div class="platform-metric">
                          <span class="metric-label">收入</span>
                          <span class="metric-value">${{ formatNumber(selectedCampaign.criteoRevenue || 0) }}</span>
                        </div>
                        <div class="platform-metric">
                          <span class="metric-label">ROI</span>
                          <span class="metric-value">{{ selectedCampaign.criteoROI }}x</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-selection">
            <Calendar :size="48" />
            <p>请从活动列表中选择一个活动查看详情</p>
          </div>
        </div>

        <!-- 单日数据表 -->
        <div v-else-if="activeTab === 'daily'" class="tab-pane">
          <div v-if="selectedCampaign && dailyData.length > 0" class="daily-data">
            <div class="daily-header">
              <h3>{{ selectedCampaign.name }} - 单日数据</h3>
              <button class="back-button" @click="activeTab = 'details'">
                <ArrowLeft :size="16" />
                返回详情
              </button>
            </div>

            <div class="daily-table-container">
              <table class="daily-table">
                <thead>
                  <tr>
                    <th>日期</th>
                    <th>整站收入</th>
                    <th>广告花费</th>
                    <th>整站ROI</th>
                    <th>订单数</th>
                    <th>客单价</th>
                    <th>广告收入</th>
                    <th>广告ROI</th>
                    <th>广告收入占比</th>
                    <th>Google</th>
                    <th>Facebook</th>
                    <th>Bing</th>
                    <th>Criteo</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="day in dailyData" :key="day.date">
                    <td class="date-cell">{{ formatDate(day.date) }}</td>
                    <td class="currency">${{ formatNumber(day.totalRevenue) }}</td>
                    <td class="currency">${{ formatNumber(day.totalAdSpend) }}</td>
                    <td class="roi-value">{{ day.totalROI }}x</td>
                    <td>{{ day.orderCount }}</td>
                    <td class="currency">${{ day.averageOrderValue }}</td>
                    <td class="currency">${{ formatNumber(day.adRevenue) }}</td>
                    <td class="roi-value">{{ day.adROI }}x</td>
                    <td class="percentage">{{ day.adRevenueRatio }}%</td>
                    <td class="platform-cell">
                      <div class="platform-data">
                        <div class="platform-spend">${{ formatNumber(day.platforms.google.spend) }}</div>
                        <div class="platform-roi">{{ day.platforms.google.roi }}x</div>
                      </div>
                    </td>
                    <td class="platform-cell">
                      <div class="platform-data">
                        <div class="platform-spend">${{ formatNumber(day.platforms.facebook.spend) }}</div>
                        <div class="platform-roi">{{ day.platforms.facebook.roi }}x</div>
                      </div>
                    </td>
                    <td class="platform-cell">
                      <div class="platform-data">
                        <div class="platform-spend">${{ formatNumber(day.platforms.bing.spend) }}</div>
                        <div class="platform-roi">{{ day.platforms.bing.roi }}x</div>
                      </div>
                    </td>
                    <td class="platform-cell">
                      <div class="platform-data">
                        <div class="platform-spend">${{ formatNumber(day.platforms.criteo.spend) }}</div>
                        <div class="platform-roi">{{ day.platforms.criteo.roi }}x</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="no-daily-data">
            <BarChart3 :size="48" />
            <p>请先选择一个活动查看单日数据</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Calendar, Play, DollarSign, TrendingUp, Target, Award,
  List, ArrowLeft, BarChart3
} from 'lucide-vue-next'
import type { CampaignData, CampaignSummary, CampaignDailyData } from '@/types'
import {
  mockGetCampaignData,
  mockGetCampaignSummary,
  mockGetCampaignDetails,
  mockGetCampaignDailyData
} from '@/mock/dashboard'

// 路由
const router = useRouter()

// 响应式数据
const campaignData = ref<CampaignData[]>([])
const campaignSummary = ref<CampaignSummary>({
  totalCampaigns: 0,
  activeCampaigns: 0,
  totalBudget: 0,
  totalSpent: 0,
  totalRevenue: 0,
  averageROI: 0,
  topPerformingCampaign: '',
  totalConversions: 0
})
const selectedCampaign = ref<CampaignData | null>(null)
const dailyData = ref<CampaignDailyData[]>([])
const activeTab = ref('list')
const statusFilter = ref('')
const typeFilter = ref('')
const loading = ref(false)

// 标签页配置
const tabs = [
  { id: 'list', name: '活动列表', icon: List }
]

// 计算属性
const filteredCampaigns = computed(() => {
  let filtered = campaignData.value

  if (statusFilter.value) {
    filtered = filtered.filter(c => c.stage === statusFilter.value)
  }

  if (typeFilter.value) {
    filtered = filtered.filter(c => c.type === typeFilter.value)
  }

  return filtered
})

// 方法
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: '2-digit',
    day: '2-digit'
  })
}

const formatActivityDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    'active': '进行中',
    'completed': '已完成',
    'paused': '已暂停',
    'draft': '草稿'
  }
  return statusMap[status] || status
}

const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    'promotion': '促销活动',
    'acquisition': '获客活动',
    'seasonal': '季节性活动',
    'branding': '品牌推广',
    'retargeting': '重定向'
  }
  return typeMap[type] || type
}

const getStageText = (stage: string): string => {
  const stageMap: Record<string, string> = {
    'preparation': '准备中',
    'warmup': '预热',
    'official': '正式',
    'ended': '已结束'
  }
  return stageMap[stage] || stage
}

const loadCampaignData = async () => {
  loading.value = true
  try {
    const [dataResponse, summaryResponse] = await Promise.all([
      mockGetCampaignData(),
      mockGetCampaignSummary()
    ])

    if (dataResponse.success && dataResponse.data) {
      campaignData.value = dataResponse.data
    }

    if (summaryResponse.success && summaryResponse.data) {
      campaignSummary.value = summaryResponse.data
    }
  } catch (error) {
    console.error('加载活动数据失败:', error)
  } finally {
    loading.value = false
  }
}

const viewCampaignDetails = async (campaignId: number) => {
  try {
    const response = await mockGetCampaignDetails(campaignId)
    if (response.success && response.data) {
      selectedCampaign.value = response.data
      activeTab.value = 'details'

      // 同时加载单日数据
      const dailyResponse = await mockGetCampaignDailyData(campaignId)
      if (dailyResponse.success && dailyResponse.data) {
        dailyData.value = dailyResponse.data
      }
    }
  } catch (error) {
    console.error('获取活动详情失败:', error)
  }
}

const navigateToCampaignDetails = (campaignId: number) => {
  // 跳转到活动详情页面
  router.push(`/campaign/${campaignId}`)
}

const showAllCampaigns = () => {
  // 这里可以跳转到全部活动页面或打开模态框
  console.log('显示全部活动')
}

// 生命周期
onMounted(() => {
  loadCampaignData()
})
</script>

<style scoped>
.campaign-data-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.panel-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.panel-description {
  color: #6b7280;
  margin: 0;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  padding: 24px;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;
}

.summary-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.card-icon {
  width: 48px;
  height: 48px;
  background: #3b82f6;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.card-title {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.card-value {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.campaign-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tab-header {
  display: flex;
  align-items: center;
  padding: 0 24px;
  border-bottom: 1px solid #e5e7eb;
  background: white;
  gap: 8px;
}

.tab-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
}

.tab-button.active {
  color: #3b82f6;
  border-bottom-color: #3b82f6;
}

.tab-button:hover {
  color: #3b82f6;
}

.tab-actions {
  margin-left: auto;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background: #f3f4f6;
}

.tab-content {
  flex: 1;
  padding: 24px;
}

.campaign-list {
  max-width: 1400px;
}

.list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.list-header h3 {
  margin: 0;
  color: #1f2937;
}

.filter-controls {
  display: flex;
  gap: 12px;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  color: #374151;
  cursor: pointer;
}

.campaign-table-container {
  overflow-x: auto;
}

.campaign-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.campaign-table th,
.campaign-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.campaign-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.campaign-table tr:hover {
  background: #f9fafb;
}

.campaign-name {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.campaign-name .name {
  font-weight: 500;
  color: #1f2937;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  width: fit-content;
}

.status-active { background: #dcfce7; color: #166534; }
.status-completed { background: #e0e7ff; color: #3730a3; }
.status-paused { background: #fef3c7; color: #92400e; }
.status-draft { background: #f3f4f6; color: #374151; }

.stage-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.stage-preparation { background: #fef3c7; color: #92400e; }
.stage-warmup { background: #fed7aa; color: #c2410c; }
.stage-official { background: #dcfce7; color: #166534; }
.stage-ended { background: #f3f4f6; color: #374151; }

.channels {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
}

.channel-tag {
  padding: 2px 6px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 11px;
  color: #374151;
}

.channel-more {
  padding: 2px 6px;
  background: #e5e7eb;
  border-radius: 4px;
  font-size: 11px;
  color: #6b7280;
}

.currency {
  font-weight: 600;
  color: #059669;
}

.percentage {
  font-weight: 500;
}

.roi-value {
  font-weight: 600;
  color: #dc2626;
}

.detail-button {
  padding: 4px 12px;
  border: 1px solid #3b82f6;
  background: white;
  color: #3b82f6;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.2s;
}

.detail-button:hover {
  background: #3b82f6;
  color: white;
}

.campaign-details {
  max-width: 1200px;
}

.detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 24px;
}

.detail-header h3 {
  margin: 0 0 8px 0;
  color: #1f2937;
}

.campaign-meta {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.meta-item {
  padding: 4px 8px;
  background: #f3f4f6;
  border-radius: 4px;
  font-size: 12px;
  color: #6b7280;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.back-button:hover {
  background: #f3f4f6;
}

.campaign-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.content-description h4 {
  margin: 0 0 12px 0;
  color: #1f2937;
}

.content-description p {
  margin: 0;
  color: #6b7280;
  line-height: 1.6;
}

.detail-sections {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.detail-section h4 {
  margin: 0 0 16px 0;
  color: #1f2937;
  font-size: 18px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.platform-data {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.platform-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.platform-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.platform-icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
}

.platform-icon.google { background: #4285f4; }
.platform-icon.facebook { background: #1877f2; }
.platform-icon.bing { background: #00809d; }
.platform-icon.criteo { background: #ff6900; }

.platform-name {
  font-weight: 500;
  color: #1f2937;
}

.platform-metrics {
  display: flex;
  justify-content: space-between;
  gap: 16px;
}

.platform-metric {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.platform-metric .metric-label {
  font-size: 12px;
  color: #6b7280;
}

.platform-metric .metric-value {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.daily-data {
  max-width: 1400px;
}

.daily-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.daily-header h3 {
  margin: 0;
  color: #1f2937;
}

.daily-table-container {
  overflow-x: auto;
}

.daily-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 1200px;
}

.daily-table th,
.daily-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.daily-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  font-size: 12px;
}

.daily-table tr:hover {
  background: #f9fafb;
}

.date-cell {
  font-weight: 500;
  color: #1f2937;
}

.platform-cell {
  text-align: center;
}

.platform-data {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.platform-spend {
  font-size: 12px;
  color: #6b7280;
}

.platform-roi {
  font-size: 12px;
  font-weight: 500;
  color: #dc2626;
}

.no-selection,
.no-daily-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
  text-align: center;
}

.no-selection svg,
.no-daily-data svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: 1fr;
  }

  .tab-header {
    flex-wrap: wrap;
    gap: 4px;
  }

  .tab-actions {
    margin-left: 0;
    margin-top: 8px;
  }

  .filter-controls {
    flex-direction: column;
    gap: 8px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .platform-data {
    grid-template-columns: 1fr;
  }

  .detail-header {
    flex-direction: column;
    gap: 16px;
  }

  .campaign-meta {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
