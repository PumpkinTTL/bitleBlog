<template>
  <div class="blog-page">
    <!-- Page header in its own row - full width -->
    <!-- <div class="header-container animate-item" style="animation-delay: 0.1s;">
      <div class="page-header">
        <h1 class="page-title">技术<span class="highlight">博客</span></h1>
        <p class="page-subtitle">分享前沿技术、解决方案与开发心得</p>
      </div>
    </div> -->

    <div class="page-container">
      <!-- Left sidebar with popular tags -->
      <div class="left-sidebar animate-item" :class="{'mobile-open': isMobileMenuOpen}" style="animation-delay: 0.05s;">
        <!-- Mobile sidebar header -->
        <div class="mobile-sidebar-header">
          <div class="header-logo">
            <i class="fas fa-layer-group logo-icon"></i>
            <span>BitlEBlog</span>
          </div>

          <!-- Mobile close button -->
          <div class="mobile-close-btn" @click="toggleMobileMenu">
            <i class="fas fa-times"></i>
          </div>
        </div>

        <!-- 关于本站组件 -->
        <AboutSite />
		
        <!-- 本月热门组件 -->
        <MonthlyHotArticles />

      </div>

      <!-- Main content area -->
      <div class="main-area">
        <!-- 使用新的文章列表组件 -->
        <ArticleList />
        <!-- 标签内容 -->
        <!-- <Tags></Tags> -->
      </div>
      <!-- 右边内容 -->
      <div class="right-sidebar animate-item" style="animation-delay: 0.25s;">
        <!-- 技术工具推荐组件 -->
        <TechToolsRecommend @tool-click="handleToolClick" @more-click="handleMoreToolsClick" />

        <!-- 商品推荐组件 - 复用技术工具推荐组件 -->
        <TechToolsRecommend section-title="精选商品" section-subtitle="优质商品推荐" section-icon="fas fa-shopping-cart"
          :custom-tools="productData" :max-items-per-category="4" more-button-text="查看更多商品"
          @tool-click="handleProductClick" @more-click="handleMoreProductsClick">
          <!-- 使用插槽自定义商品图标/图片 -->
          <template #icon="{ tool }">
            <!-- 如果有图片就显示图片，否则显示图标 -->
            <img v-if="tool.image" :src="tool.image" :alt="tool.name" />
            <i v-else :class="tool.icon"></i>
          </template>
        </TechToolsRecommend>
      </div>
    </div>

    <!-- Floating menu button for mobile -->
    <div class="mobile-menu-toggle animate-item" :class="{'active': isMobileMenuOpen}" style="animation-delay: 1.2s;"
      @click="toggleMobileMenu">
      <i class="fas fa-bars"></i>
    </div>

    <!-- <BackToTop class="animate-item" style="animation-delay: 1.5s;" /> -->

    <!-- Overlay for mobile menu -->
    <div class="mobile-overlay" v-if="isMobileMenuOpen" @click="toggleMobileMenu"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BackToTop } from '@/components/index';
import AboutSite from '@/components/index/AboutSite.vue';
import MonthlyHotArticles from '@/components/index/MonthlyHotArticles.vue';
import TechToolsRecommend from '@/components/index/TechToolsRecommend.vue';
import ArticleList from '@/components/index/ArticleList.vue';


// 定义类型
interface Product {
  id: number;
  name: string;
  description: string;
  icon: string;
  image?: string; // 商品图片
  color: string;
  type: 'free' | 'paid' | 'open-source';
  rating: number;
  url: string;
  category: string;
  price?: string; // 商品价格
}

const isMobileMenuOpen = ref(false);




// Toggle mobile menu function
const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Animation on scroll system
const animatedItems = ref<Element[]>([]);
const observeElements = (): void => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(item => {
    observer.observe(item);
    animatedItems.value.push(item);
  });
};



// 右侧栏事件处理函数
// 处理工具点击事件
const handleToolClick = (tool: any): void => {
  console.log('工具点击:', tool);
  // 可以在这里添加自定义逻辑，比如统计、跳转等
};

// 处理更多工具点击事件
const handleMoreToolsClick = (): void => {
  console.log('查看更多工具');
  // 可以跳转到工具页面
  router.push('/tools');
};

// 处理商品点击事件
const handleProductClick = (product: any): void => {
  console.log('商品点击:', product);
  // 可以在这里添加自定义逻辑，比如统计、跳转等
};

// 处理更多商品点击事件
const handleMoreProductsClick = (): void => {
  console.log('查看更多商品');
  // 可以跳转到商品页面
  router.push('/products');
};

// Lifecycle hooks
onMounted(async (): Promise<void> => {
  // 初始化动画
  observeElements();

  // 添加平滑滚动行为
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(this: Element, e: Event) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href) {
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth'
          });
        }
      }
    });
  });
});



// 商品推荐数据
const productData: Product[] = [
  {
    id: 1,
    name: '联通流量卡',
    description: '大流量不限速，全国通用',
    icon: 'fas fa-sim-card',
    color: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
    type: 'paid',
    rating: 4.8,
    url: 'https://example.com/unicom-card',
    category: 'telecom',
    price: '¥29/月'
  },
  {
    id: 2,
    name: '移动流量卡',
    description: '5G高速网络，超值套餐',
    icon: 'fas fa-mobile-alt',
    color: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
    type: 'paid',
    rating: 4.6,
    url: 'https://example.com/mobile-card',
    category: 'telecom',
    price: '¥39/月'
  },
  {
    id: 3,
    name: '电信流量卡',
    description: '稳定网络，优质服务',
    icon: 'fas fa-wifi',
    color: 'linear-gradient(135deg, #667eea, #764ba2)',
    type: 'paid',
    rating: 4.7,
    url: 'https://example.com/telecom-card',
    category: 'telecom',
    price: '¥35/月'
  },
  {
    id: 4,
    name: '云服务器',
    description: '高性能云计算服务',
    icon: 'fas fa-server',
    color: 'linear-gradient(135deg, #f093fb, #f5576c)',
    type: 'paid',
    rating: 4.9,
    url: 'https://example.com/cloud-server',
    category: 'hosting',
    price: '¥99/月'
  }
];

// 在其他变量定义后，添加router
const router = useRouter();

</script>

<style lang="less" scoped>

.blog-page {
  position: relative;
  min-height: 100vh;
  padding: 20px 0 40px;
  overflow: hidden;
  
  // Animation system
  .animate-item {
    animation: smoothIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }
  
  @keyframes smoothIn {
    0% {
      opacity: 0;
      transform: scale(0.95) translateY(20px);
    }
    60% {
      opacity: 0.8;
      transform: scale(1.02) translateY(-5px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  .animate-on-scroll {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.8s cubic-bezier(0.4, 0, 0.2, 1);
    
    &.animated {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  // Header container (full width)
  .header-container {
    min-width: 1440px;
    margin: 0 auto 35px;
    padding: 0 16px;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: -80px;
      right: -150px;
      width: 300px;
      height: 300px;
      background: radial-gradient(circle, rgba(22,119,255,0.05) 0%, rgba(22,119,255,0) 70%);
      border-radius: 50%;
      z-index: -1;
    }
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0px;
      left: -100px;
      width: 200px;
      height: 200px;
      background: radial-gradient(circle, rgba(240,100,100,0.04) 0%, rgba(240,100,100,0) 70%);
      border-radius: 50%;
      z-index: -1;
    }
    
    @media (max-width: 992px) {
      padding: 0 12px;
      margin-bottom: 28px;
    }
  }
  
  // Page container
  .page-container {
    position: relative;
    max-width: 1440px;
    margin: 0 auto;
    display: flex;
    gap: 24px;
    border-radius: 4px;
    
    &::before {
      content: '';
      position: absolute;
      top: 100px;
      right: -100px;
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(22,119,255,0.03) 0%, rgba(22,119,255,0) 70%);
      z-index: -1;
    }
    
    @media (max-width: 1200px) {
      gap: 20px;
    }
    
    @media (max-width: 992px) {
      flex-direction: column;
      padding: 0 12px;
      gap: 16px;
    }
  }
  
  // Page header
  .page-header {
    text-align: center;
    padding: 20px 0;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 2px;
      background: linear-gradient(to right, rgba(22,119,255,0), rgba(22,119,255,0.5), rgba(22,119,255,0));
      border-radius: 2px;
    }
    
    .page-title {
      font-size: 36px;
      font-weight: 800;
      color: #1e293b;
      margin-bottom: 15px;
      letter-spacing: 0.5px;
      position: relative;
      display: inline-block;
      
      .highlight {
        position: relative;
        color: #1677FF;
        z-index: 1;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: -2px;
          width: calc(100% + 4px);
          height: 10px;
          background: linear-gradient(to right, rgba(22,119,255,0.2), rgba(22,119,255,0.1));
          z-index: -1;
          border-radius: 5px;
        }
      }
      
      @media (max-width: 767px) {
        font-size: 28px;
      }
    }
    
    .page-subtitle {
      font-size: 16px;
      color: #64748b;
      letter-spacing: 0.3px;
      max-width: 500px;
      margin: 0 auto;
      line-height: 1.6;
      
      @media (max-width: 767px) {
        font-size: 14px;
      }
    }
  }
  
  // Left sidebar
  .left-sidebar {
    width: 280px;
    flex-shrink: 0;
    position: sticky;
    height: auto;
    min-height: 100%;
    align-self: flex-start;
    
    @media (max-width: 1200px) {
      width: 260px;
    }
    
    @media (max-width: 992px) {
      position: fixed;
      top: 0;
      left: -300px; // Off-screen initially
      height: 100vh;
      width: 280px;
             background: var(--el-bg-color);;
      box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      overflow-y: auto;
      padding: 0;
      transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      
      // Show the mobile header on mobile
      .mobile-sidebar-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .sidebar-section {
        margin: 15px;
        // border-radius: 8px;
        background: var(--el-bg-color);
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      }
      
      // When mobile menu is open
      &.mobile-open {
        left: 0;
      }
    }
    
    // Mobile sidebar header
    .mobile-sidebar-header {
      display: none;
      padding: 20px 15px;
      background: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color-lighter);
      
      @media (max-width: 992px) {
        display: flex;
        justify-content: space-between;
        align-items: center;

      }
      
      .header-logo {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .logo-icon {
          font-size: 24px;
          color: #1677FF;
          background: rgba(22, 119, 255, 0.1);
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
        }
        
        span {
          font-size: 20px;
          font-weight: 700;
          color: #1677FF;
        }
      }
      
      .mobile-close-btn {
        width: 36px;
        height: 36px;
        color: #666;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f9fbfd;
        border-radius: 8px;
        cursor: pointer;
        
        &:hover {
          color: #1677FF;
          background: rgba(22, 119, 255, 0.1);
        }
      }
    }
    
    .sidebar-section {
      background: var(--el-bg-color);
      padding: 22px;
      margin-bottom: 22px;
      // box-shadow: 0 3px 10px rgba(0,0,0,0.035), 0 10px 25px rgba(0,0,0,0.04);
      transition: all 0.35s cubic-bezier(0.25, 0.8, 0.25, 1);
      // border-radius: 14px;
      // border: 1px solid var(--el-border-color-lighter);
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
      
      // Popular tags styling
      .popular-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .tag-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background: rgba(22, 119, 255, 0.05);
          border-radius: 4px;
          color: #555;
          font-size: 13px;
          transition: all 0.2s ease;
          text-decoration: none;
          width: calc(50% - 4px);
          
          .tag-count {
            background: rgba(22, 119, 255, 0.1);
            color: #1677FF;
            border-radius: 10px;
            padding: 1px 6px;
            font-size: 11px;
            min-width: 20px;
            text-align: center;
          }
          
          &:hover {
            background: rgba(22, 119, 255, 0.1);
            color: #1677FF;
            transform: translateY(-2px);
          }
        }
      }
      
      // Archives list styling
      .archives-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        .archive-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          color: #555;
          font-size: 14px;
          transition: all 0.2s;
          text-decoration: none;
          border-bottom: 1px dashed #f0f0f0;
          
          &:last-child {
            border-bottom: none;
          }
          
          .archive-count {
            background: #f9fbfd;
            color: #666;
            border-radius: 10px;
            padding: 2px 8px;
            font-size: 12px;
            min-width: 24px;
            text-align: center;
            transition: all 0.2s;
          }
          
          &:hover {
            color: #1677FF;
            padding-left: 5px;
            
            .archive-count {
              background: rgba(22, 119, 255, 0.1);
              color: #1677FF;
            }
          }
        }
      }





      // Recent Comments section styling
      .recent-comments-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 12px;

        .comment-item {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          padding: 12px;
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.25s ease, border-left-color 0.25s ease;
          border-radius: 8px;
          border-left: 3px solid transparent;

          &:last-child {
            border-bottom: none;
            padding-bottom: 12px;
          }
          
          &:hover {
            background-color: #f9faff;
            border-left-color: #1677FF;
          }

          .comment-avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
            border: 1px solid #eee;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .comment-content {
            flex: 1;
            min-width: 0;

            .comment-author {
              font-size: 14.5px;
              font-weight: 600;
              color: #1677FF;
              display: block;
              margin-bottom: 6px;
            }

            .comment-text {
              font-size: 13.8px;
              color: #4a4a4a;
              line-height: 1.55;
              margin: 0;
              
              a {
                color: inherit;
                text-decoration: none;
                transition: color 0.2s ease;
                
                &:hover {
                  color: #1677FF;
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }



      // Featured Articles section styling
      .featured-articles-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 12px;

        .featured-article-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #333;
          font-size: 13.8px;
          text-decoration: none;
          padding: 8px 10px;
          border-radius: 6px;
          transition: color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
          line-height: 1.55;

          .article-dot {
            width: 8px;
            height: 8px;
            background-color: #1677FF;
            border-radius: 50%;
            flex-shrink: 0;
            transition: all 0.25s ease;
          }

          &:hover {
            color: #1677FF;
            transform: translateX(5px);
            background-color: rgba(22, 119, 255, 0.06);

            .article-dot {
              background-color: #0056b3;
              transform: scale(1.25);
              box-shadow: 0 0 6px rgba(22, 119, 255, 0.7);
            }
          }
        }
      }
    }
  }

  // Right sidebar - 右侧边栏样式
  .right-sidebar {
    width: 280px;
    flex-shrink: 0;
    position: sticky;
    height: auto;
    align-self: flex-start;

    @media (max-width: 1200px) {
      width: 260px;
    }

    @media (max-width: 992px) {
      width: 100%;
      position: relative;
      top: 0;
      margin-top: 24px;
    }
  }

  // Main content area
  .main-area {
    flex: 1;
    min-width: 0;

    @media (max-width: 992px) {
      width: 100%;
    }
  }


/* 暗色模式样式已统一在 App.vue 中管理 */
}
</style>


