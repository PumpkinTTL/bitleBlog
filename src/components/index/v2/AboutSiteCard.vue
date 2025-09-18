<template>
  <div class="sidebar-card about-card animate__animated animate__fadeInUp" style="animation-delay: 0.15s">
    <div class="card-header">
      <i class="fas fa-info-circle"></i>
      <span>关于本站</span>
    </div>
    
    <div class="card-body">
      <div class="site-brand">
        <div class="brand-logo">
          <i class="fas fa-gem"></i>
        </div>
        <div class="brand-text">
          <h4 class="brand-name">
            <span class="name-zh glow-text">知识棱镜</span>
            <span class="name-en">Knowledge Prism</span>
          </h4>
          <div class="brand-desc">
            <span class="desc-text">技术分享 · 知识传递 · 成长记录</span>
            <div class="status-badge">
              <div class="status-dot"></div>
              <span class="status-text">稳定运行</span>
            </div>
          </div>
        </div>
      </div>
      
      <div class="site-stats">
        <div class="stats-title">
          <i class="fas fa-chart-bar"></i>
          <span>站点数据</span>
        </div>
        <div class="stats-grid">
          <div class="stat-item" v-for="stat in siteStats" :key="stat.key">
            <div class="stat-icon" :class="stat.key">
              <i :class="stat.icon"></i>
            </div>
            <div class="stat-text">
              <span class="stat-value">{{ stat.value }}</span>
              <span class="stat-label">{{ stat.label }}</span>
            </div>
          </div>
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
    icon: 'fas fa-file-alt',
    value: '234',
    label: '文章'
  },
  {
    key: 'categories', 
    icon: 'fas fa-folder',
    value: '56',
    label: '分类'
  },
  {
    key: 'views',
    icon: 'fas fa-eye', 
    value: '1.2k',
    label: '访问'
  }
])
</script>

<style lang="less" scoped>
// 关于本站卡片
.about-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 10px;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(147, 51, 234, 0.12);
    border-color: rgba(147, 51, 234, 0.3);
    
    .brand-logo {
      transform: scale(1.1);
    }
  }
  
  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 15px;
    background: rgba(147, 51, 234, 0.04);
    border-bottom: 1px solid var(--el-border-color-extra-light);
    
    i {
      color: var(--el-color-primary);
      font-size: 14px;
    }
    
    span {
      font-size: 14px;
      font-weight: 700;
      color: var(--el-text-color-primary);
    }
  }
  
  .card-body {
    padding: 10px;
    
    .site-brand {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 18px;
      
      .brand-logo {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 12px;
        background: linear-gradient(135deg, #9333ea 0%, #a855f7 50%, #7c3aed 100%);
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 18px;
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        box-shadow: 
          0 4px 15px rgba(147, 51, 234, 0.25),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
        flex-shrink: 0;
        
        // 稳定的发光圈效果
        &::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 15px;
          background: linear-gradient(45deg, rgba(147, 51, 234, 0.15), rgba(168, 85, 247, 0.1));
          z-index: -1;
        }
      }
      
      .brand-text {
        flex: 1;
        min-width: 0;
        
        .brand-name {
          margin: 0 0 6px 0;
          line-height: 1.2;
          
          .name-zh {
            display: block;
            font-size: 16px;
            font-weight: 800;
            margin-bottom: 2px;
            
            &.glow-text {
              background: linear-gradient(135deg, #f472b6, #e879f9, #c084fc, #8b5cf6);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              text-shadow: 0 0 20px rgba(244, 114, 182, 0.3);
            }
          }
          
          .name-en {
            display: block;
            font-size: 11px;
            font-weight: 500;
            color: var(--el-text-color-secondary);
            letter-spacing: 0.5px;
          }
        }
        
        .brand-desc {
          .desc-text {
            display: block;
            color: var(--el-text-color-regular);
            font-size: 11px;
            margin-bottom: 8px;
            line-height: 1.4;
          }
          
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(34, 197, 94, 0.08);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 12px;
            padding: 4px 8px;
            
            .status-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #22c55e;
              animation: statusPulse 2s infinite;
            }
            
            .status-text {
              font-size: 10px;
              color: #16a34a;
              font-weight: 500;
            }
          }
        }
      }
    }
    
    .site-stats {
      .stats-title {
        display: flex;
        align-items: center;
        gap: 6px;
        margin-bottom: 12px;
        
        i {
          color: var(--el-color-primary);
          font-size: 12px;
        }
        
        span {
          font-size: 12px;
          font-weight: 600;
          color: var(--el-text-color-primary);
        }
      }
      
      .stats-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        
        .stat-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          background: var(--el-fill-color-extra-light);
          border-radius: 8px;
          padding: 8px 4px;
          transition: all 0.3s ease;
          
          &:hover {
            transform: translateY(-2px);
            background: rgba(24, 144, 255, 0.05);
          }
          
          .stat-icon {
            width: 24px;
            height: 24px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            color: white;
            
            &.articles {
              background: linear-gradient(135deg, #1890ff, #69c0ff);
            }
            
            &.categories {
              background: linear-gradient(135deg, #52c41a, #95de64);
            }
            
            &.views {
              background: linear-gradient(135deg, #fa8c16, #ffc069);
            }
          }
          
          .stat-text {
            text-align: center;
            
            .stat-value {
              display: block;
              font-size: 14px;
              font-weight: 700;
              color: var(--el-text-color-primary);
              line-height: 1;
            }
            
            .stat-label {
              font-size: 10px;
              color: var(--el-text-color-secondary);
              font-weight: 500;
            }
          }
        }
      }
    }
  }
}

// 暗色模式适配
html.dark & {
  .about-card {
    .site-brand {
      .brand-text {
        .brand-name {
          .name-zh.glow-text {
            background: linear-gradient(135deg, #f472b6, #e879f9, #c084fc, #8b5cf6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }
        }
        
        .brand-desc {
          .status-badge {
            background: rgba(34, 197, 94, 0.12);
            border-color: rgba(34, 197, 94, 0.25);
            
            .status-text {
              color: #4ade80;
            }
          }
        }
      }
    }
    
    .site-stats {
      .stats-grid {
        .stat-item {
          background: #1a1a1a;
          border-color: #303030;
        }
      }
    }
  }
}

// 动画
@keyframes statusPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}
</style>
