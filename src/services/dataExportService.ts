import type { Activity, ActivityDetail, ActivityProductData, ActivityPageData } from '@/types'

// 导出格式类型
export type ExportFormat = 'csv' | 'excel' | 'json' | 'pdf'

// 导出配置接口
export interface ExportConfig {
  format: ExportFormat
  filename?: string
  includeCharts?: boolean
  dateRange?: {
    start: string
    end: string
  }
  fields?: string[]
  summary?: boolean
}

// 数据分析结果接口
export interface DataAnalysis {
  summary: {
    totalActivities: number
    avgROI: number
    totalRevenue: number
    totalSpend: number
    bestPerformingActivity: string
    worstPerformingActivity: string
  }
  trends: {
    revenueGrowth: number
    roiTrend: number
    conversionTrend: number
  }
  insights: string[]
  recommendations: string[]
}

/**
 * 数据导出服务类
 */
export class DataExportService {
  /**
   * 导出活动列表数据
   */
  static async exportActivities(
    activities: Activity[],
    config: ExportConfig
  ): Promise<string> {
    switch (config.format) {
      case 'csv':
        return this.exportActivitiesCSV(activities, config)
      case 'excel':
        return this.exportActivitiesExcel(activities, config)
      case 'json':
        return this.exportActivitiesJSON(activities, config)
      default:
        throw new Error(`不支持的导出格式: ${config.format}`)
    }
  }

  /**
   * 导出活动详情数据
   */
  static async exportActivityDetail(
    activityDetail: ActivityDetail,
    config: ExportConfig
  ): Promise<string> {
    switch (config.format) {
      case 'csv':
        return this.exportActivityDetailCSV(activityDetail, config)
      case 'excel':
        return this.exportActivityDetailExcel(activityDetail, config)
      case 'json':
        return this.exportActivityDetailJSON(activityDetail, config)
      default:
        throw new Error(`不支持的导出格式: ${config.format}`)
    }
  }

  /**
   * 生成数据分析报告
   */
  static generateAnalysisReport(activities: Activity[]): DataAnalysis {
    const totalActivities = activities.length
    const totalRevenue = activities.reduce((sum, activity) => sum + (activity.targetSales || 0), 0)
    const totalSpend = activities.reduce((sum, activity) => sum + (activity.budget || 0), 0)
    const avgROI = totalSpend > 0 ? totalRevenue / totalSpend : 0

    // 找出表现最好和最差的活动
    const activitiesWithROI = activities.filter(a => a.targetSales && a.budget)
    const bestActivity = activitiesWithROI.reduce((best, current) => {
      const currentROI = (current.targetSales || 0) / (current.budget || 1)
      const bestROI = (best.targetSales || 0) / (best.budget || 1)
      return currentROI > bestROI ? current : best
    }, activitiesWithROI[0])

    const worstActivity = activitiesWithROI.reduce((worst, current) => {
      const currentROI = (current.targetSales || 0) / (current.budget || 1)
      const worstROI = (worst.targetSales || 0) / (worst.budget || 1)
      return currentROI < worstROI ? current : worst
    }, activitiesWithROI[0])

    // 生成洞察和建议
    const insights = this.generateInsights(activities)
    const recommendations = this.generateRecommendations(activities)

    return {
      summary: {
        totalActivities,
        avgROI,
        totalRevenue,
        totalSpend,
        bestPerformingActivity: bestActivity?.name || '无',
        worstPerformingActivity: worstActivity?.name || '无'
      },
      trends: {
        revenueGrowth: this.calculateRevenueGrowth(activities),
        roiTrend: this.calculateROITrend(activities),
        conversionTrend: this.calculateConversionTrend(activities)
      },
      insights,
      recommendations
    }
  }

  /**
   * 导出活动列表为CSV
   */
  private static exportActivitiesCSV(activities: Activity[], config: ExportConfig): string {
    const headers = [
      '活动ID', '活动名称', '活动类型', '活动状态', '开始时间', '结束时间',
      '预算', '总收入', '总花费', 'ROI', '转化率', '负责人', '创建时间'
    ]

         const rows = activities.map(activity => [
       activity.id,
       `"${activity.name}"`,
       activity.type,
       activity.status,
       activity.startTime,
       activity.endTime,
       activity.budget || 0,
       activity.targetSales || 0,
       activity.budget || 0,
       activity.budget ? ((activity.targetSales || 0) / activity.budget).toFixed(2) : '0',
       activity.targetConversionRate ? (activity.targetConversionRate * 100).toFixed(2) + '%' : '0%',
       activity.ownerName || '',
       activity.createdAt
     ])

    const csvContent = [headers, ...rows]
      .map(row => row.join(','))
      .join('\n')

    return this.addBOM(csvContent)
  }

  /**
   * 导出活动详情为CSV
   */
  private static exportActivityDetailCSV(activityDetail: ActivityDetail, config: ExportConfig): string {
    let csvContent = ''

    // 基础信息
    csvContent += '活动基础信息\n'
    csvContent += `活动名称,${activityDetail.name}\n`
    csvContent += `活动类型,${activityDetail.type}\n`
    csvContent += `活动状态,${activityDetail.status}\n`
    csvContent += `开始时间,${activityDetail.startTime}\n`
    csvContent += `结束时间,${activityDetail.endTime}\n`
    csvContent += '\n'

    // 单日数据
    if (activityDetail.dailyData && activityDetail.dailyData.length > 0) {
      csvContent += '单日数据\n'
      const dailyHeaders = [
        '日期', '总销售额', '广告花费', 'ROI', '订单数', '客单价',
        'Google花费', 'Google收入', 'Facebook花费', 'Facebook收入'
      ]
      csvContent += dailyHeaders.join(',') + '\n'

      activityDetail.dailyData.forEach(data => {
        const row = [
          data.date,
          data.totalSales,
          data.adSpend,
          data.roi.toFixed(2),
          data.orderCount,
          data.avgOrderValue,
          data.googleSpend,
          data.googleRevenue,
          data.facebookSpend,
          data.facebookRevenue
        ]
        csvContent += row.join(',') + '\n'
      })
      csvContent += '\n'
    }

    // 产品数据
    if (activityDetail.productData && activityDetail.productData.length > 0) {
      csvContent += '产品数据\n'
      const productHeaders = [
        '产品ID', '产品标题', '产品品类', '用户数', '销量', '销售额', '转化率',
        '客单价', '加购数', '加购率', '结账数', '结账率', '退货数', '退款金额'
      ]
      csvContent += productHeaders.join(',') + '\n'

      activityDetail.productData.forEach(product => {
        const row = [
          product.productId,
          `"${product.productTitle}"`,
          product.productCategory,
          product.userCount,
          product.salesVolume,
          product.salesAmount,
          product.conversionRate.toFixed(4),
          product.avgOrderValue,
          product.addToCartCount,
          product.addToCartRate.toFixed(4),
          product.checkoutCount,
          product.checkoutRate.toFixed(4),
          product.returnCount,
          product.returnAmount
        ]
        csvContent += row.join(',') + '\n'
      })
    }

    return this.addBOM(csvContent)
  }

  /**
   * 导出为JSON格式
   */
  private static exportActivitiesJSON(activities: Activity[], config: ExportConfig): string {
    const exportData = {
      exportTime: new Date().toISOString(),
      totalCount: activities.length,
             activities: config.fields ?
         activities.map(activity => this.filterFields(activity, config.fields || [])) :
         activities
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * 导出活动详情为JSON
   */
  private static exportActivityDetailJSON(activityDetail: ActivityDetail, config: ExportConfig): string {
    const exportData = {
      exportTime: new Date().toISOString(),
      activityDetail
    }

    return JSON.stringify(exportData, null, 2)
  }

  /**
   * 导出为Excel格式（模拟）
   */
  private static exportActivitiesExcel(activities: Activity[], config: ExportConfig): string {
    // 在实际项目中，这里会使用库如 xlsx 来生成真正的Excel文件
    // 现在返回CSV格式作为占位符
    return this.exportActivitiesCSV(activities, config)
  }

  /**
   * 导出活动详情为Excel格式（模拟）
   */
  private static exportActivityDetailExcel(activityDetail: ActivityDetail, config: ExportConfig): string {
    // 在实际项目中，这里会使用库如 xlsx 来生成真正的Excel文件
    return this.exportActivityDetailCSV(activityDetail, config)
  }

  /**
   * 下载文件
   */
  static downloadFile(content: string, filename: string, mimeType: string = 'text/csv') {
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8;` })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)

    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    URL.revokeObjectURL(url)
  }

  /**
   * 生成洞察
   */
  private static generateInsights(activities: Activity[]): string[] {
    const insights: string[] = []

    // 分析活动状态分布
    const statusCounts = activities.reduce((acc, activity) => {
      acc[activity.status] = (acc[activity.status] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    if (statusCounts.running > statusCounts.ended) {
      insights.push('当前有较多活动正在进行中，建议关注活动执行质量')
    }

         // 分析ROI表现
     const activitiesWithROI = activities.filter(a => a.targetSales && a.budget)
     if (activitiesWithROI.length > 0) {
       const avgROI = activitiesWithROI.reduce((sum, a) =>
         sum + ((a.targetSales || 0) / (a.budget || 1)), 0) / activitiesWithROI.length

      if (avgROI > 4) {
        insights.push('整体ROI表现优秀，超过4倍回报')
      } else if (avgROI > 2) {
        insights.push('整体ROI表现良好，但仍有提升空间')
      } else {
        insights.push('整体ROI偏低，需要优化投放策略')
      }
    }

    return insights
  }

  /**
   * 生成建议
   */
  private static generateRecommendations(activities: Activity[]): string[] {
    const recommendations: string[] = []

    // 基于活动数量的建议
    if (activities.length < 5) {
      recommendations.push('建议增加活动数量，提高品牌曝光度')
    }

    // 基于活动类型的建议
    const typeCounts = activities.reduce((acc, activity) => {
      acc[activity.type] = (acc[activity.type] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    if (typeCounts.promotion > typeCounts.brand * 3) {
      recommendations.push('促销活动占比较高，建议增加品牌建设类活动')
    }

    // 基于时间的建议
    const now = new Date()
    const recentActivities = activities.filter(a => {
      const endTime = new Date(a.endTime)
      const diffDays = (now.getTime() - endTime.getTime()) / (1000 * 60 * 60 * 24)
      return diffDays <= 30
    })

    if (recentActivities.length === 0) {
      recommendations.push('最近30天没有活动，建议规划新的营销活动')
    }

    return recommendations
  }

  /**
   * 计算收入增长率
   */
  private static calculateRevenueGrowth(activities: Activity[]): number {
    // 简化计算，实际项目中需要更复杂的时间序列分析
    const recentActivities = activities.slice(-5)
    const olderActivities = activities.slice(-10, -5)

         const recentRevenue = recentActivities.reduce((sum, a) => sum + (a.targetSales || 0), 0)
     const olderRevenue = olderActivities.reduce((sum, a) => sum + (a.targetSales || 0), 0)

    return olderRevenue > 0 ? ((recentRevenue - olderRevenue) / olderRevenue) * 100 : 0
  }

  /**
   * 计算ROI趋势
   */
  private static calculateROITrend(activities: Activity[]): number {
    // 简化计算
    return Math.random() * 20 - 10 // 模拟-10%到+10%的变化
  }

  /**
   * 计算转化率趋势
   */
  private static calculateConversionTrend(activities: Activity[]): number {
    // 简化计算
    return Math.random() * 10 - 5 // 模拟-5%到+5%的变化
  }

  /**
   * 过滤字段
   */
  private static filterFields(obj: any, fields: string[]): any {
    const filtered: any = {}
    fields.forEach(field => {
      if (obj.hasOwnProperty(field)) {
        filtered[field] = obj[field]
      }
    })
    return filtered
  }

  /**
   * 添加BOM（字节顺序标记）以支持Excel正确显示中文
   */
  private static addBOM(content: string): string {
    return '\uFEFF' + content
  }
}

// 导出默认实例
export const dataExportService = DataExportService
