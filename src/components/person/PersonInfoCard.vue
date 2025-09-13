<template>
  <div class="person-info-card animate__animated animate__fadeIn">
    <div class="card-header">
      <div class="profile-stats">
        <div class="stat-pill">
          <span class="icon-wrapper"><i class="fas fa-star"></i></span>
          <span class="stat-value">{{ getUserLevel() }}</span>
        </div>
        <div class="stat-pill">
          <span class="icon-wrapper"><i class="fas fa-calendar-check"></i></span>
          <span class="stat-value">{{ getDaysJoined() }}天</span>
        </div>
      </div>
    </div>
    
    <div class="card-body">
      <div class="avatar-section">
        <div class="avatar-container">
          <div class="avatar-frame">
            <el-avatar :size="90" :src="userInfo.avatar" class="user-avatar">
              {{ userInfo.username ? userInfo.username.charAt(0).toUpperCase() : 'U' }}
            </el-avatar>
          </div>
          <div v-if="!isViewMode" class="edit-avatar-btn" @click="handleAvatarEdit">
            <span class="icon-wrapper"><i class="fas fa-camera"></i></span>
          </div>
        </div>
        
        <div class="user-badges">
          <div class="badge-item" v-if="isVip">
            <span class="badge-icon gold">
              <i class="fas fa-crown"></i>
            </span>
            <span class="badge-tooltip">VIP会员</span>
          </div>
          <div class="badge-item" v-if="hasVerified">
            <span class="badge-icon blue">
              <i class="fas fa-check"></i>
            </span>
            <span class="badge-tooltip">已认证</span>
          </div>
          <div class="badge-item" v-if="isActive">
            <span class="badge-icon purple">
              <i class="fas fa-bolt"></i>
            </span>
            <span class="badge-tooltip">活跃用户</span>
          </div>
        </div>
      </div>
      
      <div class="user-info">
        <h4 class="username tag-premium-text">
          {{ userInfo.username || '未设置用户名' }}
          <span v-if="userRoleName !== '普通用户'" :class="getRoleTagClass()">{{ userRoleName.includes('管理员') ? userRoleName : 'Premium' }}</span>
        </h4>
        
        <div class="user-meta">
          <div class="meta-item">
            <span class="icon-wrapper"><i class="fas fa-id-card"></i></span>
            <span>ID: {{ userInfo.id || '-' }}</span>
          </div>
          <div class="meta-item">
            <span class="icon-wrapper"><i class="fas fa-clock"></i></span>
            <span>注册于 {{ formatDate(userInfo.createTime) }}</span>
          </div>
        </div>
        
        <div class="user-bio">
          <p>{{ userInfo.bio || '这个人很懒，还没有填写个人介绍~' }}</p>
        </div>
          
        <div v-if="!isViewMode" class="user-actions">
          <button class="action-btn primary" @click="handleEditProfile">
            <span class="icon-wrapper"><i class="fas fa-edit"></i></span>
            <span>编辑资料</span>
          </button>
          <button class="action-btn secondary">
            <span class="icon-wrapper"><i class="fas fa-share-alt"></i></span>
            <span>分享</span>
          </button>
        </div>
        
        <div v-else class="user-actions">
          <button class="action-btn secondary">
            <span class="icon-wrapper"><i class="fas fa-share-alt"></i></span>
            <span>分享</span>
          </button>
        </div>
      </div>
    </div>
    
    <div class="card-footer">
      <div class="stats-grid">
        <div class="stat-item animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
          <div class="stat-value">{{ userStats.articles }}</div>
          <div class="stat-label">
            <span class="icon-wrapper"><i class="fas fa-file-alt"></i></span>
            <span>文章</span>
          </div>
        </div>
        <div class="stat-item animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
          <div class="stat-value">{{ userStats.followers }}</div>
          <div class="stat-label">
            <span class="icon-wrapper"><i class="fas fa-users"></i></span>
            <span>粉丝</span>
          </div>
        </div>
        <div class="stat-item animate__animated animate__fadeInUp" style="animation-delay: 0.3s">
          <div class="stat-value">{{ userStats.following }}</div>
          <div class="stat-label">
            <span class="icon-wrapper"><i class="fas fa-user-friends"></i></span>
            <span>关注</span>
          </div>
        </div>
        <div class="stat-item animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
          <div class="stat-value">{{ userStats.likes }}</div>
          <div class="stat-label">
            <span class="icon-wrapper"><i class="fas fa-thumbs-up"></i></span>
            <span>获赞</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 成就与荣誉部分 -->
    <div class="achievements-section">
      <div class="section-header">
        <i class="fas fa-trophy"></i>
        <h3 class="section-title">成就与荣誉</h3>
      </div>
      <div class="achievements-content">
        <div class="certificate-item">
          <div class="certificate-icon gold">
            <i class="fas fa-award"></i>
          </div>
          <div class="certificate-info">
            <div class="certificate-name">优质创作者</div>
            <div class="certificate-org">平台特别认证 · 2023年度</div>
          </div>
          <div class="certificate-badge">
            <i class="fas fa-crown"></i>
          </div>
        </div>
        
        <div class="certificate-item">
          <div class="certificate-icon blue">
            <i class="fas fa-certificate"></i>
          </div>
          <div class="certificate-info">
            <div class="certificate-name">前端开发工程师</div>
            <div class="certificate-org">Vue.js官方认证 · 高级</div>
          </div>
          <div class="certificate-badge">
            <i class="fas fa-check-circle"></i>
          </div>
        </div>
        
        <div class="certificate-item">
          <div class="certificate-icon purple">
            <i class="fas fa-medal"></i>
          </div>
          <div class="certificate-info">
            <div class="certificate-name">年度优秀贡献者</div>
            <div class="certificate-org">GitHub开源社区 · 2022</div>
          </div>
          <div class="certificate-badge">
            <i class="fas fa-star"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'

// 定义组件属性
const props = defineProps({
  // 用户信息对象
  userInfo: {
    type: Object,
    default: () => ({})
  },
  // 用户统计数据
  userStats: {
    type: Object,
    default: () => ({
      articles: 0,
      followers: 0,
      following: 0,
      likes: 0
    })
  },
  // 是否为查看模式（查看其他用户的资料）
  isViewMode: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['edit-profile', 'edit-avatar'])

// 计算用户角色名称
const userRoleName = computed(() => {
  if (props.userInfo && props.userInfo.roles && props.userInfo.roles.length > 0) {
    return props.userInfo.roles[0].name
  }
  return '普通用户'
})

// 判断是否是VIP用户
const isVip = computed(() => {
  if (props.userInfo && props.userInfo.roles) {
    const roleNames = props.userInfo.roles.map((role: any) => role.name.toLowerCase())
    return roleNames.some((name: string) => 
      name.includes('管理员') || 
      name.includes('皇冠') ||
      name.includes('钻石') ||
      name.includes('铂金') ||
      name.includes('黄金') ||
      name.includes('白银') ||
      name.includes('青铜') ||
      name.includes('流光')
    )
  }
  return false
})

// 模拟用户认证状态
const hasVerified = ref(true)

// 模拟活跃状态
const isActive = ref(true)

// 获取用户等级
const getUserLevel = () => {
  // 根据文章数和点赞数计算用户等级
  const articles = props.userStats.articles || 0
  const likes = props.userStats.likes || 0
  
  const score = articles * 5 + likes * 0.5
  
  if (score > 500) return 'Lv.8'
  if (score > 300) return 'Lv.7'
  if (score > 200) return 'Lv.6'
  if (score > 100) return 'Lv.5'
  if (score > 50) return 'Lv.4'
  if (score > 20) return 'Lv.3'
  if (score > 5) return 'Lv.2'
  return 'Lv.1'
}

// 获取加入天数
const getDaysJoined = () => {
  if (!props.userInfo.createTime) return 0
  
  try {
    const createTime = new Date(props.userInfo.createTime)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - createTime.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  } catch (e) {
    return 0
  }
}

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '未知'
  
  // 简单的日期格式化，实际项目中应该使用日期格式化工具
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  } catch (e) {
    return dateStr
  }
}

// 编辑头像
const handleAvatarEdit = () => {
  emit('edit-avatar')
}

// 编辑个人资料
const handleEditProfile = () => {
  emit('edit-profile')
}

// 获取角色标签类名
const getRoleTagClass = () => {
  const roleName = userRoleName.value.toLowerCase()
  
  if (roleName.includes('皇冠')) return 'tag-member-crown'
  if (roleName.includes('钻石')) return 'tag-member-diamond'
  if (roleName.includes('铂金')) return 'tag-member-platinum'
  if (roleName.includes('黄金')) return 'tag-member-gold'
  if (roleName.includes('白银')) return 'tag-member-silver'
  if (roleName.includes('青铜')) return 'tag-member-bronze'
  if (roleName.includes('流光')) return 'tag-premium'
  if (roleName.includes('管理员')) return 'tag-super-admin'
  return 'role-tag' // 默认样式
}
</script>

<style lang="less" scoped>
// 变量定义
@primary-color: #1890ff;
@primary-dark: #096dd9;
@primary-light: #40a9ff;
@primary-bg: #e6f7ff;
@text-color: #333;
@text-secondary: #666;
@text-light: #999;
@border-color: #eaeaea;
@success-color: #52c41a;
@warning-color: #faad14;
@danger-color: #f5222d;
@card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
@transition-time: 0.3s;

// 图标包装
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
}

// 卡片主容器
.person-info-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: @card-shadow;
  margin-bottom: 0;
  animation-duration: 0.8s;
  position: relative;
  
  // 卡片头部
  .card-header {
    position: relative;
    height: 80px;
    

    
    .profile-stats {
      position: absolute;
      top: 15px;
      right: 15px;
      display: flex;
      gap: 10px;
      z-index: 1;
      
      .stat-pill {
        background: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(5px);
        border-radius: 20px;
        padding: 4px 12px;
        display: flex;
        align-items: center;
        color: white;
        font-size: 13px;
        font-weight: 500;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
        
        &:hover {
          transform: translateY(-2px);
          background: rgba(255, 255, 255, 0.3);
        }
        
        .icon-wrapper {
          font-size: 12px;
          margin-right: 6px;
        }
      }
    }
  }
  
  // 卡片主体
  .card-body {
    padding: 0 20px 20px;
    position: relative;
    
    // 头像区域
    .avatar-section {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin-bottom: 20px;
      
      .avatar-container {
        position: relative;
        margin-top: -45px;
        z-index: 2;
        
        .avatar-frame {
          position: relative;
          
          .user-avatar {
            border: 4px solid white;
            box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            background: linear-gradient(135deg, #1890ff, #096dd9);
            color: white;
            font-weight: bold;
            font-size: 36px;
            transition: all 0.3s ease;
            
            &:hover {
              transform: scale(1.05);
              box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
            }
          }
          

        }
        
        .edit-avatar-btn {
          position: absolute;
          bottom: 5px;
          right: 0;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: @primary-color;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
          
          &:hover {
            background: @primary-dark;
            transform: scale(1.1);
          }
        }
      }
      
      .user-badges {
        display: flex;
        gap: 8px;
        
        .badge-item {
          position: relative;
          
          .badge-icon {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-size: 12px;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            cursor: pointer;
            transition: all 0.3s;
            
            &:hover {
              transform: translateY(-3px);
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
            }
            
            &.gold {
              background: linear-gradient(135deg, #f9d423, #e65c00);
            }
            
            &.blue {
              background: linear-gradient(135deg, #1890ff, #096dd9);
            }
            
            &.purple {
              background: linear-gradient(135deg, #a259ff, #6a82fb);
            }
          }
          
          .badge-tooltip {
            position: absolute;
            top: -30px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 12px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s;
          }
          
          &:hover .badge-tooltip {
            opacity: 1;
            visibility: visible;
          }
        }
      }
    }
    
    // 用户信息
    .user-info {
      .username {
        font-size: 16px;
        margin: 0 0 8px;
        display: flex;
        align-items: center;
       
        // 添加通用标签样式
        [class*="tag-member"] {
          margin-left: 8px;
        }
      }
      
      .user-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 12px;
        color: @text-secondary;
        font-size: 14px;
        
        .meta-item {
          display: flex;
          align-items: center;
          
          .icon-wrapper {
            color: @primary-light;
          }
        }
      }
      
      .user-bio {
        color: @text-secondary;
        font-size: 14px;
        line-height: 1.6;
        margin-bottom: 16px;
        padding: 10px;
        background: #f9f9f9;
        border-radius: 8px;
        border-left: 3px solid @primary-light;
        
        p {
          margin: 0;
        }
      }
      
      .user-actions {
        display: flex;
        gap: 12px;
        
        .action-btn {
          display: flex;
          align-items: center;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
          border: none;
          
          &.primary {
            background: linear-gradient(135deg, #1890ff, #096dd9);
            color: white;
            box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 10px rgba(24, 144, 255, 0.3);
            }
          }
          
          &.secondary {
            background: #f0f0f0;
            color: @text-secondary;
            
            &:hover {
              background: #e0e0e0;
              transform: translateY(-2px);
            }
          }
        }
      }
    }
  }
  
  // 卡片底部
  .card-footer {
    padding: 0 20px 20px;
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      
      .stat-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 10px 5px;
        border-radius: 10px;
        background: #f5f7fa;
        transition: all 0.3s;
        position: relative;
        overflow: hidden;
        border: 1px solid rgba(0, 0, 0, 0.03);
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, rgba(24, 144, 255, 0.05), rgba(24, 144, 255, 0));
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        &:hover {
          background: #edf4ff;
          transform: translateY(-3px);
          box-shadow: 0 6px 15px rgba(24, 144, 255, 0.1);
          border-color: rgba(24, 144, 255, 0.1);
          
          &::before {
            opacity: 1;
          }
          
          .stat-value {
            transform: scale(1.1);
            color: @primary-dark;
          }
          
          .stat-label {
            color: @primary-dark;
            
            .icon-wrapper {
              transform: rotate(-10deg);
            }
          }
        }
        
        .stat-value {
          font-size: 18px;
          font-weight: 600;
          color: @primary-color;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          margin-bottom: 2px;
          position: relative;
          
          &::after {
            content: '';
            position: absolute;
            bottom: -3px;
            left: 50%;
            transform: translateX(-50%);
            width: 12px;
            height: 2px;
            background: linear-gradient(to right, @primary-color, transparent);
            opacity: 0.7;
          }
        }
        
        .stat-label {
          font-size: 11px;
          color: @text-secondary;
          margin-top: 2px;
          display: flex;
          align-items: center;
          white-space: nowrap;
          transition: all 0.3s;
          
          .icon-wrapper {
            font-size: 10px;
            color: @primary-light;
            transition: all 0.3s;
          }
        }
      }
    }
  }
  
  // 成就与荣誉部分
  .achievements-section {
    padding: 15px;
    border-top: 1px solid rgba(0, 0, 0, 0.05);
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.9));
    
    .section-header {
      display: flex;
      align-items: center;
      margin-bottom: 15px;
      
      i {
        color: #ffd700;
        font-size: 16px;
        margin-right: 8px;
        filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
      }
      
      .section-title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: @text-color;
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -4px;
          left: 0;
          width: 30px;
          height: 2px;
          background: linear-gradient(to right, #ffd700, transparent);
        }
      }
    }
    
    .achievements-content {
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    
    .certificate-item {
      display: flex;
      align-items: center;
      padding: 10px;
      border-radius: 10px;
      background-color: rgba(255, 255, 255, 0.7);
      transition: all 0.3s;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
      position: relative;
      overflow: hidden;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.06);
        
        .certificate-badge i {
          transform: rotate(15deg) scale(1.1);
        }
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 60px;
        height: 60px;
        background: radial-gradient(circle at top right, rgba(0, 0, 0, 0.02), transparent 70%);
      }
      
      .certificate-icon {
        width: 36px;
        height: 36px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 12px;
        flex-shrink: 0;
        box-shadow: 0 3px 6px rgba(0, 0, 0, 0.12);
        position: relative;
        z-index: 1;
        font-size: 14px;
        color: white;
        
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 50%;
          background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
          border-radius: 50% 50% 0 0;
        }
        
        &.gold {
          background: linear-gradient(135deg, #ffd700, #ff9d00);
        }
        
        &.blue {
          background: linear-gradient(135deg, #1890ff, #096dd9);
        }
        
        &.purple {
          background: linear-gradient(135deg, #722ed1, #531dab);
        }
      }
      
      .certificate-info {
        flex: 1;
        min-width: 0;
        
        .certificate-name {
          font-weight: 600;
          font-size: 13px;
          color: @text-color;
          margin-bottom: 2px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        
        .certificate-org {
          font-size: 11px;
          color: @text-secondary;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
      
      .certificate-badge {
        width: 22px;
        height: 22px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        margin-left: 8px;
        flex-shrink: 0;
        color: #ffd700;
        
        i {
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
          transition: all 0.3s;
        }
      }
    }
  }
}

@keyframes pulse {
  0% {
    opacity: 0.6;
  }
  50% {
    opacity: 0.8;
  }
  100% {
    opacity: 0.6;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .person-info-card {
    .card-body {
      .avatar-section {
        .avatar-container {
          .avatar-frame {
            .user-avatar {
              width: 80px !important;
              height: 80px !important;
              font-size: 32px !important;
            }
          }
        }
      }
    }
    
    .card-footer {
      .stats-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }
}
</style> 
}
