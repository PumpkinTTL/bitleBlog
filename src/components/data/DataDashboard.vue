<template>
  <div class="data-dashboard animate-item">
    <!-- 站点统计 -->
    <section class="dashboard-section">
      <SiteStats />
    </section>
    
    <!-- 二级内容区：分类统计和热门标签 -->
    <div class="dashboard-row">
      <section class="dashboard-section dashboard-section-half">
        <CategoryDistribution />
      </section>
      <section class="dashboard-section dashboard-section-half">
        <PopularTags />
      </section>
    </div>
    
    <!-- 最近活动 -->
    <section class="dashboard-section">
      <RecentActivity />
    </section>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import SiteStats from './SiteStats.vue';
import CategoryDistribution from './CategoryDistribution.vue';
import PopularTags from './PopularTags.vue';
import RecentActivity from './RecentActivity.vue';
</script>

<style scoped lang="less">
.data-dashboard {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px 16px;
  
  .dashboard-section {
    margin-bottom: 20px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
  
  .dashboard-row {
    display: flex;
    gap: 20px;
    margin-bottom: 20px;
    
    @media (max-width: 768px) {
      flex-direction: column;
      gap: 20px;
    }
    
    .dashboard-section-half {
      flex: 1;
      margin-bottom: 0;
    }
  }
  
  /* 动画样式 */
  .animate-item {
    animation: fadeIn 0.8s ease forwards;
    opacity: 0;
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
}
</style> 