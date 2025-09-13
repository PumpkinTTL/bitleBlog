<template>
  <div class="related-articles animate__animated animate__fadeIn">
    <div class="section-header">
      <div class="section-title">
        <i class="fas fa-newspaper"></i>
        <span>相关推荐</span>
      </div>
      <div class="view-more">
        <a href="#" @click.prevent="handleViewMore">查看更多 <i class="fas fa-angle-right"></i></a>
      </div>
    </div>
    
    <div class="articles-grid" v-if="articles.length > 0">
      <div 
        v-for="(article, index) in articles" 
        :key="index" 
        class="article-card"
        :style="{ 'animation-delay': `${0.05 * index}s` }"
        @click="handleArticleClick(article.id, article.title)"
      >
        <div class="card-thumbnail" v-if="article.cover_image">
          <img :src="article.cover_image" :alt="article.title">
          <div class="thumbnail-overlay"></div>
        </div>
        <div class="card-content">
          <div class="card-title">{{ article.title }}</div>
          <div class="card-meta">
            <span class="meta-item">
              <i class="fas fa-eye"></i> {{ article.views || 0 }}
            </span>
            <span class="meta-item">
              <i class="fas fa-calendar-alt"></i> {{ formatDate(article.publish_time) }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="empty-state" v-else>
      <i class="fas fa-newspaper"></i>
      <p>暂无相关推荐文章</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';

interface Article {
  id: number;
  title: string;
  cover_image?: string;
  views?: number;
  publish_time?: string;
}

// 定义组件属性
const props = defineProps<{
  articles: Article[];
}>();

// 定义事件
const emit = defineEmits(['article-click', 'view-more']);

// 格式化日期
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  // 尝试转换为Date对象
  const date = new Date(dateString);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return dateString.split(' ')[0]; // 如果转换失败，返回原始日期的日期部分
  }
  
  // 格式化为 "YYYY-MM-DD"
  return date.toISOString().split('T')[0];
};

// 点击文章事件
const handleArticleClick = (id: number, title: string) => {
  emit('article-click', { id, title });
};

// 查看更多事件
const handleViewMore = () => {
  emit('view-more');
};
</script>

<style lang="less" scoped>
.related-articles {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eaecef;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 10px;
      
      i {
        font-size: 16px;
        color: #1677FF;
        width: 32px;
        height: 32px;
        background: rgba(22, 119, 255, 0.1);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }
    
    .view-more {
      a {
        font-size: 14px;
        color: #64748b;
        text-decoration: none;
        display: flex;
        align-items: center;
        gap: 4px;
        transition: color 0.3s ease;
        
        &:hover {
          color: #1677FF;
        }
        
        i {
          font-size: 12px;
          transition: transform 0.3s ease;
        }
        
        &:hover i {
          transform: translateX(3px);
        }
      }
    }
  }
  
  .articles-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    
    @media (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
    }
    
    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }
    
    .article-card {
      background: #fff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      cursor: pointer;
      border: 1px solid #f0f0f0;
      animation: fadeIn 0.5s ease forwards;
      
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
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        border-color: #e6f0ff;
        
        .card-thumbnail img {
          transform: scale(1.05);
        }
        
        .card-title {
          color: #1677FF;
        }
      }
      
      .card-thumbnail {
        height: 140px;
        position: relative;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .thumbnail-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.3));
          pointer-events: none;
        }
      }
      
      .card-content {
        padding: 15px;
        
        .card-title {
          font-size: 15px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 10px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s ease;
        }
        
        .card-meta {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .meta-item {
            font-size: 12px;
            color: #64748b;
            display: flex;
            align-items: center;
            gap: 4px;
            
            i {
              font-size: 11px;
              color: #94a3b8;
            }
          }
        }
      }
    }
  }
  
  .empty-state {
    padding: 40px 0;
    text-align: center;
    background: #f8fafc;
    border-radius: 8px;
    
    i {
      font-size: 36px;
      color: #cbd5e1;
      margin-bottom: 15px;
    }
    
    p {
      font-size: 15px;
      color: #64748b;
    }
  }
}
</style> 