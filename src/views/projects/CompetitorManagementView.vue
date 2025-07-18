<template>
  <div class="competitor-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1 class="page-title">竞品管理</h1>
          <p class="page-description">记录和管理项目相关的竞品信息</p>
        </div>
        <div class="header-right">
          <button class="btn btn-primary" @click="showAddModal = true">
            <Plus :size="16" />
            添加竞品
          </button>
        </div>
      </div>
    </div>

    <!-- 搜索筛选 -->
    <div class="filter-section">
      <div class="filter-row">
        <div class="filter-item">
          <label>搜索：</label>
          <input
            v-model="searchText"
            type="text"
            class="form-input"
            placeholder="搜索竞品名称、项目名称或客户名称..."
          />
        </div>
      </div>
    </div>

    <!-- 竞品表格 -->
    <div class="content-section">
      <div class="table-container">
        <table class="competitor-table">
          <thead>
            <tr>
              <th>客户名称</th>
              <th>项目名称</th>
              <th>竞品名称</th>
              <th>网站地址</th>
              <th>活动时间</th>
              <th>活动内容</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="competitor in filteredCompetitors" :key="competitor.id" class="table-row">
              <td class="customer-name">{{ competitor.customerName }}</td>
              <td class="project-name">{{ competitor.projectName }}</td>
              <td class="competitor-name">{{ competitor.name }}</td>
              <td class="website-cell">
                <a :href="competitor.website" target="_blank" class="website-link">
                  {{ competitor.website }}
                </a>
              </td>
              <td class="activity-time">{{ competitor.activityTime }}</td>
              <td class="activity-content">
                <div class="content-preview" :title="competitor.activityContent">
                  {{ competitor.activityContent }}
                </div>
              </td>
              <td class="actions-cell">
                <button class="btn-icon" @click="editCompetitor(competitor)" title="编辑">
                  <Edit :size="16" />
                </button>
                <button class="btn-icon delete" @click="deleteCompetitor(competitor.id)" title="删除">
                  <Trash2 :size="16" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- 空状态 -->
        <div v-if="filteredCompetitors.length === 0" class="empty-state">
          <Search :size="64" class="empty-icon" />
          <h3>暂无竞品信息</h3>
          <p>还没有添加任何竞品信息，点击上方按钮开始添加</p>
        </div>
      </div>
    </div>

    <!-- 添加/编辑竞品弹窗 -->
    <div v-if="showAddModal || showEditModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ showEditModal ? '编辑竞品' : '添加竞品' }}</h3>
          <button class="btn-close" @click="closeModal">
            <X :size="20" />
          </button>
        </div>

        <div class="modal-body">
          <div class="form-row">
            <div class="form-group">
              <label>竞品名称 *</label>
              <input
                v-model="formData.name"
                type="text"
                class="form-input"
                placeholder="请输入竞品名称"
              />
            </div>

            <div class="form-group">
              <label>项目名称 *</label>
              <input
                v-model="formData.projectName"
                type="text"
                class="form-input"
                placeholder="请输入项目名称"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>客户名称 *</label>
              <input
                v-model="formData.customerName"
                type="text"
                class="form-input"
                placeholder="请输入客户名称"
              />
            </div>

            <div class="form-group">
              <label>网站地址 *</label>
              <input
                v-model="formData.website"
                type="url"
                class="form-input"
                placeholder="https://example.com"
              />
            </div>
          </div>

          <div class="form-group">
            <label>活动时间 *</label>
            <input
              v-model="formData.activityTime"
              type="text"
              class="form-input"
              placeholder="例如：2024年1月-3月"
            />
          </div>

          <div class="form-group">
            <label>活动内容 *</label>
            <textarea
              v-model="formData.activityContent"
              class="form-textarea"
              rows="4"
              placeholder="请描述竞品的活动内容..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-outline" @click="closeModal">取消</button>
          <button class="btn btn-primary" @click="saveCompetitor">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Plus, Edit, Trash2, Search, X } from 'lucide-vue-next'

// 数据状态
const searchText = ref('')
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingId = ref<number | null>(null)

// 表单数据
const formData = ref({
  name: '',
  projectName: '',
  customerName: '',
  website: '',
  activityTime: '',
  activityContent: ''
})

// 竞品数据
const competitors = ref([
  {
    id: 1,
    name: 'Fashion Rival',
    projectName: '春季时尚推广',
    customerName: '时尚品牌A',
    website: 'https://fashionrival.com',
    activityTime: '2024年1月-3月',
    activityContent: '春季新品发布活动，主打环保时尚理念，通过社交媒体和KOL合作推广，目标年轻消费群体。'
  },
  {
    id: 2,
    name: 'Tech Leader Pro',
    projectName: '数码产品营销',
    customerName: '科技公司B',
    website: 'https://techleader.com',
    activityTime: '2024年2月-4月',
    activityContent: '新产品预售活动，采用限时折扣和早鸟优惠策略，主要通过邮件营销和官网推广。'
  },
  {
    id: 3,
    name: 'Beauty Expert',
    projectName: '护肤品牌宣传',
    customerName: '美妆集团C',
    website: 'https://beautyexpert.com',
    activityTime: '2024年3月-5月',
    activityContent: '护肤品试用装免费派送活动，结合直播带货和用户评价分享，提升品牌知名度。'
  }
])

// 筛选后的竞品列表
const filteredCompetitors = computed(() => {
  if (!searchText.value) {
    return competitors.value
  }

  const search = searchText.value.toLowerCase()
  return competitors.value.filter(competitor =>
    competitor.name.toLowerCase().includes(search) ||
    competitor.projectName.toLowerCase().includes(search) ||
    competitor.customerName.toLowerCase().includes(search) ||
    competitor.website.toLowerCase().includes(search)
  )
})

// 添加竞品
const saveCompetitor = () => {
  if (!formData.value.name || !formData.value.projectName || !formData.value.customerName ||
      !formData.value.website || !formData.value.activityTime || !formData.value.activityContent) {
    alert('请填写所有必填字段')
    return
  }

  if (showEditModal.value && editingId.value) {
    // 编辑模式
    const index = competitors.value.findIndex(c => c.id === editingId.value)
    if (index !== -1) {
      competitors.value[index] = {
        ...competitors.value[index],
        ...formData.value
      }
    }
  } else {
    // 添加模式
    const newId = Math.max(...competitors.value.map(c => c.id), 0) + 1
    competitors.value.push({
      id: newId,
      ...formData.value
    })
  }

  closeModal()
}

// 编辑竞品
const editCompetitor = (competitor: any) => {
  editingId.value = competitor.id
  formData.value = {
    name: competitor.name,
    projectName: competitor.projectName,
    customerName: competitor.customerName,
    website: competitor.website,
    activityTime: competitor.activityTime,
    activityContent: competitor.activityContent
  }
  showEditModal.value = true
}

// 删除竞品
const deleteCompetitor = (id: number) => {
  if (confirm('确定要删除这个竞品吗？')) {
    const index = competitors.value.findIndex(c => c.id === id)
    if (index !== -1) {
      competitors.value.splice(index, 1)
    }
  }
}

// 关闭弹窗
const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  editingId.value = null
  formData.value = {
    name: '',
    projectName: '',
    customerName: '',
    website: '',
    activityTime: '',
    activityContent: ''
  }
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

.form-input {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-width: 300px;
}

.content-section {
  background: white;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-container {
  overflow-x: auto;
}

.competitor-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.competitor-table th {
  background: #f8f9fa;
  color: #333;
  font-weight: 600;
  padding: 12px 8px;
  text-align: left;
  border-bottom: 2px solid #e0e0e0;
  white-space: nowrap;
}

.competitor-table td {
  padding: 12px 8px;
  border-bottom: 1px solid #e0e0e0;
  vertical-align: top;
}

.table-row:hover {
  background: #f8f9fa;
}

.competitor-name {
  font-weight: 600;
  color: #1a1a1a;
  min-width: 120px;
}

.project-name {
  color: #1976d2;
  font-weight: 500;
  min-width: 120px;
}

.customer-name {
  color: #666;
  min-width: 100px;
}

.website-cell {
  min-width: 200px;
}

.website-link {
  color: #1976d2;
  text-decoration: none;
  word-break: break-all;
}

.website-link:hover {
  text-decoration: underline;
}

.activity-time {
  color: #666;
  min-width: 120px;
  white-space: nowrap;
}

.activity-content {
  max-width: 300px;
}

.content-preview {
  max-width: 300px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #666;
  line-height: 1.4;
  cursor: help;
}

.actions-cell {
  min-width: 80px;
  text-align: center;
}

.btn-icon {
  padding: 6px;
  border: none;
  background: transparent;
  color: #666;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
  margin: 0 2px;
}

.btn-icon:hover {
  background: #f0f0f0;
  color: #1976d2;
}

.btn-icon.delete:hover {
  background: #ffebee;
  color: #c62828;
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

/* 弹窗样式 */
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
  background: white;
  border-radius: 8px;
  width: 600px;
  max-width: 90vw;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e0e0e0;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.btn-close {
  padding: 4px;
  border: none;
  background: transparent;
  color: #666;
  cursor: pointer;
  border-radius: 4px;
}

.btn-close:hover {
  background: #f0f0f0;
}

.modal-body {
  padding: 24px;
}

.form-row {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.form-group {
  flex: 1;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 6px;
}

.form-input,
.form-textarea {
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
}

.modal-footer {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding: 20px 24px;
  border-top: 1px solid #e0e0e0;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-preview {
    max-width: 200px;
  }
}

@media (max-width: 768px) {
  .form-row {
    flex-direction: column;
  }

  .modal-content {
    width: 95vw;
  }

  .competitor-table {
    font-size: 12px;
  }

  .competitor-table th,
  .competitor-table td {
    padding: 8px 4px;
  }
}
</style>

