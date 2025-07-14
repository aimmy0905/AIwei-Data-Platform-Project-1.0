<template>
  <div class="bing-dashboard-panel">
    <!-- 数据提醒 -->
    <div class="alert-section">
      <div class="section-header">
        <h3 class="section-title">
          <AlertTriangle />
          数据提醒
        </h3>
        <p class="section-description">Bing广告账户相关的重要提醒和异常数据</p>
      </div>

      <div class="alert-cards">
        <div
          v-for="alert in dashboardData.alerts"
          :key="alert.id"
          :class="['alert-card', `alert-card--${alert.type}`]"
        >
          <div class="alert-icon">
            <AlertTriangle v-if="alert.type === 'high'" />
            <AlertCircle v-else-if="alert.type === 'medium'" />
            <CheckCircle v-else />
          </div>
          <div class="alert-content">
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-message">{{ alert.message }}</div>
            <div class="alert-value">{{ alert.value }}</div>
          </div>
          <button class="alert-action">{{ alert.action }}</button>
        </div>
      </div>
    </div>

    <!-- 账户选择 -->
    <div class="account-section">
      <div class="section-header">
        <h3 class="section-title">
          <User />
          选择账户
        </h3>
        <p class="section-description">选择需要查看的Bing广告账户</p>
      </div>

      <div class="account-selector">
        <div class="account-dropdown">
          <select v-model="selectedAccountId" @change="handleAccountChange">
            <option v-for="account in dashboardData.accounts" :key="account.id" :value="account.id">
              {{ account.name }}
            </option>
          </select>
        </div>

        <div class="account-info">
          <div :class="['status-badge', `status-badge--${currentAccount.status}`]">
            {{ getStatusText(currentAccount.status) }}
          </div>
          <div class="account-balance">
            余额: {{ formatCurrency(currentAccount.balance, currentAccount.currency) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 广告账户概览 -->
    <div class="overview-section">
      <div class="section-header">
        <h3 class="section-title">
          <BarChart />
          广告账户概览
        </h3>
        <p class="section-description">Bing广告账户的核心数据指标</p>
      </div>

      <!-- 广告周数据 -->
      <div class="overview-subsection">
        <h4 class="subsection-title">广告周数据</h4>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">总转化价值</div>
            <div class="metric-value">{{ formatCurrency(dashboardData.weeklyOverview.totalConversionValue) }}</div>
            <div class="metric-change positive">+8.5%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">总费用</div>
            <div class="metric-value">{{ formatCurrency(dashboardData.weeklyOverview.totalCost) }}</div>
            <div class="metric-change positive">+6.2%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">ROI</div>
            <div class="metric-value">{{ dashboardData.weeklyOverview.roi }}x</div>
            <div class="metric-change positive">+4.8%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">转化率</div>
            <div class="metric-value">{{ dashboardData.weeklyOverview.conversionRate }}%</div>
            <div class="metric-change positive">+2.1%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">日均消耗</div>
            <div class="metric-value">{{ formatCurrency(dashboardData.weeklyOverview.dailyAverageCost) }}</div>
            <div class="metric-change positive">+5.3%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">点击次数</div>
            <div class="metric-value">{{ formatNumber(dashboardData.weeklyOverview.clicks) }}</div>
            <div class="metric-change positive">+3.5%</div>
          </div>
        </div>
      </div>

      <!-- 广告周数据-不包含线索 -->
      <div class="overview-subsection">
        <h4 class="subsection-title">广告周数据-不包含线索</h4>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">总转化价值</div>
            <div class="metric-value">{{ formatCurrency(dashboardData.weeklyOverviewNoLeads.totalConversionValue) }}</div>
            <div class="metric-change positive">+7.2%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">总费用</div>
            <div class="metric-value">{{ formatCurrency(dashboardData.weeklyOverviewNoLeads.totalCost) }}</div>
            <div class="metric-change positive">+6.2%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">ROI</div>
            <div class="metric-value">{{ dashboardData.weeklyOverviewNoLeads.roi }}x</div>
            <div class="metric-change positive">+3.9%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">日均消耗</div>
            <div class="metric-value">{{ formatCurrency(dashboardData.weeklyOverviewNoLeads.dailyAverageCost) }}</div>
            <div class="metric-change positive">+5.3%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">平均每次点击费用</div>
            <div class="metric-value">{{ formatCurrency(dashboardData.weeklyOverviewNoLeads.averageCpc) }}</div>
            <div class="metric-change positive">+1.8%</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">点击次数</div>
            <div class="metric-value">{{ formatNumber(dashboardData.weeklyOverviewNoLeads.clicks) }}</div>
            <div class="metric-change positive">+3.5%</div>
          </div>
        </div>
      </div>

      <!-- 趋势图 -->
      <div class="charts-grid">
        <div class="chart-container">
          <div class="chart-content">
            <LineChart :data="revenueSpendCustomerChartData" :options="chartOptions" />
          </div>
          <h4 class="chart-title">收入、花费、客单价趋势图</h4>
        </div>
        <div class="chart-container">
          <div class="chart-content">
            <LineChart :data="salesRoasChartData" :options="chartOptions" />
          </div>
          <h4 class="chart-title">销量、ROAS趋势图</h4>
        </div>
      </div>
    </div>

    <!-- 日投放数据 -->
    <div class="daily-data-section">
      <div class="section-header">
        <h3 class="section-title">
          <Calendar />
          日投放数据
        </h3>
        <p class="section-description">按日期展示的详细数据表格</p>
      </div>

      <div class="table-container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>花费</th>
                <th>转化价值</th>
                <th>ROI</th>
                <th>订单数</th>
                <th>订单转化率</th>
                <th>订单转化成本</th>
                <th>客单价</th>
                <th>CPC</th>
                <th>CTR</th>
                <th>CPV</th>
                <th>加购数</th>
                <th>加购成本</th>
                <th>加购率</th>
                <th>点击量</th>
                <th>播放量</th>
                <th>展现量</th>
                <th>用户数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dashboardData.dailyData" :key="row.date">
                <td>{{ formatDate(row.date) }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.roi }}x</td>
                <td>{{ row.orders }}</td>
                <td>{{ row.orderConversionRate }}%</td>
                <td>{{ formatCurrency(row.orderConversionCost) }}</td>
                <td>{{ formatCurrency(row.customerPrice) }}</td>
                <td>{{ formatCurrency(row.cpc) }}</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatCurrency(row.cpv) }}</td>
                <td>{{ row.addToCart }}</td>
                <td>{{ formatCurrency(row.addToCartCost) }}</td>
                <td>{{ row.addToCartRate }}%</td>
                <td>{{ formatNumber(row.clicks) }}</td>
                <td>{{ formatNumber(row.views) }}</td>
                <td>{{ formatNumber(row.impressions) }}</td>
                <td>{{ formatNumber(row.users) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 广告形式数据表现 -->
    <div class="ad-forms-section">
      <div class="section-header">
        <h3 class="section-title">
          <Target />
          广告形式数据表现
        </h3>
        <p class="section-description">品牌广告和转化广告的数据表现</p>
      </div>

      <div class="table-container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>广告类型</th>
                <th>花费</th>
                <th>转化价值</th>
                <th>ROI</th>
                <th>订单数</th>
                <th>订单转化率</th>
                <th>订单转化成本</th>
                <th>客单价</th>
                <th>CPC</th>
                <th>CTR</th>
                <th>CPA</th>
                <th>CPV</th>
                <th>加购数</th>
                <th>加购成本</th>
                <th>加购率</th>
                <th>点击量</th>
                <th>播放量</th>
                <th>展现量</th>
                <th>用户数</th>
                <th>流量型转化</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dashboardData.adFormData" :key="row.adType">
                <td>{{ row.adType }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.roi }}x</td>
                <td>{{ row.orders }}</td>
                <td>{{ row.orderConversionRate }}%</td>
                <td>{{ formatCurrency(row.orderConversionCost) }}</td>
                <td>{{ formatCurrency(row.customerPrice) }}</td>
                <td>{{ formatCurrency(row.cpc) }}</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatCurrency(row.cpa) }}</td>
                <td>{{ formatCurrency(row.cpv) }}</td>
                <td>{{ row.addToCart }}</td>
                <td>{{ formatCurrency(row.addToCartCost) }}</td>
                <td>{{ row.addToCartRate }}%</td>
                <td>{{ formatNumber(row.clicks) }}</td>
                <td>{{ formatNumber(row.views) }}</td>
                <td>{{ formatNumber(row.impressions) }}</td>
                <td>{{ formatNumber(row.users) }}</td>
                <td>{{ row.trafficConversions }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 广告类型数据表现 -->
    <div class="ad-types-section">
      <div class="section-header">
        <h3 class="section-title">
          <Layers />
          广告类型数据表现
        </h3>
        <p class="section-description">各种广告类型的数据表现和占比分析</p>
      </div>

      <div class="table-container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>广告类型</th>
                <th>花费</th>
                <th>转化价值</th>
                <th>ROI</th>
                <th>订单数</th>
                <th>订单转化率</th>
                <th>订单转化成本</th>
                <th>客单价</th>
                <th>CPC</th>
                <th>CTR</th>
                <th>CPA</th>
                <th>CPV</th>
                <th>加购数</th>
                <th>加购成本</th>
                <th>加购率</th>
                <th>点击量</th>
                <th>播放量</th>
                <th>展现量</th>
                <th>用户数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dashboardData.adTypeData" :key="row.adType">
                <td>{{ row.adType }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.roi }}x</td>
                <td>{{ row.orders }}</td>
                <td>{{ row.orderConversionRate }}%</td>
                <td>{{ formatCurrency(row.orderConversionCost) }}</td>
                <td>{{ formatCurrency(row.customerPrice) }}</td>
                <td>{{ formatCurrency(row.cpc) }}</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatCurrency(row.cpa) }}</td>
                <td>{{ formatCurrency(row.cpv) }}</td>
                <td>{{ row.addToCart }}</td>
                <td>{{ formatCurrency(row.addToCartCost) }}</td>
                <td>{{ row.addToCartRate }}%</td>
                <td>{{ formatNumber(row.clicks) }}</td>
                <td>{{ formatNumber(row.views) }}</td>
                <td>{{ formatNumber(row.impressions) }}</td>
                <td>{{ formatNumber(row.users) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 占比图 -->
      <div class="charts-subsection">
        <div class="charts-grid">
          <div class="chart-container">
            <div class="chart-content">
              <PieChart :data="costDistributionChartData" height="450px" />
            </div>
            <h4 class="chart-title">成本占比</h4>
          </div>
          <div class="chart-container">
            <div class="chart-content">
              <PieChart :data="revenueDistributionChartData" height="450px" />
            </div>
            <h4 class="chart-title">收入占比</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- 广告系列表现数据 -->
    <div class="campaigns-section">
      <div class="section-header">
        <h3 class="section-title">
          <FolderOpen />
          广告系列表现数据
        </h3>
        <p class="section-description">适用于品牌广告、除品牌词外的搜索广告、Shopping广告、Pmax广告</p>
      </div>

      <div class="table-container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>广告系列</th>
                <th>花费</th>
                <th>转化价值</th>
                <th>ROI</th>
                <th>订单数</th>
                <th>订单转化率</th>
                <th>订单转化成本</th>
                <th>客单价</th>
                <th>CPC</th>
                <th>CTR</th>
                <th>点击量</th>
                <th>展现量</th>
                <th>用户数</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dashboardData.campaignData" :key="row.campaign">
                <td>{{ row.campaign }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.roi }}x</td>
                <td>{{ row.orders }}</td>
                <td>{{ row.orderConversionRate }}%</td>
                <td>{{ formatCurrency(row.orderConversionCost) }}</td>
                <td>{{ formatCurrency(row.customerPrice) }}</td>
                <td>{{ formatCurrency(row.cpc) }}</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatNumber(row.clicks) }}</td>
                <td>{{ formatNumber(row.impressions) }}</td>
                <td>{{ formatNumber(row.users) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Video、Demand Gen及Display广告表现 -->
    <div class="video-display-section">
      <div class="section-header">
        <h3 class="section-title">
          <Video />
          Video、Demand Gen及Display广告表现
        </h3>
        <p class="section-description">视频广告和需求生成广告的表现数据</p>
      </div>

      <div class="table-container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>广告系列</th>
                <th>花费</th>
                <th>转化价值</th>
                <th>ROAS</th>
                <th>转化次数</th>
                <th>转化率</th>
                <th>互动次数</th>
                <th>CPC</th>
                <th>CPV</th>
                <th>CPM</th>
                <th>CPA</th>
                <th>完播率</th>
                <th>观看时长</th>
                <th>频次</th>
                <th>互动率</th>
                <th>跳出率</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dashboardData.videoDisplayData" :key="row.campaign">
                <td>{{ row.campaign }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.roas }}x</td>
                <td>{{ row.conversions }}</td>
                <td>{{ row.conversionRate }}%</td>
                <td>{{ row.interactions }}</td>
                <td>{{ formatCurrency(row.cpc) }}</td>
                <td>{{ formatCurrency(row.cpv) }}</td>
                <td>{{ formatCurrency(row.cpm) }}</td>
                <td>{{ formatCurrency(row.cpa) }}</td>
                <td>{{ row.completionRate }}%</td>
                <td>{{ row.watchTime }}s</td>
                <td>{{ row.frequency }}</td>
                <td>{{ row.interactionRate }}%</td>
                <td>{{ row.bounceRate }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 搜索关键字数据表现 -->
    <div class="keywords-section">
      <div class="section-header">
        <h3 class="section-title">
          <Search />
          搜索关键字数据表现
        </h3>
        <p class="section-description">按关键词分组的数据表格</p>
      </div>

      <div class="table-container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>关键词</th>
                <th>花费</th>
                <th>花费占比</th>
                <th>转化价值</th>
                <th>转化次数</th>
                <th>转化率</th>
                <th>CTR</th>
                <th>CPC</th>
                <th>CPA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dashboardData.keywordData" :key="row.keyword">
                <td>{{ row.keyword }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ row.spendPercentage }}%</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.conversions }}</td>
                <td>{{ row.conversionRate }}%</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatCurrency(row.cpc) }}</td>
                <td>{{ formatCurrency(row.cpa) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 受众表现数据 -->
    <div class="audience-section">
      <div class="section-header">
        <h3 class="section-title">
          <Users />
          受众表现数据
        </h3>
        <p class="section-description">按受众类型分组的数据表格</p>
      </div>

      <div class="table-container">
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>受众用户</th>
                <th>关键词</th>
                <th>花费</th>
                <th>花费占比</th>
                <th>转化价值</th>
                <th>转化次数</th>
                <th>转化率</th>
                <th>CTR</th>
                <th>CPC</th>
                <th>CPA</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in dashboardData.audienceData" :key="row.audience">
                <td>{{ row.audience }}</td>
                <td>{{ row.keywords }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ row.spendPercentage }}%</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.conversions }}</td>
                <td>{{ row.conversionRate }}%</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatCurrency(row.cpc) }}</td>
                <td>{{ formatCurrency(row.cpa) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 素材表现 -->
    <div class="materials-section">
      <div class="section-header">
        <h3 class="section-title">
          <Image />
          素材表现
        </h3>
        <p class="section-description">图片素材和视频素材的表现数据</p>
      </div>

      <!-- 图片素材 -->
      <div class="materials-subsection">
        <h4 class="subsection-title">图片素材</h4>
        <div class="table-container">
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ad ID / Image ID</th>
                  <th>Image</th>
                  <th>Ad Link</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>CPC</th>
                  <th>Conversions</th>
                  <th>Conversion Rate</th>
                  <th>Cost</th>
                  <th>Revenue</th>
                  <th>ROI</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in dashboardData.imageCreativeData" :key="row.adId">
                  <td>{{ row.adId }} / {{ row.imageId }}</td>
                  <td>
                    <img :src="row.image" :alt="row.adId" class="material-image" @error="handleImageError" />
                  </td>
                  <td>
                    <a :href="row.adLink" target="_blank" class="ad-link">查看广告</a>
                  </td>
                  <td>{{ formatNumber(row.impressions) }}</td>
                  <td>{{ formatNumber(row.clicks) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpc) }}</td>
                  <td>{{ row.conversions }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ formatCurrency(row.cost) }}</td>
                  <td>{{ formatCurrency(row.revenue) }}</td>
                  <td>{{ row.roi }}x</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 视频素材 -->
      <div class="materials-subsection">
        <h4 class="subsection-title">视频素材</h4>
        <div class="table-container">
          <div class="table-wrapper">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Thumbnail</th>
                  <th>Video Link</th>
                  <th>Video ID</th>
                  <th>Duration (s)</th>
                  <th>Impressions</th>
                  <th>Clicks</th>
                  <th>CTR</th>
                  <th>View Rate</th>
                  <th>Views</th>
                  <th>Conversions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in dashboardData.videoCreativeData" :key="row.videoId">
                  <td>
                    <img :src="row.thumbnail" :alt="row.videoId" class="material-image" @error="handleImageError" />
                  </td>
                  <td>
                    <a :href="row.videoLink" target="_blank" class="ad-link">查看视频</a>
                  </td>
                  <td>{{ row.videoId }}</td>
                  <td>{{ row.duration }}s</td>
                  <td>{{ formatNumber(row.impressions) }}</td>
                  <td>{{ formatNumber(row.clicks) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ row.viewRate }}%</td>
                  <td>{{ formatNumber(row.views) }}</td>
                  <td>{{ row.conversions }}</td>
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
import { ref, computed, onMounted } from 'vue'
import { AlertTriangle, AlertCircle, CheckCircle, User, BarChart, Calendar, Target, Layers, FolderOpen, Video, Search, Users, Image } from 'lucide-vue-next'
import LineChart from '../charts/LineChart.vue'
import PieChart from '../charts/PieChart.vue'
import { bingDashboardData, selectedAccount } from '../../mock/bing-dashboard'

// 响应式数据
const dashboardData = ref(bingDashboardData)
const selectedAccountId = ref(selectedAccount.id)

// 计算属性
const currentAccount = computed(() => {
  return dashboardData.value.accounts.find(account => account.id === selectedAccountId.value) || selectedAccount
})

// 图表数据
const revenueSpendCustomerChartData = computed(() => {
  return {
    labels: dashboardData.value.trendData.revenueSpendCustomer.map(item => item.date),
    datasets: [
      {
        label: '收入',
        data: dashboardData.value.trendData.revenueSpendCustomer.map(item => item.revenue),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.4
      },
      {
        label: '花费',
        data: dashboardData.value.trendData.revenueSpendCustomer.map(item => item.spend),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4
      },
      {
        label: '客单价',
        data: dashboardData.value.trendData.revenueSpendCustomer.map(item => item.customerPrice),
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.4
      }
    ]
  }
})

const salesRoasChartData = computed(() => {
  return {
    labels: dashboardData.value.trendData.salesRoas.map(item => item.date),
    datasets: [
      {
        label: '销量',
        data: dashboardData.value.trendData.salesRoas.map(item => item.sales),
        borderColor: '#8b5cf6',
        backgroundColor: 'rgba(139, 92, 246, 0.1)',
        tension: 0.4
      },
      {
        label: 'ROAS',
        data: dashboardData.value.trendData.salesRoas.map(item => item.roas),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top' as const,
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
    },
  },
}

// 饼图配置已移除，因为PieChart组件不需要options参数

// 饼图数据
const costDistributionChartData = computed(() => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  return dashboardData.value.adTypeDistribution.cost.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: colors[index % colors.length]
  }))
})

const revenueDistributionChartData = computed(() => {
  const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']
  return dashboardData.value.adTypeDistribution.revenue.map((item, index) => ({
    name: item.name,
    value: item.value,
    color: colors[index % colors.length]
  }))
})

// 方法
const handleAccountChange = () => {
  // 这里可以添加账户切换的逻辑
  console.log('Account changed to:', selectedAccountId.value)
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: '正常',
    limited: '受限',
    suspended: '暂停'
  }
  return statusMap[status] || status
}

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency
  }).format(amount)
}

const formatNumber = (num: number) => {
  return new Intl.NumberFormat().format(num)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA4MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yNSAyMEg1NVY0MEgyNVYyMFoiIGZpbGw9IiNEMUQ1REIiLz4KPGNpcmNsZSBjeD0iMzEiIGN5PSIyNyIgcj0iMyIgZmlsbD0iI0Y5RkFGQiIvPgo8cGF0aCBkPSJNMjUgMzVMMzAgMzBMMzUgMzVMNDUgMjVMNTUgMzVWNDBIMjVWMzVaIiBmaWxsPSIjRjlGQUZCIi8+CjwvZz4KPC9zdmc+'
  img.alt = 'Image not found'
}

onMounted(() => {
  console.log('Bing Dashboard Panel mounted')
})
</script>

<style scoped>
.bing-dashboard-panel {
  padding: 20px;
  background: var(--color-background);
  min-height: 100vh;
}

/* 通用样式 */
.section-header {
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

.section-description {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 14px;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 16px 0;
}

/* 提醒样式 */
.alert-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.alert-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.alert-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 6px;
  border-left: 4px solid;
}

.alert-card--high {
  background: #fff2f0;
  border-left-color: #ff4d4f;
}

.alert-card--medium {
  background: #fff7e6;
  border-left-color: #fa8c16;
}

.alert-card--low {
  background: #f6ffed;
  border-left-color: #52c41a;
}

.alert-icon {
  flex-shrink: 0;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.alert-message {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin-bottom: 2px;
}

.alert-value {
  font-weight: 600;
  color: var(--color-text-primary);
}

.alert-action {
  padding: 6px 12px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;
}

.alert-action:hover {
  background: var(--color-primary-hover);
}

/* 账号选择样式 */
.account-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.account-selector {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-wrap: wrap;
}

.account-dropdown select {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: 14px;
  min-width: 250px;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge--active {
  background: #f6ffed;
  color: #52c41a;
  border: 1px solid #b7eb8f;
}

.status-badge--limited {
  background: #fff7e6;
  color: #fa8c16;
  border: 1px solid #ffd591;
}

.account-balance {
  font-weight: 600;
  color: var(--color-text-primary);
}

/* 总览样式 */
.overview-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.overview-subsection {
  margin-bottom: 32px;
}

.overview-subsection:last-child {
  margin-bottom: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.metric-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 16px;
  text-align: center;
}

.metric-label {
  color: var(--color-text-secondary);
  font-size: 14px;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.metric-change {
  font-size: 12px;
  font-weight: 500;
}

.metric-change.positive {
  color: #52c41a;
}

.metric-change.negative {
  color: #ff4d4f;
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 40px;
}

.chart-container {
  background: white;
  border-radius: 12px;
  padding: 28px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  min-height: 480px;
  display: flex;
  flex-direction: column;
}

.chart-container:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.chart-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin: 20px 0 0 0;
  text-align: center;
  padding-top: 12px;
  border-top: 2px solid #f3f4f6;
  flex-shrink: 0;
}

.chart-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 表格样式 */
.daily-data-section,
.ad-forms-section,
.ad-types-section,
.campaigns-section,
.video-display-section,
.keywords-section,
.audience-section,
.materials-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  min-width: 1200px;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.data-table th {
  background: var(--color-background);
  font-weight: 600;
  color: var(--color-text-primary);
  position: sticky;
  top: 0;
  z-index: 1;
}

.data-table td {
  color: var(--color-text-primary);
}

.data-table tr:hover {
  background: var(--color-background);
}

.data-table tr:last-child td {
  border-bottom: none;
}

.charts-subsection {
  margin-top: 32px;
}

.charts-subsection .charts-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

@media (max-width: 768px) {
  .charts-subsection .charts-grid {
    grid-template-columns: 1fr;
  }
}

.materials-subsection {
  margin-bottom: 32px;
}

.materials-subsection:last-child {
  margin-bottom: 0;
}

.material-image {
  width: 80px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid var(--color-border);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  background: var(--color-background);
}

.material-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.ad-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.ad-link:hover {
  background: var(--color-primary-light);
  text-decoration: underline;
}
</style>
