# Bing Dashboard 样式修复

## 问题描述
用户反馈Bing数据看板的模块样式存在问题，主要集中在图表容器的样式不一致。

## 修复内容

### 1. 图表网格布局优化
- **最小宽度调整**: 从 `400px` 增加到 `500px`，确保图表有足够的显示空间
- **间距优化**: 从 `24px` 增加到 `40px`，提升视觉层次感

### 2. 图表容器样式统一
- **背景色**: 统一使用白色背景 (`white`)
- **圆角**: 增加到 `12px` 提升现代感
- **内边距**: 增加到 `28px` 提供更好的内容空间
- **边框**: 使用更柔和的 `#e5e7eb` 颜色
- **阴影**: 添加柔和的阴影效果 `0 2px 8px rgba(0, 0, 0, 0.06)`
- **最小高度**: 设置为 `480px` 确保图表有充足的显示空间
- **悬停效果**: 添加悬停时的阴影和位移效果

### 3. 图表标题样式改进
- **字体大小**: 从 `14px` 增加到 `16px`
- **颜色**: 使用更深的 `#1f2937` 提升可读性
- **边距**: 优化为 `0 0 20px 0`
- **底部边框**: 添加 `2px solid #f3f4f6` 分隔线
- **移除排序**: 去掉 `order` 属性，恢复自然顺序

### 4. 图表内容区域优化
- **弹性布局**: 使用 `flex: 1` 占满剩余空间
- **居中对齐**: 添加 `align-items: center` 和 `justify-content: center`
- **移除固定高度**: 去掉 `height: 300px`，改为自适应

### 5. 子图表网格间距统一
- **间距调整**: 将 `charts-subsection` 中的图表间距也调整为 `40px`

## 修改的文件
- `src/components/dashboard/BingDashboardPanel.vue`

## 样式一致性
现在Bing Dashboard的图表样式与其他Dashboard组件（如Google Dashboard）保持一致，提供统一的用户体验。

## 测试建议
1. 访问 `http://localhost:5175/dashboard/bing-dashboard`
2. 检查"收入、花费、客单价趋势图"和"销量、ROAS趋势图"的显示效果
3. 验证图表容器的悬停效果
4. 确认在不同屏幕尺寸下的响应式表现 