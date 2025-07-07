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
}

// 渠道数据类型
export interface Channel {
  id: number
  name: string
  type: 'google' | 'facebook' | 'direct' | 'email' | 'criteo' | 'bing'
  revenue: number
  users: number
  sessions: number
  conversionRate: number
  cost: number
  roi: number
}

// 网站数据类型
export interface WebsiteData {
  totalSales: number
  totalCost: number
  roi: number
  orders: number
  averageOrderValue: number
  conversionRate: number
  visitors: number
  newUsers: number
  returningUsers: number
  bounceRate: number
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