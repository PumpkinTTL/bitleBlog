<template>
    <div >
      <el-dialog
        v-model="dialogVisible"
        :width="dialogWidth"
        center
        destroy-on-close
        :show-close="false"
        custom-class="login-dialog"
      >
        <div class="login-container">
          <div class="login-backdrop"></div>
          <div class="login-decoration"></div>
          
          <!-- 登录头部 -->
          <div class="login-header">
            <div class="login-title">
              <span v-if="isRegisterMode">创建账号</span>
              <span v-else>欢迎回来</span>
            </div>
            <div class="login-subtitle">
              <span v-if="isRegisterMode">已有账号？</span>
              <span v-else>还没有账号？</span>
              <a href="javascript:;" @click="toggleMode">
                {{ isRegisterMode ? '去登录' : '去注册' }}
              </a>
            </div>
          </div>
  
          <!-- 登录方式切换 -->
          <div class="login-type-switch" v-if="!isRegisterMode">
            <span 
              :class="['switch-item', !isEmailLogin ? 'active' : '']" 
              @click="isEmailLogin = false"
            >
              账号密码登录
            </span>
            <span 
              :class="['switch-item', isEmailLogin ? 'active' : '']" 
              @click="isEmailLogin = true"
            >
              邮箱验证码登录
            </span>
          </div>
  
          <!-- 登录表单 -->
          <el-form 
            ref="formRef" 
            :model="formState" 
            :rules="formRules"
            class="login-form"
          >
            <!-- 注册模式的温馨提示 -->
            <div v-if="isRegisterMode" class="security-tips-box">
              <div class="tip-icon">
                <el-icon><Warning /></el-icon>
              </div>
              <div class="tip-content">
                <div class="tip-title">安全提示</div>
                <div class="tip-text">请使用电子邮箱注册，勿在用户名/密码中包含身份证号、手机号等敏感信息 
                  <a href="javascript:;" class="guide-link" @click="showSecurityGuide = true">查看安全指南</a>
                </div>
              </div>
            </div>
            
            <!-- 账号密码登录 -->
            <template v-if="!isEmailLogin">
              <!-- 用户名 -->
              <el-form-item prop="username" class="form-item">
                <el-input
                  v-model="formState.username"
                  placeholder="用户名"
                  clearable
                >
                  <template #prefix>
                    <el-icon class="input-icon"><User /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
        
              <!-- 密码 -->
              <el-form-item prop="password" class="form-item">
                <el-input
                  v-model="formState.password"
                  type="password"
                  placeholder="密码"
                  show-password
                  clearable
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Lock /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
            </template>
            
            <!-- 邮箱验证码登录 -->
            <template v-else>
              <!-- 邮箱 -->
              <el-form-item prop="email" class="form-item">
                <el-input
                  v-model="formState.email"
                  placeholder="请输入邮箱"
                  clearable
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Message /></el-icon>
                  </template>
                </el-input>
              </el-form-item>
              
              <!-- 验证码 -->
              <el-form-item prop="verificationCode" class="form-item">
                <el-input
                  v-model="formState.verificationCode"
                  placeholder="请输入验证码"
                  clearable
                >
                  <template #prefix>
                    <el-icon class="input-icon"><Key /></el-icon>
                  </template>
                  <template #append>
                    <el-button 
                      :disabled="codeButtonDisabled"
                      @click="sendVerificationCode"
                      class="code-button"
                    >
                      {{ codeButtonText }}
                    </el-button>
                  </template>
                </el-input>
              </el-form-item>
            </template>
  
            <!-- 注册时的确认密码 -->
            <el-form-item v-if="isRegisterMode" prop="confirmPassword" class="form-item">
              <el-input
                v-model="formState.confirmPassword"
                type="password"
                placeholder="确认密码"
                show-password
                clearable
              >
                <template #prefix>
                  <el-icon class="input-icon"><Lock /></el-icon>
                </template>
              </el-input>
            </el-form-item>
  
            <!-- 记住我和忘记密码 -->
            <div v-if="!isRegisterMode && !isEmailLogin" class="login-options">
              <el-checkbox v-model="formState.remember">记住我</el-checkbox>
              <a href="javascript:;" class="forgot-link">忘记密码？</a>
            </div>
  
            <!-- 登录按钮 -->
            <div class="form-actions">
              <el-button 
                type="primary" 
                :loading="loading" 
                class="submit-btn" 
                @click="handleSubmit"
              >
                <span class="btn-text">
                  {{ isRegisterMode ? '注册' : '登录' }}
                </span>
                <span class="btn-icon">
                  <el-icon><ArrowRight /></el-icon>
                </span>
              </el-button>
            </div>
          </el-form>
  
          <!-- 登录表单底部添加协议同意提示 -->
          <div class="agreement-notice">
            <span>登录或注册即表示您同意</span>
            <span  class="policy-link" @click="openUserAgreement">《用户协议》</span>
            <span>和</span>
            <span class="policy-link" @click="openPrivacyPolicy">《隐私政策》</span>
          </div>
  
          <!-- 第三方登录 -->
          <div class="third-party-login">
            <div class="divider">
              <span>其他登录方式</span>
            </div>
            <div class="social-icons">
              <button class="social-icon wechat">
                <el-icon><ChatDotSquare /></el-icon>
              </button>
              <button class="social-icon qq">
                <el-icon><Connection /></el-icon>
              </button>
              <button class="social-icon github">
                <el-icon><Platform /></el-icon>
              </button>
            </div>
          </div>
  
          <!-- 关闭按钮 -->
          <button class="close-dialog" @click="closeDialog">
            <el-icon><Close /></el-icon>
          </button>
        </div>
      </el-dialog>
  
      <!-- 安全指南弹窗 -->
      <el-dialog
        v-model="showSecurityGuide"
        title="账号安全指南"
        width="60%"
        class="guide-dialog"
        :before-close="() => showSecurityGuide = false"
        append-to-body
      >
        <SecurityGuide />
        <template #footer>
          <div class="guide-dialog-footer">
            <el-button @click="showSecurityGuide = false">我知道了</el-button>
          </div>
        </template>
      </el-dialog>
      
      <!-- 用户协议弹窗 -->
      <el-dialog
        v-model="showUserAgreement"
        title="用户协议"
        width="60%"
        class="agreement-dialog"
        :before-close="() => showUserAgreement = false"
        append-to-body
      >
        <UserAgreement />
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showUserAgreement = false">关闭</el-button>
          </div>
        </template>
      </el-dialog>
      
      <!-- 隐私政策弹窗 -->
      <el-dialog
        v-model="showPrivacyPolicy"
        title="隐私政策"
        width="60%"
        class="agreement-dialog"
        :before-close="() => showPrivacyPolicy = false"
        append-to-body
      >
        <PrivacyPolicy />
        <template #footer>
          <div class="dialog-footer">
            <el-button @click="showPrivacyPolicy = false">关闭</el-button>
          </div>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, reactive, onMounted, onUnmounted } from 'vue'
  import { useStore } from '../store'
  import { message } from 'ant-design-vue'
  import {
    User,
    Lock,
    Close,
    ChatDotSquare,
    Connection,
    Platform,
    ArrowRight,
    Message,
    Key,
    Warning
  } from '@element-plus/icons-vue'
  import { loginR } from '../request/user'
  import { setToken } from '../util/Auth'
  import SecurityGuide from './platform/SecurityGuide.vue'
  import UserAgreement from './platform/UserAgreement.vue'
  import PrivacyPolicy from './platform/PrivacyPolicy.vue'
  
  // 获取 store
  const store = useStore()
  
  // 登录/注册模式
  const isRegisterMode = ref(false)
  
  // 邮箱登录模式
  const isEmailLogin = ref(false)
  
  // 弹窗可见性
  const dialogVisible = computed({
    get: () => store.showLoginModal,
    set: (val) => {
      if (!val) store.showLoginModal = false
    }
  })
  
  // 在页面底部添加安全指南弹窗
  const showSecurityGuide = ref(false)
  // 添加协议弹窗状态变量
  const showUserAgreement = ref(false)
  const showPrivacyPolicy = ref(false)
  
  // 响应式弹窗宽度
  const dialogWidth = ref('420px')
  
  // 更新对话框宽度
  const updateDialogWidth = () => {
    if (window.innerWidth <= 480) {
      dialogWidth.value = '90%'
    } else {
      dialogWidth.value = '420px'
    }
  }
  
  // 监听全局登录事件
  const handleShowLogin = () => {
    store.showLoginModal = true
  }

  // 监听窗口大小变化
  onMounted(() => {
    updateDialogWidth()
    window.addEventListener('resize', updateDialogWidth)
    // 监听全局登录弹窗事件
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
  let timer = null
  
  // 发送验证码
  const sendVerificationCode = () => {
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formState.email)) {
      message.error('请输入有效的邮箱地址')
      return
    }
    
    // 模拟发送验证码
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
      { 
        required: true, 
        message: '请确认密码', 
        trigger: 'blur' 
      },
      { 
        validator: (rule, value, callback) => {
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
      { 
        type: 'email', 
        message: '请输入正确的邮箱格式', 
        trigger: 'blur' 
      }
    ],
    verificationCode: [
      { required: true, message: '请输入验证码', trigger: 'blur' },
      { 
        min: 4, 
        max: 6, 
        message: '验证码长度不正确', 
        trigger: 'blur' 
      }
    ]
  }
  
  // 表单引用
  const formRef = ref(null)
  
  // 加载状态
  const loading = ref(false)
  
  // 切换登录/注册模式
  const toggleMode = () => {
    isRegisterMode.value = !isRegisterMode.value
    isEmailLogin.value = false
    // 清空表单
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
    
    // 清除验证码计时器
    if (timer) {
      clearInterval(timer)
      codeButtonDisabled.value = false
      codeButtonText.value = '获取验证码'
    }
  }
  
  // 保存用户信息到本地存储
  const saveUserToLocalStorage = (userInfo) => {
    localStorage.setItem('userInfo', JSON.stringify(userInfo))
    localStorage.setItem('isLogin', 'true')
    
    // 如果勾选了记住我，保存登录凭证
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
      await formRef.value.validate()
      loading.value = true
      
      if (isRegisterMode.value) {
        // 注册逻辑 - 这里需要实现注册API
        message.success('注册成功')
        isRegisterMode.value = false
        loading.value = false
      } else if (isEmailLogin.value) {
        // 邮箱验证码登录逻辑
        try {
          const params = {
            email: formState.email,
            code: formState.verificationCode
          }
          
          // 此处应该改为邮箱验证码登录API
          const res = await loginR(params)
          
          if (res.data.code === 200) {
            const userInfo = res.data.data
            
            // 更新store
            store.isLogin = true
            store.userInfo = userInfo
            
            // 保存到localStorage
            saveUserToLocalStorage(userInfo)
            
            closeDialog()
            // message.success(res.data.msg || '登录成功')
          } else {
            message.error(res.data.msg || '登录失败，请检查邮箱和验证码')
          }
        } catch (error) {
          console.error('登录失败:', error)
          message.error(error.response?.data?.msg || '登录请求失败，请稍后再试')
        } finally {
          loading.value = false
        }
      } else {
        // 账号密码登录逻辑
        try {
          const params = {
            account: formState.username,
            password: formState.password,
            action: 'pwd'
          }

          const res = await loginR(params)

          if (res.code === 200) {
            const userInfo = res.data

            // 更新store（后端已返回包含premium等字段的完整用户信息）
            store.isLogin = true
            store.userInfo = userInfo

            // 提取角色和权限
            const roles = userInfo.roles?.map((r) => r.iden) || []
            const permissions = []
            userInfo.roles?.forEach((role) => {
              role.permissions?.forEach((perm) => {
                if (perm.name && !permissions.includes(perm.name)) {
                  permissions.push(perm.name)
                }
              })
            })

            // 构建Token数据结构
            const tokenData = {
              token: res.token,
              expires: res.expireTime * 1000, // 后端返回秒级时间戳，转换为毫秒
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

            // 使用新的单Token管理：同时保存到Authorization cookie和userInfo localStorage
            setToken(tokenData)

            // 保存用户信息到localStorage（兼容旧代码）
            saveUserToLocalStorage(userInfo)

            // 兼容旧的localStorage字段
            if (formState.remember && userInfo.username) {
              localStorage.setItem('loginCredentials', JSON.stringify({
                username: userInfo.username
              }))
            }
            localStorage.setItem('isLogin', 'true')

            // 调试日志：显示premium状态
            console.log('[Login] 登录成功，用户premium状态:', userInfo.premium)
            console.log('[Login] Token过期时间:', new Date(tokenData.expires))

            message.success('登录成功')
            closeDialog()

          } else {
            message.error(res.msg || '登录失败，请检查用户名和密码')
          }
        } catch (error) {
          console.error('登录失败:', error)
          message.error(error.response?.data?.msg || '登录请求失败，请稍后再试')
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
    // 重置表单
    resetForm()
    isRegisterMode.value = false
    isEmailLogin.value = false
    
    // 清除验证码计时器
    if (timer) {
      clearInterval(timer)
    }
  }
  
  // 调试用：打开隐私政策和用户协议的方法
  const openUserAgreement = () => {
    console.log('打开用户协议')
    showUserAgreement.value = true
  }

  const openPrivacyPolicy = () => {
    console.log('打开隐私政策')
    showPrivacyPolicy.value = true
  }
  </script>
  
  <style scoped>
  .login-dialog :deep(.el-dialog__header) {
    display: none;
  }
  
  .login-dialog :deep(.el-dialog__body) {
    padding: 0;
  }
  
  .login-dialog :deep(.el-dialog) {
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 15px 30px -12px rgba(0, 0, 0, 0.2);
    background: transparent;
    margin: 0 !important;
  }
  
  .login-container {
    font-family: 'OPPO Sans' System UI', ' Helvetica Neue', Arial, sans-serif';
    position: relative;
    padding: 0;
    background-color: #fff;
    display: flex;
    flex-direction: column;
    border-radius: 12px;
    overflow: hidden;
  }
  
  .login-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #409EFF 0%, #1677ff 100%);
    opacity: 0.03;
    z-index: 0;
  }
  
  .login-decoration {
    position: absolute;
    top: -40px;
    right: -40px;
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: linear-gradient(135deg, #409EFF 0%, #1677ff 100%);
    opacity: 0.08;
    z-index: 0;
  }
  
  .login-decoration::before {
    content: '';
    position: absolute;
    bottom: -60px;
    left: -80px;
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, #409EFF 0%, #64b5f6 100%);
    opacity: 0.15;
  }
  
  .login-header {
    text-align: center;
    padding: 20px 15px 5px;
    position: relative;
    z-index: 1;
  }
  
  .login-title {
    font-size: 22px;
    font-weight: 600;
    color: #1677ff;
    margin-bottom: 6px;
  }
  
  .login-subtitle {
    font-size: 14px;
    color: #606266;
  }
  
  .login-subtitle a {
    color: #409EFF;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
    margin-left: 4px;
  }
  
  .login-subtitle a:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
  
  /* 登录方式切换 */
  .login-type-switch {
    display: flex;
    justify-content: center;
    padding: 8px 20px 0;
    position: relative;
    z-index: 1;
  }
  
  .switch-item {
    padding: 5px 12px;
    margin: 0 6px;
    cursor: pointer;
    font-size: 14px;
    color: #606266;
    border-radius: 14px;
    transition: all 0.3s;
    background-color: transparent;
    position: relative;
  }
  
  .switch-item:hover {
    color: #409EFF;
  }
  
  .switch-item.active {
    color: #409EFF;
    background-color: rgba(64, 158, 255, 0.1);
    font-weight: 500;
  }
  
  .switch-item.active::after {
    content: '';
    position: absolute;
    bottom: -2px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 2px;
    background-color: #409EFF;
    border-radius: 1px;
  }
  
  .login-form {
    padding: 10px 20px 0;
    margin-bottom: 5px;
    position: relative;
    z-index: 1;
  }
  
  .form-item {
    margin-bottom: 15px !important;
  }
  
  .login-form :deep(.el-input__wrapper) {
    height: 38px;
    line-height: 38px;
    box-sizing: border-box;
    box-shadow: none;
    border: 1px solid #e4e7ed;
    border-radius: 8px;
    padding: 6px 10px;
    transition: all 0.3s;
    background-color: #f5f7fa;
  }
  
  .login-form :deep(.el-input__wrapper:hover) {
    border-color: #c0c4cc;
    background-color: #fff;
  }
  
  .login-form :deep(.el-input__wrapper.is-focus) {
    border-color: #409EFF;
    background-color: #fff;
    box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.15);
  }
  
  .login-form :deep(.el-input__inner) {
    height: 22px;
    color: #303133;
  }
  
  .login-form :deep(.el-input-group__append) {
    padding: 0;
    background-color: transparent;
    border: none;
  }
  
  .input-icon {
    margin-right: 4px;
    color: #909399;
  }
  
  .code-button {
    height: 100%;
    margin: 0;
    border-radius: 0 8px 8px 0;
    padding: 0 12px;
    font-size: 13px;
    border: none;
    background: linear-gradient(90deg, #409EFF 0%, #1677ff 100%);
    color: white !important;
    min-width: 100px;
    font-weight: normal;
  }
  
  .login-form :deep(.el-input-group__append .el-button) {
    border-radius: 0 7px 7px 0;
    height: 38px;
  }
  
  .login-form :deep(.el-input-group .el-input__wrapper) {
    border-right: none;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  
  .login-form :deep(.el-button.is-disabled) {
    background: #a0cfff;
    color: white !important;
    opacity: 0.8;
  }
  
  .login-options {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
    font-size: 14px;
    padding: 0 20px;
  }
  
  .login-options :deep(.el-checkbox__label) {
    color: #606266;
  }
  
  .forgot-link {
    color: #409EFF;
    text-decoration: none;
    transition: all 0.3s;
    font-weight: 500;
  }
  
  .forgot-link:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
  
  .form-actions {
    padding: 0 20px;
    margin-top: 5px;
  }
  
  .submit-btn {
    width: 100%;
    height: 38px;
    border-radius: 8px;
    font-weight: 500;
    background: linear-gradient(90deg, #409EFF 0%, #1677ff 100%);
    border: none;
    color: white;
    font-size: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
    transition: all 0.3s;
  }
  
  .submit-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 5px 15px rgba(24, 144, 255, 0.3);
  }
  
  .submit-btn:hover .btn-icon {
    transform: translateX(3px);
  }
  
  .submit-btn::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    transform: translateX(-100%);
    transition: all 0.6s;
  }
  
  .submit-btn:hover::before {
    transform: translateX(100%);
  }
  
  .btn-text {
    margin-right: 6px;
  }
  
  .btn-icon {
    transition: all 0.3s;
  }
  
  .third-party-login {
    margin-top: auto;
    padding: 10px 20px 18px;
    position: relative;
    z-index: 1;
  }
  
  .divider {
    display: flex;
    align-items: center;
    color: #909399;
    font-size: 13px;
    margin-bottom: 12px;
  }
  
  .divider::before,
  .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: linear-gradient(to right, rgba(228, 231, 237, 0), rgba(228, 231, 237, 1), rgba(228, 231, 237, 0));
  }
  
  .divider span {
    padding: 0 12px;
  }
  
  .social-icons {
    display: flex;
    justify-content: center;
    gap: 15px;
  }
  
  .social-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 8px;
    cursor: pointer;
    border: 1px solid #e4e7ed;
    background-color: #fff;
    color: #909399;
    transition: all 0.3s;
    position: relative;
    overflow: hidden;
  }
  
  .social-icon::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transform: scale(0);
    transition: all 0.4s;
    z-index: 0;
    border-radius: 8px;
  }
  
  .social-icon:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.08);
    color: white;
    border-color: transparent;
  }
  
  .social-icon .el-icon {
    font-size: 18px;
    position: relative;
    z-index: 2;
  }
  
  .wechat::before {
    background-color: #07c160;
  }
  
  .wechat:hover::before {
    transform: scale(1);
  }
  
  .qq::before {
    background-color: #12b7f5;
  }
  
  .qq:hover::before {
    transform: scale(1);
  }
  
  .github::before {
    background-color: #24292f;
  }
  
  .github:hover::before {
    transform: scale(1);
  }
  
  .close-dialog {
    position: absolute;
    top: 12px;
    right: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    border: 1px solid #e4e7ed;
    background: #fff;
    cursor: pointer;
    color: #909399;
    transition: all 0.3s;
    z-index: 10;
  }
  
  .close-dialog:hover {
    background-color: #f5f7fa;
    color: #606266;
    transform: rotate(90deg);
  }
  
  /* 添加动画过渡效果 */
  .login-dialog :deep(.el-dialog) {
    transform: translateY(0);
    animation: dialogIn 0.4s cubic-bezier(0.3, 1.2, 0.3, 1);
  }
  
  @keyframes dialogIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.97);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
  
  .login-form :deep(.el-form-item) {
    animation: staggeredFadeIn 0.4s ease forwards;
    opacity: 0;
  }
  
  .login-form :deep(.el-form-item:nth-child(1)) {
    animation-delay: 0.1s;
  }
  
  .login-form :deep(.el-form-item:nth-child(2)) {
    animation-delay: 0.2s;
  }
  
  .login-form :deep(.el-form-item:nth-child(3)) {
    animation-delay: 0.3s;
  }
  
  /* 安全提示样式 */
  .security-tips-box {
    display: flex;
    align-items: flex-start;
    background: linear-gradient(to right, rgba(255, 182, 49, 0.05), rgba(255, 182, 49, 0.01));
    border-radius: 8px;
    border-left: 3px solid #E6A23C;
    padding: 10px 12px;
    margin-bottom: 16px;
    animation: staggeredFadeIn 0.4s ease forwards;
    opacity: 0;
    animation-delay: 0.05s;
  }
  
  .security-tips-box .tip-icon {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    background-color: rgba(230, 162, 60, 0.1);
    border-radius: 50%;
    margin-right: 10px;
    margin-top: 2px;
  }
  
  .security-tips-box .tip-icon .el-icon {
    font-size: 14px;
    color: #E6A23C;
  }
  
  .security-tips-box .tip-content {
    flex: 1;
  }
  
  .security-tips-box .tip-title {
    font-size: 13px;
    font-weight: 500;
    color: #E6A23C;
    margin-bottom: 3px;
  }
  
  .security-tips-box .tip-text {
    font-size: 12px;
    color: #8A6D3B;
    line-height: 1.5;
  }
  
  /* 安全指南链接样式 */
  .guide-link {
    color: #E6A23C;
    text-decoration: underline;
    margin-left: 3px;
    font-weight: 500;
    transition: all 0.3s;
  }
  
  .guide-link:hover {
    color: #c78617;
  }
  
  /* 安全指南弹窗样式 */
  .guide-dialog :deep(.el-dialog__header) {
    padding: 16px 20px;
    margin-right: 0;
    border-bottom: 1px solid #ebeef5;
  }
  
  .guide-dialog :deep(.el-dialog__title) {
    font-size: 16px;
    font-weight: 600;
    color: #409EFF;
  }
  
  .guide-dialog :deep(.el-dialog__body) {
    padding: 20px;
    max-height: 70vh;
    overflow-y: auto;
  }
  
  .guide-dialog :deep(.el-dialog__footer) {
    padding: 12px 20px;
    border-top: 1px solid #ebeef5;
  }
  
  .guide-dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
  
  @keyframes staggeredFadeIn {
    from {
      opacity: 0;
      transform: translateY(15px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  /* 移动端适配 */
  @media screen and (max-width: 480px) {
    .login-dialog :deep(.el-dialog) {
      border-radius: 10px;
    }
    
    .login-header {
      padding: 18px 15px 5px;
    }
    
    .login-title {
      font-size: 20px;
    }
    
    .login-subtitle {
      font-size: 13px;
    }
    
    .login-type-switch {
      padding: 6px 15px 0;
    }
    
    .switch-item {
      padding: 4px 10px;
      font-size: 13px;
    }
    
    .login-form {
      padding: 8px 15px 0;
    }
    
    .form-item {
      margin-bottom: 12px !important;
    }
    
    .login-form :deep(.el-input__wrapper) {
      padding: 5px 10px;
    }
    
    .code-button {
      font-size: 12px;
      padding: 4px 6px;
      min-width: 75px;
    }
    
    .login-options {
      padding: 0 15px;
      margin-bottom: 12px;
    }
    
    .form-actions {
      padding: 0 15px;
    }
    
    .submit-btn {
      height: 36px;
    }
    
    .third-party-login {
      padding: 8px 15px 15px;
    }
    
    .social-icons {
      gap: 12px;
    }
    
    .social-icon {
      width: 36px;
      height: 36px;
    }
    
    .close-dialog {
      width: 26px;
      height: 26px;
      top: 10px;
      right: 10px;
    }
  }
  
  /* 协议提示样式 */
  .agreement-notice {
    text-align: center;
    margin-top: 20px;
    font-size: 13px;
    color: #909399;
  }
  
  .agreement-notice a.policy-link {
    color: #409EFF;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.3s;
  }
  
  .agreement-notice a.policy-link:hover {
    opacity: 0.8;
    text-decoration: underline;
  }
  
  /* 弹窗样式 */
  .guide-dialog :deep(.el-dialog__body),
  .agreement-dialog :deep(.el-dialog__body) {
    padding: 0;
    max-height: 70vh;
    overflow-y: auto;
  }
  
  .agreement-dialog :deep(.el-dialog__header) {
    padding: 16px 20px;
    margin-right: 0;
    border-bottom: 1px solid #ebeef5;
  }
  
  .agreement-dialog :deep(.el-dialog__title) {
    font-size: 16px;
    font-weight: 600;
    color: #303133;
  }
  
  .agreement-dialog :deep(.el-dialog__footer) {
    padding: 12px 20px;
    border-top: 1px solid #ebeef5;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
  
  .tips-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .tips-icon {
    color: #909399;
    font-size: 18px;
  }
  
  .view-guide {
    margin-left: 5px;
    font-size: 13px;
  }
  </style>