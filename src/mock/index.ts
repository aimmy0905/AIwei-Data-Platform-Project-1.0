// Mock数据统一导出
export * from './auth'
export * from './dashboard'
export * from './menu'

// Mock菜单数据
import type { MenuItem, UserRole } from '@/types'

export const mockMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    name: '数据看板',
    icon: 'BarChart3',
    children: [
      {
        id: 'overview',
        name: '概览看板',
        icon: 'PieChart',
        path: '/dashboard/overview',
        roles: ['superAdmin', 'manager', 'staff', 'finance', 'sales']
      },
      {
        id: 'customer-goals',
        name: '客户目标',
        icon: 'Target',
        path: '/dashboard/customer-goals',
        roles: ['superAdmin', 'manager', 'staff', 'sales']
      },
      {
        id: 'website-data',
        name: '网站数据',
        icon: 'Globe',
        path: '/dashboard/website-data',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'channel-data',
        name: '渠道数据',
        icon: 'TrendingUp',
        path: '/dashboard/channel-data',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'campaign-data',
        name: '活动数据',
        icon: 'Calendar',
        path: '/dashboard/campaign-data',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'product-sales',
        name: '产品销售',
        icon: 'Package',
        path: '/dashboard/product-sales',
        roles: ['superAdmin', 'manager', 'staff', 'sales']
      },
      {
        id: 'influencer-data',
        name: '红人数据',
        icon: 'Users',
        path: '/dashboard/influencer-data',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'regional-market',
        name: '地区市场',
        icon: 'MapPin',
        path: '/dashboard/regional-market',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'page-performance',
        name: '页面表现',
        icon: 'FileText',
        path: '/dashboard/page-performance',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'competitor-analysis',
        name: '竞品分析',
        icon: 'Search',
        path: '/dashboard/competitor-analysis',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'ad-data',
        name: '广告数据',
        icon: 'Megaphone',
        children: [
          {
            id: 'meta-ads',
            name: 'Meta数据',
            icon: 'Facebook',
            path: '/dashboard/ad-data/meta',
            roles: ['superAdmin', 'manager', 'staff']
          },
          {
            id: 'google-ads',
            name: 'Google数据',
            icon: 'Chrome',
            path: '/dashboard/ad-data/google',
            roles: ['superAdmin', 'manager', 'staff']
          },
          {
            id: 'criteo-ads',
            name: 'Criteo数据',
            icon: 'Monitor',
            path: '/dashboard/ad-data/criteo',
            roles: ['superAdmin', 'manager', 'staff']
          },
          {
            id: 'bing-ads',
            name: 'Bing数据',
            icon: 'Search',
            path: '/dashboard/ad-data/bing',
            roles: ['superAdmin', 'manager', 'staff']
          }
        ],
        roles: ['superAdmin', 'manager', 'staff']
      }
    ],
    roles: ['superAdmin', 'manager', 'staff', 'finance', 'sales']
  },
  {
    id: 'customers',
    name: '客户管理',
    icon: 'UserCheck',
    children: [
      {
        id: 'customer-list',
        name: '客户列表',
        icon: 'List',
        path: '/customers/list',
        roles: ['superAdmin', 'manager', 'staff', 'sales']
      },
      {
        id: 'customer-data',
        name: '客户数据',
        icon: 'BarChart',
        path: '/customers/data',
        roles: ['superAdmin', 'manager', 'staff', 'sales']
      },
      {
        id: 'service-fees',
        name: '服务费管理',
        icon: 'DollarSign',
        path: '/customers/service-fees',
        roles: ['superAdmin', 'manager', 'finance']
      },
      {
        id: 'customer-reviews',
        name: '客户评价',
        icon: 'Star',
        path: '/customers/reviews',
        roles: ['superAdmin', 'manager', 'staff', 'sales']
      }
    ],
    roles: ['superAdmin', 'manager', 'staff', 'finance', 'sales']
  },
  {
    id: 'departments',
    name: '部门管理',
    icon: 'Building',
    children: [
      {
        id: 'organization',
        name: '组织架构',
        icon: 'Sitemap',
        path: '/departments/organization',
        roles: ['superAdmin', 'manager']
      },
      {
        id: 'employees',
        name: '员工管理',
        icon: 'Users',
        path: '/departments/employees',
        roles: ['superAdmin', 'manager']
      },
      {
        id: 'performance',
        name: '绩效考核',
        icon: 'Award',
        path: '/departments/performance',
        roles: ['superAdmin', 'manager']
      },
      {
        id: 'goals',
        name: '目标设置',
        icon: 'Target',
        path: '/departments/goals',
        roles: ['superAdmin', 'manager']
      }
    ],
    roles: ['superAdmin', 'manager']
  },
  {
    id: 'performance-management',
    name: '业绩管理',
    icon: 'TrendingUp',
    children: [
      {
        id: 'performance-dashboard',
        name: '业绩看板',
        icon: 'BarChart3',
        path: '/performance/dashboard',
        roles: ['superAdmin', 'manager', 'staff', 'sales']
      },
      {
        id: 'reports',
        name: '周报月报',
        icon: 'FileText',
        path: '/performance/reports',
        roles: ['superAdmin', 'manager', 'staff', 'sales']
      },
      {
        id: 'projects',
        name: '项目管理',
        icon: 'FolderOpen',
        path: '/performance/projects',
        roles: ['superAdmin', 'manager', 'staff']
      }
    ],
    roles: ['superAdmin', 'manager', 'staff', 'sales']
  },
  {
    id: 'settings',
    name: '系统设置',
    icon: 'Settings',
    children: [
      {
        id: 'users',
        name: '用户管理',
        icon: 'UserCog',
        path: '/settings/users',
        roles: ['superAdmin']
      },
      {
        id: 'permissions',
        name: '权限设置',
        icon: 'Shield',
        path: '/settings/permissions',
        roles: ['superAdmin']
      },
      {
        id: 'theme',
        name: '主题设置',
        icon: 'Palette',
        path: '/settings/theme',
        roles: ['superAdmin', 'manager', 'staff', 'finance', 'sales']
      },
      {
        id: 'system',
        name: '系统配置',
        icon: 'Cog',
        path: '/settings/system',
        roles: ['superAdmin']
      }
    ],
    roles: ['superAdmin', 'manager', 'staff', 'finance', 'sales']
  }
]

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