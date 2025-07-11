# 菜单导航调试指南

## 问题描述
点击侧边栏的"广告数据"和"Google数据"菜单项时，没有成功跳转到对应页面。

## 调试步骤

### 1. 打开浏览器开发者工具
- 按F12打开开发者工具
- 切换到Console标签页

### 2. 访问页面
- 访问 http://localhost:5180
- 如果没有登录，先登录系统

### 3. 查看控制台输出
应该看到以下调试信息：
```
Loading menu for authenticated user with role: [用户角色]
Loading menu for role: [用户角色]
Menu loaded successfully: [菜单数据]
Visible menu items: [可见菜单项]
```

### 4. 测试菜单点击
1. 点击"广告数据"菜单项
   - 应该看到: `Toggling submenu for: ad-data`
   - 子菜单应该展开显示

2. 点击"Google数据"菜单项
   - 应该看到: `Menu item selected: [菜单项数据]`
   - 应该看到: `Navigating to route: google-dashboard`
   - 页面应该跳转到Google数据看板

### 5. 常见问题排查

#### 问题1: 菜单数据没有加载
如果看不到"Menu loaded successfully"，可能是：
- 用户认证状态有问题
- 菜单数据加载失败

#### 问题2: 点击没有响应
如果点击菜单项没有控制台输出，可能是：
- 点击事件没有绑定
- 组件渲染有问题

#### 问题3: 路由跳转失败
如果看到"Navigation failed"错误，可能是：
- 路由配置问题
- 组件文件缺失

## 手动测试命令

在浏览器控制台中执行以下命令进行手动测试：

```javascript
// 检查菜单数据
console.log('Menu items:', window.Vue?.config?.globalProperties?.$menuStore?.menuItems)

// 检查当前路由
console.log('Current route:', window.Vue?.config?.globalProperties?.$router?.currentRoute?.value)

// 手动导航到Google数据页面
window.Vue?.config?.globalProperties?.$router?.push('/dashboard/google-dashboard')
```

## 预期结果
- 点击"广告数据"应该展开子菜单
- 点击"Google数据"应该跳转到 `/dashboard/google-dashboard`
- 页面应该显示Google数据看板内容
- 侧边栏菜单应该高亮显示当前活跃项目 