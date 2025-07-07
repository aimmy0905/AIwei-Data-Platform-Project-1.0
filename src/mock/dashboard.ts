import type { Customer, Channel, WebsiteData, Campaign, ProductSales, Alert, ChartData, ApiResponse } from '@/types'

// Mock客户数据
export const mockCustomers: Customer[] = [
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
    lastUpdated: '2025-01-07'
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
    lastUpdated: '2025-01-06'
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
    lastUpdated: '2025-01-05'
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
    lastUpdated: '2024-12-20'
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
    lastUpdated: '2025-01-04'
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
    revenue: 65000,
    users: 12000,
    sessions: 18000,
    conversionRate: 5.2,
    cost: 8000,
    roi: 8.1
  },
  {
    id: 5,
    name: 'Criteo',
    type: 'criteo',
    revenue: 42000,
    users: 6500,
    sessions: 15000,
    conversionRate: 2.1,
    cost: 12000,
    roi: 3.5
  },
  {
    id: 6,
    name: 'Bing Ads',
    type: 'bing',
    revenue: 28000,
    users: 4200,
    sessions: 9500,
    conversionRate: 2.5,
    cost: 8500,
    roi: 3.3
  }
]

// Mock网站数据
export const mockWebsiteData: WebsiteData = {
  totalSales: 1250000,
  totalCost: 285000,
  roi: 4.4,
  orders: 3850,
  averageOrderValue: 324.68,
  conversionRate: 3.2,
  visitors: 125000,
  newUsers: 45000,
  returningUsers: 80000,
  bounceRate: 35.6
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

// Mock产品销售数据
export const mockProductSales: ProductSales[] = [
  {
    id: 1,
    name: '时尚T恤',
    category: '服装',
    price: 29.99,
    soldQuantity: 1250,
    revenue: 37487.5,
    profit: 18000,
    stock: 450,
    image: '/products/tshirt.jpg'
  },
  {
    id: 2,
    name: '运动鞋',
    category: '鞋类',
    price: 89.99,
    soldQuantity: 680,
    revenue: 61193.2,
    profit: 28000,
    stock: 120,
    image: '/products/sneakers.jpg'
  },
  {
    id: 3,
    name: '智能手表',
    category: '电子产品',
    price: 199.99,
    soldQuantity: 320,
    revenue: 63996.8,
    profit: 25000,
    stock: 85,
    image: '/products/smartwatch.jpg'
  },
  {
    id: 4,
    name: '护肤套装',
    category: '美容',
    price: 149.99,
    soldQuantity: 420,
    revenue: 62996.8,
    profit: 32000,
    stock: 200,
    image: '/products/skincare.jpg'
  },
  {
    id: 5,
    name: '家用咖啡机',
    category: '家电',
    price: 299.99,
    soldQuantity: 180,
    revenue: 53998.2,
    profit: 22000,
    stock: 45,
    image: '/products/coffee.jpg'
  }
]

// Mock预警数据
export const mockAlerts: Alert[] = [
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
    type: 'stock',
    level: 'critical',
    title: '库存告急',
    message: '运动鞋库存仅剩120件，建议立即补货',
    customerId: 2,
    customerName: 'Tech Gadgets Pro',
    createdAt: '2025-01-07 08:15:00',
    isRead: false
  },
  {
    id: 3,
    type: 'service',
    level: 'medium',
    title: '服务即将到期',
    message: 'Beauty Cosmetics服务合同将于15天后到期',
    customerId: 3,
    customerName: 'Beauty Cosmetics',
    createdAt: '2025-01-06 16:45:00',
    isRead: true
  },
  {
    id: 4,
    type: 'price',
    level: 'low',
    title: '价格变动提醒',
    message: '智能手表价格上涨8%，建议调整广告策略',
    customerId: 2,
    customerName: 'Tech Gadgets Pro',
    createdAt: '2025-01-06 14:20:00',
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

// Mock获取客户列表
export const mockGetCustomers = (): Promise<ApiResponse<Customer[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockCustomers
      })
    }, 500)
  })
}

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
      }
      resolve({
        success: true,
        message: '标记成功'
      })
    }, 300)
  })
}