<template>
  <div class="module-summary">
    <div class="summary-header">
      <h3>模块小结</h3>
      <button class="edit-summary-btn" @click="toggleEditMode">
        <component :is="isEditingMode ? 'Check' : 'Edit'" :size="16" />
        {{ isEditingMode ? '保存' : '编辑' }}
      </button>
    </div>

    <div class="summary-content">
      <div v-if="!isEditingMode" class="summary-display">
        <p>{{ summaryText }}</p>
      </div>
      <div v-else class="summary-edit">
        <textarea
          v-model="editingSummaryText"
          class="summary-textarea"
          :placeholder="placeholder"
          rows="4"
        ></textarea>
      </div>
    </div>

    <!-- 统计数据概览 -->
    <div class="summary-stats">
      <div v-for="stat in stats" :key="stat.label" class="stat-item">
        <span class="stat-label">{{ stat.label }}</span>
        <span v-if="stat.type === 'badge'" :class="['stat-badge', stat.class]">{{ stat.value }}</span>
        <span v-else class="stat-value">{{ stat.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Edit, Check } from 'lucide-vue-next'

interface StatItem {
  label: string
  value: string | number
  type?: 'text' | 'badge'
  class?: string
}

interface Props {
  defaultText: string
  placeholder: string
  stats: StatItem[]
}

const props = defineProps<Props>()

// 模块小结相关状态
const isEditingMode = ref(false)
const summaryText = ref(props.defaultText)
const editingSummaryText = ref('')

// 监听默认文本变化
watch(() => props.defaultText, (newText) => {
  summaryText.value = newText
}, { immediate: true })

const toggleEditMode = () => {
  if (isEditingMode.value) {
    summaryText.value = editingSummaryText.value
    isEditingMode.value = false
  } else {
    editingSummaryText.value = summaryText.value
    isEditingMode.value = true
  }
}
</script>

<style scoped>
.module-summary {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  padding: 20px;
  margin-top: 24px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.summary-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.edit-summary-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-summary-btn:hover {
  background: #2563eb;
}

.summary-content {
  margin-bottom: 16px;
}

.summary-display p {
  margin: 0;
  line-height: 1.6;
  color: #374151;
}

.summary-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  line-height: 1.6;
  resize: vertical;
  font-family: inherit;
}

.summary-textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.summary-stats {
  display: flex;
  gap: 24px;
  padding-top: 16px;
  border-top: 1px solid #e5e7eb;
}

.stat-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.stat-label {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.stat-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.stat-badge.status-excellent {
  background: #dcfce7;
  color: #166534;
}

.stat-badge.status-good {
  background: #dbeafe;
  color: #1d4ed8;
}

.stat-badge.status-warning {
  background: #fef3c7;
  color: #92400e;
}

.stat-badge.status-danger {
  background: #fee2e2;
  color: #dc2626;
}

@media (max-width: 768px) {
  .summary-stats {
    flex-direction: column;
    gap: 12px;
  }

  .summary-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
