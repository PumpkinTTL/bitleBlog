<template>
  <div class="sidebar-card about-card animate__animated animate__fadeInUp" style="animation-delay: 0.15s">
    <div class="card-header">
      <i class="fas fa-info-circle"></i>
      <span>关于本站</span>
    </div>
    
    <div class="card-body">
      <div class="site-brand">
        <!-- <div class="brand-logo">
          <i class="fas fa-gem"></i>
        </div> -->
        <div class="brand-text">
          <h4 class="brand-name">
            <span class="name-zh glow-text" data-text="知识棱镜">知识棱镜</span>
            <span class="name-en">Knowledge Prism</span>
          </h4>
          <div class="brand-desc">
            <div class="desc-text">技术分享 · 知识传递 · 成长记录</div>
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
          <div class="stats-values">
            <span class="stat-value" v-for="stat in siteStats" :key="stat.key + '-value'">
              {{ stat.value }}
            </span>
          </div>
          <div class="stats-labels">
            <span class="stat-label" :class="stat.key" v-for="stat in siteStats" :key="stat.key + '-label'">
              <span class="stat-icon">
                <i :class="stat.icon"></i>
              </span>
              {{ stat.label }}
            </span>
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
// 关于本站卡片 - 现代化设计
.about-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: rgba(147, 51, 234, 0.3);
    
    // .brand-logo {
    //   transform: scale(1.05);
    // }
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
      color: var(--el-color-primary);
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
    
      .site-brand {
        text-align: center;
        margin-bottom: 16px;
        
        // .brand-logo {
        //   width: 40px;
        //   height: 40px;
        //   border-radius: 8px;
        //   background: linear-gradient(135deg, #9333ea 0%, #a855f7 50%, #7c3aed 100%);
        //   display: inline-flex;
        //   align-items: center;
        //   justify-content: center;
        //   color: white;
        //   font-size: 16px;
        //   transition: all 0.3s ease;
        //   margin-bottom: 10px;
        // }
      
      .brand-text {
        flex: 1;
        min-width: 0;
        
        .brand-name {
          margin: 0 0 6px 0;
          line-height: 1.2;
          
          .name-zh {
            display: block;
            font-size: 18px;
            font-weight: 800;
            margin-bottom: 3px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.2;
            transition: all 0.3s ease;
            cursor: default;
            
            &.glow-text {
              background: linear-gradient(135deg, #f472b6 0%, #e879f9 30%, #c084fc 60%, #a78bfa 100%);
              -webkit-background-clip: text;
              -webkit-text-fill-color: transparent;
              background-clip: text;
              background-size: 200% 100%;
              animation: gradientShift 3s ease-in-out infinite;
              letter-spacing: 0.5px;
            }
            
            &:hover.glow-text {
              transform: scale(1.02);
              filter: brightness(1.1);
            }
          }
          
          .name-en {
            display: block;
            font-size: 9px;
            font-weight: 500;
            color: var(--el-text-color-secondary);
            letter-spacing: 1px;
            font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, 'Helvetica Neue', Arial, sans-serif;
            text-transform: uppercase;
            opacity: 0.7;
            animation: textSlideUp 1s ease-out 0.2s both;
          }
        }
        
        .brand-desc {
          .desc-text {
            color: var(--el-text-color-regular);
            font-size: 10px;
            margin-bottom: 8px;
            line-height: 1.4;
            letter-spacing: 0.3px;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-weight: 500;
            animation: textFadeIn 1s ease-out 0.4s both;
          }
          
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            background: rgba(34, 197, 94, 0.1);
            border: 1px solid rgba(34, 197, 94, 0.2);
            border-radius: 6px;
            padding: 4px 10px;
            
            .status-dot {
              width: 6px;
              height: 6px;
              border-radius: 50%;
              background: #22c55e;
              box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.2);
              animation: statusPulse 2s infinite;
            }
            
            .status-text {
              font-size: 10px;
              color: #16a34a;
              font-weight: 600;
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
              letter-spacing: 0.2px;
            }
          }
        }
      }
    }
    
    .site-stats {
      .stats-title {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 10px;
        margin-bottom: 16px;
        padding: 8px 12px;
        background: var(--el-fill-color-extra-light);
        border-radius: 6px;
        border: 1px solid var(--el-border-color-extra-light);
        transition: all 0.3s ease;
        
        &:hover {
          background: var(--el-fill-color-light);
          border-color: var(--el-color-primary-light-7);
          transform: translateY(-1px);
        }
        
        i {
          color: var(--el-color-primary);
          font-size: 14px;
          transition: transform 0.3s ease;
        }
        
        span {
          font-size: 14px;
          font-weight: 700;
          color: var(--el-text-color-primary);
          letter-spacing: 0.5px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
        }
        
        &:hover i {
          transform: rotate(15deg) scale(1.1);
        }
      }
      
      .stats-grid {
        background: var(--el-fill-color-extra-light);
        border: 1px solid var(--el-border-color-extra-light);
        border-radius: 8px;
        padding: 14px;
        transition: all 0.3s ease;
        
        &:hover {
          border-color: var(--el-color-primary-light-7);
          background: var(--el-fill-color-light);
        }
        
        .stats-values {
          display: flex;
          justify-content: space-around;
          margin-bottom: 12px;
          padding: 0 4px;
          
          .stat-value {
            font-size: 18px;
            font-weight: 700;
            color: var(--el-color-primary);
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            text-align: center;
            flex: 1;
            transition: transform 0.2s ease;
            
            &:hover {
              transform: scale(1.05);
            }
          }
        }
        
        .stats-labels {
          display: flex;
          justify-content: space-around;
          padding: 0 4px;
          
          .stat-label {
            font-size: 10px;
            color: var(--el-text-color-secondary);
            font-weight: 600;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
            text-align: center;
            display: flex;
            align-items: center;
            gap: 5px;
            justify-content: center;
            flex: 1;
            
            .stat-icon {
              width: 14px;
              height: 14px;
              border-radius: 3px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 8px;
              color: white;
              flex-shrink: 0;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            }
            
            &.articles .stat-icon {
              background: linear-gradient(135deg, #1890ff, #096dd9);
            }
            
            &.categories .stat-icon {
              background: linear-gradient(135deg, #52c41a, #389e0d);
            }
            
            &.views .stat-icon {
              background: linear-gradient(135deg, #fa8c16, #d46b08);
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
            background: linear-gradient(135deg, #f472b6 0%, #e879f9 30%, #c084fc 60%, #a78bfa 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            background-size: 200% 100%;
            text-shadow: 0 0 40px rgba(244, 114, 182, 0.4);
          }
        }
        
        .brand-desc {
          .status-badge {
            background: rgba(34, 197, 94, 0.15);
            border-color: rgba(34, 197, 94, 0.3);
            
            .status-dot {
              box-shadow: 0 0 0 2px rgba(34, 197, 94, 0.3);
            }
            
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
}

@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

// 文字淡入动画
@keyframes textFadeIn {
  0% {
    opacity: 0;
    transform: translateY(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

// 文字上滑动画
@keyframes textSlideUp {
  0% {
    opacity: 0;
    transform: translateY(15px);
  }
  100% {
    opacity: 0.7;
    transform: translateY(0);
  }
}

// 文字发光动画
@keyframes textGlow {
  0%, 100% {
    opacity: 0.3;
    transform: scale(1);
  }
  50% {
    opacity: 0.1;
    transform: scale(1.02);
  }
}

// 文字光晕动画
@keyframes textHalo {
  0%, 100% {
    opacity: 0.15;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.05;
    transform: translateX(-50%) scale(1.05);
  }
}

// 线条展开动画
@keyframes lineExpand {
  0% {
    width: 0;
    opacity: 0;
  }
  50% {
    opacity: 0.5;
  }
  100% {
    width: 20px;
    opacity: 0.3;
  }
}

// 文字背景动画
@keyframes textBackground {
  0%, 100% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
}

// 渐变位移动画
@keyframes gradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
}

</style>
