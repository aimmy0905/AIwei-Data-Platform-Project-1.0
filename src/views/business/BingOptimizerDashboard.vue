<template>
  <div class="bing-optimizer-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">Bing优化师看板</h1>
        <p class="dashboard-subtitle">专注Bing平台客户优化与数据分析</p>
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
      <p>正在加载Bing优化师数据...</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- 余额通知模块 -->
      <BalanceNotificationModule />

      <!-- 服务客户模块 -->
      <ServiceCustomerModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 客户Bing广告数据总览 -->
      <CustomerBingAdsModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import ServiceCustomerModule from '@/components/business/ServiceCustomerModule.vue'
import CustomerBingAdsModule from '@/components/business/CustomerBingAdsModule.vue'
import BalanceNotificationModule from '@/components/business/BalanceNotificationModule.vue'
import type {
  BusinessRole,
  TimeRange
} from '@/types'

const currentRole = ref('bing_optimizer')
const availableRoles = ref<BusinessRole[]>([])
const loading = ref(false)

// 事件处理
const handleRoleChange = (role: string) => {
  currentRole.value = role
}

const handleTimeRangeChange = (timeRange: TimeRange | string) => {
  console.log('Time range changed:', timeRange)
}

const handleQuarterChange = (quarter: string) => {
  console.log('Quarter changed:', quarter)
}

// 初始化
onMounted(() => {
  // 页面初始化完成
  console.log('Bing optimizer dashboard loaded')
})
</script>

<style scoped>
.bing-optimizer-dashboard {
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
</style>
