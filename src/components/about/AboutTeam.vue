<template>
  <div class="about-team">
    <!-- 页面标题部分 - 统一使用animate.css -->
    <div class="section-header animate__animated animate__fadeInUp">
      <div class="section-icon animate__animated animate__bounceIn animate__faster">
        <i class="fas fa-users"></i>
      </div>
      <h2 class="section-title animate__animated animate__fadeInUp animate__faster">我们的团队</h2>
      <p class="section-desc animate__animated animate__fadeInUp animate__faster">一群热爱技术、充满激情的创造者</p>
    </div>

    <!-- 团队介绍 -->
    <div class="team-intro animate__animated animate__zoomIn animate__faster">
      <div class="intro-text">
        <p>我们是一支年轻且富有活力的团队，来自不同的技术背景和专业领域。我们热爱编程，热爱设计，更热爱创造能够帮助他人的产品。在这里，我们秉持开放、协作、创新的精神，致力于打造最好用的博客系统。</p>
      </div>
      <div class="intro-stats">
        <div class="stat-item animate__animated animate__fadeInUp" style="animation-delay: 0.1s;">
          <div class="stat-value">15+</div>
          <div class="stat-label">团队成员</div>
        </div>
        <div class="stat-item animate__animated animate__fadeInUp" style="animation-delay: 0.15s;">
          <div class="stat-value">7+</div>
          <div class="stat-label">技术栈</div>
        </div>
        <div class="stat-item animate__animated animate__fadeInUp" style="animation-delay: 0.2s;">
          <div class="stat-value">5+</div>
          <div class="stat-label">国家/地区</div>
        </div>
      </div>
    </div>

    <!-- 团队精神 -->
    <div class="team-spirit">
      <div class="spirit-card animate__animated animate__fadeInUp">
        <div class="card-icon">
          <i class="fas fa-heart"></i>
        </div>
        <h3>热爱技术</h3>
        <p>我们对技术充满热情，不断探索和学习前沿技术，将其应用到实际开发中</p>
      </div>
      <div class="spirit-card animate__animated animate__fadeInUp" style="animation-delay: 0.05s;">
        <div class="card-icon">
          <i class="fas fa-handshake"></i>
        </div>
        <h3>团队协作</h3>
        <p>我们注重团队协作，相互学习、相互成长，共同为用户创造更好的产品</p>
      </div>
      <div class="spirit-card animate__animated animate__fadeInUp" style="animation-delay: 0.1s;">
        <div class="card-icon">
          <i class="fas fa-user-tie"></i>
        </div>
        <h3>专业态度</h3>
        <p>我们对每一行代码、每一个设计细节都充满热忱，追求极致的用户体验</p>
      </div>
    </div>

    <!-- 团队成员展示 -->
    <div class="team-members animate__animated animate__fadeInUp animate__faster">
      <h3 class="members-title">核心团队成员</h3>
      <div class="members-grid">
        <div class="member-card animate__animated animate__fadeInUp" :class="{ 'highlight': member.isFounder }"
          v-for="(member, index) in teamMembers" :key="index" :style="`animation-delay: ${0.1 + index * 0.05}s;`">
          <div class="member-avatar">
            <img :src="member.avatar" :alt="member.name">
            <div class="member-social">
              <a href="#" class="social-icon" v-if="member.github"><i class="fab fa-github"></i></a>
              <a href="#" class="social-icon" v-if="member.twitter"><i class="fab fa-twitter"></i></a>
              <a href="#" class="social-icon" v-if="member.linkedin"><i class="fab fa-linkedin"></i></a>
            </div>
          </div>
          <div class="member-info">
            <div class="founder-badge" v-if="member.isFounder">创始人</div>
            <h3 class="member-name">{{ member.name }}</h3>
            <p class="member-title">{{ member.title }}</p>
            <p class="member-desc">{{ member.description }}</p>
            <div class="member-skills" v-if="member.skills">
              <span class="skill-tag" v-for="(skill, skillIndex) in member.skills" :key="skillIndex">
                {{ skill }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 招聘信息 -->
    <div class="join-team animate__animated animate__zoomIn animate__faster">
      <div class="join-header">
        <div class="header-icon">
          <i class="fas fa-rocket"></i>
        </div>
        <h3>加入我们</h3>
        <p>我们始终在寻找优秀的人才加入团队</p>
      </div>

      <div class="positions">
        <div class="position-item animate__animated animate__fadeInUp" v-for="(position, index) in openPositions"
          :key="index" :style="`animation-delay: ${0.1 + index * 0.05}s;`">
          <div class="position-header">
            <h4>{{ position.title }}</h4>
            <span class="position-type">{{ position.type }}</span>
          </div>
          <p class="position-desc">{{ position.description }}</p>
          <div class="position-requirements">
            <h5>要求：</h5>
            <ul>
              <li v-for="(req, reqIndex) in position.requirements" :key="reqIndex">{{ req }}</li>
            </ul>
          </div>
          <div class="position-footer">
            <button class="apply-btn">申请职位</button>
            <span class="position-location"><i class="fas fa-map-marker-alt"></i> {{ position.location }}</span>
          </div>
        </div>
      </div>

      <div class="join-outro animate__animated animate__fadeInUp" style="animation-delay: 0.2s;">
        <p>没有看到合适的职位？发送您的简历至 <a href="mailto:careers@bitle.com">careers@bitle.com</a></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

// 团队成员数据
const teamMembers = ref([
  {
    name: '陈天明',
    title: '创始人 & CEO',
    description: '拥有10年互联网产品经验，曾就职于阿里巴巴和腾讯，负责多个千万级用户产品。对用户体验和产品设计有独到见解。',
    avatar: 'https://picsum.photos/id/1015/300/300',
    github: true,
    twitter: true,
    linkedin: true,
    isFounder: true,
    skills: ['产品设计', '战略规划', '团队管理']
  },
  {
    name: '李雨辰',
    title: '技术负责人',
    description: '全栈开发工程师，精通Vue、React和Node.js，拥有丰富的大型应用开发经验，热衷于新技术探索和性能优化。',
    avatar: 'https://picsum.photos/id/1012/300/300',
    github: true,
    linkedin: true,
    skills: ['Vue.js', 'Node.js', '系统架构']
  },
  {
    name: '张梦琪',
    title: 'UI/UX设计师',
    description: '毕业于中央美术学院，有5年UI设计经验，专注于用户体验和界面美学，作品曾获得多个设计奖项。',
    avatar: 'https://picsum.photos/id/1027/300/300',
    twitter: true,
    linkedin: true,
    skills: ['UI设计', 'Figma', '交互设计']
  },
  {
    name: '王浩然',
    title: '前端开发工程师',
    description: '3年Vue开发经验，对响应式设计和交互体验有深入研究，热爱开源社区，是多个流行前端库的贡献者。',
    avatar: 'https://picsum.photos/id/1005/300/300',
    github: true,
    skills: ['Vue.js', 'CSS', '前端性能优化']
  },
  {
    name: '刘晓峰',
    title: '后端开发工程师',
    description: '专注于高并发系统架构设计，精通Java和Python，有丰富的数据库优化和系统安全经验。',
    avatar: 'https://picsum.photos/id/1010/300/300',
    github: true,
    linkedin: true,
    skills: ['Java', 'Python', '数据库']
  },
  {
    name: '赵雪琳',
    title: '市场运营专员',
    description: '拥有丰富的互联网产品运营和市场推广经验，善于用户洞察和数据分析，曾成功策划多个百万级用户活动。',
    avatar: 'https://picsum.photos/id/1001/300/300',
    twitter: true,
    linkedin: true,
    skills: ['市场营销', '用户增长', '数据分析']
  }
]);

// 招聘职位
const openPositions = ref([
  {
    title: '高级前端开发工程师',
    type: '全职',
    location: '深圳',
    description: '负责公司核心产品的前端开发和优化，参与产品设计和技术方案讨论。',
    requirements: [
      '3年以上前端开发经验，熟悉Vue.js/React等主流框架',
      '对用户体验和页面性能优化有深入理解',
      '有优秀的代码风格和架构设计能力',
      '具有良好的沟通能力和团队协作精神'
    ]
  },
  {
    title: 'UI/UX设计师',
    type: '全职',
    location: '深圳/远程',
    description: '负责产品的用户界面和交互设计，打造优秀的视觉体验和用户旅程。',
    requirements: [
      '2年以上互联网产品UI/UX设计经验',
      '精通Figma、Sketch等设计工具',
      '具有良好的视觉设计能力和审美水平',
      '了解前端开发流程，能有效与开发团队协作'
    ]
  }
]);
</script>

<style scoped lang="less">
.about-team {
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

  .team-intro {
    background-color: var(--el-bg-color);
    border-radius: 16px;
    padding: 40px;
    box-shadow: var(--el-box-shadow);
    border: 1px solid var(--el-border-color-lighter);
    margin-bottom: 40px;

    @media (max-width: 767px) {
      padding: 30px 20px;
    }

    .intro-text {
      max-width: 800px;
      margin: 0 auto 30px;
      text-align: center;

      p {
        font-size: 16px;
        line-height: 1.8;
        color: var(--el-text-color-regular);
      }
    }

    .intro-stats {
      display: flex;
      justify-content: center;
      gap: 60px;

      @media (max-width: 767px) {
        gap: 30px;
        flex-wrap: wrap;
      }

      .stat-item {
        text-align: center;

        .stat-value {
          font-size: 36px;
          font-weight: 700;
          color: var(--el-color-primary);
          margin-bottom: 5px;
          position: relative;
          display: inline-block;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translateX(-50%);
            width: 30px;
            height: 3px;
            background-color: var(--el-color-primary-light-7);
            border-radius: 3px;
          }
        }

        .stat-label {
          font-size: 14px;
          color: var(--el-text-color-regular);
        }
      }
    }
  }
  
  .team-spirit {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 25px;
    margin-bottom: 50px;

    @media (max-width: 992px) {
      grid-template-columns: 1fr;
    }

    .spirit-card {
      background-color: var(--el-bg-color);
      border-radius: 16px;
      padding: 30px;
      box-shadow: var(--el-box-shadow);
      border: 1px solid var(--el-border-color-lighter);
      text-align: center;
      transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

      &:hover {
        transform: translateY(-3px);
        box-shadow: var(--el-box-shadow-dark);
        border-color: var(--el-color-primary-light-5);
      }

      .card-icon {
        width: 70px;
        height: 70px;
        border-radius: 20px;
        margin: 0 auto 20px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
        box-shadow: 0 10px 20px var(--el-color-primary-light-8);

        i {
          font-size: 30px;
          color: var(--el-color-white);
        }
      }

      h3 {
        font-size: 20px;
        font-weight: 600;
        margin-bottom: 15px;
        color: var(--el-text-color-primary);
      }

      p {
        color: var(--el-text-color-regular);
        line-height: 1.6;
        margin: 0;
      }
    }
  }
  
  .team-members {
    margin-bottom: 50px;

    .members-title {
      text-align: center;
      font-size: 24px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 30px;
      position: relative;
      display: inline-block;
      left: 50%;
      transform: translateX(-50%);

      &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        right: 0;
        height: 3px;
        background: linear-gradient(to right, transparent, var(--el-color-primary), transparent);
        border-radius: 3px;
      }
    }

    .members-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 30px;

      @media (max-width: 992px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @media (max-width: 576px) {
        grid-template-columns: 1fr;
      }

      .member-card {
        background-color: var(--el-bg-color);
        border-radius: 16px;
        overflow: hidden;
        box-shadow: var(--el-box-shadow);
        border: 1px solid var(--el-border-color-lighter);
        transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
        position: relative;

        &.highlight {
          border: 2px solid var(--el-color-primary);
        }

        &:hover {
          transform: translateY(-3px);
          box-shadow: var(--el-box-shadow-dark);
          border-color: var(--el-color-primary-light-5);

          .member-avatar .member-social {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .member-avatar {
          position: relative;
          height: 240px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s cubic-bezier(0.215, 0.61, 0.355, 1);
          }
          
          .member-social {
            position: absolute;
            bottom: 0;
            left: 0;
            right: 0;
            display: flex;
            justify-content: center;
            gap: 12px;
            padding: 20px 0;
            background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
            
            .social-icon {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background-color: #fff;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #333;
              transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);
              
              &:hover {
                transform: translateY(-2px);
              }
              
              i {
                font-size: 18px;
              }
            }
          }
        }
        
        .member-info {
          padding: 25px;
          position: relative;

          .founder-badge {
            position: absolute;
            top: -12px;
            right: 20px;
            background: linear-gradient(135deg, var(--el-color-warning), var(--el-color-danger));
            color: var(--el-color-white);
            font-size: 12px;
            font-weight: 600;
            padding: 5px 15px;
            border-radius: 20px;
            box-shadow: 0 5px 15px var(--el-color-danger-light-8);
          }

          .member-name {
            font-size: 20px;
            font-weight: 600;
            margin-bottom: 5px;
            color: var(--el-text-color-primary);
          }

          .member-title {
            font-size: 14px;
            color: var(--el-color-primary);
            font-weight: 500;
            margin-bottom: 15px;
          }

          .member-desc {
            font-size: 14px;
            line-height: 1.6;
            color: var(--el-text-color-regular);
            margin-bottom: 15px;
          }

          .member-skills {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;

            .skill-tag {
              font-size: 12px;
              color: var(--el-color-primary);
              background-color: var(--el-color-primary-light-9);
              padding: 4px 10px;
              border-radius: 20px;
            }
          }
        }
      }
    }
  }
  
  .join-team {
    background-color: var(--el-bg-color);
    border-radius: 16px;
    padding: 40px;
    box-shadow: var(--el-box-shadow);
    border: 1px solid var(--el-border-color-lighter);

    @media (max-width: 767px) {
      padding: 30px 20px;
    }

    .join-header {
      text-align: center;
      margin-bottom: 40px;

      .header-icon {
        width: 70px;
        height: 70px;
        border-radius: 20px;
        background: linear-gradient(135deg, var(--el-color-danger), var(--el-color-warning));
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto 20px;
        box-shadow: 0 10px 20px var(--el-color-danger-light-8);

        i {
          font-size: 30px;
          color: var(--el-color-white);
        }
      }

      h3 {
        font-size: 24px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 10px;
      }

      p {
        font-size: 16px;
        color: var(--el-text-color-regular);
        max-width: 500px;
        margin: 0 auto;
      }
    }
    
    .positions {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 30px;
      margin-bottom: 40px;
      
      @media (max-width: 992px) {
        grid-template-columns: 1fr;
      }
      
      .position-item {
        background-color: var(--el-fill-color-lighter);
        border-radius: 16px;
        padding: 30px;
        border: 1px solid var(--el-border-color-light);
        transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

        &:hover {
          transform: translateY(-3px);
          box-shadow: var(--el-box-shadow-dark);
          border-color: var(--el-color-primary-light-5);

          .position-header h4 {
            color: var(--el-color-primary);
          }
        }

        .position-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;

          h4 {
            font-size: 18px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            transition: color 0.3s ease;
          }

          .position-type {
            font-size: 12px;
            font-weight: 500;
            color: var(--el-color-white);
            background: linear-gradient(135deg, var(--el-color-danger), var(--el-color-warning));
            padding: 5px 12px;
            border-radius: 20px;
            box-shadow: 0 5px 10px var(--el-color-danger-light-8);
          }
        }

        .position-desc {
          font-size: 14px;
          line-height: 1.6;
          color: var(--el-text-color-regular);
          margin-bottom: 20px;
        }

        .position-requirements {
          margin-bottom: 25px;

          h5 {
            font-size: 15px;
            font-weight: 600;
            margin-bottom: 12px;
            color: var(--el-text-color-primary);
          }

          ul {
            padding-left: 20px;

            li {
              font-size: 14px;
              color: var(--el-text-color-regular);
              margin-bottom: 8px;
              line-height: 1.5;

              &:last-child {
                margin-bottom: 0;
              }
            }
          }
        }
        
        .position-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;

          .apply-btn {
            width: auto;
            background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
            color: var(--el-color-white);
            border: none;
            border-radius: 8px;
            padding: 10px 20px;
            font-size: 15px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.215, 0.61, 0.355, 1);

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 15px var(--el-color-primary-light-7);
            }
          }

          .position-location {
            font-size: 14px;
            color: var(--el-text-color-regular);

            i {
              color: var(--el-color-primary);
              margin-right: 5px;
            }
          }
        }
      }
    }

    .join-outro {
      text-align: center;

      p {
        font-size: 15px;
        color: var(--el-text-color-regular);

        a {
          color: var(--el-color-primary);
          font-weight: 500;
          text-decoration: none;
          transition: all 0.3s ease;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}
</style>
