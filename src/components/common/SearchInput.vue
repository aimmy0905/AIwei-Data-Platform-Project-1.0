<template>
  <div class="search-input">
    <div class="search-input__wrapper">
      <Search :size="20" class="search-input__icon" />
      <input
        v-model="searchValue"
        type="text"
        :placeholder="placeholder"
        class="search-input__field"
        @input="handleInput"
        @keyup.enter="handleSearch"
        @focus="handleFocus"
        @blur="handleBlur"
      />
      <button
        v-if="searchValue && clearable"
        class="search-input__clear"
        @click="handleClear"
        :title="clearTitle"
      >
        <X :size="16" />
      </button>
      <button
        v-if="showSearchButton"
        class="search-input__button"
        @click="handleSearch"
        :title="searchTitle"
      >
        <Search :size="16" />
      </button>
    </div>
    
    <!-- 搜索建议 -->
    <div 
      v-if="suggestions.length > 0 && showSuggestions && focused"
      class="search-suggestions"
    >
      <div
        v-for="(suggestion, index) in filteredSuggestions"
        :key="index"
        class="search-suggestion"
        @click="handleSuggestionClick(suggestion)"
      >
        <Search :size="14" class="suggestion-icon" />
        <span class="suggestion-text" v-html="highlightMatch(suggestion)"></span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { Search, X } from 'lucide-vue-next'

// 属性定义
interface Props {
  modelValue?: string
  placeholder?: string
  clearable?: boolean
  showSearchButton?: boolean
  suggestions?: string[]
  showSuggestions?: boolean
  debounceMs?: number
  clearTitle?: string
  searchTitle?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '搜索...',
  clearable: true,
  showSearchButton: false,
  suggestions: () => [],
  showSuggestions: true,
  debounceMs: 300,
  clearTitle: '清除搜索',
  searchTitle: '搜索'
})

// 事件定义
const emit = defineEmits<{
  'update:modelValue': [value: string]
  search: [value: string]
  clear: []
  focus: [event: FocusEvent]
  blur: [event: FocusEvent]
}>()

// 响应式数据
const searchValue = ref(props.modelValue)
const focused = ref(false)
let debounceTimer: number | null = null

// 计算属性
const filteredSuggestions = computed(() => {
  if (!searchValue.value || !props.showSuggestions) return []
  
  return props.suggestions
    .filter(suggestion => 
      suggestion.toLowerCase().includes(searchValue.value.toLowerCase())
    )
    .slice(0, 5) // 限制显示数量
})

// 监听器
watch(() => props.modelValue, (newValue) => {
  searchValue.value = newValue
})

watch(searchValue, (newValue) => {
  emit('update:modelValue', newValue)
  
  if (debounceTimer) {
    clearTimeout(debounceTimer)
  }
  
  debounceTimer = window.setTimeout(() => {
    if (newValue.trim()) {
      emit('search', newValue.trim())
    }
  }, props.debounceMs)
})

// 方法
const handleInput = () => {
  // Input事件已通过v-model和watch处理
}

const handleSearch = () => {
  if (searchValue.value.trim()) {
    emit('search', searchValue.value.trim())
  }
}

const handleClear = () => {
  searchValue.value = ''
  emit('clear')
  focused.value = false
}

const handleFocus = (event: FocusEvent) => {
  focused.value = true
  emit('focus', event)
}

const handleBlur = (event: FocusEvent) => {
  // 延迟隐藏建议，以便点击建议项
  setTimeout(() => {
    focused.value = false
  }, 200)
  emit('blur', event)
}

const handleSuggestionClick = (suggestion: string) => {
  searchValue.value = suggestion
  focused.value = false
  emit('search', suggestion)
}

const highlightMatch = (text: string): string => {
  if (!searchValue.value) return text
  
  const regex = new RegExp(`(${searchValue.value})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}
</script>

<style scoped>
.search-input {
  position: relative;
  width: 100%;
}

.search-input__wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.search-input__icon {
  position: absolute;
  left: var(--spacing-md);
  color: var(--color-text-secondary);
  pointer-events: none;
  z-index: 1;
}

.search-input__field {
  width: 100%;
  height: 40px;
  padding: 0 var(--spacing-md) 0 48px;
  border: 2px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--duration-fast);
}

.search-input__field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.search-input__field::placeholder {
  color: var(--color-text-disabled);
}

.search-input__clear,
.search-input__button {
  position: absolute;
  right: var(--spacing-md);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  border-radius: var(--border-radius-sm);
  transition: all var(--duration-fast);
}

.search-input__clear:hover,
.search-input__button:hover {
  background: var(--color-background);
  color: var(--color-primary);
}

.search-input__button {
  right: calc(var(--spacing-md) + 32px);
}

.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
  margin-top: var(--spacing-xs);
}

.search-suggestion {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  transition: background-color var(--duration-fast);
  border-bottom: 1px solid var(--color-border-light);
}

.search-suggestion:last-child {
  border-bottom: none;
}

.search-suggestion:hover {
  background: var(--color-background);
}

.suggestion-icon {
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.suggestion-text {
  flex: 1;
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.suggestion-text :deep(mark) {
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .search-input__field {
    height: 40px;
    padding-left: 40px;
    padding-right: 40px;
    font-size: var(--font-size-md);
  }
  
  .search-input__icon {
    left: var(--spacing-sm);
  }
  
  .search-input__clear,
  .search-input__button {
    right: var(--spacing-sm);
    width: 28px;
    height: 28px;
  }
  
  .search-input__button {
    right: calc(var(--spacing-sm) + 32px);
  }
  
  .search-suggestions {
    border-radius: var(--border-radius-lg);
    box-shadow: var(--shadow-xl);
  }
  
  .search-suggestion {
    padding: var(--spacing-md);
    font-size: var(--font-size-md);
  }
  
  .suggestion-icon {
    flex-shrink: 0;
  }
  
  .suggestion-text {
    font-size: var(--font-size-md);
  }
}

@media (max-width: 480px) {
  .search-input__field {
    height: 44px;
    padding-left: 44px;
    padding-right: 44px;
    font-size: var(--font-size-md);
    border-width: 2px;
  }
  
  .search-input__icon {
    left: var(--spacing-md);
  }
  
  .search-input__clear,
  .search-input__button {
    right: var(--spacing-md);
    width: 32px;
    height: 32px;
  }
  
  .search-input__button {
    right: calc(var(--spacing-md) + 36px);
  }
  
  .search-input__field:focus {
    box-shadow: 0 0 0 4px var(--color-primary-light);
  }
  
  .search-suggestions {
    max-height: 250px;
    margin-top: var(--spacing-sm);
  }
  
  .search-suggestion {
    padding: var(--spacing-lg) var(--spacing-md);
    font-size: var(--font-size-md);
    min-height: 48px;
  }
  
  .suggestion-text :deep(mark) {
    padding: var(--spacing-xs);
    border-radius: var(--border-radius-xs);
  }
}
</style>