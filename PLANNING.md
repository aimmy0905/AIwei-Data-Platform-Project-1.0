# 艾维数据平台开发规划

## 📋 项目概述

**项目名称**：艾维数据平台管理端  
**技术栈**：Vue.js 3 + TypeScript + Vite + Pinia + Vue Router + Shadcn-Vue + ECharts  
**开发目标**：海外Shopify网站代运营团队数据分析管理工具  
**数据方案**：使用Mock数据演示工作流程

## 🎯 第一阶段：基础用户登录流程

### 1. 用户认证系统
基于 `docs/艾维数据平台产品设计文档/艾维数据平台-管理端-登录功能产品设计文档.md`

#### 登录功能
- 账号密码登录表单
- 表单验证（账号3-50字符，密码6-20字符）
- 模拟登录状态管理（Session 8小时）
- 模拟登录失败限制（5次锁定30分钟）
- 忘记密码流程演示

#### Mock用户数据
```typescript
// 演示用户账号
const mockUsers = [
  { username: 'admin', password: 'admin123', role: 'superAdmin' },
  { username: 'manager', password: 'manager123', role: 'manager' },
  { username: 'staff', password: 'staff123', role: 'staff' }
]
```

### 2. 登录后界面设计

#### 侧边栏菜单结构
```
📊 数据看板
├── 📈 概览看板
├── 🎯 客户目标  
├── 🌐 网站数据
├── 📊 渠道数据
├── 🎪 活动数据
├── 📦 产品销售
├── 👥 红人数据
├── 🌍 地区市场
├── 📄 页面表现
├── 🔍 竞品分析
└── 📱 广告数据

👥 客户管理
├── 📋 客户列表
├── 📊 客户数据
├── 💰 服务费管理
└── ⭐ 客户评价

🏢 部门管理
├── 🏗️ 组织架构
├── 👤 员工管理
├── 📊 绩效考核
└── 🎯 目标设置

📊 业绩管理
├── 📈 业绩看板
├── 📝 周报月报
└── 📊 项目管理

⚙️ 系统设置
├── 👤 用户管理
├── 🔐 权限设置
├── 🎨 主题设置
└── 🔧 系统配置
```

### 3. Mock数据系统

#### Mock数据结构
```
src/mock/
├── index.ts           # Mock数据入口
├── auth.ts            # 认证相关Mock
├── dashboard.ts       # 数据看板Mock
├── customers.ts       # 客户数据Mock
├── departments.ts     # 部门数据Mock
├── performance.ts     # 业绩数据Mock
└── settings.ts        # 设置数据Mock
```

#### 示例Mock数据
```typescript
// 客户数据
export const mockCustomers = [
  { id: 1, name: 'Shopify客户A', revenue: 150000, roi: 3.2 },
  { id: 2, name: 'Shopify客户B', revenue: 280000, roi: 4.1 },
  { id: 3, name: 'Shopify客户C', revenue: 95000, roi: 2.8 }
]

// 渠道数据
export const mockChannels = [
  { name: 'Google Ads', revenue: 80000, users: 12500 },
  { name: 'Facebook Ads', revenue: 65000, users: 8900 },
  { name: 'Direct Traffic', revenue: 45000, users: 6200 }
]
```

### 4. 主题系统

#### 可定制主题CSS
```
src/assets/theme/
├── index.ts           # 主题配置入口
├── colors.ts          # 色彩定义
├── light.css          # 浅色主题
├── dark.css           # 深色主题
└── variables.css      # CSS变量定义
```

#### 主题色彩变量
```css
:root {
  --primary-color: #1890ff;
  --primary-hover: #40a9ff;
  --success-color: #52c41a;
  --warning-color: #faad14;
  --error-color: #f5222d;
  --background-color: #f5f5f5;
  --text-primary: #262626;
  --text-secondary: #8c8c8c;
  --border-color: #d9d9d9;
}
```

### 5. 占位符页面

每个菜单项创建基础占位符页面，展示Mock数据：
```vue
<template>
  <div class="page-container">
    <div class="page-header">
      <h1>{{ pageTitle }}</h1>
      <p>{{ pageDescription }}</p>
    </div>
    <div class="page-content">
      <!-- 展示相关Mock数据 -->
      <div class="mock-data-display">
        <h3>演示数据</h3>
        <pre>{{ JSON.stringify(mockData, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>
```

## 🛠️ 技术配置

### 依赖包
- ✅ @vueuse/core - Vue组合工具
- ✅ shadcn-vue - 主题设计组件
- ✅ lucide-vue-next - 图标库
- ✅ vue-echarts + echarts - 图表组件

### 路由配置
- 使用 `name` 进行路由跳转（不使用 `path`）
- 路由守卫实现权限控制
- 动态路由加载

### 状态管理
- Pinia 管理用户状态
- 主题状态管理
- 权限状态管理
- Mock数据状态管理

## 🎨 设计规范

### 命名规范
- 组件：PascalCase (UserProfile.vue)
- 页面：PascalCase + View (DashboardView.vue)
- 路由名称：kebab-case (user-profile)
- 函数：camelCase (getUserInfo)

### 文件结构
```
src/
├── assets/           # 静态资源
├── components/       # 可复用组件
├── views/           # 页面组件
├── stores/          # Pinia状态管理
├── router/          # 路由配置
├── composables/     # 组合式API
├── utils/           # 工具函数
├── mock/            # Mock数据
└── types/           # TypeScript类型
```

## 🔐 权限系统

### 用户角色
- 超级管理员：全部权限
- 部门管理员：部门数据权限
- 运营经理：团队数据权限
- 运营专员：个人数据权限

### Mock权限演示
```typescript
// 不同角色看到不同的菜单和数据
const rolePermissions = {
  superAdmin: ['all'],
  manager: ['dashboard', 'customers', 'performance'],
  staff: ['dashboard', 'my-customers']
}
```

## 📊 演示工作流程

### 1. 登录流程
1. 输入演示账号（admin/admin123）
2. 模拟登录验证
3. 跳转到数据看板

### 2. 数据展示
1. 侧边栏显示所有功能模块
2. 点击任意菜单项
3. 展示相应的Mock数据
4. 支持主题切换

### 3. 交互演示
1. 客户筛选器（Mock客户列表）
2. 时间范围选择器
3. 数据图表展示（ECharts）
4. 权限控制演示

## 📝 开发约定

### 代码规范
- ESLint + Prettier 格式化
- TypeScript 严格模式
- 组件Props类型定义
- Mock数据类型定义

### Git规范
- feature/功能名称
- fix/bug描述
- docs/文档更新
- style/样式调整

---

**开发优先级**：
1. 基础用户登录流程 ✅
2. Mock数据系统 ⏳
3. 主布局和侧边栏 ⏳
4. 主题系统 ⏳
5. 占位符页面 ⏳
6. 数据展示演示 ⏳