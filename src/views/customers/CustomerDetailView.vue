<template>
  <div class="customer-detail-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-header__main">
        <div class="breadcrumb">
          <button class="breadcrumb-btn" @click="goBack">
            <ArrowLeft :size="16" />
            返回客户列表
          </button>
        </div>
        <div class="customer-header">
          <div class="customer-avatar-large">
            {{ customerDetail?.cooperationDetails?.customerName?.charAt(0).toUpperCase() }}
          </div>
          <div class="customer-info">
            <h1 class="customer-name">
              {{ customerDetail?.cooperationDetails?.customerName }}
              <span v-if="isEditMode" class="edit-mode-indicator">（编辑中）</span>
            </h1>
            <div class="customer-meta">
              <span class="status-badge" :class="`status-badge--${customerDetail?.cooperationDetails?.customerStatus}`">
                {{ getStatusText(customerDetail?.cooperationDetails?.customerStatus) }}
              </span>
              <span class="grade-badge" :class="`grade-badge--${customerDetail?.cooperationDetails?.customerGrade}`">
                {{ customerDetail?.cooperationDetails?.customerGrade }}级客户
              </span>
            </div>
          </div>
        </div>
      </div>
      <div class="page-header__actions">
        <button
          v-if="!isEditMode"
          class="action-btn action-btn--secondary"
          @click="editCustomer"
        >
          <Edit :size="16" />
          编辑客户
        </button>
        <button
          v-if="isEditMode"
          class="action-btn action-btn--secondary"
          @click="cancelEdit"
        >
          取消编辑
        </button>
                <button
          v-if="isEditMode"
          class="action-btn action-btn--primary"
          @click="saveCustomer"
          :disabled="saving"
        >
          <Save :size="16" />
          {{ saving ? '保存中...' : '保存修改' }}
        </button>
        <button
          v-if="!isEditMode"
          class="action-btn action-btn--secondary"
          @click="addQA"
        >
          <MessageSquare :size="16" />
          添加Q&A
        </button>
        <!-- 更多操作下拉菜单 -->
        <div v-if="!isEditMode" class="dropdown-container">
          <button
            class="action-btn action-btn--primary dropdown-trigger"
            @click="toggleMoreActions"
            ref="moreActionsButton"
          >
            <MoreHorizontal :size="16" />
            更多操作
          </button>

          <!-- 下拉菜单 -->
          <div
            v-if="showMoreActionsMenu"
            class="dropdown-menu dropdown-menu--detail"
            @click.stop
          >
            <button class="dropdown-item" @click="viewCustomerProjects">
              <Briefcase :size="14" />
              客户项目
            </button>
            <button class="dropdown-item" @click="viewServiceFeeRecords">
              <DollarSign :size="14" />
              服务费记录
            </button>
            <button class="dropdown-item" @click="viewReviewRecords">
              <Star :size="14" />
              客户评价
            </button>
            <button class="dropdown-item" @click="viewCustomerAccount">
              <User :size="14" />
              客户账号
            </button>
            <button class="dropdown-item" @click="addCustomerQA">
              <MessageSquare :size="14" />
              客户QA
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- 页面内容 -->
    <div class="page-content">
      <div v-if="loading" class="loading-container">
        <Loader :size="48" class="loading-spinner" />
        <span>加载客户详情中...</span>
      </div>

      <div v-else-if="customerDetail" class="customer-detail-content">
        <!-- 标签页导航 -->
        <div class="tabs-container">
          <div class="tabs-nav">
            <button
              class="tab-btn"
              :class="{ 'tab-btn--active': activeTab === 'info' }"
              @click="activeTab = 'info'"
            >
              <User :size="16" />
              客户信息
            </button>
            <button
              class="tab-btn"
              :class="{ 'tab-btn--active': activeTab === 'projects' }"
              @click="activeTab = 'projects'"
            >
              <Briefcase :size="16" />
              合作项目
            </button>
            <button
              class="tab-btn"
              :class="{ 'tab-btn--active': activeTab === 'renewals' }"
              @click="activeTab = 'renewals'"
            >
              <RefreshCw :size="16" />
              续费记录
            </button>
          </div>
        </div>

        <!-- 标签页内容 -->
        <div class="tab-content">
          <!-- 客户信息标签页 -->
          <div v-if="activeTab === 'info'" class="content-sections">
        <!-- 合作详情 -->
        <div class="content-section">
          <h3 class="section-title">
            <Handshake :size="20" />
            合作详情
          </h3>

          <!-- 查看模式 -->
          <div v-if="!isEditMode">
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">客户名称</label>
                <span class="info-value">{{ customerDetail.cooperationDetails.customerName }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">合作方式</label>
                <span class="info-value">{{ customerDetail.cooperationDetails.cooperationType }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">合作起始时间</label>
                <span class="info-value">{{ formatDate(customerDetail.cooperationDetails.cooperationStartTime) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">实际服务开始时间</label>
                <span class="info-value">{{ formatDate(customerDetail.cooperationDetails.serviceStartTime) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">签单销售</label>
                <span class="info-value">{{ customerDetail.cooperationDetails.signingSales }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">客户分级</label>
                <span class="grade-badge" :class="`grade-badge--${customerDetail.cooperationDetails.customerGrade}`">
                  {{ customerDetail.cooperationDetails.customerGrade }}级
                </span>
              </div>
            </div>
            <div class="info-item info-item--full">
              <label class="info-label">特殊合作条件</label>
              <div class="info-value info-value--text">
                {{ customerDetail.cooperationDetails.specialConditions || '无特殊条件' }}
              </div>
            </div>
          </div>

          <!-- 编辑模式 -->
          <div v-else class="edit-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">客户名称</label>
                <input
                  v-model="editFormData.cooperationDetails.customerName"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.customerName }"
                  placeholder="请输入客户公司名称"
                  @blur="validateField('customerName')"
                />
                <span v-if="formErrors.customerName" class="error-message">{{ formErrors.customerName }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">合作方式</label>
                <select
                  v-model="editFormData.cooperationDetails.cooperationType"
                  class="form-select"
                  :class="{ 'form-input--error': formErrors.cooperationType }"
                  @change="validateField('cooperationType')"
                >
                  <option value="">请选择合作方式</option>
                  <option value="代运营">代运营</option>
                  <option value="咨询服务">咨询服务</option>
                  <option value="技术支持">技术支持</option>
                  <option value="培训服务">培训服务</option>
                </select>
                <span v-if="formErrors.cooperationType" class="error-message">{{ formErrors.cooperationType }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">合作起始时间</label>
                <input
                  v-model="editFormData.cooperationDetails.cooperationStartTime"
                  type="date"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.cooperationStartTime }"
                />
                <span v-if="formErrors.cooperationStartTime" class="error-message">{{ formErrors.cooperationStartTime }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">实际服务开始时间</label>
                <input
                  v-model="editFormData.cooperationDetails.serviceStartTime"
                  type="date"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.serviceStartTime }"
                />
                <span v-if="formErrors.serviceStartTime" class="error-message">{{ formErrors.serviceStartTime }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">签单销售</label>
                <input
                  v-model="editFormData.cooperationDetails.signingSales"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.signingSales }"
                  placeholder="请输入签单销售人员姓名"
                  @blur="validateField('signingSales')"
                />
                <span v-if="formErrors.signingSales" class="error-message">{{ formErrors.signingSales }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">客户分级</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input
                      v-model="editFormData.cooperationDetails.customerGrade"
                      type="radio"
                      value="A"
                      class="radio-input"
                    />
                    <span class="radio-label">A级客户</span>
                  </label>
                  <label class="radio-item">
                    <input
                      v-model="editFormData.cooperationDetails.customerGrade"
                      type="radio"
                      value="B"
                      class="radio-input"
                    />
                    <span class="radio-label">B级客户</span>
                  </label>
                  <label class="radio-item">
                    <input
                      v-model="editFormData.cooperationDetails.customerGrade"
                      type="radio"
                      value="C"
                      class="radio-input"
                    />
                    <span class="radio-label">C级客户</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-group form-group--full">
              <label class="form-label">特殊合作条件</label>
              <textarea
                v-model="editFormData.cooperationDetails.specialConditions"
                class="form-textarea"
                placeholder="请描述特殊的合作条件或要求"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 客户基础信息 -->
        <div class="content-section">
          <h3 class="section-title">
            <User :size="20" />
            基础信息
          </h3>

          <!-- 查看模式 -->
          <div v-if="!isEditMode">
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">服务团队</label>
                <span class="info-value">{{ customerDetail.basicInfo.serviceTeam }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">客户行业</label>
                <span class="info-value">{{ customerDetail.basicInfo.industry }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">商业及生产模式</label>
                <span class="info-value">{{ customerDetail.basicInfo.businessModel }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">海外三年内目标销售额规模</label>
                <span class="info-value">{{ customerDetail.basicInfo.overseasSalesScale }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">海外销售占比</label>
                <span class="info-value">{{ customerDetail.basicInfo.overseasSalesRatio }}%</span>
              </div>
              <div class="info-item">
                <label class="info-label">目标销售规模</label>
                <span class="info-value">{{ customerDetail.basicInfo.targetSalesScale }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">主要销售渠道</label>
                <span class="info-value">{{ customerDetail.basicInfo.mainSalesChannel }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">合作转移情况</label>
                <span class="info-value">{{ customerDetail.basicInfo.cooperationTransfer || '无' }}</span>
              </div>
            </div>

            <div class="info-section">
              <h4 class="subsection-title">客户地区</h4>
              <div class="tag-list">
                <span v-for="region in customerDetail.basicInfo.regions" :key="region" class="tag">
                  {{ region }}
                </span>
              </div>
            </div>

            <div class="info-section">
              <h4 class="subsection-title">团队配置</h4>
              <div class="team-config">
                <div class="team-item">
                  <Check v-if="customerDetail.basicInfo.hasTechTeam" :size="16" class="check-icon check-icon--success" />
                  <X v-else :size="16" class="check-icon check-icon--error" />
                  <span>技术及素材制作团队</span>
                </div>
                <div class="team-item">
                  <Check v-if="customerDetail.basicInfo.hasOperationTeam" :size="16" class="check-icon check-icon--success" />
                  <X v-else :size="16" class="check-icon check-icon--error" />
                  <span>投放或运营团队</span>
                </div>
                <div class="team-item">
                  <Check v-if="customerDetail.basicInfo.hasBrandTeam" :size="16" class="check-icon check-icon--success" />
                  <X v-else :size="16" class="check-icon check-icon--error" />
                  <span>品牌及内容团队</span>
                </div>
              </div>
            </div>

            <div class="info-section">
              <div class="section-header">
                <h4 class="subsection-title">联系人信息</h4>
                <button v-if="!isEditMode" class="action-btn action-btn--secondary" @click="showContactModal = true">
                  <Plus :size="16" />
                  添加联系人
                </button>
              </div>
              <div class="contact-list">
                <div v-for="contact in customerDetail.basicInfo.contactPersons" :key="contact.id" class="contact-card">
                  <div class="contact-header">
                    <div class="contact-avatar">
                      {{ contact.name.charAt(0).toUpperCase() }}
                    </div>
                    <div class="contact-info">
                      <div class="contact-name">
                        {{ contact.name }}
                        <span v-if="contact.isPrimary" class="primary-badge">主要联系人</span>
                      </div>
                      <div class="contact-position">{{ contact.position }}</div>
                    </div>
                    <div v-if="!isEditMode" class="contact-actions">
                      <button class="icon-btn" @click="editContact(contact)" title="编辑联系人">
                        <Edit :size="14" />
                      </button>
                      <button class="icon-btn icon-btn--danger" @click="deleteContact(contact.id)" title="删除联系人">
                        <X :size="14" />
                      </button>
                    </div>
                  </div>
                  <div class="contact-details">
                    <div class="contact-item">
                      <Phone :size="14" />
                      <span>{{ contact.phone }}</span>
                    </div>
                    <div class="contact-item">
                      <Mail :size="14" />
                      <span>{{ contact.email }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 编辑模式 -->
          <div v-else class="edit-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">服务团队</label>
                <select
                  v-model="editFormData.basicInfo.serviceTeam"
                  class="form-select"
                  :class="{ 'form-input--error': formErrors.serviceTeam }"
                >
                  <option value="">请选择服务团队</option>
                  <option value="时尚组">时尚组</option>
                  <option value="科技组">科技组</option>
                  <option value="美妆组">美妆组</option>
                  <option value="运动组">运动组</option>
                  <option value="家居组">家居组</option>
                  <option value="运营1组">运营1组</option>
                  <option value="综合组">综合组</option>
                </select>
                <span v-if="formErrors.serviceTeam" class="error-message">{{ formErrors.serviceTeam }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">客户行业</label>
                <select
                  v-model="editFormData.basicInfo.industry"
                  class="form-select"
                  :class="{ 'form-input--error': formErrors.industry }"
                >
                  <option value="">请选择客户行业</option>
                  <option value="时尚服装">时尚服装</option>
                  <option value="数码科技">数码科技</option>
                  <option value="美容护肤">美容护肤</option>
                  <option value="体育用品">体育用品</option>
                  <option value="家居装饰">家居装饰</option>
                  <option value="食品饮料">食品饮料</option>
                  <option value="汽车配件">汽车配件</option>
                  <option value="母婴用品">母婴用品</option>
                  <option value="其他">其他</option>
                </select>
                <span v-if="formErrors.industry" class="error-message">{{ formErrors.industry }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">商业及生产模式</label>
                <select
                  v-model="editFormData.basicInfo.businessModel"
                  class="form-select"
                  :class="{ 'form-input--error': formErrors.businessModel }"
                >
                  <option value="">请选择商业及生产模式</option>
                  <option value="工贸一体化的B2B外贸工厂">工贸一体化的B2B外贸工厂</option>
                  <option value="平台精品卖家">平台精品卖家</option>
                  <option value="中国本土品牌出海">中国本土品牌出海</option>
                </select>
                <span v-if="formErrors.businessModel" class="error-message">{{ formErrors.businessModel }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">海外三年内目标销售额规模</label>
                <input
                  v-model="editFormData.basicInfo.overseasSalesScale"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.overseasSalesScale }"
                  placeholder="如：100万美元/年"
                />
                <span v-if="formErrors.overseasSalesScale" class="error-message">{{ formErrors.overseasSalesScale }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">海外销售占比</label>
                <input
                  v-model.number="editFormData.basicInfo.overseasSalesRatio"
                  type="number"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.overseasSalesRatio }"
                  placeholder="请输入百分比数值"
                  min="0"
                  max="100"
                />
                <span v-if="formErrors.overseasSalesRatio" class="error-message">{{ formErrors.overseasSalesRatio }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">目标销售规模</label>
                <input
                  v-model="editFormData.basicInfo.targetSalesScale"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.targetSalesScale }"
                  placeholder="如：500万美元/年"
                />
                <span v-if="formErrors.targetSalesScale" class="error-message">{{ formErrors.targetSalesScale }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">主要销售渠道</label>
                <input
                  v-model="editFormData.basicInfo.mainSalesChannel"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.mainSalesChannel }"
                  placeholder="如：独立站、亚马逊、eBay等"
                />
                <span v-if="formErrors.mainSalesChannel" class="error-message">{{ formErrors.mainSalesChannel }}</span>
              </div>
            </div>

            <div class="form-section">
              <h4 class="subsection-title">团队配置</h4>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    v-model="editFormData.basicInfo.hasTechTeam"
                    type="checkbox"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">技术及素材制作团队</span>
                </label>
                <label class="checkbox-item">
                  <input
                    v-model="editFormData.basicInfo.hasOperationTeam"
                    type="checkbox"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">投放或运营团队</span>
                </label>
                <label class="checkbox-item">
                  <input
                    v-model="editFormData.basicInfo.hasBrandTeam"
                    type="checkbox"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">品牌及内容团队</span>
                </label>
              </div>
            </div>

            <div class="form-group form-group--full">
              <label class="form-label">合作转移情况</label>
              <select
                v-model="editFormData.basicInfo.cooperationTransfer"
                class="form-select"
              >
                <option value="">请选择合作转移情况</option>
                <option value="服务商转移">服务商转移</option>
                <option value="内部团队转移">内部团队转移</option>
                <option value="新合作">新合作</option>
              </select>
            </div>
          </div>
        </div>

        <!-- 独立站情况及目标 -->
        <div class="content-section">
          <h3 class="section-title">
            <Globe :size="20" />
            独立站情况及目标
          </h3>

          <!-- 查看模式 -->
          <div v-if="!isEditMode">
            <div class="info-grid">
              <div class="info-item">
                <label class="info-label">网站上线时间</label>
                <span class="info-value">{{ formatDate(customerDetail.websiteInfo.websiteLaunchTime) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">新品上线频率</label>
                <span class="info-value">{{ customerDetail.websiteInfo.newProductFrequency }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">去年销售额</label>
                <span class="info-value">${{ formatNumber(customerDetail.websiteInfo.lastYearSales) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">年度销售目标</label>
                <span class="info-value">${{ formatNumber(customerDetail.websiteInfo.annualSalesTarget) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">年度成本目标</label>
                <span class="info-value">${{ formatNumber(customerDetail.websiteInfo.annualCostTarget) }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">成本占比</label>
                <span class="info-value">{{ customerDetail.websiteInfo.costRatio }}%</span>
              </div>
              <div class="info-item">
                <label class="info-label">价格定位策略</label>
                <span class="info-value">{{ customerDetail.websiteInfo.pricingStrategy }}</span>
              </div>
              <div class="info-item">
                <label class="info-label">库存状态</label>
                <span class="status-indicator" :class="customerDetail.websiteInfo.inventoryStatus ? 'status-indicator--success' : 'status-indicator--warning'">
                  {{ customerDetail.websiteInfo.inventoryStatus ? '有库存' : '无库存' }}
                </span>
              </div>
            </div>

            <div class="info-section">
              <h4 class="subsection-title">目标市场</h4>
              <div class="tag-list">
                <span v-for="market in customerDetail.websiteInfo.targetMarkets" :key="market" class="tag">
                  {{ market }}
                </span>
              </div>
            </div>

            <div class="info-item info-item--full">
              <label class="info-label">主要推广产品</label>
              <div class="info-value info-value--text">
                {{ customerDetail.websiteInfo.mainProducts }}
              </div>
            </div>

            <div class="info-item info-item--full">
              <label class="info-label">产品优势卖点</label>
              <div class="info-value info-value--text">
                {{ customerDetail.websiteInfo.productAdvantages }}
              </div>
            </div>
          </div>

          <!-- 编辑模式 -->
          <div v-else class="edit-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">网站上线时间</label>
                <input
                  v-model="editFormData.websiteInfo.websiteLaunchTime"
                  type="date"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.websiteLaunchTime }"
                />
                <span v-if="formErrors.websiteLaunchTime" class="error-message">{{ formErrors.websiteLaunchTime }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">新品上线频率</label>
                <select
                  v-model="editFormData.websiteInfo.newProductFrequency"
                  class="form-select"
                  :class="{ 'form-input--error': formErrors.newProductFrequency }"
                >
                  <option value="">请选择新品上线频率</option>
                  <option value="每周">每周</option>
                  <option value="每月">每月</option>
                  <option value="每季度">每季度</option>
                  <option value="每半年">每半年</option>
                  <option value="每年">每年</option>
                  <option value="不定期">不定期</option>
                </select>
                <span v-if="formErrors.newProductFrequency" class="error-message">{{ formErrors.newProductFrequency }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">去年销售额</label>
                <input
                  v-model.number="editFormData.websiteInfo.lastYearSales"
                  type="number"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.lastYearSales }"
                  placeholder="请输入美元金额"
                  min="0"
                />
                <span v-if="formErrors.lastYearSales" class="error-message">{{ formErrors.lastYearSales }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">年度销售目标</label>
                <input
                  v-model.number="editFormData.websiteInfo.annualSalesTarget"
                  type="number"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.annualSalesTarget }"
                  placeholder="请输入美元金额"
                  min="0"
                />
                <span v-if="formErrors.annualSalesTarget" class="error-message">{{ formErrors.annualSalesTarget }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">年度成本目标</label>
                <input
                  v-model.number="editFormData.websiteInfo.annualCostTarget"
                  type="number"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.annualCostTarget }"
                  placeholder="请输入美元金额"
                  min="0"
                />
                <span v-if="formErrors.annualCostTarget" class="error-message">{{ formErrors.annualCostTarget }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">成本占比</label>
                <input
                  v-model.number="editFormData.websiteInfo.costRatio"
                  type="number"
                  class="form-input"
                  :class="{ 'form-input--error': formErrors.costRatio }"
                  placeholder="请输入百分比数值"
                  min="0"
                  max="100"
                />
                <span v-if="formErrors.costRatio" class="error-message">{{ formErrors.costRatio }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">价格定位策略</label>
                <select
                  v-model="editFormData.websiteInfo.pricingStrategy"
                  class="form-select"
                  :class="{ 'form-input--error': formErrors.pricingStrategy }"
                >
                  <option value="">请选择价格定位策略</option>
                  <option value="同价">同价</option>
                  <option value="独立站价格更高">独立站价格更高</option>
                  <option value="第三方平台价格更高">第三方平台价格更高</option>
                  <option value="不同产品不同定价策略">不同产品不同定价策略</option>
                </select>
                <span v-if="formErrors.pricingStrategy" class="error-message">{{ formErrors.pricingStrategy }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">库存状态</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input
                      v-model="editFormData.websiteInfo.inventoryStatus"
                      type="radio"
                      :value="true"
                      class="radio-input"
                    />
                    <span class="radio-label">有库存</span>
                  </label>
                  <label class="radio-item">
                    <input
                      v-model="editFormData.websiteInfo.inventoryStatus"
                      type="radio"
                      :value="false"
                      class="radio-input"
                    />
                    <span class="radio-label">无库存</span>
                  </label>
                </div>
              </div>
            </div>

            <div class="form-group form-group--full">
              <label class="form-label required">主要推广产品</label>
              <textarea
                v-model="editFormData.websiteInfo.mainProducts"
                class="form-textarea"
                :class="{ 'form-input--error': formErrors.mainProducts }"
                placeholder="请描述主要推广的产品"
                rows="3"
              ></textarea>
              <span v-if="formErrors.mainProducts" class="error-message">{{ formErrors.mainProducts }}</span>
            </div>

            <div class="form-group form-group--full">
              <label class="form-label required">目标市场</label>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    value="美国"
                    v-model="editFormData.websiteInfo.targetMarkets"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">美国</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    value="欧洲"
                    v-model="editFormData.websiteInfo.targetMarkets"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">欧洲</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    value="加拿大"
                    v-model="editFormData.websiteInfo.targetMarkets"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">加拿大</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    value="澳大利亚"
                    v-model="editFormData.websiteInfo.targetMarkets"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">澳大利亚</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    value="日本"
                    v-model="editFormData.websiteInfo.targetMarkets"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">日本</span>
                </label>
                <label class="checkbox-item">
                  <input
                    type="checkbox"
                    value="其他国家"
                    v-model="editFormData.websiteInfo.targetMarkets"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">其他国家</span>
                </label>
              </div>
            </div>

            <div class="form-group form-group--full">
              <label class="form-label required">产品优势卖点</label>
              <textarea
                v-model="editFormData.websiteInfo.productAdvantages"
                class="form-textarea"
                :class="{ 'form-input--error': formErrors.productAdvantages }"
                placeholder="请描述产品的优势和卖点"
                rows="3"
              ></textarea>
              <span v-if="formErrors.productAdvantages" class="error-message">{{ formErrors.productAdvantages }}</span>
            </div>
          </div>
        </div>

        <!-- 竞对情况 -->
        <div class="content-section">
          <div class="section-header">
            <h3 class="section-title">
              <Users :size="20" />
              竞争对手情况
            </h3>
            <button v-if="!isEditMode" class="action-btn action-btn--primary" @click="showCompetitorModal = true">
              <Plus :size="16" />
              添加竞对
            </button>
          </div>
          <div class="competitor-list">
            <div v-for="competitor in customerDetail.competitorInfo.competitorWebsites" :key="competitor.id" class="competitor-card">
              <div class="competitor-header">
                <div class="competitor-info">
                  <h4 class="competitor-name">{{ competitor.companyName }}</h4>
                  <a :href="competitor.websiteUrl" target="_blank" class="competitor-url">
                    <ExternalLink :size="14" />
                    {{ competitor.websiteUrl }}
                  </a>
                </div>
                <div v-if="!isEditMode" class="competitor-actions">
                  <button class="icon-btn" @click="editCompetitor(competitor)" title="编辑竞对">
                    <Edit :size="14" />
                  </button>
                  <button class="icon-btn icon-btn--danger" @click="deleteCompetitor(competitor.id)" title="删除竞对">
                    <X :size="14" />
                  </button>
                </div>
              </div>
              <div v-if="competitor.notes" class="competitor-notes">
                <p>{{ competitor.notes }}</p>
              </div>
            </div>
          </div>
          <div v-if="customerDetail.competitorInfo.competitorWebsites.length === 0" class="empty-state">
            <p>暂无竞争对手信息</p>
            <button class="action-btn action-btn--primary" @click="showCompetitorModal = true">
              <Plus :size="16" />
              添加第一个竞对
            </button>
          </div>
        </div>

        <!-- 特别关注事项 -->
        <div class="content-section">
          <h3 class="section-title">
            <AlertTriangle :size="20" />
            特别关注事项
          </h3>

          <!-- 查看模式 -->
          <div v-if="!isEditMode">
            <div class="attention-grid">
              <div class="attention-item">
                <h4 class="attention-title">
                  <Target :size="16" />
                  客户期望
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.customerExpectations || '无特殊期望' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <MessageCircle :size="16" />
                  沟通偏好
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.communicationPreferences || '无特殊偏好' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <AlertTriangle :size="16" />
                  特殊要求
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.specialRequirements || '无特殊要求' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <Globe :size="16" />
                  文化考虑
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.culturalConsiderations || '无特殊考虑' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <Clock :size="16" />
                  时区偏好
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.timeZonePreferences || '无特殊偏好' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <Languages :size="16" />
                  语言偏好
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.languagePreferences || '无特殊偏好' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <Users :size="16" />
                  决策者信息
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.decisionMakers || '信息不详' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <DollarSign :size="16" />
                  预算限制
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.budgetConstraints || '无特殊限制' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <Shield :size="16" />
                  合规要求
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.complianceRequirements || '无特殊要求' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <AlertTriangle :size="16" />
                  风险因素
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.riskFactors || '无特殊风险' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <TrendingUp :size="16" />
                  成功因素
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.successFactors || '无特殊因素' }}</p>
              </div>
              <div class="attention-item">
                <h4 class="attention-title">
                  <History :size="16" />
                  历史问题
                </h4>
                <p class="attention-content">{{ customerDetail.specialAttention.historicalIssues || '无历史问题' }}</p>
              </div>
            </div>
          </div>

          <!-- 编辑模式 -->
          <div v-else class="edit-form">
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label">客户期望</label>
                <textarea
                  v-model="editFormData.specialAttention.customerExpectations"
                  class="form-textarea"
                  placeholder="请描述客户的期望和目标"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">沟通偏好</label>
                <textarea
                  v-model="editFormData.specialAttention.communicationPreferences"
                  class="form-textarea"
                  placeholder="请描述客户的沟通偏好"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">特殊要求</label>
                <textarea
                  v-model="editFormData.specialAttention.specialRequirements"
                  class="form-textarea"
                  placeholder="请描述客户的特殊要求"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">文化考虑</label>
                <textarea
                  v-model="editFormData.specialAttention.culturalConsiderations"
                  class="form-textarea"
                  placeholder="请描述需要考虑的文化因素"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">时区偏好</label>
                <input
                  v-model="editFormData.specialAttention.timeZonePreferences"
                  type="text"
                  class="form-input"
                  placeholder="如：北京时间、美东时间等"
                />
              </div>

              <div class="form-group">
                <label class="form-label">语言偏好</label>
                <input
                  v-model="editFormData.specialAttention.languagePreferences"
                  type="text"
                  class="form-input"
                  placeholder="如：中文、英文、日文等"
                />
              </div>

              <div class="form-group">
                <label class="form-label">决策者信息</label>
                <textarea
                  v-model="editFormData.specialAttention.decisionMakers"
                  class="form-textarea"
                  placeholder="请描述关键决策者的信息"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">预算限制</label>
                <textarea
                  v-model="editFormData.specialAttention.budgetConstraints"
                  class="form-textarea"
                  placeholder="请描述预算限制和约束"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">合规要求</label>
                <textarea
                  v-model="editFormData.specialAttention.complianceRequirements"
                  class="form-textarea"
                  placeholder="请描述合规和法律要求"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">风险因素</label>
                <textarea
                  v-model="editFormData.specialAttention.riskFactors"
                  class="form-textarea"
                  placeholder="请描述潜在的风险因素"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">成功因素</label>
                <textarea
                  v-model="editFormData.specialAttention.successFactors"
                  class="form-textarea"
                  placeholder="请描述成功的关键因素"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">历史问题</label>
                <textarea
                  v-model="editFormData.specialAttention.historicalIssues"
                  class="form-textarea"
                  placeholder="请描述历史问题和解决方案"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- Q&A记录 -->
        <div class="content-section">
          <div class="section-header">
            <h3 class="section-title">
              <MessageCircle :size="20" />
              Q&A记录
            </h3>
            <button class="action-btn action-btn--primary" @click="addQA">
              <Plus :size="16" />
              添加Q&A
            </button>
          </div>
          <div class="qa-list">
            <div v-for="qa in customerDetail.qaRecords" :key="qa.id" class="qa-card">
              <div class="qa-header">
                <div class="qa-meta">
                  <span class="qa-category">{{ qa.issueCategory }}</span>
                  <span class="qa-date">{{ formatDate(qa.issueDate) }}</span>
                  <span class="impact-badge" :class="`impact-badge--${qa.impactLevel}`">
                    {{ getImpactText(qa.impactLevel) }}
                  </span>
                  <span class="qa-status-badge" :class="`qa-status-badge--${qa.status}`">
                    {{ getQAStatusText(qa.status) }}
                  </span>
                </div>
              </div>
              <div class="qa-content">
                <div class="qa-section">
                  <h5 class="qa-section-title">问题描述</h5>
                  <p class="qa-text">{{ qa.issueDescription }}</p>
                </div>
                <div class="qa-section">
                  <h5 class="qa-section-title">根本原因</h5>
                  <p class="qa-text">{{ qa.rootCause }}</p>
                </div>
                <div class="qa-section">
                  <h5 class="qa-section-title">解决方案</h5>
                  <p class="qa-text">{{ qa.immediateSolution }}</p>
                </div>
                <div class="qa-section">
                  <h5 class="qa-section-title">改正措施</h5>
                  <p class="qa-text">{{ qa.correctiveMeasures }}</p>
                </div>
                <div class="qa-section">
                  <h5 class="qa-section-title">预防措施</h5>
                  <p class="qa-text">{{ qa.preventiveMeasures || '暂无预防措施' }}</p>
                </div>
                <div class="qa-section">
                  <h5 class="qa-section-title">后续行动</h5>
                  <p class="qa-text">{{ qa.followUpActions || '暂无后续行动' }}</p>
                </div>
                <div class="qa-section">
                  <h5 class="qa-section-title">经验教训</h5>
                  <p class="qa-text">{{ qa.lessonsLearned || '暂无经验教训记录' }}</p>
                </div>
                <div v-if="qa.attachments && qa.attachments.length > 0" class="qa-section">
                  <h5 class="qa-section-title">相关附件</h5>
                  <div class="attachment-list">
                    <a v-for="attachment in qa.attachments" :key="attachment" :href="attachment" target="_blank" class="attachment-link">
                      <File :size="14" />
                      {{ attachment.split('/').pop() }}
                    </a>
                  </div>
                </div>
                <div class="qa-footer">
                  <div class="qa-info">
                    <span>负责人：{{ qa.responsiblePerson }}</span>
                    <span>完成期限：{{ formatDate(qa.dueDate) }}</span>
                    <span v-if="qa.actualCompletionDate">实际完成：{{ formatDate(qa.actualCompletionDate) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="customerDetail.qaRecords.length === 0" class="empty-state">
            <MessageSquare :size="48" />
            <p>暂无Q&A记录</p>
            <button class="action-btn action-btn--primary" @click="addQA">
              <Plus :size="16" />
              添加第一条Q&A
            </button>
          </div>
        </div>

        <!-- 续费跟进 -->
        <div class="content-section">
          <h3 class="section-title">
            <RefreshCw :size="20" />
            续费跟进需注意
          </h3>
            <div class="renewal-content">
              <div class="renewal-notes">
                <h4 class="renewal-title">续费备注</h4>
                <div class="renewal-text">
                  {{ customerDetail.renewalNotes || '暂无续费备注' }}
                </div>
              </div>

              <div class="renewal-accounts">
                <h4 class="renewal-title">关联广告账户</h4>
                <div v-for="(accounts, platform) in groupedAccounts" :key="platform" class="platform-group">
                  <h5 class="platform-title">{{ getPlatformName(platform) }}</h5>
                  <div class="account-list">
                    <div v-for="account in accounts" :key="account.id" class="account-card">
                      <div class="account-header">
                        <div class="platform-icon" :class="`platform-icon--${account.platform}`">
                          {{ getPlatformIcon(account.platform) }}
                        </div>
                        <div class="account-info">
                          <h6 class="account-name">{{ account.accountName }}</h6>
                          <span class="account-id">{{ account.accountId }}</span>
                        </div>
                        <span class="account-status" :class="`account-status--${account.status}`">
                          {{ getAccountStatusText(account.status) }}
                        </span>
                      </div>
                      <div class="account-details">
                        <div class="account-balance">
                          <span class="balance-label">余额：</span>
                          <span class="balance-value" :class="account.balance < 1000 ? 'balance-low' : ''">
                            ${{ formatNumber(account.balance) }}
                          </span>
                        </div>
                        <div v-if="account.dailySpend && account.dailySpend > 0" class="account-days">
                          <span class="days-label">预计可用：</span>
                          <span class="days-value" :class="getEstimatedDays(account) < 7 ? 'days-low' : ''">
                            {{ getEstimatedDays(account) }}天
                          </span>
                        </div>
                        <div v-else class="account-days">
                          <span class="days-label">预计可用：</span>
                          <span class="days-value">无限制</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
        </div>
          </div>

          <!-- 合作项目标签页 -->
          <div v-if="activeTab === 'projects'" class="projects-content">
            <div class="content-section">
              <div class="section-header">
                <h3 class="section-title">
                  <Briefcase :size="20" />
                  合作项目
                </h3>
                <button class="action-btn action-btn--primary" @click="showCreateProject = true">
                  <Plus :size="16" />
                  新建项目
                </button>
              </div>

              <!-- 项目筛选 -->
              <div class="project-filters">
                <div class="filter-group">
                  <select v-model="projectFilter.status" class="filter-select">
                    <option value="">全部状态</option>
                    <option value="active">进行中</option>
                    <option value="completed">已完成</option>
                    <option value="paused">已暂停</option>
                    <option value="cancelled">已取消</option>
                  </select>
                  <select v-model="projectFilter.type" class="filter-select">
                    <option value="">全部类型</option>
                    <option value="new_customer">新客户</option>
                    <option value="redevelopment">二次开发</option>
                    <option value="reactivation">失效复活</option>
                  </select>
                  <input
                    v-model="projectFilter.search"
                    type="text"
                    placeholder="搜索项目名称或合同编号"
                    class="filter-input"
                  />
                </div>
              </div>

              <!-- 项目列表 -->
              <div class="projects-table-container">
                <table class="projects-table">
                  <thead>
                    <tr>
                      <th>项目名称</th>
                      <th>项目时间</th>
                      <th>项目类型</th>
                      <th>项目状态</th>
                      <th>合作平台</th>
                      <th>合同编号</th>
                      <th>服务费</th>
                      <th>余额</th>
                      <th>负责团队</th>
                      <th>操作</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="project in filteredProjects" :key="project.id" class="project-row">
                      <td class="project-name-cell">
                        <div class="project-name">{{ project.name }}</div>
                        <div class="project-id">{{ project.id }}</div>
                      </td>
                      <td class="project-duration">
                        <div>{{ formatDate(project.startDate) }}</div>
                        <div v-if="project.endDate" class="text-secondary">至 {{ formatDate(project.endDate) }}</div>
                        <div v-else class="text-secondary">进行中</div>
                      </td>
                      <td>
                        <span class="project-type-badge" :class="`type-badge--${project.projectType}`">
                          {{ getProjectTypeText(project.projectType) }}
                        </span>
                      </td>
                      <td>
                        <span class="project-status-badge" :class="`status-badge--${project.status}`">
                          {{ getProjectStatusText(project.status) }}
                        </span>
                      </td>
                      <td>
                        <div class="platform-tags">
                          <span v-for="platform in project.cooperationPlatforms" :key="platform" class="platform-tag">
                            {{ platform }}
                          </span>
                        </div>
                      </td>
                      <td class="contract-number">{{ project.contractNumber || '-' }}</td>
                      <td class="service-fee">${{ formatNumber(project.serviceFee || 0) }}</td>
                      <td class="balance" :class="{ 'balance-low': (project.balance || 0) < 1000 }">
                        ${{ formatNumber(project.balance || 0) }}
                      </td>
                      <td class="operation-team">{{ project.operationTeam || '-' }}</td>
                      <td class="project-actions">
                        <div class="action-buttons">
                          <button class="action-btn action-btn--small" @click="viewProjectDashboard(project)">
                            <BarChart3 :size="14" />
                            <span>数据面板</span>
                          </button>
                          <button class="action-btn action-btn--small" @click="manageProjectGoals(project)">
                            <Target :size="14" />
                            <span>项目目标</span>
                          </button>
                          <button class="action-btn action-btn--small" @click="manageProjectAccounts(project)">
                            <CreditCard :size="14" />
                            <span>投放账号</span>
                          </button>
                          <button class="action-btn action-btn--small" @click="viewProjectReports(project)">
                            <FileText :size="14" />
                            <span>项目报告</span>
                          </button>
                          <button class="action-btn action-btn--small" @click="editProject(project)">
                            <Edit :size="14" />
                            <span>编辑项目</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div v-if="filteredProjects.length === 0" class="empty-state">
                  <Briefcase :size="48" />
                  <p>{{ projectFilter.search || projectFilter.status || projectFilter.type ? '没有找到匹配的项目' : '暂无合作项目' }}</p>
                  <button class="action-btn action-btn--primary" @click="showCreateProject = true">
                    <Plus :size="16" />
                    新建项目
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- 续费记录标签页 -->
          <div v-if="activeTab === 'renewals'" class="renewals-content">
            <div class="content-section">
              <div class="section-header">
                <h3 class="section-title">
                  <RefreshCw :size="20" />
                  服务费管理
                </h3>
                <div class="section-actions">
                  <button class="action-btn action-btn--primary" @click="showAddPaymentModal = true">
                    <Plus :size="16" />
                    添加服务费
                  </button>
                  <button class="action-btn action-btn--secondary" @click="goToServiceFee">
                    <DollarSign :size="16" />
                    查看完整服务费记录
                  </button>
                </div>
              </div>

              <div class="service-fee-summary">
                <div class="summary-cards">
                  <div class="summary-card">
                    <div class="card-header">
                      <h4>总收款金额</h4>
                      <DollarSign :size="20" class="card-icon" />
                    </div>
                    <div class="card-value">$48,000</div>
                    <div class="card-desc">累计服务费收款</div>
                  </div>

                  <div class="summary-card">
                    <div class="card-header">
                      <h4>收款次数</h4>
                      <CreditCard :size="20" class="card-icon" />
                    </div>
                    <div class="card-value">3</div>
                    <div class="card-desc">首次付款 + 续费</div>
                  </div>

                  <div class="summary-card">
                    <div class="card-header">
                      <h4>最近收款</h4>
                      <Calendar :size="20" class="card-icon" />
                    </div>
                    <div class="card-value">2025/3/10</div>
                    <div class="card-desc">上次收款日期</div>
                  </div>
                </div>

                <div class="recent-payments">
                  <h4 class="subsection-title">最近收款记录</h4>
                  <div class="payment-table-container">
                    <table class="payment-table">
                      <thead>
                        <tr>
                          <th>客户名称</th>
                          <th>项目名称</th>
                          <th>收款日期</th>
                          <th>收款金额</th>
                          <th>服务周期</th>
                          <th>收款类型</th>
                          <th>备注</th>
                          <th>创建人</th>
                          <th>创建时间</th>
                          <th>操作</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>时尚潮流服饰有限公司</td>
                          <td>春季新品推广</td>
                          <td>2024/12/15</td>
                          <td class="amount-cell">$32,000.00</td>
                          <td>1年</td>
                          <td><span class="payment-type-badge续费">续费</span></td>
                          <td>2025年度服务费续费</td>
                          <td>张财务</td>
                          <td>2024/12/15 13:30:00</td>
                          <td>
                            <button class="table-action-btn">
                              <Edit :size="14" />
                              编辑
                            </button>
                            <button class="table-action-btn table-action-btn--danger">
                              <X :size="14" />
                              删除
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>有机食品专营</td>
                          <td>有机蔬菜推广</td>
                          <td>2024/10/25</td>
                          <td class="amount-cell">$24,000.00</td>
                          <td>6个月</td>
                          <td><span class="payment-type-badge首次付款">首次付款</span></td>
                          <td>有机蔬菜推广服务</td>
                          <td>何财务</td>
                          <td>2024/10/25 11:20:00</td>
                          <td>
                            <button class="table-action-btn">
                              <Edit :size="14" />
                              编辑
                            </button>
                            <button class="table-action-btn table-action-btn--danger">
                              <X :size="14" />
                              删除
                            </button>
                          </td>
                        </tr>
                        <tr>
                          <td>智能家电科技</td>
                          <td>智能音箱营销</td>
                          <td>2024/10/5</td>
                          <td class="amount-cell">$16,000.00</td>
                          <td>3个月</td>
                          <td><span class="payment-type-badge续费">续费</span></td>
                          <td>智能音箱营销续费</td>
                          <td>刘财务</td>
                          <td>2024/10/5 09:30:00</td>
                          <td>
                            <button class="table-action-btn">
                              <Edit :size="14" />
                              编辑
                            </button>
                            <button class="table-action-btn table-action-btn--danger">
                              <X :size="14" />
                              删除
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="error-state">
        <AlertTriangle :size="48" />
        <p>客户信息加载失败</p>
        <button class="action-btn action-btn--primary" @click="loadCustomerDetail">
          <RefreshCw :size="16" />
          重新加载
        </button>
      </div>
    </div>

    <!-- 联系人编辑模态框 -->
    <div v-if="showContactModal" class="modal-overlay" @click="closeContactModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingContact ? '编辑联系人' : '添加联系人' }}</h3>
          <button class="modal-close" @click="closeContactModal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label required">姓名</label>
              <input
                v-model="contactForm.name"
                type="text"
                class="form-input"
                placeholder="请输入联系人姓名"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label required">职位</label>
              <input
                v-model="contactForm.position"
                type="text"
                class="form-input"
                placeholder="请输入职位"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label required">电话</label>
              <input
                v-model="contactForm.phone"
                type="tel"
                class="form-input"
                placeholder="请输入电话号码"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label required">邮箱</label>
              <input
                v-model="contactForm.email"
                type="email"
                class="form-input"
                placeholder="请输入邮箱地址"
                required
              />
            </div>
            <div class="form-group form-group--full">
              <label class="checkbox-item">
                <input
                  v-model="contactForm.isPrimary"
                  type="checkbox"
                  class="checkbox-input"
                />
                <span class="checkbox-label">设为主要联系人</span>
              </label>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn action-btn--secondary" @click="closeContactModal">
            取消
          </button>
          <button class="action-btn action-btn--primary" @click="saveContact">
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 竞对编辑模态框 -->
    <div v-if="showCompetitorModal" class="modal-overlay" @click="closeCompetitorModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>{{ editingCompetitor ? '编辑竞争对手' : '添加竞争对手' }}</h3>
          <button class="modal-close" @click="closeCompetitorModal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label required">公司名称</label>
            <input
              v-model="competitorForm.companyName"
              type="text"
              class="form-input"
              placeholder="请输入竞争对手公司名称"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label required">网站地址</label>
            <input
              v-model="competitorForm.websiteUrl"
              type="url"
              class="form-input"
              placeholder="请输入完整的网站地址，如：https://example.com"
              required
            />
          </div>
          <div class="form-group">
            <label class="form-label">备注</label>
            <textarea
              v-model="competitorForm.notes"
              class="form-textarea"
              placeholder="请输入备注信息"
              rows="3"
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn action-btn--secondary" @click="closeCompetitorModal">
            取消
          </button>
          <button class="action-btn action-btn--primary" @click="saveCompetitor">
            保存
          </button>
        </div>
      </div>
    </div>

    <!-- 添加服务费模态框 -->
    <div v-if="showAddPaymentModal" class="modal-overlay" @click="closeAddPaymentModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>新建收款记录</h3>
          <button class="modal-close" @click="closeAddPaymentModal">
            <X :size="20" />
          </button>
        </div>
        <div class="modal-body">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label required">客户名称</label>
              <select v-model="paymentForm.customerName" class="form-select">
                <option value="">请选择客户</option>
                <option value="时尚潮流服饰有限公司">时尚潮流服饰有限公司</option>
                <option value="有机食品专营">有机食品专营</option>
                <option value="智能家电科技">智能家电科技</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">项目名称</label>
              <select v-model="paymentForm.projectName" class="form-select">
                <option value="">请选择项目</option>
                <option value="春季新品推广">春季新品推广</option>
                <option value="有机蔬菜推广">有机蔬菜推广</option>
                <option value="智能音箱营销">智能音箱营销</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">收款日期</label>
              <input
                v-model="paymentForm.paymentDate"
                type="date"
                class="form-input"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label required">收款金额</label>
              <input
                v-model.number="paymentForm.paymentAmount"
                type="number"
                class="form-input"
                placeholder="0"
                min="0"
                step="0.01"
                required
              />
            </div>
            <div class="form-group">
              <label class="form-label required">服务周期</label>
              <select v-model="paymentForm.servicePeriod" class="form-select">
                <option value="">请选择服务周期</option>
                <option value="1个月">1个月</option>
                <option value="3个月">3个月</option>
                <option value="6个月">6个月</option>
                <option value="1年">1年</option>
              </select>
            </div>
            <div class="form-group">
              <label class="form-label required">收款类型</label>
              <div class="radio-group">
                <label class="radio-item">
                  <input
                    v-model="paymentForm.paymentType"
                    type="radio"
                    value="首次付款"
                    class="radio-input"
                  />
                  <span class="radio-label">首次付款</span>
                </label>
                <label class="radio-item">
                  <input
                    v-model="paymentForm.paymentType"
                    type="radio"
                    value="续费"
                    class="radio-input"
                  />
                  <span class="radio-label">续费</span>
                </label>
              </div>
            </div>
          </div>
          <div class="form-group form-group--full">
            <label class="form-label">备注</label>
            <textarea
              v-model="paymentForm.notes"
              class="form-textarea"
              placeholder="请输入备注信息（可选）"
              rows="3"
              maxlength="200"
            ></textarea>
            <div class="character-count">{{ paymentForm.notes.length }}/200</div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="action-btn action-btn--secondary" @click="closeAddPaymentModal">
            取消
          </button>
          <button class="action-btn action-btn--primary" @click="savePayment">
            保存
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Edit, MessageSquare, MoreHorizontal, Loader,
  Handshake, User, Globe, Users, AlertTriangle, MessageCircle,
  RefreshCw, Plus, Check, X, Phone, Mail, ExternalLink,
  Target, Clock, Languages, Shield, TrendingUp, History, DollarSign, Save, File, Briefcase,
  BarChart3, CreditCard, FileText, Calendar, Star
} from 'lucide-vue-next'
import { mockGetCustomerDetail } from '@/mock/customer'
import type { CustomerDetail, ContactPerson, CompetitorWebsite } from '@/types'

// 路由相关
const route = useRoute()
const router = useRouter()

// 响应式数据
const loading = ref(true)
const customerDetail = ref<CustomerDetail | null>(null)
const isEditMode = ref(false)
const saving = ref(false)
const activeTab = ref('info')
const showCreateProject = ref(false)
const showMoreActionsMenu = ref(false)
const moreActionsButton = ref<HTMLElement | null>(null)

// 项目筛选
const projectFilter = reactive({
  status: '',
  type: '',
  search: ''
})

// 联系人管理
const showContactModal = ref(false)
const editingContact = ref<ContactPerson | null>(null)
const contactForm = reactive({
  id: 0,
  name: '',
  position: '',
  phone: '',
  email: '',
  isPrimary: false
})

// 竞对管理
const showCompetitorModal = ref(false)
const editingCompetitor = ref<CompetitorWebsite | null>(null)
const competitorForm = reactive({
  id: 0,
  websiteUrl: '',
  companyName: '',
  notes: ''
})

// 服务费管理
const showAddPaymentModal = ref(false)
const paymentForm = reactive({
  customerName: '',
  projectName: '',
  paymentDate: '',
  paymentAmount: 0,
  servicePeriod: '',
  paymentType: '首次付款',
  notes: ''
})

// 编辑表单数据
const editFormData = reactive<CustomerDetail>({
  id: 0,
  cooperationDetails: {
    customerName: '',
    cooperationStartTime: '',
    serviceStartTime: '',
    cooperationType: '',
    signingSales: '',
    specialConditions: '',
    customerGrade: 'B',
    customerStatus: 'active'
  },
  basicInfo: {
    serviceTeam: '',
    contactPersons: [],
    industry: '',
    regions: [],
    businessModel: '',
    overseasSalesScale: '',
    overseasSalesRatio: 0,
    targetSalesScale: '',
    mainSalesChannel: '',
    hasTechTeam: false,
    hasOperationTeam: false,
    hasBrandTeam: false,
    cooperationTransfer: ''
  },
  websiteInfo: {
    newProductFrequency: '',
    websiteLaunchTime: '',
    lastYearSales: 0,
    targetMarkets: [],
    mainProducts: '',
    productAdvantages: '',
    pricingStrategy: '',
    inventoryStatus: true,
    annualSalesTarget: 0,
    annualCostTarget: 0,
    costRatio: 0
  },
  competitorInfo: {
    competitorWebsites: []
  },
  specialAttention: {
    customerExpectations: '',
    communicationPreferences: '',
    specialRequirements: '',
    culturalConsiderations: '',
    timeZonePreferences: '',
    languagePreferences: '',
    decisionMakers: '',
    budgetConstraints: '',
    complianceRequirements: '',
    riskFactors: '',
    successFactors: '',
    historicalIssues: ''
  },
  qaRecords: [],
  renewalNotes: '',
  projects: [],
  adAccounts: [],
  createdAt: '',
  lastUpdated: ''
})

// 表单验证错误
const formErrors = reactive<Record<string, string>>({})

// 计算属性
const customerId = computed(() => {
  return parseInt(route.params.id as string)
})

const groupedAccounts = computed(() => {
  if (!customerDetail.value?.adAccounts) return {}

  const groups: Record<string, any[]> = {}
  customerDetail.value.adAccounts.forEach(account => {
    if (!groups[account.platform]) {
      groups[account.platform] = []
    }
    groups[account.platform].push(account)
  })
  return groups
})

const filteredProjects = computed(() => {
  if (!customerDetail.value?.projects) return []

  let projects = [...customerDetail.value.projects]

  // 状态筛选
  if (projectFilter.status) {
    projects = projects.filter(project => project.status === projectFilter.status)
  }

  // 类型筛选
  if (projectFilter.type) {
    projects = projects.filter(project => project.projectType === projectFilter.type)
  }

  // 搜索筛选
  if (projectFilter.search) {
    const searchTerm = projectFilter.search.toLowerCase()
    projects = projects.filter(project =>
      project.name.toLowerCase().includes(searchTerm) ||
      project.contractNumber?.toLowerCase().includes(searchTerm)
    )
  }

  return projects
})

// 方法
const formatDate = (dateString: string): string => {
  if (!dateString) return '未设置'
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-CN')
}

const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M'
  } else if (num >= 1000) {
    return (num / 1000).toFixed(0) + 'K'
  }
  return num.toLocaleString()
}

const getStatusText = (status?: string): string => {
  const statusMap = {
    active: '活跃',
    inactive: '非活跃',
    suspended: '暂停'
  }
  return statusMap[status as keyof typeof statusMap] || '未知'
}

const getImpactText = (level: string): string => {
  const levelMap = {
    low: '低',
    medium: '中',
    high: '高',
    critical: '严重'
  }
  return levelMap[level as keyof typeof levelMap] || level
}

const getQAStatusText = (status: string): string => {
  const statusMap = {
    pending: '待处理',
    in_progress: '处理中',
    completed: '已完成',
    cancelled: '已取消'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getPlatformIcon = (platform: string): string => {
  const iconMap = {
    google: 'G',
    facebook: 'F',
    bing: 'B',
    criteo: 'C',
    other: 'O'
  }
  return iconMap[platform as keyof typeof iconMap] || platform.charAt(0).toUpperCase()
}

const getAccountStatusText = (status: string): string => {
  const statusMap = {
    active: '正常',
    paused: '暂停',
    limited: '受限',
    suspended: '停用'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getPlatformName = (platform: string): string => {
  const platformMap = {
    google: 'Google Ads',
    facebook: 'Meta广告',
    bing: 'Bing Ads',
    criteo: 'Criteo',
    other: '其他平台'
  }
  return platformMap[platform as keyof typeof platformMap] || platform
}

const getEstimatedDays = (account: any): number => {
  if (!account.dailySpend || account.dailySpend <= 0) return 999
  return Math.floor(account.balance / account.dailySpend)
}

const getProjectStatusText = (status: string): string => {
  const statusMap = {
    active: '进行中',
    completed: '已完成',
    paused: '已暂停',
    cancelled: '已取消'
  }
  return statusMap[status as keyof typeof statusMap] || status
}

const getProjectTypeText = (type?: string): string => {
  const typeMap = {
    new_customer: '新客户',
    redevelopment: '二次开发',
    reactivation: '失效复活'
  }
  return typeMap[type as keyof typeof typeMap] || type || '未知'
}

// 项目操作方法
const viewProjectDashboard = (project: any) => {
  console.log('查看项目面板数据:', project.name)
  // 这里可以跳转到项目数据看板页面
}

const manageProjectGoals = (project: any) => {
  console.log('管理项目目标:', project.name)
  // 这里可以打开项目目标管理弹窗或跳转页面
}

const manageProjectAccounts = (project: any) => {
  console.log('管理投放账号:', project.name)
  // 这里可以打开投放账号管理弹窗或跳转页面
}

const viewProjectReports = (project: any) => {
  console.log('查看项目报告:', project.name)
  // 这里可以跳转到项目报告页面
}

const editProject = (project: any) => {
  console.log('编辑项目:', project.name)
  // 这里可以打开项目编辑弹窗或跳转页面
}

const goBack = () => {
  router.push('/customers')
}

const goToServiceFee = () => {
  router.push('/dashboard/service-fee')
}

const editCustomer = () => {
  // 进入编辑模式
  router.push({
    name: 'customer-detail',
    params: { id: customerId.value.toString() },
    query: { edit: 'true' }
  })
}

const cancelEdit = () => {
  // 取消编辑模式，回到查看模式
  router.push({
    name: 'customer-detail',
    params: { id: customerId.value.toString() }
  })
}

const saveCustomer = async () => {
  if (saving.value) return

  // 表单验证
  if (!validateForm()) {
    console.log('表单验证失败，请检查输入')
    return
  }

  saving.value = true
  try {
    // 这里应该调用实际的保存API
    // const response = await mockUpdateCustomer(customerId.value, editFormData)

    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 更新本地数据
    if (customerDetail.value) {
      Object.assign(customerDetail.value, editFormData)
    }

    console.log('客户信息保存成功')

    // 保存成功后退出编辑模式
    router.push({
      name: 'customer-detail',
      params: { id: customerId.value.toString() }
    })
  } catch (error) {
    console.error('保存客户信息失败:', error)
    // 这里可以显示错误提示
  } finally {
    saving.value = false
  }
}

const addQA = () => {
  console.log('添加Q&A')
  // 这里可以打开Q&A添加弹窗
}

// 联系人管理方法
const editContact = (contact: ContactPerson) => {
  editingContact.value = contact
  Object.assign(contactForm, contact)
  showContactModal.value = true
}

const deleteContact = (contactId: number) => {
  if (confirm('确定要删除这个联系人吗？')) {
    if (customerDetail.value) {
      const index = customerDetail.value.basicInfo.contactPersons.findIndex(c => c.id === contactId)
      if (index > -1) {
        customerDetail.value.basicInfo.contactPersons.splice(index, 1)
      }
    }
  }
}

const saveContact = () => {
  // 这里应该添加联系人保存逻辑
  if (editingContact.value) {
    // 编辑现有联系人
    Object.assign(editingContact.value, contactForm)
  } else {
    // 添加新联系人
    if (customerDetail.value) {
      const newContact = {
        ...contactForm,
        id: Date.now() // 临时ID，实际应该由后端生成
      }
      customerDetail.value.basicInfo.contactPersons.push(newContact)
    }
  }
  closeContactModal()
}

const closeContactModal = () => {
  showContactModal.value = false
  editingContact.value = null
  Object.assign(contactForm, {
    id: 0,
    name: '',
    position: '',
    phone: '',
    email: '',
    isPrimary: false
  })
}

// 竞对管理方法
const editCompetitor = (competitor: CompetitorWebsite) => {
  editingCompetitor.value = competitor
  Object.assign(competitorForm, competitor)
  showCompetitorModal.value = true
}

const deleteCompetitor = (competitorId: number) => {
  if (confirm('确定要删除这个竞争对手吗？')) {
    if (customerDetail.value) {
      const index = customerDetail.value.competitorInfo.competitorWebsites.findIndex(c => c.id === competitorId)
      if (index > -1) {
        customerDetail.value.competitorInfo.competitorWebsites.splice(index, 1)
      }
    }
  }
}

const saveCompetitor = () => {
  // 验证网址格式
  if (!isValidUrl(competitorForm.websiteUrl)) {
    alert('请输入有效的网址')
    return
  }

  if (editingCompetitor.value) {
    // 编辑现有竞对
    Object.assign(editingCompetitor.value, competitorForm)
  } else {
    // 添加新竞对
    if (customerDetail.value) {
      const newCompetitor = {
        ...competitorForm,
        id: Date.now() // 临时ID，实际应该由后端生成
      }
      customerDetail.value.competitorInfo.competitorWebsites.push(newCompetitor)
    }
  }
  closeCompetitorModal()
}

const closeCompetitorModal = () => {
  showCompetitorModal.value = false
  editingCompetitor.value = null
  Object.assign(competitorForm, {
    id: 0,
    websiteUrl: '',
    companyName: '',
    notes: ''
  })
}

// 服务费管理方法
const closeAddPaymentModal = () => {
  showAddPaymentModal.value = false
  Object.assign(paymentForm, {
    customerName: '',
    projectName: '',
    paymentDate: '',
    paymentAmount: 0,
    servicePeriod: '',
    paymentType: '首次付款',
    notes: ''
  })
}

const savePayment = () => {
  // 这里应该添加保存逻辑
  console.log('保存服务费记录:', paymentForm)
  // 模拟保存成功
  closeAddPaymentModal()
}

// 网址验证
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// 更多操作菜单相关方法
const toggleMoreActions = () => {
  showMoreActionsMenu.value = !showMoreActionsMenu.value
}

// 客户操作方法 - 与客户列表保持一致
const viewCustomerProjects = () => {
  console.log('查看客户项目:', customerDetail.value?.cooperationDetails?.customerName)
  showMoreActionsMenu.value = false
  // 这里可以跳转到客户项目列表页面
}

const viewServiceFeeRecords = () => {
  console.log('查看服务费记录:', customerDetail.value?.cooperationDetails?.customerName)
  showMoreActionsMenu.value = false
  // 这里可以跳转到服务费记录列表页面
}

const viewReviewRecords = () => {
  console.log('查看客户评价:', customerDetail.value?.cooperationDetails?.customerName)
  showMoreActionsMenu.value = false
  // 这里可以跳转到客户评价列表页面
}

const viewCustomerAccount = () => {
  console.log('查看客户账号:', customerDetail.value?.cooperationDetails?.customerName)
  showMoreActionsMenu.value = false
  // 这里可以跳转到客户账号管理页面
}

const addCustomerQA = () => {
  console.log('添加客户Q&A:', customerDetail.value?.cooperationDetails?.customerName)
  showMoreActionsMenu.value = false
  addQA() // 调用现有的添加Q&A方法
}

const loadCustomerDetail = async () => {
  loading.value = true
  try {
    const response = await mockGetCustomerDetail(customerId.value)
    if (response.success && response.data) {
      customerDetail.value = response.data
      // 初始化编辑表单数据
      initializeEditForm(response.data)
    }
  } catch (error) {
    console.error('加载客户详情失败:', error)
  } finally {
    loading.value = false
  }
}

// 初始化编辑表单数据
const initializeEditForm = (data: CustomerDetail) => {
  Object.assign(editFormData, JSON.parse(JSON.stringify(data)))
  // 清空错误信息
  Object.keys(formErrors).forEach(key => {
    delete formErrors[key]
  })
}

// 表单验证
const validateField = (fieldName: string): boolean => {
  let isValid = true

  switch (fieldName) {
    case 'customerName':
      if (!editFormData.cooperationDetails.customerName.trim()) {
        formErrors.customerName = '客户名称不能为空'
        isValid = false
      } else {
        delete formErrors.customerName
      }
      break

    case 'cooperationType':
      if (!editFormData.cooperationDetails.cooperationType) {
        formErrors.cooperationType = '请选择合作方式'
        isValid = false
      } else {
        delete formErrors.cooperationType
      }
      break

    case 'signingSales':
      if (!editFormData.cooperationDetails.signingSales.trim()) {
        formErrors.signingSales = '签单销售人员不能为空'
        isValid = false
      } else {
        delete formErrors.signingSales
      }
      break

    case 'cooperationStartTime':
      if (!editFormData.cooperationDetails.cooperationStartTime) {
        formErrors.cooperationStartTime = '合作开始时间不能为空'
        isValid = false
      } else {
        delete formErrors.cooperationStartTime
      }
      break

    case 'serviceStartTime':
      if (!editFormData.cooperationDetails.serviceStartTime) {
        formErrors.serviceStartTime = '服务开始时间不能为空'
        isValid = false
      } else {
        delete formErrors.serviceStartTime
      }
      break

    case 'serviceTeam':
      if (!editFormData.basicInfo.serviceTeam) {
        formErrors.serviceTeam = '请选择服务团队'
        isValid = false
      } else {
        delete formErrors.serviceTeam
      }
      break

    case 'industry':
      if (!editFormData.basicInfo.industry) {
        formErrors.industry = '请选择客户行业'
        isValid = false
      } else {
        delete formErrors.industry
      }
      break

    case 'businessModel':
      if (!editFormData.basicInfo.businessModel) {
        formErrors.businessModel = '请选择商业及生产模式'
        isValid = false
      } else {
        delete formErrors.businessModel
      }
      break

    case 'overseasSalesScale':
      if (!editFormData.basicInfo.overseasSalesScale.trim()) {
        formErrors.overseasSalesScale = '海外三年内目标销售额规模不能为空'
        isValid = false
      } else {
        delete formErrors.overseasSalesScale
      }
      break

    case 'overseasSalesRatio':
      if (editFormData.basicInfo.overseasSalesRatio < 0 || editFormData.basicInfo.overseasSalesRatio > 100) {
        formErrors.overseasSalesRatio = '海外销售占比应在0-100之间'
        isValid = false
      } else {
        delete formErrors.overseasSalesRatio
      }
      break

    case 'targetSalesScale':
      if (!editFormData.basicInfo.targetSalesScale.trim()) {
        formErrors.targetSalesScale = '目标销售规模不能为空'
        isValid = false
      } else {
        delete formErrors.targetSalesScale
      }
      break

    case 'mainSalesChannel':
      if (!editFormData.basicInfo.mainSalesChannel.trim()) {
        formErrors.mainSalesChannel = '主要销售渠道不能为空'
        isValid = false
      } else {
        delete formErrors.mainSalesChannel
      }
      break

    case 'websiteLaunchTime':
      if (!editFormData.websiteInfo.websiteLaunchTime) {
        formErrors.websiteLaunchTime = '网站上线时间不能为空'
        isValid = false
      } else {
        delete formErrors.websiteLaunchTime
      }
      break

    case 'newProductFrequency':
      if (!editFormData.websiteInfo.newProductFrequency) {
        formErrors.newProductFrequency = '请选择新品上线频率'
        isValid = false
      } else {
        delete formErrors.newProductFrequency
      }
      break

    case 'lastYearSales':
      if (editFormData.websiteInfo.lastYearSales < 0) {
        formErrors.lastYearSales = '去年销售额不能为负数'
        isValid = false
      } else {
        delete formErrors.lastYearSales
      }
      break

    case 'annualSalesTarget':
      if (editFormData.websiteInfo.annualSalesTarget < 0) {
        formErrors.annualSalesTarget = '年度销售目标不能为负数'
        isValid = false
      } else {
        delete formErrors.annualSalesTarget
      }
      break

    case 'annualCostTarget':
      if (editFormData.websiteInfo.annualCostTarget < 0) {
        formErrors.annualCostTarget = '年度成本目标不能为负数'
        isValid = false
      } else {
        delete formErrors.annualCostTarget
      }
      break

    case 'costRatio':
      if (editFormData.websiteInfo.costRatio < 0 || editFormData.websiteInfo.costRatio > 100) {
        formErrors.costRatio = '成本占比应在0-100之间'
        isValid = false
      } else {
        delete formErrors.costRatio
      }
      break

    case 'pricingStrategy':
      if (!editFormData.websiteInfo.pricingStrategy) {
        formErrors.pricingStrategy = '请选择价格定位策略'
        isValid = false
      } else {
        delete formErrors.pricingStrategy
      }
      break

    case 'mainProducts':
      if (!editFormData.websiteInfo.mainProducts.trim()) {
        formErrors.mainProducts = '主要推广产品不能为空'
        isValid = false
      } else {
        delete formErrors.mainProducts
      }
      break

    case 'productAdvantages':
      if (!editFormData.websiteInfo.productAdvantages.trim()) {
        formErrors.productAdvantages = '产品优势卖点不能为空'
        isValid = false
      } else {
        delete formErrors.productAdvantages
      }
      break
  }

  return isValid
}

// 验证整个表单
const validateForm = (): boolean => {
  const requiredFields = [
    'customerName', 'cooperationType', 'signingSales', 'cooperationStartTime', 'serviceStartTime',
    'serviceTeam', 'industry', 'businessModel', 'overseasSalesScale', 'overseasSalesRatio',
    'targetSalesScale', 'mainSalesChannel', 'websiteLaunchTime', 'newProductFrequency',
    'lastYearSales', 'annualSalesTarget', 'annualCostTarget', 'costRatio', 'pricingStrategy',
    'mainProducts', 'productAdvantages'
  ]

  let isValid = true
  requiredFields.forEach(field => {
    if (!validateField(field)) {
      isValid = false
    }
  })

  return isValid
}

// 点击外部关闭下拉菜单
const handleClickOutside = (event: MouseEvent) => {
  if (showMoreActionsMenu.value && moreActionsButton.value && !moreActionsButton.value.contains(event.target as Node)) {
    showMoreActionsMenu.value = false
  }
}

// 生命周期
onMounted(() => {
  // 检查是否是编辑模式
  isEditMode.value = route.query.edit === 'true'
  loadCustomerDetail()

  // 添加点击外部事件监听
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // 移除事件监听
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
.customer-detail-view {
  padding: 0;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-xl);
  flex-wrap: wrap;
  gap: var(--spacing-md);
}

.page-header__main {
  flex: 1;
  min-width: 300px;
}

.breadcrumb {
  margin-bottom: var(--spacing-md);
}

.breadcrumb-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
  font-size: var(--font-size-sm);
}

.breadcrumb-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.customer-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-lg);
}

.customer-avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  font-size: var(--font-size-2xl);
}

.customer-info {
  flex: 1;
}

.customer-name {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.edit-mode-indicator {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-medium);
  color: var(--color-primary);
  margin-left: var(--spacing-sm);
}

.customer-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.page-header__actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
  text-decoration: none;
}

.action-btn--primary {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

.action-btn--primary:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.action-btn--secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.action-btn--secondary:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn--small {
  padding: var(--spacing-xs) var(--spacing-sm);
  font-size: var(--font-size-xs);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-primary);
  white-space: nowrap;
}

.action-btn--small:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.05);
}

.action-btn--small span {
  margin-left: var(--spacing-xs);
}

.status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-badge--active {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.status-badge--inactive,
.status-badge--suspended {
  background: rgba(140, 140, 140, 0.1);
  color: var(--color-text-secondary);
}

.grade-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-align: center;
  min-width: 24px;
}

.grade-badge--A {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.grade-badge--B {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.grade-badge--C {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.tabs-container {
  margin-bottom: var(--spacing-xl);
}

.tabs-nav {
  display: flex;
  border-bottom: 1px solid var(--color-border);
  overflow-x: auto;
  gap: var(--spacing-xs);
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-md) var(--spacing-lg);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.tab-btn:hover {
  color: var(--color-primary);
}

.tab-btn--active {
  color: var(--color-primary);
  border-bottom-color: var(--color-primary);
}

.page-content {
  min-height: 400px;
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
}

.loading-spinner {
  animation: spin 1s linear infinite;
  color: var(--color-primary);
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.tab-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 编辑表单样式 */
.edit-form {
  animation: fadeIn 0.3s ease-in-out;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.form-group--full {
  grid-column: 1 / -1;
}

.form-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.form-label.required::after {
  content: ' *';
  color: var(--color-error);
}

.form-input,
.form-select,
.form-textarea {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  transition: all var(--duration-fast);
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.form-input--error,
.form-select--error,
.form-textarea--error {
  border-color: var(--color-error);
}

.form-input--error:focus,
.form-select--error:focus,
.form-textarea--error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
  font-family: inherit;
  line-height: var(--line-height-relaxed);
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-top: var(--spacing-xs);
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xs);
}

.radio-item,
.checkbox-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  font-size: var(--font-size-sm);
}

.radio-input,
.checkbox-input {
  width: 16px;
  height: 16px;
  accent-color: var(--color-primary);
  cursor: pointer;
}

.radio-label,
.checkbox-label {
  color: var(--color-text-primary);
  cursor: pointer;
  user-select: none;
}

.form-section {
  margin-bottom: var(--spacing-xl);
}

.form-section .subsection-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-md);
}

.content-section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
}

.section-title {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-lg) 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-actions {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.character-count {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  text-align: right;
  margin-top: var(--spacing-xs);
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.info-item--full {
  grid-column: 1 / -1;
}

.info-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.info-value {
  font-size: var(--font-size-md);
  color: var(--color-text-primary);
}

.info-value--text {
  background: var(--color-background);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid var(--color-border);
  line-height: var(--line-height-relaxed);
}

.info-section {
  margin-bottom: var(--spacing-xl);
}

.subsection-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
}

.tag {
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.team-config {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.team-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.check-icon {
  flex-shrink: 0;
}

.check-icon--success {
  color: var(--color-success);
}

.check-icon--error {
  color: var(--color-error);
}

.contact-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: var(--spacing-lg);
}

.contact-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.contact-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.contact-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-lg);
}

.contact-info {
  flex: 1;
}

.contact-name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
}

.primary-badge {
  padding: 2px var(--spacing-xs);
  background: var(--color-primary);
  color: white;
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.contact-position {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.contact-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
  color: var(--color-text-primary);
}

.status-indicator {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.status-indicator--success {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.status-indicator--warning {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.competitor-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.competitor-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.competitor-header {
  margin-bottom: var(--spacing-md);
}

.competitor-name {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.competitor-url {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
}

.competitor-url:hover {
  text-decoration: underline;
}

.competitor-notes {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

.attention-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: var(--spacing-lg);
}

.attention-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.attention-title {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.attention-content {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.qa-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.qa-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.qa-header {
  margin-bottom: var(--spacing-md);
}

.qa-meta {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex-wrap: wrap;
}

.qa-category {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.qa-date {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.impact-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.impact-badge--low {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.impact-badge--medium {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.impact-badge--high {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.impact-badge--critical {
  background: rgba(245, 34, 45, 0.1);
  color: var(--color-error);
}

.qa-status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.qa-status-badge--pending {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.qa-status-badge--in_progress {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.qa-status-badge--completed {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.qa-status-badge--cancelled {
  background: rgba(140, 140, 140, 0.1);
  color: var(--color-text-secondary);
}

.qa-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.qa-section {
  border-left: 3px solid var(--color-border);
  padding-left: var(--spacing-md);
}

.qa-section-title {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.qa-text {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
  margin: 0;
}

.qa-footer {
  border-top: 1px solid var(--color-border);
  padding-top: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.qa-info {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.renewal-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.renewal-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
}

.renewal-notes {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.renewal-text {
  color: var(--color-text-secondary);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
}

.platform-group {
  margin-bottom: var(--spacing-xl);
}

.platform-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
  padding-bottom: var(--spacing-xs);
  border-bottom: 2px solid var(--color-border);
}

.account-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.account-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.account-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.platform-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-bold);
  color: white;
  font-size: var(--font-size-lg);
}

.platform-icon--google {
  background: #4285f4;
}

.platform-icon--facebook {
  background: #1877f2;
}

.platform-icon--bing {
  background: #00809d;
}

.platform-icon--criteo {
  background: #ff6900;
}

.platform-icon--other {
  background: var(--color-text-secondary);
}

.account-info {
  flex: 1;
}

.account-name {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-xs) 0;
}

.account-id {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-family: monospace;
}

.account-status {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.account-status--active {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.account-status--paused {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.account-status--limited,
.account-status--suspended {
  background: rgba(245, 34, 45, 0.1);
  color: var(--color-error);
}

.account-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.account-balance,
.account-days {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  font-size: var(--font-size-sm);
}

.balance-label,
.days-label {
  color: var(--color-text-secondary);
}

.balance-value,
.days-value {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.balance-low,
.days-low {
  color: var(--color-error);
}

/* 服务费管理样式 */
.service-fee-summary {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xl);
}

.summary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-lg);
}

.summary-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  transition: all var(--duration-fast);
}

.summary-card:hover {
  border-color: var(--color-primary);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.card-header h4 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
  margin: 0;
}

.card-icon {
  color: var(--color-primary);
}

.card-value {
  font-size: var(--font-size-2xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.card-desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.recent-payments {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.payment-table-container {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
}

.payment-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
  font-size: var(--font-size-sm);
}

.payment-table th {
  background: var(--color-background);
  padding: var(--spacing-sm) var(--spacing-md);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  white-space: nowrap;
}

.payment-table td {
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  vertical-align: middle;
}

.payment-table tr:hover {
  background: var(--color-background);
}

.amount-cell {
  font-weight: var(--font-weight-semibold);
  color: var(--color-success);
  text-align: right;
}

.payment-type-badge续费 {
  padding: 2px var(--spacing-xs);
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.payment-type-badge首次付款 {
  padding: 2px var(--spacing-xs);
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
}

.table-action-btn {
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  font-size: var(--font-size-xs);
  cursor: pointer;
  transition: all var(--duration-fast);
  margin-right: var(--spacing-xs);
}

.table-action-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
  background: rgba(59, 130, 246, 0.05);
}

.table-action-btn--danger:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.05);
}

.view-all-link {
  display: flex;
  justify-content: center;
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--color-border);
}

.link-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  background: none;
  border: none;
  color: var(--color-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
}

.link-btn:hover {
  background: rgba(59, 130, 246, 0.1);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
  text-align: center;
}

.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-2xl);
  color: var(--color-text-secondary);
  text-align: center;
}

/* 模态框样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--color-surface);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  max-width: 600px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-secondary);
  padding: var(--spacing-xs);
  border-radius: var(--border-radius-md);
  transition: all var(--duration-fast);
}

.modal-close:hover {
  background: var(--color-background);
  color: var(--color-text-primary);
}

.modal-body {
  padding: var(--spacing-lg);
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-sm);
  padding: var(--spacing-lg);
  border-top: 1px solid var(--color-border);
}

/* 图标按钮样式 */
.icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.icon-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.icon-btn--danger:hover {
  border-color: var(--color-error);
  color: var(--color-error);
  background: rgba(239, 68, 68, 0.1);
}

/* 联系人和竞对操作按钮 */
.contact-actions,
.competitor-actions {
  display: flex;
  gap: var(--spacing-xs);
  margin-left: auto;
}

.contact-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
}

.competitor-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
}

/* 附件列表样式 */
.attachment-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.attachment-link {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary);
  text-decoration: none;
  font-size: var(--font-size-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  transition: background-color var(--duration-fast);
}

.attachment-link:hover {
  background: rgba(59, 130, 246, 0.1);
  text-decoration: underline;
}

/* 项目列表样式 */
.project-filters {
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
}

.filter-group {
  display: flex;
  gap: var(--spacing-md);
  align-items: center;
  flex-wrap: wrap;
}

.filter-select,
.filter-input {
  padding: var(--spacing-sm) var(--spacing-md);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  font-size: var(--font-size-sm);
  background: var(--color-surface);
  color: var(--color-text-primary);
  min-width: 150px;
}

.filter-input {
  min-width: 200px;
}

.filter-select:focus,
.filter-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.projects-table-container {
  overflow-x: auto;
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--color-surface);
}

.projects-table th {
  background: var(--color-background);
  padding: var(--spacing-md);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  white-space: nowrap;
}

.projects-table td {
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
  vertical-align: top;
}

.project-row:hover {
  background: var(--color-background);
}

.project-name-cell {
  min-width: 200px;
}

.project-name {
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.project-id {
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
  font-family: monospace;
}

.project-duration {
  min-width: 120px;
}

.text-secondary {
  color: var(--color-text-secondary);
  font-size: var(--font-size-xs);
}

.project-type-badge,
.project-status-badge {
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  white-space: nowrap;
}

.type-badge--new_customer {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.type-badge--redevelopment {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.type-badge--reactivation {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.status-badge--active {
  background: rgba(82, 196, 26, 0.1);
  color: var(--color-success);
}

.status-badge--completed {
  background: rgba(24, 144, 255, 0.1);
  color: var(--color-info);
}

.status-badge--paused {
  background: rgba(250, 173, 20, 0.1);
  color: var(--color-warning);
}

.status-badge--cancelled {
  background: rgba(245, 34, 45, 0.1);
  color: var(--color-error);
}

.platform-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-xs);
}

.platform-tag {
  padding: 2px var(--spacing-xs);
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  font-size: var(--font-size-xs);
  color: var(--color-text-secondary);
}

.contract-number {
  font-family: monospace;
  font-size: var(--font-size-xs);
}

.service-fee,
.balance {
  font-weight: var(--font-weight-medium);
  text-align: right;
}

.balance-low {
  color: var(--color-error);
}

.operation-team {
  color: var(--color-text-primary);
}

.project-actions {
  min-width: 200px;
}

.action-buttons {
  display: flex;
  gap: var(--spacing-xs);
  flex-wrap: wrap;
  align-items: center;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .info-grid {
    grid-template-columns: 1fr;
  }

  .filter-group {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select,
  .filter-input {
    min-width: auto;
    width: 100%;
  }

  .projects-table-container {
    font-size: var(--font-size-xs);
  }

  .projects-table th,
  .projects-table td {
    padding: var(--spacing-sm);
  }

  .action-buttons {
    flex-direction: column;
    align-items: stretch;
  }

  .action-btn--small {
    justify-content: flex-start;
  }

  .attention-grid {
    grid-template-columns: 1fr;
  }

  .contact-list {
    grid-template-columns: 1fr;
  }

  .account-list {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .customer-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: var(--spacing-md);
  }

  .page-header__actions {
    justify-content: center;
  }

  .tabs-nav {
    flex-wrap: wrap;
  }

  .content-section {
    padding: var(--spacing-lg);
  }

  .section-header {
    flex-direction: column;
    align-items: stretch;
    gap: var(--spacing-md);
  }

  .qa-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm);
  }

  .qa-info {
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  .account-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
}

/* 下拉菜单样式 */
.dropdown-container {
  position: relative;
  display: inline-block;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  min-width: 160px;
  padding: var(--spacing-xs) 0;
  margin-top: var(--spacing-xs);
}

.dropdown-menu--detail {
  min-width: 180px;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  width: 100%;
  padding: var(--spacing-sm) var(--spacing-md);
  border: none;
  background: none;
  color: var(--color-text-primary);
  font-size: var(--font-size-sm);
  cursor: pointer;
  transition: all var(--duration-fast);
  text-align: left;
}

.dropdown-item:hover {
  background: var(--color-bg-secondary);
  color: var(--color-primary);
}

.dropdown-item:active {
  background: var(--color-bg-tertiary);
}

.dropdown-trigger {
  position: relative;
}

.dropdown-trigger:focus {
  outline: none;
}
</style>
