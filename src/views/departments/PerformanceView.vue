<template>
  <div class="dashboard-content">
    <!-- 页面标题部分 -->
    <section class="dashboard-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">绩效管理</h2>
          <p class="section-description">分部门多层级绩效考核管理系统</p>
        </div>

        <!-- 部门切换器 -->
        <div class="department-switcher">
          <div class="department-tabs">
            <button
              v-for="dept in departments"
              :key="dept.value"
              class="department-tab"
              :class="{ 'department-tab--active': selectedDepartment === dept.value }"
              @click="selectedDepartment = dept.value"
            >
              <component :is="dept.icon" :size="16" />
              {{ dept.label }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 时间周期和筛选器 -->
    <section class="dashboard-section">
      <div class="section-card">
        <!-- 时间周期切换器 -->
        <div class="period-switcher">
          <div class="period-tabs">
            <button
              v-for="period in availablePeriodTypes"
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
              {{ selectedDepartment === 'operations' ? '职能方案评分' : '过程管理评分' }}
            </button>

            <button class="btn btn--outline" @click="exportData">
              <Download :size="16" />
              导出数据
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- 统计概览卡片 -->
    <section class="dashboard-section">
      <div class="section-card">
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
      </div>
    </section>

    <!-- 绩效列表 -->
    <section class="dashboard-section">
      <div class="section-card">
        <div class="section-header">
          <h2 class="section-title">绩效考核列表</h2>
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

        <!-- 简化的表格视图 -->
        <div v-if="viewMode === 'table'" class="table-wrapper">
          <div class="simple-table">
            <div class="table-row table-header-row" :class="selectedDepartment">
              <div class="table-cell">员工姓名</div>
              <div class="table-cell">部门</div>
              <div class="table-cell">职位</div>
              <div class="table-cell">考核周期</div>
              <div class="table-cell" v-if="selectedDepartment === 'operations'">数据得分</div>
              <div class="table-cell" v-if="selectedDepartment === 'operations'">客户评价</div>
              <div class="table-cell" v-if="selectedDepartment === 'operations'">职能方案</div>
              <div class="table-cell" v-if="selectedDepartment === 'sales'">月度提成</div>
              <div class="table-cell" v-if="selectedDepartment === 'sales'">绩效底薪奖金</div>
              <div class="table-cell">综合得分</div>
              <div class="table-cell">等级</div>
              <div class="table-cell">操作</div>
            </div>

            <div v-for="record in filteredRecords" :key="record.id" class="table-row" :class="selectedDepartment">
              <div class="table-cell">
                <div class="employee-info">
                  <div class="employee-details">
                    <div class="employee-name">{{ record.employee_name }}</div>
                    <div class="employee-position">{{ record.employee_position }}</div>
                  </div>
                </div>
              </div>
              <div class="table-cell">
                <span class="department-badge" :class="`department-${record.department_type}`">
                  {{ record.department_name }}
                </span>
              </div>
              <div class="table-cell">{{ record.employee_position }}</div>
              <div class="table-cell">{{ formatPeriod(record.period, record.period_type) }}</div>

              <!-- 运营部门数据列 -->
              <template v-if="selectedDepartment === 'operations'">
                <div class="table-cell">
                  <div class="score-cell">
                    <span class="score-value">{{ record.data_score.toFixed(1) }}</span>
                    <span class="score-weight">({{ record.data_weight }}%)</span>
                  </div>
                </div>
                <div class="table-cell">
                  <div class="score-cell">
                    <span class="score-value">{{ (record.customer_score || 0).toFixed(1) }}</span>
                    <span class="score-weight">({{ record.customer_weight }}%)</span>
                  </div>
                </div>
                <div class="table-cell">
                  <div class="score-cell">
                    <span class="score-value">{{ (record.functional_score || record.intelligent_score || 0).toFixed(1) }}</span>
                    <span class="score-weight">({{ record.functional_weight || record.intelligent_weight }}%)</span>
                  </div>
                </div>
              </template>

              <!-- 销售部门数据列 -->
              <template v-if="selectedDepartment === 'sales'">
                <div class="table-cell">
                  <div class="score-cell">
                    <span class="score-value">{{ (record.monthly_commission_score || record.data_score || 0).toFixed(1) }}</span>
                    <span class="score-weight">(100%)</span>
                  </div>
                </div>
                <div class="table-cell">
                  <div class="score-cell">
                    <span class="score-value">{{ (record.performance_bonus_score || record.intelligent_score || 0).toFixed(1) }}</span>
                    <span class="score-weight">(100%)</span>
                  </div>
                </div>
              </template>

              <div class="table-cell">
                <div class="score-cell total-score-cell">
                  <span class="score-value total-score">{{ record.total_score.toFixed(1) }}</span>
                </div>
              </div>
              <div class="table-cell">
                <span class="grade-badge" :style="{ backgroundColor: getGradeColor(record.grade) }">
                  {{ record.grade }}
                </span>
              </div>
              <div class="table-cell">
                <div class="action-buttons-cell">
                  <button class="btn-icon" @click="viewDetails(record)" title="查看详情">
                    <Eye :size="14" />
                  </button>
                  <button class="btn-icon" @click="editRecord(record)" title="编辑">
                    <Edit :size="14" />
                  </button>
                  <button class="btn-icon" @click="rateEmployee(record)" title="评分">
                    <Star :size="14" />
                  </button>
                  <button class="btn-icon" @click="viewAllPerformance(record)" title="查看全部绩效">
                    <BarChart :size="14" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 卡片视图 -->
        <div v-if="viewMode === 'card'" class="cards-grid">
          <div v-for="record in filteredRecords" :key="record.id" class="performance-card">
            <div class="card-header">
              <div class="employee-info">
                <div class="employee-details">
                  <div class="employee-name">{{ record.employee_name }}</div>
                  <div class="employee-position">{{ record.employee_position }}</div>
                </div>
              </div>
              <span class="grade-badge" :style="{ backgroundColor: getGradeColor(record.grade) }">
                {{ record.grade }}
              </span>
            </div>
            <div class="card-content">
              <div class="score-summary">
                <div class="total-score">{{ record.total_score.toFixed(1) }}</div>
                <div class="score-label">综合得分</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 模态框组件 -->
    <!-- 绩效详情模态框 -->
    <div v-if="showDetailsModal" class="modal-overlay" @click="closeDetailsModal">
      <div class="modal-content performance-details-modal" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedRecord?.employee_name }} - 绩效考核详情</h3>
          <div class="modal-actions">
            <button class="action-btn edit-btn" @click="editRecord(selectedRecord)">
              <Edit :size="16" />
              编辑考核
            </button>
            <button class="action-btn print-btn" @click="printReport">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="6,9 6,2 18,2 18,9"></polyline>
                <path d="M6,18H4a2,2,0,0,1-2-2V11a2,2,0,0,1,2-2H20a2,2,0,0,1,2,2v5a2,2,0,0,1-2,2H18"></path>
                <rect x="6" y="14" width="12" height="8"></rect>
              </svg>
              打印报告
            </button>
            <button class="modal-close-btn" @click="closeDetailsModal">
              <X :size="20" />
            </button>
          </div>
        </div>

        <div class="modal-body" v-if="selectedRecord">
          <!-- 基本信息区域 -->
          <div class="basic-info-section">
            <h3 class="section-title">基本信息</h3>
            <div class="info-grid">
              <div class="info-item">
                <span class="info-label">员工姓名</span>
                <span class="info-value">{{ selectedRecord.employee_name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">所属部门</span>
                <span class="info-value">{{ selectedRecord.department_name }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">考核周期</span>
                <span class="info-value">{{ formatPeriod(selectedRecord.period, selectedRecord.period_type) }}</span>
              </div>
              <div class="info-item">
                <span class="info-label">考核人</span>
                <span class="info-value">李主管</span>
              </div>
              <div class="info-item">
                <span class="info-label">考核时间</span>
                <span class="info-value">2023/8/1</span>
              </div>
              <div class="info-item">
                <span class="info-label">状态</span>
                <span class="info-value status-completed">已完成</span>
              </div>
            </div>
          </div>

          <!-- 考核内容 -->
          <div class="evaluation-content">
            <h3 class="section-title">考核内容</h3>

            <!-- 运营部门得分明细 -->
            <div v-if="selectedRecord.department_type === 'operations'" class="score-sections">
              <!-- 项目经理评分结构 -->
              <div v-if="selectedRecord.employee_position.includes('经理')">
                <!-- 季度奖金 (业绩完成率) -->
                <div class="score-section">
                  <div class="section-header">
                    <h4 class="section-subtitle">季度奖金 (业绩完成率) - 100%</h4>
                  </div>
                  <div class="evaluation-grid">
                    <div class="eval-item">
                      <span class="eval-label">服务费目标</span>
                      <span class="eval-score">100%</span>
                    </div>
                    <div class="eval-item">
                      <span class="eval-label">返点目标</span>
                      <span class="eval-score">100%</span>
                    </div>
                  </div>
                </div>

                <!-- 数据评分 (季度任务达标率) -->
                <div class="score-section">
                  <div class="section-header">
                    <h4 class="section-subtitle">数据评分 (季度任务达标率) - 100%</h4>
                  </div>
                </div>

                <!-- 职能方案 (过程管理指标) -->
                <div class="score-section">
                  <div class="section-header">
                    <h4 class="section-subtitle">职能方案 (过程管理指标)</h4>
                  </div>
                  <div class="evaluation-grid">
                    <div class="eval-item">
                      <span class="eval-label">团队成员管理</span>
                      <span class="eval-score">20%</span>
                    </div>
                    <div class="eval-item">
                      <span class="eval-label">组内客户评论</span>
                      <span class="eval-score">20%</span>
                    </div>
                    <div class="eval-item">
                      <span class="eval-label">知识沉淀及输出</span>
                      <span class="eval-score">20%</span>
                    </div>
                    <div class="eval-item">
                      <span class="eval-label">培养及输出新人</span>
                      <span class="eval-score">20%</span>
                    </div>
                    <div class="eval-item">
                      <span class="eval-label">跨团队协助及合作</span>
                      <span class="eval-score">20%</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 项目成员/优化师评分结构 -->
              <div v-else>
                <!-- 数据评分 80% -->
                <div class="score-section">
                  <div class="section-header">
                    <h4 class="section-subtitle">数据评分 - 80%</h4>
                  </div>
                  <div class="evaluation-grid">
                    <div class="eval-item">
                      <span class="eval-label">服务费目标</span>
                      <span class="eval-score">100%</span>
                    </div>
                    <div class="eval-item">
                      <span class="eval-label">返点目标</span>
                      <span class="eval-score">100%</span>
                    </div>
                  </div>
                </div>

                <!-- 职能方案 20% -->
                <div class="score-section">
                  <div class="section-header">
                    <h4 class="section-subtitle">职能方案 - 20%</h4>
                  </div>
                  <div class="evaluation-grid">
                    <div class="eval-item">
                      <span class="eval-label">客户服务能力</span>
                      <span class="eval-score">20%</span>
                    </div>
                    <div class="eval-item">
                      <span class="eval-label">专业工作质量</span>
                      <span class="eval-score">20%</span>
                    </div>
                    <div class="eval-item">
                      <span class="eval-label">沟通与协助</span>
                      <span class="eval-score">20%</span>
                    </div>
                    <div class="eval-item">
                      <span class="eval-label">工作积极性及执行力</span>
                      <span class="eval-score">20%</span>
                    </div>
                    <div class="eval-item">
                      <span class="eval-label">成长与贡献</span>
                      <span class="eval-score">20%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

                        <!-- 销售部门得分明细 -->
            <div v-if="selectedRecord.department_type === 'sales'" class="score-details">
              <!-- 月度提成详细 -->
              <div class="score-item expandable">
                <div class="score-item-header">
                  <span class="score-item-name">月度提成</span>
                  <span class="score-item-weight">(权重: 50%)</span>
                </div>
                <div class="score-item-value">
                  <span class="score-number">{{ ((selectedRecord as SalesPerformanceRecord).monthly_commission_score || 0).toFixed(1) }}</span>
                  <div class="score-bar">
                    <div class="score-fill" :style="{ width: `${(selectedRecord as SalesPerformanceRecord).monthly_commission_score || 0}%` }"></div>
                  </div>
                </div>
                <!-- 月度提成子项明细 -->
                <div class="score-sub-items">
                  <div class="sub-items-table">
                    <div class="table-header">
                      <span class="col-name">指标项目</span>
                      <span class="col-target">目标</span>
                      <span class="col-actual">实际</span>
                      <span class="col-rate">完成率</span>
                      <span class="col-score">得分</span>
                    </div>
                    <div class="table-row">
                      <span class="col-name">新增服务费</span>
                      <span class="col-target">¥{{ ((selectedRecord as SalesPerformanceRecord).monthly_commission?.new_service_fee?.target || 80000).toLocaleString() }}</span>
                      <span class="col-actual">¥{{ ((selectedRecord as SalesPerformanceRecord).monthly_commission?.new_service_fee?.actual || 76000).toLocaleString() }}</span>
                      <span class="col-rate completion-rate">{{ ((selectedRecord as SalesPerformanceRecord).monthly_commission?.new_service_fee?.completion_rate || 95).toFixed(1) }}%</span>
                      <span class="col-score score-value">{{ ((selectedRecord as SalesPerformanceRecord).monthly_commission?.new_service_fee?.score || 89).toFixed(1) }}</span>
                    </div>
                    <div class="table-row">
                      <span class="col-name">新增订单数</span>
                      <span class="col-target">{{ ((selectedRecord as SalesPerformanceRecord).monthly_commission?.new_orders?.target || 25) }}单</span>
                      <span class="col-actual">{{ ((selectedRecord as SalesPerformanceRecord).monthly_commission?.new_orders?.actual || 22) }}单</span>
                      <span class="col-rate completion-rate">{{ ((selectedRecord as SalesPerformanceRecord).monthly_commission?.new_orders?.completion_rate || 88).toFixed(1) }}%</span>
                      <span class="col-score score-value">{{ ((selectedRecord as SalesPerformanceRecord).monthly_commission?.new_orders?.score || 84).toFixed(1) }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <!-- 绩效底薪奖金详细 -->
              <div class="score-item expandable">
                <div class="score-item-header">
                  <span class="score-item-name">绩效底薪奖金</span>
                  <span class="score-item-weight">(权重: 50%)</span>
                </div>
                <div class="score-item-value">
                  <span class="score-number">{{ ((selectedRecord as SalesPerformanceRecord).performance_bonus_score || 0).toFixed(1) }}</span>
                  <div class="score-bar">
                    <div class="score-fill" :style="{ width: `${(selectedRecord as SalesPerformanceRecord).performance_bonus_score || 0}%` }"></div>
                  </div>
                </div>
                <!-- 绩效底薪奖金子项明细 -->
                <div class="score-sub-items">
                  <div class="sub-items-grid">
                    <div class="grid-item">
                      <span class="grid-label">客户维护质量</span>
                      <span class="grid-value">{{ ((selectedRecord as SalesPerformanceRecord).performance_bonus?.process_management?.customer_maintenance || 87).toFixed(1) }}</span>
                    </div>
                    <div class="grid-item">
                      <span class="grid-label">销售流程规范</span>
                      <span class="grid-value">{{ ((selectedRecord as SalesPerformanceRecord).performance_bonus?.process_management?.sales_process || 92).toFixed(1) }}</span>
                    </div>
                    <div class="grid-item">
                      <span class="grid-label">团队协作</span>
                      <span class="grid-value">{{ ((selectedRecord as SalesPerformanceRecord).performance_bonus?.process_management?.teamwork || 85).toFixed(1) }}</span>
                    </div>
                    <div class="grid-item">
                      <span class="grid-label">学习成长</span>
                      <span class="grid-value">{{ ((selectedRecord as SalesPerformanceRecord).performance_bonus?.process_management?.learning_growth || 90).toFixed(1) }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 考核结果 -->
            <div class="evaluation-results">
              <h3 class="section-title">考核结果</h3>

              <div class="results-grid">
                <div class="result-card">
                  <div class="result-label">总分</div>
                  <div class="result-value total-score">86.25分</div>
                </div>
                <div class="result-card">
                  <div class="result-label">等级</div>
                  <div class="result-value grade-value">良好</div>
                </div>
                <div class="result-card">
                  <div class="result-label">部门排名</div>
                  <div class="result-value rank-value">第3名</div>
                </div>
              </div>

              <div class="improvement-suggestion">
                <h4 class="suggestion-title">改进建议</h4>
                <p class="suggestion-text">需要提升新客户开发能力，加强与客户的沟通技巧</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 编辑记录模态框 -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">编辑绩效记录</h3>
          <button class="modal-close" @click="showEditModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="selectedRecord" class="edit-form">
            <div class="form-group">
              <label class="form-label">员工姓名</label>
              <input type="text" :value="selectedRecord.employee_name" readonly class="form-input readonly">
            </div>
            <div class="form-group">
              <label class="form-label">部门</label>
              <input type="text" :value="selectedRecord.department_name" readonly class="form-input readonly">
            </div>
            <div class="form-group">
              <label class="form-label">综合得分</label>
              <input type="number" :value="selectedRecord.total_score" class="form-input" min="0" max="100" step="0.1">
            </div>
            <div class="form-group">
              <label class="form-label">等级</label>
              <select class="form-select">
                <option value="S" :selected="selectedRecord.grade === 'S'">S级</option>
                <option value="A" :selected="selectedRecord.grade === 'A'">A级</option>
                <option value="B" :selected="selectedRecord.grade === 'B'">B级</option>
                <option value="C" :selected="selectedRecord.grade === 'C'">C级</option>
                <option value="D" :selected="selectedRecord.grade === 'D'">D级</option>
              </select>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn--secondary" @click="showEditModal = false">取消</button>
          <button class="btn btn--primary" @click="saveEdit">保存</button>
        </div>
      </div>
    </div>

    <!-- 评分模态框 -->
    <div v-if="showRatingModal" class="modal-overlay" @click="showRatingModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">员工评分</h3>
          <button class="modal-close" @click="showRatingModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <div v-if="selectedRecord" class="rating-form">
            <div class="employee-info-section">
              <h4>{{ selectedRecord.employee_name }}</h4>
              <p>{{ selectedRecord.department_name }} - {{ selectedRecord.employee_position }}</p>
            </div>

            <div class="rating-notice">
              <p><strong>注意：</strong>此评分专门针对职能方案部分的评价</p>
            </div>

                        <div class="functional-rating-section">
              <!-- 项目经理评分 -->
              <div v-if="selectedRecord.employee_position.includes('经理')">
                <h5 class="section-title">职能方案评分 - 过程管理指标</h5>
                <p class="section-description">请根据项目经理在过程管理方面的表现进行评分，每项满分20分</p>

                <div class="rating-items">
                  <div class="rating-item">
                    <label class="rating-label">团队成员管理</label>
                    <div class="rating-input-group">
                      <input type="number" class="rating-input" min="0" max="20" step="0.1" placeholder="0-20分" v-model="functionalRatings.teamManagement">
                      <span class="rating-suffix">分</span>
                    </div>
                    <p class="rating-description">评估对团队成员的管理能力和领导效果</p>
                  </div>

                  <div class="rating-item">
                    <label class="rating-label">组内客户评论</label>
                    <div class="rating-input-group">
                      <input type="number" class="rating-input" min="0" max="20" step="0.1" placeholder="0-20分" v-model="functionalRatings.customerFeedback">
                      <span class="rating-suffix">分</span>
                    </div>
                    <p class="rating-description">评估团队内客户满意度和反馈质量</p>
                  </div>

                  <div class="rating-item">
                    <label class="rating-label">知识沉淀及输出</label>
                    <div class="rating-input-group">
                      <input type="number" class="rating-input" min="0" max="20" step="0.1" placeholder="0-20分" v-model="functionalRatings.knowledgeOutput">
                      <span class="rating-suffix">分</span>
                    </div>
                    <p class="rating-description">评估知识管理和经验输出能力</p>
                  </div>

                  <div class="rating-item">
                    <label class="rating-label">培养及输出新人</label>
                    <div class="rating-input-group">
                      <input type="number" class="rating-input" min="0" max="20" step="0.1" placeholder="0-20分" v-model="functionalRatings.mentoring">
                      <span class="rating-suffix">分</span>
                    </div>
                    <p class="rating-description">评估新员工培养和人才发展能力</p>
                  </div>

                  <div class="rating-item">
                    <label class="rating-label">跨团队协助及合作</label>
                    <div class="rating-input-group">
                      <input type="number" class="rating-input" min="0" max="20" step="0.1" placeholder="0-20分" v-model="functionalRatings.crossTeamwork">
                      <span class="rating-suffix">分</span>
                    </div>
                    <p class="rating-description">评估跨部门协作和团队配合能力</p>
                  </div>
                </div>
              </div>

              <!-- 优化师评分 -->
              <div v-else>
                <h5 class="section-title">职能方案评分 (20分)</h5>
                <p class="section-description">请根据优化师在职能方案方面的表现进行评分，每项满分4分</p>

                <div class="rating-items">
                  <div class="rating-item">
                    <label class="rating-label">客户服务能力</label>
                    <div class="rating-input-group">
                      <input type="number" class="rating-input" min="0" max="4" step="0.1" placeholder="0-4分" v-model="functionalRatings.customerService">
                      <span class="rating-suffix">分</span>
                    </div>
                    <p class="rating-description">评估客户服务质量和响应能力</p>
                  </div>

                  <div class="rating-item">
                    <label class="rating-label">专业工作质量</label>
                    <div class="rating-input-group">
                      <input type="number" class="rating-input" min="0" max="4" step="0.1" placeholder="0-4分" v-model="functionalRatings.workQuality">
                      <span class="rating-suffix">分</span>
                    </div>
                    <p class="rating-description">评估专业技能和工作完成质量</p>
                  </div>

                  <div class="rating-item">
                    <label class="rating-label">沟通与协助</label>
                    <div class="rating-input-group">
                      <input type="number" class="rating-input" min="0" max="4" step="0.1" placeholder="0-4分" v-model="functionalRatings.communication">
                      <span class="rating-suffix">分</span>
                    </div>
                    <p class="rating-description">评估沟通能力和协助他人的表现</p>
                  </div>

                  <div class="rating-item">
                    <label class="rating-label">工作积极性及执行力</label>
                    <div class="rating-input-group">
                      <input type="number" class="rating-input" min="0" max="4" step="0.1" placeholder="0-4分" v-model="functionalRatings.initiative">
                      <span class="rating-suffix">分</span>
                    </div>
                    <p class="rating-description">评估工作主动性和任务执行能力</p>
                  </div>

                  <div class="rating-item">
                    <label class="rating-label">成长与贡献</label>
                    <div class="rating-input-group">
                      <input type="number" class="rating-input" min="0" max="4" step="0.1" placeholder="0-4分" v-model="functionalRatings.growth">
                      <span class="rating-suffix">分</span>
                    </div>
                    <p class="rating-description">评估个人成长和对团队的贡献</p>
                  </div>
                </div>
              </div>

              <div class="total-score-display">
                <span class="total-label">职能方案总分：</span>
                <span class="total-value">{{ functionalTotalScore.toFixed(1) }}分</span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn--secondary" @click="showRatingModal = false">取消</button>
          <button class="btn btn--primary" @click="saveRating">提交评分</button>
        </div>
      </div>
    </div>

    <!-- 设置目标模态框 -->
    <div v-if="showTargetModal" class="modal-overlay" @click="showTargetModal = false">
      <div class="modal-content modal-content--large" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">设置绩效目标</h3>
          <button class="modal-close" @click="showTargetModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- 部门选择 -->
        <div class="modal-filters">
          <div class="filter-group">
            <label class="filter-label">目标部门:</label>
            <select v-model="targetDepartment" class="filter-select">
              <option value="operations">运营部门</option>
              <option value="sales">销售部门</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">考核周期:</label>
            <select v-model="targetPeriod" class="filter-select">
              <option value="monthly">月度目标</option>
              <option value="quarterly">季度目标</option>
              <option value="yearly">年度目标</option>
            </select>
          </div>
        </div>

        <div class="modal-body">
          <!-- 运营部门目标设置 -->
          <div v-if="targetDepartment === 'operations'" class="target-settings">
            <div class="department-notice">
              <h4>运营部门绩效目标</h4>
              <p>设置运营部门的数据指标和职能方案目标</p>
            </div>

            <div class="target-categories">
              <div class="target-category">
                <h5 class="category-title">数据指标目标</h5>
                <div class="target-items">
                  <div class="target-item">
                    <label class="target-label">服务费目标 (¥)</label>
                    <input type="number" class="target-input" v-model="operationsTargets.serviceFeeTarget" placeholder="请输入服务费目标">
                  </div>
                  <div class="target-item">
                    <label class="target-label">返点目标 (¥)</label>
                    <input type="number" class="target-input" v-model="operationsTargets.rebateTarget" placeholder="请输入返点目标">
                  </div>
                  <div class="target-item">
                    <label class="target-label">新客户数量</label>
                    <input type="number" class="target-input" v-model="operationsTargets.newCustomers" placeholder="请输入新客户目标数量">
                  </div>
                </div>
              </div>

              <div class="target-category">
                <h5 class="category-title">客户评价目标</h5>
                <div class="target-items">
                  <div class="target-item">
                    <label class="target-label">客户满意度 (分)</label>
                    <input type="number" class="target-input" v-model="operationsTargets.customerSatisfaction" min="0" max="10" step="0.1" placeholder="0-10分">
                  </div>
                  <div class="target-item">
                    <label class="target-label">服务质量 (分)</label>
                    <input type="number" class="target-input" v-model="operationsTargets.serviceQuality" min="0" max="10" step="0.1" placeholder="0-10分">
                  </div>
                </div>
              </div>

              <div class="target-category">
                <h5 class="category-title">职能方案目标</h5>
                <div class="target-items">
                  <div class="target-item">
                    <label class="target-label">项目完成率 (%)</label>
                    <input type="number" class="target-input" v-model="operationsTargets.projectCompletion" min="0" max="100" placeholder="请输入完成率目标">
                  </div>
                  <div class="target-item">
                    <label class="target-label">团队协作评分 (分)</label>
                    <input type="number" class="target-input" v-model="operationsTargets.teamwork" min="0" max="10" step="0.1" placeholder="0-10分">
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 销售部门目标设置 -->
          <div v-else class="target-settings">
            <div class="department-notice">
              <h4>销售部门绩效目标</h4>
              <p>设置销售部门的月度提成和绩效奖金目标</p>
            </div>

            <div class="target-categories">
              <div class="target-category">
                <h5 class="category-title">月度提成目标</h5>
                <div class="target-items">
                  <div class="target-item">
                    <label class="target-label">新增服务费 (¥)</label>
                    <input type="number" class="target-input" v-model="salesTargets.newServiceFee" placeholder="请输入新增服务费目标">
                  </div>
                  <div class="target-item">
                    <label class="target-label">新增订单数 (单)</label>
                    <input type="number" class="target-input" v-model="salesTargets.newOrders" placeholder="请输入新增订单目标">
                  </div>
                  <div class="target-item">
                    <label class="target-label">客户转化率 (%)</label>
                    <input type="number" class="target-input" v-model="salesTargets.conversionRate" min="0" max="100" placeholder="请输入转化率目标">
                  </div>
                </div>
              </div>

              <div class="target-category">
                <h5 class="category-title">绩效底薪奖金目标</h5>
                <div class="target-items">
                  <div class="target-item">
                    <label class="target-label">客户维护数量</label>
                    <input type="number" class="target-input" v-model="salesTargets.customerMaintenance" placeholder="请输入客户维护目标数量">
                  </div>
                  <div class="target-item">
                    <label class="target-label">业务拓展项目</label>
                    <input type="number" class="target-input" v-model="salesTargets.businessExpansion" placeholder="请输入业务拓展目标">
                  </div>
                  <div class="target-item">
                    <label class="target-label">客户满意度 (分)</label>
                    <input type="number" class="target-input" v-model="salesTargets.customerSatisfaction" min="0" max="10" step="0.1" placeholder="0-10分">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn--secondary" @click="showTargetModal = false">取消</button>
          <button class="btn btn--primary" @click="saveTargets">保存目标</button>
        </div>
      </div>
    </div>

    <!-- 查看全部绩效模态框 -->
    <div v-if="showAllPerformanceModal" class="modal-overlay" @click="showAllPerformanceModal = false">
      <div class="modal-content modal-content--large" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">全部绩效记录</h3>
          <button class="modal-close" @click="showAllPerformanceModal = false">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <!-- 筛选器 -->
        <div class="modal-filters">
          <div class="filter-group">
            <label class="filter-label">时间范围:</label>
            <select v-model="performanceTimeFilter" class="filter-select">
              <option value="monthly">月度绩效</option>
              <option value="quarterly">季度绩效</option>
              <option value="yearly">年度绩效</option>
            </select>
          </div>
          <div class="filter-group">
            <label class="filter-label">年份:</label>
            <select v-model="performanceYear" class="filter-select">
              <option value="2024">2024年</option>
              <option value="2023">2023年</option>
              <option value="2022">2022年</option>
            </select>
          </div>
        </div>

        <div class="modal-body">
          <div v-if="selectedRecord" class="performance-history">
            <div class="employee-summary">
              <h4>{{ selectedRecord.employee_name }}</h4>
              <p>{{ selectedRecord.department_name }} - {{ selectedRecord.employee_position }}</p>
            </div>

            <div class="performance-timeline">
              <div class="timeline-item" v-for="record in filteredPerformanceRecords" :key="record.period">
                <div class="timeline-header">
                  <div class="timeline-date">{{ record.period }}</div>
                  <div class="timeline-summary">
                    <span class="summary-score">综合得分: {{ record.totalScore }}</span>
                    <span class="summary-grade" :class="getGradeColor(record.grade)">{{ record.grade }}级</span>
                  </div>
                </div>

                <div class="timeline-content">
                  <!-- 运营部门详细得分 -->
                  <div v-if="selectedRecord.department_type === 'operations'" class="detailed-scores">
                    <div class="score-category">
                      <h5 class="category-title">数据得分 ({{ record.dataScore }}分)</h5>
                      <div class="score-details">
                        <div class="detail-item">
                          <span class="detail-label">服务费目标</span>
                          <span class="detail-value">{{ record.serviceTarget }}分</span>
                          <span class="detail-rate">({{ record.serviceRate }}%)</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">返点目标</span>
                          <span class="detail-value">{{ record.rebateTarget }}分</span>
                          <span class="detail-rate">({{ record.rebateRate }}%)</span>
                        </div>
                      </div>
                    </div>

                    <div class="score-category">
                      <h5 class="category-title">客户评价 ({{ record.customerScore }}分)</h5>
                      <div class="score-details">
                        <div class="detail-item">
                          <span class="detail-label">客户满意度</span>
                          <span class="detail-value">{{ record.satisfaction }}分</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">服务质量</span>
                          <span class="detail-value">{{ record.serviceQuality }}分</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">响应速度</span>
                          <span class="detail-value">{{ record.responseSpeed }}分</span>
                        </div>
                      </div>
                    </div>

                    <div class="score-category">
                      <h5 class="category-title">职能方案 ({{ record.functionalScore }}分)</h5>
                      <div class="score-details">
                        <div v-if="selectedRecord.employee_position.includes('经理')" class="detail-item">
                          <span class="detail-label">团队成员管理</span>
                          <span class="detail-value">{{ record.teamManagement }}分</span>
                        </div>
                        <div v-else class="detail-item">
                          <span class="detail-label">客户服务能力</span>
                          <span class="detail-value">{{ record.customerService }}分</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">专业工作质量</span>
                          <span class="detail-value">{{ record.workQuality }}分</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">沟通与协助</span>
                          <span class="detail-value">{{ record.communication }}分</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- 销售部门详细得分 -->
                  <div v-else class="detailed-scores">
                    <div class="score-category">
                      <h5 class="category-title">月度提成 ({{ record.monthlyCommission }}分)</h5>
                      <div class="score-details">
                        <div class="detail-item">
                          <span class="detail-label">新增服务费</span>
                          <span class="detail-value">{{ record.newServiceFee }}分</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">新增订单数</span>
                          <span class="detail-value">{{ record.newOrders }}分</span>
                        </div>
                      </div>
                    </div>

                    <div class="score-category">
                      <h5 class="category-title">绩效底薪奖金 ({{ record.performanceBonus }}分)</h5>
                      <div class="score-details">
                        <div class="detail-item">
                          <span class="detail-label">客户维护</span>
                          <span class="detail-value">{{ record.customerMaintenance }}分</span>
                        </div>
                        <div class="detail-item">
                          <span class="detail-label">业务拓展</span>
                          <span class="detail-value">{{ record.businessExpansion }}分</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn--secondary" @click="showAllPerformanceModal = false">关闭</button>
          <button class="btn btn--primary" @click="exportEmployeeData">导出该员工数据</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
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
  Building2,
  ShoppingCart,
  X
} from 'lucide-vue-next'

// 导入新的配置和数据
import {
  currentUserRole,
  currentUserId,
  operationsPerformanceRecords,
  salesPerformanceRecords,
  getEmployeesByRole,
  getTargetSettableEmployees,
  getRatableEmployees,
  getGradeColor,
  getGradeDescription
} from '@/mock/performance-new'

import type {
  OperationsPerformanceRecord,
  SalesPerformanceRecord,
  DepartmentType,
  PositionLevel,
  PeriodType
} from '@/types/departments'

// 响应式数据
const selectedDepartment = ref<DepartmentType>('operations')
const selectedPeriodType = ref<PeriodType>('monthly')
const selectedPeriod = ref('2024-01')
const selectedPositionLevel = ref<PositionLevel | ''>('')
const selectedStatus = ref('')
const viewMode = ref<'table' | 'card'>('table')

// 模态框状态
const showTargetModal = ref(false)
const showRatingModal = ref(false)
const showEditModal = ref(false)
const showAllPerformanceModal = ref(false)
const selectedRecord = ref<OperationsPerformanceRecord | SalesPerformanceRecord | null>(null)

// 职能方案评分数据
const functionalRatings = ref({
  // 项目经理评分项 (每项0-20分)
  teamManagement: 0,
  customerFeedback: 0,
  knowledgeOutput: 0,
  mentoring: 0,
  crossTeamwork: 0,
  // 优化师评分项 (每项0-4分)
  customerService: 0,
  workQuality: 0,
  communication: 0,
  initiative: 0,
  growth: 0
})

// 全部绩效筛选器
const performanceTimeFilter = ref('monthly')
const performanceYear = ref('2024')

// 目标设置数据
const targetDepartment = ref('operations')
const targetPeriod = ref('monthly')

// 运营部门目标
const operationsTargets = ref({
  serviceFeeTarget: 0,
  rebateTarget: 0,
  newCustomers: 0,
  customerSatisfaction: 8.5,
  serviceQuality: 8.5,
  projectCompletion: 90,
  teamwork: 8.0
})

// 销售部门目标
const salesTargets = ref({
  newServiceFee: 0,
  newOrders: 0,
  conversionRate: 15,
  customerMaintenance: 0,
  businessExpansion: 0,
  customerSatisfaction: 8.5
})

// 计算属性
const departments = computed(() => [
  { value: 'operations' as DepartmentType, label: '运营部门', icon: Building2 },
  { value: 'sales' as DepartmentType, label: '销售部门', icon: ShoppingCart }
])

// 职能方案总分计算
const functionalTotalScore = computed(() => {
  if (selectedRecord.value?.employee_position.includes('经理')) {
    // 项目经理：5项，每项最高20分
    return functionalRatings.value.teamManagement +
           functionalRatings.value.customerFeedback +
           functionalRatings.value.knowledgeOutput +
           functionalRatings.value.mentoring +
           functionalRatings.value.crossTeamwork
  } else {
    // 优化师：5项，每项最高4分
    return functionalRatings.value.customerService +
           functionalRatings.value.workQuality +
           functionalRatings.value.communication +
           functionalRatings.value.initiative +
           functionalRatings.value.growth
  }
})

// 生成模拟绩效历史数据
const generatePerformanceHistory = (timeFilter: string, year: string) => {
  const records = []
  let periods = []

  if (timeFilter === 'monthly') {
    periods = ['12月', '11月', '10月', '9月', '8月', '7月', '6月', '5月', '4月', '3月', '2月', '1月']
  } else if (timeFilter === 'quarterly') {
    periods = ['Q4', 'Q3', 'Q2', 'Q1']
  } else {
    periods = [year]
  }

  periods.forEach(period => {
    const baseScore = Math.random() * 20 + 80
    records.push({
      period: timeFilter === 'yearly' ? `${year}年` : `${year}年${period}`,
      totalScore: baseScore.toFixed(1),
      grade: baseScore >= 90 ? 'A' : baseScore >= 80 ? 'B' : baseScore >= 70 ? 'C' : 'D',
      dataScore: (Math.random() * 20 + 80).toFixed(1),
      customerScore: (Math.random() * 20 + 80).toFixed(1),
      functionalScore: (Math.random() * 20 + 80).toFixed(1),
      // 详细分项
      serviceTarget: (Math.random() * 10 + 40).toFixed(1),
      serviceRate: (Math.random() * 20 + 85).toFixed(1),
      rebateTarget: (Math.random() * 10 + 40).toFixed(1),
      rebateRate: (Math.random() * 20 + 85).toFixed(1),
      satisfaction: (Math.random() * 5 + 8).toFixed(1),
      serviceQuality: (Math.random() * 5 + 8).toFixed(1),
      responseSpeed: (Math.random() * 5 + 8).toFixed(1),
      teamManagement: (Math.random() * 5 + 15).toFixed(1),
      customerService: (Math.random() * 2 + 3).toFixed(1),
      workQuality: (Math.random() * 2 + 3).toFixed(1),
      communication: (Math.random() * 2 + 3).toFixed(1),
      // 销售部门数据
      monthlyCommission: (Math.random() * 20 + 80).toFixed(1),
      performanceBonus: (Math.random() * 20 + 80).toFixed(1),
      newServiceFee: (Math.random() * 10 + 40).toFixed(1),
      newOrders: (Math.random() * 10 + 40).toFixed(1),
      customerMaintenance: (Math.random() * 10 + 40).toFixed(1),
      businessExpansion: (Math.random() * 10 + 40).toFixed(1)
    })
  })

  return records
}

// 筛选后的绩效记录
const filteredPerformanceRecords = computed(() => {
  return generatePerformanceHistory(performanceTimeFilter.value, performanceYear.value)
})

const availablePeriodTypes = computed(() => {
  const types = [
    { value: 'monthly' as PeriodType, label: '月度考核', icon: Calendar }
  ]

  if (selectedDepartment.value === 'operations') {
    types.push({ value: 'quarterly' as PeriodType, label: '季度考核', icon: BarChart })
  }

  return types
})

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

// 筛选后的绩效记录
const filteredRecords = computed(() => {
  let records: (OperationsPerformanceRecord | SalesPerformanceRecord)[] = []

  if (selectedDepartment.value === 'operations') {
    records = operationsPerformanceRecords.filter(record => {
      if (!viewableEmployeeIds.value.includes(record.employee_id)) return false
      if (record.period_type !== selectedPeriodType.value) return false
      if (record.period !== selectedPeriod.value) return false
      if (selectedPositionLevel.value && record.position_level !== selectedPositionLevel.value) return false
      if (selectedStatus.value && record.status !== selectedStatus.value) return false
      return true
    })
  } else if (selectedDepartment.value === 'sales') {
    records = salesPerformanceRecords.filter(record => {
      if (!viewableEmployeeIds.value.includes(record.employee_id)) return false
      if (record.period !== selectedPeriod.value) return false
      if (selectedPositionLevel.value && record.position_level !== selectedPositionLevel.value) return false
      if (selectedStatus.value && record.status !== selectedStatus.value) return false
      return true
    })
  }

  return records
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
  return 15
})

// 方法
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

// 绩效详情模态框状态
const showDetailsModal = ref(false)

const viewDetails = (record: OperationsPerformanceRecord | SalesPerformanceRecord) => {
  selectedRecord.value = record
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedRecord.value = null
}

const editRecord = (record: OperationsPerformanceRecord | SalesPerformanceRecord) => {
  console.log('编辑记录:', record)
  // 打开编辑模态框
  showEditModal.value = true
  selectedRecord.value = record
}

const rateEmployee = (record: OperationsPerformanceRecord | SalesPerformanceRecord) => {
  console.log('评分员工:', record)
  // 打开评分模态框
  showRatingModal.value = true
  selectedRecord.value = record
}

const viewAllPerformance = (record: OperationsPerformanceRecord | SalesPerformanceRecord) => {
  console.log('查看全部绩效:', record)
  // 打开全部绩效模态框
  showAllPerformanceModal.value = true
  selectedRecord.value = record
}

const refreshData = () => {
  console.log('刷新数据')
  // 重新加载数据
  location.reload()
}

const exportData = () => {
  console.log('导出数据')
  // 导出当前筛选的数据
  const dataToExport = filteredRecords.value
  const csvContent = generateCSV(dataToExport)
  downloadCSV(csvContent, `performance-data-${new Date().toISOString().split('T')[0]}.csv`)
}

// 生成CSV内容
const generateCSV = (data: any[]) => {
  if (data.length === 0) return ''

  const headers = ['员工姓名', '部门', '职位', '考核周期', '综合得分', '等级']
  const csvRows = [headers.join(',')]

  data.forEach(record => {
    const row = [
      record.employee_name,
      record.department_name,
      record.employee_position,
      formatPeriod(record.period, record.period_type),
      record.total_score.toFixed(1),
      record.grade
    ]
    csvRows.push(row.join(','))
  })

  return csvRows.join('\n')
}

// 下载CSV文件
const downloadCSV = (content: string, filename: string) => {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', filename)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
}

// 保存编辑
const saveEdit = () => {
  console.log('保存编辑:', selectedRecord.value)
  // 这里可以添加实际的保存逻辑
  alert('编辑已保存！')
  showEditModal.value = false
}

// 保存评分
const saveRating = () => {
  console.log('保存职能方案评分:', {
    employee: selectedRecord.value?.employee_name,
    ratings: functionalRatings.value,
    totalScore: functionalTotalScore.value
  })

  // 验证评分
  if (functionalTotalScore.value === 0) {
    alert('请至少为一个评分项目打分！')
    return
  }

  // 这里可以添加实际的评分保存逻辑
  alert(`职能方案评分已提交！\n总分：${functionalTotalScore.value.toFixed(1)}分`)

  // 重置评分数据
  functionalRatings.value = {
    // 项目经理评分项
    teamManagement: 0,
    customerFeedback: 0,
    knowledgeOutput: 0,
    mentoring: 0,
    crossTeamwork: 0,
    // 优化师评分项
    customerService: 0,
    workQuality: 0,
    communication: 0,
    initiative: 0,
    growth: 0
  }

  showRatingModal.value = false
}

// 保存目标设置
const saveTargets = () => {
  if (targetDepartment.value === 'operations') {
    console.log('保存运营部门目标:', {
      department: '运营部门',
      period: targetPeriod.value,
      targets: operationsTargets.value
    })

    // 验证必填字段
    if (!operationsTargets.value.serviceFeeTarget || !operationsTargets.value.rebateTarget) {
      alert('请填写服务费目标和返点目标！')
      return
    }

    alert(`运营部门${targetPeriod.value === 'monthly' ? '月度' : targetPeriod.value === 'quarterly' ? '季度' : '年度'}目标设置成功！\n服务费目标: ¥${operationsTargets.value.serviceFeeTarget.toLocaleString()}\n返点目标: ¥${operationsTargets.value.rebateTarget.toLocaleString()}`)
  } else {
    console.log('保存销售部门目标:', {
      department: '销售部门',
      period: targetPeriod.value,
      targets: salesTargets.value
    })

    // 验证必填字段
    if (!salesTargets.value.newServiceFee || !salesTargets.value.newOrders) {
      alert('请填写新增服务费和新增订单数目标！')
      return
    }

    alert(`销售部门${targetPeriod.value === 'monthly' ? '月度' : targetPeriod.value === 'quarterly' ? '季度' : '年度'}目标设置成功！\n新增服务费: ¥${salesTargets.value.newServiceFee.toLocaleString()}\n新增订单数: ${salesTargets.value.newOrders}单`)
  }

  showTargetModal.value = false
}

// 导出员工数据
const exportEmployeeData = () => {
  if (!selectedRecord.value) return

  const employeeData = {
    name: selectedRecord.value.employee_name,
    department: selectedRecord.value.department_name,
    position: selectedRecord.value.employee_position,
    scores: [
      { period: '2024年1月', total: 84.9, grade: 'A' },
      { period: '2024年2月', total: 87.2, grade: 'A' },
      { period: '2024年3月', total: 82.1, grade: 'B' },
      { period: '2024年4月', total: 89.5, grade: 'A' },
      { period: '2024年5月', total: 91.3, grade: 'S' },
      { period: '2024年6月', total: 88.7, grade: 'A' }
    ]
  }

  const csvContent = generateEmployeeCSV(employeeData)
  downloadCSV(csvContent, `${selectedRecord.value.employee_name}-performance-history.csv`)
}

// 生成员工绩效CSV
const generateEmployeeCSV = (data: any) => {
  const headers = ['考核周期', '综合得分', '等级']
  const csvRows = [headers.join(',')]

  data.scores.forEach((score: any) => {
    const row = [score.period, score.total, score.grade]
    csvRows.push(row.join(','))
  })

  return csvRows.join('\n')
}

// 打印报告
const printReport = () => {
  window.print()
}

// 生命周期
onMounted(() => {
  console.log('绩效管理页面已加载')
})
</script>

<style scoped>
/* 使用与dashboard一致的样式 */
.dashboard-content {
  padding-top: 20px;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

.dashboard-section {
  margin-bottom: var(--spacing-2xl);
  scroll-margin-top: 160px;
}

.section-card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.section-header {
  margin-bottom: var(--spacing-xl);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0;
}

.section-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
}

/* 部门切换器 */
.department-switcher {
  margin-bottom: 0;
}

.department-tabs {
  display: flex;
  gap: 8px;
  background: #f8fafc;
  padding: 8px;
  border-radius: 12px;
  width: fit-content;
}

.department-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.department-tab:hover {
  background: #f3f4f6;
  color: #374151;
}

.department-tab--active {
  background: #4f46e5;
  color: white;
}

/* 时间周期切换器 */
.period-switcher {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.period-tabs {
  display: flex;
  gap: 8px;
  background: #f8fafc;
  padding: 8px;
  border-radius: 12px;
}

.period-tab {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border: none;
  background: transparent;
  border-radius: 8px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.period-tab:hover {
  background: #f3f4f6;
  color: #374151;
}

.period-tab--active {
  background: #4f46e5;
  color: white;
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
  transition: border-color 0.2s ease;
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
  margin-bottom: 0;
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
  align-items: center;
}

.btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.btn--primary {
  background: #4f46e5;
  color: white;
}

.btn--primary:hover {
  background: #4338ca;
}

.btn--secondary {
  background: #10b981;
  color: white;
}

.btn--secondary:hover {
  background: #059669;
}

.btn--outline {
  background: white;
  color: #6b7280;
  border: 1px solid #d1d5db;
}

.btn--outline:hover {
  background: #f9fafb;
  color: #374151;
}

/* 统计概览 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 0;
}

.stat-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 16px;
  border: 1px solid #e5e7eb;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-card--primary .stat-icon {
  background: #4f46e5;
}

.stat-card--success .stat-icon {
  background: #10b981;
}

.stat-card--info .stat-icon {
  background: #3b82f6;
}

.stat-card--warning .stat-icon {
  background: #f59e0b;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stat-label {
  color: #6b7280;
  font-size: 14px;
  margin-top: 4px;
}

.stat-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  color: #10b981;
  font-size: 12px;
  font-weight: 500;
}

.stat-progress {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #3b82f6;
  transition: width 0.3s ease;
}

.stat-deadline {
  display: flex;
  align-items: center;
  gap: 4px;
  margin-top: 8px;
  color: #f59e0b;
  font-size: 12px;
  font-weight: 500;
}

/* 表格操作 */
.table-actions {
  display: flex;
  gap: 12px;
  align-items: center;
}

.view-toggle {
  display: flex;
  gap: 4px;
  background: #f3f4f6;
  padding: 4px;
  border-radius: 8px;
}

.view-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-btn:hover {
  background: #e5e7eb;
  color: #374151;
}

.view-btn--active {
  background: white;
  color: #4f46e5;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

/* 优化表格样式 */
.table-wrapper {
  margin-top: 24px;
  background: white;
  border-radius: 12px;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.simple-table {
  width: 100%;
  min-width: 1200px;
  border-collapse: collapse;
}

.table-row {
  display: grid;
  gap: 16px;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  transition: background-color 0.2s ease;
}

.table-row:hover:not(.table-header-row) {
  background-color: #f8fafc;
}

.table-row:last-child {
  border-bottom: none;
}

/* 运营部门表格布局 - 10列 */
.table-row.operations {
  grid-template-columns: 1fr 100px 100px 120px 100px 100px 100px 100px 80px 100px;
}

/* 销售部门表格布局 - 9列 */
.table-row.sales {
  grid-template-columns: 1fr 100px 100px 120px 100px 100px 100px 80px 100px;
}

/* 默认表格行布局 */
.table-row:not(.operations):not(.sales) {
  grid-template-columns: 1fr 100px 100px 120px 100px 100px 100px 100px 80px 100px;
}

.table-header-row {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  font-weight: 600;
  color: #475569;
  border-bottom: 2px solid #e2e8f0;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-header-row:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%) !important;
}

.table-cell {
  display: flex;
  align-items: center;
  min-height: 48px;
  font-size: 14px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.employee-info {
  display: flex;
  align-items: center;
  width: 100%;
  min-width: 0;
}



.employee-details {
  flex: 1;
  min-width: 0;
}

.employee-name {
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 4px;
  font-size: 15px;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.employee-position {
  font-size: 12px;
  color: #64748b;
  font-weight: 500;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.department-badge {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  text-align: center;
  white-space: nowrap;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.department-operations {
  background: linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%);
  color: #166534;
  border: 1px solid #86efac;
}

.department-sales {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1e40af;
  border: 1px solid #93c5fd;
}

.score-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8px;
  background: #f8fafc;
  border-radius: 8px;
  min-width: 80px;
}

.score-value {
  font-weight: 700;
  color: #1f2937;
  font-size: 16px;
  line-height: 1.2;
}

.score-weight {
  font-size: 11px;
  color: #64748b;
  margin-top: 2px;
  font-weight: 500;
}

.total-score-cell {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border: 1px solid #c4b5fd;
}

.total-score-cell .score-value {
  font-size: 20px;
  color: #4f46e5;
  font-weight: 800;
}

.grade-badge {
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  min-width: 44px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.action-buttons-cell {
  display: flex;
  gap: 6px;
  justify-content: center;
  flex-wrap: wrap;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  color: #64748b;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.btn-icon:hover {
  background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%);
  color: #475569;
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
}

.btn-icon:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* 卡片视图样式 */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.performance-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
}

.performance-card:hover {
  border-color: #4f46e5;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-content {
  text-align: center;
}

.score-summary {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
}

.total-score {
  font-size: 2.5rem;
  font-weight: 700;
  color: #4f46e5;
  margin-bottom: 4px;
}

.score-label {
  color: #6b7280;
  font-size: 14px;
}

/* 模态框样式 */
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-content--large {
  max-width: 900px;
}

/* 模态框筛选器样式 */
.modal-filters {
  display: flex;
  gap: 20px;
  padding: 20px 24px;
  background: #f8fafc;
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
  background: white;
  font-size: 14px;
  color: #374151;
  min-width: 120px;
}

.filter-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close:hover {
  color: #374151;
  background: #f3f4f6;
}

.modal-body {
  padding: 24px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px 24px;
  border-top: 1px solid #e5e7eb;
}

/* 表单样式 */
.edit-form, .rating-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.form-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  transition: border-color 0.2s ease;
}

.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.form-input.readonly {
  background: #f9fafb;
  color: #6b7280;
}

.form-select {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  cursor: pointer;
}

.form-select:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

/* 评分表单样式 */
.employee-info-section {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 24px;
}

.employee-info-section h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.employee-info-section p {
  color: #6b7280;
  margin: 0;
}

.rating-notice {
  background: #fef3c7;
  border: 1px solid #f59e0b;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.rating-notice p {
  margin: 0;
  color: #92400e;
  font-size: 14px;
}

.functional-rating-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 24px;
}

.functional-rating-section .section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 8px;
}

.section-description {
  color: #6b7280;
  font-size: 14px;
  margin-bottom: 24px;
  line-height: 1.5;
}

.rating-items {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 24px;
}

.rating-item {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  background: #f8fafc;
}

.rating-item .rating-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 12px;
  display: block;
}

.rating-description {
  font-size: 12px;
  color: #6b7280;
  margin: 8px 0 0 0;
  line-height: 1.4;
}

.total-score-display {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border: 1px solid #c4b5fd;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
}

.total-label {
  font-size: 14px;
  color: #6b7280;
  margin-right: 8px;
}

.total-value {
  font-size: 18px;
  font-weight: 700;
  color: #4f46e5;
}

.rating-sections {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.rating-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.rating-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.rating-input-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.rating-input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
}

.rating-suffix {
  color: #6b7280;
  font-size: 14px;
  font-weight: 500;
}

/* 绩效历史样式 */
.employee-summary {
  text-align: center;
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  margin-bottom: 24px;
}

.employee-summary h4 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.employee-summary p {
  color: #6b7280;
  margin: 0;
}

.performance-timeline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.timeline-item {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #f9fafb;
  border-radius: 8px;
  border-left: 4px solid #4f46e5;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.timeline-summary {
  display: flex;
  gap: 12px;
  align-items: center;
}

.summary-score {
  font-weight: 600;
  color: #1f2937;
  font-size: 14px;
}

.summary-grade {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.timeline-date {
  font-weight: 600;
  color: #4f46e5;
  min-width: 80px;
  font-size: 14px;
}

.timeline-content {
  flex: 1;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.score-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.score-item.total {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border-color: #c4b5fd;
}

.score-item .score-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.score-item .score-value {
  font-size: 16px;
  font-weight: 700;
  color: #1f2937;
}

.score-item.total .score-value {
  color: #4f46e5;
}

/* 详细得分样式 */
.detailed-scores {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.score-category {
  background: white;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
}

.category-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: #f8fafc;
  border-radius: 6px;
}

.detail-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.detail-value {
  font-size: 14px;
  font-weight: 600;
  color: #1f2937;
}

.detail-rate {
  font-size: 12px;
  color: #6b7280;
  margin-left: 8px;
}

/* 目标设置样式 */
.target-settings {
  padding: 20px 0;
}

.department-notice {
  background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
  border: 1px solid #c4b5fd;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  text-align: center;
}

.department-notice h4 {
  font-size: 18px;
  font-weight: 600;
  color: #4f46e5;
  margin-bottom: 8px;
}

.department-notice p {
  color: #6b7280;
  margin: 0;
  font-size: 14px;
}

.target-categories {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.target-category {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
}

.target-category .category-title {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f3f4f6;
}

.target-items {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 16px;
}

.target-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.target-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.target-input {
  padding: 12px 16px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 14px;
  background: white;
  transition: all 0.2s ease;
}

.target-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.target-input::placeholder {
  color: #9ca3af;
}

/* 子项明细样式 */
.score-sub-items {
  margin-top: 16px;
  padding: 16px;
  background: #fafbfc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

/* 表格布局样式 */
.sub-items-table {
  width: 100%;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  gap: 12px;
  padding: 12px 0;
  align-items: center;
}

.table-header {
  border-bottom: 2px solid #e5e7eb;
  font-weight: 600;
  color: #374151;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.table-row {
  border-bottom: 1px solid #f1f5f9;
}

.table-row:last-child {
  border-bottom: none;
}

.col-name {
  font-weight: 600;
  color: #1f2937;
}

.col-target,
.col-actual {
  font-size: 14px;
  color: #374151;
}

.completion-rate {
  font-size: 12px;
  color: #059669;
  background: #d1fae5;
  padding: 4px 8px;
  border-radius: 12px;
  font-weight: 600;
  text-align: center;
}

.score-value {
  font-size: 16px;
  font-weight: 700;
  color: #4f46e5;
  text-align: center;
}

/* 网格布局样式 */
.sub-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.grid-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.grid-item:hover {
  border-color: #4f46e5;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.1);
}

.grid-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.grid-value {
  font-size: 16px;
  font-weight: 700;
  color: #4f46e5;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .table-header span,
  .table-row span {
    padding: 4px 0;
  }

  .sub-items-grid {
    grid-template-columns: 1fr;
  }
}

.expandable {
  position: relative;
}

/* 按钮样式 */
.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn--primary {
  background: #4f46e5;
  color: white;
}

.btn--primary:hover {
  background: #4338ca;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.btn--secondary {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.btn--secondary:hover {
  background: #e5e7eb;
  border-color: #9ca3af;
}

/* 绩效详情模态框样式 */
.performance-details-modal {
  max-width: 1000px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
  background: #f8fafc;
}

.modal-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #3b82f6;
  color: white;
}

.edit-btn:hover {
  background: #2563eb;
}

.print-btn {
  background: #f3f4f6;
  color: #374151;
  border: 1px solid #d1d5db;
}

.print-btn:hover {
  background: #e5e7eb;
}

.modal-close-btn {
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: all 0.2s ease;
}

.modal-close-btn:hover {
  background: #f3f4f6;
  color: #374151;
}

/* 基本信息区域 */
.basic-info-section {
  margin-bottom: 32px;
}

.section-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #e5e7eb;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.info-label {
  font-size: 14px;
  color: #6b7280;
  font-weight: 500;
}

.info-value {
  font-size: 14px;
  color: #1f2937;
  font-weight: 600;
}

.status-completed {
  color: #059669;
  background: #d1fae5;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
}

/* 考核内容区域 */
.evaluation-content {
  margin-bottom: 32px;
}

.score-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.score-section {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 20px;
}

.section-subtitle {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 16px;
}

/* 指标卡片 */
.metric-cards {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-card {
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.metric-name {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.metric-score {
  font-size: 16px;
  font-weight: 700;
  color: #3b82f6;
}

.metric-details {
  margin-bottom: 12px;
}

.metric-detail {
  font-size: 12px;
  color: #6b7280;
}

.progress-bar {
  position: relative;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  right: 8px;
  top: -20px;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

/* 评分网格 */
.evaluation-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.eval-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: #f8fafc;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.eval-label {
  font-size: 14px;
  color: #374151;
  font-weight: 500;
}

.eval-score {
  font-size: 14px;
  font-weight: 700;
  color: #3b82f6;
}

.section-total {
  text-align: right;
  padding: 12px 0;
  border-top: 1px solid #e5e7eb;
}

.total-label {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

/* 考核结果 */
.evaluation-results {
  background: #f8fafc;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
}

.results-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 24px;
}

.result-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
}

.result-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 8px;
}

.result-value {
  font-size: 20px;
  font-weight: 700;
}

.total-score {
  color: #1f2937;
}

.grade-value {
  color: #3b82f6;
}

.rank-value {
  color: #374151;
}

.improvement-suggestion {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 20px;
}

.suggestion-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 8px;
}

.suggestion-text {
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
  margin: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .evaluation-grid {
    grid-template-columns: 1fr;
  }

  .results-grid {
    grid-template-columns: 1fr;
  }

  .modal-actions {
    flex-direction: column;
    gap: 8px;
  }
}

.employee-summary {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  margin-bottom: 24px;
}

.employee-info-detailed {
  display: flex;
  align-items: center;
  gap: 16px;
}

.employee-avatar-large {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 24px;
  box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
}

.employee-details-large {
  flex: 1;
}

.employee-name-large {
  font-size: 20px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
}

.employee-position-large {
  font-size: 14px;
  color: #64748b;
  margin-bottom: 2px;
}

.employee-department {
  font-size: 12px;
  color: #94a3b8;
}

.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  min-width: 200px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.stat-value {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.total-score-large {
  font-size: 24px;
  font-weight: 800;
  color: #4f46e5;
}

.grade-badge-large {
  padding: 8px 16px;
  border-radius: 20px;
  color: white;
  font-weight: 700;
  font-size: 14px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.score-breakdown {
  background: white;
  border-radius: 12px;
  padding: 24px;
  border: 1px solid #e5e7eb;
}

.breakdown-title {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e5e7eb;
}

.score-details {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.score-item {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e2e8f0;
}

.score-item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.score-item-name {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.score-item-weight {
  font-size: 12px;
  color: #64748b;
  background: #e2e8f0;
  padding: 4px 8px;
  border-radius: 12px;
}

.score-item-value {
  display: flex;
  align-items: center;
  gap: 16px;
}

.score-number {
  font-size: 20px;
  font-weight: 700;
  color: #4f46e5;
  min-width: 60px;
}

.score-bar {
  flex: 1;
  height: 8px;
  background: #e5e7eb;
  border-radius: 4px;
  overflow: hidden;
}

.score-fill {
  height: 100%;
  background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%);
  border-radius: 4px;
  transition: width 0.3s ease;
}

.grade-explanation {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 12px;
  border: 1px solid #f59e0b;
}

.grade-explanation h5 {
  font-size: 14px;
  font-weight: 600;
  color: #92400e;
  margin-bottom: 8px;
}

.grade-description {
  font-size: 14px;
  color: #92400e;
  line-height: 1.5;
  margin: 0;
}

@media (max-width: 768px) {
  .performance-details-modal {
    max-width: 95vw;
    margin: 20px;
  }

  .employee-summary {
    flex-direction: column;
    align-items: stretch;
  }

  .summary-stats {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .stat-item {
    min-width: auto;
    flex: 1;
  }
}
</style>
