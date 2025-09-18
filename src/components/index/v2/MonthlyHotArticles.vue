<template>
  <div class="sidebar-card hot-card animate__animated animate__fadeInUp" style="animation-delay: 0.25s">
    <div class="card-header">
      <i class="fas fa-fire"></i>
      <span>本月热门</span>
    </div>
    
    <div class="card-body">
      <div class="hot-list">
        <div 
          v-for="(article, index) in hotArticles" 
          :key="article.id"
          class="hot-item"
          @click="handleArticleClick(article.id)"
        >
          <div class="rank" :class="`rank-${index + 1}`">{{ index + 1 }}</div>
          <div class="article">
            <div class="title">{{ article.title }}</div>
            <div class="views">
              <i class="fas fa-eye"></i>
              {{ article.views }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 热门文章数据
const hotArticles = ref([
  { id: 1, title: 'Vue 3 Composition API 完全指南', views: 3245 },
  { id: 2, title: 'TypeScript 高级类型实战技巧', views: 2876 },
  { id: 3, title: 'Vite 构建工具深度解析', views: 2634 },
  { id: 4, title: 'Pinia 状态管理最佳实践', views: 2145 },
  { id: 5, title: 'Vue Router 4 路由完整教程', views: 1987 }
])

// 事件处理
const handleArticleClick = async (articleId: number) => {
  try {
    await router.push({
      path: `/blogDetail/${articleId}`,
      query: { transition: 'slide-fade' }
    })
  } catch (error) {
    console.error('路由跳转失败:', error)
    window.location.href = `/blogDetail/${articleId}`
  }
}
</script>

<style lang="less" scoped>
// 现代扁平化热门卡片
.hot-card {
  background: var(--el-bg-color);
  border: 1px solid rgba(0, 0, 0, 0.05);
  border-radius: 8px;
  transition: all 0.25s ease;
  
  &:hover {
    border-color: rgba(24, 144, 255, 0.15);
    background: rgba(24, 144, 255, 0.02);
    transform: translateY(-1px);
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 14px 16px 10px;
    
    i {
      width: 20px;
      height: 20px;
      background: #ff6b6b;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 10px;
    }
    
    span {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      letter-spacing: 0.3px;
    }
  }
  
  .card-body {
    padding: 0 6px 6px;
    
    .hot-list {
      .hot-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px;
        border-radius: 6px;
        transition: all 0.25s ease;
        cursor: pointer;
        
        &:hover {
          background: rgba(24, 144, 255, 0.04);
          transform: translateX(2px);
          
          .article .title {
            color: var(--el-color-primary);
          }
        }
        
        .rank {
          width: 22px;
          height: 22px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          background: #d9d9d9;
          color: #666666;
          flex-shrink: 0;
          transition: all 0.25s ease;
          
          &.rank-1 {
            background: #faad14;
            color: white;
          }
          
          &.rank-2 {
            background: #52c41a;
            color: white;
          }
          
          &.rank-3 {
            background: #1890ff;
            color: white;
          }
        }
        
        .article {
          flex: 1;
          min-width: 0;
          
          .title {
            font-size: 13px;
            font-weight: 500;
            color: var(--el-text-color-primary);
            line-height: 1.4;
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: color 0.25s ease;
          }
          
          .views {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 11px;
            color: var(--el-text-color-secondary);
            
            i {
              color: var(--el-color-primary);
              font-size: 10px;
              opacity: 0.7;
            }
          }
        }
      }
    }
  }
  
  // 暗色模式适配
  html.dark & {
    background: #1a1a1a;
    border-color: rgba(255, 255, 255, 0.08);
    
    &:hover {
      border-color: rgba(24, 144, 255, 0.2);
      background: rgba(24, 144, 255, 0.03);
    }
    
    .hot-list {
      .hot-item {
        &:hover {
          background: rgba(24, 144, 255, 0.06);
        }
      }
    }
  }
}
</style>
