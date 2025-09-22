<template>
  <!-- 浮动搜索筛选栏 -->
  <div class="floating-search-filter" :class="{ 'scrolled': isScrolled }">
    <!-- 集成式搜索栏 -->
    <div class="integrated-header">
      <div class="header-main">
        <div class="section-info">
          <div class="section-title">
            <el-icon class="title-icon">
              <Grid />
            </el-icon>
            <span>最新文章</span>
          </div>
          <div class="article-count" v-if="totalArticles > 0">
            共 {{ totalArticles }} 篇
          </div>
        </div>

        <div class="header-controls">
          <!-- 布局切换 -->
          <div class="layout-toggle">
            <el-button-group size="small">
              <el-button :type="viewMode === 'list' ? 'primary' : 'default'" @click="handleViewModeChange('list')"
                :icon="Menu" />
              <el-button :type="viewMode === 'card' && gridColumns === 2 ? 'primary' : 'default'"
                @click="handleViewModeChange('card', 2)">
                <el-icon>
                  <Grid />
                </el-icon>
              </el-button>
              <el-button :type="viewMode === 'card' && gridColumns === 3 ? 'primary' : 'default'"
                @click="handleViewModeChange('card', 3)">
                <el-icon>
                  <Operation />
                </el-icon>
              </el-button>
            </el-button-group>
          </div>

          <!-- 搜索触发按钮 -->
          <div 
            class="search-trigger" 
            @click="togglePanel" 
            @mouseenter="handleMouseEnter"
            @mouseleave="handleTriggerMouseLeave"
            :class="{ 'expanded': isPanelOpen }"
          >
            <el-icon class="search-icon">
              <Search />
            </el-icon>
            <span class="search-text">
              <span class="desktop-text">搜索筛选文章</span>
              <span class="mobile-text">搜索筛选</span>
            </span>
            <el-icon class="expand-icon" :class="{ 'rotated': isPanelOpen }">
              <ArrowDown />
            </el-icon>
          </div>
        </div>
      </div>
    </div>

    <!-- 展开面板 -->
    <Transition name="slide-down">
      <div 
        v-if="isPanelOpen" 
        class="search-panel"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
      >
        <!-- 搜索行 -->
        <div class="search-row">
          <div class="search-wrapper">
            <el-input v-model="searchKeyword" placeholder="输入关键词搜索..." size="default" class="search-input"
              @keyup.enter="handleSearch(searchKeyword)" clearable ref="searchInputRef">
              <template #prefix>
                <el-icon class="input-icon">
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-button type="primary" @click="handleSearch(searchKeyword)" class="search-btn">
              搜索
            </el-button>
          </div>
        </div>

        <!-- 筛选行 -->
        <div class="filter-row">
          <div class="filter-section">
            <span class="section-label">类型</span>
            <div class="filter-tags">
              <button v-for="item in filterOptions" :key="item.value"
                :class="['filter-tag', { 'active': activeFilter === item.value }]"
                @click="handleFilterChange(item.value)">
                <el-icon class="tag-icon">
                  <component :is="item.icon" />
                </el-icon>
                <span>{{ item.label }}</span>
              </button>
            </div>
          </div>
        </div>

        <!-- 分类行 -->
        <div class="category-row">
          <div class="category-section">
            <span class="section-label">分类</span>
            <div class="category-tags">
              <button v-for="category in categories.slice(0, isMobile ? 6 : 8)" :key="category.id"
                :class="['category-tag', { 'active': activeCategory === category.id }]"
                @click="handleCategoryChange(category.id)">
                <i :class="category.icon" class="tag-icon"></i>
                <span>{{ category.name }}</span>
                <em v-if="category.count" class="tag-count">{{ category.count }}</em>
              </button>
            </div>
          </div>
        </div>

        <!-- 底部操作 -->
        <div class="actions-row">
          <el-button size="small" @click="handleReset" class="reset-btn">
            <el-icon>
              <RefreshLeft />
            </el-icon>
            <span>重置</span>
          </el-button>
          <el-button size="small" type="primary" @click="closePanel" class="close-btn">
            <span>收起</span>
          </el-button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onUnmounted, watch } from 'vue'
import { Search, Star, Clock, TrendCharts, Grid, Filter, Collection, Close, RefreshLeft, Check, ArrowDown, Menu, Operation } from '@element-plus/icons-vue'

// Props
interface Props {
  searchKeyword?: string
  activeFilter?: string
  activeCategory?: number
  viewMode?: 'card' | 'list'
  gridColumns?: number
  totalArticles?: number
}

const props = withDefaults(defineProps<Props>(), {
  searchKeyword: '',
  activeFilter: 'all',
  activeCategory: 0,
  viewMode: 'card',
  gridColumns: 2,
  totalArticles: 0
})

// Emits
const emit = defineEmits<{
  search: [query: string]
  filterChange: [filter: string]
  categoryChange: [categoryId: number]
  viewModeChange: [mode: 'card' | 'list', columns?: number]
}>()

// 响应式数据
const searchKeyword = ref(props.searchKeyword)
const activeFilter = ref(props.activeFilter)
const activeCategory = ref(props.activeCategory)
const viewMode = ref(props.viewMode)
const gridColumns = ref(props.gridColumns)
const totalArticles = ref(props.totalArticles)

// 面板状态
const isPanelOpen = ref(false)
const searchInputRef = ref(null)
const isScrolled = ref(false)

// 过滤选项
const filterOptions = [
  { value: 'all', label: '全部文章', icon: Grid },
  { value: 'recommended', label: '推荐', icon: Star },
  { value: 'latest', label: '最新', icon: Clock },
  { value: 'popular', label: '热门', icon: TrendCharts }
]

// 分类数据
const categories = ref([
  { id: 0, name: '全部', icon: 'fas fa-th-large', count: null },
  { id: 1, name: '前端开发', icon: 'fab fa-js-square', count: 45 },
  { id: 2, name: '后端技术', icon: 'fas fa-server', count: 32 },
  { id: 3, name: '数据库', icon: 'fas fa-database', count: 18 },
  { id: 4, name: '开发工具', icon: 'fas fa-tools', count: 24 },
  { id: 5, name: '算法', icon: 'fas fa-code', count: 15 },
  { id: 6, name: '架构设计', icon: 'fas fa-sitemap', count: 12 },
  { id: 7, name: '性能优化', icon: 'fas fa-rocket', count: 8 }
])

// 面板控制函数
const togglePanel = async () => {
  isPanelOpen.value = !isPanelOpen.value

  if (isPanelOpen.value) {
    // 面板打开后自动聚焦搜索框
    await nextTick()
    searchInputRef.value?.focus()
  }
}

const closePanel = () => {
  isPanelOpen.value = false
}

// 鼠标悬停逼辑
let mouseLeaveTimer: NodeJS.Timeout | null = null

// 鼠标进入触发按钮或面板
const handleMouseEnter = () => {
  if (mouseLeaveTimer) {
    clearTimeout(mouseLeaveTimer)
    mouseLeaveTimer = null
  }
}

// 鼠标离开触发按钮
const handleTriggerMouseLeave = () => {
  if (isPanelOpen.value) {
    mouseLeaveTimer = setTimeout(() => {
      closePanel()
    }, 300)
  }
}

// 鼠标离开面板
const handleMouseLeave = () => {
  mouseLeaveTimer = setTimeout(() => {
    closePanel()
  }, 300)
}

// 事件处理函数
const handleSearch = (query: string) => {
  emit('search', query)
  // 搜索后保持面板开启，方便用户进一步筛选
}

const handleFilterChange = (filterValue: string) => {
  activeFilter.value = filterValue
  emit('filterChange', filterValue)
}

const handleCategoryChange = (categoryId: number) => {
  activeCategory.value = categoryId
  emit('categoryChange', categoryId)
}

// 布局切换处理
const handleViewModeChange = (mode: 'card' | 'list', columns?: number) => {
  viewMode.value = mode
  if (columns) {
    gridColumns.value = columns
  }
  emit('viewModeChange', mode, columns)
}

// 新增的事件处理
const handleReset = () => {
  searchKeyword.value = ''
  activeFilter.value = 'all'
  activeCategory.value = 0

  // 发出重置事件
  emit('search', '')
  emit('filterChange', 'all')
  emit('categoryChange', 0)
}

const handleApply = () => {
  // 应用当前的所有筛选条件
  emit('search', searchKeyword.value)
  emit('filterChange', activeFilter.value)
  emit('categoryChange', activeCategory.value)
  closePanel()
}

// 移动端检测
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value <= 768)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// 滚动检测
const handleScroll = () => {
  // 获取父容器的滚动位置
  const container = document.querySelector('.main-content-body')
  if (container) {
    isScrolled.value = container.scrollTop > 10
  }
}

onMounted(() => {
  window.addEventListener('resize', handleResize)

  // 监听主容器的滚动事件
  const container = document.querySelector('.main-content-body')
  if (container) {
    container.addEventListener('scroll', handleScroll)
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  
  const container = document.querySelector('.main-content-body')
  if (container) {
    container.removeEventListener('scroll', handleScroll)
  }
  
  // 清理定时器
  if (mouseLeaveTimer) {
    clearTimeout(mouseLeaveTimer)
  }
})

// 监听props变化，同步更新响应式数据
watch(() => props.viewMode, (newValue) => {
  viewMode.value = newValue
}, { immediate: true })

watch(() => props.gridColumns, (newValue) => {
  gridColumns.value = newValue
}, { immediate: true })

watch(() => props.totalArticles, (newValue) => {
  totalArticles.value = newValue
}, { immediate: true })

</script>

<style scoped>
/* ==== 紧凑搜索筛选栏样式 ==== */
.floating-search-filter {
  position: sticky;
  top: 0;
  z-index: 998;
  background: var(--el-bg-color);
  backdrop-filter: blur(20px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-bottom: 1px solid transparent;

  /* 默认就有阴影，表明固定性质 */
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.10);
  
  /* 滚动时增强视觉反馈 */
  &.scrolled {
    border-bottom-color: var(--el-border-color-light);
    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.15);
  }
  
  /* 移动端适配 */
  @media (max-width: 768px) {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.10);
    
    &.scrolled {
      box-shadow: 0 6px 22px rgba(0, 0, 0, 0.15);
    }
  }
}

/* 集成式搜索头部 */
.integrated-header {
  padding: 20px 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }

  .header-main {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;
    }
  }

  .section-info {
    display: flex;
    align-items: center;
    gap: 12px;

    .section-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);

      @media (max-width: 768px) {
        font-size: 16px;
      }

      .title-icon {
        font-size: 20px;
        color: var(--el-color-primary);

        @media (max-width: 768px) {
          font-size: 18px;
        }
      }
    }

    .article-count {
      padding: 4px 12px;
      background: var(--el-fill-color-light);
      border-radius: 20px;
      font-size: 12px;
      color: var(--el-text-color-regular);
      font-weight: 500;

      @media (max-width: 768px) {
        font-size: 11px;
        padding: 3px 10px;
      }
    }
  }

  .header-controls {
    display: flex;
    align-items: center;
    gap: 12px;

    @media (max-width: 768px) {
      width: 100%;
      justify-content: space-between;
    }
  }

  .layout-toggle {
    :deep(.el-button-group) {
      .el-button {
        height: 36px;
        width: 36px;
        padding: 0;

        @media (max-width: 768px) {
          height: 32px;
          width: 32px;
        }
      }
    }
  }
}

/* 搜索触发按钮 */
.search-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 36px;
  padding: 0 12px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 180px;

  @media (max-width: 768px) {
    height: 32px;
    min-width: 140px;
    padding: 0 10px;
  }

  &:hover {
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary-light-7);

    .search-icon {
      color: var(--el-color-primary);
    }
  }

  &.expanded {
    background: var(--el-color-primary-light-9);
    border-color: var(--el-color-primary);

    .search-icon {
      color: var(--el-color-primary);
    }

    .search-text {
      color: var(--el-color-primary);
    }
  }

  .search-icon {
    font-size: 16px;
    color: var(--el-text-color-regular);
    transition: color 0.3s ease;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

  .search-text {
    flex: 1;
    font-size: 13px;
    color: var(--el-text-color-regular);
    font-weight: 500;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    
    @media (max-width: 768px) {
      font-size: 12px;
    }
    
    .mobile-text {
      display: none;
      
      @media (max-width: 768px) {
        display: inline;
      }
    }
    
    .desktop-text {
      display: inline;
      
      @media (max-width: 768px) {
        display: none;
      }
    }
  }

  .expand-icon {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    transition: transform 0.3s ease;
    flex-shrink: 0;

    @media (max-width: 768px) {
      font-size: 12px;
    }

    &.rotated {
      transform: rotate(180deg);
    }
  }
}

/* 展开面板 - 小巧精致设计 */
.search-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: var(--el-bg-color);
  border-radius: 0 0 10px 10px;
  padding: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  pointer-events: auto;
  backdrop-filter: blur(12px);
  z-index: 1001;
  
  @media (max-width: 768px) {
    padding: 12px;
    margin: 0 -4px;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  }
}

/* 滑下动画 */
.slide-down-enter-active {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
}

.slide-down-leave-active {
  transition: all 0.25s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* 搜索行 - 紧凑设计 */
.search-row {
  margin-bottom: 12px;

  @media (max-width: 768px) {
    margin-bottom: 10px;
  }
}

.search-wrapper {
  display: flex;
  gap: 6px;
  align-items: center;

  @media (max-width: 768px) {
    gap: 4px;
  }
}

.search-input {
  flex: 1;
}

.search-input :deep(.el-input__wrapper) {
  height: 36px;
  border-radius: 6px;
  border: 1px solid var(--el-border-color);
  transition: all 0.2s ease;

  @media (max-width: 768px) {
    height: 34px;
    border-radius: 5px;
  }
}

.search-input :deep(.el-input__wrapper):hover {
  border-color: var(--el-color-primary-light-7);
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: var(--el-color-primary);
  box-shadow: 0 0 0 2px var(--el-color-primary-light-8);
}

.input-icon {
  font-size: 15px;
  color: var(--el-text-color-placeholder);

  @media (max-width: 768px) {
    font-size: 14px;
  }
}

.search-btn {
  height: 36px;
  padding: 0 16px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 13px;

  @media (max-width: 768px) {
    height: 34px;
    padding: 0 12px;
    font-size: 12px;
    border-radius: 5px;
  }
}

/* 筛选行 - 紧凑适配移动端 */
.filter-row,
.category-row {
  margin-bottom: 10px;

  @media (max-width: 768px) {
    margin-bottom: 8px;
  }
}

.filter-section,
.category-section {
  display: flex;
  align-items: flex-start;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 6px;
    align-items: center;
  }
}

.section-label {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  font-weight: 600;
  white-space: nowrap;
  padding-top: 6px;
  min-width: 32px;
  text-align: right;

  @media (max-width: 768px) {
    font-size: 11px;
    min-width: 28px;
    padding-top: 4px;
  }
}

.filter-tags,
.category-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  flex: 1;

  @media (max-width: 768px) {
    gap: 4px;
  }
}

.filter-tag,
.category-tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 4px 10px;
  height: 28px;
  background: var(--el-fill-color-light);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 12px;
  color: var(--el-text-color-regular);
  white-space: nowrap;
  line-height: 1;
  font-weight: 500;

  @media (max-width: 768px) {
    height: 26px;
    padding: 3px 8px;
    font-size: 11px;
    border-radius: 5px;
    gap: 3px;
  }
}

.filter-tag:hover,
.category-tag:hover {
  background: var(--el-color-primary-light-9);
  border-color: var(--el-color-primary-light-7);
  color: var(--el-color-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
}

.filter-tag.active,
.category-tag.active {
  background: var(--el-color-primary);
  border-color: var(--el-color-primary);
  color: white;
  box-shadow: 0 2px 8px var(--el-color-primary-light-5);
}

.tag-icon {
  font-size: 12px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    font-size: 11px;
  }
}

.tag-count {
  background: rgba(255, 255, 255, 0.25);
  color: inherit;
  padding: 1px 4px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: 600;
  font-style: normal;
  min-width: 14px;
  text-align: center;
  line-height: 1.2;
  margin-left: 2px;

  @media (max-width: 768px) {
    font-size: 9px;
    padding: 1px 3px;
    min-width: 12px;
    border-radius: 6px;
  }
}

.category-tag.active .tag-count {
  background: rgba(255, 255, 255, 0.3);
}

/* 操作行 - 紧凑设计 */
.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--el-border-color-lighter);
  margin-top: 6px;

  @media (max-width: 768px) {
    gap: 6px;
    padding-top: 8px;
    margin-top: 4px;
  }
}

.reset-btn,
.close-btn {
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
  padding: 0 12px;
  border-radius: 6px;
  font-weight: 500;
  font-size: 12px;

  @media (max-width: 768px) {
    height: 30px;
    padding: 0 10px;
    font-size: 11px;
    gap: 3px;
    border-radius: 5px;
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .integrated-header {
    .section-info {
      .section-title {
        span {
          display: none;
          /* 移动端隐藏标题文本 */
        }
      }
    }
  }

  .search-text {
    font-size: 13px;
  }

  .search-panel {
    padding: 12px;
  }

  .search-wrapper {
    flex-direction: column;
    gap: 8px;
  }

  .search-btn {
    width: 100%;
    height: 36px;
  }

  .filter-tags,
  .category-tags {
    gap: 6px;
  }

  .filter-tag,
  .category-tag {
    padding: 4px 10px;
    height: 28px;
    font-size: 12px;
  }

  .section-label {
    min-width: 32px;
    font-size: 12px;
    padding-top: 6px;
  }

  .actions-row {
    flex-direction: column;
    gap: 8px;
  }

  .reset-btn,
  .close-btn {
    width: 100%;
    height: 36px;
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .integrated-header {
    padding: 12px;
  }

  .search-trigger {
    height: 30px;
    min-width: 120px;
    padding: 0 8px;
  }

  .search-text {
    font-size: 11px;
  }

  .search-panel {
    padding: 10px;
  }

  .filter-tags,
  .category-tags {
    gap: 4px;
  }

  .filter-tag,
  .category-tag {
    padding: 3px 8px;
    height: 26px;
    font-size: 11px;
  }

  .section-label {
    min-width: 28px;
    font-size: 11px;
  }

  .search-input :deep(.el-input__wrapper),
  .search-btn {
    height: 36px;
  }
}

/* 暗黑主题适配 */
.dark .floating-search-filter {
  background: var(--el-bg-color);
  border-bottom-color: var(--el-border-color-darker);

  &.scrolled {
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3);
  }
}

.dark .integrated-header {
  .section-info {
    .article-count {
      background: var(--el-fill-color-darker);
      color: var(--el-text-color-regular);
    }
  }
}

.dark .search-trigger {
  background: var(--el-fill-color-darker);
  border-color: var(--el-border-color-darker);

  &:hover {
    background: var(--el-fill-color-dark);
  }

  &.expanded {
    background: var(--el-color-primary-light-8);
    border-color: var(--el-color-primary);
  }
}

.dark .filter-tag:hover,
.dark .category-tag:hover {
  background: var(--el-fill-color);
}

.dark .search-panel {
  background: var(--el-bg-color-page);
  backdrop-filter: blur(12px);
}
</style>
