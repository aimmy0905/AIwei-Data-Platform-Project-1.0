<template>
  <div class="reports-view">
    <!-- 页面标题 -->
    <div class="page-header">
      <div class="header-content">
        <h1>
          <FileText class="icon" />
          报告中心
        </h1>
        <p>周报月报数据看板，用于客户会议展示和数据分析</p>
      </div>

    </div>

    <!-- 标签页导航 -->
    <div class="report-tabs">
      <button
        class="tab-button"
        :class="{ active: currentTab === 'weekly' }"
        @click="currentTab = 'weekly'"
      >
        <Calendar class="icon" />
        周报数据看板
      </button>
      <button
        class="tab-button"
        :class="{ active: currentTab === 'monthly' }"
        @click="currentTab = 'monthly'"
      >
        <BarChart3 class="icon" />
        月报数据看板
      </button>

    </div>

    <!-- 周报列表 -->
    <div v-if="currentTab === 'weekly'" class="tab-content">
      <div v-if="!selectedWeeklyReport" class="reports-list">
        <div class="reports-header">
          <h2>周报列表</h2>
          <div class="filters">
            <input
              v-model="weeklySearchTerm"
              type="text"
              placeholder="搜索项目名称、客户或周期..."
              class="search-input"
            />
            <select v-model="weeklyCustomerFilter" class="filter-select">
              <option value="">全部客户</option>
              <option value="Apple Inc.">Apple Inc.</option>
              <option value="Samsung Electronics">Samsung Electronics</option>
              <option value="Nike Inc.">Nike Inc.</option>
              <option value="Tesla Motors">Tesla Motors</option>
              <option value="Microsoft Corporation">Microsoft Corporation</option>
            </select>
            <select v-model="weeklyProjectFilter" class="filter-select">
              <option value="">全部项目</option>
              <option value="Apple iPhone推广项目">Apple iPhone推广项目</option>
              <option value="Samsung Galaxy营销项目">Samsung Galaxy营销项目</option>
              <option value="Nike运动鞋推广">Nike运动鞋推广</option>
              <option value="Tesla Model Y营销">Tesla Model Y营销</option>
              <option value="Microsoft Surface推广">Microsoft Surface推广</option>
            </select>
            <select v-model="weeklyTimeFilter" class="filter-select">
              <option value="">全部时间</option>
              <option value="2025-W03">2025年第3周</option>
              <option value="2025-W02">2025年第2周</option>
              <option value="2025-W01">2025年第1周</option>
              <option value="2024-W52">2024年第52周</option>
            </select>
            <select v-model="weeklyStatusFilter" class="filter-select">
              <option value="">全部状态</option>
              <option value="completed">已完成</option>
              <option value="draft">草稿</option>
              <option value="in_progress">进行中</option>
            </select>
          </div>
        </div>

        <!-- 周报列表 -->
        <div class="reports-grid">
          <div
            v-for="report in filteredWeeklyReports"
            :key="report.id"
            class="report-card"
            @click="viewWeeklyReport(report.id)"
          >
            <div class="report-header">
              <div class="header-left">
                <h3>{{ report.weekPeriod }}</h3>
                <p class="report-period">{{ report.reportPeriod }}</p>
              </div>
              <span class="status-badge" :class="`status-${report.status}`">
                {{ getStatusLabel(report.status) }}
              </span>
            </div>
            <div class="report-info">
              <p><strong>项目：</strong>{{ report.projectName }}</p>
              <p><strong>客户：</strong>{{ report.customerName }}</p>
              <p><strong>跟进团队：</strong>{{ report.followUpTeam.join(', ') }}</p>
              <p><strong>创建时间：</strong>{{ formatDate(report.createdAt) }}</p>
            </div>
            <div class="report-metrics">
              <div class="metric-item">
                <span class="metric-label">访问量</span>
                <span class="metric-value">{{ report.metrics.visits.toLocaleString() }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">转化率</span>
                <span class="metric-value">{{ report.metrics.conversion }}%</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">ROI</span>
                <span class="metric-value">{{ report.metrics.roi }}%</span>
              </div>
            </div>
            <div class="report-actions">
              <div class="action-stats">
                <span class="stat-item">
                  <Users class="icon" />
                  {{ report.meetingsCount }} 个会议
                </span>
                <span class="stat-item">
                  <FileText class="icon" />
                  {{ report.completedTodosCount }}/{{ report.todosCount }} 待办
                </span>
              </div>
              <div class="action-buttons">
                <button class="btn btn-sm btn-outline" @click.stop="viewMeetingRecords(report.id)">
                  <Users class="icon" />
                  会议记录
                </button>
                <button class="btn btn-sm btn-outline" @click.stop="viewTodoItems(report.id)">
                  <FileText class="icon" />
                  待办事项
                </button>
                <button class="btn btn-sm btn-outline" @click.stop="viewDataDashboard(report.id)">
                  <LayoutDashboard class="icon" />
                  查看数据面板
                </button>
                <button class="btn btn-sm btn-secondary" @click.stop="downloadReport('weekly', report.id)">
                  <Download class="icon" />
                  下载
                </button>
                <button class="btn btn-sm btn-primary" @click.stop="openMeetingModal('weekly', report.id)">
                  <Plus class="icon" />
                  新建会议
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 周报详情数据看板 -->
      <div v-else class="dashboard-view">
        <div class="dashboard-header">
          <button class="btn btn-secondary" @click="backToWeeklyList">
            <ArrowLeft class="icon" />
            返回列表
          </button>
          <h2>{{ currentWeeklyReport?.weekPeriod }} - {{ currentWeeklyReport?.projectName }}</h2>
          <div class="header-actions">
            <button class="btn btn-secondary" @click="downloadReport('weekly', selectedWeeklyReport)">
              <Download class="icon" />
              下载数据
            </button>

          </div>
        </div>

        <div class="dashboard-container">
          <div class="dashboard-info">
            <div class="info-card">
              <h3>{{ currentWeeklyReport?.projectName }}</h3>
              <p>客户：{{ currentWeeklyReport?.customerName }}</p>
              <p>周期：{{ currentWeeklyReport?.weekPeriod }}</p>
              <p>状态：<span class="status-badge" :class="`status-${currentWeeklyReport?.status}`">{{ getStatusLabel(currentWeeklyReport?.status || '') }}</span></p>
            </div>
          </div>

          <!-- 数据看板组件 -->
          <div class="dashboard-content">
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-header">
                  <h4>本周访问量</h4>
                  <TrendingUp class="icon" />
                </div>
                <div class="metric-value">{{ currentWeeklyReport?.metrics?.visits || 0 }}</div>
                <div class="metric-change positive">+{{ currentWeeklyReport?.metrics?.visitsChange || 0 }}%</div>
              </div>
              <div class="metric-card">
                <div class="metric-header">
                  <h4>转化率</h4>
                  <Target class="icon" />
                </div>
                <div class="metric-value">{{ currentWeeklyReport?.metrics?.conversion || 0 }}%</div>
                <div class="metric-change" :class="(currentWeeklyReport?.metrics?.conversionChange || 0) >= 0 ? 'positive' : 'negative'">
                  {{ (currentWeeklyReport?.metrics?.conversionChange || 0) >= 0 ? '+' : '' }}{{ currentWeeklyReport?.metrics?.conversionChange || 0 }}%
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-header">
                  <h4>广告花费</h4>
                  <DollarSign class="icon" />
                </div>
                <div class="metric-value">${{ currentWeeklyReport?.metrics?.adSpend || 0 }}</div>
                <div class="metric-change" :class="(currentWeeklyReport?.metrics?.adSpendChange || 0) <= 0 ? 'positive' : 'negative'">
                  {{ (currentWeeklyReport?.metrics?.adSpendChange || 0) >= 0 ? '+' : '' }}{{ currentWeeklyReport?.metrics?.adSpendChange || 0 }}%
                </div>
              </div>
              <div class="metric-card">
                <div class="metric-header">
                  <h4>ROI</h4>
                  <Activity class="icon" />
                </div>
                <div class="metric-value">{{ currentWeeklyReport?.metrics?.roi || 0 }}%</div>
                <div class="metric-change" :class="(currentWeeklyReport?.metrics?.roiChange || 0) >= 0 ? 'positive' : 'negative'">
                  {{ (currentWeeklyReport?.metrics?.roiChange || 0) >= 0 ? '+' : '' }}{{ currentWeeklyReport?.metrics?.roiChange || 0 }}%
                </div>
              </div>
            </div>

            <!-- 图表区域 -->
            <div class="charts-section">
              <div class="chart-container">
                <h4>本周流量趋势</h4>
                <div class="chart-placeholder">
                  <BarChart3 class="chart-icon" />
                  <p>流量趋势图表</p>
                </div>
              </div>
              <div class="chart-container">
                <h4>渠道分析</h4>
                <div class="chart-placeholder">
                  <PieChart class="chart-icon" />
                  <p>渠道分布图表</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 月报数据看板 -->
    <div v-if="currentTab === 'monthly'" class="tab-content">
      <!-- 月报列表视图 -->
      <div v-if="!selectedMonthlyReport" class="reports-section">
        <div class="reports-header">
          <h2>月报数据看板</h2>
          <div class="filters">
            <input
              v-model="monthlySearchTerm"
              type="text"
              placeholder="搜索项目名称、客户或月份..."
              class="search-input"
            />
            <select v-model="monthlyCustomerFilter" class="filter-select">
              <option value="">全部客户</option>
              <option value="Apple Inc.">Apple Inc.</option>
              <option value="Samsung Electronics">Samsung Electronics</option>
              <option value="Nike Inc.">Nike Inc.</option>
              <option value="Tesla Motors">Tesla Motors</option>
              <option value="Microsoft Corporation">Microsoft Corporation</option>
            </select>
            <select v-model="monthlyProjectFilter" class="filter-select">
              <option value="">全部项目</option>
              <option value="Apple iPhone推广项目">Apple iPhone推广项目</option>
              <option value="Samsung Galaxy营销项目">Samsung Galaxy营销项目</option>
              <option value="Nike运动鞋推广">Nike运动鞋推广</option>
              <option value="Tesla Model Y营销">Tesla Model Y营销</option>
              <option value="Microsoft Surface推广">Microsoft Surface推广</option>
            </select>
            <select v-model="monthlyTimeFilter" class="filter-select">
              <option value="">全部时间</option>
              <option value="2025-01">2025年1月</option>
              <option value="2024-12">2024年12月</option>
              <option value="2024-11">2024年11月</option>
              <option value="2024-10">2024年10月</option>
            </select>
            <select v-model="monthlyStatusFilter" class="filter-select">
              <option value="">全部状态</option>
              <option value="completed">已完成</option>
              <option value="in_progress">进行中</option>
              <option value="draft">草稿</option>
            </select>
          </div>
        </div>

        <div class="reports-grid">
          <div v-for="report in filteredMonthlyReports" :key="report.id" class="report-card" @click="viewMonthlyReport(report.id)">
            <div class="report-header">
              <div class="header-left">
                <h3>{{ report.monthPeriod }}</h3>
                <p class="report-period">{{ report.reportPeriod }}</p>
              </div>
              <span class="status-badge" :class="`status-${report.status}`">
                {{ getStatusLabel(report.status) }}
              </span>
            </div>
            <div class="report-info">
              <p><strong>项目：</strong>{{ report.projectName }}</p>
              <p><strong>客户：</strong>{{ report.customerName }}</p>
              <p><strong>跟进团队：</strong>{{ report.followUpTeam.join(', ') }}</p>
              <p><strong>创建时间：</strong>{{ formatDate(report.createdAt) }}</p>
            </div>
            <div class="report-metrics">
              <div class="metric-item">
                <span class="metric-label">访问量</span>
                <span class="metric-value">{{ report.metrics.visits.toLocaleString() }}</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">转化率</span>
                <span class="metric-value">{{ report.metrics.conversion }}%</span>
              </div>
              <div class="metric-item">
                <span class="metric-label">ROI</span>
                <span class="metric-value">{{ report.metrics.roi }}%</span>
              </div>
            </div>
            <div class="report-actions">
              <div class="action-stats">
                <span class="stat-item">
                  <Users class="icon" />
                  {{ report.meetingsCount }} 个会议
                </span>
                <span class="stat-item">
                  <FileText class="icon" />
                  {{ report.completedTodosCount }}/{{ report.todosCount }} 待办
                </span>
              </div>
              <div class="action-buttons">
                <button class="btn btn-sm btn-outline" @click.stop="viewMeetingRecords(report.id)">
                  <Users class="icon" />
                  会议记录
                </button>
                <button class="btn btn-sm btn-outline" @click.stop="viewTodoItems(report.id)">
                  <FileText class="icon" />
                  待办事项
                </button>
                <button class="btn btn-sm btn-outline" @click.stop="viewDataDashboard(report.id)">
                  <LayoutDashboard class="icon" />
                  查看数据面板
                </button>
                <button class="btn btn-sm btn-secondary" @click.stop="downloadReport('monthly', report.id)">
                  <Download class="icon" />
                  下载
                </button>
                <button class="btn btn-sm btn-primary" @click.stop="openMeetingModal('monthly', report.id)">
                  <Plus class="icon" />
                  新建会议
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 月报详情数据看板 -->
      <div v-else class="dashboard-section">
        <div class="dashboard-header">
          <button class="btn btn-secondary" @click="backToMonthlyList">
            <ArrowLeft class="icon" />
            返回列表
          </button>
          <h2>{{ currentMonthlyReport?.monthPeriod }} - {{ currentMonthlyReport?.projectName }}</h2>
          <div class="header-actions">
            <button class="btn btn-secondary" @click="downloadReport('monthly', selectedMonthlyReport)">
              <Download class="icon" />
              下载数据
            </button>

          </div>
        </div>

        <div class="dashboard-container">
          <div class="dashboard-info">
            <div class="info-card">
              <h3>{{ currentMonthlyReport?.projectName }}</h3>
              <p>客户：{{ currentMonthlyReport?.customerName }}</p>
              <p>月份：{{ currentMonthlyReport?.monthPeriod }}</p>
              <p>包含周报：{{ currentMonthlyReport?.weeklyReportsCount }} 个</p>
              <p>状态：<span class="status-badge" :class="`status-${currentMonthlyReport?.status}`">{{ getStatusLabel(currentMonthlyReport?.status || '') }}</span></p>
            </div>
          </div>

          <!-- 月度数据看板组件 -->
        <div class="dashboard-content">
          <div class="metrics-grid">
            <div class="metric-card">
              <div class="metric-header">
                <h4>月度访问量</h4>
                <TrendingUp class="icon" />
              </div>
              <div class="metric-value">{{ currentMonthlyReport?.metrics?.visits || 0 }}</div>
              <div class="metric-change positive">+{{ currentMonthlyReport?.metrics?.visitsChange || 0 }}%</div>
            </div>
            <div class="metric-card">
              <div class="metric-header">
                <h4>平均转化率</h4>
                <Target class="icon" />
              </div>
              <div class="metric-value">{{ currentMonthlyReport?.metrics?.conversion || 0 }}%</div>
              <div class="metric-change" :class="(currentMonthlyReport?.metrics?.conversionChange || 0) >= 0 ? 'positive' : 'negative'">
                {{ (currentMonthlyReport?.metrics?.conversionChange || 0) >= 0 ? '+' : '' }}{{ currentMonthlyReport?.metrics?.conversionChange || 0 }}%
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-header">
                <h4>月度广告花费</h4>
                <DollarSign class="icon" />
              </div>
              <div class="metric-value">${{ currentMonthlyReport?.metrics?.adSpend || 0 }}</div>
              <div class="metric-change" :class="(currentMonthlyReport?.metrics?.adSpendChange || 0) <= 0 ? 'positive' : 'negative'">
                {{ (currentMonthlyReport?.metrics?.adSpendChange || 0) >= 0 ? '+' : '' }}{{ currentMonthlyReport?.metrics?.adSpendChange || 0 }}%
              </div>
            </div>
            <div class="metric-card">
              <div class="metric-header">
                <h4>月度ROI</h4>
                <Activity class="icon" />
              </div>
              <div class="metric-value">{{ currentMonthlyReport?.metrics?.roi || 0 }}%</div>
              <div class="metric-change" :class="(currentMonthlyReport?.metrics?.roiChange || 0) >= 0 ? 'positive' : 'negative'">
                {{ (currentMonthlyReport?.metrics?.roiChange || 0) >= 0 ? '+' : '' }}{{ currentMonthlyReport?.metrics?.roiChange || 0 }}%
              </div>
            </div>
          </div>

          <!-- 月度图表 -->
          <div class="charts-section">
            <div class="chart-container large">
              <h4>月度趋势分析</h4>
              <div class="chart-placeholder">
                <LineChart class="chart-icon" />
                <p>月度趋势图表</p>
              </div>
            </div>
            <div class="chart-container">
              <h4>周度对比</h4>
              <div class="chart-placeholder">
                <BarChart3 class="chart-icon" />
                <p>周度对比图表</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="dashboard-actions">
          <button class="btn btn-outline" @click="viewDataDashboard(selectedMonthlyReport)">
            <LayoutDashboard class="icon" />
            查看数据面板
          </button>
          <button class="btn btn-secondary" @click="downloadReport('monthly')">
            <Download class="icon" />
            下载月报数据
          </button>
          <button class="btn btn-primary" @click="openMeetingModal('monthly')">
            <Users class="icon" />
            安排客户会议
          </button>
        </div>
        </div>
      </div>
    </div>



    <!-- 会议详情/编辑模态框 -->
    <div v-if="showMeetingModal" class="modal-overlay" @click="closeMeetingModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ meetingModalMode === 'create' ? '创建会议' : meetingModalMode === 'edit' ? '编辑会议' : '会议详情' }}</h3>
          <button class="close-btn" @click="closeMeetingModal">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>会议标题</label>
            <input
              v-model="currentMeeting.title"
              type="text"
              :readonly="meetingModalMode === 'view'"
              placeholder="输入会议标题"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>会议日期</label>
              <input
                v-model="currentMeeting.date"
                type="date"
                :readonly="meetingModalMode === 'view'"
              />
            </div>
            <div class="form-group">
              <label>会议时间</label>
              <input
                v-model="currentMeeting.time"
                type="time"
                :readonly="meetingModalMode === 'view'"
              />
            </div>
          </div>
          <div class="form-group">
            <label>参会人员</label>
            <input
              v-model="attendeesInput"
              type="text"
              :readonly="meetingModalMode === 'view'"
              placeholder="用逗号分隔多个参会人员"
            />
          </div>
          <div class="form-row">
            <div class="form-group">
              <label>关联报告类型</label>
              <select v-model="currentMeeting.reportType" :disabled="meetingModalMode === 'view'">
                <option value="weekly">周报</option>
                <option value="monthly">月报</option>
              </select>
            </div>
            <div class="form-group">
              <label>报告期间</label>
              <input
                v-model="currentMeeting.reportPeriod"
                type="text"
                :readonly="meetingModalMode === 'view'"
                placeholder="如：2025-W03 或 2025-01"
              />
            </div>
          </div>
          <div class="form-group">
            <label>会议议程</label>
            <textarea
              v-model="currentMeeting.agenda"
              :readonly="meetingModalMode === 'view'"
              placeholder="输入会议议程"
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label>会议记录</label>
            <textarea
              v-model="currentMeeting.notes"
              :readonly="meetingModalMode === 'view'"
              placeholder="输入会议记录"
              rows="6"
            ></textarea>
          </div>
          <div class="form-group">
            <label>待办事项</label>
            <div class="todo-list">
              <div v-for="(todo, index) in currentMeeting.todos" :key="index" class="todo-item">
                <input
                  v-model="todo.task"
                  type="text"
                  :readonly="meetingModalMode === 'view'"
                  placeholder="待办事项"
                />
                <input
                  v-model="todo.assignee"
                  type="text"
                  :readonly="meetingModalMode === 'view'"
                  placeholder="负责人"
                />
                <input
                  v-model="todo.deadline"
                  type="date"
                  :readonly="meetingModalMode === 'view'"
                />
                <button
                  v-if="meetingModalMode !== 'view'"
                  class="btn btn-sm btn-danger"
                  @click="removeTodo(index)"
                >
                  <X class="icon" />
                </button>
              </div>
              <button
                v-if="meetingModalMode !== 'view'"
                class="btn btn-sm btn-secondary"
                @click="addTodo"
              >
                <Plus class="icon" />
                添加待办事项
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeMeetingModal">取消</button>
          <button
            v-if="meetingModalMode !== 'view'"
            class="btn btn-primary"
            @click="saveMeeting"
          >
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 会议记录模态框 -->
    <div v-if="showMeetingRecordsModal" class="modal-overlay" @click="closeMeetingRecordsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>会议记录</h3>
          <button class="close-btn" @click="closeMeetingRecordsModal">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <div class="meetings-records-list">
            <div v-for="meeting in getReportMeetings(currentReportId)" :key="meeting.id" class="meeting-record-item">
              <div class="meeting-record-header">
                <h4>{{ meeting.title }}</h4>
                <span class="meeting-date">{{ meeting.date }} {{ meeting.time }}</span>
              </div>
              <div class="meeting-record-content">
                <div class="meeting-attendees">
                  <strong>参会人员：</strong>{{ meeting.attendees.join(', ') }}
                </div>
                <div class="meeting-agenda" v-if="meeting.agenda">
                  <strong>会议议程：</strong>
                  <p>{{ meeting.agenda }}</p>
                </div>
                <div class="meeting-notes" v-if="meeting.notes">
                  <strong>会议记录：</strong>
                  <p>{{ meeting.notes }}</p>
                </div>
              </div>
            </div>
            <div v-if="getReportMeetings(currentReportId).length === 0" class="empty-state">
              <Users class="empty-icon" />
              <p>暂无会议记录</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeMeetingRecordsModal">关闭</button>
          <button class="btn btn-primary" @click="openMeetingModal('weekly', currentReportId)">
            <Plus class="icon" />
            新建会议
          </button>
        </div>
      </div>
    </div>

    <!-- 待办事项模态框 -->
    <div v-if="showTodoItemsModal" class="modal-overlay" @click="closeTodoItemsModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>待办事项</h3>
          <button class="close-btn" @click="closeTodoItemsModal">
            <X class="icon" />
          </button>
        </div>
        <div class="modal-body">
          <div class="todo-items-list">
            <div v-for="todo in getReportTodos(currentReportId)" :key="todo.id" class="todo-item-card">
              <div class="todo-item-header">
                <div class="todo-checkbox">
                  <input
                    type="checkbox"
                    :checked="todo.completed"
                    @change="toggleTodo(todo.id)"
                    :id="`todo-${todo.id}`"
                  />
                  <label :for="`todo-${todo.id}`"></label>
                </div>
                <h4 :class="{ completed: todo.completed }">{{ todo.title }}</h4>
                <span class="todo-priority" :class="`priority-${todo.priority}`">
                  {{ getPriorityLabel(todo.priority) }}
                </span>
              </div>
              <div class="todo-item-content">
                <p v-if="todo.description">{{ todo.description }}</p>
                <div class="todo-meta">
                  <span class="todo-assignee">
                    <Users class="icon" />
                    {{ todo.assignee }}
                  </span>
                  <span class="todo-deadline">
                    <Calendar class="icon" />
                    {{ formatDate(todo.deadline) }}
                  </span>
                </div>
              </div>
            </div>
            <div v-if="getReportTodos(currentReportId).length === 0" class="empty-state">
              <FileText class="empty-icon" />
              <p>暂无待办事项</p>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" @click="closeTodoItemsModal">关闭</button>
          <button class="btn btn-primary" @click="createTodoItem">
            <Plus class="icon" />
            新建待办
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  FileText, Plus, Calendar, BarChart3, Users, TrendingUp, Target,
  DollarSign, Activity, PieChart, LineChart, Download, Eye, Edit, X, ArrowLeft,
  LayoutDashboard
} from 'lucide-vue-next'

// Router
const router = useRouter()

// 响应式数据
const currentTab = ref('weekly')
const selectedWeeklyReport = ref('')
const selectedMonthlyReport = ref('')
const showMeetingModal = ref(false)
const meetingModalMode = ref<'create' | 'edit' | 'view'>('create')
const attendeesInput = ref('')

// 会议记录和待办事项模态框
const showMeetingRecordsModal = ref(false)
const showTodoItemsModal = ref(false)
const currentReportId = ref('')

// 当前会议数据
const currentMeeting = ref({
  id: '',
  title: '',
  date: '',
  time: '',
  attendees: [] as string[],
  reportType: 'weekly' as 'weekly' | 'monthly',
  reportPeriod: '',
  status: 'scheduled' as string,
  agenda: '',
  notes: '',
  todos: [] as Array<{task: string, assignee: string, deadline: string}>
})

// 搜索和筛选
const weeklySearchTerm = ref('')
const weeklyStatusFilter = ref('')
const weeklyCustomerFilter = ref('')
const weeklyProjectFilter = ref('')
const weeklyTimeFilter = ref('')
const monthlySearchTerm = ref('')
const monthlyStatusFilter = ref('')
const monthlyCustomerFilter = ref('')
const monthlyProjectFilter = ref('')
const monthlyTimeFilter = ref('')

// 周报数据
const weeklyReports = ref([
  {
    id: 'weekly-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    weekPeriod: '2025-W03',
    reportPeriod: '2025年1月20日~2025年1月26日',
    status: 'completed',
    createdAt: '2025-01-20T09:00:00Z',
    followUpTeam: ['张三', '李四', '王五'],
    meetingsCount: 2,
    todosCount: 5,
    completedTodosCount: 3,
    metrics: {
      visits: 12500,
      visitsChange: 15.2,
      conversion: 3.8,
      conversionChange: 0.5,
      adSpend: 8500,
      adSpendChange: -2.1,
      roi: 285,
      roiChange: 12.3
    }
  },
  {
    id: 'weekly-2',
    projectName: 'Samsung Galaxy营销项目',
    customerName: 'Samsung Electronics',
    weekPeriod: '2025-W03',
    reportPeriod: '2025年1月20日~2025年1月26日',
    status: 'completed',
    createdAt: '2025-01-20T09:30:00Z',
    followUpTeam: ['赵六', '钱七'],
    meetingsCount: 1,
    todosCount: 3,
    completedTodosCount: 2,
    metrics: {
      visits: 9800,
      visitsChange: 8.7,
      conversion: 4.2,
      conversionChange: -0.3,
      adSpend: 6200,
      adSpendChange: 1.8,
      roi: 320,
      roiChange: 5.6
    }
  }
])

// 月报数据
const monthlyReports = ref([
  {
    id: 'monthly-1',
    projectName: 'Apple iPhone推广项目',
    customerName: 'Apple Inc.',
    monthPeriod: '2025-01',
    reportPeriod: '2025年1月1日~2025年1月31日',
    weeklyReportsCount: 4,
    status: 'completed',
    createdAt: '2025-01-31T18:00:00Z',
    followUpTeam: ['张三', '李四', '王五'],
    meetingsCount: 6,
    todosCount: 15,
    completedTodosCount: 12,
    metrics: {
      visits: 48500,
      visitsChange: 22.1,
      conversion: 3.6,
      conversionChange: 0.8,
      adSpend: 32000,
      adSpendChange: -5.2,
      roi: 295,
      roiChange: 18.7
    }
  },
  {
    id: 'monthly-2',
    projectName: 'Samsung Galaxy营销项目',
    customerName: 'Samsung Electronics',
    monthPeriod: '2025-01',
    reportPeriod: '2025年1月1日~2025年1月31日',
    weeklyReportsCount: 4,
    status: 'completed',
    createdAt: '2025-01-31T17:30:00Z',
    followUpTeam: ['赵六', '钱七', '孙八'],
    meetingsCount: 4,
    todosCount: 12,
    completedTodosCount: 10,
    metrics: {
      visits: 38200,
      visitsChange: 18.5,
      conversion: 4.1,
      conversionChange: 0.3,
      adSpend: 24800,
      adSpendChange: 3.2,
      roi: 315,
      roiChange: 12.4
    }
  },
  {
    id: 'monthly-3',
    projectName: 'Nike运动鞋推广',
    customerName: 'Nike Inc.',
    monthPeriod: '2024-12',
    reportPeriod: '2024年12月1日~2024年12月31日',
    weeklyReportsCount: 5,
    status: 'completed',
    createdAt: '2024-12-31T16:00:00Z',
    followUpTeam: ['周九', '吴十'],
    meetingsCount: 5,
    todosCount: 18,
    completedTodosCount: 16,
    metrics: {
      visits: 52300,
      visitsChange: 28.7,
      conversion: 3.2,
      conversionChange: -0.2,
      adSpend: 35600,
      adSpendChange: 8.1,
      roi: 278,
      roiChange: 15.9
    }
  },
  {
    id: 'monthly-4',
    projectName: 'Tesla Model Y营销',
    customerName: 'Tesla Motors',
    monthPeriod: '2024-12',
    reportPeriod: '2024年12月1日~2024年12月31日',
    weeklyReportsCount: 5,
    status: 'in_progress',
    createdAt: '2024-12-31T15:45:00Z',
    followUpTeam: ['郑十一', '王十二'],
    meetingsCount: 3,
    todosCount: 8,
    completedTodosCount: 6,
    metrics: {
      visits: 29800,
      visitsChange: 12.3,
      conversion: 2.8,
      conversionChange: 0.6,
      adSpend: 28900,
      adSpendChange: -1.5,
      roi: 198,
      roiChange: 8.7
    }
  },
  {
    id: 'monthly-5',
    projectName: 'Microsoft Surface推广',
    customerName: 'Microsoft Corporation',
    monthPeriod: '2024-11',
    reportPeriod: '2024年11月1日~2024年11月30日',
    weeklyReportsCount: 4,
    status: 'completed',
    createdAt: '2024-11-30T19:00:00Z',
    followUpTeam: ['李十三', '陈十四'],
    meetingsCount: 7,
    todosCount: 20,
    completedTodosCount: 18,
    metrics: {
      visits: 41600,
      visitsChange: 19.8,
      conversion: 3.9,
      conversionChange: 1.2,
      adSpend: 31200,
      adSpendChange: 5.4,
      roi: 342,
      roiChange: 22.1
    }
  }
])

// 会议数据
const meetings = ref([
  {
    id: 'meeting-1',
    title: 'Apple iPhone项目周报会议',
    date: '2025-01-27',
    time: '14:00',
    attendees: ['张三', '李四', 'John Smith'],
    reportType: 'weekly',
    reportPeriod: '2025-W03',
    reportId: 'weekly-1',
    status: 'scheduled',
    agenda: '1. 回顾本周数据表现\n2. 讨论优化策略\n3. 确定下周计划',
    notes: '本次会议主要讨论了本周的数据表现，整体转化率有所提升。决定下周加大Facebook广告投放力度。',
    todos: []
  },
  {
    id: 'meeting-2',
    title: 'Samsung项目进度会议',
    date: '2025-01-26',
    time: '10:00',
    attendees: ['赵六', '钱七'],
    reportType: 'weekly',
    reportPeriod: '2025-W03',
    reportId: 'weekly-2',
    status: 'completed',
    agenda: '1. 回顾项目进展\n2. 分析数据趋势\n3. 制定优化方案',
    notes: '项目进展顺利，ROI表现优异。需要进一步优化落地页转化率。',
    todos: []
  },
  {
    id: 'meeting-3',
    title: 'Apple iPhone项目月度总结会议',
    date: '2025-02-01',
    time: '15:00',
    attendees: ['张三', '李四', '王五', 'John Smith'],
    reportType: 'monthly',
    reportPeriod: '2025-01',
    reportId: 'monthly-1',
    status: 'completed',
    agenda: '1. 回顾1月整体数据表现\n2. 分析月度ROI趋势\n3. 制定2月投放策略',
    notes: '1月整体表现优异，ROI达到295%，超出预期。建议2月继续加大Facebook和Google广告投放，重点优化移动端转化率。',
    todos: []
  },
  {
    id: 'meeting-4',
    title: 'Samsung Galaxy月度复盘会议',
    date: '2025-02-02',
    time: '10:30',
    attendees: ['赵六', '钱七', '孙八'],
    reportType: 'monthly',
    reportPeriod: '2025-01',
    reportId: 'monthly-2',
    status: 'completed',
    agenda: '1. 月度数据分析\n2. 竞品对比分析\n3. 下月策略调整',
    notes: '月度转化率表现良好，但需要关注成本控制。建议优化关键词投放策略，提升质量得分。',
    todos: []
  },
  {
    id: 'meeting-5',
    title: 'Nike运动鞋项目年终总结',
    date: '2025-01-05',
    time: '14:00',
    attendees: ['周九', '吴十'],
    reportType: 'monthly',
    reportPeriod: '2024-12',
    reportId: 'monthly-3',
    status: 'completed',
    agenda: '1. 年终数据回顾\n2. 全年ROI分析\n3. 新年度规划',
    notes: '全年表现优秀，12月ROI达到278%。新年度计划扩大投放规模，重点关注年轻消费群体。',
    todos: []
  }
])

// 筛选后的报告列表
const filteredWeeklyReports = computed(() => {
  let filtered = weeklyReports.value

  if (weeklySearchTerm.value) {
    const query = weeklySearchTerm.value.toLowerCase()
    filtered = filtered.filter(report =>
      report.projectName.toLowerCase().includes(query) ||
      report.customerName.toLowerCase().includes(query) ||
      report.weekPeriod.toLowerCase().includes(query)
    )
  }

  if (weeklyCustomerFilter.value) {
    filtered = filtered.filter(report => report.customerName === weeklyCustomerFilter.value)
  }

  if (weeklyProjectFilter.value) {
    filtered = filtered.filter(report => report.projectName === weeklyProjectFilter.value)
  }

  if (weeklyTimeFilter.value) {
    filtered = filtered.filter(report => report.weekPeriod === weeklyTimeFilter.value)
  }

  if (weeklyStatusFilter.value) {
    filtered = filtered.filter(report => report.status === weeklyStatusFilter.value)
  }

  return filtered
})

const filteredMonthlyReports = computed(() => {
  let filtered = monthlyReports.value

  if (monthlySearchTerm.value) {
    const query = monthlySearchTerm.value.toLowerCase()
    filtered = filtered.filter(report =>
      report.projectName.toLowerCase().includes(query) ||
      report.customerName.toLowerCase().includes(query) ||
      report.monthPeriod.toLowerCase().includes(query)
    )
  }

  if (monthlyCustomerFilter.value) {
    filtered = filtered.filter(report => report.customerName === monthlyCustomerFilter.value)
  }

  if (monthlyProjectFilter.value) {
    filtered = filtered.filter(report => report.projectName === monthlyProjectFilter.value)
  }

  if (monthlyTimeFilter.value) {
    filtered = filtered.filter(report => report.monthPeriod === monthlyTimeFilter.value)
  }

  if (monthlyStatusFilter.value) {
    filtered = filtered.filter(report => report.status === monthlyStatusFilter.value)
  }

  return filtered
})

// 当前选中的报告
const currentWeeklyReport = computed(() =>
  weeklyReports.value.find(r => r.id === selectedWeeklyReport.value)
)

const currentMonthlyReport = computed(() =>
  monthlyReports.value.find(r => r.id === selectedMonthlyReport.value)
)

// 方法
const loadWeeklyDashboard = () => {
  console.log('加载周报数据看板:', selectedWeeklyReport.value)
}

const loadMonthlyDashboard = () => {
  console.log('加载月报数据看板:', selectedMonthlyReport.value)
}

const downloadReport = (type: 'weekly' | 'monthly', reportId?: string) => {
  const report = reportId
    ? (type === 'weekly' ? weeklyReports.value.find(r => r.id === reportId) : monthlyReports.value.find(r => r.id === reportId))
    : (type === 'weekly' ? currentWeeklyReport.value : currentMonthlyReport.value)
  if (!report) return

  console.log(`下载${type === 'weekly' ? '周报' : '月报'}数据:`, report)
  // TODO: 实现数据下载逻辑
}

const openMeetingModal = (reportType?: 'weekly' | 'monthly', reportId?: string) => {
  meetingModalMode.value = 'create'
  currentMeeting.value = {
    id: '',
    title: '',
    date: '',
    time: '',
    attendees: [] as string[],
    reportType: reportType || 'weekly',
    reportPeriod: '',
    status: 'scheduled',
    agenda: '',
    notes: '',
    todos: [] as Array<{task: string, assignee: string, deadline: string}>
  }
  attendeesInput.value = ''
  showMeetingModal.value = true
}

const viewWeeklyReport = (reportId: string) => {
  selectedWeeklyReport.value = reportId
}

const backToWeeklyList = () => {
  selectedWeeklyReport.value = ''
}

const viewMonthlyReport = (reportId: string) => {
  selectedMonthlyReport.value = reportId
}

const backToMonthlyList = () => {
  selectedMonthlyReport.value = ''
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleString('zh-CN')
}

const viewMeetingRecords = (reportId: string) => {
  currentReportId.value = reportId
  showMeetingRecordsModal.value = true
}

const viewTodoItems = (reportId: string) => {
  currentReportId.value = reportId
  showTodoItemsModal.value = true
}

const viewDataDashboard = (reportId: string) => {
  // Navigate to the main dashboard
  router.push({ name: 'dashboard' })
}

const closeMeetingRecordsModal = () => {
  showMeetingRecordsModal.value = false
  currentReportId.value = ''
}

const closeTodoItemsModal = () => {
  showTodoItemsModal.value = false
  currentReportId.value = ''
}

// 获取报告相关的会议记录
const getReportMeetings = (reportId: string) => {
  return meetings.value.filter(meeting => meeting.reportId === reportId)
}

// 获取报告相关的待办事项
const getReportTodos = (reportId: string) => {
  // 模拟待办事项数据
  const mockTodos = [
    {
      id: 'todo-1',
      reportId: 'weekly-1',
      title: '优化广告投放策略',
      description: '根据本周数据分析结果，调整Facebook广告投放策略',
      assignee: '张三',
      deadline: '2025-01-25T18:00:00Z',
      priority: 'high',
      completed: true
    },
    {
      id: 'todo-2',
      reportId: 'weekly-1',
      title: '准备客户汇报材料',
      description: '整理本周数据报告，准备下周客户会议材料',
      assignee: '李四',
      deadline: '2025-01-24T17:00:00Z',
      priority: 'medium',
      completed: true
    },
    {
      id: 'todo-3',
      reportId: 'weekly-1',
      title: '分析竞品投放情况',
      description: '收集并分析主要竞品的广告投放数据',
      assignee: '王五',
      deadline: '2025-01-26T16:00:00Z',
      priority: 'medium',
      completed: false
    },
    {
      id: 'todo-4',
      reportId: 'weekly-2',
      title: '优化落地页转化率',
      description: '根据用户行为数据优化产品落地页',
      assignee: '赵六',
      deadline: '2025-01-25T19:00:00Z',
      priority: 'high',
      completed: true
    },
    {
      id: 'todo-5',
      reportId: 'weekly-2',
      title: '制定下周投放计划',
      description: '基于本周数据制定下周的投放策略和预算分配',
      assignee: '钱七',
      deadline: '2025-01-27T15:00:00Z',
      priority: 'low',
      completed: false
    },
    // 月报相关待办事项
    {
      id: 'todo-6',
      reportId: 'monthly-1',
      title: '制定2月投放预算',
      description: '基于1月ROI表现，制定2月各平台投放预算分配方案',
      assignee: '张三',
      deadline: '2025-02-05T18:00:00Z',
      priority: 'high',
      completed: true
    },
    {
      id: 'todo-7',
      reportId: 'monthly-1',
      title: '优化移动端转化率',
      description: '重点优化移动端用户体验，提升转化率至4.5%以上',
      assignee: '李四',
      deadline: '2025-02-10T17:00:00Z',
      priority: 'high',
      completed: false
    },
    {
      id: 'todo-8',
      reportId: 'monthly-1',
      title: '分析用户行为数据',
      description: '深入分析1月用户行为数据，找出转化路径优化点',
      assignee: '王五',
      deadline: '2025-02-08T16:00:00Z',
      priority: 'medium',
      completed: false
    },
    {
      id: 'todo-9',
      reportId: 'monthly-2',
      title: '关键词质量得分优化',
      description: '优化Google Ads关键词质量得分，降低平均点击成本',
      assignee: '赵六',
      deadline: '2025-02-12T19:00:00Z',
      priority: 'high',
      completed: true
    },
    {
      id: 'todo-10',
      reportId: 'monthly-2',
      title: '竞品投放策略分析',
      description: '分析主要竞品1月投放策略，制定差异化竞争方案',
      assignee: '钱七',
      deadline: '2025-02-15T15:00:00Z',
      priority: 'medium',
      completed: false
    },
    {
      id: 'todo-11',
      reportId: 'monthly-3',
      title: '年度投放总结报告',
      description: '整理全年投放数据，制作年度总结报告',
      assignee: '周九',
      deadline: '2025-01-10T18:00:00Z',
      priority: 'medium',
      completed: true
    },
    {
      id: 'todo-12',
      reportId: 'monthly-3',
      title: '新年度预算规划',
      description: '制定新年度各渠道投放预算和KPI目标',
      assignee: '吴十',
      deadline: '2025-01-15T17:00:00Z',
      priority: 'high',
      completed: true
    }
  ]
  return mockTodos.filter(todo => todo.reportId === reportId)
}

// 切换待办事项完成状态
const toggleTodo = (todoId: string) => {
  console.log('切换待办事项状态:', todoId)
  // TODO: 实现切换待办事项状态
}

// 获取优先级标签
const getPriorityLabel = (priority: string) => {
  const priorityMap = {
    high: '高优先级',
    medium: '中优先级',
    low: '低优先级'
  }
  return priorityMap[priority as keyof typeof priorityMap] || priority
}

// 创建新的待办事项
const createTodoItem = () => {
  console.log('创建新的待办事项')
  // TODO: 实现创建待办事项功能
  closeTodoItemsModal()
}

const closeMeetingModal = () => {
  showMeetingModal.value = false
}

const createMeeting = () => {
  openMeetingModal()
}

const viewMeeting = (meeting: any) => {
  meetingModalMode.value = 'view'
  currentMeeting.value = { ...meeting }
  attendeesInput.value = meeting.attendees.join(', ')
  showMeetingModal.value = true
}

const editMeeting = (meeting: any) => {
  meetingModalMode.value = 'edit'
  currentMeeting.value = { ...meeting }
  attendeesInput.value = meeting.attendees.join(', ')
  showMeetingModal.value = true
}

const addTodo = () => {
  currentMeeting.value.todos.push({
    task: '',
    assignee: '',
    deadline: ''
  })
}

const removeTodo = (index: number) => {
  currentMeeting.value.todos.splice(index, 1)
}

const saveMeeting = () => {
  // 处理参会人员
  currentMeeting.value.attendees = attendeesInput.value
    .split(',')
    .map(name => name.trim())
    .filter(name => name)

  if (meetingModalMode.value === 'create') {
    currentMeeting.value.id = `meeting-${Date.now()}`
    meetings.value.push({ ...currentMeeting.value } as any)
  } else {
    const index = meetings.value.findIndex(m => m.id === currentMeeting.value.id)
    if (index > -1) {
      meetings.value[index] = { ...currentMeeting.value } as any
    }
  }

  closeMeetingModal()
}

const getStatusLabel = (status: string) => {
  const statusMap = {
    draft: '草稿',
    completed: '已完成',
    scheduled: '已安排',
    in_progress: '进行中'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getMeetingStatusLabel = (status: string) => {
  const statusMap = {
    scheduled: '已安排',
    in_progress: '进行中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

onMounted(() => {
  console.log('报告中心已加载')
})
</script>

<style scoped>
.reports-view {
  padding: var(--spacing-xl);
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  padding-bottom: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.header-content h1 {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.header-content p {
  color: var(--color-text-secondary);
  margin: 0;
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
}

.report-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.tab-button {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  border-bottom: 2px solid transparent;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.tab-button:hover {
  color: var(--color-primary);
}

.tab-button.active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.tab-content {
  min-height: 600px;
}

.reports-header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.reports-header h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

@media (min-width: 768px) {
  .reports-header {
    flex-direction: row;
    justify-content: space-between;
    align-items: flex-start;
  }

  .filters {
    flex: 1;
    max-width: 800px;
    margin-left: var(--spacing-xl);
    margin-bottom: 0;
  }
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.search-input {
  flex: 1;
  min-width: 250px;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.filter-select {
  min-width: 140px;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
}

.filter-select:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
}

.filters select {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.dashboard-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  overflow: hidden;
}

.dashboard-info {
  padding: var(--spacing-xl);
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}

.info-card h3 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text-primary);
}

.info-card p {
  margin: var(--spacing-xs) 0;
  color: var(--color-text-secondary);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.status-draft {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.status-completed {
  background: var(--color-success-light);
  color: var(--color-success);
}

.status-scheduled {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.dashboard-content {
  padding: var(--spacing-xl);
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.metric-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.metric-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.metric-header h4 {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.metric-header .icon {
  color: var(--color-primary);
}

.metric-value {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.metric-change {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
}

.metric-change.positive {
  color: var(--color-success);
}

.metric-change.negative {
  color: var(--color-danger);
}

.charts-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: var(--spacing-lg);
}

.chart-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.chart-container.large {
  grid-column: 1 / -1;
}

.chart-container h4 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text-primary);
}

.chart-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--color-text-secondary);
  background: var(--color-background);
  border-radius: var(--border-radius-md);
}

.chart-icon {
  width: 48px;
  height: 48px;
  margin-bottom: var(--spacing-md);
  opacity: 0.5;
}

.dashboard-actions {
  padding: var(--spacing-xl);
  background: var(--color-background);
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: var(--spacing-md);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-4xl);
  color: var(--color-text-secondary);
}

.empty-icon {
  width: 64px;
  height: 64px;
  margin-bottom: var(--spacing-lg);
  opacity: 0.5;
}

.empty-state h3 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text-primary);
}

.meetings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
}

.meetings-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.meeting-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.meeting-info h3 {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text-primary);
}

.meeting-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin: var(--spacing-xs) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.meeting-actions {
  display: flex;
  gap: var(--spacing-sm);
}

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

.modal-content {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg) var(--spacing-xl);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
  color: var(--color-text-primary);
}

.close-btn {
  background: none;
  border: none;
  color: var(--color-text-secondary);
  cursor: pointer;
  padding: var(--spacing-sm);
}

.modal-body {
  padding: var(--spacing-xl);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.todo-list {
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
}

.todo-item {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  align-items: center;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  padding: var(--spacing-lg) var(--spacing-xl);
  border-top: 1px solid var(--color-border);
}

.btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-md) var(--spacing-lg);
  border: 1px solid transparent;
  border-radius: var(--border-radius-md);
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  transition: all var(--duration-fast);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  background: var(--color-primary-dark);
}

.btn-secondary {
  background: var(--color-surface);
  border-color: var(--color-border);
  color: var(--color-text-primary);
}

.btn-secondary:hover {
  background: var(--color-background);
}

.btn-outline {
  background: transparent;
  border-color: var(--color-border);
  color: var(--color-text-secondary);
}

.btn-outline:hover {
  background: var(--color-background);
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.btn-danger {
  background: var(--color-danger);
  color: white;
}

.btn-sm {
  padding: var(--spacing-sm) var(--spacing-md);
  font-size: var(--font-size-sm);
}

.icon {
  width: 16px;
  height: 16px;
}

/* 报告列表样式 */
.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: var(--spacing-xl);
  margin-top: var(--spacing-lg);
}

.report-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
  transition: all var(--duration-fast);
  cursor: pointer;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.report-card:hover {
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
  border-color: var(--color-primary);
}

.report-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-lg);
  padding-bottom: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
}

.header-left {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.report-header h3 {
  margin: 0;
  color: var(--color-primary);
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
}

.report-period {
  margin: 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-normal);
}

.report-info {
  margin-bottom: var(--spacing-lg);
}

.report-info p {
  margin: var(--spacing-sm) 0;
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.report-info strong {
  color: var(--color-text-primary);
  font-weight: var(--font-weight-medium);
}

.report-metrics {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--color-background);
  border-radius: var(--border-radius-md);
}

.metric-item {
  text-align: center;
}

.metric-label {
  display: block;
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  margin-bottom: var(--spacing-xs);
}

.metric-value {
  display: block;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.report-actions {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.action-stats {
  display: flex;
  gap: var(--spacing-lg);
  padding: var(--spacing-sm) 0;
  border-top: 1px solid var(--color-border);
  margin-top: var(--spacing-sm);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.stat-item .icon {
  width: 14px;
  height: 14px;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
}

.search-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary-light);
}

.status-filter {
  padding: var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  min-width: 120px;
}

/* 数据看板视图样式 */
.dashboard-view {
  animation: slideIn 0.3s ease-out;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-xl);
  padding: var(--spacing-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
}

.dashboard-header h2 {
  margin: 0;
  color: var(--color-text-primary);
  font-size: var(--font-size-2xl);
}

.header-actions {
  display: flex;
  gap: var(--spacing-md);
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 会议记录模态框样式 */
.meetings-records-list {
  max-height: 400px;
  overflow-y: auto;
}

.meeting-record-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.meeting-record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid var(--color-border);
}

.meeting-record-header h4 {
  margin: 0;
  color: var(--color-text-primary);
}

.meeting-date {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
}

.meeting-record-content > div {
  margin-bottom: var(--spacing-md);
}

.meeting-record-content strong {
  color: var(--color-text-primary);
}

.meeting-record-content p {
  margin: var(--spacing-xs) 0 0 0;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

/* 待办事项模态框样式 */
.todo-items-list {
  max-height: 400px;
  overflow-y: auto;
}

.todo-item-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: var(--spacing-lg);
  margin-bottom: var(--spacing-md);
}

.todo-item-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.todo-checkbox {
  position: relative;
}

.todo-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  margin: 0;
}

.todo-item-header h4 {
  flex: 1;
  margin: 0;
  color: var(--color-text-primary);
}

.todo-item-header h4.completed {
  text-decoration: line-through;
  color: var(--color-text-secondary);
}

.todo-priority {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.priority-high {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.priority-medium {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.priority-low {
  background: var(--color-success-light);
  color: var(--color-success);
}

.todo-item-content p {
  margin: 0 0 var(--spacing-md) 0;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

.todo-meta {
  display: flex;
  gap: var(--spacing-lg);
}

.todo-assignee,
.todo-deadline {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.todo-assignee .icon,
.todo-deadline .icon {
  width: 14px;
  height: 14px;
}
</style>
