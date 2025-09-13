<template>
  <div class="blog-newsletter">
    <div class="newsletter-content">
      <div class="newsletter-info">
        <h2 class="newsletter-title">订阅<span class="highlight">更新</span></h2>
        <p class="newsletter-desc">获取我们的最新文章、教程和技术资讯，直接发送到您的邮箱</p>
        
        <div class="newsletter-features">
          <div class="feature-item">
            <div class="feature-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="feature-text">每周精选技术文章</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="feature-text">行业前沿趋势分析</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">
              <i class="fas fa-check-circle"></i>
            </div>
            <div class="feature-text">免费电子书和资源</div>
          </div>
        </div>
      </div>
      
      <div class="newsletter-form">
        <div class="form-group">
          <input 
            type="email" 
            v-model="email" 
            class="form-input" 
            placeholder="请输入您的邮箱地址"
            :class="{ 'error': showError }"
          />
          <button 
            class="subscribe-btn" 
            @click="handleSubscribe"
            :disabled="isSubmitting"
          >
            <span v-if="!isSubmitting">订阅</span>
            <span v-else class="loading"></span>
          </button>
        </div>
        <p class="form-note" v-if="showError">请输入有效的邮箱地址</p>
        <p class="form-note privacy" v-else>我们尊重您的隐私，可以随时取消订阅</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 本地状态
const email = ref('');
const isSubmitting = ref(false);
const showError = ref(false);

const emit = defineEmits<{
  (e: 'subscribe', email: string): void;
}>();

// 验证邮箱格式
const validateEmail = (email: string): boolean => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

// 处理订阅
const handleSubscribe = () => {
  // 清除之前的错误
  showError.value = false;
  
  // 验证邮箱
  if (!email.value || !validateEmail(email.value)) {
    showError.value = true;
    return;
  }
  
  // 显示加载状态
  isSubmitting.value = true;
  
  // 模拟请求延迟
  setTimeout(() => {
    // 通知父组件订阅事件
    emit('subscribe', email.value);
    
    // 重置表单
    email.value = '';
    isSubmitting.value = false;
  }, 1000);
};
</script>

<style lang="less" scoped>
.blog-newsletter {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.06);
  padding: 40px;
  
  .newsletter-content {
    display: flex;
    align-items: center;
    gap: 40px;
    
    .newsletter-info {
      flex: 1;
      
      .newsletter-title {
        font-size: 28px;
        font-weight: 600;
        color: var(--bTitleColor, #333);
        margin-bottom: 16px;
        
        .highlight {
          position: relative;
          z-index: 1;
          
          &::after {
            content: '';
            position: absolute;
            bottom: 2px;
            left: 0;
            width: 100%;
            height: 8px;
            background: linear-gradient(45deg, rgba(22, 119, 255, 0.2) 0%, rgba(22, 119, 255, 0.1) 100%);
            z-index: -1;
            border-radius: 3px;
          }
        }
      }
      
      .newsletter-desc {
        font-size: 16px;
        line-height: 1.6;
        color: var(--bDescColor, #666);
        margin-bottom: 24px;
      }
      
      .newsletter-features {
        display: flex;
        flex-direction: column;
        gap: 12px;
        
        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .feature-icon {
            color: #1677FF;
            font-size: 16px;
          }
          
          .feature-text {
            font-size: 15px;
            color: var(--bTitleColor, #333);
          }
        }
      }
    }
    
    .newsletter-form {
      flex: 1;
      
      .form-group {
        display: flex;
        margin-bottom: 8px;
        
        .form-input {
          flex: 1;
          padding: 12px 16px;
          font-size: 15px;
          border: 1px solid #e8e8e8;
          border-radius: 4px 0 0 4px;
          outline: none;
          transition: border-color 0.3s;
          
          &:focus {
            border-color: #1677FF;
          }
          
          &.error {
            border-color: #ff4d4f;
          }
        }
        
        .subscribe-btn {
          padding: 0 24px;
          background-color: #1677FF;
          color: white;
          font-size: 15px;
          font-weight: 500;
          border: none;
          border-radius: 0 4px 4px 0;
          cursor: pointer;
          transition: background-color 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &:hover {
            background-color: #0958d9;
          }
          
          &:disabled {
            background-color: #91caff;
            cursor: not-allowed;
          }
          
          .loading {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 2px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
          }
          
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        }
      }
      
      .form-note {
        font-size: 13px;
        color: #999;
        margin: 0;
        
        &.error {
          color: #ff4d4f;
        }
        
        &.privacy {
          color: #999;
        }
      }
    }
  }
  
  @media (max-width: 992px) {
    padding: 30px;
    
    .newsletter-content {
      flex-direction: column;
      gap: 30px;
      text-align: center;
      
      .newsletter-info {
        .newsletter-features {
          display: inline-flex;
          flex-direction: row;
          flex-wrap: wrap;
          justify-content: center;
          gap: 16px;
        }
      }
      
      .newsletter-form {
        width: 100%;
        max-width: 500px;
        margin: 0 auto;
      }
    }
  }
  
  @media (max-width: 576px) {
    padding: 24px;
    
    .newsletter-content {
      .newsletter-info {
        .newsletter-title {
          font-size: 24px;
        }
        
        .newsletter-desc {
          font-size: 15px;
        }
        
        .newsletter-features {
          flex-direction: column;
          align-items: center;
        }
      }
    }
  }
}
</style> 