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

    <!-- 客户年度毛利完成模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">客户年度毛利完成</h2>
      <div class="customer-annual-profit-table-container">
        <table class="customer-annual-profit-table">
          <thead>
            <tr>
              <th rowspan="2">客户名称</th>
              <th rowspan="2">年度</th>
              <th colspan="4" class="service-fee-group-header">服务费目标</th>
              <th colspan="4" class="service-fee-actual-group-header">服务费完成</th>
              <th colspan="4" class="consumption-group-header">消费</th>
              <th colspan="4" class="rebate-group-header">返点</th>
              <th colspan="4" class="profit-group-header">毛利</th>
              <th rowspan="2" class="completion-rate-header">完成率</th>
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
              <td>2025年</td>
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
              <td class="profit-cell">¥235.13万</td>
              <td class="profit-cell">¥156.75万</td>
              <td class="profit-cell">¥65.31万</td>
              <td class="profit-cell">¥39.19万</td>
              <td class="completion-rate-cell excellent">95.0%</td>
            </tr>
            <tr class="customer-row">
              <td rowspan="1" class="customer-name-cell">小米科技有限公司</td>
              <td>2025年</td>
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
              <td class="profit-cell">¥185.63万</td>
              <td class="profit-cell">¥123.75万</td>
              <td class="profit-cell">¥49.50万</td>
              <td class="profit-cell">¥30.94万</td>
              <td class="completion-rate-cell good">90.0%</td>
            </tr>
            <tr class="customer-row">
              <td rowspan="1" class="customer-name-cell">OPPO广东移动通信有限公司</td>
              <td>2025年</td>
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
              <td class="profit-cell">¥132.00万</td>
              <td class="profit-cell">¥88.00万</td>
              <td class="profit-cell">¥33.00万</td>
              <td class="profit-cell">¥22.00万</td>
              <td class="completion-rate-cell average">80.0%</td>
            </tr>
            <tr class="customer-row">
              <td rowspan="1" class="customer-name-cell">vivo通信科技有限公司</td>
              <td>2025年</td>
              <td class="service-fee-cell">¥100.00万</td>
              <td class="service-fee-cell">¥70.00万</td>
              <td class="service-fee-cell">¥25.00万</td>
              <td class="service-fee-cell">¥15.00万</td>
              <td class="service-fee-actual-cell">¥65.00万</td>
              <td class="service-fee-actual-cell">¥45.50万</td>
              <td class="service-fee-actual-cell">¥16.25万</td>
              <td class="service-fee-actual-cell">¥9.75万</td>
              <td class="consumption-cell">¥487.50万</td>
              <td class="consumption-cell">¥341.25万</td>
              <td class="consumption-cell">¥121.88万</td>
              <td class="consumption-cell">¥73.13万</td>
              <td class="rebate-cell">¥24.38万</td>
              <td class="rebate-cell">¥17.06万</td>
              <td class="rebate-cell">¥6.09万</td>
              <td class="rebate-cell">¥3.66万</td>
              <td class="profit-cell">¥89.38万</td>
              <td class="profit-cell">¥62.56万</td>
              <td class="profit-cell">¥22.34万</td>
              <td class="profit-cell">¥13.41万</td>
              <td class="completion-rate-cell poor">65.0%</td>
            </tr>
            <tr class="customer-row">
              <td rowspan="1" class="customer-name-cell">一加科技（深圳）有限公司</td>
              <td>2025年</td>
              <td class="service-fee-cell">¥80.00万</td>
              <td class="service-fee-cell">¥55.00万</td>
              <td class="service-fee-cell">¥20.00万</td>
              <td class="service-fee-cell">¥12.00万</td>
              <td class="service-fee-actual-cell">¥76.00万</td>
              <td class="service-fee-actual-cell">¥52.25万</td>
              <td class="service-fee-actual-cell">¥19.00万</td>
              <td class="service-fee-actual-cell">¥11.40万</td>
              <td class="consumption-cell">¥570.00万</td>
              <td class="consumption-cell">¥391.88万</td>
              <td class="consumption-cell">¥142.50万</td>
              <td class="consumption-cell">¥85.50万</td>
              <td class="rebate-cell">¥28.50万</td>
              <td class="rebate-cell">¥19.59万</td>
              <td class="rebate-cell">¥7.13万</td>
              <td class="rebate-cell">¥4.28万</td>
              <td class="profit-cell">¥104.50万</td>
              <td class="profit-cell">¥71.84万</td>
              <td class="profit-cell">¥26.13万</td>
              <td class="profit-cell">¥15.68万</td>
              <td class="completion-rate-cell excellent">95.0%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 年度流失客户模块 -->
    <div class="dashboard-section">
      <h2 class="section-title">年度流失客户</h2>
      <div class="annual-churn-table-container">
        <table class="annual-churn-table">
          <thead>
            <tr>
              <th rowspan="2">年度</th>
              <th rowspan="2">季度</th>
              <th colspan="5" class="churn-new-customers-header">2025年新客户流失数（上次合作终止的客户总数）</th>
              <th colspan="4" class="churn-old-customers-header">2025年老客户流失数（续约失败）</th>
              <th colspan="4" class="churn-renewal-customers-header">2025年老客户流失数（续约客户）</th>
            </tr>
            <tr>
              <th class="churn-platform-header">客户数</th>
              <th class="churn-platform-header">预估流失服务费</th>
              <th class="churn-platform-header">预估流失消费</th>
              <th class="churn-platform-header">预估流失返点</th>
              <th class="churn-platform-header">预估流失毛利</th>
              <th class="churn-platform-header">客户数</th>
              <th class="churn-platform-header">预估流失服务费</th>
              <th class="churn-platform-header">预估流失消费</th>
              <th class="churn-platform-header">预估流失毛利</th>
              <th class="churn-platform-header">客户数</th>
              <th class="churn-platform-header">预估流失服务费</th>
              <th class="churn-platform-header">预估流失消费</th>
              <th class="churn-platform-header">预估流失毛利</th>
            </tr>
          </thead>
          <tbody>
            <tr class="year-row">
              <td rowspan="5">2025年</td>
              <td>2025年</td>
              <td class="churn-count-cell">45</td>
              <td class="churn-service-fee-cell">¥280.00万</td>
              <td class="churn-consumption-cell">¥2100.00万</td>
              <td class="churn-rebate-cell">¥105.00万</td>
              <td class="churn-profit-cell">¥385.00万</td>
              <td class="churn-count-cell">28</td>
              <td class="churn-service-fee-cell">¥420.00万</td>
              <td class="churn-consumption-cell">¥3150.00万</td>
              <td class="churn-profit-cell">¥577.50万</td>
              <td class="churn-count-cell">15</td>
              <td class="churn-service-fee-cell">¥180.00万</td>
              <td class="churn-consumption-cell">¥1350.00万</td>
              <td class="churn-profit-cell">¥247.50万</td>
            </tr>
            <tr class="quarter-row">
              <td>Q1季度</td>
              <td class="churn-count-cell">12</td>
              <td class="churn-service-fee-cell">¥75.00万</td>
              <td class="churn-consumption-cell">¥562.50万</td>
              <td class="churn-rebate-cell">¥28.13万</td>
              <td class="churn-profit-cell">¥103.13万</td>
              <td class="churn-count-cell">8</td>
              <td class="churn-service-fee-cell">¥120.00万</td>
              <td class="churn-consumption-cell">¥900.00万</td>
              <td class="churn-profit-cell">¥165.00万</td>
              <td class="churn-count-cell">4</td>
              <td class="churn-service-fee-cell">¥48.00万</td>
              <td class="churn-consumption-cell">¥360.00万</td>
              <td class="churn-profit-cell">¥66.00万</td>
            </tr>
            <tr class="quarter-row">
              <td>Q2季度</td>
              <td class="churn-count-cell">10</td>
              <td class="churn-service-fee-cell">¥65.00万</td>
              <td class="churn-consumption-cell">¥487.50万</td>
              <td class="churn-rebate-cell">¥24.38万</td>
              <td class="churn-profit-cell">¥89.38万</td>
              <td class="churn-count-cell">6</td>
              <td class="churn-service-fee-cell">¥90.00万</td>
              <td class="churn-consumption-cell">¥675.00万</td>
              <td class="churn-profit-cell">¥123.75万</td>
              <td class="churn-count-cell">3</td>
              <td class="churn-service-fee-cell">¥36.00万</td>
              <td class="churn-consumption-cell">¥270.00万</td>
              <td class="churn-profit-cell">¥49.50万</td>
            </tr>
            <tr class="quarter-row">
              <td>Q3季度</td>
              <td class="churn-count-cell">15</td>
              <td class="churn-service-fee-cell">¥95.00万</td>
              <td class="churn-consumption-cell">¥712.50万</td>
              <td class="churn-rebate-cell">¥35.63万</td>
              <td class="churn-profit-cell">¥130.63万</td>
              <td class="churn-count-cell">9</td>
              <td class="churn-service-fee-cell">¥135.00万</td>
              <td class="churn-consumption-cell">¥1012.50万</td>
              <td class="churn-profit-cell">¥185.63万</td>
              <td class="churn-count-cell">5</td>
              <td class="churn-service-fee-cell">¥60.00万</td>
              <td class="churn-consumption-cell">¥450.00万</td>
              <td class="churn-profit-cell">¥82.50万</td>
            </tr>
            <tr class="quarter-row">
              <td>Q4季度</td>
              <td class="churn-count-cell">8</td>
              <td class="churn-service-fee-cell">¥45.00万</td>
              <td class="churn-consumption-cell">¥337.50万</td>
              <td class="churn-rebate-cell">¥16.88万</td>
              <td class="churn-profit-cell">¥61.88万</td>
              <td class="churn-count-cell">5</td>
              <td class="churn-service-fee-cell">¥75.00万</td>
              <td class="churn-consumption-cell">¥562.50万</td>
              <td class="churn-profit-cell">¥103.13万</td>
              <td class="churn-count-cell">3</td>
              <td class="churn-service-fee-cell">¥36.00万</td>
              <td class="churn-consumption-cell">¥270.00万</td>
              <td class="churn-profit-cell">¥49.50万</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>


        <!-- 销售人员目标完成情况模块 -->
    <div class="dashboard-section">
      <div class="section-header">
        <h2 class="section-title">销售人员目标完成情况</h2>
        <div class="target-filter">
          <select v-model="selectedTimePeriod" @change="handleTimePeriodChange" class="time-filter-select">
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

      <div class="target-cards-grid">
        <div class="target-card service-fee-card">
          <div class="target-card-header">
            <div class="target-card-icon">
              <DollarSign :size="24" />
            </div>
            <div class="target-card-title">
              <h3>服务费目标</h3>
              <p class="target-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</p>
            </div>
          </div>
          <div class="target-card-content">
            <div class="target-value">{{ formatCurrency(currentTargetData.serviceFeeTarget) }}</div>
            <div class="completion-info">
              <div class="completion-value">已完成: {{ formatCurrency(currentTargetData.serviceFeeActual) }}</div>
              <div class="completion-rate" :class="getCompletionClass(currentTargetData.serviceFeeCompletion)">
                {{ currentTargetData.serviceFeeCompletion }}%
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: currentTargetData.serviceFeeCompletion + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="target-card new-order-card">
          <div class="target-card-header">
            <div class="target-card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="target-card-title">
              <h3>新单目标</h3>
              <p class="target-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</p>
            </div>
          </div>
          <div class="target-card-content">
            <div class="target-value">{{ currentTargetData.newOrderTarget }}单</div>
            <div class="completion-info">
              <div class="completion-value">已完成: {{ currentTargetData.newOrderActual }}单</div>
              <div class="completion-rate" :class="getCompletionClass(currentTargetData.newOrderCompletion)">
                {{ currentTargetData.newOrderCompletion }}%
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: currentTargetData.newOrderCompletion + '%' }"></div>
            </div>
          </div>
        </div>

        <div class="target-card overall-card">
          <div class="target-card-header">
            <div class="target-card-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="target-card-title">
              <h3>综合完成率</h3>
              <p class="target-period">{{ getTimePeriodLabel(selectedTimePeriod) }}</p>
            </div>
          </div>
          <div class="target-card-content">
            <div class="target-value overall-rate" :class="getCompletionClass(currentTargetData.overallCompletion)">
              {{ currentTargetData.overallCompletion }}%
            </div>
            <div class="completion-info">
              <div class="completion-metrics">
                <span class="metric-item">服务费: {{ currentTargetData.serviceFeeCompletion }}%</span>
                <span class="metric-item">新单: {{ currentTargetData.newOrderCompletion }}%</span>
              </div>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" :style="{ width: currentTargetData.overallCompletion + '%' }"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="sales-personnel-table-container">
        <table class="sales-personnel-table">
          <thead>
            <tr>
              <th rowspan="2">年度</th>
              <th rowspan="2">销售</th>
              <th colspan="2" class="target-group-header">目标</th>
              <th colspan="2" class="completion-group-header">完成</th>
              <th colspan="3" class="comparison-group-header">完成比例</th>
              <th colspan="2" class="baseline-group-header">完成基准</th>
            </tr>
            <tr>
              <th class="target-header">服务费目标</th>
              <th class="target-header">新单目标</th>
              <th class="completion-header">服务费完成</th>
              <th class="completion-header">单量完成</th>
              <th class="comparison-header">服务费完成比例</th>
              <th class="comparison-header">新单完成比例</th>
              <th class="comparison-header">完成比例</th>
              <th class="baseline-header">服务费基准</th>
              <th class="baseline-header">订单基准</th>
            </tr>
          </thead>
          <tbody>
            <!-- 销售人员1 -->
            <tr class="personnel-row">
              <td rowspan="5">2025年</td>
              <td class="personnel-name-cell">销售1</td>
              <td class="target-cell">¥450.00万</td>
              <td class="target-cell">270单</td>
              <td class="completion-cell">¥418.50万</td>
              <td class="completion-cell">251单</td>
              <td class="comparison-cell excellent">93.0%</td>
              <td class="comparison-cell excellent">92.9%</td>
              <td class="comparison-cell excellent">93.0%</td>
              <td class="baseline-cell">93.0%</td>
              <td class="baseline-cell">92.9%</td>
            </tr>

            <!-- 销售人员2 -->
            <tr class="personnel-row">
              <td class="personnel-name-cell">销售2</td>
              <td class="target-cell">¥420.00万</td>
              <td class="target-cell">252单</td>
              <td class="completion-cell">¥378.00万</td>
              <td class="completion-cell">227单</td>
              <td class="comparison-cell excellent">90.0%</td>
              <td class="comparison-cell excellent">90.1%</td>
              <td class="comparison-cell excellent">90.1%</td>
              <td class="baseline-cell">90.0%</td>
              <td class="baseline-cell">90.1%</td>
            </tr>

            <!-- 销售人员3 -->
            <tr class="personnel-row">
              <td class="personnel-name-cell">销售3</td>
              <td class="target-cell">¥380.00万</td>
              <td class="target-cell">228单</td>
              <td class="completion-cell">¥334.20万</td>
              <td class="completion-cell">201单</td>
              <td class="comparison-cell good">87.9%</td>
              <td class="comparison-cell good">88.2%</td>
              <td class="comparison-cell good">88.1%</td>
              <td class="baseline-cell">87.9%</td>
              <td class="baseline-cell">88.2%</td>
            </tr>

            <!-- 销售人员4 -->
            <tr class="personnel-row">
              <td class="personnel-name-cell">销售4</td>
              <td class="target-cell">¥360.00万</td>
              <td class="target-cell">216单</td>
              <td class="completion-cell">¥309.60万</td>
              <td class="completion-cell">186单</td>
              <td class="comparison-cell good">86.0%</td>
              <td class="comparison-cell good">86.1%</td>
              <td class="comparison-cell good">86.1%</td>
              <td class="baseline-cell">86.0%</td>
              <td class="baseline-cell">86.1%</td>
            </tr>

            <!-- 销售人员5 -->
            <tr class="personnel-row">
              <td class="personnel-name-cell">销售5</td>
              <td class="target-cell">¥340.00万</td>
              <td class="target-cell">204单</td>
              <td class="completion-cell">¥285.20万</td>
              <td class="completion-cell">171单</td>
              <td class="comparison-cell average">83.9%</td>
              <td class="comparison-cell average">83.8%</td>
              <td class="comparison-cell average">83.9%</td>
              <td class="baseline-cell">83.9%</td>
              <td class="baseline-cell">83.8%</td>
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

// 目标总览相关状态
const selectedTimePeriod = ref('2025')

interface TargetDataItem {
  serviceFeeTarget: number
  serviceFeeActual: number
  serviceFeeCompletion: number
  newOrderTarget: number
  newOrderActual: number
  newOrderCompletion: number
  overallCompletion: number
}

const targetData: Record<string, TargetDataItem> = {
  '2025': { serviceFeeTarget: 27000000, serviceFeeActual: 24225000, serviceFeeCompletion: 89.7, newOrderTarget: 1620, newOrderActual: 1458, newOrderCompletion: 90.0, overallCompletion: 89.9 },
  '2025-Q1': { serviceFeeTarget: 6270000, serviceFeeActual: 5623000, serviceFeeCompletion: 89.7, newOrderTarget: 376, newOrderActual: 338, newOrderCompletion: 89.9, overallCompletion: 89.8 },
  '2025-Q2': { serviceFeeTarget: 7180000, serviceFeeActual: 6441000, serviceFeeCompletion: 89.7, newOrderTarget: 431, newOrderActual: 387, newOrderCompletion: 89.8, overallCompletion: 89.8 },
  '2025-Q3': { serviceFeeTarget: 7870000, serviceFeeActual: 7058500, serviceFeeCompletion: 89.7, newOrderTarget: 472, newOrderActual: 423, newOrderCompletion: 89.6, overallCompletion: 89.7 },
  '2025-Q4': { serviceFeeTarget: 5680000, serviceFeeActual: 5102500, serviceFeeCompletion: 89.8, newOrderTarget: 341, newOrderActual: 306, newOrderCompletion: 89.7, overallCompletion: 89.8 },
  '2025-01': { serviceFeeTarget: 2200000, serviceFeeActual: 1980000, serviceFeeCompletion: 90.0, newOrderTarget: 132, newOrderActual: 119, newOrderCompletion: 90.2, overallCompletion: 90.1 },
  '2025-02': { serviceFeeTarget: 2000000, serviceFeeActual: 1780000, serviceFeeCompletion: 89.0, newOrderTarget: 120, newOrderActual: 107, newOrderCompletion: 89.2, overallCompletion: 89.1 },
  '2025-03': { serviceFeeTarget: 2070000, serviceFeeActual: 1863000, serviceFeeCompletion: 90.0, newOrderTarget: 124, newOrderActual: 112, newOrderCompletion: 90.3, overallCompletion: 90.2 },
  '2025-04': { serviceFeeTarget: 2400000, serviceFeeActual: 2152800, serviceFeeCompletion: 89.7, newOrderTarget: 144, newOrderActual: 129, newOrderCompletion: 89.6, overallCompletion: 89.7 },
  '2025-05': { serviceFeeTarget: 2500000, serviceFeeActual: 2245000, serviceFeeCompletion: 89.8, newOrderTarget: 150, newOrderActual: 135, newOrderCompletion: 90.0, overallCompletion: 89.9 },
  '2025-06': { serviceFeeTarget: 2280000, serviceFeeActual: 2043200, serviceFeeCompletion: 89.6, newOrderTarget: 137, newOrderActual: 123, newOrderCompletion: 89.8, overallCompletion: 89.7 },
  '2025-07': { serviceFeeTarget: 2700000, serviceFeeActual: 2421900, serviceFeeCompletion: 89.7, newOrderTarget: 162, newOrderActual: 145, newOrderCompletion: 89.5, overallCompletion: 89.6 },
  '2025-08': { serviceFeeTarget: 2600000, serviceFeeActual: 2332200, serviceFeeCompletion: 89.7, newOrderTarget: 156, newOrderActual: 140, newOrderCompletion: 89.7, overallCompletion: 89.7 },
  '2025-09': { serviceFeeTarget: 2570000, serviceFeeActual: 2304400, serviceFeeCompletion: 89.7, newOrderTarget: 154, newOrderActual: 138, newOrderCompletion: 89.6, overallCompletion: 89.7 },
  '2025-10': { serviceFeeTarget: 1900000, serviceFeeActual: 1706200, serviceFeeCompletion: 89.8, newOrderTarget: 114, newOrderActual: 102, newOrderCompletion: 89.5, overallCompletion: 89.7 },
  '2025-11': { serviceFeeTarget: 1880000, serviceFeeActual: 1687600, serviceFeeCompletion: 89.8, newOrderTarget: 113, newOrderActual: 101, newOrderCompletion: 89.4, overallCompletion: 89.6 },
  '2025-12': { serviceFeeTarget: 1900000, serviceFeeActual: 1708700, serviceFeeCompletion: 89.9, newOrderTarget: 114, newOrderActual: 103, newOrderCompletion: 90.4, overallCompletion: 90.2 }
}

// 毛利数据相关状态
const selectedProfitPeriod = ref('2025')

interface ProfitDataItem {
  totalProfit: number
  totalServiceFee: number
  totalRebate: number
  newCustomerProfit: number
  newCustomerServiceFee: number
  newCustomerRebate: number
  oldCustomerProfit: number
  oldCustomerServiceFee: number
  oldCustomerRebate: number
}

const profitData: Record<string, ProfitDataItem> = {
  '2025': { totalProfit: 33312600, totalServiceFee: 24225000, totalRebate: 9087600, newCustomerProfit: 26650100, newCustomerServiceFee: 19380000, newCustomerRebate: 7270100, oldCustomerProfit: 6662500, oldCustomerServiceFee: 4845000, oldCustomerRebate: 1817500 },
  '2025-Q1': { totalProfit: 7745000, totalServiceFee: 5623000, totalRebate: 2122000, newCustomerProfit: 6196000, newCustomerServiceFee: 4498400, newCustomerRebate: 1697600, oldCustomerProfit: 1549000, oldCustomerServiceFee: 1124600, oldCustomerRebate: 424400 },
  '2025-Q2': { totalProfit: 8863000, totalServiceFee: 6441000, totalRebate: 2422000, newCustomerProfit: 7090400, newCustomerServiceFee: 5152800, newCustomerRebate: 1937600, oldCustomerProfit: 1772600, oldCustomerServiceFee: 1288200, oldCustomerRebate: 484400 },
  '2025-Q3': { totalProfit: 9712000, totalServiceFee: 7058500, totalRebate: 2653500, newCustomerProfit: 7769600, newCustomerServiceFee: 5646800, newCustomerRebate: 2122800, oldCustomerProfit: 1942400, oldCustomerServiceFee: 1411700, oldCustomerRebate: 530700 },
  '2025-Q4': { totalProfit: 6992600, totalServiceFee: 5102500, totalRebate: 1890100, newCustomerProfit: 5594100, newCustomerServiceFee: 4082000, newCustomerRebate: 1512100, oldCustomerProfit: 1398500, oldCustomerServiceFee: 1020500, oldCustomerRebate: 378000 }
}

// 计算属性
const platformSummary = computed(() => {
  const totalServiceFee = platformData.value.reduce((sum, p) => sum + p.serviceFee, 0)
  const totalOrders = platformData.value.reduce((sum, p) => sum + p.orderCount, 0)
  return { totalServiceFee, totalOrders }
})

// 目标总览相关计算属性
const currentTargetData = computed(() => {
  return targetData[selectedTimePeriod.value] || targetData['2025']
})

// 毛利数据相关计算属性
const currentProfitData = computed(() => {
  return profitData[selectedProfitPeriod.value] || profitData['2025']
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

// 目标总览相关方法
const handleTimePeriodChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedTimePeriod.value = target.value
  console.log('时间周期切换至:', target.value)
}

const getTimePeriodLabel = (period: string): string => {
  const labels: Record<string, string> = {
    '2025': '2025年度',
    '2025-Q1': '2025年第一季度',
    '2025-Q2': '2025年第二季度',
    '2025-Q3': '2025年第三季度',
    '2025-Q4': '2025年第四季度',
    '2025-01': '2025年1月',
    '2025-02': '2025年2月',
    '2025-03': '2025年3月',
    '2025-04': '2025年4月',
    '2025-05': '2025年5月',
    '2025-06': '2025年6月',
    '2025-07': '2025年7月',
    '2025-08': '2025年8月',
    '2025-09': '2025年9月',
    '2025-10': '2025年10月',
    '2025-11': '2025年11月',
    '2025-12': '2025年12月'
  }
  return labels[period] || period
}

const handleProfitPeriodChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  selectedProfitPeriod.value = target.value
  console.log('毛利时间周期切换至:', target.value)
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

/* 目标总览卡片样式 */
.target-filter {
  display: flex;
  align-items: center;
}

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

.target-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 24px;
  margin-top: 20px;
  margin-bottom: 32px;
}

.target-card {
  background: #fff;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.target-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.target-card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.target-card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.service-fee-card .target-card-icon {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.new-order-card .target-card-icon {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.overall-card .target-card-icon {
  background: linear-gradient(135deg, #faad14, #ffc53d);
}

.target-card-title h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #262626;
}

.target-period {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: #8c8c8c;
}

.target-card-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.target-value {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  line-height: 1;
}

.overall-rate {
  font-size: 32px;
}

.completion-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.completion-value {
  font-size: 14px;
  color: #595959;
}

.completion-rate {
  font-size: 16px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.completion-rate.excellent {
  color: #52c41a;
  background: #f6ffed;
}

.completion-rate.good {
  color: #1890ff;
  background: #e6f7ff;
}

.completion-rate.average {
  color: #faad14;
  background: #fff7e6;
}

.completion-rate.poor {
  color: #ff4d4f;
  background: #fff2f0;
}

.completion-metrics {
  display: flex;
  gap: 16px;
}

.metric-item {
  font-size: 12px;
  color: #8c8c8c;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #f0f0f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #1890ff, #40a9ff);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.service-fee-card .progress-fill {
  background: linear-gradient(90deg, #1890ff, #40a9ff);
}

.new-order-card .progress-fill {
  background: linear-gradient(90deg, #52c41a, #73d13d);
}

.overall-card .progress-fill {
  background: linear-gradient(90deg, #faad14, #ffc53d);
}

/* 毛利卡片样式 */
.profit-filter {
  display: flex;
  align-items: center;
}

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
}

.detail-label {
  font-size: 12px;
  color: #8c8c8c;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #595959;
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

/* 客户年度毛利完成表格样式 */
.customer-annual-profit-table-container {
  overflow-x: auto !important;
  background: #fff !important;
  border: 1px solid #f0f0f0 !important;
  border-radius: 6px !important;
}

.customer-annual-profit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 2400px;
}

.customer-annual-profit-table th {
  background: #fafafa !important;
  border: 1px solid #f0f0f0 !important;
  padding: 12px 8px !important;
  text-align: center !important;
  font-weight: 600 !important;
  color: #262626 !important;
  white-space: nowrap !important;
}

.customer-annual-profit-table td {
  border: 1px solid #f0f0f0 !important;
  padding: 10px 8px !important;
  text-align: center !important;
  color: #595959 !important;
}

.customer-annual-profit-table .customer-name-cell {
  text-align: left !important;
  font-weight: 500 !important;
  color: #262626 !important;
  max-width: 200px;
  word-break: break-word;
}

.customer-annual-profit-table .completion-rate-header {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.customer-annual-profit-table .completion-rate-cell {
  font-weight: 600 !important;
  padding: 4px 8px !important;
}

.customer-annual-profit-table .completion-rate-cell.excellent {
  background: #f6ffed !important;
  color: #52c41a !important;
}

.customer-annual-profit-table .completion-rate-cell.good {
  background: #e6f7ff !important;
  color: #1890ff !important;
}

.customer-annual-profit-table .completion-rate-cell.average {
  background: #fff7e6 !important;
  color: #faad14 !important;
}

.customer-annual-profit-table .completion-rate-cell.poor {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
}

/* 客户年度毛利完成表格 - 组标题样式 - 复用现有样式 */
.customer-annual-profit-table .service-fee-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.customer-annual-profit-table .service-fee-actual-group-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.customer-annual-profit-table .consumption-group-header {
  background: #f0f0f0 !important;
  color: #595959 !important;
  font-weight: 600;
}

.customer-annual-profit-table .rebate-group-header {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
  font-weight: 600;
}

.customer-annual-profit-table .profit-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

/* 客户年度毛利完成表格 - 子标题样式 - 复用现有样式 */
.customer-annual-profit-table .service-fee-header {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
  font-size: 12px;
}

.customer-annual-profit-table .service-fee-actual-header {
  background: #fffbf0 !important;
  color: #faad14 !important;
  font-weight: 500;
  font-size: 12px;
}

.customer-annual-profit-table .consumption-header {
  background: #f9f9f9 !important;
  color: #8c8c8c !important;
  font-weight: 500;
  font-size: 12px;
}

.customer-annual-profit-table .rebate-header {
  background: #fff8f8 !important;
  color: #ff4d4f !important;
  font-weight: 500;
  font-size: 12px;
}

.customer-annual-profit-table .profit-header {
  background: #f0fff0 !important;
  color: #52c41a !important;
  font-weight: 500;
  font-size: 12px;
}

/* 客户年度毛利完成表格 - 数据单元格样式 - 复用现有样式 */
.customer-annual-profit-table .service-fee-cell {
  background: #f8fcff !important;
  color: #1890ff !important;
  font-weight: 500;
}

.customer-annual-profit-table .service-fee-actual-cell {
  background: #fffef8 !important;
  color: #faad14 !important;
  font-weight: 500;
}

.customer-annual-profit-table .consumption-cell {
  background: #fafafa !important;
  color: #8c8c8c !important;
  font-weight: 400;
}

.customer-annual-profit-table .rebate-cell {
  background: #fffafa !important;
  color: #ff4d4f !important;
  font-weight: 500;
}

.customer-annual-profit-table .profit-cell {
  background: #f8fff8 !important;
  color: #52c41a !important;
  font-weight: 600;
}

/* 客户行样式 */
.customer-annual-profit-table .customer-row:nth-child(even) {
  background: #fafafa !important;
}

.customer-annual-profit-table .customer-row:hover {
  background: #f0f8ff !important;
}

/* 年度流失客户表格样式 */
.annual-churn-table-container {
  overflow-x: auto !important;
  background: #fff !important;
  border: 1px solid #f0f0f0 !important;
  border-radius: 6px !important;
}

.annual-churn-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1800px;
}

.annual-churn-table th {
  background: #fafafa !important;
  border: 1px solid #f0f0f0 !important;
  padding: 12px 8px !important;
  text-align: center !important;
  font-weight: 600 !important;
  color: #262626 !important;
  white-space: nowrap !important;
}

.annual-churn-table td {
  border: 1px solid #f0f0f0 !important;
  padding: 10px 8px !important;
  text-align: center !important;
  color: #595959 !important;
}

/* 年度流失客户表格 - 组标题样式 */
.annual-churn-table .churn-new-customers-header {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
  font-weight: 600;
  font-size: 12px;
}

.annual-churn-table .churn-old-customers-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
  font-size: 12px;
}

.annual-churn-table .churn-renewal-customers-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
  font-size: 12px;
}

/* 年度流失客户表格 - 子标题样式 */
.annual-churn-table .churn-platform-header {
  background: #f9f9f9 !important;
  color: #595959 !important;
  font-weight: 500;
  font-size: 11px;
}

/* 年度流失客户表格 - 数据单元格样式 */
.annual-churn-table .churn-count-cell {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.annual-churn-table .churn-service-fee-cell {
  background: #fffef8 !important;
  color: #faad14 !important;
  font-weight: 500;
}

.annual-churn-table .churn-consumption-cell {
  background: #fafafa !important;
  color: #8c8c8c !important;
  font-weight: 400;
}

.annual-churn-table .churn-rebate-cell {
  background: #fffafa !important;
  color: #ff4d4f !important;
  font-weight: 500;
}

.annual-churn-table .churn-profit-cell {
  background: #fff2f0 !important;
  color: #ff4d4f !important;
  font-weight: 600;
}

/* 年度流失客户表格 - 年度和季度行样式 */
.annual-churn-table .year-row {
  background: #f9f9f9 !important;
  font-weight: 500;
}

.annual-churn-table .year-row td {
  color: #262626 !important;
  font-weight: 500;
}

.annual-churn-table .quarter-row:nth-child(even) {
  background: #fafafa !important;
}

.annual-churn-table .quarter-row:hover {
  background: #f0f8ff !important;
}



/* 销售人员目标完成情况表格样式 */
.sales-personnel-table-container {
  overflow-x: auto !important;
  background: #fff !important;
  border: 1px solid #f0f0f0 !important;
  border-radius: 6px !important;
}

.sales-personnel-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1200px;
}

.sales-personnel-table th {
  background: #fafafa !important;
  border: 1px solid #f0f0f0 !important;
  padding: 12px 8px !important;
  text-align: center !important;
  font-weight: 600 !important;
  color: #262626 !important;
  white-space: nowrap !important;
}

.sales-personnel-table td {
  border: 1px solid #f0f0f0 !important;
  padding: 10px 8px !important;
  text-align: center !important;
  color: #595959 !important;
}

.sales-personnel-table .personnel-name-cell {
  text-align: left !important;
  font-weight: 500 !important;
  color: #262626 !important;
  padding-left: 16px !important;
}

/* 销售人员目标完成情况表格 - 复用现有组标题样式 */
.sales-personnel-table .target-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.sales-personnel-table .completion-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.sales-personnel-table .comparison-group-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.sales-personnel-table .baseline-group-header {
  background: #f0f0f0 !important;
  color: #595959 !important;
  font-weight: 600;
}

.sales-personnel-table .target-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.sales-personnel-table .completion-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.sales-personnel-table .comparison-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.sales-personnel-table .baseline-header {
  background: #f0f0f0 !important;
  color: #595959 !important;
  font-weight: 600;
}

/* 销售人员目标完成情况表格 - 复用现有数据单元格样式 */
.sales-personnel-table .target-cell {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
}

.sales-personnel-table .completion-cell {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 500;
}

.sales-personnel-table .comparison-cell {
  background: #fffbf0 !important;
  font-weight: 600;
}

.sales-personnel-table .baseline-cell {
  background: #f9f9f9 !important;
  color: #8c8c8c !important;
  font-weight: 400;
}

/* 销售人员目标完成情况表格 - 复用现有完成率样式 */
.sales-personnel-table .comparison-cell.excellent {
  color: #52c41a !important;
  font-weight: 600;
}

.sales-personnel-table .comparison-cell.good {
  color: #1890ff !important;
  font-weight: 600;
}

.sales-personnel-table .comparison-cell.average {
  color: #faad14 !important;
  font-weight: 600;
}

.sales-personnel-table .comparison-cell.poor {
  color: #ff4d4f !important;
  font-weight: 600;
}

/* 销售人员目标完成情况表格 - 人员行样式 */
.sales-personnel-table .personnel-row {
  background: #fff !important;
}

.sales-personnel-table .personnel-row:nth-child(even) {
  background: #fafafa !important;
}

.sales-personnel-table .personnel-row:hover {
  background: #f0f8ff !important;
}

/* 员工总毛利完成表格样式 - 复用销售人员目标完成情况样式 */
.employee-profit-table-container {
  overflow-x: auto !important;
  background: #fff !important;
  border: 1px solid #f0f0f0 !important;
  border-radius: 6px !important;
}

.employee-profit-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
  min-width: 1400px;
}

.employee-profit-table th {
  background: #fafafa !important;
  border: 1px solid #f0f0f0 !important;
  padding: 12px 8px !important;
  text-align: center !important;
  font-weight: 600 !important;
  color: #262626 !important;
  white-space: nowrap !important;
}

.employee-profit-table td {
  border: 1px solid #f0f0f0 !important;
  padding: 10px 8px !important;
  text-align: center !important;
  color: #595959 !important;
}

/* 员工总毛利完成表格 - 复用现有组标题样式 */
.employee-profit-table .target-group-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.employee-profit-table .completion-group-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.employee-profit-table .comparison-group-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

.employee-profit-table .target-header {
  background: #e6f7ff !important;
  color: #1890ff !important;
  font-weight: 600;
}

.employee-profit-table .completion-header {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 600;
}

.employee-profit-table .comparison-header {
  background: #fff7e6 !important;
  color: #faad14 !important;
  font-weight: 600;
}

/* 员工总毛利完成表格 - 复用现有数据单元格样式 */
.employee-profit-table .target-cell {
  background: #f0f8ff !important;
  color: #1890ff !important;
  font-weight: 500;
}

.employee-profit-table .completion-cell {
  background: #f6ffed !important;
  color: #52c41a !important;
  font-weight: 500;
}

.employee-profit-table .comparison-cell {
  background: #fffbf0 !important;
  font-weight: 600;
}

/* 员工总毛利完成表格 - 复用现有完成率样式 */
.employee-profit-table .comparison-cell.excellent {
  color: #52c41a !important;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.good {
  color: #1890ff !important;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.average {
  color: #faad14 !important;
  font-weight: 600;
}

.employee-profit-table .comparison-cell.poor {
  color: #ff4d4f !important;
  font-weight: 600;
}

/* 员工总毛利完成表格 - 年度和人员行样式 */
.employee-profit-table .year-row {
  background: #f9f9f9 !important;
  font-weight: 500;
}

.employee-profit-table .year-row td {
  color: #262626 !important;
  font-weight: 500;
}

.employee-profit-table .personnel-row {
  background: #fff !important;
}

.employee-profit-table .personnel-row:nth-child(even) {
  background: #fafafa !important;
}

.employee-profit-table .personnel-row:hover {
  background: #f0f8ff !important;
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
