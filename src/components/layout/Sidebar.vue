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
        <SidebarMenuItem
          v-for="item in menuItems"
          :key="item.id"
          :item="item"
          :level="0"
          :is-collapsed="isCollapsed"
          :open-menus="openMenus"
          @toggle-menu="toggleMenu"
          @select-menu="selectMenu"
        />
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
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import type { MenuItem } from '@/types'
import SidebarMenuItem from './SidebarMenuItem.vue'

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

  // 找到对应的菜单项（递归查找）
  const findMenuItem = (items: MenuItem[], id: string): MenuItem | null => {
    for (const item of items) {
      if (item.id === id) return item
      if (item.children) {
        const found = findMenuItem(item.children, id)
        if (found) return found
      }
    }
    return null
  }

  const menuItem = findMenuItem(menuItems.value, menuId)

  // 处理子菜单展开/折叠
  const index = openMenus.value.indexOf(menuId)
  if (index > -1) {
    // 折叠菜单时，也要折叠所有子菜单
    openMenus.value.splice(index, 1)
    // 移除所有以该菜单ID开头的子菜单（递归折叠）
    const closeChildMenus = (item: MenuItem) => {
      if (item.children) {
        item.children.forEach(child => {
          const childIndex = openMenus.value.indexOf(child.id)
          if (childIndex > -1) {
            openMenus.value.splice(childIndex, 1)
          }
          closeChildMenus(child)
        })
      }
    }
    if (menuItem) {
      closeChildMenus(menuItem)
    }
  } else {
    openMenus.value.push(menuId)
  }

  console.log('🔧 当前展开的菜单:', openMenus.value)

  // 如果菜单项有路径，并且有子菜单，则在展开时跳转
  if (menuItem && menuItem.path && menuItem.children && menuItem.children.length > 0) {
    // 只有在展开菜单时才跳转到主菜单路径
    if (openMenus.value.includes(menuId)) {
      console.log('🔧 主菜单项有路径且正在展开，执行跳转:', menuItem.path)
      selectMenu(menuItem)
    }
  }
}

const selectMenu = (item: MenuItem) => {
  console.log('🔧 [MENU CLICK] 选择菜单:', {
    name: item.name,
    path: item.path,
    id: item.id,
    hasChildren: !!(item.children && item.children.length > 0),
    currentUser: authStore.user,
    userRole: authStore.userRole,
    isAuthenticated: authStore.isAuthenticated
  })

  // 自动展开父级菜单
  const ensureParentMenusOpen = (menuId: string) => {
    const findParentPath = (items: MenuItem[], targetId: string, path: string[] = []): string[] | null => {
      for (const menuItem of items) {
        const currentPath = [...path, menuItem.id]
        if (menuItem.id === targetId) {
          return currentPath.slice(0, -1) // 返回父级路径，不包含当前项
        }
        if (menuItem.children) {
          const found = findParentPath(menuItem.children, targetId, currentPath)
          if (found) return found
        }
      }
      return null
    }

    const parentPath = findParentPath(menuItems.value, menuId)
    if (parentPath) {
      parentPath.forEach(parentId => {
        if (!openMenus.value.includes(parentId)) {
          openMenus.value.push(parentId)
        }
      })
    }
  }

  // 确保父级菜单展开
  ensureParentMenusOpen(item.id)

  if (item.path) {
    console.log('🔧 [NAVIGATION] 准备跳转到路径:', item.path)
    console.log('🔧 [NAVIGATION] 当前路由状态:', {
      currentPath: router.currentRoute.value.path,
      routerReady: !!router.isReady
    })

    // 检查是否是仪表板子模块，如果是则跳转到主仪表板并滚动到对应模块
    if (item.path.startsWith('/dashboard/') && item.path !== '/dashboard' && !item.path.startsWith('/dashboard/business')) {
      const sectionId = item.path.replace('/dashboard/', '')
      console.log('🔧 [DASHBOARD] 仪表板子模块跳转:', sectionId)

      // 跳转到主仪表板
      router.push('/dashboard').then(() => {
        console.log('🔧 [DASHBOARD] 主仪表板跳转成功，准备滚动到:', sectionId)
        // 等待页面渲染完成后滚动到对应模块
        setTimeout(() => {
          const element = document.getElementById(sectionId)
          if (element) {
            element.scrollIntoView({
              behavior: 'smooth',
              block: 'start'
            })
            console.log('🔧 [DASHBOARD] 滚动到模块成功:', sectionId)
          } else {
            console.warn('🔧 [DASHBOARD] 找不到模块元素:', sectionId)
          }
        }, 100)
      }).catch((error) => {
        console.error('🔧 [DASHBOARD] 仪表板跳转失败:', error)
      })
    } else {
      // 直接跳转到指定路径
      console.log('🔧 [NAVIGATION] 直接跳转到路径:', item.path)

      router.push(item.path).then(() => {
        console.log('🔧 [NAVIGATION] 路由跳转成功到:', item.path)
        // 设置活跃菜单
        menuStore.setActiveMenu(item.id)
      }).catch((error) => {
        console.error('🔧 [NAVIGATION] 路由跳转失败:', {
          targetPath: item.path,
          error: error,
          errorMessage: error.message || '未知错误'
        })
      })
    }
  } else {
    console.log('🔧 [MENU] 菜单项没有路径，无法跳转')
    // 如果没有路径但有子菜单，则切换展开状态
    if (item.children && item.children.length > 0) {
      console.log('🔧 [MENU] 有子菜单，切换展开状态')
      toggleMenu(item.id)
    }
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
  console.log('🔧 可见菜单项:', menuItems.value.map(item => ({ id: item.id, name: item.name, path: item.path })))

  // 根据当前路径设置菜单状态
  const currentPath = router.currentRoute.value.path
  console.log('🔧 当前路径:', currentPath)

  // 如果当前在客户相关页面，确保客户管理菜单展开
  if (currentPath.startsWith('/customers')) {
    console.log('🔧 当前在客户页面，展开客户管理菜单')
    if (!openMenus.value.includes('customers')) {
      openMenus.value.push('customers')
    }
    // 设置活跃菜单
    menuStore.setActiveMenuByPath(currentPath)
  }

  // 确保数据看板菜单默认展开
  if (!openMenus.value.includes('dashboard')) {
    openMenus.value.push('dashboard')
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
