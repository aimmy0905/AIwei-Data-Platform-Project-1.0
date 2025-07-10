<template>
  <div class="product-sales-panel">
    <!-- 汇总卡片 -->
    <div class="summary-cards">
      <div class="card">
        <div class="card-header">
          <h3>总产品数</h3>
          <i class="icon-products"></i>
        </div>
        <div class="card-value">{{ summary.totalProducts }}</div>
        <div class="card-change positive">+2 新增</div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>总销售额</h3>
          <i class="icon-sales"></i>
        </div>
        <div class="card-value">${{ formatNumber(summary.totalRevenue) }}</div>
        <div class="card-change positive">+12.5%</div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>总订单数</h3>
          <i class="icon-quantity"></i>
        </div>
        <div class="card-value">{{ formatNumber(summary.totalOrders) }}</div>
        <div class="card-change positive">+8.3%</div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>平均转化率</h3>
          <i class="icon-conversion"></i>
        </div>
        <div class="card-value">{{ summary.averageConversionRate.toFixed(1) }}%</div>
        <div class="card-change positive">+2.1%</div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>平均订单金额</h3>
          <i class="icon-order"></i>
        </div>
        <div class="card-value">${{ summary.averageOrderValue.toFixed(2) }}</div>
        <div class="card-change positive">+5.7%</div>
      </div>

      <div class="card">
        <div class="card-header">
          <h3>最佳产品</h3>
          <i class="icon-star"></i>
        </div>
        <div class="card-value">{{ summary.topSellingProduct }}</div>
        <div class="card-change positive">{{ summary.topCategory }}</div>
      </div>
    </div>

    <!-- 标签页 -->
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </button>
    </div>

    <!-- 销量排名 -->
    <div v-if="activeTab === 'ranking'" class="tab-content">
      <div class="ranking-controls">
        <div class="sort-controls">
          <label>排序方式：</label>
          <select v-model="sortBy">
            <option value="grossSales">毛销售额</option>
            <option value="totalSales">净销售额</option>
            <option value="netSoldQuantity">销量</option>
            <option value="purchaseRate">转化率</option>
            <option value="averageOrderAmount">平均订单金额</option>
          </select>
        </div>
        <div class="filter-controls">
          <label>库存状态：</label>
          <select v-model="stockFilter">
            <option value="all">全部</option>
            <option value="in_stock">有库存</option>
            <option value="low_stock">库存不足</option>
            <option value="out_of_stock">缺货</option>
          </select>
        </div>
      </div>

      <div class="ranking-table">
        <table>
          <thead>
            <tr>
              <th>排名</th>
              <th>产品名称</th>
              <th>毛销售额</th>
              <th>净销售额</th>
              <th>销量</th>
              <th>平均订单金额</th>
              <th>转化率</th>
              <th>库存状态</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(product, index) in sortedProducts" :key="product.id">
              <td>{{ index + 1 }}</td>
              <td>
                <div class="product-info">
                  <div>
                    <div class="product-name">{{ product.name }}</div>
                    <div class="product-sku">SKU: {{ product.sku }}</div>
                  </div>
                </div>
              </td>
              <td>${{ formatNumber(product.grossSales) }}</td>
              <td>${{ formatNumber(product.totalSales) }}</td>
              <td>{{ formatNumber(product.netSoldQuantity) }}</td>
              <td>${{ product.averageOrderAmount.toFixed(2) }}</td>
              <td>{{ product.purchaseRate.toFixed(1) }}%</td>
              <td>
                <span class="stock-status" :class="product.stockStatus">
                  {{ getStockStatusText(product.stockStatus) }}
                </span>
              </td>
              <td>
                <button @click="viewProductDetails(product)" class="btn-view">查看详情</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 产品指标 -->
    <div v-if="activeTab === 'metrics'" class="tab-content">
      <div class="metrics-grid">
        <div class="metric-card">
          <h4>销售指标</h4>
          <div class="metric-items">
            <div class="metric-item">
              <span class="metric-label">总销售额</span>
              <span class="metric-value">${{ formatNumber(summary.totalRevenue) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">平均订单金额</span>
              <span class="metric-value">${{ summary.averageOrderValue.toFixed(2) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">总订单数</span>
              <span class="metric-value">{{ formatNumber(summary.totalOrders) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">退款金额</span>
              <span class="metric-value">${{ formatNumber(summary.totalRefunds) }}</span>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <h4>流量指标</h4>
          <div class="metric-items">
            <div class="metric-item">
              <span class="metric-label">总访客数</span>
              <span class="metric-value">{{ formatNumber(getTotalVisitors()) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">页面浏览量</span>
              <span class="metric-value">{{ formatNumber(getTotalPageViews()) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">新用户数</span>
              <span class="metric-value">{{ formatNumber(getTotalNewUsers()) }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">回访用户数</span>
              <span class="metric-value">{{ formatNumber(getTotalReturningUsers()) }}</span>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <h4>转化指标</h4>
          <div class="metric-items">
            <div class="metric-item">
              <span class="metric-label">平均转化率</span>
              <span class="metric-value">{{ summary.averageConversionRate.toFixed(1) }}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">加购转化率</span>
              <span class="metric-value">{{ getAverageAddToCartRate().toFixed(1) }}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">结账转化率</span>
              <span class="metric-value">{{ getAverageCheckoutRate().toFixed(1) }}%</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">平均浏览时间</span>
              <span class="metric-value">{{ getAverageViewTime().toFixed(1) }}分钟</span>
            </div>
          </div>
        </div>

        <div class="metric-card">
          <h4>库存指标</h4>
          <div class="metric-items">
            <div class="metric-item">
              <span class="metric-label">有库存产品</span>
              <span class="metric-value">{{ getStockCount('in_stock') }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">库存不足产品</span>
              <span class="metric-value">{{ getStockCount('low_stock') }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">缺货产品</span>
              <span class="metric-value">{{ getStockCount('out_of_stock') }}</span>
            </div>
            <div class="metric-item">
              <span class="metric-label">库存健康度</span>
              <span class="metric-value">{{ getStockHealthRate().toFixed(1) }}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 流量指标 -->
    <div v-if="activeTab === 'traffic'" class="tab-content">
      <div class="traffic-overview">
        <div class="traffic-card">
          <h4>访问数据</h4>
          <div class="traffic-stats">
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(getTotalVisitors()) }}</div>
              <div class="stat-label">总访客数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(getTotalVisits()) }}</div>
              <div class="stat-label">访问次数</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(getTotalPageViews()) }}</div>
              <div class="stat-label">页面浏览量</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getAverageBounceRate().toFixed(1) }}%</div>
              <div class="stat-label">跳出率</div>
            </div>
          </div>
        </div>

        <div class="traffic-card">
          <h4>用户类型</h4>
          <div class="traffic-stats">
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(getTotalNewUsers()) }}</div>
              <div class="stat-label">新用户</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ formatNumber(getTotalReturningUsers()) }}</div>
              <div class="stat-label">回访用户</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getNewUserRate().toFixed(1) }}%</div>
              <div class="stat-label">新用户占比</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">{{ getReturningUserRate().toFixed(1) }}%</div>
              <div class="stat-label">回访用户占比</div>
            </div>
          </div>
        </div>
      </div>

      <div class="conversion-funnel">
        <h4>转化漏斗</h4>
        <div class="funnel-steps">
          <div class="funnel-step">
            <div class="step-name">访问</div>
            <div class="step-value">{{ formatNumber(getTotalVisitors()) }}</div>
            <div class="step-rate">100%</div>
          </div>
          <div class="funnel-arrow">→</div>
          <div class="funnel-step">
            <div class="step-name">加购</div>
            <div class="step-value">{{ formatNumber(getTotalAddToCart()) }}</div>
            <div class="step-rate">{{ getAverageAddToCartRate().toFixed(1) }}%</div>
          </div>
          <div class="funnel-arrow">→</div>
          <div class="funnel-step">
            <div class="step-name">结账</div>
            <div class="step-value">{{ formatNumber(getTotalCheckout()) }}</div>
            <div class="step-rate">{{ getAverageCheckoutRate().toFixed(1) }}%</div>
          </div>
          <div class="funnel-arrow">→</div>
          <div class="funnel-step">
            <div class="step-name">购买</div>
            <div class="step-value">{{ formatNumber(summary.totalOrders) }}</div>
            <div class="step-rate">{{ summary.averageConversionRate.toFixed(1) }}%</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 产品详情弹窗 -->
    <div v-if="showProductDetails" class="modal-overlay" @click="closeProductDetails">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>产品详情 - {{ selectedProduct?.name }}</h3>
          <button @click="closeProductDetails" class="close-btn">×</button>
        </div>
        <div class="modal-body" v-if="selectedProduct">
          <div class="product-detail-grid">
            <div class="detail-section">
              <h4>基本信息</h4>
              <div class="detail-item">
                <span class="label">产品名称：</span>
                <span class="value">{{ selectedProduct.name }}</span>
              </div>
              <div class="detail-item">
                <span class="label">SKU：</span>
                <span class="value">{{ selectedProduct.sku }}</span>
              </div>
              <div class="detail-item">
                <span class="label">分类：</span>
                <span class="value">{{ selectedProduct.category }}</span>
              </div>
              <div class="detail-item">
                <span class="label">价格：</span>
                <span class="value">${{ selectedProduct.price }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4>销售数据</h4>
              <div class="detail-item">
                <span class="label">毛销售额：</span>
                <span class="value">${{ formatNumber(selectedProduct.grossSales) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">净销售额：</span>
                <span class="value">${{ formatNumber(selectedProduct.totalSales) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">销量：</span>
                <span class="value">{{ formatNumber(selectedProduct.netSoldQuantity) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">退款金额：</span>
                <span class="value">${{ formatNumber(selectedProduct.refundAmount) }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4>流量数据</h4>
              <div class="detail-item">
                <span class="label">访客数：</span>
                <span class="value">{{ formatNumber(selectedProduct.visitors) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">访问次数：</span>
                <span class="value">{{ formatNumber(selectedProduct.visits) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">加购次数：</span>
                <span class="value">{{ formatNumber(selectedProduct.addToCartVisits) }}</span>
              </div>
              <div class="detail-item">
                <span class="label">结账次数：</span>
                <span class="value">{{ formatNumber(selectedProduct.checkoutVisits) }}</span>
              </div>
            </div>

            <div class="detail-section">
              <h4>转化数据</h4>
              <div class="detail-item">
                <span class="label">加购转化率：</span>
                <span class="value">{{ selectedProduct.addToCartRate }}%</span>
              </div>
              <div class="detail-item">
                <span class="label">结账转化率：</span>
                <span class="value">{{ selectedProduct.checkoutRate }}%</span>
              </div>
              <div class="detail-item">
                <span class="label">购买转化率：</span>
                <span class="value">{{ selectedProduct.purchaseRate }}%</span>
              </div>
              <div class="detail-item">
                <span class="label">平均浏览时间：</span>
                <span class="value">{{ selectedProduct.averageViewTime }}分钟</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { mockGetProductSalesData, mockGetProductSalesSummary } from '@/mock/dashboard'
import type { ProductSalesData, ProductSalesSummary } from '@/types'

// 响应式数据
const productSalesData = ref<ProductSalesData[]>([])
const summary = ref<ProductSalesSummary>({
  totalProducts: 0,
  totalRevenue: 0,
  totalOrders: 0,
  averageOrderValue: 0,
  topSellingProduct: '',
  topCategory: '',
  totalRefunds: 0,
  averageConversionRate: 0
})

// 界面状态
const activeTab = ref('ranking')
const sortBy = ref('grossSales')
const stockFilter = ref('all')
const showProductDetails = ref(false)
const selectedProduct = ref<ProductSalesData | null>(null)

// 标签页配置
const tabs = [
  { id: 'ranking', name: '销量排名' },
  { id: 'metrics', name: '产品指标' },
  { id: 'traffic', name: '流量指标' }
]

// 计算属性
const sortedProducts = computed(() => {
  let filtered = productSalesData.value

  // 库存筛选
  if (stockFilter.value !== 'all') {
    filtered = filtered.filter(product => product.stockStatus === stockFilter.value)
  }

  // 排序
  return filtered.sort((a, b) => {
    const aValue = a[sortBy.value as keyof ProductSalesData] as number
    const bValue = b[sortBy.value as keyof ProductSalesData] as number
    return bValue - aValue
  })
})

// 工具方法
const formatNumber = (num: number): string => {
  return num.toLocaleString()
}

const getStockStatusText = (status: string): string => {
  const statusMap = {
    'in_stock': '有库存',
    'low_stock': '库存不足',
    'out_of_stock': '缺货'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

// 统计方法
const getTotalVisitors = (): number => {
  return productSalesData.value.reduce((sum, product) => sum + product.visitors, 0)
}

const getTotalPageViews = (): number => {
  return productSalesData.value.reduce((sum, product) => sum + product.visits, 0)
}

const getTotalVisits = (): number => {
  return productSalesData.value.reduce((sum, product) => sum + product.visits, 0)
}

const getTotalNewUsers = (): number => {
  return productSalesData.value.reduce((sum, product) => sum + product.newUsers, 0)
}

const getTotalReturningUsers = (): number => {
  return productSalesData.value.reduce((sum, product) => sum + product.returningUsers, 0)
}

const getTotalAddToCart = (): number => {
  return productSalesData.value.reduce((sum, product) => sum + product.addToCartVisits, 0)
}

const getTotalCheckout = (): number => {
  return productSalesData.value.reduce((sum, product) => sum + product.checkoutVisits, 0)
}

const getAverageAddToCartRate = (): number => {
  if (productSalesData.value.length === 0) return 0
  return productSalesData.value.reduce((sum, product) => sum + product.addToCartRate, 0) / productSalesData.value.length
}

const getAverageCheckoutRate = (): number => {
  if (productSalesData.value.length === 0) return 0
  return productSalesData.value.reduce((sum, product) => sum + product.checkoutRate, 0) / productSalesData.value.length
}

const getAverageViewTime = (): number => {
  if (productSalesData.value.length === 0) return 0
  return productSalesData.value.reduce((sum, product) => sum + product.averageViewTime, 0) / productSalesData.value.length
}

const getAverageBounceRate = (): number => {
  if (productSalesData.value.length === 0) return 0
  return productSalesData.value.reduce((sum, product) => sum + product.bounceRate, 0) / productSalesData.value.length
}

const getNewUserRate = (): number => {
  const totalUsers = getTotalVisitors()
  return totalUsers > 0 ? (getTotalNewUsers() / totalUsers) * 100 : 0
}

const getReturningUserRate = (): number => {
  const totalUsers = getTotalVisitors()
  return totalUsers > 0 ? (getTotalReturningUsers() / totalUsers) * 100 : 0
}

const getStockCount = (status: string): number => {
  return productSalesData.value.filter(p => p.stockStatus === status).length
}

const getStockHealthRate = (): number => {
  const totalProducts = productSalesData.value.length
  const inStockProducts = getStockCount('in_stock')
  return totalProducts > 0 ? (inStockProducts / totalProducts) * 100 : 0
}

const viewProductDetails = (product: ProductSalesData) => {
  selectedProduct.value = product
  showProductDetails.value = true
}

const closeProductDetails = () => {
  showProductDetails.value = false
  selectedProduct.value = null
}

// 生命周期
onMounted(async () => {
  try {
    const [salesResponse, summaryResponse] = await Promise.all([
      mockGetProductSalesData(),
      mockGetProductSalesSummary()
    ])

    if (salesResponse.success && salesResponse.data) {
      productSalesData.value = salesResponse.data
    }

    if (summaryResponse.success && summaryResponse.data) {
      summary.value = summaryResponse.data
    }
  } catch (error) {
    console.error('加载产品销售数据失败:', error)
  }
})
</script>

<style scoped>
.product-sales-panel {
  padding: 20px;
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.card {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.card-header h3 {
  margin: 0;
  font-size: 14px;
  color: #666;
}

.card-value {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
}

.card-change {
  font-size: 12px;
}

.card-change.positive {
  color: #52c41a;
}

.card-change.negative {
  color: #f5222d;
}

.tabs {
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 20px;
}

.tabs button {
  padding: 12px 24px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-bottom: 2px solid transparent;
  transition: all 0.3s;
}

.tabs button.active {
  color: #1890ff;
  border-bottom-color: #1890ff;
}

.tabs button:hover {
  color: #1890ff;
}

.tab-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.ranking-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.ranking-controls label {
  font-weight: 500;
  margin-right: 8px;
}

.ranking-controls select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.ranking-table {
  overflow-x: auto;
}

.ranking-table table {
  width: 100%;
  border-collapse: collapse;
}

.ranking-table th,
.ranking-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.ranking-table th {
  background: #fafafa;
  font-weight: 500;
  color: #666;
}

.product-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.product-name {
  font-weight: 500;
  color: #333;
}

.product-sku {
  font-size: 12px;
  color: #999;
}

.stock-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.stock-status.in_stock {
  background: #f6ffed;
  color: #52c41a;
}

.stock-status.low_stock {
  background: #fff7e6;
  color: #fa8c16;
}

.stock-status.out_of_stock {
  background: #fff2f0;
  color: #f5222d;
}

.btn-view {
  padding: 4px 12px;
  border: 1px solid #1890ff;
  background: white;
  color: #1890ff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
}

.btn-view:hover {
  background: #1890ff;
  color: white;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.metric-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.metric-card h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.metric-items {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metric-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
}

.metric-item:last-child {
  border-bottom: none;
}

.metric-label {
  color: #666;
  font-size: 14px;
}

.metric-value {
  font-weight: 500;
  color: #333;
}

.traffic-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.traffic-card {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.traffic-card h4 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
}

.traffic-stats {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #1890ff;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 14px;
  color: #666;
}

.conversion-funnel {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.conversion-funnel h4 {
  margin: 0 0 20px 0;
  color: #333;
  font-size: 16px;
}

.funnel-steps {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.funnel-step {
  flex: 1;
  text-align: center;
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.step-name {
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
}

.step-value {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin-bottom: 4px;
}

.step-rate {
  font-size: 12px;
  color: #1890ff;
  font-weight: 500;
}

.funnel-arrow {
  font-size: 20px;
  color: #999;
  font-weight: bold;
}

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
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-header h3 {
  margin: 0;
  color: #333;
}

.close-btn {
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.close-btn:hover {
  color: #333;
}

.modal-body {
  padding: 20px;
}

.product-detail-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}

.detail-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.detail-section h4 {
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #e8e8e8;
}

.detail-item:last-child {
  border-bottom: none;
}

.detail-item .label {
  color: #666;
  font-size: 14px;
}

.detail-item .value {
  font-weight: 500;
  color: #333;
}

@media (max-width: 768px) {
  .summary-cards {
    grid-template-columns: repeat(2, 1fr);
  }

  .ranking-controls {
    flex-direction: column;
    gap: 10px;
  }

  .ranking-table {
    font-size: 12px;
  }

  .funnel-steps {
    flex-direction: column;
    gap: 20px;
  }

  .funnel-arrow {
    transform: rotate(90deg);
  }

  .traffic-stats {
    grid-template-columns: 1fr;
  }

  .metrics-grid {
    grid-template-columns: 1fr;
  }

  .product-detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
