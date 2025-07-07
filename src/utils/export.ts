/**
 * 数据导出工具类
 * 支持 CSV, Excel, PDF 等格式的数据导出
 */

export interface ExportColumn {
  key: string
  label: string
  formatter?: (value: unknown) => string
}

export interface ExportOptions {
  filename?: string
  sheetName?: string
  includeHeaders?: boolean
  dateFormat?: string
}

/**
 * 导出为 CSV 格式
 */
export const exportToCSV = (
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  options: ExportOptions = {}
): void => {
  const {
    filename = 'export',
    includeHeaders = true
  } = options

  let csvContent = ''

  // 添加表头
  if (includeHeaders) {
    const headers = columns.map(col => `"${col.label}"`).join(',')
    csvContent += headers + '\n'
  }

  // 添加数据行
  data.forEach(row => {
    const values = columns.map(col => {
      let value = row[col.key]
      
      // 应用格式化函数
      if (col.formatter && value !== undefined && value !== null) {
        value = col.formatter(value)
      }
      
      // 处理字符串中的引号和换行符
      if (typeof value === 'string') {
        const stringValue = value as string
        value = stringValue.replace(/"/g, '""')
        if (stringValue.includes(',') || stringValue.includes('\n') || stringValue.includes('"')) {
          value = `"${value}"`
        }
      }
      
      return value || ''
    })
    
    csvContent += values.join(',') + '\n'
  })

  // 创建下载链接
  const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${formatDate(new Date())}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * 导出为 Excel 格式 (基于 CSV，可用 Excel 打开)
 */
export const exportToExcel = (
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  options: ExportOptions = {}
): void => {
  const {
    filename = 'export',
    sheetName = 'Sheet1',
    includeHeaders = true
  } = options

  // 创建 Excel 兼容的 CSV 内容
  let csvContent = ''

  // 添加表头
  if (includeHeaders) {
    const headers = columns.map(col => col.label).join('\t')
    csvContent += headers + '\n'
  }

  // 添加数据行
  data.forEach(row => {
    const values = columns.map(col => {
      let value = row[col.key]
      
      if (col.formatter && value !== undefined && value !== null) {
        value = col.formatter(value)
      }
      
      // Excel 特殊处理
      if (typeof value === 'string') {
        // 移除制表符和换行符
        value = value.replace(/[\t\n\r]/g, ' ')
      }
      
      return value || ''
    })
    
    csvContent += values.join('\t') + '\n'
  })

  // 创建下载链接
  const blob = new Blob([csvContent], { type: 'application/vnd.ms-excel;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${formatDate(new Date())}.xls`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * 导出为 JSON 格式
 */
export const exportToJSON = (
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  options: ExportOptions = {}
): void => {
  const { filename = 'export' } = options

  // 过滤和格式化数据
  const exportData = data.map(row => {
    const filteredRow: Record<string, unknown> = {}
    
    columns.forEach(col => {
      let value = row[col.key]
      
      if (col.formatter && value !== undefined && value !== null) {
        value = col.formatter(value)
      }
      
      filteredRow[col.key] = value
    })
    
    return filteredRow
  })

  const jsonContent = JSON.stringify(exportData, null, 2)
  
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}_${formatDate(new Date())}.json`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

/**
 * 生成报告 HTML
 */
export const generateReportHTML = (
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  options: ExportOptions & {
    title?: string
    description?: string
    includeStats?: boolean
  } = {}
): string => {
  const {
    title = '数据报告',
    description = '',
    includeStats = true,
    includeHeaders = true
  } = options

  let html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${title}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          margin: 40px;
          line-height: 1.6;
          color: #333;
        }
        .header {
          margin-bottom: 30px;
          padding-bottom: 20px;
          border-bottom: 2px solid #e0e0e0;
        }
        .title {
          font-size: 28px;
          font-weight: bold;
          color: #1890ff;
          margin: 0 0 10px 0;
        }
        .description {
          font-size: 16px;
          color: #666;
          margin: 0;
        }
        .stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin: 30px 0;
        }
        .stat-card {
          background: #f8f9fa;
          padding: 20px;
          border-radius: 8px;
          border: 1px solid #e0e0e0;
        }
        .stat-label {
          font-size: 14px;
          color: #666;
          margin-bottom: 5px;
        }
        .stat-value {
          font-size: 24px;
          font-weight: bold;
          color: #333;
        }
        .table-container {
          overflow-x: auto;
          margin-top: 30px;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        th {
          background: #1890ff;
          color: white;
          padding: 15px 12px;
          text-align: left;
          font-weight: 600;
          font-size: 14px;
        }
        td {
          padding: 12px;
          border-bottom: 1px solid #e0e0e0;
          font-size: 14px;
        }
        tr:nth-child(even) {
          background: #f8f9fa;
        }
        tr:hover {
          background: #e6f7ff;
        }
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid #e0e0e0;
          text-align: center;
          color: #666;
          font-size: 12px;
        }
        @media print {
          body { margin: 20px; }
          .stats { grid-template-columns: repeat(2, 1fr); }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 class="title">${title}</h1>
        ${description ? `<p class="description">${description}</p>` : ''}
      </div>
  `

  // 添加统计信息
  if (includeStats) {
    const stats = generateStats(data, columns)
    html += `
      <div class="stats">
        ${stats.map(stat => `
          <div class="stat-card">
            <div class="stat-label">${stat.label}</div>
            <div class="stat-value">${stat.value}</div>
          </div>
        `).join('')}
      </div>
    `
  }

  // 添加数据表格
  html += `
    <div class="table-container">
      <table>
  `

  // 表头
  if (includeHeaders) {
    html += `
      <thead>
        <tr>
          ${columns.map(col => `<th>${col.label}</th>`).join('')}
        </tr>
      </thead>
    `
  }

  // 数据行
  html += `
    <tbody>
      ${data.map(row => `
        <tr>
          ${columns.map(col => {
            let value = row[col.key]
            if (col.formatter && value !== undefined && value !== null) {
              value = col.formatter(value)
            }
            return `<td>${escapeHtml(String(value || ''))}</td>`
          }).join('')}
        </tr>
      `).join('')}
    </tbody>
  `

  html += `
      </table>
    </div>
    <div class="footer">
      <p>报告生成时间: ${formatDateTime(new Date())}</p>
      <p>数据记录数: ${data.length} 条</p>
    </div>
    </body>
    </html>
  `

  return html
}

/**
 * 导出为 PDF (通过打印)
 */
export const exportToPDF = (
  data: Record<string, unknown>[],
  columns: ExportColumn[],
  options: ExportOptions & {
    title?: string
    description?: string
    includeStats?: boolean
  } = {}
): void => {
  const { filename = 'export' } = options
  
  const htmlContent = generateReportHTML(data, columns, options)
  
  // 创建新窗口用于打印
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    
    // 等待内容加载完成后打印
    printWindow.onload = () => {
      printWindow.print()
      // 可选：打印完成后关闭窗口
      // printWindow.onafterprint = () => printWindow.close()
    }
  }
}

/**
 * 批量导出多个数据集
 */
export const exportMultipleDatasets = (
  datasets: Array<{
    name: string
    data: Record<string, unknown>[]
    columns: ExportColumn[]
  }>,
  format: 'csv' | 'excel' | 'json' = 'csv',
  options: ExportOptions = {}
): void => {
  const { filename = 'multi_export' } = options
  
  datasets.forEach((dataset, index) => {
    const datasetOptions = {
      ...options,
      filename: `${filename}_${dataset.name}`
    }
    
    // 延迟下载以避免浏览器阻塞
    setTimeout(() => {
      switch (format) {
        case 'csv':
          exportToCSV(dataset.data, dataset.columns, datasetOptions)
          break
        case 'excel':
          exportToExcel(dataset.data, dataset.columns, datasetOptions)
          break
        case 'json':
          exportToJSON(dataset.data, dataset.columns, datasetOptions)
          break
      }
    }, index * 500)
  })
}

// 工具函数
const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0]
}

const formatDateTime = (date: Date): string => {
  return date.toLocaleString('zh-CN')
}

const escapeHtml = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

const generateStats = (
  data: Record<string, unknown>[],
  columns: ExportColumn[]
): Array<{ label: string; value: string }> => {
  const stats = [
    {
      label: '总记录数',
      value: data.length.toLocaleString()
    },
    {
      label: '导出时间',
      value: formatDateTime(new Date())
    }
  ]

  // 尝试生成数值类型的统计
  columns.forEach(col => {
    const values = data
      .map(row => row[col.key])
      .filter(val => typeof val === 'number' && !isNaN(val as number)) as number[]
    
    if (values.length > 0) {
      const sum = values.reduce((a, b) => a + b, 0)
      const avg = sum / values.length
      
      stats.push({
        label: `${col.label}平均值`,
        value: avg.toLocaleString()
      })
    }
  })

  return stats
}

// 常用格式化函数
export const formatters = {
  currency: (value: unknown): string => {
    if (typeof value === 'number') {
      return `$${value.toLocaleString()}`
    }
    return String(value || '')
  },
  
  percentage: (value: unknown): string => {
    if (typeof value === 'number') {
      return `${value.toFixed(1)}%`
    }
    return String(value || '')
  },
  
  date: (value: unknown): string => {
    if (value instanceof Date) {
      return value.toLocaleDateString('zh-CN')
    }
    if (typeof value === 'string') {
      const date = new Date(value)
      return isNaN(date.getTime()) ? String(value) : date.toLocaleDateString('zh-CN')
    }
    return String(value || '')
  },
  
  number: (value: unknown): string => {
    if (typeof value === 'number') {
      return value.toLocaleString()
    }
    return String(value || '')
  }
}