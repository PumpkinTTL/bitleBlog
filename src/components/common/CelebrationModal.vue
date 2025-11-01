<template>
  <el-dialog
    v-model="visibleValue"
    :width="dialogWidth"
    center
    destroy-on-close
    :show-close="true"
    class="celebration-modal"
    @close="handleClose"
  >
    <div class="celebration-container">
      <!-- 礼花动画容器 -->
      <div v-if="showConfetti" class="confetti-container" ref="confettiRef">
        <div v-for="i in 50" :key="i" class="confetti" :style="getConfettiStyle(i)"></div>
      </div>

      <!-- 主要内容 -->
      <div class="celebration-content">
        <!-- 图标动画 -->
        <div class="celebration-icon" :class="`type-${type}`">
          <i :class="iconClass"></i>
        </div>

        <!-- 标题 -->
        <h2 class="celebration-title">{{ title }}</h2>

        <!-- 主要消息 -->
        <p class="celebration-message">{{ message }}</p>

        <!-- 副消息 -->
        <p v-if="subMessage" class="celebration-sub-message">{{ subMessage }}</p>

        <!-- 详情信息 -->
        <div v-if="details && details.length" class="celebration-details">
          <div
            v-for="(detail, index) in details"
            :key="index"
            class="detail-item"
            :style="{ animationDelay: `${index * 0.1}s` }"
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
          <el-button
            v-for="(action, index) in actions"
            :key="index"
            :type="action.type || 'default'"
            @click="handleAction(action)"
          >
            <i v-if="action.icon" :class="action.icon"></i>
            {{ action.text }}
          </el-button>
        </div>
      </div>
    </div>
  </el-dialog>
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
  animationType?: 'confetti' | 'fireworks' | 'particles'
  showConfetti?: boolean
  autoClose?: boolean
  autoCloseDelay?: number
  details?: CelebrationDetail[]
  actions?: CelebrationAction[]
}

const props = withDefaults(defineProps<Props>(), {
  title: '🎉 恭喜!',
  message: '操作成功!',
  type: 'celebration',
  animationType: 'confetti',
  showConfetti: true,
  autoClose: false,
  autoCloseDelay: 3000,
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
const confettiRef = ref<HTMLElement>()
const dialogWidth = ref('600px')
let autoCloseTimer: NodeJS.Timeout | null = null

// 计算属性
const visibleValue = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
})

const iconClass = computed(() => {
  if (props.type === 'success') {
    return 'fas fa-check-circle'
  }
  return 'fas fa-gift'
})

// 方法
const updateDialogWidth = () => {
  if (window.innerWidth <= 480) {
    dialogWidth.value = '95%'
  } else if (window.innerWidth <= 768) {
    dialogWidth.value = '85%'
  } else {
    dialogWidth.value = '600px'
  }
}

const getConfettiStyle = (index: number) => {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#a29bfe', '#fd79a8', '#fdcb6e']
  const randomColor = colors[Math.floor(Math.random() * colors.length)]
  const randomLeft = Math.random() * 100
  const randomDelay = Math.random() * 3
  const randomDuration = 3 + Math.random() * 2

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
  emit('close')
}

const handleAction = (action: CelebrationAction) => {
  action.handler()
  emit('action', action.text)
}

// 监听 visible 变化
watch(() => props.visible, (newVal) => {
  if (newVal && props.autoClose) {
    autoCloseTimer = setTimeout(() => {
      visibleValue.value = false
    }, props.autoCloseDelay)
  }
})

// 生命周期
onMounted(() => {
  updateDialogWidth()
  window.addEventListener('resize', updateDialogWidth)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDialogWidth)
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer)
  }
})
</script>

<style scoped lang="less">
// 对话框全局样式
.celebration-modal {
  :deep(.el-dialog) {
    border-radius: 20px;
    overflow: hidden;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 25px 70px rgba(0, 0, 0, 0.3);
    padding: 0;
  }

  :deep(.el-dialog__header) {
    display: none;
  }

  :deep(.el-dialog__body) {
    padding: 0;
  }

  :deep(.el-dialog__headerbtn) {
    top: 20px;
    right: 20px;
    width: 36px;
    height: 36px;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    backdrop-filter: blur(10px);

    .el-dialog__close {
      color: #fff;
      font-size: 18px;
      font-weight: bold;

      &:hover {
        color: #fff;
      }
    }
  }
}

// 容器
.celebration-container {
  position: relative;
  padding: 60px 40px;
  min-height: 400px;
  overflow: hidden;
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
}

.confetti {
  position: absolute;
  width: 10px;
  height: 10px;
  top: -10px;
  opacity: 0;
  animation: confettiFall linear infinite;
}

@keyframes confettiFall {
  0% {
    top: -10px;
    opacity: 1;
    transform: rotate(0deg);
  }
  100% {
    top: 100%;
    opacity: 0;
    transform: rotate(720deg);
  }
}

// 内容
.celebration-content {
  position: relative;
  z-index: 2;
  text-align: center;
  color: #fff;
}

// 图标
.celebration-icon {
  width: 100px;
  height: 100px;
  margin: 0 auto 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
  animation: iconBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);

  i {
    font-size: 50px;
    color: #fff;
  }

  &.type-success {
    background: rgba(76, 217, 100, 0.3);
  }

  &.type-celebration {
    background: rgba(255, 204, 0, 0.3);
  }
}

@keyframes iconBounce {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

// 标题
.celebration-title {
  font-size: 32px;
  font-weight: bold;
  margin: 0 0 15px;
  animation: fadeInUp 0.6s ease 0.2s both;
}

// 消息
.celebration-message {
  font-size: 18px;
  margin: 0 0 10px;
  opacity: 0.95;
  animation: fadeInUp 0.6s ease 0.3s both;
}

.celebration-sub-message {
  font-size: 14px;
  margin: 0 0 30px;
  opacity: 0.8;
  animation: fadeInUp 0.6s ease 0.4s both;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 详情信息
.celebration-details {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 25px;
  margin: 30px 0;
  animation: fadeInUp 0.6s ease 0.5s both;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  animation: slideInLeft 0.5s ease both;

  &:last-child {
    border-bottom: none;
  }
}

.detail-label {
  font-size: 14px;
  opacity: 0.9;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 16px;
  }
}

.detail-value {
  font-size: 16px;
  font-weight: 600;
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 操作按钮
.celebration-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-top: 30px;
  animation: fadeInUp 0.6s ease 0.6s both;

  .el-button {
    padding: 12px 30px;
    font-size: 15px;
    border-radius: 25px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;

    i {
      margin-right: 6px;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
      background: rgba(255, 255, 255, 0.3);
      border-color: rgba(255, 255, 255, 0.5);
    }

    &.el-button--primary {
      background: rgba(255, 255, 255, 0.95);
      color: #667eea;
      border-color: transparent;

      &:hover {
        background: #fff;
        color: #667eea;
      }
    }
  }
}

// 响应式
@media (max-width: 768px) {
  .celebration-container {
    padding: 40px 20px;
  }

  .celebration-icon {
    width: 80px;
    height: 80px;

    i {
      font-size: 40px;
    }
  }

  .celebration-title {
    font-size: 24px;
  }

  .celebration-message {
    font-size: 16px;
  }

  .celebration-actions {
    flex-direction: column;

    .el-button {
      width: 100%;
    }
  }
}
</style>

