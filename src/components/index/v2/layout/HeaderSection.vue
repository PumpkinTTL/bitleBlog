<template>
  <header class="header-section" :class="headerClasses">
    <div class="header-container">
      <div class="header-wrapper">
        <!-- 左侧 Logo 和导航 -->
        <div class="header-left">
          <!-- Logo -->
          <div class="logo-section">
            <router-link to="/" class="logo-link">
              <div class="logo-icon">
                <i class="fas fa-layer-group"></i>
              </div>
              <div class="logo-text">
                <span class="logo-title">BitlEBlog</span>
                <span class="logo-subtitle">探索·学习·成长</span>
              </div>
            </router-link>
          </div>

          <!-- 桌面端导航 -->
          <nav v-if="showNavigation" class="desktop-navigation">
            <NavigationBar />
          </nav>
        </div>

        <!-- 右侧功能区 -->
        <div class="header-right">
          <!-- 搜索框 -->
          <div v-if="showSearch" class="search-section">
            <SearchBox 
              @search="handleSearch"
              :placeholder="'搜索文章、标签...'"
              :compact="true"
            />
          </div>

          <!-- 主题切换 -->
          <div class="theme-toggle">
            <ThemeToggle />
          </div>

          <!-- 移动端菜单按钮 -->
          <div class="mobile-menu-btn" @click="handleMenuToggle">
            <i class="fas fa-bars"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端导航抽屉 -->
    <div v-if="showNavigation" class="mobile-navigation">
      <NavigationBar :mobile="true" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import NavigationBar from './NavigationBar.vue'
import SearchBox from '../common/SearchBox.vue'
import ThemeToggle from '../interactive/ThemeToggle.vue'

interface HeaderProps {
  transparent?: boolean
  showSearch?: boolean
  showNavigation?: boolean
  fixed?: boolean
}

const props = withDefaults(defineProps<HeaderProps>(), {
  transparent: false,
  showSearch: true,
  showNavigation: true,
  fixed: true
})

const emit = defineEmits<{
  search: [query: string]
  menuToggle: []
}>()

const headerClasses = computed(() => ({
  'transparent': props.transparent,
  'fixed': props.fixed,
  'with-navigation': props.showNavigation
}))

const handleSearch = (query: string) => {
  emit('search', query)
}

const handleMenuToggle = () => {
  emit('menuToggle')
}
</script>

<style lang="less" scoped>
.header-section {
  width: 100%;
  z-index: 1001;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: linear-gradient(135deg, 
    rgba(255, 255, 255, 0.9) 0%,
    rgba(248, 250, 252, 0.95) 100%
  );
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.04),
    0 1px 0 rgba(255, 255, 255, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);

  &.fixed {
    position: fixed;
    top: 60px;
    left: 0;
    right: 0;
  }

  &.transparent {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.7) 0%,
      rgba(248, 250, 252, 0.8) 100%
    );
    box-shadow: 
      0 4px 16px rgba(0, 0, 0, 0.02),
      0 1px 0 rgba(255, 255, 255, 0.6),
      inset 0 1px 0 rgba(255, 255, 255, 0.7);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg,
      transparent 0%,
      rgba(22, 119, 255, 0.03) 50%,
      transparent 100%
    );
    pointer-events: none;
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::before {
    opacity: 1;
  }
}

.header-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 20px;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
}

.header-wrapper {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
  position: relative;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 40px;
  min-width: 0;
  flex: 1;

  @media (max-width: 1024px) {
    gap: 24px;
  }
}

.logo-section {
  flex-shrink: 0;

  .logo-link {
    display: flex;
    align-items: center;
    gap: 12px;
    text-decoration: none;
    color: inherit;
    transition: all 0.3s ease;
    padding: 8px;
    border-radius: 12px;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg,
        transparent,
        rgba(22, 119, 255, 0.1),
        transparent
      );
      transition: left 0.6s ease;
    }

    &:hover {
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 8px 24px rgba(22, 119, 255, 0.15);
      background: linear-gradient(135deg, 
        rgba(22, 119, 255, 0.08) 0%,
        rgba(105, 177, 255, 0.05) 100%
      );

      &::before {
        left: 100%;
      }

      .logo-icon {
        transform: rotate(5deg) scale(1.05);
        background: linear-gradient(135deg, #1677FF 0%, #69B1FF 100%);
      }
    }
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, 
      rgba(22, 119, 255, 0.1) 0%,
      rgba(105, 177, 255, 0.08) 100%
    );
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--el-color-primary);
    font-size: 18px;
    transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    box-shadow: 0 4px 12px rgba(22, 119, 255, 0.2);
    position: relative;

    &::after {
      content: '';
      position: absolute;
      inset: -1px;
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.8), 
        rgba(255, 255, 255, 0.2)
      );
      border-radius: 11px;
      z-index: -1;
      opacity: 0.6;
    }
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    gap: 2px;

    @media (max-width: 480px) {
      display: none;
    }

    .logo-title {
      font-size: 20px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      background: linear-gradient(135deg, 
        var(--el-text-color-primary) 0%,
        rgba(22, 119, 255, 0.8) 100%
      );
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
      filter: drop-shadow(0 1px 2px rgba(22, 119, 255, 0.1));
      line-height: 1;
    }

    .logo-subtitle {
      font-size: 11px;
      color: var(--el-text-color-placeholder);
      font-weight: 500;
      letter-spacing: 0.5px;
      line-height: 1;
    }
  }
}

.desktop-navigation {
  @media (max-width: 768px) {
    display: none;
  }
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
}

.search-section {
  @media (max-width: 640px) {
    display: none;
  }
}

.theme-toggle {
  flex-shrink: 0;
}

.mobile-menu-btn {
  display: none;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, 
    rgba(22, 119, 255, 0.08) 0%,
    rgba(105, 177, 255, 0.05) 100%
  );
  color: var(--el-color-primary);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  border: 0.5px solid rgba(22, 119, 255, 0.15);
  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.1);

  &:hover {
    background: linear-gradient(135deg, 
      rgba(22, 119, 255, 0.12) 0%,
      rgba(105, 177, 255, 0.08) 100%
    );
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(22, 119, 255, 0.2);
  }

  @media (max-width: 768px) {
    display: flex;
  }

  i {
    font-size: 16px;
  }
}

.mobile-navigation {
  display: none;
  
  @media (max-width: 768px) {
    display: block;
  }
}

// 暗色模式适配
html.dark & {
  .header-section {
    background: linear-gradient(135deg, 
      rgba(28, 28, 30, 0.95) 0%,
      rgba(44, 44, 46, 0.9) 100%
    );
    border-bottom-color: rgba(255, 255, 255, 0.08);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 1px 0 rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);

    &.transparent {
      background: linear-gradient(135deg, 
        rgba(28, 28, 30, 0.8) 0%,
        rgba(44, 44, 46, 0.7) 100%
      );
      box-shadow: 
        0 4px 16px rgba(0, 0, 0, 0.3),
        0 1px 0 rgba(255, 255, 255, 0.03),
        inset 0 1px 0 rgba(255, 255, 255, 0.05);
    }

    &::before {
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(100, 168, 255, 0.05) 50%,
        transparent 100%
      );
    }
  }

  .logo-link {
    &:hover {
      background: linear-gradient(135deg, 
        rgba(100, 168, 255, 0.1) 0%,
        rgba(64, 168, 255, 0.08) 100%
      );
      box-shadow: 0 8px 24px rgba(100, 168, 255, 0.2);
    }

    &::before {
      background: linear-gradient(90deg,
        transparent,
        rgba(255, 255, 255, 0.15),
        transparent
      );
    }
  }

  .logo-icon {
    background: linear-gradient(135deg, 
      rgba(100, 168, 255, 0.1) 0%,
      rgba(64, 168, 255, 0.08) 100%
    );
    color: #64A8FF;
    box-shadow: 0 4px 12px rgba(100, 168, 255, 0.2);

    &::after {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.1), 
        rgba(255, 255, 255, 0.05)
      );
      opacity: 0.8;
    }

    .logo-link:hover & {
      background: linear-gradient(135deg, #64A8FF 0%, #40A8FF 100%);
      color: white;
    }
  }

  .logo-title {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.95) 0%,
      rgba(100, 168, 255, 0.85) 100%
    );
    background-size: 200% 100%;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    filter: drop-shadow(0 1px 2px rgba(100, 168, 255, 0.2));
  }

  .mobile-menu-btn {
    background: linear-gradient(135deg, 
      rgba(100, 168, 255, 0.1) 0%,
      rgba(64, 168, 255, 0.08) 100%
    );
    border-color: rgba(100, 168, 255, 0.2);
    color: #64A8FF;

    &:hover {
      background: linear-gradient(135deg, 
        rgba(100, 168, 255, 0.15) 0%,
        rgba(64, 168, 255, 0.12) 100%
      );
      box-shadow: 0 6px 20px rgba(100, 168, 255, 0.3);
    }
  }
}
</style>
