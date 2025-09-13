<template>
  <div class="resource-header">
    <!-- 搜索框 -->
    <div class="search-section">
      <div class="search-box">
        <input
          v-model="searchValue"
          type="text"
          placeholder="搜索资源、教程、软件..."
          @keyup.enter="handleSearch"
        />
        <button class="search-btn" @click="handleSearch">
          <i class="fas fa-search"></i>
        </button>
      </div>
    </div>
    
    <!-- 分类和筛选栏 -->
    <div class="filter-section">
      <!-- 分类标签 -->
      <div class="category-tabs">
        <div 
          v-for="(category, index) in categories" 
          :key="index"
          class="category-tab"
          :class="{ active: activeCategory === category }"
          @click="handleCategoryChange(category)"
        >
          {{ category }}
        </div>
      </div>
      
      <!-- 排序和筛选选项 -->
      <div class="sort-options">
        <div class="sort-label">
          <i class="fas fa-sort"></i>
          <span>排序:</span>
        </div>
        <div class="sort-items">
          <div 
            class="sort-item" 
            :class="{ active: activeSort === 'newest' }"
            @click="handleSortChange('newest')"
          >
            最新
          </div>
          <div 
            class="sort-item" 
            :class="{ active: activeSort === 'hot' }"
            @click="handleSortChange('hot')"
          >
            热门
          </div>
          <div 
            class="sort-item" 
            :class="{ active: activeSort === 'downloads' }"
            @click="handleSortChange('downloads')"
          >
            下载量
          </div>
          <div 
            class="sort-item" 
            :class="{ active: activeSort === 'rating' }"
            @click="handleSortChange('rating')"
          >
            评分
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 定义组件props
const props = defineProps({
  categories: {
    type: Array as () => string[],
    default: () => ['全部']
  }
});

// 定义emit事件
const emit = defineEmits(['search', 'filter', 'sort']);

// 内部状态
const searchValue = ref('');
const activeCategory = ref('全部');
const activeSort = ref('newest');

// 搜索事件处理
const handleSearch = () => {
  emit('search', searchValue.value);
};

// 分类变更事件处理
const handleCategoryChange = (category: string) => {
  activeCategory.value = category;
  emit('filter', category);
};

// 排序变更事件处理
const handleSortChange = (sortType: string) => {
  activeSort.value = sortType;
  emit('sort', sortType);
};
</script>

<style scoped lang="less">
.resource-header {
  margin-bottom: 24px;
  
  .search-section {
    margin-bottom: 20px;
    
    .search-box {
      position: relative;
      width: 100%;
      height: 48px;
      
      input {
        width: 100%;
        height: 100%;
        padding: 0 60px 0 20px;
        border-radius: 24px;
        border: 1px solid rgba(0, 0, 0, 0.1);
        background-color: white;
        font-size: 16px;
        transition: all 0.3s;
        
        &:focus {
          border-color: #1677FF;
          box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.2);
          outline: none;
        }
        
        &::placeholder {
          color: #bbb;
        }
      }
      
      .search-btn {
        position: absolute;
        right: 6px;
        top: 6px;
        width: 36px;
        height: 36px;
        border-radius: 50%;
        background-color: #1677FF;
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s;
        
        &:hover {
          background-color: darken(#1677FF, 10%);
        }
        
        i {
          font-size: 14px;
        }
      }
    }
  }
  
  .filter-section {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    
    @media (max-width: 767px) {
      flex-direction: column;
      align-items: flex-start;
    }
    
    .category-tabs {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      
      .category-tab {
        padding: 6px 16px;
        border-radius: 16px;
        font-size: 14px;
        cursor: pointer;
        background-color: #f0f2f5;
        color: var(--bDescColor, #666);
        transition: all 0.3s;
        
        &:hover {
          background-color: #e6f4ff;
          color: #1677FF;
        }
        
        &.active {
          background-color: #1677FF;
          color: white;
        }
      }
    }
    
    .sort-options {
      display: flex;
      align-items: center;
      gap: 8px;
      
      .sort-label {
        display: flex;
        align-items: center;
        gap: 4px;
        color: var(--bDescColor, #666);
        font-size: 14px;
        
        i {
          font-size: 12px;
        }
      }
      
      .sort-items {
        display: flex;
        gap: 8px;
        
        .sort-item {
          padding: 6px 12px;
          border-radius: 16px;
          font-size: 13px;
          cursor: pointer;
          background-color: #f0f2f5;
          color: var(--bDescColor, #666);
          transition: all 0.3s;
          
          &:hover {
            background-color: #e6f4ff;
            color: #1677FF;
          }
          
          &.active {
            background-color: #e6f4ff;
            color: #1677FF;
            font-weight: 500;
          }
        }
      }
    }
  }
}
</style> 