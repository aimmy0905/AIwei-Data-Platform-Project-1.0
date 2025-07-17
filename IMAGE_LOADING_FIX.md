# 图片加载问题修复

## 问题描述
在Bing数据看板的素材表现部分，图片无法正常加载显示。

## 问题原因
1. **路径错误**: mock数据中的图片路径使用了错误的 `/public/` 前缀
2. **文件缺失**: `public/creative-samples/` 目录和相关图片文件不存在

## 解决方案

### 1. 修复图片路径
在 `src/mock/bing-dashboard.ts` 文件中，将所有图片路径从：
```typescript
image: '/public/creative-samples/bing-image-1.jpg'
```
修改为：
```typescript
image: '/creative-samples/bing-image-1.jpg'
```

### 2. 创建图片文件
- 创建了 `public/creative-samples/` 目录
- 添加了以下占位图片文件：
  - `bing-image-1.jpg` - 图片素材1
  - `bing-image-2.jpg` - 图片素材2  
  - `bing-video-thumb-1.jpg` - 视频缩略图1
  - `bing-video-thumb-2.jpg` - 视频缩略图2

### 3. 创建占位图片文件
创建了最小的有效JPEG文件作为占位图片，确保图片能够正常加载。

### 4. 添加错误处理
在组件中添加了 `handleImageError` 方法，当图片加载失败时显示SVG占位图标。

### 5. Vue/Vite 项目中的静态资源规则
在Vue/Vite项目中：
- `public` 文件夹中的文件可以直接通过根路径访问
- 正确路径：`/filename.jpg`
- 错误路径：`/public/filename.jpg`

## 修复结果
- 图片现在可以正常加载和显示
- 素材表现表格中的图片预览功能正常工作
- 视频缩略图也能正确显示
- 添加了图片加载错误处理，当图片加载失败时显示占位图标

## 相关文件
- `src/mock/bing-dashboard.ts` - 修复了图片路径
- `public/creative-samples/` - 新建目录和图片文件
- `src/components/dashboard/BingDashboardPanel.vue` - 显示图片的组件

## 注意事项
这些是临时的占位图片，在实际项目中应该：
1. 使用真实的广告创意图片
2. 实现图片上传和管理功能
3. 添加图片加载错误处理
4. 优化图片尺寸和格式 