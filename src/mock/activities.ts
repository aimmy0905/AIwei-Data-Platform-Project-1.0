import type {
  Activity,
  ActivityData,
  ActivityProductData,
  ActivityPageData,
  ActivityDetail,
  ActivitySummary,
  ActivityTemplate,
  ActivityListResponse,
  ApiResponse
} from '@/types'

// Mock活动基础数据
export const mockActivities: Activity[] = [
  {
    id: 1,
    name: '春季新品发布活动',
    type: 'promotion',
    stage: 'formal',
    status: 'running',
    targetMarket: '北美市场',
    content: '春季新品上市，全场8折优惠，满$100免邮费，新用户首单立减$20',
    channels: ['Google Ads', 'Facebook Ads', 'Instagram', 'Email Marketing'],
    projectId: 1,
    projectName: '美妆品牌海外推广项目',
    ownerId: 1,
    ownerName: '张小明',
    startTime: '2024-03-01T00:00:00Z',
    endTime: '2024-03-31T23:59:59Z',
    budget: 50000,
    targetSales: 200000,
    targetROI: 4.0,
    targetConversionRate: 3.5,
    createdBy: 1,
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-03-15T10:30:00Z'
  },
  {
    id: 2,
    name: '618购物节促销',
    type: 'holiday',
    stage: 'warm_up',
    status: 'warm_up',
    targetMarket: '全球市场',
    content: '618购物节预热活动，预售商品享受早鸟价，定金翻倍，限时抢购',
    channels: ['Google Ads', 'Facebook Ads', 'TikTok', 'YouTube'],
    projectId: 2,
    projectName: '时尚服装品牌数字化营销',
    ownerId: 2,
    ownerName: '李美丽',
    startTime: '2024-06-01T00:00:00Z',
    endTime: '2024-06-18T23:59:59Z',
    budget: 100000,
    targetSales: 500000,
    targetROI: 5.0,
    targetConversionRate: 4.0,
    createdBy: 2,
    createdAt: '2024-05-01T09:00:00Z',
    updatedAt: '2024-05-20T14:20:00Z'
  },
  {
    id: 3,
    name: '夏季品牌推广',
    type: 'brand',
    stage: 'formal',
    status: 'ended',
    targetMarket: '欧美市场',
    content: '夏季品牌形象推广，提升品牌知名度，扩大市场份额，建立品牌认知',
    channels: ['Google Ads', 'Facebook Ads', 'Criteo', 'Display Network'],
    projectId: 3,
    projectName: '健康食品品牌营销',
    ownerId: 3,
    ownerName: '王强',
    startTime: '2024-07-01T00:00:00Z',
    endTime: '2024-08-31T23:59:59Z',
    budget: 75000,
    targetSales: 300000,
    targetROI: 4.0,
    targetConversionRate: 3.0,
    createdBy: 3,
    createdAt: '2024-06-10T10:00:00Z',
    updatedAt: '2024-09-01T16:00:00Z'
  },
  {
    id: 4,
    name: '黑五大促销',
    type: 'holiday',
    stage: 'formal',
    status: 'running',
    targetMarket: '北美市场',
    content: '黑色星期五大促销，全场最低5折，满减优惠，限时秒杀',
    channels: ['Google Ads', 'Facebook Ads', 'Bing Ads', 'Amazon DSP'],
    projectId: 4,
    projectName: '电子产品推广',
    ownerId: 4,
    ownerName: '赵敏',
    startTime: '2024-11-20T00:00:00Z',
    endTime: '2024-11-30T23:59:59Z',
    budget: 120000,
    targetSales: 600000,
    targetROI: 5.0,
    targetConversionRate: 4.5,
    createdBy: 4,
    createdAt: '2024-10-15T11:00:00Z',
    updatedAt: '2024-11-25T09:30:00Z'
  },
  {
    id: 5,
    name: '新用户注册礼',
    type: 'other',
    stage: 'formal',
    status: 'running',
    targetMarket: '亚太市场',
    content: '新用户注册即送大礼包，首单享受新人专享价，推荐好友得奖励',
    channels: ['Google Ads', 'Facebook Ads', 'Instagram', 'Snapchat'],
    projectId: 5,
    projectName: '母婴用品推广',
    ownerId: 5,
    ownerName: '陈静',
    startTime: '2024-12-01T00:00:00Z',
    endTime: '2024-12-31T23:59:59Z',
    budget: 80000,
    targetSales: 320000,
    targetROI: 4.0,
    targetConversionRate: 3.8,
    createdBy: 5,
    createdAt: '2024-11-20T13:00:00Z',
    updatedAt: '2024-12-10T15:45:00Z'
  }
]

// Mock活动单日数据
export const mockActivityDailyData: ActivityData[] = [
  // 春季新品发布活动的数据
  {
    id: 1,
    activityId: 1,
    date: '2024-03-15',
    totalSales: 8500,
    totalCost: 2100,
    adSpend: 1800,
    roi: 4.05,
    conversionRate: 3.2,
    orderCount: 42,
    userCount: 1312,
    avgOrderValue: 202.38,
    returnRate: 2.4,
    returnAmount: 204,
    googleSpend: 900,
    googleRevenue: 4200,
    googleROI: 4.67,
    facebookSpend: 600,
    facebookRevenue: 2800,
    facebookROI: 4.67,
    bingSpend: 200,
    bingRevenue: 1000,
    bingROI: 5.0,
    criteoSpend: 100,
    criteoRevenue: 500,
    criteoROI: 5.0,
    updatedAt: '2024-03-15T23:59:59Z'
  },
  {
    id: 2,
    activityId: 1,
    date: '2024-03-14',
    totalSales: 7800,
    totalCost: 1950,
    adSpend: 1650,
    roi: 4.0,
    conversionRate: 3.0,
    orderCount: 39,
    userCount: 1300,
    avgOrderValue: 200.0,
    returnRate: 2.6,
    returnAmount: 203,
    googleSpend: 825,
    googleRevenue: 3900,
    googleROI: 4.73,
    facebookSpend: 550,
    facebookRevenue: 2600,
    facebookROI: 4.73,
    bingSpend: 175,
    bingRevenue: 875,
    bingROI: 5.0,
    criteoSpend: 100,
    criteoRevenue: 425,
    criteoROI: 4.25,
    updatedAt: '2024-03-14T23:59:59Z'
  },
  // 618购物节促销的数据
  {
    id: 3,
    activityId: 2,
    date: '2024-06-10',
    totalSales: 15600,
    totalCost: 3200,
    adSpend: 2800,
    roi: 4.88,
    conversionRate: 4.2,
    orderCount: 78,
    userCount: 1857,
    avgOrderValue: 200.0,
    returnRate: 1.8,
    returnAmount: 281,
    googleSpend: 1400,
    googleRevenue: 7800,
    googleROI: 5.57,
    facebookSpend: 980,
    facebookRevenue: 5460,
    facebookROI: 5.57,
    bingSpend: 280,
    bingRevenue: 1560,
    bingROI: 5.57,
    criteoSpend: 140,
    criteoRevenue: 780,
    criteoROI: 5.57,
    updatedAt: '2024-06-10T23:59:59Z'
  }
]

// Mock活动产品数据
export const mockActivityProductData: ActivityProductData[] = [
  {
    id: 1,
    activityId: 1,
    productId: 'PROD001',
    productTitle: '春季限定保湿面霜 50ml',
    productCategory: '面部护理',
    userCount: 856,
    salesVolume: 124,
    salesAmount: 12400,
    conversionRate: 14.5,
    avgOrderValue: 100.0,
    returnCount: 3,
    returnAmount: 300,
    addToCartCount: 245,
    checkoutCount: 156,
    addToCartRate: 28.6,
    checkoutRate: 18.2,
    date: '2024-03-15',
    updatedAt: '2024-03-15T23:59:59Z',
    momData: {
      userCountChange: 8.5,
      salesVolumeChange: 12.3,
      salesAmountChange: 15.2,
      conversionRateChange: 2.1,
      avgOrderValueChange: 2.5,
      returnRateChange: -0.5,
      addToCartRateChange: 3.2,
      checkoutRateChange: 1.8
    }
  },
  {
    id: 2,
    activityId: 1,
    productId: 'PROD002',
    productTitle: '春季亮肌精华液 30ml',
    productCategory: '精华护理',
    userCount: 642,
    salesVolume: 89,
    salesAmount: 13350,
    conversionRate: 13.9,
    avgOrderValue: 150.0,
    returnCount: 2,
    returnAmount: 300,
    addToCartCount: 178,
    checkoutCount: 112,
    addToCartRate: 27.7,
    checkoutRate: 17.4,
    date: '2024-03-15',
    updatedAt: '2024-03-15T23:59:59Z',
    momData: {
      userCountChange: 6.2,
      salesVolumeChange: 9.8,
      salesAmountChange: 11.5,
      conversionRateChange: 1.5,
      avgOrderValueChange: 1.7,
      returnRateChange: -0.3,
      addToCartRateChange: 2.8,
      checkoutRateChange: 1.2
    }
  },
  {
    id: 3,
    activityId: 2,
    productId: 'PROD003',
    productTitle: '夏季清爽防晒霜 SPF50+',
    productCategory: '防晒护理',
    userCount: 1245,
    salesVolume: 186,
    salesAmount: 11160,
    conversionRate: 14.9,
    avgOrderValue: 60.0,
    returnCount: 4,
    returnAmount: 240,
    addToCartCount: 356,
    checkoutCount: 223,
    addToCartRate: 28.6,
    checkoutRate: 17.9,
    date: '2024-06-10',
    updatedAt: '2024-06-10T23:59:59Z',
    momData: {
      userCountChange: 15.3,
      salesVolumeChange: 18.7,
      salesAmountChange: 16.2,
      conversionRateChange: 2.8,
      avgOrderValueChange: -1.5,
      returnRateChange: 0.2,
      addToCartRateChange: 4.1,
      checkoutRateChange: 2.3
    }
  }
]

// Mock活动页面数据
export const mockActivityPageData: ActivityPageData[] = [
  {
    id: 1,
    activityId: 1,
    pageUrl: 'https://example.com/spring-collection',
    visitCount: 2856,
    userCount: 2134,
    newUserCount: 1567,
    conversionRate: 3.2,
    addToCartCount: 245,
    addToCartRate: 11.5,
    checkoutCount: 156,
    checkoutRate: 7.3,
    bounceRate: 42.5,
    avgStayTime: 185,
    pageViewsPerVisit: 2.8,
    date: '2024-03-15',
    updatedAt: '2024-03-15T23:59:59Z',
    momData: {
      visitCountChange: 8.5,
      userCountChange: 7.2,
      newUserCountChange: 12.3,
      conversionRateChange: 0.5,
      addToCartRateChange: 1.2,
      checkoutRateChange: 0.8,
      bounceRateChange: -2.1,
      avgStayTimeChange: 15.2,
      pageViewsPerVisitChange: 0.3
    }
  },
  {
    id: 2,
    activityId: 1,
    pageUrl: 'https://example.com/spring-skincare',
    visitCount: 1654,
    userCount: 1432,
    newUserCount: 987,
    conversionRate: 4.1,
    addToCartCount: 178,
    addToCartRate: 12.4,
    checkoutCount: 112,
    checkoutRate: 7.8,
    bounceRate: 38.2,
    avgStayTime: 210,
    pageViewsPerVisit: 3.2,
    date: '2024-03-15',
    updatedAt: '2024-03-15T23:59:59Z',
    momData: {
      visitCountChange: 5.8,
      userCountChange: 6.1,
      newUserCountChange: 9.2,
      conversionRateChange: 0.8,
      addToCartRateChange: 1.5,
      checkoutRateChange: 1.1,
      bounceRateChange: -1.8,
      avgStayTimeChange: 22.5,
      pageViewsPerVisitChange: 0.5
    }
  },
  {
    id: 3,
    activityId: 2,
    pageUrl: 'https://example.com/618-sale',
    visitCount: 4256,
    userCount: 3567,
    newUserCount: 2134,
    conversionRate: 4.2,
    addToCartCount: 356,
    addToCartRate: 10.0,
    checkoutCount: 223,
    checkoutRate: 6.3,
    bounceRate: 35.8,
    avgStayTime: 245,
    pageViewsPerVisit: 3.5,
    date: '2024-06-10',
    updatedAt: '2024-06-10T23:59:59Z',
    momData: {
      visitCountChange: 18.2,
      userCountChange: 16.5,
      newUserCountChange: 22.1,
      conversionRateChange: 1.2,
      addToCartRateChange: 2.1,
      checkoutRateChange: 1.5,
      bounceRateChange: -3.2,
      avgStayTimeChange: 35.8,
      pageViewsPerVisitChange: 0.8
    }
  }
]

// Mock活动汇总数据
export const mockActivitySummary: ActivitySummary = {
  totalActivities: 5,
  activeActivities: 3,
  completedActivities: 1,
  totalBudget: 425000,
  totalSpent: 285000,
  totalRevenue: 1250000,
  averageROI: 4.38,
  topPerformingActivity: '618购物节促销',
  totalConversions: 2856
}

// Mock活动模板数据
export const mockActivityTemplates: ActivityTemplate[] = [
  {
    id: 1,
    name: '促销活动模板',
    type: 'promotion',
    description: '适用于各种促销活动的标准模板，包含常用的促销配置',
    config: {
      type: 'promotion',
      stage: 'warm_up',
      channels: ['Google Ads', 'Facebook Ads'],
      targetROI: 4.0,
      targetConversionRate: 3.5
    },
    createdBy: 1,
    createdAt: '2024-01-01T08:00:00Z',
    isPublic: true
  },
  {
    id: 2,
    name: '品牌推广模板',
    type: 'brand',
    description: '专门用于品牌推广活动的模板，注重品牌曝光和认知度',
    config: {
      type: 'brand',
      stage: 'formal',
      channels: ['Google Ads', 'Facebook Ads', 'Display Network'],
      targetROI: 3.0,
      targetConversionRate: 2.5
    },
    createdBy: 1,
    createdAt: '2024-01-01T08:00:00Z',
    isPublic: true
  },
  {
    id: 3,
    name: '节日营销模板',
    type: 'holiday',
    description: '适用于各种节日营销活动的模板，包含节日特色配置',
    config: {
      type: 'holiday',
      stage: 'warm_up',
      channels: ['Google Ads', 'Facebook Ads', 'Instagram', 'TikTok'],
      targetROI: 5.0,
      targetConversionRate: 4.0
    },
    createdBy: 1,
    createdAt: '2024-01-01T08:00:00Z',
    isPublic: true
  }
]

// API模拟函数

// 获取活动列表
export const mockGetActivities = (
  page: number = 1,
  pageSize: number = 10,
  filters?: any
): Promise<ApiResponse<ActivityListResponse>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      let filteredActivities = [...mockActivities]

      // 应用筛选条件
      if (filters) {
        if (filters.status) {
          filteredActivities = filteredActivities.filter(a => a.status === filters.status)
        }
        if (filters.type) {
          filteredActivities = filteredActivities.filter(a => a.type === filters.type)
        }
        if (filters.search) {
          filteredActivities = filteredActivities.filter(a =>
            a.name.toLowerCase().includes(filters.search.toLowerCase()) ||
            a.content.toLowerCase().includes(filters.search.toLowerCase())
          )
        }
      }

      const start = (page - 1) * pageSize
      const end = start + pageSize
      const activities = filteredActivities.slice(start, end)

      resolve({
        success: true,
        data: {
          activities,
          total: filteredActivities.length,
          page,
          pageSize
        },
        message: '获取活动列表成功'
      })
    }, 500)
  })
}

// 获取活动详情
export const mockGetActivityDetail = (activityId: number): Promise<ApiResponse<ActivityDetail>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const activity = mockActivities.find(a => a.id === activityId)
      if (!activity) {
        resolve({
          success: false,
          message: '活动不存在'
        })
        return
      }

      // 构建活动详情数据
      const dailyData = mockActivityDailyData.filter(d => d.activityId === activityId)
      const productData = mockActivityProductData.filter(p => p.activityId === activityId)
      const pageData = mockActivityPageData.filter(p => p.activityId === activityId)

      // 计算概览数据
      const totalSales = dailyData.reduce((sum, d) => sum + d.totalSales, 0)
      const totalCost = dailyData.reduce((sum, d) => sum + d.totalCost, 0)
      const totalOrders = dailyData.reduce((sum, d) => sum + d.orderCount, 0)
      const totalUsers = dailyData.reduce((sum, d) => sum + d.userCount, 0)
      const totalAdSpend = dailyData.reduce((sum, d) => sum + d.adSpend, 0)
      const totalReturnAmount = dailyData.reduce((sum, d) => sum + d.returnAmount, 0)

      const activityDetail: ActivityDetail = {
        ...activity,
        overview: {
          totalSales,
          totalCost,
          roi: totalCost > 0 ? totalSales / totalCost : 0,
          conversionRate: totalUsers > 0 ? (totalOrders / totalUsers) * 100 : 0,
          orderCount: totalOrders,
          userCount: totalUsers,
          avgOrderValue: totalOrders > 0 ? totalSales / totalOrders : 0,
          returnRate: totalSales > 0 ? (totalReturnAmount / totalSales) * 100 : 0,
          returnAmount: totalReturnAmount,
          adSpend: totalAdSpend,
          adRevenue: totalSales * 0.8, // 假设80%来自广告
          adROI: totalAdSpend > 0 ? (totalSales * 0.8) / totalAdSpend : 0,
          adRevenueRatio: 80,
          salesChange: 8.5,
          costChange: 5.2,
          roiChange: 3.1,
          conversionRateChange: 0.8,
          orderCountChange: 12.3
        },
        dailyData,
        productData,
        pageData
      }

      resolve({
        success: true,
        data: activityDetail,
        message: '获取活动详情成功'
      })
    }, 800)
  })
}

// 获取活动汇总数据
export const mockGetActivitySummary = (): Promise<ApiResponse<ActivitySummary>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockActivitySummary,
        message: '获取活动汇总数据成功'
      })
    }, 300)
  })
}

// 获取活动模板
export const mockGetActivityTemplates = (): Promise<ApiResponse<ActivityTemplate[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockActivityTemplates,
        message: '获取活动模板成功'
      })
    }, 300)
  })
}

// 创建活动
export const mockCreateActivity = (activityData: Partial<Activity>): Promise<ApiResponse<Activity>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newActivity: Activity = {
        id: mockActivities.length + 1,
        name: activityData.name || '',
        type: activityData.type || 'other',
        stage: activityData.stage || 'warm_up',
        status: 'warm_up',
        targetMarket: activityData.targetMarket || '',
        content: activityData.content || '',
        channels: activityData.channels || [],
        projectId: activityData.projectId || 1,
        projectName: activityData.projectName || '',
        ownerId: activityData.ownerId || 1,
        ownerName: activityData.ownerName || '',
        startTime: activityData.startTime || new Date().toISOString(),
        endTime: activityData.endTime || new Date().toISOString(),
        budget: activityData.budget || 0,
        targetSales: activityData.targetSales || 0,
        targetROI: activityData.targetROI || 0,
        targetConversionRate: activityData.targetConversionRate || 0,
        createdBy: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockActivities.push(newActivity)

      resolve({
        success: true,
        data: newActivity,
        message: '创建活动成功'
      })
    }, 1000)
  })
}

// 更新活动
export const mockUpdateActivity = (activityId: number, activityData: Partial<Activity>): Promise<ApiResponse<Activity>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockActivities.findIndex(a => a.id === activityId)
      if (index === -1) {
        resolve({
          success: false,
          message: '活动不存在'
        })
        return
      }

      mockActivities[index] = {
        ...mockActivities[index],
        ...activityData,
        updatedAt: new Date().toISOString()
      }

      resolve({
        success: true,
        data: mockActivities[index],
        message: '更新活动成功'
      })
    }, 800)
  })
}

// 删除活动
export const mockDeleteActivity = (activityId: number): Promise<ApiResponse<boolean>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockActivities.findIndex(a => a.id === activityId)
      if (index === -1) {
        resolve({
          success: false,
          message: '活动不存在'
        })
        return
      }

      // 检查活动状态，只能删除未开始的活动
      if (mockActivities[index].status !== 'warm_up') {
        resolve({
          success: false,
          message: '只能删除预热中的活动'
        })
        return
      }

      mockActivities.splice(index, 1)

      resolve({
        success: true,
        data: true,
        message: '删除活动成功'
      })
    }, 500)
  })
}

// 更新活动状态
export const mockUpdateActivityStatus = (
  activityId: number,
  newStatus: string,
  reason?: string
): Promise<ApiResponse<Activity>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const index = mockActivities.findIndex(a => a.id === activityId)
      if (index === -1) {
        resolve({
          success: false,
          message: '活动不存在'
        })
        return
      }

      const activity = mockActivities[index]

      // 验证状态转换的合法性
      const validTransitions: Record<string, string[]> = {
        'warm_up': ['running', 'cancelled'],
        'running': ['ended', 'cancelled'],
        'ended': [],
        'cancelled': []
      }

      if (!validTransitions[activity.status]?.includes(newStatus)) {
        resolve({
          success: false,
          message: '不支持的状态转换'
        })
        return
      }

      // 更新活动状态
      mockActivities[index] = {
        ...activity,
        status: newStatus as any,
        updatedAt: new Date().toISOString()
      }

      resolve({
        success: true,
        data: mockActivities[index],
        message: '活动状态更新成功'
      })
    }, 500)
  })
}
