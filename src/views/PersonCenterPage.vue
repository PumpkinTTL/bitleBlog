<template>
  <div class="person-center-page animate__animated animate__fadeIn">
    <!-- 主内容区域 -->
    <div class="main-container container">
      <div class="dashboard-layout">
        <!-- 左侧用户信息和快速访问 -->
        <div v-motion :initial="{ opacity: 0, x: -15 }" :visible="{ opacity: 1, x: 0 }" class="dashboard-sidebar">
          <!-- 用户信息卡片 -->
          <PersonInfoCard 
            :userInfo="userInfo" 
            :userStats="userStats"
            @edit-profile="handleEditProfile"
            @edit-avatar="handleAvatarEdit"
          />
          
          <!-- 快速访问链接 - 优化紧凑度 -->
          <div class="quick-links-card glass-effect">
            <div class="card-header">
              <i class="fas fa-bolt"></i>
              <h3 class="card-title">快速访问</h3>
            </div>
            <div class="quick-links">
              <div class="quick-link-item" @click="activeTab = 'articles'" :class="{ active: activeTab === 'articles' }">
                <div class="link-icon">
                  <i class="fas fa-file-alt"></i>
                </div>
                <span class="link-text">我的文章</span>
                <span class="link-badge">{{ userStats.articles }}</span>
              </div>
              <div class="quick-link-item" @click="activeTab = 'favorites'" :class="{ active: activeTab === 'favorites' }">
                <div class="link-icon">
                  <i class="fas fa-heart"></i>
                </div>
                <span class="link-text">我的收藏</span>
                <span class="link-badge">{{ favorites.length }}</span>
              </div>
              <div class="quick-link-item" @click="activeTab = 'settings'" :class="{ active: activeTab === 'settings' }">
                <div class="link-icon">
                  <i class="fas fa-cog"></i>
                </div>
                <span class="link-text">账号设置</span>
                <span class="link-arrow"><i class="fas fa-chevron-right"></i></span>
              </div>
              <div class="quick-link-item">
                <div class="link-icon">
                  <i class="fas fa-chart-line"></i>
                </div>
                <span class="link-text">数据统计</span>
                <span class="link-arrow"><i class="fas fa-chevron-right"></i></span>
              </div>
            </div>
          </div>
          
          <!-- 通知消息列表 -->
          <div class="notifications-card glass-effect animate__animated animate__fadeIn" style="animation-delay: 0.2s">
            <div class="card-header">
              <i class="fas fa-bell"></i>
              <h3 class="card-title">通知消息</h3>
              <div class="card-action">
                <span class="view-all" @click="showAllNotifications">查看全部</span>
              </div>
            </div>
            <div class="notifications-content">
              <div class="notification-item unread" @click="showNotificationDetail(1)">
                <div class="notification-dot"></div>
                <div class="notification-icon system">
                  <i class="fas fa-shield-alt"></i>
                </div>
                <div class="notification-info">
                  <div class="notification-title">系统通知</div>
                  <div class="notification-text">您的账户安全等级已提升，点击查看详情</div>
                  <div class="notification-time">10分钟前</div>
                </div>
              </div>
              
              <div class="notification-item unread" @click="showNotificationDetail(2)">
                <div class="notification-dot"></div>
                <div class="notification-icon comment">
                  <i class="fas fa-comment-dots"></i>
                </div>
                <div class="notification-info">
                  <div class="notification-title">评论通知</div>
                  <div class="notification-text">李四评论了您的文章《Vue3响应式原理》</div>
                  <div class="notification-time">1小时前</div>
                </div>
              </div>
              
              <div class="notification-item" @click="showNotificationDetail(3)">
                <div class="notification-icon like">
                  <i class="fas fa-heart"></i>
                </div>
                <div class="notification-info">
                  <div class="notification-title">点赞通知</div>
                  <div class="notification-text">您的文章《前端性能优化》收到5个新点赞</div>
                  <div class="notification-time">2天前</div>
                </div>
              </div>
              
              <div class="notification-item" @click="showNotificationDetail(4)">
                <div class="notification-icon follow">
                  <i class="fas fa-user-plus"></i>
                </div>
                <div class="notification-info">
                  <div class="notification-title">关注通知</div>
                  <div class="notification-text">王五关注了您</div>
                  <div class="notification-time">1周前</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 右侧内容区域 -->
        <div v-motion :initial="{ opacity: 0, x: 15 }" :visible="{ opacity: 1, x: 0 }" class="dashboard-content glass-effect">
          <!-- 内容标题栏 - 优化布局 -->
          <div class="content-header">
            <div class="tabs-nav">
              <div 
                v-for="tab in tabs" 
                :key="tab.name"
                :class="['tab-item', { active: activeTab === tab.name }]"
                @click="activeTab = tab.name"
              >
                <i :class="getTabIcon(tab.name)"></i>
                <span class="tab-label">{{ tab.label }}</span>
                <span class="tab-line"></span>
              </div>
            </div>
            <div class="content-actions">
              <button class="action-button refresh-btn" @click="refreshContent">
                <i class="fas fa-sync-alt"></i>
                <span>刷新</span>
              </button>
              <button class="action-button create-btn" @click="createNewArticle">
                <i class="fas fa-plus"></i>
                <span>写文章</span>
              </button>
            </div>
          </div>
          
          <!-- 内容区域 -->
          <div class="content-body">
            <!-- 标签页内容 -->
            <transition name="fade-transform" mode="out-in">
              <div v-if="activeTab === 'articles'" class="tab-pane">
                <ArticlesList 
                  :articles="paginatedArticles" 
                  :showActions="true"
                  @edit="editArticle"
                  @delete="deleteArticle"
                  @create="createNewArticle"
                />
                <div class="pagination-container" v-if="articles.length > pageSize">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="articles.length"
                    :page-size="pageSize"
                    :current-page="currentArticlePage"
                    @current-change="handleArticlePageChange"
                  />
                </div>
              </div>
              
              <div v-else-if="activeTab === 'favorites'" class="tab-pane">
                <FavoritesList 
                  :favorites="paginatedFavorites"
                  @remove="removeFromFavorites"
                />
                <div class="pagination-container" v-if="favorites.length > pageSize">
                  <el-pagination
                    background
                    layout="prev, pager, next"
                    :total="favorites.length"
                    :page-size="pageSize"
                    :current-page="currentFavoritePage"
                    @current-change="handleFavoritePageChange"
                  />
                </div>
              </div>
              
              <div v-else-if="activeTab === 'settings'" class="tab-pane">
                <AccountSettings 
                  :userInfo="userInfo"
                  @update="updateUserInfo"
                  @password-changed="handlePasswordChanged"
                />
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 通知详情弹窗 -->
    <el-dialog
      v-model="notificationDialogVisible"
      :title="currentNotification?.title || '通知详情'"
      width="400px"
      destroy-on-close
      center
      class="notification-dialog"
    >
      <div class="notification-detail" v-if="currentNotification">
        <div class="notification-detail-header" :class="currentNotification.type">
          <div class="notification-detail-icon">
            <i :class="currentNotification.icon"></i>
          </div>
        </div>
        <div class="notification-detail-content">
          <div class="notification-detail-time">{{ currentNotification.time }}</div>
          <div class="notification-detail-text">{{ currentNotification.content }}</div>
        </div>
        <div class="notification-detail-actions">
          <button class="action-btn" @click="notificationDialogVisible = false">
            <i class="fas fa-check"></i>
            <span>已读</span>
          </button>
          <button class="action-btn" v-if="currentNotification.type === 'system'" @click="goToSecurity">
            <i class="fas fa-shield-alt"></i>
            <span>前往设置</span>
          </button>
          <button class="action-btn" v-if="['comment', 'like'].includes(currentNotification.type)" @click="viewRelatedContent">
            <i class="fas fa-eye"></i>
            <span>查看相关内容</span>
          </button>
          <button class="action-btn" v-if="currentNotification.type === 'follow'" @click="viewUserProfile">
            <i class="fas fa-user"></i>
            <span>查看用户</span>
          </button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { ElMessage } from 'element-plus'

// 导入组件
import PersonInfoCard from '@/components/person/PersonInfoCard.vue'
import ArticlesList from '@/components/person/ArticlesList.vue'
import FavoritesList from '@/components/person/FavoritesList.vue'
import AccountSettings from '@/components/person/AccountSettings.vue'
import ProfileBanner from '@/components/common/ProfileBanner.vue'

// 定义文章和收藏的接口
interface Article {
  id: number;
  title: string;
  brief: string;
  cover?: string;
  publishTime: string;
  views?: number;
  likes?: number;
  comments?: number;
  isTop?: boolean;
  isRecommend?: boolean;
  isOriginal?: boolean;
}

interface FavoriteItem {
  id: number;
  type: string;
  title: string;
  brief: string;
  author: string;
  cover?: string;
  collectTime: string;
  sourceId: number;
}

const router = useRouter()

// 获取用户信息
const store = useStore()
const userInfo = computed(() => store.userInfo || {})

// 用户统计数据
const userStats = reactive({
  articles: 0,
  followers: 0,
  following: 0,
  likes: 0
})

// 选项卡配置
const tabs = [
  { name: 'articles', label: '我的文章' },
  { name: 'favorites', label: '我的收藏' },
  { name: 'settings', label: '账号设置' }
]

// 当前激活的选项卡
const activeTab = ref('articles')

// 文章列表
const articles = ref<Article[]>([])

// 收藏列表
const favorites = ref<FavoriteItem[]>([])

// 分页相关
const pageSize = ref(5)
const currentArticlePage = ref(1)
const currentFavoritePage = ref(1)

// 计算分页后的文章列表
const paginatedArticles = computed(() => {
  const start = (currentArticlePage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return articles.value.slice(start, end)
})

// 计算分页后的收藏列表
const paginatedFavorites = computed(() => {
  const start = (currentFavoritePage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return favorites.value.slice(start, end)
})

// 处理文章页码变化
const handleArticlePageChange = (page: number) => {
  currentArticlePage.value = page
}

// 处理收藏页码变化
const handleFavoritePageChange = (page: number) => {
  currentFavoritePage.value = page
}

// 获取选项卡图标
const getTabIcon = (tabName: string) => {
  const iconMap: Record<string, string> = {
    'articles': 'fas fa-file-alt',
    'favorites': 'fas fa-heart',
    'settings': 'fas fa-cog'
  }
  return iconMap[tabName] || 'fas fa-circle'
}

// 获取活动日历样式类
const getActivityClass = (day: number) => {
  // 模拟活动数据，实际应该从API获取
  const activityMap: Record<number, string> = {
    3: 'low-activity',
    7: 'medium-activity',
    12: 'high-activity',
    15: 'medium-activity',
    18: 'low-activity',
    22: 'high-activity',
    25: 'medium-activity',
    28: 'low-activity'
  }
  return activityMap[day] || ''
}

// 计算进度条宽度
const getProgressWidth = (value: number, maxValue: number) => {
  const percentage = Math.min((value / maxValue) * 100, 100)
  return `${percentage}%`
}

// 编辑头像
const handleAvatarEdit = () => {
  ElMessage.info('头像编辑功能开发中')
}

// 编辑个人资料
const handleEditProfile = () => {
  activeTab.value = 'settings'
}

// 编辑文章
const editArticle = (id: number) => {
  ElMessage.info(`编辑文章 ID: ${id}`)
  router.push(`/writer?id=${id}`)
}

// 删除文章
const deleteArticle = (id: number) => {
  // 实际应该调用API删除文章
  articles.value = articles.value.filter(article => article.id !== id)
  ElMessage.success('文章删除成功')
}

// 从收藏中移除
const removeFromFavorites = (id: number) => {
  // 实际应该调用API取消收藏
  favorites.value = favorites.value.filter(item => item.id !== id)
  ElMessage.success('已从收藏中移除')
}

// 更新用户信息
const updateUserInfo = (formData: any) => {
  // 实际应该调用API更新用户信息
  ElMessage.success('用户信息更新成功')
}

// 处理密码修改
const handlePasswordChanged = () => {
  // 密码修改成功后的处理
  ElMessage.success('密码修改成功，请使用新密码重新登录')
}

// 刷新内容
const refreshContent = () => {
  ElMessage.info('正在刷新数据...')
  // 重新加载数据
  loadData()
}

// 创建新文章
const createNewArticle = () => {
  router.push('/writer')
}

// 加载数据
const loadData = () => {
  // 模拟数据加载，实际应该从API获取
  setTimeout(() => {
    // 加载用户统计数据
    userStats.articles = 12
    userStats.followers = 56
    userStats.following = 23
    userStats.likes = 128
    
    // 加载文章列表
    articles.value = [
      {
        id: 1,
        title: 'Vue3 组合式API详解与最佳实践',
        brief: 'Vue3的组合式API是一种新的组件逻辑组织方式，本文详细介绍了它的使用方法和最佳实践...',
        cover: 'https://picsum.photos/id/100/200/120',
        publishTime: '2023-06-15',
        views: 1250,
        likes: 86,
        comments: 32,
        isTop: true,
        isOriginal: true
      },
      {
        id: 2,
        title: 'Element Plus实战：打造现代化的管理系统界面',
        brief: '本文将介绍如何使用Element Plus组件库快速构建一个功能完善、美观大方的管理系统...',
        cover: 'https://picsum.photos/id/101/200/120',
        publishTime: '2023-07-22',
        views: 980,
        likes: 63,
        comments: 28,
        isRecommend: true
      },
      {
        id: 3,
        title: '深入理解Vue3的响应式系统',
        brief: '本文深入探讨Vue3响应式系统的实现原理，包括Proxy的使用以及与Vue2的对比...',
        cover: 'https://picsum.photos/id/102/200/120',
        publishTime: '2023-08-05',
        views: 765,
        likes: 42,
        comments: 18
      },
      {
        id: 4,
        title: 'TypeScript在Vue项目中的最佳实践',
        brief: '如何在Vue项目中充分利用TypeScript的类型系统，提高代码质量和开发效率...',
        cover: 'https://picsum.photos/id/103/200/120',
        publishTime: '2023-08-12',
        views: 890,
        likes: 57,
        comments: 24,
        isOriginal: true
      },
      {
        id: 5,
        title: '前端性能优化：加载速度提升50%的技巧',
        brief: '分享一系列实用的前端性能优化技巧，帮助你的网站加载速度提升50%以上...',
        cover: 'https://picsum.photos/id/104/200/120',
        publishTime: '2023-08-18',
        views: 1320,
        likes: 94,
        comments: 36,
        isTop: true
      },
      {
        id: 6,
        title: '移动端适配策略：从像素到视口',
        brief: '详解移动端适配的各种策略，包括响应式设计、rem适配、vw/vh适配等方案对比...',
        cover: 'https://picsum.photos/id/105/200/120',
        publishTime: '2023-08-25',
        views: 680,
        likes: 38,
        comments: 15
      },
      {
        id: 7,
        title: 'CSS Grid布局完全指南',
        brief: '从基础到高级，全面解析CSS Grid布局系统，附带实用案例和常见问题解决方案...',
        cover: 'https://picsum.photos/id/106/200/120',
        publishTime: '2023-09-02',
        views: 920,
        likes: 65,
        comments: 29,
        isRecommend: true
      }
    ]
    
    // 加载收藏列表
    favorites.value = [
      {
        id: 1,
        type: '文章',
        title: '深入理解JavaScript原型链与继承',
        brief: '详解JavaScript中原型链的工作机制及常见继承模式的实现方式...',
        author: '张三',
        cover: 'https://picsum.photos/id/107/200/120',
        collectTime: '2023-05-20',
        sourceId: 101
      },
      {
        id: 2,
        type: '资源',
        title: '2023前端开发者必备工具集',
        brief: '汇总了当下最流行且实用的前端开发工具、库和框架...',
        author: '李四',
        cover: 'https://picsum.photos/id/108/200/120',
        collectTime: '2023-04-15',
        sourceId: 202
      },
      {
        id: 3,
        type: '文章',
        title: 'React与Vue的深度对比与选型建议',
        brief: '客观分析React与Vue的异同点，帮助团队在项目中做出合适的框架选择...',
        author: '王五',
        cover: 'https://picsum.photos/id/109/200/120',
        collectTime: '2023-06-10',
        sourceId: 303
      },
      {
        id: 4,
        type: '视频',
        title: 'Three.js入门到精通系列教程',
        brief: '从零开始学习Three.js，掌握3D网页开发的核心技能...',
        author: '赵六',
        cover: 'https://picsum.photos/id/110/200/120',
        collectTime: '2023-07-05',
        sourceId: 404
      },
      {
        id: 5,
        type: '课程',
        title: '微前端架构实战课程',
        brief: '学习如何使用微前端架构解决大型应用的开发和维护问题...',
        author: '孙七',
        cover: 'https://picsum.photos/id/111/200/120',
        collectTime: '2023-08-01',
        sourceId: 505
      },
      {
        id: 6,
        type: '资源',
        title: '设计师必备的50套UI组件库',
        brief: '精选50套高质量的UI组件库，适用于各类网站和应用设计...',
        author: '周八',
        cover: 'https://picsum.photos/id/112/200/120',
        collectTime: '2023-08-15',
        sourceId: 606
      }
    ]
  }, 500)
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '未知'
  
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  } catch (e) {
    return dateStr
  }
}

// 通知相关状态和方法
const showAllNotifications = () => {
  ElMessage.info('查看全部通知')
}

const notificationDialogVisible = ref(false)
const currentNotification = ref<any>(null)

const showNotificationDetail = (id: number) => {
  // 模拟获取通知详情数据
  const notificationDetails = [
    {
      id: 1,
      type: 'system',
      title: '系统通知',
      content: '尊敬的用户，您的账户安全等级已提升至"安全"级别。我们建议您开启双重验证，以进一步保障账户安全。点击"安全设置"了解更多。',
      time: '2023-08-20 10:30:22',
      icon: 'fas fa-cogs'
    },
    {
      id: 2,
      type: 'comment',
      title: '评论通知',
      content: '李四评论了您的文章《Vue3响应式原理》：这篇文章写得太好了，对Vue3的响应式系统解释得非常清晰，尤其是关于Proxy和Reflect的部分，让我茅塞顿开。期待您的更多文章！',
      time: '2023-08-20 09:45:13',
      icon: 'fas fa-comment'
    },
    {
      id: 3,
      type: 'like',
      title: '点赞通知',
      content: '您的文章《前端性能优化》最近很受欢迎，获得了5个新的点赞。继续保持优质创作！',
      time: '2023-08-18 15:22:47',
      icon: 'fas fa-heart'
    },
    {
      id: 4,
      type: 'follow',
      title: '关注通知',
      content: '王五关注了您。您可以查看他的个人主页，了解他的文章和动态。',
      time: '2023-08-13 11:05:36',
      icon: 'fas fa-user-plus'
    }
  ]
  
  const notification = notificationDetails.find(item => item.id === id)
  if (notification) {
    currentNotification.value = notification
    notificationDialogVisible.value = true
  }
}

// 通知操作方法
const goToSecurity = () => {
  notificationDialogVisible.value = false
  activeTab.value = 'settings'
  ElMessage.success('已跳转至安全设置')
}

const viewRelatedContent = () => {
  notificationDialogVisible.value = false
  ElMessage.info('查看相关内容')
  // 可以根据通知类型跳转到文章或评论
}

const viewUserProfile = () => {
  notificationDialogVisible.value = false
  ElMessage.info('查看用户资料')
  // 跳转到用户资料页
}

// 初始化数据
onMounted(() => {
  loadData()
})
</script>

<style lang="less" scoped>
// 变量定义
@primary-color: #1890ff;
@primary-dark: #096dd9;
@primary-light: #40a9ff;
@primary-bg: #e6f7ff;
@text-color: #333;
@text-secondary: #666;
@text-light: #999;
@border-color: #eaeaea;
@success-color: #52c41a;
@warning-color: #faad14;
@danger-color: #f5222d;
@card-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
@transition-time: 0.3s;

// 全局样式
.person-center-page {
  font-family: 'OPPO Sans',-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  color: @text-color;
 
  background-image: 
    radial-gradient(circle at 10% 10%, rgba(24, 144, 255, 0.03) 0%, transparent 30%),
    radial-gradient(circle at 90% 90%, rgba(24, 144, 255, 0.03) 0%, transparent 30%);
  animation-duration: 0.8s;
  padding-bottom: 40px;
  min-height: 100vh;
  font-size: 13px; // 全局减小字体大小
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
  color: @primary-color;
}

// 玻璃态效果
.glass-effect {
  backdrop-filter: blur(8px);
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 6px 16px rgba(0, 10, 20, 0.04);
}

// 动画过渡效果
.fade-transform-enter-active,
.fade-transform-leave-active {
  transition: all 0.3s;
}

.fade-transform-enter-from {
  opacity: 0;
  transform: translateX(10px);
}

.fade-transform-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}

// 统计信息概览 - 优化水平布局
.stats-overview {
  margin-top: -15px;
  margin-bottom: 20px;
  position: relative;
  z-index: 2;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 576px) {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }
}

// 优化卡片样式确保内容在一行
.stat-card-compact {
  border-radius: 10px;
  background: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
  overflow: hidden;
  transition: all @transition-time;
  position: relative;
  padding: 12px 14px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
  }
  
  .stat-info-compact {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 8px;
    white-space: nowrap; // 防止换行
  }
  
  .stat-icon-compact {
    min-width: 32px; // 确保最小宽度
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    background: linear-gradient(135deg, @primary-light, @primary-color);
    color: white;
    font-size: 14px;
    flex-shrink: 0; // 防止图标被压缩
  }
  
  .stat-texts {
    flex: 1;
    min-width: 0; // 允许文本区域收缩
    display: flex;
    flex-direction: row; // 改为水平布局
    align-items: center;
    justify-content: flex-start;
    gap: 4px;
  }
  
  .stat-value-compact {
    font-size: 18px;
    font-weight: 600;
    color: @text-color;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis; // 文本溢出显示省略号
    flex-shrink: 0; // 防止数字被压缩
  }
  
  .stat-label-compact {
    font-size: 12px;
    color: @text-secondary;
    overflow: hidden;
    text-overflow: ellipsis; // 文本溢出显示省略号
    white-space: nowrap;
    flex-shrink: 1; // 允许标签文字适当压缩
  }
  
  .stat-progress-compact {
    height: 3px;
    background: #f0f0f0;
    border-radius: 1.5px;
    overflow: hidden;
  }
  
  .progress-bar-compact {
    height: 100%;
    background: linear-gradient(to right, @primary-light, @primary-color);
    border-radius: 1.5px;
    transition: width 1s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
}

// 主容器
.main-container {
 padding: 10px;
}

// 仪表盘布局
.dashboard-layout {
  display: grid;
  grid-template-columns: 260px 1fr; // 减小侧边栏宽度
  gap: 16px; // 减少间距
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

// 左侧边栏
.dashboard-sidebar {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

// 卡片通用样式
.quick-links-card,
.certificates-card {
  border-radius: 10px;
  overflow: hidden;
}

.card-header {
  display: flex;
  align-items: center;
  padding: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(to right, rgba(24, 144, 255, 0.05), transparent);
  
  .fas, .fab {
    color: @primary-color;
    font-size: 14px;
    margin-right: 6px;
  }
  
  .card-title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
    color: @primary-dark;
  }
}

// 快速访问链接 - 进一步优化紧凑度
.quick-links {
  padding: 4px 0;
}

.quick-link-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: all @transition-time;
  position: relative;
  white-space: nowrap; // 防止换行
  
  &::after {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 0;
    background: linear-gradient(to right, @primary-color, transparent);
    opacity: 0;
    transition: all @transition-time;
  }
  
  &:hover {
    background: rgba(24, 144, 255, 0.05);
    
    &::after {
      width: 3px;
      opacity: 1;
    }
  }
  
  &.active {
    background: rgba(24, 144, 255, 0.08);
    
    &::after {
      width: 3px;
      opacity: 1;
    }
    
    .link-icon {
      background: @primary-color;
      color: white;
      transform: scale(1.05);
    }
    
    .link-text {
      font-weight: 500;
      color: @primary-color;
    }
  }
  
  .link-icon {
    min-width: 26px;
    height: 26px;
    border-radius: 6px;
    background: @primary-bg;
    color: @primary-color;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
    font-size: 12px;
    transition: all @transition-time;
  }
  
  .link-text {
    flex: 1;
    font-size: 13px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all @transition-time;
  }
  
  .link-badge {
    background: @primary-color;
    color: white;
    border-radius: 8px;
    padding: 0 5px;
    height: 16px;
    line-height: 16px;
    font-size: 11px;
    min-width: 16px;
    text-align: center;
    margin-left: 6px;
  }
  
  .link-arrow {
    color: @text-light;
    font-size: 10px;
    margin-left: 6px;
    transition: all @transition-time;
  }
  
  &:hover .link-arrow {
    color: @primary-color;
    transform: translateX(2px);
  }
}

// 证书和成就卡片
.certificates-content {
  padding: 10px;
}

.certificate-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.certificate-icon {
  margin-right: 10px;
}

.certificate-info {
  flex: 1;
}

.certificate-name {
  font-weight: 500;
  font-size: 13px;
  color: @primary-color;
}

.certificate-org {
  font-size: 11px;
  color: @text-secondary;
}

// 右侧内容区域
.dashboard-content {
  border-radius: 10px;
  overflow: hidden;
}

// 内容标题栏 - 解决图标和文字换行问题
.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 14px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  background: linear-gradient(to right, rgba(24, 144, 255, 0.03), transparent);
  height: 42px; // 固定高度
}

.tabs-nav {
  display: flex;
  height: 100%;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

.tab-item {
  padding: 0 14px;
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: @text-secondary;
  cursor: pointer;
  position: relative;
  transition: all @transition-time;
  white-space: nowrap; // 防止换行
  
  i {
    margin-right: 5px;
    font-size: 12px;
  }
}

.tab-label {
  position: relative;
}

.tab-line {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: transparent;
  transition: all @transition-time;
}

.tab-item:hover {
  color: @primary-color;
  
  .tab-line {
    background-color: fade(@primary-color, 30%);
  }
}

.tab-item.active {
  color: @primary-color;
  font-weight: 500;
  
  .tab-line {
    background-color: @primary-color;
  }
}

// 内容操作按钮
.content-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0; // 防止被压缩
}

.action-button {
  display: flex;
  align-items: center;
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  cursor: pointer;
  transition: all @transition-time;
  border: none;
  white-space: nowrap; // 防止换行
  
  i {
    margin-right: 4px;
  }
}

.refresh-btn {
  background-color: #f0f0f0;
  color: @text-secondary;
  border: 1px solid rgba(0, 0, 0, 0.05);
  
  &:hover {
    background-color: #e0e0e0;
    transform: translateY(-1px);
  }
}

.create-btn {
  background: linear-gradient(135deg, @primary-color, @primary-dark);
  color: white;
  box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(24, 144, 255, 0.25);
  }
}

// 内容主体
.content-body {
  padding: 16px 14px;
}

.tab-pane {
  min-height: 400px;
}

// 数字动画
.odometer {
  transition: all 0.5s;
}

// 响应式优化
@media (max-width: 992px) {
  .stats-cards {
    gap: 10px;
  }
  
  .dashboard-sidebar {
    gap: 14px;
  }
  
  .content-header {
    padding: 10px 14px;
    height: auto;
    flex-direction: column;
    align-items: flex-start;
    
    .tabs-nav {
      margin-bottom: 8px;
      width: 100%;
      height: 34px;
    }
    
    .content-actions {
      width: 100%;
      justify-content: flex-end;
    }
  }
}

@media (max-width: 768px) {
  .dashboard-content {
    margin-top: 12px;
  }
  
  .content-body {
    padding: 12px 10px;
  }
}

// 增强手机端体验
@media (max-width: 576px) {
  .stats-overview {
    margin-top: -10px;
  }
  
  .stat-card-compact {
    padding: 10px;
    
    .stat-icon-compact {
      width: 28px;
      height: 28px;
    }
    
    .stat-value-compact {
      font-size: 16px;
    }
    
    .stat-label-compact {
      font-size: 10px;
    }
  }
  
  .tab-item {
    padding: 0 10px;
  }
  
  .action-button {
    padding: 5px 8px;
  }
  
  .stat-card-compact {
    .stat-texts {
      flex-direction: column;
      align-items: flex-start;
      gap: 2px;
    }
  }
}

// 添加分页容器样式
.pagination-container {
  display: flex;
  justify-content: center;
  margin-top: 20px;
}

// 通知消息列表样式
.notifications-card {
  border-radius: 10px;
  overflow: hidden;
  margin-bottom: 16px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  }
  
  .card-header {
    background: linear-gradient(to right, rgba(0, 0, 0, 0.02), rgba(255, 255, 255, 0.8));
    border-bottom: 1px solid rgba(0, 0, 0, 0.03);
    display: flex;
    align-items: center;
    padding: 12px 16px;
    
    i {
      font-size: 15px;
      color: #fa541c;
      margin-right: 8px;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
    }
    
    .card-title {
      font-size: 15px;
      font-weight: 600;
      margin: 0;
      color: #333;
      letter-spacing: 0.3px;
    }
    
    .card-action {
      margin-left: auto;
      
      .view-all {
        font-size: 13px;
        color: @primary-color;
        cursor: pointer;
        display: flex;
        align-items: center;
        transition: all 0.3s;
        
        &:hover {
          color: @primary-dark;
          transform: translateX(2px);
        }
        
        &::after {
          content: '\f054';
          font-family: 'Font Awesome 5 Free';
          font-weight: 900;
          font-size: 10px;
          margin-left: 4px;
        }
      }
    }
  }
}

.notifications-content {
  padding: 16px;
}

.notification-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 10px;
  margin-bottom: 12px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  transition: all 0.3s;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  position: relative;
  overflow: hidden;
  cursor: pointer;
  
  &:last-child {
    margin-bottom: 0;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(0, 0, 0, 0.06);
    background-color: white;
    
    .notification-icon {
      transform: scale(1.1);
    }
    
    .notification-title {
      color: @primary-dark;
    }
  }
  
  &.unread {
    background-color: rgba(239, 246, 255, 0.8);
    border-left: 3px solid @primary-color;
    
    &:hover {
      background-color: rgba(235, 244, 255, 0.9);
    }
  }
  
  .notification-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: @primary-color;
    margin-right: 8px;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      border: 1px solid @primary-color;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.5;
      animation: pulse-dot 1.5s ease infinite;
    }
  }
  
  .notification-icon {
    width: 34px;
    height: 34px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    flex-shrink: 0;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    position: relative;
    transition: all 0.3s;
    color: white;
    font-size: 14px;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
      border-radius: 12px 12px 0 0;
    }
    
    &.system {
      background: linear-gradient(135deg, #1677ff, #0958d9);
    }
    
    &.comment {
      background: linear-gradient(135deg, #36cfc9, #08979c);
    }
    
    &.like {
      background: linear-gradient(135deg, #f759ab, #eb2f96);
    }
    
    &.follow {
      background: linear-gradient(135deg, #9254de, #722ed1);
    }
  }
  
  .notification-info {
    flex: 1;
    min-width: 0;
    
    .notification-title {
      font-weight: 600;
      font-size: 13px;
      color: #333;
      margin-bottom: 3px;
      transition: all 0.3s;
    }
    
    .notification-text {
      font-size: 12px;
      color: @text-secondary;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    
    .notification-time {
      font-size: 11px;
      color: @text-light;
      margin-top: 4px;
    }
  }
}

@keyframes pulse-dot {
  0% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
  50% {
    transform: translate(-50%, -50%) scale(1.2);
    opacity: 0.3;
  }
  100% {
    transform: translate(-50%, -50%) scale(0.8);
    opacity: 0.5;
  }
}

// 通知详情弹窗样式
:deep(.notification-dialog) {
  .el-dialog__header {
    background: linear-gradient(to right, rgba(24, 144, 255, 0.05), rgba(255, 255, 255, 0.01));
    border-bottom: 1px solid #f0f0f0;
    padding: 16px 20px;
    
    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
      background: linear-gradient(to right, #1890ff, #096dd9);
      -webkit-background-clip: text;
      background-clip: text;
      color: transparent;
      letter-spacing: 0.5px;
    }
    
    .el-dialog__close {
      color: #999;
      font-size: 18px;
      
      &:hover {
        color: @primary-color;
        transform: rotate(90deg);
        transition: all 0.3s;
      }
    }
  }
  
  .el-dialog__body {
    padding: 0;
  }
  
  @media (max-width: 576px) {
    width: 92% !important;
    
    .el-dialog__title {
      font-size: 15px;
    }
  }
}

.notification-detail {
  &-header {
    padding: 30px 0;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      width: 120%;
      height: 100%;
      top: 0;
      left: -10%;
      background-size: 20px 20px;
      background-image: radial-gradient(circle, rgba(255, 255, 255, 0.2) 1px, transparent 1px);
      opacity: 0.3;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 20px;
      background: linear-gradient(to top, rgba(255, 255, 255, 1), transparent);
    }
    
    &.system {
      background: linear-gradient(135deg, rgba(22, 119, 255, 0.1), rgba(9, 88, 217, 0.02));
    }
    
    &.comment {
      background: linear-gradient(135deg, rgba(54, 207, 201, 0.1), rgba(8, 151, 156, 0.02));
    }
    
    &.like {
      background: linear-gradient(135deg, rgba(247, 89, 171, 0.1), rgba(235, 47, 150, 0.02));
    }
    
    &.follow {
      background: linear-gradient(135deg, rgba(146, 84, 222, 0.1), rgba(114, 46, 209, 0.02));
    }
  }
  
  &-icon {
    width: 60px;
    height: 60px;
    border-radius: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    color: white;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
    position: relative;
    z-index: 1;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: -10px;
      right: -10px;
      width: 40px;
      height: 40px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.3), transparent 70%);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.3), rgba(255, 255, 255, 0));
      border-radius: 18px 18px 0 0;
    }
    
    .system & {
      background: linear-gradient(135deg, #1677ff, #0958d9);
    }
    
    .comment & {
      background: linear-gradient(135deg, #36cfc9, #08979c);
    }
    
    .like & {
      background: linear-gradient(135deg, #f759ab, #eb2f96);
    }
    
    .follow & {
      background: linear-gradient(135deg, #9254de, #722ed1);
    }
  }
  
  &-content {
    padding: 24px;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 40px;
      height: 3px;
      background: #f5f5f5;
      border-radius: 3px;
    }
  }
  
  &-time {
    text-align: center;
    font-size: 12px;
    color: @text-light;
    margin-bottom: 16px;
    position: relative;
    display: inline-block;
    padding: 3px 12px;
    border-radius: 15px;
    background-color: #f5f5f5;
    left: 50%;
    transform: translateX(-50%);
  }
  
  &-text {
    font-size: 14px;
    line-height: 1.8;
    color: @text-secondary;
    text-align: justify;
    padding: 15px;
    background-color: #f9f9f9;
    border-radius: 10px;
    border-left: 3px solid rgba(24, 144, 255, 0.3);
  }
  
  &-actions {
    display: flex;
    justify-content: center;
    gap: 12px;
    padding: 24px 20px;
    
    .action-btn {
      min-width: 90px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 16px;
      border-radius: 8px;
      border: none;
      background-color: #f5f5f5;
      color: @text-secondary;
      font-size: 14px;
      cursor: pointer;
      transition: all 0.3s;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
        transition: left 0.7s;
      }
      
      &:hover {
        background-color: #e6f7ff;
        color: @primary-color;
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(24, 144, 255, 0.15);
        
        &::before {
          left: 100%;
        }
      }
      
      i {
        margin-right: 6px;
        font-size: 12px;
      }
    }
  }
}

// 适配移动端的删除确认弹窗
:deep(.el-dialog) {
  @media (max-width: 576px) {
    width: 92% !important;
    margin-top: 15vh !important;
    
    .el-dialog__title {
      font-size: 15px;
    }
    
    .el-dialog__body {
      padding: 15px 20px;
    }
    
    .dialog-message h4 {
      font-size: 16px;
    }
  }
}
</style>
