<template>
  <el-config-provider :locale="locale">
    <div class="app-container">
      <!-- 应用内容 -->
      <div class="app-content">
        <BlogHeaderV2></BlogHeaderV2>
        <LoginModal></LoginModal>
        
        <!-- 主题切换器 -->
        <!-- <div class="theme-switcher-container">
          <ThemeSwitcher @theme-change="handleThemeChange" />
        </div> -->
        
        <router-view v-slot="{ Component, route }">
          <transition 
            name="slide-fade" 
            mode="out-in" 
            appear
            :duration="{ enter: 250, leave: 200 }"
            @enter="onTransitionEnter"
            @leave="onTransitionLeave"
            @enter-cancelled="onTransitionCancelled"
            @leave-cancelled="onTransitionCancelled">
            <component :is="Component" :key="route.fullPath" />
          </transition>
        </router-view>

        <!-- 添加通知组件 -->
        <!-- <Notification v-if="showNotification"></Notification> -->
        
        <!-- 返回顶部按钮 -->
        <BackToTop />
        
        <!-- AI 助理 - 暂时禁用 -->
        <!-- <AiAssistant /> -->
        
        <!-- 底部 -->
        <!-- <BlogFooter></BlogFooter> -->
      </div>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import MusicContent from '@/components/MusicContent.vue';
import BlogFooter from '@/components/BlogFooter.vue';
import BlogHeaderV2 from '@/components/headers/BlogHeaderV2.vue';
import UserLogin from '@/components/UserLogin.vue';
import { useStore } from '@/store';
import { onMounted, ref, watch } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import Agreement from '@/components/Agreement.vue';
import LoginModal from '@/components/LoginModalV2.vue';
import Notification from '@/components/Notification.vue';
import BackToTop from '@/components/index/v2/interactive/BackToTop.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import AiAssistant from '@/components/AiAssistant.vue';
import { checkUserLoginR } from '@/request/user';
import { message } from 'ant-design-vue';
import { getToken, removeToken } from '@/util/Auth';
import { useRoute } from 'vue-router';

const store = useStore()
// Element Plus 配置
const locale = zhCn

// 控制通知组件显示
const showNotification = ref(true)

// 暗色模式管理
const isDarkMode = ref(false)

// 初始化暗色模式
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme')
  isDarkMode.value = savedTheme === 'dark'
  updateTheme()
}

// 更新主题
const updateTheme = () => {
  if (isDarkMode.value) {
    document.documentElement.classList.add('dark')
    document.documentElement.setAttribute('data-theme', 'dark')
  } else {
    document.documentElement.classList.remove('dark')
    document.documentElement.setAttribute('data-theme', 'light')
  }
}

// 监听主题变化
watch(isDarkMode, (newValue) => {
  localStorage.setItem('theme', newValue ? 'dark' : 'light')
  updateTheme()
})

// 处理主题变更
const handleThemeChange = (theme: string) => {
  console.log('Theme changed to:', theme);
  // 在这里你可以处理主题变化后的逻辑
  // 例如更新element-plus的主题
}

const showAgreement = ref(false)

// 验证用户登录状态（使用新的单Token系统）
const validateLoginStatus = async () => {
  try {
    // 使用新的getToken函数获取Token数据
    const tokenData = getToken()
    
    if (tokenData && tokenData.token) {
      // 有Token，检查是否过期
      const now = Date.now()
      const expiresTime = typeof tokenData.expires === 'number' 
        ? tokenData.expires 
        : new Date(tokenData.expires).getTime()
      
      if (expiresTime > now) {
        // Token未过期，先恢复登录状态
        store.$patch(state => {
          state.isLogin = true
          state.userInfo = tokenData  // 先使用localStorage中的数据
        })
        
        const timeLeft = Math.floor((expiresTime - now) / 1000 / 60)
        console.log(`[App] 登录状态恢复成功，用户: ${tokenData.username || tokenData.account}, Token还有${timeLeft}分钟过期`)
        
        // 请求最新的用户信息（同步后端数据）
        if (tokenData.id) {
          try {
            console.log('[App] 请求最新用户信息...')
            const res: any = await checkUserLoginR(tokenData.id)
            
            if (res.code === 200) {
              // 合并localStorage和后端返回的最新数据
              const updatedUserInfo = {
                ...tokenData,      // localStorage中的token、expires等
                ...res.data        // 后端返回的最新用户信息
              }
              
              store.$patch(state => {
                state.userInfo = updatedUserInfo
              })
              
              console.log('[App] 用户信息已更新:', updatedUserInfo)
            } else {
              // 用户被禁用或其他错误
              console.warn('[App] 用户验证失败:', res.msg)
              removeToken()
              store.$patch(state => {
                state.isLogin = false
                state.userInfo = null
              })
              message.warning(res.msg || '用户状态异常，请重新登录')
            }
          } catch (error) {
            console.warn('[App] 用户信息请求失败:', error)
            // 接口请求失败不清除Token，保持localStorage中的登录状态
            console.log('[App] 使用本地缓存的用户信息')
          }
        }
      } else {
        // Token已过期
        console.warn('[App] Token已过期，清除登录状态')
        removeToken()
        store.$patch(state => {
          state.isLogin = false
          state.userInfo = null
        })
      }
    } else {
      console.log('[App] 用户未登录')
      store.$patch(state => {
        state.isLogin = false
        state.userInfo = null
      })
    }
  } catch (error) {
    console.error('[App] 登录状态恢复失败:', error)
    removeToken()
    store.$patch(state => {
      state.isLogin = false
      state.userInfo = null
    })
  }
}

const route = useRoute()

// 过渡动画事件处理
const onTransitionEnter = (el: Element) => {
  // console.log('Page transition enter started')
}

const onTransitionLeave = (el: Element) => {
  // console.log('Page transition leave started')
}

const onTransitionCancelled = () => {
  // console.log('Page transition cancelled - forcing completion')
  // 如果动画被取消，确保没有遗留的样式
  document.querySelectorAll('.slide-fade-enter-active, .slide-fade-leave-active').forEach(el => {
    ;(el as HTMLElement).style.transition = 'none'
    ;(el as HTMLElement).style.transform = 'none'
    ;(el as HTMLElement).style.opacity = ''
  })
}

onMounted(() => {
  // 初始化主题
  initTheme()
  // 页面加载时检查登录状态
  validateLoginStatus()
})
</script>

<style lang="less">
/* Element Plus 暗色模式 CSS 变量 */
// @import 'element-plus/theme-chalk/dark/css-vars.css';

.theme-switcher-container {
  position: fixed;
  top: 80px;
  right: 20px;
  z-index: 999;
  
  @media (max-width: 767px) {
    top: 70px;
    right: 15px;
  }
}

.app-container {
  min-height: 100vh;
  background: var(--el-bg-color-page);
  color: var(--el-text-color-primary);
  transition: background-color var(--el-transition-duration), color var(--el-transition-duration);
}

.app-content {
  position: relative;
}

/* 路由切换动画 - 优化版 */
.slide-fade-enter-active {
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.slide-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.55, 0.085, 0.68, 0.53);
}

.slide-fade-enter-from {
  transform: translateX(-15px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(15px);
  opacity: 0;
}

/* 确保动画期间的性能 */
.slide-fade-enter-active *,
.slide-fade-leave-active * {
  will-change: auto;
}

/* 防止动画期间的渲染问题 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  position: relative;
  z-index: 1;
}

/* 安全机制：确保动画不会无限继续 */
.slide-fade-enter-active {
  animation-fill-mode: both;
  animation-duration: 0.25s;
}

.slide-fade-leave-active {
  animation-fill-mode: both;
  animation-duration: 0.2s;
}

/* 媒体查询：在低性能设备上禁用动画 */
@media (prefers-reduced-motion: reduce) {
  .slide-fade-enter-active,
  .slide-fade-leave-active {
    transition: none !important;
    animation: none !important;
  }
  
  .slide-fade-enter-from,
  .slide-fade-leave-to {
    transform: none !important;
    opacity: 1 !important;
  }
}

/* Element Plus 全局暗色模式适配 */
html.dark {
  color-scheme: dark;

  /* 全局背景和文字色 */
  body {
    background: var(--el-bg-color-page);
    color: var(--el-text-color-primary);
  }

  /* 滚动条暗色模式 */
  ::-webkit-scrollbar {
    background: var(--el-fill-color-darker);
  }

  ::-webkit-scrollbar-thumb {
    background: var(--el-fill-color);

    &:hover {
      background: var(--el-fill-color-light);
    }
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .app-container {
    min-height: 100vh;
  }
}
</style>