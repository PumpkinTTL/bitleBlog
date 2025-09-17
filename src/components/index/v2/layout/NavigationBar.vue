<template>
  <nav class="navigation-bar" :class="{ 'mobile': mobile }">
    <div class="nav-container">
      <!-- 桌面端导航 -->
      <ul v-if="!mobile" class="nav-list desktop-nav">
        <li 
          v-for="item in navigationItems" 
          :key="item.path"
          class="nav-item"
          :class="{ 'active': isActiveRoute(item.path) }"
        >
          <router-link :to="item.path" class="nav-link" @click="handleNavClick(item)">
            <div class="nav-icon">
              <i :class="item.icon"></i>
            </div>
            <span class="nav-text">{{ item.name }}</span>
            <div v-if="item.badge" class="nav-badge">
              {{ item.badge }}
            </div>
          </router-link>
        </li>
      </ul>

      <!-- 移动端导航 -->
      <div v-else class="mobile-nav">
        <div class="mobile-nav-header">
          <h3>导航菜单</h3>
          <div class="close-btn" @click="handleClose">
            <i class="fas fa-times"></i>
          </div>
        </div>
        
        <ul class="nav-list mobile-nav-list">
          <li 
            v-for="item in navigationItems" 
            :key="item.path"
            class="nav-item"
            :class="{ 'active': isActiveRoute(item.path) }"
          >
            <router-link :to="item.path" class="nav-link" @click="handleNavClick(item)">
              <div class="nav-icon">
                <i :class="item.icon"></i>
              </div>
              <div class="nav-content">
                <span class="nav-text">{{ item.name }}</span>
                <span v-if="item.description" class="nav-desc">{{ item.description }}</span>
              </div>
              <div v-if="item.badge" class="nav-badge">
                {{ item.badge }}
              </div>
            </router-link>
          </li>
        </ul>

        <!-- 移动端底部信息 -->
        <div class="mobile-nav-footer">
          <div class="footer-info">
            <p>© 2024 BitlEBlog</p>
            <p>探索·学习·成长</p>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

interface NavigationItem {
  name: string
  path: string
  icon: string
  badge?: string | number
  description?: string
}

interface NavigationProps {
  mobile?: boolean
}

const props = withDefaults(defineProps<NavigationProps>(), {
  mobile: false
})

const emit = defineEmits<{
  navClick: [item: NavigationItem]
  close: []
}>()

const route = useRoute()

// 导航项配置
const navigationItems: NavigationItem[] = [
  {
    name: '首页',
    path: '/',
    icon: 'fas fa-home',
    description: '最新文章和推荐内容'
  },
  {
    name: '文章',
    path: '/articles',
    icon: 'fas fa-newspaper',
    description: '所有技术文章'
  },
  {
    name: '分类',
    path: '/categories', 
    icon: 'fas fa-folder-open',
    description: '按分类浏览'
  },
  {
    name: '标签',
    path: '/tags',
    icon: 'fas fa-tags',
    description: '标签索引'
  },
  {
    name: '归档',
    path: '/archives',
    icon: 'fas fa-archive',
    description: '时间线归档'
  },
  {
    name: '工具',
    path: '/tools',
    icon: 'fas fa-tools',
    badge: 'New',
    description: '开发工具推荐'
  },
  {
    name: '商城',
    path: '/shop',
    icon: 'fas fa-shopping-cart',
    badge: 'Hot',
    description: '精选商品'
  },
  {
    name: '关于',
    path: '/about',
    icon: 'fas fa-user-circle',
    description: '关于作者'
  }
]

// 判断当前激活路由
const isActiveRoute = (path: string): boolean => {
  if (path === '/') {
    return route.path === path
  }
  return route.path.startsWith(path)
}

// 事件处理
const handleNavClick = (item: NavigationItem) => {
  emit('navClick', item)
}

const handleClose = () => {
  emit('close')
}
</script>

<style lang="less" scoped>
.navigation-bar {
  &:not(.mobile) {
    height: 100%;
  }
}

.nav-container {
  width: 100%;
  height: 100%;
}

// 桌面端导航样式
.desktop-nav {
  display: flex;
  align-items: center;
  gap: 8px;
  list-style: none;
  margin: 0;
  padding: 0;

  .nav-item {
    position: relative;

    .nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      border-radius: 10px;
      text-decoration: none;
      color: var(--el-text-color-regular);
      font-size: 14px;
      font-weight: 500;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      background: transparent;

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
        color: var(--el-color-primary);
        background: linear-gradient(135deg, 
          rgba(22, 119, 255, 0.08) 0%,
          rgba(105, 177, 255, 0.05) 100%
        );
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(22, 119, 255, 0.15);

        &::before {
          left: 100%;
        }
      }

      .nav-icon {
        font-size: 16px;
        width: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
      }

      .nav-text {
        white-space: nowrap;
        position: relative;
        z-index: 2;
      }

      .nav-badge {
        background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
        color: white;
        font-size: 10px;
        font-weight: 600;
        padding: 2px 6px;
        border-radius: 8px;
        line-height: 1;
        box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
        position: relative;
        z-index: 2;

        &::after {
          content: '';
          position: absolute;
          inset: -1px;
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.3), 
            rgba(255, 255, 255, 0.1)
          );
          border-radius: 9px;
          z-index: -1;
        }
      }
    }

    &.active .nav-link {
      color: var(--el-color-primary);
      background: linear-gradient(135deg, 
        rgba(22, 119, 255, 0.12) 0%,
        rgba(105, 177, 255, 0.08) 100%
      );
      box-shadow: 
        0 4px 16px rgba(22, 119, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
      font-weight: 600;

      .nav-icon {
        transform: scale(1.1);
      }
    }
  }
}

// 移动端导航样式
.mobile-nav {
  height: 100%;
  display: flex;
  flex-direction: column;

  .mobile-nav-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color-overlay);

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      background: linear-gradient(135deg, 
        var(--el-text-color-primary) 0%,
        var(--el-color-primary) 100%
      );
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
    }

    .close-btn {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-regular);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: var(--el-color-danger-light-9);
        color: var(--el-color-danger);
        transform: rotate(90deg);
      }
    }
  }

  .mobile-nav-list {
    flex: 1;
    list-style: none;
    margin: 0;
    padding: 16px;
    overflow-y: auto;

    .nav-item {
      margin-bottom: 4px;

      .nav-link {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        border-radius: 10px;
        text-decoration: none;
        color: var(--el-text-color-regular);
        transition: all 0.3s ease;
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
          background: linear-gradient(135deg, 
            rgba(22, 119, 255, 0.05) 0%,
            rgba(105, 177, 255, 0.03) 100%
          );
          transform: translateX(4px);

          &::before {
            left: 100%;
          }
        }

        .nav-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, 
            rgba(22, 119, 255, 0.08) 0%,
            rgba(105, 177, 255, 0.05) 100%
          );
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--el-color-primary);
          font-size: 16px;
          flex-shrink: 0;
          transition: all 0.3s ease;
          box-shadow: 0 2px 8px rgba(22, 119, 255, 0.1);

          &::after {
            content: '';
            position: absolute;
            inset: -1px;
            background: linear-gradient(135deg, 
              rgba(255, 255, 255, 0.4), 
              rgba(255, 255, 255, 0.1)
            );
            border-radius: 11px;
            z-index: -1;
            opacity: 0.6;
          }
        }

        .nav-content {
          flex: 1;
          min-width: 0;

          .nav-text {
            display: block;
            font-size: 15px;
            font-weight: 500;
            color: var(--el-text-color-primary);
            margin-bottom: 2px;
          }

          .nav-desc {
            display: block;
            font-size: 12px;
            color: var(--el-text-color-placeholder);
            line-height: 1.4;
          }
        }

        .nav-badge {
          background: linear-gradient(135deg, #FF6B6B 0%, #FF8E8E 100%);
          color: white;
          font-size: 10px;
          font-weight: 600;
          padding: 4px 8px;
          border-radius: 8px;
          line-height: 1;
          box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
          flex-shrink: 0;
        }
      }

      &.active .nav-link {
        background: linear-gradient(135deg, 
          rgba(22, 119, 255, 0.1) 0%,
          rgba(105, 177, 255, 0.06) 100%
        );
        border-left: 4px solid var(--el-color-primary);

        .nav-icon {
          background: linear-gradient(135deg, 
            var(--el-color-primary) 0%,
            rgba(105, 177, 255, 0.8) 100%
          );
          color: white;
          transform: scale(1.05);
          box-shadow: 0 4px 16px rgba(22, 119, 255, 0.3);
        }

        .nav-content .nav-text {
          color: var(--el-color-primary);
          font-weight: 600;
        }
      }
    }
  }

  .mobile-nav-footer {
    padding: 16px 24px;
    border-top: 1px solid var(--el-border-color-lighter);
    background: var(--el-bg-color-overlay);

    .footer-info {
      text-align: center;

      p {
        margin: 0;
        font-size: 12px;
        color: var(--el-text-color-placeholder);
        line-height: 1.5;

        &:first-child {
          font-weight: 500;
          color: var(--el-text-color-regular);
        }
      }
    }
  }
}

// 暗色模式适配
html.dark & {
  .desktop-nav {
    .nav-item .nav-link {
      &:hover {
        background: linear-gradient(135deg, 
          rgba(100, 168, 255, 0.1) 0%,
          rgba(64, 168, 255, 0.08) 100%
        );
        color: #64A8FF;
        box-shadow: 0 4px 12px rgba(100, 168, 255, 0.2);

        &::before {
          background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
        }
      }

      &.active {
        background: linear-gradient(135deg, 
          rgba(100, 168, 255, 0.15) 0%,
          rgba(64, 168, 255, 0.1) 100%
        );
        color: #64A8FF;
        box-shadow: 
          0 4px 16px rgba(100, 168, 255, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
      }
    }
  }

  .mobile-nav {
    .mobile-nav-list .nav-item .nav-link {
      &:hover {
        background: linear-gradient(135deg, 
          rgba(100, 168, 255, 0.08) 0%,
          rgba(64, 168, 255, 0.05) 100%
        );

        &::before {
          background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.1),
            transparent
          );
        }
      }

      .nav-icon {
        background: linear-gradient(135deg, 
          rgba(100, 168, 255, 0.1) 0%,
          rgba(64, 168, 255, 0.08) 100%
        );
        color: #64A8FF;
        box-shadow: 0 2px 8px rgba(100, 168, 255, 0.15);
      }

      &.active {
        background: linear-gradient(135deg, 
          rgba(100, 168, 255, 0.12) 0%,
          rgba(64, 168, 255, 0.08) 100%
        );
        border-left-color: #64A8FF;

        .nav-icon {
          background: linear-gradient(135deg, #64A8FF 0%, #40A8FF 100%);
          box-shadow: 0 4px 16px rgba(100, 168, 255, 0.4);
        }

        .nav-content .nav-text {
          color: #64A8FF;
        }
      }
    }
  }
}
</style>
