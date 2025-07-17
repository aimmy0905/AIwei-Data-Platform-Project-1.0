// 客户评价模拟数据
export interface CustomerReview {
  id: string;
  customerId: string;
  customerName: string;
  projectId: string;
  projectName: string;
  evaluationMonth: string; // YYYY-MM格式
  evaluator: string; // 客户方评价人员
  evaluationDate: string; // 评价日期
  overallRating: number; // 综合评分 1-10
  problemHandlingRating: number; // 问题处理评分 1-10
  professionalRating: number; // 专业能力评分 1-10
  serviceAttitudeRating: number; // 服务态度评分 1-10
  improvementSuggestions?: string; // 改进建议
  responsibleTeam: string; // 负责团队
  createTime: string;
  createdBy: string;
}

// 客户信息
export const customers = [
  { id: '1', name: '腾讯科技' },
  { id: '2', name: '阿里巴巴' },
  { id: '3', name: '字节跳动' },
  { id: '4', name: '美团' },
  { id: '5', name: '京东' },
  { id: '6', name: '百度' },
  { id: '7', name: '小米科技' },
  { id: '8', name: '华为技术' }
];

// 项目信息
export const projects = [
  { id: '1', customerId: '1', name: '微信小程序推广' },
  { id: '2', customerId: '1', name: 'QQ音乐品牌营销' },
  { id: '3', customerId: '2', name: '淘宝双11活动' },
  { id: '4', customerId: '2', name: '支付宝用户增长' },
  { id: '5', customerId: '3', name: '抖音短视频推广' },
  { id: '6', customerId: '3', name: '今日头条信息流' },
  { id: '7', customerId: '4', name: '美团外卖推广' },
  { id: '8', customerId: '4', name: '美团酒店营销' },
  { id: '9', customerId: '5', name: '京东618大促' },
  { id: '10', customerId: '5', name: '京东物流品牌' },
  { id: '11', customerId: '6', name: '百度搜索广告' },
  { id: '12', customerId: '6', name: '百度地图推广' },
  { id: '13', customerId: '7', name: '小米手机营销' },
  { id: '14', customerId: '7', name: '小米生态链推广' },
  { id: '15', customerId: '8', name: '华为手机海外' },
  { id: '16', customerId: '8', name: '华为云服务' }
];

// 客户评价数据
export const customerReviews: CustomerReview[] = [
  {
    id: '1',
    customerId: '1',
    customerName: '腾讯科技',
    projectId: '1',
    projectName: '微信小程序推广',
    evaluationMonth: '2024-12',
    evaluator: '张经理',
    evaluationDate: '2025-01-05',
    overallRating: 9,
    problemHandlingRating: 9,
    professionalRating: 8,
    serviceAttitudeRating: 10,
    improvementSuggestions: '希望能在数据分析报告中增加更多竞品对比分析，帮助我们更好地了解市场位置。',
    createTime: '2025-01-05 14:30:00',
    createdBy: '李销售'
  },
  {
    id: '2',
    customerId: '2',
    customerName: '阿里巴巴',
    projectId: '3',
    projectName: '淘宝双11活动',
    evaluationMonth: '2024-11',
    evaluator: '王总监',
    evaluationDate: '2024-12-03',
    overallRating: 8,
    problemHandlingRating: 8,
    professionalRating: 9,
    serviceAttitudeRating: 8,
    improvementSuggestions: '团队专业能力很强，建议在紧急情况下的响应速度可以再快一些。',
    createTime: '2024-12-03 16:20:00',
    createdBy: '张销售'
  },
  {
    id: '3',
    customerId: '3',
    customerName: '字节跳动',
    projectId: '5',
    projectName: '抖音短视频推广',
    evaluationMonth: '2024-12',
    evaluator: '刘产品',
    evaluationDate: '2025-01-08',
    overallRating: 10,
    problemHandlingRating: 10,
    professionalRating: 10,
    serviceAttitudeRating: 9,
    improvementSuggestions: '非常满意，希望继续保持这种高质量的服务水准。',
    createTime: '2025-01-08 10:15:00',
    createdBy: '王销售'
  },
  {
    id: '4',
    customerId: '4',
    customerName: '美团',
    projectId: '7',
    projectName: '美团外卖推广',
    evaluationMonth: '2024-12',
    evaluator: '陈运营',
    evaluationDate: '2025-01-04',
    overallRating: 7,
    problemHandlingRating: 7,
    professionalRating: 8,
    serviceAttitudeRating: 7,
    improvementSuggestions: '整体表现良好，建议在创意素材方面能够更加贴合我们的品牌调性。',
    createTime: '2025-01-04 11:45:00',
    createdBy: '赵销售'
  },
  {
    id: '5',
    customerId: '5',
    customerName: '京东',
    projectId: '9',
    projectName: '京东618大促',
    evaluationMonth: '2024-06',
    evaluator: '孙经理',
    evaluationDate: '2024-07-02',
    overallRating: 9,
    problemHandlingRating: 9,
    professionalRating: 9,
    serviceAttitudeRating: 8,
    improvementSuggestions: '在大促期间的配合度很高，数据监控及时，希望能在预算优化建议方面提供更多支持。',
    createTime: '2024-07-02 15:30:00',
    createdBy: '李销售'
  },
  {
    id: '6',
    customerId: '6',
    customerName: '百度',
    projectId: '11',
    projectName: '百度搜索广告',
    evaluationMonth: '2024-11',
    evaluator: '周主管',
    evaluationDate: '2024-12-01',
    overallRating: 8,
    problemHandlingRating: 8,
    professionalRating: 9,
    serviceAttitudeRating: 8,
    improvementSuggestions: '专业能力很强，建议在周报的数据解读部分能更加详细一些。',
    createTime: '2024-12-01 13:20:00',
    createdBy: '钱销售'
  },
  {
    id: '7',
    customerId: '7',
    customerName: '小米科技',
    projectId: '13',
    projectName: '小米手机营销',
    evaluationMonth: '2024-12',
    evaluator: '吴经理',
    evaluationDate: '2025-01-06',
    overallRating: 9,
    problemHandlingRating: 8,
    professionalRating: 9,
    serviceAttitudeRating: 9,
    improvementSuggestions: '团队很专业，服务态度也很好，希望在海外市场推广方面能提供更多经验分享。',
    createTime: '2025-01-06 14:10:00',
    createdBy: '孙销售'
  },
  {
    id: '8',
    customerId: '8',
    customerName: '华为技术',
    projectId: '15',
    projectName: '华为手机海外',
    evaluationMonth: '2024-11',
    evaluator: '郑总监',
    evaluationDate: '2024-12-05',
    overallRating: 8,
    problemHandlingRating: 9,
    professionalRating: 8,
    serviceAttitudeRating: 8,
    improvementSuggestions: '在海外市场的本地化策略方面给出了很好的建议，希望能在文化适应性方面继续深入。',
    createTime: '2024-12-05 16:40:00',
    createdBy: '何销售'
  },
  {
    id: '9',
    customerId: '1',
    customerName: '腾讯科技',
    projectId: '2',
    projectName: 'QQ音乐品牌营销',
    evaluationMonth: '2024-11',
    evaluator: '张经理',
    evaluationDate: '2024-12-02',
    overallRating: 7,
    problemHandlingRating: 7,
    professionalRating: 8,
    serviceAttitudeRating: 7,
    improvementSuggestions: '在音乐行业的理解还需要加强，建议团队多了解音乐产业的特点。',
    createTime: '2024-12-02 10:25:00',
    createdBy: '李销售'
  },
  {
    id: '10',
    customerId: '2',
    customerName: '阿里巴巴',
    projectId: '4',
    projectName: '支付宝用户增长',
    evaluationMonth: '2024-12',
    evaluator: '王总监',
    evaluationDate: '2025-01-03',
    overallRating: 9,
    problemHandlingRating: 9,
    professionalRating: 9,
    serviceAttitudeRating: 9,
    improvementSuggestions: '整体表现优秀，数据分析能力强，希望在用户画像分析方面能更加精细化。',
    createTime: '2025-01-03 15:50:00',
    createdBy: '张销售'
  }
];

// 获取客户评价列表的API模拟
export function getCustomerReviews(params?: {
  page?: number;
  pageSize?: number;
  search?: string;
  customerId?: string;
  projectId?: string;
  evaluationMonth?: string;
  ratingRange?: [number, number];
  dateRange?: [string, string];
}) {
  let filteredReviews = [...customerReviews];

  // 搜索过滤
  if (params?.search) {
    const searchLower = params.search.toLowerCase();
    filteredReviews = filteredReviews.filter(review =>
      review.customerName.toLowerCase().includes(searchLower) ||
      review.projectName.toLowerCase().includes(searchLower) ||
      review.evaluator.toLowerCase().includes(searchLower)
    );
  }

  // 客户过滤
  if (params?.customerId) {
    filteredReviews = filteredReviews.filter(review => review.customerId === params.customerId);
  }

  // 项目过滤
  if (params?.projectId) {
    filteredReviews = filteredReviews.filter(review => review.projectId === params.projectId);
  }

  // 评价月份过滤
  if (params?.evaluationMonth) {
    filteredReviews = filteredReviews.filter(review => review.evaluationMonth === params.evaluationMonth);
  }

  // 评分范围过滤
  if (params?.ratingRange) {
    const [min, max] = params.ratingRange;
    filteredReviews = filteredReviews.filter(review =>
      review.overallRating >= min && review.overallRating <= max
    );
  }

  // 日期范围过滤
  if (params?.dateRange) {
    const [startDate, endDate] = params.dateRange;
    filteredReviews = filteredReviews.filter(review =>
      review.createTime >= startDate && review.createTime <= endDate
    );
  }

  // 分页
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const total = filteredReviews.length;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const data = filteredReviews.slice(startIndex, endIndex);

  return {
    data,
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize)
  };
}

// 获取单个客户评价详情
export function getCustomerReview(id: string) {
  return customerReviews.find(review => review.id === id);
}

// 获取客户列表
export function getCustomers() {
  return customers;
}

// 获取项目列表
export function getProjects(customerId?: string) {
  if (customerId) {
    return projects.filter(project => project.customerId === customerId);
  }
  return projects;
}

// 创建客户评价
export function createCustomerReview(reviewData: Omit<CustomerReview, 'id' | 'createTime' | 'createdBy'>) {
  const newReview: CustomerReview = {
    ...reviewData,
    id: Date.now().toString(),
    createTime: new Date().toISOString().replace('T', ' ').substring(0, 19),
    createdBy: '当前用户' // 实际应用中应该从用户状态获取
  };

  customerReviews.unshift(newReview);
  return newReview;
}

// 更新客户评价
export function updateCustomerReview(id: string, reviewData: Partial<CustomerReview>) {
  const index = customerReviews.findIndex(review => review.id === id);
  if (index !== -1) {
    customerReviews[index] = { ...customerReviews[index], ...reviewData };
    return customerReviews[index];
  }
  return null;
}

// 删除客户评价
export function deleteCustomerReview(id: string) {
  const index = customerReviews.findIndex(review => review.id === id);
  if (index !== -1) {
    customerReviews.splice(index, 1);
    return true;
  }
  return false;
}
