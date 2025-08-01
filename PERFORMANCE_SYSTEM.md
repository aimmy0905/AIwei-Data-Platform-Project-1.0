# 多层级绩效考核管理系统

## 🎯 系统概述

本系统是一个完整的企业级多层级绩效考核管理解决方案，支持月度、季度、年度多维度考核，实现了数据指标、客户评价、智能方案三位一体的综合评估体系。

## 🏗️ 系统架构

### 核心功能模块

1. **时间维度管理**
   - 月度考核（Monthly）
   - 季度考核（Quarterly）
   - 年度考核（Yearly）

2. **综合考核体系**
   - 数据指标完成进度（权重可配置）
   - 客户评价（权重可配置）
   - 智能方案考核（权重可配置）

3. **多层级权限控制**
   - 基于角色的数据访问控制
   - 分级目标设置权限
   - 评分录入权限管理

4. **智能数据分析**
   - 自动计算完成率和得分
   - 实时排名统计
   - 趋势分析和预测

## 📊 考核指标体系

### 运营部门

#### 普通员工（月度考核）
**权重配置**：
- 数据指标：40%
- 客户评价：30%
- 智能方案：30%

**数据指标**：
- 服务费目标完成率（权重50%）
- 返点目标完成率（权重50%）

**智能方案考核项目**（由项目经理评价）：
- 客户服务能力（20分）
- 专业工作质量（20分）
- 沟通与协助能力（20分）
- 工作积极性及执行力（20分）
- 成长与贡献表现（20分）

#### 项目经理（季度考核）
**权重配置**：
- 数据指标：50%
- 客户评价：25%
- 智能方案：25%

**数据指标**：
- 服务费目标完成率（权重50%）
- 返点目标完成率（权重50%）

**智能方案考核项目**（由项目总监评价）：
- 团队成员管理能力（20分）
- 组内客户评价管理（20分）
- 知识沉淀及输出质量（20分）
- 培养及输出新人能力（20分）
- 跨团队协助及合作表现（20分）

### 销售部门

#### 销售人员（月度考核）
**权重配置**：
- 数据指标：70%
- 智能方案：30%

**数据指标**：
- 新单服务费用目标完成率（权重40%）
- 新单单量目标完成率（权重30%）
- 续费金额目标完成率（权重30%）

**智能方案考核项目**（由销售经理评价）：
- 月度有效客户拜访量（100分）

#### 销售经理（月度考核）
**权重配置**：
- 数据指标：65%
- 智能方案：35%

**数据指标**：
- 新单服务费目标完成率（权重25%）
- 新单单量目标完成率（权重25%）
- 团队新单服务费目标完成率（权重25%）
- 团队续费服务费目标完成率（权重25%）

**智能方案考核项目**（由销售总监评价）：
- 成员成长与均衡性（25分）
- 销售流程与CRM规范执行（25分）
- 策略制定与过程辅导（25分）
- 团队客户拜访量目标完成（25分）

## 🔐 权限控制体系

### 角色定义

1. **总经理（general_manager）**
   - 查看权限：全公司所有数据
   - 目标设置：所有员工
   - 评分权限：无（通过下级管理层）
   - 特殊权限：最终审批、系统配置

2. **销售总监（sales_director）**
   - 查看权限：销售部门全部数据
   - 目标设置：销售部门所有员工
   - 评分权限：销售经理
   - 特殊权限：销售策略制定

3. **销售经理（sales_manager）**
   - 查看权限：下属销售人员数据
   - 目标设置：下属销售人员
   - 评分权限：下属销售人员
   - 特殊权限：团队管理

4. **项目总监（project_director）**
   - 查看权限：运营部门全部数据
   - 目标设置：运营部门所有员工
   - 评分权限：项目经理
   - 特殊权限：运营流程优化

5. **项目经理（project_manager）**
   - 查看权限：下属运营人员数据
   - 目标设置：下属运营人员
   - 评分权限：下属运营人员
   - 特殊权限：客户关系管理

6. **普通员工（sales_staff/operations_staff）**
   - 查看权限：仅个人数据
   - 目标设置：无
   - 评分权限：无
   - 特殊权限：数据查看、历史记录

### 权限实现机制

```typescript
// 权限检查函数
export function getEmployeesByRole(role: UserRole, userId: number): number[]
export function getTargetSettableEmployees(role: UserRole, userId: number): number[]
export function getRatableEmployees(role: UserRole, userId: number): number[]
```

## 🎨 用户界面设计

### 页面布局结构

1. **顶部区域**
   - 页面标题和描述
   - 时间周期切换器（月度/季度/年度）

2. **筛选和操作区**
   - 部门筛选器
   - 职级筛选器
   - 状态筛选器
   - 操作按钮（设置目标、评分录入、导出数据）

3. **统计概览区**
   - 参与考核人数
   - 平均综合得分
   - 已完成考核数量
   - 待完成考核数量

4. **主要内容区**
   - 视图切换（表格视图/卡片视图）
   - 绩效数据展示
   - 排序和筛选功能

### 交互设计特点

1. **时间周期切换**
   - 直观的标签页设计
   - 动态加载对应周期数据
   - 历史数据和未来目标切换

2. **多视图模式**
   - 表格视图：详细数据展示
   - 卡片视图：可视化概览
   - 一键切换，保持筛选状态

3. **智能筛选**
   - 多维度筛选条件
   - 实时筛选结果更新
   - 筛选状态保持

4. **排序功能**
   - 点击表头排序
   - 升序/降序切换
   - 排序状态指示

## 📈 数据模型设计

### 核心数据结构

```typescript
// 绩效记录
interface NewPerformanceRecord {
  id: number
  employee_id: number
  employee_name: string
  department_type: DepartmentType
  position_level: PositionLevel
  period: string
  period_type: PeriodType
  
  // 三维度得分
  data_score: number
  customer_score: number
  intelligent_score: number
  total_score: number
  
  // 权重配置
  data_weight: number
  customer_weight: number
  intelligent_weight: number
  
  // 等级和排名
  grade: 'S' | 'A' | 'B' | 'C' | 'D'
  rank_in_department: number
  rank_in_company: number
}

// 指标配置
interface MetricConfig {
  id: string
  name: string
  department: DepartmentType
  position_level: PositionLevel
  period_type: PeriodType
  weight: number
  target_field: string
  unit: string
}

// 智能方案考核配置
interface IntelligentAssessmentConfig {
  id: string
  department: DepartmentType
  position_level: PositionLevel
  evaluator_role: UserRole
  items: IntelligentAssessmentItem[]
  weight: number
}
```

### 数据关系

1. **员工 → 绩效记录**：一对多关系
2. **部门 → 指标配置**：一对多关系
3. **角色 → 权限配置**：一对一关系
4. **考核配置 → 评分记录**：一对多关系

## 🔧 技术实现

### 前端技术栈

- **框架**：Vue 3 + Composition API
- **类型系统**：TypeScript
- **样式**：CSS Variables + Scoped CSS
- **图标**：Lucide Vue Next
- **状态管理**：Reactive API

### 核心功能实现

1. **权限控制**
   ```typescript
   const canEditRecord = (record: NewPerformanceRecord) => {
     return ['general_manager', 'sales_director', 'project_director'].includes(currentUserRole)
   }
   ```

2. **数据筛选**
   ```typescript
   const filteredRecords = computed(() => {
     return performanceRecords.value.filter(record => {
       return viewableEmployeeIds.value.includes(record.employee_id) &&
              record.period_type === selectedPeriodType.value &&
              // 其他筛选条件...
     })
   })
   ```

3. **得分计算**
   ```typescript
   const calculateTotalScore = (record: NewPerformanceRecord) => {
     return (record.data_score * record.data_weight +
             record.customer_score * record.customer_weight +
             record.intelligent_score * record.intelligent_weight) / 100
   }
   ```

### 响应式设计

- **桌面端**：完整功能展示
- **平板端**：适配中等屏幕
- **移动端**：简化布局，保持核心功能

## 🚀 部署和使用

### 系统要求

- Node.js 16+
- Vue 3.3+
- TypeScript 4.9+
- 现代浏览器支持

### 快速开始

1. **查看系统演示**
   ```bash
   # 访问演示页面
   http://localhost:5174/test-performance-system.html
   ```

2. **使用绩效管理**
   ```bash
   # 访问绩效管理页面
   http://localhost:5174/#/departments/performance
   ```

### 功能验证

1. **时间周期切换**：测试月度、季度、年度数据切换
2. **权限控制**：验证不同角色的数据访问权限
3. **目标设置**：测试目标设置和保存功能
4. **评分录入**：验证智能方案考核评分
5. **数据导出**：测试数据导出功能

## 📊 预期效果

### 业务价值

1. **提升管理效率**：自动化考核流程，减少人工操作
2. **数据驱动决策**：实时数据分析，支持管理决策
3. **公平透明考核**：标准化考核流程，提升公平性
4. **激励员工成长**：清晰的目标和反馈机制

### 用户体验

1. **操作便捷**：直观的界面设计，简化操作流程
2. **信息清晰**：多维度数据展示，信息层次分明
3. **响应迅速**：实时数据更新，快速响应操作
4. **权限明确**：基于角色的权限控制，操作规范

## 🔮 未来扩展

### 功能增强

1. **数据分析**：增加更多统计图表和趋势分析
2. **通知系统**：考核提醒和结果通知
3. **移动应用**：开发移动端专用应用
4. **API集成**：与其他系统的数据集成

### 技术优化

1. **性能优化**：大数据量处理优化
2. **缓存机制**：数据缓存和离线支持
3. **实时更新**：WebSocket实时数据推送
4. **安全加固**：数据加密和安全审计

这个多层级绩效考核管理系统为企业提供了一个完整、专业、易用的绩效管理解决方案，能够有效提升企业的人力资源管理水平和员工绩效。
