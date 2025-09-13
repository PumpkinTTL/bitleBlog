<template>
  <div class="about-page">
    <div class="page-content">
      <!-- 主体内容区域 -->
      <div class="about-container">
        <AboutPage />
      </div>
    </div>
    
    <BlogFooter />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import BlogFooter from '@/components/BlogFooter.vue';
import AboutPage from '@/components/about/AboutPage.vue';

// 加载Font Awesome图标
const loadFontAwesome = () => {
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css';
  link.integrity = 'sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw==';
  link.crossOrigin = 'anonymous';
  link.referrerPolicy = 'no-referrer';
  document.head.appendChild(link);
};

onMounted(() => {
  // 检查是否已加载Font Awesome
  if (!document.querySelector('link[href*="font-awesome"]')) {
    loadFontAwesome();
  }
});
</script>

<style scoped lang="less">
.about-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
  transition: background-color var(--el-transition-duration), color var(--el-transition-duration);

  .page-content {
    flex: 1;
    padding: 15px 0 30px;
  }

  .about-container {
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }
}
</style> 