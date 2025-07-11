<template>
  <div class="kol-data-view">
    <div class="page-header">
      <h1>红人数据</h1>
      <p>KOL数据分析和帖子表现监控</p>
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
          <label>红人类型</label>
          <select v-model="filters.influencerType">
            <option value="all">全部</option>
            <option value="mega">头部红人</option>
            <option value="macro">中部红人</option>
            <option value="micro">尾部红人</option>
          </select>
        </div>

        <div class="filter-group">
          <label>平台</label>
          <select v-model="filters.platform">
            <option value="all">全部平台</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
          </select>
        </div>
      </div>
    </div>

    <!-- 数据概览卡片 -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">👥</div>
        <div class="stat-content">
          <h3>{{ stats.totalInfluencers }}</h3>
          <p>合作红人总数</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📱</div>
        <div class="stat-content">
          <h3>{{ stats.totalPosts }}</h3>
          <p>发布帖子总数</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">👁️</div>
        <div class="stat-content">
          <h3>{{ formatNumber(stats.totalViews) }}</h3>
          <p>总曝光量</p>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">💝</div>
        <div class="stat-content">
          <h3>{{ formatNumber(stats.totalEngagement) }}</h3>
          <p>总互动量</p>
        </div>
      </div>
    </div>

    <!-- 红人表现排行榜 -->
    <div class="content-section">
      <h2>红人表现排行榜</h2>
      <div class="table-container">
        <table class="data-table">
          <thead>
            <tr>
              <th>排名</th>
              <th>红人信息</th>
              <th>平台</th>
              <th>粉丝数</th>
              <th>帖子数</th>
              <th>曝光量</th>
              <th>互动率</th>
              <th>ROI</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(influencer, index) in influencers" :key="influencer.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="influencer-info">
                  <img :src="influencer.avatar" :alt="influencer.name" class="avatar">
                  <div>
                    <div class="name">{{ influencer.name }}</div>
                    <div class="username">@{{ influencer.username }}</div>
                  </div>
                </div>
              </td>
              <td>
                <span class="platform-badge" :class="influencer.platform">
                  {{ influencer.platform }}
                </span>
              </td>
              <td>{{ formatNumber(influencer.followers) }}</td>
              <td>{{ influencer.posts }}</td>
              <td>{{ formatNumber(influencer.views) }}</td>
              <td>{{ influencer.engagementRate }}%</td>
              <td>{{ influencer.roi }}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 帖子表现分析 -->
    <div class="content-section">
      <h2>帖子表现分析</h2>
      <div class="posts-grid">
        <div v-for="post in topPosts" :key="post.id" class="post-card">
          <div class="post-image">
            <img :src="post.image" :alt="post.title">
          </div>
          <div class="post-content">
            <h4>{{ post.title }}</h4>
            <p class="post-author">by @{{ post.author }}</p>
            <div class="post-stats">
              <span class="stat">
                <i class="icon-eye"></i>
                {{ formatNumber(post.views) }}
              </span>
              <span class="stat">
                <i class="icon-heart"></i>
                {{ formatNumber(post.likes) }}
              </span>
              <span class="stat">
                <i class="icon-comment"></i>
                {{ formatNumber(post.comments) }}
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
interface Influencer {
  id: number
  name: string
  username: string
  avatar: string
  platform: string
  followers: number
  posts: number
  views: number
  engagementRate: number
  roi: number
}

interface Post {
  id: number
  title: string
  author: string
  image: string
  views: number
  likes: number
  comments: number
}

// 筛选条件
const filters = reactive({
  timeRange: '30d',
  influencerType: 'all',
  platform: 'all'
})

// 统计数据
const stats = reactive({
  totalInfluencers: 0,
  totalPosts: 0,
  totalViews: 0,
  totalEngagement: 0
})

// 红人数据
const influencers = ref<Influencer[]>([])

// 热门帖子
const topPosts = ref<Post[]>([])

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
  stats.totalInfluencers = 48
  stats.totalPosts = 156
  stats.totalViews = 2850000
  stats.totalEngagement = 185000

  // 模拟红人数据
  influencers.value = [
    {
      id: 1,
      name: 'Emma Johnson',
      username: 'emmaj_style',
      avatar: '/api/placeholder/40/40',
      platform: 'instagram',
      followers: 850000,
      posts: 12,
      views: 1200000,
      engagementRate: 4.2,
      roi: 285
    },
    {
      id: 2,
      name: 'Alex Chen',
      username: 'alexc_tech',
      avatar: '/api/placeholder/40/40',
      platform: 'tiktok',
      followers: 620000,
      posts: 8,
      views: 980000,
      engagementRate: 5.8,
      roi: 320
    },
    {
      id: 3,
      name: 'Sarah Wilson',
      username: 'sarah_lifestyle',
      avatar: '/api/placeholder/40/40',
      platform: 'youtube',
      followers: 450000,
      posts: 6,
      views: 670000,
      engagementRate: 3.9,
      roi: 195
    }
  ]

  // 模拟热门帖子数据
  topPosts.value = [
    {
      id: 1,
      title: '夏日穿搭指南',
      author: 'emmaj_style',
      image: '/api/placeholder/200/200',
      views: 450000,
      likes: 28000,
      comments: 1200
    },
    {
      id: 2,
      title: '科技产品开箱',
      author: 'alexc_tech',
      image: '/api/placeholder/200/200',
      views: 380000,
      likes: 35000,
      comments: 2100
    },
    {
      id: 3,
      title: '居家生活分享',
      author: 'sarah_lifestyle',
      image: '/api/placeholder/200/200',
      views: 320000,
      likes: 18000,
      comments: 850
    }
  ]
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.kol-data-view {
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

.influencer-info {
  display: flex;
  align-items: center;
  gap: 10px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-weight: 500;
  color: #333;
}

.username {
  font-size: 12px;
  color: #666;
}

.platform-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  text-transform: uppercase;
}

.platform-badge.instagram {
  background: #e1306c;
  color: white;
}

.platform-badge.tiktok {
  background: #000;
  color: white;
}

.platform-badge.youtube {
  background: #ff0000;
  color: white;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.post-card {
  border: 1px solid #eee;
  border-radius: 8px;
  overflow: hidden;
}

.post-image {
  height: 200px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 15px;
}

.post-content h4 {
  margin: 0 0 5px 0;
  font-size: 16px;
  color: #333;
}

.post-author {
  margin: 0 0 10px 0;
  font-size: 14px;
  color: #666;
}

.post-stats {
  display: flex;
  gap: 15px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

@media (max-width: 768px) {
  .filter-row {
    flex-direction: column;
    align-items: stretch;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
