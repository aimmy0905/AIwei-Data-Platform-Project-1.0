import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginForm } from '@/types'
import { mockLogin, mockGetUserInfo, mockLogout } from '@/mock'

export const useAuthStore = defineStore('auth', () => {
  // 状态
  const user = ref<User | null>(null)
  const token = ref<string>('')
  const isAuthenticated = ref(false)
  const loading = ref(false)

  // 计算属性
  const userRole = computed(() => user.value?.role)
  const userName = computed(() => user.value?.username)
  const userAvatar = computed(() => user.value?.avatar)

  // 动作
  const login = async (form: LoginForm) => {
    loading.value = true
    try {
      const response = await mockLogin(form)
      if (response.success && response.data) {
        user.value = response.data.user
        token.value = response.data.token
        isAuthenticated.value = true

        // 存储到本地存储
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user_info', JSON.stringify(response.data.user))

        return response
      }
      return response
    } catch (error) {
      console.error('登录失败:', error)
      return {
        success: false,
        message: '登录请求失败，请稍后重试',
        code: 500
      }
    } finally {
      loading.value = false
    }
  }

  const logout = async () => {
    loading.value = true
    try {
      await mockLogout()

      // 清空状态
      user.value = null
      token.value = ''
      isAuthenticated.value = false

      // 清空本地存储
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_info')

      return { success: true, message: '退出成功' }
    } catch (error) {
      console.error('退出失败:', error)
      return { success: false, message: '退出失败' }
    } finally {
      loading.value = false
    }
  }

  const getUserInfo = async () => {
    if (!token.value) return

    loading.value = true
    try {
      const response = await mockGetUserInfo(token.value)
      if (response.success && response.data) {
        user.value = response.data
        isAuthenticated.value = true

        // 更新本地存储
        localStorage.setItem('user_info', JSON.stringify(response.data))
      }
      return response
    } catch (error) {
      console.error('获取用户信息失败:', error)
      // 如果获取用户信息失败，清空认证状态
      await logout()
    } finally {
      loading.value = false
    }
  }

  const initAuth = async () => {
    // 从本地存储恢复认证状态
    const storedToken = localStorage.getItem('auth_token')
    const storedUser = localStorage.getItem('user_info')

    if (storedToken && storedUser) {
      try {
        token.value = storedToken
        user.value = JSON.parse(storedUser)
        isAuthenticated.value = true

        // 验证token是否仍然有效
        await getUserInfo()
      } catch (error) {
        console.error('初始化认证状态失败:', error)
        await logout()
      }
    }
  }

  const updateUserInfo = (newUserInfo: Partial<User>) => {
    if (user.value) {
      user.value = { ...user.value, ...newUserInfo }
      localStorage.setItem('user_info', JSON.stringify(user.value))
    }
  }

  const hasPermission = (requiredRoles: string[] = []) => {
    if (!userRole.value) return false
    if (requiredRoles.length === 0) return true
    return requiredRoles.includes(userRole.value)
  }

  const isSuperAdmin = computed(() => userRole.value === 'superAdmin')
  const isManager = computed(() => userRole.value === 'manager' || isSuperAdmin.value)

  return {
    // 状态
    user,
    token,
    isAuthenticated,
    loading,

    // 计算属性
    userRole,
    userName,
    userAvatar,
    isSuperAdmin,
    isManager,

    // 动作
    login,
    logout,
    getUserInfo,
    initAuth,
    updateUserInfo,
    hasPermission
  }
})
