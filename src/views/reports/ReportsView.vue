<template>
  <div class="reports-view">
    <div class="page-header">
      <div class="page-header__main">
        <h1 class="page-title">报告中心</h1>
        <p class="page-description">生成和下载各类数据分析报告</p>
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
          @click="showCustomReportModal = true"
        >
          <Plus :size="16" />
          自定义报告
        </button>
      </div>
    </div>

    <div class="reports-content">
      <!-- 快速报告生成 -->
      <div class="quick-reports-section">
        <h2>快速报告</h2>
        <div class="quick-reports-grid">
          <div 
            v-for="template in reportTemplates"
            :key="template.id"
            class="report-template-card"
            @click="generateQuickReport(template)"
          >
            <div class="template-header">
              <div class="template-icon">
                <component :is="getTemplateIcon(template.type)" :size="24" />
              </div>
              <div class="template-actions">
                <button 
                  class="template-action"
                  @click.stop="previewTemplate(template)"
                  title="预览"
                >
                  <Eye :size="16" />
                </button>
                <button 
                  class="template-action"
                  @click.stop="customizeTemplate(template)"
                  title="自定义"
                >
                  <Settings :size="16" />
                </button>
              </div>
            </div>
            <div class="template-content">
              <h3>{{ template.name }}</h3>
              <p>{{ template.description }}</p>
              <div class="template-meta">
                <span class="template-type">{{ getTypeLabel(template.type) }}</span>
                <span class="template-sections">{{ template.sections.length }} 个章节</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 历史报告 -->
      <div class="history-section">
        <div class="section-header">
          <h2>历史报告</h2>
          <div class="history-controls">
            <SearchInput
              v-model="historySearch"
              placeholder="搜索历史报告..."
              :suggestions="[]"
              class="history-search"
            />
            <select v-model="historyFilter" class="history-filter">
              <option value="">全部类型</option>
              <option value="dashboard">数据看板</option>
              <option value="customer">客户分析</option>
              <option value="channel">渠道效果</option>
              <option value="financial">财务汇总</option>
            </select>
          </div>
        </div>

        <div class="history-list">
          <div 
            v-for="report in filteredHistoryReports"
            :key="report.id"
            class="history-item"
          >
            <div class="history-item__icon">
              <FileText :size="20" />
            </div>
            <div class="history-item__content">
              <div class="history-title">{{ report.title }}</div>
              <div class="history-meta">
                <span class="history-type">{{ getTypeLabel(report.type) }}</span>
                <span class="history-date">{{ formatDate(report.generatedAt) }}</span>
                <span class="history-size">{{ report.fileSize }}</span>
              </div>
            </div>
            <div class="history-item__actions">
              <button 
                class="history-action"
                @click="downloadReport(report)"
                title="下载"
              >
                <Download :size="16" />
              </button>
              <button 
                class="history-action"
                @click="shareReport(report)"
                title="分享"
              >
                <Share2 :size="16" />
              </button>
              <button 
                class="history-action"
                @click="regenerateReport(report)"
                title="重新生成"
              >
                <RefreshCw :size="16" />
              </button>
              <button 
                class="history-action history-action--danger"
                @click="deleteReport(report)"
                title="删除"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>

        <div class="pagination-section">
          <div class="pagination-info">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredHistoryReports.length) }} 条，
            共 {{ filteredHistoryReports.length }} 条记录
          </div>
          <div class="pagination-controls">
            <button 
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              <ChevronLeft :size="16" />
              上一页
            </button>
            <div class="pagination-numbers">
              <button
                v-for="page in visiblePages"
                :key="page"
                class="pagination-number"
                :class="{ 'pagination-number--active': page === currentPage }"
                @click="currentPage = page"
              >
                {{ page }}
              </button>
            </div>
            <button 
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              下一页
              <ChevronRight :size="16" />
            </button>
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
              <div class="stat-label">最常用模板</div>
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
        <span>报告生成成功！</span>
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
  DollarSign, Target
} from 'lucide-vue-next'
import SearchInput from '@/components/common/SearchInput.vue'
import { 
  reportTemplates, 
  generateReport, 
  exportReportToPDF,
  type ReportTemplate,
  type ReportData 
} from '@/utils/reports'
import { mockGetCustomers, mockGetChannels, mockCampaigns, mockAlerts } from '@/mock'

// 响应式数据
const generating = ref(false)
const generatingProgress = ref(0)
const generatingStatus = ref('')
const showSuccess = ref(false)
const showScheduleModal = ref(false)
const showCustomReportModal = ref(false)
const historySearch = ref('')
const historyFilter = ref('')
const currentPage = ref(1)
const pageSize = ref(10)

// 模拟历史报告数据
const historyReports = ref([
  {
    id: '1',
    title: '2025年1月数据看板概览报告',
    type: 'dashboard',
    generatedAt: '2025-01-07 14:30:00',
    fileSize: '2.3 MB',
    template: 'dashboard-overview'
  },
  {
    id: '2',
    title: '客户分析详细报告',
    type: 'customer',
    generatedAt: '2025-01-06 10:15:00',
    fileSize: '1.8 MB',
    template: 'customer-analysis'
  },
  {
    id: '3',
    title: '渠道效果对比报告',
    type: 'channel',
    generatedAt: '2025-01-05 16:45:00',
    fileSize: '1.2 MB',
    template: 'channel-performance'
  },
  {
    id: '4',
    title: '财务汇总月度报告',
    type: 'financial',
    generatedAt: '2025-01-04 09:20:00',
    fileSize: '900 KB',
    template: 'financial-summary'
  }
])

const reportStats = ref({
  totalReports: 24,
  thisMonth: 8,
  downloads: 156,
  mostUsed: '数据看板'
})

// 计算属性
const filteredHistoryReports = computed(() => {
  let filtered = historyReports.value

  if (historySearch.value) {
    const query = historySearch.value.toLowerCase()
    filtered = filtered.filter(report => 
      report.title.toLowerCase().includes(query)
    )
  }

  if (historyFilter.value) {
    filtered = filtered.filter(report => report.type === historyFilter.value)
  }

  return filtered
})

const totalPages = computed(() => {
  return Math.ceil(filteredHistoryReports.value.length / pageSize.value)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

// 方法
const getTemplateIcon = (type: string) => {
  const iconMap = {
    dashboard: BarChart3,
    customer: Users,
    channel: Target,
    financial: DollarSign
  }
  return iconMap[type as keyof typeof iconMap] || FileText
}

const getTypeLabel = (type: string): string => {
  const typeMap = {
    dashboard: '数据看板',
    customer: '客户分析',
    channel: '渠道效果',
    financial: '财务汇总'
  }
  return typeMap[type as keyof typeof typeMap] || type
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const generateQuickReport = async (template: ReportTemplate) => {
  if (generating.value) return

  generating.value = true
  generatingProgress.value = 0
  generatingStatus.value = '正在收集数据...'

  try {
    // 模拟进度更新
    const progressSteps = [
      { progress: 20, status: '正在收集数据...' },
      { progress: 40, status: '正在分析数据...' },
      { progress: 60, status: '正在生成图表...' },
      { progress: 80, status: '正在构建报告...' },
      { progress: 100, status: '报告生成完成！' }
    ]

    for (const step of progressSteps) {
      await new Promise(resolve => setTimeout(resolve, 800))
      generatingProgress.value = step.progress
      generatingStatus.value = step.status
    }

    // 获取数据
    const [customersRes, channelsRes] = await Promise.all([
      mockGetCustomers(),
      mockGetChannels()
    ])

    const reportData: ReportData = {
      customers: customersRes.success ? customersRes.data || [] : [],
      channels: channelsRes.success ? channelsRes.data || [] : [],
      campaigns: mockCampaigns,
      alerts: mockAlerts,
      dateRange: {
        start: '2025-01-01',
        end: '2025-01-07'
      },
      filters: {}
    }

    // 生成报告
    const report = await generateReport(template.id, reportData, {
      title: `${template.name} - ${new Date().toLocaleDateString('zh-CN')}`,
      includeCharts: true,
      includeRawData: false
    })

    // 导出PDF
    await exportReportToPDF(report, `${template.id}_${Date.now()}`)

    // 添加到历史记录
    historyReports.value.unshift({
      id: Date.now().toString(),
      title: report.title,
      type: template.type,
      generatedAt: new Date().toLocaleString('zh-CN'),
      fileSize: '1.5 MB',
      template: template.id
    })

    showSuccess.value = true
    setTimeout(() => {
      showSuccess.value = false
    }, 3000)

  } catch (error) {
    console.error('报告生成失败:', error)
  } finally {
    generating.value = false
    generatingProgress.value = 0
  }
}

const previewTemplate = (template: ReportTemplate) => {
  console.log('预览模板:', template.name)
}

const customizeTemplate = (template: ReportTemplate) => {
  console.log('自定义模板:', template.name)
}

const downloadReport = (report: typeof historyReports.value[0]) => {
  console.log('下载报告:', report.title)
}

const shareReport = (report: typeof historyReports.value[0]) => {
  console.log('分享报告:', report.title)
}

const regenerateReport = (report: typeof historyReports.value[0]) => {
  console.log('重新生成报告:', report.title)
}

const deleteReport = (report: typeof historyReports.value[0]) => {
  const index = historyReports.value.findIndex(r => r.id === report.id)
  if (index > -1) {
    historyReports.value.splice(index, 1)
  }
}

// 生命周期
onMounted(() => {
  // 初始化数据
})
</script>

<style scoped>
.reports-view {
  padding: 0;
  position: relative;
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

.quick-reports-section h2,
.history-section h2,
.stats-section h2 {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-lg) 0;
}

.quick-reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.report-template-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.report-template-card:hover {
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
  border-color: var(--color-primary-light);
}

.template-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.template-icon {
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-md);
  background: var(--color-primary-light);
  color: var(--color-primary);
  display: flex;
  align-items: center;
  justify-content: center;
}

.template-actions {
  display: flex;
  gap: var(--spacing-xs);
}

.template-action {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.template-action:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.template-content h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.template-content p {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-normal);
  margin: 0 0 var(--spacing-md) 0;
}

.template-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-disabled);
}

.history-section {
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

.history-controls {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
}

.history-search {
  min-width: 250px;
}

.history-filter {
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.history-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border-light);
  border-radius: var(--border-radius-md);
  transition: all var(--duration-fast);
}

.history-item:hover {
  background: var(--color-background);
  border-color: var(--color-border);
}

.history-item__icon {
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-md);
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.history-item__content {
  flex: 1;
  min-width: 0;
}

.history-title {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.history-meta {
  display: flex;
  gap: var(--spacing-md);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.history-item__actions {
  display: flex;
  gap: var(--spacing-xs);
}

.history-action {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.history-action:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.history-action--danger:hover {
  border-color: var(--color-error);
  color: var(--color-error);
}

.pagination-section {
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.pagination-info {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.pagination-btn {
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

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-btn:disabled {
  color: var(--color-text-disabled);
  cursor: not-allowed;
}

.pagination-numbers {
  display: flex;
  gap: var(--spacing-xs);
}

.pagination-number {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.pagination-number:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-number--active {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
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
  .quick-reports-grid {
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
  
  .quick-reports-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .report-template-card {
    padding: var(--spacing-md);
  }
  
  .template-header {
    margin-bottom: var(--spacing-sm);
  }
  
  .template-content h3 {
    font-size: var(--font-size-md);
  }
  
  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }
  
  .history-controls {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-sm);
  }
  
  .history-search {
    min-width: auto;
  }
  
  .history-item {
    flex-direction: column;
    align-items: stretch;
    text-align: left;
    gap: var(--spacing-sm);
    padding: var(--spacing-sm);
  }
  
  .history-item__icon {
    align-self: flex-start;
  }
  
  .history-item__content {
    order: 1;
  }
  
  .history-item__actions {
    order: 2;
    justify-content: flex-start;
    gap: var(--spacing-xs);
  }
  
  .history-action {
    width: 36px;
    height: 36px;
  }
  
  .pagination-section {
    flex-direction: column;
    align-items: stretch;
    text-align: center;
    gap: var(--spacing-sm);
  }
  
  .pagination-controls {
    justify-content: center;
    flex-wrap: wrap;
  }
  
  .pagination-numbers {
    order: 2;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .pagination-btn {
    min-width: 80px;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--spacing-md);
  }
  
  .stat-card {
    padding: var(--spacing-md);
  }
  
  .generating-content {
    min-width: 280px;
    padding: var(--spacing-lg);
    margin: var(--spacing-md);
  }
  
  .generating-progress {
    flex-direction: column;
    gap: var(--spacing-sm);
  }
  
  .progress-text {
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
  
  .quick-reports-section,
  .history-section,
  .stats-section {
    margin-bottom: var(--spacing-lg);
  }
  
  .report-template-card {
    padding: var(--spacing-sm);
  }
  
  .template-actions {
    gap: var(--spacing-xs);
  }
  
  .template-action {
    width: 28px;
    height: 28px;
  }
  
  .history-section {
    padding: var(--spacing-md);
  }
  
  .history-item {
    padding: var(--spacing-xs);
  }
  
  .history-action {
    width: 32px;
    height: 32px;
  }
  
  .stat-card {
    flex-direction: column;
    text-align: center;
    gap: var(--spacing-sm);
  }
  
  .stat-icon {
    align-self: center;
  }
}
</style>