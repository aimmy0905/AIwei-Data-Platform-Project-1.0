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
          path: 'overview',
          name: 'dashboard-overview',
          component: () => import('@/views/dashboard/OverviewView.vue')
        },
        {
          path: 'customer-goals',
          name: 'dashboard-customer-goals',
          component: () => import('@/views/dashboard/CustomerGoalsView.vue')
        },
        {
          path: 'website-data',
          name: 'dashboard-website-data',
          component: () => import('@/views/dashboard/WebsiteDataView.vue')
        },
        {
          path: 'channel-data',
          name: 'dashboard-channel-data',
          component: () => import('@/views/dashboard/ChannelDataView.vue')
        },
        {
          path: 'campaign-data',
          name: 'dashboard-campaign-data',
          component: () => import('@/views/dashboard/CampaignDataView.vue')
        },
        {
          path: 'product-sales',
          name: 'dashboard-product-sales',
          component: () => import('@/views/dashboard/ProductSalesView.vue')
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
          path: 'list',
          name: 'customer-list',
          component: () => import('@/views/customers/CustomerListView.vue')
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
          path: 'theme',
          name: 'settings-theme',
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
    next({ name: 'dashboard-overview' })
  } else {
    next()
  }
})

export default router
