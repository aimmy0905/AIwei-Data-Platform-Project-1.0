#!/bin/bash

echo "🚀 启动艾维数据平台开发服务器..."
echo "📁 当前目录: $(pwd)"

# 检查是否在正确的目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请确保在项目根目录中运行此脚本"
    exit 1
fi

# 检查 node_modules 是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 安装依赖..."
    npm install
fi

# 启动开发服务器
echo "🌐 启动开发服务器..."
npm run dev 