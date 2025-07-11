<template>
  <div class="market-data-view">
    <div class="page-header">
      <h1>地区市场数据</h1>
      <p>全球市场数据分析和地区对比</p>
    </div>

    <!-- 筛选区域 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-group">
          <label>时间范围</label>
          <select v-model="filters.timeRange">
            <option value="7d">最近7天</option>
            <option value="30d">最近30天</option>
            <option value="90d">最近90天</option>
          </select>
        </div>

        <div class="filter-group">
          <label>地区</label>
          <select v-model="filters.region">
            <option value="all">全部地区</option>
            <option value="north-america">北美</option>
            <option value="europe">欧洲</option>
            <option value="asia">亚洲</option>
            <option value="oceania">大洋洲</option>
          </select>
        </div>

        <div class="filter-group">
          <label>指标类型</label>
          <select v-model="filters.metricType">
            <option value="revenue">收入</option>
            <option value="orders">订单量</option>
            <option value="users">用户数</option>
            <option value="conversion">转化率</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">🌍</div>
        <div class="stat-content">
          <h3>{{ stats.totalCountries }}</h3>
          <p>覆盖国家数</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <h3>${{ formatNumber(stats.totalRevenue) }}</h3>
          <p>总收入</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <h3>{{ formatNumber(stats.totalOrders) }}</h3>
          <p>总订单数</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ formatNumber(stats.totalUsers) }}</h3>
          <p>总用户数</p>
        </div>
      </div>
    </div>

    <!-- 地区表现排行榜 -->
    <div class="content-section">
      <h2>地区表现排行榜</h2>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>国家/地区</th>
              <th>收入</th>
              <th>订单数</th>
              <th>用户数</th>
              <th>转化率</th>
              <th>平均订单价值</th>
              <th>增长率</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(country, index) in countries" :key="country.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="country-info">
                  <span class="flag">{{ country.flag }}</span>
                  <span class="name">{{ country.name }}</span>
                </div>
              </td>
              <td>${{ formatNumber(country.revenue) }}</td>
              <td>{{ formatNumber(country.orders) }}</td>
              <td>{{ formatNumber(country.users) }}</td>
              <td>{{ country.conversionRate }}%</td>
              <td>${{ country.avgOrderValue }}</td>
              <td>
                <span class="growth" :class="{ positive: country.growth > 0, negative: country.growth < 0 }">
                  {{ country.growth > 0 ? '+' : '' }}{{ country.growth }}%
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 地区分析图表 -->
    <div class="content-section">
      <h2>地区收入分布</h2>
      <div class="chart-container">
        <div class="chart-placeholder">
          📊 地区收入分布图表
          <p>显示各地区收入占比和趋势</p>
        </div>
      </div>
    </div>

    <!-- 市场机会分析 -->
    <div class="content-section">
      <h2>市场机会分析</h2>
      <div class="opportunity-grid">
        <div v-for="opportunity in opportunities" :key="opportunity.id" class="opportunity-card">
          <div class="opportunity-header">
            <span class="flag">{{ opportunity.flag }}</span>
            <h4>{{ opportunity.country }}</h4>
          </div>
          <div class="opportunity-content">
            <p class="opportunity-type">{{ opportunity.type }}</p>
            <p class="opportunity-desc">{{ opportunity.description }}</p>
            <div class="opportunity-metrics">
              <span class="metric">
                <strong>潜在收入:</strong> ${{ formatNumber(opportunity.potential) }}
              </span>
              <span class="metric">
                <strong>增长预期:</strong> {{ opportunity.growthExpected }}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'

// 类型定义
interface Country {
  id: number
  name: string
  flag: string
  revenue: number
  orders: number
  users: number
  conversionRate: number
  avgOrderValue: number
  growth: number
}

interface Opportunity {
  id: number
  country: string
  flag: string
  type: string
  description: string
  potential: number
  growthExpected: number
}

// 筛选条件
const filters = reactive({
  timeRange: '30d',
  region: 'all',
  metricType: 'revenue'
})

// 统计数据
const stats = reactive({
  totalCountries: 0,
  totalRevenue: 0,
  totalOrders: 0,
  totalUsers: 0
})

// 国家数据
const countries = ref<Country[]>([])

// 市场机会
const opportunities = ref<Opportunity[]>([])

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toString()
}

// 加载数据
const loadData = async () => {
  // 模拟数据加载
  stats.totalCountries = 25
  stats.totalRevenue = 2850000
  stats.totalOrders = 18500
  stats.totalUsers = 125000

  // 模拟国家数据
  countries.value = [
    {
      id: 1,
      name: '美国',
      flag: '🇺🇸',
      revenue: 1200000,
      orders: 8500,
      users: 45000,
      conversionRate: 3.2,
      avgOrderValue: 141.18,
      growth: 15.3
    },
    {
      id: 2,
      name: '加拿大',
      flag: '🇨🇦',
      revenue: 680000,
      orders: 4200,
      users: 28000,
      conversionRate: 2.8,
      avgOrderValue: 161.90,
      growth: 8.7
    },
    {
      id: 3,
      name: '英国',
      flag: '🇬🇧',
      revenue: 520000,
      orders: 3100,
      users: 22000,
      conversionRate: 2.5,
      avgOrderValue: 167.74,
      growth: 12.1
    },
    {
      id: 4,
      name: '德国',
      flag: '🇩🇪',
      revenue: 450000,
      orders: 2800,
      users: 18000,
      conversionRate: 2.9,
      avgOrderValue: 160.71,
      growth: -2.3
    }
  ]

  // 模拟市场机会数据
  opportunities.value = [
    {
      id: 1,
      country: '法国',
      flag: '🇫🇷',
      type: '新兴市场',
      description: '电商渗透率快速增长，消费者对海外品牌接受度高',
      potential: 350000,
      growthExpected: 25.5
    },
    {
      id: 2,
      country: '澳大利亚',
      flag: '🇦🇺',
      type: '高价值市场',
      description: '消费能力强，对产品质量要求高，复购率高',
      potential: 280000,
      growthExpected: 18.2
    },
    {
      id: 3,
      country: '日本',
      flag: '🇯🇵',
      type: '潜力市场',
      description: '移动端购物习惯成熟，品牌忠诚度高',
      potential: 420000,
      growthExpected: 32.1
    }
  ]
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.market-data-view {
  padding: 20px;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  margin: 0 0 8px 0;
  font-size: 28px;
  color: #333;
}

.page-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.filter-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.filter-row {
  display: flex;
  gap: 20px;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.filter-group label {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  display: flex;
  align-items: center;
  gap: 15px;
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f0f9ff;
  border-radius: 50%;
}

.stat-content h3 {
  margin: 0 0 5px 0;
  font-size: 24px;
  color: #333;
}

.stat-content p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.content-section {
  background: white;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.content-section h2 {
  margin: 0 0 20px 0;
  font-size: 20px;
  color: #333;
}

.table-container {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
}

.data-table th,
.data-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #eee;
}

.data-table th {
  background: #f8f9fa;
  font-weight: 600;
  color: #333;
}

.country-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.flag {
  font-size: 18px;
}

.name {
  font-weight: 500;
  color: #333;
}

.growth {
  font-weight: 500;
}

.growth.positive {
  color: #10b981;
}

.growth.negative {
  color: #ef4444;
}

.chart-container {
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
  border-radius: 8px;
  border: 2px dashed #ddd;
}

.chart-placeholder {
  text-align: center;
  color: #666;
  font-size: 24px;
}

.chart-placeholder p {
  margin: 10px 0 0 0;
  font-size: 14px;
}

.opportunity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.opportunity-card {
  border: 1px solid #eee;
  border-radius: 8px;
  padding: 20px;
  background: #fafafa;
}

.opportunity-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
}

.opportunity-header .flag {
  font-size: 20px;
}

.opportunity-header h4 {
  margin: 0;
  font-size: 18px;
  color: #333;
}

.opportunity-type {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 500;
  color: #2563eb;
}

.opportunity-desc {
  margin: 0 0 15px 0;
  color: #666;
  font-size: 14px;
  line-height: 1.5;
}

.opportunity-metrics {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.metric {
  font-size: 14px;
  color: #333;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .opportunity-grid {
    grid-template-columns: 1fr;
  }
}
</style>
