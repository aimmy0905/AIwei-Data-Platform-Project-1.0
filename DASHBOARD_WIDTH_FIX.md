# DashboardView宽度对齐修复

## 问题描述
DashboardView的宽度与MainLayout不一致，导致页面布局不统一。

## 问题分析
- MainLayout的容器设置了`max-width: 1200px`和`margin: 0 auto`来居中内容
- DashboardView的`.dashboard-content`没有遵循相同的宽度约束
- 筛选器组件也没有与MainLayout保持一致的宽度

## 修复方案

### 1. 修复DashboardView内容宽度
```css
.dashboard-content {
  padding-top: 200px;
  max-width: 1200px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}
```

### 2. 修复筛选器宽度（重新设计）
由于筛选器使用`position: fixed`，它脱离了正常文档流，不受MainLayout容器约束。
```css
.dashboard-filter-sticky {
  position: fixed;
  top: var(--header-height, 60px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
  background: white;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  transition: all var(--duration-normal);
  max-width: 1200px;
  width: calc(100vw - var(--sidebar-width, 260px));
  padding-left: 20px;
  padding-right: 20px;
}
```

### 3. 修复侧边栏折叠状态
```css
.main-layout--collapsed .dashboard-filter-sticky {
  width: calc(100vw - var(--sidebar-collapsed-width, 80px));
}
```

### 4. 修复移动端适配
```css
@media (max-width: 768px) {
  .dashboard-filter-sticky {
    left: 50%;
    transform: translateX(-50%);
    width: 100vw;
    max-width: none;
    padding-left: 10px;
    padding-right: 10px;
  }
}
```

### 5. 确保所有媒体查询中的一致性
在所有媒体查询中都保持相同的宽度约束：
```css
@media (max-width: 768px) {
  .dashboard-content {
    padding-top: 170px;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
  }
}

@media (max-width: 480px) {
  .dashboard-content {
    padding-top: 160px;
    max-width: 1200px;
    margin: 0 auto;
    padding-left: 20px;
    padding-right: 20px;
  }
}
```

## 修复效果
- ✅ DashboardView的内容现在与MainLayout保持一致的最大宽度(1200px)
- ✅ 内容在页面中居中显示，不再延伸到页面边缘
- ✅ 筛选器组件也与页面内容对齐，使用居中定位
- ✅ 在大屏幕上不会过度拉伸，在小屏幕上能正常响应
- ✅ 侧边栏折叠/展开状态下筛选器宽度正确调整
- ✅ 移动端适配良好，筛选器在小屏幕上占满宽度

## 技术说明
- 使用`max-width: 1200px`限制最大宽度
- 对于固定定位的筛选器，使用`left: 50%`和`transform: translateX(-50%)`实现居中
- 使用`calc()`函数动态计算筛选器宽度，考虑侧边栏宽度
- 添加左右内边距确保内容不会贴边
- 保持与MainLayout容器相同的样式约束
- 在所有媒体查询中保持一致的宽度约束规则

## 关键问题解决
1. **固定定位元素的居中问题**：筛选器使用`position: fixed`脱离了文档流，需要特殊处理
2. **响应式宽度计算**：考虑侧边栏折叠状态，动态计算可用宽度
3. **媒体查询一致性**：确保所有断点下都应用相同的宽度约束 