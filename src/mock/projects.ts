// 项目管理Mock数据
export interface Project {
  id: number
  project_name: string
  project_duration: {
    start_date: string
    end_date: string
  }
  project_type: '新客户' | '二次开发' | '失效复活'
  project_status: '活跃' | '流失' | '暂停服务'
  cooperation_period: string
  cooperation_platform: string[]
  contract_number: string
  new_order_count: number
  first_service_fee: number
  first_payment_date: string
  customer_name: string
  service_fee: number
  balance_info: number
  operation_team: string
  sales_person: string
  created_at: string
  updated_at: string
}

// 项目目标数据接口
export interface ProjectGoal {
  id: number
  project_id: number
  customer_name: string
  project_name: string
  goal_type: '月度' | '季度' | '年度'
  goal_period: string
  sales_target: number
  cost_target: number
  roi_target: number
  profit_target?: number
  user_count_target?: number
  created_at: string
  created_by: string
  remarks?: string
  // 完成情况数据
  actual_sales?: number
  actual_cost?: number
  actual_roi?: number
  actual_profit?: number
  actual_user_count?: number
  completion_rate?: {
    sales: number
    cost: number
    roi: number
    profit?: number
    user_count?: number
  }
}

// 投放账号数据接口
export interface AdAccount {
  id: number
  project_id: number
  platform: 'Google' | 'Meta' | 'Criteo' | 'Bing'
  account: string
  balance: number
  spent_amount: number
  estimated_available_time: string
  created_at: string
  updated_at: string
}

// 续费记录数据接口
export interface RenewalRecord {
  id: number
  project_id: number
  renewal_date: string
  renewal_amount: number
  renewal_period: string
  renewal_type: '正常续费' | '补充续费' | '特殊续费'
  payment_method: '银行转账' | '支付宝' | '微信' | '其他'
  payment_confirmed: '已确认' | '待确认'
  remarks?: string
  operator: string
  created_at: string
}

// Mock项目数据
export const mockProjects: Project[] = [
  {
    id: 1,
    project_name: '美妆品牌海外推广项目',
    project_duration: {
      start_date: '2024-01-15',
      end_date: '2024-12-31'
    },
    project_type: '新客户',
    project_status: '活跃',
    cooperation_period: '12个月',
    cooperation_platform: ['Google', 'Meta', 'Bing'],
    contract_number: 'CT2024001',
    new_order_count: 156,
    first_service_fee: 50000,
    first_payment_date: '2024-01-20',
    customer_name: '美丽时光化妆品有限公司',
    service_fee: 200000,
    balance_info: 125000,
    operation_team: '海外营销团队A',
    sales_person: '张三',
    created_at: '2024-01-15',
    updated_at: '2024-12-20'
  },
  {
    id: 2,
    project_name: '时尚服装品牌数字化营销',
    project_duration: {
      start_date: '2024-03-01',
      end_date: '2024-11-30'
    },
    project_type: '二次开发',
    project_status: '活跃',
    cooperation_period: '9个月',
    cooperation_platform: ['Google', 'Meta'],
    contract_number: 'CT2024002',
    new_order_count: 89,
    first_service_fee: 30000,
    first_payment_date: '2024-03-05',
    customer_name: '潮流前线服饰',
    service_fee: 120000,
    balance_info: 78000,
    operation_team: '海外营销团队B',
    sales_person: '李四',
    created_at: '2024-03-01',
    updated_at: '2024-12-20'
  },
  {
    id: 3,
    project_name: '健康食品品牌全球扩张',
    project_duration: {
      start_date: '2024-02-10',
      end_date: '2025-02-09'
    },
    project_type: '新客户',
    project_status: '活跃',
    cooperation_period: '12个月',
    cooperation_platform: ['Google', 'Meta', 'Criteo'],
    contract_number: 'CT2024003',
    new_order_count: 234,
    first_service_fee: 80000,
    first_payment_date: '2024-02-15',
    customer_name: '绿色健康食品公司',
    service_fee: 300000,
    balance_info: 180000,
    operation_team: '海外营销团队A',
    sales_person: '王五',
    created_at: '2024-02-10',
    updated_at: '2024-12-20'
  },
  {
    id: 4,
    project_name: '电子产品海外电商运营',
    project_duration: {
      start_date: '2024-04-01',
      end_date: '2024-09-30'
    },
    project_type: '失效复活',
    project_status: '暂停服务',
    cooperation_period: '6个月',
    cooperation_platform: ['Google', 'Bing'],
    contract_number: 'CT2024004',
    new_order_count: 45,
    first_service_fee: 25000,
    first_payment_date: '2024-04-05',
    customer_name: '智能科技有限公司',
    service_fee: 80000,
    balance_info: 15000,
    operation_team: '海外营销团队C',
    sales_person: '赵六',
    created_at: '2024-04-01',
    updated_at: '2024-12-20'
  },
  {
    id: 5,
    project_name: '家居用品品牌推广项目',
    project_duration: {
      start_date: '2024-05-15',
      end_date: '2025-05-14'
    },
    project_type: '新客户',
    project_status: '活跃',
    cooperation_period: '12个月',
    cooperation_platform: ['Meta', 'Criteo'],
    contract_number: 'CT2024005',
    new_order_count: 178,
    first_service_fee: 60000,
    first_payment_date: '2024-05-20',
    customer_name: '温馨家居用品',
    service_fee: 250000,
    balance_info: 145000,
    operation_team: '海外营销团队B',
    sales_person: '钱七',
    created_at: '2024-05-15',
    updated_at: '2024-12-20'
  },
  {
    id: 6,
    project_name: '运动品牌数字营销升级',
    project_duration: {
      start_date: '2024-06-01',
      end_date: '2024-12-31'
    },
    project_type: '二次开发',
    project_status: '流失',
    cooperation_period: '7个月',
    cooperation_platform: ['Google', 'Meta', 'Bing', 'Criteo'],
    contract_number: 'CT2024006',
    new_order_count: 67,
    first_service_fee: 35000,
    first_payment_date: '2024-06-05',
    customer_name: '运动先锋品牌',
    service_fee: 150000,
    balance_info: 0,
    operation_team: '海外营销团队A',
    sales_person: '孙八',
    created_at: '2024-06-01',
    updated_at: '2024-12-20'
  }
]

// Mock项目目标数据
export const mockProjectGoals: ProjectGoal[] = [
  // 2025年当前目标数据 - 更新为当前时间匹配
  {
    id: 100,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '月度',
    goal_period: '2025年7月',
    sales_target: 600000,
    cost_target: 180000,
    roi_target: 3.5,
    profit_target: 120000,
    user_count_target: 6000,
    actual_sales: 420000,
    actual_cost: 165000,
    actual_roi: 2.55,
    actual_profit: 85000,
    actual_user_count: 4200,
    completion_rate: {
      sales: 70,
      cost: 92,
      roi: 73,
      profit: 71,
      user_count: 70
    },
    created_at: '2025-07-01',
    created_by: '张三',
    remarks: '2025年7月目标，目前进展中'
  },
  {
    id: 101,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '季度',
    goal_period: '2025年Q3',
    sales_target: 1800000,
    cost_target: 540000,
    roi_target: 3.5,
    profit_target: 360000,
    user_count_target: 18000,
    actual_sales: 420000,
    actual_cost: 165000,
    actual_roi: 2.55,
    actual_profit: 85000,
    actual_user_count: 4200,
    completion_rate: {
      sales: 23,
      cost: 31,
      roi: 73,
      profit: 24,
      user_count: 23
    },
    created_at: '2025-07-01',
    created_by: '张三',
    remarks: '2025年Q3季度目标，刚开始执行'
  },
  {
    id: 102,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '年度',
    goal_period: '2025年',
    sales_target: 7200000,
    cost_target: 2160000,
    roi_target: 3.5,
    profit_target: 1440000,
    user_count_target: 72000,
    actual_sales: 4200000,
    actual_cost: 1250000,
    actual_roi: 3.36,
    actual_profit: 840000,
    actual_user_count: 42000,
    completion_rate: {
      sales: 58,
      cost: 58,
      roi: 96,
      profit: 58,
      user_count: 58
    },
    created_at: '2025-01-01',
    created_by: '张三',
    remarks: '2025年度目标，目前进展良好'
  },
  {
    id: 103,
    project_id: 2,
    customer_name: '潮流前线服饰',
    project_name: '时尚服装品牌数字化营销',
    goal_type: '月度',
    goal_period: '2025年7月',
    sales_target: 350000,
    cost_target: 120000,
    roi_target: 3.0,
    profit_target: 70000,
    user_count_target: 3500,
    actual_sales: 245000,
    actual_cost: 110000,
    actual_roi: 2.23,
    actual_profit: 48000,
    actual_user_count: 2450,
    completion_rate: {
      sales: 70,
      cost: 92,
      roi: 74,
      profit: 69,
      user_count: 70
    },
    created_at: '2025-07-01',
    created_by: '李四',
    remarks: '2025年7月目标，需要加强推广力度'
  },
  // 新增月度目标数据
  {
    id: 108,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '月度',
    goal_period: '2025年6月',
    sales_target: 580000,
    cost_target: 175000,
    roi_target: 3.3,
    profit_target: 115000,
    user_count_target: 5800,
    actual_sales: 595000,
    actual_cost: 170000,
    actual_roi: 3.5,
    actual_profit: 120000,
    actual_user_count: 5950,
    completion_rate: {
      sales: 103,
      cost: 97,
      roi: 106,
      profit: 104,
      user_count: 103
    },
    created_at: '2025-06-01',
    created_by: '张三',
    remarks: '2025年6月目标，已超额完成'
  },
  {
    id: 109,
    project_id: 2,
    customer_name: '潮流前线服饰',
    project_name: '时尚服装品牌数字化营销',
    goal_type: '月度',
    goal_period: '2025年6月',
    sales_target: 320000,
    cost_target: 110000,
    roi_target: 2.9,
    profit_target: 65000,
    user_count_target: 3200,
    actual_sales: 315000,
    actual_cost: 108000,
    actual_roi: 2.92,
    actual_profit: 63000,
    actual_user_count: 3150,
    completion_rate: {
      sales: 98,
      cost: 98,
      roi: 101,
      profit: 97,
      user_count: 98
    },
    created_at: '2025-06-01',
    created_by: '李四',
    remarks: '2025年6月目标，基本达成'
  },
  {
    id: 110,
    project_id: 3,
    customer_name: '绿色健康食品公司',
    project_name: '健康食品品牌全球扩张',
    goal_type: '月度',
    goal_period: '2025年6月',
    sales_target: 750000,
    cost_target: 225000,
    roi_target: 3.3,
    profit_target: 150000,
    user_count_target: 7500,
    actual_sales: 780000,
    actual_cost: 220000,
    actual_roi: 3.55,
    actual_profit: 156000,
    actual_user_count: 7800,
    completion_rate: {
      sales: 104,
      cost: 98,
      roi: 108,
      profit: 104,
      user_count: 104
    },
    created_at: '2025-06-01',
    created_by: '王五',
    remarks: '2025年6月目标，表现优秀'
  },
  {
    id: 111,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '月度',
    goal_period: '2025年8月',
    sales_target: 620000,
    cost_target: 185000,
    roi_target: 3.4,
    profit_target: 125000,
    user_count_target: 6200,
    actual_sales: 0,
    actual_cost: 0,
    actual_roi: 0,
    actual_profit: 0,
    actual_user_count: 0,
    completion_rate: {
      sales: 0,
      cost: 0,
      roi: 0,
      profit: 0,
      user_count: 0
    },
    created_at: '2025-08-01',
    created_by: '张三',
    remarks: '2025年8月目标，尚未开始'
  },
  {
    id: 104,
    project_id: 3,
    customer_name: '绿色健康食品公司',
    project_name: '健康食品品牌全球扩张',
    goal_type: '月度',
    goal_period: '2025年7月',
    sales_target: 800000,
    cost_target: 240000,
    roi_target: 3.5,
    profit_target: 160000,
    user_count_target: 8000,
    actual_sales: 680000,
    actual_cost: 220000,
    actual_roi: 3.09,
    actual_profit: 136000,
    actual_user_count: 6800,
    completion_rate: {
      sales: 85,
      cost: 92,
      roi: 88,
      profit: 85,
      user_count: 85
    },
    created_at: '2025-07-01',
    created_by: '王五',
    remarks: '2025年7月目标，表现良好'
  },
  {
    id: 105,
    project_id: 2,
    customer_name: '潮流前线服饰',
    project_name: '时尚服装品牌数字化营销',
    goal_type: '季度',
    goal_period: '2025年Q3',
    sales_target: 1050000,
    cost_target: 360000,
    roi_target: 3.0,
    profit_target: 210000,
    user_count_target: 10500,
    actual_sales: 245000,
    actual_cost: 110000,
    actual_roi: 2.23,
    actual_profit: 48000,
    actual_user_count: 2450,
    completion_rate: {
      sales: 23,
      cost: 31,
      roi: 74,
      profit: 23,
      user_count: 23
    },
    created_at: '2025-07-01',
    created_by: '李四',
    remarks: '2025年Q3季度目标'
  },
  // 新增季度目标数据
  {
    id: 112,
    project_id: 2,
    customer_name: '潮流前线服饰',
    project_name: '时尚服装品牌数字化营销',
    goal_type: '季度',
    goal_period: '2025年Q2',
    sales_target: 950000,
    cost_target: 320000,
    roi_target: 2.97,
    profit_target: 190000,
    user_count_target: 9500,
    actual_sales: 980000,
    actual_cost: 315000,
    actual_roi: 3.11,
    actual_profit: 196000,
    actual_user_count: 9800,
    completion_rate: {
      sales: 103,
      cost: 98,
      roi: 105,
      profit: 103,
      user_count: 103
    },
    created_at: '2025-04-01',
    created_by: '李四',
    remarks: '2025年Q2季度目标，已超额完成'
  },
  {
    id: 113,
    project_id: 3,
    customer_name: '绿色健康食品公司',
    project_name: '健康食品品牌全球扩张',
    goal_type: '季度',
    goal_period: '2025年Q3',
    sales_target: 2400000,
    cost_target: 720000,
    roi_target: 3.3,
    profit_target: 480000,
    user_count_target: 24000,
    actual_sales: 680000,
    actual_cost: 220000,
    actual_roi: 3.09,
    actual_profit: 136000,
    actual_user_count: 6800,
    completion_rate: {
      sales: 28,
      cost: 31,
      roi: 94,
      profit: 28,
      user_count: 28
    },
    created_at: '2025-07-01',
    created_by: '王五',
    remarks: '2025年Q3季度目标，刚开始执行'
  },
  {
    id: 106,
    project_id: 3,
    customer_name: '绿色健康食品公司',
    project_name: '健康食品品牌全球扩张',
    goal_type: '年度',
    goal_period: '2025年',
    sales_target: 10000000,
    cost_target: 3000000,
    roi_target: 3.5,
    profit_target: 2000000,
    user_count_target: 100000,
    actual_sales: 5800000,
    actual_cost: 1750000,
    actual_roi: 3.31,
    actual_profit: 1160000,
    actual_user_count: 58000,
    completion_rate: {
      sales: 58,
      cost: 58,
      roi: 95,
      profit: 58,
      user_count: 58
    },
    created_at: '2025-01-01',
    created_by: '王五',
    remarks: '2025年度目标，进展顺利'
  },

  // 历史目标数据 - 2025年1月
  {
    id: 107,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '月度',
    goal_period: '2025年1月',
    sales_target: 600000,
    cost_target: 180000,
    roi_target: 3.5,
    profit_target: 120000,
    user_count_target: 6000,
    actual_sales: 620000,
    actual_cost: 175000,
    actual_roi: 3.54,
    actual_profit: 125000,
    actual_user_count: 6200,
    completion_rate: {
      sales: 103,
      cost: 97,
      roi: 101,
      profit: 104,
      user_count: 103
    },
    created_at: '2025-01-01',
    created_by: '张三',
    remarks: '2025年1月目标，已完成'
  },

  // 原有的2024年目标数据
  {
    id: 1,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '月度',
    goal_period: '2024年12月',
    sales_target: 500000,
    cost_target: 150000,
    roi_target: 3.33,
    profit_target: 100000,
    user_count_target: 5000,
    actual_sales: 520000,
    actual_cost: 145000,
    actual_roi: 3.58,
    actual_profit: 105000,
    actual_user_count: 5200,
    completion_rate: {
      sales: 104,
      cost: 97,
      roi: 107.5,
      profit: 105,
      user_count: 104
    },
    created_at: '2024-12-01',
    created_by: '张三',
    remarks: '12月目标设定，重点关注ROI提升'
  },
  {
    id: 2,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '季度',
    goal_period: '2024年Q4',
    sales_target: 1500000,
    cost_target: 450000,
    roi_target: 3.33,
    profit_target: 300000,
    user_count_target: 15000,
    actual_sales: 1420000,
    actual_cost: 430000,
    actual_roi: 3.30,
    actual_profit: 285000,
    actual_user_count: 14500,
    completion_rate: {
      sales: 94.7,
      cost: 95.6,
      roi: 99.1,
      profit: 95.0,
      user_count: 96.7
    },
    created_at: '2024-10-01',
    created_by: '张三',
    remarks: 'Q4季度目标，接近完成'
  },
  {
    id: 3,
    project_id: 2,
    customer_name: '潮流前线服饰',
    project_name: '时尚服装品牌数字化营销',
    goal_type: '月度',
    goal_period: '2024年12月',
    sales_target: 300000,
    cost_target: 100000,
    roi_target: 3.0,
    profit_target: 60000,
    user_count_target: 3000,
    actual_sales: 285000,
    actual_cost: 105000,
    actual_roi: 2.71,
    actual_profit: 55000,
    actual_user_count: 2800,
    completion_rate: {
      sales: 95,
      cost: 105,
      roi: 90.3,
      profit: 91.7,
      user_count: 93.3
    },
    created_at: '2024-12-01',
    created_by: '李四',
    remarks: '需要优化成本控制'
  },
  // 历史目标数据
  {
    id: 5,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '月度',
    goal_period: '2024年10月',
    sales_target: 450000,
    cost_target: 150000,
    roi_target: 3.0,
    profit_target: 90000,
    user_count_target: 4500,
    actual_sales: 435000,
    actual_cost: 158000,
    actual_roi: 2.75,
    actual_profit: 85000,
    actual_user_count: 4300,
    completion_rate: {
      sales: 96.7,
      cost: 105.3,
      roi: 91.7,
      profit: 94.4,
      user_count: 95.6
    },
    created_at: '2024-10-01',
    created_by: '张三',
    remarks: '10月成本控制需要改进'
  },
  {
    id: 6,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '季度',
    goal_period: '2024年Q3',
    sales_target: 1300000,
    cost_target: 420000,
    roi_target: 3.1,
    profit_target: 260000,
    user_count_target: 13000,
    actual_sales: 1350000,
    actual_cost: 410000,
    actual_roi: 3.29,
    actual_profit: 275000,
    actual_user_count: 13500,
    completion_rate: {
      sales: 103.8,
      cost: 97.6,
      roi: 106.1,
      profit: 105.8,
      user_count: 103.8
    },
    created_at: '2024-07-01',
    created_by: '张三',
    remarks: 'Q3季度表现出色，各项指标均超预期'
  },
  {
    id: 7,
    project_id: 2,
    customer_name: '潮流前线服饰',
    project_name: '时尚服装品牌数字化营销',
    goal_type: '月度',
    goal_period: '2024年11月',
    sales_target: 280000,
    cost_target: 95000,
    roi_target: 2.95,
    profit_target: 55000,
    user_count_target: 2800,
    actual_sales: 290000,
    actual_cost: 92000,
    actual_roi: 3.15,
    actual_profit: 58000,
    actual_user_count: 2950,
    completion_rate: {
      sales: 103.6,
      cost: 96.8,
      roi: 106.8,
      profit: 105.5,
      user_count: 105.4
    },
    created_at: '2024-11-01',
    created_by: '李四',
    remarks: '11月表现良好，继续保持'
  },
  // 年度目标数据
  {
    id: 8,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '年度',
    goal_period: '2024年',
    sales_target: 6000000,
    cost_target: 1800000,
    roi_target: 3.33,
    profit_target: 1200000,
    user_count_target: 60000,
    actual_sales: 6100000,
    actual_cost: 1750000,
    actual_roi: 3.49,
    actual_profit: 1280000,
    actual_user_count: 62500,
    completion_rate: {
      sales: 101.7,
      cost: 97.2,
      roi: 104.8,
      profit: 106.7,
      user_count: 104.2
    },
    created_at: '2024-01-01',
    created_by: '张三',
    remarks: '2024年度目标，整体表现优秀，超额完成各项指标'
  },
  {
    id: 9,
    project_id: 1,
    customer_name: '美丽时光化妆品有限公司',
    project_name: '美妆品牌海外推广项目',
    goal_type: '年度',
    goal_period: '2024年',
    sales_target: 7200000,
    cost_target: 2100000,
    roi_target: 3.43,
    profit_target: 1440000,
    user_count_target: 72000,
    actual_sales: 610427,
    actual_cost: 179832,
    actual_roi: 3.39,
    actual_profit: 115169,
    actual_user_count: 6144,
    completion_rate: {
      sales: 8.5,
      cost: 8.6,
      roi: 98.8,
      profit: 8.0,
      user_count: 8.5
    },
    created_at: '2024-12-01',
    created_by: '张三',
    remarks: '2025年度目标，刚开始执行，预期全年实现20%增长'
  },
  {
    id: 10,
    project_id: 2,
    customer_name: '潮流前线服饰',
    project_name: '时尚服装品牌数字化营销',
    goal_type: '年度',
    goal_period: '2024年',
    sales_target: 3600000,
    cost_target: 1200000,
    roi_target: 3.0,
    profit_target: 720000,
    user_count_target: 36000,
    actual_sales: 3420000,
    actual_cost: 1180000,
    actual_roi: 2.90,
    actual_profit: 685000,
    actual_user_count: 34200,
    completion_rate: {
      sales: 95.0,
      cost: 98.3,
      roi: 96.7,
      profit: 95.1,
      user_count: 95.0
    },
    created_at: '2024-01-01',
    created_by: '李四',
    remarks: '2024年度目标基本完成，成本控制良好'
  },
  {
    id: 11,
    project_id: 3,
    customer_name: '绿色健康食品公司',
    project_name: '健康食品品牌全球扩张',
    goal_type: '年度',
    goal_period: '2024年',
    sales_target: 9000000,
    cost_target: 2700000,
    roi_target: 3.33,
    profit_target: 1800000,
    user_count_target: 90000,
    actual_sales: 9450000,
    actual_cost: 2650000,
    actual_roi: 3.57,
    actual_profit: 1890000,
    actual_user_count: 94500,
    completion_rate: {
      sales: 105.0,
      cost: 98.1,
      roi: 107.2,
      profit: 105.0,
      user_count: 105.0
    },
    created_at: '2024-02-10',
    created_by: '王五',
    remarks: '2024年度目标超额完成，品牌全球扩张效果显著'
  }
]

// Mock投放账号数据
export const mockAdAccounts: AdAccount[] = [
  {
    id: 1,
    project_id: 1,
    platform: 'Google',
    account: 'google-ads-account-001',
    balance: 25000,
    spent_amount: 75000,
    estimated_available_time: '15天',
    created_at: '2024-01-20',
    updated_at: '2024-12-20'
  },
  {
    id: 2,
    project_id: 1,
    platform: 'Meta',
    account: 'meta-ads-account-001',
    balance: 18000,
    spent_amount: 82000,
    estimated_available_time: '12天',
    created_at: '2024-01-20',
    updated_at: '2024-12-20'
  },
  {
    id: 3,
    project_id: 2,
    platform: 'Google',
    account: 'google-ads-account-002',
    balance: 12000,
    spent_amount: 38000,
    estimated_available_time: '18天',
    created_at: '2024-03-05',
    updated_at: '2024-12-20'
  }
]

// Mock续费记录数据
export const mockRenewalRecords: RenewalRecord[] = [
  {
    id: 1,
    project_id: 1,
    renewal_date: '2024-07-15',
    renewal_amount: 100000,
    renewal_period: '6个月',
    renewal_type: '正常续费',
    payment_method: '银行转账',
    payment_confirmed: '已确认',
    remarks: '半年度续费，服务表现良好',
    operator: '张三',
    created_at: '2024-07-15'
  },
  {
    id: 2,
    project_id: 2,
    renewal_date: '2024-09-01',
    renewal_amount: 50000,
    renewal_period: '3个月',
    renewal_type: '补充续费',
    payment_method: '支付宝',
    payment_confirmed: '已确认',
    remarks: '补充预算，加大投放力度',
    operator: '李四',
    created_at: '2024-09-01'
  },
  {
    id: 3,
    project_id: 3,
    renewal_date: '2024-11-10',
    renewal_amount: 80000,
    renewal_period: '4个月',
    renewal_type: '正常续费',
    payment_method: '银行转账',
    payment_confirmed: '待确认',
    remarks: '年底续费，等待财务确认',
    operator: '王五',
    created_at: '2024-11-10'
  }
]

// 导出选项数据
export const projectTypeOptions = [
  { label: '新客户', value: '新客户' },
  { label: '二次开发', value: '二次开发' },
  { label: '失效复活', value: '失效复活' }
]

export const projectStatusOptions = [
  { label: '活跃', value: '活跃' },
  { label: '流失', value: '流失' },
  { label: '暂停服务', value: '暂停服务' }
]

export const cooperationPlatformOptions = [
  { label: 'Google', value: 'Google' },
  { label: 'Meta', value: 'Meta' },
  { label: 'Bing', value: 'Bing' },
  { label: 'Criteo', value: 'Criteo' }
]

export const operationTeamOptions = [
  { label: '海外营销团队A', value: '海外营销团队A' },
  { label: '海外营销团队B', value: '海外营销团队B' },
  { label: '海外营销团队C', value: '海外营销团队C' }
]

export const salesPersonOptions = [
  { label: '张三', value: '张三' },
  { label: '李四', value: '李四' },
  { label: '王五', value: '王五' },
  { label: '赵六', value: '赵六' },
  { label: '钱七', value: '钱七' },
  { label: '孙八', value: '孙八' }
]
