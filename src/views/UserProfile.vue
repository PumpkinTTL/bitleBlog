<template>
  <div class="user-profile-container">
    <div class="profile-wrapper animate__animated animate__fadeIn">
      <!-- 用户信息卡片 -->
      <person-info-card 
        :userInfo="userInfo" 
        :userStats="userStats"
        :isViewMode="true"
      />
      
      <!-- 用户内容区域 -->
      <div class="user-content">
        <div class="content-header">
          <div class="header-tabs">
            <div 
              v-for="tab in tabs" 
              :key="tab.key" 
              class="tab-item" 
              :class="{ active: activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              <i :class="tab.icon"></i>
              <span>{{ tab.label }}</span>
              <span class="count" v-if="tab.count !== undefined">({{ tab.count }})</span>
            </div>
          </div>
          
          <div class="header-actions">
            <a-button type="primary" class="follow-btn" @click="handleFollow">
              <i :class="isFollowing ? 'fas fa-user-check' : 'fas fa-user-plus'"></i>
              {{ isFollowing ? '已关注' : '关注' }}
            </a-button>
            <a-button class="message-btn" @click="handleMessage">
              <i class="fas fa-envelope"></i>
              发消息
            </a-button>
          </div>
        </div>
        
        <!-- 文章列表 -->
        <div v-if="activeTab === 'articles'" class="articles-section">
          <div v-if="userArticles.length > 0" class="articles-list">
            <div v-for="article in userArticles" :key="article.id" class="article-item">
              <div class="article-info">
                <h3 class="article-title" @click="navigateToArticle(article.id)">{{ article.title }}</h3>
                <p class="article-summary">{{ article.summary }}</p>
                <div class="article-meta">
                  <span class="meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    {{ formatDate(article.publishTime) }}
                  </span>
                  <span class="meta-item">
                    <i class="fas fa-eye"></i>
                    {{ article.viewCount }} 阅读
                  </span>
                  <span class="meta-item">
                    <i class="fas fa-thumbs-up"></i>
                    {{ article.likeCount }} 点赞
                  </span>
                  <span class="meta-item">
                    <i class="fas fa-comment"></i>
                    {{ article.commentCount }} 评论
                  </span>
                </div>
              </div>
              <div class="article-cover" v-if="article.coverImage">
                <img :src="article.coverImage" :alt="article.title">
              </div>
            </div>
          </div>
          <div v-else class="empty-content">
            <i class="fas fa-file-alt"></i>
            <p>该用户暂未发布文章</p>
          </div>
        </div>
        
        <!-- 收藏列表 -->
        <div v-if="activeTab === 'favorites'" class="favorites-section">
          <div v-if="userFavorites.length > 0" class="favorites-list">
            <div v-for="favorite in userFavorites" :key="favorite.id" class="favorite-item">
              <div class="favorite-info">
                <h3 class="favorite-title" @click="navigateToArticle(favorite.articleId)">{{ favorite.title }}</h3>
                <p class="favorite-summary">{{ favorite.summary }}</p>
                <div class="favorite-meta">
                  <span class="meta-item">
                    <i class="fas fa-user"></i>
                    {{ favorite.author }}
                  </span>
                  <span class="meta-item">
                    <i class="fas fa-calendar-alt"></i>
                    {{ formatDate(favorite.collectTime) }}
                  </span>
                </div>
              </div>
              <div class="favorite-cover" v-if="favorite.coverImage">
                <img :src="favorite.coverImage" :alt="favorite.title">
              </div>
            </div>
          </div>
          <div v-else class="empty-content">
            <i class="fas fa-bookmark"></i>
            <p>该用户暂未收藏内容</p>
          </div>
        </div>
        
        <!-- 关注列表 -->
        <div v-if="activeTab === 'following'" class="following-section">
          <div v-if="userFollowing.length > 0" class="users-grid">
            <div v-for="user in userFollowing" :key="user.id" class="user-card" @click="viewUserProfile(user.id)">
              <div class="user-avatar">
                <el-avatar :size="50" :src="user.avatar">{{ user.username ? user.username.charAt(0).toUpperCase() : 'U' }}</el-avatar>
                <div class="user-badge" v-if="user.isPremium">
                  <i class="fas fa-crown"></i>
                </div>
              </div>
              <div class="user-info">
                <h3 class="user-name">{{ user.username }}</h3>
                <p class="user-bio">{{ user.bio || '这个人很懒，还没有填写个人介绍~' }}</p>
                <div class="user-stats">
                  <span class="stat-item">{{ user.articleCount }} 文章</span>
                  <span class="stat-item">{{ user.followerCount }} 粉丝</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-content">
            <i class="fas fa-user-friends"></i>
            <p>该用户暂未关注其他用户</p>
          </div>
        </div>
        
        <!-- 粉丝列表 -->
        <div v-if="activeTab === 'followers'" class="followers-section">
          <div v-if="userFollowers.length > 0" class="users-grid">
            <div v-for="user in userFollowers" :key="user.id" class="user-card" @click="viewUserProfile(user.id)">
              <div class="user-avatar">
                <el-avatar :size="50" :src="user.avatar">{{ user.username ? user.username.charAt(0).toUpperCase() : 'U' }}</el-avatar>
                <div class="user-badge" v-if="user.isPremium">
                  <i class="fas fa-crown"></i>
                </div>
              </div>
              <div class="user-info">
                <h3 class="user-name">{{ user.username }}</h3>
                <p class="user-bio">{{ user.bio || '这个人很懒，还没有填写个人介绍~' }}</p>
                <div class="user-stats">
                  <span class="stat-item">{{ user.articleCount }} 文章</span>
                  <span class="stat-item">{{ user.followerCount }} 粉丝</span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="empty-content">
            <i class="fas fa-users"></i>
            <p>该用户暂无粉丝</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import PersonInfoCard from '@/components/person/PersonInfoCard.vue';

const route = useRoute();
const router = useRouter();

// 获取路由参数中的用户ID
const userId = computed(() => route.params.id as string);

// 定义类型接口
interface UserInfo {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  createTime: string;
  roles: Array<{ name: string }>;
  [key: string]: any;
}

interface UserStats {
  articles: number;
  followers: number;
  following: number;
  likes: number;
}

interface Article {
  id: string;
  title: string;
  summary: string;
  publishTime: string;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  coverImage: string;
}

interface Favorite {
  id: string;
  articleId: string;
  title: string;
  summary: string;
  author: string;
  collectTime: string;
  coverImage: string;
}

interface UserProfile {
  id: string;
  username: string;
  avatar: string;
  bio: string;
  articleCount: number;
  followerCount: number;
  isPremium: boolean;
}

// 用户数据
const userInfo = ref<UserInfo>({} as UserInfo);
const userStats = ref<UserStats>({
  articles: 0,
  followers: 0,
  following: 0,
  likes: 0
});

// 标签页数据
const activeTab = ref('articles');
const tabs = computed(() => [
  {
    key: 'articles',
    label: '文章',
    icon: 'fas fa-file-alt',
    count: userStats.value.articles
  },
  {
    key: 'favorites',
    label: '收藏',
    icon: 'fas fa-bookmark',
    count: userFavorites.value.length
  },
  {
    key: 'following',
    label: '关注',
    icon: 'fas fa-user-friends',
    count: userStats.value.following
  },
  {
    key: 'followers',
    label: '粉丝',
    icon: 'fas fa-users',
    count: userStats.value.followers
  }
]);

// 用户内容数据
const userArticles = ref<Article[]>([]);
const userFavorites = ref<Favorite[]>([]);
const userFollowing = ref<UserProfile[]>([]);
const userFollowers = ref<UserProfile[]>([]);
const isFollowing = ref(false);

// 监听用户ID变化，重新获取数据
watch(() => userId.value, () => {
  fetchUserData();
});

// 页面加载时获取数据
onMounted(() => {
  fetchUserData();
});

// 获取用户数据
const fetchUserData = async () => {
  try {
    // 在实际应用中，这里应该是从API获取数据
    // 为了演示，使用模拟数据
    
    // 模拟API请求延迟
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 假设从API获取的用户数据
    userInfo.value = getMockUserInfo();
    userStats.value = getMockUserStats();
    userArticles.value = getMockArticles();
    userFavorites.value = getMockFavorites();
    userFollowing.value = getMockFollowing();
    userFollowers.value = getMockFollowers();
    
    // 检查当前用户是否已关注此用户
    checkFollowStatus();
    
  } catch (error) {
    console.error('获取用户数据失败:', error);
    ElMessage.error('获取用户信息失败，请稍后重试');
  }
};

// 检查关注状态
const checkFollowStatus = () => {
  // 模拟检查当前用户是否已关注该用户
  // 实际应用中应该从API获取此信息
  isFollowing.value = Math.random() > 0.5;
};

// 关注用户
const handleFollow = () => {
  if (isFollowing.value) {
    // 取消关注
    ElMessage.success('已取消关注');
  } else {
    // 添加关注
    ElMessage.success('关注成功');
  }
  
  isFollowing.value = !isFollowing.value;
  
  // 更新粉丝数
  if (isFollowing.value) {
    userStats.value.followers++;
  } else {
    userStats.value.followers = Math.max(0, userStats.value.followers - 1);
  }
};

// 发送私信
const handleMessage = () => {
  ElMessage.info('私信功能开发中...');
};

// 查看文章详情
const navigateToArticle = (articleId: string | number) => {
  router.push(`/article/${articleId}`);
};

// 查看用户资料
const viewUserProfile = (profileUserId: string | number) => {
  if (profileUserId === userId.value) return;
  router.push(`/user/${profileUserId}`);
};

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  } catch (e) {
    return dateStr;
  }
};

// ======= 模拟数据 =======
// 实际项目中应该从API获取数据

// 模拟用户信息
const getMockUserInfo = (): UserInfo => {
  return {
    id: userId.value,
    username: '技术探索者',
    avatar: 'https://via.placeholder.com/200',
    bio: '前端开发工程师，Vue.js和React爱好者，致力于分享前端技术经验和学习心得',
    createTime: '2022-03-15T10:20:30',
    roles: [
      { name: '皇冠会员' }
    ]
  };
};

// 模拟用户统计数据
const getMockUserStats = (): UserStats => {
  return {
    articles: 24,
    followers: 158,
    following: 45,
    likes: 376
  };
};

// 模拟文章列表
const getMockArticles = (): Article[] => {
  return Array(5).fill(null).map((_, index) => ({
    id: `article-${index + 1}`,
    title: ['Vue3核心特性详解', 'TypeScript入门指南', 'CSS Grid布局实战', '前端性能优化技巧', 'WebAssembly初探'][index],
    summary: [
      'Vue3带来了Composition API、响应式系统升级等多项重要更新，本文详细介绍这些特性的使用方法与实践技巧...',
      'TypeScript作为JavaScript的超集，为开发者提供了类型安全和更好的开发体验，本文将带你入门TS开发...',
      'CSS Grid是一种强大的二维布局系统，本文通过实例讲解Grid布局的核心概念和常用技巧...',
      '前端性能优化是提升用户体验的关键，本文分享10个实用的前端性能优化技巧和最佳实践...',
      'WebAssembly为Web应用带来接近原生的性能，本文介绍WebAssembly的基础知识和前端应用场景...'
    ][index],
    publishTime: new Date(Date.now() - index * 86400000 * 5).toISOString(),
    viewCount: Math.floor(Math.random() * 2000) + 500,
    likeCount: Math.floor(Math.random() * 100) + 20,
    commentCount: Math.floor(Math.random() * 50) + 5,
    coverImage: index % 2 === 0 ? `https://via.placeholder.com/300x200?text=Article+${index+1}` : ''
  }));
};

// 模拟收藏列表
const getMockFavorites = (): Favorite[] => {
  return Array(3).fill(null).map((_, index) => ({
    id: `favorite-${index + 1}`,
    articleId: `article-${100 + index}`,
    title: ['React Hooks完全指南', 'Node.js微服务架构', 'JavaScript设计模式详解'][index],
    summary: [
      'React Hooks彻底改变了React组件的编写方式，本文详细介绍所有内置Hooks的使用方法和注意事项...',
      'Node.js微服务架构已成为后端开发的主流方案之一，本文分享微服务设计和实现的经验...',
      '设计模式是解决软件设计中常见问题的可复用方案，本文介绍JavaScript中常用的设计模式实现...'
    ][index],
    author: ['React专家', 'Node社区', 'JS老手'][index],
    collectTime: new Date(Date.now() - index * 86400000 * 3).toISOString(),
    coverImage: index % 2 === 0 ? `https://via.placeholder.com/300x200?text=Favorite+${index+1}` : ''
  }));
};

// 模拟关注列表
const getMockFollowing = (): UserProfile[] => {
  return Array(6).fill(null).map((_, index) => ({
    id: `user-${200 + index}`,
    username: ['前端达人', '设计师小王', 'JavaScript专家', 'UI设计达人', '全栈工程师', '算法爱好者'][index],
    avatar: `https://via.placeholder.com/100?text=User+${index + 1}`,
    bio: [
      '专注于前端技术分享，擅长Vue和React',
      '5年UI/UX设计经验，热爱分享设计理念',
      'JS高级工程师，Node.js贡献者',
      'UI/UX设计师，擅长移动端和Web界面设计',
      '全栈开发者，同时热爱前后端技术',
      '算法爱好者，LeetCode超过500题'
    ][index],
    articleCount: Math.floor(Math.random() * 30) + 5,
    followerCount: Math.floor(Math.random() * 200) + 50,
    isPremium: index % 3 === 0
  }));
};

// 模拟粉丝列表
const getMockFollowers = (): UserProfile[] => {
  return Array(8).fill(null).map((_, index) => ({
    id: `user-${300 + index}`,
    username: ['技术小白', '前端学习者', '设计爱好者', 'Vue初学者', 'Web开发者', '编程爱好者', '网页设计师', '代码新手'][index],
    avatar: `https://via.placeholder.com/100?text=Fan+${index + 1}`,
    bio: [
      '正在学习前端开发，热爱技术',
      '前端初学者，Vue爱好者',
      '自学设计中，寻找灵感',
      'Vue.js初学者，正在构建个人项目',
      'Web开发爱好者，全栈学习中',
      '编程爱好者，喜欢学习新技术',
      '自由网页设计师，擅长创意设计',
      '代码新手，正在学习JavaScript'
    ][index],
    articleCount: Math.floor(Math.random() * 10) + 1,
    followerCount: Math.floor(Math.random() * 50) + 10,
    isPremium: index % 4 === 0
  }));
};
</script>

<style lang="less" scoped>
// 变量定义
@primary-color: #1890ff;
@primary-dark: #096dd9;
@primary-light: #40a9ff;
@bg-color: #f5f7fa;
@card-bg: #ffffff;
@text-color: #333;
@text-secondary: #666;
@text-light: #999;
@border-color: #eaeaea;
@success-color: #52c41a;
@warning-color: #faad14;
@danger-color: #f5222d;
@card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
@border-radius: 12px;
@transition-time: 0.3s;

.user-profile-container {
  padding: 20px;
  background-color: @bg-color;
  min-height: calc(100vh - 60px);
}

.profile-wrapper {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 用户内容区域
.user-content {
  background: @card-bg;
  border-radius: @border-radius;
  box-shadow: @card-shadow;
  overflow: hidden;
  
  // 内容头部
  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    border-bottom: 1px solid @border-color;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 15px;
      padding: 15px;
    }
    
    // 标签页
    .header-tabs {
      display: flex;
      overflow-x: auto;
      scrollbar-width: none; // Firefox
      -ms-overflow-style: none; // IE and Edge
      
      &::-webkit-scrollbar {
        display: none; // Chrome, Safari, Opera
      }
      
      .tab-item {
        padding: 15px 20px;
        cursor: pointer;
        position: relative;
        white-space: nowrap;
        color: @text-secondary;
        transition: color @transition-time;
        font-weight: 500;
        
        i {
          margin-right: 6px;
        }
        
        .count {
          font-size: 12px;
          opacity: 0.8;
          margin-left: 2px;
        }
        
        &::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          width: 0;
          height: 3px;
          background: @primary-color;
          transform: translateX(-50%);
          transition: width @transition-time;
        }
        
        &:hover {
          color: @primary-color;
        }
        
        &.active {
          color: @primary-color;
          
          &::after {
            width: 30px;
          }
        }
      }
    }
    
    // 操作按钮
    .header-actions {
      display: flex;
      gap: 10px;
      
      .follow-btn, .message-btn {
        i {
          margin-right: 6px;
        }
      }
      
      .follow-btn {
        background: @primary-color;
        border-color: @primary-color;
        
        &:hover {
          background: @primary-dark;
          border-color: @primary-dark;
        }
      }
    }
  }
  
  // 文章列表
  .articles-section {
    padding: 20px;
    
    .articles-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      
      .article-item {
        display: flex;
        gap: 15px;
        padding: 15px;
        border-radius: 10px;
        background-color: #fafafa;
        transition: all @transition-time;
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
          background-color: #f5f5f5;
        }
        
        .article-info {
          flex: 1;
          
          .article-title {
            margin: 0 0 8px;
            font-size: 16px;
            font-weight: 600;
            color: @text-color;
            cursor: pointer;
            
            &:hover {
              color: @primary-color;
            }
          }
          
          .article-summary {
            font-size: 14px;
            color: @text-secondary;
            margin: 0 0 10px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .article-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 12px;
            color: @text-light;
            
            .meta-item {
              display: flex;
              align-items: center;
              
              i {
                margin-right: 4px;
              }
            }
          }
        }
        
        .article-cover {
          width: 120px;
          height: 80px;
          flex-shrink: 0;
          border-radius: 6px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          @media (max-width: 576px) {
            display: none;
          }
        }
      }
    }
  }
  
  // 收藏列表
  .favorites-section {
    padding: 20px;
    
    .favorites-list {
      display: flex;
      flex-direction: column;
      gap: 15px;
      
      .favorite-item {
        display: flex;
        gap: 15px;
        padding: 15px;
        border-radius: 10px;
        background-color: #fafafa;
        transition: all @transition-time;
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
          background-color: #f5f5f5;
        }
        
        .favorite-info {
          flex: 1;
          
          .favorite-title {
            margin: 0 0 8px;
            font-size: 16px;
            font-weight: 600;
            color: @text-color;
            cursor: pointer;
            
            &:hover {
              color: @primary-color;
            }
          }
          
          .favorite-summary {
            font-size: 14px;
            color: @text-secondary;
            margin: 0 0 10px;
            line-height: 1.5;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
          }
          
          .favorite-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 12px;
            color: @text-light;
            
            .meta-item {
              display: flex;
              align-items: center;
              
              i {
                margin-right: 4px;
              }
            }
          }
        }
        
        .favorite-cover {
          width: 120px;
          height: 80px;
          flex-shrink: 0;
          border-radius: 6px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          @media (max-width: 576px) {
            display: none;
          }
        }
      }
    }
  }
  
  // 用户列表网格（用于关注和粉丝列表）
  .users-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
    padding: 20px;
    
    .user-card {
      display: flex;
      gap: 12px;
      padding: 15px;
      border-radius: 10px;
      background-color: #fafafa;
      transition: all @transition-time;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.06);
        background-color: #f5f5f5;
      }
      
      .user-avatar {
        position: relative;
        
        .user-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: linear-gradient(135deg, #f9d423, #e65c00);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 10px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
      }
      
      .user-info {
        flex: 1;
        min-width: 0;
        
        .user-name {
          margin: 0 0 5px;
          font-size: 14px;
          font-weight: 600;
          color: @text-color;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .user-bio {
          font-size: 12px;
          color: @text-secondary;
          margin: 0 0 8px;
          line-height: 1.4;
          height: 34px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .user-stats {
          display: flex;
          gap: 10px;
          font-size: 12px;
          color: @text-light;
          
          .stat-item {
            white-space: nowrap;
          }
        }
      }
    }
  }
  
  // 空内容提示
  .empty-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 40px 20px;
    color: @text-light;
    
    i {
      font-size: 32px;
      margin-bottom: 10px;
      opacity: 0.6;
    }
    
    p {
      font-size: 14px;
      margin: 0;
    }
  }
}

@media (max-width: 768px) {
  .user-profile-container {
    padding: 10px;
  }
  
  .profile-wrapper {
    gap: 15px;
  }
  
  .user-content {
    .content-header {
      .header-tabs {
        .tab-item {
          padding: 12px 15px;
        }
      }
    }
  }
}
</style> 