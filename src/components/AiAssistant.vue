<template>
  <Teleport to="body">
    <div 
      v-if="isVisible"
      class="ai-assistant-wrapper"
      :class="{ 'is-collapsed': isCollapsed, 'is-dragging': isDragging }"
      :style="assistantStyle"
      ref="assistantRef"
    >
      <!-- 助理面板 -->
      <div class="ai-assistant-panel">
        <!-- 头部 -->
        <div 
          class="assistant-header"
          @mousedown="startDrag"
          @touchstart="startDragTouch"
          @click="isCollapsed && toggleCollapse()"
        >
          <div class="header-content">
            <div class="header-left">
              <div class="ai-icon">
                <i class="fas fa-robot"></i>
                <span class="pulse-dot"></span>
              </div>
              <div v-show="!isCollapsed" class="header-info">
                <h4 class="header-title">AI 助理</h4>
                <span class="header-status">
                  <span class="status-dot"></span>
                  在线
                </span>
              </div>
            </div>
            
            <div v-show="!isCollapsed" class="header-actions">
              <button 
                class="action-icon-btn"
                @click.stop="toggleCollapse"
                :title="isCollapsed ? '展开' : '折叠'"
              >
                <i :class="isCollapsed ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
              </button>
              <button 
                class="action-icon-btn close-btn"
                @click.stop="closeAssistant"
                title="关闭"
              >
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- 内容区域 -->
        <transition name="expand">
          <div v-show="!isCollapsed" class="assistant-content">
            <!-- 消息列表 -->
            <div class="messages-container" ref="messagesRef">
              <div 
                v-for="(msg, index) in messages" 
                :key="index"
                class="message-item"
                :class="msg.type"
              >
                <div class="message-avatar">
                  <i :class="msg.type === 'user' ? 'fas fa-user' : 'fas fa-robot'"></i>
                </div>
                <div class="message-content">
                  <div class="message-text">{{ msg.text }}</div>
                  <div class="message-time">{{ msg.time }}</div>
                </div>
              </div>
              
              <!-- 加载中状态 -->
              <div v-if="isTyping" class="message-item ai typing-indicator">
                <div class="message-avatar">
                  <i class="fas fa-robot"></i>
                </div>
                <div class="message-content">
                  <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            </div>

            <!-- 快捷操作 -->
            <div class="quick-actions">
              <button 
                v-for="action in quickActions" 
                :key="action.id"
                class="quick-action-btn"
                @click="handleQuickAction(action)"
              >
                <i :class="action.icon"></i>
                <span>{{ action.label }}</span>
              </button>
            </div>

            <!-- 输入区域 -->
            <div class="input-area">
              <div class="input-wrapper">
                <textarea
                  v-model="inputText"
                  class="message-input"
                  placeholder="有什么可以帮您的吗..."
                  rows="1"
                  @keydown.enter.prevent="handleSend"
                  ref="inputRef"
                ></textarea>
                <button 
                  class="send-btn"
                  :disabled="!inputText.trim()"
                  @click="handleSend"
                >
                  <i class="fas fa-paper-plane"></i>
                </button>
              </div>
            </div>
          </div>
        </transition>
      </div>

    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'

// 接口定义
interface Message {
  type: 'user' | 'ai'
  text: string
  time: string
}

interface QuickAction {
  id: string
  label: string
  icon: string
  prompt: string
}

// 响应式数据
const isVisible = ref(true)
const isCollapsed = ref(true)  // 默认折叠
const isDragging = ref(false)

// 根据屏幕宽度判断是否为移动端
const isMobile = () => window.innerWidth <= 768

// 初始位置 - 移动端贴右边，桌面端右上角
const getInitialPosition = () => {
  if (isMobile()) {
    return { x: window.innerWidth - 62, y: window.innerHeight - 120 }
  }
  return { x: window.innerWidth - 370, y: 80 }
}

const position = ref(getInitialPosition())
const dragStart = ref({ x: 0, y: 0 })
const inputText = ref('')
const isTyping = ref(false)
const unreadCount = ref(0)

const assistantRef = ref<HTMLElement | null>(null)
const messagesRef = ref<HTMLElement | null>(null)
const inputRef = ref<HTMLTextAreaElement | null>(null)

// 消息列表
const messages = ref<Message[]>([
  {
    type: 'ai',
    text: '你好！我是你的AI助理，有什么可以帮助你的吗？',
    time: formatTime(new Date())
  }
])

// 快捷操作
const quickActions: QuickAction[] = [
  { id: '1', label: '文章推荐', icon: 'fas fa-file-alt', prompt: '推荐一些优质文章' },
  { id: '2', label: '功能介绍', icon: 'fas fa-info-circle', prompt: '介绍网站功能' },
  { id: '3', label: '使用帮助', icon: 'fas fa-question-circle', prompt: '如何使用本站' },
  { id: '4', label: '联系客服', icon: 'fas fa-headset', prompt: '联系客服' }
]

// 计算样式
const assistantStyle = computed(() => ({
  left: `${position.value.x}px`,
  top: `${position.value.y}px`,
  cursor: isDragging.value ? 'grabbing' : 'auto'
}))

// 格式化时间
function formatTime(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${hours}:${minutes}`
}

// 拖拽功能 - 鼠标
function startDrag(e: MouseEvent) {
  isDragging.value = true
  dragStart.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y
  }
  
  document.addEventListener('mousemove', onDrag)
  document.addEventListener('mouseup', stopDrag)
}

function onDrag(e: MouseEvent) {
  if (!isDragging.value) return
  
  const newX = e.clientX - dragStart.value.x
  const newY = e.clientY - dragStart.value.y
  
// 边界限制
  const panelWidth = isMobile() && !isCollapsed.value ? window.innerWidth - 32 : isCollapsed.value ? 56 : 350
  const panelHeight = isCollapsed.value ? 56 : (isMobile() ? 420 : 480)
  const maxX = window.innerWidth - panelWidth
  const maxY = window.innerHeight - panelHeight
  
  position.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY))
  }
}

function stopDrag() {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 拖拽功能 - 触摸
function startDragTouch(e: TouchEvent) {
  const touch = e.touches[0]
  isDragging.value = true
  dragStart.value = {
    x: touch.clientX - position.value.x,
    y: touch.clientY - position.value.y
  }
  
  document.addEventListener('touchmove', onDragTouch)
  document.addEventListener('touchend', stopDragTouch)
}

function onDragTouch(e: TouchEvent) {
  if (!isDragging.value) return
  
  const touch = e.touches[0]
  const newX = touch.clientX - dragStart.value.x
  const newY = touch.clientY - dragStart.value.y
  
  const panelWidth = isMobile() && !isCollapsed.value ? window.innerWidth - 32 : isCollapsed.value ? 56 : 350
  const panelHeight = isCollapsed.value ? 56 : (isMobile() ? 420 : 480)
  const maxX = window.innerWidth - panelWidth
  const maxY = window.innerHeight - panelHeight
  
  position.value = {
    x: Math.max(0, Math.min(newX, maxX)),
    y: Math.max(0, Math.min(newY, maxY))
  }
}

function stopDragTouch() {
  isDragging.value = false
  document.removeEventListener('touchmove', onDragTouch)
  document.removeEventListener('touchend', stopDragTouch)
}

// 折叠/展开
function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
  if (!isCollapsed.value) {
    unreadCount.value = 0
    nextTick(() => {
      scrollToBottom()
      inputRef.value?.focus()
    })
  }
}

// 关闭助理
function closeAssistant() {
  isVisible.value = false
}

// 滚动到底部
function scrollToBottom() {
  if (messagesRef.value) {
    messagesRef.value.scrollTop = messagesRef.value.scrollHeight
  }
}

// 发送消息
async function handleSend() {
  const text = inputText.value.trim()
  if (!text) return
  
  // 添加用户消息
  messages.value.push({
    type: 'user',
    text,
    time: formatTime(new Date())
  })
  
  inputText.value = ''
  
  nextTick(() => scrollToBottom())
  
  // 模拟AI回复
  isTyping.value = true
  
  setTimeout(() => {
    isTyping.value = false
    messages.value.push({
      type: 'ai',
      text: getAIResponse(text),
      time: formatTime(new Date())
    })
    
    if (isCollapsed.value) {
      unreadCount.value++
    }
    
    nextTick(() => scrollToBottom())
  }, 1000 + Math.random() * 1000)
}

// 快捷操作处理
function handleQuickAction(action: QuickAction) {
  inputText.value = action.prompt
  handleSend()
}

// 获取AI回复（模拟）
function getAIResponse(text: string): string {
  const responses = [
    '这是一个很好的问题！让我为您详细解答...',
    '我理解您的需求，根据您的描述，我建议...',
    '感谢您的询问！这里有几个相关建议供您参考...',
    '我已经为您整理了相关信息，希望对您有所帮助！',
    '让我帮您分析一下这个问题...'
  ]
  
  return responses[Math.floor(Math.random() * responses.length)]
}

// 响应式调整位置
function adjustPosition() {
  const panelWidth = isMobile() && !isCollapsed.value ? window.innerWidth - 32 : isCollapsed.value ? 56 : 350
  const panelHeight = isCollapsed.value ? 56 : (isMobile() ? 420 : 480)
  const maxX = window.innerWidth - panelWidth
  const maxY = window.innerHeight - panelHeight
  
  position.value = {
    x: Math.min(position.value.x, maxX),
    y: Math.min(position.value.y, maxY)
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', adjustPosition)
  
  // 加载保存的位置
  const savedPosition = localStorage.getItem('ai-assistant-position')
  if (savedPosition) {
    try {
      position.value = JSON.parse(savedPosition)
    } catch (e) {
      console.error('Failed to parse saved position', e)
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', adjustPosition)
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
  document.removeEventListener('touchmove', onDragTouch)
  document.removeEventListener('touchend', stopDragTouch)
  
  // 保存位置
  localStorage.setItem('ai-assistant-position', JSON.stringify(position.value))
})
</script>

<style scoped lang="less">
// ==================== 变量 ====================
@primary-color: #8b5cf6;
@secondary-color: #d946ef;
@accent-color: #3b82f6;

// ==================== 主容器 ====================
.ai-assistant-wrapper {
  position: fixed;
  z-index: 9999;
  transition: opacity 0.3s ease;
  
  &.is-dragging {
    .ai-assistant-panel {
      box-shadow: 0 12px 48px rgba(139, 92, 246, 0.3);
      transform: scale(1.02);
    }
  }
}

// ==================== 面板容器 ====================
.ai-assistant-panel {
  width: 340px;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--el-border-color-lighter);
  backdrop-filter: blur(20px);
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  @media (max-width: 768px) {
    width: 320px;
  }
  
  @media (max-width: 480px) {
    width: calc(100vw - 32px);
  }
}

// 折叠状态
.is-collapsed .ai-assistant-panel {
  width: 56px;
  border-radius: 50%;
  box-shadow: 0 4px 20px rgba(139, 92, 246, 0.3);
}

// ==================== 头部 ====================
.assistant-header {
  padding: 10px 14px;
  background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
  cursor: grab;
  user-select: none;
  position: relative;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, transparent 100%);
    pointer-events: none;
  }
  
  &:active {
    cursor: grabbing;
  }
  
  // 折叠状态头部样式
  .is-collapsed & {
    width: 56px;
    height: 56px;
    padding: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
    }
    
    .header-content {
      justify-content: center;
    }
  }
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  position: relative;
  z-index: 1;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 0;
}

.ai-icon {
  position: relative;
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.18);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.25);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  
  &::before {
    content: '';
    position: absolute;
    top: 1px;
    left: 50%;
    transform: translateX(-50%);
    width: 70%;
    height: 40%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.25) 0%, transparent 100%);
    border-radius: 10px 10px 0 0;
    pointer-events: none;
  }
  
  i {
    font-size: 16px;
    color: white;
    animation: float 3s ease-in-out infinite;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    position: relative;
    z-index: 1;
  }
  
  .pulse-dot {
    position: absolute;
    top: 2px;
    right: 2px;
    width: 8px;
    height: 8px;
    background: #10b981;
    border-radius: 50%;
    border: 1.5px solid white;
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
    animation: pulse 2s infinite;
    z-index: 2;
  }
}

.header-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
  
  .header-title {
    margin: 0;
    font-size: 13px;
    font-weight: 700;
    color: white;
    text-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
    letter-spacing: 0.3px;
    line-height: 1.2;
  }
  
  .header-status {
    font-size: 11px;
    color: rgba(255, 255, 255, 0.9);
    display: flex;
    align-items: center;
    gap: 5px;
    font-weight: 500;
    line-height: 1;
    
    .status-dot {
      width: 6px;
      height: 6px;
      background: #10b981;
      border-radius: 50%;
      display: inline-block;
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7), 0 0 4px rgba(16, 185, 129, 0.6);
      animation: pulse 2s infinite;
    }
  }
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-shrink: 0;
}

.action-icon-btn {
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.25);
  background: rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
  border-radius: 7px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 13px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 50%;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, transparent 100%);
    pointer-events: none;
  }
  
  i {
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 1px 1px rgba(0, 0, 0, 0.15));
  }
  
  &:hover {
    background: rgba(255, 255, 255, 0.22);
    border-color: rgba(255, 255, 255, 0.35);
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
  }
  
  &:active {
    transform: translateY(0);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
  }
  
  &.close-btn {
    &:hover {
      background: rgba(239, 68, 68, 0.9);
      border-color: rgba(255, 255, 255, 0.3);
      
      &::before {
        background: linear-gradient(180deg, rgba(255, 255, 255, 0.2) 0%, transparent 100%);
      }
    }
  }
}

// ==================== 内容区域 ====================
.assistant-content {
  display: flex;
  flex-direction: column;
  height: 420px;
  
  @media (max-width: 768px) {
    height: 380px;
  }
}

.messages-container {
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  &::-webkit-scrollbar {
    width: 4px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--el-fill-color-lighter);
    border-radius: 2px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--el-fill-color-dark);
    border-radius: 2px;
    
    &:hover {
      background: var(--el-fill-color-darker);
    }
  }
}

// ==================== 消息项 ====================
.message-item {
  display: flex;
  gap: 10px;
  animation: slideIn 0.3s ease;
  
  &.user {
    flex-direction: row-reverse;
    
    .message-content {
      align-items: flex-end;
      
      .message-text {
        background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
        color: white;
        border-radius: 12px 12px 2px 12px;
      }
    }
  }
  
  &.ai {
    .message-text {
      background: var(--el-fill-color-light);
      color: var(--el-text-color-primary);
      border-radius: 12px 12px 12px 2px;
    }
  }
}

.message-avatar {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
  color: white;
  font-size: 12px;
  box-shadow: 0 2px 6px rgba(139, 92, 246, 0.2);
  
  .user & {
    background: var(--el-fill-color-dark);
    color: var(--el-text-color-regular);
  }
}

.message-content {
  display: flex;
  flex-direction: column;
  gap: 3px;
  max-width: 72%;
}

.message-text {
  padding: 8px 12px;
  font-size: 13px;
  line-height: 1.5;
  word-wrap: break-word;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.message-time {
  font-size: 10px;
  color: var(--el-text-color-placeholder);
  padding: 0 4px;
}

// ==================== 输入中指示器 ====================
.typing-indicator {
  .message-content {
    .typing-dots {
      display: flex;
      gap: 3px;
      padding: 8px 12px;
      background: var(--el-fill-color-light);
      border-radius: 12px 12px 12px 2px;
      
      span {
        width: 6px;
        height: 6px;
        background: var(--el-text-color-placeholder);
        border-radius: 50%;
        animation: typingDot 1.4s infinite;
        
        &:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        &:nth-child(3) {
          animation-delay: 0.4s;
        }
      }
    }
  }
}

// ==================== 快捷操作 ====================
.quick-actions {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
  padding: 10px 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: var(--el-fill-color-extra-light);
}

.quick-action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 7px 10px;
  border: 1px solid var(--el-border-color-light);
  background: var(--el-bg-color);
  border-radius: 6px;
  cursor: pointer;
  font-size: 11px;
  font-weight: 600;
  color: var(--el-text-color-regular);
  transition: all 0.2s ease;
  
  i {
    font-size: 11px;
    color: @primary-color;
  }
  
  &:hover {
    background: var(--el-color-primary-light-9);
    border-color: @primary-color;
    color: @primary-color;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(139, 92, 246, 0.12);
  }
  
  &:active {
    transform: translateY(0);
  }
}

// ==================== 输入区域 ====================
.input-area {
  padding: 10px 12px;
  border-top: 1px solid var(--el-border-color-lighter);
  background: var(--el-bg-color);
}

.input-wrapper {
  display: flex;
  gap: 6px;
  align-items: flex-end;
}

.message-input {
  flex: 1;
  padding: 8px 10px;
  border: 1px solid var(--el-border-color-light);
  background: var(--el-fill-color-extra-light);
  border-radius: 8px;
  font-size: 13px;
  color: var(--el-text-color-primary);
  resize: none;
  max-height: 80px;
  font-family: inherit;
  transition: all 0.2s ease;
  
  &:focus {
    outline: none;
    border-color: @primary-color;
    background: var(--el-bg-color);
    box-shadow: 0 0 0 2px rgba(139, 92, 246, 0.1);
  }
  
  &::placeholder {
    color: var(--el-text-color-placeholder);
  }
}

.send-btn {
  width: 34px;
  height: 34px;
  border: none;
  background: linear-gradient(135deg, @primary-color 0%, @secondary-color 100%);
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  box-shadow: 0 3px 8px rgba(139, 92, 246, 0.25);
  
  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}


// ==================== 动画 ====================
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-4px);
  }
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.7);
  }
  50% {
    box-shadow: 0 0 0 6px rgba(16, 185, 129, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(16, 185, 129, 0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes typingDot {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.4;
  }
  30% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

// ==================== 展开/折叠动画 ====================
.expand-enter-active,
.expand-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top;
}

.expand-enter-from,
.expand-leave-to {
  opacity: 0;
  transform: scaleY(0.95);
  max-height: 0;
}

.expand-enter-to,
.expand-leave-from {
  opacity: 1;
  transform: scaleY(1);
  max-height: 500px;
}

// ==================== 淡入淡出动画 ====================
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// ==================== 响应式 ====================
@media (max-width: 768px) {
  .ai-assistant-panel {
    width: calc(100vw - 32px);
    max-width: 380px;
  }
  
  .assistant-header {
    padding: 9px 12px;
  }
  
  .header-content {
    gap: 10px;
  }
  
  .header-left {
    gap: 9px;
  }
  
  .ai-icon {
    width: 30px;
    height: 30px;
    border-radius: 8px;
    
    i {
      font-size: 15px;
    }
    
    .pulse-dot {
      width: 7px;
      height: 7px;
      top: 1px;
      right: 1px;
    }
  }
  
  .header-info {
    gap: 2px;
    
    .header-title {
      font-size: 12px;
    }
    
    .header-status {
      font-size: 10px;
      gap: 4px;
      
      .status-dot {
        width: 5px;
        height: 5px;
      }
    }
  }
  
  .action-icon-btn {
    width: 26px;
    height: 26px;
    font-size: 11px;
    border-radius: 6px;
  }
  
  .messages-container {
    padding: 10px;
    gap: 8px;
  }
  
  .message-avatar {
    width: 26px;
    height: 26px;
    font-size: 11px;
  }
  
  .message-text {
    padding: 7px 10px;
    font-size: 12px;
  }
  
  .quick-actions {
    padding: 8px 10px;
    gap: 5px;
  }
  
  .quick-action-btn {
    padding: 6px 8px;
    font-size: 10px;
    
    i {
      font-size: 10px;
    }
  }
  
  .input-area {
    padding: 8px 10px;
  }
  
  .message-input {
    padding: 7px 9px;
    font-size: 12px;
  }
  
  .send-btn {
    width: 32px;
    height: 32px;
    font-size: 13px;
  }
  
}

// 小屏幕额外优化
@media (max-width: 480px) {
  .ai-assistant-panel {
    width: calc(100vw - 24px);
  }
  
  .assistant-content {
    height: 360px;
  }
  
  .assistant-header {
    padding: 8px 10px;
  }
  
  .header-content {
    gap: 8px;
  }
  
  .header-left {
    gap: 8px;
  }
  
  .ai-icon {
    width: 28px;
    height: 28px;
    border-radius: 7px;
    
    i {
      font-size: 14px;
    }
  }
  
  .header-info {
    gap: 1px;
    
    .header-title {
      font-size: 11px;
      letter-spacing: 0.2px;
    }
    
    .header-status {
      font-size: 9px;
      gap: 3px;
      
      .status-dot {
        width: 4px;
        height: 4px;
      }
    }
  }
  
  .action-icon-btn {
    width: 24px;
    height: 24px;
    font-size: 10px;
  }
  
}
</style>

