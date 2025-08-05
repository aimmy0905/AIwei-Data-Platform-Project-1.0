import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // 认证路由
    {
      path: '/auth',
      component: () => import('@/components/layout/AuthLayout.vue'),
      children: [
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/auth/LoginView.vue'),
          meta: { requiresGuest: true }
        },
        {
          path: '/forgot-password',
          name: 'forgot-password',
          component: () => import('@/views/auth/ForgotPasswordView.vue'),
          meta: { requiresGuest: true }
        }
      ]
    },

    // 主应用路由
    {
      path: '/dashboard',
      component: () => import('@/components/layout/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'dashboard',
          component: () => import('@/views/dashboard/DashboardView.vue')
        },
        {
          path: 'influencer-data',
          name: 'influencer-data',
          component: () => import('@/views/dashboard/KOLDataView.vue')
        },
        {
          path: 'regional-market',
          name: 'regional-market',
          component: () => import('@/views/dashboard/MarketDataView.vue')
        },
        {
          path: 'page-performance',
          name: 'page-performance',
          component: () => import('@/views/dashboard/PagePerformanceView.vue')
        },
        {
          path: 'competitor-analysis',
          name: 'competitor-analysis',
          component: () => import('@/views/dashboard/CompetitorView.vue')
        },
        {
          path: 'ad-platform-overview',
          name: 'ad-platform-overview',
          component: () => import('@/views/dashboard/AdPlatformOverviewView.vue')
        },
        {
          path: 'meta-dashboard',
          name: 'meta-dashboard',
          component: () => import('@/views/dashboard/MetaDashboardView.vue')
        },
        {
          path: 'google-dashboard',
          name: 'google-dashboard',
          component: () => import('@/views/dashboard/GoogleDashboardView.vue')
        },
        {
          path: 'bing-dashboard',
          name: 'bing-dashboard',
          component: () => import('@/views/dashboard/BingDashboardView.vue')
        },
        {
          path: 'criteo-dashboard',
          name: 'criteo-dashboard',
          component: () => import('@/views/dashboard/CriteoDashboardView.vue')
        },
        {
          path: 'data-export',
          name: 'data-export',
          component: () => import('@/views/dashboard/DataExportView.vue')
        },
        {
          path: 'custom-metrics',
          name: 'custom-metrics',
          component: () => import('@/views/dashboard/CustomMetricsView.vue')
        },
        {
          path: 'customer-goals',
          name: 'customer-goals',
          component: () => import('@/views/dashboard/CustomerGoalsView.vue')
        }
      ]
    },

    // 项目管理路由
    {
      path: '/projects',
      component: () => import('@/components/layout/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'projects',
          component: () => import('@/views/projects/ProjectManagementView.vue')
        },
        {
          path: 'goals',
          name: 'project-goals',
          component: () => import('@/views/projects/ProjectGoalsView.vue')
        },
        {
          path: 'activities',
          name: 'activity-management',
          component: () => import('@/views/projects/ActivityManagementView.vue')
        },
        {
          path: 'activities/:id(\\d+)',
          name: 'activity-detail',
          component: () => import('@/views/projects/ActivityDetailView.vue')
        },
        {
          path: 'competitors',
          name: 'competitor-management',
          component: () => import('@/views/projects/CompetitorManagementView.vue')
        },
        {
          path: 'kol-posts',
          name: 'kol-post-management',
          component: () => import('@/views/projects/KolPostManagementView.vue')
        },
        {
          path: 'reports',
          name: 'reports',
          component: () => import('@/views/reports/ReportsView.vue')
        },
        {
          path: ':id(\\d+)/dashboard',
          name: 'project-dashboard',
          component: () => import('@/views/projects/ProjectDashboardView.vue')
        }
      ]
    },

    // 活动详情路由
    {
      path: '/campaign/:id',
      name: 'campaign-details',
      component: () => import('@/components/layout/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'campaign-details-view',
          component: () => import('@/views/campaign/CampaignDetailsView.vue')
        }
      ]
    },

    // 客户管理路由
    {
      path: '/customers',
      component: () => import('@/components/layout/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          name: 'customers',
          component: () => import('@/views/customers/CustomerListView.vue')
        },
        {
          path: 'create',
          name: 'customer-create',
          component: () => import('@/views/customers/CustomerCreateView.vue')
        },
        {
          path: ':id(\\d+)',
          name: 'customer-detail',
          component: () => import('@/views/customers/CustomerDetailView.vue')
        },
        {
          path: 'service-fees',
          name: 'service-fees',
          component: () => import('@/views/finance/ServiceFeeManagementView.vue')
        },
        {
          path: 'reviews',
          name: 'customer-reviews',
          component: () => import('@/views/customers/CustomerReviewsView.vue')
        }
      ]
    },

    // 业务看板路由
    {
      path: '/business',
      component: () => import('@/components/layout/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        // 销售部门看板
        {
          path: 'sales-director',
          name: 'sales-director-dashboard',
          component: () => import('@/views/business/SalesDirectorDashboard.vue'),
          meta: {
            requiresAuth: true,
            roles: ['sales_director']
          }
        },
        {
          path: 'sales-manager',
          name: 'sales-manager-dashboard',
          component: () => import('@/views/business/SalesManagerDashboard.vue'),
          meta: {
            requiresAuth: true,
            roles: ['sales_manager']
          }
        },
        {
          path: 'sales-person',
          name: 'sales-person-dashboard',
          component: () => import('@/views/business/SalesPersonDashboard.vue'),
          meta: {
            requiresAuth: true,
            roles: ['sales_person']
          }
        },

        // 运营部门看板
        {
          path: 'project-director',
          name: 'project-director-dashboard',
          component: () => import('@/views/business/ProjectDirectorDashboard.vue'),
          meta: {
            requiresAuth: true,
            roles: ['project_director']
          }
        },
        {
          path: 'project-manager',
          name: 'project-manager-dashboard',
          component: () => import('@/views/business/ProjectManagerDashboard.vue'),
          meta: {
            requiresAuth: true,
            roles: ['project_manager']
          }
        },
        {
          path: 'google-optimizer',
          name: 'google-optimizer-dashboard',
          component: () => import('@/views/business/GoogleOptimizerDashboard.vue'),
          meta: {
            requiresAuth: true,
            roles: ['google_optimizer']
          }
        },
        {
          path: 'meta-optimizer',
          name: 'meta-optimizer-dashboard',
          component: () => import('@/views/business/MetaOptimizerDashboard.vue'),
          meta: {
            requiresAuth: true,
            roles: ['meta_optimizer']
          }
        },
        {
          path: 'criteo-optimizer',
          name: 'criteo-optimizer-dashboard',
          component: () => import('@/views/business/CriteoOptimizerDashboard.vue'),
          meta: {
            requiresAuth: true,
            roles: ['criteo_optimizer']
          }
        },
        {
          path: 'bing-optimizer',
          name: 'bing-optimizer-dashboard',
          component: () => import('@/views/business/BingOptimizerDashboard.vue'),
          meta: {
            requiresAuth: true,
            roles: ['bing_optimizer']
          }
        },

        // 财务部门看板
        {
          path: 'finance-director',
          name: 'finance-director-dashboard',
          component: () => import('@/views/business/FinanceDirectorDashboard.vue'),
          meta: {
            requiresAuth: true,
            roles: ['finance_director']
          }
        }
      ]
    },

    // 部门管理路由
    {
      path: '/departments',
      component: () => import('@/components/layout/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'organization',
          name: 'organization',
          component: () => import('@/views/departments/OrganizationView.vue')
        },
        {
          path: 'employees',
          name: 'employees',
          component: () => import('@/views/departments/EmployeesView.vue')
        },
        {
          path: 'performance',
          name: 'performance',
          component: () => import('@/views/departments/PerformanceView.vue')
        },
        {
          path: 'goals',
          name: 'department-goals',
          component: () => import('@/views/departments/GoalsView.vue')
        }
      ]
    },

    // 系统设置路由
    {
      path: '/settings',
      component: () => import('@/components/layout/MainLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: 'them          name: 'settings-theme',
          component: () => import('@/views/settings/ThemeView.vue')
        }
      ]
    },

    // 根路径重定向到登录页
    {
      path: '/',
      redirect: { name: 'login' }
    },

    // 捕获所有未匹配的路由
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: { name: 'login' }
    }
  ],
})

// 路由守卫
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // 等待认证状态初始化
  if (!authStore.user && localStorage.getItem('auth_token')) {
    await authStore.initAuth()
  }

  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest)
  const isAuthenticated = authStore.isAuthenticated

  if (requiresAuth && !isAuthenticated) {
    // 需要认证但未登录，跳转到登录页
    next({ name: 'login' })
  } else if (requiresGuest && isAuthenticated) {
    // 需要游客身份但已登录，跳转到数据看板
    next({ name: 'dashboard' })
  } else {
    next()
  }
})

export default router
