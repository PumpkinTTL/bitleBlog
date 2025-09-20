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
// 统一风格热门卡片
.hot-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(244, 114, 182, 0.3);
    box-shadow: 0 4px 16px rgba(244, 114, 182, 0.08);
  }
  
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
      color: #f472b6;
      font-size: 14px;
    }
    
    span {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
  }
  
  .card-body {
    padding: 16px;
    
    .hot-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .hot-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: var(--el-fill-color-extra-light);
        border-radius: 6px;
        transition: all 0.3s ease;
        cursor: pointer;
        
        &:hover {
          background: rgba(244, 114, 182, 0.05);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(244, 114, 182, 0.1);
          
          .article .title {
            color: #f472b6;
          }
        }
        
        .rank {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 600;
          background: var(--el-fill-color-light);
          color: var(--el-text-color-secondary);
          flex-shrink: 0;
          transition: all 0.3s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
          
          &.rank-1 {
            background: linear-gradient(135deg, #f472b6, #e879f9);
            color: white;
            box-shadow: 0 2px 8px rgba(244, 114, 182, 0.3);
          }
          
          &.rank-2 {
            background: linear-gradient(135deg, #e879f9, #c084fc);
            color: white;
            box-shadow: 0 2px 8px rgba(232, 121, 249, 0.3);
          }
          
          &.rank-3 {
            background: linear-gradient(135deg, #c084fc, #a78bfa);
            color: white;
            box-shadow: 0 2px 8px rgba(192, 132, 252, 0.3);
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
              color: #f472b6;
              font-size: 10px;
              opacity: 0.8;
            }
          }
        }
      }
    }
  }
  
  // 暗色模式适配
  html.dark & {
    &:hover {
      box-shadow: 0 4px 16px rgba(244, 114, 182, 0.15);
    }
    
    .hot-list {
      .hot-item {
        &:hover {
          background: rgba(244, 114, 182, 0.08);
          box-shadow: 0 2px 8px rgba(244, 114, 182, 0.2);
        }
      }
    }
  }
}
</style>
