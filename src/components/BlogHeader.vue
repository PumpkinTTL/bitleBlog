<template>
  <div class="header-wrapper">
    <!-- 头部占位符，避免内容被固定头部遮挡 -->
    <div class="header-spacer"></div>
    <el-header class="main-header">
      <el-container class="header-container">
        <!-- Logo -->
        <router-link to="/" class="logo">
          <img src="@/assets/logo.png" alt="Bitle Blog" />
        </router-link>

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
          <button class="btn-icon" @click="toggleTheme">
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
        <!-- 简洁的头部区域 -->
        <div class="menu-header">
          <div class="header-content">
            <div class="brand-section">
              <div class="brand-icon">
                <i class="fas fa-blog"></i>
              </div>
              <span class="brand-name">BitlE Blog</span>
            </div>
            <button class="close-btn" @click="mobileMenuOpen = false">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>

        <!-- 统一的菜单内容容器 -->
        <div class="menu-content">
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
  { title: '订单', path: '/order', icon: 'fas fa-list' },
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
  localStorage.removeItem('token')
  localStorage.removeItem('userInfo')
  ElMessage.success('已退出登录')
  router.push('/')
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
}

.main-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--el-bg-color);
  border-bottom: 1px solid var(--el-border-color-extra-light);
  z-index: 1000;
  backdrop-filter: blur(8px); // 减少模糊效果
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06); // 简化阴影
  padding: 0;
  transition: all 0.3s ease;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 20px;
}

.logo {
  display: flex;
  align-items: center;
  text-decoration: none;

  img {
    height: 32px;
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
  border-radius: var(--el-border-radius-base);
  transition: all var(--el-transition-duration);

  &:hover, &.active {
    color: var(--el-color-primary);
    background: var(--el-color-primary-light-9);
  }
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn-icon {
  width: 36px;
  height: 36px;
  border: 1px solid var(--el-border-color-light);
  background: var(--el-fill-color-light);
  border-radius: 6px; // 减小圆角
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-regular);
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    border-color: var(--el-color-primary-light-7);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px; // 减小圆角
  transition: all 0.2s ease;
  color: var(--el-text-color-primary);
  border: 1px solid var(--el-border-color-light);
  background: var(--el-fill-color-light);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    border-color: var(--el-color-primary-light-7);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  span {
    font-weight: 500;
    font-size: 14px;
    color: inherit;
  }
}

/* 登录按钮现在使用 Element Plus 按钮组件 */

.btn-menu {
  display: none;
  width: 36px;
  height: 36px;
  border: 1px solid var(--el-border-color-light);
  background: var(--el-fill-color-light);
  border-radius: 6px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-regular);
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover {
    background: var(--el-color-primary-light-9);
    color: var(--el-color-primary);
    border-color: var(--el-color-primary-light-7);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
}



/* 简洁的移动端菜单 */
.mobile-menu {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background: var(--el-bg-color);
  overflow-y: auto;
  overflow-x: hidden;
}

// 简洁的菜单头部
.menu-header {
  padding: 16px 0;
  border-bottom: 1px solid var(--el-border-color-extra-light);

  .header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .brand-section {
    display: flex;
    align-items: center;
    gap: 8px;

    .brand-icon {
      width: 28px;
      height: 28px;
      background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-dark-2));
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 14px;
      box-shadow: 0 2px 4px rgba(22, 119, 255, 0.3);
    }

    .brand-name {
      font-size: 15px;
      font-weight: 700;
      background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-dark-2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: 0.5px;
    }
  }

  .close-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: var(--el-fill-color-light);
    border-radius: 6px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-text-color-secondary);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    font-size: 12px;
    border: 1px solid var(--el-border-color-light);

    &:hover {
      background: linear-gradient(135deg, var(--el-color-danger), var(--el-color-danger-dark-2));
      color: white;
      transform: rotate(90deg) scale(1.05);
      border-color: var(--el-color-danger);
      box-shadow: 0 2px 6px rgba(245, 108, 108, 0.4);
    }
  }
}

// 统一的菜单内容容器
.menu-content {
  flex: 1;
  background: var(--el-bg-color);
}

// 用户信息区域
.user-section {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 0;

  .user-avatar-section {
    position: relative;

    .user-avatar {
      border: 2px solid var(--el-color-primary-light-7);
      box-shadow: 0 2px 6px rgba(22, 119, 255, 0.2);
    }

    .online-indicator {
      position: absolute;
      bottom: 0;
      right: 0;
      width: 8px;
      height: 8px;
      background: var(--el-color-success);
      border-radius: 50%;
      border: 2px solid white;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
  }

  .user-info {
    flex: 1;

    .user-name {
      font-size: 14px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      margin: 0 0 2px;
    }

    .user-status {
      font-size: 11px;
      color: var(--el-color-success);
      margin: 0;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
  }

  .logout-btn {
    width: 28px;
    height: 28px;
    border: none;
    background: linear-gradient(135deg, var(--el-color-danger-light-8), var(--el-color-danger-light-9));
    color: var(--el-color-danger);
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    font-size: 12px;
    border: 1px solid var(--el-color-danger-light-7);

    &:hover {
      background: linear-gradient(135deg, var(--el-color-danger), var(--el-color-danger-dark-2));
      color: white;
      transform: scale(1.05) rotate(5deg);
      box-shadow: 0 2px 6px rgba(245, 108, 108, 0.4);
    }
  }
}

// 登录区域
.login-section {
  padding: 16px 0;

  .login-content {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;

    .login-icon {
      width: 36px;
      height: 36px;
      background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-dark-2));
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 18px;
      box-shadow: 0 2px 6px rgba(22, 119, 255, 0.3);
    }

    .login-text {
      h4 {
        font-size: 14px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        margin: 0 0 2px;
      }

      p {
        font-size: 11px;
        color: var(--el-text-color-secondary);
        margin: 0;
        opacity: 0.8;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 36px;
    border-radius: 8px;
    font-weight: 700;
    font-size: 14px;
    background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-dark-2));
    border: none;
    box-shadow: 0 2px 6px rgba(22, 119, 255, 0.3);
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(22, 119, 255, 0.4);
    }
  }
}

// 分割线
.divider {
  height: 1px;
  background: linear-gradient(90deg,
    transparent 0%,
    var(--el-border-color-light) 20%,
    var(--el-border-color-light) 80%,
    transparent 100%);
  margin: 8px 0;
}

// 统一的区域标题样式
.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 0 4px;

  i {
    color: var(--el-color-primary);
    font-size: 14px;
  }

  span {
    font-size: 12px;
    font-weight: 700;
    color: var(--el-text-color-primary);
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
}

// 导航区域
.nav-section {
  padding: 16px 0;

  .nav-list {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    text-decoration: none;
    color: var(--el-text-color-primary);
    border-radius: 8px;
    transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
    position: relative;
    animation: slideInLeft 0.5s ease forwards;
    opacity: 0;

    &:hover {
      background: var(--el-color-primary-light-9);
      color: var(--el-color-primary);
      transform: translateX(4px);

      .nav-icon {
        background: var(--el-color-primary);
        color: white;
        transform: scale(1.05);
      }

      .nav-arrow {
        opacity: 1;
        transform: translateX(2px);
      }
    }

    .nav-icon {
      width: 32px;
      height: 32px;
      background: var(--el-fill-color-light);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-color-primary);
      font-size: 14px;
      transition: all 0.3s ease;
      flex-shrink: 0;
    }

    .nav-text {
      flex: 1;
      font-size: 14px;
      font-weight: 500;
    }

    .nav-arrow {
      color: var(--el-text-color-placeholder);
      font-size: 10px;
      transition: all 0.3s ease;
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

// 主题设置区域
.theme-section {
  padding: 16px 0;

  .theme-control {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    background: var(--el-fill-color-light);
    border-radius: 8px;
    transition: all 0.3s ease;

    &:hover {
      background: var(--el-color-primary-light-9);
      transform: translateY(-1px);
    }

    .theme-info {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .theme-label {
        font-size: 13px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .theme-desc {
        font-size: 11px;
        color: var(--el-text-color-secondary);
      }
    }

    .theme-switch {
      flex-shrink: 0;
      transform: scale(0.9);
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