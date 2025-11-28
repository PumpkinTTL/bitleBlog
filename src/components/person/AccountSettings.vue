<template>
  <div class="account-settings-container animate__animated animate__fadeInLeft animate__faster">
    <!-- 个人资料设置 -->
    <div class="setting-card animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.08s">
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
                    {{ form.nickname ? form.nickname.charAt(0) : 'U' }}
                  </el-avatar>
                  <div class="avatar-edit-overlay">
                    <i class="fas fa-camera"></i>
                  </div>
                </div>
                <input ref="avatarInput" type="file" accept="image/*" style="display: none"
                  @change="handleAvatarChange" />
                <div class="avatar-tips-compact">
                  <i class="fas fa-info-circle"></i>
                  <span>JPG/PNG，最大2MB</span>
                </div>
                <div v-if="avatarPreviewUrl" class="avatar-actions-compact">
                  <button class="btn-save-small" @click="saveAvatar" :disabled="uploading">
                    <i v-if="!uploading" class="fas fa-check"></i>
                    <i v-else class="fas fa-spinner fa-spin"></i>
                    {{ uploading ? '上传中...' : '确认上传修改' }}
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
                  <div class="input-wrapper-compact animate__animated animate__fadeInLeft"
                    style="animation-delay: 0.2s">
                    <label class="input-label-compact">昵称</label>
                    <input v-model="form.nickname" type="text" class="setting-input-compact" placeholder="请输入昵称"
                      maxlength="20" />
                    <span class="input-counter-compact">{{ form.nickname.length }}/20</span>
                  </div>
                  <div class="input-wrapper-compact animate__animated animate__fadeInRight"
                    style="animation-delay: 0.2s">
                    <label class="input-label-compact">邮箱地址</label>
                    <input v-model="form.email" type="email" class="setting-input-compact" placeholder="请输入邮箱地址"
                      disabled style="opacity: 0.6; cursor: not-allowed;" />
                  </div>
                </div>

                <div class="input-wrapper-compact animate__animated animate__fadeInLeft" style="animation-delay: 0.3s">
                  <label class="input-label-compact">个人简介</label>
                  <textarea v-model="form.signature" class="setting-textarea-compact" placeholder="介绍一下自己吧..." rows="2"
                    maxlength="200"></textarea>
                  <span class="input-counter-compact">{{ form.signature.length }}/200</span>
                </div>

                <div class="input-wrapper-compact animate__animated animate__fadeInUp" style="animation-delay: 0.4s">
                  <label class="input-label-compact">性别</label>
                  <div class="gender-row">
                    <div class="gender-options-compact">
                      <label class="gender-option-compact animate__animated animate__fadeIn"
                        :class="{ active: form.gender === 1 }" style="animation-delay: 0.5s">
                        <input type="radio" v-model="form.gender" :value="1" />
                        <i class="fas fa-mars"></i>
                        <span>男</span>
                      </label>
                      <label class="gender-option-compact animate__animated animate__fadeIn"
                        :class="{ active: form.gender === 2 }" style="animation-delay: 0.6s">
                        <input type="radio" v-model="form.gender" :value="2" />
                        <i class="fas fa-venus"></i>
                        <span>女</span>
                      </label>
                      <label class="gender-option-compact animate__animated animate__fadeIn"
                        :class="{ active: form.gender === 0 }" style="animation-delay: 0.7s">
                        <input type="radio" v-model="form.gender" :value="0" />
                        <i class="fas fa-genderless"></i>
                        <span>保密</span>
                      </label>
                    </div>
                    
                    <!-- 小巧的保存/重置按钮 -->
                    <transition
                      enter-active-class="animate__animated animate__bounceIn animate__faster"
                      leave-active-class="animate__animated animate__zoomOut animate__faster"
                    >
                      <div v-if="hasChanges" class="quick-actions">
                        <button class="quick-btn save" @click="handleSave" :disabled="saving" title="保存修改">
                          <i v-if="!saving" class="fas fa-check"></i>
                          <i v-else class="fas fa-spinner fa-spin"></i>
                        </button>
                        <button class="quick-btn reset" @click="handleResetForm" :disabled="saving" title="重置">
                          <i class="fas fa-undo"></i>
                        </button>
                      </div>
                    </transition>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 隐私设置 -->
    <div class="setting-card animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.16s">
      <div class="card-main">
        <div class="card-info">
          <div class="title-wrapper">
            <div class="title-icon privacy animate__animated animate__zoomIn animate__faster"
              style="animation-delay: 0.23s">
              <i class="fas fa-shield-alt"></i>
            </div>
            <h4 class="setting-title">隐私设置</h4>
          </div>
          <div class="switch-group">
            <!-- 个人信息 -->
            <fieldset class="privacy-fieldset">
              <legend class="privacy-legend">个人信息</legend>
              <div class="switch-row" @click="privacy.showEmail = !privacy.showEmail">
                <span class="switch-text">显示邮箱地址</span>
                <div :class="['switch', { on: privacy.showEmail }]"></div>
              </div>
            </fieldset>

            <!-- 社交互动 -->
            <fieldset class="privacy-fieldset">
              <legend class="privacy-legend">社交互动</legend>
              <div class="switch-row" @click="privacy.allowFollow = !privacy.allowFollow">
                <span class="switch-text">允许其他人关注</span>
                <div :class="['switch', { on: privacy.allowFollow }]"></div>
              </div>
              <div class="switch-row" @click="privacy.allowComment = !privacy.allowComment">
                <span class="switch-text">允许评论我的文章</span>
                <div :class="['switch', { on: privacy.allowComment }]"></div>
              </div>
            </fieldset>

            <!-- 内容可见性 -->
            <fieldset class="privacy-fieldset">
              <legend class="privacy-legend">内容可见性</legend>
              <div class="switch-row" @click="privacy.publicArticles = !privacy.publicArticles">
                <span class="switch-text">公开我的文章列表</span>
                <div :class="['switch', { on: privacy.publicArticles }]"></div>
              </div>
              <div class="switch-row" @click="privacy.publicFavorites = !privacy.publicFavorites">
                <span class="switch-text">公开我的收藏夹</span>
                <div :class="['switch', { on: privacy.publicFavorites }]"></div>
              </div>
            </fieldset>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from '@/store'
import { ElAvatar } from 'element-plus'
import { uploadSingleFileR } from '@/request/upload'
import { updateUserProfileR } from '@/request/user'
import { smartMessage } from '@/components/modal'

interface FormData {
  nickname: string
  email: string
  signature: string
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
    nickname: userInfo?.nickname || userInfo?.username || '',
    email: userInfo?.email || '',
    signature: userInfo?.signature || '',
    avatar: userInfo?.avatar || '',
    gender: userInfo?.gender || 0
  }
}

const form = reactive<FormData>(initFormData())

// 保存原始数据用于对比
const originalData = ref<FormData>(initFormData())

// 检测是否有修改
const hasChanges = computed(() => {
  return form.nickname !== originalData.value.nickname ||
         form.signature !== originalData.value.signature ||
         form.gender !== originalData.value.gender
})

// 使用computed直接从store读取数据，不需要watch
// form现在直接绑定到store，实现双向同步
const syncFormWithStore = () => {
  if (store.userInfo) {
    const userInfo = store.userInfo as any
    form.nickname = userInfo?.nickname || userInfo?.username || ''
    form.email = userInfo?.email || ''
    form.signature = userInfo?.signature || ''
    form.avatar = userInfo?.avatar || ''
    form.gender = userInfo?.gender || 0
  }
}

// 监听store变化，同步到表单
watch(() => store.userInfo, () => {
  syncFormWithStore()
  // 同时更新原始数据
  originalData.value = initFormData()
}, { immediate: true, deep: true })

// 组件挂载时重新加载数据
onMounted(() => {
  syncFormWithStore()
  originalData.value = initFormData()
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

    // 直接使用uploadSingleFileR上传文件
    const uploadResponse = await uploadSingleFileR(avatarInput.value.files[0], {
      user_id: userId,
      storage_type: 0, // 本地存储
      remark: '用户头像上传'
    }) as any

    console.log('上传响应:', uploadResponse)

    // 根据新的接口文档处理响应
    switch (uploadResponse.code) {
      case 200:
      // 全部新文件上传成功
      case 201:
      // 文件已存在，无需重复上传
      case 202:
        // 部分文件上传成功
        {
          const uploadedFile = uploadResponse.data[0]
          console.log('上传文件信息:', uploadedFile)

          if (uploadedFile && uploadedFile.url) {
            // 头像上传成功，现在更新用户资料
            try {
              const updateResponse = await updateUserProfileR({
                avatar: uploadedFile.url
              }) as any

              console.log('用户资料更新响应:', updateResponse)

              if (updateResponse.code === 200) {
                // 只更新头像字段
                if (updateResponse.data && store.userInfo) {
                  console.log('头像更新：API返回的数据:', updateResponse.data)
                  const currentUserInfo = store.userInfo as any
                  const updatedUserInfo = {
                    ...currentUserInfo,
                    avatar: updateResponse.data.avatar,
               
                  }
                  console.log('头像更新：更新后的数据:', updatedUserInfo)
                  store.setUserInfo(updatedUserInfo)
                } else {
                  // 备用方案：手动更新头像字段
                  console.log('头像更新：使用备用方案更新store')
                  if (store.userInfo) {
                    const updatedUserInfo = Object.assign({}, store.userInfo)
                      ; (updatedUserInfo as any).avatar = uploadedFile.url
                    store.setUserInfo(updatedUserInfo)
                  }
                  // watch会自动更新form.avatar
                }

                // 清空预览
                avatarPreviewUrl.value = ''

                // 根据上传状态显示不同消息
                if (uploadResponse.code === 201) {
                  smartMessage.success('头像更新成功（使用已存在文件）')
                } else if (uploadResponse.code === 202) {
                  const newFiles = uploadResponse.data.filter((file: any) => !file.is_duplicate)
                  if (newFiles.length > 0) {
                    smartMessage.success('头像上传并更新成功')
                  } else {
                    smartMessage.success('头像更新成功（使用已存在文件）')
                  }
                } else {
                  smartMessage.success('头像上传并更新成功')
                }
              } else {
                // 头像上传成功但更新资料失败
                form.avatar = uploadedFile.url
                avatarPreviewUrl.value = ''
                smartMessage.warning('头像上传成功，但更新用户信息失败：' + (updateResponse.msg || '未知错误'))
              }
            } catch (updateError: any) {
              // 头像上传成功但更新资料失败
              form.avatar = uploadedFile.url
              avatarPreviewUrl.value = ''
              smartMessage.warning('头像上传成功，但更新用户信息失败：' + (updateError.message || '网络错误'))
            }
          } else {
            console.error('文件信息不完整:', uploadedFile)
            throw new Error('上传响应格式错误')
          }
          break
        }
      case 400:
        throw new Error(uploadResponse.msg || '没有有效的文件被上传')
      case 500:
        throw new Error(uploadResponse.msg || '服务器错误')
      default:
        throw new Error('未知响应状态')
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
  showEmail: false,
  allowFollow: true,
  publicArticles: true,
  publicFavorites: true,
  allowComment: true
})

const saving = ref(false)

const handleSave = async () => {
  saving.value = true

  try {
    // 打印提交前的表单数据
    console.log('提交前的表单数据:', {
      nickname: form.nickname,
      gender: form.gender,
      signature: form.signature,
      avatar: form.avatar
    })

    // 调用v2 API更新用户资料
    const updateResponse = await updateUserProfileR({
      nickname: form.nickname,
      gender: form.gender,
      signature: form.signature,
      avatar: form.avatar
    }) as any

    if (updateResponse.code === 200) {
      // 创建新对象，只修改4个字段
      const { nickname, gender, signature, avatar } = updateResponse.data

      console.log('更新后的数据:', { nickname, gender, signature, avatar })
      store.$patch((state: any) => {
        state.userInfo.nickname = nickname
        state.userInfo.gender = gender
        state.userInfo.signature = signature
        state.userInfo.avatar = avatar
      })
      
      smartMessage.success('个人资料保存成功')
      // 保存成功后更新原始数据
      originalData.value = { ...form }
    }
  }
  catch (error: any) {
    console.error('保存用户资料失败:', error)
    smartMessage.error('个人资料保存失败：' + (error.message || '网络错误'))
  } finally {
    saving.value = false
  }
}

// 重置表单到原始数据
const handleResetForm = () => {
  form.nickname = originalData.value.nickname
  form.signature = originalData.value.signature
  form.gender = originalData.value.gender
  smartMessage.info('已重置修改')
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

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  position: relative;

  @media (max-width: 768px) {
    margin-bottom: 20px;
    gap: 10px;
  }
}

.title-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--el-fill-color-light);
  border-radius: 8px;
  color: var(--theme-purple-primary);
  font-size: 16px;
  transition: all 0.2s ease;
  flex-shrink: 0;
  border: 1px solid var(--el-border-color-extra-light);

  &.privacy {
    background: var(--el-fill-color-light);
    color: #0ea5e9;
  }

  &.avatar {
    background: var(--el-fill-color-light);
    color: #22c55e;
  }

  @media (max-width: 768px) {
    width: 36px;
    height: 36px;
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
  margin: 0 0 20px 0;
  letter-spacing: 0.2px;
  flex: 1;

  @media (max-width: 768px) {
    font-size: 15px;
    margin-bottom: 16px;
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
  gap: 16px;
}

.privacy-fieldset {
  border: 1px solid var(--el-border-color-light);
  border-radius: 8px;
  padding: 16px;
  margin: 0;
  
  .switch-row {
    margin-bottom: 8px;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
}

.privacy-legend {
  font-size: 11px;
  font-weight: 600;
  color: var(--theme-purple-primary);
  padding: 0 8px;
  background: var(--el-bg-color);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    font-size: 10px;
    padding: 0 6px;
  }
}

.switch-row:not(.privacy-card .switch-row) {
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

    .switch-text {
      color: var(--theme-purple-primary);
    }
  }

  @media (max-width: 768px) {
    padding: 8px 10px;
  }
}

.switch-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
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

.switch-desc {
  font-size: 11px;
  color: var(--el-text-color-secondary);
  line-height: 1.4;
  
  @media (max-width: 768px) {
    font-size: 10px;
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

// 性别行布局
.gender-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

// 快捷操作按钮
.quick-actions {
  display: flex;
  gap: 8px;
}

.quick-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 6px 10px;
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 6px;
  background: var(--el-fill-color-light);
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 11px;
  min-width: 28px;
  
  i {
    font-size: 12px;
    transition: all 0.2s ease;
  }
  
  &:hover:not(:disabled) {
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  @media (max-width: 768px) {
    padding: 5px 8px;
    font-size: 10px;
    
    i {
      font-size: 11px;
    }
  }
}

.quick-btn.save {
  background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
  color: white;
  border-color: var(--theme-purple-primary);
  box-shadow: 0 2px 4px var(--theme-orange-shadow);
  
  &:hover:not(:disabled) {
    box-shadow: 0 3px 6px var(--theme-orange-shadow);
  }
}

.quick-btn.reset {
  background: var(--el-fill-color-light);
  color: var(--el-text-color-regular);
  border: 1px solid var(--el-border-color-lighter);
  
  &:hover:not(:disabled) {
    background: var(--el-fill-color);
    color: var(--theme-purple-primary);
    border-color: var(--theme-purple-primary);
  }
}
</style>
