import type {
  Customer,
  CustomerDetail,
  CooperationDetails,
  CustomerBasicInfo,
  ContactPerson,
  WebsiteInfo,
  CompetitorInfo,
  CompetitorWebsite,
  SpecialAttention,
  CustomerQA,
  AdAccount,
  RenewalRecord,
  ApiResponse
} from '@/types'

// 扩展客户类型，添加产品设计文档要求的字段
export interface ExtendedCustomer extends Customer {
  cooperationType: string // 合作方式
  serviceStartTime: string // 服务开始时间
  cooperationStartTime: string // 合作开始时间
  primaryContact: ContactPerson // 主要联系人
  serviceTeam: string // 服务团队
  grade: 'A' | 'B' | 'C' // 客户分级
  signingSales: string // 签单销售人员
  regions: string[] // 地区
}

// 模拟客户列表数据
export const mockCustomers: ExtendedCustomer[] = [
  {
    id: 1,
    name: '时尚潮流服饰有限公司',
    website: 'https://fashiontrend.com',
    industry: '时尚服装',
    revenue: 2500000,
    roi: 4.2,
    status: 'active',
    manager: '张小明',
    createdAt: '2024-01-15T08:00:00Z',
    lastUpdated: '2024-12-20T10:30:00Z',
    cooperationType: '代运营',
    serviceStartTime: '2024-02-01T08:00:00Z',
    cooperationStartTime: '2024-01-15T08:00:00Z',
    primaryContact: {
      id: 1,
      name: '李总',
      position: '总经理',
      phone: '13800138001',
      email: 'ceo@fashiontrend.com',
      isPrimary: true
    },
    serviceTeam: '时尚组',
    grade: 'A',
    signingSales: '张小明',
    regions: ['美国', '欧洲', '加拿大']
  },
  {
    id: 2,
    name: '科技数码创新公司',
    website: 'https://techinnovate.com',
    industry: '数码科技',
    revenue: 1800000,
    roi: 3.8,
    status: 'active',
    manager: '李美丽',
    createdAt: '2024-02-10T09:15:00Z',
    lastUpdated: '2024-12-19T16:45:00Z',
    cooperationType: '咨询服务',
    serviceStartTime: '2024-02-20T09:00:00Z',
    cooperationStartTime: '2024-02-10T09:15:00Z',
    primaryContact: {
      id: 2,
      name: '王经理',
      position: '市场总监',
      phone: '13800138002',
      email: 'marketing@techinnovate.com',
      isPrimary: true
    },
    serviceTeam: '科技组',
    grade: 'B',
    signingSales: '李美丽',
    regions: ['美国', '日本']
  },
  {
    id: 3,
    name: '美容护肤品牌',
    website: 'https://beautycare.com',
    industry: '美容护肤',
    revenue: 3200000,
    roi: 5.1,
    status: 'active',
    manager: '王强',
    createdAt: '2024-03-05T14:20:00Z',
    lastUpdated: '2024-12-18T11:20:00Z',
    cooperationType: '代运营',
    serviceStartTime: '2024-03-15T08:00:00Z',
    cooperationStartTime: '2024-03-05T14:20:00Z',
    primaryContact: {
      id: 3,
      name: '赵女士',
      position: '运营总监',
      phone: '13800138003',
      email: 'ops@beautycare.com',
      isPrimary: true
    },
    serviceTeam: '美妆组',
    grade: 'A',
    signingSales: '王强',
    regions: ['美国', '欧洲', '澳大利亚']
  },
  {
    id: 4,
    name: '运动健身器材',
    website: 'https://sportsfitness.com',
    industry: '体育用品',
    revenue: 1500000,
    roi: 2.9,
    status: 'inactive',
    manager: '赵敏',
    createdAt: '2024-04-12T10:30:00Z',
    lastUpdated: '2024-12-17T09:15:00Z',
    cooperationType: '技术支持',
    serviceStartTime: '2024-04-20T08:00:00Z',
    cooperationStartTime: '2024-04-12T10:30:00Z',
    primaryContact: {
      id: 4,
      name: '孙总',
      position: '销售总监',
      phone: '13800138004',
      email: 'sales@sportsfitness.com',
      isPrimary: true
    },
    serviceTeam: '运动组',
    grade: 'C',
    signingSales: '赵敏',
    regions: ['美国', '加拿大']
  },
  {
    id: 5,
    name: '家居装饰精品',
    website: 'https://homedecor.com',
    industry: '家居装饰',
    revenue: 2100000,
    roi: 3.5,
    status: 'active',
    manager: '陈华',
    createdAt: '2024-05-08T11:45:00Z',
    lastUpdated: '2024-12-16T15:30:00Z',
    cooperationType: '代运营',
    serviceStartTime: '2024-05-15T08:00:00Z',
    cooperationStartTime: '2024-05-08T11:45:00Z',
    primaryContact: {
      id: 5,
      name: '周经理',
      position: '产品经理',
      phone: '13800138005',
      email: 'product@homedecor.com',
      isPrimary: true
    },
    serviceTeam: '家居组',
    grade: 'B',
    signingSales: '陈华',
    regions: ['美国', '欧洲']
  },
  {
    id: 6,
    name: '智能家电科技',
    website: 'https://smarthome.com',
    industry: '数码科技',
    revenue: 4200000,
    roi: 4.8,
    status: 'active',
    manager: '刘洋',
    createdAt: '2024-06-20T13:00:00Z',
    lastUpdated: '2024-12-15T12:45:00Z',
    cooperationType: '代运营',
    serviceStartTime: '2024-07-01T08:00:00Z',
    cooperationStartTime: '2024-06-20T13:00:00Z',
    primaryContact: {
      id: 6,
      name: '吴总',
      position: '技术总监',
      phone: '13800138006',
      email: 'tech@smarthome.com',
      isPrimary: true
    },
    serviceTeam: '科技组',
    grade: 'A',
    signingSales: '刘洋',
    regions: ['美国', '欧洲', '日本']
  },
  {
    id: 7,
    name: '户外运动装备',
    website: 'https://outdoorgear.com',
    industry: '体育用品',
    revenue: 1200000,
    roi: 2.3,
    status: 'suspended',
    manager: '周杰',
    createdAt: '2024-07-03T16:20:00Z',
    lastUpdated: '2024-12-14T08:30:00Z',
    cooperationType: '培训服务',
    serviceStartTime: '2024-07-10T08:00:00Z',
    cooperationStartTime: '2024-07-03T16:20:00Z',
    primaryContact: {
      id: 7,
      name: '林经理',
      position: '品牌经理',
      phone: '13800138007',
      email: 'brand@outdoorgear.com',
      isPrimary: true
    },
    serviceTeam: '运动组',
    grade: 'C',
    signingSales: '周杰',
    regions: ['美国', '澳大利亚']
  },
  {
    id: 8,
    name: '高端珠宝首饰',
    website: 'https://luxuryjewelry.com',
    industry: '时尚服装',
    revenue: 5800000,
    roi: 6.2,
    status: 'active',
    manager: '吴娟',
    createdAt: '2024-08-15T09:30:00Z',
    lastUpdated: '2024-12-13T14:20:00Z',
    cooperationType: '代运营',
    serviceStartTime: '2024-08-20T08:00:00Z',
    cooperationStartTime: '2024-08-15T09:30:00Z',
    primaryContact: {
      id: 8,
      name: '郑总',
      position: '创始人',
      phone: '13800138008',
      email: 'founder@luxuryjewelry.com',
      isPrimary: true
    },
    serviceTeam: '时尚组',
    grade: 'A',
    signingSales: '吴娟',
    regions: ['美国', '欧洲', '日本', '澳大利亚']
  },
  {
    id: 9,
    name: '儿童玩具乐园',
    website: 'https://kidstoys.com',
    industry: '家居装饰',
    revenue: 980000,
    roi: 2.1,
    status: 'active',
    manager: '孙丽',
    createdAt: '2024-09-10T12:15:00Z',
    lastUpdated: '2024-12-12T10:45:00Z',
    cooperationType: '咨询服务',
    serviceStartTime: '2024-09-15T08:00:00Z',
    cooperationStartTime: '2024-09-10T12:15:00Z',
    primaryContact: {
      id: 9,
      name: '黄经理',
      position: '采购经理',
      phone: '13800138009',
      email: 'purchase@kidstoys.com',
      isPrimary: true
    },
    serviceTeam: '家居组',
    grade: 'C',
    signingSales: '孙丽',
    regions: ['美国', '加拿大']
  },
  {
    id: 10,
    name: '有机食品专营',
    website: 'https://organicfood.com',
    industry: '美容护肤',
    revenue: 1650000,
    roi: 3.2,
    status: 'active',
    manager: '马超',
    createdAt: '2024-10-25T14:45:00Z',
    lastUpdated: '2024-12-11T16:30:00Z',
    cooperationType: '代运营',
    serviceStartTime: '2024-11-01T08:00:00Z',
    cooperationStartTime: '2024-10-25T14:45:00Z',
    primaryContact: {
      id: 10,
      name: '刘总',
      position: '总经理',
      phone: '13800138010',
      email: 'ceo@organicfood.com',
      isPrimary: true
    },
    serviceTeam: '美妆组',
    grade: 'B',
    signingSales: '马超',
    regions: ['美国', '欧洲', '加拿大']
  }
]

// 模拟客户详细信息数据
export const mockCustomerDetails: { [key: number]: CustomerDetail } = {
  1: {
    id: 1,
    cooperationDetails: {
      customerName: '时尚潮流服饰有限公司',
      cooperationStartTime: '2024-01-15T08:00:00Z',
      serviceStartTime: '2024-02-01T08:00:00Z',
      cooperationType: '代运营',
      signingSales: '张小明',
      specialConditions: '前三个月免费优化服务，提供专属客户经理',
      customerGrade: 'A',
      customerStatus: 'active'
    },
    basicInfo: {
      serviceTeam: '时尚组',
      contactPersons: [
        {
          id: 1,
          name: '李总',
          position: '总经理',
          phone: '13800138001',
          email: 'ceo@fashiontrend.com',
          isPrimary: true
        },
        {
          id: 2,
          name: '王经理',
          position: '市场总监',
          phone: '13800138002',
          email: 'marketing@fashiontrend.com',
          isPrimary: false
        }
      ],
      industry: '时尚服装',
      regions: ['美国', '欧洲', '加拿大'],
      businessModel: '中国本土品牌出海',
      overseasSalesScale: '500-1000万美元',
      overseasSalesRatio: 75,
      targetSalesScale: '2000万美元',
      mainSalesChannel: '独立站',
      hasTechTeam: true,
      hasOperationTeam: false,
      hasBrandTeam: true,
      cooperationTransfer: '内部团队转移'
    },
    websiteInfo: {
      newProductFrequency: '每月5-10款',
      websiteLaunchTime: '2023-06-01T00:00:00Z',
      lastYearSales: 8500000,
      targetMarkets: ['美国', '欧洲', '加拿大'],
      mainProducts: '女装、配饰、鞋履',
      productAdvantages: '设计新颖、质量优良、价格合理',
      pricingStrategy: '独立站价格更高',
      inventoryStatus: true,
      annualSalesTarget: 12000000,
      annualCostTarget: 8000000,
      costRatio: 66.7
    },
    competitorInfo: {
      competitorWebsites: [
        {
          id: 1,
          websiteUrl: 'https://competitor1.com',
          companyName: '竞争对手A',
          notes: '主要竞争对手，价格相近'
        },
        {
          id: 2,
          websiteUrl: 'https://competitor2.com',
          companyName: '竞争对手B',
          notes: '产品线相似，但定位更高端'
        }
      ]
    },
    specialAttention: {
      customerExpectations: '希望在Q1实现销售额翻倍增长',
      communicationPreferences: '每周定期汇报，重要事项及时沟通',
      specialRequirements: '需要提供详细的数据分析报告',
      culturalConsiderations: '注重品牌形象和用户体验',
      timeZonePreferences: '北京时间工作时间',
      languagePreferences: '中文',
      decisionMakers: '李总（最终决策）、王经理（执行决策）',
      budgetConstraints: '月度预算不超过50万',
      complianceRequirements: '需要符合GDPR和CCPA规定',
      riskFactors: '季节性波动较大，需要提前规划',
      successFactors: '产品质量、营销策略、客户服务',
      historicalIssues: '曾经出现过物流延误问题'
    },
    qaRecords: [
      {
        id: 1,
        customerId: 1,
        issueDate: '2024-11-15T10:00:00Z',
        issueCategory: '服务质量问题',
        issueDescription: '广告投放效果不达预期，ROI低于目标值',
        impactLevel: 'high',
        rootCause: '目标受众定位不够精准，创意素材吸引力不足',
        immediateSolution: '暂停低效广告组，重新优化受众定位',
        correctiveMeasures: '调整目标受众，更新创意素材，优化落地页',
        preventiveMeasures: '建立定期效果评估机制，加强数据监控',
        responsiblePerson: '张小明',
        dueDate: '2024-11-30T18:00:00Z',
        actualCompletionDate: '2024-11-28T16:00:00Z',
        status: 'completed',
        followUpActions: '持续监控优化效果，每周汇报进展',
        lessonsLearned: '需要更深入了解目标市场特点',
        attachments: ['report1.pdf', 'analysis1.xlsx'],
        createdAt: '2024-11-15T10:00:00Z',
        updatedAt: '2024-11-28T16:00:00Z'
      }
    ],
    renewalNotes: '客户满意度较高，续费意向强烈。建议在合同到期前一个月开始续费洽谈。',
    projects: [],
    adAccounts: [
      {
        id: 1,
        platform: 'google',
        accountId: 'GA-123456789',
        accountName: '时尚潮流-Google广告',
        status: 'active',
        balance: 15000,
        lastUpdated: '2024-12-20T10:30:00Z'
      },
      {
        id: 2,
        platform: 'facebook',
        accountId: 'FB-987654321',
        accountName: '时尚潮流-Meta广告',
        status: 'active',
        balance: 8500,
        lastUpdated: '2024-12-20T10:30:00Z'
      }
    ],
    createdAt: '2024-01-15T08:00:00Z',
    lastUpdated: '2024-12-20T10:30:00Z'
  },
  2: {
    id: 2,
    cooperationDetails: {
      customerName: '智能科技产品公司',
      cooperationStartTime: '2024-02-01T08:00:00Z',
      serviceStartTime: '2024-02-15T08:00:00Z',
      cooperationType: '咨询服务',
      signingSales: '李小红',
      specialConditions: '按季度付费，提供月度数据报告',
      customerGrade: 'B',
      customerStatus: 'active'
    },
    basicInfo: {
      serviceTeam: '科技组',
      contactPersons: [
        {
          id: 1,
          name: '陈总',
          position: 'CEO',
          phone: '13900139001',
          email: 'ceo@smarttech.com',
          isPrimary: true
        }
      ],
      industry: '智能硬件',
      regions: ['美国', '日本', '韩国'],
      businessModel: '技术驱动型品牌',
      overseasSalesScale: '200-500万美元',
      overseasSalesRatio: 60,
      targetSalesScale: '1000万美元',
      mainSalesChannel: '独立站+亚马逊',
      hasTechTeam: true,
      hasOperationTeam: true,
      hasBrandTeam: false,
      cooperationTransfer: '新客户'
    },
    websiteInfo: {
      newProductFrequency: '每季度2-3款',
      websiteLaunchTime: '2023-08-01T00:00:00Z',
      lastYearSales: 3200000,
      targetMarkets: ['美国', '日本', '韩国'],
      mainProducts: '智能家居设备、穿戴设备',
      productAdvantages: '技术先进、功能丰富、用户体验好',
      pricingStrategy: '中高端定价',
      inventoryStatus: true,
      annualSalesTarget: 5000000,
      annualCostTarget: 3000000,
      costRatio: 60
    },
    competitorInfo: {
      competitorWebsites: [
        {
          id: 1,
          websiteUrl: 'https://techcompetitor.com',
          companyName: '科技竞争对手',
          notes: '技术实力强，但价格偏高'
        }
      ]
    },
    specialAttention: {
      customerExpectations: '希望快速占领亚洲市场',
      communicationPreferences: '双周汇报，紧急事项随时沟通',
      specialRequirements: '需要本地化营销策略',
      culturalConsiderations: '重视技术创新和品质',
      timeZonePreferences: '北京时间',
      languagePreferences: '中文',
      decisionMakers: '陈总（全权决策）',
      budgetConstraints: '月度预算30万',
      complianceRequirements: '需要符合各国电子产品认证',
      riskFactors: '技术更新快，产品生命周期短',
      successFactors: '技术创新、市场推广、渠道建设',
      historicalIssues: '无重大问题'
    },
    qaRecords: [],
    renewalNotes: '新客户，表现良好，有长期合作潜力',
    projects: [],
    adAccounts: [
      {
        id: 1,
        platform: 'google',
        accountId: 'GA-234567890',
        accountName: '智能科技-Google广告',
        status: 'active',
        balance: 12000,
        lastUpdated: '2024-12-20T10:30:00Z'
      }
    ],
    createdAt: '2024-02-01T08:00:00Z',
    lastUpdated: '2024-12-20T10:30:00Z'
  },
  3: {
    id: 3,
    cooperationDetails: {
      customerName: '美妆护肤品牌',
      cooperationStartTime: '2024-03-01T08:00:00Z',
      serviceStartTime: '2024-03-15T08:00:00Z',
      cooperationType: '代运营',
      signingSales: '王小强',
      specialConditions: '提供KOL资源对接',
      customerGrade: 'A',
      customerStatus: 'active'
    },
    basicInfo: {
      serviceTeam: '美妆组',
      contactPersons: [
        {
          id: 1,
          name: '张经理',
          position: '品牌总监',
          phone: '13700137001',
          email: 'brand@beautycare.com',
          isPrimary: true
        }
      ],
      industry: '美妆护肤',
      regions: ['美国', '欧洲', '澳洲'],
      businessModel: '品牌代理出海',
      overseasSalesScale: '1000-2000万美元',
      overseasSalesRatio: 80,
      targetSalesScale: '3000万美元',
      mainSalesChannel: '独立站',
      hasTechTeam: false,
      hasOperationTeam: true,
      hasBrandTeam: true,
      cooperationTransfer: '代理商推荐'
    },
    websiteInfo: {
      newProductFrequency: '每月3-5款',
      websiteLaunchTime: '2023-01-01T00:00:00Z',
      lastYearSales: 15000000,
      targetMarkets: ['美国', '欧洲', '澳洲'],
      mainProducts: '护肤品、彩妆、香水',
      productAdvantages: '天然成分、效果显著、包装精美',
      pricingStrategy: '高端定价策略',
      inventoryStatus: true,
      annualSalesTarget: 20000000,
      annualCostTarget: 12000000,
      costRatio: 60
    },
    competitorInfo: {
      competitorWebsites: [
        {
          id: 1,
          websiteUrl: 'https://beautycompetitor.com',
          companyName: '美妆竞争对手',
          notes: '品牌知名度高，但价格竞争激烈'
        }
      ]
    },
    specialAttention: {
      customerExpectations: '希望成为细分市场领导者',
      communicationPreferences: '每周汇报，重要活动提前沟通',
      specialRequirements: '需要专业的美妆营销策略',
      culturalConsiderations: '注重品牌形象和社交影响力',
      timeZonePreferences: '北京时间',
      languagePreferences: '中文',
      decisionMakers: '张经理（品牌决策）',
      budgetConstraints: '月度预算80万',
      complianceRequirements: '需要符合化妆品安全标准',
      riskFactors: '季节性需求波动，流行趋势变化快',
      successFactors: '品牌建设、KOL合作、用户口碑',
      historicalIssues: '曾有产品质量投诉'
    },
    qaRecords: [],
    renewalNotes: '重要客户，续费概率高',
    projects: [],
    adAccounts: [
      {
        id: 1,
        platform: 'facebook',
        accountId: 'FB-345678901',
        accountName: '美妆护肤-Meta广告',
        status: 'active',
        balance: 25000,
        lastUpdated: '2024-12-20T10:30:00Z'
      }
    ],
    createdAt: '2024-03-01T08:00:00Z',
    lastUpdated: '2024-12-20T10:30:00Z'
  },
  4: {
    id: 4,
    cooperationDetails: {
      customerName: '户外运动装备',
      cooperationStartTime: '2024-04-01T08:00:00Z',
      serviceStartTime: '2024-04-15T08:00:00Z',
      cooperationType: '混合服务',
      signingSales: '刘小明',
      specialConditions: '旺季额外支持',
      customerGrade: 'B',
      customerStatus: 'active'
    },
    basicInfo: {
      serviceTeam: '运动组',
      contactPersons: [
        {
          id: 1,
          name: '赵总',
          position: '运营总监',
          phone: '13600136001',
          email: 'ops@outdoorgear.com',
          isPrimary: true
        }
      ],
      industry: '户外运动',
      regions: ['美国', '加拿大', '欧洲'],
      businessModel: '制造商直销',
      overseasSalesScale: '300-800万美元',
      overseasSalesRatio: 70,
      targetSalesScale: '1500万美元',
      mainSalesChannel: '独立站+线下',
      hasTechTeam: true,
      hasOperationTeam: false,
      hasBrandTeam: false,
      cooperationTransfer: '展会获客'
    },
    websiteInfo: {
      newProductFrequency: '每季度10-15款',
      websiteLaunchTime: '2023-03-01T00:00:00Z',
      lastYearSales: 6000000,
      targetMarkets: ['美国', '加拿大', '欧洲'],
      mainProducts: '户外服装、装备、配件',
      productAdvantages: '功能性强、耐用性好、性价比高',
      pricingStrategy: '中端定价',
      inventoryStatus: true,
      annualSalesTarget: 8000000,
      annualCostTarget: 5000000,
      costRatio: 62.5
    },
    competitorInfo: {
      competitorWebsites: [
        {
          id: 1,
          websiteUrl: 'https://outdoorcompetitor.com',
          companyName: '户外竞争对手',
          notes: '品牌历史悠久，但创新不足'
        }
      ]
    },
    specialAttention: {
      customerExpectations: '希望扩大北美市场份额',
      communicationPreferences: '月度汇报，旺季加强沟通',
      specialRequirements: '需要季节性营销策略',
      culturalConsiderations: '注重产品实用性和性能',
      timeZonePreferences: '北京时间',
      languagePreferences: '中文',
      decisionMakers: '赵总（运营决策）',
      budgetConstraints: '月度预算40万',
      complianceRequirements: '需要符合户外产品安全标准',
      riskFactors: '季节性强，库存管理难度大',
      successFactors: '产品质量、渠道建设、季节性推广',
      historicalIssues: '库存周转慢'
    },
    qaRecords: [],
    renewalNotes: '合作稳定，有续费意向',
    projects: [],
    adAccounts: [
      {
        id: 1,
        platform: 'google',
        accountId: 'GA-456789012',
        accountName: '户外运动-Google广告',
        status: 'active',
        balance: 18000,
        lastUpdated: '2024-12-20T10:30:00Z'
      }
    ],
    createdAt: '2024-04-01T08:00:00Z',
    lastUpdated: '2024-12-20T10:30:00Z'
  },
  5: {
    id: 5,
    cooperationDetails: {
      customerName: '母婴用品专营店',
      cooperationStartTime: '2024-05-01T08:00:00Z',
      serviceStartTime: '2024-05-15T08:00:00Z',
      cooperationType: '代运营',
      signingSales: '陈小丽',
      specialConditions: '提供育儿专家咨询',
      customerGrade: 'A',
      customerStatus: 'active'
    },
    basicInfo: {
      serviceTeam: '母婴组',
      contactPersons: [
        {
          id: 1,
          name: '孙经理',
          position: '产品经理',
          phone: '13500135001',
          email: 'product@babycare.com',
          isPrimary: true
        }
      ],
      industry: '母婴用品',
      regions: ['美国', '加拿大', '澳洲'],
      businessModel: '品牌代理+自营',
      overseasSalesScale: '800-1500万美元',
      overseasSalesRatio: 85,
      targetSalesScale: '2500万美元',
      mainSalesChannel: '独立站+亚马逊',
      hasTechTeam: false,
      hasOperationTeam: true,
      hasBrandTeam: true,
      cooperationTransfer: '客户推荐'
    },
    websiteInfo: {
      newProductFrequency: '每月8-12款',
      websiteLaunchTime: '2023-05-01T00:00:00Z',
      lastYearSales: 12000000,
      targetMarkets: ['美国', '加拿大', '澳洲'],
      mainProducts: '婴儿用品、玩具、营养品',
      productAdvantages: '安全无害、设计贴心、品质可靠',
      pricingStrategy: '中高端定价',
      inventoryStatus: true,
      annualSalesTarget: 18000000,
      annualCostTarget: 10000000,
      costRatio: 55.6
    },
    competitorInfo: {
      competitorWebsites: [
        {
          id: 1,
          websiteUrl: 'https://babycompetitor.com',
          companyName: '母婴竞争对手',
          notes: '品牌认知度高，但价格偏高'
        }
      ]
    },
    specialAttention: {
      customerExpectations: '希望成为母婴行业标杆',
      communicationPreferences: '每周汇报，新品上线及时沟通',
      specialRequirements: '需要专业的母婴营销策略',
      culturalConsiderations: '注重产品安全和教育价值',
      timeZonePreferences: '北京时间',
      languagePreferences: '中文',
      decisionMakers: '孙经理（产品决策）',
      budgetConstraints: '月度预算60万',
      complianceRequirements: '需要符合婴幼儿产品安全标准',
      riskFactors: '安全要求高，监管严格',
      successFactors: '产品安全、品牌信任、用户教育',
      historicalIssues: '无重大问题'
    },
    qaRecords: [],
    renewalNotes: '优质客户，续费意愿强',
    projects: [],
    adAccounts: [
      {
        id: 1,
        platform: 'facebook',
        accountId: 'FB-567890123',
        accountName: '母婴用品-Meta广告',
        status: 'active',
        balance: 22000,
        lastUpdated: '2024-12-20T10:30:00Z'
      }
    ],
    createdAt: '2024-05-01T08:00:00Z',
    lastUpdated: '2024-12-20T10:30:00Z'
  },
  6: {
    id: 6,
    cooperationDetails: {
      customerName: '家居生活品牌',
      cooperationStartTime: '2024-06-01T08:00:00Z',
      serviceStartTime: '2024-06-15T08:00:00Z',
      cooperationType: '咨询服务',
      signingSales: '周小伟',
      specialConditions: '提供家居设计咨询',
      customerGrade: 'B',
      customerStatus: 'active'
    },
    basicInfo: {
      serviceTeam: '家居组',
      contactPersons: [
        {
          id: 1,
          name: '吴总',
          position: '品牌总监',
          phone: '13400134001',
          email: 'brand@homeliving.com',
          isPrimary: true
        },
        {
          id: 2,
          name: '林经理',
          position: '市场经理',
          phone: '13400134002',
          email: 'marketing@homeliving.com',
          isPrimary: false
        }
      ],
      industry: '家居生活',
      regions: ['美国', '欧洲', '日本'],
      businessModel: '原创设计品牌',
      overseasSalesScale: '400-900万美元',
      overseasSalesRatio: 65,
      targetSalesScale: '1800万美元',
      mainSalesChannel: '独立站',
      hasTechTeam: true,
      hasOperationTeam: false,
      hasBrandTeam: true,
      cooperationTransfer: '设计师推荐'
    },
    websiteInfo: {
      newProductFrequency: '每月6-8款',
      websiteLaunchTime: '2023-04-01T00:00:00Z',
      lastYearSales: 7200000,
      targetMarkets: ['美国', '欧洲', '日本'],
      mainProducts: '家具、装饰品、收纳用品',
      productAdvantages: '设计独特、工艺精良、环保材质',
      pricingStrategy: '中高端定价',
      inventoryStatus: true,
      annualSalesTarget: 10000000,
      annualCostTarget: 6500000,
      costRatio: 65
    },
    competitorInfo: {
      competitorWebsites: [
        {
          id: 1,
          websiteUrl: 'https://homecompetitor.com',
          companyName: '家居竞争对手A',
          notes: '设计风格相似，但价格更低'
        },
        {
          id: 2,
          websiteUrl: 'https://livingcompetitor.com',
          companyName: '家居竞争对手B',
          notes: '品牌知名度高，产品线更全'
        }
      ]
    },
    specialAttention: {
      customerExpectations: '希望打造高端家居品牌形象',
      communicationPreferences: '双周汇报，设计相关及时沟通',
      specialRequirements: '需要重视品牌形象和设计感',
      culturalConsiderations: '注重生活品质和美学体验',
      timeZonePreferences: '北京时间',
      languagePreferences: '中文',
      decisionMakers: '吴总（品牌决策）、林经理（市场执行）',
      budgetConstraints: '月度预算45万',
      complianceRequirements: '需要符合家具安全和环保标准',
      riskFactors: '设计周期长，库存风险大',
      successFactors: '设计创新、品牌建设、渠道拓展',
      historicalIssues: '设计版权纠纷'
    },
    qaRecords: [
      {
        id: 1,
        customerId: 6,
        issueDate: '2024-11-20T14:00:00Z',
        issueCategory: '营销效果问题',
        issueDescription: '新品推广效果不理想，转化率偏低',
        impactLevel: 'medium',
        rootCause: '目标受众定位不够精准，产品卖点突出不够',
        immediateSolution: '调整广告创意，突出产品设计特色',
        correctiveMeasures: '重新制作产品视频，优化产品页面',
        preventiveMeasures: '建立产品测试机制，提前验证市场反应',
        responsiblePerson: '周小伟',
        dueDate: '2024-12-15T18:00:00Z',
                 actualCompletionDate: '',
        status: 'in_progress',
        followUpActions: '每周跟进优化进展',
        lessonsLearned: '新品推广需要更长的预热期',
        attachments: ['campaign_analysis.pdf'],
        createdAt: '2024-11-20T14:00:00Z',
        updatedAt: '2024-12-20T10:30:00Z'
      }
    ],
    renewalNotes: '设计导向客户，对服务质量要求高，需要持续关注',
    projects: [],
    adAccounts: [
      {
        id: 1,
        platform: 'google',
        accountId: 'GA-678901234',
        accountName: '家居生活-Google广告',
        status: 'active',
        balance: 16500,
        lastUpdated: '2024-12-20T10:30:00Z'
      },
      {
        id: 2,
        platform: 'facebook',
        accountId: 'FB-789012345',
        accountName: '家居生活-Meta广告',
        status: 'active',
        balance: 11000,
        lastUpdated: '2024-12-20T10:30:00Z'
      }
    ],
    createdAt: '2024-06-01T08:00:00Z',
    lastUpdated: '2024-12-20T10:30:00Z'
  },
  9: {
    id: 9,
    cooperationDetails: {
      customerName: '儿童玩具乐园',
      cooperationStartTime: '2024-09-10T12:15:00Z',
      serviceStartTime: '2024-09-15T08:00:00Z',
      cooperationType: '咨询服务',
      signingSales: '孙丽',
      specialConditions: '按项目收费，提供季度优化报告',
      customerGrade: 'C',
      customerStatus: 'active'
    },
    basicInfo: {
      serviceTeam: '家居组',
      contactPersons: [
        {
          id: 9,
          name: '黄经理',
          position: '采购经理',
          phone: '13800138009',
          email: 'purchase@kidstoys.com',
          isPrimary: true
        }
      ],
      industry: '家居装饰',
      regions: ['美国', '加拿大'],
      businessModel: '传统零售转型',
      overseasSalesScale: '100-500万美元',
      overseasSalesRatio: 45,
      targetSalesScale: '800万美元',
      mainSalesChannel: '平台+独立站',
      hasTechTeam: false,
      hasOperationTeam: true,
      hasBrandTeam: false,
      cooperationTransfer: '新客户开发'
    },
    websiteInfo: {
      newProductFrequency: '每季度20-30款',
      websiteLaunchTime: '2024-08-01T08:00:00Z',
      lastYearSales: 850000,
      targetMarkets: ['美国', '加拿大'],
      mainProducts: '儿童玩具、教育用品、安全座椅',
      productAdvantages: '安全环保材质，符合国际标准，设计新颖',
      pricingStrategy: '中档定价',
      inventoryStatus: true,
      annualSalesTarget: 1200000,
      annualCostTarget: 480000,
      costRatio: 40
    },
    competitorInfo: {
      competitorWebsites: [
        {
          id: 1,
          websiteUrl: 'https://toyworld.com',
          companyName: 'ToyWorld',
          notes: '品牌知名度高，产品线丰富，但价格偏高，创新不足，市场份额约15%'
        }
      ]
    },
    specialAttention: {
      customerExpectations: '希望快速提升品牌知名度，扩大市场份额',
      communicationPreferences: '每周电话沟通，月度面对面会议',
      specialRequirements: '所有产品必须符合儿童安全标准',
      culturalConsiderations: '重视产品安全和教育价值',
      timeZonePreferences: '美国东部时间',
      languagePreferences: '中文、英文',
      decisionMakers: '黄经理负责采购决策，需要总经理最终确认',
      budgetConstraints: '季度预算有限，需要精准投放',
      complianceRequirements: '必须符合CPSC安全标准',
      riskFactors: '季节性销售波动大，库存管理风险',
      successFactors: '产品质量、安全认证、创新设计',
      historicalIssues: '之前合作伙伴服务响应慢，沟通不及时'
    },
    qaRecords: [
      {
        id: 1,
        customerId: 9,
        issueDate: '2024-10-15T14:00:00Z',
        issueCategory: '产品质量问题',
        issueDescription: '部分产品在运输过程中出现包装破损',
        impactLevel: 'medium',
        rootCause: '包装材料选择不当，运输保护不足',
        immediateSolution: '更换加厚包装材料，增加缓冲保护',
        correctiveMeasures: '重新设计包装方案，加强质量检查',
        preventiveMeasures: '建立包装测试标准，定期检查供应商',
        responsiblePerson: '孙丽',
        dueDate: '2024-11-01T18:00:00Z',
        actualCompletionDate: '2024-10-28T16:00:00Z',
        status: 'completed',
        followUpActions: '持续监控包装质量',
        lessonsLearned: '包装是产品体验的重要组成部分',
        attachments: ['packaging_test_report.pdf'],
        createdAt: '2024-10-15T14:00:00Z',
        updatedAt: '2024-10-28T16:00:00Z'
      }
    ],
    renewalNotes: '价格敏感型客户，需要展示明确的ROI数据',
    projects: [],
    adAccounts: [
      {
        id: 1,
        platform: 'google',
        accountId: 'GA-901234567',
        accountName: '儿童玩具-Google广告',
        status: 'active',
        balance: 8500,
        lastUpdated: '2024-12-20T10:30:00Z'
      }
    ],
    createdAt: '2024-09-10T12:15:00Z',
    lastUpdated: '2024-12-20T10:30:00Z'
  },
  7: {
    id: 7,
    cooperationDetails: {
      customerName: '户外运动装备',
      cooperationStartTime: '2024-07-03T16:20:00Z',
      serviceStartTime: '2024-07-10T08:00:00Z',
      cooperationType: '培训服务',
      signingSales: '周杰',
      specialConditions: '按培训课程收费，提供专业认证',
      customerGrade: 'C',
      customerStatus: 'suspended'
    },
    basicInfo: {
      serviceTeam: '运动组',
      contactPersons: [
        {
          id: 7,
          name: '林经理',
          position: '品牌经理',
          phone: '13800138007',
          email: 'brand@outdoorgear.com',
          isPrimary: true
        }
      ],
      industry: '体育用品',
      regions: ['美国', '澳大利亚'],
      businessModel: '品牌代理',
      overseasSalesScale: '50-100万美元',
      overseasSalesRatio: 60,
      targetSalesScale: '200万美元',
      mainSalesChannel: '平台销售',
      hasTechTeam: false,
      hasOperationTeam: false,
      hasBrandTeam: true,
      cooperationTransfer: '品牌升级转型'
    },
    websiteInfo: {
      newProductFrequency: '每季度10-15款',
      websiteLaunchTime: '2024-06-01T08:00:00Z',
      lastYearSales: 950000,
      targetMarkets: ['美国', '澳大利亚'],
      mainProducts: '户外帐篷、登山装备、运动服装',
      productAdvantages: '专业户外品质，耐用性强，功能齐全',
      pricingStrategy: '中高端定价',
      inventoryStatus: false,
      annualSalesTarget: 1500000,
      annualCostTarget: 750000,
      costRatio: 50
    },
    competitorInfo: {
      competitorWebsites: [
        {
          id: 1,
          websiteUrl: 'https://outdoorworld.com',
          companyName: 'OutdoorWorld',
          notes: '专业户外品牌，产品线完整，但价格较高'
        }
      ]
    },
    specialAttention: {
      customerExpectations: '希望通过培训提升团队专业能力',
      communicationPreferences: '定期培训会议，季度评估',
      specialRequirements: '需要专业户外运动认证',
      culturalConsiderations: '重视户外运动文化和安全',
      timeZonePreferences: '美国西部时间',
      languagePreferences: '英文',
      decisionMakers: '林经理负责品牌决策',
      budgetConstraints: '培训预算有限，需要性价比高的方案',
      complianceRequirements: '户外产品安全标准',
      riskFactors: '季节性明显，库存风险较高',
      successFactors: '产品质量、品牌知名度、专业服务',
      historicalIssues: '服务暂停中，需要重新评估合作模式'
    },
    qaRecords: [
      {
        id: 1,
        customerId: 7,
        issueDate: '2024-11-01T14:00:00Z',
        issueCategory: '服务暂停',
        issueDescription: '客户要求暂停服务，重新评估合作模式',
        impactLevel: 'high',
        rootCause: '培训效果未达预期，客户满意度下降',
        immediateSolution: '暂停服务，重新制定培训方案',
        correctiveMeasures: '优化培训内容，增加实践环节',
        preventiveMeasures: '定期评估培训效果，及时调整方案',
        responsiblePerson: '周杰',
        dueDate: '2024-12-31T18:00:00Z',
        actualCompletionDate: '',
        status: 'in_progress',
        followUpActions: '每月跟进客户意见，准备重启方案',
        lessonsLearned: '培训服务需要更强的定制化',
        attachments: ['training_evaluation.pdf'],
        createdAt: '2024-11-01T14:00:00Z',
        updatedAt: '2024-12-20T10:30:00Z'
      }
    ],
    renewalNotes: '服务暂停中，需要重新制定合作方案',
    projects: [],
    adAccounts: [],
    createdAt: '2024-07-03T16:20:00Z',
    lastUpdated: '2024-12-20T10:30:00Z'
  },
  8: {
    id: 8,
    cooperationDetails: {
      customerName: '高端珠宝首饰',
      cooperationStartTime: '2024-08-15T09:30:00Z',
      serviceStartTime: '2024-08-20T08:00:00Z',
      cooperationType: '代运营',
      signingSales: '吴娟',
      specialConditions: '高端定制服务，专属客户经理，VIP待遇',
      customerGrade: 'A',
      customerStatus: 'active'
    },
    basicInfo: {
      serviceTeam: '时尚组',
      contactPersons: [
        {
          id: 8,
          name: '郑总',
          position: '创始人',
          phone: '13800138008',
          email: 'founder@luxuryjewelry.com',
          isPrimary: true
        },
        {
          id: 9,
          name: '李设计师',
          position: '首席设计师',
          phone: '13800138018',
          email: 'design@luxuryjewelry.com',
          isPrimary: false
        }
      ],
      industry: '时尚服装',
      regions: ['美国', '欧洲', '日本', '澳大利亚'],
      businessModel: '高端定制品牌',
      overseasSalesScale: '1000万美元以上',
      overseasSalesRatio: 90,
      targetSalesScale: '2000万美元',
      mainSalesChannel: '独立站+精品店',
      hasTechTeam: true,
      hasOperationTeam: true,
      hasBrandTeam: true,
      cooperationTransfer: '高端品牌升级'
    },
    websiteInfo: {
      newProductFrequency: '每月2-3款限量版',
      websiteLaunchTime: '2024-07-01T08:00:00Z',
      lastYearSales: 4800000,
      targetMarkets: ['美国', '欧洲', '日本', '澳大利亚'],
      mainProducts: '钻石项链、黄金手镯、定制戒指、珍珠耳环',
      productAdvantages: '顶级材质，独特设计，限量发售，收藏价值高',
      pricingStrategy: '奢侈品定价',
      inventoryStatus: true,
      annualSalesTarget: 8000000,
      annualCostTarget: 2400000,
      costRatio: 30
    },
    competitorInfo: {
      competitorWebsites: [
        {
          id: 1,
          websiteUrl: 'https://tiffany.com',
          companyName: 'Tiffany & Co.',
          notes: '国际知名珠宝品牌，品牌价值极高，设计经典'
        },
        {
          id: 2,
          websiteUrl: 'https://cartier.com',
          companyName: 'Cartier',
          notes: '法国奢侈品牌，历史悠久，皇室御用'
        }
      ]
    },
    specialAttention: {
      customerExpectations: '打造国际知名高端珠宝品牌',
      communicationPreferences: '高频次沟通，每周视频会议',
      specialRequirements: '所有营销材料需要体现奢华品质',
      culturalConsiderations: '注重东西方文化融合，国际化视野',
      timeZonePreferences: '北京时间',
      languagePreferences: '中文、英文、日文',
      decisionMakers: '郑总拥有最终决策权',
      budgetConstraints: '预算充足，追求最佳效果',
      complianceRequirements: '珠宝行业认证，贵金属标准',
      riskFactors: '高端市场竞争激烈，品牌定位要求极高',
      successFactors: '品牌形象、设计创新、服务质量',
      historicalIssues: '对服务标准要求极高，需要专业团队'
    },
    qaRecords: [
      {
        id: 1,
        customerId: 8,
        issueDate: '2024-10-20T14:00:00Z',
        issueCategory: '品牌形象问题',
        issueDescription: '部分广告素材未能体现品牌的奢华定位',
        impactLevel: 'high',
        rootCause: '创意团队对高端珠宝行业理解不够深入',
        immediateSolution: '重新制作符合品牌调性的广告素材',
        correctiveMeasures: '组建专业的奢侈品营销团队',
        preventiveMeasures: '建立严格的品牌审核流程',
        responsiblePerson: '吴娟',
        dueDate: '2024-11-15T18:00:00Z',
        actualCompletionDate: '2024-11-10T16:00:00Z',
        status: 'completed',
        followUpActions: '持续优化品牌形象展示',
        lessonsLearned: '高端品牌需要专业的营销策略',
        attachments: ['brand_guidelines.pdf', 'luxury_marketing_strategy.pdf'],
        createdAt: '2024-10-20T14:00:00Z',
        updatedAt: '2024-11-10T16:00:00Z'
      }
    ],
    renewalNotes: '高价值客户，服务标准要求极高，续费意愿强',
    projects: [],
    adAccounts: [
      {
        id: 1,
        platform: 'google',
        accountId: 'GA-812345678',
        accountName: '珠宝首饰-Google广告',
        status: 'active',
        balance: 45000,
        lastUpdated: '2024-12-20T10:30:00Z'
      },
      {
        id: 2,
        platform: 'facebook',
        accountId: 'FB-823456789',
        accountName: '珠宝首饰-Meta广告',
        status: 'active',
        balance: 38000,
        lastUpdated: '2024-12-20T10:30:00Z'
      }
    ],
    createdAt: '2024-08-15T09:30:00Z',
    lastUpdated: '2024-12-20T10:30:00Z'
  },
  10: {
    id: 10,
    cooperationDetails: {
      customerName: '有机食品专营',
      cooperationStartTime: '2024-10-25T14:45:00Z',
      serviceStartTime: '2024-11-01T08:00:00Z',
      cooperationType: '代运营',
      signingSales: '马超',
      specialConditions: '有机认证产品专项服务，健康理念推广',
      customerGrade: 'B',
      customerStatus: 'active'
    },
    basicInfo: {
      serviceTeam: '美妆组',
      contactPersons: [
        {
          id: 10,
          name: '刘总',
          position: '总经理',
          phone: '13800138010',
          email: 'ceo@organicfood.com',
          isPrimary: true
        },
        {
          id: 11,
          name: '张营养师',
          position: '产品总监',
          phone: '13800138020',
          email: 'nutrition@organicfood.com',
          isPrimary: false
        }
      ],
      industry: '美容护肤',
      regions: ['美国', '欧洲', '加拿大'],
      businessModel: '有机食品专营',
      overseasSalesScale: '200-500万美元',
      overseasSalesRatio: 70,
      targetSalesScale: '1000万美元',
      mainSalesChannel: '独立站+健康平台',
      hasTechTeam: false,
      hasOperationTeam: true,
      hasBrandTeam: false,
      cooperationTransfer: '健康产业转型'
    },
    websiteInfo: {
      newProductFrequency: '每月8-12款',
      websiteLaunchTime: '2024-10-01T08:00:00Z',
      lastYearSales: 1400000,
      targetMarkets: ['美国', '欧洲', '加拿大'],
      mainProducts: '有机蛋白粉、天然维生素、有机茶叶、健康零食',
      productAdvantages: '100%有机认证，天然无添加，营养价值高',
      pricingStrategy: '中高端定价',
      inventoryStatus: true,
      annualSalesTarget: 2500000,
      annualCostTarget: 1000000,
      costRatio: 40
    },
    competitorInfo: {
      competitorWebsites: [
        {
          id: 1,
          websiteUrl: 'https://wholefoods.com',
          companyName: 'Whole Foods',
          notes: '有机食品领导品牌，渠道优势明显'
        },
        {
          id: 2,
          websiteUrl: 'https://organicvalley.com',
          companyName: 'Organic Valley',
          notes: '有机乳制品专家，品牌信任度高'
        }
      ]
    },
    specialAttention: {
      customerExpectations: '成为有机食品领域的知名品牌',
      communicationPreferences: '每两周电话沟通，月度报告',
      specialRequirements: '所有宣传必须符合有机食品标准',
      culturalConsiderations: '注重健康生活理念的传播',
      timeZonePreferences: '美国中部时间',
      languagePreferences: '中文、英文',
      decisionMakers: '刘总负责战略决策，张营养师负责产品决策',
      budgetConstraints: '注重投入产出比，追求可持续增长',
      complianceRequirements: '有机食品认证，FDA标准',
      riskFactors: '有机食品认证要求严格，供应链风险',
      successFactors: '产品品质、健康理念、客户教育',
      historicalIssues: '新合作客户，需要建立信任关系'
    },
    qaRecords: [
      {
        id: 1,
        customerId: 10,
        issueDate: '2024-11-25T14:00:00Z',
        issueCategory: '认证问题',
        issueDescription: '部分产品宣传内容未突出有机认证优势',
        impactLevel: 'medium',
        rootCause: '营销团队对有机食品行业了解不足',
        immediateSolution: '重新设计产品宣传内容，突出有机认证',
        correctiveMeasures: '加强团队有机食品知识培训',
        preventiveMeasures: '建立有机食品营销标准流程',
        responsiblePerson: '马超',
        dueDate: '2024-12-20T18:00:00Z',
        actualCompletionDate: '2024-12-15T16:00:00Z',
        status: 'completed',
        followUpActions: '持续优化有机食品营销策略',
        lessonsLearned: '有机食品营销需要专业知识支撑',
        attachments: ['organic_certification.pdf'],
        createdAt: '2024-11-25T14:00:00Z',
        updatedAt: '2024-12-15T16:00:00Z'
      }
    ],
    renewalNotes: '新客户，合作态度积极，有较大发展潜力',
    projects: [],
    adAccounts: [
      {
        id: 1,
        platform: 'google',
        accountId: 'GA-101234567',
        accountName: '有机食品-Google广告',
        status: 'active',
        balance: 12000,
        lastUpdated: '2024-12-20T10:30:00Z'
      },
      {
        id: 2,
        platform: 'facebook',
        accountId: 'FB-101234567',
        accountName: '有机食品-Meta广告',
        status: 'active',
        balance: 8500,
        lastUpdated: '2024-12-20T10:30:00Z'
      }
    ],
    createdAt: '2024-10-25T14:45:00Z',
    lastUpdated: '2024-12-20T10:30:00Z'
  }
}

// 模拟API函数
export const mockGetCustomers = (): Promise<ApiResponse<ExtendedCustomer[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockCustomers,
        message: '获取客户列表成功'
      })
    }, 500)
  })
}

export const mockGetCustomerDetail = (id: number): Promise<ApiResponse<CustomerDetail>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const customer = mockCustomerDetails[id]
      if (customer) {
        resolve({
          success: true,
          data: customer,
          message: '获取客户详情成功'
        })
      } else {
        reject({
          success: false,
          message: '客户不存在'
        })
      }
    }, 300)
  })
}

export const mockCreateCustomer = (customerData: Partial<CustomerDetail>): Promise<ApiResponse<CustomerDetail>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newCustomer: CustomerDetail = {
        id: Date.now(),
        cooperationDetails: customerData.cooperationDetails || {} as CooperationDetails,
        basicInfo: customerData.basicInfo || {} as CustomerBasicInfo,
        websiteInfo: customerData.websiteInfo || {} as WebsiteInfo,
        competitorInfo: customerData.competitorInfo || { competitorWebsites: [] },
        specialAttention: customerData.specialAttention || {} as SpecialAttention,
        qaRecords: [],
        renewalNotes: '',
        projects: [],
        adAccounts: [],
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString()
      }

      resolve({
        success: true,
        data: newCustomer,
        message: '创建客户成功'
      })
    }, 800)
  })
}

export const mockUpdateCustomer = (id: number, customerData: Partial<CustomerDetail>): Promise<ApiResponse<CustomerDetail>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const customer = mockCustomerDetails[id]
      if (customer) {
        const updatedCustomer = {
          ...customer,
          ...customerData,
          lastUpdated: new Date().toISOString()
        }

        resolve({
          success: true,
          data: updatedCustomer,
          message: '更新客户成功'
        })
      } else {
        reject({
          success: false,
          message: '客户不存在'
        })
      }
    }, 600)
  })
}

export const mockDeleteCustomer = (id: number): Promise<ApiResponse<void>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '删除客户成功'
      })
    }, 400)
  })
}

export const mockAddCustomerQA = (customerId: number, qaData: Partial<CustomerQA>): Promise<ApiResponse<CustomerQA>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newQA: CustomerQA = {
        id: Date.now(),
        customerId,
        issueDate: qaData.issueDate || new Date().toISOString(),
        issueCategory: qaData.issueCategory || '',
        issueDescription: qaData.issueDescription || '',
        impactLevel: qaData.impactLevel || 'medium',
        rootCause: qaData.rootCause || '',
        immediateSolution: qaData.immediateSolution || '',
        correctiveMeasures: qaData.correctiveMeasures || '',
        preventiveMeasures: qaData.preventiveMeasures || '',
        responsiblePerson: qaData.responsiblePerson || '',
        dueDate: qaData.dueDate || '',
        actualCompletionDate: qaData.actualCompletionDate || '',
        status: qaData.status || 'pending',
        followUpActions: qaData.followUpActions || '',
        lessonsLearned: qaData.lessonsLearned || '',
        attachments: qaData.attachments || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      resolve({
        success: true,
        data: newQA,
        message: '添加Q&A记录成功'
      })
    }, 500)
  })
}
