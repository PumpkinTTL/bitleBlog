<template>
  <div class="header-v2-wrapper">
    <!-- 头部占位符 -->
    <div class="header-spacer"></div>
    
    <!-- 主头部 -->
    <header class="main-header-v2">
      <div class="header-container">
        <!-- Logo区域 -->
        <div class="header-logo-section">
          <Logo 
            :show-text="true" 
            primary-color="#8b5cf6"
            secondary-color="#d946ef"
            accent-color="#3b82f6"
            class="header-logo"
          />
        </div>

        <!-- 导航菜单区域 -->
        <nav class="header-nav">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-item"
            active-class="active"
          >
            <i :class="item.icon" class="nav-icon"></i>
            <span class="nav-text">{{ item.title }}</span>
            <span class="nav-indicator"></span>
          </router-link>
        </nav>

        <!-- 右侧操作区域 -->
        <div class="header-actions">
          <!-- 捐赠按钮 -->
          <router-link to="/donation" class="donation-link">
            <i class="fas fa-hand-holding-heart"></i>
            <span class="donation-text">捐赠本站</span>
          </router-link>

          <!-- 主题切换按钮 -->
          <button
            class="action-btn theme-btn"
            :class="{ 'dark-mode': isDarkMode }"
            @click="toggleTheme"
            :title="isDarkMode ? '切换到浅色模式' : '切换到深色模式'"
          >
            <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>

          <!-- 用户区域 -->
          <div v-if="isLoggedIn" class="user-area">
            <el-dropdown trigger="click" @command="handleUserCommand">
              <div class="user-trigger">
                <el-avatar :size="32" :src="userAvatar" class="user-avatar">
                  {{ userInitial }}
                </el-avatar>
                <span class="user-name">{{ userName }}</span>
                <i class="fas fa-chevron-down dropdown-icon"></i>
                
                <!-- Premium吸附标签（右上角） -->
                <div 
                  v-if="premiumConfig.show"
                  class="premium-corner-badge"
                  :style="{
                    '--premium-bg': premiumConfig.backgroundColor,
                    '--premium-text': premiumConfig.textColor,
                    '--premium-icon': premiumConfig.iconColor,
                    '--premium-shadow': premiumShadowColor
                  }"
                >
                  <i :class="premiumConfig.icon"></i>
                  <span>{{ premiumConfig.text }}</span>
                </div>
              </div>
              <template #dropdown>
                <el-dropdown-menu class="user-dropdown-menu">
                  <el-dropdown-item command="profile">
                    <i class="fas fa-user"></i>
                    <span>个人中心</span>
                  </el-dropdown-item>
                  <el-dropdown-item command="settings">
                    <i class="fas fa-cog"></i>
                    <span>设置</span>
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <i class="fas fa-sign-out-alt"></i>
                    <span>退出登录</span>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>

          <!-- 登录按钮 -->
          <button v-else class="login-btn" @click="showLogin">
            <i class="fas fa-user"></i>
            <span>登录</span>
          </button>

          <!-- 移动端菜单按钮 -->
          <button class="action-btn menu-btn" @click="mobileMenuOpen = true">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </div>
    </header>

    <!-- 移动端抽屉菜单 -->
    <el-drawer
      v-model="mobileMenuOpen"
      direction="rtl"
      size="300px"
      :with-header="false"
      class="mobile-drawer"
    >
      <div class="mobile-menu">
        <!-- 抽屉头部 -->
        <div class="drawer-header">
          <Logo 
            :show-text="true"
            :is-mobile="true"
            primary-color="#8b5cf6"
            secondary-color="#d946ef"
            accent-color="#3b82f6"
          />
          <button class="close-btn" @click="mobileMenuOpen = false">
            <i class="fas fa-times"></i>
          </button>
        </div>

        <div class="drawer-divider"></div>

        <!-- 用户信息区 -->
        <div v-if="isLoggedIn" class="drawer-user-section">
          <div class="user-avatar-wrapper">
            <el-avatar :size="48" :src="userAvatar" class="drawer-user-avatar">
              {{ userInitial }}
            </el-avatar>
            <div class="online-badge"></div>
          </div>
          <div class="user-info">
            <h4 class="user-name-text">{{ userName }}</h4>
            <p class="user-status">在线</p>
            
            <!-- 移动端Premium吸附标签（右上角） -->
            <div 
              v-if="premiumConfig.show"
              class="mobile-premium-corner-badge"
              :style="{
                '--premium-bg': premiumConfig.backgroundColor,
                '--premium-text': premiumConfig.textColor,
                '--premium-icon': premiumConfig.iconColor,
                '--premium-shadow': premiumShadowColor
              }"
            >
              <i :class="premiumConfig.icon"></i>
              <span>{{ premiumConfig.text }}</span>
            </div>
          </div>
          <button class="logout-icon-btn" @click="logout" title="退出登录">
            <i class="fas fa-sign-out-alt"></i>
          </button>
        </div>

        <!-- 登录提示区 -->
        <div v-else class="drawer-login-section">
          <div class="login-prompt">
            <div class="login-icon">
              <i class="fas fa-user-circle"></i>
            </div>
            <div class="login-text">
              <h4>欢迎访问</h4>
              <p>登录以获得更好体验</p>
            </div>
          </div>
          <button class="drawer-login-btn" @click="showLogin">
            <i class="fas fa-sign-in-alt"></i>
            <span>立即登录</span>
          </button>
        </div>

        <div class="drawer-divider"></div>

        <!-- 导航菜单 -->
        <div class="drawer-nav-section">
          <div class="section-title">
            <i class="fas fa-compass"></i>
            <span>导航菜单</span>
          </div>
          <div class="drawer-nav-list">
            <router-link
              v-for="(item, index) in navItems"
              :key="item.path"
              :to="item.path"
              class="drawer-nav-item"
              :style="{ animationDelay: `${index * 0.05}s` }"
              @click="mobileMenuOpen = false"
            >
              <div class="nav-item-icon">
                <i :class="item.icon"></i>
              </div>
              <span class="nav-item-text">{{ item.title }}</span>
              <i class="fas fa-chevron-right nav-arrow"></i>
            </router-link>
          </div>
        </div>

        <div class="drawer-divider"></div>

        <!-- 捐赠支持 -->
        <div class="drawer-donation-section">
          <router-link to="/donation" class="drawer-donation-card" @click="mobileMenuOpen = false">
            <div class="donation-card-icon">
              <i class="fas fa-heart"></i>
            </div>
            <div class="donation-card-content">
              <h4 class="donation-card-title">💝 捐赠本站</h4>
              <p class="donation-card-desc">您的支持是我们前进的动力</p>
            </div>
            <i class="fas fa-chevron-right donation-arrow"></i>
          </router-link>
        </div>

        <div class="drawer-divider"></div>

        <!-- 主题切换 -->
        <div class="drawer-theme-section">
          <div class="section-title">
            <i class="fas fa-palette"></i>
            <span>主题设置</span>
          </div>
          <div class="theme-switch-wrapper">
            <div class="theme-info">
              <span class="theme-label">{{ isDarkMode ? '深色模式' : '浅色模式' }}</span>
              <span class="theme-desc">切换界面主题</span>
            </div>
            <el-switch
              :model-value="isDarkMode"
              @change="toggleTheme"
              active-color="#1677FF"
              inactive-color="#dcdfe6"
            />
          </div>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useStore } from '@/store'
import { useThemeStore } from '@/stores/theme'
import { removeToken } from '@/util/Auth'
import Logo from '../Logo.vue'

const router = useRouter()
const store = useStore()
const themeStore = useThemeStore()

// 定义Props
interface Props {
  // Premium标签配置
  premiumConfig?: {
    show: boolean
    text: string
    icon: string
    backgroundColor: string
    textColor: string
    iconColor: string
  }
}

const props = withDefaults(defineProps<Props>(), {
  premiumConfig: () => ({
    show: true,
    text: 'Premium',
    icon: 'fas fa-crown',
    backgroundColor: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
    textColor: 'white',
    iconColor: '#ffd700'
  })
})

// 响应式数据
const mobileMenuOpen = ref(false)
const isDarkMode = computed(() => themeStore.isDark)

// 导航项目
const navItems = ref([
  { title: '首页', path: '/index', icon: 'fas fa-home' },
  { title: '资源', path: '/resources', icon: 'fas fa-folder' },
  { title: '商城', path: '/shop', icon: 'fas fa-shopping-bag' },
  { title: '创作', path: '/write', icon: 'fas fa-pen' },
  { title: '关于', path: '/about', icon: 'fas fa-info-circle' }
])

// 用户信息
const isLoggedIn = computed(() => store.isLogin)
const userName = computed(() => {
  if (store.userInfo) {
    const userInfo = store.userInfo as any
    return userInfo.username || userInfo.account || userInfo.name || '用户'
  }
  return '游客'
})
const userAvatar = computed(() => {
  const userInfo = store.userInfo as any
  return userInfo?.avatar || userInfo?.headImg || ''
})
const userInitial = computed(() => userName.value.charAt(0))

// 获取角标阴影颜色（从背景色中提取）
const premiumShadowColor = computed(() => {
  const bgColor = props.premiumConfig.backgroundColor
  // 如果是渐变色，提取第一个颜色作为阴影色
  if (bgColor.includes('linear-gradient')) {
    const match = bgColor.match(/#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}/)
    return match ? match[0] : '#d97706'
  }
  // 如果是单色，直接使用
  return bgColor
})

// 方法
const toggleTheme = () => {
  themeStore.toggleTheme()
}

const showLogin = () => {
  mobileMenuOpen.value = false
  const event = new CustomEvent('show-login-modal')
  window.dispatchEvent(event)
}

const handleUserCommand = (command: string) => {
  switch (command) {
    case 'profile':
      router.push('/profile')
      break
    case 'settings':
      router.push('/settings')
      break
    case 'logout':
      logout()
      break
  }
}

const logout = () => {
  // 清除Token（authorized-token cookie + user-info localStorage）
  removeToken()
  
  // 清除旧的localStorage字段（兼容）
  localStorage.removeItem('isLogin')
  localStorage.removeItem('loginCredentials')
  
  // 清除store中的用户状态
  store.$patch((state: any) => {
    state.isLogin = false
    state.userInfo = null
  })
  
  ElMessage.success('已退出登录')
  mobileMenuOpen.value = false
  router.push('/')
  // 重新加载页面确保状态清除
  setTimeout(() => window.location.reload(), 100)
}

// 初始化
onMounted(() => {
  // 组件初始化
})

</script>

<style scoped lang="less">
// ==================== 变量 ====================
@header-height: 60px;
@header-height-mobile: 54px;
@primary-color: #8b5cf6;
@secondary-color: #d946ef;

// ==================== 头部容器 ====================
.header-v2-wrapper {
  position: relative;
  z-index: 1000;
}

.header-spacer {
  height: @header-height;
  
  @media (max-width: 768px) {
    height: @header-height-mobile;
  }
}

// ==================== 主头部 ====================
.main-header-v2 {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: @header-height;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-lighter);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  z-index: 1000;
  
  @media (max-width: 768px) {
    height: @header-height-mobile;
  }
}

.header-container {
  max-width: 1440px;
  height: 100%;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  align-items: center;
  gap: 20px;
  
  @media (max-width: 1200px) {
    padding: 0 20px;
    gap: 16px;
  }
  
  @media (max-width: 768px) {
    padding: 0 12px;
    gap: 8px;
    justify-content: space-between;
  }
}

// ==================== Logo 区域 ====================
.header-logo-section {
  flex-shrink: 0;
}

.header-logo {
  :deep(.logo-container) {
    padding: 4px 8px;
    
    @media (max-width: 768px) {
      padding: 2px 6px;
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      backdrop-filter: none !important;
    }
    
    @media (max-width: 480px) {
      padding: 2px 4px;
    }
  }
  
  :deep(.logo-icon) {
    width: 28px;
    height: 28px;
    font-size: 14px;
    
    @media (max-width: 768px) {
      width: 26px;
      height: 26px;
      font-size: 13px;
    }
    
    @media (max-width: 480px) {
      width: 24px;
      height: 24px;
      font-size: 12px;
    }
  }
  
  :deep(.logo-text) {
    // 桌面端正常显示
    .logo-main {
      font-size: 14px;
    }
    
    .logo-sub {
      font-size: 8px;
    }
    
    // 中等屏幕稍小
    @media (max-width: 768px) {
      .logo-main {
        font-size: 13px;
      }
      
      .logo-sub {
        font-size: 7px;
      }
    }
    
    // 只有超小屏才隐藏
    @media (max-width: 400px) {
      display: none !important;
    }
  }
}

// ==================== 导航菜单 ====================
.header-nav {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  
  @media (max-width: 992px) {
    display: none !important;
  }
  
  @media (max-width: 768px) {
    display: none !important;
    width: 0;
    overflow: hidden;
    visibility: hidden;
  }
}

.nav-item {
  position: relative;
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 14px;
  border-radius: 8px;
  text-decoration: none;
  color: var(--el-text-color-regular);
  font-size: 14px;
  font-weight: 600;
  transition: all 0.2s ease;
  white-space: nowrap;
  
  @media (max-width: 1200px) {
    padding: 6px 12px;
    font-size: 13px;
  }
  
  .nav-icon {
    font-size: 14px;
    transition: transform 0.2s ease;
  }
  
  .nav-text {
    transition: color 0.2s ease;
  }
  
  .nav-indicator {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%) scaleX(0);
    width: 70%;
    height: 2px;
    background: linear-gradient(90deg, @primary-color, @secondary-color);
    border-radius: 999px;
    transition: transform 0.25s ease;
    opacity: 0;
  }
  
  &:hover {
    color: @primary-color;
    background: var(--el-fill-color-light);
    
    .nav-icon {
      transform: scale(1.1);
    }
  }
  
  &.active {
    color: @primary-color;
    
    .nav-indicator {
      transform: translateX(-50%) scaleX(1);
      opacity: 1;
    }
  }
}

// ==================== 右侧操作区 ====================
.header-actions {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    gap: 8px;
    margin-left: auto;
  }
}

// 捐赠按钮样式
.donation-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  background: linear-gradient(135deg,
    rgba(251, 191, 36, 0.12) 0%,
    rgba(245, 158, 11, 0.14) 50%,
    rgba(249, 115, 22, 0.16) 100%);
  border: 1.5px solid rgba(249, 115, 22, 0.45);
  color: #f97316;
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(234, 88, 12, 0.2);

  // 内部光泽
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg,
      rgba(255, 255, 255, 0.08) 0%,
      transparent 100%);
    pointer-events: none;
  }

  i {
    font-size: 14px;
    transition: transform 0.3s ease;
  }

  .donation-text {
    white-space: nowrap;

    @media (max-width: 1100px) {
      display: none;
    }
  }

  &:hover {
    background: linear-gradient(135deg,
      rgba(251, 191, 36, 0.18) 0%,
      rgba(245, 158, 11, 0.20) 50%,
      rgba(249, 115, 22, 0.24) 100%);
    border-color: rgba(249, 115, 22, 0.65);
    color: #ea580c;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(249, 115, 22, 0.3);

    i {
      transform: scale(1.15) translateY(-1px);
    }
  }

  &:active {
    transform: translateY(0px);
  }

  // 移动端样式
  @media (max-width: 1100px) {
    padding: 8px 10px;
    min-width: 36px;
    justify-content: center;
  }
}

// 心跳动画
@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  10%, 30% {
    transform: scale(1.1);
  }
  20%, 40% {
    transform: scale(1);
  }
}

.action-btn {
  width: 36px;
  height: 36px;
  border: 1px solid var(--el-border-color-lighter);
  background: linear-gradient(135deg, 
    var(--el-bg-color) 0%,
    var(--el-fill-color-extra-light) 100%);
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-regular);
  font-size: 15px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 34px;
    height: 34px;
    font-size: 14px;
  }
  
  // 添加内部光泽
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg,
      rgba(255, 255, 255, 0.15) 0%,
      transparent 100%);
    pointer-events: none;
  }
  
  i {
    transition: all 0.3s ease;
  }
  
  &:hover {
    border-color: @primary-color;
    background: linear-gradient(135deg,
      rgba(139, 92, 246, 0.1) 0%,
      rgba(217, 70, 239, 0.15) 100%);
    color: @primary-color;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);
    
    i {
      transform: scale(1.1);
    }
  }
  
  &:active {
    transform: translateY(0px);
  }
}

// 主题按钮特殊样式
.theme-btn {
  &.dark-mode {
    color: #fbbf24;
    background: linear-gradient(135deg,
      rgba(251, 191, 36, 0.08) 0%,
      rgba(245, 158, 11, 0.12) 100%);
    border-color: rgba(251, 191, 36, 0.25);
    
    &::before {
      background: linear-gradient(180deg,
        rgba(251, 191, 36, 0.15) 0%,
        transparent 100%);
    }
    
    &:hover {
      color: #f59e0b;
      background: linear-gradient(135deg,
        rgba(251, 191, 36, 0.15) 0%,
        rgba(245, 158, 11, 0.2) 100%);
      border-color: rgba(251, 191, 36, 0.4);
      box-shadow: 0 4px 16px rgba(251, 191, 36, 0.25);
    }
  }
  
  &:not(.dark-mode) {
    color: var(--el-text-color-regular);
    
    &:hover {
      color: @primary-color;
    }
  }
}

// 移动端菜单按钮
.menu-btn {
  display: none;
  
  @media (max-width: 992px) {
    display: flex;
  }
}

// ==================== 用户区域 ====================
.user-area {
  display: flex;
  align-items: center;
  
  @media (max-width: 992px) {
    // 移动端也显示用户区域，但要简化样式
  }
}

.user-trigger {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 10px 4px 4px;
  border-radius: 10px; // 与切换主题按钮圆角保持一致
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: var(--el-border-color);
    background: var(--el-fill-color-light);
    
    .user-name {
      color: @primary-color;
    }
    
    .dropdown-icon {
      color: @primary-color;
      transform: rotate(180deg);
    }
  }
  
  .user-avatar {
    border: 2px solid var(--el-border-color-lighter);
  }
  
  .user-name {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    transition: color 0.2s ease;
    white-space: nowrap;
    max-width: 120px; // 增加最大宽度
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 8px; // 给Premium标签预留空间
    
    @media (max-width: 1200px) {
      max-width: 100px;
    }
    
    @media (max-width: 1000px) {
      max-width: 85px;
      font-size: 12px;
    }
    
    @media (max-width: 768px) {
      max-width: 70px;
      font-size: 11px;
      padding-right: 6px;
    }
    
    @media (max-width: 480px) {
      max-width: 55px;
      font-size: 10px;
      padding-right: 4px;
    }
  }
  
  // 右上角吸附Premium标签 - 参考FeaturedArticlesCard的corner-badge样式
  .premium-corner-badge {
    position: absolute;
    top: 0;
    right: 0;
    font-size: 8px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.3px;
    padding: 2px 6px;
    background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%); // 使用渐变色增强层次感
    color: #ffffff; // 白色文字更清晰
    line-height: 1.2;
    z-index: 10; // 降低z-index避免遮挡昵称
    border-radius: 0 0 0 10px; // 与切换主题按钮保持一致的圆角
    transition: all 0.3s ease;
    box-shadow: 0 2px 6px rgba(251, 191, 36, 0.3);
    // 确保文字清晰 - 使用filter属性增强对比度
    filter: contrast(1.2) brightness(1.1);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
    font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
    
    // 角标阴影效果 - 匹配渐变色的两个角度
    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      right: 0;
      width: 0;
      height: 0;
      border-right: 4px solid #d97706; // 右下角使用渐变色右侧颜色
      border-bottom: 4px solid transparent;
    }
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -4px;
      width: 0;
      height: 0;
      border-top: 4px solid #fbbf24; // 左上角使用渐变色左侧颜色
      border-left: 4px solid transparent;
    }
    
    i {
      font-size: 7px;
      margin-right: 2px;
      color: #ffffff; // 与文字颜色保持一致
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.3));
    }
    
    span {
      font-size: 7px;
      font-weight: 700;
      letter-spacing: 0.2px;
    }
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 3px 8px rgba(251, 191, 36, 0.4);
    }
    
    @media (max-width: 768px) {
      top: 0;
      right: 0;
      padding: 2px 5px;
      font-size: 7px;
      border-radius: 0 0 0 8px; // 移动端相应调整
      
      i {
        font-size: 6px;
      }
      
      span {
        font-size: 6px;
      }
    }
  }
  
  .dropdown-icon {
    font-size: 10px;
    color: var(--el-text-color-secondary);
    transition: all 0.2s ease;
  }
}

// 用户下拉菜单
:deep(.user-dropdown-menu) {
  padding: 6px;
  border-radius: 8px;
  
  .el-dropdown-menu__item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border-radius: 6px;
    font-size: 13px;
    
    i {
      font-size: 13px;
      color: var(--el-text-color-secondary);
    }
    
    &:hover {
      background: var(--el-color-primary-light-9);
      color: @primary-color;
      
      i {
        color: @primary-color;
      }
    }
  }
}

// ==================== 登录按钮 ====================
.login-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid #8b5cf6;
  background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
  border-radius: 10px;
  color: white;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.25);
  
  @media (max-width: 992px) {
    display: none !important;
  }
  
  i {
    font-size: 12px;
    transition: transform 0.3s ease;
  }
  
  span {
    font-weight: 600;
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
    border-color: #7c3aed;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(139, 92, 246, 0.35);
    
    i {
      transform: scale(1.1);
    }
  }
  
  &:active {
    transform: translateY(0);
  }
}

// ==================== 移动端抽屉 ====================
.mobile-menu {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  overflow-y: auto;
}

.drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
  
  .close-btn {
    width: 36px;
    height: 36px;
    border: 1px solid var(--el-border-color-light);
    background: var(--el-fill-color-light);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-regular);
    font-size: 16px;
    transition: all 0.2s ease;
    
    &:hover {
      background: var(--el-color-error-light-8);
      border-color: var(--el-color-error-light-6);
      color: var(--el-color-error);
      transform: rotate(90deg);
    }
  }
}

.drawer-divider {
  height: 1px;
  background: var(--el-border-color-extra-light);
  margin: 16px 20px;
}

// 抽屉用户区
.drawer-user-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, 
    var(--el-color-primary-light-9) 0%, 
    var(--el-fill-color-extra-light) 100%);
  border-radius: 16px;
  margin: 0 20px;
  border: 1px solid var(--el-border-color-extra-light);
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, 
      @primary-color, 
      @secondary-color);
    border-radius: 16px 16px 0 0;
  }
  
  .user-avatar-wrapper {
    position: relative;
    
    .drawer-user-avatar {
      border: 3px solid var(--el-color-primary-light-5);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
    }
    
    .online-badge {
      position: absolute;
      bottom: 0px;
      right: 0px;
      width: 14px;
      height: 14px;
      background: linear-gradient(135deg, #10b981, #059669);
      border: 3px solid var(--el-bg-color);
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(16, 185, 129, 0.4);
      animation: pulse 2s infinite;
    }
  }
  
  .user-info {
    flex: 1;
    min-width: 0;
    
    .user-name-text {
      font-size: 16px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      margin: 0 0 6px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    
    // 移动端右上角吸附Premium标签
    .mobile-premium-corner-badge {
      position: absolute;
      top: 0;
      right: 0;
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      padding: 3px 7px;
      background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #d97706 100%); // 移动端使用同样的渐变色
      color: #ffffff; // 白色文字更清晰
      line-height: 1.2;
      z-index: 10; // 降低z-index避免遮挡昵称
      border-radius: 0 0 0 12px; // 移动端抽屉略大一些，与整体UI风格保持一致
      transition: all 0.3s ease;
      box-shadow: 0 3px 8px rgba(251, 191, 36, 0.4);
      // 移动端增强文字清晰度
      filter: contrast(1.3) brightness(1.2);
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
      
      // 移动端角标阴影效果 - 匹配渐变色的两个角度
      &::after {
        content: '';
        position: absolute;
        bottom: -5px;
        right: 0;
        width: 0;
        height: 0;
        border-right: 5px solid #d97706; // 右下角使用渐变色右侧颜色
        border-bottom: 5px solid transparent;
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: -5px;
        width: 0;
        height: 0;
        border-top: 5px solid #fbbf24; // 左上角使用渐变色左侧颜色
        border-left: 5px solid transparent;
      }
      
      i {
        font-size: 8px;
        margin-right: 3px;
        color: #ffffff; // 与文字颜色保持一致
        filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.4));
      }
      
      span {
        font-size: 8px;
        font-weight: 700;
        letter-spacing: 0.2px;
      }
      
      &:hover {
        transform: scale(1.08);
        box-shadow: 0 4px 12px rgba(251, 191, 36, 0.5);
      }
    }
    
    .user-status {
      font-size: 13px;
      color: #10b981;
      margin: 0;
      font-weight: 600;
      display: flex;
      align-items: center;
      gap: 6px;
      
      &::before {
        content: '';
        width: 6px;
        height: 6px;
        background: #10b981;
        border-radius: 50%;
        display: inline-block;
        animation: pulse 2s infinite;
      }
    }
  }
  
  .logout-icon-btn {
    width: 36px;
    height: 36px;
    border: 1px solid var(--el-color-error-light-6);
    background: var(--el-color-error-light-9);
    color: var(--el-color-error);
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 15px;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: var(--el-color-error);
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    i {
      position: relative;
      z-index: 1;
      transition: color 0.3s ease;
    }
    
    &:hover {
      border-color: var(--el-color-error);
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(245, 101, 101, 0.3);
      
      &::before {
        opacity: 1;
      }
      
      i {
        color: white;
      }
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}

// 抽屉登录区
.drawer-login-section {
  padding: 16px 20px;
  
  .login-prompt {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 16px;
    
    .login-icon {
      width: 40px;
      height: 40px;
      background: @primary-color;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 20px;
    }
    
    .login-text {
      h4 {
        font-size: 15px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        margin: 0 0 4px;
      }
      
      p {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        margin: 0;
      }
    }
  }
  
  .drawer-login-btn {
    width: 100%;
    height: 44px;
    border: none;
    background: linear-gradient(135deg, @primary-color, @secondary-color);
    color: white;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s ease;
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
}

// 抽屉导航
.drawer-nav-section {
  padding: 0 20px;
  margin-bottom: 16px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 12px;
  
  i {
    font-size: 12px;
  }
}

.drawer-nav-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.drawer-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 10px;
  text-decoration: none;
  color: var(--el-text-color-primary);
  transition: all 0.2s ease;
  animation: slideIn 0.3s ease forwards;
  opacity: 0;
  
  .nav-item-icon {
    width: 32px;
    height: 32px;
    background: var(--el-fill-color-light);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @primary-color;
    font-size: 14px;
    transition: all 0.2s ease;
  }
  
  .nav-item-text {
    flex: 1;
    font-size: 14px;
    font-weight: 600;
  }
  
  .nav-arrow {
    font-size: 12px;
    color: var(--el-text-color-placeholder);
    opacity: 0;
    transition: all 0.2s ease;
  }
  
  &:hover {
    background: var(--el-color-primary-light-9);
    color: @primary-color;
    transform: translateX(4px);
    
    .nav-item-icon {
      background: @primary-color;
      color: white;
    }
    
    .nav-arrow {
      opacity: 1;
      transform: translateX(4px);
    }
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 抽屉捐赠区
.drawer-donation-section {
  padding: 0 20px;
  margin-bottom: 8px;
}

.drawer-donation-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg,
    rgba(245, 158, 11, 0.08) 0%,
    rgba(234, 88, 12, 0.12) 100%);
  border: 1px solid rgba(245, 158, 11, 0.2);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  // 内部光泽
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg,
      rgba(255, 255, 255, 0.15) 0%,
      transparent 100%);
    pointer-events: none;
  }

  .donation-card-icon {
    width: 48px;
    height: 48px;
    border-radius: 12px;
    background: linear-gradient(135deg,
      rgba(245, 158, 11, 0.2) 0%,
      rgba(234, 88, 12, 0.3) 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;

    i {
      font-size: 22px;
      color: #f59e0b;
      transition: transform 0.3s ease;
    }
  }

  .donation-card-content {
    flex: 1;

    .donation-card-title {
      font-size: 15px;
      font-weight: 700;
      color: #f59e0b;
      margin: 0 0 4px;
    }

    .donation-card-desc {
      font-size: 12px;
      color: rgba(245, 158, 11, 0.8);
      margin: 0;
    }
  }

  .donation-arrow {
    font-size: 14px;
    color: rgba(245, 158, 11, 0.6);
    transition: all 0.3s ease;
  }

  &:hover {
    background: linear-gradient(135deg,
      rgba(245, 158, 11, 0.15) 0%,
      rgba(234, 88, 12, 0.2) 100%);
    border-color: rgba(245, 158, 11, 0.4);
    transform: translateX(4px);
    box-shadow: 0 4px 16px rgba(245, 158, 11, 0.2);

    .donation-card-icon i {
      transform: scale(1.15) translateY(-2px);
    }

    .donation-arrow {
      color: #ea580c;
      transform: translateX(4px);
    }
  }

  &:active {
    transform: translateX(2px);
  }
}

// 抽屉主题区
.drawer-theme-section {
  padding: 0 20px;
  
  .theme-switch-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--el-fill-color-extra-light);
    border-radius: 10px;
    
    .theme-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      
      .theme-label {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
      
      .theme-desc {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

// ==================== 暗色模式 ====================
html.dark {
  .main-header-v2 {
    background: var(--el-bg-color);
    border-bottom-color: var(--el-border-color-darker);
  }
}
</style>

