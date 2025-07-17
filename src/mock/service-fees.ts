import type { ApiResponse } from '@/types'

// 服务费收款记录接口
export interface ServiceFeeRecord {
  id: number
  customerId: number
  customerName: string
  projectId: number
  projectName: string
  paymentDate: string
  paymentAmount: number
  servicePeriod: string
  paymentType: '首次付款' | '续费'
  remark?: string
  creator: string
  createTime: string
}

// 客户接口（简化版）
export interface ServiceFeeCustomer {
  id: number
  name: string
}

// 项目接口（简化版）
export interface ServiceFeeProject {
  id: number
  name: string
  customerId: number
}

// Mock 客户数据
export const mockServiceFeeCustomers: ServiceFeeCustomer[] = [
  { id: 1, name: '时尚潮流服饰有限公司' },
  { id: 2, name: '科技数码创新公司' },
  { id: 3, name: '美容护肤品牌' },
  { id: 4, name: '运动健身器材' },
  { id: 5, name: '家居装饰精品' },
  { id: 6, name: '智能家电科技' },
  { id: 7, name: '户外运动装备' },
  { id: 8, name: '高端珠宝首饰' },
  { id: 9, name: '儿童玩具乐园' },
  { id: 10, name: '有机食品专营' }
]

// Mock 项目数据
export const mockServiceFeeProjects: ServiceFeeProject[] = [
  { id: 1, name: '春季新品推广', customerId: 1 },
  { id: 2, name: '夏季促销活动', customerId: 1 },
  { id: 3, name: '智能手机推广', customerId: 2 },
  { id: 4, name: '智能手表营销', customerId: 2 },
  { id: 5, name: '护肤品套装推广', customerId: 3 },
  { id: 6, name: '彩妆新品上市', customerId: 3 },
  { id: 7, name: '运动鞋推广', customerId: 4 },
  { id: 8, name: '健身器材营销', customerId: 4 },
  { id: 9, name: '家具套装推广', customerId: 5 },
  { id: 10, name: '装饰用品营销', customerId: 5 },
  { id: 11, name: '智能电视推广', customerId: 6 },
  { id: 12, name: '智能音箱营销', customerId: 6 },
  { id: 13, name: '户外服装推广', customerId: 7 },
  { id: 14, name: '登山装备营销', customerId: 7 },
  { id: 15, name: '钻石戒指推广', customerId: 8 },
  { id: 16, name: '珠宝套装营销', customerId: 8 },
  { id: 17, name: '儿童玩具推广', customerId: 9 },
  { id: 18, name: '安全座椅营销', customerId: 9 },
  { id: 19, name: '有机蔬菜推广', customerId: 10 },
  { id: 20, name: '健康食品营销', customerId: 10 }
]

// Mock 服务费收款记录数据
export const mockServiceFeeRecords: ServiceFeeRecord[] = [
  {
    id: 1,
    customerId: 1,
    customerName: '时尚潮流服饰有限公司',
    projectId: 1,
    projectName: '春季新品推广',
    paymentDate: '2024-01-15',
    paymentAmount: 30000,
    servicePeriod: '1年',
    paymentType: '首次付款',
    remark: '年度服务费，包含全年推广服务',
    creator: '张财务',
    createTime: '2024-01-15 10:30:00'
  },
  {
    id: 2,
    customerId: 1,
    customerName: '时尚潮流服饰有限公司',
    projectId: 2,
    projectName: '夏季促销活动',
    paymentDate: '2024-06-10',
    paymentAmount: 18000,
    servicePeriod: '6个月',
    paymentType: '续费',
    remark: '夏季促销活动专项服务费',
    creator: '李财务',
    createTime: '2024-06-10 14:20:00'
  },
  {
    id: 3,
    customerId: 2,
    customerName: '科技数码创新公司',
    projectId: 3,
    projectName: '智能手机推广',
    paymentDate: '2024-02-01',
    paymentAmount: 25000,
    servicePeriod: '6个月',
    paymentType: '首次付款',
    remark: '智能手机产品线推广服务',
    creator: '王财务',
    createTime: '2024-02-01 09:15:00'
  },
  {
    id: 4,
    customerId: 2,
    customerName: '科技数码创新公司',
    projectId: 4,
    projectName: '智能手表营销',
    paymentDate: '2024-08-15',
    paymentAmount: 20000,
    servicePeriod: '6个月',
    paymentType: '续费',
    remark: '智能手表营销续费',
    creator: '赵财务',
    createTime: '2024-08-15 16:45:00'
  },
  {
    id: 5,
    customerId: 3,
    customerName: '美容护肤品牌',
    projectId: 5,
    projectName: '护肤品套装推广',
    paymentDate: '2024-03-01',
    paymentAmount: 35000,
    servicePeriod: '1年',
    paymentType: '首次付款',
    remark: '护肤品牌年度推广服务',
    creator: '孙财务',
    createTime: '2024-03-01 11:30:00'
  },
  {
    id: 6,
    customerId: 3,
    customerName: '美容护肤品牌',
    projectId: 6,
    projectName: '彩妆新品上市',
    paymentDate: '2024-09-20',
    paymentAmount: 15000,
    servicePeriod: '3个月',
    paymentType: '首次付款',
    remark: '彩妆新品上市推广',
    creator: '周财务',
    createTime: '2024-09-20 13:45:00'
  },
  {
    id: 7,
    customerId: 4,
    customerName: '运动健身器材',
    projectId: 7,
    projectName: '运动鞋推广',
    paymentDate: '2024-04-10',
    paymentAmount: 22000,
    servicePeriod: '6个月',
    paymentType: '首次付款',
    remark: '运动鞋产品线推广',
    creator: '吴财务',
    createTime: '2024-04-10 08:20:00'
  },
  {
    id: 8,
    customerId: 5,
    customerName: '家居装饰精品',
    projectId: 9,
    projectName: '家具套装推广',
    paymentDate: '2024-05-15',
    paymentAmount: 28000,
    servicePeriod: '6个月',
    paymentType: '首次付款',
    remark: '家具套装推广服务',
    creator: '郑财务',
    createTime: '2024-05-15 15:10:00'
  },
  {
    id: 9,
    customerId: 6,
    customerName: '智能家电科技',
    projectId: 11,
    projectName: '智能电视推广',
    paymentDate: '2024-06-20',
    paymentAmount: 40000,
    servicePeriod: '1年',
    paymentType: '首次付款',
    remark: '智能电视年度推广服务',
    creator: '陈财务',
    createTime: '2024-06-20 12:00:00'
  },
  {
    id: 10,
    customerId: 6,
    customerName: '智能家电科技',
    projectId: 12,
    projectName: '智能音箱营销',
    paymentDate: '2024-10-05',
    paymentAmount: 16000,
    servicePeriod: '3个月',
    paymentType: '续费',
    remark: '智能音箱营销续费',
    creator: '刘财务',
    createTime: '2024-10-05 09:30:00'
  },
  {
    id: 11,
    customerId: 7,
    customerName: '户外运动装备',
    projectId: 13,
    projectName: '户外服装推广',
    paymentDate: '2024-07-03',
    paymentAmount: 19000,
    servicePeriod: '6个月',
    paymentType: '首次付款',
    remark: '户外服装推广服务',
    creator: '黄财务',
    createTime: '2024-07-03 14:15:00'
  },
  {
    id: 12,
    customerId: 8,
    customerName: '高端珠宝首饰',
    projectId: 15,
    projectName: '钻石戒指推广',
    paymentDate: '2024-08-15',
    paymentAmount: 45000,
    servicePeriod: '1年',
    paymentType: '首次付款',
    remark: '高端珠宝年度推广服务',
    creator: '马财务',
    createTime: '2024-08-15 16:30:00'
  },
  {
    id: 13,
    customerId: 9,
    customerName: '儿童玩具乐园',
    projectId: 17,
    projectName: '儿童玩具推广',
    paymentDate: '2024-09-10',
    paymentAmount: 12000,
    servicePeriod: '3个月',
    paymentType: '首次付款',
    remark: '儿童玩具推广服务',
    creator: '田财务',
    createTime: '2024-09-10 10:45:00'
  },
  {
    id: 14,
    customerId: 10,
    customerName: '有机食品专营',
    projectId: 19,
    projectName: '有机蔬菜推广',
    paymentDate: '2024-10-25',
    paymentAmount: 24000,
    servicePeriod: '6个月',
    paymentType: '首次付款',
    remark: '有机蔬菜推广服务',
    creator: '何财务',
    createTime: '2024-10-25 11:20:00'
  },
  {
    id: 15,
    customerId: 1,
    customerName: '时尚潮流服饰有限公司',
    projectId: 1,
    projectName: '春季新品推广',
    paymentDate: '2024-12-15',
    paymentAmount: 32000,
    servicePeriod: '1年',
    paymentType: '续费',
    remark: '2025年度服务费续费',
    creator: '张财务',
    createTime: '2024-12-15 13:30:00'
  }
]

// Mock API 函数
export const mockGetServiceFeeRecords = (): Promise<ApiResponse<ServiceFeeRecord[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockServiceFeeRecords,
        message: '获取服务费记录成功'
      })
    }, 500)
  })
}

export const mockGetServiceFeeCustomers = (): Promise<ApiResponse<ServiceFeeCustomer[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockServiceFeeCustomers,
        message: '获取客户列表成功'
      })
    }, 300)
  })
}

export const mockGetServiceFeeProjects = (): Promise<ApiResponse<ServiceFeeProject[]>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        data: mockServiceFeeProjects,
        message: '获取项目列表成功'
      })
    }, 300)
  })
}

export const mockCreateServiceFeeRecord = (record: Omit<ServiceFeeRecord, 'id' | 'createTime' | 'creator'>): Promise<ApiResponse<ServiceFeeRecord>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const newRecord: ServiceFeeRecord = {
        ...record,
        id: Date.now(),
        creator: '当前用户',
        createTime: new Date().toISOString().replace('T', ' ').substring(0, 19)
      }

      mockServiceFeeRecords.unshift(newRecord)

      resolve({
        success: true,
        data: newRecord,
        message: '创建服务费记录成功'
      })
    }, 800)
  })
}

export const mockUpdateServiceFeeRecord = (id: number, record: Partial<ServiceFeeRecord>): Promise<ApiResponse<ServiceFeeRecord>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockServiceFeeRecords.findIndex(r => r.id === id)
      if (index === -1) {
        reject({
          success: false,
          message: '服务费记录不存在'
        })
        return
      }

      mockServiceFeeRecords[index] = {
        ...mockServiceFeeRecords[index],
        ...record
      }

      resolve({
        success: true,
        data: mockServiceFeeRecords[index],
        message: '更新服务费记录成功'
      })
    }, 600)
  })
}

export const mockDeleteServiceFeeRecord = (id: number): Promise<ApiResponse<void>> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const index = mockServiceFeeRecords.findIndex(r => r.id === id)
      if (index === -1) {
        reject({
          success: false,
          message: '服务费记录不存在'
        })
        return
      }

      mockServiceFeeRecords.splice(index, 1)

      resolve({
        success: true,
        message: '删除服务费记录成功'
      })
    }, 400)
  })
}
