<template>
  <div class="meta-optimizer-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">Meta优化师看板</h1>
        <p class="dashboard-subtitle">专注Meta平台客户优化与数据分析</p>
      </div>
      
      <div class="dashboard-header__right">
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <div class="coming-soon">
      <div class="coming-soon-icon">📱</div>
      <h2>Meta优化师看板正在开发中</h2>
      <p>该功能将包含Meta平台客户数据、广告账户管理、优化建议等功能。</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import type { BusinessRole } from '@/types'

const currentRole = ref('meta_optimizer')
const availableRoles = ref<BusinessRole[]>([])

const handleRoleChange = (role: string) => {
  currentRole.value = role
}
</script>

<style scoped>
.meta-optimizer-dashboard {
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

.coming-soon {
  text-align: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.coming-soon-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.coming-soon h2 {
  color: #262626;
  margin-bottom: 12px;
}

.coming-soon p {
  color: #8c8c8c;
  max-width: 500px;
  margin: 0 auto;
}
</style>