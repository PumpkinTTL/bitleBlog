<template>
  <div class="featured-posts">
    <div class="section-title">
      <h2>精选文章</h2>
      <div class="title-underline"></div>
    </div>
    <div class="featured-posts-grid">
      <div 
        v-for="(post, index) in featuredPosts" 
        :key="post.id" 
        class="featured-post-card" 
        :class="`animate__animated animate__fadeInUp`"
        :style="`animation-delay: ${0.1 + index * 0.1}s`"
        @click="navigateToPost(post.id)"
      >
        <div class="post-image">
          <img :src="post.cover" alt="封面图">
          <div class="post-badge" v-if="post.isHot">
            <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="fire" aria-hidden="true"><path d="M834.1 469.2A347.49 347.49 0 00751.2 354l-29.1-26.7a8.09 8.09 0 00-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-122.6-54-179.9-1-1.4-2.3-2.1-3.7-2.1h-.8c-1.7.4-3.1 1.8-3.6 3.5-1.5 6-2.8 11.9-4.2 18-10.9 46.6-50.7 85.7-98.2 96.9-4.5 1.1-8.9 2-13.3 2.8-.7.1-1.4.3-2.1.4-.9.2-1.8.3-2.7.5-4.9.9-9.8 1.6-14.8 2.1-1.4.2-2.8.3-4.2.4-1.5.1-3 .2-4.5.3-1.5.1-3 .1-4.6.1-.5 0-1.1 0-1.7.1h-4.8c-1.7 0-3.5-.1-5.2-.2-1.7-.1-3.4-.2-5.1-.4-1.7-.2-3.3-.4-5-.6-1.6-.2-3.2-.5-4.8-.8l-5.1-1c-1.5-.3-3.1-.7-4.6-1.1-1.5-.4-3-.8-4.5-1.2-5.9-1.8-11.8-4-17.6-6.6-5.7-2.6-11.3-5.5-16.7-8.9-5.5-3.3-10.7-7.1-15.8-11l-11.6-9.3c-29.1-22.6-52.2-53.2-64.1-88.2l-3.2.2c-1.4.1-2.8 0-4.1-.3a4.7 4.7 0 01-3.6-3c-.6-1.7-1.1-3.4-1.6-5.1-.3-1-.5-2-.8-3-29 28.4-60.3 52.1-90.1 67.4-1.4.7-3 .5-4.2-.5-1.2-1-1.9-2.5-1.7-4.1 6.3-47.4 10.6-95.6 13-125.7 3.6-42.8 19.6-71.5 27.8-90.9 12.5-29.1 39.1-53.9 66.1-72.3 27.5-18.8 56.9-32.7 84.4-39 9.6-2.2 18.7-3.7 27.2-4.7V414c0 15.7 12.8 28.4 28.5 28.4 6.9 0 13.3-2.5 18.3-6.6l83.4-68.2h42.4l90.8 64.2c6.8 4.8 14.8 7.4 23.1 7.4h76.3c19.7 0 35.7-16 35.7-35.7v-33.7l14.7 13.6C863.4 548.1 851 721.5 687.6 831.2a18.54 18.54 0 01-11.7 4.1h-49.9c-5.2 0-10.1-2.1-13.7-5.9-3.6-3.7-5.6-8.7-5.5-14v-32.7c0-2.7-.9-5.3-2.5-7.5-1.7-2.2-4-3.7-6.6-4.3-22.5-5.7-43.5-13.8-62.7-24.1-3.2-1.7-7-1.7-10.2 0-3.2 1.7-5.2 5-5.2 8.6v38.7c0 6.3-3.3 12.1-8.7 15.3-65.3 39.8-153.6 64.1-238.9 62.3-320.8-26.3-347.2-307.7-347.2-472.2 0-108.9 67.4-228.1 124.7-312.2l198 160.7c1.2 1 2.7 1.5 4.2 1.5 1.6 0 3.1-.5 4.2-1.5l198-160.7c57.3 84.1 124.7 203.3 124.7 312.2V419c-.1 4.5 1.6 8.9 4.7 12.2zM478.7 762.5c14.9 4.9 30.8 7.4 46.9 7.5 16.1-.1 32-2.6 46.9-7.5 14.4-4.7 34.9-14.5 34.9-44V614.3c0-2.7-1.1-5.3-3-7.2s-4.5-3-7.1-3h-143c-2.7 0-5.3 1.1-7.1 3-1.9 1.9-3 4.5-3 7.2v104.2c-.2 29.5 20.4 39.3 34.5 44z"></path></svg></i>
            热门
          </div>
        </div>
        <div class="post-content">
          <div class="post-meta">
            <div class="post-category">{{ post.category }}</div>
            <div class="post-date">{{ formatDate(post.publishTime) }}</div>
          </div>
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          <div class="post-footer">
            <div class="post-author">
              <img :src="post.author.avatar" alt="作者头像">
              <span>{{ post.author.name }}</span>
            </div>
            <div class="post-stats">
              <div class="stat-item">
                <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="eye" aria-hidden="true"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg></i>
                <span>{{ post.views }}</span>
              </div>
              <div class="stat-item">
                <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="message" aria-hidden="true"><path d="M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"></path></svg></i>
                <span>{{ post.comments }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Author {
  id: number;
  name: string;
  avatar: string;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  publishTime: string;
  views: number;
  comments: number;
  isHot: boolean;
  author: Author;
}

// 模拟数据
const featuredPosts = ref<Post[]>([
  {
    id: 1,
    title: 'Vue 3 组合式 API 实战指南',
    excerpt: '深入理解Vue 3的组合式API，从基础概念到高级应用，全面提升你的Vue开发技能。',
    cover: '/src/assets/images/blog1.jpg',
    category: '前端开发',
    publishTime: '2023-10-15',
    views: 3542,
    comments: 68,
    isHot: true,
    author: {
      id: 1,
      name: '南瓜头',
      avatar: '/src/assets/images/avatar1.jpg'
    }
  },
  {
    id: 2,
    title: 'TypeScript 高级类型系统详解',
    excerpt: '探索TypeScript的类型系统，了解如何利用高级类型特性提高代码质量和开发效率。',
    cover: '/src/assets/images/blog2.jpg',
    category: '编程语言',
    publishTime: '2023-10-10',
    views: 2371,
    comments: 42,
    isHot: false,
    author: {
      id: 2,
      name: '技术小达人',
      avatar: '/src/assets/images/avatar2.jpg'
    }
  },
  {
    id: 3,
    title: 'RESTful API 设计最佳实践',
    excerpt: '掌握RESTful API设计的关键原则和最佳实践，构建高效、稳定且易维护的API。',
    cover: '/src/assets/images/blog3.jpg',
    category: '后端开发',
    publishTime: '2023-10-05',
    views: 1984,
    comments: 35,
    isHot: true,
    author: {
      id: 3,
      name: '后端工程师',
      avatar: '/src/assets/images/avatar3.jpg'
    }
  }
]);

// 格式化日期函数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 导航到博客文章详情页
const navigateToPost = (id: number) => {
  router.push(`/post/${id}`);
};

onMounted(() => {
  // 实际应用中，这里可以调用API获取精选文章数据
  console.log('FeaturedPosts component mounted');
});
</script>

<style lang="less" scoped>
.featured-posts {
  margin-bottom: 25px;
  
  .section-title {
    margin-bottom: 18px;
    position: relative;
    
    h2 {
      font-size: 1.5rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 8px;
    }
    
    .title-underline {
      width: 40px;
      height: 3px;
      background: linear-gradient(90deg, #1677FF, #69b1ff);
      border-radius: 2px;
    }
  }
  
  .featured-posts-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    
    @media (max-width: 768px) {
      grid-template-columns: 1fr;
    }
  }
  
  .featured-post-card {
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    background-color: #fff;
    height: 100%;
    cursor: pointer;
    border: 1px solid #f0f0f0;
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(22, 119, 255, 0.15);
      border-color: transparent;
      
      .post-image img {
        transform: scale(1.05);
      }
      
      .post-title {
        color: #1677FF;
      }
    }
    
    .post-image {
      height: 180px;
      position: relative;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.5s ease;
      }
      
      .post-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        background: linear-gradient(90deg, #fa8c16, #ffd591);
        color: white;
        padding: 3px 8px;
        border-radius: 4px;
        font-size: 0.75rem;
        font-weight: 500;
        display: flex;
        align-items: center;
        gap: 4px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        
        i {
          font-size: 0.8rem;
          display: flex;
          
          svg {
            width: 1em;
            height: 1em;
          }
        }
      }
    }
    
    .post-content {
      padding: 16px;
      
      .post-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 10px;
        
        .post-category {
          color: #1677FF;
          font-size: 0.8rem;
          font-weight: 500;
        }
        
        .post-date {
          color: #999;
          font-size: 0.75rem;
        }
      }
      
      .post-title {
        font-size: 1.15rem;
        font-weight: 600;
        line-height: 1.4;
        margin-bottom: 10px;
        color: #333;
        transition: color 0.2s ease;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 3.1rem;
      }
      
      .post-excerpt {
        color: #666;
        font-size: 0.85rem;
        line-height: 1.5;
        margin-bottom: 14px;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        height: 3.8rem;
      }
      
      .post-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top: 1px solid #f0f0f0;
        padding-top: 10px;
        
        .post-author {
          display: flex;
          align-items: center;
          gap: 6px;
          
          img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid #f5f7fa;
          }
          
          span {
            font-size: 0.8rem;
            color: #444;
          }
        }
        
        .post-stats {
          display: flex;
          gap: 10px;
          
          .stat-item {
            display: flex;
            align-items: center;
            gap: 3px;
            color: #888;
            font-size: 0.75rem;
            
            i {
              font-size: 0.85rem;
              display: flex;
              
              svg {
                width: 1em;
                height: 1em;
              }
            }
          }
        }
      }
    }
  }
}

.ant-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}
</style> 