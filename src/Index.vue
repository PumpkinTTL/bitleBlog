<template>
  <div class="blog-index-page">
    <IndexHero />
    <div class="blog-content-container">
      <div class="main-content">
        <FeaturedPosts />
        <RecentPosts />
      </div>
      
      <div class="sidebar">
        <AuthorCard />
        <TagCloud />
        <PopularArticles />
        <NewsletterSignup />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Import components
import IndexHero from '@/components/index/IndexHero.vue'
import FeaturedPosts from '@/components/index/FeaturedPosts.vue'
import RecentPosts from '@/components/index/RecentPosts.vue'
import AuthorCard from '@/components/index/AuthorCard.vue'
import TagCloud from '@/components/index/TagCloud.vue'
import PopularArticles from '@/components/index/PopularArticles.vue'
import NewsletterSignup from '@/components/index/NewsletterSignup.vue'
</script>

<style lang="less" scoped>
.blog-index-page {
  width: 100%;
  min-height: 100vh;
  
  .blog-content-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
    display: flex;
    gap: 25px;
    
    .main-content {
      flex: 1;
    }
    
    .sidebar {
      width: 320px;
      flex-shrink: 0;
    }
    
    // Responsive layout
    @media (max-width: 992px) {
      flex-direction: column;
      
      .sidebar {
        width: 100%;
      }
    }
  }
}
</style> 