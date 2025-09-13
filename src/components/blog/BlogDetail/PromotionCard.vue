<template>
  <div 
    class="promotion-card animate__animated animate__fadeIn" 
    :class="[type, { 'inline-style': isInline }]"
    :style="animationStyle"
  >
    <!-- 徽章 -->
    <div class="promotion-badge" :class="badgeClass">
      <i :class="badgeIcon"></i>
      {{ badgeText }}
    </div>

    <!-- 内容区域 -->
    <div class="promotion-content">
      <!-- 图片 -->
      <div class="promotion-image" :style="{ borderRadius: radius ? '8px' : '0px' }">
        <img :src="imageUrl" :alt="imageAlt" :style="{ borderRadius: radius ? '8px' : '0px' }" />
        <div v-if="showOverlay" class="promotion-overlay" :style="{ borderRadius: radius ? '8px' : '0px' }">
          <div class="promotion-cta-overlay">
            <i v-if="overlayIcon" :class="overlayIcon"></i>
            {{ overlayText }}
          </div>
        </div>
      </div>

      <!-- 信息区域 -->
      <div class="promotion-info">
        <div class="promotion-title">{{ title }}</div>
        <div class="promotion-description">{{ description }}</div>
        
        <!-- 价格信息（可选） -->
        <div v-if="showPrice" class="promotion-price">
          <span class="current-price">{{ currentPrice }}</span>
          <span v-if="originalPrice" class="original-price">{{ originalPrice }}</span>
        </div>

        <!-- 操作按钮 -->
        <div class="promotion-cta">
          <button 
            class="promotion-button" 
            :class="buttonClass"
            @click="handleClick"
          >
            <i v-if="buttonIcon" :class="buttonIcon"></i>
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits, withDefaults } from 'vue';

// 定义组件属性
interface Props {
  // 基本信息
  type?: 'standard' | 'premium'; // 卡片类型
  title: string; // 标题
  description: string; // 描述
  imageUrl: string; // 图片URL
  imageAlt?: string; // 图片alt文本
  radius?: boolean; // 是否需要圆角，默认true
  
  // 徽章配置
  badgeText: string; // 徽章文字
  badgeIcon?: string; // 徽章图标
  
  // 按钮配置
  buttonText: string; // 按钮文字
  buttonIcon?: string; // 按钮图标
  
  // 覆盖层配置（用于侧边栏样式）
  showOverlay?: boolean; // 是否显示覆盖层
  overlayText?: string; // 覆盖层文字
  overlayIcon?: string; // 覆盖层图标
  
  // 价格配置（可选）
  showPrice?: boolean; // 是否显示价格
  currentPrice?: string; // 当前价格
  originalPrice?: string; // 原价
  
  // 样式配置
  isInline?: boolean; // 是否为内联样式（文章内嵌）
  animationDelay?: string; // 动画延迟
}

const props = withDefaults(defineProps<Props>(), {
  type: 'standard',
  imageAlt: '推广图片',
  radius: true, // 默认有圆角
  badgeIcon: 'fas fa-tag',
  showOverlay: false,
  showPrice: false,
  isInline: false,
  animationDelay: '0s'
});

// 定义事件
const emit = defineEmits<{
  click: [event: MouseEvent];
}>();

// 计算属性
const badgeClass = computed(() => {
  return props.type === 'premium' ? 'premium-badge' : 'standard-badge';
});

const buttonClass = computed(() => {
  return props.type === 'premium' ? 'premium-button' : 'standard-button';
});

const animationStyle = computed(() => {
  return props.animationDelay ? { 'animation-delay': props.animationDelay } : {};
});



// 事件处理
const handleClick = (event: MouseEvent) => {
  emit('click', event);
};
</script>

<style lang="less" scoped>
.promotion-card {
  border-radius: 12px;
  background: var(--el-bg-color);
  box-shadow: 0 5px 20px var(--el-box-shadow-light);
  overflow: hidden;
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  border: 1px solid var(--el-border-color-lighter);

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px var(--el-box-shadow);

    .promotion-image img {
      transform: scale(1.08);
    }
  }

  // 内联样式（文章内嵌）
  &.inline-style {
    margin: 30px 0;
    border: 1px solid var(--el-border-color-light);

    .promotion-content {
      display: flex;
      padding: 24px;
      gap: 24px;

      @media (max-width: 576px) {
        flex-direction: column;
        align-items: center;
        gap: 16px;
        padding: 20px;
      }

      .promotion-image {
        width: 120px;
        height: 120px;
        flex-shrink: 0;
        overflow: hidden;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        // 圆角通过动态样式控制，不在这里设置
      }

      .promotion-info {
        flex: 1;
        min-width: 0;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
      }
    }
  }

  // 侧边栏样式（默认）
  &:not(.inline-style) {
    .promotion-content {
      .promotion-image {
        width: 100%;
        height: 160px;
        position: relative;
        overflow: hidden;
        margin-bottom: 12px;
        // 圆角通过动态样式控制，不在这里设置
      }

      .promotion-info {
        padding: 15px;
      }
    }
  }

  // 徽章样式
  .promotion-badge {
    position: absolute;
    top: 12px;
    font-size: 12px;
    padding: 4px 10px;
    border-radius: 6px;
    z-index: 2;
    font-weight: 500;
    display: flex;
    align-items: center;
    gap: 4px;

    &.standard-badge {
      right: 12px;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-regular);
      border: 1px solid var(--el-border-color-light);
    }

    &.premium-badge {
      left: 12px;
      background: linear-gradient(135deg, rgba(255, 64, 255, 0.9), rgba(128, 0, 191, 0.9));
      color: white;
      box-shadow: 0 2px 8px rgba(128, 0, 191, 0.3);
    }
  }

  // 图片样式
  .promotion-image {
    position: relative;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
      // 不使用inherit，直接通过动态样式控制
    }

    .promotion-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.7);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;

      .promotion-cta-overlay {
        color: white;
        font-weight: 600;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 6px;
      }
    }

    &:hover .promotion-overlay {
      opacity: 1;
    }
  }

  // 信息区域
  .promotion-info {
    .promotion-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 8px;
      line-height: 1.4;
    }

    .promotion-description {
      font-size: 14px;
      color: var(--el-text-color-regular);
      line-height: 1.6;
      margin-bottom: 12px;
    }

    .promotion-price {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-bottom: 12px;

      .current-price {
        font-size: 18px;
        font-weight: 700;
        color: var(--el-color-error);
      }

      .original-price {
        font-size: 14px;
        color: var(--el-text-color-placeholder);
        text-decoration: line-through;
      }
    }

    .promotion-cta {
      .promotion-button {
        height: 36px;
        padding: 0 18px;
        border: none;
        border-radius: 18px;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        gap: 6px;

        &.standard-button {
          background: var(--el-color-primary);
          color: white;

          &:hover {
            background: var(--el-color-primary-dark-2);
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--el-color-primary-light-7);
          }
        }

        &.premium-button {
          background: linear-gradient(135deg, rgba(255, 64, 255, 0.85), rgba(128, 0, 191, 0.85));
          color: white;

          &:hover {
            background: linear-gradient(135deg, rgba(255, 64, 255, 1), rgba(128, 0, 191, 1));
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(128, 0, 191, 0.4);
          }
        }

        &:active {
          transform: scale(0.98);
        }
      }
    }
  }

  // Premium类型特殊样式
  &.premium {
    border: 1px solid rgba(128, 0, 191, 0.15);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(45deg, transparent 30%, rgba(255, 64, 255, 0.1) 50%, transparent 70%);
      animation: shimmer-flow 3s infinite linear;
      z-index: 1;
      pointer-events: none;
    }
  }
}

// 闪烁动画
@keyframes shimmer-flow {
  0% { transform: translateX(-100%); }
  100% { transform: translateX(100%); }
}
</style>
