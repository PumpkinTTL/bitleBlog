<template>
  <!-- 使用 animate.css 动画，尽量不用自定义动画 -->
  <div class="sidebar-section animate__animated animate__fadeInUp animate__faster">
    <h3 class="section-title animate__animated animate__fadeInLeft animate__faster" style="animation-delay: 0.1s;">
      <span class="section-icon">
        <i class="fas fa-info-circle"></i>
      </span>
      关于本站
    </h3>
    <div class="about-content">
      <!-- 精简的头部信息 -->
      <div class="site-header animate__animated animate__fadeIn animate__faster" style="animation-delay: 0.2s;">
        <div class="site-brand">
          <span class="brand-icon">
            <i class="fas fa-code"></i>
          </span>
          <div class="brand-info">
            <h4 class="brand-name">源力矩阵</h4>
            <p class="brand-slogan">探索 · 学习 · 成长</p>
          </div>
        </div>
        <div class="site-badge">
          <i class="fas fa-award"></i>
          <span>能量聚合</span>
        </div>
      </div>

      <!-- 简介 -->
      <p class="site-description animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.3s;">
        专注于分享 Web 开发前沿技术、实用经验和深度思考的独立博客
      </p>

      <!-- 统计数据 - 精致紧凑版本 -->
      <div class="site-stats animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.4s;">
        <div class="stat-item animate__animated animate__zoomIn animate__faster" v-for="(stat, index) in statsData"
          :key="index" :style="`animation-delay: ${0.5 + index * 0.05}s`">
          <div class="stat-icon" :style="`background: ${stat.color}20; color: ${stat.color}`">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>

      <!-- 特色标签 -->
      <div class="feature-tags">
        <span class="feature-tag animate__animated animate__fadeInRight animate__faster"
          v-for="(feature, index) in siteFeatures" :key="index" :style="`animation-delay: ${0.65 + index * 0.05}s`">
          <i :class="feature.icon"></i>
          {{ feature.name }}
        </span>
      </div>

      <!-- 社交链接 -->
      <div class="social-links">
        <a v-for="(social, index) in socialLinks" :key="index" :href="social.url" target="_blank" :title="social.title"
          class="social-link animate__animated animate__bounceIn animate__faster"
          :style="`animation-delay: ${0.8 + index * 0.03}s`">
          <i :class="social.icon"></i>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 网站统计数据
const statsData = ref([
  { 
    value: '234', 
    label: '文章',
    icon: 'fas fa-file-alt',
    color: '#3b82f6'
  },
  { 
    value: '56', 
    label: '专题',
    icon: 'fas fa-layer-group',
    color: '#10b981'
  },
  { 
    value: '1.2k', 
    label: '阅读',
    icon: 'fas fa-eye',
    color: '#f59e0b'
  }
]);

// 网站特色功能
const siteFeatures = ref([
  {
    icon: 'fas fa-rocket',
    name: '前沿技术'
  },
  {
    icon: 'fas fa-lightbulb',
    name: '最佳实践'
  },
  {
    icon: 'fas fa-book',
    name: '深度教程'
  }
]);

// 社交链接
const socialLinks = ref([
  {
    url: '#',
    title: '本站源码',
    icon: 'fab fa-github'
  },
  {
    url: '#',
    title: 'RSS订阅',
    icon: 'fas fa-rss'
  },
  {
    url: '#',
    title: '联系我们',
    icon: 'fas fa-envelope'
  },
  {
    url: '#',
    title: '给我点赞',
    icon: 'fas fa-heart'
  }
]);
</script>

<style lang="less" scoped>
// 现代化立体卡片设计，使用 Element Plus 变量
.sidebar-section {
  background: var(--el-bg-color);
  padding: 24px;
  margin-bottom: 20px;
  border-radius: 12px; // 增加圆角
  border: 1px solid var(--el-border-color-extra-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06); // 添加立体阴影
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;

  // 添加微妙的光泽效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    opacity: 0.8;
  }

  &:hover {
    border-color: var(--el-color-primary-light-8);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px); // 悬浮效果
  }

  .section-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin: 0 0 16px;
    display: flex;
    align-items: center;
    gap: 8px;

    .section-icon {
      font-size: 16px;
      color: var(--el-color-primary);
    }
  }
}

.about-content {
  // 头部信息
  .site-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;

    .site-brand {
      display: flex;
      align-items: center;
      gap: 12px;

      .brand-icon {
        width: 36px;
        height: 36px;
        background: var(--el-color-primary-light-9);
        border-radius: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--el-color-primary);
        font-size: 16px;
      }

      .brand-info {
        .brand-name {
          font-size: 15px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin: 0 0 2px;
        }

        .brand-slogan {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin: 0;
        }
      }
    }

    .site-badge {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 5px 12px;
      background: linear-gradient(135deg, #ff7849 0%, #f39c12 100%);
      color: white;
      border-radius: 20px;
      font-size: 12px;
      font-weight: 500;
      box-shadow: 0 2px 6px rgba(243, 156, 18, 0.25);

      i {
        font-size: 11px;
      }
    }
  }

  // 简介
  .site-description {
    font-size: 13px;
    color: var(--el-text-color-regular);
    line-height: 1.6;
    margin: 0 0 20px;
    padding: 12px;
    background: var(--el-fill-color-lighter);
    border-radius: 8px;
  }

  // 统计数据 - 现代化立体设计
  .site-stats {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    margin-bottom: 20px;
    background: var(--el-fill-color-blank);
    border-radius: 10px; // 增加圆角
    border: 1px solid var(--el-border-color-extra-light);
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.03), inset 0 1px 0 rgba(255, 255, 255, 0.7); // 内嵌阴影效果

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
      transition: all 0.2s ease;

      &:hover {
        .stat-icon {
          transform: scale(1.05);
        }
        
        .stat-value {
          color: var(--el-color-primary);
        }
      }

      .stat-icon {
        width: 28px;
        height: 28px;
        border-radius: 8px; // 增加圆角
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        transition: all 0.3s ease;
        flex-shrink: 0;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // 添加阴影
      }

      .stat-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 1px;
        line-height: 1;

        .stat-value {
          font-size: 15px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          transition: color 0.2s ease;
        }

        .stat-label {
          font-size: 11px;
          color: var(--el-text-color-secondary);
        }
      }
    }
  }

  // 特色标签
  .feature-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;

    .feature-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 6px 12px;
      background: var(--el-fill-color-light);
      color: var(--el-text-color-regular);
      border-radius: 20px;
      font-size: 12px;
      transition: all 0.2s ease;

      i {
        font-size: 12px;
        color: var(--el-color-primary);
      }

      &:hover {
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }
    }
  }

  // 社交链接
  .social-links {
    display: flex;
    gap: 10px;

    .social-link {
      width: 40px;
      height: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: var(--el-fill-color-blank);
      border: 1px solid var(--el-border-color-extra-light);
      border-radius: 10px; // 增加圆角
      color: var(--el-text-color-regular);
      text-decoration: none;
      transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
      font-size: 16px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); // 添加轻微阴影

      &:hover {
        border-color: var(--el-color-primary);
        color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
        box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
        transform: translateY(-1px); // 悬浮效果
      }
    }
  }
}

// 暗色模式适配
@media (prefers-color-scheme: dark) {
  .about-content {
    .site-header {
      .site-badge {
        background: linear-gradient(135deg, #cc5f39 0%, #c2850e 100%);
        box-shadow: 0 2px 6px rgba(243, 156, 18, 0.15);
      }
    }
  }
}
</style>