<template>
  <div class="search-filter-example">
    <!-- 使用重新设计的搜索筛选组件 -->
    <SearchFilterSection
      :search-keyword="searchKeyword"
      :active-filter="activeFilter" 
      :active-category="activeCategory"
      :view-mode="viewMode"
      :grid-columns="gridColumns"
      :total-articles="totalArticles"
      @search="handleSearch"
      @filter-change="handleFilterChange"
      @category-change="handleCategoryChange"
      @view-mode-change="handleViewModeChange"
    />
    
    <!-- 这里可以放置文章列表 -->
    <div class="articles-content">
      <!-- 文章列表内容 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SearchFilterSection from './SearchFilterSection.vue'

// 搜索筛选相关状态
const searchKeyword = ref('')
const activeFilter = ref('all')
const activeCategory = ref(0)
const viewMode = ref<'card' | 'list'>('card')
const gridColumns = ref(2)
const totalArticles = ref(150) // 示例文章总数

// 事件处理
const handleSearch = (query: string) => {
  searchKeyword.value = query
  console.log('搜索:', query)
}

const handleFilterChange = (filter: string) => {
  activeFilter.value = filter
  console.log('筛选变更:', filter)
}

const handleCategoryChange = (categoryId: number) => {
  activeCategory.value = categoryId
  console.log('分类变更:', categoryId)
}

const handleViewModeChange = (mode: 'card' | 'list', columns?: number) => {
  viewMode.value = mode
  if (columns) {
    gridColumns.value = columns
  }
  console.log('布局变更:', mode, columns)
}
</script>

<style scoped>
.search-filter-example {
  /* 确保容器有正确的布局 */
}

.articles-content {
  /* 文章列表区域样式 */
  padding: 20px 0;
}
</style>
