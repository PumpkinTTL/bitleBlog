<template>
  <div class="articles-section animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
    <div class="section-header">
      <h2 class="section-title">
        <i class="fas fa-newspaper"></i>
        最新文章
      </h2>
      <div class="view-toggle">
        <el-button-group>
          <el-button :type="viewMode === 'card' ? 'primary' : 'default'" @click="viewMode = 'card'">
            <el-icon><Grid /></el-icon>
          </el-button>
          <el-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'">
            <el-icon><Menu /></el-icon>
          </el-button>
        </el-button-group>
      </div>
    </div>
    
    <!-- 卡片视图 -->
    <div v-if="viewMode === 'card'" class="articles-grid">
      <ArticleCard
        v-for="(article, index) in displayArticles"
        :key="article.id"
        :article="article"
        :view-mode="viewMode"
        :animation-delay="0.3 + index * 0.05"
      />
    </div>
    
    <!-- 列表视图 -->
    <div v-else class="articles-list">
      <ArticleCard
        v-for="article in displayArticles"
        :key="article.id"
        :article="article"
        :view-mode="viewMode"
      />
    </div>
    
    <!-- 分页 -->
    <div v-if="totalArticles > pageSize" class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[6, 12, 18, 24]"
        :total="totalArticles"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        background
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
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
}

const props = withDefaults(defineProps<Props>(), {
  searchKeyword: '',
  activeFilter: 'all',
  activeCategory: 0
})

// 响应式数据
const viewMode = ref<'card' | 'list'>('card')
const currentPage = ref(1)
const pageSize = ref(12)
const totalArticles = ref(0)

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
  const startIndex = (currentPage.value - 1) * pageSize.value
  const endIndex = startIndex + pageSize.value
  
  // 更新总数
  totalArticles.value = filtered.length
  
  return filtered.slice(startIndex, endIndex)
})

// 事件处理函数
const handlePageChange = (page: number) => {
  currentPage.value = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

// 重置分页（当筛选条件改变时调用）
const resetPagination = () => {
  currentPage.value = 1
}

// 监听筛选条件变化
watch(() => [props.searchKeyword, props.activeFilter, props.activeCategory], () => {
  resetPagination()
}, { deep: true })
</script>

<style lang="less" scoped>
// 文章列表区域
.articles-section {
  margin-bottom: 60px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 14px 0;
    border-bottom: 1px solid #e9ecef;
    
    @media (max-width: 768px) {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      padding: 12px 0;
    }
    
    .section-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
      color: #343a40;
      display: flex;
      align-items: center;
      gap: 8px;
      
      i {
        font-size: 1rem;
        color: #007bff;
      }
      
      @media (max-width: 768px) {
        font-size: 1.1rem;
        
        i {
          font-size: 0.9rem;
        }
      }
    }
    
    .view-toggle {
      display: flex;
      align-items: center;
      
      :deep(.el-button-group) {
        border-radius: 4px;
        overflow: hidden;
        border: 1px solid #dee2e6;
        
        .el-button {
          height: 32px !important;
          width: 36px !important;
          padding: 0 !important;
          font-size: 14px !important;
          border: none !important;
          background: #ffffff !important;
          color: #495057 !important;
          transition: all 0.2s ease !important;
          
          &:hover {
            background: #f8f9fa !important;
            color: #343a40 !important;
          }
          
          &.el-button--primary {
            background: #007bff !important;
            color: white !important;
            
            &:hover {
              background: #0056b3 !important;
            }
          }
          
          .el-icon {
            font-size: 14px !important;
          }
        }
      }
    }
  }
  
  // 卡片网格布局
  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
  
  // 列表布局
  .articles-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  // 分页器
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
    
    :deep(.el-pagination) {
      --el-pagination-bg-color: transparent;
      --el-pagination-text-color: var(--el-text-color-primary);
      --el-pagination-border-radius: 6px;
      
      .el-pager li {
        min-width: 32px;
        height: 32px;
        line-height: 30px;
        border-radius: 6px;
        margin: 0 2px;
        transition: all 0.2s ease;
        
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

// 暗色模式
html.dark & {
  .articles-section {
    .section-header {
      border-bottom-color: #495057;
      
      .section-title {
        color: #e9ecef;
        
        i {
          color: #007bff;
        }
      }
      
      .view-toggle {
        :deep(.el-button-group) {
          border-color: #495057;
          
          .el-button {
            background: #343a40 !important;
            color: #f8f9fa !important;
            
            &:hover {
              background: #495057 !important;
              color: #ffffff !important;
            }
            
            &.el-button--primary {
              background: #007bff !important;
              color: white !important;
              
              &:hover {
                background: #007bff !important;
              }
            }
          }
        }
      }
    }
    
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
