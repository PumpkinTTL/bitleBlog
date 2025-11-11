<template>
  <div class="account-settings-card animate__animated animate__fadeInLeft animate__faster">
    <div class="card-header">
      <h3 class="header-title">
        <i class="fas fa-cog"></i>
        账号设置
      </h3>
    </div>

    <div class="settings-content">
      <!-- 基本信息 -->
      <div class="settings-section animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0s">
        <div class="section-title">
          <i class="fas fa-user"></i>
          基本信息
        </div>
        <el-form :model="form" label-width="100px" label-position="left">
          <el-form-item label="用户名">
            <el-input v-model="form.username" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="form.email" placeholder="请输入邮箱" />
          </el-form-item>
          <el-form-item label="个人简介">
            <el-input 
              v-model="form.bio" 
              type="textarea" 
              :rows="3"
              placeholder="介绍一下自己..." 
              maxlength="200"
              show-word-limit
            />
          </el-form-item>
        </el-form>
      </div>

      <!-- 隐私设置 -->
      <div class="settings-section animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.1s">
        <div class="section-title">
          <i class="fas fa-shield-alt"></i>
          隐私设置
        </div>
        <div class="privacy-options">
          <div class="privacy-item">
            <div class="privacy-info">
              <div class="privacy-label">公开个人资料</div>
              <div class="privacy-desc">允许其他用户查看你的个人主页</div>
            </div>
            <el-switch v-model="privacy.publicProfile" />
          </div>
          <div class="privacy-item">
            <div class="privacy-info">
              <div class="privacy-label">显示邮箱</div>
              <div class="privacy-desc">在个人主页中显示邮箱地址</div>
            </div>
            <el-switch v-model="privacy.showEmail" />
          </div>
          <div class="privacy-item">
            <div class="privacy-info">
              <div class="privacy-label">允许关注</div>
              <div class="privacy-desc">允许其他用户关注你</div>
            </div>
            <el-switch v-model="privacy.allowFollow" />
          </div>
        </div>
      </div>

      <!-- 通知设置 -->
      <div class="settings-section animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.2s">
        <div class="section-title">
          <i class="fas fa-bell"></i>
          通知设置
        </div>
        <div class="notification-options">
          <div class="notification-item">
            <div class="notification-info">
              <div class="notification-label">评论通知</div>
              <div class="notification-desc">有人评论你的文章时通知你</div>
            </div>
            <el-switch v-model="notifications.comments" />
          </div>
          <div class="notification-item">
            <div class="notification-info">
              <div class="notification-label">点赞通知</div>
              <div class="notification-desc">有人点赞你的文章时通知你</div>
            </div>
            <el-switch v-model="notifications.likes" />
          </div>
          <div class="notification-item">
            <div class="notification-info">
              <div class="notification-label">关注通知</div>
              <div class="notification-desc">有人关注你时通知你</div>
            </div>
            <el-switch v-model="notifications.follows" />
          </div>
          <div class="notification-item">
            <div class="notification-info">
              <div class="notification-label">系统通知</div>
              <div class="notification-desc">接收系统重要通知</div>
            </div>
            <el-switch v-model="notifications.system" />
          </div>
        </div>
      </div>

      <!-- 操作按钮 -->
      <div class="settings-actions animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.3s">
        <el-button type="primary" @click="handleSave" :loading="saving">
          <i class="fas fa-save"></i>
          保存设置
        </el-button>
        <el-button @click="handleReset">
          <i class="fas fa-undo"></i>
          重置
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { ElMessage } from 'element-plus'

interface FormData {
  username: string
  email: string
  bio: string
}

const form = reactive<FormData>({
  username: 'BitlE开发者',
  email: 'dev@example.com',
  bio: '热爱技术，专注前端开发'
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
}>()

const handleSave = () => {
  saving.value = true
  
  setTimeout(() => {
    saving.value = false
    ElMessage.success('设置保存成功')
    emit('save', { form, privacy, notifications })
  }, 1000)
}

const handleReset = () => {
  form.username = 'BitlE开发者'
  form.email = 'dev@example.com'
  form.bio = '热爱技术，专注前端开发'
  
  privacy.publicProfile = true
  privacy.showEmail = false
  privacy.allowFollow = true
  
  notifications.comments = true
  notifications.likes = true
  notifications.follows = true
  notifications.system = true
  
  ElMessage.info('已重置为默认设置')
}
</script>

<style lang="less" scoped>
.account-settings-card {
  background: var(--el-bg-color);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  overflow: hidden;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
  background: var(--el-fill-color-extra-light);

  .header-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    display: flex;
    align-items: center;
    gap: 8px;

    i {
      color: var(--theme-purple-primary);
      font-size: 18px;
    }
  }
}

.settings-content {
  padding: 24px;
}

.settings-section {
  margin-bottom: 32px;

  &:last-of-type {
    margin-bottom: 24px;
  }
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--el-border-color-extra-light);
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    color: var(--theme-purple-primary);
    font-size: 16px;
  }
}

.privacy-options,
.notification-options {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.privacy-item,
.notification-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 10px;
  transition: all 0.3s ease;
  border: 2px solid transparent;

  &:hover {
    background: var(--theme-orange-bg-1);
    border-color: var(--theme-orange-border-1);
    transform: translateX(4px);
  }
}

.privacy-info,
.notification-info {
  flex: 1;
  margin-right: 16px;

  .privacy-label,
  .notification-label {
    font-size: 14px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 4px;
  }

  .privacy-desc,
  .notification-desc {
    font-size: 12px;
    color: var(--el-text-color-secondary);
    line-height: 1.4;
  }
}

.settings-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 20px;
  border-top: 1px solid var(--el-border-color-extra-light);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式
@media (max-width: 768px) {
  .settings-content {
    padding: 16px;
  }

  .settings-section {
    margin-bottom: 24px;
  }

  .privacy-item,
  .notification-item {
    padding: 12px;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    &:hover {
      transform: translateX(2px);
    }
  }

  .privacy-info,
  .notification-info {
    margin-right: 0;
  }

  .settings-actions {
    flex-direction: column;

    button {
      width: 100%;
    }
  }
}
</style>
