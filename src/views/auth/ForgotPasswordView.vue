<template>
  <div class="forgot-password-view">
    <div class="forgot-password-container">
      <div class="forgot-password-header">
        <router-link :to="{ name: 'login' }" class="back-link">
          <ArrowLeft :size="20" />
          <span>返回登录</span>
        </router-link>
        <div class="logo">
          <img src="/favicon.ico" alt="Logo" class="logo-img" />
          <h1 class="logo-text">艾维数据平台</h1>
        </div>
      </div>

      <div class="forgot-password-content">
        <div class="progress-indicator">
          <div 
            v-for="(step, index) in steps" 
            :key="step.id"
            class="progress-step"
            :class="{ 
              'progress-step--active': currentStep === index + 1,
              'progress-step--completed': currentStep > index + 1 
            }"
          >
            <div class="progress-step-circle">
              <Check v-if="currentStep > index + 1" :size="16" />
              <span v-else>{{ index + 1 }}</span>
            </div>
            <span class="progress-step-text">{{ step.title }}</span>
          </div>
        </div>

        <!-- 步骤1: 输入账号 -->
        <div v-if="currentStep === 1" class="step-content">
          <h2>找回密码</h2>
          <p>请输入您的账号，我们将向您的注册手机或邮箱发送验证码</p>
          
          <form @submit.prevent="handleSendCode" class="form">
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
                  placeholder="请输入需要重置密码的账号"
                  @blur="validateUsername"
                  @input="clearError('username')"
                />
              </div>
              <div v-if="errors.username" class="form-error">
                {{ errors.username }}
              </div>
            </div>

            <button
              type="submit"
              class="submit-btn"
              :disabled="loading || !formData.username.trim()"
            >
              <Loader v-if="loading" :size="20" class="submit-btn-spinner" />
              <span>{{ loading ? '发送中...' : '发送验证码' }}</span>
            </button>

            <div v-if="stepError" class="step-error">
              <AlertCircle :size="20" />
              <span>{{ stepError }}</span>
            </div>
          </form>
        </div>

        <!-- 步骤2: 输入验证码 -->
        <div v-if="currentStep === 2" class="step-content">
          <h2>输入验证码</h2>
          <p>
            验证码已发送至您的{{ verificationInfo.method === 'sms' ? '手机' : '邮箱' }}
            <strong>{{ verificationInfo.target }}</strong>
          </p>
          
          <form @submit.prevent="handleVerifyCode" class="form">
            <div class="form-group">
              <label for="code" class="form-label">验证码</label>
              <div class="form-input-wrapper">
                <Shield :size="20" class="form-input-icon" />
                <input
                  id="code"
                  v-model="formData.code"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.code }"
                  placeholder="请输入6位验证码"
                  maxlength="6"
                  @input="formatCode"
                />
              </div>
              <div v-if="errors.code" class="form-error">
                {{ errors.code }}
              </div>
            </div>

            <div class="code-resend">
              <button
                v-if="countdown === 0"
                type="button"
                class="resend-btn"
                @click="handleResendCode"
                :disabled="loading"
              >
                重新发送验证码
              </button>
              <span v-else class="countdown-text">
                {{ countdown }}秒后可重新发送
              </span>
            </div>

            <button
              type="submit"
              class="submit-btn"
              :disabled="loading || formData.code.length !== 6"
            >
              <Loader v-if="loading" :size="20" class="submit-btn-spinner" />
              <span>{{ loading ? '验证中...' : '验证码' }}</span>
            </button>

            <div v-if="stepError" class="step-error">
              <AlertCircle :size="20" />
              <span>{{ stepError }}</span>
            </div>
          </form>
        </div>

        <!-- 步骤3: 设置新密码 -->
        <div v-if="currentStep === 3" class="step-content">
          <h2>设置新密码</h2>
          <p>请设置您的新密码，密码需要包含字母和数字</p>
          
          <form @submit.prevent="handleResetPassword" class="form">
            <div class="form-group">
              <label for="newPassword" class="form-label">新密码</label>
              <div class="form-input-wrapper">
                <Lock :size="20" class="form-input-icon" />
                <input
                  id="newPassword"
                  v-model="formData.newPassword"
                  :type="showNewPassword ? 'text' : 'password'"
                  class="form-input"
                  :class="{ 'form-input--error': errors.newPassword }"
                  placeholder="请输入新密码"
                  @blur="validateNewPassword"
                  @input="clearError('newPassword')"
                />
                <button
                  type="button"
                  class="form-input-toggle"
                  @click="showNewPassword = !showNewPassword"
                >
                  <Eye v-if="showNewPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
              <div v-if="errors.newPassword" class="form-error">
                {{ errors.newPassword }}
              </div>
              <div class="password-strength">
                <div 
                  class="password-strength-bar"
                  :class="`password-strength-bar--${passwordStrength}`"
                ></div>
                <span class="password-strength-text">
                  密码强度: {{ getPasswordStrengthText() }}
                </span>
              </div>
            </div>

            <div class="form-group">
              <label for="confirmPassword" class="form-label">确认密码</label>
              <div class="form-input-wrapper">
                <Lock :size="20" class="form-input-icon" />
                <input
                  id="confirmPassword"
                  v-model="formData.confirmPassword"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  class="form-input"
                  :class="{ 'form-input--error': errors.confirmPassword }"
                  placeholder="请再次输入新密码"
                  @blur="validateConfirmPassword"
                  @input="clearError('confirmPassword')"
                />
                <button
                  type="button"
                  class="form-input-toggle"
                  @click="showConfirmPassword = !showConfirmPassword"
                >
                  <Eye v-if="showConfirmPassword" :size="20" />
                  <EyeOff v-else :size="20" />
                </button>
              </div>
              <div v-if="errors.confirmPassword" class="form-error">
                {{ errors.confirmPassword }}
              </div>
            </div>

            <button
              type="submit"
              class="submit-btn"
              :disabled="loading || !isPasswordFormValid"
            >
              <Loader v-if="loading" :size="20" class="submit-btn-spinner" />
              <span>{{ loading ? '重置中...' : '重置密码' }}</span>
            </button>

            <div v-if="stepError" class="step-error">
              <AlertCircle :size="20" />
              <span>{{ stepError }}</span>
            </div>
          </form>
        </div>

        <!-- 步骤4: 重置成功 -->
        <div v-if="currentStep === 4" class="step-content step-success">
          <div class="success-icon">
            <CheckCircle :size="64" />
          </div>
          <h2>密码重置成功</h2>
          <p>您的密码已成功重置，请使用新密码登录</p>
          
          <div class="success-actions">
            <button @click="goToLogin" class="submit-btn">
              立即登录
            </button>
            <div class="auto-redirect">
              <span>{{ countdown }}秒后自动跳转到登录页面</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowLeft, 
  User, 
  Shield, 
  Lock, 
  Eye, 
  EyeOff,
  Loader, 
  AlertCircle,
  Check,
  CheckCircle
} from 'lucide-vue-next'
import { mockForgotPassword, mockVerifyCode, mockResetPassword } from '@/mock'

// 组合式API
const router = useRouter()

// 响应式数据
const currentStep = ref(1)
const loading = ref(false)
const stepError = ref('')
const errors = ref<Record<string, string>>({})
const countdown = ref(0)
const countdownTimer = ref<number | null>(null)
const showNewPassword = ref(false)
const showConfirmPassword = ref(false)

const formData = ref({
  username: '',
  code: '',
  newPassword: '',
  confirmPassword: ''
})

const verificationInfo = ref({
  method: '',
  target: ''
})

const resetToken = ref('')

// 步骤配置
const steps = [
  { id: 1, title: '输入账号' },
  { id: 2, title: '验证身份' },
  { id: 3, title: '设置密码' },
  { id: 4, title: '完成重置' }
]

// 计算属性
const passwordStrength = computed(() => {
  const password = formData.value.newPassword
  if (password.length < 6) return 'weak'
  if (password.length >= 8 && /(?=.*[a-zA-Z])(?=.*\d)/.test(password)) return 'strong'
  return 'medium'
})

const isPasswordFormValid = computed(() => {
  return formData.value.newPassword.length >= 8 &&
         formData.value.confirmPassword === formData.value.newPassword &&
         Object.keys(errors.value).length === 0
})

// 表单验证
const validateUsername = () => {
  const username = formData.value.username.trim()
  if (!username) {
    errors.value.username = '请输入账号'
  } else if (username.length < 3) {
    errors.value.username = '账号格式不正确'
  } else {
    delete errors.value.username
  }
}

const validateNewPassword = () => {
  const password = formData.value.newPassword
  if (!password) {
    errors.value.newPassword = '请输入新密码'
  } else if (password.length < 8 || password.length > 20) {
    errors.value.newPassword = '密码长度应为8-20个字符'
  } else if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(password)) {
    errors.value.newPassword = '密码必须包含字母和数字'
  } else {
    delete errors.value.newPassword
  }
}

const validateConfirmPassword = () => {
  if (!formData.value.confirmPassword) {
    errors.value.confirmPassword = '请确认密码'
  } else if (formData.value.confirmPassword !== formData.value.newPassword) {
    errors.value.confirmPassword = '两次输入的密码不一致'
  } else {
    delete errors.value.confirmPassword
  }
}

const clearError = (field: string) => {
  if (errors.value[field]) {
    delete errors.value[field]
  }
  if (stepError.value) {
    stepError.value = ''
  }
}

const formatCode = (event: Event) => {
  const target = event.target as HTMLInputElement
  // 只允许数字输入
  target.value = target.value.replace(/\D/g, '')
  formData.value.code = target.value
  clearError('code')
}

// 步骤处理函数
const handleSendCode = async () => {
  validateUsername()
  if (errors.value.username) return

  loading.value = true
  stepError.value = ''

  try {
    const response = await mockForgotPassword(formData.value.username)
    if (response.success && response.data) {
      verificationInfo.value = response.data
      currentStep.value = 2
      startCountdown(60)
    } else {
      stepError.value = response.message || '发送验证码失败'
    }
  } catch (error) {
    stepError.value = '网络错误，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleVerifyCode = async () => {
  if (formData.value.code.length !== 6) {
    errors.value.code = '请输入6位验证码'
    return
  }

  loading.value = true
  stepError.value = ''

  try {
    const response = await mockVerifyCode(formData.value.username, formData.value.code)
    if (response.success && response.data) {
      resetToken.value = response.data.resetToken
      currentStep.value = 3
    } else {
      stepError.value = response.message || '验证码验证失败'
    }
  } catch (error) {
    stepError.value = '验证失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleResetPassword = async () => {
  validateNewPassword()
  validateConfirmPassword()
  if (!isPasswordFormValid.value) return

  loading.value = true
  stepError.value = ''

  try {
    const response = await mockResetPassword(resetToken.value, formData.value.newPassword)
    if (response.success) {
      currentStep.value = 4
      startCountdown(5)
    } else {
      stepError.value = response.message || '密码重置失败'
    }
  } catch (error) {
    stepError.value = '重置失败，请稍后重试'
  } finally {
    loading.value = false
  }
}

const handleResendCode = async () => {
  await handleSendCode()
}

const goToLogin = () => {
  router.push({ name: 'login' })
}

const getPasswordStrengthText = () => {
  const strengthMap = {
    weak: '弱',
    medium: '中',
    strong: '强'
  }
  return strengthMap[passwordStrength.value]
}

const startCountdown = (seconds: number) => {
  countdown.value = seconds
  countdownTimer.value = window.setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer.value!)
      if (currentStep.value === 4) {
        goToLogin()
      }
    }
  }, 1000)
}

// 生命周期
onMounted(() => {
  // 如果已经登录，跳转到首页
  // 这里可以检查登录状态
})

onUnmounted(() => {
  if (countdownTimer.value) {
    clearInterval(countdownTimer.value)
  }
})
</script>

<style scoped>
.forgot-password-view {
  min-height: 100vh;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-active) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-lg);
}

.forgot-password-container {
  width: 100%;
  max-width: 500px;
  background: var(--color-surface);
  border-radius: var(--border-radius-xl);
  box-shadow: var(--shadow-xl);
  overflow: hidden;
}

.forgot-password-header {
  padding: var(--spacing-xl) var(--spacing-xl) 0;
  position: relative;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-secondary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  margin-bottom: var(--spacing-lg);
  transition: color var(--duration-fast);
}

.back-link:hover {
  color: var(--color-primary);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
}

.logo-img {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-md);
}

.logo-text {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
  margin: 0;
}

.forgot-password-content {
  padding: 0 var(--spacing-xl) var(--spacing-xl);
}

.progress-indicator {
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-2xl);
  position: relative;
}

.progress-indicator::before {
  content: '';
  position: absolute;
  top: 16px;
  left: 16px;
  right: 16px;
  height: 2px;
  background: var(--color-border-light);
  z-index: 1;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  position: relative;
  z-index: 2;
}

.progress-step-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--color-background);
  border: 2px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  transition: all var(--duration-fast);
}

.progress-step--active .progress-step-circle {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.progress-step--completed .progress-step-circle {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.progress-step-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-align: center;
}

.progress-step--active .progress-step-text {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.step-content {
  text-align: center;
}

.step-content h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.step-content p {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--spacing-xl) 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  text-align: left;
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

.form-input-toggle {
  position: absolute;
  right: var(--spacing-md);
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-xs);
  transition: color var(--duration-fast);
}

.form-input-toggle:hover {
  color: var(--color-primary);
}

.form-error {
  font-size: var(--font-size-sm);
  color: var(--color-error);
}

.password-strength {
  margin-top: var(--spacing-sm);
}

.password-strength-bar {
  height: 4px;
  border-radius: 2px;
  margin-bottom: var(--spacing-xs);
  transition: all var(--duration-fast);
}

.password-strength-bar--weak {
  width: 33%;
  background: var(--color-error);
}

.password-strength-bar--medium {
  width: 66%;
  background: var(--color-warning);
}

.password-strength-bar--strong {
  width: 100%;
  background: var(--color-success);
}

.password-strength-text {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.code-resend {
  display: flex;
  justify-content: center;
  margin: var(--spacing-md) 0;
}

.resend-btn {
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  text-decoration: underline;
}

.countdown-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.submit-btn {
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

.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
}

.submit-btn:disabled {
  background: var(--color-text-disabled);
  cursor: not-allowed;
}

.submit-btn-spinner {
  animation: spin 1s linear infinite;
}

.step-error {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md);
  background: rgba(245, 34, 45, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--border-radius-md);
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

.step-success {
  padding: var(--spacing-xl) 0;
}

.success-icon {
  color: var(--color-success);
  margin-bottom: var(--spacing-lg);
}

.success-actions {
  margin-top: var(--spacing-xl);
}

.auto-redirect {
  margin-top: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 480px) {
  .forgot-password-view {
    padding: var(--spacing-md);
  }
  
  .forgot-password-header,
  .forgot-password-content {
    padding-left: var(--spacing-lg);
    padding-right: var(--spacing-lg);
  }
  
  .progress-step-text {
    display: none;
  }
}
</style>