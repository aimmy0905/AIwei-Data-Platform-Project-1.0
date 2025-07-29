// 周报月报管理模块的Mock数据

// 报告模板数据
export const reportTemplates = [
  {
    id: 'dashboard-overview',
    name: '数据看板概览报告',
    description: '包含关键指标、图表和趋势分析的综合报告',
    type: 'dashboard',
    sections: [
      { id: 'data-summary', name: '数据摘要', required: true },
      { id: 'trend-analysis', name: '趋势分析', required: true },
      { id: 'goal-progress', name: '目标进度', required: true },
      { id: 'recommendations', name: '优化建议', required: false }
    ],
    isDefault: true,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'customer-analysis',
    name: '客户分析报告',
    description: '详细的客户数据分析和洞察报告',
    type: 'customer',
    sections: [
      { id: 'customer-overview', name: '客户概览', required: true },
      { id: 'behavior-analysis', name: '行为分析', required: true },
      { id: 'satisfaction', name: '满意度分析', required: true },
      { id: 'retention', name: '留存分析', required: false }
    ],
    isDefault: false,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'channel-performance',
    name: '渠道效果报告',
    description: '各渠道投放效果和ROI分析报告',
    type: 'channel',
    sections: [
      { id: 'channel-overview', name: '渠道概览', required: true },
      { id: 'performance-metrics', name: '效果指标', required: true },
      { id: 'roi-analysis', name: 'ROI分析', required: true },
      { id: 'optimization', name: '优化建议', required: false }
    ],
    isDefault: false,
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'financial-summary',
    name: '财务汇总报告',
    description: '收入、成本和盈利能力分析报告',
    type: 'financial',
    sections: [
      { id: 'revenue-summary', name: '收入汇总', required: true },
      { id: 'cost-analysis', name: '成本分析', required: true },
      { id: 'profitability', name: '盈利分析', required: true },
      { id: 'forecast', name: '预测分析', required: false }
    ],
    isDefault: false,
    createdAt: '2025-01-01T00:00:00Z'
  }
]

// 周报数据
export const weeklyReports = [
  {
    id: 'weekly-2025-01-w1',
    projectId: 'project-1',
    customerId: 'customer-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    reportWeek: '2025-W01',
    reportYear: 2025,
    weekNumber: 1,
    status: 'sent',
    autoScreenshot: true,
    screenshotIds: ['screenshot-2025-01-05'],
    content: {
      dataSummary: '本周关键指标表现良好，点击率提升15%，转化率达到3.2%',
      workSummary: '完成了新版创意素材的制作和投放，优化了目标受众定位',
      meetingRecords: ['meeting-2025-01-03'],
      todoItems: ['todo-2025-01-001', 'todo-2025-01-002'],
      nextWeekPlan: '下周计划扩大投放规模，测试新的广告位置'
    },
    summary: '本周项目进展顺利，各项指标均达到预期目标',
    suggestions: '建议继续优化创意素材，提高用户参与度',
    nextWeekPlan: '计划测试新的投放策略，扩大目标受众范围',
    createdBy: 'user-1',
    createdAt: '2025-01-06T09:00:00Z',
    updatedAt: '2025-01-06T15:30:00Z',
    approvedBy: 'user-2',
    approvedAt: '2025-01-06T16:00:00Z',
    sentAt: '2025-01-06T17:00:00Z'
  },
  {
    id: 'weekly-2025-01-w2',
    projectId: 'project-1',
    customerId: 'customer-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    reportWeek: '2025-W02',
    reportYear: 2025,
    weekNumber: 2,
    status: 'approved',
    autoScreenshot: true,
    screenshotIds: ['screenshot-2025-01-12'],
    content: {
      dataSummary: '本周投放效果持续改善，CPC下降8%，CTR提升到2.1%',
      workSummary: '完成了A/B测试，确定了最佳创意组合',
      meetingRecords: ['meeting-2025-01-10'],
      todoItems: ['todo-2025-01-003', 'todo-2025-01-004'],
      nextWeekPlan: '下周将全面推广最佳创意组合'
    },
    summary: '本周测试效果显著，找到了最佳投放策略',
    suggestions: '建议加大预算投入，扩大成功策略的应用范围',
    nextWeekPlan: '全面应用测试结果，预期进一步提升效果',
    createdBy: 'user-1',
    createdAt: '2025-01-13T09:00:00Z',
    updatedAt: '2025-01-13T14:20:00Z',
    approvedBy: 'user-2',
    approvedAt: '2025-01-13T15:00:00Z',
    sentAt: null
  },
  {
    id: 'weekly-2025-01-w3',
    projectId: 'project-2',
    customerId: 'customer-2',
    projectName: 'Samsung Galaxy营销项目',
    customerName: 'Samsung Electronics',
    reportWeek: '2025-W03',
    reportYear: 2025,
    weekNumber: 3,
    status: 'draft',
    autoScreenshot: true,
    screenshotIds: ['screenshot-2025-01-19'],
    content: {
      dataSummary: '本周数据收集中，初步显示良好趋势',
      workSummary: '完成了项目启动，建立了基础投放框架',
      meetingRecords: ['meeting-2025-01-17'],
      todoItems: ['todo-2025-01-005'],
      nextWeekPlan: '下周开始正式投放测试'
    },
    summary: '项目启动顺利，基础工作已完成',
    suggestions: '建议密切关注初期数据表现',
    nextWeekPlan: '开始小规模测试投放，收集基础数据',
    createdBy: 'user-3',
    createdAt: '2025-01-20T09:00:00Z',
    updatedAt: '2025-01-20T11:30:00Z',
    approvedBy: null,
    approvedAt: null,
    sentAt: null
  }
]

// 月报数据
export const monthlyReports = [
  {
    id: 'monthly-2025-01',
    projectId: 'project-1',
    customerId: 'customer-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    reportMonth: '2025-01',
    reportYear: 2025,
    monthNumber: 1,
    status: 'sent',
    weeklyReportIds: ['weekly-2025-01-w1', 'weekly-2025-01-w2', 'weekly-2025-01-w3', 'weekly-2025-01-w4'],
    screenshotCount: 4,
    content: {
      monthlySummary: '1月份项目表现优异，各项KPI均超预期完成',
      goalAnalysis: '月度目标完成率达到112%，ROI提升25%',
      nextMonthPlan: '2月计划扩大投放规模，开拓新的渠道'
    },
    monthlySummary: '1月份项目整体表现出色，投放效果持续优化',
    goalAnalysis: '销量目标完成112%，成本控制良好，ROI达到4.2',
    nextMonthPlan: '2月份计划增加预算30%，测试新的投放渠道',
    createdBy: 'user-1',
    createdAt: '2025-02-01T09:00:00Z',
    updatedAt: '2025-02-01T16:45:00Z',
    approvedBy: 'user-2',
    approvedAt: '2025-02-01T17:00:00Z',
    sentAt: '2025-02-01T18:00:00Z'
  },
  {
    id: 'monthly-2024-12',
    projectId: 'project-1',
    customerId: 'customer-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    reportMonth: '2024-12',
    reportYear: 2024,
    monthNumber: 12,
    status: 'archived',
    weeklyReportIds: ['weekly-2024-12-w1', 'weekly-2024-12-w2', 'weekly-2024-12-w3', 'weekly-2024-12-w4'],
    screenshotCount: 4,
    content: {
      monthlySummary: '12月份项目稳步推进，为新年度做好准备',
      goalAnalysis: '年度目标基本完成，达成率98%',
      nextMonthPlan: '1月计划优化投放策略，提升效率'
    },
    monthlySummary: '12月份项目收官良好，为新年度奠定基础',
    goalAnalysis: '年度目标完成98%，整体表现符合预期',
    nextMonthPlan: '新年度计划制定新的增长策略',
    createdBy: 'user-1',
    createdAt: '2025-01-01T09:00:00Z',
    updatedAt: '2025-01-01T15:20:00Z',
    approvedBy: 'user-2',
    approvedAt: '2025-01-01T16:00:00Z',
    sentAt: '2025-01-01T17:00:00Z'
  }
]

// 数据看板截图记录
export const dashboardScreenshots = [
  {
    id: 'screenshot-2025-01-05',
    projectId: 'project-1',
    customerId: 'customer-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    screenshotTime: '2025-01-05T23:59:59Z',
    weekNumber: 1,
    fileName: 'Apple_iPhone推广项目_2025-01-05_W01_数据看板截图.png',
    filePath: '/screenshots/2025/01/week1/Apple_iPhone推广项目_2025-01-05_W01_数据看板截图.png',
    fileSize: '2.3 MB',
    qualityStatus: 'good',
    usageStatus: 'used',
    createdAt: '2025-01-05T23:59:59Z'
  },
  {
    id: 'screenshot-2025-01-12',
    projectId: 'project-1',
    customerId: 'customer-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    screenshotTime: '2025-01-12T23:59:59Z',
    weekNumber: 2,
    fileName: 'Apple_iPhone推广项目_2025-01-12_W02_数据看板截图.png',
    filePath: '/screenshots/2025/01/week2/Apple_iPhone推广项目_2025-01-12_W02_数据看板截图.png',
    fileSize: '2.1 MB',
    qualityStatus: 'good',
    usageStatus: 'used',
    createdAt: '2025-01-12T23:59:59Z'
  },
  {
    id: 'screenshot-2025-01-19',
    projectId: 'project-2',
    customerId: 'customer-2',
    projectName: 'Samsung Galaxy营销项目',
    customerName: 'Samsung Electronics',
    screenshotTime: '2025-01-19T23:59:59Z',
    weekNumber: 3,
    fileName: 'Samsung_Galaxy营销项目_2025-01-19_W03_数据看板截图.png',
    filePath: '/screenshots/2025/01/week3/Samsung_Galaxy营销项目_2025-01-19_W03_数据看板截图.png',
    fileSize: '1.9 MB',
    qualityStatus: 'good',
    usageStatus: 'unused',
    createdAt: '2025-01-19T23:59:59Z'
  }
]

// 会议记录数据
export const meetingRecords = [
  {
    id: 'meeting-2025-01-03',
    projectId: 'project-1',
    customerId: 'customer-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    meetingTitle: '项目启动会议',
    meetingType: 'project-kickoff',
    meetingTime: '2025-01-03T14:00:00Z',
    attendees: [
      { id: 'user-1', name: '张三', role: '项目经理' },
      { id: 'user-2', name: '李四', role: '运营专员' },
      { id: 'client-1', name: 'John Smith', role: '客户代表' }
    ],
    agenda: [
      { id: 1, title: '项目背景介绍', duration: 15 },
      { id: 2, title: '投放策略讨论', duration: 30 },
      { id: 3, title: '时间节点确认', duration: 15 }
    ],
    decisions: [
      { id: 1, content: '确定投放预算为50万/月', responsible: 'user-1' },
      { id: 2, content: '优先投放iOS平台', responsible: 'user-2' }
    ],
    actionItems: [
      { id: 1, content: '完成素材制作', responsible: 'user-2', dueDate: '2025-01-10' },
      { id: 2, content: '设置投放账户', responsible: 'user-1', dueDate: '2025-01-08' }
    ],
    content: '会议讨论了项目的整体策略和执行计划，确定了关键的时间节点和责任分工。',
    status: 'published',
    createdBy: 'user-1',
    createdAt: '2025-01-03T16:00:00Z',
    publishedAt: '2025-01-03T17:00:00Z'
  },
  {
    id: 'meeting-2025-01-10',
    projectId: 'project-1',
    customerId: 'customer-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    meetingTitle: '周度进展回顾',
    meetingType: 'weekly-review',
    meetingTime: '2025-01-10T10:00:00Z',
    attendees: [
      { id: 'user-1', name: '张三', role: '项目经理' },
      { id: 'user-2', name: '李四', role: '运营专员' }
    ],
    agenda: [
      { id: 1, title: '上周数据回顾', duration: 20 },
      { id: 2, title: '问题讨论', duration: 20 },
      { id: 3, title: '下周计划', duration: 10 }
    ],
    decisions: [
      { id: 1, content: '调整目标受众年龄段', responsible: 'user-2' },
      { id: 2, content: '增加视频创意比例', responsible: 'user-2' }
    ],
    actionItems: [
      { id: 1, content: '制作新的视频创意', responsible: 'user-2', dueDate: '2025-01-15' },
      { id: 2, content: '优化受众定位', responsible: 'user-1', dueDate: '2025-01-12' }
    ],
    content: '回顾了上周的投放数据，发现了一些优化空间，制定了具体的改进计划。',
    status: 'published',
    createdBy: 'user-1',
    createdAt: '2025-01-10T11:30:00Z',
    publishedAt: '2025-01-10T12:00:00Z'
  },
  {
    id: 'meeting-2025-01-17',
    projectId: 'project-2',
    customerId: 'customer-2',
    projectName: 'Samsung Galaxy营销项目',
    customerName: 'Samsung Electronics',
    meetingTitle: '项目启动会议',
    meetingType: 'project-kickoff',
    meetingTime: '2025-01-17T15:00:00Z',
    attendees: [
      { id: 'user-3', name: '王五', role: '项目经理' },
      { id: 'user-4', name: '赵六', role: '运营专员' },
      { id: 'client-2', name: 'Kim Lee', role: '客户代表' }
    ],
    agenda: [
      { id: 1, title: '项目目标确认', duration: 20 },
      { id: 2, title: '投放渠道讨论', duration: 25 },
      { id: 3, title: '预算分配', duration: 15 }
    ],
    decisions: [
      { id: 1, content: '主要投放Facebook和Google', responsible: 'user-3' },
      { id: 2, content: '预算分配：Facebook 60%，Google 40%', responsible: 'user-3' }
    ],
    actionItems: [
      { id: 1, content: '准备投放素材', responsible: 'user-4', dueDate: '2025-01-25' },
      { id: 2, content: '设置跟踪代码', responsible: 'user-3', dueDate: '2025-01-22' }
    ],
    content: '新项目启动会议，确定了投放策略和预算分配，明确了各方责任。',
    status: 'draft',
    createdBy: 'user-3',
    createdAt: '2025-01-17T16:30:00Z',
    publishedAt: null
  }
]

// 待办事项数据
export const todoItems = [
  {
    id: 'todo-2025-01-001',
    customerId: 'customer-1',
    projectId: 'project-1',
    title: '优化iPhone广告创意素材',
    description: '根据上周数据分析结果，优化现有创意素材，提高点击率',
    priority: 'high',
    type: 'optimization',
    assigneeId: 'user-2',
    assigneeName: '李四',
    creatorId: 'user-1',
    creatorName: '张三',
    plannedCompletionDate: '2025-01-10T18:00:00Z',
    actualCompletionDate: '2025-01-09T16:30:00Z',
    status: 'completed',
    progress: 100,
    source: 'meeting',
    sourceId: 'meeting-2025-01-03',
    createdAt: '2025-01-03T16:30:00Z',
    updatedAt: '2025-01-09T16:30:00Z'
  },
  {
    id: 'todo-2025-01-002',
    customerId: 'customer-1',
    projectId: 'project-1',
    title: '设置投放账户追踪代码',
    description: '在所有投放平台设置正确的转化追踪代码，确保数据准确性',
    priority: 'high',
    type: 'technical',
    assigneeId: 'user-1',
    assigneeName: '张三',
    creatorId: 'user-1',
    creatorName: '张三',
    plannedCompletionDate: '2025-01-08T17:00:00Z',
    actualCompletionDate: '2025-01-08T15:20:00Z',
    status: 'completed',
    progress: 100,
    source: 'meeting',
    sourceId: 'meeting-2025-01-03',
    createdAt: '2025-01-03T16:30:00Z',
    updatedAt: '2025-01-08T15:20:00Z'
  },
  {
    id: 'todo-2025-01-003',
    customerId: 'customer-1',
    projectId: 'project-1',
    title: '制作新的视频创意',
    description: '基于A/B测试结果，制作更多吸引人的视频创意素材',
    priority: 'medium',
    type: 'creative',
    assigneeId: 'user-2',
    assigneeName: '李四',
    creatorId: 'user-1',
    creatorName: '张三',
    plannedCompletionDate: '2025-01-15T18:00:00Z',
    actualCompletionDate: null,
    status: 'in_progress',
    progress: 75,
    source: 'meeting',
    sourceId: 'meeting-2025-01-10',
    createdAt: '2025-01-10T12:00:00Z',
    updatedAt: '2025-01-14T10:30:00Z'
  },
  {
    id: 'todo-2025-01-004',
    customerId: 'customer-1',
    projectId: 'project-1',
    title: '优化受众定位设置',
    description: '根据数据分析调整目标受众的年龄段和兴趣标签',
    priority: 'medium',
    type: 'optimization',
    assigneeId: 'user-1',
    assigneeName: '张三',
    creatorId: 'user-1',
    creatorName: '张三',
    plannedCompletionDate: '2025-01-12T17:00:00Z',
    actualCompletionDate: '2025-01-12T14:45:00Z',
    status: 'completed',
    progress: 100,
    source: 'meeting',
    sourceId: 'meeting-2025-01-10',
    createdAt: '2025-01-10T12:00:00Z',
    updatedAt: '2025-01-12T14:45:00Z'
  },
  {
    id: 'todo-2025-01-005',
    customerId: 'customer-2',
    projectId: 'project-2',
    title: '准备Samsung Galaxy投放素材',
    description: '为新项目准备各种规格的广告素材，包括图片和视频',
    priority: 'high',
    type: 'creative',
    assigneeId: 'user-4',
    assigneeName: '赵六',
    creatorId: 'user-3',
    creatorName: '王五',
    plannedCompletionDate: '2025-01-25T18:00:00Z',
    actualCompletionDate: null,
    status: 'not_started',
    progress: 0,
    source: 'meeting',
    sourceId: 'meeting-2025-01-17',
    createdAt: '2025-01-17T16:30:00Z',
    updatedAt: '2025-01-17T16:30:00Z'
  }
]

// 报告统计数据
export const reportStats = {
  totalReports: 24,
  thisMonth: 8,
  downloads: 156,
  mostUsed: '数据看板概览报告'
}

// Mock API 函数
export const mockGetReportTemplates = () => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        success: true,
        data: reportTemplates
      })
    }, 300)
  })
}

export const mockGetWeeklyReports = (filters: any = {}) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredReports = [...weeklyReports]

      if (filters.projectId) {
        filteredReports = filteredReports.filter(report => report.projectId === filters.projectId)
      }

      if (filters.customerId) {
        filteredReports = filteredReports.filter(report => report.customerId === filters.customerId)
      }

      if (filters.status) {
        filteredReports = filteredReports.filter(report => report.status === filters.status)
      }

      if (filters.year) {
        filteredReports = filteredReports.filter(report => report.reportYear === filters.year)
      }

      resolve({
        success: true,
        data: filteredReports,
        total: filteredReports.length
      })
    }, 500)
  })
}

export const mockGetMonthlyReports = (filters: any = {}) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredReports = [...monthlyReports]

      if (filters.projectId) {
        filteredReports = filteredReports.filter(report => report.projectId === filters.projectId)
      }

      if (filters.customerId) {
        filteredReports = filteredReports.filter(report => report.customerId === filters.customerId)
      }

      if (filters.status) {
        filteredReports = filteredReports.filter(report => report.status === filters.status)
      }

      resolve({
        success: true,
        data: filteredReports,
        total: filteredReports.length
      })
    }, 500)
  })
}

export const mockGetDashboardScreenshots = (filters: any = {}) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredScreenshots = [...dashboardScreenshots]

      if (filters.projectId) {
        filteredScreenshots = filteredScreenshots.filter(screenshot => screenshot.projectId === filters.projectId)
      }

      if (filters.weekNumber) {
        filteredScreenshots = filteredScreenshots.filter(screenshot => screenshot.weekNumber === filters.weekNumber)
      }

      resolve({
        success: true,
        data: filteredScreenshots
      })
    }, 300)
  })
}

export const mockGetMeetingRecords = (filters: any = {}) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredRecords = [...meetingRecords]

      if (filters.projectId) {
        filteredRecords = filteredRecords.filter(record => record.projectId === filters.projectId)
      }

      if (filters.meetingType) {
        filteredRecords = filteredRecords.filter(record => record.meetingType === filters.meetingType)
      }

      resolve({
        success: true,
        data: filteredRecords
      })
    }, 400)
  })
}

export const mockGetTodoItems = (filters: any = {}) => {
  return new Promise(resolve => {
    setTimeout(() => {
      let filteredItems = [...todoItems]

      if (filters.projectId) {
        filteredItems = filteredItems.filter(item => item.projectId === filters.projectId)
      }

      if (filters.assigneeId) {
        filteredItems = filteredItems.filter(item => item.assigneeId === filters.assigneeId)
      }

      if (filters.status) {
        filteredItems = filteredItems.filter(item => item.status === filters.status)
      }

      if (filters.priority) {
        filteredItems = filteredItems.filter(item => item.priority === filters.priority)
      }

      resolve({
        success: true,
        data: filteredItems
      })
    }, 400)
  })
}

export const mockCreateWeeklyReport = (reportData: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newReport = {
        id: `weekly-${Date.now()}`,
        ...reportData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      }

      weeklyReports.unshift(newReport)

      resolve({
        success: true,
        data: newReport
      })
    }, 600)
  })
}

export const mockCreateMonthlyReport = (reportData: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newReport = {
        id: `monthly-${Date.now()}`,
        ...reportData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      }

      monthlyReports.unshift(newReport)

      resolve({
        success: true,
        data: newReport
      })
    }, 800)
  })
}

export const mockUpdateReport = (reportId: any, updateData: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      // 查找并更新周报
      const weeklyIndex = weeklyReports.findIndex(report => report.id === reportId)
      if (weeklyIndex !== -1) {
        weeklyReports[weeklyIndex] = {
          ...weeklyReports[weeklyIndex],
          ...updateData,
          updatedAt: new Date().toISOString()
        }
        resolve({
          success: true,
          data: weeklyReports[weeklyIndex]
        })
        return
      }

      // 查找并更新月报
      const monthlyIndex = monthlyReports.findIndex(report => report.id === reportId)
      if (monthlyIndex !== -1) {
        monthlyReports[monthlyIndex] = {
          ...monthlyReports[monthlyIndex],
          ...updateData,
          updatedAt: new Date().toISOString()
        }
        resolve({
          success: true,
          data: monthlyReports[monthlyIndex]
        })
        return
      }

      resolve({
        success: false,
        message: '报告不存在'
      })
    }, 500)
  })
}

export const mockDeleteReport = (reportId: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      // 删除周报
      const weeklyIndex = weeklyReports.findIndex(report => report.id === reportId)
      if (weeklyIndex !== -1) {
        weeklyReports.splice(weeklyIndex, 1)
        resolve({
          success: true,
          message: '周报删除成功'
        })
        return
      }

      // 删除月报
      const monthlyIndex = monthlyReports.findIndex(report => report.id === reportId)
      if (monthlyIndex !== -1) {
        monthlyReports.splice(monthlyIndex, 1)
        resolve({
          success: true,
          message: '月报删除成功'
        })
        return
      }

      resolve({
        success: false,
        message: '报告不存在'
      })
    }, 400)
  })
}

export const mockCreateMeetingRecord = (recordData: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newRecord = {
        id: `meeting-${Date.now()}`,
        ...recordData,
        createdAt: new Date().toISOString(),
        status: 'draft'
      }

      meetingRecords.unshift(newRecord)

      resolve({
        success: true,
        data: newRecord
      })
    }, 500)
  })
}

export const mockCreateTodoItem = (itemData: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const newItem = {
        id: `todo-${Date.now()}`,
        ...itemData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'not_started',
        progress: 0
      }

      todoItems.unshift(newItem)

      resolve({
        success: true,
        data: newItem
      })
    }, 400)
  })
}

export const mockUpdateTodoItem = (itemId: any, updateData: any) => {
  return new Promise(resolve => {
    setTimeout(() => {
      const index = todoItems.findIndex(item => item.id === itemId)
      if (index !== -1) {
        todoItems[index] = {
          ...todoItems[index],
          ...updateData,
          updatedAt: new Date().toISOString()
        }
        resolve({
          success: true,
          data: todoItems[index]
        })
      } else {
        resolve({
          success: false,
          message: '待办事项不存在'
        })
      }
    }, 400)
  })
}

// All exports are already done above with individual export statements
