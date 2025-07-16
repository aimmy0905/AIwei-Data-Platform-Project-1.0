import type { Customer, Project, Channel, ChannelData, ChannelSummary, ChannelDimension, WebsiteData, WebsiteDataComparison, PeriodComparison, ComparisonPeriod, Campaign, CampaignData, CampaignDailyData, CampaignSummary, ProductSales, ProductSalesData, ProductRanking, ProductSalesSummary, KOLData, PostData, KOLSummary, PostSummary, CountryMarketData, MarketSummary, MarketTrend, PagePerformanceData, PagePerformanceSummary, CompetitorData, CompetitorSummary, AdPlatformData, AdPlatformSummary, MetaAdData, MetaAdObjectiveData, MetaAudienceData, MetaPlacementData, MetaDemographicData, MetaCreativeData, GoogleAdData, GoogleAdTypeData, CriteoAdData, CriteoPlacementData, BingAdData, Alert, ChartData, ApiResponse, CustomerGoal, CustomerGoalSummary, CustomerGoalFilter } from '@/types'

// Mock客户数据 - 仅供内部使用，公共导出使用 customer.ts 中的版本
const mockCustomers: Customer[] = [
  {
    id: 1,
    name: 'Fashion Store USA',
    website: 'https://fashionstore.com',
    industry: '时尚服装',
    revenue: 485000,
    roi: 4.2,
    status: 'active',
    manager: '张小明',
    createdAt: '2024-01-15',
    lastUpdated: '2025-01-07',
    assignedTo: 'user-001',
    projects: [
      {
        id: 'proj-001',
        name: '春季新品推广',
        customerId: 1,
        status: 'active',
        startDate: '2024-03-01',
        budget: 50000,
        revenue: 85000,
        roi: 1.7
      },
      {
        id: 'proj-002',
        name: '夏季促销活动',
        customerId: 1,
        status: 'active',
        startDate: '2024-06-01',
        budget: 75000,
        revenue: 120000,
        roi: 1.6
      }
    ]
  },
  {
    id: 2,
    name: 'Tech Gadgets Pro',
    website: 'https://techgadgets.com',
    industry: '数码科技',
    revenue: 320000,
    roi: 3.8,
    status: 'active',
    manager: '李红',
    createdAt: '2024-03-22',
    lastUpdated: '2025-01-06',
    assignedTo: 'user-002',
    projects: [
      {
        id: 'proj-003',
        name: '智能手机推广',
        customerId: 2,
        status: 'active',
        startDate: '2024-04-01',
        budget: 100000,
        revenue: 180000,
        roi: 1.8
      },
      {
        id: 'proj-004',
        name: '智能手表营销',
        customerId: 2,
        status: 'completed',
        startDate: '2024-01-15',
        endDate: '2024-03-31',
        budget: 60000,
        revenue: 95000,
        roi: 1.58
      }
    ]
  },
  {
    id: 3,
    name: 'Beauty Cosmetics',
    website: 'https://beautycosmetics.com',
    industry: '美容护肤',
    revenue: 670000,
    roi: 5.1,
    status: 'active',
    manager: '王强',
    createdAt: '2024-02-10',
    lastUpdated: '2025-01-05',
    assignedTo: 'user-001',
    projects: [
      {
        id: 'proj-005',
        name: '护肤品套装推广',
        customerId: 3,
        status: 'active',
        startDate: '2024-05-01',
        budget: 40000,
        revenue: 72000,
        roi: 1.8
      }
    ]
  },
  {
    id: 4,
    name: 'Sports Equipment',
    website: 'https://sportsequip.com',
    industry: '体育用品',
    revenue: 125000,
    roi: 2.3,
    status: 'inactive',
    manager: '赵敏',
    createdAt: '2024-06-18',
    lastUpdated: '2024-12-20',
    assignedTo: 'user-003',
    projects: [
      {
        id: 'proj-006',
        name: '运动鞋推广',
        customerId: 4,
        status: 'active',
        startDate: '2024-03-15',
        budget: 80000,
        revenue: 140000,
        roi: 1.75
      },
      {
        id: 'proj-007',
        name: '健身器材营销',
        customerId: 4,
        status: 'paused',
        startDate: '2024-02-01',
        budget: 30000,
        revenue: 25000,
        roi: 0.83
      }
    ]
  },
  {
    id: 5,
    name: 'Home Decoration',
    website: 'https://homedeco.com',
    industry: '家居装饰',
    revenue: 280000,
    roi: 3.5,
    status: 'active',
    manager: '孙丽',
    createdAt: '2024-04-05',
    lastUpdated: '2025-01-04',
    assignedTo: 'user-002',
    projects: [
      {
        id: 'proj-008',
        name: '家具套装推广',
        customerId: 5,
        status: 'active',
        startDate: '2024-04-20',
        budget: 65000,
        revenue: 110000,
        roi: 1.69
      }
    ]
  }
]

// Mock渠道数据
export const mockChannels: Channel[] = [
  {
    id: 1,
    name: 'Google Ads',
    type: 'google',
    revenue: 245000,
    users: 18500,
    sessions: 42000,
    conversionRate: 3.2,
    cost: 58000,
    roi: 4.2
  },
  {
    id: 2,
    name: 'Facebook Ads',
    type: 'facebook',
    revenue: 180000,
    users: 15200,
    sessions: 35000,
    conversionRate: 2.8,
    cost: 45000,
    roi: 4.0
  },
  {
    id: 3,
    name: 'Direct Traffic',
    type: 'direct',
    revenue: 95000,
    users: 8900,
    sessions: 22000,
    conversionRate: 4.1,
    cost: 0,
    roi: 0
  },
  {
    id: 4,
    name: 'Email Marketing',
    type: 'email',
    revenue: 68000,
    users: 5800,
    sessions: 15000,
    conversionRate: 5.2,
    cost: 8000,
    roi: 8.5
  },
  {
    id: 5,
    name: 'Criteo Display',
    type: 'criteo',
    revenue: 42000,
    users: 3200,
    sessions: 8500,
    conversionRate: 2.1,
    cost: 12000,
    roi: 3.5
  },
  {
    id: 6,
    name: 'Bing Ads',
    type: 'bing',
    revenue: 35000,
    users: 2800,
    sessions: 7200,
    conversionRate: 2.5,
    cost: 9000,
    roi: 3.9
  },
  {
    id: 7,
    name: 'Pinterest',
    type: 'pinterest',
    revenue: 28000,
    users: 4500,
    sessions: 12000,
    conversionRate: 1.8,
    cost: 6000,
    roi: 4.7
  },
  {
    id: 8,
    name: 'Google Organic',
    type: 'organic',
    revenue: 85000,
    users: 12000,
    sessions: 28000,
    conversionRate: 3.8,
    cost: 0,
    roi: 0
  }
]

// Mock扩展渠道数据
export const mockChannelData: ChannelData[] = [
  {
    id: 1,
    name: 'Google / CPC',
    type: 'google',
    sessionSourceMedium: 'google / cpc',
    firstUserSourceMedium: 'google / cpc',
    sessionCampaign: 'spring_sale_2024',
    firstUserCampaign: 'spring_sale_2024',

    // 结果指标
    totalRevenue: 245000,
    totalUsers: 18500,
    averagePurchaseRevenue: 132.43,
    transactions: 1850,
    userConversionRate: 10.0,
    bounceRate: 32.5,

    // 过程指标
    addToCarts: 3700,
    checkouts: 2220,
    itemAddToCartsRate: 8.8,
    itemCheckoutsRate: 60.0,

    // 用户指标
    sessions: 42000,
    newUsers: 14800,
    returningUsers: 3700,
    averagePurchaseRevenuePerUser: 13.24,
    averageOrdersPerCustomer: 1.25
  },
  {
    id: 2,
    name: '(direct) / (none)',
    type: 'direct',
    sessionSourceMedium: '(direct) / (none)',
    firstUserSourceMedium: '(direct) / (none)',
    sessionCampaign: '(not set)',
    firstUserCampaign: '(not set)',

    // 结果指标
    totalRevenue: 95000,
    totalUsers: 8900,
    averagePurchaseRevenue: 156.89,
    transactions: 605,
    userConversionRate: 6.8,
    bounceRate: 28.3,

    // 过程指标
    addToCarts: 1780,
    checkouts: 910,
    itemAddToCartsRate: 8.1,
    itemCheckoutsRate: 51.1,

    // 用户指标
    sessions: 22000,
    newUsers: 3560,
    returningUsers: 5340,
    averagePurchaseRevenuePerUser: 10.67,
    averageOrdersPerCustomer: 1.89
  },
  {
    id: 3,
    name: 'Facebook Ads',
    type: 'facebook',
    sessionSourceMedium: 'facebook / cpc',
    firstUserSourceMedium: 'facebook / cpc',
    sessionCampaign: 'summer_campaign_2024',
    firstUserCampaign: 'summer_campaign_2024',

    // 结果指标
    totalRevenue: 180000,
    totalUsers: 15200,
    averagePurchaseRevenue: 128.57,
    transactions: 1400,
    userConversionRate: 9.2,
    bounceRate: 35.7,

    // 过程指标
    addToCarts: 2800,
    checkouts: 1680,
    itemAddToCartsRate: 8.0,
    itemCheckoutsRate: 60.0,

    // 用户指标
    sessions: 35000,
    newUsers: 12160,
    returningUsers: 3040,
    averagePurchaseRevenuePerUser: 11.84,
    averageOrdersPerCustomer: 1.15
  },
  {
    id: 4,
    name: 'Pinterest.com',
    type: 'pinterest',
    sessionSourceMedium: 'pinterest.com / referral',
    firstUserSourceMedium: 'pinterest.com / referral',
    sessionCampaign: 'pinterest_organic',
    firstUserCampaign: 'pinterest_organic',

    // 结果指标
    totalRevenue: 28000,
    totalUsers: 4500,
    averagePurchaseRevenue: 155.56,
    transactions: 180,
    userConversionRate: 4.0,
    bounceRate: 45.2,

    // 过程指标
    addToCarts: 540,
    checkouts: 270,
    itemAddToCartsRate: 4.5,
    itemCheckoutsRate: 50.0,

    // 用户指标
    sessions: 12000,
    newUsers: 3600,
    returningUsers: 900,
    averagePurchaseRevenuePerUser: 6.22,
    averageOrdersPerCustomer: 1.0
  },
  {
    id: 5,
    name: 'Google / organic',
    type: 'organic',
    sessionSourceMedium: 'google / organic',
    firstUserSourceMedium: 'google / organic',
    sessionCampaign: '(not set)',
    firstUserCampaign: '(not set)',

    // 结果指标
    totalRevenue: 85000,
    totalUsers: 12000,
    averagePurchaseRevenue: 170.0,
    transactions: 500,
    userConversionRate: 4.17,
    bounceRate: 38.9,

    // 过程指标
    addToCarts: 1200,
    checkouts: 750,
    itemAddToCartsRate: 4.3,
    itemCheckoutsRate: 62.5,

    // 用户指标
    sessions: 28000,
    newUsers: 8400,
    returningUsers: 3600,
    averagePurchaseRevenuePerUser: 7.08,
    averageOrdersPerCustomer: 1.25
  },
  {
    id: 6,
    name: 'Criteo / display',
    type: 'criteo',
    sessionSourceMedium: 'criteo / display',
    firstUserSourceMedium: 'criteo / display',
    sessionCampaign: 'criteo_retargeting',
    firstUserCampaign: 'criteo_retargeting',

    // 结果指标
    totalRevenue: 42000,
    totalUsers: 3200,
    averagePurchaseRevenue: 200.0,
    transactions: 210,
    userConversionRate: 6.56,
    bounceRate: 42.1,

    // 过程指标
    addToCarts: 480,
    checkouts: 315,
    itemAddToCartsRate: 5.6,
    itemCheckoutsRate: 65.6,

    // 用户指标
    sessions: 8500,
    newUsers: 1280,
    returningUsers: 1920,
    averagePurchaseRevenuePerUser: 13.13,
    averageOrdersPerCustomer: 1.64
  },
  {
    id: 7,
    name: 'Email',
    type: 'email',
    sessionSourceMedium: 'email / email',
    firstUserSourceMedium: 'email / email',
    sessionCampaign: 'newsletter_2024',
    firstUserCampaign: 'newsletter_2024',

    // 结果指标
    totalRevenue: 68000,
    totalUsers: 5800,
    averagePurchaseRevenue: 226.67,
    transactions: 300,
    userConversionRate: 5.17,
    bounceRate: 25.4,

    // 过程指标
    addToCarts: 870,
    checkouts: 450,
    itemAddToCartsRate: 5.8,
    itemCheckoutsRate: 51.7,

    // 用户指标
    sessions: 15000,
    newUsers: 1160,
    returningUsers: 4640,
    averagePurchaseRevenuePerUser: 11.72,
    averageOrdersPerCustomer: 2.07
  },
  {
    id: 8,
    name: '其他',
    type: 'other',
    sessionSourceMedium: '其他',
    firstUserSourceMedium: '其他',
    sessionCampaign: '(not set)',
    firstUserCampaign: '(not set)',

    // 结果指标
    totalRevenue: 25000,
    totalUsers: 3200,
    averagePurchaseRevenue: 125.0,
    transactions: 200,
    userConversionRate: 6.25,
    bounceRate: 38.7,

    // 过程指标
    addToCarts: 320,
    checkouts: 240,
    itemAddToCartsRate: 4.8,
    itemCheckoutsRate: 75.0,

    // 用户指标
    sessions: 8000,
    newUsers: 2240,
    returningUsers: 960,
    averagePurchaseRevenuePerUser: 7.81,
    averageOrdersPerCustomer: 1.56
  }
]

// Mock渠道数据汇总
export const mockChannelSummary: ChannelSummary = {
  totalRevenue: 728000,
  totalUsers: 71300,
  totalSessions: 170500,
  averageConversionRate: 7.1,
  totalCost: 145000,
  averageROI: 5.0,
  topPerformingChannel: 'Google / CPC',
  channelCount: 8
}

// Mock渠道数据维度配置
export const mockChannelDimensions: ChannelDimension[] = [
  // 维度类别
  {
    id: 'sessionSourceMedium',
    name: 'Session source/medium',
    category: 'dimension',
    description: '会话来源/媒介',
    format: 'string',
    selected: true
  },
  {
    id: 'firstUserSourceMedium',
    name: 'First user source/medium',
    category: 'dimension',
    description: '首次用户来源/媒介',
    format: 'string',
    selected: false
  },
  {
    id: 'sessionCampaign',
    name: 'Session campaign',
    category: 'dimension',
    description: '会话广告系列',
    format: 'string',
    selected: false
  },
  {
    id: 'firstUserCampaign',
    name: 'First user campaign',
    category: 'dimension',
    description: '首次用户广告系列',
    format: 'string',
    selected: false
  },

  // 结果指标类别
  {
    id: 'totalRevenue',
    name: 'Total Revenue',
    category: 'result',
    description: '总收入',
    format: 'currency',
    selected: true
  },
  {
    id: 'totalUsers',
    name: 'Total users',
    category: 'result',
    description: '总用户数',
    format: 'number',
    selected: true
  },
  {
    id: 'averagePurchaseRevenue',
    name: 'Average Purchase Revenue',
    category: 'result',
    description: '平均购买收入',
    format: 'currency',
    selected: false
  },
  {
    id: 'transactions',
    name: 'Transactions',
    category: 'result',
    description: '交易次数',
    format: 'number',
    selected: true
  },
  {
    id: 'userConversionRate',
    name: 'User Conversion Rate',
    category: 'result',
    description: '用户转化率',
    format: 'percentage',
    selected: true
  },
  {
    id: 'bounceRate',
    name: 'Bounce Rate',
    category: 'result',
    description: '跳出率',
    format: 'percentage',
    selected: false
  },

  // 过程指标类别
  {
    id: 'addToCarts',
    name: 'Add to Carts',
    category: 'process',
    description: '添加到购物车次数',
    format: 'number',
    selected: false
  },
  {
    id: 'checkouts',
    name: 'Checkouts',
    category: 'process',
    description: '开始结账次数',
    format: 'number',
    selected: false
  },
  {
    id: 'itemAddToCartsRate',
    name: 'Item Add to Carts Rate',
    category: 'process',
    description: '商品添加至购物车率',
    format: 'percentage',
    selected: false
  },
  {
    id: 'itemCheckoutsRate',
    name: 'Item Checkouts Rate',
    category: 'process',
    description: '商品结账率',
    format: 'percentage',
    selected: false
  },

  // 用户指标类别
  {
    id: 'sessions',
    name: 'Sessions',
    category: 'user',
    description: '会话数',
    format: 'number',
    selected: true
  },
  {
    id: 'newUsers',
    name: 'New Users',
    category: 'user',
    description: '新用户数',
    format: 'number',
    selected: false
  },
  {
    id: 'returningUsers',
    name: 'Returning Users',
    category: 'user',
    description: '回访用户数',
    format: 'number',
    selected: false
  },
  {
    id: 'averagePurchaseRevenuePerUser',
    name: 'Average Purchase Revenue per User',
    category: 'user',
    description: '每用户平均购买收入',
    format: 'currency',
    selected: false
  },
  {
    id: 'averageOrdersPerCustomer',
    name: 'Average Orders per Customer',
    category: 'user',
    description: '平均每位客户订单数',
    format: 'number',
    selected: false
  }
]

// Mock网站数据
export const mockWebsiteData: WebsiteData = {
  // 结果指标
  totalSales: 1250000,
  totalCost: 285000,
  roi: 4.4,
  averageOrderItems: 2.3, // AOI - 订单的平均产品数量
  orderConversionCost: 74.03, // 订单转化成本
  averageOrderValue: 324.68,
  conversionRate: 3.2,
  storeVisits: 125000, // 商店访问次数
  userVisitCost: 2.28, // 用户访问成本

  // 订单指标
  orders: 3850,
  orderItemsPerOrder: 2.3, // 每笔订单的订购数量
  ordersPerCustomer: 1.8, // 每位客户的订单数
  returningCustomerOrders: 1540, // 订单数(回头客)
  newCustomerOrders: 2310, // 订单数(新客户)

  // 用户指标
  visitors: 125000,
  visits: 185000, // 访问次数
  newUsers: 45000,
  returningUsers: 80000,
  addToCartVisits: 22500, // 加购访问次数
  reachCheckoutVisits: 8750, // 到达结账页面的访问次数
  completeCheckoutVisits: 4200, // 到达并完成结账的访问次数
  completedCheckoutVisits: 3850, // 完成结账的访问次数
  averageVisitDuration: 245, // 平均访问持续时间(秒)
  bounceCount: 44500, // 跳出量
  bounceRate: 35.6,

  // 用户漏斗
  addToCartRate: 12.2, // 加购率 (22500/185000)
  checkoutCompletionRate: 2.3, // 完成结账率 (4200/185000)
  checkoutConversionRate: 48.0, // 结账转化率 (4200/8750)

  // 退货指标
  returns: 185, // 退货数
  returnAmount: 28500, // 退货金额
  returnRate: 4.8, // 退货数量比例 (185/3850)
  returnSalesRatio: 2.3, // 退货销售额占比 (28500/1250000)

  // 库存指标
  dailySoldUnits: 125, // 每日售出库存单位数
  remainingStockDays: 45, // 剩余库存天数
  inStockDays: 28, // 有货的天数
  outOfStockDays: 2, // 缺货的天数
  averageStockDays: 32, // 在库天数
  sellThroughRate: 78.5 // 售罄率
}

// 生成历史数据的辅助函数
function generateVariation(baseValue: number, variationPercent: number): number {
  const variation = (Math.random() - 0.5) * 2 * variationPercent / 100
  return Math.max(0, baseValue * (1 + variation))
}

// 生成上月数据
export const mockWebsiteDataPreviousMonth: WebsiteData = {
  // 结果指标 (上月数据，略低于当前)
  totalSales: generateVariation(mockWebsiteData.totalSales, 15), // 1,062,500
  totalCost: generateVariation(mockWebsiteData.totalCost, 12), // 253,800
  roi: generateVariation(mockWebsiteData.roi, 8), // 4.18
  averageOrderItems: generateVariation(mockWebsiteData.averageOrderItems, 5), // 2.19
  orderConversionCost: generateVariation(mockWebsiteData.orderConversionCost, 10), // 81.43
  averageOrderValue: generateVariation(mockWebsiteData.averageOrderValue, 8), // 299.51
  conversionRate: generateVariation(mockWebsiteData.conversionRate, 12), // 2.82
  storeVisits: generateVariation(mockWebsiteData.storeVisits, 18), // 102,500
  userVisitCost: generateVariation(mockWebsiteData.userVisitCost, 15), // 2.48

  // 订单指标
  orders: generateVariation(mockWebsiteData.orders, 20), // 3,157
  orderItemsPerOrder: generateVariation(mockWebsiteData.orderItemsPerOrder, 5), // 2.19
  ordersPerCustomer: generateVariation(mockWebsiteData.ordersPerCustomer, 8), // 1.66
  returningCustomerOrders: generateVariation(mockWebsiteData.returningCustomerOrders, 15), // 1,309
  newCustomerOrders: generateVariation(mockWebsiteData.newCustomerOrders, 25), // 1,848

  // 用户指标
  visitors: generateVariation(mockWebsiteData.visitors, 18), // 102,500
  visits: generateVariation(mockWebsiteData.visits, 20), // 148,000
  newUsers: generateVariation(mockWebsiteData.newUsers, 22), // 35,100
  returningUsers: generateVariation(mockWebsiteData.returningUsers, 15), // 68,000
  addToCartVisits: generateVariation(mockWebsiteData.addToCartVisits, 25), // 16,875
  reachCheckoutVisits: generateVariation(mockWebsiteData.reachCheckoutVisits, 30), // 6,125
  completeCheckoutVisits: generateVariation(mockWebsiteData.completeCheckoutVisits, 28), // 2,940
  completedCheckoutVisits: generateVariation(mockWebsiteData.completedCheckoutVisits, 20), // 3,080
  averageVisitDuration: generateVariation(mockWebsiteData.averageVisitDuration, 10), // 220
  bounceCount: generateVariation(mockWebsiteData.bounceCount, 15), // 37,825
  bounceRate: generateVariation(mockWebsiteData.bounceRate, 8), // 38.2

  // 用户漏斗
  addToCartRate: generateVariation(mockWebsiteData.addToCartRate, 15), // 11.4
  checkoutCompletionRate: generateVariation(mockWebsiteData.checkoutCompletionRate, 20), // 1.99
  checkoutConversionRate: generateVariation(mockWebsiteData.checkoutConversionRate, 12), // 48.0

  // 退货指标
  returns: generateVariation(mockWebsiteData.returns, 25), // 139
  returnAmount: generateVariation(mockWebsiteData.returnAmount, 30), // 19,950
  returnRate: generateVariation(mockWebsiteData.returnRate, 20), // 4.4
  returnSalesRatio: generateVariation(mockWebsiteData.returnSalesRatio, 25), // 1.88

  // 库存指标
  dailySoldUnits: generateVariation(mockWebsiteData.dailySoldUnits, 15), // 106
  remainingStockDays: generateVariation(mockWebsiteData.remainingStockDays, 20), // 36
  inStockDays: generateVariation(mockWebsiteData.inStockDays, 10), // 25
  outOfStockDays: generateVariation(mockWebsiteData.outOfStockDays, 50), // 3
  averageStockDays: generateVariation(mockWebsiteData.averageStockDays, 12), // 28
  sellThroughRate: generateVariation(mockWebsiteData.sellThroughRate, 8) // 72.3
}

// 生成上季度数据
export const mockWebsiteDataPreviousQuarter: WebsiteData = {
  // 结果指标 (上季度数据，明显低于当前)
  totalSales: generateVariation(mockWebsiteData.totalSales, 25), // 937,500
  totalCost: generateVariation(mockWebsiteData.totalCost, 20), // 228,000
  roi: generateVariation(mockWebsiteData.roi, 15), // 3.74
  averageOrderItems: generateVariation(mockWebsiteData.averageOrderItems, 8), // 2.12
  orderConversionCost: generateVariation(mockWebsiteData.orderConversionCost, 18), // 88.84
  averageOrderValue: generateVariation(mockWebsiteData.averageOrderValue, 12), // 285.31
  conversionRate: generateVariation(mockWebsiteData.conversionRate, 20), // 2.56
  storeVisits: generateVariation(mockWebsiteData.storeVisits, 30), // 87,500
  userVisitCost: generateVariation(mockWebsiteData.userVisitCost, 25), // 2.85

  // 订单指标
  orders: generateVariation(mockWebsiteData.orders, 35), // 2,502
  orderItemsPerOrder: generateVariation(mockWebsiteData.orderItemsPerOrder, 8), // 2.12
  ordersPerCustomer: generateVariation(mockWebsiteData.ordersPerCustomer, 12), // 1.59
  returningCustomerOrders: generateVariation(mockWebsiteData.returningCustomerOrders, 25), // 1,155
  newCustomerOrders: generateVariation(mockWebsiteData.newCustomerOrders, 40), // 1,347

  // 用户指标
  visitors: generateVariation(mockWebsiteData.visitors, 30), // 87,500
  visits: generateVariation(mockWebsiteData.visits, 35), // 120,250
  newUsers: generateVariation(mockWebsiteData.newUsers, 40), // 27,000
  returningUsers: generateVariation(mockWebsiteData.returningUsers, 25), // 60,000
  addToCartVisits: generateVariation(mockWebsiteData.addToCartVisits, 40), // 13,500
  reachCheckoutVisits: generateVariation(mockWebsiteData.reachCheckoutVisits, 45), // 4,812
  completeCheckoutVisits: generateVariation(mockWebsiteData.completeCheckoutVisits, 40), // 2,520
  completedCheckoutVisits: generateVariation(mockWebsiteData.completedCheckoutVisits, 35), // 2,502
  averageVisitDuration: generateVariation(mockWebsiteData.averageVisitDuration, 15), // 208
  bounceCount: generateVariation(mockWebsiteData.bounceCount, 25), // 33,375
  bounceRate: generateVariation(mockWebsiteData.bounceRate, 12), // 39.8

  // 用户漏斗
  addToCartRate: generateVariation(mockWebsiteData.addToCartRate, 25), // 9.15
  checkoutCompletionRate: generateVariation(mockWebsiteData.checkoutCompletionRate, 30), // 1.61
  checkoutConversionRate: generateVariation(mockWebsiteData.checkoutConversionRate, 20), // 38.4

  // 退货指标
  returns: generateVariation(mockWebsiteData.returns, 35), // 120
  returnAmount: generateVariation(mockWebsiteData.returnAmount, 40), // 17,100
  returnRate: generateVariation(mockWebsiteData.returnRate, 30), // 3.36
  returnSalesRatio: generateVariation(mockWebsiteData.returnSalesRatio, 35), // 1.50

  // 库存指标
  dailySoldUnits: generateVariation(mockWebsiteData.dailySoldUnits, 25), // 93
  remainingStockDays: generateVariation(mockWebsiteData.remainingStockDays, 30), // 31
  inStockDays: generateVariation(mockWebsiteData.inStockDays, 15), // 24
  outOfStockDays: generateVariation(mockWebsiteData.outOfStockDays, 100), // 4
  averageStockDays: generateVariation(mockWebsiteData.averageStockDays, 20), // 26
  sellThroughRate: generateVariation(mockWebsiteData.sellThroughRate, 15) // 66.7
}

// 计算期间比较数据的辅助函数
function calculatePeriodComparison(current: number, previous: number): PeriodComparison {
  const change = current - previous
  const changePercent = previous !== 0 ? (change / previous) * 100 : 0

  let trend: 'up' | 'down' | 'neutral' = 'neutral'
  if (Math.abs(changePercent) > 0.5) { // 变化超过0.5%才显示趋势
    trend = changePercent > 0 ? 'up' : 'down'
  }

  return {
    current,
    previous,
    change,
    changePercent,
    trend
  }
}

// 生成月度比较数据
export function generateMoMComparison(): WebsiteDataComparison {
  return {
    // 结果指标比较
    totalSales: calculatePeriodComparison(mockWebsiteData.totalSales, mockWebsiteDataPreviousMonth.totalSales),
    totalCost: calculatePeriodComparison(mockWebsiteData.totalCost, mockWebsiteDataPreviousMonth.totalCost),
    roi: calculatePeriodComparison(mockWebsiteData.roi, mockWebsiteDataPreviousMonth.roi),
    averageOrderItems: calculatePeriodComparison(mockWebsiteData.averageOrderItems, mockWebsiteDataPreviousMonth.averageOrderItems),
    orderConversionCost: calculatePeriodComparison(mockWebsiteData.orderConversionCost, mockWebsiteDataPreviousMonth.orderConversionCost),
    averageOrderValue: calculatePeriodComparison(mockWebsiteData.averageOrderValue, mockWebsiteDataPreviousMonth.averageOrderValue),
    conversionRate: calculatePeriodComparison(mockWebsiteData.conversionRate, mockWebsiteDataPreviousMonth.conversionRate),
    storeVisits: calculatePeriodComparison(mockWebsiteData.storeVisits, mockWebsiteDataPreviousMonth.storeVisits),
    userVisitCost: calculatePeriodComparison(mockWebsiteData.userVisitCost, mockWebsiteDataPreviousMonth.userVisitCost),

    // 订单指标比较
    orders: calculatePeriodComparison(mockWebsiteData.orders, mockWebsiteDataPreviousMonth.orders),
    orderItemsPerOrder: calculatePeriodComparison(mockWebsiteData.orderItemsPerOrder, mockWebsiteDataPreviousMonth.orderItemsPerOrder),
    ordersPerCustomer: calculatePeriodComparison(mockWebsiteData.ordersPerCustomer, mockWebsiteDataPreviousMonth.ordersPerCustomer),
    returningCustomerOrders: calculatePeriodComparison(mockWebsiteData.returningCustomerOrders, mockWebsiteDataPreviousMonth.returningCustomerOrders),
    newCustomerOrders: calculatePeriodComparison(mockWebsiteData.newCustomerOrders, mockWebsiteDataPreviousMonth.newCustomerOrders),

    // 用户指标比较
    visitors: calculatePeriodComparison(mockWebsiteData.visitors, mockWebsiteDataPreviousMonth.visitors),
    visits: calculatePeriodComparison(mockWebsiteData.visits, mockWebsiteDataPreviousMonth.visits),
    newUsers: calculatePeriodComparison(mockWebsiteData.newUsers, mockWebsiteDataPreviousMonth.newUsers),
    returningUsers: calculatePeriodComparison(mockWebsiteData.returningUsers, mockWebsiteDataPreviousMonth.returningUsers),
    addToCartVisits: calculatePeriodComparison(mockWebsiteData.addToCartVisits, mockWebsiteDataPreviousMonth.addToCartVisits),
    reachCheckoutVisits: calculatePeriodComparison(mockWebsiteData.reachCheckoutVisits, mockWebsiteDataPreviousMonth.reachCheckoutVisits),
    completeCheckoutVisits: calculatePeriodComparison(mockWebsiteData.completeCheckoutVisits, mockWebsiteDataPreviousMonth.completeCheckoutVisits),
    completedCheckoutVisits: calculatePeriodComparison(mockWebsiteData.completedCheckoutVisits, mockWebsiteDataPreviousMonth.completedCheckoutVisits),
    averageVisitDuration: calculatePeriodComparison(mockWebsiteData.averageVisitDuration, mockWebsiteDataPreviousMonth.averageVisitDuration),
    bounceCount: calculatePeriodComparison(mockWebsiteData.bounceCount, mockWebsiteDataPreviousMonth.bounceCount),
    bounceRate: calculatePeriodComparison(mockWebsiteData.bounceRate, mockWebsiteDataPreviousMonth.bounceRate),

    // 用户漏斗比较
    addToCartRate: calculatePeriodComparison(mockWebsiteData.addToCartRate, mockWebsiteDataPreviousMonth.addToCartRate),
    checkoutCompletionRate: calculatePeriodComparison(mockWebsiteData.checkoutCompletionRate, mockWebsiteDataPreviousMonth.checkoutCompletionRate),
    checkoutConversionRate: calculatePeriodComparison(mockWebsiteData.checkoutConversionRate, mockWebsiteDataPreviousMonth.checkoutConversionRate),

    // 退货指标比较
    returns: calculatePeriodComparison(mockWebsiteData.returns, mockWebsiteDataPreviousMonth.returns),
    returnAmount: calculatePeriodComparison(mockWebsiteData.returnAmount, mockWebsiteDataPreviousMonth.returnAmount),
    returnRate: calculatePeriodComparison(mockWebsiteData.returnRate, mockWebsiteDataPreviousMonth.returnRate),
    returnSalesRatio: calculatePeriodComparison(mockWebsiteData.returnSalesRatio, mockWebsiteDataPreviousMonth.returnSalesRatio),

    // 库存指标比较
    dailySoldUnits: calculatePeriodComparison(mockWebsiteData.dailySoldUnits, mockWebsiteDataPreviousMonth.dailySoldUnits),
    remainingStockDays: calculatePeriodComparison(mockWebsiteData.remainingStockDays, mockWebsiteDataPreviousMonth.remainingStockDays),
    inStockDays: calculatePeriodComparison(mockWebsiteData.inStockDays, mockWebsiteDataPreviousMonth.inStockDays),
    outOfStockDays: calculatePeriodComparison(mockWebsiteData.outOfStockDays, mockWebsiteDataPreviousMonth.outOfStockDays),
    averageStockDays: calculatePeriodComparison(mockWebsiteData.averageStockDays, mockWebsiteDataPreviousMonth.averageStockDays),
    sellThroughRate: calculatePeriodComparison(mockWebsiteData.sellThroughRate, mockWebsiteDataPreviousMonth.sellThroughRate)
  }
}

// 生成季度比较数据
export function generateQoQComparison(): WebsiteDataComparison {
  return {
    // 结果指标比较
    totalSales: calculatePeriodComparison(mockWebsiteData.totalSales, mockWebsiteDataPreviousQuarter.totalSales),
    totalCost: calculatePeriodComparison(mockWebsiteData.totalCost, mockWebsiteDataPreviousQuarter.totalCost),
    roi: calculatePeriodComparison(mockWebsiteData.roi, mockWebsiteDataPreviousQuarter.roi),
    averageOrderItems: calculatePeriodComparison(mockWebsiteData.averageOrderItems, mockWebsiteDataPreviousQuarter.averageOrderItems),
    orderConversionCost: calculatePeriodComparison(mockWebsiteData.orderConversionCost, mockWebsiteDataPreviousQuarter.orderConversionCost),
    averageOrderValue: calculatePeriodComparison(mockWebsiteData.averageOrderValue, mockWebsiteDataPreviousQuarter.averageOrderValue),
    conversionRate: calculatePeriodComparison(mockWebsiteData.conversionRate, mockWebsiteDataPreviousQuarter.conversionRate),
    storeVisits: calculatePeriodComparison(mockWebsiteData.storeVisits, mockWebsiteDataPreviousQuarter.storeVisits),
    userVisitCost: calculatePeriodComparison(mockWebsiteData.userVisitCost, mockWebsiteDataPreviousQuarter.userVisitCost),

    // 订单指标比较
    orders: calculatePeriodComparison(mockWebsiteData.orders, mockWebsiteDataPreviousQuarter.orders),
    orderItemsPerOrder: calculatePeriodComparison(mockWebsiteData.orderItemsPerOrder, mockWebsiteDataPreviousQuarter.orderItemsPerOrder),
    ordersPerCustomer: calculatePeriodComparison(mockWebsiteData.ordersPerCustomer, mockWebsiteDataPreviousQuarter.ordersPerCustomer),
    returningCustomerOrders: calculatePeriodComparison(mockWebsiteData.returningCustomerOrders, mockWebsiteDataPreviousQuarter.returningCustomerOrders),
    newCustomerOrders: calculatePeriodComparison(mockWebsiteData.newCustomerOrders, mockWebsiteDataPreviousQuarter.newCustomerOrders),

    // 用户指标比较
    visitors: calculatePeriodComparison(mockWebsiteData.visitors, mockWebsiteDataPreviousQuarter.visitors),
    visits: calculatePeriodComparison(mockWebsiteData.visits, mockWebsiteDataPreviousQuarter.visits),
    newUsers: calculatePeriodComparison(mockWebsiteData.newUsers, mockWebsiteDataPreviousQuarter.newUsers),
    returningUsers: calculatePeriodComparison(mockWebsiteData.returningUsers, mockWebsiteDataPreviousQuarter.returningUsers),
    addToCartVisits: calculatePeriodComparison(mockWebsiteData.addToCartVisits, mockWebsiteDataPreviousQuarter.addToCartVisits),
    reachCheckoutVisits: calculatePeriodComparison(mockWebsiteData.reachCheckoutVisits, mockWebsiteDataPreviousQuarter.reachCheckoutVisits),
    completeCheckoutVisits: calculatePeriodComparison(mockWebsiteData.completeCheckoutVisits, mockWebsiteDataPreviousQuarter.completeCheckoutVisits),
    completedCheckoutVisits: calculatePeriodComparison(mockWebsiteData.completedCheckoutVisits, mockWebsiteDataPreviousQuarter.completedCheckoutVisits),
    averageVisitDuration: calculatePeriodComparison(mockWebsiteData.averageVisitDuration, mockWebsiteDataPreviousQuarter.averageVisitDuration),
    bounceCount: calculatePeriodComparison(mockWebsiteData.bounceCount, mockWebsiteDataPreviousQuarter.bounceCount),
    bounceRate: calculatePeriodComparison(mockWebsiteData.bounceRate, mockWebsiteDataPreviousQuarter.bounceRate),

    // 用户漏斗比较
    addToCartRate: calculatePeriodComparison(mockWebsiteData.addToCartRate, mockWebsiteDataPreviousQuarter.addToCartRate),
    checkoutCompletionRate: calculatePeriodComparison(mockWebsiteData.checkoutCompletionRate, mockWebsiteDataPreviousQuarter.checkoutCompletionRate),
    checkoutConversionRate: calculatePeriodComparison(mockWebsiteData.checkoutConversionRate, mockWebsiteDataPreviousQuarter.checkoutConversionRate),

    // 退货指标比较
    returns: calculatePeriodComparison(mockWebsiteData.returns, mockWebsiteDataPreviousQuarter.returns),
    returnAmount: calculatePeriodComparison(mockWebsiteData.returnAmount, mockWebsiteDataPreviousQuarter.returnAmount),
    returnRate: calculatePeriodComparison(mockWebsiteData.returnRate, mockWebsiteDataPreviousQuarter.returnRate),
    returnSalesRatio: calculatePeriodComparison(mockWebsiteData.returnSalesRatio, mockWebsiteDataPreviousQuarter.returnSalesRatio),

    // 库存指标比较
    dailySoldUnits: calculatePeriodComparison(mockWebsiteData.dailySoldUnits, mockWebsiteDataPreviousQuarter.dailySoldUnits),
    remainingStockDays: calculatePeriodComparison(mockWebsiteData.remainingStockDays, mockWebsiteDataPreviousQuarter.remainingStockDays),
    inStockDays: calculatePeriodComparison(mockWebsiteData.inStockDays, mockWebsiteDataPreviousQuarter.inStockDays),
    outOfStockDays: calculatePeriodComparison(mockWebsiteData.outOfStockDays, mockWebsiteDataPreviousQuarter.outOfStockDays),
    averageStockDays: calculatePeriodComparison(mockWebsiteData.averageStockDays, mockWebsiteDataPreviousQuarter.averageStockDays),
    sellThroughRate: calculatePeriodComparison(mockWebsiteData.sellThroughRate, mockWebsiteDataPreviousQuarter.sellThroughRate)
  }
}

// 获取比较数据的函数
export function getWebsiteDataComparison(period: ComparisonPeriod = 'mom'): WebsiteDataComparison {
  return period === 'mom' ? generateMoMComparison() : generateQoQComparison()
}

// Mock活动数据
export const mockCampaigns: Campaign[] = [
  {
    id: 1,
    name: '春季新品促销',
    type: 'promotion',
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    budget: 50000,
    spent: 32000,
    revenue: 145000,
    roi: 4.5,
    impressions: 850000,
    clicks: 12500,
    conversions: 420
  },
  {
    id: 2,
    name: '新用户注册礼',
    type: 'acquisition',
    status: 'active',
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    budget: 30000,
    spent: 25000,
    revenue: 95000,
    roi: 3.8,
    impressions: 620000,
    clicks: 8900,
    conversions: 312
  },
  {
    id: 3,
    name: '年终大促',
    type: 'seasonal',
    status: 'completed',
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    budget: 80000,
    spent: 78000,
    revenue: 285000,
    roi: 3.7,
    impressions: 1200000,
    clicks: 18500,
    conversions: 850
  },
  {
    id: 4,
    name: '品牌推广',
    type: 'branding',
    status: 'paused',
    startDate: '2024-10-01',
    endDate: '2025-01-31',
    budget: 40000,
    spent: 15000,
    revenue: 35000,
    roi: 2.3,
    impressions: 950000,
    clicks: 5200,
    conversions: 125
  }
]

// Mock扩展活动数据
export const mockCampaignData: CampaignData[] = [
  {
    id: 1,
    name: '春季新品促销',
    type: 'promotion',
    status: 'active',
    stage: 'official',
    targetMarket: '北美市场',
    content: '春季新品上市，全场8折优惠，满$100免邮',
    channels: ['Google Ads', 'Facebook Ads', 'Email Marketing'],
    startDate: '2025-01-01',
    endDate: '2025-03-31',

    // 基础数据
    budget: 50000,
    spent: 32000,
    revenue: 145000,
    roi: 4.5,

    // 详细指标
    totalSales: 145000,
    totalCost: 32000,
    userCount: 8500,
    conversionRate: 3.36,
    averageOrderValue: 170.59,
    orderCount: 850,
    returnRate: 2.8,
    returnAmount: 4060,

    // 广告数据
    adSpend: 32000,
    adRevenue: 120000,
    adROI: 3.75,
    adRevenueRatio: 82.8,

    // 平台数据
    googleSpend: 15000,
    googleRevenue: 58000,
    googleROI: 3.87,
    facebookSpend: 12000,
    facebookRevenue: 45000,
    facebookROI: 3.75,
    bingSpend: 3000,
    bingRevenue: 10000,
    bingROI: 3.33,
    criteoSpend: 2000,
    criteoRevenue: 7000,
    criteoROI: 3.5
  },
  {
    id: 2,
    name: '新用户注册礼',
    type: 'acquisition',
    status: 'active',
    stage: 'official',
    targetMarket: '全球市场',
    content: '新用户注册即送$20优惠券，首单再享9折',
    channels: ['Google Ads', 'Facebook Ads', 'Pinterest'],
    startDate: '2024-12-01',
    endDate: '2025-02-28',

    // 基础数据
    budget: 30000,
    spent: 25000,
    revenue: 95000,
    roi: 3.8,

    // 详细指标
    totalSales: 95000,
    totalCost: 25000,
    userCount: 6200,
    conversionRate: 5.04,
    averageOrderValue: 152.42,
    orderCount: 623,
    returnRate: 1.9,
    returnAmount: 1805,

    // 广告数据
    adSpend: 25000,
    adRevenue: 85000,
    adROI: 3.4,
    adRevenueRatio: 89.5,

    // 平台数据
    googleSpend: 12000,
    googleRevenue: 40000,
    googleROI: 3.33,
    facebookSpend: 10000,
    facebookRevenue: 35000,
    facebookROI: 3.5,
    bingSpend: 2000,
    bingRevenue: 6000,
    bingROI: 3.0,
    criteoSpend: 1000,
    criteoRevenue: 4000,
    criteoROI: 4.0
  },
  {
    id: 3,
    name: '年终大促',
    type: 'seasonal',
    status: 'completed',
    stage: 'ended',
    targetMarket: '北美+欧洲',
    content: '年终大促销，全场最低5折，爆款商品限时抢购',
    channels: ['Google Ads', 'Facebook Ads', 'Email Marketing', 'Criteo'],
    startDate: '2024-11-01',
    endDate: '2024-12-31',

    // 基础数据
    budget: 80000,
    spent: 78000,
    revenue: 285000,
    roi: 3.7,

    // 详细指标
    totalSales: 285000,
    totalCost: 78000,
    userCount: 15200,
    conversionRate: 4.6,
    averageOrderValue: 195.89,
    orderCount: 1455,
    returnRate: 3.2,
    returnAmount: 9120,

    // 广告数据
    adSpend: 78000,
    adRevenue: 250000,
    adROI: 3.21,
    adRevenueRatio: 87.7,

    // 平台数据
    googleSpend: 35000,
    googleRevenue: 125000,
    googleROI: 3.57,
    facebookSpend: 25000,
    facebookRevenue: 85000,
    facebookROI: 3.4,
    bingSpend: 8000,
    bingRevenue: 20000,
    bingROI: 2.5,
    criteoSpend: 10000,
    criteoRevenue: 20000,
    criteoROI: 2.0
  },
  {
    id: 4,
    name: '品牌推广',
    type: 'branding',
    status: 'paused',
    stage: 'warmup',
    targetMarket: '高端市场',
    content: '品牌形象推广，提升品牌知名度和用户认知',
    channels: ['Google Ads', 'Facebook Ads'],
    startDate: '2024-10-01',
    endDate: '2025-01-31',

    // 基础数据
    budget: 40000,
    spent: 15000,
    revenue: 35000,
    roi: 2.3,

    // 详细指标
    totalSales: 35000,
    totalCost: 15000,
    userCount: 2800,
    conversionRate: 4.46,
    averageOrderValue: 280.0,
    orderCount: 125,
    returnRate: 1.6,
    returnAmount: 560,

    // 广告数据
    adSpend: 15000,
    adRevenue: 30000,
    adROI: 2.0,
    adRevenueRatio: 85.7,

    // 平台数据
    googleSpend: 8000,
    googleRevenue: 18000,
    googleROI: 2.25,
    facebookSpend: 7000,
    facebookRevenue: 12000,
    facebookROI: 1.71
  },
  {
    id: 5,
    name: '夏季清仓',
    type: 'seasonal',
    status: 'draft',
    stage: 'preparation',
    targetMarket: '全球市场',
    content: '夏季库存清仓，精选商品低至3折',
    channels: ['Google Ads', 'Facebook Ads', 'Email Marketing'],
    startDate: '2025-06-01',
    endDate: '2025-08-31',

    // 基础数据
    budget: 60000,
    spent: 0,
    revenue: 0,
    roi: 0,

    // 详细指标
    totalSales: 0,
    totalCost: 0,
    userCount: 0,
    conversionRate: 0,
    averageOrderValue: 0,
    orderCount: 0,
    returnRate: 0,
    returnAmount: 0,

    // 广告数据
    adSpend: 0,
    adRevenue: 0,
    adROI: 0,
    adRevenueRatio: 0
  }
]

// Mock活动单日数据
export const mockCampaignDailyData: CampaignDailyData[] = [
  {
    date: '2025-01-07',
    campaignId: 1,
    totalRevenue: 4800,
    totalAdSpend: 1200,
    totalROI: 4.0,
    orderCount: 28,
    averageOrderValue: 171.43,
    adRevenue: 4000,
    adROI: 3.33,
    adRevenueRatio: 83.3,
    platforms: {
      google: { spend: 600, revenue: 2000, roi: 3.33 },
      facebook: { spend: 400, revenue: 1500, roi: 3.75 },
      bing: { spend: 120, revenue: 300, roi: 2.5 },
      criteo: { spend: 80, revenue: 200, roi: 2.5 }
    }
  },
  {
    date: '2025-01-06',
    campaignId: 1,
    totalRevenue: 5200,
    totalAdSpend: 1100,
    totalROI: 4.73,
    orderCount: 31,
    averageOrderValue: 167.74,
    adRevenue: 4500,
    adROI: 4.09,
    adRevenueRatio: 86.5,
    platforms: {
      google: { spend: 550, revenue: 2200, roi: 4.0 },
      facebook: { spend: 350, revenue: 1600, roi: 4.57 },
      bing: { spend: 110, revenue: 400, roi: 3.64 },
      criteo: { spend: 90, revenue: 300, roi: 3.33 }
    }
  },
  {
    date: '2025-01-05',
    campaignId: 1,
    totalRevenue: 4600,
    totalAdSpend: 1050,
    totalROI: 4.38,
    orderCount: 26,
    averageOrderValue: 176.92,
    adRevenue: 3800,
    adROI: 3.62,
    adRevenueRatio: 82.6,
    platforms: {
      google: { spend: 525, revenue: 1900, roi: 3.62 },
      facebook: { spend: 315, revenue: 1400, roi: 4.44 },
      bing: { spend: 105, revenue: 300, roi: 2.86 },
      criteo: { spend: 105, revenue: 200, roi: 1.90 }
    }
  }
]

// Mock活动汇总数据
export const mockCampaignSummary: CampaignSummary = {
  totalCampaigns: 5,
  activeCampaigns: 2,
  totalBudget: 260000,
  totalSpent: 150000,
  totalRevenue: 560000,
  averageROI: 3.73,
  topPerformingCampaign: '春季新品促销',
  totalConversions: 2390
}

// Mock产品销售数据
export const mockProductSales: ProductSales[] = [
  {
    id: 1,
    name: '时尚T恤',
    category: '服装',
    price: 29.99,
    soldQuantity: 1250,
    revenue: 37487.5,
    profit: 18743.75,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=300&fit=crop'
  },
  {
    id: 2,
    name: '运动鞋',
    category: '鞋类',
    price: 89.99,
    soldQuantity: 850,
    revenue: 76491.5,
    profit: 30596.6,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop'
  },
  {
    id: 3,
    name: '智能手表',
    category: '电子产品',
    price: 199.99,
    soldQuantity: 420,
    revenue: 83996.0,
    profit: 25199.0,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop'
  },
  {
    id: 4,
    name: '护肤套装',
    category: '美容',
    price: 149.99,
    soldQuantity: 680,
    revenue: 101993.2,
    profit: 40797.28,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=300&fit=crop'
  },
  {
    id: 5,
    name: '咖啡机',
    category: '家电',
    price: 299.99,
    soldQuantity: 320,
    revenue: 95996.8,
    profit: 28799.04,
    stock: 80,
    image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop'
  }
]

// Mock扩展产品销售数据
export const mockProductSalesData: ProductSalesData[] = [
  {
    id: 1,
    sku: 'TSH-001',
    name: '时尚T恤',
    category: '服装',
    price: 29.99,

    // 销量排名数据
    grossSales: 39000,
    totalSales: 37487.5,
    salesRatio: 15.2,
    netSoldQuantity: 1250,
    averageOrderAmount: 59.98,
    quantityPerOrder: 2.0,
    refundAmount: 1512.5,
    refundQuantity: 50,
    stockStatus: 'in_stock',
    stockoutLoss: 0,

    // 流量指标
    visitors: 25000,
    visits: 35000,
    newUsers: 15000,
    returningUsers: 10000,
    addToCartVisits: 8750,
    checkoutVisits: 3500,

    // 转化率指标
    addToCartRate: 25.0,
    checkoutRate: 10.0,
    purchaseRate: 5.0,

    // 其他指标
    viewToCartRate: 35.0,
    cartToCheckoutRate: 40.0,
    averageViewTime: 180,
    bounceRate: 45.0,

    lastUpdated: '2025-01-07T10:30:00Z'
  },
  {
    id: 2,
    sku: 'SHO-002',
    name: '运动鞋',
    category: '鞋类',
    price: 89.99,

    // 销量排名数据
    grossSales: 80000,
    totalSales: 76491.5,
    salesRatio: 31.0,
    netSoldQuantity: 850,
    averageOrderAmount: 89.99,
    quantityPerOrder: 1.0,
    refundAmount: 3508.5,
    refundQuantity: 39,
    stockStatus: 'low_stock',
    stockoutLoss: 4500,

    // 流量指标
    visitors: 18000,
    visits: 28000,
    newUsers: 12000,
    returningUsers: 6000,
    addToCartVisits: 5600,
    checkoutVisits: 2800,

    // 转化率指标
    addToCartRate: 20.0,
    checkoutRate: 10.0,
    purchaseRate: 4.7,

    // 其他指标
    viewToCartRate: 31.1,
    cartToCheckoutRate: 50.0,
    averageViewTime: 240,
    bounceRate: 38.0,

    lastUpdated: '2025-01-07T10:30:00Z'
  },
  {
    id: 3,
    sku: 'WAT-003',
    name: '智能手表',
    category: '电子产品',
    price: 199.99,

    // 销量排名数据
    grossSales: 88000,
    totalSales: 83996.0,
    salesRatio: 34.0,
    netSoldQuantity: 420,
    averageOrderAmount: 199.99,
    quantityPerOrder: 1.0,
    refundAmount: 4004.0,
    refundQuantity: 20,
    stockStatus: 'out_of_stock',
    stockoutLoss: 12000,

    // 流量指标
    visitors: 12000,
    visits: 20000,
    newUsers: 8000,
    returningUsers: 4000,
    addToCartVisits: 3000,
    checkoutVisits: 1500,

    // 转化率指标
    addToCartRate: 15.0,
    checkoutRate: 7.5,
    purchaseRate: 3.5,

    // 其他指标
    viewToCartRate: 25.0,
    cartToCheckoutRate: 50.0,
    averageViewTime: 320,
    bounceRate: 42.0,

    lastUpdated: '2025-01-07T10:30:00Z'
  },
  {
    id: 4,
    sku: 'COS-004',
    name: '护肤套装',
    category: '美容',
    price: 149.99,

    // 销量排名数据
    grossSales: 105000,
    totalSales: 101993.2,
    salesRatio: 41.3,
    netSoldQuantity: 680,
    averageOrderAmount: 149.99,
    quantityPerOrder: 1.0,
    refundAmount: 3006.8,
    refundQuantity: 20,
    stockStatus: 'low_stock',
    stockoutLoss: 2250,

    // 流量指标
    visitors: 15000,
    visits: 22000,
    newUsers: 9000,
    returningUsers: 6000,
    addToCartVisits: 4400,
    checkoutVisits: 2200,

    // 转化率指标
    addToCartRate: 20.0,
    checkoutRate: 10.0,
    purchaseRate: 4.5,

    // 其他指标
    viewToCartRate: 29.3,
    cartToCheckoutRate: 50.0,
    averageViewTime: 280,
    bounceRate: 35.0,

    lastUpdated: '2025-01-07T10:30:00Z'
  },
  {
    id: 5,
    sku: 'COF-005',
    name: '咖啡机',
    category: '家电',
    price: 299.99,

    // 销量排名数据
    grossSales: 98000,
    totalSales: 95996.8,
    salesRatio: 38.9,
    netSoldQuantity: 320,
    averageOrderAmount: 299.99,
    quantityPerOrder: 1.0,
    refundAmount: 2003.2,
    refundQuantity: 7,
    stockStatus: 'in_stock',
    stockoutLoss: 0,

    // 流量指标
    visitors: 8000,
    visits: 14000,
    newUsers: 5000,
    returningUsers: 3000,
    addToCartVisits: 2800,
    checkoutVisits: 1400,

    // 转化率指标
    addToCartRate: 20.0,
    checkoutRate: 10.0,
    purchaseRate: 4.0,

    // 其他指标
    viewToCartRate: 35.0,
    cartToCheckoutRate: 50.0,
    averageViewTime: 360,
    bounceRate: 40.0,

    lastUpdated: '2025-01-07T10:30:00Z'
  },
  {
    id: 6,
    sku: 'BAG-006',
    name: '时尚背包',
    category: '箱包',
    price: 79.99,

    // 销量排名数据
    grossSales: 52000,
    totalSales: 49595.0,
    salesRatio: 20.1,
    netSoldQuantity: 620,
    averageOrderAmount: 79.99,
    quantityPerOrder: 1.0,
    refundAmount: 2405.0,
    refundQuantity: 30,
    stockStatus: 'in_stock',
    stockoutLoss: 0,

    // 流量指标
    visitors: 14000,
    visits: 21000,
    newUsers: 8500,
    returningUsers: 5500,
    addToCartVisits: 4200,
    checkoutVisits: 2100,

    // 转化率指标
    addToCartRate: 20.0,
    checkoutRate: 10.0,
    purchaseRate: 4.4,

    // 其他指标
    viewToCartRate: 30.0,
    cartToCheckoutRate: 50.0,
    averageViewTime: 200,
    bounceRate: 43.0,

    lastUpdated: '2025-01-07T10:30:00Z'
  }
]

// Mock产品销售排名数据
export const mockProductRanking: ProductRanking = {
  type: 'category',
  products: mockProductSalesData,
  totalProducts: 6,
  totalRevenue: 445564.0,
  averageOrderValue: 145.67
}

// Mock产品销售汇总数据
export const mockProductSalesSummary: ProductSalesSummary = {
  totalProducts: 6,
  totalRevenue: 445564.0,
  totalOrders: 3060,
  averageOrderValue: 145.67,
  topSellingProduct: '护肤套装',
  topCategory: '美容',
  totalRefunds: 16439.0,
  averageConversionRate: 4.3
}

// Mock预警数据
export const mockAlerts: Alert[] = [
  // 账户余额提醒
  {
    id: 1,
    type: 'balance',
    level: 'high',
    title: '账户余额不足',
    message: 'Google Ads账户余额低于$1000，预计2天后余额不足',
    customerId: 1,
    customerName: 'Fashion Store USA',
    createdAt: '2025-01-07 09:30:00',
    isRead: false
  },
  {
    id: 2,
    type: 'balance',
    level: 'critical',
    title: 'Meta广告账户余额告急',
    message: 'Facebook Ads账户余额仅剩$500，预计今日余额不足，请立即充值',
    customerId: 2,
    customerName: 'Tech Gadgets Pro',
    createdAt: '2025-01-07 10:15:00',
    isRead: false
  },

  // 服务预期提醒
  {
    id: 3,
    type: 'service',
    level: 'medium',
    title: '服务合同即将到期',
    message: 'Beauty Cosmetics服务合同将于15天后到期，请及时续约',
    customerId: 3,
    customerName: 'Beauty Cosmetics',
    createdAt: '2025-01-06 16:45:00',
    isRead: true
  },
  {
    id: 4,
    type: 'service',
    level: 'high',
    title: '服务合同到期提醒',
    message: 'Sports Equipment服务合同将于7天后到期，续约状态：待确认',
    customerId: 4,
    customerName: 'Sports Equipment',
    createdAt: '2025-01-07 08:00:00',
    isRead: false
  },
  {
    id: 5,
    type: 'service',
    level: 'critical',
    title: '服务合同已到期',
    message: 'Home Decoration服务合同已到期3天，请立即联系客户续约',
    customerId: 5,
    customerName: 'Home Decoration',
    createdAt: '2025-01-04 12:00:00',
    isRead: false
  },

  // 价格变动提醒
  {
    id: 6,
    type: 'price',
    level: 'medium',
    title: '产品价格上涨',
    message: '智能手表价格上涨8%，当前价格$199.99，建议调整广告策略',
    customerId: 2,
    customerName: 'Tech Gadgets Pro',
    createdAt: '2025-01-06 14:20:00',
    isRead: true
  },
  {
    id: 7,
    type: 'price',
    level: 'high',
    title: '竞品价格大幅变动',
    message: '竞品护肤套装价格下降15%，建议评估价格策略',
    customerId: 3,
    customerName: 'Beauty Cosmetics',
    createdAt: '2025-01-07 11:30:00',
    isRead: false
  },

  // 缺货提醒
  {
    id: 8,
    type: 'stock',
    level: 'critical',
    title: '库存告急',
    message: '运动鞋库存仅剩120件，低于安全库存阈值，建议立即补货',
    customerId: 2,
    customerName: 'Tech Gadgets Pro',
    createdAt: '2025-01-07 08:15:00',
    isRead: false
  },
  {
    id: 9,
    type: 'stock',
    level: 'critical',
    title: '产品缺货',
    message: '家用咖啡机库存为0，预计影响销售额$15,000，补货时间：预计3天',
    customerId: 5,
    customerName: 'Home Decoration',
    createdAt: '2025-01-07 07:45:00',
    isRead: false
  },
  {
    id: 10,
    type: 'stock',
    level: 'high',
    title: '库存不足预警',
    message: '智能手表库存85件，低于安全库存阈值100件，预计7天后缺货',
    customerId: 2,
    customerName: 'Tech Gadgets Pro',
    createdAt: '2025-01-06 15:30:00',
    isRead: true
  }
]

// Mock图表数据
export const mockChartData = {
  // 收入趋势
  revenue: {
    labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
    datasets: [{
      label: '收入',
      data: [85000, 95000, 120000, 135000, 142000, 158000],
      backgroundColor: 'rgba(24, 144, 255, 0.1)',
      borderColor: '#1890ff'
    }]
  },
  // 渠道分布
  channels: {
    labels: ['Google Ads', 'Facebook Ads', 'Direct', 'Email', 'Criteo', 'Bing'],
    datasets: [{
      label: '收入分布',
      data: [245000, 180000, 95000, 65000, 42000, 28000],
      backgroundColor: [
        '#1890ff',
        '#52c41a',
        '#faad14',
        '#f5222d',
        '#722ed1',
        '#fa8c16'
      ]
    }]
  },
  // 用户转化漏斗
  funnel: {
    labels: ['访问', '加购', '结账', '支付'],
    datasets: [{
      label: '用户数',
      data: [125000, 45000, 8500, 3850],
      backgroundColor: 'rgba(82, 196, 26, 0.8)'
    }]
  }
}

// Mock API函数
export const mockGetDashboardData = (): Promise<ApiResponse<{
  customers: Customer[]
  channels: Channel[]
  websiteData: WebsiteData
  campaigns: Campaign[]
  productSales: ProductSales[]
  alerts: Alert[]
  chartData: typeof mockChartData
}>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: {
          customers: mockCustomers,
          channels: mockChannels,
          websiteData: mockWebsiteData,
          campaigns: mockCampaigns,
          productSales: mockProductSales,
          alerts: mockAlerts,
          chartData: mockChartData
        }
      })
    }, 1000)
  })
}

// Mock获取客户列表 - 已移至 customer.ts 避免重复导出

// Mock获取渠道数据
export const mockGetChannels = (): Promise<ApiResponse<Channel[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockChannels
      })
    }, 600)
  })
}

// Mock获取预警数据
export const mockGetAlerts = (): Promise<ApiResponse<Alert[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockAlerts
      })
    }, 400)
  })
}

// Mock标记预警为已读
export const mockMarkAlertAsRead = (alertId: number): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const alert = mockAlerts.find(a => a.id === alertId)
      if (alert) {
        alert.isRead = true
        resolve({
          success: true,
          message: '预警已标记为已读'
        })
      } else {
        resolve({
          success: false,
          message: '预警不存在'
        })
      }
    }, 300)
  })
}

// 获取渠道数据
export const mockGetChannelData = (): Promise<ApiResponse<ChannelData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockChannelData,
        message: '获取渠道数据成功'
      })
    }, 500)
  })
}

// 获取渠道数据汇总
export const mockGetChannelSummary = (): Promise<ApiResponse<ChannelSummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockChannelSummary,
        message: '获取渠道汇总数据成功'
      })
    }, 300)
  })
}

// 获取单个渠道详情
export const mockGetChannelDetails = (channelId: number): Promise<ApiResponse<ChannelData>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const channel = mockChannelData.find(c => c.id === channelId)
      if (channel) {
        resolve({
          success: true,
          data: channel,
          message: '获取渠道详情成功'
        })
      } else {
        resolve({
          success: false,
          message: '渠道不存在'
        })
      }
    }, 300)
  })
}

// 获取渠道数据维度配置
export const mockGetChannelDimensions = (): Promise<ApiResponse<ChannelDimension[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockChannelDimensions,
        message: '获取渠道维度配置成功'
      })
    }, 300)
  })
}

// 更新渠道数据维度配置
export const mockUpdateChannelDimensions = (dimensions: ChannelDimension[]): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 更新mock数据中的维度配置
      dimensions.forEach(newDim => {
        const existingDim = mockChannelDimensions.find(d => d.id === newDim.id)
        if (existingDim) {
          existingDim.selected = newDim.selected
        }
      })

      resolve({
        success: true,
        message: '更新渠道维度配置成功'
      })
    }, 300)
  })
}

// 获取自定义渠道数据
export const mockGetCustomChannelData = (selectedDimensions: string[]): Promise<ApiResponse<any[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 根据选择的维度过滤数据
      const customData = mockChannelData.map(channel => {
        const filteredChannel: any = { id: channel.id, name: channel.name }

        selectedDimensions.forEach(dimId => {
          if (dimId in channel) {
            filteredChannel[dimId] = (channel as any)[dimId]
          }
        })

        return filteredChannel
      })

      resolve({
        success: true,
        data: customData,
        message: '获取自定义渠道数据成功'
      })
    }, 400)
  })
}

// 获取活动数据
export const mockGetCampaignData = (): Promise<ApiResponse<CampaignData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockCampaignData,
        message: '获取活动数据成功'
      })
    }, 500)
  })
}

// 获取活动汇总数据
export const mockGetCampaignSummary = (): Promise<ApiResponse<CampaignSummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockCampaignSummary,
        message: '获取活动汇总数据成功'
      })
    }, 300)
  })
}

// 获取单个活动详情
export const mockGetCampaignDetails = (campaignId: number): Promise<ApiResponse<CampaignData>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const campaign = mockCampaignData.find(c => c.id === campaignId)
      if (campaign) {
        resolve({
          success: true,
          data: campaign,
          message: '获取活动详情成功'
        })
      } else {
        resolve({
          success: false,
          message: '活动不存在'
        })
      }
    }, 300)
  })
}

// 获取活动单日数据
export const mockGetCampaignDailyData = (campaignId: number): Promise<ApiResponse<CampaignDailyData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dailyData = mockCampaignDailyData.filter(d => d.campaignId === campaignId)
      resolve({
        success: true,
        data: dailyData,
        message: '获取活动单日数据成功'
      })
    }, 400)
  })
}

// 获取所有活动列表（分页）
export const mockGetAllCampaigns = (page: number = 1, pageSize: number = 10): Promise<ApiResponse<{
  campaigns: CampaignData[]
  total: number
  page: number
  pageSize: number
}>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const start = (page - 1) * pageSize
      const end = start + pageSize
      const campaigns = mockCampaignData.slice(start, end)

      resolve({
        success: true,
        data: {
          campaigns,
          total: mockCampaignData.length,
          page,
          pageSize
        },
        message: '获取活动列表成功'
      })
    }, 500)
  })
}

// 产品销售数据API函数
export const mockGetProductSalesData = (): Promise<ApiResponse<ProductSalesData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockProductSalesData,
        message: '获取产品销售数据成功'
      })
    }, 300)
  })
}

export const mockGetProductSalesSummary = (): Promise<ApiResponse<ProductSalesSummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const summary: ProductSalesSummary = {
        totalProducts: mockProductSalesData.length,
        totalRevenue: mockProductSalesData.reduce((sum, product) => sum + product.grossSales, 0),
        totalOrders: mockProductSalesData.reduce((sum, product) => sum + product.netSoldQuantity, 0),
        averageOrderValue: mockProductSalesData.reduce((sum, product) => sum + product.averageOrderAmount, 0) / mockProductSalesData.length,
        topSellingProduct: mockProductSalesData[0].name,
        topCategory: mockProductSalesData[0].category,
        totalRefunds: mockProductSalesData.reduce((sum, product) => sum + product.refundAmount, 0),
        averageConversionRate: mockProductSalesData.reduce((sum, product) => sum + product.purchaseRate, 0) / mockProductSalesData.length
      }

      resolve({
        success: true,
        data: summary,
        message: '获取产品销售汇总数据成功'
      })
    }, 300)
  })
}

export const mockGetProductDetails = (productId: number): Promise<ApiResponse<ProductSalesData | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const product = mockProductSalesData.find(p => p.id === productId)
      if (product) {
        resolve({
          success: true,
          data: product,
          message: '获取产品详情成功'
        })
      } else {
        resolve({
          success: false,
          data: null,
          message: '产品不存在'
        })
      }
    }, 300)
  })
}

export const mockGetProductsByCategory = (category: string): Promise<ApiResponse<ProductSalesData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const products = mockProductSalesData.filter(p => p.category === category)
      resolve({
        success: true,
        data: products,
        message: '获取分类产品数据成功'
      })
    }, 300)
  })
}

export const mockGetTopProducts = (limit: number = 10, sortBy: string = 'grossSales'): Promise<ApiResponse<ProductSalesData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sortedProducts = [...mockProductSalesData].sort((a, b) => {
        const aValue = a[sortBy as keyof ProductSalesData] as number
        const bValue = b[sortBy as keyof ProductSalesData] as number
        return bValue - aValue
      }).slice(0, limit)

      resolve({
        success: true,
        data: sortedProducts,
        message: '获取热门产品数据成功'
      })
    }, 300)
  })
}

// 红人数据
export const mockKOLData: KOLData[] = [
  {
    id: 1,
    name: 'Emma Fashion',
    platform: 'instagram',
    avatar: '/avatars/emma-fashion.jpg',
    verified: true,
    category: '时尚',
    location: '纽约',
    language: '英语',
    followers: 1250000,
    followersGrowth: 12.5,
    avgViews: 85000,
    avgLikes: 45000,
    avgComments: 2800,
    avgShares: 1200,
    engagementRate: 3.8,
    reachRate: 68.5,
    impressions: 2850000,
    collaborationCount: 15,
    totalSpent: 125000,
    totalRevenue: 485000,
    roi: 3.88,
    postsCount: 156,
    videosCount: 45,
    storiesCount: 289,
    status: 'active',
    lastActiveDate: '2025-01-08',
    joinDate: '2023-06-15'
  },
  {
    id: 2,
    name: 'Tech Reviewer Pro',
    platform: 'youtube',
    avatar: '/avatars/tech-reviewer.jpg',
    verified: true,
    category: '科技',
    location: '加州',
    language: '英语',
    followers: 890000,
    followersGrowth: 8.2,
    avgViews: 125000,
    avgLikes: 8500,
    avgComments: 1200,
    avgShares: 850,
    engagementRate: 8.1,
    reachRate: 72.3,
    impressions: 1850000,
    collaborationCount: 12,
    totalSpent: 95000,
    totalRevenue: 380000,
    roi: 4.0,
    postsCount: 89,
    videosCount: 89,
    storiesCount: 0,
    status: 'active',
    lastActiveDate: '2025-01-09',
    joinDate: '2023-03-20'
  },
  {
    id: 3,
    name: 'Beauty Guru',
    platform: 'tiktok',
    avatar: '/avatars/beauty-guru.jpg',
    verified: true,
    category: '美妆',
    location: '洛杉矶',
    language: '英语',
    followers: 2100000,
    followersGrowth: 18.7,
    avgViews: 185000,
    avgLikes: 95000,
    avgComments: 4200,
    avgShares: 2800,
    engagementRate: 4.9,
    reachRate: 65.8,
    impressions: 4200000,
    collaborationCount: 22,
    totalSpent: 185000,
    totalRevenue: 720000,
    roi: 3.89,
    postsCount: 234,
    videosCount: 234,
    storiesCount: 0,
    status: 'active',
    lastActiveDate: '2025-01-09',
    joinDate: '2023-01-10'
  },
  {
    id: 4,
    name: 'Lifestyle Blogger',
    platform: 'instagram',
    avatar: '/avatars/lifestyle-blogger.jpg',
    verified: false,
    category: '生活',
    location: '伦敦',
    language: '英语',
    followers: 650000,
    followersGrowth: 6.3,
    avgViews: 45000,
    avgLikes: 28000,
    avgComments: 1800,
    avgShares: 750,
    engagementRate: 4.7,
    reachRate: 58.2,
    impressions: 1650000,
    collaborationCount: 8,
    totalSpent: 65000,
    totalRevenue: 245000,
    roi: 3.77,
    postsCount: 198,
    videosCount: 32,
    storiesCount: 445,
    status: 'active',
    lastActiveDate: '2025-01-08',
    joinDate: '2023-08-05'
  },
  {
    id: 5,
    name: 'Fitness Coach',
    platform: 'instagram',
    avatar: '/avatars/fitness-coach.jpg',
    verified: true,
    category: '健身',
    location: '迈阿密',
    language: '英语',
    followers: 980000,
    followersGrowth: 10.1,
    avgViews: 65000,
    avgLikes: 42000,
    avgComments: 2100,
    avgShares: 980,
    engagementRate: 4.6,
    reachRate: 62.4,
    impressions: 2100000,
    collaborationCount: 18,
    totalSpent: 145000,
    totalRevenue: 520000,
    roi: 3.59,
    postsCount: 267,
    videosCount: 89,
    storiesCount: 356,
    status: 'active',
    lastActiveDate: '2025-01-09',
    joinDate: '2023-04-12'
  },
  {
    id: 6,
    name: 'Gaming Streamer',
    platform: 'youtube',
    avatar: '/avatars/gaming-streamer.jpg',
    verified: true,
    category: '游戏',
    location: '东京',
    language: '日语',
    followers: 1450000,
    followersGrowth: 15.3,
    avgViews: 285000,
    avgLikes: 18500,
    avgComments: 3200,
    avgShares: 1850,
    engagementRate: 8.2,
    reachRate: 78.5,
    impressions: 3850000,
    collaborationCount: 25,
    totalSpent: 220000,
    totalRevenue: 890000,
    roi: 4.05,
    postsCount: 145,
    videosCount: 145,
    storiesCount: 0,
    status: 'active',
    lastActiveDate: '2025-01-09',
    joinDate: '2023-02-28'
  }
]

// 帖子数据
export const mockPostData: PostData[] = [
  {
    id: 1,
    kolId: 1,
    kolName: 'Emma Fashion',
    kolAvatar: '/avatars/emma-fashion.jpg',
    platform: 'instagram',
    title: '春季时尚搭配指南',
    content: '分享我最爱的春季时尚搭配，简约而不失优雅 #春季时尚 #搭配指南',
    type: 'image',
    thumbnail: '/posts/spring-fashion.jpg',
    url: 'https://instagram.com/p/spring-fashion-guide',
    publishDate: '2025-01-08T10:30:00Z',
    status: 'published',
    views: 125000,
    likes: 8500,
    comments: 450,
    shares: 320,
    saves: 1200,
    engagementRate: 8.2,
    reachRate: 72.5,
    impressions: 185000,
    isSponsored: true,
    campaignId: 1,
    campaignName: '春季新品促销',
    cost: 5000,
    revenue: 18500,
    conversions: 85,
    clicks: 2800,
    ctr: 2.24,
    hashtags: ['#春季时尚', '#搭配指南', '#时尚博主'],
    mentions: ['@fashionbrand', '@springcollection'],
    topCountries: [
      { country: '美国', percentage: 45.2 },
      { country: '加拿大', percentage: 18.7 },
      { country: '英国', percentage: 12.3 }
    ],
    topCities: [
      { city: '纽约', percentage: 28.5 },
      { city: '洛杉矶', percentage: 16.8 },
      { city: '芝加哥', percentage: 8.9 }
    ],
    audienceAge: [
      { range: '18-24', percentage: 32.5 },
      { range: '25-34', percentage: 41.8 },
      { range: '35-44', percentage: 18.2 }
    ],
    audienceGender: [
      { gender: '女性', percentage: 78.5 },
      { gender: '男性', percentage: 21.5 }
    ]
  },
  {
    id: 2,
    kolId: 2,
    kolName: 'Tech Reviewer Pro',
    kolAvatar: '/avatars/tech-reviewer.jpg',
    platform: 'youtube',
    title: 'iPhone 15 Pro 深度评测',
    content: '全面评测iPhone 15 Pro的性能、相机、续航等各方面表现',
    type: 'video',
    thumbnail: '/posts/iphone-15-review.jpg',
    url: 'https://youtube.com/watch?v=iphone-15-review',
    publishDate: '2025-01-07T14:00:00Z',
    status: 'published',
    views: 285000,
    likes: 18500,
    comments: 2850,
    shares: 1200,
    saves: 3200,
    engagementRate: 9.1,
    reachRate: 78.3,
    impressions: 365000,
    isSponsored: false,
    cost: 0,
    revenue: 12500,
    conversions: 125,
    clicks: 8500,
    ctr: 2.98,
    hashtags: ['#iPhone15Pro', '#科技评测', '#苹果'],
    mentions: ['@apple', '@techreview'],
    topCountries: [
      { country: '美国', percentage: 52.1 },
      { country: '印度', percentage: 15.8 },
      { country: '德国', percentage: 8.9 }
    ],
    topCities: [
      { city: '旧金山', percentage: 22.3 },
      { city: '纽约', percentage: 18.5 },
      { city: '洛杉矶', percentage: 11.7 }
    ],
    audienceAge: [
      { range: '18-24', percentage: 28.5 },
      { range: '25-34', percentage: 45.2 },
      { range: '35-44', percentage: 20.8 }
    ],
    audienceGender: [
      { gender: '男性', percentage: 68.5 },
      { gender: '女性', percentage: 31.5 }
    ]
  },
  {
    id: 3,
    kolId: 3,
    kolName: 'Beauty Guru',
    kolAvatar: '/avatars/beauty-guru.jpg',
    platform: 'tiktok',
    title: '5分钟完美妆容',
    content: '教你如何在5分钟内完成完美的日常妆容 ✨',
    type: 'video',
    thumbnail: '/posts/5min-makeup.jpg',
    url: 'https://tiktok.com/@beautyguru/5min-makeup',
    publishDate: '2025-01-09T09:15:00Z',
    status: 'published',
    views: 485000,
    likes: 45000,
    comments: 3200,
    shares: 8500,
    saves: 12000,
    engagementRate: 14.2,
    reachRate: 85.7,
    impressions: 565000,
    isSponsored: true,
    campaignId: 2,
    campaignName: '新用户注册礼',
    cost: 8000,
    revenue: 32500,
    conversions: 185,
    clicks: 15000,
    ctr: 3.09,
    hashtags: ['#5分钟妆容', '#美妆教程', '#日常妆容'],
    mentions: ['@makeupbrand', '@beautytips'],
    topCountries: [
      { country: '美国', percentage: 38.5 },
      { country: '巴西', percentage: 22.1 },
      { country: '墨西哥', percentage: 15.8 }
    ],
    topCities: [
      { city: '洛杉矶', percentage: 25.8 },
      { city: '圣保罗', percentage: 18.2 },
      { city: '墨西哥城', percentage: 12.5 }
    ],
    audienceAge: [
      { range: '16-24', percentage: 48.5 },
      { range: '25-34', percentage: 32.8 },
      { range: '35-44', percentage: 12.7 }
    ],
    audienceGender: [
      { gender: '女性', percentage: 85.2 },
      { gender: '男性', percentage: 14.8 }
    ]
  },
  {
    id: 4,
    kolId: 4,
    kolName: 'Lifestyle Blogger',
    kolAvatar: '/avatars/lifestyle-blogger.jpg',
    platform: 'instagram',
    title: '我的周末居家生活',
    content: '分享我的周末居家生活，简单而美好的时光 🏠',
    type: 'image',
    thumbnail: '/posts/weekend-home.jpg',
    url: 'https://instagram.com/p/weekend-home-life',
    publishDate: '2025-01-06T16:45:00Z',
    status: 'published',
    views: 65000,
    likes: 4200,
    comments: 280,
    shares: 150,
    saves: 850,
    engagementRate: 8.5,
    reachRate: 68.2,
    impressions: 95000,
    isSponsored: false,
    cost: 0,
    revenue: 2800,
    conversions: 28,
    clicks: 1200,
    ctr: 1.84,
    hashtags: ['#周末生活', '#居家时光', '#生活美学'],
    mentions: ['@homedesign', '@cozylife'],
    topCountries: [
      { country: '英国', percentage: 42.5 },
      { country: '美国', percentage: 28.7 },
      { country: '加拿大', percentage: 15.2 }
    ],
    topCities: [
      { city: '伦敦', percentage: 35.8 },
      { city: '纽约', percentage: 18.5 },
      { city: '多伦多', percentage: 12.3 }
    ],
    audienceAge: [
      { range: '25-34', percentage: 45.2 },
      { range: '35-44', percentage: 32.8 },
      { range: '45-54', percentage: 15.5 }
    ],
    audienceGender: [
      { gender: '女性', percentage: 72.5 },
      { gender: '男性', percentage: 27.5 }
    ]
  },
  {
    id: 5,
    kolId: 5,
    kolName: 'Fitness Coach',
    kolAvatar: '/avatars/fitness-coach.jpg',
    platform: 'instagram',
    title: '晨练瑜伽20分钟',
    content: '跟我一起做20分钟的晨练瑜伽，唤醒身体活力 🧘‍♀️',
    type: 'video',
    thumbnail: '/posts/morning-yoga.jpg',
    url: 'https://instagram.com/p/morning-yoga-20min',
    publishDate: '2025-01-05T07:00:00Z',
    status: 'published',
    views: 125000,
    likes: 8500,
    comments: 650,
    shares: 420,
    saves: 2800,
    engagementRate: 9.5,
    reachRate: 72.8,
    impressions: 172000,
    isSponsored: true,
    campaignId: 3,
    campaignName: '年终大促',
    cost: 3500,
    revenue: 15800,
    conversions: 95,
    clicks: 3200,
    ctr: 2.56,
    hashtags: ['#晨练瑜伽', '#健身', '#瑜伽教程'],
    mentions: ['@yogamat', '@fitnessbrand'],
    topCountries: [
      { country: '美国', percentage: 48.5 },
      { country: '澳大利亚', percentage: 18.2 },
      { country: '加拿大', percentage: 12.8 }
    ],
    topCities: [
      { city: '迈阿密', percentage: 28.5 },
      { city: '洛杉矶', percentage: 15.8 },
      { city: '悉尼', percentage: 12.5 }
    ],
    audienceAge: [
      { range: '25-34', percentage: 42.5 },
      { range: '35-44', percentage: 35.8 },
      { range: '45-54', percentage: 15.2 }
    ],
    audienceGender: [
      { gender: '女性', percentage: 68.5 },
      { gender: '男性', percentage: 31.5 }
    ]
  },
  {
    id: 6,
    kolId: 6,
    kolName: 'Gaming Streamer',
    kolAvatar: '/avatars/gaming-streamer.jpg',
    platform: 'youtube',
    title: '最新游戏直播精彩回顾',
    content: '昨晚直播的精彩时刻回顾，感谢大家的支持！',
    type: 'video',
    thumbnail: '/posts/gaming-highlights.jpg',
    url: 'https://youtube.com/watch?v=gaming-highlights',
    publishDate: '2025-01-04T20:30:00Z',
    status: 'published',
    views: 385000,
    likes: 28500,
    comments: 4200,
    shares: 1850,
    saves: 5600,
    engagementRate: 10.4,
    reachRate: 82.5,
    impressions: 465000,
    isSponsored: true,
    campaignId: 4,
    campaignName: '品牌推广',
    cost: 12000,
    revenue: 45000,
    conversions: 285,
    clicks: 18500,
    ctr: 4.8,
    hashtags: ['#游戏直播', '#精彩回顾', '#游戏'],
    mentions: ['@gamingbrand', '@esports'],
    topCountries: [
      { country: '日本', percentage: 45.8 },
      { country: '韩国', percentage: 22.5 },
      { country: '美国', percentage: 15.2 }
    ],
    topCities: [
      { city: '东京', percentage: 32.5 },
      { city: '首尔', percentage: 18.8 },
      { city: '大阪', percentage: 12.5 }
    ],
    audienceAge: [
      { range: '16-24', percentage: 52.5 },
      { range: '25-34', percentage: 32.8 },
      { range: '35-44', percentage: 12.2 }
    ],
    audienceGender: [
      { gender: '男性', percentage: 78.5 },
      { gender: '女性', percentage: 21.5 }
    ]
  }
]

// 红人数据API函数
export const mockGetKOLData = (): Promise<ApiResponse<KOLData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockKOLData,
        message: '获取红人数据成功'
      })
    }, 300)
  })
}

export const mockGetKOLSummary = (): Promise<ApiResponse<KOLSummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const summary: KOLSummary = {
        totalKOLs: mockKOLData.length,
        activeKOLs: mockKOLData.filter(k => k.status === 'active').length,
        totalFollowers: mockKOLData.reduce((sum, kol) => sum + kol.followers, 0),
        totalPosts: mockKOLData.reduce((sum, kol) => sum + kol.postsCount, 0),
        totalSpent: mockKOLData.reduce((sum, kol) => sum + kol.totalSpent, 0),
        totalRevenue: mockKOLData.reduce((sum, kol) => sum + kol.totalRevenue, 0),
        averageROI: mockKOLData.reduce((sum, kol) => sum + kol.roi, 0) / mockKOLData.length,
        averageEngagementRate: mockKOLData.reduce((sum, kol) => sum + kol.engagementRate, 0) / mockKOLData.length,
        topPerformingKOL: mockKOLData.sort((a, b) => b.roi - a.roi)[0].name,
        topPerformingPost: mockPostData.sort((a, b) => b.engagementRate - a.engagementRate)[0].title,
        totalImpressions: mockKOLData.reduce((sum, kol) => sum + kol.impressions, 0),
        totalReach: mockKOLData.reduce((sum, kol) => sum + (kol.impressions * kol.reachRate / 100), 0)
      }

      resolve({
        success: true,
        data: summary,
        message: '获取红人汇总数据成功'
      })
    }, 300)
  })
}

export const mockGetPostData = (): Promise<ApiResponse<PostData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockPostData,
        message: '获取帖子数据成功'
      })
    }, 300)
  })
}

export const mockGetPostSummary = (): Promise<ApiResponse<PostSummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const summary: PostSummary = {
        totalPosts: mockPostData.length,
        publishedPosts: mockPostData.filter(p => p.status === 'published').length,
        totalViews: mockPostData.reduce((sum, post) => sum + post.views, 0),
        totalLikes: mockPostData.reduce((sum, post) => sum + post.likes, 0),
        totalComments: mockPostData.reduce((sum, post) => sum + post.comments, 0),
        totalShares: mockPostData.reduce((sum, post) => sum + post.shares, 0),
        averageEngagementRate: mockPostData.reduce((sum, post) => sum + post.engagementRate, 0) / mockPostData.length,
        topPerformingPost: mockPostData.sort((a, b) => b.engagementRate - a.engagementRate)[0].title,
        totalImpressions: mockPostData.reduce((sum, post) => sum + post.impressions, 0),
        totalReach: mockPostData.reduce((sum, post) => sum + (post.impressions * post.reachRate / 100), 0),
        totalConversions: mockPostData.reduce((sum, post) => sum + post.conversions, 0),
        averageCTR: mockPostData.reduce((sum, post) => sum + post.ctr, 0) / mockPostData.length
      }

      resolve({
        success: true,
        data: summary,
        message: '获取帖子汇总数据成功'
      })
    }, 300)
  })
}

export const mockGetKOLDetails = (kolId: number): Promise<ApiResponse<KOLData | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const kol = mockKOLData.find(k => k.id === kolId)
      if (kol) {
        resolve({
          success: true,
          data: kol,
          message: '获取红人详情成功'
        })
      } else {
        resolve({
          success: false,
          data: null,
          message: '红人不存在'
        })
      }
    }, 300)
  })
}

export const mockGetPostDetails = (postId: number): Promise<ApiResponse<PostData | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const post = mockPostData.find(p => p.id === postId)
      if (post) {
        resolve({
          success: true,
          data: post,
          message: '获取帖子详情成功'
        })
      } else {
        resolve({
          success: false,
          data: null,
          message: '帖子不存在'
        })
      }
    }, 300)
  })
}

export const mockGetKOLsByPlatform = (platform: string): Promise<ApiResponse<KOLData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const kols = mockKOLData.filter(k => k.platform === platform)
      resolve({
        success: true,
        data: kols,
        message: '获取平台红人数据成功'
      })
    }, 300)
  })
}

export const mockGetPostsByKOL = (kolId: number): Promise<ApiResponse<PostData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const posts = mockPostData.filter(p => p.kolId === kolId)
      resolve({
        success: true,
        data: posts,
        message: '获取红人帖子数据成功'
      })
    }, 300)
  })
}

export const mockGetTopKOLs = (limit: number = 10, sortBy: string = 'roi'): Promise<ApiResponse<KOLData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sortedKOLs = [...mockKOLData].sort((a, b) => {
        const aValue = a[sortBy as keyof KOLData] as number
        const bValue = b[sortBy as keyof KOLData] as number
        return bValue - aValue
      }).slice(0, limit)

      resolve({
        success: true,
        data: sortedKOLs,
        message: '获取顶级红人数据成功'
      })
    }, 300)
  })
}

export const mockGetTopPosts = (limit: number = 10, sortBy: string = 'engagementRate'): Promise<ApiResponse<PostData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sortedPosts = [...mockPostData].sort((a, b) => {
        const aValue = a[sortBy as keyof PostData] as number
        const bValue = b[sortBy as keyof PostData] as number
        return bValue - aValue
      }).slice(0, limit)

      resolve({
        success: true,
        data: sortedPosts,
        message: '获取热门帖子数据成功'
      })
    }, 300)
  })
}

// 国家/地区市场数据
export const mockCountryMarketData: CountryMarketData[] = [
  {
    id: 1,
    country: '美国',
    countryCode: 'US',
    region: '北美',
    continent: '北美洲',
    totalSales: 1250000,
    totalOrders: 8500,
    totalUsers: 15600,
    totalSessions: 45800,
    salesRatio: 35.2,
    orderRatio: 32.8,
    userRatio: 28.5,
    sessionRatio: 31.2,
    averageOrderValue: 147.06,
    conversionRate: 18.6,
    averageSessionDuration: 185,
    bounceRate: 42.3,
    pagesPerSession: 3.8,
    salesGrowth: 12.5,
    userGrowth: 8.3,
    orderGrowth: 15.2,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 2,
    country: '加拿大',
    countryCode: 'CA',
    region: '北美',
    continent: '北美洲',
    totalSales: 485000,
    totalOrders: 3200,
    totalUsers: 6800,
    totalSessions: 18500,
    salesRatio: 13.6,
    orderRatio: 12.4,
    userRatio: 12.4,
    sessionRatio: 12.6,
    averageOrderValue: 151.56,
    conversionRate: 17.3,
    averageSessionDuration: 192,
    bounceRate: 38.7,
    pagesPerSession: 4.1,
    salesGrowth: 8.7,
    userGrowth: 6.2,
    orderGrowth: 11.3,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 3,
    country: '英国',
    countryCode: 'GB',
    region: '西欧',
    continent: '欧洲',
    totalSales: 680000,
    totalOrders: 4800,
    totalUsers: 9200,
    totalSessions: 24600,
    salesRatio: 19.1,
    orderRatio: 18.5,
    userRatio: 16.8,
    sessionRatio: 16.8,
    averageOrderValue: 141.67,
    conversionRate: 19.5,
    averageSessionDuration: 178,
    bounceRate: 44.2,
    pagesPerSession: 3.6,
    salesGrowth: 15.3,
    userGrowth: 12.1,
    orderGrowth: 18.7,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 4,
    country: '德国',
    countryCode: 'DE',
    region: '西欧',
    continent: '欧洲',
    totalSales: 520000,
    totalOrders: 3600,
    totalUsers: 7400,
    totalSessions: 19800,
    salesRatio: 14.6,
    orderRatio: 13.9,
    userRatio: 13.5,
    sessionRatio: 13.5,
    averageOrderValue: 144.44,
    conversionRate: 18.2,
    averageSessionDuration: 165,
    bounceRate: 46.8,
    pagesPerSession: 3.4,
    salesGrowth: 10.2,
    userGrowth: 7.8,
    orderGrowth: 12.5,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 5,
    country: '法国',
    countryCode: 'FR',
    region: '西欧',
    continent: '欧洲',
    totalSales: 380000,
    totalOrders: 2800,
    totalUsers: 5900,
    totalSessions: 16200,
    salesRatio: 10.7,
    orderRatio: 10.8,
    userRatio: 10.8,
    sessionRatio: 11.0,
    averageOrderValue: 135.71,
    conversionRate: 17.3,
    averageSessionDuration: 172,
    bounceRate: 48.5,
    pagesPerSession: 3.2,
    salesGrowth: 6.8,
    userGrowth: 4.5,
    orderGrowth: 8.9,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 6,
    country: '澳大利亚',
    countryCode: 'AU',
    region: '大洋洲',
    continent: '大洋洲',
    totalSales: 320000,
    totalOrders: 2200,
    totalUsers: 4800,
    totalSessions: 13500,
    salesRatio: 9.0,
    orderRatio: 8.5,
    userRatio: 8.8,
    sessionRatio: 9.2,
    averageOrderValue: 145.45,
    conversionRate: 16.3,
    averageSessionDuration: 188,
    bounceRate: 41.2,
    pagesPerSession: 3.9,
    salesGrowth: 14.5,
    userGrowth: 11.2,
    orderGrowth: 16.8,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 7,
    country: '日本',
    countryCode: 'JP',
    region: '东亚',
    continent: '亚洲',
    totalSales: 290000,
    totalOrders: 2400,
    totalUsers: 5200,
    totalSessions: 15800,
    salesRatio: 8.2,
    orderRatio: 9.3,
    userRatio: 9.5,
    sessionRatio: 10.8,
    averageOrderValue: 120.83,
    conversionRate: 15.2,
    averageSessionDuration: 156,
    bounceRate: 52.3,
    pagesPerSession: 2.8,
    salesGrowth: 18.3,
    userGrowth: 15.7,
    orderGrowth: 21.2,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 8,
    country: '韩国',
    countryCode: 'KR',
    region: '东亚',
    continent: '亚洲',
    totalSales: 185000,
    totalOrders: 1600,
    totalUsers: 3500,
    totalSessions: 11200,
    salesRatio: 5.2,
    orderRatio: 6.2,
    userRatio: 6.4,
    sessionRatio: 7.6,
    averageOrderValue: 115.63,
    conversionRate: 14.3,
    averageSessionDuration: 148,
    bounceRate: 54.7,
    pagesPerSession: 2.6,
    salesGrowth: 22.8,
    userGrowth: 19.3,
    orderGrowth: 25.5,
    lastUpdated: '2025-01-09T10:30:00Z'
  }
]

// 国家/地区市场数据API函数
export const mockGetCountryMarketData = (): Promise<ApiResponse<CountryMarketData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockCountryMarketData,
        message: '获取国家市场数据成功'
      })
    }, 300)
  })
}

export const mockGetMarketSummary = (): Promise<ApiResponse<MarketSummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalSales = mockCountryMarketData.reduce((sum, country) => sum + country.totalSales, 0)
      const totalOrders = mockCountryMarketData.reduce((sum, country) => sum + country.totalOrders, 0)
      const totalUsers = mockCountryMarketData.reduce((sum, country) => sum + country.totalUsers, 0)

      // 按地区分组统计
      const regionMap = new Map<string, { revenue: number; countries: CountryMarketData[] }>()
      mockCountryMarketData.forEach(country => {
        if (!regionMap.has(country.region)) {
          regionMap.set(country.region, { revenue: 0, countries: [] })
        }
        const regionData = regionMap.get(country.region)!
        regionData.revenue += country.totalSales
        regionData.countries.push(country)
      })

      const revenueDistribution = Array.from(regionMap.entries()).map(([region, data]) => ({
        region,
        revenue: data.revenue,
        percentage: (data.revenue / totalSales) * 100
      }))

      const summary: MarketSummary = {
        totalCountries: mockCountryMarketData.length,
        totalRegions: regionMap.size,
        totalSales,
        totalOrders,
        totalUsers,
        topPerformingCountry: mockCountryMarketData.sort((a, b) => b.totalSales - a.totalSales)[0].country,
        topPerformingRegion: revenueDistribution.sort((a, b) => b.revenue - a.revenue)[0].region,
        averageOrderValue: totalSales / totalOrders,
        averageConversionRate: mockCountryMarketData.reduce((sum, country) => sum + country.conversionRate, 0) / mockCountryMarketData.length,
        topCountriesByRevenue: mockCountryMarketData.sort((a, b) => b.totalSales - a.totalSales).slice(0, 5),
        revenueDistribution
      }

      resolve({
        success: true,
        data: summary,
        message: '获取市场汇总数据成功'
      })
    }, 300)
  })
}

export const mockGetCountryDetails = (countryId: number): Promise<ApiResponse<CountryMarketData | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const country = mockCountryMarketData.find(c => c.id === countryId)
      if (country) {
        resolve({
          success: true,
          data: country,
          message: '获取国家详情成功'
        })
      } else {
        resolve({
          success: false,
          data: null,
          message: '国家不存在'
        })
      }
    }, 300)
  })
}

export const mockGetCountriesByRegion = (region: string): Promise<ApiResponse<CountryMarketData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const countries = mockCountryMarketData.filter(c => c.region === region)
      resolve({
        success: true,
        data: countries,
        message: '获取地区国家数据成功'
      })
    }, 300)
  })
}

export const mockGetTopCountries = (limit: number = 10, sortBy: string = 'totalSales'): Promise<ApiResponse<CountryMarketData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sortedCountries = [...mockCountryMarketData].sort((a, b) => {
        const aValue = a[sortBy as keyof CountryMarketData] as number
        const bValue = b[sortBy as keyof CountryMarketData] as number
        return bValue - aValue
      }).slice(0, limit)

      resolve({
        success: true,
        data: sortedCountries,
        message: '获取顶级国家数据成功'
      })
    }, 300)
  })
}

export const mockGetMarketTrends = (countryIds: number[], period: string = '7d'): Promise<ApiResponse<MarketTrend[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const trends: MarketTrend[] = []

      // 生成模拟趋势数据
      countryIds.forEach(countryId => {
        const country = mockCountryMarketData.find(c => c.id === countryId)
        if (country) {
          // 生成7天的趋势数据
          for (let i = 6; i >= 0; i--) {
            const date = new Date()
            date.setDate(date.getDate() - i)
            const dateStr = date.toISOString().split('T')[0]

            // 添加随机波动
            const randomFactor = 0.8 + Math.random() * 0.4

            trends.push({
              country: country.country,
              period: dateStr,
              sales: Math.round(country.totalSales / 30 * randomFactor),
              orders: Math.round(country.totalOrders / 30 * randomFactor),
              users: Math.round(country.totalUsers / 30 * randomFactor),
              conversionRate: country.conversionRate * randomFactor,
              averageOrderValue: country.averageOrderValue * randomFactor
            })
          }
        }
      })

      resolve({
        success: true,
        data: trends,
        message: '获取市场趋势数据成功'
      })
    }, 300)
  })
}

// Mock页面表现数据
export const mockPagePerformanceData: PagePerformanceData[] = [
  {
    id: 1,
    pageName: '首页',
    pageUrl: '/',
    pageType: 'home',
    pageCategory: '首页',
    users: 28500,
    newUsers: 18200,
    userCost: 2.45,
    conversionRate: 3.8,
    revenue: 142000,
    usersRatio: 24.5,
    revenueRatio: 18.2,
    bounceRate: 45.2,
    addToCartCount: 1850,
    addToCartRate: 6.5,
    checkoutPageViews: 1200,
    checkoutConversionRate: 65.0,
    averageSessionDuration: 185,
    averageTimeOnPage: 95,
    averageLoadTime: 1200,
    pageViews: 45000,
    uniquePageViews: 32000,
    entrances: 25000,
    exits: 12000,
    exitRate: 26.7,
    clickThroughRate: 8.5,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 2,
    pageName: '产品详情页 - iPhone 15',
    pageUrl: '/products/iphone-15',
    pageType: 'product',
    pageCategory: '产品详情页',
    productType: '数码产品',
    users: 15800,
    newUsers: 9500,
    userCost: 3.20,
    conversionRate: 8.5,
    revenue: 185000,
    usersRatio: 13.6,
    revenueRatio: 23.7,
    bounceRate: 35.8,
    addToCartCount: 2100,
    addToCartRate: 13.3,
    checkoutPageViews: 1800,
    checkoutConversionRate: 85.7,
    averageSessionDuration: 240,
    averageTimeOnPage: 165,
    averageLoadTime: 1800,
    pageViews: 28000,
    uniquePageViews: 18500,
    entrances: 8500,
    exits: 5200,
    exitRate: 18.6,
    clickThroughRate: 15.2,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 3,
    pageName: '时尚类目页',
    pageUrl: '/category/fashion',
    pageType: 'category',
    pageCategory: '类目页',
    productType: '时尚服装',
    users: 12400,
    newUsers: 7800,
    userCost: 2.80,
    conversionRate: 4.2,
    revenue: 95000,
    usersRatio: 10.7,
    revenueRatio: 12.2,
    bounceRate: 52.3,
    addToCartCount: 980,
    addToCartRate: 7.9,
    checkoutPageViews: 650,
    checkoutConversionRate: 66.3,
    averageSessionDuration: 156,
    averageTimeOnPage: 88,
    averageLoadTime: 1400,
    pageViews: 22000,
    uniquePageViews: 15000,
    entrances: 6800,
    exits: 7200,
    exitRate: 32.7,
    clickThroughRate: 9.8,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 4,
    pageName: '购物车页面',
    pageUrl: '/cart',
    pageType: 'cart',
    pageCategory: '购物车页',
    users: 8900,
    newUsers: 3200,
    userCost: 4.50,
    conversionRate: 45.8,
    revenue: 125000,
    usersRatio: 7.7,
    revenueRatio: 16.0,
    bounceRate: 28.5,
    addToCartCount: 0,
    addToCartRate: 0,
    checkoutPageViews: 4800,
    checkoutConversionRate: 53.9,
    averageSessionDuration: 320,
    averageTimeOnPage: 185,
    averageLoadTime: 1100,
    pageViews: 12000,
    uniquePageViews: 9500,
    entrances: 1200,
    exits: 3800,
    exitRate: 31.7,
    clickThroughRate: 52.3,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 5,
    pageName: '结账页面',
    pageUrl: '/checkout',
    pageType: 'checkout',
    pageCategory: '结账页',
    users: 5200,
    newUsers: 1800,
    userCost: 8.20,
    conversionRate: 75.2,
    revenue: 98000,
    usersRatio: 4.5,
    revenueRatio: 12.6,
    bounceRate: 15.8,
    addToCartCount: 0,
    addToCartRate: 0,
    checkoutPageViews: 5200,
    checkoutConversionRate: 100.0,
    averageSessionDuration: 420,
    averageTimeOnPage: 280,
    averageLoadTime: 2200,
    pageViews: 6800,
    uniquePageViews: 5200,
    entrances: 0,
    exits: 1300,
    exitRate: 19.1,
    clickThroughRate: 78.5,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 6,
    pageName: '搜索结果页',
    pageUrl: '/search',
    pageType: 'search',
    pageCategory: '搜索页',
    users: 9800,
    newUsers: 6200,
    userCost: 3.80,
    conversionRate: 5.8,
    revenue: 65000,
    usersRatio: 8.4,
    revenueRatio: 8.3,
    bounceRate: 48.7,
    addToCartCount: 720,
    addToCartRate: 7.3,
    checkoutPageViews: 480,
    checkoutConversionRate: 66.7,
    averageSessionDuration: 145,
    averageTimeOnPage: 78,
    averageLoadTime: 1300,
    pageViews: 18500,
    uniquePageViews: 12000,
    entrances: 4500,
    exits: 5800,
    exitRate: 31.4,
    clickThroughRate: 8.9,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 7,
    pageName: '美妆产品详情页',
    pageUrl: '/products/beauty-set',
    pageType: 'product',
    pageCategory: '产品详情页',
    productType: '美妆产品',
    users: 7400,
    newUsers: 4800,
    userCost: 4.20,
    conversionRate: 12.5,
    revenue: 88000,
    usersRatio: 6.4,
    revenueRatio: 11.3,
    bounceRate: 32.1,
    addToCartCount: 1200,
    addToCartRate: 16.2,
    checkoutPageViews: 980,
    checkoutConversionRate: 81.7,
    averageSessionDuration: 285,
    averageTimeOnPage: 195,
    averageLoadTime: 1650,
    pageViews: 14000,
    uniquePageViews: 8800,
    entrances: 3200,
    exits: 2100,
    exitRate: 15.0,
    clickThroughRate: 18.5,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 8,
    pageName: '博客文章页',
    pageUrl: '/blog/fashion-trends-2024',
    pageType: 'blog',
    pageCategory: '博客页',
    users: 6500,
    newUsers: 5200,
    userCost: 1.80,
    conversionRate: 2.1,
    revenue: 15000,
    usersRatio: 5.6,
    revenueRatio: 1.9,
    bounceRate: 65.8,
    addToCartCount: 180,
    addToCartRate: 2.8,
    checkoutPageViews: 120,
    checkoutConversionRate: 66.7,
    averageSessionDuration: 320,
    averageTimeOnPage: 245,
    averageLoadTime: 1500,
    pageViews: 12000,
    uniquePageViews: 7200,
    entrances: 4800,
    exits: 7900,
    exitRate: 65.8,
    clickThroughRate: 3.5,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 9,
    pageName: '联系我们页面',
    pageUrl: '/contact',
    pageType: 'contact',
    pageCategory: '联系页',
    users: 3200,
    newUsers: 2100,
    userCost: 2.50,
    conversionRate: 8.5,
    revenue: 8500,
    usersRatio: 2.8,
    revenueRatio: 1.1,
    bounceRate: 42.3,
    addToCartCount: 0,
    addToCartRate: 0,
    checkoutPageViews: 0,
    checkoutConversionRate: 0,
    averageSessionDuration: 180,
    averageTimeOnPage: 125,
    averageLoadTime: 1000,
    pageViews: 4200,
    uniquePageViews: 3500,
    entrances: 1800,
    exits: 1800,
    exitRate: 42.9,
    clickThroughRate: 12.5,
    lastUpdated: '2025-01-09T10:30:00Z'
  },
  {
    id: 10,
    pageName: '关于我们页面',
    pageUrl: '/about',
    pageType: 'about',
    pageCategory: '关于页',
    users: 2800,
    newUsers: 1900,
    userCost: 2.20,
    conversionRate: 3.2,
    revenue: 4500,
    usersRatio: 2.4,
    revenueRatio: 0.6,
    bounceRate: 58.7,
    addToCartCount: 45,
    addToCartRate: 1.6,
    checkoutPageViews: 28,
    checkoutConversionRate: 62.2,
    averageSessionDuration: 165,
    averageTimeOnPage: 95,
    averageLoadTime: 950,
    pageViews: 3800,
    uniquePageViews: 3200,
    entrances: 1200,
    exits: 2200,
    exitRate: 57.9,
    clickThroughRate: 2.8,
    lastUpdated: '2025-01-09T10:30:00Z'
  }
]

// Mock竞品数据
export const mockCompetitorData: CompetitorData[] = [
  {
    id: 1,
    name: 'Fashion Forward',
    website: 'https://fashionforward.com',
    industry: '时尚服装',
    description: '专注于快时尚的在线零售商',
    currentCampaign: '春季新品50%折扣',
    campaignStartDate: '2025-01-01',
    campaignEndDate: '2025-01-31',
    campaignType: 'seasonal',
    priceRange: '$20-$200',
    mainProducts: ['女装', '男装', '配饰'],
    targetMarkets: ['北美', '欧洲'],
    marketingChannels: ['Instagram', 'Facebook', 'Google Ads', 'TikTok'],
    estimatedTraffic: 850000,
    socialMediaFollowers: [
      { platform: 'Instagram', followers: 420000 },
      { platform: 'Facebook', followers: 280000 },
      { platform: 'TikTok', followers: 150000 }
    ],
    keywordRanking: [
      { keyword: 'fast fashion', position: 3 },
      { keyword: 'women clothing', position: 7 },
      { keyword: 'trendy outfits', position: 2 }
    ],
    status: 'monitoring',
    addedDate: '2024-12-01',
    lastUpdated: '2025-01-09T10:30:00Z',
    addedBy: '张小明'
  },
  {
    id: 2,
    name: 'TechHub Electronics',
    website: 'https://techhub.com',
    industry: '数码科技',
    description: '专业的电子产品销售平台',
    currentCampaign: '新年科技节 - 智能设备大促',
    campaignStartDate: '2025-01-05',
    campaignEndDate: '2025-01-20',
    campaignType: 'promotion',
    priceRange: '$50-$2000',
    mainProducts: ['智能手机', '笔记本电脑', '智能家居'],
    targetMarkets: ['全球'],
    marketingChannels: ['YouTube', 'Google Ads', 'Tech blogs', 'Reddit'],
    estimatedTraffic: 1200000,
    socialMediaFollowers: [
      { platform: 'YouTube', followers: 580000 },
      { platform: 'Twitter', followers: 320000 },
      { platform: 'Facebook', followers: 450000 }
    ],
    keywordRanking: [
      { keyword: 'smartphone deals', position: 1 },
      { keyword: 'laptop reviews', position: 4 },
      { keyword: 'smart home devices', position: 2 }
    ],
    status: 'monitoring',
    addedDate: '2024-11-15',
    lastUpdated: '2025-01-09T10:30:00Z',
    addedBy: '李红'
  },
  {
    id: 3,
    name: 'Beauty Paradise',
    website: 'https://beautyparadise.com',
    industry: '美容护肤',
    description: '高端美妆品牌集合店',
    currentCampaign: '护肤专场 - 买二送一',
    campaignStartDate: '2025-01-08',
    campaignEndDate: '2025-02-08',
    campaignType: 'promotion',
    priceRange: '$15-$300',
    mainProducts: ['护肤品', '化妆品', '香水'],
    targetMarkets: ['北美', '欧洲', '亚洲'],
    marketingChannels: ['Instagram', 'Pinterest', 'Beauty influencers', 'YouTube'],
    estimatedTraffic: 650000,
    socialMediaFollowers: [
      { platform: 'Instagram', followers: 890000 },
      { platform: 'Pinterest', followers: 340000 },
      { platform: 'YouTube', followers: 180000 }
    ],
    keywordRanking: [
      { keyword: 'skincare routine', position: 2 },
      { keyword: 'makeup tutorial', position: 5 },
      { keyword: 'anti-aging cream', position: 1 }
    ],
    status: 'monitoring',
    addedDate: '2024-10-20',
    lastUpdated: '2025-01-09T10:30:00Z',
    addedBy: '王强'
  },
  {
    id: 4,
    name: 'Sports Elite',
    website: 'https://sportselite.com',
    industry: '体育用品',
    description: '专业运动装备和健身器材',
    currentCampaign: '新年健身计划 - 器材7折',
    campaignStartDate: '2025-01-01',
    campaignEndDate: '2025-01-31',
    campaignType: 'seasonal',
    priceRange: '$25-$1500',
    mainProducts: ['健身器材', '运动服装', '运动鞋'],
    targetMarkets: ['北美', '欧洲'],
    marketingChannels: ['Facebook', 'Instagram', 'Sports websites', 'Fitness influencers'],
    estimatedTraffic: 420000,
    socialMediaFollowers: [
      { platform: 'Instagram', followers: 280000 },
      { platform: 'Facebook', followers: 350000 },
      { platform: 'YouTube', followers: 120000 }
    ],
    keywordRanking: [
      { keyword: 'home gym equipment', position: 3 },
      { keyword: 'running shoes', position: 8 },
      { keyword: 'fitness gear', position: 4 }
    ],
    status: 'monitoring',
    addedDate: '2024-09-10',
    lastUpdated: '2025-01-09T10:30:00Z',
    addedBy: '赵敏'
  },
  {
    id: 5,
    name: 'Home Comfort',
    website: 'https://homecomfort.com',
    industry: '家居装饰',
    description: '现代家居用品和装饰品',
    status: 'paused',
    addedDate: '2024-08-15',
    lastUpdated: '2024-12-20T10:30:00Z',
    addedBy: '孙丽',
    priceRange: '$30-$800',
    mainProducts: ['家具', '装饰品', '厨具'],
    targetMarkets: ['北美'],
    marketingChannels: ['Pinterest', 'Instagram', 'Home decor blogs'],
    estimatedTraffic: 280000,
    socialMediaFollowers: [
      { platform: 'Pinterest', followers: 520000 },
      { platform: 'Instagram', followers: 180000 },
      { platform: 'Facebook', followers: 120000 }
    ],
    keywordRanking: [
      { keyword: 'modern furniture', position: 6 },
      { keyword: 'home decor ideas', position: 9 },
      { keyword: 'kitchen accessories', position: 5 }
    ]
  },
  {
    id: 6,
    name: 'Gadget Galaxy',
    website: 'https://gadgetgalaxy.com',
    industry: '数码科技',
    description: '创新科技产品和智能设备',
    currentCampaign: '科技创新周 - 新品首发',
    campaignStartDate: '2025-01-10',
    campaignEndDate: '2025-01-17',
    campaignType: 'product_launch',
    priceRange: '$20-$500',
    mainProducts: ['智能配件', '创新设备', '科技玩具'],
    targetMarkets: ['全球'],
    marketingChannels: ['Tech blogs', 'YouTube', 'Kickstarter', 'Reddit'],
    estimatedTraffic: 380000,
    socialMediaFollowers: [
      { platform: 'YouTube', followers: 240000 },
      { platform: 'Twitter', followers: 180000 },
      { platform: 'Instagram', followers: 95000 }
    ],
    keywordRanking: [
      { keyword: 'innovative gadgets', position: 2 },
      { keyword: 'smart accessories', position: 4 },
      { keyword: 'tech toys', position: 1 }
    ],
    status: 'monitoring',
    addedDate: '2024-12-05',
    lastUpdated: '2025-01-09T10:30:00Z',
    addedBy: '李红'
  }
]

// 页面表现数据API函数
export const mockGetPagePerformanceData = (): Promise<ApiResponse<PagePerformanceData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockPagePerformanceData,
        message: '获取页面表现数据成功'
      })
    }, 300)
  })
}

export const mockGetPagePerformanceSummary = (): Promise<ApiResponse<PagePerformanceSummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalUsers = mockPagePerformanceData.reduce((sum, page) => sum + page.users, 0)
      const totalRevenue = mockPagePerformanceData.reduce((sum, page) => sum + page.revenue, 0)
      const totalPageViews = mockPagePerformanceData.reduce((sum, page) => sum + page.pageViews, 0)
      const totalAddToCarts = mockPagePerformanceData.reduce((sum, page) => sum + page.addToCartCount, 0)

      const summary: PagePerformanceSummary = {
        totalPages: mockPagePerformanceData.length,
        totalPageViews,
        totalUsers,
        totalRevenue,
        averageConversionRate: mockPagePerformanceData.reduce((sum, page) => sum + page.conversionRate, 0) / mockPagePerformanceData.length,
        averageBounceRate: mockPagePerformanceData.reduce((sum, page) => sum + page.bounceRate, 0) / mockPagePerformanceData.length,
        averageTimeOnPage: mockPagePerformanceData.reduce((sum, page) => sum + page.averageTimeOnPage, 0) / mockPagePerformanceData.length,
        averageLoadTime: mockPagePerformanceData.reduce((sum, page) => sum + page.averageLoadTime, 0) / mockPagePerformanceData.length,
        topPerformingPage: mockPagePerformanceData.sort((a, b) => b.users - a.users)[0].pageName,
        topRevenueGenerator: mockPagePerformanceData.sort((a, b) => b.revenue - a.revenue)[0].pageName,
        totalAddToCarts,
        averageAddToCartRate: mockPagePerformanceData.reduce((sum, page) => sum + page.addToCartRate, 0) / mockPagePerformanceData.length
      }

      resolve({
        success: true,
        data: summary,
        message: '获取页面表现汇总数据成功'
      })
    }, 300)
  })
}

export const mockGetPageDetails = (pageId: number): Promise<ApiResponse<PagePerformanceData | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const page = mockPagePerformanceData.find(p => p.id === pageId)
      if (page) {
        resolve({
          success: true,
          data: page,
          message: '获取页面详情成功'
        })
      } else {
        resolve({
          success: false,
          data: null,
          message: '页面不存在'
        })
      }
    }, 300)
  })
}

export const mockGetPagesByType = (pageType: string): Promise<ApiResponse<PagePerformanceData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const pages = mockPagePerformanceData.filter(p => p.pageType === pageType)
      resolve({
        success: true,
        data: pages,
        message: '获取页面类型数据成功'
      })
    }, 300)
  })
}

export const mockGetTopPages = (limit: number = 10, sortBy: string = 'users'): Promise<ApiResponse<PagePerformanceData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sortedPages = [...mockPagePerformanceData].sort((a, b) => {
        const aValue = a[sortBy as keyof PagePerformanceData] as number
        const bValue = b[sortBy as keyof PagePerformanceData] as number
        return bValue - aValue
      }).slice(0, limit)

      resolve({
        success: true,
        data: sortedPages,
        message: '获取顶级页面数据成功'
      })
    }, 300)
  })
}

// 竞品数据API函数
export const mockGetCompetitorData = (): Promise<ApiResponse<CompetitorData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockCompetitorData,
        message: '获取竞品数据成功'
      })
    }, 300)
  })
}

export const mockGetCompetitorSummary = (): Promise<ApiResponse<CompetitorSummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activeCompetitors = mockCompetitorData.filter(c => c.status === 'monitoring')
      const totalCampaigns = mockCompetitorData.filter(c => c.currentCampaign).length
      const activeCampaigns = mockCompetitorData.filter(c => c.currentCampaign && c.status === 'monitoring').length

      const summary: CompetitorSummary = {
        totalCompetitors: mockCompetitorData.length,
        activeCompetitors: activeCompetitors.length,
        totalCampaigns,
        activeCampaigns,
        topCompetitor: mockCompetitorData.sort((a, b) => (b.estimatedTraffic || 0) - (a.estimatedTraffic || 0))[0].name,
        mostActiveCompetitor: mockCompetitorData.filter(c => c.currentCampaign).sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())[0]?.name || '',
        averageTraffic: mockCompetitorData.reduce((sum, c) => sum + (c.estimatedTraffic || 0), 0) / mockCompetitorData.length,
        topKeywords: ['fast fashion', 'smartphone deals', 'skincare routine', 'home gym equipment', 'innovative gadgets']
      }

      resolve({
        success: true,
        data: summary,
        message: '获取竞品汇总数据成功'
      })
    }, 300)
  })
}

export const mockGetCompetitorDetails = (competitorId: number): Promise<ApiResponse<CompetitorData | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const competitor = mockCompetitorData.find(c => c.id === competitorId)
      if (competitor) {
        resolve({
          success: true,
          data: competitor,
          message: '获取竞品详情成功'
        })
      } else {
        resolve({
          success: false,
          data: null,
          message: '竞品不存在'
        })
      }
    }, 300)
  })
}

export const mockGetCompetitorsByIndustry = (industry: string): Promise<ApiResponse<CompetitorData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const competitors = mockCompetitorData.filter(c => c.industry === industry)
      resolve({
        success: true,
        data: competitors,
        message: '获取行业竞品数据成功'
      })
    }, 300)
  })
}

export const mockAddCompetitor = (competitorData: Omit<CompetitorData, 'id' | 'addedDate' | 'lastUpdated'>): Promise<ApiResponse<CompetitorData>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCompetitor: CompetitorData = {
        ...competitorData,
        id: mockCompetitorData.length + 1,
        addedDate: new Date().toISOString().split('T')[0],
        lastUpdated: new Date().toISOString()
      }

      mockCompetitorData.push(newCompetitor)

      resolve({
        success: true,
        data: newCompetitor,
        message: '添加竞品成功'
      })
    }, 300)
  })
}

export const mockUpdateCompetitor = (competitorId: number, updates: Partial<CompetitorData>): Promise<ApiResponse<CompetitorData | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockCompetitorData.findIndex(c => c.id === competitorId)
      if (index !== -1) {
        mockCompetitorData[index] = {
          ...mockCompetitorData[index],
          ...updates,
          lastUpdated: new Date().toISOString()
        }

        resolve({
          success: true,
          data: mockCompetitorData[index],
          message: '更新竞品成功'
        })
      } else {
        resolve({
          success: false,
          data: null,
          message: '竞品不存在'
        })
      }
    }, 300)
  })
}

export const mockDeleteCompetitor = (competitorId: number): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockCompetitorData.findIndex(c => c.id === competitorId)
      if (index !== -1) {
        mockCompetitorData.splice(index, 1)
        resolve({
          success: true,
          message: '删除竞品成功'
        })
      } else {
        resolve({
          success: false,
          message: '竞品不存在'
        })
      }
    }, 300)
  })
}

// 全平台广告数据
export const mockAdPlatformData: AdPlatformData[] = [
  {
    id: 1,
    platform: 'google',
    accountName: 'Google Ads Main Account',
    accountId: 'GA-123456789',
    status: 'active',
    spend: 45000,
    spendRatio: 35.2,
    revenue: 180000,
    roas: 4.0,
    purchases: 850,
    cpa: 52.94,
    averagePurchaseValue: 211.76,
    conversionRate: 3.2,
    impressions: 1250000,
    cpm: 36.0,
    clicks: 40000,
    ctr: 3.2,
    cpc: 1.13,
    uniqueClicks: 38500,
    videoViews: 150000,
    videoViewRate: 12.0,
    averageViewDuration: 25.5,
    date: '2025-01-08',
    lastUpdated: '2025-01-08T10:30:00Z'
  },
  {
    id: 2,
    platform: 'meta',
    accountName: 'Meta Business Account',
    accountId: 'FB-987654321',
    status: 'active',
    spend: 38000,
    spendRatio: 29.7,
    revenue: 152000,
    roas: 4.0,
    purchases: 720,
    cpa: 52.78,
    averagePurchaseValue: 211.11,
    conversionRate: 2.9,
    impressions: 980000,
    cpm: 38.78,
    reach: 450000,
    frequency: 2.18,
    clicks: 28420,
    ctr: 2.9,
    cpc: 1.34,
    uniqueClicks: 26800,
    videoViews: 120000,
    videoViewRate: 12.2,
    averageViewDuration: 22.8,
    date: '2025-01-08',
    lastUpdated: '2025-01-08T10:30:00Z'
  },
  {
    id: 3,
    platform: 'criteo',
    accountName: 'Criteo Retargeting',
    accountId: 'CR-456789123',
    status: 'active',
    spend: 25000,
    spendRatio: 19.5,
    revenue: 85000,
    roas: 3.4,
    purchases: 400,
    cpa: 62.5,
    averagePurchaseValue: 212.5,
    conversionRate: 2.1,
    impressions: 750000,
    cpm: 33.33,
    clicks: 19000,
    ctr: 2.53,
    cpc: 1.32,
    uniqueClicks: 18200,
    date: '2025-01-08',
    lastUpdated: '2025-01-08T10:30:00Z'
  },
  {
    id: 4,
    platform: 'bing',
    accountName: 'Bing Ads Account',
    accountId: 'BA-789123456',
    status: 'active',
    spend: 20000,
    spendRatio: 15.6,
    revenue: 68000,
    roas: 3.4,
    purchases: 320,
    cpa: 62.5,
    averagePurchaseValue: 212.5,
    conversionRate: 2.8,
    impressions: 600000,
    cpm: 33.33,
    clicks: 16800,
    ctr: 2.8,
    cpc: 1.19,
    uniqueClicks: 16200,
    date: '2025-01-08',
    lastUpdated: '2025-01-08T10:30:00Z'
  }
]

// Meta广告数据
export const mockMetaAdData: MetaAdData[] = [
  {
    id: 1,
    accountId: 'FB-987654321',
    accountName: 'Meta Business Account',
    campaignId: 'C-001',
    campaignName: 'Spring Collection 2025',
    spend: 15000,
    revenue: 60000,
    roas: 4.0,
    aov: 85.71,
    purchases: 700,
    purchaseValue: 60000,
    averagePurchaseValue: 85.71,
    conversionRate: 2.9,
    costPerPurchase: 21.43,
    addToCarts: 2800,
    addToCartRate: 11.7,
    costPerAddToCart: 5.36,
    checkoutsInitiated: 1400,
    checkoutRate: 5.8,
    impressions: 400000,
    reach: 180000,
    frequency: 2.22,
    cpm: 37.5,
    clicks: 11600,
    ctr: 2.9,
    cpc: 1.29,
    linkClicks: 10800,
    linkCTR: 2.7,
    costPerLinkClick: 1.39,
    postEngagement: 3200,
    costPerPostEngagement: 4.69,
    likes: 2400,
    costPerLike: 6.25,
    comments: 480,
    shares: 320,
    videoViews: 48000,
    averageVideoPlayTime: 18.5,
    videoPlays3s: 40000,
    costPerVideoPlay3s: 0.375,
    thruPlays: 12000,
    costPerThruPlay: 1.25,
    videoPlays25: 36000,
    videoPlays50: 28000,
    videoPlays75: 20000,
    videoPlays95: 14000,
    videoPlays100: 12000,
    landingPageViews: 9600,
    costPerLandingPageView: 1.56,
    contentViews: 8400,
    costPerContentView: 1.79,
    date: '2025-01-08',
    lastUpdated: '2025-01-08T10:30:00Z'
  }
]

// Google广告数据
export const mockGoogleAdData: GoogleAdData[] = [
  {
    id: 1,
    accountId: 'GA-123456789',
    accountName: 'Google Ads Main Account',
    campaignId: 'GC-001',
    campaignName: 'Search Campaign - Fashion',
    cost: 20000,
    revenue: 80000,
    roas: 4.0,
    conversions: 400,
    conversionValue: 80000,
    costPerConversion: 50.0,
    conversionRate: 3.2,
    impressions: 500000,
    cpm: 40.0,
    impressionShare: 75.5,
    clicks: 16000,
    ctr: 3.2,
    cpc: 1.25,
    avgPosition: 2.1,
    shoppingImpressions: 200000,
    shoppingClicks: 6000,
    shoppingCTR: 3.0,
    shoppingCPC: 1.33,
    qualityScore: 8.5,
    expectedCTR: 'Above average',
    adRelevance: 'Above average',
    landingPageExperience: 'Above average',
    date: '2025-01-08',
    lastUpdated: '2025-01-08T10:30:00Z'
  }
]

// Criteo广告数据
export const mockCriteoAdData: CriteoAdData[] = [
  {
    id: 1,
    accountId: 'CR-456789123',
    accountName: 'Criteo Retargeting',
    campaignId: 'CC-001',
    campaignName: 'Retargeting Campaign',
    cost: 12000,
    revenue: 40800,
    roas: 3.4,
    orders: 192,
    orderValue: 40800,
    costPerOrder: 62.5,
    impressions: 360000,
    cpm: 33.33,
    reach: 120000,
    clicks: 9120,
    ctr: 2.53,
    cpc: 1.32,
    displayImpressions: 300000,
    displayClicks: 7500,
    displayCTR: 2.5,
    displayCPC: 1.35,
    date: '2025-01-08',
    lastUpdated: '2025-01-08T10:30:00Z'
  }
]

// Bing广告数据
export const mockBingAdData: BingAdData[] = [
  {
    id: 1,
    accountId: 'BA-789123456',
    accountName: 'Bing Ads Account',
    campaignId: 'BC-001',
    campaignName: 'Bing Search Campaign',
    spend: 10000,
    revenue: 34000,
    roas: 3.4,
    conversions: 160,
    conversionValue: 34000,
    costPerConversion: 62.5,
    conversionRate: 2.8,
    impressions: 300000,
    cpm: 33.33,
    impressionShare: 65.2,
    clicks: 8400,
    ctr: 2.8,
    cpc: 1.19,
    avgPosition: 2.5,
    qualityScore: 7.8,
    keywordRelevance: 8.2,
    landingPageRelevance: 7.5,
    landingPageUserExperience: 7.9,
    date: '2025-01-08',
    lastUpdated: '2025-01-08T10:30:00Z'
  }
]

// 广告数据API函数
export const mockGetAdPlatformData = (): Promise<ApiResponse<AdPlatformData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockAdPlatformData,
        message: '获取全平台广告数据成功'
      })
    }, 300)
  })
}

export const mockGetAdPlatformSummary = (): Promise<ApiResponse<AdPlatformSummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const totalSpend = mockAdPlatformData.reduce((sum, platform) => sum + platform.spend, 0)
      const totalRevenue = mockAdPlatformData.reduce((sum, platform) => sum + platform.revenue, 0)
      const totalImpressions = mockAdPlatformData.reduce((sum, platform) => sum + platform.impressions, 0)
      const totalClicks = mockAdPlatformData.reduce((sum, platform) => sum + platform.clicks, 0)

      const summary: AdPlatformSummary = {
        totalPlatforms: mockAdPlatformData.length,
        activePlatforms: mockAdPlatformData.filter(p => p.status === 'active').length,
        totalSpend,
        totalRevenue,
        averageROAS: totalRevenue / totalSpend,
        totalImpressions,
        totalClicks,
        averageCTR: (totalClicks / totalImpressions) * 100,
        averageCPC: totalSpend / totalClicks,
        topPerformingPlatform: mockAdPlatformData.sort((a, b) => b.roas - a.roas)[0].platform,
        platformDistribution: mockAdPlatformData.map(p => ({
          platform: p.platform,
          spend: p.spend,
          revenue: p.revenue,
          percentage: (p.spend / totalSpend) * 100
        }))
      }

      resolve({
        success: true,
        data: summary,
        message: '获取广告平台汇总数据成功'
      })
    }, 300)
  })
}

export const mockGetMetaAdData = (): Promise<ApiResponse<MetaAdData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaAdData,
        message: '获取Meta广告数据成功'
      })
    }, 300)
  })
}

export const mockGetGoogleAdData = (): Promise<ApiResponse<GoogleAdData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockGoogleAdData,
        message: '获取Google广告数据成功'
      })
    }, 300)
  })
}

export const mockGetCriteoAdData = (): Promise<ApiResponse<CriteoAdData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockCriteoAdData,
        message: '获取Criteo广告数据成功'
      })
    }, 300)
  })
}

export const mockGetBingAdData = (): Promise<ApiResponse<BingAdData[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockBingAdData,
        message: '获取Bing广告数据成功'
      })
    }, 300)
  })
}

// Mock客户目标数据
export const mockCustomerGoals: CustomerGoal[] = [
  {
    id: 1,
    customerId: 1,
    customerName: 'Fashion Store USA',
    projectId: 'proj-001',
    projectName: '春季新品推广',
    goalType: 'monthly',
    goalPeriod: '2025-01',
    salesTarget: 50000,
    costTarget: 30000,
    roiTarget: 1.67,
    profitTarget: 20000,
    userTarget: 2500,
    salesActual: 42000,
    costActual: 28000,
    roiActual: 1.5,
    profitActual: 14000,
    userActual: 2100,
    salesProgress: 84,
    costProgress: 93,
    roiProgress: 90,
    profitProgress: 70,
    userProgress: 84,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    createdAt: '2024-12-20',
    createdBy: '张小明',
    lastUpdated: '2025-01-07',
    notes: '春季新品推广活动，重点关注转化率提升'
  },
  {
    id: 2,
    customerId: 1,
    customerName: 'Fashion Store USA',
    projectId: 'proj-002',
    projectName: '夏季促销活动',
    goalType: 'quarterly',
    goalPeriod: '2025-Q1',
    salesTarget: 180000,
    costTarget: 110000,
    roiTarget: 1.64,
    profitTarget: 70000,
    userTarget: 8000,
    salesActual: 165000,
    costActual: 105000,
    roiActual: 1.57,
    profitActual: 60000,
    userActual: 7200,
    salesProgress: 92,
    costProgress: 95,
    roiProgress: 96,
    profitProgress: 86,
    userProgress: 90,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    createdAt: '2024-12-15',
    createdBy: '张小明',
    lastUpdated: '2025-01-07',
    notes: '季度促销活动，关注用户留存'
  },
  {
    id: 3,
    customerId: 2,
    customerName: 'Tech Gadgets Pro',
    projectId: 'proj-003',
    projectName: '智能手机推广',
    goalType: 'monthly',
    goalPeriod: '2025-01',
    salesTarget: 80000,
    costTarget: 45000,
    roiTarget: 1.78,
    profitTarget: 35000,
    userTarget: 3500,
    salesActual: 95000,
    costActual: 42000,
    roiActual: 2.26,
    profitActual: 53000,
    userActual: 4200,
    salesProgress: 119,
    costProgress: 93,
    roiProgress: 127,
    profitProgress: 151,
    userProgress: 120,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    createdAt: '2024-12-18',
    createdBy: '李红',
    lastUpdated: '2025-01-07',
    notes: '智能手机推广超预期完成'
  },
  {
    id: 4,
    customerId: 2,
    customerName: 'Tech Gadgets Pro',
    projectId: 'proj-004',
    projectName: '智能手表营销',
    goalType: 'yearly',
    goalPeriod: '2025',
    salesTarget: 600000,
    costTarget: 380000,
    roiTarget: 1.58,
    profitTarget: 220000,
    userTarget: 25000,
    salesActual: 95000,
    costActual: 60000,
    roiActual: 1.58,
    profitActual: 35000,
    userActual: 4000,
    salesProgress: 16,
    costProgress: 16,
    roiProgress: 100,
    profitProgress: 16,
    userProgress: 16,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-12-31',
    createdAt: '2024-12-10',
    createdBy: '李红',
    lastUpdated: '2025-01-07',
    notes: '年度智能手表营销计划'
  },
  {
    id: 5,
    customerId: 3,
    customerName: 'Beauty Cosmetics',
    projectId: 'proj-005',
    projectName: '护肤品套装推广',
    goalType: 'monthly',
    goalPeriod: '2025-01',
    salesTarget: 35000,
    costTarget: 20000,
    roiTarget: 1.75,
    profitTarget: 15000,
    userTarget: 1800,
    salesActual: 41000,
    costActual: 18000,
    roiActual: 2.28,
    profitActual: 23000,
    userActual: 2100,
    salesProgress: 117,
    costProgress: 90,
    roiProgress: 130,
    profitProgress: 153,
    userProgress: 117,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    createdAt: '2024-12-22',
    createdBy: '王强',
    lastUpdated: '2025-01-07',
    notes: '护肤品套装推广表现优异'
  },
  {
    id: 6,
    customerId: 4,
    customerName: 'Sports Equipment',
    projectId: 'proj-006',
    projectName: '运动鞋推广',
    goalType: 'quarterly',
    goalPeriod: '2025-Q1',
    salesTarget: 120000,
    costTarget: 70000,
    roiTarget: 1.71,
    profitTarget: 50000,
    userTarget: 5000,
    salesActual: 85000,
    costActual: 55000,
    roiActual: 1.55,
    profitActual: 30000,
    userActual: 3500,
    salesProgress: 71,
    costProgress: 79,
    roiProgress: 91,
    profitProgress: 60,
    userProgress: 70,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-03-31',
    createdAt: '2024-12-12',
    createdBy: '赵敏',
    lastUpdated: '2025-01-07',
    notes: '运动鞋推广需要加强投放力度'
  },
  {
    id: 7,
    customerId: 5,
    customerName: 'Home Decoration',
    projectId: 'proj-008',
    projectName: '家具套装推广',
    goalType: 'monthly',
    goalPeriod: '2025-01',
    salesTarget: 45000,
    costTarget: 28000,
    roiTarget: 1.61,
    profitTarget: 17000,
    userTarget: 2200,
    salesActual: 38000,
    costActual: 25000,
    roiActual: 1.52,
    profitActual: 13000,
    userActual: 1900,
    salesProgress: 84,
    costProgress: 89,
    roiProgress: 94,
    profitProgress: 76,
    userProgress: 86,
    status: 'active',
    startDate: '2025-01-01',
    endDate: '2025-01-31',
    createdAt: '2024-12-25',
    createdBy: '孙丽',
    lastUpdated: '2025-01-07',
    notes: '家具套装推广进展稳定'
  }
]

// Mock客户目标汇总数据
export const mockCustomerGoalSummary: CustomerGoalSummary = {
  totalGoals: 7,
  activeGoals: 7,
  completedGoals: 0,
  averageSalesProgress: 92,
  averageROIProgress: 104,
  totalSalesTarget: 510000,
  totalSalesActual: 461000,
  totalCostTarget: 311000,
  totalCostActual: 283000,
  bestPerformingProject: '智能手机推广',
  worstPerformingProject: '运动鞋推广'
}

// 客户目标相关API函数
export const mockGetCustomerGoals = (filter?: CustomerGoalFilter): Promise<ApiResponse<CustomerGoal[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredGoals = [...mockCustomerGoals]

      if (filter) {
        if (filter.goalType) {
          filteredGoals = filteredGoals.filter(goal => goal.goalType === filter.goalType)
        }
        if (filter.customerId) {
          filteredGoals = filteredGoals.filter(goal => goal.customerId === filter.customerId)
        }
        if (filter.projectId) {
          filteredGoals = filteredGoals.filter(goal => goal.projectId === filter.projectId)
        }
        if (filter.status) {
          filteredGoals = filteredGoals.filter(goal => goal.status === filter.status)
        }
        if (filter.goalPeriod) {
          filteredGoals = filteredGoals.filter(goal => goal.goalPeriod === filter.goalPeriod)
        }
      }

      resolve({
        success: true,
        data: filteredGoals
      })
    }, 300)
  })
}

export const mockGetCustomerGoalSummary = (filter?: CustomerGoalFilter): Promise<ApiResponse<CustomerGoalSummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockCustomerGoalSummary
      })
    }, 200)
  })
}

export const mockGetCustomerGoalDetails = (goalId: number): Promise<ApiResponse<CustomerGoal | null>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const goal = mockCustomerGoals.find(g => g.id === goalId)
      resolve({
        success: true,
        data: goal || null
      })
    }, 200)
  })
}

export const mockGetCustomerGoalsByPeriod = (goalType: 'monthly' | 'quarterly' | 'yearly', period: string): Promise<ApiResponse<CustomerGoal[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const filteredGoals = mockCustomerGoals.filter(goal =>
        goal.goalType === goalType && goal.goalPeriod === period
      )
      resolve({
        success: true,
        data: filteredGoals
      })
    }, 200)
  })
}

// Meta数据看板Mock数据
export const mockMetaAccounts = [
  {
    id: 'meta-001',
    name: 'Fashion Store Meta Account',
    status: 'active',
    statusText: '正常',
    balance: '$15,280.50',
    currency: 'USD'
  },
  {
    id: 'meta-002',
    name: 'Tech Gadgets Meta Account',
    status: 'limited',
    statusText: '受限',
    balance: '$8,950.20',
    currency: 'USD'
  },
  {
    id: 'meta-003',
    name: 'Beauty Cosmetics Meta Account',
    status: 'active',
    statusText: '正常',
    balance: '$22,150.75',
    currency: 'USD'
  }
]

export const mockMetaAlerts = [
  {
    id: 1,
    type: 'balance',
    title: '账户余额不足',
    message: 'Fashion Store Meta Account 余额低于 $1000',
    value: '$850.20',
    priority: 'high',
    createdAt: '2025-01-07 10:30:00'
  },
  {
    id: 2,
    type: 'performance',
    title: '广告表现异常',
    message: 'CTR 下降超过 30%',
    value: '1.2%',
    priority: 'medium',
    createdAt: '2025-01-07 09:15:00'
  },
  {
    id: 3,
    type: 'creative',
    title: '素材效果下降',
    message: '视频广告 ROAS 下降 25%',
    value: '2.8x',
    priority: 'medium',
    createdAt: '2025-01-07 08:45:00'
  },
  {
    id: 4,
    type: 'budget',
    title: '预算使用提醒',
    message: '日预算已使用 85%',
    value: '$1,275',
    priority: 'low',
    createdAt: '2025-01-07 08:00:00'
  }
]

export const mockMetaAccountOverview = {
  // 账户总览数据
  totalSpend: 58420.50,
  totalSpendChange: 12.5,
  dailyAverage: 8345.79,
  dailyAverageChange: -3.2,
  adRevenue: 245680.30,
  adRevenueChange: 18.7,
  roas: 4.2,
  roasChange: 8.3,
  users: 125400,
  usersChange: 15.2,
  cpc: 1.85,
  cpcChange: -5.1,

  // 趋势数据
  trendData: {
    labels: ['1月1日', '1月2日', '1月3日', '1月4日', '1月5日', '1月6日', '1月7日'],
    datasets: [
      {
        label: '收入',
        data: [32500, 34200, 31800, 36500, 35100, 38200, 39800],
        color: '#52c41a'
      },
      {
        label: '花费',
        data: [8200, 8600, 7900, 9100, 8750, 9500, 9900],
        color: '#1890ff'
      },
      {
        label: '客单价',
        data: [85, 88, 82, 92, 89, 95, 98],
        color: '#fa8c16'
      }
    ]
  },

  salesRoasTrendData: {
    labels: ['1月1日', '1月2日', '1月3日', '1月4日', '1月5日', '1月6日', '1月7日'],
    datasets: [
      {
        label: '销量',
        data: [382, 389, 387, 396, 394, 402, 406],
        color: '#722ed1'
      },
      {
        label: 'ROAS',
        data: [3.96, 3.98, 4.02, 4.01, 4.01, 4.02, 4.02],
        color: '#eb2f96'
      }
    ]
  }
}

export const mockMetaDailyData = [
  {
    date: '2025-01-07',
    spend: 9850.20,
    revenue: 39800.50,
    roas: 4.04,
    aov: 98.50,
    sales: 404,
    conversionCost: 24.38,
    customerPrice: 98.50,
    conversionRate: 3.2,
    addToCartCost: 8.50,
    addToCartRate: 12.5,
    users: 18500,
    ctr: 2.8,
    cpm: 15.20
  },
  {
    date: '2025-01-06',
    spend: 9500.00,
    revenue: 38200.00,
    roas: 4.02,
    aov: 95.00,
    sales: 402,
    conversionCost: 23.64,
    customerPrice: 95.00,
    conversionRate: 3.1,
    addToCartCost: 8.20,
    addToCartRate: 12.2,
    users: 17800,
    ctr: 2.7,
    cpm: 14.80
  },
  {
    date: '2025-01-05',
    spend: 8750.00,
    revenue: 35100.00,
    roas: 4.01,
    aov: 89.00,
    sales: 394,
    conversionCost: 22.21,
    customerPrice: 89.00,
    conversionRate: 3.0,
    addToCartCost: 7.90,
    addToCartRate: 11.8,
    users: 16900,
    ctr: 2.6,
    cpm: 14.50
  },
  {
    date: '2025-01-04',
    spend: 9100.00,
    revenue: 36500.00,
    roas: 4.01,
    aov: 92.00,
    sales: 396,
    conversionCost: 22.98,
    customerPrice: 92.00,
    conversionRate: 3.1,
    addToCartCost: 8.10,
    addToCartRate: 12.0,
    users: 17200,
    ctr: 2.7,
    cpm: 14.70
  },
  {
    date: '2025-01-03',
    spend: 7900.00,
    revenue: 31800.00,
    roas: 4.02,
    aov: 82.00,
    sales: 387,
    conversionCost: 20.41,
    customerPrice: 82.00,
    conversionRate: 3.2,
    addToCartCost: 7.50,
    addToCartRate: 11.5,
    users: 16200,
    ctr: 2.8,
    cpm: 14.20
  },
  {
    date: '2025-01-02',
    spend: 8600.00,
    revenue: 34200.00,
    roas: 3.98,
    aov: 88.00,
    sales: 389,
    conversionCost: 22.11,
    customerPrice: 88.00,
    conversionRate: 2.9,
    addToCartCost: 7.80,
    addToCartRate: 11.2,
    users: 16800,
    ctr: 2.5,
    cpm: 14.40
  },
  {
    date: '2025-01-01',
    spend: 8200.00,
    revenue: 32500.00,
    roas: 3.96,
    aov: 85.00,
    sales: 382,
    conversionCost: 21.47,
    customerPrice: 85.00,
    conversionRate: 2.8,
    addToCartCost: 7.60,
    addToCartRate: 10.8,
    users: 16500,
    ctr: 2.4,
    cpm: 14.10
  }
]

export const mockMetaAdObjectives = [
  {
    objective: 'conversion',
    name: '转化广告',
    spend: 35420.50,
    revenue: 148200.30,
    roas: 4.18,
    aov: 80.43,
    sales: 1842,
    customerPrice: 80.43,
    conversionCost: 19.24,
    conversionRate: 2.7,
    addToCartCost: 6.89,
    addToCartRate: 7.5,
    users: 68600,
    ctr: 2.8,
    cpm: 14.45
  },
  {
    objective: 'traffic',
    name: '流量广告',
    spend: 15800.00,
    revenue: 68500.00,
    roas: 4.33,
    aov: 54.54,
    sales: 1256,
    customerPrice: 54.54,
    conversionCost: 12.58,
    conversionRate: 2.4,
    addToCartCost: 4.28,
    addToCartRate: 6.8,
    users: 52400,
    ctr: 2.8,
    cpm: 8.54
  },
  {
    objective: 'brand_awareness',
    name: '品牌广告',
    spend: 7200.00,
    revenue: 28980.00,
    roas: 4.03,
    aov: 56.60,
    sales: 512,
    customerPrice: 56.60,
    conversionCost: 14.06,
    conversionRate: 2.0,
    addToCartCost: 4.50,
    addToCartRate: 5.2,
    users: 25600,
    ctr: 0.8,
    cpm: 2.25
  }
]

export const mockMetaAdObjectivesChartData = {
  spendData: [
    { name: '转化广告', value: 35420.50, color: '#1890ff' },
    { name: '流量广告', value: 15800.00, color: '#52c41a' },
    { name: '品牌广告', value: 7200.00, color: '#fa8c16' }
  ],
  revenueData: [
    { name: '转化广告', value: 148200.30, color: '#1890ff' },
    { name: '流量广告', value: 68500.00, color: '#52c41a' },
    { name: '品牌广告', value: 28980.00, color: '#fa8c16' }
  ]
}

// Meta广告数据层级
export const mockMetaAdLayers = {
  // 曝光层
  exposure: [
    {
      date: '2025-01-07',
      amountSpent: 9850.20,
      impressions: 425000,
      cpm: 23.18,
      reach: 185000,
      frequency: 2.3,
      clicks: 11900,
      ctr: 2.8,
      cpc: 0.83
    },
    {
      date: '2025-01-06',
      amountSpent: 9500.00,
      impressions: 410000,
      cpm: 23.17,
      reach: 178000,
      frequency: 2.3,
      clicks: 11070,
      ctr: 2.7,
      cpc: 0.86
    },
    {
      date: '2025-01-05',
      amountSpent: 8750.00,
      impressions: 385000,
      cpm: 22.73,
      reach: 165000,
      frequency: 2.3,
      clicks: 10010,
      ctr: 2.6,
      cpc: 0.87
    }
  ],

  // 互动及视频播放指标
  engagement: [
    {
      date: '2025-01-07',
      postEngagement: 5420,
      costPerPostEngagement: 1.82,
      videoPlays: 28500,
      videoAveragePlayTime: 15.2,
      videoPlays3s: 22800,
      costPerVideoPlay3s: 0.43,
      thruPlays: 12500,
      costPerThruPlay: 0.79
    },
    {
      date: '2025-01-06',
      postEngagement: 5180,
      costPerPostEngagement: 1.83,
      videoPlays: 27200,
      videoAveragePlayTime: 14.8,
      videoPlays3s: 21800,
      costPerVideoPlay3s: 0.44,
      thruPlays: 11900,
      costPerThruPlay: 0.80
    },
    {
      date: '2025-01-05',
      postEngagement: 4850,
      costPerPostEngagement: 1.80,
      videoPlays: 25600,
      videoAveragePlayTime: 14.5,
      videoPlays3s: 20500,
      costPerVideoPlay3s: 0.43,
      thruPlays: 11200,
      costPerThruPlay: 0.78
    }
  ],

  // 点击及意向层指标
  clickIntent: [
    {
      date: '2025-01-07',
      linkClicks: 8950,
      linkCTR: 2.1,
      costPerLinkClick: 1.10,
      landingPageViews: 7850,
      costPerLandingPageView: 1.25,
      contentViews: 9200,
      costPerContentView: 1.07,
      addToCarts: 1158,
      costPerAddToCart: 8.51,
      checkoutsInitiated: 642,
      costPerCheckoutsInitiated: 15.34
    },
    {
      date: '2025-01-06',
      linkClicks: 8420,
      linkCTR: 2.1,
      costPerLinkClick: 1.13,
      landingPageViews: 7380,
      costPerLandingPageView: 1.29,
      contentViews: 8650,
      costPerContentView: 1.10,
      addToCarts: 1095,
      costPerAddToCart: 8.68,
      checkoutsInitiated: 598,
      costPerCheckoutsInitiated: 15.89
    },
    {
      date: '2025-01-05',
      linkClicks: 7850,
      linkCTR: 2.0,
      costPerLinkClick: 1.11,
      landingPageViews: 6890,
      costPerLandingPageView: 1.27,
      contentViews: 8100,
      costPerContentView: 1.08,
      addToCarts: 1020,
      costPerAddToCart: 8.58,
      checkoutsInitiated: 558,
      costPerCheckoutsInitiated: 15.68
    }
  ],

  // 购物结果指标
  shopping: [
    {
      date: '2025-01-07',
      purchaseRoas: 4.04,
      purchases: 404,
      costPerPurchase: 24.38,
      purchaseConversionValue: 39800.50,
      avgPurchaseConversionValue: 98.50,
      purchaseRatePerLandingPageView: 5.1,
      purchaseRatePerLinkClick: 4.5
    },
    {
      date: '2025-01-06',
      purchaseRoas: 4.02,
      purchases: 402,
      costPerPurchase: 23.64,
      purchaseConversionValue: 38200.00,
      avgPurchaseConversionValue: 95.00,
      purchaseRatePerLandingPageView: 5.4,
      purchaseRatePerLinkClick: 4.8
    },
    {
      date: '2025-01-05',
      purchaseRoas: 4.01,
      purchases: 394,
      costPerPurchase: 22.21,
      purchaseConversionValue: 35100.00,
      avgPurchaseConversionValue: 89.00,
      purchaseRatePerLandingPageView: 5.7,
      purchaseRatePerLinkClick: 5.0
    }
  ]
}

// 获取Meta数据看板数据的Mock函数
export const mockGetMetaAccountOverview = (): Promise<ApiResponse<typeof mockMetaAccountOverview>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaAccountOverview
      })
    }, 300)
  })
}

export const mockGetMetaAccounts = (): Promise<ApiResponse<typeof mockMetaAccounts>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaAccounts
      })
    }, 200)
  })
}

export const mockGetMetaAlerts = (): Promise<ApiResponse<typeof mockMetaAlerts>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaAlerts
      })
    }, 200)
  })
}

export const mockGetMetaDailyData = (): Promise<ApiResponse<typeof mockMetaDailyData>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaDailyData
      })
    }, 300)
  })
}

export const mockGetMetaAdObjectives = (): Promise<ApiResponse<typeof mockMetaAdObjectives>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaAdObjectives
      })
    }, 200)
  })
}

export const mockGetMetaAdLayers = (): Promise<ApiResponse<typeof mockMetaAdLayers>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaAdLayers
      })
    }, 300)
  })
}

// 自定义数据指标选择
export const mockMetaCustomMetrics = {
  // 曝光层指标
  exposure: [
    { id: 'amountSpent', name: 'Amount spent(已花费金额)', selected: true },
    { id: 'impressions', name: 'Impressions(展示次数)', selected: true },
    { id: 'views', name: 'Views(浏览量)', selected: false },
    { id: 'cpm', name: 'CPM(千次展示费用)', selected: true },
    { id: 'reach', name: 'Reach(覆盖人数)', selected: true },
    { id: 'costPer1000Reach', name: 'Cost per 1,000 Accounts Center accounts reached', selected: false },
    { id: 'frequency', name: 'Frequency(频次)', selected: true },
    { id: 'clicksAll', name: 'Clicks(all)点击量(全部)', selected: true },
    { id: 'ctrAll', name: 'CTR(all)点击率(全部)', selected: true },
    { id: 'cpcAll', name: 'CPC(all)单次点击费用(全部)', selected: true }
  ],

  // 互动指标
  engagement: [
    { id: 'facebookLikes', name: 'Facebook likes (Facebook 获赞数)', selected: false },
    { id: 'costPerLike', name: 'Cost per Like(单次点赞费用)', selected: false },
    { id: 'pageEngagement', name: 'Page engagement(公共主页互动)', selected: false },
    { id: 'costPerPageEngagement', name: 'Cost per Page engagement(单次公共主页互动费用)', selected: false },
    { id: 'postComments', name: 'Post comments(帖子评论)', selected: false },
    { id: 'postEngagement', name: 'Post engagement(帖文互动)', selected: true },
    { id: 'costPerPostEngagement', name: 'Cost per post engagement(单次帖文互动费用)', selected: true }
  ],

  // 视频播放指标
  video: [
    { id: 'videoPlays', name: 'Video plays(视频播放量)', selected: true },
    { id: 'videoAveragePlayTime', name: 'Video average play time(视频平均播放时长)', selected: true },
    { id: 'videoPlays25', name: 'Video plays at 25%(视频播放进度达25%的次数)', selected: false },
    { id: 'videoPlays50', name: 'Video plays at 50%(视频播放进度达50%的次数)', selected: false },
    { id: 'videoPlays75', name: 'Video plays at 75%(视频播放进度达75%的次数)', selected: false },
    { id: 'videoPlays95', name: 'Video plays at 95%(视频播放进度达95%的次数)', selected: false },
    { id: 'videoPlays100', name: 'Video plays at 100%(视频播放进度达100%的次数)', selected: false },
    { id: 'videoPlays3s', name: '3-second video plays(播放视频达3秒的次数)', selected: true },
    { id: 'costPerVideoPlay3s', name: 'Cost per 3-second video play(播放视频达3秒的单次费用)', selected: true },
    { id: 'thruPlays', name: 'ThruPlays (ThruPlay 次数)', selected: true },
    { id: 'costPerThruPlay', name: 'Cost per ThruPlay(单次ThruPlay费用)', selected: true }
  ],

  // 点击意向层
  clickIntent: [
    { id: 'linkClicks', name: 'Link clicks(链接点击量)', selected: true },
    { id: 'linkCTR', name: 'CTR(link click-through rate)(链接点击率)', selected: true },
    { id: 'costPerLinkClick', name: 'CPC(cost per link click)(单次链接点击费用)', selected: true },
    { id: 'outboundClicks', name: 'Outbound Clicks(出站点击量)', selected: false },
    { id: 'outboundCTR', name: 'Outbound CTR(click-through rate)(出站点击率)', selected: false },
    { id: 'costPerOutboundClick', name: 'Cost per outbound click(单次出站点击费用)', selected: false },
    { id: 'instagramProfileVisits', name: 'Instagram profile visits(Instagram主页访问量)', selected: false },
    { id: 'uniqueLinkClicks', name: 'Unique link clicks(链接点击量-独立用户)', selected: false },
    { id: 'uniqueLinkCTR', name: 'Unique CTR(link click-through rate)(链接点击率-独立用户)', selected: false },
    { id: 'costPerUniqueLinkClick', name: 'Cost per unique link click(单次链接点击费用(全部)-独立用户)', selected: false }
  ],

  // 转化层
  conversion: [
    { id: 'landingPageViews', name: 'Landing page views(落地页浏览量)', selected: true },
    { id: 'costPerLandingPageView', name: 'Cost per Landing page views', selected: true },
    { id: 'contentViews', name: 'Content views(内容查看)', selected: true },
    { id: 'costPerContentView', name: 'Cost per Content views', selected: true },
    { id: 'addToCarts', name: 'Adds to cart(加入购物车次数)', selected: true },
    { id: 'costPerAddToCart', name: 'Cost per Adds to cart', selected: true },
    { id: 'checkoutsInitiated', name: 'Checkouts initiated(发起结账)', selected: true },
    { id: 'costPerCheckoutsInitiated', name: 'Cost per Checkouts initiated', selected: true },
    { id: 'registrationsCompleted', name: 'Registrations completed(完成注册次数)', selected: false },
    { id: 'costPerRegistrationsCompleted', name: 'Cost per Registrations completed', selected: false },
    { id: 'addsOfPaymentInfo', name: 'Adds of payment info(添加支付信息)', selected: false },
    { id: 'costPerAddsOfPaymentInfo', name: 'Cost per Adds of payment info', selected: false },
    { id: 'leads', name: 'Leads(留下潜在客户信息)', selected: false },
    { id: 'costPerLeads', name: 'Cost per Leads', selected: false },
    { id: 'subscriptions', name: 'Subscriptions(订阅)', selected: false },
    { id: 'costPerSubscriptions', name: 'Cost per Subscriptions', selected: false },
    { id: 'purchaseRoas', name: 'Purchase ROAS(Return on ad spend)(广告花费回报(ROAS)-购物)', selected: true },
    { id: 'purchases', name: 'Purchases(购物)', selected: true },
    { id: 'costPerPurchases', name: 'Cost per Purchases', selected: true },
    { id: 'purchaseConversionValue', name: 'Purchases conversion value(购物转化价值)', selected: true },
    { id: 'avgPurchaseConversionValue', name: 'Average purchases conversion value(平均购物转化价值)', selected: true }
  ],

  // 表现漏斗
  funnel: [
    { id: 'videoPlays3sRatePerImpressions', name: '3-second video plays rate per impressions(单次展示的播放视频达3秒率)', selected: false },
    { id: 'landingPageViewsRatePerLinkClicks', name: 'Landing page views rate per link clicks(单次链接点击的落地页浏览率)', selected: false },
    { id: 'purchaseRatePerLandingPageViews', name: 'Purchases rate per landing page views(单次落地页浏览的购物率)', selected: true },
    { id: 'purchaseRatePerLinkClicks', name: 'Purchases rate per link clicks(单次链接点击的购物率)', selected: true }
  ]
}

// 拉新与再营销数据
export const mockMetaNewVsRemarketing = [
  {
    type: 'new',
    name: '拉新',
    spend: 35420.50,
    revenue: 148200.30,
    aov: 95.50,
    sales: 1552,
    customerPrice: 95.50,
    conversionCost: 22.84,
    conversionRate: 3.1,
    addToCartCost: 8.25,
    addToCartRate: 12.8,
    users: 18500,
    ctr: 2.9,
    cpm: 16.20
  },
  {
    type: 'remarketing',
    name: '再营销',
    spend: 23000.00,
    revenue: 97480.20,
    aov: 105.20,
    sales: 926,
    customerPrice: 105.20,
    conversionCost: 24.84,
    conversionRate: 2.8,
    addToCartCost: 7.80,
    addToCartRate: 11.5,
    users: 12400,
    ctr: 3.2,
    cpm: 14.80
  }
]

export const mockMetaNewVsRemarketingChartData = {
  spendData: [
    { name: '拉新', value: 35420.50, color: '#1890ff' },
    { name: '再营销', value: 23000.00, color: '#52c41a' }
  ],
  revenueData: [
    { name: '拉新', value: 148200.30, color: '#1890ff' },
    { name: '再营销', value: 97480.20, color: '#52c41a' }
  ]
}

// 广告形式数据
export const mockMetaAdFormats = [
  {
    format: 'video',
    name: '视频',
    spend: 28500.20,
    revenue: 118200.50,
    aov: 98.50,
    sales: 1200,
    customerPrice: 98.50,
    conversionCost: 23.75,
    conversionRate: 3.0,
    addToCartCost: 8.10,
    addToCartRate: 12.2,
    users: 15200,
    ctr: 3.1,
    cpm: 18.50
  },
  {
    format: 'dpa',
    name: 'DPA',
    spend: 18420.30,
    revenue: 78500.80,
    aov: 92.80,
    sales: 846,
    customerPrice: 92.80,
    conversionCost: 21.77,
    conversionRate: 3.2,
    addToCartCost: 7.90,
    addToCartRate: 13.1,
    users: 11800,
    ctr: 2.8,
    cpm: 15.20
  },
  {
    format: 'image',
    name: '图片',
    spend: 11500.00,
    revenue: 48980.00,
    aov: 89.20,
    sales: 549,
    customerPrice: 89.20,
    conversionCost: 20.95,
    conversionRate: 2.9,
    addToCartCost: 7.50,
    addToCartRate: 11.8,
    users: 8900,
    ctr: 2.5,
    cpm: 14.10
  }
]

export const mockMetaAdFormatsChartData = {
  spendData: [
    { name: '视频', value: 28500.20, color: '#1890ff' },
    { name: 'DPA', value: 18420.30, color: '#52c41a' },
    { name: '图片', value: 11500.00, color: '#fa8c16' }
  ],
  revenueData: [
    { name: '视频', value: 118200.50, color: '#1890ff' },
    { name: 'DPA', value: 78500.80, color: '#52c41a' },
    { name: '图片', value: 48980.00, color: '#fa8c16' }
  ]
}

// Mock函数
export const mockGetMetaCustomMetrics = (): Promise<ApiResponse<typeof mockMetaCustomMetrics>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaCustomMetrics
      })
    }, 200)
  })
}

export const mockGetMetaNewVsRemarketing = (): Promise<ApiResponse<typeof mockMetaNewVsRemarketing>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaNewVsRemarketing
      })
    }, 300)
  })
}

export const mockGetMetaAdFormats = (): Promise<ApiResponse<typeof mockMetaAdFormats>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaAdFormats
      })
    }, 300)
  })
}

// 落地页广告表现数据
export const mockMetaLandingPages = {
  // 用户转化数据
  userConversion: [
    {
      landingPageName: '首页 - 主页面',
      spend: 12500.20,
      revenue: 52800.50,
      roas: 4.22,
      sales: 536,
      customerPrice: 98.50,
      conversionCost: 23.32,
      conversionRate: 3.1
    },
    {
      landingPageName: '时尚女装 - 分类页',
      spend: 8900.30,
      revenue: 38200.80,
      roas: 4.29,
      sales: 412,
      customerPrice: 92.72,
      conversionCost: 21.60,
      conversionRate: 3.2
    },
    {
      landingPageName: '夏季连衣裙 - 产品页',
      spend: 15200.50,
      revenue: 61500.20,
      roas: 4.04,
      sales: 628,
      customerPrice: 97.93,
      conversionCost: 24.21,
      conversionRate: 2.9
    },
    {
      landingPageName: '新品上市 - 活动页',
      spend: 6800.00,
      revenue: 25900.00,
      roas: 3.81,
      sales: 285,
      customerPrice: 90.88,
      conversionCost: 23.86,
      conversionRate: 2.7
    },
    {
      landingPageName: '品牌故事 - 关于我们',
      spend: 9200.80,
      revenue: 35600.40,
      roas: 3.87,
      sales: 368,
      customerPrice: 96.74,
      conversionCost: 25.00,
      conversionRate: 2.8
    },
    {
      landingPageName: '秋冬外套 - 产品页',
      spend: 11800.60,
      revenue: 48500.20,
      roas: 4.11,
      sales: 495,
      customerPrice: 98.00,
      conversionCost: 23.84,
      conversionRate: 3.0
    },
    {
      landingPageName: '限时折扣 - 促销页',
      spend: 7500.00,
      revenue: 31200.00,
      roas: 4.16,
      sales: 325,
      customerPrice: 96.00,
      conversionCost: 23.08,
      conversionRate: 3.3
    },
    {
      landingPageName: '配饰专区 - 分类页',
      spend: 5600.40,
      revenue: 22800.50,
      roas: 4.07,
      sales: 238,
      customerPrice: 95.80,
      conversionCost: 23.53,
      conversionRate: 2.9
    },
    {
      landingPageName: '会员专享 - 会员页',
      spend: 8300.20,
      revenue: 35100.80,
      roas: 4.23,
      sales: 365,
      customerPrice: 96.16,
      conversionCost: 22.74,
      conversionRate: 3.4
    },
    {
      landingPageName: '客户评价 - 评价页',
      spend: 4200.50,
      revenue: 17500.20,
      roas: 4.17,
      sales: 182,
      customerPrice: 96.15,
      conversionCost: 23.08,
      conversionRate: 3.1
    }
  ],

  // 用户加购转化数据
  userAddToCart: [
    {
      landingPageName: '首页 - 主页面',
      spend: 12500.20,
      addPaymentInfo: 1280,
      addPaymentInfoCost: 9.77,
      initiateCheckout: 856,
      initiateCheckoutCost: 14.60,
      addToCart: 1520,
      addToCartCost: 8.22,
      addToCartRate: 13.2
    },
    {
      landingPageName: '时尚女装 - 分类页',
      spend: 8900.30,
      addPaymentInfo: 920,
      addPaymentInfoCost: 9.67,
      initiateCheckout: 625,
      initiateCheckoutCost: 14.24,
      addToCart: 1105,
      addToCartCost: 8.05,
      addToCartRate: 12.8
    },
    {
      landingPageName: '夏季连衣裙 - 产品页',
      spend: 15200.50,
      addPaymentInfo: 1450,
      addPaymentInfoCost: 10.48,
      initiateCheckout: 980,
      initiateCheckoutCost: 15.51,
      addToCart: 1720,
      addToCartCost: 8.84,
      addToCartRate: 12.5
    },
    {
      landingPageName: '新品上市 - 活动页',
      spend: 6800.00,
      addPaymentInfo: 680,
      addPaymentInfoCost: 10.00,
      initiateCheckout: 450,
      initiateCheckoutCost: 15.11,
      addToCart: 820,
      addToCartCost: 8.29,
      addToCartRate: 11.8
    },
    {
      landingPageName: '品牌故事 - 关于我们',
      spend: 9200.80,
      addPaymentInfo: 980,
      addPaymentInfoCost: 9.39,
      initiateCheckout: 652,
      initiateCheckoutCost: 14.11,
      addToCart: 1150,
      addToCartCost: 8.00,
      addToCartRate: 12.9
    },
    {
      landingPageName: '秋冬外套 - 产品页',
      spend: 11800.60,
      addPaymentInfo: 1180,
      addPaymentInfoCost: 10.00,
      initiateCheckout: 785,
      initiateCheckoutCost: 15.03,
      addToCart: 1420,
      addToCartCost: 8.31,
      addToCartRate: 13.1
    },
    {
      landingPageName: '限时折扣 - 促销页',
      spend: 7500.00,
      addPaymentInfo: 820,
      addPaymentInfoCost: 9.15,
      initiateCheckout: 550,
      initiateCheckoutCost: 13.64,
      addToCart: 980,
      addToCartCost: 7.65,
      addToCartRate: 13.8
    },
    {
      landingPageName: '配饰专区 - 分类页',
      spend: 5600.40,
      addPaymentInfo: 590,
      addPaymentInfoCost: 9.49,
      initiateCheckout: 395,
      initiateCheckoutCost: 14.18,
      addToCart: 720,
      addToCartCost: 7.78,
      addToCartRate: 12.6
    },
    {
      landingPageName: '会员专享 - 会员页',
      spend: 8300.20,
      addPaymentInfo: 920,
      addPaymentInfoCost: 9.02,
      initiateCheckout: 615,
      initiateCheckoutCost: 13.50,
      addToCart: 1080,
      addToCartCost: 7.69,
      addToCartRate: 14.2
    },
    {
      landingPageName: '客户评价 - 评价页',
      spend: 4200.50,
      addPaymentInfo: 450,
      addPaymentInfoCost: 9.33,
      initiateCheckout: 298,
      initiateCheckoutCost: 14.09,
      addToCart: 550,
      addToCartCost: 7.64,
      addToCartRate: 12.4
    }
  ],

  // 用户过程数据
  userProcess: [
    {
      landingPageName: '首页 - 主页面',
      spend: 12500.20,
      clicks: 15200,
      cpc: 0.82,
      ctr: 2.9,
      linkClicks: 11800,
      linkCTR: 2.3,
      linkCPC: 1.06,
      contentViews: 13500,
      contentViewCost: 0.93,
      cpm: 18.50
    },
    {
      landingPageName: '时尚女装 - 分类页',
      spend: 8900.30,
      clicks: 11200,
      cpc: 0.79,
      ctr: 3.1,
      linkClicks: 8650,
      linkCTR: 2.4,
      linkCPC: 1.03,
      contentViews: 9800,
      contentViewCost: 0.91,
      cpm: 17.20
    },
    {
      landingPageName: '夏季连衣裙 - 产品页',
      spend: 15200.50,
      clicks: 18500,
      cpc: 0.82,
      ctr: 2.8,
      linkClicks: 14200,
      linkCTR: 2.2,
      linkCPC: 1.07,
      contentViews: 16800,
      contentViewCost: 0.90,
      cpm: 19.80
    },
    {
      landingPageName: '新品上市 - 活动页',
      spend: 6800.00,
      clicks: 8500,
      cpc: 0.80,
      ctr: 2.6,
      linkClicks: 6200,
      linkCTR: 1.9,
      linkCPC: 1.10,
      contentViews: 7500,
      contentViewCost: 0.91,
      cpm: 16.50
    },
    {
      landingPageName: '品牌故事 - 关于我们',
      spend: 9200.80,
      clicks: 11500,
      cpc: 0.80,
      ctr: 2.7,
      linkClicks: 8900,
      linkCTR: 2.1,
      linkCPC: 1.03,
      contentViews: 10200,
      contentViewCost: 0.90,
      cpm: 17.80
    },
    {
      landingPageName: '秋冬外套 - 产品页',
      spend: 11800.60,
      clicks: 14500,
      cpc: 0.81,
      ctr: 2.9,
      linkClicks: 11200,
      linkCTR: 2.3,
      linkCPC: 1.05,
      contentViews: 12800,
      contentViewCost: 0.92,
      cpm: 18.20
    },
    {
      landingPageName: '限时折扣 - 促销页',
      spend: 7500.00,
      clicks: 9800,
      cpc: 0.77,
      ctr: 3.2,
      linkClicks: 7650,
      linkCTR: 2.5,
      linkCPC: 0.98,
      contentViews: 8900,
      contentViewCost: 0.84,
      cpm: 16.80
    },
    {
      landingPageName: '配饰专区 - 分类页',
      spend: 5600.40,
      clicks: 7200,
      cpc: 0.78,
      ctr: 2.8,
      linkClicks: 5500,
      linkCTR: 2.1,
      linkCPC: 1.02,
      contentViews: 6400,
      contentViewCost: 0.88,
      cpm: 16.20
    },
    {
      landingPageName: '会员专享 - 会员页',
      spend: 8300.20,
      clicks: 10500,
      cpc: 0.79,
      ctr: 3.0,
      linkClicks: 8200,
      linkCTR: 2.3,
      linkCPC: 1.01,
      contentViews: 9500,
      contentViewCost: 0.87,
      cpm: 17.50
    },
    {
      landingPageName: '客户评价 - 评价页',
      spend: 4200.50,
      clicks: 5800,
      cpc: 0.72,
      ctr: 2.9,
      linkClicks: 4500,
      linkCTR: 2.2,
      linkCPC: 0.93,
      contentViews: 5200,
      contentViewCost: 0.81,
      cpm: 15.80
    }
  ]
}

export const mockMetaLandingPagesChartData = {
  spendData: [
    { name: 'Product A', value: 12500.20, color: '#1890ff' },
    { name: 'Product B', value: 8900.30, color: '#52c41a' },
    { name: 'Category Fashion', value: 15200.50, color: '#fa8c16' },
    { name: 'Home', value: 6800.00, color: '#722ed1' }
  ],
  revenueData: [
    { name: 'Product A', value: 52800.50, color: '#1890ff' },
    { name: 'Product B', value: 38200.80, color: '#52c41a' },
    { name: 'Category Fashion', value: 61500.20, color: '#fa8c16' },
    { name: 'Home', value: 25900.00, color: '#722ed1' }
  ]
}

// 素材表现数据
export const mockMetaCreatives = {
  // 图片素材
  images: [
    {
      landingPage: '首页 - 主页面',
      preview: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400&h=300&fit=crop',
      spend: 8500.20,
      revenue: 35200.50,
      aov: 98.50,
      roas: 4.14,
      sales: 357,
      customerPrice: 98.50,
      conversionCost: 23.81,
      conversionRate: 3.0,
      addToCartCost: 8.15,
      addToCartRate: 12.5,
      users: 9800,
      ctr: 2.9,
      cpm: 17.50
    },
    {
      landingPage: '时尚女装 - 分类页',
      preview: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop',
      spend: 6200.30,
      revenue: 26800.80,
      aov: 92.80,
      roas: 4.32,
      sales: 289,
      customerPrice: 92.80,
      conversionCost: 21.46,
      conversionRate: 3.2,
      addToCartCost: 7.85,
      addToCartRate: 13.1,
      users: 7500,
      ctr: 3.1,
      cpm: 16.20
    },
    {
      landingPage: '夏季连衣裙 - 产品页',
      preview: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400&h=300&fit=crop',
      spend: 11200.50,
      revenue: 45600.20,
      aov: 95.20,
      roas: 4.07,
      sales: 479,
      customerPrice: 95.20,
      conversionCost: 23.38,
      conversionRate: 2.9,
      addToCartCost: 8.05,
      addToCartRate: 12.2,
      users: 12800,
      ctr: 2.8,
      cpm: 18.80
    },
    {
      landingPage: '新品上市 - 活动页',
      preview: 'https://images.unsplash.com/photo-1472851294608-062f824d29cc?w=400&h=300&fit=crop',
      spend: 9500.40,
      revenue: 38200.60,
      aov: 89.50,
      roas: 4.02,
      sales: 427,
      customerPrice: 89.50,
      conversionCost: 22.25,
      conversionRate: 3.1,
      addToCartCost: 7.95,
      addToCartRate: 12.8,
      users: 11200,
      ctr: 2.7,
      cpm: 16.80
    },
    {
      landingPage: '秋冬外套 - 产品页',
      preview: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop',
      spend: 7800.20,
      revenue: 32100.50,
      aov: 94.20,
      roas: 4.12,
      sales: 341,
      customerPrice: 94.20,
      conversionCost: 22.87,
      conversionRate: 2.9,
      addToCartCost: 8.10,
      addToCartRate: 12.6,
      users: 9500,
      ctr: 2.8,
      cpm: 17.20
    }
  ],

  // 视频素材
  videos: [
    {
      landingPage: '首页 - 主页面',
      preview: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      spend: 15200.80,
      revenue: 68500.20,
      aov: 105.50,
      roas: 4.51,
      sales: 649,
      customerPrice: 105.50,
      conversionCost: 23.42,
      conversionRate: 3.3,
      addToCartCost: 8.55,
      addToCartRate: 13.8,
      users: 18500,
      ctr: 3.2,
      cpm: 19.50
    },
    {
      landingPage: '时尚女装 - 分类页',
      preview: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_2mb.mp4',
      spend: 12800.50,
      revenue: 56200.30,
      aov: 98.20,
      roas: 4.39,
      sales: 572,
      customerPrice: 98.20,
      conversionCost: 22.38,
      conversionRate: 3.1,
      addToCartCost: 8.20,
      addToCartRate: 13.2,
      users: 15200,
      ctr: 3.0,
      cpm: 18.20
    },
    {
      landingPage: '夏季连衣裙 - 产品页',
      preview: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_5mb.mp4',
      spend: 18500.20,
      revenue: 78900.50,
      aov: 102.80,
      roas: 4.27,
      sales: 767,
      customerPrice: 102.80,
      conversionCost: 24.12,
      conversionRate: 2.9,
      addToCartCost: 8.90,
      addToCartRate: 12.8,
      users: 22800,
      ctr: 2.9,
      cpm: 20.50
    }
  ]
}

// Mock函数
export const mockGetMetaLandingPages = (): Promise<ApiResponse<typeof mockMetaLandingPages>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaLandingPages
      })
    }, 300)
  })
}

export const mockGetMetaCreatives = (): Promise<ApiResponse<typeof mockMetaCreatives>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaCreatives
      })
    }, 300)
  })
}

// 快速添加剩余功能的Mock数据
export const mockMetaRemainingFeatures = {
  // 目录广告
  catalogAds: {
    adTypes: [
      { type: 'Facebook', spend: 25420.50, roas: 4.2, customerPrice: 95.50, conversionRate: 3.1, addToCartRate: 12.5, ctr: 2.8, users: 15200, cpc: 0.85, cpm: 18.50 },
      { type: 'Instagram', spend: 18200.30, roas: 4.5, customerPrice: 102.20, conversionRate: 3.3, addToCartRate: 13.2, ctr: 3.1, users: 12800, cpc: 0.78, cpm: 16.20 },
      { type: 'Audience_network', spend: 8900.20, roas: 3.8, customerPrice: 88.50, conversionRate: 2.9, addToCartRate: 11.8, ctr: 2.5, users: 8500, cpc: 0.92, cpm: 19.80 },
      { type: 'Messenger', spend: 5200.00, roas: 3.9, customerPrice: 91.20, conversionRate: 2.8, addToCartRate: 11.2, ctr: 2.6, users: 6200, cpc: 0.88, cpm: 17.50 }
    ],
    catalogGroups: [
      { productId: 'PROD-001', spend: 12500.20, ctr: 2.9, users: 9800, cpc: 0.82, cpm: 18.50 },
      { productId: 'PROD-002', spend: 8900.30, ctr: 3.1, users: 7500, cpc: 0.79, cpm: 17.20 },
      { productId: 'PROD-003', spend: 15200.50, ctr: 2.8, users: 12800, cpc: 0.85, cpm: 19.80 }
    ]
  },

  // 受众类型
  audienceTypes: {
    summary: [
      { type: 'interest', name: '兴趣受众', spend: 28500.20, revenue: 118200.50, aov: 98.50, roas: 4.14, sales: 1200, customerPrice: 98.50, conversionCost: 23.75, conversionRate: 3.0, addToCartCost: 8.10, addToCartRate: 12.2, users: 15200, ctr: 3.1, cpm: 18.50 },
      { type: 'lookalike', name: '类似受众', spend: 18420.30, revenue: 78500.80, aov: 92.80, roas: 4.26, sales: 846, customerPrice: 92.80, conversionCost: 21.77, conversionRate: 3.2, addToCartCost: 7.90, addToCartRate: 13.1, users: 11800, ctr: 2.8, cpm: 15.20 },
      { type: 'asc', name: 'ASC', spend: 11500.00, revenue: 48980.00, aov: 89.20, roas: 4.26, sales: 549, customerPrice: 89.20, conversionCost: 20.95, conversionRate: 2.9, addToCartCost: 7.50, addToCartRate: 11.8, users: 8900, ctr: 2.5, cpm: 14.10 },
      { type: 'remarketing', name: '再营销受众', spend: 9800.50, revenue: 42500.70, aov: 95.80, roas: 4.34, sales: 444, customerPrice: 95.80, conversionCost: 22.07, conversionRate: 3.1, addToCartCost: 7.95, addToCartRate: 12.0, users: 7800, ctr: 2.9, cpm: 16.50 }
    ],
    interestDetails: [
      { adGroupName: '时尚爱好者', spend: 12500.20, roas: 4.2, sales: 536, customerPrice: 98.50, conversionRate: 3.1, conversionCost: 23.32, addToCartRate: 12.5, addToCartCost: 8.15, users: 9800, ctr: 2.9, cpc: 0.82, cpm: 18.50 },
      { adGroupName: '美妆达人', spend: 8900.30, roas: 4.1, sales: 412, customerPrice: 92.72, conversionRate: 3.0, conversionCost: 21.60, addToCartRate: 12.2, addToCartCost: 7.85, users: 7500, ctr: 2.8, cpc: 0.79, cpm: 17.20 }
    ]
  },

  // 用户画像
  demographics: {
    age: [
      { ageRange: '18-24', spend: 15200.50, revenue: 61500.20, aov: 97.93, roas: 4.04, sales: 628, customerPrice: 97.93, conversionCost: 24.21, conversionRate: 2.9, addToCartCost: 8.84, addToCartRate: 12.5, users: 12800, ctr: 2.8, cpm: 18.80 },
      { ageRange: '25-34', spend: 22800.20, revenue: 95200.80, aov: 105.50, roas: 4.17, sales: 902, customerPrice: 105.50, conversionCost: 25.28, conversionRate: 3.1, addToCartCost: 8.95, addToCartRate: 12.8, users: 18500, ctr: 3.0, cpm: 19.50 },
      { ageRange: '35-44', spend: 18500.30, revenue: 76800.50, aov: 98.20, roas: 4.15, sales: 782, customerPrice: 98.20, conversionCost: 23.66, conversionRate: 3.0, addToCartCost: 8.25, addToCartRate: 12.2, users: 15200, ctr: 2.9, cpm: 18.20 }
    ],
    gender: [
      { gender: '女性', spend: 38500.20, revenue: 165200.50, aov: 102.80, roas: 4.29, sales: 1607, customerPrice: 102.80, conversionCost: 23.96, conversionRate: 3.1, addToCartCost: 8.75, addToCartRate: 12.8, users: 28500, ctr: 3.0, cpm: 19.20 },
      { gender: '男性', spend: 18000.80, revenue: 68300.00, aov: 91.50, roas: 3.79, sales: 747, customerPrice: 91.50, conversionCost: 24.10, conversionRate: 2.8, addToCartCost: 8.20, addToCartRate: 11.5, users: 16000, ctr: 2.7, cpm: 17.80 }
    ],
    device: [
      { device: 'Mobile_app', spend: 35200.50, revenue: 148500.20, aov: 98.50, roas: 4.22, sales: 1507, customerPrice: 98.50, conversionCost: 23.36, conversionRate: 3.0, addToCartCost: 8.45, addToCartRate: 12.5, users: 26800, ctr: 2.9, cpm: 18.50 },
      { device: 'Desktop', spend: 15800.30, revenue: 65200.80, aov: 105.20, roas: 4.13, sales: 620, customerPrice: 105.20, conversionCost: 25.48, conversionRate: 2.9, addToCartCost: 8.85, addToCartRate: 12.0, users: 12500, ctr: 2.8, cpm: 19.80 },
      { device: 'Mobile_web', spend: 5500.20, revenue: 19800.50, aov: 88.50, roas: 3.60, sales: 227, customerPrice: 88.50, conversionCost: 24.23, conversionRate: 2.7, addToCartCost: 8.15, addToCartRate: 11.2, users: 5200, ctr: 2.5, cpm: 16.50 }
    ]
  }
}

export const mockGetMetaRemainingFeatures = (): Promise<ApiResponse<typeof mockMetaRemainingFeatures>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaRemainingFeatures
      })
    }, 300)
  })
}

// 目录广告数据
export const mockGetMetaCatalogAds = (): Promise<ApiResponse<typeof mockMetaRemainingFeatures.catalogAds>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaRemainingFeatures.catalogAds
      })
    }, 300)
  })
}

// 受众类型数据
export const mockGetMetaAudienceTypes = (): Promise<ApiResponse<typeof mockMetaRemainingFeatures.audienceTypes>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaRemainingFeatures.audienceTypes
      })
    }, 300)
  })
}

// 用户画像数据
export const mockGetMetaUserDemographics = (): Promise<ApiResponse<typeof mockMetaRemainingFeatures.demographics>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockMetaRemainingFeatures.demographics
      })
    }, 300)
  })
}

// 落地页数据
export const mockGetMetaLandingPageData = (): Promise<ApiResponse<any[]>> => {
  const landingPageData = [
    {
      url: '/product-page-1',
      name: '产品页面1',
      spend: 1250.00,
      revenue: 3750.00,
      roas: 3.0,
      aov: 125.00,
      sales: 30,
      customerPrice: 125.00,
      conversionCost: 41.67,
      conversionRate: 2.4,
      addToCartCost: 15.63,
      addToCartRate: 8.0,
      users: 520,
      ctr: 1.8,
      cpm: 12.50
    },
    {
      url: '/product-page-2',
      name: '产品页面2',
      spend: 980.00,
      revenue: 2450.00,
      roas: 2.5,
      aov: 98.00,
      sales: 25,
      customerPrice: 98.00,
      conversionCost: 39.20,
      conversionRate: 2.1,
      addToCartCost: 14.29,
      addToCartRate: 7.0,
      users: 450,
      ctr: 1.6,
      cpm: 11.20
    },
    {
      url: '/homepage',
      name: '首页',
      spend: 750.00,
      revenue: 1875.00,
      roas: 2.5,
      aov: 93.75,
      sales: 20,
      customerPrice: 93.75,
      conversionCost: 37.50,
      conversionRate: 2.0,
      addToCartCost: 12.50,
      addToCartRate: 6.0,
      users: 380,
      ctr: 1.4,
      cpm: 10.80
    }
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: landingPageData
      })
    }, 300)
  })
}

// 素材数据
export const mockGetMetaCreativeData = (): Promise<ApiResponse<any[]>> => {
  const creativeData = [
    {
      id: 'creative-1',
      name: '春季促销视频',
      thumbnail: '/avatars/default.svg',
      spend: 1500.00,
      revenue: 4500.00,
      roas: 3.0,
      aov: 150.00,
      sales: 30,
      customerPrice: 150.00,
      conversionCost: 50.00,
      conversionRate: 2.0,
      addToCartCost: 18.75,
      addToCartRate: 8.0,
      users: 600,
      ctr: 2.5,
      cpm: 15.00
    },
    {
      id: 'creative-2',
      name: '产品展示图片',
      thumbnail: '/avatars/default.svg',
      spend: 1200.00,
      revenue: 3000.00,
      roas: 2.5,
      aov: 120.00,
      sales: 25,
      customerPrice: 120.00,
      conversionCost: 48.00,
      conversionRate: 1.8,
      addToCartCost: 17.14,
      addToCartRate: 7.0,
      users: 480,
      ctr: 2.2,
      cpm: 13.50
    },
    {
      id: 'creative-3',
      name: '用户评价轮播',
      thumbnail: '/avatars/default.svg',
      spend: 800.00,
      revenue: 1600.00,
      roas: 2.0,
      aov: 80.00,
      sales: 20,
      customerPrice: 80.00,
      conversionCost: 40.00,
      conversionRate: 1.5,
      addToCartCost: 13.33,
      addToCartRate: 6.0,
      users: 320,
      ctr: 1.8,
      cpm: 11.00
    }
  ]

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: creativeData
      })
    }, 300)
  })
}
