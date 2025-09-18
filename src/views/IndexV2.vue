<template>

  <IndexLayout class="index-v2-container">
    <template #left-sidebar>
      <div class="sidebar-content">
        <div class="sidebar-card about-card animate__animated animate__fadeInUp" style="animation-delay: 0.15s">
          <div class="card-header">
            <i class="fas fa-info-circle"></i>
            <span>关于本站</span>
          </div>
          
          <div class="card-body">
            <div class="site-brand">
              <div class="brand-logo">
                <i class="fas fa-gem"></i>
              </div>
              <div class="brand-text">
                <h4 class="brand-name">
                    <span class="name-zh glow-text">知识棱镜</span>
                  <span class="name-en">Knowledge Prism</span>
                </h4>
                <div class="brand-desc">
                  <span class="desc-text">技术分享 · 知识传递 · 成长记录</span>
                  <div class="status-badge">
                    <div class="status-dot"></div>
                    <span class="status-text">稳定运行</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div class="site-stats">
              <div class="stats-title">
                <i class="fas fa-chart-bar"></i>
                <span>站点数据</span>
              </div>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-icon articles">
                    <i class="fas fa-file-alt"></i>
                  </div>
                  <div class="stat-text">
                    <span class="stat-value">234</span>
                    <span class="stat-label">文章</span>
                  </div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-icon categories">
                    <i class="fas fa-folder"></i>
                  </div>
                  <div class="stat-text">
                    <span class="stat-value">56</span>
                    <span class="stat-label">分类</span>
                  </div>
                </div>
                
                <div class="stat-item">
                  <div class="stat-icon views">
                    <i class="fas fa-eye"></i>
                  </div>
                  <div class="stat-text">
                    <span class="stat-value">1.2k</span>
                    <span class="stat-label">访问</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="sidebar-card hot-card animate__animated animate__fadeInUp" style="animation-delay: 0.25s">
          <div class="card-header">
            <i class="fas fa-fire"></i>
            <span>本月热门</span>
          </div>
          
          <div class="card-body">
            <div class="hot-list">
              <div 
                v-for="(article, index) in hotArticles" 
                :key="article.id"
                class="hot-item"
                @click="navigateToArticle(article.id)"
              >
                <div class="rank" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
                <div class="article">
                  <div class="title">{{ article.title }}</div>
                  <div class="views">
                    <i class="fas fa-eye"></i>
                    {{ article.views }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>
	<!-- 主体 -->
    <template #main-content>
      <div class="main-content-wrapper">

        <!-- 搜索和过滤区域 -->
      <div class="search-filter-section animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
          <div class="search-filter-header">
            <div class="search-container">
              <div class="search-wrapper">
                <div class="search-input-group">
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
                  </el-input>
                  <el-button
                    type="primary"
                    class="search-btn"
                    @click="handleSearch(searchKeyword)"
                    :icon="Search">
                    搜索
                  </el-button>
                </div>
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
                :type="activeCategory === category.id ? 'primary' : undefined"
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
      <div class="articles-section animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
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
            class="article-card animate__animated animate__fadeInUp animate__faster"
              :style="`animation-delay: ${0.3 + index * 0.05}s`"
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
              :style="`animation-delay: ${0.3 + index * 0.03}s`"
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
              :layout="paginationLayout"
              :small="isMobile"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowRight, Search, Filter, ArrowDown, Check, Grid, Menu, Document, Star, Clock, Promotion } from '@element-plus/icons-vue'
import IndexLayout from '@/components/index/v2/layout/IndexLayout.vue'

const router = useRouter()

// 响应式屏幕尺寸检测
const screenWidth = ref(window.innerWidth)
const isMobile = computed(() => screenWidth.value < 768)
const paginationLayout = computed(() => {
  if (screenWidth.value < 480) {
    return 'prev, pager, next'
  } else if (screenWidth.value < 768) {
    return 'total, prev, pager, next'
  } else {
    return 'total, sizes, prev, pager, next, jumper'
  }
})

const handleResize = () => {
  screenWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

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

const navigateToArticle = async (articleId: number) => {
  try {
    await router.push({
      path: `/blogDetail/${articleId}`,
      query: { transition: 'slide-fade' }
    })
  } catch (error) {
    console.error('路由跳转失败:', error)
    // 如果路由跳转失败，尝试直接跳转
    window.location.href = `/blogDetail/${articleId}`
  }
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
        max-width: 450px;
        
        .search-input-group {
          display: flex;
          gap: 8px;
          align-items: center;
          
          .search-input {
            flex: 1;
            
            :deep(.el-input__wrapper) {
              background: #ffffff;
              border: 1px solid #e8f4fd;
              border-radius: 6px;
              box-shadow: 0 1px 2px rgba(24, 144, 255, 0.04);
              transition: all 0.2s ease;
              height: 36px;
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
          }
          
          .search-btn {
            height: 36px;
            min-width: 60px;
            padding: 0 16px;
            font-size: 13px;
            font-weight: 500;
            border-radius: 6px;
            background: #1677ff;
            border: none;
            color: white;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            flex-shrink: 0;
            
            &:hover {
              background: #4096ff;
              transform: translateY(-1px);
              box-shadow: 0 4px 12px rgba(22, 119, 255, 0.25);
            }
            
            &:active {
              background: #0958d9;
              transform: translateY(0);
              box-shadow: 0 2px 6px rgba(22, 119, 255, 0.3);
            }
            
            &:focus {
              outline: none;
              box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
            }
            
            i {
              font-size: 14px;
              line-height: 1;
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
          .search-input-group {
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
            }
            
            .search-btn {
              background: #1677ff;
              
              &:hover {
                background: #4096ff;
                box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
              }
              
              &:active {
                background: #0958d9;
                box-shadow: 0 2px 6px rgba(22, 119, 255, 0.4);
              }
              
              &:focus {
                box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.3);
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
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      box-shadow: 
        0 1px 3px rgba(0, 0, 0, 0.03),
        0 1px 2px rgba(0, 0, 0, 0.02);
      
      &:hover {
        border-color: rgba(24, 144, 255, 0.3);
        box-shadow: 
          0 8px 24px rgba(24, 144, 255, 0.12),
          0 4px 12px rgba(0, 0, 0, 0.04);
        transform: translateY(-6px) scale(1.03);
        
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
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
      
      &:hover {
        transform: translateY(-3px) scale(1.01);
        box-shadow: 0 4px 16px rgba(24, 144, 255, 0.12);
        border-color: rgba(24, 144, 255, 0.3);
        
        .item-title {
          color: #1890ff;
        }
        
        .item-thumbnail img {
          transform: scale(1.05);
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
            transition: color 0.25s ease;
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
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
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
    
    // 移动端优化
    @media (max-width: 768px) {
      margin-top: 24px;
      padding: 0 8px;
      
      :deep(.el-pagination) {
        .el-pagination__total,
        .el-pagination__sizes,
        .el-pagination__jump {
          margin: 0 2px;
        }
        
        .el-pager {
          li {
            min-width: 28px;
            height: 28px;
            font-size: 12px;
          }
        }
        
        .btn-prev,
        .btn-next {
          min-width: 28px;
          height: 28px;
          font-size: 12px;
        }
      }
    }
    
    // 超小屏幕优化
    @media (max-width: 480px) {
      padding: 0 4px;
      
      :deep(.el-pagination) {
        .el-pager {
          li {
            min-width: 24px;
            height: 24px;
            font-size: 11px;
            margin: 0 1px;
          }
        }
        
        .btn-prev,
        .btn-next {
          min-width: 24px;
          height: 24px;
          font-size: 11px;
        }
      }
    }
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
  overflow: hidden; // 防止侧边栏出现滚动条
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

// 整齐紧凑的关于本站卡片
.about-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(147, 51, 234, 0.12);
    border-color: rgba(147, 51, 234, 0.3);
    
    .site-logo {
      transform: scale(1.1);
    }
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 15px;
    background: rgba(147, 51, 234, 0.04);
    border-bottom: 1px solid var(--el-border-color-extra-light);
    
    i {
      color: var(--el-color-primary);
      font-size: 14px;
    }
    
    span {
      font-size: 14px;
      font-weight: 700;
      color: var(--el-text-color-primary);
    }
  }
  
  .card-body {
    padding: 10px;
    
      .site-brand {
        display: flex;
        align-items: center;
        gap: 14px;
        margin-bottom: 18px;
        
        .brand-logo {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: linear-gradient(135deg, #9333ea 0%, #a855f7 50%, #7c3aed 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 
          0 4px 15px rgba(147, 51, 234, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
        flex-shrink: 0;
        
        // 稳定的发光圈效果
        &::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 15px;
          background: linear-gradient(45deg, rgba(147, 51, 234, 0.15), rgba(168, 85, 247, 0.1));
          z-index: -1;
        }
        
        &::after {
          content: '';
          position: absolute;
          inset: -6px;
          border-radius: 18px;
          background: linear-gradient(135deg, rgba(147, 51, 234, 0.08), transparent 50%, rgba(147, 51, 234, 0.05));
          z-index: -1;
        }
      }
      
      .brand-text {
        flex: 1;
        
        .brand-name {
          margin: 0 0 10px 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          
          .name-zh {
            font-size: 19px;
            font-weight: 700;
            color: var(--el-text-color-primary);
            line-height: 1.1;
            letter-spacing: 0.6px;
            
            &.glow-text {
              background: linear-gradient(135deg, #e91e63, #ec4899, #a855f7, #7c3aed);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
            }
          }
          
          .name-en {
            font-size: 11px;
            font-weight: 500;
            color: var(--el-text-color-regular);
            letter-spacing: 0.8px;
            text-transform: uppercase;
            opacity: 0.7;
          }
        }
        
        .brand-desc {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          
          .desc-text {
            font-size: 12px;
            font-weight: 400;
            color: var(--el-text-color-regular);
            line-height: 1.4;
            letter-spacing: 0.2px;
            flex: 1;
          }
          
          .status-badge {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 5px 10px;
            background: rgba(34, 197, 94, 0.08);
            border-radius: 12px;
            border: 1px solid rgba(34, 197, 94, 0.15);
            flex-shrink: 0;
            
            .status-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #22c55e;
              box-shadow: 0 0 6px rgba(34, 197, 94, 0.4);
            }
            
            .status-text {
              font-size: 10px;
              font-weight: 500;
              color: #16a34a;
              letter-spacing: 0.2px;
              white-space: nowrap;
            }
          }
        }
      }
    }
    
    .site-stats {
      margin-top: 20px;
      display: flex;
      flex-direction: column;
      
      .stats-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 12px;
        font-weight: 600;
        color: var(--el-color-primary);
        letter-spacing: 0.5px;
        margin-bottom: 12px;
        order: 1;
        
        i {
          font-size: 11px;
          opacity: 0.8;
        }
      }
      
      .stats-grid {
        display: flex;
        gap: 8px;
        order: 2;
        
        .stat-item {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          background: var(--el-fill-color-extra-light);
          border-radius: 6px;
          border: 1px solid var(--el-border-color-extra-light);
          min-width: 0;
          
          .stat-icon {
            width: 24px;
            height: 24px;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            
            i {
              font-size: 11px;
              color: white;
            }
            
            &.articles {
              background: linear-gradient(135deg, #60a5fa, #3b82f6);
            }
            
            &.categories {
              background: linear-gradient(135deg, #fbbf24, #f59e0b);
            }
            
            &.views {
              background: linear-gradient(135deg, #34d399, #10b981);
            }
          }
          
          .stat-text {
            display: flex;
            flex-direction: column;
            gap: 0px;
            min-width: 0;
            
            .stat-value {
              font-size: 14px;
              font-weight: 700;
              color: var(--el-text-color-primary);
              line-height: 1.1;
            }
            
            .stat-label {
              font-size: 9px;
              color: var(--el-text-color-secondary);
              font-weight: 500;
              opacity: 0.8;
              line-height: 1;
            }
          }
        }
      }
    }
  }
}

// 现代扮平化热门卡片
.hot-card {
  background: var(--el-bg-color);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  transition: all 0.25s ease;
  
  &:hover {
    border-color: rgba(24, 144, 255, 0.15);
    background: rgba(24, 144, 255, 0.02);
    transform: translateY(-1px);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 16px 10px;
    
    i {
      width: 20px;
      height: 20px;
      background: #ff6b6b;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
    }
    
    span {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      letter-spacing: 0.3px;
    }
  }
  
  .card-body {
    padding: 0 6px 6px;
    
    .hot-list {
      .hot-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        border-radius: 6px;
        transition: all 0.25s ease;
        cursor: pointer;
        
        &:hover {
          background: rgba(24, 144, 255, 0.04);
          transform: translateX(2px);
          
          .article .title {
            color: var(--el-color-primary);
          }
        }
        
        .rank {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          background: #d9d9d9;
          color: #666666;
          flex-shrink: 0;
          transition: all 0.25s ease;
          
          &.rank-1 {
            background: #faad14;
            color: white;
          }
          
          &.rank-2 {
            background: #52c41a;
            color: white;
          }
          
          &.rank-3 {
            background: #1890ff;
            color: white;
          }
        }
        
        .article {
          flex: 1;
          min-width: 0;
          
          .title {
            font-size: 13px;
            font-weight: 500;
            color: var(--el-text-color-primary);
            line-height: 1.4;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: color 0.25s ease;
          }
          
          .views {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            color: var(--el-text-color-secondary);
            
            i {
              color: var(--el-color-primary);
              font-size: 10px;
              opacity: 0.7;
            }
          }
        }
      }
    }
  }
  
  // 暗色模式适配
  html.dark & {
    background: #1a1a1a;
    border-color: rgba(255, 255, 255, 0.08);
    
    &:hover {
      border-color: rgba(24, 144, 255, 0.2);
      background: rgba(24, 144, 255, 0.03);
    }
    
    .hot-list {
      .hot-item {
        &:hover {
          background: rgba(24, 144, 255, 0.06);
        }
      }
    }
  }
}


// 旧样式 - 已移除
.about-site-card-old {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #1890ff 0%, #722ed1 50%, #eb2f96 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
    border-color: rgba(24, 144, 255, 0.2);
    
    &::before {
      opacity: 1;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 18px;
    border-bottom: 1px solid var(--el-border-color-extra-light);
    position: relative;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .header-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(255, 107, 142, 0.1), rgba(255, 107, 142, 0.05));
        color: #ff6b8e;
        font-size: 16px;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ff6b8e, #722ed1);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        &:hover::after {
          opacity: 0.1;
        }
      }
      
      .header-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        margin: 0;
      }
    }
    
    .header-decoration {
      display: flex;
      gap: 4px;
      
      .dot {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: var(--el-color-primary);
        opacity: 0.3;
        animation: dotPulse 2s infinite;
        
        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
  }
  
  .card-content {
    padding: 18px;
    
    .site-profile {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 20px;
      
      .avatar-wrapper {
        position: relative;
        
        .site-avatar {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          overflow: hidden;
          position: relative;
          z-index: 1;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }
        
        .avatar-border {
          position: absolute;
          inset: -3px;
          border-radius: 17px;
          background: linear-gradient(135deg, #1890ff, #722ed1, #eb2f96);
          z-index: 0;
          opacity: 0.6;
          animation: rotateBorder 8s linear infinite;
        }
      }
      
      .site-info {
        flex: 1;
        
        .site-name {
          margin: 0 0 4px 0;
          font-size: 18px;
          font-weight: 800;
          line-height: 1.2;
          
          .name-primary {
            color: var(--el-color-primary);
          }
          
          .name-secondary {
            color: #722ed1;
          }
        }
        
        .site-slogan {
          margin: 0 0 6px 0;
          font-size: 13px;
          color: var(--el-text-color-regular);
          font-style: italic;
        }
        
        .site-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 2px 8px;
          background: rgba(82, 196, 26, 0.1);
          border: 1px solid rgba(82, 196, 26, 0.2);
          border-radius: 12px;
          font-size: 11px;
          color: #52c41a;
          font-weight: 500;
          
          i {
            font-size: 10px;
          }
        }
      }
    }
    
    .divider {
      display: flex;
      align-items: center;
      margin: 16px 0;
      
      &::before,
      &::after {
        content: '';
        flex: 1;
        height: 1px;
        background: linear-gradient(90deg, transparent, var(--el-border-color-light), transparent);
      }
      
      .divider-text {
        padding: 0 12px;
        font-size: 11px;
        color: var(--el-text-color-secondary);
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.5px;
      }
    }
    
    .site-stats {
      display: flex;
      flex-direction: column;
      gap: 8px;
      
      .stat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--el-fill-color-extra-light);
        border: 1px solid var(--el-border-color-extra-light);
        border-radius: 10px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 3px;
          height: 100%;
          background: var(--el-color-primary);
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }
        
        &:hover {
          background: rgba(24, 144, 255, 0.02);
          border-color: rgba(24, 144, 255, 0.15);
          transform: translateX(3px);
          
          &::before {
            transform: scaleY(1);
          }
          
          .stat-icon {
            transform: scale(1.1);
          }
        }
        
        .stat-icon {
          width: 28px;
          height: 28px;
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          transition: all 0.3s ease;
          
          &:nth-of-type(1) {
            background: linear-gradient(135deg, rgba(24, 144, 255, 0.1), rgba(24, 144, 255, 0.05));
            color: #1890ff;
          }
        }
        
        &:nth-child(2) .stat-icon {
          background: linear-gradient(135deg, rgba(82, 196, 26, 0.1), rgba(82, 196, 26, 0.05));
          color: #52c41a;
        }
        
        &:nth-child(3) .stat-icon {
          background: linear-gradient(135deg, rgba(250, 140, 22, 0.1), rgba(250, 140, 22, 0.05));
          color: #fa8c16;
        }
        
        .stat-content {
          .stat-number {
            display: block;
            font-size: 18px;
            font-weight: 700;
            color: var(--el-text-color-primary);
            line-height: 1.2;
          }
          
          .stat-label {
            font-size: 12px;
            color: var(--el-text-color-secondary);
            font-weight: 500;
          }
        }
      }
    }
  }

  html.dark & {
    &:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
  }
}

// 重设计的本月热门（精致美化风）
.hot-articles-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff6b6b 0%, #ffa726 50%, #ff5722 100%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.06);
    border-color: rgba(255, 107, 107, 0.2);
    
    &::before {
      opacity: 1;
    }
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 18px;
    border-bottom: 1px solid var(--el-border-color-extra-light);
    position: relative;
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .header-icon {
        width: 32px;
        height: 32px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, rgba(255, 107, 107, 0.1), rgba(255, 107, 107, 0.05));
        color: #ff6b6b;
        font-size: 16px;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          inset: -2px;
          border-radius: 10px;
          background: linear-gradient(135deg, #ff6b6b, #ffa726);
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        &:hover::after {
          opacity: 0.1;
        }
      }
      
      .header-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        margin: 0;
      }
    }
    
    .trending-indicator {
      color: #52c41a;
      font-size: 14px;
      opacity: 0.7;
      animation: trendPulse 2s infinite;
    }
  }
  
  .card-content {
    padding: 8px 0;
    
    .articles-list {
      .article-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 18px;
        border-bottom: 1px solid var(--el-border-color-extra-light);
        transition: all 0.3s ease;
        position: relative;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          background: rgba(255, 107, 107, 0.02);
          transform: translateX(3px);
          
          .rank-badge {
            transform: scale(1.1) rotate(5deg);
          }
          
          .article-title {
            color: var(--el-color-primary);
          }
        }
        
        .rank-wrapper {
          position: relative;
          
          .rank-badge {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 800;
            flex-shrink: 0;
            background: var(--el-fill-color);
            color: var(--el-text-color-regular);
            transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
          }
          
          .rank-line {
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 2px;
            height: 12px;
            background: linear-gradient(180deg, var(--el-color-primary), transparent);
            opacity: 0.3;
          }
        }
        
        &.rank-1 {
          .rank-badge {
            background: linear-gradient(135deg, #ffd700, #ffb300);
            color: #fff;
            box-shadow: 0 2px 8px rgba(255, 215, 0, 0.3);
          }
        }
        
        &.rank-2 {
          .rank-badge {
            background: linear-gradient(135deg, #c0c0c0, #a8a8a8);
            color: #fff;
            box-shadow: 0 2px 8px rgba(192, 192, 192, 0.3);
          }
        }
        
        &.rank-3 {
          .rank-badge {
            background: linear-gradient(135deg, #cd7f32, #b8860b);
            color: #fff;
            box-shadow: 0 2px 8px rgba(205, 127, 50, 0.3);
          }
        }
        
        .article-content {
          flex: 1;
          min-width: 0;
          
          .article-title {
            margin: 0 0 6px 0;
            font-size: 13px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            line-height: 1.3;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: color 0.3s ease;
          }
          
          .article-meta {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .views {
              display: flex;
              align-items: center;
              gap: 4px;
              font-size: 11px;
              color: var(--el-text-color-secondary);
              
              i {
                color: var(--el-color-primary);
                opacity: 0.7;
              }
            }
            
            .trend-badge {
              padding: 2px 4px;
              border-radius: 4px;
              background: rgba(82, 196, 26, 0.1);
              color: #52c41a;
              font-size: 10px;
              
              i {
                font-size: 8px;
              }
            }
          }
        }
      }
    }
  }
  
  html.dark & {
    &:hover {
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
    }
  }
}

// 动画关键帧
@keyframes dotPulse {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.2);
  }
}

@keyframes rotateBorder {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes trendPulse {
  0%, 100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.1);
  }
}


/* 旧的浮夸样式 - 已被重构替代
.about-site-card {
  position: relative;
  background: linear-gradient(145deg, #ffffff 0%, #f8fafc 100%);
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  }
  
  // 背景装饰
  .card-background-decorator {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    pointer-events: none;
    z-index: 0;
    
    .bg-circle {
      position: absolute;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(24, 144, 255, 0.1), rgba(105, 192, 255, 0.05));
      
      &.bg-circle-1 {
        width: 60px;
        height: 60px;
        top: -20px;
        right: -20px;
        animation: floatUp 6s ease-in-out infinite;
      }
      
      &.bg-circle-2 {
        width: 40px;
        height: 40px;
        bottom: -10px;
        left: -10px;
        animation: floatMove 8s ease-in-out infinite;
        animation-delay: 2s;
      }
      
      &.bg-circle-3 {
        width: 30px;
        height: 30px;
        top: 50%;
        right: 20px;
        animation: floatUp 7s ease-in-out infinite;
        animation-delay: 4s;
      }
    }
  }
  
  .about-header {
    background: linear-gradient(135deg, #1890ff, #69c0ff);
    color: white;
    border: none;
    padding: 20px;
    position: relative;
    z-index: 1;
    
    .about-icon {
      background: rgba(255, 255, 255, 0.2);
      color: white;
      width: 40px;
      height: 40px;
      
      i {
        font-size: 18px;
        animation: pulse 2s ease-in-out infinite;
      }
    }
    
    .card-title {
      color: white;
      font-size: 18px;
      font-weight: 700;
    }
  }
  
  .about-content {
    position: relative;
    z-index: 1;
    padding: 24px;
    
    .site-info {
      margin-bottom: 24px;
      align-items: flex-start;
      
      .site-avatar-wrapper {
        position: relative;
        
        .site-avatar {
          width: 56px;
          height: 56px;
          border-radius: 16px;
          position: relative;
          box-shadow: 0 4px 16px rgba(24, 144, 255, 0.2);
          
          img {
            border-radius: 16px;
          }
          
          .avatar-glow {
            position: absolute;
            top: -2px;
            left: -2px;
            right: -2px;
            bottom: -2px;
            border-radius: 18px;
            background: linear-gradient(135deg, #1890ff, #69c0ff);
            z-index: -1;
            opacity: 0.6;
            animation: pulse 3s ease-in-out infinite;
          }
        }
        
        .avatar-status {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #52c41a;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          
          i {
            color: white;
            font-size: 10px;
          }
        }
      }
      
      .site-details {
        flex: 1;
        
        .site-name {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 6px;
          
          .name-gradient {
            background: linear-gradient(135deg, #1890ff, #69c0ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
          
          .name-accent {
            color: #fa8c16;
          }
        }
        
        .site-desc {
          color: var(--el-text-color-regular);
          font-size: 14px;
          margin-bottom: 8px;
        }
        
        .site-motto {
          font-size: 12px;
          color: #1890ff;
          font-style: italic;
          display: flex;
          align-items: center;
          gap: 6px;
          
          i {
            opacity: 0.6;
            font-size: 10px;
          }
        }
      }
    }
    
    .site-stats {
      margin-bottom: 20px;
      gap: 16px;
      
      .stat-item {
        display: flex;
        align-items: center;
        gap: 8px;
        background: linear-gradient(135deg, #f0f9ff, #e6f7ff);
        border-radius: 12px;
        padding: 12px;
        border: 1px solid #bae7ff;
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(24, 144, 255, 0.1);
        }
        
        .stat-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
        }
        
        &.stat-articles .stat-icon {
          background: linear-gradient(135deg, #1890ff, #69c0ff);
          color: white;
        }
        
        &.stat-categories .stat-icon {
          background: linear-gradient(135deg, #52c41a, #95de64);
          color: white;
        }
        
        &.stat-views .stat-icon {
          background: linear-gradient(135deg, #fa8c16, #ffc069);
          color: white;
        }
        
        .stat-info {
          text-align: left;
          
          .stat-value {
            font-size: 16px;
            font-weight: 700;
            color: var(--el-text-color-primary);
          }
          
          .stat-label {
            font-size: 11px;
            color: var(--el-text-color-secondary);
            font-weight: 500;
          }
        }
      }
    }
    
    .site-actions {
      display: flex;
      gap: 8px;
      
      .action-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 10px 16px;
        border-radius: 8px;
        cursor: pointer;
        transition: all 0.3s ease;
        font-size: 12px;
        font-weight: 600;
        
        &.primary-btn {
          background: linear-gradient(135deg, #1890ff, #40a9ff);
          color: white;
          
          &:hover {
            background: linear-gradient(135deg, #40a9ff, #69c0ff);
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
          }
        }
        
        &.secondary-btn {
          background: #f5f5f5;
          color: var(--el-text-color-primary);
          
          &:hover {
            background: #e8f4fd;
            color: #1890ff;
            transform: translateY(-1px);
          }
        }
        
        i {
          font-size: 12px;
        }
      }
    }
  }
  
  // 暗色模式适配
  html.dark & {
    background: linear-gradient(145deg, #1a1a1a 0%, #262626 100%);
    
    .about-header {
      background: linear-gradient(135deg, #177ddc, #3c9be8);
    }
    
    .site-brand {
      .brand-text {
        .brand-name {
          .name-zh.glow-text {
            background: linear-gradient(135deg, #f472b6, #e879f9, #c084fc, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        }
        
        .brand-desc {
          .status-badge {
            background: rgba(34, 197, 94, 0.12);
            border-color: rgba(34, 197, 94, 0.25);
            
            .status-text {
              color: #4ade80;
            }
          }
        }
      }
      
      .site-stats {
        .stats-grid {
          .stat-item {
            background: #1a1a1a;
            border-color: #303030;
          }
        }
      }
    }
    
    .about-content {
      .site-stats {
        .stat-item {
          background: linear-gradient(135deg, #1a1a1a, #262626);
          border-color: #303030;
          
          .stat-info {
            .stat-value {
              color: rgba(255, 255, 255, 0.9);
            }
          }
        }
      }
      
      .site-actions {
        .secondary-btn {
          background: #262626;
          color: rgba(255, 255, 255, 0.8);
          
          &:hover {
            background: #1a2332;
            color: #3c9be8;
          }
        }
      }
    }
  }
}

// 基础动画保留
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.05);
  }
}

*/
</style>
