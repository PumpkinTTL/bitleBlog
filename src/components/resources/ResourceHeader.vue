<template>
  <div class="resource-header">
    <div class="search-bar">
      <div class="search-input-wrapper">
        <a-input-search v-model:value="searchValue" placeholder="探索资源库..." enter-button :allowClear="true"
          @search="onSearch">
          <template #prefix>
            <i class="fas fa-search search-icon"></i>
          </template>
        </a-input-search>
      </div>
    </div>

    <div class="bottom-row">
      <div class="filter-buttons">
        <a-button-group>
          <a-button v-for="(category, index) in categories" :key="index"
            :type="activeCategory === category ? 'primary' : 'default'" :class="{ active: activeCategory === category }"
            @click="onFilterClick(category)">
            {{ category }}
          </a-button>
        </a-button-group>
      </div>

      <div class="action-buttons">
        <a-tooltip title="分享你的资源">
          <a-button type="primary" shape="round" class="share-btn">
            <i class="fas fa-plus-circle"></i> 分享资源
          </a-button>
        </a-tooltip>

        <a-dropdown :trigger="['click']">
          <a-button shape="round" class="sort-btn">
            <i class="fas fa-sort-amount-down"></i> 排序
          </a-button>
          <template #overlay>
            <a-menu @click="onSortMenuClick">
              <a-menu-item key="newest">最新上传</a-menu-item>
              <a-menu-item key="hot">最热门</a-menu-item>
              <a-menu-item key="downloads">下载最多</a-menu-item>
              <a-menu-item key="rating">评分最高</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>

        <a-dropdown :trigger="['click']">
          <a-button shape="circle" class="more-btn">
            <i class="fas fa-ellipsis-h"></i>
          </a-button>
          <template #overlay>
            <a-menu>
              <a-menu-item key="favorites">
                <i class="fas fa-heart"></i> 我的收藏
              </a-menu-item>
              <a-menu-item key="history">
                <i class="fas fa-history"></i> 浏览历史
              </a-menu-item>
              <a-menu-item key="feedback">
                <i class="fas fa-comment-alt"></i> 反馈
              </a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 定义属性
const props = defineProps({
  categories: {
    type: Array as () => string[],
    default: () => ['全部', '软件', '素材', '教程', '工具', '娱乐']
  }
});

// 搜索值
const searchValue = ref('');
// 当前选中的分类
const activeCategory = ref('全部');

// 定义事件
const emit = defineEmits(['search', 'filter', 'sort']);

// 搜索处理
const onSearch = (value: string) => {
  emit('search', value);
};

// 分类过滤处理
const onFilterClick = (category: string) => {
  activeCategory.value = category;
  emit('filter', category);
};

// 排序处理
const onSortMenuClick = (e: { key: string }) => {
  emit('sort', e.key);
};
</script>

<style scoped lang="less">
.resource-header {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 18px;
  
  .search-bar {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
    
    .search-input-wrapper {
      width: 100%;
      
      @media screen and (max-width: 767px) {
        max-width: 100%;
      }
      
      :deep(.ant-input-search) {
        width: 100%;
        display: flex;
        
        .ant-input-wrapper {
          display: flex;
          width: 100%;
        }
      }
      
      :deep(.ant-input-affix-wrapper) {
        border-radius: 50px 0 0 50px;
        box-shadow: 0 3px 10px rgba(22, 119, 255, 0.1);
        height: 42px;
        padding: 0 15px;
        border: 1px solid #d9d9d9;
        border-right: none;
        flex: 1;
        
        &:hover, &:focus, &.ant-input-affix-wrapper-focused {
          box-shadow: 0 5px 15px rgba(22, 119, 255, 0.15);
          border-color: #1677FF;
          border-right: none;
        }
        
        .ant-input {
          font-size: 14px;
          padding: 6px 0;
        }
        
        .ant-input-prefix {
          margin-right: 10px;
        }
      }
      
      :deep(.ant-input-group) {
        display: flex;
        width: 100%;
      }
      
      :deep(.ant-input-group-addon) {
        width: auto;
        
        .ant-btn {
          border-radius: 0 50px 50px 0 !important;
          height: 42px;
          font-weight: 500;
          padding: 0 18px;
          box-shadow: 0 3px 10px rgba(22, 119, 255, 0.15);
          border: none;
          line-height: 42px;
          white-space: nowrap;
        }
      }
      
      :deep(.ant-input-search-button) {
        border-radius: 0 50px 50px 0 !important;
        height: 42px;
        border-left: none;
        
        &:hover, &:focus {
          border-color: #1677FF;
        }
      }
      
      .search-icon {
        color: #1677FF;
        font-size: 16px;
      }
    }
  }
  
  .bottom-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    width: 100%;
    
    @media screen and (max-width: 767px) {
      flex-direction: column;
      align-items: stretch;
    }
    
    .filter-buttons {
      flex: 1;
      margin: 0;
      
      :deep(.ant-btn-group) {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        // overflow-x: auto;
        padding-bottom: 4px;
        
        /* Hide scrollbar */
        &::-webkit-scrollbar {
          height: 3px;
        }
        
        &::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.1);
          border-radius: 3px;
        }
        
        .ant-btn {
          border-radius: 16px !important;
          margin: 0 !important;
          font-size: 13px;
          font-weight: 500;
          padding: 0 12px;
          height: 30px;
          transition: all 0.2s ease;
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
          }
          
          &.active {
            background: #1677FF;
            color: white;
          }
        }
      }
    }
    
    .action-buttons {
      display: flex;
      gap: 8px;
      align-items: center;
      height: 42px;
      flex-shrink: 0;
      
      @media screen and (max-width: 767px) {
        width: 100%;
        justify-content: space-between;
        
        .share-btn {
          flex: 1;
        }
      }
      
      :deep(.ant-btn) {
        line-height: 1;
      }
      
      .share-btn {
        font-weight: 500;
        height: 42px;
        padding: 0 16px;
        background: linear-gradient(45deg, #1677FF, #4dabff);
        border: none;
        box-shadow: 0 3px 10px rgba(22, 119, 255, 0.2);
        display: flex;
        align-items: center;
        justify-content: center;
        
        i {
          margin-right: 6px;
          font-size: 14px;
        }
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(22, 119, 255, 0.3);
          background: linear-gradient(45deg, #0d6efd, #3e9fff);
        }
      }
      
      .sort-btn {
        height: 42px;
        padding: 0 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        i {
          margin-right: 4px;
          font-size: 14px;
        }
      }
      
      .more-btn {
        height: 42px;
        width: 42px;
        display: flex;
        align-items: center;
        justify-content: center;
        
        i {
          font-size: 14px;
        }
      }
    }
  }
}
</style>