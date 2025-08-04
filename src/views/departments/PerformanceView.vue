<template>
  <div class="performance-view">
    <div class="page-header">
      <h1 class="page-title">绩效管理</h1>
      <p class="page-description">多层级绩效考核管理系统</p>
    </div>

    <!-- 时间周期切换器 -->
    <div class="period-switcher">
      <div class="period-tabs">
        <button
          v-for="period in periodTypes"
          :key="period.value"
          class="period-tab"
          :class="{ 'period-tab--active': selectedPeriodType === period.value }"
          @click="selectedPeriodType = period.value"
        >
          <component :is="period.icon" :size="16" />
          {{ period.label }}
        </button>
      </div>

      <div class="period-selector">
        <select v-model="selectedPeriod" class="period-select">
          <option v-for="period in availablePeriods" :key="period.value" :value="period.value">
            {{ period.label }}
          </option>
        </select>
      </div>
    </div>

    <!-- 筛选器和操作区 -->
    <div class="filters-section">
      <div class="filters">
        <!-- 部门筛选 -->
        <div class="filter-group">
          <label class="filter-label">部门筛选</label>
          <select v-model="selectedDepartment" class="filter-select">
            <option value="">全部部门</option>
            <option value="sales">销售部</option>
            <option value="operations">运营部</option>
          </select>
        </div>

        <!-- 职级筛选 -->
        <div class="filter-group">
          <label class="filter-label">职级筛选</label>
          <select v-model="selectedPositionLevel" class="filter-select">
            <option value="">全部职级</option>
            <option value="staff">普通员工</option>
            <option value="manager">管理层</option>
          </select>
        </div>

        <!-- 状态筛选 -->
        <div class="filter-group">
          <label class="filter-label">考核状态</label>
          <select v-model="selectedStatus" class="filter-select">
            <option value="">全部状态</option>
            <option value="draft">草稿</option>
            <option value="in_progress">进行中</option>
            <option value="completed">已完成</option>
            <option value="approved">已审批</option>
          </select>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="action-buttons">
        <button
          v-if="canSetTargets"
          class="btn btn--primary"
          @click="showTargetModal = true"
        >
          <Target :size="16" />
          设置目标
        </button>

        <button
          v-if="canRate"
          class="btn btn--secondary"
          @click="showRatingModal = true"
        >
          <Star :size="16" />
          评分录入
        </button>

        <button class="btn btn--outline" @click="exportData">
          <Download :size="16" />
          导出数据
        </button>
      </div>
    </div>

    <!-- 统计概览卡片 -->
    <div class="stats-overview">
      <div class="stat-card stat-card--primary">
        <div class="stat-icon">
          <Users :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.totalEmployees }}</div>
          <div class="stat-label">参与考核人数</div>
          <div class="stat-trend">
            <TrendingUp :size="12" />
            <span>+5.2%</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--success">
        <div class="stat-icon">
          <Award :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.averageScore.toFixed(1) }}</div>
          <div class="stat-label">平均综合得分</div>
          <div class="stat-trend">
            <TrendingUp :size="12" />
            <span>+2.1%</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--info">
        <div class="stat-icon">
          <CheckCircle :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.completedCount }}</div>
          <div class="stat-label">已完成考核</div>
          <div class="stat-progress">
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: `${(stats.completedCount / stats.totalEmployees) * 100}%` }"
              ></div>
            </div>
            <span>{{ ((stats.completedCount / stats.totalEmployees) * 100).toFixed(1) }}%</span>
          </div>
        </div>
      </div>

      <div class="stat-card stat-card--warning">
        <div class="stat-icon">
          <Clock :size="20" />
        </div>
        <div class="stat-content">
          <div class="stat-value">{{ stats.pendingCount }}</div>
          <div class="stat-label">待完成考核</div>
          <div class="stat-deadline">
            <AlertCircle :size="12" />
            <span>{{ daysUntilDeadline }}天截止</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 绩效列表 -->
    <div class="performance-table-container">
      <div class="table-header">
        <h3>绩效考核列表</h3>
        <div class="table-actions">
          <div class="view-toggle">
            <button
              class="view-btn"
              :class="{ 'view-btn--active': viewMode === 'table' }"
              @click="viewMode = 'table'"
            >
              <List :size="16" />
              列表视图
            </button>
            <button
              class="view-btn"
              :class="{ 'view-btn--active': viewMode === 'card' }"
              @click="viewMode = 'card'"
            >
              <Grid :size="16" />
              卡片视图
            </button>
          </div>
          <button class="btn btn--secondary" @click="refreshData">
            <RefreshCw :size="16" />
            刷新
          </button>
        </div>
      </div>

      <!-- 表格视图 -->
      <div v-if="viewMode === 'table'" class="table-wrapper">
        <table class="performance-table">
          <thead>
            <tr>
              <th @click="sortBy('employee_name')" class="sortable">
                员工姓名
                <ChevronUp v-if="sortField === 'employee_name' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'employee_name' && sortOrder === 'desc'" :size="14" />
              </th>
              <th>部门</th>
              <th>职位</th>
              <th>考核周期</th>
              <th @click="sortBy('data_score')" class="sortable">
                {{ getDataScoreLabel() }}
                <ChevronUp v-if="sortField === 'data_score' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'data_score' && sortOrder === 'desc'" :size="14" />
              </th>
              <!-- 客户评价列 - 仅运营部门显示 -->
              <th v-if="shouldShowCustomerScore()" @click="sortBy('customer_score')" class="sortable">
                客户评价
                <ChevronUp v-if="sortField === 'customer_score' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'customer_score' && sortOrder === 'desc'" :size="14" />
              </th>
              <th @click="sortBy('intelligent_score')" class="sortable">
                {{ getIntelligentScoreLabel() }}
                <ChevronUp v-if="sortField === 'intelligent_score' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'intelligent_score' && sortOrder === 'desc'" :size="14" />
              </th>
              <th @click="sortBy('total_score')" class="sortable">
                综合得分
                <ChevronUp v-if="sortField === 'total_score' && sortOrder === 'asc'" :size="14" />
                <ChevronDown v-if="sortField === 'total_score' && sortOrder === 'desc'" :size="14" />
              </th>
              <th>等级</th>
              <th>排名</th>
              <th>状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="record in filteredRecords" :key="record.id" class="table-row">
              <td>
                <div class="employee-info">
                  <div class="employee-avatar">
                    {{ record.employee_name.charAt(0) }}
                  </div>
                  <div class="employee-details">
                    <div class="employee-name">{{ record.employee_name }}</div>
                    <div class="employee-position">{{ record.employee_position }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="department-badge" :class="`department-${record.department_type}`">
                  {{ record.department_name }}
                </span>
              </td>
              <td>{{ record.employee_position }}</td>
              <td>{{ formatPeriod(record.period, record.period_type) }}</td>
              <td>
                <div class="score-cell">
                  <span class="score-value">{{ record.data_score.toFixed(1) }}</span>
                  <span class="score-weight">({{ record.data_weight }}%)</span>
                  <div class="score-breakdown" v-if="record.department_type === 'sales'">
                    <small>{{ getSalesDataBreakdown(record) }}</small>
                  </div>
                  <div class="score-breakdown" v-else>
                    <small>{{ getOperationsDataBreakdown(record) }}</small>
                  </div>
                </div>
              </td>
              <!-- 客户评价列 - 仅运营部门显示 -->
              <td v-if="shouldShowCustomerScore()">
                <div class="score-cell" v-if="record.department_type === 'operations'">
                  <span class="score-value">{{ (record.customer_score || 0).toFixed(1) }}</span>
                  <span class="score-weight">({{ record.customer_weight }}%)</span>
                  <div class="score-breakdown">
                    <small>服务质量评价</small>
                  </div>
                </div>
                <div class="score-cell score-na" v-else>
                  <span class="score-value">-</span>
                  <span class="score-weight">不适用</span>
                </div>
              </td>
              <td>
                <div class="score-cell">
                  <span class="score-value">{{ record.intelligent_score.toFixed(1) }}</span>
                  <span class="score-weight">({{ record.intelligent_weight }}%)</span>
                  <div class="score-breakdown" v-if="record.department_type === 'sales'">
                    <small>{{ getSalesIntelligentBreakdown(record) }}</small>
                  </div>
                  <div class="score-breakdown" v-else>
                    <small>{{ getOperationsIntelligentBreakdown(record) }}</small>
                  </div>
                </div>
              </td>
              <td>
                <div class="score-cell total-score-cell">
                  <span class="score-value total-score">{{ record.total_score.toFixed(1) }}</span>
                </div>
              </td>
              <td>
                <span
                  class="grade-badge"
                  :style="{ backgroundColor: getGradeColor(record.grade) }"
                >
                  {{ record.grade }}
                </span>
              </td>
              <td>
                <div class="rank-info">
                  <span class="rank-number">{{ record.rank_in_department }}</span>
                  <span class="rank-label">/ {{ record.rank_in_company }}</span>
                </div>
              </td>
              <td>
                <span class="status-badge" :class="`status-${record.status}`">
                  {{ getStatusText(record.status) }}
                </span>
              </td>
              <td>
                <div class="action-buttons">
                  <button class="btn-icon" @click="viewDetails(record)" title="查看详情">
                    <Eye :size="16" />
                  </button>
                  <button
                    v-if="canEditRecord(record)"
                    class="btn-icon"
                    @click="editRecord(record)"
                    title="编辑"
                  >
                    <Edit :size="16" />
                  </button>
                  <button
                    v-if="canRateEmployee(record.employee_id)"
                    class="btn-icon"
                    @click="rateEmployee(record)"
                    title="评分"
                  >
                    <Star :size="16" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- 卡片视图 -->
      <div v-if="viewMode === 'card'" class="cards-grid">
        <div v-for="record in filteredRecords" :key="record.id" class="performance-card">
          <div class="card-header">
            <div class="employee-info">
              <div class="employee-avatar">
                {{ record.employee_name.charAt(0) }}
              </div>
              <div class="employee-details">
                <h4 class="employee-name">{{ record.employee_name }}</h4>
                <p class="employee-meta">{{ record.department_name }} · {{ record.employee_position }}</p>
              </div>
            </div>
            <div class="card-actions">
              <span
                class="grade-badge"
                :style="{ backgroundColor: getGradeColor(record.grade) }"
              >
                {{ record.grade }}
              </span>
            </div>
          </div>

          <div class="card-content">
            <div class="score-summary">
              <div class="total-score">
                <span class="score-label">综合得分</span>
                <span class="score-value">{{ record.total_score.toFixed(1) }}</span>
              </div>
              <div class="rank-info">
                <span class="rank-label">部门排名</span>
                <span class="rank-value">{{ record.rank_in_department }}</span>
              </div>
            </div>

            <div class="score-breakdown">
              <div class="score-item">
                <span class="score-name">数据指标</span>
                <div class="score-bar">
                  <div
                    class="score-fill"
                    :style="{ width: `${record.data_score}%` }"
                  ></div>
                </div>
                <span class="score-text">{{ record.data_score.toFixed(1) }}</span>
              </div>

              <div class="score-item">
                <span class="score-name">智能方案</span>
                <div class="score-bar">
                  <div
                    class="score-fill"
                    :style="{ width: `${record.intelligent_score}%` }"
                  ></div>
                </div>
                <span class="score-text">{{ record.intelligent_score.toFixed(1) }}</span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <span class="status-badge" :class="`status-${record.status}`">
              {{ getStatusText(record.status) }}
            </span>
            <div class="card-actions">
              <button class="btn-icon" @click="viewDetails(record)" title="查看详情">
                <Eye :size="16" />
              </button>
              <button
                v-if="canEditRecord(record)"
                class="btn-icon"
                @click="editRecord(record)"
                title="编辑"
              >
                <Edit :size="16" />
              </button>
              <button
                v-if="canRateEmployee(record.employee_id)"
                class="btn-icon"
                @click="rateEmployee(record)"
                title="评分"
              >
                <Star :size="16" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情弹窗 -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="modal-container modal-container--large" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">绩效详情 - {{ selectedRecord?.employee_name }}</h3>
          <button class="modal-close" @click="closeDetailModal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-content">
          <div v-if="selectedRecord" class="performance-detail">
            <!-- 基本信息 -->
            <div class="detail-section">
              <h4 class="section-title">
                <User :size="20" />
                基本信息
              </h4>
              <div class="info-grid">
                <div class="info-item">
                  <label>员工姓名</label>
                  <span>{{ selectedRecord.employee_name }}</span>
                </div>
                <div class="info-item">
                  <label>部门</label>
                  <span>{{ selectedRecord.department_name }}</span>
                </div>
                <div class="info-item">
                  <label>职位</label>
                  <span>{{ selectedRecord.employee_position }}</span>
                </div>
                <div class="info-item">
                  <label>考核周期</label>
                  <span>{{ formatPeriod(selectedRecord.period, selectedRecord.period_type) }}</span>
                </div>
                <div class="info-item">
                  <label>综合得分</label>
                  <span class="total-score">{{ selectedRecord.total_score.toFixed(1) }}</span>
                </div>
                <div class="info-item">
                  <label>绩效等级</label>
                  <span
                    class="grade-badge"
                    :style="{ backgroundColor: getGradeColor(selectedRecord.grade) }"
                  >
                    {{ selectedRecord.grade }} - {{ getGradeDescription(selectedRecord.grade) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- 得分详情 -->
            <div class="detail-section">
              <h4 class="section-title">
                <BarChart :size="20" />
                得分详情
              </h4>
              <div class="score-breakdown-detail">
                <!-- 数据指标得分 -->
                <div class="score-category">
                  <div class="category-header">
                    <h5>数据指标得分</h5>
                    <span class="category-score">{{ selectedRecord.data_score.toFixed(1) }} (权重: {{ selectedRecord.data_weight }}%)</span>
                  </div>
                  <div class="metrics-list">
                    <div v-for="(metric, key) in selectedRecord.data_metrics" :key="key" class="metric-item">
                      <div class="metric-info">
                        <span class="metric-name">{{ getMetricName(key) }}</span>
                        <span class="metric-progress">{{ metric.actual }} / {{ metric.target }}</span>
                      </div>
                      <div class="metric-score">
                        <span class="completion-rate" :class="getCompletionRateClass(metric.completion_rate)">
                          {{ metric.completion_rate.toFixed(1) }}%
                        </span>
                        <span class="score">{{ metric.score.toFixed(1) }}分</span>
                      </div>
                    </div>
                  </div>
                </div>



                <!-- 智能方案考核得分 -->
                <div class="score-category">
                  <div class="category-header">
                    <h5>智能方案考核得分</h5>
                    <span class="category-score">{{ selectedRecord.intelligent_score.toFixed(1) }} (权重: {{ selectedRecord.intelligent_weight }}%)</span>
                  </div>
                  <div class="intelligent-ratings-list">
                    <div v-for="(rating, key) in selectedRecord.intelligent_ratings" :key="key" class="intelligent-item">
                      <span class="intelligent-name">{{ getIntelligentRatingName(key) }}</span>
                      <div class="intelligent-score">
                        <div class="score-bar">
                          <div
                            class="score-fill"
                            :style="{ width: `${(rating / 25) * 100}%` }"
                          ></div>
                        </div>
                        <span class="score-text">{{ rating }}分</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 客户评价得分 -->
            <div v-if="selectedRecord.customer_score > 0" class="detail-section">
              <h4 class="section-title">
                <Star :size="20" />
                客户评价得分
              </h4>
              <div class="score-breakdown-detail">
                <div class="score-category">
                  <div class="category-header">
                    <h5>客户评价得分</h5>
                    <span class="category-score">{{ selectedRecord.customer_score.toFixed(1) }} (权重: {{ selectedRecord.customer_weight }}%)</span>
                  </div>
                  <div class="customer-ratings-list">
                    <div v-for="(rating, key) in selectedRecord.customer_ratings" :key="key" class="customer-rating-item">
                      <div class="rating-info">
                        <span class="rating-name">{{ getCustomerRatingName(key) }}</span>
                        <div class="rating-stars">
                          <span v-for="star in 5" :key="star" class="star" :class="{ 'star-filled': star <= rating }">
                            ★
                          </span>
                        </div>
                      </div>
                      <div class="rating-score">
                        <span class="rating-value">{{ rating.toFixed(1) }}</span>
                        <span class="rating-max">/5.0</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 评价备注 -->
            <div v-if="selectedRecord.comments" class="detail-section">
              <h4 class="section-title">
                <MessageSquare :size="20" />
                评价备注
              </h4>
              <div class="comments-content">
                {{ selectedRecord.comments }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 目标设置弹窗 -->
    <div v-if="showTargetModal" class="modal-overlay" @click="closeTargetModal">
      <div class="modal-container modal-container--medium" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">设置绩效目标</h3>
          <button class="modal-close" @click="closeTargetModal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="submitTarget" class="target-form">
            <div class="form-group">
              <label class="form-label">选择员工</label>
              <select v-model="targetForm.employee_id" class="form-select" required>
                <option value="">请选择员工</option>
                <option v-for="emp in targetableEmployees" :key="emp.id" :value="emp.id">
                  {{ emp.name }} - {{ emp.position }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">考核周期</label>
              <select v-model="targetForm.period" class="form-select" required>
                <option v-for="period in availablePeriods" :key="period.value" :value="period.value">
                  {{ period.label }}
                </option>
              </select>
            </div>

            <div v-if="targetForm.employee_id" class="metrics-section">
              <h4>指标目标设置</h4>
              <div v-for="metric in getEmployeeMetrics(targetForm.employee_id)" :key="metric.id" class="metric-input">
                <label class="metric-label">{{ metric.name }} ({{ metric.unit }})</label>
                <input
                  v-model.number="targetForm.metrics[metric.target_field]"
                  type="number"
                  class="form-input"
                  :placeholder="`请输入${metric.name}目标值`"
                  required
                />
              </div>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn--secondary" @click="closeTargetModal">
                取消
              </button>
              <button type="submit" class="btn btn--primary">
                保存目标
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 评分录入弹窗 -->
    <div v-if="showRatingModal" class="modal-overlay" @click="closeRatingModal">
      <div class="modal-container modal-container--medium" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">智能方案考核评分</h3>
          <button class="modal-close" @click="closeRatingModal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-content">
          <form @submit.prevent="submitRating" class="rating-form">
            <div class="form-group">
              <label class="form-label">选择员工</label>
              <select v-model="ratingForm.employee_id" class="form-select" required>
                <option value="">请选择员工</option>
                <option v-for="emp in ratableEmployees" :key="emp.id" :value="emp.id">
                  {{ emp.name }} - {{ emp.position }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label class="form-label">考核周期</label>
              <select v-model="ratingForm.period" class="form-select" required>
                <option v-for="period in availablePeriods" :key="period.value" :value="period.value">
                  {{ period.label }}
                </option>
              </select>
            </div>

            <div v-if="ratingForm.employee_id" class="assessment-section">
              <h4>评分项目</h4>
              <div v-for="item in getAssessmentItems(ratingForm.employee_id)" :key="item.id" class="assessment-item">
                <div class="item-header">
                  <label class="item-label">{{ item.name }}</label>
                  <span class="item-score">{{ ratingForm.scores[item.id] || 0 }} / {{ item.max_score }}</span>
                </div>
                <p class="item-description">{{ item.description }}</p>
                <input
                  v-model.number="ratingForm.scores[item.id]"
                  type="range"
                  :min="0"
                  :max="item.max_score"
                  class="score-slider"
                />
              </div>
            </div>

            <div class="form-group">
              <label class="form-label">评价备注</label>
              <textarea
                v-model="ratingForm.comments"
                class="form-textarea"
                placeholder="请输入评价备注..."
                rows="3"
              ></textarea>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn--secondary" @click="closeRatingModal">
                取消
              </button>
              <button type="submit" class="btn btn--primary">
                提交评分
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, reactive } from 'vue'
import {
  Calendar,
  BarChart,
  TrendingUp,
  Users,
  Award,
  CheckCircle,
  Clock,
  AlertCircle,
  Target,
  Star,
  Download,
  List,
  Grid,
  RefreshCw,
  Eye,
  Edit,
  ChevronUp,
  ChevronDown,
  X,
  User,
  MessageSquare,
  Save
} from 'lucide-vue-next'
import {
  currentUserRole,
  currentUserId,
  newPerformanceRecords,
  metricConfigs,
  intelligentAssessmentConfigs,
  weightConfigs,
  performanceTargets,
  performanceRatings,
  getEmployeesByRole,
  getTargetSettableEmployees,
  getRatableEmployees,
  getGradeColor,
  getGradeDescription
} from '@/mock/performance'
import { allEmployees } from '@/mock/departments'
import type {
  NewPerformanceRecord,
  MetricConfig,
  IntelligentAssessmentConfig,
  PerformanceTarget,
  PerformanceRating,
  UserRole,
  PeriodType,
  DepartmentType,
  PositionLevel
} from '@/types/departments'

// 响应式数据
const selectedPeriodType = ref<PeriodType>('monthly')
const selectedPeriod = ref('2024-01')
const selectedDepartment = ref<DepartmentType | ''>('')
const selectedPositionLevel = ref<PositionLevel | ''>('')
const selectedStatus = ref('')
const viewMode = ref<'table' | 'card'>('table')
const sortField = ref('')
const sortOrder = ref<'asc' | 'desc'>('desc')

// 模态框状态
const showDetailModal = ref(false)
const showTargetModal = ref(false)
const showRatingModal = ref(false)
const selectedRecord = ref<NewPerformanceRecord | null>(null)

// 表单数据
const targetForm = reactive({
  employee_id: 0,
  period: '',
  metrics: {} as Record<string, number>
})

const ratingForm = reactive({
  employee_id: 0,
  period: '',
  scores: {} as Record<string, number>,
  comments: ''
})

// 数据
const performanceRecords = ref<NewPerformanceRecord[]>([])
const employees = ref(allEmployees)

// 计算属性
const periodTypes = computed(() => [
  { value: 'monthly' as PeriodType, label: '月度考核', icon: Calendar },
  { value: 'quarterly' as PeriodType, label: '季度考核', icon: BarChart },
  { value: 'yearly' as PeriodType, label: '年度考核', icon: TrendingUp }
])

const availablePeriods = computed(() => {
  const periods = []
  const currentYear = 2024

  if (selectedPeriodType.value === 'monthly') {
    for (let month = 1; month <= 12; month++) {
      const value = `${currentYear}-${month.toString().padStart(2, '0')}`
      const label = `${currentYear}年${month}月`
      periods.push({ value, label })
    }
  } else if (selectedPeriodType.value === 'quarterly') {
    for (let quarter = 1; quarter <= 4; quarter++) {
      const value = `${currentYear}-Q${quarter}`
      const label = `${currentYear}年第${quarter}季度`
      periods.push({ value, label })
    }
  } else if (selectedPeriodType.value === 'yearly') {
    const value = currentYear.toString()
    const label = `${currentYear}年`
    periods.push({ value, label })
  }

  return periods
})

// 权限相关计算属性
const viewableEmployeeIds = computed(() => {
  return getEmployeesByRole(currentUserRole, currentUserId)
})

const canSetTargets = computed(() => {
  return getTargetSettableEmployees(currentUserRole, currentUserId).length > 0
})

const canRate = computed(() => {
  return getRatableEmployees(currentUserRole, currentUserId).length > 0
})

const targetableEmployees = computed(() => {
  const targetableIds = getTargetSettableEmployees(currentUserRole, currentUserId)
  return employees.value.filter(emp => targetableIds.includes(emp.id))
})

const ratableEmployees = computed(() => {
  const ratableIds = getRatableEmployees(currentUserRole, currentUserId)
  return employees.value.filter(emp => ratableIds.includes(emp.id))
})

// 筛选后的绩效记录
const filteredRecords = computed(() => {
  let result = performanceRecords.value.filter(record => {
    // 权限过滤
    if (!viewableEmployeeIds.value.includes(record.employee_id)) {
      return false
    }

    // 周期类型过滤
    if (record.period_type !== selectedPeriodType.value) {
      return false
    }

    // 具体周期过滤
    if (record.period !== selectedPeriod.value) {
      return false
    }

    // 部门过滤
    if (selectedDepartment.value && record.department_type !== selectedDepartment.value) {
      return false
    }

    // 职级过滤
    if (selectedPositionLevel.value && record.position_level !== selectedPositionLevel.value) {
      return false
    }

    // 状态过滤
    if (selectedStatus.value && record.status !== selectedStatus.value) {
      return false
    }

    return true
  })

  // 排序
  if (sortField.value) {
    result.sort((a, b) => {
      const aValue = a[sortField.value as keyof NewPerformanceRecord]
      const bValue = b[sortField.value as keyof NewPerformanceRecord]

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortOrder.value === 'asc' ? aValue - bValue : bValue - aValue
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortOrder.value === 'asc'
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue)
      }

      return 0
    })
  }

  return result
})

// 统计数据
const stats = computed(() => {
  const records = filteredRecords.value
  return {
    totalEmployees: records.length,
    averageScore: records.length > 0
      ? records.reduce((sum, r) => sum + r.total_score, 0) / records.length
      : 0,
    completedCount: records.filter(r => r.status === 'completed' || r.status === 'approved').length,
    pendingCount: records.filter(r => r.status === 'draft' || r.status === 'in_progress').length
  }
})

const daysUntilDeadline = computed(() => {
  // 模拟计算截止日期
  return 15
})

// 生命周期
onMounted(() => {
  loadData()
})

// 方法
const loadData = () => {
  performanceRecords.value = newPerformanceRecords
}

const refreshData = () => {
  loadData()
}

const sortBy = (field: string) => {
  if (sortField.value === field) {
    sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortField.value = field
    sortOrder.value = 'desc'
  }
}

const formatPeriod = (period: string, periodType: PeriodType) => {
  if (periodType === 'monthly') {
    const [year, month] = period.split('-')
    return `${year}年${parseInt(month)}月`
  } else if (periodType === 'quarterly') {
    const [year, quarter] = period.split('-Q')
    return `${year}年第${quarter}季度`
  } else {
    return `${period}年`
  }
}

const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    in_progress: '进行中',
    completed: '已完成',
    approved: '已审批'
  }
  return statusMap[status] || status
}

const getMetricName = (key: string) => {
  const metric = metricConfigs.find(m => m.target_field === key)
  return metric?.name || key
}

const getRatingName = (key: string) => {
  const ratingMap: Record<string, string> = {
    satisfaction: '客户满意度',
    service_quality: '服务质量',
    response_speed: '响应速度',
    professionalism: '专业性'
  }
  return ratingMap[key] || key
}

const getIntelligentRatingName = (key: string) => {
  // 查找智能方案考核项目名称
  for (const config of intelligentAssessmentConfigs) {
    const item = config.items.find(item => item.id === key)
    if (item) return item.name
  }
  return key
}

const getCustomerRatingName = (key: string) => {
  const ratingMap: Record<string, string> = {
    satisfaction: '客户满意度',
    service_quality: '服务质量',
    response_speed: '响应速度',
    professionalism: '专业性',
    communication: '沟通能力',
    problem_solving: '问题解决能力'
  }
  return ratingMap[key] || key
}

const getCompletionRateClass = (rate: number) => {
  if (rate >= 100) return 'completion-excellent'
  if (rate >= 80) return 'completion-good'
  if (rate >= 60) return 'completion-average'
  return 'completion-poor'
}

// 部门特定的表格列显示方法
const shouldShowCustomerScore = () => {
  // 如果选择了特定部门，根据部门决定是否显示客户评价列
  if (selectedDepartment.value === 'sales') return false
  if (selectedDepartment.value === 'operations') return true
  // 如果显示全部部门，检查是否有运营部门的记录
  return filteredRecords.value.some(record => record.department_type === 'operations')
}

const getDataScoreLabel = () => {
  if (selectedDepartment.value === 'sales') return '业绩指标'
  if (selectedDepartment.value === 'operations') return '服务指标'
  return '数据得分'
}

const getIntelligentScoreLabel = () => {
  if (selectedDepartment.value === 'sales') return '销售能力'
  if (selectedDepartment.value === 'operations') return '职能方案'
  return '智能方案'
}

// 销售部门数据指标细分
const getSalesDataBreakdown = (record: any) => {
  const breakdowns = []
  if (record.metrics?.new_service_fee) {
    const rate = (record.metrics.new_service_fee / 100000 * 100).toFixed(0)
    breakdowns.push(`新单服务费: ${rate}%`)
  }
  if (record.metrics?.new_orders) {
    const rate = (record.metrics.new_orders / 50 * 100).toFixed(0)
    breakdowns.push(`新单数量: ${rate}%`)
  }
  return breakdowns.join(' | ') || '业绩完成情况'
}

// 运营部门数据指标细分
const getOperationsDataBreakdown = (record: any) => {
  const breakdowns = []
  if (record.metrics?.service_fee) {
    const rate = (record.metrics.service_fee / 80000 * 100).toFixed(0)
    breakdowns.push(`服务费: ${rate}%`)
  }
  if (record.metrics?.rebate) {
    const rate = (record.metrics.rebate / 20000 * 100).toFixed(0)
    breakdowns.push(`返点: ${rate}%`)
  }
  return breakdowns.join(' | ') || '服务完成情况'
}

// 销售部门智能方案细分
const getSalesIntelligentBreakdown = (record: any) => {
  if (record.employee_position?.includes('经理')) {
    return '团队管理 | 流程规范 | 策略制定'
  }
  return '客户拜访 | 销售技能 | 目标达成'
}

// 运营部门智能方案细分
const getOperationsIntelligentBreakdown = (record: any) => {
  if (record.employee_position?.includes('经理')) {
    return '团队管理 | 客户评价 | 知识输出'
  }
  return '服务质量 | 沟通协作 | 工作执行'
}

// 权限检查方法
const canEditRecord = (record: NewPerformanceRecord) => {
  // 只有总经理和相关管理层可以编辑
  return ['general_manager', 'sales_director', 'project_director'].includes(currentUserRole)
}

const canRateEmployee = (employeeId: number) => {
  return getRatableEmployees(currentUserRole, currentUserId).includes(employeeId)
}

// 模态框操作方法
const viewDetails = (record: NewPerformanceRecord) => {
  selectedRecord.value = record
  showDetailModal.value = true
}

const closeDetailModal = () => {
  showDetailModal.value = false
  selectedRecord.value = null
}

const editRecord = (record: NewPerformanceRecord) => {
  // 编辑绩效记录
  console.log('编辑绩效记录:', record)
}

const rateEmployee = (record: NewPerformanceRecord) => {
  ratingForm.employee_id = record.employee_id
  ratingForm.period = record.period
  ratingForm.scores = {}
  ratingForm.comments = ''
  showRatingModal.value = true
}

const closeTargetModal = () => {
  showTargetModal.value = false
  targetForm.employee_id = 0
  targetForm.period = ''
  targetForm.metrics = {}
}

const closeRatingModal = () => {
  showRatingModal.value = false
  ratingForm.employee_id = 0
  ratingForm.period = ''
  ratingForm.scores = {}
  ratingForm.comments = ''
}

// 获取员工相关的指标配置
const getEmployeeMetrics = (employeeId: number) => {
  const employee = employees.value.find(emp => emp.id === employeeId)
  if (!employee) return []

  // 根据员工的部门和职级获取对应的指标配置
  const departmentType = employee.department_name === '销售部' ? 'sales' : 'operations'
  const positionLevel = employee.position?.includes('经理') ? 'manager' : 'staff'

  return metricConfigs.filter(config =>
    config.department === departmentType &&
    config.position_level === positionLevel &&
    config.period_type === selectedPeriodType.value
  )
}

// 获取员工的智能方案考核项目
const getAssessmentItems = (employeeId: number) => {
  const employee = employees.value.find(emp => emp.id === employeeId)
  if (!employee) return []

  const departmentType = employee.department_name === '销售部' ? 'sales' : 'operations'
  const positionLevel = employee.position?.includes('经理') ? 'manager' : 'staff'

  const config = intelligentAssessmentConfigs.find(config =>
    config.department === departmentType &&
    config.position_level === positionLevel &&
    config.evaluator_role === currentUserRole
  )

  return config?.items || []
}

// 表单提交方法
const submitTarget = () => {
  // 提交目标设置
  console.log('提交目标设置:', targetForm)
  closeTargetModal()
}

const submitRating = () => {
  // 提交评分
  console.log('提交评分:', ratingForm)
  closeRatingModal()
}

const exportData = () => {
  // 导出数据
  console.log('导出数据')
}


</script>

<style scoped>
.performance-view {
  padding: 24px;
  background: var(--color-background);
  min-height: 100vh;
}

.page-header {
  margin-bottom: 32px;
}

.page-title {
  margin: 0 0 8px 0;
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary);
}

.page-description {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: 16px;
}

/* 时间周期切换器 */
.period-switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 20px;
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.period-tabs {
  display: flex;
  gap: 8px;
}

.period-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text-secondary);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 14px;
  font-weight: 500;
}

.period-tab:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.period-tab--active {
  background: var(--color-primary);
  color: white;
  border-color: var(--color-primary);
}

.period-selector {
  min-width: 200px;
}

.period-select {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text-primary);
  font-size: 14px;
  cursor: pointer;
}

.period-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

/* 筛选器和操作区 */
.filters-section {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
  padding: 20px;
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  gap: 20px;
}

.filters {
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

.filter-select {
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  font-size: 14px;
  background: var(--color-background);
  color: var(--color-text-primary);
  cursor: pointer;
  transition: border-color 0.2s ease;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.action-buttons {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-decoration: none;
}

.btn--primary {
  background: var(--color-primary);
  color: white;
}

.btn--primary:hover {
  background: #2563eb;
  transform: translateY(-1px);
}

.btn--secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
}

.btn--secondary:hover {
  background: var(--color-background);
  border-color: var(--color-primary);
}

.btn--outline {
  background: transparent;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.btn--outline:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
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

/* 统计概览卡片 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}

/* 响应式布局 */
@media (max-width: 1200px) {
  .stats-overview {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .stats-overview {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .stat-card {
    padding: 14px;
    min-height: 70px;
  }

  .stat-value {
    font-size: 20px;
  }

  .stat-label {
    font-size: 12px;
  }
}

.stat-card {
  padding: 16px;
  background: var(--color-surface);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 12px;
  transition: all 0.2s ease;
  min-height: 80px;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-card--primary .stat-icon {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

.stat-card--success .stat-icon {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.stat-card--info .stat-icon {
  background: rgba(6, 182, 212, 0.1);
  color: #06b6d4;
}

.stat-card--warning .stat-icon {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.stat-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0 0 2px 0;
  line-height: 1.2;
}

.stat-label {
  font-size: 13px;
  color: var(--color-text-secondary);
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #10b981;
  font-weight: 500;
}

.stat-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.progress-bar {
  flex: 1;
  height: 4px;
  background: var(--color-border-light);
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #06b6d4;
  transition: width 0.3s ease;
}

.stat-deadline {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #f59e0b;
  font-weight: 500;
}

/* 绩效表格容器 */
.performance-table-container {
  background: var(--color-surface);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid var(--color-border);
}

.table-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.table-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-toggle {
  display: flex;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: var(--color-background);
  color: var(--color-text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: var(--color-border-light);
}

.view-btn--active {
  background: var(--color-primary);
  color: white;
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
  position: relative;
}

.performance-table th.sortable {
  cursor: pointer;
  user-select: none;
}

.performance-table th.sortable:hover {
  background: var(--color-border-light);
}

.performance-table td {
  padding: 16px 12px;
  border-bottom: 1px solid var(--color-border-light);
  font-size: 14px;
  color: var(--color-text-primary);
  vertical-align: middle;
}

.performance-row:hover {
  background: var(--color-background);
}

/* 新的员工信息样式 */
.employee-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.employee-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
}

.employee-details {
  flex: 1;
}

.employee-name {
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0 0 2px 0;
}

.employee-position {
  font-size: 12px;
  color: var(--color-text-secondary);
  margin: 0;
}

/* 部门标识 */
.department-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.department-sales {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

.department-operations {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

/* 得分样式 */
.score-cell {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.score-value {
  font-weight: 600;
  color: var(--color-text-primary);
}

.score-weight {
  font-size: 11px;
  color: var(--color-text-secondary);
}

.score-breakdown {
  font-size: 10px;
  color: var(--color-text-tertiary);
  margin-top: 2px;
  line-height: 1.2;
}

.score-breakdown small {
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
}

.score-na {
  opacity: 0.5;
}

.score-na .score-value {
  color: var(--color-text-tertiary);
}

.total-score-cell .score-value {
  font-size: 16px;
  font-weight: 700;
  color: var(--color-primary);
}

/* 等级标识 */
.grade-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
  color: white;
  text-align: center;
  min-width: 24px;
}

/* 排名信息 */
.rank-info {
  display: flex;
  align-items: center;
  gap: 2px;
}

.rank-number {
  font-weight: 600;
  color: var(--color-text-primary);
}

.rank-label {
  font-size: 12px;
  color: var(--color-text-secondary);
}

/* 状态标识 */
.status-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.status-draft {
  background: rgba(156, 163, 175, 0.1);
  color: #6b7280;
}

.status-in_progress {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.status-completed {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.status-approved {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 4px;
}

.btn-icon {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: var(--color-background);
  color: var(--color-primary);
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
  font-size: 20px;
  text-align: center;
  color: var(--color-primary);
  background: linear-gradient(135deg, var(--color-primary), #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 13px;
  font-weight: 600;
  color: white;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s ease;
}

.grade-badge:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
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
  border-radius: 16px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  border: 1px solid var(--color-border);
}

.modal-container--large {
  width: 1200px;
  max-width: 95vw;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 32px;
  border-bottom: 2px solid var(--color-border);
  background: linear-gradient(135deg, var(--color-background-secondary), var(--color-surface));
}

.modal-header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.modal-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--color-text-primary);
  margin: 0;
  background: linear-gradient(135deg, var(--color-primary), #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
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
  padding: 32px;
  background: #fafbfc;
}

/* 绩效详情样式 */
.performance-detail {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.detail-section {
  background: var(--color-surface);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.detail-section:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
}

.section-title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text-primary);
  border-bottom: 2px solid var(--color-primary);
  padding-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title svg {
  color: var(--color-primary);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: var(--color-background);
  border-radius: 8px;
  border: 1px solid var(--color-border-light);
  transition: all 0.2s ease;
}

.info-item:hover {
  background: var(--color-background-secondary);
  border-color: var(--color-primary);
}

.info-item label {
  font-size: 13px;
  color: var(--color-text-secondary);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item span {
  font-size: 15px;
  color: var(--color-text-primary);
  font-weight: 500;
}

/* 得分详情样式 */
.score-breakdown-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.score-category {
  background: var(--color-background);
  border-radius: 10px;
  padding: 20px;
  border: 1px solid var(--color-border-light);
  transition: all 0.2s ease;
}

.score-category:hover {
  background: var(--color-background-secondary);
  border-color: var(--color-primary);
}

.category-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border);
}

.category-header h5 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary);
}

.category-score {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
  padding: 6px 12px;
  border-radius: 20px;
}

.metrics-list,
.intelligent-ratings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-item,
.intelligent-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.metric-item:hover,
.intelligent-item:hover {
  background: var(--color-background-secondary);
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
}

.metric-name,
.intelligent-name {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 14px;
}

.metric-progress {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.metric-score,
.intelligent-score {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
}

.completion-rate {
  font-size: 12px;
  font-weight: 600;
  padding: 2px 6px;
  border-radius: 4px;
}

.completion-rate.high {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.completion-rate.medium {
  background: rgba(245, 158, 11, 0.1);
  color: #f59e0b;
}

.completion-rate.low {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.score {
  font-size: 14px;
  font-weight: 600;
  color: var(--color-primary);
}

/* 客户评价样式 */
.customer-ratings-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.customer-rating-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  transition: all 0.2s ease;
}

.customer-rating-item:hover {
  background: var(--color-background-secondary);
  border-color: var(--color-primary);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.rating-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
}

.rating-name {
  font-weight: 500;
  color: var(--color-text-primary);
  font-size: 14px;
}

.rating-stars {
  display: flex;
  gap: 2px;
}

.star {
  font-size: 16px;
  color: #e5e7eb;
  transition: color 0.2s ease;
}

.star-filled {
  color: #fbbf24;
}

.rating-score {
  display: flex;
  align-items: baseline;
  gap: 2px;
}

.rating-value {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-primary);
}

.rating-max {
  font-size: 12px;
  color: var(--color-text-secondary);
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
    border-radius: 12px;
  }

  .modal-header {
    padding: 20px 24px;
  }

  .modal-content {
    padding: 24px 20px;
  }

  .info-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .score-breakdown-detail {
    gap: 20px;
  }

  .category-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .metric-item,
  .intelligent-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .metric-score,
  .intelligent-score {
    align-items: flex-start;
    width: 100%;
  }

  .modal-header-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
