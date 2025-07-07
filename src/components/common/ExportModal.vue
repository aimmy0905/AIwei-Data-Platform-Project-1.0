<template>
  <div v-if="visible" class="export-modal-overlay" @click="handleOverlayClick">
    <div class="export-modal" @click.stop>
      <div class="export-modal__header">
        <h3>导出数据</h3>
        <button class="close-btn" @click="$emit('close')" title="关闭">
          <X :size="20" />
        </button>
      </div>

      <div class="export-modal__content">
        <!-- 导出格式选择 -->
        <div class="export-section">
          <h4>选择导出格式</h4>
          <div class="format-options">
            <label 
              v-for="format in formatOptions"
              :key="format.value"
              class="format-option"
              :class="{ 'format-option--selected': selectedFormat === format.value }"
            >
              <input 
                v-model="selectedFormat"
                type="radio"
                :value="format.value"
                class="format-radio"
              />
              <div class="format-content">
                <component :is="format.icon" :size="24" class="format-icon" />
                <div class="format-info">
                  <div class="format-name">{{ format.label }}</div>
                  <div class="format-desc">{{ format.description }}</div>
                </div>
              </div>
            </label>
          </div>
        </div>

        <!-- 导出范围选择 -->
        <div class="export-section">
          <h4>选择导出范围</h4>
          <div class="range-options">
            <label class="range-option">
              <input 
                v-model="exportRange"
                type="radio"
                value="all"
                class="range-radio"
              />
              <div class="range-content">
                <div class="range-title">全部数据</div>
                <div class="range-desc">导出所有 {{ totalCount }} 条记录</div>
              </div>
            </label>
            <label class="range-option">
              <input 
                v-model="exportRange"
                type="radio"
                value="filtered"
                class="range-radio"
              />
              <div class="range-content">
                <div class="range-title">当前筛选结果</div>
                <div class="range-desc">导出当前筛选的 {{ filteredCount }} 条记录</div>
              </div>
            </label>
            <label 
              v-if="selectedCount > 0"
              class="range-option"
            >
              <input 
                v-model="exportRange"
                type="radio"
                value="selected"
                class="range-radio"
              />
              <div class="range-content">
                <div class="range-title">选中的数据</div>
                <div class="range-desc">导出已选中的 {{ selectedCount }} 条记录</div>
              </div>
            </label>
          </div>
        </div>

        <!-- 列选择 -->
        <div class="export-section">
          <h4>选择导出列</h4>
          <div class="column-selection">
            <div class="column-actions">
              <button @click="selectAllColumns" class="column-action-btn">全选</button>
              <button @click="deselectAllColumns" class="column-action-btn">全不选</button>
              <button @click="resetColumnSelection" class="column-action-btn">重置</button>
            </div>
            <div class="column-list">
              <label 
                v-for="column in availableColumns"
                :key="column.key"
                class="column-option"
              >
                <input 
                  v-model="selectedColumns"
                  type="checkbox"
                  :value="column.key"
                  class="column-checkbox"
                />
                <span class="column-label">{{ column.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 导出选项 -->
        <div class="export-section">
          <h4>导出选项</h4>
          <div class="export-options">
            <label class="option-row">
              <input 
                v-model="includeHeaders"
                type="checkbox"
                class="option-checkbox"
              />
              <span>包含表头</span>
            </label>
            <label class="option-row">
              <input 
                v-model="includeStats"
                type="checkbox"
                class="option-checkbox"
                :disabled="selectedFormat === 'csv' || selectedFormat === 'excel'"
              />
              <span>包含统计信息 (仅PDF/HTML)</span>
            </label>
            <div class="option-row">
              <label for="filename">文件名:</label>
              <input 
                id="filename"
                v-model="filename"
                type="text"
                class="filename-input"
                placeholder="请输入文件名"
              />
            </div>
            <div v-if="selectedFormat === 'pdf'" class="option-row">
              <label for="report-title">报告标题:</label>
              <input 
                id="report-title"
                v-model="reportTitle"
                type="text"
                class="title-input"
                placeholder="请输入报告标题"
              />
            </div>
            <div v-if="selectedFormat === 'pdf'" class="option-row">
              <label for="report-description">报告描述:</label>
              <textarea 
                id="report-description"
                v-model="reportDescription"
                class="description-textarea"
                placeholder="请输入报告描述"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 预览信息 -->
        <div class="export-preview">
          <div class="preview-info">
            <div class="preview-item">
              <span class="preview-label">导出格式:</span>
              <span class="preview-value">{{ getFormatLabel() }}</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">记录数量:</span>
              <span class="preview-value">{{ getRecordCount() }} 条</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">导出列数:</span>
              <span class="preview-value">{{ selectedColumns.length }} 列</span>
            </div>
            <div class="preview-item">
              <span class="preview-label">预估文件大小:</span>
              <span class="preview-value">{{ estimateFileSize() }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="export-modal__footer">
        <button @click="$emit('close')" class="cancel-btn">
          取消
        </button>
        <button 
          @click="handleExport"
          class="export-btn"
          :disabled="!canExport || exporting"
        >
          <Download v-if="!exporting" :size="16" />
          <Loader v-else :size="16" class="spinning" />
          {{ exporting ? '导出中...' : '开始导出' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { 
  X, Download, Loader, FileText, FileSpreadsheet, 
  FileCode, File, Printer 
} from 'lucide-vue-next'
import { 
  exportToCSV, 
  exportToExcel, 
  exportToJSON, 
  exportToPDF,
  formatters,
  type ExportColumn 
} from '@/utils/export'

// 属性定义
interface Props {
  visible: boolean
  data: Record<string, unknown>[]
  filteredData: Record<string, unknown>[]
  selectedData: Record<string, unknown>[]
  columns: ExportColumn[]
  defaultFilename?: string
  totalCount: number
  filteredCount: number
  selectedCount: number
}

const props = defineProps<Props>()

// 事件定义
const emit = defineEmits<{
  close: []
  export: [data: {
    format: string
    data: Record<string, unknown>[]
    columns: ExportColumn[]
    options: Record<string, unknown>
  }]
}>()

// 响应式数据
const selectedFormat = ref<'csv' | 'excel' | 'json' | 'pdf'>('csv')
const exportRange = ref<'all' | 'filtered' | 'selected'>('filtered')
const selectedColumns = ref<string[]>([])
const includeHeaders = ref(true)
const includeStats = ref(true)
const filename = ref('')
const reportTitle = ref('')
const reportDescription = ref('')
const exporting = ref(false)

// 可用列
const availableColumns = ref<ExportColumn[]>([])

// 格式选项
const formatOptions = [
  {
    value: 'csv',
    label: 'CSV',
    description: '逗号分隔值文件，兼容 Excel',
    icon: FileSpreadsheet
  },
  {
    value: 'excel',
    label: 'Excel',
    description: 'Microsoft Excel 格式',
    icon: FileSpreadsheet
  },
  {
    value: 'json',
    label: 'JSON',
    description: 'JavaScript 对象表示法',
    icon: FileCode
  },
  {
    value: 'pdf',
    label: 'PDF报告',
    description: '包含图表和统计的完整报告',
    icon: File
  }
]

// 计算属性
const canExport = computed(() => {
  return selectedColumns.value.length > 0 && 
         filename.value.trim() !== '' &&
         getRecordCount() > 0
})

// 监听器
watch(() => props.columns, (newColumns) => {
  availableColumns.value = [...newColumns]
  if (selectedColumns.value.length === 0) {
    selectedColumns.value = newColumns.map(col => col.key)
  }
}, { immediate: true })

watch(() => props.visible, (visible) => {
  if (visible) {
    initializeDefaults()
  }
})

watch(() => props.selectedCount, (count) => {
  if (count === 0 && exportRange.value === 'selected') {
    exportRange.value = 'filtered'
  }
})

// 方法
const initializeDefaults = () => {
  filename.value = props.defaultFilename || 'export'
  reportTitle.value = '数据导出报告'
  reportDescription.value = '本报告包含导出的数据和相关统计信息'
  
  if (selectedColumns.value.length === 0) {
    selectedColumns.value = availableColumns.value.map(col => col.key)
  }
}

const handleOverlayClick = () => {
  emit('close')
}

const selectAllColumns = () => {
  selectedColumns.value = availableColumns.value.map(col => col.key)
}

const deselectAllColumns = () => {
  selectedColumns.value = []
}

const resetColumnSelection = () => {
  selectedColumns.value = availableColumns.value.map(col => col.key)
}

const getFormatLabel = () => {
  const format = formatOptions.find(f => f.value === selectedFormat.value)
  return format?.label || selectedFormat.value.toUpperCase()
}

const getRecordCount = () => {
  switch (exportRange.value) {
    case 'all':
      return props.totalCount
    case 'filtered':
      return props.filteredCount
    case 'selected':
      return props.selectedCount
    default:
      return 0
  }
}

const getExportData = () => {
  switch (exportRange.value) {
    case 'all':
      return props.data
    case 'filtered':
      return props.filteredData
    case 'selected':
      return props.selectedData
    default:
      return []
  }
}

const getSelectedColumns = (): ExportColumn[] => {
  return availableColumns.value.filter(col => selectedColumns.value.includes(col.key))
}

const estimateFileSize = () => {
  const recordCount = getRecordCount()
  const columnCount = selectedColumns.value.length
  
  // 粗略估算文件大小
  let bytesPerRecord = 0
  
  switch (selectedFormat.value) {
    case 'csv':
    case 'excel':
      bytesPerRecord = columnCount * 20 // 平均每列20字节
      break
    case 'json':
      bytesPerRecord = columnCount * 40 // JSON格式较大
      break
    case 'pdf':
      bytesPerRecord = columnCount * 50 // PDF包含格式信息
      break
  }
  
  const totalBytes = recordCount * bytesPerRecord
  
  if (totalBytes < 1024) {
    return `${totalBytes} B`
  } else if (totalBytes < 1024 * 1024) {
    return `${Math.round(totalBytes / 1024)} KB`
  } else {
    return `${Math.round(totalBytes / (1024 * 1024))} MB`
  }
}

const handleExport = async () => {
  if (!canExport.value) return
  
  exporting.value = true
  
  try {
    const exportData = getExportData()
    const exportColumns = getSelectedColumns()
    
    const options = {
      filename: filename.value,
      includeHeaders: includeHeaders.value,
      title: reportTitle.value,
      description: reportDescription.value,
      includeStats: includeStats.value
    }
    
    // 延迟一点时间显示加载状态
    await new Promise(resolve => setTimeout(resolve, 500))
    
    switch (selectedFormat.value) {
      case 'csv':
        exportToCSV(exportData, exportColumns, options)
        break
      case 'excel':
        exportToExcel(exportData, exportColumns, options)
        break
      case 'json':
        exportToJSON(exportData, exportColumns, options)
        break
      case 'pdf':
        exportToPDF(exportData, exportColumns, options)
        break
    }
    
    // 触发导出事件
    emit('export', {
      format: selectedFormat.value,
      data: exportData,
      columns: exportColumns,
      options
    })
    
    // 导出成功后关闭弹窗
    setTimeout(() => {
      emit('close')
    }, 1000)
    
  } catch (error) {
    console.error('导出失败:', error)
  } finally {
    exporting.value = false
  }
}

// 生命周期
onMounted(() => {
  if (props.visible) {
    initializeDefaults()
  }
})
</script>

<style scoped>
.export-modal-overlay {
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
  padding: var(--spacing-lg);
}

.export-modal {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-xl);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.export-modal__header {
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.export-modal__header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  border-radius: var(--border-radius-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.close-btn:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.export-modal__content {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.export-section h4 {
  margin: 0 0 var(--spacing-md) 0;
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.format-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.format-option {
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: all var(--duration-fast);
  display: block;
}

.format-option:hover {
  border-color: var(--color-primary-light);
  background: var(--color-background);
}

.format-option--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.format-radio {
  display: none;
}

.format-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.format-icon {
  color: var(--color-primary);
  flex-shrink: 0;
}

.format-info {
  flex: 1;
}

.format-name {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.format-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.range-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.range-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.range-option:hover {
  background: var(--color-background);
}

.range-radio {
  accent-color: var(--color-primary);
}

.range-content {
  flex: 1;
}

.range-title {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.range-desc {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.column-selection {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.column-actions {
  padding: var(--spacing-md);
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  gap: var(--spacing-sm);
}

.column-action-btn {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.column-action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.column-list {
  max-height: 200px;
  overflow-y: auto;
  padding: var(--spacing-md);
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-sm);
}

.column-option {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--duration-fast);
}

.column-option:hover {
  background: var(--color-background);
}

.column-checkbox {
  accent-color: var(--color-primary);
}

.column-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.export-options {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.option-row {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.option-checkbox {
  accent-color: var(--color-primary);
}

.filename-input,
.title-input {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  margin-left: var(--spacing-sm);
}

.description-textarea {
  flex: 1;
  padding: var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  margin-left: var(--spacing-sm);
  resize: vertical;
  font-family: inherit;
}

.export-preview {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.preview-info {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.preview-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-label {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.preview-value {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.export-modal__footer {
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border-light);
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
}

.cancel-btn,
.export-btn {
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.cancel-btn {
  background: none;
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
}

.cancel-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.export-btn {
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  color: white;
}

.export-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.export-btn:disabled {
  background: var(--color-text-disabled);
  border-color: var(--color-text-disabled);
  cursor: not-allowed;
}

.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .export-modal {
    max-width: 90vw;
  }
}

@media (max-width: 768px) {
  .export-modal-overlay {
    padding: var(--spacing-sm);
    align-items: flex-start;
    padding-top: var(--spacing-lg);
  }
  
  .export-modal {
    max-height: 90vh;
    max-width: 95vw;
  }
  
  .export-modal__header {
    padding: var(--spacing-md);
  }
  
  .export-modal__content {
    padding: var(--spacing-md);
    gap: var(--spacing-lg);
  }
  
  .format-options {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .format-option {
    padding: var(--spacing-sm);
  }
  
  .format-content {
    gap: var(--spacing-sm);
  }
  
  .range-options {
    gap: var(--spacing-xs);
  }
  
  .range-option {
    padding: var(--spacing-sm);
  }
  
  .column-actions {
    padding: var(--spacing-sm);
    flex-wrap: wrap;
  }
  
  .column-list {
    grid-template-columns: 1fr;
    padding: var(--spacing-sm);
    max-height: 150px;
  }
  
  .export-options {
    gap: var(--spacing-sm);
  }
  
  .option-row {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-xs);
  }
  
  .filename-input,
  .title-input {
    margin-left: 0;
    margin-top: var(--spacing-xs);
  }
  
  .description-textarea {
    margin-left: 0;
    margin-top: var(--spacing-xs);
  }
  
  .preview-info {
    grid-template-columns: 1fr;
    gap: var(--spacing-sm);
  }
  
  .preview-item {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-xs);
  }
  
  .export-modal__footer {
    flex-direction: column-reverse;
    padding: var(--spacing-md);
    gap: var(--spacing-sm);
  }
  
  .cancel-btn,
  .export-btn {
    width: 100%;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .export-modal-overlay {
    padding: var(--spacing-xs);
  }
  
  .export-modal {
    max-height: 95vh;
  }
  
  .export-modal__header h3 {
    font-size: var(--font-size-md);
  }
  
  .export-section h4 {
    font-size: var(--font-size-sm);
  }
  
  .format-name {
    font-size: var(--font-size-sm);
  }
  
  .format-desc {
    font-size: var(--font-size-xs);
  }
  
  .column-action-btn {
    padding: var(--spacing-xs);
    font-size: var(--font-size-xs);
  }
  
  .column-list {
    max-height: 120px;
  }
  
  .preview-label,
  .preview-value {
    font-size: var(--font-size-xs);
  }
}
</style>