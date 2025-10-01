<template>
  <IndexLayout class="index-v2-container">
    <template #left-sidebar>
      <div class="sidebar-content">
        <!-- 关于本站卡片组件 -->
        <AboutSiteCard />
        <!-- 本月热门文章组件 - 使用FeaturedArticlesCard -->
        <FeaturedArticlesCard
          title="本月热门" 
          header-icon="fas fa-fire" 
          :articles="monthlyHotArticles" 
          :page-size="2"
          :show-pagination="true" 
          @article-click="handleArticleClick" 
          @load-more="handleLoadMore" 
        />
      </div>
    </template>
    <!-- 顶部固定区域 -->
    <template #main-content-top>
      <!-- 搜索和过滤区域组件 -->
      <SearchFilterSection :search-keyword="searchKeyword" :active-filter="activeFilter"
        :active-category="activeCategory" :view-mode="viewMode" :grid-columns="gridColumns"
        :total-articles="totalArticles" :categories="categoryList" :is-loading="isLoading"
        @search="handleSearch" @filter-change="handleFilterChange"
        @category-change="handleCategoryChange" @view-mode-change="handleViewModeChange" />
    </template>

    <!-- 主体内容 -->
    <template #main-content>
      <!-- 文章列表组件 -->
      <ArticleList :articles="allArticles" :search-keyword="searchKeyword" :active-filter="activeFilter"
        :active-category="activeCategory" :view-mode="viewMode" :grid-columns="gridColumns" :is-loading="isLoading" />
    </template>

    <!-- 右侧边栏 -->
    <template #right-sidebar>
      <div class="right-sidebar-content">
        <!-- 网站公告 -->
        <NoticeCard title="网站公告" :notices="noticeList" :loading="noticeLoading" :page-size="3" :show-pagination="true"
          @notice-click="handleNoticeClick" />
        <!-- 精选文章推荐 -->
        <FeaturedArticlesCard title="热门推荐" header-icon="fas fa-fire" :articles="featuredArticles" :page-size="2"
          :show-pagination="true" @article-click="handleArticleClick" @load-more="handleLoadMore" />
      </div>
    </template>
      <!-- 中间区域 -->
       
  </IndexLayout>

</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'
import { getArticleListR } from '@/request/article'
import { getCategoryListR } from '@/request/category'

// 定义类型接口
interface Article {
  id: number
  title: string
  subtitle?: string
  content?: string
  cover_image?: string
  author_id?: number
  category_id?: number
  is_top?: number
  is_recommend?: number
  is_original?: number
  favorites_count?: number
  likes_count?: number
  comments_count?: number
  read_time?: number
  word_count?: number
  publish_time?: string
  description?: string
  category?: {
    id: number
    name: string
    slug: string
  }
  author?: {
    id: number
    username: string
    nickname?: string
    avatar?: string
    signature?: string
    memberClass?: string
    roles?: any[]
  }
  tags?: Array<{
    id: number
    name: string
  }>
}

interface Category {
  id: number
  name: string
  slug?: string
  description?: string
  parent_id?: number
  icon?: string
  count?: number
  created_at?: string
  updated_at?: string
}

interface ArticleParams {
  page: number
  page_size: number
  category_id?: number
  author_id?: number
  title?: string
  start_date?: string
  end_date?: string
  sort?: string
  order?: string
  is_recommend?: number
  is_top?: number
}

import IndexLayout from '@/components/index/v2/layout/IndexLayout.vue'
import AboutSiteCard from '@/components/index/v2/AboutSiteCard.vue'
import NoticeCard from '@/components/index/v2/NoticeCard.vue'
import SearchFilterSection from '@/components/index/v2/SearchFilterSection.vue'
import ArticleList from '@/components/index/v2/ArticleList.vue'
// 右侧栏组件
import HotTagsCard from '@/components/index/v2/HotTagsCard.vue'
import FeaturedArticlesCard from '@/components/index/v2/FeaturedArticlesCard.vue'
import PromotionCard from '@/components/blog/BlogDetail/PromotionCard.vue'

// 本地存储相关常量
const STORAGE_KEY_VIEW_MODE = 'article-view-mode'
const STORAGE_KEY_GRID_COLUMNS = 'article-grid-columns'

// 加载本地存储的设置
const loadViewMode = (): 'card' | 'list' => {
  const saved = localStorage.getItem(STORAGE_KEY_VIEW_MODE)
  return (saved === 'list' || saved === 'card') ? saved : 'card'
}

const loadGridColumns = (): number => {
  const saved = localStorage.getItem(STORAGE_KEY_GRID_COLUMNS)
  return saved ? parseInt(saved, 10) : 2
}

// 保存到本地存储
const saveViewMode = (mode: 'card' | 'list') => {
  localStorage.setItem(STORAGE_KEY_VIEW_MODE, mode)
}

const saveGridColumns = (columns: number) => {
  localStorage.setItem(STORAGE_KEY_GRID_COLUMNS, columns.toString())
}

// 路由
const router = useRouter()

// API 相关的响应式数据
const isLoading = ref(false)
const isCategoryLoading = ref(false)
const categoryList = ref<Category[]>([])
const serverArticles = ref<Article[]>([])
const totalServerArticles = ref(0)

// 文章请求参数
const articleParams = ref<ArticleParams>({
  page: 1,
  page_size: 20,
  category_id: undefined,
  author_id: undefined,
  title: undefined,
  start_date: undefined,
  end_date: undefined,
  sort: undefined,
  order: undefined
})

// 响应式数据 - 从本地存储加载初始值
const searchKeyword = ref('')
const activeFilter = ref('all')
const activeCategory = ref(0)
const viewMode = ref<'card' | 'list'>(loadViewMode())
const gridColumns = ref(loadGridColumns())
// 计算文章总数
const totalArticles = computed(() => totalServerArticles.value || allArticles.value.length)

// 公告数据
const noticeLoading = ref(false)
const noticeList = ref([
  {
    id: 1,
    type: 'important',
    title: '网站升级完成',
    content: '新增了搜索功能和评论系统，提升用户体验',
    date: '2024-01-15',
    isNew: true
  },
  {
    id: 2,
    type: 'activity',
    title: '新年活动开启',
    content: '参与评论互动，有机会获得精美礼品',
    date: '2024-01-10'
  },
  {
    id: 3,
    type: 'maintenance',
    title: '系统维护通知',
    content: '1月20日凌晨2-4点进行系统维护，期间可能无法访问',
    date: '2024-01-08'
  },
  {
    id: 4,
    type: 'update',
    title: '版本更新说明',
    content: 'V2.1.0 版本新增了多个实用功能，优化了用户界面',
    date: '2024-01-05'
  },
  {
    id: 5,
    type: 'info',
    title: '用户手册更新',
    content: '用户手册已更新，新增了更多使用技巧和案例',
    date: '2024-01-03'
  },
  {
    id: 6,
    type: 'activity',
    title: '年终总结活动',
    content: '分享你的学习成果，参与年终总结活动赢大奖',
    date: '2023-12-30'
  }
])

// 精选文章数据
const featuredArticles = ref([
  {
    id: 1,
    title: 'Vue 3 Composition API 最佳实践指南',
    excerpt: '深入解析 Vue 3 的 Composition API，从基础到高级的实际应用技巧。',
    cover: 'https://picsum.photos/300/180?random=101',
    category: 'Vue.js',
    date: '2024-01-15',
    views: 12580,
    likes: 892,
    comments: 156,
    isHot: true,
    isNew: false,
    isTrending: false,
    readProgress: 85
  },
  {
    id: 2,
    title: 'React 18 并发渲染原理剖析',
    excerpt: '全面分析 React 18 的并发渲染机制，揭示其内部工作原理。',
    cover: 'https://picsum.photos/300/180?random=102',
    category: 'React',
    date: '2024-01-12',
    views: 9876,
    likes: 654,
    comments: 89,
    isHot: false,
    isNew: true,
    isTrending: false,
    readProgress: 65
  },
  {
    id: 3,
    title: 'TypeScript 4.9 新特性详解',
    excerpt: '详细介绍 TypeScript 4.9 版本的新特性和改进，提升开发效率。',
    cover: 'https://picsum.photos/300/180?random=103',
    category: 'TypeScript',
    date: '2024-01-10',
    views: 7845,
    likes: 432,
    comments: 67,
    isHot: false,
    isNew: false,
    isTrending: true,
    readProgress: 45
  },
  {
    id: 4,
    title: '前端性能优化实战技巧',
    excerpt: '从代码分割到懒加载，全面提升前端应用的性能表现。',
    cover: 'https://picsum.photos/300/180?random=104',
    category: '性能优化',
    date: '2024-01-08',
    views: 15632,
    likes: 1203,
    comments: 234,
    isHot: true,
    isNew: false,
    isTrending: true,
    readProgress: 92
  },
  {
    id: 5,
    title: 'Vite 4.0 构建工具全面指南',
    excerpt: '深入探索 Vite 4.0 的各种特性和优化技巧，打造高效开发流程。',
    cover: 'https://picsum.photos/300/180?random=105',
    category: '前端工程化',
    date: '2024-01-05',
    views: 6754,
    likes: 398,
    comments: 52,
    isHot: false,
    isNew: true,
    isTrending: false,
    readProgress: 38
  },
  {
    id: 6,
    title: 'CSS Grid 布局完全指南',
    excerpt: '从基础语法到高级技巧，全面掌握 CSS Grid 布局。',
    cover: 'https://picsum.photos/300/180?random=106',
    category: 'CSS',
    date: '2024-01-03',
    views: 5432,
    likes: 287,
    comments: 34,
    isHot: false,
    isNew: false,
    isTrending: false,
    readProgress: 72
  },
  {
    id: 7,
    title: 'Node.js 微服务架构实践',
    excerpt: '详细介绍如何使用 Node.js 构建微服务架构。',
    cover: 'https://picsum.photos/300/180?random=107',
    category: 'Node.js',
    date: '2024-01-01',
    views: 4321,
    likes: 198,
    comments: 23,
    isHot: false,
    isNew: false,
    isTrending: false,
    readProgress: 56
  },
  {
    id: 8,
    title: 'JavaScript ES2024 新特性',
    excerpt: '探索 JavaScript 最新的 ES2024 特性和用法。',
    cover: 'https://picsum.photos/300/180?random=108',
    category: 'JavaScript',
    date: '2023-12-28',
    views: 3876,
    likes: 156,
    comments: 18,
    isHot: false,
    isNew: false,
    isTrending: false,
    readProgress: 41
  }
])

// 本月热门文章数据
const monthlyHotArticles = ref([
  {
    id: 101,
    title: 'Vue 3 Composition API 完全指南：从入门到精通',
    excerpt: '深入解析 Vue 3 的 Composition API，从基础到高级的实际应用技巧。',
    cover: 'https://picsum.photos/300/180?random=201',
    category: 'Vue.js',
    date: '2024-01-20',
    views: 18500,
    likes: 1250,
    comments: 285,
    isHot: true,
    isNew: false,
    isTrending: true
  },
  {
    id: 102,
    title: 'TypeScript 高级类型实战技巧大全',
    excerpt: '探索 TypeScript 的高级特性，提升代码的类型安全和开发效率。',
    cover: 'https://picsum.photos/300/180?random=202',
    category: 'TypeScript',
    date: '2024-01-18',
    views: 16200,
    likes: 980,
    comments: 156,
    isHot: true,
    isNew: true,
    isTrending: false
  },
  {
    id: 103,
    title: '前端性能优化实战技巧大全',
    excerpt: '从代码分割到懒加载，全面提升前端应用的性能表现。',
    cover: 'https://picsum.photos/300/180?random=203',
    category: '性能优化',
    date: '2024-01-16',
    views: 14800,
    likes: 876,
    comments: 198,
    isHot: false,
    isNew: false,
    isTrending: true
  },
  {
    id: 104,
    title: 'Vite 构建工具深度解析与优化',
    excerpt: '全面介绍 Vite 的核心原理和高级用法，包括模块热更新、插件系统等。',
    cover: 'https://picsum.photos/300/180?random=204',
    category: '构建工具',
    date: '2024-01-14',
    views: 12600,
    likes: 654,
    comments: 89,
    isHot: false,
    isNew: true,
    isTrending: false
  },
  {
    id: 105,
    title: 'React 18 并发渲染原理剖析',
    excerpt: '全面分析 React 18 的并发渲染机制，揭示其内部工作原理。',
    cover: 'https://picsum.photos/300/180?random=205',
    category: 'React',
    date: '2024-01-12',
    views: 11400,
    likes: 589,
    comments: 67,
    isHot: false,
    isNew: false,
    isTrending: false
  },
  {
    id: 106,
    title: 'Webpack 5 构建优化实践',
    excerpt: '深入分析 Webpack 5 的新特性和性能优化方法，提升构建速度。',
    cover: 'https://picsum.photos/300/180?random=206',
    category: '构建工具',
    date: '2024-01-10',
    views: 9800,
    likes: 445,
    comments: 52,
    isHot: false,
    isNew: false,
    isTrending: false
  }
])

// 真实文章数据 - 从 API 获取
const allArticles = ref<Article[]>([])

// API 调用函数
// 获取文章数据
const initArticleData = async (params: ArticleParams): Promise<void> => {
  try {
    isLoading.value = true

    const res = await getArticleListR(params)

    // 根据新的API响应格式解析数据
    const apiRes = res as unknown as {
      code: number
      msg: string
      data: {
        list: any[]
        pagination: {
          total: number
          current: number
          page_size: number
          pages: number
        }
      }
    }

    if (apiRes && apiRes.code === 200) {
      // 将后台数据转换为前端格式
      const transformedArticles = apiRes.data.list.map(article => {
        return {
          ...article,
          // 保持原有的前端格式，同时映射后台字段
          excerpt: article.content || article.description || article.subtitle || '',
          cover: article.cover_image || '',
          author: {
            id: article.author?.id || 0,
            name: article.author?.username || article.author?.nickname || '匿名用户',
            avatar: article.author?.avatar || '',
            isVip: article.author?.roles?.some((role: any) => role.name.includes('会员')) || false
          },
          publishTime: article.publish_time || '',
          views: article.word_count || 0,
          likes: article.likes_count || 0,
          comments: article.comments_count || 0,
          tags: article.tags?.map((tag: any) => tag.name) || [],
          category: article.category_id || 0,
          isTop: article.is_top === 1,
          isRecommended: article.is_recommend === 1,
          isOriginal: article.is_original === 1,
          isHot: (article.likes_count > 100) || (article.favorites_count > 10)
        }
      })
      
      allArticles.value = transformedArticles
      serverArticles.value = apiRes.data.list
      totalServerArticles.value = apiRes.data.pagination.total || 0
    } else {
      message.error(apiRes?.msg || '获取文章列表失败')
      allArticles.value = []
    }
  } catch (error) {
    console.error('获取文章列表出错:', error)
    message.error('获取文章列表出错')
    allArticles.value = []
  } finally {
    isLoading.value = false
  }
}

// 获取分类数据
const initCategoryData = async (): Promise<void> => {
  try {
    isCategoryLoading.value = true
    const res = await getCategoryListR({})

    // 根据新的API响应格式解析数据
    const apiRes = res as unknown as {
      code: number
      msg: string
      data: {
        list: any[]
        pagination: {
          total: number
          current: number
          page_size: number
        }
      }
    }

    if (apiRes && apiRes.code === 200) {
      // 添加"全部文章"选项
      const allCategory: Category = {
        id: 0,
        name: '全部文章',
        icon: 'fas fa-th-large',
        count: apiRes.data.pagination.total || 0
      }

      // 确保每个分类有图标，如果没有则设置默认图标
      const processedCategories = apiRes.data.list.map(category => {
        if (!category.icon) {
          // 根据分类ID选择一个图标
          const icons = [
            'fas fa-code',
            'fas fa-server',
            'fas fa-mobile-alt',
            'fas fa-database',
            'fas fa-wrench',
            'fas fa-sitemap',
            'fas fa-robot',
            'fas fa-laptop-code',
            'fas fa-project-diagram'
          ]
          category.icon = icons[category.id % icons.length]
        }
        return category
      })

      // 将全部分类选项放在最前面
      categoryList.value = [allCategory, ...processedCategories]
    } else {
      message.error(apiRes?.msg || '获取分类列表失败')
    }
  } catch (error) {
    console.error('获取分类列表出错:', error)
    message.error('获取分类列表出错')
  } finally {
    isCategoryLoading.value = false
  }
}

// 事件处理函数
const handleSearch = (query: string) => {
  searchKeyword.value = query
  // 更新API参数
  articleParams.value.title = query || undefined
  articleParams.value.page = 1
  initArticleData(articleParams.value)
  if (query) {
    message.info(`搜索: ${query}`)
  }
}

const handleFilterChange = (filterValue: string) => {
  activeFilter.value = filterValue
  // 根据筛选类型设置参数
  articleParams.value.page = 1
  
  switch (filterValue) {
    case 'all':
      delete articleParams.value.is_recommend
      delete articleParams.value.is_top
      break
    case 'recommended':
      articleParams.value.is_recommend = 1
      delete articleParams.value.is_top
      break
    case 'latest':
      delete articleParams.value.is_recommend
      delete articleParams.value.is_top
      articleParams.value.sort = 'publish_time'
      articleParams.value.order = 'desc'
      break
    case 'popular':
      delete articleParams.value.is_recommend
      articleParams.value.is_top = 1
      break
  }
  
  initArticleData(articleParams.value)
  console.log(`筛选: ${filterValue}`)
}

const handleCategoryChange = (categoryId: number) => {
  activeCategory.value = categoryId
  // 设置分类ID参数
  articleParams.value.category_id = categoryId === 0 ? undefined : categoryId
  articleParams.value.page = 1
  initArticleData(articleParams.value)
  
  const categoryName = categoryList.value.find(cat => cat.id === categoryId)?.name || '全部'
  console.log(`分类切换: ${categoryName}`)
}

const handleViewModeChange = (mode: 'card' | 'list', columns?: number) => {
  viewMode.value = mode
  saveViewMode(mode) // 保存视图模式
  
  if (columns) {
    gridColumns.value = columns
    saveGridColumns(columns) // 保存网格列数
  }
  
  console.log('布局变更:', mode, columns, '已保存到本地')
}

// 精选文章点击处理
const handleArticleClick = (article: any) => {
  console.log('精选文章被点击', article)
  // 跳转到文章详情页
  router.push({
    path: `/blogDetail/${article.id}`,
    query: { transition: 'slide-fade' }
  })
}

// 加载更多处理
const handleLoadMore = () => {
  console.log('加载更多文章')
  // 这里可以添加加载更多数据的逻辑
  // 例如：发起 API 请求加载更多数据
}

// 公告点击处理
const handleNoticeClick = (notice: any) => {
  console.log('公告被点击', notice)
  // 这里可以添加跳转逻辑
  // 例如：$router.push(`/notice/${notice.id}`)
}

// 推广卡片点击处理
const handlePromotionClick = (event: MouseEvent) => {
  console.log('推广卡片被点击', event)
  // 这里可以添加跳转逻辑或统计代码
  // 例如：window.open('https://example.com/promotion', '_blank')
}

// 组件挂载时的初始化
onMounted(async () => {
  // 输出初始化信息，便于调试
  console.log('初始化布局设置:', {
    viewMode: viewMode.value,
    gridColumns: gridColumns.value
  })
  
  // 初始化数据
  try {
    // 先获取分类数据
    await initCategoryData()
    // 再获取文章数据
    await initArticleData(articleParams.value)
    
    console.log('数据初始化完成')
  } catch (error) {
    console.error('数据初始化失败:', error)
  }
})
</script>

<style lang="less" scoped>
// 侧边栏内容布局
.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

// 右侧边栏内容布局
.right-sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
