<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :width="dialogWidth"
      center
      destroy-on-close
      :show-close="true"
      class="login-dialog-v2"
    >
      <div class="login-container-v2">
        <!-- 登录头部 -->
        <div class="login-header">
          <div class="logo-section">
            <div class="logo-icon">
              <i class="fas fa-blog"></i>
            </div>
            <div class="logo-text">
              <h2>{{ isRegisterMode ? '创建账号' : '欢迎回来' }}</h2>
              <p>{{ isRegisterMode ? '加入我们，开启精彩之旅' : '登录以继续使用' }}</p>
            </div>
          </div>
        </div>
        
        <!-- 登录方式标签 -->
        <div class="login-tabs" v-if="!isRegisterMode">
          <div 
            class="tab-item"
            :class="{ active: !isEmailLogin }"
            @click="isEmailLogin = false"
          >
            <i class="fas fa-user"></i>
            <span>账号登录</span>
          </div>
          <div 
            class="tab-item"
            :class="{ active: isEmailLogin }"
            @click="isEmailLogin = true"
          >
            <i class="fas fa-envelope"></i>
            <span>验证码登录</span>
          </div>
          <div class="tab-indicator" :class="{ 'move-right': isEmailLogin }"></div>
        </div>
        
        <!-- 登录表单 -->
        <div class="login-form-wrapper">
          <el-form 
            ref="formRef" 
            :model="formState" 
            :rules="formRules"
            class="modern-form"
          >
            <!-- 注册模式安全提示 -->
            <div v-if="isRegisterMode" class="security-notice">
              <i class="fas fa-info-circle"></i>
              <span>注册需要有效的邀请码</span>
            </div>
            
            <!-- 账号密码登录 -->
            <template v-if="!isEmailLogin">
              <el-form-item prop="username" class="form-item-modern">
                <div class="input-wrapper">
                  <div class="input-icon">
                    <i class="fas fa-user"></i>
                  </div>
                  <el-input
                    v-model="formState.username"
                    placeholder="请输入用户名"
                    clearable
                    class="modern-input"
                  />
                </div>
              </el-form-item>
              
              <el-form-item prop="password" class="form-item-modern">
                <div class="input-wrapper">
                  <div class="input-icon">
                    <i class="fas fa-lock"></i>
                  </div>
                  <el-input
                    v-model="formState.password"
                    type="password"
                    placeholder="请输入密码"
                    show-password
                    clearable
                    class="modern-input"
                  />
                </div>
              </el-form-item>
            </template>
            
            <!-- 邮箱验证码登录 -->
            <template v-else>
              <el-form-item prop="email" class="form-item-modern">
                <div class="input-wrapper">
                  <div class="input-icon">
                    <i class="fas fa-envelope"></i>
                  </div>
                  <el-input
                    v-model="formState.email"
                    placeholder="请输入邮箱"
                    clearable
                    class="modern-input"
                  />
                </div>
              </el-form-item>
              
              <el-form-item prop="verificationCode" class="form-item-modern">
                <div class="input-wrapper code-wrapper">
                  <div class="input-icon">
                    <i class="fas fa-key"></i>
                  </div>
                  <el-input
                    v-model="formState.verificationCode"
                    placeholder="请输入验证码"
                    clearable
                    class="modern-input"
                  >
                    <template #append>
                      <button 
                        class="code-btn"
                        :disabled="codeButtonDisabled"
                        @click.prevent="sendVerificationCode"
                      >
                        {{ codeButtonText }}
                      </button>
                    </template>
                  </el-input>
                </div>
              </el-form-item>
            </template>
            
            <!-- 注册时的确认密码 -->
            <el-form-item v-if="isRegisterMode" prop="confirmPassword" class="form-item-modern">
              <div class="input-wrapper">
                <div class="input-icon">
                  <i class="fas fa-lock"></i>
                </div>
                <el-input
                  v-model="formState.confirmPassword"
                  type="password"
                  placeholder="确认密码"
                  show-password
                  clearable
                  class="modern-input"
                />
              </div>
            </el-form-item>
            
            <!-- 注册邀请码 -->
            <el-form-item v-if="isRegisterMode" prop="inviteCode" class="form-item-modern">
              <div class="input-wrapper">
                <div class="input-icon">
                  <i class="fas fa-ticket-alt"></i>
                </div>
                <el-input
                  v-model="formState.inviteCode"
                  placeholder="请输入注册邀请码"
                  clearable
                  class="modern-input"
                />
              </div>
            </el-form-item>
            
            <!-- 记住我和忘记密码 -->
            <div v-if="!isRegisterMode" class="form-options">
              <el-checkbox v-if="!isEmailLogin" v-model="formState.remember" class="remember-checkbox">
                记住我
              </el-checkbox>
              <a href="javascript:;" class="forgot-link" @click="handleForgotPassword">忘记密码？</a>
            </div>
            
            <!-- 提交按钮 -->
            <div class="form-actions">
              <button 
                class="submit-btn modern-btn"
                :class="{ loading: loading }"
                @click.prevent="handleSubmit"
                :disabled="loading"
              >
                <span class="btn-content">
                  <i v-if="loading" class="fas fa-spinner fa-spin"></i>
                  <i v-else class="fas fa-arrow-right"></i>
                  <span>{{ isRegisterMode ? '立即注册' : '立即登录' }}</span>
                </span>
                <span class="btn-effect"></span>
              </button>
            </div>
          </el-form>
          
          <!-- 切换登录/注册 -->
          <div class="mode-switch">
            <span>{{ isRegisterMode ? '已有账号？' : '还没有账号？' }}</span>
            <a href="javascript:;" @click="toggleMode">
              {{ isRegisterMode ? '立即登录' : '立即注册' }}
            </a>
          </div>
          
          <!-- 协议提示 -->
          <div class="agreement-text">
            <span>登录即表示同意</span>
            <a href="javascript:;" @click="openUserAgreement">《用户协议》</a>
            <span>和</span>
            <a href="javascript:;" @click="openPrivacyPolicy">《隐私政策》</a>
          </div>
          
          </div>
      </div>
    </el-dialog>
    
    <!-- 用户协议弹窗 -->
    <el-dialog
      v-model="showUserAgreement"
      title="用户协议"
      width="60%"
      append-to-body
    >
      <UserAgreement />
      <template #footer>
        <el-button @click="showUserAgreement = false">关闭</el-button>
      </template>
    </el-dialog>
    
    <!-- 隐私政策弹窗 -->
    <el-dialog
      v-model="showPrivacyPolicy"
      title="隐私政策"
      width="60%"
      append-to-body
    >
      <PrivacyPolicy />
      <template #footer>
        <el-button @click="showPrivacyPolicy = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
import { useStore } from '../store'
import { Modal } from 'ant-design-vue'
import { smartMessage } from '@/components/modal'
import { loginR, requestPasswordResetR } from '../request/user'
import { setToken } from '../util/Auth'
import UserAgreement from './platform/UserAgreement.vue'
import PrivacyPolicy from './platform/PrivacyPolicy.vue'

const store = useStore()

// 登录/注册模式
const isRegisterMode = ref(false)
const isEmailLogin = ref(false)

// 弹窗可见性
const dialogVisible = computed({
  get: () => store.showLoginModal,
  set: (val) => {
    if (!val) store.showLoginModal = false
  }
})

// 协议弹窗
const showUserAgreement = ref(false)
const showPrivacyPolicy = ref(false)

// 响应式弹窗宽度
const dialogWidth = ref('480px')

const updateDialogWidth = () => {
  if (window.innerWidth <= 480) {
    dialogWidth.value = '95%'
  } else if (window.innerWidth <= 768) {
    dialogWidth.value = '85%'
  } else {
    dialogWidth.value = '480px'
  }
}

// 监听全局登录事件
const handleShowLogin = () => {
  store.showLoginModal = true
}

onMounted(() => {
  updateDialogWidth()
  window.addEventListener('resize', updateDialogWidth)
  window.addEventListener('show-login-modal', handleShowLogin)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateDialogWidth)
  window.removeEventListener('show-login-modal', handleShowLogin)
})

// 表单状态
const formState = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  verificationCode: '',
  inviteCode: '',
  remember: false
})

// 验证码按钮状态
const codeButtonDisabled = ref(false)
const codeButtonText = ref('获取验证码')
const countdown = ref(60)
let timer: any = null

// 清理验证码定时器
const clearTimer = () => {
  if (timer) {
    clearInterval(timer)
    timer = null
    codeButtonDisabled.value = false
    codeButtonText.value = '获取验证码'
  }
}

// 邮箱格式验证
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  return emailRegex.test(email)
}

// 发送验证码
const sendVerificationCode = () => {
  if (!isValidEmail(formState.email)) {
    smartMessage.error('请输入有效的邮箱地址')
    return
  }
  
  smartMessage.success('验证码已发送到您的邮箱')
  codeButtonDisabled.value = true
  countdown.value = 60
  codeButtonText.value = `${countdown.value}秒后重新获取`
  
  timer = setInterval(() => {
    countdown.value--
    codeButtonText.value = `${countdown.value}秒后重新获取`
    
    if (countdown.value <= 0) {
      clearInterval(timer)
      codeButtonDisabled.value = false
      codeButtonText.value = '获取验证码'
    }
  }, 1000)
}

// 表单规则
const formRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码', trigger: 'blur' },
    { 
      validator: (rule: any, value: any, callback: any) => {
        if (value !== formState.password) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      }, 
      trigger: 'blur' 
    }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 4, max: 6, message: '验证码长度不正确', trigger: 'blur' }
  ],
  inviteCode: [
    { required: true, message: '请输入注册邀请码', trigger: 'blur' },
    { min: 6, max: 20, message: '邀请码长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const formRef = ref(null)
const loading = ref(false)

// 切换登录/注册模式
const toggleMode = () => {
  isRegisterMode.value = !isRegisterMode.value
  isEmailLogin.value = false
  resetForm()
}

// 重置表单
const resetForm = () => {
  formState.username = ''
  formState.password = ''
  formState.confirmPassword = ''
  formState.email = ''
  formState.verificationCode = ''
  formState.inviteCode = ''
  formState.remember = false

  clearTimer()
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await (formRef.value as any).validate()
    loading.value = true
    
    if (isRegisterMode.value) {
      // 注册逻辑
      smartMessage.success('注册成功')
      isRegisterMode.value = false
      loading.value = false
    } else {
      // 登录逻辑
      try {
        const params = {
          account: formState.username,
          password: formState.password,
          action: 'pwd'
        }
        
        const res: any = await loginR(params)
        
        if (res.code === 200) {
          const userInfo = res.data
          
          // 更新store
          store.isLogin = true
          store.userInfo = userInfo
          
          // 提取角色和权限（根据文档结构）
          const roles = userInfo.roles?.map((r: any) => r.iden) || []
          const permissions: string[] = []
          userInfo.roles?.forEach((role: any) => {
            role.permissions?.forEach((perm: any) => {
              if (perm.name && !permissions.includes(perm.name)) {
                permissions.push(perm.name)
              }
            })
          })
          
          // 从响应中获取token和过期时间（可能在res或res.data中）
          const token = res.token || res.data?.token || userInfo.token
          const expireTime = res.expireTime || res.data?.expireTime || userInfo.expireTime
          
          // 构建单Token数据结构（按照API文档要求）
          const tokenData = {
            token: token,
            expires: expireTime * 1000, // 后端返回秒级时间戳，转换为毫秒
            id: userInfo.id,
            username: userInfo.username,
            nickname: userInfo.nickname,
            avatar: userInfo.avatar,
            email: userInfo.email,
            roles: roles,
            permissions: permissions,
            // 保存完整的用户信息
            ...userInfo
          }
          
          // 使用新的单Token管理：同时保存到authorized-token cookie和user-info localStorage
          setToken(tokenData)
          
          // 兼容旧的localStorage字段（如果后端返回）
          if (formState.remember && userInfo.username) {
            localStorage.setItem('loginCredentials', JSON.stringify({
              username: userInfo.username
            }))
          }
          localStorage.setItem('isLogin', 'true')
          
          smartMessage.success('登录成功')
          closeDialog()
        } else {
          smartMessage.error(res.msg || '登录失败，请检查用户名和密码')
        }
      } catch (error) {
        console.error('登录失败:', error)
        smartMessage.error('登录请求失败，请稍后再试')
      } finally {
        loading.value = false
      }
    }
  } catch (e) {
    console.error('Validation failed:', e)
    loading.value = false
  }
}

// 关闭弹窗
const closeDialog = () => {
  store.showLoginModal = false
  resetForm()
  isRegisterMode.value = false
  isEmailLogin.value = false

  clearTimer()
}

const openUserAgreement = () => {
  showUserAgreement.value = true
}

const openPrivacyPolicy = () => {
  showPrivacyPolicy.value = true
}

// 忘记密码功能
const handleForgotPassword = async () => {
  // 获取当前输入的邮箱或用户名，并去除前后空格
  const currentInput = (isEmailLogin.value ? formState.email : formState.username).trim()
  
  if (!currentInput) {
    smartMessage.error('请先输入邮箱或用户名')
    return
  }
  
  let emailToSend = currentInput
  
  // 如果是用户名模式，检查输入的是否是邮箱格式
  if (!isEmailLogin.value) {
    // 如果输入的不是邮箱格式，提示用户
    if (!isValidEmail(currentInput)) {
      smartMessage.error('请在账号输入框中输入邮箱地址，然后点击忘记密码')
      return
    }
    emailToSend = currentInput
  } else {
    // 验证邮箱格式
    if (!isValidEmail(currentInput)) {
      smartMessage.error('请输入正确的邮箱地址')
      return
    }
  }
  
  // 弹出确认对话框
  Modal.confirm({
    title: '发送密码重置邮件',
    content: `系统将发送重置链接至 ${emailToSend} 邮箱，以供您重置密码。确认发送重置邮件吗？`,
    okText: '确认发送',
    cancelText: '取消',
    centered: true,  // 居中显示
    onOk: async () => {
      await sendResetEmail(emailToSend)
    }
  })
}

// 发送重置邮件
const sendResetEmail = async (email: string) => {
  try {
    const response = await requestPasswordResetR({
      email: email
    });
    
    if (response.code === 200) {
      // 成功提示
      Modal.success({
        title: '发送成功',
        content: '重置链接已发送到您的邮箱，请在10分钟内完成密码重置。',
        centered: true,
        okText: '知道了'
      })
      // 不关闭登录模态框，让用户可以继续操作
    } else {
      smartMessage.error(response.info || response.msg || '发送失败，请稍后重试')
    }
  } catch (error: any) {
    if (error.response?.data?.code === 404) {
      smartMessage.error(error.response.data.info || '该邮箱未注册，请检查邮箱地址或先注册账号')
    } else {
      smartMessage.error(error.response?.data?.info || error.response?.data?.msg || '发送失败，请稍后重试')
    }
  }
}
</script>

<style scoped lang="less">
// 使用全局主题变量
@primary-color: var(--theme-purple-primary);
@secondary-color: var(--theme-purple-secondary);
@primary-gradient: linear-gradient(135deg, var(--theme-purple-primary) 0%, var(--theme-purple-secondary) 100%);

// 对话框全局样式
.login-dialog-v2 {
  :deep(.el-dialog) {
    border-radius: 16px;
    overflow: hidden;
    background: var(--el-bg-color);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    padding: 0;
  }
  
  :deep(.el-dialog__header) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    margin: 0;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }
  
  :deep(.el-dialog__title) {
    font-size: 0;
  }
  
  :deep(.el-dialog__headerbtn) {
    top: 24px;
    right: 24px;
    width: 32px;
    height: 32px;
    
    .el-dialog__close {
      color: var(--el-text-color-regular);
      font-size: 16px;
      transition: all 0.3s ease;
      
      &:hover {
        color: @primary-color;
      }
    }
  }
  
  :deep(.el-dialog__body) {
    padding: 24px;
  }
}

// 登录容器
.login-container-v2 {
  position: relative;
  padding: 12px;
  background: var(--el-bg-color);
  min-height: 420px;
}

// 登录头部
.login-header {
  margin-bottom: 24px;
  
  .logo-section {
    display: flex;
    align-items: center;
    gap: 12px;
    
    .logo-icon {
      width: 44px;
      height: 44px;
      background: @primary-gradient;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-size: 22px;
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);
      flex-shrink: 0;
    }
    
    .logo-text {
      flex: 1;
      
      h2 {
        margin: 0 0 2px 0;
        font-size: 20px;
        font-weight: 700;
        background: @primary-gradient;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
      
      p {
        margin: 0;
        font-size: 13px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

// 登录方式标签
.login-tabs {
  position: relative;
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: var(--el-fill-color-extra-light);
  padding: 4px;
  border-radius: 10px;
  
  .tab-item {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    padding: 10px 12px;
    border-radius: 8px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    transition: all 0.3s ease;
    z-index: 2;
    
    i {
      font-size: 14px;
    }
    
    &.active {
      color: @primary-color;
    }
    
    &:hover {
      color: @primary-color;
    }
  }
  
  .tab-indicator {
    position: absolute;
    top: 4px;
    left: 4px;
    width: calc(50% - 4px);
    height: calc(100% - 8px);
    background: white;
    border-radius: 8px;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 1;
    
    &.move-right {
      transform: translateX(calc(100% + 8px));
    }
  }
}

// 表单包装器
.login-form-wrapper {
  .modern-form {
    :deep(.el-form-item) {
      margin-bottom: 16px;
    }
    
    :deep(.el-form-item__error) {
      padding-left: 44px;
      font-size: 12px;
    }
  }
}

// 安全提示
.security-notice {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  background: var(--theme-orange-bg-2);
  border-radius: 20px;
  margin-bottom: 16px;
  font-size: 12px;
  color: var(--el-text-color-regular);
  
  i {
    color: var(--theme-purple-primary);
    font-size: 13px;
  }
}

// 现代化输入框
.form-item-modern {
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    
    .input-icon {
      position: absolute;
      left: 14px;
      top: 50%;
      transform: translateY(-50%);
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-text-color-placeholder);
      font-size: 14px;
      z-index: 2;
      transition: color 0.3s ease;
      pointer-events: none;
    }
    
    &:focus-within .input-icon {
      color: @primary-color;
    }
    
    :deep(.modern-input) {
      width: 100%;
      
      .el-input__wrapper {
        padding-left: 42px;
        padding-right: 14px;
        height: 44px;
        background: var(--el-fill-color-light);
        border: 2px solid transparent;
        border-radius: 10px;
        box-shadow: none;
        transition: all 0.3s ease;
        
        &:hover {
          background: var(--el-fill-color);
        }
        
        &.is-focus {
          background: white;
          border-color: @primary-color;
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
        }
      }
      
      .el-input__inner {
        height: 100%;
        line-height: 44px;
        font-size: 14px;
      }
    }
    
    &.code-wrapper {
      border: 2px solid transparent;
      border-radius: 10px;
      background: var(--el-fill-color-light);
      transition: all 0.3s ease;
      overflow: hidden;
      display: flex;
      
      &:hover {
        background: var(--el-fill-color);
      }
      
      &:focus-within {
        background: white;
        border-color: @primary-color;
        box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.1);
      }
      
      :deep(.el-input-group__append) {
        background: transparent;
        border: none;
        padding: 0;
        margin: 0;
        box-shadow: none;
        align-self: stretch;
        
        .code-btn {
          height: 100%;
          padding: 0 16px;
          background: @primary-gradient;
          border: none;
          border-radius: 0;
          color: white;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          
          &:hover:not(:disabled) {
            opacity: 0.9;
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }
      }
      
      :deep(.el-input__wrapper) {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
        border-radius: 0;
        padding-left: 42px;
        padding-right: 8px;
        height: 40px;
      }
      
      :deep(.el-input-group) {
        display: flex;
        align-items: stretch;
        height: 100%;
      }
    }
  }
}

// 表单选项
.form-options {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
  
  .remember-checkbox {
    :deep(.el-checkbox__label) {
      font-size: 13px;
      color: var(--el-text-color-regular);
    }
  }
  
  .forgot-link {
    font-size: 13px;
    color: @primary-color;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  }
}

// 提交按钮
.form-actions {
  margin-bottom: 16px;
  
  .modern-btn {
    width: 100%;
    height: 46px;
    border: none;
    border-radius: 10px;
    background: @primary-gradient;
    color: white;
    font-size: 15px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    
    .btn-content {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      
      i {
        font-size: 18px;
      }
    }
    
    .btn-effect {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(90deg, 
        transparent 0%, 
        rgba(255, 255, 255, 0.3) 50%, 
        transparent 100%
      );
      transition: left 0.5s ease;
    }
    
    &:hover:not(:disabled) {
      transform: translateY(-2px);
      box-shadow: 0 6px 16px rgba(139, 92, 246, 0.35);
      
      .btn-effect {
        left: 100%;
      }
    }
    
    &:active:not(:disabled) {
      transform: translateY(0);
    }
    
    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    &.loading {
      pointer-events: none;
    }
  }
}

// 模式切换
.mode-switch {
  text-align: center;
  margin-bottom: 12px;
  font-size: 13px;
  color: var(--el-text-color-secondary);
  
  a {
    color: @primary-color;
    text-decoration: none;
    font-weight: 500;
    margin-left: 4px;
    transition: all 0.3s ease;
    
    &:hover {
      opacity: 0.8;
      text-decoration: underline;
    }
  }
}

// 协议文本
.agreement-text {
  text-align: center;
  margin-bottom: 18px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);
  line-height: 1.6;
  
  a {
    color: @primary-color;
    text-decoration: none;
    margin: 0 2px;
    transition: all 0.3s ease;
    
    &:hover {
      text-decoration: underline;
    }
  }
}


// 暗色模式适配
html.dark {
  .login-container-v2 {
    .close-btn {
      background: var(--el-fill-color-dark);
      
      &:hover {
        background: @primary-color;
      }
    }
    
    .login-tabs {
      background: var(--el-fill-color-dark);
      
      .tab-indicator {
        background: var(--el-fill-color-light);
      }
    }
    
    .form-item-modern {
      .input-wrapper {
        :deep(.modern-input .el-input__wrapper) {
          background: var(--el-fill-color-dark);
          
          &:hover {
            background: var(--el-fill-color);
          }
          
          &.is-focus {
            background: var(--el-fill-color-light);
          }
        }
      }
    }
    }
}

// 响应式设计
@media (max-width: 768px) {
  .login-dialog-v2 {
    :deep(.el-dialog__body) {
      padding: 20px;
    }
    
    :deep(.el-dialog__header) {
      padding: 16px 20px;
    }
    
    :deep(.el-dialog__headerbtn) {
      top: 20px;
      right: 20px;
    }
  }
  
  .login-header .logo-section {
    .logo-icon {
      width: 40px;
      height: 40px;
      font-size: 20px;
    }
    
    .logo-text h2 {
      font-size: 18px;
    }
    
    .logo-text p {
      font-size: 12px;
    }
  }
  
  .login-tabs .tab-item {
    padding: 9px 10px;
    font-size: 12px;
    
    span {
      display: none;
    }
    
    i {
      font-size: 16px;
    }
  }
  
  .form-item-modern .input-wrapper {
    :deep(.modern-input .el-input__wrapper) {
      height: 42px;
      padding-left: 40px;
    }
  }
  
  .form-actions .modern-btn {
    height: 44px;
    font-size: 14px;
  }
  }
</style>

