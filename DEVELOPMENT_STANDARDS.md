# 艾维数据平台开发规范

## 📁 项目文件结构规范

### 主要目录结构

```
AIwei-Data-Platform-Project-1.0/
├── src/
│   ├── views/              # 页面视图文件（主要开发目录）
│   │   ├── auth/          # 认证相关页面
│   │   ├── dashboard/     # 数据看板页面
│   │   ├── customers/     # 客户管理页面
│   │   ├── settings/      # 系统设置页面
│   │   └── reports/       # 报告页面
│   ├── components/        # 可复用组件
│   │   ├── common/        # 通用组件
│   │   ├── dashboard/     # 看板专用组件
│   │   └── layout/        # 布局组件
│   ├── stores/           # 状态管理
│   ├── router/           # 路由配置
│   ├── mock/             # 模拟数据
│   ├── types/            # TypeScript类型定义
│   ├── utils/            # 工具函数
│   └── assets/           # 静态资源
```

### 🎯 核心开发规范

#### 1. **页面文件存放位置**
- **主要规则**: 所有新页面文件必须放在 `AIwei-Data-Platform-Project-1.0/src/views/` 目录下
- **子目录组织**: 按功能模块创建子文件夹
- **命名规范**: 使用PascalCase命名，以View.vue结尾

#### 2. **功能模块分类**
- `dashboard/` - 数据看板相关页面
- `auth/` - 登录、注册、密码重置等认证页面
- `customers/` - 客户管理相关页面
- `settings/` - 系统设置页面
- `reports/` - 报告和导出功能页面

#### 3. **文件命名约定**
```
✅ 正确示例:
- CustomerGoalsView.vue
- DashboardView.vue
- LoginView.vue
- ThemeView.vue

❌ 错误示例:
- customer-goals.vue
- dashboard.vue
- login.vue
```

## 🔧 技术规范

### Vue 3 开发标准
- 使用 **Composition API** 而非 Options API
- 严格遵循 **TypeScript** 类型约束
- 采用 **Scoped CSS** 进行样式隔离
- 使用 **响应式设计** 适配多设备

### 组件开发规范
```vue
<template>
  <!-- 模板内容 -->
</template>

<script setup lang="ts">
// 导入依赖
import { ref, computed, onMounted } from 'vue'

// 类型定义
interface Props {
  // 属性定义
}

// 组件逻辑
</script>

<style scoped>
/* 组件样式 */
</style>
```

## 📋 文件清理记录

### 2025-01-10 清理操作
- **删除目录**: `src/views/dashboard/` (冗余文件夹)
- **保留目录**: `AIwei-Data-Platform-Project-1.0/src/views/dashboard/` (主开发目录)
- **原因**: 消除重复文件，统一开发规范
- **影响**: 无，所有路由配置已正确指向主目录

### 清理的文件列表
```
src/views/dashboard/AdPlatformOverviewView.vue
src/views/dashboard/BingDashboardView.vue
src/views/dashboard/CompetitorView.vue
src/views/dashboard/CriteoDashboardView.vue
src/views/dashboard/CustomMetricsView.vue
src/views/dashboard/DataExportView.vue
src/views/dashboard/GoogleDashboardView.vue
src/views/dashboard/KOLDataView.vue
src/views/dashboard/MarketDataView.vue
src/views/dashboard/MetaDashboardView.vue
src/views/dashboard/PagePerformanceView.vue
```

## 🚀 开发流程

### 新功能开发步骤
1. **确定功能模块**: 确认属于哪个功能分类
2. **创建页面文件**: 在对应的 `AIwei-Data-Platform-Project-1.0/src/views/` 子目录下创建
3. **配置路由**: 在 `src/router/index.ts` 中添加路由配置
4. **更新菜单**: 在 `src/mock/menu.ts` 中添加菜单项
5. **测试验证**: 确保功能正常工作

### 代码质量要求
- **类型安全**: 所有组件必须有完整的TypeScript类型定义
- **响应式设计**: 必须适配桌面端、平板和移动端
- **性能优化**: 使用懒加载、组件缓存等优化技术
- **代码规范**: 遵循ESLint和Prettier配置

## ⚠️ 重要注意事项

### 禁止操作
- ❌ 不要在项目根目录外创建页面文件
- ❌ 不要直接修改 `src/views/` 以外的页面文件
- ❌ 不要创建重复的功能页面

### 推荐操作
- ✅ 始终在 `AIwei-Data-Platform-Project-1.0/src/views/` 下开发
- ✅ 按功能模块组织文件结构
- ✅ 遵循命名规范和代码标准
- ✅ 及时更新路由和菜单配置

## 📞 支持和维护

如遇到开发问题，请检查：
1. 文件是否在正确的目录下
2. 路由配置是否正确
3. 类型定义是否完整
4. 组件导入路径是否正确

---

**最后更新**: 2025-01-10  
**维护者**: 艾维数据平台开发团队
