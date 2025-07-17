<template>
  <div class="meta-dashboard-advanced">
    <!-- 落地页的广告表现 -->
    <div class="landing-pages-section" id="meta-landing-pages">
      <div class="section-header">
        <h3 class="section-title">
          <Globe :size="20" />
          落地页的广告表现
        </h3>
      </div>

      <div class="landing-pages-content">
        <!-- 用户转化数据 -->
        <div class="landing-page-subsection">
          <h4 class="subsection-title">用户转化数据</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>落地页名称</th>
                  <th>花费</th>
                  <th>收入</th>
                  <th>ROAS</th>
                  <th>销量</th>
                  <th>客单价（收入/销量）</th>
                  <th>转化成本</th>
                  <th>转化率</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="page in landingPages.userConversion" :key="page.landingPageName">
                  <td class="landing-page-url">{{ page.landingPageName }}</td>
                  <td>{{ formatCurrency(page.spend) }}</td>
                  <td>{{ formatCurrency(page.revenue) }}</td>
                  <td>{{ page.roas }}x</td>
                  <td>{{ formatNumber(page.sales) }}</td>
                  <td>{{ formatCurrency(page.customerPrice) }}</td>
                  <td>{{ formatCurrency(page.conversionCost) }}</td>
                  <td>{{ page.conversionRate }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 用户加购转化数据 -->
        <div class="landing-page-subsection">
          <h4 class="subsection-title">用户加购转化数据</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>落地页名称</th>
                  <th>花费</th>
                  <th>添加付款信息</th>
                  <th>添加付款信息成本</th>
                  <th>发起结账</th>
                  <th>发起结账成本</th>
                  <th>加购</th>
                  <th>加购成本</th>
                  <th>加购率</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="page in landingPages.userAddToCart" :key="page.landingPageName">
                  <td class="landing-page-url">{{ page.landingPageName }}</td>
                  <td>{{ formatCurrency(page.spend) }}</td>
                  <td>{{ formatNumber(page.addPaymentInfo) }}</td>
                  <td>{{ formatCurrency(page.addPaymentInfoCost) }}</td>
                  <td>{{ formatNumber(page.initiateCheckout) }}</td>
                  <td>{{ formatCurrency(page.initiateCheckoutCost) }}</td>
                  <td>{{ formatNumber(page.addToCart) }}</td>
                  <td>{{ formatCurrency(page.addToCartCost) }}</td>
                  <td>{{ page.addToCartRate }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 用户过程数据 -->
        <div class="landing-page-subsection">
          <h4 class="subsection-title">用户过程数据</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>落地页名称</th>
                  <th>花费</th>
                  <th>Clicks</th>
                  <th>CPC</th>
                  <th>CTR</th>
                  <th>Link clicks</th>
                  <th>CTR（Link）</th>
                  <th>CPC（Link）</th>
                  <th>内容浏览</th>
                  <th>内容浏览成本</th>
                  <th>CPM</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="page in landingPages.userProcess" :key="page.landingPageName">
                  <td class="landing-page-url">{{ page.landingPageName }}</td>
                  <td>{{ formatCurrency(page.spend) }}</td>
                  <td>{{ formatNumber(page.clicks) }}</td>
                  <td>{{ formatCurrency(page.cpc) }}</td>
                  <td>{{ page.ctr }}%</td>
                  <td>{{ formatNumber(page.linkClicks) }}</td>
                  <td>{{ page.linkCTR }}%</td>
                  <td>{{ formatCurrency(page.linkCPC) }}</td>
                  <td>{{ formatNumber(page.contentViews) }}</td>
                  <td>{{ formatCurrency(page.contentViewCost) }}</td>
                  <td>{{ formatCurrency(page.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 占比图表 -->
        <div class="charts-grid">
          <div class="chart-container">
            <PieChart
              :data="landingPagesChartData.spendData"
              :height="'300px'"
              :show-legend="false"
              :donut="false"
            />
            <h5 class="chart-title">花费占比</h5>
            <div class="chart-legend">
              <div
                v-for="item in landingPagesChartData.spendData"
                :key="item.name"
                class="legend-item"
              >
                <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                <span class="legend-label">{{ item.name }}</span>
                <span class="legend-value">{{ formatCurrency(item.value) }}</span>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <PieChart
              :data="landingPagesChartData.revenueData"
              :height="'300px'"
              :show-legend="false"
              :donut="false"
            />
            <h5 class="chart-title">收入占比</h5>
            <div class="chart-legend">
              <div
                v-for="item in landingPagesChartData.revenueData"
                :key="item.name"
                class="legend-item"
              >
                <div class="legend-color" :style="{ backgroundColor: item.color }"></div>
                <span class="legend-label">{{ item.name }}</span>
                <span class="legend-value">{{ formatCurrency(item.value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 素材表现 -->
    <div class="creatives-section" id="meta-creatives">
      <div class="section-header">
        <h3 class="section-title">
          <Image :size="20" />
          素材表现
        </h3>
      </div>

      <div class="creatives-content">
        <!-- 图片素材 -->
        <div class="creative-subsection">
          <h4 class="subsection-title">图片素材</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>落地页</th>
                  <th>预览</th>
                  <th>花费</th>
                  <th>收入</th>
                  <th>AOV</th>
                  <th>ROAS</th>
                  <th>销量</th>
                  <th>客单价（收入/销量）</th>
                  <th>转化成本</th>
                  <th>转化率</th>
                  <th>加购成本</th>
                  <th>加购率</th>
                  <th>用户数</th>
                  <th>CTR</th>
                  <th>CPM</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="creative in creatives.images" :key="creative.preview">
                  <td class="landing-page-url">{{ creative.landingPage }}</td>
                  <td class="creative-preview">
                    <img
                      :src="creative.preview"
                      :alt="creative.landingPage"
                      class="preview-image"
                      @error="handleImageError"
                      loading="lazy"
                    />
                  </td>
                  <td>{{ formatCurrency(creative.spend) }}</td>
                  <td>{{ formatCurrency(creative.revenue) }}</td>
                  <td>{{ formatCurrency(creative.aov) }}</td>
                  <td>{{ creative.roas }}x</td>
                  <td>{{ formatNumber(creative.sales) }}</td>
                  <td>{{ formatCurrency(creative.customerPrice) }}</td>
                  <td>{{ formatCurrency(creative.conversionCost) }}</td>
                  <td>{{ creative.conversionRate }}%</td>
                  <td>{{ formatCurrency(creative.addToCartCost) }}</td>
                  <td>{{ creative.addToCartRate }}%</td>
                  <td>{{ formatNumber(creative.users) }}</td>
                  <td>{{ creative.ctr }}%</td>
                  <td>{{ formatCurrency(creative.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 视频素材 -->
        <div class="creative-subsection">
          <h4 class="subsection-title">视频素材</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>落地页</th>
                  <th>预览</th>
                  <th>花费</th>
                  <th>收入</th>
                  <th>AOV</th>
                  <th>ROAS</th>
                  <th>销量</th>
                  <th>客单价（收入/销量）</th>
                  <th>转化成本</th>
                  <th>转化率</th>
                  <th>加购成本</th>
                  <th>加购率</th>
                  <th>用户数</th>
                  <th>CTR</th>
                  <th>CPM</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="creative in creatives.videos" :key="creative.preview">
                  <td class="landing-page-url">{{ creative.landingPage }}</td>
                  <td class="creative-preview">
                    <video :src="creative.preview" class="preview-video" controls muted>
                      <source :src="creative.preview" type="video/mp4">
                      视频预览
                    </video>
                  </td>
                  <td>{{ formatCurrency(creative.spend) }}</td>
                  <td>{{ formatCurrency(creative.revenue) }}</td>
                  <td>{{ formatCurrency(creative.aov) }}</td>
                  <td>{{ creative.roas }}x</td>
                  <td>{{ formatNumber(creative.sales) }}</td>
                  <td>{{ formatCurrency(creative.customerPrice) }}</td>
                  <td>{{ formatCurrency(creative.conversionCost) }}</td>
                  <td>{{ creative.conversionRate }}%</td>
                  <td>{{ formatCurrency(creative.addToCartCost) }}</td>
                  <td>{{ creative.addToCartRate }}%</td>
                  <td>{{ formatNumber(creative.users) }}</td>
                  <td>{{ creative.ctr }}%</td>
                  <td>{{ formatCurrency(creative.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Globe, Image } from 'lucide-vue-next'
import PieChart from '@/components/charts/PieChart.vue'
import {
  mockGetMetaLandingPages,
  mockMetaLandingPagesChartData,
  mockGetMetaCreatives
} from '@/mock/dashboard'

// 响应式数据
const landingPages = ref<any>({
  userConversion: [],
  userAddToCart: [],
  userProcess: []
})
const landingPagesChartData = ref<any>({
  spendData: [],
  revenueData: []
})
const creatives = ref<any>({
  images: [],
  videos: []
})

// 格式化函数
const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2
  }).format(value)
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value)
}

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'https://via.placeholder.com/400x300/f0f0f0/666666?text=Image+Not+Found'
}

// 加载数据
const loadData = async () => {
  try {
    // 加载落地页数据
    const landingPagesResponse = await mockGetMetaLandingPages()
    if (landingPagesResponse.success && landingPagesResponse.data) {
      landingPages.value = landingPagesResponse.data
    }
    landingPagesChartData.value = mockMetaLandingPagesChartData

    // 加载素材数据
    const creativesResponse = await mockGetMetaCreatives()
    if (creativesResponse.success && creativesResponse.data) {
      creatives.value = creativesResponse.data
    }

  } catch (error) {
    console.error('Error loading Meta advanced dashboard data:', error)
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.meta-dashboard-advanced {
  background: var(--color-background);
}

/* 通用样式 */
.section-header {
  margin-bottom: 24px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
}

/* 落地页样式 */
.landing-pages-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.landing-pages-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.landing-page-subsection {
  margin-bottom: 32px;
}

.landing-page-subsection:last-child {
  margin-bottom: 0;
}

.landing-page-url {
  max-width: 200px;
  word-break: break-all;
  font-size: 12px;
  color: var(--color-primary);
}

/* 素材表现样式 */
.creatives-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.creatives-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.creative-subsection {
  margin-bottom: 32px;
}

.creative-subsection:last-child {
  margin-bottom: 0;
}

.creative-preview {
  width: 100px;
  height: auto;
  padding: 8px;
  vertical-align: middle;
  text-align: center;
}

.preview-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid var(--color-border);
  transition: all 0.3s ease;
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-image:hover {
  transform: scale(1.2);
  z-index: 10;
  position: relative;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-color: var(--color-primary);
}

.preview-video {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 2px solid var(--color-border);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.preview-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: var(--color-text-secondary);
  text-align: center;
}

/* 图表样式 */
.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.chart-container {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 16px;
  display: flex;
  flex-direction: column;
}

.chart-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 16px 0 8px 0;
  text-align: center;
  order: 2;
}

.chart-legend {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 8px;
  order: 3;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.legend-item:hover {
  background-color: var(--color-background);
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  flex-shrink: 0;
}

.legend-label {
  flex: 1;
  color: var(--color-text-primary);
  font-size: 13px;
  font-weight: 500;
}

.legend-value {
  color: var(--color-text-secondary);
  font-size: 12px;
  font-weight: 600;
}

/* 表格样式 */
.table-container {
  overflow-x: auto;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.data-table th,
.data-table td {
  padding: 12px 8px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.data-table th {
  background: var(--color-background);
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.data-table th:nth-child(2) {
  text-align: center;
  width: 120px;
}

.data-table td:nth-child(2) {
  text-align: center;
}

.data-table tr:hover {
  background: var(--color-background);
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  min-width: 1200px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.data-table th {
  background: var(--color-background);
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 14px;
  white-space: nowrap;
}

.data-table td {
  color: var(--color-text-primary);
  font-size: 14px;
}

.data-table tr:hover {
  background: var(--color-background);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .meta-dashboard-advanced {
    padding: 16px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .data-table {
    min-width: 800px;
  }
}
</style>
