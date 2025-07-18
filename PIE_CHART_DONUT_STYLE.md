# 饼图环形样式修改

## 修改目标
根据用户提供的截图，将饼图修改为环形图（甜甜圈图）样式，并启用外部标签显示。

## 主要修改

### 1. 环形图样式
- **半径设置**: 改为 `['40%', '70%']` 创建环形效果
- **内圈**: 40% 半径的空心圆
- **外圈**: 70% 半径的外边界
- **环形效果**: 中间空心，外围显示数据

### 2. 外部标签启用
- **显示状态**: `show: true` 启用外部标签
- **位置**: `position: 'outside'` 标签显示在饼图外部
- **字体大小**: 12px 清晰可读
- **颜色**: `#666` 灰色文字
- **格式**: `名称  数值 (百分比%)`

### 3. 标签连接线
- **显示状态**: `show: true` 启用连接线
- **第一段长度**: `length: 10` 从饼图到折点
- **第二段长度**: `length2: 10` 从折点到标签
- **线条颜色**: `#999` 浅灰色

### 4. 图例简化
- **格式**: `名称                                             $数值`
- **移除百分比**: 外部标签已显示百分比，图例只显示名称和金额
- **对齐**: 使用空格实现左右对齐效果

## 技术配置

### 饼图参数
```javascript
radius: ['40%', '70%']  // 环形图
center: ['50%', '40%']  // 中心位置
```

### 外部标签
```javascript
label: {
  show: true,
  position: 'outside',
  fontSize: 12,
  color: '#666',
  formatter: (params) => `${params.name}  ${formatValue(params.value)} (${params.percent}%)`
}
```

### 连接线
```javascript
labelLine: {
  show: true,
  length: 10,
  length2: 10,
  lineStyle: { color: '#999' }
}
```

### 图例格式
```javascript
formatter: (name) => {
  const value = formatValue(item.value)
  return `${name}                                             $${value}`
}
```

## 显示效果
- ✅ 环形图样式（甜甜圈图）
- ✅ 外部标签显示详细信息
- ✅ 连接线连接饼图和标签
- ✅ 图例显示名称和金额
- ✅ 信息层次清晰分明

## 布局结构
```
┌─────────────────────┐
│                     │
│    外部标签         │
│       ↗             │
│   ○ ═══ 环形图      │ 饼图区域
│       ↘             │
│    外部标签         │
│                     │
├─────────────────────┤
│ ● 名称      $金额   │ 图例区域
│ ● 名称      $金额   │
└─────────────────────┘
```

## 修改的文件
- `src/components/charts/PieChart.vue`

## 预期效果
- 环形图样式美观
- 外部标签信息完整
- 图例简洁清晰
- 整体布局协调
- 符合截图要求 