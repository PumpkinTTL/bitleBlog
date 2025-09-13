<template>
  <div class="data-statistics-page">
    <div class="page-header animate-item">
      <h1 class="page-title">数据统计<span class="highlight">中心</span></h1>
      <p class="page-subtitle">探索博客数据，了解内容分布与用户活动</p>
    </div>
    
    <!-- 主体内容区域 -->
    <DataDashboard />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import DataDashboard from '@/components/data/DataDashboard.vue';

onMounted(() => {
  // 在这里可以添加页面加载时的初始化操作，例如获取实时数据
});
</script>

<style scoped lang="less">
.data-statistics-page {
  min-height: 100vh;
  padding: 20px 0 40px;
  
  .page-header {
    text-align: center;
    margin-bottom: 30px;
    
    .page-title {
      font-size: 34px;
      font-weight: 700;
      color: var(--bTitleColor, #333);
      margin-bottom: 12px;
      
      .highlight {
        position: relative;
        color: #1677FF;
        z-index: 1;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(45deg, rgba(22, 119, 255, 0.2) 0%, rgba(22, 119, 255, 0.1) 100%);
          z-index: -1;
          border-radius: 4px;
        }
      }
      
      @media (max-width: 767px) {
        font-size: 26px;
      }
    }
    
    .page-subtitle {
      font-size: 16px;
      color: var(--bDescColor, #666);
      
      @media (max-width: 767px) {
        font-size: 14px;
      }
    }
  }
  
  /* 动画样式 */
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
}
</style> 