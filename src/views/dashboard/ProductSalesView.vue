<template>
  <div class="page-placeholder">
    <div class="placeholder-content">
      <Package :size="64" class="placeholder-icon" />
      <h1>产品销售</h1>
      <p>产品销售数据功能正在开发中...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Package } from 'lucide-vue-next'
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

.placeholder-content p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
}
</style>