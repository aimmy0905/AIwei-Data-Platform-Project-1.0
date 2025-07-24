<template>
  <div class="activity-detail">
    <!-- 加载状态 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>加载活动详情中...</p>
    </div>

    <!-- 活动详情内容 -->
    <div v-else-if="activityDetail" class="activity-content">
      <!-- 页面头部 -->
      <div class="page-header">
        <div class="header-content">
          <div class="header-left">
            <div class="breadcrumb">
              <router-link to="/projects/activities" class="breadcrumb-link">
                <ArrowLeft :size="16" />
                活动管理
              </router-link>
              <span class="breadcrumb-separator">/</span>
              <span class="breadcrumb-current">活动详情</span>
            </div>
            <h1 class="page-title">{{ activityDetail.name }}</h1>
            <div class="page-meta">
              <span class="status-badge" :class="activityDetail.status">
                {{ getStatusText(activityDetail.status) }}
              </span>
              <span class="type-badge" :class="activityDetail.type">
                {{ getTypeText(activityDetail.type) }}
              </span>
              <span class="stage-badge" :class="activityDetail.stage">
                {{ getStageText(activityDetail.stage) }}
              </span>
            </div>
          </div>
          <div class="header-right">
            <button class="btn btn-outline" @click="exportData">
              <Download :size="16" />
              导出数据
            </button>
            <button class="btn btn-primary" @click="editActivity">
              <Edit :size="16" />
              编辑活动
            </button>
          </div>
        </div>
      </div>

      <!-- 活动基础信息 -->
      <div class="info-section">
        <div class="info-grid">
          <div class="info-card">
            <h3>基础信息</h3>
            <div class="info-content">
              <div class="info-item">
                <label>活动名称：</label>
                <span>{{ activityDetail.name }}</span>
              </div>
              <div class="info-item">
                <label>活动内容：</label>
                <span>{{ activityDetail.content }}</span>
              </div>
              <div class="info-item">
                <label>目标市场：</label>
                <span>{{ activityDetail.targetMarket }}</span>
              </div>
              <div class="info-item">
                <label>关联项目：</label>
                <span>{{ activityDetail.projectName }}</span>
              </div>
              <div class="info-item">
                <label>负责人：</label>
                <span>{{ activityDetail.ownerName }}</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>时间信息</h3>
            <div class="info-content">
              <div class="info-item">
                <label>活动时间：</label>
                <span>{{ formatDateRange(activityDetail.startTime, activityDetail.endTime) }}</span>
              </div>
              <div class="info-item">
                <label>创建时间：</label>
                <span>{{ formatDateTime(activityDetail.createdAt) }}</span>
              </div>
              <div class="info-item">
                <label>更新时间：</label>
                <span>{{ formatDateTime(activityDetail.updatedAt) }}</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>目标设置</h3>
            <div class="info-content">
              <div class="info-item">
                <label>活动预算：</label>
                <span>${{ formatNumber(activityDetail.budget) }}</span>
              </div>
              <div class="info-item">
                <label>目标销售额：</label>
                <span>${{ formatNumber(activityDetail.targetSales) }}</span>
              </div>
              <div class="info-item">
                <label>目标ROI：</label>
                <span>{{ activityDetail.targetROI }}</span>
              </div>
              <div class="info-item">
                <label>目标转化率：</label>
                <span>{{ activityDetail.targetConversionRate }}%</span>
              </div>
            </div>
          </div>

          <div class="info-card">
            <h3>参与渠道</h3>
            <div class="info-content">
              <div class="channels-list">
                <span
                  v-for="channel in activityDetail.channels"
                  :key="channel"
                  class="channel-tag"
                >
                  {{ channel }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

            <!-- 状态管理 -->
      <div class="status-section">
        <ActivityStatusManager
          :activity="activityDetail"
          @statusChanged="handleStatusChanged"
        />
      </div>

      <!-- 数据概览 -->
      <div class="overview-section">
        <h2 class="section-title">数据概览</h2>

        <!-- 趋势图表 -->
        <div class="chart-section" v-if="activityDetail.dailyData.length > 0">
          <ActivityTrendChart
            title="活动数据趋势"
            :data="activityDetail.dailyData"
            :width="800"
            :height="300"
          />
        </div>

        <div class="overview-grid">
          <div class="overview-card">
            <div class="overview-icon">
              <DollarSign :size="24" />
            </div>
            <div class="overview-content">
              <h3>${{ formatNumber(activityDetail.overview.totalSales) }}</h3>
              <p>总销售额</p>
              <div class="change-indicator" :class="getChangeClass(activityDetail.overview.salesChange)">
                <TrendingUp v-if="(activityDetail.overview.salesChange || 0) > 0" :size="14" />
                <TrendingDown v-else :size="14" />
                <span>{{ Math.abs(activityDetail.overview.salesChange || 0) }}%</span>
              </div>
            </div>
          </div>

          <div class="overview-card">
            <div class="overview-icon">
              <Target :size="24" />
            </div>
            <div class="overview-content">
              <h3>{{ activityDetail.overview.roi.toFixed(2) }}</h3>
              <p>ROI</p>
              <div class="change-indicator" :class="getChangeClass(activityDetail.overview.roiChange)">
                <TrendingUp v-if="(activityDetail.overview.roiChange || 0) > 0" :size="14" />
                <TrendingDown v-else :size="14" />
                <span>{{ Math.abs(activityDetail.overview.roiChange || 0) }}%</span>
              </div>
            </div>
          </div>

          <div class="overview-card">
            <div class="overview-icon">
              <ShoppingCart :size="24" />
            </div>
            <div class="overview-content">
              <h3>{{ formatNumber(activityDetail.overview.orderCount) }}</h3>
              <p>订单数量</p>
              <div class="change-indicator" :class="getChangeClass(activityDetail.overview.orderCountChange)">
                <TrendingUp v-if="(activityDetail.overview.orderCountChange || 0) > 0" :size="14" />
                <TrendingDown v-else :size="14" />
                <span>{{ Math.abs(activityDetail.overview.orderCountChange || 0) }}%</span>
              </div>
            </div>
          </div>

          <div class="overview-card">
            <div class="overview-icon">
              <Users :size="24" />
            </div>
            <div class="overview-content">
              <h3>{{ formatNumber(activityDetail.overview.userCount) }}</h3>
              <p>用户数量</p>
            </div>
          </div>

          <div class="overview-card">
            <div class="overview-icon">
              <Percent :size="24" />
            </div>
            <div class="overview-content">
              <h3>{{ activityDetail.overview.conversionRate.toFixed(2) }}%</h3>
              <p>转化率</p>
              <div class="change-indicator" :class="getChangeClass(activityDetail.overview.conversionRateChange)">
                <TrendingUp v-if="(activityDetail.overview.conversionRateChange || 0) > 0" :size="14" />
                <TrendingDown v-else :size="14" />
                <span>{{ Math.abs(activityDetail.overview.conversionRateChange || 0) }}%</span>
              </div>
            </div>
          </div>

          <div class="overview-card">
            <div class="overview-icon">
              <CreditCard :size="24" />
            </div>
            <div class="overview-content">
              <h3>${{ formatNumber(activityDetail.overview.avgOrderValue) }}</h3>
              <p>平均客单价</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据表格选项卡 -->
      <div class="data-section">
        <div class="section-header">
          <h2 class="section-title">详细数据</h2>
          <div class="tab-controls">
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'daily' }"
              @click="activeTab = 'daily'"
            >
              <Calendar :size="16" />
              单日数据
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'product' }"
              @click="activeTab = 'product'"
            >
              <Package :size="16" />
              产品数据
            </button>
            <button
              class="tab-btn"
              :class="{ active: activeTab === 'page' }"
              @click="activeTab = 'page'"
            >
              <Globe :size="16" />
              页面数据
            </button>
          </div>
        </div>

        <!-- 单日数据表 -->
        <div v-if="activeTab === 'daily'" class="data-table-container">
          <div class="table-header">
            <h3>单日数据表</h3>
            <button class="btn btn-outline btn-sm" @click="exportDailyData">
              <Download :size="14" />
              导出
            </button>
          </div>
          <div class="data-table">
            <table>
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
                  <th>Google花费</th>
                  <th>Google收入</th>
                  <th>Facebook花费</th>
                  <th>Facebook收入</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="data in activityDetail.dailyData" :key="data.id">
                  <td>{{ formatDate(data.date) }}</td>
                  <td>${{ formatNumber(data.totalSales) }}</td>
                  <td>${{ formatNumber(data.adSpend) }}</td>
                  <td>{{ data.roi.toFixed(2) }}</td>
                  <td>{{ formatNumber(data.orderCount) }}</td>
                  <td>${{ formatNumber(data.avgOrderValue) }}</td>
                  <td>${{ formatNumber(data.totalSales * 0.8) }}</td>
                  <td>{{ (data.totalSales * 0.8 / data.adSpend).toFixed(2) }}</td>
                  <td>${{ formatNumber(data.googleSpend) }}</td>
                  <td>${{ formatNumber(data.googleRevenue) }}</td>
                  <td>${{ formatNumber(data.facebookSpend) }}</td>
                  <td>${{ formatNumber(data.facebookRevenue) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 产品数据表 -->
        <div v-else-if="activeTab === 'product'" class="data-table-container">
          <div class="table-header">
            <h3>产品数据表</h3>
            <div class="table-actions">
              <select v-model="productSortBy" class="form-select" @change="sortProductData">
                <option value="salesAmount">按销售额排序</option>
                <option value="salesVolume">按销量排序</option>
                <option value="conversionRate">按转化率排序</option>
                <option value="avgOrderValue">按客单价排序</option>
                <option value="userCount">按用户数排序</option>
              </select>
              <button class="btn btn-outline btn-sm" @click="exportProductData">
                <Download :size="14" />
                导出
              </button>
            </div>
          </div>
          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>产品标题</th>
                  <th>产品品类</th>
                  <th>用户数</th>
                  <th>销量</th>
                  <th>销售额</th>
                  <th>转化率</th>
                  <th>客单价</th>
                  <th>加购数</th>
                  <th>加购率</th>
                  <th>结账数</th>
                  <th>结账率</th>
                  <th>退货数</th>
                  <th>退款金额</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="product in activityDetail.productData" :key="product.id">
                  <td>
                    <div class="product-title">
                      {{ product.productTitle }}
                      <small>ID: {{ product.productId }}</small>
                    </div>
                  </td>
                  <td>{{ product.productCategory }}</td>
                  <td>
                    {{ formatNumber(product.userCount) }}
                    <span v-if="product.momData" class="change-small" :class="getChangeClass(product.momData.userCountChange)">
                      {{ product.momData.userCountChange > 0 ? '+' : '' }}{{ product.momData.userCountChange.toFixed(1) }}%
                    </span>
                  </td>
                  <td>
                    {{ formatNumber(product.salesVolume) }}
                    <span v-if="product.momData" class="change-small" :class="getChangeClass(product.momData.salesVolumeChange)">
                      {{ product.momData.salesVolumeChange > 0 ? '+' : '' }}{{ product.momData.salesVolumeChange.toFixed(1) }}%
                    </span>
                  </td>
                  <td>
                    ${{ formatNumber(product.salesAmount) }}
                    <span v-if="product.momData" class="change-small" :class="getChangeClass(product.momData.salesAmountChange)">
                      {{ product.momData.salesAmountChange > 0 ? '+' : '' }}{{ product.momData.salesAmountChange.toFixed(1) }}%
                    </span>
                  </td>
                  <td>
                    {{ product.conversionRate.toFixed(2) }}%
                    <span v-if="product.momData" class="change-small" :class="getChangeClass(product.momData.conversionRateChange)">
                      {{ product.momData.conversionRateChange > 0 ? '+' : '' }}{{ product.momData.conversionRateChange.toFixed(1) }}%
                    </span>
                  </td>
                  <td>${{ formatNumber(product.avgOrderValue) }}</td>
                  <td>{{ formatNumber(product.addToCartCount) }}</td>
                  <td>{{ product.addToCartRate.toFixed(2) }}%</td>
                  <td>{{ formatNumber(product.checkoutCount) }}</td>
                  <td>{{ product.checkoutRate.toFixed(2) }}%</td>
                  <td>{{ formatNumber(product.returnCount) }}</td>
                  <td>${{ formatNumber(product.returnAmount) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 页面数据表 -->
        <div v-else-if="activeTab === 'page'" class="data-table-container">
          <div class="table-header">
            <h3>页面数据表</h3>
            <div class="table-actions">
              <select v-model="pageSortBy" class="form-select" @change="sortPageData">
                <option value="visitCount">按访问数排序</option>
                <option value="userCount">按用户数排序</option>
                <option value="conversionRate">按转化率排序</option>
                <option value="bounceRate">按跳出率排序</option>
                <option value="avgStayTime">按停留时长排序</option>
              </select>
              <button class="btn btn-outline btn-sm" @click="exportPageData">
                <Download :size="14" />
                导出
              </button>
            </div>
          </div>
          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>页面链接</th>
                  <th>访问数</th>
                  <th>用户数</th>
                  <th>新客户数</th>
                  <th>转化率</th>
                  <th>加购数</th>
                  <th>加购率</th>
                  <th>结账数</th>
                  <th>结账率</th>
                  <th>跳出率</th>
                  <th>停留时长</th>
                  <th>页面浏览量</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="page in activityDetail.pageData" :key="page.id">
                  <td>
                    <div class="page-url">
                      <a :href="page.pageUrl" target="_blank" class="url-link">
                        {{ getPageTitle(page.pageUrl) }}
                      </a>
                      <small>{{ page.pageUrl }}</small>
                    </div>
                  </td>
                  <td>
                    {{ formatNumber(page.visitCount) }}
                    <span v-if="page.momData" class="change-small" :class="getChangeClass(page.momData.visitCountChange)">
                      {{ page.momData.visitCountChange > 0 ? '+' : '' }}{{ page.momData.visitCountChange.toFixed(1) }}%
                    </span>
                  </td>
                  <td>
                    {{ formatNumber(page.userCount) }}
                    <span v-if="page.momData" class="change-small" :class="getChangeClass(page.momData.userCountChange)">
                      {{ page.momData.userCountChange > 0 ? '+' : '' }}{{ page.momData.userCountChange.toFixed(1) }}%
                    </span>
                  </td>
                  <td>{{ formatNumber(page.newUserCount) }}</td>
                  <td>{{ page.conversionRate.toFixed(2) }}%</td>
                  <td>{{ formatNumber(page.addToCartCount) }}</td>
                  <td>{{ page.addToCartRate.toFixed(2) }}%</td>
                  <td>{{ formatNumber(page.checkoutCount) }}</td>
                  <td>{{ page.checkoutRate.toFixed(2) }}%</td>
                  <td>{{ page.bounceRate.toFixed(2) }}%</td>
                  <td>{{ formatDuration(page.avgStayTime) }}</td>
                  <td>{{ page.pageViewsPerVisit.toFixed(1) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 错误状态 -->
    <div v-else class="error-state">
      <AlertCircle :size="64" class="error-icon" />
      <h3>活动不存在</h3>
      <p>您访问的活动可能已被删除或不存在</p>
      <router-link to="/projects/activities" class="btn btn-primary">
        返回活动列表
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Edit, Download, DollarSign, Target, ShoppingCart, Users, Percent, CreditCard,
  TrendingUp, TrendingDown, Calendar, Package, Globe, AlertCircle, RefreshCw, Minus,
  Filter, SortAsc, SortDesc
} from 'lucide-vue-next'
import type { ActivityDetail, Activity } from '@/types'
import { mockGetActivityDetail } from '@/mock/activities'
import ActivityTrendChart from '@/components/charts/ActivityTrendChart.vue'
import ActivityStatusManager from '@/components/projects/ActivityStatusManager.vue'

const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(false)
const activityDetail = ref<ActivityDetail | null>(null)
const activeTab = ref('daily')

// 排序和筛选状态
const productSortBy = ref('salesAmount')
const productSortOrder = ref<'asc' | 'desc'>('desc')
const pageSortBy = ref('visitCount')
const pageSortOrder = ref<'asc' | 'desc'>('desc')
const dailySortBy = ref('date')
const dailySortOrder = ref<'asc' | 'desc'>('desc')

// 方法
const loadActivityDetail = async () => {
  const activityId = parseInt(route.params.id as string)
  if (!activityId) {
    return
  }

  loading.value = true
  try {
    const response = await mockGetActivityDetail(activityId)
    if (response.success && response.data) {
      activityDetail.value = response.data
    }
  } catch (error) {
    console.error('加载活动详情失败:', error)
  } finally {
    loading.value = false
  }
}

const editActivity = () => {
  // 跳转回活动管理页面并打开编辑弹窗
  router.push({
    name: 'activity-management',
    query: { edit: activityDetail.value?.id }
  })
}

const exportData = () => {
  console.log('导出活动数据')
}

const exportDailyData = () => {
  console.log('导出单日数据')
}

const exportProductData = () => {
  console.log('导出产品数据')
}

const exportPageData = () => {
  console.log('导出页面数据')
}

// 格式化函数
const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('zh-CN').format(value)
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatDateRange = (startDate: string, endDate: string): string => {
  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}分${remainingSeconds}秒`
}

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    warm_up: '预热中',
    running: '进行中',
    ended: '已结束',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const getTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    promotion: '促销活动',
    brand: '品牌推广',
    holiday: '节日活动',
    other: '其他'
  }
  return typeMap[type] || type
}

const getStageText = (stage: string): string => {
  const stageMap: Record<string, string> = {
    warm_up: '预热',
    formal: '正式'
  }
  return stageMap[stage] || stage
}

const getChangeClass = (change?: number): string => {
  if (!change) return ''
  return change > 0 ? 'positive' : 'negative'
}

const getPageTitle = (url: string): string => {
  const urlParts = url.split('/')
  const lastPart = urlParts[urlParts.length - 1]
  return lastPart || '首页'
}

const handleStatusChanged = (updatedActivity: Activity) => {
  // 更新活动详情数据
  if (activityDetail.value) {
    activityDetail.value.status = updatedActivity.status
    activityDetail.value.updatedAt = updatedActivity.updatedAt
  }
}

// 数据排序方法
const sortProductData = () => {
  if (!activityDetail.value?.productData) return

  const sortField = productSortBy.value
  const order = productSortOrder.value

  activityDetail.value.productData.sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a]
    let bValue: any = b[sortField as keyof typeof b]

    if (aValue === undefined) aValue = 0
    if (bValue === undefined) bValue = 0

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
}

const sortPageData = () => {
  if (!activityDetail.value?.pageData) return

  const sortField = pageSortBy.value
  const order = pageSortOrder.value

  activityDetail.value.pageData.sort((a, b) => {
    let aValue: any = a[sortField as keyof typeof a]
    let bValue: any = b[sortField as keyof typeof b]

    if (aValue === undefined) aValue = 0
    if (bValue === undefined) bValue = 0

    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase()
      bValue = (bValue as string).toLowerCase()
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
}

const sortDailyData = () => {
  if (!activityDetail.value?.dailyData) return

  const sortField = dailySortBy.value
  const order = dailySortOrder.value

  activityDetail.value.dailyData.sort((a, b) => {
    let aValue = a[sortField as keyof typeof a]
    let bValue = b[sortField as keyof typeof b]

    if (sortField === 'date') {
      aValue = new Date(aValue as string).getTime()
      bValue = new Date(bValue as string).getTime()
    }

    if (order === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
}

// 数据刷新方法
const refreshDailyData = async () => {
  await loadActivityDetail()
}



// 生命周期
onMounted(() => {
  loadActivityDetail()
})
</script>

<style scoped>
.activity-detail {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

/* 加载和错误状态 */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: #666;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  color: #f44336;
  margin-bottom: 16px;
}

/* 页面头部 */
.page-header {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
}

.breadcrumb-link {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #1976d2;
  text-decoration: none;
  transition: color 0.2s;
}

.breadcrumb-link:hover {
  color: #1565c0;
}

.breadcrumb-separator {
  color: #666;
}

.breadcrumb-current {
  color: #666;
}

.page-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 12px 0;
}

.page-meta {
  display: flex;
  gap: 8px;
}

.status-badge, .type-badge, .stage-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.warm_up {
  background: #fff3cd;
  color: #856404;
}

.status-badge.running {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.ended {
  background: #d4edda;
  color: #155724;
}

.status-badge.cancelled {
  background: #f8d7da;
  color: #721c24;
}

.type-badge.promotion {
  background: #e3f2fd;
  color: #1976d2;
}

.type-badge.brand {
  background: #f3e5f5;
  color: #7b1fa2;
}

.type-badge.holiday {
  background: #fff3e0;
  color: #f57c00;
}

.type-badge.other {
  background: #f5f5f5;
  color: #616161;
}

.stage-badge.warm_up {
  background: #fff8e1;
  color: #ff8f00;
}

.stage-badge.formal {
  background: #e8f5e8;
  color: #2e7d32;
}

.header-right {
  display: flex;
  gap: 12px;
}

/* 基础信息区域 */
.info-section {
  margin-bottom: 24px;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.info-card h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}

.info-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
}

.info-item label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
  flex-shrink: 0;
}

.info-item span {
  color: #1a1a1a;
  line-height: 1.4;
}

.channels-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.channel-tag {
  padding: 4px 8px;
  background: #e3f2fd;
  color: #1976d2;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

/* 数据概览区域 */
.overview-section {
  margin-bottom: 24px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 20px 0;
}

.chart-section {
  margin-bottom: 24px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.overview-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
}

.overview-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: #e3f2fd;
  color: #1976d2;
  flex-shrink: 0;
}

.overview-content h3 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.overview-content p {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
}

.change-indicator {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.change-indicator.positive {
  color: #2e7d32;
}

.change-indicator.negative {
  color: #d32f2f;
}

/* 数据表格区域 */
.data-section {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.tab-controls {
  display: flex;
  gap: 4px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #e0e0e0;
  background: white;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn:hover {
  background: #f5f5f5;
  border-color: #1976d2;
}

.tab-btn.active {
  background: #1976d2;
  color: white;
  border-color: #1976d2;
}

.data-table-container {
  padding: 24px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-header h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.data-table {
  overflow-x: auto;
  border: 1px solid #e0e0e0;
  border-radius: 4px;
}

.data-table table {
  width: 100%;
  border-collapse: collapse;
  min-width: 800px;
}

.data-table th {
  background: #f8f9fa;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
}

.data-table td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

.data-table tr:hover {
  background: #f8f9fa;
}

.product-title, .page-url {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-title small, .page-url small {
  color: #666;
  font-size: 12px;
}

.url-link {
  color: #1976d2;
  text-decoration: none;
  font-weight: 500;
}

.url-link:hover {
  text-decoration: underline;
}

.change-small {
  display: block;
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
}

.change-small.positive {
  color: #2e7d32;
}

.change-small.negative {
  color: #d32f2f;
}

/* 按钮样式 */
.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:hover {
  background: #1565c0;
}

.btn-outline {
  background: transparent;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.btn-outline:hover {
  background: #1976d2;
  color: white;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

/* 状态管理区域样式 */
.status-section {
  margin-bottom: 24px;
}

/* 数据表格增强样式 */
.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.form-select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

/* 数据表格样式增强 */
.data-table table {
  border-collapse: collapse;
  border-spacing: 0;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
  padding: 12px 8px;
  text-align: left;
  border-bottom: 2px solid #e0e0e0;
  white-space: nowrap;
}

.data-table td {
  padding: 10px 8px;
  border-bottom: 1px solid #f0f0f0;
  vertical-align: top;
}

.data-table tr:hover {
  background: #f8f9fa;
}

/* 数据单元格样式 */
.number-cell {
  text-align: right;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
}

.percentage-cell {
  text-align: right;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
}

.ratio-cell {
  text-align: right;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
  font-weight: 600;
}

.date-cell {
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
}

.time-cell {
  text-align: right;
  font-family: 'Monaco', 'Consolas', monospace;
  font-size: 13px;
}

/* 数据质量指示器 */
.ratio-excellent {
  color: #2e7d32;
  background: #e8f5e8;
  padding: 2px 6px;
  border-radius: 3px;
}

.ratio-good {
  color: #1976d2;
  background: #e3f2fd;
  padding: 2px 6px;
  border-radius: 3px;
}

.ratio-average {
  color: #f57c00;
  background: #fff3e0;
  padding: 2px 6px;
  border-radius: 3px;
}

.ratio-poor {
  color: #d32f2f;
  background: #ffebee;
  padding: 2px 6px;
  border-radius: 3px;
}

.percentage-excellent {
  color: #2e7d32;
}

.percentage-good {
  color: #1976d2;
}

.percentage-average {
  color: #f57c00;
}

.percentage-poor {
  color: #d32f2f;
}

.bounce-rate-excellent {
  color: #2e7d32;
}

.bounce-rate-good {
  color: #1976d2;
}

.bounce-rate-average {
  color: #f57c00;
}

.bounce-rate-poor {
  color: #d32f2f;
}

/* 产品和页面信息样式 */
.product-title {
  max-width: 200px;
}

.product-info strong {
  display: block;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.product-info small {
  color: #666;
  font-size: 12px;
}

.category-cell {
  font-size: 13px;
  color: #666;
}

.page-url {
  max-width: 250px;
}

.url-info .page-link {
  display: block;
  font-weight: 500;
  color: #1976d2;
  text-decoration: none;
  margin-bottom: 4px;
}

.url-info .page-link:hover {
  text-decoration: underline;
}

.url-info small {
  color: #666;
  font-size: 12px;
  word-break: break-all;
}

.change-cell {
  text-align: center;
}

.change-indicator {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
}

.change-indicator.positive {
  color: #2e7d32;
  background: #e8f5e8;
}

.change-indicator.negative {
  color: #d32f2f;
  background: #ffebee;
}

.change-indicator.neutral {
  color: #666;
  background: #f5f5f5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .activity-detail {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .overview-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .section-header {
    flex-direction: column;
    gap: 16px;
  }

  .tab-controls {
    width: 100%;
    justify-content: center;
  }

  .table-header {
    flex-direction: column;
    gap: 12px;
  }
}
</style>
