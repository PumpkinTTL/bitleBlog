<template>
  <!-- 使用现有的 blogheader，注释掉 IndexLayout
  <IndexLayout
    layout-mode="modern"
    sidebar-position="left"
    header-style="fixed"
    :show-search="true"
    :show-navigation="true"
    :show-scroll-indicator="true"
    :show-back-to-top="true"
    @search="handleSearch"
    @mobile-menu-toggle="handleMobileMenuToggle"
  > -->
  <IndexLayout class="index-v2-container">
    <template #left-sidebar>
      <div class="sidebar-content">
        <div class="sidebar-card animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-info-circle"></i>
            </div>
            <h3 class="card-title">关于本站</h3>
          </div>
          <div class="card-content">
            <div class="site-info">
              <div class="site-avatar">
                <img src="https://picsum.photos/64/64" alt="站点头像" />
              </div>
              <div class="site-details">
                <h4 class="site-name">BitlEBlog</h4>
                <p class="site-desc">探索·学习·成长</p>
              </div>
            </div>
            <div class="site-stats">
              <div class="stat-item">
                <span class="stat-value">234</span>
                <span class="stat-label">文章</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">56</span>
                <span class="stat-label">分类</span>
              </div>
              <div class="stat-item">
                <span class="stat-value">1.2k</span>
                <span class="stat-label">访问</span>
              </div>
            </div>
          </div>
        </div>

        <div class="sidebar-card animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
          <div class="card-header">
            <div class="card-icon hot-icon">
              <i class="fas fa-fire"></i>
            </div>
            <h3 class="card-title">本月热门</h3>
          </div>
          <div class="card-content">
            <div class="hot-articles">
              <div 
                v-for="(article, index) in hotArticles" 
                :key="article.id"
                class="hot-article-item"
                :class="`rank-${index + 1}`"
              >
                <div class="article-rank">{{ index + 1 }}</div>
                <div class="article-info">
                  <h4 class="article-title">{{ article.title }}</h4>
                  <div class="article-meta">
                    <span><i class="fas fa-eye"></i> {{ article.views }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
    
    <template #main-content>
      <div class="main-content-wrapper">


        <!-- 搜索和过滤区域 -->
        <div class="search-filter-section animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
          <div class="search-filter-header">
            <div class="search-container">
              <div class="search-wrapper">
                <el-input
                  v-model="searchKeyword"
                  placeholder="输入关键词搜索文章..."
                  size="large"
                  class="search-input"
                  @keyup.enter="handleSearch(searchKeyword)"
                  clearable>
                  <template #prefix>
                    <el-icon class="search-icon">
                      <Search />
                    </el-icon>
                  </template>
                  <template #suffix>
                    <el-button
                      type="primary"
                      class="search-btn"
                      @click="handleSearch(searchKeyword)"
                      :icon="Search">
                      搜索
                    </el-button>
                  </template>
                </el-input>
              </div>
            </div>
            
            <div class="filter-container">
              <div class="filter-buttons">
                <el-button
                  v-for="item in filterOptions"
                  :key="item.value"
                  :type="activeFilter === item.value ? 'primary' : 'default'"
                  :plain="activeFilter !== item.value"
                  size="default"
                  class="filter-item"
                  @click="handleFilterChange(item.value)">
                  <el-icon class="filter-icon">
                    <component :is="item.icon" />
                  </el-icon>
                  <span class="filter-text">{{ item.label }}</span>
                </el-button>
              </div>
            </div>
          </div>
          
          <!-- 分类标签 -->
          <div class="category-tags">
            <div class="category-scroll">
              <el-tag
                v-for="category in categories"
                :key="category.id"
                :type="activeCategory === category.id ? 'primary' : ''"
                class="category-tag"
                @click="handleCategoryChange(category.id)"
                effect="plain">
                <i :class="category.icon" class="tag-icon"></i>
                {{ category.name }}
                <span v-if="category.count" class="tag-count">({{ category.count }})</span>
              </el-tag>
            </div>
          </div>
        </div>

        <!-- 文章列表 -->
        <div class="articles-section animate__animated animate__fadeInUp" style="animation-delay: 0.3s">
          <div class="section-header">
            <h2 class="section-title">最新文章</h2>
            <div class="view-toggle">
              <el-button-group>
                <el-button :type="viewMode === 'card' ? 'primary' : 'default'" @click="viewMode = 'card'" size="small">
                  <el-icon><Grid /></el-icon>
                </el-button>
                <el-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="viewMode = 'list'" size="small">
                  <el-icon><Menu /></el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>
          
          <!-- 卡片视图 -->
          <div v-if="viewMode === 'card'" class="articles-grid">
            <div 
              v-for="(article, index) in displayArticles" 
              :key="article.id"
              class="article-card animate__animated animate__fadeInUp"
              :style="`animation-delay: ${0.6 + index * 0.1}s`"
              @click="navigateToArticle(article.id)"
            >
              <!-- 文章标签 -->
              <div class="article-badges">
                <el-tag v-if="article.isTop" type="danger" size="small" class="badge-tag">
                  <i class="fas fa-thumbtack"></i> 置顶
                </el-tag>
                <el-tag v-if="article.isRecommended" type="primary" size="small" class="badge-tag">
                  <i class="fas fa-star"></i> 推荐
                </el-tag>
                <el-tag v-if="article.isOriginal" type="success" size="small" class="badge-tag">
                  <i class="fas fa-copyright"></i> 原创
                </el-tag>
                <el-tag v-if="article.isHot" type="warning" size="small" class="badge-tag">
                  <i class="fas fa-fire"></i> 热门
                </el-tag>
              </div>
              
              <div class="article-cover">
                <img :src="article.cover" :alt="article.title" />
                <div class="cover-overlay">
                  <div class="read-more-btn">
                    <i class="fas fa-book-open"></i>
                    阅读全文
                  </div>
                </div>
              </div>
              
              <div class="article-content">
                <div class="article-header">
                  <h3 class="article-title">{{ article.title }}</h3>
                  <p class="article-excerpt">{{ article.excerpt }}</p>
                </div>
                
                <div class="article-author">
                  <el-avatar :size="24" :src="article.author.avatar" />
                  <span class="author-info">
                    <span class="author-name" :class="getAuthorClass(article.author)">
                      {{ article.author.name }}
                      <i v-if="article.author.isVip" class="fas fa-crown vip-icon"></i>
                    </span>
                    <span class="publish-time">
                      <i class="far fa-calendar-alt"></i>
                      {{ formatDate(article.publishTime) }}
                    </span>
                  </span>
                </div>
                
                <div class="article-footer">
                  <div class="article-stats">
                    <span class="stat-item">
                      <i class="fas fa-eye"></i>
                      {{ article.views || 0 }}
                    </span>
                    <span class="stat-item">
                      <i class="fas fa-thumbs-up"></i>
                      {{ article.likes || 0 }}
                    </span>
                    <span class="stat-item">
                      <i class="fas fa-comment"></i>
                      {{ article.comments || 0 }}
                    </span>
                  </div>
                  
                  <div class="article-tags">
                    <el-tag
                      v-for="(tag, tagIndex) in article.tags?.slice(0, 2)"
                      :key="tagIndex"
                      size="small"
                      class="article-tag"
                      :style="getTagStyle(tagIndex)">
                      <i class="fas fa-tag"></i>
                      {{ tag }}
                    </el-tag>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- 列表视图 -->
          <div v-else class="articles-list">
            <div 
              v-for="(article, index) in displayArticles" 
              :key="article.id"
              class="article-item animate__animated animate__fadeInUp"
              :style="`animation-delay: ${0.6 + index * 0.05}s`"
              @click="navigateToArticle(article.id)"
            >
              <div class="item-badges">
                <el-tag v-if="article.isTop" type="danger" size="small">
                  <i class="fas fa-thumbtack"></i> 置顶
                </el-tag>
                <el-tag v-if="article.isRecommended" type="primary" size="small">
                  <i class="fas fa-star"></i> 推荐
                </el-tag>
                <el-tag v-if="article.isOriginal" type="success" size="small">
                  <i class="fas fa-copyright"></i> 原创
                </el-tag>
              </div>
              
              <div class="item-content">
                <div class="item-main">
                  <h3 class="item-title">{{ article.title }}</h3>
                  <p class="item-excerpt">{{ article.excerpt }}</p>
                  
                  <div class="item-meta">
                    <div class="author-info">
                      <el-avatar :size="20" :src="article.author.avatar" />
                      <span class="author-name">{{ article.author.name }}</span>
                    </div>
                    
                    <div class="item-stats">
                      <span><i class="fas fa-eye"></i> {{ article.views }}</span>
                      <span><i class="fas fa-thumbs-up"></i> {{ article.likes }}</span>
                      <span><i class="fas fa-comment"></i> {{ article.comments }}</span>
                      <span><i class="far fa-calendar-alt"></i> {{ formatDate(article.publishTime) }}</span>
                    </div>
                  </div>
                </div>
                
                <div class="item-thumbnail">
                  <img :src="article.cover" :alt="article.title" />
                </div>
              </div>
            </div>
          </div>
          
          <!-- 分页 -->
          <div class="pagination-wrapper">
            <el-pagination
              v-model:current-page="currentPage"
              v-model:page-size="pageSize"
              :page-sizes="[6, 12, 24, 48]"
              :total="totalArticles"
              layout="total, sizes, prev, pager, next, jumper"
              background
              @size-change="handleSizeChange"
              @current-change="handlePageChange"
            />
          </div>
        </div>

      </div>
    </template>
  </IndexLayout>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Search, Filter, ArrowDown, Check, Grid, Menu, Document, Star, Clock, Promotion } from '@element-plus/icons-vue'
import IndexLayout from './layout/IndexLayout.vue'

const router = useRouter()

// 响应式数据
const searchKeyword = ref('')
const activeFilter = ref('all')
const activeCategory = ref(0)
const viewMode = ref('card')
const currentPage = ref(1)
const pageSize = ref(6)
const totalArticles = ref(18)

const hotArticles = ref([
  { id: 1, title: 'Vue 3 组合式 API 最佳实践', views: '2.5k' },
  { id: 2, title: 'TypeScript 项目配置指南', views: '1.9k' },
  { id: 3, title: '现代 CSS 布局技术解析', views: '1.6k' },
  { id: 4, title: 'Vite 构建工具深度解析', views: '1.2k' },
  { id: 5, title: '前端性能优化实践', views: '980' }
])


// 分类数据
const categories = ref([
  { id: 0, name: '全部', icon: 'fas fa-th-large', count: 18 },
  { id: 1, name: 'Vue.js', icon: 'fab fa-vuejs', count: 8 },
  { id: 2, name: 'React', icon: 'fab fa-react', count: 5 },
  { id: 3, name: 'JavaScript', icon: 'fab fa-js-square', count: 12 },
  { id: 4, name: 'TypeScript', icon: 'fab fa-js-square', count: 6 },
  { id: 5, name: 'CSS', icon: 'fab fa-css3-alt', count: 4 },
  { id: 6, name: 'Node.js', icon: 'fab fa-node-js', count: 3 },
  { id: 7, name: '工具', icon: 'fas fa-tools', count: 7 }
])

// 筛选选项
const filterOptions = ref([
  { value: 'all', label: '全部文章', icon: Document },
  { value: 'recommended', label: '推荐文章', icon: Star },
  { value: 'latest', label: '最新发布', icon: Clock },
  { value: 'popular', label: '热门文章', icon: Promotion }
])

// 丰富的文章数据
const allArticles = ref([
  {
    id: 1,
    title: 'Vue 3 + TypeScript 项目实战指南：从零到一构建现代化前端应用',
    excerpt: '深入探索 Vue 3 的 Composition API、TypeScript 集成、Vite 构建工具，以及现代化的项目架构设计最佳实践。包括组件封装、状态管理、路由配置等核心内容。',
    cover: 'https://picsum.photos/400/240?random=1',
    author: {
      id: 1,
      name: 'Vue 大师',
      avatar: 'https://picsum.photos/40/40?random=101',
      isVip: true
    },
    publishTime: '2024-01-15',
    views: 2456,
    likes: 189,
    comments: 23,
    tags: ['Vue3', 'TypeScript', '前端工程化'],
    category: 1,
    isTop: true,
    isRecommended: true,
    isOriginal: true,
    isHot: true
  },
  {
    id: 2,
    title: 'React 18 新特性全面解析：Concurrent 模式和 Suspense',
    excerpt: '详细介绍 React 18 的革命性新特性，包括并发渲染、自动批处理、Suspense 改进等。通过实际例子展示如何提升应用性能。',
    cover: 'https://picsum.photos/400/240?random=2',
    author: {
      id: 2,
      name: 'React 专家',
      avatar: 'https://picsum.photos/40/40?random=102',
      isVip: false
    },
    publishTime: '2024-01-12',
    views: 1876,
    likes: 156,
    comments: 19,
    tags: ['React', '性能优化', '并发渲染'],
    category: 2,
    isTop: false,
    isRecommended: true,
    isOriginal: true,
    isHot: false
  },
  {
    id: 3,
    title: 'JavaScript 性能优化终极指南：从内存管理到网络优化',
    excerpt: '全面讲解 JavaScript 性能优化的各个方面，包括内存管理、事件循环、DOM 操作、网络请求等。提供实用的性能监控工具和调优方法。',
    cover: 'https://picsum.photos/400/240?random=3',
    author: {
      id: 3,
      name: 'JS 高手',
      avatar: 'https://picsum.photos/40/40?random=103',
      isVip: true
    },
    publishTime: '2024-01-10',
    views: 3241,
    likes: 287,
    comments: 45,
    tags: ['JavaScript', '性能优化', '最佳实践'],
    category: 3,
    isTop: false,
    isRecommended: true,
    isOriginal: true,
    isHot: true
  },
  {
    id: 4,
    title: 'CSS Grid 布局完全指南：构建响应式网格系统',
    excerpt: '从基础语法到高级技巧，全面掌握 CSS Grid 布局。包括网格线定义、区域命名、自适应设计等实用技巧，并结合实际项目案例。',
    cover: 'https://picsum.photos/400/240?random=4',
    author: {
      id: 4,
      name: 'CSS 大神',
      avatar: 'https://picsum.photos/40/40?random=104',
      isVip: false
    },
    publishTime: '2024-01-08',
    views: 1543,
    likes: 98,
    comments: 12,
    tags: ['CSS', '布局', '响应式设计'],
    category: 5,
    isTop: false,
    isRecommended: false,
    isOriginal: true,
    isHot: false
  },
  {
    id: 5,
    title: 'Node.js 微服务架构实践：从单体到分布式',
    excerpt: '详细介绍如何使用 Node.js 构建微服务架构，包括服务切分、API 网关、消息队列、服务发现等关键技术。附带完整的项目案例。',
    cover: 'https://picsum.photos/400/240?random=5',
    author: {
      id: 5,
      name: 'Node 架构师',
      avatar: 'https://picsum.photos/40/40?random=105',
      isVip: true
    },
    publishTime: '2024-01-05',
    views: 987,
    likes: 76,
    comments: 8,
    tags: ['Node.js', '微服务', '架构设计'],
    category: 6,
    isTop: false,
    isRecommended: false,
    isOriginal: true,
    isHot: false
  },
  {
    id: 6,
    title: 'Webpack 5 构建优化实践：提升构建速度 10 倍',
    excerpt: '深入分析 Webpack 5 的新特性和性能优化方法，包括模块联邦、持久化缓存、Tree Shaking 等高级技巧，帮你显著提升构建效率。',
    cover: 'https://picsum.photos/400/240?random=6',
    author: {
      id: 6,
      name: '构建工具专家',
      avatar: 'https://picsum.photos/40/40?random=106',
      isVip: false
    },
    publishTime: '2024-01-03',
    views: 2187,
    likes: 143,
    comments: 16,
    tags: ['Webpack', '构建优化', '性能调优'],
    category: 7,
    isTop: false,
    isRecommended: true,
    isOriginal: false,
    isHot: true
  }
])

// 计算属性
const displayArticles = computed(() => {
  let filtered = allArticles.value
  
  // 分类筛选
  if (activeCategory.value > 0) {
    filtered = filtered.filter(article => article.category === activeCategory.value)
  }
  
  // 类型筛选
  switch (activeFilter.value) {
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
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
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
const handleSearch = (query: string) => {
  searchKeyword.value = query
  currentPage.value = 1
}

const handleFilterChange = (filterValue: string) => {
  activeFilter.value = filterValue
  currentPage.value = 1
}

const handleCategoryChange = (categoryId: number) => {
  activeCategory.value = categoryId
  currentPage.value = 1
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  // 滚动到顶部
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const handleSizeChange = (size: number) => {
  pageSize.value = size
  currentPage.value = 1
}

const getFilterLabel = (value: string) => {
  const option = filterOptions.value.find(item => item.value === value)
  return option ? option.label : '全部文章'
}

const navigateToArticle = (articleId: number) => {
  router.push({
    path: `/blogDetail/${articleId}`,
    query: { transition: 'slide-fade' }
  })
}

const getAuthorClass = (author: any) => {
  if (author.isVip) return 'author-vip'
  return ''
}

const formatDate = (dateString: string) => {
  return dateString.split(' ')[0]
}

const getTagStyle = (index: number) => {
  const colors = [
    { background: '#1890ff' },
    { background: '#52c41a' },
    { background: '#fa8c16' },
    { background: '#722ed1' },
    { background: '#13c2c2' },
    { background: '#eb2f96' },
    { background: '#f5222d' },
    { background: '#faad14' }
  ]
  return colors[index % colors.length]
}


const handleMobileMenuToggle = (isOpen: boolean) => {
  console.log('移动端菜单:', isOpen ? '打开' : '关闭')
}
</script>

<style lang="less" scoped>
// 确保主内容区域与其他页面保持一致的版心设计

.main-content-wrapper {
  width: 100%;
  min-height: 100vh;
  // 这里不需要额外设置max-width，因为IndexLayout已经处理了版心
}

// 搜索和过滤区域 - 小巧精致扁平化设计
.search-filter-section {
  margin-bottom: 24px;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e8f4fd;
  box-shadow: 0 1px 3px rgba(24, 144, 255, 0.05);
  transition: all 0.2s ease;
  
  &:hover {
    border-color: #bae0ff;
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.08);
  }
  
  .search-filter-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
    
    @media (max-width: 968px) {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
    
    .search-container {
      flex: 1;
      
      .search-wrapper {
        width: 100%;
        max-width: 400px;
        
        .search-input {
          width: 100%;
          
          :deep(.el-input__wrapper) {
            background: #ffffff;
            border: 1px solid #e8f4fd;
            border-radius: 6px;
            box-shadow: 0 1px 2px rgba(24, 144, 255, 0.04);
            transition: all 0.2s ease;
            height: 36px;
            padding-right: 0;
            display: flex;
            align-items: center;
            
            &:hover {
              border-color: #bae0ff;
              box-shadow: 0 1px 4px rgba(24, 144, 255, 0.08);
            }
            
            &.is-focus {
              border-color: #1890ff;
              box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.1);
            }
          }
          
          :deep(.el-input__inner) {
            font-size: 14px;
            color: var(--el-text-color-primary);
            padding: 0 8px 0 40px;
            border: none;
            background: transparent;
            height: 34px;
            flex: 1;
            
            &::placeholder {
              color: var(--el-text-color-placeholder);
            }
          }
          
          :deep(.el-input__prefix) {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            z-index: 1;
            
            .search-icon {
              color: #1890ff;
              font-size: 16px;
            }
          }
          
          :deep(.el-input__suffix) {
            padding: 0;
            margin: 0;
            position: relative;
            
            .search-btn {
              margin: 0;
              height: 34px;
              padding: 0 16px;
              font-size: 12px;
              font-weight: 500;
              border-radius: 0 5px 5px 0;
              background: #1890ff;
              border: none;
              color: white;
              transition: all 0.2s ease;
              border-left: 1px solid #e8f4fd;
              
              &:hover {
                background: #40a9ff;
              }
              
              &:active {
                background: #096dd9;
              }
            }
          }
        }
      }
    }
    
    .filter-container {
      .filter-buttons {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        
        .filter-item {
          height: 32px;
          padding: 0 10px;
          font-size: 12px;
          border-radius: 4px;
          border: 1px solid #f0f0f0;
          background: #fafafa;
          color: #666666;
          transition: all 0.2s ease;
          
          .filter-icon {
            font-size: 12px;
          }
          
          .filter-text {
            margin-left: 3px;
            font-weight: 500;
          }
          
          &:hover {
            border-color: #d9ecff;
            background: #f0f9ff;
            color: #1890ff;
          }
          
          &.el-button--primary {
            background: #e6f7ff;
            border-color: #91d5ff;
            color: #1890ff;
            
            &:hover {
              background: #bae7ff;
              border-color: #69c0ff;
              color: #0050b3;
            }
          }
          
          @media (max-width: 640px) {
            height: 28px;
            padding: 0 6px;
            font-size: 11px;
            
            .filter-text {
              display: none;
            }
          }
        }
      }
    }
  }
  
  .category-tags {
    .category-scroll {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      
      .category-tag {
        cursor: pointer;
        transition: all 0.2s ease;
        border-radius: 4px;
        font-size: 12px;
        padding: 4px 8px;
        border: 1px solid #e6f7ff;
        background: #f6ffed;
        color: #52c41a;
        
        &:hover {
          border-color: #b7eb8f;
          background: #f6ffed;
          color: #389e0d;
        }
        
        &.el-tag--primary {
          background: #e6f7ff;
          border-color: #91d5ff;
          color: #1890ff;
          
          &:hover {
            background: #bae7ff;
            border-color: #69c0ff;
          }
        }
        
        // 为不同分类添加不同颜色
        &:nth-child(2) {
          background: #f6ffed;
          border-color: #d9f7be;
          color: #52c41a;
          
          &:hover {
            background: #f6ffed;
            border-color: #b7eb8f;
          }
        }
        
        &:nth-child(3) {
          background: #fff7e6;
          border-color: #ffd591;
          color: #fa8c16;
          
          &:hover {
            background: #fff7e6;
            border-color: #ffc069;
          }
        }
        
        &:nth-child(4) {
          background: #f9f0ff;
          border-color: #d3adf7;
          color: #722ed1;
          
          &:hover {
            background: #f9f0ff;
            border-color: #b37feb;
          }
        }
        
        &:nth-child(5) {
          background: #e6fffb;
          border-color: #87e8de;
          color: #13c2c2;
          
          &:hover {
            background: #e6fffb;
            border-color: #5cdbd3;
          }
        }
        
        .tag-icon {
          font-size: 11px;
          margin-right: 3px;
        }
        
        .tag-count {
          font-size: 10px;
          opacity: 0.7;
          margin-left: 2px;
        }
      }
    }
  }
  
  // 暗色模式适配
  html.dark & {
    background: #1a1a1a;
    border-color: #303030;
    
    &:hover {
      border-color: #177ddc;
      box-shadow: 0 2px 6px rgba(23, 125, 220, 0.15);
    }
    
    .search-filter-header {
      .search-container {
        .search-wrapper {
          .search-input {
            :deep(.el-input__wrapper) {
              background: #1f1f1f;
              border-color: #434343;
              
              &:hover {
                border-color: #177ddc;
              }
              
              &.is-focus {
                border-color: #177ddc;
                box-shadow: 0 0 0 2px rgba(23, 125, 220, 0.2);
              }
            }
            
            :deep(.el-input__inner) {
              color: rgba(255, 255, 255, 0.85);
              
              &::placeholder {
                color: rgba(255, 255, 255, 0.45);
              }
            }
            
            :deep(.el-input__prefix) {
              .search-icon {
                color: #177ddc;
              }
            }
            
            :deep(.el-input__suffix) {
              .search-btn {
                background: #177ddc;
                border-left-color: #434343;
                
                &:hover {
                  background: #3c9be8;
                }
                
                &:active {
                  background: #0958d9;
                }
              }
            }
          }
        }
      }
      
      .filter-container {
        .filter-buttons {
          .filter-item {
            background: #1f1f1f;
            border-color: #303030;
            color: rgba(255, 255, 255, 0.65);
            
            &:hover {
              border-color: #165996;
              background: #0a1628;
              color: #3c9be8;
            }
            
            &.el-button--primary {
              background: #0a1628;
              border-color: #165996;
              color: #3c9be8;
              
              &:hover {
                background: #112545;
                border-color: #1d7ddc;
                color: #69c0ff;
              }
            }
          }
        }
      }
    }
    
    .category-tags {
      .category-scroll {
        .category-tag {
          background: #1f1f1f;
          border-color: #303030;
          color: rgba(255, 255, 255, 0.65);
          
          &:hover {
            border-color: #165996;
            background: #0a1628;
            color: #3c9be8;
          }
          
          &.el-tag--primary {
            background: #0a1628;
            border-color: #165996;
            color: #3c9be8;
            
            &:hover {
              background: #112545;
              border-color: #1d7ddc;
            }
          }
          
          // 暗色模式下的不同分类颜色
          &:nth-child(2) {
            background: #162312;
            border-color: #274916;
            color: #73d13d;
            
            &:hover {
              background: #1b2b16;
              border-color: #2f5923;
            }
          }
          
          &:nth-child(3) {
            background: #2b1d11;
            border-color: #594214;
            color: #ffa940;
            
            &:hover {
              background: #352511;
              border-color: #6b4a17;
            }
          }
          
          &:nth-child(4) {
            background: #1a1326;
            border-color: #3e2869;
            color: #b37feb;
            
            &:hover {
              background: #22162e;
              border-color: #4b347c;
            }
          }
          
          &:nth-child(5) {
            background: #112123;
            border-color: #13484e;
            color: #36cfc9;
            
            &:hover {
              background: #142a2e;
              border-color: #1c5a5e;
            }
          }
        }
      }
    }
  }
}

// 文章列表区域
.articles-section {
  margin-bottom: 60px;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 12px 16px;
    background: #ffffff;
    border-radius: 6px;
    border: 1px solid #f0f0f0;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #e6f7ff;
      box-shadow: 0 1px 4px rgba(24, 144, 255, 0.06);
    }
    
    @media (max-width: 768px) {
      padding: 10px 12px;
      flex-direction: column;
      align-items: flex-start;
      gap: 8px;
    }
    
    .section-title {
      font-size: 1.2rem;
      font-weight: 600;
      margin: 0;
      color: var(--el-text-color-primary);
      
      @media (max-width: 768px) {
        font-size: 1.1rem;
      }
    }
    
    .view-toggle {
      display: flex;
      align-items: center;
      
      :deep(.el-button-group) {
        border-radius: 4px;
        overflow: hidden;
        
        .el-button {
          border-radius: 0;
          height: 28px;
          padding: 0 8px;
          font-size: 12px;
          border: 1px solid #d9d9d9;
          
          &:hover {
            border-color: #40a9ff;
            color: #40a9ff;
          }
          
          &--primary {
            background: #1890ff;
            border-color: #1890ff;
            color: white;
            
            &:hover {
              background: #40a9ff;
              border-color: #40a9ff;
            }
          }
        }
      }
    }
    
    html.dark & {
      background: #1a1a1a;
      border-color: #303030;
      
      &:hover {
        border-color: #177ddc;
      }
      
      .section-title {
        color: rgba(255, 255, 255, 0.9);
      }
    }
  }
  
  // 卡片视图 - 精致化设计，调整尺寸让三列显示更加美观
  .articles-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); // 缩小最小宽度，让卡片更紧凑
    gap: 18px; // 略微减小间距
    margin-top: 16px;
    
    // 为PC端大屏幕优化：确保三列的完美显示
    @media (min-width: 1200px) {
      grid-template-columns: repeat(3, 1fr); // 强制三列布局
      gap: 20px;
    }
    
    @media (max-width: 1199px) and (min-width: 769px) {
      grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
      gap: 16px;
    }
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 16px;
      margin-top: 12px;
    }
    
    @media (max-width: 480px) {
      gap: 14px;
    }
    
    .article-card {
      background: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid rgba(240, 240, 240, 0.6);
      cursor: pointer;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      box-shadow: 
        0 1px 3px rgba(0, 0, 0, 0.03),
        0 1px 2px rgba(0, 0, 0, 0.02);
      
      &:hover {
        border-color: rgba(24, 144, 255, 0.3);
        box-shadow: 
          0 8px 24px rgba(24, 144, 255, 0.12),
          0 4px 12px rgba(0, 0, 0, 0.04);
        transform: translateY(-4px) scale(1.02);
        
        .article-title {
          color: #1890ff;
        }
        
        .article-cover {
          img {
            transform: scale(1.05);
          }
          
          .cover-overlay {
            opacity: 1;
            visibility: visible;
            
            .read-more-btn {
              transform: translateY(0);
            }
          }
        }
        
        .article-content {
          &::before {
            opacity: 1;
          }
          
          .article-excerpt {
            opacity: 1;
          }
        }
      }
      
      html.dark & {
        background: #1a1a1a;
        border-color: #303030;
        
        &:hover {
          border-color: #177ddc;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
        }
      }
      
      .article-badges {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 2;
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        
        .badge-tag {
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 6px;
          font-weight: 600;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          backdrop-filter: blur(4px);
          
          &.el-tag--danger {
            background: linear-gradient(135deg, #ff4757 0%, #ff3742 100%) !important;
            color: #ffffff !important;
            border: none !important;
          }
          
          &.el-tag--primary {
            background: linear-gradient(135deg, #1890ff 0%, #0050b3 100%) !important;
            color: #ffffff !important;
            border: none !important;
          }
          
          &.el-tag--success {
            background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%) !important;
            color: #ffffff !important;
            border: none !important;
          }
          
          &.el-tag--warning {
            background: linear-gradient(135deg, #fa8c16 0%, #d46b08 100%) !important;
            color: #ffffff !important;
            border: none !important;
          }
          
          i {
            font-size: 10px;
            margin-right: 2px;
            color: #ffffff;
          }
        }
      }
      
      .article-cover {
        position: relative;
        height: 160px; // 略微减小封面图高度，让整体更紧凑
        overflow: hidden;
        background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        .cover-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            135deg,
            rgba(24, 144, 255, 0.8) 0%,
            rgba(64, 169, 255, 0.6) 50%,
            rgba(105, 192, 255, 0.4) 100%
          );
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          
          .read-more-btn {
            background: rgba(255, 255, 255, 0.95);
            color: #1890ff;
            padding: 12px 24px;
            border-radius: 25px;
            font-size: 14px;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 8px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            backdrop-filter: blur(10px);
            transform: translateY(10px);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            
            i {
              font-size: 16px;
              transition: transform 0.3s ease;
            }
            
            &:hover {
              background: #ffffff;
              transform: translateY(0) scale(1.05);
              box-shadow: 0 8px 30px rgba(24, 144, 255, 0.2);
              
              i {
                transform: translateX(4px);
              }
            }
          }
        }
        
        html.dark & {
          background: linear-gradient(135deg, #2c3e50 0%, #34495e 100%);
          
          .cover-overlay {
            background: linear-gradient(
              135deg,
              rgba(23, 125, 220, 0.8) 0%,
              rgba(60, 155, 232, 0.6) 50%,
              rgba(105, 192, 255, 0.4) 100%
            );
          }
        }
      }
      
      .article-content {
        padding: 16px; // 缩小内边距，让内容更紧凑
        background: linear-gradient(180deg, #ffffff 0%, #fafbfc 100%);
        position: relative;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 2px;
          background: linear-gradient(90deg, #1890ff 0%, #40a9ff 50%, #69c0ff 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        html.dark & {
          background: linear-gradient(180deg, #1a1a1a 0%, #141414 100%);
        }
        
        .article-header {
          margin-bottom: 14px; // 略微减小间距
          
          .article-title {
            font-size: 16px; // 略微减小标题字体，让整体更精致
            font-weight: 700;
            color: var(--el-text-color-primary);
            margin-bottom: 8px; // 减小下间距
            line-height: 1.3;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            transition: all 0.3s ease;
            letter-spacing: 0.02em;
          }
          
          .article-excerpt {
            color: var(--el-text-color-regular);
            line-height: 1.5; // 略微缩小行高
            font-size: 12px; // 略微减小字体
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2; // 减少到两行，让内容更紧凑
            -webkit-box-orient: vertical;
            opacity: 0.75;
            transition: opacity 0.3s ease;
          }
        }
        
        .article-author {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 10px; // 略微减小间距
          
          .author-info {
            display: flex;
            flex-direction: column;
            gap: 2px;
            
            .author-name {
              font-size: 11px;
              font-weight: 500;
              color: var(--el-text-color-primary);
              display: flex;
              align-items: center;
              gap: 3px;
              
              &.author-vip {
                color: #f5a623;
              }
              
              .vip-icon {
                color: #f5a623;
                font-size: 9px;
              }
            }
            
            .publish-time {
              font-size: 10px;
              color: var(--el-text-color-secondary);
              display: flex;
              align-items: center;
              gap: 2px;
              
              i {
                font-size: 9px;
              }
            }
          }
        }
        
        .article-footer {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-top: auto;
          padding-top: 10px; // 缩小上间距
          border-top: 1px solid rgba(240, 240, 240, 0.6);
          
          html.dark & {
            border-top-color: rgba(255, 255, 255, 0.06);
          }
          
          .article-stats {
            display: flex;
            gap: 12px;
            
            .stat-item {
              font-size: 12px;
              color: var(--el-text-color-secondary);
              display: flex;
              align-items: center;
              gap: 4px;
              opacity: 0.8;
              transition: all 0.3s ease;
              padding: 4px 8px;
              border-radius: 12px;
              background: rgba(24, 144, 255, 0.05);
              
              &:hover {
                opacity: 1;
                background: rgba(24, 144, 255, 0.1);
                color: #1890ff;
                transform: translateY(-1px);
              }
              
              i {
                font-size: 11px;
                color: #1890ff;
              }
            }
          }
          
          .article-tags {
            display: flex;
            gap: 6px;
            flex-wrap: wrap;
            
            .article-tag {
              font-size: 11px;
              padding: 4px 10px;
              border-radius: 12px;
              border: none;
              font-weight: 600;
              position: relative;
              overflow: hidden;
              transition: all 0.3s ease;
              color: #ffffff !important;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              
              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
                opacity: 0;
                transition: opacity 0.3s ease;
              }
              
              &:hover {
                transform: translateY(-1px) scale(1.05);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
                
                &::before {
                  opacity: 1;
                }
              }
              
              i {
                font-size: 10px;
                margin-right: 4px;
                color: #ffffff;
                text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
              }
            }
          }
        }
      }
    }
  }
  
  // 列表视图
  .articles-list {
    display: flex;
    flex-direction: column;
    gap: 16px;
    
    .article-item {
      background: #ffffff;
      border-radius: 6px;
      padding: 16px;
      border: 1px solid #f0f0f0;
      cursor: pointer;
      transition: all 0.2s ease;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(24, 144, 255, 0.08);
        border-color: #d9ecff;
      }
      
      html.dark & {
        background: #1a1a1a;
        border-color: #303030;
        
        &:hover {
          border-color: #177ddc;
          box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
        }
      }
      
      .item-badges {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-bottom: 12px;
      }
      
      .item-content {
        display: flex;
        gap: 16px;
        
        @media (max-width: 768px) {
          flex-direction: column;
          gap: 12px;
        }
        
        .item-main {
          flex: 1;
          
          .item-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 8px;
            line-height: 1.4;
          }
          
          .item-excerpt {
            color: var(--el-text-color-regular);
            line-height: 1.5;
            margin-bottom: 12px;
            font-size: 14px;
            overflow: hidden;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .item-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 8px;
            
            .author-info {
              display: flex;
              align-items: center;
              gap: 6px;
              
              .author-name {
                font-size: 12px;
                color: var(--el-text-color-primary);
                font-weight: 500;
              }
            }
            
            .item-stats {
              display: flex;
              gap: 12px;
              
              span {
                display: flex;
                align-items: center;
                gap: 3px;
                font-size: 11px;
                color: var(--el-text-color-secondary);
                
                i {
                  font-size: 10px;
                  color: var(--el-color-primary);
                  opacity: 0.7;
                }
              }
            }
          }
        }
        
        .item-thumbnail {
          width: 120px;
          height: 80px;
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
          background: #fafafa;
          
          @media (max-width: 768px) {
            width: 100px;
            height: 67px;
          }
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: opacity 0.2s ease;
          }
          
          &:hover img {
            opacity: 0.9;
          }
          
          html.dark & {
            background: #262626;
          }
        }
      }
    }
  }
  
  .pagination-wrapper {
    margin-top: 32px;
    display: flex;
    justify-content: center;
  }
}

// 动画关键帧
@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.sidebar-card {
  background: var(--el-bg-color);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  overflow: hidden;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    transform: translateY(-2px);
  }
  
  .card-header {
    padding: 16px 20px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    display: flex;
    align-items: center;
    gap: 12px;
    
    .card-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, 
        rgba(22, 119, 255, 0.1) 0%,
        rgba(105, 177, 255, 0.08) 100%
      );
      color: var(--el-color-primary);
      font-size: 14px;
      
      &.hot-icon {
        background: linear-gradient(135deg, 
          rgba(255, 107, 107, 0.1) 0%,
          rgba(255, 142, 142, 0.08) 100%
        );
        color: #FF6B6B;
      }
      
      &.tools-icon {
        background: linear-gradient(135deg, 
          rgba(52, 211, 153, 0.1) 0%,
          rgba(16, 185, 129, 0.08) 100%
        );
        color: #34D399;
      }
      
      &.tags-icon {
        background: linear-gradient(135deg, 
          rgba(168, 85, 247, 0.1) 0%,
          rgba(139, 92, 246, 0.08) 100%
        );
        color: #A855F7;
      }
    }
    
    .card-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin: 0;
    }
  }
  
  .card-content {
    padding: 20px;
  }
}

// 站点信息
.site-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  
  .site-avatar {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .site-details {
    .site-name {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin: 0 0 4px 0;
    }
    
    .site-desc {
      font-size: 12px;
      color: var(--el-text-color-placeholder);
      margin: 0;
    }
  }
}

.site-stats {
  display: flex;
  justify-content: space-around;
  
  .stat-item {
    text-align: center;
    
    .stat-value {
      display: block;
      font-size: 18px;
      font-weight: 700;
      color: var(--el-color-primary);
    }
    
    .stat-label {
      font-size: 12px;
      color: var(--el-text-color-placeholder);
    }
  }
}

// 热门文章
.hot-articles {
  .hot-article-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--el-border-color-extra-light);
    
    &:last-child {
      border-bottom: none;
    }
    
    .article-rank {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-regular);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 600;
      flex-shrink: 0;
    }
    
    &.rank-1 .article-rank {
      background: linear-gradient(135deg, #FFD700, #FFA500);
      color: white;
    }
    
    &.rank-2 .article-rank {
      background: linear-gradient(135deg, #C0C0C0, #A8A8A8);
      color: white;
    }
    
    &.rank-3 .article-rank {
      background: linear-gradient(135deg, #CD7F32, #B8860B);
      color: white;
    }
    
    .article-info {
      flex: 1;
      min-width: 0;
      
      .article-title {
        font-size: 13px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        margin: 0 0 4px 0;
        line-height: 1.4;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      
      .article-meta {
        font-size: 11px;
        color: var(--el-text-color-placeholder);
      }
    }
  }
}

// 工具列表
.tools-list {
  .tool-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid var(--el-border-color-extra-light);
    
    &:last-child {
      border-bottom: none;
    }
    
    .tool-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      flex-shrink: 0;
    }
    
    .tool-info {
      flex: 1;
      min-width: 0;
      
      .tool-name {
        font-size: 13px;
        font-weight: 500;
        color: var(--el-text-color-primary);
        margin: 0 0 4px 0;
      }
      
      .tool-desc {
        font-size: 11px;
        color: var(--el-text-color-placeholder);
        margin: 0;
      }
    }
  }
}

// 标签云
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  .tag-item {
    padding: 4px 8px;
    background: var(--el-fill-color-light);
    border-radius: 6px;
    color: var(--el-text-color-regular);
    font-weight: 500;
    cursor: pointer;
    transition: all 0.3s ease;
    
    &:hover {
      background: rgba(22, 119, 255, 0.1);
      color: var(--el-color-primary);
      transform: translateY(-2px);
    }
  }
}

// 动画
@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

@keyframes floatMove {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes floatUp {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}
</style>
