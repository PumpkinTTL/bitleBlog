<template>
  <div class="about-contact">
    <!-- 添加animate.css动画 -->
    <div class="section-header animate__animated animate__fadeInUp">
      <div class="section-icon animate__animated animate__bounceIn animate__faster">
        <i class="fas fa-envelope"></i>
      </div>
      <h2 class="section-title animate__animated animate__fadeInUp animate__faster">联系我们</h2>
      <p class="section-desc animate__animated animate__fadeInUp animate__faster">随时为您提供帮助与支持</p>
    </div>

    <!-- 联系信息和表单 -->
    <div class="contact-container">
      <!-- 联系信息部分 -->
      <div class="contact-info animate__animated animate__zoomInLeft animate__faster">
        <div class="info-card address-card animate__animated animate__zoomIn animate__faster">
          <div class="info-header">
            <div class="info-icon">
              <i class="fas fa-map-marker-alt"></i>
            </div>
            <h3>公司地址</h3>
          </div>
          <p>中国广东省深圳市南山区科技园科发路8号金融基地</p>
          <div class="map-container animate__animated animate__fadeInUp" style="animation-delay: 0.1s;">
            <img src="https://picsum.photos/id/1016/600/300" alt="公司地图" class="map-image">
            <div class="map-overlay">
              <button class="map-btn">查看完整地图</button>
            </div>
          </div>
        </div>

        <div class="contact-items">
          <div class="contact-item animate__animated animate__fadeInUp" style="animation-delay: 0.1s;">
            <div class="item-icon">
              <i class="fas fa-envelope"></i>
            </div>
            <div class="item-content">
              <h4>邮箱</h4>
              <a href="mailto:contact@bitle.com" class="contact-link">contact@bitle.com</a>
              <a href="mailto:support@bitle.com" class="contact-link">support@bitle.com</a>
            </div>
          </div>

          <div class="contact-item animate__animated animate__fadeInUp" style="animation-delay: 0.15s;">
            <div class="item-icon">
              <i class="fas fa-phone-alt"></i>
            </div>
            <div class="item-content">
              <h4>电话</h4>
              <a href="tel:+8675588887777" class="contact-link">+86 755-8888-7777</a>
              <a href="tel:4001234567" class="contact-link">400-123-4567 (客服热线)</a>
            </div>
          </div>

          <div class="contact-item animate__animated animate__fadeInUp" style="animation-delay: 0.2s;">
            <div class="item-icon">
              <i class="fas fa-clock"></i>
            </div>
            <div class="item-content">
              <h4>工作时间</h4>
              <p>周一至周五: 9:00 - 18:00</p>
              <p>周末: 休息</p>
            </div>
          </div>
        </div>

        <div class="social-links animate__animated animate__fadeInUp" style="animation-delay: 0.25s;">
          <h4>关注我们</h4>
          <div class="social-icons">
            <a href="#" class="social-icon">
              <i class="fab fa-weixin"></i>
              <span class="icon-tooltip">微信公众号</span>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-weibo"></i>
              <span class="icon-tooltip">官方微博</span>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-github"></i>
              <span class="icon-tooltip">GitHub</span>
            </a>
            <a href="#" class="social-icon">
              <i class="fab fa-zhihu"></i>
              <span class="icon-tooltip">知乎</span>
            </a>
          </div>
        </div>
      </div>

      <!-- 联系表单部分 -->
      <div class="contact-form-container animate__animated animate__zoomInRight animate__faster">
        <h3 class="form-title">给我们留言</h3>
        <p class="form-subtitle">如果您有任何问题、建议或合作意向，请随时联系我们</p>

        <form class="contact-form" @submit.prevent="submitForm">
          <div class="form-group animate__animated animate__fadeInUp" style="animation-delay: 0.1s;">
            <label for="name">您的姓名</label>
            <div class="input-wrap">
              <i class="fas fa-user"></i>
              <input type="text" id="name" v-model="formData.name" placeholder="请输入您的姓名" required>
            </div>
          </div>

          <div class="form-group animate__animated animate__fadeInUp" style="animation-delay: 0.15s;">
            <label for="email">邮箱地址</label>
            <div class="input-wrap">
              <i class="fas fa-envelope"></i>
              <input type="email" id="email" v-model="formData.email" placeholder="请输入您的邮箱" required>
            </div>
          </div>

          <div class="form-group animate__animated animate__fadeInUp" style="animation-delay: 0.2s;">
            <label for="topic">主题</label>
            <div class="input-wrap">
              <i class="fas fa-tag"></i>
              <select id="topic" v-model="formData.topic" required>
                <option value="" disabled selected>请选择联系主题</option>
                <option value="product">产品咨询</option>
                <option value="service">客户服务</option>
                <option value="suggestion">意见反馈</option>
                <option value="cooperation">商务合作</option>
                <option value="other">其他问题</option>
              </select>
            </div>
          </div>

          <div class="form-group animate__animated animate__fadeInUp" style="animation-delay: 0.25s;">
            <label for="message">留言内容</label>
            <div class="input-wrap textarea-wrap">
              <i class="fas fa-comment-alt"></i>
              <textarea id="message" v-model="formData.message" rows="5" placeholder="请输入您的留言内容..." required></textarea>
            </div>
          </div>

          <div class="form-footer animate__animated animate__fadeInUp" style="animation-delay: 0.3s;">
            <div class="privacy-policy">
              <input type="checkbox" id="privacy" v-model="formData.agreePrivacy" required>
              <label for="privacy">我已阅读并同意<a href="#">隐私政策</a></label>
            </div>

            <button type="submit" class="submit-btn" :disabled="submitting || !formData.agreePrivacy">
              <span v-if="!submitting">提交留言</span>
              <span v-else class="loading-spinner"><i class="fas fa-spinner fa-spin"></i> 提交中...</span>
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- 常见问题部分 -->
    <div class="faq-section animate__animated animate__fadeInUp animate__faster">
      <div class="section-subheader">
        <div class="subheader-line"></div>
        <h3 class="faq-title">常见问题</h3>
        <div class="subheader-line"></div>
      </div>

      <div class="faq-container">
        <div class="faq-item animate__animated animate__fadeInUp" v-for="(item, index) in faqItems" :key="index"
          :class="{'is-open': item.open}" :style="`animation-delay: ${0.1 + index * 0.05}s;`">
          <div class="faq-question" @click="toggleFaq(index)">
            <div class="question-text">{{ item.question }}</div>
            <div class="question-icon">
              <i :class="[item.open ? 'fas fa-minus' : 'fas fa-plus']"></i>
            </div>
          </div>
          <div class="faq-answer" :style="{ maxHeight: item.open ? '300px' : '0' }">
            {{ item.answer }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { message } from 'ant-design-vue';

// 表单数据
const formData = ref({
  name: '',
  email: '',
  topic: '',
  message: '',
  agreePrivacy: false
});

// 提交状态
const submitting = ref(false);

// 提交表单方法
const submitForm = () => {
  if (!formData.value.agreePrivacy) {
    message.error('请先同意隐私政策');
    return;
  }
  
  submitting.value = true;
  
  // 模拟API请求
  setTimeout(() => {
    message.success('留言已提交，我们会尽快回复您！');
    
    // 重置表单
    formData.value = {
      name: '',
      email: '',
      topic: '',
      message: '',
      agreePrivacy: false
    };
    
    submitting.value = false;
  }, 1500);
};

// 常见问题数据
const faqItems = ref([
  {
    question: 'Bitle博客系统适合哪些用户使用？',
    answer: 'Bitle博客系统适合各类用户使用，从个人博主到企业团队。系统设计直观易用，无需编程知识，同时又具备高度可定制性，满足专业用户需求。',
    open: true
  },
  {
    question: '如何联系客户支持团队？',
    answer: '您可以通过本页面的联系表单、客服邮箱（support@bitle.com）或客服热线（400-123-4567）联系我们的支持团队，我们会在工作时间内尽快回复您。',
    open: false
  },
  {
    question: '产品是否提供免费试用？',
    answer: '是的，我们提供14天的全功能免费试用。在此期间，您可以体验所有付费功能，并决定是否继续使用我们的服务。',
    open: false
  },
  {
    question: '如何成为Bitle的合作伙伴？',
    answer: '我们欢迎各类合作伙伴加入Bitle的生态系统。如果您有兴趣成为我们的合作伙伴，请发送邮件至partnership@bitle.com，我们的商务团队会与您联系。',
    open: false
  }
]);

// 切换FAQ显示状态
const toggleFaq = (index) => {
  faqItems.value[index].open = !faqItems.value[index].open;
};
</script>

<style scoped lang="less">
.about-contact {
  padding: 40px;
  
  @media (max-width: 767px) {
    padding: 30px 15px;
  }
  
  .section-header {
    text-align: center;
    margin-bottom: 50px;
    
    .section-icon {
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1677FF 0%, #4096ff 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 15px;
      box-shadow: 0 5px 15px rgba(22, 119, 255, 0.3);
      
      i {
        font-size: 24px;
        color: #fff;
      }
    }
    
    .section-title {
      font-size: 30px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 12px;

      @media (max-width: 767px) {
        font-size: 26px;
      }
    }

    .section-desc {
      font-size: 16px;
      color: var(--el-text-color-regular);
      max-width: 600px;
      margin: 0 auto;
    }
  }
  
  .contact-container {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 30px;
    margin-bottom: 50px;
    
    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }
    
    .contact-info {
      .info-card {
        background-color: var(--el-bg-color);
        border-radius: 16px;
        padding: 25px;
        box-shadow: var(--el-box-shadow);
        border: 1px solid var(--el-border-color-lighter);
        margin-bottom: 30px;

        &.address-card {
          position: relative;
          overflow: hidden;

          &::before {
            content: '';
            position: absolute;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            background: radial-gradient(circle, var(--el-color-primary-light-8) 0%, transparent 70%);
            top: -50px;
            right: -50px;
            z-index: 0;
          }
        }

        .info-header {
          display: flex;
          align-items: center;
          margin-bottom: 15px;
          position: relative;
          z-index: 1;

          .info-icon {
            width: 45px;
            height: 45px;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            box-shadow: 0 5px 15px var(--el-color-primary-light-8);

            i {
              font-size: 20px;
              color: var(--el-color-white);
            }
          }

          h3 {
            font-size: 20px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin: 0;
          }
        }

        p {
          color: var(--el-text-color-regular);
          margin-bottom: 20px;
          position: relative;
          z-index: 1;
        }
        
        .map-container {
          border-radius: 12px;
          overflow: hidden;
          position: relative;
          
          .map-image {
            width: 100%;
            display: block;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .map-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.7));
            display: flex;
            align-items: center;
            justify-content: center;
            opacity: 0;
            transition: opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            
            .map-btn {
              background-color: #fff;
              color: #1677FF;
              border: none;
              padding: 10px 20px;
              border-radius: 30px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
              
              &:hover {
                background-color: #1677FF;
                color: #fff;
                transform: translateY(-3px);
              }
            }
          }
          
          &:hover {
            .map-image {
              transform: scale(1.02);
            }
            
            .map-overlay {
              opacity: 1;
            }
          }
        }
      }
      
      .contact-items {
        margin-bottom: 30px;
        
        .contact-item {
          background-color: var(--el-bg-color);
          border-radius: 16px;
          padding: 20px;
          box-shadow: var(--el-box-shadow);
          border: 1px solid var(--el-border-color-lighter);
          display: flex;
          margin-bottom: 15px;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          &:hover {
            transform: translateY(-3px);
            box-shadow: var(--el-box-shadow-dark);
            border-color: var(--el-color-primary-light-5);
          }

          &:last-child {
            margin-bottom: 0;
          }

          .item-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            background-color: var(--el-color-primary-light-9);
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            flex-shrink: 0;

            i {
              font-size: 20px;
              color: var(--el-color-primary);
            }
          }

          .item-content {
            h4 {
              font-size: 16px;
              font-weight: 600;
              margin-bottom: 10px;
              color: var(--el-text-color-primary);
            }

            p {
              color: var(--el-text-color-regular);
              font-size: 14px;
              margin-bottom: 5px;

              &:last-child {
                margin-bottom: 0;
              }
            }

            .contact-link {
              display: block;
              color: var(--el-color-primary);
              font-size: 14px;
              margin-bottom: 5px;
              text-decoration: none;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

              &:hover {
                color: var(--el-color-primary-dark-2);
                text-decoration: underline;
              }

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
      }
      
      .social-links {
        background-color: var(--el-bg-color);
        border-radius: 16px;
        padding: 25px;
        box-shadow: var(--el-box-shadow);
        border: 1px solid var(--el-border-color-lighter);

        h4 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 20px;
          color: var(--el-text-color-primary);
          text-align: center;
        }

        .social-icons {
          display: flex;
          justify-content: center;
          gap: 20px;

          .social-icon {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background-color: var(--el-color-primary-light-9);
            display: flex;
            align-items: center;
            justify-content: center;
            color: var(--el-color-primary);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;

            i {
              font-size: 22px;
            }

            .icon-tooltip {
              position: absolute;
              bottom: -40px;
              left: 50%;
              transform: translateX(-50%);
              background-color: var(--el-text-color-primary);
              color: var(--el-bg-color);
              padding: 5px 10px;
              border-radius: 4px;
              font-size: 12px;
              opacity: 0;
              visibility: hidden;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
              white-space: nowrap;

              &::before {
                content: '';
                position: absolute;
                top: -5px;
                left: 50%;
                transform: translateX(-50%);
                border-width: 0 5px 5px;
                border-style: solid;
                border-color: transparent transparent var(--el-text-color-primary);
              }
            }

            &:hover {
              background-color: var(--el-color-primary);
              color: var(--el-color-white);
              transform: translateY(-3px);

              .icon-tooltip {
                opacity: 1;
                visibility: visible;
                bottom: -35px;
              }
            }
          }
        }
      }
    }
    
    .contact-form-container {
      background-color: var(--el-bg-color);
      border-radius: 16px;
      padding: 40px;
      box-shadow: var(--el-box-shadow);
      border: 1px solid var(--el-border-color-lighter);

      @media (max-width: 767px) {
        padding: 30px 20px;
      }

      .form-title {
        font-size: 24px;
        font-weight: 600;
        margin-bottom: 10px;
        color: var(--el-text-color-primary);
        text-align: center;
      }

      .form-subtitle {
        font-size: 15px;
        color: var(--el-text-color-regular);
        margin-bottom: 30px;
        text-align: center;
      }

      .contact-form {
        .form-group {
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 0;
          }

          label {
            display: block;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 8px;
            color: var(--el-text-color-primary);
          }

          .input-wrap {
            position: relative;

            i {
              position: absolute;
              left: 15px;
              top: 50%;
              transform: translateY(-50%);
              color: var(--el-color-primary);
              font-size: 16px;
            }

            &.textarea-wrap i {
              top: 20px;
              transform: none;
            }

            input, select, textarea {
              width: 100%;
              padding: 14px 15px 14px 45px;
              border: 1px solid var(--el-border-color);
              border-radius: 10px;
              background-color: var(--el-bg-color);
              color: var(--el-text-color-primary);
              font-size: 14px;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

              &:focus {
                outline: none;
                border-color: var(--el-color-primary);
                box-shadow: 0 0 0 3px var(--el-color-primary-light-9);
              }
            }
            
            textarea {
              resize: vertical;
              min-height: 120px;
            }
          }
        }
        
        .form-footer {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 30px;
          
          .privacy-policy {
            display: flex;
            align-items: center;
            
            input[type="checkbox"] {
              margin-right: 10px;
              width: 16px;
              height: 16px;
              cursor: pointer;
            }
            
            label {
              font-size: 14px;
              color: var(--el-text-color-regular);
              cursor: pointer;

              a {
                color: var(--el-color-primary);
                text-decoration: none;

                &:hover {
                  text-decoration: underline;
                }
              }
            }
          }

          .submit-btn {
            width: 100%;
            padding: 14px 15px;
            background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
            color: var(--el-color-white);
            border: none;
            border-radius: 10px;
            font-size: 16px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            display: flex;
            align-items: center;
            justify-content: center;

            .loading-spinner {
              display: flex;
              align-items: center;

              i {
                margin-right: 8px;
              }
            }

            &:hover:not(:disabled) {
              transform: translateY(-3px);
              box-shadow: 0 8px 20px var(--el-color-primary-light-7);
            }

            &:disabled {
              opacity: 0.7;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }
  
  .faq-section {
    background-color: var(--el-bg-color);
    border-radius: 16px;
    padding: 40px;
    box-shadow: var(--el-box-shadow);
    border: 1px solid var(--el-border-color-lighter);

    @media (max-width: 767px) {
      padding: 30px 20px;
    }

    .section-subheader {
      display: flex;
      align-items: center;
      margin-bottom: 30px;

      .subheader-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, transparent, var(--el-color-primary-light-7), transparent);
      }

      .faq-title {
        padding: 0 20px;
        text-align: center;
        font-size: 24px;
        font-weight: 600;
        margin: 0;
        color: var(--el-text-color-primary);
      }
    }

    .faq-container {
      .faq-item {
        margin-bottom: 15px;
        border: 1px solid var(--el-border-color);
        border-radius: 12px;
        overflow: hidden;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

        &:last-child {
          margin-bottom: 0;
        }

        &.is-open {
          border-color: var(--el-color-primary);
          box-shadow: 0 5px 15px var(--el-color-primary-light-9);

          .faq-question {
            background-color: var(--el-color-primary-light-9);

            .question-text {
              color: var(--el-color-primary);
            }

            .question-icon {
              background-color: var(--el-color-primary);

              i {
                color: var(--el-color-white);
              }
            }
          }
        }

        .faq-question {
          padding: 18px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          background-color: var(--el-fill-color-lighter);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          &:hover {
            background-color: var(--el-color-primary-light-9);
          }

          .question-text {
            font-weight: 500;
            color: var(--el-text-color-primary);
            transition: color 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .question-icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: var(--el-fill-color);
            color: var(--el-text-color-regular);
            flex-shrink: 0;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

            i {
              font-size: 12px;
              transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }
          }
        }

        .faq-answer {
          padding: 0 20px;
          color: var(--el-text-color-regular);
          font-size: 14px;
          line-height: 1.6;
          max-height: 0;
          overflow: hidden;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          &:not(:empty) {
            border-top: 1px solid var(--el-border-color);
            padding-top: 15px;
            padding-bottom: 15px;
          }
        }
      }
    }
  }

}
</style>
