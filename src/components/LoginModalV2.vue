<template>
  <div>
    <el-dialog
      v-model="dialogVisible"
      :width="dialogWidth"
      center
      destroy-on-close
      :show-close="false"
      class="login-dialog-v2"
    >
      <div class="login-container-v2">
        <!-- 背景装饰 -->
        <div class="background-decoration">
          <div class="decoration-circle circle-1"></div>
          <div class="decoration-circle circle-2"></div>
          <div class="decoration-circle circle-3"></div>
        </div>
        
        <!-- 关闭按钮 -->
        <button class="close-btn" @click="closeDialog">
          <i class="fas fa-times"></i>
        </button>
        
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
            <span>邮箱登录</span>
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
              <div class="notice-icon">
                <i class="fas fa-shield-alt"></i>
              </div>
              <div class="notice-content">
                <strong>安全提示</strong>
                <p>请使用电子邮箱注册，保护您的隐私安全</p>
              </div>
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
            
            <!-- 记住我和忘记密码 -->
            <div v-if="!isRegisterMode && !isEmailLogin" class="form-options">
              <el-checkbox v-model="formState.remember" class="remember-checkbox">
                记住我
              </el-checkbox>
              <a href="javascript:;" class="forgot-link">忘记密码？</a>
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
          
          <!-- 第三方登录 -->
          <div class="social-login">
            <div class="divider-line">
              <span>其他登录方式</span>
            </div>
            <div class="social-buttons">
              <button class="social-btn wechat" title="微信登录">
                <i class="fab fa-weixin"></i>
              </button>
              <button class="social-btn qq" title="QQ登录">
                <i class="fab fa-qq"></i>
              </button>
              <button class="social-btn github" title="GitHub登录">
                <i class="fab fa-github"></i>
              </button>
            </div>
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
import { message } from 'ant-design-vue'
import { loginR } from '../request/user'
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
  remember: false
})

// 验证码按钮状态
const codeButtonDisabled = ref(false)
const codeButtonText = ref('获取验证码')
const countdown = ref(60)
let timer: any = null

// 发送验证码
const sendVerificationCode = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formState.email)) {
    message.error('请输入有效的邮箱地址')
    return
  }
  
  message.success('验证码已发送到您的邮箱')
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
  formState.remember = false
  
  if (timer) {
    clearInterval(timer)
    codeButtonDisabled.value = false
    codeButtonText.value = '获取验证码'
  }
}

// 保存用户信息到本地存储
const saveUserToLocalStorage = (userInfo: any) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo))
  localStorage.setItem('isLogin', 'true')
  
  if (formState.remember) {
    localStorage.setItem('loginCredentials', JSON.stringify({
      username: formState.username,
      token: userInfo.token
    }))
  } else {
    localStorage.removeItem('loginCredentials')
  }
}

// 提交表单
const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await (formRef.value as any).validate()
    loading.value = true
    
    if (isRegisterMode.value) {
      // 注册逻辑
      message.success('注册成功')
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
          
          // 更新store（后端已返回包含premium等字段的完整用户信息）
          store.isLogin = true
          store.userInfo = userInfo
          
          // 保存用户信息到localStorage
          saveUserToLocalStorage(userInfo)
          
          // 保存Token到localStorage
          localStorage.setItem('refreshToken', res.refreshToken)
          localStorage.setItem('accessToken', res.accessToken)
          
          // 调试日志：显示premium状态
          console.log('登录成功，用户premium状态:', userInfo.premium)
          
          closeDialog()
        } else {
          message.error(res.msg || '登录失败，请检查用户名和密码')
        }
      } catch (error) {
        console.error('登录失败:', error)
        message.error('登录请求失败，请稍后再试')
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
  
  if (timer) {
    clearInterval(timer)
  }
}

const openUserAgreement = () => {
  showUserAgreement.value = true
}

const openPrivacyPolicy = () => {
  showPrivacyPolicy.value = true
}
</script>

<style scoped lang="less">
// 紫色主题色（与头部组件统一）
@primary-color: #8b5cf6;
@secondary-color: #d946ef;
@primary-gradient: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);

// 对话框全局样式
.login-dialog-v2 {
  :deep(.el-dialog) {
    border-radius: 20px;
    overflow: hidden;
    background: var(--el-bg-color);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
    padding: 0;
  }
  
  :deep(.el-dialog__header) {
    display: none;
  }
  
  :deep(.el-dialog__body) {
    padding: 0;
  }
}

// 登录容器
.login-container-v2 {
  position: relative;
  padding: 32px 36px;
  background: var(--el-bg-color);
  min-height: 480px;
  
  @media (max-width: 768px) {
    padding: 24px 20px;
  }
}

// 背景装饰
.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
  
  .decoration-circle {
    position: absolute;
    border-radius: 50%;
    background: @primary-gradient;
    opacity: 0.05;
    animation: float 20s infinite ease-in-out;
    
    &.circle-1 {
      width: 300px;
      height: 300px;
      top: -100px;
      right: -100px;
      animation-delay: 0s;
    }
    
    &.circle-2 {
      width: 200px;
      height: 200px;
      bottom: -50px;
      left: -50px;
      animation-delay: 5s;
    }
    
    &.circle-3 {
      width: 150px;
      height: 150px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      animation-delay: 10s;
    }
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0) scale(1);
  }
  50% {
    transform: translateY(-20px) scale(1.05);
  }
}

// 所有内容相对定位
.login-container-v2 > *:not(.background-decoration) {
  position: relative;
  z-index: 1;
}

// 关闭按钮
.close-btn {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  border: none;
  background: var(--el-fill-color-light);
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--el-text-color-regular);
  font-size: 16px;
  transition: all 0.3s ease;
  z-index: 10;
  
  &:hover {
    background: @primary-color;
    color: white;
    transform: rotate(90deg);
  }
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
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 12px;
  background: linear-gradient(135deg, rgba(255, 193, 7, 0.08) 0%, rgba(255, 152, 0, 0.05) 100%);
  border-left: 3px solid #ffc107;
  border-radius: 8px;
  margin-bottom: 16px;
  
  .notice-icon {
    width: 28px;
    height: 28px;
    background: #ffc107;
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 14px;
    flex-shrink: 0;
  }
  
  .notice-content {
    flex: 1;
    
    strong {
      display: block;
      margin-bottom: 2px;
      color: #ff9800;
      font-size: 13px;
    }
    
    p {
      margin: 0;
      font-size: 12px;
      color: var(--el-text-color-secondary);
      line-height: 1.4;
    }
  }
}

// 现代化输入框
.form-item-modern {
  .input-wrapper {
    position: relative;
    display: flex;
    align-items: center;
    
    .input-icon {
      position: absolute;
      left: 14px;
      width: 18px;
      height: 18px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-text-color-placeholder);
      font-size: 14px;
      z-index: 2;
      transition: color 0.3s ease;
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
      :deep(.el-input-group__append) {
        background: transparent;
        border: none;
        padding: 0;
        
        .code-btn {
          height: 40px;
          padding: 0 16px;
          background: @primary-gradient;
          border: none;
          border-radius: 0 8px 8px 0;
          color: white;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
          
          &:hover:not(:disabled) {
            opacity: 0.9;
            transform: translateX(-2px);
          }
          
          &:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        }
      }
      
      :deep(.el-input__wrapper) {
        border-radius: 10px 0 0 10px;
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

// 第三方登录
.social-login {
  .divider-line {
    position: relative;
    text-align: center;
    margin-bottom: 14px;
    
    &::before,
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      width: calc(50% - 60px);
      height: 1px;
      background: var(--el-border-color-lighter);
    }
    
    &::before {
      left: 0;
    }
    
    &::after {
      right: 0;
    }
    
    span {
      font-size: 12px;
      color: var(--el-text-color-placeholder);
      padding: 0 8px;
      background: var(--el-bg-color);
    }
  }
  
  .social-buttons {
    display: flex;
    justify-content: center;
    gap: 12px;
    
    .social-btn {
      width: 44px;
      height: 44px;
      border: 1.5px solid var(--el-border-color-light);
      background: white;
      border-radius: 10px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      transition: all 0.3s ease;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      i {
        position: relative;
        z-index: 2;
        transition: all 0.3s ease;
      }
      
      &.wechat {
        &::before {
          background: #07c160;
        }
        
        i {
          color: #07c160;
        }
        
        &:hover {
          border-color: #07c160;
          
          &::before {
            opacity: 1;
          }
          
          i {
            color: white;
            transform: scale(1.1);
          }
        }
      }
      
      &.qq {
        &::before {
          background: #12b7f5;
        }
        
        i {
          color: #12b7f5;
        }
        
        &:hover {
          border-color: #12b7f5;
          
          &::before {
            opacity: 1;
          }
          
          i {
            color: white;
            transform: scale(1.1);
          }
        }
      }
      
      &.github {
        &::before {
          background: #24292f;
        }
        
        i {
          color: #24292f;
        }
        
        &:hover {
          border-color: #24292f;
          
          &::before {
            opacity: 1;
          }
          
          i {
            color: white;
            transform: scale(1.1);
          }
        }
      }
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
      }
      
      &:active {
        transform: translateY(-1px);
      }
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
    
    .social-login .social-buttons .social-btn {
      background: var(--el-fill-color-dark);
      border-color: var(--el-border-color);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-container-v2 {
    padding: 24px 20px;
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
  
  .social-login .social-buttons .social-btn {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}
</style>

