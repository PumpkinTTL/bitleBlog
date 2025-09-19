<template>
  <div class="search-filter-section animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
    <!-- 搜索区域 -->
    <div class="search-section">
      <div class="search-input-wrapper">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索文章标题、内容或标签..." 
          size="large" 
          class="search-input"
          @keyup.enter="handleSearch(searchKeyword)" 
          clearable
        >
          <template #prefix>
            <el-icon class="input-search-icon">
              <Search />
            </el-icon>
          </template>
        </el-input>
        <el-button 
          type="primary" 
          class="search-btn" 
          @click="handleSearch(searchKeyword)"
        >
          <el-icon class="btn-icon">
            <Search />
          </el-icon>
          <span class="btn-text">搜索</span>
        </el-button>
      </div>
    </div>

    <!-- 过滤器区域 -->
    <div class="filter-section">
      <div class="section-title">
        <el-icon class="title-icon">
          <Filter />
        </el-icon>
        <span>筛选条件</span>
      </div>
      
      <div class="filter-buttons">
        <button 
          v-for="item in filterOptions" 
          :key="item.value"
          :class="['filter-btn', { 'active': activeFilter === item.value }]"
          @click="handleFilterChange(item.value)"
        >
          <el-icon class="btn-icon">
            <component :is="item.icon" />
          </el-icon>
          <span class="btn-label">{{ item.label }}</span>
        </button>
      </div>
    </div>

    <!-- 分类标签区域 -->
    <div class="category-section">
      <div class="section-title">
        <el-icon class="title-icon">
          <Collection />
        </el-icon>
        <span>文章分类</span>
      </div>
      
      <div class="category-tags">
        <button 
          v-for="(category, index) in categories" 
          :key="category.id"
          :class="['category-tag', 
                   `category-${index}`, 
                   { 'active': activeCategory === category.id }]"
          @click="handleCategoryChange(category.id)"
        >
          <i :class="category.icon" class="tag-icon"></i>
          <span class="tag-name">{{ category.name }}</span>
          <span v-if="category.count" class="tag-count">{{ category.count }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Star, Clock, TrendCharts, Grid, Filter, Collection } from '@element-plus/icons-vue'

// Props
interface Props {
  searchKeyword?: string
  activeFilter?: string
  activeCategory?: number
}

const props = withDefaults(defineProps<Props>(), {
  searchKeyword: '',
  activeFilter: 'all',
  activeCategory: 0
})

// Emits
const emit = defineEmits<{
  search: [query: string]
  filterChange: [filter: string]
  categoryChange: [categoryId: number]
}>()

// 响应式数据
const searchKeyword = ref(props.searchKeyword)
const activeFilter = ref(props.activeFilter)
const activeCategory = ref(props.activeCategory)

// 过滤选项
const filterOptions = ref([
  { value: 'all', label: '全部文章', icon: Grid },
  { value: 'recommended', label: '推荐', icon: Star },
  { value: 'latest', label: '最新', icon: Clock },
  { value: 'popular', label: '热门', icon: TrendCharts }
])

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
</script>

<style lang="less" scoped>
// 紧凑克制的搜索过滤区域（统一配色，弱化阴影/线条/圆角）
.search-filter-section {
  margin-bottom: 16px;
  background: linear-gradient(135deg, var(--el-bg-color) 0%, var(--el-fill-color-extra-light) 100%);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  padding: 14px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: radial-gradient(ellipse at top center, rgba(var(--el-color-primary-rgb), 0.02) 0%, transparent 50%);
    opacity: 0;
    transition: opacity 0.4s ease;
    pointer-events: none;
  }

  &:hover {
    border-color: var(--el-border-color);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
    
    &::before {
      opacity: 1;
    }
  }

  // 搜索区域
  .search-section {
    margin-bottom: 12px;

    .search-input-wrapper {
      display: flex;
      gap: 8px;
      align-items: stretch;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 10px;
      }

      :deep(.search-input) {
        flex: 1;

        .el-input__wrapper {
          height: 34px;
          border-radius: 4px;
          background: var(--el-fill-color-blank);
          border: 1px solid var(--el-border-color);
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.02);
          transition: all 0.3s ease;

          &:hover {
            border-color: var(--el-border-color-darker);
            background: var(--el-fill-color-light);
          }

          &.is-focus {
            border-color: var(--el-color-primary);
            background: var(--el-bg-color);
            box-shadow: 0 0 0 2px rgba(var(--el-color-primary-rgb), 0.1);
          }

          input {
            font-size: 13px;
            color: var(--el-text-color-primary);

            &::placeholder {
              color: var(--el-text-color-placeholder);
              font-size: 13px;
            }
          }
        }

        .el-input__prefix {
          left: 8px;

          .input-search-icon {
            color: var(--el-text-color-secondary);
            font-size: 14px;
          }
        }
      }

      .search-btn {
        height: 34px;
        min-width: 68px;
        border-radius: 4px;
        font-size: 13px;
        font-weight: 500;
        padding: 0 12px;
        display: flex;
        align-items: center;
        gap: 4px;
        background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-dark-2));
        box-shadow: 0 1px 3px rgba(var(--el-color-primary-rgb), 0.3);
        transition: all 0.3s ease;
        
        &:hover {
          transform: translateY(-1px);
          box-shadow: 0 2px 6px rgba(var(--el-color-primary-rgb), 0.4);
        }

        .btn-icon {
          font-size: 13px;
        }

        .btn-text {
          @media (max-width: 480px) {
            display: none;
          }
        }
      }
    }
  }

  // 通用区域标题
  .section-title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    color: var(--el-text-color-primary);
    font-size: 13px;
    font-weight: 600;

    .title-icon {
      color: var(--el-color-primary);
      font-size: 13px;
      opacity: 0.8;
    }
  }

  // 过滤器区域（改为中性描边按钮 + 轻微主色激活）
  .filter-section {
    margin-bottom: 12px;

    .filter-buttons {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      .filter-btn {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 10px;
        background: linear-gradient(135deg, var(--el-fill-color-blank) 0%, var(--el-fill-color-light) 100%);
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        color: var(--el-text-color-regular);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
          transition: left 0.5s ease;
        }

        .btn-icon {
          font-size: 12px;
          color: inherit;
          transition: transform 0.3s ease;
        }

        .btn-label {
          color: inherit;
          @media (max-width: 640px) {
            display: none;
          }
        }

        &:hover {
          background: linear-gradient(135deg, var(--el-fill-color-light) 0%, var(--el-fill-color) 100%);
          border-color: var(--el-border-color-darker);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          
          &::before {
            left: 100%;
          }
          
          .btn-icon {
            transform: scale(1.05);
          }
        }

        &.active {
          background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-color-primary-light-8) 100%);
          border-color: var(--el-color-primary-light-5);
          color: var(--el-color-primary);
          box-shadow: 0 1px 3px rgba(var(--el-color-primary-rgb), 0.2);
          
          .btn-icon {
            transform: scale(1.1);
          }
        }
      }
    }
  }

  // 分类区域（统一为中性色签，激活时轻主色）
  .category-section {
    .category-tags {
      display: flex;
      gap: 6px;
      flex-wrap: wrap;

      .category-tag {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 4px 8px;
        background: linear-gradient(135deg, var(--el-fill-color-blank) 0%, var(--el-fill-color-light) 100%);
        border: 1px solid var(--el-border-color);
        border-radius: 4px;
        color: var(--el-text-color-regular);
        font-size: 11px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;

        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(ellipse at center, rgba(var(--el-color-primary-rgb), 0.03) 0%, transparent 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .tag-icon {
          font-size: 11px;
          color: var(--el-color-primary);
          opacity: 0.7;
          transition: all 0.3s ease;
        }

        .tag-name {
          font-size: 11px;
        }

        .tag-count {
          font-size: 10px;
          font-weight: 600;
          background: linear-gradient(135deg, var(--el-fill-color) 0%, var(--el-fill-color-dark) 100%);
          color: var(--el-text-color-secondary);
          padding: 1px 4px;
          border-radius: 8px;
          min-width: 16px;
          text-align: center;
          line-height: 1.2;
          transition: all 0.3s ease;
        }

        &:hover {
          background: linear-gradient(135deg, var(--el-fill-color-light) 0%, var(--el-fill-color) 100%);
          border-color: var(--el-border-color-darker);
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          
          &::after {
            opacity: 1;
          }
          
          .tag-icon {
            opacity: 1;
            transform: scale(1.1);
          }
        }

        &.active {
          background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-color-primary-light-8) 100%);
          border-color: var(--el-color-primary-light-5);
          color: var(--el-color-primary);
          box-shadow: 0 0 0 1px rgba(var(--el-color-primary-rgb), 0.1), 0 1px 3px rgba(var(--el-color-primary-rgb), 0.2);
          transform: scale(1.02);
          
          &::after {
            opacity: 1;
          }

          .tag-icon { 
            color: var(--el-color-primary); 
            opacity: 1;
            transform: scale(1.15);
          }
          .tag-count { 
            background: linear-gradient(135deg, var(--el-color-primary-light-8) 0%, var(--el-color-primary-light-7) 100%);
            color: var(--el-color-primary);
            transform: scale(1.05);
          }
        }
      }
    }
  }
}

// 暗色模式适配（保持克制的对比和中性色）
html.dark & {
  .search-filter-section {
    background: linear-gradient(135deg, var(--el-bg-color) 0%, rgba(255, 255, 255, 0.02) 100%);
    border-color: #3a3a3a;

    &::before {
      background: radial-gradient(ellipse at top center, rgba(100, 168, 255, 0.03) 0%, transparent 50%);
    }

    &:hover {
      border-color: #4a4a4a;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .section-title {
      color: var(--el-text-color-primary);

      .title-icon {
        color: #64A8FF;
        opacity: 0.8;
      }
    }

    .search-section {
      .search-input-wrapper {
        :deep(.search-input) {
          .el-input__wrapper {
            background: var(--el-fill-color-blank);
            border-color: #444;
            box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);

            &:hover { 
              border-color: #555; 
              background: rgba(255, 255, 255, 0.02);
            }
            &.is-focus { 
              border-color: #64A8FF; 
              background: var(--el-bg-color);
              box-shadow: 0 0 0 2px rgba(100, 168, 255, 0.15);
            }

            input {
              color: var(--el-text-color-primary);
              &::placeholder { color: var(--el-text-color-placeholder); }
            }
          }
          .el-input__prefix {
            .input-search-icon { color: var(--el-text-color-secondary); }
          }
        }
      }
    }

    .filter-section {
      .filter-buttons {
        .filter-btn {
          background: linear-gradient(135deg, var(--el-fill-color-blank) 0%, rgba(255, 255, 255, 0.02) 100%);
          border-color: #444;
          color: var(--el-text-color-regular);

          &::before {
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
          }

          &:hover { 
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.08) 100%);
            border-color: #555;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          &.active {
            background: linear-gradient(135deg, rgba(100, 168, 255, 0.08) 0%, rgba(100, 168, 255, 0.12) 100%);
            border-color: rgba(100, 168, 255, 0.35);
            color: #64A8FF;
            box-shadow: 0 1px 3px rgba(100, 168, 255, 0.3);
          }
        }
      }
    }

    .category-section {
      .category-tags {
        .category-tag {
          background: linear-gradient(135deg, var(--el-fill-color-blank) 0%, rgba(255, 255, 255, 0.02) 100%);
          border-color: #444;
          color: var(--el-text-color-regular);

          &::after {
            background: radial-gradient(ellipse at center, rgba(100, 168, 255, 0.05) 0%, transparent 70%);
          }

          &:hover { 
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.04) 0%, rgba(255, 255, 255, 0.08) 100%);
            border-color: #555;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }

          .tag-icon { 
            color: #64A8FF;
            opacity: 0.7;
          }
          .tag-count { 
            background: linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.1) 100%);
            color: var(--el-text-color-secondary); 
          }

          &.active {
            background: linear-gradient(135deg, rgba(100, 168, 255, 0.08) 0%, rgba(100, 168, 255, 0.12) 100%);
            border-color: rgba(100, 168, 255, 0.35);
            color: #64A8FF;
            box-shadow: 0 0 0 1px rgba(100, 168, 255, 0.1), 0 1px 3px rgba(100, 168, 255, 0.3);
            transform: scale(1.02);

            .tag-icon { 
              color: #64A8FF;
              opacity: 1;
              transform: scale(1.15);
            }
            .tag-count { 
              background: linear-gradient(135deg, rgba(100, 168, 255, 0.15) 0%, rgba(100, 168, 255, 0.2) 100%);
              color: #64A8FF;
              transform: scale(1.05);
            }
          }
        }
      }
    }
  }
}
</style>
