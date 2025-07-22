<template>
  <div class="role-switcher">
    <div class="role-switcher__dropdown" @click="toggleDropdown">
      <div class="role-switcher__current">
        <div class="role-switcher__icon" :style="{ backgroundColor: currentRoleColor }">
          <component :is="currentRoleIcon" :size="16" />
        </div>
        <div class="role-switcher__info">
          <div class="role-switcher__name">{{ currentRoleName }}</div>
          <div class="role-switcher__level">级别 {{ currentRoleLevel }}</div>
        </div>
        <ChevronDown :size="16" class="role-switcher__arrow" :class="{ 'role-switcher__arrow--open': isOpen }" />
      </div>
    </div>

    <!-- 下拉菜单 -->
    <Transition name="dropdown">
      <div v-if="isOpen" class="role-switcher__menu">
        <div class="role-switcher__menu-header">
          <span>可切换角色</span>
        </div>
        <div class="role-switcher__menu-list">
          <div
            v-for="role in availableRoles"
            :key="role.code"
            class="role-switcher__menu-item"
            :class="{ 'role-switcher__menu-item--active': role.code === currentRole }"
            @click="handleRoleChange(role.code)"
          >
            <div class="role-switcher__menu-icon" :style="{ backgroundColor: getRoleColor(role.code) }">
              <component :is="getRoleIcon(role.code)" :size="14" />
            </div>
            <div class="role-switcher__menu-info">
              <div class="role-switcher__menu-name">{{ role.name }}</div>
              <div class="role-switcher__menu-dept">{{ getDepartmentName(role.department) }}</div>
            </div>
            <div v-if="role.code === currentRole" class="role-switcher__menu-check">
              <Check :size="14" />
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- 遮罩层 -->
    <div v-if="isOpen" class="role-switcher__overlay" @click="closeDropdown"></div>

    <!-- 确认对话框 -->
    <div v-if="showConfirmDialog" class="role-switcher__confirm-overlay">
      <div class="role-switcher__confirm-dialog">
        <div class="role-switcher__confirm-header">
          <AlertCircle :size="20" class="role-switcher__confirm-icon" />
          <h3>确认角色切换</h3>
        </div>
        <div class="role-switcher__confirm-content">
          <p>您确定要切换到 <strong>{{ pendingRoleName }}</strong> 角色吗？</p>
          <p class="role-switcher__confirm-note">切换角色后，页面数据将重新加载并显示该角色的权限范围。</p>
        </div>
        <div class="role-switcher__confirm-actions">
          <button class="role-switcher__confirm-btn role-switcher__confirm-btn--cancel" @click="cancelRoleChange">
            取消
          </button>
          <button class="role-switcher__confirm-btn role-switcher__confirm-btn--confirm" @click="confirmRoleChange">
            确认切换
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ChevronDown, Check, AlertCircle, Users, Target, DollarSign, BarChart3, Settings, Zap } from 'lucide-vue-next'
import type { RoleSwitcherProps, BusinessRole } from '@/types'
import { BUSINESS_ROLES } from '@/types'

// Props
const props = withDefaults(defineProps<RoleSwitcherProps>(), {
  availableRoles: () => []
})

// Emits
const emit = defineEmits<{
  'role-change': [role: string]
}>()

// 状态
const isOpen = ref(false)
const showConfirmDialog = ref(false)
const pendingRoleCode = ref('')

// 计算属性
const currentRoleData = computed(() => {
  return Object.values(BUSINESS_ROLES).find(role => role.code === props.currentRole)
})

const currentRoleName = computed(() => currentRoleData.value?.name || '')
const currentRoleLevel = computed(() => currentRoleData.value?.level || 1)
const currentRoleColor = computed(() => getRoleColor(props.currentRole))
const currentRoleIcon = computed(() => getRoleIcon(props.currentRole))

const pendingRoleName = computed(() => {
  const role = Object.values(BUSINESS_ROLES).find(role => role.code === pendingRoleCode.value)
  return role?.name || ''
})

// 方法
const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleRoleChange = (roleCode: string) => {
  if (roleCode === props.currentRole) {
    closeDropdown()
    return
  }

  pendingRoleCode.value = roleCode
  showConfirmDialog.value = true
  closeDropdown()
}

const confirmRoleChange = () => {
  emit('role-change', pendingRoleCode.value)
  showConfirmDialog.value = false
  pendingRoleCode.value = ''
}

const cancelRoleChange = () => {
  showConfirmDialog.value = false
  pendingRoleCode.value = ''
}

const getRoleColor = (roleCode: string): string => {
  const colorMap: Record<string, string> = {
    sales_director: '#1890ff',
    sales_manager: '#52c41a',
    sales_person: '#722ed1',
    project_director: '#fa8c16',
    project_manager: '#13c2c2',
    google_optimizer: '#eb2f96',
    meta_optimizer: '#1890ff',
    criteo_optimizer: '#52c41a',
    bing_optimizer: '#fa541c',
    finance_director: '#f5222d'
  }
  return colorMap[roleCode] || '#666'
}

const getRoleIcon = (roleCode: string) => {
  const iconMap: Record<string, any> = {
    sales_director: Users,
    sales_manager: Target,
    sales_person: DollarSign,
    project_director: BarChart3,
    project_manager: Settings,
    google_optimizer: Zap,
    meta_optimizer: Zap,
    criteo_optimizer: Zap,
    bing_optimizer: Zap,
    finance_director: DollarSign
  }
  return iconMap[roleCode] || Settings
}

const getDepartmentName = (department: string): string => {
  const deptMap: Record<string, string> = {
    sales: '销售部门',
    operations: '运营部门',
    finance: '财务部门'
  }
  return deptMap[department] || department
}

// 生命周期
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.role-switcher')) {
    closeDropdown()
  }
}
</script>

<style scoped>
.role-switcher {
  position: relative;
  display: inline-block;
}

.role-switcher__dropdown {
  cursor: pointer;
  user-select: none;
}

.role-switcher__current {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  transition: all 0.2s;
  min-width: 180px;
}

.role-switcher__current:hover {
  border-color: #40a9ff;
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
}

.role-switcher__icon {
  width: 24px;
  height: 24px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.role-switcher__info {
  flex: 1;
  min-width: 0;
}

.role-switcher__name {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
  line-height: 1.4;
}

.role-switcher__level {
  font-size: 12px;
  color: #8c8c8c;
  line-height: 1.4;
}

.role-switcher__arrow {
  transition: transform 0.2s;
  color: #8c8c8c;
  flex-shrink: 0;
}

.role-switcher__arrow--open {
  transform: rotate(180deg);
}

.role-switcher__menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
}

.role-switcher__menu-header {
  padding: 8px 12px;
  font-size: 12px;
  color: #8c8c8c;
  border-bottom: 1px solid #f0f0f0;
  background: #fafafa;
  border-radius: 6px 6px 0 0;
}

.role-switcher__menu-list {
  max-height: 300px;
  overflow-y: auto;
}

.role-switcher__menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.role-switcher__menu-item:hover {
  background-color: #f5f5f5;
}

.role-switcher__menu-item--active {
  background-color: #e6f7ff;
}

.role-switcher__menu-icon {
  width: 20px;
  height: 20px;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  flex-shrink: 0;
}

.role-switcher__menu-info {
  flex: 1;
  min-width: 0;
}

.role-switcher__menu-name {
  font-size: 13px;
  font-weight: 500;
  color: #262626;
  line-height: 1.4;
}

.role-switcher__menu-dept {
  font-size: 11px;
  color: #8c8c8c;
  line-height: 1.4;
}

.role-switcher__menu-check {
  color: #52c41a;
  flex-shrink: 0;
}

.role-switcher__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
}

.role-switcher__confirm-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1001;
}

.role-switcher__confirm-dialog {
  background: #fff;
  border-radius: 8px;
  width: 400px;
  max-width: 90vw;
}

.role-switcher__confirm-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.role-switcher__confirm-icon {
  color: #faad14;
}

.role-switcher__confirm-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 500;
  color: #262626;
}

.role-switcher__confirm-content {
  padding: 20px;
}

.role-switcher__confirm-content p {
  margin: 0 0 12px 0;
  color: #595959;
  line-height: 1.5;
}

.role-switcher__confirm-content p:last-child {
  margin-bottom: 0;
}

.role-switcher__confirm-note {
  font-size: 13px !important;
  color: #8c8c8c !important;
}

.role-switcher__confirm-actions {
  display: flex;
  gap: 8px;
  padding: 16px 20px;
  border-top: 1px solid #f0f0f0;
  justify-content: flex-end;
}

.role-switcher__confirm-btn {
  padding: 6px 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s;
}

.role-switcher__confirm-btn--cancel {
  background: #fff;
  color: #595959;
}

.role-switcher__confirm-btn--cancel:hover {
  border-color: #40a9ff;
  color: #40a9ff;
}

.role-switcher__confirm-btn--confirm {
  background: #1890ff;
  border-color: #1890ff;
  color: #fff;
}

.role-switcher__confirm-btn--confirm:hover {
  background: #40a9ff;
  border-color: #40a9ff;
}

/* 下拉动画 */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>