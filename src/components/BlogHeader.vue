<template>
  <div class="header-wrapper">
    <!-- 头部占位符，避免内容被固定头部遮挡 -->
    <div class="header-spacer"></div>
    <el-header class="main-header">
      <el-container class="header-container">
        <!-- Logo -->
        <Logo 
          :show-text="true" 
          class="header-logo"
          primary-color="#8b5cf6"
          secondary-color="#d946ef"
          accent-color="#3b82f6"
        />

        <!-- 导航 -->
        <nav class="nav">
          <router-link
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            class="nav-link"
            active-class="active"
          >
            <i :class="item.icon"></i>
            {{ item.title }}
          </router-link>
        </nav>

        <!-- 右侧操作 -->
        <div class="actions">
          <!-- 捐赠按钮 -->
          <router-link to="/donation" class="btn-donation">
            <i class="fas fa-heart"></i>
            <span class="donation-text">捐赠本站</span>
          </router-link>

          <button class="btn-icon theme-toggle" :class="{ 'dark-mode': isDarkMode }" @click="toggleTheme">
            <i :class="isDarkMode ? 'fas fa-sun' : 'fas fa-moon'"></i>
          </button>

          <!-- 用户 -->
          <div v-if="isLoggedIn" class="user">
            <el-dropdown>
              <div class="user-info">
                <el-avatar :size="32" :src="userAvatar">{{ userInitial }}</el-avatar>
                <span>{{ userName }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click="goToProfile">
                    <el-icon><User /></el-icon>
                    个人中心
                  </el-dropdown-item>
                  <el-dropdown-item @click="goToSettings">
                    <el-icon><Setting /></el-icon>
                    设置
                  </el-dropdown-item>
                  <el-dropdown-item @click="logout">
                    <el-icon><SwitchButton /></el-icon>
                    退出
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
          <el-button v-else type="primary" size="default" @click="showLogin">
            <el-icon><User /></el-icon>
            登录
          </el-button>

          <!-- 移动端菜单 -->
          <button class="btn-menu" @click="mobileMenuOpen = true">
            <i class="fas fa-bars"></i>
          </button>
        </div>
      </el-container>
    </el-header>



    <!-- 移动端菜单 -->
    <el-drawer v-model="mobileMenuOpen" size="320px" direction="rtl" :with-header="false">
      <div class="mobile-menu">

        <!-- 统一的菜单内容容器 -->
        <div class="menu-content">
          <!-- 移动端Logo标识 -->
          <div class="mobile-logo">
            <Logo 
              :show-text="true" 
              :is-mobile="true" 
              title="返回首页 - 知识棱镜"
              primary-color="#8b5cf6"
              secondary-color="#d946ef"
              accent-color="#3b82f6"
              @click="mobileMenuOpen = false"
            />
            <button class="drawer-close-btn" @click="mobileMenuOpen = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <!-- 分割线 -->
          <div class="divider"></div>
          
          <!-- 用户信息区域 -->
          <div class="user-section" v-if="isLoggedIn">
            <div class="user-avatar-section">
              <el-avatar :size="40" :src="userAvatar" class="user-avatar">{{ userInitial }}</el-avatar>
              <div class="online-indicator"></div>
            </div>
            <div class="user-info">
              <h4 class="user-name">{{ userName }}</h4>
              <p class="user-status">在线</p>
            </div>
            <button class="logout-btn" @click="logout">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>

          <!-- 登录区域 -->
          <div v-else class="login-section">
            <div class="login-content">
              <div class="login-icon">
                <i class="fas fa-user-circle"></i>
              </div>
              <div class="login-text">
                <h4>欢迎访问</h4>
                <p>登录以获得更好体验</p>
              </div>
            </div>
            <el-button type="primary" class="login-btn" @click="showLogin">
              <i class="fas fa-sign-in-alt"></i>
              立即登录
            </el-button>
          </div>

          <!-- 分割线 -->
          <div class="divider"></div>

          <!-- 导航菜单区域 -->
          <div class="nav-section">
            <div class="section-title">
              <i class="fas fa-compass"></i>
              <span>导航菜单</span>
            </div>
            <div class="nav-list">
              <router-link
                v-for="(item, index) in navItems"
                :key="item.path"
                :to="item.path"
                @click="mobileMenuOpen = false"
                class="nav-item"
                :style="{ 'animation-delay': `${0.1 + index * 0.05}s` }"
              >
                <div class="nav-icon">
                  <i :class="item.icon"></i>
                </div>
                <span class="nav-text">{{ item.title }}</span>
                <div class="nav-arrow">
                  <i class="fas fa-chevron-right"></i>
                </div>
              </router-link>
            </div>
          </div>

          <!-- 分割线 -->
          <div class="divider"></div>

          <!-- 主题设置区域 -->
          <div class="theme-section">
            <div class="section-title">
              <i class="fas fa-palette"></i>
              <span>主题设置</span>
            </div>
            <div class="theme-control">
              <div class="theme-info">
                <span class="theme-label">{{ isDarkMode ? '深色模式' : '浅色模式' }}</span>
                <span class="theme-desc">切换界面主题</span>
              </div>
              <el-switch
                :model-value="isDarkMode"
                @change="toggleTheme"
                class="theme-switch"
                active-color="#1677FF"
                inactive-color="#dcdfe6"
              />
            </div>
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
import { User, Setting, SwitchButton } from '@element-plus/icons-vue'
import { useStore } from '../store'
import { useThemeStore } from '@/stores/theme'
import { removeToken } from '@/util/Auth'
import Logo from './Logo.vue'

const router = useRouter()
const store = useStore()
const themeStore = useThemeStore()

// 注册图标组件
const iconComponents = {
  User,
  Setting,
  SwitchButton
}

// 响应式数据
const mobileMenuOpen = ref(false)
const isDarkMode = computed(() => themeStore.isDark)

// 导航项目
const navItems = ref([
  { title: '首页', path: '/index', icon: 'fas fa-home' },
  { title: '资源', path: '/resources', icon: 'fas fa-folder' },
  { title: '商城', path: '/shop', icon: 'fas fa-list' },
  { title: '创作', path: '/write', icon: 'fas fa-edit' },
  { title: '关于', path: '/about', icon: 'fas fa-info' }
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

// 方法
const toggleTheme = () => {
  themeStore.toggleTheme()
}

const showLogin = () => {
  // 触发全局登录弹窗显示事件
  const event = new CustomEvent('show-login-modal')
  window.dispatchEvent(event)
}

const goToProfile = () => {
  router.push('/profile')
}
 
const goToSettings = () => {
  router.push('/settings')
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
  // 主题已经在main.ts中初始化，这里不需要重复初始化
})
</script>

<style scoped lang="less">
.header-wrapper {
  position: relative;
  z-index: 1000;
}

.header-spacer {
  height: 60px;
  
  @media (max-width: 768px) {
    height: 50px; // 移动端减少高度
  }
}

.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: linear-gradient(135deg, 
    var(--el-bg-color-overlay) 0%, 
    var(--el-bg-color-page) 50%,
    var(--el-bg-color-overlay) 100%);
  border-bottom: 1px solid var(--el-border-color-lighter);
  z-index: 1000;
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.06),
    0 4px 16px rgba(0, 0, 0, 0.04),
    0 2px 8px rgba(0, 0, 0, 0.02),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  padding: 0;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  
  // 添加顶部光泽效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, 
      transparent 0%, 
      var(--el-border-color-light) 50%, 
      transparent 100%);
  }
  
  @media (max-width: 768px) {
    height: 50px;
    backdrop-filter: blur(16px) saturate(160%);
    -webkit-backdrop-filter: blur(16px) saturate(160%);
    background: var(--el-bg-color-overlay);
  }
}

.header-container {
  max-width: 1440px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
  
  @media (max-width: 768px) {
    padding: 0 12px; // 移动端减少内边距
  }
}

// 头部Logo移动端样式
.header-logo {
  @media (max-width: 768px) {
    :deep(.logo-text) {
      display: none; // 移动端隐藏文字
    }
    
    :deep(.logo-container) {
      padding: 4px 6px; // 减少内边距
    }
  }
}


.nav {
  display: flex;
  gap: 20px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  text-decoration: none;
  color: var(--el-text-color-regular);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: transparent;
  border: 1px solid transparent;
  position: relative;
  overflow: hidden;

  &:hover, &.active {
    color: var(--el-color-primary);
    background: linear-gradient(135deg, 
      var(--el-color-primary-light-9) 0%, 
      var(--el-color-primary-light-8) 50%,
      var(--el-color-primary-light-9) 100%);
    border-color: var(--el-color-primary-light-7);
    backdrop-filter: blur(8px) saturate(150%);
    -webkit-backdrop-filter: blur(8px) saturate(150%);
    box-shadow: 
      0 2px 8px var(--el-color-primary-light-9),
      inset 0 1px 0 var(--el-color-primary-light-8);
    transform: translateY(-1px);
    
    // 内部光泽
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, 
        var(--el-color-primary-light-8) 0%, 
        transparent 100%);
      opacity: 0.5;
      pointer-events: none;
    }
  }
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
  
  @media (max-width: 768px) {
    gap: 8px; // 移动端减小间距
  }
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: 1px solid transparent;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-regular);
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  position: relative;
  overflow: hidden;
  
  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    border-radius: 6px;
  }

  // 图标旋转动画
  i {
    transition: all 0.3s ease;
  }

  &:hover {
    color: var(--el-color-primary);
    background: linear-gradient(135deg, 
      var(--el-color-primary-light-9) 0%, 
      var(--el-color-primary-light-8) 50%,
      var(--el-color-primary-light-9) 100%);
    border-color: var(--el-color-primary-light-7);
    backdrop-filter: blur(8px) saturate(150%);
    -webkit-backdrop-filter: blur(8px) saturate(150%);
    box-shadow: 
      0 2px 8px var(--el-color-primary-light-9),
      inset 0 1px 0 var(--el-color-primary-light-8);
    transform: translateY(-1px);
    
    // 内部光泽
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, 
        var(--el-color-primary-light-8) 0%, 
        transparent 100%);
      opacity: 0.5;
      pointer-events: none;
    }
    
    // 悬停时图标轻微旋转
    i {
      transform: rotate(15deg) scale(1.1);
    }
  }
  
  // 点击时的旋转动画
  &:active {
    i {
      transform: rotate(180deg) scale(0.9);
    }
  }
}

// 主题切换按钮特殊样式
.theme-toggle {
  // 暗黑模式下的特殊样式 - 保持原来的暖黄色
  &.dark-mode {
    color: #fbbf24; // 暖黄色，表示太阳
    background: linear-gradient(135deg, 
      rgba(251, 191, 36, 0.1) 0%, 
      rgba(245, 158, 11, 0.08) 50%,
      rgba(251, 191, 36, 0.1) 100%);
    border-color: rgba(251, 191, 36, 0.3);
    box-shadow: 
      0 2px 8px rgba(251, 191, 36, 0.2),
      inset 0 1px 0 rgba(251, 191, 36, 0.15);
      
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, 
        rgba(251, 191, 36, 0.12) 0%, 
        transparent 100%);
      opacity: 0.6;
      pointer-events: none;
    }
    
    &:hover {
      color: #f59e0b;
      background: linear-gradient(135deg, 
        rgba(251, 191, 36, 0.15) 0%, 
        rgba(245, 158, 11, 0.12) 50%,
        rgba(251, 191, 36, 0.15) 100%);
      border-color: rgba(251, 191, 36, 0.4);
      box-shadow: 
        0 4px 12px rgba(251, 191, 36, 0.25),
        0 2px 8px rgba(251, 191, 36, 0.2),
        inset 0 1px 0 rgba(251, 191, 36, 0.2);
      transform: translateY(-1px) scale(1.05);
        
      &::before {
        opacity: 0.8;
      }
    }
  }
  
  // 浅色模式下的特殊样式 - 真正的蓝色
  &:not(.dark-mode) {
    color: #3b82f6; // 真正的蓝色
    background: linear-gradient(135deg, 
      rgba(59, 130, 246, 0.1) 0%, 
      rgba(37, 99, 235, 0.08) 50%,
      rgba(59, 130, 246, 0.1) 100%);
    border-color: rgba(59, 130, 246, 0.3);
    box-shadow: 
      0 2px 8px rgba(59, 130, 246, 0.2),
      inset 0 1px 0 rgba(59, 130, 246, 0.15);
      
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 50%;
      background: linear-gradient(180deg, 
        rgba(59, 130, 246, 0.12) 0%, 
        transparent 100%);
      opacity: 0.6;
      pointer-events: none;
    }
    
    &:hover {
      color: #2563eb;
      background: linear-gradient(135deg, 
        rgba(59, 130, 246, 0.15) 0%, 
        rgba(37, 99, 235, 0.12) 50%,
        rgba(59, 130, 246, 0.15) 100%);
      border-color: rgba(59, 130, 246, 0.4);
      box-shadow: 
        0 4px 12px rgba(59, 130, 246, 0.25),
        0 2px 8px rgba(59, 130, 246, 0.2),
        inset 0 1px 0 rgba(59, 130, 246, 0.2);
      transform: translateY(-1px) scale(1.05);
        
      &::before {
        opacity: 0.8;
      }
    }
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 8px 14px;
  border-radius: 20px;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  color: var(--el-text-color-primary);
  border: 1px solid var(--el-border-color-light);
  background: linear-gradient(135deg, 
    var(--el-fill-color-extra-light) 0%, 
    var(--el-fill-color-light) 50%,
    var(--el-fill-color) 100%);
  box-shadow: 
    0 4px 12px var(--el-box-shadow-light),
    0 2px 6px var(--el-box-shadow-lighter),
    inset 0 1px 0 var(--el-border-color-extra-light);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  position: relative;
  overflow: hidden;
  
  // 内部光泽效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, 
      var(--el-border-color-extra-light) 0%, 
      transparent 100%);
    pointer-events: none;
  }
  
  @media (max-width: 768px) {
    padding: 4px 8px;
    gap: 6px;
    border-radius: 16px;
    background: var(--el-fill-color-light);
    border: 1px solid var(--el-border-color-lighter);
    box-shadow: 0 2px 6px var(--el-box-shadow-lighter);
    backdrop-filter: blur(12px) saturate(160%);
    -webkit-backdrop-filter: blur(12px) saturate(160%);
  }

  &:hover {
    background: linear-gradient(135deg, 
      rgba(22, 119, 255, 0.25) 0%, 
      rgba(22, 119, 255, 0.15) 50%,
      rgba(22, 119, 255, 0.2) 100%);
    color: var(--el-color-primary);
    border-color: rgba(22, 119, 255, 0.4);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.12),
      0 4px 12px rgba(22, 119, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transform: translateY(-2px) scale(1.02);
    
    @media (max-width: 768px) {
      transform: scale(1.02);
      background: rgba(22, 119, 255, 0.2);
      border-color: rgba(22, 119, 255, 0.3);
      box-shadow: 0 3px 8px rgba(22, 119, 255, 0.15);
    }
  }

  span {
    font-weight: 500;
    font-size: 14px;
    color: inherit;
    
    @media (max-width: 768px) {
      font-size: 12px; // 移动端减小字体
    }
  }
  
  :deep(.el-avatar) {
    @media (max-width: 768px) {
      width: 24px !important; // 移动端减小头像
      height: 24px !important;
      font-size: 12px !important;
    }
  }
}

/* 登录按钮液态玻璃效果 */
:deep(.el-button--primary) {
  background: linear-gradient(135deg, 
    var(--el-color-primary-light-9) 0%, 
    var(--el-color-primary-light-8) 50%,
    var(--el-color-primary-light-9) 100%) !important;
  border: 1px solid var(--el-color-primary-light-7) !important;
  color: var(--el-color-primary) !important;
  border-radius: 8px;
  font-weight: 600;
  backdrop-filter: blur(8px) saturate(150%) !important;
  -webkit-backdrop-filter: blur(8px) saturate(150%) !important;
  box-shadow: 
    0 2px 8px var(--el-color-primary-light-9),
    inset 0 1px 0 var(--el-color-primary-light-8) !important;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
  position: relative !important;
  overflow: hidden !important;
  
  // 内部光泽
  &::before {
    content: '' !important;
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    right: 0 !important;
    height: 50% !important;
    background: linear-gradient(180deg, 
      var(--el-color-primary-light-8) 0%, 
      transparent 100%) !important;
    opacity: 0.5 !important;
    pointer-events: none !important;
  }
  
  &:hover {
    background: linear-gradient(135deg, 
      var(--el-color-primary-light-8) 0%, 
      var(--el-color-primary-light-7) 50%,
      var(--el-color-primary-light-8) 100%) !important;
    border-color: var(--el-color-primary-light-6) !important;
    color: var(--el-color-primary) !important;
    transform: translateY(-1px) !important;
    box-shadow: 
      0 4px 12px var(--el-color-primary-light-8),
      inset 0 1px 0 var(--el-color-primary-light-7) !important;
      
    &::before {
      opacity: 0.7 !important;
    }
  }
  
  &:focus {
    background: linear-gradient(135deg, 
      var(--el-color-primary-light-9) 0%, 
      var(--el-color-primary-light-8) 50%,
      var(--el-color-primary-light-9) 100%) !important;
    border-color: var(--el-color-primary-light-7) !important;
    color: var(--el-color-primary) !important;
  }
  
  &:active {
    background: linear-gradient(135deg, 
      var(--el-color-primary-light-8) 0%, 
      var(--el-color-primary-light-7) 50%,
      var(--el-color-primary-light-8) 100%) !important;
    border-color: var(--el-color-primary-light-6) !important;
    color: var(--el-color-primary) !important;
    transform: translateY(0px) !important;
  }
  
  .el-icon {
    margin-right: 6px;
    color: var(--el-color-primary) !important;
  }
  
  span {
    color: var(--el-color-primary) !important;
  }
}

.btn-menu {
  display: none;
  width: 32px;
  height: 32px;
  border: 1px solid var(--el-border-color-light);
  background: linear-gradient(135deg, 
    var(--el-fill-color-extra-light) 0%, 
    var(--el-fill-color-light) 50%,
    var(--el-fill-color) 100%);
  border-radius: 10px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-regular);
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  box-shadow: 
    0 4px 12px var(--el-box-shadow-light),
    0 2px 6px var(--el-box-shadow-lighter),
    inset 0 1px 0 var(--el-border-color-extra-light);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  position: relative;
  overflow: hidden;
  
  // 内部高亮效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, 
      var(--el-border-color-extra-light) 0%, 
      transparent 100%);
    pointer-events: none;
  }

  &:hover {
    background: linear-gradient(135deg, 
      rgba(22, 119, 255, 0.3) 0%, 
      rgba(22, 119, 255, 0.2) 50%,
      rgba(22, 119, 255, 0.25) 100%);
    color: var(--el-color-primary);
    border-color: rgba(22, 119, 255, 0.4);
    box-shadow: 
      0 8px 24px rgba(0, 0, 0, 0.12),
      0 4px 12px rgba(22, 119, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.8);
    transform: translateY(-2px) scale(1.05);
  }
}



/* 简洁精致的移动端菜单 */
.mobile-menu {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  overflow-y: auto;
  overflow-x: hidden;
  transition: background-color 0.3s ease;
}

// 移动端Logo区域
.mobile-logo {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  margin-bottom: 8px;
  
  :deep(.logo-container) {
    flex: 1;
    margin-right: 8px;
  }
}

.drawer-close-btn {
  width: 32px;
  height: 32px;
  border: 1px solid var(--el-border-color-light);
  background: var(--el-fill-color-light);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-regular);
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--el-color-error-light-8);
    border-color: var(--el-color-error-light-6);
    color: var(--el-color-error);
    transform: scale(1.05);
  }
}

// 简洁的菜单内容容器
.menu-content {
  flex: 1;
  padding: 16px 0;
}

// 精致的用户信息区域
.user-section {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  margin: 0 16px 12px;
  background: var(--el-fill-color-blank);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--el-border-color-light);
  transition: all 0.3s ease;

  .user-avatar-section {
    position: relative;

    .user-avatar {
      border: 2px solid var(--el-color-primary-light-6);
      box-shadow: 
        0 3px 8px var(--el-color-primary-light-8),
        0 1px 3px var(--el-color-primary-light-7);
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
        box-shadow: 
          0 4px 12px var(--el-color-primary-light-7),
          0 2px 6px var(--el-color-primary-light-6);
      }
    }

    .online-indicator {
      position: absolute;
      bottom: 1px;
      right: 1px;
      width: 10px;
      height: 10px;
      background: var(--el-color-success);
      border-radius: 50%;
      border: 2px solid var(--el-bg-color);
      box-shadow: 
        0 2px 4px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 var(--el-color-success-light-3);
    }
  }

  .user-info {
    flex: 1;

    .user-name {
      font-size: 14px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin: 0 0 2px;
      line-height: 1.2;
    }

    .user-status {
      font-size: 11px;
      color: var(--el-color-success);
      margin: 0;
      opacity: 0.85;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .logout-btn {
    width: 24px;
    height: 24px;
    border: 1px solid var(--el-color-danger-light-7);
    background: var(--el-color-danger-light-9);
    color: var(--el-color-danger);
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      background: var(--el-color-danger);
      color: white;
      border-color: var(--el-color-danger);
    }
  }
}

// 精致的登录区域
.login-section {
  padding: 12px;
  margin: 0 16px 12px;
  background: var(--el-fill-color-blank);
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  border: 1px solid var(--el-border-color-light);
  transition: all 0.3s ease;

  .login-content {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;

    .login-icon {
      width: 30px;
      height: 30px;
      background: var(--el-color-primary);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 15px;
      box-shadow: 0 2px 4px var(--el-color-primary-light-8);
    }

    .login-text {
      h4 {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 2px;
      }

      p {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        margin: 0;
        opacity: 0.85;
      }
    }
  }

  :deep(.login-btn) {
    width: 100%;
    height: 36px;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 600;
    background: linear-gradient(135deg, 
      var(--el-color-primary-light-9) 0%, 
      var(--el-color-primary-light-8) 50%,
      var(--el-color-primary-light-9) 100%) !important;
    border: 1px solid var(--el-color-primary-light-7) !important;
    color: var(--el-color-primary) !important;
    backdrop-filter: blur(8px) saturate(150%) !important;
    -webkit-backdrop-filter: blur(8px) saturate(150%) !important;
    box-shadow: 
      0 2px 8px var(--el-color-primary-light-9),
      inset 0 1px 0 var(--el-color-primary-light-8) !important;
    transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) !important;
    position: relative !important;
    overflow: hidden !important;
    
    // 内部光泽
    &::before {
      content: '' !important;
      position: absolute !important;
      top: 0 !important;
      left: 0 !important;
      right: 0 !important;
      height: 50% !important;
      background: linear-gradient(180deg, 
        var(--el-color-primary-light-8) 0%, 
        transparent 100%) !important;
      opacity: 0.5 !important;
      pointer-events: none !important;
    }
    
    &:hover {
      background: linear-gradient(135deg, 
        var(--el-color-primary-light-8) 0%, 
        var(--el-color-primary-light-7) 50%,
        var(--el-color-primary-light-8) 100%) !important;
      border-color: var(--el-color-primary-light-6) !important;
      color: var(--el-color-primary) !important;
      transform: translateY(-1px) !important;
      box-shadow: 
        0 4px 12px var(--el-color-primary-light-8),
        inset 0 1px 0 var(--el-color-primary-light-7) !important;
        
      &::before {
        opacity: 0.7 !important;
      }
    }
    
    &:focus {
      background: linear-gradient(135deg, 
        var(--el-color-primary-light-9) 0%, 
        var(--el-color-primary-light-8) 50%,
        var(--el-color-primary-light-9) 100%) !important;
      border-color: var(--el-color-primary-light-7) !important;
      color: var(--el-color-primary) !important;
    }
    
    .el-icon {
      color: var(--el-color-primary) !important;
    }
    
    span {
      color: var(--el-color-primary) !important;
    }
  }
}

// 简洁的分割线
.divider {
  height: 1px;
  background: var(--el-border-color-extra-light);
  margin: 6px 16px;
  transition: background-color 0.3s ease;
}

// 简洁的区域标题样式
.section-title {
  display: flex;
  align-items: center;
  gap: 4px;
  margin: 0 16px 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--el-text-color-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  opacity: 0.8;
  transition: color 0.3s ease;

  i {
    font-size: 10px;
  }
}

// 简洁的导航区域
.nav-section {
  margin-bottom: 8px;

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 22px;
    text-decoration: none;
    color: var(--el-text-color-primary);
    border-radius: 4px;
    transition: all 0.3s ease;
    animation: slideInLeft 0.3s ease forwards;
    opacity: 0;

    &:hover {
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
      transform: translateX(2px);

      .nav-icon {
        background: var(--el-color-primary);
        color: white;
      }

      .nav-arrow {
        opacity: 1;
      }
    }

    .nav-icon {
      width: 24px;
      height: 24px;
      background: var(--el-fill-color-blank);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-color-primary);
      font-size: 11px;
      transition: all 0.3s ease;
      flex-shrink: 0;
      border: 1px solid var(--el-border-color-light);
    }

    .nav-text {
      flex: 1;
      font-size: 13px;
      font-weight: 500;
    }

    .nav-arrow {
      color: var(--el-text-color-placeholder);
      font-size: 9px;
      transition: all 0.2s ease;
      opacity: 0;
    }

    // 动画延迟
    &:nth-child(1) { animation-delay: 0.1s; }
    &:nth-child(2) { animation-delay: 0.15s; }
    &:nth-child(3) { animation-delay: 0.2s; }
    &:nth-child(4) { animation-delay: 0.25s; }
    &:nth-child(5) { animation-delay: 0.3s; }
    &:nth-child(6) { animation-delay: 0.35s; }
  }
}

// 动画效果
@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 简洁的主题设置区域
.theme-section {
  .theme-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 6px;
    background: var(--el-fill-color-blank);
    border-radius: 6px;
    border: 1px solid var(--el-border-color-light);
    transition: all 0.2s ease;

    &:hover {
      background: var(--el-color-primary-light-9);
      border-color: var(--el-color-primary-light-7);
    }

    .theme-info {
      .theme-label {
        font-size: 12px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 1px;
        line-height: 1.2;
      }

      .theme-desc {
        font-size: 10px;
        color: var(--el-text-color-secondary);
        opacity: 0.8;
        line-height: 1;
      }
    }

    .theme-switch {
      transform: scale(0.8);
    }
  }
}

/* 响应式 */
@media (max-width: 768px) {
  .nav {
    display: none;
  }

  .btn-menu {
    display: flex;
  }
}

/* 暗色模式样式已统一在 App.vue 中管理 */
</style>