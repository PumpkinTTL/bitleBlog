<template>
  <div class="article-footer-section animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.1s;">
    <!-- 热门标签模块 -->
    <div class="footer-module tags-module animate__animated animate__fadeInLeft animate__faster" style="animation-delay: 0.2s;">
      <h4 class="module-title">
        <i class="fas fa-tags"></i>
        <span>热门标签</span>
      </h4>
      <div class="tags-cloud">
        <span 
          class="tag-item"
          v-for="(tag, index) in hotTags.slice(0, 8)" 
          :key="tag.id"
          :class="'tag-level-' + tag.level"
          @click="handleTagClick(tag.id, tag.name)"
        >
          {{ tag.name }}
          <span class="tag-count">{{ tag.count }}</span>
        </span>
      </div>
    </div>

    <!-- 数据统计模块 -->
    <div class="footer-module stats-module animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.3s;">
      <h4 class="module-title">
        <i class="fas fa-chart-line"></i>
        <span>数据统计</span>
      </h4>
      <div class="stats-grid">
        <div class="stat-item" v-for="(stat, index) in siteStats" :key="index">
          <div class="stat-icon" :style="`background: ${stat.color}20; color: ${stat.color}`">
            <i :class="stat.icon"></i>
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stat.value }}</span>
            <span class="stat-label">{{ stat.label }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 快速导航模块 -->
    <div class="footer-module nav-module animate__animated animate__fadeInRight animate__faster" style="animation-delay: 0.4s;">
      <h4 class="module-title">
        <i class="fas fa-compass"></i>
        <span>快速导航</span>
      </h4>
      <div class="nav-links">
        <a 
          v-for="(link, index) in quickLinks" 
          :key="index"
          :href="link.url"
          class="nav-link"
          @click="handleNavClick(link.id, $event)"
        >
          <i :class="link.icon"></i>
          <span>{{ link.name }}</span>
        </a>
      </div>
    </div>

    <!-- 最新动态模块 -->
    <div class="footer-module activity-module animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.5s;">
      <h4 class="module-title">
        <i class="fas fa-bell"></i>
        <span>最新动态</span>
      </h4>
      <div class="activity-list">
        <div 
          v-for="(activity, index) in recentActivities.slice(0, 3)" 
          :key="activity.id"
          class="activity-item"
        >
          <div class="activity-icon">
            <i :class="activity.icon"></i>
          </div>
          <div class="activity-content">
            <span class="activity-text">{{ activity.text }}</span>
            <span class="activity-time">{{ activity.time }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 社交分享模块 -->
    <div class="footer-module social-module animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.6s;">
      <h4 class="module-title">
        <i class="fas fa-share-alt"></i>
        <span>关注我们</span>
      </h4>
      <div class="social-links">
        <a 
          v-for="(social, index) in socialLinks" 
          :key="index"
          :href="social.url"
          class="social-link"
          :title="social.name"
        >
          <i :class="social.icon"></i>
        </a>
      </div>
      <div class="qr-code">
        <div class="qr-placeholder">
          <i class="fas fa-qrcode"></i>
          <span>微信公众号</span>
        </div>
      </div>
    </div>

    <!-- 底部装饰线 -->
    <div class="footer-decoration animate__animated animate__fadeIn animate__faster" style="animation-delay: 0.7s;">
      <div class="decoration-line"></div>
      <div class="decoration-text">
        <i class="fas fa-heart"></i>
        <span>感谢您的阅读</span>
      </div>
      <div class="decoration-line"></div>
    </div>
  </div>
</template>

<script setup lang="ts" name="ArticleFooterSection">
import { ref } from 'vue';

// 定义事件
const emit = defineEmits<{
  tagClick: [tagId: number, tagName: string]
  navClick: [linkId: number, url: string]
}>();

// 热门标签数据
const hotTags = ref([
  { id: 1, name: 'Vue.js', count: '1.2k', level: 3 },
  { id: 2, name: 'React', count: '980', level: 3 },
  { id: 3, name: 'TypeScript', count: '856', level: 2 },
  { id: 4, name: 'JavaScript', count: '2.1k', level: 3 },
  { id: 5, name: 'Node.js', count: '742', level: 2 },
  { id: 6, name: 'CSS', count: '634', level: 2 },
  { id: 7, name: 'Webpack', count: '521', level: 1 },
  { id: 8, name: 'Vite', count: '489', level: 1 }
]);

// 站点统计数据
const siteStats = ref([
  { icon: 'fas fa-file-alt', value: '1.2k+', label: '文章总数', color: '#409eff' },
  { icon: 'fas fa-eye', value: '50k+', label: '总阅读量', color: '#67c23a' },
  { icon: 'fas fa-users', value: '5k+', label: '访问用户', color: '#e6a23c' },
  { icon: 'fas fa-calendar-day', value: '365', label: '运行天数', color: '#f56c6c' }
]);

// 快速导航链接
const quickLinks = ref([
  { id: 1, name: '首页', icon: 'fas fa-home', url: '/' },
  { id: 2, name: '归档', icon: 'fas fa-archive', url: '/archive' },
  { id: 3, name: '分类', icon: 'fas fa-folder', url: '/categories' },
  { id: 4, name: '标签', icon: 'fas fa-tags', url: '/tags' },
  { id: 5, name: '关于', icon: 'fas fa-user', url: '/about' },
  { id: 6, name: '友链', icon: 'fas fa-link', url: '/links' }
]);

// 最新动态
const recentActivities = ref([
  { id: 1, icon: 'fas fa-plus', text: '发布了新文章《Vue3实战指南》', time: '2小时前' },
  { id: 2, icon: 'fas fa-edit', text: '更新了《TypeScript进阶》', time: '1天前' },
  { id: 3, icon: 'fas fa-comment', text: '回复了读者评论', time: '2天前' }
]);

// 社交链接
const socialLinks = ref([
  { name: 'GitHub', icon: 'fab fa-github', url: '#' },
  { name: '微博', icon: 'fab fa-weibo', url: '#' },
  { name: 'Twitter', icon: 'fab fa-twitter', url: '#' },
  { name: 'RSS', icon: 'fas fa-rss', url: '#' }
]);

// 处理标签点击
const handleTagClick = (tagId: number, tagName: string): void => {
  emit('tagClick', tagId, tagName);
};

// 处理导航点击
const handleNavClick = (linkId: number, event: Event): void => {
  event.preventDefault();
  const target = event.currentTarget as HTMLAnchorElement;
  emit('navClick', linkId, target.href);
};
</script>

<style lang="less" scoped>
.article-footer-section {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  padding: 20px;
  margin-top: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;

  &:hover {
    border-color: var(--el-border-color);
  }
}

// 模块通用样式
.footer-module {
  .module-title {
    font-size: 13px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 12px;
    display: flex;
    align-items: center;
    gap: 6px;

    i {
      font-size: 12px;
      color: var(--el-color-primary);
    }
  }
}

// 标签模块
.tags-module {
  .tags-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    .tag-item {
      display: inline-flex;
      align-items: center;
      gap: 3px;
      padding: 4px 8px;
      background: var(--el-fill-color-lighter);
      border-radius: 12px;
      font-size: 10px;
      color: var(--el-text-color-regular);
      cursor: pointer;
      transition: all 0.2s ease;

      .tag-count {
        font-size: 9px;
        color: var(--el-text-color-secondary);
        background: var(--el-fill-color-light);
        padding: 1px 3px;
        border-radius: 6px;
      }

      &:hover {
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
      }

      &.tag-level-3 {
        font-size: 11px;
        font-weight: 500;
        padding: 5px 9px;
      }

      &.tag-level-2 {
        font-size: 10px;
        padding: 4px 8px;
      }

      &.tag-level-1 {
        font-size: 9px;
        padding: 3px 7px;
        opacity: 0.8;
      }
    }
  }
}

// 统计模块
.stats-module {
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px;
      background: var(--el-fill-color-lighter);
      border-radius: 6px;
      transition: all 0.2s ease;

      &:hover {
        background: var(--el-fill-color-light);
        transform: translateY(-1px);
      }

      .stat-icon {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        flex-shrink: 0;
      }

      .stat-info {
        display: flex;
        flex-direction: column;
        gap: 1px;

        .stat-value {
          font-size: 12px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          line-height: 1;
        }

        .stat-label {
          font-size: 9px;
          color: var(--el-text-color-secondary);
          line-height: 1;
        }
      }
    }
  }
}

// 导航模块
.nav-module {
  .nav-links {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 6px;

    .nav-link {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      background: var(--el-fill-color-lighter);
      border-radius: 6px;
      font-size: 10px;
      color: var(--el-text-color-regular);
      text-decoration: none;
      transition: all 0.2s ease;

      i {
        font-size: 9px;
        color: var(--el-color-primary);
        width: 12px;
      }

      &:hover {
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        transform: translateX(2px);
      }
    }
  }
}

// 动态模块
.activity-module {
  .activity-list {
    display: flex;
    flex-direction: column;
    gap: 8px;

    .activity-item {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      padding: 6px;
      background: var(--el-fill-color-lighter);
      border-radius: 6px;

      .activity-icon {
        width: 16px;
        height: 16px;
        background: var(--el-color-success-light-9);
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--el-color-success);
        font-size: 8px;
        flex-shrink: 0;
        margin-top: 1px;
      }

      .activity-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 2px;

        .activity-text {
          font-size: 10px;
          color: var(--el-text-color-regular);
          line-height: 1.3;
        }

        .activity-time {
          font-size: 9px;
          color: var(--el-text-color-placeholder);
        }
      }
    }
  }
}

// 社交模块
.social-module {
  .social-links {
    display: flex;
    gap: 8px;
    margin-bottom: 12px;

    .social-link {
      width: 28px;
      height: 28px;
      background: var(--el-fill-color-lighter);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-text-color-regular);
      text-decoration: none;
      transition: all 0.2s ease;
      font-size: 12px;

      &:hover {
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        transform: translateY(-1px);
      }
    }
  }

  .qr-code {
    .qr-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 4px;
      padding: 12px;
      background: var(--el-fill-color-lighter);
      border-radius: 6px;
      border: 1px dashed var(--el-border-color-lighter);

      i {
        font-size: 16px;
        color: var(--el-text-color-placeholder);
      }

      span {
        font-size: 9px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

// 底部装饰
.footer-decoration {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-lighter);

  .decoration-line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, transparent 0%, var(--el-border-color-lighter) 50%, transparent 100%);
  }

  .decoration-text {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 10px;
    color: var(--el-text-color-secondary);

    i {
      color: var(--el-color-danger);
      font-size: 9px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .article-footer-section {
    grid-template-columns: 1fr;
    gap: 16px;
    padding: 16px;
  }

  .stats-module .stats-grid {
    grid-template-columns: 1fr;
  }

  .nav-module .nav-links {
    grid-template-columns: repeat(3, 1fr);
  }

  .social-module .social-links {
    justify-content: center;
  }
}

@media (max-width: 480px) {
  .article-footer-section {
    padding: 14px;
  }

  .nav-module .nav-links {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>