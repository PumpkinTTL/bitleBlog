<template>
  <teleport to="body">
    <transition name="fade">
      <div v-if="visible" class="celebration-overlay" @click.self="handleOverlayClick">
        <transition name="scale-fade">
          <div 
            v-if="visible" 
            class="celebration-modal" 
            :style="modalStyle"
          >
            <!-- 关闭按钮 -->
            <button v-if="showClose" class="celebration-close" @click="handleClose">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 6L6 18M6 6l12 12"/>
              </svg>
            </button>

            <div class="celebration-container">
              <!-- 礼花动画容器 -->
              <div v-if="showConfetti" class="confetti-container">
                <div v-for="i in 30" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
              </div>

              <!-- 主要内容 -->
              <div class="celebration-content">
                <!-- 图标动画 -->
                <div class="celebration-icon" :class="`type-${type}`">
                  <div class="icon-bg"></div>
                  <i :class="iconClass"></i>
                </div>

                <!-- 标题 -->
                <h2 class="celebration-title">{{ title }}</h2>

              <!-- 主要消息 -->
              <p class="celebration-message">{{ message }}</p>

              <!-- 副消息 -->
              <p v-if="subMessage" class="celebration-sub-message">{{ subMessage }}</p>
              
              <!-- 感谢文字 -->
              <p class="celebration-thanks-message">感谢您对我劳动的认可</p>

                <!-- 详情信息 -->
                <div v-if="details && details.length" class="celebration-details">
                  <div
                    v-for="(detail, index) in details"
                    :key="index"
                    class="detail-item"
                  >
                    <div class="detail-label">
                      <i v-if="detail.icon" :class="detail.icon"></i>
                      {{ detail.label }}
                    </div>
                    <div class="detail-value">{{ detail.value }}</div>
                  </div>
                </div>

                <!-- 操作按钮 -->
                <div v-if="actions && actions.length" class="celebration-actions">
                  <button
                    v-for="(action, index) in actions"
                    :key="index"
                    :class="['celebration-btn', action.type === 'primary' ? 'celebration-btn-primary' : '']"
                    @click="handleAction(action)"
                  >
                    <i v-if="action.icon" :class="action.icon"></i>
                    {{ action.text }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </transition>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from 'vue'
import type { CelebrationDetail, CelebrationAction } from '@/types/donation'

// Props
interface Props {
  visible: boolean
  title?: string
  message?: string
  subMessage?: string
  type?: 'success' | 'celebration'
  showConfetti?: boolean
  showClose?: boolean
  closeOnClickOverlay?: boolean
  autoClose?: boolean
  autoCloseDelay?: number
  width?: string
  fullscreen?: boolean
  details?: CelebrationDetail[]
  actions?: CelebrationAction[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '恭喜!',
  message: '操作成功!',
  type: 'celebration',
  showConfetti: true,
  showClose: true,
  closeOnClickOverlay: true,
  autoClose: false,
  autoCloseDelay: 3000,
  width: '600px',
  fullscreen: false,
  details: () => [],
  actions: () => []
})

// Emits
const emit = defineEmits<{
  'update:visible': [value: boolean]
  'close': []
  'action': [actionName: string]
}>()

// 响应式数据
let autoCloseTimer: NodeJS.Timeout | null = null

// 计算属性
const modalStyle = computed(() => {
  if (props.fullscreen) {
    return {
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      borderRadius: '0'
    }
  }
  return {
    width: props.width,
    maxWidth: '90vw'
  }
})

const iconClass = computed(() => {
  if (props.type === 'success') {
    return 'fas fa-check-circle'
  }
  return 'fas fa-gift'
})

// 方法
const handleOverlayClick = () => {
  if (props.closeOnClickOverlay) {
    handleClose()
  }
}

const getConfettiStyle = (index: number) => {
  const colors = ['#ffd700', '#ffed4e', '#ffa500', '#ff8c00', '#ff6347', '#ff4500', '#ffd700', '#ffb347']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const randomLeft = Math.random() * 100
  const randomDelay = Math.random() * 2
  const randomDuration = 2.5 + Math.random() * 1.5

  return {
    left: `${randomLeft}%`,
    backgroundColor: randomColor,
    animationDelay: `${randomDelay}s`,
    animationDuration: `${randomDuration}s`
  }
}

const handleClose = () => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
    autoCloseTimer = null
  }
  emit('update:visible', false)
  emit('close')
}

const handleAction = (action: CelebrationAction) => {
  action.handler()
  emit('action', action.text)
}

// 监听 visible 变化
watch(() => props.visible, (newVal) => {
  if (newVal) {
    // 禁止背后的滚动
    document.body.style.overflow = 'hidden'
    
    if (props.autoClose) {
      autoCloseTimer = setTimeout(() => {
        handleClose()
      }, props.autoCloseDelay)
    }
  } else {
    // 恢复滚动
    document.body.style.overflow = ''
  }
})

// 生命周期
onUnmounted(() => {
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
  document.body.style.overflow = ''
})
</script>

<style scoped lang="less">
// 自定义过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.scale-fade-enter-active {
  transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.scale-fade-leave-active {
  transition: all 0.2s cubic-bezier(0.4, 0, 1, 1);
}

.scale-fade-enter-from {
  opacity: 0;
  transform: scale(0.8);
}

.scale-fade-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

// 遮罩层
.celebration-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 20px;
  backdrop-filter: blur(4px);
  will-change: opacity;
}

// 弹窗主体
.celebration-modal {
  position: relative;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  will-change: transform, opacity;
  transform: translateZ(0);
}

// 关闭按钮
.celebration-close {
  position: absolute;
  top: 16px;
  right: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: none;
  background: rgba(230, 81, 0, 0.1);
  color: #e65100;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  backdrop-filter: blur(8px);
  
  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.5;
    transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  }

  &:hover {
    background: rgba(230, 81, 0, 0.15);
    transform: scale(1.08);
    
    svg {
      transform: rotate(90deg);
    }
  }

  &:active {
    transform: scale(0.92);
  }
}


// 容器
.celebration-container {
  position: relative;
  padding: 52px 40px 44px;
  min-height: 300px;
  overflow: hidden;
  background: linear-gradient(135deg, #fff5e6 0%, #ffe9d0 50%, #fff5e6 100%);
  will-change: transform;
  transform: translateZ(0);
  
  @media (max-width: 768px) {
    padding: 40px 24px 32px;
    min-height: 280px;
  }
  
  // 装饰性渐变背景
  &::before {
    content: '';
    position: absolute;
    inset: -50%;
    background: 
      radial-gradient(circle at 30% 40%, rgba(255, 193, 7, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 70% 60%, rgba(255, 152, 0, 0.08) 0%, transparent 50%);
    animation: gentleRotate 20s linear infinite;
    pointer-events: none;
    will-change: transform;
    transform: translateZ(0);
  }
}

@keyframes gentleRotate {
  0% {
    transform: rotate(0deg) translateZ(0);
  }
  100% {
    transform: rotate(360deg) translateZ(0);
  }
}

// 礼花容器
.confetti-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  overflow: hidden;
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -20px;
  opacity: 0;
  border-radius: 2px;
  animation: confettiFall 2.5s ease-in infinite;
  will-change: transform;
  transform: translateZ(0);
}

@keyframes confettiFall {
  0% {
    transform: translateY(0) rotate(0deg) translateZ(0);
    opacity: 1;
  }
  15% {
    opacity: 1;
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(calc(100vh + 20px)) rotate(720deg) translateZ(0);
    opacity: 0;
  }
}

// 内容
.celebration-content {
  position: relative;
  z-index: 2;
  text-align: center;
}

// 图标
.celebration-icon {
  width: 96px;
  height: 96px;
  margin: 0 auto 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  position: relative;
  will-change: transform;
  animation: iconEntrance 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
  
  @media (max-width: 768px) {
    width: 80px;
    height: 80px;
    margin: 0 auto 22px;
  }
  
  .icon-bg {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    box-shadow: 
      0 8px 32px rgba(255, 152, 0, 0.3),
      0 0 0 0 rgba(255, 152, 0, 0.4);
    animation: iconPulse 2s ease-in-out infinite;
  }

  i {
    font-size: 48px;
    color: #fff;
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    
    @media (max-width: 768px) {
      font-size: 40px;
    }
  }

  &.type-success {
    .icon-bg {
      background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
      box-shadow: 
        0 8px 32px rgba(76, 175, 80, 0.3),
        0 0 0 0 rgba(76, 175, 80, 0.4);
    }
  }

  &.type-celebration {
    .icon-bg {
      background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    }
  }
}

@keyframes iconEntrance {
  0% {
    transform: scale(0) rotate(-180deg);
    opacity: 0;
  }
  60% {
    transform: scale(1.15) rotate(10deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
    opacity: 1;
  }
}

@keyframes iconPulse {
  0%, 100% {
    box-shadow: 
      0 8px 32px rgba(255, 152, 0, 0.3),
      0 0 0 0 rgba(255, 152, 0, 0.4);
  }
  50% {
    box-shadow: 
      0 12px 40px rgba(255, 152, 0, 0.4),
      0 0 0 12px rgba(255, 152, 0, 0);
  }
}

// 标题
.celebration-title {
  font-size: 32px;
  font-weight: 800;
  margin: 0 0 16px;
  background: linear-gradient(135deg, #e65100 0%, #f57c00 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: 0.5px;
  animation: titleSlide 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both;
  
  @media (max-width: 768px) {
    font-size: 26px;
  }
}

@keyframes titleSlide {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 消息
.celebration-message {
  font-size: 17px;
  margin: 0 0 10px;
  color: rgba(0, 0, 0, 0.8);
  line-height: 1.6;
  font-weight: 500;
  animation: fadeInUp 0.5s ease 0.3s both;
  position: relative;
  display: block;
  background: linear-gradient(
    90deg,
    rgba(230, 81, 0, 0.8) 0%,
    rgba(255, 152, 0, 1) 20%,
    rgba(255, 193, 7, 1) 40%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 193, 7, 1) 60%,
    rgba(255, 152, 0, 1) 80%,
    rgba(230, 81, 0, 0.8) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.5s ease 0.3s both, shimmerSweep 3s ease-in-out 1s infinite;
  
  @media (max-width: 768px) {
    font-size: 15px;
  }
}

.celebration-sub-message {
  font-size: 15px;
  margin: 0 0 12px;
  color: rgba(0, 0, 0, 0.6);
  line-height: 1.6;
  animation: fadeInUp 0.5s ease 0.4s both;
  position: relative;
  display: block;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.5) 0%,
    rgba(255, 152, 0, 0.8) 20%,
    rgba(255, 193, 7, 0.9) 40%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 193, 7, 0.9) 60%,
    rgba(255, 152, 0, 0.8) 80%,
    rgba(0, 0, 0, 0.5) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.5s ease 0.4s both, shimmerSweep 3s ease-in-out 1.5s infinite;
  
  @media (max-width: 768px) {
    font-size: 14px;
    margin: 0 0 10px;
  }
}

@keyframes shimmerSweep {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.celebration-thanks-message {
  font-size: 14px;
  margin: 0 0 20px;
  color: rgba(0, 0, 0, 0.5);
  line-height: 1.5;
  animation: fadeInUp 0.5s ease 0.5s both;
  position: relative;
  display: block;
  background: linear-gradient(
    90deg,
    rgba(0, 0, 0, 0.4) 0%,
    rgba(230, 81, 0, 0.7) 20%,
    rgba(255, 152, 0, 0.8) 40%,
    rgba(255, 255, 255, 1) 50%,
    rgba(255, 152, 0, 0.8) 60%,
    rgba(230, 81, 0, 0.7) 80%,
    rgba(0, 0, 0, 0.4) 100%
  );
  background-size: 200% 100%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: fadeInUp 0.5s ease 0.5s both, shimmerSweep 3s ease-in-out 2s infinite;
  
  @media (max-width: 768px) {
    font-size: 13px;
    margin: 0 0 18px;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 详情信息
.celebration-details {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 18px 22px;
  margin: 0 0 24px;
  border: 1px solid rgba(255, 152, 0, 0.2);
  box-shadow: 0 4px 16px rgba(255, 152, 0, 0.1);
  animation: fadeInUp 0.5s ease 0.5s both;
  
  @media (max-width: 768px) {
    padding: 14px 16px;
    margin: 0 0 20px;
    border-radius: 10px;
  }
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 224, 178, 0.25);
  transition: all 0.2s ease;
  gap: 12px;

  &:hover {
    padding: 12px 8px;
    margin: 0 -8px;
    background: linear-gradient(90deg, transparent, rgba(255, 193, 7, 0.06), transparent);
    border-radius: 8px;
    border-bottom-color: transparent;
  }

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }

  &:first-child {
    padding-top: 0;
  }
  
  @media (max-width: 768px) {
    padding: 10px 0;
    gap: 8px;
    flex-wrap: nowrap;
  }
}

.detail-label {
  font-size: 14px;
  color: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  gap: 7px;
  font-weight: 500;
  flex-shrink: 0;
  white-space: nowrap;

  i {
    font-size: 16px;
    color: #ff9800;
    width: 20px;
    text-align: center;
    flex-shrink: 0;
    opacity: 0.85;
  }
  
  @media (max-width: 768px) {
    font-size: 13px;
    gap: 6px;
    
    i {
      font-size: 14px;
      width: 16px;
    }
  }
}

.detail-value {
  font-size: 15px;
  font-weight: 700;
  color: #e65100;
  text-align: right;
  word-break: break-word;
  line-height: 1.4;
  overflow-wrap: break-word;
  max-width: 100%;
  flex: 1;
  min-width: 0;
  letter-spacing: 0.3px;
  
  @media (max-width: 768px) {
    font-size: 13px;
    line-height: 1.3;
  }
}

// 操作按钮
.celebration-actions {
  display: flex;
  gap: 14px;
  justify-content: center;
  margin-top: 32px;
  animation: fadeInUp 0.5s ease 0.6s both;
  flex-wrap: wrap;
  
  @media (max-width: 768px) {
    gap: 10px;
    margin-top: 24px;
  }
}

.celebration-btn {
  height: 48px;
  padding: 0 32px;
  font-size: 16px;
  border-radius: 24px;
  font-weight: 600;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 2px solid rgba(230, 81, 0, 0.2);
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  color: #e65100;
  position: relative;
  overflow: hidden;
  white-space: nowrap;

  i {
    margin-right: 8px;
    font-size: 15px;
  }
  
  @media (max-width: 768px) {
    height: 44px;
    padding: 0 24px;
    font-size: 14px;
    border-radius: 22px;
    flex: 1;
    min-width: 120px;
    max-width: 48%;
    
    i {
      margin-right: 6px;
      font-size: 13px;
    }
  }
  
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%);
    opacity: 0;
    transition: opacity 0.25s ease;
  }

  &:hover {
    border-color: #ff9800;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 152, 0, 0.25);
    
    &::before {
      opacity: 1;
    }
  }
  
  &:active {
    transform: translateY(0);
  }

  &.celebration-btn-primary {
    background: linear-gradient(135deg, #ffc107 0%, #ff9800 100%);
    border: none;
    color: #fff;
    box-shadow: 0 4px 16px rgba(255, 152, 0, 0.3);
    
    &::before {
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%);
    }

    &:hover {
      background: linear-gradient(135deg, #ffca28 0%, #ffa726 100%);
      box-shadow: 0 8px 24px rgba(255, 152, 0, 0.4);
      transform: translateY(-3px);
    }

    &:active {
      transform: translateY(-1px);
    }
  }
}

</style>

