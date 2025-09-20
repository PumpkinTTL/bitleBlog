<template>
  <div class="hot-tags-card">
    <!-- 统一的卡片头部样式 -->
    <div class="card-header">
      <i class="fas fa-tags"></i>
      <span>热门标签</span>
    </div>
    
    <!-- 标签云内容 -->
    <div class="card-body">
      <div class="tags-cloud">
        <div 
          v-for="(tag, index) in hotTags" 
          :key="tag.id"
          class="tag-item"
          :class="`tag-level-${tag.level}`"
          @click="handleTagClick(tag)"
        >
          <i class="fas fa-hashtag"></i>
          {{ tag.name }}
          <span class="tag-count">{{ tag.count }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 标签类型定义
interface HotTag {
  id: number
  name: string
  count: number
  level: number // 1-5 热度等级
}

// 模拟热门标签数据
const hotTags = ref<HotTag[]>([
  { id: 1, name: 'Vue3', count: 45, level: 5 },
  { id: 2, name: 'JavaScript', count: 38, level: 4 },
  { id: 3, name: 'TypeScript', count: 32, level: 4 },
  { id: 4, name: '前端工程化', count: 28, level: 3 },
  { id: 5, name: 'React', count: 25, level: 3 },
  { id: 6, name: 'Node.js', count: 22, level: 3 },
  { id: 7, name: 'CSS', count: 18, level: 2 },
  { id: 8, name: 'Webpack', count: 15, level: 2 },
  { id: 9, name: 'Vite', count: 12, level: 2 },
  { id: 10, name: 'Performance', count: 8, level: 1 },
  { id: 11, name: 'SSR', count: 6, level: 1 },
  { id: 12, name: 'PWA', count: 4, level: 1 }
])

// 标签点击事件
const handleTagClick = (tag: HotTag) => {
  console.log('点击标签:', tag)
  // 这里可以跳转到标签页面
  // router.push(`/tags/${tag.id}`)
}
</script>

<style lang="less" scoped>
// 热门标签卡片 - 与其他卡片保持一致的风格
.hot-tags-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  animation: fadeIn 0.6s ease-out;
  overflow: hidden;
}

// 统一的卡片头部样式
.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  background: var(--el-fill-color-extra-light);
  border-bottom: 1px solid var(--el-border-color-extra-light);
  border-radius: 8px 8px 0 0;
  
  i {
    color: var(--el-color-primary);
    font-size: 14px;
  }
  
  span {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
}

.card-body {
  padding: 16px;
  overflow: hidden;
}

// 标签云样式
.tags-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  
  .tag-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 6px 12px;
    background: var(--el-fill-color-extra-light);
    border: 1px solid transparent;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
    font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.1), transparent);
      transition: left 0.6s ease;
    }
    
    &:hover {
      background: rgba(64, 158, 255, 0.05);
      border-color: rgba(64, 158, 255, 0.3);
      transform: translateY(-2px) scale(1.05);
      box-shadow: 0 6px 16px rgba(64, 158, 255, 0.15), 0 2px 6px rgba(64, 158, 255, 0.1);
      
      &::before {
        left: 100%;
      }
      
      i {
        transform: scale(1.1);
        color: var(--el-color-primary);
      }
      
      .tag-count {
        background: var(--el-color-primary);
        color: white;
        transform: scale(1.1);
      }
    }
    
    i {
      font-size: 10px;
      color: var(--el-text-color-secondary);
      transition: all 0.3s ease;
    }
    
    .tag-count {
      font-size: 9px;
      background: var(--el-fill-color-lighter);
      color: var(--el-text-color-secondary);
      padding: 1px 4px;
      border-radius: 8px;
      min-width: 16px;
      text-align: center;
      font-weight: 600;
      transition: all 0.3s ease;
    }
    
    // 不同热度等级的标签大小
    &.tag-level-5 {
      font-size: 14px;
      font-weight: 600;
      padding: 8px 14px;
      
      i {
        font-size: 12px;
      }
      
      .tag-count {
        font-size: 10px;
      }
    }
    
    &.tag-level-4 {
      font-size: 13px;
      font-weight: 500;
      padding: 7px 13px;
      
      i {
        font-size: 11px;
      }
      
      .tag-count {
        font-size: 9px;
      }
    }
    
    &.tag-level-3 {
      font-size: 12px;
      font-weight: 500;
      padding: 6px 12px;
    }
    
    &.tag-level-2 {
      font-size: 11px;
      font-weight: 400;
      padding: 5px 10px;
      
      i {
        font-size: 9px;
      }
      
      .tag-count {
        font-size: 8px;
      }
    }
    
    &.tag-level-1 {
      font-size: 10px;
      font-weight: 400;
      padding: 4px 8px;
      
      i {
        font-size: 8px;
      }
      
      .tag-count {
        font-size: 8px;
      }
    }
  }
}

// 动画定义
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 暗色模式适配
html.dark .hot-tags-card {
  border-color: var(--el-border-color-dark);
  
  .card-header {
    background: var(--el-fill-color-dark);
    border-bottom-color: var(--el-border-color-darker);
    
    i {
      color: var(--el-color-primary);
    }
  }
  
  .tag-item {
    background: var(--el-fill-color-dark);
    
    &:hover {
      background: rgba(64, 158, 255, 0.08);
      border-color: rgba(64, 158, 255, 0.4);
      box-shadow: 0 6px 16px rgba(64, 158, 255, 0.25), 0 2px 6px rgba(64, 158, 255, 0.15);
    }
    
    &::before {
      background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.15), transparent);
    }
  }
}
</style>
