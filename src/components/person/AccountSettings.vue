<template>
  <div class="settings-section animate__animated animate__fadeIn">
    <!-- 基本设置卡片 -->
    <div class="settings-card">
      <div class="settings-card-header">
        <div class="header-icon">
          <i class="fas fa-user-cog"></i>
        </div>
        <span>基本设置</span>
      </div>
      
      <div class="settings-card-body">
        <el-form :model="form" :rules="rules" ref="formRef" label-width="80px" class="compact-form">
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="用户名" prop="username">
                <el-input v-model="form.username" placeholder="请输入用户名" size="small">
                  <template #prefix>
                    <i class="fas fa-user input-icon"></i>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="电子邮箱" prop="email">
                <el-input v-model="form.email" placeholder="请输入邮箱" size="small">
                  <template #prefix>
                    <i class="fas fa-envelope input-icon"></i>
                  </template>
                </el-input>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="个人简介" prop="bio">
            <el-input 
              v-model="form.bio" 
              type="textarea" 
              :rows="3"
              placeholder="介绍一下自己吧..."
              maxlength="200"
              show-word-limit
              size="small"
            ></el-input>
          </el-form-item>
          
          <el-form-item label="社交链接">
            <div class="social-links">
              <div class="social-link-item">
                <el-input 
                  v-model="form.socialLinks.github" 
                  placeholder="GitHub 主页"
                  size="small"
                >
                  <template #prefix>
                    <i class="fab fa-github"></i>
                  </template>
                </el-input>
              </div>
              <div class="social-link-item">
                <el-input 
                  v-model="form.socialLinks.weibo" 
                  placeholder="微博主页"
                  size="small"
                >
                  <template #prefix>
                    <i class="fab fa-weibo"></i>
                  </template>
                </el-input>
              </div>
              <div class="social-link-item">
                <el-input 
                  v-model="form.socialLinks.website" 
                  placeholder="个人网站"
                  size="small"
                >
                  <template #prefix>
                    <i class="fas fa-globe"></i>
                  </template>
                </el-input>
              </div>
            </div>
          </el-form-item>
          
          <el-form-item class="form-actions">
            <el-button type="primary" @click="submitForm" :loading="loading" size="small" class="action-button">
              <i class="fas fa-save"></i> 保存设置
            </el-button>
            <el-button @click="resetForm" size="small" class="action-button">
              <i class="fas fa-undo"></i> 重置
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    
    <!-- 安全设置卡片 -->
    <div class="settings-card">
      <div class="settings-card-header">
        <div class="header-icon security">
          <i class="fas fa-shield-alt"></i>
        </div>
        <span>安全设置</span>
      </div>
      
      <div class="settings-card-body">
        <div class="security-items">
          <div class="security-item animate__animated animate__fadeIn" style="animation-delay: 0.1s">
            <div class="security-item-info">
              <div class="security-icon password">
                <i class="fas fa-key"></i>
              </div>
              <div class="security-item-content">
                <div class="security-item-title">账号密码</div>
                <div class="security-item-desc">定期修改密码可以保护账号安全</div>
              </div>
            </div>
            <div class="security-item-action">
              <el-button type="warning" @click="changePassword" size="small" class="action-button">
                <i class="fas fa-lock"></i> 修改密码
              </el-button>
            </div>
          </div>
          
          <div class="security-item animate__animated animate__fadeIn" style="animation-delay: 0.2s">
            <div class="security-item-info">
              <div class="security-icon phone">
                <i class="fas fa-mobile-alt"></i>
              </div>
              <div class="security-item-content">
                <div class="security-item-title">手机绑定</div>
                <div class="security-item-desc">
                  {{ form.phone ? `已绑定手机：${maskPhone(form.phone)}` : '未绑定手机号码' }}
                </div>
              </div>
            </div>
            <div class="security-item-action">
              <el-button @click="bindPhone" size="small" class="action-button">
                <i class="fas fa-link"></i> {{ form.phone ? '更换手机' : '绑定手机' }}
              </el-button>
            </div>
          </div>
          
          <div class="security-item animate__animated animate__fadeIn" style="animation-delay: 0.3s">
            <div class="security-item-info">
              <div class="security-icon danger">
                <i class="fas fa-user-slash"></i>
              </div>
              <div class="security-item-content">
                <div class="security-item-title">账号注销</div>
                <div class="security-item-desc">注销后，账号数据将无法恢复</div>
              </div>
            </div>
            <div class="security-item-action">
              <el-button type="danger" @click="showDeleteAccountDialog" size="small" class="action-button">
                <i class="fas fa-trash-alt"></i> 注销账号
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 修改密码对话框 -->
    <el-dialog
      v-model="passwordDialogVisible"
      title="修改密码"
      width="400px"
      center
      append-to-body
      custom-class="custom-dialog"
    >
      <div class="dialog-icon-header">
        <div class="dialog-icon">
          <i class="fas fa-lock"></i>
        </div>
      </div>
      
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="85px" class="compact-form">
        <el-form-item label="当前密码" prop="currentPassword">
          <el-input 
            v-model="passwordForm.currentPassword" 
            type="password" 
            placeholder="请输入当前密码"
            show-password
            size="small"
          >
            <template #prefix>
              <i class="fas fa-key input-icon"></i>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="新密码" prop="newPassword">
          <el-input 
            v-model="passwordForm.newPassword" 
            type="password" 
            placeholder="请输入新密码"
            show-password
            size="small"
          >
            <template #prefix>
              <i class="fas fa-lock input-icon"></i>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input 
            v-model="passwordForm.confirmPassword" 
            type="password" 
            placeholder="请再次输入新密码"
            show-password
            size="small"
          >
            <template #prefix>
              <i class="fas fa-check-circle input-icon"></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="passwordDialogVisible = false" size="small">取消</el-button>
          <el-button type="primary" @click="submitPasswordChange" :loading="passwordLoading" size="small">确认修改</el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 注销账号确认对话框 -->
    <el-dialog
      v-model="deleteAccountDialogVisible"
      title="账号注销确认"
      width="400px"
      center
      append-to-body
      custom-class="custom-dialog danger-dialog"
    >
      <div class="dialog-icon-header danger">
        <div class="dialog-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
      </div>
      
      <div class="delete-account-warning">
        <div class="warning-text">
          <p class="warning-title">注销账号是不可逆操作，请谨慎操作！</p>
          <p>注销后将会：</p>
          <ul>
            <li><i class="fas fa-times-circle"></i> 删除您的个人资料</li>
            <li><i class="fas fa-times-circle"></i> 删除您发布的所有文章</li>
            <li><i class="fas fa-times-circle"></i> 删除您的所有评论和互动</li>
            <li><i class="fas fa-times-circle"></i> 无法恢复您的账号数据</li>
          </ul>
        </div>
      </div>
      
      <el-form :model="deleteAccountForm" :rules="deleteAccountRules" ref="deleteAccountFormRef" class="compact-form">
        <el-form-item prop="confirmText">
          <el-input 
            v-model="deleteAccountForm.confirmText" 
            placeholder="请输入'确认注销'"
            size="small"
          >
            <template #prefix>
              <i class="fas fa-keyboard input-icon"></i>
            </template>
          </el-input>
        </el-form-item>
        
        <el-form-item prop="password">
          <el-input 
            v-model="deleteAccountForm.password" 
            type="password" 
            placeholder="请输入密码确认"
            show-password
            size="small"
          >
            <template #prefix>
              <i class="fas fa-lock input-icon"></i>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="deleteAccountDialogVisible = false" size="small">取消</el-button>
          <el-button type="danger" @click="confirmDeleteAccount" :loading="deleteAccountLoading" size="small">确认注销</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 定义组件属性
const props = defineProps({
  // 用户信息
  userInfo: {
    type: Object,
    default: () => ({})
  }
})

// 定义事件
const emit = defineEmits(['update', 'password-changed'])

// 表单引用
const formRef = ref(null)
const passwordFormRef = ref(null)
const deleteAccountFormRef = ref(null)

// 加载状态
const loading = ref(false)
const passwordLoading = ref(false)
const deleteAccountLoading = ref(false)

// 对话框可见状态
const passwordDialogVisible = ref(false)
const deleteAccountDialogVisible = ref(false)

// 表单数据
const form = reactive({
  username: '',
  email: '',
  bio: '',
  phone: '',
  socialLinks: {
    github: '',
    weibo: '',
    website: ''
  }
})

// 密码表单
const passwordForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: ''
})

// 注销账号表单
const deleteAccountForm = reactive({
  confirmText: '',
  password: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 2, max: 20, message: '用户名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  bio: [
    { max: 200, message: '个人简介不能超过200个字符', trigger: 'blur' }
  ]
}

// 密码表单验证规则
const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能少于6个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 注销账号表单验证规则
const deleteAccountRules = {
  confirmText: [
    { required: true, message: '请输入确认文字', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== '确认注销') {
          callback(new Error('请输入正确的确认文字'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' }
  ]
}

// 初始化表单数据
onMounted(() => {
  // 填充表单数据
  if (props.userInfo) {
    form.username = props.userInfo.username || ''
    form.email = props.userInfo.email || ''
    form.bio = props.userInfo.bio || ''
    form.phone = props.userInfo.phone || ''
    
    // 社交链接
    if (props.userInfo.socialLinks) {
      form.socialLinks = {
        github: props.userInfo.socialLinks.github || '',
        weibo: props.userInfo.socialLinks.weibo || '',
        website: props.userInfo.socialLinks.website || ''
      }
    }
  }
})

// 屏蔽手机号中间四位
const maskPhone = (phone) => {
  if (!phone || phone.length < 7) return phone
  return phone.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
}

// 提交表单
const submitForm = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    loading.value = true
    
    // 模拟API调用
    setTimeout(() => {
      loading.value = false
      ElMessage.success('设置保存成功')
      emit('update', form)
    }, 1000)
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

// 重置表单
const resetForm = () => {
  if (formRef.value) {
    formRef.value.resetFields()
  }
}

// 修改密码
const changePassword = () => {
  passwordDialogVisible.value = true
  // 重置密码表单
  passwordForm.currentPassword = ''
  passwordForm.newPassword = ''
  passwordForm.confirmPassword = ''
}

// 提交密码修改
const submitPasswordChange = async () => {
  if (!passwordFormRef.value) return
  
  try {
    await passwordFormRef.value.validate()
    passwordLoading.value = true
    
    // 模拟API调用
    setTimeout(() => {
      passwordLoading.value = false
      passwordDialogVisible.value = false
      ElMessage.success('密码修改成功，请使用新密码登录')
      emit('password-changed')
    }, 1000)
  } catch (error) {
    console.error('表单验证失败', error)
  }
}

// 绑定手机
const bindPhone = () => {
  ElMessage.info('手机绑定功能开发中')
}

// 显示注销账号对话框
const showDeleteAccountDialog = () => {
  deleteAccountDialogVisible.value = true
  // 重置注销账号表单
  deleteAccountForm.confirmText = ''
  deleteAccountForm.password = ''
}

// 确认注销账号
const confirmDeleteAccount = async () => {
  if (!deleteAccountFormRef.value) return
  
  try {
    await deleteAccountFormRef.value.validate()
    deleteAccountLoading.value = true
    
    // 模拟API调用
    setTimeout(() => {
      deleteAccountLoading.value = false
      deleteAccountDialogVisible.value = false
      
      ElMessageBox.alert(
        '您的账号已成功注销，感谢您使用我们的服务。',
        '注销成功',
        {
          confirmButtonText: '确定',
          callback: () => {
            // 退出登录并跳转到首页
            window.location.href = '/'
          }
        }
      )
    }, 1000)
  } catch (error) {
    console.error('表单验证失败', error)
  }
}
</script>

<style lang="less" scoped>
// 变量定义
@primary-color: #1890ff;
@primary-dark: #096dd9;
@primary-light: #40a9ff;
@primary-bg: #e6f7ff;
@text-color: #333;
@text-secondary: #666;
@text-light: #999;
@border-color: #eaeaea;
@success-color: #52c41a;
@warning-color: #faad14;
@danger-color: #f5222d;

.settings-section {
  padding: 5px;
  font-size: 13px;
}

// 设置卡片样式
.settings-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  margin-bottom: 16px;
  overflow: hidden;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
}

.settings-card-header {
  padding: 14px 16px;
  border-bottom: 1px solid rgba(240, 240, 240, 0.8);
  display: flex;
  align-items: center;
  background: linear-gradient(to right, rgba(24, 144, 255, 0.04), rgba(255, 255, 255, 0.01));
  position: relative;
  
  .header-icon {
    width: 32px;
    height: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #1890ff, #096dd9);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 12px;
    box-shadow: 0 4px 8px rgba(24, 144, 255, 0.2);
    
    i {
      font-size: 14px;
    }
    
    &.security {
      background: linear-gradient(135deg, #722ed1, #531dab);
      box-shadow: 0 4px 8px rgba(114, 46, 209, 0.2);
    }
  }
  
  span {
    font-size: 16px;
    font-weight: 600;
    color: @text-color;
    letter-spacing: 0.3px;
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 4px;
    background: linear-gradient(to right, #1890ff, transparent);
  }
}

.settings-card-body {
  padding: 18px;
}

// 紧凑表单样式
.compact-form {
  .el-form-item {
    margin-bottom: 14px;
  }
  
  :deep(.el-form-item__label) {
    font-size: 13px;
    padding-right: 8px;
    color: @text-secondary;
  }
  
  :deep(.el-form-item__content) {
    font-size: 13px;
  }
  
  :deep(.el-input__inner) {
    font-size: 13px;
    transition: all 0.3s;
    
    &:focus {
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }
  }
  
  :deep(.el-input__prefix) {
    display: flex;
    align-items: center;
  }
  
  .input-icon {
    color: #bfbfbf;
    font-size: 14px;
    transition: all 0.3s;
  }
  
  :deep(.el-input:focus-within .input-icon) {
    color: @primary-color;
  }
}

// 社交链接样式
.social-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.social-link-item {
  display: flex;
  align-items: center;
  
  :deep(.el-input__prefix) {
    margin-right: 5px;
    
    i {
      transition: all 0.3s;
      font-size: 16px;
    }
  }
  
  &:nth-child(1) {
    :deep(.el-input__prefix i) {
      color: #333;
    }
    
    :deep(.el-input:focus-within .el-input__prefix i) {
      color: #333;
    }
  }
  
  &:nth-child(2) {
    :deep(.el-input__prefix i) {
      color: #e6162d;
    }
    
    :deep(.el-input:focus-within .el-input__prefix i) {
      color: #e6162d;
    }
  }
  
  &:nth-child(3) {
    :deep(.el-input__prefix i) {
      color: #1890ff;
    }
    
    :deep(.el-input:focus-within .el-input__prefix i) {
      color: #1890ff;
    }
  }
}

// 表单操作区
.form-actions {
  margin-bottom: 0 !important;
  margin-top: 20px;
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  
  .action-button {
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    border-radius: 8px;
    padding: 8px 16px;
    position: relative;
    overflow: hidden;
    
    i {
      margin-right: 6px;
    }
    
    &:hover {
      transform: translateY(-3px);
      box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
      opacity: 0;
      transition: opacity 0.3s;
    }
    
    &:hover::after {
      opacity: 1;
    }
  }
  
  .el-button[type="primary"] {
    background: linear-gradient(135deg, #1890ff, #096dd9);
    border-color: #096dd9;
    font-weight: 500;
    
    &:hover {
      background: linear-gradient(135deg, #40a9ff, #1890ff);
      border-color: #1890ff;
    }
  }
  
  .el-button:not([type="primary"]) {
    background: #f5f5f5;
    border-color: #d9d9d9;
    color: @text-secondary;
    
    &:hover {
      color: @text-color;
      background: #f0f0f0;
      border-color: #d9d9d9;
    }
  }
}

// 安全设置项
.security-items {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.security-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background-color: #fafafa;
  border-radius: 10px;
  transition: all 0.3s;
  border: 1px solid transparent;
  
  &:hover {
    background-color: #f0f7ff;
    border-color: rgba(24, 144, 255, 0.1);
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.03);
  }

  .security-item-action {
    .action-button {
      border-radius: 8px;
      padding: 8px 14px;
      font-size: 13px;
      transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      overflow: hidden;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
      }
      
      &::after {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
        opacity: 0;
        transition: opacity 0.3s;
      }
      
      &:hover::after {
        opacity: 1;
      }
      
      i {
        margin-right: 6px;
      }
    }
    
    .el-button[type="warning"] {
      background: linear-gradient(135deg, #ffa940, #fa541c);
      border-color: #fa541c;
      
      &:hover {
        background: linear-gradient(135deg, #ff9c2f, #e94b17);
        border-color: #e94b17;
      }
    }
    
    .el-button {
      &:not([type="danger"]):not([type="warning"]):not([type="primary"]) {
        background: linear-gradient(135deg, #36cfc9, #14a9a0);
        color: white;
        border-color: #14a9a0;
        
        &:hover {
          background: linear-gradient(135deg, #2bc0ba, #11a098);
          border-color: #11a098;
        }
      }
    }
    
    .el-button[type="danger"] {
      background: linear-gradient(135deg, #ff7875, #f5222d);
      border-color: #f5222d;
      
      &:hover {
        background: linear-gradient(135deg, #ff5c59, #e01d28);
        border-color: #e01d28;
      }
    }
  }
}

.security-item-info {
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
}

.security-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 50%;
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
  }
  
  &.password {
    background: linear-gradient(135deg, #ffa940, #fa541c);
    color: white;
  }
  
  &.phone {
    background: linear-gradient(135deg, #36cfc9, #14a9a0);
    color: white;
  }
  
  &.danger {
    background: linear-gradient(135deg, #ff7875, #f5222d);
    color: white;
  }
}

.security-item-content {
  flex: 1;
}

.security-item-title {
  font-weight: 500;
  margin-bottom: 5px;
  font-size: 15px;
}

.security-item-desc {
  color: @text-secondary;
  font-size: 12px;
}

// 对话框样式
:deep(.custom-dialog) {
  border-radius: 12px;
  overflow: hidden;
  
  .el-dialog__header {
    padding: 16px;
    margin-right: 0;
    border-bottom: 1px solid #f0f0f0;
    background: linear-gradient(to right, rgba(24, 144, 255, 0.03), rgba(255, 255, 255, 0.01));
    
    .el-dialog__title {
      font-size: 16px;
      font-weight: 600;
    }
  }
  
  .el-dialog__body {
    padding: 0 20px 20px;
  }
  
  .el-dialog__footer {
    border-top: 1px solid #f0f0f0;
    padding: 12px 20px;
    
    .dialog-footer {
      display: flex;
      gap: 12px;
      justify-content: flex-end;
      
      .el-button {
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        border-radius: 8px;
        position: relative;
        overflow: hidden;
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.08);
        }
        
        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
          opacity: 0;
          transition: opacity 0.3s;
        }
        
        &:hover::after {
          opacity: 1;
        }
      }
      
      .el-button[type="primary"] {
        background: linear-gradient(135deg, #1890ff, #096dd9);
        border-color: #096dd9;
        font-weight: 500;
        
        &:hover {
          background: linear-gradient(135deg, #40a9ff, #1890ff);
          border-color: #1890ff;
        }
      }
      
      .el-button[type="danger"] {
        background: linear-gradient(135deg, #ff7875, #f5222d);
        border-color: #f5222d;
        font-weight: 500;
        
        &:hover {
          background: linear-gradient(135deg, #ff5c59, #e01d28);
          border-color: #e01d28;
        }
      }
    }
  }
}

.dialog-icon-header {
  display: flex;
  justify-content: center;
  padding: 24px 0 16px;
  
  .dialog-icon {
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1890ff, #096dd9);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    box-shadow: 0 6px 16px rgba(24, 144, 255, 0.2);
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 50%;
      background: linear-gradient(to bottom, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0));
      border-radius: 50% 50% 0 0;
    }
  }
  
  &.danger {
    .dialog-icon {
      background: linear-gradient(135deg, #ff7875, #f5222d);
      box-shadow: 0 6px 16px rgba(245, 34, 45, 0.2);
    }
  }
}

// 注销账号警告
.delete-account-warning {
  padding: 16px 0;
  
  .warning-text {
    .warning-title {
      font-weight: 600;
      color: @danger-color;
      margin-top: 0;
      margin-bottom: 10px;
      font-size: 15px;
    }
    
    p {
      margin: 8px 0;
    }
    
    ul {
      padding-left: 0;
      list-style: none;
      margin: 10px 0;
      
      li {
        margin-bottom: 6px;
        display: flex;
        align-items: flex-start;
        
        i {
          color: @danger-color;
          margin-right: 8px;
          flex-shrink: 0;
          margin-top: 3px;
        }
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .security-item {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .security-item-action {
    margin-top: 14px;
    align-self: flex-end;
  }
}
</style> 