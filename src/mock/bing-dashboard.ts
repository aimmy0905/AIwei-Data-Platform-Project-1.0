// Bing Dashboard Mock Data
export const bingDashboardData = {
  // 数据提醒
  alerts: [
    {
      id: 1,
      type: 'high',
      title: '销售额异常',
      message: '项目"Bing品牌推广"销售额下降',
      value: '-25.3%',
      metric: '销售额',
      action: '查看详情'
    },
    {
      id: 2,
      type: 'medium',
      title: '账户异常',
      message: '账户花费波动较大',
      value: '+22.1%',
      metric: '花费',
      action: '查看详情'
    },
    {
      id: 3,
      type: 'low',
      title: '转化率提升',
      message: '转化率表现良好',
      value: '+8.5%',
      metric: '转化率',
      action: '查看详情'
    }
  ],

  // 账户选择
  accounts: [
    {
      id: 'bing_001',
      name: 'Bing主账户',
      status: 'active',
      balance: 15680.50,
      currency: 'USD'
    },
    {
      id: 'bing_002',
      name: 'Bing备用账户',
      status: 'limited',
      balance: 8920.30,
      currency: 'USD'
    }
  ],

  // 广告账户概览 - 广告周数据
  weeklyOverview: {
    totalConversionValue: 45680.50,
    totalCost: 12450.80,
    roi: 3.67,
    conversionRate: 4.2,
    dailyAverageCost: 1778.69,
    clicks: 8456
  },

  // 广告周数据-不包含线索
  weeklyOverviewNoLeads: {
    totalConversionValue: 42150.30,
    totalCost: 12450.80,
    roi: 3.39,
    dailyAverageCost: 1778.69,
    averageCpc: 1.47,
    clicks: 8456
  },

  // 趋势图数据
  trendData: {
    revenueSpendCustomer: [
      { date: '2024-01-01', revenue: 6800, spend: 1800, customerPrice: 145 },
      { date: '2024-01-02', revenue: 7200, spend: 1950, customerPrice: 152 },
      { date: '2024-01-03', revenue: 6900, spend: 1750, customerPrice: 148 },
      { date: '2024-01-04', revenue: 7500, spend: 2100, customerPrice: 155 },
      { date: '2024-01-05', revenue: 8200, spend: 2250, customerPrice: 162 },
      { date: '2024-01-06', revenue: 7800, spend: 2000, customerPrice: 158 },
      { date: '2024-01-07', revenue: 8500, spend: 2300, customerPrice: 165 }
    ],
    salesRoas: [
      { date: '2024-01-01', sales: 45, roas: 3.78 },
      { date: '2024-01-02', sales: 48, roas: 3.69 },
      { date: '2024-01-03', sales: 47, roas: 3.94 },
      { date: '2024-01-04', sales: 52, roas: 3.57 },
      { date: '2024-01-05', sales: 55, roas: 3.64 },
      { date: '2024-01-06', sales: 51, roas: 3.90 },
      { date: '2024-01-07', sales: 58, roas: 3.70 }
    ]
  },

  // 日投放数据
  dailyData: [
    {
      date: '2024-01-01',
      spend: 1800.50,
      conversionValue: 6800.30,
      roi: 3.78,
      orders: 45,
      orderConversionRate: 4.2,
      orderConversionCost: 40.01,
      customerPrice: 151.12,
      cpc: 1.47,
      ctr: 3.8,
      cpv: 0.25,
      addToCart: 125,
      addToCartCost: 14.40,
      addToCartRate: 11.6,
      clicks: 1225,
      views: 45680,
      impressions: 32150,
      users: 28900
    },
    {
      date: '2024-01-02',
      spend: 1950.80,
      conversionValue: 7200.60,
      roi: 3.69,
      orders: 48,
      orderConversionRate: 4.5,
      orderConversionCost: 40.64,
      customerPrice: 150.01,
      cpc: 1.52,
      ctr: 3.9,
      cpv: 0.26,
      addToCart: 132,
      addToCartCost: 14.78,
      addToCartRate: 12.1,
      clicks: 1283,
      views: 48520,
      impressions: 33890,
      users: 30200
    }
  ],

  // 广告形式数据表现
  adFormData: [
    {
      adType: '品牌广告',
      spend: 5680.50,
      conversionValue: 18950.30,
      roi: 3.34,
      orders: 125,
      orderConversionRate: 4.8,
      orderConversionCost: 45.44,
      customerPrice: 151.60,
      cpc: 1.52,
      ctr: 3.9,
      cpa: 42.15,
      cpv: 0.28,
      addToCart: 356,
      addToCartCost: 15.96,
      addToCartRate: 13.6,
      clicks: 3740,
      views: 125680,
      impressions: 89560,
      users: 78450,
      trafficConversions: 89
    },
    {
      adType: '转化广告',
      spend: 6770.30,
      conversionValue: 26730.20,
      roi: 3.95,
      orders: 178,
      orderConversionRate: 5.2,
      orderConversionCost: 38.03,
      customerPrice: 150.17,
      cpc: 1.42,
      ctr: 4.1,
      cpa: 35.28,
      cpv: 0.24,
      addToCart: 445,
      addToCartCost: 15.21,
      addToCartRate: 13.0,
      clicks: 4716,
      views: 156890,
      impressions: 112340,
      users: 98760,
      trafficConversions: 156
    }
  ],

  // 广告类型数据表现
  adTypeData: [
    {
      adType: '品牌词搜索广告',
      spend: 3250.80,
      conversionValue: 12680.50,
      roi: 3.90,
      orders: 84,
      orderConversionRate: 5.1,
      orderConversionCost: 38.70,
      customerPrice: 151.00,
      cpc: 1.35,
      ctr: 4.2,
      cpa: 35.85,
      cpv: 0.22,
      addToCart: 245,
      addToCartCost: 13.27,
      addToCartRate: 14.9,
      clicks: 2408,
      views: 89560,
      impressions: 57290,
      users: 51680
    },
    {
      adType: '除品牌词外的搜索广告',
      spend: 4180.90,
      conversionValue: 15890.20,
      roi: 3.80,
      orders: 106,
      orderConversionRate: 4.8,
      orderConversionCost: 39.44,
      customerPrice: 149.91,
      cpc: 1.48,
      ctr: 3.9,
      cpa: 36.12,
      cpv: 0.25,
      addToCart: 312,
      addToCartCost: 13.40,
      addToCartRate: 14.1,
      clicks: 2825,
      views: 102450,
      impressions: 72450,
      users: 64820
    },
    {
      adType: 'Shopping（手工feed）',
      spend: 2890.60,
      conversionValue: 10450.80,
      roi: 3.62,
      orders: 69,
      orderConversionRate: 4.5,
      orderConversionCost: 41.89,
      customerPrice: 151.46,
      cpc: 1.52,
      ctr: 3.7,
      cpa: 38.55,
      cpv: 0.28,
      addToCart: 198,
      addToCartCost: 14.60,
      addToCartRate: 12.9,
      clicks: 1901,
      views: 78920,
      impressions: 51380,
      users: 45690
    },
    {
      adType: 'Pmax广告',
      spend: 1728.90,
      conversionValue: 6658.70,
      roi: 3.85,
      orders: 44,
      orderConversionRate: 4.9,
      orderConversionCost: 39.29,
      customerPrice: 151.33,
      cpc: 1.41,
      ctr: 4.0,
      cpa: 36.85,
      cpv: 0.23,
      addToCart: 146,
      addToCartCost: 11.84,
      addToCartRate: 16.2,
      clicks: 1226,
      views: 52680,
      impressions: 30680,
      users: 27490
    }
  ],

  // 广告类型占比数据
  adTypeDistribution: {
    cost: [
      { name: '品牌词搜索广告', value: 3250.80, percentage: 26.1 },
      { name: '除品牌词外的搜索广告', value: 4180.90, percentage: 33.6 },
      { name: 'Shopping（手工feed）', value: 2890.60, percentage: 23.2 },
      { name: 'Pmax广告', value: 1728.90, percentage: 13.9 },
      { name: 'Video', value: 298.50, percentage: 2.4 },
      { name: 'Demand Gen广告', value: 100.50, percentage: 0.8 }
    ],
    revenue: [
      { name: '品牌词搜索广告', value: 12680.50, percentage: 27.8 },
      { name: '除品牌词外的搜索广告', value: 15890.20, percentage: 34.8 },
      { name: 'Shopping（手工feed）', value: 10450.80, percentage: 22.9 },
      { name: 'Pmax广告', value: 6658.70, percentage: 14.6 }
    ]
  },

  // 广告系列表现数据
  campaignData: [
    {
      campaign: '品牌推广-核心词',
      spend: 1680.50,
      conversionValue: 6580.30,
      roi: 3.92,
      orders: 44,
      orderConversionRate: 5.2,
      orderConversionCost: 38.19,
      customerPrice: 149.55,
      cpc: 1.38,
      ctr: 4.1,
      clicks: 1218,
      impressions: 29680,
      users: 26890
    },
    {
      campaign: '品牌推广-长尾词',
      spend: 1570.30,
      conversionValue: 6100.20,
      roi: 3.88,
      orders: 40,
      orderConversionRate: 4.9,
      orderConversionCost: 39.26,
      customerPrice: 152.51,
      cpc: 1.32,
      ctr: 3.9,
      clicks: 1190,
      impressions: 27610,
      users: 24790
    }
  ],

  // Video、Demand Gen及Display广告表现
  videoDisplayData: [
    {
      campaign: 'Video品牌推广',
      spend: 298.50,
      conversionValue: 1156.80,
      roas: 3.87,
      conversions: 8,
      conversionRate: 2.1,
      interactions: 156,
      cpc: 1.91,
      cpv: 0.31,
      cpm: 12.50,
      cpa: 37.31,
      completionRate: 68.5,
      watchTime: 45.2,
      frequency: 2.1,
      interactionRate: 4.2,
      bounceRate: 52.3
    },
    {
      campaign: 'Demand Gen推广',
      spend: 100.50,
      conversionValue: 385.20,
      roas: 3.83,
      conversions: 3,
      conversionRate: 1.8,
      interactions: 68,
      cpc: 1.48,
      cpv: 0.28,
      cpm: 8.90,
      cpa: 33.50,
      completionRate: 72.1,
      watchTime: 38.6,
      frequency: 1.9,
      interactionRate: 4.1,
      bounceRate: 48.7
    }
  ],

  // 搜索关键字数据表现
  keywordData: [
    {
      keyword: '品牌名称',
      spend: 680.50,
      spendPercentage: 5.5,
      conversionValue: 2650.30,
      conversions: 18,
      conversionRate: 6.2,
      ctr: 8.5,
      cpc: 1.25,
      cpa: 37.81
    },
    {
      keyword: '产品核心词',
      spend: 1250.80,
      spendPercentage: 10.0,
      conversionValue: 4680.90,
      conversions: 31,
      conversionRate: 5.8,
      ctr: 6.2,
      cpc: 1.48,
      cpa: 40.35
    },
    {
      keyword: '竞品词',
      spend: 890.30,
      spendPercentage: 7.1,
      conversionValue: 3120.60,
      conversions: 21,
      conversionRate: 4.9,
      ctr: 4.8,
      cpc: 1.68,
      cpa: 42.40
    }
  ],

  // 受众表现数据
  audienceData: [
    {
      audience: '再营销受众',
      keywords: '品牌词, 产品词',
      spend: 2180.50,
      spendPercentage: 17.5,
      conversionValue: 8950.30,
      conversions: 59,
      conversionRate: 7.2,
      ctr: 8.9,
      cpc: 1.15,
      cpa: 36.95
    },
    {
      audience: '相似受众',
      keywords: '兴趣词, 行为词',
      spend: 1680.90,
      spendPercentage: 13.5,
      conversionValue: 6180.70,
      conversions: 41,
      conversionRate: 5.8,
      ctr: 6.2,
      cpc: 1.38,
      cpa: 41.00
    },
    {
      audience: '自定义受众',
      keywords: '定制词, 专业词',
      spend: 1450.30,
      spendPercentage: 11.6,
      conversionValue: 5680.20,
      conversions: 37,
      conversionRate: 6.1,
      ctr: 7.1,
      cpc: 1.28,
      cpa: 39.20
    }
  ],

  // 图片素材表现
  imageCreativeData: [
    {
      adId: 'IMG_001',
      imageId: 'bing_img_001',
      image: '/public/creative-samples/bing-image-1.jpg',
      adLink: 'https://example.com/ad/001',
      impressions: 25680,
      clicks: 1058,
      ctr: 4.12,
      cpc: 1.35,
      conversions: 24,
      conversionRate: 2.27,
      cost: 1428.30,
      revenue: 3680.50,
      roi: 2.58
    },
    {
      adId: 'IMG_002',
      imageId: 'bing_img_002',
      image: '/public/creative-samples/bing-image-2.jpg',
      adLink: 'https://example.com/ad/002',
      impressions: 31250,
      clicks: 1406,
      ctr: 4.50,
      cpc: 1.28,
      conversions: 32,
      conversionRate: 2.28,
      cost: 1800.68,
      revenue: 4890.20,
      roi: 2.72
    }
  ],

  // 视频素材表现
  videoCreativeData: [
    {
      thumbnail: '/public/creative-samples/bing-video-thumb-1.jpg',
      videoLink: 'https://example.com/video/001',
      videoId: 'bing_video_001',
      duration: 30,
      impressions: 18560,
      clicks: 742,
      ctr: 4.00,
      viewRate: 68.5,
      views: 12714,
      conversions: 15
    },
    {
      thumbnail: '/public/creative-samples/bing-video-thumb-2.jpg',
      videoLink: 'https://example.com/video/002',
      videoId: 'bing_video_002',
      duration: 15,
      impressions: 22890,
      clicks: 1031,
      ctr: 4.50,
      viewRate: 72.1,
      views: 16506,
      conversions: 21
    }
  ]
}

// 选中的账户
export const selectedAccount = {
  id: 'bing_001',
  name: 'Bing主账户',
  status: 'active',
  balance: 15680.50,
  currency: 'USD'
}
