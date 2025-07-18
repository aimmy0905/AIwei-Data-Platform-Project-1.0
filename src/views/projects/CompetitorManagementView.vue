<template>
  <div class="competitor-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">竞品管理</h1>
          <p class="page-description">监控和分析竞争对手的市场表现和策略</p>
        </div>
        <div class="header-right">
          <button class="btn btn-primary">
            <Plus :size="16" />
            添加竞品
          </button>
        </div>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>行业分类：</label>
          <select v-model="filters.industry" class="form-select">
            <option value="">全部行业</option>
            <option value="fashion">时尚服装</option>
            <option value="tech">数码科技</option>
            <option value="beauty">美容护肤</option>
            <option value="sports">体育用品</option>
            <option value="home">家居装饰</option>
          </select>
        </div>
        <div class="filter-item">
          <label>竞争程度：</label>
          <select v-model="filters.level" class="form-select">
            <option value="">全部程度</option>
            <option value="high">高</option>
            <option value="medium">中</option>
            <option value="low">低</option>
          </select>
        </div>
        <div class="filter-item">
          <label>搜索：</label>
          <input
            v-model="filters.search"
            type="text"
            class="form-input"
            placeholder="搜索竞品名称..."
          />
        </div>
      </div>
    </div>

    <!-- 竞品列表 -->
    <div class="content-section">
      <div class="competitor-grid">
        <div v-for="competitor in mockCompetitors" :key="competitor.id" class="competitor-card">
          <div class="card-header">
            <div class="competitor-info">
              <h3 class="competitor-name">{{ competitor.name }}</h3>
              <span class="industry-tag">{{ competitor.industry }}</span>
            </div>
            <span class="level-badge" :class="competitor.level">
              {{ getLevelText(competitor.level) }}
            </span>
          </div>

          <div class="card-content">
            <div class="competitor-details">
              <div class="detail-item">
                <Globe :size="16" />
                <span>{{ competitor.website }}</span>
              </div>
              <div class="detail-item">
                <MapPin :size="16" />
                <span>{{ competitor.region }}</span>
              </div>
              <div class="detail-item">
                <TrendingUp :size="16" />
                <span>市场份额: {{ competitor.marketShare }}%</span>
              </div>
            </div>

            <div class="metrics-section">
              <h4>关键指标</h4>
              <div class="metrics-grid">
                <div class="metric-item">
                  <span class="metric-label">月访问量</span>
                  <span class="metric-value">{{ competitor.monthlyVisits }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">广告支出</span>
                  <span class="metric-value">¥{{ competitor.adSpend.toLocaleString() }}</span>
                </div>
                <div class="metric-item">
                  <span class="metric-label">社交粉丝</span>
                  <span class="metric-value">{{ competitor.socialFollowers }}</span>
                </div>
              </div>
            </div>

            <div class="platforms-section">
              <h4>投放平台</h4>
              <div class="platform-tags">
                <span class="platform-tag" v-for="platform in competitor.platforms" :key="platform">
                  {{ platform }}
                </span>
              </div>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn btn-outline">
              <BarChart3 :size="16" />
              查看分析
            </button>
            <button class="btn btn-outline">
              <Settings :size="16" />
              编辑
            </button>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-if="mockCompetitors.length === 0" class="empty-state">
        <Search :size="64" class="empty-icon" />
        <h3>暂无竞品</h3>
        <p>还没有添加任何竞品信息，点击上方按钮开始添加</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus, Globe, MapPin, TrendingUp, BarChart3, Settings, Search } from 'lucide-vue-next'

// 筛选器状态
const filters = ref({
  industry: '',
  level: '',
  search: ''
})

// 模拟竞品数据
const mockCompetitors = ref([
  {
    id: 1,
    name: 'Fashion Rival',
    industry: '时尚服装',
    website: 'https://fashionrival.com',
    region: '北美',
    level: 'high',
    marketShare: 15.8,
    monthlyVisits: '2.5M',
    adSpend: 180000,
    socialFollowers: '1.2M',
    platforms: ['Google', 'Meta', 'TikTok']
  },
  {
    id: 2,
    name: 'Tech Leader Pro',
    industry: '数码科技',
    website: 'https://techleader.com',
    region: '欧洲',
    level: 'medium',
    marketShare: 12.3,
    monthlyVisits: '1.8M',
    adSpend: 150000,
    socialFollowers: '890K',
    platforms: ['Google', 'Meta', 'LinkedIn']
  },
  {
    id: 3,
    name: 'Beauty Expert',
    industry: '美容护肤',
    website: 'https://beautyexpert.com',
    region: '亚太',
    level: 'high',
    marketShare: 22.1,
    monthlyVisits: '3.2M',
    adSpend: 250000,
    socialFollowers: '2.1M',
    platforms: ['Meta', 'Instagram', 'YouTube']
  },
  {
    id: 4,
    name: 'Sports Champion',
    industry: '体育用品',
    website: 'https://sportschamp.com',
    region: '全球',
    level: 'low',
    marketShare: 8.7,
    monthlyVisits: '980K',
    adSpend: 95000,
    socialFollowers: '560K',
    platforms: ['Google', 'YouTube']
  }
])

// 获取竞争程度文本
const getLevelText = (level: string): string => {
  const levelMap: Record<string, string> = {
    high: '高',
    medium: '中',
    low: '低'
  }
  return levelMap[level] || level
}
</script>

<style scoped>
.competitor-management {
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

.competitor-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
  gap: 24px;
}

.competitor-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 24px;
  background: #fafafa;
  transition: all 0.2s;
}

.competitor-card:hover {
  border-color: #1976d2;
  box-shadow: 0 6px 20px rgba(25, 118, 210, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
}

.competitor-info h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.industry-tag {
  background: #f0f0f0;
  color: #666;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.level-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.level-badge.high {
  background: #ffebee;
  color: #c62828;
}

.level-badge.medium {
  background: #fff3e0;
  color: #ef6c00;
}

.level-badge.low {
  background: #e8f5e8;
  color: #2e7d32;
}

.competitor-details {
  margin-bottom: 20px;
}

.detail-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
  color: #666;
  font-size: 14px;
}

.metrics-section,
.platforms-section {
  margin-bottom: 20px;
}

.metrics-section h4,
.platforms-section h4 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 12px 0;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.metric-item {
  text-align: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.metric-label {
  display: block;
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
}

.metric-value {
  display: block;
  font-size: 16px;
  font-weight: 600;
  color: #1976d2;
}

.platform-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.platform-tag {
  background: #e3f2fd;
  color: #1976d2;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.card-actions {
  display: flex;
  gap: 12px;
}

.btn {
  padding: 10px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  justify-content: center;
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
