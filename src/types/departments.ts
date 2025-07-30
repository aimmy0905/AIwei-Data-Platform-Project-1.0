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
  avatar?: string
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
