<template>
  <div class="about-history">
    <!-- 添加animate.css动画 -->
    <div class="section-header animate__animated animate__fadeInUp">
      <div class="section-icon animate__animated animate__bounceIn animate__faster">
        <i class="fas fa-history"></i>
      </div>
      <h2 class="section-title animate__animated animate__fadeInUp animate__faster">我们的发展历程</h2>
      <p class="section-desc animate__animated animate__fadeInUp animate__faster">从创立至今，我们一路走来的成长足迹</p>
    </div>

    <!-- 历史时间线 -->
    <div class="timeline-container">
      <div class="timeline-decoration"></div>

      <div
        v-for="(item, index) in historyItems"
        :key="index"
        :class="[
          'timeline-item',
          'animate__animated',
          'animate__fadeInUp',
          {'right-aligned': index % 2 !== 0}
        ]"
        :style="`animation-delay: ${0.1 + index * 0.05}s;`"
      >
        <div class="timeline-content">
          <div class="timeline-dot">
            <span class="pulse-circle"></span>
          </div>
          <div class="timeline-date animate__animated animate__fadeInRight" :style="`animation-delay: ${0.15 + index * 0.05}s;`">
            <span>{{ item.date }}</span>
          </div>
          <div class="timeline-card animate__animated animate__fadeInLeft" :style="`animation-delay: ${0.2 + index * 0.05}s;`">
            <div class="card-badge" v-if="index === 0">起点</div>
            <div class="card-badge" v-if="index === historyItems.length - 1">现在</div>
            <h3>{{ item.title }}</h3>
            <p>{{ item.content }}</p>
            <div 
              class="image-container" 
              v-if="item.imageUrl"
            >
              <img :src="item.imageUrl" :alt="item.title">
              <div class="image-overlay">
                <div class="overlay-icon">
                  <i class="fas fa-search-plus"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 未来展望 -->
      <div class="timeline-future animate__animated animate__fadeInUp">
        <div class="future-dot">
          <i class="fas fa-rocket"></i>
        </div>
        <div class="future-content">
          <h3>未来展望</h3>
          <p>我们将持续创新，不断优化产品体验，为用户提供更加强大、易用的博客系统。期待与您一起，共同开创更美好的未来！</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

// 历史里程碑数据
const historyItems = ref([
  {
    date: '2023年8月',
    title: '公司成立',
    content: '我们的团队在深圳正式成立，怀揣着对技术的热爱与创新的激情，开始了创业之旅。',
    imageUrl: 'https://picsum.photos/id/1015/600/300'
  },
  {
    date: '2023年11月',
    title: '首个产品发布',
    content: '经过三个月的努力，我们的第一个产品Bitle博客系统成功上线，获得了初步的用户认可。',
    imageUrl: 'https://picsum.photos/id/2/600/300'
  },
  {
    date: '2024年1月',
    title: '技术升级',
    content: '全面升级技术架构，引入最新的Vue3和Vite构建工具，提升了产品性能和开发效率。',
    imageUrl: 'https://picsum.photos/id/3/600/300'
  },
  {
    date: '2024年3月',
    title: '用户突破10万',
    content: '在短短半年时间内，我们的注册用户突破10万，月活跃用户超过5万，成为博客系统领域的新兴力量。',
    imageUrl: 'https://picsum.photos/id/4/600/300'
  },
  {
    date: '2024年5月',
    title: '获得融资',
    content: '成功获得天使轮融资，估值达到1亿元，这为我们未来的发展奠定了坚实的基础。',
    imageUrl: 'https://picsum.photos/id/5/600/300'
  }
]);

// 使用IntersectionObserver监听元素可见性
onMounted(() => {
  const animateItems = document.querySelectorAll('.timeline-item, .timeline-future');
  
  // 如果浏览器支持IntersectionObserver
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        // 当元素进入视口时添加可见类
        if (entry.isIntersecting) {
          entry.target.style.visibility = 'visible';
          observer.unobserve(entry.target); // 只触发一次
        }
      });
    }, { threshold: 0.1 }); // 降低阈值，使动画更早触发
    
    // 初始设置所有元素为不可见
    animateItems.forEach(item => {
      item.style.visibility = 'hidden';
      observer.observe(item);
    });
  } else {
    // 不支持IntersectionObserver的浏览器直接显示所有元素
    animateItems.forEach(item => {
      item.style.visibility = 'visible';
    });
  }
});
</script>

<style scoped lang="less">
.about-history {
  padding: 40px;
  
  @media (max-width: 767px) {
    padding: 30px 15px;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 50px;
    position: relative;
    
    .section-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1677FF 0%, #4096ff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 15px;
      box-shadow: 0 5px 15px rgba(22, 119, 255, 0.3);
      
      i {
        font-size: 24px;
        color: #fff;
      }
    }
    
    .section-title {
      font-size: 30px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 12px;

      @media (max-width: 767px) {
        font-size: 26px;
      }
    }

    .section-desc {
      font-size: 16px;
      color: var(--el-text-color-regular);
      max-width: 600px;
      margin: 0 auto;
    }
  }
  
  .timeline-container {
    position: relative;
    max-width: 900px;
    margin: 0 auto;
    padding-bottom: 80px;
    
    .timeline-decoration {
      position: absolute;
      left: 50%;
      top: 0;
      bottom: 50px;
      width: 4px;
      background: linear-gradient(to bottom,
        var(--el-border-color) 0%,
        var(--el-color-primary) 50%,
        var(--el-border-color) 100%
      );
      transform: translateX(-50%);
      border-radius: 4px;
      
      &::before, &::after {
        content: '';
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        width: 14px;
        height: 14px;
        border-radius: 50%;
      }
      
      &::before {
        top: -7px;
        background-color: var(--el-color-primary);
      }

      &::after {
        bottom: -7px;
        background-color: var(--el-color-primary);
      }
      
      @media (max-width: 767px) {
        left: 30px;
      }
    }
    
    .timeline-item {
      padding: 30px 0;
      position: relative;
      
      .timeline-content {
        position: relative;
        width: 45%;
        
        @media (max-width: 767px) {
          width: calc(100% - 80px);
          margin-left: 80px;
        }
        
        .timeline-dot {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background-color: var(--el-color-primary);
          top: 25px;
          right: -62px;
          border: 4px solid var(--el-bg-color);
          box-shadow: 0 0 0 4px var(--el-color-primary-light-8);
          z-index: 2;
          
          .pulse-circle {
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: var(--el-color-primary-light-7);
            animation: pulse 3s infinite;
            left: 0;
            top: 0;
          }
          
          @media (max-width: 767px) {
            left: -62px;
            right: unset;
          }
        }
        
        .timeline-date {
          position: absolute;
          top: 0;
          right: -170px;
          width: 130px;
          text-align: left;
          
          span {
            display: inline-block;
            padding: 8px 16px;
            background-color: var(--el-color-primary);
            color: var(--el-color-white);
            border-radius: 20px;
            font-weight: 500;
            font-size: 14px;
            box-shadow: 0 4px 12px var(--el-color-primary-light-7);
          }
          
          @media (max-width: 767px) {
            position: relative;
            right: unset;
            top: unset;
            width: auto;
            margin-bottom: 15px;
            text-align: left;
          }
        }
        
        .timeline-card {
          background-color: var(--el-bg-color);
          border-radius: 12px;
          padding: 25px;
          box-shadow: var(--el-box-shadow);
          border: 1px solid var(--el-border-color-lighter);
          position: relative;
          transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1), box-shadow 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
          z-index: 1;
          
          &:hover {
            transform: translateY(-3px);
            box-shadow: var(--el-box-shadow-dark);
            
            .image-container .image-overlay {
              opacity: 1;
            }
          }
          
          .card-badge {
            position: absolute;
            top: -12px;
            right: 20px;
            padding: 5px 15px;
            background: linear-gradient(135deg, #ff9500 0%, #ff6a00 100%);
            color: #fff;
            font-size: 12px;
            font-weight: 600;
            border-radius: 20px;
            box-shadow: 0 4px 10px rgba(255, 122, 0, 0.3);
          }
          
          h3 {
            color: var(--el-text-color-primary);
            margin-bottom: 12px;
            font-weight: 600;
            font-size: 20px;
          }

          p {
            color: var(--el-text-color-regular);
            margin-bottom: 18px;
            line-height: 1.6;
          }
          
          .image-container {
            position: relative;
            border-radius: 8px;
            overflow: hidden;
            
            img {
              width: 100%;
              border-radius: 6px;
              transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
            }
            
            .image-overlay {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background-color: rgba(0, 0, 0, 0.5);
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0;
              transition: opacity 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
              
              .overlay-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background-color: rgba(255, 255, 255, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                
                i {
                  font-size: 20px;
                  color: var(--el-color-primary);
                }
              }
            }
          }
        }
      }
      
      &.right-aligned {
        .timeline-content {
          margin-left: auto;
          
          @media (max-width: 767px) {
            margin-left: 80px;
            margin-right: 0;
          }
          
          .timeline-dot {
            left: -62px;
            right: unset;
            
            @media (max-width: 767px) {
              left: -62px;
            }
          }
          
          .timeline-date {
            left: -170px;
            right: unset;
            text-align: right;
            
            @media (max-width: 767px) {
              position: relative;
              left: unset;
              text-align: left;
            }
          }
        }
      }
    }
    
    .timeline-future {
      position: relative;
      max-width: 600px;
      margin: 50px auto 0;
      text-align: center;
      
      .future-dot {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: linear-gradient(135deg, #ff9500 0%, #ff6a00 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        box-shadow: 0 8px 20px rgba(255, 122, 0, 0.3);
        position: relative;
        z-index: 2;
        
        i {
          font-size: 24px;
          color: #fff;
        }
        
        &::before {
          content: '';
          position: absolute;
          width: 80px;
          height: 80px;
          border-radius: 50%;
          border: 2px dashed rgba(255, 122, 0, 0.3);
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          animation: rotate 10s linear infinite;
        }
      }
      
      .future-content {
        background-color: var(--el-bg-color);
        border-radius: 12px;
        padding: 25px;
        box-shadow: var(--el-box-shadow);
        border: 1px solid var(--el-border-color-lighter);

        h3 {
          color: var(--el-text-color-primary);
          margin-bottom: 10px;
          font-weight: 600;
          font-size: 22px;
        }

        p {
          color: var(--el-text-color-regular);
          line-height: 1.6;
        }
      }
    }
  }

  
  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.2;
    }
    100% {
      transform: scale(1);
      opacity: 0;
    }
  }
  
  @keyframes rotate {
    0% {
      transform: translate(-50%, -50%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -50%) rotate(360deg);
    }
  }
}
</style>
