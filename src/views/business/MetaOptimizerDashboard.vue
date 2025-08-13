<template>
  <div class="meta-optimizer-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">Meta优化师看板</h1>
        <p class="dashboard-subtitle">专注Meta平台客户优化与数据分析</p>
      </div>

      <div class="dashboard-header__right">
        <RoleSwitcher
          :current-role="currentRole"
          :available-roles="availableRoles"
          @role-change="handleRoleChange"
        />
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>正在加载Meta优化师数据...</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- 总运营目标完成模块 -->
      <OperationTargetCompletionModule
        :operation-targets="operationTargetsData"
        :loading="loading"
          @time-range-change="handleTimeRangeChange"
          @quarter-change="handleQuarterChange"
        />

      <!-- 客户分析模块（总计） -->
      <CustomerAnalysisModule
        :customer-data="customerAnalysisTotalData"
        :department-data="departmentCustomerAnalysisData"
        :title="'新老客户分析及流失客户分析（总计）'"
        :loading="loading"
        :show-departments="true"
        @view-change="handleCustomerViewChange"
        @chart-click="handleCustomerChartClick"
      />

      <!-- 客户质量评估（总计）模块 -->
      <CustomerQualityAssessmentModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 余额通知模块 -->
      <BalanceNotificationModule />

      <!-- 服务客户模块 -->
      <ServiceCustomerModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 客户Meta广告数据总览 -->
      <CustomerFacebookAdsModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { businessAPI } from '@/mock/business'
import RoleSwitcher from '@/components/business/RoleSwitcher.vue'
import OperationTargetCompletionModule from '@/components/business/OperationTargetCompletionModule.vue'
import CustomerAnalysisModule from '@/components/business/CustomerAnalysisModule.vue'
import CustomerQualityAssessmentModule from '@/components/business/CustomerQualityAssessmentModule.vue'
import ServiceCustomerModule from '@/components/business/ServiceCustomerModule.vue'
import CustomerFacebookAdsModule from '@/components/business/CustomerFacebookAdsModule.vue'
import BalanceNotificationModule from '@/components/business/BalanceNotificationModule.vue'
import type {
  BusinessRole,
  OperationTargetData,
  CustomerAnalysisData,
  DepartmentCustomerAnalysis,
  TimeRange
} from '@/types'

const currentRole = ref('meta_optimizer')
const availableRoles = ref<BusinessRole[]>([])
const loading = ref(false)


// 数据状态
const operationTargetsData = ref<OperationTargetData[]>([])
const customerAnalysisTotalData = ref<CustomerAnalysisData | null>(null)
const departmentCustomerAnalysisData = ref<DepartmentCustomerAnalysis[]>([])

// 事件处理
const handleRoleChange = (role: string) => {
  currentRole.value = role
}

const handleTimeRangeChange = (timeRange: TimeRange | string) => {
  console.log('Time range changed:', timeRange)
  // 根据时间筛选重新加载数据
  loadDashboardData()
}

const handleQuarterChange = (quarter: string) => {
  console.log('Quarter changed:', quarter)
}

const handleCustomerViewChange = (view: string) => {
  console.log('Customer view changed:', view)
}

const handleCustomerChartClick = (data: any) => {
  console.log('Customer chart clicked:', data)
}

// 数据加载
const loadDashboardData = async () => {
  try {
    loading.value = true

    // 使用模拟数据避免API调用错误
    operationTargetsData.value = [
      {
        quarter: '2025-Q1',
        targets: {
          totalProfitTarget: 12000000,
          serviceFeeTarget: 8000000,
          rebateTarget: 4000000
        },
        achievements: {
          totalProfitActual: 11400000,
          totalProfitGap: -600000,
          totalProfitRate: 95.0,
          serviceFeeActual: 7600000,
          serviceFeeGap: -400000,
          serviceFeeRate: 95.0,
          rebateActual: 3800000,
          rebateGap: -200000,
          rebateRate: 95.0
        }
      },
      {
        quarter: '2025-Q2',
        targets: {
          totalProfitTarget: 13000000,
          serviceFeeTarget: 8500000,
          rebateTarget: 4500000
        },
        achievements: {
          totalProfitActual: 12350000,
          totalProfitGap: -650000,
          totalProfitRate: 95.0,
          serviceFeeActual: 8075000,
          serviceFeeGap: -425000,
          serviceFeeRate: 95.0,
          rebateActual: 4275000,
          rebateGap: -225000,
          rebateRate: 95.0
        }
      },
      {
        quarter: '2025-Q3',
        targets: {
          totalProfitTarget: 14000000,
          serviceFeeTarget: 9000000,
          rebateTarget: 5000000
        },
        achievements: {
          totalProfitActual: 13300000,
          totalProfitGap: -700000,
          totalProfitRate: 95.0,
          serviceFeeActual: 8550000,
          serviceFeeGap: -450000,
          serviceFeeRate: 95.0,
          rebateActual: 4750000,
          rebateGap: -250000,
          rebateRate: 95.0
        }
      },
      {
        quarter: '2025-Q4',
        targets: {
          totalProfitTarget: 15000000,
          serviceFeeTarget: 9500000,
          rebateTarget: 5500000
        },
        achievements: {
          totalProfitActual: 14250000,
          totalProfitGap: -750000,
          totalProfitRate: 95.0,
          serviceFeeActual: 9025000,
          serviceFeeGap: -475000,
          serviceFeeRate: 95.0,
          rebateActual: 5225000,
          rebateGap: -275000,
          rebateRate: 95.0
        }
      }
    ]


    customerAnalysisTotalData.value = {
      quarter: '2025-Q1',
      allCustomers: {
        activeCustomerCount: 150,
        totalProfit: 5000000,
        serviceFee: 3000000,
        rebate: 1500000
      },
      oldCustomers: {
        activeCustomerCount: 105,
        totalProfit: 3500000,
        serviceFee: 2100000,
        rebate: 1050000
      },
      newCustomers: {
        activeCustomerCount: 45,
        totalProfit: 1500000,
        serviceFee: 900000,
        rebate: 450000
      },
      churnedCustomers: {
        customerCount: 25,
        estimatedProfitLoss: 800000,
        estimatedServiceFeeLoss: 500000,
        estimatedRebateLoss: 250000
      }
    }
    departmentCustomerAnalysisData.value = [
      {
        departmentId: 'operations-1',
        departmentName: 'Q1',
        customerData: {
          allCustomers: {
            activeCustomerCount: 35,
            totalProfit: 1200000, // 120万
            serviceFee: 720000, // 72万
            rebate: 360000 // 36万
          },
          newCustomers: {
            activeCustomerCount: 12,
            totalProfit: 400000, // 40万
            serviceFee: 240000, // 24万
            rebate: 120000 // 12万
          },
          oldCustomers: {
            activeCustomerCount: 23,
            totalProfit: 800000, // 80万
            serviceFee: 480000, // 48万
            rebate: 240000 // 24万
          },
          addedCustomers: {
            activeCustomerCount: 8,
            totalProfit: 280000, // 28万
            serviceFee: 168000, // 16.8万
            rebate: 84000 // 8.4万
          },
          churnedCustomers: {
            customerCount: 3,
            estimatedProfitLoss: 150000, // 15万
            estimatedServiceFeeLoss: 90000, // 9万
            estimatedRebateLoss: 45000 // 4.5万
          }
        }
      },
      {
        departmentId: 'operations-2',
        departmentName: 'Q2',
        customerData: {
          allCustomers: {
            activeCustomerCount: 42,
            totalProfit: 1450000, // 145万
            serviceFee: 870000, // 87万
            rebate: 435000 // 43.5万
          },
          newCustomers: {
            activeCustomerCount: 15,
            totalProfit: 520000, // 52万
            serviceFee: 312000, // 31.2万
            rebate: 156000 // 15.6万
          },
          oldCustomers: {
            activeCustomerCount: 27,
            totalProfit: 930000, // 93万
            serviceFee: 558000, // 55.8万
            rebate: 279000 // 27.9万
          },
          addedCustomers: {
            activeCustomerCount: 10,
            totalProfit: 350000, // 35万
            serviceFee: 210000, // 21万
            rebate: 105000 // 10.5万
          },
          churnedCustomers: {
            customerCount: 4,
            estimatedProfitLoss: 200000, // 20万
            estimatedServiceFeeLoss: 120000, // 12万
            estimatedRebateLoss: 60000 // 6万
          }
        }
      },
      {
        departmentId: 'operations-3',
        departmentName: 'Q3',
        customerData: {
          allCustomers: {
            activeCustomerCount: 38,
            totalProfit: 1300000, // 130万
            serviceFee: 780000, // 78万
            rebate: 390000 // 39万
          },
          newCustomers: {
            activeCustomerCount: 13,
            totalProfit: 450000, // 45万
            serviceFee: 270000, // 27万
            rebate: 135000 // 13.5万
          },
          oldCustomers: {
            activeCustomerCount: 25,
            totalProfit: 850000, // 85万
            serviceFee: 510000, // 51万
            rebate: 255000 // 25.5万
          },
          addedCustomers: {
            activeCustomerCount: 9,
            totalProfit: 315000, // 31.5万
            serviceFee: 189000, // 18.9万
            rebate: 94500 // 9.45万
          },
          churnedCustomers: {
            customerCount: 5,
            estimatedProfitLoss: 250000, // 25万
            estimatedServiceFeeLoss: 150000, // 15万
            estimatedRebateLoss: 75000 // 7.5万
          }
        }
      },
      {
        departmentId: 'operations-4',
        departmentName: 'Q4',
        customerData: {
          allCustomers: {
            activeCustomerCount: 35,
            totalProfit: 1200000, // 120万
            serviceFee: 720000, // 72万
            rebate: 360000 // 36万
          },
          newCustomers: {
            activeCustomerCount: 11,
            totalProfit: 380000, // 38万
            serviceFee: 228000, // 22.8万
            rebate: 114000 // 11.4万
          },
          oldCustomers: {
            activeCustomerCount: 24,
            totalProfit: 820000, // 82万
            serviceFee: 492000, // 49.2万
            rebate: 246000 // 24.6万
          },
          addedCustomers: {
            activeCustomerCount: 7,
            totalProfit: 245000, // 24.5万
            serviceFee: 147000, // 14.7万
            rebate: 73500 // 7.35万
          },
          churnedCustomers: {
            customerCount: 3,
            estimatedProfitLoss: 150000, // 15万
            estimatedServiceFeeLoss: 90000, // 9万
            estimatedRebateLoss: 45000 // 4.5万
          }
        }
      }
    ]

  } catch (error) {
    console.error('Failed to load dashboard data:', error)
  } finally {
    loading.value = false
  }
}

// 初始化
onMounted(async () => {
  await loadDashboardData()
})
</script>

<style scoped>
.meta-optimizer-dashboard {
  padding: 24px;
  background: #f5f5f5;
  min-height: 100vh;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.dashboard-title {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #262626;
}

.dashboard-subtitle {
  margin: 0;
  color: #8c8c8c;
  font-size: 14px;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #1890ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading-state p {
  color: #8c8c8c;
  font-size: 16px;
  margin: 0;
}

.dashboard-content {
  display: flex;
  flex-direction: column;
  gap: 0;
}
</style>
