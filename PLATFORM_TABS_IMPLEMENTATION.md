# 平台Tab功能实现总结

## 实现目标
在全平台广告数据标题旁边添加四个平台Tab按钮（Google、Meta、Bing、Criteo），点击可跳转到对应的二级详情页。

## 实现内容

### 1. HTML结构调整
- 将原有的单独标题改为包含标题和Tab按钮的组合布局
- 添加 `section-header-with-tabs` 容器，使用 flexbox 布局
- 添加 `platform-tabs` 容器包含四个平台按钮

### 2. 平台Tab数据
创建了 `platformTabs` 数据数组：
```javascript
const platformTabs = ref([
  { key: 'google', name: 'Google' },
  { key: 'meta', name: 'Meta' },
  { key: 'bing', name: 'Bing' },
  { key: 'criteo', name: 'Criteo' }
])
```

### 3. 导航功能
实现了 `navigateToPlatform` 函数：
- 定义了各平台对应的路由映射
- 目前使用 console.log 输出，可扩展为真实的路由跳转
- 支持的路由：
  - Google: `/dashboard/google`
  - Meta: `/dashboard/meta`
  - Bing: `/dashboard/bing`
  - Criteo: `/dashboard/criteo`

### 4. 样式设计

#### 基础样式
- **布局**：使用 flexbox 实现标题和Tab按钮的左右布局
- **间距**：Tab按钮之间使用 8px 间距
- **基础样式**：白色背景，灰色边框，圆角设计

#### 平台特色样式
每个平台按钮都有对应的品牌色：
- **Google**: #4285f4 (蓝色)
- **Meta**: #1877f2 (深蓝色)
- **Bing**: #00809d (青色)
- **Criteo**: #ff6900 (橙色)

#### 交互效果
- **悬停效果**：背景色变化，边框色加深，轻微上移动画
- **点击反馈**：过渡动画流畅
- **视觉层次**：使用品牌色突出平台特色

### 5. 响应式设计
- **移动端适配**：小屏幕下标题和Tab按钮垂直排列
- **Tab按钮换行**：空间不足时自动换行
- **字体大小调整**：移动端使用更小的字体和内边距

## 技术特点

### 1. 组件化设计
- 使用 Vue 3 Composition API
- 数据驱动的Tab渲染
- 可扩展的导航系统

### 2. 用户体验
- 清晰的视觉层次
- 直观的平台识别
- 流畅的交互动画

### 3. 可维护性
- 统一的样式命名
- 模块化的CSS结构
- 易于扩展的路由配置

## 后续扩展

### 1. 路由集成
可以集成 Vue Router 实现真实的页面跳转：
```javascript
import { useRouter } from 'vue-router'
const router = useRouter()

const navigateToPlatform = (platform: string): void => {
  const routeMap = {
    'google': '/dashboard/google',
    'meta': '/dashboard/meta',
    'bing': '/dashboard/bing',
    'criteo': '/dashboard/criteo'
  }
  router.push(routeMap[platform])
}
```

### 2. 活跃状态
可以添加当前活跃Tab的状态管理：
```javascript
const activeTab = ref('')
```

### 3. 数据预加载
可以在Tab切换时预加载对应平台的数据。

## 访问方式

用户可以在 `http://localhost:5179/dashboard` 的广告数据总览模块中看到新增的平台Tab按钮，点击可触发导航功能（目前在控制台输出）。 