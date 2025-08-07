import type { Role, Permission, PermissionModule, RolePermissionConfig } from '@/types'

// 权限定义
export const mockPermissions: Permission[] = [
  // 数据看板权限
  {
    id: 'dashboard_view',
    name: 'dashboard_view',
    displayName: '查看数据看板',
    description: '可以查看各种数据看板和统计信息',
    module: 'dashboard',
    category: 'read',
    resource: 'dashboard'
  },
  {
    id: 'dashboard_export',
    name: 'dashboard_export',
    displayName: '导出数据',
    description: '可以导出数据看板中的数据',
    module: 'dashboard',
    category: 'write',
    resource: 'dashboard'
  },

  // 客户管理权限
  {
    id: 'customer_view',
    name: 'customer_view',
    displayName: '查看客户',
    description: '可以查看客户列表和详情',
    module: 'customer',
    category: 'read',
    resource: 'customer'
  },
  {
    id: 'customer_create',
    name: 'customer_create',
    displayName: '创建客户',
    description: '可以创建新的客户记录',
    module: 'customer',
    category: 'write',
    resource: 'customer'
  },
  {
    id: 'customer_edit',
    name: 'customer_edit',
    displayName: '编辑客户',
    description: '可以编辑客户信息',
    module: 'customer',
    category: 'write',
    resource: 'customer'
  },
  {
    id: 'customer_delete',
    name: 'customer_delete',
    displayName: '删除客户',
    description: '可以删除客户记录',
    module: 'customer',
    category: 'delete',
    resource: 'customer'
  },

  // 项目管理权限
  {
    id: 'project_view',
    name: 'project_view',
    displayName: '查看项目',
    description: '可以查看项目列表和详情',
    module: 'project',
    category: 'read',
    resource: 'project'
  },
  {
    id: 'project_create',
    name: 'project_create',
    displayName: '创建项目',
    description: '可以创建新的项目',
    module: 'project',
    category: 'write',
    resource: 'project'
  },
  {
    id: 'project_edit',
    name: 'project_edit',
    displayName: '编辑项目',
    description: '可以编辑项目信息',
    module: 'project',
    category: 'write',
    resource: 'project'
  },
  {
    id: 'project_delete',
    name: 'project_delete',
    displayName: '删除项目',
    description: '可以删除项目',
    module: 'project',
    category: 'delete',
    resource: 'project'
  },

  // 部门管理权限
  {
    id: 'department_view',
    name: 'department_view',
    displayName: '查看部门',
    description: '可以查看部门信息和员工',
    module: 'department',
    category: 'read',
    resource: 'department'
  },
  {
    id: 'department_manage',
    name: 'department_manage',
    displayName: '管理部门',
    description: '可以管理部门结构和员工',
    module: 'department',
    category: 'write',
    resource: 'department'
  },
  {
    id: 'performance_view',
    name: 'performance_view',
    displayName: '查看绩效',
    description: '可以查看绩效数据',
    module: 'department',
    category: 'read',
    resource: 'performance'
  },
  {
    id: 'performance_manage',
    name: 'performance_manage',
    displayName: '管理绩效',
    description: '可以设置和管理绩效目标',
    module: 'department',
    category: 'write',
    resource: 'performance'
  },

  // 业务看板权限
  {
    id: 'business_dashboard_view',
    name: 'business_dashboard_view',
    displayName: '查看业务看板',
    description: '可以查看业务相关的数据看板',
    module: 'business',
    category: 'read',
    resource: 'business_dashboard'
  },

  // 财务管理权限
  {
    id: 'finance_view',
    name: 'finance_view',
    displayName: '查看财务',
    description: '可以查看财务数据和服务费',
    module: 'finance',
    category: 'read',
    resource: 'finance'
  },
  {
    id: 'finance_manage',
    name: 'finance_manage',
    displayName: '管理财务',
    description: '可以管理服务费和财务数据',
    module: 'finance',
    category: 'write',
    resource: 'finance'
  },

  // 系统管理权限
  {
    id: 'role_view',
    name: 'role_view',
    displayName: '查看角色',
    description: '可以查看系统角色列表',
    module: 'system',
    category: 'read',
    resource: 'role'
  },
  {
    id: 'role_manage',
    name: 'role_manage',
    displayName: '管理角色',
    description: '可以创建、编辑和删除角色',
    module: 'system',
    category: 'admin',
    resource: 'role'
  },
  {
    id: 'permission_view',
    name: 'permission_view',
    displayName: '查看权限',
    description: '可以查看权限配置',
    module: 'system',
    category: 'read',
    resource: 'permission'
  },
  {
    id: 'permission_manage',
    name: 'permission_manage',
    displayName: '管理权限',
    description: '可以配置角色权限',
    module: 'system',
    category: 'admin',
    resource: 'permission'
  }
]

// 权限模块
export const mockPermissionModules: PermissionModule[] = [
  {
    id: 'dashboard',
    name: 'dashboard',
    displayName: '数据看板',
    description: '数据看板相关功能权限',
    permissions: mockPermissions.filter(p => p.module === 'dashboard')
  },
  {
    id: 'customer',
    name: 'customer',
    displayName: '客户管理',
    description: '客户管理相关功能权限',
    permissions: mockPermissions.filter(p => p.module === 'customer')
  },
  {
    id: 'project',
    name: 'project',
    displayName: '项目管理',
    description: '项目管理相关功能权限',
    permissions: mockPermissions.filter(p => p.module === 'project')
  },
  {
    id: 'department',
    name: 'department',
    displayName: '部门管理',
    description: '部门管理相关功能权限',
    permissions: mockPermissions.filter(p => p.module === 'department')
  },
  {
    id: 'business',
    name: 'business',
    displayName: '业务看板',
    description: '业务看板相关功能权限',
    permissions: mockPermissions.filter(p => p.module === 'business')
  },
  {
    id: 'finance',
    name: 'finance',
    displayName: '财务管理',
    description: '财务管理相关功能权限',
    permissions: mockPermissions.filter(p => p.module === 'finance')
  },
  {
    id: 'system',
    name: 'system',
    displayName: '系统管理',
    description: '系统管理相关功能权限',
    permissions: mockPermissions.filter(p => p.module === 'system')
  }
]

// 角色定义
export const mockRoles: Role[] = [
  {
    id: 'superAdmin',
    name: 'superAdmin',
    displayName: '超级管理员',
    description: '拥有系统所有权限的最高管理员',
    department: 'system',
    level: 'admin',
    permissions: mockPermissions.map(p => p.id),
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'sales_director',
    name: 'sales_director',
    displayName: '销售总监',
    description: '销售部门总监，负责整个销售部门的管理',
    department: 'sales',
    level: 'director',
    permissions: [
      'dashboard_view', 'dashboard_export',
      'customer_view', 'customer_create', 'customer_edit',
      'project_view', 'project_create', 'project_edit',
      'department_view', 'department_manage',
      'performance_view', 'performance_manage',
      'business_dashboard_view',
      'finance_view'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'sales_manager',
    name: 'sales_manager',
    displayName: '销售经理',
    description: '销售部门经理，负责销售团队管理',
    department: 'sales',
    level: 'manager',
    permissions: [
      'dashboard_view', 'dashboard_export',
      'customer_view', 'customer_create', 'customer_edit',
      'project_view', 'project_create', 'project_edit',
      'department_view',
      'performance_view',
      'business_dashboard_view'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'sales_person',
    name: 'sales_person',
    displayName: '销售专员',
    description: '销售部门专员，负责客户开发和维护',
    department: 'sales',
    level: 'staff',
    permissions: [
      'dashboard_view',
      'customer_view', 'customer_create', 'customer_edit',
      'project_view',
      'business_dashboard_view'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'project_director',
    name: 'project_director',
    displayName: '运营总监',
    description: '运营部门总监，负责整个运营部门的管理',
    department: 'operations',
    level: 'director',
    permissions: [
      'dashboard_view', 'dashboard_export',
      'customer_view',
      'project_view', 'project_create', 'project_edit', 'project_delete',
      'department_view', 'department_manage',
      'performance_view', 'performance_manage',
      'business_dashboard_view'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'project_manager',
    name: 'project_manager',
    displayName: '项目经理',
    description: '运营部门项目经理，负责项目执行管理',
    department: 'operations',
    level: 'manager',
    permissions: [
      'dashboard_view', 'dashboard_export',
      'customer_view',
      'project_view', 'project_create', 'project_edit',
      'department_view',
      'performance_view',
      'business_dashboard_view'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'google_optimizer',
    name: 'google_optimizer',
    displayName: 'Google优化师',
    description: '负责Google广告投放优化',
    department: 'operations',
    level: 'staff',
    permissions: [
      'dashboard_view',
      'customer_view',
      'project_view',
      'business_dashboard_view'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'meta_optimizer',
    name: 'meta_optimizer',
    displayName: 'Meta优化师',
    description: '负责Meta(Facebook)广告投放优化',
    department: 'operations',
    level: 'staff',
    permissions: [
      'dashboard_view',
      'customer_view',
      'project_view',
      'business_dashboard_view'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'bing_optimizer',
    name: 'bing_optimizer',
    displayName: 'Bing优化师',
    description: '负责Bing广告投放优化',
    department: 'operations',
    level: 'staff',
    permissions: [
      'dashboard_view',
      'customer_view',
      'project_view',
      'business_dashboard_view'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'criteo_optimizer',
    name: 'criteo_optimizer',
    displayName: 'Criteo优化师',
    description: '负责Criteo广告投放优化',
    department: 'operations',
    level: 'staff',
    permissions: [
      'dashboard_view',
      'customer_view',
      'project_view',
      'business_dashboard_view'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  },
  {
    id: 'finance_director',
    name: 'finance_director',
    displayName: '财务总监',
    description: '财务部门总监，负责财务管理',
    department: 'finance',
    level: 'director',
    permissions: [
      'dashboard_view', 'dashboard_export',
      'customer_view',
      'project_view',
      'department_view', 'department_manage',
      'performance_view', 'performance_manage',
      'business_dashboard_view',
      'finance_view', 'finance_manage'
    ],
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    status: 'active'
  }
]

// 角色权限配置
export const mockRolePermissionConfigs: RolePermissionConfig[] = mockRoles.map(role => ({
  roleId: role.id,
  permissions: role.permissions,
  lastUpdated: role.updatedAt,
  updatedBy: 'system'
}))

// API 模拟函数
export const roleAPI = {
  // 获取所有角色
  getRoles: async (): Promise<Role[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockRoles])
      }, 300)
    })
  },

  // 获取单个角色
  getRole: async (id: string): Promise<Role | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const role = mockRoles.find(r => r.id === id)
        resolve(role || null)
      }, 200)
    })
  },

  // 创建角色
  createRole: async (roleData: Omit<Role, 'id' | 'createdAt' | 'updatedAt'>): Promise<Role> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const newRole: Role = {
          ...roleData,
          id: `role_${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        mockRoles.push(newRole)
        resolve(newRole)
      }, 500)
    })
  },

  // 更新角色
  updateRole: async (id: string, roleData: Partial<Role>): Promise<Role | null> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockRoles.findIndex(r => r.id === id)
        if (index !== -1) {
          mockRoles[index] = {
            ...mockRoles[index],
            ...roleData,
            updatedAt: new Date().toISOString()
          }
          resolve(mockRoles[index])
        } else {
          resolve(null)
        }
      }, 500)
    })
  },

  // 删除角色
  deleteRole: async (id: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const index = mockRoles.findIndex(r => r.id === id)
        if (index !== -1) {
          mockRoles.splice(index, 1)
          resolve(true)
        } else {
          resolve(false)
        }
      }, 300)
    })
  }
}

// 权限API
export const permissionAPI = {
  // 获取所有权限
  getPermissions: async (): Promise<Permission[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockPermissions])
      }, 200)
    })
  },

  // 获取权限模块
  getPermissionModules: async (): Promise<PermissionModule[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...mockPermissionModules])
      }, 200)
    })
  },

  // 获取角色权限配置
  getRolePermissions: async (roleId: string): Promise<string[]> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const config = mockRolePermissionConfigs.find(c => c.roleId === roleId)
        resolve(config?.permissions || [])
      }, 200)
    })
  },

  // 更新角色权限
  updateRolePermissions: async (roleId: string, permissions: string[]): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const configIndex = mockRolePermissionConfigs.findIndex(c => c.roleId === roleId)
        if (configIndex !== -1) {
          mockRolePermissionConfigs[configIndex] = {
            ...mockRolePermissionConfigs[configIndex],
            permissions,
            lastUpdated: new Date().toISOString(),
            updatedBy: 'admin'
          }

          // 同时更新角色的权限
          const roleIndex = mockRoles.findIndex(r => r.id === roleId)
          if (roleIndex !== -1) {
            mockRoles[roleIndex].permissions = permissions
            mockRoles[roleIndex].updatedAt = new Date().toISOString()
          }

          resolve(true)
        } else {
          resolve(false)
        }
      }, 300)
    })
  }
}
