<template>
  <div class="goals-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3>目标设置</h3>
        <p>管理员工目标设置和模板配置</p>
      </div>
      <div class="header-actions">
        <button class="action-btn action-btn--secondary" @click="exportData">
          <Download :size="16" />
          导出数据
        </button>
        <button class="action-btn action-btn--secondary" @click="manageTemplates">
          <Settings :size="16" />
          模板管理
        </button>
        <button class="action-btn action-btn--primary" @click="createGoal">
          <Plus :size="16" />
          新建目标
        </button>
      </div>
    </div>

    <div class="goals-content">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-group">
            <label class="filter-label">目标周期:</label>
            <select v-model="filters.periodType" @change="handleFilterChange" class="filter-select">
              <option value="">全部周期</option>
              <option value="monthly">月度</option>
              <option value="quarterly">季度</option>
              <option value="yearly">年度</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">部门:</label>
            <select v-model="filters.departmentId" @change="handleFilterChange" class="filter-select">
              <option value="">全部部门</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">员工类型:</label>
            <select v-model="filters.employeeType" @change="handleFilterChange" class="filter-select">
              <option value="">全部类型</option>
              <option value="sales">销售人员</option>
              <option value="operations">运营人员</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">状态:</label>
            <select v-model="filters.status" @change="handleFilterChange" class="filter-select">
              <option value="">全部状态</option>
              <option value="active">进行中</option>
              <option value="completed">已完成</option>
              <option value="cancelled">已取消</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">时间范围:</label>
            <div class="date-range">
              <input
                v-model="filters.startDate"
                type="date"
                class="filter-input"
                @change="handleFilterChange"
              />
              <span class="date-separator">至</span>
              <input
                v-model="filters.endDate"
                type="date"
                class="filter-input"
                @change="handleFilterChange"
              />
            </div>
          </div>

          <div class="filter-group">
            <div class="search-input-wrapper">
              <Search :size="20" class="search-icon" />
              <input
                v-model="filters.keyword"
                type="text"
                placeholder="搜索员工姓名"
                class="search-input"
                @input="handleFilterChange"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 目标列表 -->
      <div class="goals-table-section">
        <div class="table-header">
          <div class="table-header__left">
            <h3>目标列表</h3>
            <span class="record-count">共 {{ filteredGoals.length }} 条记录</span>
          </div>
          <div class="table-header__right">
            <button class="action-btn action-btn--secondary" @click="batchSetGoals">
              <Users :size="16" />
              批量设置
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="goals-table">
            <thead>
              <tr>
                <th>员工</th>
                <th>部门</th>
                <th>目标周期</th>
                <th>员工类型</th>
                <th>目标内容</th>
                <th>状态</th>
                <th>创建人</th>
                <th>创建时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="goal in paginatedGoals" :key="goal.id" class="goal-row">
                <td>
                  <div class="employee-info">
                    <div class="employee-name">{{ goal.employee_name }}</div>
                    <div class="employee-id">{{ getEmployeeId(goal.employee_id) }}</div>
                  </div>
                </td>
                <td>{{ goal.department_name }}</td>
                <td>
                  <div class="period-info">
                    <div class="period-text">{{ goal.period }}</div>
                    <div class="period-type">{{ getPeriodTypeText(goal.period_type) }}</div>
                  </div>
                </td>
                <td>
                  <span class="type-badge" :class="getEmployeeTypeClass(goal.employee_type)">
                    {{ getEmployeeTypeText(goal.employee_type) }}
                  </span>
                </td>
                <td>
                  <div class="goals-summary">
                    <div v-if="goal.sales_goals" class="goal-items">
                      <div v-if="goal.sales_goals.new_service_fee" class="goal-item">
                        新单服务费: ${{ formatNumber(goal.sales_goals.new_service_fee.target) }}
                      </div>
                      <div v-if="goal.sales_goals.new_orders" class="goal-item">
                        新单单量: {{ goal.sales_goals.new_orders.target }} 单
                      </div>
                      <div v-if="goal.sales_goals.new_customers" class="goal-item">
                        新单客户: {{ goal.sales_goals.new_customers.target }} 个
                      </div>
                    </div>
                    <div v-if="goal.operations_goals" class="goal-items">
                      <div v-if="goal.operations_goals.service_fee" class="goal-item">
                        服务费: ${{ formatNumber(goal.operations_goals.service_fee.target) }}
                      </div>
                      <div v-if="goal.operations_goals.rebate" class="goal-item">
                        返点: ${{ formatNumber(goal.operations_goals.rebate.target) }}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <span class="status-badge" :class="getStatusClass(goal.status)">
                    {{ getStatusText(goal.status) }}
                  </span>
                </td>
                <td>{{ goal.created_by_name }}</td>
                <td>{{ formatDate(goal.created_at) }}</td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="action-btn-small action-btn-small--info"
                      @click="viewGoal(goal)"
                      title="查看详情"
                    >
                      <Eye :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--primary"
                      @click="editGoal(goal)"
                      title="编辑"
                    >
                      <Edit :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--success"
                      @click="copyGoal(goal)"
                      title="复制"
                    >
                      <Copy :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--danger"
                      @click="deleteGoal(goal)"
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

        <!-- 分页 -->
        <div class="pagination-section">
          <div class="pagination-info">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredGoals.length) }} 条，
            共 {{ filteredGoals.length }} 条记录
          </div>
          <div class="pagination-controls">
            <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="currentPage = currentPage - 1"
            >
              上一页
            </button>
            <span class="pagination-current">{{ currentPage }} / {{ totalPages }}</span>
            <button
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="currentPage = currentPage + 1"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建/编辑目标弹窗 -->
    <div v-if="showGoalModal" class="modal-overlay" @click="closeGoalModal">
      <div class="modal-container modal-container--large" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditing ? '编辑目标' : '新建目标' }}</h3>
          <button class="modal-close" @click="closeGoalModal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="submitGoal" class="goal-form">
            <!-- 基本信息 -->
            <div class="form-section">
              <h4 class="section-title">基本信息</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">员工 *</label>
                  <select v-model="goalForm.employee_id" class="form-select" required @change="onEmployeeChange">
                    <option value="">请选择员工</option>
                    <option v-for="emp in employees" :key="emp.id" :value="emp.id">
                      {{ emp.name }} ({{ emp.position }})
                    </option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">目标周期 *</label>
                  <input
                    v-model="goalForm.period"
                    type="text"
                    class="form-input"
                    placeholder="如: 2023-08"
                    required
                  />
                </div>

                <div class="form-group">
                  <label class="form-label">周期类型 *</label>
                  <select v-model="goalForm.period_type" class="form-select" required>
                    <option value="">请选择周期类型</option>
                    <option value="monthly">月度</option>
                    <option value="quarterly">季度</option>
                    <option value="yearly">年度</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">员工类型 *</label>
                  <select v-model="goalForm.employee_type" class="form-select" required @change="onEmployeeTypeChange">
                    <option value="">请选择员工类型</option>
                    <option value="sales">销售人员</option>
                    <option value="operations">运营人员</option>
                  </select>
                </div>
              </div>
            </div>

            <!-- 销售目标 -->
            <div v-if="goalForm.employee_type === 'sales'" class="form-section">
              <h4 class="section-title">销售目标</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">新单服务费目标</label>
                  <div class="input-with-unit">
                    <input
                      v-model.number="goalForm.sales_goals.new_service_fee.target"
                      type="number"
                      class="form-input"
                      placeholder="请输入目标金额"
                      min="0"
                      step="1000"
                    />
                    <span class="input-unit">元</span>
                  </div>
                  <div class="weight-input">
                    <label class="weight-label">权重:</label>
                    <input
                      v-model.number="goalForm.sales_goals.new_service_fee.weight"
                      type="number"
                      class="weight-field"
                      min="0"
                      max="100"
                    />
                    <span class="weight-unit">%</span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">新单单量目标</label>
                  <div class="input-with-unit">
                    <input
                      v-model.number="goalForm.sales_goals.new_orders.target"
                      type="number"
                      class="form-input"
                      placeholder="请输入目标单量"
                      min="0"
                    />
                    <span class="input-unit">单</span>
                  </div>
                  <div class="weight-input">
                    <label class="weight-label">权重:</label>
                    <input
                      v-model.number="goalForm.sales_goals.new_orders.weight"
                      type="number"
                      class="weight-field"
                      min="0"
                      max="100"
                    />
                    <span class="weight-unit">%</span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">新单客户数目标</label>
                  <div class="input-with-unit">
                    <input
                      v-model.number="goalForm.sales_goals.new_customers.target"
                      type="number"
                      class="form-input"
                      placeholder="请输入目标客户数"
                      min="0"
                    />
                    <span class="input-unit">个</span>
                  </div>
                  <div class="weight-input">
                    <label class="weight-label">权重:</label>
                    <input
                      v-model.number="goalForm.sales_goals.new_customers.weight"
                      type="number"
                      class="weight-field"
                      min="0"
                      max="100"
                    />
                    <span class="weight-unit">%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 运营目标 -->
            <div v-if="goalForm.employee_type === 'operations'" class="form-section">
              <h4 class="section-title">运营目标</h4>
              <div class="form-grid">
                <div class="form-group">
                  <label class="form-label">服务费目标</label>
                  <div class="input-with-unit">
                    <input
                      v-model.number="goalForm.operations_goals.service_fee.target"
                      type="number"
                      class="form-input"
                      placeholder="请输入目标金额"
                      min="0"
                      step="1000"
                    />
                    <span class="input-unit">元</span>
                  </div>
                  <div class="weight-input">
                    <label class="weight-label">权重:</label>
                    <input
                      v-model.number="goalForm.operations_goals.service_fee.weight"
                      type="number"
                      class="weight-field"
                      min="0"
                      max="100"
                    />
                    <span class="weight-unit">%</span>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">返点目标</label>
                  <div class="input-with-unit">
                    <input
                      v-model.number="goalForm.operations_goals.rebate.target"
                      type="number"
                      class="form-input"
                      placeholder="请输入目标金额"
                      min="0"
                      step="1000"
                    />
                    <span class="input-unit">元</span>
                  </div>
                  <div class="weight-input">
                    <label class="weight-label">权重:</label>
                    <input
                      v-model.number="goalForm.operations_goals.rebate.weight"
                      type="number"
                      class="weight-field"
                      min="0"
                      max="100"
                    />
                    <span class="weight-unit">%</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 模板选择 -->
            <div class="form-section">
              <h4 class="section-title">快速设置</h4>
              <div class="template-selection">
                <label class="form-label">选择模板:</label>
                <select v-model="selectedTemplate" @change="applyTemplate" class="form-select">
                  <option value="">请选择模板</option>
                  <option
                    v-for="template in availableTemplates"
                    :key="template.id"
                    :value="template.id"
                  >
                    {{ template.name }} (使用{{ template.usage_count }}次)
                  </option>
                </select>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn--secondary" @click="closeGoalModal">
                取消
              </button>
              <button type="submit" class="btn btn--primary" :disabled="!isFormValid">
                {{ isEditing ? '更新' : '创建' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 模板管理弹窗 -->
    <div v-if="showTemplateModal" class="modal-overlay" @click="closeTemplateModal">
      <div class="modal-container modal-container--medium" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">模板管理</h3>
          <div class="modal-header-actions">
            <button class="action-btn action-btn--primary" @click="createTemplate">
              <Plus :size="16" />
              新建模板
            </button>
            <button class="modal-close" @click="closeTemplateModal">
              <X :size="20" />
            </button>
          </div>
        </div>
        <div class="modal-content">
          <div class="template-list">
            <div v-for="template in templates" :key="template.id" class="template-item">
              <div class="template-info">
                <div class="template-name">{{ template.name }}</div>
                <div class="template-meta">
                  <span class="template-type">{{ getEmployeeTypeText(template.employee_type) }}</span>
                  <span class="template-usage">使用{{ template.usage_count }}次</span>
                </div>
                <div class="template-description">{{ template.description }}</div>
              </div>
              <div class="template-actions">
                <button
                  class="action-btn-small action-btn-small--primary"
                  @click="editTemplate(template)"
                  title="编辑"
                >
                  <Edit :size="14" />
                </button>
                <button
                  class="action-btn-small action-btn-small--danger"
                  @click="deleteTemplate(template)"
                  title="删除"
                >
                  <Trash2 :size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import {
  Plus,
  Search,
  Download,
  Settings,
  Users,
  Eye,
  Edit,
  Copy,
  Trash2,
  X
} from 'lucide-vue-next'
import { allEmployeeGoals, mockGoalTemplates, mockDepartments, allEmployees } from '@/mock/departments'
import type { EmployeeGoal, GoalTemplate, Department, Employee } from '@/types/departments'

// 响应式数据
const currentPage = ref(1)
const pageSize = ref(10)
const goals = ref<EmployeeGoal[]>([])
const templates = ref<GoalTemplate[]>([])
const departments = ref<Department[]>([])
const employees = ref<Employee[]>([])
const showGoalModal = ref(false)
const showTemplateModal = ref(false)
const isEditing = ref(false)
const selectedTemplate = ref('')

// 筛选条件
const filters = reactive({
  periodType: '',
  departmentId: '',
  employeeType: '',
  status: '',
  startDate: '',
  endDate: '',
  keyword: ''
})

// 目标表单
const goalForm = reactive({
  id: 0,
  employee_id: 0,
  period: '',
  period_type: '' as 'monthly' | 'quarterly' | 'yearly' | '',
  employee_type: '' as 'sales' | 'operations' | '',
  sales_goals: {
    new_service_fee: { target: 0, weight: 40 },
    new_orders: { target: 0, weight: 30 },
    new_customers: { target: 0, weight: 30 }
  },
  operations_goals: {
    service_fee: { target: 0, weight: 60 },
    rebate: { target: 0, weight: 40 }
  },
  status: 'active' as 'active' | 'completed' | 'cancelled'
})

// 计算属性
const filteredGoals = computed(() => {
  let result = [...goals.value]

  if (filters.periodType) {
    result = result.filter(g => g.period_type === filters.periodType)
  }

  if (filters.departmentId) {
    result = result.filter(g => g.department_id === parseInt(filters.departmentId))
  }

  if (filters.employeeType) {
    result = result.filter(g => g.employee_type === filters.employeeType)
  }

  if (filters.status) {
    result = result.filter(g => g.status === filters.status)
  }

  if (filters.startDate) {
    result = result.filter(g => g.created_at >= filters.startDate)
  }

  if (filters.endDate) {
    result = result.filter(g => g.created_at <= filters.endDate)
  }

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(g =>
      g.employee_name.toLowerCase().includes(keyword)
    )
  }

  return result
})

const paginatedGoals = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredGoals.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredGoals.value.length / pageSize.value)
})

const availableTemplates = computed(() => {
  if (goalForm.employee_type) {
    return templates.value.filter(t => t.employee_type === goalForm.employee_type)
  }
  return templates.value
})

const isFormValid = computed(() => {
  return goalForm.employee_id > 0 &&
         goalForm.period.trim() !== '' &&
         goalForm.period_type !== '' &&
         goalForm.employee_type !== '' &&
         (goalForm.employee_type === 'sales' || goalForm.employee_type === 'operations')
})

// 生命周期
onMounted(() => {
  loadGoals()
  loadTemplates()
  loadDepartments()
  loadEmployees()
})

// 方法
const loadGoals = () => {
  goals.value = allEmployeeGoals
}

const loadTemplates = () => {
  templates.value = mockGoalTemplates
}

const loadDepartments = () => {
  departments.value = mockDepartments
}

const loadEmployees = () => {
  employees.value = allEmployees
}

const handleFilterChange = () => {
  currentPage.value = 1
}

const createGoal = () => {
  resetGoalForm()
  isEditing.value = false
  showGoalModal.value = true
}

const editGoal = (goal: EmployeeGoal) => {
  Object.assign(goalForm, {
    id: goal.id,
    employee_id: goal.employee_id,
    period: goal.period,
    period_type: goal.period_type,
    employee_type: goal.employee_type,
    sales_goals: goal.sales_goals || {
      new_service_fee: { target: 0, weight: 40 },
      new_orders: { target: 0, weight: 30 },
      new_customers: { target: 0, weight: 30 }
    },
    operations_goals: goal.operations_goals || {
      service_fee: { target: 0, weight: 60 },
      rebate: { target: 0, weight: 40 }
    },
    status: goal.status
  })
  isEditing.value = true
  showGoalModal.value = true
}

const viewGoal = (goal: EmployeeGoal) => {
  alert(`查看目标详情: ${goal.employee_name}`)
}

const copyGoal = (goal: EmployeeGoal) => {
  const { id, ...newGoal } = goal
  newGoal.period = new Date().toISOString().slice(0, 7) // 当前月份
  newGoal.created_at = new Date().toISOString().split('T')[0]
  newGoal.updated_at = new Date().toISOString().split('T')[0]

  Object.assign(goalForm, {
    ...newGoal,
    id: 0 // 重置ID为0表示新建
  })
  isEditing.value = false
  showGoalModal.value = true
}

const deleteGoal = (goal: EmployeeGoal) => {
  if (confirm(`确定要删除"${goal.employee_name}"的目标设置吗？`)) {
    goals.value = goals.value.filter(g => g.id !== goal.id)
    alert('目标删除成功！')
  }
}

const submitGoal = () => {
  if (!isFormValid.value || goalForm.employee_type === '') return

  if (isEditing.value) {
    // 更新目标
    const index = goals.value.findIndex(g => g.id === goalForm.id)
    if (index !== -1) {
      const employee = employees.value.find(e => e.id === goalForm.employee_id)
      goals.value[index] = {
        ...goals.value[index],
        employee_id: goalForm.employee_id,
        employee_name: employee?.name || '',
        department_id: employee?.department_id || 0,
        department_name: employee?.department_name || '',
        period: goalForm.period,
        period_type: goalForm.period_type as 'monthly' | 'quarterly' | 'yearly',
        employee_type: goalForm.employee_type as 'sales' | 'operations',
        sales_goals: goalForm.employee_type === 'sales' ? goalForm.sales_goals : undefined,
        operations_goals: goalForm.employee_type === 'operations' ? goalForm.operations_goals : undefined,
        status: goalForm.status,
        updated_at: new Date().toISOString().split('T')[0]
      }
      alert('目标更新成功！')
    }
  } else {
    // 创建目标
    const newId = Math.max(...goals.value.map(g => g.id)) + 1
    const employee = employees.value.find(e => e.id === goalForm.employee_id)
    const newGoal: EmployeeGoal = {
      id: newId,
      employee_id: goalForm.employee_id,
      employee_name: employee?.name || '',
      department_id: employee?.department_id || 0,
      department_name: employee?.department_name || '',
      period: goalForm.period,
      period_type: goalForm.period_type as 'monthly' | 'quarterly' | 'yearly',
      employee_type: goalForm.employee_type as 'sales' | 'operations',
      sales_goals: goalForm.employee_type === 'sales' ? goalForm.sales_goals : undefined,
      operations_goals: goalForm.employee_type === 'operations' ? goalForm.operations_goals : undefined,
      status: goalForm.status,
      created_by: 1, // 当前用户ID
      created_by_name: '管理员',
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    }
    goals.value.push(newGoal)
    alert('目标创建成功！')
  }

  closeGoalModal()
}

const closeGoalModal = () => {
  showGoalModal.value = false
  resetGoalForm()
  selectedTemplate.value = ''
}

const resetGoalForm = () => {
  Object.assign(goalForm, {
    id: 0,
    employee_id: 0,
    period: '',
    period_type: '',
    employee_type: '',
    sales_goals: {
      new_service_fee: { target: 0, weight: 40 },
      new_orders: { target: 0, weight: 30 },
      new_customers: { target: 0, weight: 30 }
    },
    operations_goals: {
      service_fee: { target: 0, weight: 60 },
      rebate: { target: 0, weight: 40 }
    },
    status: 'active'
  })
}

const onEmployeeChange = () => {
  const employee = employees.value.find(e => e.id === goalForm.employee_id)
  if (employee) {
    // 根据员工职位自动判断类型
    if (employee.position.includes('销售')) {
      goalForm.employee_type = 'sales'
    } else if (employee.position.includes('运营')) {
      goalForm.employee_type = 'operations'
    }
  }
}

const onEmployeeTypeChange = () => {
  selectedTemplate.value = ''
}

const applyTemplate = () => {
  if (!selectedTemplate.value) return

  const template = templates.value.find(t => t.id === parseInt(selectedTemplate.value))
  if (template) {
    if (template.template_data.sales_goals) {
      Object.assign(goalForm.sales_goals, template.template_data.sales_goals)
    }
    if (template.template_data.operations_goals) {
      Object.assign(goalForm.operations_goals, template.template_data.operations_goals)
    }
  }
}

const manageTemplates = () => {
  showTemplateModal.value = true
}

const closeTemplateModal = () => {
  showTemplateModal.value = false
}

const createTemplate = () => {
  alert('新建模板功能开发中...')
}

const editTemplate = (template: GoalTemplate) => {
  alert(`编辑模板: ${template.name}`)
}

const deleteTemplate = (template: GoalTemplate) => {
  if (confirm(`确定要删除模板"${template.name}"吗？`)) {
    templates.value = templates.value.filter(t => t.id !== template.id)
    alert('模板删除成功！')
  }
}

const batchSetGoals = () => {
  alert('批量设置功能开发中...')
}

const exportData = () => {
  alert('导出功能开发中...')
}

const getEmployeeId = (employeeId: number): string => {
  const employee = employees.value.find(e => e.id === employeeId)
  return employee?.employee_id || ''
}

const getPeriodTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    monthly: '月度',
    quarterly: '季度',
    yearly: '年度'
  }
  return typeMap[type] || type
}

const getEmployeeTypeClass = (type: string): string => {
  const typeMap: Record<string, string> = {
    sales: 'type--sales',
    operations: 'type--operations'
  }
  return typeMap[type] || 'type--default'
}

const getEmployeeTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    sales: '销售人员',
    operations: '运营人员'
  }
  return typeMap[type] || type
}

const getStatusClass = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: 'status-badge--success',
    completed: 'status-badge--info',
    cancelled: 'status-badge--danger'
  }
  return statusMap[status] || 'status-badge--secondary'
}

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}
</script>

<style scoped>
.goals-panel {
  padding: 24px;
  background: var(--color-background);
  min-height: 100vh;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.header-content h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
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
  background: var(--color-primary-dark, #1d4ed8);
}

.action-btn--secondary {
  background: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.action-btn--secondary:hover {
  background: var(--color-background-hover);
  border-color: var(--color-primary);
}

.goals-content {
  background: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
}

/* 筛选区域 */
.filter-section {
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 150px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.filter-select,
.filter-input {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background: var(--color-background);
  transition: border-color 0.2s ease;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-separator {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.search-input-wrapper {
  position: relative;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 40px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* 目标表格 */
.goals-table-section {
  background: var(--color-surface);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.table-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-header__right {
  display: flex;
  gap: 12px;
}

.table-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.record-count {
  font-size: 14px;
  color: var(--color-text-secondary);
  background: var(--color-background);
  padding: 4px 8px;
  border-radius: 4px;
}

.table-wrapper {
  overflow-x: auto;
}

.goals-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  min-width: 1200px;
}

.goals-table th {
  background: var(--color-background);
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 14px;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.goals-table td {
  padding: 16px 12px;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 14px;
  color: var(--color-text-primary);
  vertical-align: top;
}

.goal-row:hover {
  background: var(--color-background);
}

.employee-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.employee-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.employee-id {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-family: monospace;
}

.period-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.period-text {
  font-weight: 500;
  color: var(--color-text-primary);
}

.period-type {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.type-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.type--sales {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.type--operations {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.type--default {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.goals-summary {
  max-width: 300px;
}

.goal-items {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.goal-item {
  font-size: 12px;
  color: var(--color-text-primary);
  background: var(--color-background);
  padding: 4px 8px;
  border-radius: 4px;
  border-left: 3px solid var(--color-primary);
}

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.status-badge--success {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-badge--info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge--danger {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.status-badge--secondary {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 4px;
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

/* 分页 */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
}

.pagination-info {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-primary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-current {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

/* 弹窗样式 */
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
  z-index: var(--z-modal, 1040);
}

.modal-container {
  background: var(--color-surface);
  border-radius: 8px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-container--large {
  width: 900px;
  max-width: 95vw;
}

.modal-container--medium {
  width: 700px;
  max-width: 90vw;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
}

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* 表单样式 */
.goal-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background: var(--color-background);
  border-radius: 8px;
  padding: 20px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-input,
.form-select {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.input-with-unit {
  position: relative;
  display: flex;
  align-items: center;
}

.input-unit {
  position: absolute;
  right: 12px;
  font-size: 14px;
  color: var(--color-text-secondary);
  pointer-events: none;
}

.input-with-unit .form-input {
  padding-right: 40px;
}

.weight-input {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.weight-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  min-width: 40px;
}

.weight-field {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 12px;
  text-align: center;
}

.weight-unit {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.template-selection {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 80px;
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover:not(:disabled) {
  background: var(--color-primary-dark, #1d4ed8);
}

.btn--primary:disabled {
  background: var(--color-border);
  color: var(--color-text-secondary);
  cursor: not-allowed;
}

.btn--secondary {
  background: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn--secondary:hover {
  background: var(--color-background-hover);
  border-color: var(--color-primary);
}

/* 模板列表样式 */
.template-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.template-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.template-item:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.template-info {
  flex: 1;
}

.template-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: 8px;
}

.template-meta {
  display: flex;
  gap: 12px;
  margin-bottom: 8px;
}

.template-type {
  font-size: 12px;
  padding: 2px 6px;
  background: var(--color-primary);
  color: white;
  border-radius: 4px;
}

.template-usage {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.template-description {
  font-size: 14px;
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.template-actions {
  display: flex;
  gap: 8px;
  margin-left: 16px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .goals-panel {
    padding: 16px;
  }

  .panel-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .filter-row {
    flex-direction: column;
    gap: 12px;
  }

  .filter-group {
    min-width: auto;
  }

  .search-input-wrapper {
    min-width: auto;
  }

  .table-wrapper {
    overflow-x: scroll;
  }

  .goals-table {
    min-width: 1000px;
  }

  .pagination-section {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-container--large,
  .modal-container--medium {
    width: 95vw;
    margin: 20px;
  }

  .modal-header-actions {
    flex-direction: column;
    gap: 8px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }

  .template-item {
    flex-direction: column;
    gap: 12px;
  }

  .template-actions {
    margin-left: 0;
    justify-content: flex-start;
  }
}
</style>
