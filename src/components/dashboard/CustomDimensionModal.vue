<template>
  <div v-if="visible" class="modal-overlay" @click="closeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3>自定义数据维度查看</h3>
        <button class="close-btn" @click="closeModal">
          <X :size="20" />
        </button>
      </div>

      <div class="modal-body">
        <!-- 维度选择区域 -->
        <div class="dimension-selector">
          <h4>选择数据维度</h4>
          <div class="dimension-categories">
            <!-- 结果指标 -->
            <div class="dimension-category">
              <div class="category-header">
                <input
                  type="checkbox"
                  :checked="isAllSelected('result')"
                  @change="toggleCategory('result')"
                />
                <label>结果指标</label>
              </div>
              <div class="dimension-items">
                <div
                  v-for="dimension in resultDimensions"
                  :key="dimension.key"
                  class="dimension-item"
                >
                  <input
                    type="checkbox"
                    :value="dimension.key"
                    v-model="selectedDimensions"
                  />
                  <label>{{ dimension.label }}</label>
                </div>
              </div>
            </div>

            <!-- 订单指标 -->
            <div class="dimension-category">
              <div class="category-header">
                <input
                  type="checkbox"
                  :checked="isAllSelected('order')"
                  @change="toggleCategory('order')"
                />
                <label>订单指标</label>
              </div>
              <div class="dimension-items">
                <div
                  v-for="dimension in orderDimensions"
                  :key="dimension.key"
                  class="dimension-item"
                >
                  <input
                    type="checkbox"
                    :value="dimension.key"
                    v-model="selectedDimensions"
                  />
                  <label>{{ dimension.label }}</label>
                </div>
              </div>
            </div>

            <!-- 用户指标 -->
            <div class="dimension-category">
              <div class="category-header">
                <input
                  type="checkbox"
                  :checked="isAllSelected('user')"
                  @change="toggleCategory('user')"
                />
                <label>用户指标</label>
              </div>
              <div class="dimension-items">
                <div
                  v-for="dimension in userDimensions"
                  :key="dimension.key"
                  class="dimension-item"
                >
                  <input
                    type="checkbox"
                    :value="dimension.key"
                    v-model="selectedDimensions"
                  />
                  <label>{{ dimension.label }}</label>
                </div>
              </div>
            </div>

            <!-- 用户漏斗 -->
            <div class="dimension-category">
              <div class="category-header">
                <input
                  type="checkbox"
                  :checked="isAllSelected('funnel')"
                  @change="toggleCategory('funnel')"
                />
                <label>用户漏斗</label>
              </div>
              <div class="dimension-items">
                <div
                  v-for="dimension in funnelDimensions"
                  :key="dimension.key"
                  class="dimension-item"
                >
                  <input
                    type="checkbox"
                    :value="dimension.key"
                    v-model="selectedDimensions"
                  />
                  <label>{{ dimension.label }}</label>
                </div>
              </div>
            </div>

            <!-- 退货指标 -->
            <div class="dimension-category">
              <div class="category-header">
                <input
                  type="checkbox"
                  :checked="isAllSelected('return')"
                  @change="toggleCategory('return')"
                />
                <label>退货指标</label>
              </div>
              <div class="dimension-items">
                <div
                  v-for="dimension in returnDimensions"
                  :key="dimension.key"
                  class="dimension-item"
                >
                  <input
                    type="checkbox"
                    :value="dimension.key"
                    v-model="selectedDimensions"
                  />
                  <label>{{ dimension.label }}</label>
                </div>
              </div>
            </div>

            <!-- 库存指标 -->
            <div class="dimension-category">
              <div class="category-header">
                <input
                  type="checkbox"
                  :checked="isAllSelected('inventory')"
                  @change="toggleCategory('inventory')"
                />
                <label>库存指标</label>
              </div>
              <div class="dimension-items">
                <div
                  v-for="dimension in inventoryDimensions"
                  :key="dimension.key"
                  class="dimension-item"
                >
                  <input
                    type="checkbox"
                    :value="dimension.key"
                    v-model="selectedDimensions"
                  />
                  <label>{{ dimension.label }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 数据展示区域 -->
        <div v-if="selectedDimensions.length > 0" class="data-display">
          <h4>自定义报表</h4>
          <div class="report-table">
            <table>
              <thead>
                <tr>
                  <th>指标</th>
                  <th>数值</th>
                  <th>单位</th>
                  <th>类别</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="dimension in selectedDimensionData" :key="dimension.key">
                  <td>{{ dimension.label }}</td>
                  <td class="value">{{ formatValue(dimension.value, dimension.format) }}</td>
                  <td>{{ dimension.unit }}</td>
                  <td>
                    <span class="category-badge" :class="`category-${dimension.category}`">
                      {{ getCategoryName(dimension.category) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn btn-secondary" @click="closeModal">取消</button>
        <button class="btn btn-primary" @click="exportData" :disabled="selectedDimensions.length === 0">
          导出数据
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { X } from 'lucide-vue-next'
import type { WebsiteData } from '@/types'

interface Props {
  visible: boolean
  data: WebsiteData
}

interface Dimension {
  key: string
  label: string
  category: string
  format: 'number' | 'currency' | 'percentage' | 'time'
  unit: string
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  export: [data: any[]]
}>()

const selectedDimensions = ref<string[]>([])

// 维度定义
const resultDimensions: Dimension[] = [
  { key: 'totalSales', label: '总销售额', category: 'result', format: 'currency', unit: '美元' },
  { key: 'totalCost', label: '总花费', category: 'result', format: 'currency', unit: '美元' },
  { key: 'roi', label: 'ROI', category: 'result', format: 'number', unit: '倍' },
  { key: 'averageOrderItems', label: '订单平均产品数量(AOI)', category: 'result', format: 'number', unit: '个' },
  { key: 'orderConversionCost', label: '订单转化成本', category: 'result', format: 'currency', unit: '美元' },
  { key: 'averageOrderValue', label: '平均订单价值', category: 'result', format: 'currency', unit: '美元' },
  { key: 'conversionRate', label: '转化率', category: 'result', format: 'percentage', unit: '%' },
  { key: 'storeVisits', label: '商店访问次数', category: 'result', format: 'number', unit: '次' },
  { key: 'userVisitCost', label: '用户访问成本', category: 'result', format: 'currency', unit: '美元' }
]

const orderDimensions: Dimension[] = [
  { key: 'orders', label: '订单量', category: 'order', format: 'number', unit: '个' },
  { key: 'orderItemsPerOrder', label: '每笔订单的订购数量', category: 'order', format: 'number', unit: '个' },
  { key: 'ordersPerCustomer', label: '每位客户的订单数', category: 'order', format: 'number', unit: '个' },
  { key: 'returningCustomerOrders', label: '订单数(回头客)', category: 'order', format: 'number', unit: '个' },
  { key: 'newCustomerOrders', label: '订单数(新客户)', category: 'order', format: 'number', unit: '个' }
]

const userDimensions: Dimension[] = [
  { key: 'visitors', label: '在线商店访客数', category: 'user', format: 'number', unit: '人' },
  { key: 'visits', label: '访问次数', category: 'user', format: 'number', unit: '次' },
  { key: 'newUsers', label: '新用户', category: 'user', format: 'number', unit: '人' },
  { key: 'returningUsers', label: '回访用户', category: 'user', format: 'number', unit: '人' },
  { key: 'addToCartVisits', label: '加购访问次数', category: 'user', format: 'number', unit: '次' },
  { key: 'reachCheckoutVisits', label: '到达结账页面的访问次数', category: 'user', format: 'number', unit: '次' },
  { key: 'completeCheckoutVisits', label: '到达并完成结账的访问次数', category: 'user', format: 'number', unit: '次' },
  { key: 'completedCheckoutVisits', label: '完成结账的访问次数', category: 'user', format: 'number', unit: '次' },
  { key: 'averageVisitDuration', label: '平均访问持续时间', category: 'user', format: 'time', unit: '秒' },
  { key: 'bounceCount', label: '跳出量', category: 'user', format: 'number', unit: '次' },
  { key: 'bounceRate', label: '跳出率', category: 'user', format: 'percentage', unit: '%' }
]

const funnelDimensions: Dimension[] = [
  { key: 'addToCartRate', label: '加购率', category: 'funnel', format: 'percentage', unit: '%' },
  { key: 'checkoutCompletionRate', label: '完成结账率', category: 'funnel', format: 'percentage', unit: '%' },
  { key: 'checkoutConversionRate', label: '结账转化率', category: 'funnel', format: 'percentage', unit: '%' }
]

const returnDimensions: Dimension[] = [
  { key: 'returns', label: '退货数', category: 'return', format: 'number', unit: '个' },
  { key: 'returnAmount', label: '退货金额', category: 'return', format: 'currency', unit: '美元' },
  { key: 'returnRate', label: '退货数量比例', category: 'return', format: 'percentage', unit: '%' },
  { key: 'returnSalesRatio', label: '退货销售额占比', category: 'return', format: 'percentage', unit: '%' }
]

const inventoryDimensions: Dimension[] = [
  { key: 'dailySoldUnits', label: '每日售出库存单位数', category: 'inventory', format: 'number', unit: '个' },
  { key: 'remainingStockDays', label: '剩余库存天数', category: 'inventory', format: 'number', unit: '天' },
  { key: 'inStockDays', label: '有货的天数', category: 'inventory', format: 'number', unit: '天' },
  { key: 'outOfStockDays', label: '缺货的天数', category: 'inventory', format: 'number', unit: '天' },
  { key: 'averageStockDays', label: '在库天数', category: 'inventory', format: 'number', unit: '天' },
  { key: 'sellThroughRate', label: '售罄率', category: 'inventory', format: 'percentage', unit: '%' }
]

// 所有维度
const allDimensions = [
  ...resultDimensions,
  ...orderDimensions,
  ...userDimensions,
  ...funnelDimensions,
  ...returnDimensions,
  ...inventoryDimensions
]

// 计算选中维度的数据
const selectedDimensionData = computed(() => {
  return selectedDimensions.value.map(key => {
    const dimension = allDimensions.find(d => d.key === key)
    if (!dimension) return null

    return {
      ...dimension,
      value: props.data[key as keyof WebsiteData]
    }
  }).filter((item): item is NonNullable<typeof item> => item !== null)
})

// 检查某个类别是否全选
const isAllSelected = (category: string) => {
  const categoryDimensions = allDimensions.filter(d => d.category === category)
  return categoryDimensions.every(d => selectedDimensions.value.includes(d.key))
}

// 切换类别选择
const toggleCategory = (category: string) => {
  const categoryDimensions = allDimensions.filter(d => d.category === category)
  const isSelected = isAllSelected(category)

  if (isSelected) {
    // 取消选择该类别的所有维度
    selectedDimensions.value = selectedDimensions.value.filter(key =>
      !categoryDimensions.some(d => d.key === key)
    )
  } else {
    // 选择该类别的所有维度
    const newSelections = categoryDimensions.map(d => d.key)
    selectedDimensions.value = [...new Set([...selectedDimensions.value, ...newSelections])]
  }
}

// 格式化数值
const formatValue = (value: any, format: string) => {
  if (value === null || value === undefined) return '-'

  switch (format) {
    case 'currency':
      return `$${Number(value).toLocaleString()}`
    case 'percentage':
      return `${Number(value).toFixed(2)}%`
    case 'time':
      const minutes = Math.floor(Number(value) / 60)
      const seconds = Number(value) % 60
      return `${minutes}m ${seconds}s`
    default:
      return Number(value).toLocaleString()
  }
}

// 获取类别名称
const getCategoryName = (category: string) => {
  const categoryMap = {
    result: '结果指标',
    order: '订单指标',
    user: '用户指标',
    funnel: '用户漏斗',
    return: '退货指标',
    inventory: '库存指标'
  }
  return categoryMap[category as keyof typeof categoryMap] || category
}

// 关闭弹窗
const closeModal = () => {
  emit('close')
}

// 导出数据
const exportData = () => {
  emit('export', selectedDimensionData.value)
}

// 监听visible变化，重置选择
watch(() => props.visible, (newVisible) => {
  if (newVisible) {
    selectedDimensions.value = []
  }
})
</script>

<style scoped>
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
  width: 90%;
  max-width: 1200px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
}

.close-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: background-color 0.2s;
}

.close-btn:hover {
  background: #f3f4f6;
}

.modal-body {
  padding: 20px;
  overflow-y: auto;
  flex: 1;
}

.dimension-selector h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.dimension-categories {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.dimension-category {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.category-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e5e7eb;
}

.category-header label {
  font-weight: 600;
  cursor: pointer;
}

.dimension-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.dimension-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.dimension-item label {
  cursor: pointer;
  flex: 1;
}

.data-display {
  margin-top: 24px;
}

.data-display h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
}

.report-table {
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  overflow: hidden;
}

.report-table table {
  width: 100%;
  border-collapse: collapse;
}

.report-table th,
.report-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #e5e7eb;
}

.report-table th {
  background: #f9fafb;
  font-weight: 600;
}

.report-table .value {
  font-weight: 600;
  color: #1f2937;
}

.category-badge {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.category-result { background: #dbeafe; color: #1e40af; }
.category-order { background: #dcfce7; color: #16a34a; }
.category-user { background: #fef3c7; color: #d97706; }
.category-funnel { background: #ede9fe; color: #7c3aed; }
.category-return { background: #fee2e2; color: #dc2626; }
.category-inventory { background: #f3e8ff; color: #9333ea; }

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 20px;
  border-top: 1px solid #e5e7eb;
}

.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid transparent;
}

.btn-secondary {
  background: #f3f4f6;
  color: #374151;
  border-color: #d1d5db;
}

.btn-secondary:hover {
  background: #e5e7eb;
}

.btn-primary {
  background: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background: #2563eb;
}

.btn-primary:disabled {
  background: #9ca3af;
  cursor: not-allowed;
}
</style>
