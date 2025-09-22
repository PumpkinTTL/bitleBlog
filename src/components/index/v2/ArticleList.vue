<template>
  <div class="articles-section">
    
    <!-- 卡片视图 -->
    <Transition v-if="viewMode === 'card'" name="articles-transition" mode="out-in">
      <div class="articles-grid" :class="`grid-columns-${gridColumns}`" :key="currentPage">
        <ArticleCard
          v-for="(article, index) in displayArticles"
          :key="article.id"
          :article="article"
          :view-mode="viewMode"
          class="article-animation-item"
        />
      </div>
    </Transition>
    
    <!-- 列表视图 -->
    <Transition v-else name="articles-transition" mode="out-in">
      <div class="articles-list" :key="currentPage">
        <ArticleCard
          v-for="(article, index) in displayArticles"
          :key="article.id"
          :article="article"
          :view-mode="viewMode"
          class="article-animation-item"
        />
      </div>
    </Transition>
    
    <!-- 分页 -->
    <div v-if="totalArticles > currentPageSize" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="currentPageSize"
        :page-sizes="pageSizeOptions"
        :total="totalArticles"
        :layout="paginationLayout"
        :pager-count="isMobile ? 5 : 7"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        background
        small
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import { Grid, Menu } from '@element-plus/icons-vue'
import ArticleCard from './ArticleCard.vue'

// 文章数据类型
interface Article {
  id: number
  title: string
  excerpt: string
  cover: string
  author: {
    id: number
    name: string
    avatar: string
    isVip: boolean
  }
  publishTime: string
  views: number
  likes: number
  comments: number
  tags: string[]
  category: number
  isTop: boolean
  isRecommended: boolean
  isOriginal: boolean
  isHot: boolean
}

// Props
interface Props {
  articles: Article[]
  searchKeyword?: string
  activeFilter?: string
  activeCategory?: number
  viewMode?: 'card' | 'list'
  gridColumns?: number
}

const props = withDefaults(defineProps<Props>(), {
  searchKeyword: '',
  activeFilter: 'all',
  activeCategory: 0,
  viewMode: 'card',
  gridColumns: 2
})

// 响应式数据 - 使用外部传入的状态
const viewMode = computed(() => props.viewMode)
const gridColumns = computed(() => props.gridColumns)
const currentPage = ref(1)
const totalArticles = ref(0)
const listPageSize = ref(5) // 列表模式页面大小

// 动态页面大小：根据布局模式调整
const currentPageSize = computed(() => {
  if (viewMode.value === 'card') {
    // 卡片模式：2列=6个，3列=9个（每页3行）
    return gridColumns.value === 2 ? 6 : 9
  } else {
    // 列表模式：可选择5/10/20，默认5
    return listPageSize.value
  }
})

// 分页选项
const pageSizeOptions = computed(() => {
  return viewMode.value === 'list' ? [5, 10, 20] : []
})

// 移动端检测
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value <= 768)

// 分页布局 - 响应式设计
const paginationLayout = computed(() => {
  if (isMobile.value) {
    // 移动端精简布局
    return 'prev, pager, next'
  }
  
  return viewMode.value === 'list' 
    ? 'total, sizes, prev, pager, next, jumper'
    : 'total, prev, pager, next, jumper'
})

// 计算属性 - 筛选和分页后的文章
const displayArticles = computed(() => {
  let filtered = props.articles
  
  // 分类筛选
  if (props.activeCategory > 0) {
    filtered = filtered.filter(article => article.category === props.activeCategory)
  }
  
  // 类型筛选
  switch (props.activeFilter) {
    case 'recommended':
      filtered = filtered.filter(article => article.isRecommended)
      break
    case 'latest':
      filtered = filtered.sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime())
      break
    case 'popular':
      filtered = filtered.filter(article => article.isHot || article.views > 2000)
      break
  }
  
  // 搜索筛选
  if (props.searchKeyword) {
    const keyword = props.searchKeyword.toLowerCase()
    filtered = filtered.filter(article => 
      article.title.toLowerCase().includes(keyword) ||
      article.excerpt.toLowerCase().includes(keyword) ||
      article.tags.some(tag => tag.toLowerCase().includes(keyword))
    )
  }
  
  // 分页
  const startIndex = (currentPage.value - 1) * currentPageSize.value
  const endIndex = startIndex + currentPageSize.value
  
  // 更新总数
  totalArticles.value = filtered.length
  
  return filtered.slice(startIndex, endIndex)
})

// 本地存储相关函数
const STORAGE_KEY_COLUMNS = 'article-grid-columns'
const STORAGE_KEY_VIEW_MODE = 'article-view-mode'

// 网格列数相关
const loadGridColumns = () => {
  const saved = localStorage.getItem(STORAGE_KEY_COLUMNS)
  return saved ? parseInt(saved, 10) : 2
}

const saveGridColumns = (columns: number) => {
  localStorage.setItem(STORAGE_KEY_COLUMNS, columns.toString())
}

// 移除了重复的布局切换逻辑，现在由SearchFilterSection统一管理

// 事件处理函数
const handlePageChange = (page: number) => {
  currentPage.value = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSizeChange = (size: number) => {
  if (viewMode.value === 'list') {
    listPageSize.value = size
  }
  currentPage.value = 1
}

// 重置分页（当筛选条件改变时调用）
const resetPagination = () => {
  currentPage.value = 1
}

// 窗口尺寸变化处理
const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// 生命周期钩子
onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

// 监听筛选条件变化
watch(() => [props.searchKeyword, props.activeFilter, props.activeCategory], () => {
  resetPagination()
}, { deep: true })
</script>

<style lang="less" scoped>
// 文章列表区域
.articles-section {
  position: relative; /* 为搜索栏提供定位参考 */
  margin-bottom: 60px;
  
  
  // 卡片网格布局 - 动态列数
  .articles-grid {
    display: grid;
    gap: 20px;
    
    // 两列布局
    &.grid-columns-2 {
      grid-template-columns: repeat(2, 1fr);
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
    
    // 三列布局
    &.grid-columns-3 {
      grid-template-columns: repeat(3, 1fr);
      
      @media (max-width: 1200px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 768px) {
        grid-template-columns: 1fr;
        gap: 16px;
      }
    }
  }
  
  // 列表布局
  .articles-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  // 分页器 - 响应式设计
  .pagination-container {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 40px;
    padding: 20px;
    background: #ffffff;
    border-radius: 8px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    overflow-x: auto; // 防止水平溢出
    
    @media (max-width: 768px) {
      margin-top: 24px;
      padding: 12px 8px;
      margin-left: -16px;
      margin-right: -16px;
      border-radius: 0;
      border-left: none;
      border-right: none;
    }
    
    :deep(.el-pagination) {
      --el-pagination-bg-color: transparent;
      --el-pagination-text-color: var(--el-text-color-primary);
      --el-pagination-border-radius: 6px;
      
      // 移动端整体样式
      @media (max-width: 768px) {
        --el-pagination-font-size: 14px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: nowrap;
        min-width: 0;
      }
      
      .el-pager li {
        min-width: 32px;
        height: 32px;
        line-height: 30px;
        border-radius: 6px;
        margin: 0 2px;
        transition: all 0.2s ease;
        
        @media (max-width: 768px) {
          min-width: 28px;
          height: 28px;
          line-height: 26px;
          margin: 0 1px;
          font-size: 13px;
        }
        
        &:hover {
          background: rgba(24, 144, 255, 0.1);
          color: #1890ff;
        }
        
        &.is-active {
          background: #1890ff;
          color: white;
          
          &:hover {
            background: #40a9ff;
          }
        }
      }
      
      .btn-prev, .btn-next {
        width: 32px;
        height: 32px;
        border-radius: 6px;
        margin: 0 4px;
        transition: all 0.2s ease;
        
        @media (max-width: 768px) {
          width: 28px;
          height: 28px;
          margin: 0 2px;
          font-size: 13px;
        }
        
        &:hover {
          background: rgba(24, 144, 255, 0.1);
          color: #1890ff;
        }
        
        &:disabled {
          &:hover {
            background: transparent;
            color: var(--el-text-color-placeholder);
          }
        }
      }
      
      .el-select {
        .el-input {
          width: 80px;
          
          .el-input__wrapper {
            border-radius: 6px;
            border: 1px solid #d9d9d9;
            
            &:hover {
              border-color: #40a9ff;
            }
          }
        }
      }
      
      .el-pagination__jump {
        .el-input {
          width: 50px;
          
          .el-input__wrapper {
            border-radius: 6px;
            border: 1px solid #d9d9d9;
            
            &:hover {
              border-color: #40a9ff;
            }
          }
        }
      }
    }
  }
}

/* 分页过渡动画 - 统一的流畅过渡 */
.articles-transition-enter-active {
  transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.articles-transition-leave-active {
  transition: all 0.3s cubic-bezier(0.8, 0.2, 0.8, 1);
}

.articles-transition-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.98);
}

.articles-transition-enter-to {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.articles-transition-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}

.articles-transition-leave-to {
  opacity: 0;
  transform: translateY(-15px) scale(0.98);
}

// 为单个卡片添加递进动画效果
.articles-grid .article-animation-item,
.articles-list .article-animation-item {
  animation: cardFadeIn 0.4s cubic-bezier(0.25, 0.8, 0.25, 1) forwards;
  opacity: 0;
  
  &:nth-child(1) { animation-delay: 0.05s; }
  &:nth-child(2) { animation-delay: 0.1s; }
  &:nth-child(3) { animation-delay: 0.15s; }
  &:nth-child(4) { animation-delay: 0.2s; }
  &:nth-child(5) { animation-delay: 0.25s; }
  &:nth-child(6) { animation-delay: 0.3s; }
  &:nth-child(7) { animation-delay: 0.35s; }
  &:nth-child(8) { animation-delay: 0.4s; }
  &:nth-child(9) { animation-delay: 0.45s; }
}

@keyframes cardFadeIn {
  from {
    opacity: 0;
    transform: translateY(15px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

// 暗色模式
html.dark & {
  .articles-section {
    
    .pagination-container {
      background: #1a1a1a;
      border-color: #303030;
      
      :deep(.el-pagination) {
        .el-pager li {
          &:hover {
            background: rgba(24, 144, 255, 0.2);
            color: #69c0ff;
          }
          
          &.is-active {
            background: #177ddc;
            color: white;
            
            &:hover {
              background: #40a9ff;
            }
          }
        }
        
        .btn-prev, .btn-next {
          &:hover {
            background: rgba(24, 144, 255, 0.2);
            color: #69c0ff;
          }
        }
        
        .el-select {
          .el-input {
            .el-input__wrapper {
              background: #1f1f1f;
              border-color: #303030;
              
              &:hover {
                border-color: #177ddc;
              }
            }
          }
        }
        
        .el-pagination__jump {
          .el-input {
            .el-input__wrapper {
              background: #1f1f1f;
              border-color: #303030;
              
              &:hover {
                border-color: #177ddc;
              }
            }
          }
        }
      }
    }
  }
}
</style>
