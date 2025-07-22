<template>
  <div class="menu-item">
    <!-- 有子菜单的项目 -->
    <div v-if="item.children && item.children.length > 0">
      <div
        class="menu-item__header"
        :class="{
          'menu-item__header--active': isExpanded,
          'menu-item__header--selected': isSelected
        }"
        :style="{ paddingLeft: `${16 + level * 20}px` }"
        @click.stop="handleToggle"
      >
        <div class="menu-item__content">
          <component :is="getIcon(item.icon)" :size="20" />
          <span v-if="!isCollapsed" class="menu-item__text">{{ item.name }}</span>
          <span v-if="item.badge && !isCollapsed" class="menu-item__badge">{{ item.badge }}</span>
        </div>
        <ChevronDown
          v-if="!isCollapsed"
          :size="16"
          class="menu-item__arrow"
          :class="{ 'menu-item__arrow--expanded': isExpanded }"
        />
      </div>

      <!-- 子菜单 -->
      <div
        v-if="isExpanded && !isCollapsed"
        class="submenu"
      >
        <SidebarMenuItem
          v-for="child in item.children"
          :key="child.id"
          :item="child"
          :level="level + 1"
          :is-collapsed="isCollapsed"
          :open-menus="openMenus"
          @toggle-menu="$emit('toggle-menu', $event)"
          @select-menu="$emit('select-menu', $event)"
        />
      </div>
    </div>

    <!-- 普通菜单项 -->
    <div
      v-else
      class="menu-item__link"
      :class="{ 'menu-item__link--selected': isSelected }"
      :style="{ paddingLeft: `${16 + level * 20}px` }"
      @click="handleSelect"
    >
      <div class="menu-item__content">
        <component :is="getIcon(item.icon)" :size="20" />
        <span v-if="!isCollapsed" class="menu-item__text">{{ item.name }}</span>
        <span v-if="item.badge && !isCollapsed" class="menu-item__badge">{{ item.badge }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import type { MenuItem } from '@/types'
import {
  ChevronDown,
  BarChart3,
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

// Props
interface Props {
  item: MenuItem
  level?: number
  isCollapsed: boolean
  openMenus: string[]
}

const props = withDefaults(defineProps<Props>(), {
  level: 0
})

// Emits
const emit = defineEmits<{
  'toggle-menu': [menuId: string]
  'select-menu': [item: MenuItem]
}>()

// Composables
const route = useRoute()

// Computed
const isExpanded = computed(() => props.openMenus.includes(props.item.id))

const isSelected = computed(() => {
  if (props.item.path) {
    return route.path === props.item.path
  }
  return false
})


// 图标映射
const iconMap = {
  BarChart3, Target, Globe, TrendingUp, Calendar, Package, Users, MapPin,
  FileText, Search, Megaphone, Monitor, List, BarChart, DollarSign, Star,
  Building, Award, FolderOpen, Settings, Shield, Palette, Cog,
  Facebook: Monitor,
  Chrome: Monitor,
  UserCheck: Users,
  UserCog: Users,
  Sitemap: Building,
  AlertTriangle: Search,
  Download: DollarSign,
  Tool: Settings
}

// 方法
const getIcon = (iconName: string) => {
  return iconMap[iconName as keyof typeof iconMap] || BarChart3
}

const handleToggle = () => {
  emit('toggle-menu', props.item.id)
}

const handleSelect = () => {
  emit('select-menu', props.item)
}
</script>

<style scoped>
.menu-item {
  margin-bottom: 4px;
}

.menu-item__header,
.menu-item__link {
  cursor: pointer;
  padding: 12px 16px;
  border-radius: 6px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.menu-item__header:hover,
.menu-item__link:hover {
  background: #f5f5f5;
}

.menu-item__header--active,
.menu-item__header--selected,
.menu-item__link--selected {
  background: #e3f2fd;
  color: #1976d2;
}

.menu-item__content {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.menu-item__text {
  flex: 1;
}

.menu-item__badge {
  background: #ff4444;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.menu-item__arrow {
  transition: transform 0.2s;
}

.menu-item__arrow--expanded {
  transform: rotate(180deg);
}

.submenu {
  margin-top: 4px;
}
</style>
