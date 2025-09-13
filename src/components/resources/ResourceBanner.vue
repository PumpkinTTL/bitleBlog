<template>
  <div class="resource-banner">
    <a-carousel
      autoplay
      class="banner-carousel"
      :dots-class="'slick-dots custom-dots'"
    >
      <div
        v-for="(banner, index) in banners"
        :key="index"
        class="banner-slide"
        @click="onBannerClick(banner)"
      >
        <div class="banner-image" :style="{ backgroundImage: `url(${banner.imageUrl})` }">
          <div class="banner-content">
            <h3 class="banner-title">{{ banner.title }}</h3>
            <p class="banner-description">{{ banner.description }}</p>
            <a-button type="primary" class="banner-button">立即查看</a-button>
          </div>
        </div>
      </div>
    </a-carousel>
  </div>
</template>

<script setup lang="ts">
// 定义属性和事件
const props = defineProps({
  banners: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['banner-click']);

// 处理banner点击
const onBannerClick = (banner: any) => {
  emit('banner-click', banner);
};
</script>

<style scoped lang="less">
.resource-banner {
  margin-bottom: 20px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  
  .banner-carousel {
    height: 220px;
    
    :deep(.slick-track) {
      display: flex;
      align-items: stretch;
    }
    
    :deep(.slick-slide) {
      height: auto;
      
      > div {
        height: 100%;
      }
    }
    
    :deep(.custom-dots) {
      li {
        button {
          background: rgba(255, 255, 255, 0.5);
        }
        
        &.slick-active {
          button {
            background: #1677FF;
          }
        }
      }
    }
  }
  
  .banner-slide {
    height: 100%;
    cursor: pointer;
    transition: transform 0.3s;
    
    &:hover {
      transform: scale(1.01);
    }
  }
  
  .banner-image {
    height: 100%;
    background-size: cover;
    background-position: center;
    position: relative;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to right, rgba(0, 0, 0, 0.7) 0%, rgba(0, 0, 0, 0.4) 40%, rgba(0, 0, 0, 0) 100%);
    }
  }
  
  .banner-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    padding: 25px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    max-width: 60%;
    
    .banner-title {
      color: #ffffff;
      font-size: 24px;
      font-weight: 600;
      margin-bottom: 10px;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
    }
    
    .banner-description {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      margin-bottom: 20px;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    }
    
    .banner-button {
      width: fit-content;
    }
  }
}

// 移动端适配
@media screen and (max-width: 767px) {
  .resource-banner {
    .banner-carousel {
      height: 180px;
    }
    
    .banner-content {
      padding: 15px;
      max-width: 85%;
      
      .banner-title {
        font-size: 18px;
        margin-bottom: 5px;
      }
      
      .banner-description {
        font-size: 12px;
        margin-bottom: 10px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    }
  }
}
</style> 