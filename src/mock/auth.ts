import type { User, LoginForm, ApiResponse } from '@/types'

// Mock用户数据
export const mockUsers: User[] = [
  {
    id: 1,
    username: 'admin',
    email: 'admin@aiwei.com',
    phone: '138****1234',
    role: 'superAdmin',
    department: '管理层',
    avatar: '/avatars/admin.svg',
    lastLoginTime: '2025-01-07 14:30:00',
    status: 'active'
  },
  {
    id: 2,
    username: 'manager',
    email: 'manager@aiwei.com',
    phone: '139****5678',
    role: 'manager',
    department: '运营部',
    avatar: '/avatars/manager.svg',
    lastLoginTime: '2025-01-07 09:15:00',
    status: 'active'
  },
  {
    id: 3,
    username: 'staff',
    email: 'staff@aiwei.com',
    phone: '136****9012',
    role: 'staff',
    department: '销售部',
    avatar: '/avatars/staff.svg',
    lastLoginTime: '2025-01-06 18:20:00',
    status: 'active'
  },
  {
    id: 4,
    username: 'finance',
    email: 'finance@aiwei.com',
    phone: '137****3456',
    role: 'finance',
    department: '财务部',
    avatar: '/avatars/finance.svg',
    lastLoginTime: '2025-01-06 16:45:00',
    status: 'active'
  },
  {
    id: 5,
    username: 'sales',
    email: 'sales@aiwei.com',
    phone: '135****7890',
    role: 'sales',
    department: '销售部',
    avatar: '/avatars/staff.svg',
    lastLoginTime: '2025-01-05 20:10:00',
    status: 'active'
  }
]

// Mock登录失败次数记录
const loginAttempts = new Map<string, { count: number; lockTime?: number }>()

// 模拟登录API
export const mockLogin = (form: LoginForm): Promise<ApiResponse<{ user: User; token: string }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const { username, password } = form

      // 检查账号锁定状态
      const attempt = loginAttempts.get(username)
      if (attempt && attempt.lockTime && Date.now() < attempt.lockTime) {
        resolve({
          success: false,
          message: '账号已被锁定，请30分钟后重试',
          code: 423
        })
        return
      }

      // 验证用户名密码
      const user = mockUsers.find(u => u.username === username)
      if (!user || !validatePassword(username, password)) {
        // 记录失败次数
        const current = loginAttempts.get(username) || { count: 0 }
        current.count++

        if (current.count >= 5) {
          // 锁定30分钟
          current.lockTime = Date.now() + 30 * 60 * 1000
          loginAttempts.set(username, current)
          resolve({
            success: false,
            message: '登录失败次数过多，账号已被锁定30分钟',
            code: 423
          })
        } else {
          loginAttempts.set(username, current)
          resolve({
            success: false,
            message: `用户名或密码错误，还可尝试 ${5 - current.count} 次`,
            code: 401
          })
        }
        return
      }

      // 登录成功，清除失败记录
      loginAttempts.delete(username)

      // 生成mock token
      const token = `mock_token_${user.id}_${Date.now()}`

      resolve({
        success: true,
        data: {
          user: {
            ...user,
            lastLoginTime: new Date().toLocaleString('zh-CN')
          },
          token
        },
        message: '登录成功'
      })
    }, 1000) // 模拟网络延迟
  })
}

// 验证密码（演示用）
const validatePassword = (username: string, password: string): boolean => {
  const passwordMap: Record<string, string> = {
    admin: 'admin123',
    manager: 'manager123',
    staff: 'staff123',
    finance: 'finance123',
    sales: 'sales123'
  }
  return passwordMap[username] === password
}

// 模拟忘记密码API
export const mockForgotPassword = (username: string): Promise<ApiResponse<{ method: string; target: string }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const user = mockUsers.find(u => u.username === username)
      if (!user) {
        resolve({
          success: false,
          message: '账号不存在，请检查后重新输入',
          code: 404
        })
        return
      }

      // 模拟发送验证码
      const method = user.phone ? 'sms' : 'email'
      const target = user.phone ?
        user.phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') :
        user.email?.replace(/(\w{2})\w+(@\w+)/, '$1****$2')

      resolve({
        success: true,
        data: {
          method,
          target: target || ''
        },
        message: `验证码已发送至您的${method === 'sms' ? '手机' : '邮箱'}`
      })
    }, 1500)
  })
}

// 模拟验证码验证API
export const mockVerifyCode = (username: string, code: string): Promise<ApiResponse<{ resetToken: string }>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 模拟验证码验证（演示用固定验证码：123456）
      if (code !== '123456') {
        resolve({
          success: false,
          message: '验证码错误，请重新输入',
          code: 400
        })
        return
      }

      resolve({
        success: true,
        data: {
          resetToken: `reset_token_${username}_${Date.now()}`
        },
        message: '验证码验证成功'
      })
    }, 800)
  })
}

// 模拟重置密码API
export const mockResetPassword = (resetToken: string, newPassword: string): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 简单的密码强度检查
      if (newPassword.length < 8 || newPassword.length > 20) {
        resolve({
          success: false,
          message: '密码长度应为8-20个字符',
          code: 400
        })
        return
      }

      if (!/(?=.*[a-zA-Z])(?=.*\d)/.test(newPassword)) {
        resolve({
          success: false,
          message: '密码必须包含字母和数字',
          code: 400
        })
        return
      }

      resolve({
        success: true,
        message: '密码重置成功，请使用新密码登录'
      })
    }, 1000)
  })
}

// 模拟获取用户信息API
export const mockGetUserInfo = (token: string): Promise<ApiResponse<User>> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // 从token中解析用户ID（演示用）
      const userId = parseInt(token.split('_')[2])
      const user = mockUsers.find(u => u.id === userId)

      if (!user) {
        resolve({
          success: false,
          message: '用户不存在或token无效',
          code: 401
        })
        return
      }

      resolve({
        success: true,
        data: user
      })
    }, 500)
  })
}

// 模拟退出登录API
export const mockLogout = (): Promise<ApiResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message: '退出成功'
      })
    }, 300)
  })
}
