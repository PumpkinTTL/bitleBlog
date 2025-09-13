<template>
  <el-config-provider :locale="locale">
    <div class="app-container">
      <!-- 应用内容 -->
      <div class="app-content">
        <BlogHeader></BlogHeader>
        <LoginModal></LoginModal>
        
        <!-- 主题切换器 -->
        <!-- <div class="theme-switcher-container">
          <ThemeSwitcher @theme-change="handleThemeChange" />
        </div> -->
        
        <router-view v-slot="{ Component }">
          <transition name="slide-fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>

        <!-- 添加通知组件 -->
        <!-- <Notification v-if="showNotification"></Notification> -->
        
        <!-- 返回顶部按钮 -->
        <BackToTop :visibility-height="300" :duration="400" :offset="80" />
        
        <!-- 底部 -->
        <!-- <BlogFooter></BlogFooter> -->
      </div>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import MusicContent from '@/components/MusicContent.vue';
import BlogFooter from '@/components/BlogFooter.vue';
import BlogHeader from '@/components/BlogHeader.vue';
import UserLogin from '@/components/UserLogin.vue';
import { useStore } from '@/store';
import { onMounted, ref, watch } from 'vue';
import { ElConfigProvider } from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import Agreement from '@/components/Agreement.vue';
import LoginModal from '@/components/LoginModal.vue';
import Notification from '@/components/Notification.vue';
import BackToTop from '@/components/BackToTop.vue';
import ThemeSwitcher from '@/components/ThemeSwitcher.vue';
import { checkUserLoginR } from '@/request/user';
import { message } from 'ant-design-vue';
import { clearUserInfo } from '@/util/Auth';
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

// 验证用户登录状态
const validateLoginStatus = async () => {
  const refreshToken = localStorage.getItem('refreshToken')
  const accessToken = localStorage.getItem('accessToken')
  
  if (refreshToken && accessToken) {
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')
      const targetUid = userInfo.id
      
      if (!targetUid) {
        console.error('用户ID不存在')
        return
      }
      const res:any = await checkUserLoginR(targetUid)
      if (res.code !== 200) {
        message.error(res.msg)
        // 登录失效，清除状态
        clearUserInfo()
        return
      }
      
      // 更新store数据
      store.$patch(state => {
        state.userInfo = res.data
        state.isLogin = true
      })

      console.log('用户登录状态验证成功')
    } catch (error) {
     
      clearUserInfo()
    }
  } else {
    console.log('用户未登录')
  }
}

const route = useRoute()

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

/* 路由切换动画 */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  transform: translateX(-20px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
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