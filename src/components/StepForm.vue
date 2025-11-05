<template>
  <div class="step-form">
    <div class="step-form-header">
      <div 
        v-for="(step, index) in steps" 
        :key="index" 
        class="step-item"
        :class="{ 
          'is-active': index === activeStep, 
          'is-finished': index < activeStep,
          'is-waiting': index > activeStep
        }"
      >
        <div class="step-line-wrapper" v-if="index > 0">
          <div class="step-line" :class="{ 'is-finished': index <= activeStep }"></div>
        </div>
        
        <div class="step-circle">
          <i v-if="index < activeStep" class="fas fa-check"></i>
          <span v-else>{{ index + 1 }}</span>
        </div>
        
        <div class="step-content">
          <div class="step-title">{{ step.title }}</div>
          <div class="step-description" v-if="step.description">{{ step.description }}</div>
        </div>
      </div>
    </div>

    <div class="step-form-body">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  // 当前激活步骤（0开始）
  active: {
    type: Number,
    default: 0
  },
  // 步骤配置
  steps: {
    type: Array,
    required: true,
    validator: (value) => {
      return value.every(step => step.title)
    }
  },
  // 主题色（激活状态）
  themeColor: {
    type: String,
    default: '#8b5cf6'
  },
  // 完成状态的颜色（默认为主题色的深色版本）
  finishColor: {
    type: String,
    default: '#7c3aed'
  },
  // 等待状态的颜色
  waitColor: {
    type: String,
    default: '#d1d5db'
  },
  // 背景颜色
  bgColor: {
    type: String,
    default: '#fafafa'
  },
  // 边框颜色
  borderColor: {
    type: String,
    default: '#f0f0f0'
  },
  // 圆角大小
  borderRadius: {
    type: String,
    default: '8px'
  },
  // 标题字体大小
  titleFontSize: {
    type: String,
    default: '12px'
  },
  // 描述字体大小
  descriptionFontSize: {
    type: String,
    default: '10px'
  },
  // 圆圈大小
  circleSize: {
    type: String,
    default: '24px'
  },
  // 连接线高度
  lineHeight: {
    type: String,
    default: '2px'
  },
  // 内边距
  padding: {
    type: String,
    default: '16px 12px'
  },
  // 底部间距
  marginBottom: {
    type: String,
    default: '16px'
  },
  // 是否显示阴影
  showShadow: {
    type: Boolean,
    default: true
  },
  // 主题色透明度（用于光晕效果）
  themeColorOpacity: {
    type: Number,
    default: 0.1,
    validator: (value) => value >= 0 && value <= 1
  }
})

const activeStep = computed(() => props.active)

// 计算主题色的rgba值（用于光晕效果）
const themeColorRgba = computed(() => {
  const hex = props.themeColor.replace('#', '')
  const r = parseInt(hex.substring(0, 2), 16)
  const g = parseInt(hex.substring(2, 4), 16)
  const b = parseInt(hex.substring(4, 6), 16)
  return `rgba(${r}, ${g}, ${b}, ${props.themeColorOpacity})`
})
</script>

<style lang="less" scoped>
.step-form {
  width: 100%;

  .step-form-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: v-bind(padding);
    background: v-bind(bgColor);
    border-radius: v-bind(borderRadius);
    border: 1px solid v-bind(borderColor);
    margin-bottom: v-bind(marginBottom);
    position: relative;
    box-shadow: v-bind("showShadow ? '0 1px 3px rgba(0, 0, 0, 0.05)' : 'none'");

    .step-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      text-align: center;

      .step-line-wrapper {
        position: absolute;
        left: 0;
        right: 50%;
        top: 11px;
        transform: translateX(-50%);
        width: 100%;
        z-index: 0;
        pointer-events: none;

        .step-line {
          height: v-bind(lineHeight);
          background: v-bind(borderColor);
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;

          &.is-finished {
            background: v-bind(finishColor);
            
            &::after {
              content: '';
              position: absolute;
              top: 0;
              left: -100%;
              width: 100%;
              height: 100%;
              background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
              animation: shimmer 2s infinite;
            }
          }
        }
      }

      .step-circle {
        width: v-bind(circleSize);
        height: v-bind(circleSize);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: calc(v-bind(circleSize) * 0.5);
        font-weight: 500;
        border: 2.5px solid v-bind(waitColor);
        background: #fff;
        color: #9ca3af;
        transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        position: relative;
        z-index: 1;
        margin-bottom: 10px;

        i {
          font-size: calc(v-bind(circleSize) * 0.45);
          animation: checkBounce 0.5s ease-out;
        }
      }

      .step-content {
        transition: transform 0.3s ease;
        
        .step-title {
          font-size: v-bind(titleFontSize);
          font-weight: 600;
          color: #6b7280;
          margin-bottom: 6px;
          transition: all 0.3s ease;
          line-height: 1.4;
          letter-spacing: 0.2px;
        }

        .step-description {
          font-size: v-bind(descriptionFontSize);
          color: #9ca3af;
          line-height: 1.5;
          transition: all 0.3s ease;
          opacity: 0.75;
          font-weight: 400;
        }
      }

      // 已完成状态
      &.is-finished {
        .step-circle {
          border-color: v-bind(finishColor);
          background: linear-gradient(135deg, v-bind(finishColor), #9333ea);
          color: #fff;
          position: relative;
          box-shadow: 0 0 0 3px rgba(124, 58, 237, 0.18),
                      0 0 12px rgba(124, 58, 237, 0.2),
                      0 2px 8px rgba(124, 58, 237, 0.25);

          &:hover {
            transform: scale(1.08);
            box-shadow: 0 0 0 4px rgba(124, 58, 237, 0.25),
                        0 0 16px rgba(124, 58, 237, 0.3),
                        0 4px 12px rgba(124, 58, 237, 0.35);
          }
        }

        .step-content {
          .step-title {
            color: v-bind(finishColor);
            font-weight: 600;
          }

          .step-description {
            color: #6b7280;
            opacity: 0.9;
          }
        }
      }

      // 激活状态
      &.is-active {
        .step-circle {
          border-color: v-bind(themeColor);
          background: linear-gradient(135deg, v-bind(themeColor), #a78bfa);
          color: #fff;
          transform: scale(1.12);
          position: relative;
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.25),
                      0 0 20px rgba(139, 92, 246, 0.3),
                      0 4px 16px rgba(139, 92, 246, 0.25);
          animation: activeGlow 2s ease-in-out infinite;

          &::after {
            content: '';
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%);
            animation: ripple 2s ease-in-out infinite;
            z-index: -1;
          }

          &:hover {
            transform: scale(1.18);
            box-shadow: 0 0 0 5px rgba(139, 92, 246, 0.3),
                        0 0 25px rgba(139, 92, 246, 0.4),
                        0 6px 20px rgba(139, 92, 246, 0.3);
            animation: activeGlowHover 1.5s ease-in-out infinite;
          }
        }

        .step-content {
          transform: translateY(-1px);
          
          .step-title {
            color: v-bind(themeColor);
            font-weight: 700;
            animation: titleGlow 2s ease-in-out infinite;
          }

          .step-description {
            color: #6b7280;
            opacity: 0.95;
          }
        }
      }

      // 等待状态（默认）
      &.is-waiting {
        .step-circle {
          border-color: v-bind(waitColor);
          background: #fff;
          color: #9ca3af;

          &:hover {
            transform: scale(1.04);
            border-color: #9ca3af;
            box-shadow: 0 0 0 3px rgba(156, 163, 175, 0.1);
          }
        }

        .step-content {
          .step-title {
            color: #9ca3af;
            font-weight: 500;
          }

          .step-description {
            color: #d1d5db;
            opacity: 0.7;
          }
        }
      }
    }
  }

  .step-form-body {
    // 插槽内容区域，由父组件自定义
  }
}

// 动画定义
@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

@keyframes activeGlow {
  0%, 100% {
    box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.25),
                0 0 20px rgba(139, 92, 246, 0.3),
                0 4px 16px rgba(139, 92, 246, 0.25);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(139, 92, 246, 0.35),
                0 0 30px rgba(139, 92, 246, 0.4),
                0 6px 24px rgba(139, 92, 246, 0.35);
  }
}

@keyframes activeGlowHover {
  0%, 100% {
    box-shadow: 0 0 0 5px rgba(139, 92, 246, 0.3),
                0 0 25px rgba(139, 92, 246, 0.4),
                0 6px 20px rgba(139, 92, 246, 0.3);
  }
  50% {
    box-shadow: 0 0 0 7px rgba(139, 92, 246, 0.4),
                0 0 35px rgba(139, 92, 246, 0.5),
                0 8px 28px rgba(139, 92, 246, 0.4);
  }
}

@keyframes ripple {
  0% {
    transform: scale(0.8);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@keyframes titleGlow {
  0%, 100% {
    text-shadow: 0 0 0px rgba(139, 92, 246, 0);
  }
  50% {
    text-shadow: 0 0 8px rgba(139, 92, 246, 0.3);
  }
}

@keyframes checkBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// 响应式适配
@media (max-width: 640px) {
  .step-form {
    .step-form-header {
      padding: 12px 8px;

      .step-item {
        .step-circle {
          width: 20px;
          height: 20px;
          font-size: 10px;
        }

        .step-content {
          .step-title {
            font-size: 10px;
          }

          .step-description {
            font-size: 9px;
          }
        }
      }
    }
  }
}
</style>
