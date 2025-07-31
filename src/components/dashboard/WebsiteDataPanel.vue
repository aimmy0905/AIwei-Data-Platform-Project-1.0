<template>
        <div class="website-data-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3>网站数据</h3>
        <p>网站访问和用户行为数据分析</p>
      </div>
      <div class="header-actions">
        <!-- 时间筛选器 -->
        <div class="time-filter">
          <select v-model="selectedTimeRange" @change="handleTimeRangeChange" class="time-select">
            <option value="today">今日</option>
            <option value="yesterday">昨天</option>
            <option value="last7days">近7天</option>
            <option value="last14days">近14天</option>
            <option value="last1month">近1个月</option>
            <option value="last3months">近3个月</option>
            <option value="last1year">近1年</option>
            <option value="custom">自定义时间</option>
          </select>
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
        <button class="custom-dimension-btn" @click="showCustomDimension = true">
          <Settings :size="16" />
          自定义维度
        </button>
      </div>
    </div>

    <!-- 标签页导航 -->
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

    <!-- 标签页内容 -->
    <div class="tab-content">
      <!-- 结果指标 -->
      <div v-if="activeTab === 'results'" class="tab-panel">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <DollarSign :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">总销售额</div>
              <div class="metric-value">${{ formatNumber(data.totalSales) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.totalSales"
                  period="mom"
                  format="currency"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.totalSales"
                  period="qoq"
                  format="currency"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('sales')"
                      :key="index"
                      class="bar-item"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <CreditCard :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">总花费</div>
              <div class="metric-value">${{ formatNumber(data.totalCost) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.totalCost"
                  period="mom"
                  format="currency"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.totalCost"
                  period="qoq"
                  format="currency"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('cost')"
                      :key="index"
                      class="bar-item bar-item--warning"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in costTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (costTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-warning)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">ROI</div>
              <div class="metric-value">{{ data.roi.toFixed(1) }}x</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.roi"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.roi"
                  period="qoq"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('roi')"
                      :key="index"
                      class="bar-item bar-item--primary"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in roiTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (roiTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-primary)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Package :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">订单平均产品数</div>
              <div class="metric-value">{{ data.averageOrderItems.toFixed(1) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.averageOrderItems"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.averageOrderItems"
                  period="qoq"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('aoi')"
                      :key="index"
                      class="bar-item bar-item--info"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in aoiTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (aoiTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-info)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Target :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">订单转化成本</div>
              <div class="metric-value">${{ data.orderConversionCost.toFixed(2) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.orderConversionCost"
                  period="mom"
                  format="currency"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.orderConversionCost"
                  period="qoq"
                  format="currency"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('orderCost')"
                      :key="index"
                      class="bar-item bar-item--error"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in orderCostTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (orderCostTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-error)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <ShoppingCart :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">平均订单价值</div>
              <div class="metric-value">${{ data.averageOrderValue.toFixed(2) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.averageOrderValue"
                  period="mom"
                  format="currency"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.averageOrderValue"
                  period="qoq"
                  format="currency"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('avgOrderValue')"
                      :key="index"
                      class="bar-item bar-item--success"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in avgOrderValueTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (avgOrderValueTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-success)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Percent :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">转化率</div>
              <div class="metric-value">{{ data.conversionRate.toFixed(1) }}%</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.conversionRate"
                  period="mom"
                  format="percentage"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.conversionRate"
                  period="qoq"
                  format="percentage"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('conversion')"
                      :key="index"
                      class="bar-item bar-item--primary"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in conversionTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (conversionTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-primary)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Eye :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">商店访问次数</div>
              <div class="metric-value">{{ formatNumber(data.storeVisits) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.storeVisits"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.storeVisits"
                  period="qoq"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('storeVisits')"
                      :key="index"
                      class="bar-item bar-item--info"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in storeVisitsTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (storeVisitsTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-info)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Users :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">用户访问成本</div>
              <div class="metric-value">${{ data.userVisitCost.toFixed(2) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.userVisitCost"
                  period="mom"
                  format="currency"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.userVisitCost"
                  period="qoq"
                  format="currency"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('visitCost')"
                      :key="index"
                      class="bar-item bar-item--warning"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in visitCostTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (visitCostTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-warning)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      <!-- 订单指标 -->
      <div v-if="activeTab === 'orders'" class="tab-panel">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <ShoppingBag :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">订单量</div>
              <div class="metric-value">{{ formatNumber(data.orders) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.orders"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.orders"
                  period="qoq"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('orders')"
                      :key="index"
                      class="bar-item bar-item--success"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in ordersTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (ordersTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-success)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Package :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">每笔订单订购数量</div>
              <div class="metric-value">{{ data.orderItemsPerOrder.toFixed(1) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.orderItemsPerOrder"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.orderItemsPerOrder"
                  period="qoq"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('orderItems')"
                      :key="index"
                      class="bar-item bar-item--info"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in orderItemsTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (orderItemsTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-info)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <User :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">每位客户订单数</div>
              <div class="metric-value">{{ data.ordersPerCustomer.toFixed(1) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.ordersPerCustomer"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.ordersPerCustomer"
                  period="qoq"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('ordersPerCustomer')"
                      :key="index"
                      class="bar-item bar-item--primary"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in ordersPerCustomerTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (ordersPerCustomerTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-primary)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <RefreshCw :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">订单数(回头客)</div>
              <div class="metric-value">{{ formatNumber(data.returningCustomerOrders) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.returningCustomerOrders"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.returningCustomerOrders"
                  period="qoq"
                  show-period-label
                />
              </div>
              <div class="metric-detail">占比: {{ ((data.returningCustomerOrders / data.orders) * 100).toFixed(1) }}%</div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('returningOrders')"
                      :key="index"
                      class="bar-item bar-item--warning"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in returningOrdersTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (returningOrdersTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-warning)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <UserPlus :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">订单数(新客户)</div>
              <div class="metric-value">{{ formatNumber(data.newCustomerOrders) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.newCustomerOrders"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.newCustomerOrders"
                  period="qoq"
                  show-period-label
                />
              </div>
              <div class="metric-detail">占比: {{ ((data.newCustomerOrders / data.orders) * 100).toFixed(1) }}%</div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('newCustomerOrders')"
                      :key="index"
                      class="bar-item bar-item--success"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in newCustomerOrdersTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (newCustomerOrdersTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-success)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单分布图表 -->
        <div class="chart-section">
          <h4>订单分布</h4>
          <div class="chart-container">
            <div class="distribution-chart">
              <div class="chart-item">
                <div class="chart-bar">
                  <div
                    class="chart-fill chart-fill--returning"
                    :style="{ width: (data.returningCustomerOrders / data.orders) * 100 + '%' }"
                  ></div>
                </div>
                <div class="chart-label">回头客订单</div>
                <div class="chart-value">{{ formatNumber(data.returningCustomerOrders) }}</div>
              </div>
              <div class="chart-item">
                <div class="chart-bar">
                  <div
                    class="chart-fill chart-fill--new"
                    :style="{ width: (data.newCustomerOrders / data.orders) * 100 + '%' }"
                  ></div>
                </div>
                <div class="chart-label">新客户订单</div>
                <div class="chart-value">{{ formatNumber(data.newCustomerOrders) }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户指标 -->
      <div v-if="activeTab === 'users'" class="tab-panel">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <Users :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">在线商店访客数</div>
              <div class="metric-value">{{ formatNumber(data.visitors) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.visitors"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.visitors"
                  period="qoq"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('visitors')"
                      :key="index"
                      class="bar-item bar-item--primary"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in visitorsTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (visitorsTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-primary)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Eye :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">访问</div>
              <div class="metric-value">{{ formatNumber(data.visits) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.visits"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.visits"
                  period="qoq"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('visits')"
                      :key="index"
                      class="bar-item bar-item--info"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in visitsTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (visitsTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-info)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <UserPlus :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">新用户</div>
              <div class="metric-value">{{ formatNumber(data.newUsers) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.newUsers"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.newUsers"
                  period="qoq"
                  show-period-label
                />
              </div>
              <div class="metric-detail">占比: {{ ((data.newUsers / data.visitors) * 100).toFixed(1) }}%</div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('newUsers')"
                      :key="index"
                      class="bar-item bar-item--success"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in newUsersTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (newUsersTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-success)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <RefreshCw :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">回访用户</div>
              <div class="metric-value">{{ formatNumber(data.returningUsers) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.returningUsers"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.returningUsers"
                  period="qoq"
                  show-period-label
                />
              </div>
              <div class="metric-detail">占比: {{ ((data.returningUsers / data.visitors) * 100).toFixed(1) }}%</div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('returningUsers')"
                      :key="index"
                      class="bar-item bar-item--warning"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in returningUsersTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (returningUsersTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-warning)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <ShoppingCart :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">加购访问次数</div>
              <div class="metric-value">{{ formatNumber(data.addToCartVisits) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.addToCartVisits"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.addToCartVisits"
                  period="qoq"
                  show-period-label
                />
              </div>
              <div class="metric-detail">占比: {{ ((data.addToCartVisits / data.visits) * 100).toFixed(1) }}%</div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('addToCart')"
                      :key="index"
                      class="bar-item bar-item--success"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in addToCartTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (addToCartTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-success)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <CreditCard :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">到达结账页面访问</div>
              <div class="metric-value">{{ formatNumber(data.reachCheckoutVisits) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.reachCheckoutVisits"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.reachCheckoutVisits"
                  period="qoq"
                  show-period-label
                />
              </div>
              <div class="metric-detail">占比: {{ ((data.reachCheckoutVisits / data.visits) * 100).toFixed(1) }}%</div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('checkout')"
                      :key="index"
                      class="bar-item bar-item--primary"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in checkoutTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (checkoutTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-primary)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Check :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">完成结账访问</div>
              <div class="metric-value">{{ formatNumber(data.completedCheckoutVisits) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.completedCheckoutVisits"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.completedCheckoutVisits"
                  period="qoq"
                  show-period-label
                />
              </div>
              <div class="metric-detail">占比: {{ ((data.completedCheckoutVisits / data.visits) * 100).toFixed(1) }}%</div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('completedCheckout')"
                      :key="index"
                      class="bar-item bar-item--success"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in completedCheckoutTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (completedCheckoutTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-success)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Clock :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">平均访问持续时间</div>
              <div class="metric-value">{{ formatDuration(data.averageVisitDuration) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.averageVisitDuration"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.averageVisitDuration"
                  period="qoq"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('visitDuration')"
                      :key="index"
                      class="bar-item bar-item--info"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in visitDurationTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (visitDurationTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-info)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <LogOut :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">跳出量</div>
              <div class="metric-value">{{ formatNumber(data.bounceCount) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.bounceCount"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.bounceCount"
                  period="qoq"
                  show-period-label
                />
              </div>
              <div class="metric-detail">跳出率: {{ data.bounceRate.toFixed(1) }}%</div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('bounce')"
                      :key="index"
                      class="bar-item bar-item--error"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in bounceTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (bounceTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-error)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 用户漏斗 -->
      <div v-if="activeTab === 'funnel'" class="tab-panel">


        <div class="conversion-metrics">
          <div class="metric-card">
            <div class="metric-icon">
              <ShoppingCart :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">加购率</div>
              <div class="metric-value">{{ data.addToCartRate.toFixed(1) }}%</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.addToCartRate"
                  period="mom"
                  format="percentage"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.addToCartRate"
                  period="qoq"
                  format="percentage"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('addToCartRate')"
                      :key="index"
                      class="bar-item bar-item--success"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in addToCartRateTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (addToCartRateTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-success)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Check :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">完成结账率</div>
              <div class="metric-value">{{ data.checkoutCompletionRate.toFixed(1) }}%</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.checkoutCompletionRate"
                  period="mom"
                  format="percentage"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.checkoutCompletionRate"
                  period="qoq"
                  format="percentage"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('checkoutCompletionRate')"
                      :key="index"
                      class="bar-item bar-item--info"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in checkoutCompletionRateTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (checkoutCompletionRateTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-info)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <CreditCard :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">结账转化率</div>
              <div class="metric-value">{{ data.checkoutConversionRate.toFixed(1) }}%</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.checkoutConversionRate"
                  period="mom"
                  format="percentage"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.checkoutConversionRate"
                  period="qoq"
                  format="percentage"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('checkoutConversionRate')"
                      :key="index"
                      class="bar-item bar-item--warning"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in checkoutConversionRateTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (checkoutConversionRateTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-warning)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Target :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">总转化率</div>
              <div class="metric-value">{{ data.conversionRate.toFixed(1) }}%</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.conversionRate"
                  period="mom"
                  format="percentage"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.conversionRate"
                  period="qoq"
                  format="percentage"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('conversionRate')"
                      :key="index"
                      class="bar-item bar-item--primary"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in conversionRateTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (conversionRateTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-primary)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 退货指标 -->
      <div v-if="activeTab === 'returns'" class="tab-panel">
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-icon">
              <RotateCcw :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">退货数</div>
              <div class="metric-value">{{ formatNumber(data.returns) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.returns"
                  period="mom"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.returns"
                  period="qoq"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('returns')"
                      :key="index"
                      class="bar-item bar-item--error"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in returnsTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (returnsTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-danger)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <DollarSign :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">退货金额</div>
              <div class="metric-value">${{ formatNumber(data.returnAmount) }}</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.returnAmount"
                  period="mom"
                  format="currency"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.returnAmount"
                  period="qoq"
                  format="currency"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('returnAmount')"
                      :key="index"
                      class="bar-item bar-item--warning"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in returnAmountTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (returnAmountTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-warning)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <Percent :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">退货数量比例</div>
              <div class="metric-value">{{ data.returnRate.toFixed(1) }}%</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.returnRate"
                  period="mom"
                  format="percentage"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.returnRate"
                  period="qoq"
                  format="percentage"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('returnRate')"
                      :key="index"
                      class="bar-item bar-item--error"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in returnRateTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (returnRateTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-danger)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="metric-card">
            <div class="metric-icon">
              <TrendingDown :size="24" />
            </div>
            <div class="metric-content">
              <div class="metric-label">退货销售额占比</div>
              <div class="metric-value">{{ data.returnSalesRatio.toFixed(1) }}%</div>
              <div class="dual-comparison">
                <ComparisonIndicator
                  :comparison="momComparisonData.returnSalesRatio"
                  period="mom"
                  format="percentage"
                  show-period-label
                />
                <ComparisonIndicator
                  :comparison="qoqComparisonData.returnSalesRatio"
                  period="qoq"
                  format="percentage"
                  show-period-label
                />
              </div>
              <!-- 趋势图 -->
              <div class="mini-trend-chart">
                <div class="mini-trend-label">{{ getTrendLabel() }}</div>
                <div class="mini-trend-container">
                  <!-- 柱状图（近1个月、近3个月、近1年） -->
                  <div v-if="shouldShowBarChart()" class="bar-chart">
                    <div
                      v-for="(value, index) in getBarChartData('returnSalesRatio')"
                      :key="index"
                      class="bar-item bar-item--warning"
                      :style="{ height: value.percentage + '%' }"
                    >
                      <div class="bar-value">{{ value.label }}</div>
                    </div>
                  </div>
                  <!-- 折线图（其他时间范围） -->
                  <div v-else class="mini-trend-line">
                    <div
                      v-for="(point, index) in returnSalesRatioTrendData"
                      :key="index"
                      class="mini-trend-point"
                      :style="{
                        left: (index / (returnSalesRatioTrendData.length - 1)) * 100 + '%',
                        bottom: point + '%',
                        background: 'var(--color-warning)'
                      }"
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>


    </div>

    <!-- 模块小结 -->
    <ModuleSummary
      :default-text="websiteSummaryText"
      placeholder="请输入网站数据情况小结..."
      :stats="websiteSummaryStats"
    />

    <!-- 自定义维度模态框 -->
    <CustomDimensionModal
      :visible="showCustomDimension"
      :data="data"
      @close="showCustomDimension = false"
      @export="handleExportCustomData"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  DollarSign,
  CreditCard,
  TrendingUp,
  TrendingDown,
  Package,
  Target,
  ShoppingCart,
  Percent,
  Eye,
  Users,
  ShoppingBag,
  User,
  RefreshCw,
  UserPlus,
  Check,
  Clock,
  LogOut,
  Edit,
  RotateCcw,
  Calendar,
  CheckCircle,
  XCircle,
  BarChart3,
  Activity,
  ArrowLeft,
  Settings
} from 'lucide-vue-next'
import CustomDimensionModal from './CustomDimensionModal.vue'
import ComparisonIndicator from './ComparisonIndicator.vue'
import ModuleSummary from '@/components/common/ModuleSummary.vue'
import { getWebsiteDataComparison } from '@/mock/dashboard'
import type { WebsiteData, ComparisonPeriod } from '@/types'

interface Props {
  data: WebsiteData
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// 响应式数据
const activeTab = ref('results')
const showCustomDimension = ref(false)
const selectedPeriod = ref<ComparisonPeriod>('mom')
const selectedTimeRange = ref('last7days')
const customStartDate = ref('')
const customEndDate = ref('')

// 模块小结相关状态
const isEditingMode = ref(false)
const summaryText = ref('网站数据表现良好，总销售额达到$1.3M，环比增长2.8%。ROI表现稳定在4.4x，用户活跃度持续提升。建议继续优化转化率，关注新用户获取成本。')
const editingSummaryText = ref('')

// 趋势数据 - 模拟数据，实际应该从API获取
const salesTrendData = ref([20, 35, 45, 55, 65, 70, 80])
const roiTrendData = ref([30, 40, 35, 50, 60, 65, 75])
const conversionTrendData = ref([25, 30, 40, 45, 50, 55, 60])
const costTrendData = ref([40, 45, 50, 45, 55, 60, 65])
const aoiTrendData = ref([35, 40, 38, 42, 45, 48, 50])
const orderCostTrendData = ref([60, 55, 58, 52, 50, 48, 45])
const avgOrderValueTrendData = ref([30, 35, 40, 45, 50, 55, 60])
const storeVisitsTrendData = ref([25, 35, 45, 40, 50, 60, 70])
const visitCostTrendData = ref([45, 50, 48, 52, 55, 53, 50])

// 用户指标趋势数据
const visitorsTrendData = ref([30, 40, 50, 45, 55, 65, 75])
const visitsTrendData = ref([25, 35, 45, 50, 60, 70, 80])
const newUsersTrendData = ref([35, 45, 40, 50, 55, 60, 65])
const returningUsersTrendData = ref([40, 50, 45, 55, 60, 65, 70])
const addToCartTrendData = ref([20, 25, 30, 35, 40, 45, 50])
const checkoutTrendData = ref([15, 20, 25, 30, 35, 40, 45])
const completedCheckoutTrendData = ref([10, 15, 20, 25, 30, 35, 40])
const visitDurationTrendData = ref([45, 50, 55, 60, 65, 70, 75])
const bounceTrendData = ref([60, 55, 50, 45, 40, 35, 30])

// 订单指标趋势数据
const ordersTrendData = ref([30, 35, 40, 45, 50, 55, 60])
const orderItemsTrendData = ref([40, 45, 42, 48, 50, 52, 55])
const ordersPerCustomerTrendData = ref([35, 40, 38, 42, 45, 48, 50])
const returningOrdersTrendData = ref([25, 30, 35, 40, 45, 50, 55])
const newCustomerOrdersTrendData = ref([45, 50, 55, 60, 65, 70, 75])

// 转化率指标趋势数据
const addToCartRateTrendData = ref([10, 12, 15, 18, 20, 22, 25])
const checkoutCompletionRateTrendData = ref([35, 40, 45, 50, 55, 60, 65])
const checkoutConversionRateTrendData = ref([40, 45, 50, 55, 60, 65, 70])
const conversionRateTrendData = ref([25, 30, 35, 40, 45, 50, 55])

// 退货指标趋势数据
const returnsTrendData = ref([20, 18, 22, 25, 23, 27, 30])
const returnAmountTrendData = ref([25, 30, 28, 32, 35, 38, 40])
const returnRateTrendData = ref([15, 18, 20, 22, 25, 28, 30])
const returnSalesRatioTrendData = ref([12, 15, 18, 20, 22, 25, 28])

// 库存指标趋势数据


// 计算比较数据
const comparisonData = computed(() => {
  return getWebsiteDataComparison(selectedPeriod.value)
})

// 计算环比数据
const momComparisonData = computed(() => {
  return getWebsiteDataComparison('mom')
})

// 计算同比数据
const qoqComparisonData = computed(() => {
  return getWebsiteDataComparison('qoq')
})

// 小结相关计算属性
const websiteStats = computed(() => {
  const data = comparisonData.value
  return {
    totalSales: 1300000, // $1.3M
    roi: 4.4
  }
})

const dataStatusClass = computed(() => {
  // 简化状态判断，基于固定数据
  const salesGrowth = 2.8 // 从模板中的数据
  const roiGrowth = 8.1 // 从模板中的数据

  const avgGrowth = (salesGrowth + roiGrowth) / 2
  if (avgGrowth >= 5) return 'status-excellent'
  if (avgGrowth >= 2) return 'status-good'
  if (avgGrowth >= 0) return 'status-warning'
  return 'status-danger'
})

const dataStatusText = computed(() => {
  const statusClass = dataStatusClass.value
  switch (statusClass) {
    case 'status-excellent': return '优秀'
    case 'status-good': return '良好'
    case 'status-warning': return '一般'
    case 'status-danger': return '需改进'
    default: return '良好'
  }
})

// 标签页配置
const tabs = [
  { key: 'results', label: '结果指标', icon: BarChart3 },
  { key: 'orders', label: '订单指标', icon: ShoppingBag },
  { key: 'users', label: '用户指标', icon: Users },
  { key: 'funnel', label: '用户漏斗', icon: Activity },
  { key: 'returns', label: '退货指标', icon: ArrowLeft }
]

// 方法
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

const formatCurrency = (num: number): string => {
  return '$' + formatNumber(num)
}

// ModuleSummary组件所需的计算属性
const websiteSummaryText = computed(() => {
  return summaryText.value
})

const websiteSummaryStats = computed(() => {
  return [
    { label: '总销售额', value: formatCurrency(websiteStats.value.totalSales) },
    { label: 'ROI表现', value: `${websiteStats.value.roi}x` },
    { label: '数据状态', value: dataStatusText.value, type: 'badge' as const, class: dataStatusClass.value }
  ]
})

// 小结编辑相关方法
const toggleEditMode = () => {
  if (isEditingMode.value) {
    // 保存编辑内容
    summaryText.value = editingSummaryText.value
    isEditingMode.value = false
  } else {
    // 进入编辑模式
    editingSummaryText.value = summaryText.value
    isEditingMode.value = true
  }
}

// 渲染迷你趋势图的方法
const renderMiniTrendChart = (trendData: number[], color: string = 'var(--color-success)') => {
  return {
    trendData,
    color
  }
}

const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

const handleExportCustomData = (data: any[]) => {
  console.log('导出自定义数据:', data)
  // 这里可以实现导出功能，比如生成Excel文件
  // 暂时用console.log模拟
  showCustomDimension.value = false
}

// 时间筛选处理方法
const handleTimeRangeChange = () => {
  console.log('时间范围变更:', selectedTimeRange.value)
  // 这里可以实现重新加载数据的逻辑
  loadDataByTimeRange()
}

const handleCustomDateChange = () => {
  if (customStartDate.value && customEndDate.value) {
    console.log('自定义时间范围:', customStartDate.value, '至', customEndDate.value)
    // 这里可以实现重新加载数据的逻辑
    loadDataByTimeRange()
  }
}

const loadDataByTimeRange = () => {
  // 根据选择的时间范围重新加载数据
  console.log('根据时间范围重新加载数据...')
  // 实际项目中这里会调用API获取对应时间范围的数据
}

// 趋势图相关方法
const getTrendLabel = () => {
  const labels: Record<string, string> = {
    'today': '今日趋势',
    'yesterday': '昨日趋势',
    'last7days': '近7日趋势',
    'last14days': '近14日趋势',
    'last1month': '近1个月趋势',
    'last3months': '近3个月趋势',
    'last1year': '近1年趋势',
    'custom': '自定义时间趋势'
  }
  return labels[selectedTimeRange.value] || '趋势'
}

const shouldShowBarChart = () => {
  return ['last1month', 'last3months', 'last1year'].includes(selectedTimeRange.value)
}

const getBarChartData = (metric: string) => {
  // 根据时间范围和指标类型生成柱状图数据
  const timeRange = selectedTimeRange.value

  if (timeRange === 'last1month') {
    // 近1个月：每周数据
    return [
      { label: '第1周', value: 80, percentage: 80 },
      { label: '第2周', value: 65, percentage: 65 },
      { label: '第3周', value: 90, percentage: 90 },
      { label: '第4周', value: 75, percentage: 75 }
    ]
  } else if (timeRange === 'last3months') {
    // 近3个月：每周数据（12周）
    return Array.from({ length: 12 }, (_, i) => ({
      label: `第${i + 1}周`,
      value: 50 + Math.random() * 40,
      percentage: 50 + Math.random() * 40
    }))
  } else if (timeRange === 'last1year') {
    // 近1年：每月数据
    const months = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
    return months.map(month => ({
      label: month,
      value: 40 + Math.random() * 50,
      percentage: 40 + Math.random() * 50
    }))
  }

  return []
}
</script>

<style scoped>
.website-data-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.panel-header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-content h3 {
  margin: 0 0 var(--spacing-xs) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.header-content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

.time-filter {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.time-select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  background: white;
  font-size: var(--font-size-sm);
  cursor: pointer;
  min-width: 120px;
}

.time-select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.custom-date-range {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin-left: var(--spacing-sm);
}

.date-input {
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.date-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.date-separator {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.custom-dimension-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all 0.2s;
}

.custom-dimension-btn:hover {
  background: var(--color-primary-dark);
  transform: translateY(-1px);
}

.tabs-nav {
  display: flex;
  background: var(--color-background-light);
  border-bottom: 1px solid var(--color-border-light);
  overflow-x: auto;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  border-bottom: 2px solid transparent;
}

.tab-btn:hover {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.tab-btn--active {
  background: var(--color-surface);
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-content {
  padding: var(--spacing-lg);
}

.tab-panel {
  animation: fadeIn 0.3s ease-in-out;
}

/* 趋势图表样式 */
.charts-section {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

.charts-section h4 {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.chart-card {
  background: var(--color-background);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.chart-card h5 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.chart-container {
  height: 120px;
  position: relative;
}

.trend-chart {
  width: 100%;
  height: 100%;
  position: relative;
  background: linear-gradient(to bottom, transparent 0%, var(--color-background-light) 100%);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.trend-line {
  position: absolute;
  width: 100%;
  height: 100%;
}

.trend-point {
  position: absolute;
  width: 6px;
  height: 6px;
  background: var(--trend-color, var(--color-primary));
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translate(-50%, 50%);
}

.trend-point::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 100%;
  width: 100px;
  height: 2px;
  background: linear-gradient(to right, var(--trend-color, var(--color-primary)), transparent);
  transform: translateY(-50%);
  z-index: -1;
}

.trend-point:last-child::before {
  display: none;
}

/* 漏斗图样式 */
.funnel-section {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.funnel-section h4 {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.funnel-chart {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  max-width: 700px;
  margin: 0 auto;
}

.funnel-step {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  position: relative;
}

.funnel-step:hover {
  border-color: var(--color-primary-light);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

.funnel-step::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: 4px;
  background: linear-gradient(to bottom, var(--color-primary), var(--color-primary-light));
  border-radius: var(--border-radius-xs);
  opacity: 0;
  transition: opacity 0.2s;
}

.funnel-step:hover::before {
  opacity: 1;
}

.funnel-bar {
  flex: 1;
  height: 40px;
  background: var(--color-background-light);
  border-radius: var(--border-radius-md);
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
}

.funnel-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary) 0%, var(--color-primary-light) 100%);
  border-radius: var(--border-radius-md);
  transition: width 0.8s ease;
  position: relative;
}

.funnel-fill::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  width: 20px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.3));
  border-radius: 0 var(--border-radius-md) var(--border-radius-md) 0;
}

.funnel-label {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 140px;
  text-align: right;
}

.funnel-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.funnel-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.funnel-rate {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
  padding: 2px 8px;
  background: var(--color-background-light);
  border-radius: var(--border-radius-xs);
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

@media (min-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1600px) {
  .metrics-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.metric-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all 0.2s;
}

.metric-card:hover {
  border-color: var(--color-primary-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.metric-icon {
  flex-shrink: 0;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.metric-content {
  flex: 1;
}

.metric-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.metric-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.metric-change {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.metric-change.positive {
  color: var(--color-success);
}

.metric-change.negative {
  color: var(--color-error);
}

.dual-comparison {
  display: flex;
  flex-direction: row;
  gap: var(--spacing-md, 12px);
  margin-top: var(--spacing-xs);
  align-items: center;
  flex-wrap: wrap;
}

.metric-detail {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-top: var(--spacing-xs);
}

.chart-section {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.chart-section h4 {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}

.distribution-chart {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.chart-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.chart-bar {
  flex: 1;
  height: 40px;
  background: var(--color-border-light);
  border-radius: var(--border-radius-sm);
  position: relative;
  overflow: hidden;
}

.chart-fill {
  height: 100%;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-sm);
  color: white;
  font-weight: var(--font-weight-medium);
}

.chart-fill--returning {
  background: var(--color-primary);
}

.chart-fill--new {
  background: var(--color-success);
}

.chart-label {
  min-width: 100px;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.chart-value {
  min-width: 80px;
  text-align: right;
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

/* 趋势图表样式 */
.charts-section {
  margin-top: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
}

.charts-section h4 {
  margin: 0 0 var(--spacing-lg) 0;
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-semibold);
}

.charts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.chart-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-md);
  transition: all 0.2s ease;
}

.chart-card:hover {
  border-color: var(--color-primary-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.chart-card h5 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  font-weight: var(--font-weight-medium);
}

.chart-container {
  position: relative;
  height: 120px;
  background: var(--color-background-light);
  border-radius: var(--border-radius-xs);
  overflow: hidden;
}

.trend-chart {
  position: relative;
  width: 100%;
  height: 100%;
  padding: var(--spacing-sm);
}

.trend-line {
  position: relative;
  width: 100%;
  height: 100%;
}

.trend-line::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, var(--trend-color, #10b981) 0%, transparent 100%);
  opacity: 0.1;
  border-radius: var(--border-radius-xs);
}

.trend-point {
  position: absolute;
  width: 8px;
  height: 8px;
  background: var(--trend-color, #10b981);
  border: 2px solid white;
  border-radius: 50%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transform: translate(-50%, 50%);
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { transform: translate(-50%, 50%) scale(1); }
  50% { transform: translate(-50%, 50%) scale(1.1); }
  100% { transform: translate(-50%, 50%) scale(1); }
}



.conversion-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.return-analysis,
.inventory-analysis {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.analysis-item {
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
}

.analysis-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.analysis-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.analysis-value.declining {
  color: var(--color-success);
}

.analysis-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
}

.status-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
  border: 1px solid var(--color-border);
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.status-good {
  background: var(--color-success);
}

.status-indicator.status-warning {
  background: var(--color-warning);
}

.status-indicator.status-danger {
  background: var(--color-error);
}

.status-content {
  flex: 1;
}

.status-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.status-value {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .conversion-metrics,
  .return-analysis,
  .inventory-analysis {
    grid-template-columns: 1fr;
  }

  .tabs-nav {
    flex-wrap: wrap;
  }

  .tab-btn {
    flex: 1;
    min-width: 120px;
  }

  .charts-grid {
    grid-template-columns: 1fr;
  }

  .header-actions {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .time-filter {
    flex-direction: column;
    align-items: stretch;
  }

  .custom-date-range {
    margin-left: 0;
    margin-top: var(--spacing-xs);
  }

  .time-select {
    min-width: auto;
  }

  .funnel-chart {
    max-width: 100%;
  }

  .funnel-step {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }

  .funnel-label {
    align-items: center;
    text-align: center;
    min-width: auto;
  }

  .dual-comparison {
    flex-direction: column;
    gap: var(--spacing-sm);
    align-items: flex-start;
  }

  .header-actions {
    flex-direction: column;
    width: 100%;
  }

  .custom-dimension-btn {
    width: 100%;
    justify-content: center;
  }
}

/* 迷你趋势图样式 */
.mini-trend-chart {
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-sm);
  border-top: 1px solid var(--color-border-light);
}

.mini-trend-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-xs);
}

.mini-trend-container {
  height: 40px;
}

.mini-trend-line {
  position: relative;
  height: 40px;
  background: #f8f9fa;
  border-radius: var(--border-radius-xs);
  overflow: hidden;
}

/* 柱状图样式 */
.bar-chart {
  display: flex;
  align-items: end;
  justify-content: space-between;
  height: 40px;
  padding: 0 2px;
  gap: 1px;
}

.bar-item {
  flex: 1;
  background: linear-gradient(to top, var(--color-primary), var(--color-primary-light));
  border-radius: var(--border-radius-xs) var(--border-radius-xs) 0 0;
  min-height: 8px;
  position: relative;
  transition: all 0.3s ease;
}

.bar-item:hover {
  background: linear-gradient(to top, var(--color-primary-dark), var(--color-primary));
  transform: scaleY(1.1);
}

.bar-value {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  font-size: 8px;
  color: var(--color-text-tertiary);
  white-space: nowrap;
  opacity: 0;
  transition: opacity 0.2s;
  margin-bottom: 2px;
}

.bar-item:hover .bar-value {
  opacity: 1;
}

/* 不同颜色的柱状图变体 */
.bar-item--warning {
  background: linear-gradient(to top, var(--color-warning), #fbbf24) !important;
}

.bar-item--warning:hover {
  background: linear-gradient(to top, #d97706, var(--color-warning)) !important;
}

.bar-item--primary {
  background: linear-gradient(to top, var(--color-primary), var(--color-primary-light)) !important;
}

.bar-item--primary:hover {
  background: linear-gradient(to top, var(--color-primary-dark), var(--color-primary)) !important;
}

.bar-item--success {
  background: linear-gradient(to top, var(--color-success), #4ade80) !important;
}

.bar-item--success:hover {
  background: linear-gradient(to top, #16a34a, var(--color-success)) !important;
}

.bar-item--info {
  background: linear-gradient(to top, var(--color-info), #38bdf8) !important;
}

.bar-item--info:hover {
  background: linear-gradient(to top, #0284c7, var(--color-info)) !important;
}

.bar-item--error {
  background: linear-gradient(to top, var(--color-error), #f87171) !important;
}

.bar-item--error:hover {
  background: linear-gradient(to top, #dc2626, var(--color-error)) !important;
}

/* 简单的线性折线图样式 */
.mini-trend-line::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40'%3E%3Cpolyline points='8,25 22,15 36,20 50,10 64,28 78,12 92,22' stroke='%2310b981' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
  background-size: 100% 100%;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;
}

/* 为不同颜色的趋势线设置不同的连接线 */
.mini-trend-line:has([style*="--color-warning"])::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40'%3E%3Cpolyline points='8,25 22,15 36,20 50,10 64,28 78,12 92,22' stroke='%23f59e0b' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
}

.mini-trend-line:has([style*="--color-primary"])::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40'%3E%3Cpolyline points='8,25 22,15 36,20 50,10 64,28 78,12 92,22' stroke='%233b82f6' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
}

.mini-trend-line:has([style*="--color-info"])::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40'%3E%3Cpolyline points='8,25 22,15 36,20 50,10 64,28 78,12 92,22' stroke='%230ea5e9' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
}

.mini-trend-line:has([style*="--color-error"])::after {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 40'%3E%3Cpolyline points='8,25 22,15 36,20 50,10 64,28 78,12 92,22' stroke='%23ef4444' stroke-width='1.5' fill='none'/%3E%3C/svg%3E");
}

.mini-trend-point {
  display: none;
}

@media (max-width: 480px) {
  .panel-header {
    flex-direction: column;
    gap: var(--spacing-md);
    align-items: flex-start;
  }

  .metric-card {
    flex-direction: column;
    text-align: center;
  }

  .metric-icon {
    margin-bottom: var(--spacing-sm);
  }

  .funnel-step {
    padding: var(--spacing-sm);
  }

  .funnel-bar {
    height: 30px;
  }

  .chart-card {
    padding: var(--spacing-sm);
  }

  .chart-container {
    height: 100px;
  }
}


</style>
