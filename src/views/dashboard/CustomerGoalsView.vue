<template>
  <div class="page-placeholder">
    <div class="placeholder-content">
      <Target :size="64" class="placeholder-icon" />
      <h1>客户目标</h1>
      <p>客户目标管理功能正在开发中...</p>
      <div class="placeholder-info">
        <p>此页面将包含：</p>
        <ul>
          <li>月度、季度、年度目标设置</li>
          <li>销量目标、利润目标、ROI目标追踪</li>
          <li>目标完成情况可视化展示</li>
          <li>目标达成率分析</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Target } from 'lucide-vue-next'
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