<template>
  <div class="department-card" :class="{
    'department-card--expanded': isExpanded,
    'department-card--leaf': isLeafDepartment
  }">
    <!-- 主要部门信息 -->
    <div class="card-header" :style="{ marginLeft: `${level * 24}px` }">
      <!-- 展开/收起按钮 -->
      <button
        v-if="hasChildren || (isLeafDepartment && regularEmployees.length > 0)"
        class="expand-btn"
        @click="toggleExpanded"
        :aria-label="isExpanded ? '收起' : '展开'"
      >
        <ChevronRight
          :size="16"
          class="expand-icon"
          :class="{ 'expand-icon--rotated': isExpanded }"
        />
      </button>
      <div v-else class="expand-placeholder"></div>

      <!-- 部门信息主体 -->
      <div class="department-info" @click="handleNodeClick">
        <div class="dept-icon">
          <Building :size="24" />
        </div>

        <div class="dept-content">
          <!-- 部门基本信息 -->
          <div class="dept-header">
            <h3 class="dept-name">{{ department.name }}</h3>
            <div class="dept-badges">
              <span class="badge badge--code">{{ department.code }}</span>
              <span class="badge badge--count">{{ getTotalEmployeeCount }}人</span>
              <span
                class="badge badge--status"
                :class="`badge--${department.status}`"
              >
                {{ department.status === 'active' ? '启用' : '停用' }}
              </span>
            </div>
          </div>

          <!-- 部门经理信息 -->
          <div v-if="departmentManager" class="manager-card">
            <div class="manager-avatar">
              <span>{{ departmentManager.name.charAt(0) }}</span>
            </div>
            <div class="manager-details">
              <div class="manager-name">{{ departmentManager.name }}</div>
              <div class="manager-meta">
                <span class="manager-position">{{ departmentManager.position }}</span>
                <span class="manager-contact">{{ departmentManager.phone }}</span>
              </div>
            </div>
            <div class="manager-status">
              <span class="status-dot" :class="getEmployeeStatusClass(departmentManager.status)"></span>
              <span class="status-text">{{ getEmployeeStatusText(departmentManager.status) }}</span>
            </div>
          </div>

          <!-- 无经理提示 -->
          <div v-else-if="isLeafDepartment" class="manager-card manager-card--empty">
            <div class="empty-icon">
              <Building :size="16" />
            </div>
            <span class="empty-text">暂未指定部门经理</span>
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button class="action-btn action-btn--view" @click.stop="$emit('view', department)" title="查看详情">
          <Eye :size="16" />
        </button>
        <button class="action-btn action-btn--edit" @click.stop="$emit('edit', department)" title="编辑">
          <Edit :size="16" />
        </button>
        <button class="action-btn action-btn--add" @click.stop="$emit('add-child', department)" title="添加子部门">
          <Plus :size="16" />
        </button>
        <button class="action-btn action-btn--delete" @click.stop="$emit('delete', department)" title="删除">
          <Trash2 :size="16" />
        </button>
      </div>
    </div>

    <!-- 子部门 -->
    <div v-if="isExpanded && hasChildren" class="child-departments">
      <DepartmentTreeNodeNew
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

    <!-- 员工列表 - 只在最底层部门显示 -->
    <div v-if="isExpanded && isLeafDepartment && regularEmployees.length > 0" class="employees-section">
      <div class="employees-header" @click="toggleEmployeesExpanded">
        <div class="employees-title">
          <ChevronRight
            :size="14"
            class="employees-toggle"
            :class="{ 'employees-toggle--expanded': isEmployeesExpanded }"
          />
          <span>部门员工 ({{ regularEmployees.length }}人)</span>
        </div>
        <button class="add-employee-btn" @click.stop="$emit('add-employee', department)" title="添加员工">
          <Plus :size="14" />
        </button>
      </div>

      <div v-if="isEmployeesExpanded" class="employees-list">
        <div v-for="employee in regularEmployees" :key="employee.id" class="employee-card">
          <div class="employee-avatar">
            <span>{{ employee.name.charAt(0) }}</span>
          </div>
          <div class="employee-info">
            <div class="employee-name">{{ employee.name }}</div>
            <div class="employee-meta">
              <span class="employee-id">{{ employee.employee_id }}</span>
              <span class="employee-position">{{ employee.position }}</span>
            </div>
          </div>
          <div class="employee-status">
            <span class="status-dot" :class="getEmployeeStatusClass(employee.status)"></span>
            <span class="status-text">{{ getEmployeeStatusText(employee.status) }}</span>
          </div>
          <div class="employee-actions">
            <button class="mini-btn mini-btn--edit" @click.stop="$emit('edit-employee', employee)" title="编辑">
              <Edit :size="12" />
            </button>
            <button class="mini-btn mini-btn--delete" @click.stop="$emit('remove-employee', employee)" title="删除">
              <Trash2 :size="12" />
            </button>
          </div>
        </div>
      </div>
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

const isLeafDepartment = computed(() => {
  return !hasChildren.value
})

const departmentEmployees = computed(() => {
  if (!props.employees) return []
  return props.employees.filter(emp => emp.department_id === props.department.id)
})

const departmentManager = computed(() => {
  if (!props.department.manager_id || !props.employees) return null
  return props.employees.find(emp => emp.id === props.department.manager_id)
})

const regularEmployees = computed(() => {
  return departmentEmployees.value.filter(emp => emp.id !== props.department.manager_id)
})

const getTotalEmployeeCount = computed(() => {
  if (isLeafDepartment.value) {
    return departmentEmployees.value.length
  } else {
    return props.department.employee_count || 0
  }
})

const toggleExpanded = () => {
  if (hasChildren.value || (isLeafDepartment.value && regularEmployees.value.length > 0)) {
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
/* 基础卡片样式 */
.department-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  margin-bottom: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.department-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.15);
  transform: translateY(-2px);
}

.department-card--leaf {
  border-left: 4px solid #10b981;
}

.department-card--expanded {
  margin-bottom: 24px;
}

/* 卡片头部 */
.card-header {
  display: flex;
  align-items: flex-start;
  padding: 24px;
  gap: 16px;
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
}

/* 展开按钮 */
.expand-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: #f1f5f9;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.expand-btn:hover {
  background: #3b82f6;
  color: white;
  transform: scale(1.1);
}

.expand-placeholder {
  width: 40px;
  height: 40px;
  flex-shrink: 0;
}

.expand-icon {
  transition: transform 0.3s ease;
  color: inherit;
}

.expand-icon--rotated {
  transform: rotate(90deg);
}

/* 部门信息区域 */
.department-info {
  flex: 1;
  display: flex;
  gap: 16px;
  cursor: pointer;
  border-radius: 12px;
  padding: 8px;
  transition: background-color 0.2s ease;
}

.department-info:hover {
  background: rgba(59, 130, 246, 0.05);
}

.dept-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
  flex-shrink: 0;
}

.dept-content {
  flex: 1;
  min-width: 0;
}

/* 部门头部信息 */
.dept-header {
  margin-bottom: 12px;
}

.dept-name {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
  line-height: 1.3;
}

.dept-badges {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  line-height: 1;
}

.badge--code {
  background: #f3f4f6;
  color: #6b7280;
  font-family: 'SF Mono', Monaco, monospace;
}

.badge--count {
  background: #dbeafe;
  color: #1d4ed8;
}

.badge--active {
  background: #d1fae5;
  color: #065f46;
}

.badge--inactive {
  background: #fee2e2;
  color: #991b1b;
}

/* 经理卡片 */
.manager-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
}

.manager-card--empty {
  background: #fafafa;
  border-color: #e5e5e5;
  color: #6b7280;
}

.manager-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 10px;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.manager-details {
  flex: 1;
  min-width: 0;
}

.manager-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 2px;
}

.manager-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.manager-position {
  background: #e0e7ff;
  color: #3730a3;
  padding: 2px 6px;
  border-radius: 4px;
}

.manager-status {
  display: flex;
  align-items: center;
  gap: 6px;
}

.empty-icon {
  color: #9ca3af;
}

.empty-text {
  font-size: 13px;
  color: #6b7280;
  font-style: italic;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  opacity: 0.7;
}

.action-btn:hover {
  opacity: 1;
  transform: scale(1.1);
}

.action-btn--view {
  background: #dbeafe;
  color: #1d4ed8;
}

.action-btn--view:hover {
  background: #3b82f6;
  color: white;
}

.action-btn--edit {
  background: #fef3c7;
  color: #d97706;
}

.action-btn--edit:hover {
  background: #f59e0b;
  color: white;
}

.action-btn--add {
  background: #d1fae5;
  color: #065f46;
}

.action-btn--add:hover {
  background: #10b981;
  color: white;
}

.action-btn--delete {
  background: #fee2e2;
  color: #dc2626;
}

.action-btn--delete:hover {
  background: #ef4444;
  color: white;
}

/* 状态指示器 */
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}

.status-text {
  font-size: 12px;
  font-weight: 500;
}

.status--active .status-dot {
  background: #10b981;
}

.status--active .status-text {
  color: #065f46;
}

.status--probation .status-dot {
  background: #f59e0b;
}

.status--probation .status-text {
  color: #92400e;
}

.status--inactive .status-dot {
  background: #ef4444;
}

.status--inactive .status-text {
  color: #991b1b;
}

.status--resigned .status-dot {
  background: #6b7280;
}

.status--resigned .status-text {
  color: #4b5563;
}

/* 子部门区域 */
.child-departments {
  padding: 0 24px 24px 24px;
  background: #f8fafc;
}

/* 员工列表区域 */
.employees-section {
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.employees-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.employees-header:hover {
  background: #f1f5f9;
}

.employees-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.employees-toggle {
  transition: transform 0.2s ease;
  color: #6b7280;
}

.employees-toggle--expanded {
  transform: rotate(90deg);
}

.add-employee-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 8px;
  background: #10b981;
  color: white;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-employee-btn:hover {
  background: #059669;
  transform: scale(1.05);
}

.employees-list {
  padding: 0 24px 24px 24px;
}

/* 员工卡片 */
.employee-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.employee-card:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-1px);
}

.employee-card:last-child {
  margin-bottom: 0;
}

.employee-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
  color: white;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.employee-info {
  flex: 1;
  min-width: 0;
}

.employee-name {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
}

.employee-meta {
  display: flex;
  gap: 8px;
  font-size: 12px;
  color: #6b7280;
}

.employee-id {
  background: #f3f4f6;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'SF Mono', Monaco, monospace;
}

.employee-position {
  background: #e0e7ff;
  color: #3730a3;
  padding: 2px 6px;
  border-radius: 4px;
}

.employee-status {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-right: 8px;
}

.employee-actions {
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.employee-card:hover .employee-actions {
  opacity: 1;
}

.mini-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.mini-btn--edit {
  background: #fef3c7;
  color: #d97706;
}

.mini-btn--edit:hover {
  background: #f59e0b;
  color: white;
}

.mini-btn--delete {
  background: #fee2e2;
  color: #dc2626;
}

.mini-btn--delete:hover {
  background: #ef4444;
  color: white;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .card-header {
    padding: 16px;
    gap: 12px;
  }

  .dept-name {
    font-size: 16px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 4px;
  }

  .action-btn {
    width: 32px;
    height: 32px;
  }

  .employees-list {
    padding: 0 16px 16px 16px;
  }

  .employee-card {
    padding: 12px;
  }
}
</style>
