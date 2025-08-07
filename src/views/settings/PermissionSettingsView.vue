<template>
  <div class="permission-settings">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">权限设置</h1>
          <p class="page-description">配置不同角色的系统访问权限</p>
        </div>
      </div>
    </div>

    <!-- 角色选择 -->
    <div class="role-selector-section">
      <div class="selector-header">
        <h2>选择角色</h2>
        <p>请选择要配置权限的角色</p>
      </div>
      <div class="role-cards">
        <div
          v-for="role in roles"
          :key="role.id"
          class="role-card"
          :class="{ 'role-card--selected': selectedRoleId === role.id }"
          @click="selectRole(role.id)"
        >
          <div class="role-card__header">
            <div class="role-info">
              <h3 class="role-name">{{ role.displayName }}</h3>
              <p class="role-description">{{ role.description }}</p>
            </div>
            <div class="role-meta">
              <span class="department-badge">{{ getDepartmentText(role.department) }}</span>
              <span class="level-badge">{{ getLevelText(role.level) }}</span>
            </div>
          </div>
          <div class="role-card__footer">
            <div class="permission-count">
              <Shield :size="14" />
              <span>{{ role.permissions.length }} 项权限</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 权限配置 -->
    <div v-if="selectedRoleId" class="permissions-section">
      <div class="permissions-header">
        <h2>权限配置</h2>
        <p>为角色"{{ selectedRole?.displayName }}"配置访问权限</p>
        <div class="permissions-actions">
          <button class="btn btn-secondary" @click="selectAllPermissions">
            全选
          </button>
          <button class="btn btn-secondary" @click="clearAllPermissions">
            清空
          </button>
          <button
            class="btn btn-primary"
            @click="savePermissions"
            :disabled="saving"
          >
            {{ saving ? '保存中...' : '保存权限' }}
          </button>
        </div>
      </div>

      <div v-if="loadingPermissions" class="loading-state">
        <div class="loading-spinner"></div>
        <p>正在加载权限数据...</p>
      </div>

      <div v-else class="permission-modules">
        <div
          v-for="module in permissionModules"
          :key="module.id"
          class="permission-module"
        >
          <div class="module-header">
            <div class="module-info">
              <h3 class="module-name">{{ module.displayName }}</h3>
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
                  v-model="selectedPermissions"
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

    <!-- 空状态 -->
    <div v-else class="empty-state">
      <Shield :size="48" class="empty-icon" />
      <h3>请选择角色</h3>
      <p>请先选择一个角色来配置其权限</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { Shield } from 'lucide-vue-next'
import type { Role, PermissionModule } from '@/types'
import { roleAPI, permissionAPI } from '@/mock/roles'

// 响应式数据
const roles = ref<Role[]>([])
const permissionModules = ref<PermissionModule[]>([])
const selectedRoleId = ref<string>('')
const selectedPermissions = ref<string[]>([])
const loadingPermissions = ref(false)
const saving = ref(false)

// 计算属性
const selectedRole = computed(() =>
  roles.value.find(role => role.id === selectedRoleId.value)
)

// 方法
const loadRoles = async () => {
  try {
    roles.value = await roleAPI.getRoles()
  } catch (error) {
    console.error('加载角色失败:', error)
  }
}

const loadPermissions = async () => {
  loadingPermissions.value = true
  try {
    permissionModules.value = await permissionAPI.getPermissionModules()
  } catch (error) {
    console.error('加载权限失败:', error)
  } finally {
    loadingPermissions.value = false
  }
}

const selectRole = async (roleId: string) => {
  selectedRoleId.value = roleId

  // 加载该角色的权限
  try {
    const permissions = await permissionAPI.getRolePermissions(roleId)
    selectedPermissions.value = permissions
  } catch (error) {
    console.error('加载角色权限失败:', error)
    selectedPermissions.value = []
  }
}

const isModuleAllSelected = (module: PermissionModule) => {
  const modulePermissionIds = module.permissions.map(p => p.id)
  return modulePermissionIds.every(id => selectedPermissions.value.includes(id))
}

const isModulePartialSelected = (module: PermissionModule) => {
  const modulePermissionIds = module.permissions.map(p => p.id)
  const selectedCount = modulePermissionIds.filter(id => selectedPermissions.value.includes(id)).length
  return selectedCount > 0 && selectedCount < modulePermissionIds.length
}

const toggleModule = (module: PermissionModule, event: Event) => {
  const target = event.target as HTMLInputElement
  const modulePermissionIds = module.permissions.map(p => p.id)

  if (target.checked) {
    // 选中模块所有权限
    modulePermissionIds.forEach(id => {
      if (!selectedPermissions.value.includes(id)) {
        selectedPermissions.value.push(id)
      }
    })
  } else {
    // 取消选中模块所有权限
    selectedPermissions.value = selectedPermissions.value.filter(
      id => !modulePermissionIds.includes(id)
    )
  }
}

const selectAllPermissions = () => {
  const allPermissionIds = permissionModules.value
    .flatMap(module => module.permissions)
    .map(permission => permission.id)
  selectedPermissions.value = [...allPermissionIds]
}

const clearAllPermissions = () => {
  selectedPermissions.value = []
}

const savePermissions = async () => {
  if (!selectedRoleId.value) return

  saving.value = true
  try {
    await permissionAPI.updateRolePermissions(selectedRoleId.value, selectedPermissions.value)

    // 更新本地角色数据
    const roleIndex = roles.value.findIndex(r => r.id === selectedRoleId.value)
    if (roleIndex !== -1) {
      roles.value[roleIndex].permissions = [...selectedPermissions.value]
    }

    alert('权限保存成功')
  } catch (error) {
    console.error('保存权限失败:', error)
    alert('保存权限失败')
  } finally {
    saving.value = false
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

const getCategoryText = (category: string) => {
  const map: Record<string, string> = {
    read: '查看',
    write: '编辑',
    delete: '删除',
    admin: '管理'
  }
  return map[category] || category
}

// 监听角色变化
watch(selectedRoleId, (newRoleId) => {
  if (newRoleId) {
    selectRole(newRoleId)
  }
})

// 生命周期
onMounted(async () => {
  await loadRoles()
  await loadPermissions()
})
</script>

<style scoped>
.permission-settings {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 32px;
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

.role-selector-section {
  margin-bottom: 32px;
}

.selector-header {
  margin-bottom: 20px;
}

.selector-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.selector-header p {
  color: #666;
  margin: 0;
}

.role-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.role-card {
  background: white;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.role-card:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.role-card--selected {
  border-color: #1976d2;
  background: #f8fbff;
}

.role-card__header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 12px;
}

.role-info {
  flex: 1;
}

.role-name {
  font-size: 16px;
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

.role-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-end;
}

.department-badge,
.level-badge {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.department-badge {
  background: #e3f2fd;
  color: #1976d2;
}

.level-badge {
  background: #f3e5f5;
  color: #7b1fa2;
}

.role-card__footer {
  display: flex;
  justify-content: flex-end;
}

.permission-count {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 14px;
  color: #666;
}

.permissions-section {
  background: white;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 24px;
}

.permissions-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 16px;
}

.permissions-header h2 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.permissions-header p {
  color: #666;
  margin: 0;
}

.permissions-actions {
  display: flex;
  gap: 8px;
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

.btn-primary:hover:not(:disabled) {
  background: #1565c0;
}

.btn-secondary {
  background: #f5f5f5;
  color: #333;
}

.btn-secondary:hover {
  background: #e0e0e0;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
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

.permission-modules {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.permission-module {
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.module-header {
  background: #fafafa;
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.module-info h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.module-info p {
  color: #666;
  font-size: 14px;
  margin: 0;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  font-size: 14px;
}

.permissions-grid {
  padding: 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.permission-item {
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  overflow: hidden;
}

.permission-checkbox {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 16px;
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
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.permission-category {
  padding: 2px 6px;
  border-radius: 10px;
  font-size: 11px;
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
  font-size: 13px;
  line-height: 1.4;
  margin: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  text-align: center;
}

.empty-icon {
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 18px;
  color: #666;
  margin: 0 0 8px 0;
}

.empty-state p {
  color: #999;
  margin: 0;
}

@media (max-width: 768px) {
  .permission-settings {
    padding: 16px;
  }

  .role-cards {
    grid-template-columns: 1fr;
  }

  .permissions-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .permissions-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .permissions-grid {
    grid-template-columns: 1fr;
  }

  .module-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>
