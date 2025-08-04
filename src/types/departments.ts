// 部门管理相关类型定义

// 部门信息
export interface Department {
  id: number
  name: string
  code: string
  parent_id: number | null
  manager_id: number | null
  manager_name?: string
  description: string
  sort_order: number
  status: 'active' | 'inactive'
  employee_count: number
  created_at: string
  updated_at: string
  children?: Department[]
}

// 员工信息
export interface Employee {
  id: number
  employee_id: string // 工号
  name: string
  gender: 'male' | 'female'
  birth_date: string
  id_card: string
  phone: string
  email: string
  wechat?: string
  qq?: string
  address?: string
  emergency_contact?: string
  emergency_phone?: string
  department_id: number
  department_name: string
  position: string
  supervisor_id?: number
  supervisor_name?: string
  hire_date: string
  probation_months: number
  work_location: string
  status: 'active' | 'probation' | 'inactive' | 'resigned'
  remarks?: string
  created_at: string
  updated_at: string
}

// 绩效考核记录
export interface PerformanceRecord {
  id: number
  employee_id: number
  employee_name: string
  department_id: number
  department_name: string
  period: string // 考核周期，如 "2023-07"
  period_type: 'monthly' | 'quarterly' | 'yearly'
  evaluator_id: number
  evaluator_name: string

  // 数据指标评分 (40分)
  data_metrics: {
    new_service_fee: {
      target: number
      actual: number
      score: number
      weight: number
    }
    new_orders: {
      target: number
      actual: number
      score: number
      weight: number
    }
    new_customers: {
      target: number
      actual: number
      score: number
      weight: number
    }
    service_fee?: {
      target: number
      actual: number
      score: number
      weight: number
    }
    rebate?: {
      target: number
      actual: number
      score: number
      weight: number
    }
  }

  // 客户评分 (30分)
  customer_rating: {
    satisfaction: number // 客户满意度
    service_quality: number // 服务质量
    response_speed: number // 响应速度
    total_score: number
  }

  // 上级评分 (30分)
  supervisor_rating: {
    work_attitude: number // 工作态度
    teamwork: number // 团队协作
    learning_ability: number // 学习能力
    innovation: number // 创新能力
    total_score: number
  }

  total_score: number
  grade: 'excellent' | 'good' | 'average' | 'poor' // 优秀、良好、一般、较差
  rank_in_department: number
  improvement_suggestions: string
  status: 'draft' | 'completed' | 'approved'
  created_at: string
  updated_at: string
}

// 员工目标设置
export interface EmployeeGoal {
  id: number
  employee_id: number
  employee_name: string
  department_id: number
  department_name: string
  period: string
  period_type: 'monthly' | 'quarterly' | 'yearly'
  employee_type: 'sales' | 'operations'

  // 销售目标
  sales_goals?: {
    new_service_fee: {
      target: number
      weight: number
    }
    new_orders: {
      target: number
      weight: number
    }
    new_customers: {
      target: number
      weight: number
    }
  }

  // 运营目标
  operations_goals?: {
    service_fee: {
      target: number
      weight: number
    }
    rebate: {
      target: number
      weight: number
    }
  }

  status: 'active' | 'completed' | 'cancelled'
  created_by: number
  created_by_name: string
  created_at: string
  updated_at: string
}

// 目标模板
export interface GoalTemplate {
  id: number
  name: string
  employee_type: 'sales' | 'operations'
  description: string
  template_data: {
    sales_goals?: EmployeeGoal['sales_goals']
    operations_goals?: EmployeeGoal['operations_goals']
  }
  usage_count: number
  created_at: string
  updated_at: string
}

// 部门统计数据
export interface DepartmentStats {
  department_id: number
  department_name: string
  total_employees: number
  active_employees: number
  probation_employees: number
  average_performance: number
  top_performer: {
    employee_id: number
    employee_name: string
    score: number
  }
  goals_completion_rate: number
  period: string
}

// 新的绩效管理系统类型定义

// 用户角色类型
export type UserRole = 'general_manager' | 'sales_director' | 'sales_manager' | 'project_director' | 'project_manager' | 'sales_staff' | 'operations_staff'

// 考核周期类型
export type PeriodType = 'monthly' | 'quarterly' | 'yearly'

// 部门类型
export type DepartmentType = 'sales' | 'operations'

// 职级类型
export type PositionLevel = 'staff' | 'manager' | 'director' | 'general_manager'

// 数据指标配置
export interface MetricConfig {
  id: string
  name: string
  department: DepartmentType
  position_level: PositionLevel
  period_type: PeriodType
  weight: number // 权重百分比
  target_field: string
  unit: string
  description: string
}

// 智能方案考核项目
export interface IntelligentAssessmentItem {
  id: string
  name: string
  description: string
  max_score: number
}

// 智能方案考核配置
export interface IntelligentAssessmentConfig {
  id: string
  department: DepartmentType
  position_level: PositionLevel
  evaluator_role: UserRole
  items: IntelligentAssessmentItem[]
  weight: number // 权重百分比
}

// 权重配置
export interface WeightConfig {
  department: DepartmentType
  position_level: PositionLevel
  data_weight: number // 数据指标权重
  customer_weight: number // 客户评价权重
  intelligent_weight: number // 智能方案考核权重
}

// 绩效目标设置
export interface PerformanceTarget {
  id: number
  employee_id: number
  period: string
  period_type: PeriodType
  metrics: Record<string, number> // 各项指标的目标值
  created_by: number
  created_at: string
  updated_at: string
}

// 绩效评分记录
export interface PerformanceRating {
  id: number
  employee_id: number
  period: string
  period_type: PeriodType
  rater_id: number
  rater_role: UserRole
  assessment_type: 'customer' | 'intelligent'
  scores: Record<string, number>
  total_score: number
  comments?: string
  created_at: string
  updated_at: string
}

// 新的完整绩效记录
export interface NewPerformanceRecord {
  id: number
  employee_id: number
  employee_name: string
  employee_position: string
  department_id: number
  department_name: string
  department_type: DepartmentType
  position_level: PositionLevel
  period: string
  period_type: PeriodType

  // 数据指标得分
  data_metrics: {
    [key: string]: {
      target: number
      actual: number
      completion_rate: number
      score: number
      weight: number
    }
  }
  data_score: number
  data_weight: number

  // 客户评价得分
  customer_ratings: {
    [key: string]: number
  }
  customer_score: number
  customer_weight: number

  // 智能方案考核得分
  intelligent_ratings: {
    [key: string]: number
  }
  intelligent_score: number
  intelligent_weight: number

  // 综合得分
  total_score: number
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  rank_in_department: number
  rank_in_company: number

  // 状态和时间
  status: 'draft' | 'in_progress' | 'completed' | 'approved'
  created_at: string
  updated_at: string

  // 评价人信息
  evaluators: {
    customer?: number[]
    intelligent?: number
  }

  // 备注
  comments?: string
}
