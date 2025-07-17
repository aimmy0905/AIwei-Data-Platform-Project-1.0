# 客户列表菜单跳转问题修复

## 问题描述
用户点击侧边栏中的"客户列表"菜单项时，无法正确跳转到客户列表页面。

## 问题分析
1. 菜单配置正确：在 `src/mock/menu.ts` 中，客户列表菜单项的路径设置为 `/customers`
2. 路由配置正确：在 `src/router/index.ts` 中，`/customers` 路由指向 `CustomerListView.vue`
3. 页面存在：`src/views/customers/CustomerListView.vue` 文件存在且内容完整

问题可能出现在侧边栏的菜单点击处理逻辑中。

## 修复方案

### 1. 优化菜单点击处理逻辑
在 `src/components/layout/Sidebar.vue` 的 `selectMenu` 方法中：

```typescript
// 特殊处理：如果是客户相关菜单，确保客户管理菜单展开
if (item.id === 'customer-list' || item.path === '/customers' || item.path?.startsWith('/customers')) {
  console.log('🔧 客户菜单点击，确保客户管理菜单展开')
  // 确保客户管理菜单展开
  if (!openMenus.value.includes('customers')) {
    openMenus.value.push('customers')
  }
  
  router.push(item.path).then(() => {
    console.log('🔧 客户菜单路由跳转成功')
  }).catch((error) => {
    console.error('🔧 客户菜单路由跳转失败:', error)
  })
  
  // 设置活跃菜单
  menuStore.setActiveMenu(item.id)
  return
}
```

### 2. 确保菜单状态正确初始化
在组件挂载时，根据当前路径设置菜单状态：

```typescript
// 根据当前路径设置菜单状态
const currentPath = router.currentRoute.value.path
console.log('🔧 当前路径:', currentPath)

// 如果当前在客户相关页面，确保客户管理菜单展开
if (currentPath.startsWith('/customers')) {
  console.log('🔧 当前在客户页面，展开客户管理菜单')
  if (!openMenus.value.includes('customers')) {
    openMenus.value.push('customers')
  }
}
```

## 修复效果

### 预期行为
1. 点击"客户管理"菜单项 → 展开子菜单，显示"客户列表"等选项
2. 点击"客户列表"菜单项 → 跳转到 `/customers` 路径，显示客户列表页面
3. 菜单状态正确更新，"客户列表"菜单项显示为激活状态

### 技术实现
- 使用 Vue Router 的 `push` 方法进行路由跳转
- 通过 `openMenus` 数组管理菜单展开状态
- 使用 `menuStore.setActiveMenu` 设置活跃菜单状态
- 添加错误处理和日志记录

## 测试方法

1. 启动开发服务器：`npm run dev`
2. 访问 `http://localhost:5173/dashboard`
3. 点击侧边栏中的"客户管理"菜单项
4. 验证子菜单是否正确展开
5. 点击"客户列表"菜单项
6. 验证是否正确跳转到客户列表页面

## 相关文件
- `src/components/layout/Sidebar.vue` - 侧边栏组件
- `src/mock/menu.ts` - 菜单配置
- `src/router/index.ts` - 路由配置
- `src/views/customers/CustomerListView.vue` - 客户列表页面
- `src/stores/menu.ts` - 菜单状态管理

## 注意事项
- 确保所有客户相关路径都以 `/customers` 开头
- 菜单展开状态需要与路由状态保持同步
- 添加适当的错误处理和日志记录 