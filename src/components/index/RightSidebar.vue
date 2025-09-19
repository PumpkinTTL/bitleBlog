<template>
  <div class="right-sidebar" :class="{'mobile-hidden': isMobileView}">
    <!-- Notice Section -->
    <NoticeCard />
    
    <!-- Popular Posts Section -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <span class="section-icon">
          <i class="fas fa-bookmark"></i>
        </span>
        热门推荐
      </h3>
      <div class="popular-posts">
        <a 
          :href="post.url" 
          class="popular-post-item" 
          v-for="(post, index) in popularPosts" 
          :key="index"
          @click.prevent="handlePostClick(post.url)"
        >
          <div class="post-thumb">
            <img :src="post.thumbnail" :alt="post.title">
            <div class="post-overlay">
              <span class="post-category">{{ post.category }}</span>
            </div>
          </div>
          <div class="post-info">
            <h4 class="post-title">{{ post.title }}</h4>
            <div class="post-meta">
              <span class="post-date">
                <i class="far fa-calendar-alt"></i> {{ post.date }}
              </span>
              <span class="post-views">
                <i class="fas fa-eye"></i> {{ post.views }}
              </span>
            </div>
          </div>
        </a>
      </div>
    </div>

    <!-- Tech Topics Section -->
    <div class="sidebar-section">
      <h3 class="section-title">
        <span class="section-icon">
          <i class="fas fa-lightbulb"></i>
        </span>
        技术专题
      </h3>
      <div class="tech-topics">
        <div 
          class="topic-item" 
          v-for="(topic, index) in techTopics" 
          :key="index"
          @click="handleTopicClick(topic.url)"
        >
          <div class="topic-icon" :style="{ background: topic.color }">
            <i :class="topic.icon"></i>
          </div>
          <div class="topic-content">
            <h4 class="topic-title">{{ topic.title }}</h4>
            <p class="topic-desc">{{ topic.description }}</p>
            <div class="topic-meta">
              <span class="topic-articles">{{ topic.articles }}篇文章</span>
              <span class="topic-link">查看专题 <i class="fas fa-chevron-right"></i></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Newsletter Section -->
    <div class="sidebar-section newsletter-section">
      <h3 class="section-title">
        <span class="section-icon">
          <i class="fas fa-envelope"></i>
        </span>
        订阅更新
      </h3>
      <div class="newsletter-box">
        <div class="newsletter-header">
          <div class="newsletter-icon-wrapper">
            <i class="fas fa-paper-plane newsletter-icon"></i>
          </div>
          <div class="newsletter-title">
            <h4>获取技术周刊</h4>
            <p>每周精选技术内容，直达邮箱</p>
          </div>
        </div>
        <form class="newsletter-form" @submit.prevent="handleSubscribe">
          <div class="input-wrapper">
            <i class="far fa-envelope input-icon"></i>
            <input 
              type="email" 
              v-model="email" 
              placeholder="您的邮箱地址" 
              required
              class="newsletter-input"
            >
          </div>
          <button type="submit" class="newsletter-submit">
            订阅
            <span class="btn-icon"><i class="fas fa-arrow-right"></i></span>
          </button>
        </form>
        <div class="newsletter-info">
          <i class="fas fa-shield-alt"></i> 已有 2,450+ 开发者订阅
        </div>
      </div>
    </div>

    <!-- Call To Action Section -->
    <div class="sidebar-section cta-section">
      <div class="cta-content">
        <div class="cta-icon">
          <i class="fas fa-rocket"></i>
        </div>
        <h3 class="cta-title">加入我们的技术社区</h3>
        <p class="cta-text">与数千位开发者交流、分享、共同进步</p>
        <a href="#" class="cta-button" @click.prevent="handleCTAClick">
          立即加入 <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, defineProps, defineEmits } from 'vue';
import NoticeCard from './v2/NoticeCard.vue';

const props = defineProps<{
  isMobileView?: boolean;
}>();

const emit = defineEmits<{
  (e: 'postClick', url: string): void;
  (e: 'topicClick', url: string): void;
  (e: 'subscribe', email: string): void;
  (e: 'ctaClick'): void;
}>();

// Email for newsletter
const email = ref('');

// Popular Posts Data
const popularPosts = ref([
  {
    title: 'Vue 3性能优化技巧：内存占用与渲染效率',
    thumbnail: 'https://picsum.photos/id/10/300/200',
    category: 'Vue.js',
    date: '3天前',
    views: '1.2k',
    url: '#popular1'
  },
  {
    title: 'React vs Vue: 2023年前端框架对比分析',
    thumbnail: 'https://picsum.photos/id/20/300/200',
    category: '前端',
    date: '5天前',
    views: '2.8k',
    url: '#popular2'
  },
  {
    title: 'TypeScript高级技巧：类型体操实战',
    thumbnail: 'https://picsum.photos/id/30/300/200',
    category: 'TypeScript',
    date: '1周前',
    views: '3.5k',
    url: '#popular3'
  }
]);

// Tech Topics Data
const techTopics = ref([
  {
    title: 'Vue.js深入浅出',
    description: '从基础到高级，全面掌握Vue框架',
    icon: 'fab fa-vuejs',
    color: 'linear-gradient(135deg, #42b883, #347474)',
    articles: 18,
    url: '#topic1'
  },
  {
    title: 'TypeScript精髓',
    description: '类型系统深度剖析与最佳实践',
    icon: 'fas fa-code',
    color: 'linear-gradient(135deg, #2b7489, #235a6c)',
    articles: 12,
    url: '#topic2'
  },
  {
    title: '前端工程化',
    description: '构建工具、CI/CD与自动化测试',
    icon: 'fas fa-tools',
    color: 'linear-gradient(135deg, #e9546b, #b34256)',
    articles: 15,
    url: '#topic3'
  }
]);

// Event handlers
const handlePostClick = (url: string) => {
  emit('postClick', url);
};

const handleTopicClick = (url: string) => {
  emit('topicClick', url);
};

const handleSubscribe = () => {
  emit('subscribe', email.value);
  email.value = ''; // Reset email after submit
};

const handleCTAClick = () => {
  emit('ctaClick');
};
</script>

<style lang="less" scoped>
.right-sidebar {
  width: 250px;
  flex-shrink: 0;
  position: sticky;
  top: 15px;
  height: auto;
  align-self: flex-start;
  
  @media (max-width: 1200px) {
    width: 220px;
  }
  
  @media (max-width: 992px) {
    width: 100%;
    position: relative;
    top: 0;
    margin-top: 24px;
    
    &.mobile-hidden {
      display: none;
    }
  }
  
  .sidebar-section {
    background: #fdfdfd;
    padding: 20px;
    margin-bottom: 22px;
    box-shadow: 0 3px 10px rgba(0,0,0,0.035), 0 10px 25px rgba(0,0,0,0.04);
    transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
    border-radius: 14px;
    border: 1px solid #f3f3f3;
    position: relative;
    overflow: hidden;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%);
      opacity: 0;
      transition: opacity 0.35s ease, transform 0.5s ease;
      transform: translateX(-100%);
      pointer-events: none;
    }
    
    &:hover {
      box-shadow: 0 5px 15px rgba(0,0,0,0.05), 0 15px 35px rgba(0,0,0,0.05);
      transform: translateY(-3px);
      
      &::after {
        opacity: 1;
        transform: translateX(100%);
      }
    }
    
    .section-title {
      font-size: 17.5px;
      font-weight: 700;
      color: #1a1a1a;
      margin: 0 0 25px;
      padding-bottom: 0;
      border-bottom: none;
      position: relative;
      display: flex;
      align-items: center;
      gap: 10px;
      letter-spacing: 0.3px;
      
      &::before {
        content: '';
        position: absolute;
        top: -10px;
        left: -14px;
        width: 28px;
        height: 28px;
        background: rgba(22, 119, 255, 0.04);
        border-radius: 50%;
        z-index: 0;
      }
      
      .section-icon {
        font-size: 15px;
        color: #1677FF;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 34px;
        height: 34px;
        background: linear-gradient(135deg, rgba(22, 119, 255, 0.12), rgba(22, 119, 255, 0.05));
        border-radius: 10px;
        position: relative;
        z-index: 1;
        box-shadow: 0 2px 6px rgba(22, 119, 255, 0.15);
        
        &::after {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0));
          border-radius: 12px;
          z-index: -1;
          opacity: 0.5;
        }
      }
      
      &::after {
        content: '';
        position: absolute;
        bottom: -12px;
        left: 0;
        width: 40px;
        height: 3px;
        background: linear-gradient(to right, #1677FF, #52c4ff);
        border-radius: 3px;
      }
    }
  }
  
  // Popular Posts Styling
  .popular-posts {
    display: flex;
    flex-direction: column;
    gap: 14px;
    
    .popular-post-item {
      display: flex;
      gap: 10px;
      text-decoration: none;
      transition: all 0.3s ease;
      border-radius: 8px;
      
      &:hover {
        transform: translateY(-3px);
        
        .post-thumb {
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          transform: perspective(500px) rotateY(-5deg);
          
          img {
            transform: scale(1.08);
          }
          
          .post-overlay {
            background: rgba(0, 0, 0, 0.3);
            
            .post-category {
              transform: translateY(0);
              opacity: 1;
            }
          }
        }
        
        .post-title {
          color: #1677FF;
        }
      }
      
      .post-thumb {
        width: 90px;
        height: 65px;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        flex-shrink: 0;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.06);
        transition: all 0.3s ease;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }
        
        .post-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.2);
          display: flex;
          align-items: flex-start;
          justify-content: flex-start;
          padding: 8px;
          transition: all 0.3s ease;
          
          .post-category {
            font-size: 10px;
            background: rgba(22, 119, 255, 0.9);
            color: #fff;
            padding: 2px 8px;
            border-radius: 4px;
            opacity: 0.8;
            transform: translateY(-5px);
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          }
        }
      }
      
      .post-info {
        flex: 1;
        min-width: 0;
        
        .post-title {
          font-size: 13px;
          font-weight: 600;
          color: #333;
          margin: 0 0 8px;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          transition: color 0.3s ease;
        }
        
        .post-meta {
          display: flex;
          gap: 10px;
          
          .post-date, .post-views {
            font-size: 11px;
            color: #888;
            display: flex;
            align-items: center;
            gap: 4px;
            
            i {
              font-size: 10px;
              color: #1677FF;
            }
          }
        }
      }
    }
  }
  
  // Tech Topics Styling
  .tech-topics {
    display: flex;
    flex-direction: column;
    gap: 12px;
    
    .topic-item {
      gap: 12px;
      padding: 12px;
      background: #fff;
      border-radius: 10px;
      border: 1px solid #f0f0f0;
      transition: all 0.3s ease;
      cursor: pointer;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
        
        .topic-icon {
          transform: scale(1.1);
        }
        
        .topic-title {
          color: #1677FF;
        }
        
        .topic-link {
          color: #1677FF;
          transform: translateX(5px);
          
          i {
            transform: translateX(3px);
          }
        }
      }
      
      .topic-icon {
        width: 38px;
        height: 38px;
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 16px;
        flex-shrink: 0;
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12);
        transition: all 0.3s ease;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
          border-radius: 10px;
          z-index: 1;
        }
        
        i {
          position: relative;
          z-index: 2;
        }
      }
      
      .topic-content {
        flex: 1;
        min-width: 0;
        
        .topic-title {
          font-size: 14px;
          font-weight: 600;
          color: #333;
          margin: 0 0 5px;
          transition: color 0.3s ease;
        }
        
        .topic-desc {
          font-size: 12px;
          color: #666;
          margin: 0 0 6px;
          line-height: 1.5;
        }
        
        .topic-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .topic-articles {
            font-size: 11px;
            color: #888;
            background: rgba(22, 119, 255, 0.05);
            padding: 2px 8px;
            border-radius: 4px;
          }
          
          .topic-link {
            font-size: 11px;
            color: #888;
            display: flex;
            align-items: center;
            gap: 4px;
            transition: all 0.3s ease;
            
            i {
              font-size: 9px;
              transition: transform 0.3s ease;
            }
          }
        }
      }
    }
  }
  
  // Newsletter Styling
  .newsletter-section {
    background: linear-gradient(145deg, #ffffff, #f8faff);
    border: none;
    box-shadow: 0 10px 25px rgba(22, 119, 255, 0.08);
    
    &:hover {
      transform: translateY(-5px);
      box-shadow: 0 15px 35px rgba(22, 119, 255, 0.12);
    }
    
    .section-title {
      margin-bottom: 20px;
      
      .section-icon {
        background: linear-gradient(135deg, #4096ff, #1677FF);
        color: white;
      }
    }
  }
  
  .newsletter-box {
    padding: 0;
    border-radius: 12px;
    
    .newsletter-header {
      display: flex;
      align-items: center;
      gap: 15px;
      margin-bottom: 20px;
      
      .newsletter-icon-wrapper {
        position: relative;
        width: 48px;
        height: 48px;
        flex-shrink: 0;
        
        &::before {
          content: '';
          position: absolute;
          top: -4px;
          left: -4px;
          right: -4px;
          bottom: -4px;
          background: linear-gradient(135deg, rgba(22, 119, 255, 0.3), rgba(22, 119, 255, 0.05));
          border-radius: 50%;
          z-index: 0;
          animation: pulse-slow 2.5s infinite;
        }
        
        .newsletter-icon {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, #4096ff, #1677FF);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          box-shadow: 0 4px 10px rgba(22, 119, 255, 0.25);
          position: relative;
          z-index: 1;
        }
        
        @keyframes pulse-slow {
          0% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.2); opacity: 0.4; }
          100% { transform: scale(1); opacity: 0.6; }
        }
      }
      
      .newsletter-title {
        flex: 1;
        
        h4 {
          font-size: 16px;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0 0 4px;
        }
        
        p {
          font-size: 12px;
          color: #666;
          margin: 0;
          line-height: 1.4;
        }
      }
    }
    
    .newsletter-form {
      display: flex;
      flex-direction: column;
      gap: 12px;
      margin-bottom: 14px;
      
      .input-wrapper {
        position: relative;
        width: 100%;
        
        .input-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: #aaa;
          font-size: 14px;
          transition: color 0.3s ease;
          pointer-events: none;
        }
        
        .newsletter-input {
          width: 100%;
          height: 42px;
          border: 1px solid #e6e6e6;
          border-radius: 8px;
          padding: 0 12px 0 36px;
          font-size: 13px;
          outline: none;
          transition: all 0.3s ease;
          background: #fff;
          
          &:focus {
            border-color: #1677FF;
            box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.12);
            
            & + .input-icon {
              color: #1677FF;
            }
          }
          
          &::placeholder {
            color: #aaa;
          }
        }
      }
      
      .newsletter-submit {
        width: 100%;
        height: 42px;
        background: linear-gradient(135deg, #1677FF, #40a9ff);
        border: none;
        border-radius: 8px;
        color: white;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(255,255,255,0) 0%, 
            rgba(255,255,255,0.2) 50%, 
            rgba(255,255,255,0) 100%);
          transform: translateX(-100%);
          transition: transform 0.8s ease;
        }
        
        .btn-icon {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.15);
          transition: all 0.3s ease;
          
          i {
            font-size: 11px;
            transition: transform 0.3s ease;
          }
        }
        
        &:hover {
          background: linear-gradient(135deg, #0958d9, #1677FF);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(22, 119, 255, 0.25);
          
          &::before {
            transform: translateX(100%);
          }
          
          .btn-icon {
            background: rgba(255, 255, 255, 0.25);
            
            i {
              transform: translateX(2px);
            }
          }
        }
        
        &:active {
          transform: translateY(0);
        }
      }
    }
    
    .newsletter-info {
      font-size: 12px;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 6px;
      
      i {
        color: #1677FF;
        font-size: 12px;
      }
    }
  }
  
  // CTA Section Styling
  .cta-section {
    padding: 0;
    background: linear-gradient(135deg, #1677FF, #4096ff);
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
      top: -150px;
      right: -150px;
      border-radius: 50%;
      z-index: 1;
    }
    
    &::after {
      content: '';
      position: absolute;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0) 70%);
      bottom: -100px;
      left: -100px;
      border-radius: 50%;
      z-index: 1;
    }
    
    .cta-content {
      padding: 30px 24px;
      text-align: center;
      position: relative;
      z-index: 2;
      
      .cta-icon {
        width: 60px;
        height: 60px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 50%;
        margin: 0 auto 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        color: white;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
          border-radius: 50%;
          animation: pulse 2s infinite;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      }
      
      .cta-title {
        font-size: 22px;
        font-weight: 700;
        color: white;
        margin: 0 0 10px;
        text-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
      
      .cta-text {
        font-size: 14px;
        color: rgba(255, 255, 255, 0.9);
        margin: 0 0 20px;
        line-height: 1.6;
      }
      
      .cta-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        padding: 10px 24px;
        background: white;
        color: #1677FF;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 600;
        text-decoration: none;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
        
        i {
          font-size: 12px;
          transition: transform 0.3s ease;
        }
        
        &:hover {
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(0, 0, 0, 0.15);
          
          i {
            transform: translateX(3px);
          }
        }
      }
    }
  }
}
</style> 