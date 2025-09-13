<template>
  <div class="newsletter-section">
    <div class="newsletter-container">
      <div class="newsletter-icon animate__animated animate__fadeInLeft" style="animation-delay: 0.1s">
        <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="mail" aria-hidden="true"><path d="M928 160H96c-17.7 0-32 14.3-32 32v640c0 17.7 14.3 32 32 32h832c17.7 0 32-14.3 32-32V192c0-17.7-14.3-32-32-32zm-40 110.8V792H136V270.8l-27.6-21.5 39.3-50.5 42.8 33.3h643.1l42.8-33.3 39.3 50.5-27.7 21.5zM833.6 232L512 482 190.4 232l-42.8-33.3-39.3 50.5 27.6 21.5 341.6 265.6a55.99 55.99 0 0068.7 0L888 270.8l27.7-21.5-39.3-50.5-42.8 33.2z"></path></svg></i>
      </div>
      <div class="newsletter-content animate__animated animate__fadeInUp" style="animation-delay: 0.2s">
        <h3>订阅我们的资讯</h3>
        <p>获取最新技术文章、教程和资源，不错过任何更新！</p>
      </div>
      <div class="newsletter-form animate__animated animate__fadeInRight" style="animation-delay: 0.3s">
        <div class="input-group" :class="{ 'has-error': errorMessage }">
          <input 
            type="email" 
            v-model="email" 
            placeholder="您的邮箱地址" 
            @input="clearError"
            @keyup.enter="subscribe"
          >
          <button @click="subscribe" :disabled="loading">
            <i class="ant-icon" :class="loading ? 'loading' : ''"><svg viewBox="64 64 896 896" focusable="false" data-icon="enter" aria-hidden="true"><path d="M864 170h-60c-4.4 0-8 3.6-8 8v518H310v-73c0-6.7-7.8-10.5-13-6.3l-141.9 112a8 8 0 000 12.6l141.9 112c5.3 4.2 13 .4 13-6.3v-75h498c35.3 0 64-28.7 64-64V178c0-4.4-3.6-8-8-8z"></path></svg></i>
            <span>{{ loading ? '订阅中...' : '订阅' }}</span>
          </button>
        </div>
        <div class="error-message" v-if="errorMessage">{{ errorMessage }}</div>
        <div class="success-message animate__animated animate__fadeIn" v-if="successMessage">
          <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="check-circle" aria-hidden="true"><path d="M699 353h-46.9c-10.2 0-19.9 4.9-25.9 13.3L469 584.3l-71.2-98.8c-6-8.3-15.6-13.3-25.9-13.3H325c-6.5 0-10.3 7.4-6.5 12.7l124.6 172.8a31.8 31.8 0 0051.7 0l210.6-292c3.9-5.3.1-12.7-6.4-12.7z"></path><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path></svg></i>
          {{ successMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const email = ref('');
const loading = ref(false);
const errorMessage = ref('');
const successMessage = ref('');

const validateEmail = (email: string): boolean => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

const clearError = () => {
  errorMessage.value = '';
  successMessage.value = '';
};

const subscribe = () => {
  // 清除之前的消息
  clearError();
  
  // 验证邮箱格式
  if (!email.value.trim()) {
    errorMessage.value = '请输入您的邮箱地址';
    return;
  }
  
  if (!validateEmail(email.value)) {
    errorMessage.value = '请输入有效的邮箱地址';
    return;
  }
  
  loading.value = true;
  
  // 模拟API请求
  setTimeout(() => {
    loading.value = false;
    successMessage.value = '订阅成功！感谢您的订阅。';
    email.value = '';
    
    // 3秒后清除成功消息
    setTimeout(() => {
      successMessage.value = '';
    }, 3000);
  }, 1500);
};
</script>

<style lang="less" scoped>
.newsletter-section {
  margin: 30px 0;
}

.newsletter-container {
  background: linear-gradient(135deg, #f5f7fa, #e6f7ff);
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  border: 1px solid #e6f4ff;
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 16px;
    gap: 14px;
  }
  
  .newsletter-icon {
    flex: 0 0 46px;
    height: 46px;
    background: linear-gradient(135deg, #1677FF, #69b1ff);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 1.4rem;
    box-shadow: 0 4px 8px rgba(22, 119, 255, 0.2);
    
    @media (max-width: 768px) {
      margin: 0 auto;
    }
    
    i {
      display: flex;
      
      svg {
        width: 1em;
        height: 1em;
      }
    }
  }
  
  .newsletter-content {
    flex: 1;
    
    h3 {
      font-size: 1.2rem;
      font-weight: 600;
      color: #333;
      margin-bottom: 5px;
    }
    
    p {
      color: #666;
      font-size: 0.9rem;
      margin: 0;
    }
  }
  
  .newsletter-form {
    flex: 0 0 45%;
    
    @media (max-width: 768px) {
      width: 100%;
    }
    
    .input-group {
      display: flex;
      border-radius: 4px;
      overflow: hidden;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
      transition: box-shadow 0.3s ease;
      
      &:focus-within {
        box-shadow: 0 4px 10px rgba(22, 119, 255, 0.15);
      }
      
      &.has-error {
        box-shadow: 0 4px 10px rgba(235, 83, 83, 0.15);
        
        input {
          border-color: #ff4d4f;
        }
      }
      
      input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #d9d9d9;
        border-right: none;
        border-radius: 4px 0 0 4px;
        font-size: 0.9rem;
        color: #333;
        outline: none;
        transition: border-color 0.3s ease;
        
        &:focus {
          border-color: #1677FF;
        }
        
        &::placeholder {
          color: #bbb;
        }
      }
      
      button {
        background: linear-gradient(135deg, #1677FF, #4096ff);
        color: white;
        border: none;
        padding: 0 16px;
        font-size: 0.9rem;
        font-weight: 500;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 5px;
        transition: all 0.3s ease;
        
        &:hover:not(:disabled) {
          background: linear-gradient(135deg, #0958d9, #1677FF);
        }
        
        &:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        
        i {
          font-size: 0.9rem;
          display: flex;
          
          svg {
            width: 1em;
            height: 1em;
          }
          
          &.loading {
            animation: spin 1s linear infinite;
          }
        }
      }
    }
    
    .error-message {
      color: #ff4d4f;
      font-size: 0.8rem;
      margin-top: 6px;
      padding-left: 2px;
    }
    
    .success-message {
      color: #52c41a;
      font-size: 0.85rem;
      margin-top: 8px;
      font-weight: 500;
      display: flex;
      align-items: center;
      gap: 5px;
      
      @media (max-width: 768px) {
        justify-content: center;
      }
      
      i {
        font-size: 0.9rem;
        background-color: rgba(82, 196, 26, 0.15);
        color: #52c41a;
        padding: 3px;
        border-radius: 50%;
        display: flex;
        
        svg {
          width: 1em;
          height: 1em;
        }
      }
    }
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.ant-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}
</style> 