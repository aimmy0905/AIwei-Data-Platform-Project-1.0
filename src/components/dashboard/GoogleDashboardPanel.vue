<template>
    <div class="google-dashboard-panel">
    <!-- 账号选择模块 -->
    <div class="account-section" id="google-account">
      <div class="section-header">
        <h3 class="section-title">
          <Settings :size="20" />
          账号选择
        </h3>
      </div>

      <!-- 筛选选项区域 -->
      <div class="filters-section">
        <div class="selector-row">
          <div class="account-dropdown">
            <select v-model="selectedAccount" @change="handleAccountChange">
              <option value="all">全部店铺</option>
              <option
                v-for="account in accounts"
                :key="account.id"
                :value="account.id"
              >
                {{ account.name }} ({{ account.status }})
              </option>
            </select>
          </div>

          <!-- 时间选择器 -->
          <div class="time-selector">
            <div class="time-buttons">
              <button
                v-for="option in timeOptions"
                :key="option.value"
                :class="['time-btn', { 'time-btn--active': selectedTimeRange === option.value }]"
                @click="selectTimeRange(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
            <!-- 自定义时间选择器 -->
            <div v-if="selectedTimeRange === 'custom'" class="custom-date-range">
              <input
                type="date"
                v-model="customStartDate"
                @change="handleCustomDateChange"
                class="date-input"
              />
              <span class="date-separator">至</span>
              <input
                type="date"
                v-model="customEndDate"
                @change="handleCustomDateChange"
                class="date-input"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 账户信息区域 -->
      <div class="account-info-section" v-if="selectedAccountInfo">
        <div class="info-card">
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
    <div class="alert-section" id="google-alerts">
      <div class="section-header">
        <h3 class="section-title">
          <AlertTriangle :size="20" />
          数据提醒
        </h3>
        <p class="section-description">显示需要关注的异常数据和账户状态</p>
    </div>

      <div class="alert-cards">
        <div
          v-for="alert in alerts"
          :key="alert.id"
          :class="['alert-card', `alert-card--${alert.type}`]"
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

    <!-- 广告账户总览 -->
    <div class="overview-section" id="google-overview">
      <div class="section-header">
        <h3 class="section-title">
          <BarChart3 :size="20" />
          广告账户总览
        </h3>
      </div>

      <!-- 广告周数据 -->
      <div class="overview-subsection">
        <h4 class="subsection-title">广告周数据</h4>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Google花费</div>
            <div class="metric-value">{{ formatCurrency(weeklyData.spend) }}</div>
            <div class="metric-change" :class="weeklyData.spendChange > 0 ? 'positive' : 'negative'">
              {{ weeklyData.spendChange > 0 ? '+' : '' }}{{ weeklyData.spendChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">总转化价值</div>
            <div class="metric-value">{{ formatCurrency(weeklyData.conversionValue) }}</div>
            <div class="metric-change" :class="weeklyData.conversionValueChange > 0 ? 'positive' : 'negative'">
              {{ weeklyData.conversionValueChange > 0 ? '+' : '' }}{{ weeklyData.conversionValueChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">ROI</div>
            <div class="metric-value">{{ weeklyData.roi }}x</div>
            <div class="metric-change" :class="weeklyData.roiChange > 0 ? 'positive' : 'negative'">
              {{ weeklyData.roiChange > 0 ? '+' : '' }}{{ weeklyData.roiChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">转化率</div>
            <div class="metric-value">{{ weeklyData.conversionRate }}%</div>
            <div class="metric-change" :class="weeklyData.conversionRateChange > 0 ? 'positive' : 'negative'">
              {{ weeklyData.conversionRateChange > 0 ? '+' : '' }}{{ weeklyData.conversionRateChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">日均消耗</div>
            <div class="metric-value">{{ formatCurrency(weeklyData.dailyAverage) }}</div>
            <div class="metric-change" :class="weeklyData.dailyAverageChange > 0 ? 'positive' : 'negative'">
              {{ weeklyData.dailyAverageChange > 0 ? '+' : '' }}{{ weeklyData.dailyAverageChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">点击次数</div>
            <div class="metric-value">{{ formatNumber(weeklyData.clicks) }}</div>
            <div class="metric-change" :class="weeklyData.clicksChange > 0 ? 'positive' : 'negative'">
              {{ weeklyData.clicksChange > 0 ? '+' : '' }}{{ weeklyData.clicksChange }}%
            </div>
          </div>
        </div>
      </div>

      <!-- 广告周数据-不含线索 -->
      <div class="overview-subsection">
        <h4 class="subsection-title">广告周数据-不含线索</h4>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Google花费</div>
            <div class="metric-value">{{ formatCurrency(weeklyDataNoLeads.spend) }}</div>
            <div class="metric-change" :class="weeklyDataNoLeads.spendChange > 0 ? 'positive' : 'negative'">
              {{ weeklyDataNoLeads.spendChange > 0 ? '+' : '' }}{{ weeklyDataNoLeads.spendChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">总转化价值</div>
            <div class="metric-value">{{ formatCurrency(weeklyDataNoLeads.conversionValue) }}</div>
            <div class="metric-change" :class="weeklyDataNoLeads.conversionValueChange > 0 ? 'positive' : 'negative'">
              {{ weeklyDataNoLeads.conversionValueChange > 0 ? '+' : '' }}{{ weeklyDataNoLeads.conversionValueChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">ROI</div>
            <div class="metric-value">{{ weeklyDataNoLeads.roi }}x</div>
            <div class="metric-change" :class="weeklyDataNoLeads.roiChange > 0 ? 'positive' : 'negative'">
              {{ weeklyDataNoLeads.roiChange > 0 ? '+' : '' }}{{ weeklyDataNoLeads.roiChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">日均消耗</div>
            <div class="metric-value">{{ formatCurrency(weeklyDataNoLeads.dailyAverage) }}</div>
            <div class="metric-change" :class="weeklyDataNoLeads.dailyAverageChange > 0 ? 'positive' : 'negative'">
              {{ weeklyDataNoLeads.dailyAverageChange > 0 ? '+' : '' }}{{ weeklyDataNoLeads.dailyAverageChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">点击次数</div>
            <div class="metric-value">{{ formatNumber(weeklyDataNoLeads.clicks) }}</div>
            <div class="metric-change" :class="weeklyDataNoLeads.clicksChange > 0 ? 'positive' : 'negative'">
              {{ weeklyDataNoLeads.clicksChange > 0 ? '+' : '' }}{{ weeklyDataNoLeads.clicksChange }}%
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-label">点击成本</div>
            <div class="metric-value">{{ formatCurrency(weeklyDataNoLeads.cpc || 0) }}</div>
            <div class="metric-change" :class="(weeklyDataNoLeads.cpcChange || 0) > 0 ? 'negative' : 'positive'">
              {{ (weeklyDataNoLeads.cpcChange || 0) > 0 ? '+' : '' }}{{ weeklyDataNoLeads.cpcChange || 0 }}%
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
              :data="trendChartData"
              :height="'300px'"
              :show-legend="true"
            />
          </div>

          <div class="chart-container">
            <h5 class="chart-title">销量、ROAS趋势</h5>
            <LineChart
              :data="roasTrendData"
              :height="'300px'"
              :show-legend="true"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 日投放数据 -->
    <div class="daily-data-section" id="google-daily">
      <div class="section-header">
        <h3 class="section-title">
          <Calendar :size="20" />
          日投放数据
        </h3>
      </div>

      <div class="table-container">
        <div class="table-header">
          <div class="table-controls">
            <button class="table-control-btn" @click="exportDailyData">
              <Download :size="16" />
              导出数据
            </button>
          </div>
        </div>

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
              <tr v-for="row in dailyData" :key="row.date">
                <td>{{ row.date }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.roi }}x</td>
                <td>{{ formatNumber(row.orders) }}</td>
                <td>{{ row.orderConversionRate }}%</td>
                <td>{{ formatCurrency(row.orderConversionCost) }}</td>
                <td>{{ formatCurrency(row.aov) }}</td>
                <td>{{ formatCurrency(row.cpc) }}</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatCurrency(row.cpv) }}</td>
                <td>{{ formatNumber(row.addToCarts) }}</td>
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
    <div class="ad-forms-section" id="google-ad-forms">
      <div class="section-header">
        <h3 class="section-title">
          <Target :size="20" />
          广告形式数据表现
        </h3>
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
              <tr v-for="row in adFormsData" :key="row.type">
                <td>{{ row.type }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.roi }}x</td>
                <td>{{ formatNumber(row.orders) }}</td>
                <td>{{ row.orderConversionRate }}%</td>
                <td>{{ formatCurrency(row.orderConversionCost) }}</td>
                <td>{{ formatCurrency(row.aov) }}</td>
                <td>{{ formatCurrency(row.cpc) }}</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatCurrency(row.cpa) }}</td>
                <td>{{ formatCurrency(row.cpv) }}</td>
                <td>{{ formatNumber(row.addToCarts) }}</td>
                <td>{{ formatCurrency(row.addToCartCost) }}</td>
                <td>{{ row.addToCartRate }}%</td>
                <td>{{ formatNumber(row.clicks) }}</td>
                <td>{{ formatNumber(row.views) }}</td>
                <td>{{ formatNumber(row.impressions) }}</td>
                <td>{{ formatNumber(row.users) }}</td>
                <td>{{ formatNumber(row.trafficConversions) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 占比图表 -->
      <div class="charts-subsection">
        <h4 class="subsection-title">占比分析</h4>
        <div class="charts-grid">
          <div class="chart-container">
            <h5 class="chart-title">成本占比</h5>
            <PieChart
              :data="adFormsCostDistributionData"
              :height="'350px'"
              :show-legend="true"
              :donut="false"
            />
          </div>

          <div class="chart-container">
            <h5 class="chart-title">收入占比</h5>
            <PieChart
              :data="adFormsRevenueDistributionData"
              :height="'350px'"
              :show-legend="true"
              :donut="false"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 广告类型数据表现 -->
    <div class="ad-types-section" id="google-ad-types">
      <div class="section-header">
        <h3 class="section-title">
          <Layers :size="20" />
          广告类型数据表现
        </h3>
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
              <tr v-for="row in adTypesData" :key="row.type">
                <td>{{ row.type }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.roi }}x</td>
                <td>{{ formatNumber(row.orders) }}</td>
                <td>{{ row.orderConversionRate }}%</td>
                <td>{{ formatCurrency(row.orderConversionCost) }}</td>
                <td>{{ formatCurrency(row.aov) }}</td>
                <td>{{ formatCurrency(row.cpc) }}</td>
                <td>{{ row.ctr }}%</td>
                <td>{{ formatCurrency(row.cpa) }}</td>
                <td>{{ formatCurrency(row.cpv) }}</td>
                <td>{{ formatNumber(row.addToCarts) }}</td>
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

      <!-- 占比图表 -->
      <div class="charts-subsection">
        <h4 class="subsection-title">占比分析</h4>
        <div class="charts-grid">
          <div class="chart-container">
            <h5 class="chart-title">成本占比</h5>
            <div class="chart-content">
              <PieChart
                :data="adTypesCostDistributionData"
                :height="'300px'"
                :show-legend="false"
                :donut="false"
              />
            </div>
            <div class="chart-legend">
              <div
                v-for="(item, index) in adTypesCostDistributionData"
                :key="item.name"
                class="legend-item"
              >
                <div
                  class="legend-color"
                  :style="{ backgroundColor: item.color }"
                ></div>
                <span class="legend-text">{{ item.name }}</span>
                <span class="legend-value">{{ formatCurrency(item.value) }}</span>
              </div>
            </div>
          </div>

          <div class="chart-container">
            <h5 class="chart-title">收入占比</h5>
            <div class="chart-content">
              <PieChart
                :data="adTypesRevenueDistributionData"
                :height="'300px'"
                :show-legend="false"
                :donut="false"
              />
            </div>
            <div class="chart-legend">
              <div
                v-for="(item, index) in adTypesRevenueDistributionData"
                :key="item.name"
                class="legend-item"
              >
                <div
                  class="legend-color"
                  :style="{ backgroundColor: item.color }"
                ></div>
                <span class="legend-text">{{ item.name }}</span>
                <span class="legend-value">{{ formatCurrency(item.value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 广告系列表现数据 -->
    <div class="campaigns-section" id="google-campaigns">
      <div class="section-header">
        <h3 class="section-title">
          <Briefcase :size="20" />
          广告系列表现数据
        </h3>
        <p class="section-description">品牌广告、除品牌词外的搜索广告、Shopping广告、Pmax广告</p>
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
              <tr v-for="row in campaignsData" :key="row.name">
                <td>{{ row.name }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.roi }}x</td>
                <td>{{ formatNumber(row.orders) }}</td>
                <td>{{ row.orderConversionRate }}%</td>
                <td>{{ formatCurrency(row.orderConversionCost) }}</td>
                <td>{{ formatCurrency(row.aov) }}</td>
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
    <div class="video-display-section" id="google-video-display">
      <div class="section-header">
        <h3 class="section-title">
          <Video :size="20" />
          Video、Demand Gen及Display广告表现
        </h3>
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
              <tr v-for="row in videoDisplayData" :key="row.name">
                <td>{{ row.name }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ row.roas }}x</td>
                <td>{{ formatNumber(row.conversions) }}</td>
                <td>{{ row.conversionRate }}%</td>
                <td>{{ formatNumber(row.interactions) }}</td>
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
    <div class="keywords-section" id="google-keywords">
      <div class="section-header">
        <h3 class="section-title">
          <Search :size="20" />
          搜索关键字数据表现
        </h3>
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
              <tr v-for="row in keywordsData" :key="row.keyword">
                <td>{{ row.keyword }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ row.spendPercentage }}%</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ formatNumber(row.conversions) }}</td>
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
    <div class="audience-section" id="google-audience">
      <div class="section-header">
        <h3 class="section-title">
          <Users :size="20" />
          受众表现数据
        </h3>
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
              <tr v-for="row in audienceData" :key="row.name">
                <td>{{ row.name }}</td>
                <td>{{ row.keywords }}</td>
                <td>{{ formatCurrency(row.spend) }}</td>
                <td>{{ row.spendPercentage }}%</td>
                <td>{{ formatCurrency(row.conversionValue) }}</td>
                <td>{{ formatNumber(row.conversions) }}</td>
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
    <div class="materials-section" id="google-materials">
      <div class="section-header">
        <h3 class="section-title">
          <Image :size="20" />
          素材表现
        </h3>
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
                <tr v-for="row in imageMaterialsData" :key="row.id">
                  <td>{{ row.id }}</td>
                  <td>
                    <img :src="row.imageUrl" :alt="row.id" class="material-image" />
                  </td>
                  <td>
                    <a :href="row.adLink" target="_blank" class="ad-link">查看广告</a>
                  </td>
                  <td>{{ formatNumber(row.impressions) }}</td>
                  <td>{{ formatNumber(row.clicks) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ formatCurrency(row.cpc) }}</td>
                  <td>{{ formatNumber(row.conversions) }}</td>
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
                <tr v-for="row in videoMaterialsData" :key="row.id">
                  <td>
                    <img :src="row.thumbnail" :alt="row.id" class="material-image" />
                  </td>
                  <td>
                    <a :href="row.videoLink" target="_blank" class="ad-link">查看视频</a>
                  </td>
                  <td>{{ row.id }}</td>
                  <td>{{ row.duration }}</td>
                  <td>{{ formatNumber(row.impressions) }}</td>
                  <td>{{ formatNumber(row.clicks) }}</td>
                  <td>{{ row.ctr }}%</td>
                  <td>{{ row.viewRate }}%</td>
                  <td>{{ formatNumber(row.views) }}</td>
                  <td>{{ formatNumber(row.conversions) }}</td>
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
import {
  AlertTriangle,
  Settings,
  BarChart3,
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Target,
  Layers,
  Briefcase,
  Video,
  Search,
  Users,
  Image
} from 'lucide-vue-next'
import LineChart from '@/components/charts/LineChart.vue'
import PieChart from '@/components/charts/PieChart.vue'

// 接口定义
interface Alert {
  id: string
  type: 'error' | 'warning' | 'info'
  title: string
  message: string
  value?: string
}

interface Account {
  id: string
  name: string
  status: 'active' | 'limited' | 'suspended'
  balance: string
  statusText: string
}

interface WeeklyData {
  spend: number
  spendChange: number
  conversionValue: number
  conversionValueChange: number
  roi: number
  roiChange: number
  conversionRate: number
  conversionRateChange: number
  dailyAverage: number
  dailyAverageChange: number
  clicks: number
  clicksChange: number
  cpc?: number
  cpcChange?: number
}

interface DailyDataRow {
  date: string
  spend: number
  conversionValue: number
  roi: number
  orders: number
  orderConversionRate: number
  orderConversionCost: number
  aov: number
  cpc: number
  ctr: number
  cpv: number
  addToCarts: number
  addToCartCost: number
  addToCartRate: number
  clicks: number
  views: number
  impressions: number
  users: number
}

interface AdFormData {
  type: string
  spend: number
  conversionValue: number
  roi: number
  orders: number
  orderConversionRate: number
  orderConversionCost: number
  aov: number
  cpc: number
  ctr: number
  cpa: number
  cpv: number
  addToCarts: number
  addToCartCost: number
  addToCartRate: number
  clicks: number
  views: number
  impressions: number
  users: number
  trafficConversions: number
}

interface AdTypeData {
  type: string
  spend: number
  conversionValue: number
  roi: number
  orders: number
  orderConversionRate: number
  orderConversionCost: number
  aov: number
  cpc: number
  ctr: number
  cpa: number
  cpv: number
  addToCarts: number
  addToCartCost: number
  addToCartRate: number
  clicks: number
  views: number
  impressions: number
  users: number
}

interface CampaignData {
  name: string
  spend: number
  conversionValue: number
  roi: number
  orders: number
  orderConversionRate: number
  orderConversionCost: number
  aov: number
  cpc: number
  ctr: number
  clicks: number
  impressions: number
  users: number
}

interface VideoDisplayData {
  name: string
  spend: number
  conversionValue: number
  roas: number
  conversions: number
  conversionRate: number
  interactions: number
  cpc: number
  cpv: number
  cpm: number
  cpa: number
  completionRate: number
  watchTime: number
  frequency: number
  interactionRate: number
  bounceRate: number
}

interface KeywordData {
  keyword: string
  spend: number
  spendPercentage: number
  conversionValue: number
  conversions: number
  conversionRate: number
  ctr: number
  cpc: number
  cpa: number
}

interface AudienceData {
  name: string
  keywords: string
  spend: number
  spendPercentage: number
  conversionValue: number
  conversions: number
  conversionRate: number
  ctr: number
  cpc: number
  cpa: number
}

interface ImageMaterialData {
  id: string
  imageUrl: string
  adLink: string
  impressions: number
  clicks: number
  ctr: number
  cpc: number
  conversions: number
  conversionRate: number
  cost: number
  revenue: number
  roi: number
}

interface VideoMaterialData {
  id: string
  thumbnail: string
  videoLink: string
  duration: number
  impressions: number
  clicks: number
  ctr: number
  viewRate: number
  views: number
  conversions: number
}

// 响应式数据
const selectedAccount = ref('all')
const selectedTimeRange = ref('today')
const customStartDate = ref('')
const customEndDate = ref('')

const timeOptions = ref([
  { value: 'today', label: '今日' },
  { value: 'yesterday', label: '昨日' },
  { value: 'last14days', label: '近14天' },
  { value: 'last1month', label: '近1个月' },
  { value: 'last3months', label: '近3个月' },
  { value: 'last1year', label: '近1年' },
  { value: 'custom', label: '自定义时间' }
])
const alerts = ref<Alert[]>([
  {
    id: '1',
    type: 'error',
    title: '成效下滑，转化价值或ROAS下降>30%',
    message: '【预警】建议检查素材、落地页或投放设置，必要时调整投放时间段',
    value: 'ROAS下降35%'
  },
  {
    id: '2',
    type: 'warning',
    title: 'CPC/CPA快速上升',
    message: '【关注成本】出价竞争加剧，建议查看关键词或素材效率',
    value: 'CPC上升42%'
  },
  {
    id: '3',
    type: 'info',
    title: '成效提升，花费稳定或小幅增长',
    message: '【保持现状】效果良好，可适当增加预算或测试更多素材',
    value: '花费增长8%'
  },
  {
    id: '4',
    type: 'warning',
    title: '花费骤降（减少超30%）或广告拒登',
    message: '【异常下滑】可能暂停或预算限制，请检查账户投放状态',
    value: '花费下降45%'
  }
])

const accounts = ref<Account[]>([
  {
    id: '1',
    name: '主要广告账户',
    status: 'active',
    balance: '$15,420',
    statusText: '正常'
  },
  {
    id: '2',
    name: '品牌推广账户',
    status: 'active',
    balance: '$8,350',
    statusText: '正常'
  },
  {
    id: '3',
    name: '测试账户',
    status: 'limited',
    balance: '$1,200',
    statusText: '受限'
  }
])

const weeklyData = ref<WeeklyData>({
  spend: 12450,
  spendChange: 8.5,
  conversionValue: 48200,
  conversionValueChange: 12.3,
  roi: 3.87,
  roiChange: 5.2,
  conversionRate: 3.2,
  conversionRateChange: -1.5,
  dailyAverage: 1778,
  dailyAverageChange: 8.5,
  clicks: 8542,
  clicksChange: -2.1
})

const weeklyDataNoLeads = ref<WeeklyData>({
  spend: 11200,
  spendChange: 6.8,
  conversionValue: 42800,
  conversionValueChange: 10.1,
  roi: 3.82,
  roiChange: 3.1,
  conversionRate: 2.8,
  conversionRateChange: -2.1,
  dailyAverage: 1600,
  dailyAverageChange: 6.8,
  clicks: 7890,
  clicksChange: -1.8,
  cpc: 1.42,
  cpcChange: 5.2
})

const dailyData = ref<DailyDataRow[]>([
  {
    date: '2024-01-15',
    spend: 1850,
    conversionValue: 7200,
    roi: 3.89,
    orders: 24,
    orderConversionRate: 3.1,
    orderConversionCost: 77.08,
    aov: 300,
    cpc: 1.45,
    ctr: 2.8,
    cpv: 0.12,
    addToCarts: 156,
    addToCartCost: 11.86,
    addToCartRate: 12.5,
    clicks: 1276,
    views: 8420,
    impressions: 45600,
    users: 3850
  },
  {
    date: '2024-01-14',
    spend: 1720,
    conversionValue: 6800,
    roi: 3.95,
    orders: 22,
    orderConversionRate: 3.3,
    orderConversionCost: 78.18,
    aov: 309,
    cpc: 1.38,
    ctr: 2.9,
    cpv: 0.11,
    addToCarts: 142,
    addToCartCost: 12.11,
    addToCartRate: 13.1,
    clicks: 1246,
    views: 7950,
    impressions: 43200,
    users: 3650
  },
  // 添加更多日期数据...
])

const adFormsData = ref<AdFormData[]>([
  {
    type: '品牌广告',
    spend: 5200,
    conversionValue: 18500,
    roi: 3.56,
    orders: 62,
    orderConversionRate: 3.8,
    orderConversionCost: 83.87,
    aov: 298,
    cpc: 1.32,
    ctr: 3.2,
    cpa: 42.26,
    cpv: 0.08,
    addToCarts: 245,
    addToCartCost: 21.22,
    addToCartRate: 15.1,
    clicks: 3939,
    views: 12580,
    impressions: 123000,
    users: 9850,
    trafficConversions: 156
  },
  {
    type: '转化广告',
    spend: 7250,
    conversionValue: 29700,
    roi: 4.10,
    orders: 98,
    orderConversionRate: 2.9,
    orderConversionCost: 73.98,
    aov: 303,
    cpc: 1.48,
    ctr: 2.7,
    cpa: 38.65,
    cpv: 0.12,
    addToCarts: 387,
    addToCartCost: 18.73,
    addToCartRate: 11.4,
    clicks: 4898,
    views: 18420,
    impressions: 181200,
    users: 14200,
    trafficConversions: 223
  }
])

const adTypesData = ref<AdTypeData[]>([
  {
    type: '品牌词搜索广告',
    spend: 3200,
    conversionValue: 12800,
    roi: 4.0,
    orders: 42,
    orderConversionRate: 4.2,
    orderConversionCost: 76.19,
    aov: 305,
    cpc: 1.25,
    ctr: 3.8,
    cpa: 32.0,
    cpv: 0.0,
    addToCarts: 168,
    addToCartCost: 19.05,
    addToCartRate: 16.8,
    clicks: 2560,
    views: 0,
    impressions: 67368,
    users: 6200
  },
  {
    type: '除品牌词外的搜索广告',
    spend: 4800,
    conversionValue: 16800,
    roi: 3.5,
    orders: 56,
    orderConversionRate: 2.8,
    orderConversionCost: 85.71,
    aov: 300,
    cpc: 1.60,
    ctr: 2.5,
    cpa: 48.0,
    cpv: 0.0,
    addToCarts: 224,
    addToCartCost: 21.43,
    addToCartRate: 11.2,
    clicks: 3000,
    views: 0,
    impressions: 120000,
    users: 8500
  },
  {
    type: 'Shopping（手工feed）',
    spend: 2200,
    conversionValue: 8800,
    roi: 4.0,
    orders: 29,
    orderConversionRate: 3.6,
    orderConversionCost: 75.86,
    aov: 303,
    cpc: 1.38,
    ctr: 3.2,
    cpa: 27.5,
    cpv: 0.0,
    addToCarts: 115,
    addToCartCost: 19.13,
    addToCartRate: 14.4,
    clicks: 1594,
    views: 0,
    impressions: 49813,
    users: 4200
  },
  {
    type: 'Pmax广告',
    spend: 1800,
    conversionValue: 7200,
    roi: 4.0,
    orders: 24,
    orderConversionRate: 3.0,
    orderConversionCost: 75.0,
    aov: 300,
    cpc: 1.50,
    ctr: 2.4,
    cpa: 45.0,
    cpv: 0.0,
    addToCarts: 96,
    addToCartCost: 18.75,
    addToCartRate: 12.0,
    clicks: 1200,
    views: 0,
    impressions: 50000,
    users: 3800
  },
  {
    type: 'Video',
    spend: 450,
    conversionValue: 1350,
    roi: 3.0,
    orders: 5,
    orderConversionRate: 1.25,
    orderConversionCost: 90.0,
    aov: 270,
    cpc: 0.75,
    ctr: 4.0,
    cpa: 90.0,
    cpv: 0.05,
    addToCarts: 36,
    addToCartCost: 12.5,
    addToCartRate: 9.0,
    clicks: 600,
    views: 9000,
    impressions: 15000,
    users: 1200
  },
  {
    type: 'Demand Gen广告',
    spend: 1000,
    conversionValue: 3500,
    roi: 3.5,
    orders: 12,
    orderConversionRate: 2.4,
    orderConversionCost: 83.33,
    aov: 292,
    cpc: 1.0,
    ctr: 2.0,
    cpa: 41.67,
    cpv: 0.1,
    addToCarts: 60,
    addToCartCost: 16.67,
    addToCartRate: 12.0,
    clicks: 1000,
    views: 10000,
    impressions: 50000,
    users: 2800
  }
])

const campaignsData = ref<CampaignData[]>([
  {
    name: '品牌核心关键词',
    spend: 1800,
    conversionValue: 7200,
    roi: 4.0,
    orders: 24,
    orderConversionRate: 4.8,
    orderConversionCost: 75.0,
    aov: 300,
    cpc: 1.20,
    ctr: 4.0,
    clicks: 1500,
    impressions: 37500,
    users: 3200
  },
  {
    name: '产品关键词-核心',
    spend: 2400,
    conversionValue: 8400,
    roi: 3.5,
    orders: 28,
    orderConversionRate: 2.8,
    orderConversionCost: 85.71,
    aov: 300,
    cpc: 1.60,
    ctr: 2.5,
    clicks: 1500,
    impressions: 60000,
    users: 4200
  },
  {
    name: 'Shopping-主要产品',
    spend: 1600,
    conversionValue: 6400,
    roi: 4.0,
    orders: 21,
    orderConversionRate: 3.5,
    orderConversionCost: 76.19,
    aov: 305,
    cpc: 1.33,
    ctr: 3.0,
    clicks: 1200,
    impressions: 40000,
    users: 3500
  },
  {
    name: 'Pmax-全产品',
    spend: 1200,
    conversionValue: 4800,
    roi: 4.0,
    orders: 16,
    orderConversionRate: 3.2,
    orderConversionCost: 75.0,
    aov: 300,
    cpc: 1.50,
    ctr: 2.4,
    clicks: 800,
    impressions: 33333,
    users: 2800
  }
])

const videoDisplayData = ref<VideoDisplayData[]>([
  {
    name: 'YouTube品牌推广',
    spend: 800,
    conversionValue: 2400,
    roas: 3.0,
    conversions: 8,
    conversionRate: 1.6,
    interactions: 240,
    cpc: 0.80,
    cpv: 0.05,
    cpm: 8.0,
    cpa: 100.0,
    completionRate: 65,
    watchTime: 45,
    frequency: 2.1,
    interactionRate: 4.8,
    bounceRate: 35
  },
  {
    name: 'Display再营销',
    spend: 600,
    conversionValue: 1800,
    roas: 3.0,
    conversions: 6,
    conversionRate: 1.2,
    interactions: 180,
    cpc: 0.60,
    cpv: 0.0,
    cpm: 6.0,
    cpa: 100.0,
    completionRate: 0,
    watchTime: 0,
    frequency: 3.2,
    interactionRate: 3.6,
    bounceRate: 45
  },
  {
    name: 'Demand Gen视频',
    spend: 400,
    conversionValue: 1200,
    roas: 3.0,
    conversions: 4,
    conversionRate: 2.0,
    interactions: 120,
    cpc: 0.67,
    cpv: 0.08,
    cpm: 5.33,
    cpa: 100.0,
    completionRate: 72,
    watchTime: 38,
    frequency: 1.8,
    interactionRate: 6.0,
    bounceRate: 28
  }
])

const keywordsData = ref<KeywordData[]>([
  {
    keyword: '品牌名称',
    spend: 1200,
    spendPercentage: 15.2,
    conversionValue: 4800,
    conversions: 16,
    conversionRate: 4.0,
    ctr: 8.5,
    cpc: 1.20,
    cpa: 75.0
  },
  {
    keyword: '产品类别 + 关键词',
    spend: 1800,
    spendPercentage: 22.8,
    conversionValue: 6300,
    conversions: 21,
    conversionRate: 2.8,
    ctr: 3.2,
    cpc: 1.60,
    cpa: 85.71
  },
  {
    keyword: '竞品对比词',
    spend: 900,
    spendPercentage: 11.4,
    conversionValue: 2700,
    conversions: 9,
    conversionRate: 2.25,
    ctr: 2.8,
    cpc: 1.50,
    cpa: 100.0
  },
  {
    keyword: '长尾关键词',
    spend: 600,
    spendPercentage: 7.6,
    conversionValue: 2100,
    conversions: 7,
    conversionRate: 3.5,
    ctr: 4.2,
    cpc: 1.0,
    cpa: 85.71
  }
])

const audienceData = ref<AudienceData[]>([
  {
    name: '购买意向用户',
    keywords: '产品相关词',
    spend: 2400,
    spendPercentage: 30.4,
    conversionValue: 8400,
    conversions: 28,
    conversionRate: 3.5,
    ctr: 3.2,
    cpc: 1.50,
    cpa: 85.71
  },
  {
    name: '品牌关注用户',
    keywords: '品牌词',
    spend: 1800,
    spendPercentage: 22.8,
    conversionValue: 7200,
    conversions: 24,
    conversionRate: 4.0,
    ctr: 4.5,
    cpc: 1.25,
    cpa: 75.0
  },
  {
    name: '竞品用户',
    keywords: '竞品词',
    spend: 1200,
    spendPercentage: 15.2,
    conversionValue: 3600,
    conversions: 12,
    conversionRate: 2.0,
    ctr: 2.5,
    cpc: 1.67,
    cpa: 100.0
  },
  {
    name: '行业兴趣用户',
    keywords: '行业词',
    spend: 900,
    spendPercentage: 11.4,
    conversionValue: 2700,
    conversions: 9,
    conversionRate: 2.25,
    ctr: 2.8,
    cpc: 1.43,
    cpa: 100.0
  }
])

const imageMaterialsData = ref<ImageMaterialData[]>([
  {
    id: 'IMG_001',
    imageUrl: 'https://picsum.photos/100/80?random=1',
    adLink: '#',
    impressions: 45000,
    clicks: 1350,
    ctr: 3.0,
    cpc: 1.33,
    conversions: 18,
    conversionRate: 1.33,
    cost: 1800,
    revenue: 5400,
    roi: 3.0
  },
  {
    id: 'IMG_002',
    imageUrl: 'https://picsum.photos/100/80?random=2',
    adLink: '#',
    impressions: 38000,
    clicks: 1140,
    ctr: 3.0,
    cpc: 1.32,
    conversions: 15,
    conversionRate: 1.32,
    cost: 1500,
    revenue: 4500,
    roi: 3.0
  },
  {
    id: 'IMG_003',
    imageUrl: 'https://picsum.photos/100/80?random=3',
    adLink: '#',
    impressions: 32000,
    clicks: 960,
    ctr: 3.0,
    cpc: 1.25,
    conversions: 12,
    conversionRate: 1.25,
    cost: 1200,
    revenue: 3600,
    roi: 3.0
  }
])

const videoMaterialsData = ref<VideoMaterialData[]>([
  {
    id: 'VID_001',
    thumbnail: 'https://picsum.photos/100/80?random=4',
    videoLink: '#',
    duration: 30,
    impressions: 25000,
    clicks: 500,
    ctr: 2.0,
    viewRate: 65,
    views: 16250,
    conversions: 8
  },
  {
    id: 'VID_002',
    thumbnail: 'https://picsum.photos/100/80?random=5',
    videoLink: '#',
    duration: 45,
    impressions: 20000,
    clicks: 400,
    ctr: 2.0,
    viewRate: 72,
    views: 14400,
    conversions: 6
  },
  {
    id: 'VID_003',
    thumbnail: 'https://picsum.photos/100/80?random=6',
    videoLink: '#',
    duration: 60,
    impressions: 18000,
    clicks: 360,
    ctr: 2.0,
    viewRate: 68,
    views: 12240,
    conversions: 5
  }
])

// 计算属性
const selectedAccountInfo = computed(() => {
  return accounts.value.find(account => account.id === selectedAccount.value)
})

const trendChartData = computed(() => ({
  labels: ['1/10', '1/11', '1/12', '1/13', '1/14', '1/15', '1/16'],
  datasets: [
    {
      label: '收入',
      data: [6800, 7200, 6900, 7500, 6800, 7200, 7400],
      color: '#3b82f6'
    },
    {
      label: '花费',
      data: [1720, 1850, 1780, 1920, 1720, 1850, 1900],
      color: '#ef4444'
    },
    {
      label: '客单价',
      data: [309, 300, 315, 298, 309, 300, 296],
      color: '#10b981'
    }
  ]
}))

const roasTrendData = computed(() => ({
  labels: ['1/10', '1/11', '1/12', '1/13', '1/14', '1/15', '1/16'],
  datasets: [
    {
      label: '销量',
      data: [22, 24, 22, 25, 22, 24, 25],
      color: '#8b5cf6'
    },
    {
      label: 'ROAS',
      data: [3.95, 3.89, 3.88, 3.91, 3.95, 3.89, 3.89],
      color: '#f59e0b'
    }
  ]
}))

const costDistributionData = computed(() =>
  adTypesData.value.map((item, index) => ({
    name: item.type,
    value: item.spend,
    color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index]
  }))
)

const revenueDistributionData = computed(() =>
  adTypesData.value.map((item, index) => ({
    name: item.type,
    value: item.conversionValue,
    color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index]
  }))
)

const adFormsCostDistributionData = computed(() =>
  adFormsData.value.map((item, index) => ({
    name: item.type,
    value: item.spend,
    color: ['#3b82f6', '#ef4444'][index]
  }))
)

const adFormsRevenueDistributionData = computed(() =>
  adFormsData.value.map((item, index) => ({
    name: item.type,
    value: item.conversionValue,
    color: ['#3b82f6', '#ef4444'][index]
  }))
)

const adTypesCostDistributionData = computed(() =>
  adTypesData.value.map((item, index) => ({
    name: item.type,
    value: item.spend,
    color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index]
  }))
)

const adTypesRevenueDistributionData = computed(() =>
  adTypesData.value.map((item, index) => ({
    name: item.type,
    value: item.conversionValue,
    color: ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'][index]
  }))
)

// 方法
const getAlertIcon = (type: string) => {
  switch (type) {
    case 'error': return AlertCircle
    case 'warning': return AlertTriangle
    case 'info': return TrendingUp
    default: return AlertTriangle
  }
}

const handleAlertAction = (alert: Alert) => {
  console.log('处理提醒:', alert)
  // 这里可以添加具体的处理逻辑
}

const handleAccountChange = () => {
  console.log('账户切换:', selectedAccount.value)
  // 这里可以添加账户切换的逻辑
}

// 时间筛选处理方法
const selectTimeRange = (value: string) => {
  selectedTimeRange.value = value
  console.log('时间范围变更:', selectedTimeRange.value)
  loadGoogleDashboardData()
}

const handleTimeRangeChange = () => {
  console.log('时间范围变更:', selectedTimeRange.value)
  loadGoogleDashboardData()
}

const handleCustomDateChange = () => {
  if (customStartDate.value && customEndDate.value) {
    console.log('自定义时间范围:', customStartDate.value, '至', customEndDate.value)
    loadGoogleDashboardData()
  }
}

const loadGoogleDashboardData = () => {
  // 根据选择的时间范围重新加载数据
  console.log('根据时间范围重新加载Google广告数据...')
  // 实际项目中这里会调用API获取对应时间范围的数据
}

const exportDailyData = () => {
  console.log('导出日投放数据')
  // 这里可以添加导出逻辑
}

const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat().format(value)
}

// 生命周期
onMounted(() => {
  // 默认选择第一个账户
  if (accounts.value.length > 0) {
    selectedAccount.value = accounts.value[0].id
  }
})
</script>

<style scoped>
.google-dashboard-panel {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
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
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.section-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.subsection-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 16px 0;
}

/* 数据提醒样式 */
.alert-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e5e5e5;
}

.alert-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.alert-card {
  display: flex;
  align-items: center;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
}

.alert-card--error {
  background: #fef2f2;
  border-left-color: #ef4444;
}

.alert-card--warning {
  background: #fffbeb;
  border-left-color: #f59e0b;
}

.alert-card--info {
  background: #eff6ff;
  border-left-color: #3b82f6;
}

.alert-icon {
  margin-right: 12px;
}

.alert-card--error .alert-icon {
  color: #ef4444;
}

.alert-card--warning .alert-icon {
  color: #f59e0b;
}

.alert-card--info .alert-icon {
  color: #3b82f6;
}

.alert-content {
  flex: 1;
}

.alert-title {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.alert-message {
  font-size: 14px;
  color: #666;
  margin-bottom: 4px;
}

.alert-value {
  font-size: 12px;
  font-weight: 500;
  color: #999;
}

.alert-action {
  padding: 6px 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 12px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.alert-action:hover {
  background: #e5e7eb;
}

/* 账号选择样式 */
.account-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e5e5e5;
}

.account-selector {
  display: flex;
  align-items: center;
  gap: 24px;
}

.account-dropdown select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  min-width: 200px;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge--active {
  background: #dcfce7;
  color: #166534;
}

.status-badge--limited {
  background: #fef3c7;
  color: #92400e;
}

.status-badge--suspended {
  background: #fee2e2;
  color: #991b1b;
}

.account-balance {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

/* 总览样式 */
.overview-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e5e5e5;
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
  margin-bottom: 24px;
}

.metric-card {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #e9ecef;
}

.metric-label {
  font-size: 12px;
  color: #666;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.metric-change {
  font-size: 12px;
  font-weight: 500;
}

.metric-change.positive {
  color: #10b981;
}

.metric-change.negative {
  color: #ef4444;
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
  margin: 0 0 20px 0;
  text-align: center;
  padding-bottom: 12px;
  border-bottom: 2px solid #f3f4f6;
  flex-shrink: 0;
}

.chart-content {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.chart-legend {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #f3f4f6;
}

.legend-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  padding: 4px 0;
}

.legend-item:last-child {
  margin-bottom: 0;
}

.legend-color {
  width: 12px;
  height: 12px;
  border-radius: 3px;
  margin-right: 8px;
  flex-shrink: 0;
}

.legend-text {
  flex: 1;
  font-size: 14px;
  color: #374151;
  margin-right: 8px;
}

.legend-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

/* 日投放数据样式 */
.daily-data-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e5e5e5;
}

.table-container {
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e5e5;
}

.table-header {
  padding: 16px;
  border-bottom: 1px solid #e5e5e5;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.table-controls {
  display: flex;
  gap: 8px;
}

.table-control-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #f3f4f6;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.table-control-btn:hover {
  background: #e5e7eb;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e5e5;
  font-size: 14px;
  white-space: nowrap;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #374151;
}

.data-table td {
  color: #1a1a1a;
}

.data-table tr:hover {
  background: #f8f9fa;
}

/* 广告形式和类型样式 */
.ad-forms-section,
.ad-types-section,
.campaigns-section,
.video-display-section,
.keywords-section,
.audience-section,
.materials-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  border: 1px solid #e5e5e5;
}

.charts-subsection {
  margin-top: 32px;
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
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  background: #f3f4f6;
}

.material-image:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.ad-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 14px;
  padding: 4px 8px;
  border-radius: 4px;
  transition: all 0.2s;
}

.ad-link:hover {
  background: #eff6ff;
  text-decoration: underline;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .google-dashboard-panel {
    padding: 16px;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .filters-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .account-info-section {
    margin-top: 16px;
  }

  .alert-cards {
    grid-template-columns: 1fr;
  }

  .ad-forms-section,
  .ad-types-section,
  .campaigns-section,
  .video-display-section,
  .keywords-section,
  .audience-section,
  .materials-section {
    padding: 16px;
  }
}

/* 筛选区域样式 */
.filters-section {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.selector-row {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 0;
}

/* 账户信息区域样式 */
.account-info-section {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 20px;
}

.info-card {
  display: flex;
  align-items: center;
  gap: 16px;
}

.time-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.time-buttons {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.time-btn {
  padding: 6px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  background: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.time-btn:hover {
  border-color: #3b82f6;
  background-color: #f8fafc;
}

.time-btn--active {
  background-color: #3b82f6;
  border-color: #3b82f6;
  color: white;
}

.time-btn--active:hover {
  background-color: #2563eb;
}

.custom-date-range {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: 12px;
}

.date-input {
  padding: 8px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
}

.date-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.date-separator {
  color: #6b7280;
  font-size: 14px;
}

@media (max-width: 768px) {
  .selector-row {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .time-selector {
    width: 100%;
  }

  .time-buttons {
    width: 100%;
    justify-content: flex-start;
  }

  .time-btn {
    flex: 0 0 auto;
    font-size: 13px;
    padding: 5px 10px;
  }

  .custom-date-range {
    margin-left: 0;
    width: 100%;
  }
}
</style>
