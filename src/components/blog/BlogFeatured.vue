<template>
  <div class="blog-featured">
    <h2 class="section-title">特色<span class="highlight">文章</span></h2>
    
    <div class="featured-grid">
      <div 
        v-for="(post, index) in featuredPosts" 
        :key="post.id"
        class="featured-card"
        :class="{ 'primary': index === 0 }"
        @click="$emit('post-click', post.id)"
      >
        <div class="card-image">
          <img :src="post.coverImage" :alt="post.title">
          <div class="card-overlay"></div>
        </div>
        
        <div class="card-content">
          <div class="card-category">{{ post.category }}</div>
          <h3 class="card-title">{{ post.title }}</h3>
          <p class="card-excerpt">{{ post.excerpt }}</p>
          
          <div class="card-meta">
            <div class="author">
              <img :src="post.author.avatar" :alt="post.author.name" class="author-avatar">
              <span class="author-name">{{ post.author.name }}</span>
            </div>
            <div class="post-info">
              <span class="date">{{ formatDate(post.date) }}</span>
              <span class="divider">•</span>
              <span class="views"><i class="fas fa-eye"></i> {{ formatNumber(post.views) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// 接收父组件传递的数据
interface Author {
  id: number;
  name: string;
  avatar: string;
}

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  coverImage: string;
  date: string;
  category: string;
  tags: string[];
  views: number;
  author: Author;
}

interface Props {
  featuredPosts: BlogPost[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'post-click', id: number): void;
}>();

// 工具函数
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatNumber = (num: number): string => {
  return num > 999 ? (num / 1000).toFixed(1) + 'k' : num.toString();
};
</script>

<style lang="less" scoped>
.blog-featured {
  margin-bottom: 40px;
  
  .section-title {
    font-size: 24px;
    font-weight: 600;
    color: var(--bTitleColor, #333);
    margin-bottom: 24px;
    position: relative;
    
    .highlight {
      position: relative;
      z-index: 1;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 2px;
        left: 0;
        width: 100%;
        height: 6px;
        background: linear-gradient(45deg, rgba(22, 119, 255, 0.2) 0%, rgba(22, 119, 255, 0.1) 100%);
        z-index: -1;
        border-radius: 3px;
      }
    }
  }
  
  .featured-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
    
    .featured-card {
      background-color: #fff;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
      cursor: pointer;
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
        
        .card-image img {
          transform: scale(1.05);
        }
        
        .card-title {
          color: #1677FF;
        }
      }
      
      &.primary {
        grid-column: span 3;
        
        .card-content {
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent);
          color: white;
          padding: 30px;
          
          .card-category {
            background-color: #1677FF;
          }
          
          .card-title {
            font-size: 28px;
            margin-bottom: 16px;
            color: white;
            
            &:hover {
              color: rgba(255, 255, 255, 0.9);
            }
          }
          
          .card-excerpt {
            color: rgba(255, 255, 255, 0.9);
            margin-bottom: 20px;
          }
          
          .author-name, .post-info {
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }
      
      .card-image {
        position: relative;
        height: 220px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.2);
        }
      }
      
      &.primary .card-image {
        height: 400px;
      }
      
      .card-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        flex: 1;
        
        .card-category {
          display: inline-block;
          padding: 4px 12px;
          background-color: #f0f5ff;
          color: #1677FF;
          border-radius: 15px;
          font-size: 13px;
          font-weight: 500;
          margin-bottom: 12px;
        }
        
        .card-title {
          font-size: 18px;
          font-weight: 600;
          line-height: 1.4;
          margin-bottom: 12px;
          color: var(--bTitleColor, #333);
          transition: color 0.3s;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .card-excerpt {
          font-size: 14px;
          color: var(--bDescColor, #666);
          line-height: 1.6;
          margin-bottom: 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          flex: 1;
        }
        
        .card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          color: #999;
          margin-top: auto;
          
          .author {
            display: flex;
            align-items: center;
            
            .author-avatar {
              width: 24px;
              height: 24px;
              border-radius: 50%;
              margin-right: 8px;
              object-fit: cover;
            }
            
            .author-name {
              font-weight: 500;
            }
          }
          
          .post-info {
            display: flex;
            align-items: center;
            
            .date, .views {
              display: flex;
              align-items: center;
            }
            
            .divider {
              margin: 0 8px;
            }
          }
        }
      }
    }
  }
  
  @media (max-width: 992px) {
    .featured-grid {
      .featured-card {
        &.primary {
          .card-content {
            .card-title {
              font-size: 24px;
            }
          }
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    .featured-grid {
      grid-template-columns: 1fr;
      
      .featured-card {
        &.primary {
          grid-column: span 1;
          
          .card-image {
            height: 300px;
          }
          
          .card-content {
            padding: 20px;
            
            .card-title {
              font-size: 20px;
              margin-bottom: 10px;
            }
            
            .card-excerpt {
              margin-bottom: 16px;
            }
          }
        }
      }
    }
  }
}
</style> 