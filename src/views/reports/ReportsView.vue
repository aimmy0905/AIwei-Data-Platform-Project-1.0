<template>
  <div class="reports-view">
    <div class="page-header">
      <div class="page-header__main">
        <h1 class="page-title">报告中心</h1>
        <p class="page-description">周报月报管理，自动截图，小结建议，会议记录和待办事项管理</p>
      </div>
      <div class="page-header__actions">
        <button
          class="action-btn action-btn--secondary"
          @click="showScheduleModal = true"
        >
          <Clock :size="16" />
          定时报告
        </button>
        <button
          class="action-btn action-btn--primary"
          @click="createWeeklyReport"
        >
          <Plus :size="16" />
          创建周报
        </button>
        <button
          class="action-btn action-btn--primary"
          @click="createMonthlyReport"
        >
          <FileText :size="16" />
          创建月报
        </button>
      </div>
    </div>

    <div class="reports-content">
      <!-- 报告类型切换 -->
      <div class="report-tabs">
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'weekly' }"
          @click="activeTab = 'weekly'"
        >
          <Calendar :size="16" />
          周报管理
        </button>
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'monthly' }"
          @click="activeTab = 'monthly'"
        >
          <FileText :size="16" />
          月报管理
        </button>
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'meeting' }"
          @click="activeTab = 'meeting'"
        >
          <Users :size="16" />
          会议记录
        </button>
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'todo' }"
          @click="activeTab = 'todo'"
        >
          <CheckSquare :size="16" />
          待办事项
        </button>
        <button
          class="tab-btn"
          :class="{ 'tab-btn--active': activeTab === 'screenshot' }"
          @click="activeTab = 'screenshot'"
        >
          <Camera :size="16" />
          自动截图
        </button>
      </div>

      <!-- 周报管理 -->
      <div v-if="activeTab === 'weekly'" class="weekly-reports-section">
        <div class="section-header">
          <h2>周报管理</h2>
          <div class="section-controls">
            <SearchInput
              v-model="weeklySearch"
              placeholder="搜索周报..."
              :suggestions="[]"
              class="section-search"
            />
            <select v-model="weeklyFilter.status" class="section-filter">
              <option value="">全部状态</option>
              <option value="draft">草稿</option>
              <option value="pending">待审核</option>
              <option value="approved">已审核</option>
              <option value="sent">已发送</option>
              <option value="archived">已归档</option>
            </select>
            <select v-model="weeklyFilter.year" class="section-filter">
              <option value="">全部年份</option>
              <option value="2025">2025年</option>
              <option value="2024">2024年</option>
            </select>
          </div>
        </div>

        <div class="reports-table-container">
          <table class="reports-table">
            <thead>
              <tr>
                <th>报告周期</th>
                <th>项目名称</th>
                <th>客户名称</th>
                <th>状态</th>
                <th>自动截图</th>
                <th>会议记录</th>
                <th>待办事项</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="report in filteredWeeklyReports"
                :key="report.id"
                class="report-row"
              >
                <td class="report-week">{{ report.reportWeek }}</td>
                <td class="project-name">{{ report.projectName }}</td>
                <td class="customer-name">{{ report.customerName }}</td>
                <td class="report-status">
                  <span
                    class="status-badge"
                    :class="`status-badge--${report.status}`"
                  >
                    {{ getStatusLabel(report.status) }}
                  </span>
                </td>
                <td class="screenshot-status">
                  <span v-if="report.autoScreenshot" class="screenshot-yes">
                    <CheckCircle :size="16" />
                    已截图
                  </span>
                  <span v-else class="screenshot-no">
                    <XCircle :size="16" />
                    未截图
                  </span>
                </td>
                <td class="meeting-count">
                  {{ report.content?.meetingRecords?.length || 0 }} 条
                </td>
                <td class="todo-count">
                  {{ report.content?.todoItems?.length || 0 }} 项
                </td>
                <td class="creator">{{ getUserName(report.createdBy) }}</td>
                <td class="created-time">{{ formatDate(report.createdAt) }}</td>
                <td class="report-actions">
                  <div class="action-buttons">
                    <button
                      class="action-btn-sm"
                      @click="viewReport(report)"
                      title="查看"
                    >
                      <Eye :size="14" />
                    </button>
                    <button
                      class="action-btn-sm"
                      @click="editReport(report)"
                      title="编辑"
                    >
                      <Edit :size="14" />
                    </button>
                    <button
                      v-if="report.status === 'draft'"
                      class="action-btn-sm action-btn-sm--success"
                      @click="approveReport(report)"
                      title="审核"
                    >
                      <CheckCircle :size="14" />
                    </button>
                    <button
                      v-if="report.status === 'approved'"
                      class="action-btn-sm action-btn-sm--primary"
                      @click="sendReport(report)"
                      title="发送"
                    >
                      <Send :size="14" />
                    </button>
                    <button
                      class="action-btn-sm"
                      @click="exportReport(report)"
                      title="导出"
                    >
                      <Download :size="14" />
                    </button>
                    <button
                      class="action-btn-sm action-btn-sm--danger"
                      @click="deleteReport(report)"
                      title="删除"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 月报管理 -->
      <div v-if="activeTab === 'monthly'" class="monthly-reports-section">
        <div class="section-header">
          <h2>月报管理</h2>
          <div class="section-controls">
            <SearchInput
              v-model="monthlySearch"
              placeholder="搜索月报..."
              :suggestions="[]"
              class="section-search"
            />
            <select v-model="monthlyFilter.status" class="section-filter">
              <option value="">全部状态</option>
              <option value="draft">草稿</option>
              <option value="pending">待审核</option>
              <option value="approved">已审核</option>
              <option value="sent">已发送</option>
              <option value="archived">已归档</option>
            </select>
          </div>
        </div>

        <div class="reports-grid">
          <div
            v-for="report in filteredMonthlyReports"
            :key="report.id"
            class="monthly-report-card"
          >
            <div class="report-card-header">
              <div class="report-card-title">
                <h3>{{ report.reportMonth }} 月报</h3>
                <p>{{ report.projectName }}</p>
              </div>
              <div class="report-card-status">
                <span
                  class="status-badge"
                  :class="`status-badge--${report.status}`"
                >
                  {{ getStatusLabel(report.status) }}
                </span>
              </div>
            </div>
            <div class="report-card-content">
              <div class="report-card-meta">
                <div class="meta-item">
                  <Calendar :size="16" />
                  <span>包含 {{ report.weeklyReportIds?.length || 0 }} 个周报</span>
                </div>
                <div class="meta-item">
                  <Camera :size="16" />
                  <span>{{ report.screenshotCount || 0 }} 张截图</span>
                </div>
                <div class="meta-item">
                  <User :size="16" />
                  <span>{{ report.customerName }}</span>
                </div>
              </div>
              <div class="report-card-summary">
                <p>{{ report.monthlySummary || '暂无总结' }}</p>
              </div>
            </div>
            <div class="report-card-actions">
              <button
                class="card-action-btn"
                @click="viewReport(report)"
              >
                <Eye :size="16" />
                查看
              </button>
              <button
                class="card-action-btn"
                @click="editReport(report)"
              >
                <Edit :size="16" />
                编辑
              </button>
              <button
                class="card-action-btn"
                @click="exportReport(report)"
              >
                <Download :size="16" />
                导出
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 会议记录管理 -->
      <div v-if="activeTab === 'meeting'" class="meeting-records-section">
        <div class="section-header">
          <h2>会议记录管理</h2>
          <div class="section-controls">
            <SearchInput
              v-model="meetingSearch"
              placeholder="搜索会议记录..."
              :suggestions="[]"
              class="section-search"
            />
            <select v-model="meetingFilter.type" class="section-filter">
              <option value="">全部类型</option>
              <option value="project-kickoff">项目启动</option>
              <option value="weekly-review">周度回顾</option>
              <option value="client-meeting">客户沟通</option>
              <option value="problem-discussion">问题讨论</option>
            </select>
            <button
              class="action-btn action-btn--primary"
              @click="createMeetingRecord"
            >
              <Plus :size="16" />
              新建会议记录
            </button>
          </div>
        </div>

        <div class="meeting-records-list">
          <div
            v-for="record in filteredMeetingRecords"
            :key="record.id"
            class="meeting-record-item"
          >
            <div class="meeting-record-header">
              <div class="meeting-info">
                <h3>{{ record.meetingTitle }}</h3>
                <div class="meeting-meta">
                  <span class="meeting-type">{{ getMeetingTypeLabel(record.meetingType) }}</span>
                  <span class="meeting-date">{{ formatDate(record.meetingTime) }}</span>
                  <span class="meeting-project">{{ record.projectName }}</span>
                </div>
              </div>
              <div class="meeting-status">
                <span
                  class="status-badge"
                  :class="`status-badge--${record.status}`"
                >
                  {{ record.status === 'published' ? '已发布' : '草稿' }}
                </span>
              </div>
            </div>
            <div class="meeting-record-content">
              <div class="meeting-attendees">
                <Users :size="16" />
                <span>参会人员：{{ record.attendees?.map((a: any) => a.name).join('、') }}</span>
              </div>
              <div class="meeting-summary">
                <p>{{ record.content || '暂无会议内容' }}</p>
              </div>
              <div class="meeting-actions-summary">
                <div v-if="record.decisions?.length" class="decisions-count">
                  <CheckCircle :size="16" />
                  {{ record.decisions.length }} 项决策
                </div>
                <div v-if="record.actionItems?.length" class="actions-count">
                  <Target :size="16" />
                  {{ record.actionItems.length }} 项行动计划
                </div>
              </div>
            </div>
            <div class="meeting-record-actions">
              <button
                class="action-btn-sm"
                @click="viewMeetingRecord(record)"
                title="查看详情"
              >
                <Eye :size="14" />
              </button>
              <button
                class="action-btn-sm"
                @click="editMeetingRecord(record)"
                title="编辑"
              >
                <Edit :size="14" />
              </button>
              <button
                v-if="record.status === 'draft'"
                class="action-btn-sm action-btn-sm--success"
                @click="publishMeetingRecord(record)"
                title="发布"
              >
                <Send :size="14" />
              </button>
              <button
                class="action-btn-sm action-btn-sm--danger"
                @click="deleteMeetingRecord(record)"
                title="删除"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 待办事项管理 -->
      <div v-if="activeTab === 'todo'" class="todo-items-section">
        <div class="section-header">
          <h2>待办事项管理</h2>
          <div class="section-controls">
            <SearchInput
              v-model="todoSearch"
              placeholder="搜索待办事项..."
              :suggestions="[]"
              class="section-search"
            />
            <select v-model="todoFilter.status" class="section-filter">
              <option value="">全部状态</option>
              <option value="not_started">未开始</option>
              <option value="in_progress">进行中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
            <select v-model="todoFilter.priority" class="section-filter">
              <option value="">全部优先级</option>
              <option value="high">高优先级</option>
              <option value="medium">中优先级</option>
              <option value="low">低优先级</option>
            </select>
            <button
              class="action-btn action-btn--primary"
              @click="createTodoItem"
            >
              <Plus :size="16" />
              新建待办事项
            </button>
          </div>
        </div>

        <div class="todo-items-list">
          <div
            v-for="item in filteredTodoItems"
            :key="item.id"
            class="todo-item"
            :class="`todo-item--${item.status}`"
          >
            <div class="todo-item-header">
              <div class="todo-priority">
                <span
                  class="priority-badge"
                  :class="`priority-badge--${item.priority}`"
                >
                  {{ getPriorityLabel(item.priority) }}
                </span>
              </div>
              <div class="todo-status">
                <span
                  class="status-badge"
                  :class="`status-badge--${item.status}`"
                >
                  {{ getTodoStatusLabel(item.status) }}
                </span>
              </div>
            </div>
            <div class="todo-item-content">
              <h3>{{ item.title }}</h3>
              <p>{{ item.description }}</p>
              <div class="todo-meta">
                <div class="meta-item">
                  <User :size="16" />
                  <span>负责人：{{ item.assigneeName }}</span>
                </div>
                <div class="meta-item">
                  <Calendar :size="16" />
                  <span>计划完成：{{ formatDate(item.plannedCompletionDate) }}</span>
                </div>
                <div class="meta-item">
                  <Target :size="16" />
                  <span>{{ item.projectName || '通用任务' }}</span>
                </div>
              </div>
              <div class="todo-progress">
                <div class="progress-bar">
                  <div
                    class="progress-fill"
                    :style="{ width: `${item.progress}%` }"
                  ></div>
                </div>
                <span class="progress-text">{{ item.progress }}%</span>
              </div>
            </div>
            <div class="todo-item-actions">
              <button
                class="action-btn-sm"
                @click="viewTodoItem(item)"
                title="查看详情"
              >
                <Eye :size="14" />
              </button>
              <button
                class="action-btn-sm"
                @click="editTodoItem(item)"
                title="编辑"
              >
                <Edit :size="14" />
              </button>
              <button
                v-if="item.status !== 'completed'"
                class="action-btn-sm action-btn-sm--success"
                @click="completeTodoItem(item)"
                title="标记完成"
              >
                <CheckCircle :size="14" />
              </button>
              <button
                class="action-btn-sm action-btn-sm--danger"
                @click="deleteTodoItem(item)"
                title="删除"
              >
                <Trash2 :size="14" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 自动截图管理 -->
      <div v-if="activeTab === 'screenshot'" class="screenshot-section">
        <div class="section-header">
          <h2>自动截图管理</h2>
          <div class="section-controls">
            <SearchInput
              v-model="screenshotSearch"
              placeholder="搜索截图记录..."
              :suggestions="[]"
              class="section-search"
            />
            <select v-model="screenshotFilter.quality" class="section-filter">
              <option value="">全部质量</option>
              <option value="good">质量良好</option>
              <option value="poor">质量较差</option>
              <option value="failed">截图失败</option>
            </select>
            <button
              class="action-btn action-btn--primary"
              @click="manualScreenshot"
            >
              <Camera :size="16" />
              手动截图
            </button>
          </div>
        </div>

        <div class="screenshot-grid">
          <div
            v-for="screenshot in filteredScreenshots"
            :key="screenshot.id"
            class="screenshot-card"
          >
            <div class="screenshot-preview">
              <div class="screenshot-placeholder">
                <Camera :size="48" />
                <p>数据看板截图</p>
              </div>
            </div>
            <div class="screenshot-info">
              <h3>{{ screenshot.projectName }}</h3>
              <div class="screenshot-meta">
                <div class="meta-item">
                  <Calendar :size="16" />
                  <span>{{ formatDate(screenshot.screenshotTime) }}</span>
                </div>
                <div class="meta-item">
                  <Hash :size="16" />
                  <span>第{{ screenshot.weekNumber }}周</span>
                </div>
                <div class="meta-item">
                  <FileText :size="16" />
                  <span>{{ screenshot.fileSize }}</span>
                </div>
              </div>
              <div class="screenshot-status">
                <span
                  class="quality-badge"
                  :class="`quality-badge--${screenshot.qualityStatus}`"
                >
                  {{ getQualityLabel(screenshot.qualityStatus) }}
                </span>
                <span
                  class="usage-badge"
                  :class="`usage-badge--${screenshot.usageStatus}`"
                >
                  {{ getUsageLabel(screenshot.usageStatus) }}
                </span>
              </div>
            </div>
            <div class="screenshot-actions">
              <button
                class="card-action-btn"
                @click="viewScreenshot(screenshot)"
              >
                <Eye :size="16" />
                查看
              </button>
              <button
                class="card-action-btn"
                @click="downloadScreenshot(screenshot)"
              >
                <Download :size="16" />
                下载
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 报告统计 -->
      <div class="stats-section">
        <h2>使用统计</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <FileText :size="24" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ reportStats.totalReports }}</div>
              <div class="stat-label">总报告数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <Calendar :size="24" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ reportStats.thisMonth }}</div>
              <div class="stat-label">本月生成</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <Download :size="24" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ reportStats.downloads }}</div>
              <div class="stat-label">下载次数</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">
              <TrendingUp :size="24" />
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ reportStats.mostUsed }}</div>
              <div class="stat-label">最常用类型</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 生成中状态 -->
    <div v-if="generating" class="generating-overlay">
      <div class="generating-content">
        <Loader :size="48" class="generating-spinner" />
        <h3>正在生成报告...</h3>
        <p>{{ generatingStatus }}</p>
        <div class="generating-progress">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: `${generatingProgress}%` }"
            ></div>
          </div>
          <span class="progress-text">{{ generatingProgress }}%</span>
        </div>
      </div>
    </div>

    <!-- 成功提示 -->
    <div v-if="showSuccess" class="success-notification">
      <div class="success-content">
        <CheckCircle :size="24" />
        <span>{{ successMessage }}</span>
        <button @click="showSuccess = false" class="success-close">
          <X :size="16" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Plus, Clock, Eye, Settings, FileText, Download, Share2,
  RefreshCw, Trash2, ChevronLeft, ChevronRight, Calendar,
  TrendingUp, Loader, CheckCircle, X, BarChart3, Users,
  DollarSign, Target, Edit, Send, User, XCircle, Camera,
  Hash, CheckSquare
} from 'lucide-vue-next'
import SearchInput from '@/components/common/SearchInput.vue'
import {
  mockGetWeeklyReports,
  mockGetMonthlyReports,
  mockGetMeetingRecords,
  mockGetTodoItems,
  mockGetDashboardScreenshots,
  mockCreateWeeklyReport,
  mockCreateMonthlyReport,
  mockUpdateReport,
  mockDeleteReport,
  reportStats
} from '@/mock/reports'
import screenshotService from '@/services/screenshotService'
import reportExportService from '@/services/reportExportService'

// 响应式数据
const activeTab = ref('weekly')
const generating = ref(false)
const generatingProgress = ref(0)
const generatingStatus = ref('')
const showSuccess = ref(false)
const successMessage = ref('')
const showScheduleModal = ref(false)

// 周报相关数据
const weeklyReports = ref<any[]>([])
const weeklySearch = ref('')
const weeklyFilter = ref({
  status: '',
  year: ''
})

// 月报相关数据
const monthlyReports = ref<any[]>([])
const monthlySearch = ref('')
const monthlyFilter = ref({
  status: ''
})

// 会议记录相关数据
const meetingRecords = ref<any[]>([])
const meetingSearch = ref('')
const meetingFilter = ref({
  type: ''
})

// 待办事项相关数据
const todoItems = ref<any[]>([])
const todoSearch = ref('')
const todoFilter = ref({
  status: '',
  priority: ''
})

// 截图相关数据
const screenshots = ref<any[]>([])
const screenshotSearch = ref('')
const screenshotFilter = ref({
  quality: ''
})

// 计算属性
const filteredWeeklyReports = computed(() => {
  let filtered = weeklyReports.value

  if (weeklySearch.value) {
    const query = weeklySearch.value.toLowerCase()
    filtered = filtered.filter(report =>
      report.projectName.toLowerCase().includes(query) ||
      report.customerName.toLowerCase().includes(query) ||
      report.reportWeek.toLowerCase().includes(query)
    )
  }

  if (weeklyFilter.value.status) {
    filtered = filtered.filter(report => report.status === weeklyFilter.value.status)
  }

  if (weeklyFilter.value.year) {
    filtered = filtered.filter(report => report.reportYear.toString() === weeklyFilter.value.year)
  }

  return filtered
})

const filteredMonthlyReports = computed(() => {
  let filtered = monthlyReports.value

  if (monthlySearch.value) {
    const query = monthlySearch.value.toLowerCase()
    filtered = filtered.filter(report =>
      report.projectName.toLowerCase().includes(query) ||
      report.customerName.toLowerCase().includes(query) ||
      report.reportMonth.toLowerCase().includes(query)
    )
  }

  if (monthlyFilter.value.status) {
    filtered = filtered.filter(report => report.status === monthlyFilter.value.status)
  }

  return filtered
})

const filteredMeetingRecords = computed(() => {
  let filtered = meetingRecords.value

  if (meetingSearch.value) {
    const query = meetingSearch.value.toLowerCase()
    filtered = filtered.filter(record =>
      record.meetingTitle.toLowerCase().includes(query) ||
      record.projectName.toLowerCase().includes(query)
    )
  }

  if (meetingFilter.value.type) {
    filtered = filtered.filter(record => record.meetingType === meetingFilter.value.type)
  }

  return filtered
})

const filteredTodoItems = computed(() => {
  let filtered = todoItems.value

  if (todoSearch.value) {
    const query = todoSearch.value.toLowerCase()
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query)
    )
  }

  if (todoFilter.value.status) {
    filtered = filtered.filter(item => item.status === todoFilter.value.status)
  }

  if (todoFilter.value.priority) {
    filtered = filtered.filter(item => item.priority === todoFilter.value.priority)
  }

  return filtered
})

const filteredScreenshots = computed(() => {
  let filtered = screenshots.value

  if (screenshotSearch.value) {
    const query = screenshotSearch.value.toLowerCase()
    filtered = filtered.filter(screenshot =>
      screenshot.projectName.toLowerCase().includes(query) ||
      screenshot.fileName.toLowerCase().includes(query)
    )
  }

  if (screenshotFilter.value.quality) {
    filtered = filtered.filter(screenshot => screenshot.qualityStatus === screenshotFilter.value.quality)
  }

  return filtered
})

// 方法
const getStatusLabel = (status: string): string => {
  const statusMap = {
    draft: '草稿',
    pending: '待审核',
    approved: '已审核',
    sent: '已发送',
    archived: '已归档'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getMeetingTypeLabel = (type: string): string => {
  const typeMap = {
    'project-kickoff': '项目启动',
    'weekly-review': '周度回顾',
    'client-meeting': '客户沟通',
    'problem-discussion': '问题讨论'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

const getPriorityLabel = (priority: string): string => {
  const priorityMap = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return priorityMap[priority as keyof typeof priorityMap] || priority
}

const getTodoStatusLabel = (status: string): string => {
  const statusMap = {
    not_started: '未开始',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getQualityLabel = (quality: string): string => {
  const qualityMap = {
    good: '质量良好',
    poor: '质量较差',
    failed: '截图失败'
  }
  return qualityMap[quality as keyof typeof qualityMap] || quality
}

const getUsageLabel = (usage: string): string => {
  const usageMap = {
    unused: '未使用',
    used: '已使用',
    archived: '已归档'
  }
  return usageMap[usage as keyof typeof usageMap] || usage
}

const getUserName = (userId: string): string => {
  const userMap = {
    'user-1': '张三',
    'user-2': '李四',
    'user-3': '王五',
    'user-4': '赵六'
  }
  return userMap[userId as keyof typeof userMap] || '未知用户'
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

// 周报操作方法
const createWeeklyReport = async () => {
  console.log('创建周报')
  // TODO: 实现周报创建功能
}

const createMonthlyReport = async () => {
  console.log('创建月报')
  // TODO: 实现月报创建功能
}

const viewReport = (report: any) => {
  console.log('查看报告:', report.id)
  // TODO: 实现报告查看功能
}

const editReport = (report: any) => {
  console.log('编辑报告:', report.id)
  // TODO: 实现报告编辑功能
}

const approveReport = async (report: any) => {
  try {
    await mockUpdateReport(report.id, { status: 'approved', approvedAt: new Date().toISOString() })
    await loadWeeklyReports()
    showSuccessMessage('报告审核成功')
  } catch (error) {
    console.error('审核失败:', error)
  }
}

const sendReport = async (report: any) => {
  try {
    await mockUpdateReport(report.id, { status: 'sent', sentAt: new Date().toISOString() })
    await loadWeeklyReports()
    showSuccessMessage('报告发送成功')
  } catch (error) {
    console.error('发送失败:', error)
  }
}

const exportReport = async (report: any) => {
  try {
    generating.value = true
    generatingStatus.value = '正在准备导出...'
    generatingProgress.value = 0

    // 让用户选择导出格式（这里默认使用PDF）
    const format = 'pdf' // 可以改为用户选择

    generatingProgress.value = 30
    generatingStatus.value = '正在生成报告文件...'

    // 根据报告类型选择导出方法
    const isMonthlyReport = report.reportMonth !== undefined
    const result = isMonthlyReport
      ? await reportExportService.exportMonthlyReport(report, format)
      : await reportExportService.exportWeeklyReport(report, format)

    generatingProgress.value = 100
    generatingStatus.value = '导出完成'

    if (result.success) {
      showSuccessMessage(result.message)
    } else {
      console.error('导出失败:', result.message)
    }
  } catch (error) {
    console.error('导出报告失败:', error)
  } finally {
    setTimeout(() => {
      generating.value = false
      generatingProgress.value = 0
    }, 1000)
  }
}

const deleteReport = async (report: any) => {
  if (confirm('确定要删除这个报告吗？')) {
    try {
      await mockDeleteReport(report.id)
      await loadWeeklyReports()
      await loadMonthlyReports()
      showSuccessMessage('报告删除成功')
    } catch (error) {
      console.error('删除失败:', error)
    }
  }
}

// 会议记录操作方法
const createMeetingRecord = () => {
  console.log('创建会议记录')
  // TODO: 实现会议记录创建功能
}

const viewMeetingRecord = (record: any) => {
  console.log('查看会议记录:', record.id)
  // TODO: 实现会议记录查看功能
}

const editMeetingRecord = (record: any) => {
  console.log('编辑会议记录:', record.id)
  // TODO: 实现会议记录编辑功能
}

const publishMeetingRecord = async (record: any) => {
  console.log('发布会议记录:', record.id)
  // TODO: 实现会议记录发布功能
}

const deleteMeetingRecord = (record: any) => {
  if (confirm('确定要删除这个会议记录吗？')) {
    console.log('删除会议记录:', record.id)
    // TODO: 实现会议记录删除功能
  }
}

// 待办事项操作方法
const createTodoItem = () => {
  console.log('创建待办事项')
  // TODO: 实现待办事项创建功能
}

const viewTodoItem = (item: any) => {
  console.log('查看待办事项:', item.id)
  // TODO: 实现待办事项查看功能
}

const editTodoItem = (item: any) => {
  console.log('编辑待办事项:', item.id)
  // TODO: 实现待办事项编辑功能
}

const completeTodoItem = (item: any) => {
  console.log('完成待办事项:', item.id)
  // TODO: 实现待办事项完成功能
}

const deleteTodoItem = (item: any) => {
  if (confirm('确定要删除这个待办事项吗？')) {
    console.log('删除待办事项:', item.id)
    // TODO: 实现待办事项删除功能
  }
}

// 截图操作方法
const manualScreenshot = async () => {
  try {
    generating.value = true
    generatingStatus.value = '正在执行手动截图...'
    generatingProgress.value = 0

    // 模拟选择项目
    const projectId = 'project-1' // 这里应该让用户选择项目

    // 更新进度
    generatingProgress.value = 30
    generatingStatus.value = '正在准备截图任务...'

    const result = await screenshotService.manualScreenshot(projectId)

    generatingProgress.value = 100
    generatingStatus.value = '截图任务完成'

    if (result.success) {
      showSuccessMessage(result.message)
      // 刷新截图列表
      await loadScreenshots()
    } else {
      console.error('手动截图失败:', result.message)
    }
  } catch (error) {
    console.error('手动截图失败:', error)
  } finally {
    setTimeout(() => {
      generating.value = false
      generatingProgress.value = 0
    }, 1000)
  }
}

const viewScreenshot = (screenshot: any) => {
  console.log('查看截图:', screenshot.id)
  // 模拟打开截图查看器
  const imageUrl = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`
  window.open(imageUrl, '_blank')
}

const downloadScreenshot = (screenshot: any) => {
  console.log('下载截图:', screenshot.id)
  // 模拟下载截图文件
  const link = document.createElement('a')
  link.href = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==`
  link.download = screenshot.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  showSuccessMessage('截图下载成功')
}

// 工具方法
const showSuccessMessage = (message: string) => {
  successMessage.value = message
  showSuccess.value = true
  setTimeout(() => {
    showSuccess.value = false
  }, 3000)
}

// 数据加载方法
const loadWeeklyReports = async () => {
  try {
    const response = await mockGetWeeklyReports() as any
    if (response.success) {
      weeklyReports.value = response.data || []
    }
  } catch (error) {
    console.error('加载周报失败:', error)
  }
}

const loadMonthlyReports = async () => {
  try {
    const response = await mockGetMonthlyReports() as any
    if (response.success) {
      monthlyReports.value = response.data || []
    }
  } catch (error) {
    console.error('加载月报失败:', error)
  }
}

const loadMeetingRecords = async () => {
  try {
    const response = await mockGetMeetingRecords() as any
    if (response.success) {
      meetingRecords.value = response.data || []
    }
  } catch (error) {
    console.error('加载会议记录失败:', error)
  }
}

const loadTodoItems = async () => {
  try {
    const response = await mockGetTodoItems() as any
    if (response.success) {
      todoItems.value = response.data || []
    }
  } catch (error) {
    console.error('加载待办事项失败:', error)
  }
}

const loadScreenshots = async () => {
  try {
    const response = await mockGetDashboardScreenshots() as any
    if (response.success) {
      screenshots.value = response.data || []
    }
  } catch (error) {
    console.error('加载截图记录失败:', error)
  }
}

// 生命周期
onMounted(() => {
  loadWeeklyReports()
  loadMonthlyReports()
  loadMeetingRecords()
  loadTodoItems()
  loadScreenshots()
})
</script>

<style scoped>
.reports-view {
  padding: 0;
  position: relative;
}

/* 报告类型切换标签 */
.report-tabs {
  display: flex;
  gap: var(--spacing-xs);
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--spacing-md);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.tab-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.tab-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

/* 节标题和控制 */
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.section-header h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.section-controls {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

.section-search {
  min-width: 250px;
}

.section-filter {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
}

/* 周报表格样式 */
.reports-table-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
}

.reports-table th {
  background: var(--color-background);
  padding: var(--spacing-md);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
}

.reports-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border-light);
  vertical-align: middle;
}

.report-row:hover {
  background: var(--color-background);
}

.report-week {
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
}

.project-name,
.customer-name {
  font-weight: var(--font-weight-medium);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-badge--draft {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.status-badge--pending {
  background: var(--color-info-light);
  color: var(--color-info);
}

.status-badge--approved {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-badge--sent {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.status-badge--archived {
  background: var(--color-text-disabled);
  color: white;
}

.screenshot-yes {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-success);
  font-size: var(--font-size-sm);
}

.screenshot-no {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-error);
  font-size: var(--font-size-sm);
}

.meeting-count,
.todo-count {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.action-buttons {
  display: flex;
  gap: var(--spacing-xs);
}

.action-btn-sm {
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.action-btn-sm:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn-sm--success:hover {
  border-color: var(--color-success);
  color: var(--color-success);
}

.action-btn-sm--primary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn-sm--danger:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

/* 月报网格样式 */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.monthly-report-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--duration-fast);
}

.monthly-report-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.report-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.report-card-title h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.report-card-title p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.report-card-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.report-card-summary p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0;
}

.report-card-actions {
  display: flex;
  gap: var(--spacing-sm);
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border-light);
}

.card-action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.card-action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

/* 会议记录列表样式 */
.meeting-records-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.meeting-record-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--duration-fast);
}

.meeting-record-item:hover {
  box-shadow: var(--shadow-sm);
}

.meeting-record-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
}

.meeting-info h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.meeting-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.meeting-type {
  background: var(--color-primary-light);
  color: var(--color-primary);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
}

.meeting-record-content {
  margin-bottom: var(--spacing-md);
}

.meeting-attendees {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.meeting-summary p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--spacing-sm) 0;
}

.meeting-actions-summary {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.decisions-count,
.actions-count {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.meeting-record-actions {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
}

/* 待办事项列表样式 */
.todo-items-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.todo-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--duration-fast);
}

.todo-item:hover {
  box-shadow: var(--shadow-sm);
}

.todo-item--completed {
  border-color: var(--color-success-light);
  background: var(--color-success-light);
}

.todo-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.priority-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.priority-badge--high {
  background: var(--color-error-light);
  color: var(--color-error);
}

.priority-badge--medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.priority-badge--low {
  background: var(--color-info-light);
  color: var(--color-info);
}

.todo-item-content h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.todo-item-content p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--spacing-md) 0;
}

.todo-meta {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.todo-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.todo-item-actions {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
  margin-top: var(--spacing-md);
}

/* 截图网格样式 */
.screenshot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.screenshot-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  transition: all var(--duration-fast);
}

.screenshot-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.screenshot-preview {
  height: 200px;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
}

.screenshot-placeholder {
  text-align: center;
  color: var(--color-text-disabled);
}

.screenshot-placeholder p {
  margin: var(--spacing-sm) 0 0 0;
  font-size: var(--font-size-sm);
}

.screenshot-info {
  padding: var(--spacing-lg);
}

.screenshot-info h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.screenshot-meta {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
}

.screenshot-status {
  display: flex;
  gap: var(--spacing-sm);
}

.quality-badge,
.usage-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.quality-badge--good {
  background: var(--color-success-light);
  color: var(--color-success);
}

.quality-badge--poor {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.quality-badge--failed {
  background: var(--color-error-light);
  color: var(--color-error);
}

.usage-badge--unused {
  background: var(--color-info-light);
  color: var(--color-info);
}

.usage-badge--used {
  background: var(--color-success-light);
  color: var(--color-success);
}

.usage-badge--archived {
  background: var(--color-text-disabled);
  color: white;
}

.screenshot-actions {
  padding: var(--spacing-md) var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  gap: var(--spacing-sm);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.page-header__main {
  flex: 1;
  min-width: 300px;
}

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.page-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

.page-header__actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
  text-decoration: none;
}

.action-btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.action-btn--primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.action-btn--secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.action-btn--secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.reports-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.report-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  padding-bottom: var(--spacing-sm);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm) var(--border-radius-sm) 0 0;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.tab-btn--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.tab-btn:hover:not(.tab-btn--active) {
  border-color: var(--color-border);
  color: var(--color-text-primary);
}

.weekly-reports-section,
.monthly-reports-section,
.meeting-records-section,
.todo-items-section,
.screenshot-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.section-controls {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.section-search {
  min-width: 250px;
}

.section-filter {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.reports-table-container {
  overflow-x: auto;
}

.reports-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--font-size-sm);
}

.reports-table th,
.reports-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.reports-table th {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  background: var(--color-background);
}

.report-row:last-child td {
  border-bottom: none;
}

.report-week {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.project-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.customer-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.report-status .status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.report-status .status-badge--draft {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.report-status .status-badge--pending {
  background: var(--color-info-light);
  color: var(--color-info);
}

.report-status .status-badge--approved {
  background: var(--color-success-light);
  color: var(--color-success);
}

.report-status .status-badge--sent {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.report-status .status-badge--archived {
  background: var(--color-disabled-light);
  color: var(--color-disabled);
}

.screenshot-status .screenshot-yes {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-success-light);
  color: var(--color-success);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.screenshot-status .screenshot-no {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-error-light);
  color: var(--color-error);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.meeting-count,
.todo-count {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.monthly-report-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: all var(--duration-fast);
}

.monthly-report-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.report-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.report-card-title h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.report-card-title p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin: 0;
}

.report-card-status .status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.report-card-status .status-badge--draft {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.report-card-status .status-badge--pending {
  background: var(--color-info-light);
  color: var(--color-info);
}

.report-card-status .status-badge--approved {
  background: var(--color-success-light);
  color: var(--color-success);
}

.report-card-status .status-badge--sent {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.report-card-status .status-badge--archived {
  background: var(--color-disabled-light);
  color: var(--color-disabled);
}

.report-card-content {
  flex: 1;
}

.report-card-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.report-card-summary p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--spacing-md) 0;
}

.report-card-actions {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
}

.card-action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  background: var(--color-surface);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.card-action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.card-action-btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.card-action-btn--primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.card-action-btn--success {
  background: var(--color-success);
  border-color: var(--color-success);
  color: white;
}

.card-action-btn--success:hover {
  background: var(--color-success-hover);
  border-color: var(--color-success-hover);
}

.card-action-btn--danger {
  background: var(--color-error);
  border-color: var(--color-error);
  color: white;
}

.card-action-btn--danger:hover {
  background: var(--color-error-hover);
  border-color: var(--color-error-hover);
}

.meeting-records-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.meeting-record-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  transition: all var(--duration-fast);
}

.meeting-record-item:hover {
  background: var(--color-background);
  border-color: var(--color-border);
}

.meeting-record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.meeting-info h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.meeting-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.meeting-status .status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.meeting-status .status-badge--draft {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.meeting-status .status-badge--published {
  background: var(--color-success-light);
  color: var(--color-success);
}

.meeting-record-content {
  flex: 1;
}

.meeting-attendees {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.meeting-summary p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--spacing-md) 0;
}

.meeting-actions-summary {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.decisions-count,
.actions-count {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.meeting-record-actions {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
}

.todo-items-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.todo-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  transition: all var(--duration-fast);
}

.todo-item:hover {
  background: var(--color-background);
  border-color: var(--color-border);
}

.todo-item--not_started {
  border-left: 4px solid var(--color-warning);
}

.todo-item--in_progress {
  border-left: 4px solid var(--color-info);
}

.todo-item--completed {
  border-left: 4px solid var(--color-success);
}

.todo-item--cancelled {
  border-left: 4px solid var(--color-error);
}

.todo-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.todo-priority .priority-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.todo-priority .priority-badge--high {
  background: var(--color-error-light);
  color: var(--color-error);
}

.todo-priority .priority-badge--medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.todo-priority .priority-badge--low {
  background: var(--color-info-light);
  color: var(--color-info);
}

.todo-status .status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.todo-status .status-badge--not_started {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.todo-status .status-badge--in_progress {
  background: var(--color-info-light);
  color: var(--color-info);
}

.todo-status .status-badge--completed {
  background: var(--color-success-light);
  color: var(--color-success);
}

.todo-status .status-badge--cancelled {
  background: var(--color-error-light);
  color: var(--color-error);
}

.todo-item-content h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.todo-item-content p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--spacing-md) 0;
}

.todo-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-sm);
}

.todo-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--color-background);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--border-radius-sm);
  transition: width var(--duration-normal);
}

.progress-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  min-width: 40px;
}

.todo-item-actions {
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
}

.screenshot-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
}

.screenshot-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.screenshot-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
  transition: all var(--duration-fast);
}

.screenshot-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.screenshot-preview {
  width: 100%;
  height: 200px;
  background: var(--color-background);
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-md);
}

.screenshot-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
}

.screenshot-placeholder p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.screenshot-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-sm);
}

.screenshot-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.screenshot-status {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.quality-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.quality-badge--good {
  background: var(--color-success-light);
  color: var(--color-success);
}

.quality-badge--poor {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.quality-badge--failed {
  background: var(--color-error-light);
  color: var(--color-error);
}

.usage-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.usage-badge--unused {
  background: var(--color-disabled-light);
  color: var(--color-disabled);
}

.usage-badge--used {
  background: var(--color-info-light);
  color: var(--color-info);
}

.usage-badge--archived {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.stats-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-lg);
}

.stat-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  transition: all var(--duration-fast);
}

.stat-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.stat-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.generating-overlay {
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

.generating-content {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-2xl);
  text-align: center;
  min-width: 300px;
  box-shadow: var(--shadow-xl);
}

.generating-spinner {
  animation: spin 1s linear infinite;
  color: var(--color-primary);
  margin-bottom: var(--spacing-lg);
}

.generating-content h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.generating-content p {
  font-size: var(--font-size-md);
  color: var(--color-text-secondary);
  margin: 0 0 var(--spacing-lg) 0;
}

.generating-progress {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.progress-bar {
  flex: 1;
  height: 8px;
  background: var(--color-background);
  border-radius: var(--border-radius-sm);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--border-radius-sm);
  transition: width var(--duration-normal);
}

.progress-text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  min-width: 40px;
}

.success-notification {
  position: fixed;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  background: var(--color-success);
  color: white;
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1001;
  animation: slideIn 0.3s ease-out;
}

.success-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
}

.success-close {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--duration-fast);
}

.success-close:hover {
  background: rgba(255, 255, 255, 0.2);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .reports-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-lg);
  }

  .page-header__main {
    min-width: auto;
  }

  .page-header__actions {
    justify-content: stretch;
  }

  .action-btn {
    flex: 1;
    justify-content: center;
  }

  .report-tabs {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .tab-btn {
    width: 100%;
    justify-content: center;
  }

  .reports-table {
    font-size: var(--font-size-xs);
  }

  .reports-table th,
  .reports-table td {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .report-row td:last-child {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .report-row td:last-child .action-buttons {
    width: 100%;
    justify-content: flex-start;
  }

  .report-row td:last-child .action-btn-sm {
    width: 100%;
    justify-content: center;
  }

  .report-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .report-card-title {
    text-align: center;
  }

  .report-card-title h3 {
    font-size: var(--font-size-md);
  }

  .report-card-title p {
    font-size: var(--font-size-sm);
  }

  .report-card-status {
    align-self: flex-start;
  }

  .section-controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .section-search {
    min-width: auto;
  }

  .section-filter {
    width: 100%;
  }

  .meeting-record-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .meeting-info {
    width: 100%;
    text-align: center;
  }

  .meeting-meta {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .meeting-record-content {
    text-align: left;
  }

  .meeting-attendees {
    justify-content: center;
  }

  .meeting-summary p {
    text-align: left;
  }

  .meeting-actions-summary {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .decisions-count,
  .actions-count {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .todo-item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .todo-priority {
    align-self: flex-start;
  }

  .todo-status {
    align-self: flex-start;
  }

  .todo-item-content {
    text-align: left;
  }

  .todo-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .todo-progress {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .todo-item-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .screenshot-card {
    padding: var(--spacing-md);
  }

  .screenshot-preview {
    height: 150px;
  }

  .screenshot-placeholder {
    font-size: var(--font-size-xs);
  }

  .screenshot-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .screenshot-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .screenshot-status {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .quality-badge,
  .usage-badge {
    width: 100%;
    text-align: center;
  }
}

@media (max-width: 480px) {
  .page-title {
    font-size: var(--font-size-2xl);
  }

  .page-header__actions {
    flex-direction: column;
  }

  .action-btn {
    width: 100%;
    justify-content: center;
  }

  .report-tabs {
    flex-direction: column;
    gap: var(--spacing-sm);
  }

  .tab-btn {
    width: 100%;
    justify-content: center;
  }

  .reports-table {
    font-size: var(--font-size-xs);
  }

  .reports-table th,
  .reports-table td {
    padding: var(--spacing-xs) var(--spacing-sm);
  }

  .report-row td:last-child {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .report-row td:last-child .action-buttons {
    width: 100%;
    justify-content: flex-start;
  }

  .report-row td:last-child .action-btn-sm {
    width: 100%;
    justify-content: center;
  }

  .report-card-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .report-card-title {
    text-align: center;
  }

  .report-card-title h3 {
    font-size: var(--font-size-md);
  }

  .report-card-title p {
    font-size: var(--font-size-sm);
  }

  .report-card-status {
    align-self: flex-start;
  }

  .section-controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }

  .section-search {
    min-width: auto;
  }

  .section-filter {
    width: 100%;
  }

  .meeting-record-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .meeting-info {
    width: 100%;
    text-align: center;
  }

  .meeting-meta {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .meeting-record-content {
    text-align: left;
  }

  .meeting-attendees {
    justify-content: center;
  }

  .meeting-summary p {
    text-align: left;
  }

  .meeting-actions-summary {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-sm);
  }

  .decisions-count,
  .actions-count {
    flex-direction: column;
    align-items: center;
    gap: var(--spacing-xs);
  }

  .todo-item-header {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .todo-priority {
    align-self: flex-start;
  }

  .todo-status {
    align-self: flex-start;
  }

  .todo-item-content {
    text-align: left;
  }

  .todo-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .todo-progress {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .todo-item-actions {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .screenshot-card {
    padding: var(--spacing-sm);
  }

  .screenshot-preview {
    height: 120px;
  }

  .screenshot-placeholder {
    font-size: var(--font-size-xs);
  }

  .screenshot-info {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .screenshot-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .screenshot-status {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-xs);
  }

  .quality-badge,
  .usage-badge {
    width: 100%;
    text-align: center;
  }
}
</style>
