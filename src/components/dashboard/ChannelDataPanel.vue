<template>
  <div class="channel-data-panel">
    <div class="panel-header">
      <h2 class="panel-title">渠道数据</h2>
      <p class="panel-description">查看各流量渠道的表现数据和详细分析</p>
    </div>

    <!-- 数据汇总卡片 -->
    <div class="summary-cards">
      <div class="summary-card">
        <div class="card-icon">
          <DollarSign :size="24" />
        </div>
        <div class="card-content">
          <div class="card-title">总收入</div>
          <div class="card-value">${{ formatNumber(channelSummary.totalRevenue) }}</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon">
          <Users :size="24" />
        </div>
        <div class="card-content">
          <div class="card-title">总用户数</div>
          <div class="card-value">{{ formatNumber(channelSummary.totalUsers) }}</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon">
          <MousePointer :size="24" />
        </div>
        <div class="card-content">
          <div class="card-title">总会话数</div>
          <div class="card-value">{{ formatNumber(channelSummary.totalSessions) }}</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon">
          <Target :size="24" />
        </div>
        <div class="card-content">
          <div class="card-title">平均转化率</div>
          <div class="card-value">{{ channelSummary.averageConversionRate }}%</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon">
          <TrendingUp :size="24" />
        </div>
        <div class="card-content">
          <div class="card-title">平均ROI</div>
          <div class="card-value">{{ channelSummary.averageROI }}x</div>
        </div>
      </div>

      <div class="summary-card">
        <div class="card-icon">
          <Award :size="24" />
        </div>
        <div class="card-content">
          <div class="card-title">最佳渠道</div>
          <div class="card-value">{{ channelSummary.topPerformingChannel }}</div>
        </div>
      </div>
    </div>

    <!-- 渠道数据标签页 -->
    <div class="channel-tabs">
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
          <button class="action-button" @click="showCustomDimensionModal = true">
            <Settings :size="16" />
            自定义维度
          </button>
        </div>
      </div>

      <div class="tab-content">
        <!-- 总数据标签页 -->
        <div v-if="activeTab === 'summary'" class="tab-pane">
          <div class="data-table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>渠道名称</th>
                  <th>会话来源/媒介</th>
                  <th>总收入</th>
                  <th>总用户数</th>
                  <th>交易次数</th>
                  <th>用户转化率</th>
                  <th>会话数</th>
                  <th>跳出率</th>
                  <th>操作</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="channel in channelData" :key="channel.id">
                  <td>
                    <div class="channel-name">
                      <div class="channel-icon" :class="`channel-${channel.type}`"></div>
                      {{ channel.name }}
                    </div>
                  </td>
                  <td>{{ channel.sessionSourceMedium }}</td>
                  <td class="currency">${{ formatNumber(channel.totalRevenue) }}</td>
                  <td>{{ formatNumber(channel.totalUsers) }}</td>
                  <td>{{ formatNumber(channel.transactions) }}</td>
                  <td class="percentage">{{ channel.userConversionRate }}%</td>
                  <td>{{ formatNumber(channel.sessions) }}</td>
                  <td class="percentage">{{ channel.bounceRate }}%</td>
                  <td>
                    <button
                      class="detail-button"
                      @click="viewChannelDetails(channel.id)"
                    >
                      查看详情
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 单个渠道详情标签页 -->
        <div v-else-if="activeTab === 'details'" class="tab-pane">
          <div v-if="selectedChannel" class="channel-details">
            <div class="detail-header">
              <h3>{{ selectedChannel.name }} - 详细数据</h3>
              <button class="back-button" @click="activeTab = 'summary'">
                <ArrowLeft :size="16" />
                返回总览
              </button>
            </div>

            <div class="detail-sections">
              <!-- 结果指标 -->
              <div class="detail-section">
                <h4>结果指标</h4>
                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-label">总收入</div>
                    <div class="metric-value">${{ formatNumber(selectedChannel.totalRevenue) }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">总用户数</div>
                    <div class="metric-value">{{ formatNumber(selectedChannel.totalUsers) }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">平均购买收入</div>
                    <div class="metric-value">${{ selectedChannel.averagePurchaseRevenue }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">交易次数</div>
                    <div class="metric-value">{{ formatNumber(selectedChannel.transactions) }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">用户转化率</div>
                    <div class="metric-value">{{ selectedChannel.userConversionRate }}%</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">跳出率</div>
                    <div class="metric-value">{{ selectedChannel.bounceRate }}%</div>
                  </div>
                </div>
              </div>

              <!-- 过程指标 -->
              <div class="detail-section">
                <h4>过程指标</h4>
                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-label">添加到购物车次数</div>
                    <div class="metric-value">{{ formatNumber(selectedChannel.addToCarts) }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">开始结账次数</div>
                    <div class="metric-value">{{ formatNumber(selectedChannel.checkouts) }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">商品添加至购物车率</div>
                    <div class="metric-value">{{ selectedChannel.itemAddToCartsRate }}%</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">商品结账率</div>
                    <div class="metric-value">{{ selectedChannel.itemCheckoutsRate }}%</div>
                  </div>
                </div>
              </div>

              <!-- 用户指标 -->
              <div class="detail-section">
                <h4>用户指标</h4>
                <div class="metrics-grid">
                  <div class="metric-card">
                    <div class="metric-label">会话数</div>
                    <div class="metric-value">{{ formatNumber(selectedChannel.sessions) }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">新用户数</div>
                    <div class="metric-value">{{ formatNumber(selectedChannel.newUsers) }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">回访用户数</div>
                    <div class="metric-value">{{ formatNumber(selectedChannel.returningUsers) }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">每用户平均购买收入</div>
                    <div class="metric-value">${{ selectedChannel.averagePurchaseRevenuePerUser }}</div>
                  </div>
                  <div class="metric-card">
                    <div class="metric-label">平均每位客户订单数</div>
                    <div class="metric-value">{{ selectedChannel.averageOrdersPerCustomer }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="no-selection">
            <FileText :size="48" />
            <p>请从总数据中选择一个渠道查看详情</p>
          </div>
        </div>

        <!-- 自定义数据视图 -->
        <div v-else-if="activeTab === 'custom'" class="tab-pane">
          <div v-if="customData.length > 0" class="custom-data-view">
            <div class="custom-header">
              <h3>自定义数据视图</h3>
              <button class="edit-button" @click="showCustomDimensionModal = true">
                <Edit :size="16" />
                编辑维度
              </button>
            </div>

            <div class="custom-table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>渠道名称</th>
                    <th v-for="dimension in selectedDimensions" :key="dimension.id">
                      {{ dimension.name }}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="item in customData" :key="item.id">
                    <td>{{ item.name }}</td>
                    <td v-for="dimension in selectedDimensions" :key="dimension.id">
                      {{ formatValue(item[dimension.id], dimension.format) }}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div v-else class="no-custom-data">
            <Settings :size="48" />
            <p>请点击"自定义维度"按钮选择要查看的数据维度</p>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义维度模态框 -->
    <div v-if="showCustomDimensionModal" class="modal-overlay" @click="showCustomDimensionModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>自定义数据维度</h3>
          <button class="close-button" @click="showCustomDimensionModal = false">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-body">
          <div class="dimension-categories">
            <div v-for="category in dimensionCategories" :key="category.id" class="category-section">
              <h4>{{ category.name }}</h4>
              <div class="dimension-list">
                <label
                  v-for="dimension in category.dimensions"
                  :key="dimension.id"
                  class="dimension-item"
                >
                  <input
                    type="checkbox"
                    :checked="dimension.selected"
                    @change="toggleDimension(dimension)"
                  />
                  <span class="dimension-name">{{ dimension.name }}</span>
                  <span class="dimension-description">{{ dimension.description }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-button" @click="showCustomDimensionModal = false">
            取消
          </button>
          <button class="confirm-button" @click="applyCustomDimensions">
            应用设置
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import {
  DollarSign, Users, MousePointer, Target, TrendingUp, Award,
  BarChart3, FileText, Settings, Edit, ArrowLeft, X
} from 'lucide-vue-next'
import type { ChannelData, ChannelSummary, ChannelDimension } from '@/types'
import {
  mockGetChannelData,
  mockGetChannelSummary,
  mockGetChannelDetails,
  mockGetChannelDimensions,
  mockUpdateChannelDimensions,
  mockGetCustomChannelData
} from '@/mock/dashboard'

// 响应式数据
const channelData = ref<ChannelData[]>([])
const channelSummary = ref<ChannelSummary>({
  totalRevenue: 0,
  totalUsers: 0,
  totalSessions: 0,
  averageConversionRate: 0,
  totalCost: 0,
  averageROI: 0,
  topPerformingChannel: '',
  channelCount: 0
})
const dimensions = ref<ChannelDimension[]>([])
const selectedChannel = ref<ChannelData | null>(null)
const customData = ref<any[]>([])
const showCustomDimensionModal = ref(false)
const activeTab = ref('summary')
const loading = ref(false)

// 标签页配置
const tabs = [
  { id: 'summary', name: '总数据', icon: BarChart3 },
  { id: 'details', name: '渠道详情', icon: FileText },
  { id: 'custom', name: '自定义视图', icon: Settings }
]

// 计算属性
const dimensionCategories = computed(() => {
  const categories = [
    { id: 'dimension', name: '维度', dimensions: [] as ChannelDimension[] },
    { id: 'result', name: '结果指标', dimensions: [] as ChannelDimension[] },
    { id: 'process', name: '过程指标', dimensions: [] as ChannelDimension[] },
    { id: 'user', name: '用户指标', dimensions: [] as ChannelDimension[] }
  ]

  dimensions.value.forEach(dim => {
    const category = categories.find(c => c.id === dim.category)
    if (category) {
      category.dimensions.push(dim)
    }
  })

  return categories
})

const selectedDimensions = computed(() => {
  return dimensions.value.filter(d => d.selected)
})

// 方法
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

const formatValue = (value: any, format: string): string => {
  if (value === null || value === undefined) return '-'

  switch (format) {
    case 'currency':
      return `$${formatNumber(value)}`
    case 'percentage':
      return `${value}%`
    case 'number':
      return formatNumber(value)
    default:
      return String(value)
  }
}

const loadChannelData = async () => {
  loading.value = true
  try {
    const [dataResponse, summaryResponse, dimensionsResponse] = await Promise.all([
      mockGetChannelData(),
      mockGetChannelSummary(),
      mockGetChannelDimensions()
    ])

    if (dataResponse.success && dataResponse.data) {
      channelData.value = dataResponse.data
    }

    if (summaryResponse.success && summaryResponse.data) {
      channelSummary.value = summaryResponse.data
    }

    if (dimensionsResponse.success && dimensionsResponse.data) {
      dimensions.value = dimensionsResponse.data
    }
  } catch (error) {
    console.error('加载渠道数据失败:', error)
  } finally {
    loading.value = false
  }
}

const viewChannelDetails = async (channelId: number) => {
  try {
    const response = await mockGetChannelDetails(channelId)
    if (response.success && response.data) {
      selectedChannel.value = response.data
      activeTab.value = 'details'
    }
  } catch (error) {
    console.error('获取渠道详情失败:', error)
  }
}

const toggleDimension = (dimension: ChannelDimension) => {
  dimension.selected = !dimension.selected
}

const applyCustomDimensions = async () => {
  try {
    await mockUpdateChannelDimensions(dimensions.value)

    const selectedDimIds = dimensions.value
      .filter(d => d.selected)
      .map(d => d.id)

    if (selectedDimIds.length > 0) {
      const response = await mockGetCustomChannelData(selectedDimIds)
      if (response.success && response.data) {
        customData.value = response.data
        activeTab.value = 'custom'
      }
    }

    showCustomDimensionModal.value = false
  } catch (error) {
    console.error('应用自定义维度失败:', error)
  }
}

// 生命周期
onMounted(() => {
  loadChannelData()
})
</script>

<style scoped>
.channel-data-panel {
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

.channel-tabs {
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

.data-table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
}

.data-table tr:hover {
  background: #f9fafb;
}

.channel-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.channel-icon {
  width: 20px;
  height: 20px;
  border-radius: 4px;
}

.channel-google { background: #4285f4; }
.channel-facebook { background: #1877f2; }
.channel-direct { background: #6b7280; }
.channel-email { background: #f59e0b; }
.channel-criteo { background: #ff6900; }
.channel-bing { background: #00809d; }
.channel-pinterest { background: #e60023; }
.channel-organic { background: #16a34a; }

.currency {
  font-weight: 600;
  color: #059669;
}

.percentage {
  font-weight: 500;
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

.channel-details {
  max-width: 1200px;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.detail-header h3 {
  margin: 0;
  color: #1f2937;
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

.no-selection,
.no-custom-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #6b7280;
  text-align: center;
}

.no-selection svg,
.no-custom-data svg {
  margin-bottom: 16px;
  opacity: 0.5;
}

.custom-data-view {
  max-width: 1200px;
}

.custom-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 24px;
}

.custom-header h3 {
  margin: 0;
  color: #1f2937;
}

.edit-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  background: white;
  color: #3b82f6;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-button:hover {
  background: #3b82f6;
  color: white;
}

.custom-table-container {
  overflow-x: auto;
}

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

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  color: #1f2937;
}

.close-button {
  border: none;
  background: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s;
}

.close-button:hover {
  background: #f3f4f6;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.dimension-categories {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.category-section h4 {
  margin: 0 0 12px 0;
  color: #1f2937;
  font-size: 16px;
}

.dimension-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dimension-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
}

.dimension-item:hover {
  background: #f3f4f6;
}

.dimension-item input[type="checkbox"] {
  margin: 0;
}

.dimension-name {
  font-weight: 500;
  color: #374151;
  min-width: 200px;
}

.dimension-description {
  color: #6b7280;
  font-size: 14px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

.cancel-button {
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button:hover {
  background: #f3f4f6;
}

.confirm-button {
  padding: 8px 16px;
  border: 1px solid #3b82f6;
  background: #3b82f6;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-button:hover {
  background: #2563eb;
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

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .modal-content {
    width: 95%;
    max-height: 90vh;
  }
}
</style>
