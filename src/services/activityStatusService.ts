import type { Activity, User } from '@/types'

// 活动状态类型
export type ActivityStatus = 'warm_up' | 'running' | 'ended' | 'cancelled'

// 活动状态流转规则
export interface StatusTransition {
  from: ActivityStatus
  to: ActivityStatus
  label: string
  description: string
  requiredRoles: string[]
  confirmMessage?: string
  requiresReason?: boolean
}

// 用户角色权限定义
export const USER_ROLES = {
  SUPER_ADMIN: 'superAdmin',
  MANAGER: 'manager',
  STAFF: 'staff',
  FINANCE: 'finance',
  SALES: 'sales'
} as const

// 状态流转规则配置
export const STATUS_TRANSITIONS: StatusTransition[] = [
  {
    from: 'warm_up',
    to: 'running',
    label: '开始活动',
    description: '将活动从预热阶段转为正式进行',
    requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MANAGER, USER_ROLES.STAFF],
    confirmMessage: '确定要开始这个活动吗？活动开始后将无法修改基础配置。'
  },
  {
    from: 'running',
    to: 'ended',
    label: '结束活动',
    description: '正常结束活动',
    requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MANAGER, USER_ROLES.STAFF],
    confirmMessage: '确定要结束这个活动吗？活动结束后将无法再次启动。',
    requiresReason: true
  },
  {
    from: 'warm_up',
    to: 'cancelled',
    label: '取消活动',
    description: '取消预热中的活动',
    requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MANAGER],
    confirmMessage: '确定要取消这个活动吗？取消后活动将无法恢复。',
    requiresReason: true
  },
  {
    from: 'running',
    to: 'cancelled',
    label: '取消活动',
    description: '取消正在进行的活动',
    requiredRoles: [USER_ROLES.SUPER_ADMIN, USER_ROLES.MANAGER],
    confirmMessage: '确定要取消这个正在进行的活动吗？这可能会影响用户体验。',
    requiresReason: true
  }
]

// 状态文本映射
export const STATUS_TEXT_MAP: Record<ActivityStatus, string> = {
  warm_up: '预热中',
  running: '进行中',
  ended: '已结束',
  cancelled: '已取消'
}

// 状态颜色映射
export const STATUS_COLOR_MAP: Record<ActivityStatus, string> = {
  warm_up: 'warning',
  running: 'success',
  ended: 'info',
  cancelled: 'danger'
}

/**
 * 活动状态管理服务类
 */
export class ActivityStatusService {
  /**
   * 获取指定状态的可用转换选项
   */
  static getAvailableTransitions(currentStatus: ActivityStatus, userRole: string): StatusTransition[] {
    return STATUS_TRANSITIONS.filter(transition =>
      transition.from === currentStatus &&
      transition.requiredRoles.includes(userRole)
    )
  }

  /**
   * 检查用户是否有权限执行状态转换
   */
  static canTransition(
    from: ActivityStatus,
    to: ActivityStatus,
    userRole: string
  ): boolean {
    const transition = STATUS_TRANSITIONS.find(
      t => t.from === from && t.to === to
    )

    if (!transition) {
      return false
    }

    return transition.requiredRoles.includes(userRole)
  }

  /**
   * 验证状态转换是否合法
   */
  static isValidTransition(from: ActivityStatus, to: ActivityStatus): boolean {
    return STATUS_TRANSITIONS.some(
      transition => transition.from === from && transition.to === to
    )
  }

  /**
   * 获取状态转换配置
   */
  static getTransitionConfig(from: ActivityStatus, to: ActivityStatus): StatusTransition | null {
    return STATUS_TRANSITIONS.find(
      transition => transition.from === from && transition.to === to
    ) || null
  }

  /**
   * 检查活动是否可以编辑
   */
  static canEditActivity(activity: Activity, userRole: string): boolean {
    // 超级管理员可以编辑所有活动
    if (userRole === USER_ROLES.SUPER_ADMIN) {
      return true
    }

    // 已结束或已取消的活动不能编辑基础信息
    if (activity.status === 'ended' || activity.status === 'cancelled') {
      return false
    }

    // 管理员和员工可以编辑预热中的活动
    if (activity.status === 'warm_up') {
      return [USER_ROLES.MANAGER, USER_ROLES.STAFF].includes(userRole as any)
    }

    // 进行中的活动只能编辑部分信息
    if (activity.status === 'running') {
      return [USER_ROLES.MANAGER, USER_ROLES.STAFF].includes(userRole as any)
    }

    return false
  }

  /**
   * 检查活动是否可以删除
   */
  static canDeleteActivity(activity: Activity, userRole: string): boolean {
    // 只有预热中的活动可以删除
    if (activity.status !== 'warm_up') {
      return false
    }

    // 超级管理员和管理员可以删除
    return [USER_ROLES.SUPER_ADMIN, USER_ROLES.MANAGER].includes(userRole as any)
  }

  /**
   * 获取活动操作权限
   */
  static getActivityPermissions(activity: Activity, user: User) {
    const userRole = user.role

    return {
      canView: true, // 所有用户都可以查看
      canEdit: this.canEditActivity(activity, userRole),
      canDelete: this.canDeleteActivity(activity, userRole),
      canChangeStatus: this.getAvailableTransitions(activity.status, userRole).length > 0,
      availableTransitions: this.getAvailableTransitions(activity.status, userRole)
    }
  }

  /**
   * 验证状态变更请求
   */
  static validateStatusChange(
    activity: Activity,
    newStatus: ActivityStatus,
    user: User,
    reason?: string
  ): { valid: boolean; error?: string } {
    // 检查状态是否相同
    if (activity.status === newStatus) {
      return { valid: false, error: '活动已经是该状态' }
    }

    // 检查状态转换是否合法
    if (!this.isValidTransition(activity.status, newStatus)) {
      return { valid: false, error: '不支持的状态转换' }
    }

    // 检查用户权限
    if (!this.canTransition(activity.status, newStatus, user.role)) {
      return { valid: false, error: '您没有权限执行此操作' }
    }

    // 检查是否需要填写原因
    const transition = this.getTransitionConfig(activity.status, newStatus)
    if (transition?.requiresReason && !reason?.trim()) {
      return { valid: false, error: '请填写状态变更原因' }
    }

    return { valid: true }
  }

  /**
   * 获取状态显示文本
   */
  static getStatusText(status: ActivityStatus): string {
    return STATUS_TEXT_MAP[status] || status
  }

  /**
   * 获取状态颜色类型
   */
  static getStatusColor(status: ActivityStatus): string {
    return STATUS_COLOR_MAP[status] || 'default'
  }

  /**
   * 检查活动是否已过期
   */
  static isActivityExpired(activity: Activity): boolean {
    const now = new Date()
    const endTime = new Date(activity.endTime)
    return endTime < now && activity.status === 'running'
  }

  /**
   * 获取活动状态建议
   */
  static getStatusSuggestions(activity: Activity): string[] {
    const suggestions: string[] = []

    // 检查是否过期
    if (this.isActivityExpired(activity)) {
      suggestions.push('活动已过期，建议结束活动')
    }

    // 检查预热时间
    const now = new Date()
    const startTime = new Date(activity.startTime)
    if (activity.status === 'warm_up' && startTime <= now) {
      suggestions.push('活动开始时间已到，建议开始活动')
    }

    return suggestions
  }
}

/**
 * 状态变更记录接口
 */
export interface StatusChangeRecord {
  id: number
  activityId: number
  activityName: string
  fromStatus: ActivityStatus
  toStatus: ActivityStatus
  operatorId: number
  operatorName: string
  reason?: string
  timestamp: string
  ipAddress?: string
}

/**
 * 状态变更历史服务
 */
export class StatusChangeHistoryService {
  private static records: StatusChangeRecord[] = []
  private static nextId = 1

  /**
   * 记录状态变更
   */
  static recordStatusChange(
    activity: Activity,
    fromStatus: ActivityStatus,
    toStatus: ActivityStatus,
    operator: User,
    reason?: string
  ): StatusChangeRecord {
    const record: StatusChangeRecord = {
      id: this.nextId++,
      activityId: activity.id,
      activityName: activity.name,
      fromStatus,
      toStatus,
      operatorId: operator.id,
      operatorName: operator.username,
      reason,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1' // 实际项目中应该获取真实IP
    }

    this.records.unshift(record)
    return record
  }

  /**
   * 获取活动的状态变更历史
   */
  static getActivityHistory(activityId: number): StatusChangeRecord[] {
    return this.records.filter(record => record.activityId === activityId)
  }

  /**
   * 获取所有状态变更记录
   */
  static getAllRecords(page: number = 1, pageSize: number = 20): {
    records: StatusChangeRecord[]
    total: number
    page: number
    pageSize: number
  } {
    const start = (page - 1) * pageSize
    const end = start + pageSize

    return {
      records: this.records.slice(start, end),
      total: this.records.length,
      page,
      pageSize
    }
  }

  /**
   * 获取用户的操作记录
   */
  static getUserRecords(userId: number): StatusChangeRecord[] {
    return this.records.filter(record => record.operatorId === userId)
  }
}

// 导出默认实例
export const activityStatusService = ActivityStatusService
export const statusChangeHistoryService = StatusChangeHistoryService
