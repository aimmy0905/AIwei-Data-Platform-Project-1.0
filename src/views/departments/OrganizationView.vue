<template>
  <div class="organization-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3>组织架构</h3>
        <p>管理公司组织架构和部门层级关系</p>
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
        <button class="action-btn action-btn--primary" @click="createDepartment">
          <Plus :size="16" />
          新建部门
        </button>
      </div>
    </div>

    <div class="organization-content">
      <!-- 搜索区域 -->
      <div class="search-section">
        <div class="search-input-wrapper">
          <Search :size="20" class="search-icon" />
          <input
            v-model="searchKeyword"
            type="text"
            placeholder="请输入部门名称或部门代码"
            class="search-input"
            @input="handleSearch"
          />
        </div>
      </div>

      <!-- 部门树形结构 -->
      <div class="department-tree-section">
        <div class="tree-container">
          <div v-if="filteredDepartments.length === 0" class="no-data">
            <div class="no-data-icon">🏢</div>
            <div class="no-data-text">暂无部门数据</div>
          </div>
          <div v-else class="department-tree">
            <DepartmentTreeNode
              v-for="department in filteredDepartments"
              :key="department.id"
              :department="department"
              :level="0"
              :employees="employees"
              @view="viewDepartment"
              @edit="editDepartment"
              @delete="deleteDepartment"
              @add-child="addChildDepartment"
              @add-employee="addEmployeeToDepartment"
              @edit-employee="editEmployeeInDepartment"
              @remove-employee="removeEmployeeFromDepartment"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 新建/编辑部门弹窗 -->
    <div v-if="showDepartmentModal" class="modal-overlay" @click="closeDepartmentModal">
      <div class="modal-container modal-container--medium" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditing ? '编辑部门' : '新建部门' }}</h3>
          <button class="modal-close" @click="closeDepartmentModal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="submitDepartment" class="department-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">部门名称 *</label>
                <input
                  v-model="departmentForm.name"
                  type="text"
                  class="form-input"
                  placeholder="请输入部门名称"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">部门代码 *</label>
                <input
                  v-model="departmentForm.code"
                  type="text"
                  class="form-input"
                  placeholder="请输入部门代码"
                  required
                />
              </div>

              <div class="form-group">
                <label class="form-label">上级部门 *</label>
                <select v-model="departmentForm.parent_id" class="form-select" required>
                  <option value="">请选择上级部门</option>
                  <option
                    v-for="dept in availableParentDepartments"
                    :key="dept.id"
                    :value="dept.id"
                  >
                    {{ dept.name }}
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">部门负责人</label>
                <select v-model="departmentForm.manager_id" class="form-select">
                  <option value="">请选择部门负责人</option>
                  <option
                    v-for="employee in employees"
                    :key="employee.id"
                    :value="employee.id"
                  >
                    {{ employee.name }} ({{ employee.position }})
                  </option>
                </select>
              </div>

              <div class="form-group">
                <label class="form-label">排序号</label>
                <input
                  v-model.number="departmentForm.sort_order"
                  type="number"
                  class="form-input"
                  placeholder="请输入排序号"
                  min="1"
                />
              </div>

              <div class="form-group">
                <label class="form-label">状态</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input
                      v-model="departmentForm.status"
                      type="radio"
                      value="active"
                    />
                    <span class="radio-label">启用</span>
                  </label>
                  <label class="radio-item">
                    <input
                      v-model="departmentForm.status"
                      type="radio"
                      value="inactive"
                    />
                    <span class="radio-label">停用</span>
                  </label>
                </div>
              </div>

              <div class="form-group form-group--full">
                <label class="form-label">部门描述</label>
                <textarea
                  v-model="departmentForm.description"
                  class="form-textarea"
                  placeholder="请输入部门描述"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn--secondary" @click="closeDepartmentModal">
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

    <!-- 部门详情弹窗 -->
    <div v-if="showDetailModal && selectedDepartment" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-container modal-container--large" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedDepartment.name }} - 部门详情</h3>
          <div class="modal-header-actions">
            <button class="action-btn action-btn--primary" @click="editDepartment(selectedDepartment)">
              <Edit :size="16" />
              编辑部门
            </button>
            <button class="modal-close" @click="closeDetailModal">
              <X :size="20" />
            </button>
          </div>
        </div>
        <div class="modal-content">
          <div class="department-detail">
            <!-- 基本信息 -->
            <div class="detail-section">
              <h4 class="section-title">基本信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">部门名称</span>
                  <span class="info-value">{{ selectedDepartment.name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">部门代码</span>
                  <span class="info-value">{{ selectedDepartment.code }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">上级部门</span>
                  <span class="info-value">{{ getParentDepartmentName(selectedDepartment.parent_id) || '无' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">部门负责人</span>
                  <span class="info-value">{{ selectedDepartment.manager_name || '未设置' }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">员工数量</span>
                  <span class="info-value">{{ selectedDepartment.employee_count }} 人</span>
                </div>
                <div class="info-item">
                  <span class="info-label">状态</span>
                  <span class="info-value">
                    <span class="status-badge" :class="selectedDepartment.status === 'active' ? 'status-badge--success' : 'status-badge--danger'">
                      {{ selectedDepartment.status === 'active' ? '启用' : '停用' }}
                    </span>
                  </span>
                </div>
                <div class="info-item">
                  <span class="info-label">创建时间</span>
                  <span class="info-value">{{ formatDate(selectedDepartment.created_at) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">更新时间</span>
                  <span class="info-value">{{ formatDate(selectedDepartment.updated_at) }}</span>
                </div>
              </div>
              <div v-if="selectedDepartment.description" class="info-item info-item--full">
                <span class="info-label">部门描述</span>
                <span class="info-value">{{ selectedDepartment.description }}</span>
              </div>
            </div>

            <!-- 子部门 -->
            <div v-if="selectedDepartment.children && selectedDepartment.children.length > 0" class="detail-section">
              <h4 class="section-title">子部门 ({{ selectedDepartment.children.length }}个)</h4>
              <div class="children-grid">
                <div
                  v-for="child in selectedDepartment.children"
                  :key="child.id"
                  class="child-card"
                  @click="viewDepartment(child)"
                >
                  <div class="child-name">{{ child.name }}</div>
                  <div class="child-info">
                    <span>{{ child.employee_count }} 人</span>
                    <span v-if="child.manager_name">负责人：{{ child.manager_name }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 部门员工 -->
            <div class="detail-section">
              <div class="section-header">
                <h4 class="section-title">部门员工 ({{ departmentEmployees.length }}人)</h4>
                <button class="action-btn action-btn--primary" @click="addEmployeeToDepartment">
                  <Plus :size="16" />
                  添加员工
                </button>
              </div>
              <div v-if="departmentEmployees.length === 0" class="no-employees">
                暂无员工数据
              </div>
              <div v-else class="employees-table">
                <table>
                  <thead>
                    <tr>
                      <th>姓名</th>
                      <th>工号</th>
                      <th>职务</th>
                      <th>联系方式</th>
                      <th>入职时间</th>
                      <th>状态</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="employee in departmentEmployees" :key="employee.id">
                      <td>{{ employee.name }}</td>
                      <td>{{ employee.employee_id }}</td>
                      <td>{{ employee.position }}</td>
                      <td>{{ employee.phone }}</td>
                      <td>{{ formatDate(employee.hire_date) }}</td>
                      <td>
                        <span class="status-badge" :class="getEmployeeStatusClass(employee.status)">
                          {{ getEmployeeStatusText(employee.status) }}
                        </span>
                      </td>
                      <td>
                        <div class="employee-actions">
                          <button
                            class="action-btn-small action-btn-small--primary"
                            @click="editEmployeeInDepartment(employee)"
                            title="编辑员工"
                          >
                            <Edit :size="14" />
                          </button>
                          <button
                            class="action-btn-small action-btn-small--danger"
                            @click="removeEmployeeFromDepartment(employee)"
                            title="移除员工"
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
          </div>
        </div>
      </div>
    </div>

    <!-- 员工管理弹窗 -->
    <div v-if="showEmployeeModal" class="modal-overlay" @click="closeEmployeeModal">
      <div class="modal-container modal-container--medium" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ isEditingEmployee ? '编辑员工' : '添加员工' }}</h3>
          <button class="modal-close" @click="closeEmployeeModal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="submitEmployee" class="employee-form">
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
                <label class="form-label">职务 *</label>
                <select v-model="employeeForm.position" class="form-select" required>
                  <option value="">请选择职务</option>
                  <option value="销售经理">销售经理</option>
                  <option value="销售主管">销售主管</option>
                  <option value="销售专员">销售专员</option>
                  <option value="销售助理">销售助理</option>
                </select>
              </div>

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
                <label class="form-label">入职日期 *</label>
                <input
                  v-model="employeeForm.hire_date"
                  type="date"
                  class="form-input"
                  required
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
                </div>
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn--secondary" @click="closeEmployeeModal">
                取消
              </button>
              <button type="submit" class="btn btn--primary" :disabled="!isEmployeeFormValid">
                {{ isEditingEmployee ? '更新' : '添加' }}
              </button>
            </div>
          </form>
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
  Edit,
  Trash2,
  X
} from 'lucide-vue-next'
import { mockDepartments, allEmployees, buildDepartmentTree } from '@/mock/departments'
import type { Department, Employee } from '@/types/departments'
import DepartmentTreeNode from '@/components/departments/DepartmentTreeNode.vue'

// 响应式数据
const searchKeyword = ref('')
const departments = ref<Department[]>([])
const employees = ref<Employee[]>([])
const showDepartmentModal = ref(false)
const showDetailModal = ref(false)
const showEmployeeModal = ref(false)
const isEditing = ref(false)
const isEditingEmployee = ref(false)
const selectedDepartment = ref<Department | null>(null)

// 部门表单
const departmentForm = reactive({
  id: 0,
  name: '',
  code: '',
  parent_id: null as number | null,
  manager_id: null as number | null,
  description: '',
  sort_order: 1,
  status: 'active' as 'active' | 'inactive'
})

// 员工表单
const employeeForm = reactive({
  id: 0,
  name: '',
  employee_id: '',
  gender: 'male' as 'male' | 'female',
  position: '',
  phone: '',
  email: '',
  hire_date: '',
  status: 'active' as 'active' | 'probation' | 'inactive'
})

// 计算属性
const departmentTree = computed(() => {
  return buildDepartmentTree(departments.value)
})

const filteredDepartments = computed(() => {
  if (!searchKeyword.value) {
    return departmentTree.value
  }

  const keyword = searchKeyword.value.toLowerCase()
  const filterDepartments = (depts: Department[]): Department[] => {
    return depts.filter(dept => {
      const matchesKeyword = dept.name.toLowerCase().includes(keyword) ||
                           dept.code.toLowerCase().includes(keyword)
      const hasMatchingChildren = dept.children && filterDepartments(dept.children).length > 0

      if (matchesKeyword || hasMatchingChildren) {
        return {
          ...dept,
          children: dept.children ? filterDepartments(dept.children) : []
        }
      }
      return false
    }).map(dept => ({
      ...dept,
      children: dept.children ? filterDepartments(dept.children) : []
    }))
  }

  return filterDepartments(departmentTree.value)
})

const availableParentDepartments = computed(() => {
  if (isEditing.value && departmentForm.id) {
    // 编辑时排除自己和自己的子部门
    return departments.value.filter(dept =>
      dept.id !== departmentForm.id &&
      !isDescendant(dept.id, departmentForm.id)
    )
  }
  return departments.value
})

const departmentEmployees = computed(() => {
  if (!selectedDepartment.value) return []
  return employees.value.filter(emp => emp.department_id === selectedDepartment.value!.id)
})

const isFormValid = computed(() => {
  return departmentForm.name.trim() !== '' &&
         departmentForm.code.trim() !== ''
})

const isEmployeeFormValid = computed(() => {
  return employeeForm.name.trim() !== '' &&
         employeeForm.employee_id.trim() !== '' &&
         employeeForm.position.trim() !== '' &&
         employeeForm.phone.trim() !== '' &&
         employeeForm.email.trim() !== '' &&
         employeeForm.hire_date.trim() !== ''
})

// 生命周期
onMounted(() => {
  loadDepartments()
  loadEmployees()
})

// 方法
const loadDepartments = () => {
  departments.value = mockDepartments
}

const loadEmployees = () => {
  employees.value = allEmployees
}

const handleSearch = () => {
  // 搜索逻辑已在计算属性中处理
}

const createDepartment = () => {
  resetForm()
  isEditing.value = false
  showDepartmentModal.value = true
}

const editDepartment = (department: Department) => {
  Object.assign(departmentForm, {
    id: department.id,
    name: department.name,
    code: department.code,
    parent_id: department.parent_id,
    manager_id: department.manager_id,
    description: department.description,
    sort_order: department.sort_order,
    status: department.status
  })
  isEditing.value = true
  showDepartmentModal.value = true
  closeDetailModal()
}

const deleteDepartment = (department: Department) => {
  if (confirm(`确定要删除部门"${department.name}"吗？`)) {
    departments.value = departments.value.filter(d => d.id !== department.id)
    alert('部门删除成功！')
  }
}

const addChildDepartment = (parentDepartment: Department) => {
  resetForm()
  departmentForm.parent_id = parentDepartment.id
  isEditing.value = false
  showDepartmentModal.value = true
}

const viewDepartment = (department: Department) => {
  selectedDepartment.value = department
  showDetailModal.value = true
}

const submitDepartment = () => {
  if (!isFormValid.value) return

  if (isEditing.value) {
    // 更新部门
    const index = departments.value.findIndex(d => d.id === departmentForm.id)
    if (index !== -1) {
      const managerName = employees.value.find(e => e.id === departmentForm.manager_id)?.name || ''
      departments.value[index] = {
        ...departments.value[index],
        name: departmentForm.name,
        code: departmentForm.code,
        parent_id: departmentForm.parent_id,
        manager_id: departmentForm.manager_id,
        manager_name: managerName,
        description: departmentForm.description,
        sort_order: departmentForm.sort_order,
        status: departmentForm.status,
        updated_at: new Date().toISOString().split('T')[0]
      }
      alert('部门更新成功！')
    }
  } else {
    // 创建部门
    const newId = Math.max(...departments.value.map(d => d.id)) + 1
    const managerName = employees.value.find(e => e.id === departmentForm.manager_id)?.name || ''
    const newDepartment: Department = {
      id: newId,
      name: departmentForm.name,
      code: departmentForm.code,
      parent_id: departmentForm.parent_id,
      manager_id: departmentForm.manager_id,
      manager_name: managerName,
      description: departmentForm.description,
      sort_order: departmentForm.sort_order,
      status: departmentForm.status,
      employee_count: 0,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    }
    departments.value.push(newDepartment)
    alert('部门创建成功！')
  }

  closeDepartmentModal()
}

const closeDepartmentModal = () => {
  showDepartmentModal.value = false
  resetForm()
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedDepartment.value = null
}

const resetForm = () => {
  Object.assign(departmentForm, {
    id: 0,
    name: '',
    code: '',
    parent_id: null,
    manager_id: null,
    description: '',
    sort_order: 1,
    status: 'active'
  })
}

const exportData = () => {
  alert('导出功能开发中...')
}

const importData = () => {
  alert('导入功能开发中...')
}

const isDescendant = (departmentId: number, ancestorId: number): boolean => {
  const department = departments.value.find(d => d.id === departmentId)
  if (!department || !department.parent_id) return false
  if (department.parent_id === ancestorId) return true
  return isDescendant(department.parent_id, ancestorId)
}

const getParentDepartmentName = (parentId: number | null): string => {
  if (!parentId) return ''
  const parent = departments.value.find(d => d.id === parentId)
  return parent?.name || ''
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

// 员工管理方法
const addEmployeeToDepartment = (department?: Department) => {
  // 如果传入了部门参数，使用传入的部门；否则使用当前选中的部门
  const targetDepartment = department || selectedDepartment.value
  if (!targetDepartment) return

  // 设置当前操作的部门
  selectedDepartment.value = targetDepartment
  resetEmployeeForm()
  isEditingEmployee.value = false
  showEmployeeModal.value = true
}

const editEmployeeInDepartment = (employee: Employee) => {
  Object.assign(employeeForm, {
    id: employee.id,
    name: employee.name,
    employee_id: employee.employee_id,
    gender: employee.gender,
    position: employee.position,
    phone: employee.phone,
    email: employee.email,
    hire_date: employee.hire_date,
    status: employee.status
  })
  isEditingEmployee.value = true
  showEmployeeModal.value = true
}

const removeEmployeeFromDepartment = (employee: Employee) => {
  if (confirm(`确定要从部门中移除员工"${employee.name}"吗？`)) {
    employees.value = employees.value.filter(e => e.id !== employee.id)
    // 更新部门员工数量
    if (selectedDepartment.value) {
      const deptIndex = departments.value.findIndex(d => d.id === selectedDepartment.value!.id)
      if (deptIndex !== -1) {
        departments.value[deptIndex].employee_count--
      }
    }
    alert('员工移除成功！')
  }
}

const submitEmployee = () => {
  if (!isEmployeeFormValid.value || !selectedDepartment.value) return

  if (isEditingEmployee.value) {
    // 更新员工
    const index = employees.value.findIndex(e => e.id === employeeForm.id)
    if (index !== -1) {
      employees.value[index] = {
        ...employees.value[index],
        name: employeeForm.name,
        employee_id: employeeForm.employee_id,
        gender: employeeForm.gender,
        position: employeeForm.position,
        phone: employeeForm.phone,
        email: employeeForm.email,
        hire_date: employeeForm.hire_date,
        status: employeeForm.status,
        updated_at: new Date().toISOString().split('T')[0]
      }
      alert('员工信息更新成功！')
    }
  } else {
    // 添加员工
    const newId = Math.max(...employees.value.map(e => e.id)) + 1
    const newEmployee: Employee = {
      id: newId,
      name: employeeForm.name,
      employee_id: employeeForm.employee_id,
      gender: employeeForm.gender,
      birth_date: '',
      id_card: '',
      phone: employeeForm.phone,
      email: employeeForm.email,
      department_id: selectedDepartment.value.id,
      department_name: selectedDepartment.value.name,
      position: employeeForm.position,
      hire_date: employeeForm.hire_date,
      probation_months: 3,
      work_location: '上海总部',
      status: employeeForm.status,
      created_at: new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    }
    employees.value.push(newEmployee)

    // 更新部门员工数量
    const deptIndex = departments.value.findIndex(d => d.id === selectedDepartment.value!.id)
    if (deptIndex !== -1) {
      departments.value[deptIndex].employee_count++
    }

    alert('员工添加成功！')
  }

  closeEmployeeModal()
}

const closeEmployeeModal = () => {
  showEmployeeModal.value = false
  resetEmployeeForm()
}

const resetEmployeeForm = () => {
  Object.assign(employeeForm, {
    id: 0,
    name: '',
    employee_id: '',
    gender: 'male',
    position: '',
    phone: '',
    email: '',
    hire_date: '',
    status: 'active'
  })
}
</script>

<style scoped>
.organization-panel {
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

.organization-content {
  background: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
}

.search-section {
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.search-input-wrapper {
  position: relative;
  max-width: 400px;
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
  padding: 10px 12px 10px 40px;
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

.department-tree-section {
  min-height: 400px;
}

.tree-container {
  background: var(--color-surface);
}

.no-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: var(--color-text-secondary);
}

.no-data-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.no-data-text {
  font-size: 16px;
}

.department-tree {
  border-top: 1px solid var(--color-border-light);
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

.modal-container--medium {
  width: 600px;
  max-width: 90vw;
}

.modal-container--large {
  width: 900px;
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
.department-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  min-height: 80px;
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

/* 部门详情样式 */
.department-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  background: var(--color-background);
  border-radius: 8px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
  flex: 1;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-item--full {
  grid-column: 1 / -1;
}

.info-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: var(--color-text-primary);
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

.status-badge--danger {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.status-badge--warning {
  background: rgba(245, 158, 11, 0.1);
  color: #d97706;
}

.status-badge--secondary {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.children-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
}

.child-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 12px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.child-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.child-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 4px;
}

.child-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.no-employees {
  text-align: center;
  padding: 40px;
  color: var(--color-text-secondary);
  font-style: italic;
}

.employees-table {
  overflow-x: auto;
}

.employees-table table {
  width: 100%;
  border-collapse: collapse;
}

.employees-table th,
.employees-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid var(--color-border-light);
}

.employees-table th {
  background: var(--color-background);
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 14px;
}

.employees-table td {
  font-size: 14px;
  color: var(--color-text-primary);
}

.employee-actions {
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

.action-btn-small--primary {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.action-btn-small--primary:hover {
  background: #16a34a;
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

/* 员工表单样式 */
.employee-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .organization-panel {
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

  .form-grid {
    grid-template-columns: 1fr;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .children-grid {
    grid-template-columns: 1fr;
  }

  .modal-container--medium,
  .modal-container--large {
    width: 95vw;
    margin: 20px;
  }

  .form-actions {
    flex-direction: column-reverse;
  }

  .btn {
    width: 100%;
  }
}
</style>
