# 广告数据总览模块汇总行实现

## 实现目标
在广告数据总览模块的数据表格中添加一个汇总行，汇总所有平台的数据信息，账户名称列保持为空。

## 实现内容

### 1. 添加汇总行HTML结构
在表格的 `<tbody>` 中添加了一个汇总行：
- 第一列显示"汇总"标签
- 第二列（账户名称）保持为空
- 其他列显示相应的汇总数据

### 2. 添加汇总数据计算逻辑
创建了 `summaryData` 计算属性来计算汇总数据：

**累计数据**：
- 总花费 (totalSpend)
- 总收入 (totalRevenue)
- 总购物数 (totalPurchases)
- 总展示次数 (totalImpressions)
- 总点击量 (totalClicks)
- 总观看次数 (totalViews)

**平均数据**：
- 平均ROAS (avgRoas)：总收入 / 总花费
- 平均CPA (avgCpa)：总花费 / 总购物数
- 平均购物转化价值 (avgPurchaseValue)：总收入 / 总购物数
- 平均转化率 (avgConversionRate)：(总购物数 / 总点击量) × 100
- 平均千次展示成本 (avgCpm)：(总花费 / 总展示次数) × 1000
- 平均点击率 (avgCtr)：(总点击量 / 总展示次数) × 100
- 平均单次点击成本 (avgCpc)：总花费 / 总点击量

### 3. 添加汇总行样式
为汇总行添加了特殊的样式：
- 背景色：浅灰色 (#f8fafc)
- 顶部边框：2px 实线边框用于分隔
- 字体加粗：所有数据都使用粗体显示
- 悬停效果：鼠标悬停时背景色变化

### 4. 数据格式化
汇总行中的数据使用与其他行相同的格式化函数：
- 货币格式：使用 `formatNumber` 函数
- 百分比格式：显示百分号
- ROAS 格式：显示倍数并应用颜色样式

## 技术细节

### 计算属性实现
```javascript
const summaryData = computed(() => {
  const data = platformData.value
  const totalSpend = data.reduce((sum, platform) => sum + platform.spend, 0)
  const totalRevenue = data.reduce((sum, platform) => sum + platform.revenue, 0)
  // ... 其他计算逻辑
  
  return {
    totalSpend,
    totalSpendRatio: 100,
    avgRoas,
    totalRevenue,
    // ... 其他汇总数据
  }
})
```

### 样式实现
```css
.summary-row {
  background-color: #f8fafc !important;
  border-top: 2px solid #e2e8f0;
}

.summary-row td {
  font-weight: 600;
  color: #1f2937;
  border-bottom: none;
}
```

## 用户体验提升

1. **视觉区分**：汇总行通过不同的背景色和边框与普通数据行区分开来
2. **数据一致性**：汇总行使用与其他行相同的数据格式和样式
3. **易于理解**：汇总行清晰地显示所有平台的总体表现
4. **响应式设计**：汇总行在不同屏幕尺寸下都能正常显示

## 访问方式

用户可以在 `http://localhost:5178/dashboard` 的广告数据总览模块中查看新增的汇总行，它将显示在所有平台数据的底部，提供完整的数据汇总信息。 