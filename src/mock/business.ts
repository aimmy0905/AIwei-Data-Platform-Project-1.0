// 添加缺失的类型定义
interface AccountBalanceData {
  totalBalance: number
  availableBalance: number
  pendingBalance: number
  currency: string
}

interface GoogleAdsOverviewData {
  totalSpend: number
  totalImpressions: number
  totalClicks: number
  averageCTR: number
  averageCPC: number
  conversions: number
  conversionRate: number
}

import type {
  BusinessRole,
  MetricCardProps,
  Quarter,
  TargetComparison,
  PlatformData,
  CustomerProfitData,
  ProfitSummaryData,
  ChurnData,
  ChurnCustomerDetail,
  SalesPersonPerformance,
  CustomerProfitDetail,
  RenewalCustomerData,
  FinancialAnalysisData,
  BudgetExecutionData,
  AccountsReceivableData,
  FinancialRiskAlert,
  TeamMetrics,
  TeamMemberPerformance,
  TeamSalesStatistics,
  PersonalPerformance,
  PersonalCustomerCategory,
  PersonalPlatformPerformance,
  PersonalCustomerDetail,
  PersonalRenewalTask,
  OperationTargetData,
  DepartmentTargetData,
  CustomerAnalysisData,
  DepartmentCustomerAnalysis,
  PlatformProjectData,
  DepartmentPlatformData,
  PlatformProfitContributionData,
  DepartmentPlatformProfitData,
  CustomerQualityData,
  DepartmentCustomerQualityData,
  CustomerContributionData,
  RenewalCustomerData as RenewalCustomer
} from '@/types'

// 业务角色数据
export const businessRoles: BusinessRole[] = [
  {
    code: 'sales_director',
    name: '销售总监',
    department: 'sales',
    level: 1,
    permissions: ['view_all_sales_data', 'view_team_performance', 'view_customer_details', 'export_reports']
  },
  {
    code: 'sales_manager',
    name: '销售经理',
    department: 'sales',
    level: 2,
    permissions: ['view_team_sales_data', 'view_team_performance', 'view_customer_details', 'export_reports']
  },
  {
    code: 'sales_person',
    name: '销售人员',
    department: 'sales',
    level: 3,
    permissions: ['view_own_sales_data', 'view_own_performance', 'view_assigned_customers']
  },
  {
    code: 'project_director',
    name: '项目总监',
    department: 'operations',
    level: 1,
    permissions: ['view_all_operation_data', 'view_all_departments', 'view_platform_analysis', 'view_customer_quality', 'export_reports']
  },
  {
    code: 'finance_director',
    name: '财务总监',
    department: 'finance',
    level: 1,
    permissions: ['view_all_financial_data', 'view_revenue_analysis', 'view_cost_analysis', 'view_profit_analysis', 'export_financial_reports']
  }
]

// 销售总监核心指标数据
export const salesDirectorMetrics: MetricCardProps[] = [
  {
    title: '总服务费完成',
    value: 2850000,
    target: 3000000,
    unit: '¥',
    trend: 'up',
    trendValue: 15.2,
    trendPeriod: '环比上季度',
    color: '#1890ff',
    icon: 'DollarSign'
  },
  {
    title: '总新单完成',
    value: 156,
    target: 180,
    unit: '单',
    trend: 'up',
    trendValue: 8.5,
    trendPeriod: '环比上季度',
    color: '#52c41a',
    icon: 'Target'
  },
  {
    title: '新签客户数',
    value: 42,
    target: 50,
    unit: '家',
    trend: 'down',
    trendValue: -2.1,
    trendPeriod: '环比上季度',
    color: '#fa8c16',
    icon: 'Users'
  },
  {
    title: '客户流失率',
    value: 8.5,
    unit: '%',
    trend: 'down',
    trendValue: -1.2,
    trendPeriod: '环比上季度',
    color: '#f5222d',
    icon: 'TrendingDown'
  }
]

// 目标完成对比数据
export const targetComparisonData: TargetComparison[] = [
  {
    targetType: 'service_fee',
    targetValue: 3000000,
    actualValue: 2850000,
    difference: -150000,
    completionRate: 95.0,
    unit: '¥'
  },
  {
    targetType: 'new_orders',
    targetValue: 180,
    actualValue: 156,
    difference: -24,
    completionRate: 86.7,
    unit: '单'
  }
]

// 平台分布数据
export const platformDistributionData: PlatformData[] = [
  {
    platform: 'Google',
    serviceFee: 1200000,
    orderCount: 68,
    percentage: 42.1,
    color: '#4285f4'
  },
  {
    platform: 'Meta',
    serviceFee: 850000,
    orderCount: 45,
    percentage: 29.8,
    color: '#1877f2'
  },
  {
    platform: 'Criteo',
    serviceFee: 450000,
    orderCount: 28,
    percentage: 15.8,
    color: '#ff6900'
  },
  {
    platform: 'Bing',
    serviceFee: 350000,
    orderCount: 15,
    percentage: 12.3,
    color: '#00bcf2'
  }
]

// 客户毛利数据
export const customerProfitData: CustomerProfitData = {
  quarter: '2025年Q1',
  platforms: {
    google: {
      orderCount: 68,
      serviceFee: 1200000,
      consumption: 8500000,
      rebate: 425000,
      profit: 1625000
    },
    meta: {
      orderCount: 45,
      serviceFee: 850000,
      consumption: 6200000,
      rebate: 310000,
      profit: 1160000
    },
    criteo: {
      orderCount: 28,
      serviceFee: 450000,
      consumption: 3800000,
      rebate: 190000,
      profit: 640000
    },
    bing: {
      orderCount: 15,
      serviceFee: 350000,
      consumption: 2100000,
      rebate: 105000,
      profit: 455000
    },
    total: {
      orderCount: 156,
      serviceFee: 2850000,
      consumption: 20600000,
      rebate: 1030000,
      profit: 3880000
    }
  }
}

// 毛利汇总数据
export const profitSummaryData: ProfitSummaryData = {
  totalProfit: 3880000,
  totalServiceFee: 2850000,
  totalRebate: 1030000,
  totalConsumption: 20600000,
  profitMargin: 18.8,
  quarterTarget: 4200000,
  completionRate: 92.4,
  yearOverYearGrowth: 12.5
}

// 流失客户数据
export const churnData: ChurnData[] = [
  {
    category: 'total',
    customerCount: 8,
    estimatedProfitLoss: 450000,
    estimatedServiceFeeLoss: 180000,
    estimatedRebateLoss: 90000,
    quarter: '2025年Q1',
    churnRate: 8.5,
    avgCustomerValue: 56250,
    riskLevel: 'medium'
  },
  {
    category: 'new_customer',
    customerCount: 3,
    estimatedProfitLoss: 120000,
    estimatedServiceFeeLoss: 60000,
    estimatedRebateLoss: 30000,
    quarter: '2025年Q1',
    churnRate: 7.1,
    avgCustomerValue: 40000,
    riskLevel: 'low'
  },
  {
    category: 'old_customer',
    customerCount: 5,
    estimatedProfitLoss: 330000,
    estimatedServiceFeeLoss: 120000,
    estimatedRebateLoss: 60000,
    quarter: '2025年Q1',
    churnRate: 9.8,
    avgCustomerValue: 66000,
    riskLevel: 'high'
  }
]

// 流失客户详情
export const churnCustomerDetails: ChurnCustomerDetail[] = [
  {
    id: 1,
    customerName: '科技创新有限公司',
    lastActiveDate: '2024-12-15',
    churnDate: '2025-01-20',
    churnReason: '预算削减',
    lastQuarterProfit: 85000,
    estimatedLoss: 85000,
    riskLevel: 'high',
    platform: 'Google',
    salesPerson: '张三'
  },
  {
    id: 2,
    customerName: '智能设备制造商',
    lastActiveDate: '2024-11-28',
    churnDate: '2025-02-05',
    churnReason: '转向其他服务商',
    lastQuarterProfit: 62000,
    estimatedLoss: 62000,
    riskLevel: 'medium',
    platform: 'Meta',
    salesPerson: '李四'
  }
]

// 销售人员表现数据
export const salesPersonPerformance: SalesPersonPerformance[] = [
  {
    id: 1,
    name: '张三',
    department: '销售一部',
    totalServiceFee: 680000,
    totalProfit: 920000,
    targetCompletion: 95.5,
    customerCount: 28,
    newCustomerCount: 8,
    churnCustomerCount: 2,
    rank: 1,
    lastMonthGrowth: 12.8
  },
  {
    id: 2,
    name: '李四',
    department: '销售二部',
    totalServiceFee: 520000,
    totalProfit: 710000,
    targetCompletion: 88.2,
    customerCount: 22,
    newCustomerCount: 6,
    churnCustomerCount: 1,
    rank: 2,
    lastMonthGrowth: 8.5
  },
  {
    id: 3,
    name: '王五',
    department: '销售一部',
    totalServiceFee: 480000,
    totalProfit: 650000,
    targetCompletion: 82.1,
    customerCount: 20,
    newCustomerCount: 5,
    churnCustomerCount: 3,
    rank: 3,
    lastMonthGrowth: -2.1
  }
]

// 客户毛利明细
export const customerProfitDetails: CustomerProfitDetail[] = [
  {
    id: 1,
    customerName: '全球电商巨头',
    industry: '电子商务',
    salesPerson: '张三',
    cooperationStartDate: '2023-03-15',
    totalProfit: 285000,
    totalServiceFee: 180000,
    totalConsumption: 1200000,
    totalRebate: 105000,
    profitMargin: 23.8,
    platformDistribution: [
      { platform: 'Google', serviceFee: 120000, orderCount: 8, percentage: 66.7, color: '#4285f4' },
      { platform: 'Meta', serviceFee: 60000, orderCount: 4, percentage: 33.3, color: '#1877f2' }
    ],
    quarterlyTrend: [180000, 220000, 285000],
    status: 'active',
    grade: 'A'
  },
  {
    id: 2,
    customerName: '新兴科技公司',
    industry: '人工智能',
    salesPerson: '李四',
    cooperationStartDate: '2024-01-20',
    totalProfit: 156000,
    totalServiceFee: 95000,
    totalConsumption: 680000,
    totalRebate: 61000,
    profitMargin: 22.9,
    platformDistribution: [
      { platform: 'Google', serviceFee: 55000, orderCount: 6, percentage: 57.9, color: '#4285f4' },
      { platform: 'Criteo', serviceFee: 40000, orderCount: 3, percentage: 42.1, color: '#ff6900' }
    ],
    quarterlyTrend: [85000, 120000, 156000],
    status: 'active',
    grade: 'B'
  }
]

// 续费客户数据
export const renewalCustomerData: RenewalCustomerData[] = [
  {
    id: 1,
    customerName: '全球电商巨头',
    contractEndDate: '2025-03-31',
    renewalStatus: 'negotiating',
    lastYearRevenue: 1200000,
    estimatedRenewalValue: 1500000,
    renewalProbability: 85,
    salesPerson: '张三',
    lastContactDate: '2025-01-15',
    nextFollowUpDate: '2025-01-25',
    priority: 'high',
    notes: '客户满意度高，有扩大合作意向'
  },
  {
    id: 2,
    customerName: '传统制造企业',
    contractEndDate: '2025-04-15',
    renewalStatus: 'contacted',
    lastYearRevenue: 800000,
    estimatedRenewalValue: 900000,
    renewalProbability: 70,
    salesPerson: '李四',
    lastContactDate: '2025-01-10',
    nextFollowUpDate: '2025-01-28',
    priority: 'medium',
    notes: '需要详细介绍新产品功能'
  }
]

// 财务分析数据
export const financialAnalysisData: FinancialAnalysisData = {
  revenue: {
    total: 28500000,
    quarterlyGrowth: 12.5,
    yearlyGrowth: 25.8,
    byDepartment: [
      { department: '销售部门', amount: 18500000, percentage: 64.9 },
      { department: '运营部门', amount: 8200000, percentage: 28.8 },
      { department: '其他', amount: 1800000, percentage: 6.3 }
    ],
    byPlatform: [
      { platform: 'Google', amount: 12000000, percentage: 42.1 },
      { platform: 'Meta', amount: 8500000, percentage: 29.8 },
      { platform: 'Criteo', amount: 4500000, percentage: 15.8 },
      { platform: 'Bing', amount: 3500000, percentage: 12.3 }
    ]
  },
  costs: {
    total: 18600000,
    operatingCosts: 12500000,
    marketingCosts: 3800000,
    personalCosts: 2300000,
    quarterlyGrowth: 8.2
  },
  profit: {
    gross: 9900000,
    net: 8200000,
    margin: 28.8,
    quarterlyGrowth: 18.5
  },
  cashFlow: {
    operating: 7500000,
    investing: -2800000,
    financing: 1200000,
    netCashFlow: 5900000
  },
  ratios: {
    currentRatio: 2.5,
    quickRatio: 1.8,
    debtToEquity: 0.4,
    returnOnAssets: 15.2,
    returnOnEquity: 22.8
  }
}

// 预算执行数据
export const budgetExecutionData: BudgetExecutionData[] = [
  {
    department: '销售部门',
    budgetAmount: 5000000,
    actualAmount: 4650000,
    variance: -350000,
    variancePercentage: -7.0,
    executionRate: 93.0,
    remainingBudget: 350000,
    projectedSpend: 4850000
  },
  {
    department: '运营部门',
    budgetAmount: 3500000,
    actualAmount: 3720000,
    variance: 220000,
    variancePercentage: 6.3,
    executionRate: 106.3,
    remainingBudget: -220000,
    projectedSpend: 3800000
  },
  {
    department: '技术部门',
    budgetAmount: 2800000,
    actualAmount: 2650000,
    variance: -150000,
    variancePercentage: -5.4,
    executionRate: 94.6,
    remainingBudget: 150000,
    projectedSpend: 2750000
  }
]

// 应收账款数据
export const accountsReceivableData: AccountsReceivableData[] = [
  {
    customerName: '全球电商巨头',
    invoiceAmount: 450000,
    paidAmount: 400000,
    outstandingAmount: 50000,
    daysOutstanding: 15,
    riskLevel: 'low',
    invoiceDate: '2024-12-15',
    dueDate: '2025-01-15',
    status: 'current'
  },
  {
    customerName: '科技创新公司',
    invoiceAmount: 280000,
    paidAmount: 0,
    outstandingAmount: 280000,
    daysOutstanding: 45,
    riskLevel: 'high',
    invoiceDate: '2024-11-20',
    dueDate: '2024-12-20',
    status: 'overdue'
  }
]

// 财务风险预警
export const financialRiskAlerts: FinancialRiskAlert[] = [
  {
    id: 1,
    type: 'cash_flow',
    level: 'medium',
    title: '现金流预警',
    description: '预计下月现金流可能紧张',
    currentValue: 1200000,
    thresholdValue: 2000000,
    recommendation: '建议加快应收账款回收',
    createdAt: '2025-01-20',
    status: 'active'
  },
  {
    id: 2,
    type: 'receivables',
    level: 'high',
    title: '应收账款逾期',
    description: '超过30天的应收账款金额较高',
    currentValue: 850000,
    thresholdValue: 500000,
    recommendation: '需要加强催收工作',
    createdAt: '2025-01-18',
    status: 'active'
  }
]

// ============ 销售经理看板模拟数据 ============

// 团队指标数据
export const teamMetrics: TeamMetrics = {
  teamId: 'team_001',
  teamName: '华东销售团队',
  memberCount: 8,
  totalServiceFee: 1850000,
  totalNewOrders: 95,
  totalCustomers: 185,
  averageCompletionRate: 87.5,
  teamRanking: 2,
  topPerformer: {
    employeeId: 'emp_001',
    employeeName: '张明',
    completionRate: 125.8
  }
}

// 团队成员绩效数据
export const teamMemberPerformance: TeamMemberPerformance[] = [
  {
    employeeId: 'emp_001',
    employeeName: '张明',
    serviceFeeTarget: 300000,
    serviceFeeActual: 377400,
    newOrdersTarget: 15,
    newOrdersActual: 19,
    serviceFeeCompletionRate: 125.8,
    newOrdersCompletionRate: 126.7,
    overallCompletionRate: 126.25,
    performanceLevel: 'excellent',
    monthlyTrend: {
      currentMonth: 126.25,
      lastMonth: 118.5,
      trendDirection: 'up'
    },
    customerCount: 28,
    avgCustomerValue: 13478
  },
  {
    employeeId: 'emp_002',
    employeeName: '李红',
    serviceFeeTarget: 280000,
    serviceFeeActual: 295200,
    newOrdersTarget: 14,
    newOrdersActual: 15,
    serviceFeeCompletionRate: 105.4,
    newOrdersCompletionRate: 107.1,
    overallCompletionRate: 106.25,
    performanceLevel: 'good',
    monthlyTrend: {
      currentMonth: 106.25,
      lastMonth: 102.8,
      trendDirection: 'up'
    },
    customerCount: 25,
    avgCustomerValue: 11808
  },
  {
    employeeId: 'emp_003',
    employeeName: '王强',
    serviceFeeTarget: 290000,
    serviceFeeActual: 261000,
    newOrdersTarget: 15,
    newOrdersActual: 13,
    serviceFeeCompletionRate: 90.0,
    newOrdersCompletionRate: 86.7,
    overallCompletionRate: 88.35,
    performanceLevel: 'good',
    monthlyTrend: {
      currentMonth: 88.35,
      lastMonth: 92.1,
      trendDirection: 'down'
    },
    customerCount: 22,
    avgCustomerValue: 11864
  },
  {
    employeeId: 'emp_004',
    employeeName: '陈燕',
    serviceFeeTarget: 260000,
    serviceFeeActual: 187200,
    newOrdersTarget: 13,
    newOrdersActual: 9,
    serviceFeeCompletionRate: 72.0,
    newOrdersCompletionRate: 69.2,
    overallCompletionRate: 70.6,
    performanceLevel: 'needImprovement',
    monthlyTrend: {
      currentMonth: 70.6,
      lastMonth: 75.2,
      trendDirection: 'down'
    },
    customerCount: 18,
    avgCustomerValue: 10400
  },
  {
    employeeId: 'emp_005',
    employeeName: '刘涛',
    serviceFeeTarget: 275000,
    serviceFeeActual: 291500,
    newOrdersTarget: 14,
    newOrdersActual: 15,
    serviceFeeCompletionRate: 106.0,
    newOrdersCompletionRate: 107.1,
    overallCompletionRate: 106.55,
    performanceLevel: 'good',
    monthlyTrend: {
      currentMonth: 106.55,
      lastMonth: 104.2,
      trendDirection: 'up'
    },
    customerCount: 26,
    avgCustomerValue: 11211
  },
  {
    employeeId: 'emp_006',
    employeeName: '赵敏',
    serviceFeeTarget: 240000,
    serviceFeeActual: 312000,
    newOrdersTarget: 12,
    newOrdersActual: 16,
    serviceFeeCompletionRate: 130.0,
    newOrdersCompletionRate: 133.3,
    overallCompletionRate: 131.65,
    performanceLevel: 'excellent',
    monthlyTrend: {
      currentMonth: 131.65,
      lastMonth: 128.9,
      trendDirection: 'up'
    },
    customerCount: 24,
    avgCustomerValue: 13000
  },
  {
    employeeId: 'emp_007',
    employeeName: '孙华',
    serviceFeeTarget: 220000,
    serviceFeeActual: 176000,
    newOrdersTarget: 11,
    newOrdersActual: 8,
    serviceFeeCompletionRate: 80.0,
    newOrdersCompletionRate: 72.7,
    overallCompletionRate: 76.35,
    performanceLevel: 'needImprovement',
    monthlyTrend: {
      currentMonth: 76.35,
      lastMonth: 78.5,
      trendDirection: 'down'
    },
    customerCount: 20,
    avgCustomerValue: 8800
  },
  {
    employeeId: 'emp_008',
    employeeName: '钱飞',
    serviceFeeTarget: 255000,
    serviceFeeActual: 229500,
    newOrdersTarget: 13,
    newOrdersActual: 11,
    serviceFeeCompletionRate: 90.0,
    newOrdersCompletionRate: 84.6,
    overallCompletionRate: 87.3,
    performanceLevel: 'good',
    monthlyTrend: {
      currentMonth: 87.3,
      lastMonth: 89.1,
      trendDirection: 'down'
    },
    customerCount: 22,
    avgCustomerValue: 10432
  }
]

// 团队销售统计数据
export const teamSalesStatistics: TeamSalesStatistics = {
  teamCompletionRate: 87.5,
  teamRanking: 2,
  totalTeams: 5,
  memberDistribution: {
    excellent: 2,      // >120% (张明、赵敏)
    good: 4,          // 80-120% (李红、王强、刘涛、钱飞)
    needImprovement: 2 // <80% (陈燕、孙华)
  },
  monthlyTrend: {
    currentMonth: 87.5,
    lastMonth: 84.2,
    trendDirection: 'up'
  }
}

// 销售经理看板核心指标
export const salesManagerMetrics: MetricCardProps[] = [
  {
    title: '团队服务费完成',
    value: 1850000,
    target: 2112000,
    unit: '¥',
    trend: 'up',
    trendValue: 12.8,
    trendPeriod: '环比上月',
    color: '#1890ff',
    icon: 'DollarSign'
  },
  {
    title: '团队新单完成',
    value: 95,
    target: 112,
    unit: '单',
    trend: 'up',
    trendValue: 6.7,
    trendPeriod: '环比上月',
    color: '#52c41a',
    icon: 'Target'
  },
  {
    title: '团队客户数',
    value: 185,
    unit: '家',
    trend: 'up',
    trendValue: 4.2,
    trendPeriod: '环比上月',
    color: '#fa8c16',
    icon: 'Users'
  },
  {
    title: '团队平均完成率',
    value: 87.5,
    unit: '%',
    trend: 'up',
    trendValue: 3.3,
    trendPeriod: '环比上月',
    color: '#722ed1',
    icon: 'TrendingUp'
  }
]

// 团队平台分布数据
export const teamPlatformDistribution: PlatformData[] = [
  {
    platform: 'Google',
    serviceFee: 720000,
    orderCount: 38,
    percentage: 38.9,
    color: '#4285f4'
  },
  {
    platform: 'Meta',
    serviceFee: 580000,
    orderCount: 31,
    percentage: 31.4,
    color: '#1877f2'
  },
  {
    platform: 'Criteo',
    serviceFee: 320000,
    orderCount: 18,
    percentage: 17.3,
    color: '#ff6900'
  },
  {
    platform: 'Bing',
    serviceFee: 180000,
    orderCount: 8,
    percentage: 9.7,
    color: '#00c4cc'
  },
  {
    platform: '其他',
    serviceFee: 50000,
    orderCount: 5,
    percentage: 2.7,
    color: '#8c8c8c'
  }
]

// 简化的客户毛利详情数据
export const teamCustomerProfitDetails: CustomerProfitDetail[] = [
  {
    id: 1,
    customerName: '华为技术有限公司',
    industry: '科技',
    salesPerson: '张明',
    cooperationStartDate: '2023-03-15',
    totalProfit: 180000,
    totalServiceFee: 150000,
    totalConsumption: 120000,
    totalRebate: 30000,
    profitMargin: 25.0,
    platformDistribution: [],
    quarterlyTrend: [],
    status: 'active',
    grade: 'A'
  },
  {
    id: 2,
    customerName: '阿里巴巴集团',
    industry: '电商',
    salesPerson: '李红',
    cooperationStartDate: '2023-05-20',
    totalProfit: 220000,
    totalServiceFee: 200000,
    totalConsumption: 180000,
    totalRebate: 20000,
    profitMargin: 22.2,
    platformDistribution: [],
    quarterlyTrend: [],
    status: 'active',
    grade: 'A'
  },
  {
    id: 3,
    customerName: '腾讯科技',
    industry: '互联网',
    salesPerson: '王强',
    cooperationStartDate: '2023-01-10',
    totalProfit: 150000,
    totalServiceFee: 140000,
    totalConsumption: 130000,
    totalRebate: 10000,
    profitMargin: 15.4,
    platformDistribution: [],
    quarterlyTrend: [],
    status: 'at_risk',
    grade: 'B'
  }
]

// 简化的续费客户数据
export const teamRenewalCustomers: RenewalCustomerData[] = [
  {
    id: 1,
    customerName: '字节跳动',
    contractEndDate: '2025-02-15',
    renewalStatus: 'negotiating',
    lastYearRevenue: 280000,
    estimatedRenewalValue: 320000,
    renewalProbability: 85,
    salesPerson: '张明',
    lastContactDate: '2025-01-18',
    nextFollowUpDate: '2025-01-25',
    priority: 'high',
    notes: '客户满意度较高，续费意向强烈'
  },
  {
    id: 2,
    customerName: '小米集团',
    contractEndDate: '2025-03-01',
    renewalStatus: 'contacted',
    lastYearRevenue: 180000,
    estimatedRenewalValue: 200000,
    renewalProbability: 70,
    salesPerson: '李红',
    lastContactDate: '2025-01-15',
    nextFollowUpDate: '2025-01-22',
    priority: 'medium',
    notes: '需要进一步商谈价格和服务内容'
  },
  {
    id: 3,
    customerName: '美团',
    contractEndDate: '2025-01-30',
    renewalStatus: 'pending',
    lastYearRevenue: 150000,
    estimatedRenewalValue: 160000,
    renewalProbability: 60,
    salesPerson: '王强',
    lastContactDate: '2025-01-10',
    nextFollowUpDate: '2025-01-20',
    priority: 'high',
    notes: '合同即将到期，需要紧急跟进'
  }
]

// ============ 销售人员看板模拟数据 ============

// 个人绩效数据
export const personalPerformance: PersonalPerformance = {
  employeeId: 'emp_001',
  employeeName: '张明',
  serviceFeeTarget: 300000,
  serviceFeeActual: 377400,
  newOrdersTarget: 15,
  newOrdersActual: 19,
  serviceFeeCompletionRate: 125.8,
  newOrdersCompletionRate: 126.7,
  overallCompletionRate: 126.25,
  teamRanking: 1,
  totalTeamMembers: 8,
  assignedCustomerCount: 28,
  monthlyTrend: {
    currentMonth: 126.25,
    lastMonth: 118.5,
    trendDirection: 'up'
  }
}

// 个人客户分类数据
export const personalCustomerCategories: PersonalCustomerCategory[] = [
  {
    categoryType: 'key',
    customerCount: 8,
    totalServiceFee: 180000,
    totalProfit: 54000,
    averageProfitMargin: 30.0
  },
  {
    categoryType: 'growth',
    customerCount: 12,
    totalServiceFee: 120000,
    totalProfit: 24000,
    averageProfitMargin: 20.0
  },
  {
    categoryType: 'maintenance',
    customerCount: 6,
    totalServiceFee: 60000,
    totalProfit: 9000,
    averageProfitMargin: 15.0
  },
  {
    categoryType: 'risk',
    customerCount: 2,
    totalServiceFee: 17400,
    totalProfit: 1740,
    averageProfitMargin: 10.0
  }
]

// 个人平台绩效数据
export const personalPlatformPerformance: PersonalPlatformPerformance[] = [
  {
    platform: 'Google',
    serviceFee: 150000,
    orderCount: 8,
    customerCount: 12,
    averageOrderValue: 18750,
    profitMargin: 32.5,
    performanceLevel: 'excellent',
    color: '#4285f4'
  },
  {
    platform: 'Meta',
    serviceFee: 120000,
    orderCount: 6,
    customerCount: 10,
    averageOrderValue: 20000,
    profitMargin: 28.0,
    performanceLevel: 'good',
    color: '#1877f2'
  },
  {
    platform: 'Criteo',
    serviceFee: 80000,
    orderCount: 4,
    customerCount: 4,
    averageOrderValue: 20000,
    profitMargin: 22.5,
    performanceLevel: 'good',
    color: '#ff6900'
  },
  {
    platform: 'Bing',
    serviceFee: 27400,
    orderCount: 1,
    customerCount: 2,
    averageOrderValue: 27400,
    profitMargin: 15.0,
    performanceLevel: 'needImprovement',
    color: '#00c4cc'
  }
]

// 个人客户详情数据
export const personalCustomerDetails: PersonalCustomerDetail[] = [
  {
    id: 1,
    customerName: '华为技术有限公司',
    industry: '科技',
    cooperationStartDate: '2023-03-15',
    category: 'key',
    totalProfit: 25000,
    totalServiceFee: 80000,
    profitMargin: 31.25,
    lastContactDate: '2025-01-15',
    nextFollowUpDate: '2025-01-22',
    communicationFrequency: 'high',
    satisfactionScore: 9.2,
    churnRisk: 'low',
    platforms: ['Google', 'Meta'],
    notes: '重要客户，合作顺利，有扩大合作意向'
  },
  {
    id: 2,
    customerName: '小米集团',
    industry: '消费电子',
    cooperationStartDate: '2023-06-20',
    category: 'growth',
    totalProfit: 18000,
    totalServiceFee: 60000,
    profitMargin: 30.0,
    lastContactDate: '2025-01-10',
    nextFollowUpDate: '2025-01-25',
    communicationFrequency: 'medium',
    satisfactionScore: 8.5,
    churnRisk: 'low',
    platforms: ['Google', 'Criteo'],
    notes: '成长客户，业务发展迅速'
  },
  {
    id: 3,
    customerName: '美团',
    industry: '电商',
    cooperationStartDate: '2023-01-10',
    category: 'risk',
    totalProfit: 5000,
    totalServiceFee: 25000,
    profitMargin: 20.0,
    lastContactDate: '2024-12-20',
    nextFollowUpDate: '2025-01-18',
    communicationFrequency: 'low',
    satisfactionScore: 6.5,
    churnRisk: 'high',
    platforms: ['Meta'],
    notes: '需要紧急关注，近期沟通较少'
  }
]

// 个人续费任务数据
export const personalRenewalTasks: PersonalRenewalTask[] = [
  {
    id: 1,
    customerName: '华为技术有限公司',
    contractEndDate: '2025-03-15',
    renewalStatus: 'negotiating',
    taskType: 'meeting',
    priority: 'high',
    lastYearRevenue: 80000,
    estimatedRenewalValue: 100000,
    renewalProbability: 90,
    lastContactDate: '2025-01-15',
    nextFollowUpDate: '2025-01-22',
    daysUntilExpiry: 53,
    notes: '客户满意度高，续费意向强烈',
    reminderSet: true
  },
  {
    id: 2,
    customerName: '小米集团',
    contractEndDate: '2025-06-20',
    renewalStatus: 'contacted',
    taskType: 'proposal',
    priority: 'medium',
    lastYearRevenue: 60000,
    estimatedRenewalValue: 75000,
    renewalProbability: 75,
    lastContactDate: '2025-01-10',
    nextFollowUpDate: '2025-01-25',
    daysUntilExpiry: 150,
    notes: '需要准备新的合作方案',
    reminderSet: true
  }
]

// ============ 项目总监看板模拟数据 ============

// 运营目标数据
export const operationTargets: OperationTargetData[] = [
  {
    quarter: '2025-Q1',
    targets: {
      totalProfitTarget: 50000000, // 5000万
      serviceFeeTarget: 30000000,  // 3000万
      rebateTarget: 20000000       // 2000万
    },
    achievements: {
      totalProfitActual: 45000000,
      totalProfitGap: -5000000,
      totalProfitRate: 90.0,
      serviceFeeActual: 28000000,
      serviceFeeGap: -2000000,
      serviceFeeRate: 93.3,
      rebateActual: 17000000,
      rebateGap: -3000000,
      rebateRate: 85.0
    }
  },
  {
    quarter: '2025-Q2',
    targets: {
      totalProfitTarget: 55000000,
      serviceFeeTarget: 32000000,
      rebateTarget: 23000000
    },
    achievements: {
      totalProfitActual: 52000000,
      totalProfitGap: -3000000,
      totalProfitRate: 94.5,
      serviceFeeActual: 31000000,
      serviceFeeGap: -1000000,
      serviceFeeRate: 96.9,
      rebateActual: 21000000,
      rebateGap: -2000000,
      rebateRate: 91.3
    }
  }
]

// 部门目标数据
export const departmentTargets: DepartmentTargetData[] = [
  {
    departmentId: 'DEPT_001',
    departmentName: '华东销售部',
    targets: {
      totalProfitTarget: 15000000,
      serviceFeeTarget: 9000000,
      rebateTarget: 6000000,
      targetPercentage: 30.0
    },
    achievements: {
      totalProfitActual: 14200000,
      totalProfitGap: -800000,
      totalProfitRate: 94.7,
      serviceFeeActual: 8600000,
      serviceFeeGap: -400000,
      serviceFeeRate: 95.6,
      rebateActual: 5600000,
      rebateGap: -400000,
      rebateRate: 93.3,
      completionPercentage: 31.6
    }
  },
  {
    departmentId: 'DEPT_002',
    departmentName: '华南销售部',
    targets: {
      totalProfitTarget: 12000000,
      serviceFeeTarget: 7200000,
      rebateTarget: 4800000,
      targetPercentage: 24.0
    },
    achievements: {
      totalProfitActual: 11800000,
      totalProfitGap: -200000,
      totalProfitRate: 98.3,
      serviceFeeActual: 7100000,
      serviceFeeGap: -100000,
      serviceFeeRate: 98.6,
      rebateActual: 4700000,
      rebateGap: -100000,
      rebateRate: 97.9,
      completionPercentage: 26.2
    }
  },
  {
    departmentId: 'DEPT_003',
    departmentName: '华北销售部',
    targets: {
      totalProfitTarget: 18000000,
      serviceFeeTarget: 10800000,
      rebateTarget: 7200000,
      targetPercentage: 36.0
    },
    achievements: {
      totalProfitActual: 16500000,
      totalProfitGap: -1500000,
      totalProfitRate: 91.7,
      serviceFeeActual: 10200000,
      serviceFeeGap: -600000,
      serviceFeeRate: 94.4,
      rebateActual: 6300000,
      rebateGap: -900000,
      rebateRate: 87.5,
      completionPercentage: 36.7
    }
  }
]

// 客户分析数据（总计）
export const customerAnalysisTotal: CustomerAnalysisData = {
  quarter: '2025-Q1',
  allCustomers: {
    activeCustomerCount: 320,
    totalProfit: 45000000,
    serviceFee: 28000000,
    rebate: 17000000
  },
  oldCustomers: {
    activeCustomerCount: 240,
    totalProfit: 32000000,
    serviceFee: 20000000,
    rebate: 12000000
  },
  newCustomers: {
    activeCustomerCount: 80,
    totalProfit: 13000000,
    serviceFee: 8000000,
    rebate: 5000000
  },
  churnedCustomers: {
    customerCount: 25,
    estimatedProfitLoss: 3200000,
    estimatedServiceFeeLoss: 2000000,
    estimatedRebateLoss: 1200000
  }
}

// 部门客户分析数据
export const departmentCustomerAnalysis: DepartmentCustomerAnalysis[] = [
  {
    departmentId: 'DEPT_001',
    departmentName: '华东销售部',
    customerData: {
      quarter: '2025-Q1',
      allCustomers: {
        activeCustomerCount: 95,
        totalProfit: 14200000,
        serviceFee: 8600000,
        rebate: 5600000
      },
      oldCustomers: {
        activeCustomerCount: 72,
        totalProfit: 10100000,
        serviceFee: 6200000,
        rebate: 3900000
      },
      newCustomers: {
        activeCustomerCount: 23,
        totalProfit: 4100000,
        serviceFee: 2400000,
        rebate: 1700000
      },
      churnedCustomers: {
        customerCount: 8,
        estimatedProfitLoss: 1100000,
        estimatedServiceFeeLoss: 650000,
        estimatedRebateLoss: 450000
      }
    },
    departmentRanking: {
      profitRanking: 2,
      customerCountRanking: 1,
      growthRanking: 2
    }
  },
  {
    departmentId: 'DEPT_002',
    departmentName: '华南销售部',
    customerData: {
      quarter: '2025-Q1',
      allCustomers: {
        activeCustomerCount: 78,
        totalProfit: 11800000,
        serviceFee: 7100000,
        rebate: 4700000
      },
      oldCustomers: {
        activeCustomerCount: 58,
        totalProfit: 8400000,
        serviceFee: 5100000,
        rebate: 3300000
      },
      newCustomers: {
        activeCustomerCount: 20,
        totalProfit: 3400000,
        serviceFee: 2000000,
        rebate: 1400000
      },
      churnedCustomers: {
        customerCount: 5,
        estimatedProfitLoss: 680000,
        estimatedServiceFeeLoss: 410000,
        estimatedRebateLoss: 270000
      }
    },
    departmentRanking: {
      profitRanking: 1,
      customerCountRanking: 3,
      growthRanking: 1
    }
  }
]

// 平台项目数据（总计）
export const platformProjectsTotal: PlatformProjectData = {
  quarter: '2025-Q1',
  overview: {
    totalProjects: 1250,
    totalRebate: 17000000,
    totalServiceFee: 28000000,
    totalProfit: 45000000
  },
  platformData: {
    allPlatformProjects: {
      google: 620,
      meta: 380,
      criteo: 150,
      bing: 100,
      total: 1250
    },
    newCustomerProjects: {
      google: 180,
      meta: 120,
      criteo: 45,
      bing: 25,
      total: 370
    },
    churnedCustomerProjects: {
      google: 35,
      meta: 20,
      criteo: 8,
      bing: 5,
      total: 68
    }
  }
}

// 部门平台项目数据
export const departmentPlatformProjects: DepartmentPlatformData[] = [
  {
    departmentId: 'DEPT_001',
    departmentName: '华东销售部',
    platformProjectData: {
      quarter: '2025-Q1',
      overview: {
        totalProjects: 380,
        totalRebate: 5600000,
        totalServiceFee: 8600000,
        totalProfit: 14200000
      },
      platformData: {
        allPlatformProjects: {
          google: 195,
          meta: 115,
          criteo: 45,
          bing: 25,
          total: 380
        },
        newCustomerProjects: {
          google: 55,
          meta: 35,
          criteo: 15,
          bing: 8,
          total: 113
        },
        churnedCustomerProjects: {
          google: 12,
          meta: 8,
          criteo: 3,
          bing: 2,
          total: 25
        }
      }
    },
    departmentPerformance: {
      projectGrowthRate: 15.2,
      profitGrowthRate: 12.8,
      churnRate: 6.6,
      newCustomerRate: 29.7
    }
  }
]

// 平台毛利贡献数据（总计）
export const platformProfitContributionTotal: PlatformProfitContributionData = {
  quarter: '2025-Q1',
  allCustomers: {
    projectCount: 1250,
    totalProfit: 45000000,
    serviceFee: 28000000,
    rebate: 17000000
  },
  platformDetails: {
    google: {
      projectCount: 620,
      totalProfit: 22500000,
      serviceFee: 14000000,
      rebate: 8500000,
      profitMargin: 28.5,
      growthRate: 12.3
    },
    meta: {
      projectCount: 380,
      totalProfit: 13500000,
      serviceFee: 8400000,
      rebate: 5100000,
      profitMargin: 24.8,
      growthRate: 8.7
    },
    criteo: {
      projectCount: 150,
      totalProfit: 6000000,
      serviceFee: 3600000,
      rebate: 2400000,
      profitMargin: 22.1,
      growthRate: 15.2
    },
    bing: {
      projectCount: 100,
      totalProfit: 3000000,
      serviceFee: 2000000,
      rebate: 1000000,
      profitMargin: 18.5,
      growthRate: 6.8
    }
  },
  platformDistribution: {
    customerCountDistribution: {
      google: 49.6,
      meta: 30.4,
      criteo: 12.0,
      bing: 8.0
    },
    profitDistribution: {
      google: 50.0,
      meta: 30.0,
      criteo: 13.3,
      bing: 6.7
    },
    serviceFeeDistribution: {
      google: 50.0,
      meta: 30.0,
      criteo: 12.9,
      bing: 7.1
    },
    rebateDistribution: {
      google: 50.0,
      meta: 30.0,
      criteo: 14.1,
      bing: 5.9
    }
  }
}

// 部门平台毛利贡献数据
export const departmentPlatformProfitContribution: DepartmentPlatformProfitData[] = [
  {
    departmentId: 'DEPT_001',
    departmentName: '华东销售部',
    profitContributionData: {
      quarter: '2025-Q1',
      allCustomers: {
        projectCount: 380,
        totalProfit: 14200000,
        serviceFee: 8600000,
        rebate: 5600000
      },
      platformDetails: {
        google: {
          projectCount: 195,
          totalProfit: 7100000,
          serviceFee: 4300000,
          rebate: 2800000,
          profitMargin: 28.2,
          growthRate: 13.5
        },
        meta: {
          projectCount: 115,
          totalProfit: 4260000,
          serviceFee: 2580000,
          rebate: 1680000,
          profitMargin: 24.5,
          growthRate: 9.2
        },
        criteo: {
          projectCount: 45,
          totalProfit: 1890000,
          serviceFee: 1134000,
          rebate: 756000,
          profitMargin: 22.8,
          growthRate: 16.8
        },
        bing: {
          projectCount: 25,
          totalProfit: 950000,
          serviceFee: 570000,
          rebate: 380000,
          profitMargin: 19.2,
          growthRate: 7.5
        }
      },
      platformDistribution: {
        customerCountDistribution: {
          google: 51.3,
          meta: 30.3,
          criteo: 11.8,
          bing: 6.6
        },
        profitDistribution: {
          google: 50.0,
          meta: 30.0,
          criteo: 13.3,
          bing: 6.7
        },
        serviceFeeDistribution: {
          google: 50.0,
          meta: 30.0,
          criteo: 13.2,
          bing: 6.6
        },
        rebateDistribution: {
          google: 50.0,
          meta: 30.0,
          criteo: 13.5,
          bing: 6.8
        }
      }
    },
    departmentRanking: {
      totalProfitRanking: 2,
      googleProfitRanking: 2,
      metaProfitRanking: 1,
      criteoProfitRanking: 3,
      bingProfitRanking: 2
    }
  }
]

// 客户质量评估数据（总计）
export const customerQualityTotal: CustomerQualityData = {
  quarter: '2025-Q1',
  customerSegments: {
    highValue: {
      segmentName: '高价值客户',
      consumptionRange: '月消费≥10万美金',
      customerCount: 25,
      salesAmount: 18000000,
      totalConsumption: 180000000,
      roi: 4.2,
      segmentPercentage: 7.8,
      averageCustomerValue: 720000,
      retentionRate: 95.2
    },
    mediumHighValue: {
      segmentName: '中高价值客户',
      consumptionRange: '月消费5-10万美金',
      customerCount: 45,
      salesAmount: 15000000,
      totalConsumption: 120000000,
      roi: 3.8,
      segmentPercentage: 14.1,
      averageCustomerValue: 333333,
      retentionRate: 88.9
    },
    mediumValue: {
      segmentName: '中等价值客户',
      consumptionRange: '月消费3-5万美金',
      customerCount: 85,
      salesAmount: 8500000,
      totalConsumption: 85000000,
      roi: 3.2,
      segmentPercentage: 26.6,
      averageCustomerValue: 100000,
      retentionRate: 82.4
    },
    lowMediumValue: {
      segmentName: '中低价值客户',
      consumptionRange: '月消费1.5-3万美金',
      customerCount: 95,
      salesAmount: 2850000,
      totalConsumption: 47500000,
      roi: 2.8,
      segmentPercentage: 29.7,
      averageCustomerValue: 30000,
      retentionRate: 75.8
    },
    lowValue: {
      segmentName: '低价值客户',
      consumptionRange: '月消费＜1.5万美金',
      customerCount: 70,
      salesAmount: 650000,
      totalConsumption: 21000000,
      roi: 2.1,
      segmentPercentage: 21.9,
      averageCustomerValue: 9286,
      retentionRate: 68.6
    }
  }
}

// 部门客户质量评估数据
export const departmentCustomerQuality: DepartmentCustomerQualityData[] = [
  {
    departmentId: 'DEPT_001',
    departmentName: '华东销售部',
    customerQualityData: {
      quarter: '2025-Q1',
      customerSegments: {
        highValue: {
          segmentName: '高价值客户',
          consumptionRange: '月消费≥10万美金',
          customerCount: 8,
          salesAmount: 5760000,
          totalConsumption: 57600000,
          roi: 4.3,
          segmentPercentage: 8.4,
          averageCustomerValue: 720000,
          retentionRate: 100.0
        },
        mediumHighValue: {
          segmentName: '中高价值客户',
          consumptionRange: '月消费5-10万美金',
          customerCount: 15,
          salesAmount: 5000000,
          totalConsumption: 40000000,
          roi: 3.9,
          segmentPercentage: 15.8,
          averageCustomerValue: 333333,
          retentionRate: 93.3
        },
        mediumValue: {
          segmentName: '中等价值客户',
          consumptionRange: '月消费3-5万美金',
          customerCount: 25,
          salesAmount: 2500000,
          totalConsumption: 25000000,
          roi: 3.3,
          segmentPercentage: 26.3,
          averageCustomerValue: 100000,
          retentionRate: 84.0
        },
        lowMediumValue: {
          segmentName: '中低价值客户',
          consumptionRange: '月消费1.5-3万美金',
          customerCount: 30,
          salesAmount: 900000,
          totalConsumption: 15000000,
          roi: 2.9,
          segmentPercentage: 31.6,
          averageCustomerValue: 30000,
          retentionRate: 80.0
        },
        lowValue: {
          segmentName: '低价值客户',
          consumptionRange: '月消费＜1.5万美金',
          customerCount: 17,
          salesAmount: 153000,
          totalConsumption: 5100000,
          roi: 2.2,
          segmentPercentage: 17.9,
          averageCustomerValue: 9000,
          retentionRate: 70.6
        }
      }
    },
    departmentMetrics: {
      averageCustomerValue: 149474,
      highValueCustomerRatio: 24.2,
      customerUpgradeRate: 12.5,
      departmentROI: 3.4
    }
  }
]

// 客户贡献数据
export const customerContribution: CustomerContributionData[] = [
  {
    customerId: 'CUST_001',
    customerName: 'TechCorp Solutions',
    salesAmount: 2400000,
    totalProfit: 1440000,
    totalServiceFee: 960000,
    totalConsumption: 24000000,
    totalRebate: 480000,
    platformServiceFee: {
      google: 480000,
      meta: 288000,
      criteo: 144000,
      bing: 48000
    },
    platformConsumption: {
      google: 12000000,
      meta: 7200000,
      criteo: 3600000,
      bing: 1200000
    },
    platformRebate: {
      google: 240000,
      meta: 144000,
      criteo: 72000,
      bing: 24000
    },
    profitRanking: 1,
    consumptionRanking: 1,
    customerValue: 95,
    cooperationDuration: 36
  },
  {
    customerId: 'CUST_002',
    customerName: 'Global Fashion Brand',
    salesAmount: 1800000,
    totalProfit: 1080000,
    totalServiceFee: 720000,
    totalConsumption: 18000000,
    totalRebate: 360000,
    platformServiceFee: {
      google: 360000,
      meta: 216000,
      criteo: 108000,
      bing: 36000
    },
    platformConsumption: {
      google: 9000000,
      meta: 5400000,
      criteo: 2700000,
      bing: 900000
    },
    platformRebate: {
      google: 180000,
      meta: 108000,
      criteo: 54000,
      bing: 18000
    },
    profitRanking: 2,
    consumptionRanking: 2,
    customerValue: 88,
    cooperationDuration: 24
  }
]

// 续费客户数据
export const renewalCustomers: RenewalCustomer[] = [
  {
    customerId: 'CUST_001',
    customerName: 'TechCorp Solutions',
    salesPerson: '张三',
    optimizationDept: '华东优化部',
    cooperationProject: 'Google Ads + Meta广告',
    cooperationTime: '2022-03-15',
    cooperationYear: 2022,
    lastCooperationPeriod: '2024年全年',
    serviceExpiryTime: '2025-03-15',
    lastRenewalProject: 'Google Ads优化',
    lastRenewalAmount: 1200000,
    daysToExpiry: 52,
    renewalProbability: 85,
    estimatedRenewalAmount: 1500000,
    renewalPriority: 'high',
    renewalStatus: 'contacted',
    historicalValue: 3600000,
    averageQuarterlyValue: 300000,
    profitContribution: 1440000
  },
  {
    customerId: 'CUST_002',
    customerName: 'Global Fashion Brand',
    salesPerson: '李四',
    optimizationDept: '华南优化部',
    cooperationProject: 'Multi-platform Campaign',
    cooperationTime: '2023-06-01',
    cooperationYear: 2023,
    lastCooperationPeriod: '2024下半年',
    serviceExpiryTime: '2025-06-01',
    lastRenewalProject: 'Meta广告优化',
    lastRenewalAmount: 800000,
    daysToExpiry: 129,
    renewalProbability: 72,
    estimatedRenewalAmount: 1000000,
    renewalPriority: 'medium',
    renewalStatus: 'negotiating',
    historicalValue: 2400000,
    averageQuarterlyValue: 200000,
    profitContribution: 1080000
  }
]

// ============ 项目经理看板模拟数据 ============

// 部门指标概览数据
export const departmentMetrics: DepartmentMetrics = {
  departmentId: 'DEPT_PM_001',
  departmentName: '华东营销部',
  totalProfit: 8500000, // 850万
  customerCount: 45,
  projectCount: 28,
  departmentRanking: 2,
  totalDepartments: 8,
  profitGrowthRate: 18.5,
  customerGrowthRate: 12.3,
  targetCompletionRate: 92.8
}

// 部门目标数据（项目经理视角）
export const departmentTarget: DepartmentTargetData = {
  departmentId: 'DEPT_PM_001',
  departmentName: '华东营销部',
  targets: {
    totalProfitTarget: 10000000,
    serviceFeeTarget: 3500000,
    rebateTarget: 800000,
    targetPercentage: 18.5
  },
  achievements: {
    totalProfitActual: 8500000,
    totalProfitRate: 85.0,
    totalProfitGap: -1500000,
    serviceFeeActual: 3200000,
    serviceFeeRate: 91.4,
    serviceFeeGap: -300000,
    rebateActual: 750000,
    rebateRate: 93.8,
    rebateGap: -50000,
    completionPercentage: 17.2
  }
}

// 部门客户分析数据（项目经理视角）
export const departmentCustomerAnalysisForManager: DepartmentCustomerAnalysis = {
  departmentId: 'DEPT_PM_001',
  departmentName: '华东营销部',
  customerData: customerAnalysisTotal, // 复用客户分析数据
  departmentRanking: {
    profitRanking: 2,
    customerCountRanking: 3,
    growthRanking: 1
  }
}

// 部门平台分析数据
export const departmentPlatformAnalysis: DepartmentPlatformAnalysis = {
  departmentId: 'DEPT_PM_001',
  departmentName: '华东营销部',
  newOrderData: {
    totalOrders: 245,
    totalServiceFee: 3200000,
    averageOrderValue: 13061,
    platformDistribution: [
      {
        platform: 'Google',
        orderCount: 98,
        serviceFee: 1280000,
        averageOrderValue: 13061,
        growthRate: 15.8,
        profitMargin: 28.5
      },
      {
        platform: 'Facebook',
        orderCount: 76,
        serviceFee: 988000,
        averageOrderValue: 13000,
        growthRate: 22.3,
        profitMargin: 31.2
      },
      {
        platform: 'Amazon',
        orderCount: 45,
        serviceFee: 585000,
        averageOrderValue: 13000,
        growthRate: 8.9,
        profitMargin: 25.8
      },
      {
        platform: 'TikTok',
        orderCount: 26,
        serviceFee: 347000,
        averageOrderValue: 13346,
        growthRate: 45.2,
        profitMargin: 35.1
      }
    ],
    timeDistribution: [
      { period: 'Q1', orders: 58, serviceFee: 754000 },
      { period: 'Q2', orders: 62, serviceFee: 806000 },
      { period: 'Q3', orders: 65, serviceFee: 845000 },
      { period: 'Q4', orders: 60, serviceFee: 795000 }
    ]
  }
}

// 部门毛利贡献数据
export const departmentProfitContribution: DepartmentProfitContribution = {
  departmentId: 'DEPT_PM_001',
  departmentName: '华东营销部',
  totalProfit: 8500000,
  contributionPercentage: 17.2,
  departmentRanking: 2,
  totalDepartments: 8,
  profitGrowthRate: 18.5,
  customerQualityScore: 85,
  averageCustomerValue: 188889,
  highValueCustomerRatio: 22.2,
  efficiencyScore: 88,
  perCapitaOutput: 708333,
  customerConversionRate: 12.8,
  profitMargin: 28.5,

  platformProfit: {
    google: 3400000,
    facebook: 2550000,
    amazon: 1700000,
    others: 850000
  },

  serviceProfit: {
    advertising: 4250000,
    optimization: 2125000,
    analytics: 1275000,
    consulting: 850000
  },

  customerProfit: {
    gradeA: 5100000,
    gradeB: 2550000,
    gradeC: 850000
  },

  topCustomers: [
    {
      customerId: 'CUST_001',
      customerName: 'TechCorp Solutions',
      profitContribution: 850000,
      contributionPercentage: 10.0,
      isCore: true
    },
    {
      customerId: 'CUST_002',
      customerName: 'Global E-commerce Inc',
      profitContribution: 680000,
      contributionPercentage: 8.0,
      isCore: true
    },
    {
      customerId: 'CUST_003',
      customerName: 'Fashion Forward Ltd',
      profitContribution: 595000,
      contributionPercentage: 7.0,
      isCore: true
    },
    {
      customerId: 'CUST_004',
      customerName: 'Home & Garden Pro',
      profitContribution: 510000,
      contributionPercentage: 6.0,
      isCore: true
    },
    {
      customerId: 'CUST_005',
      customerName: 'Sports World Co',
      profitContribution: 425000,
      contributionPercentage: 5.0,
      isCore: false
    }
  ]
}

// 所有部门数据用于对比
export const allDepartmentsData = {
  departments: [departmentMetrics],
  departmentTargets: [departmentTarget],
  departmentCustomerAnalysis: [departmentCustomerAnalysisForManager],
  departmentPlatformAnalysis: [departmentPlatformAnalysis],
  departmentProfitContribution: [departmentProfitContribution]
}

// ============ Google优化师看板模拟数据 ============

// Google优化师个人指标
export const googleOptimizerMetrics: OptimizerMetrics = {
  optimizerId: 'OPT_GOOGLE_001',
  optimizerName: '张小明',
  platform: 'google',
  customerCount: 15,
  totalProfit: 1200000, // 120万
  platformROI: 3.8,
  lowBalanceAccounts: 3,
  monthlyGrowth: {
    profitGrowth: 15.8,
    roiGrowth: 8.2,
    customerGrowth: 6.7
  },
  targetCompletion: 88.5
}

// Google优化师目标数据
export const googleOptimizerTargets: OptimizerTargetData = {
  quarter: '2024Q4',
  optimizerId: 'OPT_GOOGLE_001',
  quarterCompletion: 85.7,
  currentProfit: 1200000,
  targetProfit: 1400000,
  currentCustomers: 15,
  targetCustomers: 18,
  currentROI: 4.2,
  targetROI: 4.5,
  monthlyTrends: [
    { month: '10月', profitCompletion: 78, roiCompletion: 85 },
    { month: '11月', profitCompletion: 82, roiCompletion: 88 },
    { month: '12月', profitCompletion: 87, roiCompletion: 92 },
    { month: '1月', profitCompletion: 86, roiCompletion: 90 }
  ],
  monthlyBreakdown: [
    { period: '2024年10月', target: 350000, actual: 273000, completionRate: 78.0, variance: -77000 },
    { period: '2024年11月', target: 350000, actual: 287000, completionRate: 82.0, variance: -63000 },
    { period: '2024年12月', target: 350000, actual: 304500, completionRate: 87.0, variance: -45500 },
    { period: '2025年1月', target: 350000, actual: 301000, completionRate: 86.0, variance: -49000 }
  ],
  weeklyBreakdown: [
    { period: '第1周', target: 87500, actual: 78000, completionRate: 89.1, variance: -9500 },
    { period: '第2周', target: 87500, actual: 82000, completionRate: 93.7, variance: -5500 },
    { period: '第3周', target: 87500, actual: 85000, completionRate: 97.1, variance: -2500 },
    { period: '第4周', target: 87500, actual: 91000, completionRate: 104.0, variance: 3500 }
  ],
  targets: {
    totalProfitTarget: 1400000,
    serviceFeeTarget: 500000,
    rebateTarget: 120000
  },
  achievements: {
    totalProfitActual: 1200000,
    totalProfitGap: -200000,
    totalProfitProgress: 85.7,
    serviceFeeActual: 450000,
    serviceFeeGap: -50000,
    serviceFeeProgress: 90.0,
    rebateActual: 110000,
    rebateGap: -10000,
    rebateProgress: 91.7
  },
  teamRanking: 3
}

// Google优化师客户分析数据
export const googleOptimizerCustomerAnalysis: OptimizerCustomerAnalysisData = {
  quarter: '2024Q4',
  optimizerId: 'OPT_GOOGLE_001',
  newCustomerConversionRate: 85.2,
  newCustomers: {
    count: 5,
    conversionRate: 85.2,
    avgSpend: 80000,
    avgROI: 4.2
  },
  existingCustomers: {
    count: 10,
    retentionRate: 92.5,
    avgSpend: 80000,
    avgROI: 4.8
  },
  churnCustomers: {
    count: 2,
    churnRate: 7.5,
    avgLifetime: 180,
    avgValue: 75000
  },
  acquisitionFunnel: {
    overallConversionRate: 85.2,
    stages: [
      { stageName: '潜在客户', count: 50, conversionRate: 60.0, dropoffRate: 40.0 },
      { stageName: '意向客户', count: 30, conversionRate: 70.0, dropoffRate: 30.0 },
      { stageName: '试用客户', count: 21, conversionRate: 85.0, dropoffRate: 15.0 },
      { stageName: '付费客户', count: 18, conversionRate: 95.0, dropoffRate: 5.0 }
    ]
  },
  lifecycleStages: [
    { stageName: '新客户', count: 5, percentage: 33.3, avgValue: 80000, icon: 'user-plus' },
    { stageName: '成长期', count: 4, percentage: 26.7, avgValue: 85000, icon: 'trending-up' },
    { stageName: '成熟期', count: 4, percentage: 26.7, avgValue: 90000, icon: 'star' },
    { stageName: '留存期', count: 2, percentage: 13.3, avgValue: 75000, icon: 'shield' }
  ],
  valueSegments: [
    { segmentName: '高价值客户', customerCount: 3, percentage: 20.0, totalValue: 300000 },
    { segmentName: '中价值客户', customerCount: 7, percentage: 46.7, totalValue: 560000 },
    { segmentName: '低价值客户', customerCount: 5, percentage: 33.3, totalValue: 340000 }
  ],
  customerDetails: [
    { customerId: 'CUST_001', customerName: 'TechCorp Solutions', type: 'existing', spend: 120000, roi: 5.2, lastActivity: '2024-07-22', status: 'active' },
    { customerId: 'CUST_002', customerName: 'Global E-commerce Inc', type: 'new', spend: 85000, roi: 4.5, lastActivity: '2024-07-21', status: 'active' },
    { customerId: 'CUST_003', customerName: 'Fashion Forward Ltd', type: 'existing', spend: 95000, roi: 4.8, lastActivity: '2024-07-20', status: 'active' },
    { customerId: 'CUST_004', customerName: 'Home & Garden Pro', type: 'churn', spend: 0, roi: 0, lastActivity: '2024-06-15', status: 'churned' }
  ],
  allProjects: {
    activeCustomerCount: 15,
    totalProfit: 1200000,
    serviceFee: 450000,
    rebate: 110000
  },
  oldCustomers: {
    activeCustomerCount: 10,
    totalProfit: 800000,
    serviceFee: 300000,
    rebate: 75000
  },
  churnedCustomers: {
    customerCount: 2,
    estimatedProfitLoss: 150000,
    estimatedServiceFeeLoss: 55000,
    estimatedRebateLoss: 13000
  }
}

// Google优化师客户质量评估
export const googleOptimizerCustomerQuality: OptimizerCustomerQualityData = {
  quarter: '2024Q4',
  optimizerId: 'OPT_GOOGLE_001',
  averageQualityScore: 78.5,
  qualitySegments: {
    excellent: {
      count: 3,
      percentage: 20.0,
      avgROI: 5.2,
      retentionRate: 95.0
    },
    good: {
      count: 6,
      percentage: 40.0,
      avgROI: 4.1,
      retentionRate: 88.0
    },
    average: {
      count: 4,
      percentage: 26.7,
      avgROI: 3.2,
      retentionRate: 75.0
    },
    poor: {
      count: 2,
      percentage: 13.3,
      avgROI: 2.1,
      retentionRate: 45.0
    }
  },
  radarData: {
    current: {
      spend: 85,
      roi: 78,
      conversion: 82,
      retention: 88,
      engagement: 75,
      satisfaction: 80
    },
    benchmark: {
      spend: 90,
      roi: 85,
      conversion: 85,
      retention: 90,
      engagement: 80,
      satisfaction: 85
    }
  },
  improvementSuggestions: [
    {
      id: 'IMP_001',
      title: '优化广告创意素材',
      priority: 'high',
      impact: '高',
      effort: '中',
      description: '提升广告创意质量以提高转化率'
    },
    {
      id: 'IMP_002',
      title: '调整目标受众',
      priority: 'medium',
      impact: '中',
      effort: '低',
      description: '重新定义目标受众以提高ROI'
    }
  ],
  customerQualityDetails: [
    {
      customerId: 'CUST_001',
      customerName: 'TechCorp Solutions',
      qualityScore: 92,
      qualityLevel: 'excellent',
      spend: 120000,
      roi: 5.2,
      retentionRate: 98,
      improvementAreas: ['预算优化'],
      lastEvaluation: '2024-07-20'
    },
    {
      customerId: 'CUST_002',
      customerName: 'Global E-commerce Inc',
      qualityScore: 76,
      qualityLevel: 'good',
      spend: 85000,
      roi: 4.1,
      retentionRate: 85,
      improvementAreas: ['创意优化', '受众定位'],
      lastEvaluation: '2024-07-19'
    }
  ],
  customerSegments: {
    highValue: {
      segmentName: '月消费10万美金以上',
      customerCount: 2,
      salesAmount: 600000,
      totalConsumption: 120000,
      roi: 5.0,
      segmentPercentage: 13.3,
      platformBreakdown: {
        google: 80000,
        meta: 25000,
        criteo: 10000,
        bing: 5000
      }
    },
    mediumHighValue: {
      segmentName: '月消费5-10万美金',
      customerCount: 3,
      salesAmount: 480000,
      totalConsumption: 90000,
      roi: 4.2,
      segmentPercentage: 20.0,
      platformBreakdown: {
        google: 60000,
        meta: 20000,
        criteo: 7000,
        bing: 3000
      }
    },
    mediumValue: {
      segmentName: '月消费3-5万美金',
      customerCount: 4,
      salesAmount: 360000,
      totalConsumption: 60000,
      roi: 3.8,
      segmentPercentage: 26.7,
      platformBreakdown: {
        google: 40000,
        meta: 15000,
        criteo: 3000,
        bing: 2000
      }
    },
    lowMediumValue: {
      segmentName: '月消费1.5-3万美金',
      customerCount: 4,
      salesAmount: 240000,
      totalConsumption: 40000,
      roi: 3.2,
      segmentPercentage: 26.7,
      platformBreakdown: {
        google: 28000,
        meta: 8000,
        criteo: 2500,
        bing: 1500
      }
    },
    lowValue: {
      segmentName: '月消费1.5万以下美金',
      customerCount: 2,
      salesAmount: 120000,
      totalConsumption: 15000,
      roi: 2.8,
      segmentPercentage: 13.3,
      platformBreakdown: {
        google: 10000,
        meta: 3000,
        criteo: 1500,
        bing: 500
      }
    }
  }
}

// 账户余额数据
export const googleAccountBalance: AccountBalanceData = {
  optimizerId: 'OPT_GOOGLE_001',
  summary: {
    totalAccounts: 15,
    warningAccounts: 3,
    totalBalance: 85000,
    averageRemainingDays: 12.5
  },
  customerAccounts: [
    {
      customerId: 'CUST_001',
      customerName: 'TechCorp Solutions',
      adAccount: 'ACC-123456789',
      accountBalance: 2500,
      past7DaysAvgSpend: 820,
      estimatedDays: 3.0,
      warningLevel: 'critical',
      lastUpdated: '2024-07-23T08:30:00Z'
    },
    {
      customerId: 'CUST_002',
      customerName: 'Global E-commerce Inc',
      adAccount: 'ACC-987654321',
      accountBalance: 4200,
      past7DaysAvgSpend: 650,
      estimatedDays: 6.5,
      warningLevel: 'warning',
      lastUpdated: '2024-07-23T09:15:00Z'
    },
    {
      customerId: 'CUST_003',
      customerName: 'Fashion Forward Ltd',
      adAccount: 'ACC-456789123',
      accountBalance: 8500,
      past7DaysAvgSpend: 1200,
      estimatedDays: 7.1,
      warningLevel: 'warning',
      lastUpdated: '2024-07-23T07:45:00Z'
    },
    {
      customerId: 'CUST_004',
      customerName: 'Home & Garden Pro',
      adAccount: 'ACC-789123456',
      accountBalance: 15000,
      past7DaysAvgSpend: 950,
      estimatedDays: 15.8,
      warningLevel: 'normal',
      lastUpdated: '2024-07-23T10:20:00Z'
    },
    {
      customerId: 'CUST_005',
      customerName: 'Sports World Co',
      adAccount: 'ACC-321654987',
      accountBalance: 12800,
      past7DaysAvgSpend: 780,
      estimatedDays: 16.4,
      warningLevel: 'normal',
      lastUpdated: '2024-07-23T06:30:00Z'
    }
  ]
}

// Google广告数据总览
export const googleAdsOverview: GoogleAdsOverviewData = {
  optimizerId: 'OPT_GOOGLE_001',
  summary: {
    totalSpend: 485000,
    totalImpressions: 12500000,
    totalClicks: 375000,
    totalConversions: 18750,
    avgCPC: 1.29,
    avgCTR: 0.03,
    avgConversionRate: 0.05,
    totalROAS: 3.8
  },
  customerAdsData: [
    {
      customerId: 'CUST_001',
      customerName: 'TechCorp Solutions',
      campaignCount: 8,
      spend: 85000,
      impressions: 2100000,
      clicks: 63000,
      conversions: 3150,
      cpc: 1.35,
      ctr: 0.03,
      conversionRate: 0.05,
      roas: 4.2,
      lastOptimized: '2024-07-22T14:30:00Z',
      performanceStatus: 'excellent'
    },
    {
      customerId: 'CUST_002',
      customerName: 'Global E-commerce Inc',
      campaignCount: 12,
      spend: 120000,
      impressions: 3200000,
      clicks: 96000,
      conversions: 4320,
      cpc: 1.25,
      ctr: 0.03,
      conversionRate: 0.045,
      roas: 3.9,
      lastOptimized: '2024-07-21T16:45:00Z',
      performanceStatus: 'good'
    },
    {
      customerId: 'CUST_003',
      customerName: 'Fashion Forward Ltd',
      adAccount: 'ACC-456789123',
      campaignCount: 6,
      spend: 65000,
      impressions: 1850000,
      clicks: 55500,
      conversions: 2220,
      cpc: 1.17,
      ctr: 0.03,
      conversionRate: 0.04,
      roas: 3.4,
      lastOptimized: '2024-07-20T11:20:00Z',
      performanceStatus: 'good'
    },
    {
      customerId: 'CUST_004',
      customerName: 'Home & Garden Pro',
      campaignCount: 4,
      spend: 45000,
      impressions: 1200000,
      clicks: 36000,
      conversions: 1440,
      cpc: 1.25,
      ctr: 0.03,
      conversionRate: 0.04,
      roas: 2.8,
      lastOptimized: '2024-07-19T09:15:00Z',
      performanceStatus: 'needs_attention'
    },
    {
      customerId: 'CUST_005',
      customerName: 'Sports World Co',
      campaignCount: 5,
      spend: 38000,
      impressions: 980000,
      clicks: 29400,
      conversions: 1176,
      cpc: 1.29,
      ctr: 0.03,
      conversionRate: 0.04,
      roas: 2.5,
      lastOptimized: '2024-07-18T15:30:00Z',
      performanceStatus: 'needs_attention'
    }
  ],
  anomalyAlerts: [
    {
      alertId: 'ALERT_001',
      customerId: 'CUST_004',
      customerName: 'Home & Garden Pro',
      alertType: 'cpc_spike',
      severity: 'high',
      currentValue: 1.85,
      expectedValue: 1.25,
      deviation: 48.0,
      detectedAt: '2024-07-23T08:15:00Z',
      description: 'CPC异常上升，比预期值高出48%'
    },
    {
      alertId: 'ALERT_002',
      customerId: 'CUST_005',
      customerName: 'Sports World Co',
      alertType: 'conversion_drop',
      severity: 'medium',
      currentValue: 0.035,
      expectedValue: 0.045,
      deviation: -22.2,
      detectedAt: '2024-07-23T07:30:00Z',
      description: '转化率下降，比预期值低22.2%'
    }
  ]
}

// API 模拟函数
export const businessAPI = {
  // 获取角色列表
  getRoles: () => Promise.resolve(businessRoles),

  // 获取销售总监指标
  getSalesDirectorMetrics: () => Promise.resolve(salesDirectorMetrics),

  // 获取目标完成对比
  getTargetComparison: () => Promise.resolve(targetComparisonData),

  // 获取平台分布数据
  getPlatformDistribution: () => Promise.resolve(platformDistributionData),

  // 获取客户毛利数据
  getCustomerProfitData: () => Promise.resolve(customerProfitData),

  // 获取毛利汇总
  getProfitSummary: () => Promise.resolve(profitSummaryData),

  // 获取流失客户数据
  getChurnData: () => Promise.resolve(churnData),

  // 获取流失客户详情
  getChurnCustomerDetails: () => Promise.resolve(churnCustomerDetails),

  // 获取销售人员表现
  getSalesPersonPerformance: () => Promise.resolve(salesPersonPerformance),

  // 获取客户毛利明细
  getCustomerProfitDetails: () => Promise.resolve(customerProfitDetails),

  // 获取续费客户数据
  getRenewalCustomerData: () => Promise.resolve(renewalCustomerData),

  // 获取财务分析数据
  getFinancialAnalysisData: () => Promise.resolve(financialAnalysisData),

  // 获取预算执行数据
  getBudgetExecutionData: () => Promise.resolve(budgetExecutionData),

  // 获取应收账款数据
  getAccountsReceivableData: () => Promise.resolve(accountsReceivableData),

  // 获取财务风险预警
  getFinancialRiskAlerts: () => Promise.resolve(financialRiskAlerts),

  // ============ 销售经理看板 API 函数 ============

  // 获取销售经理看板核心指标
  getSalesManagerMetrics: () => Promise.resolve(salesManagerMetrics),

  // 获取团队指标数据
  getTeamMetrics: () => Promise.resolve(teamMetrics),

  // 获取团队成员绩效数据
  getTeamMemberPerformance: () => Promise.resolve(teamMemberPerformance),

  // 获取团队销售统计
  getTeamSalesStatistics: () => Promise.resolve(teamSalesStatistics),

  // 获取团队平台分布数据
  getTeamPlatformDistribution: () => Promise.resolve(teamPlatformDistribution),

  // 获取团队客户毛利详情
  getTeamCustomerProfitDetails: () => Promise.resolve(teamCustomerProfitDetails),

  // 获取团队续费客户数据
  getTeamRenewalCustomers: () => Promise.resolve(teamRenewalCustomers),

  // ============ 销售人员看板 API 函数 ============

  // 获取个人绩效数据
  getPersonalPerformance: () => Promise.resolve(personalPerformance),

  // 获取个人客户分类数据
  getPersonalCustomerCategories: () => Promise.resolve(personalCustomerCategories),

  // 获取个人平台绩效数据
  getPersonalPlatformPerformance: () => Promise.resolve(personalPlatformPerformance),

  // 获取个人客户详情数据
  getPersonalCustomerDetails: () => Promise.resolve(personalCustomerDetails),

  // 获取个人续费任务数据
  getPersonalRenewalTasks: () => Promise.resolve(personalRenewalTasks),

  // ============ 项目总监看板 API 函数 ============

  // 获取运营目标数据
  getOperationTargets: () => Promise.resolve(operationTargets),

  // 获取部门目标数据
  getDepartmentTargets: () => Promise.resolve(departmentTargets),

  // 获取客户分析数据（总计）
  getCustomerAnalysisTotal: () => Promise.resolve(customerAnalysisTotal),

  // 获取部门客户分析数据
  getDepartmentCustomerAnalysis: () => Promise.resolve(departmentCustomerAnalysis),

  // 获取平台项目数据（总计）
  getPlatformProjectsTotal: () => Promise.resolve(platformProjectsTotal),

  // 获取部门平台项目数据
  getDepartmentPlatformProjects: () => Promise.resolve(departmentPlatformProjects),

  // 获取平台毛利贡献数据（总计）
  getPlatformProfitContributionTotal: () => Promise.resolve(platformProfitContributionTotal),

  // 获取部门平台毛利贡献数据
  getDepartmentPlatformProfitContribution: () => Promise.resolve(departmentPlatformProfitContribution),

  // 获取客户质量评估数据（总计）
  getCustomerQualityTotal: () => Promise.resolve(customerQualityTotal),

  // 获取部门客户质量评估数据
  getDepartmentCustomerQuality: () => Promise.resolve(departmentCustomerQuality),

  // 获取客户贡献数据
  getCustomerContribution: () => Promise.resolve(customerContribution),

  // 获取续费客户数据
  getRenewalCustomers: () => Promise.resolve(renewalCustomers),

  // ============ 项目经理看板 API 函数 ============

  // 获取部门指标概览
  getDepartmentMetrics: () => Promise.resolve(departmentMetrics),

  // 获取部门目标数据（项目经理视角）
  getDepartmentTarget: () => Promise.resolve(departmentTarget),

  // 获取部门客户分析数据（项目经理视角）
  getDepartmentCustomerAnalysisForManager: () => Promise.resolve(departmentCustomerAnalysisForManager),

  // 获取部门平台分析数据
  getDepartmentPlatformAnalysis: () => Promise.resolve(departmentPlatformAnalysis),

  // 获取部门毛利贡献数据
  getDepartmentProfitContribution: () => Promise.resolve(departmentProfitContribution),

  // 获取所有部门数据用于对比
  getAllDepartmentsData: () => Promise.resolve(allDepartmentsData),

  // ============ Google优化师看板 API 函数 ============

  // 获取Google优化师个人指标
  getGoogleOptimizerMetrics: () => Promise.resolve(googleOptimizerMetrics),

  // 获取Google优化师目标数据
  getGoogleOptimizerTargets: () => Promise.resolve(googleOptimizerTargets),

  // 获取Google优化师客户分析数据
  getGoogleOptimizerCustomerAnalysis: () => Promise.resolve(googleOptimizerCustomerAnalysis),

  // 获取Google优化师客户质量评估数据
  getGoogleOptimizerCustomerQuality: () => Promise.resolve(googleOptimizerCustomerQuality),

  // 获取Google账户余额数据
  getGoogleAccountBalance: () => Promise.resolve(googleAccountBalance),

  // 获取Google广告数据总览
  getGoogleAdsOverview: () => Promise.resolve(googleAdsOverview),

  // ============ Meta优化师看板 API 函数 ============

  // 获取Meta优化师个人指标
  getMetaOptimizerMetrics: () => Promise.resolve({...googleOptimizerMetrics, platform: 'meta'}),

  // 获取Meta优化师目标数据
  getMetaOptimizerTargets: () => Promise.resolve(googleOptimizerTargets),

  // 获取Meta优化师客户分析数据
  getMetaOptimizerCustomerAnalysis: () => Promise.resolve(googleOptimizerCustomerAnalysis),

  // 获取Meta优化师客户质量评估数据
  getMetaOptimizerCustomerQuality: () => Promise.resolve(googleOptimizerCustomerQuality),

  // 获取Meta账户余额数据
  getMetaAccountBalance: () => Promise.resolve(googleAccountBalance),

  // ============ Criteo优化师看板 API 函数 ============

  // 获取Criteo优化师个人指标
  getCriteoOptimizerMetrics: () => Promise.resolve({...googleOptimizerMetrics, platform: 'criteo'}),

  // 获取Criteo账户余额数据
  getCriteoAccountBalance: () => Promise.resolve(googleAccountBalance),

  // ============ Bing优化师看板 API 函数 ============

  // 获取Bing优化师个人指标
  getBingOptimizerMetrics: () => Promise.resolve({...googleOptimizerMetrics, platform: 'bing'}),

  // 获取Bing账户余额数据
  getBingAccountBalance: () => Promise.resolve(googleAccountBalance)
}

export default businessAPI
