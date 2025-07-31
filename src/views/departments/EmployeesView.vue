<template>
  <div class="employees-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3>员工管理</h3>
        <p>管理员工基本信息、部门分配和职务管理</p>
      </div>
      <div class="header-actions">
        <button class="action-btn action-btn--secondary" @click="exportData">
          <Download :size="16" />
          导出数据
        </button>
        <button class="action-btn action-btn--secondary" @click="importData">
          <Upload :size="16" />
          批量导入
        </button>
        <button class="action-btn action-btn--primary" @click="createEmployee">
          <Plus :size="16" />
          新建员工
        </button>
      </div>
    </div>

    <div class="employees-content">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-row">
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
            <label class="filter-label">职务:</label>
            <select v-model="filters.position" @change="handleFilterChange" class="filter-select">
              <option value="">全部职务</option>
              <option v-for="position in positions" :key="position" :value="position">
                {{ position }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">状态:</label>
            <select v-model="filters.status" @change="handleFilterChange" class="filter-select">
              <option value="">全部状态</option>
              <option value="active">在职</option>
              <option value="probation">试用</option>
              <option value="inactive">停用</option>
              <option value="resigned">离职</option>
            </select>
          </div>

          <div class="filter-group">
            <div class="search-input-wrapper">
              <Search :size="20" class="search-icon" />
              <input
                v-model="filters.keyword"
                type="text"
                placeholder="搜索姓名、工号、电话、邮箱"
                class="search-input"
                @input="handleFilterChange"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 员工列表 -->
      <div class="employees-table-section">
        <div class="table-header">
          <div class="table-header__left">
            <h3>员工列表</h3>
            <span class="record-count">共 {{ filteredEmployees.length }} 条记录</span>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="employees-table">
            <thead>
              <tr>
                <th>姓名</th>
                <th>工号</th>
                <th>部门</th>
                <th>职务</th>
                <th>电话</th>
                <th>邮箱</th>
                <th>入职时间</th>
                <th>状态</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="employee in paginatedEmployees" :key="employee.id" class="employee-row">
                <td>
                  <div class="employee-info">
                    <div class="employee-avatar">
                      <img v-if="employee.avatar" :src="employee.avatar" :alt="employee.name" />
                      <div v-else class="avatar-placeholder">
                        {{ employee.name.charAt(0) }}
                      </div>
                    </div>
                    <div class="employee-details">
                      <div class="employee-name">{{ employee.name }}</div>
                      <div class="employee-gender">{{ employee.gender === 'male' ? '男' : '女' }}</div>
                    </div>
                  </div>
                </td>
                <td>{{ employee.employee_id }}</td>
                <td>{{ employee.department_name }}</td>
                <td>{{ employee.position }}</td>
                <td>{{ employee.phone }}</td>
                <td>{{ employee.email }}</td>
                <td>{{ formatDate(employee.hire_date) }}</td>
                <td>
                  <span class="status-badge" :class="getEmployeeStatusClass(employee.status)">
                    {{ getEmployeeStatusText(employee.status) }}
                  </span>
                </td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="action-btn-small action-btn-small--info"
                      @click="viewEmployee(employee)"
                      title="查看详情"
                    >
                      <Eye :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--primary"
                      @click="editEmployee(employee)"
                      title="编辑"
                    >
                      <Edit :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--success"
                      @click="viewPerformance(employee)"
                      title="绩效记录"
                    >
                      <Award :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--danger"
                      @click="deleteEmployee(employee)"
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
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredEmployees.length) }} 条，
            共 {{ filteredEmployees.length }} 条记录
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

    <!-- 新建/编辑员工弹窗 -->
    <div v-if="showEmployeeModal" class="modal-overlay" @click="closeEmployeeModal">
      <div class="modal-container modal-container--large" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditing ? '编辑员工' : '新建员工' }}</h3>
          <button class="modal-close" @click="closeEmployeeModal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-content">
          <div class="employee-form-tabs">
            <div class="tab-headers">
              <button
                v-for="(tab, index) in formTabs"
                :key="tab.key"
                class="tab-header"
                :class="{ 'tab-header--active': activeTab === index }"
                @click="activeTab = index"
              >
                {{ tab.label }}
              </button>
            </div>

            <form @submit.prevent="submitEmployee" class="employee-form">
              <!-- 基本信息 Tab -->
              <div v-show="activeTab === 0" class="tab-content">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">姓名 *</label>
                    <input
                      v-model="employeeForm.name"
                      type="text"
                      class="form-input"
                      placeholder="请输入姓名"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">工号 *</label>
                    <input
                      v-model="employeeForm.employee_id"
                      type="text"
                      class="form-input"
                      placeholder="请输入工号"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">性别</label>
                    <div class="radio-group">
                      <label class="radio-item">
                        <input v-model="employeeForm.gender" type="radio" value="male" />
                        <span class="radio-label">男</span>
                      </label>
                      <label class="radio-item">
                        <input v-model="employeeForm.gender" type="radio" value="female" />
                        <span class="radio-label">女</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-group">
                    <label class="form-label">出生日期</label>
                    <input
                      v-model="employeeForm.birth_date"
                      type="date"
                      class="form-input"
                    />
                  </div>

                  <div class="form-group form-group--full">
                    <label class="form-label">身份证号</label>
                    <input
                      v-model="employeeForm.id_card"
                      type="text"
                      class="form-input"
                      placeholder="请输入身份证号"
                    />
                  </div>
                </div>
              </div>

              <!-- 联系方式 Tab -->
              <div v-show="activeTab === 1" class="tab-content">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">手机号码 *</label>
                    <input
                      v-model="employeeForm.phone"
                      type="tel"
                      class="form-input"
                      placeholder="请输入手机号码"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">邮箱地址 *</label>
                    <input
                      v-model="employeeForm.email"
                      type="email"
                      class="form-input"
                      placeholder="请输入邮箱地址"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">微信号</label>
                    <input
                      v-model="employeeForm.wechat"
                      type="text"
                      class="form-input"
                      placeholder="请输入微信号"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">QQ号</label>
                    <input
                      v-model="employeeForm.qq"
                      type="text"
                      class="form-input"
                      placeholder="请输入QQ号"
                    />
                  </div>

                  <div class="form-group form-group--full">
                    <label class="form-label">联系地址</label>
                    <textarea
                      v-model="employeeForm.address"
                      class="form-textarea"
                      placeholder="请输入联系地址"
                      rows="2"
                    ></textarea>
                  </div>

                  <div class="form-group">
                    <label class="form-label">紧急联系人</label>
                    <input
                      v-model="employeeForm.emergency_contact"
                      type="text"
                      class="form-input"
                      placeholder="请输入紧急联系人"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">紧急联系电话</label>
                    <input
                      v-model="employeeForm.emergency_phone"
                      type="tel"
                      class="form-input"
                      placeholder="请输入紧急联系电话"
                    />
                  </div>
                </div>
              </div>

              <!-- 工作信息 Tab -->
              <div v-show="activeTab === 2" class="tab-content">
                <div class="form-grid">
                  <div class="form-group">
                    <label class="form-label">所属部门 *</label>
                    <select v-model="employeeForm.department_id" class="form-select" required>
                      <option value="">请选择部门</option>
                      <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                        {{ dept.name }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">职务 *</label>
                    <select v-model="employeeForm.position" class="form-select" required>
                      <option value="">请选择职务</option>
                      <option v-for="position in positions" :key="position" :value="position">
                        {{ position }}
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">直属上级</label>
                    <select v-model="employeeForm.supervisor_id" class="form-select">
                      <option value="">请选择直属上级</option>
                      <option
                        v-for="emp in availableSupervisors"
                        :key="emp.id"
                        :value="emp.id"
                      >
                        {{ emp.name }} ({{ emp.position }})
                      </option>
                    </select>
                  </div>

                  <div class="form-group">
                    <label class="form-label">入职日期 *</label>
                    <input
                      v-model="employeeForm.hire_date"
                      type="date"
                      class="form-input"
                      required
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">试用期(月)</label>
                    <input
                      v-model.number="employeeForm.probation_months"
                      type="number"
                      class="form-input"
                      placeholder="请输入试用期月数"
                      min="0"
                      max="12"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">工作地点</label>
                    <input
                      v-model="employeeForm.work_location"
                      type="text"
                      class="form-input"
                      placeholder="请输入工作地点"
                    />
                  </div>

                  <div class="form-group">
                    <label class="form-label">状态</label>
                    <div class="radio-group">
                      <label class="radio-item">
                        <input v-model="employeeForm.status" type="radio" value="active" />
                        <span class="radio-label">在职</span>
                      </label>
                      <label class="radio-item">
                        <input v-model="employeeForm.status" type="radio" value="probation" />
                        <span class="radio-label">试用</span>
                      </label>
                      <label class="radio-item">
                        <input v-model="employeeForm.status" type="radio" value="inactive" />
                        <span class="radio-label">停用</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-group form-group--full">
                    <label class="form-label">备注</label>
                    <textarea
                      v-model="employeeForm.remarks"
                      class="form-textarea"
                      placeholder="请输入备注信息"
                      rows="3"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div class="form-actions">
                <button type="button" class="btn btn--secondary" @click="prevTab" v-if="activeTab > 0">
                  上一步
                </button>
                <button type="button" class="btn btn--secondary" @click="closeEmployeeModal">
                  取消
                </button>
                <button type="button" class="btn btn--primary" @click="nextTab" v-if="activeTab < formTabs.length - 1">
                  下一步
                </button>
                <button type="submit" class="btn btn--primary" v-if="activeTab === formTabs.length - 1" :disabled="!isFormValid">
                  {{ isEditing ? '更新' : '完成' }}
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
import { ref, computed, onMounted, reactive } from 'vue'
import {
  Plus,
  Search,
  Download,
  Upload,
  Eye,
  Edit,
  Award,
  Trash2,
  X
} from 'lucide-vue-next'
import { allEmployees, mockDepartments, mockPositions } from '@/mock/departments'
import type { Employee, Department } from '@/types/departments'

// 响应式数据
const currentPage = ref(1)
const pageSize = ref(10)
const employees = ref<Employee[]>([])
const departments = ref<Department[]>([])
const positions = ref<string[]>([])
const showEmployeeModal = ref(false)
const isEditing = ref(false)
const activeTab = ref(0)

// 筛选条件
const filters = reactive({
  departmentId: '',
  position: '',
  status: '',
  keyword: ''
})

// 表单标签页
const formTabs = [
  { key: 'basic', label: '基本信息' },
  { key: 'contact', label: '联系方式' },
  { key: 'work', label: '工作信息' }
]

// 员工表单
const employeeForm = reactive({
  id: 0,
  name: '',
  employee_id: '',
  gender: 'male' as 'male' | 'female',
  birth_date: '',
  id_card: '',
  phone: '',
  email: '',
  wechat: '',
  qq: '',
  address: '',
  emergency_contact: '',
  emergency_phone: '',
  department_id: 0,
  position: '',
  supervisor_id: 0,
  hire_date: '',
  probation_months: 3,
  work_location: '',
  status: 'active' as 'active' | 'probation' | 'inactive' | 'resigned',
  remarks: ''
})

// 计算属性
const filteredEmployees = computed(() => {
  let result = [...employees.value]

  if (filters.departmentId) {
    result = result.filter(emp => emp.department_id === parseInt(filters.departmentId))
  }

  if (filters.position) {
    result = result.filter(emp => emp.position === filters.position)
  }

  if (filters.status) {
    result = result.filter(emp => emp.status === filters.status)
  }

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(emp =>
      emp.name.toLowerCase().includes(keyword) ||
      emp.employee_id.toLowerCase().includes(keyword) ||
      emp.phone.includes(keyword) ||
      emp.email.toLowerCase().includes(keyword)
    )
  }

  return result
})

const paginatedEmployees = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredEmployees.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredEmployees.value.length / pageSize.value)
})

const availableSupervisors = computed(() => {
  if (employeeForm.department_id) {
    return employees.value.filter(emp =>
      emp.department_id === employeeForm.department_id &&
      emp.id !== employeeForm.id
    )
  }
  return employees.value.filter(emp => emp.id !== employeeForm.id)
})

const isFormValid = computed(() => {
  return employeeForm.name.trim() !== '' &&
         employeeForm.employee_id.trim() !== '' &&
         employeeForm.phone.trim() !== '' &&
         employeeForm.email.trim() !== '' &&
         employeeForm.department_id > 0 &&
         employeeForm.position.trim() !== '' &&
         employeeForm.hire_date.trim() !== ''
})

// 生命周期
onMounted(() => {
  loadEmployees()
  loadDepartments()
  loadPositions()
})

// 方法
const loadEmployees = () => {
  employees.value = allEmployees
}

const loadDepartments = () => {
  departments.value = mockDepartments
}

const loadPositions = () => {
  positions.value = mockPositions
}

const handleFilterChange = () => {
  currentPage.value = 1
}

const createEmployee = () => {
  resetForm()
  isEditing.value = false
  activeTab.value = 0
  showEmployeeModal.value = true
}

const editEmployee = (employee: Employee) => {
  Object.assign(employeeForm, {
    id: employee.id,
    name: employee.name,
    employee_id: employee.employee_id,
    gender: employee.gender,
    birth_date: employee.birth_date,
    id_card: employee.id_card,
    phone: employee.phone,
    email: employee.email,
    wechat: employee.wechat || '',
    qq: employee.qq || '',
    address: employee.address || '',
    emergency_contact: employee.emergency_contact || '',
    emergency_phone: employee.emergency_phone || '',
    department_id: employee.department_id,
    position: employee.position,
    supervisor_id: employee.supervisor_id || 0,
    hire_date: employee.hire_date,
    probation_months: employee.probation_months,
    work_location: employee.work_location,
    status: employee.status,
    remarks: employee.remarks || ''
  })
  isEditing.value = true
  activeTab.value = 0
  showEmployeeModal.value = true
}

const viewEmployee = (employee: Employee) => {
  alert(`查看员工详情: ${employee.name}`)
}

const viewPerformance = (employee: Employee) => {
  alert(`查看绩效记录: ${employee.name}`)
}

const deleteEmployee = (employee: Employee) => {
  if (confirm(`确定要删除员工"${employee.name}"吗？`)) {
    employees.value = employees.value.filter(e => e.id !== employee.id)
    alert('员工删除成功！')
  }
}

const submitEmployee = () => {
  if (!isFormValid.value) return

  if (isEditing.value) {
    // 更新员工
    const index = employees.value.findIndex(e => e.id === employeeForm.id)
    if (index !== -1) {
      const departmentName = departments.value.find(d => d.id === employeeForm.department_id)?.name || ''
      const supervisorName = employees.value.find(e => e.id === employeeForm.supervisor_id)?.name || ''

      employees.value[index] = {
        ...employees.value[index],
        name: employeeForm.name,
        employee_id: employeeForm.employee_id,
        gender: employeeForm.gender,
        birth_date: employeeForm.birth_date,
        id_card: employeeForm.id_card,
        phone: employeeForm.phone,
        email: employeeForm.email,
        wechat: employeeForm.wechat,
        qq: employeeForm.qq,
        address: employeeForm.address,
        emergency_contact: employeeForm.emergency_contact,
        emergency_phone: employeeForm.emergency_phone,
        department_id: employeeForm.department_id,
        department_name: departmentName,
        position: employeeForm.position,
        supervisor_id: employeeForm.supervisor_id || undefined,
        supervisor_name: supervisorName || undefined,
        hire_date: employeeForm.hire_date,
        probation_months: employeeForm.probation_months,
        work_location: employeeForm.work_location,
        status: employeeForm.status,
        remarks: employeeForm.remarks,
        updated_at: new Date().toISOString().split('T')[0]
      }
      alert('员工更新成功！')
    }
  } else {
    // 创建员工
    const newId = Math.max(...employees.value.map(e => e.id)) + 1
    const departmentName = departments.value.find(d => d.id === employeeForm.department_id)?.name || ''
    const supervisorName = employees.value.find(e => e.id === employeeForm.supervisor_id)?.name || ''

    const newEmployee: Employee = {
      id: newId,
      name: employeeForm.name,
      employee_id: employeeForm.employee_id,
      gender: employeeForm.gender,
      birth_date: employeeForm.birth_date,
      id_card: employeeForm.id_card,
      phone: employeeForm.phone,
      email: employeeForm.email,
      wechat: employeeForm.wechat,
      qq: employeeForm.qq,
      address: employeeForm.address,
      emergency_contact: employeeForm.emergency_contact,
      emergency_phone: employeeForm.emergency_phone,
      department_id: employeeForm.department_id,
      department_name: departmentName,
      position: employeeForm.position,
      supervisor_id: employeeForm.supervisor_id || undefined,
      supervisor_name: supervisorName || undefined,
      hire_date: employeeForm.hire_date,
      probation_months: employeeForm.probation_months,
      work_location: employeeForm.work_location,
      status: employeeForm.status,
      remarks: employeeForm.remarks,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    }
    employees.value.push(newEmployee)
    alert('员工创建成功！')
  }

  closeEmployeeModal()
}

const closeEmployeeModal = () => {
  showEmployeeModal.value = false
  resetForm()
  activeTab.value = 0
}

const resetForm = () => {
  Object.assign(employeeForm, {
    id: 0,
    name: '',
    employee_id: '',
    gender: 'male',
    birth_date: '',
    id_card: '',
    phone: '',
    email: '',
    wechat: '',
    qq: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    department_id: 0,
    position: '',
    supervisor_id: 0,
    hire_date: '',
    probation_months: 3,
    work_location: '',
    status: 'active',
    remarks: ''
  })
}

const nextTab = () => {
  if (activeTab.value < formTabs.length - 1) {
    activeTab.value++
  }
}

const prevTab = () => {
  if (activeTab.value > 0) {
    activeTab.value--
  }
}

const exportData = () => {
  alert('导出功能开发中...')
}

const importData = () => {
  alert('导入功能开发中...')
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const getEmployeeStatusClass = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: 'status-badge--success',
    probation: 'status-badge--warning',
    inactive: 'status-badge--danger',
    resigned: 'status-badge--secondary'
  }
  return statusMap[status] || 'status-badge--secondary'
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
.employees-panel {
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

.employees-content {
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

.filter-select {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background: var(--color-background);
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
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

/* 员工表格 */
.employees-table-section {
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

.employees-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
}

.employees-table th {
  background: var(--color-background);
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 14px;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.employees-table td {
  padding: 16px 12px;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 14px;
  color: var(--color-text-primary);
}

.employee-row:hover {
  background: var(--color-background);
}

.employee-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.employee-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  overflow: hidden;
  flex-shrink: 0;
}

.employee-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-placeholder {
  width: 100%;
  height: 100%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.employee-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.employee-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.employee-gender {
  font-size: 12px;
  color: var(--color-text-secondary);
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

.status-badge--warning {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
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
  width: 800px;
  max-width: 95vw;
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

/* 表单标签页 */
.employee-form-tabs {
  display: flex;
  flex-direction: column;
  height: 100%;
}

.tab-headers {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 24px;
}

.tab-header {
  padding: 12px 24px;
  border: none;
  background: none;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition: all 0.2s ease;
}

.tab-header--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-header:hover {
  color: var(--color-primary);
}

.employee-form {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.tab-content {
  flex: 1;
  margin-bottom: 24px;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.form-input,
.form-select,
.form-textarea {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 60px;
}

.radio-group {
  display: flex;
  gap: 16px;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.radio-item input[type="radio"] {
  margin: 0;
}

.radio-label {
  font-size: 14px;
  color: var(--color-text-primary);
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--color-border);
  margin-top: auto;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .employees-panel {
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

  .employees-table {
    min-width: 800px;
  }

  .pagination-section {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .modal-container--large {
    width: 95vw;
    margin: 20px;
  }

  .tab-headers {
    overflow-x: auto;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
