<template>
  <div class="person-center">
    <!-- 个人信息头部 -->
    <div class="profile-header">
      <div class="profile-cover"></div>
      <div class="profile-info">
        <el-avatar :size="80" src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
          class="profile-avatar" />
        <div class="profile-details">
          <h2 class="profile-name">南瓜头</h2>
          <p class="profile-bio">热爱技术，分享生活 | 前端开发工程师</p>
          <div class="profile-stats">
            <div class="stat-item">
              <span class="stat-value">128</span>
              <span class="stat-label">文章</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">3.2k</span>
              <span class="stat-label">粉丝</span>
            </div>
            <div class="stat-item">
              <span class="stat-value">256</span>
              <span class="stat-label">关注</span>
            </div>
          </div>
        </div>
        <div class="profile-actions">
          <el-button type="primary" size="small" round>编辑资料</el-button>
          <el-button size="small" round>
            <el-icon>
              <Share />
            </el-icon>分享
          </el-button>
        </div>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="content-area">
      <el-tabs class="custom-tabs">
        <el-tab-pane label="个人资料">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="24" :md="12">
              <div class="info-card">
                <h3 class="card-title">
                  <el-icon>
                    <User />
                  </el-icon>基本信息
                </h3>
                <el-descriptions :column="1" border>
                  <el-descriptions-item label="用户名">南瓜头</el-descriptions-item>
                  <el-descriptions-item label="邮箱">user@example.com</el-descriptions-item>
                  <el-descriptions-item label="手机">138****6666</el-descriptions-item>
                  <el-descriptions-item label="注册时间">2020-01-15</el-descriptions-item>
                  <el-descriptions-item label="个人主页">
                    <el-link type="primary" href="https://example.com/blog"
                      target="_blank">https://example.com/blog</el-link>
                  </el-descriptions-item>
                </el-descriptions>
              </div>
            </el-col>
            <el-col :xs="24" :sm="24" :md="12">
              <div class="info-card">
                <h3 class="card-title">
                  <el-icon>
                    <Medal />
                  </el-icon>成就与技能
                </h3>
                <div class="skills-container">
                  <div class="skill-category">
                    <h4>技术栈</h4>
                    <div class="skill-tags">
                      <el-tag size="small" effect="plain" type="success">Vue.js</el-tag>
                      <el-tag size="small" effect="plain" type="success">React</el-tag>
                      <el-tag size="small" effect="plain" type="success">JavaScript</el-tag>
                      <el-tag size="small" effect="plain" type="success">TypeScript</el-tag>
                      <el-tag size="small" effect="plain" type="success">Node.js</el-tag>
                    </div>
                  </div>
                  <div class="skill-category">
                    <h4>兴趣爱好</h4>
                    <div class="skill-tags">
                      <el-tag size="small" effect="plain" type="warning">摄影</el-tag>
                      <el-tag size="small" effect="plain" type="warning">旅行</el-tag>
                      <el-tag size="small" effect="plain" type="warning">阅读</el-tag>
                      <el-tag size="small" effect="plain" type="warning">音乐</el-tag>
                    </div>
                  </div>
                  <div class="achievements">
                    <h4>成就</h4>
                    <div class="achievement-item">
                      <el-icon class="achievement-icon">
                        <Trophy />
                      </el-icon>
                      <span>年度优质创作者</span>
                    </div>
                    <div class="achievement-item">
                      <el-icon class="achievement-icon">
                        <Star />
                      </el-icon>
                      <span>连续签到365天</span>
                    </div>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>

          <div class="info-card">
            <h3 class="card-title">
              <el-icon>
                <Setting />
              </el-icon>账户设置
            </h3>
            <el-row :gutter="20" class="setting-options">
              <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="(option, index) in accountSettings" :key="index">
                <div class="setting-option" @click="handleSettingClick(option)">
                  <el-icon class="option-icon">
                    <component :is="option.icon" />
                  </el-icon>
                  <div class="option-info">
                    <div class="option-title">{{ option.title }}</div>
                    <div class="option-desc">{{ option.description }}</div>
                  </div>
                  <el-icon>
                    <ArrowRight />
                  </el-icon>
                </div>
              </el-col>
            </el-row>
          </div>
        </el-tab-pane>

        <el-tab-pane label="我的文章">
          <div class="articles-container">
            <div class="filter-bar">
              <el-radio-group v-model="articleFilter" size="small">
                <el-radio-button label="all">全部文章</el-radio-button>
                <el-radio-button label="published">已发布</el-radio-button>
                <el-radio-button label="draft">草稿箱</el-radio-button>
              </el-radio-group>
              <el-input v-model="searchKeyword" placeholder="搜索文章..." prefix-icon="Search" size="small"
                class="search-input" />
            </div>

            <el-empty v-if="articles.length === 0" description="暂无文章" />

            <div v-else class="article-list">
              <div v-for="(article, index) in articles" :key="index" class="article-item">
                <div class="article-main">
                  <h3 class="article-title">{{ article.title }}</h3>
                  <p class="article-excerpt">{{ article.excerpt }}</p>
                  <div class="article-meta">
                    <span class="meta-item">
                      <el-icon>
                        <Calendar />
                      </el-icon>
                      {{ article.date }}
                    </span>
                    <span class="meta-item">
                      <el-icon>
                        <View />
                      </el-icon>
                      {{ article.views }} 阅读
                    </span>
                    <span class="meta-item">
                      <el-icon>
                        <ChatDotRound />
                      </el-icon>
                      {{ article.comments }} 评论
                    </span>
                    <span class="meta-item">
                      <el-tag size="small" :type="article.status === 'published' ? 'success' : 'info'">
                        {{ article.status === 'published' ? '已发布' : '草稿' }}
                      </el-tag>
                    </span>
                  </div>
                </div>
                <div class="article-actions">
                  <el-button size="small" type="primary" plain>编辑</el-button>
                  <el-button size="small" type="danger" plain>删除</el-button>
                </div>
              </div>
            </div>

            <div class="pagination-container">
              <el-pagination background layout="prev, pager, next" :total="50" :page-size="5" />
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="我的订单">
          <div class="orders-container">
            <div class="order-quick-actions">
              <el-button type="primary" @click="goToOrderPage">查看全部订单</el-button>
              <el-button @click="goToOrderPage('pending')">待付款订单</el-button>
              <el-button @click="goToOrderPage('shipped')">待收货订单</el-button>
            </div>

            <div class="recent-orders">
              <h4>最近订单</h4>
              <div class="order-list">
                <div v-for="order in recentOrders" :key="order.id" class="order-item">
                  <div class="order-info">
                    <span class="order-number">{{ order.orderNumber }}</span>
                    <el-tag :type="getOrderTagType(order.status)" size="small">{{ getOrderStatusText(order.status) }}</el-tag>
                  </div>
                  <div class="order-amount">¥{{ order.totalAmount }}</div>
                  <div class="order-date">{{ order.createTime }}</div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>

        <el-tab-pane label="消息通知">
          <div class="notifications-container">
            <div class="notification-tabs">
              <el-tabs>
                <el-tab-pane label="全部消息">
                  <div class="notification-list">
                    <div v-for="(notification, index) in notifications" :key="index" class="notification-item">
                      <el-avatar :size="40" :src="notification.avatar" />
                      <div class="notification-content">
                        <div class="notification-text" v-html="notification.content"></div>
                        <div class="notification-time">{{ notification.time }}</div>
                      </div>
                      <div class="notification-actions">
                        <el-button size="small" text>标为已读</el-button>
                      </div>
                    </div>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="评论">
                  <el-empty description="暂无评论通知" />
                </el-tab-pane>
                <el-tab-pane label="点赞">
                  <el-empty description="暂无点赞通知" />
                </el-tab-pane>
                <el-tab-pane label="系统">
                  <el-empty description="暂无系统通知" />
                </el-tab-pane>
              </el-tabs>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import {
  User, Setting, Medal, Trophy, Star, Share, Calendar,
  View, ChatDotRound, Lock, Bell, Wallet, Key,
  Message, ArrowRight, Search
} from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';

// 账户设置选项
const accountSettings = reactive([
  { 
    title: '个人资料', 
    description: '修改个人信息', 
    icon: 'User',
    action: 'editProfile'
  },
  { 
    title: '账户安全', 
    description: '修改密码和安全设置', 
    icon: 'Lock',
    action: 'security'
  },
  { 
    title: '消息通知', 
    description: '设置通知偏好', 
    icon: 'Bell',
    action: 'notifications'
  },
  { 
    title: '账户余额', 
    description: '查看账户余额和交易', 
    icon: 'Wallet',
    action: 'balance'
  },
  { 
    title: '隐私设置', 
    description: '管理隐私选项', 
    icon: 'Key',
    action: 'privacy'
  },
  { 
    title: '退出登录', 
    description: '安全退出当前账户', 
    icon: 'SwitchButton',
    action: 'logout'
  }
]);

// 文章相关
const articleFilter = ref('all');
const searchKeyword = ref('');
const articles = reactive([
  {
    title: 'Vue3 组合式API最佳实践',
    excerpt: '本文详细介绍了Vue3组合式API的使用方法和最佳实践，帮助你更好地组织代码结构...',
    date: '2023-05-15',
    views: 2456,
    comments: 32,
    status: 'published'
  },
  {
    title: 'CSS Grid布局完全指南',
    excerpt: 'CSS Grid是一种强大的二维布局系统，本文将从基础到高级详细讲解Grid布局的各种用法...',
    date: '2023-04-28',
    views: 1832,
    comments: 24,
    status: 'published'
  },
  {
    title: 'JavaScript异步编程详解',
    excerpt: '从回调函数到Promise，再到async/await，本文全面讲解JavaScript中的异步编程模式...',
    date: '2023-04-10',
    views: 3215,
    comments: 45,
    status: 'draft'
  }
]);

// 消息通知
const notifications = reactive([
  {
    avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
    content: '<strong>张三</strong> 评论了你的文章 <a href="#">《Vue3 组合式API最佳实践》</a>',
    time: '10分钟前'
  },
  {
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
    content: '<strong>李四</strong> 点赞了你的文章 <a href="#">《CSS Grid布局完全指南》</a>',
    time: '2小时前'
  },
  {
    avatar: 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png',
    content: '系统通知：您的账户已成功升级为 <strong>高级会员</strong>',
    time: '1天前'
  }
]);

// 最近订单数据
const recentOrders = reactive([
  {
    id: 1,
    orderNumber: 'ORD202412010001',
    status: 'pending',
    createTime: '2024-12-01',
    totalAmount: 299.00
  },
  {
    id: 2,
    orderNumber: 'ORD202411280002',
    status: 'completed',
    createTime: '2024-11-28',
    totalAmount: 158.00
  },
  {
    id: 3,
    orderNumber: 'ORD202411250003',
    status: 'shipped',
    createTime: '2024-11-25',
    totalAmount: 89.00
  }
]);

// 初始化router
const router = useRouter();

// 订单相关函数
const goToOrderPage = (status = '') => {
  // 使用Vue Router跳转到商城页面
  if (status) {
    router.push(`/shop?status=${status}`);
  } else {
    router.push('/shop');
  }
};

const getOrderTagType = (status) => {
  const typeMap = {
    pending: 'warning',
    paid: 'info',
    shipped: 'primary',
    completed: 'success',
    cancelled: 'danger'
  };
  return typeMap[status] || '';
};

const getOrderStatusText = (status) => {
  const textMap = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消'
  };
  return textMap[status] || '未知状态';
};

// 处理设置选项点击
const handleSettingClick = (option) => {
  if (option.action === 'logout') {
    ElMessage.success('您已成功退出登录');
  } else {
    ElMessage.info(`您点击了${option.title}选项`);
  }
};
</script>

<style lang="less" scoped>
.person-center {
  font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
/* 抽屉样式调整 */
:deep(.user-center-drawer) {
  .el-drawer__header {
    margin-bottom: 0 !important;
    padding: 0;
  }
  
  .el-drawer__body {
    padding: 0;
  }
}
/* 个人信息头部 */
.profile-header {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
}

.profile-cover {
  height: 120px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
}

.profile-info {
  padding: 0 20px 20px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
}

.profile-avatar {
  margin-top: -40px;
  border: 4px solid #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.profile-details {
  margin-left: 20px;
  flex: 1;
  min-width: 200px;
}

.profile-name {
  margin: 10px 0 5px;
  font-size: 20px;
  font-weight: 600;
}

.profile-bio {
  color: #666;
  margin: 0 0 15px;
  font-size: 14px;
}

.profile-stats {
  display: flex;
  gap: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-weight: 600;
  font-size: 16px;
}

.stat-label {
  font-size: 12px;
  color: #666;
}

.profile-actions {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  margin-top: 10px;
}

/* 内容区域 */
.content-area {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

.custom-tabs {
  width: 100%;
}

/* 信息卡片 */
.info-card {
  background-color: #fff;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.card-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-top: 0;
  margin-bottom: 15px;
  color: #333;
}

.card-title .el-icon {
  margin-right: 8px;
  color: #3b82f6;
}

/* 技能和成就 */
.skills-container {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.skill-category h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #666;
}

.skill-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.achievements {
  margin-top: 10px;
}

.achievements h4 {
  margin: 0 0 8px;
  font-size: 14px;
  color: #666;
}

.achievement-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.achievement-icon {
  color: #f59e0b;
  margin-right: 8px;
}

/* 设置选项 */
.setting-options {
  display: flex;
  flex-wrap: wrap;
}

.setting-option {
  display: flex;
  align-items: center;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  margin-bottom: 15px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.setting-option:hover {
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.option-icon {
  font-size: 20px;
  color: #3b82f6;
  margin-right: 12px;
}

.option-info {
  flex: 1;
}

.option-title {
  font-weight: 500;
  margin-bottom: 4px;
}

.option-desc {
  font-size: 12px;
  color: #666;
}

/* 文章列表 */
.articles-container {
  padding: 10px 0;
}

.filter-bar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
}

.search-input {
  width: 200px;
}

.article-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.article-item {
  display: flex;
  justify-content: space-between;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  align-items: center;
}

.article-main {
  flex: 1;
  margin-right: 15px;
}

.article-title {
  margin: 0 0 8px;
  font-size: 16px;
  font-weight: 600;
}

.article-excerpt {
  color: #666;
  margin: 0 0 10px;
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  font-size: 12px;
  color: #666;
}

.meta-item {
  display: flex;
  align-items: center;
}

.meta-item .el-icon {
  margin-right: 4px;
}

.article-actions {
  display: flex;
  gap: 10px;
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

/* 消息通知 */
// 订单相关样式
.orders-container {
  .order-quick-actions {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
  }

  .recent-orders {
    h4 {
      margin-bottom: 15px;
      color: #333;
      font-weight: 500;
    }

    .order-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .order-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 16px;
        border-radius: 8px;
        background-color: #f9f9f9;
        transition: all 0.3s ease;

        &:hover {
          background-color: #f0f0f0;
        }

        .order-info {
          display: flex;
          align-items: center;
          gap: 10px;

          .order-number {
            font-weight: 500;
            color: #333;
          }
        }

        .order-amount {
          color: #ff4d4f;
          font-weight: 600;
          font-size: 16px;
        }

        .order-date {
          color: #666;
          font-size: 14px;
        }
      }
    }
  }
}

.notification-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.notification-item {
  display: flex;
  padding: 15px;
  border-radius: 8px;
  background-color: #f9f9f9;
  align-items: flex-start;
}

.notification-content {
  flex: 1;
  margin: 0 15px;
}

.notification-text {
  font-size: 14px;
  margin-bottom: 5px;
}

.notification-text a {
  color: #3b82f6;
  text-decoration: none;
}

.notification-time {
  font-size: 12px;
  color: #999;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .profile-info {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .profile-details {
    margin-left: 0;
    margin-top: 10px;
  }
  
  .profile-stats {
    justify-content: center;
  }
  
  .profile-actions {
    margin-top: 15px;
    justify-content: center;
  }
  
  .article-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .article-actions {
    margin-top: 15px;
    align-self: flex-end;
  }
  
  .notification-item {
    flex-direction: column;
  }
  
  .notification-content {
    margin: 10px 0;
  }
  
  .notification-actions {
    align-self: flex-end;
  }
  
  .filter-bar {
    flex-direction: column;
  }
  
    .search-input {
    width: 100%;
  }
}

</style>