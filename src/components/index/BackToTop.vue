<template>
  <div class="back-to-top" :class="{ 'visible': showButton }">
    <button class="back-btn" @click="scrollToTop" :title="'返回顶部'">
      <i class="ant-icon">
        <svg viewBox="64 64 896 896" focusable="false" data-icon="vertical-align-top" aria-hidden="true">
          <path d="M859.9 168H164.1c-4.5 0-8.1 3.6-8.1 8v60c0 4.4 3.6 8 8.1 8h695.8c4.5 0 8.1-3.6 8.1-8v-60c0-4.4-3.6-8-8.1-8zM518.3 355a8 8 0 00-12.6 0l-112 141.7a7.98 7.98 0 006.3 12.9h73.9V848c0 4.4 3.6 8 8 8h60c4.4 0 8-3.6 8-8V509.7H624c6.7 0 10.4-7.7 6.3-12.9L518.3 355z"></path>
        </svg>
      </i>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const showButton = ref(false);
const scrollThreshold = 300; // 滚动多少距离后显示按钮

const checkScroll = () => {
  showButton.value = window.scrollY > scrollThreshold;
};

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

onMounted(() => {
  window.addEventListener('scroll', checkScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', checkScroll);
});
</script>

<style lang="less" scoped>
.back-to-top {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 100;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s, transform 0.3s;
  pointer-events: none;
  
  &.visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
  
  .back-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background-color: white;
    color: #1677FF;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    border: none;
    outline: none;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(22, 119, 255, 0.2);
      color: #1677FF;
    }
    
    i {
      font-size: 20px;
      
      svg {
        width: 1em;
        height: 1em;
      }
    }
  }
}

@media (max-width: 480px) {
  .back-to-top {
    bottom: 15px;
    right: 12px;
    
    .back-btn {
      width: 34px;
      height: 34px;
      
      i {
        font-size: 18px;
      }
    }
  }
}

.ant-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}
</style> 