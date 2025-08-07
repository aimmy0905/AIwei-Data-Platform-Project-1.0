<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-container modal-container--large" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">全部绩效记录</h3>
        <button class="modal-close" @click="closeModal">
          <X :size="20" />
        </button>
      </div>

      <!-- 员工信息概览 -->
      <div class="employee-info" v-if="employee">
        <div class="employee-summary">
          <h4>{{ employee.name || employee.employee_name }}</h4>
          <p>{{ employee.department_name || getDepartmentName(employee.department_id) }} - {{ employee.position }}</p>
        </div>
        <div class="current-performance" v-if="latestPerformance">
          <div class="performance-item">
            <span class="performance-label">当前评分</span>
            <span class="performance-value">{{ latestPerformance.total_score.toFixed(1) }}分</span>
          </div>
          <div class="performance-item">
            <span class="performance-label">当前等级</span>
            <span class="performance-grade" :style="{ backgroundColor: getGradeColor(latestPerformance.grade) }">
              {{ getGradeText(latestPerformance.grade) }}
            </span>
          </div>
        </div>
      </div>

      <!-- 筛选器 -->
      <div class="modal-filters">
        <div class="filter-group">
          <label class="filter-label">时间范围:</label>
          <select v-model="timeFilter" class="filter-select">
            <option value="monthly">月度绩效</option>
            <option value="quarterly">季度绩效</option>
            <option value="yearly">年度绩效</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">年份:</label>
          <select v-model="yearFilter" class="filter-select">
            <option value="2024">2024年</option>
            <option value="2023">2023年</option>
            <option value="2022">2022年</option>
          </select>
        </div>
      </div>

      <div class="modal-body">
        <!-- 绩效历史记录 -->
        <div class="performance-history">
          <div class="timeline-container">
            <div class="timeline-item" v-for="record in filteredRecords" :key="record.period">
              <div class="timeline-header">
                <div class="timeline-date">{{ formatPeriod(record.period, record.period_type) }}</div>
                <div class="timeline-summary">
                  <span class="summary-score">综合得分: {{ record.total_score.toFixed(1) }}</span>
                  <span class="summary-grade" :style="{ backgroundColor: getGradeColor(record.grade) }">
                    {{ getGradeText(record.grade) }}
                  </span>
                </div>
              </div>

              <div class="timeline-content">
                <!-- 根据部门类型显示不同的详细得分 -->
                <div v-if="departmentType === 'operations'" class="detailed-scores">
                  <!-- 运营部门绩效详情 -->
                  <div class="score-category">
                    <h5 class="category-title">数据得分 ({{ (record as OperationsPerformanceRecord).data_score?.toFixed(1) || 0 }}分)</h5>
                    <div class="score-details">
                      <div class="detail-item">
                        <span class="detail-label">服务费目标</span>
                        <span class="detail-value">{{ (record as OperationsPerformanceRecord).data_metrics?.service_fee?.score?.toFixed(1) || 0 }}分</span>
                        <span class="detail-rate">({{ (record as OperationsPerformanceRecord).data_metrics?.service_fee?.completion_rate?.toFixed(1) || 0 }}%)</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">返点目标</span>
                        <span class="detail-value">{{ (record as OperationsPerformanceRecord).data_metrics?.rebate?.score?.toFixed(1) || 0 }}分</span>
                        <span class="detail-rate">({{ (record as OperationsPerformanceRecord).data_metrics?.rebate?.completion_rate?.toFixed(1) || 0 }}%)</span>
                      </div>
                    </div>
                  </div>

                  <div class="score-category">
                    <h5 class="category-title">客户评价 ({{ (record as OperationsPerformanceRecord).customer_score?.toFixed(1) || 0 }}分)</h5>
                    <div class="score-details">
                      <div class="detail-item">
                        <span class="detail-label">客户满意度</span>
                        <span class="detail-value">{{ (record as OperationsPerformanceRecord).customer_ratings?.satisfaction?.toFixed(1) || 0 }}分</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">服务质量</span>
                        <span class="detail-value">{{ (record as OperationsPerformanceRecord).customer_ratings?.service_quality?.toFixed(1) || 0 }}分</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">响应速度</span>
                        <span class="detail-value">{{ (record as OperationsPerformanceRecord).customer_ratings?.response_speed?.toFixed(1) || 0 }}分</span>
                      </div>
                    </div>
                  </div>

                  <div class="score-category">
                    <h5 class="category-title">职能方案 ({{ (record as OperationsPerformanceRecord).functional_score?.toFixed(1) || 0 }}分)</h5>
                    <div class="score-details">
                      <div v-if="isManager" class="detail-item">
                        <span class="detail-label">团队成员管理</span>
                        <span class="detail-value">{{ (record as OperationsPerformanceRecord).functional_ratings?.team_member_management?.toFixed(1) || 0 }}分</span>
                      </div>
                      <div v-else class="detail-item">
                        <span class="detail-label">客户服务能力</span>
                        <span class="detail-value">{{ (record as OperationsPerformanceRecord).functional_ratings?.customer_service_ability?.toFixed(1) || 0 }}分</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">专业工作质量</span>
                        <span class="detail-value">{{ (record as OperationsPerformanceRecord).functional_ratings?.work_quality?.toFixed(1) || 0 }}分</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">沟通与协助</span>
                        <span class="detail-value">{{ (record as OperationsPerformanceRecord).functional_ratings?.communication_collaboration?.toFixed(1) || 0 }}分</span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 销售部门绩效详情 -->
                <div v-else class="detailed-scores">
                  <div class="score-category">
                    <h5 class="category-title">月度提成 ({{ (record as SalesPerformanceRecord).monthly_commission_score?.toFixed(1) || 0 }}分)</h5>
                    <div class="score-details">
                      <div class="detail-item">
                        <span class="detail-label">新增服务费</span>
                        <span class="detail-value">{{ (record as SalesPerformanceRecord).monthly_commission?.new_service_fee?.score?.toFixed(1) || 0 }}分</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">新增订单数</span>
                        <span class="detail-value">{{ (record as SalesPerformanceRecord).monthly_commission?.new_orders?.score?.toFixed(1) || 0 }}分</span>
                      </div>
                    </div>
                  </div>

                  <div class="score-category">
                    <h5 class="category-title">绩效底薪奖金 ({{ (record as SalesPerformanceRecord).performance_bonus_score?.toFixed(1) || 0 }}分)</h5>
                    <div class="score-details">
                      <div class="detail-item">
                        <span class="detail-label">数据指标</span>
                        <span class="detail-value">{{ Object.values((record as SalesPerformanceRecord).performance_bonus?.data_metrics || {}).reduce((sum, metric) => sum + (metric.score || 0), 0).toFixed(1) }}分</span>
                      </div>
                      <div class="detail-item">
                        <span class="detail-label">过程管理</span>
                        <span class="detail-value">{{ Object.values((record as SalesPerformanceRecord).performance_bonus?.process_management || {}).reduce((sum, score) => sum + score, 0).toFixed(1) }}分</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-if="filteredRecords.length === 0" class="empty-state">
            <div class="empty-icon">
              <Award :size="48" />
            </div>
            <p class="empty-text">暂无绩效记录</p>
            <p class="empty-description">该员工在选定的时间范围内暂无绩效数据</p>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn--secondary" @click="closeModal">关闭</button>
        <button class="btn btn--primary" @click="exportData">导出数据</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X, Award } from 'lucide-vue-next'
import type {
  OperationsPerformanceRecord,
  SalesPerformanceRecord,
  DepartmentType,
  PeriodType
} from '@/types/departments'
import {
  operationsPerformanceRecords,
  salesPerformanceRecords,
  getGradeColor,
  getGradeDescription
} from '@/mock/performance-new'

// Props
interface Props {
  visible: boolean
  employee: any
  departmentType?: DepartmentType
}

const props = withDefaults(defineProps<Props>(), {
  departmentType: 'operations'
})

// Emits
const emit = defineEmits<{
  close: []
}>()

// 响应式数据
const timeFilter = ref<PeriodType>('monthly')
const yearFilter = ref('2024')

// 计算属性
const isManager = computed(() => {
  return props.employee?.position?.includes('经理') ||
         props.employee?.position?.includes('主管') ||
         props.employee?.position?.includes('总监')
})

const allPerformanceRecords = computed(() => {
  if (props.departmentType === 'operations') {
    return operationsPerformanceRecords.filter(record =>
      record.employee_id === props.employee?.id ||
      record.employee_name === props.employee?.name
    )
  } else {
    return salesPerformanceRecords.filter(record =>
      record.employee_id === props.employee?.id ||
      record.employee_name === props.employee?.name
    )
  }
})

const filteredRecords = computed(() => {
  const records = allPerformanceRecords.value

  // 按时间范围筛选
  const timeFiltered = records.filter(record => {
    return record.period_type === timeFilter.value
  })

  // 按年份筛选
  const yearFiltered = timeFiltered.filter(record => {
    return record.period.startsWith(yearFilter.value)
  })

  // 按时间倒序排列
  return yearFiltered.sort((a, b) => {
    return new Date(b.period).getTime() - new Date(a.period).getTime()
  })
})

const latestPerformance = computed(() => {
  const records = allPerformanceRecords.value
  if (records.length === 0) return null

  // 返回最新的绩效记录
  return records.sort((a, b) => {
    return new Date(b.period).getTime() - new Date(a.period).getTime()
  })[0]
})

// 方法
const closeModal = () => {
  emit('close')
}

const formatPeriod = (period: string, periodType: PeriodType) => {
  if (periodType === 'quarterly') {
    const [year, quarter] = period.split('-Q')
    return `${year}年第${quarter}季度`
  } else if (periodType === 'monthly') {
    const [year, month] = period.split('-')
    return `${year}年${parseInt(month)}月`
  }
  return period
}

const getGradeText = (grade: string) => {
  const gradeMap: Record<string, string> = {
    'A级': 'A级',
    'B级': 'B级',
    'C级': 'C级',
    'D级': 'D级',
    'excellent': '优秀',
    'good': '良好',
    'average': '一般',
    'poor': '待改进'
  }
  return gradeMap[grade] || grade
}

const getDepartmentName = (departmentId?: number) => {
  // 这里应该从部门数据中获取部门名称
  // 临时返回默认值
  return '运营部'
}

const exportData = () => {
  console.log('导出绩效数据:', {
    employee: props.employee,
    records: filteredRecords.value
  })
  // TODO: 实现数据导出功能
  alert(`正在导出 ${props.employee?.name || props.employee?.employee_name} 的绩效数据...`)
}

// 监听器
watch(() => props.visible, (visible) => {
  if (visible) {
    // 重置筛选条件
    timeFilter.value = 'monthly'
    yearFilter.value = '2024'
  }
})
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  background: white;
  border-radius: 12px;
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

.modal-container--large {
  max-width: 1400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: #f3f4f6;
  border-radius: 6px;
  cursor: pointer;
  color: #6b7280;
  transition: all 0.2s;
}

.modal-close:hover {
  background: #e5e7eb;
  color: #374151;
}

.employee-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  background: #f8fafc;
  border-bottom: 1px solid #e5e7eb;
}

.employee-summary h4 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.employee-summary p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.current-performance {
  display: flex;
  gap: 24px;
}

.performance-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.performance-label {
  font-size: 12px;
  color: #6b7280;
}

.performance-value {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.performance-grade {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
  text-align: center;
}

.modal-filters {
  display: flex;
  gap: 20px;
  padding: 20px 24px;
  background: white;
  border-bottom: 1px solid #e5e7eb;
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  white-space: nowrap;
}

.filter-select {
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
  cursor: pointer;
  transition: border-color 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #3b82f6;
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

.performance-history {
  width: 100%;
}

.timeline-container {
  position: relative;
}

.timeline-item {
  position: relative;
  margin-bottom: 32px;
  padding-left: 32px;
}

.timeline-item:before {
  content: '';
  position: absolute;
  left: 12px;
  top: 0;
  bottom: -32px;
  width: 2px;
  background: #e5e7eb;
}

.timeline-item:last-child:before {
  display: none;
}

.timeline-item:after {
  content: '';
  position: absolute;
  left: 8px;
  top: 8px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #3b82f6;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.timeline-date {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.timeline-summary {
  display: flex;
  align-items: center;
  gap: 12px;
}

.summary-score {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.summary-grade {
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.timeline-content {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.detailed-scores {
  padding: 0;
}

.score-category {
  border-bottom: 1px solid #e5e7eb;
}

.score-category:last-child {
  border-bottom: none;
}

.category-title {
  margin: 0;
  padding: 16px 20px 12px;
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
  background: #f8fafc;
}

.score-details {
  padding: 0 20px 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f3f4f6;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-label {
  font-size: 14px;
  color: #6b7280;
}

.detail-value {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.detail-rate {
  font-size: 12px;
  color: #6b7280;
  margin-left: 8px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.empty-icon {
  margin-bottom: 16px;
  color: #9ca3af;
}

.empty-text {
  margin: 0 0 8px 0;
  font-size: 18px;
  font-weight: 500;
  color: #6b7280;
}

.empty-description {
  margin: 0;
  font-size: 14px;
  color: #9ca3af;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
  background: #f8fafc;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn--secondary {
  background: #f3f4f6;
  color: #374151;
}

.btn--secondary:hover {
  background: #e5e7eb;
}

.btn--primary {
  background: #3b82f6;
  color: white;
}

.btn--primary:hover {
  background: #2563eb;
}
</style>
