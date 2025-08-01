import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { MenuItem, UserRole } from '@/types'
import { mockGetMenu } from '@/mock'
import { useAuthStore } from './auth'

export const useMenuStore = defineStore('menu', () => {
  // 状态
  const menuItems = ref<MenuItem[]>([])
  const collapsed = ref(false)
  const activeMenuId = ref('')
  const openKeys = ref<string[]>([])
  const loading = ref(false)

  // 计算属性
  const visibleMenuItems = computed(() => {
    const authStore = useAuthStore()
    if (!authStore.userRole) return []

    return filterMenuByRole(menuItems.value, authStore.userRole)
  })

  const currentMenu = computed(() => {
    return findMenuById(menuItems.value, activeMenuId.value)
  })

  // 根据角色过滤菜单
  const filterMenuByRole = (items: MenuItem[], role: UserRole): MenuItem[] => {
    return items.filter(item => {
      // 检查当前菜单项权限
      if (item.roles && !item.roles.includes(role)) {
        return false
      }

      // 递归过滤子菜单
      if (item.children) {
        item.children = filterMenuByRole(item.children, role)
        // 如果子菜单为空且当前菜单没有路径，则不显示
        return item.children.length > 0 || item.path
      }

      return true
    })
  }

  // 根据ID查找菜单项
  const findMenuById = (items: MenuItem[], id: string): MenuItem | null => {
    for (const item of items) {
      if (item.id === id) {
        return item
      }
      if (item.children) {
        const found = findMenuById(item.children, id)
        if (found) return found
      }
    }
    return null
  }

  // 根据路径查找菜单项
  const findMenuByPath = (items: MenuItem[], path: string): MenuItem | null => {
    for (const item of items) {
      if (item.path === path) {
        return item
      }
      if (item.children) {
        const found = findMenuByPath(item.children, path)
        if (found) return found
      }
    }
    return null
  }

  // 获取菜单路径
  const getMenuPath = (items: MenuItem[], targetId: string, path: string[] = []): string[] => {
    for (const item of items) {
      const currentPath = [...path, item.id]

      if (item.id === targetId) {
        return currentPath
      }

      if (item.children) {
        const found = getMenuPath(item.children, targetId, currentPath)
        if (found.length > 0) return found
      }
    }
    return []
  }

  // 动作
  const loadMenu = async (role: UserRole) => {
    loading.value = true
    try {
      console.log('Loading menu for role:', role)
      const response = await mockGetMenu(role)
      if (response.success && response.data) {
        menuItems.value = response.data
        console.log('Menu loaded successfully:', response.data)
      }
    } catch (error) {
      console.error('加载菜单失败:', error)
    } finally {
      loading.value = false
    }
  }

  const setActiveMenu = (menuId: string) => {
    activeMenuId.value = menuId

    // 自动展开父级菜单
    const menuPath = getMenuPath(menuItems.value, menuId)
    if (menuPath.length > 1) {
      // 移除最后一个元素（当前菜单），保留父级路径
      const parentPath = menuPath.slice(0, -1)
      openKeys.value = [...new Set([...openKeys.value, ...parentPath])]
    }
  }

  const setActiveMenuByPath = (path: string) => {
    console.log('Setting active menu by path:', path)
    const menu = findMenuByPath(visibleMenuItems.value, path)
    if (menu) {
      console.log('Found menu for path:', menu)
      setActiveMenu(menu.id)
    } else {
      console.log('No menu found for path, trying fallback logic')
      // 如果找不到对应的菜单，尝试处理特殊路径
      if (path.startsWith('/customers')) {
        // 处理客户相关路径
        if (path === '/customers') {
          setActiveMenu('customer-list')
        } else if (path.startsWith('/customers/')) {
          // 客户详情或其他客户子页面，仍然激活客户列表菜单
          setActiveMenu('customer-list')
        }
      } else if (path.startsWith('/dashboard') || path === '/dashboard') {
        if (path === '/dashboard/ad-platform-overview') {
          setActiveMenu('ad-platform-overview')
        } else if (path === '/dashboard/meta-dashboard') {
          setActiveMenu('meta-dashboard')
        } else if (path === '/dashboard/google-dashboard') {
          setActiveMenu('google-dashboard')
        } else if (path === '/dashboard/bing-dashboard') {
          setActiveMenu('bing-dashboard')
        } else if (path === '/dashboard/criteo-dashboard') {
          setActiveMenu('criteo-dashboard')
        } else {
          // 默认设置为第一个dashboard子菜单
          const dashboardMenu = findMenuById(visibleMenuItems.value, 'dashboard')
          if (dashboardMenu?.children && dashboardMenu.children.length > 0) {
            setActiveMenu(dashboardMenu.children[0].id)
          }
        }
      }
    }
  }

  const toggleCollapse = () => {
    console.log('toggleCollapse called, current value:', collapsed.value)
    const oldValue = collapsed.value
    collapsed.value = !collapsed.value
    console.log('toggleCollapse result:', oldValue, '->', collapsed.value)

    // 折叠时清空展开的菜单
    if (collapsed.value) {
      openKeys.value = []
    }

    // 强制触发响应式更新
    console.log('Force trigger reactive update')
  }

  const toggleSubmenu = (menuId: string) => {
    console.log('toggleSubmenu called for:', menuId)
    console.log('Current openKeys:', openKeys.value)

    const index = openKeys.value.indexOf(menuId)
    if (index > -1) {
      console.log('Closing submenu:', menuId)
      openKeys.value.splice(index, 1)
    } else {
      console.log('Opening submenu:', menuId)
      openKeys.value.push(menuId)
    }

    console.log('New openKeys:', openKeys.value)
  }

  const isMenuOpen = (menuId: string) => {
    return openKeys.value.includes(menuId)
  }

  const isMenuActive = (menuId: string) => {
    return activeMenuId.value === menuId
  }

  // 动态面包屑数据
  const dynamicBreadcrumb = ref<MenuItem[]>([])

  // 获取面包屑导航
  const getBreadcrumb = computed(() => {
    // 如果有动态面包屑数据，优先使用
    if (dynamicBreadcrumb.value.length > 0) {
      return dynamicBreadcrumb.value
    }

    if (!activeMenuId.value) return []

    const path = getMenuPath(menuItems.value, activeMenuId.value)
    return path.map(id => findMenuById(menuItems.value, id)).filter(Boolean) as MenuItem[]
  })

  // 获取带徽章的菜单项
  const getMenuWithBadge = (menuId: string, count: number) => {
    const menu = findMenuById(menuItems.value, menuId)
    if (menu) {
      menu.badge = count
    }
  }

  // 清除所有徽章
  const clearAllBadges = () => {
    const clearBadge = (items: MenuItem[]) => {
      items.forEach(item => {
        item.badge = undefined
        if (item.children) {
          clearBadge(item.children)
        }
      })
    }
    clearBadge(menuItems.value)
  }

  // 设置动态面包屑
  const setDynamicBreadcrumb = (breadcrumb: MenuItem[]) => {
    dynamicBreadcrumb.value = breadcrumb
  }

  // 清除动态面包屑
  const clearDynamicBreadcrumb = () => {
    dynamicBreadcrumb.value = []
  }

  return {
    // 状态
    menuItems,
    collapsed,
    activeMenuId,
    openKeys,
    loading,

    // 计算属性
    visibleMenuItems,
    currentMenu,
    getBreadcrumb,

    // 动作
    loadMenu,
    setActiveMenu,
    setActiveMenuByPath,
    toggleCollapse,
    toggleSubmenu,
    isMenuOpen,
    isMenuActive,
    findMenuByPath,
    getMenuWithBadge,
    clearAllBadges,
    setDynamicBreadcrumb,
    clearDynamicBreadcrumb
  }
})
