<template>
  <div class="search-filter-section animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
    <div class="search-filter-header">
      <div class="search-container">
        <div class="search-wrapper">
          <div class="search-input-group">
            <el-input v-model="searchKeyword" placeholder="输入关键词搜索文章..." size="large" class="search-input"
              @keyup.enter="handleSearch(searchKeyword)" clearable>
              <template #prefix>
                <el-icon class="search-icon">
                  <Search />
                </el-icon>
              </template>
            </el-input>
            <el-button type="primary" class="search-btn" @click="handleSearch(searchKeyword)" :icon="Search">
              搜索
            </el-button>
          </div>
        </div>
      </div>

      <div class="filter-container">
        <div class="filter-buttons">
          <el-button v-for="item in filterOptions" :key="item.value"
            :type="activeFilter === item.value ? 'primary' : 'default'" :plain="activeFilter !== item.value"
            size="default" class="filter-item" @click="handleFilterChange(item.value)">
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
        <el-tag v-for="category in categories" :key="category.id"
          :type="activeCategory === category.id ? 'primary' : undefined" class="category-tag"
          @click="handleCategoryChange(category.id)" effect="plain">
          <i :class="category.icon" class="tag-icon"></i>
          {{ category.name }}
          <span v-if="category.count" class="tag-count">({{ category.count }})</span>
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Search, Star, Clock, TrendCharts, Grid } from '@element-plus/icons-vue'

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
// 现代化搜索过滤区域
.search-filter-section {
  margin-bottom: 24px;
  background: #ffffff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;

  &:hover {
    border-color: #d1d5db;
  }

  .search-filter-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    @media (max-width: 768px) {
      flex-direction: column;
      align-items: stretch;
      gap: 10px;
    }

    .search-container {
      flex: 1;
      min-width: 280px;

      @media (max-width: 768px) {
        min-width: auto;
      }

      .search-wrapper {
        .search-input-group {
          display: flex;
          gap: 6px;

          :deep(.search-input) {
            flex: 1;

            .el-input__wrapper {
              border-radius: 6px;
              border: 1px solid #d1d5db;
              background: #ffffff;
              height: 36px;
              transition: all 0.2s ease;

              &:hover {
                border-color: #3b82f6;
                box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.1);
              }

              &.is-focus {
                border-color: #3b82f6;
                box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
              }
            }

            .el-input__prefix {
              .search-icon {
                color: #6b7280;
                font-size: 16px;
              }
            }
          }

          .search-btn {
            height: 36px;
            border-radius: 6px;
            background: #059669;
            border: none;
            color: white;
            font-weight: 500;
            font-size: 13px;
            padding: 0 16px;
            transition: all 0.2s ease;

            &:hover {
              background: #047857;
            }
          }
        }
      }
    }

    .filter-container {
      .filter-buttons {
        display: flex;
        gap: 6px;
        flex-wrap: wrap;

        @media (max-width: 768px) {
          gap: 4px;
        }

        .filter-item {
          height: 32px !important;
          padding: 0 10px !important;
          font-size: 12px !important;
          border-radius: 6px !important;
          border: 1px solid #e5e7eb !important;
          background: #ffffff !important;
          color: #6b7280 !important;
          transition: all 0.2s ease !important;

          &:hover {
            border-color: #3b82f6 !important;
            background: #eff6ff !important;
            color: #3b82f6 !important;
          }

          &.el-button--primary {
            background: #3b82f6 !important;
            border-color: #3b82f6 !important;
            color: white !important;

            &:hover {
              background: #2563eb !important;
              border-color: #2563eb !important;
            }
          }

          .filter-text {
            @media (max-width: 768px) {
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
      gap: 6px;
      flex-wrap: wrap;
      padding: 6px 0;

      .category-tag {
        font-size: 13px !important;
        padding: 4px 10px !important;
        border-radius: 6px !important;
        cursor: pointer;
        transition: all 0.2s ease;

        // 清新的浅色背景配深色边框
        &:nth-child(1):not(.el-tag--primary) {
          background: #f8fafc !important;
          color: #64748b !important;
          border: 1px solid #cbd5e1 !important;
        }

        &:nth-child(2):not(.el-tag--primary) {
          background: #f0fdf4 !important;
          color: #16a34a !important;
          border: 1px solid #bbf7d0 !important;
        }

        &:nth-child(3):not(.el-tag--primary) {
          background: #fff7ed !important;
          color: #ea580c !important;
          border: 1px solid #fed7aa !important;
        }

        &:nth-child(4):not(.el-tag--primary) {
          background: #faf5ff !important;
          color: #9333ea !important;
          border: 1px solid #ddd6fe !important;
        }

        &:nth-child(5):not(.el-tag--primary) {
          background: #eff6ff !important;
          color: #2563eb !important;
          border: 1px solid #bfdbfe !important;
        }

        &:nth-child(6):not(.el-tag--primary) {
          background: #fffbeb !important;
          color: #d97706 !important;
          border: 1px solid #fde68a !important;
        }

        &:nth-child(7):not(.el-tag--primary) {
          background: #f0fdf4 !important;
          color: #059669 !important;
          border: 1px solid #a7f3d0 !important;
        }

        &:nth-child(8):not(.el-tag--primary) {
          background: #fafafa !important;
          color: #525252 !important;
          border: 1px solid #d4d4d8 !important;
        }

        // 选中状态
        &.el-tag--primary {
          background: #3b82f6 !important;
          color: #ffffff !important;
          transform: scale(1.02);

          &:hover {
            background: #2563eb !important;
          }
        }

        &:hover:not(.el-tag--primary) {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
}

// 暗色模式
html.dark & {
  .search-filter-section {
    background: #111827;
    border-color: #374151;

    &:hover {
      border-color: #4b5563;
    }

    .search-filter-header {
      .search-container {
        .search-wrapper {
          .search-input-group {
            :deep(.search-input) {
              .el-input__wrapper {
                background: #1f2937;
                border-color: #4b5563;
                color: #f3f4f6;

                &:hover {
                  border-color: #3b82f6;
                  box-shadow: 0 0 0 1px rgba(59, 130, 246, 0.2);
                }

                &.is-focus {
                  border-color: #3b82f6;
                  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
                }
              }

              .el-input__prefix {
                .search-icon {
                  color: #9ca3af;
                }
              }
            }

            .search-btn {
              background: #3b82f6;

              &:hover {
                background: #2563eb;
              }
            }
          }
        }
      }

      .filter-container {
        .filter-buttons {
          .filter-item {
            background: #1f2937 !important;
            border-color: #4b5563 !important;
            color: #9ca3af !important;

            &:hover {
              border-color: #3b82f6 !important;
              background: #1e293b !important;
              color: #3b82f6 !important;
            }

            &.el-button--primary {
              background: #3b82f6 !important;
              border-color: #3b82f6 !important;
              color: white !important;

              &:hover {
                background: #2563eb !important;
                border-color: #2563eb !important;
              }
            }
          }
        }
      }
    }

    .category-tags {
      .category-scroll {
        .category-tag {
          &.el-tag--primary {
            background: #3b82f6 !important;
            color: #ffffff !important;

            &:hover {
              background: #2563eb !important;
            }
          }

          // 暗色模式下浅色背景配深色边框
          &:nth-child(1):not(.el-tag--primary) {
            background: #1e293b !important;
            color: #cbd5e1 !important;
            border: 1px solid #475569 !important;
          }

          &:nth-child(2):not(.el-tag--primary) {
            background: #0f2027 !important;
            color: #86efac !important;
            border: 1px solid #166534 !important;
          }

          &:nth-child(3):not(.el-tag--primary) {
            background: #2c1810 !important;
            color: #fbbf24 !important;
            border: 1px solid #b45309 !important;
          }

          &:nth-child(4):not(.el-tag--primary) {
            background: #1e1b2e !important;
            color: #c4b5fd !important;
            border: 1px solid #6d28d9 !important;
          }

          &:nth-child(5):not(.el-tag--primary) {
            background: #0f1829 !important;
            color: #93c5fd !important;
            border: 1px solid #1d4ed8 !important;
          }

          &:nth-child(6):not(.el-tag--primary) {
            background: #2d1b0a !important;
            color: #fcd34d !important;
            border: 1px solid #b45309 !important;
          }

          &:nth-child(7):not(.el-tag--primary) {
            background: #0a2f1a !important;
            color: #6ee7b7 !important;
            border: 1px solid #047857 !important;
          }

          &:nth-child(8):not(.el-tag--primary) {
            background: #27272a !important;
            color: #d4d4d8 !important;
            border: 1px solid #52525b !important;
          }
        }
      }
    }
  }
}
</style>
