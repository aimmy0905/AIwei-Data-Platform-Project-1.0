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
  FinancialRiskAlert
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
  getFinancialRiskAlerts: () => Promise.resolve(financialRiskAlerts)
}

export default businessAPI