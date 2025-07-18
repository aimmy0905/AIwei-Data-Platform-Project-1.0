// 目标预警服务 - 实现预警功能
import { ref, computed } from 'vue'
import type { ProjectGoal } from '@/mock/projects'

// 预警类型
export type AlertType = 'completion_risk' | 'progress_risk' | 'trend_risk' | 'balance_risk' | 'deadline_risk'

// 预警级别
export type AlertLevel = 'high' | 'medium' | 'low'

// 预警接口
export interface GoalAlert {
  id: string
  projectId: number
  projectName: string
  goalId: number
  goalType: string
  goalPeriod: string
  type: AlertType
  level: AlertLevel
  title: string
  description: string
  suggestion: string
  metric?: string
  currentValue?: number
  targetValue?: number
  completionRate?: number
  createdAt: string
  isRead: boolean
  isDismissed: boolean
}

// 预警配置
export interface AlertConfig {
  completionRateThresholds: {
    high: number    // 高风险阈值
    medium: number  // 中风险阈值
  }
  progressRiskDays: number  // 进度风险天数阈值
  trendRiskPeriods: number  // 趋势风险周期数
  balanceRiskDifference: number  // 平衡风险差异阈值
}

// 默认预警配置
const defaultAlertConfig: AlertConfig = {
  completionRateThresholds: {
    high: 60,     // 完成率低于60%为高风险
    medium: 80    // 完成率低于80%为中风险
  },
  progressRiskDays: 7,      // 7天内无进度为风险
  trendRiskPeriods: 3,      // 连续3个周期下降为趋势风险
  balanceRiskDifference: 30 // 指标间差异超过30%为平衡风险
}

// 预警状态
const alerts = ref<Map<string, GoalAlert>>(new Map())
const alertConfig = ref<AlertConfig>(defaultAlertConfig)
const lastCheckTime = ref<Map<number, number>>(new Map())

// 预警统计
const alertStats = computed(() => {
  const allAlerts = Array.from(alerts.value.values())
  return {
    total: allAlerts.length,
    unread: allAlerts.filter(a => !a.isRead).length,
    high: allAlerts.filter(a => a.level === 'high').length,
    medium: allAlerts.filter(a => a.level === 'medium').length,
    low: allAlerts.filter(a => a.level === 'low').length,
    byType: {
      completion_risk: allAlerts.filter(a => a.type === 'completion_risk').length,
      progress_risk: allAlerts.filter(a => a.type === 'progress_risk').length,
      trend_risk: allAlerts.filter(a => a.type === 'trend_risk').length,
      balance_risk: allAlerts.filter(a => a.type === 'balance_risk').length,
      deadline_risk: allAlerts.filter(a => a.type === 'deadline_risk').length
    }
  }
})

/**
 * 目标预警服务类
 */
export class GoalAlertService {
  private checkIntervals: Map<number, number> = new Map()
  private historicalData: Map<number, Array<{ date: string; completionRate: number }>> = new Map()

  /**
   * 启动预警监控
   */
  startMonitoring(projectIds: number[] = []) {
    console.log('启动目标预警监控', projectIds)

    projectIds.forEach(projectId => {
      this.scheduleCheck(projectId)
    })
  }

  /**
   * 停止预警监控
   */
  stopMonitoring(projectIds: number[] = []) {
    console.log('停止目标预警监控', projectIds)

    projectIds.forEach(projectId => {
      const interval = this.checkIntervals.get(projectId)
      if (interval) {
        clearInterval(interval)
        this.checkIntervals.delete(projectId)
      }
    })
  }

  /**
   * 调度预警检查
   */
  private scheduleCheck(projectId: number) {
    // 清除现有检查
    const existingInterval = this.checkIntervals.get(projectId)
    if (existingInterval) {
      clearInterval(existingInterval)
    }

    // 立即执行一次检查
    this.checkProjectAlerts(projectId)

    // 设置定期检查 (每小时检查一次)
    const interval = setInterval(() => {
      this.checkProjectAlerts(projectId)
    }, 60 * 60 * 1000)

    this.checkIntervals.set(projectId, interval)
  }

  /**
   * 检查项目预警
   */
  private async checkProjectAlerts(projectId: number) {
    try {
      // 获取项目目标数据
      const goals = await this.getProjectGoals(projectId)

      for (const goal of goals) {
        await this.checkGoalAlerts(goal)
      }

      lastCheckTime.value.set(projectId, Date.now())
      console.log(`项目 ${projectId} 预警检查完成`)

    } catch (error) {
      console.error(`项目 ${projectId} 预警检查失败:`, error)
    }
  }

  /**
   * 检查单个目标的预警
   */
  private async checkGoalAlerts(goal: ProjectGoal) {
    const checks = [
      () => this.checkCompletionRisk(goal),
      () => this.checkProgressRisk(goal),
      () => this.checkTrendRisk(goal),
      () => this.checkBalanceRisk(goal),
      () => this.checkDeadlineRisk(goal)
    ]

    for (const check of checks) {
      try {
        await check()
      } catch (error) {
        console.error(`目标 ${goal.id} 预警检查失败:`, error)
      }
    }
  }

  /**
   * 检查完成率风险
   */
  private checkCompletionRisk(goal: ProjectGoal) {
    if (!goal.completion_rate) return

    const avgCompletionRate = (
      goal.completion_rate.sales +
      goal.completion_rate.cost +
      goal.completion_rate.roi
    ) / 3

    let level: AlertLevel | null = null
    let title = ''
    let description = ''
    let suggestion = ''

    if (avgCompletionRate < alertConfig.value.completionRateThresholds.high) {
      level = 'high'
      title = '目标完成率严重偏低'
      description = `${goal.project_name}的${goal.goal_type}目标平均完成率仅为${avgCompletionRate.toFixed(1)}%，存在严重未达标风险`
      suggestion = '建议立即调整策略，重新评估目标设定的合理性，或增加资源投入'
    } else if (avgCompletionRate < alertConfig.value.completionRateThresholds.medium) {
      level = 'medium'
      title = '目标完成率偏低'
      description = `${goal.project_name}的${goal.goal_type}目标平均完成率为${avgCompletionRate.toFixed(1)}%，需要关注`
      suggestion = '建议优化执行策略，加强过程监控，确保目标按期达成'
    }

    if (level) {
      this.createAlert({
        projectId: goal.project_id,
        projectName: goal.project_name,
        goalId: goal.id,
        goalType: goal.goal_type,
        goalPeriod: goal.goal_period,
        type: 'completion_risk',
        level,
        title,
        description,
        suggestion,
        completionRate: avgCompletionRate
      })
    }
  }

  /**
   * 检查进度风险
   */
  private checkProgressRisk(goal: ProjectGoal) {
    // 模拟检查进度停滞情况
    const daysSinceLastUpdate = this.getDaysSinceLastUpdate(goal.id)

    if (daysSinceLastUpdate > alertConfig.value.progressRiskDays) {
      this.createAlert({
        projectId: goal.project_id,
        projectName: goal.project_name,
        goalId: goal.id,
        goalType: goal.goal_type,
        goalPeriod: goal.goal_period,
        type: 'progress_risk',
        level: daysSinceLastUpdate > 14 ? 'high' : 'medium',
        title: '目标进度停滞',
        description: `${goal.project_name}的${goal.goal_type}目标已${daysSinceLastUpdate}天未更新进度`,
        suggestion: '建议检查执行情况，确认是否存在执行障碍，及时调整计划'
      })
    }
  }

  /**
   * 检查趋势风险
   */
  private checkTrendRisk(goal: ProjectGoal) {
    const historicalRates = this.getHistoricalCompletionRates(goal.id)

    if (historicalRates.length >= alertConfig.value.trendRiskPeriods) {
      const recentRates = historicalRates.slice(-alertConfig.value.trendRiskPeriods)
      const isDecreasingTrend = this.isDecreasingTrend(recentRates)

      if (isDecreasingTrend) {
        const trendSlope = this.calculateTrendSlope(recentRates)

        this.createAlert({
          projectId: goal.project_id,
          projectName: goal.project_name,
          goalId: goal.id,
          goalType: goal.goal_type,
          goalPeriod: goal.goal_period,
          type: 'trend_risk',
          level: Math.abs(trendSlope) > 10 ? 'high' : 'medium',
          title: '目标完成率持续下降',
          description: `${goal.project_name}的${goal.goal_type}目标完成率连续${alertConfig.value.trendRiskPeriods}个周期下降`,
          suggestion: '建议分析下降原因，及时调整策略，防止进一步恶化'
        })
      }
    }
  }

  /**
   * 检查平衡风险
   */
  private checkBalanceRisk(goal: ProjectGoal) {
    if (!goal.completion_rate) return

    const rates = [
      goal.completion_rate.sales,
      goal.completion_rate.cost,
      goal.completion_rate.roi
    ]

    const maxRate = Math.max(...rates)
    const minRate = Math.min(...rates)
    const difference = maxRate - minRate

    if (difference > alertConfig.value.balanceRiskDifference) {
      this.createAlert({
        projectId: goal.project_id,
        projectName: goal.project_name,
        goalId: goal.id,
        goalType: goal.goal_type,
        goalPeriod: goal.goal_period,
        type: 'balance_risk',
        level: difference > 50 ? 'high' : 'medium',
        title: '目标指标发展不平衡',
        description: `${goal.project_name}的${goal.goal_type}目标各指标完成率差异达${difference.toFixed(1)}%`,
        suggestion: '建议平衡各项指标的投入，避免单一指标过度优化'
      })
    }
  }

  /**
   * 检查截止日期风险
   */
  private checkDeadlineRisk(goal: ProjectGoal) {
    const daysRemaining = this.getDaysRemaining(goal.goal_period)
    const avgCompletionRate = goal.completion_rate ?
      (goal.completion_rate.sales + goal.completion_rate.cost + goal.completion_rate.roi) / 3 : 0

    // 根据剩余时间和完成率评估风险
    const expectedCompletionRate = this.calculateExpectedCompletionRate(daysRemaining)

    if (avgCompletionRate < expectedCompletionRate - 20) {
      this.createAlert({
        projectId: goal.project_id,
        projectName: goal.project_name,
        goalId: goal.id,
        goalType: goal.goal_type,
        goalPeriod: goal.goal_period,
        type: 'deadline_risk',
        level: daysRemaining < 7 ? 'high' : 'medium',
        title: '目标达成时间风险',
        description: `${goal.project_name}的${goal.goal_type}目标剩余${daysRemaining}天，但完成率仅为${avgCompletionRate.toFixed(1)}%`,
        suggestion: '建议加快执行进度，或考虑调整目标期限'
      })
    }
  }

  /**
   * 创建预警
   */
  private createAlert(alertData: Omit<GoalAlert, 'id' | 'createdAt' | 'isRead' | 'isDismissed'>) {
    const alertId = `${alertData.projectId}-${alertData.goalId}-${alertData.type}-${Date.now()}`

    // 检查是否已存在相同类型的预警
    const existingAlert = Array.from(alerts.value.values()).find(
      alert => alert.projectId === alertData.projectId &&
               alert.goalId === alertData.goalId &&
               alert.type === alertData.type &&
               !alert.isDismissed
    )

    if (existingAlert) {
      // 更新现有预警
      existingAlert.description = alertData.description
      existingAlert.level = alertData.level
      existingAlert.suggestion = alertData.suggestion
      existingAlert.completionRate = alertData.completionRate
      alerts.value.set(existingAlert.id, existingAlert)
    } else {
      // 创建新预警
      const newAlert: GoalAlert = {
        ...alertData,
        id: alertId,
        createdAt: new Date().toISOString(),
        isRead: false,
        isDismissed: false
      }

      alerts.value.set(alertId, newAlert)
      console.log('创建新预警:', newAlert)
    }
  }

  /**
   * 获取项目目标数据 (模拟)
   */
  private async getProjectGoals(projectId: number): Promise<ProjectGoal[]> {
    // 这里应该从实际的数据源获取目标数据
    // 目前使用模拟数据
    const { mockProjectGoals } = await import('@/mock/projects')
    return mockProjectGoals.filter(goal => goal.project_id === projectId)
  }

  /**
   * 获取距离上次更新的天数 (模拟)
   */
  private getDaysSinceLastUpdate(goalId: number): number {
    // 模拟数据，实际应该从数据库获取
    return Math.floor(Math.random() * 10)
  }

  /**
   * 获取历史完成率数据 (模拟)
   */
  private getHistoricalCompletionRates(goalId: number): number[] {
    // 模拟历史数据
    const data = this.historicalData.get(goalId)
    if (data) {
      return data.map(d => d.completionRate)
    }

    // 生成模拟的下降趋势数据
    return [95, 90, 85, 80, 75]
  }

  /**
   * 判断是否为下降趋势
   */
  private isDecreasingTrend(rates: number[]): boolean {
    if (rates.length < 2) return false

    for (let i = 1; i < rates.length; i++) {
      if (rates[i] >= rates[i - 1]) {
        return false
      }
    }
    return true
  }

  /**
   * 计算趋势斜率
   */
  private calculateTrendSlope(rates: number[]): number {
    if (rates.length < 2) return 0

    const firstRate = rates[0]
    const lastRate = rates[rates.length - 1]
    return ((lastRate - firstRate) / firstRate) * 100
  }

  /**
   * 获取剩余天数 (模拟)
   */
  private getDaysRemaining(goalPeriod: string): number {
    // 简单模拟，实际应该根据目标周期计算
    return Math.floor(Math.random() * 30) + 1
  }

  /**
   * 计算期望完成率
   */
  private calculateExpectedCompletionRate(daysRemaining: number): number {
    // 简单的线性期望模型
    const totalDays = 30 // 假设总周期为30天
    const elapsedDays = totalDays - daysRemaining
    return (elapsedDays / totalDays) * 100
  }

  /**
   * 标记预警为已读
   */
  markAsRead(alertId: string) {
    const alert = alerts.value.get(alertId)
    if (alert) {
      alert.isRead = true
      alerts.value.set(alertId, alert)
    }
  }

  /**
   * 标记所有预警为已读
   */
  markAllAsRead(projectId?: number) {
    alerts.value.forEach((alert, id) => {
      if (!projectId || alert.projectId === projectId) {
        alert.isRead = true
        alerts.value.set(id, alert)
      }
    })
  }

  /**
   * 忽略预警
   */
  dismissAlert(alertId: string) {
    const alert = alerts.value.get(alertId)
    if (alert) {
      alert.isDismissed = true
      alerts.value.set(alertId, alert)
    }
  }

  /**
   * 获取项目预警
   */
  getProjectAlerts(projectId: number): GoalAlert[] {
    return Array.from(alerts.value.values())
      .filter(alert => alert.projectId === projectId && !alert.isDismissed)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  /**
   * 获取所有预警
   */
  getAllAlerts(): GoalAlert[] {
    return Array.from(alerts.value.values())
      .filter(alert => !alert.isDismissed)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  /**
   * 更新预警配置
   */
  updateConfig(newConfig: Partial<AlertConfig>) {
    alertConfig.value = { ...alertConfig.value, ...newConfig }
  }

  /**
   * 获取预警统计
   */
  getAlertStats() {
    return alertStats.value
  }

  /**
   * 手动触发预警检查
   */
  async triggerCheck(projectId: number) {
    await this.checkProjectAlerts(projectId)
  }
}

// 创建全局服务实例
export const goalAlertService = new GoalAlertService()

// 导出响应式状态
export const useGoalAlertService = () => {
  return {
    alerts: computed(() => Array.from(alerts.value.values())),
    alertStats: computed(() => alertStats.value),
    alertConfig: computed(() => alertConfig.value)
  }
}
