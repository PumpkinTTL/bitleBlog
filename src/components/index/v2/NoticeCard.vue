<template>
  <div class="sidebar-card notice-card">
    <!-- 标题区域 -->
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
          <div class="notice-icon">
            <i :class="getNoticeIcon(notice.type)"></i>
          </div>
          <div class="notice-content">
            <div class="notice-header">
              <div class="notice-title">{{ notice.title }}</div>
              <div class="notice-type-badge" :class="notice.type">
                {{ getNoticeTypeText(notice.type) }}
              </div>
            </div>
            <div class="notice-desc">{{ notice.content }}</div>
            <div class="notice-footer">
              <span class="notice-date">
                <i class="fas fa-clock"></i>
                {{ formatDate(notice.date) }}
              </span>
              <span class="notice-status" v-if="notice.isNew">
                <i class="fas fa-sparkles"></i>
                新
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 空状态 -->
      <div class="empty-state" v-else>
        <p>暂无公告信息</p>
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
// 公告卡片
.notice-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(255, 193, 7, 0.3);
  }
  
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
      color: #f59e0b;
      font-size: 13px;
    }
    
    span {
      font-size: 13px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
    }
  }
  
  .card-body {
    padding: 16px;
    
    .notice-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
      
      .notice-item {
        display: flex;
        gap: 12px;
        padding: 14px;
        background: var(--el-fill-color-extra-light);
        border-radius: 8px;
        transition: all 0.3s ease;
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 0;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2));
          transition: width 0.3s ease;
        }
        
        &:hover {
          background: var(--el-fill-color-light);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          
          &::before {
            width: 100%;
          }
          
          .notice-icon {
            transform: scale(1.1);
          }
        }
        
        .notice-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          color: white;
          flex-shrink: 0;
          margin-top: 1px;
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
          transition: transform 0.3s ease;
        }
        
        &.important .notice-icon {
          background: linear-gradient(135deg, #ef4444, #dc2626);
        }
        
        &.maintenance .notice-icon {
          background: linear-gradient(135deg, #f97316, #ea580c);
        }
        
        &.activity .notice-icon {
          background: linear-gradient(135deg, #10b981, #059669);
        }
        
        &.update .notice-icon {
          background: linear-gradient(135deg, #3b82f6, #2563eb);
        }
        
        &.info .notice-icon {
          background: linear-gradient(135deg, #6366f1, #4f46e5);
        }
        
        .notice-content {
          flex: 1;
          min-width: 0;
          
          .notice-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 4px;
            gap: 8px;
            
            .notice-title {
              font-size: 13px;
              font-weight: 600;
              color: var(--el-text-color-primary);
              line-height: 1.3;
              flex: 1;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            }
            
            .notice-type-badge {
              font-size: 11px;
              padding: 4px 10px;
              border-radius: 4px;
              font-weight: 500;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
              white-space: nowrap;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              line-height: 1;
              
              &.important {
                background: rgba(239, 68, 68, 0.1);
                color: #dc2626;
              }
              
              &.maintenance {
                background: rgba(249, 115, 22, 0.1);
                color: #ea580c;
              }
              
              &.activity {
                background: rgba(16, 185, 129, 0.1);
                color: #059669;
              }
              
              &.update {
                background: rgba(59, 130, 246, 0.1);
                color: #2563eb;
              }
              
              &.info {
                background: rgba(99, 102, 241, 0.1);
                color: #4f46e5;
              }
            }
          }
          
          .notice-desc {
            font-size: 12px;
            color: var(--el-text-color-regular);
            line-height: 1.4;
            margin-bottom: 10px;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
          }
          
          .notice-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            
            .notice-date {
              font-size: 10px;
              color: var(--el-text-color-secondary);
              display: flex;
              align-items: center;
              gap: 4px;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
              
              i {
                font-size: 9px;
                opacity: 0.7;
              }
            }
            
            .notice-status {
              font-size: 11px;
              padding: 4px 8px;
              border-radius: 4px;
              background: #ef4444;
              color: white;
              font-weight: 600;
              display: inline-flex;
              align-items: center;
              justify-content: center;
              gap: 3px;
              box-shadow: 0 2px 4px rgba(239, 68, 68, 0.25);
              line-height: 1;
              
              i {
                font-size: 10px;
              }
            }
          }
        }
      }
    }
    
    .empty-state {
      text-align: center;
      padding: 20px 0;
      color: var(--el-text-color-secondary);
      
      p {
        font-size: 12px;
        margin: 0;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
      }
    }
  }
}

// 动画效果
// pulse 动画已移除，避免模糊效果

// 暗色模式适配
html.dark & {
  .notice-card {
    .notice-item {
      &::before {
        background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1));
      }
      
      &:hover {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
      }
    }
  }
}
</style>
