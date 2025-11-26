<template>
  <div class="person-info-card">
    <!-- 卡片头部 -->
    <div class="card-header">
      <span class="uid-label">UID: <span class="uid-number">{{ userInfo.id || '1008611' }}</span></span>
    </div>

    <!-- 卡片内容 -->
    <div class="card-body">
      <!-- 头像区域 -->
      <div class="avatar-section">
        <div class="avatar-container">
          <div class="avatar-ring" :class="{ 'vip-ring': userInfo.isVip, 'normal-ring': !userInfo.isVip }"></div>
          <el-avatar :size="60" :src="userAvatar" class="avatar">
            {{ userInitial }}
          </el-avatar>
          <div class="avatar-status" :class="{ online: userInfo.isOnline }"></div>
          <!-- VIP徽章 -->
          <div v-if="userInfo.isVip" class="vip-badge">
            <i class="fas fa-crown"></i>
          </div>
          <!-- 普通用户徽章 -->
          <div v-else class="user-badge">
            <i class="fas fa-user"></i>
          </div>
        </div>
      </div>

      <!-- 用户信息 -->
      <div class="user-info">
        <div class="username-row">
          <h3 class="username">{{ userInfo.username }}</h3>
          <span v-if="userInfo.isVip" class="vip-tag">VIP</span>
          <span class="level-badge" :class="{ 'vip-level': userInfo.isVip, 'normal-level': !userInfo.isVip }">Lv.{{ userInfo.level }}</span>
        </div>
        <p class="bio">{{ userInfo.bio }}</p>
      </div>

      <!-- 信息栏 -->
      <div class="info-bar">
        <div class="info-item">
          <i class="fas fa-calendar-check"></i>
          <span>加入 {{ joinDays }} 天</span>
        </div>
        <div class="info-divider"></div>
        <div class="info-item">
          <i class="fas fa-feather-alt"></i>
          <span>{{ userInfo.posts || 0 }} 篇文章</span>
        </div>
      </div>

      <!-- 会员信息 & 等级进度 -->
      <div class="compact-info-row">
        <!-- 会员信息 -->
        <div v-if="userInfo.isVip" class="vip-info compact">
          <div class="vip-header">
            <i class="fas fa-crown"></i>
            <span class="vip-title">Premium 会员</span>
          </div>
          <div class="vip-privileges">
            <i class="fas fa-check-circle"></i>
            <span>享有 8 项专属特权</span>
          </div>
        </div>

        <!-- 普通用户信息 -->
        <div v-else class="normal-user-info compact">
          <div class="normal-user-header">
            <i class="fas fa-medal"></i>
            <span class="normal-user-title">潜力用户</span>
          </div>
          <div class="normal-user-privileges">
            <i class="fas fa-chart-line"></i>
            <span>继续创作，提升等级解锁更多权限</span>
          </div>
        </div>

        <!-- 等级进度 -->
        <div class="level-progress compact">
          <div class="progress-header">
            <span class="current-level">Lv.{{ userInfo.level }}</span>
            <span class="progress-text">{{ levelProgress }}% → Lv.{{ userInfo.level + 1 }}</span>
          </div>
          <div class="progress-bar">
            <div class="progress-fill" :style="{ width: levelProgress + '%' }"></div>
          </div>
          <div class="progress-tip">
            <i class="fas fa-star"></i>
            <span>还需 {{ expNeeded }} 经验升级</span>
          </div>
        </div>
      </div>

      <!-- 等级展示区域 -->
      <div class="level-display-section">
        <div class="level-header">
          <i class="fas fa-trophy"></i>
          <span class="level-title">等级</span>
        </div>
        <div class="level-cards">
          <div v-for="level in levelData" :key="level.target_type" class="level-card" :class="level.type">
            <div class="level-icon">
              <i :class="level.icon"></i>
            </div>
            <div class="level-info">
              <div class="level-name">{{ level.name }}</div>
              <div class="level-details">
                <span class="level-number">Lv.{{ level.current_level }}</span>
                <span class="level-exp">{{ level.experience_in_level }}/{{ getNextLevelExp(level.total_experience, level.current_level) }} EXP</span>
              </div>
              <div class="level-progress-bar">
                <div class="level-progress-fill" :style="{ width: getLevelProgress(level.experience_in_level, level.current_level) + '%' }"></div>
              </div>
              </div>
          </div>
        </div>
      </div>

      <!-- 荣誉徽章 -->
      <div class="badges-section">
        <div class="badges-header">
          <i class="fas fa-award"></i>
          <span class="badges-title">荣誉徽章</span>
        </div>
        <div class="badge-items">
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
      </div>

      <!-- 社交媒体 -->
      <div class="social-links">
        <div class="social-header">
          <i class="fas fa-share-alt"></i>
          <span class="social-title">社交方式</span>
        </div>
        <div class="social-icons">
          <a v-if="userInfo.github" :href="userInfo.github" class="social-icon github" title="GitHub" target="_blank">
            <i class="fab fa-github"></i>
          </a>
          <a v-else href="#" class="social-icon github" title="GitHub" onclick="return false;">
            <i class="fab fa-github"></i>
          </a>
          <a v-if="userInfo.twitter" :href="userInfo.twitter" class="social-icon twitter" title="Twitter" target="_blank">
            <i class="fab fa-twitter"></i>
          </a>
          <a v-else href="#" class="social-icon twitter" title="Twitter" onclick="return false;">
            <i class="fab fa-twitter"></i>
          </a>
          <a v-if="userInfo.wechat" class="social-icon weixin" title="微信">
            <i class="fab fa-weixin"></i>
          </a>
          <a v-else href="#" class="social-icon weixin" title="微信" onclick="return false;">
            <i class="fab fa-weixin"></i>
          </a>
          <a v-if="userInfo.weibo" :href="userInfo.weibo" class="social-icon weibo" title="微博" target="_blank">
            <i class="fab fa-weibo"></i>
          </a>
          <a v-else href="#" class="social-icon weibo" title="微博" onclick="return false;">
            <i class="fab fa-weibo"></i>
          </a>
          <a v-if="userInfo.email" :href="`mailto:${userInfo.email}`" class="social-icon email" title="邮箱">
            <i class="fas fa-envelope"></i>
          </a>
          <a v-else href="#" class="social-icon email" title="邮箱" onclick="return false;">
            <i class="fas fa-envelope"></i>
          </a>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useStore } from '@/store'

interface UserInfo {
  id?: number
  avatar: string
  username: string
  bio: string
  level: number
  isVip: boolean
  isOnline: boolean
  tags: string[]
  email?: string
  phone?: string
  roles?: any[]
  permissions?: string[]
  last_login?: string
  gender?: number
  create_time?: string
  posts?: number
  followers?: number
  following?: number
  joinDays?: number
  github?: string
  twitter?: string
  wechat?: string
  weibo?: string
}

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
  return storeUser?.avatar || storeUser?.headImg || ''
})

const userInitial = computed(() => userInfo.value.username.charAt(0))

interface Props {
  userInfo?: UserInfo
}

// 获取store中的用户信息
const store = useStore()

// 从store获取用户信息或使用props传入的数据
const userInfo = computed(() => {
  const storeUser = store.userInfo as any
  if (storeUser) {
    return {
      id: storeUser.id,
      avatar: storeUser.avatar || storeUser.headImg || '',
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
      wechat: '',
      weibo: ''
    }
  }

  // 如果store中没有数据，使用props中的数据
  return props.userInfo
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
    justify-content: center;
    gap: 10px;
  }

  .badge-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 8px 10px;
    background: var(--el-bg-color);
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
