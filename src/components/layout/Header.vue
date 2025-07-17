<template>
  <header class="header" :class="{ 'header--collapsed': collapsed }">
    <div class="header__left">
      <!-- 移动端菜单按钮 -->
      <button
        class="header__mobile-menu"
        @click="toggleMobileMenu"
      >
        <Menu :size="20" />
      </button>

      <!-- 返回按钮 -->
      <button
        v-if="showBackButton"
        class="header__back-button"
        @click="goBack"
        :title="backButtonTitle"
      >
        <ArrowLeft :size="16" />
        <span class="header__back-text">{{ backButtonText }}</span>
      </button>

      <!-- 面包屑导航 -->
      <nav class="header__breadcrumb">
        <div
          v-for="(item, index) in breadcrumb"
          :key="item.id"
          class="header__breadcrumb-item"
        >
          <component
            :is="getIcon(item.icon)"
            :size="16"
            class="header__breadcrumb-icon"
          />
          <span class="header__breadcrumb-text">{{ item.name }}</span>
          <ChevronRight
            v-if="index < breadcrumb.length - 1"
            :size="14"
            class="header__breadcrumb-separator"
          />
        </div>
      </nav>
    </div>

    <div class="header__right">
      <!-- 搜索框 -->
      <div class="header__search">
        <Search :size="16" class="header__search-icon" />
        <input
          type="text"
          placeholder="搜索..."
          class="header__search-input"
          v-model="searchKeyword"
          @keyup.enter="handleSearch"
        />
      </div>

      <!-- 主题切换 -->
      <button
        class="header__theme-toggle"
        @click="toggleTheme"
        :title="currentTheme === 'light' ? '切换到深色模式' : '切换到浅色模式'"
      >
        <Sun v-if="currentTheme === 'dark'" :size="20" />
        <Moon v-else :size="20" />
      </button>

      <!-- 通知中心 -->
      <div class="header__notifications">
        <button
          class="header__notification-btn"
          @click="toggleNotifications"
          :class="{ 'header__notification-btn--active': showNotifications }"
        >
          <Bell :size="20" />
          <span v-if="unreadCount > 0" class="header__notification-badge">
            {{ unreadCount > 99 ? '99+' : unreadCount }}
          </span>
        </button>

        <!-- 通知面板 -->
        <Transition name="slide-down">
          <div v-show="showNotifications" class="header__notification-panel">
            <div class="header__notification-header">
              <h3>通知中心</h3>
              <button @click="markAllAsRead" class="header__mark-all-read">
                全部已读
              </button>
            </div>
            <div class="header__notification-list">
              <div
                v-for="alert in recentAlerts"
                :key="alert.id"
                class="header__notification-item"
                :class="{ 'header__notification-item--unread': !alert.isRead }"
                @click="handleNotificationClick(alert)"
              >
                <div class="header__notification-content">
                  <div class="header__notification-title">{{ alert.title }}</div>
                  <div class="header__notification-message">{{ alert.message }}</div>
                  <div class="header__notification-time">{{ formatTime(alert.createdAt) }}</div>
                </div>
                <div
                  class="header__notification-indicator"
                  :class="`header__notification-indicator--${alert.level}`"
                ></div>
              </div>
            </div>
            <div class="header__notification-footer">
              <router-link to="/dashboard/alerts" class="header__view-all">
                查看全部通知
              </router-link>
            </div>
          </div>
        </Transition>
      </div>

      <!-- 用户菜单 -->
      <div class="header__user">
        <button
          class="header__user-btn"
          @click="toggleUserMenu"
          :class="{ 'header__user-btn--active': showUserMenu }"
        >
          <img
            :src="getUserAvatarUrl()"
            :alt="userName"
            class="header__user-avatar"
          />
          <span class="header__user-name">{{ userName }}</span>
          <ChevronDown :size="16" class="header__user-arrow" />
        </button>

        <!-- 用户菜单面板 -->
        <Transition name="slide-down">
          <div v-show="showUserMenu" class="header__user-panel">
            <div class="header__user-info">
              <img
                :src="getUserAvatarUrl()"
                :alt="userName"
                class="header__user-info-avatar"
              />
              <div class="header__user-info-details">
                <div class="header__user-info-name">{{ userName }}</div>
                <div class="header__user-info-role">{{ getRoleText(user?.role) }}</div>
                <div class="header__user-info-email">{{ user?.email }}</div>
              </div>
            </div>
            <div class="header__user-actions">
              <router-link to="/profile" class="header__user-action">
                <User :size="16" />
                个人资料
              </router-link>
              <router-link to="/settings/theme" class="header__user-action">
                <Palette :size="16" />
                主题设置
              </router-link>
              <button @click="handleLogout" class="header__user-action header__user-action--danger">
                <LogOut :size="16" />
                退出登录
              </button>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Menu,
  ChevronRight,
  Search,
  Sun,
  Moon,
  Bell,
  ChevronDown,
  User,
  Palette,
  LogOut,
  BarChart3,
  PieChart,
  Target,
  Globe,
  TrendingUp,
  Calendar,
  Package,
  Users,
  MapPin,
  FileText,
  Megaphone,
  Monitor,
  List,
  BarChart,
  DollarSign,
  Star,
  Building,
  Award,
  FolderOpen,
  Settings,
  Shield,
  Cog,
  ArrowLeft
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { setThemeMode, themeMode } from '@/assets/theme'
import { mockGetAlerts, mockMarkAlertAsRead } from '@/mock'
import type { Alert } from '@/types'

// 组合式API
const router = useRouter()
const authStore = useAuthStore()
const menuStore = useMenuStore()

// 响应式数据
const searchKeyword = ref('')
const showNotifications = ref(false)
const showUserMenu = ref(false)
const recentAlerts = ref<Alert[]>([])

// 计算属性
const user = computed(() => authStore.user)
const userName = computed(() => authStore.userName)
const userAvatar = computed(() => authStore.userAvatar)
const breadcrumb = computed(() => menuStore.getBreadcrumb)
const currentTheme = computed(() => themeMode.value)
const unreadCount = computed(() => recentAlerts.value.filter(a => !a.isRead).length)
const collapsed = computed(() => menuStore.collapsed)

// 返回按钮相关
const showBackButton = computed(() => {
  // 检查当前路由是否为特定的子页面
  const routeName = router.currentRoute.value.name
  if (typeof routeName === 'string') {
    return routeName.includes('bing-dashboard') ||
           routeName.includes('google-dashboard') ||
           routeName.includes('meta-dashboard') ||
           routeName.includes('criteo-dashboard')
  }
  return false
})

const backButtonTitle = computed(() => {
  return '返回数据看板'
})

const backButtonText = computed(() => {
  const routeName = router.currentRoute.value.name
  if (typeof routeName === 'string') {
    if (routeName.includes('dashboard')) {
      return '返回数据看板'
    }
  }
  return '返回'
})

// 图标映射
const iconMap = {
  BarChart3, PieChart, Target, Globe, TrendingUp, Calendar, Package, Users,
  MapPin, FileText, Search: Search, Megaphone, Facebook: Monitor, Chrome: Monitor, Monitor,
  UserCheck: Users, List, BarChart, DollarSign, Star, Building, Award, FolderOpen,
  Settings, UserCog: Users, Shield, Palette, Cog
}

// 方法
const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || BarChart3
}

const toggleMobileMenu = () => {
  // 移动端菜单切换逻辑
  menuStore.toggleCollapse()
}

const toggleTheme = () => {
  const newTheme = currentTheme.value === 'light' ? 'dark' : 'light'
  setThemeMode(newTheme)
}

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    // 实现搜索逻辑
    console.log('搜索:', searchKeyword.value)
  }
}

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  if (showUserMenu.value) {
    showUserMenu.value = false
  }
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  if (showNotifications.value) {
    showNotifications.value = false
  }
}

const handleNotificationClick = async (alert: Alert) => {
  if (!alert.isRead) {
    await mockMarkAlertAsRead(alert.id)
    alert.isRead = true
  }
  // 根据通知类型跳转到相应页面
  if (alert.customerId) {
    router.push({ name: 'customer-detail', params: { id: alert.customerId } })
  }
}

const markAllAsRead = async () => {
  for (const alert of recentAlerts.value) {
    if (!alert.isRead) {
      await mockMarkAlertAsRead(alert.id)
      alert.isRead = true
    }
  }
}

const handleLogout = async () => {
  const result = await authStore.logout()
  if (result.success) {
    router.push({ name: 'login' })
  }
}

const getRoleText = (role?: string): string => {
  const roleMap: Record<string, string> = {
    superAdmin: '超级管理员',
    manager: '部门经理',
    staff: '员工',
    finance: '财务人员',
    sales: '销售人员'
  }
  return role ? roleMap[role] || role : ''
}

const formatTime = (time: string): string => {
  const now = new Date()
  const alertTime = new Date(time)
  const diff = now.getTime() - alertTime.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  if (minutes > 0) return `${minutes}分钟前`
  return '刚刚'
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

const goBack = () => {
  // 直接返回到主数据看板页面
  router.push({ name: 'dashboard' })
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.header__notifications')) {
    showNotifications.value = false
  }
  if (!target.closest('.header__user')) {
    showUserMenu.value = false
  }
}

// 生命周期
onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  // 加载预警数据
  try {
    const response = await mockGetAlerts()
    if (response.success && response.data) {
      recentAlerts.value = response.data.slice(0, 5) // 只显示最近5条
    }
  } catch (error) {
    console.error('加载通知失败:', error)
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.header {
  height: var(--header-height);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-lg);
  position: fixed;
  top: 0;
  left: var(--sidebar-width);
  right: 0;
  z-index: var(--z-sticky);
  transition: left var(--duration-normal);
}

.header--collapsed {
  left: var(--sidebar-collapsed-width);
}

.header__left,
.header__right {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.header__mobile-menu {
  display: none;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.header__mobile-menu:hover {
  background: var(--color-background);
  color: var(--color-primary);
}

.header__back-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm);
  background: none;
  border: none;
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.header__back-button:hover {
  background: var(--color-background);
  color: var(--color-primary);
}

.header__back-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.header__breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.header__breadcrumb-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.header__breadcrumb-item:last-child {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.header__breadcrumb-icon {
  flex-shrink: 0;
}

.header__breadcrumb-separator {
  color: var(--color-text-disabled);
  margin: 0 var(--spacing-xs);
}

.header__search {
  position: relative;
  display: flex;
  align-items: center;
}

.header__search-icon {
  position: absolute;
  left: var(--spacing-sm);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.header__search-input {
  width: 300px;
  height: 36px;
  padding: 0 var(--spacing-sm) 0 36px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-background);
  font-size: var(--font-size-sm);
  transition: all var(--duration-fast);
}

.header__search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.header__theme-toggle,
.header__notification-btn,
.header__user-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  background: none;
  border: none;
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.header__theme-toggle:hover,
.header__notification-btn:hover,
.header__user-btn:hover {
  background: var(--color-background);
  color: var(--color-primary);
}

.header__notifications,
.header__user {
  position: relative;
}

.header__notification-btn--active,
.header__user-btn--active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.header__notification-badge {
  position: absolute;
  top: 0;
  right: 0;
  background: var(--color-error);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.header__user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
}

.header__user-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.header__notification-panel,
.header__user-panel {
  position: absolute;
  top: calc(100% + var(--spacing-sm));
  right: 0;
  width: 320px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-lg);
  z-index: var(--z-dropdown);
}

.header__notification-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-light);
}

.header__notification-header h3 {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.header__mark-all-read {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.header__notification-list {
  max-height: 300px;
  overflow-y: auto;
}

.header__notification-item {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background-color var(--duration-fast);
}

.header__notification-item:hover {
  background: var(--color-background);
}

.header__notification-item--unread {
  background: var(--color-primary-light);
}

.header__notification-content {
  flex: 1;
  min-width: 0;
}

.header__notification-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.header__notification-message {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin-bottom: var(--spacing-xs);
}

.header__notification-time {
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
}

.header__notification-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: var(--spacing-xs);
}

.header__notification-indicator--low { background: var(--color-info); }
.header__notification-indicator--medium { background: var(--color-warning); }
.header__notification-indicator--high { background: var(--color-error); }
.header__notification-indicator--critical { background: var(--color-error); }

.header__notification-footer {
  padding: var(--spacing-md);
  text-align: center;
  border-top: 1px solid var(--color-border-light);
}

.header__view-all {
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.header__user-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-light);
}

.header__user-info-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.header__user-info-name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.header__user-info-role,
.header__user-info-email {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.header__user-actions {
  padding: var(--spacing-sm) 0;
}

.header__user-action {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: none;
  text-align: left;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  text-decoration: none;
  cursor: pointer;
  transition: background-color var(--duration-fast);
}

.header__user-action:hover {
  background: var(--color-background);
}

.header__user-action--danger {
  color: var(--color-error);
}

/* 动画 */
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--duration-normal);
  transform-origin: top;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.8);
}

/* 响应式 */
@media (max-width: 768px) {
  .header {
    left: 0;
    padding: 0 var(--spacing-md);
  }

  .header__mobile-menu {
    display: flex;
  }

  .header__search {
    display: none;
  }

  .header__breadcrumb {
    display: none;
  }

  .header__user-name {
    display: none;
  }
}
</style>
