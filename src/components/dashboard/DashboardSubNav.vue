<template>
  <div class="dashboard-sub-nav" :class="{ 'dashboard-sub-nav--sticky': isSticky }">
    <div class="sub-nav-container">
      <div class="sub-nav-content">
        <!-- 左侧标题 -->
        <div class="sub-nav-title">
          <BarChart3 :size="20" />
          <span>数据看板</span>
        </div>

        <!-- 导航菜单 -->
        <nav class="sub-nav-menu">
          <div class="sub-nav-scroll">
            <button
              v-for="section in sections"
              :key="section.id"
              :class="[
                'sub-nav-item',
                { 'sub-nav-item--active': activeSection === section.id }
              ]"
              @click="scrollToSection(section.id)"
              :title="section.name"
            >
              <component :is="getIcon(section.icon)" :size="16" />
              <span class="sub-nav-text">{{ section.name }}</span>
            </button>
          </div>
        </nav>

        <!-- 右侧操作 -->
        <div class="sub-nav-actions">
          <button class="sub-nav-action" @click="scrollToTop" title="回到顶部">
            <ChevronUp :size="16" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import {
  BarChart3,
  AlertTriangle,
  Target,
  Globe,
  TrendingUp,
  Calendar,
  Package,
  Users,
  DollarSign,
  ChevronUp
} from 'lucide-vue-next'

// 属性定义
interface DashboardSection {
  id: string
  name: string
  icon: string
}

interface Props {
  sections: DashboardSection[]
}

const props = defineProps<Props>()

// 事件定义
const emit = defineEmits<{
  sectionChange: [sectionId: string]
}>()

// 响应式数据
const activeSection = ref('')
const isSticky = ref(false)
const observer = ref<IntersectionObserver | null>(null)

// 图标映射
const iconMap = {
  AlertTriangle,
  Target,
  Globe,
  TrendingUp,
  Calendar,
  Package,
  Users,
  BarChart3,
  DollarSign
}

// 方法
const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || BarChart3
}

const scrollToSection = (sectionId: string) => {
  const element = document.getElementById(sectionId)
  if (element) {
    const headerHeight = 60 // 头部高度
    const filterHeight = 80 // 筛选器高度
    const subNavHeight = 60 // 子导航高度
    const offset = headerHeight + filterHeight + subNavHeight + 20 // 额外间距

    const elementPosition = element.offsetTop - offset

    window.scrollTo({
      top: elementPosition,
      behavior: 'smooth'
    })

    // 立即更新激活状态
    activeSection.value = sectionId
    emit('sectionChange', sectionId)
  }
}

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  })
}

// 监听滚动位置，更新当前激活的section
const updateActiveSection = () => {
  const headerHeight = 60
  const filterHeight = 80
  const subNavHeight = 60
  const offset = headerHeight + filterHeight + subNavHeight + 50 // 增加一些缓冲区

  let currentSection = ''

  for (const section of props.sections) {
    const element = document.getElementById(section.id)
    if (element) {
      const rect = element.getBoundingClientRect()
      const elementTop = rect.top + window.scrollY

      if (window.scrollY + offset >= elementTop) {
        currentSection = section.id
      }
    }
  }

  if (currentSection && currentSection !== activeSection.value) {
    activeSection.value = currentSection
    emit('sectionChange', currentSection)
  }
}

// 设置Intersection Observer来监听section的可见性
const setupSectionObserver = () => {
  const options = {
    root: null,
    rootMargin: '-100px 0px -50% 0px', // 当section进入视口上方100px时触发
    threshold: 0
  }

  observer.value = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const sectionId = entry.target.id
        if (sectionId && sectionId !== activeSection.value) {
          activeSection.value = sectionId
          emit('sectionChange', sectionId)
        }
      }
    })
  }, options)

  // 观察所有section
  props.sections.forEach((section) => {
    const element = document.getElementById(section.id)
    if (element && observer.value) {
      observer.value.observe(element)
    }
  })
}

// 监听滚动事件来控制sticky状态
const handleScroll = () => {
  const scrollTop = window.scrollY
  isSticky.value = scrollTop > 100

  // 使用节流来优化性能
  updateActiveSection()
}

// 监听来自侧边栏的section change事件
const handleExternalSectionChange = (event: CustomEvent) => {
  const { sectionId } = event.detail
  if (sectionId && sectionId !== activeSection.value) {
    activeSection.value = sectionId
    emit('sectionChange', sectionId)
  }
}

// 生命周期
onMounted(async () => {
  await nextTick()

  // 设置滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 监听来自侧边栏的section change事件
  window.addEventListener('dashboard-section-change', handleExternalSectionChange as EventListener)

  // 设置section观察器
  setupSectionObserver()

  // 初始化激活状态
  if (props.sections.length > 0) {
    activeSection.value = props.sections[0].id
  }
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('dashboard-section-change', handleExternalSectionChange as EventListener)

  if (observer.value) {
    observer.value.disconnect()
  }
})
</script>

<style scoped>
.dashboard-sub-nav {
  background: white;
  border-bottom: 1px solid var(--color-border);
  transition: all 0.3s ease;
  z-index: 100;
}

.dashboard-sub-nav--sticky {
  position: fixed;
  top: 80px; /* 在筛选器下方 */
  left: 0;
  right: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 999; /* 比筛选器稍低 */
}

.sub-nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
}

.sub-nav-content {
  display: flex;
  align-items: center;
  height: 60px;
  gap: 24px;
}

.sub-nav-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
  color: var(--color-text-primary);
  white-space: nowrap;
}

.sub-nav-menu {
  flex: 1;
  overflow: hidden;
}

.sub-nav-scroll {
  display: flex;
  gap: 4px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 4px 0;
}

.sub-nav-scroll::-webkit-scrollbar {
  display: none;
}

.sub-nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: var(--color-text-secondary);
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: fit-content;
}

.sub-nav-item:hover {
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
}

.sub-nav-item--active {
  background: var(--color-primary);
  color: white;
}

.sub-nav-item--active:hover {
  background: var(--color-primary-dark);
}

.sub-nav-text {
  font-size: 13px;
}

.sub-nav-actions {
  display: flex;
  gap: 8px;
}

.sub-nav-action {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--color-bg-secondary);
  border-radius: 6px;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all 0.2s ease;
}

.sub-nav-action:hover {
  background: var(--color-bg-tertiary);
  color: var(--color-text-primary);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .sub-nav-container {
    padding: 0 16px;
  }

  .sub-nav-content {
    gap: 16px;
  }

  .sub-nav-title span {
    display: none;
  }

  .sub-nav-text {
    display: none;
  }

  .sub-nav-item {
    padding: 8px;
    min-width: 40px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .sub-nav-content {
    height: 50px;
    gap: 12px;
  }

  .sub-nav-action {
    width: 32px;
    height: 32px;
  }
}

/* 与侧边栏状态协调 */
.main-layout--collapsed .dashboard-sub-nav--sticky {
  left: 70px; /* 折叠侧边栏宽度 */
}

@media (max-width: 768px) {
  .dashboard-sub-nav--sticky,
  .main-layout--collapsed .dashboard-sub-nav--sticky {
    left: 0; /* 移动端全宽 */
  }
}
</style>
