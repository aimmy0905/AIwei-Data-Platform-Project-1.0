# 菜单交互测试指南

## 预期交互效果

### 1. 点击"广告数据"菜单项
- **期望行为**: 跳转到数据看板页面，并锚点定位到广告数据总览模块
- **技术实现**: 
  - 导航到 `/dashboard` 路由
  - 滚动到 `#ad-platform-overview` 锚点
  - 展开子菜单显示各平台选项
  - 显示 `AdPlatformOverviewPanel.vue` 组件内容

### 2. 点击"Google数据"菜单项
- **期望行为**: 跳转到独立的Google数据看板详情页
- **技术实现**:
  - 导航到 `/dashboard/google-dashboard` 路由
  - 显示 `GoogleDashboardView.vue` 页面
  - 包含 `GoogleDashboardPanel.vue` 组件内容

## 测试步骤

### 测试1: 广告数据菜单点击
1. 访问 http://localhost:5180/dashboard
2. 点击侧边栏的"广告数据"菜单项
3. **验证结果**:
   - 页面应该滚动到广告数据总览部分
   - 子菜单应该展开显示 Google、Meta、Bing、Criteo 选项
   - 地址栏应该显示 `/dashboard`
   - 页面应该显示广告数据总览表格和图表

### 测试2: Google数据菜单点击
1. 在广告数据子菜单展开的状态下
2. 点击"Google数据"菜单项
3. **验证结果**:
   - 页面应该跳转到新的Google数据看板页面
   - 地址栏应该显示 `/dashboard/google-dashboard`
   - 页面应该显示Google广告的详细数据
   - 侧边栏应该高亮显示"Google数据"项

## 控制台调试信息

在浏览器控制台中应该看到：

**点击"广告数据"时**:
```
Menu item selected: {id: 'ad-data', name: '广告数据', path: '/dashboard/ad-platform-overview', ...}
```

**点击"Google数据"时**:
```
Menu item clicked: google-dashboard Google数据
Menu item selected: {id: 'google-dashboard', name: 'Google数据', path: '/dashboard/google-dashboard', ...}
Navigating to route: google-dashboard
```

## 页面内容验证

### 广告数据总览页面内容
- 全平台广告数据汇总表格
- 各平台的花费、ROAS、转化率等指标
- 花费占比饼图
- 点击率对比图表

### Google数据看板页面内容
- Google广告账户概览
- 广告周数据统计
- 日投放数据表格
- 广告形式和类型分析
- 关键词和受众表现数据

## 故障排除

如果功能不正常，请检查：

1. **控制台错误**: 查看是否有JavaScript错误
2. **路由配置**: 确认路由是否正确配置
3. **菜单数据**: 确认菜单配置是否正确加载
4. **组件渲染**: 确认相关组件是否正确渲染

## 成功标准

✅ 点击"广告数据"正确跳转到数据看板的广告数据部分
✅ 点击"Google数据"正确跳转到独立的Google数据页面
✅ 菜单状态正确同步
✅ 页面内容正确显示
✅ 无控制台错误 