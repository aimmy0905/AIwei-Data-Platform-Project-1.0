import { ref, watch } from 'vue'
import { lightTheme, darkTheme, customColors, type ColorScheme } from './colors'

export type ThemeMode = 'light' | 'dark' | 'auto'
export type ThemeColor = keyof typeof customColors.brandColors

// 主题状态
export const themeMode = ref<ThemeMode>('light')
export const themeColor = ref<ThemeColor>('blue')
export const currentColors = ref<ColorScheme>(lightTheme)

// 本地存储键名
const THEME_MODE_KEY = 'aiwei-theme-mode'
const THEME_COLOR_KEY = 'aiwei-theme-color'

// 初始化主题
export const initTheme = () => {
  // 从本地存储读取主题设置
  const savedMode = localStorage.getItem(THEME_MODE_KEY) as ThemeMode
  const savedColor = localStorage.getItem(THEME_COLOR_KEY) as ThemeColor
  
  if (savedMode) {
    themeMode.value = savedMode
  }
  if (savedColor) {
    themeColor.value = savedColor
  }
  
  // 应用主题
  applyTheme()
  
  // 监听系统主题变化
  if (themeMode.value === 'auto') {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    mediaQuery.addEventListener('change', handleSystemThemeChange)
  }
}

// 切换主题模式
export const setThemeMode = (mode: ThemeMode) => {
  themeMode.value = mode
  localStorage.setItem(THEME_MODE_KEY, mode)
  applyTheme()
}

// 切换主题色彩
export const setThemeColor = (color: ThemeColor) => {
  themeColor.value = color
  localStorage.setItem(THEME_COLOR_KEY, color)
  applyTheme()
}

// 应用主题
const applyTheme = () => {
  const isDark = getActualThemeMode() === 'dark'
  const colors = isDark ? darkTheme : lightTheme
  
  // 更新当前颜色方案
  currentColors.value = {
    ...colors,
    primary: customColors.brandColors[themeColor.value],
    primaryHover: lightenColor(customColors.brandColors[themeColor.value], 20),
    primaryActive: darkenColor(customColors.brandColors[themeColor.value], 20)
  }
  
  // 设置CSS变量
  const root = document.documentElement
  root.setAttribute('data-theme', isDark ? 'dark' : 'light')
  root.setAttribute('data-theme-color', themeColor.value)
  
  // 更新CSS变量
  Object.entries(currentColors.value).forEach(([key, value]) => {
    const cssVar = key.replace(/([A-Z])/g, '-$1').toLowerCase()
    root.style.setProperty(`--color-${cssVar}`, value)
  })
}

// 获取实际主题模式
const getActualThemeMode = (): 'light' | 'dark' => {
  if (themeMode.value === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  }
  return themeMode.value
}

// 处理系统主题变化
const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  if (themeMode.value === 'auto') {
    applyTheme()
  }
}

// 颜色工具函数
const lightenColor = (color: string, percent: number): string => {
  // 简化的颜色变亮函数
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16)
    .slice(1)
}

const darkenColor = (color: string, percent: number): string => {
  // 简化的颜色变暗函数
  const num = parseInt(color.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) - amt
  const G = (num >> 8 & 0x00FF) - amt
  const B = (num & 0x0000FF) - amt
  
  return '#' + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
    (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
    (B > 255 ? 255 : B < 0 ? 0 : B))
    .toString(16)
    .slice(1)
}

// 导出主题相关内容
export { lightTheme, darkTheme, customColors }
export type { ColorScheme }