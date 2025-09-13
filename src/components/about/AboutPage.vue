<template>
  <div class="about-container">
    <!-- 页面头部 - 添加animate.css动画 -->
    <div class="page-header animate__animated animate__fadeInUp animate__faster">
      <h1 class="page-title">关于<span class="highlight">我们</span></h1>
      <p class="page-subtitle">了解我们的故事、团队和愿景</p>

      <!-- 装饰元素 -->
      <div class="header-decoration">
        <div class="decoration-item item-1 animate__animated animate__zoomIn animate__faster"></div>
        <div class="decoration-item item-2 animate__animated animate__zoomIn animate__faster"></div>
        <div class="decoration-item item-3 animate__animated animate__zoomIn animate__faster"></div>
      </div>
    </div>

    <!-- 导航标签 - 添加animate.css动画 -->
    <div class="about-tabs animate__animated animate__fadeInUp animate__faster">
      <div class="tab-container">
        <div
          v-for="(tab, index) in tabs"
          :key="tab.key"
          :class="['tab-item', 'animate__animated', 'animate__fadeInUp', { active: activeTab === tab.key }]"
          :style="`animation-delay: ${0.05 + index * 0.05}s`"
          @click="switchTab(tab.key)"
        >
          <div class="tab-icon">
            <i :class="tab.icon"></i>
          </div>
          <span>{{ tab.label }}</span>
          <div class="tab-hover-effect"></div>
        </div>
      </div>
    </div>

    <!-- 内容区域 - 添加animate.css动画 -->
    <div class="tab-content animate__animated animate__fadeInUp animate__faster">
      <transition
        :name="transitionName"
        mode="out-in"
      >
        <component :is="currentTabComponent" :key="activeTab" />
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import AboutHistory from './AboutHistory.vue';
import AboutVision from './AboutVision.vue';
import AboutTeam from './AboutTeam.vue';
import AboutContact from './AboutContact.vue';

// 定义标签页
const tabs = [
  { key: 'history', label: '我们的历程', icon: 'fas fa-history', component: AboutHistory },
  { key: 'vision', label: '愿景使命', icon: 'fas fa-lightbulb', component: AboutVision },
  { key: 'team', label: '团队介绍', icon: 'fas fa-users', component: AboutTeam },
  { key: 'contact', label: '联系我们', icon: 'fas fa-envelope', component: AboutContact }
];

// 当前活动标签
const activeTab = ref('history');

// 过渡动画名称
const transitionName = ref('fade');

// 当前要显示的组件
const currentTabComponent = computed(() => {
  const tab = tabs.find(t => t.key === activeTab.value);
  return tab ? tab.component : AboutHistory;
});

// 切换标签
const switchTab = (tabKey) => {
  activeTab.value = tabKey;
};
</script>

<style scoped lang="less">
.about-container {
  padding: 30px 0;
  position: relative;
  
  .page-header {
    text-align: center;
    margin-bottom: 40px;
    position: relative;
    
    .page-title {
      font-size: 38px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      margin-bottom: 15px;
      position: relative;
      display: inline-block;

      .highlight {
        position: relative;
        color: var(--el-color-primary);
        z-index: 1;

        &::after {
          content: '';
          position: absolute;
          bottom: 6px;
          left: 0;
          width: 100%;
          height: 10px;
          background: linear-gradient(45deg, var(--el-color-primary-light-7) 0%, var(--el-color-primary-light-8) 100%);
          z-index: -1;
          border-radius: 4px;
        }
      }

      @media (max-width: 767px) {
        font-size: 32px;
      }
    }

    .page-subtitle {
      font-size: 18px;
      color: var(--el-text-color-regular);
      max-width: 600px;
      margin: 0 auto;

      @media (max-width: 767px) {
        font-size: 16px;
      }
    }
    
    .header-decoration {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: -1;
      overflow: hidden;
      pointer-events: none;
      
      .decoration-item {
        position: absolute;
        border-radius: 50%;
        
        &.item-1 {
          width: 80px;
          height: 80px;
          background: linear-gradient(135deg, var(--el-color-primary-light-8) 0%, var(--el-color-primary-light-9) 100%);
          top: -20px;
          right: 15%;
        }

        &.item-2 {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, var(--el-color-primary-light-8) 0%, var(--el-color-primary-light-9) 100%);
          bottom: 0;
          left: 15%;
        }

        &.item-3 {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, var(--el-color-warning-light-8) 0%, var(--el-color-warning-light-9) 100%);
          top: 50%;
          right: 25%;
        }
      }
    }
  }
  
  .about-tabs {
    margin-bottom: 35px;
    
    .tab-container {
      display: flex;
      justify-content: center;
      flex-wrap: wrap;
      gap: 15px;
      max-width: 800px;
      margin: 0 auto;
      
      @media (max-width: 767px) {
        gap: 10px;
      }
      
      .tab-item {
        display: flex;
        align-items: center;
        padding: 14px 25px;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        background-color: var(--el-bg-color);
        box-shadow: var(--el-box-shadow-light);
        border: 1px solid var(--el-border-color-lighter);
        color: var(--el-text-color-primary);
        position: relative;
        overflow: hidden;
        
        .tab-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background-color: var(--el-color-primary-light-9);
          margin-right: 12px;
          transition: all 0.3s ease;

          i {
            font-size: 16px;
            color: var(--el-color-primary);
            transition: all 0.3s ease;
          }
        }
        
        span {
          font-weight: 500;
          font-size: 15px;
          transition: all 0.3s ease;
          color: var(--el-text-color-primary);
        }
        
        .tab-hover-effect {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
        }
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
        }
        
        &.active {
          color: #fff;
          box-shadow: 0 8px 20px rgba(22, 119, 255, 0.25);
          
          .tab-hover-effect {
            opacity: 1;
          }
          
          .tab-icon {
            background-color: rgba(255, 255, 255, 0.2);
            
            i {
              color: #fff;
            }
          }
          
          span {
            color: #fff;
            position: relative;
            z-index: 1;
          }
          
          .tab-icon {
            position: relative;
            z-index: 1;
          }
          
          &::after {
            content: '';
            position: absolute;
            bottom: 5px;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 3px;
            background-color: rgba(255, 255, 255, 0.7);
            border-radius: 3px;
            z-index: 1;
          }
        }
        
        @media (max-width: 767px) {
          padding: 12px 18px;
          
          .tab-icon {
            width: 30px;
            height: 30px;
            margin-right: 10px;
            
            i {
              font-size: 14px;
            }
          }
          
          span {
            font-size: 14px;
          }
        }
      }
    }
  }
  
  .tab-content {
    background-color: var(--el-bg-color);
    border-radius: 16px;
    box-shadow: var(--el-box-shadow);
    border: 1px solid var(--el-border-color-lighter);
    overflow: hidden;
  }
  
  /* 平滑渐入动画 */
  .animate-item {
    animation: smoothIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    animation-delay: var(--animate-delay, 0s);
  }
  
  @keyframes smoothIn {
    0% {
      opacity: 0;
      transform: scale(0.98) translateY(10px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  /* 过渡动画 */
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.3s ease;
  }
  
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
}
</style>
