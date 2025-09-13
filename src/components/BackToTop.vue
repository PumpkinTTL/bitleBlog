<template>
  <transition name="fade">
    <div 
      v-show="visible" 
      class="back-to-top animate__animated animate__fadeIn" 
      @click="scrollToTop"
      :style="{ bottom: offset + 'px', right: right + 'px' }"
      v-motion-pop
    >
      <i class="fas fa-arrow-up back-to-top-icon"></i>
      <span v-if="showText" class="back-to-top-text">返回顶部</span>
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';

// Props
const props = defineProps({
  // 显示阈值，默认滚动400px才显示
  visibilityHeight: {
    type: Number,
    default: 400
  },
  // 返回顶部的速度，单位毫秒
  duration: {
    type: Number,
    default: 500
  },
  // 按钮位置
  offset: {
    type: Number,
    default: 30
  },
  // 按钮右侧的偏移量
  right: {
    type: Number,
    default: 30
  },
  // 是否显示文字
  showText: {
    type: Boolean,
    default: false
  }
});

// 按钮是否可见
const visible = ref(false);

// 处理滚动事件
const handleScroll = () => {
  visible.value = window.pageYOffset > props.visibilityHeight;
};

// 平滑滚动到顶部
const scrollToTop = () => {
  const startPosition = window.pageYOffset;
  const startTime = performance.now();
  
  const animateScroll = (currentTime) => {
    const elapsedTime = currentTime - startTime;
    const progress = Math.min(elapsedTime / props.duration, 1);
    
    // 使用easeInOutCubic缓动函数使动画更自然
    const easeInOutCubic = t => 
      t < 0.5 
        ? 4 * t * t * t 
        : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    
    const easedProgress = easeInOutCubic(progress);
    
    window.scrollTo(0, startPosition * (1 - easedProgress));
    
    if (progress < 1) {
      window.requestAnimationFrame(animateScroll);
    }
  };
  
  window.requestAnimationFrame(animateScroll);
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style scoped lang="less">
.back-to-top {
  position: fixed;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  margin-bottom: env(safe-area-inset-bottom, 0);
  background: linear-gradient(135deg, #1677FF, #40a9ff);
  color: white;
  cursor: pointer;
  border-radius: 50%;
  box-shadow: 0 8px 20px rgba(22, 119, 255, 0.5), 
              0 4px 10px rgba(22, 119, 255, 0.3),
              inset 0 2px 4px rgba(255, 255, 255, 0.3),
              inset 0 -2px 4px rgba(30, 58, 138, 0.2);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform: translateZ(0);
  backface-visibility: hidden;
  overflow: hidden;
  z-index: 1000;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 60%);
    pointer-events: none;
  }
  
  &:hover {
    transform: scale(1.05) translateZ(0);
    background: linear-gradient(135deg, #40a9ff, #1677FF);
    box-shadow: 0 15px 30px rgba(22, 119, 255, 0.6), 
                0 8px 20px rgba(22, 119, 255, 0.4),
                inset 0 2px 4px rgba(255, 255, 255, 0.3),
                inset 0 -2px 4px rgba(30, 58, 138, 0.2);
    
    .back-to-top-icon {
      transform: translateY(-2px);
    }
    
    .back-to-top-text {
      display: none;
      margin-left: 6px;
      opacity: 1;
      transform: translateX(0);
    }
  }
  
  &:active {
    transform: scale(0.95) translateZ(0);
    background: linear-gradient(145deg, #0958d9, #1677FF);
    box-shadow: 0 5px 15px rgba(22, 119, 255, 0.4), 
                inset 0 2px 4px rgba(255, 255, 255, 0.2),
                inset 0 -2px 4px rgba(30, 58, 138, 0.3);
  }
  
  .back-to-top-icon {
    font-size: 22px;
    filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
    transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
  
  .back-to-top-text {
    display: none;
    font-size: 14px;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s;
    font-weight: 500;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 767px) {
  .back-to-top {
    height: 40px;
    width: 40px;
    
    .back-to-top-icon {
      font-size: 18px;
    }
  }
}
</style> 