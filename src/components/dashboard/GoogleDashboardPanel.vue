<template>
  <div class="google-dashboard-panel">
    <div class="panel-header">
      <h3 class="panel-title">Google 广告数据</h3>
      <p class="panel-description">Google 广告平台的数据概览</p>
    </div>

    <div class="panel-content">
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">总花费</div>
          <div class="metric-value">$12,450</div>
          <div class="metric-change positive">+8.5%</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">转化价值</div>
          <div class="metric-value">$48,200</div>
          <div class="metric-change positive">+12.3%</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">ROI</div>
          <div class="metric-value">3.87x</div>
          <div class="metric-change positive">+5.2%</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">点击次数</div>
          <div class="metric-value">8,542</div>
          <div class="metric-change negative">-2.1%</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Google Dashboard Panel Component
</script>

<style scoped>
.google-dashboard-panel {
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e5e5;
  padding: 24px;
}

.panel-header {
  margin-bottom: 24px;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.panel-description {
  font-size: 14px;
  color: #666;
  margin: 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.metric-card {
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
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
  color: #28a745;
}

.metric-change.negative {
  color: #dc3545;
}
</style>
