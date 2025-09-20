<template>
  <div class="about-site-card">
    <!-- 统一的卡片头部样式 -->
    <div class="card-header">
      <i class="fas fa-info-circle"></i>
      <span>关于本站</span>
    </div>
    
    <!-- 站点信息 -->
    <div class="card-body">
      <div class="site-info">
        <div class="site-brand">
          <div class="brand-logo">
            <i class="fas fa-layer-group"></i>
          </div>
          <div class="brand-content">
            <div class="site-title">知识棱镜</div>
            <div class="site-tagline">探索 · 学习 · 成长</div>
          </div>
          <div class="site-status">
            <i class="status-dot"></i>
            <span>运行中</span>
          </div>
        </div>
      </div>
      
      <!-- 统计数据 -->
      <div class="stats-section">
        <div class="stats-grid">
          <div 
            v-for="(stat, index) in siteStats" 
            :key="stat.key"
            class="stat-item"
            :class="stat.key"
          >
            <div class="stat-icon">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-data">
              <div class="stat-number">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 简洁的描述 -->
      <div class="description-section">
        <p class="description-text">
          专注分享 Web 开发技术、实用经验和深度思考的独立博客
        </p>
        <div class="tech-tags">
          <span 
            class="tech-tag" 
            v-for="tech in techStack" 
            :key="tech.name"
            :style="{ color: tech.color, backgroundColor: tech.bgColor, borderColor: tech.color + '30' }"
          >
            {{ tech.name }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// 站点统计数据
const siteStats = ref([
  {
    key: 'articles',
    icon: 'fas fa-file-text',
    value: '285',
    label: '文章'
  },
  {
    key: 'categories', 
    icon: 'fas fa-folder-open',
    value: '16',
    label: '分类'
  },
  {
    key: 'views',
    icon: 'fas fa-eye',
    value: '38.6k',
    label: '阅读'
  },
  {
    key: 'likes',
    icon: 'fas fa-thumbs-up',
    value: '2.1k',
    label: '点赞'
  }
])

// 技术栈标签
const techStack = ref([
  { name: '编程', color: '#4fc08d', bgColor: 'rgba(79, 192, 141, 0.1)' },
  { name: '互联网', color: '#3178c6', bgColor: 'rgba(49, 120, 198, 0.1)' },
  { name: '生活', color: '#646cff', bgColor: 'rgba(100, 108, 255, 0.1)' },
  { name: '加密货币', color: '#409eff', bgColor: 'rgba(64, 158, 255, 0.1)' }
])
</script>

<style lang="less" scoped>
// 统一风格的关于本站卡片
.about-site-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
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
  
  i {
    color: #409eff;
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
  
  // 确保内容不会溢出
  overflow: hidden;
}

// 站点信息区域
.site-info {
  margin-bottom: 16px;
  
    .site-brand {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px;
      background: var(--el-fill-color-extra-light);
      border-radius: 6px;
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
        background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.1), transparent);
        transition: left 0.6s ease;
      }
      
      &:hover {
        background: rgba(64, 158, 255, 0.05);
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);
        
        &::before {
          left: 100%;
        }
        
        .brand-logo {
          transform: scale(1.1) translateY(-2px);
          box-shadow: 0 6px 16px rgba(64, 158, 255, 0.35), 0 0 0 1px rgba(64, 158, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
          
          i {
            animation: gentlePulse 0.6s ease-in-out;
            text-shadow: 0 1px 3px rgba(64, 158, 255, 0.3);
            transform: scale(1.1);
          }
        }
        
        .site-title {
          color: var(--el-color-primary);
          text-shadow: 0 1px 3px rgba(64, 158, 255, 0.2);
          transform: translateX(2px);
        }
        
        .site-tagline {
          color: rgba(64, 158, 255, 0.8);
          transform: translateX(2px);
        }
      }
      
        .brand-logo {
          width: 36px;
          height: 36px;
          background: linear-gradient(135deg, #409eff, #3b82f6);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 16px;
          flex-shrink: 0;
          transition: transform 0.3s ease;
          box-shadow: 0 2px 6px rgba(64, 158, 255, 0.3);
          position: relative;
          z-index: 2;
          
          // 确保图标居中且颜色清晰
          i {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 100%;
            height: 100%;
            color: white;
            text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
          }
        }
    
      .brand-content {
        flex: 1;
        min-width: 0;
        position: relative;
        z-index: 2;
        
          .site-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 2px;
            line-height: 1.3;
            transition: color 0.3s ease;
            font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          }
        
        .site-tagline {
          font-size: 11px;
          color: var(--el-text-color-regular);
          font-weight: 500;
          transition: color 0.3s ease;
          font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
      }
    
          .site-status {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
            color: var(--el-text-color-secondary);
            font-weight: 500;
            position: relative;
            z-index: 2;
            
            .status-dot {
              width: 6px;
              height: 6px;
              background: #52c41a;
              border-radius: 50%;
              animation: statusPulse 2s infinite;
              box-shadow: 0 0 0 2px rgba(82, 196, 26, 0.2);
              flex-shrink: 0;
            }
          }
  }
}

// 统计数据区域 - 重写修复
.stats-section {
  margin-bottom: 16px;
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
    
    .stat-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      background: var(--el-fill-color-extra-light);
      border-radius: 6px;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      
      &:hover {
        background: var(--el-fill-color-light);
        transform: translateY(-3px) scale(1.02);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1), 0 2px 6px rgba(0, 0, 0, 0.05);
        
        .stat-number {
          color: var(--el-color-primary);
        }
      }
      
      .stat-icon {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 13px;
        flex-shrink: 0;
        transition: all 0.3s ease;
        background: var(--el-fill-color-extra-light);
        border: 1px solid var(--el-border-color-lighter);
        
        i {
          transition: all 0.3s ease;
          font-weight: 600;
        }
      }
      
      .stat-data {
        flex: 1;
        min-width: 0;
        
        .stat-number {
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          line-height: 1.2;
          margin-bottom: 2px;
          font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, sans-serif;
          transition: color 0.3s ease;
        }
        
        .stat-label {
          font-size: 11px;
          color: var(--el-text-color-secondary);
          font-weight: 500;
          line-height: 1.2;
          transition: color 0.3s ease;
        }
      }
    }
    
    // 常态下的淡色图标
    .stat-item.articles .stat-icon i { color: rgba(59, 130, 246, 0.7) !important; }
    .stat-item.categories .stat-icon i { color: rgba(16, 185, 129, 0.7) !important; }
    .stat-item.views .stat-icon i { color: rgba(245, 158, 11, 0.7) !important; }
    .stat-item.likes .stat-icon i { color: rgba(239, 68, 68, 0.7) !important; }
    
    // 悬停效果 - 图标变深色，背景有颜色，增加发光效果
    .stat-item.articles:hover .stat-icon {
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.25), rgba(59, 130, 246, 0.15)) !important;
      border-color: rgba(59, 130, 246, 0.5) !important;
      box-shadow: 0 6px 16px rgba(59, 130, 246, 0.35), 0 0 0 1px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transform: scale(1.1) translateY(-2px) rotateZ(1deg);
      
      i {
        color: #2563eb !important;
        transform: scale(1.1);
        text-shadow: 0 1px 3px rgba(37, 99, 235, 0.3);
        animation: gentlePulse 0.6s ease-in-out;
      }
    }
    
    .stat-item.categories:hover .stat-icon {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.25), rgba(16, 185, 129, 0.15)) !important;
      border-color: rgba(16, 185, 129, 0.5) !important;
      box-shadow: 0 6px 16px rgba(16, 185, 129, 0.35), 0 0 0 1px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transform: scale(1.1) translateY(-2px) rotateZ(-1deg);
      
      i {
        color: #10b981 !important;
        transform: scale(1.1);
        text-shadow: 0 1px 3px rgba(16, 185, 129, 0.3);
        animation: gentlePulse 0.6s ease-in-out;
      }
    }
    
    .stat-item.views:hover .stat-icon {
      background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(245, 158, 11, 0.15)) !important;
      border-color: rgba(245, 158, 11, 0.5) !important;
      box-shadow: 0 6px 16px rgba(245, 158, 11, 0.35), 0 0 0 1px rgba(245, 158, 11, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transform: scale(1.1) translateY(-2px) rotateZ(1.5deg);
      
      i {
        color: #f59e0b !important;
        transform: scale(1.1);
        text-shadow: 0 1px 3px rgba(245, 158, 11, 0.3);
        animation: gentlePulse 0.6s ease-in-out;
      }
    }
    
    .stat-item.likes:hover .stat-icon {
      background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(239, 68, 68, 0.15)) !important;
      border-color: rgba(239, 68, 68, 0.5) !important;
      box-shadow: 0 6px 16px rgba(239, 68, 68, 0.35), 0 0 0 1px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2);
      transform: scale(1.1) translateY(-2px) rotateZ(-1.5deg);
      
      i {
        color: #ef4444 !important;
        transform: scale(1.1);
        text-shadow: 0 1px 3px rgba(239, 68, 68, 0.3);
        animation: gentlePulse 0.6s ease-in-out;
      }
    }
  }
}

// 简介区域
.description-section {
  .description-text {
    font-size: 12px;
    color: var(--el-text-color-regular);
    line-height: 1.6;
    margin: 0 0 16px 0;
    text-align: center;
    font-weight: 500;
    font-family: 'OPPO Sans', -apple-system, BlinkMacSystemFont, sans-serif;
    position: relative;
    padding: 12px 16px;
    background: linear-gradient(135deg, rgba(64, 158, 255, 0.03), rgba(64, 158, 255, 0.01));
    border-radius: 8px;
    border: 1px solid rgba(64, 158, 255, 0.1);
    transition: all 0.3s ease;
    
    &::before {
      content: '"';
      position: absolute;
      left: 8px;
      top: 4px;
      font-size: 20px;
      color: rgba(64, 158, 255, 0.3);
      font-family: 'Times New Roman', serif;
    }
    
    &::after {
      content: '"';
      position: absolute;
      right: 8px;
      bottom: 4px;
      font-size: 20px;
      color: rgba(64, 158, 255, 0.3);
      font-family: 'Times New Roman', serif;
    }
    
    &:hover {
      background: linear-gradient(135deg, rgba(64, 158, 255, 0.05), rgba(64, 158, 255, 0.02));
      border-color: rgba(64, 158, 255, 0.2);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.1);
      
      &::before, &::after {
        color: rgba(64, 158, 255, 0.5);
      }
    }
  }
  
  .tech-tags {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
    
    .tech-tag {
      display: inline-flex;
      align-items: center;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 10px;
      font-weight: 600;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      border: 1px solid;
      cursor: default;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
      
      &:hover {
        transform: translateY(-2px) scale(1.05);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      }
      
      // 根据不同技术栈的悬停效果
      &:nth-child(1):hover { box-shadow: 0 4px 12px rgba(79, 192, 141, 0.3); }
      &:nth-child(2):hover { box-shadow: 0 4px 12px rgba(49, 120, 198, 0.3); }
      &:nth-child(3):hover { box-shadow: 0 4px 12px rgba(100, 108, 255, 0.3); }
      &:nth-child(4):hover { box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3); }
    }
  }
}

// 动画定义 - 优化性能
@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(0.95);
  }
}

// 微妙的跳动动画 - 更流畅的过渡
@keyframes gentleBounce {
  0% {
    transform: translateY(0) scale(1);
  }
  25% {
    transform: translateY(-2px) scale(1.05);
  }
  50% {
    transform: translateY(-4px) scale(1.1);
  }
  75% {
    transform: translateY(-2px) scale(1.05);
  }
  100% {
    transform: translateY(0) scale(1);
  }
}

// 旋转动画
@keyframes gentleRotate {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

// 轻微脉动动画 - 用于悬停时的图标
@keyframes gentlePulse {
  0% {
    transform: scale(1.1);
  }
  50% {
    transform: scale(1.15);
  }
  100% {
    transform: scale(1.1);
  }
}

// 渐变动画
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

// 响应式设计 - 与其他卡片组件保持一致
@media (max-width: 768px) {
  .about-site-card {
    margin-bottom: 16px;
  }
  
  .card-header {
    padding: 12px 14px;
    
    i {
      font-size: 13px;
    }
    
    span {
      font-size: 12px;
    }
  }
  
  .card-body {
    padding: 14px;
  }
  
  .site-info {
    margin-bottom: 14px;
    
    .site-brand {
      padding: 10px;
      gap: 10px;
      
      .brand-logo {
        width: 32px;
        height: 32px;
        font-size: 14px;
      }
      
      .brand-content {
        .site-title {
          font-size: 13px;
        }
        
        .site-tagline {
          font-size: 10px;
        }
      }
      
      .site-status {
        font-size: 9px;
        
        .status-dot {
          width: 5px;
          height: 5px;
        }
      }
    }
  }
  
  .stats-section {
    margin-bottom: 14px;
    
    .stats-grid {
      gap: 6px;
      
      .stat-item {
        padding: 10px;
        gap: 8px;
        
        .stat-icon {
          width: 24px;
          height: 24px;
          font-size: 11px;
        }
        
        .stat-data {
          .stat-number {
            font-size: 13px;
          }
          
          .stat-label {
            font-size: 10px;
          }
        }
      }
    }
  }
  
  .description-section {
    .description-text {
      font-size: 11px;
      margin-bottom: 10px;
    }
    
    .tech-tags {
      gap: 5px;
      
      .tech-tag {
        font-size: 9px;
        padding: 3px 6px;
      }
    }
  }
}

@media (max-width: 480px) {
  .card-header {
    padding: 10px 12px;
  }
  
  .card-body {
    padding: 12px;
  }
  
  .site-info {
    margin-bottom: 12px;
    
    .site-brand {
      padding: 8px;
      gap: 8px;
      
      .brand-logo {
        width: 28px;
        height: 28px;
        font-size: 12px;
      }
      
      .brand-content {
        .site-title {
          font-size: 12px;
        }
        
        .site-tagline {
          font-size: 9px;
        }
      }
    }
  }
  
  .stats-section {
    margin-bottom: 12px;
    
    .stats-grid {
      grid-template-columns: 1fr;
      gap: 4px;
      
      .stat-item {
        padding: 8px;
        gap: 6px;
        
        .stat-icon {
          width: 22px;
          height: 22px;
          font-size: 10px;
        }
        
        .stat-data {
          .stat-number {
            font-size: 12px;
          }
          
          .stat-label {
            font-size: 9px;
          }
        }
      }
    }
  }
  
  .description-section {
    .description-text {
      font-size: 10px;
      margin-bottom: 8px;
    }
    
    .tech-tags {
      gap: 4px;
      
      .tech-tag {
        font-size: 8px;
        padding: 2px 4px;
      }
    }
  }
}

// 暗色模式适配
html.dark .about-site-card {
  border-color: var(--el-border-color-dark);
  
  .card-header {
    background: var(--el-fill-color-dark);
    border-bottom-color: var(--el-border-color-darker);
    
    i {
      color: #409eff;
    }
  }
  
  .site-info .site-brand {
    background: var(--el-fill-color-dark);
    
    &:hover {
      background: rgba(64, 158, 255, 0.08);
      box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
    }
    
    &::before {
      background: linear-gradient(90deg, transparent, rgba(64, 158, 255, 0.15), transparent);
    }
    
    // 暗色模式下的 logo 图标增强
    .brand-logo {
      background: linear-gradient(135deg, #409eff, #3b82f6);
      box-shadow: 0 3px 8px rgba(64, 158, 255, 0.4);
      
      i {
        color: white;
        text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
      }
    }
  }
  
  .stats-section .stats-grid .stat-item {
    background: var(--el-fill-color-dark);
    
    &:hover {
      background: rgba(64, 158, 255, 0.08);
      box-shadow: 0 4px 12px rgba(64, 158, 255, 0.15);
    }
    
    // 暗色模式下的统计图标优化
    .stat-icon {
      // 文章图标 - 暗色模式下的蓝色
      .articles & {
        background: rgba(96, 165, 250, 0.15);
        border-color: rgba(96, 165, 250, 0.3);
        
        i {
          color: #60a5fa;
        }
      }
      
      // 分类图标 - 暗色模式下的绿色
      .categories & {
        background: rgba(52, 211, 153, 0.15);
        border-color: rgba(52, 211, 153, 0.3);
        
        i {
          color: #34d399;
        }
      }
      
      // 阅读图标 - 暗色模式下的橙色
      .views & {
        background: rgba(251, 191, 36, 0.15);
        border-color: rgba(251, 191, 36, 0.3);
        
        i {
          color: #fbbf24;
        }
      }
      
      // 点赞图标 - 暗色模式下的红色
      .likes & {
        background: rgba(248, 113, 113, 0.15);
        border-color: rgba(248, 113, 113, 0.3);
        
        i {
          color: #f87171;
        }
      }
    }
    
    // 暗色模式下的悬停效果
    .stats-section .stats-grid .stat-item:hover {
      &.articles .stat-icon {
        background: rgba(96, 165, 250, 0.25);
        border-color: rgba(96, 165, 250, 0.5);
        box-shadow: 0 4px 16px rgba(96, 165, 250, 0.4);
        
        i {
          color: #3b82f6;
        }
      }
      
      &.categories .stat-icon {
        background: rgba(52, 211, 153, 0.25);
        border-color: rgba(52, 211, 153, 0.5);
        box-shadow: 0 4px 16px rgba(52, 211, 153, 0.4);
        
        i {
          color: #10b981;
        }
      }
      
      &.views .stat-icon {
        background: rgba(251, 191, 36, 0.25);
        border-color: rgba(251, 191, 36, 0.5);
        box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
        
        i {
          color: #f59e0b;
        }
      }
      
      &.likes .stat-icon {
        background: rgba(248, 113, 113, 0.25);
        border-color: rgba(248, 113, 113, 0.5);
        box-shadow: 0 4px 16px rgba(248, 113, 113, 0.4);
        
        i {
          color: #ef4444;
        }
      }
    }
  }
  
  .tech-tags .tech-tag {
    // 暗色模式下保持原有颜色，只调整背景
    border-width: 1px;
    
    &:hover {
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    }
    
    // 为每个技术标签在暗色模式下增强阴影
    &:nth-child(1):hover { box-shadow: 0 4px 16px rgba(79, 192, 141, 0.4); }
    &:nth-child(2):hover { box-shadow: 0 4px 16px rgba(49, 120, 198, 0.4); }
    &:nth-child(3):hover { box-shadow: 0 4px 16px rgba(100, 108, 255, 0.4); }
    &:nth-child(4):hover { box-shadow: 0 4px 16px rgba(64, 158, 255, 0.4); }
  }
}
</style>
