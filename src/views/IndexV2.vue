<template>
  <IndexLayout class="index-v2-container">
    <template #left-sidebar>
      <div class="sidebar-content">
        <!-- 关于本站卡片组件 -->
        <AboutSiteCard />
        <!-- 本月热门文章组件 -->
        <MonthlyHotArticles />
      </div>
    </template>
    <!-- 顶部固定区域 -->
    <template #main-content-top>
      <!-- 搜索和过滤区域组件 -->
      <SearchFilterSection :search-keyword="searchKeyword" :active-filter="activeFilter"
        :active-category="activeCategory" :view-mode="viewMode" :grid-columns="gridColumns"
        :total-articles="totalArticles" @search="handleSearch" @filter-change="handleFilterChange"
        @category-change="handleCategoryChange" @view-mode-change="handleViewModeChange" />
    </template>

    <!-- 主体内容 -->
    <template #main-content>
      <!-- 文章列表组件 -->
      <ArticleList :articles="allArticles" :search-keyword="searchKeyword" :active-filter="activeFilter"
        :active-category="activeCategory" :view-mode="viewMode" :grid-columns="gridColumns" />
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
        <!-- 精选推广卡片 -->
        <PromotionCard type="standard" title="前端开发者必备工具集" description="包含50+精选开发工具，提升10倍工作效率，限时优惠中！"
          image-url="https://picsum.photos/300/200" image-alt="推广图片" :radius="false" badge-text="精选"
          badge-icon="fas fa-crown" button-text="立即购买" :show-overlay="true" overlay-text="立即查看" :show-price="true"
          current-price="￥199" original-price="￥399" @click="handlePromotionClick" />
      </div>
    </template>
  </IndexLayout>

</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import IndexLayout from '@/components/index/v2/layout/IndexLayout.vue'
import AboutSiteCard from '@/components/index/v2/AboutSiteCard.vue'
import NoticeCard from '@/components/index/v2/NoticeCard.vue'
import MonthlyHotArticles from '@/components/index/v2/MonthlyHotArticles.vue'
import SearchFilterSection from '@/components/index/v2/SearchFilterSection.vue'
import ArticleList from '@/components/index/v2/ArticleList.vue'
// 右侧栏组件
import HotTagsCard from '@/components/index/v2/HotTagsCard.vue'
import FeaturedArticlesCard from '@/components/index/v2/FeaturedArticlesCard.vue'
import PromotionCard from '@/components/blog/BlogDetail/PromotionCard.vue'

// 响应式数据
const searchKeyword = ref('')
const activeFilter = ref('all')
const activeCategory = ref(0)
const viewMode = ref<'card' | 'list'>('card')
const gridColumns = ref(2)
// 计算文章总数
const totalArticles = computed(() => allArticles.value.length)

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

// 丰富的文章数据
const allArticles = ref([
  {
    id: 1,
    title: 'Vue 3 + TypeScript 项目实战指南：从零到一构建现代化前端应用',
    excerpt: '深入探索 Vue 3 的 Composition API、TypeScript 集成、Vite 构建工具，以及现代化的项目架构设计最佳实践。',
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
    excerpt: '详细介绍 React 18 的革命性新特性，包括并发渲染、自动批处理、Suspense 改进等。',
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
    excerpt: '全面讲解 JavaScript 性能优化的各个方面，包括内存管理、事件循环、DOM 操作等。',
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
    excerpt: '从基础语法到高级技巧，全面掌握 CSS Grid 布局。包括网格线定义、区域命名等。',
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
    excerpt: '详细介绍如何使用 Node.js 构建微服务架构，包括服务切分、API 网关等关键技术。',
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
    excerpt: '深入分析 Webpack 5 的新特性和性能优化方法，包括模块联邦、持久化缓存等高级技巧。',
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
  },
  {
    id: 7,
    title: 'Docker 容器化部署完全指南：从开发到生产',
    excerpt: '全面介绍 Docker 在前端项目中的应用，包括镜像构建、容器编排、CI/CD 集成等实战技巧。',
    cover: 'https://picsum.photos/400/240?random=7',
    author: {
      id: 7,
      name: 'DevOps 工程师',
      avatar: 'https://picsum.photos/40/40?random=107',
      isVip: true
    },
    publishTime: '2024-01-02',
    views: 1654,
    likes: 112,
    comments: 14,
    tags: ['Docker', '容器化', 'DevOps'],
    category: 8,
    isTop: false,
    isRecommended: false,
    isOriginal: true,
    isHot: false
  },
  {
    id: 8,
    title: 'GraphQL 与 REST API 对比：选择最适合的数据获取方式',
    excerpt: '深入对比 GraphQL 和 REST API 的优缺点，帮助开发者选择最适合的数据获取方案。',
    cover: 'https://picsum.photos/400/240?random=8',
    author: {
      id: 8,
      name: 'API 设计师',
      avatar: 'https://picsum.photos/40/40?random=108',
      isVip: false
    },
    publishTime: '2024-01-01',
    views: 1342,
    likes: 89,
    comments: 11,
    tags: ['GraphQL', 'REST API', '后端开发'],
    category: 9,
    isTop: false,
    isRecommended: false,
    isOriginal: true,
    isHot: false
  },
  {
    id: 9,
    title: 'MongoDB 与 MySQL 选择指南：数据库架构设计实践',
    excerpt: '全面分析 NoSQL 和关系型数据库的适用场景，帮助开发者做出明智的数据库选择。',
    cover: 'https://picsum.photos/400/240?random=9',
    author: {
      id: 9,
      name: '数据库架构师',
      avatar: 'https://picsum.photos/40/40?random=109',
      isVip: true
    },
    publishTime: '2023-12-30',
    views: 987,
    likes: 67,
    comments: 9,
    tags: ['MongoDB', 'MySQL', '数据库设计'],
    category: 10,
    isTop: false,
    isRecommended: true,
    isOriginal: false,
    isHot: false
  },
  {
    id: 10,
    title: 'PWA 渐进式Web应用开发：构建类原生体验',
    excerpt: '详细介绍 PWA 技术栈，包括 Service Worker、Web App Manifest、推送通知等关键技术。',
    cover: 'https://picsum.photos/400/240?random=10',
    author: {
      id: 10,
      name: 'PWA 专家',
      avatar: 'https://picsum.photos/40/40?random=110',
      isVip: false
    },
    publishTime: '2023-12-28',
    views: 1876,
    likes: 134,
    comments: 18,
    tags: ['PWA', 'Service Worker', '移动开发'],
    category: 11,
    isTop: false,
    isRecommended: false,
    isOriginal: true,
    isHot: true
  },
  {
    id: 11,
    title: 'Vite 构建工具深度解析：下一代前端开发体验',
    excerpt: '探索 Vite 的核心原理和高级用法，包括模块热更新、插件系统、构建优化等关键特性。',
    cover: 'https://picsum.photos/400/240?random=11',
    author: {
      id: 11,
      name: 'Vite 开发者',
      avatar: 'https://picsum.photos/40/40?random=111',
      isVip: true
    },
    publishTime: '2023-12-25',
    views: 2341,
    likes: 178,
    comments: 24,
    tags: ['Vite', '构建工具', '模块化'],
    category: 12,
    isTop: false,
    isRecommended: true,
    isOriginal: true,
    isHot: true
  },
  {
    id: 12,
    title: 'Web 组件库设计最佳实践：从 API 设计到性能优化',
    excerpt: '全面介绍 Web 组件库的设计原则和实现技巧，包括 API 设计、性能优化、文档维护等关键方面。',
    cover: 'https://picsum.photos/400/240?random=12',
    author: {
      id: 12,
      name: '组件库作者',
      avatar: 'https://picsum.photos/40/40?random=112',
      isVip: false
    },
    publishTime: '2023-12-22',
    views: 1567,
    likes: 95,
    comments: 13,
    tags: ['组件库', 'API 设计', '性能优化'],
    category: 13,
    isTop: false,
    isRecommended: false,
    isOriginal: false,
    isHot: false
  }
])

// 事件处理函数
const handleSearch = (query: string) => {
  searchKeyword.value = query
}

const handleFilterChange = (filterValue: string) => {
  activeFilter.value = filterValue
}

const handleCategoryChange = (categoryId: number) => {
  activeCategory.value = categoryId
}

const handleViewModeChange = (mode: 'card' | 'list', columns?: number) => {
  viewMode.value = mode
  if (columns) {
    gridColumns.value = columns
  }
  console.log('布局变更:', mode, columns)
}

// 精选文章点击处理
const handleArticleClick = (article: any) => {
  console.log('精选文章被点击', article)
  // 这里可以添加跳转逻辑
  // 例如：$router.push(`/article/${article.id}`)
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
