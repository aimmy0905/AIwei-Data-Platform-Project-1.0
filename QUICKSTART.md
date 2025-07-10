# 艾维数据平台 - 快速启动指南

## 🚀 启动应用

### 方法一：使用启动脚本（推荐）
```bash
# 在项目根目录下运行
./start.sh
```

### 方法二：手动启动
```bash
# 确保在正确的目录
cd AIwei-Data-Platform-Project-1.0

# 安装依赖（如果需要）
npm install

# 启动开发服务器
npm run dev
```

## 🌐 访问应用

### 1. 打开浏览器
访问：**http://localhost:5173/**

### 2. 登录系统
- **用户名**：`admin@example.com`
- **密码**：`password123`

### 3. 访问客户目标页面
- 通过菜单：数据看板 → 客户目标
- 直接访问：http://localhost:5173/dashboard/customer-goals

## 🎯 客户目标功能

### 目标类型筛选
- 月度目标
- 季度目标  
- 年度目标

### 五大目标类型
1. **销量目标** - 包含预测完成率
2. **利润目标** - 包含利润构成分析
3. **成本目标** - 包含成本构成分析
4. **ROI目标** - 包含各平台ROI对比
5. **用户数目标** - 包含用户构成分析

## 🔧 故障排除

### 如果无法访问
1. 确保在 `AIwei-Data-Platform-Project-1.0` 目录下运行命令
2. 检查端口5173是否被占用：`netstat -an | grep 5173`
3. 重启服务器：先按 Ctrl+C 停止，然后重新运行 `./start.sh`
4. 清除浏览器缓存：Ctrl+Shift+R (Windows) 或 Cmd+Shift+R (Mac)

### 常见错误
- **错误目录**：确保在 `AIwei-Data-Platform-Project-1.0` 目录下，而不是 `艾维` 目录
- **端口占用**：如果5173被占用，Vite会自动使用其他端口
- **依赖问题**：运行 `npm install` 重新安装依赖

## 📞 获取帮助

如果遇到问题，请检查：
1. Node.js 版本是否兼容
2. npm 依赖是否正确安装
3. 防火墙是否阻止端口访问
4. 浏览器是否支持现代JavaScript功能

---

**注意**：请确保始终在 `AIwei-Data-Platform-Project-1.0` 目录下运行所有命令！ 