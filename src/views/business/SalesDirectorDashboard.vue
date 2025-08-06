<template>
  <div class="sales-director-dashboard">
    <!-- 页面头部 -->
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">销售总监看板</h1>
        <p class="dashboard-subtitle">全面掌控销售业绩与团队表现</p>
      </div>

      <div class="dashboard-header__right">
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <p>正在加载数据...</p>
    </div>

    <!-- 主要内容 -->
    <div v-else class="dashboard-content">


        <!-- 核心指标概览 -->
    <div class="dashboard-section">
      <h2 class="section-title">核心指标概览</h2>

      <!-- 年度和季度目标表格 -->
      <div v-if="annualQuarterlyTargets" class="annual-quarterly-targets">
        <div class="targets-table-container">
          <table class="targets-table">
            <thead>
              <tr>
                <th rowspan="2">年度</th>
                <th rowspan="2">季度</th>
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
              <!-- 季度行 -->
              <tr v-for="quarter in annualQuarterlyTargets.quarters" :key="quarter.quarter" class="quarterly-row">
                <td>{{ quarter.quarter }}季度</td>
                <td class="target-cell">{{ formatCurrency(quarter.serviceFeeTarget) }}</td>
                <td class="target-cell">{{ quarter.newOrderTarget }}单</td>
                <td class="completion-cell">{{ formatCurrency(quarter.serviceFeeActual) }}</td>
                <td class="completion-cell">{{ quarter.newOrderActual }}单</td>
                <td class="comparison-cell" :class="getCompletionClass(quarter.serviceFeeCompletion)">{{ quarter.serviceFeeCompletion }}%</td>
                <td class="comparison-cell" :class="getCompletionClass(quarter.newOrderCompletion)">{{ quarter.newOrderCompletion }}%</td>
                <td class="baseline-cell">{{ quarter.serviceFeeCompletion }}%</td>
                <td class="baseline-cell">{{ quarter.serviceFeeCompletion }}%</td>
                <td class="baseline-cell">{{ quarter.newOrderCompletion }}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 新单服务费及单量完成模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">年度新单服务费及单量完成</h2>

      <div class="new-order-completion-table-container">
        <table class="new-order-completion-table">
          <thead>
            <tr>
              <th rowspan="2" class="year-header">年度</th>
              <th rowspan="2" class="quarter-header">季度</th>
              <th colspan="5" class="service-fee-header">新单服务费（2025年）</th>
              <th colspan="5" class="order-count-header">新单单量</th>
            </tr>
            <tr>
              <th class="service-fee-platform-header">Google</th>
              <th class="service-fee-platform-header">Meta</th>
              <th class="service-fee-platform-header">Criteo</th>
              <th class="service-fee-platform-header">Bing</th>
              <th class="service-fee-platform-header">内容营销及其它</th>
              <th class="order-count-platform-header">Google</th>
              <th class="order-count-platform-header">Meta</th>
              <th class="order-count-platform-header">Criteo</th>
              <th class="order-count-platform-header">Bing</th>
              <th class="order-count-platform-header">内容营销及其它</th>
            </tr>
          </thead>
          <tbody>
            <tr class="year-row">
              <td rowspan="5">2025年</td>
              <td>2025年</td>
              <td class="service-fee-cell">¥1,200.00万</td>
              <td class="service-fee-cell">¥850.00万</td>
              <td class="service-fee-cell">¥320.00万</td>
              <td class="service-fee-cell">¥180.00万</td>
              <td class="service-fee-cell">¥150.00万</td>
              <td class="order-count-cell">720单</td>
              <td class="order-count-cell">510单</td>
              <td class="order-count-cell">192单</td>
              <td class="order-count-cell">108单</td>
              <td class="order-count-cell">90单</td>
            </tr>
            <tr class="quarter-row">
              <td>Q1季度</td>
              <td class="service-fee-cell">¥280.00万</td>
              <td class="service-fee-cell">¥195.00万</td>
              <td class="service-fee-cell">¥75.00万</td>
              <td class="service-fee-cell">¥42.00万</td>
              <td class="service-fee-cell">¥35.00万</td>
              <td class="order-count-cell">168单</td>
              <td class="order-count-cell">117单</td>
              <td class="order-count-cell">45单</td>
              <td class="order-count-cell">25单</td>
              <td class="order-count-cell">21单</td>
            </tr>
            <tr class="quarter-row">
              <td>Q2季度</td>
              <td class="service-fee-cell">¥320.00万</td>
              <td class="service-fee-cell">¥225.00万</td>
              <td class="service-fee-cell">¥85.00万</td>
              <td class="service-fee-cell">¥48.00万</td>
              <td class="service-fee-cell">¥40.00万</td>
              <td class="order-count-cell">192单</td>
              <td class="order-count-cell">135单</td>
              <td class="order-count-cell">51单</td>
              <td class="order-count-cell">29单</td>
              <td class="order-count-cell">24单</td>
            </tr>
            <tr class="quarter-row">
              <td>Q3季度</td>
              <td class="service-fee-cell">¥350.00万</td>
              <td class="service-fee-cell">¥245.00万</td>
              <td class="service-fee-cell">¥95.00万</td>
              <td class="service-fee-cell">¥53.00万</td>
              <td class="service-fee-cell">¥44.00万</td>
              <td class="order-count-cell">210单</td>
              <td class="order-count-cell">147单</td>
              <td class="order-count-cell">57单</td>
              <td class="order-count-cell">32单</td>
              <td class="order-count-cell">26单</td>
            </tr>
            <tr class="quarter-row">
              <td>Q4季度</td>
              <td class="service-fee-cell">¥250.00万</td>
              <td class="service-fee-cell">¥185.00万</td>
              <td class="service-fee-cell">¥65.00万</td>
              <td class="service-fee-cell">¥37.00万</td>
              <td class="service-fee-cell">¥31.00万</td>
              <td class="order-count-cell">150单</td>
              <td class="order-count-cell">111单</td>
              <td class="order-count-cell">39单</td>
              <td class="order-count-cell">22单</td>
              <td class="order-count-cell">19单</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>



    <!-- 新签客户毛利完成模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">新签客户毛利完成</h2>
      <div class="profit-analysis-table-container">
        <table class="profit-analysis-table">
          <thead>
            <tr>
              <th rowspan="2">年度</th>
              <th rowspan="2">季度</th>
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
              <td class="profit-cell">¥1567.50万</td>
              <td class="profit-cell">¥1110.63万</td>
              <td class="profit-cell">¥418.00万</td>
              <td class="profit-cell">¥235.13万</td>
            </tr>
            <tr class="quarter-row">
              <td>Q1季度</td>
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
              <td class="profit-cell">¥365.75万</td>
              <td class="profit-cell">¥254.72万</td>
              <td class="profit-cell">¥97.88万</td>
              <td class="profit-cell">¥54.86万</td>
            </tr>
            <tr class="quarter-row">
              <td>Q2季度</td>
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
              <td class="profit-cell">¥418.00万</td>
              <td class="profit-cell">¥293.44万</td>
              <td class="profit-cell">¥111.13万</td>
              <td class="profit-cell">¥62.70万</td>
            </tr>
            <tr class="quarter-row">
              <td>Q3季度</td>
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
              <td class="profit-cell">¥457.13万</td>
              <td class="profit-cell">¥319.91万</td>
              <td class="profit-cell">¥123.44万</td>
              <td class="profit-cell">¥69.04万</td>
            </tr>
            <tr class="quarter-row">
              <td>Q4季度</td>
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
              <td class="profit-cell">¥326.63万</td>
              <td class="profit-cell">¥242.56万</td>
              <td class="profit-cell">¥85.56万</td>
              <td class="profit-cell">¥48.52万</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 所有客户2025年毛利完成模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">所有客户2025年毛利完成</h2>
      <div class="profit-summary-grid">
        <div class="profit-summary-card">
          <div class="profit-summary-icon">
            <DollarSign :size="24" />
          </div>
          <div class="profit-summary-content">
            <div class="profit-summary-label">总毛利</div>
            <div class="profit-summary-value">{{ formatCurrency(profitSummary?.totalProfit || 0) }}</div>
            <div class="profit-summary-progress">
              <div class="progress-bar">
                <div
                  class="progress-fill"
                  :style="{ width: `${profitSummary?.completionRate || 0}%` }"
                ></div>
              </div>
              <span class="progress-text">{{ profitSummary?.completionRate || 0 }}%</span>
            </div>
          </div>
        </div>

        <div class="profit-summary-card">
          <div class="profit-summary-icon">
            <TrendingUp :size="24" />
          </div>
          <div class="profit-summary-content">
            <div class="profit-summary-label">同比增长</div>
            <div class="profit-summary-value positive">+{{ profitSummary?.yearOverYearGrowth || 0 }}%</div>
            <div class="profit-summary-meta">毛利率: {{ profitSummary?.profitMargin || 0 }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 流失客户分析模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">流失客户分析</h2>
      <div class="churn-analysis-grid">
        <div
          v-for="churn in churnAnalysis"
          :key="churn.category"
          class="churn-analysis-card"
          :class="`risk-${churn.riskLevel}`"
        >
          <div class="churn-card-header">
            <h4>{{ getChurnCategoryName(churn.category) }}</h4>
            <span class="risk-badge" :class="`risk-badge--${churn.riskLevel}`">
              {{ getRiskLevelText(churn.riskLevel) }}
            </span>
          </div>

          <div class="churn-metrics">
            <div class="churn-metric">
              <span class="metric-label">流失客户</span>
              <span class="metric-value">{{ churn.customerCount }}家</span>
            </div>
            <div class="churn-metric">
              <span class="metric-label">预估损失毛利</span>
              <span class="metric-value danger">{{ formatCurrency(churn.estimatedProfitLoss) }}</span>
            </div>
            <div class="churn-metric">
              <span class="metric-label">流失率</span>
              <span class="metric-value">{{ churn.churnRate }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 销售完成情况模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">销售完成情况</h2>
      <div class="sales-performance-table-container">
        <table class="sales-performance-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>姓名</th>
              <th>部门</th>
              <th>总服务费</th>
              <th>总毛利</th>
              <th>目标完成率</th>
              <th>客户数</th>
              <th>环比增长</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="person in salesPerformance" :key="person.id">
              <td class="rank-cell">
                <div class="rank-badge" :class="`rank-${person.rank}`">
                  {{ person.rank }}
                </div>
              </td>
              <td class="name-cell">{{ person.name }}</td>
              <td>{{ person.department }}</td>
              <td>{{ formatCurrency(person.totalServiceFee) }}</td>
              <td>{{ formatCurrency(person.totalProfit) }}</td>
              <td>
                <div class="completion-rate" :class="getCompletionRateClass(person.targetCompletion)">
                  {{ person.targetCompletion }}%
                </div>
              </td>
              <td>{{ person.customerCount }}家</td>
              <td>
                <div class="growth-rate" :class="person.lastMonthGrowth >= 0 ? 'positive' : 'negative'">
                  {{ person.lastMonthGrowth >= 0 ? '+' : '' }}{{ person.lastMonthGrowth }}%
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 续费客户名单模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">续费客户名单</h2>
      <div class="renewal-customers-container">
        <div class="renewal-summary">
          <div class="renewal-stat">
            <span class="stat-label">待续费客户</span>
            <span class="stat-value">{{ renewalCustomers.length }}家</span>
          </div>
          <div class="renewal-stat">
            <span class="stat-label">预估续费金额</span>
            <span class="stat-value">{{ formatCurrency(getTotalRenewalValue()) }}</span>
          </div>
        </div>

        <div class="renewal-customers-list">
          <div
            v-for="customer in renewalCustomers"
            :key="customer.id"
            class="renewal-customer-card"
            :class="`priority-${customer.priority}`"
          >
            <div class="customer-info">
              <h4 class="customer-name">{{ customer.customerName }}</h4>
              <div class="customer-meta">
                <span class="sales-person">负责人: {{ customer.salesPerson }}</span>
                <span class="contract-end">到期: {{ customer.contractEndDate }}</span>
              </div>
            </div>

            <div class="renewal-details">
              <div class="renewal-value">
                <span class="label">预估金额</span>
                <span class="value">{{ formatCurrency(customer.estimatedRenewalValue) }}</span>
              </div>
              <div class="renewal-probability">
                <span class="label">续费概率</span>
                <span class="value">{{ customer.renewalProbability }}%</span>
              </div>
            </div>

            <div class="renewal-status">
              <span class="status-badge" :class="`status-${customer.renewalStatus}`">
                {{ getRenewalStatusText(customer.renewalStatus) }}
              </span>
              <span class="priority-badge" :class="`priority-${customer.priority}`">
                {{ getPriorityText(customer.priority) }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { DollarSign, TrendingUp } from 'lucide-vue-next'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'

import MetricCard from '@/components/business/MetricCard.vue'
import QuarterSelector from '@/components/business/QuarterSelector.vue'
import TargetComparisonCard from '@/components/business/TargetComparisonCard.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'
import type {
  Quarter,
  BusinessRole,
  MetricCardProps,
  TargetComparison,
  AnnualQuarterlyTargets,
  PlatformData,
  CustomerProfitData,
  ProfitSummaryData,
  ChurnData,
  SalesPersonPerformance,
  RenewalCustomerData
} from '@/types'
import { businessAPI } from '@/mock/business'

// 状态
const currentRole = ref('sales_director')
const availableRoles = ref<BusinessRole[]>([])

const selectedQuarter = ref<Quarter>()
const coreMetrics = ref<MetricCardProps[]>([])
const targetComparisons = ref<TargetComparison[]>([])
const annualQuarterlyTargets = ref<AnnualQuarterlyTargets>()
const platformData = ref<PlatformData[]>([])
const customerProfitData = ref<CustomerProfitData>()
const profitSummary = ref<ProfitSummaryData>()
const churnAnalysis = ref<ChurnData[]>([])
const salesPerformance = ref<SalesPersonPerformance[]>([])
const renewalCustomers = ref<RenewalCustomerData[]>([])
const loading = ref(true)

// 计算属性
const platformSummary = computed(() => {
  const totalServiceFee = platformData.value.reduce((sum, p) => sum + p.serviceFee, 0)
  const totalOrders = platformData.value.reduce((sum, p) => sum + p.orderCount, 0)
  return { totalServiceFee, totalOrders }
})

const platformChartData = computed(() =>
  platformData.value.map(p => ({
    name: p.platform,
    value: p.serviceFee,
    color: p.color
  }))
)

const platformBarChartData = computed(() => ({
  labels: platformData.value.map(p => p.platform),
  datasets: [{
    label: '单量',
    data: platformData.value.map(p => p.orderCount),
    color: '#1890ff'
  }]
}))

// 方法
const handleRoleChange = (role: string) => {
  currentRole.value = role
  // 这里可以添加角色切换后的数据重新加载逻辑
  console.log('角色切换至:', role)
}



const handleQuarterChange = (quarter: Quarter) => {
  selectedQuarter.value = quarter
  console.log('季度变更:', quarter)
  // 重新加载季度数据
}

const formatCurrency = (value: number): string => {
  if (value >= 100000000) {
    return `¥${(value / 100000000).toFixed(2)}亿`
  } else if (value >= 10000) {
    return `¥${(value / 10000).toFixed(2)}万`
  } else {
    return `¥${value.toLocaleString()}`
  }
}

const getPlatformName = (key: string): string => {
  const names: Record<string, string> = {
    google: 'Google',
    meta: 'Meta',
    criteo: 'Criteo',
    bing: 'Bing',
    total: '合计'
  }
  return names[key] || key
}

const getChurnCategoryName = (category: string): string => {
  const names: Record<string, string> = {
    total: '总流失客户',
    new_customer: '新客户流失',
    old_customer: '老客户流失'
  }
  return names[category] || category
}

const getRiskLevelText = (level: string): string => {
  const texts: Record<string, string> = {
    high: '高风险',
    medium: '中风险',
    low: '低风险'
  }
  return texts[level] || level
}

const getCompletionRateClass = (rate: number): string => {
  if (rate >= 95) return 'excellent'
  if (rate >= 85) return 'good'
  if (rate >= 70) return 'average'
  return 'poor'
}

const getRenewalStatusText = (status: string): string => {
  const texts: Record<string, string> = {
    pending: '待联系',
    contacted: '已联系',
    negotiating: '协商中',
    confirmed: '已确认',
    declined: '已拒绝'
  }
  return texts[status] || status
}

const getPriorityText = (priority: string): string => {
  const texts: Record<string, string> = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return texts[priority] || priority
}

const getTotalRenewalValue = (): number => {
  return renewalCustomers.value.reduce((sum, customer) => sum + customer.estimatedRenewalValue, 0)
}

const getCompletionClass = (rate: number): string => {
  if (rate >= 95) return 'excellent'
  if (rate >= 85) return 'good'
  if (rate >= 70) return 'average'
  return 'poor'
}

// 生命周期
onMounted(async () => {
  // 加载数据
  try {
    const [
      rolesData,
      metricsData,
      targetData,
      annualTargetsData,
      platformDistData,
      profitData,
      profitSummaryData,
      churnData,
      salesPerfData,
      renewalData
    ] = await Promise.all([
      businessAPI.getRoles(),
      businessAPI.getSalesDirectorMetrics(),
      businessAPI.getTargetComparison(),
      businessAPI.getAnnualQuarterlyTargets(),
      businessAPI.getPlatformDistribution(),
      businessAPI.getCustomerProfitData(),
      businessAPI.getProfitSummary(),
      businessAPI.getChurnData(),
      businessAPI.getSalesPersonPerformance(),
      businessAPI.getRenewalCustomerData()
    ])

    availableRoles.value = rolesData
    coreMetrics.value = metricsData
    targetComparisons.value = targetData
    annualQuarterlyTargets.value = annualTargetsData
    platformData.value = platformDistData
    customerProfitData.value = profitData
    profitSummary.value = profitSummaryData
    churnAnalysis.value = churnData
    salesPerformance.value = salesPerfData
    renewalCustomers.value = renewalData
  } catch (error) {
    console.error('数据加载失败:', error)
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.sales-director-dashboard {
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



.dashboard-section {
  margin-bottom: 32px;
  background: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.target-comparison-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
}

.annual-quarterly-targets {
  margin-bottom: 24px;
}

.targets-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
}

.targets-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1200px;
}

.targets-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.targets-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
}

.targets-table .annual-row {
  background: #f9f9f9;
  font-weight: 500;
}

.targets-table .annual-row td {
  color: #262626;
  font-weight: 500;
}

.targets-table .quarterly-row:nth-child(even) {
  background: #fafafa;
}

.targets-table .excellent {
  color: #52c41a;
  font-weight: 600;
}

.targets-table .good {
  color: #1890ff;
  font-weight: 600;
}

.targets-table .average {
  color: #faad14;
  font-weight: 600;
}

.targets-table .poor {
  color: #ff4d4f;
  font-weight: 600;
}

/* 新单服务费及单量完成表格样式 - 与核心指标概览一致 */
.new-order-completion-table-container {
  overflow-x: auto;
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-top: 20px;
}

.new-order-completion-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1200px;
}

.new-order-completion-table th {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
}

.new-order-completion-table td {
  border: 1px solid #f0f0f0;
  padding: 10px 8px;
  text-align: center;
  color: #595959;
}

.new-order-completion-table .year-row {
  background: #f9f9f9;
  font-weight: 500;
}

.new-order-completion-table .year-row td {
  color: #262626;
  font-weight: 500;
}

.new-order-completion-table .quarter-row:nth-child(even) {
  background: #fafafa;
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
  font-weight: 600;
}

.targets-table .baseline-cell {
  background: #f9f9f9;
  color: #8c8c8c;
  font-weight: 400;
}

/* 新单服务费及单量完成表格 - 不同类型列的样式区分 */
.new-order-completion-table .service-fee-header {
  background: #e6f7ff;
  color: #1890ff;
  font-weight: 600;
}

.new-order-completion-table .order-count-header {
  background: #f6ffed;
  color: #52c41a;
  font-weight: 600;
}

.new-order-completion-table .service-fee-platform-header {
  background: #f0f8ff;
  color: #1890ff;
  font-weight: 500;
  font-size: 12px;
}

.new-order-completion-table .order-count-platform-header {
  background: #f0fff0;
  color: #52c41a;
  font-weight: 500;
  font-size: 12px;
}

.new-order-completion-table .service-fee-cell {
  background: #f8fcff;
  color: #1890ff;
  font-weight: 500;
}

.new-order-completion-table .order-count-cell {
  background: #f8fff8;
  color: #52c41a;
  font-weight: 500;
}

.platform-analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 24px;
}

.platform-summary-card {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.platform-summary-card h3 {
  margin: 0 0 8px 0;
  font-size: 16px;
  color: #595959;
}

.summary-value {
  font-size: 24px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 16px;
}

.profit-analysis-table-container {
  overflow-x: auto !important;
  background: #fff !important;
  border: 1px solid #f0f0f0 !important;
  border-radius: 6px !important;
}

.profit-analysis-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 2400px;
}

.profit-analysis-table th {
  background: #fafafa !important;
  border: 1px solid #f0f0f0 !important;
  padding: 12px 8px !important;
  text-align: center !important;
  font-weight: 600 !important;
  color: #262626 !important;
  white-space: nowrap !important;
}

.profit-analysis-table td {
  border: 1px solid #f0f0f0 !important;
  padding: 10px 8px !important;
  text-align: center !important;
  color: #595959 !important;
}

.profit-analysis-table .platform-name {
  text-align: left;
  font-weight: 500;
  color: #262626;
}

.profit-analysis-table .profit-value {
  color: #52c41a;
  font-weight: 600;
}

/* 新签客户毛利完成表格 - 平台特定样式 */
.profit-analysis-table .google-header,
.profit-analysis-table .google-cell {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 500;
}

.profit-analysis-table .meta-header,
.profit-analysis-table .meta-cell {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 500;
}

.profit-analysis-table .criteo-header,
.profit-analysis-table .criteo-cell {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 500;
}

.profit-analysis-table .bing-header,
.profit-analysis-table .bing-cell {
  background: #f0f0f0 !important;
  color: #595959 !important;
  font-weight: 500;
}

.profit-analysis-table .total-row {
  background: #f9f9f9 !important;
  font-weight: 600;
}

.profit-analysis-table .total-row td {
  background: #f9f9f9 !important;
  color: #262626 !important;
  font-weight: 600;
}

/* 新签客户毛利完成表格 - 组标题样式 */
.profit-analysis-table .service-fee-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.profit-analysis-table .order-count-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.profit-analysis-table .service-fee-actual-group-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.profit-analysis-table .consumption-group-header {
  background: #f0f0f0 !important;
  color: #595959 !important;
  font-weight: 600;
}

.profit-analysis-table .rebate-group-header {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
  font-weight: 600;
}

.profit-analysis-table .profit-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

/* 新签客户毛利完成表格 - 子标题样式 */
.profit-analysis-table .service-fee-header {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
  font-size: 12px;
}

.profit-analysis-table .order-count-header {
  background: #f0fff0 !important;
  color: #52c41a !important;
  font-weight: 500;
  font-size: 12px;
}

.profit-analysis-table .service-fee-actual-header {
  background: #fffbf0 !important;
  color: #faad14 !important;
  font-weight: 500;
  font-size: 12px;
}

.profit-analysis-table .consumption-header {
  background: #f9f9f9 !important;
  color: #8c8c8c !important;
  font-weight: 500;
  font-size: 12px;
}

.profit-analysis-table .rebate-header {
  background: #fff8f8 !important;
  color: #ff4d4f !important;
  font-weight: 500;
  font-size: 12px;
}

.profit-analysis-table .profit-header {
  background: #f0fff0 !important;
  color: #52c41a !important;
  font-weight: 500;
  font-size: 12px;
}

/* 新签客户毛利完成表格 - 数据单元格样式 */
.profit-analysis-table .service-fee-cell {
  background: #f8fcff !important;
  color: #1890ff !important;
  font-weight: 500;
}

.profit-analysis-table .order-count-cell {
  background: #f8fff8 !important;
  color: #52c41a !important;
  font-weight: 500;
}

.profit-analysis-table .service-fee-actual-cell {
  background: #fffef8 !important;
  color: #faad14 !important;
  font-weight: 500;
}

.profit-analysis-table .consumption-cell {
  background: #fafafa !important;
  color: #8c8c8c !important;
  font-weight: 400;
}

.profit-analysis-table .rebate-cell {
  background: #fffafa !important;
  color: #ff4d4f !important;
  font-weight: 500;
}

.profit-analysis-table .profit-cell {
  background: #f8fff8 !important;
  color: #52c41a !important;
  font-weight: 600;
}

/* 年度和季度行样式 */
.profit-analysis-table .year-row {
  background: #f9f9f9 !important;
  font-weight: 500;
}

.profit-analysis-table .year-row td {
  color: #262626 !important;
  font-weight: 500;
}

.profit-analysis-table .quarter-row:nth-child(even) {
  background: #fafafa !important;
}

.profit-summary-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.profit-summary-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
}

.profit-summary-icon {
  width: 48px;
  height: 48px;
  background: #1890ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.profit-summary-content {
  flex: 1;
}

.profit-summary-label {
  font-size: 13px;
  color: #8c8c8c;
  margin-bottom: 4px;
}

.profit-summary-value {
  font-size: 20px;
  font-weight: 700;
  color: #262626;
  margin-bottom: 8px;
}

.profit-summary-value.positive {
  color: #52c41a;
}

.profit-summary-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #52c41a;
  border-radius: 3px;
}

.progress-text {
  font-size: 12px;
  color: #595959;
  font-weight: 500;
}

.profit-summary-meta {
  font-size: 12px;
  color: #8c8c8c;
}

.churn-analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}

.churn-analysis-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}

.churn-analysis-card.risk-high {
  border-left: 4px solid #ff4d4f;
}

.churn-analysis-card.risk-medium {
  border-left: 4px solid #faad14;
}

.churn-analysis-card.risk-low {
  border-left: 4px solid #52c41a;
}

.churn-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.churn-card-header h4 {
  margin: 0;
  font-size: 16px;
  color: #262626;
}

.risk-badge {
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.risk-badge--high {
  background: #fff2f0;
  color: #ff4d4f;
}

.risk-badge--medium {
  background: #fff7e6;
  color: #faad14;
}

.risk-badge--low {
  background: #f6ffed;
  color: #52c41a;
}

.churn-metrics {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.churn-metric {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-label {
  font-size: 13px;
  color: #8c8c8c;
}

.metric-value {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.metric-value.danger {
  color: #ff4d4f;
}

.sales-performance-table-container {
  overflow-x: auto;
}

.sales-performance-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.sales-performance-table th,
.sales-performance-table td {
  padding: 12px 8px;
  text-align: center;
  border-bottom: 1px solid #f0f0f0;
}

.sales-performance-table th {
  background: #fafafa;
  font-weight: 600;
  color: #262626;
}

.rank-cell {
  text-align: center;
}

.rank-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.rank-badge.rank-1 {
  background: #ffd700;
  color: #262626;
}

.rank-badge.rank-2 {
  background: #c0c0c0;
  color: #262626;
}

.rank-badge.rank-3 {
  background: #cd7f32;
}

.rank-badge:not(.rank-1):not(.rank-2):not(.rank-3) {
  background: #d9d9d9;
  color: #262626;
}

.name-cell {
  text-align: left;
  font-weight: 500;
}

.completion-rate {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.completion-rate.excellent {
  background: #f6ffed;
  color: #52c41a;
}

.completion-rate.good {
  background: #e6f7ff;
  color: #1890ff;
}

.completion-rate.average {
  background: #fff7e6;
  color: #faad14;
}

.completion-rate.poor {
  background: #fff2f0;
  color: #ff4d4f;
}

.growth-rate.positive {
  color: #52c41a;
}

.growth-rate.negative {
  color: #ff4d4f;
}

.renewal-customers-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.renewal-summary {
  display: flex;
  gap: 40px;
  padding: 16px;
  background: #fafafa;
  border-radius: 6px;
}

.renewal-stat {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #8c8c8c;
}

.stat-value {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.renewal-customers-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 16px;
}

.renewal-customer-card {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px;
  background: #fff;
}

.renewal-customer-card.priority-high {
  border-left: 4px solid #ff4d4f;
}

.renewal-customer-card.priority-medium {
  border-left: 4px solid #faad14;
}

.renewal-customer-card.priority-low {
  border-left: 4px solid #52c41a;
}

.customer-info {
  margin-bottom: 12px;
}

.customer-name {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.customer-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #8c8c8c;
}

.renewal-details {
  display: flex;
  justify-content: space-between;
  margin-bottom: 12px;
}

.renewal-details .label {
  font-size: 12px;
  color: #8c8c8c;
  display: block;
}

.renewal-details .value {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
}

.renewal-status {
  display: flex;
  gap: 8px;
}

.status-badge,
.priority-badge {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 500;
}

.status-badge.status-pending {
  background: #f5f5f5;
  color: #8c8c8c;
}

.status-badge.status-contacted {
  background: #e6f7ff;
  color: #1890ff;
}

.status-badge.status-negotiating {
  background: #fff7e6;
  color: #faad14;
}

.status-badge.status-confirmed {
  background: #f6ffed;
  color: #52c41a;
}

.status-badge.status-declined {
  background: #fff2f0;
  color: #ff4d4f;
}

.priority-badge.priority-high {
  background: #fff2f0;
  color: #ff4d4f;
}

.priority-badge.priority-medium {
  background: #fff7e6;
  color: #faad14;
}

.priority-badge.priority-low {
  background: #f6ffed;
  color: #52c41a;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .metrics-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .target-comparison-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .sales-director-dashboard {
    padding: 16px;
  }

  .dashboard-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .platform-analysis-grid {
    grid-template-columns: 1fr;
  }

  .profit-summary-grid {
    grid-template-columns: 1fr;
  }

  .churn-analysis-grid {
    grid-template-columns: 1fr;
  }

  .renewal-customers-list {
    grid-template-columns: 1fr;
  }

  .renewal-summary {
    flex-direction: column;
    gap: 12px;
  }
}

/* 加载状态 */
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f0f0f0;
  border-top: 3px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-container p {
  color: #8c8c8c;
  margin: 0;
}
</style>
