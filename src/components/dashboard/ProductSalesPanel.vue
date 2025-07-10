<template>
  <div class="product-sales-panel">
    <div class="panel-header">
      <h2 class="panel-title">产品销售呈现</h2>
      <p class="panel-description">各产品的销售情况和库存状态</p>
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
      <!-- 子标签页 -->
      <div class="sub-tabs">
        <button
          v-for="subTab in rankingSubTabs"
          :key="subTab.id"
          :class="{ active: activeRankingTab === subTab.id }"
          @click="activeRankingTab = subTab.id"
        >
          {{ subTab.name }}
        </button>
      </div>

      <!-- 品类排名 -->
      <div v-if="activeRankingTab === 'category'" class="ranking-section">
        <div class="ranking-controls">
          <div class="sort-controls">
            <label>排序方式：</label>
            <select v-model="categorySortBy">
              <option value="categorySales">品类销量</option>
              <option value="skuSales">SKU销量</option>
              <option value="outOfStockSales">缺货SKU销售</option>
              <option value="topGrowthSku">销售提升前10SKU</option>
              <option value="topDeclineSku">销售下降前10SKU</option>
              <option value="newMonthSku">本月新SKU销售</option>
            </select>
          </div>
          <div class="filter-controls">
            <label>库存状态：</label>
            <select v-model="categoryStockFilter">
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
                <th>产品标题</th>
                <th>产品类别</th>
                <th>毛销售额</th>
                <th>总销售额</th>
                <th>销售额占比</th>
                <th>净售出商品数</th>
                <th>平均订单金额</th>
                <th>每笔订单的订购数量</th>
                <th>退款金额</th>
                <th>退款数量</th>
                <th>库存状态</th>
                <th>因缺货导致销售额损失</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(category, index) in sortedCategoryRanking" :key="category.id">
                <td>{{ index + 1 }}</td>
                <td>{{ category.name }}</td>
                <td>{{ category.category }}</td>
                <td>${{ formatNumber(category.grossSales) }}</td>
                <td>${{ formatNumber(category.totalSales) }}</td>
                <td>{{ category.salesRatio.toFixed(2) }}%</td>
                <td>{{ formatNumber(category.netSoldQuantity) }}</td>
                <td>${{ category.averageOrderAmount.toFixed(2) }}</td>
                <td>{{ category.quantityPerOrder.toFixed(1) }}</td>
                <td>${{ formatNumber(category.refundAmount) }}</td>
                <td>{{ formatNumber(category.refundQuantity) }}</td>
                <td>
                  <span class="stock-status" :class="category.stockStatus">
                    {{ getStockStatusText(category.stockStatus) }}
                  </span>
                </td>
                <td>${{ formatNumber(category.stockoutLoss) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- 产品SKU排名 -->
      <div v-if="activeRankingTab === 'sku'" class="ranking-section">
        <div class="ranking-controls">
          <div class="sort-controls">
            <label>排序方式：</label>
            <select v-model="skuSortBy">
              <option value="productCategory">产品类别</option>
              <option value="productSku">产品SKU</option>
              <option value="outOfStockSku">缺货SKU</option>
              <option value="decliningSkus">销量下降SKU</option>
              <option value="growingSkus">销售上涨SKU</option>
            </select>
          </div>
          <div class="filter-controls">
            <label>库存状态：</label>
            <select v-model="skuStockFilter">
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
                <th>产品SKU</th>
                <th>产品标题</th>
                <th>产品品类</th>
                <th>毛销售额</th>
                <th>总销售额</th>
                <th>净售出商品数</th>
                <th>平均订单金额</th>
                <th>每笔订单的订购数量</th>
                <th>退款总计</th>
                <th>退款数量</th>
                <th>库存状态</th>
                <th>因缺货导致销售额损失</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in sortedSkuRanking" :key="product.id">
                <td>{{ index + 1 }}</td>
                <td>{{ product.sku }}</td>
                <td>{{ product.name }}</td>
                <td>{{ product.category }}</td>
                <td>${{ formatNumber(product.grossSales) }}</td>
                <td>${{ formatNumber(product.totalSales) }}</td>
                <td>{{ formatNumber(product.netSoldQuantity) }}</td>
                <td>${{ product.averageOrderAmount.toFixed(2) }}</td>
                <td>{{ product.quantityPerOrder.toFixed(1) }}</td>
                <td>${{ formatNumber(product.refundAmount) }}</td>
                <td>{{ formatNumber(product.refundQuantity) }}</td>
                <td>
                  <span class="stock-status" :class="product.stockStatus">
                    {{ getStockStatusText(product.stockStatus) }}
                  </span>
                </td>
                <td>${{ formatNumber(product.stockoutLoss) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
        </div>

    <!-- 产品流量 -->
    <div v-if="activeTab === 'traffic'" class="tab-content">
      <div class="product-traffic-table">
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>产品标题</th>
                <th>产品分类</th>
                <th>总销售额</th>
                <th>净销售额</th>
                <th>净销售数量</th>
                <th>平均订单价值</th>
                <th>退货数量</th>
                <th>退货金额</th>
                <th>每单数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in productSalesData" :key="product.id">
                <td class="product-name">{{ product.name }}</td>
                <td>
                  <span class="category-tag">{{ product.category }}</span>
                </td>
                <td class="number">${{ formatNumber(product.totalSales) }}</td>
                <td class="number">${{ formatNumber(product.totalSales) }}</td>
                <td class="number">{{ formatNumber(product.netSoldQuantity) }}</td>
                <td class="number">${{ formatNumber(product.averageOrderAmount) }}</td>
                <td class="number">{{ formatNumber(product.refundQuantity) }}</td>
                <td class="number">${{ formatNumber(product.refundAmount) }}</td>
                <td class="number">{{ formatNumber(product.quantityPerOrder) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 产品销售数据 -->
    <div v-if="activeTab === 'salesData'" class="tab-content">
      <div class="sales-data-table">
        <div class="data-table">
          <table>
            <thead>
              <tr>
                <th>产品标题</th>
                <th>产品类别</th>
                <th>总销售额</th>
                <th>净销售额</th>
                <th>净销售数量</th>
                <th>平均订单价值</th>
                <th>退货数量</th>
                <th>退货金额</th>
                <th>每笔订单订购数量</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="product in productSalesData" :key="product.id">
                <td class="product-name">{{ product.name }}</td>
                <td>
                  <span class="category-tag">{{ product.category }}</span>
                </td>
                <td class="number">${{ formatNumber(product.totalSales) }}</td>
                <td class="number">${{ formatNumber(product.totalSales) }}</td>
                <td class="number">{{ formatNumber(product.netSoldQuantity) }}</td>
                <td class="number">${{ formatNumber(product.averageOrderAmount) }}</td>
                <td class="number">{{ formatNumber(product.refundQuantity) }}</td>
                <td class="number">${{ formatNumber(product.refundAmount) }}</td>
                <td class="number">{{ formatNumber(product.quantityPerOrder) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- 自定义指标筛选 -->
    <div v-if="activeTab === 'customMetrics'" class="tab-content">
      <div class="custom-metrics-section">
        <div class="metrics-header">
          <h3>自定义数据指标筛选</h3>
          <button class="action-button" @click="openCustomMetricsModal">
            <Settings :size="16" />
            选择指标
          </button>
        </div>

        <!-- 指标类别切换 -->
        <div class="metric-category-tabs">
          <button
            :class="{ active: metricCategory === 'sales' }"
            @click="metricCategory = 'sales'"
          >
            销量指标
          </button>
          <button
            :class="{ active: metricCategory === 'traffic' }"
            @click="metricCategory = 'traffic'"
          >
            流量指标
          </button>
        </div>

        <!-- 自定义指标表格 -->
        <div v-if="selectedMetrics.length > 0" class="custom-metrics-table">
          <div class="data-table">
            <table>
              <thead>
                <tr>
                  <th>产品</th>
                  <th v-for="metricKey in selectedMetrics" :key="metricKey">
                    {{ currentMetrics.find(m => m.key === metricKey)?.label }}
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in productSalesData" :key="product.id">
                  <td class="product-name">{{ product.name }}</td>
                  <td v-for="metricKey in selectedMetrics" :key="metricKey" class="metric-value">
                    {{ formatMetricValue(
                      product[metricKey as keyof typeof product],
                      currentMetrics.find(m => m.key === metricKey)?.unit || ''
                    ) }}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="empty-state">
          <p>请点击"选择指标"按钮来选择要显示的数据指标</p>
        </div>
      </div>
    </div>

    <!-- 自定义指标选择弹窗 -->
    <div v-if="showCustomMetricsModal" class="modal-overlay" @click="closeCustomMetricsModal">
      <div class="modal-content custom-metrics-modal" @click.stop>
        <div class="modal-header">
          <h3>选择自定义指标</h3>
          <button @click="closeCustomMetricsModal" class="close-btn">×</button>
        </div>
        <div class="modal-body">
          <div class="metric-category-selector">
            <label>指标类别：</label>
            <select v-model="metricCategory">
              <option value="sales">销量指标</option>
              <option value="traffic">流量指标</option>
            </select>
          </div>

          <div class="metric-actions">
            <button @click="selectAllMetrics" class="btn btn-secondary">全选</button>
            <button @click="clearAllMetrics" class="btn btn-secondary">清空</button>
          </div>

          <div class="metrics-grid">
            <div
              v-for="metric in currentMetrics"
              :key="metric.key"
              class="metric-item"
            >
              <label>
                <input
                  type="checkbox"
                  :value="metric.key"
                  :checked="selectedMetrics.includes(metric.key)"
                  @change="toggleMetric(metric.key)"
                />
                <span>{{ metric.label }}</span>
                <small v-if="metric.unit">({{ metric.unit }})</small>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button @click="closeCustomMetricsModal" class="btn btn-secondary">取消</button>
          <button @click="closeCustomMetricsModal" class="btn btn-primary">确定</button>
        </div>
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
import { Settings } from 'lucide-vue-next'
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
const activeRankingTab = ref('category')
const sortBy = ref('grossSales')
const stockFilter = ref('all')
const categorySortBy = ref('categorySales')
const categoryStockFilter = ref('all')
const skuSortBy = ref('productCategory')
const skuStockFilter = ref('all')
const trafficSortBy = ref('totalSales')
const trafficCategoryFilter = ref('all')
const selectedCategory = ref('')
const showProductDetails = ref(false)
const selectedProduct = ref<ProductSalesData | null>(null)

// 自定义指标筛选
const showCustomMetricsModal = ref(false)
const selectedMetrics = ref<string[]>([])
const metricCategory = ref<'sales' | 'traffic'>('sales')

// 标签页配置
const tabs = [
  { id: 'ranking', name: '销量排名' },
  { id: 'traffic', name: '产品流量' },
  { id: 'salesData', name: '产品销售数据' },
  { id: 'customMetrics', name: '自定义指标筛选' }
]

const rankingSubTabs = [
  { id: 'category', name: '品类排名' },
  { id: 'sku', name: '产品SKU排名' }
]

// 自定义指标定义
const salesMetrics = [
  { key: 'category', label: '产品类别', unit: '' },
  { key: 'name', label: '产品标题', unit: '' },
  { key: 'grossSales', label: '总销售额(Gross Sales)', unit: '美元' },
  { key: 'netSales', label: '净销售额(Net Sales)', unit: '美元' },
  { key: 'totalSales', label: '总计销售额(TotalSales)', unit: '美元' },
  { key: 'orders', label: '订单', unit: '个' },
  { key: 'averageOrderValue', label: '平均订单价值', unit: '美元' },
  { key: 'ordersPerCustomer', label: '每位客户的订单数', unit: '个' },
  { key: 'quantityPerOrder', label: '每笔订单的订购数量', unit: '个' },
  { key: 'returningCustomerOrders', label: '订单数(回头客)', unit: '个' },
  { key: 'newCustomerOrders', label: '订单数(新客户)', unit: '个' },
  { key: 'orderItemDiscount', label: '订单项目折扣', unit: '美元' },
  { key: 'orderLevelDiscount', label: '订单级折扣', unit: '美元' },
  { key: 'refundQuantity', label: '退货数', unit: '个' },
  { key: 'refundAmount', label: '退货金额', unit: '美元' },
  { key: 'returnRate', label: '退货数量比例', unit: '%' },
  { key: 'returnSalesRatio', label: '退货销售额占比', unit: '%' },
  { key: 'dailySoldUnits', label: '每日售出库存单位数', unit: '个' },
  { key: 'remainingStockDays', label: '剩余库存天数', unit: '天' },
  { key: 'inStockDays', label: '有货的天数', unit: '天' },
  { key: 'outOfStockDays', label: '缺货的天数', unit: '天' },
  { key: 'averageStockDays', label: '在库天数', unit: '天' },
  { key: 'sellThroughRate', label: '售罄率', unit: '%' },
  { key: 'firstStockDate', label: '首次入库日期', unit: '' },
  { key: 'soldStockPercentage', label: '售出库存百分比', unit: '%' },
  { key: 'stockNetDifference', label: '库存单位数净差额(所在地点)', unit: '个' },
  { key: 'endingStockUnits', label: '结束时库存单位数', unit: '个' },
  { key: 'endingStockValue', label: '结束时库存价值', unit: '美元' },
  { key: 'endingRetailValue', label: '结束时库存零售价值', unit: '美元' }
]

const trafficMetrics = [
  { key: 'category', label: '产品类别', unit: '' },
  { key: 'name', label: '产品标题', unit: '' },
  { key: 'visitors', label: '在线商店访客数', unit: '人' },
  { key: 'visits', label: '访问', unit: '次' },
  { key: 'newUsers', label: 'New user', unit: '人' },
  { key: 'returningUsers', label: 'Returning users', unit: '人' },
  { key: 'addToCartVisits', label: '加购访问次数', unit: '次' },
  { key: 'checkoutVisits', label: '到达结账页面的访问次数', unit: '次' },
  { key: 'completeCheckoutVisits', label: '到达并完成结账的访问次数', unit: '次' },
  { key: 'completedCheckoutVisits', label: '完成结账的访问次数', unit: '次' },
  { key: 'averageVisitDuration', label: '平均访问持续时间', unit: '秒' },
  { key: 'bounceCount', label: '跳出量', unit: '次' },
  { key: 'activeSubscriptions', label: '有效订阅', unit: '个' },
  { key: 'addedSubscriptions', label: '已添加订阅', unit: '个' },
  { key: 'canceledSubscriptions', label: '已取消订阅', unit: '个' },
  { key: 'addToCartRate', label: '加购率', unit: '%' },
  { key: 'checkoutCompletionRate', label: '完成结账率', unit: '%' },
  { key: 'checkoutConversionRate', label: '结账转化率', unit: '%' },
  { key: 'conversionRate', label: '转化率', unit: '%' }
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

const sortedCategoryRanking = computed(() => {
  let filtered = productSalesData.value

  if (categoryStockFilter.value !== 'all') {
    filtered = filtered.filter(category => category.stockStatus === categoryStockFilter.value)
  }

  return filtered.sort((a, b) => {
    const aValue = a[categorySortBy.value as keyof ProductSalesData] as number
    const bValue = b[categorySortBy.value as keyof ProductSalesData] as number
    return bValue - aValue
  })
})

const sortedSkuRanking = computed(() => {
  let filtered = productSalesData.value

  if (skuStockFilter.value !== 'all') {
    filtered = filtered.filter(sku => sku.stockStatus === skuStockFilter.value)
  }

  return filtered.sort((a, b) => {
    const aValue = a[skuSortBy.value as keyof ProductSalesData] as number
    const bValue = b[skuSortBy.value as keyof ProductSalesData] as number
    return bValue - aValue
  })
})

const sortedTrafficData = computed(() => {
  let filtered = productSalesData.value

  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category === selectedCategory.value)
  }

  return filtered.sort((a, b) => {
    const aValue = a[trafficSortBy.value as keyof ProductSalesData] as number
    const bValue = b[trafficSortBy.value as keyof ProductSalesData] as number
    return bValue - aValue
  })
})

const categories = computed(() => {
  const uniqueCategories = [...new Set(productSalesData.value.map(product => product.category))]
  return uniqueCategories.sort()
})

// 自定义指标相关计算属性
const currentMetrics = computed(() => {
  return metricCategory.value === 'sales' ? salesMetrics : trafficMetrics
})

const customMetricsData = computed(() => {
  if (selectedMetrics.value.length === 0) return []

  return productSalesData.value.map(product => {
    const result: any = {}
    selectedMetrics.value.forEach(metricKey => {
      const metric = currentMetrics.value.find(m => m.key === metricKey)
      if (metric) {
        result[metricKey] = {
          label: metric.label,
          value: product[metricKey as keyof typeof product] || 0,
          unit: metric.unit
        }
      }
    })
    return result
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

// 排序方法
const sortTrafficBy = (field: string) => {
  trafficSortBy.value = field
}

const getSortClass = (field: string) => {
  if (trafficSortBy.value === field) {
    return 'active'
  }
  return ''
}

// 自定义指标相关方法
const openCustomMetricsModal = () => {
  showCustomMetricsModal.value = true
}

const closeCustomMetricsModal = () => {
  showCustomMetricsModal.value = false
}

const toggleMetric = (metricKey: string) => {
  const index = selectedMetrics.value.indexOf(metricKey)
  if (index > -1) {
    selectedMetrics.value.splice(index, 1)
  } else {
    selectedMetrics.value.push(metricKey)
  }
}

const selectAllMetrics = () => {
  selectedMetrics.value = currentMetrics.value.map(m => m.key)
}

const clearAllMetrics = () => {
  selectedMetrics.value = []
}

const formatMetricValue = (value: any, unit: string) => {
  if (value === null || value === undefined) return '-'

  if (unit === '美元') {
    return `$${Number(value).toLocaleString()}`
  } else if (unit === '%') {
    return `${Number(value).toFixed(2)}%`
  } else if (unit === '秒') {
    const minutes = Math.floor(Number(value) / 60)
    const seconds = Number(value) % 60
    return `${minutes}m ${seconds}s`
  } else {
    return Number(value).toLocaleString()
  }
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
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
}

.panel-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.panel-title {
  margin: 0 0 8px 0;
  font-size: 20px;
  font-weight: 600;
  color: #1f2937;
}

.panel-description {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
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

.sub-tabs {
  display: flex;
  border-bottom: 2px solid #f0f0f0;
  margin-bottom: 20px;
  background: #f8f9fa;
  border-radius: 8px 8px 0 0;
  padding: 4px;
}

.sub-tabs button {
  padding: 10px 20px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #666;
  border-radius: 6px;
  transition: all 0.3s;
  position: relative;
  font-weight: 500;
}

.sub-tabs button.active {
  color: #fff;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.sub-tabs button:hover:not(.active) {
  color: #1890ff;
  background: #fff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sub-tabs button:first-child.active {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  box-shadow: 0 2px 8px rgba(76, 175, 80, 0.3);
}

.sub-tabs button:last-child.active {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
  box-shadow: 0 2px 8px rgba(255, 152, 0, 0.3);
}

.ranking-section {
  margin-top: 20px;
}

.traffic-controls {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 6px;
}

.traffic-controls label {
  font-weight: 500;
  margin-right: 8px;
}

.traffic-controls select {
  padding: 6px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  font-size: 14px;
}

.traffic-table {
  overflow-x: auto;
}

.traffic-table table {
  width: 100%;
  border-collapse: collapse;
}

.traffic-table th,
.traffic-table td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.traffic-table th {
  background: #fafafa;
  font-weight: 500;
  color: #666;
}

.traffic-table .number {
  text-align: right;
  font-weight: 500;
}

.category-tag {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
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

.product-traffic-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.product-traffic-table .data-table {
  overflow-x: auto;
}

.product-traffic-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.product-traffic-table th,
.product-traffic-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.product-traffic-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
}

.product-traffic-table tbody tr:hover {
  background: #f8f9fa;
}

.product-traffic-table .product-name {
  font-weight: 500;
  color: #333;
  min-width: 200px;
}

.product-traffic-table .number {
  text-align: right;
  font-weight: 500;
  color: #333;
}

.product-traffic-table .category-tag {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.sales-data-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.sales-data-table .data-table {
  overflow-x: auto;
}

.sales-data-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.sales-data-table th,
.sales-data-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.sales-data-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
}

.sales-data-table tbody tr:hover {
  background: #f8f9fa;
}

.sales-data-table .product-name {
  font-weight: 500;
  color: #333;
  min-width: 200px;
}

.sales-data-table .number {
  text-align: right;
  font-weight: 500;
  color: #333;
}

.sales-data-table .category-tag {
  background: #e9ecef;
  color: #495057;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.custom-metrics-section {
  padding: 20px 0;
}

.metrics-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.metrics-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.metric-category-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
}

.metric-category-tabs button {
  padding: 8px 16px;
  border: 1px solid #ddd;
  background: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

.metric-category-tabs button.active {
  background: #007bff;
  color: white;
  border-color: #007bff;
}

.metric-category-tabs button:hover {
  background: #e9ecef;
}

.metric-category-tabs button.active:hover {
  background: #0056b3;
}

.action-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid #d1d5db;
  background: white;
  color: #374151;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button:hover {
  background: #f3f4f6;
}

.custom-metrics-table {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.custom-metrics-table .data-table {
  overflow-x: auto;
}

.custom-metrics-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.custom-metrics-table th,
.custom-metrics-table td {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
}

.custom-metrics-table th {
  background: #fafafa;
  font-weight: 600;
  color: #333;
  white-space: nowrap;
  position: sticky;
  top: 0;
  z-index: 1;
}

.custom-metrics-table tbody tr:hover {
  background: #f8f9fa;
}

.custom-metrics-table .product-name {
  font-weight: 500;
  color: #333;
  min-width: 200px;
}

.custom-metrics-table .metric-value {
  text-align: right;
  font-weight: 500;
  color: #333;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #666;
}

.empty-state p {
  margin: 0;
  font-size: 16px;
}

.custom-metrics-modal {
  width: 90%;
  max-width: 800px;
  max-height: 90vh;
}

.metric-category-selector {
  margin-bottom: 20px;
}

.metric-category-selector label {
  font-weight: 500;
  margin-right: 10px;
}

.metric-category-selector select {
  padding: 6px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

.metric-actions {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
  padding: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
}

.metric-item {
  display: flex;
  align-items: center;
}

.metric-item label {
  display: flex;
  align-items: center;
  cursor: pointer;
  font-size: 14px;
  gap: 8px;
}

.metric-item input[type="checkbox"] {
  margin: 0;
}

.metric-item small {
  color: #666;
  font-size: 12px;
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
