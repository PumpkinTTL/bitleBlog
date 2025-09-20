<template>
  <div class="live-stats-card">
    <!-- 统一的卡片头部样式 -->
    <div class="card-header">
      <i class="fas fa-chart-line"></i>
      <span>实时统计</span>
      <div class="live-indicator">
        <div class="pulse-dot"></div>
        <span>LIVE</span>
      </div>
    </div>
    
    <!-- 统计数据 -->
    <div class="card-body">
      <!-- 主要统计数据 -->
      <div class="primary-stats">
        <div class="stat-item large">
          <div class="stat-icon online">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-data">
            <div class="stat-number">{{ currentStats.onlineUsers }}</div>
            <div class="stat-label">在线用户</div>
          </div>
        </div>
        
        <div class="stat-item large">
          <div class="stat-icon views">
            <i class="fas fa-eye"></i>
          </div>
          <div class="stat-data">
            <div class="stat-number">{{ currentStats.todayViews }}</div>
            <div class="stat-label">今日访问</div>
          </div>
        </div>
      </div>
      
      <!-- 次要统计数据 -->
      <div class="secondary-stats">
        <div class="stat-row">
          <div class="stat-item small">
            <i class="fas fa-thumbs-up"></i>
            <span class="stat-label">今日点赞</span>
            <span class="stat-number">{{ currentStats.todayLikes }}</span>
          </div>
        </div>
        
        <div class="stat-row">
          <div class="stat-item small">
            <i class="fas fa-comments"></i>
            <span class="stat-label">今日评论</span>
            <span class="stat-number">{{ currentStats.todayComments }}</span>
          </div>
        </div>
        
        <div class="stat-row">
          <div class="stat-item small">
            <i class="fas fa-share-alt"></i>
            <span class="stat-label">今日分享</span>
            <span class="stat-number">{{ currentStats.todayShares }}</span>
          </div>
        </div>
      </div>
      
      <!-- 趋势指示 -->
      <div class="trend-section">
        <div class="trend-title">
          <i class="fas fa-trending-up"></i>
          <span>与昨日相比</span>
        </div>
        <div class="trend-items">
          <div 
            v-for="trend in trends" 
            :key="trend.key"
            class="trend-item"
            :class="trend.isUp ? 'trend-up' : 'trend-down'"
          >
            <i :class="trend.isUp ? 'fas fa-arrow-up' : 'fas fa-arrow-down'"></i>
            <span class="trend-label">{{ trend.label }}</span>
            <span class="trend-value">{{ trend.change }}%</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

// 统计数据类型定义
interface LiveStats {
  onlineUsers: number
  todayViews: number
  todayLikes: number
  todayComments: number
  todayShares: number
}

interface TrendItem {
  key: string
  label: string
  change: number
  isUp: boolean
}

// 当前统计数据
const currentStats = ref<LiveStats>({
  onlineUsers: 24,
  todayViews: 1847,
  todayLikes: 156,
  todayComments: 43,
  todayShares: 28
})

// 趋势数据
const trends = ref<TrendItem[]>([
  { key: 'views', label: '访问量', change: 12.5, isUp: true },
  { key: 'likes', label: '点赞数', change: 8.3, isUp: true },
  { key: 'comments', label: '评论数', change: -2.1, isUp: false }
])

// 定时器ID
let updateTimer: number | null = null

// 模拟实时数据更新
const updateStats = () => {
  // 模拟在线用户数波动 (20-30)
  const baseOnline = 24
  const variation = Math.floor(Math.random() * 7) - 3
  currentStats.value.onlineUsers = Math.max(20, Math.min(30, baseOnline + variation))
  
  // 模拟今日访问量缓慢增长
  if (Math.random() > 0.7) {
    currentStats.value.todayViews += Math.floor(Math.random() * 3) + 1
  }
  
  // 偶尔增加点赞和评论
  if (Math.random() > 0.8) {
    currentStats.value.todayLikes += 1
  }
  
  if (Math.random() > 0.9) {
    currentStats.value.todayComments += 1
  }
  
  if (Math.random() > 0.95) {
    currentStats.value.todayShares += 1
  }
}

// 格式化数字显示
const formatNumber = (num: number): string => {
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k'
  }
  return num.toString()
}

// 组件挂载时启动定时器
onMounted(() => {
  updateTimer = window.setInterval(updateStats, 5000) // 每5秒更新一次
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (updateTimer) {
    clearInterval(updateTimer)
  }
})
</script>

<style lang="less" scoped>
// 实时统计卡片 - 与其他卡片保持一致的风格
.live-stats-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  animation: fadeIn 0.6s ease-out;
  overflow: hidden;
}

// 统一的卡片头部样式
.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px 16px;
  background: var(--el-fill-color-extra-light);
  border-bottom: 1px solid var(--el-border-color-extra-light);
  border-radius: 8px 8px 0 0;
  position: relative;
  
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
  
  .live-indicator {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 9px;
    font-weight: 700;
    color: #ef4444;
    letter-spacing: 0.5px;
    
    .pulse-dot {
      width: 6px;
      height: 6px;
      background: #ef4444;
      border-radius: 50%;
      animation: pulse 1.5s ease-in-out infinite;
    }
  }
}

.card-body {
  padding: 16px;
  overflow: hidden;
}

// 主要统计数据
.primary-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  margin-bottom: 16px;
  
  .stat-item.large {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px;
    background: var(--el-fill-color-extra-light);
    border: 1px solid transparent;
    border-radius: 8px;
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
      transform: translateY(-2px) scale(1.02);
      box-shadow: 0 6px 16px rgba(64, 158, 255, 0.15), 0 2px 6px rgba(64, 158, 255, 0.1);
      
      &::before {
        left: 100%;
      }
      
      .stat-icon {
        transform: scale(1.1);
        
        &.online {
          box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4), 0 0 0 1px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
        
        &.views {
          box-shadow: 0 6px 16px rgba(59, 130, 246, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
      }
      
      .stat-number {
        color: var(--el-color-primary);
        text-shadow: 0 1px 3px rgba(64, 158, 255, 0.2);
      }
    }
    
    .stat-icon {
      width: 32px;
      height: 32px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: white;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      flex-shrink: 0;
      
      &.online {
        background: linear-gradient(135deg, #10b981, #059669);
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
      }
      
      &.views {
        background: linear-gradient(135deg, #3b82f6, #2563eb);
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
      }
    }
    
    .stat-data {
      flex: 1;
      min-width: 0;
      
      .stat-number {
        font-size: 16px;
        font-weight: 700;
        color: var(--el-text-color-primary);
        line-height: 1.2;
        margin-bottom: 2px;
        font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, sans-serif;
        transition: all 0.3s ease;
      }
      
      .stat-label {
        font-size: 11px;
        color: var(--el-text-color-secondary);
        font-weight: 500;
      }
    }
  }
}

// 次要统计数据
.secondary-stats {
  margin-bottom: 16px;
  
  .stat-row {
    padding: 8px 12px;
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover {
      background: var(--el-fill-color-extra-light);
    }
    
    .stat-item.small {
      display: flex;
      align-items: center;
      gap: 8px;
      
      i {
        width: 16px;
        font-size: 11px;
        color: var(--el-color-primary);
        opacity: 0.8;
      }
      
      .stat-label {
        font-size: 11px;
        color: var(--el-text-color-regular);
        flex: 1;
      }
      
      .stat-number {
        font-size: 12px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }
}

// 趋势部分
.trend-section {
  border-top: 1px solid var(--el-border-color-extra-light);
  padding-top: 12px;
  
  .trend-title {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 8px;
    
    i {
      font-size: 10px;
      color: var(--el-color-primary);
    }
    
    span {
      font-size: 11px;
      color: var(--el-text-color-secondary);
      font-weight: 500;
    }
  }
  
  .trend-items {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .trend-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 8px;
      border-radius: 4px;
      transition: all 0.3s ease;
      
      &:hover {
        background: var(--el-fill-color-extra-light);
      }
      
      i {
        width: 12px;
        font-size: 9px;
      }
      
      .trend-label {
        font-size: 10px;
        color: var(--el-text-color-regular);
        flex: 1;
      }
      
      .trend-value {
        font-size: 10px;
        font-weight: 600;
      }
      
      &.trend-up {
        i, .trend-value {
          color: #10b981;
        }
      }
      
      &.trend-down {
        i, .trend-value {
          color: #ef4444;
        }
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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

// 暗色模式适配
html.dark .live-stats-card {
  border-color: var(--el-border-color-dark);
  
  .card-header {
    background: var(--el-fill-color-dark);
    border-bottom-color: var(--el-border-color-darker);
    
    i {
      color: var(--el-color-primary);
    }
  }
  
  .stat-item.large {
    background: var(--el-fill-color-dark);
    
    &:hover {
      background: rgba(64, 158, 255, 0.08);
      border-color: rgba(64, 158, 255, 0.4);
      box-shadow: 0 6px 16px rgba(64, 158, 255, 0.25), 0 2px 6px rgba(64, 158, 255, 0.15);
    }
    
    &::before {
      background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.15), transparent);
    }
  }
  
  .trend-section {
    border-top-color: var(--el-border-color-darker);
  }
}
</style>
