// 自动截图服务
import { mockGetDashboardScreenshots, mockCreateWeeklyReport } from '@/mock/reports'

// 截图配置接口
interface ScreenshotConfig {
  resolution: string
  format: string
  quality: number
  watermark: boolean
  scheduleTime: string
}

// 截图任务接口
interface ScreenshotTask {
  id: string
  projectId: string
  customerId: string
  scheduledTime: string
  status: 'pending' | 'running' | 'completed' | 'failed'
  retryCount: number
  maxRetries: number
  createdAt: string
  completedAt?: string
  errorMessage?: string
}

// 默认截图配置
const defaultConfig: ScreenshotConfig = {
  resolution: '1920x1080',
  format: 'PNG',
  quality: 90,
  watermark: true,
  scheduleTime: '23:59:59' // 每周日23:59:59
}

// 截图任务队列
let screenshotTasks: ScreenshotTask[] = []

/**
 * 自动截图服务类
 */
export class ScreenshotService {
  private config: ScreenshotConfig
  private isRunning: boolean = false

  constructor(config?: Partial<ScreenshotConfig>) {
    this.config = { ...defaultConfig, ...config }
  }

  /**
   * 初始化截图服务
   */
  async initialize(): Promise<void> {
    console.log('🎯 初始化自动截图服务...')

    // 设置定时任务
    this.setupScheduledTasks()

    console.log('✅ 自动截图服务初始化完成')
  }

  /**
   * 设置定时截图任务
   */
  private setupScheduledTasks(): void {
    // 模拟每周日23:59:59的定时任务
    const scheduleWeeklyScreenshots = () => {
      const now = new Date()
      const dayOfWeek = now.getDay() // 0 = Sunday

      // 如果是周日，执行截图任务
      if (dayOfWeek === 0) {
        this.executeWeeklyScreenshots()
      }
    }

    // 每小时检查一次是否需要执行截图
    setInterval(scheduleWeeklyScreenshots, 60 * 60 * 1000) // 1小时

    console.log('📅 定时截图任务已设置')
  }

  /**
   * 执行周度截图任务
   */
  async executeWeeklyScreenshots(): Promise<void> {
    if (this.isRunning) {
      console.log('⚠️ 截图任务正在执行中，跳过本次任务')
      return
    }

    this.isRunning = true
    console.log('📸 开始执行周度截图任务...')

    try {
      // 获取需要截图的项目列表
      const projects = await this.getActiveProjects()

      for (const project of projects) {
        await this.captureProjectScreenshot(project)
      }

      console.log('✅ 周度截图任务执行完成')
    } catch (error) {
      console.error('❌ 周度截图任务执行失败:', error)
    } finally {
      this.isRunning = false
    }
  }

  /**
   * 获取活跃项目列表
   */
  private async getActiveProjects(): Promise<any[]> {
    // 模拟获取活跃项目
    return [
      {
        id: 'project-1',
        name: 'Apple iPhone推广项目',
        customerId: 'customer-1',
        customerName: 'Apple Inc.',
        status: 'active'
      },
      {
        id: 'project-2',
        name: 'Samsung Galaxy营销项目',
        customerId: 'customer-2',
        customerName: 'Samsung Electronics',
        status: 'active'
      }
    ]
  }

  /**
   * 为单个项目执行截图
   */
  private async captureProjectScreenshot(project: any): Promise<void> {
    const taskId = `screenshot-${project.id}-${Date.now()}`

    // 创建截图任务
    const task: ScreenshotTask = {
      id: taskId,
      projectId: project.id,
      customerId: project.customerId,
      scheduledTime: new Date().toISOString(),
      status: 'pending',
      retryCount: 0,
      maxRetries: 3,
      createdAt: new Date().toISOString()
    }

    screenshotTasks.push(task)

    try {
      console.log(`📸 开始为项目 ${project.name} 截图...`)

      // 更新任务状态
      task.status = 'running'

      // 模拟截图过程
      await this.simulateScreenshotCapture(project, task)

      // 截图成功
      task.status = 'completed'
      task.completedAt = new Date().toISOString()

      console.log(`✅ 项目 ${project.name} 截图完成`)

      // 自动生成周报框架
      await this.autoGenerateWeeklyReport(project, task)

    } catch (error) {
      console.error(`❌ 项目 ${project.name} 截图失败:`, error)

      // 处理失败情况
      task.status = 'failed'
      task.errorMessage = error instanceof Error ? error.message : '未知错误'

      // 重试机制
      if (task.retryCount < task.maxRetries) {
        task.retryCount++
        setTimeout(() => {
          this.retryScreenshot(task, project)
        }, 60 * 1000) // 1分钟后重试
      }
    }
  }

  /**
   * 模拟截图捕获过程
   */
  private async simulateScreenshotCapture(project: any, task: ScreenshotTask): Promise<void> {
    // 模拟截图过程的各个步骤
    const steps = [
      { name: '加载数据看板页面', duration: 2000 },
      { name: '等待数据加载完成', duration: 3000 },
      { name: '验证页面完整性', duration: 1000 },
      { name: '执行截图操作', duration: 2000 },
      { name: '图片质量检查', duration: 1000 },
      { name: '添加水印和时间戳', duration: 1000 },
      { name: '保存截图文件', duration: 1000 }
    ]

    for (const step of steps) {
      console.log(`  🔄 ${step.name}...`)
      await new Promise(resolve => setTimeout(resolve, step.duration))
    }

    // 模拟随机失败（10%概率）
    if (Math.random() < 0.1) {
      throw new Error('页面加载超时或数据不完整')
    }

    // 模拟生成截图文件信息
    const now = new Date()
    const weekNumber = this.getWeekNumber(now)
    const fileName = `${project.customerName}_${project.name}_${now.toISOString().split('T')[0]}_W${weekNumber.toString().padStart(2, '0')}_数据看板截图.png`

    console.log(`  📁 截图文件已保存: ${fileName}`)
  }

  /**
   * 重试截图任务
   */
  private async retryScreenshot(task: ScreenshotTask, project: any): Promise<void> {
    console.log(`🔄 重试项目 ${project.name} 截图 (第${task.retryCount}次重试)...`)

    task.status = 'pending'

    try {
      await this.simulateScreenshotCapture(project, task)
      task.status = 'completed'
      task.completedAt = new Date().toISOString()

      console.log(`✅ 项目 ${project.name} 截图重试成功`)

      // 自动生成周报框架
      await this.autoGenerateWeeklyReport(project, task)

    } catch (error) {
      console.error(`❌ 项目 ${project.name} 截图重试失败:`, error)

      task.status = 'failed'
      task.errorMessage = error instanceof Error ? error.message : '重试失败'

      if (task.retryCount < task.maxRetries) {
        task.retryCount++
        setTimeout(() => {
          this.retryScreenshot(task, project)
        }, 60 * 1000 * task.retryCount) // 递增延迟重试
      } else {
        console.log(`❌ 项目 ${project.name} 截图任务最终失败，已达到最大重试次数`)
        // 发送通知给管理员
        this.notifyAdministrator(project, task)
      }
    }
  }

  /**
   * 自动生成周报框架
   */
  private async autoGenerateWeeklyReport(project: any, screenshotTask: ScreenshotTask): Promise<void> {
    try {
      console.log(`📝 为项目 ${project.name} 自动生成周报框架...`)

      const now = new Date()
      const weekNumber = this.getWeekNumber(now)
      const year = now.getFullYear()

      const weeklyReportData = {
        projectId: project.id,
        customerId: project.customerId,
        projectName: project.name,
        customerName: project.customerName,
        reportWeek: `${year}-W${weekNumber.toString().padStart(2, '0')}`,
        reportYear: year,
        weekNumber: weekNumber,
        autoScreenshot: true,
        screenshotIds: [screenshotTask.id],
        content: {
          dataSummary: '本周数据收集完成，等待分析和总结',
          workSummary: '本周主要工作内容待补充',
          meetingRecords: [],
          todoItems: [],
          nextWeekPlan: '下周工作计划待制定'
        },
        summary: '周报框架已自动生成，请补充具体内容',
        suggestions: '请根据本周数据表现添加优化建议',
        nextWeekPlan: '请制定下周具体工作计划',
        createdBy: 'system', // 系统自动创建
      }

      // 创建周报
      await mockCreateWeeklyReport(weeklyReportData)

      console.log(`✅ 项目 ${project.name} 周报框架生成完成`)

    } catch (error) {
      console.error(`❌ 项目 ${project.name} 周报框架生成失败:`, error)
    }
  }

  /**
   * 手动触发截图
   */
  async manualScreenshot(projectId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`🎯 手动触发项目 ${projectId} 截图...`)

      // 获取项目信息
      const project = await this.getProjectById(projectId)
      if (!project) {
        return { success: false, message: '项目不存在' }
      }

      // 执行截图
      await this.captureProjectScreenshot(project)

      return { success: true, message: '截图任务已提交，请稍后查看结果' }

    } catch (error) {
      console.error('手动截图失败:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : '截图失败'
      }
    }
  }

  /**
   * 获取项目信息
   */
  private async getProjectById(projectId: string): Promise<any | null> {
    const projects = await this.getActiveProjects()
    return projects.find(p => p.id === projectId) || null
  }

  /**
   * 获取截图任务列表
   */
  getScreenshotTasks(): ScreenshotTask[] {
    return [...screenshotTasks]
  }

  /**
   * 获取截图任务状态
   */
  getTaskStatus(taskId: string): ScreenshotTask | null {
    return screenshotTasks.find(task => task.id === taskId) || null
  }

  /**
   * 清理过期任务
   */
  cleanupExpiredTasks(): void {
    const oneWeekAgo = new Date()
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7)

    const initialCount = screenshotTasks.length
    screenshotTasks = screenshotTasks.filter(task =>
      new Date(task.createdAt) > oneWeekAgo
    )

    const cleanedCount = initialCount - screenshotTasks.length
    if (cleanedCount > 0) {
      console.log(`🧹 清理了 ${cleanedCount} 个过期截图任务`)
    }
  }

  /**
   * 通知管理员
   */
  private notifyAdministrator(project: any, task: ScreenshotTask): void {
    console.log(`📧 发送通知给管理员: 项目 ${project.name} 截图任务失败`)

    // 这里可以集成邮件服务、短信服务或系统通知
    const notification = {
      type: 'screenshot_failure',
      title: '自动截图任务失败',
      message: `项目 "${project.name}" 的自动截图任务执行失败，请检查系统状态。`,
      projectId: project.id,
      taskId: task.id,
      timestamp: new Date().toISOString()
    }

    // 模拟发送通知
    console.log('通知详情:', notification)
  }

  /**
   * 获取周数
   */
  private getWeekNumber(date: Date): number {
    const firstDayOfYear = new Date(date.getFullYear(), 0, 1)
    const pastDaysOfYear = (date.getTime() - firstDayOfYear.getTime()) / 86400000
    return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7)
  }

  /**
   * 获取截图配置
   */
  getConfig(): ScreenshotConfig {
    return { ...this.config }
  }

  /**
   * 更新截图配置
   */
  updateConfig(newConfig: Partial<ScreenshotConfig>): void {
    this.config = { ...this.config, ...newConfig }
    console.log('📋 截图配置已更新:', this.config)
  }

  /**
   * 获取截图服务状态
   */
  getServiceStatus(): {
    isRunning: boolean
    tasksCount: number
    completedTasks: number
    failedTasks: number
    pendingTasks: number
  } {
    const completed = screenshotTasks.filter(t => t.status === 'completed').length
    const failed = screenshotTasks.filter(t => t.status === 'failed').length
    const pending = screenshotTasks.filter(t => t.status === 'pending').length

    return {
      isRunning: this.isRunning,
      tasksCount: screenshotTasks.length,
      completedTasks: completed,
      failedTasks: failed,
      pendingTasks: pending
    }
  }
}

// 创建全局截图服务实例
export const screenshotService = new ScreenshotService()

// 自动初始化服务
screenshotService.initialize().catch(error => {
  console.error('截图服务初始化失败:', error)
})

export default screenshotService
