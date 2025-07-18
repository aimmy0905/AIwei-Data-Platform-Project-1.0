<template>
  <teleport to="body">
    <!-- 加载遮罩 -->
    <div v-if="loadingState.show" class="loading-overlay">
      <div class="loading-content">
        <div class="loading-spinner"></div>
        <p class="loading-text">{{ loadingState.text }}</p>
      </div>
    </div>

    <!-- 通知消息 -->
    <div class="notification-container">
      <transition-group name="notification" tag="div">
        <div
          v-for="notification in notifications"
          :key="notification.id"
          class="notification"
          :class="notification.type"
        >
          <div class="notification-icon">
            <CheckCircle v-if="notification.type === 'success'" :size="20" />
            <AlertCircle v-else-if="notification.type === 'error'" :size="20" />
            <Info v-else-if="notification.type === 'info'" :size="20" />
            <AlertTriangle v-else-if="notification.type === 'warning'" :size="20" />
          </div>
          <div class="notification-content">
            <h4 v-if="notification.title" class="notification-title">
              {{ notification.title }}
            </h4>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          <button
            class="notification-close"
            @click="removeNotification(notification.id)"
          >
            <X :size="16" />
          </button>
        </div>
      </transition-group>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-vue-next'

// 通知类型
export type NotificationType = 'success' | 'error' | 'warning' | 'info'

// 通知接口
export interface Notification {
  id: string
  type: NotificationType
  title?: string
  message: string
  duration?: number
  persistent?: boolean
}

// 加载状态
interface LoadingState {
  show: boolean
  text: string
}

// 响应式数据
const notifications = ref<Notification[]>([])
const loadingState = reactive<LoadingState>({
  show: false,
  text: '加载中...'
})

let notificationId = 0

// 方法
const showNotification = (options: Omit<Notification, 'id'>): string => {
  const id = `notification-${++notificationId}`
  const notification: Notification = {
    id,
    duration: 4000,
    ...options
  }

  notifications.value.push(notification)

  // 自动移除（除非是持久化通知）
  if (!notification.persistent && notification.duration) {
    setTimeout(() => {
      removeNotification(id)
    }, notification.duration)
  }

  return id
}

const removeNotification = (id: string) => {
  const index = notifications.value.findIndex(n => n.id === id)
  if (index > -1) {
    notifications.value.splice(index, 1)
  }
}

const clearAllNotifications = () => {
  notifications.value = []
}

const showLoading = (text: string = '加载中...') => {
  loadingState.show = true
  loadingState.text = text
}

const hideLoading = () => {
  loadingState.show = false
}

// 便捷方法
const showSuccess = (message: string, title?: string) => {
  return showNotification({
    type: 'success',
    title,
    message
  })
}

const showError = (message: string, title?: string) => {
  return showNotification({
    type: 'error',
    title,
    message,
    duration: 6000 // 错误消息显示时间更长
  })
}

const showWarning = (message: string, title?: string) => {
  return showNotification({
    type: 'warning',
    title,
    message
  })
}

const showInfo = (message: string, title?: string) => {
  return showNotification({
    type: 'info',
    title,
    message
  })
}

// 暴露方法给父组件
defineExpose({
  showNotification,
  removeNotification,
  clearAllNotifications,
  showLoading,
  hideLoading,
  showSuccess,
  showError,
  showWarning,
  showInfo
})
</script>

<style scoped>
/* 加载遮罩 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-text {
  margin: 0;
  color: #666;
  font-size: 14px;
}

/* 通知容器 */
.notification-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 9998;
  max-width: 400px;
  width: 100%;
}

/* 通知样式 */
.notification {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
  border-left: 4px solid;
  position: relative;
}

.notification.success {
  border-left-color: #4caf50;
}

.notification.error {
  border-left-color: #f44336;
}

.notification.warning {
  border-left-color: #ff9800;
}

.notification.info {
  border-left-color: #2196f3;
}

.notification-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.notification.success .notification-icon {
  color: #4caf50;
}

.notification.error .notification-icon {
  color: #f44336;
}

.notification.warning .notification-icon {
  color: #ff9800;
}

.notification.info .notification-icon {
  color: #2196f3;
}

.notification-content {
  flex: 1;
}

.notification-title {
  margin: 0 0 4px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
}

.notification-message {
  margin: 0;
  font-size: 14px;
  color: #666;
  line-height: 1.4;
}

.notification-close {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  color: #999;
  transition: all 0.2s;
}

.notification-close:hover {
  background: #f5f5f5;
  color: #666;
}

/* 动画效果 */
.notification-enter-active {
  transition: all 0.3s ease-out;
}

.notification-leave-active {
  transition: all 0.3s ease-in;
}

.notification-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.notification-leave-to {
  transform: translateX(100%);
  opacity: 0;
}

.notification-move {
  transition: transform 0.3s ease;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .notification-container {
    left: 20px;
    right: 20px;
    max-width: none;
  }

  .loading-content {
    margin: 20px;
    padding: 20px;
  }
}
</style>
