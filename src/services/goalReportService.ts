// 目标分析报告自动生成服务
import { ref, computed } from 'vue'
import type { ProjectGoal, Project } from '@/mock/projects'
import { goalDataService } from './goalDataService'
import { goalAlertService } from './goalAlertService'

// 报告类型
export type ReportType = 'weekly' | 'monthly' | 'quarterly' | 'yearly'

// 报告状态
export type ReportStatus = 'generating' | 'completed' | 'failed' | 'scheduled'

// 报告接口
export interface GoalReport {
  id: string
  type: ReportType
  title: string
  period: string
  startDate: string
  endDate: string
  projectIds: number[]
  status: ReportStatus
  content: ReportContent
  createdAt: string
  generatedBy: string
  downloadUrl?: string
  emailSent?: boolean
}

// 报告内容接口
export interface ReportContent {
  summary: ReportSummary
  trendAnalysis: TrendAnalysis
  projectRankings: ProjectRanking[]
  riskIdentification: RiskIdentification
  improvementSuggestions: ImprovementSuggestion[]
  keyInsights: string[]
  charts: ChartData[]
}

// 报告摘要
export interface ReportSummary {
  totalProjects: number
  totalGoals: number
  averageCompletionRate: number
  completionRateChange: number
  excellentProjects: number
  riskProjects: number
  keyMetrics: {
    salesCompletion: number
    costCompletion: number
    roiCompletion: number
    profitCompletion: number
  }
}

// 趋势分析
export interface TrendAnalysis {
  overallTrend: 'improving' | 'stable' | 'declining'
  trendStrength: number
  periodComparison: {
    current: number
    previous: number
    change: number
  }
  metricTrends: {
    sales: TrendMetric
    cost: TrendMetric
    roi: TrendMetric
    profit: TrendMetric
  }
}

// 趋势指标
export interface TrendMetric {
  direction: 'up' | 'down' | 'stable'
  changeRate: number
  significance: 'high' | 'medium' | 'low'
}

// 项目排名
export interface ProjectRanking {
  projectId: number
  projectName: string
  customerName: string
  rank: number
  completionRate: number
  change: number
  category: 'top_performer' | 'improved' | 'at_risk' | 'declining'
}

// 风险识别
export interface RiskIdentification {
  highRiskProjects: number
  mediumRiskProjects: number
  lowRiskProjects: number
  riskFactors: Array<{
    factor: string
    impact: 'high' | 'medium' | 'low'
    affectedProjects: number
    description: string
  }>
  earlyWarnings: Array<{
    projectId: number
    projectName: string
    warning: string
    recommendedAction: string
  }>
}

// 改进建议
export interface ImprovementSuggestion {
  id: string
  category: 'strategy' | 'execution' | 'resource' | 'process'
  priority: 'high' | 'medium' | 'low'
  title: string
  description: string
  expectedImpact: string
  implementationEffort: 'low' | 'medium' | 'high'
  timeline: string
  affectedProjects: number[]
}

// 图表数据
export interface ChartData {
  type: 'line' | 'bar' | 'pie' | 'area' | 'radar'
  title: string
  data: any
  insights: string[]
}

// 报告配置
export interface ReportConfig {
  autoGeneration: {
    weekly: boolean
    monthly: boolean
    quarterly: boolean
    yearly: boolean
  }
  recipients: string[]
  deliveryTime: string
  includeCharts: boolean
  includeRawData: boolean
  format: 'pdf' | 'html' | 'excel'
}

// 响应式状态
const reports = ref<Map<string, GoalReport>>(new Map())
const reportConfig = ref<ReportConfig>({
  autoGeneration: {
    weekly: true,
    monthly: true,
    quarterly: true,
    yearly: true
  },
  recipients: [],
  deliveryTime: '09:00',
  includeCharts: true,
  includeRawData: false,
  format: 'pdf'
})

const generationQueue = ref<Array<{ type: ReportType; period: string; projectIds: number[] }>>([])
const isGenerating = ref(false)

/**
 * 目标报告生成服务类
 */
export class GoalReportService {
  private scheduledJobs: Map<string, number> = new Map()

  /**
   * 初始化自动报告生成
   */
  initializeAutoGeneration() {
    console.log('初始化自动报告生成服务')

    // 设置定时任务
    this.scheduleWeeklyReports()
    this.scheduleMonthlyReports()
    this.scheduleQuarterlyReports()
    this.scheduleYearlyReports()
  }

  /**
   * 停止自动报告生成
   */
  stopAutoGeneration() {
    console.log('停止自动报告生成服务')

    this.scheduledJobs.forEach((jobId, key) => {
      clearInterval(jobId)
    })
    this.scheduledJobs.clear()
  }

  /**
   * 调度周度报告
   */
  private scheduleWeeklyReports() {
    if (!reportConfig.value.autoGeneration.weekly) return

    // 每周一生成上周报告
    const interval = setInterval(() => {
      const now = new Date()
      if (now.getDay() === 1) { // 周一
        this.generateWeeklyReport()
      }
    }, 24 * 60 * 60 * 1000) // 每天检查一次

    this.scheduledJobs.set('weekly', interval)
  }

  /**
   * 调度月度报告
   */
  private scheduleMonthlyReports() {
    if (!reportConfig.value.autoGeneration.monthly) return

    const interval = setInterval(() => {
      const now = new Date()
      if (now.getDate() === 1) { // 每月1号
        this.generateMonthlyReport()
      }
    }, 24 * 60 * 60 * 1000)

    this.scheduledJobs.set('monthly', interval)
  }

  /**
   * 调度季度报告
   */
  private scheduleQuarterlyReports() {
    if (!reportConfig.value.autoGeneration.quarterly) return

    const interval = setInterval(() => {
      const now = new Date()
      const month = now.getMonth()
      if (now.getDate() === 1 && (month === 0 || month === 3 || month === 6 || month === 9)) {
        this.generateQuarterlyReport()
      }
    }, 24 * 60 * 60 * 1000)

    this.scheduledJobs.set('quarterly', interval)
  }

  /**
   * 调度年度报告
   */
  private scheduleYearlyReports() {
    if (!reportConfig.value.autoGeneration.yearly) return

    const interval = setInterval(() => {
      const now = new Date()
      if (now.getMonth() === 0 && now.getDate() === 1) { // 每年1月1日
        this.generateYearlyReport()
      }
    }, 24 * 60 * 60 * 1000)

    this.scheduledJobs.set('yearly', interval)
  }

  /**
   * 生成周度报告
   */
  async generateWeeklyReport(projectIds?: number[]) {
    const period = this.getWeekPeriod()
    return this.generateReport('weekly', period, projectIds)
  }

  /**
   * 生成月度报告
   */
  async generateMonthlyReport(projectIds?: number[]) {
    const period = this.getMonthPeriod()
    return this.generateReport('monthly', period, projectIds)
  }

  /**
   * 生成季度报告
   */
  async generateQuarterlyReport(projectIds?: number[]) {
    const period = this.getQuarterPeriod()
    return this.generateReport('quarterly', period, projectIds)
  }

  /**
   * 生成年度报告
   */
  async generateYearlyReport(projectIds?: number[]) {
    const period = this.getYearPeriod()
    return this.generateReport('yearly', period, projectIds)
  }

  /**
   * 生成报告
   */
  private async generateReport(
    type: ReportType,
    period: string,
    projectIds?: number[]
  ): Promise<GoalReport> {
    const reportId = `${type}-${period}-${Date.now()}`

    try {
      isGenerating.value = true

      // 创建报告记录
      const report: GoalReport = {
        id: reportId,
        type,
        title: this.getReportTitle(type, period),
        period,
        startDate: this.getPeriodStartDate(type, period),
        endDate: this.getPeriodEndDate(type, period),
        projectIds: projectIds || await this.getAllProjectIds(),
        status: 'generating',
        content: {} as ReportContent,
        createdAt: new Date().toISOString(),
        generatedBy: '系统自动生成'
      }

      reports.value.set(reportId, report)

      // 生成报告内容
      const content = await this.generateReportContent(report)
      report.content = content
      report.status = 'completed'

      // 生成下载链接
      report.downloadUrl = await this.generateDownloadUrl(report)

      // 发送邮件通知
      if (reportConfig.value.recipients.length > 0) {
        await this.sendReportEmail(report)
        report.emailSent = true
      }

      reports.value.set(reportId, report)
      console.log(`${type}报告生成完成:`, reportId)

      return report

    } catch (error) {
      console.error(`生成${type}报告失败:`, error)

      const report = reports.value.get(reportId)
      if (report) {
        report.status = 'failed'
        reports.value.set(reportId, report)
      }

      throw error
    } finally {
      isGenerating.value = false
    }
  }

  /**
   * 生成报告内容
   */
  private async generateReportContent(report: GoalReport): Promise<ReportContent> {
    // 获取项目目标数据
    const goals = await this.getGoalsData(report.projectIds, report.startDate, report.endDate)
    const projects = await this.getProjectsData(report.projectIds)

    // 生成各部分内容
    const summary = await this.generateSummary(goals, projects)
    const trendAnalysis = await this.generateTrendAnalysis(goals, report.type)
    const projectRankings = await this.generateProjectRankings(goals, projects)
    const riskIdentification = await this.generateRiskIdentification(goals)
    const improvementSuggestions = await this.generateImprovementSuggestions(goals, projects)
    const keyInsights = await this.generateKeyInsights(summary, trendAnalysis, riskIdentification)
    const charts = await this.generateCharts(goals, report.type)

    return {
      summary,
      trendAnalysis,
      projectRankings,
      riskIdentification,
      improvementSuggestions,
      keyInsights,
      charts
    }
  }

  /**
   * 生成报告摘要
   */
  private async generateSummary(goals: ProjectGoal[], projects: Project[]): Promise<ReportSummary> {
    const totalProjects = projects.length
    const totalGoals = goals.length

    // 计算平均完成率
    const completionRates = goals.map(goal => {
      if (!goal.completion_rate) return 0
      return (goal.completion_rate.sales + goal.completion_rate.cost + goal.completion_rate.roi) / 3
    })

    const averageCompletionRate = completionRates.length > 0
      ? completionRates.reduce((sum, rate) => sum + rate, 0) / completionRates.length
      : 0

    // 计算各指标平均完成率
    const salesCompletion = goals.reduce((sum, goal) => sum + (goal.completion_rate?.sales || 0), 0) / goals.length
    const costCompletion = goals.reduce((sum, goal) => sum + (goal.completion_rate?.cost || 0), 0) / goals.length
    const roiCompletion = goals.reduce((sum, goal) => sum + (goal.completion_rate?.roi || 0), 0) / goals.length
    const profitCompletion = goals.reduce((sum, goal) => sum + (goal.completion_rate?.profit || 0), 0) / goals.length

    // 统计优秀和风险项目
    const excellentProjects = completionRates.filter(rate => rate >= 110).length
    const riskProjects = completionRates.filter(rate => rate < 70).length

    // 模拟环比变化
    const completionRateChange = (Math.random() - 0.5) * 10 // ±5%

    return {
      totalProjects,
      totalGoals,
      averageCompletionRate: Math.round(averageCompletionRate * 100) / 100,
      completionRateChange: Math.round(completionRateChange * 100) / 100,
      excellentProjects,
      riskProjects,
      keyMetrics: {
        salesCompletion: Math.round(salesCompletion * 100) / 100,
        costCompletion: Math.round(costCompletion * 100) / 100,
        roiCompletion: Math.round(roiCompletion * 100) / 100,
        profitCompletion: Math.round(profitCompletion * 100) / 100
      }
    }
  }

  /**
   * 生成趋势分析
   */
  private async generateTrendAnalysis(goals: ProjectGoal[], reportType: ReportType): Promise<TrendAnalysis> {
    // 模拟趋势数据生成
    const currentAvg = goals.reduce((sum, goal) => {
      if (!goal.completion_rate) return sum
      return sum + (goal.completion_rate.sales + goal.completion_rate.cost + goal.completion_rate.roi) / 3
    }, 0) / goals.length

    const previousAvg = currentAvg + (Math.random() - 0.5) * 20 // 模拟上期数据
    const change = currentAvg - previousAvg

    const overallTrend: 'improving' | 'stable' | 'declining' =
      change > 5 ? 'improving' : change < -5 ? 'declining' : 'stable'

    return {
      overallTrend,
      trendStrength: Math.abs(change),
      periodComparison: {
        current: Math.round(currentAvg * 100) / 100,
        previous: Math.round(previousAvg * 100) / 100,
        change: Math.round(change * 100) / 100
      },
      metricTrends: {
        sales: this.generateMetricTrend(),
        cost: this.generateMetricTrend(),
        roi: this.generateMetricTrend(),
        profit: this.generateMetricTrend()
      }
    }
  }

  /**
   * 生成指标趋势
   */
  private generateMetricTrend(): TrendMetric {
    const changeRate = (Math.random() - 0.5) * 20
    const direction: 'up' | 'down' | 'stable' =
      changeRate > 2 ? 'up' : changeRate < -2 ? 'down' : 'stable'
    const significance: 'high' | 'medium' | 'low' =
      Math.abs(changeRate) > 10 ? 'high' : Math.abs(changeRate) > 5 ? 'medium' : 'low'

    return {
      direction,
      changeRate: Math.round(changeRate * 100) / 100,
      significance
    }
  }

  /**
   * 生成项目排名
   */
  private async generateProjectRankings(goals: ProjectGoal[], projects: Project[]): Promise<ProjectRanking[]> {
    const projectCompletions = new Map<number, { rate: number; change: number }>()

    // 计算每个项目的完成率
    goals.forEach(goal => {
      if (!goal.completion_rate) return

      const rate = (goal.completion_rate.sales + goal.completion_rate.cost + goal.completion_rate.roi) / 3
      const existing = projectCompletions.get(goal.project_id)

      if (existing) {
        existing.rate = (existing.rate + rate) / 2
      } else {
        projectCompletions.set(goal.project_id, {
          rate,
          change: (Math.random() - 0.5) * 20 // 模拟变化
        })
      }
    })

    // 生成排名
    const rankings: ProjectRanking[] = []
    let rank = 1

    Array.from(projectCompletions.entries())
      .sort(([, a], [, b]) => b.rate - a.rate)
      .forEach(([projectId, data]) => {
        const project = projects.find(p => p.id === projectId)
        if (!project) return

        const category: ProjectRanking['category'] =
          data.rate >= 100 ? 'top_performer' :
          data.change > 10 ? 'improved' :
          data.rate < 70 ? 'at_risk' :
          data.change < -10 ? 'declining' : 'top_performer'

        rankings.push({
          projectId,
          projectName: project.project_name,
          customerName: project.customer_name,
          rank: rank++,
          completionRate: Math.round(data.rate * 100) / 100,
          change: Math.round(data.change * 100) / 100,
          category
        })
      })

    return rankings
  }

  /**
   * 生成风险识别
   */
  private async generateRiskIdentification(goals: ProjectGoal[]): Promise<RiskIdentification> {
    // 获取预警数据
    const alerts = goalAlertService.getAllAlerts()

    const highRiskProjects = alerts.filter(a => a.level === 'high').length
    const mediumRiskProjects = alerts.filter(a => a.level === 'medium').length
    const lowRiskProjects = alerts.filter(a => a.level === 'low').length

    // 分析风险因素
    const riskFactors = [
      {
        factor: '完成率持续下降',
        impact: 'high' as const,
        affectedProjects: alerts.filter(a => a.type === 'trend_risk').length,
        description: '多个项目出现完成率连续下降趋势，需要重点关注'
      },
      {
        factor: '指标发展不平衡',
        impact: 'medium' as const,
        affectedProjects: alerts.filter(a => a.type === 'balance_risk').length,
        description: '部分项目各指标发展不均衡，存在结构性风险'
      }
    ]

    // 早期预警
    const earlyWarnings = alerts.slice(0, 5).map(alert => ({
      projectId: alert.projectId,
      projectName: alert.projectName,
      warning: alert.title,
      recommendedAction: alert.suggestion
    }))

    return {
      highRiskProjects,
      mediumRiskProjects,
      lowRiskProjects,
      riskFactors,
      earlyWarnings
    }
  }

  /**
   * 生成改进建议
   */
  private async generateImprovementSuggestions(goals: ProjectGoal[], projects: Project[]): Promise<ImprovementSuggestion[]> {
    return [
      {
        id: 'strategy-1',
        category: 'strategy',
        priority: 'high',
        title: '优化目标设定策略',
        description: '基于历史数据和市场趋势，调整目标设定方法，使目标更加合理可达',
        expectedImpact: '预期提升整体完成率15-20%',
        implementationEffort: 'medium',
        timeline: '2-3个月',
        affectedProjects: projects.map(p => p.id)
      },
      {
        id: 'execution-1',
        category: 'execution',
        priority: 'high',
        title: '加强过程监控',
        description: '建立更频繁的进度检查机制，及时发现和解决执行中的问题',
        expectedImpact: '预期减少风险项目30%',
        implementationEffort: 'low',
        timeline: '1个月',
        affectedProjects: projects.filter(p => Math.random() > 0.5).map(p => p.id)
      },
      {
        id: 'resource-1',
        category: 'resource',
        priority: 'medium',
        title: '优化资源配置',
        description: '根据项目优先级和完成情况，动态调整资源分配',
        expectedImpact: '预期提升资源利用率25%',
        implementationEffort: 'high',
        timeline: '3-6个月',
        affectedProjects: projects.slice(0, 3).map(p => p.id)
      }
    ]
  }

  /**
   * 生成关键洞察
   */
  private async generateKeyInsights(
    summary: ReportSummary,
    trendAnalysis: TrendAnalysis,
    riskIdentification: RiskIdentification
  ): Promise<string[]> {
    const insights = []

    // 基于摘要的洞察
    if (summary.averageCompletionRate > 90) {
      insights.push(`整体目标完成情况良好，平均完成率达到${summary.averageCompletionRate}%`)
    } else if (summary.averageCompletionRate < 70) {
      insights.push(`整体目标完成率偏低（${summary.averageCompletionRate}%），需要重点关注`)
    }

    // 基于趋势的洞察
    if (trendAnalysis.overallTrend === 'improving') {
      insights.push(`目标完成趋势向好，较上期提升${Math.abs(trendAnalysis.periodComparison.change)}%`)
    } else if (trendAnalysis.overallTrend === 'declining') {
      insights.push(`目标完成趋势下降，较上期下降${Math.abs(trendAnalysis.periodComparison.change)}%，需要及时干预`)
    }

    // 基于风险的洞察
    if (riskIdentification.highRiskProjects > 0) {
      insights.push(`发现${riskIdentification.highRiskProjects}个高风险项目，建议优先处理`)
    }

    // 指标平衡洞察
    const metrics = summary.keyMetrics
    const maxMetric = Math.max(metrics.salesCompletion, metrics.costCompletion, metrics.roiCompletion)
    const minMetric = Math.min(metrics.salesCompletion, metrics.costCompletion, metrics.roiCompletion)

    if (maxMetric - minMetric > 20) {
      insights.push(`各指标发展不平衡，最高与最低指标相差${(maxMetric - minMetric).toFixed(1)}%`)
    }

    return insights
  }

  /**
   * 生成图表数据
   */
  private async generateCharts(goals: ProjectGoal[], reportType: ReportType): Promise<ChartData[]> {
    const charts: ChartData[] = []

    // 完成率趋势图
    charts.push({
      type: 'line',
      title: '目标完成率趋势',
      data: this.generateTrendChartData(reportType),
      insights: ['整体趋势向上', '波动幅度较小', 'ROI指标表现突出']
    })

    // 项目完成率分布
    charts.push({
      type: 'bar',
      title: '项目完成率分布',
      data: this.generateDistributionChartData(goals),
      insights: ['大部分项目完成率在80%以上', '需要关注完成率低于70%的项目']
    })

    // 风险等级分布
    charts.push({
      type: 'pie',
      title: '风险等级分布',
      data: this.generateRiskChartData(),
      insights: ['低风险项目占主导', '高风险项目需要重点关注']
    })

    return charts
  }

  /**
   * 生成趋势图表数据
   */
  private generateTrendChartData(reportType: ReportType) {
    const periods = this.getPeriodLabels(reportType)
    return {
      labels: periods,
      datasets: [
        {
          label: '销量完成率',
          data: periods.map(() => 70 + Math.random() * 30),
          color: '#1890ff'
        },
        {
          label: 'ROI完成率',
          data: periods.map(() => 75 + Math.random() * 25),
          color: '#52c41a'
        },
        {
          label: '成本完成率',
          data: periods.map(() => 80 + Math.random() * 20),
          color: '#fa8c16'
        }
      ]
    }
  }

  /**
   * 生成分布图表数据
   */
  private generateDistributionChartData(goals: ProjectGoal[]) {
    const ranges = ['0-50%', '50-70%', '70-90%', '90-110%', '110%+']
    const data = ranges.map(() => Math.floor(Math.random() * 10))

    return {
      labels: ranges,
      datasets: [{
        label: '项目数量',
        data,
        color: '#1890ff'
      }]
    }
  }

  /**
   * 生成风险图表数据
   */
  private generateRiskChartData() {
    return [
      { name: '低风险', value: 15, color: '#52c41a' },
      { name: '中风险', value: 8, color: '#fa8c16' },
      { name: '高风险', value: 3, color: '#ff4d4f' }
    ]
  }

  /**
   * 获取周期标签
   */
  private getPeriodLabels(reportType: ReportType): string[] {
    switch (reportType) {
      case 'weekly':
        return ['第1周', '第2周', '第3周', '第4周']
      case 'monthly':
        return ['1月', '2月', '3月', '4月', '5月', '6月']
      case 'quarterly':
        return ['Q1', 'Q2', 'Q3', 'Q4']
      case 'yearly':
        return ['2020', '2021', '2022', '2023', '2024']
      default:
        return []
    }
  }

  /**
   * 获取报告标题
   */
  private getReportTitle(type: ReportType, period: string): string {
    const typeMap = {
      weekly: '周度',
      monthly: '月度',
      quarterly: '季度',
      yearly: '年度'
    }
    return `${typeMap[type]}目标达成分析报告 - ${period}`
  }

  /**
   * 获取周期
   */
  private getWeekPeriod(): string {
    const now = new Date()
    const year = now.getFullYear()
    const week = Math.ceil(now.getDate() / 7)
    return `${year}年第${week}周`
  }

  private getMonthPeriod(): string {
    const now = new Date()
    return `${now.getFullYear()}年${now.getMonth() + 1}月`
  }

  private getQuarterPeriod(): string {
    const now = new Date()
    const quarter = Math.ceil((now.getMonth() + 1) / 3)
    return `${now.getFullYear()}年Q${quarter}`
  }

  private getYearPeriod(): string {
    return `${new Date().getFullYear()}年`
  }

  /**
   * 获取周期开始日期
   */
  private getPeriodStartDate(type: ReportType, period: string): string {
    // 简化实现，实际应该根据period解析具体日期
    const now = new Date()
    switch (type) {
      case 'weekly':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      case 'monthly':
        return new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString().split('T')[0]
      case 'quarterly':
        return new Date(now.getFullYear(), now.getMonth() - 3, 1).toISOString().split('T')[0]
      case 'yearly':
        return new Date(now.getFullYear() - 1, 0, 1).toISOString().split('T')[0]
      default:
        return now.toISOString().split('T')[0]
    }
  }

  /**
   * 获取周期结束日期
   */
  private getPeriodEndDate(type: ReportType, period: string): string {
    return new Date().toISOString().split('T')[0]
  }

  /**
   * 获取所有项目ID
   */
  private async getAllProjectIds(): Promise<number[]> {
    const { mockProjects } = await import('@/mock/projects')
    return mockProjects.map(p => p.id)
  }

  /**
   * 获取目标数据
   */
  private async getGoalsData(projectIds: number[], startDate: string, endDate: string): Promise<ProjectGoal[]> {
    const { mockProjectGoals } = await import('@/mock/projects')
    return mockProjectGoals.filter(goal => projectIds.includes(goal.project_id))
  }

  /**
   * 获取项目数据
   */
  private async getProjectsData(projectIds: number[]): Promise<Project[]> {
    const { mockProjects } = await import('@/mock/projects')
    return mockProjects.filter(project => projectIds.includes(project.id))
  }

  /**
   * 生成下载链接
   */
  private async generateDownloadUrl(report: GoalReport): Promise<string> {
    // 模拟生成下载链接
    return `/api/reports/${report.id}/download`
  }

  /**
   * 发送报告邮件
   */
  private async sendReportEmail(report: GoalReport): Promise<void> {
    console.log(`发送报告邮件: ${report.title}`)
    // 实际实现中应该调用邮件服务
  }

  /**
   * 获取报告列表
   */
  getReports(): GoalReport[] {
    return Array.from(reports.value.values())
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }

  /**
   * 获取报告
   */
  getReport(reportId: string): GoalReport | null {
    return reports.value.get(reportId) || null
  }

  /**
   * 删除报告
   */
  deleteReport(reportId: string): boolean {
    return reports.value.delete(reportId)
  }

  /**
   * 更新配置
   */
  updateConfig(newConfig: Partial<ReportConfig>) {
    reportConfig.value = { ...reportConfig.value, ...newConfig }
  }

  /**
   * 获取配置
   */
  getConfig(): ReportConfig {
    return reportConfig.value
  }
}

// 创建全局服务实例
export const goalReportService = new GoalReportService()

// 导出响应式状态
export const useGoalReportService = () => {
  return {
    reports: computed(() => Array.from(reports.value.values())),
    isGenerating: computed(() => isGenerating.value),
    reportConfig: computed(() => reportConfig.value)
  }
}
