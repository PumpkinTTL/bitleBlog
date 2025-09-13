<template>
  <div class="blog-sidebar">
    <!-- 热门文章 -->
    <div class="sidebar-section popular-posts">
      <h3 class="section-title">热门文章</h3>
      <ul class="post-list">
        <li v-for="post in popularPosts" :key="post.id" class="post-item" @click="$emit('post-click', post.id)">
          <div class="post-image">
            <img :src="post.coverImage" :alt="post.title">
          </div>
          <div class="post-info">
            <h4 class="post-title">{{ post.title }}</h4>
            <div class="post-meta">
              <span class="post-date">{{ formatDate(post.date) }}</span>
              <span class="post-views"><i class="fas fa-eye"></i> {{ formatNumber(post.views) }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 最新文章 -->
    <div class="sidebar-section latest-posts">
      <h3 class="section-title">最新文章</h3>
      <ul class="post-list">
        <li v-for="post in latestPosts" :key="post.id" class="post-item" @click="$emit('post-click', post.id)">
          <div class="post-image">
            <img :src="post.coverImage" :alt="post.title">
          </div>
          <div class="post-info">
            <h4 class="post-title">{{ post.title }}</h4>
            <div class="post-meta">
              <span class="post-date">{{ formatDate(post.date) }}</span>
              <span class="post-category">{{ post.category }}</span>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- 热门标签 -->
    <div class="sidebar-section trending-tags">
      <h3 class="section-title">热门标签</h3>
      <div class="tag-cloud">
        <a 
          v-for="tag in trendingTags" 
          :key="tag.id" 
          class="tag-item" 
          @click.prevent="$emit('tag-click', tag.slug)"
          :style="{
            fontSize: `${calculateFontSize(tag.count)}rem`,
            opacity: calculateOpacity(tag.count)
          }"
        >
          #{{ tag.name }}
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

// 接收父组件传递的数据
interface Author {
  id: number;
  name: string;
  avatar: string;
}

interface BlogPost {
  id: number;
  title: string;
  coverImage: string;
  date: string;
  category: string;
  tags: string[];
  views: number;
  author: Author;
}

interface Tag {
  id: number;
  name: string;
  slug: string;
  count: number;
}

interface Props {
  popularPosts: BlogPost[];
  latestPosts: BlogPost[];
  trendingTags: Tag[];
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'tag-click', slug: string): void;
  (e: 'post-click', id: number): void;
}>();

// 工具函数
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
};

const formatNumber = (num: number): string => {
  return num > 999 ? (num / 1000).toFixed(1) + 'k' : num.toString();
};

// 标签字体大小计算
const calculateFontSize = (count: number): number => {
  const maxCount = Math.max(...props.trendingTags.map(t => t.count));
  const minCount = Math.min(...props.trendingTags.map(t => t.count));
  const minSize = 0.85;
  const maxSize = 1.3;
  
  // 线性映射
  return minSize + ((count - minCount) / (maxCount - minCount)) * (maxSize - minSize);
};

// 标签透明度计算
const calculateOpacity = (count: number): number => {
  const maxCount = Math.max(...props.trendingTags.map(t => t.count));
  const minCount = Math.min(...props.trendingTags.map(t => t.count));
  const minOpacity = 0.6;
  const maxOpacity = 1;
  
  // 线性映射
  return minOpacity + ((count - minCount) / (maxCount - minCount)) * (maxOpacity - minOpacity);
};
</script>

<style lang="less" scoped>
.blog-sidebar {
  .sidebar-section {
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    padding: 20px;
    margin-bottom: 24px;
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--bTitleColor, #333);
      margin: 0 0 16px;
      padding-bottom: 12px;
      border-bottom: 1px solid #f0f0f0;
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        left: 0;
        bottom: -1px;
        width: 40px;
        height: 3px;
        background-color: #1677FF;
        border-radius: 3px;
      }
    }
    
    // 热门文章和最新文章
    &.popular-posts,
    &.latest-posts {
      .post-list {
        margin: 0;
        padding: 0;
        list-style: none;
        
        .post-item {
          display: flex;
          margin-bottom: 16px;
          padding-bottom: 16px;
          border-bottom: 1px dashed #f0f0f0;
          cursor: pointer;
          transition: transform 0.2s;
          
          &:last-child {
            margin-bottom: 0;
            padding-bottom: 0;
            border-bottom: none;
          }
          
          &:hover {
            transform: translateX(5px);
            
            .post-title {
              color: #1677FF;
            }
          }
          
          .post-image {
            flex: 0 0 70px;
            height: 70px;
            margin-right: 12px;
            border-radius: 6px;
            overflow: hidden;
            
            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }
          
          .post-info {
            flex: 1;
            min-width: 0; // 防止flex子项溢出
            
            .post-title {
              font-size: 15px;
              font-weight: 500;
              line-height: 1.4;
              margin: 0 0 8px;
              color: var(--bTitleColor, #333);
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              overflow: hidden;
              transition: color 0.2s;
            }
            
            .post-meta {
              display: flex;
              align-items: center;
              font-size: 12px;
              color: #999;
              
              .post-date,
              .post-views,
              .post-category {
                margin-right: 10px;
                
                &:last-child {
                  margin-right: 0;
                }
              }
              
              .post-category {
                color: #1677FF;
              }
            }
          }
        }
      }
    }
    
    // 热门标签
    &.trending-tags {
      .tag-cloud {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .tag-item {
          display: inline-block;
          padding: 4px 10px;
          background-color: #f5f5f5;
          border-radius: 15px;
          color: #666;
          text-decoration: none;
          transition: all 0.2s;
          cursor: pointer;
          
          &:hover {
            background-color: #1677FF;
            color: #fff;
            transform: translateY(-2px);
          }
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .blog-sidebar {
    .sidebar-section {
      padding: 16px;
      
      &.popular-posts,
      &.latest-posts {
        .post-list {
          .post-item {
            .post-image {
              flex: 0 0 60px;
              height: 60px;
            }
            
            .post-info {
              .post-title {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style> 