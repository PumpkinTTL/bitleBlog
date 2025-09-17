<template>
  <div 
    class="back-to-top" 
    :class="{ 'visible': isVisible, 'scrolling': isScrolling }"
    @click="scrollToTop"
    v-show="isVisible"
  >
    <div class="btn-container">
      <div class="btn-icon">
        <i class="fas fa-arrow-up"></i>
      </div>
      <div class="btn-progress" v-if="showProgress">
        <svg class="progress-ring" width="48" height="48">
          <circle
            class="progress-ring-bg"
            cx="24"
            cy="24"
            r="20"
            fill="transparent"
            :stroke-width="strokeWidth"
          />
          <circle
            class="progress-ring-fill"
            cx="24"
            cy="24"
            r="20"
            fill="transparent"
            :stroke-width="strokeWidth"
            :stroke-dasharray="circumference"
            :stroke-dashoffset="strokeDashoffset"
            transform="rotate(-90 24 24)"
          />
        </svg>
      </div>
    </div>
    
    <!-- 工具提示 -->
    <div class="tooltip" :class="{ 'show': showTooltip }">
      回到顶部
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

interface BackToTopProps {
  threshold?: number // 显示阈值
  showProgress?: boolean // 显示进度环
  smooth?: boolean // 平滑滚动
  duration?: number // 滚动持续时间
}

const props = withDefaults(defineProps<BackToTopProps>(), {
  threshold: 300,
  showProgress: true,
  smooth: true,
  duration: 800
})

const isVisible = ref(false)
const isScrolling = ref(false)
const showTooltip = ref(false)
const scrollProgress = ref(0)
const strokeWidth = 2
const radius = 20
const circumference = 2 * Math.PI * radius

// 计算进度环偏移
const strokeDashoffset = computed(() => {
  return circumference - (scrollProgress.value / 100) * circumference
})

// 更新滚动进度
const updateScrollProgress = () => {
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  
  if (scrollHeight > 0) {
    scrollProgress.value = (scrollTop / scrollHeight) * 100
  }
  
  isVisible.value = scrollTop > props.threshold
}

// 平滑滚动到顶部
const smoothScrollToTop = () => {
  const startTime = performance.now()
  const startPosition = window.pageYOffset
  
  const animateScroll = (currentTime: number) => {
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / props.duration, 1)
    
    // 使用缓动函数
    const easeOutCubic = 1 - Math.pow(1 - progress, 3)
    const position = startPosition * (1 - easeOutCubic)
    
    window.scrollTo(0, position)
    
    if (progress < 1) {
      requestAnimationFrame(animateScroll)
    } else {
      isScrolling.value = false
    }
  }
  
  isScrolling.value = true
  requestAnimationFrame(animateScroll)
}

// 直接滚动到顶部
const instantScrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

// 滚动到顶部
const scrollToTop = () => {
  if (isScrolling.value) return
  
  if (props.smooth && 'requestAnimationFrame' in window) {
    smoothScrollToTop()
  } else {
    instantScrollToTop()
  }
}

// 显示工具提示
const handleMouseEnter = () => {
  showTooltip.value = true
}

// 隐藏工具提示
const handleMouseLeave = () => {
  showTooltip.value = false
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
.back-to-top {
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  cursor: pointer;
  opacity: 0;
  visibility: hidden;
  transform: translateY(20px) scale(0.9);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  &.visible {
    opacity: 1;
    visibility: visible;
    transform: translateY(0) scale(1);
  }
  
  &.scrolling {
    pointer-events: none;
    
    .btn-icon i {
      animation: scrollingPulse 0.8s ease-in-out infinite;
    }
  }
  
  &:hover {
    transform: translateY(-4px) scale(1.05);
    
    .btn-container {
      background: linear-gradient(135deg, 
        rgba(22, 119, 255, 0.15) 0%,
        rgba(105, 177, 255, 0.1) 100%
      );
      box-shadow: 
        0 12px 32px rgba(22, 119, 255, 0.25),
        0 4px 16px rgba(22, 119, 255, 0.15);
      border-color: rgba(22, 119, 255, 0.3);
    }
    
    .btn-icon {
      color: var(--el-color-primary);
      transform: translateY(-2px) scale(1.1);
    }
    
    .progress-ring-fill {
      stroke: var(--el-color-primary);
    }
    
    .tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(-8px);
    }
  }
  
  @media (max-width: 768px) {
    bottom: 20px;
    right: 20px;
  }
}

.btn-container {
  position: relative;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%,
    rgba(248, 250, 252, 0.95) 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 0.5px solid rgba(22, 119, 255, 0.1);
  box-shadow: 
    0 8px 24px rgba(22, 119, 255, 0.12),
    0 2px 8px rgba(22, 119, 255, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg,
      rgba(255, 255, 255, 0.4) 0%,
      rgba(255, 255, 255, 0.1) 100%
    );
    opacity: 0;
    transition: opacity 0.3s ease;
  }
  
  &:hover::before {
    opacity: 1;
  }
}

.btn-icon {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: var(--el-text-color-regular);
  font-size: 16px;
  transition: all 0.3s ease;
  z-index: 2;
  
  i {
    display: block;
    transition: transform 0.3s ease;
  }
}

.btn-progress {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  
  .progress-ring {
    transform: rotate(-90deg);
    width: 100%;
    height: 100%;
  }
  
  .progress-ring-bg {
    stroke: rgba(22, 119, 255, 0.1);
    stroke-linecap: round;
  }
  
  .progress-ring-fill {
    stroke: rgba(22, 119, 255, 0.6);
    stroke-linecap: round;
    transition: all 0.3s ease;
  }
}

.tooltip {
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  background: var(--el-bg-color);
  color: var(--el-text-color-primary);
  padding: 6px 12px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  border: 0.5px solid var(--el-border-color-lighter);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    width: 0;
    height: 0;
    border-left: 5px solid transparent;
    border-right: 5px solid transparent;
    border-top: 5px solid var(--el-bg-color);
  }
  
  &.show {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-8px);
  }
}

@keyframes scrollingPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
}

// 暗色模式适配
html.dark & {
  .btn-container {
    background: linear-gradient(135deg, 
      rgba(28, 28, 30, 0.95) 0%,
      rgba(44, 44, 46, 0.9) 100%
    );
    border-color: rgba(100, 168, 255, 0.15);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.4),
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
    
    &::before {
      background: linear-gradient(135deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.05) 100%
      );
    }
  }
  
  .back-to-top:hover .btn-container {
    background: linear-gradient(135deg, 
      rgba(100, 168, 255, 0.15) 0%,
      rgba(64, 168, 255, 0.1) 100%
    );
    box-shadow: 
      0 12px 32px rgba(100, 168, 255, 0.3),
      0 4px 16px rgba(100, 168, 255, 0.2);
    border-color: rgba(100, 168, 255, 0.4);
  }
  
  .btn-icon {
    color: rgba(255, 255, 255, 0.7);
    
    .back-to-top:hover & {
      color: #64A8FF;
    }
  }
  
  .progress-ring-bg {
    stroke: rgba(100, 168, 255, 0.15);
  }
  
  .progress-ring-fill {
    stroke: rgba(100, 168, 255, 0.8);
    
    .back-to-top:hover & {
      stroke: #64A8FF;
    }
  }
  
  .tooltip {
    background: var(--el-bg-color);
    border-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
    
    &::after {
      border-top-color: var(--el-bg-color);
    }
  }
}
</style>
