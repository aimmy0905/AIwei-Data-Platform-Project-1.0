<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">投放账号管理</h3>
        <button class="modal-close" @click="$emit('close')">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-content">
        <!-- 项目信息 -->
        <div class="project-info">
          <h4>{{ projectInfo.project_name }}</h4>
          <p>客户：{{ projectInfo.customer_name }}</p>
        </div>

        <!-- 平台选择 -->
        <div class="platform-tabs">
          <button
            v-for="platform in platforms"
            :key="platform.value"
            class="tab-btn"
            :class="{ 'tab-btn--active': activePlatform === platform.value }"
            @click="activePlatform = platform.value as 'Google' | 'Meta' | 'Criteo' | 'Bing'"
          >
            <component :is="platform.icon" :size="16" />
            {{ platform.label }}
          </button>
        </div>

        <!-- 账号列表 -->
        <div class="accounts-section">
          <div class="section-header">
            <h5>{{ activePlatform }} 账号</h5>
            <button class="action-btn action-btn--primary" @click="showCreateAccount = true">
              <Plus :size="16" />
              新建账号
            </button>
          </div>

          <div class="accounts-list">
            <div
              v-for="account in filteredAccounts"
              :key="account.id"
              class="account-card"
            >
              <div class="account-card__header">
                <div class="account-info">
                  <div class="account-name">{{ account.account }}</div>
                  <div class="platform-badge">
                    <component :is="getPlatformIcon(account.platform)" :size="14" />
                    {{ account.platform }}
                  </div>
                </div>
                <div class="account-actions">
                  <button
                    class="action-btn-small action-btn-small--secondary"
                    @click="editAccount(account)"
                    title="编辑"
                  >
                    <Edit :size="14" />
                  </button>
                  <button
                    class="action-btn-small action-btn-small--danger"
                    @click="deleteAccount(account.id)"
                    title="删除"
                  >
                    <Trash2 :size="14" />
                  </button>
                </div>
              </div>

              <div class="account-metrics">
                <div class="metric-item">
                  <div class="metric-label">账号余额</div>
                  <div class="metric-value balance">
                    ${{ formatNumber(account.balance) }}
                  </div>
                  <div class="metric-status" :class="getBalanceStatusClass(account.balance)">
                    {{ getBalanceStatus(account.balance) }}
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">已花费金额</div>
                  <div class="metric-value spent">
                    ${{ formatNumber(account.spent_amount) }}
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">预计可用时间</div>
                  <div class="metric-value time">
                    {{ account.estimated_available_time }}
                  </div>
                  <div class="metric-status" :class="getTimeStatusClass(account.estimated_available_time)">
                    {{ getTimeStatus(account.estimated_available_time) }}
                  </div>
                </div>

                <div class="metric-item">
                  <div class="metric-label">使用率</div>
                  <div class="usage-progress">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        :style="{ width: getUsagePercentage(account) + '%' }"
                        :class="getUsageClass(getUsagePercentage(account))"
                      ></div>
                    </div>
                    <span class="usage-text">{{ getUsagePercentage(account) }}%</span>
                  </div>
                </div>
              </div>

              <div class="account-meta">
                <span class="created-info">
                  创建时间：{{ formatDate(account.created_at) }} |
                  更新时间：{{ formatDate(account.updated_at) }}
                </span>
              </div>
            </div>

            <div v-if="filteredAccounts.length === 0" class="empty-state">
              <div class="empty-icon">
                <Monitor :size="48" />
              </div>
              <div class="empty-text">暂无{{ activePlatform }}账号</div>
              <button class="action-btn action-btn--primary" @click="showCreateAccount = true">
                创建第一个账号
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 新建/编辑账号弹窗 -->
      <div v-if="showCreateAccount || editingAccount" class="sub-modal-overlay" @click="closeAccountForm">
        <div class="sub-modal-container" @click.stop>
          <div class="sub-modal-header">
            <h4>{{ editingAccount ? '编辑账号' : '新建账号' }}</h4>
            <button class="modal-close" @click="closeAccountForm">
              <X :size="18" />
            </button>
          </div>

          <div class="sub-modal-content">
            <form @submit.prevent="saveAccount">
              <div class="form-group">
                <label>投放平台</label>
                <select v-model="accountForm.platform" required>
                  <option value="">请选择平台</option>
                  <option value="Google">Google</option>
                  <option value="Meta">Meta</option>
                  <option value="Criteo">Criteo</option>
                  <option value="Bing">Bing</option>
                </select>
              </div>

              <div class="form-group">
                <label>账号标识 *</label>
                <input
                  type="text"
                  v-model="accountForm.account"
                  placeholder="请输入账号标识"
                  required
                  minlength="5"
                  maxlength="100"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>账号余额</label>
                  <input
                    type="number"
                    v-model.number="accountForm.balance"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div class="form-group">
                  <label>已花费金额</label>
                  <input
                    type="number"
                    v-model.number="accountForm.spent_amount"
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div class="form-group">
                <label>预计可用时间</label>
                <input
                  type="text"
                  v-model="accountForm.estimated_available_time"
                  placeholder="例如：15天"
                />
              </div>

              <div class="form-actions">
                <button type="button" class="action-btn action-btn--secondary" @click="closeAccountForm">
                  取消
                </button>
                <button type="submit" class="action-btn action-btn--primary">
                  {{ editingAccount ? '更新' : '创建' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { X, Plus, Edit, Trash2, Monitor, Chrome, Search } from 'lucide-vue-next'
import { mockAdAccounts, type AdAccount, type Project } from '@/mock/projects'

interface Props {
  projectId: number
  projectInfo: Project
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// 响应式数据
const accounts = ref<AdAccount[]>([])
const activePlatform = ref<'Google' | 'Meta' | 'Criteo' | 'Bing'>('Google')
const showCreateAccount = ref(false)
const editingAccount = ref<AdAccount | null>(null)

const platforms = [
  { label: 'Google', value: 'Google', icon: Chrome },
  { label: 'Meta', value: 'Meta', icon: 'div' },
  { label: 'Criteo', value: 'Criteo', icon: Monitor },
  { label: 'Bing', value: 'Bing', icon: Search }
]

const accountForm = ref({
  platform: '',
  account: '',
  balance: 0,
  spent_amount: 0,
  estimated_available_time: ''
})

// 初始化数据
onMounted(() => {
  loadAccounts()
})

// 计算属性
const filteredAccounts = computed(() => {
  return accounts.value.filter(account =>
    account.project_id === props.projectId && account.platform === activePlatform.value
  )
})

// 方法
const loadAccounts = () => {
  // 模拟从API加载数据
  accounts.value = [...mockAdAccounts]
}

const getPlatformIcon = (platform: string) => {
  const iconMap: Record<string, any> = {
    'Google': Chrome,
    'Meta': 'div',
    'Criteo': Monitor,
    'Bing': Search
  }
  return iconMap[platform] || Monitor
}

const getBalanceStatus = (balance: number) => {
  if (balance <= 1000) return '余额不足'
  if (balance <= 5000) return '余额偏低'
  return '余额充足'
}

const getBalanceStatusClass = (balance: number) => {
  if (balance <= 1000) return 'status-danger'
  if (balance <= 5000) return 'status-warning'
  return 'status-success'
}

const getTimeStatus = (timeStr: string) => {
  const days = parseInt(timeStr)
  if (days <= 3) return '即将耗尽'
  if (days <= 7) return '需要关注'
  return '时间充足'
}

const getTimeStatusClass = (timeStr: string) => {
  const days = parseInt(timeStr)
  if (days <= 3) return 'status-danger'
  if (days <= 7) return 'status-warning'
  return 'status-success'
}

const getUsagePercentage = (account: AdAccount) => {
  const total = account.balance + account.spent_amount
  if (total === 0) return 0
  return Math.round((account.spent_amount / total) * 100)
}

const getUsageClass = (percentage: number) => {
  if (percentage >= 90) return 'usage-danger'
  if (percentage >= 70) return 'usage-warning'
  return 'usage-normal'
}

const formatNumber = (num: number) => {
  return num.toLocaleString('zh-CN')
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const handleOverlayClick = () => {
  emit('close')
}

const editAccount = (account: AdAccount) => {
  editingAccount.value = account
  accountForm.value = {
    platform: account.platform,
    account: account.account,
    balance: account.balance,
    spent_amount: account.spent_amount,
    estimated_available_time: account.estimated_available_time
  }
}

const deleteAccount = (accountId: number) => {
  if (confirm('确定要删除这个账号吗？')) {
    accounts.value = accounts.value.filter(account => account.id !== accountId)
    console.log('删除账号:', accountId)
  }
}

const closeAccountForm = () => {
  showCreateAccount.value = false
  editingAccount.value = null
  accountForm.value = {
    platform: '',
    account: '',
    balance: 0,
    spent_amount: 0,
    estimated_available_time: ''
  }
}

const saveAccount = () => {
  if (editingAccount.value) {
    // 更新现有账号
    const index = accounts.value.findIndex(account => account.id === editingAccount.value!.id)
    if (index !== -1) {
      accounts.value[index] = {
        ...accounts.value[index],
        ...accountForm.value,
        platform: accountForm.value.platform as 'Google' | 'Meta' | 'Criteo' | 'Bing',
        updated_at: new Date().toISOString()
      }
    }
    console.log('更新账号:', editingAccount.value.id)
  } else {
    // 创建新账号
    const newAccount: AdAccount = {
      id: Date.now(),
      project_id: props.projectId,
      ...accountForm.value,
      platform: accountForm.value.platform as 'Google' | 'Meta' | 'Criteo' | 'Bing',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
    accounts.value.push(newAccount)
    console.log('创建账号:', newAccount)
  }

  closeAccountForm()
}
</script>

<style scoped>
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

.modal-container {
  background: var(--color-background);
  border-radius: 8px;
  width: 90%;
  max-width: 900px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.modal-close {
  padding: 4px;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.modal-content {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.project-info {
  background: var(--color-background-secondary);
  padding: 16px;
  border-radius: 6px;
  margin-bottom: 24px;
}

.project-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 8px 0;
}

.project-info p {
  color: var(--color-text-secondary);
  margin: 0;
  font-size: 14px;
}

.platform-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: var(--color-background-hover);
}

.tab-btn--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-header h5 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 6px;
  border: none;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn--primary {
  background: var(--color-primary);
  color: white;
}

.action-btn--primary:hover {
  background: var(--color-primary-hover);
}

.action-btn--secondary {
  background: var(--color-background-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.action-btn--secondary:hover {
  background: var(--color-background-hover);
}

.accounts-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.account-card {
  background: var(--color-background-secondary);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 20px;
}

.account-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.account-info .account-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.platform-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  width: fit-content;
}

.account-actions {
  display: flex;
  gap: 8px;
}

.action-btn-small {
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-small--secondary {
  background: var(--color-background-tertiary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.action-btn-small--secondary:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.action-btn-small--danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.action-btn-small--danger:hover {
  background: var(--color-danger);
  color: white;
}

.account-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.metric-item {
  background: var(--color-background);
  padding: 12px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.metric-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 4px;
}

.metric-value {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.metric-value.balance {
  color: var(--color-success);
}

.metric-value.spent {
  color: var(--color-warning);
}

.metric-value.time {
  color: var(--color-info);
}

.metric-status {
  font-size: 11px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 3px;
  width: fit-content;
}

.status-success {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.status-danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.usage-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-background-tertiary);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.usage-normal {
  background: var(--color-success);
}

.usage-warning {
  background: var(--color-warning);
}

.usage-danger {
  background: var(--color-danger);
}

.usage-text {
  font-size: 12px;
  font-weight: 600;
  min-width: 35px;
  text-align: right;
  color: var(--color-text-secondary);
}

.account-meta {
  font-size: 12px;
  color: var(--color-text-secondary);
  text-align: right;
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: var(--color-text-secondary);
}

.empty-icon {
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-text {
  font-size: 16px;
  margin-bottom: 20px;
}

.sub-modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
}

.sub-modal-container {
  background: var(--color-background);
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.sub-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
}

.sub-modal-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.sub-modal-content {
  padding: 20px;
  overflow-y: auto;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 6px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 14px;
  background: var(--color-background);
  color: var(--color-text-primary);
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

@media (max-width: 768px) {
  .modal-container {
    width: 95%;
    max-height: 95vh;
  }

  .account-metrics {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .account-card__header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .platform-tabs {
    justify-content: center;
  }
}
</style>
