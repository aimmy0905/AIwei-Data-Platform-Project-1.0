<template>
  <div class="kol-post-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">红人/帖子管理</h1>
          <p class="page-description">管理合作红人和相关帖子内容的发布与监控</p>
        </div>
        <div class="header-right">
          <button class="btn btn-primary">
            <Plus :size="16" />
            添加红人
          </button>
          <button class="btn btn-secondary">
            <FileText :size="16" />
            新建帖子
          </button>
        </div>
      </div>
    </div>

    <!-- 标签页切换 -->
    <div class="tabs-section">
      <div class="tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'kols' }"
          @click="activeTab = 'kols'"
        >
          <Users :size="16" />
          红人管理
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'posts' }"
          @click="activeTab = 'posts'"
        >
          <FileText :size="16" />
          帖子管理
        </button>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item" v-if="activeTab === 'kols'">
          <label>红人类型：</label>
          <select v-model="filters.kolType" class="form-select">
            <option value="">全部类型</option>
            <option value="mega">头部红人</option>
            <option value="macro">腰部红人</option>
            <option value="micro">尾部红人</option>
            <option value="nano">素人</option>
          </select>
        </div>
        <div class="filter-item" v-if="activeTab === 'posts'">
          <label>帖子状态：</label>
          <select v-model="filters.postStatus" class="form-select">
            <option value="">全部状态</option>
            <option value="draft">草稿</option>
            <option value="published">已发布</option>
            <option value="scheduled">定时发布</option>
            <option value="archived">已归档</option>
          </select>
        </div>
        <div class="filter-item">
          <label>平台：</label>
          <select v-model="filters.platform" class="form-select">
            <option value="">全部平台</option>
            <option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option>
            <option value="youtube">YouTube</option>
            <option value="xiaohongshu">小红书</option>
            <option value="weibo">微博</option>
          </select>
        </div>
        <div class="filter-item">
          <label>搜索：</label>
          <input
            v-model="filters.search"
            type="text"
            class="form-input"
            :placeholder="activeTab === 'kols' ? '搜索红人名称...' : '搜索帖子内容...'"
          />
        </div>
      </div>
    </div>

    <!-- 红人管理内容 -->
    <div v-if="activeTab === 'kols'" class="content-section">
      <div class="kol-grid">
        <div v-for="kol in mockKols" :key="kol.id" class="kol-card">
          <div class="card-header">
            <div class="kol-avatar">
              <img :src="kol.avatar" :alt="kol.name" />
            </div>
            <div class="kol-info">
              <h3 class="kol-name">{{ kol.name }}</h3>
              <span class="kol-type">{{ getKolTypeText(kol.type) }}</span>
            </div>
            <span class="status-badge" :class="kol.status">
              {{ getStatusText(kol.status) }}
            </span>
          </div>

          <div class="card-content">
            <div class="kol-stats">
              <div class="stat-item">
                <Heart :size="16" />
                <span>{{ kol.followers }} 粉丝</span>
              </div>
              <div class="stat-item">
                <TrendingUp :size="16" />
                <span>{{ kol.engagementRate }}% 互动率</span>
              </div>
              <div class="stat-item">
                <DollarSign :size="16" />
                <span>¥{{ kol.price.toLocaleString() }}/帖</span>
              </div>
            </div>

            <div class="kol-platforms">
              <span class="platform-tag" v-for="platform in kol.platforms" :key="platform">
                {{ platform }}
              </span>
            </div>

            <div class="kol-categories">
              <span class="category-tag" v-for="category in kol.categories" :key="category">
                {{ category }}
              </span>
            </div>
          </div>

          <div class="card-actions">
            <button class="btn btn-outline">
              <MessageCircle :size="16" />
              联系
            </button>
            <button class="btn btn-outline">
              <BarChart3 :size="16" />
              数据
            </button>
            <button class="btn btn-outline">
              <Settings :size="16" />
              编辑
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 帖子管理内容 -->
    <div v-if="activeTab === 'posts'" class="content-section">
      <div class="post-list">
        <div v-for="post in mockPosts" :key="post.id" class="post-card">
          <div class="post-thumbnail">
            <img :src="post.thumbnail" :alt="post.title" />
            <span class="post-type">{{ getPostTypeText(post.type) }}</span>
          </div>

          <div class="post-content">
            <div class="post-header">
              <h3 class="post-title">{{ post.title }}</h3>
              <span class="status-badge" :class="post.status">
                {{ getPostStatusText(post.status) }}
              </span>
            </div>

            <div class="post-meta">
              <div class="meta-item">
                <User :size="16" />
                <span>{{ post.kolName }}</span>
              </div>
              <div class="meta-item">
                <Calendar :size="16" />
                <span>{{ post.publishDate }}</span>
              </div>
              <div class="meta-item">
                <Globe :size="16" />
                <span>{{ post.platform }}</span>
              </div>
            </div>

            <div class="post-stats">
              <div class="stat-item">
                <Eye :size="16" />
                <span>{{ post.views }} 浏览</span>
              </div>
              <div class="stat-item">
                <Heart :size="16" />
                <span>{{ post.likes }} 点赞</span>
              </div>
              <div class="stat-item">
                <MessageCircle :size="16" />
                <span>{{ post.comments }} 评论</span>
              </div>
              <div class="stat-item">
                <Share :size="16" />
                <span>{{ post.shares }} 分享</span>
              </div>
            </div>
          </div>

          <div class="post-actions">
            <button class="btn btn-outline">查看详情</button>
            <button class="btn btn-outline">编辑</button>
            <button class="btn btn-outline">数据分析</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="(activeTab === 'kols' && mockKols.length === 0) || (activeTab === 'posts' && mockPosts.length === 0)" class="empty-state">
      <component :is="activeTab === 'kols' ? Users : FileText" :size="64" class="empty-icon" />
      <h3>{{ activeTab === 'kols' ? '暂无红人' : '暂无帖子' }}</h3>
      <p>{{ activeTab === 'kols' ? '还没有添加任何红人，点击上方按钮开始添加' : '还没有创建任何帖子，点击上方按钮开始创建' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  Plus, FileText, Users, Heart, TrendingUp, DollarSign, MessageCircle,
  BarChart3, Settings, User, Calendar, Globe, Eye, Share
} from 'lucide-vue-next'

// 活跃标签页
const activeTab = ref('kols')

// 筛选器状态
const filters = ref({
  kolType: '',
  postStatus: '',
  platform: '',
  search: ''
})

// 模拟红人数据
const mockKols = ref([
  {
    id: 1,
    name: '美妆达人小雨',
    type: 'macro',
    status: 'active',
    avatar: '/avatars/kol1.jpg',
    followers: '85.6K',
    engagementRate: 4.2,
    price: 5000,
    platforms: ['Instagram', '小红书'],
    categories: ['美妆', '护肤', '时尚']
  },
  {
    id: 2,
    name: '科技博主Alex',
    type: 'mega',
    status: 'active',
    avatar: '/avatars/kol2.jpg',
    followers: '2.3M',
    engagementRate: 3.8,
    price: 25000,
    platforms: ['YouTube', 'TikTok'],
    categories: ['科技', '数码', '评测']
  },
  {
    id: 3,
    name: '健身教练Lisa',
    type: 'micro',
    status: 'pending',
    avatar: '/avatars/kol3.jpg',
    followers: '45.2K',
    engagementRate: 5.1,
    price: 3000,
    platforms: ['Instagram', 'TikTok'],
    categories: ['健身', '运动', '生活']
  }
])

// 模拟帖子数据
const mockPosts = ref([
  {
    id: 1,
    title: '春季护肤新品测评',
    type: 'image',
    status: 'published',
    thumbnail: '/posts/post1.jpg',
    kolName: '美妆达人小雨',
    publishDate: '2024-03-15',
    platform: 'Instagram',
    views: '12.5K',
    likes: '1.2K',
    comments: 89,
    shares: 156
  },
  {
    id: 2,
    title: '最新手机深度评测',
    type: 'video',
    status: 'published',
    thumbnail: '/posts/post2.jpg',
    kolName: '科技博主Alex',
    publishDate: '2024-03-20',
    platform: 'YouTube',
    views: '85.6K',
    likes: '3.2K',
    comments: 245,
    shares: 89
  },
  {
    id: 3,
    title: '居家健身指南',
    type: 'video',
    status: 'scheduled',
    thumbnail: '/posts/post3.jpg',
    kolName: '健身教练Lisa',
    publishDate: '2024-03-25',
    platform: 'TikTok',
    views: '0',
    likes: '0',
    comments: 0,
    shares: 0
  }
])

// 获取红人类型文本
const getKolTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    mega: '头部红人',
    macro: '腰部红人',
    micro: '尾部红人',
    nano: '素人'
  }
  return typeMap[type] || type
}

// 获取状态文本
const getStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    active: '合作中',
    pending: '洽谈中',
    inactive: '已结束'
  }
  return statusMap[status] || status
}

// 获取帖子类型文本
const getPostTypeText = (type: string): string => {
  const typeMap: Record<string, string> = {
    image: '图文',
    video: '视频',
    story: '动态'
  }
  return typeMap[type] || type
}

// 获取帖子状态文本
const getPostStatusText = (status: string): string => {
  const statusMap: Record<string, string> = {
    draft: '草稿',
    published: '已发布',
    scheduled: '定时发布',
    archived: '已归档'
  }
  return statusMap[status] || status
}
</script>

<style scoped>
.kol-post-management {
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

.header-right {
  display: flex;
  gap: 12px;
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

.tabs-section {
  background: white;
  border-radius: 8px;
  padding: 4px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.tabs {
  display: flex;
  gap: 4px;
}

.tab-button {
  flex: 1;
  padding: 12px 20px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  color: #666;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.tab-button.active {
  background: #1976d2;
  color: white;
}

.tab-button:hover:not(.active) {
  background: #f5f5f5;
  color: #333;
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

/* 红人卡片样式 */
.kol-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
}

.kol-card {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  padding: 20px;
  background: #fafafa;
  transition: all 0.2s;
}

.kol-card:hover {
  border-color: #1976d2;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.1);
}

.kol-card .card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.kol-avatar img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.kol-info {
  flex: 1;
}

.kol-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 4px 0;
}

.kol-type {
  font-size: 12px;
  color: #666;
}

.kol-stats {
  margin-bottom: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  color: #666;
  font-size: 14px;
}

.kol-platforms,
.kol-categories {
  margin-bottom: 16px;
}

.platform-tag,
.category-tag {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  margin-right: 6px;
  margin-bottom: 4px;
}

.platform-tag {
  background: #e3f2fd;
  color: #1976d2;
}

.category-tag {
  background: #f3e5f5;
  color: #7b1fa2;
}

/* 帖子列表样式 */
.post-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background: #fafafa;
  transition: all 0.2s;
}

.post-card:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.post-thumbnail {
  position: relative;
  width: 120px;
  height: 80px;
  border-radius: 6px;
  overflow: hidden;
  flex-shrink: 0;
}

.post-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-type {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 10px;
}

.post-content {
  flex: 1;
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.post-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.post-meta {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #666;
  font-size: 14px;
}

.post-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.post-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 120px;
  flex-shrink: 0;
}

.status-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background: #d4edda;
  color: #155724;
}

.status-badge.pending {
  background: #fff3cd;
  color: #856404;
}

.status-badge.inactive {
  background: #f8d7da;
  color: #721c24;
}

.status-badge.published {
  background: #d1ecf1;
  color: #0c5460;
}

.status-badge.scheduled {
  background: #d4edda;
  color: #155724;
}

.status-badge.draft {
  background: #e2e3e5;
  color: #383d41;
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
  justify-content: center;
  gap: 8px;
}

.btn-primary {
  background: #1976d2;
  color: white;
}

.btn-primary:hover {
  background: #1565c0;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
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
