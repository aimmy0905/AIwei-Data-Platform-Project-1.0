<template>
  <div class="role-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">角色管理</h1>
          <p class="page-description">管理系统中的职务角色和权限分配</p>
        </div>
        <div class="header-right">
          <button class="btn btn-primary" @click="showCreateModal = true">
            <Plus :size="16" />
            添加角色
          </button>
        </div>
      </div>
    </div>

    <!-- 筛选和搜索 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label class="filter-label">部门筛选</label>
          <select v-model="filters.department" class="filter-select">
            <option value="">全部部门</option>
            <option value="sales">销售部</option>
            <option value="operations">运营部</option>
            <option value="finance">财务部</option>
            <option value="system">系统管理</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">职级筛选</label>
          <select v-model="filters.level" class="filter-select">
            <option value="">全部职级</option>
            <option value="admin">管理员</option>
            <option value="director">总监</option>
            <option value="manager">经理</option>
            <option value="staff">专员</option>
          </select>
        </div>

        <div class="filter-group">
          <label class="filter-label">状态筛选</label>
          <select v-model="filters.status" class="filter-select">
            <option value="">全部状态</option>
            <option value="active">启用</option>
            <option value="disabled">禁用</option>
          </select>
        </div>

        <div class="search-group">
          <div class="search-input-wrapper">
            <Search :size="16" class="search-icon" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="搜索角色名称..."
              class="search-input"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 角色列表 -->
    <div class="roles-section">
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载角色数据...</p>
      </div>

      <div v-else-if="filteredRoles.length === 0" class="empty-state">
        <Users :size="48" class="empty-icon" />
        <h3>暂无角色数据</h3>
        <p>点击上方"添加角色"按钮创建新的角色</p>
      </div>

      <div v-else class="roles-grid">
        <div
          v-for="role in paginatedRoles"
          :key="role.id"
          class="role-card"
          :class="{ 'role-card--disabled': role.status === 'disabled' }"
        >
          <div class="role-card__header">
            <div class="role-info">
              <h3 class="role-name">{{ role.displayName }}</h3>
              <p class="role-description">{{ role.description }}</p>
            </div>
            <div class="role-actions">
              <button
                class="action-btn action-btn--edit"
                @click="editRole(role)"
                title="编辑角色"
              >
                <Edit :size="16" />
              </button>
              <button
                class="action-btn action-btn--delete"
                @click="deleteRole(role)"
                title="删除角色"
                :disabled="role.id === 'superAdmin'"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>

          <div class="role-card__body">
            <div class="role-meta">
              <div class="meta-item">
                <Building :size="14" />
                <span>{{ getDepartmentText(role.department) }}</span>
              </div>
              <div class="meta-item">
                <Award :size="14" />
                <span>{{ getLevelText(role.level) }}</span>
              </div>
              <div class="meta-item">
                <Shield :size="14" />
                <span>{{ role.permissions.length }} 项权限</span>
              </div>
            </div>

            <div class="role-status">
              <span
                class="status-badge"
                :class="`status-badge--${role.status}`"
              >
                {{ role.status === 'active' ? '启用' : '禁用' }}
              </span>
            </div>
          </div>

          <div class="role-card__footer">
            <div class="role-dates">
              <small>创建时间：{{ formatDate(role.createdAt) }}</small>
              <small>更新时间：{{ formatDate(role.updatedAt) }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 分页 -->
    <div v-if="totalPages > 1" class="pagination">
      <button
        class="pagination-btn"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        <ChevronLeft :size="16" />
      </button>

      <span class="pagination-info">
        第 {{ currentPage }} 页，共 {{ totalPages }} 页
      </span>

      <button
        class="pagination-btn"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        <ChevronRight :size="16" />
      </button>
    </div>

    <!-- 创建/编辑角色弹窗 -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ showCreateModal ? '创建角色' : '编辑角色' }}</h2>
          <button class="modal-close" @click="closeModal">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="submitRole">
            <div class="form-row">
              <div class="form-group">
                <label class="form-label">角色名称 *</label>
                <input
                  v-model="roleForm.name"
                  type="text"
                  class="form-input"
                  placeholder="请输入角色英文名称"
                  required
                />
              </div>
              <div class="form-group">
                <label class="form-label">显示名称 *</label>
                <input
                  v-model="roleForm.displayName"
                  type="text"
                  class="form-input"
                  placeholder="请输入角色中文名称"
                  required
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">角色描述</label>
              <textarea
                v-model="roleForm.description"
                class="form-textarea"
                placeholder="请输入角色描述"
                rows="3"
              ></textarea>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label class="form-label">所属部门 *</label>
                <select v-model="roleForm.department" class="form-select" required>
                  <option value="">请选择部门</option>
                  <option value="sales">销售部</option>
                  <option value="operations">运营部</option>
                  <option value="finance">财务部</option>
                  <option value="system">系统管理</option>
                </select>
              </div>
              <div class="form-group">
                <label class="form-label">职级 *</label>
                <select v-model="roleForm.level" class="form-select" required>
                  <option value="">请选择职级</option>
                  <option value="admin">管理员</option>
                  <option value="director">总监</option>
                  <option value="manager">经理</option>
                  <option value="staff">专员</option>
                </select>
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">状态</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input
                    v-model="roleForm.status"
                    type="radio"
                    value="active"
                  />
                  <span>启用</span>
                </label>
                <label class="radio-item">
                  <input
                    v-model="roleForm.status"
                    type="radio"
                    value="disabled"
                  />
                  <span>禁用</span>
                </label>
              </div>
            </div>

            <!-- 权限配置 -->
            <div class="form-group">
              <label class="form-label">权限配置</label>
              <div class="permissions-section">
                <div
                  v-for="module in permissionModules"
                  :key="module.id"
                  class="permission-module"
                >
                  <div class="module-header">
                    <div class="module-info">
                      <h4 class="module-name">{{ module.displayName }}</h4>
                      <p class="module-description">{{ module.description }}</p>
                    </div>
                    <div class="module-actions">
                      <label class="checkbox-item">
                        <input
                          type="checkbox"
                          :checked="isModuleAllSelected(module)"
                          :indeterminate.prop="isModulePartialSelected(module)"
                          @change="toggleModule(module, $event)"
                        />
                        <span>全选</span>
                      </label>
                    </div>
                  </div>

                  <div class="permissions-grid">
                    <div
                      v-for="permission in module.permissions"
                      :key="permission.id"
                      class="permission-item"
                    >
                      <label class="permission-checkbox">
                        <input
                          type="checkbox"
                          :value="permission.id"
                          v-model="roleForm.permissions"
                        />
                        <div class="permission-content">
                          <div class="permission-header">
                            <span class="permission-name">{{ permission.displayName }}</span>
                            <span class="permission-category" :class="`category--${permission.category}`">
                              {{ getCategoryText(permission.category) }}
                            </span>
                          </div>
                          <p class="permission-description">{{ permission.description }}</p>
                        </div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">
            取消
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="submitRole"
            :disabled="submitting"
          >
            {{ submitting ? '保存中...' : '保存' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Plus, Search, Users, Edit, Trash2, Building, Award, Shield,
  ChevronLeft, ChevronRight, X
} from 'lucide-vue-next'
import type { Role, PermissionModule } from '@/types'
import { roleAPI, permissionAPI } from '@/mock/roles'

// 响应式数据
const roles = ref<Role[]>([])
const permissionModules = ref<PermissionModule[]>([])
const loading = ref(false)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(12)

// 筛选条件
const filters = ref({
  department: '',
  level: '',
  status: ''
})

// 弹窗状态
const showCreateModal = ref(false)
const showEditModal = ref(false)
const submitting = ref(false)
const editingRole = ref<Role | null>(null)

// 表单数据
const roleForm = ref({
  name: '',
  displayName: '',
  description: '',
  department: '',
  level: 'staff' as Role['level'],
  status: 'active' as Role['status'],
  permissions: [] as string[]
})

// 计算属性
const filteredRoles = computed(() => {
  let filtered = roles.value

  // 搜索过滤
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(role =>
      role.displayName.toLowerCase().includes(query) ||
      role.name.toLowerCase().includes(query) ||
      role.description.toLowerCase().includes(query)
    )
  }

  // 部门过滤
  if (filters.value.department) {
    filtered = filtered.filter(role => role.department === filters.value.department)
  }

  // 职级过滤
  if (filters.value.level) {
    filtered = filtered.filter(role => role.level === filters.value.level)
  }

  // 状态过滤
  if (filters.value.status) {
    filtered = filtered.filter(role => role.status === filters.value.status)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredRoles.value.length / pageSize.value))

const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredRoles.value.slice(start, end)
})

// 方法
const loadRoles = async () => {
  loading.value = true
  try {
    roles.value = await roleAPI.getRoles()
  } catch (error) {
    console.error('加载角色失败:', error)
  } finally {
    loading.value = false
  }
}

const loadPermissions = async () => {
  try {
    permissionModules.value = await permissionAPI.getPermissionModules()
  } catch (error) {
    console.error('加载权限失败:', error)
  }
}

const editRole = (role: Role) => {
  editingRole.value = role
  roleForm.value = {
    name: role.name,
    displayName: role.displayName,
    description: role.description,
    department: role.department,
    level: role.level,
    status: role.status,
    permissions: [...role.permissions]
  }
  showEditModal.value = true
}

const deleteRole = async (role: Role) => {
  if (role.id === 'superAdmin') {
    alert('超级管理员角色不能删除')
    return
  }

  if (confirm(`确定要删除角色"${role.displayName}"吗？`)) {
    try {
      await roleAPI.deleteRole(role.id)
      await loadRoles()
    } catch (error) {
      console.error('删除角色失败:', error)
      alert('删除角色失败')
    }
  }
}

const submitRole = async () => {
  if (!roleForm.value.name || !roleForm.value.displayName || !roleForm.value.department) {
    alert('请填写必填字段')
    return
  }

  submitting.value = true
  try {
    if (showEditModal.value && editingRole.value) {
      // 编辑角色
      await roleAPI.updateRole(editingRole.value.id, roleForm.value)
    } else {
      // 创建角色
      await roleAPI.createRole(roleForm.value)
    }

    await loadRoles()
    closeModal()
  } catch (error) {
    console.error('保存角色失败:', error)
    alert('保存角色失败')
  } finally {
    submitting.value = false
  }
}

const closeModal = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingRole.value = null
  roleForm.value = {
    name: '',
    displayName: '',
    description: '',
    department: '',
    level: 'staff',
    status: 'active',
    permissions: []
  }
}

const getDepartmentText = (department: string) => {
  const map: Record<string, string> = {
    sales: '销售部',
    operations: '运营部',
    finance: '财务部',
    system: '系统管理'
  }
  return map[department] || department
}

const getLevelText = (level: string) => {
  const map: Record<string, string> = {
    admin: '管理员',
    director: '总监',
    manager: '经理',
    staff: '专员'
  }
  return map[level] || level
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

// 权限相关方法
const isModuleAllSelected = (module: PermissionModule) => {
  const modulePermissionIds = module.permissions.map(p => p.id)
  return modulePermissionIds.every(id => roleForm.value.permissions.includes(id))
}

const isModulePartialSelected = (module: PermissionModule) => {
  const modulePermissionIds = module.permissions.map(p => p.id)
  const selectedCount = modulePermissionIds.filter(id => roleForm.value.permissions.includes(id)).length
  return selectedCount > 0 && selectedCount < modulePermissionIds.length
}

const toggleModule = (module: PermissionModule, event: Event) => {
  const target = event.target as HTMLInputElement
  const modulePermissionIds = module.permissions.map(p => p.id)

  if (target.checked) {
    // 选中模块所有权限
    modulePermissionIds.forEach(id => {
      if (!roleForm.value.permissions.includes(id)) {
        roleForm.value.permissions.push(id)
      }
    })
  } else {
    // 取消选中模块所有权限
    roleForm.value.permissions = roleForm.value.permissions.filter(
      id => !modulePermissionIds.includes(id)
    )
  }
}

const getCategoryText = (category: string) => {
  const map: Record<string, string> = {
    read: '查看',
    write: '编辑',
    delete: '删除',
    admin: '管理'
  }
  return map[category] || category
}

// 生命周期
onMounted(async () => {
  await loadRoles()
  await loadPermissions()
})
</script>

<style scoped>
.role-management {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-description {
  color: #666;
  margin: 0;
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:hover {
  background: #1565c0;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.filter-section {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.filter-row {
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-group {
  min-width: 140px;
}

.filter-label {
  display: block;
  font-size: 14px;
  color: #333;
  margin-bottom: 4px;
}

.filter-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.search-group {
  flex: 1;
  min-width: 200px;
}

.search-input-wrapper {
  position: relative;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 36px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.roles-section {
  min-height: 400px;
}

.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.loading-spinner {
  width: 32px;
  height: 32px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #1976d2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-icon {
  color: #ccc;
  margin-bottom: 16px;
}

.roles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.role-card {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
}

.role-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.role-card--disabled {
  opacity: 0.6;
}

.role-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.role-info {
  flex: 1;
}

.role-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.role-description {
  color: #666;
  font-size: 14px;
  margin: 0;
  line-height: 1.4;
}

.role-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn--edit {
  background: #f0f8ff;
  color: #1976d2;
}

.action-btn--edit:hover {
  background: #e3f2fd;
}

.action-btn--delete {
  background: #fff5f5;
  color: #d32f2f;
}

.action-btn--delete:hover:not(:disabled) {
  background: #ffebee;
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.role-card__body {
  margin-bottom: 16px;
}

.role-meta {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #666;
}

.role-status {
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge--active {
  background: #e8f5e8;
  color: #2e7d32;
}

.status-badge--disabled {
  background: #ffebee;
  color: #d32f2f;
}

.role-card__footer {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.role-dates {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.role-dates small {
  color: #999;
  font-size: 12px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.pagination-btn {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.pagination-btn:hover:not(:disabled) {
  background: #f5f5f5;
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-info {
  font-size: 14px;
  color: #666;
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
  z-index: 1000;
}

.modal {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.modal-close {
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #666;
}

.modal-close:hover {
  background: #f5f5f5;
}

.modal-body {
  padding: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.form-group {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  transition: border-color 0.2s;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #1976d2;
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

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e0e0e0;
}

/* 权限配置样式 */
.permissions-section {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
}

.permission-module {
  border: 1px solid #f0f0f0;
  border-radius: 6px;
  margin-bottom: 16px;
  overflow: hidden;
}

.permission-module:last-child {
  margin-bottom: 0;
}

.module-header {
  background: #fafafa;
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.module-info h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.module-info p {
  color: #666;
  font-size: 12px;
  margin: 0;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 12px;
}

.permissions-grid {
  padding: 12px;
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.permission-item {
  border: 1px solid #e0e0e0;
  border-radius: 4px;
  overflow: hidden;
}

.permission-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.permission-checkbox:hover {
  background: #f8f9fa;
}

.permission-checkbox input[type="checkbox"] {
  margin-top: 2px;
}

.permission-content {
  flex: 1;
}

.permission-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
}

.permission-name {
  font-size: 12px;
  font-weight: 500;
  color: #1a1a1a;
}

.permission-category {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 500;
}

.category--read {
  background: #e8f5e8;
  color: #2e7d32;
}

.category--write {
  background: #fff3e0;
  color: #f57c00;
}

.category--delete {
  background: #ffebee;
  color: #d32f2f;
}

.category--admin {
  background: #e3f2fd;
  color: #1976d2;
}

.permission-description {
  color: #666;
  font-size: 11px;
  line-height: 1.4;
  margin: 0;
}

@media (max-width: 768px) {
  .role-management {
    padding: 16px;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .filter-row {
    flex-direction: column;
  }

  .roles-grid {
    grid-template-columns: 1fr;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .permissions-section {
    max-height: 300px;
  }
}
</style>
