<template>
  <div class="performance-panel">
    <div class="panel-header">
      <div class="header-content">
        <h3>绩效考核</h3>
        <p>管理员工绩效考核记录和评分</p>
      </div>
      <div class="header-actions">
        <button class="action-btn action-btn--secondary" @click="exportData">
          <Download :size="16" />
          导出数据
        </button>
        <button class="action-btn action-btn--secondary" @click="batchEvaluation">
          <Users :size="16" />
          批量考核
        </button>
        <button class="action-btn action-btn--primary" @click="createPerformance">
          <Plus :size="16" />
          新建考核
        </button>
      </div>
    </div>

    <div class="performance-content">
      <!-- 筛选区域 -->
      <div class="filter-section">
        <div class="filter-row">
          <div class="filter-group">
            <label class="filter-label">考核周期:</label>
            <select v-model="filters.periodType" @change="handleFilterChange" class="filter-select">
              <option value="">全部周期</option>
              <option value="monthly">月度</option>
              <option value="quarterly">季度</option>
              <option value="yearly">年度</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">部门:</label>
            <select v-model="filters.departmentId" @change="handleFilterChange" class="filter-select">
              <option value="">全部部门</option>
              <option v-for="dept in departments" :key="dept.id" :value="dept.id">
                {{ dept.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">员工:</label>
            <select v-model="filters.employeeId" @change="handleFilterChange" class="filter-select">
              <option value="">全部员工</option>
              <option v-for="emp in availableEmployees" :key="emp.id" :value="emp.id">
                {{ emp.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">考核状态:</label>
            <select v-model="filters.status" @change="handleFilterChange" class="filter-select">
              <option value="">全部状态</option>
              <option value="draft">草稿</option>
              <option value="completed">已完成</option>
              <option value="approved">已审批</option>
            </select>
          </div>

          <div class="filter-group">
            <label class="filter-label">时间范围:</label>
            <div class="date-range">
              <input
                v-model="filters.startDate"
                type="date"
                class="filter-input"
                @change="handleFilterChange"
              />
              <span class="date-separator">至</span>
              <input
                v-model="filters.endDate"
                type="date"
                class="filter-input"
                @change="handleFilterChange"
              />
            </div>
          </div>

          <div class="filter-group">
            <div class="search-input-wrapper">
              <Search :size="20" class="search-icon" />
              <input
                v-model="filters.keyword"
                type="text"
                placeholder="搜索员工姓名"
                class="search-input"
                @input="handleFilterChange"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- 考核列表 -->
      <div class="performance-table-section">
        <div class="table-header">
          <div class="table-header__left">
            <h3>考核列表</h3>
            <span class="record-count">共 {{ filteredPerformances.length }} 条记录</span>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="performance-table">
            <thead>
              <tr>
                <th>员工</th>
                <th>部门</th>
                <th>考核周期</th>
                <th>数据指标</th>
                <th>客户评分</th>
                <th>上级评分</th>
                <th>总分</th>
                <th>等级</th>
                <th>状态</th>
                <th>考核时间</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="performance in paginatedPerformances" :key="performance.id" class="performance-row">
                <td>
                  <div class="employee-info">
                    <div class="employee-name">{{ performance.employee_name }}</div>
                    <div class="employee-id">{{ getEmployeeId(performance.employee_id) }}</div>
                  </div>
                </td>
                <td>{{ performance.department_name }}</td>
                <td>
                  <div class="period-info">
                    <div class="period-text">{{ performance.period }}</div>
                    <div class="period-type">{{ getPeriodTypeText(performance.period_type) }}</div>
                  </div>
                </td>
                <td>
                  <div class="score-cell">
                    <div class="score-value">{{ getDataMetricsScore(performance) }}分</div>
                    <div class="score-detail">数据指标</div>
                  </div>
                </td>
                <td>
                  <div class="score-cell">
                    <div class="score-value">{{ performance.customer_rating.total_score }}分</div>
                    <div class="score-detail">客户评价</div>
                  </div>
                </td>
                <td>
                  <div class="score-cell">
                    <div class="score-value">{{ performance.supervisor_rating.total_score }}分</div>
                    <div class="score-detail">上级评价</div>
                  </div>
                </td>
                <td>
                  <div class="total-score" :class="getTotalScoreClass(performance.total_score)">
                    {{ performance.total_score }}分
                  </div>
                </td>
                <td>
                  <span class="grade-badge" :class="getGradeClass(performance.grade)">
                    {{ getGradeText(performance.grade) }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="getStatusClass(performance.status)">
                    {{ getStatusText(performance.status) }}
                  </span>
                </td>
                <td>{{ formatDate(performance.created_at) }}</td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="action-btn-small action-btn-small--info"
                      @click="viewPerformance(performance)"
                      title="查看详情"
                    >
                      <Eye :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--primary"
                      @click="editPerformance(performance)"
                      title="编辑"
                    >
                      <Edit :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--success"
                      @click="printReport(performance)"
                      title="打印报告"
                    >
                      <Printer :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--danger"
                      @click="deletePerformance(performance)"
                      title="删除"
                    >
                      <Trash2 :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- 分页 -->
        <div class="pagination-section">
          <div class="pagination-info">
            显示第 {{ (currentPage - 1) * pageSize + 1 }} - {{ Math.min(currentPage * pageSize, filteredPerformances.length) }} 条，
            共 {{ filteredPerformances.length }} 条记录
          </div>
          <div class="pagination-controls">
            <button
              class="pagination-btn"
              :disabled="currentPage === 1"
              @click="currentPage = currentPage - 1"
            >
              上一页
            </button>
            <span class="pagination-current">{{ currentPage }} / {{ totalPages }}</span>
            <button
              class="pagination-btn"
              :disabled="currentPage === totalPages"
              @click="currentPage = currentPage + 1"
            >
              下一页
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 绩效详情弹窗 -->
    <div v-if="showDetailModal && selectedPerformance" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-container modal-container--large" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedPerformance.employee_name }} - 绩效考核详情</h3>
          <div class="modal-header-actions">
            <button class="action-btn action-btn--primary" @click="editPerformance(selectedPerformance)">
              <Edit :size="16" />
              编辑考核
            </button>
            <button class="action-btn action-btn--secondary" @click="printReport(selectedPerformance)">
              <Printer :size="16" />
              打印报告
            </button>
            <button class="modal-close" @click="closeDetailModal">
              <X :size="20" />
            </button>
          </div>
        </div>
        <div class="modal-content">
          <div class="performance-detail">
            <!-- 基本信息 -->
            <div class="detail-section">
              <h4 class="section-title">基本信息</h4>
              <div class="info-grid">
                <div class="info-item">
                  <span class="info-label">员工姓名</span>
                  <span class="info-value">{{ selectedPerformance.employee_name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">所属部门</span>
                  <span class="info-value">{{ selectedPerformance.department_name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">考核周期</span>
                  <span class="info-value">{{ selectedPerformance.period }} ({{ getPeriodTypeText(selectedPerformance.period_type) }})</span>
                </div>
                <div class="info-item">
                  <span class="info-label">考核人</span>
                  <span class="info-value">{{ selectedPerformance.evaluator_name }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">考核时间</span>
                  <span class="info-value">{{ formatDate(selectedPerformance.created_at) }}</span>
                </div>
                <div class="info-item">
                  <span class="info-label">状态</span>
                  <span class="info-value">
                    <span class="status-badge" :class="getStatusClass(selectedPerformance.status)">
                      {{ getStatusText(selectedPerformance.status) }}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <!-- 考核内容 -->
            <div class="detail-section">
              <h4 class="section-title">考核内容</h4>

              <!-- 数据指标 -->
              <div class="metrics-section">
                <h5 class="metrics-title">数据指标 (40分)</h5>
                <div class="metrics-grid">
                  <div v-if="selectedPerformance.data_metrics.new_service_fee" class="metric-item">
                    <div class="metric-header">
                      <span class="metric-name">新单服务费</span>
                      <span class="metric-score">{{ selectedPerformance.data_metrics.new_service_fee.score }}分</span>
                    </div>
                    <div class="metric-details">
                      目标: ${{ formatNumber(selectedPerformance.data_metrics.new_service_fee.target) }} |
                      实际: ${{ formatNumber(selectedPerformance.data_metrics.new_service_fee.actual) }}
                    </div>
                    <div class="metric-progress">
                      <div class="progress-bar">
                        <div
                          class="progress-fill"
                          :style="{ width: Math.min((selectedPerformance.data_metrics.new_service_fee.actual / selectedPerformance.data_metrics.new_service_fee.target) * 100, 100) + '%' }"
                        ></div>
                      </div>
                      <span class="progress-text">
                        {{ Math.round((selectedPerformance.data_metrics.new_service_fee.actual / selectedPerformance.data_metrics.new_service_fee.target) * 100) }}%
                      </span>
                    </div>
                  </div>

                  <div v-if="selectedPerformance.data_metrics.new_orders" class="metric-item">
                    <div class="metric-header">
                      <span class="metric-name">新单单量</span>
                      <span class="metric-score">{{ selectedPerformance.data_metrics.new_orders.score }}分</span>
                    </div>
                    <div class="metric-details">
                      目标: {{ selectedPerformance.data_metrics.new_orders.target }} 单 |
                      实际: {{ selectedPerformance.data_metrics.new_orders.actual }} 单
                    </div>
                    <div class="metric-progress">
                      <div class="progress-bar">
                        <div
                          class="progress-fill"
                          :style="{ width: Math.min((selectedPerformance.data_metrics.new_orders.actual / selectedPerformance.data_metrics.new_orders.target) * 100, 100) + '%' }"
                        ></div>
                      </div>
                      <span class="progress-text">
                        {{ Math.round((selectedPerformance.data_metrics.new_orders.actual / selectedPerformance.data_metrics.new_orders.target) * 100) }}%
                      </span>
                    </div>
                  </div>

                  <div v-if="selectedPerformance.data_metrics.new_customers" class="metric-item">
                    <div class="metric-header">
                      <span class="metric-name">新单客户数</span>
                      <span class="metric-score">{{ selectedPerformance.data_metrics.new_customers.score }}分</span>
                    </div>
                    <div class="metric-details">
                      目标: {{ selectedPerformance.data_metrics.new_customers.target }} 个 |
                      实际: {{ selectedPerformance.data_metrics.new_customers.actual }} 个
                    </div>
                    <div class="metric-progress">
                      <div class="progress-bar">
                        <div
                          class="progress-fill"
                          :style="{ width: Math.min((selectedPerformance.data_metrics.new_customers.actual / selectedPerformance.data_metrics.new_customers.target) * 100, 100) + '%' }"
                        ></div>
                      </div>
                      <span class="progress-text">
                        {{ Math.round((selectedPerformance.data_metrics.new_customers.actual / selectedPerformance.data_metrics.new_customers.target) * 100) }}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 客户评分 -->
              <div class="rating-section">
                <h5 class="rating-title">客户评分 (30分)</h5>
                <div class="rating-grid">
                  <div class="rating-item">
                    <span class="rating-name">客户满意度</span>
                    <span class="rating-score">{{ selectedPerformance.customer_rating.satisfaction }}分</span>
                  </div>
                  <div class="rating-item">
                    <span class="rating-name">服务质量</span>
                    <span class="rating-score">{{ selectedPerformance.customer_rating.service_quality }}分</span>
                  </div>
                  <div class="rating-item">
                    <span class="rating-name">响应速度</span>
                    <span class="rating-score">{{ selectedPerformance.customer_rating.response_speed }}分</span>
                  </div>
                </div>
                <div class="rating-total">
                  总分: {{ selectedPerformance.customer_rating.total_score }}分
                </div>
              </div>

              <!-- 上级评分 -->
              <div class="rating-section">
                <h5 class="rating-title">上级评分 (30分)</h5>
                <div class="rating-grid">
                  <div class="rating-item">
                    <span class="rating-name">工作态度</span>
                    <span class="rating-score">{{ selectedPerformance.supervisor_rating.work_attitude }}分</span>
                  </div>
                  <div class="rating-item">
                    <span class="rating-name">团队协作</span>
                    <span class="rating-score">{{ selectedPerformance.supervisor_rating.teamwork }}分</span>
                  </div>
                  <div class="rating-item">
                    <span class="rating-name">学习能力</span>
                    <span class="rating-score">{{ selectedPerformance.supervisor_rating.learning_ability }}分</span>
                  </div>
                  <div class="rating-item">
                    <span class="rating-name">创新能力</span>
                    <span class="rating-score">{{ selectedPerformance.supervisor_rating.innovation }}分</span>
                  </div>
                </div>
                <div class="rating-total">
                  总分: {{ selectedPerformance.supervisor_rating.total_score }}分
                </div>
              </div>
            </div>

            <!-- 考核结果 -->
            <div class="detail-section">
              <h4 class="section-title">考核结果</h4>
              <div class="result-grid">
                <div class="result-item">
                  <span class="result-label">总分</span>
                  <span class="result-value total-score" :class="getTotalScoreClass(selectedPerformance.total_score)">
                    {{ selectedPerformance.total_score }}分
                  </span>
                </div>
                <div class="result-item">
                  <span class="result-label">等级</span>
                  <span class="result-value">
                    <span class="grade-badge" :class="getGradeClass(selectedPerformance.grade)">
                      {{ getGradeText(selectedPerformance.grade) }}
                    </span>
                  </span>
                </div>
                <div class="result-item">
                  <span class="result-label">部门排名</span>
                  <span class="result-value">第{{ selectedPerformance.rank_in_department }}名</span>
                </div>
              </div>
              <div v-if="selectedPerformance.improvement_suggestions" class="improvement-suggestions">
                <h5>改进建议</h5>
                <p>{{ selectedPerformance.improvement_suggestions }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import {
  Plus,
  Search,
  Download,
  Users,
  Eye,
  Edit,
  Printer,
  Trash2,
  X
} from 'lucide-vue-next'
import { allPerformanceRecords, mockDepartments, allEmployees } from '@/mock/departments'
import type { PerformanceRecord, Department, Employee } from '@/types/departments'

// 响应式数据
const currentPage = ref(1)
const pageSize = ref(10)
const performances = ref<PerformanceRecord[]>([])
const departments = ref<Department[]>([])
const employees = ref<Employee[]>([])
const showDetailModal = ref(false)
const selectedPerformance = ref<PerformanceRecord | null>(null)

// 筛选条件
const filters = reactive({
  periodType: '',
  departmentId: '',
  employeeId: '',
  status: '',
  startDate: '',
  endDate: '',
  keyword: ''
})

// 计算属性
const filteredPerformances = computed(() => {
  let result = [...performances.value]

  if (filters.periodType) {
    result = result.filter(p => p.period_type === filters.periodType)
  }

  if (filters.departmentId) {
    result = result.filter(p => p.department_id === parseInt(filters.departmentId))
  }

  if (filters.employeeId) {
    result = result.filter(p => p.employee_id === parseInt(filters.employeeId))
  }

  if (filters.status) {
    result = result.filter(p => p.status === filters.status)
  }

  if (filters.startDate) {
    result = result.filter(p => p.created_at >= filters.startDate)
  }

  if (filters.endDate) {
    result = result.filter(p => p.created_at <= filters.endDate)
  }

  if (filters.keyword) {
    const keyword = filters.keyword.toLowerCase()
    result = result.filter(p =>
      p.employee_name.toLowerCase().includes(keyword)
    )
  }

  return result
})

const paginatedPerformances = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPerformances.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredPerformances.value.length / pageSize.value)
})

const availableEmployees = computed(() => {
  if (filters.departmentId) {
    return employees.value.filter(emp => emp.department_id === parseInt(filters.departmentId))
  }
  return employees.value
})

// 生命周期
onMounted(() => {
  loadPerformances()
  loadDepartments()
  loadEmployees()
})

// 方法
const loadPerformances = () => {
  performances.value = allPerformanceRecords
}

const loadDepartments = () => {
  departments.value = mockDepartments
}

const loadEmployees = () => {
  employees.value = allEmployees
}

const handleFilterChange = () => {
  currentPage.value = 1
}

const createPerformance = () => {
  alert('新建考核功能开发中...')
}

const editPerformance = (performance: PerformanceRecord) => {
  alert(`编辑考核: ${performance.employee_name}`)
}

const viewPerformance = (performance: PerformanceRecord) => {
  selectedPerformance.value = performance
  showDetailModal.value = true
}

const printReport = (performance: PerformanceRecord) => {
  alert(`打印报告: ${performance.employee_name}`)
}

const deletePerformance = (performance: PerformanceRecord) => {
  if (confirm(`确定要删除"${performance.employee_name}"的考核记录吗？`)) {
    performances.value = performances.value.filter(p => p.id !== performance.id)
    alert('考核记录删除成功！')
  }
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedPerformance.value = null
}

const batchEvaluation = () => {
  alert('批量考核功能开发中...')
}

const exportData = () => {
  alert('导出功能开发中...')
}

const getEmployeeId = (employeeId: number): string => {
  const employee = employees.value.find(e => e.id === employeeId)
  return employee?.employee_id || ''
}

const getPeriodTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    monthly: '月度',
    quarterly: '季度',
    yearly: '年度'
  }
  return typeMap[type] || type
}

const getDataMetricsScore = (performance: PerformanceRecord): number => {
  const metrics = performance.data_metrics
  let total = 0
  if (metrics.new_service_fee) total += metrics.new_service_fee.score
  if (metrics.new_orders) total += metrics.new_orders.score
  if (metrics.new_customers) total += metrics.new_customers.score
  if (metrics.service_fee) total += metrics.service_fee.score
  if (metrics.rebate) total += metrics.rebate.score
  return total
}

const getTotalScoreClass = (score: number): string => {
  if (score >= 90) return 'score--excellent'
  if (score >= 80) return 'score--good'
  if (score >= 70) return 'score--average'
  return 'score--poor'
}

const getGradeClass = (grade: string): string => {
  const gradeMap: Record<string, string> = {
    excellent: 'grade--excellent',
    good: 'grade--good',
    average: 'grade--average',
    poor: 'grade--poor'
  }
  return gradeMap[grade] || 'grade--average'
}

const getGradeText = (grade: string): string => {
  const gradeMap: Record<string, string> = {
    excellent: '优秀',
    good: '良好',
    average: '一般',
    poor: '较差'
  }
  return gradeMap[grade] || grade
}

const getStatusClass = (status: string): string => {
  const statusMap: Record<string, string> = {
    draft: 'status-badge--warning',
    completed: 'status-badge--success',
    approved: 'status-badge--info'
  }
  return statusMap[status] || 'status-badge--secondary'
}

const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    completed: '已完成',
    approved: '已审批'
  }
  return statusMap[status] || status
}

const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('zh-CN')
}

const formatNumber = (num: number): string => {
  return num.toLocaleString()
}
</script>

<style scoped>
.performance-panel {
  padding: 24px;
  background: var(--color-background);
  min-height: 100vh;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border);
}

.header-content h3 {
  margin: 0 0 8px 0;
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.header-content p {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn--primary {
  background: var(--color-primary);
  color: white;
}

.action-btn--primary:hover {
  background: var(--color-primary-dark, #1d4ed8);
}

.action-btn--secondary {
  background: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.action-btn--secondary:hover {
  background: var(--color-background-hover);
  border-color: var(--color-primary);
}

.performance-content {
  background: var(--color-surface);
  border-radius: 8px;
  overflow: hidden;
}

/* 筛选区域 */
.filter-section {
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface);
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: flex-end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 150px;
}

.filter-label {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text-primary);
}

.filter-select,
.filter-input {
  padding: 8px 12px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  background: var(--color-background);
  transition: border-color 0.2s ease;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.date-range {
  display: flex;
  align-items: center;
  gap: 8px;
}

.date-separator {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.search-input-wrapper {
  position: relative;
  min-width: 250px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-secondary);
}

.search-input {
  width: 100%;
  padding: 8px 12px 8px 40px;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

/* 绩效表格 */
.performance-table-section {
  background: var(--color-surface);
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.table-header__left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.table-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.record-count {
  font-size: 14px;
  color: var(--color-text-secondary);
  background: var(--color-background);
  padding: 4px 8px;
  border-radius: 4px;
}

.table-wrapper {
  overflow-x: auto;
}

.performance-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  min-width: 1200px;
}

.performance-table th {
  background: var(--color-background);
  padding: 16px 12px;
  text-align: left;
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 14px;
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.performance-table td {
  padding: 16px 12px;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 14px;
  color: var(--color-text-primary);
}

.performance-row:hover {
  background: var(--color-background);
}

.employee-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.employee-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.employee-id {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-family: monospace;
}

.period-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.period-text {
  font-weight: 500;
  color: var(--color-text-primary);
}

.period-type {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.score-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
  text-align: center;
}

.score-value {
  font-weight: 600;
  color: var(--color-text-primary);
}

.score-detail {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.total-score {
  font-weight: 700;
  font-size: 16px;
  text-align: center;
}

.score--excellent {
  color: #16a34a;
}

.score--good {
  color: #3b82f6;
}

.score--average {
  color: #f59e0b;
}

.score--poor {
  color: #dc2626;
}

.grade-badge,
.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 500;
  text-align: center;
}

.grade--excellent {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.grade--good {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.grade--average {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.grade--poor {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.status-badge--success {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.status-badge--warning {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-badge--info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge--secondary {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.action-buttons {
  display: flex;
  gap: 4px;
}

.action-btn-small {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn-small--info {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.action-btn-small--info:hover {
  background: #3b82f6;
  color: white;
}

.action-btn-small--primary {
  background: rgba(34, 197, 94, 0.1);
  color: #16a34a;
}

.action-btn-small--primary:hover {
  background: #16a34a;
  color: white;
}

.action-btn-small--success {
  background: rgba(168, 85, 247, 0.1);
  color: #a855f7;
}

.action-btn-small--success:hover {
  background: #a855f7;
  color: white;
}

.action-btn-small--danger {
  background: rgba(239, 68, 68, 0.1);
  color: #dc2626;
}

.action-btn-small--danger:hover {
  background: #dc2626;
  color: white;
}

/* 分页 */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-top: 1px solid var(--color-border);
  background: var(--color-background);
}

.pagination-info {
  font-size: 14px;
  color: var(--color-text-secondary);
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 12px;
}

.pagination-btn {
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-primary);
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.2s ease;
}

.pagination-btn:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.pagination-current {
  font-size: 14px;
  color: var(--color-text-primary);
  font-weight: 500;
}

/* 弹窗样式 */
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
  z-index: var(--z-modal, 1040);
}

.modal-container {
  background: var(--color-surface);
  border-radius: 8px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-container--large {
  width: 1000px;
  max-width: 95vw;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-background-secondary);
}

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
}

.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  border-radius: 4px;
  cursor: pointer;
  color: var(--color-text-secondary);
  transition: all 0.2s ease;
}

.modal-close:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.modal-content {
  flex: 1;
  overflow-y: auto;
  padding: 24px;
}

/* 绩效详情样式 */
.performance-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.detail-section {
  background: var(--color-background);
  border-radius: 8px;
  padding: 20px;
}

.section-title {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 8px;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 16px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.info-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: var(--color-text-primary);
}

/* 考核内容样式 */
.metrics-section,
.rating-section {
  margin-bottom: 24px;
}

.metrics-title,
.rating-title {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.metrics-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.metric-item {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 16px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.metric-name {
  font-weight: 500;
  color: var(--color-text-primary);
}

.metric-score {
  font-weight: 600;
  color: var(--color-primary);
}

.metric-details {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin-bottom: 8px;
}

.metric-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: var(--color-border);
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: var(--color-primary);
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  font-weight: 500;
  color: var(--color-text-primary);
  min-width: 40px;
}

.rating-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
  margin-bottom: 12px;
}

.rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 4px;
}

.rating-name {
  font-size: 14px;
  color: var(--color-text-primary);
}

.rating-score {
  font-weight: 600;
  color: var(--color-primary);
}

.rating-total {
  text-align: right;
  font-weight: 600;
  color: var(--color-text-primary);
  padding: 8px 12px;
  background: var(--color-background);
  border-radius: 4px;
}

/* 考核结果样式 */
.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.result-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  text-align: center;
}

.result-label {
  font-size: 12px;
  color: var(--color-text-secondary);
  font-weight: 500;
}

.result-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.improvement-suggestions {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  padding: 16px;
}

.improvement-suggestions h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.improvement-suggestions p {
  margin: 0;
  font-size: 14px;
  color: var(--color-text-primary);
  line-height: 1.5;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .performance-panel {
    padding: 16px;
  }

  .panel-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .header-actions {
    justify-content: flex-start;
    flex-wrap: wrap;
  }

  .filter-row {
    flex-direction: column;
    gap: 12px;
  }

  .filter-group {
    min-width: auto;
  }

  .search-input-wrapper {
    min-width: auto;
  }

  .table-wrapper {
    overflow-x: scroll;
  }

  .performance-table {
    min-width: 1000px;
  }

  .pagination-section {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .rating-grid {
    grid-template-columns: 1fr;
  }

  .result-grid {
    grid-template-columns: 1fr;
  }

  .modal-container--large {
    width: 95vw;
    margin: 20px;
  }

  .modal-header-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
