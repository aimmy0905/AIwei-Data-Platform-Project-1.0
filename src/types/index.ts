// 用户相关类型
export interface User {
  id: number
  username: string
  email?: string
  phone?: string
  role: UserRole
  department?: string
  avatar?: string
  lastLoginTime?: string
  status: 'active' | 'disabled' | 'locked'
}

export type UserRole = 'superAdmin' | 'manager' | 'staff' | 'finance' | 'sales'

export interface LoginForm {
  username: string
  password: string
  remember?: boolean
}

// 客户相关类型
export interface Customer {
  id: number
  name: string
  website: string
  industry: string
  revenue: number
  roi: number
  status: 'active' | 'inactive' | 'suspended'
  manager: string
  createdAt: string
  lastUpdated: string
  projects?: Project[]
  assignedTo?: string
}

// 客户详细信息类型
export interface CustomerDetail {
  id: number
  // 合作详情
  cooperationDetails: CooperationDetails
  // 客户基础信息
  basicInfo: CustomerBasicInfo
  // 独立站情况及目标
  websiteInfo: WebsiteInfo
  // 竞对情况
  competitorInfo: CompetitorInfo
  // 特别关注事项
  specialAttention: SpecialAttention
  // Q&A记录
  qaRecords: CustomerQA[]
  // 续费跟进
  renewalNotes: string
  // 关联项目
  projects: Project[]
  // 广告账户
  adAccounts: AdAccount[]
  // 续费记录
  renewalRecords?: RenewalRecord[]
  // 创建和更新时间
  createdAt: string
  lastUpdated: string
}

// 合作详情
export interface CooperationDetails {
  customerName: string
  cooperationStartTime: string // 合作起始时间（合同）
  serviceStartTime: string // 实际服务开始时间
  cooperationType: string // 合作方式
  signingSales: string // 签单销售
  specialConditions: string // 其它特殊合作条件
  customerGrade: 'A' | 'B' | 'C' // 客户分级
  customerStatus: 'active' | 'inactive' | 'suspended' // 客户状态
}

// 客户基础信息
export interface CustomerBasicInfo {
  serviceTeam: string // 艾维服务团队（具体项目组）
  contactPersons: ContactPerson[] // 联系人及对应岗位
  industry: string // 客户行业
  regions: string[] // 客户所有地区
  businessModel: string // 商业及生产模式
  overseasSalesScale: string // 海外销售额规模
  overseasSalesRatio: number // 海外销售在企业占比
  targetSalesScale: string // 海外三年内目标销售额规模
  mainSalesChannel: string // 目前公司海外销售最重要的销售渠道
  hasTechTeam: boolean // 企业内是否有网站技术及素材制作团队
  hasOperationTeam: boolean // 企业内是否有投放或运营团队
  hasBrandTeam: boolean // 企业内是否有品牌及内容团队
  cooperationTransfer: string // 此次合作是服务商转移还是内部团队转移
}

// 联系人
export interface ContactPerson {
  id: number
  name: string // 联系人姓名
  position: string // 岗位
  phone: string // 电话
  email: string // 邮箱
  isPrimary: boolean // 是否主要联系人
}

// 独立站情况及目标
export interface WebsiteInfo {
  newProductFrequency: string // 新品上线频率
  websiteLaunchTime: string // 独立站上线时间
  lastYearSales: number // 过去一年独立站出口销售额
  targetMarkets: string[] // 独立站主要推广目标市场
  mainProducts: string // 独立站主要推广重要产品
  productAdvantages: string // 产品最大的优势卖点
  pricingStrategy: string // 独立站及第三方平台价格定位
  inventoryStatus: boolean // 独立站销售产品是否在仓
  annualSalesTarget: number // 年度销售目标
  annualCostTarget: number // 年度成本目标
  costRatio: number // 成本占比
}

// 竞对情况
export interface CompetitorInfo {
  competitorWebsites: CompetitorWebsite[] // 竞争对手网址
}

// 竞对网址
export interface CompetitorWebsite {
  id: number
  websiteUrl: string // 竞对网址
  companyName: string // 竞对公司名称
  notes: string // 备注
}

// 特别关注事项
export interface SpecialAttention {
  customerExpectations: string // 客户期望
  communicationPreferences: string // 沟通偏好
  specialRequirements: string // 特殊要求
  culturalConsiderations: string // 文化考虑因素
  timeZonePreferences: string // 时区偏好
  languagePreferences: string // 语言偏好
  decisionMakers: string // 决策者信息
  budgetConstraints: string // 预算限制
  complianceRequirements: string // 合规要求
  riskFactors: string // 风险因素
  successFactors: string // 成功因素
  historicalIssues: string // 历史问题
}

// 客户Q&A记录
export interface CustomerQA {
  id: number
  customerId: number
  issueDate: string // 问题发生日期
  issueCategory: string // 问题分类
  issueDescription: string // 问题详细描述
  impactLevel: 'low' | 'medium' | 'high' | 'critical' // 影响程度
  rootCause: string // 根本原因分析
  immediateSolution: string // 即时解决方案
  correctiveMeasures: string // 改正措施
  preventiveMeasures: string // 预防措施
  responsiblePerson: string // 负责人
  dueDate: string // 完成期限
  actualCompletionDate: string // 实际完成日期
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' // 状态
  followUpActions: string // 后续行动
  lessonsLearned: string // 经验教训
  attachments: string[] // 相关附件
  createdAt: string
  updatedAt: string
}

// 广告账户
export interface AdAccount {
  id: number
  platform: 'google' | 'facebook' | 'bing' | 'criteo' | 'other'
  accountId: string
  accountName: string
  status: 'active' | 'paused' | 'limited' | 'suspended'
  balance: number
  dailySpend?: number
  lastUpdated: string
}

// 续费记录
export interface RenewalRecord {
  id: number
  customerId: number
  renewalType: string // 续费类型
  renewalAmount: number // 续费金额
  renewalPeriod: string // 续费周期
  renewalDate: string // 续费日期
  expiryDate: string // 到期日期
  status: 'pending' | 'completed' | 'cancelled' // 续费状态
  salesPerson: string // 负责销售
  notes: string // 备注
}

// 项目类型
export interface Project {
  id: string
  name: string
  customerId: number
  status: 'active' | 'completed' | 'paused' | 'cancelled'
  startDate: string
  endDate?: string
  budget: number
  revenue: number
  roi: number
  projectType?: 'new_customer' | 'redevelopment' | 'reactivation'
  contractNumber?: string
  serviceFee?: number
  balance?: number
  operationTeam?: string
  cooperationPlatforms?: string[]
}

// 渠道数据类型
export interface Channel {
  id: number
  name: string
  type: 'google' | 'facebook' | 'direct' | 'email' | 'criteo' | 'bing' | 'pinterest' | 'organic' | 'display'
  revenue: number
  users: number
  sessions: number
  conversionRate: number
  cost: number
  roi: number
}

// 扩展的渠道数据类型
export interface ChannelData {
  id: number
  name: string
  type: 'google' | 'facebook' | 'direct' | 'email' | 'criteo' | 'bing' | 'pinterest' | 'organic' | 'display' | 'other'

  // 维度信息
  sessionSourceMedium: string // 会话来源/媒介
  firstUserSourceMedium: string // 首次用户来源/媒介
  sessionCampaign: string // 会话广告系列
  firstUserCampaign: string // 首次用户广告系列

  // 结果指标
  totalRevenue: number // 总收入
  totalUsers: number // 总用户数
  averagePurchaseRevenue: number // 平均购买收入
  transactions: number // 交易次数
  userConversionRate: number // 用户转化率
  bounceRate: number // 跳出率

  // 过程指标
  addToCarts: number // 添加到购物车次数
  checkouts: number // 开始结账次数
  itemAddToCartsRate: number // 商品添加至购物车率
  itemCheckoutsRate: number // 商品结账率

  // 用户指标
  sessions: number // 会话数
  newUsers: number // 新用户数
  returningUsers: number // 回访用户数
  averagePurchaseRevenuePerUser: number // 每用户平均购买收入
  averageOrdersPerCustomer: number // 平均每位客户订单数

  // 时间数据
  date?: string
  period?: string
}

// 渠道数据汇总
export interface ChannelSummary {
  totalRevenue: number
  totalUsers: number
  totalSessions: number
  averageConversionRate: number
  totalCost: number
  averageROI: number
  topPerformingChannel: string
  channelCount: number
}

// 渠道数据维度选择
export interface ChannelDimension {
  id: string
  name: string
  category: 'dimension' | 'result' | 'process' | 'user'
  description: string
  format: 'number' | 'currency' | 'percentage' | 'string'
  selected: boolean
}

// 期间比较数据类型
export interface PeriodComparison {
  current: number
  previous: number
  change: number // 绝对变化
  changePercent: number // 百分比变化
  trend: 'up' | 'down' | 'neutral' // 趋势方向
}

// 比较期间类型
export type ComparisonPeriod = 'mom' | 'qoq' // Month-over-Month, Quarter-over-Quarter

// 网站数据类型
export interface WebsiteData {
  // 结果指标
  totalSales: number
  totalCost: number
  roi: number
  averageOrderItems: number // AOI - 订单的平均产品数量
  orderConversionCost: number // 订单转化成本
  averageOrderValue: number
  conversionRate: number
  storeVisits: number // 商店访问次数
  userVisitCost: number // 用户访问成本

  // 订单指标
  orders: number
  orderItemsPerOrder: number // 每笔订单的订购数量
  ordersPerCustomer: number // 每位客户的订单数
  returningCustomerOrders: number // 订单数(回头客)
  newCustomerOrders: number // 订单数(新客户)

  // 用户指标
  visitors: number
  visits: number // 访问次数
  newUsers: number
  returningUsers: number
  addToCartVisits: number // 加购访问次数
  reachCheckoutVisits: number // 到达结账页面的访问次数
  completeCheckoutVisits: number // 到达并完成结账的访问次数
  completedCheckoutVisits: number // 完成结账的访问次数
  averageVisitDuration: number // 平均访问持续时间(秒)
  bounceCount: number // 跳出量
  bounceRate: number

  // 用户漏斗
  addToCartRate: number // 加购率
  checkoutCompletionRate: number // 完成结账率
  checkoutConversionRate: number // 结账转化率

  // 退货指标
  returns: number // 退货数
  returnAmount: number // 退货金额
  returnRate: number // 退货数量比例
  returnSalesRatio: number // 退货销售额占比

  // 库存指标
  dailySoldUnits: number // 每日售出库存单位数
  remainingStockDays: number // 剩余库存天数
  inStockDays: number // 有货的天数
  outOfStockDays: number // 缺货的天数
  averageStockDays: number // 在库天数
  sellThroughRate: number // 售罄率
}

// 网站数据比较类型
export interface WebsiteDataComparison {
  // 结果指标比较
  totalSales: PeriodComparison
  totalCost: PeriodComparison
  roi: PeriodComparison
  averageOrderItems: PeriodComparison
  orderConversionCost: PeriodComparison
  averageOrderValue: PeriodComparison
  conversionRate: PeriodComparison
  storeVisits: PeriodComparison
  userVisitCost: PeriodComparison

  // 订单指标比较
  orders: PeriodComparison
  orderItemsPerOrder: PeriodComparison
  ordersPerCustomer: PeriodComparison
  returningCustomerOrders: PeriodComparison
  newCustomerOrders: PeriodComparison

  // 用户指标比较
  visitors: PeriodComparison
  visits: PeriodComparison
  newUsers: PeriodComparison
  returningUsers: PeriodComparison
  addToCartVisits: PeriodComparison
  reachCheckoutVisits: PeriodComparison
  completeCheckoutVisits: PeriodComparison
  completedCheckoutVisits: PeriodComparison
  averageVisitDuration: PeriodComparison
  bounceCount: PeriodComparison
  bounceRate: PeriodComparison

  // 用户漏斗比较
  addToCartRate: PeriodComparison
  checkoutCompletionRate: PeriodComparison
  checkoutConversionRate: PeriodComparison

  // 退货指标比较
  returns: PeriodComparison
  returnAmount: PeriodComparison
  returnRate: PeriodComparison
  returnSalesRatio: PeriodComparison

  // 库存指标比较
  dailySoldUnits: PeriodComparison
  remainingStockDays: PeriodComparison
  inStockDays: PeriodComparison
  outOfStockDays: PeriodComparison
  averageStockDays: PeriodComparison
  sellThroughRate: PeriodComparison
}

// 活动数据类型
export interface Campaign {
  id: number
  name: string
  type: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  startDate: string
  endDate: string
  budget: number
  spent: number
  revenue: number
  roi: number
  impressions: number
  clicks: number
  conversions: number
}

// 扩展的活动数据类型
export interface CampaignData {
  id: number
  name: string
  type: 'promotion' | 'acquisition' | 'seasonal' | 'branding' | 'retargeting'
  status: 'draft' | 'active' | 'paused' | 'completed'
  stage: 'preparation' | 'warmup' | 'official' | 'ended'
  targetMarket: string
  content: string
  channels: string[]
  startDate: string
  endDate: string

  // 基础数据
  budget: number
  spent: number
  revenue: number
  roi: number

  // 详细指标
  totalSales: number
  totalCost: number
  userCount: number
  conversionRate: number
  averageOrderValue: number
  orderCount: number
  returnRate: number
  returnAmount: number

  // 广告数据
  adSpend: number
  adRevenue: number
  adROI: number
  adRevenueRatio: number

  // 平台数据
  googleSpend?: number
  googleRevenue?: number
  googleROI?: number
  facebookSpend?: number
  facebookRevenue?: number
  facebookROI?: number
  bingSpend?: number
  bingRevenue?: number
  bingROI?: number
  criteoSpend?: number
  criteoRevenue?: number
  criteoROI?: number
}

// 活动单日数据
export interface CampaignDailyData {
  date: string
  campaignId: number

  // 整站数据
  totalRevenue: number
  totalAdSpend: number
  totalROI: number
  orderCount: number
  averageOrderValue: number

  // 广告数据
  adRevenue: number
  adROI: number
  adRevenueRatio: number

  // 平台明细
  platforms: {
    google: { spend: number; revenue: number; roi: number }
    facebook: { spend: number; revenue: number; roi: number }
    bing: { spend: number; revenue: number; roi: number }
    criteo: { spend: number; revenue: number; roi: number }
  }
}

// 活动汇总数据
export interface CampaignSummary {
  totalCampaigns: number
  activeCampaigns: number
  totalBudget: number
  totalSpent: number
  totalRevenue: number
  averageROI: number
  topPerformingCampaign: string
  totalConversions: number
}

// 产品销售类型
export interface ProductSales {
  id: number
  name: string
  category: string
  price: number
  soldQuantity: number
  revenue: number
  profit: number
  stock: number
  image?: string
}

// 扩展的产品销售数据类型
export interface ProductSalesData {
  id: number
  sku: string
  name: string
  category: string
  price: number

  // 销量排名数据
  grossSales: number // 毛销售额
  totalSales: number // 总销售额
  salesRatio: number // 销售额占比
  netSoldQuantity: number // 净售出商品数
  averageOrderAmount: number // 平均订单金额
  quantityPerOrder: number // 每笔订单的订购数量
  refundAmount: number // 退款金额
  refundQuantity: number // 退款数量
  stockStatus: 'in_stock' | 'low_stock' | 'out_of_stock' // 库存状态
  stockoutLoss: number // 因缺货导致销售额损失

  // 流量指标
  visitors: number // 在线商店访客数
  visits: number // 访问次数
  newUsers: number // 新用户数
  returningUsers: number // 回访用户数
  addToCartVisits: number // 加购访问次数
  checkoutVisits: number // 到达结账页面的访问次数

  // 转化率指标
  addToCartRate: number // 加购转化率
  checkoutRate: number // 结账转化率
  purchaseRate: number // 购买转化率

  // 其他指标
  viewToCartRate: number // 浏览到加购转化率
  cartToCheckoutRate: number // 加购到结账转化率
  averageViewTime: number // 平均浏览时间
  bounceRate: number // 跳出率

  // 时间数据
  lastUpdated: string
}

// 产品销售排名类型
export interface ProductRanking {
  type: 'category' | 'sku'
  products: ProductSalesData[]
  totalProducts: number
  totalRevenue: number
  averageOrderValue: number
}

// 产品销售汇总
export interface ProductSalesSummary {
  totalProducts: number
  totalRevenue: number
  totalOrders: number
  averageOrderValue: number
  topSellingProduct: string
  topCategory: string
  totalRefunds: number
  averageConversionRate: number
}

// 部门类型
export interface Department {
  id: number
  name: string
  code: string
  parentId?: number
  managerId: number
  managerName: string
  employeeCount: number
  budget?: number
  status: 'active' | 'inactive'
  createdAt: string
}

// 员工类型
export interface Employee {
  id: number
  name: string
  email: string
  phone: string
  departmentId: number
  departmentName: string
  position: string
  salary?: number
  hireDate: string
  status: 'active' | 'inactive' | 'on_leave'
  performance?: {
    rating: number
    goals: number
    achievements: number
  }
}

// 预警类型
export interface Alert {
  id: number
  type: 'balance' | 'service' | 'price' | 'stock'
  level: 'low' | 'medium' | 'high' | 'critical'
  title: string
  message: string
  customerId?: number
  customerName?: string
  createdAt: string
  isRead: boolean
}

// 主题类型
export interface Theme {
  name: string
  primary: string
  secondary: string
  success: string
  warning: string
  error: string
  background: string
  surface: string
  text: string
}

// 菜单类型
export interface MenuItem {
  id: string
  name: string
  icon: string
  path?: string
  children?: MenuItem[]
  roles?: UserRole[]
  badge?: number
}

// 图表数据类型
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string
    borderColor?: string
  }[]
}

// API响应类型
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  message?: string
  code?: number
}

// 分页类型
export interface Pagination {
  page: number
  pageSize: number
  total: number
  totalPages: number
}

// 筛选条件类型
export interface FilterOptions {
  customerId?: number
  dateRange?: {
    start: string
    end: string
  }
  status?: string
  keyword?: string
}

// 红人(KOL)数据类型
export interface KOLData {
  id: number
  name: string
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter' | 'weibo'
  avatar: string
  verified: boolean

  // 基本信息
  category: string // 分类：时尚、美妆、科技、生活等
  location: string // 地区
  language: string // 主要语言

  // 粉丝数据
  followers: number // 粉丝数
  followersGrowth: number // 粉丝增长率
  avgViews: number // 平均观看量
  avgLikes: number // 平均点赞数
  avgComments: number // 平均评论数
  avgShares: number // 平均分享数

  // 互动数据
  engagementRate: number // 互动率
  reachRate: number // 触达率
  impressions: number // 展现量

  // 合作数据
  collaborationCount: number // 合作次数
  totalSpent: number // 总投入
  totalRevenue: number // 总收入
  roi: number // ROI

  // 内容数据
  postsCount: number // 帖子数量
  videosCount: number // 视频数量
  storiesCount: number // 故事数量

  // 状态
  status: 'active' | 'inactive' | 'pending' | 'blacklisted'
  lastActiveDate: string
  joinDate: string
}

// 帖子数据类型
export interface PostData {
  id: number
  kolId: number
  kolName: string
  kolAvatar: string
  platform: 'instagram' | 'tiktok' | 'youtube' | 'facebook' | 'twitter' | 'weibo'

  // 基本信息
  title: string
  content: string
  type: 'image' | 'video' | 'story' | 'reel' | 'live'
  thumbnail: string
  url: string

  // 发布信息
  publishDate: string
  status: 'published' | 'scheduled' | 'draft' | 'deleted'

  // 互动数据
  views: number
  likes: number
  comments: number
  shares: number
  saves: number

  // 计算指标
  engagementRate: number
  reachRate: number
  impressions: number

  // 商业数据
  isSponsored: boolean
  campaignId?: number
  campaignName?: string
  cost: number
  revenue: number
  conversions: number
  clicks: number
  ctr: number // 点击率

  // 内容标签
  hashtags: string[]
  mentions: string[]

  // 地理数据
  topCountries: { country: string; percentage: number }[]
  topCities: { city: string; percentage: number }[]

  // 受众数据
  audienceAge: { range: string; percentage: number }[]
  audienceGender: { gender: string; percentage: number }[]
}

// 红人汇总数据
export interface KOLSummary {
  totalKOLs: number
  activeKOLs: number
  totalFollowers: number
  totalPosts: number
  totalSpent: number
  totalRevenue: number
  averageROI: number
  averageEngagementRate: number
  topPerformingKOL: string
  topPerformingPost: string
  totalImpressions: number
  totalReach: number
}

// 帖子汇总数据
export interface PostSummary {
  totalPosts: number
  publishedPosts: number
  totalViews: number
  totalLikes: number
  totalComments: number
  totalShares: number
  averageEngagementRate: number
  topPerformingPost: string
  totalImpressions: number
  totalReach: number
  totalConversions: number
  averageCTR: number
}

// 红人筛选条件
export interface KOLFilter {
  platform?: string
  category?: string
  location?: string
  minFollowers?: number
  maxFollowers?: number
  minEngagementRate?: number
  maxEngagementRate?: number
  status?: string
  dateRange?: {
    start: string
    end: string
  }
}

// 帖子筛选条件
export interface PostFilter {
  platform?: string
  type?: string
  kolId?: number
  campaignId?: number
  status?: string
  dateRange?: {
    start: string
    end: string
  }
  minViews?: number
  maxViews?: number
  minEngagementRate?: number
  maxEngagementRate?: number
}

// 红人排名数据
export interface KOLRanking {
  type: 'followers' | 'engagement' | 'roi' | 'revenue'
  kols: KOLData[]
  totalCount: number
  averageValue: number
}

// 帖子排名数据
export interface PostRanking {
  type: 'views' | 'engagement' | 'conversions' | 'revenue'
  posts: PostData[]
  totalCount: number
  averageValue: number
}

// 国家/地区市场数据类型
export interface CountryMarketData {
  id: number
  country: string
  countryCode: string
  region: string
  continent: string

  // 基础数据
  totalSales: number
  totalOrders: number
  totalUsers: number
  totalSessions: number

  // 计算指标
  salesRatio: number // 销售额占比
  orderRatio: number // 订单占比
  userRatio: number // 用户占比
  sessionRatio: number // 会话占比
  averageOrderValue: number // 平均订单价值
  conversionRate: number // 转化率

  // 用户行为
  averageSessionDuration: number // 平均会话时长
  bounceRate: number // 跳出率
  pagesPerSession: number // 每次会话页面数

  // 增长数据
  salesGrowth: number // 销售增长率
  userGrowth: number // 用户增长率
  orderGrowth: number // 订单增长率

  // 时间数据
  lastUpdated: string
}

// 地区市场汇总数据
export interface MarketSummary {
  totalCountries: number
  totalRegions: number
  totalSales: number
  totalOrders: number
  totalUsers: number
  topPerformingCountry: string
  topPerformingRegion: string
  averageOrderValue: number
  averageConversionRate: number
  topCountriesByRevenue: CountryMarketData[]
  revenueDistribution: { region: string; revenue: number; percentage: number }[]
}

// 地区市场筛选条件
export interface MarketFilter {
  region?: string
  continent?: string
  country?: string
  minSales?: number
  maxSales?: number
  minOrders?: number
  maxOrders?: number
  minUsers?: number
  maxUsers?: number
  sortBy?: 'sales' | 'orders' | 'users' | 'conversionRate' | 'aov'
  sortOrder?: 'asc' | 'desc'
  dateRange?: {
    start: string
    end: string
  }
}

// 地区市场排名数据
export interface MarketRanking {
  type: 'sales' | 'orders' | 'users' | 'conversionRate' | 'aov'
  countries: CountryMarketData[]
  totalCount: number
  averageValue: number
}

// 地区市场趋势数据
export interface MarketTrend {
  country: string
  period: string
  sales: number
  orders: number
  users: number
  conversionRate: number
  averageOrderValue: number
}

// 页面表现数据类型
export interface PagePerformanceData {
  id: number
  pageName: string // 落地页面名称
  pageUrl: string // 页面URL
  pageType: 'home' | 'category' | 'product' | 'checkout' | 'cart' | 'search' | 'blog' | 'contact' | 'about' | 'other'
  pageCategory: string // 页面类别内容（首页、类目页、详情页等）
  productType?: string // 产品类型

  // 结果指标
  users: number // 用户数
  newUsers: number // 新用户数
  userCost: number // 用户成本
  conversionRate: number // 转化率
  revenue: number // 销售额
  usersRatio: number // 用户数占比
  revenueRatio: number // 销售额占比
  bounceRate: number // 跳出率

  // 过程指标
  addToCartCount: number // 加购数
  addToCartRate: number // 加购率
  checkoutPageViews: number // 支付页面浏览量
  checkoutConversionRate: number // 支付页面转化率
  averageSessionDuration: number // 平均会话时长(秒)
  averageTimeOnPage: number // 页面停留时间(秒)
  averageLoadTime: number // 页面加载时间(毫秒)

  // 其他指标
  pageViews: number // 页面浏览量
  uniquePageViews: number // 独特页面浏览量
  entrances: number // 入口次数
  exits: number // 退出次数
  exitRate: number // 退出率
  clickThroughRate: number // 点击率

  // 时间数据
  date?: string
  lastUpdated: string
}

// 页面表现汇总数据
export interface PagePerformanceSummary {
  totalPages: number
  totalPageViews: number
  totalUsers: number
  totalRevenue: number
  averageConversionRate: number
  averageBounceRate: number
  averageTimeOnPage: number
  averageLoadTime: number
  topPerformingPage: string
  topRevenueGenerator: string
  totalAddToCarts: number
  averageAddToCartRate: number
}

// 页面表现筛选条件
export interface PagePerformanceFilter {
  pageType?: string
  pageCategory?: string
  productType?: string
  minUsers?: number
  maxUsers?: number
  minRevenue?: number
  maxRevenue?: number
  minConversionRate?: number
  maxConversionRate?: number
  sortBy?: 'users' | 'revenue' | 'conversionRate' | 'bounceRate' | 'addToCartRate'
  sortOrder?: 'asc' | 'desc'
  dateRange?: {
    start: string
    end: string
  }
}

// 页面表现排名数据
export interface PagePerformanceRanking {
  type: 'users' | 'revenue' | 'conversionRate' | 'bounceRate' | 'addToCartRate'
  pages: PagePerformanceData[]
  totalCount: number
  averageValue: number
}

// 竞品数据类型
export interface CompetitorData {
  id: number
  name: string // 竞品名称
  website: string // 网址
  industry: string // 行业
  description?: string // 描述

  // 活动信息
  currentCampaign?: string // 活动内容
  campaignStartDate?: string // 活动开始时间
  campaignEndDate?: string // 活动结束时间
  campaignType?: 'promotion' | 'seasonal' | 'product_launch' | 'brand_awareness' | 'other'

  // 监控数据
  priceRange?: string // 价格范围
  mainProducts?: string[] // 主要产品
  targetMarkets?: string[] // 目标市场
  marketingChannels?: string[] // 营销渠道

  // 分析数据
  estimatedTraffic?: number // 预估流量
  socialMediaFollowers?: {
    platform: string
    followers: number
  }[]
  keywordRanking?: {
    keyword: string
    position: number
  }[]

  // 状态
  status: 'monitoring' | 'paused' | 'inactive'
  addedDate: string
  lastUpdated: string
  addedBy: string
}

// 竞品汇总数据
export interface CompetitorSummary {
  totalCompetitors: number
  activeCompetitors: number
  totalCampaigns: number
  activeCampaigns: number
  topCompetitor: string
  mostActiveCompetitor: string
  averageTraffic: number
  topKeywords: string[]
}

// 竞品筛选条件
export interface CompetitorFilter {
  industry?: string
  status?: string
  campaignType?: string
  hasActiveCampaign?: boolean
  targetMarket?: string
  marketingChannel?: string
  keyword?: string
  sortBy?: 'name' | 'traffic' | 'followers' | 'lastUpdated'
  sortOrder?: 'asc' | 'desc'
  dateRange?: {
    start: string
    end: string
  }
}

// 竞品排名数据
export interface CompetitorRanking {
  type: 'traffic' | 'followers' | 'keywords' | 'campaigns'
  competitors: CompetitorData[]
  totalCount: number
  averageValue: number
}

// 广告平台类型
export type AdPlatform = 'google' | 'meta' | 'bing' | 'criteo'

// 全平台广告数据类型
export interface AdPlatformData {
  id: number
  platform: AdPlatform
  accountName: string // 账户名称
  accountId: string // 账户ID
  status: 'active' | 'paused' | 'limited' | 'suspended'

  // 基础数据
  spend: number // 花费
  spendRatio: number // 花费占比
  revenue: number // 购物收入
  roas: number // 广告投资回报率
  purchases: number // 购物数
  cpa: number // 每次获取成本
  averagePurchaseValue: number // 平均购物转化价值
  conversionRate: number // 转化率

  // 展示数据
  impressions: number // 展示次数
  cpm: number // 千次展示成本
  reach?: number // 覆盖人数
  frequency?: number // 频次

  // 点击数据
  clicks: number // 点击量
  ctr: number // 点击率
  cpc: number // 单次点击成本
  uniqueClicks?: number // 独特点击量

  // 视频数据（如适用）
  videoViews?: number // 观看次数
  videoViewRate?: number // 视频观看率
  averageViewDuration?: number // 平均观看时长

  // 时间数据
  date?: string
  lastUpdated: string
}

// 全平台广告汇总数据
export interface AdPlatformSummary {
  totalPlatforms: number
  activePlatforms: number
  totalSpend: number
  totalRevenue: number
  averageROAS: number
  totalImpressions: number
  totalClicks: number
  averageCTR: number
  averageCPC: number
  topPerformingPlatform: string
  platformDistribution: { platform: string; spend: number; revenue: number; percentage: number }[]
}

// Meta广告数据类型
export interface MetaAdData {
  id: number
  accountId: string
  accountName: string
  campaignId?: string
  campaignName?: string
  adSetId?: string
  adSetName?: string
  adId?: string
  adName?: string

  // 基础数据
  spend: number // 已花费金额
  revenue: number // 广告收入
  roas: number // ROAS
  aov: number // 平均订单价值
  purchases: number // 购物次数
  purchaseValue: number // 购物转化价值
  averagePurchaseValue: number // 平均购物转化价值

  // 转化数据
  conversionRate: number // 转化率
  costPerPurchase: number // 转化成本
  addToCarts: number // 加购次数
  addToCartRate: number // 加购率
  costPerAddToCart: number // 加购成本
  checkoutsInitiated: number // 发起结账次数
  checkoutRate: number // 结账率

  // 曝光层数据
  impressions: number // 展示次数
  reach: number // 覆盖人数
  frequency: number // 频次
  cpm: number // 千次展示费用

  // 点击数据
  clicks: number // 点击量
  ctr: number // 点击率
  cpc: number // 单次点击费用
  linkClicks: number // 链接点击量
  linkCTR: number // 链接点击率
  costPerLinkClick: number // 单次链接点击费用

  // 互动数据
  postEngagement?: number // 帖文互动
  costPerPostEngagement?: number // 单次帖文互动费用
  likes?: number // 点赞数
  costPerLike?: number // 单次点赞费用
  comments?: number // 评论数
  shares?: number // 分享数

  // 视频数据
  videoViews?: number // 视频播放量
  averageVideoPlayTime?: number // 视频平均播放时长
  videoPlays3s?: number // 播放视频达3秒的次数
  costPerVideoPlay3s?: number // 播放视频达3秒的单次费用
  thruPlays?: number // ThruPlay次数
  costPerThruPlay?: number // 单次ThruPlay费用
  videoPlays25?: number // 视频播放进度达25%的次数
  videoPlays50?: number // 视频播放进度达50%的次数
  videoPlays75?: number // 视频播放进度达75%的次数
  videoPlays95?: number // 视频播放进度达95%的次数
  videoPlays100?: number // 视频播放进度达100%的次数

  // 落地页数据
  landingPageViews?: number // 落地页浏览量
  costPerLandingPageView?: number // 单次落地页浏览费用
  contentViews?: number // 内容查看次数
  costPerContentView?: number // 单次内容查看费用

  // 时间数据
  date?: string
  lastUpdated: string
}

// Meta广告目标类型
export type MetaAdObjective = 'conversion' | 'traffic' | 'brand_awareness' | 'engagement' | 'video_views'

// Meta广告目标数据
export interface MetaAdObjectiveData {
  objective: MetaAdObjective
  spend: number
  spendRatio: number
  revenue: number
  revenueRatio: number
  roas: number
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  conversionRate: number
}

// Meta受众类型
export type MetaAudienceType = 'interest' | 'lookalike' | 'custom' | 'remarketing' | 'asc'

// Meta受众数据
export interface MetaAudienceData {
  audienceType: MetaAudienceType
  audienceName: string
  spend: number
  revenue: number
  roas: number
  purchases: number
  aov: number
  conversionRate: number
  costPerPurchase: number
  addToCartRate: number
  costPerAddToCart: number
  users: number
  ctr: number
  cpc: number
  cpm: number
}

// Meta版位类型
export type MetaPlacementType = 'facebook' | 'instagram' | 'audience_network' | 'messenger' | 'unknown'

// Meta版位数据
export interface MetaPlacementData {
  placement: MetaPlacementType
  spend: number
  revenue: number
  roas: number
  conversionRate: number
  addToCartRate: number
  ctr: number
  users: number
  cpc: number
  cpm: number
}

// Meta用户画像数据
export interface MetaDemographicData {
  dimension: 'age' | 'gender' | 'device' | 'platform' | 'region'
  value: string // 具体的维度值，如 "25-34", "male", "mobile", etc.
  spend: number
  revenue: number
  aov: number
  roas: number
  purchases: number
  conversionRate: number
  costPerPurchase: number
  addToCartRate: number
  costPerAddToCart: number
  users: number
  ctr: number
  cpm: number
}

// Meta素材数据
export interface MetaCreativeData {
  id: number
  type: 'image' | 'video' | 'carousel' | 'collection'
  name: string
  preview: string // 素材预览URL
  landingPage: string
  spend: number
  revenue: number
  aov: number
  roas: number
  purchases: number
  conversionRate: number
  costPerPurchase: number
  addToCartRate: number
  costPerAddToCart: number
  users: number
  ctr: number
  cpm: number
  status: 'active' | 'paused' | 'archived'
  createdDate: string
  lastUpdated: string
}

// Google广告数据类型
export interface GoogleAdData {
  id: number
  accountId: string
  accountName: string
  campaignId?: string
  campaignName?: string
  adGroupId?: string
  adGroupName?: string
  adId?: string
  adName?: string

  // 基础数据
  cost: number // 费用
  revenue: number // 收入
  roas: number // ROAS
  conversions: number // 转化次数
  conversionValue: number // 转化价值
  costPerConversion: number // 每次转化费用
  conversionRate: number // 转化率

  // 展示数据
  impressions: number // 展示次数
  cpm: number // 千次展示费用
  impressionShare?: number // 展示份额

  // 点击数据
  clicks: number // 点击次数
  ctr: number // 点击率
  cpc: number // 每次点击费用
  avgPosition?: number // 平均排名

  // 购物数据（适用于购物广告）
  shoppingImpressions?: number // 购物展示次数
  shoppingClicks?: number // 购物点击次数
  shoppingCTR?: number // 购物点击率
  shoppingCPC?: number // 购物每次点击费用

  // 质量得分
  qualityScore?: number // 质量得分
  expectedCTR?: string // 预期点击率
  adRelevance?: string // 广告相关性
  landingPageExperience?: string // 着陆页体验

  // 时间数据
  date?: string
  lastUpdated: string
}

// Google广告类型
export type GoogleAdType = 'search' | 'display' | 'shopping' | 'video' | 'app' | 'smart'

// Google广告类型数据
export interface GoogleAdTypeData {
  adType: GoogleAdType
  cost: number
  costRatio: number
  revenue: number
  revenueRatio: number
  roas: number
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  conversionRate: number
}

// Criteo广告数据类型
export interface CriteoAdData {
  id: number
  accountId: string
  accountName: string
  campaignId?: string
  campaignName?: string

  // 基础数据
  cost: number // 费用
  revenue: number // 收入
  roas: number // ROAS
  orders: number // 订单数
  orderValue: number // 订单价值
  costPerOrder: number // 每订单费用

  // 展示数据
  impressions: number // 展示次数
  cpm: number // 千次展示费用
  reach?: number // 覆盖人数

  // 点击数据
  clicks: number // 点击次数
  ctr: number // 点击率
  cpc: number // 每次点击费用

  // 版位数据
  displayImpressions?: number // 展示广告展示次数
  displayClicks?: number // 展示广告点击次数
  displayCTR?: number // 展示广告点击率
  displayCPC?: number // 展示广告每次点击费用

  // 时间数据
  date?: string
  lastUpdated: string
}

// Criteo版位类型
export type CriteoPlacementType = 'display' | 'native' | 'video' | 'app'

// Criteo版位数据
export interface CriteoPlacementData {
  placement: CriteoPlacementType
  cost: number
  revenue: number
  roas: number
  impressions: number
  clicks: number
  ctr: number
  orders: number
  orderValue: number
  costPerOrder: number
}

// Bing广告数据类型
export interface BingAdData {
  id: number
  accountId: string
  accountName: string
  campaignId?: string
  campaignName?: string
  adGroupId?: string
  adGroupName?: string
  adId?: string
  adName?: string

  // 基础数据
  spend: number // 花费
  revenue: number // 收入
  roas: number // ROAS
  conversions: number // 转化次数
  conversionValue: number // 转化价值
  costPerConversion: number // 每次转化费用
  conversionRate: number // 转化率

  // 展示数据
  impressions: number // 展示次数
  cpm: number // 千次展示费用
  impressionShare?: number // 展示份额

  // 点击数据
  clicks: number // 点击次数
  ctr: number // 点击率
  cpc: number // 每次点击费用
  avgPosition?: number // 平均排名

  // 质量得分
  qualityScore?: number // 质量得分
  keywordRelevance?: number // 关键词相关性
  landingPageRelevance?: number // 着陆页相关性
  landingPageUserExperience?: number // 着陆页用户体验

  // 时间数据
  date?: string
  lastUpdated: string
}

// 广告数据筛选条件
export interface AdDataFilter {
  platform?: AdPlatform
  accountId?: string
  campaignId?: string
  adSetId?: string
  adId?: string
  dateRange?: {
    start: string
    end: string
  }
  minSpend?: number
  maxSpend?: number
  minROAS?: number
  maxROAS?: number
  sortBy?: 'spend' | 'revenue' | 'roas' | 'ctr' | 'conversions'
  sortOrder?: 'asc' | 'desc'
}

// 广告数据趋势
export interface AdDataTrend {
  date: string
  platform: AdPlatform
  spend: number
  revenue: number
  roas: number
  impressions: number
  clicks: number
  ctr: number
  conversions: number
  conversionRate: number
}

// 客户目标相关类型
export interface CustomerGoal {
  id: number
  customerId: number
  customerName: string
  projectId: string
  projectName: string
  goalType: 'monthly' | 'quarterly' | 'yearly'
  goalPeriod: string // 目标周期，如 "2025-01", "2025-Q1", "2025"

  // 目标值
  salesTarget: number // 销售目标
  costTarget: number // 成本目标
  roiTarget: number // ROI目标
  profitTarget?: number // 利润目标
  userTarget?: number // 用户数目标

  // 实际完成值
  salesActual: number // 实际销售额
  costActual: number // 实际成本
  roiActual: number // 实际ROI
  profitActual?: number // 实际利润
  userActual?: number // 实际用户数

  // 完成率
  salesProgress: number // 销售完成率 (0-100)
  costProgress: number // 成本完成率 (0-100)
  roiProgress: number // ROI完成率 (0-100)
  profitProgress?: number // 利润完成率 (0-100)
  userProgress?: number // 用户完成率 (0-100)

  // 状态
  status: 'active' | 'completed' | 'paused' | 'cancelled'

  // 时间信息
  startDate: string
  endDate: string
  createdAt: string
  createdBy: string
  lastUpdated: string

  // 备注
  notes?: string
}

export interface CustomerGoalSummary {
  totalGoals: number
  activeGoals: number
  completedGoals: number
  averageSalesProgress: number
  averageROIProgress: number
  totalSalesTarget: number
  totalSalesActual: number
  totalCostTarget: number
  totalCostActual: number
  bestPerformingProject: string
  worstPerformingProject: string
}

export interface CustomerGoalFilter {
  goalType?: 'monthly' | 'quarterly' | 'yearly'
  customerId?: number
  projectId?: string
  status?: string
  goalPeriod?: string
  dateRange?: {
    start: string
    end: string
  }
  minSalesTarget?: number
  maxSalesTarget?: number
  minProgress?: number
  maxProgress?: number
  sortBy?: 'salesTarget' | 'salesProgress' | 'roiTarget' | 'roiProgress' | 'startDate'
  sortOrder?: 'asc' | 'desc'
}

export interface CustomerGoalRanking {
  type: 'salesTarget' | 'salesProgress' | 'roiTarget' | 'roiProgress'
  goals: CustomerGoal[]
  totalCount: number
  averageValue: number
}

// ============ 活动管理模块类型定义 ============

// 活动基础信息类型
export interface Activity {
  id: number
  name: string // 活动名称
  type: 'promotion' | 'brand' | 'holiday' | 'other' // 活动类型
  stage: 'warm_up' | 'formal' // 活动阶段
  status: 'warm_up' | 'running' | 'ended' | 'cancelled' // 活动状态
  targetMarket: string // 目标市场
  content: string // 活动内容
  channels: string[] // 参与渠道
  projectId: number // 关联项目ID
  projectName?: string // 关联项目名称
  ownerId: number // 负责人ID
  ownerName?: string // 负责人姓名
  startTime: string // 开始时间
  endTime: string // 结束时间
  budget: number // 活动预算
  targetSales: number // 目标销售额
  targetROI: number // 目标ROI
  targetConversionRate: number // 目标转化率
  createdBy: number // 创建人ID
  createdAt: string // 创建时间
  updatedAt: string // 更新时间
}

// 活动数据统计类型
export interface ActivityData {
  id: number
  activityId: number // 活动ID
  date: string // 数据日期
  totalSales: number // 总销售额
  totalCost: number // 总成本
  adSpend: number // 广告花费
  roi: number // 投资回报率
  conversionRate: number // 转化率
  orderCount: number // 订单数量
  userCount: number // 用户数量
  avgOrderValue: number // 平均客单价
  returnRate: number // 退货率
  returnAmount: number // 退货金额

  // 平台分解数据
  googleSpend: number
  googleRevenue: number
  googleROI: number
  facebookSpend: number
  facebookRevenue: number
  facebookROI: number
  bingSpend: number
  bingRevenue: number
  bingROI: number
  criteoSpend: number
  criteoRevenue: number
  criteoROI: number

  updatedAt: string // 更新时间
}

// 活动产品数据类型
export interface ActivityProductData {
  id: number
  activityId: number // 活动ID
  productId: string // 产品ID
  productTitle: string // 产品标题
  productCategory: string // 产品品类
  userCount: number // 用户数
  salesVolume: number // 销量
  salesAmount: number // 销售额
  conversionRate: number // 转化率
  avgOrderValue: number // 客单价
  returnCount: number // 退货数
  returnAmount: number // 退款金额
  addToCartCount: number // 加购数
  checkoutCount: number // 发起结账数
  addToCartRate: number // 加购率
  checkoutRate: number // 发起结账率
  date: string // 数据日期
  updatedAt: string // 更新时间

  // 环比数据
  momData?: {
    userCountChange: number
    salesVolumeChange: number
    salesAmountChange: number
    conversionRateChange: number
    avgOrderValueChange: number
    returnRateChange: number
    addToCartRateChange: number
    checkoutRateChange: number
  }
}

// 活动页面数据类型
export interface ActivityPageData {
  id: number
  activityId: number // 活动ID
  pageUrl: string // 页面链接
  visitCount: number // 访问数
  userCount: number // 用户数
  newUserCount: number // 新客户数
  conversionRate: number // 转化率
  addToCartCount: number // 加购数
  addToCartRate: number // 加购率
  checkoutCount: number // 发起结账数
  checkoutRate: number // 发起结账率
  bounceRate: number // 跳出率
  avgStayTime: number // 停留时长（秒）
  pageViewsPerVisit: number // 每次访问页面浏览量
  date: string // 数据日期
  updatedAt: string // 更新时间

  // 环比数据
  momData?: {
    visitCountChange: number
    userCountChange: number
    newUserCountChange: number
    conversionRateChange: number
    addToCartRateChange: number
    checkoutRateChange: number
    bounceRateChange: number
    avgStayTimeChange: number
    pageViewsPerVisitChange: number
  }
}

// 活动详情类型（聚合数据）
export interface ActivityDetail extends Activity {
  // 数据概览
  overview: {
    totalSales: number
    totalCost: number
    roi: number
    conversionRate: number
    orderCount: number
    userCount: number
    avgOrderValue: number
    returnRate: number
    returnAmount: number

    // 广告数据
    adSpend: number
    adRevenue: number
    adROI: number
    adRevenueRatio: number

    // 环比对比
    salesChange?: number
    costChange?: number
    roiChange?: number
    conversionRateChange?: number
    orderCountChange?: number
  }

  // 单日数据
  dailyData: ActivityData[]

  // 产品数据
  productData: ActivityProductData[]

  // 页面数据
  pageData: ActivityPageData[]
}

// 活动筛选条件类型
export interface ActivityFilter {
  status?: string // 活动状态
  type?: string // 活动类型
  stage?: string // 活动阶段
  projectId?: number // 项目ID
  ownerId?: number // 负责人ID
  startDate?: string // 开始时间
  endDate?: string // 结束时间
  search?: string // 搜索关键词

  // 数据筛选
  roiMin?: number // 最小ROI
  roiMax?: number // 最大ROI
  salesMin?: number // 最小销售额
  salesMax?: number // 最大销售额
  budgetMin?: number // 最小预算
  budgetMax?: number // 最大预算
  conversionRateMin?: number // 最小转化率
  conversionRateMax?: number // 最大转化率
}

// 活动列表响应类型
export interface ActivityListResponse {
  activities: Activity[]
  total: number
  page: number
  pageSize: number
}

// 活动操作记录类型
export interface ActivityOperationRecord {
  id: number
  activityId: number
  operationType: 'create' | 'update' | 'delete' | 'status_change'
  operatorId: number
  operatorName: string
  operationTime: string
  changeContent: string // 变更内容
  changeReason?: string // 变更原因
  beforeData?: any // 变更前数据
  afterData?: any // 变更后数据
}

// 活动模板类型
export interface ActivityTemplate {
  id: number
  name: string // 模板名称
  type: 'promotion' | 'brand' | 'holiday' | 'custom' // 模板类型
  description: string // 模板描述
  config: Partial<Activity> // 模板配置
  createdBy: number
  createdAt: string
  isPublic: boolean // 是否公开模板
}

// 活动汇总统计类型
export interface ActivitySummary {
  totalActivities: number // 总活动数
  activeActivities: number // 进行中活动数
  completedActivities: number // 已完成活动数
  totalBudget: number // 总预算
  totalSpent: number // 总花费
  totalRevenue: number // 总收入
  averageROI: number // 平均ROI
  topPerformingActivity: string // 表现最佳活动
  totalConversions: number // 总转化数
}

// 活动数据导出配置类型
export interface ActivityExportConfig {
  activityIds: number[] // 要导出的活动ID
  dateRange: {
    startDate: string
    endDate: string
  }
  exportType: 'overview' | 'daily' | 'product' | 'page' | 'all' // 导出类型
  format: 'excel' | 'csv' | 'pdf' // 导出格式
  includeCharts: boolean // 是否包含图表
  customFields?: string[] // 自定义字段
}

// ============ 结束活动管理模块类型定义 ============

// 红人数据管理相关类型定义
export interface InfluencerData {
  id: string
  month: string // 统计月份，格式：YYYY-MM
  totalInfluencers: number // 总网红数
  contentMentions: number // 提及内容总数
  totalViews: number // 总观看量
  commentsCount: number // 评论数
  likesCount: number // 点赞数
  interactionRate: number // 互动率（百分比）
  customerId: string // 客户ID
  customerName: string // 客户名称
  projectId: string // 项目ID
  projectName: string // 项目名称
  createdBy: string // 录入人
  createdAt: string // 录入时间
  updatedAt: string // 更新时间
}

// 发帖数据管理类型
export interface KOLPostData {
  id: string
  postDate: string // 发帖日期
  influencerName: string // 红人姓名
  platform: 'instagram' | 'tiktok' | 'youtube' | 'xiaohongshu' | 'weibo' | 'other' // 发帖平台
  contentSummary: string // 发帖内容摘要
  postType: 'image' | 'video' | 'story' | 'live' | 'other' // 发帖类型
  projectId: string // 关联项目ID
  projectName: string // 项目名称
  likesCount: number // 点赞数
  commentsCount: number // 评论数
  sharesCount: number // 分享数
  viewsCount: number // 观看量
  clickCount: number // 点击数
  conversionCount: number // 转化数
  effectScore: number // 效果评分 (1-10)
  thumbnailUrl: string // 缩略图
  createdBy: string // 录入人
  createdAt: string // 录入时间
}

// 红人基础信息类型
export interface KOLBasicInfo {
  id: string
  name: string // 红人姓名
  type: 'mega' | 'macro' | 'micro' | 'nano' // 红人类型
  status: 'active' | 'pending' | 'inactive' // 合作状态
  avatar?: string // 头像
  followers: string // 粉丝数
  engagementRate: number // 互动率
  price: number // 单帖价格
  platforms: string[] // 合作平台
  categories: string[] // 内容分类
  contactInfo?: string // 联系方式
  description?: string // 红人简介
}

// 筛选条件类型
export interface InfluencerDataFilters {
  search: string // 搜索关键词
  monthRange: {
    start: string
    end: string
  } // 月份范围
  customers: string[] // 客户筛选
  projects: string[] // 项目筛选
  influencerCountRange: {
    min: number
    max: number
  } // 红人数量范围
  viewsRange: {
    min: number
    max: number
  } // 观看量范围
  interactionRateRange: {
    min: number
    max: number
  } // 互动率范围
  createdBy: string[] // 录入人筛选
  createdTimeRange: {
    start: string
    end: string
  } // 录入时间范围
}

// 发帖数据筛选条件
export interface PostDataFilters {
  search: string // 搜索关键词
  postStatus: string // 帖子状态
  platform: string // 平台筛选
  postType: string // 帖子类型
  dateRange: {
    start: string
    end: string
  } // 发帖日期范围
  influencers: string[] // 红人筛选
  projects: string[] // 项目筛选
  effectScoreRange: {
    min: number
    max: number
  } // 效果评分范围
}

// 红人数据统计概览
export interface InfluencerDataStats {
  totalInfluencers: number // 总红人数
  monthlyNewInfluencers: number // 本月新增红人数
  totalViews: number // 总观看量
  averageInteractionRate: number // 平均互动率
}

// 数据录入表单类型
export interface InfluencerDataForm {
  month: string
  totalInfluencers: number | null
  contentMentions: number | null
  totalViews: number | null
  commentsCount: number | null
  likesCount: number | null
  interactionRate: number | null
  customerId: string
  projectId: string
}

// 发帖数据（月度统计）类型
export interface MonthlyPostData {
  id: string
  month: string // 统计月份，格式：YYYY-MM
  totalPosts: number // 总发帖数
  commentsCount: number // 评论数
  likesCount: number // 点赞数
  interactionRate: number // 互动率（百分比）
  customerId: string // 客户ID
  customerName: string // 客户名称
  projectId: string // 项目ID
  projectName: string // 项目名称
  createdBy: string // 录入人
  createdAt: string // 录入时间
  updatedAt: string // 更新时间
}

// 发帖数据录入表单类型
export interface PostDataForm {
  month: string
  totalPosts: number | null
  commentsCount: number | null
  likesCount: number | null
  interactionRate: number | null
  customerId: string
  projectId: string
}
