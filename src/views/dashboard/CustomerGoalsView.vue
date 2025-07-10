<template>
  <div class="customer-goals-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <h1 class="page-title">客户目标</h1>
      <p class="page-description">网站的各个目标完成情况</p>
    </div>

    <!-- 使用共享的客户目标模块 -->
    <CustomerGoalsModule />
  </div>
</template>

<script setup lang="ts">
import CustomerGoalsModule from '@/components/dashboard/CustomerGoalsModule.vue'
</script>

<style scoped>
.customer-goals-view {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  margin-bottom: 24px;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-description {
  font-size: 16px;
  color: #666;
  margin: 0;
}
</style>
