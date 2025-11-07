<template>
  <!-- 浮动搜索筛选栏 -->
  <div class="floating-search-filter" :class="{ 'scrolled': isScrolled }">
    <!-- 集成式搜索栏 -->
    <div class="integrated-header">
      <div class="header-main">
        <div class="section-info">
          <div class="section-title">
            <i class="fas fa-book title-icon"></i>
            <span>共 {{ totalArticles }} 篇</span>
          </div>
        </div>

        <div class="header-controls">
          <!-- 布局切换 -->
          <div class="layout-toggle">
            <button 
              class="toggle-btn" 
              :class="{ 'active': viewMode === 'list' }"
              @click="handleViewModeChange('list')"
              title="列表视图"
            >
              <i class="fas fa-bars"></i>
            </button>
            <button 
              class="toggle-btn" 
              :class="{ 'active': viewMode === 'card' && gridColumns === 2 }"
              @click="handleViewModeChange('card', 2)"
              title="双列卡片"
            >
              <i class="fas fa-th-large"></i>
            </button>
            <button 
              class="toggle-btn" 
              :class="{ 'active': viewMode === 'card' && gridColumns === 3 }"
              @click="handleViewModeChange('card', 3)"
              title="三列卡片"
            >
              <i class="fas fa-th"></i>
            </button>
          </div>

          <!-- 搜索触发按钮 -->
          <div 
            class="search-trigger" 
            @click="togglePanel" 
            @mouseenter="handleMouseEnter"
            @mouseleave="handleTriggerMouseLeave"
            :class="{ 'expanded': isPanelOpen }"
          >
            <i class="fas fa-search search-icon"></i>
            <span class="search-text">
              <span class="desktop-text">搜索筛选</span>
              <span class="mobile-text">搜索</span>
            </span>
            <i class="fas fa-chevron-down expand-icon" :class="{ 'rotated': isPanelOpen }"></i>
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
            <div class="search-input-wrapper">
              <i class="fas fa-search input-icon"></i>
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="输入关键词搜索..." 
                class="search-input"
                @keyup.enter="handleSearch(searchKeyword)"
                ref="searchInputRef"
              />
              <button 
                v-if="searchKeyword" 
                class="clear-btn" 
                @click="searchKeyword = ''"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
            <button class="search-btn" @click="handleSearch(searchKeyword)">
              搜索
            </button>
          </div>
        </div>

        <!-- 筛选行 -->
        <div class="filter-row">
          <div class="filter-section">
            <span class="section-label">类型</span>
            <div class="filter-tags">
              <button 
                v-for="item in filterOptions" 
                :key="item.value"
                :class="['filter-tag', { 'active': activeFilter === item.value }]"
                @click="handleFilterChange(item.value)"
              >
                <i :class="item.icon" class="tag-icon"></i>
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
              <button 
                v-for="category in categories.slice(0, isMobile ? 6 : 8)" 
                :key="category.id"
                :class="['category-tag', { 'active': activeCategory === category.id }]"
                @click="handleCategoryChange(category.id)"
              >
                <i :class="getCategoryIcon(category)" class="tag-icon"></i>
                <span>{{ category.name }}</span>
                <em v-if="category.count" class="tag-count">{{ category.count }}</em>
              </button>
            </div>
          </div>
        </div>

        <!-- 底部操作 -->
        <div class="actions-row">
          <button class="reset-btn" @click="handleReset">
            <i class="fas fa-redo-alt"></i>
            <span>重置</span>
          </button>
          <button class="close-btn" @click="closePanel">
            <span>收起</span>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, onMounted, onUnmounted, watch } from 'vue'

// 定义分类类型
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

// Props
interface Props {
  searchKeyword?: string
  activeFilter?: string
  activeCategory?: number
  viewMode?: 'card' | 'list'
  gridColumns?: number
  totalArticles?: number
  categories?: Category[]
  isLoading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  searchKeyword: '',
  activeFilter: 'all',
  activeCategory: 0,
  viewMode: 'card',
  gridColumns: 2,
  totalArticles: 0,
  categories: () => [],
  isLoading: false
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
const searchInputRef = ref<HTMLInputElement | null>(null)
const isScrolled = ref(false)

// 过滤选项
const filterOptions = [
  { value: 'all', label: '全部文章', icon: 'fas fa-th-large' },
  { value: 'recommended', label: '推荐', icon: 'fas fa-star' },
  { value: 'latest', label: '最新', icon: 'fas fa-clock' },
  { value: 'popular', label: '热门', icon: 'fas fa-fire' }
]

// 分类数据 - 使用从父组件传入的真实数据
const categories = computed(() => props.categories)

// 获取分类图标
const getCategoryIcon = (category: Category): string => {
  if (category.icon) {
    return category.icon
  }
  
  // 如果没有图标，根据分类ID使用默认图标
  const defaultIcons = [
    'fas fa-th-large',
    'fas fa-code',
    'fas fa-server',
    'fas fa-database',
    'fas fa-tools',
    'fas fa-sitemap',
    'fas fa-rocket',
    'fas fa-laptop-code',
    'fas fa-project-diagram'
  ]
  
  return defaultIcons[(category.id || 0) % defaultIcons.length]
}

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

// 鼠标悬停逻辑
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

// 重置处理
const handleReset = () => {
  searchKeyword.value = ''
  activeFilter.value = 'all'
  activeCategory.value = 0

  // 发出重置事件
  emit('search', '')
  emit('filterChange', 'all')
  emit('categoryChange', 0)
}

// 移动端检测
const windowWidth = ref(window.innerWidth)
const isMobile = computed(() => windowWidth.value <= 768)

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

// 滚动检测
const handleScroll = () => {
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

<style scoped lang="less">
// 引入全局主题变量
@import '@/assets/style/theme.less';

/* 紫色渐变主题变量 - 与捐赠界面保持一致 */
@theme-primary: @theme-purple-primary;
@theme-secondary: @theme-purple-secondary;
@theme-light-3: @theme-purple-light-3;
@theme-light-5: @theme-purple-light-5;
@theme-light-7: @theme-purple-light-7;
@theme-light-9: @theme-purple-light-9;

/* 浮动搜索筛选栏 */
.floating-search-filter {
  position: sticky;
  top: 0;
  z-index: 998;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border-bottom: 1px solid transparent;
  box-shadow: 0 6px 20px var(--theme-orange-border-2);
  
  &.scrolled {
    border-bottom-color: var(--theme-orange-border-2);
    box-shadow: 0 8px 28px var(--theme-orange-shadow);
  }
  
  @media (max-width: 768px) {
    box-shadow: 0 4px 16px var(--theme-orange-border-2);
    
    &.scrolled {
      box-shadow: 0 6px 22px var(--theme-orange-shadow);
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
      gap: 7px;
      padding: 6px 12px;
      height: 36px;
      background: var(--theme-orange-bg-2);
      border-radius: 8px;
      transition: all 0.25s ease;

      @media (max-width: 768px) {
        padding: 5px 10px;
        height: 32px;
      }

      &:hover {
        background: var(--theme-orange-bg-3);
      }

      .title-icon {
        font-size: 14px;
        background: linear-gradient(135deg, @theme-primary, @theme-secondary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;

        @media (max-width: 768px) {
          font-size: 13px;
        }
      }
      
      span {
        font-size: 13px;
        background: linear-gradient(135deg, @theme-primary, @theme-secondary);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        font-weight: 600;
        line-height: 1;

        @media (max-width: 768px) {
          font-size: 12px;
        }
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
    display: flex;
    gap: 3px;
    background: var(--theme-orange-bg-2);
    padding: 3px;
    border-radius: 8px;
    height: 36px;
    
    .toggle-btn {
      width: 30px;
      height: 30px;
      border: none;
      background: transparent;
      cursor: pointer;
      border-radius: 5px;
      transition: all 0.25s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #777;
      
      i {
        font-size: 13px;
      }

      @media (max-width: 768px) {
        width: 28px;
        height: 28px;
        
        i {
          font-size: 12px;
        }
      }

      &:hover {
        background: var(--theme-orange-bg-3);
        color: @theme-primary;
      }

      &.active {
        background: linear-gradient(135deg, @theme-primary, @theme-secondary);
        color: white;
        box-shadow: 0 2px 8px var(--theme-orange-shadow);
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
  padding: 0 14px;
  background: var(--theme-orange-bg-2);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  min-width: 150px;

  @media (max-width: 768px) {
    height: 32px;
    min-width: 140px;
    padding: 0 10px;
  }

  &:hover {
    background: linear-gradient(135deg, var(--theme-orange-bg-1), var(--theme-orange-bg-2));
    border-color: @theme-light-5;
    box-shadow: 0 4px 12px var(--theme-orange-shadow);
    transform: translateY(-1px);

    .search-icon {
      color: @theme-primary;
    }
  }

  &.expanded {
    background: linear-gradient(135deg, var(--theme-orange-bg-2), var(--theme-orange-bg-3));
    border-color: @theme-primary;
    box-shadow: 0 4px 16px var(--theme-orange-shadow), 0 0 0 3px var(--theme-orange-bg-2);

    .search-icon {
      color: @theme-primary;
    }

    .search-text {
      color: @theme-primary;
      font-weight: 600;
    }
  }

  .search-icon {
    font-size: 16px;
    color: #999;
    transition: color 0.3s ease;

    @media (max-width: 768px) {
      font-size: 14px;
    }
  }

  .search-text {
    flex: 1;
    font-size: 13px;
    color: #666;
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
    color: #999;
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

/* 展开面板 */
.search-panel {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  border-radius: 0 0 10px 10px;
  padding: 14px;
  box-shadow: 0 8px 24px var(--theme-orange-shadow);
  pointer-events: auto;
  backdrop-filter: blur(12px);
  z-index: 1001;
  
  @media (max-width: 768px) {
    padding: 12px;
    margin: 0 -4px;
    border-radius: 0 0 8px 8px;
    box-shadow: 0 6px 20px var(--theme-orange-border-3);
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

/* 搜索行 */
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

.search-input-wrapper {
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  
  .input-icon {
    position: absolute;
    left: 12px;
    color: #999;
    font-size: 15px;
    pointer-events: none;
    
    @media (max-width: 768px) {
      font-size: 14px;
      left: 10px;
    }
  }
  
  .search-input {
    width: 100%;
    height: 38px;
    padding: 0 40px 0 38px;
    border: 1.5px solid var(--theme-orange-border-2);
    border-radius: 8px;
    font-size: 13px;
    outline: none;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    background: white;
    box-shadow: 0 1px 4px var(--theme-orange-bg-3);
    
    @media (max-width: 768px) {
      height: 34px;
      border-radius: 5px;
      padding: 0 35px 0 34px;
      font-size: 12px;
    }
    
    &::placeholder {
      color: #bbb;
    }
    
    &:hover {
      border-color: @theme-light-5;
      box-shadow: 0 2px 8px var(--theme-orange-border-2);
    }
    
    &:focus {
      border-color: @theme-primary;
      box-shadow: 0 0 0 3px var(--theme-orange-bg-3), 0 2px 8px var(--theme-orange-shadow);
    }
  }
  
  .clear-btn {
    position: absolute;
    right: 8px;
    width: 24px;
    height: 24px;
    border: none;
    background: var(--theme-orange-border-2);
    color: @theme-primary;
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    
    @media (max-width: 768px) {
      width: 20px;
      height: 20px;
      right: 6px;
    }
    
    i {
      font-size: 10px;
    }
    
    &:hover {
      background: var(--theme-orange-border-3);
      transform: scale(1.1);
    }
  }
}

.search-btn {
  height: 38px;
  padding: 0 18px;
  border: none;
  border-radius: 8px;
  background: linear-gradient(135deg, @theme-primary, @theme-secondary);
  color: white;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px var(--theme-orange-shadow);

  @media (max-width: 768px) {
    height: 34px;
    padding: 0 12px;
    font-size: 12px;
    border-radius: 5px;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px var(--theme-orange-shadow);
  }
  
  &:active {
    transform: translateY(0);
  }
}

/* 筛选行与分类行 */
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
  color: #666;
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
  background: var(--theme-orange-bg-2);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 12px;
  color: #666;
  white-space: nowrap;
  line-height: 1;
  font-weight: 500;
  box-shadow: none;

  @media (max-width: 768px) {
    height: 26px;
    padding: 3px 8px;
    font-size: 11px;
    border-radius: 5px;
    gap: 3px;
  }
  
  &:hover {
    background: linear-gradient(135deg, var(--theme-orange-bg-3), var(--theme-orange-border-2));
    color: @theme-primary;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--theme-orange-shadow);
  }
  
  &.active {
    background: linear-gradient(135deg, @theme-primary, @theme-secondary);
    color: white;
    box-shadow: 0 3px 12px var(--theme-orange-shadow), 0 1px 4px var(--theme-orange-shadow);
    transform: translateY(-1px);
  }
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

/* 操作行 */
.actions-row {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  padding-top: 10px;
  border-top: 1px solid var(--theme-orange-border-2);
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
  height: 34px;
  padding: 0 14px;
  border-radius: 8px;
  font-weight: 500;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;

  @media (max-width: 768px) {
    height: 30px;
    padding: 0 10px;
    font-size: 11px;
    gap: 3px;
    border-radius: 5px;
  }
  
  i {
    font-size: 12px;
  }
}

.reset-btn {
  background: var(--theme-orange-bg-2);
  color: @theme-primary;
  
  &:hover {
    background: var(--theme-orange-bg-3);
    transform: translateY(-1px);
  }
}

.close-btn {
  background: linear-gradient(135deg, @theme-primary, @theme-secondary);
  color: white;
  box-shadow: 0 2px 8px var(--theme-orange-shadow);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px var(--theme-orange-shadow);
  }
  
  &:active {
    transform: translateY(0);
  }
}

/* 移动端适配 */
@media (max-width: 768px) {
  .integrated-header {
    .section-info {
      .section-title {
        span:first-child {
          display: none;
        }
      }
    }
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

/* 深色模式适配 */
html.dark {
  .floating-search-filter {
    background: rgba(30, 30, 30, 0.95);
    
    &.scrolled {
      border-bottom-color: rgba(167, 139, 250, 0.15);
      box-shadow: 0 8px 28px rgba(0, 0, 0, 0.3);
    }
  }
  
  // 使用深色模式的紫色变量
  .section-title {
    background: rgba(167, 139, 250, 0.12) !important;
    
    &:hover {
      background: rgba(167, 139, 250, 0.18) !important;
    }
    
    .title-icon,
    span {
      background: linear-gradient(135deg, @theme-purple-primary-dark, @theme-purple-secondary-dark) !important;
      -webkit-background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      background-clip: text !important;
    }
  }
  
  .layout-toggle {
    background: rgba(167, 139, 250, 0.12) !important;
    
    .toggle-btn {
      color: #aaa;
      
      &:hover {
        background: rgba(167, 139, 250, 0.2) !important;
        color: @theme-purple-primary-dark;
      }
      
      &.active {
        background: linear-gradient(135deg, @theme-purple-primary-dark, @theme-purple-secondary-dark) !important;
      }
    }
  }
  
  .search-trigger {
    background: rgba(167, 139, 250, 0.12) !important;
    color: #ccc;
    
    .search-icon,
    .expand-icon {
      color: #aaa;
    }
    
    &:hover {
      background: rgba(167, 139, 250, 0.18) !important;
      
      .search-icon {
        color: @theme-purple-primary-dark;
      }
    }
    
    &.expanded {
      background: rgba(167, 139, 250, 0.2) !important;
      border-color: @theme-purple-primary-dark;
      
      .search-icon {
        color: @theme-purple-primary-dark;
      }
      
      .search-text {
        color: @theme-purple-primary-dark;
      }
    }
  }
  
  .search-panel {
    background: rgba(30, 30, 30, 0.98);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
  }
  
  .search-input {
    background: rgba(50, 50, 50, 0.8) !important;
    border-color: rgba(167, 139, 250, 0.3) !important;
    color: #ddd !important;
    
    &::placeholder {
      color: #777 !important;
    }
    
    &:focus {
      border-color: @theme-purple-primary-dark !important;
      box-shadow: 0 0 0 3px rgba(167, 139, 250, 0.15), 0 2px 8px rgba(167, 139, 250, 0.2) !important;
    }
  }
  
  .search-btn {
    background: linear-gradient(135deg, @theme-purple-primary-dark, @theme-purple-secondary-dark) !important;
  }
  
  .filter-tag,
  .category-tag {
    background: rgba(167, 139, 250, 0.1) !important;
    border-color: rgba(167, 139, 250, 0.2) !important;
    color: #bbb !important;
    
    &:hover {
      background: rgba(167, 139, 250, 0.18) !important;
      color: @theme-purple-primary-dark !important;
    }
    
    &.active {
      background: linear-gradient(135deg, @theme-purple-primary-dark, @theme-purple-secondary-dark) !important;
      color: white !important;
    }
  }
  
  .reset-btn {
    background: rgba(167, 139, 250, 0.12) !important;
    color: @theme-purple-primary-dark !important;
    
    &:hover {
      background: rgba(167, 139, 250, 0.2) !important;
    }
  }
  
  .close-btn {
    background: linear-gradient(135deg, @theme-purple-primary-dark, @theme-purple-secondary-dark) !important;
  }
}
</style>
