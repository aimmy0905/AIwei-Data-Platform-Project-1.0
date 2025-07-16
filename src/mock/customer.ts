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
