<template>
  <div class="alert-panel">
    <div class="alert-panel__header">
      <div class="alert-title">
        <AlertTriangle :size="20" />
        <h3>预警提醒</h3>
        <span class="alert-count" v-if="unreadCount > 0">{{ unreadCount }}</span>
      </div>

      <div class="alert-actions">
        <button
          class="alert-action-btn"
          @click="markAllAsRead"
          v-if="unreadCount > 0"
        >
          <CheckCircle :size="16" />
          全部已读
        </button>
        <button
          class="alert-action-btn alert-action-btn--danger"
          @click="closeAllAlerts"
          v-if="filteredAlerts.length > 0"
        >
          <X :size="16" />
          批量关闭
        </button>
      </div>
    </div>



    <div class="alert-content">
      <div v-if="loading" class="alert-loading">
        <div class="loading-spinner"></div>
        <span>加载中...</span>
      </div>

      <div v-else-if="filteredAlerts.length === 0" class="alert-empty">
        <AlertCircle :size="48" />
        <p>暂无预警信息</p>
      </div>

      <div v-else class="alert-scroll-container">
        <button
          class="scroll-btn scroll-btn--left"
          @click="scrollLeft"
          :disabled="scrollPosition <= 0"
        >
          <ChevronLeft :size="20" />
        </button>

        <div class="alert-list" ref="alertList">
          <div
            v-for="alert in filteredAlerts"
            :key="alert.id"
            class="alert-item"
            :class="[
              `alert-item--${alert.level}`,
              { 'alert-item--unread': !alert.isRead }
            ]"
          >
          <div class="alert-main">
            <div class="alert-header">
              <div class="alert-title-section">
                <div class="alert-icon">
                  <component :is="getAlertIcon(alert.type)" :size="16" />
                </div>
                <h4 class="alert-title">{{ alert.title }}</h4>
              </div>
              <div class="alert-header-actions">
                <div class="alert-level">
                  <span class="level-badge" :class="`level-badge--${alert.level}`">
                    {{ getLevelText(alert.level) }}
                  </span>
                </div>
                <button
                  class="alert-close-btn"
                  @click="closeAlert(alert.id)"
                  title="关闭预警"
                >
                  <X :size="16" />
                </button>
              </div>
            </div>

            <div class="alert-message">{{ alert.message }}</div>

            <!-- 账号信息 - 只在余额类型预警中显示 -->
            <div v-if="alert.type === 'balance'" class="alert-account-info">
              <div class="account-name">{{ getAccountInfo(alert).name }}</div>
              <div class="account-id">账号ID: {{ getAccountInfo(alert).id }}</div>
            </div>

            <!-- 产品信息 - 只在价格和库存类型预警中显示 -->
            <div v-if="alert.type === 'price' || alert.type === 'stock'" class="alert-product-info">
              <div class="product-name">{{ getProductInfo(alert).name }}</div>
              <div class="product-sku">SKU: {{ getProductInfo(alert).sku }}</div>
            </div>

            <div class="alert-meta">
              <span class="alert-customer">{{ alert.customerName }}</span>
              <span class="alert-time">{{ formatTime(alert.createdAt) }}</span>
            </div>

            <!-- 具体预警类型的详细信息 -->
            <div v-if="alert.type === 'balance'" class="alert-details">
              <div class="detail-item">
                <span class="detail-label">当前余额:</span>
                <span class="detail-value balance-low">${{ getBalanceInfo(alert).current }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">预估可用:</span>
                <span class="detail-value">{{ getBalanceInfo(alert).days }}天</span>
              </div>
            </div>

            <div v-if="alert.type === 'service'" class="alert-details">
              <div class="detail-item">
                <span class="detail-label">到期时间:</span>
                <span class="detail-value">{{ getServiceInfo(alert).expireDate }}</span>
              </div>
              <div class="detail-item">
                <span class="detail-label">续约状态:</span>
                <span class="detail-value" :class="getServiceInfo(alert).statusClass">
                  {{ getServiceInfo(alert).status }}
                </span>
              </div>
            </div>

            <div v-if="alert.type === 'price'" class="alert-details">
              <div class="detail-item">
                <span class="detail-label">价格变动:</span>
                <span class="detail-value" :class="getPriceInfo(alert).changeClass">
                  {{ getPriceInfo(alert).change }}
                </span>
              </div>
              <div class="detail-item">
                <span class="detail-label">当前价格:</span>
                <span class="detail-value">${{ getPriceInfo(alert).current }}</span>
              </div>
            </div>

            <div v-if="alert.type === 'stock'" class="alert-details">
              <div class="detail-item">
                <span class="detail-label">当前库存:</span>
                <span class="detail-value" :class="getStockInfo(alert).stockClass">
                  {{ getStockInfo(alert).current }}件
                </span>
              </div>
              <div class="detail-item" v-if="getStockInfo(alert).estimatedLoss">
                <span class="detail-label">预计损失:</span>
                <span class="detail-value loss">${{ getStockInfo(alert).estimatedLoss }}</span>
              </div>
            </div>
          </div>
          </div>

        </div>

        <button
          class="scroll-btn scroll-btn--right"
          @click="scrollRight"
          :disabled="scrollPosition >= maxScrollPosition"
        >
          <ChevronRight :size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  AlertTriangle,
  AlertCircle,
  CreditCard,
  Clock,
  TrendingUp,
  Package,
  CheckCircle,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-vue-next'
import type { Alert } from '@/types'

interface Props {
  alerts?: Alert[]
  loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  alerts: () => [],
  loading: false
})

const emit = defineEmits<{
  markAllAsRead: []
  closeAlert: [alertId: number]
  closeAllAlerts: []
}>()

// 响应式数据
const alertList = ref<HTMLElement | null>(null)
const scrollPosition = ref(0)
const cardWidth = 300 // 每个卡片的宽度（包含间距）

// 计算属性
const unreadCount = computed(() => {
  return props.alerts.filter(alert => !alert.isRead).length
})

const filteredAlerts = computed(() => {
  return props.alerts.sort((a, b) => {
    // 未读优先，然后按时间排序
    if (a.isRead !== b.isRead) {
      return a.isRead ? 1 : -1
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })
})

const maxScrollPosition = computed(() => {
  if (!alertList.value) return 0
  const totalWidth = filteredAlerts.value.length * cardWidth
  const containerWidth = alertList.value.clientWidth
  return Math.max(0, totalWidth - containerWidth)
})

// 方法

const getAlertIcon = (type: string) => {
  const iconMap = {
    balance: CreditCard,
    service: Clock,
    price: TrendingUp,
    stock: Package
  }
  return iconMap[type as keyof typeof iconMap] || AlertTriangle
}

const getLevelText = (level: string) => {
  const levelMap = {
    critical: '紧急',
    high: '重要',
    medium: '中等',
    low: '提示'
  }
  return levelMap[level as keyof typeof levelMap] || level
}

const formatTime = (time: string): string => {
  const now = new Date()
  const alertTime = new Date(time)
  const diff = now.getTime() - alertTime.getTime()
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (days > 0) return `${days}天前`
  if (hours > 0) return `${hours}小时前`
  return '刚刚'
}

// 获取账号信息
const getAccountInfo = (alert: Alert) => {
  const message = alert.message
  if (message.includes('Facebook Ads')) {
    return {
      name: 'Facebook Ads',
      id: 'FB-12345678'
    }
  } else if (message.includes('Google Ads')) {
    return {
      name: 'Google Ads',
      id: 'GA-87654321'
    }
  } else if (message.includes('TikTok Ads')) {
    return {
      name: 'TikTok Ads',
      id: 'TT-11223344'
    }
  } else if (message.includes('Amazon Ads')) {
    return {
      name: 'Amazon Ads',
      id: 'AM-99887766'
    }
  }
  return {
    name: '未知账号',
    id: 'N/A'
  }
}

// 获取余额信息
const getBalanceInfo = (alert: Alert) => {
  // 从消息中解析余额信息
  const message = alert.message
  if (message.includes('$500')) {
    return { current: '500', days: '1' }
  } else if (message.includes('$1000')) {
    return { current: '1000', days: '2' }
  }
  return { current: '0', days: '0' }
}

// 获取服务信息
const getServiceInfo = (alert: Alert) => {
  const message = alert.message
  if (message.includes('15天后到期')) {
    return {
      expireDate: '2025-01-22',
      status: '待续约',
      statusClass: 'status-pending'
    }
  } else if (message.includes('7天后到期')) {
    return {
      expireDate: '2025-01-14',
      status: '待确认',
      statusClass: 'status-warning'
    }
  } else if (message.includes('已到期')) {
    return {
      expireDate: '2025-01-04',
      status: '已过期',
      statusClass: 'status-expired'
    }
  }
  return { expireDate: '', status: '正常', statusClass: 'status-normal' }
}

// 获取产品信息
const getProductInfo = (alert: Alert) => {
  const message = alert.message
  if (message.includes('智能手表')) {
    return {
      name: '智能手表',
      sku: 'SW-001-BLK'
    }
  } else if (message.includes('蓝牙耳机')) {
    return {
      name: '蓝牙耳机',
      sku: 'BT-002-WHT'
    }
  } else if (message.includes('手机壳')) {
    return {
      name: '手机壳',
      sku: 'PC-003-CLR'
    }
  } else if (message.includes('充电器')) {
    return {
      name: '充电器',
      sku: 'CH-004-USB'
    }
  }
  return {
    name: '未知产品',
    sku: 'N/A'
  }
}

// 获取价格信息
const getPriceInfo = (alert: Alert) => {
  const message = alert.message
  if (message.includes('上涨8%')) {
    return {
      change: '+8%',
      current: '199.99',
      changeClass: 'price-up'
    }
  } else if (message.includes('下降15%')) {
    return {
      change: '-15%',
      current: '127.49',
      changeClass: 'price-down'
    }
  }
  return { change: '0%', current: '0', changeClass: '' }
}

// 获取库存信息
const getStockInfo = (alert: Alert) => {
  const message = alert.message
  if (message.includes('仅剩120件')) {
    return {
      current: '120',
      stockClass: 'stock-low',
      estimatedLoss: null
    }
  } else if (message.includes('库存为0')) {
    return {
      current: '0',
      stockClass: 'stock-out',
      estimatedLoss: '15,000'
    }
  } else if (message.includes('库存85件')) {
    return {
      current: '85',
      stockClass: 'stock-low',
      estimatedLoss: null
    }
  }
  return { current: '0', stockClass: 'stock-normal', estimatedLoss: null }
}

// 事件处理方法
const markAllAsRead = () => {
  emit('markAllAsRead')
}

const closeAlert = (alertId: number) => {
  emit('closeAlert', alertId)
}

const closeAllAlerts = () => {
  emit('closeAllAlerts')
}

// 滚动方法
const scrollLeft = () => {
  if (!alertList.value) return
  const newPosition = Math.max(0, scrollPosition.value - cardWidth * 4)
  scrollPosition.value = newPosition
  alertList.value.scrollTo({
    left: newPosition,
    behavior: 'smooth'
  })
}

const scrollRight = () => {
  if (!alertList.value) return
  const newPosition = Math.min(maxScrollPosition.value, scrollPosition.value + cardWidth * 4)
  scrollPosition.value = newPosition
  alertList.value.scrollTo({
    left: newPosition,
    behavior: 'smooth'
  })
}

</script>

<style scoped>
.alert-panel {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.alert-panel__header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-background);
}

.alert-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.alert-action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
}

.alert-action-btn:hover {
  background: var(--color-surface);
}

.alert-action-btn--danger {
  border-color: var(--color-error);
  color: var(--color-error);
}

.alert-action-btn--danger:hover {
  background: var(--color-error);
  color: white;
}

.alert-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
}

.alert-title h3 {
  margin: 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
}

.alert-count {
  background: var(--color-error);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}



.alert-content {
  max-height: 600px;
  overflow-y: auto;
}

.alert-loading,
.alert-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid var(--color-border);
  border-top: 2px solid var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--spacing-sm);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.alert-scroll-container {
  position: relative;
  display: flex;
  align-items: center;
  padding: var(--spacing-sm);
}

.alert-list {
  display: flex;
  gap: var(--spacing-sm);
  overflow-x: hidden;
  scroll-behavior: smooth;
  flex: 1;
  padding: 0;
}

.scroll-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.scroll-btn:hover:not(:disabled) {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.scroll-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.scroll-btn--left {
  left: 10px;
}

.scroll-btn--right {
  right: 10px;
}

.alert-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm);
  border-radius: var(--border-radius-md);
  border-left: 4px solid transparent;
  background: var(--color-background);
  transition: all 0.2s;
  min-height: 180px;
  width: 280px;
  flex-shrink: 0;
}

.alert-item:hover {
  background: var(--color-surface);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.alert-item--unread {
  background: var(--color-primary-light);
  border-left-color: var(--color-primary);
}

.alert-item--critical {
  border-left-color: var(--color-error);
}

.alert-item--high {
  border-left-color: var(--color-warning);
}

.alert-item--medium {
  border-left-color: var(--color-info);
}

.alert-item--low {
  border-left-color: var(--color-success);
}

.alert-icon {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  color: var(--color-primary);
}

.alert-main {
  flex: 1;
}

.alert-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.alert-title-section {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  flex: 1;
}

.alert-header-actions {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex-shrink: 0;
}

.alert-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: none;
  border-radius: 50%;
  color: var(--color-text-tertiary);
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.alert-close-btn:hover {
  background: var(--color-error-light);
  color: var(--color-error);
}

.alert-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.level-badge {
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: var(--border-radius-sm);
  font-weight: var(--font-weight-medium);
}

.level-badge--critical {
  background: var(--color-error-light);
  color: var(--color-error);
}

.level-badge--high {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.level-badge--medium {
  background: var(--color-info-light);
  color: var(--color-info);
}

.level-badge--low {
  background: var(--color-success-light);
  color: var(--color-success);
}

.alert-message {
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
  line-height: 1.4;
  font-size: var(--font-size-xs);
  overflow: hidden;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.alert-account-info {
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-xs);
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
  border-left: 3px solid var(--color-warning);
}

.account-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.account-id {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  font-family: 'Courier New', monospace;
}

.alert-product-info {
  margin-bottom: var(--spacing-sm);
  padding: var(--spacing-xs);
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
  border-left: 3px solid var(--color-primary);
}

.product-name {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.product-sku {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  font-family: 'Courier New', monospace;
}

.alert-meta {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-tertiary);
  margin-bottom: var(--spacing-sm);
}

.alert-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  background: var(--color-surface);
  border-radius: var(--border-radius-sm);
  margin-top: auto;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
}

.detail-label {
  color: var(--color-text-secondary);
}

.detail-value {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.balance-low {
  color: var(--color-error);
}

.price-up {
  color: var(--color-error);
}

.price-down {
  color: var(--color-success);
}

.stock-low {
  color: var(--color-warning);
}

.stock-out {
  color: var(--color-error);
}

.loss {
  color: var(--color-error);
}

.status-pending {
  color: var(--color-warning);
}

.status-warning {
  color: var(--color-error);
}

.status-expired {
  color: var(--color-error);
  font-weight: var(--font-weight-bold);
}



/* 响应式设计 */
@media (max-width: 1200px) {
  .alert-item {
    width: 260px;
  }
}

@media (max-width: 768px) {
  .alert-item {
    width: 240px;
    min-height: 160px;
  }

  .alert-header {
    align-items: center;
  }

  .alert-header-actions {
    flex-direction: column;
    align-items: flex-end;
    gap: var(--spacing-xs);
  }

  .alert-details {
    gap: var(--spacing-xs);
  }

  .alert-actions {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .scroll-btn {
    width: 36px;
    height: 36px;
  }
}

@media (max-width: 480px) {
  .alert-item {
    width: 200px;
  }

  .scroll-btn {
    width: 32px;
    height: 32px;
  }

  .scroll-btn--left {
    left: 5px;
  }

  .scroll-btn--right {
    right: 5px;
  }
}
</style>

