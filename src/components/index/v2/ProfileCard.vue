<template>
  <div class="profile-card">
    <!-- 卡片头部 -->
    <div class="card-header">
      <span>个人档案</span>
    </div>
    
    <!-- 卡片内容 -->
    <div class="card-body">
      <!-- 头像区域 -->
      <div class="avatar-section">
        <div class="avatar-wrapper">
          <img :src="profile.avatar" :alt="profile.name" class="avatar-image" />
          <div class="avatar-status" :class="{ 'online': profile.isOnline }"></div>
        </div>
        <div class="profile-info">
          <h3 class="profile-name">{{ profile.name }}</h3>
          <p class="profile-title">{{ profile.title }}</p>
        </div>
      </div>
      
      <!-- 个人简介 -->
      <div class="bio-section">
        <p class="bio-text">{{ profile.bio }}</p>
      </div>
      
      <!-- 统计数据 -->
      <div class="stats-section">
        <div class="stat-item">
          <div class="stat-number">{{ formatNumber(profile.stats.articles) }}</div>
          <div class="stat-label">文章</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ formatNumber(profile.stats.views) }}</div>
          <div class="stat-label">阅读</div>
        </div>
        <div class="stat-item">
          <div class="stat-number">{{ formatNumber(profile.stats.likes) }}</div>
          <div class="stat-label">点赞</div>
        </div>
      </div>
      
      <!-- 社交媒体链接 -->
      <div class="social-section">
        <div class="social-title">关注我</div>
        <div class="social-links">
          <a 
            v-for="social in profile.socialLinks" 
            :key="social.name"
            :href="social.url" 
            :title="social.name"
            class="social-link"
            :class="social.name.toLowerCase()"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i :class="social.icon"></i>
          </a>
        </div>
      </div>
      
      <!-- 联系按钮 -->
      <div class="contact-section">
        <button class="contact-btn primary" @click="handleContact('email')">
          <i class="fas fa-envelope"></i>
          联系我
        </button>
        <button class="contact-btn secondary" @click="handleContact('follow')">
          <i class="fas fa-heart"></i>
          关注
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 社交媒体链接类型
interface SocialLink {
  name: string
  icon: string
  url: string
  color?: string
}

// 个人档案数据类型
interface ProfileData {
  name: string
  title: string
  avatar: string
  bio: string
  isOnline: boolean
  stats: {
    articles: number
    views: number
    likes: number
  }
  socialLinks: SocialLink[]
}

// 组件Props
interface Props {
  profile?: ProfileData
}

const props = withDefaults(defineProps<Props>(), {
  profile: () => ({
    name: 'BitlE',
    title: '全栈开发者 / 技术博主',
    avatar: 'https://picsum.photos/120/120?random=avatar',
    bio: '专注于前端开发和全栈技术，热爱分享技术心得和开发经验。持续学习，持续成长。',
    isOnline: true,
    stats: {
      articles: 128,
      views: 156000,
      likes: 8900
    },
    socialLinks: [
      {
        name: 'GitHub',
        icon: 'fab fa-github',
        url: 'https://github.com/yourusername'
      },
      {
        name: 'Twitter',
        icon: 'fab fa-twitter', 
        url: 'https://twitter.com/yourusername'
      },
      {
        name: 'LinkedIn',
        icon: 'fab fa-linkedin',
        url: 'https://linkedin.com/in/yourusername'
      },
      {
        name: 'WeChat',
        icon: 'fab fa-weixin',
        url: '#'
      },
      {
        name: 'Email',
        icon: 'fas fa-envelope',
        url: 'mailto:your.email@example.com'
      }
    ]
  })
})

// 事件定义
const emit = defineEmits<{
  contact: [type: string]
}>()

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 100000) {
    return (num / 10000).toFixed(1) + 'w'
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 处理联系事件
const handleContact = (type: string) => {
  emit('contact', type)
  
  if (type === 'email') {
    // 可以打开邮件客户端或显示邮箱地址
    console.log('打开邮件联系')
  } else if (type === 'follow') {
    // 处理关注逻辑
    console.log('关注博主')
  }
}
</script>

<style lang="less" scoped>
// 个人档案卡片 - 与其他v2组件保持一致的风格
.profile-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  animation: fadeIn 0.6s ease-out;
  overflow: hidden;
}

// 卡片头部样式 - 与其他组件统一
.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 14px 16px;
  background: var(--el-fill-color-extra-light);
  border-bottom: 1px solid var(--el-border-color-extra-light);
  border-radius: 8px 8px 0 0;
  
  span {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
}

.card-body {
  padding: 20px 16px 16px;
}

// 头像区域
.avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 16px;
  
  .avatar-wrapper {
    position: relative;
    margin-bottom: 12px;
    
    .avatar-image {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      object-fit: cover;
      border: 3px solid var(--el-border-color-extra-light);
      transition: all 0.3s ease;
      
      &:hover {
        transform: scale(1.05);
        border-color: var(--el-color-primary-light-5);
      }
    }
    
    .avatar-status {
      position: absolute;
      bottom: 4px;
      right: 4px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid var(--el-bg-color);
      background: #e5e7eb;
      transition: all 0.3s ease;
      
      &.online {
        background: #10b981;
        box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.3);
      }
    }
  }
  
  .profile-info {
    text-align: center;
    
    .profile-name {
      font-size: 18px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      margin: 0 0 4px 0;
      font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    
    .profile-title {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      margin: 0;
      font-weight: 500;
    }
  }
}

// 个人简介
.bio-section {
  margin-bottom: 20px;
  
  .bio-text {
    font-size: 13px;
    color: var(--el-text-color-regular);
    line-height: 1.5;
    text-align: center;
    margin: 0;
    padding: 0 4px;
  }
}

// 统计数据
.stats-section {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
  padding: 16px 8px;
  background: var(--el-fill-color-extra-light);
  border-radius: 8px;
  
  .stat-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    
    .stat-number {
      font-size: 18px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      margin-bottom: 2px;
    }
    
    .stat-label {
      font-size: 11px;
      color: var(--el-text-color-secondary);
      font-weight: 500;
    }
  }
}

// 社交媒体
.social-section {
  margin-bottom: 20px;
  
  .social-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-secondary);
    text-align: center;
    margin-bottom: 12px;
  }
  
  .social-links {
    display: flex;
    justify-content: center;
    gap: 12px;
    flex-wrap: wrap;
    
    .social-link {
      width: 36px;
      height: 36px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      text-decoration: none;
      transition: all 0.3s ease;
      font-size: 16px;
      
      &:hover {
        transform: translateY(-2px) scale(1.1);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
      }
      
      // 不同社交媒体的颜色
      &.github {
        background: #24292e;
      }
      
      &.twitter {
        background: #1da1f2;
      }
      
      &.linkedin {
        background: #0077b5;
      }
      
      &.wechat {
        background: #07c160;
      }
      
      &.email {
        background: #ea4335;
      }
    }
  }
}

// 联系按钮
.contact-section {
  display: flex;
  gap: 8px;
  
  .contact-btn {
    flex: 1;
    height: 40px;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    
    i {
      font-size: 12px;
    }
    
    &.primary {
      background: var(--el-color-primary);
      color: white;
      
      &:hover {
        background: var(--el-color-primary-dark-2);
        transform: translateY(-1px);
      }
    }
    
    &.secondary {
      background: var(--el-fill-color-light);
      color: var(--el-text-color-regular);
      border: 1px solid var(--el-border-color-light);
      
      &:hover {
        background: var(--el-fill-color);
        color: var(--el-color-primary);
        border-color: var(--el-color-primary-light-7);
        transform: translateY(-1px);
      }
    }
  }
}

// 动画定义
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 暗色模式适配
html.dark .profile-card {
  border-color: var(--el-border-color-dark);
  
  .card-header {
    background: var(--el-fill-color-dark);
    border-bottom-color: var(--el-border-color-darker);
  }
  
  .avatar-image {
    border-color: var(--el-border-color-dark);
    
    &:hover {
      border-color: var(--el-color-primary-light-3);
    }
  }
  
  .stats-section {
    background: var(--el-fill-color-dark);
  }
  
  .social-links .social-link:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  }
  
  .contact-btn.secondary {
    background: var(--el-fill-color-dark);
    border-color: var(--el-border-color-dark);
    
    &:hover {
      background: var(--el-fill-color-darker);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .card-body {
    padding: 16px 14px 14px;
  }
  
  .avatar-section .avatar-wrapper .avatar-image {
    width: 70px;
    height: 70px;
  }
  
  .profile-info .profile-name {
    font-size: 16px;
  }
  
  .stats-section {
    padding: 12px 6px;
  }
  
  .social-links .social-link {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
  
  .contact-btn {
    height: 36px;
    font-size: 12px;
  }
}
</style>
