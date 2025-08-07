<script setup lang="ts">
import { RouterView } from 'vue-router'
import { StagewiseToolbar } from '@stagewise/toolbar-vue'
import VuePlugin from '@stagewise-plugins/vue'

// 只在开发环境显示 Stagewise 工具栏
const isDevelopment = import.meta.env.DEV
</script>

<template>
  <!-- Stagewise 工具栏 - 只在开发环境显示 -->
  <StagewiseToolbar
    v-if="isDevelopment"
    :config="{
      plugins: [VuePlugin]
    }"
  />
  <RouterView />
</template>

<style>
/* 全局样式重置和基础样式 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  font-size: 16px;
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
  background: var(--color-background);
  color: var(--color-text-primary);
  transition: background-color var(--duration-normal), color var(--duration-normal);
}

#app {
  min-height: 100vh;
}

/* 全局链接样式 */
a {
  color: inherit;
  text-decoration: none;
}

/* 全局按钮样式重置 */
button {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
  border: none;
  background: none;
  cursor: pointer;
}

/* 全局输入框样式重置 */
input, textarea, select {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

::-webkit-scrollbar-track {
  background: var(--color-background);
}

::-webkit-scrollbar-thumb {
  background: var(--color-border);
  border-radius: var(--border-radius-sm);
}

::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-secondary);
}

/* 选择文本样式 */
::selection {
  background: var(--color-primary-light);
}

/* 焦点样式 */
:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* 禁用状态样式 */
:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* 工具类 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

.text-center {
  text-align: center;
}

.text-left {
  text-align: left;
}

.text-right {
  text-align: right;
}

.hidden {
  display: none;
}

.flex {
  display: flex;
}

.flex-center {
  display: flex;
  align-items: center;
  justify-content: center;
}

.grid {
  display: grid;
}

/* 响应式工具类 */
@media (max-width: 768px) {
  .hidden-mobile {
    display: none;
  }
}

@media (min-width: 769px) {
  .hidden-desktop {
    display: none;
  }
}
</style>
