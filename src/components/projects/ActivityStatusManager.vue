<template>
  <div class="activity-status-manager">
    <!-- 状态操作按钮 -->
    <div class="status-actions" v-if="permissions.canChangeStatus">
      <div class="current-status">
        <span class="status-label">当前状态：</span>
        <span class="status-badge" :class="currentStatusColor">
          {{ currentStatusText }}
        </span>
      </div>

      <div class="action-buttons">
        <button
          v-for="transition in permissions.availableTransitions"
          :key="`${transition.from}-${transition.to}`"
          class="btn btn-status"
          :class="getTransitionButtonClass(transition)"
          @click="initiateStatusChange(transition)"
        >
          <component :is="getTransitionIcon(transition)" :size="16" />
          {{ transition.label }}
        </button>
      </div>
    </div>

    <!-- 状态建议 -->
    <div class="status-suggestions" v-if="suggestions.length > 0">
      <div class="suggestions-header">
        <AlertTriangle :size="16" />
        <span>状态建议</span>
      </div>
      <ul class="suggestions-list">
        <li v-for="suggestion in suggestions" :key="suggestion">
          {{ suggestion }}
        </li>
      </ul>
    </div>

    <!-- 状态历史 -->
    <div class="status-history" v-if="showHistoryPanel && history.length > 0">
      <div class="history-header">
        <h4>状态变更历史</h4>
        <button class="btn btn-text" @click="showHistoryPanel = !showHistoryPanel">
          <ChevronDown :size="16" :class="{ 'rotate-180': showHistoryPanel }" />
        </button>
      </div>
      <div class="history-list">
        <div
          v-for="record in history"
          :key="record.id"
          class="history-item"
        >
          <div class="history-main">
            <div class="status-change">
              <span class="status-badge" :class="getStatusColor(record.fromStatus)">
                {{ getStatusText(record.fromStatus) }}
              </span>
              <ArrowRight :size="16" class="arrow-icon" />
              <span class="status-badge" :class="getStatusColor(record.toStatus)">
                {{ getStatusText(record.toStatus) }}
              </span>
            </div>
            <div class="history-meta">
              <span class="operator">{{ record.operatorName }}</span>
              <span class="timestamp">{{ formatDateTime(record.timestamp) }}</span>
            </div>
          </div>
          <div class="history-reason" v-if="record.reason">
            <span class="reason-label">原因：</span>
            <span class="reason-text">{{ record.reason }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 状态变更确认对话框 -->
    <div v-if="showConfirmDialog" class="modal-overlay" @click="cancelStatusChange">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>确认状态变更</h3>
          <button class="btn btn-icon" @click="cancelStatusChange">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-body">
          <div class="confirm-info">
            <div class="status-change-preview">
              <span class="status-badge" :class="currentStatusColor">
                {{ currentStatusText }}
              </span>
              <ArrowRight :size="20" class="arrow-icon" />
              <span class="status-badge" :class="getTransitionStatusColor(pendingTransition)">
                {{ pendingTransition?.label }}
              </span>
            </div>

            <p class="confirm-message">
              {{ pendingTransition?.confirmMessage }}
            </p>

            <div class="activity-info">
              <p><strong>活动名称：</strong>{{ activity.name }}</p>
              <p><strong>操作描述：</strong>{{ pendingTransition?.description }}</p>
            </div>
          </div>

          <!-- 原因输入 -->
          <div v-if="pendingTransition?.requiresReason" class="reason-input">
            <label class="form-label required">变更原因</label>
            <textarea
              v-model="changeReason"
              class="form-textarea"
              :class="{ error: reasonError }"
              placeholder="请详细说明状态变更的原因..."
              rows="3"
              maxlength="500"
            ></textarea>
            <div class="char-count">{{ changeReason.length }}/500</div>
            <span v-if="reasonError" class="error-text">{{ reasonError }}</span>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" @click="cancelStatusChange">
            取消
          </button>
          <button
            class="btn btn-primary"
            @click="confirmStatusChange"
            :disabled="submitting"
          >
            <Loader v-if="submitting" :size="16" class="spin" />
            确认变更
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Play, Square, XCircle, AlertTriangle, ChevronDown, ArrowRight, X, Loader
} from 'lucide-vue-next'
import type { Activity, User } from '@/types'
import {
  ActivityStatusService,
  StatusChangeHistoryService,
  type StatusTransition,
  type StatusChangeRecord,
  type ActivityStatus
} from '@/services/activityStatusService'
import { useAuthStore } from '@/stores/auth'
import { mockUpdateActivityStatus } from '@/mock/activities'

interface Props {
  activity: Activity
  showHistory?: boolean
}

interface Emits {
  (e: 'statusChanged', activity: Activity): void
}

const props = withDefaults(defineProps<Props>(), {
  showHistory: true
})

const emit = defineEmits<Emits>()

// 响应式数据
const authStore = useAuthStore()
const showConfirmDialog = ref(false)
const pendingTransition = ref<StatusTransition | null>(null)
const changeReason = ref('')
const reasonError = ref('')
const submitting = ref(false)
const history = ref<StatusChangeRecord[]>([])
const showHistoryPanel = ref(true)

// 计算属性
const currentUser = computed(() => authStore.user)

const permissions = computed(() => {
  if (!currentUser.value) {
    return {
      canView: true,
      canEdit: false,
      canDelete: false,
      canChangeStatus: false,
      availableTransitions: []
    }
  }
  return ActivityStatusService.getActivityPermissions(props.activity, currentUser.value)
})

const currentStatusText = computed(() =>
  ActivityStatusService.getStatusText(props.activity.status)
)

const currentStatusColor = computed(() =>
  ActivityStatusService.getStatusColor(props.activity.status)
)

const suggestions = computed(() =>
  ActivityStatusService.getStatusSuggestions(props.activity)
)

// 方法
const loadHistory = () => {
  history.value = StatusChangeHistoryService.getActivityHistory(props.activity.id)
}

const initiateStatusChange = (transition: StatusTransition) => {
  pendingTransition.value = transition
  changeReason.value = ''
  reasonError.value = ''
  showConfirmDialog.value = true
}

const cancelStatusChange = () => {
  showConfirmDialog.value = false
  pendingTransition.value = null
  changeReason.value = ''
  reasonError.value = ''
}

const confirmStatusChange = async () => {
  if (!pendingTransition.value || !currentUser.value) {
    return
  }

  // 验证原因输入
  if (pendingTransition.value.requiresReason && !changeReason.value.trim()) {
    reasonError.value = '请填写变更原因'
    return
  }

  // 验证状态变更
  const validation = ActivityStatusService.validateStatusChange(
    props.activity,
    pendingTransition.value.to,
    currentUser.value,
    changeReason.value
  )

  if (!validation.valid) {
    alert(validation.error)
    return
  }

  submitting.value = true
  try {
    // 调用API更新状态
    const response = await mockUpdateActivityStatus(
      props.activity.id,
      pendingTransition.value.to,
      changeReason.value || undefined
    )

    if (!response.success || !response.data) {
      alert(response.message || '状态更新失败')
      return
    }

    // 记录状态变更历史
    StatusChangeHistoryService.recordStatusChange(
      props.activity,
      props.activity.status,
      pendingTransition.value.to,
      currentUser.value,
      changeReason.value || undefined
    )

    // 发出状态变更事件
    emit('statusChanged', response.data)

    // 重新加载历史记录
    loadHistory()

    // 关闭对话框
    cancelStatusChange()

    // 显示成功消息
    alert(`活动状态已成功变更为：${ActivityStatusService.getStatusText(pendingTransition.value.to)}`)

  } catch (error) {
    console.error('状态变更失败:', error)
    alert('状态变更失败，请重试')
  } finally {
    submitting.value = false
  }
}

const getTransitionButtonClass = (transition: StatusTransition): string => {
  const baseClass = 'btn-status'
  switch (transition.to) {
    case 'running':
      return `${baseClass} btn-success`
    case 'ended':
      return `${baseClass} btn-info`
    case 'cancelled':
      return `${baseClass} btn-danger`
    default:
      return baseClass
  }
}

const getTransitionIcon = (transition: StatusTransition) => {
  switch (transition.to) {
    case 'running':
      return Play
    case 'ended':
      return Square
    case 'cancelled':
      return XCircle
    default:
      return Play
  }
}

const getTransitionStatusColor = (transition: StatusTransition | null): string => {
  if (!transition) return 'default'
  return ActivityStatusService.getStatusColor(transition.to)
}

const getStatusText = (status: ActivityStatus): string => {
  return ActivityStatusService.getStatusText(status)
}

const getStatusColor = (status: ActivityStatus): string => {
  return ActivityStatusService.getStatusColor(status)
}

const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 生命周期
onMounted(() => {
  loadHistory()
})
</script>

<style scoped>
.activity-status-manager {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 状态操作区域 */
.status-actions {
  margin-bottom: 20px;
}

.current-status {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.status-label {
  font-weight: 500;
  color: #333;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.warning {
  background: #fff3cd;
  color: #856404;
}

.status-badge.success {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.info {
  background: #d4edda;
  color: #155724;
}

.status-badge.danger {
  background: #f8d7da;
  color: #721c24;
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn-status {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-success {
  color: #2e7d32;
  border-color: #2e7d32;
  background: #e8f5e8;
}

.btn-success:hover {
  background: #2e7d32;
  color: white;
}

.btn-info {
  color: #1976d2;
  border-color: #1976d2;
  background: #e3f2fd;
}

.btn-info:hover {
  background: #1976d2;
  color: white;
}

.btn-danger {
  color: #d32f2f;
  border-color: #d32f2f;
  background: #ffebee;
}

.btn-danger:hover {
  background: #d32f2f;
  color: white;
}

/* 状态建议 */
.status-suggestions {
  background: #fff3cd;
  border: 1px solid #ffeaa7;
  border-radius: 4px;
  padding: 12px;
  margin-bottom: 20px;
}

.suggestions-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: #856404;
  margin-bottom: 8px;
}

.suggestions-list {
  margin: 0;
  padding-left: 20px;
  color: #856404;
}

.suggestions-list li {
  margin-bottom: 4px;
}

/* 状态历史 */
.status-history {
  border-top: 1px solid #e0e0e0;
  padding-top: 20px;
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.history-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.btn-text {
  background: transparent;
  color: #1976d2;
  border: none;
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 4px;
  transition: background 0.2s;
}

.btn-text:hover {
  background: #f5f5f5;
}

.rotate-180 {
  transform: rotate(180deg);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.history-item {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  padding: 12px;
  background: #fafafa;
}

.history-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.status-change {
  display: flex;
  align-items: center;
  gap: 8px;
}

.arrow-icon {
  color: #666;
}

.history-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: #666;
}

.operator {
  font-weight: 500;
}

.history-reason {
  font-size: 14px;
  color: #333;
}

.reason-label {
  font-weight: 500;
}

.reason-text {
  color: #666;
}

/* 模态对话框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #e0e0e0;
}

.confirm-info {
  margin-bottom: 20px;
}

.status-change-preview {
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: center;
  margin-bottom: 16px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
}

.confirm-message {
  color: #666;
  line-height: 1.5;
  margin-bottom: 16px;
}

.activity-info p {
  margin: 8px 0;
  color: #333;
}

.reason-input {
  margin-top: 20px;
}

.form-label {
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
  font-size: 14px;
  display: block;
}

.form-label.required::after {
  content: ' *';
  color: #f44336;
}

.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  resize: vertical;
  min-height: 80px;
  transition: border-color 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 2px rgba(25, 118, 210, 0.1);
}

.form-textarea.error {
  border-color: #f44336;
}

.char-count {
  font-size: 12px;
  color: #666;
  text-align: right;
  margin-top: 4px;
}

.error-text {
  color: #f44336;
  font-size: 12px;
  margin-top: 4px;
  display: block;
}

.btn {
  padding: 10px 20px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #1565c0;
}

.btn-outline {
  background: transparent;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.btn-outline:hover {
  background: #1976d2;
  color: white;
}

.btn-icon {
  padding: 8px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon:hover {
  background: #f5f5f5;
  border-color: #1976d2;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .action-buttons {
    flex-direction: column;
  }

  .history-main {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .modal-content {
    width: 95%;
    margin: 20px;
  }
}
</style>
