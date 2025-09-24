<template>
  <div class="index-layout" :class="layoutClasses">
    <!-- 页面头部区域 -->
    <!-- 主要内容区域 - 使用栅格系统 -->
    <div class="layout-container">
      <div class="layout-wrapper">
        <el-row class="content-row" :gutter="16">
          <!-- 左侧边栏 -->
          <el-col :xs="0" :sm="0" :md="7" :lg="6" :xl="5" class="left-sidebar-col">
            <aside class="left-sidebar" :class="{ 'mobile-open': isMobileMenuOpen }" style="overflow: hidden;">
              <slot name="left-sidebar" />
            </aside>
          </el-col>

          <!-- 主内容区 -->
          <el-col :xs="24" :sm="24" :md="10" :lg="12" :xl="14" class="main-content-col">
            <main class="main-content" :class="mainContentClasses">
              <!-- 顶部固定区域 -->
              <div class="main-content-top">
                <slot name="main-content-top" />
              </div>
              <!-- 滚动内容区域 -->
              <div class="main-content-body">
                <slot name="main-content" />
              </div>
            </main>
          </el-col>
          
          <!-- 右侧边栏 -->
          <el-col :xs="0" :sm="0" :md="7" :lg="6" :xl="5" class="right-sidebar-col">
            <aside class="right-sidebar" style="overflow: hidden;">
              <slot name="right-sidebar" />
            </aside>
          </el-col>
        </el-row>
        
        <!-- 下方内容区域 - 使用栅格系统布局 -->
        <el-row class="bottom-content-row" :gutter="16">
          <!-- 中心内容区域 - 全宽占满 -->
          <el-col :xs="24" :sm="24" :md="24" :lg="24" :xl="24" class="center-content-col">
            <div class="center-content-section">
              <slot name="center-content" />
            </div>
          </el-col>
        </el-row>
        
        <!-- 预留更多行的扩展位置 - 也使用栅格布局 -->
        <div class="additional-sections">
          <slot name="additional-sections" />
        </div>
      </div>
         
    </div>

    <!-- 移动端遮罩层 -->
    <div v-if="isMobileMenuOpen" class="mobile-overlay" @click="handleMobileMenuToggle"></div>
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
  max-width: 1440px; // 与其他页面保持一致的版心宽度
  margin: 0 auto;
  padding: 20px;
  position: relative;
  width: 100%; // 确保在小屏幕上能够完全利用空间
  box-sizing: border-box; // 确保padding包含在宽度内

  @media (max-width: 1200px) {
    padding: 16px;
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
}

// 栅格系统行样式 - 关键修复，确保版心对齐
.content-row {
  width: 100%;
  margin: 0; // 移除Element Plus默认的margin

  // 确保栅格列正确对齐
  &.el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;

    // 重写Element Plus栅格系统的默认样式
    .el-col {
      padding-left: 8px !important;
      padding-right: 8px !important;
    }

    // 特殊处理：确保第一列和最后一列的对齐
    .el-col:first-child {
      padding-left: 0 !important;
    }

    .el-col:last-child {
      padding-right: 0 !important;
    }
  }
}

// 底部栅格行样式 - 与主栅格保持一致
.bottom-content-row {
  width: 100%;
  margin: 0; // 移除Element Plus默认的margin
  margin-top: 20px; // 与上方区域的间距

  // 确保栅格列正确对齐
  &.el-row {
    margin-left: 0 !important;
    margin-right: 0 !important;

    // 重写Element Plus栅格系统的默认样式
    .el-col {
      padding-left: 0 !important; // 底部区域通常全宽，不需要间距
      padding-right: 0 !important;
    }
  }
  
  @media (max-width: 768px) {
    margin-top: 16px;
  }
  
  @media (max-width: 480px) {
    margin-top: 12px;
  }
}

// 底部中心内容栏样式
.center-content-col {
  // 栅格列样式，由上面的bottom-content-row统一管理padding
  width: 100%;
}

// 额外的扩展区域容器
.additional-sections {
  margin-top: 20px;
  width: 100%;
  
  @media (max-width: 768px) {
    margin-top: 16px;
  }
  
  @media (max-width: 480px) {
    margin-top: 12px;
  }
}

// 中心内容区域
.center-content-section {
  width: 100%;
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  margin-bottom: 20px;
  
  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
  
  @media (max-width: 768px) {
    padding: 20px;
    border-radius: 6px;
    margin-bottom: 16px;
  }
  
  @media (max-width: 480px) {
    padding: 16px;
    margin-bottom: 12px;
  }
}

// 左侧边栏
.left-sidebar-col {
  // 栅格列样式，由上面的content-row统一管理padding
}

.left-sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
  background: var(--el-bg-color);
  border-radius: 8px;
  padding: 18px; // 略微增加内边距，让内容更舒适
  width: 100%; // 确保充满栅格列
  min-width: 200px; // 设置最小宽度，防止过窄
}

.right-sidebar {
  position: sticky;
  top: 20px;
  height: fit-content;
  background: transparent;
  width: 100%;
  min-width: 200px;

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
  // padding由content-row统一管理

  @media (max-width: 768px) {
    min-height: auto;
  }
}

.main-content {
  width: 100%;
  height: calc(100vh - 60px); /* 固定高度，留出上下边距 */
  max-height: calc(100vh - 60px);
  background: var(--el-bg-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  }

  &.full-width {
    max-width: 1200px;
    margin: 0 auto;
  }

  @media (max-width: 768px) {
    height: calc(100vh - 40px); /* 移动端调整高度 */
    max-height: calc(100vh - 40px);
    border-radius: 6px; /* 移动端更小的圆角 */
    margin-top: 0;
  }
}

// 主内容区域结构
.main-content-top {
  flex-shrink: 0;
  /* 顶部区域不受内边距影响 */
}

.main-content-body {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  overflow-y: overlay;
  overflow-x: hidden;
  scroll-behavior: smooth;
  
  /* 对于不支持overlay的浏览器，使用scrollbar-gutter预留空间 */
  scrollbar-gutter: stable;
  
  /* 美化滚动条 - 超细极简模式 */
  &::-webkit-scrollbar {
    width: 2px;
    height: 2px;
    background: transparent;
  }
  
  &::-webkit-scrollbar-track {
    background: transparent;
    border-radius: 0;
  }
  
  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.08);
    border-radius: 1px;
    border: none;
    min-height: 10px;
    transition: background 0.15s ease;
    
    &:hover {
      background: rgba(0, 0, 0, 0.18);
    }
    
    &:active {
      background: rgba(0, 0, 0, 0.3);
    }
  }
  
  /* 强制隐藏所有滚动条箭头和按钮 */
  &::-webkit-scrollbar-button:start:decrement,
  &::-webkit-scrollbar-button:end:increment {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
    background: transparent !important;
  }
  
  &::-webkit-scrollbar-button {
    display: none !important;
    width: 0 !important;
    height: 0 !important;
  }
  
  &::-webkit-scrollbar-corner {
    background: transparent;
  }
  
  /* Firefox 兼容 */
  scrollbar-width: none;
  scrollbar-color: transparent transparent;
  
  @supports not (scrollbar-width: none) {
    scrollbar-width: thin;
    scrollbar-color: rgba(0, 0, 0, 0.08) transparent;
  }
  
  @media (max-width: 768px) {
    padding: 16px;
    
    &::-webkit-scrollbar {
      width: 1.5px;
      height: 1.5px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.1);
      border: none;
      border-radius: 0.5px;
      min-height: 8px;
    }
    
    &::-webkit-scrollbar-button:start:decrement,
    &::-webkit-scrollbar-button:end:increment {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
    
    &::-webkit-scrollbar-button {
      display: none !important;
      width: 0 !important;
      height: 0 !important;
    }
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
  
  .main-content-body {
    /* 暗黑模式 overlay 滚动条 */
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.2); /* 暗黑模式下的半透明白色 */
      
      &:hover {
        background: rgba(255, 255, 255, 0.3);
      }
      
      &:active {
        background: var(--el-color-primary-light-3);
      }
    }
    
    /* Firefox 暗黑模式 */
    scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
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
  
  .center-content-section {
    background: var(--el-bg-color);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    
    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
    }
  }
}

// 响应式断点
@media (max-width: 480px) {
  .layout-wrapper {
    padding: 8px;
  }
  
  .main-content-body {
    padding: 12px;
  }
}
</style>
