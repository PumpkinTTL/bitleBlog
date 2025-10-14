<template>
  <!-- 卡片视图 -->
  <div 
    v-if="viewMode === 'card'"
    class="article-card"
    @click="handleClick"
  >
    <!-- 文章标签 -->
    <div class="article-badges">
      <el-tag v-if="article.isTop" type="danger" size="small" class="badge-tag">
        <i class="fas fa-thumbtack"></i> 置顶
      </el-tag>
      <el-tag v-if="article.isRecommended" type="primary" size="small" class="badge-tag">
        <i class="fas fa-star"></i> 推荐
      </el-tag>
      <el-tag v-if="article.isOriginal" type="success" size="small" class="badge-tag">
        <i class="fas fa-feather"></i> 原创
      </el-tag>
      <el-tag v-if="article.isHot" type="warning" size="small" class="badge-tag">
        <i class="fas fa-fire"></i> 热门
      </el-tag>
    </div>
    
    <!-- 文章封面 -->
    <div class="article-cover">
      <img :src="article.cover" :alt="article.title" />
      <div class="cover-overlay">
        <div class="overlay-content">
          <i class="fas fa-eye"></i>
          <span>阅读全文</span>
        </div>
      </div>
    </div>
    
    <!-- 文章内容 -->
    <div class="article-content">
      <div class="article-header">
        <h3 class="article-title">{{ article.title }}</h3>
        <p class="article-excerpt">{{ article.excerpt }}</p>
      </div>
      
      <div class="article-meta">
        <div class="meta-left">
          <div class="author-info">
            <img :src="article.author.avatar" :alt="article.author.name" class="author-avatar">
            <span class="author-name" :class="getAuthorClass(article.author)">
              {{ article.author.name }}
              <i v-if="article.author.isVip" class="fas fa-crown vip-icon"></i>
            </span>
          </div>
          <span class="meta-dot">·</span>
          <div class="publish-time">
            <i class="far fa-calendar-alt"></i>
            {{ formatDate(article.publishTime) }}
          </div>
        </div>
      </div>
      
      <div class="article-footer">
        <div class="article-stats">
          <div class="stat-item">
            <i class="fas fa-eye"></i>
            {{ article.views }}
          </div>
          <div class="stat-item">
            <i class="fas fa-heart"></i>
            {{ article.likes }}
          </div>
          <div class="stat-item">
            <i class="fas fa-comment"></i>
            {{ article.comments }}
          </div>
        </div>
        
        <div class="article-tags">
          <div 
            v-for="(tag, index) in article.tags" 
            :key="tag"
            class="article-tag"
            :style="getTagStyle(index)"
          >
            <i class="fas fa-tag"></i>
            {{ tag }}
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- 列表视图 -->
  <div 
    v-else
    class="article-item"
    @click="handleClick"
  >
    <div class="item-badges">
      <el-tag v-if="article.isTop" type="danger" size="small" class="badge-tag">
        <i class="fas fa-thumbtack"></i> 置顶
      </el-tag>
      <el-tag v-if="article.isRecommended" type="primary" size="small" class="badge-tag">
        <i class="fas fa-star"></i> 推荐
      </el-tag>
      <el-tag v-if="article.isOriginal" type="success" size="small" class="badge-tag">
        <i class="fas fa-feather"></i> 原创
      </el-tag>
      <el-tag v-if="article.isHot" type="warning" size="small" class="badge-tag">
        <i class="fas fa-fire"></i> 热门
      </el-tag>
    </div>
    
    <div class="item-content">
      <div class="item-main">
        <h3 class="item-title">{{ article.title }}</h3>
        <p class="item-excerpt">{{ article.excerpt }}</p>
        
        <div class="item-meta">
          <div class="author-info">
            <img :src="article.author.avatar" :alt="article.author.name" class="author-avatar">
            <span class="author-name" :class="getAuthorClass(article.author)">
              {{ article.author.name }}
              <i v-if="article.author.isVip" class="fas fa-crown vip-icon"></i>
            </span>
            <span class="publish-time">
              <i class="far fa-calendar-alt"></i>
              {{ formatDate(article.publishTime) }}
            </span>
          </div>
          
          <div class="item-stats">
            <div class="stat-item">
              <i class="fas fa-eye"></i>
              {{ article.views }}
            </div>
            <div class="stat-item">
              <i class="fas fa-heart"></i>
              {{ article.likes }}
            </div>
            <div class="stat-item">
              <i class="fas fa-comment"></i>
              {{ article.comments }}
            </div>
          </div>
        </div>
      </div>
      
      <div class="item-thumbnail">
        <img :src="article.cover" :alt="article.title" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

// Props
interface Article {
  id: number
  title: string
  excerpt: string
  cover: string
  author: {
    id: number
    name: string
    avatar: string
    isVip: boolean
  }
  publishTime: string
  views: number
  likes: number
  comments: number
  tags: string[]
  category: number
  isTop: boolean
  isRecommended: boolean
  isOriginal: boolean
  isHot: boolean
}

interface Props {
  article: Article
  viewMode: 'card' | 'list'
  animationDelay?: number
}

const props = withDefaults(defineProps<Props>(), {
  animationDelay: 0
})

const router = useRouter()

// 事件处理
const handleClick = async () => {
  try {
    await router.push({
      path: `/blogDetail/${props.article.id}`,
      query: { transition: 'slide-fade' }
    })
  } catch (error) {
    console.error('路由跳转失败:', error)
    window.location.href = `/blogDetail/${props.article.id}`
  }
}

const getAuthorClass = (author: any) => {
  if (author.isVip) return 'author-vip'
  return ''
}

const formatDate = (dateString: string) => {
  return dateString.split(' ')[0]
}

const getTagStyle = (index: number) => {
  const colors = [
    { background: '#1890ff' },
    { background: '#52c41a' },
    { background: '#fa8c16' },
    { background: '#722ed1' },
    { background: '#13c2c2' },
    { background: '#eb2f96' },
    { background: '#f5222d' },
    { background: '#faad14' }
  ]
  return colors[index % colors.length]
}
</script>

<style lang="less" scoped>
// 卡片视图样式
.article-card {
  background: #ffffff;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
  border: 1px solid #f0f0f0;
  position: relative;
  
  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 25px rgba(24, 144, 255, 0.15);
    border-color: rgba(24, 144, 255, 0.3);
  }
  
  .article-badges {
    position: absolute;
    top: 8px;
    left: 8px;
    z-index: 2;
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    
    // 只覆盖颜色，不改变 Element Plus 的默认布局和对齐
    .badge-tag {
      border: none !important; // 移除白色边框
      
      // 强制设置置顶标签颜色（红色）
      &.el-tag--danger {
        background-color: #f5222d !important;
        color: #ffffff !important;
        border: none !important;
      }
      
      // 强制设置推荐标签颜色（蓝色）
      &.el-tag--primary {
        background-color: #1677ff !important;
        color: #ffffff !important;
        border: none !important;
      }
      
      // 强制设置原创标签颜色（绿色）
      &.el-tag--success {
        background-color: #52c41a !important;
        color: #ffffff !important;
        border: none !important;
      }
      
      // 强制设置热门标签颜色（橙色）
      &.el-tag--warning {
        background-color: #faad14 !important;
        color: #ffffff !important;
        border: none !important;
      }
    }
  }
  
  .article-cover {
    position: relative;
    height: 160px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    
    .cover-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        135deg,
        rgba(24, 144, 255, 0.8) 0%,
        rgba(64, 169, 255, 0.6) 50%,
        rgba(105, 192, 255, 0.4) 100%
      );
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      .overlay-content {
        background: rgba(255, 255, 255, 0.95);
        color: #1890ff;
        padding: 12px 24px;
        border-radius: 25px;
        font-size: 14px;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 8px;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(10px);
        transform: translateY(10px);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        
        i {
          font-size: 16px;
          transition: transform 0.3s ease;
        }
        
        &:hover {
          background: #ffffff;
          transform: translateY(0) scale(1.05);
          box-shadow: 0 8px 30px rgba(24, 144, 255, 0.2);
          
          i {
            transform: translateX(4px);
          }
        }
      }
    }
    
    &:hover {
      img {
        transform: scale(1.1);
      }
      
      .cover-overlay {
        opacity: 1;
        visibility: visible;
        
        .overlay-content {
          transform: translateY(0);
        }
      }
    }
  }
  
  .article-content {
    padding: 16px;
    display: flex;
    flex-direction: column;
    height: calc(100% - 160px);
    
    .article-header {
      margin-bottom: 12px;
      
      .article-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 8px 0;
        line-height: 1.4;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        transition: color 0.3s ease;
      }
      
      .article-excerpt {
        font-size: 13px;
        color: var(--el-text-color-regular);
        line-height: 1.5;
        margin: 0;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    
    .article-meta {
      margin-bottom: 12px;
      
      .meta-left {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;
        
        .author-info {
          display: flex;
          align-items: center;
          gap: 6px;
          
          .author-avatar {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            object-fit: cover;
            border: 1.5px solid rgba(24, 144, 255, 0.15);
            transition: all 0.2s ease;
            
            &:hover {
              border-color: rgba(24, 144, 255, 0.4);
              transform: scale(1.1);
            }
          }
          
          .author-name {
            font-size: 13px;
            font-weight: 500;
            color: #595959;
            display: inline-flex;
            align-items: center;
            gap: 3px;
            transition: color 0.2s ease;
            
            &:hover {
              color: #1890ff;
            }
            
            &.author-vip {
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-weight: 600;
            }
            
            .vip-icon {
              color: #FFD700;
              font-size: 11px;
              filter: drop-shadow(0 1px 2px rgba(255, 215, 0, 0.3));
            }
          }
        }
        
        .meta-dot {
          color: #d9d9d9;
          font-size: 12px;
          line-height: 1;
        }
        
        .publish-time {
          font-size: 12px;
          color: #8c8c8c;
          display: flex;
          align-items: center;
          gap: 4px;
          
          i {
            font-size: 11px;
            color: #bfbfbf;
          }
        }
      }
    }
    
    .article-footer {
      margin-top: auto;
      padding-top: 12px;
      border-top: 1px solid rgba(240, 240, 240, 0.6);
      
      // 统计信息区域
      .article-stats {
        display: flex;
        gap: 14px;
        margin-bottom: 10px;
        
        .stat-item {
          font-size: 12px;
          color: #595959;
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 3px 8px;
          border-radius: 4px;
          background: rgba(0, 0, 0, 0.02);
          transition: all 0.2s ease;
          font-weight: 500;
          
          &:hover {
            color: #1890ff;
            background: rgba(24, 144, 255, 0.06);
            transform: translateY(-1px);
          }
          
          i {
            font-size: 12px;
            color: #8c8c8c;
            transition: color 0.2s ease;
          }
          
          // 浏览量图标
          &:nth-child(1) i {
            color: #1890ff;
          }
          
          &:nth-child(1):hover i {
            color: #40a9ff;
          }
          
          // 点赞图标
          &:nth-child(2) i {
            color: #ff4d4f;
          }
          
          &:nth-child(2):hover i {
            color: #ff7875;
          }
          
          // 评论图标
          &:nth-child(3) i {
            color: #52c41a;
          }
          
          &:nth-child(3):hover i {
            color: #73d13d;
          }
        }
      }
      
      // 标签区域
      .article-tags {
        display: flex;
        gap: 4px;
        flex-wrap: wrap;
        
        .article-tag {
          font-size: 10px;
          padding: 2px 6px;
          border-radius: 8px;
          border: none;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          white-space: nowrap;
          
          // 清新的绿色系颜色搭配
          &:nth-child(1) {
            background: #059669;
            color: white;
          }
          
          &:nth-child(2) {
            background: #10b981;
            color: white;
          }
          
          &:nth-child(3) {
            background: #34d399;
            color: white;
          }
          
          &:nth-child(4) {
            background: #14b8a6;
            color: white;
          }
          
          &:nth-child(5) {
            background: #06b6d4;
            color: white;
          }
          
          &:hover {
            transform: translateY(-1px);
            opacity: 0.85;
          }
          
          i {
            font-size: 9px;
            margin-right: 2px;
          }
        }
      }
    }
  }
}

// 列表视图样式
.article-item {
  background: #ffffff;
  border-radius: 8px;
  padding: 20px;
  border: 1px solid #f0f0f0;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
  margin-bottom: 16px;
  
  &:hover {
    transform: translateY(-3px) scale(1.01);
    box-shadow: 0 4px 16px rgba(24, 144, 255, 0.12);
    border-color: rgba(24, 144, 255, 0.3);
    
    .item-title {
      color: #1890ff;
    }
    
    .item-thumbnail img {
      transform: scale(1.05);
    }
  }
  
  .item-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-bottom: 12px;
    
    // 只覆盖颜色，不改变 Element Plus 的默认布局和对齐
    .badge-tag {
      border: none !important; // 移除白色边框
      
      // 强制设置置顶标签颜色（红色）
      &.el-tag--danger {
        background-color: #f5222d !important;
        color: #ffffff !important;
        border: none !important;
      }
      
      // 强制设置推荐标签颜色（蓝色）
      &.el-tag--primary {
        background-color: #1677ff !important;
        color: #ffffff !important;
        border: none !important;
      }
      
      // 强制设置原创标签颜色（绿色）
      &.el-tag--success {
        background-color: #52c41a !important;
        color: #ffffff !important;
        border: none !important;
      }
      
      // 强制设置热门标签颜色（橙色）
      &.el-tag--warning {
        background-color: #faad14 !important;
        color: #ffffff !important;
        border: none !important;
      }
    }
  }
  
  .item-content {
    display: flex;
    gap: 16px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 12px;
    }
    
    .item-main {
      flex: 1;
      min-width: 0;
      overflow: hidden;
      
      .item-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 8px;
        line-height: 1.4;
        transition: color 0.25s ease;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-word;
      }
      
      .item-excerpt {
        color: var(--el-text-color-regular);
        line-height: 1.5;
        margin-bottom: 12px;
        font-size: 14px;
        overflow: hidden;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        word-break: break-word;
      }
      
      .item-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 8px;
        
        .author-info {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          
          .author-avatar {
            width: 20px;
            height: 20px;
            border-radius: 50%;
            object-fit: cover;
            border: 1.5px solid rgba(24, 144, 255, 0.15);
            transition: all 0.2s ease;
            
            &:hover {
              border-color: rgba(24, 144, 255, 0.4);
              transform: scale(1.1);
            }
          }
          
          .author-name {
            font-size: 13px;
            font-weight: 500;
            color: #595959;
            display: inline-flex;
            align-items: center;
            gap: 3px;
            transition: color 0.2s ease;
            
            &:hover {
              color: #1890ff;
            }
            
            &.author-vip {
              background: linear-gradient(135deg, #FFD700 0%, #FFA500 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              font-weight: 600;
            }
            
            .vip-icon {
              color: #FFD700;
              font-size: 11px;
              filter: drop-shadow(0 1px 2px rgba(255, 215, 0, 0.3));
            }
          }
          
          .publish-time {
            font-size: 12px;
            color: #8c8c8c;
            display: flex;
            align-items: center;
            gap: 4px;
            
            &::before {
              content: '·';
              color: #d9d9d9;
              margin: 0 4px;
            }
            
            i {
              font-size: 11px;
              color: #bfbfbf;
            }
          }
        }
        
        .item-stats {
          display: flex;
          gap: 10px;
          
          .stat-item {
            font-size: 12px;
            color: #595959;
            display: flex;
            align-items: center;
            gap: 4px;
            padding: 3px 8px;
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.02);
            transition: all 0.2s ease;
            font-weight: 500;
            
            &:hover {
              color: #1890ff;
              background: rgba(24, 144, 255, 0.06);
              transform: translateY(-1px);
            }
            
            i {
              font-size: 12px;
              transition: color 0.2s ease;
            }
            
            // 浏览量图标
            &:nth-child(1) i {
              color: #1890ff;
            }
            
            &:nth-child(1):hover i {
              color: #40a9ff;
            }
            
            // 点赞图标
            &:nth-child(2) i {
              color: #ff4d4f;
            }
            
            &:nth-child(2):hover i {
              color: #ff7875;
            }
            
            // 评论图标
            &:nth-child(3) i {
              color: #52c41a;
            }
            
            &:nth-child(3):hover i {
              color: #73d13d;
            }
          }
        }
      }
    }
    
    .item-thumbnail {
      width: 120px;
      height: 80px;
      border-radius: 6px;
      overflow: hidden;
      flex-shrink: 0;
      
      @media (max-width: 768px) {
        width: 100%;
        height: 160px;
      }
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
    }
  }
}

// 暗色模式适配
html.dark & {
  .article-card, .article-item {
    background: #1a1a1a;
    border-color: #303030;
    
    &:hover {
      border-color: #177ddc;
      box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
    }
    
    .article-footer {
      border-top-color: rgba(255, 255, 255, 0.06);
    }
  }
}
</style>
