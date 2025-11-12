<template>
  <div class="account-settings-container animate__animated animate__fadeInLeft animate__faster">
    <!-- 基本信息 -->
    <div 
      class="setting-card animate__animated animate__fadeInUp animate__faster"
      style="animation-delay: 0.08s"
    >
      <div class="card-main">
        <div class="card-info">
          <div class="title-wrapper">
            <div class="title-icon animate__animated animate__zoomIn animate__faster" style="animation-delay: 0.15s">
              <i class="fas fa-user-circle"></i>
            </div>
            <h4 class="setting-title">基本信息</h4>
          </div>
          <div class="input-group">
            <input 
              v-model="form.username" 
              type="text" 
              class="setting-input" 
              placeholder="请输入用户名"
            />
            <input 
              v-model="form.email" 
              type="email" 
              class="setting-input" 
              placeholder="请输入邮箱地址"
            />
            <textarea 
              v-model="form.bio" 
              class="setting-textarea" 
              placeholder="个人简介"
              rows="2"
              maxlength="200"
            ></textarea>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐私设置 -->
    <div 
      class="setting-card animate__animated animate__fadeInUp animate__faster"
      style="animation-delay: 0.16s"
    >
      <div class="card-main">
        <div class="card-info">
          <div class="title-wrapper">
            <div class="title-icon privacy animate__animated animate__zoomIn animate__faster" style="animation-delay: 0.23s">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h4 class="setting-title">隐私设置</h4>
          </div>
          <div class="switch-group">
            <div class="switch-row" @click="privacy.publicProfile = !privacy.publicProfile">
              <span class="switch-text">公开个人资料</span>
              <div :class="['switch', { on: privacy.publicProfile }]"></div>
            </div>
            <div class="switch-row" @click="privacy.showEmail = !privacy.showEmail">
              <span class="switch-text">显示邮箱地址</span>
              <div :class="['switch', { on: privacy.showEmail }]"></div>
            </div>
            <div class="switch-row" @click="privacy.allowFollow = !privacy.allowFollow">
              <span class="switch-text">允许其他人关注</span>
              <div :class="['switch', { on: privacy.allowFollow }]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 通知设置 -->
    <div 
      class="setting-card animate__animated animate__fadeInUp animate__faster"
      style="animation-delay: 0.24s"
    >
      <div class="card-main">
        <div class="card-info">
          <div class="title-wrapper">
            <div class="title-icon notification animate__animated animate__zoomIn animate__faster" style="animation-delay: 0.31s">
              <i class="fas fa-bell"></i>
            </div>
            <h4 class="setting-title">通知设置</h4>
          </div>
          <div class="switch-group">
            <div class="switch-row" @click="notifications.comments = !notifications.comments">
              <span class="switch-text">评论通知</span>
              <div :class="['switch', { on: notifications.comments }]"></div>
            </div>
            <div class="switch-row" @click="notifications.likes = !notifications.likes">
              <span class="switch-text">点赞通知</span>
              <div :class="['switch', { on: notifications.likes }]"></div>
            </div>
            <div class="switch-row" @click="notifications.follows = !notifications.follows">
              <span class="switch-text">关注通知</span>
              <div :class="['switch', { on: notifications.follows }]"></div>
            </div>
            <div class="switch-row" @click="notifications.system = !notifications.system">
              <span class="switch-text">系统通知</span>
              <div :class="['switch', { on: notifications.system }]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 保存按钮 -->
    <div class="action-bar animate__animated animate__zoomIn animate__faster" style="animation-delay: 0.4s">
      <button class="btn-save" @click="handleSave" :disabled="saving">
        <i class="fas fa-save"></i>
        {{ saving ? '保存中...' : '保存设置' }}
      </button>
      <button class="btn-reset" @click="handleReset">
        <i class="fas fa-undo"></i>
        重置
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'

interface FormData {
  username: string
  email: string
  bio: string
}

const form = reactive<FormData>({
  username: 'BitlE开发者',
  email: 'dev@example.com',
  bio: '热爱技术,专注前端开发'
})

const privacy = reactive({
  publicProfile: true,
  showEmail: false,
  allowFollow: true
})

const notifications = reactive({
  comments: true,
  likes: true,
  follows: true,
  system: true
})

const saving = ref(false)

const emit = defineEmits<{
  save: [data: { form: FormData; privacy: typeof privacy; notifications: typeof notifications }]
  message: [type: 'success' | 'info', text: string]
}>()

const handleSave = () => {
  saving.value = true
  
  setTimeout(() => {
    saving.value = false
    emit('message', 'success', '设置保存成功')
    emit('save', { form, privacy, notifications })
  }, 1000)
}

const handleReset = () => {
  form.username = 'BitlE开发者'
  form.email = 'dev@example.com'
  form.bio = '热爱技术,专注前端开发'
  
  privacy.publicProfile = true
  privacy.showEmail = false
  privacy.allowFollow = true
  
  notifications.comments = true
  notifications.likes = true
  notifications.follows = true
  notifications.system = true
  
  emit('message', 'info', '已重置为默认设置')
}
</script>

<style lang="less" scoped>
.account-settings-container {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 768px) {
    padding: 12px;
  }
}

.setting-card {
  padding: 16px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

  &:hover {
    border-color: var(--theme-purple-primary);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.12);
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    padding: 12px;
  }
}

.card-main {
  display: flex;
  flex-direction: column;
}

.card-info {
  flex: 1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 14px;
    gap: 10px;
  }
}

.title-icon {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(167, 139, 250, 0.1));
  border-radius: 10px;
  color: var(--theme-purple-primary);
  font-size: 16px;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &.privacy {
    background: linear-gradient(135deg, rgba(14, 165, 233, 0.1), rgba(56, 189, 248, 0.1));
    color: #0ea5e9;
  }

  &.notification {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.1), rgba(251, 191, 36, 0.1));
    color: #f59e0b;
  }

  @media (max-width: 768px) {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }
}

.setting-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
  letter-spacing: 0.3px;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 14px;
  }
}

.title-wrapper::after {
  content: '';
  flex: 1;
  height: 1px;
  background: linear-gradient(to right, var(--el-border-color-light), transparent);
  margin-left: 16px;

  @media (max-width: 768px) {
    margin-left: 12px;
  }
}

// 输入框组
.input-group {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting-input,
.setting-textarea {
  width: 100%;
  padding: 10px 12px;
  background: var(--el-fill-color-light);
  border: 1px solid transparent;
  border-radius: 8px;
  font-size: 13px;
  color: var(--el-text-color-primary);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  outline: none;
  box-sizing: border-box;

  &::placeholder {
    color: var(--el-text-color-placeholder);
    transition: color 0.3s ease;
  }

  &:hover {
    background: var(--el-fill-color);
    border-color: var(--el-border-color);
    transform: translateY(-1px);
  }

  &:focus {
    border-color: var(--theme-purple-primary);
    background: var(--el-bg-color);
    box-shadow: 0 0 0 3px var(--theme-orange-shadow);
    transform: translateY(-1px);

    &::placeholder {
      color: transparent;
    }
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 10px;
  }
}

.setting-textarea {
  resize: vertical;
  line-height: 1.5;
  min-height: 60px;
}

// 开关组
.switch-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.switch-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;

  &:hover {
    background: var(--el-fill-color);
    border-color: var(--el-border-color);
    
    .switch-text {
      color: var(--theme-purple-primary);
    }
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
  }
}

.switch-text {
  font-size: 13px;
  color: var(--el-text-color-regular);
  font-weight: 500;
  transition: color 0.2s ease;

  @media (max-width: 768px) {
    font-size: 12px;
  }
}

.switch {
  position: relative;
  width: 40px;
  height: 22px;
  background: #e5e7eb;
  border-radius: 11px;
  transition: all 0.3s ease;
  flex-shrink: 0;

  &::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 16px;
    height: 16px;
    background: white;
    border-radius: 50%;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  }

  &.on {
    background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));

    &::after {
      left: 21px;
    }
  }
}

// 操作栏
.action-bar {
  display: flex;
  gap: 10px;
  justify-content: flex-end;

  @media (max-width: 768px) {
    gap: 8px;
  }
}

.btn-save,
.btn-reset {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;

  i {
    font-size: 13px;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    padding: 8px 16px;
  }
}

.btn-save {
  background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
  color: white;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-reset {
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
  border: 1px solid var(--el-border-color);

  &:hover {
    border-color: var(--theme-purple-primary);
    color: var(--theme-purple-primary);
    transform: translateY(-2px);
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.15);
  }

  &:active {
    transform: translateY(0);
  }
}
</style>
