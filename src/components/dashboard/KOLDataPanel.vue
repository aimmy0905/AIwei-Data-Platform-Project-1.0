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
            <h3>红人总数</h3>
            <div class="stat-value">{{ stats.totalInfluencers }}</div>
            <div class="stat-change positive">+{{ stats.influencerGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Eye />
          </div>
          <div class="stat-content">
            <h3>总观看量</h3>
            <div class="stat-value">{{ formatNumber(stats.totalViews) }}</div>
            <div class="stat-change positive">+{{ stats.viewGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <MessageCircle />
          </div>
          <div class="stat-content">
            <h3>评论数</h3>
            <div class="stat-value">{{ formatNumber(stats.totalComments) }}</div>
            <div class="stat-change positive">+{{ stats.commentGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <ThumbsUp />
          </div>
          <div class="stat-content">
            <h3>点赞数</h3>
            <div class="stat-value">{{ formatNumber(stats.totalLikes) }}</div>
            <div class="stat-change positive">+{{ stats.likeGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <Heart />
          </div>
          <div class="stat-content">
            <h3>互动率</h3>
            <div class="stat-value">{{ stats.avgEngagementRate }}%</div>
            <div class="stat-change positive">+{{ stats.engagementGrowth }}%</div>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">
            <FileText />
          </div>
          <div class="stat-content">
            <h3>提及内容总数</h3>
            <div class="stat-value">{{ stats.totalMentions }}</div>
            <div class="stat-change positive">+{{ stats.mentionGrowth }}%</div>
          </div>
        </div>
      </div>

      <!-- 帖子数据 -->
      <div class="posts-data-section">
        <h3>帖子数据</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">
              <FileText />
            </div>
            <div class="stat-content">
              <h3>发帖总数</h3>
              <div class="stat-value">{{ formatNumber(postStats.totalPosts) }}</div>
              <div class="stat-change positive">+{{ postStats.postGrowth }}%</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <MessageCircle />
            </div>
            <div class="stat-content">
              <h3>评论数</h3>
              <div class="stat-value">{{ formatNumber(postStats.postComments) }}</div>
              <div class="stat-change positive">+{{ postStats.postCommentGrowth }}%</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <ThumbsUp />
            </div>
            <div class="stat-content">
              <h3>点赞数</h3>
              <div class="stat-value">{{ formatNumber(postStats.postLikes) }}</div>
              <div class="stat-change positive">+{{ postStats.postLikeGrowth }}%</div>
            </div>
          </div>

          <div class="stat-card">
            <div class="stat-icon">
              <Heart />
            </div>
            <div class="stat-content">
              <h3>互动率</h3>
              <div class="stat-value">{{ postStats.postEngagementRate }}%</div>
              <div class="stat-change positive">+{{ postStats.postEngagementGrowth }}%</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Users, FileText, Eye, Heart, MessageCircle, ThumbsUp } from 'lucide-vue-next'

// 定义数据类型
interface InfluencerStats {
  totalInfluencers: number
  influencerGrowth: number
  totalViews: number
  viewGrowth: number
  totalComments: number
  commentGrowth: number
  totalLikes: number
  likeGrowth: number
  avgEngagementRate: number
  engagementGrowth: number
  totalMentions: number
  mentionGrowth: number
}

interface PostStats {
  totalPosts: number
  postGrowth: number
  postComments: number
  postCommentGrowth: number
  postLikes: number
  postLikeGrowth: number
  postEngagementRate: number
  postEngagementGrowth: number
}



// 响应式数据
const stats = ref<InfluencerStats>({
  totalInfluencers: 48,
  influencerGrowth: 12,
  totalViews: 2450000,
  viewGrowth: 15,
  totalComments: 18500,
  commentGrowth: 8,
  totalLikes: 125000,
  likeGrowth: 12,
  avgEngagementRate: 4.2,
  engagementGrowth: 3,
  totalMentions: 320,
  mentionGrowth: 15
})

const postStats = ref<PostStats>({
  totalPosts: 1240,
  postGrowth: 18,
  postComments: 8650,
  postCommentGrowth: 12,
  postLikes: 45200,
  postLikeGrowth: 15,
  postEngagementRate: 5.8,
  postEngagementGrowth: 7
})



// 工具函数
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toString()
}



onMounted(() => {
  // 组件挂载时加载数据
  console.log('KOL数据面板已加载')
})
</script>

<style scoped>
.kol-data-panel {
  padding: 24px;
  background: #ffffff;
  border-radius: 16px;
  border: 1px solid #e5e7eb;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.kol-data-panel:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
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
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s ease;
}

.stat-card:hover {
  background: #f1f5f9;
  border-color: #e2e8f0;
  transform: translateY(-1px);
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

.posts-data-section {
  margin-top: 32px;
}

.posts-data-section h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--color-text);
  margin: 0 0 16px 0;
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
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
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
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.post-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
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
