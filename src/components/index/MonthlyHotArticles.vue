<template>
  <div class="monthly-hot-section animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.1s;">
    <!-- 优化的标题区域 -->
    <div class="section-header animate__animated animate__fadeInDown animate__faster" style="animation-delay: 0.2s;">
      <h3 class="section-title">
        <span class="title-icon">
          <i class="fas fa-fire"></i>
        </span>
        <span class="title-text">本月热门</span>
        <span class="title-decoration"></span>
      </h3>
      <p class="section-subtitle">最受欢迎的技术文章</p>
    </div>

    <!-- 文章列表 -->
    <div class="hot-articles-list">
      <div
        class="article-item animate__animated animate__fadeInLeft animate__faster"
        v-for="(article, index) in monthlyHotArticles"
        :key="article.id"
        :style="`animation-delay: ${0.3 + index * 0.08}s`"
        @click="handleArticleClick(article.id)"
      >
        <!-- 精致的排名徽章 -->
        <div class="rank-badge" :class="`rank-${index + 1}`">
          <span class="rank-number">{{ index + 1 }}</span>
          <div class="rank-decoration" v-if="index < 3">
            <i v-if="index === 0" class="fas fa-crown"></i>
            <i v-else-if="index === 1" class="fas fa-medal"></i>
            <i v-else-if="index === 2" class="fas fa-trophy"></i>
          </div>
        </div>

        <!-- 文章内容 -->
        <div class="article-content">
          <h4 class="article-title">{{ article.title }}</h4>
          <div class="article-meta">
            <span class="meta-item">
              <i class="fas fa-eye"></i>
              <span>{{ article.views }}</span>
            </span>
            <span class="meta-divider">·</span>
            <span class="meta-item">
              <i class="fas fa-clock"></i>
              <span>{{ getRelativeTime(article.publishTime) }}</span>
            </span>
          </div>
        </div>

        <!-- 趋势指示器 -->
        <div class="trending-indicator" v-if="index < 3">
          <i class="fas fa-arrow-trend-up"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" name="MonthlyHotArticles">
import { ref } from 'vue';

// 定义组件属性
interface HotArticle {
  id: number;
  title: string;
  views: string;
  publishTime?: string;
}

// 定义事件
const emit = defineEmits<{
  articleClick: [articleId: number]
}>();

// 热门文章数据
const monthlyHotArticles = ref<HotArticle[]>([
  { 
    id: 101, 
    title: '深入理解 Vite 核心构建原理与性能优化', 
    views: '2.5k',
    publishTime: '2024-01-05'
  },
  { 
    id: 102, 
    title: 'Vue 3 + TypeScript 项目最佳实践指南', 
    views: '1.9k',
    publishTime: '2024-01-03'
  },
  { 
    id: 103, 
    title: '现代 CSS 布局解决方案：Grid vs Flexbox', 
    views: '1.6k',
    publishTime: '2024-01-02'
  },
  { 
    id: 104, 
    title: '如何优化 Web 应用的首次加载速度', 
    views: '1.2k',
    publishTime: '2024-01-01'
  },
  { 
    id: 105, 
    title: '前端工程化：从入门到进阶完整指南', 
    views: '980',
    publishTime: '2023-12-30'
  }
]);

// 处理文章点击事件
const handleArticleClick = (articleId: number): void => {
  emit('articleClick', articleId);
};

// 获取相对时间
const getRelativeTime = (publishTime?: string): string => {
  if (!publishTime) return '最近';
  
  const now = new Date();
  const publishDate = new Date(publishTime);
  const diffTime = Math.abs(now.getTime() - publishDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 1) return '1天前';
  if (diffDays <= 7) return `${diffDays}天前`;
  if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}周前`;
  return `${Math.ceil(diffDays / 30)}月前`;
};
</script>

<style lang="less" scoped>
.monthly-hot-section {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-extra-light);
  border-radius: 12px; // 增加圆角
  padding: 24px;
  margin-bottom: 20px;
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
}

// 精美的标题区域
.section-header {
  margin-bottom: 16px;

  .section-title {
    font-size: 15px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin: 0 0 4px;
    display: flex;
    align-items: center;
    gap: 8px;
    position: relative;

    .title-icon {
      width: 22px;
      height: 22px;
      background: var(--el-color-danger-light-9);
      border-radius: 5px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-color-danger);
      font-size: 11px;
      flex-shrink: 0;
    }

    .title-text {
      font-weight: 600;
    }

    .title-decoration {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, var(--el-border-color-lighter) 0%, transparent 100%);
      margin-left: 8px;
    }
  }

  .section-subtitle {
    font-size: 11px;
    color: var(--el-text-color-secondary);
    margin: 0;
    margin-left: 30px;
    font-weight: 400;
  }
}

// 文章列表
.hot-articles-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.article-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  background: var(--el-fill-color-lighter);
  border-radius: 10px; // 增加圆角
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid var(--el-border-color-extra-light);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03); // 添加轻微阴影

  &:hover {
    background: var(--el-fill-color-light);
    transform: translateY(-1px) translateX(2px); // 组合变换效果
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.08);
    border-color: var(--el-color-primary-light-8);

    .article-title {
      color: var(--el-color-primary);
    }

    .rank-badge {
      transform: scale(1.08);
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
    }

    .trending-indicator {
      transform: scale(1.1);
      color: var(--el-color-success);
    }
  }

  &:active {
    transform: translateY(0) translateX(1px);
  }
}

// 精致的排名徽章 - 现代化立体设计
.rank-badge {
  position: relative;
  width: 28px;
  height: 28px;
  border-radius: 8px; // 增加圆角
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 12px;
  color: white;
  background: var(--el-color-primary);
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); // 添加阴影

  .rank-number {
    position: relative;
    z-index: 2;
  }

  .rank-decoration {
    position: absolute;
    top: -2px;
    right: -2px;
    width: 10px;
    height: 10px;
    background: var(--el-color-warning);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 5px;
    color: white;
  }

  // 前三名特殊样式 - 使用更淡的颜色
  &.rank-1 {
    background: var(--el-color-warning);
    
    .rank-decoration {
      background: var(--el-color-danger);
    }
  }

  &.rank-2 {
    background: var(--el-color-info);
    
    .rank-decoration {
      background: var(--el-color-warning);
    }
  }

  &.rank-3 {
    background: var(--el-color-success);
    
    .rank-decoration {
      background: var(--el-color-warning);
    }
  }
}

// 文章内容 - 调小字体
.article-content {
  flex: 1;
  min-width: 0;

  .article-title {
    font-size: 13px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin: 0 0 5px;
    line-height: 1.4;
    transition: color 0.2s ease;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .article-meta {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 10px;
    color: var(--el-text-color-secondary);

    .meta-item {
      display: flex;
      align-items: center;
      gap: 3px;

      i {
        font-size: 9px;
        color: var(--el-text-color-placeholder);
      }

      span {
        font-weight: 400;
      }
    }

    .meta-divider {
      color: var(--el-border-color);
      font-weight: normal;
      margin: 0 2px;
    }
  }
}

// 趋势指示器
.trending-indicator {
  color: var(--el-text-color-placeholder);
  font-size: 12px;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

// 响应式设计
@media (max-width: 768px) {
  .monthly-hot-section {
    padding: 16px;
    margin-bottom: 16px;
  }

  .section-header {
    margin-bottom: 14px;

    .section-title {
      font-size: 14px;

      .title-icon {
        width: 20px;
        height: 20px;
        font-size: 10px;
      }
    }

    .section-subtitle {
      font-size: 10px;
      margin-left: 28px;
    }
  }

  .hot-articles-list {
    gap: 8px;
  }

  .article-item {
    padding: 10px;
    gap: 10px;
  }

  .rank-badge {
    width: 22px;
    height: 22px;
    font-size: 10px;

    .rank-decoration {
      width: 9px;
      height: 9px;
      font-size: 4px;
    }
  }

  .article-content {
    .article-title {
      font-size: 12px;
      margin-bottom: 4px;
    }

    .article-meta {
      font-size: 9px;
      gap: 5px;

      .meta-item i {
        font-size: 8px;
      }
    }
  }

  .trending-indicator {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .monthly-hot-section {
    padding: 14px;
  }

  .section-header {
    margin-bottom: 12px;

    .section-title {
      font-size: 13px;

      .title-icon {
        width: 18px;
        height: 18px;
        font-size: 9px;
      }
    }

    .section-subtitle {
      font-size: 9px;
      margin-left: 26px;
    }
  }

  .article-item {
    padding: 8px;
    gap: 8px;
  }

  .rank-badge {
    width: 20px;
    height: 20px;
    font-size: 9px;

    .rank-decoration {
      width: 8px;
      height: 8px;
      font-size: 4px;
    }
  }

  .article-content {
    .article-title {
      font-size: 11px;
    }

    .article-meta {
      font-size: 8px;
    }
  }

  .trending-indicator {
    font-size: 10px;
  }
}
</style>