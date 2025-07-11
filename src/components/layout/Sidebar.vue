<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar--collapsed': collapsed }"
  >
    <!-- 侧边栏头部 -->
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <img src="/LOGO-new.webp" alt="Logo" class="sidebar__logo-img" />
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
        <ChevronRight v-if="collapsed" :size="20" />
        <ChevronLeft v-else :size="20" />
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
          :src="getUserAvatarUrl()"
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
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
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
const visibleMenuItems = computed(() => {
  const items = menuStore.visibleMenuItems
  console.log('Visible menu items:', items)
  return items
})

// 方法
const toggleCollapse = () => {
  menuStore.toggleCollapse()
}

const handleMenuSelect = async (item: MenuItem) => {
  console.log('Menu item selected:', item)

  if (item.path) {
    // 广告数据使用锚点跳转到数据看板页面的对应模块
    if (item.path === '/dashboard/ad-platform-overview') {
      // 先确保导航到数据看板页面
      if (router.currentRoute.value.name !== 'dashboard') {
        await router.push({ name: 'dashboard' })
        // 等待页面渲染完成
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // 然后滚动到广告数据总览部分
      await scrollToSectionWithOffset('ad-platform-overview')
      menuStore.setActiveMenu(item.id)
    } else if (item.path === '/dashboard/meta-dashboard' ||
        item.path === '/dashboard/google-dashboard' ||
        item.path === '/dashboard/bing-dashboard' ||
        item.path === '/dashboard/criteo-dashboard') {
      // 其他广告平台页面直接使用路由跳转
      const routeName = getRouteNameFromPath(item.path)
      console.log('Navigating to route:', routeName)

      try {
        await router.push({ name: routeName })
        menuStore.setActiveMenu(item.id)
      } catch (error) {
        console.error('Navigation failed:', error)
      }
    } else if (item.path.startsWith('/dashboard/')) {
      // 其他数据看板的子菜单，使用锚点跳转
      const sectionId = item.path.replace('/dashboard/', '')

      // 先确保导航到数据看板页面
      if (router.currentRoute.value.name !== 'dashboard') {
        await router.push({ name: 'dashboard' })
        // 等待页面渲染完成
        await new Promise(resolve => setTimeout(resolve, 200))
      }

      // 然后滚动到对应的锚点
      await scrollToSectionWithOffset(sectionId)
      menuStore.setActiveMenu(item.id)
    } else {
      // 其他菜单使用路由跳转
      const routeName = getRouteNameFromPath(item.path)
      console.log('Navigating to route:', routeName)

      try {
        await router.push({ name: routeName })
        menuStore.setActiveMenu(item.id)
      } catch (error) {
        console.error('Navigation failed:', error)
      }
    }
  } else {
    // 如果没有路径，可能是父级菜单，只切换展开状态
    if (item.children && item.children.length > 0) {
      console.log('Toggling submenu for:', item.id)
      menuStore.toggleSubmenu(item.id)
    }
  }
}

// 改进的滚动方法，考虑所有固定元素的高度
const scrollToSectionWithOffset = async (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = 60 // 头部高度
    const filterHeight = 80 // 筛选器高度
    const subNavHeight = 60 // 子菜单导航高度
    const offset = headerHeight + filterHeight + subNavHeight + 20 // 额外间距

    const elementPosition = element.offsetTop - offset

    window.scrollTo({
      top: Math.max(0, elementPosition),
      behavior: 'smooth'
    })

    // 等待滚动完成后触发子菜单导航的状态更新
    await new Promise(resolve => setTimeout(resolve, 100))

    // 手动触发section change事件来同步子菜单导航
    const event = new CustomEvent('dashboard-section-change', {
      detail: { sectionId }
    })
    window.dispatchEvent(event)
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

const getUserAvatarUrl = (): string => {
  // 如果用户有自定义头像，使用自定义头像
  if (userAvatar.value) {
    return userAvatar.value
  }

  // 根据用户角色返回对应的头像
  const role = user.value?.role || 'default'
  const roleAvatarMap: Record<string, string> = {
    admin: '/avatars/admin.svg',
    manager: '/avatars/manager.svg',
    staff: '/avatars/staff.svg',
    finance: '/avatars/finance.svg',
    superAdmin: '/avatars/admin.svg',
    sales: '/avatars/staff.svg'
  }

  return roleAvatarMap[role] || '/avatars/default.svg'
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
  display: none;
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
