import type {
  MetricConfig,
  FunctionalAssessmentConfig,
  ProcessManagementConfig,
  OperationsWeightConfig,
  SalesWeightConfig,
  OperationsPerformanceRecord,
  SalesPerformanceRecord,
  PerformanceTarget,
  PerformanceRating,
  UserRole,
  DepartmentType,
  PositionLevel,
  PeriodType
} from '@/types/departments'

// 当前用户角色（模拟登录用户）
export const currentUserRole: UserRole = 'general_manager'
export const currentUserId = 1

// ==================== 运营部门配置 ====================

// 运营部门数据指标配置
export const operationsMetricConfigs: MetricConfig[] = [
  // 项目经理 - 季度考核
  {
    id: 'ops_manager_service_fee',
    name: '服务费目标',
    department: 'operations',
    position_level: 'manager',
    period_type: 'quarterly',
    weight: 100,
    target_field: 'service_fee',
    unit: '元',
    description: '季度服务费收入目标完成情况'
  },
  {
    id: 'ops_manager_rebate',
    name: '返点目标',
    department: 'operations',
    position_level: 'manager',
    period_type: 'quarterly',
    weight: 100,
    target_field: 'rebate',
    unit: '元',
    description: '季度返点目标完成情况'
  },

  // 项目成员 - 月度考核
  {
    id: 'ops_staff_service_fee',
    name: '服务费目标',
    department: 'operations',
    position_level: 'staff',
    period_type: 'monthly',
    weight: 100,
    target_field: 'service_fee',
    unit: '元',
    description: '月度服务费收入目标完成情况'
  },
  {
    id: 'ops_staff_rebate',
    name: '返点目标',
    department: 'operations',
    position_level: 'staff',
    period_type: 'monthly',
    weight: 100,
    target_field: 'rebate',
    unit: '元',
    description: '月度返点目标完成情况'
  }
]

// 运营部门职能方案考核配置
export const operationsFunctionalConfigs: FunctionalAssessmentConfig[] = [
  // 项目经理（由项目总监评价）
  {
    id: 'ops_manager_functional',
    department: 'operations',
    position_level: 'manager',
    evaluator_role: 'project_director',
    weight: 100,
    items: [
      {
        id: 'team_member_management',
        name: '团队成员管理',
        description: '对团队成员的管理、指导和激励能力',
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

  // 项目成员（由项目经理评价）
  {
    id: 'ops_staff_functional',
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
  }
]

// 运营部门权重配置
export const operationsWeightConfigs: OperationsWeightConfig[] = [
  // 项目经理
  {
    department: 'operations',
    position_level: 'manager',
    data_weight: 40,        // 数据指标 40%
    customer_weight: 30,    // 客户评价 30%
    functional_weight: 30   // 职能方案 30%
  },
  // 项目成员
  {
    department: 'operations',
    position_level: 'staff',
    data_weight: 40,        // 数据指标 40%
    customer_weight: 30,    // 客户评价 30%
    functional_weight: 30   // 职能方案 30%
  }
]

// ==================== 销售部门配置 ====================

// 销售部门数据指标配置
export const salesMetricConfigs: MetricConfig[] = [
  // 营销经理 - 月度考核
  {
    id: 'sales_manager_new_service_fee',
    name: '新单服务费目标',
    department: 'sales',
    position_level: 'manager',
    period_type: 'monthly',
    weight: 50,
    target_field: 'new_service_fee',
    unit: '元',
    description: '月度新单服务费收入目标'
  },
  {
    id: 'sales_manager_new_orders',
    name: '新单单量目标',
    department: 'sales',
    position_level: 'manager',
    period_type: 'monthly',
    weight: 50,
    target_field: 'new_orders',
    unit: '单',
    description: '月度新单数量目标'
  },

  // M1-M5营销顾问 - 月度考核
  {
    id: 'sales_staff_new_service_fee',
    name: '新单服务费目标',
    department: 'sales',
    position_level: 'staff',
    period_type: 'monthly',
    weight: 50,
    target_field: 'new_service_fee',
    unit: '元',
    description: '月度新单服务费收入目标'
  },
  {
    id: 'sales_staff_new_orders',
    name: '新单单量目标',
    department: 'sales',
    position_level: 'staff',
    period_type: 'monthly',
    weight: 50,
    target_field: 'new_orders',
    unit: '单',
    description: '月度新单数量目标'
  }
]

// 销售部门过程管理指标配置
export const salesProcessConfigs: ProcessManagementConfig[] = [
  // 营销经理（由销售总监评价）
  {
    id: 'sales_manager_process',
    department: 'sales',
    position_level: 'manager',
    evaluator_role: 'sales_director',
    weight: 100,
    items: [
      {
        id: 'personal_new_service_fee',
        name: '个人新单服务费目标',
        description: '个人新单服务费完成情况',
        max_score: 20,
        input_type: 'calculated'
      },
      {
        id: 'team_new_service_fee',
        name: '团队新单服务费目标',
        description: '团队新单服务费完成情况',
        max_score: 20,
        input_type: 'calculated'
      },
      {
        id: 'team_renewal_service_fee',
        name: '团队续费服务费目标',
        description: '团队续费服务费完成情况',
        max_score: 20,
        input_type: 'calculated'
      },
      {
        id: 'member_growth_balance',
        name: '成员成长及均衡性',
        description: '团队成员能力提升和发展均衡性',
        max_score: 10,
        input_type: 'manual'
      },
      {
        id: 'sales_process_crm',
        name: '销售流程与CRM规范',
        description: '销售流程标准化和CRM系统使用规范性',
        max_score: 5,
        input_type: 'manual'
      },
      {
        id: 'strategy_coaching',
        name: '策略制定与过程辅导',
        description: '销售策略制定和团队辅导能力',
        max_score: 10,
        input_type: 'manual'
      },
      {
        id: 'team_visit_target',
        name: '团队客户拜访量目标',
        description: '团队整体客户拜访量目标达成情况',
        max_score: 15,
        input_type: 'manual'
      }
    ]
  },

  // M1-M5营销顾问（由营销经理评价）
  {
    id: 'sales_staff_process',
    department: 'sales',
    position_level: 'staff',
    evaluator_role: 'sales_manager',
    weight: 100,
    items: [
      {
        id: 'new_service_fee_target',
        name: '新单服务费目标',
        description: '新单服务费完成情况',
        max_score: 50,
        input_type: 'calculated'
      },
      {
        id: 'new_customer_target',
        name: '新单客户数目标',
        description: '新客户开发数量完成情况',
        max_score: 30,
        input_type: 'calculated'
      },
      {
        id: 'monthly_renewal_target',
        name: '月度客户续约金额/续约服务费目标',
        description: '客户续约金额完成情况',
        max_score: 20,
        input_type: 'calculated'
      }
    ]
  }
]

// 销售部门权重配置
export const salesWeightConfigs: SalesWeightConfig[] = [
  // 营销经理
  {
    department: 'sales',
    position_level: 'manager',
    monthly_commission_weight: 100,    // 月度提成 100%
    performance_bonus_weight: 100      // 绩效底薪奖金 100%（单独计算）
  },
  // M1-M5营销顾问
  {
    department: 'sales',
    position_level: 'staff',
    monthly_commission_weight: 100,    // 月度提成 100%
    performance_bonus_weight: 100      // 绩效底薪奖金 100%（单独计算）
  }
]

// ==================== 示例数据 ====================

// 运营部门绩效记录示例
export const operationsPerformanceRecords: OperationsPerformanceRecord[] = [
  // 项目经理 - 季度考核
  {
    id: 1,
    employee_id: 6,
    employee_name: '张项目经理',
    employee_position: '项目经理',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'manager',
    period: '2024-Q1',
    period_type: 'quarterly',

    data_metrics: {
      service_fee: { target: 800000, actual: 850000, completion_rate: 106.25, score: 85, weight: 100 },
      rebate: { target: 120000, actual: 125000, completion_rate: 104.17, score: 83, weight: 100 }
    },
    data_score: 84,
    data_weight: 40,

    customer_ratings: { satisfaction: 4.6, service_quality: 4.5, response_speed: 4.4, professionalism: 4.7 },
    customer_score: 92,
    customer_weight: 30,

    functional_ratings: {
      team_member_management: 18, team_customer_reviews: 17, knowledge_output: 19,
      talent_development: 16, cross_department_cooperation: 18
    },
    functional_score: 88,
    functional_weight: 30,

    total_score: 87.2,
    grade: 'A',
    rank_in_department: 1,
    rank_in_company: 5,
    status: 'completed',
    created_at: '2024-04-01',
    updated_at: '2024-04-01',
    evaluators: { customer: [201, 202, 203, 204], functional: 7 },
    comments: '季度表现优秀，团队管理能力强，客户满意度高'
  },

  {
    id: 2,
    employee_id: 7,
    employee_name: '王项目经理',
    employee_position: '项目经理',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'manager',
    period: '2024-Q1',
    period_type: 'quarterly',

    data_metrics: {
      service_fee: { target: 750000, actual: 720000, completion_rate: 96.0, score: 78, weight: 100 },
      rebate: { target: 110000, actual: 115000, completion_rate: 104.55, score: 84, weight: 100 }
    },
    data_score: 81,
    data_weight: 40,

    customer_ratings: { satisfaction: 4.4, service_quality: 4.3, response_speed: 4.5, professionalism: 4.6 },
    customer_score: 89,
    customer_weight: 30,

    functional_ratings: {
      team_member_management: 17, team_customer_reviews: 18, knowledge_output: 16,
      talent_development: 19, cross_department_cooperation: 17
    },
    functional_score: 87,
    functional_weight: 30,

    total_score: 85.1,
    grade: 'A',
    rank_in_department: 2,
    rank_in_company: 7,
    status: 'completed',
    created_at: '2024-04-01',
    updated_at: '2024-04-01',
    evaluators: { customer: [205, 206, 207], functional: 7 },
    comments: '团队协作能力突出，人才培养成效显著'
  },

  // 项目成员 - 月度考核
  {
    id: 3,
    employee_id: 8,
    employee_name: '李优化师',
    employee_position: '优化师',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      service_fee: { target: 80000, actual: 75000, completion_rate: 93.75, score: 75, weight: 100 },
      rebate: { target: 12000, actual: 13000, completion_rate: 108.33, score: 87, weight: 100 }
    },
    data_score: 81,
    data_weight: 40,

    customer_ratings: { satisfaction: 4.3, service_quality: 4.4, response_speed: 4.2, professionalism: 4.5 },
    customer_score: 87,
    customer_weight: 30,

    functional_ratings: {
      customer_service_ability: 17, professional_work_quality: 18, communication_assistance: 16,
      work_initiative_execution: 19, growth_contribution: 17
    },
    functional_score: 87,
    functional_weight: 30,

    total_score: 84.9,
    grade: 'A',
    rank_in_department: 3,
    rank_in_company: 8,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { customer: [201, 202, 203], functional: 6 },
    comments: '月度表现良好，服务质量优秀，响应速度快'
  },

  {
    id: 4,
    employee_id: 9,
    employee_name: '陈运营专员',
    employee_position: '运营专员',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      service_fee: { target: 70000, actual: 72000, completion_rate: 102.86, score: 82, weight: 100 },
      rebate: { target: 10000, actual: 9500, completion_rate: 95.0, score: 76, weight: 100 }
    },
    data_score: 79,
    data_weight: 40,

    customer_ratings: { satisfaction: 4.2, service_quality: 4.1, response_speed: 4.3, professionalism: 4.4 },
    customer_score: 85,
    customer_weight: 30,

    functional_ratings: {
      customer_service_ability: 16, professional_work_quality: 17, communication_assistance: 18,
      work_initiative_execution: 16, growth_contribution: 18
    },
    functional_score: 85,
    functional_weight: 30,

    total_score: 82.7,
    grade: 'B',
    rank_in_department: 4,
    rank_in_company: 12,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { customer: [204, 205], functional: 6 },
    comments: '工作积极主动，沟通协作能力强'
  },

  {
    id: 5,
    employee_id: 10,
    employee_name: '刘数据分析师',
    employee_position: '数据分析师',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      service_fee: { target: 65000, actual: 68000, completion_rate: 104.62, score: 84, weight: 100 },
      rebate: { target: 9000, actual: 8800, completion_rate: 97.78, score: 78, weight: 100 }
    },
    data_score: 81,
    data_weight: 40,

    customer_ratings: { satisfaction: 4.5, service_quality: 4.6, response_speed: 4.3, professionalism: 4.7 },
    customer_score: 91,
    customer_weight: 30,

    functional_ratings: {
      customer_service_ability: 19, professional_work_quality: 20, communication_assistance: 17,
      work_initiative_execution: 18, growth_contribution: 19
    },
    functional_score: 93,
    functional_weight: 30,

    total_score: 87.8,
    grade: 'A',
    rank_in_department: 5,
    rank_in_company: 4,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { customer: [206, 207, 208], functional: 7 },
    comments: '专业能力突出，数据分析精准，客户满意度高'
  },

  {
    id: 6,
    employee_id: 11,
    employee_name: '周内容运营',
    employee_position: '内容运营',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      service_fee: { target: 60000, actual: 58000, completion_rate: 96.67, score: 77, weight: 100 },
      rebate: { target: 8500, actual: 9200, completion_rate: 108.24, score: 87, weight: 100 }
    },
    data_score: 82,
    data_weight: 40,

    customer_ratings: { satisfaction: 4.1, service_quality: 4.2, response_speed: 4.0, professionalism: 4.3 },
    customer_score: 83,
    customer_weight: 30,

    functional_ratings: {
      customer_service_ability: 15, professional_work_quality: 16, communication_assistance: 19,
      work_initiative_execution: 17, growth_contribution: 16
    },
    functional_score: 83,
    functional_weight: 30,

    total_score: 82.6,
    grade: 'B',
    rank_in_department: 6,
    rank_in_company: 13,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { customer: [209, 210], functional: 6 },
    comments: '内容创作能力强，沟通协助表现突出'
  },

  {
    id: 7,
    employee_id: 12,
    employee_name: '吴客服专员',
    employee_position: '客服专员',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      service_fee: { target: 55000, actual: 57000, completion_rate: 103.64, score: 83, weight: 100 },
      rebate: { target: 7500, actual: 7200, completion_rate: 96.0, score: 77, weight: 100 }
    },
    data_score: 80,
    data_weight: 40,

    customer_ratings: { satisfaction: 4.7, service_quality: 4.8, response_speed: 4.6, professionalism: 4.5 },
    customer_score: 94,
    customer_weight: 30,

    functional_ratings: {
      customer_service_ability: 20, professional_work_quality: 18, communication_assistance: 19,
      work_initiative_execution: 17, growth_contribution: 15
    },
    functional_score: 89,
    functional_weight: 30,

    total_score: 86.9,
    grade: 'A',
    rank_in_department: 7,
    rank_in_company: 6,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { customer: [201, 202, 203, 204, 205], functional: 6 },
    comments: '客户服务能力优秀，满意度评分最高'
  },

  {
    id: 8,
    employee_id: 13,
    employee_name: '郑技术支持',
    employee_position: '技术支持',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      service_fee: { target: 50000, actual: 52000, completion_rate: 104.0, score: 83, weight: 100 },
      rebate: { target: 7000, actual: 6800, completion_rate: 97.14, score: 78, weight: 100 }
    },
    data_score: 80.5,
    data_weight: 40,

    customer_ratings: { satisfaction: 4.3, service_quality: 4.4, response_speed: 4.5, professionalism: 4.6 },
    customer_score: 89,
    customer_weight: 30,

    functional_ratings: {
      customer_service_ability: 17, professional_work_quality: 19, communication_assistance: 16,
      work_initiative_execution: 18, growth_contribution: 17
    },
    functional_score: 87,
    functional_weight: 30,

    total_score: 84.85,
    grade: 'A',
    rank_in_department: 8,
    rank_in_company: 9,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { customer: [206, 207], functional: 7 },
    comments: '技术专业能力强，问题解决效率高'
  },

  {
    id: 9,
    employee_id: 14,
    employee_name: '孙市场专员',
    employee_position: '市场专员',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      service_fee: { target: 45000, actual: 47000, completion_rate: 104.44, score: 84, weight: 100 },
      rebate: { target: 6500, actual: 6300, completion_rate: 96.92, score: 77, weight: 100 }
    },
    data_score: 80.5,
    data_weight: 40,

    customer_ratings: { satisfaction: 4.0, service_quality: 4.1, response_speed: 4.2, professionalism: 4.0 },
    customer_score: 81,
    customer_weight: 30,

    functional_ratings: {
      customer_service_ability: 14, professional_work_quality: 15, communication_assistance: 17,
      work_initiative_execution: 16, growth_contribution: 18
    },
    functional_score: 80,
    functional_weight: 30,

    total_score: 80.65,
    grade: 'B',
    rank_in_department: 9,
    rank_in_company: 15,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { customer: [208, 209], functional: 6 },
    comments: '市场推广思路清晰，成长潜力大'
  },

  {
    id: 10,
    employee_id: 15,
    employee_name: '韩运营助理',
    employee_position: '运营助理',
    department_id: 2,
    department_name: '运营部',
    department_type: 'operations',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    data_metrics: {
      service_fee: { target: 40000, actual: 38000, completion_rate: 95.0, score: 76, weight: 100 },
      rebate: { target: 6000, actual: 6200, completion_rate: 103.33, score: 83, weight: 100 }
    },
    data_score: 79.5,
    data_weight: 40,

    customer_ratings: { satisfaction: 3.9, service_quality: 4.0, response_speed: 3.8, professionalism: 4.1 },
    customer_score: 79,
    customer_weight: 30,

    functional_ratings: {
      customer_service_ability: 13, professional_work_quality: 14, communication_assistance: 15,
      work_initiative_execution: 15, growth_contribution: 16
    },
    functional_score: 73,
    functional_weight: 30,

    total_score: 77.35,
    grade: 'C',
    rank_in_department: 10,
    rank_in_company: 18,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { customer: [210], functional: 6 },
    comments: '工作态度认真，需要进一步提升专业技能'
  }
]

// 销售部门绩效记录示例
export const salesPerformanceRecords: SalesPerformanceRecord[] = [
  // 营销经理 - 月度考核
  {
    id: 3,
    employee_id: 1,
    employee_name: '王营销经理',
    employee_position: '营销经理',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'manager',
    period: '2024-01',
    period_type: 'monthly',

    // 月度提成 - 数据评分(月度完成率)
    monthly_commission: {
      new_service_fee: {
        target: 500000,
        actual: 520000,
        completion_rate: 104,
        score: 104,
        weight: 50
      },
      new_orders: {
        target: 20,
        actual: 22,
        completion_rate: 110,
        score: 110,
        weight: 50
      }
    },
    monthly_commission_score: 107,
    monthly_commission_weight: 100,

    // 绩效底薪奖金 - 数据评分+过程管理指标
    performance_bonus: {
      data_metrics: {
        personal_new_service_fee: {
          target: 500000,
          actual: 520000,
          completion_rate: 104,
          score: 20.8,
          weight: 20
        },
        team_new_service_fee: {
          target: 2000000,
          actual: 1950000,
          completion_rate: 97.5,
          score: 19.5,
          weight: 20
        },
        team_renewal_service_fee: {
          target: 800000,
          actual: 850000,
          completion_rate: 106.25,
          score: 21.25,
          weight: 20
        }
      },
      process_management: {
        member_growth_balance: 8.5,    // 满分10分
        sales_process_crm: 4.2,        // 满分5分
        strategy_coaching: 8.8,        // 满分10分
        team_visit_target: 12.5        // 满分15分，需要人工录入
      }
    },
    performance_bonus_score: 95.75,
    performance_bonus_weight: 100,

    total_score: 107, // 月度提成得分
    grade: 'A',
    rank_in_department: 1,
    rank_in_company: 3,

    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',

    evaluators: {
      process_management: 5 // 销售总监
    },

    comments: '月度表现优秀，团队管理能力突出，策略制定有创新'
  },

  {
    id: 4,
    employee_id: 2,
    employee_name: '李销售代表',
    employee_position: '销售代表',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    monthly_commission: {
      new_service_fee: { target: 300000, actual: 280000, completion_rate: 93.33, score: 93.33, weight: 50 },
      new_orders: { target: 12, actual: 11, completion_rate: 91.67, score: 91.67, weight: 50 }
    },
    monthly_commission_score: 92.5,
    monthly_commission_weight: 100,

    performance_bonus: {
      data_metrics: {
        personal_new_service_fee: { target: 300000, actual: 280000, completion_rate: 93.33, score: 18.67, weight: 20 },
        team_new_service_fee: { target: 1500000, actual: 1520000, completion_rate: 101.33, score: 20.27, weight: 20 },
        team_renewal_service_fee: { target: 600000, actual: 580000, completion_rate: 96.67, score: 19.33, weight: 20 }
      },
      process_management: {
        member_growth_balance: 7.5, sales_process_crm: 3.8, strategy_coaching: 7.2, team_visit_target: 11.0
      }
    },
    performance_bonus_score: 87.57,
    performance_bonus_weight: 100,

    total_score: 92.5,
    grade: 'A',
    rank_in_department: 2,
    rank_in_company: 11,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { process_management: 1 },
    comments: '销售业绩稳定，团队协作良好'
  },

  {
    id: 5,
    employee_id: 16,
    employee_name: '张销售主管',
    employee_position: '销售主管',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'manager',
    period: '2024-01',
    period_type: 'monthly',

    monthly_commission: {
      new_service_fee: { target: 400000, actual: 420000, completion_rate: 105, score: 105, weight: 50 },
      new_orders: { target: 15, actual: 16, completion_rate: 106.67, score: 106.67, weight: 50 }
    },
    monthly_commission_score: 105.84,
    monthly_commission_weight: 100,

    performance_bonus: {
      data_metrics: {
        personal_new_service_fee: { target: 400000, actual: 420000, completion_rate: 105, score: 21.0, weight: 20 },
        team_new_service_fee: { target: 1800000, actual: 1750000, completion_rate: 97.22, score: 19.44, weight: 20 },
        team_renewal_service_fee: { target: 700000, actual: 720000, completion_rate: 102.86, score: 20.57, weight: 20 }
      },
      process_management: {
        member_growth_balance: 8.2, sales_process_crm: 4.0, strategy_coaching: 8.5, team_visit_target: 13.0
      }
    },
    performance_bonus_score: 94.71,
    performance_bonus_weight: 100,

    total_score: 105.84,
    grade: 'A',
    rank_in_department: 3,
    rank_in_company: 1,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { process_management: 5 },
    comments: '业绩表现优异，团队管理能力突出'
  },

  {
    id: 6,
    employee_id: 17,
    employee_name: '赵客户经理',
    employee_position: '客户经理',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    monthly_commission: {
      new_service_fee: { target: 250000, actual: 260000, completion_rate: 104, score: 104, weight: 50 },
      new_orders: { target: 10, actual: 12, completion_rate: 120, score: 120, weight: 50 }
    },
    monthly_commission_score: 112,
    monthly_commission_weight: 100,

    performance_bonus: {
      data_metrics: {
        personal_new_service_fee: { target: 250000, actual: 260000, completion_rate: 104, score: 20.8, weight: 20 },
        team_new_service_fee: { target: 1200000, actual: 1180000, completion_rate: 98.33, score: 19.67, weight: 20 },
        team_renewal_service_fee: { target: 500000, actual: 520000, completion_rate: 104, score: 20.8, weight: 20 }
      },
      process_management: {
        member_growth_balance: 7.8, sales_process_crm: 4.5, strategy_coaching: 8.0, team_visit_target: 12.0
      }
    },
    performance_bonus_score: 92.77,
    performance_bonus_weight: 100,

    total_score: 112,
    grade: 'A',
    rank_in_department: 4,
    rank_in_company: 2,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { process_management: 1 },
    comments: '客户开发能力强，订单转化率高'
  },

  {
    id: 7,
    employee_id: 18,
    employee_name: '钱销售顾问',
    employee_position: '销售顾问',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    monthly_commission: {
      new_service_fee: { target: 200000, actual: 190000, completion_rate: 95, score: 95, weight: 50 },
      new_orders: { target: 8, actual: 7, completion_rate: 87.5, score: 87.5, weight: 50 }
    },
    monthly_commission_score: 91.25,
    monthly_commission_weight: 100,

    performance_bonus: {
      data_metrics: {
        personal_new_service_fee: { target: 200000, actual: 190000, completion_rate: 95, score: 19.0, weight: 20 },
        team_new_service_fee: { target: 1000000, actual: 980000, completion_rate: 98, score: 19.6, weight: 20 },
        team_renewal_service_fee: { target: 400000, actual: 410000, completion_rate: 102.5, score: 20.5, weight: 20 }
      },
      process_management: {
        member_growth_balance: 6.5, sales_process_crm: 3.5, strategy_coaching: 6.8, team_visit_target: 9.5
      }
    },
    performance_bonus_score: 85.4,
    performance_bonus_weight: 100,

    total_score: 91.25,
    grade: 'B',
    rank_in_department: 5,
    rank_in_company: 14,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { process_management: 2 },
    comments: '基础业务扎实，需要提升新客户开发能力'
  },

  {
    id: 8,
    employee_id: 19,
    employee_name: '孙营销专员',
    employee_position: '营销专员',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    monthly_commission: {
      new_service_fee: { target: 180000, actual: 175000, completion_rate: 97.22, score: 97.22, weight: 50 },
      new_orders: { target: 7, actual: 6, completion_rate: 85.71, score: 85.71, weight: 50 }
    },
    monthly_commission_score: 91.47,
    monthly_commission_weight: 100,

    performance_bonus: {
      data_metrics: {
        personal_new_service_fee: { target: 180000, actual: 175000, completion_rate: 97.22, score: 19.44, weight: 20 },
        team_new_service_fee: { target: 900000, actual: 920000, completion_rate: 102.22, score: 20.44, weight: 20 },
        team_renewal_service_fee: { target: 350000, actual: 340000, completion_rate: 97.14, score: 19.43, weight: 20 }
      },
      process_management: {
        member_growth_balance: 6.8, sales_process_crm: 3.2, strategy_coaching: 7.0, team_visit_target: 10.0
      }
    },
    performance_bonus_score: 86.31,
    performance_bonus_weight: 100,

    total_score: 91.47,
    grade: 'B',
    rank_in_department: 6,
    rank_in_company: 13,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { process_management: 2 },
    comments: '工作积极主动，团队合作意识强'
  },

  {
    id: 9,
    employee_id: 20,
    employee_name: '周销售助理',
    employee_position: '销售助理',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    monthly_commission: {
      new_service_fee: { target: 150000, actual: 145000, completion_rate: 96.67, score: 96.67, weight: 50 },
      new_orders: { target: 6, actual: 5, completion_rate: 83.33, score: 83.33, weight: 50 }
    },
    monthly_commission_score: 90,
    monthly_commission_weight: 100,

    performance_bonus: {
      data_metrics: {
        personal_new_service_fee: { target: 150000, actual: 145000, completion_rate: 96.67, score: 19.33, weight: 20 },
        team_new_service_fee: { target: 800000, actual: 790000, completion_rate: 98.75, score: 19.75, weight: 20 },
        team_renewal_service_fee: { target: 300000, actual: 310000, completion_rate: 103.33, score: 20.67, weight: 20 }
      },
      process_management: {
        member_growth_balance: 6.0, sales_process_crm: 3.0, strategy_coaching: 6.5, team_visit_target: 8.5
      }
    },
    performance_bonus_score: 83.75,
    performance_bonus_weight: 100,

    total_score: 90,
    grade: 'B',
    rank_in_department: 7,
    rank_in_company: 16,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { process_management: 16 },
    comments: '学习能力强，执行力有待提升'
  },

  {
    id: 10,
    employee_id: 21,
    employee_name: '吴商务专员',
    employee_position: '商务专员',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    monthly_commission: {
      new_service_fee: { target: 120000, actual: 125000, completion_rate: 104.17, score: 104.17, weight: 50 },
      new_orders: { target: 5, actual: 6, completion_rate: 120, score: 120, weight: 50 }
    },
    monthly_commission_score: 112.09,
    monthly_commission_weight: 100,

    performance_bonus: {
      data_metrics: {
        personal_new_service_fee: { target: 120000, actual: 125000, completion_rate: 104.17, score: 20.83, weight: 20 },
        team_new_service_fee: { target: 700000, actual: 680000, completion_rate: 97.14, score: 19.43, weight: 20 },
        team_renewal_service_fee: { target: 250000, actual: 260000, completion_rate: 104, score: 20.8, weight: 20 }
      },
      process_management: {
        member_growth_balance: 7.2, sales_process_crm: 3.8, strategy_coaching: 7.5, team_visit_target: 11.5
      }
    },
    performance_bonus_score: 90.86,
    performance_bonus_weight: 100,

    total_score: 112.09,
    grade: 'A',
    rank_in_department: 8,
    rank_in_company: 5,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { process_management: 16 },
    comments: '商务谈判能力突出，客户满意度高'
  },

  {
    id: 11,
    employee_id: 22,
    employee_name: '郑市场开发',
    employee_position: '市场开发',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    monthly_commission: {
      new_service_fee: { target: 100000, actual: 95000, completion_rate: 95, score: 95, weight: 50 },
      new_orders: { target: 4, actual: 3, completion_rate: 75, score: 75, weight: 50 }
    },
    monthly_commission_score: 85,
    monthly_commission_weight: 100,

    performance_bonus: {
      data_metrics: {
        personal_new_service_fee: { target: 100000, actual: 95000, completion_rate: 95, score: 19.0, weight: 20 },
        team_new_service_fee: { target: 600000, actual: 610000, completion_rate: 101.67, score: 20.33, weight: 20 },
        team_renewal_service_fee: { target: 200000, actual: 190000, completion_rate: 95, score: 19.0, weight: 20 }
      },
      process_management: {
        member_growth_balance: 5.5, sales_process_crm: 2.8, strategy_coaching: 6.0, team_visit_target: 7.0
      }
    },
    performance_bonus_score: 79.63,
    performance_bonus_weight: 100,

    total_score: 85,
    grade: 'C',
    rank_in_department: 9,
    rank_in_company: 17,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { process_management: 16 },
    comments: '市场敏感度较好，需要加强销售技能'
  },

  {
    id: 12,
    employee_id: 23,
    employee_name: '韩销售实习生',
    employee_position: '销售实习生',
    department_id: 1,
    department_name: '销售部',
    department_type: 'sales',
    position_level: 'staff',
    period: '2024-01',
    period_type: 'monthly',

    monthly_commission: {
      new_service_fee: { target: 80000, actual: 75000, completion_rate: 93.75, score: 93.75, weight: 50 },
      new_orders: { target: 3, actual: 2, completion_rate: 66.67, score: 66.67, weight: 50 }
    },
    monthly_commission_score: 80.21,
    monthly_commission_weight: 100,

    performance_bonus: {
      data_metrics: {
        personal_new_service_fee: { target: 80000, actual: 75000, completion_rate: 93.75, score: 18.75, weight: 20 },
        team_new_service_fee: { target: 500000, actual: 520000, completion_rate: 104, score: 20.8, weight: 20 },
        team_renewal_service_fee: { target: 150000, actual: 145000, completion_rate: 96.67, score: 19.33, weight: 20 }
      },
      process_management: {
        member_growth_balance: 5.0, sales_process_crm: 2.5, strategy_coaching: 5.5, team_visit_target: 6.0
      }
    },
    performance_bonus_score: 77.88,
    performance_bonus_weight: 100,

    total_score: 80.21,
    grade: 'C',
    rank_in_department: 10,
    rank_in_company: 19,
    status: 'completed',
    created_at: '2024-02-01',
    updated_at: '2024-02-01',
    evaluators: { process_management: 17 },
    comments: '学习态度积极，基础技能需要加强'
  }
]

// ==================== 权限控制函数 ====================

// 获取用户可查看的员工ID列表
export function getEmployeesByRole(role: UserRole, userId: number): number[] {
  switch (role) {
    case 'general_manager':
      return [1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] // 查看所有员工
    case 'sales_director':
      return [1, 2, 16, 17, 18, 19, 20, 21, 22, 23] // 查看销售部门所有员工
    case 'sales_manager':
      return [2, 17, 18, 19, 20, 21, 22, 23] // 查看下属销售人员
    case 'project_director':
      return [6, 7, 8, 9, 10, 11, 12, 13, 14, 15] // 查看运营部门所有员工
    case 'project_manager':
      return [8, 9, 10, 11, 12, 13, 14, 15] // 查看下属运营人员
    default:
      return [userId] // 普通员工只能查看自己
  }
}

// 获取可设置目标的员工
export function getTargetSettableEmployees(role: UserRole, userId: number): number[] {
  switch (role) {
    case 'general_manager':
      return [1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
    case 'sales_director':
      return [1, 2, 16, 17, 18, 19, 20, 21, 22, 23]
    case 'sales_manager':
      return [2, 17, 18, 19, 20, 21, 22, 23]
    case 'project_director':
      return [6, 7, 8, 9, 10, 11, 12, 13, 14, 15]
    case 'project_manager':
      return [8, 9, 10, 11, 12, 13, 14, 15]
    default:
      return []
  }
}

// 获取可评分的员工（职能方案/过程管理指标）
export function getRatableEmployees(role: UserRole, userId: number): number[] {
  switch (role) {
    case 'general_manager':
      return [1, 2, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23] // 总经理可以给所有员工评分
    case 'sales_director':
      return [1, 16] // 可以给营销经理和销售主管评分（过程管理指标）
    case 'sales_manager':
      return [2, 17, 18, 19, 20, 21, 22, 23] // 可以给销售人员评分（过程管理指标）
    case 'project_director':
      return [6, 7] // 可以给项目经理评分（职能方案）
    case 'project_manager':
      return [8, 9, 10, 11, 12, 13, 14, 15] // 可以给项目成员评分（职能方案）
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

// 根据部门类型获取对应的绩效记录
export function getPerformanceRecordsByDepartment(departmentType: DepartmentType) {
  if (departmentType === 'operations') {
    return operationsPerformanceRecords
  } else {
    return salesPerformanceRecords
  }
}

// 根据员工信息获取对应的配置
export function getEmployeeConfigs(employeeId: number, departmentType: DepartmentType, positionLevel: PositionLevel) {
  if (departmentType === 'operations') {
    return {
      metrics: operationsMetricConfigs.filter(config =>
        config.department === departmentType && config.position_level === positionLevel
      ),
      functional: operationsFunctionalConfigs.find(config =>
        config.department === departmentType && config.position_level === positionLevel
      ),
      weights: operationsWeightConfigs.find(config =>
        config.department === departmentType && config.position_level === positionLevel
      )
    }
  } else {
    return {
      metrics: salesMetricConfigs.filter(config =>
        config.department === departmentType && config.position_level === positionLevel
      ),
      process: salesProcessConfigs.find(config =>
        config.department === departmentType && config.position_level === positionLevel
      ),
      weights: salesWeightConfigs.find(config =>
        config.department === departmentType && config.position_level === positionLevel
      )
    }
  }
}
