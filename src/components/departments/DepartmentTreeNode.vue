<template>
  <div class="department-node" :class="{ 'department-node--expanded': isExpanded }">
    <div class="node-content" :style="{ paddingLeft: `${level * 24}px` }">
      <div class="node-toggle" @click="toggleExpanded">
        <ChevronRight
          v-if="hasChildren"
          :size="16"
          class="toggle-icon"
          :class="{ 'toggle-icon--expanded': isExpanded }"
        />
        <div v-else class="toggle-placeholder"></div>
      </div>

      <div class="node-info" @click="handleNodeClick">
        <div class="node-icon">
          <Building :size="18" />
        </div>
        <div class="node-details">
          <div class="node-name">{{ department.name }}</div>
          <div class="node-meta">
            <span class="node-code">{{ department.code }}</span>
            <span class="node-count">({{ department.employee_count }}人)</span>
            <span v-if="department.manager_name" class="node-manager">
              负责人：{{ department.manager_name }}
            </span>
          </div>
        </div>
      </div>

      <div class="node-status">
        <span
          class="status-badge"
          :class="department.status === 'active' ? 'status-badge--success' : 'status-badge--danger'"
        >
          {{ department.status === 'active' ? '启用' : '停用' }}
        </span>
      </div>

      <div class="node-actions">
        <button
          class="action-btn-small action-btn-small--info"
          @click.stop="$emit('view', department)"
          title="查看详情"
        >
          <Eye :size="14" />
        </button>
        <button
          class="action-btn-small action-btn-small--primary"
          @click.stop="$emit('edit', department)"
          title="编辑"
        >
          <Edit :size="14" />
        </button>
        <button
          class="action-btn-small action-btn-small--success"
          @click.stop="$emit('add-child', department)"
          title="添加子部门"
        >
          <Plus :size="14" />
        </button>
        <button
          class="action-btn-small action-btn-small--danger"
          @click.stop="$emit('delete', department)"
          title="删除"
        >
          <Trash2 :size="14" />
        </button>
      </div>
    </div>

    <!-- 子部门 -->
    <div v-if="hasChildren && isExpanded" class="node-children">
      <DepartmentTreeNode
        v-for="child in department.children"
        :key="child.id"
        :department="child"
        :level="level + 1"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @add-child="$emit('add-child', $event)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  ChevronRight,
  Building,
  Eye,
  Edit,
  Plus,
  Trash2
} from 'lucide-vue-next'
import type { Department } from '@/types/departments'

interface Props {
  department: Department
  level: number
}

const props = defineProps<Props>()

const emit = defineEmits<{
  view: [department: Department]
  edit: [department: Department]
  delete: [department: Department]
  'add-child': [department: Department]
}>()

const isExpanded = ref(true)

const hasChildren = computed(() => {
  return props.department.children && props.department.children.length > 0
})

const toggleExpanded = () => {
  if (hasChildren.value) {
    isExpanded.value = !isExpanded.value
  }
}

const handleNodeClick = () => {
  emit('view', props.department)
}
</script>

<style scoped>
.department-node {
  border-bottom: 1px solid var(--color-border-light);
}

.node-content {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  transition: background-color 0.2s ease;
  cursor: pointer;
}

.node-content:hover {
  background-color: var(--color-background);
}

.node-toggle {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.2s ease;
}

.node-toggle:hover {
  background-color: var(--color-background);
}

.toggle-icon {
  transition: transform 0.2s ease;
  color: var(--color-text-secondary);
}

.toggle-icon--expanded {
  transform: rotate(90deg);
}

.toggle-placeholder {
  width: 16px;
  height: 16px;
}

.node-info {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: 8px;
}

.node-icon {
  color: var(--color-primary);
}

.node-details {
  flex: 1;
}

.node-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.node-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.node-code {
  font-family: monospace;
  background: var(--color-background);
  padding: 2px 6px;
  border-radius: 4px;
}

.node-count {
  color: var(--color-primary);
  font-weight: 500;
}

.node-manager {
  color: var(--color-text-secondary);
}

.node-status {
  margin-right: 12px;
}

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.status-badge--success {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-badge--danger {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.node-actions {
  display: flex;
  align-items: center;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.node-content:hover .node-actions {
  opacity: 1;
}

.action-btn-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
}

.action-btn-small--info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.action-btn-small--info:hover {
  background: #3b82f6;
  color: white;
}

.action-btn-small--primary {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.action-btn-small--primary:hover {
  background: #16a34a;
  color: white;
}

.action-btn-small--success {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.action-btn-small--success:hover {
  background: #a855f7;
  color: white;
}

.action-btn-small--danger {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.action-btn-small--danger:hover {
  background: #dc2626;
  color: white;
}

.node-children {
  background: var(--color-background);
}
</style>
