// 导出所有 mock 数据
export * from './auth'
export * from './dashboard'
export * from './bing-dashboard'
export * from './menu'
export * from './customer'
export * from './service-fees'

// Mock菜单数据
import type { MenuItem, UserRole } from '@/types'
import { mockMenuItems as menuItems } from './menu'

export const mockMenuItems: MenuItem[] = menuItems

// 根据用户角色过滤菜单
export const getMenuByRole = (role: UserRole): MenuItem[] => {
  const filterMenu = (items: MenuItem[]): MenuItem[] => {
    return items.filter(item => {
      if (item.roles && !item.roles.includes(role)) {
        return false
      }
      if (item.children) {
        item.children = filterMenu(item.children)
        return item.children.length > 0
      }
      return true
    })
  }

  return filterMenu(JSON.parse(JSON.stringify(mockMenuItems)))
}

// Mock获取菜单API
export const mockGetMenu = (role: UserRole): Promise<{ success: boolean; data: MenuItem[] }> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: getMenuByRole(role)
      })
    }, 300)
  })
}
