<template>
  <div class="about-vision">
    <!-- 添加animate.css动画 -->
    <div class="section-header animate__animated animate__fadeInUp">
      <div class="section-icon animate__animated animate__bounceIn animate__faster">
        <i class="fas fa-lightbulb"></i>
      </div>
      <h2 class="section-title animate__animated animate__fadeInUp animate__faster">愿景与使命</h2>
      <p class="section-desc animate__animated animate__fadeInUp animate__faster">我们的奋斗目标与价值观</p>
    </div>

    <!-- 愿景使命 -->
    <div class="vision-container">
      <!-- 愿景部分 -->
      <div class="vision-card vision-primary animate__animated animate__zoomInLeft animate__faster">
        <div class="card-content">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-eye"></i>
            </div>
            <h3>我们的愿景</h3>
          </div>
          <p class="card-description">成为全球领先的博客平台解决方案提供商，让每个人都能轻松创建属于自己的精美博客</p>
          <div class="value-tags">
            <div class="tag animate__animated animate__fadeInUp" style="animation-delay: 0.1s;">创新</div>
            <div class="tag animate__animated animate__fadeInUp" style="animation-delay: 0.15s;">高效</div>
            <div class="tag animate__animated animate__fadeInUp" style="animation-delay: 0.2s;">美观</div>
            <div class="tag animate__animated animate__fadeInUp" style="animation-delay: 0.25s;">易用</div>
          </div>
        </div>
        <div class="vision-image">
          <img src="https://picsum.photos/id/6/800/400" alt="公司愿景">
          <div class="image-shape"></div>
        </div>
      </div>

      <!-- 使命部分 -->
      <div class="vision-card vision-secondary animate__animated animate__fadeInRight animate__faster">
        <div class="card-content">
          <div class="card-header">
            <div class="card-icon">
              <i class="fas fa-flag"></i>
            </div>
            <h3>我们的使命</h3>
          </div>
          <p class="card-description">通过技术创新和优秀的用户体验，降低内容创作门槛，让知识分享变得更加简单和有趣</p>
          <div class="mission-points">
            <div class="point-item animate__animated animate__fadeInUp" style="animation-delay: 0.1s;">
              <div class="point-icon">
                <i class="fas fa-paint-brush"></i>
              </div>
              <div class="point-content">
                <h4>精美设计</h4>
                <p>提供多样化的主题和模板，让博客外观专业而独特</p>
              </div>
            </div>
            <div class="point-item animate__animated animate__fadeInUp" style="animation-delay: 0.15s;">
              <div class="point-icon">
                <i class="fas fa-cogs"></i>
              </div>
              <div class="point-content">
                <h4>简单易用</h4>
                <p>直观的界面设计，零技术门槛，人人可用</p>
              </div>
            </div>
            <div class="point-item animate__animated animate__fadeInUp" style="animation-delay: 0.2s;">
              <div class="point-icon">
                <i class="fas fa-rocket"></i>
              </div>
              <div class="point-content">
                <h4>性能优越</h4>
                <p>高速加载和响应能力，提供最佳用户体验</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 核心价值观 -->
    <div class="values-section animate__animated animate__fadeInUp animate__faster">
      <div class="section-subheader">
        <div class="subheader-line"></div>
        <h3 class="values-title">我们的核心价值观</h3>
        <div class="subheader-line"></div>
      </div>

      <div class="values-container">
        <div
          v-for="(value, index) in coreValues"
          :key="index"
          class="value-item animate__animated animate__fadeInUp"
          :style="`animation-delay: ${0.1 + index * 0.05}s;`"
        >
          <div class="value-icon" :style="{ background: value.gradient }">
            <i :class="value.icon"></i>
          </div>
          <h4>{{ value.title }}</h4>
          <p>{{ value.description }}</p>
        </div>
      </div>
    </div>

    <!-- 发展理念 -->
    <div class="philosophy-section animate__animated animate__fadeInUp animate__faster">
      <div class="philosophy-content">
        <div class="philosophy-text">
          <h3 class="animate__animated animate__fadeInUp" style="animation-delay: 0.1s;">我们的发展理念</h3>
          <p class="highlight-text animate__animated animate__fadeInUp" style="animation-delay: 0.15s;">以用户为中心，以技术为驱动，不断创新，永不停步</p>
          <p class="detail-text animate__animated animate__fadeInUp" style="animation-delay: 0.2s;">我们坚信，只有不断倾听用户的声音，持续优化产品体验，才能创造真正有价值的服务。同时，我们不断探索前沿技术，将其应用于产品开发中，为用户带来更优质的体验。</p>
          <div class="philosophy-stats animate__animated animate__fadeInUp" style="animation-delay: 0.25s;">
            <div class="stat-item">
              <div class="stat-number">100<span>+</span></div>
              <div class="stat-label">服务国家和地区</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">10<span>万+</span></div>
              <div class="stat-label">全球用户</div>
            </div>
            <div class="stat-item">
              <div class="stat-number">98<span>%</span></div>
              <div class="stat-label">用户满意度</div>
            </div>
          </div>
        </div>
        <div class="philosophy-image">
          <img src="https://picsum.photos/id/20/600/600" alt="发展理念">
          <div class="image-decoration">
            <div class="decoration-circle"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 核心价值观数据
const coreValues = ref([
  {
    title: '用户至上',
    description: '始终将用户需求放在首位，持续优化产品体验',
    icon: 'fas fa-heart',
    gradient: 'linear-gradient(135deg, #ff4b6e, #ff9d7e)'
  },
  {
    title: '创新驱动',
    description: '不断探索新技术，推动产品和服务创新',
    icon: 'fas fa-lightbulb',
    gradient: 'linear-gradient(135deg, #ffba40, #ffd86f)'
  },
  {
    title: '合作共赢',
    description: '与合作伙伴建立长期互利关系，共同成长',
    icon: 'fas fa-hands-helping',
    gradient: 'linear-gradient(135deg, #42b883, #74ebd5)'
  },
  {
    title: '诚信透明',
    description: '坚持诚信经营，保护用户数据安全',
    icon: 'fas fa-shield-alt',
    gradient: 'linear-gradient(135deg, #4e54c8, #8a64d0)'
  }
]);
</script>

<style scoped lang="less">
.about-vision {
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
      background: linear-gradient(135deg, var(--el-color-primary) 0%, var(--el-color-primary-light-3) 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 15px;
      box-shadow: 0 5px 15px var(--el-color-primary-light-7);

      i {
        font-size: 24px;
        color: var(--el-color-white);
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
  
  .vision-container {
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin-bottom: 50px;
    
    .vision-card {
      display: flex;
      background-color: var(--el-bg-color);
      border-radius: 16px;
      box-shadow: var(--el-box-shadow);
      border: 1px solid var(--el-border-color-lighter);
      overflow: hidden;
      position: relative;
      transition: transform 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

      &:hover {
        transform: translateY(-3px);
        box-shadow: var(--el-box-shadow-dark);
      }
      
      @media (max-width: 992px) {
        flex-direction: column-reverse;
      }
      
      &.vision-primary {
        flex-direction: row;
        
        .card-content {
          order: 1;
          width: 45%;
          
          @media (max-width: 992px) {
            width: 100%;
            order: 2;
          }
        }
        
        .vision-image {
          order: 2;
          width: 55%;
          
          @media (max-width: 992px) {
            width: 100%;
            order: 1;
            min-height: 250px;
          }
          
          .image-shape {
            position: absolute;
            left: 45%;
            top: 0;
            bottom: 0;
            width: 10%;
            background-color: var(--el-bg-color);
            clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, 100% 50%);
            z-index: 2;
            
            @media (max-width: 992px) {
              display: none;
            }
          }
        }
      }
      
      &.vision-secondary {
        background: linear-gradient(135deg, var(--el-fill-color-lighter), var(--el-fill-color-light));

        .card-content {
          width: 100%;
        }
      }
      
      .card-content {
        padding: 40px;
        
        @media (max-width: 767px) {
          padding: 30px 20px;
        }
        
        .card-header {
          display: flex;
          align-items: center;
          margin-bottom: 20px;
          
          .card-icon {
            width: 50px;
            height: 50px;
            border-radius: 12px;
            background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
            display: flex;
            align-items: center;
            justify-content: center;
            margin-right: 15px;
            box-shadow: 0 8px 15px var(--el-color-primary-light-8);

            i {
              font-size: 20px;
              color: var(--el-color-white);
            }
          }

          h3 {
            font-size: 24px;
            font-weight: 600;
            margin-bottom: 0;
            color: var(--el-text-color-primary);
          }
        }
        
        .card-description {
          color: var(--el-text-color-regular);
          line-height: 1.7;
          font-size: 16px;
          margin-bottom: 25px;
        }

        .value-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 20px;

          .tag {
            background-color: var(--el-color-primary-light-9);
            color: var(--el-color-primary);
            padding: 8px 16px;
            border-radius: 30px;
            font-weight: 500;
            font-size: 14px;
            transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
            border: 1px solid var(--el-color-primary-light-7);

            &:hover {
              background-color: var(--el-color-primary);
              color: var(--el-color-white);
              transform: translateY(-2px);
            }
          }
        }
        
        .mission-points {
          margin-top: 30px;
          
          .point-item {
            display: flex;
            margin-bottom: 25px;
            position: relative;
            
            &:last-child {
              margin-bottom: 0;
            }
            
            &::before {
              content: '';
              position: absolute;
              top: 40px;
              left: 20px;
              bottom: -15px;
              width: 1px;
              background-color: var(--el-border-color);
              z-index: 0;
            }
            
            &:last-child::before {
              display: none;
            }
            
            .point-icon {
              width: 40px;
              height: 40px;
              border-radius: 10px;
              background-color: var(--el-color-primary-light-9);
              display: flex;
              align-items: center;
              justify-content: center;
              margin-right: 15px;
              flex-shrink: 0;
              position: relative;
              z-index: 1;
              border: 1px solid var(--el-color-primary-light-7);

              i {
                color: var(--el-color-primary);
                font-size: 16px;
              }
            }

            .point-content {
              h4 {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 8px;
                color: var(--el-text-color-primary);
              }

              p {
                margin-bottom: 0;
                font-size: 14px;
                line-height: 1.6;
                color: var(--el-text-color-regular);
              }
            }
          }
        }
      }
      
      .vision-image {
        position: relative;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        
        &:hover img {
          transform: scale(1.02);
        }
      }
    }
  }
  
  .values-section {
    padding: 30px;
    margin-bottom: 50px;
    background-color: var(--el-bg-color);
    border-radius: 16px;
    box-shadow: var(--el-box-shadow);
    border: 1px solid var(--el-border-color-lighter);

    .section-subheader {
      display: flex;
      align-items: center;
      margin-bottom: 40px;

      .subheader-line {
        flex: 1;
        height: 1px;
        background: linear-gradient(to right, transparent, var(--el-color-primary-light-7), transparent);
      }

      .values-title {
        padding: 0 20px;
        text-align: center;
        font-size: 22px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0;
      }
    }
    
    .values-container {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 25px;
      
      @media (max-width: 992px) {
        grid-template-columns: repeat(2, 1fr);
      }
      
      @media (max-width: 576px) {
        grid-template-columns: 1fr;
      }
      
      .value-item {
        text-align: center;
        padding: 30px 20px;
        background-color: var(--el-fill-color-lighter);
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
        border: 1px solid var(--el-border-color-lighter);

        &:hover {
          transform: translateY(-3px);
          box-shadow: var(--el-box-shadow);
        }

        .value-icon {
          width: 60px;
          height: 60px;
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;

          i {
            font-size: 24px;
            color: var(--el-color-white);
          }
        }

        h4 {
          font-size: 18px;
          font-weight: 600;
          margin-bottom: 12px;
          color: var(--el-text-color-primary);
        }

        p {
          color: var(--el-text-color-regular);
          font-size: 14px;
          line-height: 1.5;
        }
      }
    }
  }
  
  .philosophy-section {
    padding: 0;
    margin-bottom: 20px;
    
    .philosophy-content {
      display: flex;
      background-color: var(--el-fill-color-lighter);
      border-radius: 16px;
      overflow: hidden;
      border: 1px solid var(--el-border-color-lighter);

      @media (max-width: 992px) {
        flex-direction: column;
      }

      .philosophy-text {
        padding: 50px 40px;
        width: 60%;

        @media (max-width: 992px) {
          width: 100%;
          padding: 30px 20px;
        }

        h3 {
          font-size: 24px;
          font-weight: 600;
          margin-bottom: 20px;
          color: var(--el-text-color-primary);
        }

        .highlight-text {
          font-size: 20px;
          font-weight: 500;
          color: var(--el-color-primary);
          margin-bottom: 15px;
          position: relative;
          display: inline-block;
          padding-bottom: 10px;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 80px;
            height: 3px;
            background-color: var(--el-color-primary);
            border-radius: 3px;
          }
        }

        .detail-text {
          color: var(--el-text-color-regular);
          line-height: 1.7;
          margin-bottom: 30px;
        }
        
        .philosophy-stats {
          display: flex;
          gap: 30px;
          
          @media (max-width: 767px) {
            flex-direction: column;
            gap: 20px;
          }
          
          .stat-item {
            .stat-number {
              font-size: 36px;
              font-weight: 700;
              color: #1677FF;
              margin-bottom: 5px;
              
              span {
                font-size: 20px;
                font-weight: 600;
              }
            }
            
            .stat-label {
              font-size: 14px;
              color: var(--el-text-color-regular);
            }
          }
        }
      }
      
      .philosophy-image {
        width: 40%;
        position: relative;
        overflow: hidden;
        
        @media (max-width: 992px) {
          width: 100%;
          height: 300px;
        }
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .image-decoration {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
          pointer-events: none;
          
          .decoration-circle {
            position: absolute;
            width: 150px;
            height: 150px;
            border-radius: 50%;
            border: 15px solid rgba(255, 255, 255, 0.2);
            bottom: -50px;
            right: -50px;
          }
        }
      }
    }
  }

}
</style>
