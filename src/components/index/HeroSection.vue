<template>
  <div class="hero-section">
    <div class="hero-content">
      <div class="hero-text animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
        <h1>探索知识的<span class="highlight">世界</span></h1>
        <p>分享技术、学习、成长，与志同道合的开发者一起构建更好的未来</p>
        <div class="hero-actions">
          <button class="primary-btn">
            <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="plus" aria-hidden="true"><path d="M482 152h60q8 0 8 8v704q0 8-8 8h-60q-8 0-8-8V160q0-8 8-8z"></path><path d="M176 474h672q8 0 8 8v60q0 8-8 8H176q-8 0-8-8v-60q0-8 8-8z"></path></svg></i>
            立即加入
          </button>
          <button class="secondary-btn">
            <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="read" aria-hidden="true"><path d="M928 161H699.2c-49.1 0-97.1 14.1-138.2 40.7L512 233l-48.9-31.3C422 175.1 373.9 161 324.8 161H96c-17.7 0-32 14.3-32 32v568c0 17.7 14.3 32 32 32h228.8c49.1 0 97.1 14.1 138.2 40.7l44.7 28.9c1.3.8 2.8 1.3 4.3 1.3s3-.4 4.3-1.3l44.7-28.9c41.1-26.6 89.1-40.7 138.2-40.7H928c17.7 0 32-14.3 32-32V193c0-17.7-14.3-32-32-32zM324.8 721H136V233h188.8c35.4 0 69.8 10.1 99.5 29.2l48.8 31.3 6.9 4.5v423c-47.6-25.6-100.8-39-155.2-39zm563.2 0H699.2c-54.4 0-107.6 13.4-155.2 39V298l6.9-4.5 48.9-31.3c29.7-19.1 64.1-29.2 99.5-29.2H888v488z"></path></svg></i>
            了解更多
          </button>
        </div>
      </div>
      
      <div class="hero-image animate__animated animate__fadeInRight" style="animation-delay: 0.4s">
        <img src="/src/assets/blog-hero.svg" alt="Blog Hero Image">
      </div>
    </div>
    
    <div class="hero-stats animate__animated animate__fadeInUp" style="animation-delay: 0.6s">
      <div class="stat-item">
        <div class="stat-number">{{ formatNumber(totalArticles) }}+</div>
        <div class="stat-label">优质文章</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ formatNumber(totalAuthors) }}+</div>
        <div class="stat-label">专业作者</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ formatNumber(monthlyVisits) }}+</div>
        <div class="stat-label">月访问量</div>
      </div>
      <div class="stat-item">
        <div class="stat-number">{{ totalTopics }}</div>
        <div class="stat-label">技术主题</div>
      </div>
    </div>
    
    <div class="hero-wave">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path d="M0,50 C150,10 350,90 500,50 C650,10 850,90 1000,50 C1150,10 1350,90 1440,50 L1440,100 L0,100 Z" fill="#f5f7fa"></path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

// 数据
const totalArticles = ref(1256);
const totalAuthors = ref(317);
const monthlyVisits = ref(125000);
const totalTopics = ref(42);

// 格式化数字为千分位显示
const formatNumber = (num: number): string => {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

// 随机动画效果
const animateValue = (element: HTMLElement, start: number, end: number, duration: number) => {
  let startTimestamp: number | null = null;
  const step = (timestamp: number) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    const value = Math.floor(progress * (end - start) + start);
    element.textContent = formatNumber(value);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    } else {
      element.textContent = formatNumber(end);
    }
  };
  window.requestAnimationFrame(step);
};

onMounted(() => {
  // 实际应用中可能会从API获取这些统计数据
  console.log('HeroSection component mounted');
  
  // 添加数字增长动画
  const statElements = document.querySelectorAll('.stat-number');
  
  statElements.forEach((el) => {
    const value = parseInt(el.textContent || '0', 10);
    if (el instanceof HTMLElement) {
      el.textContent = '0';
      setTimeout(() => {
        animateValue(el, 0, value, 1500);
      }, 600);
    }
  });
});
</script>

<style lang="less" scoped>
.hero-section {
  position: relative;
  background: linear-gradient(135deg, #1677FF, #4096ff);
  color: white;
  padding: 30px 0 20px;
  border-radius: 0 0 20px 20px;
  overflow: hidden;
  margin-bottom: 20px;
  box-shadow: 0 5px 15px rgba(22, 119, 255, 0.15);
  
  @media (max-width: 768px) {
    padding: 25px 0 20px;
    border-radius: 0 0 15px 15px;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: -5%;
    right: -5%;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    z-index: 0;
  }
  
  &::after {
    display: none; // 移除一个装饰元素
  }
  
  .hero-content {
    position: relative;
    z-index: 2;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 20px;
    display: flex;
    align-items: center;
    
    @media (max-width: 992px) {
      flex-direction: column;
      text-align: center;
    }
  }
  
  .hero-text {
    flex: 1;
    padding-right: 30px;
    
    @media (max-width: 992px) {
      padding-right: 0;
      margin-bottom: 20px;
    }
    
    h1 {
      font-size: 2.2rem;
      font-weight: 700;
      margin-bottom: 12px;
      line-height: 1.2;
      letter-spacing: -0.02em;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      @media (max-width: 768px) {
        font-size: 1.8rem;
        margin-bottom: 8px;
      }
      
      .highlight {
        position: relative;
        display: inline-block;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 100%;
          height: 8px;
          background-color: rgba(255, 255, 255, 0.4);
          z-index: -1;
          border-radius: 4px;
        }
      }
    }
    
    p {
      font-size: 1rem;
      margin-bottom: 16px;
      line-height: 1.5;
      opacity: 0.9;
      max-width: 90%;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
      
      @media (max-width: 992px) {
        max-width: 100%;
      }
      
      @media (max-width: 768px) {
        font-size: 0.9rem;
        margin-bottom: 12px;
      }
    }
    
    .hero-actions {
      display: flex;
      gap: 12px;
      
      @media (max-width: 992px) {
        justify-content: center;
      }
      
      @media (max-width: 480px) {
        flex-direction: column;
        gap: 8px;
      }
      
      button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        font-size: 0.9rem;
        font-weight: 500;
        padding: 8px 16px;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        
        i {
          font-size: 16px;
          
          svg {
            width: 1em;
            height: 1em;
          }
        }
      }
      
      .primary-btn {
        background-color: white;
        color: #1677FF;
        border: none;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          background-color: #f8f8f8;
        }
      }
      
      .secondary-btn {
        background-color: rgba(255, 255, 255, 0.2);
        color: white;
        border: 1px solid rgba(255, 255, 255, 0.4);
        
        &:hover {
          background-color: rgba(255, 255, 255, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
      }
    }
  }
  
  .hero-image {
    flex: 0 0 30%;
    max-width: 300px;
    filter: drop-shadow(0 5px 15px rgba(0, 0, 0, 0.15));
    animation: float 6s ease-in-out infinite;
    
    @media (max-width: 992px) {
      max-width: 220px;
    }
    
    @media (max-width: 768px) {
      display: none; // 在移动端隐藏图片
    }
    
    img {
      width: 100%;
      height: auto;
    }
  }
  
  .hero-stats {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: space-between;
    max-width: 1280px;
    margin: 25px auto 0;
    padding: 12px 20px;
    background: rgba(255, 255, 255, 0.12);
    backdrop-filter: blur(8px);
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    
    @media (max-width: 992px) {
      margin: 20px 20px 0;
    }
    
    @media (max-width: 768px) {
      flex-wrap: wrap;
      gap: 10px;
      padding: 10px 15px;
    }
    
    @media (max-width: 480px) {
      display: none; // 在小屏幕上隐藏统计信息
    }
    
    .stat-item {
      text-align: center;
      flex: 1;
      
      @media (max-width: 768px) {
        flex: 0 0 45%;
      }
      
      .stat-number {
        font-size: 1.6rem;
        font-weight: 700;
        margin-bottom: 3px;
        background: linear-gradient(90deg, #ffffff, #f0f0f0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        text-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
        
        @media (max-width: 992px) {
          font-size: 1.4rem;
        }
      }
      
      .stat-label {
        font-size: 0.8rem;
        opacity: 0.85;
        font-weight: 500;
      }
    }
  }
  
  .hero-wave {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30px;
    z-index: 1;
    
    @media (max-width: 768px) {
      height: 20px;
    }
    
    svg {
      width: 100%;
      height: 100%;
      display: block;
    }
  }
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-5px);
  }
  100% {
    transform: translateY(0px);
  }
}

.ant-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}
</style> 