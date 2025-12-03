<template>
  <div class="person-info-card animate__animated animate__fadeIn">
    <!-- 卡片头部 -->
    <div class="card-header animate__animated animate__fadeInDown" style="animation-delay: 0.05s">
      <span class="uid-label">UID: <span class="uid-number">{{ userInfo.id || '1008611' }}</span></span>
    </div>

    <!-- 卡片内容 -->
    <div class="card-body">
      <!-- 头像区域 -->
      <div class="avatar-section animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
        <div class="avatar-container">
          <div class="avatar-ring" :class="{ 'vip-ring': userInfo.isVip, 'normal-ring': !userInfo.isVip }"></div>
          <el-avatar :size="60" :src="userAvatar" class="avatar animate__animated animate__fadeIn" style="animation-delay: 0.15s">
            {{ userInitial }}
          </el-avatar>
          <div class="avatar-status animate__animated animate__fadeIn" :class="{ online: userInfo.isOnline }" style="animation-delay: 0.2s"></div>
          <!-- VIP徽章 -->
          <div v-if="userInfo.isVip" class="vip-badge animate__animated animate__fadeIn" style="animation-delay: 0.25s">
            <i class="fas fa-crown"></i>
          </div>
          <!-- 普通用户徽章 -->
          <div v-else class="user-badge animate__animated animate__fadeIn" style="animation-delay: 0.25s">
            <i class="fas fa-user"></i>
          </div>
        </div>
      </div>

      <!-- 用户信息 -->
      <div class="user-info">
        <div class="username-row animate__animated animate__fadeInLeft" style="animation-delay: 0.3s">
          <h3 class="username">{{ userInfo.username }}</h3>
          <span v-if="userInfo.isVip" class="vip-tag">VIP</span>
          <span class="level-badge animate__animated animate__flipInX" :class="{ 'vip-level': userInfo.isVip, 'normal-level': !userInfo.isVip }" style="animation-delay: 0.35s">Lv.{{ userInfo.level }}</span>
        </div>
        <p class="bio animate__animated animate__fadeInUp" style="animation-delay: 0.4s">{{ userInfo.bio }}</p>
      </div>

      <!-- 信息栏 -->
      <div class="info-bar animate__animated animate__fadeInUp" style="animation-delay: 0.45s">
        <div class="info-item animate__animated animate__slideInLeft" style="animation-delay: 0.5s">
          <i class="fas fa-calendar-check"></i>
          <span>加入 {{ joinDays }} 天</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item animate__animated animate__slideInRight" style="animation-delay: 0.55s">
          <i class="fas fa-feather-alt"></i>
          <span>{{ userInfo.posts || 0 }} 篇文章</span>
        </div>
      </div>

      <!-- 会员信息 & 等级进度 -->
      <div class="compact-info-row animate__animated animate__fadeInUp" style="animation-delay: 0.6s">
        <!-- 会员信息 -->
        <div v-if="userInfo.isVip" class="vip-info compact animate__animated animate__fadeInLeft" style="animation-delay: 0.65s">
          <div class="vip-header animate__animated animate__bounceIn" style="animation-delay: 0.7s">
            <i class="fas fa-crown animate__animated animate__swing animate__infinite"></i>
            <span class="vip-title animate__animated animate__fadeInRight" style="animation-delay: 0.75s">Premium 会员</span>
          </div>
          <div class="vip-privileges animate__animated animate__slideInUp" style="animation-delay: 0.8s">
            <i class="fas fa-check-circle"></i>
            <span>享有 8 项专属特权</span>
          </div>
        </div>

        <!-- 普通用户信息 -->
        <div v-else class="normal-user-info compact animate__animated animate__fadeInLeft" style="animation-delay: 0.65s">
          <div class="normal-user-header animate__animated animate__bounceIn" style="animation-delay: 0.7s">
            <i class="fas fa-medal"></i>
            <span class="normal-user-title animate__animated animate__fadeInRight" style="animation-delay: 0.75s">潜力用户</span>
          </div>
          <div class="normal-user-privileges animate__animated animate__slideInUp" style="animation-delay: 0.8s">
            <i class="fas fa-chart-line"></i>
            <span>继续创作，提升等级解锁更多权限</span>
          </div>
        </div>

        <!-- 等级进度 -->
        <div class="level-progress compact animate__animated animate__fadeInRight" style="animation-delay: 0.85s">
          <div class="progress-header animate__animated animate__fadeInDown" style="animation-delay: 0.9s">
            <span class="current-level animate__animated animate__zoomIn" style="animation-delay: 0.95s">Lv.{{ userInfo.level }}</span>
            <span class="progress-text animate__animated animate__fadeInRight" style="animation-delay: 1.0s">{{ levelProgress }}% → Lv.{{ userInfo.level + 1 }}</span>
          </div>
          <div class="progress-bar animate__animated animate__slideInUp" style="animation-delay: 1.05s">
            <div class="progress-fill animate__animated animate__slideInLeft" :style="{ width: levelProgress + '%', animationDelay: '1.1s' }"></div>
          </div>
          <div class="progress-tip animate__animated animate__fadeInUp" style="animation-delay: 1.15s">
            <i class="fas fa-star"></i>
            <span>还需 {{ expNeeded }} 经验升级</span>
          </div>
        </div>
      </div>

      <!-- 等级展示区域 -->
      <div class="level-display-section animate__animated animate__fadeIn" style="animation-delay: 1.2s">
        <div class="section-header">
          <div class="header-icon">
            <i class="fas fa-chart-line"></i>
          </div>
          <span class="header-title">等级</span>
        </div>
        <div class="level-cards">
          <div v-for="(level, index) in levelData" :key="level.target_type"
               class="level-card animate__animated animate__zoomIn"
               :class="level.type"
               :style="{ animationDelay: `${0.7 + index * 0.1}s` }">
            <div class="level-icon animate__animated animate__zoomIn"
                 :style="{ animationDelay: `${0.75 + index * 0.1}s` }">
              <i :class="level.icon"></i>
            </div>
            <div class="level-info animate__animated animate__fadeIn"
                 :style="{ animationDelay: `${0.8 + index * 0.1}s` }">
              <div class="level-name animate__animated animate__fadeIn"
                   :style="{ animationDelay: `${0.85 + index * 0.1}s` }">{{ level.name }}</div>
              <div class="level-details animate__animated animate__fadeIn"
                   :style="{ animationDelay: `${0.9 + index * 0.1}s` }">
                <span class="level-number animate__animated animate__fadeIn"
                      :style="{ animationDelay: `${0.95 + index * 0.1}s` }">Lv.{{ level.current_level }}</span>
                <span class="level-exp animate__animated animate__fadeIn"
                      :style="{ animationDelay: `${1.0 + index * 0.1}s` }">{{ level.experience_in_level }}/{{ getNextLevelExp(level.total_experience, level.current_level) }} EXP</span>
              </div>
              <div class="level-progress-bar animate__animated animate__fadeIn"
                   :style="{ animationDelay: `${1.05 + index * 0.1}s` }">
                <div class="level-progress-fill animate__animated animate__fadeIn"
                     :style="{ width: getLevelProgress(level.experience_in_level, level.current_level) + '%', animationDelay: `${1.1 + index * 0.1}s` }"></div>
              </div>
              </div>
          </div>
        </div>
      </div>

      <!-- 荣誉徽章 -->
      <div class="badges-section animate__animated animate__fadeIn" style="animation-delay: 1.0s;">
        <div class="section-header">
          <div class="header-icon">
            <i class="fas fa-award"></i>
          </div>
          <span class="header-title">荣誉徽章</span>
        </div>
        <div class="badge-items">
          <!-- 未获得的徽章占位 - 4个 -->
          <div class="badge-item placeholder">
            <div class="badge-icon trophy">
              <i class="fas fa-trophy"></i>
            </div>
            <span>原创作者</span>
          </div>
          <div class="badge-item placeholder">
            <div class="badge-icon star">
              <i class="fas fa-star"></i>
            </div>
            <span>优秀博主</span>
          </div>
          <div class="badge-item placeholder">
            <div class="badge-icon fire">
              <i class="fas fa-fire"></i>
            </div>
            <span>活跃用户</span>
          </div>
          <div class="badge-item placeholder">
            <div class="badge-icon trophy">
              <i class="fas fa-crown"></i>
            </div>
            <span>荣耀勋章</span>
          </div>
        </div>
      </div>

      <!-- 社交媒体 -->
      <div class="social-links animate__animated animate__fadeIn" style="animation-delay: 1.6s;">
        <div class="section-header">
          <div class="header-icon">
            <i class="fas fa-link"></i>
          </div>
          <span class="header-title">社交方式</span>
        </div>
        <div class="social-icons" @mouseleave="hideSocialPopover">
          <!-- GitHub -->
          <a 
            v-if="userInfo.github" 
            :href="userInfo.github" 
            class="social-icon github" 
            target="_blank" 
            @mouseenter="showSocialPopover($event, 'github', userInfo.github, 'GitHub', 'fab fa-github', 'fa-external-link-alt', '点击访问主页')"
            @click.stop
          >
            <i class="fab fa-github"></i>
          </a>
          <a 
            v-else 
            class="social-icon github disabled"
            @mouseenter="showSocialPopover($event, 'github', '', 'GitHub', 'fab fa-github', 'fa-unlink', '暂未绑定', true)"
          >
            <i class="fab fa-github"></i>
          </a>
          
          <!-- Twitter -->
          <a 
            v-if="userInfo.twitter" 
            :href="userInfo.twitter" 
            class="social-icon twitter" 
            target="_blank" 
            @mouseenter="showSocialPopover($event, 'twitter', userInfo.twitter, 'Twitter', 'fab fa-twitter', 'fa-external-link-alt', '点击访问主页')"
            @click.stop
          >
            <i class="fab fa-twitter"></i>
          </a>
          <a 
            v-else 
            class="social-icon twitter disabled"
            @mouseenter="showSocialPopover($event, 'twitter', '', 'Twitter', 'fab fa-twitter', 'fa-unlink', '暂未绑定', true)"
          >
            <i class="fab fa-twitter"></i>
          </a>
          
          <!-- Telegram -->
          <a 
            v-if="userInfo.telegram" 
            :href="userInfo.telegram" 
            class="social-icon telegram" 
            target="_blank" 
            @mouseenter="showSocialPopover($event, 'telegram', userInfo.telegram, 'Telegram', 'fab fa-telegram', 'fa-external-link-alt', '点击访问主页')"
            @click.stop
          >
            <i class="fab fa-telegram"></i>
          </a>
          <a 
            v-else 
            class="social-icon telegram disabled"
            @mouseenter="showSocialPopover($event, 'telegram', '', 'Telegram', 'fab fa-telegram', 'fa-unlink', '暂未绑定', true)"
          >
            <i class="fab fa-telegram"></i>
          </a>
          
          <!-- 微信 -->
          <a 
            class="social-icon wechat" 
            :class="{ disabled: !userInfo.wechat }"
            @mouseenter="showSocialPopover($event, 'wechat', userInfo.wechat || '', '微信', 'fab fa-weixin', userInfo.wechat ? 'fa-copy' : 'fa-unlink', userInfo.wechat ? '点击复制微信号' : '暂未绑定', !userInfo.wechat)"
          >
            <i class="fab fa-weixin"></i>
          </a>
          
          <!-- 微博 -->
          <a 
            v-if="userInfo.weibo" 
            :href="userInfo.weibo" 
            class="social-icon weibo" 
            target="_blank" 
            @mouseenter="showSocialPopover($event, 'weibo', userInfo.weibo, '微博', 'fab fa-weibo', 'fa-external-link-alt', '点击访问主页')"
            @click.stop
          >
            <i class="fab fa-weibo"></i>
          </a>
          <a 
            v-else 
            class="social-icon weibo disabled"
            @mouseenter="showSocialPopover($event, 'weibo', '', '微博', 'fab fa-weibo', 'fa-unlink', '暂未绑定', true)"
          >
            <i class="fab fa-weibo"></i>
          </a>
          
          <!-- 邮箱 -->
          <a 
            v-if="userInfo.email" 
            :href="`mailto:${userInfo.email}`" 
            class="social-icon email" 
            @mouseenter="showSocialPopover($event, 'email', userInfo.email, '邮箱', 'fas fa-envelope', 'fa-paper-plane', '点击发送邮件')"
            @click.stop
          >
            <i class="fas fa-envelope"></i>
          </a>
          <a 
            v-else 
            class="social-icon email disabled"
            @mouseenter="showSocialPopover($event, 'email', '', '邮箱', 'fas fa-envelope', 'fa-unlink', '暂未绑定', true)"
          >
            <i class="fas fa-envelope"></i>
          </a>
          
          <!-- 共享气泡 -->
          <transition name="social-fade">
            <div 
              v-if="socialPopover.visible" 
              class="social-popover-shared"
              :class="{ 'is-disabled': socialPopover.isDisabled }"
              :style="socialPopover.style"
              @mouseenter="keepPopoverVisible"
              @mouseleave="hideSocialPopover"
            >
              <div class="popover-arrow"></div>
              <div class="popover-content">
                <div class="popover-header">
                  <i :class="socialPopover.icon"></i>
                  <span>{{ socialPopover.title }}</span>
                </div>
                <div v-if="!socialPopover.isDisabled" class="popover-body">
                  <div class="popover-text">{{ socialPopover.content }}</div>
                </div>
                <div v-else class="popover-empty">
                  <i class="fas fa-unlink"></i>
                  <span>{{ socialPopover.tip }}</span>
                </div>
                <div v-if="!socialPopover.isDisabled" class="popover-footer">
                  <i :class="'fas ' + socialPopover.tipIcon"></i>
                  <span>{{ socialPopover.tip }}</span>
                </div>
              </div>
            </div>
          </transition>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { useStore } from '@/store'

// 获取store中的用户信息
const store = useStore()

// 从store获取用户信息
const userInfo = computed(() => {
  const storeUser = store.userInfo as any
  if (storeUser) {
    return {
      id: storeUser.id,
      avatar: storeUser.avatar || '',
      username: storeUser.nickname || storeUser.username || '未知用户',
      bio: storeUser.signature || '这个人很懒，什么都没有留下~',
      level: storeUser.level || 1,
      isVip: storeUser.premium !== null, // 如果premium不为null说明是会员
      isOnline: storeUser.status !== undefined ? storeUser.status : true,
      email: storeUser.email || '',
      phone: storeUser.phone || '',
      roles: storeUser.roles || [],
      permissions: storeUser.permissions || [],
      last_login: storeUser.last_login || '',
      gender: storeUser.gender || 0,
      create_time: storeUser.create_time || '',
      // 保留虚拟数据字段（后端没有的）
      posts: 128,
      followers: 0,
      following: 0,
      joinDays: 365,
      github: '',
      twitter: '',
      telegram: '',
      wechat: '',
      weibo: ''
    }
  }

  // 默认数据
  return {
    id: 0,
    avatar: '',
    username: '未知用户',
    bio: '这个人很懒，什么都没有留下~',
    level: 1,
    isVip: false,
    isOnline: false,
    email: '',
    phone: '',
    roles: [],
    permissions: [],
    last_login: '',
    gender: 0,
    create_time: '',
    posts: 0,
    followers: 0,
    following: 0,
    joinDays: 1,
    github: '',
    twitter: '',
    telegram: '',
    wechat: '',
    weibo: ''
  }
})

const levelProgress = 78 // 等级进度百分比
const expNeeded = 220 // 还需经验

// 计算加入天数
const joinDays = computed(() => {
  const storeUser = store.userInfo as any
  if (storeUser?.create_time) {
    const createTime = new Date(storeUser.create_time)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createTime.getTime())
    const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return days >= 1 ? days : 1 // 不足一天当做一天
  }
  return 1 // 默认值
})

// 头像处理逻辑
const userAvatar = computed(() => {
  const storeUser = store.userInfo as any
  return storeUser?.avatar || ''
})

const userInitial = computed(() => {
  const username = userInfo.value.username
  return username ? username.charAt(0) : 'U'
})

// 等级数据处理
const levelData = computed(() => {
  const storeUser = store.userInfo as any
  if (storeUser?.level_records) {
    return storeUser.level_records.map((record: any) => {
      const config = getLevelConfig(record.target_type)
      return {
        target_type: record.target_type,
        current_level: record.current_level,
        total_experience: record.total_experience,
        experience_in_level: record.experience_in_level,
        level_up_count: record.level_up_count,
        ...config
      }
    }).sort((a: any, b: any) => a.sort - b.sort)
  }

  // 默认虚拟数据
  return [
    {
      target_type: 'user',
      current_level: 1,
      total_experience: 0,
      experience_in_level: 0,
      level_up_count: 0,
      name: '综合等级',
      type: 'user',
      icon: 'fas fa-user-shield',
      color: '#8b5cf6',
      sort: 1
    },
    {
      target_type: 'writer',
      current_level: 1,
      total_experience: 0,
      experience_in_level: 0,
      level_up_count: 0,
      name: '作者等级',
      type: 'writer',
      icon: 'fas fa-pen-fancy',
      color: '#f59e0b',
      sort: 2
    },
    {
      target_type: 'reader',
      current_level: 1,
      total_experience: 0,
      experience_in_level: 0,
      level_up_count: 0,
      name: '读者等级',
      type: 'reader',
      icon: 'fas fa-book-reader',
      color: '#10b981',
      sort: 3
    },
    {
      target_type: 'interaction',
      current_level: 1,
      total_experience: 0,
      experience_in_level: 0,
      level_up_count: 0,
      name: '互动等级',
      type: 'interaction',
      icon: 'fas fa-comments',
      color: '#06b6d4',
      sort: 4
    }
  ]
})

// 获取等级配置
function getLevelConfig(targetType: string) {
  const configs: Record<string, any> = {
    user: {
      name: '综合等级',
      type: 'user',
      icon: 'fas fa-user-shield',
      color: '#8b5cf6',
      sort: 1
    },
    writer: {
      name: '作者等级',
      type: 'writer',
      icon: 'fas fa-pen-fancy',
      color: '#f59e0b',
      sort: 2
    },
    reader: {
      name: '读者等级',
      type: 'reader',
      icon: 'fas fa-book-reader',
      color: '#10b981',
      sort: 3
    },
    interaction: {
      name: '互动等级',
      type: 'interaction',
      icon: 'fas fa-comments',
      color: '#06b6d4',
      sort: 4
    }
  }
  return configs[targetType] || configs.user
}

// 计算等级进度
function getLevelProgress(expInLevel: number, currentLevel: number) {
  if (expInLevel === 0 || currentLevel === 1) return 0
  return Math.min((expInLevel / (currentLevel * 100)) * 100, 100)
}

// 计算下一级所需经验
function getNextLevelExp(_totalExp: number, currentLevel: number) {
  return currentLevel * 100
}

// 社交气泡状态
const socialPopover = reactive({
  visible: false,
  icon: '',
  title: '',
  content: '',
  tip: '',
  tipIcon: '',
  isDisabled: false,
  style: {
    left: '0px',
    top: '0px',
    transform: 'translate(-50%, -100%)'
  }
})

let hideTimer: any = null

// 显示社交气泡
function showSocialPopover(
  event: MouseEvent, 
  _type: string, 
  content: string,
  title: string,
  icon: string, 
  tipIcon: string, 
  tip: string, 
  isDisabled = false
) {
  clearTimeout(hideTimer)
  
  const target = event.currentTarget as HTMLElement
  const rect = target.getBoundingClientRect()
  
  // 计算气泡位置（使用 fixed 定位，相对于视口）
  const left = rect.left + rect.width / 2
  const top = rect.top - 10
  
  socialPopover.icon = icon
  socialPopover.title = title
  socialPopover.content = content
  socialPopover.tip = tip
  socialPopover.tipIcon = tipIcon
  socialPopover.isDisabled = isDisabled
  socialPopover.style = {
    left: `${left}px`,
    top: `${top}px`,
    transform: 'translate(-50%, -100%)'
  }
  socialPopover.visible = true
}

// 保持气泡可见
function keepPopoverVisible() {
  clearTimeout(hideTimer)
}

// 隐藏社交气泡
function hideSocialPopover() {
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    socialPopover.visible = false
  }, 200)
}

</script>

<style lang="less" scoped>
.person-info-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: visible;
  transition: all 0.3s ease;
  position: relative;
  z-index: 1;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: var(--el-bg-color);
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
  overflow: visible;
  position: relative;
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
      animation: rotate 3s linear infinite;

      &.vip-ring {
        border-top-color: var(--theme-purple-primary);
        border-right-color: var(--theme-purple-light-3);
      }

      &.normal-ring {
        border-top-color: #3b82f6;
        border-right-color: #60a5fa;
      }
    }

    .avatar {
      border: 2px solid var(--el-bg-color);
      position: relative;
      z-index: 1;

      :deep(.el-avatar) {
        width: 60px !important;
        height: 60px !important;
        border-radius: 50%;
        object-fit: cover;
      }
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
        background: #3b82f6;
        box-shadow: 0 0 6px rgba(59, 130, 246, 0.4);
      }
    }

    .vip-badge {
      position: absolute;
      top: -3px;
      right: -3px;
      width: 24px;
      height: 24px;
      background: linear-gradient(135deg, #ffd700, #ffb300);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow:
        0 4px 12px rgba(255, 215, 0, 0.2),
        0 8px 24px rgba(255, 215, 0, 0.15),
        0 12px 48px rgba(255, 215, 0, 0.08);
      z-index: 2;
      animation: vipPulse 2s ease-in-out infinite;

      i {
        font-size: 12px;
        color: white;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        flex-shrink: 0;
      }
    }

    .user-badge {
      position: absolute;
      top: -2px;
      right: -2px;
      width: 18px;
      height: 18px;
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 2px 6px rgba(59, 130, 246, 0.4);
      z-index: 2;

      i {
        font-size: 9px;
        color: white;
      }
    }
  }
}

// fieldset 风格标题 - 精致线条
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  position: relative;

  &::before,
  &::after {
    content: '';
    flex: 1;
    height: 2px;
    position: relative;
    overflow: hidden;
  }

  .header-icon {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    transition: all 0.3s ease;
    position: relative;

    i {
      font-size: 10px;
      color: white;
      filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.2));
    }
  }

  .header-title {
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    white-space: nowrap;
    flex-shrink: 0;
    letter-spacing: 0.3px;
  }
}

// 等级标题 - 紫色
.level-display-section .section-header {
  &::before {
    background: linear-gradient(90deg, transparent 0%, rgba(139, 92, 246, 0.1) 30%, rgba(139, 92, 246, 0.3) 100%);
  }

  &::after {
    background: linear-gradient(90deg, rgba(139, 92, 246, 0.3) 0%, rgba(139, 92, 246, 0.1) 70%, transparent 100%);
  }

  .header-icon {
    background: linear-gradient(135deg, #8b5cf6, #a78bfa);
    box-shadow: 0 2px 6px rgba(139, 92, 246, 0.25);

    &::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.15), transparent 70%);
      z-index: -1;
    }
  }

  &:hover .header-icon {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 3px 8px rgba(139, 92, 246, 0.35);
  }
}

// 荣誉徽章标题 - 金色
.badges-section .section-header {
  &::before {
    background: linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.1) 30%, rgba(245, 158, 11, 0.3) 100%);
  }

  &::after {
    background: linear-gradient(90deg, rgba(245, 158, 11, 0.3) 0%, rgba(245, 158, 11, 0.1) 70%, transparent 100%);
  }

  .header-icon {
    background: linear-gradient(135deg, #f59e0b, #fbbf24);
    box-shadow: 0 2px 6px rgba(245, 158, 11, 0.25);

    &::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.15), transparent 70%);
      z-index: -1;
    }
  }

  &:hover .header-icon {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 3px 8px rgba(245, 158, 11, 0.35);
  }
}

// 社交方式标题 - 蓝色
.social-links .section-header {
  &::before {
    background: linear-gradient(90deg, transparent 0%, rgba(59, 130, 246, 0.1) 30%, rgba(59, 130, 246, 0.3) 100%);
  }

  &::after {
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 70%, transparent 100%);
  }

  .header-icon {
    background: linear-gradient(135deg, #3b82f6, #60a5fa);
    box-shadow: 0 2px 6px rgba(59, 130, 246, 0.25);

    &::before {
      content: '';
      position: absolute;
      inset: -3px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(59, 130, 246, 0.15), transparent 70%);
      z-index: -1;
    }
  }

  &:hover .header-icon {
    transform: scale(1.1) rotate(5deg);
    box-shadow: 0 3px 8px rgba(59, 130, 246, 0.35);
  }
}

// 用户信息
.user-info {
  text-align: center;
  margin-bottom: 12px;

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

    .vip-tag {
      padding: 2px 8px;
      background: linear-gradient(135deg, #fbbf24, #f59e0b);
      color: white;
      font-size: 10px;
      font-weight: 600;
      border-radius: 10px;
      box-shadow: 0 2px 4px rgba(251, 191, 36, 0.3);
      letter-spacing: 0.5px;
    }

    .level-badge {
      padding: 2px 8px;
      font-size: 10px;
      font-weight: 600;
      border-radius: 10px;

      &.vip-level {
        background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
        color: white;
        box-shadow: 0 2px 4px var(--theme-orange-shadow);
      }

      &.normal-level {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
        box-shadow: 0 2px 4px rgba(59, 130, 246, 0.3);
      }
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
  margin-bottom: 12px;

  .badges-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding: 0 4px;

    i {
      font-size: 14px;
      color: #f59e0b;
    }

    .badges-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .badge-items {
    display: flex;
    justify-content: space-between;
    gap: 6px;
  }

  .badge-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 6px;
    background: var(--el-bg-color);
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid var(--el-border-color-extra-light);
    flex: 1;
    position: relative;

    .badge-icon {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 13px;
      transition: all 0.3s ease;
      position: relative;

      i {
        position: relative;
        z-index: 2;
      }

      &.trophy {
        background: linear-gradient(135deg, #fef8f8, #fbc02d);
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
      position: relative;
      z-index: 2;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

      .badge-icon {
        transform: scale(1.1);
      }
    }

    // 占位徽章样式 - 保留原色彩，添加简单蒙版
    &.placeholder {
      cursor: default;

      // 简单的半透明蒙版，z-index 在内容下方
      &::after {
        content: '';
        position: absolute;
        inset: 0;
        background: rgba(255, 255, 255, 0.7);
        border-radius: 10px;
        pointer-events: none;
        z-index: 1;
        
        [data-theme='dark'] & {
          background: rgba(0, 0, 0, 0.5);
        }
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
}



// 信息栏
.info-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
  font-size: 11px;

  .info-item {
    display: flex;
    align-items: center;
    gap: 5px;

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
  }

  .info-divider {
    width: 1px;
    height: 12px;
    background: var(--el-border-color);
  }
}

// 紧凑信息行
.compact-info-row {
  display: flex;
  flex-direction: row;
  gap: 10px;
  margin-bottom: 14px;

  // 会员信息 - 紧凑样式
  .vip-info.compact {
    flex: 1;
    margin-top: 0;
    padding: 12px;
    border-radius: 8px;
    min-width: 0;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    
    // 亮色模式
    background: linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%);
    border: 1px solid #f3d078;
    box-shadow: 0 1px 4px rgba(251, 191, 36, 0.08);
    
    // 深色模式
    [data-theme='dark'] & {
      background: var(--el-bg-color);
      border: 1px solid var(--el-border-color-light);
      box-shadow: 0 1px 4px var(--el-box-shadow-light);
    }

    // 高级光泽效果
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 255, 255, 0.1) 50%, transparent 70%);
      pointer-events: none;
      
      [data-theme='dark'] & {
        background: linear-gradient(45deg, transparent 30%, var(--el-fill-color-light) 50%, transparent 70%);
      }
    }

    .vip-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
      position: relative;
      z-index: 1;

      i {
        font-size: 12px;
        color: #d97706;
        flex-shrink: 0;
        
        [data-theme='dark'] & {
          color: var(--el-color-warning);
        }
      }

      .vip-title {
        font-size: 12px;
        font-weight: 700;
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 0.3px;
        color: #a16207;
        
        [data-theme='dark'] & {
          color: var(--el-text-color-primary);
        }
      }

      .vip-expire {
        font-size: 10px;
        white-space: nowrap;
        flex-shrink: 0;
        font-weight: 500;
        color: #92400e;
        
        [data-theme='dark'] & {
          color: var(--el-text-color-regular);
        }
      }
    }

    .vip-privileges {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      position: relative;
      z-index: 1;
      color: #92400e;
      
      [data-theme='dark'] & {
        color: var(--el-text-color-regular);
      }

      i {
        font-size: 10px;
        color: #d97706;
        flex-shrink: 0;

        [data-theme='dark'] & {
          color: var(--el-color-warning);
        }
      }

      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
      }
    }
  }

  // 普通用户信息 - 紧凑样式
  .normal-user-info.compact {
    flex: 1;
    margin-top: 0;
    padding: 10px;
    background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
    border: 1px solid #bfdbfe;
    border-radius: 8px;
    min-width: 0;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.08) 50%, transparent 70%);
      pointer-events: none;
    }

    [data-theme='dark'] & {
      background: linear-gradient(45deg, transparent 30%, rgba(240, 147, 87, 0.12) 50%, transparent 70%);
    }

    [data-theme='dark'] & {
      background: var(--el-bg-color);
      border: 1px solid var(--el-border-color);
    }

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(59, 130, 246, 0.05) 50%, transparent 70%);
      pointer-events: none;
    }

    .normal-user-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 8px;
      position: relative;
      z-index: 1;

      i {
        font-size: 12px;
        color: var(--el-color-primary);
        flex-shrink: 0;
      }

      .normal-user-title {
        font-size: 12px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        letter-spacing: 0.3px;
      }
    }

    .normal-user-privileges {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      color: var(--el-text-color-regular);
      position: relative;
      z-index: 1;

      i {
        font-size: 10px;
        color: var(--el-color-primary);
        flex-shrink: 0;
      }

      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 500;
      }
    }
  }

  // 等级进度 - 紧凑样式
  .level-progress.compact {
    flex: 1;
    margin-top: 0;
    padding: 10px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
    min-width: 0;

    .progress-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 6px;

      .current-level {
        font-size: 11px;
        font-weight: 600;
        color: var(--theme-purple-primary);
        white-space: nowrap;
      }

      .progress-text {
        font-size: 9px;
        color: var(--el-text-color-regular);
        font-weight: 500;
        white-space: nowrap;
      }
    }

    .progress-bar {
      height: 5px;
      margin-bottom: 6px;
    }

    .progress-tip {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 9px;
      color: var(--el-text-color-secondary);

      i {
        font-size: 9px;
        color: var(--el-color-warning);
        flex-shrink: 0;
      }

      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

      }
}

// 等级展示区域
.level-display-section {
  margin-bottom: 14px;
  padding: 0 2px;

  .level-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding: 0 4px;

    i {
      font-size: 14px;
      color: var(--theme-purple-primary);
    }

    .level-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .level-cards {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .level-card {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    padding: 10px;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 8px;
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
      background: linear-gradient(135deg, transparent 0%, rgba(0, 0, 0, 0.02) 100%);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover {
      border-color: var(--el-border-color-light);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
      transform: translateY(-2px);

      &::before {
        opacity: 1;
      }
    }

    .level-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      position: relative;
      z-index: 1;

      &::after {
        content: '';
        position: absolute;
        inset: 0;
        border-radius: 6px;
        background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
      }

      i {
        font-size: 14px;
        color: white;
        position: relative;
        z-index: 2;
      }
    }

    .level-info {
      flex: 1;
      min-width: 0;
      position: relative;
      z-index: 1;

      .level-name {
        font-size: 11px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 4px;
        line-height: 1.2;
      }

      .level-details {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;

        .level-number {
          font-size: 10px;
          font-weight: 600;
          color: var(--el-text-color-regular);
        }

        .level-exp {
          font-size: 9px;
          color: var(--el-text-color-secondary);
        }
      }

      .level-progress-bar {
        width: 100%;
        height: 4px;
        background: var(--el-fill-color);
        border-radius: 2px;
        margin-bottom: 6px;
        overflow: hidden;

        .level-progress-fill {
          height: 100%;
          border-radius: 2px;
          transition: width 0.6s ease;
          background: linear-gradient(90deg, var(--el-color-primary), var(--el-color-primary-light-3));
        }
      }

      .level-stats {
        display: flex;
        justify-content: space-between;
        font-size: 8px;
        color: var(--el-text-color-placeholder);

        .total-exp, .level-count {
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    // 不同类型的等级卡片颜色
    &.user .level-icon {
      background: linear-gradient(135deg, #8b5cf6, #7c3aed);
    }

    &.user .level-progress-fill {
      background: linear-gradient(90deg, #8b5cf6, #a78bfa);
    }

    &.writer .level-icon {
      background: linear-gradient(135deg, #f59e0b, #d97706);
    }

    &.writer .level-progress-fill {
      background: linear-gradient(90deg, #f59e0b, #fbbf24);
    }

    &.reader .level-icon {
      background: linear-gradient(135deg, #3b82f6, #1d4ed8);
    }

    &.reader .level-progress-fill {
      background: linear-gradient(90deg, #3b82f6, #60a5fa);
    }

    &.interaction .level-icon {
      background: linear-gradient(135deg, #06b6d4, #0891b2);
    }

    &.interaction .level-progress-fill {
      background: linear-gradient(90deg, #06b6d4, #22d3ee);
    }
  }
}

// 社交媒体
.social-links {
  margin-bottom: 0;
  overflow: visible;
  position: relative;
  z-index: 1;

  .social-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    padding: 0 4px;

    i {
      font-size: 14px;
      color: var(--theme-purple-primary);
    }

    .social-title {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }

  .social-icons {
    display: flex;
    justify-content: center;
    gap: 10px;
    overflow: visible;
  }

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
    position: relative;

    i {
      position: relative;
      z-index: 2;
    }

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

    &.wechat {
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

    &.telegram {
      background: #e3f2fd;
      color: #0088cc;
      border: 1px solid #90caf9;

      &:hover {
        background: #0088cc;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 12px rgba(0, 136, 204, 0.3);
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

    // 禁用状态 - 保留原色彩
    &.disabled {
      cursor: not-allowed;
      
      &:hover {
        transform: none;
        box-shadow: none;
      }
    }
  }
}

// 会员信息
.vip-info {
  margin-top: 14px;
  padding: 12px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border-radius: 10px;
  border: 1px solid #fbbf24;

  .vip-header {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;

    i {
      font-size: 14px;
      color: #d97706;
    }

    .vip-title {
      font-size: 13px;
      font-weight: 600;
      color: #92400e;
      flex: 1;
    }

    .vip-expire {
      font-size: 10px;
      color: #78350f;
    }
  }

  .vip-privileges {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: #78350f;

    i {
      font-size: 12px;
      color: #d97706;
    }
  }
}

// 等级进度
.level-progress {
  margin-top: 14px;
  padding: 12px;
  background: var(--el-bg-color);
  border-radius: 10px;
  border: 1px solid var(--el-border-color-extra-light);

  .progress-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;

    .current-level {
      font-size: 13px;
      font-weight: 600;
      color: var(--theme-purple-primary);
    }

    .progress-text {
      font-size: 11px;
      color: var(--el-text-color-regular);
      font-weight: 500;
    }
  }

  .progress-bar {
    height: 8px;
    background: var(--el-fill-color);
    border-radius: 10px;
    overflow: hidden;
    margin-bottom: 8px;
    position: relative;

    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, var(--theme-purple-primary), var(--theme-purple-secondary));
      border-radius: 10px;
      transition: width 0.6s ease;
      position: relative;
      overflow: hidden;

      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
        animation: shimmer 2s infinite;
      }
    }
  }

  .progress-tip {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    color: var(--el-text-color-secondary);

    i {
      font-size: 11px;
      color: #fbbf24;
    }
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
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

<style lang="less">
// 社交图标容器
.social-icons {
  position: relative;
}

// 共享气泡样式 - 精致简约
.social-popover-shared {
  position: fixed;
  z-index: 9999;
  pointer-events: auto;
  
  .popover-arrow {
    position: absolute;
    bottom: -6px;
    left: 50%;
    width: 12px;
    height: 12px;
    background: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-light);
    border-top: none;
    border-left: none;
    transform: translateX(-50%) rotate(45deg);
    
    [data-theme='dark'] & {
      background: var(--el-bg-color-overlay);
    }
  }
  
  .popover-content {
    background: var(--el-bg-color-overlay);
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
    padding: 12px 14px;
    min-width: 200px;
    max-width: 280px;
    backdrop-filter: blur(8px);
    
    [data-theme='dark'] & {
      background: var(--el-bg-color-overlay);
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
    }
  }
  
  .popover-header {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 10px;
    
    i {
      font-size: 16px;
      color: var(--el-color-primary);
      flex-shrink: 0;
    }
    
    span {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-primary);
    }
  }
  
  .popover-body {
    margin-bottom: 10px;
    
    .popover-text {
      font-size: 12px;
      color: var(--el-text-color-regular);
      word-break: break-all;
      line-height: 1.6;
      padding: 8px 10px;
      background: var(--el-fill-color-light);
      border-radius: 6px;
    }
  }
  
  .popover-footer {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    font-size: 11px;
    color: var(--el-text-color-secondary);
    padding-top: 8px;
    border-top: 1px solid var(--el-border-color-lighter);
    
    i {
      font-size: 10px;
      color: var(--el-color-primary);
    }
  }
  
  .popover-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    padding: 16px 0;
    
    i {
      font-size: 28px;
      color: var(--el-text-color-placeholder);
      opacity: 0.5;
    }
    
    span {
      font-size: 12px;
      color: var(--el-text-color-secondary);
    }
  }
  
  // 未绑定状态
  &.is-disabled {
    .popover-header i {
      color: var(--el-text-color-placeholder);
    }
  }
  
  // 移动端适配
  @media (max-width: 768px) {
    .popover-content {
      min-width: 160px;
      max-width: 220px;
      padding: 8px 10px;
    }
    
    .popover-arrow {
      width: 10px;
      height: 10px;
      bottom: -5px;
    }
    
    .popover-header {
      margin-bottom: 8px;
      
      i {
        font-size: 13px;
      }
      
      span {
        font-size: 11px;
      }
    }
    
    .popover-body {
      margin-bottom: 8px;
      
      .popover-text {
        font-size: 10px;
        padding: 6px 8px;
        line-height: 1.5;
      }
    }
    
    .popover-footer {
      font-size: 9px;
      padding-top: 6px;
      
      i {
        font-size: 9px;
      }
    }
    
    .popover-empty {
      padding: 10px 0;
      gap: 6px;
      
      i {
        font-size: 22px;
      }
      
      span {
        font-size: 10px;
      }
    }
  }
  
  // 小屏幕进一步优化
  @media (max-width: 480px) {
    .popover-content {
      min-width: 140px;
      max-width: 200px;
      padding: 7px 9px;
    }
    
    .popover-header {
      margin-bottom: 6px;
      
      i {
        font-size: 12px;
      }
      
      span {
        font-size: 10px;
      }
    }
    
    .popover-body {
      margin-bottom: 6px;
      
      .popover-text {
        font-size: 9px;
        padding: 5px 7px;
      }
    }
    
    .popover-footer {
      font-size: 8px;
      padding-top: 5px;
      
      i {
        font-size: 8px;
      }
    }
    
    .popover-empty {
      padding: 8px 0;
      
      i {
        font-size: 20px;
      }
      
      span {
        font-size: 9px;
      }
    }
  }
}

// 气泡过渡动画
.social-fade-enter-active {
  animation: socialFadeIn 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.social-fade-leave-active {
  animation: socialFadeOut 0.15s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes socialFadeIn {
  from {
    opacity: 0;
    transform: translate(-50%, -100%) scale(0.95) translateY(6px);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1) translateY(0);
  }
}

@keyframes socialFadeOut {
  from {
    opacity: 1;
    transform: translate(-50%, -100%) scale(1) translateY(0);
  }
  to {
    opacity: 0;
    transform: translate(-50%, -100%) scale(0.98) translateY(3px);
  }
}
</style>
