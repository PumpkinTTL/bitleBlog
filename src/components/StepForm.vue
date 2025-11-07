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
    default: ''
  },
  // 完成状态的颜色（默认为主题色的深色版本）
  finishColor: {
    type: String,
    default: ''
  },
  // 等待状态的颜色
  waitColor: {
    type: String,
    default: ''
  },
  // 背景颜色
  bgColor: {
    type: String,
    default: ''
  },
  // 边框颜色
  borderColor: {
    type: String,
    default: ''
  },
  // 圆角大小
  borderRadius: {
    type: String,
    default: '6px'
  },
  // 标题字体大小
  titleFontSize: {
    type: String,
    default: '11px'
  },
  // 描述字体大小
  descriptionFontSize: {
    type: String,
    default: '10px'
  },
  // 圆圈大小
  circleSize: {
    type: String,
    default: '22px'
  },
  // 连接线高度
  lineHeight: {
    type: String,
    default: '2px'
  },
  // 内边距
  padding: {
    type: String,
    default: '12px 14px'
  },
  // 底部间距
  marginBottom: {
    type: String,
    default: '14px'
  },
  // 是否显示阴影
  showShadow: {
    type: Boolean,
    default: false
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
// 引入全局主题变量
@import '@/assets/style/theme.less';

.step-form {
  width: 100%;

  .step-form-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    padding: v-bind(padding);
    background: var(--el-bg-color);
    border-radius: v-bind(borderRadius);
    border: 1px solid var(--el-border-color-lighter);
    margin-bottom: v-bind(marginBottom);
    position: relative;

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
          background: v-bind("borderColor || 'var(--el-border-color)'");
          transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;

          &.is-finished {
            background: v-bind("finishColor || 'var(--el-color-primary-dark-2)'");
            
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
        border: 2.5px solid v-bind("waitColor || 'var(--el-border-color)'");
        background: var(--el-bg-color);
        color: var(--el-text-color-placeholder);
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
          color: var(--el-text-color-regular);
          margin-bottom: 4px;
          transition: all 0.3s ease;
          line-height: 1.3;
        }

        .step-description {
          font-size: v-bind(descriptionFontSize);
          color: var(--el-text-color-secondary);
          line-height: 1.4;
          transition: all 0.3s ease;
          opacity: 0.8;
        }
      }

      // 已完成状态
      &.is-finished {
        .step-circle {
          border-color: v-bind("finishColor || 'var(--el-color-primary-dark-2)'");
          background: linear-gradient(135deg, v-bind("finishColor || 'var(--el-color-primary-dark-2)'"), var(--el-color-primary));
          color: #fff;
          position: relative;
          box-shadow: 0 0 0 3px var(--theme-orange-border-3),
                      0 0 12px var(--theme-orange-shadow),
                      0 2px 8px var(--theme-orange-shadow);

          &:hover {
            transform: scale(1.08);
            box-shadow: 0 0 0 4px var(--theme-orange-border-3),
                        0 0 16px var(--theme-orange-shadow),
                        0 4px 12px var(--theme-orange-shadow);
          }
        }

        .step-content {
          .step-title {
            color: v-bind("finishColor || 'var(--el-color-primary-dark-2)'");
            font-weight: 600;
          }

          .step-description {
            color: var(--el-text-color-regular);
            opacity: 0.9;
          }
        }
      }

      // 激活状态
      &.is-active {
        .step-circle {
          border-color: v-bind("themeColor || 'var(--el-color-primary)'");
          background: linear-gradient(135deg, v-bind("themeColor || 'var(--el-color-primary)'"), var(--el-color-primary-light-3));
          color: #fff;
          transform: scale(1.12);
          position: relative;
          box-shadow: 0 0 0 4px var(--theme-orange-border-3),
                      0 0 20px var(--theme-orange-shadow),
                      0 4px 16px var(--theme-orange-shadow);
          animation: activeGlow 2s ease-in-out infinite;

          &::after {
            content: '';
            position: absolute;
            inset: -8px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--theme-orange-glow) 0%, transparent 70%);
            animation: ripple 2s ease-in-out infinite;
            z-index: -1;
          }

          &:hover {
            transform: scale(1.18);
            box-shadow: 0 0 0 5px var(--theme-orange-border-3),
                        0 0 25px var(--theme-orange-glow),
                        0 6px 20px var(--theme-orange-shadow);
            animation: activeGlowHover 1.5s ease-in-out infinite;
          }
        }

        .step-content {
          transform: translateY(-1px);
          
          .step-title {
            color: v-bind("themeColor || 'var(--el-color-primary)'");
            font-weight: 700;
            animation: titleGlow 2s ease-in-out infinite;
          }

          .step-description {
            color: var(--el-text-color-regular);
            opacity: 0.95;
          }
        }
      }

      // 等待状态（默认）
      &.is-waiting {
        .step-circle {
          border-color: v-bind("waitColor || 'var(--el-border-color)'");
          background: var(--el-bg-color);
          color: var(--el-text-color-placeholder);

          &:hover {
            transform: scale(1.04);
            border-color: var(--el-text-color-placeholder);
            box-shadow: 0 0 0 3px var(--el-fill-color);
          }
        }

        .step-content {
          .step-title {
            color: var(--el-text-color-placeholder);
            font-weight: 500;
          }

          .step-description {
            color: var(--el-text-color-placeholder);
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
    box-shadow: 0 0 0 4px var(--theme-orange-border-3),
                0 0 20px var(--theme-orange-shadow),
                0 4px 16px var(--theme-orange-shadow);
  }
  50% {
    box-shadow: 0 0 0 6px var(--theme-orange-border-3),
                0 0 30px var(--theme-orange-glow),
                0 6px 24px var(--theme-orange-shadow);
  }
}

@keyframes activeGlowHover {
  0%, 100% {
    box-shadow: 0 0 0 5px var(--theme-orange-border-3),
                0 0 25px var(--theme-orange-glow),
                0 6px 20px var(--theme-orange-shadow);
  }
  50% {
    box-shadow: 0 0 0 7px var(--theme-orange-glow),
                0 0 35px var(--theme-orange-glow),
                0 8px 28px var(--theme-orange-glow);
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
    text-shadow: 0 0 0px transparent;
  }
  50% {
    text-shadow: 0 0 8px var(--theme-orange-shadow);
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
