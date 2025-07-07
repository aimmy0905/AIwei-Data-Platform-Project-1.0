export interface ColorScheme {
  primary: string
  primaryHover: string
  primaryActive: string
  secondary: string
  success: string
  warning: string
  error: string
  info: string
  textPrimary: string
  textSecondary: string
  textDisabled: string
  background: string
  surface: string
  border: string
  borderLight: string
  shadow: string
}

// 浅色主题
export const lightTheme: ColorScheme = {
  primary: '#1890ff',
  primaryHover: '#40a9ff',
  primaryActive: '#096dd9',
  secondary: '#f5f5f5',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  info: '#1890ff',
  textPrimary: '#262626',
  textSecondary: '#8c8c8c',
  textDisabled: '#bfbfbf',
  background: '#f5f5f5',
  surface: '#ffffff',
  border: '#d9d9d9',
  borderLight: '#f0f0f0',
  shadow: 'rgba(0, 0, 0, 0.1)'
}

// 深色主题
export const darkTheme: ColorScheme = {
  primary: '#1890ff',
  primaryHover: '#40a9ff',
  primaryActive: '#096dd9',
  secondary: '#1f1f1f',
  success: '#52c41a',
  warning: '#faad14',
  error: '#f5222d',
  info: '#1890ff',
  textPrimary: '#ffffff',
  textSecondary: '#a6a6a6',
  textDisabled: '#595959',
  background: '#141414',
  surface: '#1f1f1f',
  border: '#303030',
  borderLight: '#262626',
  shadow: 'rgba(0, 0, 0, 0.3)'
}

// 自定义主题色彩
export const customColors = {
  // 品牌色选项
  brandColors: {
    blue: '#1890ff',
    green: '#52c41a',
    purple: '#722ed1',
    orange: '#fa8c16',
    red: '#f5222d',
    cyan: '#13c2c2',
    geekblue: '#2f54eb',
    magenta: '#eb2f96'
  },
  
  // 灰度色阶
  gray: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#f0f0f0',
    300: '#d9d9d9',
    400: '#bfbfbf',
    500: '#8c8c8c',
    600: '#595959',
    700: '#434343',
    800: '#262626',
    900: '#1f1f1f'
  }
}