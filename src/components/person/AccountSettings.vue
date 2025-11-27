<template>
  <div class="account-settings-container animate__animated animate__fadeInLeft animate__faster">
    <!-- 个人资料设置 -->
    <div
      class="setting-card animate__animated animate__fadeInUp animate__faster"
      style="animation-delay: 0.08s"
    >
      <div class="card-main">
        <div class="card-info">
          <div class="title-wrapper">
            <div class="title-icon animate__animated animate__zoomIn animate__faster" style="animation-delay: 0.15s">
              <i class="fas fa-user-edit"></i>
            </div>
            <h4 class="setting-title">个人资料</h4>
          </div>
          <div class="profile-content">
            <!-- 头像区域 -->
            <div class="profile-avatar-section">
              <div class="avatar-upload-wrapper">
                <div class="avatar-preview-small" @click="triggerAvatarUpload">
                  <el-avatar :size="64" :src="avatarPreviewUrl || form.avatar" class="profile-avatar">
                    {{ form.username ? form.username.charAt(0) : 'U' }}
                  </el-avatar>
                  <div class="avatar-edit-overlay">
                    <i class="fas fa-camera"></i>
                  </div>
                </div>
                <input
                  ref="avatarInput"
                  type="file"
                  accept="image/*"
                  style="display: none"
                  @change="handleAvatarChange"
                />
                <div class="avatar-tips-compact">
                  <i class="fas fa-info-circle"></i>
                  <span>JPG/PNG，最大2MB</span>
                </div>
                <div v-if="avatarPreviewUrl" class="avatar-actions-compact">
                  <button class="btn-save-small" @click="saveAvatar" :disabled="uploading">
                    <i v-if="!uploading" class="fas fa-check"></i>
                    <i v-else class="fas fa-spinner fa-spin"></i>
                    {{ uploading ? '上传中...' : '确认上传' }}
                  </button>
                  <button class="btn-cancel-small" @click="cancelAvatar" :disabled="uploading">
                    <i class="fas fa-times"></i>
                    取消
                  </button>
                </div>
              </div>
            </div>

            <!-- 表单区域 -->
            <div class="profile-form-section">
              <div class="input-group-compact animate__animated animate__fadeInUp" style="animation-delay: 0.1s">
                <div class="input-row">
                  <div class="input-wrapper-compact animate__animated animate__fadeInLeft" style="animation-delay: 0.2s">
                    <label class="input-label-compact">用户名</label>
                    <input
                      v-model="form.username"
                      type="text"
                      class="setting-input-compact"
                      placeholder="请输入用户名"
                      maxlength="20"
                    />
                    <span class="input-counter-compact">{{ form.username.length }}/20</span>
                  </div>
                  <div class="input-wrapper-compact animate__animated animate__fadeInRight" style="animation-delay: 0.2s">
                    <label class="input-label-compact">邮箱地址</label>
                    <input
                      v-model="form.email"
                      type="email"
                      class="setting-input-compact"
                      placeholder="请输入邮箱地址"
                    />
                  </div>
                </div>

                <div class="input-wrapper-compact animate__animated animate__fadeInLeft" style="animation-delay: 0.3s">
                  <label class="input-label-compact">个人简介</label>
                  <textarea
                    v-model="form.bio"
                    class="setting-textarea-compact"
                    placeholder="介绍一下自己吧..."
                    rows="2"
                    maxlength="200"
                  ></textarea>
                  <span class="input-counter-compact">{{ form.bio.length }}/200</span>
                </div>

                <div class="input-wrapper-compact animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
                  <label class="input-label-compact">性别</label>
                  <div class="gender-options-compact">
                    <label class="gender-option-compact animate__animated animate__fadeIn" :class="{ active: form.gender === 1 }" style="animation-delay: 0.5s">
                      <input type="radio" v-model="form.gender" :value="1" />
                      <i class="fas fa-mars"></i>
                      <span>男</span>
                    </label>
                    <label class="gender-option-compact animate__animated animate__fadeIn" :class="{ active: form.gender === 2 }" style="animation-delay: 0.6s">
                      <input type="radio" v-model="form.gender" :value="2" />
                      <i class="fas fa-venus"></i>
                      <span>女</span>
                    </label>
                    <label class="gender-option-compact animate__animated animate__fadeIn" :class="{ active: form.gender === 0 }" style="animation-delay: 0.7s">
                      <input type="radio" v-model="form.gender" :value="0" />
                      <i class="fas fa-genderless"></i>
                      <span>保密</span>
                    </label>
                  </div>
                </div>

                  </div>
            </div>
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
        <div class="btn-content">
          <i v-if="!saving" class="fas fa-save"></i>
          <i v-else class="fas fa-spinner fa-spin"></i>
          <span>{{ saving ? '保存中...' : '保存设置' }}</span>
        </div>
      </button>
      <button class="btn-reset" @click="handleReset" :disabled="saving">
        <i class="fas fa-undo"></i>
        <span>重置</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue'
import { useStore } from '@/store'
import { ElAvatar } from 'element-plus'
import { uploadUserAvatarR } from '@/request/upload'
import { smartMessage } from '@/components/modal'

interface FormData {
  username: string
  email: string
  bio: string
  avatar: string
  gender: number
}

const store = useStore()
const avatarInput = ref<HTMLInputElement>()
const uploading = ref(false)
const avatarPreviewUrl = ref('')

// 初始化表单数据 - 从store中获取用户信息
const initFormData = () => {
  const userInfo = store.userInfo as any
  return {
    username: userInfo?.username || userInfo?.nickname || '',
    email: userInfo?.email || '',
    bio: userInfo?.signature || userInfo?.bio || '',
    avatar: userInfo?.avatar || userInfo?.headImg || '',
    gender: userInfo?.gender || 0
  }
}

const form = reactive<FormData>(initFormData())

// 监听store中用户信息的变化
watch(() => store.userInfo, (newUserInfo) => {
  if (newUserInfo) {
    const userInfo = newUserInfo as any
    Object.assign(form, {
      username: userInfo?.username || userInfo?.nickname || '',
      email: userInfo?.email || '',
      bio: userInfo?.signature || userInfo?.bio || '',
      avatar: userInfo?.avatar || userInfo?.headImg || '',
      gender: userInfo?.gender || 0
    })
  }
}, { immediate: true, deep: true })

// 组件挂载时重新加载数据
onMounted(() => {
  const userInfo = store.userInfo as any
  if (userInfo) {
    Object.assign(form, {
      username: userInfo?.username || userInfo?.nickname || '',
      email: userInfo?.email || '',
      bio: userInfo?.signature || userInfo?.bio || '',
      avatar: userInfo?.avatar || userInfo?.headImg || '',
      gender: userInfo?.gender || 0
    })
  }
})

// 头像相关方法
const triggerAvatarUpload = () => {
  avatarInput.value?.click()
}

const handleAvatarChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  if (target.files && target.files[0]) {
    const file = target.files[0]

    // 创建本地预览（立即显示，不上传）
    const reader = new FileReader()
    reader.onload = (e) => {
      avatarPreviewUrl.value = e.target?.result as string
    }
    reader.readAsDataURL(file)
  }
}

const saveAvatar = async () => {
  if (!avatarInput.value?.files?.[0]) return

  uploading.value = true

  try {
    // 获取用户ID
    const userInfo = store.userInfo as any
    const userId = userInfo?.id

    // 使用封装的上传方法
    const response = await uploadUserAvatarR(avatarInput.value.files[0], userId) as any
    
    // 调试信息
    console.log('上传响应:', response)

    // 根据API文档返回格式处理响应
    // Axios拦截器已经返回了response.data，所以直接使用response
    // code 200: 新文件上传成功
    // code 201: 文件已存在，使用现有文件
    if (response.code === 200 || response.code === 201) {
      // data是数组，取第一个文件的url
      const uploadedFile = response.data[0]
      console.log('上传文件信息:', uploadedFile)
      
      if (uploadedFile && uploadedFile.url) {
        form.avatar = uploadedFile.url
        // 根据是否重复文件显示不同消息
        if (uploadedFile.is_duplicate || response.code === 201||response.code === 200) {
          smartMessage.success('头像更新成功')
        } 
        avatarPreviewUrl.value = ''

        // 触发保存事件，通知父组件更新数据
        emit('save', { form, privacy, notifications })
      } else {
        console.error('文件信息不完整:', uploadedFile)
        throw new Error('上传响应格式错误')
      }
    } else {
      console.error('上传失败，状态码:', response.code, '消息:', response.msg)
      throw new Error(response.msg || '上传失败')
    }
  } catch (error: any) {
    smartMessage.error(error.message || '头像上传失败')
    // 保持预览状态，让用户可以重新尝试
    return
  } finally {
    uploading.value = false
  }
}

const cancelAvatar = () => {
  avatarPreviewUrl.value = ''
  if (avatarInput.value) {
    avatarInput.value.value = ''
  }
}


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
    emit('message', 'success', '个人资料保存成功')
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
  border-radius: 6px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);

  
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
  justify-content: space-between;
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

  &.avatar {
    background: linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(74, 222, 128, 0.1));
    color: #22c55e;
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

// 个人资料内容区域
.profile-content {
  display: flex;
  flex-direction: column;
  gap: 24px;

  @media (max-width: 768px) {
    gap: 20px;
  }
}

// 头像区域
.profile-avatar-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 10px;
  }
}

.avatar-upload-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.avatar-preview-small {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: none;

    .avatar-edit-overlay {
      opacity: 1;
      background: rgba(0, 0, 0, 0.6);
    }
  }

  .profile-avatar {
    border: 3px solid var(--el-border-color-light);
    box-shadow: none;
    transition: all 0.2s ease;
  }

  .avatar-edit-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.3s ease;

    i {
      font-size: 18px;
      color: white;
    }
  }
}

.avatar-tips-compact {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 10px;
  color: var(--el-text-color-placeholder);

  i {
    font-size: 10px;
    color: var(--el-color-info);
  }

  @media (max-width: 768px) {
    font-size: 9px;
  }
}

.avatar-actions-compact {
  display: flex;
  gap: 6px;

  @media (max-width: 768px) {
    gap: 4px;
  }
}

.btn-save-small,
.btn-cancel-small {
  display: flex;
  align-items: center;
  gap: 3px;
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;

  i {
    font-size: 8px;
  }

  @media (max-width: 768px) {
    font-size: 9px;
    padding: 3px 6px;
  }
}

.btn-save-small {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  box-shadow: 0 1px 4px rgba(34, 197, 94, 0.2);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(34, 197, 94, 0.3);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none !important;
    
    .fa-spinner {
      animation: spin 1s linear infinite;
    }
  }
}

.btn-cancel-small {
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
  border: 1px solid var(--el-border-color);

  &:hover:not(:disabled) {
    border-color: #ef4444;
    color: #ef4444;
    transform: translateY(-1px);
    box-shadow: 0 1px 4px rgba(239, 68, 68, 0.2);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }
}

// 表单区域
.profile-form-section {
  flex: 1;
}

.input-group-compact {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}

.input-wrapper-compact {
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;

  &:has(> textarea) {
    .input-counter-compact {
      position: absolute;
      bottom: 6px;
      right: 8px;
      background: var(--el-bg-color);
      padding: 0 3px;
      border-radius: 3px;
      font-size: 9px;
      color: var(--el-text-color-placeholder);
    }
  }
}

.input-label-compact {
  font-size: 11px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 1px;
  display: flex;
  align-items: center;
  gap: 3px;

  &::before {
    content: '';
    width: 2px;
    height: 2px;
    background: var(--theme-purple-primary);
    border-radius: 50%;
    flex-shrink: 0;
  }
}

.setting-input-compact,
.setting-textarea-compact {
  width: 100%;
  padding: 8px 10px;
  background: var(--el-fill-color-light);
  border: 1px solid transparent;
  border-radius: 6px;
  font-size: 12px;
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
    transform: none;
  }

  &:focus {
    border-color: var(--theme-purple-primary);
    background: var(--el-bg-color);
    box-shadow: 0 0 0 2px var(--theme-orange-shadow);
    transform: none;

    &::placeholder {
      color: transparent;
    }
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 6px 8px;
  }
}

.setting-textarea-compact {
  resize: vertical;
  line-height: 1.4;
  min-height: 60px;
  padding-bottom: 20px; // 为计数器留出空间

  &:hover {
    transform: none;
  }

  &:focus {
    transform: none;
    box-shadow: none;
  }
}

.input-counter-compact {
  font-size: 9px;
  color: var(--el-text-color-placeholder);
  text-align: right;
  margin-top: 1px;
}

// 紧凑性别选择器
.gender-options-compact {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.gender-option-compact {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 10px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  background: var(--el-fill-color-light);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 11px;
  color: var(--el-text-color-regular);
  user-select: none;

  input[type="radio"] {
    display: none;
  }

  i {
    font-size: 12px;
    transition: all 0.2s ease;
  }

  &:hover {
    border-color: var(--theme-purple-primary);
    background: var(--el-fill-color);
    color: var(--theme-purple-primary);
    transform: none;
    box-shadow: none;
  }

  &.active {
    border-color: var(--theme-purple-primary);
    background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
    color: white;
    box-shadow: 0 2px 4px var(--theme-orange-shadow);

    i {
      transform: none;
    }
  }

  @media (max-width: 768px) {
    padding: 5px 8px;
    font-size: 10px;
    gap: 3px;

    i {
      font-size: 11px;
    }
  }
}

.avatar-preview {
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);

    .avatar-overlay {
      opacity: 1;
      background: rgba(0, 0, 0, 0.6);
    }
  }

  .user-avatar {
    border: 3px solid var(--el-border-color-light);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
  }

  .avatar-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: all 0.3s ease;

    i {
      font-size: 20px;
      color: white;
      margin-bottom: 4px;
    }

    span {
      font-size: 10px;
      color: white;
      font-weight: 500;
    }
  }
}

.avatar-info {
  text-align: center;
  max-width: 200px;
}

.avatar-tips {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: var(--el-text-color-secondary);
  margin-bottom: 12px;

  i {
    font-size: 12px;
    color: var(--el-color-info);
  }

  @media (max-width: 768px) {
    font-size: 10px;
  }
}

.avatar-actions {
  display: flex;
  gap: 8px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 6px;
  }
}

.btn-avatar-save,
.btn-avatar-cancel {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 6px 12px;
  border: none;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;

  i {
    font-size: 10px;
  }

  @media (max-width: 768px) {
    font-size: 11px;
    padding: 5px 10px;
  }
}

.btn-avatar-save {
  background: linear-gradient(135deg, #22c55e, #16a34a);
  color: white;
  box-shadow: 0 2px 6px rgba(34, 197, 94, 0.3);

  &:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(34, 197, 94, 0.4);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

.btn-avatar-cancel {
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
  border: 1px solid var(--el-border-color);

  &:hover {
    border-color: #ef4444;
    color: #ef4444;
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(239, 68, 68, 0.2);
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


// 输入框组
.input-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  position: relative;

  &:has(> textarea) {
    .input-counter {
      position: absolute;
      bottom: 6px;
      right: 10px;
      background: var(--el-bg-color);
      padding: 0 4px;
      border-radius: 4px;
      font-size: 10px;
      color: var(--el-text-color-placeholder);
    }
  }
}

.input-label {
  font-size: 12px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 2px;
  display: flex;
  align-items: center;
  gap: 4px;

  &::before {
    content: '';
    width: 3px;
    height: 3px;
    background: var(--theme-purple-primary);
    border-radius: 50%;
    flex-shrink: 0;
  }
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
  min-height: 80px;
  padding-bottom: 24px; // 为计数器留出空间
}

.input-counter {
  font-size: 10px;
  color: var(--el-text-color-placeholder);
  text-align: right;
  margin-top: 2px;
}

// 性别选择器
.gender-options {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.gender-option {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  background: var(--el-fill-color-light);
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 12px;
  color: var(--el-text-color-regular);
  user-select: none;

  input[type="radio"] {
    display: none;
  }

  i {
    font-size: 14px;
    transition: all 0.3s ease;
  }

  &:hover {
    border-color: var(--theme-purple-primary);
    background: var(--el-fill-color);
    color: var(--theme-purple-primary);
    transform: translateY(-1px);
  }

  &.active {
    border-color: var(--theme-purple-primary);
    background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
    color: white;
    box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);

    i {
      transform: scale(1.1);
    }
  }

  @media (max-width: 768px) {
    padding: 6px 10px;
    font-size: 11px;
    gap: 4px;

    i {
      font-size: 12px;
    }
  }
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
  justify-content: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: inherit;
  position: relative;
  overflow: hidden;
  min-width: 120px;
  height: 44px;

  .btn-content {
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;
  }

  i {
    font-size: 14px;
    transition: all 0.3s ease;
  }

  span {
    transition: all 0.3s ease;
  }

  @media (max-width: 768px) {
    font-size: 13px;
    padding: 8px 16px;
    min-width: 100px;
    height: 40px;
  }
}

.btn-save {
  background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
  color: white;
  border: none;
  box-shadow: 0 2px 4px var(--theme-orange-shadow);

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, var(--theme-purple-secondary), var(--theme-purple-primary));
    transform: translateY(-1px);
    box-shadow: 0 4px 8px var(--theme-orange-shadow);
  }

  &:active:not(:disabled) {
    background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
    transform: translateY(0);
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    background: var(--el-fill-color-light) !important;
    color: var(--el-text-color-disabled) !important;
    border: 1px solid var(--el-border-color-light) !important;
    transform: none !important;
    box-shadow: none !important;
    
    .btn-content {
      opacity: 0.8;
    }
    
    .fa-spinner {
      animation: spin 1s linear infinite;
    }
  }
}

.btn-reset {
  background: var(--el-bg-color);
  color: var(--el-text-color-regular);
  border: 1px solid var(--el-border-color);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  &:hover:not(:disabled) {
    border-color: var(--theme-purple-primary);
    color: var(--theme-purple-primary);
    background: var(--el-fill-color-light);
    transform: translateY(-1px);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

}

// Loading动画
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.fa-spinner {
  animation: spin 1s linear infinite;
}
</style>
