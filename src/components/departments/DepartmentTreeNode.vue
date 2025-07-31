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

    <!-- 员工列表 -->
    <div v-if="isExpanded && departmentEmployees.length > 0" class="node-employees">
      <div class="employees-header" @click="toggleEmployeesExpanded">
        <div class="employees-header-left">
          <ChevronRight
            :size="14"
            class="employees-toggle-icon"
            :class="{ 'employees-toggle-icon--expanded': isEmployeesExpanded }"
          />
          <span class="employees-title">部门员工 ({{ departmentEmployees.length }}人)</span>
        </div>
        <button
          class="add-employee-btn"
          @click.stop="$emit('add-employee', department)"
          title="添加员工"
        >
          <Plus :size="14" />
        </button>
      </div>
      <div v-if="isEmployeesExpanded" class="employees-list">
        <div
          v-for="employee in departmentEmployees"
          :key="employee.id"
          class="employee-item"
        >
          <div class="employee-info">
            <div class="employee-name">{{ employee.name }}</div>
            <div class="employee-details">
              <span class="employee-id">{{ employee.employee_id }}</span>
              <span class="employee-position">{{ employee.position }}</span>
              <span class="employee-status" :class="getEmployeeStatusClass(employee.status)">
                {{ getEmployeeStatusText(employee.status) }}
              </span>
            </div>
          </div>
          <div class="employee-actions">
            <button
              class="action-btn-mini action-btn-mini--primary"
              @click.stop="$emit('edit-employee', employee)"
              title="编辑员工"
            >
              <Edit :size="12" />
            </button>
            <button
              class="action-btn-mini action-btn-mini--danger"
              @click.stop="$emit('remove-employee', employee)"
              title="移除员工"
            >
              <Trash2 :size="12" />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 子部门 -->
    <div v-if="hasChildren && isExpanded" class="node-children">
      <DepartmentTreeNode
        v-for="child in department.children"
        :key="child.id"
        :department="child"
        :level="level + 1"
        :employees="employees"
        @view="$emit('view', $event)"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @add-child="$emit('add-child', $event)"
        @add-employee="$emit('add-employee', $event)"
        @edit-employee="$emit('edit-employee', $event)"
        @remove-employee="$emit('remove-employee', $event)"
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
import type { Department, Employee } from '@/types/departments'

interface Props {
  department: Department
  level: number
  employees?: Employee[]
}

const props = defineProps<Props>()

const emit = defineEmits<{
  view: [department: Department]
  edit: [department: Department]
  delete: [department: Department]
  'add-child': [department: Department]
  'add-employee': [department: Department]
  'edit-employee': [employee: Employee]
  'remove-employee': [employee: Employee]
}>()

const isExpanded = ref(true)
const isEmployeesExpanded = ref(true)

const hasChildren = computed(() => {
  return props.department.children && props.department.children.length > 0
})

const departmentEmployees = computed(() => {
  if (!props.employees) return []
  return props.employees.filter(emp => emp.department_id === props.department.id)
})

const toggleExpanded = () => {
  if (hasChildren.value || departmentEmployees.value.length > 0) {
    isExpanded.value = !isExpanded.value
  }
}

const toggleEmployeesExpanded = () => {
  isEmployeesExpanded.value = !isEmployeesExpanded.value
}

const handleNodeClick = () => {
  emit('view', props.department)
}

const getEmployeeStatusClass = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: 'status--active',
    probation: 'status--probation',
    inactive: 'status--inactive',
    resigned: 'status--resigned'
  }
  return statusMap[status] || 'status--default'
}

const getEmployeeStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: '在职',
    probation: '试用',
    inactive: '停用',
    resigned: '离职'
  }
  return statusMap[status] || status
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

/* 员工列表样式 */
.node-employees {
  background: var(--color-background);
  border-left: 2px solid var(--color-border);
  margin-left: 24px;
}

.employees-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border-light);
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.employees-header:hover {
  background: var(--color-background-hover);
}

.employees-header-left {
  display: flex;
  align-items: center;
  gap: 6px;
}

.employees-toggle-icon {
  transition: transform 0.2s ease;
  color: var(--color-text-secondary);
}

.employees-toggle-icon--expanded {
  transform: rotate(90deg);
}

.employees-title {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.add-employee-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 3px;
  background: var(--color-primary);
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-employee-btn:hover {
  background: var(--color-primary-dark, #1d4ed8);
}

.employees-list {
  max-height: 200px;
  overflow-y: auto;
}

.employee-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
  border-bottom: 1px solid var(--color-border-light);
  transition: background-color 0.2s ease;
}

.employee-item:hover {
  background: var(--color-background-hover);
}

.employee-item:last-child {
  border-bottom: none;
}

.employee-info {
  flex: 1;
}

.employee-name {
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 2px;
}

.employee-details {
  display: flex;
  gap: 8px;
  align-items: center;
}

.employee-id {
  font-size: 11px;
  color: var(--color-text-secondary);
  font-family: monospace;
  background: var(--color-background);
  padding: 1px 4px;
  border-radius: 2px;
}

.employee-position {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.employee-status {
  font-size: 10px;
  padding: 1px 4px;
  border-radius: 8px;
  font-weight: 500;
}

.status--active {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status--probation {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.status--inactive {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.status--resigned {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.employee-actions {
  display: flex;
  gap: 2px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.employee-item:hover .employee-actions {
  opacity: 1;
}

.action-btn-mini {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn-mini--primary {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.action-btn-mini--primary:hover {
  background: #16a34a;
  color: white;
}

.action-btn-mini--danger {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.action-btn-mini--danger:hover {
  background: #dc2626;
  color: white;
}
</style>
