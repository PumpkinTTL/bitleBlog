<template>
  <IndexLayout class="index-v2-container">
<template #left-sidebar>
      <div class="sidebar-content">
        <!-- 关于本站卡片组件 -->
        <AboutSiteCard />
        <!-- 网站公告组件 -->
        <NoticeCard />
        <!-- 本月热门文章组件 -->
        <MonthlyHotArticles />
      </div>
    </template>
    <!-- 主体 -->
    <template #main-content>
      <div class="main-content-wrapper">
        <!-- 搜索和过滤区域组件 -->
        <SearchFilterSection :search-keyword="searchKeyword" :active-filter="activeFilter"
          :active-category="activeCategory" @search="handleSearch" @filter-change="handleFilterChange"
          @category-change="handleCategoryChange" />

        <!-- 文章列表组件 -->
        <ArticleList :articles="allArticles" :search-keyword="searchKeyword" :active-filter="activeFilter"
          :active-category="activeCategory" />

      </div>
    </template>
  </IndexLayout>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import IndexLayout from '@/components/index/v2/layout/IndexLayout.vue'
import AboutSiteCard from '@/components/index/v2/AboutSiteCard.vue'
import NoticeCard from '@/components/index/v2/NoticeCard.vue'
import MonthlyHotArticles from '@/components/index/v2/MonthlyHotArticles.vue'
import SearchFilterSection from '@/components/index/v2/SearchFilterSection.vue'
import ArticleList from '@/components/index/v2/ArticleList.vue'

// 响应式数据
const searchKeyword = ref('')
const activeFilter = ref('all')
const activeCategory = ref(0)

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
</script>

<style lang="less" scoped>
// 确保主内容区域与其他页面保持一致的版心设计
.main-content-wrapper {
  width: 100%;
  min-height: 100vh;
}

// 侧边栏内容布局
.sidebar-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
