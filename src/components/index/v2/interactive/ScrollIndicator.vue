<template>
  <div class="scroll-indicator" :class="{ 'visible': isVisible }">
    <!-- 进度条 -->
    <div class="progress-bar">
      <div 
        class="progress-fill" 
        :style="{ width: `${scrollProgress}%` }"
      ></div>
    </div>
    
    <!-- 进度百分比 -->
    <div class="progress-text" v-if="showPercentage">
      {{ Math.round(scrollProgress) }}%
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

interface ScrollIndicatorProps {
  showPercentage?: boolean
  threshold?: number // 显示阈值
  position?: 'top' | 'bottom' | 'left' | 'right'
}

const props = withDefaults(defineProps<ScrollIndicatorProps>(), {
  showPercentage: false,
  threshold: 100,
  position: 'top'
})

const scrollProgress = ref(0)
const isVisible = ref(false)

const updateScrollProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  
  if (scrollHeight > 0) {
    scrollProgress.value = (scrollTop / scrollHeight) * 100
  }
  
  isVisible.value = scrollTop > props.threshold
}

onMounted(() => {
  window.addEventListener('scroll', updateScrollProgress, { passive: true })
  updateScrollProgress()
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateScrollProgress)
})
</script>

<style lang="less" scoped>
.scroll-indicator {
  position: fixed;
  z-index: 1002;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &.visible {
    opacity: 1;
    visibility: visible;
  }
  
  // 顶部位置
  &:not(.position-bottom):not(.position-left):not(.position-right) {
    top: 60px;
    left: 0;
    right: 0;
    height: 3px;
    
    .progress-bar {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.05);
      backdrop-filter: blur(8px);
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, 
          #1677FF 0%, 
          #69B1FF 50%, 
          #40A8FF 100%
        );
        box-shadow: 0 2px 8px rgba(22, 119, 255, 0.3);
        transition: width 0.1s ease-out;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          top: 0;
          right: 0;
          width: 20px;
          height: 100%;
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0), 
            rgba(255, 255, 255, 0.3)
          );
        }
      }
    }
    
    .progress-text {
      position: absolute;
      top: 100%;
      right: 20px;
      background: var(--el-bg-color);
      color: var(--el-text-color-primary);
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
      margin-top: 4px;
    }
  }
  
  // 底部位置
  &.position-bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 3px;
    
    .progress-bar {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.05);
      
      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #1677FF 0%, #69B1FF 100%);
        transition: width 0.1s ease-out;
      }
    }
  }
  
  // 左侧位置
  &.position-left {
    top: 60px;
    bottom: 0;
    left: 0;
    width: 3px;
    
    .progress-bar {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.05);
      
      .progress-fill {
        width: 100%;
        background: linear-gradient(180deg, #1677FF 0%, #69B1FF 100%);
        transition: height 0.1s ease-out;
        height: var(--progress-height, 0%);
      }
    }
  }
  
  // 右侧位置
  &.position-right {
    top: 60px;
    bottom: 0;
    right: 0;
    width: 3px;
    
    .progress-bar {
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.05);
      
      .progress-fill {
        width: 100%;
        background: linear-gradient(180deg, #1677FF 0%, #69B1FF 100%);
        transition: height 0.1s ease-out;
        height: var(--progress-height, 0%);
      }
    }
  }
}

// 暗色模式适配
html.dark & {
  .scroll-indicator {
    .progress-bar {
      background: rgba(255, 255, 255, 0.08);
      
      .progress-fill {
        background: linear-gradient(90deg, 
          #64A8FF 0%, 
          #40A8FF 50%, 
          #69B1FF 100%
        );
        box-shadow: 0 2px 8px rgba(100, 168, 255, 0.4);
        
        &::after {
          background: linear-gradient(90deg, 
            rgba(255, 255, 255, 0), 
            rgba(255, 255, 255, 0.2)
          );
        }
      }
    }
    
    .progress-text {
      background: var(--el-bg-color);
      color: var(--el-text-color-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    }
  }
  
  &.position-left,
  &.position-right {
    .progress-bar .progress-fill {
      background: linear-gradient(180deg, #64A8FF 0%, #40A8FF 100%);
    }
  }
  
  &.position-bottom {
    .progress-bar .progress-fill {
      background: linear-gradient(90deg, #64A8FF 0%, #40A8FF 100%);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .scroll-indicator {
    &:not(.position-left):not(.position-right) {
      height: 2px;
    }
    
    &.position-left,
    &.position-right {
      width: 2px;
    }
    
    .progress-text {
      font-size: 10px;
      padding: 2px 6px;
      right: 12px;
    }
  }
}
</style>
