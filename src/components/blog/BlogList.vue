<template>
  <div class="blog-list">
    <div class="list-header">
      <h2 class="section-title">博客<span class="highlight">文章</span></h2>
      
      <!-- 分类筛选器 -->
      <div class="categories-filter">
        <a 
          v-for="category in categories" 
          :key="category"
          class="category-btn"
          :class="{ 'active': currentCategory === category }"
          @click="handleCategoryChange(category)"
        >
          {{ category }}
        </a>
      </div>
    </div>
    
    <!-- 文章列表 -->
    <a-spin :spinning="loading">
      <div class="posts-grid">
        <div 
          v-for="post in posts" 
          :key="post.id"
          class="post-card"
          @click="$emit('post-click', post.id)"
        >
          <div class="card-image">
            <img :src="post.coverImage" :alt="post.title">
            <div class="card-category">{{ post.category }}</div>
          </div>
          
          <div class="card-content">
            <h3 class="card-title">{{ post.title }}</h3>
            <p class="card-excerpt">{{ post.excerpt }}</p>
            
            <div class="card-meta">
              <div class="post-author">
                <img :src="post.author.avatar" :alt="post.author.name" class="author-avatar">
                <span class="author-name">{{ post.author.name }}</span>
              </div>
              
              <div class="post-info">
                <span class="post-date">{{ formatDate(post.date) }}</span>
                <span class="divider">•</span>
                <span class="read-time">{{ post.readTime }} 分钟阅读</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 暂无数据 -->
      <div v-if="posts.length === 0 && !loading" class="empty-state">
        <a-empty description="暂无符合条件的文章" />
      </div>
    </a-spin>
    
    <!-- 分页 -->
    <div class="pagination-container" v-if="total > 0">
      <a-pagination
        v-model:current="currentPage"
        :total="total"
        :pageSize="10"
        @change="handlePageChange"
        show-less-items
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { Spin as ASpin, Empty as AEmpty, Pagination as APagination } from 'ant-design-vue';

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
  readTime?: number;
}

interface Props {
  posts: BlogPost[];
  loading: boolean;
  total: number;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'post-click', id: number): void;
  (e: 'page-change', page: number): void;
  (e: 'category-change', category: string): void;
}>();

// 本地状态
const currentPage = ref(1);
const currentCategory = ref('全部');

// 分类列表
const categories = [
  '全部',
  '前端',
  '后端',
  'DevOps',
  '架构',
  '编程语言',
  'Web技术',
  '移动开发',
  '数据科学',
  'AI'
];

// 工具函数
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

// 监听页面变化
watch(currentPage, (newPage) => {
  handlePageChange(newPage);
});

// 页面变化处理
const handlePageChange = (page: number) => {
  currentPage.value = page;
  // 通知父组件页面变化
  emit('page-change', page);
};

// 分类变化处理
const handleCategoryChange = (category: string) => {
  if (currentCategory.value === category) return;
  
  currentCategory.value = category;
  currentPage.value = 1; // 切换分类时重置页码
  // 通知父组件分类变化
  emit('category-change', category);
};
</script>

<style lang="less" scoped>
.blog-list {
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;
    flex-wrap: wrap;
    gap: 16px;
    
    .section-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--bTitleColor, #333);
      margin: 0;
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
    
    .categories-filter {
      display: flex;
      gap: 8px;
      flex-wrap: wrap;
      
      .category-btn {
        padding: 6px 16px;
        border-radius: 20px;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.2s;
        background-color: #f5f5f5;
        color: #666;
        
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
  }
  
  .posts-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 24px;
    margin-bottom: 30px;
    
    .post-card {
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
      
      .card-image {
        position: relative;
        height: 180px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
        
        .card-category {
          position: absolute;
          bottom: 12px;
          left: 12px;
          padding: 4px 12px;
          background-color: #1677FF;
          color: white;
          border-radius: 15px;
          font-size: 12px;
          font-weight: 500;
          z-index: 2;
        }
      }
      
      .card-content {
        padding: 20px;
        display: flex;
        flex-direction: column;
        flex: 1;
        
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
          flex-direction: column;
          gap: 12px;
          font-size: 13px;
          color: #999;
          margin-top: auto;
          
          .post-author {
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
              color: var(--bTitleColor, #333);
            }
          }
          
          .post-info {
            display: flex;
            align-items: center;
            
            .post-date, .read-time {
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
  
  .empty-state {
    padding: 40px 0;
    text-align: center;
  }
  
  .pagination-container {
    text-align: center;
    margin-top: 20px;
    padding: 20px 0;
  }
  
  @media (max-width: 992px) {
    .list-header {
      flex-direction: column;
      align-items: flex-start;
      
      .categories-filter {
        width: 100%;
        overflow-x: auto;
        padding-bottom: 8px;
        flex-wrap: nowrap;
        
        &::-webkit-scrollbar {
          height: 4px;
        }
        
        &::-webkit-scrollbar-thumb {
          background-color: #ddd;
          border-radius: 4px;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    .posts-grid {
      grid-template-columns: 1fr;
    }
  }
}
</style> 