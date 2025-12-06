<template>
  <div class="profile-banner">
    <div class="banner-background">
      <div class="banner-gradient"></div>
      <div class="banner-particles"></div>
    </div>
    <div class="banner-content">
      <div class="banner-title animate__animated animate__fadeInDown">
        <div class="icon-container">
          <i :class="icon"></i>
        </div>
        <h1>{{ title }}</h1>
      </div>
    </div>
    <div class="wave-divider">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 100" preserveAspectRatio="none">
        <path fill="rgba(255, 255, 255, 0.95)"
          d="M0,32L60,37.3C120,43,240,53,360,58.7C480,64,600,64,720,58.7C840,53,960,43,1080,42.7C1200,43,1320,53,1380,58.7L1440,64L1440,100L1380,100C1320,100,1200,100,1080,100C960,100,840,100,720,100C600,100,480,100,360,100C240,100,120,100,60,100L0,100Z">
        </path>
      </svg>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  // 标题文本
  title: {
    type: String,
    required: true
  },
  // 图标类名
  icon: {
    type: String,
    required: true
  }
})
</script>

<style lang="less" scoped>
// 变量定义
@primary-color: #1890ff;
@primary-dark: #096dd9;
@primary-light: #40a9ff;
@primary-bg: #e6f7ff;
@text-color: #333;
@text-secondary: #666;

.profile-banner {
  position: relative;
  height: 160px;
  overflow: hidden;
  color: white;

  .banner-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, #40a9ff, #096dd9);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxkZWZzPjxwYXR0ZXJuIGlkPSJwYXR0ZXJuIiB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgcGF0dGVyblRyYW5zZm9ybT0icm90YXRlKDQ1KSI+PHJlY3QgaWQ9InBhdHRlcm4tYmFja2dyb3VuZCIgd2lkdGg9IjQwMCUiIGhlaWdodD0iNDAwJSIgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjEpIj48L3JlY3Q+IDxjaXJjbGUgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgY3g9IjIwIiBjeT0iMjAiIHI9IjEiPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0icmdiYSgyNTUsIDI1NSwgMjU1LCAwLjA1KSIgY3g9IjAiIGN5PSIyMCIgcj0iMSI+PC9jaXJjbGU+PGNpcmNsZSBmaWxsPSJyZ2JhKDI1NSwgMjU1LCAyNTUsIDAuMDUpIiBjeD0iNDAiIGN5PSIyMCIgcj0iMSI+PC9jaXJjbGU+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCBmaWxsPSJ1cmwoI3BhdHRlcm4pIiBoZWlnaHQ9IjEwMCUiIHdpZHRoPSIxMDAlIj48L3JlY3Q+PC9zdmc+');
      opacity: 0.8;
    }
  }

  .banner-gradient {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 80px;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.3) 100%);
  }

  .banner-particles {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;

    &::after {
      content: '';
      position: absolute;
      width: 100%;
      height: 100%;
      background-image:
        radial-gradient(circle at 20% 35%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 5%),
        radial-gradient(circle at 75% 44%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 6%),
        radial-gradient(circle at 46% 52%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 4%),
        radial-gradient(circle at 60% 80%, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0) 5%),
        radial-gradient(circle at 10% 75%, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 6%);
    }
  }

  .banner-content {
    position: relative;
    z-index: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding: 0 20px;

    .banner-title {
      display: flex;
      align-items: center;

      .icon-container {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.2);
        margin-right: 16px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        backdrop-filter: blur(4px);

        i {
          font-size: 24px;
          color: white;
        }
      }

      h1 {
        font-size: 24px;
        font-weight: 600;
        margin: 0;
        text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        letter-spacing: 0.5px;
      }
    }
  }

  .wave-divider {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    overflow: hidden;
    line-height: 0;

    svg {
      width: 100%;
      height: 40px;
      filter: drop-shadow(0 -1px 2px rgba(0, 0, 0, 0.05));
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .profile-banner {
    height: 140px;

    .banner-content .banner-title {
      .icon-container {
        width: 40px;
        height: 40px;
        margin-right: 12px;

        i {
          font-size: 20px;
        }
      }

      h1 {
        font-size: 20px;
      }
    }
  }
}

@media (max-width: 576px) {
  .profile-banner {
    height: 120px;

    .wave-divider svg {
      height: 30px;
    }
  }
}
</style>