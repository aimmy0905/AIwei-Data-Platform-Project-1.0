<template>
  <div class="competitor-panel">
    <!-- 页面标题 -->
    <div class="section-header">
      <h2 class="section-title">竞品情况</h2>
      <p class="section-description">竞品活动和营销数据监控</p>
    </div>

    <!-- 竞品列表 -->
    <div class="panel-content">
      <div class="list-header">
        <h3>竞品列表</h3>
        <button class="add-button" @click="showAddDialog = true">
          <i class="fas fa-plus"></i>
          新建竞品
        </button>
      </div>

      <div class="ranking-table">
        <div class="table-content">
          <div class="table-header">
            <div class="name-col">竞品名称</div>
            <div class="website-col">网址</div>
            <div class="campaign-col">活动内容</div>
            <div class="time-col">活动时间</div>
          </div>
          <div class="table-body">
            <div v-for="competitor in competitorData" :key="competitor.id" class="table-row">
              <div class="name-col">
                <div class="competitor-info">
                  <div class="competitor-name">{{ competitor.name }}</div>
                  <div v-if="competitor.description" class="competitor-description">{{ competitor.description }}</div>
                </div>
              </div>
              <div class="website-col">
                <a :href="competitor.website" target="_blank" class="website-link">
                  {{ competitor.website }}
                </a>
              </div>
              <div class="campaign-col">
                <span>{{ competitor.currentCampaign || '暂无活动' }}</span>
              </div>
              <div class="time-col">
                <div v-if="competitor.campaignStartDate" class="campaign-time">
                  <div>{{ formatDate(competitor.campaignStartDate) }}</div>
                  <div v-if="competitor.campaignEndDate">{{ formatDate(competitor.campaignEndDate) }}</div>
                </div>
                <span v-else class="no-data">-</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新增竞品弹窗 -->
    <div v-if="showAddDialog" class="dialog-overlay" @click="closeDialog">
      <div class="dialog-content" @click.stop>
        <div class="dialog-header">
          <h3>新建竞品</h3>
          <button class="close-button" @click="closeDialog">
            <i class="fas fa-times"></i>
          </button>
        </div>
        <form @submit.prevent="addCompetitor" class="dialog-form">
          <div class="form-group">
            <label>竞品名称</label>
            <input v-model="newCompetitor.name" type="text" required placeholder="请输入竞品名称">
          </div>
          <div class="form-group">
            <label>网址</label>
            <input v-model="newCompetitor.website" type="url" required placeholder="https://example.com">
          </div>
          <div class="form-group">
            <label>描述</label>
            <textarea v-model="newCompetitor.description" placeholder="请输入竞品描述"></textarea>
          </div>
          <div class="form-actions">
            <button type="button" class="cancel-button" @click="closeDialog">取消</button>
            <button type="submit" class="submit-button">保存</button>
          </div>
        </form>
      </div>
    </div>

    <!-- 模块小结 -->
    <ModuleSummary
      :default-text="'竞品监控数据完整，主要竞争对手活动频繁。建议关注竞品定价策略和营销活动，及时调整我方策略。'"
      placeholder="请输入竞品情况小结..."
      :stats="[
        { label: '监控竞品', value: 8 },
        { label: '活跃竞品', value: 5 },
        { label: '竞争状态', value: '激烈', type: 'badge', class: 'status-warning' }
      ]"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { CompetitorData } from '@/types'
import { mockGetCompetitorData, mockAddCompetitor } from '@/mock/dashboard'
import ModuleSummary from '@/components/common/ModuleSummary.vue'

const competitorData = ref<CompetitorData[]>([])
const showAddDialog = ref(false)

const newCompetitor = reactive({
  name: '',
  website: '',
  industry: '',
  description: '',
  status: 'monitoring' as const,
  addedBy: '当前用户'
})

const loadCompetitorData = async () => {
  try {
    const response = await mockGetCompetitorData()
    if (response.success && response.data) {
      competitorData.value = response.data
    }
  } catch (error) {
    console.error('加载竞品数据失败:', error)
  }
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('zh-CN')
}



const addCompetitor = async () => {
  try {
    const response = await mockAddCompetitor(newCompetitor)
    if (response.success) {
      await loadCompetitorData()
      closeDialog()
    }
  } catch (error) {
    console.error('添加竞品失败:', error)
  }
}

const closeDialog = () => {
  showAddDialog.value = false
  // 重置表单
  Object.assign(newCompetitor, {
    name: '',
    website: '',
    industry: '',
    description: '',
    status: 'monitoring' as const,
    addedBy: '当前用户'
  })
}

onMounted(() => {
  loadCompetitorData()
})
</script>

<style scoped>
.competitor-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: block !important;
  visibility: visible !important;
  opacity: 1 !important;
  height: auto !important;
  min-height: 200px;
}

.section-header {
  padding: 24px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
  margin: 0 0 8px 0;
}

.section-description {
  color: #6b7280;
  margin: 0;
}

.panel-content {
  padding: 24px;
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.list-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.add-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: background 0.3s ease;
}

.add-button:hover {
  background: #2563eb;
}

.ranking-table {
  background: white;
  border-radius: 8px;
  overflow-x: auto;
  border: 1px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-content {
  min-width: 800px;
}

.table-header {
  display: grid;
  grid-template-columns: 300px 200px 200px 150px;
  gap: 12px;
  padding: 16px;
  background: #f8fafc;
  font-weight: 600;
  color: #64748b;
  font-size: 13px;
  border-bottom: 1px solid #e2e8f0;
  white-space: nowrap;
}

.table-row {
  display: grid;
  grid-template-columns: 300px 200px 200px 150px;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f1f5f9;
  align-items: center;
  font-size: 13px;
  transition: background-color 0.2s;
}

.table-row:hover {
  background-color: #f8fafc;
}

.table-row:last-child {
  border-bottom: none;
}

.name-col {
  text-align: left;
  min-width: 0;
}

.competitor-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
}

.competitor-name {
  font-weight: 500;
  color: #1f2937;
  font-size: 13px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.competitor-description {
  font-size: 11px;
  color: #6b7280;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.website-col,
.campaign-col,
.time-col {
  text-align: left;
  font-weight: 500;
  white-space: nowrap;
}

.website-link {
  color: #3b82f6;
  text-decoration: none;
  font-size: 12px;
}

.website-link:hover {
  text-decoration: underline;
}

.campaign-time {
  font-size: 12px;
  color: #6b7280;
}

.no-data {
  color: #9ca3af;
}



.dialog-overlay {
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

.dialog-content {
  background: white;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e9ecef;
}

.dialog-header h3 {
  margin: 0;
  color: #333;
  font-size: 18px;
  font-weight: 600;
}

.close-button {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  color: #666;
  padding: 4px;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-button:hover {
  background: #f8f9fa;
  color: #333;
}

.dialog-form {
  padding: 20px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
  font-size: 14px;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-group textarea {
  height: 80px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #e9ecef;
}

.cancel-button,
.submit-button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.cancel-button {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.cancel-button:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

.submit-button {
  background: #3b82f6;
  color: white;
}

.submit-button:hover {
  background: #2563eb;
}

@media (max-width: 1200px) {
  .ranking-table {
    overflow-x: scroll;
  }

  .table-content {
    min-width: 1000px;
  }
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }

  .table-header,
  .table-row {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .dialog-content {
    width: 95%;
    margin: 20px;
  }
}
</style>
