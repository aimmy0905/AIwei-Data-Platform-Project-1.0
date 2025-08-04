import type { Department, Employee, PerformanceRecord, EmployeeGoal, GoalTemplate, DepartmentStats } from '@/types/departments'

// 部门数据
export const mockDepartments: Department[] = [
  {
    id: 1,
    name: '总经理办公室',
    code: 'CEO_OFFICE',
    parent_id: null,
    manager_id: 1,
    manager_name: '王总',
    description: '公司最高管理层，负责公司整体战略规划和重大决策',
    sort_order: 1,
    status: 'active',
    employee_count: 3,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 2,
    name: '销售部',
    code: 'SALES',
    parent_id: null,
    manager_id: 2,
    manager_name: '张经理',
    description: '负责公司产品销售、客户开发和维护',
    sort_order: 2,
    status: 'active',
    employee_count: 15,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 3,
    name: '销售一部',
    code: 'SALES_1',
    parent_id: 2,
    manager_id: 3, // 对应李主管
    manager_name: '李主管',
    description: '负责华东地区销售业务',
    sort_order: 1,
    status: 'active',
    employee_count: 3, // 实际员工数
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 4,
    name: '销售二部',
    code: 'SALES_2',
    parent_id: 2,
    manager_id: 4,
    manager_name: '王主管',
    description: '负责华南地区销售业务',
    sort_order: 2,
    status: 'active',
    employee_count: 7,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 5,
    name: '运营部',
    code: 'OPERATIONS',
    parent_id: null,
    manager_id: 5,
    manager_name: '刘经理',
    description: '负责客户服务、项目运营和数据分析',
    sort_order: 3,
    status: 'active',
    employee_count: 12,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 6,
    name: '运营一部',
    code: 'OPS_1',
    parent_id: 5,
    manager_id: 6,
    manager_name: '陈主管',
    description: '负责客户服务和项目执行',
    sort_order: 1,
    status: 'active',
    employee_count: 6,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 7,
    name: '运营二部',
    code: 'OPS_2',
    parent_id: 5,
    manager_id: 7,
    manager_name: '赵主管',
    description: '负责数据分析和运营优化',
    sort_order: 2,
    status: 'active',
    employee_count: 6,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 8,
    name: '技术部',
    code: 'TECH',
    parent_id: null,
    manager_id: 8,
    manager_name: '孙经理',
    description: '负责技术开发、系统维护和技术支持',
    sort_order: 4,
    status: 'active',
    employee_count: 10,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 9,
    name: '人事行政部',
    code: 'HR_ADMIN',
    parent_id: null,
    manager_id: 9,
    manager_name: '周经理',
    description: '负责人力资源管理、行政事务和企业文化建设',
    sort_order: 5,
    status: 'active',
    employee_count: 5,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 10,
    name: '财务部',
    code: 'FINANCE',
    parent_id: null,
    manager_id: 10,
    manager_name: '吴经理',
    description: '负责财务管理、成本控制和财务分析',
    sort_order: 6,
    status: 'active',
    employee_count: 4,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  }
]

// 员工数据
export const mockEmployees: Employee[] = [
  {
    id: 1,
    employee_id: 'CEO001',
    name: '王总',
    gender: 'male',
    birth_date: '1975-03-15',
    id_card: '310101197503150001',
    phone: '13800138001',
    email: 'ceo@aiwei.com',
    wechat: 'ceo_wang',
    department_id: 1,
    department_name: '总经理办公室',
    position: '总经理',
    hire_date: '2020-01-01',
    probation_months: 0,
    work_location: '上海总部',
    status: 'active',
    remarks: '公司创始人兼CEO',
    created_at: '2020-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 2,
    employee_id: 'SM001',
    name: '张经理',
    gender: 'male',
    birth_date: '1985-06-20',
    id_card: '310101198506200002',
    phone: '13800138002',
    email: 'zhang.manager@aiwei.com',
    department_id: 2,
    department_name: '销售部',
    position: '销售总监',
    supervisor_id: 1,
    supervisor_name: '王总',
    hire_date: '2020-03-01',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2020-03-01',
    updated_at: '2023-01-01'
  },
  {
    id: 3,
    employee_id: 'S001',
    name: '李主管',
    gender: 'female',
    birth_date: '1990-09-10',
    id_card: '310101199009100003',
    phone: '13800138003',
    email: 'li.supervisor@aiwei.com',
    department_id: 3,
    department_name: '销售一部',
    position: '销售主管',
    supervisor_id: 2,
    supervisor_name: '张经理',
    hire_date: '2021-01-15',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2021-01-15',
    updated_at: '2023-01-01'
  },
  {
    id: 4,
    employee_id: 'S002',
    name: '王主管',
    gender: 'male',
    birth_date: '1988-12-05',
    id_card: '310101198812050004',
    phone: '13800138004',
    email: 'wang.supervisor@aiwei.com',
    department_id: 4,
    department_name: '销售二部',
    position: '销售主管',
    supervisor_id: 2,
    supervisor_name: '张经理',
    hire_date: '2020-08-01',
    probation_months: 3,
    work_location: '深圳分部',
    status: 'active',
    created_at: '2020-08-01',
    updated_at: '2023-01-01'
  },
  {
    id: 5,
    employee_id: 'OM001',
    name: '刘经理',
    gender: 'female',
    birth_date: '1987-04-18',
    id_card: '310101198704180005',
    phone: '13800138005',
    email: 'liu.manager@aiwei.com',
    department_id: 5,
    department_name: '运营部',
    position: '运营总监',
    supervisor_id: 1,
    supervisor_name: '王总',
    hire_date: '2020-05-01',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2020-05-01',
    updated_at: '2023-01-01'
  },
  {
    id: 6,
    employee_id: 'O001',
    name: '陈主管',
    gender: 'female',
    birth_date: '1992-07-22',
    id_card: '310101199207220006',
    phone: '13800138006',
    email: 'chen.supervisor@aiwei.com',
    department_id: 6,
    department_name: '运营一部',
    position: '运营主管',
    supervisor_id: 5,
    supervisor_name: '刘经理',
    hire_date: '2021-03-01',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2021-03-01',
    updated_at: '2023-01-01'
  },
  {
    id: 7,
    employee_id: 'O002',
    name: '赵主管',
    gender: 'male',
    birth_date: '1989-11-30',
    id_card: '310101198911300007',
    phone: '13800138007',
    email: 'zhao.supervisor@aiwei.com',
    department_id: 7,
    department_name: '运营二部',
    position: '运营主管',
    supervisor_id: 5,
    supervisor_name: '刘经理',
    hire_date: '2020-10-01',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2020-10-01',
    updated_at: '2023-01-01'
  },
  {
    id: 8,
    employee_id: 'T001',
    name: '孙经理',
    gender: 'male',
    birth_date: '1983-02-14',
    id_card: '310101198302140008',
    phone: '13800138008',
    email: 'sun.manager@aiwei.com',
    department_id: 8,
    department_name: '技术部',
    position: '技术总监',
    supervisor_id: 1,
    supervisor_name: '王总',
    hire_date: '2020-02-01',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2020-02-01',
    updated_at: '2023-01-01'
  },
  {
    id: 9,
    employee_id: 'HR001',
    name: '周经理',
    gender: 'female',
    birth_date: '1986-08-25',
    id_card: '310101198608250009',
    phone: '13800138009',
    email: 'zhou.manager@aiwei.com',
    department_id: 9,
    department_name: '人事行政部',
    position: 'HR总监',
    supervisor_id: 1,
    supervisor_name: '王总',
    hire_date: '2020-04-01',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2020-04-01',
    updated_at: '2023-01-01'
  },
  {
    id: 10,
    employee_id: 'F001',
    name: '吴经理',
    gender: 'male',
    birth_date: '1984-01-08',
    id_card: '310101198401080010',
    phone: '13800138010',
    email: 'wu.manager@aiwei.com',
    department_id: 10,
    department_name: '财务部',
    position: '财务总监',
    supervisor_id: 1,
    supervisor_name: '王总',
    hire_date: '2020-06-01',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2020-06-01',
    updated_at: '2023-01-01'
  },
  {
    id: 11,
    employee_id: 'S101',
    name: '张小明',
    gender: 'male',
    birth_date: '1995-05-12',
    id_card: '310101199505120011',
    phone: '13800138011',
    email: 'zhang.xiaoming@aiwei.com',
    department_id: 3,
    department_name: '销售一部',
    position: '销售专员',
    supervisor_id: 3,
    supervisor_name: '李主管',
    hire_date: '2022-01-10',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2022-01-10',
    updated_at: '2023-01-01'
  },
  {
    id: 12,
    employee_id: 'S102',
    name: '李小红',
    gender: 'female',
    birth_date: '1993-09-18',
    id_card: '310101199309180012',
    phone: '13800138012',
    email: 'li.xiaohong@aiwei.com',
    department_id: 3,
    department_name: '销售一部',
    position: '销售专员',
    supervisor_id: 3,
    supervisor_name: '李主管',
    hire_date: '2021-08-15',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2021-08-15',
    updated_at: '2023-01-01'
  }
]

// 职位列表
export const mockPositions = [
  '总经理', '副总经理', '总监', '经理', '主管', '专员', '助理', '实习生'
]

// 绩效考核记录
export const mockPerformanceRecords: PerformanceRecord[] = [
  {
    id: 1,
    employee_id: 11,
    employee_name: '张小明',
    department_id: 3,
    department_name: '销售一部',
    period: '2023-07',
    period_type: 'monthly',
    evaluator_id: 3,
    evaluator_name: '李主管',
    data_metrics: {
      new_service_fee: {
        target: 500000,
        actual: 450000,
        score: 36,
        weight: 40
      },
      new_orders: {
        target: 100,
        actual: 95,
        score: 38,
        weight: 30
      },
      new_customers: {
        target: 20,
        actual: 18,
        score: 36,
        weight: 30
      }
    },
    customer_rating: {
      satisfaction: 8.5,
      service_quality: 9.0,
      response_speed: 8.0,
      total_score: 25.5
    },
    supervisor_rating: {
      work_attitude: 9,
      teamwork: 8,
      learning_ability: 9,
      innovation: 7,
      total_score: 24.75
    },
    total_score: 86.25,
    grade: 'good',
    rank_in_department: 3,
    improvement_suggestions: '需要提升新客户开发能力，加强与客户的沟通技巧',
    status: 'completed',
    created_at: '2023-08-01',
    updated_at: '2023-08-01'
  },
  {
    id: 2,
    employee_id: 12,
    employee_name: '李小红',
    department_id: 3,
    department_name: '销售一部',
    period: '2023-07',
    period_type: 'monthly',
    evaluator_id: 3,
    evaluator_name: '李主管',
    data_metrics: {
      new_service_fee: {
        target: 480000,
        actual: 520000,
        score: 43,
        weight: 40
      },
      new_orders: {
        target: 90,
        actual: 105,
        score: 35,
        weight: 30
      },
      new_customers: {
        target: 18,
        actual: 22,
        score: 37,
        weight: 30
      }
    },
    customer_rating: {
      satisfaction: 9.2,
      service_quality: 9.5,
      response_speed: 9.0,
      total_score: 27.6
    },
    supervisor_rating: {
      work_attitude: 9,
      teamwork: 9,
      learning_ability: 8,
      innovation: 8,
      total_score: 25.5
    },
    total_score: 93.1,
    grade: 'excellent',
    rank_in_department: 1,
    improvement_suggestions: '表现优秀，继续保持，可以考虑承担更多团队管理职责',
    status: 'completed',
    created_at: '2023-08-01',
    updated_at: '2023-08-01'
  }
]

// 员工目标设置
export const mockEmployeeGoals: EmployeeGoal[] = [
  {
    id: 1,
    employee_id: 11,
    employee_name: '张小明',
    department_id: 3,
    department_name: '销售一部',
    period: '2023-08',
    period_type: 'monthly',
    employee_type: 'sales',
    sales_goals: {
      new_service_fee: {
        target: 520000,
        weight: 40
      },
      new_orders: {
        target: 105,
        weight: 30
      },
      new_customers: {
        target: 22,
        weight: 30
      }
    },
    status: 'active',
    created_by: 3,
    created_by_name: '李主管',
    created_at: '2023-08-01',
    updated_at: '2023-08-01'
  },
  {
    id: 2,
    employee_id: 12,
    employee_name: '李小红',
    department_id: 3,
    department_name: '销售一部',
    period: '2023-08',
    period_type: 'monthly',
    employee_type: 'sales',
    sales_goals: {
      new_service_fee: {
        target: 500000,
        weight: 40
      },
      new_orders: {
        target: 100,
        weight: 30
      },
      new_customers: {
        target: 20,
        weight: 30
      }
    },
    status: 'active',
    created_by: 3,
    created_by_name: '李主管',
    created_at: '2023-08-01',
    updated_at: '2023-08-01'
  }
]

// 目标模板
export const mockGoalTemplates: GoalTemplate[] = [
  {
    id: 1,
    name: '销售经理模板',
    employee_type: 'sales',
    description: '适用于销售经理及以上级别的目标模板',
    template_data: {
      sales_goals: {
        new_service_fee: {
          target: 800000,
          weight: 40
        },
        new_orders: {
          target: 150,
          weight: 30
        },
        new_customers: {
          target: 30,
          weight: 30
        }
      }
    },
    usage_count: 15,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 2,
    name: '销售专员模板',
    employee_type: 'sales',
    description: '适用于销售专员的标准目标模板',
    template_data: {
      sales_goals: {
        new_service_fee: {
          target: 500000,
          weight: 40
        },
        new_orders: {
          target: 100,
          weight: 30
        },
        new_customers: {
          target: 20,
          weight: 30
        }
      }
    },
    usage_count: 25,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  },
  {
    id: 3,
    name: '运营专员模板',
    employee_type: 'operations',
    description: '适用于运营专员的标准目标模板',
    template_data: {
      operations_goals: {
        service_fee: {
          target: 300000,
          weight: 60
        },
        rebate: {
          target: 50000,
          weight: 40
        }
      }
    },
    usage_count: 18,
    created_at: '2023-01-01',
    updated_at: '2023-01-01'
  }
]

// 部门统计数据
export const mockDepartmentStats: DepartmentStats[] = [
  {
    department_id: 3,
    department_name: '销售一部',
    total_employees: 8,
    active_employees: 7,
    probation_employees: 1,
    average_performance: 89.5,
    top_performer: {
      employee_id: 12,
      employee_name: '李小红',
      score: 93.1
    },
    goals_completion_rate: 85.5,
    period: '2023-07'
  },
  {
    department_id: 4,
    department_name: '销售二部',
    total_employees: 7,
    active_employees: 6,
    probation_employees: 1,
    average_performance: 87.2,
    top_performer: {
      employee_id: 15,
      employee_name: '王小强',
      score: 91.8
    },
    goals_completion_rate: 82.3,
    period: '2023-07'
  },
  {
    department_id: 6,
    department_name: '运营一部',
    total_employees: 6,
    active_employees: 6,
    probation_employees: 0,
    average_performance: 85.8,
    top_performer: {
      employee_id: 18,
      employee_name: '陈小美',
      score: 88.9
    },
    goals_completion_rate: 78.6,
    period: '2023-07'
  }
]

// 添加更多员工数据
export const additionalEmployees: Employee[] = [
  {
    id: 13,
    employee_id: 'S103',
    name: '王小强',
    gender: 'male',
    birth_date: '1994-03-25',
    id_card: '310101199403250013',
    phone: '13800138013',
    email: 'wang.xiaoqiang@aiwei.com',
    department_id: 4,
    department_name: '销售二部',
    position: '销售专员',
    supervisor_id: 4,
    supervisor_name: '王主管',
    hire_date: '2022-03-01',
    probation_months: 3,
    work_location: '深圳分部',
    status: 'active',
    created_at: '2022-03-01',
    updated_at: '2023-01-01'
  },
  {
    id: 14,
    employee_id: 'S104',
    name: '刘小丽',
    gender: 'female',
    birth_date: '1996-08-12',
    id_card: '310101199608120014',
    phone: '13800138014',
    email: 'liu.xiaoli@aiwei.com',
    department_id: 4,
    department_name: '销售二部',
    position: '销售专员',
    supervisor_id: 4,
    supervisor_name: '王主管',
    hire_date: '2023-01-15',
    probation_months: 3,
    work_location: '深圳分部',
    status: 'probation',
    created_at: '2023-01-15',
    updated_at: '2023-01-15'
  },
  {
    id: 15,
    employee_id: 'O101',
    name: '陈小美',
    gender: 'female',
    birth_date: '1993-11-08',
    id_card: '310101199311080015',
    phone: '13800138015',
    email: 'chen.xiaomei@aiwei.com',
    department_id: 6,
    department_name: '运营一部',
    position: '运营专员',
    supervisor_id: 6,
    supervisor_name: '陈主管',
    hire_date: '2021-06-01',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2021-06-01',
    updated_at: '2023-01-01'
  },
  {
    id: 16,
    employee_id: 'O102',
    name: '张小华',
    gender: 'male',
    birth_date: '1995-02-14',
    id_card: '310101199502140016',
    phone: '13800138016',
    email: 'zhang.xiaohua@aiwei.com',
    department_id: 7,
    department_name: '运营二部',
    position: '数据分析师',
    supervisor_id: 7,
    supervisor_name: '赵主管',
    hire_date: '2022-09-01',
    probation_months: 3,
    work_location: '上海总部',
    status: 'active',
    created_at: '2022-09-01',
    updated_at: '2023-01-01'
  }
]

// 合并所有员工数据
export const allEmployees = [...mockEmployees, ...additionalEmployees]

// 添加更多绩效记录
export const additionalPerformanceRecords: PerformanceRecord[] = [
  {
    id: 3,
    employee_id: 13,
    employee_name: '王小强',
    department_id: 4,
    department_name: '销售二部',
    period: '2023-07',
    period_type: 'monthly',
    evaluator_id: 4,
    evaluator_name: '王主管',
    data_metrics: {
      new_service_fee: {
        target: 480000,
        actual: 510000,
        score: 42,
        weight: 40
      },
      new_orders: {
        target: 95,
        actual: 98,
        score: 31,
        weight: 30
      },
      new_customers: {
        target: 19,
        actual: 21,
        score: 33,
        weight: 30
      }
    },
    customer_rating: {
      satisfaction: 8.8,
      service_quality: 9.2,
      response_speed: 8.5,
      total_score: 26.5
    },
    supervisor_rating: {
      work_attitude: 8,
      teamwork: 9,
      learning_ability: 8,
      innovation: 8,
      total_score: 24.75
    },
    total_score: 91.8,
    grade: 'excellent',
    rank_in_department: 2,
    improvement_suggestions: '表现优秀，建议加强创新思维，可以尝试开拓新的销售渠道',
    status: 'completed',
    created_at: '2023-08-01',
    updated_at: '2023-08-01'
  },
  {
    id: 4,
    employee_id: 15,
    employee_name: '陈小美',
    department_id: 6,
    department_name: '运营一部',
    period: '2023-07',
    period_type: 'monthly',
    evaluator_id: 6,
    evaluator_name: '陈主管',
    data_metrics: {
      new_service_fee: {
        target: 0,
        actual: 0,
        score: 0,
        weight: 0
      },
      new_orders: {
        target: 0,
        actual: 0,
        score: 0,
        weight: 0
      },
      new_customers: {
        target: 0,
        actual: 0,
        score: 0,
        weight: 0
      },
      service_fee: {
        target: 300000,
        actual: 285000,
        score: 34,
        weight: 60
      },
      rebate: {
        target: 50000,
        actual: 48000,
        score: 15,
        weight: 40
      }
    },
    customer_rating: {
      satisfaction: 9.0,
      service_quality: 8.8,
      response_speed: 9.2,
      total_score: 27.0
    },
    supervisor_rating: {
      work_attitude: 9,
      teamwork: 8,
      learning_ability: 9,
      innovation: 7,
      total_score: 24.75
    },
    total_score: 88.9,
    grade: 'good',
    rank_in_department: 1,
    improvement_suggestions: '工作认真负责，建议提升创新能力，多思考流程优化方案',
    status: 'completed',
    created_at: '2023-08-01',
    updated_at: '2023-08-01'
  }
]

// 合并所有绩效记录
export const allPerformanceRecords = [...mockPerformanceRecords, ...additionalPerformanceRecords]

// 添加更多目标设置
export const additionalEmployeeGoals: EmployeeGoal[] = [
  {
    id: 3,
    employee_id: 13,
    employee_name: '王小强',
    department_id: 4,
    department_name: '销售二部',
    period: '2023-08',
    period_type: 'monthly',
    employee_type: 'sales',
    sales_goals: {
      new_service_fee: {
        target: 530000,
        weight: 40
      },
      new_orders: {
        target: 110,
        weight: 30
      },
      new_customers: {
        target: 25,
        weight: 30
      }
    },
    status: 'active',
    created_by: 4,
    created_by_name: '王主管',
    created_at: '2023-08-01',
    updated_at: '2023-08-01'
  },
  {
    id: 4,
    employee_id: 15,
    employee_name: '陈小美',
    department_id: 6,
    department_name: '运营一部',
    period: '2023-08',
    period_type: 'monthly',
    employee_type: 'operations',
    operations_goals: {
      service_fee: {
        target: 320000,
        weight: 60
      },
      rebate: {
        target: 55000,
        weight: 40
      }
    },
    status: 'active',
    created_by: 6,
    created_by_name: '陈主管',
    created_at: '2023-08-01',
    updated_at: '2023-08-01'
  },
  {
    id: 5,
    employee_id: 16,
    employee_name: '张小华',
    department_id: 7,
    department_name: '运营二部',
    period: '2023-Q3',
    period_type: 'quarterly',
    employee_type: 'operations',
    operations_goals: {
      service_fee: {
        target: 900000,
        weight: 60
      },
      rebate: {
        target: 150000,
        weight: 40
      }
    },
    status: 'active',
    created_by: 7,
    created_by_name: '赵主管',
    created_at: '2023-07-01',
    updated_at: '2023-07-01'
  }
]

// 合并所有目标设置
export const allEmployeeGoals = [...mockEmployeeGoals, ...additionalEmployeeGoals]

// 部门树形结构构建函数
export function buildDepartmentTree(departments: Department[]): Department[] {
  const departmentMap = new Map<number, Department>()
  const rootDepartments: Department[] = []

  // 创建部门映射
  departments.forEach(dept => {
    departmentMap.set(dept.id, { ...dept, children: [] })
  })

  // 构建树形结构
  departments.forEach(dept => {
    const department = departmentMap.get(dept.id)!
    if (dept.parent_id === null) {
      rootDepartments.push(department)
    } else {
      const parent = departmentMap.get(dept.parent_id)
      if (parent) {
        parent.children!.push(department)
      }
    }
  })

  return rootDepartments
}

// 获取部门及其所有子部门的ID列表
export function getDepartmentAndChildrenIds(departmentId: number, departments: Department[]): number[] {
  const result: number[] = [departmentId]
  const children = departments.filter(dept => dept.parent_id === departmentId)

  children.forEach(child => {
    result.push(...getDepartmentAndChildrenIds(child.id, departments))
  })

  return result
}
