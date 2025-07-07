<template>
  <div class="theme-settings">
    <div class="page-header">
      <h1>主题设置</h1>
      <p>自定义您的界面主题和色彩方案</p>
    </div>

    <div class="settings-content">
      <!-- 主题模式 -->
      <div class="setting-section">
        <h3>主题模式</h3>
        <div class="theme-modes">
          <button
            v-for="mode in themeModes"
            :key="mode.value"
            class="theme-mode-btn"
            :class="{ 'theme-mode-btn--active': currentThemeMode === mode.value }"
            @click="handleThemeModeChange(mode.value)"
          >
            <component :is="mode.icon" :size="24" />
            <span>{{ mode.label }}</span>
          </button>
        </div>
      </div>

      <!-- 主题色彩 -->
      <div class="setting-section">
        <h3>主题色彩</h3>
        <div class="theme-colors">
          <button
            v-for="(color, name) in brandColors"
            :key="name"
            class="color-btn"
            :class="{ 'color-btn--active': currentThemeColor === name }"
            :style="{ backgroundColor: color }"
            @click="handleThemeColorChange(name)"
            :title="getColorName(name)"
          >
            <Check v-if="currentThemeColor === name" :size="16" />
          </button>
        </div>
      </div>

      <!-- 预览区域 -->
      <div class="setting-section">
        <h3>预览</h3>
        <div class="theme-preview">
          <div class="preview-card">
            <div class="preview-header">
              <h4>示例卡片</h4>
              <button class="preview-btn">按钮</button>
            </div>
            <div class="preview-content">
              <p>这是主要文本内容的示例。</p>
              <p class="preview-secondary">这是次要文本内容的示例。</p>
              <div class="preview-stats">
                <div class="stat">
                  <span class="stat-value">1,234</span>
                  <span class="stat-label">总数据</span>
                </div>
                <div class="stat stat--success">
                  <span class="stat-value">+12%</span>
                  <span class="stat-label">增长率</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Sun, Moon, Monitor, Check } from 'lucide-vue-next'
import { 
  themeMode, 
  themeColor, 
  setThemeMode, 
  setThemeColor, 
  customColors,
  type ThemeMode,
  type ThemeColor
} from '@/assets/theme'

// 主题模式选项
const themeModes = [
  { value: 'light' as ThemeMode, label: '浅色', icon: Sun },
  { value: 'dark' as ThemeMode, label: '深色', icon: Moon },
  { value: 'auto' as ThemeMode, label: '跟随系统', icon: Monitor }
]

// 计算属性
const currentThemeMode = computed(() => themeMode.value)
const currentThemeColor = computed(() => themeColor.value)
const brandColors = computed(() => customColors.brandColors)

// 方法
const handleThemeModeChange = (mode: ThemeMode) => {
  setThemeMode(mode)
}

const handleThemeColorChange = (color: ThemeColor) => {
  setThemeColor(color)
}

const getColorName = (colorKey: string): string => {
  const colorNames: Record<string, string> = {
    blue: '蓝色',
    green: '绿色',
    purple: '紫色',
    orange: '橙色',
    red: '红色',
    cyan: '青色',
    geekblue: '极客蓝',
    magenta: '品红'
  }
  return colorNames[colorKey] || colorKey
}
</script>

<style scoped>
.theme-settings {
  max-width: 800px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: var(--spacing-2xl);
}

.page-header h1 {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.page-header p {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

.settings-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-2xl);
}

.setting-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
}

.setting-section h3 {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-lg) 0;
}

.theme-modes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: var(--spacing-md);
}

.theme-mode-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--duration-fast);
  color: var(--color-text-primary);
}

.theme-mode-btn:hover {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
}

.theme-mode-btn--active {
  border-color: var(--color-primary);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.theme-mode-btn span {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.theme-colors {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
  gap: var(--spacing-md);
  max-width: 500px;
}

.color-btn {
  width: 60px;
  height: 60px;
  border: 3px solid transparent;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--duration-fast);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.color-btn:hover {
  transform: scale(1.1);
  box-shadow: var(--shadow-md);
}

.color-btn--active {
  border-color: var(--color-text-primary);
  box-shadow: var(--shadow-lg);
}

.theme-preview {
  background: var(--color-background);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
}

.preview-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  overflow: hidden;
}

.preview-header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border-light);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.preview-header h4 {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.preview-btn {
  padding: var(--spacing-xs) var(--spacing-md);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.preview-content {
  padding: var(--spacing-lg);
}

.preview-content p {
  margin: 0 0 var(--spacing-sm) 0;
}

.preview-secondary {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.preview-stats {
  display: flex;
  gap: var(--spacing-lg);
  margin-top: var(--spacing-md);
}

.stat {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.stat-value {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
}

.stat--success .stat-value {
  color: var(--color-success);
}

.stat-label {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .theme-modes {
    grid-template-columns: 1fr;
  }
  
  .theme-colors {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .preview-stats {
    flex-direction: column;
    gap: var(--spacing-md);
  }
}
</style>