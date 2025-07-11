/**
 * 报告生成工具类
 * 支持多种报告类型的生成和自定义
 */

import { exportToPDF, generateReportHTML, type ExportColumn } from './export'
import type { Customer, Channel, Campaign, Alert } from '@/types'

export interface ReportTemplate {
  id: string
  name: string
  description: string
  type: 'dashboard' | 'customer' | 'channel' | 'campaign' | 'financial'
  sections: ReportSection[]
}

export interface ReportSection {
  id: string
  title: string
  type: 'summary' | 'chart' | 'table' | 'text'
  config: Record<string, unknown>
}

export interface ReportData {
  customers: Customer[]
  channels: Channel[]
  campaigns: Campaign[]
  alerts: Alert[]
  dateRange: {
    start: string
    end: string
  }
  filters: Record<string, unknown>
}

export interface GeneratedReport {
  title: string
  subtitle: string
  generatedAt: Date
  sections: ReportSectionContent[]
  metadata: ReportMetadata
}

export interface ReportSectionContent {
  title: string
  type: string
  content: string | ReportChart | ReportTable
}

export interface ReportChart {
  type: 'line' | 'bar' | 'pie' | 'area'
  data: unknown[]
  config: Record<string, unknown>
}

export interface ReportTable {
  headers: string[]
  rows: (string | number)[][]
  summary?: Record<string, string | number>
}

export interface ReportMetadata {
  template: string
  dataSource: string
  recordCount: number
  generatedBy: string
  version: string
}

/**
 * 预定义报告模板
 */
export const reportTemplates: ReportTemplate[] = [
  {
    id: 'dashboard-overview',
    name: '数据看板概览报告',
    description: '包含关键指标、图表和趋势分析的综合报告',
    type: 'dashboard',
    sections: [
      {
        id: 'summary',
        title: '关键指标摘要',
        type: 'summary',
        config: {
          metrics: ['totalRevenue', 'totalCustomers', 'avgROI', 'conversionRate']
        }
      },
      {
        id: 'revenue-trend',
        title: '收入趋势',
        type: 'chart',
        config: {
          chartType: 'line',
          dataSource: 'revenue-by-month'
        }
      },
      {
        id: 'channel-distribution',
        title: '渠道分布',
        type: 'chart',
        config: {
          chartType: 'pie',
          dataSource: 'revenue-by-channel'
        }
      },
      {
        id: 'top-customers',
        title: '头部客户',
        type: 'table',
        config: {
          dataSource: 'customers',
          limit: 10,
          sortBy: 'revenue',
          sortOrder: 'desc'
        }
      }
    ]
  },
  {
    id: 'customer-analysis',
    name: '客户分析报告',
    description: '详细的客户数据分析和洞察报告',
    type: 'customer',
    sections: [
      {
        id: 'customer-summary',
        title: '客户概览',
        type: 'summary',
        config: {
          metrics: ['totalCustomers', 'activeCustomers', 'customerGrowth', 'churnRate']
        }
      },
      {
        id: 'customer-segments',
        title: '客户分群',
        type: 'chart',
        config: {
          chartType: 'bar',
          dataSource: 'customers-by-industry'
        }
      },
      {
        id: 'customer-list',
        title: '客户详细列表',
        type: 'table',
        config: {
          dataSource: 'customers',
          includeAll: true
        }
      }
    ]
  },
  {
    id: 'channel-performance',
    name: '渠道效果报告',
    description: '各渠道投放效果和ROI分析报告',
    type: 'channel',
    sections: [
      {
        id: 'channel-summary',
        title: '渠道概览',
        type: 'summary',
        config: {
          metrics: ['totalChannels', 'totalSpend', 'avgROI', 'bestChannel']
        }
      },
      {
        id: 'channel-comparison',
        title: '渠道对比',
        type: 'chart',
        config: {
          chartType: 'bar',
          dataSource: 'channel-comparison'
        }
      },
      {
        id: 'channel-details',
        title: '渠道详情',
        type: 'table',
        config: {
          dataSource: 'channels',
          includeAll: true
        }
      }
    ]
  },
  {
    id: 'financial-summary',
    name: '财务汇总报告',
    description: '收入、成本和利润分析报告',
    type: 'financial',
    sections: [
      {
        id: 'financial-overview',
        title: '财务概览',
        type: 'summary',
        config: {
          metrics: ['totalRevenue', 'totalCost', 'profit', 'profitMargin']
        }
      },
      {
        id: 'revenue-breakdown',
        title: '收入构成',
        type: 'chart',
        config: {
          chartType: 'pie',
          dataSource: 'revenue-breakdown'
        }
      },
      {
        id: 'cost-analysis',
        title: '成本分析',
        type: 'chart',
        config: {
          chartType: 'area',
          dataSource: 'cost-trend'
        }
      }
    ]
  }
]

/**
 * 生成报告
 */
export const generateReport = async (
  templateId: string,
  data: ReportData,
  options: {
    title?: string
    customSections?: ReportSection[]
    includeCharts?: boolean
    includeRawData?: boolean
  } = {}
): Promise<GeneratedReport> => {
  const template = reportTemplates.find(t => t.id === templateId)
  if (!template) {
    throw new Error(`Report template not found: ${templateId}`)
  }

  const {
    title = template.name,
    customSections,
    includeCharts = true,
    includeRawData = false
  } = options

  const sections = customSections || template.sections
  const generatedSections: ReportSectionContent[] = []

  for (const section of sections) {
    const sectionContent = await generateSection(section, data, { includeCharts })
    generatedSections.push(sectionContent)
  }

  // 添加原始数据部分（如果需要）
  if (includeRawData) {
    generatedSections.push({
      title: '原始数据',
      type: 'table',
      content: generateRawDataTable(data)
    })
  }

  return {
    title,
    subtitle: `${template.description} - ${formatDateRange(data.dateRange)}`,
    generatedAt: new Date(),
    sections: generatedSections,
    metadata: {
      template: templateId,
      dataSource: 'mock-data',
      recordCount: data.customers.length + data.channels.length + data.campaigns.length,
      generatedBy: 'AI Wei Data Platform',
      version: '1.0.0'
    }
  }
}

/**
 * 生成报告章节
 */
const generateSection = async (
  section: ReportSection,
  data: ReportData,
  options: { includeCharts: boolean }
): Promise<ReportSectionContent> => {
  switch (section.type) {
    case 'summary':
      return generateSummarySection(section, data)
    case 'chart':
      return generateChartSection(section, data, options.includeCharts)
    case 'table':
      return generateTableSection(section, data)
    case 'text':
      return generateTextSection(section, data)
    default:
      throw new Error(`Unknown section type: ${section.type}`)
  }
}

/**
 * 生成摘要章节
 */
const generateSummarySection = (
  section: ReportSection,
  data: ReportData
): ReportSectionContent => {
  const metrics = section.config.metrics as string[]
  const summary = calculateMetrics(data, metrics)
  
  let content = '<div class="summary-metrics">'
  
  for (const [key, value] of Object.entries(summary)) {
    content += `
      <div class="metric-item">
        <div class="metric-label">${getMetricLabel(key)}</div>
        <div class="metric-value">${formatMetricValue(key, value)}</div>
      </div>
    `
  }
  
  content += '</div>'
  
  return {
    title: section.title,
    type: 'summary',
    content
  }
}

/**
 * 生成图表章节
 */
const generateChartSection = (
  section: ReportSection,
  data: ReportData,
  includeCharts: boolean
): ReportSectionContent => {
  if (!includeCharts) {
    return {
      title: section.title,
      type: 'chart',
      content: '<p>图表已省略（仅包含数据）</p>'
    }
  }

  const chartData = generateChartData(section.config.dataSource as string, data)
  
  // 这里可以生成图表的HTML表示或数据描述
  let content = `<div class="chart-placeholder">`
  content += `<p><strong>图表类型:</strong> ${section.config.chartType}</p>`
  content += `<p><strong>数据源:</strong> ${section.config.dataSource}</p>`
  content += `<p><strong>数据点数:</strong> ${chartData.length}</p>`
  content += `</div>`
  
  return {
    title: section.title,
    type: 'chart',
    content: {
      type: section.config.chartType as string,
      data: chartData,
      config: section.config
    } as ReportChart
  }
}

/**
 * 生成表格章节
 */
const generateTableSection = (
  section: ReportSection,
  data: ReportData
): ReportSectionContent => {
  const { dataSource, limit, sortBy, sortOrder, includeAll } = section.config
  
  let tableData: unknown[] = []
  let columns: string[] = []
  
  switch (dataSource) {
    case 'customers':
      tableData = data.customers
      columns = ['name', 'industry', 'revenue', 'roi', 'status']
      break
    case 'channels':
      tableData = data.channels
      columns = ['name', 'type', 'revenue', 'cost', 'roi']
      break
    case 'campaigns':
      tableData = data.campaigns
      columns = ['name', 'type', 'budget', 'spent', 'revenue', 'roi']
      break
  }
  
  // 排序
  if (sortBy && sortOrder) {
    tableData.sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortBy as string] as number
      const bVal = (b as Record<string, unknown>)[sortBy as string] as number
      return sortOrder === 'desc' ? bVal - aVal : aVal - bVal
    })
  }
  
  // 限制数量
  if (limit && !includeAll) {
    tableData = tableData.slice(0, limit as number)
  }
  
  const headers = columns.map(col => getColumnLabel(col))
  const rows = tableData.map(item => 
    columns.map(col => formatTableValue(col, (item as Record<string, unknown>)[col]))
  )
  
  return {
    title: section.title,
    type: 'table',
    content: {
      headers,
      rows,
      summary: generateTableSummary(tableData, columns)
    } as ReportTable
  }
}

/**
 * 生成文本章节
 */
const generateTextSection = (
  section: ReportSection,
  data: ReportData
): ReportSectionContent => {
  // 这里可以根据数据生成分析文本
  const insights = generateInsights(data)
  
  let content = `<div class="text-content">`
  content += `<p>${insights.join('</p><p>')}</p>`
  content += `</div>`
  
  return {
    title: section.title,
    type: 'text',
    content
  }
}

/**
 * 导出报告为PDF
 */
export const exportReportToPDF = async (
  report: GeneratedReport,
  filename?: string
): Promise<void> => {
  const htmlContent = generateReportHTMLContent(report)
  
  // 创建临时数据用于导出
  const tempData = [{ content: htmlContent }]
  const tempColumns: ExportColumn[] = [{ key: 'content', label: 'Content' }]
  
  exportToPDF(tempData, tempColumns, {
    filename: filename || `report_${report.metadata.template}`,
    title: report.title,
    description: report.subtitle
  })
}

/**
 * 生成报告HTML内容
 */
const generateReportHTMLContent = (report: GeneratedReport): string => {
  let html = `
    <div class="report-header">
      <h1>${report.title}</h1>
      <p class="report-subtitle">${report.subtitle}</p>
      <p class="report-meta">生成时间: ${report.generatedAt.toLocaleString('zh-CN')}</p>
    </div>
  `
  
  for (const section of report.sections) {
    html += `
      <div class="report-section">
        <h2>${section.title}</h2>
        <div class="section-content">
    `
    
    if (typeof section.content === 'string') {
      html += section.content
    } else if (section.type === 'table') {
      const table = section.content as ReportTable
      html += generateTableHTML(table)
    } else if (section.type === 'chart') {
      html += '<p>[图表内容]</p>'
    }
    
    html += `
        </div>
      </div>
    `
  }
  
  return html
}

/**
 * 生成表格HTML
 */
const generateTableHTML = (table: ReportTable): string => {
  let html = '<table class="report-table">'
  
  // 表头
  html += '<thead><tr>'
  table.headers.forEach(header => {
    html += `<th>${header}</th>`
  })
  html += '</tr></thead>'
  
  // 数据行
  html += '<tbody>'
  table.rows.forEach(row => {
    html += '<tr>'
    row.forEach(cell => {
      html += `<td>${cell}</td>`
    })
    html += '</tr>'
  })
  html += '</tbody>'
  
  html += '</table>'
  
  return html
}

// 工具函数
const calculateMetrics = (data: ReportData, metrics: string[]): Record<string, number | string> => {
  const result: Record<string, number | string> = {}
  
  metrics.forEach(metric => {
    switch (metric) {
      case 'totalRevenue':
        result[metric] = data.customers.reduce((sum, c) => sum + c.revenue, 0)
        break
      case 'totalCustomers':
        result[metric] = data.customers.length
        break
      case 'activeCustomers':
        result[metric] = data.customers.filter(c => c.status === 'active').length
        break
      case 'avgROI':
        const totalROI = data.customers.reduce((sum, c) => sum + c.roi, 0)
        result[metric] = data.customers.length > 0 ? totalROI / data.customers.length : 0
        break
      case 'totalChannels':
        result[metric] = data.channels.length
        break
      case 'totalSpend':
        result[metric] = data.channels.reduce((sum, c) => sum + c.cost, 0)
        break
    }
  })
  
  return result
}

const generateChartData = (dataSource: string, data: ReportData): unknown[] => {
  switch (dataSource) {
    case 'revenue-by-month':
      return [
        { month: '1月', revenue: 850000 },
        { month: '2月', revenue: 920000 },
        { month: '3月', revenue: 1100000 },
        { month: '4月', revenue: 1250000 }
      ]
    case 'revenue-by-channel':
      return data.channels.map(c => ({ name: c.name, value: c.revenue }))
    case 'customers-by-industry':
      const industryMap: Record<string, number> = {}
      data.customers.forEach(c => {
        industryMap[c.industry] = (industryMap[c.industry] || 0) + 1
      })
      return Object.entries(industryMap).map(([industry, count]) => ({ industry, count }))
    default:
      return []
  }
}

const generateInsights = (data: ReportData): string[] => {
  const insights: string[] = []
  
  const totalRevenue = data.customers.reduce((sum, c) => sum + c.revenue, 0)
  const activeCustomers = data.customers.filter(c => c.status === 'active').length
  const avgROI = data.customers.length > 0 
    ? data.customers.reduce((sum, c) => sum + c.roi, 0) / data.customers.length 
    : 0
  
  insights.push(`本期共有 ${data.customers.length} 个客户，其中 ${activeCustomers} 个为活跃状态。`)
  insights.push(`总收入达到 $${totalRevenue.toLocaleString()}，平均ROI为 ${avgROI.toFixed(1)}x。`)
  
  if (data.channels.length > 0) {
    const bestChannel = data.channels.reduce((best, current) => 
      current.roi > best.roi ? current : best
    )
    insights.push(`效果最佳的渠道是 ${bestChannel.name}，ROI达到 ${bestChannel.roi}x。`)
  }
  
  return insights
}

const getMetricLabel = (metric: string): string => {
  const labels: Record<string, string> = {
    totalRevenue: '总收入',
    totalCustomers: '客户总数',
    activeCustomers: '活跃客户',
    avgROI: '平均ROI',
    totalChannels: '渠道数量',
    totalSpend: '总支出'
  }
  return labels[metric] || metric
}

const formatMetricValue = (metric: string, value: number | string): string => {
  if (typeof value === 'number') {
    if (metric.includes('Revenue') || metric.includes('Spend')) {
      return `$${value.toLocaleString()}`
    }
    if (metric.includes('ROI')) {
      return `${value.toFixed(1)}x`
    }
    return value.toLocaleString()
  }
  return String(value)
}

const getColumnLabel = (column: string): string => {
  const labels: Record<string, string> = {
    name: '名称',
    industry: '行业',
    revenue: '收入',
    roi: 'ROI',
    status: '状态',
    type: '类型',
    cost: '成本',
    budget: '预算',
    spent: '已花费'
  }
  return labels[column] || column
}

const formatTableValue = (column: string, value: unknown): string | number => {
  if (value === null || value === undefined) return ''
  
  if (column === 'revenue' || column === 'cost' || column === 'budget' || column === 'spent') {
    return `$${(value as number).toLocaleString()}`
  }
  
  if (column === 'roi') {
    return `${value}x`
  }
  
  return value as string | number
}

const generateTableSummary = (data: unknown[], columns: string[]): Record<string, string | number> => {
  const summary: Record<string, string | number> = {}
  
  columns.forEach(column => {
    if (column === 'revenue' || column === 'cost') {
      const total = data.reduce((sum: number, item) => {
        const value = (item as Record<string, unknown>)[column] as number
        return sum + (value || 0)
      }, 0)
      summary[`total_${column}`] = `$${total.toLocaleString()}`
    }
  })
  
  summary.record_count = data.length
  
  return summary
}

const formatDateRange = (dateRange: { start: string; end: string }): string => {
  return `${dateRange.start} 至 ${dateRange.end}`
}

const generateRawDataTable = (data: ReportData): ReportTable => {
  const headers = ['数据类型', '记录数', '详情']
  const rows = [
    ['客户数据', data.customers.length, `包含客户基本信息、收入、ROI等`],
    ['渠道数据', data.channels.length, `包含渠道类型、投放成本、转化数据等`],
    ['活动数据', data.campaigns.length, `包含活动预算、花费、效果等`],
    ['预警数据', data.alerts.length, `包含系统预警和提醒信息`]
  ]
  
  return { headers, rows }
}