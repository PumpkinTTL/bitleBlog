<template>
  <div class="theme-toggle" :class="{ 'dark': isDark }">
    <div 
      class="toggle-container" 
      :class="{ 'active': isDark }"
      @click="toggleTheme"
    >
      <!-- 太阳图标 -->
      <div class="icon sun-icon" :class="{ 'visible': !isDark }">
        <i class="fas fa-sun"></i>
      </div>
      
      <!-- 月亮图标 -->
      <div class="icon moon-icon" :class="{ 'visible': isDark }">
        <i class="fas fa-moon"></i>
      </div>
      
      <!-- 滑块 -->
      <div class="slider" :class="{ 'moved': isDark }"></div>
    </div>
    
    <!-- 工具提示 -->
    <div class="tooltip" :class="{ 'show': showTooltip }">
      {{ isDark ? '切换到亮色模式' : '切换到暗色模式' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 响应式状态
const isDark = ref(false)
const showTooltip = ref(false)

// 检查当前主题
const checkTheme = () => {
  const htmlElement = document.documentElement
  isDark.value = htmlElement.classList.contains('dark')
}

// 切换主题
const toggleTheme = () => {
  const htmlElement = document.documentElement
  
  if (isDark.value) {
    // 切换到亮色模式
    htmlElement.classList.remove('dark')
    localStorage.setItem('theme', 'light')
    isDark.value = false
  } else {
    // 切换到暗色模式
    htmlElement.classList.add('dark')
    localStorage.setItem('theme', 'dark')
    isDark.value = true
  }
  
  // 触发自定义事件通知主题变化
  window.dispatchEvent(new CustomEvent('theme-changed', {
    detail: { theme: isDark.value ? 'dark' : 'light' }
  }))
}

// 显示工具提示
const handleMouseEnter = () => {
  showTooltip.value = true
}

// 隐藏工具提示
const handleMouseLeave = () => {
  showTooltip.value = false
}

// 监听系统主题变化
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
const handleSystemThemeChange = (e: MediaQueryListEvent) => {
  // 如果用户没有手动设置主题，则跟随系统
  const savedTheme = localStorage.getItem('theme')
  if (!savedTheme) {
    if (e.matches) {
      document.documentElement.classList.add('dark')
      isDark.value = true
    } else {
      document.documentElement.classList.remove('dark')
      isDark.value = false
    }
  }
}

onMounted(() => {
  // 初始化主题
  const savedTheme = localStorage.getItem('theme')
  const systemPrefersDark = mediaQuery.matches
  
  if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
    document.documentElement.classList.add('dark')
    isDark.value = true
  } else {
    document.documentElement.classList.remove('dark')
    isDark.value = false
  }
  
  // 监听系统主题变化
  mediaQuery.addEventListener('change', handleSystemThemeChange)
  
  // 监听其他地方触发的主题变化
  window.addEventListener('theme-changed', checkTheme)
})

onUnmounted(() => {
  mediaQuery.removeEventListener('change', handleSystemThemeChange)
  window.removeEventListener('theme-changed', checkTheme)
})
</script>

<style lang="less" scoped>
.theme-toggle {
  position: relative;
  display: inline-block;
}

.toggle-container {
  position: relative;
  width: 52px;
  height: 28px;
  background: linear-gradient(135deg, 
    rgba(255, 193, 7, 0.1) 0%,
    rgba(255, 235, 59, 0.08) 100%
  );
  border: 0.5px solid rgba(255, 193, 7, 0.2);
  border-radius: 14px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  overflow: hidden;
  box-shadow: 
    0 2px 8px rgba(255, 193, 7, 0.15),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
      transparent,
      rgba(255, 255, 255, 0.3),
      transparent
    );
    transition: left 0.6s ease;
  }
  
  &:hover {
    transform: translateY(-1px) scale(1.02);
    box-shadow: 
      0 4px 16px rgba(255, 193, 7, 0.25),
      inset 0 1px 0 rgba(255, 255, 255, 0.4);
    
    &::before {
      left: 100%;
    }
    
    .slider {
      transform: scale(1.1);
    }
  }
  
  &.active {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.12) 0%,
      rgba(139, 92, 246, 0.1) 100%
    );
    border-color: rgba(99, 102, 241, 0.25);
    box-shadow: 
      0 2px 8px rgba(99, 102, 241, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    
    &:hover {
      box-shadow: 
        0 4px 16px rgba(99, 102, 241, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }
    
    &::before {
      background: linear-gradient(90deg,
        transparent,
        rgba(255, 255, 255, 0.2),
        transparent
      );
    }
  }
}

.icon {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  opacity: 0;
  scale: 0.8;
  
  &.visible {
    opacity: 1;
    scale: 1;
  }
}

.sun-icon {
  left: 4px;
  color: #FF9800;
  
  &.visible {
    animation: sunRotate 0.6s ease-out;
  }
}

.moon-icon {
  right: 4px;
  color: #3F51B5;
  
  &.visible {
    animation: moonGlow 0.6s ease-out;
  }
}

.slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 24px;
  height: 24px;
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.9) 100%
  );
  border-radius: 50%;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 2px 8px rgba(0, 0, 0, 0.15),
    0 1px 3px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  border: 0.5px solid rgba(0, 0, 0, 0.05);
  
  &.moved {
    transform: translateX(24px);
    background: linear-gradient(135deg, 
      rgba(55, 65, 81, 0.9) 0%,
      rgba(75, 85, 99, 0.8) 100%
    );
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.3),
      0 1px 3px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    border-color: rgba(255, 255, 255, 0.1);
  }
}

.tooltip {
  position: absolute;
  top: -40px;
  left: 50%;
  transform: translateX(-50%) translateY(4px);
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
  z-index: 1000;
  
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
  
  .theme-toggle:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-4px);
  }
}

@keyframes sunRotate {
  0% {
    transform: translateY(-50%) rotate(0deg) scale(0.8);
    opacity: 0;
  }
  50% {
    transform: translateY(-50%) rotate(180deg) scale(1.1);
    opacity: 0.8;
  }
  100% {
    transform: translateY(-50%) rotate(360deg) scale(1);
    opacity: 1;
  }
}

@keyframes moonGlow {
  0% {
    transform: translateY(-50%) scale(0.8);
    opacity: 0;
    filter: drop-shadow(0 0 0 rgba(63, 81, 181, 0.5));
  }
  50% {
    transform: translateY(-50%) scale(1.1);
    opacity: 0.8;
    filter: drop-shadow(0 0 8px rgba(63, 81, 181, 0.6));
  }
  100% {
    transform: translateY(-50%) scale(1);
    opacity: 1;
    filter: drop-shadow(0 0 4px rgba(63, 81, 181, 0.4));
  }
}

// 暗色模式适配
html.dark & {
  .toggle-container {
    background: linear-gradient(135deg, 
      rgba(99, 102, 241, 0.15) 0%,
      rgba(139, 92, 246, 0.12) 100%
    );
    border-color: rgba(99, 102, 241, 0.3);
    box-shadow: 
      0 2px 8px rgba(0, 0, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    
    &:hover {
      box-shadow: 
        0 4px 16px rgba(99, 102, 241, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.15);
    }
    
    &::before {
      background: linear-gradient(90deg,
        transparent,
        rgba(255, 255, 255, 0.15),
        transparent
      );
    }
    
    &:not(.active) {
      background: linear-gradient(135deg, 
        rgba(255, 193, 7, 0.08) 0%,
        rgba(255, 235, 59, 0.06) 100%
      );
      border-color: rgba(255, 193, 7, 0.15);
      box-shadow: 
        0 2px 8px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
      
      &:hover {
        box-shadow: 
          0 4px 16px rgba(255, 193, 7, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.12);
      }
    }
  }
  
  .sun-icon {
    color: #FFB74D;
  }
  
  .moon-icon {
    color: #7986CB;
    
    &.visible {
      filter: drop-shadow(0 0 6px rgba(121, 134, 203, 0.5));
    }
  }
  
  .slider {
    &:not(.moved) {
      background: linear-gradient(135deg, 
        rgba(255, 183, 77, 0.9) 0%,
        rgba(255, 193, 7, 0.8) 100%
      );
      box-shadow: 
        0 2px 8px rgba(255, 193, 7, 0.3),
        0 1px 3px rgba(255, 193, 7, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
      border-color: rgba(255, 193, 7, 0.3);
    }
    
    &.moved {
      background: linear-gradient(135deg, 
        rgba(121, 134, 203, 0.9) 0%,
        rgba(99, 102, 241, 0.8) 100%
      );
      box-shadow: 
        0 2px 8px rgba(99, 102, 241, 0.4),
        0 1px 3px rgba(99, 102, 241, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      border-color: rgba(99, 102, 241, 0.3);
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

// 响应式设计
@media (max-width: 768px) {
  .toggle-container {
    width: 48px;
    height: 26px;
    border-radius: 13px;
    
    .slider {
      width: 22px;
      height: 22px;
      
      &.moved {
        transform: translateX(22px);
      }
    }
    
    .icon {
      width: 22px;
      height: 22px;
      font-size: 11px;
    }
    
    .sun-icon {
      left: 3px;
    }
    
    .moon-icon {
      right: 3px;
    }
  }
  
  .tooltip {
    font-size: 11px;
    padding: 4px 8px;
  }
}
</style>
