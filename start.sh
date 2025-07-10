#!/bin/bash

# 艾维数据平台启动脚本
echo "🚀 启动艾维数据平台..."

# 确保在正确的目录下
cd "$(dirname "$0")"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误：请确保在 AIwei-Data-Platform-Project-1.0 目录下运行此脚本"
    exit 1
fi

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 启动开发服务器
echo "🌟 启动开发服务器..."
echo "📱 访问地址: http://localhost:5173/"
echo "🔐 登录账户: admin@example.com / password123"
echo "🎯 客户目标页面: http://localhost:5173/dashboard/customer-goals"
echo ""
echo "按 Ctrl+C 停止服务器"
echo ""

npm run dev 