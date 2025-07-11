<template>
  <div class="meta-dashboard-panel">
    <!-- 账号选择模块 -->
    <div class="account-section" id="meta-account">
      <div class="section-header">
        <h3 class="section-title">
          <Settings :size="20" />
          账号选择
        </h3>
      </div>

      <div class="account-selector">
        <div class="account-dropdown">
          <select v-model="selectedAccount" @change="handleAccountChange">
            <option value="">选择Meta广告账户</option>
            <option
              v-for="account in accounts"
              :key="account.id"
              :value="account.id"
            >
              {{ account.name }} ({{ account.statusText }})
            </option>
          </select>
        </div>

        <div class="account-info" v-if="selectedAccountInfo">
          <div class="account-status">
            <span :class="['status-badge', `status-badge--${selectedAccountInfo.status}`]">
              {{ selectedAccountInfo.statusText }}
            </span>
          </div>
          <div class="account-balance">
            余额: {{ selectedAccountInfo.balance }}
          </div>
        </div>
      </div>
    </div>

    <!-- 数据提醒模块 -->
    <div class="alert-section" id="meta-alerts">
      <div class="section-header">
        <h3 class="section-title">
          <AlertTriangle :size="20" />
          数据提醒
        </h3>
        <p class="section-description">显示Meta广告账户相关的重要提醒</p>
      </div>

      <div class="alert-cards">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          :class="['alert-card', `alert-card--${alert.priority}`]"
        >
          <div class="alert-icon">
            <component :is="getAlertIcon(alert.type)" :size="16" />
          </div>
          <div class="alert-content">
            <div class="alert-title">{{ alert.title }}</div>
            <div class="alert-message">{{ alert.message }}</div>
            <div class="alert-value">{{ alert.value }}</div>
          </div>
          <button class="alert-action" @click="handleAlertAction(alert)">
            查看详情
          </button>
        </div>
      </div>
    </div>

    <!-- 账户总览 -->
    <div class="overview-section" id="meta-overview">
      <div class="section-header">
        <h3 class="section-title">
          <BarChart3 :size="20" />
          账户总览
        </h3>
      </div>

      <!-- 账户数据 -->
      <div class="overview-subsection">
        <h4 class="subsection-title">账户数据</h4>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">FB总花费</div>
            <div class="metric-value">{{ formatCurrency(accountOverview.totalSpend) }}</div>
            <div class="metric-change" :class="accountOverview.totalSpendChange > 0 ? 'positive' : 'negative'">
              {{ accountOverview.totalSpendChange > 0 ? '+' : '' }}{{ accountOverview.totalSpendChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">日均花费</div>
            <div class="metric-value">{{ formatCurrency(accountOverview.dailyAverage) }}</div>
            <div class="metric-change" :class="accountOverview.dailyAverageChange > 0 ? 'positive' : 'negative'">
              {{ accountOverview.dailyAverageChange > 0 ? '+' : '' }}{{ accountOverview.dailyAverageChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">广告收入</div>
            <div class="metric-value">{{ formatCurrency(accountOverview.adRevenue) }}</div>
            <div class="metric-change" :class="accountOverview.adRevenueChange > 0 ? 'positive' : 'negative'">
              {{ accountOverview.adRevenueChange > 0 ? '+' : '' }}{{ accountOverview.adRevenueChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">ROAS</div>
            <div class="metric-value">{{ accountOverview.roas }}x</div>
            <div class="metric-change" :class="accountOverview.roasChange > 0 ? 'positive' : 'negative'">
              {{ accountOverview.roasChange > 0 ? '+' : '' }}{{ accountOverview.roasChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">用户数</div>
            <div class="metric-value">{{ formatNumber(accountOverview.users) }}</div>
            <div class="metric-change" :class="accountOverview.usersChange > 0 ? 'positive' : 'negative'">
              {{ accountOverview.usersChange > 0 ? '+' : '' }}{{ accountOverview.usersChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">CPC</div>
            <div class="metric-value">{{ formatCurrency(accountOverview.cpc) }}</div>
            <div class="metric-change" :class="accountOverview.cpcChange > 0 ? 'negative' : 'positive'">
              {{ accountOverview.cpcChange > 0 ? '+' : '' }}{{ accountOverview.cpcChange }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 趋势图 -->
      <div class="overview-subsection">
        <h4 class="subsection-title">趋势图</h4>
        <div class="charts-grid">
          <div class="chart-container">
            <h5 class="chart-title">收入、花费、客单价趋势</h5>
            <LineChart
              :data="accountOverview.trendData"
              :height="'300px'"
              :show-legend="true"
            />
          </div>

          <div class="chart-container">
            <h5 class="chart-title">销量、ROAS趋势</h5>
            <LineChart
              :data="accountOverview.salesRoasTrendData"
              :height="'300px'"
              :show-legend="true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 日投放数据 -->
    <div class="daily-data-section" id="meta-daily-data">
      <div class="section-header">
        <h3 class="section-title">
          <Calendar :size="20" />
          日投放数据
        </h3>
      </div>

      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>日期</th>
              <th>花费</th>
              <th>收入</th>
              <th>ROAS</th>
              <th>AOV</th>
              <th>销量</th>
              <th>转化成本</th>
              <th>客单价</th>
              <th>转化率</th>
              <th>加购成本</th>
              <th>加购率</th>
              <th>用户数</th>
              <th>CTR</th>
              <th>CPM</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in dailyData" :key="row.date">
              <td>{{ formatDate(row.date) }}</td>
              <td>{{ formatCurrency(row.spend) }}</td>
              <td>{{ formatCurrency(row.revenue) }}</td>
              <td>{{ row.roas }}x</td>
              <td>{{ formatCurrency(row.aov) }}</td>
              <td>{{ formatNumber(row.sales) }}</td>
              <td>{{ formatCurrency(row.conversionCost) }}</td>
              <td>{{ formatCurrency(row.customerPrice) }}</td>
              <td>{{ row.conversionRate }}%</td>
              <td>{{ formatCurrency(row.addToCartCost) }}</td>
              <td>{{ row.addToCartRate }}%</td>
              <td>{{ formatNumber(row.users) }}</td>
              <td>{{ row.ctr }}%</td>
              <td>{{ formatCurrency(row.cpm) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 广告目标 -->
    <div class="objectives-section" id="meta-objectives">
      <div class="section-header">
        <h3 class="section-title">
          <Target :size="20" />
          广告目标
        </h3>
      </div>

      <div class="objectives-content">
        <!-- 数据表格 -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>广告目标</th>
                <th>花费</th>
                <th>收入</th>
                <th>ROAS</th>
                <th>AOV</th>
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
              <tr v-for="objective in adObjectives" :key="objective.objective">
                <td>{{ objective.name }}</td>
                <td>{{ formatCurrency(objective.spend) }}</td>
                <td>{{ formatCurrency(objective.revenue) }}</td>
                <td>{{ objective.roas }}x</td>
                <td>{{ formatCurrency(objective.aov) }}</td>
                <td>{{ formatNumber(objective.sales) }}</td>
                <td>{{ formatCurrency(objective.customerPrice) }}</td>
                <td>{{ formatCurrency(objective.conversionCost) }}</td>
                <td>{{ objective.conversionRate }}%</td>
                <td>{{ formatCurrency(objective.addToCartCost) }}</td>
                <td>{{ objective.addToCartRate }}%</td>
                <td>{{ formatNumber(objective.users) }}</td>
                <td>{{ objective.ctr }}%</td>
                <td>{{ formatCurrency(objective.cpm) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 占比图 -->
        <div class="charts-grid">
          <div class="chart-container">
            <PieChart
              :data="objectivesChartData.spendData"
              :height="'300px'"
              :show-legend="false"
              :donut="true"
            />
            <h5 class="chart-title">花费占比</h5>
            <div class="chart-legend">
              <div
                v-for="item in objectivesChartData.spendData"
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
              :data="objectivesChartData.revenueData"
              :height="'300px'"
              :show-legend="false"
              :donut="true"
            />
            <h5 class="chart-title">收入占比</h5>
            <div class="chart-legend">
              <div
                v-for="item in objectivesChartData.revenueData"
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

    <!-- 广告数据 -->
    <div class="ad-data-section" id="meta-ad-data">
      <div class="section-header">
        <h3 class="section-title">
          <BarChart3 :size="20" />
          广告数据
        </h3>
        <button class="custom-metrics-btn" @click="showCustomMetricsModal = true">
          <Settings :size="16" />
          自定义指标
        </button>
      </div>

      <!-- 曝光层 -->
      <div class="ad-layer-subsection">
        <h4 class="subsection-title">曝光层</h4>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>已花费金额</th>
                <th>展示次数</th>
                <th>CPM</th>
                <th>覆盖人数</th>
                <th>频次</th>
                <th>点击量(全部)</th>
                <th>CTR(全部)</th>
                <th>CPC(全部)</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in adLayers.exposure" :key="row.date">
                <td>{{ formatDate(row.date) }}</td>
                <td>{{ formatCurrency(row.amountSpent) }}</td>
                <td>{{ formatNumber(row.impressions) }}</td>
                <td>{{ formatCurrency(row.cpm) }}</td>
                <td>{{ formatNumber(row.reach) }}</td>
                <td>{{ row.frequency }}</td>
                <td>{{ formatNumber(row.clicks) }}</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatCurrency(row.cpc) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 互动及视频播放指标 -->
      <div class="ad-layer-subsection">
        <h4 class="subsection-title">互动及视频播放指标</h4>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>帖文互动</th>
                <th>单次帖文互动费用</th>
                <th>视频播放量</th>
                <th>视频平均播放时长</th>
                <th>播放视频达3秒的次数</th>
                <th>播放视频达3秒的单次费用</th>
                <th>ThruPlay次数</th>
                <th>单次ThruPlay费用</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in adLayers.engagement" :key="row.date">
                <td>{{ formatDate(row.date) }}</td>
                <td>{{ formatNumber(row.postEngagement) }}</td>
                <td>{{ formatCurrency(row.costPerPostEngagement) }}</td>
                <td>{{ formatNumber(row.videoPlays) }}</td>
                <td>{{ row.videoAveragePlayTime }}s</td>
                <td>{{ formatNumber(row.videoPlays3s) }}</td>
                <td>{{ formatCurrency(row.costPerVideoPlay3s) }}</td>
                <td>{{ formatNumber(row.thruPlays) }}</td>
                <td>{{ formatCurrency(row.costPerThruPlay) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 点击及意向层指标 -->
      <div class="ad-layer-subsection">
        <h4 class="subsection-title">点击及意向层指标</h4>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>链接点击量</th>
                <th>链接点击率</th>
                <th>单次链接点击费用</th>
                <th>落地页浏览量</th>
                <th>单次落地页浏览费用</th>
                <th>内容查看</th>
                <th>单次内容查看费用</th>
                <th>加入购物车次数</th>
                <th>单次加购费用</th>
                <th>发起结账</th>
                <th>单次发起结账费用</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in adLayers.clickIntent" :key="row.date">
                <td>{{ formatDate(row.date) }}</td>
                <td>{{ formatNumber(row.linkClicks) }}</td>
                <td>{{ row.linkCTR }}%</td>
                <td>{{ formatCurrency(row.costPerLinkClick) }}</td>
                <td>{{ formatNumber(row.landingPageViews) }}</td>
                <td>{{ formatCurrency(row.costPerLandingPageView) }}</td>
                <td>{{ formatNumber(row.contentViews) }}</td>
                <td>{{ formatCurrency(row.costPerContentView) }}</td>
                <td>{{ formatNumber(row.addToCarts) }}</td>
                <td>{{ formatCurrency(row.costPerAddToCart) }}</td>
                <td>{{ formatNumber(row.checkoutsInitiated) }}</td>
                <td>{{ formatCurrency(row.costPerCheckoutsInitiated) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 购物结果指标及表现漏斗 -->
      <div class="ad-layer-subsection">
        <h4 class="subsection-title">购物结果指标及表现漏斗</h4>
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>日期</th>
                <th>购物ROAS</th>
                <th>购物次数</th>
                <th>单次购物费用</th>
                <th>购物转化价值</th>
                <th>平均购物转化价值</th>
                <th>单次落地页浏览的购物率</th>
                <th>单次链接点击的购物率</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in adLayers.shopping" :key="row.date">
                <td>{{ formatDate(row.date) }}</td>
                <td>{{ row.purchaseRoas }}x</td>
                <td>{{ formatNumber(row.purchases) }}</td>
                <td>{{ formatCurrency(row.costPerPurchase) }}</td>
                <td>{{ formatCurrency(row.purchaseConversionValue) }}</td>
                <td>{{ formatCurrency(row.avgPurchaseConversionValue) }}</td>
                <td>{{ row.purchaseRatePerLandingPageView }}%</td>
                <td>{{ row.purchaseRatePerLinkClick }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 拉新与再营销 -->
    <div class="new-vs-remarketing-section" id="meta-new-vs-remarketing">
      <div class="section-header">
        <h3 class="section-title">
          <Users :size="20" />
          拉新与再营销
        </h3>
      </div>

      <div class="new-vs-remarketing-content">
        <!-- 数据表格 -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>维度</th>
                <th>花费</th>
                <th>收入</th>
                <th>AOV</th>
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
              <tr v-for="row in newVsRemarketingData" :key="row.type">
                <td>{{ row.name }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.revenue) }}</td>
                <td>{{ formatCurrency(row.aov) }}</td>
                <td>{{ formatNumber(row.sales) }}</td>
                <td>{{ formatCurrency(row.customerPrice) }}</td>
                <td>{{ formatCurrency(row.conversionCost) }}</td>
                <td>{{ row.conversionRate }}%</td>
                <td>{{ formatCurrency(row.addToCartCost) }}</td>
                <td>{{ row.addToCartRate }}%</td>
                <td>{{ formatNumber(row.users) }}</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatCurrency(row.cpm) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 占比图表 -->
        <div class="charts-grid">
          <div class="chart-container">
            <PieChart
              :data="newVsRemarketingChartData.spendData"
              :height="'300px'"
              :show-legend="false"
              :donut="true"
            />
            <h5 class="chart-title">花费占比</h5>
            <div class="chart-legend">
              <div
                v-for="item in newVsRemarketingChartData.spendData"
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
              :data="newVsRemarketingChartData.revenueData"
              :height="'300px'"
              :show-legend="false"
              :donut="true"
            />
            <h5 class="chart-title">收入占比</h5>
            <div class="chart-legend">
              <div
                v-for="item in newVsRemarketingChartData.revenueData"
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

    <!-- 广告形式 -->
    <div class="ad-formats-section" id="meta-ad-formats">
      <div class="section-header">
        <h3 class="section-title">
          <Eye :size="20" />
          广告形式
        </h3>
      </div>

      <div class="ad-formats-content">
        <!-- 数据表格 -->
        <div class="table-container">
          <table class="data-table">
            <thead>
              <tr>
                <th>广告形式</th>
                <th>花费</th>
                <th>收入</th>
                <th>AOV</th>
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
              <tr v-for="row in adFormatsData" :key="row.format">
                <td>{{ row.name }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.revenue) }}</td>
                <td>{{ formatCurrency(row.aov) }}</td>
                <td>{{ formatNumber(row.sales) }}</td>
                <td>{{ formatCurrency(row.customerPrice) }}</td>
                <td>{{ formatCurrency(row.conversionCost) }}</td>
                <td>{{ row.conversionRate }}%</td>
                <td>{{ formatCurrency(row.addToCartCost) }}</td>
                <td>{{ row.addToCartRate }}%</td>
                <td>{{ formatNumber(row.users) }}</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatCurrency(row.cpm) }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 占比图表 -->
        <div class="charts-grid">
          <div class="chart-container">
            <PieChart
              :data="adFormatsChartData.spendData"
              :height="'300px'"
              :show-legend="false"
              :donut="true"
            />
            <h5 class="chart-title">花费占比</h5>
            <div class="chart-legend">
              <div
                v-for="item in adFormatsChartData.spendData"
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
              :data="adFormatsChartData.revenueData"
              :height="'300px'"
              :show-legend="false"
              :donut="true"
            />
            <h5 class="chart-title">收入占比</h5>
            <div class="chart-legend">
              <div
                v-for="item in adFormatsChartData.revenueData"
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



    <!-- 高级功能模块 -->
    <MetaDashboardAdvanced />

    <!-- 目录广告 -->
    <div class="catalog-ads-section" id="meta-catalog-ads">
      <div class="section-header">
        <h3 class="section-title">
          <Eye :size="20" />
          目录广告
        </h3>
      </div>

      <div class="catalog-ads-content">
        <!-- 广告类型数据表现 -->
        <div class="catalog-subsection">
          <h4 class="subsection-title">广告类型数据表现</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>广告类型</th>
                  <th>花费</th>
                  <th>ROAS</th>
                  <th>客单价</th>
                  <th>转化率</th>
                  <th>加购率</th>
                  <th>CTR</th>
                  <th>用户数</th>
                  <th>CPC</th>
                  <th>CPM</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in catalogAdsData.adTypes" :key="row.type">
                  <td>{{ row.name }}</td>
                  <td>{{ formatCurrency(row.spend) }}</td>
                  <td>{{ row.roas }}x</td>
                  <td>{{ formatCurrency(row.customerPrice) }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ row.addToCartRate }}%</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatNumber(row.users) }}</td>
                  <td>{{ formatCurrency(row.cpc) }}</td>
                  <td>{{ formatCurrency(row.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 目录组流量表现 -->
        <div class="catalog-subsection">
          <h4 class="subsection-title">目录组流量表现</h4>
          <div class="catalog-traffic-content">
            <div class="table-container">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Product ID</th>
                    <th>花费</th>
                    <th>CTR</th>
                    <th>用户数</th>
                    <th>CPC</th>
                    <th>CPM</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="row in catalogAdsData.traffic" :key="row.productId">
                    <td>{{ row.productId }}</td>
                    <td>{{ formatCurrency(row.spend) }}</td>
                    <td>{{ row.ctr }}%</td>
                    <td>{{ formatNumber(row.users) }}</td>
                    <td>{{ formatCurrency(row.cpc) }}</td>
                    <td>{{ formatCurrency(row.cpm) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- 目录组花费占比图 -->
            <div class="chart-container">
              <PieChart
                :data="catalogAdsData.spendDistribution"
                :height="'300px'"
                :show-legend="false"
                :donut="true"
              />
              <h5 class="chart-title">目录组花费占比</h5>
              <div class="chart-legend">
                <div
                  v-for="item in catalogAdsData.spendDistribution"
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
    </div>

    <!-- 受众类型 -->
    <div class="audience-types-section" id="meta-audience-types">
      <div class="section-header">
        <h3 class="section-title">
          <Users :size="20" />
          受众类型
        </h3>
      </div>

      <div class="audience-types-content">
        <!-- 受众类型维度统计 -->
        <div class="audience-subsection">
          <h4 class="subsection-title">受众类型维度统计</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>受众类型</th>
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
                <tr v-for="row in audienceTypesData.overview" :key="row.type">
                  <td>{{ row.name }}</td>
                  <td>{{ formatCurrency(row.spend) }}</td>
                  <td>{{ formatCurrency(row.revenue) }}</td>
                  <td>{{ formatCurrency(row.aov) }}</td>
                  <td>{{ row.roas }}x</td>
                  <td>{{ formatNumber(row.sales) }}</td>
                  <td>{{ formatCurrency(row.customerPrice) }}</td>
                  <td>{{ formatCurrency(row.conversionCost) }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ formatCurrency(row.addToCartCost) }}</td>
                  <td>{{ row.addToCartRate }}%</td>
                  <td>{{ formatNumber(row.users) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 兴趣受众表现 -->
        <div class="audience-subsection">
          <h4 class="subsection-title">兴趣受众表现</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>广告组名称</th>
                  <th>花费</th>
                  <th>ROAS</th>
                  <th>销量</th>
                  <th>客单价</th>
                  <th>转化率</th>
                  <th>转化成本</th>
                  <th>加购率</th>
                  <th>加购成本</th>
                  <th>用户数</th>
                  <th>CTR</th>
                  <th>CPC</th>
                  <th>CPM</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in audienceTypesData.interest" :key="row.adGroupName">
                  <td>{{ row.adGroupName }}</td>
                  <td>{{ formatCurrency(row.spend) }}</td>
                  <td>{{ row.roas }}x</td>
                  <td>{{ formatNumber(row.sales) }}</td>
                  <td>{{ formatCurrency(row.customerPrice) }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ formatCurrency(row.conversionCost) }}</td>
                  <td>{{ row.addToCartRate }}%</td>
                  <td>{{ formatCurrency(row.addToCartCost) }}</td>
                  <td>{{ formatNumber(row.users) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpc) }}</td>
                  <td>{{ formatCurrency(row.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 再营销受众表现 -->
        <div class="audience-subsection">
          <h4 class="subsection-title">再营销受众表现</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>广告组名称</th>
                  <th>花费</th>
                  <th>ROAS</th>
                  <th>销量</th>
                  <th>客单价</th>
                  <th>转化率</th>
                  <th>转化成本</th>
                  <th>加购率</th>
                  <th>加购成本</th>
                  <th>用户数</th>
                  <th>CTR</th>
                  <th>CPC</th>
                  <th>CPM</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in audienceTypesData.remarketing" :key="row.adGroupName">
                  <td>{{ row.adGroupName }}</td>
                  <td>{{ formatCurrency(row.spend) }}</td>
                  <td>{{ row.roas }}x</td>
                  <td>{{ formatNumber(row.sales) }}</td>
                  <td>{{ formatCurrency(row.customerPrice) }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ formatCurrency(row.conversionCost) }}</td>
                  <td>{{ row.addToCartRate }}%</td>
                  <td>{{ formatCurrency(row.addToCartCost) }}</td>
                  <td>{{ formatNumber(row.users) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpc) }}</td>
                  <td>{{ formatCurrency(row.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 类似受众表现 -->
        <div class="audience-subsection">
          <h4 class="subsection-title">类似受众表现</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>广告组名称</th>
                  <th>花费</th>
                  <th>ROAS</th>
                  <th>销量</th>
                  <th>客单价</th>
                  <th>转化率</th>
                  <th>转化成本</th>
                  <th>加购率</th>
                  <th>加购成本</th>
                  <th>用户数</th>
                  <th>CTR</th>
                  <th>CPC</th>
                  <th>CPM</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="row in audienceTypesData.lookalike" :key="row.adGroupName">
                  <td>{{ row.adGroupName }}</td>
                  <td>{{ formatCurrency(row.spend) }}</td>
                  <td>{{ row.roas }}x</td>
                  <td>{{ formatNumber(row.sales) }}</td>
                  <td>{{ formatCurrency(row.customerPrice) }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ formatCurrency(row.conversionCost) }}</td>
                  <td>{{ row.addToCartRate }}%</td>
                  <td>{{ formatCurrency(row.addToCartCost) }}</td>
                  <td>{{ formatNumber(row.users) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpc) }}</td>
                  <td>{{ formatCurrency(row.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 受众类型饼图 -->
        <div class="charts-grid">
          <div class="chart-container">
            <PieChart
              :data="audienceTypesData.spendDistribution"
              :height="'300px'"
              :show-legend="false"
              :donut="true"
            />
            <h5 class="chart-title">受众类型花费占比</h5>
            <div class="chart-legend">
              <div
                v-for="item in audienceTypesData.spendDistribution"
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
              :data="audienceTypesData.revenueDistribution"
              :height="'300px'"
              :show-legend="false"
              :donut="true"
            />
            <h5 class="chart-title">受众类型收入占比</h5>
            <div class="chart-legend">
              <div
                v-for="item in audienceTypesData.revenueDistribution"
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

    <!-- 用户画像 -->
    <div class="user-demographics-section" id="meta-user-demographics">
      <div class="section-header">
        <h3 class="section-title">
          <Users :size="20" />
          用户画像
        </h3>
      </div>

      <div class="user-demographics-content">
        <!-- 年龄分析 -->
        <div class="demographics-subsection">
          <h4 class="subsection-title">年龄分析</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>年龄段</th>
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
                <tr v-for="row in userDemographicsData.age" :key="row.ageGroup">
                  <td>{{ row.ageGroup }}</td>
                  <td>{{ formatCurrency(row.spend) }}</td>
                  <td>{{ formatCurrency(row.revenue) }}</td>
                  <td>{{ formatCurrency(row.aov) }}</td>
                  <td>{{ row.roas }}x</td>
                  <td>{{ formatNumber(row.sales) }}</td>
                  <td>{{ formatCurrency(row.customerPrice) }}</td>
                  <td>{{ formatCurrency(row.conversionCost) }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ formatCurrency(row.addToCartCost) }}</td>
                  <td>{{ row.addToCartRate }}%</td>
                  <td>{{ formatNumber(row.users) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 性别分析 -->
        <div class="demographics-subsection">
          <h4 class="subsection-title">性别分析</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>性别</th>
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
                <tr v-for="row in userDemographicsData.gender" :key="row.gender">
                  <td>{{ row.gender }}</td>
                  <td>{{ formatCurrency(row.spend) }}</td>
                  <td>{{ formatCurrency(row.revenue) }}</td>
                  <td>{{ formatCurrency(row.aov) }}</td>
                  <td>{{ row.roas }}x</td>
                  <td>{{ formatNumber(row.sales) }}</td>
                  <td>{{ formatCurrency(row.customerPrice) }}</td>
                  <td>{{ formatCurrency(row.conversionCost) }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ formatCurrency(row.addToCartCost) }}</td>
                  <td>{{ row.addToCartRate }}%</td>
                  <td>{{ formatNumber(row.users) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 设备分析 -->
        <div class="demographics-subsection">
          <h4 class="subsection-title">设备分析</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>设备</th>
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
                <tr v-for="row in userDemographicsData.device" :key="row.device">
                  <td>{{ row.deviceName }}</td>
                  <td>{{ formatCurrency(row.spend) }}</td>
                  <td>{{ formatCurrency(row.revenue) }}</td>
                  <td>{{ formatCurrency(row.aov) }}</td>
                  <td>{{ row.roas }}x</td>
                  <td>{{ formatNumber(row.sales) }}</td>
                  <td>{{ formatCurrency(row.customerPrice) }}</td>
                  <td>{{ formatCurrency(row.conversionCost) }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ formatCurrency(row.addToCartCost) }}</td>
                  <td>{{ row.addToCartRate }}%</td>
                  <td>{{ formatNumber(row.users) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 平台分析 -->
        <div class="demographics-subsection">
          <h4 class="subsection-title">平台分析</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>平台名称</th>
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
                <tr v-for="row in userDemographicsData.platform" :key="row.platform">
                  <td>{{ row.platformName }}</td>
                  <td>{{ formatCurrency(row.spend) }}</td>
                  <td>{{ formatCurrency(row.revenue) }}</td>
                  <td>{{ formatCurrency(row.aov) }}</td>
                  <td>{{ row.roas }}x</td>
                  <td>{{ formatNumber(row.sales) }}</td>
                  <td>{{ formatCurrency(row.customerPrice) }}</td>
                  <td>{{ formatCurrency(row.conversionCost) }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ formatCurrency(row.addToCartCost) }}</td>
                  <td>{{ row.addToCartRate }}%</td>
                  <td>{{ formatNumber(row.users) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 版位分析 -->
        <div class="demographics-subsection">
          <h4 class="subsection-title">版位分析</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>版位名称</th>
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
                <tr v-for="row in userDemographicsData.placement" :key="row.placement">
                  <td>{{ row.placementName }}</td>
                  <td>{{ formatCurrency(row.spend) }}</td>
                  <td>{{ formatCurrency(row.revenue) }}</td>
                  <td>{{ formatCurrency(row.aov) }}</td>
                  <td>{{ row.roas }}x</td>
                  <td>{{ formatNumber(row.sales) }}</td>
                  <td>{{ formatCurrency(row.customerPrice) }}</td>
                  <td>{{ formatCurrency(row.conversionCost) }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ formatCurrency(row.addToCartCost) }}</td>
                  <td>{{ row.addToCartRate }}%</td>
                  <td>{{ formatNumber(row.users) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 地区分析 -->
        <div class="demographics-subsection">
          <h4 class="subsection-title">地区分析</h4>
          <div class="table-container">
            <table class="data-table">
              <thead>
                <tr>
                  <th>地区名称</th>
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
                <tr v-for="row in userDemographicsData.region" :key="row.region">
                  <td>{{ row.regionName }}</td>
                  <td>{{ formatCurrency(row.spend) }}</td>
                  <td>{{ formatCurrency(row.revenue) }}</td>
                  <td>{{ formatCurrency(row.aov) }}</td>
                  <td>{{ row.roas }}x</td>
                  <td>{{ formatNumber(row.sales) }}</td>
                  <td>{{ formatCurrency(row.customerPrice) }}</td>
                  <td>{{ formatCurrency(row.conversionCost) }}</td>
                  <td>{{ row.conversionRate }}%</td>
                  <td>{{ formatCurrency(row.addToCartCost) }}</td>
                  <td>{{ row.addToCartRate }}%</td>
                  <td>{{ formatNumber(row.users) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpm) }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- 自定义指标模态框 -->
    <div v-if="showCustomMetricsModal" class="modal-overlay" @click="showCustomMetricsModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h4>自定义数据指标</h4>
          <button class="modal-close" @click="showCustomMetricsModal = false">×</button>
        </div>

        <div class="modal-body">
          <div class="metrics-categories">
            <div class="metrics-category">
              <h5>曝光层（自定义）</h5>
              <div class="metrics-list">
                <label v-for="metric in customMetrics.exposure" :key="metric.id" class="metric-item">
                  <input type="checkbox" v-model="metric.selected" />
                  <span>{{ metric.name }}</span>
                </label>
              </div>
            </div>

            <div class="metrics-category">
              <h5>互动指标（自定义）</h5>
              <div class="metrics-list">
                <label v-for="metric in customMetrics.engagement" :key="metric.id" class="metric-item">
                  <input type="checkbox" v-model="metric.selected" />
                  <span>{{ metric.name }}</span>
                </label>
              </div>
            </div>

            <div class="metrics-category">
              <h5>视频播放指标（自定义）</h5>
              <div class="metrics-list">
                <label v-for="metric in customMetrics.video" :key="metric.id" class="metric-item">
                  <input type="checkbox" v-model="metric.selected" />
                  <span>{{ metric.name }}</span>
                </label>
              </div>
            </div>

            <div class="metrics-category">
              <h5>点击意向层（自定义）</h5>
              <div class="metrics-list">
                <label v-for="metric in customMetrics.clickIntent" :key="metric.id" class="metric-item">
                  <input type="checkbox" v-model="metric.selected" />
                  <span>{{ metric.name }}</span>
                </label>
              </div>
            </div>

            <div class="metrics-category">
              <h5>转化层（自定义）</h5>
              <div class="metrics-list">
                <label v-for="metric in customMetrics.conversion" :key="metric.id" class="metric-item">
                  <input type="checkbox" v-model="metric.selected" />
                  <span>{{ metric.name }}</span>
                </label>
              </div>
            </div>

            <div class="metrics-category">
              <h5>表现漏斗（自定义）</h5>
              <div class="metrics-list">
                <label v-for="metric in customMetrics.funnel" :key="metric.id" class="metric-item">
                  <input type="checkbox" v-model="metric.selected" />
                  <span>{{ metric.name }}</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="showCustomMetricsModal = false">取消</button>
          <button class="btn-confirm" @click="applyCustomMetrics">应用</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { Settings, AlertTriangle, BarChart3, Calendar, Target, DollarSign, TrendingUp, Users, Eye, Globe, Image } from 'lucide-vue-next'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'
import MetaDashboardAdvanced from './MetaDashboardAdvanced.vue'
import {
  mockGetMetaAccounts,
  mockGetMetaAlerts,
  mockGetMetaAccountOverview,
  mockGetMetaDailyData,
  mockGetMetaAdObjectives,
  mockMetaAdObjectivesChartData,
  mockGetMetaAdLayers,
  mockGetMetaCustomMetrics,
  mockGetMetaNewVsRemarketing,
  mockMetaNewVsRemarketingChartData,
  mockGetMetaAdFormats,
  mockMetaAdFormatsChartData,
  mockGetMetaCatalogAds,
  mockGetMetaAudienceTypes,
  mockGetMetaUserDemographics,


} from '@/mock/dashboard'

// 响应式数据
const selectedAccount = ref('')
const accounts = ref<any[]>([])
const alerts = ref<any[]>([])
const accountOverview = ref<any>({
  totalSpend: 0,
  totalSpendChange: 0,
  dailyAverage: 0,
  dailyAverageChange: 0,
  adRevenue: 0,
  adRevenueChange: 0,
  roas: 0,
  roasChange: 0,
  users: 0,
  usersChange: 0,
  cpc: 0,
  cpcChange: 0,
  trendData: { labels: [], datasets: [] },
  salesRoasTrendData: { labels: [], datasets: [] }
})
const dailyData = ref<any[]>([])
const adObjectives = ref<any[]>([])
const objectivesChartData = ref<any>({
  spendData: [],
  revenueData: []
})
const adLayers = ref<any>({
  exposure: [],
  engagement: [],
  clickIntent: [],
  shopping: []
})
const showCustomMetricsModal = ref(false)
const customMetrics = ref<any>({
  exposure: [],
  engagement: [],
  video: [],
  clickIntent: [],
  conversion: [],
  funnel: []
})
const newVsRemarketingData = ref<any[]>([])
const newVsRemarketingChartData = ref<any>({
  spendData: [],
  revenueData: []
})
const adFormatsData = ref<any[]>([])
const adFormatsChartData = ref<any>({
  spendData: [],
  revenueData: []
})
const catalogAdsData = ref<any>({
  adTypes: [],
  traffic: [],
  spendDistribution: []
})
const audienceTypesData = ref<any>({
  overview: [],
  interest: [],
  remarketing: [],
  lookalike: [],
  spendDistribution: [],
  revenueDistribution: []
})
const userDemographicsData = ref<any>({
  age: [],
  gender: [],
  device: [],
  platform: [],
  placement: [],
  region: []
})



// 计算属性
const selectedAccountInfo = computed(() => {
  return accounts.value.find(account => account.id === selectedAccount.value)
})

// 方法
const handleAccountChange = () => {
  console.log('Selected account:', selectedAccount.value)
  // 这里可以根据选择的账户重新加载数据
}

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'balance':
      return DollarSign
    case 'performance':
      return TrendingUp
    case 'creative':
      return Eye
    case 'budget':
      return Target
    default:
      return AlertTriangle
  }
}

const handleAlertAction = (alert: any) => {
  console.log('Alert action:', alert)
  // 这里可以处理提醒操作
}

const applyCustomMetrics = () => {
  console.log('Applied custom metrics:', customMetrics.value)
  showCustomMetricsModal.value = false
  // 这里可以根据选择的指标重新生成表格和图表
}

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

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

// 加载数据
const loadData = async () => {
  try {
    // 加载账户列表
    const accountsResponse = await mockGetMetaAccounts()
    if (accountsResponse.success && accountsResponse.data) {
      accounts.value = accountsResponse.data
      if (accounts.value.length > 0) {
        selectedAccount.value = accounts.value[0].id
      }
    }

    // 加载提醒数据
    const alertsResponse = await mockGetMetaAlerts()
    if (alertsResponse.success && alertsResponse.data) {
      alerts.value = alertsResponse.data
    }

    // 加载账户总览
    const overviewResponse = await mockGetMetaAccountOverview()
    if (overviewResponse.success && overviewResponse.data) {
      accountOverview.value = overviewResponse.data
    }

    // 加载日投放数据
    const dailyResponse = await mockGetMetaDailyData()
    if (dailyResponse.success && dailyResponse.data) {
      dailyData.value = dailyResponse.data
    }

    // 加载广告目标数据
    const objectivesResponse = await mockGetMetaAdObjectives()
    if (objectivesResponse.success && objectivesResponse.data) {
      adObjectives.value = objectivesResponse.data
    }

    // 设置图表数据
    objectivesChartData.value = mockMetaAdObjectivesChartData

    // 加载广告层级数据
    const adLayersResponse = await mockGetMetaAdLayers()
    if (adLayersResponse.success && adLayersResponse.data) {
      adLayers.value = adLayersResponse.data
    }

    // 加载自定义指标配置
    const customMetricsResponse = await mockGetMetaCustomMetrics()
    if (customMetricsResponse.success && customMetricsResponse.data) {
      customMetrics.value = customMetricsResponse.data
    }

    // 加载拉新与再营销数据
    const newVsRemarketingResponse = await mockGetMetaNewVsRemarketing()
    if (newVsRemarketingResponse.success && newVsRemarketingResponse.data) {
      newVsRemarketingData.value = newVsRemarketingResponse.data
    }
    newVsRemarketingChartData.value = mockMetaNewVsRemarketingChartData

    // 加载广告形式数据
    const adFormatsResponse = await mockGetMetaAdFormats()
    if (adFormatsResponse.success && adFormatsResponse.data) {
      adFormatsData.value = adFormatsResponse.data
    }
    adFormatsChartData.value = mockMetaAdFormatsChartData

    // 加载目录广告数据
    const catalogAdsResponse = await mockGetMetaCatalogAds()
    if (catalogAdsResponse.success && catalogAdsResponse.data) {
      catalogAdsData.value = {
        adTypes: catalogAdsResponse.data.adTypes.map(item => ({
          ...item,
          name: item.type === 'Facebook' ? 'Facebook' :
                item.type === 'Instagram' ? 'Instagram' :
                item.type === 'Audience_network' ? '受众网络' :
                item.type === 'Messenger' ? 'Messenger' : '未知'
        })),
        traffic: catalogAdsResponse.data.catalogGroups,
        spendDistribution: catalogAdsResponse.data.catalogGroups.map((item, index) => ({
          name: item.productId,
          value: item.spend,
          color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
        }))
      }
    }

    // 加载受众类型数据
    const audienceTypesResponse = await mockGetMetaAudienceTypes()
    if (audienceTypesResponse.success && audienceTypesResponse.data) {
      audienceTypesData.value = {
        overview: audienceTypesResponse.data.summary,
        interest: audienceTypesResponse.data.interestDetails,
        remarketing: audienceTypesResponse.data.interestDetails.map(item => ({
          ...item,
          adGroupName: item.adGroupName + ' (再营销)'
        })),
        lookalike: audienceTypesResponse.data.interestDetails.map(item => ({
          ...item,
          adGroupName: item.adGroupName + ' (类似)'
        })),
        spendDistribution: audienceTypesResponse.data.summary.map((item, index) => ({
          name: item.name,
          value: item.spend,
          color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]
        })),
        revenueDistribution: audienceTypesResponse.data.summary.map((item, index) => ({
          name: item.name,
          value: item.revenue,
          color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'][index % 4]
        }))
      }
    }

    // 加载用户画像数据
    const userDemographicsResponse = await mockGetMetaUserDemographics()
    if (userDemographicsResponse.success && userDemographicsResponse.data) {
      userDemographicsData.value = {
        age: userDemographicsResponse.data.age.map(item => ({
          ...item,
          ageGroup: item.ageRange
        })),
        gender: userDemographicsResponse.data.gender,
        device: userDemographicsResponse.data.device.map(item => ({
          ...item,
          deviceName: item.device === 'Mobile_app' ? '移动应用' :
                      item.device === 'Desktop' ? '桌面设备' :
                      item.device === 'Mobile_web' ? '移动网页' : '未知设备'
        })),
        platform: [
          { platform: 'Facebook', platformName: 'Facebook', spend: 25420.50, revenue: 108500.20, aov: 102.80, roas: 4.27, sales: 1055, customerPrice: 102.80, conversionCost: 24.12, conversionRate: 3.1, addToCartCost: 8.90, addToCartRate: 12.8, users: 18500, ctr: 3.0, cpm: 19.50 },
          { platform: 'Instagram', platformName: 'Instagram', spend: 18200.30, revenue: 78900.50, aov: 98.20, roas: 4.34, sales: 803, customerPrice: 98.20, conversionCost: 22.67, conversionRate: 3.2, addToCartCost: 8.45, addToCartRate: 13.1, users: 15200, ctr: 2.9, cpm: 18.20 },
          { platform: 'Audience_network', platformName: '受众网络', spend: 8900.20, revenue: 35200.80, aov: 88.50, roas: 3.95, sales: 398, customerPrice: 88.50, conversionCost: 22.36, conversionRate: 2.8, addToCartCost: 8.10, addToCartRate: 11.8, users: 9800, ctr: 2.5, cpm: 17.80 }
        ],
        placement: [
          { placement: 'feed', placementName: 'Facebook 动态', spend: 22800.20, revenue: 95200.80, aov: 105.50, roas: 4.17, sales: 902, customerPrice: 105.50, conversionCost: 25.28, conversionRate: 3.1, addToCartCost: 8.95, addToCartRate: 12.8, users: 18500, ctr: 3.0, cpm: 19.50 },
          { placement: 'stories', placementName: 'Instagram 快拍', spend: 15200.50, revenue: 61500.20, aov: 97.93, roas: 4.04, sales: 628, customerPrice: 97.93, conversionCost: 24.21, conversionRate: 2.9, addToCartCost: 8.84, addToCartRate: 12.5, users: 12800, ctr: 2.8, cpm: 18.80 },
          { placement: 'reels', placementName: 'Instagram Reels', spend: 18500.30, revenue: 76800.50, aov: 98.20, roas: 4.15, sales: 782, customerPrice: 98.20, conversionCost: 23.66, conversionRate: 3.0, addToCartCost: 8.25, addToCartRate: 12.2, users: 15200, ctr: 2.9, cpm: 18.20 }
        ],
        region: [
          { region: 'US', regionName: '美国', spend: 35200.50, revenue: 148500.20, aov: 102.80, roas: 4.22, sales: 1445, customerPrice: 102.80, conversionCost: 24.36, conversionRate: 3.1, addToCartCost: 8.75, addToCartRate: 12.8, users: 28500, ctr: 3.0, cpm: 19.20 },
          { region: 'CA', regionName: '加拿大', spend: 18000.80, revenue: 68300.00, aov: 95.50, roas: 3.79, sales: 715, customerPrice: 95.50, conversionCost: 25.18, conversionRate: 2.8, addToCartCost: 8.55, addToCartRate: 11.5, users: 16000, ctr: 2.7, cpm: 17.80 },
          { region: 'UK', regionName: '英国', spend: 12300.70, revenue: 49200.30, aov: 88.50, roas: 4.00, sales: 556, customerPrice: 88.50, conversionCost: 22.12, conversionRate: 2.9, addToCartCost: 8.20, addToCartRate: 12.0, users: 12800, ctr: 2.8, cpm: 18.50 }
        ]
      }
    }





  } catch (error) {
    console.error('Error loading Meta dashboard data:', error)
  }
}

// 生命周期
onMounted(() => {
  loadData()
})
</script>

<style scoped>
.meta-dashboard-panel {
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

/* 日投放数据样式 */
.daily-data-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 广告目标样式 */
.objectives-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.objectives-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 广告数据样式 */
.ad-data-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ad-layer-subsection {
  margin-bottom: 40px;
}

.ad-layer-subsection:last-child {
  margin-bottom: 0;
}

/* 自定义指标样式 */
.custom-metrics-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-metrics-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

.custom-metrics-btn:hover {
  background: var(--color-primary-hover);
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
  background: var(--color-surface);
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
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h4 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  background: none;
  border: none;
  font-size: 24px;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.modal-close:hover {
  background: var(--color-background);
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.metrics-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.metrics-category {
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 16px;
}

.metrics-category h5 {
  margin: 0 0 16px 0;
  color: var(--color-text-primary);
  font-size: 16px;
  font-weight: 600;
}

.metrics-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.metric-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  cursor: pointer;
  font-size: 14px;
  color: var(--color-text-primary);
}

.metric-item input[type="checkbox"] {
  margin-top: 2px;
  flex-shrink: 0;
}

.metric-item span {
  line-height: 1.4;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid var(--color-border);
}

.btn-cancel,
.btn-confirm {
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.btn-cancel {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.btn-cancel:hover {
  background: var(--color-background);
}

.btn-confirm {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.btn-confirm:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

/* 拉新与再营销样式 */
.new-vs-remarketing-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.new-vs-remarketing-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* 广告形式样式 */
.ad-formats-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.ad-formats-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
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
  background: var(--color-surface);
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
}

.data-table td {
  color: var(--color-text-primary);
  font-size: 14px;
}

.data-table tr:hover {
  background: var(--color-background);
}

/* 目录广告样式 */
.catalog-ads-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.catalog-ads-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.catalog-subsection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.catalog-traffic-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

/* 受众类型样式 */
.audience-types-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.audience-types-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.audience-subsection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 落地页样式 */
.landing-page-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.landing-page-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 素材表现样式 */
.creative-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.creative-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.creative-preview {
  display: flex;
  align-items: center;
  gap: 8px;
}

.creative-thumb {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  object-fit: cover;
}

/* 用户画像样式 */
.user-demographics-section {
  background: var(--color-surface);
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.user-demographics-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.demographics-subsection {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .meta-dashboard-panel {
    padding: 16px;
  }

  .metrics-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 12px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .account-selector {
    flex-direction: column;
    align-items: flex-start;
  }

  .alert-cards {
    grid-template-columns: 1fr;
  }

  .catalog-traffic-content {
    flex-direction: column;
  }

  .audience-types-content,
  .user-demographics-content {
    gap: 24px;
  }
}
</style>
