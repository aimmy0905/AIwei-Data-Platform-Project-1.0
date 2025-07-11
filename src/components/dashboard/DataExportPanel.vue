<template>
  <div class="data-export-panel">
    <div class="export-header">
      <h3>数据导出</h3>
      <p class="export-description">选择需要导出的数据类型和格式</p>
    </div>

    <div class="export-options">
      <!-- 导出数据类型选择 -->
      <div class="export-section">
        <h4>选择导出数据</h4>
        <div class="data-type-options">
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="exportOptions.websiteData"
            />
            <span>网站数据</span>
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="exportOptions.channelData"
            />
            <span>渠道数据</span>
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="exportOptions.adData"
            />
            <span>广告数据</span>
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="exportOptions.productData"
            />
            <span>产品销售数据</span>
          </label>
          <label class="checkbox-item">
            <input
              type="checkbox"
              v-model="exportOptions.campaignData"
            />
            <span>活动数据</span>
          </label>
        </div>
      </div>

      <!-- 导出格式选择 -->
      <div class="export-section">
        <h4>选择导出格式</h4>
        <div class="format-options">
          <label class="radio-item">
            <input
              type="radio"
              name="format"
              value="excel"
              v-model="exportFormat"
            />
            <span>Excel (.xlsx)</span>
          </label>
          <label class="radio-item">
            <input
              type="radio"
              name="format"
              value="pdf"
              v-model="exportFormat"
            />
            <span>PDF (.pdf)</span>
          </label>
        </div>
      </div>

      <!-- 时间范围选择 -->
      <div class="export-section">
        <h4>选择时间范围</h4>
        <div class="date-range">
          <div class="date-input">
            <label>开始日期:</label>
            <input
              type="date"
              v-model="dateRange.start"
              class="date-picker"
            />
          </div>
          <div class="date-input">
            <label>结束日期:</label>
            <input
              type="date"
              v-model="dateRange.end"
              class="date-picker"
            />
          </div>
        </div>
      </div>

      <!-- 导出选项 -->
      <div class="export-section">
        <h4>导出选项</h4>
        <div class="export-scope">
          <label class="radio-item">
            <input
              type="radio"
              name="scope"
              value="all"
              v-model="exportScope"
            />
            <span>导出全部数据</span>
          </label>
          <label class="radio-item">
            <input
              type="radio"
              name="scope"
              value="current"
              v-model="exportScope"
            />
            <span>导出当前视图数据</span>
          </label>
          <label class="radio-item">
            <input
              type="radio"
              name="scope"
              value="custom"
              v-model="exportScope"
            />
            <span>导出自定义选择数据</span>
          </label>
        </div>
      </div>
    </div>

    <!-- 导出按钮 -->
    <div class="export-actions">
      <button
        class="export-btn primary"
        @click="handleExport"
        :disabled="!canExport || isExporting"
      >
        <span v-if="isExporting">导出中...</span>
        <span v-else>开始导出</span>
      </button>
      <button
        class="export-btn secondary"
        @click="resetOptions"
      >
        重置选项
      </button>
    </div>

    <!-- 导出历史 -->
    <div class="export-history" v-if="exportHistory.length > 0">
      <h4>最近导出记录</h4>
      <div class="history-list">
        <div
          v-for="record in exportHistory"
          :key="record.id"
          class="history-item"
        >
          <div class="history-info">
            <span class="history-name">{{ record.name }}</span>
            <span class="history-date">{{ formatDate(record.date) }}</span>
          </div>
          <div class="history-actions">
            <button
              class="download-btn"
              @click="downloadFile(record)"
              v-if="record.status === 'completed'"
            >
              下载
            </button>
            <span
              class="status-badge"
              :class="record.status"
            >
              {{ getStatusText(record.status) }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

// 导出选项
const exportOptions = ref({
  websiteData: true,
  channelData: false,
  adData: false,
  productData: false,
  campaignData: false
})

// 导出格式
const exportFormat = ref('excel')

// 导出范围
const exportScope = ref('current')

// 日期范围
const dateRange = ref({
  start: '',
  end: ''
})

// 导出状态
const isExporting = ref(false)

// 导出历史
const exportHistory = ref([
  {
    id: 1,
    name: '网站数据_2024-01-15',
    date: new Date('2024-01-15'),
    status: 'completed',
    format: 'excel'
  },
  {
    id: 2,
    name: '广告数据_2024-01-10',
    date: new Date('2024-01-10'),
    status: 'completed',
    format: 'pdf'
  }
])

// 计算是否可以导出
const canExport = computed(() => {
  const hasSelectedData = Object.values(exportOptions.value).some(value => value)
  const hasFormat = exportFormat.value !== ''
  const hasValidDateRange = dateRange.value.start && dateRange.value.end

  return hasSelectedData && hasFormat && hasValidDateRange
})

// 初始化日期范围
onMounted(() => {
  const today = new Date()
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  dateRange.value.end = today.toISOString().split('T')[0]
  dateRange.value.start = lastWeek.toISOString().split('T')[0]
})

// 处理导出
const handleExport = async () => {
  if (!canExport.value) return

  isExporting.value = true

  try {
    // 构建导出参数
    const exportParams = {
      dataTypes: Object.keys(exportOptions.value).filter(key => exportOptions.value[key as keyof typeof exportOptions.value]),
      format: exportFormat.value,
      scope: exportScope.value,
      dateRange: dateRange.value
    }

    // 模拟导出过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 添加到导出历史
    const newRecord = {
      id: Date.now(),
      name: `数据导出_${new Date().toISOString().split('T')[0]}`,
      date: new Date(),
      status: 'completed',
      format: exportFormat.value
    }

    exportHistory.value.unshift(newRecord)

    // 这里应该调用实际的导出 API
    console.log('导出参数:', exportParams)

    // 模拟文件下载
    const blob = new Blob(['导出的数据内容'], { type: 'application/octet-stream' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `export_${Date.now()}.${exportFormat.value === 'excel' ? 'xlsx' : 'pdf'}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

  } catch (error) {
    console.error('导出失败:', error)
    alert('导出失败，请重试')
  } finally {
    isExporting.value = false
  }
}

// 重置选项
const resetOptions = () => {
  exportOptions.value = {
    websiteData: true,
    channelData: false,
    adData: false,
    productData: false,
    campaignData: false
  }
  exportFormat.value = 'excel'
  exportScope.value = 'current'

  const today = new Date()
  const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)

  dateRange.value.end = today.toISOString().split('T')[0]
  dateRange.value.start = lastWeek.toISOString().split('T')[0]
}

// 格式化日期
const formatDate = (date: Date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 获取状态文本
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'completed': '已完成',
    'processing': '处理中',
    'failed': '失败'
  }
  return statusMap[status] || status
}

// 下载文件
const downloadFile = (record: any) => {
  // 这里应该调用实际的文件下载 API
  console.log('下载文件:', record)
  alert(`下载文件: ${record.name}`)
}
</script>

<style scoped>
.data-export-panel {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.export-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.export-header h3 {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.export-description {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.export-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.data-type-options,
.format-options,
.export-scope {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.checkbox-item,
.radio-item {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.checkbox-item:hover,
.radio-item:hover {
  background-color: #f9fafb;
}

.checkbox-item input,
.radio-item input {
  margin: 0;
}

.date-range {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.date-input {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.date-input label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.date-picker {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 14px;
}

.date-picker:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.export-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.export-btn {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.export-btn.primary {
  background-color: #3b82f6;
  color: white;
}

.export-btn.primary:hover:not(:disabled) {
  background-color: #2563eb;
}

.export-btn.primary:disabled {
  background-color: #9ca3af;
  cursor: not-allowed;
}

.export-btn.secondary {
  background-color: white;
  color: #374151;
  border-color: #d1d5db;
}

.export-btn.secondary:hover {
  background-color: #f9fafb;
}

.export-history {
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.export-history h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 500;
  color: #374151;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background-color: #f9fafb;
  border-radius: 6px;
}

.history-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.history-name {
  font-weight: 500;
  color: #1f2937;
}

.history-date {
  font-size: 12px;
  color: #6b7280;
}

.history-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.download-btn {
  padding: 4px 12px;
  background-color: #3b82f6;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.download-btn:hover {
  background-color: #2563eb;
}

.status-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.completed {
  background-color: #dcfce7;
  color: #16a34a;
}

.status-badge.processing {
  background-color: #fef3c7;
  color: #d97706;
}

.status-badge.failed {
  background-color: #fee2e2;
  color: #dc2626;
}

@media (max-width: 768px) {
  .data-export-panel {
    padding: 16px;
  }

  .date-range {
    flex-direction: column;
  }

  .export-actions {
    flex-direction: column;
  }

  .history-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .history-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
