<template>
  <div class="page-placeholder">
    <div class="placeholder-content">
      <Globe :size="64" class="placeholder-icon" />
      <h1>网站数据</h1>
      <p>网站数据分析功能正在开发中...</p>
      <div class="placeholder-info">
        <p>此页面将包含：</p>
        <ul>
          <li>总销售额、ROI、转化率等结果指标</li>
          <li>订单量、客户数等订单指标</li>
          <li>访客数、跳出率等用户指标</li>
          <li>用户转化漏斗分析</li>
          <li>退货指标和库存指标</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Globe } from 'lucide-vue-next'
</script>

<style scoped>
.page-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  text-align: center;
}

.placeholder-content {
  max-width: 400px;
  padding: var(--spacing-2xl);
}

.placeholder-icon {
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.placeholder-content h1 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.placeholder-content > p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xl);
}

.placeholder-info {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  text-align: left;
}

.placeholder-info p {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.placeholder-info ul {
  list-style-position: inside;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}

.placeholder-info li {
  margin-bottom: var(--spacing-xs);
}
</style>