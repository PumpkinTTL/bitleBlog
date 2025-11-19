<template>
  <div class="reset-password-page">
    <div class="page-wrapper">
      <!-- 左侧装饰 -->
      <div class="left-decoration">
        <div class="decoration-content">
          <div class="brand-header">
            <div class="header-box">
              <div class="brand-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/>
                </svg>
              </div>
              <div class="header-text">
                <h2>重置密码</h2>
                <p class="desc">通过邮箱验证链接安全重置密码</p>
              </div>
            </div>
          </div>
          
          <div class="info-section">
            <div class="email-card">
              <div class="email-info-wrapper">
                <div class="email-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/>
                  </svg>
                </div>
                <div class="email-text">
                  <span class="email-label">绑定邮箱</span>
                  <span class="email-value">{{ maskedEmail }}</span>
                </div>
              </div>
            </div>
            
            <div class="tips-list">
              <div class="tip-item">
                <div class="tip-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/>
                  </svg>
                </div>
                <span>10分钟内有效</span>
              </div>
              <div class="tip-item">
                <div class="tip-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
                  </svg>
                </div>
                <span>密码加密存储</span>
              </div>
              <div class="tip-item">
                <div class="tip-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                </div>
                <span>仅可使用一次</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 右侧表单 -->
      <div class="page-container">
      <!-- 头部 -->
      <div class="header">
        <div class="header-badge">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
          </svg>
          <span>重置密码</span>
        </div>
        <p class="desc">请输入新密码完成重置</p>
      </div>

      <!-- 表单 -->
      <form @submit.prevent="handleSubmit" class="form">
        <div class="field">
          <label>新密码</label>
          <div class="input-group">
            <input
              v-model="formData.password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="请输入新密码（至少6位）"
              @input="errors.password = ''"
            />
            <button type="button" class="toggle" @click="showPassword = !showPassword">
              <svg v-if="showPassword" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.password" class="error">{{ errors.password }}</span>
        </div>

        <div class="field">
          <label>确认密码</label>
          <div class="input-group">
            <input
              v-model="formData.confirmPassword"
              :type="showConfirmPassword ? 'text' : 'password'"
              placeholder="请再次输入新密码"
              @input="errors.confirmPassword = ''"
            />
            <button type="button" class="toggle" @click="showConfirmPassword = !showConfirmPassword">
              <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/>
              </svg>
            </button>
          </div>
          <span v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
        </div>

        <div class="tip">
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
          </svg>
          <span>密码至少6位，建议包含字母和数字组合</span>
        </div>

        <button type="submit" class="submit" :disabled="loading">
          <span v-if="!loading">确认重置</span>
          <span v-else class="loading">
            <svg class="spinner" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" fill="none" stroke-linecap="round"/>
            </svg>
            处理中...
          </span>
        </button>

        <div class="footer">
          <a @click.prevent="goToHome" href="#">← 返回首页</a>
        </div>
      </form>
    </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { resetPassword } from '@/api/passwordReset';

const route = useRoute();
const router = useRouter();

const token = ref<string>('');
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const userEmail = ref<string>('');

// 脱敏邮箱
const maskedEmail = computed(() => {
  if (!userEmail.value) return '***@***';
  const [username, domain] = userEmail.value.split('@');
  if (!username || !domain) return '***@***';
  
  if (username.length <= 2) {
    return `${username[0]}***@${domain}`;
  }
  return `${username.slice(0, 2)}***${username.slice(-1)}@${domain}`;
});

const formData = reactive({
  password: '',
  confirmPassword: ''
});

const errors = reactive({
  password: '',
  confirmPassword: ''
});

const validateForm = (): boolean => {
  errors.password = '';
  errors.confirmPassword = '';
  
  if (!formData.password) {
    errors.password = '请输入新密码';
    return false;
  }
  
  if (formData.password.length < 6) {
    errors.password = '密码长度最少6位';
    return false;
  }
  
  if (!formData.confirmPassword) {
    errors.confirmPassword = '请再次输入密码';
    return false;
  }
  
  if (formData.password !== formData.confirmPassword) {
    errors.confirmPassword = '两次输入的密码不一致';
    return false;
  }
  
  return true;
};

const showMessage = (message: string, type: 'success' | 'error' = 'success') => {
  const div = document.createElement('div');
  div.className = `toast toast-${type}`;
  div.textContent = message;
  document.body.appendChild(div);
  
  setTimeout(() => div.classList.add('show'), 10);
  setTimeout(() => {
    div.classList.remove('show');
    setTimeout(() => div.remove(), 300);
  }, 3000);
};

const handleSubmit = async () => {
  if (!validateForm()) return;
  
  if (!token.value) {
    showMessage('链接无效', 'error');
    return;
  }

  loading.value = true;
  try {
    const response = await resetPassword({
      token: token.value,
      new_password: formData.password
    });

    if (response.code === 200) {
      showMessage('密码重置成功，请使用新密码登录');
      setTimeout(() => router.push('/login'), 1500);
    } else if (response.code === 400) {
      showMessage('链接已过期，请重新申请', 'error');
    } else {
      showMessage(response.msg || '重置失败，请稍后重试', 'error');
    }
  } catch (error: any) {
    if (error.response?.data?.code === 400) {
      showMessage('链接已过期，请重新申请', 'error');
    } else if (error.response?.data?.code === 404) {
      showMessage('用户不存在', 'error');
    } else {
      showMessage(error.response?.data?.msg || '重置失败，请稍后重试', 'error');
    }
  } finally {
    loading.value = false;
  }
};

const goToHome = () => router.push('/index');

onMounted(() => {
  const tokenParam = route.query.token as string;
  const emailParam = route.query.email as string;
  
  if (tokenParam) {
    token.value = tokenParam;
  }
  
  if (emailParam) {
    userEmail.value = decodeURIComponent(emailParam);
  }
});
</script>

<style scoped>
.reset-password-page {
  min-height: calc(100vh - 70px);
  background: #f5f7fa;
  padding: 40px 20px 20px;
}

.page-wrapper {
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 340px 1fr;
  gap: 0;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 左侧区域 */
.left-decoration {
  background: white;
  padding: 32px 28px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.left-decoration::before {
  content: '';
  position: absolute;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, var(--theme-orange-bg-2) 0%, transparent 70%);
  border-radius: 50%;
  top: -100px;
  left: -80px;
  z-index: 0;
}

.left-decoration::after {
  content: '';
  position: absolute;
  width: 240px;
  height: 240px;
  background: radial-gradient(circle, var(--theme-orange-bg-1) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -80px;
  right: -60px;
  z-index: 0;
}

.decoration-content {
  display: flex;
  flex-direction: column;
  gap: 22px;
  position: relative;
  z-index: 1;
}

.brand-header {
  margin-bottom: 0;
}

.header-box {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  background: var(--theme-orange-bg-1);
  border-radius: 8px;
  border: 1px solid var(--theme-orange-border-2);
}

.brand-icon {
  width: 34px;
  height: 34px;
  background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.brand-icon svg {
  width: 18px;
  height: 18px;
  color: white;
}

.header-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.header-text h2 {
  font-size: 15px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
  background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.3px;
}

.header-text .desc {
  font-size: 11px;
  line-height: 1.5;
  color: #888;
  margin: 0;
  font-weight: 400;
}

.info-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.email-card {
  background: var(--theme-orange-bg-1);
  border: 1px solid var(--theme-orange-border-1);
  border-radius: 8px;
  padding: 12px;
}

.email-info-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 10px;
}

.email-icon {
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.email-icon svg {
  width: 16px;
  height: 16px;
  color: white;
}

.email-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
  padding-top: 1px;
}

.email-label {
  font-size: 10px;
  color: #999;
  font-weight: 500;
}

.email-value {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #666;
}

.tip-icon {
  width: 28px;
  height: 28px;
  background: var(--theme-orange-bg-3);
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.tip-icon svg {
  width: 16px;
  height: 16px;
  color: var(--theme-purple-primary);
}

.page-container {
  width: 100%;
  background: white;
  padding: 40px 35px;
  position: relative;
  overflow: hidden;
}

.page-container::before {
  content: '';
  position: absolute;
  width: 220px;
  height: 220px;
  background: radial-gradient(circle, var(--theme-orange-bg-1) 0%, transparent 70%);
  border-radius: 50%;
  top: -80px;
  right: -60px;
  z-index: 0;
}

.page-container::after {
  content: '';
  position: absolute;
  width: 190px;
  height: 190px;
  background: radial-gradient(circle, var(--theme-orange-bg-1) 0%, transparent 70%);
  border-radius: 50%;
  bottom: -70px;
  left: -50px;
  z-index: 0;
}

.header {
  margin-bottom: 24px;
  position: relative;
  z-index: 1;
}

.header-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 14px;
  background: linear-gradient(135deg, var(--theme-orange-bg-3), var(--theme-orange-bg-2));
  border: 1px solid var(--theme-orange-border-3);
  border-radius: 18px;
  margin-bottom: 10px;
}

.header-badge svg {
  width: 16px;
  height: 16px;
  color: var(--theme-purple-primary);
}

.header-badge span {
  font-size: 13px;
  font-weight: 500;
  background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.desc {
  font-size: 12px;
  color: #666;
  margin: 0;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
  position: relative;
  z-index: 1;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.field label {
  font-size: 13px;
  font-weight: 500;
  color: #333;
}

.input-group {
  position: relative;
  display: flex;
  align-items: center;
}

.input-group input {
  width: 100%;
  height: 40px;
  padding: 0 38px 0 12px;
  border: 1px solid #e0e0e0;
  border-radius: 7px;
  font-size: 13px;
  transition: all 0.2s;
  background: #fafafa;
}

.input-group input:hover {
  border-color: var(--theme-purple-primary);
  background: white;
}

.input-group input:focus {
  outline: none;
  border-color: var(--theme-purple-primary);
  box-shadow: 0 0 0 3px var(--theme-orange-overlay);
  background: white;
}

.toggle {
  position: absolute;
  right: 10px;
  width: 20px;
  height: 20px;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #999;
  transition: color 0.2s;
}

.toggle:hover {
  color: var(--theme-purple-primary);
}

.toggle svg {
  width: 100%;
  height: 100%;
}

.error {
  font-size: 12px;
  color: #f56c6c;
  margin-top: -4px;
}

.tip {
  display: flex;
  align-items: center;
  gap: 7px;
  padding: 9px 11px;
  background: var(--theme-orange-bg-2);
  border: 1px solid var(--theme-orange-border-2);
  border-radius: 7px;
  font-size: 11px;
  color: #666;
}

.tip svg {
  width: 15px;
  height: 15px;
  color: var(--theme-purple-primary);
  flex-shrink: 0;
}

.submit {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
  color: white;
  border: none;
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 8px var(--theme-orange-shadow);
  margin-top: 4px;
}

.submit:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px var(--theme-orange-glow);
}

.submit:active {
  transform: translateY(0);
}

.submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.loading {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spinner {
  width: 16px;
  height: 16px;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.footer {
  text-align: center;
  margin-top: 6px;
  padding-top: 14px;
  border-top: 1px solid #f0f0f0;
}

.footer a {
  font-size: 13px;
  color: var(--theme-purple-primary);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.footer a:hover {
  color: var(--theme-purple-secondary);
}

:global(.toast) {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  padding: 12px 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
  font-size: 14px;
  font-weight: 500;
  z-index: 9999;
  opacity: 0;
  transition: all 0.3s;
}

:global(.toast.show) {
  opacity: 1;
  transform: translateX(-50%) translateY(0);
}

:global(.toast-success) {
  color: #67c23a;
  border-left: 4px solid #67c23a;
}

:global(.toast-error) {
  color: #f56c6c;
  border-left: 4px solid #f56c6c;
}

@media (max-width: 900px) {
  .page-wrapper {
    grid-template-columns: 1fr;
    gap: 0;
    max-width: 480px;
  }
  
  .left-decoration {
    padding: 32px 28px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .page-container {
    padding: 32px 24px;
  }
  
  .header h1 {
    font-size: 20px;
  }
  
  .left-decoration {
    padding: 28px 24px;
  }
}
</style>
