# 广告数据总览模块样式统一修改

## 修改目标
将广告数据总览模块的UI样式与地区市场模块保持一致，确保整个数据平台的视觉风格统一。

## 主要修改内容

### 1. 容器样式统一
- **背景色**: 统一为 `white`
- **边框圆角**: 统一为 `8px`
- **阴影**: 统一为 `0 2px 4px rgba(0, 0, 0, 0.1)`
- **添加**: 强制显示属性确保组件正常渲染

### 2. 标题和描述样式统一
- **标题颜色**: 统一为 `#1f2937`
- **描述颜色**: 统一为 `#6b7280`
- **内边距**: 统一为 `24px`
- **添加**: 底部边框分隔线

### 3. 统计卡片样式统一
- **背景色**: 统一为 `#f8fafc`
- **边框**: 添加 `1px solid #f1f5f9`
- **悬停效果**: 添加颜色变化和轻微上移动画
- **图标和文字颜色**: 统一使用标准颜色值

### 4. 平台卡片样式统一
- **背景和边框**: 与统计卡片保持一致
- **状态标签**: 统一颜色方案
- **ROAS显示**: 改为带背景色的标签样式
- **图表区域**: 添加白色背景和边框

### 5. 表格样式统一
- **表头背景**: 统一为 `#f8fafc`
- **表头文字**: 统一为 `#64748b`
- **行悬停**: 统一为 `#f8fafc`
- **边框**: 统一使用 `#e5e7eb` 和 `#f1f5f9`

### 6. 洞察卡片样式统一
- **背景和边框**: 与其他卡片保持一致
- **悬停效果**: 添加一致的动画效果
- **图标颜色**: 统一颜色方案
- **文字颜色**: 统一使用标准颜色值

### 7. 响应式设计优化
- **平板设备**: 优化网格布局
- **手机设备**: 简化布局，优化间距

## 颜色方案统一

### 主要颜色
- **主文字**: `#1f2937`
- **次要文字**: `#6b7280`
- **背景色**: `white`
- **卡片背景**: `#f8fafc`
- **边框**: `#e5e7eb`, `#f1f5f9`

### 状态颜色
- **成功/活跃**: `#059669`
- **警告**: `#d97706`
- **危险**: `#dc2626`
- **信息**: `#3b82f6`

### 标签背景色
- **成功**: `#dcfce7`
- **警告**: `#fef3c7`
- **危险**: `#fee2e2`
- **信息**: `#dbeafe`

## 修改后的效果
1. **视觉一致性**: 所有模块现在使用相同的设计语言
2. **用户体验**: 统一的交互效果和视觉反馈
3. **可维护性**: 标准化的样式便于后续维护
4. **专业性**: 整体界面更加专业和统一

## 文件位置
- 修改文件: `src/components/dashboard/AdPlatformOverviewPanel.vue`
- 参考文件: `src/components/dashboard/MarketDataPanel.vue`

这次修改确保了广告数据总览模块与地区市场模块在视觉上完全一致，提升了整个数据平台的用户体验。 