<template>
    <div class="redirect-page">
        <div class="redirect-container">
            <!-- 安全图标 -->
            <div class="icon-container">
                <div class="icon-wrapper">
                    <i class="fas fa-shield-alt"></i>
                </div>
            </div>

            <!-- 标题和提示 -->
            <h1 class="redirect-title">安全提示</h1>
            <div class="redirect-content">
                <p class="warning-text">您即将离开本站，前往外部链接</p>
                <div class="notice-box">
                    <div class="notice-title">
                        <i class="fas fa-shield-alt"></i> 安全提示
                    </div>
                    <p><i class="fas fa-exclamation-triangle"></i> 即将跳转的链接不受本站管控，请注意您的账号和财产安全</p>
                    <p><i class="fas fa-info-circle"></i> 不要在跳转网站输入本站的账号密码信息</p>
                    <p><i class="fas fa-hand-paper"></i> 谨慎下载文件，不要轻信付款信息</p>
                    <p><i class="fas fa-money-bill-wave"></i> 不要向陌生网站支付款项，谨防诈骗</p>
                </div>

                <div class="resource-info-container">
                    <div class="resource-name" v-if="resourceName">
                        <div class="info-label">
                            <i class="fas fa-file-alt"></i> 资源名称
                        </div>
                        <div class="info-value">{{ resourceName }}</div>
                    </div>
                    
                    <div class="url-display">
                        <div class="info-label">
                            <i class="fas fa-link"></i> 跳转地址
                        </div>
                        <div class="info-value">{{ targetUrl }}</div>
                    </div>
                </div>
                
                <div class="disclaimer">
                    <i class="fas fa-copyright"></i> 声明：本站资源来自互联网，本站仅作为资源收集和整理，不参与任何资源的破解或修改工作。如有侵权，请联系我们删除。
                </div>
            </div>

            <!-- 按钮组 -->
            <div class="button-group">
                <a-button type="primary" @click="handleProceed">
                    <i class="fas fa-external-link-alt"></i> 确认并前往
                </a-button>
                <a-button @click="handleCancel">
                    <i class="fas fa-times"></i> 返回
                </a-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();

// 获取目标URL，默认为首页
const targetUrl = ref(route.query.to as string || '/');
const decodedUrl = computed(() => decodeURIComponent(targetUrl.value));

// 获取资源名称
const resourceName = ref(route.query.name as string || '');

// 继续前往目标链接
const proceedToTarget = () => {
  const url = decodedUrl.value;
  
  // 检查是否是外部链接
  if (url.startsWith('http://') || url.startsWith('https://')) {
    window.open(url, '_blank');
  } else {
    // 内部链接使用路由导航
    router.push(url);
  }
};

// 处理按钮点击
const handleProceed = () => {
  proceedToTarget();
};

const handleCancel = () => {
  router.push('/');
};
</script>

<style scoped lang="less">
.redirect-page {
  font-family: 'OPPO Sans', sans-serif;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #edf4ff 0%, #e0e9f7 100%);
  padding: 20px;
  box-sizing: border-box;
  
  .redirect-container {
    width: 100%;
    max-width: 620px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 0 50px rgba(0, 0, 0, 0.15);
    padding: 30px;
    text-align: center;
    position: relative;
    animation: fadeInUp 0.6s ease;
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 5px;
      background: linear-gradient(90deg, #1677FF, #69b4ff);
    }
    
    .icon-container {
      margin-bottom: 15px;
      
      .icon-wrapper {
        width: 70px;
        height: 70px;
        background: linear-gradient(135deg, #f0f7ff 0%, #e6f7ff 100%);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        box-shadow: 0 8px 20px rgba(22, 119, 255, 0.2);
        border: 3px solid rgba(255, 255, 255, 0.8);
        
        i {
          font-size: 30px;
          color: #1677FF;
          animation: pulse 2s infinite;
        }
      }
    }
    
    .redirect-title {
      font-size: 24px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 15px;
      background: linear-gradient(90deg, #1677FF, #69b4ff);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      position: relative;
      display: inline-block;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -6px;
        left: 50%;
        transform: translateX(-50%);
        width: 40px;
        height: 3px;
        background: linear-gradient(90deg, #1677FF, #69b4ff);
        border-radius: 3px;
      }
    }
    
    .redirect-content {
      margin-bottom: 20px;
      
      .warning-text {
        font-size: 16px;
        color: #444;
        margin-bottom: 12px;
        font-weight: 500;
      }
      
      .notice-box {
        background: #fffbe6;
        border: 1px solid #ffe58f;
        border-radius: 10px;
        padding: 12px 15px;
        text-align: left;
        margin-bottom: 15px;
        position: relative;
        box-shadow: 0 4px 12px rgba(250, 219, 95, 0.12);
        
        .notice-title {
          font-size: 14px;
          font-weight: 600;
          color: #d48806;
          margin-bottom: 8px;
          display: flex;
          align-items: center;
          
          i {
            margin-right: 6px;
            color: #d48806;
            font-size: 14px;
          }
        }
        
        p {
          margin: 0 0 6px;
          font-size: 12px;
          color: #595959;
          display: flex;
          align-items: flex-start;
          line-height: 1.4;
          
          &:last-child {
            margin-bottom: 0;
          }
          
          i {
            color: #faad14;
            margin-right: 8px;
            margin-top: 2px;
            flex-shrink: 0;
            font-size: 12px;
          }
        }
      }
      
      .resource-info-container {
        display: flex;
        flex-direction: column;
        gap: 10px;
        margin-bottom: 12px;
        
        .url-display, .resource-name {
          background: #f7f9fc;
          padding: 10px 14px;
          border-radius: 8px;
          text-align: left;
          word-break: break-all;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
          border: 1px solid #eaedf2;
          position: relative;
          overflow: hidden;
          
          .info-label {
            color: #8c8c8c;
            font-size: 12px;
            margin-bottom: 4px;
            font-weight: 500;
            display: flex;
            align-items: center;
            
            i {
              margin-right: 6px;
              color: #1677FF;
            }
          }
          
          .info-value {
            color: #1677FF;
            font-weight: 500;
            font-size: 12px;
            line-height: 1.4;
          }
        }
      }
      
      .disclaimer {
        font-size: 11px;
        color: #999;
        line-height: 1.4;
        padding: 10px 8px;
        background: #f5f5f5;
        border-radius: 6px;
        text-align: left;
        border: 1px solid #eee;
        
        i {
          margin-right: 4px;
          color: #888;
        }
      }
    }
    
    .button-group {
      display: flex;
      gap: 12px;
      justify-content: center;
      
      .ant-btn {
        min-width: 130px;
        height: 36px;
        font-size: 13px;
        font-weight: 500;
        border-radius: 6px;
        
        i {
          margin-right: 5px;
        }
        
        &[type="primary"] {
          background: linear-gradient(45deg, #1677FF, #4dabff);
          border: none;
          box-shadow: 0 4px 12px rgba(22, 119, 255, 0.2);
          
          &:hover {
            background: linear-gradient(45deg, #0d6efd, #3e9fff);
            box-shadow: 0 6px 16px rgba(22, 119, 255, 0.3);
            transform: translateY(-2px);
          }
        }
        
        &:not([type="primary"]) {
          &:hover {
            color: #1677FF;
            border-color: #1677FF;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
          }
        }
      }
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
    100% {
      transform: scale(1);
    }
  }
  
  @media (max-width: 767px) {
    padding: 10px;
    
    .redirect-container {
      max-width: 100%;
      border-radius: 12px;
      padding: 20px 15px;
      
      .icon-container .icon-wrapper {
        width: 60px;
        height: 60px;
        
        i {
          font-size: 24px;
        }
      }
      
      .redirect-title {
        font-size: 20px;
      }
      
      .button-group {
        gap: 10px;
        
        .ant-btn {
          min-width: 110px;
          height: 34px;
          font-size: 12px;
        }
      }
      
      .redirect-content {
        .notice-box {
          padding: 10px 12px;
        }
        
        .resource-info-container {
          .url-display, .resource-name {
            padding: 8px 10px;
            
            .info-value {
              font-size: 11px;
            }
          }
        }
      }
    }
  }
}
</style> 