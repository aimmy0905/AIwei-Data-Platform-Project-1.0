<template>
  <div class="project-director-dashboard">
    <div class="dashboard-header">
      <div class="dashboard-header__left">
        <h1 class="dashboard-title">项目经理看板</h1>
        <p class="dashboard-subtitle">管理部门项目，协调团队资源</p>
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
      <p>正在加载项目经理数据...</p>
    </div>

    <div v-else class="dashboard-content">
      <!-- 总运营目标完成模块 -->
      <OperationTargetCompletionModule
        :operation-targets="operationTargetsData"
        :loading="loading"
          @time-range-change="handleTimeRangeChange"
          @quarter-change="handleQuarterChange"
        />

      <!-- 项目组完成情况模块 -->
      <DepartmentTargetCompletionModule
        :department-targets="departmentTargetsData"
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @department-click="handleDepartmentClick"
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

      <!-- 部门客户分析模块 -->
      <DepartmentCustomerAnalysisListModule
        :department-data="departmentCustomerAnalysisData"
        :loading="loading"
        @department-click="handleDepartmentClick"
        @view-change="handleCustomerViewChange"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 平台新增及流失（总计）模块 -->
      <PlatformAnalysisModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 平台新增及流失（部门）模块 -->
      <DepartmentPlatformAnalysisModule
        :loading="loading"
          @time-range-change="handleTimeRangeChange"
          @quarter-change="handleQuarterChange"
        />

      <!-- 平台毛利贡献分析（总计）模块 -->
      <PlatformProfitContributionModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 平台毛利贡献分析（部门）模块 -->
      <DepartmentProfitContributionModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 客户质量评估（总计）模块 -->
      <CustomerQualityAssessmentModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 部门客户质量评估（部门）模块 -->
      <DepartmentCustomerQualityAssessmentModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 客户贡献（总计）模块 -->
      <CustomerContributionModule
        :loading="loading"
          @time-range-change="handleTimeRangeChange"
          @quarter-change="handleQuarterChange"
        />

      <!-- 续费客户名单模块 -->
      <RenewalCustomerListModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 服务客户模块 -->
      <ServiceCustomerModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 客户Google广告数据总览 -->
      <CustomerGoogleAdsModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 客户FB广告数据总览 -->
      <CustomerFacebookAdsModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 客户Criteo广告数据总览 -->
      <CustomerCriteoAdsModule
        :loading="loading"
        @time-range-change="handleTimeRangeChange"
        @quarter-change="handleQuarterChange"
      />

      <!-- 客户Bing广告数据总览 -->
      <CustomerBingAdsModule
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
import DepartmentTargetCompletionModule from '@/components/business/DepartmentTargetCompletionModule.vue'
import CustomerAnalysisModule from '@/components/business/CustomerAnalysisModule.vue'
import DepartmentCustomerAnalysisListModule from '@/components/business/DepartmentCustomerAnalysisListModule.vue'
import PlatformAnalysisModule from '@/components/business/PlatformAnalysisModule.vue'
import DepartmentPlatformAnalysisModule from '@/components/business/DepartmentPlatformAnalysisModule.vue'
import PlatformProfitContributionModule from '@/components/business/PlatformProfitContributionModule.vue'
import DepartmentProfitContributionModule from '@/components/business/DepartmentProfitContributionModule.vue'
import CustomerQualityAssessmentModule from '@/components/business/CustomerQualityAssessmentModule.vue'
import DepartmentCustomerQualityAssessmentModule from '@/components/business/DepartmentCustomerQualityAssessmentModule.vue'
import CustomerContributionModule from '@/components/business/CustomerContributionModule.vue'
import RenewalCustomerListModule from '@/components/business/RenewalCustomerListModule.vue'
import ServiceCustomerModule from '@/components/business/ServiceCustomerModule.vue'
import CustomerGoogleAdsModule from '@/components/business/CustomerGoogleAdsModule.vue'
import CustomerFacebookAdsModule from '@/components/business/CustomerFacebookAdsModule.vue'
import CustomerCriteoAdsModule from '@/components/business/CustomerCriteoAdsModule.vue'
import CustomerBingAdsModule from '@/components/business/CustomerBingAdsModule.vue'
import type {
  BusinessRole,
  OperationTargetData,
  DepartmentTargetData,
  CustomerAnalysisData,
  DepartmentCustomerAnalysis,
  TimeRange
} from '@/types'

const currentRole = ref('project_manager')
const availableRoles = ref<BusinessRole[]>([])
const loading = ref(false)
const selectedDepartment = ref<string>('')

// 数据状态
const operationTargetsData = ref<OperationTargetData[]>([])
const departmentTargetsData = ref<DepartmentTargetData[]>([])
const customerAnalysisTotalData = ref<CustomerAnalysisData | null>(null)
const departmentCustomerAnalysisData = ref<DepartmentCustomerAnalysis[]>([])

// 计算属性
const selectedDepartmentCustomerData = computed(() => {
  if (!selectedDepartment.value) return null
  return departmentCustomerAnalysisData.value.find(
    dept => dept.departmentId === selectedDepartment.value
  ) || null
})

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

const handleDepartmentClick = (departmentId: string) => {
  console.log('Department clicked:', departmentId)
  selectedDepartment.value = departmentId
}

const handleCustomerViewChange = (view: string) => {
  console.log('Customer view changed:', view)
}

const handleCustomerChartClick = (data: any) => {
  console.log('Customer chart clicked:', data)
}

const handleDepartmentSelect = () => {
  console.log('Department selected:', selectedDepartment.value)
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

    departmentTargetsData.value = [
      {
        departmentId: 'DEPT_001',
        departmentName: '华东营销部',
        targets: {
          totalProfitTarget: 18000000,
          serviceFeeTarget: 12000000,
          rebateTarget: 6000000,
          targetPercentage: 33.3
        },
        achievements: {
          totalProfitActual: 17100000,
          totalProfitGap: -900000,
          totalProfitRate: 95.0,
          serviceFeeActual: 11400000,
          serviceFeeGap: -600000,
          serviceFeeRate: 95.0,
          rebateActual: 5700000,
          rebateGap: -300000,
          rebateRate: 95.0,
          completionPercentage: 31.6
        }
      },
      {
        departmentId: 'DEPT_002',
        departmentName: '华南营销部',
        targets: {
          totalProfitTarget: 16000000,
          serviceFeeTarget: 10500000,
          rebateTarget: 5500000,
          targetPercentage: 29.6
        },
        achievements: {
          totalProfitActual: 15200000,
          totalProfitGap: -800000,
          totalProfitRate: 95.0,
          serviceFeeActual: 9975000,
          serviceFeeGap: -525000,
          serviceFeeRate: 95.0,
          rebateActual: 5225000,
          rebateGap: -275000,
          rebateRate: 95.0,
          completionPercentage: 28.1
        }
      },
      {
        departmentId: 'DEPT_003',
        departmentName: '华北营销部',
        targets: {
          totalProfitTarget: 20000000,
          serviceFeeTarget: 13000000,
          rebateTarget: 7000000,
          targetPercentage: 37.1
        },
        achievements: {
          totalProfitActual: 19000000,
          totalProfitGap: -1000000,
          totalProfitRate: 95.0,
          serviceFeeActual: 12350000,
          serviceFeeGap: -650000,
          serviceFeeRate: 95.0,
          rebateActual: 6650000,
          rebateGap: -350000,
          rebateRate: 95.0,
          completionPercentage: 35.1
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
.project-director-dashboard {
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
