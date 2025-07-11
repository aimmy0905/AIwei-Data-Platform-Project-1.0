<template>
  <div class="campaign-details-view">
    <div class="page-header">
      <div class="header-left">
        <button class="back-button" @click="goBack">
          <ArrowLeft :size="20" />
          返回活动列表
        </button>
        <div class="page-title">
          <h1>活动详情</h1>
          <p v-if="campaign">{{ campaign.name }}</p>
        </div>
      </div>
    </div>

    <div v-if="loading" class="loading-container">
      <div class="loading-spinner">加载中...</div>
    </div>

    <div v-else-if="campaign" class="campaign-content">
      <!-- 活动基本信息 -->
      <div class="info-section">
        <h2>基本信息</h2>
        <div class="info-grid">
          <div class="info-item">
            <label>活动名称</label>
            <span>{{ campaign.name }}</span>
          </div>
          <div class="info-item">
            <label>活动类型</label>
            <span>{{ getTypeText(campaign.type) }}</span>
          </div>
          <div class="info-item">
            <label>活动阶段</label>
            <span class="stage-badge" :class="`stage-${campaign.stage}`">
              {{ getStageText(campaign.stage) }}
            </span>
          </div>
          <div class="info-item">
            <label>目标市场</label>
            <span>{{ campaign.targetMarket }}</span>
          </div>
          <div class="info-item">
            <label>活动内容</label>
            <span>{{ campaign.content }}</span>
          </div>
          <div class="info-item">
            <label>参与渠道</label>
            <div class="channels-list">
              <span v-for="channel in campaign.channels" :key="channel" class="channel-tag">
                {{ channel }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- 活动数据 -->
      <div class="metrics-section">
        <h2>活动数据</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">总销售额</div>
            <div class="metric-value currency">${{ formatNumber(campaign.totalSales) }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">平均日销售额</div>
            <div class="metric-value currency">${{ formatNumber(Math.round(campaign.totalSales / 30)) }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">用户数</div>
            <div class="metric-value">{{ formatNumber(campaign.userCount) }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">广告花费</div>
            <div class="metric-value currency">${{ formatNumber(campaign.totalCost || 0) }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">ROI</div>
            <div class="metric-value">{{ campaign.roi }}x</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">转化率</div>
            <div class="metric-value">{{ campaign.conversionRate }}%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">客单价</div>
            <div class="metric-value currency">${{ formatNumber(campaign.averageOrderValue || 0) }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">订单量</div>
            <div class="metric-value">{{ formatNumber(campaign.orderCount || 0) }}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">退货率</div>
            <div class="metric-value">{{ campaign.returnRate || 0 }}%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">退货金额</div>
            <div class="metric-value currency">${{ formatNumber(campaign.returnAmount || 0) }}</div>
          </div>
        </div>
      </div>

      <!-- 单日数据表 -->
      <div class="daily-data-section">
        <h2>单日数据情况</h2>
        <div class="table-container">
          <table class="daily-data-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>整站收入</th>
                <th>广告花费</th>
                <th>整站ROI</th>
                <th>订单数</th>
                <th>客单价</th>
                <th>广告总收入</th>
                <th>广告ROI</th>
                <th>广告收入占比</th>
                <th>Google花费</th>
                <th>Google收入</th>
                <th>Google ROI</th>
                <th>Facebook收入</th>
                <th>Facebook花费</th>
                <th>Facebook ROI</th>
                <th>Bing收入</th>
                <th>Bing花费</th>
                <th>Bing ROI</th>
                <th>Criteo收入</th>
                <th>Criteo花费</th>
                <th>Criteo ROI</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(day, index) in dailyData" :key="index">
                <td>{{ formatDate(day.date) }}</td>
                <td class="currency">${{ formatNumber(day.totalRevenue) }}</td>
                <td class="currency">${{ formatNumber(day.adSpend) }}</td>
                <td class="roi">{{ day.totalROI }}x</td>
                <td>{{ formatNumber(day.orders) }}</td>
                <td class="currency">${{ formatNumber(day.avgOrderValue) }}</td>
                <td class="currency">${{ formatNumber(day.adRevenue) }}</td>
                <td class="roi">{{ day.adROI }}x</td>
                <td class="percentage">{{ day.adRevenueRatio }}%</td>
                <td class="currency">${{ formatNumber(day.googleSpend) }}</td>
                <td class="currency">${{ formatNumber(day.googleRevenue) }}</td>
                <td class="roi">{{ day.googleROI }}x</td>
                <td class="currency">${{ formatNumber(day.facebookRevenue) }}</td>
                <td class="currency">${{ formatNumber(day.facebookSpend) }}</td>
                <td class="roi">{{ day.facebookROI }}x</td>
                <td class="currency">${{ formatNumber(day.bingRevenue) }}</td>
                <td class="currency">${{ formatNumber(day.bingSpend) }}</td>
                <td class="roi">{{ day.bingROI }}x</td>
                <td class="currency">${{ formatNumber(day.criteoRevenue) }}</td>
                <td class="currency">${{ formatNumber(day.criteoSpend) }}</td>
                <td class="roi">{{ day.criteoROI }}x</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 产品数据情况 -->
      <div class="product-data-section">
        <h2>产品数据情况</h2>
        <div class="table-container">
          <table class="product-data-table">
            <thead>
              <tr>
                <th>产品标题</th>
                <th>产品品类</th>
                <th>用户数</th>
                <th>销量</th>
                <th>销售额</th>
                <th>转化率</th>
                <th>客单价</th>
                <th>退货数</th>
                <th>退款金额</th>
                <th>加购数</th>
                <th>发起结账数</th>
                <th>加购率</th>
                <th>发起结账率</th>
                <th>环比变化</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in productData" :key="index">
                <td class="product-title">{{ product.title }}</td>
                <td>{{ product.category }}</td>
                <td>{{ formatNumber(product.users) }}</td>
                <td>{{ formatNumber(product.sales) }}</td>
                <td class="currency">${{ formatNumber(product.revenue) }}</td>
                <td class="percentage">{{ product.conversionRate }}%</td>
                <td class="currency">${{ formatNumber(product.avgOrderValue) }}</td>
                <td>{{ formatNumber(product.returns) }}</td>
                <td class="currency">${{ formatNumber(product.refundAmount) }}</td>
                <td>{{ formatNumber(product.addToCart) }}</td>
                <td>{{ formatNumber(product.checkoutInitiated) }}</td>
                <td class="percentage">{{ product.addToCartRate }}%</td>
                <td class="percentage">{{ product.checkoutRate }}%</td>
                <td class="comparison">
                  <span :class="['trend', product.trend > 0 ? 'positive' : 'negative']">
                    {{ product.trend > 0 ? '+' : '' }}{{ product.trend }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 页面数据情况 -->
      <div class="page-data-section">
        <h2>页面数据情况</h2>
        <div class="table-container">
          <table class="page-data-table">
            <thead>
              <tr>
                <th>页面链接</th>
                <th>访问数</th>
                <th>用户数</th>
                <th>新客户数</th>
                <th>转化率</th>
                <th>加购数</th>
                <th>加购率</th>
                <th>发起结账数</th>
                <th>发起结账率</th>
                <th>跳出率</th>
                <th>停留时长</th>
                <th>每次访问的页面浏览量</th>
                <th>环比变化</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(page, index) in pageData" :key="index">
                <td class="page-url">{{ page.url }}</td>
                <td>{{ formatNumber(page.visits) }}</td>
                <td>{{ formatNumber(page.users) }}</td>
                <td>{{ formatNumber(page.newCustomers) }}</td>
                <td class="percentage">{{ page.conversionRate }}%</td>
                <td>{{ formatNumber(page.addToCart) }}</td>
                <td class="percentage">{{ page.addToCartRate }}%</td>
                <td>{{ formatNumber(page.checkoutInitiated) }}</td>
                <td class="percentage">{{ page.checkoutRate }}%</td>
                <td class="percentage">{{ page.bounceRate }}%</td>
                <td>{{ formatDuration(page.avgDuration) }}</td>
                <td>{{ page.pageViews }}</td>
                <td class="comparison">
                  <span :class="['trend', page.trend > 0 ? 'positive' : 'negative']">
                    {{ page.trend > 0 ? '+' : '' }}{{ page.trend }}%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>


    </div>

    <div v-else class="error-container">
      <div class="error-message">
        <h2>活动不存在</h2>
        <p>请检查活动ID是否正确</p>
        <button class="back-button" @click="goBack">
          返回活动列表
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ArrowLeft } from 'lucide-vue-next'
import { mockGetCampaignDetails } from '@/mock/dashboard'
import type { CampaignData } from '@/types'

const route = useRoute()
const router = useRouter()

const campaign = ref<CampaignData | null>(null)
const dailyData = ref<any[]>([])
const productData = ref<any[]>([])
const pageData = ref<any[]>([])
const loading = ref(true)

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

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
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

const goBack = () => {
  router.push('/dashboard')
}

const loadCampaignDetails = async () => {
  const campaignId = Number(route.params.id)

  if (isNaN(campaignId)) {
    loading.value = false
    return
  }

  try {
    const response = await mockGetCampaignDetails(campaignId)
    if (response.success && response.data) {
      campaign.value = response.data

      // 生成模拟的单日数据
      dailyData.value = Array.from({ length: 7 }, (_, i) => ({
        date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        totalRevenue: Math.floor(Math.random() * 10000) + 5000,
        adSpend: Math.floor(Math.random() * 3000) + 1000,
        totalROI: (Math.random() * 3 + 2).toFixed(1),
        orders: Math.floor(Math.random() * 50) + 20,
        avgOrderValue: Math.floor(Math.random() * 200) + 100,
        adRevenue: Math.floor(Math.random() * 8000) + 3000,
        adROI: (Math.random() * 4 + 1).toFixed(1),
        adRevenueRatio: Math.floor(Math.random() * 30) + 60,
        googleSpend: Math.floor(Math.random() * 1000) + 300,
        googleRevenue: Math.floor(Math.random() * 3000) + 1000,
        googleROI: (Math.random() * 3 + 1).toFixed(1),
        facebookRevenue: Math.floor(Math.random() * 2500) + 800,
        facebookSpend: Math.floor(Math.random() * 800) + 200,
        facebookROI: (Math.random() * 4 + 1).toFixed(1),
        bingRevenue: Math.floor(Math.random() * 1500) + 400,
        bingSpend: Math.floor(Math.random() * 500) + 150,
        bingROI: (Math.random() * 3 + 1).toFixed(1),
        criteoRevenue: Math.floor(Math.random() * 1200) + 300,
        criteoSpend: Math.floor(Math.random() * 400) + 100,
        criteoROI: (Math.random() * 3 + 1).toFixed(1)
      })).reverse()

      // 生成模拟的产品数据
      const productTitles = [
        'Spring Collection T-Shirt',
        'Casual Denim Jacket',
        'Summer Floral Dress',
        'Comfortable Sneakers',
        'Vintage Leather Bag'
      ]
      const categories = ['服装', '鞋履', '配饰', '家居', '美妆']

      productData.value = productTitles.map((title, i) => ({
        title,
        category: categories[i],
        users: Math.floor(Math.random() * 1000) + 500,
        sales: Math.floor(Math.random() * 200) + 50,
        revenue: Math.floor(Math.random() * 50000) + 10000,
        conversionRate: (Math.random() * 5 + 1).toFixed(2),
        avgOrderValue: Math.floor(Math.random() * 300) + 100,
        returns: Math.floor(Math.random() * 20) + 5,
        refundAmount: Math.floor(Math.random() * 5000) + 1000,
        addToCart: Math.floor(Math.random() * 500) + 200,
        checkoutInitiated: Math.floor(Math.random() * 300) + 100,
        addToCartRate: (Math.random() * 10 + 5).toFixed(2),
        checkoutRate: (Math.random() * 8 + 2).toFixed(2),
        trend: Math.floor(Math.random() * 40) - 20
      }))

      // 生成模拟的页面数据
      const pageUrls = [
        '/home',
        '/products/spring-collection',
        '/products/denim-jacket',
        '/checkout',
        '/product/sneakers'
      ]

      pageData.value = pageUrls.map(url => ({
        url,
        visits: Math.floor(Math.random() * 5000) + 1000,
        users: Math.floor(Math.random() * 3000) + 500,
        newCustomers: Math.floor(Math.random() * 1000) + 200,
        conversionRate: (Math.random() * 8 + 2).toFixed(2),
        addToCart: Math.floor(Math.random() * 800) + 100,
        addToCartRate: (Math.random() * 15 + 5).toFixed(2),
        checkoutInitiated: Math.floor(Math.random() * 400) + 50,
        checkoutRate: (Math.random() * 10 + 2).toFixed(2),
        bounceRate: (Math.random() * 40 + 20).toFixed(2),
        avgDuration: Math.floor(Math.random() * 300) + 60,
        pageViews: (Math.random() * 3 + 1).toFixed(1),
        trend: Math.floor(Math.random() * 30) - 15
      }))
    }
  } catch (error) {
    console.error('加载活动详情失败:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadCampaignDetails()
})
</script>

<style scoped>
.campaign-details-view {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
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

.page-title h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #1f2937;
}

.page-title p {
  margin: 4px 0 0 0;
  color: #6b7280;
}

.loading-container,
.error-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-spinner {
  font-size: 18px;
  color: #6b7280;
}

.error-message {
  text-align: center;
}

.error-message h2 {
  margin: 0 0 8px 0;
  color: #dc2626;
}

.campaign-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.info-section,
.metrics-section,
.daily-data-section,
.product-data-section,
.page-data-section,
.channels-section,
.content-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.info-section h2,
.metrics-section h2,
.daily-data-section h2,
.product-data-section h2,
.page-data-section h2,
.channels-section h2,
.content-section h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item label {
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
}

.info-item span {
  font-size: 16px;
  color: #1f2937;
}

.stage-badge {
  display: inline-block;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 500;
}

.stage-preparation { background: #fef3c7; color: #d97706; }
.stage-warmup { background: #dbeafe; color: #1e40af; }
.stage-official { background: #dcfce7; color: #16a34a; }
.stage-ended { background: #fee2e2; color: #dc2626; }

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.metric-card {
  background: #f9fafb;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.metric-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.metric-value.currency {
  color: #059669;
}

.channels-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.channel-tag {
  display: inline-block;
  padding: 6px 12px;
  background: #e5e7eb;
  border-radius: 16px;
  font-size: 14px;
  color: #374151;
}

.content-text {
  font-size: 16px;
  line-height: 1.6;
  color: #374151;
}

@media (max-width: 768px) {
  .campaign-details-view {
    padding: 16px;
  }

  .header-left {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .table-container {
    overflow-x: auto;
  }

  .daily-data-table {
    width: 100%;
    font-size: 12px;
  }
}

.table-container {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.daily-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 1400px;
}

.daily-data-table th,
.daily-data-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.daily-data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;
  z-index: 1;
}

.daily-data-table th:first-child,
.daily-data-table td:first-child {
  position: sticky;
  left: 0;
  background: #f9fafb;
  z-index: 2;
  border-right: 1px solid #e5e7eb;
}

.daily-data-table th:first-child {
  z-index: 3;
}

.daily-data-table tr:hover {
  background: #f9fafb;
}

.daily-data-table .currency {
  color: #059669;
  font-weight: 500;
}

.daily-data-table .roi {
  color: #3b82f6;
  font-weight: 500;
}

.daily-data-table .percentage {
  color: #d97706;
  font-weight: 500;
}

.product-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 1200px;
}

.product-data-table th,
.product-data-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.product-data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;
  z-index: 1;
}

.product-data-table th:first-child,
.product-data-table td:first-child {
  position: sticky;
  left: 0;
  background: #f9fafb;
  z-index: 2;
  border-right: 1px solid #e5e7eb;
}

.product-data-table th:first-child {
  z-index: 3;
}

.product-data-table tr:hover {
  background: #f9fafb;
}

.product-data-table .product-title {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
}

.product-data-table .currency {
  color: #059669;
  font-weight: 500;
}

.product-data-table .percentage {
  color: #d97706;
  font-weight: 500;
}

.product-data-table .comparison {
  text-align: center;
}

.product-data-table .trend {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.product-data-table .trend.positive {
  background: #dcfce7;
  color: #16a34a;
}

.product-data-table .trend.negative {
  background: #fee2e2;
  color: #dc2626;
}

.page-data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 1400px;
}

.page-data-table th,
.page-data-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
  white-space: nowrap;
}

.page-data-table th {
  background: #f9fafb;
  font-weight: 600;
  color: #374151;
  position: sticky;
  top: 0;
  z-index: 1;
}

.page-data-table th:first-child,
.page-data-table td:first-child {
  position: sticky;
  left: 0;
  background: #f9fafb;
  z-index: 2;
  border-right: 1px solid #e5e7eb;
}

.page-data-table th:first-child {
  z-index: 3;
}

.page-data-table tr:hover {
  background: #f9fafb;
}

.page-data-table .page-url {
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 500;
  color: #3b82f6;
}

.page-data-table .percentage {
  color: #d97706;
  font-weight: 500;
}

.page-data-table .comparison {
  text-align: center;
}

.page-data-table .trend {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.page-data-table .trend.positive {
  background: #dcfce7;
  color: #16a34a;
}

.page-data-table .trend.negative {
  background: #fee2e2;
  color: #dc2626;
}
</style>
