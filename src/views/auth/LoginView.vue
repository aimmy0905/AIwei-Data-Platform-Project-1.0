<template>
  <div class="login-view">
    <div class="login-container">
      <!-- 左侧品牌区域 -->
      <div class="login-brand">
        <div class="login-brand__content">
          <div class="login-brand__logo">
            <img src="/LOGO-new.webp" alt="Logo" class="login-brand__logo-img" />
            <h1 class="login-brand__title">艾维数据平台</h1>
          </div>
          <p class="login-brand__subtitle">
            海外Shopify网站代运营团队的专业数据分析与管理工具
          </p>
          <div class="login-brand__features">
            <div class="login-brand__feature">
              <BarChart3 :size="24" class="login-brand__feature-icon" />
              <div class="login-brand__feature-text">
                <h3>数据整合</h3>
                <p>统一展示网站运营数据和广告投放数据</p>
              </div>
            </div>
            <div class="login-brand__feature">
              <Shield :size="24" class="login-brand__feature-icon" />
              <div class="login-brand__feature-text">
                <h3>安全可靠</h3>
                <p>企业级安全保障，数据传输加密</p>
              </div>
            </div>
            <div class="login-brand__feature">
              <Users :size="24" class="login-brand__feature-icon" />
              <div class="login-brand__feature-text">
                <h3>团队协作</h3>
                <p>多角色权限管理，高效团队协作</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧登录表单 -->
      <div class="login-form-section">
        <div class="login-form-container">
          <div class="login-form-header">
            <h2>欢迎回来</h2>
            <p>请登录您的账户以继续使用</p>
          </div>

          <form @submit.prevent="handleLogin" class="login-form">
            <!-- 账号输入 -->
            <div class="form-group">
              <label for="username" class="form-label">账号</label>
              <div class="form-input-wrapper">
                <User :size="20" class="form-input-icon" />
                <input
                  id="username"
                  v-model="formData.username"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.username }"
                  placeholder="请输入账号"
                  autocomplete="username"
                  @blur="validateUsername"
                  @input="clearError('username')"
                />
              </div>
              <div v-if="errors.username" class="form-error">
                {{ errors.username }}
              </div>
            </div>

            <!-- 密码输入 -->
            <div class="form-group">
              <label for="password" class="form-label">密码</label>
              <div class="form-input-wrapper">
                <Lock :size="20" class="form-input-icon" />
                <input
                  id="password"
                  v-model="formData.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  :class="{ 'form-input--error': errors.password }"
                  placeholder="请输入密码"
                  autocomplete="current-password"
                  @blur="validatePassword"
                  @input="clearError('password')"
                  @keyup.enter="handleLogin"
                />
                <button
                  type="button"
                  class="form-input-toggle"
                  @click="showPassword = !showPassword"
                  :title="showPassword ? '隐藏密码' : '显示密码'"
                >
                  <Eye v-if="showPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
              <div v-if="errors.password" class="form-error">
                {{ errors.password }}
              </div>
            </div>

            <!-- 记住密码和忘记密码 -->
            <div class="form-options">
              <label class="form-checkbox">
                <input
                  v-model="formData.remember"
                  type="checkbox"
                  class="form-checkbox-input"
                />
                <span class="form-checkbox-text">记住密码</span>
              </label>
              <router-link 
                :to="{ name: 'forgot-password' }" 
                class="form-link"
              >
                忘记密码？
              </router-link>
            </div>

            <!-- 登录按钮 -->
            <button
              type="submit"
              class="login-btn"
              :class="{ 'login-btn--loading': loading }"
              :disabled="loading || !isFormValid"
            >
              <Loader v-if="loading" :size="20" class="login-btn-spinner" />
              <span>{{ loading ? '登录中...' : '登录' }}</span>
            </button>

            <!-- 错误消息 -->
            <div v-if="loginError" class="login-error">
              <AlertCircle :size="20" />
              <span>{{ loginError }}</span>
            </div>

            <!-- 演示账号提示 -->
            <div class="demo-accounts">
              <p class="demo-accounts__title">演示账号：</p>
              <div class="demo-accounts__list">
                <button
                  v-for="account in demoAccounts"
                  :key="account.username"
                  type="button"
                  class="demo-account"
                  @click="fillDemoAccount(account)"
                >
                  <span class="demo-account__username">{{ account.username }}</span>
                  <span class="demo-account__role">{{ account.role }}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  User, 
  Lock, 
  Eye, 
  EyeOff, 
  Loader, 
  AlertCircle,
  BarChart3,
  Shield,
  Users
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { initTheme } from '@/assets/theme'
import type { LoginForm } from '@/types'

// 组合式API
const router = useRouter()
const authStore = useAuthStore()

// 响应式数据
const formData = ref<LoginForm>({
  username: '',
  password: '',
  remember: false
})

const showPassword = ref(false)
const loading = ref(false)
const loginError = ref('')
const errors = ref<Record<string, string>>({})

// 演示账号
const demoAccounts = [
  { username: 'admin', password: 'admin123', role: '超级管理员' },
  { username: 'manager', password: 'manager123', role: '部门经理' },
  { username: 'staff', password: 'staff123', role: '员工' },
  { username: 'finance', password: 'finance123', role: '财务人员' },
  { username: 'sales', password: 'sales123', role: '销售人员' }
]

// 计算属性
const isFormValid = computed(() => {
  return formData.value.username.length >= 3 && 
         formData.value.password.length >= 6 &&
         Object.keys(errors.value).length === 0
})

// 表单验证
const validateUsername = () => {
  const username = formData.value.username.trim()
  if (!username) {
    errors.value.username = '请输入账号'
  } else if (username.length < 3 || username.length > 50) {
    errors.value.username = '账号长度应为3-50个字符'
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.value.username = '账号只能包含字母、数字和下划线'
  } else {
    delete errors.value.username
  }
}

const validatePassword = () => {
  const password = formData.value.password
  if (!password) {
    errors.value.password = '请输入密码'
  } else if (password.length < 6 || password.length > 20) {
    errors.value.password = '密码长度应为6-20个字符'
  } else {
    delete errors.value.password
  }
}

const clearError = (field: string) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
  if (loginError.value) {
    loginError.value = ''
  }
}

// 登录处理
const handleLogin = async () => {
  // 验证表单
  validateUsername()
  validatePassword()
  
  if (!isFormValid.value) {
    return
  }

  loading.value = true
  loginError.value = ''

  try {
    const response = await authStore.login(formData.value)
    
    if (response.success) {
      // 登录成功，跳转到数据看板
      await router.push({ name: 'dashboard-overview' })
    } else {
      // 登录失败，显示错误信息
      loginError.value = response.message || '登录失败，请稍后重试'
    }
  } catch (error) {
    console.error('登录错误:', error)
    loginError.value = '登录请求失败，请检查网络连接'
  } finally {
    loading.value = false
  }
}

// 填充演示账号
const fillDemoAccount = (account: { username: string; password: string }) => {
  formData.value.username = account.username
  formData.value.password = account.password
  // 清除错误信息
  errors.value = {}
  loginError.value = ''
}

// 生命周期
onMounted(() => {
  // 初始化主题
  initTheme()
  
  // 如果已经登录，直接跳转到数据看板
  if (authStore.isAuthenticated) {
    router.push({ name: 'dashboard-overview' })
  }
})
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-active) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.login-container {
  width: 100%;
  max-width: 1200px;
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  min-height: 700px;
}

.login-brand {
  background: linear-gradient(135deg, var(--color-primary-light) 0%, rgba(255, 255, 255, 0.1) 100%);
  padding: var(--spacing-xl) var(--spacing-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  min-height: 100%;
}

.login-brand::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200%;
  height: 200%;
  background: url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='m0 40l40-40h-40v40zm40 0v-40h-40l40 40z'/%3E%3C/g%3E%3C/svg%3E");
  animation: float 20s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.login-brand__content {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
}

.login-brand__logo {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  text-align: center;
}

.login-brand__logo-img {
  width: 120px;
  height: auto;
  max-height: 120px;
  object-fit: contain;
}

.login-brand__title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0;
}

.login-brand__subtitle {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin-bottom: var(--spacing-2xl);
}

.login-brand__features {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.login-brand__feature {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
}

.login-brand__feature-icon {
  color: var(--color-primary);
  flex-shrink: 0;
  margin-top: var(--spacing-xs);
}

.login-brand__feature-text h3 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.login-brand__feature-text p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
  line-height: var(--line-height-normal);
}

.login-form-section {
  padding: var(--spacing-xl) var(--spacing-2xl);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100%;
}

.login-form-container {
  width: 100%;
  max-width: 380px;
}

.login-form-header {
  text-align: center;
  margin-bottom: var(--spacing-2xl);
}

.login-form-header h2 {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.login-form-header p {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.form-input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.form-input-icon {
  position: absolute;
  left: var(--spacing-md);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.form-input {
  width: 100%;
  height: 48px;
  padding: 0 var(--spacing-md) 0 48px;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--duration-fast);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-input--error {
  border-color: var(--color-error);
}

.form-input--error:focus {
  border-color: var(--color-error);
  box-shadow: 0 0 0 3px rgba(245, 34, 45, 0.1);
}

.form-input-toggle {
  position: absolute;
  right: var(--spacing-md);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  transition: color var(--duration-fast);
}

.form-input-toggle:hover {
  color: var(--color-primary);
}

.form-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.form-checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
}

.form-checkbox-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.form-link {
  font-size: var(--font-size-sm);
  color: var(--color-primary);
  text-decoration: none;
  transition: color var(--duration-fast);
}

.form-link:hover {
  color: var(--color-primary-hover);
}

.login-btn {
  height: 48px;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  transition: all var(--duration-fast);
}

.login-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md);
}

.login-btn:active:not(:disabled) {
  transform: translateY(0);
}

.login-btn:disabled {
  background: var(--color-text-disabled);
  cursor: not-allowed;
}

.login-btn--loading {
  background: var(--color-primary-active);
}

.login-btn-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.login-error {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: rgba(245, 34, 45, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--border-radius-md);
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

.demo-accounts {
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
}

.demo-accounts__title {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-md) 0;
  text-align: center;
}

.demo-accounts__list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-xs);
  max-height: 120px;
  overflow-y: auto;
}

.demo-account {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
  min-height: 50px;
  font-size: var(--font-size-xs);
}

.demo-account:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  transform: translateY(-1px);
}

.demo-account__username {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.demo-account__role {
  font-size: 10px;
  color: var(--color-text-secondary);
  text-align: center;
  line-height: 1.2;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .login-container {
    max-width: 900px;
    grid-template-columns: 1fr 1fr;
  }
  
  .login-brand__content {
    max-width: 350px;
  }
  
  .login-brand__features {
    gap: var(--spacing-md);
  }
}

@media (max-width: 768px) {
  .login-view {
    padding: var(--spacing-md);
  }
  
  .login-container {
    grid-template-columns: 1fr;
    max-width: 450px;
    min-height: 600px;
  }
  
  .login-brand {
    padding: var(--spacing-lg);
  }
  
  .login-brand__content {
    max-width: 100%;
  }
  
  .login-brand__features {
    display: none;
  }
  
  .login-form-section {
    padding: var(--spacing-lg);
  }
  
  .demo-accounts__list {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-xs);
  }
  
  .demo-account {
    min-height: 45px;
    padding: var(--spacing-xs);
  }
}

@media (max-width: 480px) {
  .login-view {
    padding: var(--spacing-sm);
  }
  
  .login-container {
    max-width: 100%;
    min-height: 500px;
  }
  
  .login-brand {
    padding: var(--spacing-md);
  }
  
  .login-form-section {
    padding: var(--spacing-md);
  }
  
  .login-brand__title {
    font-size: var(--font-size-xl);
  }
  
  .login-brand__subtitle {
    font-size: var(--font-size-md);
  }
  
  .demo-accounts__list {
    grid-template-columns: 1fr 1fr;
    max-height: 100px;
  }
  
  .demo-account {
    min-height: 40px;
    font-size: 10px;
  }
  
  .demo-account__username {
    font-size: 10px;
  }
  
  .demo-account__role {
    font-size: 9px;
  }
}
</style>