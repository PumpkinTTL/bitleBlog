<template>
  <div class="index-layout" :class="layoutClasses">
    <!-- 页面头部区域 -->

    
    <!-- 主要内容区域 - 使用栅格系统 -->
    <div class="layout-container">
      <el-row class="layout-wrapper" :gutter="16">
        <!-- 左侧边栏 -->
        <el-col 
          :xs="0" 
          :sm="0" 
          :md="6" 
          :lg="5" 
          :xl="4"
          class="left-sidebar-col"
        >
          <aside class="left-sidebar" :class="{ 'mobile-open': isMobileMenuOpen }">
            <slot name="left-sidebar" />
          </aside>
        </el-col>

        <!-- 主内容区 -->
        <el-col 
          :xs="24" 
          :sm="24" 
          :md="18" 
          :lg="19"
          :xl="20"
          class="main-content-col"
        >
          <main class="main-content" :class="mainContentClasses">
            <slot name="main-content" />
          </main>
        </el-col>

      </el-row>
    </div>

    <!-- 移动端遮罩层 -->
    <div 
      v-if="isMobileMenuOpen" 
      class="mobile-overlay"
      @click="handleMobileMenuToggle"
    ></div>

    <!-- 全局滚动指示器 -->
    <ScrollIndicator v-if="showScrollIndicator" />
    
    <!-- 回到顶部按钮 -->
    <BackToTop v-if="showBackToTop" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import HeaderSection from './HeaderSection.vue'
import ScrollIndicator from '../interactive/ScrollIndicator.vue'
import BackToTop from '../interactive/BackToTop.vue'

// 布局配置接口
interface LayoutProps {
  layoutMode?: 'classic' | 'modern' | 'magazine' | 'masonry'
  sidebarPosition?: 'left' | 'right' | 'both' | 'none'
  headerStyle?: 'fixed' | 'sticky' | 'static'
  showSearch?: boolean
  showNavigation?: boolean
  showScrollIndicator?: boolean
  showBackToTop?: boolean
}

const props = withDefaults(defineProps<LayoutProps>(), {
  layoutMode: 'modern',
  sidebarPosition: 'both',
  headerStyle: 'fixed',
  showSearch: true,
  showNavigation: true,
  showScrollIndicator: true,
  showBackToTop: true
})

// 事件定义
const emit = defineEmits<{
  search: [query: string]
  mobileMenuToggle: [isOpen: boolean]
}>()

// 响应式状态
const isMobileMenuOpen = ref(false)
const headerTransparent = ref(false)
const scrollY = ref(0)

// 计算属性
const layoutClasses = computed(() => ({
  [`layout-${props.layoutMode}`]: true,
  [`header-${props.headerStyle}`]: true,
  [`sidebar-${props.sidebarPosition}`]: true,
  'mobile-menu-open': isMobileMenuOpen.value
}))

const mainContentClasses = computed(() => ({
  'full-width': props.sidebarPosition === 'none',
  'with-left': props.sidebarPosition === 'left'
}))

// 事件处理
const handleSearch = (query: string) => {
  emit('search', query)
}

const handleMobileMenuToggle = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
  emit('mobileMenuToggle', isMobileMenuOpen.value)
  
  // 控制body滚动
  if (isMobileMenuOpen.value) {
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = ''
  }
}

// 滚动监听
const handleScroll = () => {
  scrollY.value = window.scrollY
  headerTransparent.value = scrollY.value < 100
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  document.body.style.overflow = ''
})
</script>

<style lang="less" scoped>
.index-layout {
  min-height: 100vh;
  background: var(--el-bg-color-page);
  transition: all 0.3s ease;
  position: relative;
  
  // 现代布局模式
  &.layout-modern {
    .layout-container {
      padding-top: 0; // 已删除头部，不需要预留空间
    }
  }
  
  // 杂志布局模式
  &.layout-magazine {
    .main-content {
      max-width: 800px;
      margin: 0 auto;
    }
  }
  
  // 瀑布流布局模式
  &.layout-masonry {
    .main-content {
      width: 100%;
    }
  }
  
  // 经典布局模式
  &.layout-classic {
    .layout-wrapper {
      max-width: 1200px;
    }
  }
}

.layout-container {
  width: 100%;
  transition: padding-top 0.3s ease;
}

.layout-wrapper {
  max-width: 1440px;
  margin: 0 auto;
  padding: 20px;
  position: relative;
  
  @media (max-width: 1200px) {
    padding: 16px;
  }
  
  @media (max-width: 768px) {
    padding: 12px;
  }
}

// 左侧边栏
.left-sidebar-col {
  // 栅格列样式
}

.left-sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
  max-height: calc(100vh - 40px);
  overflow-y: auto;
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 16px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--el-fill-color-lighter);
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--el-border-color);
    border-radius: 3px;
    
    &:hover {
      background: var(--el-border-color-dark);
    }
  }
  
  @media (max-width: 768px) {
    position: fixed;
    top: 0;
    left: -300px;
    width: 280px;
    height: 100vh;
    background: var(--el-bg-color);
    z-index: 1000;
    box-shadow: 5px 0 20px rgba(0, 0, 0, 0.1);
    transition: left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    overflow-y: auto;
    padding: 20px;
    
    &.mobile-open {
      left: 0;
    }
  }
}

// 主内容区
.main-content-col {
  min-height: 100vh;
  
  @media (max-width: 768px) {
    min-height: auto;
  }
}

.main-content {
  width: 100%;
  min-height: 200px;
  background: var(--el-bg-color);
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  
  &.full-width {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    border-radius: 8px;
    margin-top: 0;
  }
}


// 移动端遮罩层
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: 0;
  animation: fadeIn 0.3s ease forwards;
  
  @media (min-width: 769px) {
    display: none;
  }
}

@keyframes fadeIn {
  to {
    opacity: 1;
  }
}

// 暗色模式适配
html.dark & {
  .index-layout {
    background: var(--el-bg-color-page);
  }
  
  .main-content {
    background: var(--el-bg-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    
    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }
  }
  
  .left-sidebar {
    @media (max-width: 768px) {
      background: var(--el-bg-color);
      box-shadow: 5px 0 20px rgba(0, 0, 0, 0.3);
    }
  }
  
  .mobile-overlay {
    background: rgba(0, 0, 0, 0.7);
  }
}

// 响应式断点
@media (max-width: 480px) {
  .layout-wrapper {
    padding: 8px;
  }
  
  .main-content {
    padding: 12px;
  }
}
</style>
