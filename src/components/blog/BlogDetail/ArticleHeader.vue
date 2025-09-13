<template>
  <div class="article-header animate__animated animate__fadeIn">
    <!-- 文章封面图 -->
    <div v-if="article.cover_image" class="cover-image-container">
      <img :src="article.cover_image" :alt="article.title" class="cover-image">
      <div class="image-overlay"></div>
    </div>
    
    <!-- 文章标题区 -->
    <div class="title-container" :class="{'with-cover': article.cover_image}">
      <div class="article-meta">
        <div class="category-tag" v-if="article.category">
          <i class="fas fa-folder"></i>
          {{ article.category.name }}
        </div>
        
        <div class="article-badges">
          <span v-if="article.is_top === 1" class="badge top-badge">
            <i class="fas fa-thumbtack"></i> 置顶
          </span>
          <span v-if="article.is_recommend === 1" class="badge recommend-badge">
            <i class="fas fa-star"></i> 推荐
          </span>
          <span v-if="article.is_original === 1" class="badge original-badge">
            <i class="fas fa-copyright"></i> 原创
          </span>
        </div>
      </div>
      
      <h1 class="article-title animate__animated animate__fadeInUp" style="animation-delay: 0.1s;">
        {{ article.title }}
      </h1>

      <div class="article-subtitle animate__animated animate__fadeInUp" style="animation-delay: 0.2s;" v-if="article.subtitle">
        {{ article.subtitle }}
      </div>

      <div class="article-info animate__animated animate__fadeInUp" style="animation-delay: 0.3s;">
        <div class="author-info">
          <a-avatar :size="40" :src="article.author?.avatar" class="animate__animated animate__zoomIn" style="animation-delay: 0.4s;" />
          <div class="author-details">
            <div class="author-name animate__animated animate__fadeInLeft" style="animation-delay: 0.5s;" :class="getAuthorClass(article.author)">
              {{ article.author?.username || article.author?.nickname }}
              <i v-if="isGoldMember(article.author)" class="fas fa-crown gold-icon animate__animated animate__pulse animate__infinite"></i>
            </div>
            <div class="author-bio animate__animated animate__fadeInLeft" style="animation-delay: 0.6s;" v-if="article.author?.signature">
              {{ article.author?.signature }}
            </div>
          </div>
        </div>

        <div class="publish-info">
          <div class="publish-time animate__animated animate__fadeInRight" style="animation-delay: 0.4s;">
            <i class="fas fa-calendar-alt"></i>
            {{ formatDate(article.publish_time) }}
          </div>

          <div class="reading-info animate__animated animate__fadeInRight" style="animation-delay: 0.5s;">
            <i class="fas fa-book-reader"></i>
            {{ article.read_time ? `${article.read_time}分钟阅读` : '预计5分钟阅读' }}
          </div>

          <div class="view-count animate__animated animate__fadeInRight" style="animation-delay: 0.6s;">
            <i class="fas fa-eye"></i>
            {{ article.views || 0 }} 阅读
          </div>
        </div>
      </div>
      
      <!-- AI摘要组件 - 可折叠 -->
      <div class="ai-summary-container animate__animated animate__fadeIn">
        <div class="ai-summary-inner">
          <div class="ai-header" @click="toggleAiSummary">
            <div class="ai-badge">
              <i class="fas fa-robot"></i> AI 摘要
            </div>
            <div class="ai-collapse" :class="{ 'collapsed': !aiSummaryExpanded }">
              <i class="fas fa-chevron-up"></i>
            </div>
          </div>
          <transition name="ai-collapse" @enter="onEnter" @leave="onLeave">
            <div class="ai-content" v-show="aiSummaryExpanded">
              <p class="ai-description">
                该文章详细介绍了如何在不修改现有Vue项目代码的情况下，通过使用Puppeteer实现服务器端渲染（SSR）来优化SEO。文章首先分析了Vue单页面应用在SEO方面的不足，并对比了几种常见的SSR方案，最终选择了Puppeteer作为解决方案。接着，文章逐步指导如何安装Node.js、Puppeteer及相关工具，并提供了详细的脚本代码和配置步骤，包括创建服务器端运行脚本、优化Puppeteer性能、配置Nginx等。最后，文章通过测试展示了配置成功后的效果，帮助开发者轻松实现Vue项目的SEO优化。
              </p>
              <div class="ai-footer">
                <span class="ai-source">
                  <i class="fas fa-sparkles"></i>
                  摘要由AI智能生成
                </span>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, ref } from 'vue';

// AI摘要折叠状态
const aiSummaryExpanded = ref(true);

// 定义文章类型
interface Author {
  id?: number;
  username?: string;
  nickname?: string;
  avatar?: string;
  signature?: string;
  memberClass?: string;
  roles?: any[];
}

interface Category {
  id: number;
  name: string;
  slug?: string;
}

interface Article {
  id?: number;
  title?: string;
  subtitle?: string;
  content?: string;
  cover_image?: string;
  publish_time?: string;
  views?: number;
  read_time?: number;
  is_top?: number;
  is_recommend?: number;
  is_original?: number;
  author?: Author;
  category?: Category;
}

const props = defineProps<{
  article: Article;
}>();

// AI摘要折叠切换
const toggleAiSummary = () => {
  aiSummaryExpanded.value = !aiSummaryExpanded.value;
};

// 折叠动画钩子
const onEnter = (el: HTMLElement) => {
  el.style.height = '0';
  el.style.overflow = 'hidden';
  el.offsetHeight; // 触发重排
  el.style.transition = 'height 0.3s ease';
  el.style.height = el.scrollHeight + 'px';
};

const onLeave = (el: HTMLElement) => {
  el.style.height = el.scrollHeight + 'px';
  el.style.overflow = 'hidden';
  el.offsetHeight; // 触发重排
  el.style.transition = 'height 0.3s ease';
  el.style.height = '0';
};

// 格式化日期
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  // 尝试转换为Date对象
  const date = new Date(dateString);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return dateString.split(' ')[0]; // 如果转换失败，返回原始日期的日期部分
  }
  
  // 格式化为 "YYYY-MM-DD"
  return date.toISOString().split('T')[0];
};

// 获取作者的样式类
const getAuthorClass = (author?: Author): string => {
  if (!author) return '';
  
  // 如果有roles数组，则查找show_weight最高的角色
  if (author.roles && author.roles.length > 0) {
    // 按show_weight降序排序
    const sortedRoles = [...author.roles].sort((a, b) => b.show_weight - a.show_weight);
    const highestRole = sortedRoles[0];
    
    // 根据最高权重角色名称返回对应的样式
    const roleName = highestRole.name.toLowerCase();
    
    // 角色名称与样式对应关系
    if (roleName.includes('超级管理员')) return 'text-super-admin';
    if (roleName.includes('管理员')) return 'text-admin';
    if (roleName.includes('超级会员')) return 'text-member-crown';
    if (roleName.includes('金牌会员') || roleName.includes('黄金会员')) return 'text-member-gold';
    if (roleName.includes('铂金会员')) return 'text-member-platinum';
    if (roleName.includes('钻石会员')) return 'text-member-diamond';
    if (roleName.includes('白银会员') || roleName.includes('银牌会员')) return 'text-member-silver';
    if (roleName.includes('青铜会员') || roleName.includes('铜牌会员')) return 'text-member-bronze';
    if (roleName.includes('会员')) return 'text-member-basic';
  }
  
  // 回退到ID逻辑
  const id = author.id || 0;
  if (id % 5 === 0) return 'text-member-gold';
  if (id % 4 === 0) return 'text-member-diamond';
  if (id % 3 === 0) return 'text-member-platinum';
  if (id % 2 === 0) return 'text-member-silver';
  return '';
};

// 判断是否为金牌会员
const isGoldMember = (author?: Author): boolean => {
  if (!author) return false;
  
  // 如果有roles数组，检查最高权重的角色是否为金牌会员
  if (author.roles && author.roles.length > 0) {
    // 按show_weight降序排序
    const sortedRoles = [...author.roles].sort((a, b) => b.show_weight - a.show_weight);
    const highestRole = sortedRoles[0];
    const roleName = highestRole.name.toLowerCase();
    
    return roleName.includes('超级会员') || roleName.includes('金牌会员') || roleName.includes('黄金会员');
  }
  
  // 回退到原始逻辑
  return getAuthorClass(author) === 'text-member-gold';
};
</script>

<style lang="less" scoped>
.article-header {
  margin-bottom: 30px;
  position: relative;
  
  // 封面图样式
  .cover-image-container {
    position: relative;
    width: 100%;
    height: 380px;
    border-radius: 6px;
    overflow: hidden;
    margin-bottom: 24px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
    
    @media (max-width: 768px) {
      height: 220px;
      border-radius: 8px;
    }
    
    .cover-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
      
      &:hover {
        transform: scale(1.03);
      }
    }
    
    .image-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.5));
      pointer-events: none;
    }
  }
  
  // 标题区域样式
  .title-container {
    padding: 0 0 20px;
    position: relative;
    
    &.with-cover {
      margin-top: -80px;
      background-color: var(--el-bg-color);
      border-radius: 12px;
      padding: 24px 30px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.06);
      z-index: 1;
      
      @media (max-width: 768px) {
        margin-top: -40px;
        padding: 16px 20px;
      }
    }
    
    .article-meta {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      
      .category-tag {
        font-size: 14px;
        background: var(--el-color-primary-light-9);
        color: var(--el-color-primary);
        padding: 4px 12px;
        border-radius: 16px;
        display: inline-flex;
        align-items: center;
        gap: 6px;
        
        i {
          font-size: 12px;
        }
      }
      
      .article-badges {
        display: flex;
        gap: 8px;
        
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 4px 10px;
          border-radius: 4px;
          font-size: 12px;
          gap: 4px;
          
          &.top-badge {
            background: var(--el-color-danger-light-9);
            color: var(--el-color-danger);
          }

          &.recommend-badge {
            background: var(--el-color-warning-light-9);
            color: var(--el-color-warning);
          }

          &.original-badge {
            background: var(--el-color-success-light-9);
            color: var(--el-color-success);
          }
        }
      }
    }
    
    .article-title {
      font-size: 32px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      margin: 0 0 16px;
      line-height: 1.3;
      letter-spacing: 0.3px;
      
      @media (max-width: 768px) {
        font-size: 24px;
        margin-bottom: 10px;
      }
    }
    
    .article-subtitle {
      font-size: 16px;
      color: var(--el-text-color-regular);
      margin-bottom: 20px;
      line-height: 1.6;
      
      @media (max-width: 768px) {
        font-size: 14px;
        margin-bottom: 14px;
      }
    }
    
    .article-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 16px;
      
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
      }
      
      .author-info {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .author-details {
          display: flex;
          flex-direction: column;
          
          .author-name {
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 2px;
            display: flex;
            align-items: center;
            gap: 6px;

            .gold-icon {
              color: #ffd700;
              font-size: 14px;
              filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
            }
            
            &.text-member-gold {
              background: linear-gradient(45deg, #FFD700, #FFA500);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              font-weight: 700;
            }
            
            &.text-member-diamond {
              background: linear-gradient(45deg, #A1C4FD, #C2E9FB);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              font-weight: 700;
            }
            
            &.text-member-platinum {
              background: linear-gradient(45deg, #E0C3FC, #8EC5FC);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              font-weight: 700;
            }
            
            &.text-member-silver {
              background: linear-gradient(45deg, #D1D1D1, #ABABAB);
              -webkit-background-clip: text;
              background-clip: text;
              color: transparent;
              font-weight: 700;
            }
          }
          
          .author-bio {
            font-size: 12px;
            color: var(--el-text-color-regular);
            max-width: 200px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
      }
      
      .publish-info {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 20px;
        
        @media (max-width: 768px) {
          width: 100%;
          justify-content: space-between;
          gap: 10px;
        }
        
        .publish-time, .reading-info, .view-count {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 14px;
          color: var(--el-text-color-regular);

          i {
            font-size: 14px;
            color: var(--el-color-primary);
          }
        }
      }
    }
  }

  // AI摘要样式 - 紧凑设计，适配暗色模式
  .ai-summary-container {
    margin: 20px 0 0;
    padding: 0;
    width: 100%;
    position: relative;
    z-index: 10;

    @media (max-width: 768px) {
      margin: 16px 0 0;
    }
  }

  .ai-summary-inner {
    position: relative;
    padding: 16px;
    border-radius: 12px;
    background: var(--el-bg-color);
    border: 1px solid rgba(128, 0, 191, 0.15);
    color: var(--el-text-color-primary);
    box-shadow: 0 4px 16px rgba(128, 0, 191, 0.08);
    overflow: hidden; // 保持hidden，避免内容溢出
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

    @media (max-width: 768px) {
      padding: 12px;
      border-radius: 10px;
    }

    // 暗色模式适配
    html.dark & {
      background: var(--el-bg-color);
      border-color: rgba(128, 0, 191, 0.2);
      box-shadow: 0 4px 16px rgba(128, 0, 191, 0.15);
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 8px 24px rgba(128, 0, 191, 0.12);

      html.dark & {
        box-shadow: 0 8px 24px rgba(128, 0, 191, 0.2);
      }

    }

    // 确保内容在最上层
    > * {
      position: relative;
      z-index: 1;
    }
  }

  .ai-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 12px;
    position: relative;
    z-index: 2;
    cursor: pointer;

    @media (max-width: 768px) {
      margin-bottom: 10px;
    }
  }

  .ai-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 12px;
    background: linear-gradient(135deg, rgba(255, 64, 255, 0.85), rgba(128, 0, 191, 0.85));
    color: white;
    font-size: 13px;
    font-weight: 600;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(128, 0, 191, 0.25);
    transition: all 0.3s ease;

    @media (max-width: 768px) {
      padding: 4px 10px;
      font-size: 12px;
      border-radius: 14px;
      gap: 4px;
    }

    &:hover {
      transform: scale(1.02);
      box-shadow: 0 4px 12px rgba(128, 0, 191, 0.35);
    }

    i {
      font-size: 12px;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));

      @media (max-width: 768px) {
        font-size: 11px;
      }
    }
  }

  .ai-collapse {
    color: rgba(128, 0, 191, 0.7);
    cursor: pointer;
    width: 28px;
    height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(128, 0, 191, 0.1);
    transition: all 0.3s ease;

    @media (max-width: 768px) {
      width: 24px;
      height: 24px;
    }

    // 暗色模式适配
    html.dark & {
      background: rgba(128, 0, 191, 0.15);
      color: rgba(128, 0, 191, 0.8);
    }

    &:hover {
      background: rgba(128, 0, 191, 0.2);
      color: rgba(128, 0, 191, 1);
      transform: scale(1.05);

      html.dark & {
        background: rgba(128, 0, 191, 0.25);
      }
    }

    &.collapsed {
      transform: rotate(180deg);

      &:hover {
        transform: rotate(180deg) scale(1.05);
      }
    }

    i {
      font-size: 12px;
      transition: transform 0.3s ease;

      @media (max-width: 768px) {
        font-size: 11px;
      }
    }
  }

  .ai-content {
    position: relative;
    z-index: 2;
    overflow: hidden;
  }

  // 折叠动画样式
  .ai-collapse-enter-active,
  .ai-collapse-leave-active {
    transition: height 0.3s ease;
    overflow: hidden;
  }

  .ai-collapse-enter-from,
  .ai-collapse-leave-to {
    height: 0;
  }

  .ai-description {
    font-size: 13px;
    line-height: 1.6;
    margin: 0 0 12px 0;
    padding: 0;
    letter-spacing: 0.2px;
    font-weight: 400;
    color: var(--el-text-color-regular);
    font-family: 'Inter', system-ui, sans-serif;
    text-align: justify;

    @media (max-width: 768px) {
      font-size: 12px;
      line-height: 1.5;
      margin: 0 0 10px 0;
    }
  }

  .ai-footer {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid rgba(128, 0, 191, 0.1);

    @media (max-width: 768px) {
      margin-top: 8px;
      padding-top: 8px;
    }

    // 暗色模式适配
    html.dark & {
      border-top-color: rgba(128, 0, 191, 0.15);
    }
  }

  .ai-source {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    font-size: 11px;
    color: rgba(128, 0, 191, 0.7);
    font-weight: 500;
    padding: 3px 8px;
    background: rgba(128, 0, 191, 0.05);
    border-radius: 10px;
    transition: all 0.3s ease;

    @media (max-width: 768px) {
      font-size: 10px;
      padding: 2px 6px;
      gap: 3px;
      border-radius: 8px;
    }

    // 暗色模式适配
    html.dark & {
      background: rgba(128, 0, 191, 0.1);
      color: rgba(128, 0, 191, 0.8);
    }

    &:hover {
      background: rgba(128, 0, 191, 0.1);
      color: rgba(128, 0, 191, 0.9);

      html.dark & {
        background: rgba(128, 0, 191, 0.15);
        color: rgba(128, 0, 191, 1);
      }
    }

    i {
      font-size: 10px;
      animation: sparkle 2s ease-in-out infinite;

      @media (max-width: 768px) {
        font-size: 9px;
      }
    }
  }

  // 闪烁动画
  @keyframes sparkle {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.1); }
  }
}
</style> 