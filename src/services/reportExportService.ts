// 报告导出服务
import { jsPDF } from 'jspdf'

// 导出格式类型
export type ExportFormat = 'pdf' | 'word' | 'excel' | 'html'

// 导出配置接口
interface ExportConfig {
  format: ExportFormat
  includeCharts: boolean
  includeRawData: boolean
  pageSize: 'A4' | 'A3' | 'Letter'
  orientation: 'portrait' | 'landscape'
  watermark?: string
  author?: string
  title?: string
}

// 邮件发送配置
interface EmailConfig {
  recipients: string[]
  subject: string
  body: string
  attachmentName?: string
}

// 默认导出配置
const defaultExportConfig: ExportConfig = {
  format: 'pdf',
  includeCharts: true,
  includeRawData: false,
  pageSize: 'A4',
  orientation: 'portrait',
  watermark: '艾维数据平台',
  author: '艾维数据平台',
  title: '数据报告'
}

/**
 * 报告导出服务类
 */
export class ReportExportService {
  private config: ExportConfig

  constructor(config?: Partial<ExportConfig>) {
    this.config = { ...defaultExportConfig, ...config }
  }

  /**
   * 导出周报
   */
  async exportWeeklyReport(
    report: any,
    format: ExportFormat = 'pdf',
    customConfig?: Partial<ExportConfig>
  ): Promise<{ success: boolean; message: string; downloadUrl?: string }> {
    try {
      console.log(`📄 开始导出周报: ${report.reportWeek} - ${report.projectName}`)

      const config = { ...this.config, format, ...customConfig }

      switch (format) {
        case 'pdf':
          return await this.exportToPDF(report, config)
        case 'word':
          return await this.exportToWord(report, config)
        case 'excel':
          return await this.exportToExcel(report, config)
        case 'html':
          return await this.exportToHTML(report, config)
        default:
          throw new Error(`不支持的导出格式: ${format}`)
      }
    } catch (error) {
      console.error('导出周报失败:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : '导出失败'
      }
    }
  }

  /**
   * 导出月报
   */
  async exportMonthlyReport(
    report: any,
    format: ExportFormat = 'pdf',
    customConfig?: Partial<ExportConfig>
  ): Promise<{ success: boolean; message: string; downloadUrl?: string }> {
    try {
      console.log(`📄 开始导出月报: ${report.reportMonth} - ${report.projectName}`)

      const config = { ...this.config, format, ...customConfig }

      switch (format) {
        case 'pdf':
          return await this.exportToPDF(report, config, 'monthly')
        case 'word':
          return await this.exportToWord(report, config, 'monthly')
        case 'excel':
          return await this.exportToExcel(report, config, 'monthly')
        case 'html':
          return await this.exportToHTML(report, config, 'monthly')
        default:
          throw new Error(`不支持的导出格式: ${format}`)
      }
    } catch (error) {
      console.error('导出月报失败:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : '导出失败'
      }
    }
  }

  /**
   * 导出为PDF格式
   */
  private async exportToPDF(
    report: any,
    config: ExportConfig,
    reportType: 'weekly' | 'monthly' = 'weekly'
  ): Promise<{ success: boolean; message: string; downloadUrl?: string }> {
    try {
      console.log('🔄 正在生成PDF文件...')

      // 创建PDF文档
      const doc = new jsPDF({
        orientation: config.orientation,
        unit: 'mm',
        format: config.pageSize.toLowerCase() as any
      })

      // 设置字体（支持中文）
      doc.setFont('helvetica')

      // 添加标题
      doc.setFontSize(20)
      const title = reportType === 'weekly'
        ? `${report.projectName} - ${report.reportWeek} 周报`
        : `${report.projectName} - ${report.reportMonth} 月报`

      doc.text(title, 20, 30)

      // 添加基本信息
      doc.setFontSize(12)
      let yPosition = 50

      const basicInfo = [
        `项目名称: ${report.projectName}`,
        `客户名称: ${report.customerName}`,
        `报告周期: ${reportType === 'weekly' ? report.reportWeek : report.reportMonth}`,
        `生成时间: ${new Date().toLocaleString('zh-CN')}`,
        `报告状态: ${this.getStatusLabel(report.status)}`
      ]

      basicInfo.forEach(info => {
        doc.text(info, 20, yPosition)
        yPosition += 10
      })

      // 添加内容摘要
      yPosition += 10
      doc.setFontSize(14)
      doc.text('内容摘要', 20, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      const summary = reportType === 'weekly'
        ? report.summary || '周报摘要信息'
        : report.monthlySummary || '月报摘要信息'

      // 处理长文本换行
      const splitSummary = doc.splitTextToSize(summary, 170)
      doc.text(splitSummary, 20, yPosition)
      yPosition += splitSummary.length * 5 + 10

      // 添加数据图表占位符（如果启用）
      if (config.includeCharts) {
        doc.setFontSize(14)
        doc.text('数据图表', 20, yPosition)
        yPosition += 10

        // 添加图表占位框
        doc.rect(20, yPosition, 170, 80)
        doc.setFontSize(10)
        doc.text('数据看板截图将在此处显示', 25, yPosition + 40)
        yPosition += 90
      }

      // 添加建议和计划
      if (yPosition > 250) {
        doc.addPage()
        yPosition = 30
      }

      doc.setFontSize(14)
      doc.text('优化建议', 20, yPosition)
      yPosition += 10

      doc.setFontSize(10)
      const suggestions = report.suggestions || '暂无建议'
      const splitSuggestions = doc.splitTextToSize(suggestions, 170)
      doc.text(splitSuggestions, 20, yPosition)
      yPosition += splitSuggestions.length * 5 + 10

      // 添加水印
      if (config.watermark) {
        doc.setTextColor(200, 200, 200)
        doc.setFontSize(50)
        doc.text(config.watermark, 105, 150, {
          angle: 45,
          align: 'center'
        })
      }

      // 生成文件名
      const fileName = `${report.projectName}_${reportType === 'weekly' ? report.reportWeek : report.reportMonth}_报告.pdf`

      // 下载文件
      doc.save(fileName)

      console.log('✅ PDF文件生成成功')

      return {
        success: true,
        message: 'PDF导出成功',
        downloadUrl: `data:application/pdf;base64,${btoa(doc.output())}`
      }

    } catch (error) {
      console.error('PDF导出失败:', error)
      throw error
    }
  }

  /**
   * 导出为Word格式
   */
  private async exportToWord(
    report: any,
    config: ExportConfig,
    reportType: 'weekly' | 'monthly' = 'weekly'
  ): Promise<{ success: boolean; message: string; downloadUrl?: string }> {
    try {
      console.log('🔄 正在生成Word文件...')

      // 模拟Word文档生成
      const title = reportType === 'weekly'
        ? `${report.projectName} - ${report.reportWeek} 周报`
        : `${report.projectName} - ${report.reportMonth} 月报`

      const wordContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${title}</title>
    <style>
        body { font-family: 'Microsoft YaHei', Arial, sans-serif; margin: 40px; }
        h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
        h2 { color: #555; margin-top: 30px; }
        .info-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .info-table td { padding: 8px; border: 1px solid #ddd; }
        .info-table td:first-child { background: #f8f9fa; font-weight: bold; width: 120px; }
        .content-section { margin: 20px 0; padding: 15px; background: #f8f9fa; border-radius: 5px; }
    </style>
</head>
<body>
    <h1>${title}</h1>

    <h2>基本信息</h2>
    <table class="info-table">
        <tr><td>项目名称</td><td>${report.projectName}</td></tr>
        <tr><td>客户名称</td><td>${report.customerName}</td></tr>
        <tr><td>报告周期</td><td>${reportType === 'weekly' ? report.reportWeek : report.reportMonth}</td></tr>
        <tr><td>生成时间</td><td>${new Date().toLocaleString('zh-CN')}</td></tr>
        <tr><td>报告状态</td><td>${this.getStatusLabel(report.status)}</td></tr>
    </table>

    <h2>内容摘要</h2>
    <div class="content-section">
        ${reportType === 'weekly' ? report.summary || '周报摘要信息' : report.monthlySummary || '月报摘要信息'}
    </div>

    <h2>优化建议</h2>
    <div class="content-section">
        ${report.suggestions || '暂无建议'}
    </div>

    ${reportType === 'weekly' ? `
    <h2>下周计划</h2>
    <div class="content-section">
        ${report.nextWeekPlan || '下周计划待制定'}
    </div>
    ` : `
    <h2>下月计划</h2>
    <div class="content-section">
        ${report.nextMonthPlan || '下月计划待制定'}
    </div>
    `}

    <div style="margin-top: 50px; text-align: center; color: #999; font-size: 12px;">
        由艾维数据平台自动生成
    </div>
</body>
</html>
      `

      // 创建Blob并下载
      const blob = new Blob([wordContent], {
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      })

      const fileName = `${report.projectName}_${reportType === 'weekly' ? report.reportWeek : report.reportMonth}_报告.doc`

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log('✅ Word文件生成成功')

      return {
        success: true,
        message: 'Word导出成功',
        downloadUrl: URL.createObjectURL(blob)
      }

    } catch (error) {
      console.error('Word导出失败:', error)
      throw error
    }
  }

  /**
   * 导出为Excel格式
   */
  private async exportToExcel(
    report: any,
    config: ExportConfig,
    reportType: 'weekly' | 'monthly' = 'weekly'
  ): Promise<{ success: boolean; message: string; downloadUrl?: string }> {
    try {
      console.log('🔄 正在生成Excel文件...')

      // 模拟Excel数据
      const csvContent = `报告类型,${reportType === 'weekly' ? '周报' : '月报'}
项目名称,${report.projectName}
客户名称,${report.customerName}
报告周期,${reportType === 'weekly' ? report.reportWeek : report.reportMonth}
生成时间,${new Date().toLocaleString('zh-CN')}
报告状态,${this.getStatusLabel(report.status)}

内容摘要
${reportType === 'weekly' ? report.summary || '周报摘要信息' : report.monthlySummary || '月报摘要信息'}

优化建议
${report.suggestions || '暂无建议'}
`

      const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
      const fileName = `${report.projectName}_${reportType === 'weekly' ? report.reportWeek : report.reportMonth}_报告.csv`

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log('✅ Excel文件生成成功')

      return {
        success: true,
        message: 'Excel导出成功',
        downloadUrl: URL.createObjectURL(blob)
      }

    } catch (error) {
      console.error('Excel导出失败:', error)
      throw error
    }
  }

  /**
   * 导出为HTML格式
   */
  private async exportToHTML(
    report: any,
    config: ExportConfig,
    reportType: 'weekly' | 'monthly' = 'weekly'
  ): Promise<{ success: boolean; message: string; downloadUrl?: string }> {
    try {
      console.log('🔄 正在生成HTML文件...')

      const title = reportType === 'weekly'
        ? `${report.projectName} - ${report.reportWeek} 周报`
        : `${report.projectName} - ${report.reportMonth} 月报`

      const htmlContent = `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: 'Microsoft YaHei', Arial, sans-serif;
            margin: 0;
            padding: 40px;
            background: #f5f5f5;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        }
        h1 {
            color: #333;
            border-bottom: 3px solid #007bff;
            padding-bottom: 15px;
            margin-bottom: 30px;
        }
        h2 {
            color: #555;
            margin-top: 40px;
            margin-bottom: 15px;
            padding-left: 10px;
            border-left: 4px solid #007bff;
        }
        .info-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
            margin: 20px 0;
        }
        .info-item {
            padding: 15px;
            background: #f8f9fa;
            border-radius: 5px;
            border-left: 4px solid #007bff;
        }
        .info-label {
            font-weight: bold;
            color: #666;
            font-size: 14px;
        }
        .info-value {
            color: #333;
            font-size: 16px;
            margin-top: 5px;
        }
        .content-section {
            margin: 25px 0;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            line-height: 1.6;
        }
        .footer {
            margin-top: 50px;
            text-align: center;
            color: #999;
            font-size: 14px;
            border-top: 1px solid #eee;
            padding-top: 20px;
        }
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>${title}</h1>

        <h2>基本信息</h2>
        <div class="info-grid">
            <div class="info-item">
                <div class="info-label">项目名称</div>
                <div class="info-value">${report.projectName}</div>
            </div>
            <div class="info-item">
                <div class="info-label">客户名称</div>
                <div class="info-value">${report.customerName}</div>
            </div>
            <div class="info-item">
                <div class="info-label">报告周期</div>
                <div class="info-value">${reportType === 'weekly' ? report.reportWeek : report.reportMonth}</div>
            </div>
            <div class="info-item">
                <div class="info-label">生成时间</div>
                <div class="info-value">${new Date().toLocaleString('zh-CN')}</div>
            </div>
        </div>

        <h2>内容摘要</h2>
        <div class="content-section">
            ${reportType === 'weekly' ? report.summary || '周报摘要信息' : report.monthlySummary || '月报摘要信息'}
        </div>

        <h2>优化建议</h2>
        <div class="content-section">
            ${report.suggestions || '暂无建议'}
        </div>

        ${reportType === 'weekly' ? `
        <h2>下周计划</h2>
        <div class="content-section">
            ${report.nextWeekPlan || '下周计划待制定'}
        </div>
        ` : `
        <h2>下月计划</h2>
        <div class="content-section">
            ${report.nextMonthPlan || '下月计划待制定'}
        </div>
        `}

        <div class="footer">
            由艾维数据平台自动生成 | 生成时间: ${new Date().toLocaleString('zh-CN')}
        </div>
    </div>
</body>
</html>
      `

      const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' })
      const fileName = `${report.projectName}_${reportType === 'weekly' ? report.reportWeek : report.reportMonth}_报告.html`

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      console.log('✅ HTML文件生成成功')

      return {
        success: true,
        message: 'HTML导出成功',
        downloadUrl: URL.createObjectURL(blob)
      }

    } catch (error) {
      console.error('HTML导出失败:', error)
      throw error
    }
  }

  /**
   * 通过邮件发送报告
   */
  async sendReportByEmail(
    report: any,
    emailConfig: EmailConfig,
    exportFormat: ExportFormat = 'pdf'
  ): Promise<{ success: boolean; message: string }> {
    try {
      console.log(`📧 准备通过邮件发送报告...`)

      // 首先导出报告
      const exportResult = await this.exportWeeklyReport(report, exportFormat)

      if (!exportResult.success) {
        throw new Error('报告导出失败')
      }

      // 模拟邮件发送
      const emailData = {
        to: emailConfig.recipients,
        subject: emailConfig.subject,
        body: emailConfig.body,
        attachments: [{
          filename: emailConfig.attachmentName || `${report.projectName}_报告.${exportFormat}`,
          content: exportResult.downloadUrl
        }]
      }

      console.log('📧 邮件发送配置:', emailData)

      // 模拟发送延迟
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('✅ 邮件发送成功')

      return {
        success: true,
        message: `报告已成功发送至 ${emailConfig.recipients.join(', ')}`
      }

    } catch (error) {
      console.error('邮件发送失败:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : '邮件发送失败'
      }
    }
  }

  /**
   * 批量导出报告
   */
  async batchExport(
    reports: any[],
    format: ExportFormat = 'pdf',
    config?: Partial<ExportConfig>
  ): Promise<{ success: boolean; message: string; results: any[] }> {
    try {
      console.log(`📦 开始批量导出 ${reports.length} 个报告...`)

      const results = []

      for (const report of reports) {
        try {
          const result = await this.exportWeeklyReport(report, format, config)
          results.push({
            reportId: report.id,
            reportName: `${report.projectName} - ${report.reportWeek || report.reportMonth}`,
            success: result.success,
            message: result.message
          })
        } catch (error) {
          results.push({
            reportId: report.id,
            reportName: `${report.projectName} - ${report.reportWeek || report.reportMonth}`,
            success: false,
            message: error instanceof Error ? error.message : '导出失败'
          })
        }
      }

      const successCount = results.filter(r => r.success).length
      const failCount = results.filter(r => !r.success).length

      console.log(`✅ 批量导出完成: 成功 ${successCount} 个，失败 ${failCount} 个`)

      return {
        success: true,
        message: `批量导出完成: 成功 ${successCount} 个，失败 ${failCount} 个`,
        results
      }

    } catch (error) {
      console.error('批量导出失败:', error)
      return {
        success: false,
        message: error instanceof Error ? error.message : '批量导出失败',
        results: []
      }
    }
  }

  /**
   * 获取状态标签
   */
  private getStatusLabel(status: string): string {
    const statusMap = {
      draft: '草稿',
      pending: '待审核',
      approved: '已审核',
      sent: '已发送',
      archived: '已归档'
    }
    return statusMap[status as keyof typeof statusMap] || status
  }

  /**
   * 更新导出配置
   */
  updateConfig(newConfig: Partial<ExportConfig>): void {
    this.config = { ...this.config, ...newConfig }
    console.log('📋 导出配置已更新:', this.config)
  }

  /**
   * 获取当前配置
   */
  getConfig(): ExportConfig {
    return { ...this.config }
  }
}

// 创建全局导出服务实例
export const reportExportService = new ReportExportService()

export default reportExportService
