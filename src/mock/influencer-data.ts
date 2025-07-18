import type { InfluencerData, KOLPostData, KOLBasicInfo, InfluencerDataStats } from '@/types'

// 模拟客户数据
export const mockCustomers = [
  { id: '1', name: '美妆品牌A' },
  { id: '2', name: '科技公司B' },
  { id: '3', name: '时尚品牌C' },
  { id: '4', name: '健康食品D' },
  { id: '5', name: '运动品牌E' }
]

// 模拟项目数据
export const mockProjects = [
  { id: '1', name: '春季新品推广', customerId: '1', customerName: '美妆品牌A' },
  { id: '2', name: '夏季防晒系列', customerId: '1', customerName: '美妆品牌A' },
  { id: '3', name: '新机发布营销', customerId: '2', customerName: '科技公司B' },
  { id: '4', name: '秋冬时装周', customerId: '3', customerName: '时尚品牌C' },
  { id: '5', name: '健康生活倡导', customerId: '4', customerName: '健康食品D' },
  { id: '6', name: '运动装备推广', customerId: '5', customerName: '运动品牌E' }
]

// 模拟红人数据列表（8个核心字段）
export const mockInfluencerData: InfluencerData[] = [
  {
    id: '1',
    month: '2024-03',
    totalInfluencers: 15,
    contentMentions: 45,
    totalViews: 1250000,
    commentsCount: 8500,
    likesCount: 45000,
    interactionRate: 3.6,
    customerId: '1',
    customerName: '美妆品牌A',
    projectId: '1',
    projectName: '春季新品推广',
    createdBy: '运营小李',
    createdAt: '2024-03-05 14:30:00',
    updatedAt: '2024-03-05 14:30:00'
  },
  {
    id: '2',
    month: '2024-02',
    totalInfluencers: 12,
    contentMentions: 38,
    totalViews: 980000,
    commentsCount: 6200,
    likesCount: 32000,
    interactionRate: 3.9,
    customerId: '1',
    customerName: '美妆品牌A',
    projectId: '2',
    projectName: '夏季防晒系列',
    createdBy: '运营小王',
    createdAt: '2024-02-28 16:45:00',
    updatedAt: '2024-02-28 16:45:00'
  },
  {
    id: '3',
    month: '2024-03',
    totalInfluencers: 8,
    contentMentions: 24,
    totalViews: 2100000,
    commentsCount: 12000,
    likesCount: 85000,
    interactionRate: 4.6,
    customerId: '2',
    customerName: '科技公司B',
    projectId: '3',
    projectName: '新机发布营销',
    createdBy: '运营小张',
    createdAt: '2024-03-10 10:20:00',
    updatedAt: '2024-03-10 10:20:00'
  },
  {
    id: '4',
    month: '2024-01',
    totalInfluencers: 20,
    contentMentions: 60,
    totalViews: 1800000,
    commentsCount: 15000,
    likesCount: 78000,
    interactionRate: 5.2,
    customerId: '3',
    customerName: '时尚品牌C',
    projectId: '4',
    projectName: '秋冬时装周',
    createdBy: '运营小刘',
    createdAt: '2024-01-25 09:15:00',
    updatedAt: '2024-01-25 09:15:00'
  },
  {
    id: '5',
    month: '2024-02',
    totalInfluencers: 10,
    contentMentions: 30,
    totalViews: 650000,
    commentsCount: 4200,
    likesCount: 28000,
    interactionRate: 4.9,
    customerId: '4',
    customerName: '健康食品D',
    projectId: '5',
    projectName: '健康生活倡导',
    createdBy: '运营小陈',
    createdAt: '2024-02-20 11:30:00',
    updatedAt: '2024-02-20 11:30:00'
  },
  {
    id: '6',
    month: '2024-03',
    totalInfluencers: 18,
    contentMentions: 54,
    totalViews: 1420000,
    commentsCount: 9800,
    likesCount: 56000,
    interactionRate: 4.6,
    customerId: '5',
    customerName: '运动品牌E',
    projectId: '6',
    projectName: '运动装备推广',
    createdBy: '运营小赵',
    createdAt: '2024-03-15 15:45:00',
    updatedAt: '2024-03-15 15:45:00'
  }
]

// 模拟红人基础信息
export const mockKOLs: KOLBasicInfo[] = [
  {
    id: '1',
    name: '美妆达人小雨',
    type: 'macro',
    status: 'active',
    avatar: '/avatars/kol1.jpg',
    followers: '85.6K',
    engagementRate: 4.2,
    price: 5000,
    platforms: ['Instagram', '小红书'],
    categories: ['美妆', '护肤', '时尚'],
    contactInfo: 'xiaoyumakeup@email.com',
    description: '专注美妆护肤内容创作，拥有丰富的产品测评经验'
  },
  {
    id: '2',
    name: '科技博主Alex',
    type: 'mega',
    status: 'active',
    avatar: '/avatars/kol2.jpg',
    followers: '2.3M',
    engagementRate: 3.8,
    price: 25000,
    platforms: ['YouTube', 'TikTok'],
    categories: ['科技', '数码', '评测'],
    contactInfo: 'alex.tech@email.com',
    description: '知名科技博主，专业数码产品评测'
  },
  {
    id: '3',
    name: '健身教练Lisa',
    type: 'micro',
    status: 'pending',
    avatar: '/avatars/kol3.jpg',
    followers: '45.2K',
    engagementRate: 5.1,
    price: 3000,
    platforms: ['Instagram', 'TikTok'],
    categories: ['健身', '运动', '生活'],
    contactInfo: 'lisa.fitness@email.com',
    description: '专业健身教练，分享健康生活方式'
  },
  {
    id: '4',
    name: '时尚博主Emma',
    type: 'macro',
    status: 'active',
    avatar: '/avatars/kol4.jpg',
    followers: '120.5K',
    engagementRate: 4.8,
    price: 8000,
    platforms: ['Instagram', '小红书', 'TikTok'],
    categories: ['时尚', '穿搭', '生活'],
    contactInfo: 'emma.fashion@email.com',
    description: '时尚穿搭达人，引领潮流趋势'
  },
  {
    id: '5',
    name: '美食达人小厨',
    type: 'micro',
    status: 'active',
    avatar: '/avatars/kol5.jpg',
    followers: '68.3K',
    engagementRate: 6.2,
    price: 4000,
    platforms: ['小红书', 'TikTok'],
    categories: ['美食', '烹饪', '生活'],
    contactInfo: 'chef.xiao@email.com',
    description: '专业美食博主，分享健康美味食谱'
  }
]

// 模拟发帖数据
export const mockPostData: KOLPostData[] = [
  {
    id: '1',
    postDate: '2024-03-15',
    influencerName: '美妆达人小雨',
    platform: 'instagram',
    contentSummary: '春季护肤新品测评 - 分享最新护肤心得',
    postType: 'image',
    projectId: '1',
    projectName: '春季新品推广',
    likesCount: 1200,
    commentsCount: 89,
    sharesCount: 156,
    viewsCount: 12500,
    clickCount: 450,
    conversionCount: 23,
    effectScore: 8,
    thumbnailUrl: '/posts/post1.jpg',
    createdBy: '运营小李',
    createdAt: '2024-03-16 09:30:00'
  },
  {
    id: '2',
    postDate: '2024-03-20',
    influencerName: '科技博主Alex',
    platform: 'youtube',
    contentSummary: '最新手机深度评测 - 全方位性能测试',
    postType: 'video',
    projectId: '3',
    projectName: '新机发布营销',
    likesCount: 3200,
    commentsCount: 245,
    sharesCount: 89,
    viewsCount: 85600,
    clickCount: 1200,
    conversionCount: 78,
    effectScore: 9,
    thumbnailUrl: '/posts/post2.jpg',
    createdBy: '运营小张',
    createdAt: '2024-03-21 14:15:00'
  },
  {
    id: '3',
    postDate: '2024-03-25',
    influencerName: '健身教练Lisa',
    platform: 'tiktok',
    contentSummary: '居家健身指南 - 15分钟高效训练',
    postType: 'video',
    projectId: '6',
    projectName: '运动装备推广',
    likesCount: 2800,
    commentsCount: 156,
    sharesCount: 234,
    viewsCount: 45600,
    clickCount: 890,
    conversionCount: 45,
    effectScore: 7,
    thumbnailUrl: '/posts/post3.jpg',
    createdBy: '运营小赵',
    createdAt: '2024-03-26 11:20:00'
  },
  {
    id: '4',
    postDate: '2024-02-28',
    influencerName: '时尚博主Emma',
    platform: 'xiaohongshu',
    contentSummary: '春季穿搭指南 - 时尚单品推荐',
    postType: 'image',
    projectId: '4',
    projectName: '秋冬时装周',
    likesCount: 1850,
    commentsCount: 123,
    sharesCount: 67,
    viewsCount: 23400,
    clickCount: 560,
    conversionCount: 34,
    effectScore: 8,
    thumbnailUrl: '/posts/post4.jpg',
    createdBy: '运营小刘',
    createdAt: '2024-03-01 16:45:00'
  },
  {
    id: '5',
    postDate: '2024-03-10',
    influencerName: '美食达人小厨',
    platform: 'xiaohongshu',
    contentSummary: '健康轻食制作 - 营养美味兼得',
    postType: 'video',
    projectId: '5',
    projectName: '健康生活倡导',
    likesCount: 980,
    commentsCount: 67,
    sharesCount: 45,
    viewsCount: 15600,
    clickCount: 320,
    conversionCount: 18,
    effectScore: 7,
    thumbnailUrl: '/posts/post5.jpg',
    createdBy: '运营小陈',
    createdAt: '2024-03-11 10:30:00'
  }
]

// 模拟统计数据
export const mockInfluencerStats: InfluencerDataStats = {
  totalInfluencers: 83,
  monthlyNewInfluencers: 15,
  totalViews: 8300000,
  averageInteractionRate: 4.5
}

// 平台选项
export const platformOptions = [
  { value: 'instagram', label: 'Instagram' },
  { value: 'tiktok', label: 'TikTok' },
  { value: 'youtube', label: 'YouTube' },
  { value: 'xiaohongshu', label: '小红书' },
  { value: 'weibo', label: '微博' }
]

// 帖子类型选项
export const postTypeOptions = [
  { value: 'image', label: '图文' },
  { value: 'video', label: '视频' },
  { value: 'story', label: '动态' },
  { value: 'live', label: '直播' },
  { value: 'other', label: '其他' }
]

// 红人类型选项
export const kolTypeOptions = [
  { value: 'mega', label: '头部红人' },
  { value: 'macro', label: '腰部红人' },
  { value: 'micro', label: '尾部红人' },
  { value: 'nano', label: '素人' }
]

// 合作状态选项
export const kolStatusOptions = [
  { value: 'active', label: '合作中' },
  { value: 'pending', label: '洽谈中' },
  { value: 'inactive', label: '已结束' }
]
