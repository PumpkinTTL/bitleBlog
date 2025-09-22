<template>
  <div class="featured-articles-card">
    <!-- 卡片头部 -->
    <div class="card-header">
      <i :class="headerIcon"></i>
      <span class="header-title">{{ title }}</span>
    </div>
    
    <!-- 文章列表 -->
    <div class="card-body">
      <!-- 加载状态 -->
      <div v-if="loading" class="loading-skeleton">
        <div v-for="n in 2" :key="n" class="skeleton-item">
          <div class="skeleton-content">
            <div class="skeleton-line short"></div>
            <div class="skeleton-line title"></div>
            <div class="skeleton-line text"></div>
            <div class="skeleton-line subtitle"></div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div v-else-if="!articles || articles.length === 0" class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-inbox"></i>
        </div>
        <h3 class="empty-title">暂无内容</h3>
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
            
            <div class="article-content">
              <div class="article-meta">
                <span class="article-category">{{ article.category }}</span>
                <span class="article-date">{{ formatDate(article.date) }}</span>
              </div>
              
              <h4 class="article-title">
                {{ article.title }}
              </h4>
              <p class="article-excerpt">
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
          >
            <i class="fas fa-chevron-left"></i>
          </button>
          
          <button 
            class="page-btn next-btn" 
            :disabled="!hasMore"
            @click="nextPage"
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

// 文章类型定义
interface FeaturedArticle {
  id: number
  title: string
  excerpt: string
  cover: string
  category: string
  categoryColor?: string
  date: string
  views: number
  likes: number
  comments?: number
  isHot?: boolean
  isNew?: boolean
  isTrending?: boolean
  readProgress?: number
}

// 组件Props
interface Props {
  title?: string
  headerIcon?: string
  articles?: FeaturedArticle[]
  loading?: boolean
  emptyText?: string
  pageSize?: number
  showPagination?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: '精选推荐',
  headerIcon: 'fas fa-crown',
  articles: () => [],
  loading: false,
  emptyText: '暂无精选文章',
  pageSize: 2,  // 限制每页显示2条数据
  showPagination: true
})

// 事件定义
const emit = defineEmits<{
  articleClick: [article: FeaturedArticle]
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


// 分类图标映射
const getCategoryIcon = (category: string): string => {
  const iconMap: Record<string, string> = {
    'Vue.js': 'fab fa-vuejs',
    'Vue': 'fab fa-vuejs',
    'React': 'fab fa-react',
    'TypeScript': 'fas fa-code',
    'JavaScript': 'fab fa-js-square',
    'CSS': 'fab fa-css3-alt',
    'HTML': 'fab fa-html5',
    'Node.js': 'fab fa-node-js',
    'Python': 'fab fa-python',
    '性能优化': 'fas fa-rocket',
    '前端工程化': 'fas fa-tools',
    '设计模式': 'fas fa-drafting-compass',
    '算法': 'fas fa-project-diagram',
    '数据库': 'fas fa-database',
    '并发': 'fas fa-layer-group',
    '网络': 'fas fa-network-wired',
    '安全': 'fas fa-shield-alt'
  }
  return iconMap[category] || 'fas fa-file-code'
}

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
  
  return date.toLocaleDateString('zh-CN', { 
    month: 'numeric', 
    day: 'numeric' 
  })
}

// 文章点击事件
const handleArticleClick = (article: FeaturedArticle) => {
  emit('articleClick', article)
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

const goToPage = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}
</script>

<style lang="less" scoped>
// 精选文章卡片
.featured-articles-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  animation: fadeIn 0.6s ease-out;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: all 0.3s ease;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, 
      rgba(64, 158, 255, 0.01) 0%, 
      rgba(103, 58, 183, 0.01) 100%
    );
    pointer-events: none;
    z-index: 0;
  }
  
  &:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
  }
  
  > * {
    position: relative;
    z-index: 1;
  }
}

// 卡片头部样式
.card-header {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 10px;
  padding: 16px;
  background: linear-gradient(135deg, 
    var(--el-fill-color-extra-light) 0%, 
    rgba(64, 158, 255, 0.03) 100%
  );
  border-bottom: 1px solid var(--el-border-color-extra-light);
  position: relative;
  overflow: hidden;
  
  
  i {
    color: var(--el-color-primary);
    font-size: 16px;
    padding: 8px;
    background: rgba(64, 158, 255, 0.1);
    border-radius: 8px;
    transition: all 0.3s ease;
    
    // 热门/火焰主题样式
    &.fa-fire,
    &.fa-fire-flame-curved {
      color: #ff6b35;
      background: rgba(255, 107, 53, 0.1);
      
      &:hover {
        background: linear-gradient(135deg, #ff6b35, #ff4757);
        color: white;
        transform: scale(1.1);
      }
    }
    
    &:hover {
      background: var(--el-color-primary);
      color: white;
      transform: scale(1.1);
    }
  }
  
  .header-title {
    font-size: 14px;
    font-weight: 600;
    background: linear-gradient(135deg, 
      var(--el-text-color-primary) 0%, 
      var(--el-color-primary) 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
  
  // 热门主题文字样式
  &:has(.fa-fire, .fa-fire-flame-curved) .header-title {
    background: linear-gradient(135deg, 
      #ff6b35 0%, 
      #ff4757 100%
    );
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
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

// 子元素轻微入场动画
.page-transition-enter-active .article-item {
  .article-cover,
  .article-content > * {
    opacity: 0;
    transform: translateY(5px) scale(0.98);
    animation: fadeInScale 0.3s ease-out forwards;
  }
  
  .article-cover {
    animation-delay: 0.05s;
  }
  
  .article-content > * {
    animation-delay: 0.1s;
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: translateY(5px) scale(0.98);
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
      display: block;
      padding: 14px;
      background: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color-extra-light);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
      position: relative;
      overflow: hidden;
      transform: translateZ(0); // 启用硬件加速
      backface-visibility: hidden; // 优化动画性能
      
      &:last-child {
        border-bottom: none;
      }
      
      &:hover {
        transform: translateY(-2px);
        
        .article-title {
          color: var(--el-color-primary);
        }
        
        .corner-badge {
          transform: scale(1.05);
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
          background: #ef4444;
          
          // 角标阴影效果
          &::after {
            content: '';
            position: absolute;
            bottom: -4px;
            right: 0;
            width: 0;
            height: 0;
            border-right: 4px solid #dc2626;
            border-bottom: 4px solid transparent;
          }
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: -4px;
            width: 0;
            height: 0;
            border-top: 4px solid #dc2626;
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
      }
      
      .article-content {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 8px;
      
      .article-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 4px;
        
        .article-category {
          font-size: 10px;
          font-weight: 600;
          padding: 2px 6px;
          border-radius: 4px;
          background: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
        }
        
        .article-date {
          font-size: 10px;
          color: var(--el-text-color-secondary);
          margin-left: auto;
        }
      }
      
        .article-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          line-height: 1.4;
          margin: 0 0 6px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          transition: all 0.3s ease;
          cursor: pointer;
          
          &:hover {
            color: var(--el-color-primary);
            text-shadow: 0 1px 2px rgba(64, 158, 255, 0.1);
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
        }
      .article-stats {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: auto;
        
        .stat-item {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 10px;
          color: var(--el-text-color-secondary);
          
          i {
            font-size: 9px;
            opacity: 0.8;
            
            &.fa-eye {
              color: var(--el-color-success);
            }
            
            &.fa-heart {
              color: var(--el-color-danger);
            }
            
            &.fa-comment {
              color: var(--el-color-warning);
            }
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



@keyframes subtleGlow {
  0%, 100% {
    box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
  }
  50% {
    box-shadow: 0 3px 6px rgba(255, 107, 107, 0.4);
  }
}

// 骨架屏样式
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
        width: 65%;
        animation-delay: 0.2s;
      }
      
      &.text {
        height: 10px;
        width: 90%;
        animation-delay: 0.4s;
      }
      
      &.short {
        height: 8px;
        width: 45%;
        animation-delay: 0.6s;
      }
    }
  }
}

// 分页控件样式
.pagination-wrapper {
  padding: 12px 16px;
  border-top: 1px solid var(--el-border-color-extra-light);
  background: var(--el-fill-color-extra-light);
  
  
  .pagination-nav {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
    
    .page-btn {
      width: 28px;
      height: 28px;
      border: 1px solid var(--el-border-color);
      background: var(--el-bg-color);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-text-color-regular);
      
      &:not(:disabled):hover {
        background: var(--el-color-primary);
        color: white;
        border-color: var(--el-color-primary);
      }
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        
        &:hover {
          background: var(--el-bg-color);
          color: var(--el-text-color-regular);
          border-color: var(--el-border-color);
        }
      }
      
      i {
        font-size: 10px;
      }
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
      rgba(255, 107, 107, 0.1) 0%, 
      rgba(78, 205, 196, 0.1) 100%
    );
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.6s ease-out;
    
    i {
      font-size: 32px;
      color: var(--el-text-color-secondary);
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
html.dark .featured-articles-card {
  border-color: var(--el-border-color-dark);
  
  .card-header {
    background: var(--el-fill-color-dark);
    border-bottom-color: var(--el-border-color-darker);
    
    i {
      color: var(--el-color-primary);
    }
  }
  
  .article-item {
    background: var(--el-fill-color-dark);
    
    
    // 暗色模式下的角标样式
    .corner-badge {
      &.hot {
        background: #f87171; // 暗色模式下的红色
        
        &::after {
          border-right-color: #dc2626;
        }
        
        &::before {
          border-top-color: #dc2626;
        }
      }
      
      &.new {
        background: #34d399; // 暗色模式下的绿色
        
        &::after {
          border-right-color: #059669;
        }
        
        &::before {
          border-top-color: #059669;
        }
      }
    }
  }
}
</style>
