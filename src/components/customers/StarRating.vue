<template>
  <div class="star-rating">
    <div class="stars">
      <button
        v-for="star in max"
        :key="star"
        type="button"
        class="star"
        :class="{
          filled: star <= modelValue,
          hovering: star <= hoverValue
        }"
        @click="handleClick(star)"
        @mouseenter="handleMouseEnter(star)"
        @mouseleave="handleMouseLeave"
      >
        <Star :size="16" :fill="star <= (hoverValue || modelValue) ? 'currentColor' : 'none'" />
      </button>
    </div>
    <span v-if="showNumber" class="rating-number">
      {{ modelValue }}/{{ max }}
    </span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Star } from 'lucide-vue-next'

interface Props {
  modelValue: number
  max?: number
  step?: number
  showNumber?: boolean
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  max: 10,
  step: 1,
  showNumber: false,
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const hoverValue = ref(0)

const handleClick = (value: number) => {
  if (props.disabled) return
  emit('update:modelValue', value)
}

const handleMouseEnter = (value: number) => {
  if (props.disabled) return
  hoverValue.value = value
}

const handleMouseLeave = () => {
  if (props.disabled) return
  hoverValue.value = 0
}
</script>

<style scoped>
.star-rating {
  display: flex;
  align-items: center;
  gap: 8px;
}

.stars {
  display: flex;
  gap: 2px;
}

.star {
  background: none;
  border: none;
  cursor: pointer;
  padding: 2px;
  border-radius: 2px;
  color: #d1d5db;
  transition: color 0.2s;
}

.star:hover {
  color: #fbbf24;
}

.star.filled,
.star.hovering {
  color: #fbbf24;
}

.star:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

.rating-number {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  min-width: 40px;
}
</style>
