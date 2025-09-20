<template>
  <div class="notice-card">
    <!-- 统一的卡片头部样式 -->
    <div class="card-header">
      <i class="fas fa-bullhorn"></i>
      <span>网站公告</span>
    </div>
    
    <!-- 公告列表 -->
    <div class="card-body">
      <div class="notice-list" v-if="notices.length > 0">
        <div 
          class="notice-item" 
          v-for="(notice, index) in notices" 
          :key="notice.id"
          :class="notice.type"
        >
          <!-- 左上角角标 -->
          <div class="notice-corner-badge" v-if="notice.isNew">
            NEW
          </div>
          
          <!-- 精美的左侧图标 -->
          <div class="notice-icon-wrapper">
            <div class="notice-icon" :class="notice.type">
              <i :class="getNoticeIcon(notice.type)"></i>
            </div>
          </div>
          
          <!-- 主要内容 -->
          <div class="notice-content">
            <div class="notice-header">
              <div class="notice-title">{{ notice.title }}</div>
              <div class="notice-badges">
                <span class="notice-type-badge" :class="notice.type">
                  {{ getNoticeTypeText(notice.type) }}
                </span>
              </div>
            </div>
            <div class="notice-desc">{{ notice.content }}</div>
            <div class="notice-footer">
              <span class="notice-date">
                <i class="fas fa-clock"></i>
                {{ formatDate(notice.date) }}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div class="notice-empty" v-else>
        <div class="empty-icon-wrapper">
          <i class="fas fa-bell-slash empty-icon"></i>
        </div>
        <p class="empty-text">暂无公告</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// 公告类型枚举
type NoticeType = 'important' | 'maintenance' | 'activity' | 'update' | 'info'

// 公告数据接口
interface Notice {
  id: number
  type: NoticeType
  title: string
  content: string
  date: string
  isNew?: boolean
}

// 公告数据 - 实际项目中这里会从API获取
const notices = ref<Notice[]>([
  {
    id: 1,
    type: 'important',
    title: '网站升级完成',
    content: '新增了搜索功能和评论系统，提升用户体验',
    date: '2024-01-15',
    isNew: true
  },
  {
    id: 2,
    type: 'activity',
    title: '新年活动开启',
    content: '参与评论互动，有机会获得精美礼品',
    date: '2024-01-10'
  },
  {
    id: 3,
    type: 'maintenance',
    title: '系统维护通知',
    content: '1月20日凌晨2-4点进行系统维护，期间可能无法访问',
    date: '2024-01-08'
  }
])

// 获取公告图标
const getNoticeIcon = (type: NoticeType): string => {
  const iconMap = {
    important: 'fas fa-exclamation-triangle',
    maintenance: 'fas fa-tools',
    activity: 'fas fa-gift',
    update: 'fas fa-sync-alt',
    info: 'fas fa-info-circle'
  }
  return iconMap[type] || 'fas fa-info-circle'
}

// 获取公告类型文字
const getNoticeTypeText = (type: NoticeType): string => {
  const textMap = {
    important: '重要',
    maintenance: '维护',
    activity: '活动',
    update: '更新',
    info: '通知'
  }
  return textMap[type] || '通知'
}

// 格式化日期
const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr)
  const now = new Date()
  const diffTime = now.getTime() - date.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return '昨天'
  if (diffDays === 0) return '今天'
  if (diffDays <= 7) return `${diffDays}天前`
  
  return date.toLocaleDateString('zh-CN', { 
    month: 'numeric', 
    day: 'numeric' 
  })
}
</script>

<style lang="less" scoped>
// 精美的网站公告卡片 - 参考AboutSiteCard的设计风格
.notice-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  animation: fadeIn 0.6s ease-out;
  overflow: hidden;
}

// 统一的卡片头部样式 - 与AboutSiteCard保持一致
.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  background: var(--el-fill-color-extra-light);
  border-bottom: 1px solid var(--el-border-color-extra-light);
  border-radius: 8px 8px 0 0;
  
  i {
    color: var(--el-color-primary);
    font-size: 14px;
  }
  
  span {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }
}

.card-body {
  padding: 16px;
  overflow: hidden;
}

// 公告列表
.notice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  
  .notice-item {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: var(--el-fill-color-extra-light);
    border-radius: 8px;
    border: 1px solid transparent;
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    position: relative;
    overflow: hidden;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.1), transparent);
      transition: left 0.6s ease;
    }
    
      &:hover {
        background: rgba(64, 158, 255, 0.05);
        border-color: rgba(64, 158, 255, 0.3);
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 8px 20px rgba(64, 158, 255, 0.15), 0 2px 6px rgba(64, 158, 255, 0.1);
        
        &::before {
          left: 100%;
        }
        
        .notice-icon {
          transform: scale(1.1) translateY(-2px);
          
          i {
            animation: gentlePulse 0.6s ease-in-out;
            transform: scale(1.1);
          }
          
          &.important {
            box-shadow: 0 6px 16px rgba(239, 68, 68, 0.4), 0 0 0 1px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          
          &.maintenance {
            box-shadow: 0 6px 16px rgba(249, 115, 22, 0.4), 0 0 0 1px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          
          &.activity {
            box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          
          &.update {
            box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
          
          &.info {
            box-shadow: 0 6px 16px rgba(99, 102, 241, 0.4), 0 0 0 1px rgba(99, 102, 241, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          }
        }
        
        .notice-title {
          color: var(--el-color-primary);
          text-shadow: 0 1px 3px rgba(64, 158, 255, 0.2);
          transform: translateX(2px);
        }
      }
    
    // 左上角角标
    .notice-corner-badge {
      position: absolute;
      top: -1px;
      left: -1px;
      background: #ef4444;
      color: white;
      font-size: 8px;
      font-weight: 700;
      padding: 2px 6px;
      border-radius: 0 0 8px 0;
      line-height: 1.2;
      z-index: 10;
      // 确保文字清晰
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      text-rendering: optimizeLegibility;
      font-family: 'SF Pro Text', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      
      // 角标阴影效果
      &::after {
        content: '';
        position: absolute;
        bottom: -4px;
        left: 0;
        width: 0;
        height: 0;
        border-left: 4px solid #dc2626;
        border-bottom: 4px solid transparent;
      }
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: -4px;
        width: 0;
        height: 0;
        border-top: 4px solid #dc2626;
        border-right: 4px solid transparent;
      }
    }
    
    // 精美的左侧图标
    .notice-icon-wrapper {
      flex-shrink: 0;
      position: relative;
      z-index: 2;
      
      .notice-icon {
        width: 36px;
        height: 36px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px;
        color: white;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        
        i {
          transition: all 0.3s ease;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
        }
        
        &.important {
          background: linear-gradient(135deg, #ef4444, #dc2626);
          box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
        }
        
        &.maintenance {
          background: linear-gradient(135deg, #f97316, #ea580c);
          box-shadow: 0 4px 12px rgba(249, 115, 22, 0.3);
        }
        
        &.activity {
          background: linear-gradient(135deg, #10b981, #059669);
          box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
        }
        
        &.update {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }
        
        &.info {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
          box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
        }
      }
    }
    
    // 公告内容
    .notice-content {
      flex: 1;
      min-width: 0;
      position: relative;
      z-index: 2;
      
      .notice-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        gap: 12px;
        
        .notice-title {
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          line-height: 1.4;
          flex: 1;
          font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          transition: all 0.3s ease;
          // 确保文字清晰
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        .notice-badges {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          
          .notice-type-badge {
            font-size: 10px;
            padding: 3px 8px;
            border-radius: 4px;
            font-weight: 500;
            line-height: 1;
            font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            transition: all 0.3s ease;
            // 确保文字清晰
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
            
            &.important {
              background: rgba(239, 68, 68, 0.15);
              color: #dc2626;
              border: 1px solid rgba(239, 68, 68, 0.2);
            }
            
            &.maintenance {
              background: rgba(249, 115, 22, 0.15);
              color: #ea580c;
              border: 1px solid rgba(249, 115, 22, 0.2);
            }
            
            &.activity {
              background: rgba(16, 185, 129, 0.15);
              color: #059669;
              border: 1px solid rgba(16, 185, 129, 0.2);
            }
            
            &.update {
              background: rgba(59, 130, 246, 0.15);
              color: #2563eb;
              border: 1px solid rgba(59, 130, 246, 0.2);
            }
            
            &.info {
              background: rgba(99, 102, 241, 0.15);
              color: #4f46e5;
              border: 1px solid rgba(99, 102, 241, 0.2);
            }
          }
          
        }
      }
      
      .notice-desc {
        font-size: 12px;
        color: var(--el-text-color-regular);
        line-height: 1.6;
        margin-bottom: 12px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
        font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        // 确保文字清晰
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      
      .notice-footer {
        .notice-date {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: var(--el-text-color-secondary);
          font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          // 确保文字清晰
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          
          i {
            font-size: 9px;
            opacity: 0.8;
          }
        }
      }
    }
  }
}

// 精美的空状态
.notice-empty {
  text-align: center;
  padding: 40px 20px;
  color: var(--el-text-color-secondary);
  
  .empty-icon-wrapper {
    margin-bottom: 12px;
    
    .empty-icon {
      font-size: 32px;
      color: var(--el-text-color-disabled);
      opacity: 0.6;
      animation: gentleBounce 3s infinite;
    }
  }
  
  .empty-text {
    font-size: 13px;
    margin: 0;
    font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    // 确保文字清晰
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
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

@keyframes gentlePulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(0.95);
  }
}

@keyframes gentleBounce {
  0%, 20%, 50%, 80%, 100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-2px);
  }
  60% {
    transform: translateY(-1px);
  }
}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1) rotate(0deg);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.2) rotate(180deg);
  }
}

// 暗色模式适配 - 参考AboutSiteCard的风格
html.dark .notice-card {
  border-color: var(--el-border-color-dark);
  
  .card-header {
    background: var(--el-fill-color-dark);
    border-bottom-color: var(--el-border-color-darker);
    
    i {
      color: var(--el-color-primary);
    }
  }
  
  .notice-item {
    background: var(--el-fill-color-dark);
    
    &:hover {
      background: rgba(64, 158, 255, 0.08);
      border-color: rgba(64, 158, 255, 0.4);
      box-shadow: 0 8px 20px rgba(64, 158, 255, 0.25), 0 2px 6px rgba(64, 158, 255, 0.15);
      
      .notice-icon {
        &.important {
          box-shadow: 0 6px 16px rgba(239, 68, 68, 0.5), 0 0 0 1px rgba(239, 68, 68, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        &.maintenance {
          box-shadow: 0 6px 16px rgba(249, 115, 22, 0.5), 0 0 0 1px rgba(249, 115, 22, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        &.activity {
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.5), 0 0 0 1px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        &.update {
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.5), 0 0 0 1px rgba(59, 130, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        &.info {
          box-shadow: 0 6px 16px rgba(99, 102, 241, 0.5), 0 0 0 1px rgba(99, 102, 241, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
      }
    }
    
    &::before {
      background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.15), transparent);
    }
  }
}
</style>
