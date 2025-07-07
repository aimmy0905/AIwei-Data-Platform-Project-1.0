<template>
  <aside 
    class="sidebar"
    :class="{ 'sidebar--collapsed': collapsed }"
  >
    <!-- 侧边栏头部 -->
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <img src="/favicon.ico" alt="Logo" class="sidebar__logo-img" />
        <transition name="fade">
          <span v-show="!collapsed" class="sidebar__logo-text">
            艾维数据平台
          </span>
        </transition>
      </div>
      <button 
        class="sidebar__toggle"
        @click="toggleCollapse"
        :title="collapsed ? '展开菜单' : '折叠菜单'"
      >
        <Menu v-if="collapsed" :size="20" />
        <X v-else :size="20" />
      </button>
    </div>

    <!-- 菜单列表 -->
    <nav class="sidebar__nav">
      <div class="sidebar__menu">
        <SidebarMenuItem
          v-for="item in visibleMenuItems"
          :key="item.id"
          :item="item"
          :collapsed="collapsed"
          @select="handleMenuSelect"
        />
      </div>
    </nav>

    <!-- 侧边栏底部 -->
    <div class="sidebar__footer">
      <div class="sidebar__user" v-if="user">
        <img 
          :src="userAvatar || '/avatars/default.png'" 
          :alt="userName"
          class="sidebar__user-avatar"
        />
        <transition name="fade">
          <div v-show="!collapsed" class="sidebar__user-info">
            <div class="sidebar__user-name">{{ userName }}</div>
            <div class="sidebar__user-role">{{ getRoleText(user.role) }}</div>
          </div>
        </transition>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { Menu, X } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import SidebarMenuItem from './SidebarMenuItem.vue'
import type { MenuItem } from '@/types'

// 组合式API
const router = useRouter()
const authStore = useAuthStore()
const menuStore = useMenuStore()

// 计算属性
const user = computed(() => authStore.user)
const userName = computed(() => authStore.userName)
const userAvatar = computed(() => authStore.userAvatar)
const collapsed = computed(() => menuStore.collapsed)
const visibleMenuItems = computed(() => menuStore.visibleMenuItems)

// 方法
const toggleCollapse = () => {
  menuStore.toggleCollapse()
}

const handleMenuSelect = (item: MenuItem) => {
  if (item.path) {
    router.push({ name: getRouteNameFromPath(item.path) })
    menuStore.setActiveMenu(item.id)
  }
}

const getRouteNameFromPath = (path: string): string => {
  // 将路径转换为路由名称
  return path.replace(/^\//, '').replace(/\//g, '-')
}

const getRoleText = (role: string): string => {
  const roleMap: Record<string, string> = {
    superAdmin: '超级管理员',
    manager: '部门经理',
    staff: '员工',
    finance: '财务人员',
    sales: '销售人员'
  }
  return roleMap[role] || role
}
</script>

<style scoped>
.sidebar {
  width: var(--sidebar-width);
  height: 100vh;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  transition: width var(--duration-normal);
  position: fixed;
  left: 0;
  top: 0;
  z-index: var(--z-fixed);
}

.sidebar--collapsed {
  width: var(--sidebar-collapsed-width);
}

.sidebar__header {
  height: var(--header-height);
  padding: var(--spacing-md);
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border-light);
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  min-width: 0;
}

.sidebar__logo-img {
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-sm);
  flex-shrink: 0;
}

.sidebar__logo-text {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
}

.sidebar__toggle {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
  flex-shrink: 0;
}

.sidebar__toggle:hover {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.sidebar__nav {
  flex: 1;
  padding: var(--spacing-md) 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.sidebar__menu {
  padding: 0 var(--spacing-sm);
}

.sidebar__footer {
  padding: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  transition: background-color var(--duration-fast);
}

.sidebar__user:hover {
  background: var(--color-background);
}

.sidebar__user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.sidebar__user-info {
  flex: 1;
  min-width: 0;
}

.sidebar__user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar__user-role {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-fast);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* 响应式 */
@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    transition: transform var(--duration-normal);
  }
  
  .sidebar.sidebar--mobile-open {
    transform: translateX(0);
  }
}
</style>