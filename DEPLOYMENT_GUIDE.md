# 艾维数据平台 - 部署指南

## 项目概述

艾维数据平台是一个基于 Vue 3 + TypeScript 的现代化数据管理系统，支持客户管理、项目管理、数据分析等功能。

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **构建工具**: Vite 6.3.5
- **包管理器**: pnpm
- **UI 组件**: 自定义组件库
- **图标库**: Lucide Vue Next
- **路由**: Vue Router
- **状态管理**: Pinia

## 本地开发

### 环境要求

- Node.js 16+ 
- pnpm (推荐) 或 npm

### 安装依赖

```bash
# 使用 pnpm (推荐)
pnpm install

# 或使用 npm
npm install
```

### 开发服务器

```bash
# 启动开发服务器
pnpm dev

# 或
npm run dev
```

访问 `http://localhost:5173` 查看应用。

### 构建检查

在部署前，建议先在本地进行构建测试：

```bash
# 类型检查
pnpm run type-check

# 构建生产版本
pnpm run build

# 预览构建结果
pnpm run preview
```

## 部署到 Vercel

### 自动部署（推荐）

1. **连接 GitHub 仓库**
   - 登录 [Vercel](https://vercel.com)
   - 点击 "New Project"
   - 导入你的 GitHub 仓库

2. **配置构建设置**
   ```
   Framework Preset: Vite
   Build Command: pnpm run build
   Output Directory: dist
   Install Command: pnpm install
   ```

3. **环境变量**（如果需要）
   - 在 Vercel 项目设置中添加必要的环境变量

4. **部署**
   - 点击 "Deploy"
   - Vercel 会自动构建和部署项目

### 手动部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录
vercel login

# 部署
vercel --prod
```

## 部署到其他平台

### Netlify

1. **构建设置**
   ```
   Build command: pnpm run build
   Publish directory: dist
   ```

2. **部署**
   - 拖拽 `dist` 文件夹到 Netlify
   - 或连接 Git 仓库自动部署

### 传统服务器

```bash
# 构建项目
pnpm run build

# 将 dist 目录上传到服务器
# 配置 Web 服务器指向 dist 目录
```

## 常见问题排查

### 1. 构建失败

**问题**: TypeScript 类型错误
```bash
# 解决方案：清理缓存
rm -rf node_modules/.tmp
rm -rf dist
rm -rf .vite
pnpm install
pnpm run build
```

### 2. 路由问题

**问题**: 刷新页面出现 404
```
# 解决方案：配置服务器重写规则
# 对于 Vercel，创建 vercel.json：
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### 3. 环境变量

**问题**: 环境变量未生效
```bash
# 确保环境变量以 VITE_ 开头
VITE_API_BASE_URL=https://api.example.com
```

## 性能优化建议

### 1. 代码分割

```javascript
// 使用动态导入
const Dashboard = () => import('./views/DashboardView.vue')
```

### 2. 构建优化

```javascript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['vue', 'vue-router', 'pinia'],
          charts: ['chart.js', 'vue-chartjs']
        }
      }
    }
  }
})
```

### 3. 资源优化

- 压缩图片资源
- 使用 WebP 格式
- 启用 gzip 压缩

## 监控和维护

### 1. 错误监控

建议集成错误监控服务：
- Sentry
- LogRocket
- Bugsnag

### 2. 性能监控

- Google Analytics
- Web Vitals
- Lighthouse CI

### 3. 更新策略

```bash
# 定期更新依赖
pnpm update

# 安全更新
pnpm audit
pnpm audit fix
```

## 支持的浏览器

- Chrome (最新版)
- Firefox (最新版)
- Safari (最新版)
- Edge (最新版)

## 联系支持

如果遇到部署问题，请：

1. 检查构建日志
2. 参考本文档的故障排除部分
3. 查看项目的 Issue 页面
4. 联系技术支持团队

---

**最后更新**: 2025年1月27日  
**版本**: 1.0.0 