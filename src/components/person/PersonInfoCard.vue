<template>
  <div class="person-info-card">
    <!-- 卡片头部 -->
    <div class="card-header">
      <span class="uid-label">UID: <span class="uid-number">1008611</span></span>
    </div>

    <!-- 卡片内容 -->
    <div class="card-body">
      <!-- 头像区域 -->
      <div class="avatar-section">
        <div class="avatar-container">
          <div class="avatar-ring"></div>
          <img :src="userInfo.avatar" :alt="userInfo.username" class="avatar" />
          <div class="avatar-status" :class="{ online: userInfo.isOnline }"></div>
          <div v-if="userInfo.isVip" class="vip-badge">
            <i class="fas fa-crown"></i>
          </div>
        </div>
      </div>

      <!-- 用户信息 -->
      <div class="user-info">
        <div class="username-row">
          <h3 class="username">{{ userInfo.username }}</h3>
          <span class="level-badge">Lv.{{ userInfo.level }}</span>
        </div>
        <p class="bio">{{ userInfo.bio }}</p>
      </div>

      <!-- 信息栏 -->
      <div class="info-bar">
        <div class="info-item">
          <i class="fas fa-calendar-check"></i>
          <span>加入 365 天</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <i class="fas fa-feather-alt"></i>
          <span>128 篇文章</span>
        </div>
      </div>

      <!-- 荣誉徽章 -->
      <div class="badges-section">
        <div class="badge-item">
          <div class="badge-icon trophy">
            <i class="fas fa-trophy"></i>
          </div>
          <span>原创作者</span>
        </div>
        <div class="badge-item">
          <div class="badge-icon star">
            <i class="fas fa-star"></i>
          </div>
          <span>优秀博主</span>
        </div>
        <div class="badge-item">
          <div class="badge-icon fire">
            <i class="fas fa-fire"></i>
          </div>
          <span>活跃用户</span>
        </div>
      </div>

      <!-- 社交媒体 -->
      <div class="social-links">
        <a href="#" class="social-icon github" title="GitHub">
          <i class="fab fa-github"></i>
        </a>
        <a href="#" class="social-icon twitter" title="Twitter">
          <i class="fab fa-twitter"></i>
        </a>
        <a href="#" class="social-icon weixin" title="微信">
          <i class="fab fa-weixin"></i>
        </a>
        <a href="#" class="social-icon weibo" title="微博">
          <i class="fab fa-weibo"></i>
        </a>
        <a href="#" class="social-icon email" title="邮箱">
          <i class="fas fa-envelope"></i>
        </a>
      </div>

      <!-- 按钮组 -->
      <div class="actions">
        <button class="btn-primary" @click="$emit('edit')">
          <i class="fas fa-edit"></i>
          编辑资料
        </button>
        <button class="btn-secondary" @click="$emit('share')">
          <i class="fas fa-share-alt"></i>
          分享
        </button>
      </div>

      <!-- 快捷操作 -->
      <div class="quick-actions">
        <div class="action-item" @click="$emit('action', 'write')">
          <i class="fas fa-pen-nib"></i>
          <span>写文章</span>
        </div>
        <div class="action-item" @click="$emit('action', 'upload')">
          <i class="fas fa-cloud-upload-alt"></i>
          <span>上传</span>
        </div>
        <div class="action-item" @click="$emit('action', 'message')">
          <i class="fas fa-bell"></i>
          <span>消息</span>
        </div>
        <div class="action-item" @click="$emit('action', 'analytics')">
          <i class="fas fa-chart-bar"></i>
          <span>数据</span>
        </div>
        <div class="action-item" @click="$emit('action', 'favorites')">
          <i class="fas fa-bookmark"></i>
          <span>收藏</span>
        </div>
        <div class="action-item" @click="$emit('action', 'settings')">
          <i class="fas fa-cog"></i>
          <span>设置</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface UserInfo {
  avatar: string
  username: string
  bio: string
  level: number
  isVip: boolean
  isOnline: boolean
  tags: string[]
}

interface Props {
  userInfo?: UserInfo
}

const props = withDefaults(defineProps<Props>(), {
  userInfo: () => ({
    avatar: 'https://picsum.photos/200/200?random=1',
    username: 'BitlE开发者',
    bio: '热爱技术，专注前端开发',
    level: 5,
    isVip: true,
    isOnline: true,
    tags: ['前端开发', 'Vue.js', 'TypeScript']
  })
})
</script>

<style lang="less" scoped>
.person-info-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: var(--el-fill-color-extra-light);
  border-bottom: 1px solid var(--el-border-color-extra-light);

  .uid-label {
    font-size: 11px;
    font-weight: 600;
    color: var(--el-text-color-secondary);
    letter-spacing: 0.5px;

    .uid-number {
      font-family: 'Courier New', monospace;
      font-size: 12px;
      font-weight: 700;
      color: #64748b;
      letter-spacing: 1px;
    }
  }
}

.card-body {
  padding: 14px;
}

// 头像区域
.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 12px;

  .avatar-container {
    position: relative;
    width: 60px;
    height: 60px;

    .avatar-ring {
      position: absolute;
      inset: -4px;
      border-radius: 50%;
      border: 2px solid transparent;
      border-top-color: var(--theme-purple-primary);
      border-right-color: var(--theme-purple-light-3);
      animation: rotate 3s linear infinite;
    }

    .avatar {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      object-fit: cover;
      border: 2px solid var(--el-bg-color);
      position: relative;
      z-index: 1;
    }

    .avatar-status {
      position: absolute;
      bottom: 2px;
      right: 2px;
      width: 12px;
      height: 12px;
      background: #d1d5db;
      border: 2px solid var(--el-bg-color);
      border-radius: 50%;
      z-index: 2;

      &.online {
        background: #10b981;
        box-shadow: 0 0 6px rgba(16, 185, 129, 0.4);
      }
    }

    .vip-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 18px;
      height: 18px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(251, 191, 36, 0.4);
      z-index: 2;

      i {
        font-size: 9px;
        color: white;
      }
    }
  }
}

// 用户信息
.user-info {
  text-align: center;
  margin-bottom: 14px;

  .username-row {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    margin-bottom: 6px;

    .username {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin: 0;
      font-family: 'OPPO Sans', sans-serif;
    }

    .level-badge {
      padding: 2px 8px;
      background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
      color: white;
      font-size: 10px;
      font-weight: 600;
      border-radius: 10px;
      box-shadow: 0 2px 4px var(--theme-orange-shadow);
    }
  }

  .bio {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    margin: 0;
    line-height: 1.6;
    padding: 0 8px;
  }
}

// 荣誉徽章
.badges-section {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 14px;

  .badge-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 10px;
    background: var(--el-fill-color-extra-light);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid var(--el-border-color-extra-light);

    .badge-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      transition: all 0.3s ease;

      &.trophy {
        background: linear-gradient(135deg, #fef3c7, #fde68a);
        color: #d97706;
      }

      &.star {
        background: linear-gradient(135deg, #dbeafe, #bfdbfe);
        color: #2563eb;
      }

      &.fire {
        background: linear-gradient(135deg, #fed7d7, #fbb6b6);
        color: #dc2626;
      }
    }

    span {
      font-size: 10px;
      color: var(--el-text-color-regular);
      font-weight: 500;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

      .badge-icon {
        transform: scale(1.1);
      }
    }
  }
}

// 信息栏
.info-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 11px;

  .info-item {
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease;

    i {
      font-size: 12px;
    }

    span {
      color: var(--el-text-color-regular);
      font-weight: 500;
    }

    &:first-child i {
      color: #10b981;
    }

    &:last-child i {
      color: #8b5cf6;
    }

    &:hover {
      transform: translateY(-1px);
    }
  }

  .info-divider {
    width: 1px;
    height: 12px;
    background: var(--el-border-color);
  }
}

// 社交媒体
.social-links {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 14px;

  .social-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 14px;
    transition: all 0.3s ease;
    text-decoration: none;
    cursor: pointer;

    &.github {
      background: #f6f8fa;
      color: #24292f;
      border: 1px solid #d0d7de;

      &:hover {
        background: #24292f;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(36, 41, 47, 0.3);
      }
    }

    &.twitter {
      background: #e8f5fd;
      color: #1d9bf0;
      border: 1px solid #a8dcf0;

      &:hover {
        background: #1d9bf0;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(29, 155, 240, 0.3);
      }
    }

    &.weixin {
      background: #e7f7e7;
      color: #07c160;
      border: 1px solid #95d9a5;

      &:hover {
        background: #07c160;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
      }
    }

    &.weibo {
      background: #fff3f3;
      color: #e6162d;
      border: 1px solid #f5a5ad;

      &:hover {
        background: #e6162d;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(230, 22, 45, 0.3);
      }
    }

    &.email {
      background: #fef9e7;
      color: #f59e0b;
      border: 1px solid #fcd34d;

      &:hover {
        background: #f59e0b;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
      }
    }
  }
}


// 按钮组
.actions {
  display: flex;
  gap: 8px;

  button {
    flex: 1;
    height: 34px;
    border: none;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-family: 'OPPO Sans', sans-serif;

    i {
      font-size: 12px;
    }
  }

  .btn-primary {
    background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
    color: white;
    box-shadow: 0 2px 8px var(--theme-orange-shadow);

    &:hover {
      box-shadow: 0 4px 16px var(--theme-orange-glow);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }

  .btn-secondary {
    background: var(--el-fill-color-light);
    color: var(--el-text-color-regular);
    border: 1px solid var(--el-border-color-light);

    &:hover {
      background: var(--theme-orange-bg-1);
      border-color: var(--theme-orange-border-2);
      color: var(--theme-purple-primary);
      transform: translateY(-2px);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

// 快捷操作
.quick-actions {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
  margin-top: 14px;

  .action-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 10px 6px;
    background: var(--el-fill-color-extra-light);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid var(--el-border-color-extra-light);

    i {
      font-size: 14px;
    }

    span {
      font-size: 10px;
      color: var(--el-text-color-regular);
      font-weight: 500;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

      i {
        transform: scale(1.1);
      }
    }

    &:active {
      transform: translateY(0);
    }

    // 各个按钮的颜色
    &:nth-child(1) i { color: #d97706; }
    &:nth-child(2) i { color: #2563eb; }
    &:nth-child(3) i { color: #dc2626; }
    &:nth-child(4) i { color: #10b981; }
    &:nth-child(5) i { color: #ec4899; }
    &:nth-child(6) i { color: #6366f1; }
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
