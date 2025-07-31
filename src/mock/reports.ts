// 周报数据 - 数据看板格式
export const weeklyReports = [
  {
    id: 'weekly-1',
    projectId: 'project-1',
    customerId: 'customer-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    weekPeriod: '2025-W03',
    reportYear: 2025,
    weekNumber: 3,
    status: 'completed',
    metrics: {
      visits: 12500,
      visitsChange: 15.2,
      conversion: 3.8,
      conversionChange: 0.5,
      adSpend: 8500,
      adSpendChange: -2.1,
      roi: 285,
      roiChange: 12.3,
      impressions: 450000,
      clicks: 18500,
      ctr: 4.1,
      cpc: 0.46
    },
    dashboardData: {
      trafficTrend: [
        { day: 'Mon', visits: 1800, conversions: 65 },
        { day: 'Tue', visits: 2100, conversions: 78 },
        { day: 'Wed', visits: 1950, conversions: 72 },
        { day: 'Thu', visits: 2200, conversions: 85 },
        { day: 'Fri', visits: 1850, conversions: 68 },
        { day: 'Sat', visits: 1300, conversions: 48 },
        { day: 'Sun', visits: 1300, conversions: 52 }
      ],
      channelData: [
        { channel: 'Google Ads', visits: 5200, conversion: 4.2 },
        { channel: 'Facebook', visits: 3800, conversion: 3.1 },
        { channel: 'Instagram', visits: 2100, conversion: 3.9 },
        { channel: 'Bing', visits: 1400, conversion: 2.8 }
      ]
    },
    createdBy: 'user-1',
    createdAt: '2025-01-20T17:00:00Z',
    updatedAt: '2025-01-20T17:00:00Z'
  },
  {
    id: 'weekly-2',
    projectId: 'project-2',
    customerId: 'customer-2',
    projectName: 'Samsung Galaxy营销项目',
    customerName: 'Samsung Electronics',
    weekPeriod: '2025-W03',
    reportYear: 2025,
    weekNumber: 3,
    status: 'completed',
    metrics: {
      visits: 9800,
      visitsChange: 8.7,
      conversion: 4.2,
      conversionChange: -0.3,
      adSpend: 6200,
      adSpendChange: 1.8,
      roi: 320,
      roiChange: 5.6,
      impressions: 380000,
      clicks: 15200,
      ctr: 4.0,
      cpc: 0.41
    },
    dashboardData: {
      trafficTrend: [
        { day: 'Mon', visits: 1400, conversions: 58 },
        { day: 'Tue', visits: 1650, conversions: 68 },
        { day: 'Wed', visits: 1520, conversions: 62 },
        { day: 'Thu', visits: 1780, conversions: 75 },
        { day: 'Fri', visits: 1450, conversions: 61 },
        { day: 'Sat', visits: 1000, conversions: 42 },
        { day: 'Sun', visits: 1000, conversions: 45 }
      ],
      channelData: [
        { channel: 'Google Ads', visits: 4200, conversion: 4.8 },
        { channel: 'Facebook', visits: 2800, conversion: 3.5 },
        { channel: 'Instagram', visits: 1900, conversion: 4.1 },
        { channel: 'YouTube', visits: 900, conversion: 3.2 }
      ]
    },
    createdBy: 'user-2',
    createdAt: '2025-01-20T17:00:00Z',
    updatedAt: '2025-01-20T17:00:00Z'
  }
]

// 月报数据 - 数据看板格式
export const monthlyReports = [
  {
    id: 'monthly-1',
    projectId: 'project-1',
    customerId: 'customer-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    monthPeriod: '2025-01',
    reportYear: 2025,
    month: 1,
    weeklyReportsCount: 4,
    status: 'completed',
    metrics: {
      visits: 48500,
      visitsChange: 22.1,
      conversion: 3.6,
      conversionChange: 0.8,
      adSpend: 32000,
      adSpendChange: -5.2,
      roi: 295,
      roiChange: 18.7,
      impressions: 1800000,
      clicks: 72000,
      ctr: 4.0,
      cpc: 0.44
    },
    dashboardData: {
      monthlyTrend: [
        { week: 'W1', visits: 11200, conversions: 398, adSpend: 7800 },
        { week: 'W2', visits: 12100, conversions: 428, adSpend: 8200 },
        { week: 'W3', visits: 12500, conversions: 450, adSpend: 8500 },
        { week: 'W4', visits: 12700, conversions: 465, adSpend: 7500 }
      ],
      weeklyComparison: [
        { metric: 'Visits', w1: 11200, w2: 12100, w3: 12500, w4: 12700 },
        { metric: 'Conversions', w1: 398, w2: 428, w3: 450, w4: 465 },
        { metric: 'Ad Spend', w1: 7800, w2: 8200, w3: 8500, w4: 7500 }
      ]
    },
    createdBy: 'user-1',
    createdAt: '2025-01-31T17:00:00Z',
    updatedAt: '2025-01-31T17:00:00Z'
  }
]

// 会议数据
export const meetings = [
  {
    id: 'meeting-1',
    title: 'Apple iPhone项目周报会议',
    date: '2025-01-27',
    time: '14:00',
    attendees: ['张三', '李四', 'John Smith'],
    reportType: 'weekly',
    reportId: 'weekly-1',
    reportPeriod: '2025-W03',
    status: 'scheduled',
    agenda: '1. 回顾本周数据表现\n2. 讨论优化策略\n3. 确定下周计划',
    notes: '',
    todos: [],
    createdBy: 'user-1',
    createdAt: '2025-01-25T10:00:00Z'
  },
  {
    id: 'meeting-2',
    title: 'Samsung Galaxy月报评审',
    date: '2025-01-31',
    time: '16:00',
    attendees: ['王五', '赵六', 'Kim Lee'],
    reportType: 'monthly',
    reportId: 'monthly-1',
    reportPeriod: '2025-01',
    status: 'completed',
    agenda: '1. 月度数据总结\n2. 下月投放策略\n3. 预算分配讨论',
    notes: '会议讨论了下月的投放重点，决定增加移动端投放比例。',
    todos: [
      {
        task: '制定移动端投放计划',
        assignee: '王五',
        deadline: '2025-02-05',
        status: 'pending'
      },
      {
        task: '优化着陆页移动体验',
        assignee: '赵六',
        deadline: '2025-02-10',
        status: 'pending'
      }
    ],
    createdBy: 'user-2',
    createdAt: '2025-01-29T09:00:00Z'
  }
]

// Mock API 函数
export const mockGetWeeklyReports = (filters: any = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...weeklyReports]

      if (filters.projectId) {
        filtered = filtered.filter(r => r.projectId === filters.projectId)
      }

      if (filters.status) {
        filtered = filtered.filter(r => r.status === filters.status)
      }

      resolve({
        success: true,
        data: filtered,
        total: filtered.length
      })
    }, 500)
  })
}

export const mockGetMonthlyReports = (filters: any = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...monthlyReports]

      if (filters.projectId) {
        filtered = filtered.filter(r => r.projectId === filters.projectId)
      }

      if (filters.status) {
        filtered = filtered.filter(r => r.status === filters.status)
      }

      resolve({
        success: true,
        data: filtered,
        total: filtered.length
      })
    }, 500)
  })
}

export const mockGetMeetings = (filters: any = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filtered = [...meetings]

      if (filters.reportType) {
        filtered = filtered.filter(m => m.reportType === filters.reportType)
      }

      if (filters.status) {
        filtered = filtered.filter(m => m.status === filters.status)
      }

      resolve({
        success: true,
        data: filtered,
        total: filtered.length
      })
    }, 300)
  })
}

export const mockCreateWeeklyReport = (reportData: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReport = {
        id: `weekly-${Date.now()}`,
        ...reportData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      weeklyReports.push(newReport)

      resolve({
        success: true,
        data: newReport
      })
    }, 800)
  })
}

export const mockCreateMonthlyReport = (reportData: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReport = {
        id: `monthly-${Date.now()}`,
        ...reportData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      monthlyReports.push(newReport)

      resolve({
        success: true,
        data: newReport
      })
    }, 1000)
  })
}

export const mockCreateMeeting = (meetingData: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newMeeting = {
        id: `meeting-${Date.now()}`,
        ...meetingData,
        createdAt: new Date().toISOString()
      }

      meetings.push(newMeeting)

      resolve({
        success: true,
        data: newMeeting
      })
    }, 500)
  })
}

export const mockUpdateMeeting = (meetingId: string, updateData: any) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = meetings.findIndex(m => m.id === meetingId)
      if (index > -1) {
        meetings[index] = { ...meetings[index], ...updateData }
        resolve({
          success: true,
          data: meetings[index]
        })
      } else {
        resolve({
          success: false,
          message: '会议不存在'
        })
      }
    }, 500)
  })
}

export const mockDownloadReportData = (reportId: string, reportType: 'weekly' | 'monthly') => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const reports = reportType === 'weekly' ? weeklyReports : monthlyReports
      const report = reports.find(r => r.id === reportId)

      if (report) {
        // 模拟生成下载链接
        const downloadUrl = `data:application/json;charset=utf-8,${encodeURIComponent(JSON.stringify(report, null, 2))}`

        resolve({
          success: true,
          downloadUrl,
                     fileName: `${report.projectName}_${(report as any).weekPeriod || (report as any).monthPeriod}_数据.json`
        })
      } else {
        resolve({
          success: false,
          message: '报告不存在'
        })
      }
    }, 800)
  })
}

// 报告统计数据
export const reportStats = {
  totalReports: 24,
  thisMonth: 8,
  downloads: 156,
  mostUsed: '数据看板概览报告'
}
