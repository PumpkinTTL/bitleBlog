<template>
  <router-link 
    to="/" 
    class="logo-container" 
    :class="{ 'mobile': isMobile }"
    :title="title || '返回首页 - 知识棱镜'"
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
interface Props {
  isMobile?: boolean
  showText?: boolean
  title?: string
}

defineProps<Props>()

const emit = defineEmits<{
  click: []
}>()

const handleClick = () => {
  emit('click')
}
</script>

<style scoped lang="less">
.logo-container {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  padding: 8px 14px;
  border-radius: 14px;
  background: linear-gradient(135deg, 
    var(--el-fill-color-extra-light) 0%, 
    var(--el-fill-color-light) 50%,
    var(--el-fill-color) 100%);
  border: 1px solid var(--el-border-color-extra-light);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 3px 12px var(--el-box-shadow-lighter),
    0 1px 4px var(--el-box-shadow-light),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
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
    transform: translateY(-2px) scale(1.02);
    background: linear-gradient(135deg, 
      rgba(147, 51, 234, 0.08) 0%, 
      rgba(168, 85, 247, 0.05) 50%,
      rgba(147, 51, 234, 0.08) 100%);
    border-color: rgba(147, 51, 234, 0.2);
    box-shadow: 
      0 6px 20px rgba(0, 0, 0, 0.1),
      0 2px 8px rgba(147, 51, 234, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.6);
      
    .logo-icon {
      transform: scale(1.1) rotate(15deg);
      background: linear-gradient(135deg, 
        #9333ea 0%,
        #a855f7 50%,
        #8b5cf6 100%);
      box-shadow: 
        0 4px 12px rgba(147, 51, 234, 0.4),
        0 2px 6px rgba(168, 85, 247, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
      
      &::after {
        opacity: 0.6;
      }
    }
    
    .logo-main {
      background: linear-gradient(135deg, #9333ea, #a855f7, #8b5cf6);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    
    .logo-sub {
      color: rgba(147, 51, 234, 0.8);
    }
  }
  
  &.mobile {
    gap: 10px;
    padding: 6px 10px;
    border-radius: 10px;
    transform: none !important; // 移动端禁用悬停变换
    
    &:hover {
      transform: none !important;
    }
  }
}

.logo-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, 
    #a855f7 0%,
    #9333ea 50%,
    #7c3aed 100%);
  border-radius: 12px;
  color: white;
  font-size: 20px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  box-shadow: 
    0 4px 12px rgba(147, 51, 234, 0.35),
    0 2px 6px rgba(168, 85, 247, 0.25),
    inset 0 1px 0 rgba(255, 255, 255, 0.4);
  
  // 图标光晕效果
  &::after {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, 
      rgba(147, 51, 234, 0.6), 
      transparent, 
      rgba(168, 85, 247, 0.6));
    border-radius: 12px;
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
  gap: 0px;
  line-height: 1.15;
  height: 40px; // 与图标高度保持一致
}

.logo-main {
  font-size: 18px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  transition: all 0.3s ease;
  letter-spacing: 0.3px;
  font-family: 'PingFang SC', 'Microsoft YaHei', 'Hiragino Sans GB', sans-serif;
  margin: 0;
  padding: 0;
}

.logo-sub {
  font-size: 10px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  opacity: 0.75;
  transition: all 0.3s ease;
  font-family: 'Arial', 'Helvetica', 'Segoe UI', sans-serif;
  margin: -2px 0 0 0;
  padding: 0;
}

// 移动端样式调整
.mobile {
  .logo-icon {
    width: 32px;
    height: 32px;
    font-size: 16px;
    border-radius: 8px;
  }
  
  .logo-text {
    height: 32px; // 与移动端图标高度保持一致
  }
  
  .logo-main {
    font-size: 15px;
  }
  
  .logo-sub {
    font-size: 8px;
    margin-top: -1px;
  }
}
</style>
