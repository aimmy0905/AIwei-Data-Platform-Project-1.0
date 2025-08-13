<template>
  <div class="sales-manager-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">销售经理看板</h1>
        <p class="dashboard-subtitle">管理团队业绩，优化销售策略</p>
      </div>

      <div class="dashboard-header__right">
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载数据...</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- 核心指标概览 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">核心指标概览</h2>
          <ModuleTimeFilter
            :initial-time-range="selectedTimeRange"
            :initial-quarter="currentQuarter"
            @time-range-change="handleTimeRangeChange"
            @quarter-change="handleQuarterChange"
          />
        </div>

        <!-- 目标卡片 -->
        <div v-if="annualQuarterlyTargets" class="target-cards-container">
          <!-- 服务费目标卡片 -->
          <div class="target-card service-fee-card">
            <div class="card-icon">
              <DollarSign :size="20" />
            </div>
            <div class="card-content">
              <div class="card-title">服务费目标</div>
              <div class="card-period">{{ selectedTimeRange === 'year' ? annualQuarterlyTargets.year + '年度' : currentQuarter }}</div>
              <div class="card-value">{{ formatCurrency(getCurrentTargetData().serviceFeeTarget) }}</div>
              <div class="card-subtitle">
                已完成: {{ formatCurrency(getCurrentTargetData().serviceFeeActual) }}
                <span class="completion-rate" :class="getCompletionClass(getCurrentTargetData().serviceFeeCompletion)">
                  {{ getCurrentTargetData().serviceFeeCompletion }}%
                </span>
              </div>
            </div>
          </div>

          <!-- 新单目标卡片 -->
          <div class="target-card new-order-card">
            <div class="card-icon">
              <TrendingUp :size="20" />
            </div>
            <div class="card-content">
              <div class="card-title">新单目标</div>
              <div class="card-period">{{ selectedTimeRange === 'year' ? annualQuarterlyTargets.year + '年度' : currentQuarter }}</div>
              <div class="card-value">{{ getCurrentTargetData().newOrderTarget }}单</div>
              <div class="card-subtitle">
                已完成: {{ getCurrentTargetData().newOrderActual }}单
                <span class="completion-rate" :class="getCompletionClass(getCurrentTargetData().newOrderCompletion)">
                  {{ getCurrentTargetData().newOrderCompletion }}%
                </span>
              </div>
            </div>
          </div>

          <!-- 综合完成率卡片 -->
          <div class="target-card completion-rate-card">
            <div class="card-icon">
              <TrendingUp :size="20" />
            </div>
            <div class="card-content">
              <div class="card-title">综合完成率</div>
              <div class="card-period">{{ selectedTimeRange === 'year' ? annualQuarterlyTargets.year + '年度' : currentQuarter }}</div>
              <div class="card-value">{{ Math.round((getCurrentTargetData().serviceFeeCompletion + getCurrentTargetData().newOrderCompletion) / 2 * 10) / 10 }}%</div>
              <div class="card-subtitle">
                服务费: {{ getCurrentTargetData().serviceFeeCompletion }}%
                <span class="separator">新单: {{ getCurrentTargetData().newOrderCompletion }}%</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 年度和季度目标表格 -->
        <div v-if="annualQuarterlyTargets" class="annual-quarterly-targets">
            <div class="targets-table-container">
              <table class="targets-table">
              <thead>
                <tr>
                  <th rowspan="2">年度</th>
                  <th rowspan="2">销售人员</th>
                  <th colspan="2" class="target-group-header">目标</th>
                  <th colspan="2" class="completion-group-header">完成</th>
                  <th colspan="2" class="comparison-group-header">完成对比</th>
                  <th colspan="3" class="baseline-group-header">完成基准</th>
                </tr>
                <tr>
                  <th class="target-header">服务费目标</th>
                  <th class="target-header">新单目标</th>
                  <th class="completion-header">服务费完成</th>
                  <th class="completion-header">单量完成</th>
                  <th class="comparison-header">服务费完成对比</th>
                  <th class="comparison-header">新单完成对比</th>
                  <th class="baseline-header">完成基准</th>
                  <th class="baseline-header">服务费基准</th>
                  <th class="baseline-header">订单基准</th>
                </tr>
              </thead>
              <tbody>
                <!-- 年度总计行 -->
                <tr class="annual-row">
                  <td rowspan="5">{{ annualQuarterlyTargets.year }}年</td>
                  <td>{{ annualQuarterlyTargets.year }}年</td>
                  <td class="target-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeTarget) }}</td>
                  <td class="target-cell">{{ annualQuarterlyTargets.yearlyTarget.newOrderTarget }}单</td>
                  <td class="completion-cell">{{ formatCurrency(annualQuarterlyTargets.yearlyTarget.serviceFeeActual) }}</td>
                  <td class="completion-cell">{{ annualQuarterlyTargets.yearlyTarget.newOrderActual }}单</td>
                  <td class="comparison-cell">{{ annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion }}%</td>
                  <td class="comparison-cell">{{ annualQuarterlyTargets.yearlyTarget.newOrderCompletion }}%</td>
                  <td class="baseline-cell">{{ annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion }}%</td>
                  <td class="baseline-cell">{{ annualQuarterlyTargets.yearlyTarget.serviceFeeCompletion }}%</td>
                  <td class="baseline-cell">{{ annualQuarterlyTargets.yearlyTarget.newOrderCompletion }}%</td>
                </tr>
                <!-- 销售人员行 -->
                <tr v-for="salesperson in salesPersonnelData" :key="salesperson.name" class="quarterly-row">
                  <td>{{ salesperson.name }}</td>
                  <td class="target-cell">{{ formatCurrency(salesperson.serviceFeeTarget) }}</td>
                  <td class="target-cell">{{ salesperson.newOrderTarget }}单</td>
                  <td class="completion-cell">{{ formatCurrency(salesperson.serviceFeeActual) }}</td>
                  <td class="completion-cell">{{ salesperson.newOrderActual }}单</td>
                  <td class="comparison-cell" :class="getCompletionClass(salesperson.serviceFeeCompletion)">{{ salesperson.serviceFeeCompletion }}%</td>
                  <td class="comparison-cell" :class="getCompletionClass(salesperson.newOrderCompletion)">{{ salesperson.newOrderCompletion }}%</td>
                  <td class="baseline-cell">{{ salesperson.serviceFeeCompletion }}%</td>
                  <td class="baseline-cell">{{ salesperson.serviceFeeCompletion }}%</td>
                  <td class="baseline-cell">{{ salesperson.newOrderCompletion }}%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- 新签客户毛利完成模块 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">新签客户毛利完成</h2>
          <ModuleTimeFilter
            :initial-time-range="selectedTimeRange"
            :initial-quarter="currentQuarter"
            @time-range-change="handleTimeRangeChange"
            @quarter-change="handleQuarterChange"
          />
        </div>

        <!-- 总体数据统计卡片 -->
        <div class="summary-cards-container">
          <div class="summary-card service-fee-summary">
            <div class="card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">服务费目标</div>
              <div class="card-value">{{ formatCurrency(totalStats.serviceFeeTarget) }}</div>
            </div>
          </div>

          <div class="summary-card new-order-summary">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">新单单量</div>
              <div class="card-value">{{ totalStats.newOrderVolume }}单</div>
            </div>
          </div>

          <div class="summary-card service-fee-actual">
            <div class="card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">服务费</div>
              <div class="card-value">{{ formatCurrency(totalStats.serviceFee) }}</div>
            </div>
          </div>

          <div class="summary-card consumption-summary">
            <div class="card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">消费</div>
              <div class="card-value">{{ formatCurrency(totalStats.consumption) }}</div>
            </div>
          </div>

          <div class="summary-card single-point-summary">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">返点</div>
              <div class="card-value">{{ totalStats.singlePoint }}个</div>
            </div>
          </div>

          <div class="summary-card gross-profit-summary">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">毛利总计</div>
              <div class="card-value">{{ formatCurrency(totalStats.grossProfit) }}</div>
            </div>
          </div>
        </div>

        <div class="profit-analysis-table-container">
          <table class="profit-analysis-table">
            <thead>
              <tr>
                <th rowspan="2">年度</th>
                <th rowspan="2">销售人员</th>
                <th colspan="4" class="service-fee-group-header">服务费目标</th>
                <th colspan="4" class="order-count-group-header">新单单量</th>
                <th colspan="4" class="service-fee-actual-group-header">服务费</th>
                <th colspan="4" class="consumption-group-header">消费</th>
                <th colspan="4" class="rebate-group-header">返点</th>
                <th colspan="4" class="profit-group-header">毛利</th>
              </tr>
              <tr>
                <th class="service-fee-header">Google</th>
                <th class="service-fee-header">Meta</th>
                <th class="service-fee-header">Criteo</th>
                <th class="service-fee-header">Bing</th>
                <th class="order-count-header">Google</th>
                <th class="order-count-header">Meta</th>
                <th class="order-count-header">Criteo</th>
                <th class="order-count-header">Bing</th>
                <th class="service-fee-actual-header">Google</th>
                <th class="service-fee-actual-header">Meta</th>
                <th class="service-fee-actual-header">Criteo</th>
                <th class="service-fee-actual-header">Bing</th>
                <th class="consumption-header">Google</th>
                <th class="consumption-header">Meta</th>
                <th class="consumption-header">Criteo</th>
                <th class="consumption-header">Bing</th>
                <th class="rebate-header">Google</th>
                <th class="rebate-header">Meta</th>
                <th class="rebate-header">Criteo</th>
                <th class="rebate-header">Bing</th>
                <th class="profit-header">Google</th>
                <th class="profit-header">Meta</th>
                <th class="profit-header">Criteo</th>
                <th class="profit-header">Bing</th>
              </tr>
            </thead>
            <tbody>
              <tr class="year-row">
                <td rowspan="5">2025年</td>
                <td>2025年</td>
                <td class="service-fee-cell">¥1200.00万</td>
                <td class="service-fee-cell">¥850.00万</td>
                <td class="service-fee-cell">¥320.00万</td>
                <td class="service-fee-cell">¥180.00万</td>
                <td class="order-count-cell">720单</td>
                <td class="order-count-cell">510单</td>
                <td class="order-count-cell">192单</td>
                <td class="order-count-cell">108单</td>
                <td class="service-fee-actual-cell">¥1140.00万</td>
                <td class="service-fee-actual-cell">¥807.50万</td>
                <td class="service-fee-actual-cell">¥304.00万</td>
                <td class="service-fee-actual-cell">¥171.00万</td>
                <td class="consumption-cell">¥8550.00万</td>
                <td class="consumption-cell">¥6062.50万</td>
                <td class="consumption-cell">¥2280.00万</td>
                <td class="consumption-cell">¥1282.50万</td>
                <td class="rebate-cell">¥427.50万</td>
                <td class="rebate-cell">¥303.13万</td>
                <td class="rebate-cell">¥114.00万</td>
                <td class="rebate-cell">¥64.13万</td>
                <td class="renewal-amount-cell">¥1567.50万</td>
                <td class="renewal-amount-cell">¥1110.63万</td>
                <td class="renewal-amount-cell">¥418.00万</td>
                <td class="renewal-amount-cell">¥235.13万</td>
              </tr>
              <tr class="quarter-row">
                <td>销售1</td>
                <td class="service-fee-cell">¥280.00万</td>
                <td class="service-fee-cell">¥195.00万</td>
                <td class="service-fee-cell">¥75.00万</td>
                <td class="service-fee-cell">¥42.00万</td>
                <td class="order-count-cell">168单</td>
                <td class="order-count-cell">117单</td>
                <td class="order-count-cell">45单</td>
                <td class="order-count-cell">25单</td>
                <td class="service-fee-actual-cell">¥266.00万</td>
                <td class="service-fee-actual-cell">¥185.25万</td>
                <td class="service-fee-actual-cell">¥71.25万</td>
                <td class="service-fee-actual-cell">¥39.90万</td>
                <td class="consumption-cell">¥1995.00万</td>
                <td class="consumption-cell">¥1389.38万</td>
                <td class="consumption-cell">¥532.50万</td>
                <td class="consumption-cell">¥299.25万</td>
                <td class="rebate-cell">¥99.75万</td>
                <td class="rebate-cell">¥69.47万</td>
                <td class="rebate-cell">¥26.63万</td>
                <td class="rebate-cell">¥14.96万</td>
                <td class="renewal-amount-cell">¥365.75万</td>
                <td class="renewal-amount-cell">¥254.72万</td>
                <td class="renewal-amount-cell">¥97.88万</td>
                <td class="renewal-amount-cell">¥54.86万</td>
              </tr>
              <tr class="quarter-row">
                <td>销售2</td>
                <td class="service-fee-cell">¥320.00万</td>
                <td class="service-fee-cell">¥225.00万</td>
                <td class="service-fee-cell">¥85.00万</td>
                <td class="service-fee-cell">¥48.00万</td>
                <td class="order-count-cell">192单</td>
                <td class="order-count-cell">135单</td>
                <td class="order-count-cell">51单</td>
                <td class="order-count-cell">29单</td>
                <td class="service-fee-actual-cell">¥304.00万</td>
                <td class="service-fee-actual-cell">¥213.75万</td>
                <td class="service-fee-actual-cell">¥80.75万</td>
                <td class="service-fee-actual-cell">¥45.60万</td>
                <td class="consumption-cell">¥2280.00万</td>
                <td class="consumption-cell">¥1593.75万</td>
                <td class="consumption-cell">¥607.50万</td>
                <td class="consumption-cell">¥342.00万</td>
                <td class="rebate-cell">¥114.00万</td>
                <td class="rebate-cell">¥79.69万</td>
                <td class="rebate-cell">¥30.38万</td>
                <td class="rebate-cell">¥17.10万</td>
                <td class="renewal-amount-cell">¥418.00万</td>
                <td class="renewal-amount-cell">¥293.44万</td>
                <td class="renewal-amount-cell">¥111.13万</td>
                <td class="renewal-amount-cell">¥62.70万</td>
              </tr>
              <tr class="quarter-row">
                <td>销售3</td>
                <td class="service-fee-cell">¥350.00万</td>
                <td class="service-fee-cell">¥245.00万</td>
                <td class="service-fee-cell">¥95.00万</td>
                <td class="service-fee-cell">¥53.00万</td>
                <td class="order-count-cell">210单</td>
                <td class="order-count-cell">147单</td>
                <td class="order-count-cell">57单</td>
                <td class="order-count-cell">32单</td>
                <td class="service-fee-actual-cell">¥332.50万</td>
                <td class="service-fee-actual-cell">¥232.75万</td>
                <td class="service-fee-actual-cell">¥90.25万</td>
                <td class="service-fee-actual-cell">¥50.35万</td>
                <td class="consumption-cell">¥2492.50万</td>
                <td class="consumption-cell">¥1743.13万</td>
                <td class="consumption-cell">¥663.75万</td>
                <td class="consumption-cell">¥373.88万</td>
                <td class="rebate-cell">¥124.63万</td>
                <td class="rebate-cell">¥87.16万</td>
                <td class="rebate-cell">¥33.19万</td>
                <td class="rebate-cell">¥18.69万</td>
                <td class="renewal-amount-cell">¥457.13万</td>
                <td class="renewal-amount-cell">¥319.91万</td>
                <td class="renewal-amount-cell">¥123.44万</td>
                <td class="renewal-amount-cell">¥69.04万</td>
              </tr>
              <tr class="quarter-row">
                <td>销售4</td>
                <td class="service-fee-cell">¥250.00万</td>
                <td class="service-fee-cell">¥185.00万</td>
                <td class="service-fee-cell">¥65.00万</td>
                <td class="service-fee-cell">¥37.00万</td>
                <td class="order-count-cell">150单</td>
                <td class="order-count-cell">111单</td>
                <td class="order-count-cell">39单</td>
                <td class="order-count-cell">22单</td>
                <td class="service-fee-actual-cell">¥237.50万</td>
                <td class="service-fee-actual-cell">¥175.75万</td>
                <td class="service-fee-actual-cell">¥61.75万</td>
                <td class="service-fee-actual-cell">¥35.15万</td>
                <td class="consumption-cell">¥1782.50万</td>
                <td class="consumption-cell">¥1336.25万</td>
                <td class="consumption-cell">¥476.25万</td>
                <td class="consumption-cell">¥267.38万</td>
                <td class="rebate-cell">¥89.13万</td>
                <td class="rebate-cell">¥66.81万</td>
                <td class="rebate-cell">¥23.81万</td>
                <td class="rebate-cell">¥13.37万</td>
                <td class="renewal-amount-cell">¥326.63万</td>
                <td class="renewal-amount-cell">¥242.56万</td>
                <td class="renewal-amount-cell">¥85.56万</td>
                <td class="renewal-amount-cell">¥48.52万</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 客户年度毛利完成模块 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">客户年度毛利完成</h2>
          <ModuleTimeFilter
            :initial-time-range="selectedTimeRange"
            :initial-quarter="currentQuarter"
            @time-range-change="handleTimeRangeChange"
            @quarter-change="handleQuarterChange"
          />
        </div>

        <!-- 总体数据统计卡片（与"新签客户毛利完成"一致） -->
        <div class="summary-cards-container">
          <div class="summary-card service-fee-summary">
            <div class="card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">服务费目标</div>
              <div class="card-value">{{ formatCurrency(totalStats.serviceFeeTarget) }}</div>
            </div>
          </div>

          <div class="summary-card new-order-summary">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">新单单量</div>
              <div class="card-value">{{ totalStats.newOrderVolume }}单</div>
            </div>
          </div>

          <div class="summary-card service-fee-actual">
            <div class="card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">服务费</div>
              <div class="card-value">{{ formatCurrency(totalStats.serviceFee) }}</div>
            </div>
          </div>

          <div class="summary-card consumption-summary">
            <div class="card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">消费</div>
              <div class="card-value">{{ formatCurrency(totalStats.consumption) }}</div>
            </div>
          </div>

          <div class="summary-card single-point-summary">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">返点</div>
              <div class="card-value">{{ totalStats.singlePoint }}个</div>
            </div>
          </div>

          <div class="summary-card gross-profit-summary">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">毛利总计</div>
              <div class="card-value">{{ formatCurrency(totalStats.grossProfit) }}</div>
            </div>
          </div>
        </div>

        <div class="customer-annual-profit-table-container">
          <table class="customer-annual-profit-table">
            <thead>
              <tr>
                <th rowspan="2">客户名称</th>
                <th rowspan="2">销售人员</th>
                <th colspan="4" class="service-fee-group-header">服务费目标</th>
                <th colspan="4" class="service-fee-actual-group-header">服务费完成</th>
                <th colspan="4" class="consumption-group-header">消费</th>
                <th colspan="4" class="rebate-group-header">返点</th>
                <th colspan="4" class="profit-group-header">毛利</th>
              </tr>
              <tr>
                <th class="service-fee-header">Google</th>
                <th class="service-fee-header">Meta</th>
                <th class="service-fee-header">Criteo</th>
                <th class="service-fee-header">Bing</th>
                <th class="service-fee-actual-header">Google</th>
                <th class="service-fee-actual-header">Meta</th>
                <th class="service-fee-actual-header">Criteo</th>
                <th class="service-fee-actual-header">Bing</th>
                <th class="consumption-header">Google</th>
                <th class="consumption-header">Meta</th>
                <th class="consumption-header">Criteo</th>
                <th class="consumption-header">Bing</th>
                <th class="rebate-header">Google</th>
                <th class="rebate-header">Meta</th>
                <th class="rebate-header">Criteo</th>
                <th class="rebate-header">Bing</th>
                <th class="profit-header">Google</th>
                <th class="profit-header">Meta</th>
                <th class="profit-header">Criteo</th>
                <th class="profit-header">Bing</th>
              </tr>
            </thead>
            <tbody>
              <tr class="customer-row">
                <td rowspan="1" class="customer-name-cell">华为技术有限公司</td>
                <td>销售1</td>
                <td class="service-fee-cell">¥180.00万</td>
                <td class="service-fee-cell">¥120.00万</td>
                <td class="service-fee-cell">¥50.00万</td>
                <td class="service-fee-cell">¥30.00万</td>
                <td class="service-fee-actual-cell">¥171.00万</td>
                <td class="service-fee-actual-cell">¥114.00万</td>
                <td class="service-fee-actual-cell">¥47.50万</td>
                <td class="service-fee-actual-cell">¥28.50万</td>
                <td class="consumption-cell">¥1282.50万</td>
                <td class="consumption-cell">¥855.00万</td>
                <td class="consumption-cell">¥356.25万</td>
                <td class="consumption-cell">¥213.75万</td>
                <td class="rebate-cell">¥64.13万</td>
                <td class="rebate-cell">¥42.75万</td>
                <td class="rebate-cell">¥17.81万</td>
                <td class="rebate-cell">¥10.69万</td>
                <td class="renewal-amount-cell">¥235.13万</td>
                <td class="renewal-amount-cell">¥156.75万</td>
                <td class="renewal-amount-cell">¥65.31万</td>
                <td class="renewal-amount-cell">¥39.19万</td>
              </tr>
              <tr class="customer-row">
                <td rowspan="1" class="customer-name-cell">小米科技有限公司</td>
                <td>销售2</td>
                <td class="service-fee-cell">¥150.00万</td>
                <td class="service-fee-cell">¥100.00万</td>
                <td class="service-fee-cell">¥40.00万</td>
                <td class="service-fee-cell">¥25.00万</td>
                <td class="service-fee-actual-cell">¥135.00万</td>
                <td class="service-fee-actual-cell">¥90.00万</td>
                <td class="service-fee-actual-cell">¥36.00万</td>
                <td class="service-fee-actual-cell">¥22.50万</td>
                <td class="consumption-cell">¥1012.50万</td>
                <td class="consumption-cell">¥675.00万</td>
                <td class="consumption-cell">¥270.00万</td>
                <td class="consumption-cell">¥168.75万</td>
                <td class="rebate-cell">¥50.63万</td>
                <td class="rebate-cell">¥33.75万</td>
                <td class="rebate-cell">¥13.50万</td>
                <td class="rebate-cell">¥8.44万</td>
                <td class="renewal-amount-cell">¥185.63万</td>
                <td class="renewal-amount-cell">¥123.75万</td>
                <td class="renewal-amount-cell">¥49.50万</td>
                <td class="renewal-amount-cell">¥30.94万</td>
              </tr>
              <tr class="customer-row">
                <td rowspan="1" class="customer-name-cell">OPPO广东移动通信有限公司</td>
                <td>销售3</td>
                <td class="service-fee-cell">¥120.00万</td>
                <td class="service-fee-cell">¥80.00万</td>
                <td class="service-fee-cell">¥30.00万</td>
                <td class="service-fee-cell">¥20.00万</td>
                <td class="service-fee-actual-cell">¥96.00万</td>
                <td class="service-fee-actual-cell">¥64.00万</td>
                <td class="service-fee-actual-cell">¥24.00万</td>
                <td class="service-fee-actual-cell">¥16.00万</td>
                <td class="consumption-cell">¥720.00万</td>
                <td class="consumption-cell">¥480.00万</td>
                <td class="consumption-cell">¥180.00万</td>
                <td class="consumption-cell">¥120.00万</td>
                <td class="rebate-cell">¥36.00万</td>
                <td class="rebate-cell">¥24.00万</td>
                <td class="rebate-cell">¥9.00万</td>
                <td class="rebate-cell">¥6.00万</td>
                <td class="renewal-amount-cell">¥132.00万</td>
                <td class="renewal-amount-cell">¥88.00万</td>
                <td class="renewal-amount-cell">¥33.00万</td>
                <td class="renewal-amount-cell">¥22.00万</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 员工总毛利完成模块 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">员工总毛利完成</h2>
          <div class="profit-filter">
            <select v-model="selectedProfitPeriod" @change="handleProfitPeriodChange" class="time-filter-select">
              <option value="2025">2025年</option>
              <option value="2025-Q1">2025年 Q1季度</option>
              <option value="2025-Q2">2025年 Q2季度</option>
              <option value="2025-Q3">2025年 Q3季度</option>
              <option value="2025-Q4">2025年 Q4季度</option>
              <option value="2025-01">2025年 1月</option>
              <option value="2025-02">2025年 2月</option>
              <option value="2025-03">2025年 3月</option>
              <option value="2025-04">2025年 4月</option>
              <option value="2025-05">2025年 5月</option>
              <option value="2025-06">2025年 6月</option>
              <option value="2025-07">2025年 7月</option>
              <option value="2025-08">2025年 8月</option>
              <option value="2025-09">2025年 9月</option>
              <option value="2025-10">2025年 10月</option>
              <option value="2025-11">2025年 11月</option>
              <option value="2025-12">2025年 12月</option>
            </select>
          </div>
        </div>

        <div class="profit-cards-grid">
          <div class="profit-card total-profit-card">
            <div class="profit-card-header">
              <div class="profit-card-icon">
                <TrendingUp :size="24" />
              </div>
              <div class="profit-card-title">
                <h3>总毛利完成</h3>
                <p class="profit-period">{{ getTimePeriodLabel(selectedProfitPeriod) }}</p>
              </div>
            </div>
            <div class="profit-card-content">
              <div class="profit-value">{{ formatCurrency(currentProfitData.totalProfit) }}</div>
              <div class="profit-details">
                <div class="detail-item">
                  <span class="detail-label">新客户:</span>
                  <span class="detail-value">{{ formatCurrency(currentProfitData.newCustomerProfit) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">老客户:</span>
                  <span class="detail-value">{{ formatCurrency(currentProfitData.oldCustomerProfit) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="profit-card service-fee-card">
            <div class="profit-card-header">
              <div class="profit-card-icon">
                <DollarSign :size="24" />
              </div>
              <div class="profit-card-title">
                <h3>服务费合计</h3>
                <p class="profit-period">{{ getTimePeriodLabel(selectedProfitPeriod) }}</p>
              </div>
            </div>
            <div class="profit-card-content">
              <div class="profit-value">{{ formatCurrency(currentProfitData.totalServiceFee) }}</div>
              <div class="profit-details">
                <div class="detail-item">
                  <span class="detail-label">新客户:</span>
                  <span class="detail-value">{{ formatCurrency(currentProfitData.newCustomerServiceFee) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">老客户:</span>
                  <span class="detail-value">{{ formatCurrency(currentProfitData.oldCustomerServiceFee) }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="profit-card rebate-card">
            <div class="profit-card-header">
              <div class="profit-card-icon">
                <TrendingUp :size="24" />
              </div>
              <div class="profit-card-title">
                <h3>返点合计</h3>
                <p class="profit-period">{{ getTimePeriodLabel(selectedProfitPeriod) }}</p>
              </div>
            </div>
            <div class="profit-card-content">
              <div class="profit-value">{{ formatCurrency(currentProfitData.totalRebate) }}</div>
              <div class="profit-details">
                <div class="detail-item">
                  <span class="detail-label">新客户:</span>
                  <span class="detail-value">{{ formatCurrency(currentProfitData.newCustomerRebate) }}</span>
                </div>
                <div class="detail-item">
                  <span class="detail-label">老客户:</span>
                  <span class="detail-value">{{ formatCurrency(currentProfitData.oldCustomerRebate) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="employee-profit-table-container">
          <table class="employee-profit-table">
            <thead>
              <tr>
                <th rowspan="3">时间选择</th>
                <th rowspan="3">年度合计</th>
                <th colspan="3" class="target-group-header">毛利合计</th>
                <th colspan="3" class="completion-group-header">2025年度（新客户）</th>
                <th colspan="3" class="comparison-group-header">2025年度（老客户）</th>
              </tr>
              <tr>
                <th class="target-header">总毛利完成</th>
                <th class="target-header">服务费合计</th>
                <th class="target-header">返点合计</th>
                <th class="completion-header">总毛利完成</th>
                <th class="completion-header">服务费合计</th>
                <th class="completion-header">返点合计</th>
                <th class="comparison-header">完成比例</th>
                <th class="comparison-header">服务费基准</th>
                <th class="comparison-header">订单基准</th>
              </tr>
            </thead>
            <tbody>
              <!-- 年度数据 -->
              <tr class="year-row">
                <td rowspan="6">2025年</td>
                <td>年度合计</td>
                <td class="target-cell">¥3,331.26万</td>
                <td class="target-cell">¥2,422.50万</td>
                <td class="target-cell">¥908.76万</td>
                <td class="completion-cell">¥2,665.01万</td>
                <td class="completion-cell">¥1,938.00万</td>
                <td class="completion-cell">¥727.01万</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
              </tr>

              <!-- 销售1数据 -->
              <tr class="personnel-row">
                <td>销售1</td>
                <td class="target-cell">¥653.13万</td>
                <td class="target-cell">¥418.50万</td>
                <td class="target-cell">¥234.63万</td>
                <td class="completion-cell">¥522.50万</td>
                <td class="completion-cell">¥334.80万</td>
                <td class="completion-cell">¥187.70万</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
              </tr>

              <!-- 销售2数据 -->
              <tr class="personnel-row">
                <td>销售2</td>
                <td class="target-cell">¥567.00万</td>
                <td class="target-cell">¥378.00万</td>
                <td class="target-cell">¥189.00万</td>
                <td class="completion-cell">¥453.60万</td>
                <td class="completion-cell">¥302.40万</td>
                <td class="completion-cell">¥151.20万</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
              </tr>

              <!-- 销售3数据 -->
              <tr class="personnel-row">
                <td>销售3</td>
                <td class="target-cell">¥501.30万</td>
                <td class="target-cell">¥334.20万</td>
                <td class="target-cell">¥167.10万</td>
                <td class="completion-cell">¥401.04万</td>
                <td class="completion-cell">¥267.36万</td>
                <td class="completion-cell">¥133.68万</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
              </tr>

              <!-- 销售4数据 -->
              <tr class="personnel-row">
                <td>销售4</td>
                <td class="target-cell">¥464.40万</td>
                <td class="target-cell">¥309.60万</td>
                <td class="target-cell">¥154.80万</td>
                <td class="completion-cell">¥371.52万</td>
                <td class="completion-cell">¥247.68万</td>
                <td class="completion-cell">¥123.84万</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
              </tr>

              <!-- 销售5数据 -->
              <tr class="personnel-row">
                <td>销售5</td>
                <td class="target-cell">¥427.80万</td>
                <td class="target-cell">¥285.20万</td>
                <td class="target-cell">¥142.60万</td>
                <td class="completion-cell">¥342.24万</td>
                <td class="completion-cell">¥228.16万</td>
                <td class="completion-cell">¥114.08万</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
                <td class="comparison-cell excellent">80.0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 客户毛利明细模块 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">客户毛利明细</h2>
          <ModuleTimeFilter
            :initial-time-range="selectedTimeRange"
            :initial-quarter="currentQuarter"
            @time-range-change="handleTimeRangeChange"
            @quarter-change="handleQuarterChange"
          />
        </div>

        <!-- 客户毛利明细统计卡片 -->
        <div class="summary-cards-container">
          <div class="summary-card customer-count-card">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">客户数量</div>
              <div class="card-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</div>
              <div class="card-value">{{ customerDetailStats.totalCustomers }}个</div>
              <div class="card-completion">
                <span>新客户: <span class="completion-percentage">{{ customerDetailStats.newCustomers }}个</span></span>
                <span class="separator">|</span>
                <span>老客户: <span class="completion-percentage">{{ customerDetailStats.oldCustomers }}个</span></span>
              </div>
            </div>
          </div>

          <div class="summary-card profit-total-card">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">毛利合计</div>
              <div class="card-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</div>
              <div class="card-value">{{ formatCurrency(customerDetailStats.totalProfit) }}</div>
              <div class="card-completion">
                <span>新客户: <span class="completion-percentage">{{ formatCurrency(customerDetailStats.newCustomerProfit) }}</span></span>
                <span class="separator">|</span>
                <span>老客户: <span class="completion-percentage">{{ formatCurrency(customerDetailStats.oldCustomerProfit) }}</span></span>
              </div>
            </div>
          </div>

          <div class="summary-card service-fee-total-card">
            <div class="card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">服务费合计</div>
              <div class="card-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</div>
              <div class="card-value">{{ formatCurrency(customerDetailStats.totalServiceFee) }}</div>
              <div class="card-completion">
                <span>新客户: <span class="completion-percentage">{{ formatCurrency(customerDetailStats.newCustomerServiceFee) }}</span></span>
                <span class="separator">|</span>
                <span>老客户: <span class="completion-percentage">{{ formatCurrency(customerDetailStats.oldCustomerServiceFee) }}</span></span>
              </div>
            </div>
          </div>

          <div class="summary-card rebate-total-card">
            <div class="card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">返点合计</div>
              <div class="card-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</div>
              <div class="card-value">{{ formatCurrency(customerDetailStats.totalRebate) }}</div>
              <div class="card-completion">
                <span>新客户: <span class="completion-percentage">{{ formatCurrency(customerDetailStats.newCustomerRebate) }}</span></span>
                <span class="separator">|</span>
                <span>老客户: <span class="completion-percentage">{{ formatCurrency(customerDetailStats.oldCustomerRebate) }}</span></span>
              </div>
            </div>
          </div>

          <div class="summary-card consumption-total-card">
            <div class="card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">消费合计</div>
              <div class="card-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</div>
              <div class="card-value">{{ formatCurrency(customerDetailStats.totalConsumption) }}</div>
              <div class="card-completion">
                <span>新客户: <span class="completion-percentage">{{ formatCurrency(customerDetailStats.newCustomerConsumption) }}</span></span>
                <span class="separator">|</span>
                <span>老客户: <span class="completion-percentage">{{ formatCurrency(customerDetailStats.oldCustomerConsumption) }}</span></span>
              </div>
            </div>
          </div>
        </div>

        <div class="table-scroll-hint">
          <span>← 表格可左右滑动查看更多列 →</span>
        </div>
        <div class="customer-profit-detail-table-container">
          <table class="customer-profit-detail-table">
            <thead>
              <tr>
                <th rowspan="2">客户名称</th>
                <th rowspan="2">销售</th>
                <th rowspan="2">优化部门</th>
                <th rowspan="2">合作项目</th>
                <th rowspan="2">合作时间</th>
                <th rowspan="2">合作类型</th>
                <th rowspan="2">第一次合同签定时间</th>
                <th rowspan="2">第二次合同合作期间</th>
                <th rowspan="2">毛利合计</th>
                <th rowspan="2">服务费合计</th>
                <th rowspan="2">返点合计</th>
                <th rowspan="2">消费合计</th>
                <th colspan="4" class="platform-group-header">消费明细</th>
                <th rowspan="2" class="customer-status-header">客户状态</th>
              </tr>
              <tr>
                <th class="platform-header">Google</th>
                <th class="platform-header">Meta</th>
                <th class="platform-header">Criteo</th>
                <th class="platform-header">Bing</th>
              </tr>
            </thead>
            <tbody>
              <!-- 华为数据 -->
              <tr class="customer-row">
                <td class="customer-name-cell">华为</td>
                <td>销售1</td>
                <td>优化师A</td>
                <td>2024-01-15</td>
                <td>12个月</td>
                <td>新客户</td>
                <td>2024-03-20</td>
                <td>2024-03-20</td>
                <td class="renewal-amount-cell">¥653.13万</td>
                <td class="service-fee-cell">¥418.50万</td>
                <td class="rebate-cell">¥234.63万</td>
                <td class="consumption-cell">¥1,395.00万</td>
                <td class="platform-cell">¥558.00万</td>
                <td class="platform-cell">¥418.50万</td>
                <td class="platform-cell">¥279.00万</td>
                <td class="platform-cell">¥139.50万</td>
                <td class="status-active">正常合作</td>
              </tr>

              <!-- 小米数据 -->
              <tr class="customer-row">
                <td class="customer-name-cell">小米</td>
                <td>销售2</td>
                <td>优化师B</td>
                <td>2024-02-10</td>
                <td>11个月</td>
                <td>新客户</td>
                <td>2024-04-15</td>
                <td>2024-04-15</td>
                <td class="renewal-amount-cell">¥567.00万</td>
                <td class="service-fee-cell">¥378.00万</td>
                <td class="rebate-cell">¥189.00万</td>
                <td class="consumption-cell">¥1,260.00万</td>
                <td class="platform-cell">¥504.00万</td>
                <td class="platform-cell">¥378.00万</td>
                <td class="platform-cell">¥252.00万</td>
                <td class="platform-cell">¥126.00万</td>
                <td class="status-active">正常合作</td>
              </tr>

              <!-- OPPO数据 -->
              <tr class="customer-row">
                <td class="customer-name-cell">OPPO</td>
                <td>销售3</td>
                <td>优化师C</td>
                <td>2024-03-05</td>
                <td>10个月</td>
                <td>老客户</td>
                <td>2024-05-10</td>
                <td>2024-05-10</td>
                <td class="renewal-amount-cell">¥501.30万</td>
                <td class="service-fee-cell">¥334.20万</td>
                <td class="rebate-cell">¥167.10万</td>
                <td class="consumption-cell">¥1,114.00万</td>
                <td class="platform-cell">¥445.60万</td>
                <td class="platform-cell">¥334.20万</td>
                <td class="platform-cell">¥222.80万</td>
                <td class="platform-cell">¥111.40万</td>
                <td class="status-active">正常合作</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 续费客户名单模块 -->
      <div class="dashboard-section">
        <div class="section-header">
          <h2 class="section-title">续费客户名单</h2>
          <ModuleTimeFilter
            :initial-time-range="selectedTimeRange"
            :initial-quarter="currentQuarter"
            @time-range-change="handleTimeRangeChange"
            @quarter-change="handleQuarterChange"
          />
        </div>

        <!-- 续费统计卡片 -->
        <div class="summary-cards-container">
          <div class="summary-card renewal-count-card">
            <div class="card-icon">
              <RefreshCw :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">续费客户数量</div>
              <div class="card-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</div>
              <div class="card-value">{{ renewalStats.customerCount }}个</div>
            </div>
          </div>
          <div class="summary-card renewal-amount-card">
            <div class="card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="card-content">
              <div class="card-title">上次续费总额</div>
              <div class="card-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</div>
              <div class="card-value">{{ formatCurrency(renewalStats.totalAmount) }}</div>
            </div>
          </div>
        </div>

        <div class="table-scroll-hint">
          <span>← 表格可左右滑动查看更多列 →</span>
        </div>
        <div class="customer-profit-detail-table-container">
          <table class="customer-profit-detail-table">
            <thead>
              <tr>
                <th rowspan="2">客户名称</th>
                <th rowspan="2">销售</th>
                <th rowspan="2">优化部门</th>
                <th rowspan="2">合作项目</th>
                <th rowspan="2">合作时间</th>
                <th rowspan="2">合作类型</th>
                <th rowspan="2">上一次合作期间</th>
                <th rowspan="2">服务到期时间</th>
                <th rowspan="2" class="renewal-project-header">上一次续费项目</th>
                <th rowspan="2" class="renewal-amount-header">上一次续费金额</th>
              </tr>
            </thead>
            <tbody>
              <!-- 华为续费数据 -->
              <tr class="customer-row">
                <td class="customer-name-cell">华为</td>
                <td>销售1</td>
                <td>优化部门A</td>
                <td>Google Ads推广</td>
                <td>2024-01-15 至 2024-12-15</td>
                <td>续费客户</td>
                <td>2023-01-15 至 2023-12-15</td>
                <td>2024-12-15</td>
                <td class="renewal-project-cell">Google Ads + Meta Ads</td>
                <td class="renewal-amount-cell">¥856.50万</td>
              </tr>

              <!-- 小米续费数据 -->
              <tr class="customer-row">
                <td class="customer-name-cell">小米</td>
                <td>销售2</td>
                <td>优化部门B</td>
                <td>Meta Ads推广</td>
                <td>2024-02-01 至 2024-11-30</td>
                <td>续费客户</td>
                <td>2023-02-01 至 2023-11-30</td>
                <td>2024-11-30</td>
                <td class="renewal-project-cell">Meta Ads + Criteo</td>
                <td class="renewal-amount-cell">¥642.30万</td>
              </tr>

              <!-- OPPO续费数据 -->
              <tr class="customer-row">
                <td class="customer-name-cell">OPPO</td>
                <td>销售3</td>
                <td>优化部门C</td>
                <td>Criteo推广</td>
                <td>2024-03-10 至 2025-01-10</td>
                <td>续费客户</td>
                <td>2023-03-10 至 2023-12-10</td>
                <td>2025-01-10</td>
                <td class="renewal-project-cell">Criteo + Bing Ads</td>
                <td class="renewal-amount-cell">¥498.60万</td>
              </tr>

              <!-- VIVO续费数据 -->
              <tr class="customer-row">
                <td class="customer-name-cell">VIVO</td>
                <td>销售4</td>
                <td>优化部门D</td>
                <td>Bing Ads推广</td>
                <td>2024-04-20 至 2024-12-20</td>
                <td>续费客户</td>
                <td>2023-04-20 至 2023-12-20</td>
                <td>2024-12-20</td>
                <td class="renewal-project-cell">Bing Ads + Google Ads</td>
                <td class="renewal-amount-cell">¥427.80万</td>
              </tr>

              <!-- 一加续费数据 -->
              <tr class="customer-row">
                <td class="customer-name-cell">一加</td>
                <td>销售5</td>
                <td>优化部门E</td>
                <td>多平台推广</td>
                <td>2024-05-15 至 2025-02-15</td>
                <td>续费客户</td>
                <td>2023-05-15 至 2024-02-15</td>
                <td>2025-02-15</td>
                <td class="renewal-project-cell">全平台推广</td>
                <td class="renewal-amount-cell">¥785.40万</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { DollarSign, TrendingUp, RefreshCw } from 'lucide-vue-next'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import ModuleTimeFilter from '@/components/common/ModuleTimeFilter.vue'
import type {
  BusinessRole,
  AnnualQuarterlyTargets
} from '@/types'

// 状态
const currentRole = ref('sales_manager')
const availableRoles = ref<BusinessRole[]>([])
const loading = ref(true)

// 时间筛选相关状态
const selectedTimeRange = ref('quarter')
const currentQuarter = ref('2025年Q1')

// 数据状态
const annualQuarterlyTargets = ref<AnnualQuarterlyTargets>()

// 销售人员数据
const salesPersonnelData = ref([
  { name: '销售1', serviceFeeTarget: 6000000, serviceFeeActual: 5700000, serviceFeeCompletion: 95.0, newOrderTarget: 36, newOrderActual: 31, newOrderCompletion: 86.1 },
  { name: '销售2', serviceFeeTarget: 5500000, serviceFeeActual: 5225000, serviceFeeCompletion: 95.0, newOrderTarget: 33, newOrderActual: 28, newOrderCompletion: 84.8 },
  { name: '销售3', serviceFeeTarget: 5000000, serviceFeeActual: 4750000, serviceFeeCompletion: 95.0, newOrderTarget: 30, newOrderActual: 26, newOrderCompletion: 86.7 },
  { name: '销售4', serviceFeeTarget: 4500000, serviceFeeActual: 4275000, serviceFeeCompletion: 95.0, newOrderTarget: 27, newOrderActual: 23, newOrderCompletion: 85.2 }
])

// 时间周期选择
const selectedTimePeriod = ref('2025')
const selectedProfitPeriod = ref('2025')

// 目标数据
const targetData = {
  '2025': { serviceFeeTarget: 30000000, serviceFeeActual: 28500000, serviceFeeCompletion: 95.0, newOrderTarget: 180, newOrderActual: 156, newOrderCompletion: 86.7 },
  '2025-Q1': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
  '2025-Q2': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
  '2025-Q3': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
  '2025-Q4': { serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 }
}

// 计算属性
const getCurrentTargetData = () => {
  const key = selectedTimeRange.value === 'year' ? '2025' : currentQuarter.value
  return targetData[key] || targetData['2025']
}

const getCompletionClass = (completion: number) => {
  if (completion >= 90) return 'excellent'
  if (completion >= 70) return 'good'
  return 'poor'
}

// 格式化货币
const formatCurrency = (value: number) => {
  return `¥${(value / 10000).toFixed(2)}万`
}

// 总体数据统计
const totalStats = computed(() => {
  const currentData = getCurrentTargetData()

  return {
    // 服务费目标
    serviceFeeTarget: currentData.serviceFeeTarget || 30000000, // 3000万
    serviceFeeTargetTrend: 15.2,

    // 新单单量
    newOrderVolume: currentData.newOrderActual || 156,
    newOrderVolumeTarget: currentData.newOrderTarget || 180,
    newOrderVolumeTrend: 12.8,

    // 服务费
    serviceFee: currentData.serviceFeeActual || 28500000, // 2850万
    serviceFeeTrend: 8.5,

    // 消费
    consumption: 18600000, // 1860万
    consumptionTrend: -3.2,

    // 返点
    singlePoint: 45,
    singlePointTrend: 0,

    // 毛利总计
    grossProfit: 9840000, // 984万
    grossProfitTrend: 18.7
  }
})



// 毛利数据
const profitData = {
  '2025': { totalProfit: 33312600, totalServiceFee: 24225000, totalRebate: 9087600, newCustomerProfit: 26650100, newCustomerServiceFee: 19380000, newCustomerRebate: 7270100, oldCustomerProfit: 6662500, oldCustomerServiceFee: 4845000, oldCustomerRebate: 1817500 },
  '2025-Q1': { totalProfit: 8328150, totalServiceFee: 6056250, totalRebate: 2271900, newCustomerProfit: 6662525, newCustomerServiceFee: 4845000, newCustomerRebate: 1817525, oldCustomerProfit: 1665625, oldCustomerServiceFee: 1211250, oldCustomerRebate: 454375 },
  '2025-Q2': { totalProfit: 8328150, totalServiceFee: 6056250, totalRebate: 2271900, newCustomerProfit: 6662525, newCustomerServiceFee: 4845000, newCustomerRebate: 1817525, oldCustomerProfit: 1665625, oldCustomerServiceFee: 1211250, oldCustomerRebate: 454375 },
  '2025-Q3': { totalProfit: 8328150, totalServiceFee: 6056250, totalRebate: 2271900, newCustomerProfit: 6662525, newCustomerServiceFee: 4845000, newCustomerRebate: 1817525, oldCustomerProfit: 1665625, oldCustomerServiceFee: 1211250, oldCustomerRebate: 454375 },
  '2025-Q4': { totalProfit: 8328150, totalServiceFee: 6056250, totalRebate: 2271900, newCustomerProfit: 6662525, newCustomerServiceFee: 4845000, newCustomerRebate: 1817525, oldCustomerProfit: 1665625, oldCustomerServiceFee: 1211250, oldCustomerRebate: 454375 }
}

// 当前毛利数据
const currentProfitData = computed(() => {
  return profitData[selectedProfitPeriod.value] || profitData['2025']
})

// 获取时间周期标签
const getTimePeriodLabel = (period: string) => {
  const labels = {
    '2025': '2025年',
    '2025-Q1': '2025年 Q1季度',
    '2025-Q2': '2025年 Q2季度',
    '2025-Q3': '2025年 Q3季度',
    '2025-Q4': '2025年 Q4季度',
    '2025-01': '2025年 1月',
    '2025-02': '2025年 2月',
    '2025-03': '2025年 3月',
    '2025-04': '2025年 4月',
    '2025-05': '2025年 5月',
    '2025-06': '2025年 6月',
    '2025-07': '2025年 7月',
    '2025-08': '2025年 8月',
    '2025-09': '2025年 9月',
    '2025-10': '2025年 10月',
    '2025-11': '2025年 11月',
    '2025-12': '2025年 12月'
  }
  return labels[period] || period
}

// 处理毛利周期变化
const handleProfitPeriodChange = () => {
  console.log('Profit period changed:', selectedProfitPeriod.value)
}

// 客户毛利明细统计数据
const customerDetailStats = computed(() => {
  // 模拟数据，实际应从表格数据计算
  return {
    totalCustomers: 25,
    newCustomers: 12,
    oldCustomers: 13,
    totalProfit: 98400000, // 9840万
    newCustomerProfit: 42500000, // 4250万
    oldCustomerProfit: 55900000, // 5590万
    totalServiceFee: 24225000, // 2422.5万
    newCustomerServiceFee: 10800000, // 1080万
    oldCustomerServiceFee: 13425000, // 1342.5万
    totalRebate: 9087600, // 908.76万
    newCustomerRebate: 4250000, // 425万
    oldCustomerRebate: 4837600, // 483.76万
    totalConsumption: 181650000, // 18165万
    newCustomerConsumption: 81000000, // 8100万
    oldCustomerConsumption: 100650000, // 10065万
  }
})

// 续费统计数据
const renewalStats = computed(() => {
  return {
    customerCount: 5,
    totalAmount: 32106000, // 3210.6万
  }
})

// 事件处理
const handleRoleChange = (role: string) => {
  currentRole.value = role
}

const handleTimeRangeChange = (value: string) => {
  selectedTimeRange.value = value
  console.log('Time range changed:', value)
}

const handleQuarterChange = (value: string) => {
  currentQuarter.value = value
  console.log('Quarter changed:', value)
}

// 初始化数据
const initializeData = () => {
  // 模拟年度季度目标数据
  annualQuarterlyTargets.value = {
    year: 2025,
    yearlyTarget: {
      serviceFeeTarget: 30000000,
      serviceFeeActual: 28500000,
      serviceFeeCompletion: 95.0,
      newOrderTarget: 180,
      newOrderActual: 156,
      newOrderCompletion: 86.7
    },
    quarters: [
      { quarter: 'Q1', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
      { quarter: 'Q2', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
      { quarter: 'Q3', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 },
      { quarter: 'Q4', serviceFeeTarget: 7500000, serviceFeeActual: 7125000, serviceFeeCompletion: 95.0, newOrderTarget: 45, newOrderActual: 39, newOrderCompletion: 86.7 }
    ]
  }
}

// 数据加载
const loadDashboardData = async () => {
  try {
    loading.value = true

    // 初始化数据
    initializeData()

    // 模拟API调用延迟
    await new Promise(resolve => setTimeout(resolve, 1000))

  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(async () => {
  await loadDashboardData()
})
</script>

<style scoped>
.sales-manager-dashboard {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.dashboard-subtitle {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #8c8c8c;
  font-size: 16px;
  margin: 0;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* 核心数据概览模块样式 */
.dashboard-section {
  margin-bottom: 32px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

/* 目标卡片样式 */
.target-cards-container {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.target-card {
  flex: 1;
  min-width: 200px;
  background: #f8fbff;
  border: none;
  border-radius: 12px;
  padding: 16px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.06);
}

.target-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
}

.target-card .card-icon {
  width: 36px;
  height: 36px;
  background: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  margin-bottom: 12px;
}

.target-card .card-content {
  position: relative;
}

.target-card .card-title {
  font-size: 13px;
  font-weight: 500;
  color: #262626;
  margin: 0 0 2px 0;
}

.target-card .card-period {
  font-size: 11px;
  color: #8c8c8c;
  margin: 0 0 8px 0;
}

.target-card .card-value {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 4px 0;
  line-height: 1.1;
  letter-spacing: -0.2px;
}

.target-card .card-subtitle {
  font-size: 11px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.target-card .completion-rate {
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  position: absolute;
  right: 12px;
  top: 12px;
}

.target-card .completion-rate.excellent {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.target-card .completion-rate.good {
  color: #1890ff;
  background: rgba(24, 144, 255, 0.1);
}

.target-card .completion-rate.poor {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

/* 服务费卡片特色样式 */
.service-fee-card {
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%);
}

.service-fee-card .card-icon {
  background: #1890ff;
}

/* 新单卡片特色样式 */
.new-order-card {
  background: linear-gradient(135deg, #f6ffed 0%, #f6ffed 100%);
}

.new-order-card .card-icon {
  background: #52c41a;
}

/* 综合完成率卡片特色样式 */
.completion-rate-card {
  background: linear-gradient(135deg, #fffbe6 0%, #fffbe6 100%);
}

.completion-rate-card .card-icon {
  background: #faad14;
}

/* 服务费卡片特色样式 */
.service-fee-card {
  background: linear-gradient(135deg, #e8f4fd 0%, #f0f9ff 100%);
}

.service-fee-card .card-icon {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

/* 新单卡片特色样式 */
.new-order-card {
  background: linear-gradient(135deg, #f6ffed 0%, #fcfff8 100%);
}

.new-order-card .card-icon {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

/* 综合完成率卡片特色样式 */
.completion-rate-card {
  background: linear-gradient(135deg, #fff7e6 0%, #fffcf5 100%);
}

.completion-rate-card .card-icon {
  background: linear-gradient(135deg, #faad14, #ffc53d);
}

.completion-rate-card .separator {
  color: #8c8c8c;
  margin-left: 8px;
}

/* 年度季度目标表格样式 */
.annual-quarterly-targets {
  margin-bottom: 0;
}

.targets-table-container {
  overflow-x: auto;
  background: transparent;
  border: none;
  border-radius: 0;
  margin-top: 20px;
}

.targets-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1200px;
  table-layout: fixed;
}

.targets-table th {
  background: #fafafa;
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.targets-table th:first-child {
  border-left: none;
}

.targets-table th:last-child {
  border-right: none;
}

/* 表格列宽度设置 */
.targets-table th:nth-child(1),
.targets-table td:nth-child(1) {
  width: 8%;
}

.targets-table th:nth-child(2),
.targets-table td:nth-child(2) {
  width: 10%;
}

.targets-table th:nth-child(3),
.targets-table td:nth-child(3),
.targets-table th:nth-child(4),
.targets-table td:nth-child(4),
.targets-table th:nth-child(5),
.targets-table td:nth-child(5),
.targets-table th:nth-child(6),
.targets-table td:nth-child(6) {
  width: 12%;
}

.targets-table th:nth-child(7),
.targets-table td:nth-child(7),
.targets-table th:nth-child(8),
.targets-table td:nth-child(8),
.targets-table th:nth-child(9),
.targets-table td:nth-child(9),
.targets-table th:nth-child(10),
.targets-table td:nth-child(10),
.targets-table th:nth-child(11),
.targets-table td:nth-child(11) {
  width: 8%;
}

.targets-table td {
  border-bottom: 1px solid #f0f0f0;
  border-right: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
}

.targets-table td:first-child {
  border-left: none;
}

.targets-table td:last-child {
  border-right: none;
}

.targets-table .year-row {
  background: #f9f9f9;
  font-weight: 500;
}

.targets-table .year-row td {
  color: #262626;
  font-weight: 500;
}

.targets-table .quarter-row:nth-child(even) {
  background: #fafafa;
}

.targets-table tr:last-child td {
  border-bottom: none;
}

/* 表格列头样式 */
.targets-table .service-fee-group-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.targets-table .order-count-group-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.targets-table .service-fee-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.targets-table .order-count-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.targets-table .service-fee-cell {
  background: #f0f8ff;
  color: #1890ff;
  font-weight: 500;
}

.targets-table .order-count-cell {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 500;
}

/* 核心指标概览表格 - 不同类型列的样式区分 */
.targets-table .target-group-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.targets-table .completion-group-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.targets-table .comparison-group-header {
  background: #fff7e6;
  color: #faad14;
  font-weight: 600;
}

.targets-table .baseline-group-header {
  background: #f0f0f0;
  color: #595959;
  font-weight: 600;
}

.targets-table .target-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.targets-table .completion-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.targets-table .comparison-header {
  background: #fff7e6;
  color: #faad14;
  font-weight: 600;
}

.targets-table .baseline-header {
  background: #f0f0f0;
  color: #595959;
  font-weight: 600;
}

.targets-table .target-cell {
  background: #f0f8ff;
  color: #1890ff;
  font-weight: 500;
}

.targets-table .completion-cell {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 500;
}

.targets-table .comparison-cell {
  background: #fffbf0;
  color: #faad14;
  font-weight: 500;
}

.targets-table .baseline-cell {
  background: #f9f9f9;
  color: #8c8c8c;
  font-weight: 500;
}

.targets-table .annual-row {
  background: #f9f9f9;
  font-weight: 500;
}

.targets-table .annual-row td {
  color: #262626;
  font-weight: 500;
}

.targets-table .quarterly-row {
  background: #fff;
}

.targets-table .quarterly-row:nth-child(even) {
  background: #fafafa;
}

.targets-table .quarterly-row:hover {
  background: #f0f8ff;
}



/* 总结卡片容器 */
.summary-cards-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin: 24px 0;
}

.summary-card {
  flex: 1;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.summary-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
}

.summary-card .card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  flex-shrink: 0;
}

.summary-card .card-content {
  flex: 1;
}

.summary-card .card-title {
  font-size: 13px;
  font-weight: 500;
  color: #8c8c8c;
  margin: 0 0 4px 0;
}

.summary-card .card-value {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  line-height: 1.2;
}

/* 新签客户毛利完成表格样式 */
.profit-analysis-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-top: 24px;
}

.profit-analysis-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  min-width: 2400px;
}

.profit-analysis-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.profit-analysis-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
  white-space: nowrap;
}

.profit-analysis-table .service-fee-group-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.profit-analysis-table .order-count-group-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.profit-analysis-table .service-fee-actual-group-header {
  background: #fff7e6;
  color: #faad14;
  font-weight: 600;
}

.profit-analysis-table .consumption-group-header {
  background: #fff2e8;
  color: #fa8c16;
  font-weight: 600;
}

.profit-analysis-table .rebate-group-header {
  background: #fff1f0;
  color: #ff4d4f;
  font-weight: 600;
}

.profit-analysis-table .profit-group-header {
  background: #f9f0ff;
  color: #722ed1;
  font-weight: 600;
}

.profit-analysis-table .service-fee-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.profit-analysis-table .order-count-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.profit-analysis-table .service-fee-actual-header {
  background: #fff7e6;
  color: #faad14;
  font-weight: 600;
}

.profit-analysis-table .consumption-header {
  background: #fff2e8;
  color: #fa8c16;
  font-weight: 600;
}

.profit-analysis-table .rebate-header {
  background: #fff1f0;
  color: #ff4d4f;
  font-weight: 600;
}

.profit-analysis-table .profit-header {
  background: #f9f0ff;
  color: #722ed1;
  font-weight: 600;
}

.profit-analysis-table .service-fee-cell {
  background: #f0f8ff;
  color: #1890ff;
  font-weight: 500;
}

.profit-analysis-table .order-count-cell {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 500;
}

.profit-analysis-table .service-fee-actual-cell {
  background: #fffbf0;
  color: #faad14;
  font-weight: 500;
}

.profit-analysis-table .consumption-cell {
  background: #fff8f0;
  color: #fa8c16;
  font-weight: 500;
}

.profit-analysis-table .rebate-cell {
  background: #fff7f6;
  color: #ff4d4f;
  font-weight: 500;
}

.profit-analysis-table .year-row {
  background: #f9f9f9;
  font-weight: 500;
}

.profit-analysis-table .year-row td {
  color: #262626;
  font-weight: 500;
}

.profit-analysis-table .quarter-row {
  background: #fff;
}

.profit-analysis-table .quarter-row:nth-child(even) {
  background: #fafafa;
}

.profit-analysis-table .quarter-row:hover {
  background: #f0f8ff;
}

/* 客户年度毛利完成表格样式 */
.customer-annual-profit-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-top: 24px;
}

.customer-annual-profit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 2400px;
}

.customer-annual-profit-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.customer-annual-profit-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
  white-space: nowrap;
}

.customer-annual-profit-table .service-fee-group-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.customer-annual-profit-table .service-fee-actual-group-header {
  background: #fff7e6;
  color: #faad14;
  font-weight: 600;
}

.customer-annual-profit-table .consumption-group-header {
  background: #f0f0f0;
  color: #595959;
  font-weight: 600;
}

.customer-annual-profit-table .rebate-group-header {
  background: #fff2f0;
  color: #ff4d4f;
  font-weight: 600;
}

.customer-annual-profit-table .profit-group-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.customer-annual-profit-table .service-fee-header {
  background: #f0f8ff;
  color: #1890ff;
  font-weight: 500;
  font-size: 12px;
}

.customer-annual-profit-table .service-fee-actual-header {
  background: #fffbf0;
  color: #faad14;
  font-weight: 500;
  font-size: 12px;
}

.customer-annual-profit-table .consumption-header {
  background: #f9f9f9;
  color: #8c8c8c;
  font-weight: 500;
  font-size: 12px;
}

.customer-annual-profit-table .rebate-header {
  background: #fffafa;
  color: #ff4d4f;
  font-weight: 500;
  font-size: 12px;
}

.customer-annual-profit-table .profit-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 500;
  font-size: 12px;
}

.customer-annual-profit-table .service-fee-cell {
  background: #f8fcff;
  color: #1890ff;
  font-weight: 500;
}

.customer-annual-profit-table .service-fee-actual-cell {
  background: #fffef8;
  color: #faad14;
  font-weight: 500;
}

.customer-annual-profit-table .consumption-cell {
  background: #fafafa;
  color: #8c8c8c;
  font-weight: 400;
}

.customer-annual-profit-table .rebate-cell {
  background: #fffafa;
  color: #ff4d4f;
  font-weight: 500;
}

.customer-annual-profit-table .customer-name-cell {
  background: #f0f8ff;
  color: #1890ff;
  font-weight: 600;
  text-align: left;
  padding-left: 12px;
}

.customer-annual-profit-table .customer-row:hover {
  background: #f0f8ff;
}

.customer-annual-profit-table .customer-row:hover td {
  background: #f0f8ff !important;
}

/* 员工总毛利完成表格样式 */
.employee-profit-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-top: 24px;
}

.employee-profit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1400px;
}

.employee-profit-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.employee-profit-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
}

.employee-profit-table .target-group-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.employee-profit-table .completion-group-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.employee-profit-table .comparison-group-header {
  background: #fff7e6;
  color: #faad14;
  font-weight: 600;
}

.employee-profit-table .target-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.employee-profit-table .completion-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.employee-profit-table .comparison-header {
  background: #fff7e6;
  color: #faad14;
  font-weight: 600;
}

.employee-profit-table .target-cell {
  background: #f0f8ff;
  color: #1890ff;
  font-weight: 500;
}

.employee-profit-table .completion-cell {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 500;
}

.employee-profit-table .comparison-cell {
  background: #fffbf0;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.excellent {
  color: #52c41a;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.good {
  color: #1890ff;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.average {
  color: #faad14;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.poor {
  color: #ff4d4f;
  font-weight: 600;
}

.employee-profit-table .year-row {
  background: #f9f9f9;
  font-weight: 500;
}

.employee-profit-table .year-row td {
  color: #262626;
  font-weight: 500;
}

.employee-profit-table .personnel-row {
  background: #fff;
}

.employee-profit-table .personnel-row:nth-child(even) {
  background: #fafafa;
}

.employee-profit-table .personnel-row:hover {
  background: #f0f8ff;
}

@media (max-width: 768px) {
  .sales-manager-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .dashboard-title {
    font-size: 20px;
  }

  .target-cards-container {
    flex-direction: column;
    gap: 16px;
  }

  .target-card {
    padding: 20px;
  }

  .target-card .card-value {
    font-size: 28px;
  }

  .summary-cards-container {
    grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  }

  .summary-card {
    padding: 20px;
  }

  .summary-card .card-icon {
    width: 56px;
    height: 56px;
  }
}

@media (max-width: 480px) {
  .summary-cards-container {
    grid-template-columns: 1fr;
  }
}

/* 时间筛选器样式 */
.time-filter-select {
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  font-size: 14px;
  color: #262626;
  background: #fff;
  cursor: pointer;
  min-width: 160px;
}

.time-filter-select:focus {
  outline: none;
  border-color: #1890ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.profit-filter {
  display: flex;
  align-items: center;
}

/* 毛利卡片样式 */
.profit-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 20px;
  margin-bottom: 32px;
}

.profit-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.profit-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.profit-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.profit-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.total-profit-card .profit-card-icon {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.service-fee-card .profit-card-icon {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.rebate-card .profit-card-icon {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
}

.profit-card-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.profit-period {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #8c8c8c;
}

.profit-card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.profit-value {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  line-height: 1;
}

.profit-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
}

.detail-label {
  color: #8c8c8c;
  font-weight: 500;
}

.detail-value {
  color: #262626;
  font-weight: 600;
}

/* 员工总毛利完成表格样式 */
.employee-profit-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.employee-profit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1400px;
}

.employee-profit-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.employee-profit-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
}

.employee-profit-table .target-group-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.employee-profit-table .completion-group-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.employee-profit-table .comparison-group-header {
  background: #fff7e6;
  color: #faad14;
  font-weight: 600;
}

.employee-profit-table .target-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.employee-profit-table .completion-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.employee-profit-table .comparison-header {
  background: #fff7e6;
  color: #faad14;
  font-weight: 600;
}

.employee-profit-table .target-cell {
  background: #f0f8ff;
  color: #1890ff;
  font-weight: 500;
}

.employee-profit-table .completion-cell {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 500;
}

.employee-profit-table .comparison-cell {
  background: #fffbf0;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.excellent {
  color: #52c41a;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.good {
  color: #1890ff;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.average {
  color: #faad14;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.poor {
  color: #ff4d4f;
  font-weight: 600;
}

.employee-profit-table .year-row {
  background: #f9f9f9;
  font-weight: 500;
}

.employee-profit-table .year-row td {
  color: #262626;
  font-weight: 500;
}

.employee-profit-table .personnel-row {
  background: #fff;
}

.employee-profit-table .personnel-row:nth-child(even) {
  background: #fafafa;
}

.employee-profit-table .personnel-row:hover {
  background: #f0f8ff;
}

/* 客户毛利明细模块样式 */
.summary-card .card-period {
  font-size: 11px;
  color: #8c8c8c;
  margin: 2px 0 4px 0;
}

.summary-card .card-completion {
  font-size: 11px;
  color: #8c8c8c;
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 4px;
}

.summary-card .completion-percentage {
  font-weight: 600;
  color: #262626;
}

.summary-card .separator {
  color: #d9d9d9;
}

.table-scroll-hint {
  text-align: center;
  padding: 8px 0;
  margin-top: 10px;
  background: #f0f8ff;
  border-radius: 4px;
  font-size: 12px;
  color: #1890ff;
  border: 1px solid #e6f7ff;
}

.customer-profit-detail-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-top: 16px;
}

.customer-profit-detail-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 12px;
  min-width: 1800px;
}

.customer-profit-detail-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.customer-profit-detail-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
  white-space: nowrap;
}

.customer-profit-detail-table .platform-group-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.customer-profit-detail-table .platform-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.customer-profit-detail-table .customer-status-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.customer-profit-detail-table .customer-name-cell {
  background: #f0f8ff;
  color: #1890ff;
  font-weight: 600;
  text-align: left;
  padding-left: 12px;
}

.customer-profit-detail-table .service-fee-cell {
  background: #f0f8ff;
  color: #1890ff;
  font-weight: 500;
}

.customer-profit-detail-table .rebate-cell {
  background: #fff7e6;
  color: #faad14;
  font-weight: 500;
}

.customer-profit-detail-table .consumption-cell {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 500;
}

.customer-profit-detail-table .platform-cell {
  background: #f9f9f9;
  color: #595959;
  font-weight: 500;
}

.customer-profit-detail-table .renewal-amount-cell {
  background: #fff2e8;
  color: #fa8c16;
  font-weight: 600;
}

.customer-profit-detail-table .status-active {
  color: #52c41a;
  font-weight: 600;
}

.customer-profit-detail-table .status-inactive {
  color: #ff4d4f;
  font-weight: 600;
}

.customer-profit-detail-table .customer-row:hover {
  background: #f0f8ff;
}

.customer-profit-detail-table .customer-row:hover td {
  background: #f0f8ff !important;
}

/* 续费客户名单模块样式 */
.customer-profit-detail-table .renewal-project-header {
  background: #fff7e6;
  color: #faad14;
  font-weight: 600;
}

.customer-profit-detail-table .renewal-amount-header {
  background: #fff2e8;
  color: #fa8c16;
  font-weight: 600;
}

.customer-profit-detail-table .renewal-project-cell {
  background: #fffbf0;
  color: #faad14;
  font-weight: 500;
}</style>
