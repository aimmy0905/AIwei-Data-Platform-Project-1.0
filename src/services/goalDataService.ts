// 目标数据服务 - 实现实时数据更新机制
import { ref, computed } from 'vue'
import type { ProjectGoal, Project } from '@/mock/projects'

// 数据更新频率配置
export const UPDATE_INTERVALS = {
  REAL_TIME: 5 * 60 * 1000, // 5分钟 - 关键指标实时更新
  HOURLY: 60 * 60 * 1000, // 1小时 - 一般指标每小时更新
  DAILY: 24 * 60 * 60 * 1000, // 24小时 - 趋势数据每日更新
} as const

// 数据源接口
interface DataSource {
  sales: number
  cost: number
  roi: number
  profit?: number
  userCount?: number
  timestamp: string
}

// 实时数据缓存
const dataCache = ref<Map<number, DataSource>>(new Map())
const lastUpdateTime = ref<Map<number, number>>(new Map())

// 数据更新状态
const isUpdating = ref(false)
const updateErrors = ref<Map<number, string>>(new Map())

// 订阅者管理
const subscribers = ref<Map<string, (data: any) => void>>(new Map())

/**
 * 目标数据服务类
 */
export class GoalDataService {
  private updateIntervals: Map<number, number> = new Map()
  private retryAttempts: Map<number, number> = new Map()
  private readonly maxRetries = 3

  /**
   * 启动实时数据更新
   */
  startRealTimeUpdates(projectIds: number[] = []) {
    console.log('启动实时数据更新服务', projectIds)

    projectIds.forEach(projectId => {
      this.scheduleUpdate(projectId, UPDATE_INTERVALS.REAL_TIME)
    })
  }

  /**
   * 停止实时数据更新
   */
  stopRealTimeUpdates(projectIds: number[] = []) {
    console.log('停止实时数据更新服务', projectIds)

    projectIds.forEach(projectId => {
      const interval = this.updateIntervals.get(projectId)
      if (interval) {
        clearInterval(interval)
        this.updateIntervals.delete(projectId)
      }
    })
  }

  /**
   * 调度数据更新
   */
  private scheduleUpdate(projectId: number, interval: number) {
    // 清除现有的更新计划
    const existingInterval = this.updateIntervals.get(projectId)
    if (existingInterval) {
      clearInterval(existingInterval)
    }

    // 立即执行一次更新
    this.updateProjectData(projectId)

    // 设置定期更新
    const newInterval = setInterval(() => {
      this.updateProjectData(projectId)
    }, interval)

    this.updateIntervals.set(projectId, newInterval)
  }

  /**
   * 更新项目数据
   */
  private async updateProjectData(projectId: number) {
    try {
      isUpdating.value = true
      updateErrors.value.delete(projectId)

      // 模拟从不同数据源获取实时数据
      const salesData = await this.fetchSalesData(projectId)
      const costData = await this.fetchCostData(projectId)
      const roiData = await this.calculateROI(salesData, costData)
      const profitData = await this.fetchProfitData(projectId)
      const userCountData = await this.fetchUserCountData(projectId)

      const newData: DataSource = {
        sales: salesData,
        cost: costData,
        roi: roiData,
        profit: profitData,
        userCount: userCountData,
        timestamp: new Date().toISOString()
      }

      // 更新缓存
      dataCache.value.set(projectId, newData)
      lastUpdateTime.value.set(projectId, Date.now())

      // 重置重试计数
      this.retryAttempts.delete(projectId)

      // 通知订阅者
      this.notifySubscribers(projectId, newData)

      console.log(`项目 ${projectId} 数据更新成功:`, newData)

    } catch (error) {
      console.error(`项目 ${projectId} 数据更新失败:`, error)
      this.handleUpdateError(projectId, error as Error)
    } finally {
      isUpdating.value = false
    }
  }

  /**
   * 处理更新错误
   */
  private handleUpdateError(projectId: number, error: Error) {
    const attempts = this.retryAttempts.get(projectId) || 0

    if (attempts < this.maxRetries) {
      // 重试机制
      this.retryAttempts.set(projectId, attempts + 1)
      setTimeout(() => {
        this.updateProjectData(projectId)
      }, Math.pow(2, attempts) * 1000) // 指数退避
    } else {
      // 达到最大重试次数，记录错误
      updateErrors.value.set(projectId, error.message)
      this.retryAttempts.delete(projectId)
    }
  }

  /**
   * 获取销售数据
   */
  private async fetchSalesData(projectId: number): Promise<number> {
    // 模拟API调用延迟
    await this.delay(100 + Math.random() * 200)

    // 模拟实时销售数据变化
    const baseValue = 500000 + projectId * 100000
    const variation = (Math.random() - 0.5) * 0.1 // ±5% 变化
    return Math.round(baseValue * (1 + variation))
  }

  /**
   * 获取成本数据
   */
  private async fetchCostData(projectId: number): Promise<number> {
    await this.delay(80 + Math.random() * 150)

    const baseValue = 150000 + projectId * 30000
    const variation = (Math.random() - 0.5) * 0.08 // ±4% 变化
    return Math.round(baseValue * (1 + variation))
  }

  /**
   * 计算ROI
   */
  private async calculateROI(sales: number, cost: number): Promise<number> {
    await this.delay(50)

    if (cost === 0) return 0
    return Math.round((sales / cost) * 100) / 100
  }

  /**
   * 获取利润数据
   */
  private async fetchProfitData(projectId: number): Promise<number> {
    await this.delay(120 + Math.random() * 180)

    const baseValue = 100000 + projectId * 20000
    const variation = (Math.random() - 0.5) * 0.12 // ±6% 变化
    return Math.round(baseValue * (1 + variation))
  }

  /**
   * 获取用户数据
   */
  private async fetchUserCountData(projectId: number): Promise<number> {
    await this.delay(90 + Math.random() * 160)

    const baseValue = 5000 + projectId * 1000
    const variation = (Math.random() - 0.5) * 0.15 // ±7.5% 变化
    return Math.round(baseValue * (1 + variation))
  }

  /**
   * 延迟函数
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 订阅数据更新
   */
  subscribe(key: string, callback: (data: any) => void) {
    subscribers.value.set(key, callback)

    return () => {
      subscribers.value.delete(key)
    }
  }

  /**
   * 通知订阅者
   */
  private notifySubscribers(projectId: number, data: DataSource) {
    subscribers.value.forEach((callback, key) => {
      try {
        callback({ projectId, data })
      } catch (error) {
        console.error(`通知订阅者 ${key} 失败:`, error)
      }
    })
  }

  /**
   * 获取项目的最新数据
   */
  getProjectData(projectId: number): DataSource | null {
    return dataCache.value.get(projectId) || null
  }

  /**
   * 获取数据更新状态
   */
  getUpdateStatus() {
    return {
      isUpdating: isUpdating.value,
      errors: Object.fromEntries(updateErrors.value),
      lastUpdateTimes: Object.fromEntries(lastUpdateTime.value)
    }
  }

  /**
   * 手动刷新数据
   */
  async refreshData(projectId: number) {
    await this.updateProjectData(projectId)
  }

  /**
   * 批量刷新数据
   */
  async refreshAllData(projectIds: number[]) {
    const promises = projectIds.map(id => this.updateProjectData(id))
    await Promise.allSettled(promises)
  }
}

/**
 * 计算目标完成率
 */
export function calculateCompletionRate(
  target: number,
  actual: number
): number {
  if (target === 0) return 0
  return Math.round((actual / target) * 100 * 100) / 100 // 保留两位小数
}

/**
 * 更新目标完成情况
 */
export function updateGoalCompletion(
  goal: ProjectGoal,
  realTimeData: DataSource
): ProjectGoal {
  const updatedGoal = { ...goal }

  // 更新实际值
  updatedGoal.actual_sales = realTimeData.sales
  updatedGoal.actual_cost = realTimeData.cost
  updatedGoal.actual_roi = realTimeData.roi
  updatedGoal.actual_profit = realTimeData.profit || 0
  updatedGoal.actual_user_count = realTimeData.userCount || 0

  // 计算完成率
  updatedGoal.completion_rate = {
    sales: calculateCompletionRate(goal.sales_target, realTimeData.sales),
    cost: calculateCompletionRate(goal.cost_target, realTimeData.cost),
    roi: calculateCompletionRate(goal.roi_target, realTimeData.roi),
    profit: goal.profit_target ? calculateCompletionRate(goal.profit_target, realTimeData.profit || 0) : undefined,
    user_count: goal.user_count_target ? calculateCompletionRate(goal.user_count_target, realTimeData.userCount || 0) : undefined
  }

  return updatedGoal
}

/**
 * 获取目标状态
 */
export function getGoalStatus(completionRate: number): 'excellent' | 'good' | 'warning' | 'danger' {
  if (completionRate >= 110) return 'excellent'
  if (completionRate >= 90) return 'good'
  if (completionRate >= 70) return 'warning'
  return 'danger'
}

/**
 * 检测目标风险
 */
export function detectGoalRisks(goal: ProjectGoal): Array<{
  type: 'completion_risk' | 'trend_risk' | 'balance_risk'
  level: 'high' | 'medium' | 'low'
  message: string
  suggestion: string
}> {
  const risks = []
  const avgCompletion = goal.completion_rate ?
    (goal.completion_rate.sales + goal.completion_rate.cost + goal.completion_rate.roi) / 3 : 0

  // 完成率风险
  if (avgCompletion < 70) {
    risks.push({
      type: 'completion_risk' as const,
      level: 'high' as const,
      message: '目标完成率过低，存在未达标风险',
      suggestion: '建议调整策略或重新设定目标'
    })
  } else if (avgCompletion < 85) {
    risks.push({
      type: 'completion_risk' as const,
      level: 'medium' as const,
      message: '目标完成率偏低，需要关注',
      suggestion: '建议加强执行力度，优化运营策略'
    })
  }

  // 指标平衡风险
  if (goal.completion_rate) {
    const rates = [goal.completion_rate.sales, goal.completion_rate.cost, goal.completion_rate.roi]
    const maxRate = Math.max(...rates)
    const minRate = Math.min(...rates)

    if (maxRate - minRate > 30) {
      risks.push({
        type: 'balance_risk' as const,
        level: 'medium' as const,
        message: '各指标完成率差异较大，发展不平衡',
        suggestion: '建议平衡各项指标的投入和关注度'
      })
    }
  }

  return risks
}

// 创建全局服务实例
export const goalDataService = new GoalDataService()

// 导出响应式状态
export const useGoalDataService = () => {
  return {
    dataCache: computed(() => dataCache.value),
    isUpdating: computed(() => isUpdating.value),
    updateErrors: computed(() => updateErrors.value),
    lastUpdateTime: computed(() => lastUpdateTime.value)
  }
}
