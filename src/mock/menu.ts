import type { MenuItem } from '@/types'

// 菜单项定义
export const mockMenuItems: MenuItem[] = [
  {
    id: 'dashboard',
    name: '数据看板',
    icon: 'BarChart3',
    children: [
      {
        id: 'dashboard-alerts',
        name: '预警提醒',
        icon: 'AlertTriangle',
        path: '/dashboard/alerts',
        roles: ['superAdmin', 'manager', 'staff', 'finance', 'sales']
      },
      {
        id: 'dashboard-customer-goals',
        name: '客户目标',
        icon: 'Target',
        path: '/dashboard/customer-goals',
        roles: ['superAdmin', 'manager', 'staff', 'sales']
      },
      {
        id: 'dashboard-website-data',
        name: '网站数据',
        icon: 'Globe',
        path: '/dashboard/website-data',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'dashboard-channel-data',
        name: '渠道数据',
        icon: 'TrendingUp',
        path: '/dashboard/channel-data',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'dashboard-campaign-data',
        name: '活动数据',
        icon: 'Calendar',
        path: '/dashboard/campaign-data',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'dashboard-product-sales',
        name: '产品销售',
        icon: 'Package',
        path: '/dashboard/product-sales',
        roles: ['superAdmin', 'manager', 'staff', 'sales']
      },
      {
        id: 'dashboard-kol-data',
        name: '红人数据',
        icon: 'Users',
        path: '/dashboard/kol-data',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'dashboard-market-data',
        name: '地区市场',
        icon: 'MapPin',
        path: '/dashboard/market-data',
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
            id: 'ad-platform-overview',
            name: '全平台概览',
            icon: 'BarChart',
            path: '/dashboard/ad-platform-overview',
            roles: ['superAdmin', 'manager', 'staff']
          },
          {
            id: 'meta-dashboard',
            name: 'Meta数据',
            icon: 'Facebook',
            path: '/dashboard/meta-dashboard',
            roles: ['superAdmin', 'manager', 'staff']
          },
          {
            id: 'google-dashboard',
            name: 'Google数据',
            icon: 'Chrome',
            path: '/dashboard/google-dashboard',
            roles: ['superAdmin', 'manager', 'staff']
          },
          {
            id: 'bing-dashboard',
            name: 'Bing数据',
            icon: 'Search',
            path: '/dashboard/bing-dashboard',
            roles: ['superAdmin', 'manager', 'staff']
          },
          {
            id: 'criteo-dashboard',
            name: 'Criteo数据',
            icon: 'Monitor',
            path: '/dashboard/criteo-dashboard',
            roles: ['superAdmin', 'manager', 'staff']
          }
        ],
        roles: ['superAdmin', 'manager', 'staff']
      }
    ],
    roles: ['superAdmin', 'manager', 'staff', 'finance', 'sales']
  },
  {
    id: 'business-dashboard',
    name: '业务看板',
    icon: 'PieChart',
    children: [
      // 销售部门看板
      {
        id: 'sales-director-dashboard',
        name: '销售总监看板',
        icon: 'Crown',
        path: '/business/sales-director',
        roles: ['superAdmin', 'sales_director']
      },
      {
        id: 'sales-manager-dashboard',
        name: '销售经理看板',
        icon: 'Users',
        path: '/business/sales-manager',
        roles: ['superAdmin', 'sales_manager']
      },
      {
        id: 'sales-person-dashboard',
        name: '销售人员看板',
        icon: 'User',
        path: '/business/sales-person',
        roles: ['superAdmin', 'sales_person']
      },
      // 运营部门看板
      {
        id: 'project-director-dashboard',
        name: '项目总监看板',
        icon: 'Crown',
        path: '/business/project-director',
        roles: ['superAdmin', 'project_director']
      },
      {
        id: 'project-manager-dashboard',
        name: '项目经理看板',
        icon: 'Users',
        path: '/business/project-manager',
        roles: ['superAdmin', 'project_manager']
      },
      // 优化师看板
      {
        id: 'google-optimizer-dashboard',
        name: 'Google优化师看板',
        icon: 'Chrome',
        path: '/business/google-optimizer',
        roles: ['superAdmin', 'google_optimizer']
      },
      {
        id: 'meta-optimizer-dashboard',
        name: 'Meta优化师看板',
        icon: 'Facebook',
        path: '/business/meta-optimizer',
        roles: ['superAdmin', 'meta_optimizer']
      },
      {
        id: 'criteo-optimizer-dashboard',
        name: 'Criteo优化师看板',
        icon: 'Monitor',
        path: '/business/criteo-optimizer',
        roles: ['superAdmin', 'criteo_optimizer']
      },
      {
        id: 'bing-optimizer-dashboard',
        name: 'Bing优化师看板',
        icon: 'Search',
        path: '/business/bing-optimizer',
        roles: ['superAdmin', 'bing_optimizer']
      },
      // 财务部门看板
      {
        id: 'finance-director-dashboard',
        name: '财务总监看板',
        icon: 'DollarSign',
        path: '/business/finance-director',
        roles: ['superAdmin', 'finance_director']
      }
    ],
    roles: ['superAdmin', 'sales_director', 'sales_manager', 'sales_person', 'project_director', 'project_manager', 'google_optimizer', 'meta_optimizer', 'criteo_optimizer', 'bing_optimizer', 'finance_director']
  },
  {
    id: 'customers',
    name: '客户管理',
    icon: 'UserCheck',
    path: '/customers',
    children: [
      {
        id: 'customer-list',
        name: '客户列表',
        icon: 'List',
        path: '/customers',
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
    id: 'projects',
    name: '项目管理',
    icon: 'FolderOpen',
    children: [
      {
        id: 'project-list',
        name: '项目列表',
        icon: 'List',
        path: '/projects',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'project-goals',
        name: '项目目标',
        icon: 'Target',
        path: '/projects/goals',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'reports',
        name: '周报月报',
        icon: 'FileText',
        path: '/projects/reports',
        roles: ['superAdmin', 'manager', 'staff', 'sales']
      },
      {
        id: 'activity-management',
        name: '活动管理',
        icon: 'Calendar',
        path: '/projects/activities',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'competitor-management',
        name: '竞品管理',
        icon: 'Search',
        path: '/projects/competitors',
        roles: ['superAdmin', 'manager', 'staff']
      },
      {
        id: 'kol-post-management',
        name: '红人/帖子管理',
        icon: 'Users',
        path: '/projects/kol-posts',
        roles: ['superAdmin', 'manager', 'staff']
      }
    ],
    roles: ['superAdmin', 'manager', 'staff']
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
