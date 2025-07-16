<template>
  <div class="main-layout">
    <!-- 侧边栏 -->
    <Sidebar />

    <!-- 主内容区域 -->
    <div
      class="main-layout__content"
      :style="{
        marginLeft: sidebarCollapsed ? '80px' : '260px',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh'
      }"
    >
      <!-- 头部导航 -->
      <Header />

      <!-- 页面内容 -->
      <main class="main-layout__main">
        <div class="main-layout__container">
          <!-- 路由视图 -->
          <router-view v-slot="{ Component, route }">
            <Transition name="page" mode="out-in">
              <component :is="Component" :key="route.fullPath" />
            </Transition>
          </router-view>
        </div>
      </main>

      <!-- 底部 -->
      <footer class="main-layout__footer">
        <div class="main-layout__footer-content">
          <span>&copy; 2025 艾维数据平台. All rights reserved.</span>
          <div class="main-layout__footer-links">
            <a href="#" class="main-layout__footer-link">帮助中心</a>
            <a href="#" class="main-layout__footer-link">联系我们</a>
            <a href="#" class="main-layout__footer-link">隐私政策</a>
          </div>
        </div>
      </footer>
    </div>

    <!-- 移动端遮罩层 -->
    <div
      v-if="showMobileOverlay"
      class="main-layout__overlay"
      @click="closeMobileMenu"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import Sidebar from './Sidebar.vue'
import Header from './Header.vue'
import { useAuthStore } from '@/stores/auth'
import { useMenuStore } from '@/stores/menu'
import { initTheme } from '@/assets/theme'

// 组合式API
const router = useRouter()
const authStore = useAuthStore()
const menuStore = useMenuStore()

// 计算属性
const collapsed = computed(() => menuStore.collapsed)
const sidebarCollapsed = computed(() => menuStore.collapsed)
const showMobileOverlay = computed(() => {
  return window.innerWidth <= 768 && !collapsed.value
})

// 方法
const closeMobileMenu = () => {
  if (window.innerWidth <= 768) {
    menuStore.toggleCollapse()
  }
}

const handleResize = () => {
  // 响应式处理
  if (window.innerWidth <= 768) {
    // 移动端默认折叠侧边栏
    if (!collapsed.value) {
      menuStore.toggleCollapse()
    }
  }
}

// 生命周期
onMounted(async () => {
  // 初始化主题
  initTheme()

  // 如果没有登录，自动使用演示账号登录
  if (!authStore.isAuthenticated) {
    console.log('Auto login for testing...')
    const loginResult = await authStore.login({
      username: 'admin',
      password: 'admin123',
      remember: false
    })

    if (loginResult.success) {
      console.log('Auto login successful')
    } else {
      console.error('Auto login failed:', loginResult.message)
    }
  }

  // 初始化认证状态
  await authStore.initAuth()

  // 监听路由变化
  router.afterEach((to) => {
    console.log('Route changed to:', to.path)
    menuStore.setActiveMenuByPath(to.path)

    // 根据路由变化自动展开相应的菜单
    setTimeout(() => {
      initializeMenuState()
    }, 100)
  })

  // 初始化当前路由的菜单状态
  const initializeMenuState = () => {
    const currentPath = router.currentRoute.value.path
    console.log('Initializing menu state for path:', currentPath)

    // 根据当前路径自动展开相应的菜单
    if (currentPath === '/dashboard' || currentPath.startsWith('/dashboard/')) {
      // 展开数据看板菜单
      if (!menuStore.isMenuOpen('dashboard')) {
        console.log('Auto expanding dashboard menu')
        menuStore.toggleSubmenu('dashboard')
      }
      // 如果是广告数据相关页面，也展开广告数据子菜单
      if (currentPath.includes('/ad-platform-overview') ||
          currentPath.includes('/meta-dashboard') ||
          currentPath.includes('/google-dashboard') ||
          currentPath.includes('/bing-dashboard') ||
          currentPath.includes('/criteo-dashboard')) {
        if (!menuStore.isMenuOpen('ad-data')) {
          console.log('Auto expanding ad-data submenu')
          menuStore.toggleSubmenu('ad-data')
        }
      }
      // 如果是数据工具相关页面，也展开数据工具子菜单
      if (currentPath.includes('/data-export') || currentPath.includes('/custom-metrics')) {
        if (!menuStore.isMenuOpen('data-tools')) {
          console.log('Auto expanding data-tools submenu')
          menuStore.toggleSubmenu('data-tools')
        }
      }
    } else if (currentPath.startsWith('/customers/')) {
      // 展开客户管理菜单
      if (!menuStore.isMenuOpen('customers')) {
        console.log('Auto expanding customers menu')
        menuStore.toggleSubmenu('customers')
      }
    } else if (currentPath.startsWith('/departments/')) {
      // 展开部门管理菜单
      if (!menuStore.isMenuOpen('departments')) {
        console.log('Auto expanding departments menu')
        menuStore.toggleSubmenu('departments')
      }
    } else if (currentPath.startsWith('/performance/')) {
      // 展开业绩管理菜单
      if (!menuStore.isMenuOpen('performance-management')) {
        console.log('Auto expanding performance-management menu')
        menuStore.toggleSubmenu('performance-management')
      }
    } else if (currentPath.startsWith('/settings/')) {
      // 展开系统设置菜单
      if (!menuStore.isMenuOpen('settings')) {
        console.log('Auto expanding settings menu')
        menuStore.toggleSubmenu('settings')
      }
    }
  }

  // 在菜单加载完成后初始化菜单状态
  if (authStore.isAuthenticated && authStore.userRole) {
    console.log('Loading menu for authenticated user with role:', authStore.userRole)
    await menuStore.loadMenu(authStore.userRole)

    // 根据当前路由设置活跃菜单
    const currentPath = router.currentRoute.value.path
    console.log('Setting active menu for current path:', currentPath)
    menuStore.setActiveMenuByPath(currentPath)

    // 初始化菜单展开状态
    initializeMenuState()
  }

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: 100vh;
  background: var(--color-background);
}

.main-layout__content {
  flex: 1;
  margin-left: var(--sidebar-width);
  transition: margin-left var(--duration-normal);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-layout--collapsed .main-layout__content {
  margin-left: var(--sidebar-collapsed-width);
}

.main-layout__main {
  flex: 1;
  margin-top: var(--header-height);
  padding: var(--spacing-lg);
  overflow-x: auto;
}

.main-layout__container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
}

.main-layout__footer {
  background: var(--color-surface);
  border-top: 1px solid var(--color-border-light);
  padding: var(--spacing-md) var(--spacing-lg);
  margin-top: auto;
}

.main-layout__footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.main-layout__footer-links {
  display: flex;
  gap: var(--spacing-lg);
}

.main-layout__footer-link {
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: color var(--duration-fast);
}

.main-layout__footer-link:hover {
  color: var(--color-primary);
}

.main-layout__overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-overlay);
  z-index: var(--z-modal-backdrop);
  opacity: 0;
  animation: fadeIn var(--duration-normal) forwards;
}

/* 页面切换动画 */
.page-enter-active,
.page-leave-active {
  transition: all var(--duration-normal);
}

.page-enter-from {
  opacity: 0;
  transform: translateX(20px);
}

.page-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* 遮罩层淡入动画 */
@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .main-layout__content {
    margin-left: 0;
  }

  .main-layout--collapsed .main-layout__content {
    margin-left: 0;
  }

  .main-layout__main {
    padding: var(--spacing-md);
  }

  .main-layout__footer-content {
    flex-direction: column;
    gap: var(--spacing-sm);
    text-align: center;
  }

  .main-layout__footer-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .main-layout__main {
    padding: var(--spacing-sm);
  }

  .main-layout__footer-links {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
}

/* 打印样式 */
@media print {
  .main-layout__content {
    margin-left: 0;
  }

  .main-layout__footer {
    display: none;
  }
}
</style>
