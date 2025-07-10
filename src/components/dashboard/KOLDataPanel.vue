<template>
  <div class="kol-data-panel">
    <div class="section-header">
      <h2 class="section-title">红人数据</h2>
      <p class="section-description">红人及帖子数据分析</p>
    </div>

    <div class="panel-content">
      <!-- 红人概览统计 -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <Users />
          </div>
          <div class="stat-content">
            <h3>活跃红人</h3>
            <div class="stat-value">{{ stats.activeInfluencers }}</div>
            <div class="stat-change positive">+{{ stats.influencerGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <FileText />
          </div>
          <div class="stat-content">
            <h3>本月帖子</h3>
            <div class="stat-value">{{ stats.monthlyPosts }}</div>
            <div class="stat-change positive">+{{ stats.postGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Eye />
          </div>
          <div class="stat-content">
            <h3>总曝光量</h3>
            <div class="stat-value">{{ formatNumber(stats.totalViews) }}</div>
            <div class="stat-change positive">+{{ stats.viewGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Heart />
          </div>
          <div class="stat-content">
            <h3>平均互动率</h3>
            <div class="stat-value">{{ stats.avgEngagementRate }}%</div>
            <div class="stat-change positive">+{{ stats.engagementGrowth }}%</div>
          </div>
        </div>
      </div>

      <!-- 红人排行榜 -->
      <div class="ranking-section">
        <h3>红人表现排行</h3>
        <div class="ranking-table">
          <div class="table-header">
            <div class="rank-col">排名</div>
            <div class="name-col">红人</div>
            <div class="platform-col">平台</div>
            <div class="posts-col">帖子数</div>
            <div class="views-col">曝光量</div>
            <div class="engagement-col">互动率</div>
            <div class="roi-col">ROI</div>
          </div>
          <div class="table-body">
            <div
              v-for="(influencer, index) in topInfluencers"
              :key="influencer.id"
              class="table-row"
            >
              <div class="rank-col">
                <span class="rank-badge" :class="getRankClass(index + 1)">{{ index + 1 }}</span>
              </div>
              <div class="name-col">
                <div class="influencer-info">
                  <img :src="influencer.avatar" :alt="influencer.name" class="avatar">
                  <div>
                    <div class="name">{{ influencer.name }}</div>
                    <div class="followers">{{ formatNumber(influencer.followers) }} 粉丝</div>
                  </div>
                </div>
              </div>
              <div class="platform-col">
                <span class="platform-badge" :class="influencer.platform">{{ influencer.platform }}</span>
              </div>
              <div class="posts-col">{{ influencer.posts }}</div>
              <div class="views-col">{{ formatNumber(influencer.views) }}</div>
              <div class="engagement-col">{{ influencer.engagementRate }}%</div>
              <div class="roi-col">
                <span class="roi-value" :class="getRoiClass(influencer.roi)">{{ influencer.roi }}x</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 帖子表现分析 -->
      <div class="posts-section">
        <h3>帖子表现分析</h3>
        <div class="posts-grid">
          <div
            v-for="post in topPosts"
            :key="post.id"
            class="post-card"
          >
            <div class="post-image">
              <img :src="post.image" :alt="post.title">
            </div>
            <div class="post-content">
              <h4>{{ post.title }}</h4>
              <div class="post-meta">
                <span class="author">{{ post.author }}</span>
                <span class="platform">{{ post.platform }}</span>
                <span class="date">{{ formatDate(post.date) }}</span>
              </div>
              <div class="post-stats">
                <div class="stat-item">
                  <Eye class="stat-icon" />
                  <span>{{ formatNumber(post.views) }}</span>
                </div>
                <div class="stat-item">
                  <Heart class="stat-icon" />
                  <span>{{ formatNumber(post.likes) }}</span>
                </div>
                <div class="stat-item">
                  <MessageCircle class="stat-icon" />
                  <span>{{ formatNumber(post.comments) }}</span>
                </div>
                <div class="stat-item">
                  <Share class="stat-icon" />
                  <span>{{ formatNumber(post.shares) }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Users, FileText, Eye, Heart, MessageCircle, Share } from 'lucide-vue-next'

// 定义数据类型
interface InfluencerStats {
  activeInfluencers: number
  influencerGrowth: number
  monthlyPosts: number
  postGrowth: number
  totalViews: number
  viewGrowth: number
  avgEngagementRate: number
  engagementGrowth: number
}

interface Influencer {
  id: string
  name: string
  avatar: string
  platform: string
  followers: number
  posts: number
  views: number
  engagementRate: number
  roi: number
}

interface Post {
  id: string
  title: string
  author: string
  platform: string
  image: string
  date: string
  views: number
  likes: number
  comments: number
  shares: number
}

// 响应式数据
const stats = ref<InfluencerStats>({
  activeInfluencers: 48,
  influencerGrowth: 12,
  monthlyPosts: 156,
  postGrowth: 8,
  totalViews: 2450000,
  viewGrowth: 15,
  avgEngagementRate: 4.2,
  engagementGrowth: 3
})

const topInfluencers = ref<Influencer[]>([
  {
    id: '1',
    name: 'Sarah Johnson',
    avatar: '/avatars/influencer1.jpg',
    platform: 'Instagram',
    followers: 125000,
    posts: 12,
    views: 450000,
    engagementRate: 5.8,
    roi: 4.2
  },
  {
    id: '2',
    name: 'Mike Chen',
    avatar: '/avatars/influencer2.jpg',
    platform: 'TikTok',
    followers: 89000,
    posts: 8,
    views: 320000,
    engagementRate: 6.2,
    roi: 3.8
  },
  {
    id: '3',
    name: 'Emma Davis',
    avatar: '/avatars/influencer3.jpg',
    platform: 'YouTube',
    followers: 67000,
    posts: 5,
    views: 280000,
    engagementRate: 4.5,
    roi: 3.5
  },
  {
    id: '4',
    name: 'Alex Wilson',
    avatar: '/avatars/influencer4.jpg',
    platform: 'Instagram',
    followers: 45000,
    posts: 15,
    views: 180000,
    engagementRate: 4.8,
    roi: 3.2
  },
  {
    id: '5',
    name: 'Lisa Zhang',
    avatar: '/avatars/influencer5.jpg',
    platform: 'TikTok',
    followers: 38000,
    posts: 10,
    views: 150000,
    engagementRate: 5.5,
    roi: 2.9
  }
])

const topPosts = ref<Post[]>([
  {
    id: '1',
    title: '夏季新品推荐 - 清爽护肤套装',
    author: 'Sarah Johnson',
    platform: 'Instagram',
    image: '/posts/post1.jpg',
    date: '2024-01-15',
    views: 85000,
    likes: 4200,
    comments: 320,
    shares: 180
  },
  {
    id: '2',
    title: '健身达人的日常 - 蛋白粉测评',
    author: 'Mike Chen',
    platform: 'TikTok',
    image: '/posts/post2.jpg',
    date: '2024-01-14',
    views: 72000,
    likes: 3800,
    comments: 280,
    shares: 150
  },
  {
    id: '3',
    title: '居家好物分享 - 提升生活品质',
    author: 'Emma Davis',
    platform: 'YouTube',
    image: '/posts/post3.jpg',
    date: '2024-01-13',
    views: 65000,
    likes: 3200,
    comments: 240,
    shares: 120
  },
  {
    id: '4',
    title: '时尚穿搭 - 春季搭配指南',
    author: 'Alex Wilson',
    platform: 'Instagram',
    image: '/posts/post4.jpg',
    date: '2024-01-12',
    views: 58000,
    likes: 2900,
    comments: 190,
    shares: 95
  }
])

// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}

const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

const getRankClass = (rank: number): string => {
  if (rank === 1) return 'rank-first'
  if (rank === 2) return 'rank-second'
  if (rank === 3) return 'rank-third'
  return 'rank-default'
}

const getRoiClass = (roi: number): string => {
  if (roi >= 4) return 'roi-excellent'
  if (roi >= 3) return 'roi-good'
  if (roi >= 2) return 'roi-fair'
  return 'roi-poor'
}

onMounted(() => {
  // 组件挂载时加载数据
  console.log('KOL数据面板已加载')
})
</script>

<style scoped>
.kol-data-panel {
  padding: 24px;
  background: var(--color-background);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 24px;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.section-description {
  color: var(--color-text-secondary);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
  margin-bottom: 32px;
}

.stat-card {
  background: var(--color-background-soft);
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-content h3 {
  font-size: 14px;
  color: var(--color-text-secondary);
  margin: 0 0 8px 0;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 4px;
}

.stat-change {
  font-size: 12px;
  font-weight: 500;
}

.stat-change.positive {
  color: var(--color-success);
}

.ranking-section {
  margin-bottom: 32px;
}

.ranking-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.ranking-table {
  background: var(--color-background-soft);
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 60px 1fr 100px 80px 120px 80px 80px;
  gap: 16px;
  padding: 16px;
  background: var(--color-background-mute);
  font-weight: 600;
  color: var(--color-text-secondary);
  font-size: 14px;
}

.table-row {
  display: grid;
  grid-template-columns: 60px 1fr 100px 80px 120px 80px 80px;
  gap: 16px;
  padding: 16px;
  border-top: 1px solid var(--color-border);
  align-items: center;
}

.rank-badge {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: white;
}

.rank-first { background: #ffd700; }
.rank-second { background: #c0c0c0; }
.rank-third { background: #cd7f32; }
.rank-default { background: var(--color-text-secondary); }

.influencer-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
}

.name {
  font-weight: 500;
  color: var(--color-text);
}

.followers {
  font-size: 12px;
  color: var(--color-text-secondary);
}

.platform-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  color: white;
}

.platform-badge.Instagram { background: #e4405f; }
.platform-badge.TikTok { background: #000000; }
.platform-badge.YouTube { background: #ff0000; }

.roi-value.roi-excellent { color: var(--color-success); }
.roi-value.roi-good { color: var(--color-warning); }
.roi-value.roi-fair { color: var(--color-info); }
.roi-value.roi-poor { color: var(--color-danger); }

.posts-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 16px;
}

.post-card {
  background: var(--color-background-soft);
  border-radius: 8px;
  overflow: hidden;
}

.post-image {
  width: 100%;
  height: 200px;
  overflow: hidden;
}

.post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.post-content {
  padding: 16px;
}

.post-content h4 {
  font-size: 16px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 8px 0;
}

.post-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.post-meta span {
  padding: 2px 6px;
  background: var(--color-background-mute);
  border-radius: 4px;
}

.post-stats {
  display: flex;
  gap: 16px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-secondary);
}

.stat-item .stat-icon {
  width: 14px;
  height: 14px;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }
}
</style>
