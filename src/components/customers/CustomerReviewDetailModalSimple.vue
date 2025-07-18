<template>
  <div v-if="visible" class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-container">
      <div class="modal-header">
        <h2 class="modal-title">客户评价详情</h2>
        <div class="header-actions">
          <button class="modal-close" @click="$emit('close')">
            <X :size="20" />
          </button>
        </div>
      </div>

      <div class="modal-body" v-if="review">
        <!-- 基础信息 -->
        <div class="detail-section">
          <h3 class="section-title">基础信息</h3>
          <div class="info-grid">
            <div class="info-item">
              <label class="info-label">客户名称</label>
              <div class="info-value">{{ review.customerName }}</div>
            </div>
            <div class="info-item">
              <label class="info-label">项目名称</label>
              <div class="info-value">{{ review.projectName }}</div>
            </div>
            <div class="info-item">
              <label class="info-label">评价月份</label>
              <div class="info-value">{{ review.evaluationMonth }}</div>
            </div>
                         <div class="info-item">
               <label class="info-label">评价人</label>
               <div class="info-value">{{ review.evaluator }}</div>
             </div>
             <div class="info-item">
               <label class="info-label">负责团队</label>
               <div class="info-value">{{ review.responsibleTeam }}</div>
             </div>
             <div class="info-item">
               <label class="info-label">评价日期</label>
               <div class="info-value">{{ formatDate(review.evaluationDate) }}</div>
             </div>
            <div class="info-item">
              <label class="info-label">创建时间</label>
              <div class="info-value">{{ formatDateTime(review.createTime) }}</div>
            </div>
          </div>
        </div>

        <!-- 评分信息 -->
        <div class="detail-section">
          <h3 class="section-title">评分信息</h3>

          <!-- 综合评分 -->
          <div class="overall-rating">
            <div class="overall-score">
              <div class="score-number" :class="getRatingClass(review.overallRating)">
                {{ review.overallRating }}
              </div>
              <div class="score-label">综合评分</div>
              <div class="score-stars">
                <Star
                  v-for="star in 10"
                  :key="star"
                  :size="16"
                  :fill="star <= review.overallRating ? 'currentColor' : 'none'"
                  :class="{ active: star <= review.overallRating }"
                />
              </div>
            </div>
            <div class="rating-level" :class="getRatingClass(review.overallRating)">
              {{ getRatingText(review.overallRating) }}
            </div>
          </div>

          <!-- 各维度评分 -->
          <div class="rating-details">
            <div class="rating-item">
              <div class="rating-info">
                <label class="rating-label">问题处理及时性</label>
                <div class="rating-score" :class="getRatingClass(review.problemHandlingRating)">
                  {{ review.problemHandlingRating }}/10
                </div>
              </div>
              <div class="rating-bar">
                <div
                  class="rating-fill"
                  :class="getRatingClass(review.problemHandlingRating)"
                  :style="{ width: `${(review.problemHandlingRating / 10) * 100}%` }"
                ></div>
              </div>
            </div>

            <div class="rating-item">
              <div class="rating-info">
                <label class="rating-label">专业能力达标</label>
                <div class="rating-score" :class="getRatingClass(review.professionalRating)">
                  {{ review.professionalRating }}/10
                </div>
              </div>
              <div class="rating-bar">
                <div
                  class="rating-fill"
                  :class="getRatingClass(review.professionalRating)"
                  :style="{ width: `${(review.professionalRating / 10) * 100}%` }"
                ></div>
              </div>
            </div>

            <div class="rating-item">
              <div class="rating-info">
                <label class="rating-label">服务态度</label>
                <div class="rating-score" :class="getRatingClass(review.serviceAttitudeRating)">
                  {{ review.serviceAttitudeRating }}/10
                </div>
              </div>
              <div class="rating-bar">
                <div
                  class="rating-fill"
                  :class="getRatingClass(review.serviceAttitudeRating)"
                  :style="{ width: `${(review.serviceAttitudeRating / 10) * 100}%` }"
                ></div>
              </div>
            </div>
          </div>

          <!-- 平均分 -->
          <div class="average-score">
            <label class="average-label">各维度平均分</label>
            <div class="average-value" :class="getRatingClass(averageRating)">
              {{ averageRating.toFixed(1) }}/10
            </div>
          </div>
        </div>

        <!-- 改进建议 -->
        <div class="detail-section" v-if="review.improvementSuggestions">
          <h3 class="section-title">改进建议</h3>
          <div class="suggestions-content">
            <div class="suggestions-text">
              {{ review.improvementSuggestions }}
            </div>
            <div class="suggestions-meta">
              字数：{{ review.improvementSuggestions.length }}/500
            </div>
          </div>
        </div>

        <!-- 操作记录 -->
        <div class="detail-section">
          <h3 class="section-title">操作记录</h3>
          <div class="operation-logs">
            <div class="log-item">
              <div class="log-time">{{ formatDateTime(review.createTime) }}</div>
              <div class="log-action">{{ review.createdBy }} 创建了此评价记录</div>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button type="button" class="btn btn-secondary" @click="$emit('close')">
          关闭
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { X, Star } from 'lucide-vue-next'
import type { CustomerReview } from '@/mock/customer-reviews'

interface Props {
  visible: boolean
  review?: CustomerReview | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()

// 计算属性
const averageRating = computed(() => {
  if (!props.review) return 0
  return (
    props.review.problemHandlingRating +
    props.review.professionalRating +
    props.review.serviceAttitudeRating
  ) / 3
})

// 方法
const getRatingClass = (rating: number) => {
  if (rating >= 9) return 'rating-excellent'
  if (rating >= 7) return 'rating-good'
  if (rating >= 5) return 'rating-average'
  return 'rating-poor'
}

const getRatingText = (rating: number) => {
  if (rating >= 9) return '非常满意'
  if (rating >= 7) return '满意'
  if (rating >= 5) return '一般'
  return '不满意'
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatDateTime = (dateString: string) => {
  return new Date(dateString).toLocaleString('zh-CN')
}

const handleOverlayClick = (event: Event) => {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.25);
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a202c;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-close {
  padding: 8px;
  background: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  color: #64748b;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f1f5f9;
  color: #374151;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.detail-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #374151;
  margin: 0;
  padding-bottom: 8px;
  border-bottom: 1px solid #e2e8f0;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 15px;
  color: #374151;
  font-weight: 500;
}

.overall-rating {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 20px;
  background-color: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.overall-score {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.score-number {
  font-size: 48px;
  font-weight: 700;
  line-height: 1;
}

.score-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.score-stars {
  display: flex;
  gap: 2px;
}

.score-stars .active {
  color: #fbbf24;
}

.score-stars svg:not(.active) {
  color: #d1d5db;
}

.rating-level {
  font-size: 18px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 8px;
  background-color: white;
  border: 2px solid;
}

.rating-details {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.rating-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rating-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.rating-score {
  font-size: 14px;
  font-weight: 600;
}

.rating-bar {
  height: 8px;
  background-color: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.rating-fill {
  height: 100%;
  transition: width 0.3s ease;
}

.average-score {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background-color: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.average-label {
  font-size: 15px;
  color: #374151;
  font-weight: 600;
}

.average-value {
  font-size: 18px;
  font-weight: 700;
}

.suggestions-content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.suggestions-text {
  padding: 16px;
  background-color: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  color: #374151;
  line-height: 1.6;
  white-space: pre-wrap;
}

.suggestions-meta {
  font-size: 12px;
  color: #6b7280;
  text-align: right;
}

.operation-logs {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.log-item {
  display: flex;
  gap: 12px;
  padding: 12px;
  background-color: #f8fafc;
  border-radius: 8px;
  border-left: 3px solid #3b82f6;
}

.log-time {
  font-size: 12px;
  color: #6b7280;
  min-width: 140px;
}

.log-action {
  font-size: 14px;
  color: #374151;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid #e2e8f0;
  background-color: #f8fafc;
}

.btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border-radius: 6px;
  font-weight: 500;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary {
  background-color: #f1f5f9;
  color: #475569;
  border: 1px solid #e2e8f0;
}

.btn-secondary:hover {
  background-color: #e2e8f0;
}

/* 评分颜色 */
.rating-excellent {
  color: #059669;
  border-color: #059669;
}

.rating-excellent.rating-fill {
  background-color: #059669;
}

.rating-good {
  color: #3b82f6;
  border-color: #3b82f6;
}

.rating-good.rating-fill {
  background-color: #3b82f6;
}

.rating-average {
  color: #f59e0b;
  border-color: #f59e0b;
}

.rating-average.rating-fill {
  background-color: #f59e0b;
}

.rating-poor {
  color: #dc2626;
  border-color: #dc2626;
}

.rating-poor.rating-fill {
  background-color: #dc2626;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .overall-rating {
    flex-direction: column;
    text-align: center;
  }

  .modal-container {
    margin: 10px;
    max-width: none;
  }
}
</style>
