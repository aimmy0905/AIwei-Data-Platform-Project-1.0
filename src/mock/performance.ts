import type {
  MetricConfig,
  IntelligentAssessmentConfig,
  WeightConfig,
  PerformanceTarget,
  PerformanceRating,
  NewPerformanceRecord,
  UserRole,
  DepartmentType,
  PositionLevel,
  PeriodType
} from '@/types/departments'

// 当前用户角色（模拟登录用户）
export const currentUserRole: UserRole = 'general_manager'
export const currentUserId = 1

// 数据指标配置
export const metricConfigs: MetricConfig[] = [
  // 运营部门 - 普通员工 - 月度
  {
    id: 'ops_staff_service_fee',
    name: '服务费目标完成率',
    department: 'operations',
    position_level: 'staff',
    period_type: 'monthly',
    weight: 50,
    target_field: 'service_fee',
    unit: '元',
    description: '月度服务费收入目标完成情况'
  },
  {
    id: 'ops_staff_rebate',
    name: '返点目标完成率',
    department: 'operations',
    position_level: 'staff',
    period_type: 'monthly',
    weight: 50,
    target_field: 'rebate',
    unit: '元',
    description: '月度返点目标完成情况'
  },

  // 运营部门 - 项目经理 - 季度
  {
    id: 'ops_manager_service_fee',
    name: '服务费目标完成率',
    department: 'operations',
    position_level: 'manager',
    period_type: 'quarterly',
    weight: 50,
    target_field: 'service_fee',
    unit: '元',
    description: '季度服务费收入目标完成情况'
  },
  {
    id: 'ops_manager_rebate',
    name: '返点目标完成率',
    department: 'operations',
    position_level: 'manager',
    period_type: 'quarterly',
    weight: 50,
    target_field: 'rebate',
    unit: '元',
    description: '季度返点目标完成情况'
  },

  // 销售部门 - 销售人员 - 月度
  {
    id: 'sales_staff_new_service_fee',
    name: '新单服务费用目标完成率',
    department: 'sales',
    position_level: 'staff',
    period_type: 'monthly',
    weight: 40,
    target_field: 'new_service_fee',
    unit: '元',
    description: '月度新单服务费收入目标'
  },
  {
    id: 'sales_staff_new_orders',
    name: '新单单量目标完成率',
    department: 'sales',
    position_level: 'staff',
    period_type: 'monthly',
    weight: 30,
    target_field: 'new_orders',
    unit: '单',
    description: '月度新单数量目标'
  },
  {
    id: 'sales_staff_renewal_fee',
    name: '续费金额目标完成率',
    department: 'sales',
    position_level: 'staff',
    period_type: 'monthly',
    weight: 30,
    target_field: 'renewal_fee',
    unit: '元',
    description: '月度续费金额目标'
  },

  // 销售部门 - 销售经理 - 月度
  {
    id: 'sales_manager_new_service_fee',
    name: '新单服务费目标完成率',
    department: 'sales',
    position_level: 'manager',
    period_type: 'monthly',
    weight: 25,
    target_field: 'new_service_fee',
    unit: '元',
    description: '个人新单服务费收入目标'
  },
  {
    id: 'sales_manager_new_orders',
    name: '新单单量目标完成率',
    department: 'sales',
    position_level: 'manager',
    period_type: 'monthly',
    weight: 25,
    target_field: 'new_orders',
    unit: '单',
    description: '个人新单数量目标'
  },
  {
    id: 'sales_manager_team_service_fee',
    name: '团队新单服务费目标完成率',
    department: 'sales',
    position_level: 'manager',
    period_type: 'monthly',
    weight: 25,
    target_field: 'team_service_fee',
    unit: '元',
    description: '团队新单服务费收入目标'
  },
  {
    id: 'sales_manager_team_renewal_fee',
    name: '团队续费服务费目标完成率',
    department: 'sales',
    position_level: 'manager',
    period_type: 'monthly',
    weight: 25,
    target_field: 'team_renewal_fee',
    unit: '元',
    description: '团队续费服务费收入目标'
  }
]

// 智能方案考核配置 - 根据新需求调整
export const intelligentAssessmentConfigs: IntelligentAssessmentConfig[] = [
  // 运营部门 - 项目经理（由项目总监评价）- 绩效底薪变动 20%
  {
    id: 'ops_manager_assessment',
    department: 'operations',
    position_level: 'manager',
    evaluator_role: 'project_director',
    weight: 100,
    items: [
      {
        id: 'team_member_management',
        name: '团队成员管理',
        description: '团队成员的管理、指导和激励能力',
        max_score: 20
      },
      {
        id: 'team_customer_reviews',
        name: '团内客户评论',
        description: '团队客户关系维护和客户满意度管理',
        max_score: 20
      },
      {
        id: 'knowledge_output',
        name: '知识沉淀及输出',
        description: '工作经验总结和知识分享的质量',
        max_score: 20
      },
      {
        id: 'talent_development',
        name: '培养及输出新人',
        description: '新员工培训和人才培养的效果',
        max_score: 20
      },
      {
        id: 'cross_department_cooperation',
        name: '跨部门协助合作',
        description: '与其他部门协作和支持的表现',
        max_score: 20
      }
    ]
  },

  // 运营部门 - 项目成员/优化师（由项目经理评价）- 职能方案 80%
  {
    id: 'ops_staff_assessment',
    department: 'operations',
    position_level: 'staff',
    evaluator_role: 'project_manager',
    weight: 100,
    items: [
      {
        id: 'customer_service_ability',
        name: '客户服务能力',
        description: '客户沟通和服务质量表现',
        max_score: 20
      },
      {
        id: 'professional_work_quality',
        name: '专业工作质量',
        description: '工作完成的专业性和质量水平',
        max_score: 20
      },
      {
        id: 'communication_assistance',
        name: '沟通与协助',
        description: '团队内外沟通协作的效果',
        max_score: 20
      },
      {
        id: 'work_initiative_execution',
        name: '工作积极性及执行力',
        description: '工作主动性和任务执行效率',
        max_score: 20
      },
      {
        id: 'growth_contribution',
        name: '成长与贡献',
        description: '个人成长和对团队的贡献',
        max_score: 20
      }
    ]
  },

  // 销售部门 - 销售经理（由销售总监评价）
  {
    id: 'sales_manager_assessment',
    department: 'sales',
    position_level: 'manager',
    evaluator_role: 'sales_director',
    weight: 100,
    items: [
      {
        id: 'team_growth_balance',
        name: '成员成长与均衡性',
        description: '团队成员能力提升和发展均衡性',
        max_score: 25
      },
      {
        id: 'process_compliance',
        name: '销售流程与CRM规范执行',
        description: '销售流程标准化和CRM系统使用规范性',
        max_score: 25
      },
      {
        id: 'strategy_coaching',
        name: '策略制定与过程辅导',
        description: '销售策略制定和团队辅导能力',
        max_score: 25
      },
      {
        id: 'visit_target_completion',
        name: '团队客户拜访量目标完成',
        description: '团队整体客户拜访量目标达成情况',
        max_score: 25
      }
    ]
  },

  // 销售部门 - 销售人员（由销售经理评价）
  {
    id: 'sales_staff_assessment',
    department: 'sales',
    position_level: 'staff',
    evaluator_role: 'sales_manager',
    weight: 100,
    items: [
      {
        id: 'monthly_visits',
        name: '月度有效客户拜访量',
        description: '每月有效客户拜访的数量和质量',
        max_score: 100
      }
    ]
  }
]

// 权重配置 - 根据新需求调整
export const weightConfigs: WeightConfig[] = [
  // 运营部门 - 项目成员/优化师（月度考核）
  {
    department: 'operations',
    position_level: 'staff',
    data_weight: 20,        // 月度完成率（业绩完成率）20%
    customer_weight: 0,     // 不单独设置客户评价权重
    intelligent_weight: 80  // 职能方案 80%
  },

  // 运营部门 - 项目经理（季度考核）
  {
    department: 'operations',
    position_level: 'manager',
    data_weight: 80,        // 数据评分 80%
    customer_weight: 0,     // 客户评价包含在绩效底薪变动中
    intelligent_weight: 20  // 绩效底薪变动 20%
  },

  // 销售部门 - M1-M5营销顾问（月度考核）
  {
    department: 'sales',
    position_level: 'staff',
    data_weight: 100,       // 月度提成（业绩完成率）100%
    customer_weight: 0,     // 不适用客户评价
    intelligent_weight: 0   // 绩效底薪奖金单独计算
  },

  // 销售部门 - 营销经理（月度考核）
  {
    department: 'sales',
    position_level: 'manager',
    data_weight: 100,       // 月度提成（业绩完成率）100%
    customer_weight: 0,     // 不适用客户评价
    intelligent_weight: 0   // 绩效底薪奖金单独计算
  }
]

// 绩效目标设置
export const performanceTargets: PerformanceTarget[] = [
  {
    id: 1,
    employee_id: 1,
    period: '2024-01',
    period_type: 'monthly',
    metrics: {
      new_service_fee: 500000,
      new_orders: 20,
      team_service_fee: 2000000,
      team_renewal_fee: 800000
    },
    created_by: 1,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 2,
    employee_id: 2,
    period: '2024-01',
    period_type: 'monthly',
    metrics: {
      new_service_fee: 300000,
      new_orders: 12,
      renewal_fee: 150000
    },
    created_by: 1,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  },
  {
    id: 3,
    employee_id: 3,
    period: '2024-Q1',
    period_type: 'quarterly',
    metrics: {
      service_fee: 800000,
      rebate: 120000
    },
    created_by: 1,
    created_at: '2024-01-01',
    updated_at: '2024-01-01'
  }
]

// 绩效评分记录
export const performanceRatings: PerformanceRating[] = [
  {
    id: 1,
    employee_id: 1,
    period: '2024-01',
    period_type: 'monthly',
    rater_id: 1,
    rater_role: 'sales_director',
    assessment_type: 'intelligent',
    scores: {
      team_growth_balance: 22,
      process_compliance: 20,
      strategy_coaching: 23,
      visit_target_completion: 21
    },
    total_score: 86,
    comments: '团队管理能力突出，策略制定有创新',
    created_at: '2024-02-01',
    updated_at: '2024-02-01'
  },
  {
    id: 2,
    employee_id: 2,
    period: '2024-01',
    period_type: 'monthly',
    rater_id: 1,
    rater_role: 'sales_manager',
    assessment_type: 'intelligent',
    scores: {
      monthly_visits: 85
    },
    total_score: 85,
    comments: '客户拜访积极，成交转化率较高',
    created_at: '2024-02-01',
    updated_at: '2024-02-01'
  }
]

// 完整的绩效记录
export const newPerformanceRecords: NewPerformanceRecord[] = [
  {
    id: 1,
    employee_id: 1,
    employee_name: '王总',
    employee_position: '销售经理',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'manager',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      new_service_fee: {
        target: 500000,
        actual: 520000,
        completion_rate: 104,
        score: 26,
        weight: 25
      },
      new_orders: {
        target: 20,
        actual: 22,
        completion_rate: 110,
        score: 27.5,
        weight: 25
      },
      team_service_fee: {
        target: 2000000,
        actual: 1950000,
        completion_rate: 97.5,
        score: 24.4,
        weight: 25
      },
      team_renewal_fee: {
        target: 800000,
        actual: 850000,
        completion_rate: 106.25,
        score: 26.6,
        weight: 25
      }
    },
    data_score: 104.5,
    data_weight: 100,  // 营销经理：月度提成（业绩完成率）100%

    customer_ratings: {
      satisfaction: 4.5,
      service_quality: 4.3,
      response_speed: 4.6,
      professionalism: 4.4
    },
    customer_score: 88.4,
    customer_weight: 0,

    intelligent_ratings: {
      team_growth_balance: 22,
      process_compliance: 20,
      strategy_coaching: 23,
      visit_target_completion: 21
    },
    intelligent_score: 86,
    intelligent_weight: 0,  // 绩效底薪奖金单独计算

    total_score: 98.0,
    grade: 'A',
    rank_in_department: 1,
    rank_in_company: 3,

    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',

    evaluators: {
      customer: [101, 102, 103],
      intelligent: 1
    },

    comments: '表现优秀，团队管理和业绩完成都很出色'
  },
  {
    id: 2,
    employee_id: 2,
    employee_name: '李四',
    employee_position: '销售专员',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      new_service_fee: {
        target: 300000,
        actual: 285000,
        completion_rate: 95,
        score: 57,
        weight: 40
      },
      new_orders: {
        target: 12,
        actual: 11,
        completion_rate: 91.7,
        score: 27.5,
        weight: 30
      },
      renewal_fee: {
        target: 150000,
        actual: 160000,
        completion_rate: 106.7,
        score: 32,
        weight: 30
      }
    },
    data_score: 116.5,
    data_weight: 100,  // M1-M5营销顾问：月度提成（业绩完成率）100%

    customer_ratings: {
      satisfaction: 4.2,
      service_quality: 4.0,
      response_speed: 4.3,
      professionalism: 4.1
    },
    customer_score: 82.4,
    customer_weight: 0,

    intelligent_ratings: {
      monthly_visits: 85
    },
    intelligent_score: 85,
    intelligent_weight: 0,  // 绩效底薪奖金单独计算

    total_score: 107.1,
    grade: 'A',
    rank_in_department: 2,
    rank_in_company: 8,

    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',

    evaluators: {
      customer: [104, 105],
      intelligent: 1
    },

    comments: '新单略有不足，但续费表现优秀'
  },

  // 运营部门 - 项目经理
  {
    id: 6,
    employee_id: 6,
    employee_name: '张项目',
    employee_position: '项目经理',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'manager',
    period: '2024-Q1',
    period_type: 'quarterly',

    data_metrics: {
      service_fee: {
        target: 800000,
        actual: 850000,
        completion_rate: 106.25,
        score: 42.5,
        weight: 50
      },
      rebate: {
        target: 200000,
        actual: 195000,
        completion_rate: 97.5,
        score: 39,
        weight: 50
      }
    },
    data_score: 81.5,
    data_weight: 80,  // 运营部项目经理：数据评分 80%

    customer_ratings: {
      satisfaction: 4.6,
      service_quality: 4.5,
      response_speed: 4.4,
      professionalism: 4.7
    },
    customer_score: 92.4,
    customer_weight: 0,  // 客户评价包含在绩效底薪变动中

    intelligent_ratings: {
      team_member_management: 18,
      team_customer_reviews: 17,
      knowledge_output: 19,
      talent_development: 16,
      cross_department_cooperation: 18
    },
    intelligent_score: 88,
    intelligent_weight: 20,  // 绩效底薪变动 20%

    total_score: 86.8,
    grade: 'A',
    rank_in_department: 1,
    rank_in_company: 5,

    status: 'completed',
    created_at: '2024-04-01',
    updated_at: '2024-04-01',

    evaluators: {
      customer: [201, 202, 203, 204],
      intelligent: 6
    },

    comments: '团队管理能力强，客户满意度高，知识输出质量优秀'
  },

  // 运营部门 - 普通员工
  {
    id: 7,
    employee_id: 8,
    employee_name: '李运营',
    employee_position: '运营专员',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      service_fee: {
        target: 80000,
        actual: 75000,
        completion_rate: 93.75,
        score: 42.2,
        weight: 50
      },
      rebate: {
        target: 20000,
        actual: 22000,
        completion_rate: 110,
        score: 49.5,
        weight: 50
      }
    },
    data_score: 91.7,
    data_weight: 20,  // 运营部项目成员：月度完成率（业绩完成率）20%

    customer_ratings: {
      satisfaction: 4.3,
      service_quality: 4.4,
      response_speed: 4.2,
      professionalism: 4.5
    },
    customer_score: 87.0,
    customer_weight: 0,  // 不单独设置客户评价权重

    intelligent_ratings: {
      customer_service_ability: 17,
      professional_work_quality: 18,
      communication_assistance: 16,
      work_initiative_execution: 19,
      growth_contribution: 17
    },
    intelligent_score: 87,
    intelligent_weight: 80,  // 职能方案 80%

    total_score: 89.3,
    grade: 'A',
    rank_in_department: 2,
    rank_in_company: 4,

    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',

    evaluators: {
      customer: [201, 202, 203],
      intelligent: 7
    },

    comments: '服务质量稳定，客户反馈良好，工作积极主动'
  },

  // 王总 - 更多月度记录
  {
    id: 4,
    employee_id: 1,
    employee_name: '王总',
    employee_position: '销售经理',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'manager',
    period: '2024-02',
    period_type: 'monthly',

    data_metrics: {
      new_service_fee: {
        target: 500000,
        actual: 480000,
        completion_rate: 96,
        score: 24,
        weight: 25
      },
      new_orders: {
        target: 20,
        actual: 18,
        completion_rate: 90,
        score: 22.5,
        weight: 25
      },
      team_service_fee: {
        target: 2000000,
        actual: 2100000,
        completion_rate: 105,
        score: 26.25,
        weight: 25
      },
      team_renewal_fee: {
        target: 800000,
        actual: 820000,
        completion_rate: 102.5,
        score: 25.6,
        weight: 25
      }
    },
    data_score: 98.35,
    data_weight: 65,

    customer_ratings: {
      satisfaction: 4.3,
      service_quality: 4.1,
      response_speed: 4.4,
      professionalism: 4.2
    },
    customer_score: 84.0,
    customer_weight: 0,

    intelligent_ratings: {
      team_growth_balance: 20,
      process_compliance: 22,
      strategy_coaching: 21,
      visit_target_completion: 19
    },
    intelligent_score: 82,
    intelligent_weight: 35,

    total_score: 93.9,
    grade: 'A',
    rank_in_department: 1,
    rank_in_company: 4,

    status: 'completed',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',

    evaluators: {
      customer: [101, 102, 103],
      intelligent: 1
    },

    comments: '2月表现稳定，团队管理有所提升'
  },

  {
    id: 5,
    employee_id: 1,
    employee_name: '王总',
    employee_position: '销售经理',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'manager',
    period: '2024-03',
    period_type: 'monthly',

    data_metrics: {
      new_service_fee: {
        target: 500000,
        actual: 550000,
        completion_rate: 110,
        score: 27.5,
        weight: 25
      },
      new_orders: {
        target: 20,
        actual: 25,
        completion_rate: 125,
        score: 31.25,
        weight: 25
      },
      team_service_fee: {
        target: 2000000,
        actual: 2200000,
        completion_rate: 110,
        score: 27.5,
        weight: 25
      },
      team_renewal_fee: {
        target: 800000,
        actual: 900000,
        completion_rate: 112.5,
        score: 28.1,
        weight: 25
      }
    },
    data_score: 114.35,
    data_weight: 65,

    customer_ratings: {
      satisfaction: 4.6,
      service_quality: 4.5,
      response_speed: 4.7,
      professionalism: 4.6
    },
    customer_score: 92.0,
    customer_weight: 0,

    intelligent_ratings: {
      team_growth_balance: 24,
      process_compliance: 23,
      strategy_coaching: 25,
      visit_target_completion: 23
    },
    intelligent_score: 95,
    intelligent_weight: 35,

    total_score: 107.6,
    grade: 'S',
    rank_in_department: 1,
    rank_in_company: 1,

    status: 'approved',
    created_at: '2024-04-01',
    updated_at: '2024-04-01',

    evaluators: {
      customer: [101, 102, 103],
      intelligent: 1
    },

    comments: '3月表现卓越，各项指标均超预期'
  },

  // 王总 - 季度记录
  {
    id: 6,
    employee_id: 1,
    employee_name: '王总',
    employee_position: '销售经理',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'manager',
    period: '2024-Q1',
    period_type: 'quarterly',

    data_metrics: {
      new_service_fee: {
        target: 1500000,
        actual: 1550000,
        completion_rate: 103.3,
        score: 25.8,
        weight: 25
      },
      new_orders: {
        target: 60,
        actual: 65,
        completion_rate: 108.3,
        score: 27.1,
        weight: 25
      },
      team_service_fee: {
        target: 6000000,
        actual: 6250000,
        completion_rate: 104.2,
        score: 26.0,
        weight: 25
      },
      team_renewal_fee: {
        target: 2400000,
        actual: 2570000,
        completion_rate: 107.1,
        score: 26.8,
        weight: 25
      }
    },
    data_score: 105.7,
    data_weight: 65,

    customer_ratings: {
      satisfaction: 4.5,
      service_quality: 4.3,
      response_speed: 4.6,
      professionalism: 4.4
    },
    customer_score: 88.4,
    customer_weight: 0,

    intelligent_ratings: {
      team_growth_balance: 23,
      process_compliance: 22,
      strategy_coaching: 24,
      visit_target_completion: 21
    },
    intelligent_score: 90,
    intelligent_weight: 35,

    total_score: 100.2,
    grade: 'S',
    rank_in_department: 1,
    rank_in_company: 2,

    status: 'approved',
    created_at: '2024-04-15',
    updated_at: '2024-04-15',

    evaluators: {
      customer: [101, 102, 103],
      intelligent: 1
    },

    comments: 'Q1季度表现优异，团队管理和业绩双丰收'
  },

  // 王总 - 年度记录
  {
    id: 7,
    employee_id: 1,
    employee_name: '王总',
    employee_position: '销售经理',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'manager',
    period: '2023',
    period_type: 'yearly',

    data_metrics: {
      new_service_fee: {
        target: 6000000,
        actual: 6200000,
        completion_rate: 103.3,
        score: 25.8,
        weight: 25
      },
      new_orders: {
        target: 240,
        actual: 250,
        completion_rate: 104.2,
        score: 26.0,
        weight: 25
      },
      team_service_fee: {
        target: 24000000,
        actual: 25000000,
        completion_rate: 104.2,
        score: 26.0,
        weight: 25
      },
      team_renewal_fee: {
        target: 9600000,
        actual: 10200000,
        completion_rate: 106.3,
        score: 26.6,
        weight: 25
      }
    },
    data_score: 104.4,
    data_weight: 65,

    customer_ratings: {
      satisfaction: 4.4,
      service_quality: 4.2,
      response_speed: 4.5,
      professionalism: 4.3
    },
    customer_score: 86.8,
    customer_weight: 0,

    intelligent_ratings: {
      team_growth_balance: 22,
      process_compliance: 21,
      strategy_coaching: 23,
      visit_target_completion: 20
    },
    intelligent_score: 86,
    intelligent_weight: 35,

    total_score: 98.9,
    grade: 'A',
    rank_in_department: 1,
    rank_in_company: 3,

    status: 'approved',
    created_at: '2024-01-15',
    updated_at: '2024-01-15',

    evaluators: {
      customer: [101, 102, 103],
      intelligent: 1
    },

    comments: '2023年度表现优秀，为团队发展做出重要贡献'
  },

  // 李四 - 更多月度记录
  {
    id: 8,
    employee_id: 2,
    employee_name: '李四',
    employee_position: '销售专员',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-02',
    period_type: 'monthly',

    data_metrics: {
      new_service_fee: {
        target: 300000,
        actual: 320000,
        completion_rate: 106.7,
        score: 64,
        weight: 40
      },
      new_orders: {
        target: 12,
        actual: 13,
        completion_rate: 108.3,
        score: 32.5,
        weight: 30
      },
      renewal_fee: {
        target: 150000,
        actual: 145000,
        completion_rate: 96.7,
        score: 29,
        weight: 30
      }
    },
    data_score: 125.5,
    data_weight: 70,

    customer_ratings: {
      satisfaction: 4.3,
      service_quality: 4.1,
      response_speed: 4.4,
      professionalism: 4.2
    },
    customer_score: 84.0,
    customer_weight: 0,

    intelligent_ratings: {
      monthly_visits: 88
    },
    intelligent_score: 88,
    intelligent_weight: 30,

    total_score: 114.3,
    grade: 'A',
    rank_in_department: 2,
    rank_in_company: 5,

    status: 'completed',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',

    evaluators: {
      customer: [104, 105],
      intelligent: 2
    },

    comments: '2月表现良好，客户开发能力有提升'
  },

  {
    id: 9,
    employee_id: 2,
    employee_name: '李四',
    employee_position: '销售专员',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-03',
    period_type: 'monthly',

    data_metrics: {
      new_service_fee: {
        target: 300000,
        actual: 290000,
        completion_rate: 96.7,
        score: 58,
        weight: 40
      },
      new_orders: {
        target: 12,
        actual: 10,
        completion_rate: 83.3,
        score: 25,
        weight: 30
      },
      renewal_fee: {
        target: 150000,
        actual: 170000,
        completion_rate: 113.3,
        score: 34,
        weight: 30
      }
    },
    data_score: 117.0,
    data_weight: 70,

    customer_ratings: {
      satisfaction: 4.0,
      service_quality: 3.9,
      response_speed: 4.2,
      professionalism: 4.0
    },
    customer_score: 80.2,
    customer_weight: 0,

    intelligent_ratings: {
      monthly_visits: 82
    },
    intelligent_score: 82,
    intelligent_weight: 30,

    total_score: 106.5,
    grade: 'A',
    rank_in_department: 3,
    rank_in_company: 8,

    status: 'completed',
    created_at: '2024-04-01',
    updated_at: '2024-04-01',

    evaluators: {
      customer: [104, 105],
      intelligent: 2
    },

    comments: '3月新单略有下降，但续费表现优秀'
  },

  // 李四 - 季度记录
  {
    id: 10,
    employee_id: 2,
    employee_name: '李四',
    employee_position: '销售专员',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-Q1',
    period_type: 'quarterly',

    data_metrics: {
      new_service_fee: {
        target: 900000,
        actual: 895000,
        completion_rate: 99.4,
        score: 59.6,
        weight: 40
      },
      new_orders: {
        target: 36,
        actual: 34,
        completion_rate: 94.4,
        score: 28.3,
        weight: 30
      },
      renewal_fee: {
        target: 450000,
        actual: 475000,
        completion_rate: 105.6,
        score: 31.7,
        weight: 30
      }
    },
    data_score: 119.6,
    data_weight: 70,

    customer_ratings: {
      satisfaction: 4.1,
      service_quality: 4.0,
      response_speed: 4.3,
      professionalism: 4.1
    },
    customer_score: 82.0,
    customer_weight: 0,

    intelligent_ratings: {
      monthly_visits: 85
    },
    intelligent_score: 85,
    intelligent_weight: 30,

    total_score: 109.2,
    grade: 'A',
    rank_in_department: 2,
    rank_in_company: 6,

    status: 'approved',
    created_at: '2024-04-15',
    updated_at: '2024-04-15',

    evaluators: {
      customer: [104, 105],
      intelligent: 2
    },

    comments: 'Q1季度整体表现稳定，续费业务突出'
  },

  // 李运营 (employee_id: 3) - 运营部门记录
  {
    id: 11,
    employee_id: 3,
    employee_name: '李运营',
    employee_position: '运营专员',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      service_quality: {
        target: 95,
        actual: 97,
        completion_rate: 102.1,
        score: 51.1,
        weight: 50
      },
      response_time: {
        target: 2,
        actual: 1.8,
        completion_rate: 111.1,
        score: 55.6,
        weight: 50
      }
    },
    data_score: 106.7,
    data_weight: 40,

    customer_ratings: {
      satisfaction: 4.5,
      service_quality: 4.4,
      response_speed: 4.6,
      professionalism: 4.3
    },
    customer_score: 89.6,
    customer_weight: 30,

    intelligent_ratings: {
      team_management: 16,
      customer_evaluation_management: 15,
      knowledge_output: 17,
      talent_development: 14,
      cross_team_cooperation: 16
    },
    intelligent_score: 78,
    intelligent_weight: 30,

    total_score: 89.3,
    grade: 'A',
    rank_in_department: 2,
    rank_in_company: 7,

    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',

    evaluators: {
      customer: [201, 202, 203],
      intelligent: 6
    },

    comments: '服务质量优秀，响应速度快'
  },

  {
    id: 12,
    employee_id: 3,
    employee_name: '李运营',
    employee_position: '运营专员',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-02',
    period_type: 'monthly',

    data_metrics: {
      service_quality: {
        target: 95,
        actual: 96,
        completion_rate: 101.1,
        score: 50.5,
        weight: 50
      },
      response_time: {
        target: 2,
        actual: 1.9,
        completion_rate: 105.3,
        score: 52.6,
        weight: 50
      }
    },
    data_score: 103.1,
    data_weight: 40,

    customer_ratings: {
      satisfaction: 4.3,
      service_quality: 4.2,
      response_speed: 4.4,
      professionalism: 4.1
    },
    customer_score: 84.0,
    customer_weight: 30,

    intelligent_ratings: {
      team_management: 15,
      customer_evaluation_management: 16,
      knowledge_output: 16,
      talent_development: 15,
      cross_team_cooperation: 17
    },
    intelligent_score: 79,
    intelligent_weight: 30,

    total_score: 87.9,
    grade: 'B',
    rank_in_department: 3,
    rank_in_company: 9,

    status: 'completed',
    created_at: '2024-03-01',
    updated_at: '2024-03-01',

    evaluators: {
      customer: [201, 202, 203],
      intelligent: 6
    },

    comments: '2月表现稳定，团队协作能力有提升'
  },

  // 李运营 - 季度记录
  {
    id: 13,
    employee_id: 3,
    employee_name: '李运营',
    employee_position: '运营专员',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-Q1',
    period_type: 'quarterly',

    data_metrics: {
      service_quality: {
        target: 95,
        actual: 96.5,
        completion_rate: 101.6,
        score: 50.8,
        weight: 50
      },
      response_time: {
        target: 2,
        actual: 1.85,
        completion_rate: 108.1,
        score: 54.1,
        weight: 50
      }
    },
    data_score: 104.9,
    data_weight: 40,

    customer_ratings: {
      satisfaction: 4.4,
      service_quality: 4.3,
      response_speed: 4.5,
      professionalism: 4.2
    },
    customer_score: 86.8,
    customer_weight: 30,

    intelligent_ratings: {
      team_management: 16,
      customer_evaluation_management: 16,
      knowledge_output: 17,
      talent_development: 15,
      cross_team_cooperation: 17
    },
    intelligent_score: 81,
    intelligent_weight: 30,

    total_score: 89.0,
    grade: 'A',
    rank_in_department: 2,
    rank_in_company: 8,

    status: 'approved',
    created_at: '2024-04-15',
    updated_at: '2024-04-15',

    evaluators: {
      customer: [201, 202, 203],
      intelligent: 6
    },

    comments: 'Q1季度表现优秀，服务质量持续改善'
  }
]

// 获取用户权限数据的函数
export function getEmployeesByRole(role: UserRole, userId: number): number[] {
  // 根据角色返回可查看的员工ID列表
  switch (role) {
    case 'general_manager':
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // 查看所有员工
    case 'sales_director':
      return [1, 2, 3, 4, 5] // 查看销售部门所有员工
    case 'sales_manager':
      return [2, 3, 4] // 查看下属销售人员
    case 'project_director':
      return [6, 7, 8, 9, 10] // 查看运营部门所有员工
    case 'project_manager':
      return [8, 9, 10] // 查看下属运营人员
    default:
      return [userId] // 普通员工只能查看自己
  }
}

// 获取可设置目标的员工
export function getTargetSettableEmployees(role: UserRole, userId: number): number[] {
  switch (role) {
    case 'general_manager':
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    case 'sales_director':
      return [1, 2, 3, 4, 5]
    case 'sales_manager':
      return [2, 3, 4]
    case 'project_director':
      return [6, 7, 8, 9, 10]
    case 'project_manager':
      return [8, 9, 10]
    default:
      return []
  }
}

// 获取可评分的员工
export function getRatableEmployees(role: UserRole, userId: number): number[] {
  switch (role) {
    case 'general_manager':
      return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] // 总经理可以给所有员工评分
    case 'sales_director':
      return [1] // 可以给销售经理评分
    case 'sales_manager':
      return [2, 3, 4] // 可以给销售人员评分
    case 'project_director':
      return [6, 7] // 可以给项目经理评分
    case 'project_manager':
      return [8, 9, 10] // 可以给运营人员评分
    default:
      return []
  }
}

// 获取绩效等级颜色
export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'S': return '#ff6b35'
    case 'A': return '#10b981'
    case 'B': return '#3b82f6'
    case 'C': return '#f59e0b'
    case 'D': return '#ef4444'
    default: return '#6b7280'
  }
}

// 获取绩效等级描述
export function getGradeDescription(grade: string): string {
  switch (grade) {
    case 'S': return '卓越'
    case 'A': return '优秀'
    case 'B': return '良好'
    case 'C': return '合格'
    case 'D': return '待改进'
    default: return '未评级'
  }
}
