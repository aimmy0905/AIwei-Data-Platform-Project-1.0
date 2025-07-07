<template>
  <div class="menu-item">
    <!-- 有子菜单的项目 -->
    <div 
      v-if="item.children && item.children.length > 0"
      class="menu-item__group"
    >
      <div
        class="menu-item__header"
        :class="{ 'menu-item__header--active': isOpen }"
        @click="toggleSubmenu"
      >
        <div class="menu-item__content">
          <component 
            :is="getIcon(item.icon)" 
            :size="20" 
            class="menu-item__icon"
          />
          <transition name="fade">
            <span v-show="!collapsed" class="menu-item__text">
              {{ item.name }}
            </span>
          </transition>
          <span v-if="item.badge && !collapsed" class="menu-item__badge">
            {{ item.badge }}
          </span>
        </div>
        <transition name="fade">
          <ChevronDown 
            v-show="!collapsed"
            :size="16" 
            class="menu-item__arrow"
            :class="{ 'menu-item__arrow--open': isOpen }"
          />
        </transition>
      </div>
      
      <!-- 子菜单 -->
      <Transition name="slide-down">
        <div v-show="isOpen && !collapsed" class="menu-item__submenu">
          <SidebarMenuItem
            v-for="child in item.children"
            :key="child.id"
            :item="child"
            :collapsed="false"
            :level="level + 1"
            @select="$emit('select', $event)"
          />
        </div>
      </Transition>
    </div>

    <!-- 普通菜单项 -->
    <div
      v-else
      class="menu-item__link"
      :class="{ 
        'menu-item__link--active': isActive,
        'menu-item__link--collapsed': collapsed 
      }"
      @click="handleClick"
    >
      <div class="menu-item__content">
        <component 
          :is="getIcon(item.icon)" 
          :size="20" 
          class="menu-item__icon"
        />
        <transition name="fade">
          <span v-show="!collapsed" class="menu-item__text">
            {{ item.name }}
          </span>
        </transition>
        <span v-if="item.badge && !collapsed" class="menu-item__badge">
          {{ item.badge }}
        </span>
      </div>
      
      <!-- 折叠状态下的提示 -->
      <div v-if="collapsed" class="menu-item__tooltip">
        {{ item.name }}
        <span v-if="item.badge" class="menu-item__tooltip-badge">
          {{ item.badge }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { 
  ChevronDown, 
  BarChart3, 
  PieChart, 
  Target, 
  Globe, 
  TrendingUp, 
  Calendar,
  Package,
  Users,
  MapPin,
  FileText,
  Search,
  Megaphone,
  Monitor,
  List,
  BarChart,
  DollarSign,
  Star,
  Building,
  Award,
  FolderOpen,
  Settings,
  Shield,
  Palette,
  Cog
} from 'lucide-vue-next'
import { useMenuStore } from '@/stores/menu'
import type { MenuItem } from '@/types'

// 属性定义
interface Props {
  item: MenuItem
  collapsed?: boolean
  level?: number
}

const props = withDefaults(defineProps<Props>(), {
  collapsed: false,
  level: 0
})

// 事件定义
const emit = defineEmits<{
  select: [item: MenuItem]
}>()

// 组合式API
const menuStore = useMenuStore()

// 计算属性
const isOpen = computed(() => menuStore.isMenuOpen(props.item.id))
const isActive = computed(() => menuStore.isMenuActive(props.item.id))

// 图标映射
const iconMap = {
  BarChart3,
  PieChart,
  Target,
  Globe,
  TrendingUp,
  Calendar,
  Package,
  Users,
  MapPin,
  FileText,
  Search,
  Megaphone,
  Facebook: Monitor, // 用Monitor替代Facebook
  Chrome: Monitor, // 用Monitor替代Chrome
  Monitor,
  UserCheck: Users, // 用Users替代UserCheck
  List,
  BarChart,
  DollarSign,
  Star,
  Building,
  Award,
  FolderOpen,
  Settings,
  UserCog: Users, // 用Users替代UserCog
  Shield,
  Palette,
  Cog,
  Sitemap: Building // 用Building替代Sitemap
}

// 方法
const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || BarChart3
}

const toggleSubmenu = () => {
  if (!props.collapsed) {
    menuStore.toggleSubmenu(props.item.id)
  }
}

const handleClick = () => {
  emit('select', props.item)
}
</script>

<style scoped>
.menu-item {
  margin-bottom: var(--spacing-xs);
}

.menu-item__header,
.menu-item__link {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all var(--duration-fast);
  position: relative;
  user-select: none;
}

.menu-item__header:hover,
.menu-item__link:hover {
  background: var(--color-background);
}

.menu-item__header--active,
.menu-item__link--active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.menu-item__content {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
  min-width: 0;
}

.menu-item__icon {
  flex-shrink: 0;
  color: currentColor;
}

.menu-item__text {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
  color: var(--color-text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.menu-item__link--active .menu-item__text {
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.menu-item__badge {
  background: var(--color-error);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-left: auto;
}

.menu-item__arrow {
  flex-shrink: 0;
  transition: transform var(--duration-fast);
  color: var(--color-text-secondary);
}

.menu-item__arrow--open {
  transform: rotate(180deg);
}

.menu-item__submenu {
  padding-left: var(--spacing-lg);
  margin-top: var(--spacing-xs);
}

/* 折叠状态下的提示框 */
.menu-item__tooltip {
  position: absolute;
  left: calc(100% + var(--spacing-sm));
  top: 50%;
  transform: translateY(-50%);
  background: var(--color-text-primary);
  color: var(--color-text-inverse);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  white-space: nowrap;
  z-index: var(--z-tooltip);
  opacity: 0;
  visibility: hidden;
  transition: all var(--duration-fast);
  pointer-events: none;
}

.menu-item__tooltip::before {
  content: '';
  position: absolute;
  left: -4px;
  top: 50%;
  transform: translateY(-50%);
  border: 4px solid transparent;
  border-right-color: var(--color-text-primary);
}

.menu-item__tooltip-badge {
  background: var(--color-error);
  color: white;
  font-size: var(--font-size-xs);
  padding: 2px 6px;
  border-radius: 10px;
  margin-left: var(--spacing-sm);
}

.menu-item__link--collapsed:hover .menu-item__tooltip {
  opacity: 1;
  visibility: visible;
}

/* 层级缩进 */
.menu-item[data-level="1"] .menu-item__content {
  padding-left: var(--spacing-md);
}

.menu-item[data-level="2"] .menu-item__content {
  padding-left: var(--spacing-xl);
}

/* 动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity var(--duration-fast);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all var(--duration-normal);
  overflow: hidden;
}

.slide-down-enter-from,
.slide-down-leave-to {
  max-height: 0;
  opacity: 0;
}

.slide-down-enter-to,
.slide-down-leave-from {
  max-height: 500px;
  opacity: 1;
}
</style>