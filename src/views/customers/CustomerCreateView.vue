<template>
  <div class="customer-create-view">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="page-header__main">
        <div class="breadcrumb">
          <button class="breadcrumb-btn" @click="goBack">
            <ArrowLeft :size="16" />
            返回客户列表
          </button>
        </div>
        <h1 class="page-title">新建客户</h1>
        <p class="page-description">请按步骤填写客户信息</p>
      </div>
      <div class="page-header__actions">
        <button class="action-btn action-btn--secondary" @click="saveDraft" :disabled="saving">
          <Save :size="16" />
          保存草稿
        </button>
      </div>
    </div>

    <!-- 步骤导航 -->
    <div class="steps-container">
      <div class="steps-nav">
        <div
          v-for="(step, index) in steps"
          :key="step.key"
          class="step-item"
          :class="{
            'step-item--active': currentStep === index,
            'step-item--completed': index < currentStep,
            'step-item--disabled': index > currentStep
          }"
        >
          <div class="step-number">
            <Check v-if="index < currentStep" :size="16" />
            <span v-else>{{ index + 1 }}</span>
          </div>
          <div class="step-info">
            <div class="step-title">{{ step.title }}</div>
            <div class="step-description">{{ step.description }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 表单内容 -->
    <div class="form-container">
      <form @submit.prevent="handleSubmit">
        <!-- 第一步：合作信息 -->
        <div v-if="currentStep === 0" class="step-content">
          <div class="form-section">
            <h3 class="section-title">合作信息</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">客户名称</label>
                <input
                  v-model="formData.cooperationDetails.customerName"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.customerName }"
                  placeholder="请输入客户公司名称"
                  @blur="validateField('customerName')"
                />
                <span v-if="errors.customerName" class="error-message">{{ errors.customerName }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">合作方式</label>
                <select
                  v-model="formData.cooperationDetails.cooperationType"
                  class="form-select"
                  :class="{ 'form-input--error': errors.cooperationType }"
                  @change="validateField('cooperationType')"
                >
                  <option value="">请选择合作方式</option>
                  <option value="代运营">代运营</option>
                  <option value="咨询服务">咨询服务</option>
                  <option value="技术支持">技术支持</option>
                  <option value="培训服务">培训服务</option>
                </select>
                <span v-if="errors.cooperationType" class="error-message">{{ errors.cooperationType }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">签单销售</label>
                <select
                  v-model="formData.cooperationDetails.signingSales"
                  class="form-select"
                  :class="{ 'form-input--error': errors.signingSales }"
                  @change="validateField('signingSales')"
                >
                  <option value="">请选择签单销售</option>
                  <option value="张小明">张小明</option>
                  <option value="李美丽">李美丽</option>
                  <option value="王强">王强</option>
                  <option value="赵敏">赵敏</option>
                  <option value="陈华">陈华</option>
                </select>
                <span v-if="errors.signingSales" class="error-message">{{ errors.signingSales }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">合作开始时间</label>
                <input
                  v-model="formData.cooperationDetails.cooperationStartTime"
                  type="date"
                  class="form-input"
                  :class="{ 'form-input--error': errors.cooperationStartTime }"
                  @change="validateField('cooperationStartTime')"
                />
                <span v-if="errors.cooperationStartTime" class="error-message">{{ errors.cooperationStartTime }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">服务开始时间</label>
                <input
                  v-model="formData.cooperationDetails.serviceStartTime"
                  type="date"
                  class="form-input"
                  :class="{ 'form-input--error': errors.serviceStartTime }"
                  @change="validateField('serviceStartTime')"
                />
                <span v-if="errors.serviceStartTime" class="error-message">{{ errors.serviceStartTime }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">客户分级</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input
                      v-model="formData.cooperationDetails.customerGrade"
                      type="radio"
                      value="A"
                      class="radio-input"
                    />
                    <span class="radio-label">A级客户</span>
                  </label>
                  <label class="radio-item">
                    <input
                      v-model="formData.cooperationDetails.customerGrade"
                      type="radio"
                      value="B"
                      class="radio-input"
                    />
                    <span class="radio-label">B级客户</span>
                  </label>
                  <label class="radio-item">
                    <input
                      v-model="formData.cooperationDetails.customerGrade"
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
                v-model="formData.cooperationDetails.specialConditions"
                class="form-textarea"
                placeholder="请描述特殊的合作条件或要求"
                rows="3"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 第二步：基础信息 -->
        <div v-if="currentStep === 1" class="step-content">
          <div class="form-section">
            <h3 class="section-title">基础信息</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">服务团队</label>
                <select
                  v-model="formData.basicInfo.serviceTeam"
                  class="form-select"
                  :class="{ 'form-input--error': errors.serviceTeam }"
                  @change="validateField('serviceTeam')"
                >
                  <option value="">请选择服务团队</option>
                  <option value="时尚组">时尚组</option>
                  <option value="科技组">科技组</option>
                  <option value="美妆组">美妆组</option>
                  <option value="运动组">运动组</option>
                  <option value="家居组">家居组</option>
                  <option value="综合组">综合组</option>
                </select>
                <span v-if="errors.serviceTeam" class="error-message">{{ errors.serviceTeam }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">客户行业</label>
                <select
                  v-model="formData.basicInfo.industry"
                  class="form-select"
                  :class="{ 'form-input--error': errors.industry }"
                  @change="validateField('industry')"
                >
                  <option value="">请选择客户行业</option>
                  <option value="时尚服装">时尚服装</option>
                  <option value="数码科技">数码科技</option>
                  <option value="美容护肤">美容护肤</option>
                  <option value="体育用品">体育用品</option>
                  <option value="家居装饰">家居装饰</option>
                  <option value="其他">其他</option>
                </select>
                <span v-if="errors.industry" class="error-message">{{ errors.industry }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">商业模式</label>
                <select
                  v-model="formData.basicInfo.businessModel"
                  class="form-select"
                  :class="{ 'form-input--error': errors.businessModel }"
                  @change="validateField('businessModel')"
                >
                  <option value="">请选择商业模式</option>
                  <option value="工贸一体化的B2B外贸工厂">工贸一体化的B2B外贸工厂</option>
                  <option value="平台精品卖家">平台精品卖家</option>
                  <option value="中国本土品牌出海">中国本土品牌出海</option>
                </select>
                <span v-if="errors.businessModel" class="error-message">{{ errors.businessModel }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">海外销售规模</label>
                <select
                  v-model="formData.basicInfo.overseasSalesScale"
                  class="form-select"
                  :class="{ 'form-input--error': errors.overseasSalesScale }"
                  @change="validateField('overseasSalesScale')"
                >
                  <option value="">请选择销售规模</option>
                  <option value="100万美元以下">100万美元以下</option>
                  <option value="100-500万美元">100-500万美元</option>
                  <option value="500-1000万美元">500-1000万美元</option>
                  <option value="1000-5000万美元">1000-5000万美元</option>
                  <option value="5000万美元以上">5000万美元以上</option>
                </select>
                <span v-if="errors.overseasSalesScale" class="error-message">{{ errors.overseasSalesScale }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">海外销售占比</label>
                <div class="input-group">
                  <input
                    v-model.number="formData.basicInfo.overseasSalesRatio"
                    type="number"
                    class="form-input"
                    :class="{ 'form-input--error': errors.overseasSalesRatio }"
                    placeholder="请输入占比"
                    min="0"
                    max="100"
                    @blur="validateField('overseasSalesRatio')"
                  />
                  <span class="input-suffix">%</span>
                </div>
                <span v-if="errors.overseasSalesRatio" class="error-message">{{ errors.overseasSalesRatio }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">目标销售规模</label>
                <input
                  v-model="formData.basicInfo.targetSalesScale"
                  type="text"
                  class="form-input"
                  :class="{ 'form-input--error': errors.targetSalesScale }"
                  placeholder="请输入目标销售规模"
                  @blur="validateField('targetSalesScale')"
                />
                <span v-if="errors.targetSalesScale" class="error-message">{{ errors.targetSalesScale }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">主要销售渠道</label>
                <select
                  v-model="formData.basicInfo.mainSalesChannel"
                  class="form-select"
                  :class="{ 'form-input--error': errors.mainSalesChannel }"
                  @change="validateField('mainSalesChannel')"
                >
                  <option value="">请选择主要销售渠道</option>
                  <option value="独立站">独立站</option>
                  <option value="Amazon">Amazon</option>
                  <option value="eBay">eBay</option>
                  <option value="Shopify">Shopify</option>
                  <option value="线下渠道">线下渠道</option>
                  <option value="其他">其他</option>
                </select>
                <span v-if="errors.mainSalesChannel" class="error-message">{{ errors.mainSalesChannel }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">合作转移类型</label>
                <select
                  v-model="formData.basicInfo.cooperationTransfer"
                  class="form-select"
                >
                  <option value="">请选择转移类型</option>
                  <option value="服务商转移">服务商转移</option>
                  <option value="内部团队转移">内部团队转移</option>
                  <option value="新客户">新客户</option>
                </select>
              </div>
            </div>

            <!-- 客户地区 -->
            <div class="form-section">
              <h4 class="subsection-title">客户地区</h4>
              <div class="checkbox-group">
                <label v-for="region in regionOptions" :key="region" class="checkbox-item">
                  <input
                    v-model="formData.basicInfo.regions"
                    type="checkbox"
                    :value="region"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">{{ region }}</span>
                </label>
              </div>
            </div>

            <!-- 团队配置 -->
            <div class="form-section">
              <h4 class="subsection-title">团队配置</h4>
              <div class="checkbox-group">
                <label class="checkbox-item">
                  <input
                    v-model="formData.basicInfo.hasTechTeam"
                    type="checkbox"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">企业内有网站技术及素材制作团队</span>
                </label>
                <label class="checkbox-item">
                  <input
                    v-model="formData.basicInfo.hasOperationTeam"
                    type="checkbox"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">企业内有投放或运营团队</span>
                </label>
                <label class="checkbox-item">
                  <input
                    v-model="formData.basicInfo.hasBrandTeam"
                    type="checkbox"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">企业内有品牌及内容团队</span>
                </label>
              </div>
            </div>

            <!-- 联系人信息 -->
            <div class="form-section">
              <div class="section-header">
                <h4 class="subsection-title">联系人信息</h4>
                <button type="button" class="add-btn" @click="addContact">
                  <Plus :size="16" />
                  添加联系人
                </button>
              </div>
              <div class="contact-list">
                <div v-for="(contact, index) in formData.basicInfo.contactPersons" :key="contact.id" class="contact-item">
                  <div class="contact-header">
                    <span class="contact-index">联系人 {{ index + 1 }}</span>
                    <button v-if="formData.basicInfo.contactPersons.length > 1" type="button" class="remove-btn" @click="removeContact(index)">
                      <Trash2 :size="14" />
                    </button>
                  </div>
                  <div class="contact-form">
                    <div class="form-group">
                      <label class="form-label required">姓名</label>
                      <input
                        v-model="contact.name"
                        type="text"
                        class="form-input"
                        placeholder="请输入联系人姓名"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label required">职位</label>
                      <input
                        v-model="contact.position"
                        type="text"
                        class="form-input"
                        placeholder="请输入职位"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label required">电话</label>
                      <input
                        v-model="contact.phone"
                        type="tel"
                        class="form-input"
                        placeholder="请输入联系电话"
                      />
                    </div>
                    <div class="form-group">
                      <label class="form-label required">邮箱</label>
                      <input
                        v-model="contact.email"
                        type="email"
                        class="form-input"
                        placeholder="请输入邮箱地址"
                      />
                    </div>
                    <div class="form-group">
                      <label class="checkbox-item">
                        <input
                          v-model="contact.isPrimary"
                          type="checkbox"
                          class="checkbox-input"
                          @change="handlePrimaryContact(index)"
                        />
                        <span class="checkbox-label">主要联系人</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 第三步：独立站情况 -->
        <div v-if="currentStep === 2" class="step-content">
          <div class="form-section">
            <h3 class="section-title">独立站情况及目标</h3>
            <div class="form-grid">
              <div class="form-group">
                <label class="form-label required">网站上线时间</label>
                <input
                  v-model="formData.websiteInfo.websiteLaunchTime"
                  type="date"
                  class="form-input"
                  :class="{ 'form-input--error': errors.websiteLaunchTime }"
                  @change="validateField('websiteLaunchTime')"
                />
                <span v-if="errors.websiteLaunchTime" class="error-message">{{ errors.websiteLaunchTime }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">新品上线频率</label>
                <select
                  v-model="formData.websiteInfo.newProductFrequency"
                  class="form-select"
                  :class="{ 'form-input--error': errors.newProductFrequency }"
                  @change="validateField('newProductFrequency')"
                >
                  <option value="">请选择上线频率</option>
                  <option value="每周1-2款">每周1-2款</option>
                  <option value="每月5-10款">每月5-10款</option>
                  <option value="每月10-20款">每月10-20款</option>
                  <option value="每月20款以上">每月20款以上</option>
                  <option value="不定期">不定期</option>
                </select>
                <span v-if="errors.newProductFrequency" class="error-message">{{ errors.newProductFrequency }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">去年销售额</label>
                <div class="input-group">
                  <span class="input-prefix">$</span>
                  <input
                    v-model.number="formData.websiteInfo.lastYearSales"
                    type="number"
                    class="form-input"
                    :class="{ 'form-input--error': errors.lastYearSales }"
                    placeholder="请输入去年销售额"
                    min="0"
                    @blur="validateField('lastYearSales')"
                  />
                </div>
                <span v-if="errors.lastYearSales" class="error-message">{{ errors.lastYearSales }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">年度销售目标</label>
                <div class="input-group">
                  <span class="input-prefix">$</span>
                  <input
                    v-model.number="formData.websiteInfo.annualSalesTarget"
                    type="number"
                    class="form-input"
                    :class="{ 'form-input--error': errors.annualSalesTarget }"
                    placeholder="请输入年度销售目标"
                    min="0"
                    @blur="validateField('annualSalesTarget')"
                  />
                </div>
                <span v-if="errors.annualSalesTarget" class="error-message">{{ errors.annualSalesTarget }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">年度成本目标</label>
                <div class="input-group">
                  <span class="input-prefix">$</span>
                  <input
                    v-model.number="formData.websiteInfo.annualCostTarget"
                    type="number"
                    class="form-input"
                    :class="{ 'form-input--error': errors.annualCostTarget }"
                    placeholder="请输入年度成本目标"
                    min="0"
                    @blur="validateField('annualCostTarget')"
                  />
                </div>
                <span v-if="errors.annualCostTarget" class="error-message">{{ errors.annualCostTarget }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">成本占比</label>
                <div class="input-group">
                  <input
                    v-model.number="formData.websiteInfo.costRatio"
                    type="number"
                    class="form-input"
                    :class="{ 'form-input--error': errors.costRatio }"
                    placeholder="请输入成本占比"
                    min="0"
                    max="100"
                    @blur="validateField('costRatio')"
                  />
                  <span class="input-suffix">%</span>
                </div>
                <span v-if="errors.costRatio" class="error-message">{{ errors.costRatio }}</span>
              </div>

              <div class="form-group">
                <label class="form-label required">价格定位策略</label>
                <select
                  v-model="formData.websiteInfo.pricingStrategy"
                  class="form-select"
                  :class="{ 'form-input--error': errors.pricingStrategy }"
                  @change="validateField('pricingStrategy')"
                >
                  <option value="">请选择价格策略</option>
                  <option value="同价">同价</option>
                  <option value="独立站价格更高">独立站价格更高</option>
                  <option value="第三方平台价格更高">第三方平台价格更高</option>
                  <option value="不同产品不同定价策略">不同产品不同定价策略</option>
                </select>
                <span v-if="errors.pricingStrategy" class="error-message">{{ errors.pricingStrategy }}</span>
              </div>

              <div class="form-group">
                <label class="form-label">库存状态</label>
                <div class="radio-group">
                  <label class="radio-item">
                    <input
                      v-model="formData.websiteInfo.inventoryStatus"
                      type="radio"
                      :value="true"
                      class="radio-input"
                    />
                    <span class="radio-label">有库存</span>
                  </label>
                  <label class="radio-item">
                    <input
                      v-model="formData.websiteInfo.inventoryStatus"
                      type="radio"
                      :value="false"
                      class="radio-input"
                    />
                    <span class="radio-label">无库存</span>
                  </label>
                </div>
              </div>
            </div>

            <!-- 目标市场 -->
            <div class="form-section">
              <h4 class="subsection-title">目标市场</h4>
              <div class="checkbox-group">
                <label v-for="market in marketOptions" :key="market" class="checkbox-item">
                  <input
                    v-model="formData.websiteInfo.targetMarkets"
                    type="checkbox"
                    :value="market"
                    class="checkbox-input"
                  />
                  <span class="checkbox-label">{{ market }}</span>
                </label>
              </div>
            </div>

            <!-- 产品信息 -->
            <div class="form-section">
              <div class="form-group form-group--full">
                <label class="form-label required">主要推广产品</label>
                <textarea
                  v-model="formData.websiteInfo.mainProducts"
                  class="form-textarea"
                  :class="{ 'form-input--error': errors.mainProducts }"
                  placeholder="请描述主要推广的产品类型和特点"
                  rows="3"
                  @blur="validateField('mainProducts')"
                ></textarea>
                <span v-if="errors.mainProducts" class="error-message">{{ errors.mainProducts }}</span>
              </div>

              <div class="form-group form-group--full">
                <label class="form-label required">产品优势卖点</label>
                <textarea
                  v-model="formData.websiteInfo.productAdvantages"
                  class="form-textarea"
                  :class="{ 'form-input--error': errors.productAdvantages }"
                  placeholder="请描述产品的主要优势和卖点"
                  rows="3"
                  @blur="validateField('productAdvantages')"
                ></textarea>
                <span v-if="errors.productAdvantages" class="error-message">{{ errors.productAdvantages }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 第四步：竞争对手 -->
        <div v-if="currentStep === 3" class="step-content">
          <div class="form-section">
            <div class="section-header">
              <h3 class="section-title">竞争对手</h3>
              <button type="button" class="add-btn" @click="addCompetitor">
                <Plus :size="16" />
                添加竞争对手
              </button>
            </div>
            <div class="competitor-list">
              <div v-for="(competitor, index) in formData.competitorInfo.competitorWebsites" :key="competitor.id" class="competitor-item">
                <div class="competitor-header">
                  <span class="competitor-index">竞争对手 {{ index + 1 }}</span>
                  <button v-if="formData.competitorInfo.competitorWebsites.length > 1" type="button" class="remove-btn" @click="removeCompetitor(index)">
                    <Trash2 :size="14" />
                  </button>
                </div>
                <div class="competitor-form">
                  <div class="form-group">
                    <label class="form-label required">公司名称</label>
                    <input
                      v-model="competitor.companyName"
                      type="text"
                      class="form-input"
                      placeholder="请输入竞争对手公司名称"
                    />
                  </div>
                  <div class="form-group">
                    <label class="form-label required">网站地址</label>
                    <input
                      v-model="competitor.websiteUrl"
                      type="url"
                      class="form-input"
                      placeholder="请输入网站地址，如：https://example.com"
                    />
                  </div>
                  <div class="form-group form-group--full">
                    <label class="form-label">备注</label>
                    <textarea
                      v-model="competitor.notes"
                      class="form-textarea"
                      placeholder="请输入关于此竞争对手的备注信息"
                      rows="2"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
            <div v-if="formData.competitorInfo.competitorWebsites.length === 0" class="empty-state">
              <p>暂无竞争对手信息</p>
              <button type="button" class="add-btn" @click="addCompetitor">
                <Plus :size="16" />
                添加第一个竞争对手
              </button>
            </div>
          </div>
        </div>

        <!-- 第五步：特别关注事项 -->
        <div v-if="currentStep === 4" class="step-content">
          <div class="form-section">
            <h3 class="section-title">特别关注事项</h3>
            <div class="attention-grid">
              <div class="form-group">
                <label class="form-label">客户期望</label>
                <textarea
                  v-model="formData.specialAttention.customerExpectations"
                  class="form-textarea"
                  placeholder="请描述客户的期望和要求"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">沟通偏好</label>
                <textarea
                  v-model="formData.specialAttention.communicationPreferences"
                  class="form-textarea"
                  placeholder="请描述客户的沟通偏好和习惯"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">特殊要求</label>
                <textarea
                  v-model="formData.specialAttention.specialRequirements"
                  class="form-textarea"
                  placeholder="请描述客户的特殊要求"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">文化考虑因素</label>
                <textarea
                  v-model="formData.specialAttention.culturalConsiderations"
                  class="form-textarea"
                  placeholder="请描述需要考虑的文化因素"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">时区偏好</label>
                <input
                  v-model="formData.specialAttention.timeZonePreferences"
                  type="text"
                  class="form-input"
                  placeholder="请输入时区偏好，如：北京时间工作时间"
                />
              </div>

              <div class="form-group">
                <label class="form-label">语言偏好</label>
                <input
                  v-model="formData.specialAttention.languagePreferences"
                  type="text"
                  class="form-input"
                  placeholder="请输入语言偏好，如：中文、英文"
                />
              </div>

              <div class="form-group">
                <label class="form-label">决策者信息</label>
                <textarea
                  v-model="formData.specialAttention.decisionMakers"
                  class="form-textarea"
                  placeholder="请描述决策者的信息和决策流程"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">预算限制</label>
                <textarea
                  v-model="formData.specialAttention.budgetConstraints"
                  class="form-textarea"
                  placeholder="请描述预算限制和约束条件"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">合规要求</label>
                <textarea
                  v-model="formData.specialAttention.complianceRequirements"
                  class="form-textarea"
                  placeholder="请描述合规要求，如：GDPR、CCPA等"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">风险因素</label>
                <textarea
                  v-model="formData.specialAttention.riskFactors"
                  class="form-textarea"
                  placeholder="请描述潜在的风险因素"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">成功因素</label>
                <textarea
                  v-model="formData.specialAttention.successFactors"
                  class="form-textarea"
                  placeholder="请描述成功的关键因素"
                  rows="3"
                ></textarea>
              </div>

              <div class="form-group">
                <label class="form-label">历史问题</label>
                <textarea
                  v-model="formData.specialAttention.historicalIssues"
                  class="form-textarea"
                  placeholder="请描述历史上出现过的问题"
                  rows="3"
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <!-- 步骤导航按钮 -->
        <div class="form-actions">
          <button
            v-if="currentStep > 0"
            type="button"
            class="action-btn action-btn--secondary"
            @click="prevStep"
          >
            <ArrowLeft :size="16" />
            上一步
          </button>

          <div class="form-actions__right">
            <button
              type="button"
              class="action-btn action-btn--secondary"
              @click="saveDraft"
              :disabled="saving"
            >
              <Save :size="16" />
              {{ saving ? '保存中...' : '保存草稿' }}
            </button>

            <button
              v-if="currentStep < steps.length - 1"
              type="button"
              class="action-btn action-btn--primary"
              @click="nextStep"
            >
              下一步
              <ArrowRight :size="16" />
            </button>

            <button
              v-else
              type="submit"
              class="action-btn action-btn--primary"
              :disabled="submitting"
            >
              <Check :size="16" />
              {{ submitting ? '提交中...' : '完成创建' }}
            </button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  ArrowLeft, ArrowRight, Save, Check, Plus, Trash2
} from 'lucide-vue-next'
import { mockCreateCustomer } from '@/mock/customer'
import type {
  CustomerDetail,
  CooperationDetails,
  CustomerBasicInfo,
  ContactPerson,
  WebsiteInfo,
  CompetitorInfo,
  CompetitorWebsite,
  SpecialAttention
} from '@/types'

// 路由
const router = useRouter()

// 响应式数据
const currentStep = ref(0)
const submitting = ref(false)
const saving = ref(false)

// 表单数据
const formData = reactive<CustomerDetail>({
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
  } as CooperationDetails,
  basicInfo: {
    serviceTeam: '',
    contactPersons: [
      {
        id: 1,
        name: '',
        position: '',
        phone: '',
        email: '',
        isPrimary: true
      }
    ],
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
  } as CustomerBasicInfo,
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
  } as WebsiteInfo,
  competitorInfo: {
    competitorWebsites: []
  } as CompetitorInfo,
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
  } as SpecialAttention,
  qaRecords: [],
  renewalNotes: '',
  projects: [],
  adAccounts: [],
  createdAt: '',
  lastUpdated: ''
})

// 错误信息
const errors = reactive<Record<string, string>>({})

// 步骤配置
const steps = [
  {
    key: 'cooperation',
    title: '合作信息',
    description: '填写基本合作信息'
  },
  {
    key: 'basic',
    title: '基础信息',
    description: '填写客户基础信息'
  },
  {
    key: 'website',
    title: '独立站情况',
    description: '填写独立站信息和目标'
  },
  {
    key: 'competitor',
    title: '竞争对手',
    description: '添加竞争对手信息'
  },
  {
    key: 'attention',
    title: '特别关注事项',
    description: '填写需要特别关注的事项'
  }
]

// 选项配置
const regionOptions = ['美国', '欧洲', '加拿大', '澳大利亚', '日本', '其他国家']
const marketOptions = ['美国', '欧洲', '加拿大', '澳大利亚', '日本', '其他国家']

// 验证规则
const validationRules = {
  customerName: (value: string) => {
    if (!value) return '请输入客户名称'
    if (value.length < 2) return '客户名称至少2个字符'
    if (value.length > 100) return '客户名称不能超过100个字符'
    return ''
  },
  cooperationType: (value: string) => {
    if (!value) return '请选择合作方式'
    return ''
  },
  signingSales: (value: string) => {
    if (!value) return '请选择签单销售'
    return ''
  },
  cooperationStartTime: (value: string) => {
    if (!value) return '请选择合作开始时间'
    if (new Date(value) > new Date()) return '合作开始时间不能晚于当前日期'
    return ''
  },
  serviceStartTime: (value: string) => {
    if (!value) return '请选择服务开始时间'
    if (formData.cooperationDetails.cooperationStartTime && new Date(value) < new Date(formData.cooperationDetails.cooperationStartTime)) {
      return '服务开始时间不能早于合作开始时间'
    }
    return ''
  },
  serviceTeam: (value: string) => {
    if (!value) return '请选择服务团队'
    return ''
  },
  industry: (value: string) => {
    if (!value) return '请选择客户行业'
    return ''
  },
  businessModel: (value: string) => {
    if (!value) return '请选择商业模式'
    return ''
  },
  overseasSalesScale: (value: string) => {
    if (!value) return '请选择海外销售规模'
    return ''
  },
  overseasSalesRatio: (value: number) => {
    if (value < 0 || value > 100) return '海外销售占比应在0-100之间'
    return ''
  },
  targetSalesScale: (value: string) => {
    if (!value) return '请输入目标销售规模'
    return ''
  },
  mainSalesChannel: (value: string) => {
    if (!value) return '请选择主要销售渠道'
    return ''
  },
  websiteLaunchTime: (value: string) => {
    if (!value) return '请选择网站上线时间'
    if (new Date(value) > new Date()) return '网站上线时间不能晚于当前日期'
    return ''
  },
  newProductFrequency: (value: string) => {
    if (!value) return '请选择新品上线频率'
    return ''
  },
  lastYearSales: (value: number) => {
    if (value < 0) return '去年销售额不能为负数'
    return ''
  },
  annualSalesTarget: (value: number) => {
    if (value < 0) return '年度销售目标不能为负数'
    return ''
  },
  annualCostTarget: (value: number) => {
    if (value < 0) return '年度成本目标不能为负数'
    return ''
  },
  costRatio: (value: number) => {
    if (value < 0 || value > 100) return '成本占比应在0-100之间'
    return ''
  },
  pricingStrategy: (value: string) => {
    if (!value) return '请选择价格定位策略'
    return ''
  },
  mainProducts: (value: string) => {
    if (!value) return '请描述主要推广产品'
    return ''
  },
  productAdvantages: (value: string) => {
    if (!value) return '请描述产品优势卖点'
    return ''
  }
}

// 方法
const validateField = (fieldName: string) => {
  const rule = validationRules[fieldName as keyof typeof validationRules]
  if (rule) {
    let value: any
    if (fieldName.includes('.')) {
      const [parent, child] = fieldName.split('.')
      value = (formData as any)[parent][child]
    } else {
      // 根据字段名找到对应的值
      if (['customerName', 'cooperationType', 'signingSales', 'cooperationStartTime', 'serviceStartTime'].includes(fieldName)) {
        value = formData.cooperationDetails[fieldName as keyof CooperationDetails]
      } else if (['serviceTeam', 'industry', 'businessModel', 'overseasSalesScale', 'overseasSalesRatio', 'targetSalesScale', 'mainSalesChannel'].includes(fieldName)) {
        value = formData.basicInfo[fieldName as keyof CustomerBasicInfo]
      } else if (['websiteLaunchTime', 'newProductFrequency', 'lastYearSales', 'annualSalesTarget', 'annualCostTarget', 'costRatio', 'pricingStrategy', 'mainProducts', 'productAdvantages'].includes(fieldName)) {
        value = formData.websiteInfo[fieldName as keyof WebsiteInfo]
      }
    }

    const error = (rule as any)(value)
    if (error) {
      (errors as Record<string, string>)[fieldName] = error
    } else {
      delete (errors as Record<string, string>)[fieldName]
    }
  }
}

const validateStep = (step: number): boolean => {
  const stepValidations: string[][] = [
    // 第一步：合作信息
    ['customerName', 'cooperationType', 'signingSales', 'cooperationStartTime', 'serviceStartTime'],
    // 第二步：基础信息
    ['serviceTeam', 'industry', 'businessModel', 'overseasSalesScale', 'overseasSalesRatio', 'targetSalesScale', 'mainSalesChannel'],
    // 第三步：独立站情况
    ['websiteLaunchTime', 'newProductFrequency', 'lastYearSales', 'annualSalesTarget', 'annualCostTarget', 'costRatio', 'pricingStrategy', 'mainProducts', 'productAdvantages'],
    // 第四步：竞争对手（可选）
    [],
    // 第五步：特别关注事项（可选）
    []
  ]

  const fieldsToValidate = stepValidations[step] || []
  let isValid = true

  fieldsToValidate.forEach((field: string) => {
    validateField(field)
    if (errors[field]) {
      isValid = false
    }
  })

  return isValid
}

const nextStep = () => {
  if (validateStep(currentStep.value)) {
    currentStep.value++
  }
}

const prevStep = () => {
  currentStep.value--
}

const addContact = () => {
  const newContact: ContactPerson = {
    id: Date.now(),
    name: '',
    position: '',
    phone: '',
    email: '',
    isPrimary: false
  }
  formData.basicInfo.contactPersons.push(newContact)
}

const removeContact = (index: number) => {
  formData.basicInfo.contactPersons.splice(index, 1)
}

const handlePrimaryContact = (index: number) => {
  // 确保只有一个主要联系人
  formData.basicInfo.contactPersons.forEach((contact, i) => {
    if (i !== index) {
      contact.isPrimary = false
    }
  })
}

const addCompetitor = () => {
  const newCompetitor: CompetitorWebsite = {
    id: Date.now(),
    websiteUrl: '',
    companyName: '',
    notes: ''
  }
  formData.competitorInfo.competitorWebsites.push(newCompetitor)
}

const removeCompetitor = (index: number) => {
  formData.competitorInfo.competitorWebsites.splice(index, 1)
}

const saveDraft = async () => {
  saving.value = true
  try {
    // 模拟保存草稿
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('草稿已保存')
    // 这里可以显示成功提示
  } catch (error) {
    console.error('保存草稿失败:', error)
  } finally {
    saving.value = false
  }
}

const handleSubmit = async () => {
  // 验证所有步骤
  let allValid = true
  for (let i = 0; i < steps.length; i++) {
    if (!validateStep(i)) {
      allValid = false
      break
    }
  }

  if (!allValid) {
    console.log('表单验证失败')
    return
  }

  submitting.value = true
  try {
    const response = await mockCreateCustomer(formData)
    if (response.success) {
      console.log('客户创建成功')
      router.push('/customers')
    }
  } catch (error) {
    console.error('创建客户失败:', error)
  } finally {
    submitting.value = false
  }
}

const goBack = () => {
  router.push('/customers')
}
</script>

<style scoped>
.customer-create-view {
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

.page-title {
  font-size: var(--font-size-3xl);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-sm) 0;
}

.page-description {
  font-size: var(--font-size-lg);
  color: var(--color-text-secondary);
  margin: 0;
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

.action-btn--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.action-btn--secondary {
  background: var(--color-surface);
  color: var(--color-text-primary);
}

.action-btn--secondary:hover:not(:disabled) {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.action-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.steps-container {
  margin-bottom: var(--spacing-xl);
}

.steps-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  overflow-x: auto;
}

.step-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  flex: 1;
  min-width: 200px;
  position: relative;
}

.step-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: calc(-50% + 20px);
  top: 20px;
  width: calc(100% - 40px);
  height: 2px;
  background: var(--color-border);
  z-index: 1;
}

.step-item--completed:not(:last-child)::after {
  background: var(--color-primary);
}

.step-number {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text-secondary);
  position: relative;
  z-index: 2;
}

.step-item--active .step-number {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}

.step-item--completed .step-number {
  border-color: var(--color-primary);
  background: var(--color-primary);
  color: white;
}

.step-info {
  flex: 1;
}

.step-title {
  font-size: var(--font-size-md);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
  margin-bottom: var(--spacing-xs);
}

.step-description {
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.step-item--active .step-title {
  color: var(--color-primary);
}

.step-item--disabled .step-title,
.step-item--disabled .step-description {
  color: var(--color-text-disabled);
}

.form-container {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-xl);
}

.step-content {
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.form-section {
  margin-bottom: var(--spacing-xl);
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

.subsection-title {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0 0 var(--spacing-md) 0;
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
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.form-input--error,
.form-select--error,
.form-textarea--error {
  border-color: var(--color-error);
}

.form-input--error:focus,
.form-select--error:focus,
.form-textarea--error:focus {
  box-shadow: 0 0 0 3px rgba(245, 34, 45, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 80px;
}

.input-group {
  display: flex;
  align-items: center;
  position: relative;
}

.input-prefix,
.input-suffix {
  position: absolute;
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  pointer-events: none;
}

.input-prefix {
  left: var(--spacing-md);
}

.input-suffix {
  right: var(--spacing-md);
}

.input-group .form-input {
  padding-left: calc(var(--spacing-md) + 20px);
}

.input-group .form-input:has(+ .input-suffix) {
  padding-right: calc(var(--spacing-md) + 20px);
}

.radio-group,
.checkbox-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
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
}

.radio-label,
.checkbox-label {
  color: var(--color-text-primary);
  user-select: none;
}

.error-message {
  font-size: var(--font-size-xs);
  color: var(--color-error);
  margin-top: var(--spacing-xs);
}

.add-btn {
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs) var(--spacing-sm);
  background: var(--color-primary);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-md);
  color: white;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.add-btn:hover {
  background: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
}

.remove-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: none;
  border: 1px solid var(--color-error);
  border-radius: var(--border-radius-sm);
  color: var(--color-error);
  cursor: pointer;
  transition: all var(--duration-fast);
}

.remove-btn:hover {
  background: var(--color-error);
  color: white;
}

.contact-list,
.competitor-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.contact-item,
.competitor-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
}

.contact-header,
.competitor-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.contact-index,
.competitor-index {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.contact-form,
.competitor-form {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--spacing-md);
}

.attention-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--spacing-lg);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-lg);
  padding: var(--spacing-xl);
  color: var(--color-text-secondary);
  text-align: center;
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-xl);
  padding-top: var(--spacing-xl);
  border-top: 1px solid var(--color-border);
}

.form-actions__right {
  display: flex;
  gap: var(--spacing-md);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .attention-grid {
    grid-template-columns: 1fr;
  }

  .contact-form,
  .competitor-form {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }

  .page-header__actions {
    justify-content: center;
  }

  .steps-nav {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .step-item {
    min-width: auto;
  }

  .step-item:not(:last-child)::after {
    display: none;
  }

  .form-container {
    padding: var(--spacing-lg);
  }

  .form-actions {
    flex-direction: column;
    gap: var(--spacing-md);
  }

  .form-actions__right {
    width: 100%;
    justify-content: center;
  }
}
</style>
