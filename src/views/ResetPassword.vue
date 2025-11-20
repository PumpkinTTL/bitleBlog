<template>
  <div class="reset-password-page">
    <el-row class="page-wrapper" :gutter="0">
      <!-- 左侧装饰 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="10" :xl="8" class="left-decoration">
        <div class="decoration-content">
          <div class="brand-header">
            <div class="header-box">
              <div class="brand-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
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
                    <path
                      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                  </svg>
                </div>
                <div class="email-text">
                  <div class="email-label">重置邮箱</div>
                  <div class="email-value">{{ userEmail }}</div>
                </div>
              </div>
              <div class="user-info-wrapper" v-if="username">
                <div class="user-icon">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                  </svg>
                </div>
                <div class="user-text">
                  <div class="user-label">用户名</div>
                  <div class="user-value">{{ username }}</div>
                </div>
              </div>
            </div>

            <div class="security-tips">
              <div class="tips-header">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
                </svg>
                <span>安全提示</span>
              </div>
              <div class="tips-list">
                <div class="tip-item">
                  <div class="tip-icon clock">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z" />
                    </svg>
                  </div>
                  <span>10分钟内有效</span>
                </div>
                <div class="tip-item">
                  <div class="tip-icon lock">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
                    </svg>
                  </div>
                  <span>密码加密存储</span>
                </div>
                <div class="tip-item">
                  <div class="tip-icon check">
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                    </svg>
                  </div>
                  <span>仅可使用一次</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧内容 -->
      <el-col :xs="24" :sm="24" :md="12" :lg="14" :xl="16" class="right-content">
        <div class="page-container">

        <!-- 测试按钮 - 开发时使用 -->
        <div class="test-buttons">
          <div class="test-title">🔧 状态测试</div>
          <div class="test-btn-group">
            <button @click="pageState = 'loading'" class="test-btn" :class="{ active: pageState === 'loading' }">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="2" fill="none" opacity="0.25" />
                <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" />
              </svg>
              Loading
            </button>
            <button @click="pageState = 'form'" class="test-btn" :class="{ active: pageState === 'form' }">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2z" />
              </svg>
              Form
            </button>
            <button @click="pageState = 'success'" class="test-btn" :class="{ active: pageState === 'success' }">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              Success
            </button>
            <button @click="pageState = 'error'" class="test-btn" :class="{ active: pageState === 'error' }">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 7 9.5 10.5 12 7 14.5 8.5 16 12 13.5 15.5 16 17 14.5 13.5 12 17 9.5 15.5 8z" />
              </svg>
              Error
            </button>
            <button @click="pageState = 'invalid'" class="test-btn" :class="{ active: pageState === 'invalid' }">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              Invalid
            </button>
          </div>
        </div>

        <!-- Loading 状态 -->
        <div v-if="pageState === 'loading'" class="state-content loading-state">
          <div class="header">
            <div class="header-badge loading-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
              </svg>
              <span>验证中</span>
            </div>
            <p class="desc">正在验证重置链接...</p>
          </div>
          <div class="loading-content">
            <div class="loading-text">正在验证重置链接的有效性，请稍候...</div>
            <button class="loading-btn" disabled>
              <span class="loading">
                <svg class="spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" fill="none"
                    stroke-linecap="round" />
                </svg>
                验证中...
              </span>
            </button>
          </div>
        </div>

        <!-- 表单状态 -->
        <div v-else-if="pageState === 'form'" class="state-content form-state">
          <div class="header">
            <div class="header-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
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
                <input v-model="formData.password" :type="showPassword ? 'text' : 'password'" placeholder="请输入新密码（至少6位）"
                  @input="errors.password = ''" />
                <button type="button" class="toggle" @click="showPassword = !showPassword">
                  <svg v-if="showPassword" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                  </svg>
                </button>
              </div>
              <span v-if="errors.password" class="error">{{ errors.password }}</span>
            </div>

            <div class="field">
              <label>确认密码</label>
              <div class="input-group">
                <input v-model="formData.confirmPassword" :type="showConfirmPassword ? 'text' : 'password'"
                  placeholder="请再次输入新密码" @input="errors.confirmPassword = ''" />
                <button type="button" class="toggle" @click="showConfirmPassword = !showConfirmPassword">
                  <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
                  </svg>
                  <svg v-else viewBox="0 0 24 24" fill="currentColor">
                    <path
                      d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z" />
                  </svg>
                </button>
              </div>
              <span v-if="errors.confirmPassword" class="error">{{ errors.confirmPassword }}</span>
            </div>

            <div class="tip">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>密码至少6位，建议包含字母和数字组合</span>
            </div>

            <button type="submit" class="submit" :disabled="loading">
              <span v-if="!loading" style="display: flex; align-items: center; gap: 8px;">
                <svg viewBox="0 0 24 24" fill="currentColor" style="width: 18px; height: 18px;">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                确认重置
              </span>
              <span v-else class="loading">
                <svg class="spinner" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" opacity="0.25" />
                  <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" stroke-width="3" fill="none"
                    stroke-linecap="round" />
                </svg>
                处理中...
              </span>
            </button>

            <div class="footer">
              <a @click.prevent="goToHome" href="#">← 返回首页</a>
            </div>
          </form>
        </div>

        <!-- 成功状态 -->
        <div v-else-if="pageState === 'success'" class="state-content success-state">
          <div class="header animate__animated animate__fadeIn animate__faster">
            <div class="header-badge success-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
              </svg>
              <span>重置成功</span>
            </div>
            <p class="desc">您的密码已成功重置</p>
          </div>
          <div class="success-content animate__animated animate__fadeInUp animate__fast">
            <div class="success-main">
              <div class="success-icon animate__animated animate__zoomIn animate__faster">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                </svg>
              </div>
              <div class="success-text">
                <h3 class="animate__animated animate__fadeInRight animate__faster">密码重置成功！</h3>
                <p class="animate__animated animate__fadeInRight animate__fast" style="animation-delay: 0.1s;">您的密码已成功重置，现在可以使用新密码登录了</p>
              </div>
            </div>
            <div class="success-actions">
              <button class="action-btn-base success-btn" @click="goToHome">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                返回首页
              </button>
            </div>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="pageState === 'error'" class="state-content error-state">
          <div class="header animate__animated animate__fadeIn animate__faster">
            <div class="header-badge error-badge animate__animated animate__shakeX">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.47 2 2 6.47 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 12 2zm3.5 6L12 10.5 8.5 8 7 9.5 10.5 12 7 14.5 8.5 16 12 13.5 15.5 16 17 14.5 13.5 12 17 9.5 15.5 8z" />
              </svg>
              <span>重置失败</span>
            </div>
            <p class="desc">密码重置过程中出现错误</p>
          </div>
          <div class="error-content animate__animated animate__fadeInUp animate__fast">
            <div class="error-main">
              <div class="error-icon animate__animated animate__zoomIn animate__faster">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="15" y1="9" x2="9" y2="15"/>
                  <line x1="9" y1="9" x2="15" y2="15"/>
                </svg>
              </div>
              <div class="error-text">
                <h3 class="animate__animated animate__fadeInRight animate__faster">重置失败</h3>
                <p class="animate__animated animate__fadeInRight animate__fast" style="animation-delay: 0.1s;">{{ errorMessage || '密码重置失败，请稍后重试' }}</p>
              </div>
            </div>
            <div class="error-actions">
              <button class="action-btn-base retry-btn" @click="pageState = 'form'">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                </svg>
                重试
              </button>
              <button class="action-btn-base home-btn" @click="goToHome">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                返回首页
              </button>
            </div>
          </div>
        </div>

        <!-- Token无效状态 -->
        <div v-else-if="pageState === 'invalid'" class="state-content invalid-state">
          <div class="header animate__animated animate__fadeIn animate__faster">
            <div class="header-badge invalid-badge">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span>链接无效</span>
            </div>
            <p class="desc">重置链接已失效或不存在</p>
          </div>
          <div class="invalid-content animate__animated animate__fadeInUp animate__fast">
            <div class="invalid-main">
              <div class="invalid-icon animate__animated animate__zoomIn animate__faster">
                <svg viewBox="0 0 24 24" fill="currentColor" class="animate__animated animate__pulse animate__infinite animate__slow">
                  <path
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
              </div>
              <div class="invalid-text">
                <h3 class="animate__animated animate__fadeInRight animate__faster">重置链接无效</h3>
                <p class="invalid-message animate__animated animate__fadeInRight animate__fast" style="animation-delay: 0.1s;">{{ errorMessage || '该链接可能已过期或不存在，请重新申请密码重置' }}</p>
              </div>
            </div>
            <button class="home-btn-full" @click="goToHome">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
              </svg>
              返回首页
            </button>
          </div>
        </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { verifyResetTokenR, resetPasswordR } from '@/request/user';

const route = useRoute();
const router = useRouter();

// 页面状态管理
type PageState = 'loading' | 'form' | 'success' | 'error' | 'invalid';
const pageState = ref<PageState>('loading');
const errorMessage = ref<string>('');

const token = ref<string>('');
const loading = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const userEmail = ref<string>('');
const username = ref<string>('');

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
    const response = await resetPasswordR({
      token: token.value,
      new_password: formData.password
    });

    if (response.code === 200) {
      pageState.value = 'success';
      showMessage('密码重置成功，请使用新密码登录', 'success');
    } else {
      pageState.value = 'error';
      errorMessage.value = response.info || response.msg || '重置失败，请稍后重试';
    }
  } catch (error: any) {
    if (error.response?.data?.code === 400) {
      pageState.value = 'invalid';
      errorMessage.value = error.response.data.info || error.response.data.msg || '令牌已过期，请重新申请';
    } else {
      pageState.value = 'error';
      errorMessage.value = error.response?.data?.info || error.response?.data?.msg || '重置失败，请稍后重试';
    }
  } finally {
    loading.value = false;
  }
};

const goToHome = () => router.push('/index');

// Token验证函数
const validateToken = async () => {
  // 设置loading状态
  pageState.value = 'loading';
  
  if (!token.value) {
    pageState.value = 'invalid';
    errorMessage.value = '重置链接无效';
    return;
  }

  try {
    const response = await verifyResetTokenR({
      token: token.value
    });
    
    if (response.code === 200) {
      // Token有效，显示表单
      pageState.value = 'form';
      userEmail.value = response.data.email;
      username.value = response.data.username;
    } else {
      // Token无效
      pageState.value = 'invalid';
      errorMessage.value = response.info || response.msg || '令牌无效';
    }
  } catch (error: any) {
    if (error.response?.data?.code === 400) {
      pageState.value = 'invalid';
      errorMessage.value = error.response.data.info || error.response.data.msg || '令牌已过期，请重新申请';
    } else if (error.response?.data?.code === 404) {
      pageState.value = 'invalid';
      errorMessage.value = error.response.data.info || '用户不存在';
    } else {
      pageState.value = 'error';
      errorMessage.value = error.response?.data?.info || error.response?.data?.msg || '网络错误，请稍后重试';
    }
  }
};

onMounted(async () => {
  const tokenParam = route.query.token as string;
  
  if (tokenParam) {
    token.value = tokenParam;
    // 验证token
    await validateToken();
  } else {
    // 没有token参数，直接显示无效状态
    pageState.value = 'invalid';
    errorMessage.value = '重置链接无效或已过期';
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
  max-width: 1200px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* 左侧区域 */
.left-decoration {
  background: white;
  padding: 32px 28px;
  display: block;
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

.user-info-wrapper {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid var(--theme-orange-border-1);
}

.user-icon {
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-purple-primary);
  flex-shrink: 0;
}

.user-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-label {
  font-size: 10px;
  color: #999;
  font-weight: 500;
}

.user-value {
  font-size: 13px;
  font-weight: 600;
  color: #333;
  font-family: 'Courier New', monospace;
  letter-spacing: 0.3px;
}

/* 安全提示区域 */
.security-tips {
  background: var(--theme-orange-bg-1);
  border: 1px solid var(--theme-orange-border-1);
  border-radius: 12px;
  padding: 16px;
  margin-top: 16px;
}

.security-tips .tips-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--theme-orange-border-2);
}

.security-tips .tips-header svg {
  width: 18px;
  height: 18px;
  color: var(--theme-purple-primary);
  flex-shrink: 0;
}

.security-tips .tips-header span {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.tips-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tip-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #666;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.tip-item:hover {
  background: var(--theme-orange-bg-2);
  transform: translateX(2px);
}

.tip-icon {
  width: 30px;
  height: 30px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.tip-icon.clock {
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
}

.tip-icon.lock {
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
}

.tip-icon.check {
  background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
}

.tip-icon svg {
  width: 16px;
  height: 16px;
}

.tip-icon.clock svg {
  color: #f59e0b;
}

.tip-icon.lock svg {
  color: #3b82f6;
}

.tip-icon.check svg {
  color: #10b981;
}

.page-container {
  width: 100%;
  background: white;
  padding: 32px 28px;
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

/* 状态内容通用样式 */
.state-content {
  position: relative;
  z-index: 1;
}

/* Loading 状态样式 */
.loading-badge {
  background: linear-gradient(135deg, var(--theme-orange-bg-3), var(--theme-orange-bg-2)) !important;
  border: 1px solid var(--theme-orange-border-3) !important;
}

.loading-badge svg {
  color: var(--theme-purple-primary) !important;
}

.loading-badge span {
  color: var(--theme-purple-primary) !important;
  background: none !important;
  -webkit-background-clip: unset !important;
  -webkit-text-fill-color: unset !important;
  background-clip: unset !important;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  padding: 40px 20px;
  text-align: center;
}

.loading-text {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 8px;
}

.loading-btn {
  width: 100%;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  background: var(--theme-orange-bg-1);
  color: var(--theme-purple-primary);
  border: 1px solid var(--theme-orange-border-2);
  border-radius: 7px;
  font-size: 13px;
  font-weight: 500;
  cursor: not-allowed;
  opacity: 0.8;
  transition: all 0.2s;
}

/* 成功状态样式 */
.success-badge {
  background: linear-gradient(135deg, #10b981, #059669) !important;
  border: none !important;
}

.success-badge svg {
  color: white !important;
}

.success-badge span {
  color: white !important;
  background: white !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.success-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 20px;
}

.success-main {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  text-align: left;
  padding: 28px;
  background: linear-gradient(135deg, #f0fdf9 0%, #e8faf1 100%);
  border-radius: 16px;
  border: 1px solid #d1f4e0;
  position: relative;
  overflow: hidden;
}

.success-main::before {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(16, 185, 129, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.success-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #10b981, #059669);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
  position: relative;
  animation: successPulse 2.5s ease-in-out infinite;
}

.success-icon::after {
  content: '';
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 2px solid #10b981;
  animation: ripple 3s ease-out infinite;
}

.success-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.success-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.success-text h3 {
  font-size: 20px;
  font-weight: 700;
  color: #065f46;
  margin: 0;
  line-height: 1.3;
}

.success-text p {
  font-size: 14px;
  color: #047857;
  margin: 0;
  line-height: 1.6;
}

.success-actions {
  display: flex;
  justify-content: center;
}

.success-btn {
  background: linear-gradient(135deg, #10b981, #059669);
  color: white;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.success-btn:hover {
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.4);
}

/* 通用按钮基础样式 */
.action-btn-base {
  width: 100%;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.action-btn-base svg {
  width: 18px;
  height: 18px;
  z-index: 1;
}

.action-btn-base::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  transform: translate(-50%, -50%);
  transition: width 0.6s, height 0.6s;
}

.action-btn-base:hover::before {
  width: 300px;
  height: 300px;
}

.action-btn-base:hover {
  transform: translateY(-2px);
}

.action-btn-base:active {
  transform: translateY(0);
}

/* 错误状态样式 */
.error-badge {
  background: linear-gradient(135deg, #ef4444, #dc2626) !important;
  border: none !important;
}

.error-badge svg {
  color: white !important;
}

.error-badge span {
  color: white !important;
  background: white !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.error-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding: 20px;
}

.error-main {
  display: flex;
  align-items: flex-start;
  gap: 20px;
  text-align: left;
  padding: 28px;
  background: linear-gradient(135deg, #fef8f8 0%, #fef0f0 100%);
  border-radius: 16px;
  border: 1px solid #fcd5d5;
  position: relative;
  overflow: hidden;
}

.error-main::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(239, 68, 68, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite reverse;
}

.error-icon {
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #ef4444, #dc2626);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
  animation: errorPulse 2.5s ease-in-out infinite;
}

.error-icon svg {
  width: 32px;
  height: 32px;
  color: white;
}

.error-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.error-text h3 {
  font-size: 20px;
  font-weight: 700;
  color: #dc2626;
  margin: 0;
  line-height: 1.3;
}

.error-text p {
  font-size: 14px;
  color: #b91c1c;
  margin: 0;
  line-height: 1.6;
}

.error-actions {
  display: flex;
  gap: 12px;
  width: 100%;
}

.retry-btn {
  background: linear-gradient(135deg, #ef4444, #dc2626);
  color: white;
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.3);
}

.retry-btn:hover {
  box-shadow: 0 6px 20px rgba(239, 68, 68, 0.4);
}

.home-btn {
  background: white;
  color: #6b7280;
  border: 2px solid #e5e7eb;
}

.home-btn:hover {
  background: #f9fafb;
  border-color: #d1d5db;
  color: #374151;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Token无效状态样式 */
.invalid-badge {
  background: linear-gradient(135deg, #f59e0b, #d97706) !important;
  border: none !important;
}

.invalid-badge svg {
  color: white !important;
}

.invalid-badge span {
  color: white !important;
  background: white !important;
  -webkit-background-clip: text !important;
  -webkit-text-fill-color: transparent !important;
  background-clip: text !important;
}

.invalid-content {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.invalid-main {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  text-align: left;
  padding: 20px;
  background: linear-gradient(135deg, #fffcf5 0%, #fef8e8 100%);
  border-radius: 12px;
  border: 1px solid #fce9b8;
  position: relative;
  overflow: hidden;
}

.invalid-main::before {
  content: '';
  position: absolute;
  bottom: -50%;
  right: -50%;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle, rgba(245, 158, 11, 0.15) 0%, transparent 70%);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

.invalid-icon {
  width: 52px;
  height: 52px;
  background: linear-gradient(135deg, #f59e0b, #d97706);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 20px rgba(245, 158, 11, 0.3);
}

.invalid-icon svg {
  width: 26px;
  height: 26px;
  color: white;
}

.invalid-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.invalid-text h3 {
  font-size: 18px;
  font-weight: 700;
  color: #92400e;
  margin: 0;
  line-height: 1.3;
}

.invalid-message {
  font-size: 13px;
  color: #a16207;
  margin: 0;
  line-height: 1.5;
}

.home-btn-full {
  width: 100%;
  height: 42px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 3px 10px var(--theme-orange-shadow);
  margin-top: 16px;
}

.home-btn-full:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 16px var(--theme-orange-glow);
}

.home-btn-full:active {
  transform: translateY(0);
}

.home-btn-full svg {
  width: 18px;
  height: 18px;
}

/* 自定义动画 */

/* 成功状态脉动效果 */
@keyframes successPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 20px rgba(16, 185, 129, 0.3);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 6px 24px rgba(16, 185, 129, 0.4);
  }
}

/* 错误状态脉动效果 */
@keyframes errorPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 4px 20px rgba(239, 68, 68, 0.3);
  }
  50% {
    transform: scale(1.03);
    box-shadow: 0 6px 24px rgba(239, 68, 68, 0.4);
  }
}

/* 波纹扩散效果 */
@keyframes ripple {
  0% {
    transform: scale(1);
    opacity: 0.6;
  }
  100% {
    transform: scale(1.8);
    opacity: 0;
  }
}

/* 背景浮动装饰 */
@keyframes float {
  0%, 100% {
    transform: translate(0, 0) rotate(0deg);
  }
  33% {
    transform: translate(30px, -30px) rotate(120deg);
  }
  66% {
    transform: translate(-20px, 20px) rotate(240deg);
  }
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

/* 栅格系统样式 */

.right-content {
  background: #f8fafc;
}

/* 移动端优化 */
@media (max-width: 768px) {
  .reset-password-page {
    padding: 16px;
    min-height: 100vh;
  }
  
  .page-wrapper {
    border-radius: 8px;
    max-width: 100%;
  }
  
  /* 移动端左侧装饰区域调整 */
  .left-decoration {
    padding: 20px 16px;
  }
  
  .left-decoration::before,
  .left-decoration::after {
    display: none;
  }
  
  .decoration-content {
    gap: 16px;
  }
  
  .brand-header {
    margin-bottom: 0;
  }
  
  .header-box {
    padding: 10px 12px;
  }
  
  .brand-icon {
    width: 30px;
    height: 30px;
  }
  
  .brand-icon svg {
    width: 16px;
    height: 16px;
  }
  
  .header-text h2 {
    font-size: 14px;
  }
  
  .header-text .desc {
    font-size: 11px;
  }
  
  .email-card {
    padding: 10px;
  }
  
  .email-icon {
    width: 28px;
    height: 28px;
  }
  
  .email-icon svg {
    width: 14px;
    height: 14px;
  }
  
  .email-label,
  .user-label {
    font-size: 10px;
  }
  
  .email-value,
  .user-value {
    font-size: 12px;
  }
  
  .user-info-wrapper {
    margin-top: 10px;
    padding-top: 10px;
  }
  
  .user-icon {
    width: 18px;
    height: 18px;
  }
  
  .user-icon svg {
    width: 18px;
    height: 18px;
  }
  
  .security-tips {
    padding: 12px;
    margin-top: 12px;
  }
  
  .security-tips .tips-header {
    margin-bottom: 10px;
    padding-bottom: 10px;
  }
  
  .security-tips .tips-header svg {
    width: 16px;
    height: 16px;
  }
  
  .security-tips .tips-header span {
    font-size: 12px;
  }
  
  .tips-list {
    gap: 8px;
  }
  
  .tip-item {
    padding: 5px;
    font-size: 11px;
  }
  
  .tip-icon {
    width: 26px;
    height: 26px;
  }
  
  .tip-icon svg {
    width: 14px;
    height: 14px;
  }
  
  .right-content {
    padding: 24px 16px;
  }
  
  .page-container {
    padding: 0;
    background: transparent;
  }
  
  .page-container::before,
  .page-container::after {
    display: none;
  }
  
  /* 头部样式 */
  .header {
    margin-bottom: 20px;
  }
  
  .header-badge {
    padding: 8px 14px;
    font-size: 12px;
    gap: 6px;
    margin-bottom: 8px;
  }
  
  .header-badge svg {
    width: 16px;
    height: 16px;
  }
  
  .header-badge span {
    font-size: 13px;
  }
  
  .desc {
    font-size: 13px;
  }
  
  /* 表单样式 */
  .form {
    gap: 16px;
  }
  
  .field {
    gap: 8px;
  }
  
  .field label {
    font-size: 13px;
  }
  
  .input-group input {
    height: 44px;
    font-size: 14px;
    padding: 0 40px 0 14px;
  }
  
  .toggle {
    right: 12px;
    width: 22px;
    height: 22px;
  }
  
  .tip {
    padding: 10px 12px;
    font-size: 12px;
    gap: 8px;
  }
  
  .tip svg {
    width: 16px;
    height: 16px;
  }
  
  .submit {
    height: 44px;
    font-size: 14px;
    margin-top: 8px;
  }
  
  .footer {
    margin-top: 12px;
    padding-top: 12px;
  }
  
  .footer a {
    font-size: 13px;
  }
  
  /* 状态内容样式 */
  .state-content {
    padding: 0;
  }
  
  /* Loading状态 */
  .loading-content {
    padding: 32px 16px;
    gap: 20px;
  }
  
  .loading-text {
    font-size: 14px;
  }
  
  .loading-btn {
    height: 44px;
    font-size: 13px;
  }
  
  /* Success状态 */
  .success-content {
    gap: 24px;
    padding: 16px;
  }
  
  .success-main {
    padding: 20px;
    gap: 16px;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .success-icon {
    width: 56px;
    height: 56px;
  }
  
  .success-icon svg {
    width: 28px;
    height: 28px;
  }
  
  .success-text {
    align-items: center;
  }
  
  .success-text h3 {
    font-size: 18px;
  }
  
  .success-text p {
    font-size: 14px;
  }
  
  .success-btn {
    padding: 12px 24px;
    height: 44px;
    font-size: 14px;
    width: 100%;
    max-width: 280px;
  }
  
  /* Error状态 */
  .error-content {
    gap: 24px;
    padding: 16px;
  }
  
  .error-main {
    padding: 20px;
    gap: 16px;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .error-icon {
    width: 56px;
    height: 56px;
  }
  
  .error-icon svg {
    width: 28px;
    height: 28px;
  }
  
  .error-text {
    align-items: center;
  }
  
  .error-text h3 {
    font-size: 18px;
  }
  
  .error-text p {
    font-size: 14px;
  }
  
  .error-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .retry-btn,
  .home-btn {
    width: 100%;
    height: 44px;
    font-size: 14px;
  }
  
  /* Invalid状态 */
  .invalid-content {
    gap: 20px;
    padding: 16px;
  }
  
  .invalid-main {
    padding: 20px;
    gap: 16px;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }
  
  .invalid-icon {
    width: 56px;
    height: 56px;
  }
  
  .invalid-icon svg {
    width: 28px;
    height: 28px;
  }
  
  .invalid-text {
    align-items: center;
  }
  
  .invalid-text h3 {
    font-size: 18px;
  }
  
  .invalid-message {
    font-size: 14px;
  }
  
  /* 温馨提示 */
  .invalid-tips {
    padding: 16px;
  }
  
  .tips-header {
    margin-bottom: 14px;
    padding-bottom: 10px;
  }
  
  .tips-header span {
    font-size: 13px;
  }
  
  .tips-header svg {
    width: 16px;
    height: 16px;
  }
  
  .tips-list {
    gap: 12px;
  }
  
  .invalid-tips .tip-item {
    font-size: 13px;
    gap: 10px;
  }
  
  .invalid-tips .tip-item svg {
    width: 16px;
    height: 16px;
  }
  
  /* 按钮区域 */
  .invalid-actions {
    flex-direction: column;
    gap: 10px;
  }
  
  .request-btn,
  .invalid-actions .home-btn {
    height: 44px;
    font-size: 14px;
  }
}

/* 更小屏幕优化 */
@media (max-width: 480px) {
  .reset-password-page {
    padding: 12px;
  }
  
  .page-wrapper {
    border-radius: 6px;
  }
  
  .right-content {
    padding: 20px 12px;
  }
  
  .header-badge {
    padding: 6px 12px;
    font-size: 11px;
  }
  
  .header-badge svg {
    width: 14px;
    height: 14px;
  }
  
  .header-badge span {
    font-size: 12px;
  }
  
  .desc {
    font-size: 12px;
  }
  
  .input-group input {
    height: 42px;
    font-size: 13px;
    padding: 0 38px 0 12px;
  }
  
  .toggle {
    right: 10px;
    width: 20px;
    height: 20px;
  }
  
  .submit {
    height: 42px;
    font-size: 13px;
  }
  
  .success-main,
  .error-main,
  .invalid-main {
    padding: 16px;
    gap: 12px;
  }
  
  .success-icon,
  .error-icon,
  .invalid-icon {
    width: 48px;
    height: 48px;
  }
  
  .success-icon svg,
  .error-icon svg,
  .invalid-icon svg {
    width: 24px;
    height: 24px;
  }
  
  .success-text h3,
  .error-text h3,
  .invalid-text h3 {
    font-size: 16px;
  }
  
  .success-text p,
  .error-text p,
  .invalid-message {
    font-size: 13px;
  }
  
  .success-btn,
  .retry-btn,
  .home-btn,
  .request-btn {
    width: 100%;
    height: 42px;
    font-size: 13px;
  }
}

/* 按钮loading动画 */
.spinner {
  animation: spin 1s linear infinite;
  width: 16px;
  height: 16px;
  margin-right: 8px;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.loading {
  display: flex;
  align-items: center;
}

/* 测试按钮样式 */
.test-buttons {
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
  border: 1px solid #dee2e6;
  border-radius: 10px;
  position: relative;
  z-index: 1;
}

.test-title {
  font-size: 13px;
  font-weight: 600;
  color: #495057;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.test-btn-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.test-btn {
  flex: 1;
  min-width: 80px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 0 12px;
  background: white;
  color: #6c757d;
  border: 1.5px solid #ced4da;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.test-btn svg {
  width: 14px;
  height: 14px;
  transition: transform 0.2s ease;
}

.test-btn:hover {
  background: #f8f9fa;
  border-color: var(--theme-purple-primary);
  color: var(--theme-purple-primary);
  transform: translateY(-1px);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.test-btn:active {
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.test-btn.active {
  background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
  color: white;
  border-color: var(--theme-purple-primary);
  box-shadow: 0 2px 8px var(--theme-orange-shadow);
}

.test-btn.active svg {
  animation: bounce 0.6s ease;
}

@keyframes bounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

/* 暗色模式适配 */
html.dark {
  .reset-password-page {
    background: var(--el-bg-color-page);
  }

  .page-wrapper {
    background: var(--el-bg-color);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
  }

  /* 左侧装饰区 */
  .left-decoration {
    background: var(--el-bg-color);
    border-right: 1px solid var(--el-border-color);
  }

  .header-box {
    background: var(--el-fill-color-light);
    border-color: var(--el-border-color-lighter);
  }

  .header-text .desc {
    color: var(--el-text-color-secondary);
  }

  .email-card {
    background: var(--el-fill-color-light);
    border-color: var(--el-border-color-lighter);
  }

  .email-label,
  .user-label {
    color: var(--el-text-color-secondary);
  }

  .email-value,
  .user-value {
    color: var(--el-text-color-primary);
  }

  .user-info-wrapper {
    border-top-color: var(--el-border-color-lighter);
  }

  /* 安全提示区域 */
  .security-tips {
    background: var(--el-fill-color);
    border-color: var(--el-border-color);
  }

  .security-tips .tips-header {
    border-bottom-color: var(--el-border-color-lighter);
  }

  .security-tips .tips-header span {
    color: var(--el-text-color-primary);
  }

  .tip-item {
    color: var(--el-text-color-regular);
  }

  .tip-item:hover {
    background: var(--el-fill-color-light);
  }

  .tip-icon.clock {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.15) 100%);
  }

  .tip-icon.lock {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.15) 100%);
  }

  .tip-icon.check {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.15) 100%);
  }

  .tip-icon.clock svg {
    color: #fbbf24;
  }

  .tip-icon.lock svg {
    color: #60a5fa;
  }

  .tip-icon.check svg {
    color: #34d399;
  }

  /* 右侧内容区 */
  .right-content {
    background: var(--el-fill-color-darker);
  }

  .page-container {
    background: var(--el-bg-color);
  }

  .page-container::before,
  .page-container::after {
    opacity: 0.3;
  }

  /* 测试按钮 */
  .test-buttons {
    background: linear-gradient(135deg, var(--el-fill-color) 0%, var(--el-fill-color-light) 100%);
    border-color: var(--el-border-color);
  }

  .test-title {
    color: var(--el-text-color-primary);
  }

  .test-btn {
    background: var(--el-bg-color);
    color: var(--el-text-color-regular);
    border-color: var(--el-border-color);
  }

  .test-btn:hover {
    background: var(--el-fill-color-light);
    color: var(--theme-purple-primary);
  }

  /* 表单状态 */
  .header .desc {
    color: var(--el-text-color-secondary);
  }

  .field label {
    color: var(--el-text-color-primary);
  }

  .input-group input {
    background: var(--el-fill-color-light);
    border-color: var(--el-border-color);
    color: var(--el-text-color-primary);
  }

  .input-group input:hover {
    border-color: var(--theme-purple-primary);
    background: var(--el-bg-color);
  }

  .input-group input:focus {
    background: var(--el-bg-color);
  }

  .toggle {
    color: var(--el-text-color-secondary);
  }

  .tip {
    background: var(--el-fill-color);
    border-color: var(--el-border-color-lighter);
    color: var(--el-text-color-regular);
  }

  .footer {
    border-top-color: var(--el-border-color);
  }

  /* 成功状态 */
  .success-main {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%);
    border-color: rgba(16, 185, 129, 0.3);
  }

  .success-text h3 {
    color: #10b981;
  }

  .success-text p {
    color: #34d399;
  }

  /* 错误状态 */
  .error-main {
    background: linear-gradient(135deg, rgba(239, 68, 68, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%);
    border-color: rgba(239, 68, 68, 0.3);
  }

  .error-text h3 {
    color: #ef4444;
  }

  .error-text p {
    color: #f87171;
  }

  .home-btn {
    background: var(--el-fill-color);
    color: var(--el-text-color-regular);
    border-color: var(--el-border-color);
  }

  .home-btn:hover {
    background: var(--el-fill-color-light);
    color: var(--el-text-color-primary);
    border-color: var(--el-border-color-light);
  }

  /* Invalid状态 */
  .invalid-main {
    background: linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(245, 158, 11, 0.1) 100%);
    border-color: rgba(245, 158, 11, 0.3);
  }

  .invalid-text h3 {
    color: #f59e0b;
  }

  .invalid-message {
    color: #fbbf24;
  }

  .home-btn-full {
    background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
    box-shadow: 0 3px 10px rgba(139, 92, 246, 0.3);
  }

  .home-btn-full:hover {
    box-shadow: 0 5px 16px rgba(139, 92, 246, 0.4);
  }
}

/* 移动端测试按钮优化 */
@media (max-width: 768px) {
  .test-buttons {
    padding: 12px;
    margin-bottom: 20px;
  }
  
  .test-title {
    font-size: 12px;
    margin-bottom: 10px;
  }
  
  .test-btn-group {
    gap: 6px;
  }
  
  .test-btn {
    min-width: 70px;
    height: 32px;
    padding: 0 10px;
    font-size: 11px;
    gap: 4px;
  }
  
  .test-btn svg {
    width: 12px;
    height: 12px;
  }
}

@media (max-width: 480px) {
  .test-btn-group {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 6px;
  }
  
  .test-btn {
    min-width: unset;
    flex: unset;
  }
}

</style>
