<template>
  <router-link 
    to="/" 
    class="logo-container" 
    :class="{ 'mobile': isMobile }"
    :title="title || '返回首页 - 知识棱镜'"
    :style="cssVars"
    @click="handleClick"
  >
    <div class="logo-icon">
      <i class="fas fa-gem"></i>
    </div>
    <div class="logo-text" v-if="showText">
      <span class="logo-main">知识棱镜</span>
      <span class="logo-sub">Knowledge Prism</span>
    </div>
  </router-link>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  isMobile?: boolean
  showText?: boolean
  title?: string
  primaryColor?: string
  secondaryColor?: string
  accentColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  primaryColor: '#9333ea',
  secondaryColor: '#a855f7', 
  accentColor: '#7c3aed'
})

const emit = defineEmits<{
  click: []
}>()

const cssVars = computed(() => ({
  '--logo-primary': props.primaryColor,
  '--logo-secondary': props.secondaryColor,
  '--logo-accent': props.accentColor,
  '--logo-primary-alpha': props.primaryColor + '15', // 8% opacity
  '--logo-secondary-alpha': props.secondaryColor + '20', // 12% opacity
  '--logo-shadow': props.primaryColor + '50' // 30% opacity for shadows
}))

const handleClick = () => {
  emit('click')
}
</script>

<style scoped lang="less">
.logo-container {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  padding: 6px 12px;
  border-radius: 10px;
  background: linear-gradient(135deg, 
    var(--el-fill-color-extra-light) 0%, 
    var(--el-fill-color-light) 50%,
    var(--el-fill-color) 100%);
  border: 1px solid var(--el-border-color-extra-light);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 2px 8px var(--el-box-shadow-lighter),
    0 1px 3px var(--el-box-shadow-light),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(12px) saturate(160%);
  -webkit-backdrop-filter: blur(12px) saturate(160%);
  position: relative;
  overflow: hidden;
  
  // 顶部光泽效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 40%;
    background: linear-gradient(180deg, 
      rgba(255, 255, 255, 0.15) 0%, 
      transparent 100%);
    pointer-events: none;
  }
  
  &:hover {
    background: linear-gradient(135deg, 
      var(--logo-primary-alpha) 0%, 
      var(--logo-secondary-alpha) 50%,
      var(--logo-primary-alpha) 100%);
    border-color: var(--logo-primary);
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.08),
      0 2px 8px var(--logo-shadow),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
      
    .logo-icon {
      background: linear-gradient(135deg, 
        var(--logo-primary) 0%,
        var(--logo-secondary) 50%,
        var(--logo-accent) 100%);
      box-shadow: 
        0 3px 12px var(--logo-shadow),
        0 1px 4px var(--logo-shadow),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
      
      i {
        animation: logo-pulse 0.6s ease;
      }
      
      &::after {
        opacity: 0.5;
      }
    }
    
    .logo-main {
      background: linear-gradient(135deg, var(--logo-primary), var(--logo-secondary), var(--logo-accent));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .logo-sub {
      color: var(--logo-primary);
      opacity: 1;
    }
  }
  
  &.mobile {
    gap: 8px;
    padding: 5px 8px;
    border-radius: 8px;
  }
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, 
    var(--logo-secondary) 0%,
    var(--logo-primary) 50%,
    var(--logo-accent) 100%);
  border-radius: 8px;
  color: white;
  font-size: 16px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  box-shadow: 
    0 2px 8px var(--logo-shadow),
    0 1px 3px var(--logo-shadow),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  
  // 图标光晕效果
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, 
      var(--logo-primary), 
      transparent, 
      var(--logo-secondary));
    border-radius: 10px;
    z-index: -1;
    opacity: 0;
    transition: opacity 0.3s ease;
    filter: blur(4px);
  }
  
  .mobile & {
    width: 28px;
    height: 28px;
    font-size: 14px;
    border-radius: 7px;
  }
}

.logo-text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 2px;
  line-height: 1.2;
  height: 32px; // 与图标高度保持一致
}

.logo-main {
  font-size: 16px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  transition: all 0.3s ease;
  letter-spacing: 0.2px;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
  margin: 0;
  padding: 0;
}

.logo-sub {
  font-size: 9px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.6px;
  opacity: 0.7;
  transition: all 0.3s ease;
  font-family: 'Arial', 'Helvetica', 'Segoe UI', sans-serif;
  margin: 0;
  padding: 0;
}

// 移动端样式调整
.mobile {
  .logo-icon {
    width: 28px;
    height: 28px;
    font-size: 14px;
    border-radius: 6px;
  }
  
  .logo-text {
    height: 28px; // 与移动端图标高度保持一致
    gap: 1px;
  }
  
  .logo-main {
    font-size: 14px;
  }
  
  .logo-sub {
    font-size: 8px;
  }
}

// 添加跳动动画
@keyframes logo-pulse {
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
}
</style>
