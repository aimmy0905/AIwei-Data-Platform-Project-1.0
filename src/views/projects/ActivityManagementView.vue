<template>
  <div class="activity-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">活动管理</h1>
          <p class="page-description">管理项目相关的营销活动和推广活动</p>
        </div>
        <div class="header-right">
          <button class="btn btn-primary">
            <Plus :size="16" />
            新建活动
          </button>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>活动状态：</label>
          <select v-model="filters.status" class="form-select">
            <option value="">全部状态</option>
            <option value="planning">策划中</option>
            <option value="active">进行中</option>
            <option value="completed">已完成</option>
            <option value="paused">已暂停</option>
          </select>
        </div>
        <div class="filter-item">
          <label>活动类型：</label>
          <select v-model="filters.type" class="form-select">
            <option value="">全部类型</option>
            <option value="promotion">促销活动</option>
            <option value="brand">品牌推广</option>
            <option value="product">产品发布</option>
            <option value="seasonal">季节性活动</option>
          </select>
        </div>
        <div class="filter-item">
          <label>搜索：</label>
          <input
            v-model="filters.search"
            type="text"
            class="form-input"
            placeholder="搜索活动名称..."
          />
        </div>
      </div>
    </div>

    <!-- 活动列表 -->
    <div class="content-section">
      <div class="activity-grid">
        <div v-for="activity in mockActivities" :key="activity.id" class="activity-card">
          <div class="card-header">
            <h3 class="activity-name">{{ activity.name }}</h3>
            <span class="status-badge" :class="activity.status">
              {{ getStatusText(activity.status) }}
            </span>
          </div>
          <div class="card-content">
            <div class="activity-info">
              <div class="info-item">
                <Calendar :size="16" />
                <span>{{ activity.startDate }} - {{ activity.endDate }}</span>
              </div>
              <div class="info-item">
                <DollarSign :size="16" />
                <span>预算: ¥{{ activity.budget.toLocaleString() }}</span>
              </div>
              <div class="info-item">
                <Target :size="16" />
                <span>目标: {{ activity.target }}</span>
              </div>
            </div>
            <div class="activity-platforms">
              <span class="platform-tag" v-for="platform in activity.platforms" :key="platform">
                {{ platform }}
              </span>
            </div>
          </div>
          <div class="card-actions">
            <button class="btn btn-outline">查看详情</button>
            <button class="btn btn-outline">编辑</button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="mockActivities.length === 0" class="empty-state">
        <Calendar :size="64" class="empty-icon" />
        <h3>暂无活动</h3>
        <p>还没有创建任何活动，点击上方按钮开始创建</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Calendar, DollarSign, Target } from 'lucide-vue-next'

// 筛选器状态
const filters = ref({
  status: '',
  type: '',
  search: ''
})

// 模拟活动数据
const mockActivities = ref([
  {
    id: 1,
    name: '春季新品发布活动',
    status: 'active',
    startDate: '2024-03-01',
    endDate: '2024-03-31',
    budget: 50000,
    target: '提升品牌知名度',
    platforms: ['Google', 'Meta', 'Bing'],
    type: 'product'
  },
  {
    id: 2,
    name: '618购物节促销',
    status: 'planning',
    startDate: '2024-06-01',
    endDate: '2024-06-18',
    budget: 100000,
    target: '销售额增长50%',
    platforms: ['Google', 'Meta'],
    type: 'promotion'
  },
  {
    id: 3,
    name: '夏季品牌推广',
    status: 'completed',
    startDate: '2024-07-01',
    endDate: '2024-08-31',
    budget: 75000,
    target: '扩大市场份额',
    platforms: ['Meta', 'Criteo'],
    type: 'brand'
  }
])

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    planning: '策划中',
    active: '进行中',
    completed: '已完成',
    paused: '已暂停'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.activity-management {
  padding: 24px;
  background: #f8f9fa;
  min-height: 100vh;
}

.page-header {
  background: white;
  border-radius: 8px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.page-description {
  color: #666;
  margin: 0;
}

.filter-section {
  background: white;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: center;
}

.filter-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-item label {
  font-weight: 500;
  color: #333;
  white-space: nowrap;
}

.form-select,
.form-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.content-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.activity-card {
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
  transition: all 0.2s;
}

.activity-card:hover {
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.activity-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.planning {
  background: #fff3cd;
  color: #856404;
}

.status-badge.active {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.completed {
  background: #d4edda;
  color: #155724;
}

.status-badge.paused {
  background: #f8d7da;
  color: #721c24;
}

.activity-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.activity-platforms {
  margin-bottom: 16px;
}

.platform-tag {
  display: inline-block;
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 8px;
  margin-bottom: 4px;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:hover {
  background: #1565c0;
}

.btn-outline {
  background: transparent;
  color: #1976d2;
  border: 1px solid #1976d2;
}

.btn-outline:hover {
  background: #1976d2;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-icon {
  color: #ccc;
  margin-bottom: 16px;
}

.empty-state h3 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.empty-state p {
  margin: 0;
  font-size: 14px;
}
</style>
