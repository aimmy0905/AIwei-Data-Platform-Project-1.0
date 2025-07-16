<template>
  <aside
    class="sidebar"
    :class="{ 'sidebar--collapsed': isCollapsed }"
  >
    <!-- 侧边栏头部 -->
    <div class="sidebar__header">
      <div class="sidebar__logo">
        <img src="/LOGO-new.webp" alt="Logo" class="sidebar__logo-img" />
        <span v-if="!isCollapsed" class="sidebar__logo-text">
          艾维数据平台
        </span>
      </div>
      <button
        class="sidebar__toggle"
        @click="handleToggle"
        :title="isCollapsed ? '展开菜单' : '折叠菜单'"
      >
        <ChevronRight v-if="isCollapsed" :size="20" />
        <ChevronLeft v-else :size="20" />
      </button>
    </div>



    <!-- 菜单列表 -->
    <nav class="sidebar__nav">
      <div class="sidebar__menu">
        <div
          v-for="item in menuItems"
          :key="item.id"
          class="menu-item"
        >
          <!-- 有子菜单的项目 -->
          <div v-if="item.children && item.children.length > 0">
            <div
              class="menu-item__header"
              :class="{ 'menu-item__header--active': openMenus.includes(item.id) }"
              @click.stop="toggleMenu(item.id)"
              style="cursor: pointer; padding: 12px 16px; display: flex; align-items: center; justify-content: space-between; border-radius: 6px; transition: all 0.2s;"
            >
              <div style="display: flex; align-items: center; gap: 8px;">
                <component :is="getIcon(item.icon)" :size="20" />
                <span v-if="!isCollapsed">{{ item.name }}</span>
              </div>
              <ChevronDown
                v-if="!isCollapsed"
                :size="16"
                :style="{ transform: openMenus.includes(item.id) ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }"
              />
            </div>

            <!-- 子菜单 -->
            <div
              v-if="openMenus.includes(item.id) && !isCollapsed"
              class="submenu"
              style="padding-left: 20px; margin-top: 4px;"
            >
              <div
                v-for="child in item.children"
                :key="child.id"
                class="menu-item__link"
                @click.stop="selectMenu(child)"
                style="cursor: pointer; padding: 8px 16px; border-radius: 4px; margin-bottom: 2px; transition: all 0.2s;"
              >
                <div style="display: flex; align-items: center; gap: 8px;">
                  <component :is="getIcon(child.icon)" :size="18" />
                  <span>{{ child.name }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- 普通菜单项 -->
          <div
            v-else
            class="menu-item__link"
            @click="selectMenu(item)"
            style="cursor: pointer; padding: 12px 16px; border-radius: 6px; margin-bottom: 4px; transition: all 0.2s;"
          >
            <div style="display: flex; align-items: center; gap: 8px;">
              <component :is="getIcon(item.icon)" :size="20" />
              <span v-if="!isCollapsed">{{ item.name }}</span>
            </div>
          </div>
        </div>
      </div>
    </nav>

    <!-- 用户信息 -->
    <div class="sidebar__footer" v-if="currentUser">
      <div class="sidebar__user">
        <img :src="getUserAvatar()" :alt="currentUser.username" class="sidebar__user-avatar" />
        <div v-if="!isCollapsed" class="sidebar__user-info">
          <div class="sidebar__user-name">{{ currentUser.username }}</div>
          <div class="sidebar__user-role">{{ getRoleText(currentUser.role) }}</div>
        </div>
      </div>
    </div>
  </aside>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  BarChart3,
  Target,
  Globe,
  TrendingUp,
  Calendar,
  Package,
  Users,
  MapPin,
  FileText,
  Search,
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
  Palette,
  Cog
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import type { MenuItem } from '@/types'

// 组合式API
const router = useRouter()
const authStore = useAuthStore()
const menuStore = useMenuStore()

// 本地状态
const isCollapsed = ref(false)
const clickCount = ref(0)
const openMenus = ref<string[]>(['dashboard']) // 默认展开数据看板

// 监听store的折叠状态变化
watch(() => menuStore.collapsed, (newValue) => {
  console.log('🔧 Store折叠状态变化:', newValue)
  isCollapsed.value = newValue
}, { immediate: true })

// 计算属性
const currentUser = computed(() => authStore.user)
const menuItems = computed(() => menuStore.visibleMenuItems)

// 图标映射
const iconMap = {
  BarChart3, Target, Globe, TrendingUp, Calendar, Package, Users, MapPin,
  FileText, Search, Megaphone, Monitor, List, BarChart, DollarSign, Star,
  Building, Award, FolderOpen, Settings, Shield, Palette, Cog,
  Facebook: Monitor,
  Chrome: Monitor,
  UserCheck: Users,
  UserCog: Users,
  Sitemap: Building,
  AlertTriangle: Search,
  Download: DollarSign,
  Tool: Settings
}

// 方法
const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || BarChart3
}

const handleToggle = () => {
  clickCount.value++
  isCollapsed.value = !isCollapsed.value
  console.log('🔧 侧边栏折叠状态:', isCollapsed.value)

  // 同步到store - 使用store的方法
  menuStore.toggleCollapse()

  // 折叠时清空展开的菜单
  if (isCollapsed.value) {
    openMenus.value = []
  } else {
    openMenus.value = ['dashboard'] // 展开时恢复数据看板
  }
}

const toggleMenu = (menuId: string) => {
  console.log('🔧 切换菜单:', menuId)

  // 找到对应的菜单项
  const menuItem = menuItems.value.find(item => item.id === menuId)

  // 如果菜单项有路径，先跳转
  if (menuItem && menuItem.path) {
    console.log('🔧 主菜单项有路径，执行跳转:', menuItem.path)
    selectMenu(menuItem)
  }

  // 然后处理子菜单展开/折叠
  const index = openMenus.value.indexOf(menuId)
  if (index > -1) {
    openMenus.value.splice(index, 1)
  } else {
    openMenus.value.push(menuId)
  }

  console.log('🔧 当前展开的菜单:', openMenus.value)
}

const selectMenu = (item: MenuItem) => {
  console.log('🔧 选择菜单:', item.name, item.path)
  console.log('🔧 菜单项完整信息:', JSON.stringify(item, null, 2))

  if (item.path) {
    console.log('🔧 准备跳转到路径:', item.path)

    // 特殊处理：如果是客户相关菜单，确保客户管理菜单展开
    if (item.id === 'customer-list' || item.path === '/customers' || item.path?.startsWith('/customers')) {
      console.log('🔧 客户菜单点击，确保客户管理菜单展开')
      // 确保客户管理菜单展开
      if (!openMenus.value.includes('customers')) {
        openMenus.value.push('customers')
      }

      router.push(item.path).then(() => {
        console.log('🔧 客户菜单路由跳转成功')
      }).catch((error) => {
        console.error('🔧 客户菜单路由跳转失败:', error)
      })

      // 设置活跃菜单
      menuStore.setActiveMenu(item.id)
      return
    }

    // 检查是否是仪表板子模块，如果是则跳转到主仪表板并滚动到对应模块
    if (item.path.startsWith('/dashboard/') && item.path !== '/dashboard') {
      const sectionId = item.path.replace('/dashboard/', '')
      console.log('🔧 仪表板子模块跳转:', sectionId)

      // 跳转到主仪表板
      router.push('/dashboard').then(() => {
        // 等待页面渲染完成后滚动到对应模块
        setTimeout(() => {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
          }
        }, 100)
      })
    } else {
      // 直接跳转到指定路径
      console.log('🔧 直接跳转到路径:', item.path)
      router.push(item.path).then(() => {
        console.log('🔧 路由跳转成功')
      }).catch((error) => {
        console.error('🔧 路由跳转失败:', error)
      })
    }
  } else {
    console.log('🔧 菜单项没有路径，无法跳转')
  }

  // 设置活跃菜单
  menuStore.setActiveMenu(item.id)
}

const getRoleText = (role: string): string => {
  const roleMap: Record<string, string> = {
    admin: '管理员',
    superAdmin: '超级管理员',
    manager: '部门经理',
    staff: '员工',
    finance: '财务人员',
    sales: '销售人员'
  }
  return roleMap[role] || role
}

const getUserAvatar = (): string => {
  const role = currentUser.value?.role || 'default'
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



// 生命周期
onMounted(async () => {
  console.log('🔧 侧边栏组件已挂载')

  // 自动登录
  if (!authStore.isAuthenticated) {
    console.log('🔧 自动登录中...')
    await authStore.login({
      username: 'admin',
      password: 'admin123',
      remember: false
    })
  }

  // 加载菜单
  if (authStore.userRole) {
    await menuStore.loadMenu(authStore.userRole)
  }

  console.log('🔧 菜单加载完成，菜单项数量:', menuItems.value.length)

  // 根据当前路径设置菜单状态
  const currentPath = router.currentRoute.value.path
  console.log('🔧 当前路径:', currentPath)

  // 如果当前在客户相关页面，确保客户管理菜单展开
  if (currentPath.startsWith('/customers')) {
    console.log('🔧 当前在客户页面，展开客户管理菜单')
    if (!openMenus.value.includes('customers')) {
      openMenus.value.push('customers')
    }
  }
})
</script>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: #ffffff;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 1000;
  transition: width 0.3s ease;
}

.sidebar--collapsed {
  width: 80px;
}

.sidebar__header {
  height: 64px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f0f0f0;
}

.sidebar__logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar__logo-img {
  width: 32px;
  height: 32px;
}

.sidebar__logo-text {
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.sidebar__toggle {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f5f5f5;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  transition: all 0.2s;
}

.sidebar__toggle:hover {
  background: #e0e0e0;
  color: #333;
}

.sidebar__nav {
  flex: 1;
  padding: 16px 8px;
  overflow-y: auto;
}

.menu-item__header:hover,
.menu-item__link:hover {
  background: #f5f5f5 !important;
}

.menu-item__header--active {
  background: #e3f2fd !important;
  color: #1976d2 !important;
}

.sidebar__footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
}

.sidebar__user {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sidebar__user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.sidebar__user-info {
  flex: 1;
}

.sidebar__user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.sidebar__user-role {
  font-size: 12px;
  color: #666;
}


</style>
