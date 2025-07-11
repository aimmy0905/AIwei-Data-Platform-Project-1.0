<template>
  <div class="auth-layout" :data-theme="currentTheme">
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { themeMode, initTheme } from '@/assets/theme'

// 计算属性
const currentTheme = computed(() => themeMode.value)

// 生命周期
onMounted(() => {
  // 初始化主题
  initTheme()
})
</script>

<style scoped>
.auth-layout {
  min-height: 100vh;
  background: var(--color-background);
  transition: background-color var(--duration-normal);
}
</style>