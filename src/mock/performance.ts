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

// 智能方案考核配置
export const intelligentAssessmentConfigs: IntelligentAssessmentConfig[] = [
  // 运营部门 - 项目经理（由项目总监评价）
  {
    id: 'ops_manager_assessment',
    department: 'operations',
    position_level: 'manager',
    evaluator_role: 'project_director',
    weight: 100,
    items: [
      {
        id: 'team_management',
        name: '团队成员管理能力',
        description: '对团队成员的管理、指导和激励能力',
        max_score: 20
      },
      {
        id: 'customer_evaluation_management',
        name: '组内客户评价管理',
        description: '客户关系维护和客户满意度管理能力',
        max_score: 20
      },
      {
        id: 'knowledge_output',
        name: '知识沉淀及输出质量',
        description: '工作经验总结和知识分享的质量',
        max_score: 20
      },
      {
        id: 'talent_development',
        name: '培养及输出新人能力',
        description: '新员工培训和人才培养的效果',
        max_score: 20
      },
      {
        id: 'cross_team_cooperation',
        name: '跨团队协助及合作表现',
        description: '与其他团队协作和支持的表现',
        max_score: 20
      }
    ]
  },

  // 运营部门 - 普通员工（由项目经理评价）
  {
    id: 'ops_staff_assessment',
    department: 'operations',
    position_level: 'staff',
    evaluator_role: 'project_manager',
    weight: 100,
    items: [
      {
        id: 'customer_service',
        name: '客户服务能力',
        description: '客户沟通和服务质量',
        max_score: 20
      },
      {
        id: 'work_quality',
        name: '专业工作质量',
        description: '工作成果的专业性和质量',
        max_score: 20
      },
      {
        id: 'communication_cooperation',
        name: '沟通与协助能力',
        description: '团队内外沟通协作能力',
        max_score: 20
      },
      {
        id: 'work_initiative',
        name: '工作积极性及执行力',
        description: '工作主动性和任务执行效率',
        max_score: 20
      },
      {
        id: 'growth_contribution',
        name: '成长与贡献表现',
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

// 权重配置
export const weightConfigs: WeightConfig[] = [
  // 运营部门 - 普通员工
  {
    department: 'operations',
    position_level: 'staff',
    data_weight: 40,
    customer_weight: 30,
    intelligent_weight: 30
  },

  // 运营部门 - 项目经理
  {
    department: 'operations',
    position_level: 'manager',
    data_weight: 50,
    customer_weight: 25,
    intelligent_weight: 25
  },

  // 销售部门 - 销售人员
  {
    department: 'sales',
    position_level: 'staff',
    data_weight: 70,
    customer_weight: 0,
    intelligent_weight: 30
  },

  // 销售部门 - 销售经理
  {
    department: 'sales',
    position_level: 'manager',
    data_weight: 65,
    customer_weight: 0,
    intelligent_weight: 35
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
      team_growth_balance: 22,
      process_compliance: 20,
      strategy_coaching: 23,
      visit_target_completion: 21
    },
    intelligent_score: 86,
    intelligent_weight: 35,

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
    data_weight: 70,

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
    intelligent_weight: 30,

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
