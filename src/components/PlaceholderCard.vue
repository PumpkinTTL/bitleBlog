<template>
  <div class="placeholder-card">
    <!-- 左上角状态标签 -->
    <div class="status-badge" v-if="tip">
      <i class="fas fa-info-circle"></i>
      <span>{{ tip }}</span>
    </div>

    <div class="placeholder-content">
      <!-- 图标区域 -->
      <div class="placeholder-icon">
        <div class="icon-container">
          <i :class="iconClass"></i>
        </div>
      </div>

      <!-- 文字内容 -->
      <div class="placeholder-text">
        <h3 class="placeholder-title">{{ title }}</h3>
        <p class="placeholder-description">{{ description }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

// 定义Props类型
interface Props {
  title?: string
  description?: string
  tip?: string
  icon?: string
  iconClass?: string
}

// 设置默认值
const props = withDefaults(defineProps<Props>(), {
  title: '评论功能开发中',
  description: '我们正在为您打造更好的交流体验，敬请期待',
  tip: '开发中',
  icon: 'comment',
  iconClass: ''
})

// 计算图标类名
const iconClass = computed(() => {
  if (props.iconClass) {
    return props.iconClass
  }
  
  const iconMap: Record<string, string> = {
    'comment': 'fas fa-comments',
    'tools': 'fas fa-tools', 
    'lock': 'fas fa-lock',
    'clock': 'fas fa-clock',
    'star': 'fas fa-star',
    'heart': 'fas fa-heart',
    'user': 'fas fa-user',
    'search': 'fas fa-search',
    'settings': 'fas fa-cog',
    'upload': 'fas fa-cloud-upload-alt',
    'download': 'fas fa-download',
    'edit': 'fas fa-edit',
    'delete': 'fas fa-trash',
    'share': 'fas fa-share-alt',
    'bookmark': 'fas fa-bookmark',
    'tag': 'fas fa-tag',
    'category': 'fas fa-folder',
    'notification': 'fas fa-bell',
    'message': 'fas fa-envelope',
    'phone': 'fas fa-phone',
    'email': 'fas fa-at',
    'link': 'fas fa-link',
    'image': 'fas fa-image',
    'video': 'fas fa-video',
    'music': 'fas fa-music',
    'file': 'fas fa-file',
    'folder': 'fas fa-folder-open',
    'chart': 'fas fa-chart-bar',
    'calendar': 'fas fa-calendar',
    'map': 'fas fa-map',
    'globe': 'fas fa-globe',
    'shield': 'fas fa-shield-alt',
    'key': 'fas fa-key',
    'database': 'fas fa-database',
    'server': 'fas fa-server',
    'code': 'fas fa-code',
    'bug': 'fas fa-bug',
    'magic': 'fas fa-magic',
    'rocket': 'fas fa-rocket',
    'fire': 'fas fa-fire',
    'lightning': 'fas fa-bolt',
    'gift': 'fas fa-gift',
    'trophy': 'fas fa-trophy',
    'medal': 'fas fa-medal',
    'crown': 'fas fa-crown'
  }
  
  return iconMap[props.icon] || 'fas fa-tools'
})

</script>

<style lang="less" scoped>
.placeholder-card {
  position: relative;
  background: var(--el-bg-color);
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  border-radius: 20px;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.06),
    0 1px 0 rgba(255, 255, 255, 0.05),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.08);
  overflow: visible;
  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 32px;
  margin: 24px 0;
  
  &:hover {
    transform: translateY(-2px) scale(1.005);
    box-shadow: 
      0 20px 48px rgba(0, 0, 0, 0.1),
      0 1px 0 rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.12);
  }
  
  .status-badge {
    position: absolute;
    top: -8px;
    left: 16px;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    background: linear-gradient(135deg, #FF6B35 0%, #F7931E 100%);
    color: white;
    border-radius: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.3px;
    text-transform: uppercase;
    box-shadow: 
      0 4px 12px rgba(255, 107, 53, 0.3),
      0 1px 0 rgba(255, 255, 255, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
    z-index: 10;
    
    i {
      font-size: 10px;
      opacity: 0.9;
    }
    
    &:hover {
      transform: translateY(-1px);
      box-shadow: 
        0 6px 16px rgba(255, 107, 53, 0.4),
        0 1px 0 rgba(255, 255, 255, 0.25),
        inset 0 1px 0 rgba(255, 255, 255, 0.4);
    }
  }

  .placeholder-content {
    position: relative;
    z-index: 2;
    text-align: center;
    max-width: 320px;
    width: 100%;

    .placeholder-icon {
      margin-bottom: 24px;

      .icon-container {
        position: relative;
        width: 72px;
        height: 72px;
        margin: 0 auto;
        border-radius: 18px;
        background: linear-gradient(135deg, 
          rgba(22, 119, 255, 0.1) 0%, 
          rgba(105, 177, 255, 0.05) 100%
        );
        backdrop-filter: blur(10px) saturate(150%);
        color: #1677FF;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 32px;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 
          0 8px 24px rgba(22, 119, 255, 0.08),
          0 1px 0 rgba(255, 255, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        border: 0.5px solid rgba(22, 119, 255, 0.1);

        &:hover {
          transform: translateY(-3px) scale(1.05);
          background: linear-gradient(135deg, 
            rgba(22, 119, 255, 0.15) 0%, 
            rgba(105, 177, 255, 0.08) 100%
          );
          box-shadow: 
            0 16px 40px rgba(22, 119, 255, 0.15),
            0 1px 0 rgba(255, 255, 255, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.3);
          border-color: rgba(22, 119, 255, 0.2);
          
          i {
            transform: scale(1.1);
          }
        }
        
        i {
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: drop-shadow(0 2px 8px rgba(22, 119, 255, 0.2));
        }
      }
    }

    .placeholder-text {
      .placeholder-title {
        font-size: 22px;
        font-weight: 700;
        background: linear-gradient(135deg, 
          var(--el-text-color-primary) 0%,
          rgba(22, 119, 255, 0.8) 50%,
          var(--el-text-color-primary) 100%
        );
        background-size: 200% 200%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        margin-bottom: 16px;
        line-height: 1.2;
        letter-spacing: -0.4px;
        text-shadow: 0 2px 8px rgba(22, 119, 255, 0.1);
        animation: titleShimmer 4s ease-in-out infinite;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        position: relative;
        
        &::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 50%;
          width: 0;
          height: 2px;
          background: linear-gradient(90deg, 
            transparent 0%, 
            rgba(22, 119, 255, 0.6) 50%, 
            transparent 100%
          );
          transform: translateX(-50%);
          transition: width 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          border-radius: 1px;
        }
        
        &:hover {
          transform: translateY(-1px);
          animation-duration: 2s;
          letter-spacing: -0.2px;
          
          &::after {
            width: 60%;
          }
        }
      }

      .placeholder-description {
        font-size: 15px;
        color: var(--el-text-color-secondary);
        line-height: 1.6;
        font-weight: 400;
        letter-spacing: -0.1px;
        margin-bottom: 8px;
        position: relative;
        padding: 0 8px;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        
        &::before {
          content: '"';
          position: absolute;
          left: -2px;
          top: -8px;
          font-size: 24px;
          color: rgba(22, 119, 255, 0.3);
          font-family: Georgia, serif;
          font-weight: bold;
          line-height: 1;
          transition: all 0.3s ease;
        }
        
        &::after {
          content: '"';
          position: absolute;
          right: -2px;
          bottom: -12px;
          font-size: 24px;
          color: rgba(22, 119, 255, 0.3);
          font-family: Georgia, serif;
          font-weight: bold;
          line-height: 1;
          transition: all 0.3s ease;
        }
        
        &:hover {
          color: var(--el-text-color-primary);
          transform: translateY(-1px);
          
          &::before,
          &::after {
            color: rgba(22, 119, 255, 0.6);
            transform: scale(1.1);
          }
        }
      }
      
      // 添加装饰性的分隔线
      &::after {
        content: '';
        display: block;
        width: 40px;
        height: 1px;
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(22, 119, 255, 0.3) 50%, 
          transparent 100%
        );
        margin: 16px auto 0;
        transition: all 0.3s ease;
      }
      
      &:hover::after {
        width: 60px;
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(22, 119, 255, 0.5) 50%, 
          transparent 100%
        );
      }
    }
  }
}

// 动画关键帧
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  
  33% {
    transform: translateY(-8px) rotate(120deg);
  }
  
  66% {
    transform: translateY(-4px) rotate(240deg);
  }
}


@keyframes gentleFloat {
  0%, 100% {
    transform: translateY(0) rotate(0deg) scale(1);
  }
  
  33% {
    transform: translateY(-8px) rotate(2deg) scale(1.02);
  }
  
  66% {
    transform: translateY(-4px) rotate(-1deg) scale(1.01);
  }
}

@keyframes rotate {
  0% {
    transform: rotate(0deg);
  }
  
  100% {
    transform: rotate(360deg);
  }
}

@keyframes gentleGradientFlow {
  0%, 100% {
    background-position: 0% 50%;
  }
  
  50% {
    background-position: 100% 50%;
  }
}

@keyframes gentlePulse {
  0%, 100% {
    opacity: 0.8;
    transform: scale(1);
  }
  
  50% {
    opacity: 1;
    transform: scale(1.05);
  }
}

@keyframes subtleGradientShift {
  0%, 100% {
    background-position: 0% 50%;
  }
  
  50% {
    background-position: 100% 50%;
  }
}

@keyframes blink {
  0%, 50%, 100% {
    opacity: 0.4;
  }
  
  25%, 75% {
    opacity: 1;
  }
}

@keyframes titleShimmer {
  0%, 100% {
    background-position: 0% 50%;
  }
  
  50% {
    background-position: 100% 50%;
  }
}

// 暗色模式适配 - iOS风格
html.dark & {
  background: rgba(28, 28, 30, 0.9);
  backdrop-filter: blur(30px) saturate(200%);
  border-color: rgba(255, 255, 255, 0.06);
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    0 1px 0 rgba(255, 255, 255, 0.03),
    inset 0 1px 0 rgba(255, 255, 255, 0.06);
    
  &:hover {
    border-color: rgba(255, 255, 255, 0.1);
    box-shadow: 
      0 20px 48px rgba(0, 0, 0, 0.4),
      0 1px 0 rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  
  .status-badge {
    background: linear-gradient(135deg, #FF453A 0%, #FF9F0A 100%);
    box-shadow: 
      0 4px 12px rgba(255, 69, 58, 0.4),
      0 1px 0 rgba(255, 255, 255, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.25);
      
    &:hover {
      box-shadow: 
        0 6px 16px rgba(255, 69, 58, 0.5),
        0 1px 0 rgba(255, 255, 255, 0.2),
        inset 0 1px 0 rgba(255, 255, 255, 0.3);
    }
  }
  
  .placeholder-icon .icon-container {
    background: linear-gradient(135deg, 
      rgba(22, 119, 255, 0.15) 0%, 
      rgba(105, 177, 255, 0.08) 100%
    );
    color: #64A8FF;
    border-color: rgba(22, 119, 255, 0.15);
    
    &:hover {
      background: linear-gradient(135deg, 
        rgba(22, 119, 255, 0.2) 0%, 
        rgba(105, 177, 255, 0.12) 100%
      );
      border-color: rgba(22, 119, 255, 0.25);
    }
  }
  
  .placeholder-text {
    .placeholder-title {
      background: linear-gradient(135deg, 
        rgba(255, 255, 255, 0.95) 0%,
        rgba(100, 168, 255, 0.9) 50%,
        rgba(255, 255, 255, 0.95) 100%
      );
      text-shadow: 0 2px 8px rgba(100, 168, 255, 0.2);
      
      &::after {
        background: linear-gradient(90deg, 
          transparent 0%, 
          rgba(100, 168, 255, 0.6) 50%, 
          transparent 100%
        );
      }
    }
    
    .placeholder-description {
      &::before,
      &::after {
        color: rgba(100, 168, 255, 0.4);
      }
      
      &:hover {
        &::before,
        &::after {
          color: rgba(100, 168, 255, 0.7);
        }
      }
    }
    
    &::after {
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(100, 168, 255, 0.4) 50%, 
        transparent 100%
      );
    }
    
    &:hover::after {
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(100, 168, 255, 0.6) 50%, 
        transparent 100%
      );
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .placeholder-card {
    margin: 16px 0;
    padding: 32px 24px;
    border-radius: 16px;
    
    .status-badge {
      top: -6px;
      left: 12px;
      padding: 3px 6px;
      font-size: 10px;
      border-radius: 6px;
    }
    
    .placeholder-content {
      max-width: 280px;
      
      .placeholder-icon {
        margin-bottom: 20px;
        
        .icon-container {
          width: 64px;
          height: 64px;
          font-size: 28px;
          border-radius: 16px;
        }
      }
      
      .placeholder-text {
        .placeholder-title {
          font-size: 20px;
          margin-bottom: 12px;
          letter-spacing: -0.3px;
        }
        
        .placeholder-description {
          font-size: 14px;
          padding: 0 6px;
          
          &::before {
            font-size: 20px;
            top: -6px;
          }
          
          &::after {
            font-size: 20px;
            bottom: -10px;
          }
        }
        
        &::after {
          width: 30px;
          margin: 12px auto 0;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .placeholder-card {
    padding: 28px 20px;
    border-radius: 14px;
    margin: 12px 0;
    
    .status-badge {
      top: -5px;
      left: 10px;
      padding: 2px 5px;
      font-size: 9px;
      border-radius: 5px;
      
      i {
        font-size: 8px;
      }
    }
    
    .placeholder-content {
      max-width: 260px;
      
      .placeholder-icon {
        margin-bottom: 16px;
        
        .icon-container {
          width: 56px;
          height: 56px;
          font-size: 24px;
          border-radius: 14px;
        }
      }
      
      .placeholder-text {
        .placeholder-title {
          font-size: 18px;
          margin-bottom: 10px;
          letter-spacing: -0.2px;
        }
        
        .placeholder-description {
          font-size: 13px;
          line-height: 1.4;
          padding: 0 4px;
          
          &::before {
            font-size: 18px;
            top: -5px;
            left: -1px;
          }
          
          &::after {
            font-size: 18px;
            bottom: -8px;
            right: -1px;
          }
        }
        
        &::after {
          width: 25px;
          margin: 10px auto 0;
        }
      }
    }
  }
}
</style>
