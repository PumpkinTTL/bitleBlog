<template>
  <div class="monthly-hot-articles-card">
    <!-- 卡片头部 -->
    <div class="card-header">
      <span>{{ title }}</span>
    </div>
    
    <!-- 文章列表 -->
    <div class="card-body">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-skeleton">
        <div v-for="n in pageSize" :key="n" class="skeleton-item">
          <div class="skeleton-rank"></div>
          <div class="skeleton-content">
            <div class="skeleton-line title"></div>
            <div class="skeleton-line subtitle"></div>
            <div class="skeleton-line stats"></div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="!articles || articles.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-fire-slash"></i>
        </div>
        <h3 class="empty-title">暂无热门文章</h3>
        <p class="empty-description">{{ emptyText }}</p>
      </div>
      
      <!-- 文章列表 -->
      <Transition v-else name="page-transition" mode="out-in">
        <div class="articles-list" :key="currentPage">
          <div 
            v-for="(article, index) in displayedArticles" 
            :key="article.id"
            class="article-item"
            @click="handleArticleClick(article)"
          >
            <!-- 右上角吸附徽章 -->
            <div v-if="article.isHot" class="corner-badge hot" :class="{ 'has-new': article.isNew }">
              HOT
            </div>
            <div v-if="article.isNew" class="corner-badge new" :class="{ 'has-hot': article.isHot }">
              NEW
            </div>
            <div v-if="article.isTrending && !article.isHot && !article.isNew" class="corner-badge trending">
              <i class="fas fa-arrow-trend-up"></i>
            </div>
            
            
            <div class="article-content">
              <div class="article-meta">
                <span class="article-category">{{ article.category }}</span>
                <span class="article-date">{{ formatDate(article.date) }}</span>
              </div>
              
              <h4 class="article-title">
                {{ article.title }}
              </h4>
              <p v-if="article.excerpt" class="article-excerpt">
                {{ article.excerpt }}
              </p>
              
              <div class="article-stats">
                <span class="stat-item">
                  <i class="fas fa-eye"></i>
                  {{ formatNumber(article.views) }}
                </span>
                <span class="stat-item">
                  <i class="fas fa-heart"></i>
                  {{ formatNumber(article.likes) }}
                </span>
                <span v-if="article.comments" class="stat-item">
                  <i class="fas fa-comment"></i>
                  {{ formatNumber(article.comments) }}
                </span>
                <span v-if="article.readTime" class="stat-item read-time">
                  <i class="fas fa-clock"></i>
                  {{ article.readTime }}分钟
                </span>
              </div>
            </div>
          </div>
        </div>
      </Transition>
      
      <!-- 分页控件 -->
      <div v-if="showPagination && !loading && displayedArticles.length > 0" class="pagination-wrapper">
        <!-- 分页导航 -->
        <div v-if="totalPages > 1" class="pagination-nav">
          <button 
            class="page-btn prev-btn" 
            :disabled="currentPage === 1"
            @click="prevPage"
            title="上一页"
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <span class="page-indicator">{{ currentPage }}/{{ totalPages }}</span>
          
          <button 
            class="page-btn next-btn" 
            :disabled="!hasMore"
            @click="nextPage"
            title="下一页"
          >
            <i class="fas fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 文章类型定义
interface HotArticle {
  id: number
  title: string
  excerpt?: string
  category: string
  date: string
  views: number
  likes: number
  comments?: number
  readTime?: number
  isHot?: boolean
  isNew?: boolean
  isTrending?: boolean
}

// 组件Props
interface Props {
  title?: string
  articles?: HotArticle[]
  loading?: boolean
  emptyText?: string
  pageSize?: number
  showPagination?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '本月热门',
  articles: () => [
    { 
      id: 1, 
      title: 'Vue 3 Composition API 完全指南：从入门到精通', 
      excerpt: '深入解析 Vue 3 的 Composition API，从基础到高级的实际应用技巧。',
      category: 'Vue.js',
      date: '2024-01-15',
      views: 12580, 
      likes: 892,
      comments: 156,
      readTime: 8,
      isHot: true,
      isNew: false,
      isTrending: false
    },
    { 
      id: 2, 
      title: 'TypeScript 高级类型实战技巧大全', 
      excerpt: '探索 TypeScript 的高级特性，提升代码的类型安全和开发效率。',
      category: 'TypeScript',
      date: '2024-01-12',
      views: 9876,
      likes: 654,
      comments: 89,
      readTime: 12,
      isHot: false,
      isNew: true,
      isTrending: false
    },
    { 
      id: 3, 
      title: 'Vite 构建工具深度解析与优化', 
      excerpt: '全面介绍 Vite 的核心原理和高级用法，包括模块热更新、插件系统等。',
      category: '构建工具',
      date: '2024-01-10',
      views: 7845,
      likes: 432,
      comments: 67,
      readTime: 15,
      isHot: false,
      isNew: false,
      isTrending: true
    },
    { 
      id: 4, 
      title: 'Pinia 状态管理最佳实践指南', 
      excerpt: '从基础配置到高级模式，全面掌握 Pinia 状态管理的最佳实践。',
      category: '状态管理',
      date: '2024-01-08',
      views: 6754,
      likes: 398,
      comments: 52,
      readTime: 10,
      isHot: false,
      isNew: false,
      isTrending: false
    },
    { 
      id: 5, 
      title: 'Vue Router 4 路由完整教程', 
      excerpt: '详细介绍 Vue Router 4 的新特性和用法，包括路由守卫、动态路由等。',
      category: '路由',
      date: '2024-01-05',
      views: 5432,
      likes: 287,
      comments: 34,
      readTime: 6,
      isHot: false,
      isNew: false,
      isTrending: false
    },
    {
      id: 6,
      title: '前端性能优化实战技巧',
      excerpt: '从代码分割到懒加载，全面提升前端应用的性能表现。',
      category: '性能优化',
      date: '2024-01-03',
      views: 8976,
      likes: 567,
      comments: 89,
      readTime: 14,
      isHot: true,
      isNew: true,
      isTrending: false
    }
  ],
  loading: false,
  emptyText: '暂无热门文章，请稍后再来~',
  pageSize: 3,  // 限制每页显示3条数据
  showPagination: true
})

// 事件定义
const emit = defineEmits<{
  articleClick: [article: HotArticle]
  loadMore: []
}>()

// 响应式数据
const currentPage = ref(1)

// 计算属性
const totalPages = computed(() => {
  if (!props.articles || props.articles.length === 0) return 0
  return Math.ceil(props.articles.length / props.pageSize)
})

const displayedArticles = computed(() => {
  if (!props.articles) return []
  const startIndex = (currentPage.value - 1) * props.pageSize
  const endIndex = startIndex + props.pageSize
  return props.articles.slice(startIndex, endIndex)
})

const hasMore = computed(() => {
  return currentPage.value < totalPages.value
})

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '昨天'
  if (diffDays <= 7) return `${diffDays}天前`
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}周前`
  
  return date.toLocaleDateString('zh-CN', { 
    month: 'numeric', 
    day: 'numeric' 
  })
}

// 文章点击事件
const handleArticleClick = async (article: HotArticle) => {
  emit('articleClick', article)
  
  try {
    await router.push({
      path: `/blogDetail/${article.id}`,
      query: { transition: 'slide-fade' }
    })
  } catch (error) {
    console.error('路由跳转失败:', error)
    window.location.href = `/blogDetail/${article.id}`
  }
}

// 分页方法
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const nextPage = () => {
  if (hasMore.value) {
    currentPage.value++
  }
}
</script>

<style lang="less" scoped>
// 热门文章卡片 - 极简风格，几乎无阴影
.monthly-hot-articles-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  animation: fadeIn 0.6s ease-out;
  overflow: hidden;
  box-shadow: none; // 移除阴影
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    border-color: rgba(255, 107, 53, 0.2);
    // 移除hover阴影和位移
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
}

// 卡片头部样式 - 纯文字，极简设计
.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  background: var(--el-fill-color-extra-light);
  border-bottom: 1px solid var(--el-border-color-extra-light);
  border-radius: 8px 8px 0 0;
  
  span {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
}

.card-body {
  padding: 16px;
  overflow: hidden;
}

// Vue Transition样式 - 依次拖走效果
.page-transition-enter-active {
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  .article-item {
    opacity: 0;
    transform: translateY(60px);
    animation: slideInStagger 0.3s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
    
    &:nth-child(1) {
      animation-delay: 0.05s;
    }
    
    &:nth-child(2) {
      animation-delay: 0.1s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.15s;
    }
  }
}

.page-transition-leave-active {
  transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
  
  .article-item {
    animation: slideOutStagger 0.25s cubic-bezier(0.8, 0.2, 0.8, 1) forwards;
    
    &:nth-child(1) {
      animation-delay: 0s;
    }
    
    &:nth-child(2) {
      animation-delay: 0.05s;
    }
    
    &:nth-child(3) {
      animation-delay: 0.1s;
    }
  }
}

@keyframes slideInStagger {
  from {
    opacity: 0;
    transform: translateY(60px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

@keyframes slideOutStagger {
  from {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
  to {
    opacity: 0;
    transform: translateY(-60px) scale(0.95);
  }
}

// 文章列表样式
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 0;
  overflow: hidden;
  
  .article-item {
    display: block; // 改为块级元素，无需flex布局
    padding: 14px;
    background: var(--el-bg-color);
    border-bottom: 1px solid var(--el-border-color-extra-light);
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &:last-child {
      border-bottom: none;
    }
    
    &:hover {
      background: rgba(255, 107, 53, 0.03); // 简化背景
      
      .article-title {
        color: #ff6b35;
      }
    }
    
    > * {
      position: relative;
      z-index: 1;
    }
    
    // 右上角吸附徽章（参考NoticeCard样式）
    .corner-badge {
      position: absolute;
      top: -1px;
      right: -1px;
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      padding: 2px 6px;
      color: white;
      line-height: 1.2;
      z-index: 10;
      border-radius: 0 0 0 8px;
      transition: all 0.3s ease;
      // 确保文字清晰
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      
      &.hot {
        background: #ff4757;
        
        // 角标阴影效果
        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          right: 0;
          width: 0;
          height: 0;
          border-right: 4px solid #ff3742;
          border-bottom: 4px solid transparent;
        }
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -4px;
          width: 0;
          height: 0;
          border-top: 4px solid #ff3742;
          border-left: 4px solid transparent;
        }
      }
      
      &.new {
        background: #10b981;
        
        // 如果同时有HOT标签，则在下方
        &.has-hot {
          top: 20px;
        }
        
        // 角标阴影效果
        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          right: 0;
          width: 0;
          height: 0;
          border-right: 4px solid #059669;
          border-bottom: 4px solid transparent;
        }
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -4px;
          width: 0;
          height: 0;
          border-top: 4px solid #059669;
          border-left: 4px solid transparent;
        }
      }
      
      &.trending {
        background: #3b82f6;
        padding: 3px 6px;
        
        i {
          font-size: 6px;
        }
        
        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          right: 0;
          width: 0;
          height: 0;
          border-right: 4px solid #2563eb;
          border-bottom: 4px solid transparent;
        }
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -4px;
          width: 0;
          height: 0;
          border-top: 4px solid #2563eb;
          border-left: 4px solid transparent;
        }
      }
    }
    
    
    .article-content {
      width: 100%;
    
      .article-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 4px;
        
        .article-category {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          background: rgba(255, 107, 53, 0.1);
          color: #ff6b35;
          flex-shrink: 0;
        }
        
        .article-date {
          font-size: 10px;
          color: var(--el-text-color-secondary);
          opacity: 0.8;
        }
      }
      
      .article-title {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        line-height: 1.4;
        margin: 0 0 6px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        transition: all 0.3s ease;
        cursor: pointer;
        
        &:hover {
          color: #ff6b35;
          text-shadow: 0 1px 2px rgba(255, 107, 53, 0.1);
        }
      }
    
      .article-excerpt {
        font-size: 11px;
        color: var(--el-text-color-regular);
        line-height: 1.4;
        margin: 0 0 10px 0;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        opacity: 0.9;
      }

      .article-stats {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: auto;
        flex-wrap: wrap;
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          color: var(--el-text-color-secondary);
          transition: all 0.2s ease;
          
          &:hover {
            color: #ff6b35;
          }
          
          i {
            font-size: 9px;
            opacity: 0.8;
            transition: all 0.2s ease;
            
            &.fa-eye {
              color: var(--el-color-success);
            }
            
            &.fa-heart {
              color: var(--el-color-danger);
            }
            
            &.fa-comment {
              color: var(--el-color-warning);
            }
            
            &.fa-clock {
              color: var(--el-color-info);
            }
          }
          
          &:hover i {
            transform: scale(1.1);
          }
          
          &.read-time {
            color: var(--el-color-info);
            font-weight: 500;
          }
        }
      }
    }
  }
}

// 动画定义
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes shimmer {
  0% {
    background-position: -200px 0;
  }
  100% {
    background-position: calc(200px + 100%) 0;
  }
}

// 骨架屏样式
.loading-skeleton {
  display: flex;
  flex-direction: column;
  gap: 0;
  
  .skeleton-item {
    display: block;
    padding: 14px;
    border-bottom: 1px solid var(--el-border-color-extra-light);
    animation: fadeIn 0.3s ease;
    
    &:last-child {
      border-bottom: none;
    }
    
    .skeleton-content {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .skeleton-line {
        background: linear-gradient(
          90deg,
          var(--el-fill-color-light) 0%,
          var(--el-fill-color) 50%,
          var(--el-fill-color-light) 100%
        );
        background-size: 200px 100%;
        border-radius: 6px;
        animation: shimmer 1.5s ease-in-out infinite;
        
        &.title {
          height: 16px;
          width: 85%;
        }
        
        &.subtitle {
          height: 12px;
          width: 95%;
          animation-delay: 0.2s;
        }
        
        &.stats {
          height: 10px;
          width: 60%;
          animation-delay: 0.4s;
        }
      }
    }
  }
}

// 分页控件样式
.pagination-wrapper {
  padding: 12px 16px;
  border-top: 1px solid var(--el-border-color-extra-light);
  background: linear-gradient(135deg, 
    var(--el-fill-color-extra-light) 0%, 
    rgba(255, 107, 53, 0.02) 100%
  );
  
  .pagination-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    
    .page-btn {
      width: 32px;
      height: 32px;
      border: 1px solid rgba(255, 107, 53, 0.2);
      background: var(--el-bg-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #ff6b35;
      
      &:not(:disabled):hover {
        background: #ff6b35; // 纯色背景
        color: white;
        border-color: #ff6b35;
      }
      
      &:disabled {
        opacity: 0.3;
        cursor: not-allowed;
        
        &:hover {
          background: var(--el-bg-color);
          color: #ff6b35;
          border-color: rgba(255, 107, 53, 0.2);
          transform: none;
          box-shadow: none;
        }
      }
      
      i {
        font-size: 12px;
      }
    }
    
    .page-indicator {
      font-size: 12px;
      color: #ff6b35;
      font-weight: 600;
      min-width: 40px;
      text-align: center;
    }
  }
}

// 空状态样式
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px 24px;
  text-align: center;
  
  .empty-icon {
    width: 80px;
    height: 80px;
    margin-bottom: 16px;
    border-radius: 50%;
    background: linear-gradient(135deg, 
      rgba(255, 107, 53, 0.1) 0%, 
      rgba(255, 71, 87, 0.1) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.6s ease-out;
    
    i {
      font-size: 32px;
      color: #ff6b35;
      opacity: 0.6;
    }
  }
  
  .empty-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
    font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  .empty-description {
    font-size: 13px;
    color: var(--el-text-color-regular);
    line-height: 1.5;
    opacity: 0.8;
  }
}

// 暗色模式适配
html.dark .monthly-hot-articles-card {
  border-color: var(--el-border-color-dark);
  
  &::before {
    background: linear-gradient(135deg, 
      rgba(255, 107, 53, 0.02) 0%, 
      rgba(255, 71, 87, 0.02) 100%
    );
  }
  
  &:hover {
    border-color: rgba(255, 107, 53, 0.3);
  }
  
  .card-header {
    background: linear-gradient(135deg, 
      var(--el-fill-color-dark) 0%, 
      rgba(255, 107, 53, 0.05) 100%
    );
    border-bottom-color: var(--el-border-color-darker);
    
    i {
      background: rgba(255, 107, 53, 0.15);
    }
  }
  
  .article-item {
    &:hover {
      background: linear-gradient(135deg, 
        rgba(255, 107, 53, 0.05) 0%, 
        rgba(255, 71, 87, 0.03) 100%
      );
      box-shadow: 0 4px 12px rgba(255, 107, 53, 0.15);
    }
    
    // 暗色模式下的角标样式
    .corner-badge {
      &.hot {
        background: #ff6b6b;
        
        &::after {
          border-right-color: #ff5252;
        }
        
        &::before {
          border-top-color: #ff5252;
        }
      }
      
      &.new {
        background: #4ecdc4;
        
        &::after {
          border-right-color: #26a69a;
        }
        
        &::before {
          border-top-color: #26a69a;
        }
      }
    }
  }
  
  .pagination-wrapper {
    background: linear-gradient(135deg, 
      var(--el-fill-color-dark) 0%, 
      rgba(255, 107, 53, 0.03) 100%
    );
  }
}
</style>
