<template>
  <div class="kol-post-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">红人/帖子数据管理</h1>
          <p class="page-description">记录和管理每月红人合作数据和发帖效果数据</p>
        </div>
        <div class="header-right">
          <button v-if="activeTab === 'post-data'" class="btn btn-primary" @click="showAddPostModal">
            <Plus :size="16" />
            添加发帖数据
          </button>
        </div>
      </div>
    </div>

    <!-- 标签页切换 -->
    <div class="tabs-section">
      <div class="tabs">
        <button
          class="tab-button"
          :class="{ active: activeTab === 'influencer-data' }"
          @click="activeTab = 'influencer-data'"
        >
          <Users :size="16" />
          红人数据
        </button>
        <button
          class="tab-button"
          :class="{ active: activeTab === 'post-data' }"
          @click="activeTab = 'post-data'"
        >
          <FileText :size="16" />
          发帖数据
        </button>
      </div>
    </div>

    <!-- 筛选器 -->
    <div class="filter-section">
      <div class="filter-row">
        <!-- 红人数据筛选 -->
        <div v-if="activeTab === 'influencer-data'" class="filter-group">
          <div class="filter-item">
            <label>客户：</label>
            <select v-model="dataFilters.customer" class="form-select">
              <option value="">全部客户</option>
              <option v-for="customer in mockCustomers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>
          <div class="filter-item">
            <label>项目：</label>
            <select v-model="dataFilters.project" class="form-select">
              <option value="">全部项目</option>
              <option v-for="project in filteredProjects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          <div class="filter-item">
            <label>月份：</label>
            <input v-model="dataFilters.month" type="month" class="form-input" />
          </div>
          <div class="filter-item">
            <label>搜索：</label>
            <input
              v-model="dataFilters.search"
              type="text"
              class="form-input"
              placeholder="搜索客户、项目或录入人..."
            />
          </div>
        </div>

        <!-- 红人管理筛选 -->
        <div v-if="activeTab === 'kols'" class="filter-group">
          <div class="filter-item">
            <label>红人类型：</label>
            <select v-model="filters.kolType" class="form-select">
              <option value="">全部类型</option>
              <option value="mega">头部红人</option>
              <option value="macro">腰部红人</option>
              <option value="micro">尾部红人</option>
              <option value="nano">素人</option>
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
              placeholder="搜索红人名称..."
            />
          </div>
        </div>

        <!-- 发帖数据筛选 -->
        <div v-if="activeTab === 'post-data'" class="filter-group">
          <div class="filter-item">
            <label>客户：</label>
            <select v-model="dataFilters.customer" class="form-select">
              <option value="">全部客户</option>
              <option v-for="customer in mockCustomers" :key="customer.id" :value="customer.id">
                {{ customer.name }}
              </option>
            </select>
          </div>
          <div class="filter-item">
            <label>项目：</label>
            <select v-model="dataFilters.project" class="form-select">
              <option value="">全部项目</option>
              <option v-for="project in filteredProjects" :key="project.id" :value="project.id">
                {{ project.name }}
              </option>
            </select>
          </div>
          <div class="filter-item">
            <label>月份：</label>
            <input v-model="dataFilters.month" type="month" class="form-input" />
          </div>
          <div class="filter-item">
            <label>搜索：</label>
            <input
              v-model="dataFilters.search"
              type="text"
              class="form-input"
              placeholder="搜索客户、项目或录入人..."
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 红人数据管理内容 -->
    <div v-if="activeTab === 'influencer-data'" class="content-section">

      <!-- 红人数据列表表格 -->
      <div class="data-table-container">
        <div class="table-header">
          <h3>红人数据列表</h3>
          <div class="table-actions">
            <button class="btn btn-primary" @click="showAddDataModal">
              <Plus :size="16" />
              添加红人数据
            </button>
            <button class="btn btn-secondary">
              <FileText :size="16" />
              导出数据
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>月份</th>
                <th>总网红数</th>
                <th>提及内容总数</th>
                <th>总观看量</th>
                <th>评论数</th>
                <th>点赞及互动率</th>
                <th>客户</th>
                <th>项目</th>
                <th>录入时间</th>
                <th>录入人</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in filteredInfluencerData" :key="data.id">
                <td>{{ data.month }}</td>
                <td>{{ data.totalInfluencers }}</td>
                <td>{{ data.contentMentions }}</td>
                <td>{{ formatNumber(data.totalViews) }}</td>
                <td>{{ formatNumber(data.commentsCount) }}</td>
                <td>{{ formatNumber(data.likesCount) }}/{{ data.interactionRate }}%</td>
                <td>{{ data.customerName }}</td>
                <td>{{ data.projectName }}</td>
                <td>{{ formatDate(data.createdAt) }}</td>
                <td>{{ data.createdBy }}</td>
                                <td>
                  <div class="action-buttons">
                    <button
                      class="action-btn-small action-btn-small--primary"
                      title="查看详情"
                      @click="viewInfluencerDetails(data)"
                    >
                      <Eye :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--secondary"
                      title="编辑"
                      @click="showEditDataModal(data)"
                    >
                      <Edit :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 红人管理内容 -->
    <div v-if="activeTab === 'kols'" class="content-section">
      <div class="kol-grid">
        <div v-for="kol in mockKOLs" :key="kol.id" class="kol-card">
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
                <span>${{ kol.price.toLocaleString() }}/帖</span>
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

    <!-- 发帖数据内容 -->
    <div v-if="activeTab === 'post-data'" class="content-section">
      <!-- 发帖数据列表表格 -->
      <div class="data-table-container">
        <div class="table-header">
          <h3>发帖数据列表</h3>
          <div class="table-actions">
            <button class="btn btn-primary" @click="showAddPostModal">
              <Plus :size="16" />
              添加发帖数据
            </button>
            <button class="btn btn-secondary">
              <FileText :size="16" />
              导出数据
            </button>
          </div>
        </div>

        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr>
                <th>月份</th>
                <th>总发帖数</th>
                <th>评论数</th>
                <th>点赞数及互动率</th>
                <th>客户</th>
                <th>项目</th>
                <th>录入时间</th>
                <th>录入人</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="data in filteredPostData" :key="data.id">
                <td>{{ data.month }}</td>
                <td>{{ data.totalPosts }}</td>
                <td>{{ formatNumber(data.commentsCount) }}</td>
                <td>{{ formatNumber(data.likesCount) }}/{{ data.interactionRate }}%</td>
                <td>{{ data.customerName }}</td>
                <td>{{ data.projectName }}</td>
                <td>{{ formatDate(data.createdAt) }}</td>
                <td>{{ data.createdBy }}</td>
                <td>
                  <div class="action-buttons">
                    <button
                      class="action-btn-small action-btn-small--primary"
                      title="查看详情"
                      @click="viewPostDetails(data)"
                    >
                      <Eye :size="14" />
                    </button>
                    <button
                      class="action-btn-small action-btn-small--secondary"
                      title="编辑"
                      @click="showEditPostModal(data)"
                    >
                      <Edit :size="14" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 空状态 -->
    <div v-if="(activeTab === 'influencer-data' && filteredInfluencerData.length === 0) || (activeTab === 'post-data' && filteredPostData.length === 0)" class="empty-state">
      <component :is="getEmptyStateIcon()" :size="64" class="empty-icon" />
      <h3>{{ getEmptyStateTitle() }}</h3>
      <p>{{ getEmptyStateDescription() }}</p>
    </div>

    <!-- 红人数据添加/编辑模态框 -->
    <InfluencerDataModal
      :is-visible="showDataModal"
      :is-edit="isEditMode"
      :edit-data="editingData"
      :customers="mockCustomers"
      :projects="mockProjects"
      @close="closeDataModal"
      @save="handleSaveData"
      @save-and-continue="handleSaveAndContinue"
    />

    <!-- 发帖数据添加/编辑模态框 -->
    <PostDataModal
      :is-visible="showPostModal"
      :is-edit="isPostEditMode"
      :edit-data="editingPostData"
      :customers="mockCustomers"
      :projects="mockProjects"
      @close="closePostModal"
      @save="handleSavePostData"
      @save-and-continue="handleSavePostAndContinue"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  Plus, FileText, Users, Heart, TrendingUp, DollarSign, MessageCircle,
  BarChart3, Settings, User, Calendar, Globe, Eye, Share, X, Edit
} from 'lucide-vue-next'
import {
  mockInfluencerData,
  mockKOLs,
  mockInfluencerPostData as mockPostData,
  mockInfluencerCustomers as mockCustomers,
  mockInfluencerProjects as mockProjects,
  mockInfluencerStats
} from '@/mock/influencer-data'
import InfluencerDataModal from '@/components/projects/InfluencerDataModal.vue'
import PostDataModal from '@/components/projects/PostDataModal.vue'
import type { InfluencerDataForm, PostDataForm } from '@/types'

// 活跃标签页
const activeTab = ref('influencer-data')

// 红人数据管理筛选器
const dataFilters = ref({
  customer: '',
  project: '',
  month: '',
  search: ''
})

// 红人管理和帖子管理筛选器状态
const filters = ref({
  kolType: '',
  postStatus: '',
  platform: '',
  search: ''
})

// 根据选择的客户筛选项目
const filteredProjects = computed(() => {
  if (!dataFilters.value.customer) {
    return mockProjects
  }
  return mockProjects.filter(project => project.customerId === dataFilters.value.customer)
})

// 红人数据模态框状态
const showDataModal = ref(false)
const isEditMode = ref(false)
const editingData = ref(null)

// 发帖数据模态框状态
const showPostModal = ref(false)
const isPostEditMode = ref(false)
const editingPostData = ref(null)

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

// 筛选后的红人数据
const filteredInfluencerData = computed(() => {
  let filtered = mockInfluencerData

  // 客户筛选
  if (dataFilters.value.customer) {
    filtered = filtered.filter(data => data.customerId === dataFilters.value.customer)
  }

  // 项目筛选
  if (dataFilters.value.project) {
    filtered = filtered.filter(data => data.projectId === dataFilters.value.project)
  }

  // 月份筛选
  if (dataFilters.value.month) {
    filtered = filtered.filter(data => data.month === dataFilters.value.month)
  }

  // 搜索筛选
  if (dataFilters.value.search) {
    const searchTerm = dataFilters.value.search.toLowerCase()
    filtered = filtered.filter(data =>
      data.customerName.toLowerCase().includes(searchTerm) ||
      data.projectName.toLowerCase().includes(searchTerm) ||
      data.createdBy.toLowerCase().includes(searchTerm)
    )
  }

  return filtered
})

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K'
  }
  return num.toLocaleString()
}

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

// 获取平台文本
const getPlatformText = (platform: string): string => {
  const platformMap: Record<string, string> = {
    instagram: 'Instagram',
    tiktok: 'TikTok',
    youtube: 'YouTube',
    xiaohongshu: '小红书',
    weibo: '微博'
  }
  return platformMap[platform] || platform
}

// 空状态相关方法
const getEmptyStateIcon = () => {
  switch (activeTab.value) {
    case 'influencer-data':
      return Users
    case 'post-data':
      return FileText
    default:
      return Users
  }
}

const getEmptyStateTitle = (): string => {
  switch (activeTab.value) {
    case 'influencer-data':
      return '暂无红人数据'
    case 'post-data':
      return '暂无发帖数据'
    default:
      return '暂无数据'
  }
}

const getEmptyStateDescription = (): string => {
  switch (activeTab.value) {
    case 'influencer-data':
      return '还没有录入任何红人数据，点击上方按钮开始添加'
    case 'post-data':
      return '还没有录入任何发帖数据，点击上方按钮开始添加'
    default:
      return '暂无相关数据'
  }
}

// 模态框操作方法
const showAddDataModal = () => {
  isEditMode.value = false
  editingData.value = null
  showDataModal.value = true
}

const showEditDataModal = (data: any) => {
  isEditMode.value = true
  editingData.value = data
  showDataModal.value = true
}

const closeDataModal = () => {
  showDataModal.value = false
  isEditMode.value = false
  editingData.value = null
}

const handleSaveData = (formData: InfluencerDataForm) => {
  // 这里应该调用API保存数据，现在只是模拟
  console.log('保存红人数据:', formData)

  // 模拟添加到数据列表
  const newData = {
    id: Date.now().toString(),
    month: formData.month,
    totalInfluencers: formData.totalInfluencers || 0,
    contentMentions: formData.contentMentions || 0,
    totalViews: formData.totalViews || 0,
    commentsCount: formData.commentsCount || 0,
    likesCount: formData.likesCount || 0,
    interactionRate: formData.interactionRate || 0,
    customerId: formData.customerId,
    customerName: mockCustomers.find(c => c.id === formData.customerId)?.name || '',
    projectId: formData.projectId,
    projectName: mockProjects.find(p => p.id === formData.projectId)?.name || '',
    createdBy: '当前用户',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  mockInfluencerData.push(newData)
  closeDataModal()

  // 显示成功提示
  alert('红人数据保存成功！')
}

const handleSaveAndContinue = (formData: InfluencerDataForm) => {
  handleSaveData(formData)
  // 保存后不关闭模态框，继续添加
  showAddDataModal()
}

// 发帖数据模态框操作方法
const showAddPostModal = () => {
  isPostEditMode.value = false
  editingPostData.value = null
  showPostModal.value = true
}

const showEditPostModal = (data: any) => {
  isPostEditMode.value = true
  editingPostData.value = data
  showPostModal.value = true
}

const closePostModal = () => {
  showPostModal.value = false
  isPostEditMode.value = false
  editingPostData.value = null
}

const handleSavePostData = (formData: PostDataForm) => {
  // 这里应该调用API保存数据，现在只是模拟
  console.log('保存发帖数据:', formData)

  // 模拟添加到数据列表
  const newPostData = {
    id: Date.now().toString(),
    month: formData.month,
    totalPosts: formData.totalPosts || 0,
    commentsCount: formData.commentsCount || 0,
    likesCount: formData.likesCount || 0,
    interactionRate: formData.interactionRate || 0,
    customerId: formData.customerId,
    customerName: mockCustomers.find(c => c.id === formData.customerId)?.name || '',
    projectId: formData.projectId,
    projectName: mockProjects.find(p => p.id === formData.projectId)?.name || '',
    createdBy: '当前用户',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }

  mockPostData.push(newPostData)
  closePostModal()

  // 显示成功提示
  alert('发帖数据保存成功！')
}

const handleSavePostAndContinue = (formData: PostDataForm) => {
  handleSavePostData(formData)
  // 保存后不关闭模态框，继续添加
  showAddPostModal()
}

// 删除红人数据
const handleDeleteData = (data: any) => {
  if (confirm(`确定要删除 ${data.customerName} - ${data.projectName} 的红人数据吗？`)) {
    const index = mockInfluencerData.findIndex(item => item.id === data.id)
    if (index > -1) {
      mockInfluencerData.splice(index, 1)
      alert('删除成功！')
    }
  }
}

// 删除发帖数据
const handleDeletePostData = (data: any) => {
  if (confirm(`确定要删除 ${data.customerName} - ${data.projectName} 的发帖数据吗？`)) {
    const index = mockPostData.findIndex(item => item.id === data.id)
    if (index > -1) {
      mockPostData.splice(index, 1)
      alert('删除成功！')
    }
  }
}

// 查看红人详情
const viewInfluencerDetails = (data: any) => {
  console.log('查看红人详情:', data)
  // TODO: 实现查看详情功能，可以打开详情弹窗或跳转详情页面
  alert(`查看 ${data.customerName} - ${data.projectName} 的红人详情`)
}

// 查看发帖数据
const viewPostData = (data: any) => {
  console.log('查看发帖数据:', data)
  // TODO: 跳转到发帖数据页面或筛选发帖数据
  // 切换到发帖数据标签页并筛选相关数据
  activeTab.value = 'post-data'
  // 可以添加筛选逻辑
}

// 查看数据分析
const viewDataAnalytics = (data: any) => {
  console.log('查看数据分析:', data)
  // TODO: 实现数据分析功能，可以打开分析图表弹窗
  alert(`查看 ${data.customerName} - ${data.projectName} 的数据分析`)
}

// 查看发帖详情
const viewPostDetails = (data: any) => {
  console.log('查看发帖详情:', data)
  // TODO: 实现查看发帖详情功能，可以打开详情弹窗
  alert(`查看 ${data.customerName} - ${data.projectName} 的发帖详情`)
}

// 筛选后的发帖数据
const filteredPostData = computed(() => {
  let filtered = mockPostData

  // 客户筛选
  if (dataFilters.value.customer) {
    filtered = filtered.filter(data => data.customerId === dataFilters.value.customer)
  }

  // 项目筛选
  if (dataFilters.value.project) {
    filtered = filtered.filter(data => data.projectId === dataFilters.value.project)
  }

  // 月份筛选
  if (dataFilters.value.month) {
    filtered = filtered.filter(data => data.month === dataFilters.value.month)
  }

  // 搜索筛选
  if (dataFilters.value.search) {
    const searchTerm = dataFilters.value.search.toLowerCase()
    filtered = filtered.filter(data =>
      data.customerName.toLowerCase().includes(searchTerm) ||
      data.projectName.toLowerCase().includes(searchTerm) ||
      data.createdBy.toLowerCase().includes(searchTerm)
    )
  }

  return filtered
})
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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 16px;
  padding: 8px;
  margin-bottom: 24px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.tabs {
  display: flex;
  gap: 6px;
}

.tab-button {
  flex: 1;
  padding: 14px 24px;
  border: none;
  background: transparent;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 600;
  color: #64748b;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  position: relative;
  overflow: hidden;
}

.tab-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(147, 51, 234, 0.1));
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 12px;
}

.tab-button:hover::before {
  opacity: 1;
}

.tab-button.active {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  box-shadow: 0 8px 25px -8px rgba(59, 130, 246, 0.5);
  transform: translateY(-1px);
}

.tab-button.active::before {
  opacity: 0;
}

.tab-button:hover:not(.active) {
  background: rgba(255, 255, 255, 0.8);
  color: #1e293b;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px -4px rgba(0, 0, 0, 0.15);
}

.tab-button:active {
  transform: translateY(0);
  transition: transform 0.1s ease;
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

.filter-group {
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
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

/* 红人数据管理样式 */
.stats-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.stat-card {
  background: #f8f9fa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.2s;
}

.stat-card:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.stat-icon {
  width: 48px;
  height: 48px;
  background: #1976d2;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.data-table-container {
  background: #fafafa;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: white;
  border-bottom: 1px solid #e0e0e0;
}

.table-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.table-actions {
  display: flex;
  gap: 12px;
}

.table-wrapper {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}

.data-table th {
  background: #f5f5f5;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  color: #333;
  border-bottom: 1px solid #e0e0e0;
  white-space: nowrap;
}

.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #f0f0f0;
  color: #333;
  white-space: nowrap;
}

.data-table tbody tr:hover {
  background: #f8f9fa;
}

.action-buttons {
  display: flex;
  gap: 4px;
  flex-wrap: wrap;
  align-items: center;
}

.action-btn-small {
  padding: 6px 8px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.action-btn-small--primary {
  background: var(--color-primary);
  color: white;
}

.action-btn-small--primary:hover {
  background: var(--color-primary-hover);
}

.action-btn-small--secondary {
  background: var(--color-background-tertiary);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.action-btn-small--secondary:hover {
  background: var(--color-background-hover);
  color: var(--color-text-primary);
}

.action-btn-small--warning {
  background: var(--color-warning-light);
  color: var(--color-warning);
}

.action-btn-small--warning:hover {
  background: var(--color-warning);
  color: white;
}

.action-btn-small--danger {
  background: var(--color-danger-light);
  color: var(--color-danger);
}

.action-btn-small--danger:hover {
  background: var(--color-danger);
  color: white;
}
</style>
