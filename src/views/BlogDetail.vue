<template>
  <div class="blog-detail-page">
    <!-- 页面顶部导航栏 -->
    <div class="page-header">
      <div class="container">
        <div class="nav-container">
          <div class="nav-left">
            <div class="breadcrumb">
              <a href="/">首页</a>
              <i class="fas fa-angle-right"></i>
              <a v-if="article.category" :href="`/category/${article.category.slug}`">{{ article.category.name }}</a>
              <i v-if="article.category" class="fas fa-angle-right"></i>
              <span>{{ article.title }}</span>
            </div>
          </div>

          <div class="nav-right">
            <div class="back-button" @click="goBack">
              <i class="fas fa-arrow-left"></i>
              <span>返回</span>
            </div>

            <div class="search-button">
              <i class="fas fa-search"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- page-header占位空间 -->
    <div style="height: 84px;"></div>

    <!-- 主要内容区域 -->
    <div class="page-content">
      <div class="container">
        <div class="content-layout">
          <!-- 主内容区 -->
          <div class="main-content animate__animated animate__fadeIn">
            <!-- 加载状态 -->
            <div v-if="isLoading" class="loading-container">
              <div class="loading-spinner">
                <i class="fas fa-circle-notch fa-spin"></i>
              </div>
              <p>加载文章中...</p>
            </div>

            <!-- 错误状态 -->
            <div v-else-if="hasError" class="error-container animate__animated animate__fadeIn">
              <i class="fas fa-exclamation-circle error-icon"></i>
              <p class="error-message">{{ errorMessage }}</p>
              <p class="error-tip">别担心，我们已经派出救援队！</p>
              <a-button type="primary" class="retry-button" @click="fetchArticleDetail">
                <i class="fas fa-sync-alt"></i>
                <span>重新加载</span>
              </a-button>
            </div>

            <!-- 正常内容 -->
            <template v-else>
              <ArticleHeader :article="article" />
              <ArticleContent :article="article" @tag-click="handleTagClick" />
              
              <!-- 开发者测试开关（仅在开发环境显示） -->
              <div class="developer-controls" v-if="isDevelopment">
                <div class="control-item">
                  <span class="control-label">评论功能：</span>
                  <el-switch 
                    v-model="isCommentsEnabled" 
                    :active-text="'已开启'" 
                    :inactive-text="'已关闭'"
                    size="small"
                  />
                </div>
              </div>
              <!-- 文章内嵌广告 -->
              <PromotionCard type="standard" title="前端开发者必备工具集" description="包含50+精选开发工具，提升10倍工作效率，限时优惠中！"
                image-url="https://picsum.photos/id/243/120/120" image-alt="广告图片" :radius="true" badge-text="推广"
                badge-icon="fas fa-tag" button-text="了解详情" button-icon="fas fa-external-link-alt" :is-inline="true"
                @click="handlePromotionClick" />

              <!-- Premium文章内嵌广告 -->
              <PromotionCard type="premium" title="Vue3+TypeScript高级组件设计模式"
                description="掌握Vue3企业级应用开发的高级组件设计技巧，打造高复用高性能组件库" image-url="https://picsum.photos/id/24/120/120"
                image-alt="高级教程" :radius="true" badge-text="Premium" badge-icon="fas fa-crown" button-text="解锁高级内容"
                button-icon="fas fa-lock" :is-inline="true" animation-delay="0.2s" @click="handlePremiumClick" />

              <!-- 评论区域 - 根据开关显示评论或占位组件 -->
              <ArticleComments 
                v-if="isCommentsEnabled"
                :articleId="articleId" 
                :comments="comments" 
                @login="handleLogin"
                @register="handleRegister" 
                @comment-added="handleCommentAdded" 
                @reply-added="handleReplyAdded" 
              />
              
              <!-- 评论功能占位组件 -->
              <PlaceholderCard 
                v-else
                :title="'评论功能开发中'"
                :description="'我们正在努力完善评论系统，包括用户认证、内容审核、回复通知等功能，敬请期待！'"
                :tip="'预计将在下个版本上线'"
                :icon="'comment'"
                :theme="'info'"
                :show-action="true"
                :action-text="'关注更新'"
                :action-icon="'fas fa-bell'"
                :action-type="'outline'"
                @action="handleCommentPlaceholderAction"
              />
            </template>
          </div>

          <!-- 侧边栏 -->
          <div class="sidebar">
            <div class="sidebar-container animate__animated animate__fadeInRight">
              <!-- 作者信息卡片 -->
              <div class="sidebar-widget author-widget" v-if="article.author">
                <div class="widget-header">
                  <i class="fas fa-user-circle"></i>
                  <span>作者信息</span>
                </div>
                <div class="author-profile">
                  <div class="author-card">
                    <div class="author-avatar">
                      <div class="avatar-container">
                        <a-avatar :size="60" :src="article.author.avatar" />
                        <div class="avatar-highlight"></div>
                      </div>
                      <div class="avatar-badge">
                        <i class="fas fa-check"></i>
                      </div>
                    </div>
                    <div class="author-info">
                      <div class="author-name" :class="getAuthorClass(article.author)">
                        {{ article.author.username || article.author.nickname }}
                        <i v-if="isGoldMember(article.author)" class="fas fa-crown gold-icon"></i>
                      </div>
                      <div class="author-bio">{{ article.author.signature || '这个作者很懒，还没有写个人简介' }}</div>
                    </div>
                  </div>


                </div>
              </div>

              <!-- 目录 -->
              <div class="sidebar-widget toc-widget">
                <div class="widget-header">
                  <i class="fas fa-list-ul"></i>
                  <span>文章目录</span>
                </div>
                <div class="toc-container" v-if="tableOfContents.length > 0">
                  <ul class="toc-list">
                    <li v-for="(item, index) in tableOfContents" :key="index" :class="[
                      'toc-item',
                      `toc-level-${item.level}`,
                      { 'toc-active': item.active }
                    ]" @click="scrollToHeading(item.id)">
                      {{ item.text }}
                    </li>
                  </ul>
                </div>
                <div class="toc-empty" v-else>
                  <i class="fas fa-info-circle"></i>
                  <p>此文章没有目录</p>
                </div>
              </div>



              <!-- 精选推广卡片 -->
              <div class="sidebar-widget animate__animated animate__fadeIn" style="animation-delay: 0.3s">
                <div class="widget-header">
                  <i class="fas fa-ad"></i>
                  <span>精选推广</span>
                  <span class="ad-tag">广告</span>
                </div>
                <PromotionCard type="standard" title="Vue3全栈开发实战课程" description="从零开始掌握Vue3+TypeScript+Vite前端开发技术栈"
                  image-url="https://picsum.photos/300/200" image-alt="广告图片" :radius="false" badge-text="精选"
                  badge-icon="fas fa-crown" button-text="立即购买" :show-overlay="true" overlay-text="立即查看"
                  :show-price="true" current-price="¥299" original-price="¥599" @click="handlePromotionClick" />
              </div>

              <!-- 高级教程卡片 -->
              <div class="sidebar-widget animate__animated animate__fadeIn" style="animation-delay: 0.4s">
                <div class="widget-header">
                  <i class="fas fa-gem"></i>
                  <span>高级教程</span>
                  <span class="ad-tag">Premium</span>
                </div>
                <PromotionCard type="premium" title="Vue3源码解析与性能优化" description="深入剖析Vue3核心原理，掌握高级性能优化技巧"
                  image-url="https://picsum.photos/id/201/300/200" image-alt="高级教程" :radius="false" badge-text="Premium"
                  badge-icon="fas fa-crown" button-text="立即解锁" button-icon="fas fa-crown" :show-overlay="true"
                  overlay-text="解锁内容" overlay-icon="fas fa-lock" @click="handlePremiumClick" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 移动端目录抽屉 -->
    <div class="mobile-toc-drawer" :class="{ 'drawer-open': mobileTocVisible }">
      <div class="drawer-header">
        <div class="drawer-title">文章目录</div>
        <div class="drawer-close" @click="toggleMobileToc">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="drawer-content">
        <ul class="mobile-toc-list" v-if="tableOfContents.length > 0">
          <li v-for="(item, index) in tableOfContents" :key="index" :class="[
            'toc-item',
            `toc-level-${item.level}`,
            { 'toc-active': item.active }
          ]" @click="mobileScrollToHeading(item.id)">
            {{ item.text }}
          </li>
        </ul>
        <div class="toc-empty" v-else>
          <i class="fas fa-info-circle"></i>
          <p>此文章没有目录</p>
        </div>
      </div>
    </div>

    <!-- 移动端目录遮罩层 -->
    <div class="mobile-mask" v-if="mobileTocVisible" @click="toggleMobileToc"></div>

    <!-- 阅读进度指示器 -->
    <div class="reading-progress-indicator" :style="{ width: readingProgress + '%' }"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// 导入组件
import {
  ArticleHeader,
  ArticleContent,
  ArticleComments
} from '@/components/blog/BlogDetail';
import PromotionCard from '@/components/blog/BlogDetail/PromotionCard.vue';
import PlaceholderCard from '@/components/PlaceholderCard.vue';

// 导入API函数和模拟数据
import { getArticleDetailR } from '@/request/article';
import {
  mockComments
} from '@/mock/blogData';

// 定义类型 - 根据真实API数据结构
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
  slug: string;
  meta_title?: string;
  meta_keywords?: string;
}

interface Tag {
  id: number;
  name: string;
  pivot?: {
    id: number;
    article_id: number;
    category_id: number;
    create_time: string;
  };
}

interface Article {
  id: number;
  title: string;
  subtitle?: string;
  content?: string;
  html_content?: string; // 新增HTML内容字段
  cover_image?: string;
  author_id?: number;
  category_id?: number;
  status?: number;
  is_top?: number;
  is_recommend?: number;
  is_original?: number;
  source_url?: string;
  slug?: string;
  keywords?: string;
  description?: string;
  word_count?: number;
  read_time?: number;
  create_time?: string;
  update_time?: string;
  publish_time?: string;
  delete_time?: string | null;
  sort?: number;
  favorites_count?: number;
  likes_count?: number;
  comments_count?: number;
  views?: number; // 保留兼容性
  author?: Author;
  category?: Category;
  tags?: Tag[];
  comments?: any[]; // 评论数组
}

interface TOCItem {
  id: string;
  text: string;
  level: number;
  active: boolean;
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  author: {
    id: number;
    username: string;
    avatar?: string;
    badge?: string;
    roles?: any[];
    isVerified?: boolean;
  };
  replies?: any[];
  likes?: number;
  isLiked?: boolean;
  highlighted?: boolean;
}



// 获取路由参数
const route = useRoute();
const router = useRouter();
const articleId = computed(() => Number(route.params.id) || 0);

// 状态变量
const isLoading = ref(true);
const hasError = ref(false);
const errorMessage = ref('加载失败，请稍后重试');
const article = ref<Article>({ id: 0, title: '加载中...' });
const comments = ref<Comment[]>([]);
const tableOfContents = ref<TOCItem[]>([]);

// 功能开关控制
const isCommentsEnabled = ref(false); // 控制评论功能是否开启
const isDevelopment = ref(import.meta.env.MODE === 'development'); // 开发环境检测

// 移动端相关状态
const mobileTocVisible = ref(false);
const showMobileToolbar = ref(false);



// 阅读进度
const readingProgress = ref(0);





// 获取文章详情
const fetchArticleDetail = async () => {
  try {
    isLoading.value = true;
    hasError.value = false;
    
    // 检查文章ID是否有效
    if (!articleId.value || articleId.value <= 0) {
      throw new Error('无效的文章ID');
    }

    console.log('正在获取文章详情，ID:', articleId.value);

    const response = await getArticleDetailR(articleId.value);
    console.log('API响应:', response);

    // 根据你提供的API响应格式解析数据
    const apiRes = response as unknown as {
      code: number;
      msg: string;
      data: any;
    };

    if (apiRes && apiRes.code === 200 && apiRes.data) {
      const articleData = apiRes.data;

      // 映射API数据到本地Article接口
      article.value = {
        id: articleData.id,
        title: articleData.title,
        subtitle: articleData.subtitle,
        content: articleData.content,
        html_content: articleData.html_content,
        cover_image: articleData.cover_image,
        author_id: articleData.author_id,
        category_id: articleData.category_id,
        status: articleData.status,
        is_top: articleData.is_top,
        is_recommend: articleData.is_recommend,
        is_original: articleData.is_original,
        source_url: articleData.source_url,
        slug: articleData.slug,
        keywords: articleData.keywords,
        description: articleData.description,
        word_count: articleData.word_count,
        read_time: articleData.read_time,
        create_time: articleData.create_time,
        update_time: articleData.update_time,
        publish_time: articleData.publish_time,
        delete_time: articleData.delete_time,
        sort: articleData.sort,
        favorites_count: articleData.favorites_count,
        likes_count: articleData.likes_count,
        comments_count: articleData.comments_count,
        views: articleData.views || 0, // 如果API没有返回views字段，默认为0
        author: articleData.author,
        category: articleData.category,
        tags: articleData.tags?.map((tag: any) => ({
          id: tag.id || 0, // 如果没有id，默认为0
          name: tag.name,
          pivot: tag.pivot
        })) || [],
        comments: articleData.comments || []
      };

      console.log('处理后的文章数据:', article.value);

      // 使用模拟数据填充其他内容（评论等）
      // 这些数据在真实环境中应该通过其他API获取
      comments.value = [...mockComments];

      // 提取文章中的标题，生成目录
      extractTableOfContents();

      // 更新页面标题
      document.title = `${article.value.title || '文章详情'} - BitlEBlog`;

      isLoading.value = false;
    } else {
      throw new Error(apiRes?.msg || '获取文章详情失败');
    }

  } catch (error) {
    console.error('获取文章详情出错:', error);
    
    // 设置错误状态
    hasError.value = true;
    errorMessage.value = error instanceof Error ? error.message : '获取文章详情失败，请稍后重试';
    
    // 设置默认文章数据以防止白屏
    article.value = {
      id: articleId.value,
      title: '加载失败',
      content: '文章加载失败，请点击重新加载。',
      author: {
        id: 0,
        username: '系统',
        nickname: '系统',
        avatar: 'https://picsum.photos/60/60?random=0'
      },
      category: {
        id: 0,
        name: '未分类',
        slug: 'uncategorized'
      },
      tags: [],
      views: 0,
      likes_count: 0,
      comments_count: 0
    };
    
    // 确保加载状态被清除
    isLoading.value = false;
  } finally {
    // 无论成功还是失败，确保加载状态被清除
    isLoading.value = false;
  }
};

// 提取文章中的标题，生成目录
const extractTableOfContents = () => {
  if (!article.value.content) {
    tableOfContents.value = [];
    return;
  }

  nextTick(() => {
    // 获取文章中的所有标题元素
    const contentEl = document.querySelector('.content-body');
    if (!contentEl) {
      console.log('未找到.content-body元素，可能是Markdown还未渲染完成');
      tableOfContents.value = [];
      return;
    }

    const headings = contentEl.querySelectorAll('h1, h2, h3, h4, h5, h6');
    const tocItems: TOCItem[] = [];

    headings.forEach((heading, index) => {
      // 为每个标题添加id，方便目录点击跳转
      const id = `heading-${index}`;
      heading.setAttribute('id', id);

      // 获取标题级别
      const level = parseInt(heading.tagName.substring(1));

      // 添加到目录列表
      tocItems.push({
        id,
        text: heading.textContent || '',
        level,
        active: false
      });
    });

    tableOfContents.value = tocItems;
    console.log('提取的目录:', tocItems);

    // 添加滚动监听，高亮当前可视区域的标题
    window.addEventListener('scroll', updateActiveHeading);
  });
};

// 更新当前活跃的标题
const updateActiveHeading = () => {
  if (tableOfContents.value.length === 0) return;

  const headings = document.querySelectorAll('.content-body h1, .content-body h2, .content-body h3, .content-body h4, .content-body h5, .content-body h6');

  // 找到当前在视口中的标题
  let currentHeadingId = '';

  for (let i = 0; i < headings.length; i++) {
    const heading = headings[i] as HTMLElement;
    const rect = heading.getBoundingClientRect();

    if (rect.top <= 100) { // 100px阈值
      currentHeadingId = heading.id;
    } else {
      break;
    }
  }

  // 更新活跃状态
  tableOfContents.value.forEach(item => {
    item.active = item.id === currentHeadingId;
  });
};

// 点击目录项滚动到对应标题
const scrollToHeading = (id: string) => {
  const heading = document.getElementById(id);
  if (heading) {
    window.scrollTo({
      top: heading.offsetTop - 80, // 考虑固定导航栏的高度
      behavior: 'smooth'
    });
  }
};

// 移动端点击目录项并关闭抽屉
const mobileScrollToHeading = (id: string) => {
  scrollToHeading(id);
  mobileTocVisible.value = false;
};

// 切换移动端目录可见性
const toggleMobileToc = () => {
  mobileTocVisible.value = !mobileTocVisible.value;
  if (mobileTocVisible.value) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

// 监听滚动以控制移动工具栏的显示
const handleScroll = () => {
  const scrollTop = window.scrollY || document.documentElement.scrollTop;

  // 显示/隐藏移动工具栏
  if (scrollTop > 300) {
    showMobileToolbar.value = true;
  } else {
    showMobileToolbar.value = false;
  }

  // 计算阅读进度
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  readingProgress.value = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;

  // 更新目录活跃项
  updateActiveHeading();
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



// 推广卡片点击处理
const handlePromotionClick = (event: MouseEvent) => {
  console.log('推广卡片被点击', event);
  // 这里可以添加跳转逻辑或统计代码
};

const handlePremiumClick = (event: MouseEvent) => {
  console.log('Premium卡片被点击', event);
  // 这里可以添加Premium内容解锁逻辑
};

// 返回上一页
const goBack = () => {
  router.back();
};



// 处理标签点击
const handleTagClick = (tag: Tag) => {
  router.push({
    path: `/tags/${tag.id}`,
    query: { name: tag.name }
  });
};





// 处理登录/注册
const handleLogin = () => {
  router.push('/login');
};

const handleRegister = () => {
  router.push('/login?tab=register');
};

// 处理评论添加
const handleCommentAdded = (newComment: Comment) => {
  comments.value = [newComment, ...comments.value];
};

// 处理回复添加
const handleReplyAdded = ({ commentId, reply }: { commentId: number; reply: any }) => {
  const comment = comments.value.find(c => c.id === commentId);
  if (comment) {
    if (!comment.replies) {
      comment.replies = [];
    }
    comment.replies.push(reply);
  }
};

// 处理评论占位组件操作按钮点击
const handleCommentPlaceholderAction = () => {
  // 这里可以添加关注更新的逻辑，比如：
  // 1. 弹出订阅通知框
  // 2. 跳转到关于页面
  // 3. 显示开发进度
  console.log('用户点击了关注评论功能更新');
  // 可以使用 Element Plus 的 ElMessage 显示提示
  // ElMessage.info('已为您记录关注，功能上线时将通知您！');
};

// 监听文章ID变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    fetchArticleDetail();
  }
}, { immediate: true });

// 组件挂载后的操作
onMounted(() => {
  // 监听窗口滚动事件
  window.addEventListener('scroll', handleScroll);
});

// 组件卸载时清理事件监听
onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('scroll', updateActiveHeading);
  // 恢复页面滚动
  document.body.style.overflow = '';
});
</script>

<style lang="less" scoped>
.blog-detail-page {
  min-height: 100vh;
  
  // 页面级别初始化，确保page-header立即定位正确
  .page-header {
    // 确保SSR和初始渲染时位置正确
    position: fixed !important;
    top: 60px !important;
    
    @media (max-width: 768px) {
      top: 54px !important;
    }
  }

  // 开发者控制面板样式
  .developer-controls {
    margin: 20px 0;
    padding: 16px;
    background: var(--el-color-warning-light-9);
    border: 1px solid var(--el-color-warning-light-7);
    border-radius: 8px;
    border-left: 4px solid var(--el-color-warning);
    
    .control-item {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .control-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--el-color-warning-dark-2);
      }
    }
    
    // 暗色模式适配
    html.dark & {
      background: rgba(var(--el-color-warning-rgb), 0.1);
      border-color: rgba(var(--el-color-warning-rgb), 0.3);
    }
  }

  // 全局暗色模式适配
  html.dark & {
    // 覆盖所有硬编码的白色背景
    * {
      &[style*="background: #fff"],
      &[style*="background: white"],
      &[style*="background: #ffffff"],
      &[style*="background-color: #fff"],
      &[style*="background-color: white"],
      &[style*="background-color: #ffffff"] {
        background: var(--el-bg-color) !important;
        background-color: var(--el-bg-color) !important;
      }

      // 覆盖硬编码的黑色文字
      &[style*="color: #000"],
      &[style*="color: black"],
      &[style*="color: #000000"] {
        color: var(--el-text-color-primary) !important;
      }
    }

    // 批量适配常见的硬编码颜色
    .widget-title,
    .section-title,
    .error-title,
    .banner-title,
    .ad-title,
    .inline-ad-title {
      color: var(--el-text-color-primary) !important;
    }

    .widget-content,
    .ad-description,
    .banner-description,
    .inline-ad-description,
    .subscribe-text,
    .error-tip,
    .author-bio {
      color: var(--el-text-color-regular) !important;
    }

    .breadcrumb i,
    .toc-empty i,
    .empty-toc i,
    .user-text,
    .item-meta,
    .original-price {
      color: var(--el-text-color-placeholder) !important;
    }

    .recommend-title,
    .toc-active,
    .widget-title i {
      color: var(--el-color-primary) !important;
    }
    
    // 暗色模式下的page-header适配
    .page-header {
      background: linear-gradient(135deg, 
        rgba(28, 28, 30, 0.95) 0%,
        rgba(44, 44, 46, 0.9) 100%
      );
      border-bottom-color: rgba(255, 255, 255, 0.08);
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 1px 0 rgba(255, 255, 255, 0.05),
        inset 0 1px 0 rgba(255, 255, 255, 0.08);
        
      &::before {
        background: linear-gradient(90deg,
          transparent 0%,
          rgba(100, 168, 255, 0.05) 50%,
          transparent 100%
        );
      }
      
      .breadcrumb {
        background: linear-gradient(135deg, 
          rgba(255, 255, 255, 0.08) 0%,
          rgba(255, 255, 255, 0.05) 100%
        );
        border-color: rgba(100, 168, 255, 0.12);
        box-shadow: 
          0 2px 8px rgba(0, 0, 0, 0.2),
          inset 0 1px 0 rgba(255, 255, 255, 0.1);
        
        &::before {
          background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.15),
            transparent
          );
        }
        
        &::after {
          background: linear-gradient(135deg, 
            rgba(100, 168, 255, 0.1) 0%,
            rgba(64, 168, 255, 0.06) 100%
          );
        }
        
        &:hover {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.12) 0%,
            rgba(255, 255, 255, 0.08) 100%
          );
          border-color: rgba(100, 168, 255, 0.2);
          box-shadow: 
            0 6px 20px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.15);
        }
        
        span {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.95) 0%,
            rgba(100, 168, 255, 0.85) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: drop-shadow(0 1px 2px rgba(100, 168, 255, 0.2));
        }
        
        a:hover {
          background: linear-gradient(135deg, 
            rgba(100, 168, 255, 0.15) 0%,
            rgba(64, 168, 255, 0.12) 100%
          );
          box-shadow: 
            0 2px 8px rgba(100, 168, 255, 0.2),
            inset 0 1px 0 rgba(255, 255, 255, 0.2);
        }
      }
      
      .back-button {
        background: linear-gradient(135deg, 
          rgba(100, 168, 255, 0.1) 0%,
          rgba(64, 168, 255, 0.08) 100%
        );
        border-color: rgba(100, 168, 255, 0.2);
        color: #64A8FF;
        
        &:hover {
          background: linear-gradient(135deg, 
            rgba(100, 168, 255, 0.15) 0%,
            rgba(64, 168, 255, 0.12) 100%
          );
          border-color: rgba(100, 168, 255, 0.3);
        }
        
        &::before {
          background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.2),
            transparent
          );
        }
      }
      
      .search-button {
        background: linear-gradient(135deg, 
          rgba(255, 255, 255, 0.05) 0%,
          rgba(255, 255, 255, 0.02) 100%
        );
        border-color: rgba(255, 255, 255, 0.1);
        color: rgba(255, 255, 255, 0.7);
        
        &:hover {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.08) 0%,
            rgba(255, 255, 255, 0.05) 100%
          );
          border-color: rgba(255, 255, 255, 0.15);
          color: rgba(255, 255, 255, 0.9);
        }
      }
    }
  }

  // 页面头部样式 - 精美质感设计
  .page-header {
    background: linear-gradient(135deg, 
      rgba(255, 255, 255, 0.9) 0%,
      rgba(248, 250, 252, 0.95) 100%
    );
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    padding: 18px 0;
    position: fixed;
    top: 60px;
    
    @media (max-width: 768px) {
      top: 54px; // 移动端使用更小的头部高度
    }
    left: 0;
    right: 0;
    width: 100%;
    z-index: 1001;
    border-bottom: 0.5px solid rgba(0, 0, 0, 0.08);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.04),
      0 1px 0 rgba(255, 255, 255, 0.8),
      inset 0 1px 0 rgba(255, 255, 255, 0.9);
    // 移除过渡动画，避免跳动
    // transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
    
    // 初始状态优化，避免跳动
    opacity: 1;
    transform: translateZ(0); // 强制硬件加速，保证平滑显示
    
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(90deg,
        transparent 0%,
        rgba(22, 119, 255, 0.03) 50%,
        transparent 100%
      );
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.3s ease;
    }
    
    &:hover::before {
      opacity: 1;
    }

    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 20px;
      position: relative;
      z-index: 2;

      @media (max-width: 768px) {
        padding: 0 16px;
      }
    }

    .nav-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 48px;
      position: relative;
    }

    .nav-left {
      display: flex;
      align-items: center;
      min-width: 0;
      flex: 1;
      position: relative;

      .breadcrumb {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: var(--el-text-color-regular);
        font-weight: 500;
        min-width: 0;
        width: 100%;
        padding: 10px 14px;
        background: linear-gradient(135deg, 
          rgba(255, 255, 255, 0.7) 0%,
          rgba(248, 250, 252, 0.6) 100%
        );
        backdrop-filter: blur(12px) saturate(150%);
        border-radius: 14px;
        border: 0.5px solid rgba(22, 119, 255, 0.08);
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        position: relative;
        overflow: hidden;
        box-shadow: 
          0 2px 8px rgba(22, 119, 255, 0.06),
          inset 0 1px 0 rgba(255, 255, 255, 0.8);
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          transition: left 0.6s ease;
        }
        
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 14px;
          background: linear-gradient(135deg, 
            rgba(22, 119, 255, 0.08) 0%,
            rgba(105, 177, 255, 0.04) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        &:hover {
          background: linear-gradient(135deg, 
            rgba(255, 255, 255, 0.85) 0%,
            rgba(248, 250, 252, 0.75) 100%
          );
          border-color: rgba(22, 119, 255, 0.15);
          transform: translateY(-2px) scale(1.01);
          box-shadow: 
            0 6px 20px rgba(22, 119, 255, 0.12),
            inset 0 1px 0 rgba(255, 255, 255, 0.9);
          
          &::before {
            left: 100%;
          }
          
          &::after {
            opacity: 1;
          }
        }

        @media (max-width: 576px) {
          max-width: 280px;
          padding: 6px 10px;
          border-radius: 10px;
        }

        a {
          color: var(--el-text-color-regular);
          text-decoration: none;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          white-space: nowrap;
          position: relative;
          z-index: 3;
          padding: 4px 8px;
          border-radius: 8px;
          font-weight: 500;
          backdrop-filter: blur(8px);

          &:hover {
            color: var(--el-color-primary);
            background: linear-gradient(135deg, 
              rgba(22, 119, 255, 0.12) 0%,
              rgba(105, 177, 255, 0.08) 100%
            );
            transform: translateY(-1px) scale(1.02);
            box-shadow: 
              0 2px 8px rgba(22, 119, 255, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
            font-weight: 600;
          }
        }

        i {
          font-size: 12px;
          color: var(--el-text-color-placeholder);
          flex-shrink: 0;
          position: relative;
          z-index: 3;
          transition: all 0.3s ease;
          opacity: 0.6;
        }

        span {
          font-weight: 600;
          max-width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          min-width: 0;
          flex: 1;
          position: relative;
          z-index: 3;
          background: linear-gradient(135deg, 
            var(--el-text-color-primary) 0%,
            rgba(22, 119, 255, 0.8) 100%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          filter: drop-shadow(0 1px 2px rgba(22, 119, 255, 0.1));
        }
      }
    }

    .nav-right {
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
      margin-left: 20px;
      position: relative;

      .back-button,
      .search-button {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        height: 40px;
        padding: 0 16px;
        border-radius: 20px;
        background: linear-gradient(135deg, 
          rgba(22, 119, 255, 0.08) 0%,
          rgba(105, 177, 255, 0.05) 100%
        );
        backdrop-filter: blur(10px) saturate(150%);
        color: var(--el-color-primary);
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        position: relative;
        overflow: hidden;
        border: 0.5px solid rgba(22, 119, 255, 0.15);
        box-shadow: 
          0 4px 12px rgba(22, 119, 255, 0.1),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
        font-weight: 600;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.6s ease;
        }
        
        &::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 20px;
          background: linear-gradient(135deg, 
            rgba(22, 119, 255, 0.1) 0%,
            rgba(105, 177, 255, 0.05) 100%
          );
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        @media (hover: hover) {
          &:hover {
            transform: translateY(-2px) scale(1.02);
            background: linear-gradient(135deg, 
              rgba(22, 119, 255, 0.12) 0%,
              rgba(105, 177, 255, 0.08) 100%
            );
            border-color: rgba(22, 119, 255, 0.25);
            box-shadow: 
              0 8px 24px rgba(22, 119, 255, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);

            &::before {
              left: 100%;
            }
            
            &::after {
              opacity: 1;
            }

            i {
              transform: translateX(-2px) scale(1.1);
            }
            
            span {
              transform: translateX(-1px);
            }
          }
        }

        &:active {
          transform: translateY(-1px) scale(0.98);
        }

        i {
          font-size: 16px;
          position: relative;
          z-index: 3;
          transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          filter: drop-shadow(0 1px 2px rgba(22, 119, 255, 0.2));
        }

        span {
          position: relative;
          z-index: 3;
          font-weight: 600;
          letter-spacing: -0.2px;
          transition: all 0.3s ease;
        }

        @media (max-width: 576px) {
          width: 40px;
          height: 40px;
          padding: 0;
          border-radius: 20px;

          span {
            display: none;
          }
          
          i {
            font-size: 18px;
          }
        }
      }
      
      .search-button {
        background: linear-gradient(135deg, 
          rgba(156, 163, 175, 0.08) 0%,
          rgba(209, 213, 219, 0.05) 100%
        );
        color: var(--el-text-color-regular);
        border-color: rgba(156, 163, 175, 0.15);
        
        &:hover {
          background: linear-gradient(135deg, 
            rgba(156, 163, 175, 0.12) 0%,
            rgba(209, 213, 219, 0.08) 100%
          );
          border-color: rgba(156, 163, 175, 0.25);
          color: var(--el-text-color-primary);
          
          i {
            transform: scale(1.1);
          }
        }
      }
    }
  }

  // 页面内容样式
  .page-content {
    padding: 30px 0 60px;

    @media (max-width: 768px) {
      padding: 20px 0 80px; // 增加底部padding，为移动工具栏留空间
    }

    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 16px;

      @media (max-width: 768px) {
        padding: 0 12px;
      }
    }

    .content-layout {
      display: flex;
      gap: 30px;

      @media (max-width: 992px) {
        flex-direction: column;
      }

      .main-content {
        flex: 1;
        min-width: 0;
         background: var(--el-bg-color);;
        border-radius: 12px;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
        padding: 20px;
        transition: transform 0.3s ease, box-shadow 0.3s ease;

        &:hover {
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }

        @media (max-width: 768px) {
          padding: 20px 15px;
          border-radius: 8px;
        }
      }

      .sidebar {
        width: 300px;
        flex-shrink: 0;

        @media (max-width: 992px) {
          width: 100%;
        }

        .sidebar-container {
          position: sticky;
          top: 90px;
          display: flex;
          flex-direction: column;
          gap: 20px;

          @media (max-width: 992px) {
            position: static;

            // 在移动设备上隐藏目录，通过抽屉展示
            .toc-widget {
              display: none;
            }
          }
        }
      }
    }
  }

  // 加载状态样式
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 0;

    .loading-spinner {
      font-size: 40px;
      color: var(--el-color-primary);
      margin-bottom: 20px;
      animation: spin 1.5s linear infinite;
    }

    p {
      font-size: 16px;
      color: var(--el-text-color-regular);
    }
  }

  // 错误状态样式
  .error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 50px 0;
    text-align: center;
   background: var(--el-bg-color);
    border-radius: 12px;
    position: relative;
    overflow: hidden;
    color: var(--el-text-color-primary);
    min-height: 400px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 3px;
      background: var(--el-color-primary);
      background-size: 200% 100%;
      z-index: 1;
    }

    .error-icon {
      font-size: 72px;
      color: var(--el-color-error);
      margin: 0 0 30px;
      position: relative;
      animation: errorIconPulse 2s ease-in-out infinite;
      filter: drop-shadow(0 8px 16px rgba(239, 68, 68, 0.3));
      z-index: 2;

      &::after {
        content: '';
        position: absolute;
        width: 160px;
        height: 160px;
        background: var(--el-color-error-light-9);
        border-radius: 50%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: -1;
        animation: errorIconGlow 3s ease-in-out infinite;
      }
    }

    .error-message {
      font-size: 20px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      margin-bottom: 10px;
      max-width: 80%;
      line-height: 1.5;
      animation: errorTextFloat 3s ease-in-out infinite;
      position: relative;
      z-index: 2;
    }

    .error-tip {
      font-size: 15px;
      color: var(--el-text-color-regular);
      margin-bottom: 25px;
      font-style: italic;
      animation: errorTextFloat 3s 0.2s ease-in-out infinite;
      position: relative;
      z-index: 2;
    }

    .retry-button {
      height: 46px;
      min-width: 160px;
      border-radius: 23px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-weight: 600;
      font-size: 16px;
      padding: 0 28px;
      position: relative;
      overflow: hidden;
      background: var(--el-color-primary);
      border: none;
      color: white;
      box-shadow: 0 8px 20px rgba(0, 129, 255, 0.4),
        0 4px 8px rgba(0, 104, 204, 0.25),
        inset 0 2px 3px rgba(255, 255, 255, 0.4);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      transform: translateZ(0);
      z-index: 2;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: var(--el-color-primary-dark-2);
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &::after {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle, rgba(255, 255, 255, 0.4) 0%, transparent 60%);
        opacity: 0;
        transform: scale(0.5);
        transition: transform 0.6s ease-out, opacity 0.6s ease-out;
      }

      &:hover {
        transform: translateY(-3px) scale(1.03) translateZ(0);
        box-shadow: 0 12px 30px rgba(0, 129, 255, 0.5),
          0 6px 12px rgba(0, 104, 204, 0.4),
          inset 0 2px 4px rgba(255, 255, 255, 0.5);

        &::before {
          opacity: 1;
        }

        &::after {
          opacity: 1;
          transform: scale(1.5);
        }

        i {
          animation: retryButtonSpin 1s linear infinite;
        }
      }

      &:active {
        transform: scale(0.98) translateZ(0);
        box-shadow: 0 3px 8px rgba(0, 129, 255, 0.4),
          inset 0 1px 2px rgba(0, 0, 0, 0.1);
      }

      i {
        font-size: 16px;
        transition: transform 0.3s ease;
        z-index: 1;
        position: relative;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }

      span {
        position: relative;
        z-index: 1;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
      }
    }
  }

  // 侧边栏组件样式
  .sidebar-widget {
   background: var(--el-bg-color);;
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    margin-bottom: 20px;
    transition: transform 0.3s ease, box-shadow 0.3s ease;

    &:hover {
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    }

    .widget-header {
      padding: 15px;
      border-bottom: 1px solid #eaeaea;
      font-size: 16px;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 10px;
      position: relative;

      i {
        font-size: 16px;
        color: #1677FF;
      }

      .ad-tag {
        position: absolute;
        right: 15px;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.05);
        color: #94a3b8;
        font-size: 12px;
        padding: 2px 6px;
        border-radius: 4px;
        font-weight: normal;
      }
    }




    // 标签云样式
    &.tags-widget {
      .tags-content {
        padding: 15px;

        .tag-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;

          .tag-item {
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);

            &:hover {
              transform: translateY(-3px);
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
            }

            &.primary {
              background: rgba(22, 119, 255, 0.1);
              color: #1677FF;
              border: 1px solid rgba(22, 119, 255, 0.2);

              &:hover {
                background: rgba(22, 119, 255, 0.2);
              }
            }

            &.success {
              background: rgba(5, 150, 105, 0.1);
              color: #059669;
              border: 1px solid rgba(5, 150, 105, 0.2);

              &:hover {
                background: rgba(5, 150, 105, 0.2);
              }
            }

            &.warning {
              background: rgba(245, 158, 11, 0.1);
              color: #f59e0b;
              border: 1px solid rgba(245, 158, 11, 0.2);

              &:hover {
                background: rgba(245, 158, 11, 0.2);
              }
            }

            &.danger {
              background: rgba(239, 68, 68, 0.1);
              color: #ef4444;
              border: 1px solid rgba(239, 68, 68, 0.2);

              &:hover {
                background: rgba(239, 68, 68, 0.2);
              }
            }

            &.info {
              background: rgba(6, 182, 212, 0.1);
              color: #06b6d4;
              border: 1px solid rgba(6, 182, 212, 0.2);

              &:hover {
                background: rgba(6, 182, 212, 0.2);
              }
            }

            &.dark {
              background: rgba(30, 41, 59, 0.1);
              color: #1e293b;
              border: 1px solid rgba(30, 41, 59, 0.2);

              &:hover {
                background: rgba(30, 41, 59, 0.2);
              }
            }
          }
        }
      }
    }

    // 作者推荐样式
    &.author-recommend-widget {
      .author-recommend-content {
        padding: 15px;

        .recommend-item {
          display: flex;
          gap: 12px;
          padding: 10px 0;
          border-bottom: 1px solid #f1f5f9;
          cursor: pointer;
          transition: all 0.3s ease;

          &:last-child {
            border-bottom: none;
          }

          &:hover {
            transform: translateX(5px);

            .recommend-title {
              color: #1677FF;
            }

            .recommend-image img {
              transform: scale(1.05);
            }
          }

          .recommend-image {
            width: 80px;
            height: 80px;
            border-radius: 8px;
            overflow: hidden;
            flex-shrink: 0;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
              transition: transform 0.3s ease;
            }
          }

          .recommend-info {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;

            .recommend-title {
              font-size: 14px;
              font-weight: 500;
              color: #1e293b;
              line-height: 1.4;
              margin-bottom: 8px;
              transition: color 0.3s ease;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
            }

            .recommend-meta {
              display: flex;
              gap: 12px;
              color: #94a3b8;
              font-size: 12px;

              span {
                display: flex;
                align-items: center;
                gap: 4px;

                i {
                  font-size: 11px;
                }
              }
            }
          }
        }
      }
    }

    // 订阅卡片样式
    &.subscribe-widget {
      background: var(--el-bg-color);

      .subscribe-content {
        padding: 15px;

        .subscribe-text {
          font-size: 14px;
          color: #64748b;
          margin-bottom: 15px;
          text-align: center;
          line-height: 1.5;
        }

        .subscribe-form {
          display: flex;
          gap: 8px;
          margin-bottom: 10px;

          .subscribe-input {
            flex: 1;
            height: 40px;
            border-radius: 20px;
            border: 1px solid #e2e8f0;
            padding: 0 15px;
            font-size: 14px;
            transition: all 0.3s ease;
            outline: none;

            &:focus {
              border-color: #1677FF;
              box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
            }

            &::placeholder {
              color: #94a3b8;
            }
          }

          .subscribe-button {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            background: linear-gradient(135deg, #1677FF, #40a9ff);
            color: white;
            border: none;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s ease;
            box-shadow: 0 3px 8px rgba(22, 119, 255, 0.3);

            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 5px 12px rgba(22, 119, 255, 0.4);
            }

            &:active {
              transform: scale(0.95);
            }

            i {
              font-size: 16px;
            }
          }
        }

        .subscribe-privacy {
          text-align: center;
          font-size: 12px;
          color: #94a3b8;
        }
      }
    }

    // 作者信息部分
    &.author-widget {
      position: relative;
      overflow: visible;



      .author-profile {
        padding: 20px;

        .author-card {
          position: relative;
          margin-bottom: 20px;
          display: flex;
          align-items: center;
          padding: 15px;
          border-radius: 12px;
          background: linear-gradient(145deg, #f8fafc, #eef2f6);
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          animation: slideInUp 0.8s ease-out forwards;

          &::before {
            content: '';
            position: absolute;
            top: -30%;
            right: -20%;
            width: 200px;
            height: 200px;
            background: linear-gradient(135deg, rgba(22, 119, 255, 0.1), rgba(22, 119, 255, 0.05));
            border-radius: 50%;
            filter: blur(30px);
            z-index: 0;
            animation: float 10s ease-in-out infinite alternate;
          }

          &:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);

            &::before {
              animation-duration: 5s;
            }

            .avatar-badge {
              transform: rotate(360deg);
            }
          }



          .author-avatar {
            position: relative;
            z-index: 1;
            width: 60px;
            height: 60px;
            border-radius: 50%;
            overflow: visible;
            margin-right: 15px;
            flex-shrink: 0;
            transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

            &:hover {
              transform: scale(1.05) rotate(5deg);
            }

            .avatar-container {
              width: 60px;
              height: 60px;
              border-radius: 50%;
              overflow: hidden;
              position: relative;
              box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1),
                0 0 0 4px rgba(255, 255, 255, 0.8),
                0 0 0 0 rgba(22, 119, 255, 0.5);
              animation: pulseAvatar 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;

              &:hover {
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15),
                  0 0 0 4px rgba(255, 255, 255, 0.9),
                  0 0 0 8px rgba(22, 119, 255, 0.2);
              }

              :deep(.ant-avatar) {
                width: 100%;
                height: 100%;
                transition: transform 0.3s ease;

                &:hover {
                  transform: scale(1.05);
                }
              }
            }

            .avatar-highlight {
              position: absolute;
              top: 0;
              left: 0;
              right: 0;
              bottom: 0;
              background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.5), transparent 70%);
              border-radius: 50%;
              pointer-events: none;
              z-index: 2;
            }

            .avatar-badge {
              position: absolute;
              bottom: -5px;
              right: -5px;
              width: 24px;
              height: 24px;
              border-radius: 50%;
              background: linear-gradient(135deg, #1677FF, #40a9ff);
              display: flex;
              align-items: center;
              justify-content: center;
              color: white;
              font-size: 12px;
              box-shadow: 0 2px 6px rgba(22, 119, 255, 0.4);
              z-index: 3;
              transition: transform 0.5s ease;
              border: 2px solid white;

              i {
                animation: pulse 2s ease-in-out infinite;
              }
            }
          }

          .author-info {
            flex: 1;
            text-align: left;
            z-index: 1;
            overflow: hidden;

            .author-name {
              font-size: 18px;
              font-weight: 600;
              color: #1e293b;
              margin-bottom: 5px;
              display: flex;
              align-items: center;
              gap: 6px;
              transition: all 0.3s ease;
              transform: translateY(0);

              &:hover {
                transform: translateY(-2px);
              }

              .gold-icon {
                color: #ffd700;
                font-size: 14px;
                filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
                animation: shine 2s ease-in-out infinite;
              }

              &.text-member-gold {
                background: linear-gradient(45deg, #FFD700, #FFA500);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                font-weight: 700;
              }
            }

            .author-bio {
              font-size: 14px;
              color: #64748b;
              margin-bottom: 0;
              line-height: 1.5;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              transition: all 0.3s ease;
              transform: translateY(0);

              &:hover {
                -webkit-line-clamp: 3;
                color: #334155;
              }
            }
          }
        }




      }
    }

    // 目录部分
    &.toc-widget {
      .toc-container {
        padding: 15px;
        max-height: 300px;
        overflow-y: auto;

        .toc-list {
          list-style: none;
          padding: 0;
          margin: 0;

          .toc-item {
            padding: 6px 0;
            font-size: 14px;
            color: #64748b;
            cursor: pointer;
            transition: all 0.3s ease;
            border-left: 2px solid transparent;
            padding-left: 10px;

            &:hover {
              color: #0081FF;
              background: rgba(22, 119, 255, 0.05);
            }

            &.toc-active {
              color: #0081FF;
              border-left-color: #0081FF;
              background: rgba(0, 129, 255, 0.05);
              font-weight: 500;
            }

            &.toc-level-1 {
              padding-left: 10px;
              font-weight: 500;
            }

            &.toc-level-2 {
              padding-left: 20px;
            }

            &.toc-level-3 {
              padding-left: 30px;
            }

            &.toc-level-4 {
              padding-left: 40px;
            }

            &.toc-level-5,
            &.toc-level-6 {
              padding-left: 50px;
            }
          }
        }
      }

      .toc-empty {
        padding: 30px 0;
        text-align: center;

        i {
          font-size: 24px;
          color: #cbd5e1;
          margin-bottom: 10px;
        }

        p {
          font-size: 14px;
          color: #64748b;
        }
      }
    }


  }

  // 移动端悬浮菜单
  .floating-action-menu {
    position: fixed;
    left: 24px;
    bottom: 24px;
    z-index: 100;
    display: none;
    flex-direction: column;
    align-items: center;

    // 主按钮样式
    .main-button {
      width: 50px;
      height: 50px;
      border-radius: 50%;
      background: transparent;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      position: relative;
      z-index: 120;

      .button-inner {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background: linear-gradient(135deg, #1677FF, #40a9ff);
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 8px 20px rgba(22, 119, 255, 0.5),
          0 4px 10px rgba(22, 119, 255, 0.3),
          inset 0 2px 4px rgba(255, 255, 255, 0.3),
          inset 0 -2px 4px rgba(30, 58, 138, 0.2);
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        transform: translateZ(0);
        backface-visibility: hidden;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: -5px;
          left: -5px;
          right: -5px;
          bottom: -5px;
          background: linear-gradient(145deg, rgba(79, 70, 229, 0.4), rgba(59, 130, 246, 0.4));
          border-radius: 50%;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.4s ease;
          filter: blur(10px);
        }

        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.2), transparent 60%);
          pointer-events: none;
        }

        i {
          font-size: 24px;
          filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.3));
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      }

      &:hover {
        .button-inner {
          transform: scale(1.05) translateZ(0);
          background: linear-gradient(135deg, #40a9ff, #1677FF);
          box-shadow: 0 15px 30px rgba(22, 119, 255, 0.6),
            0 8px 20px rgba(22, 119, 255, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.3),
            inset 0 -2px 4px rgba(30, 58, 138, 0.2);

          &::before {
            opacity: 1;
          }

          i {
            transform: scale(1.1);
          }
        }
      }

      &:active {
        .button-inner {
          transform: scale(0.95) translateZ(0);
          background: linear-gradient(145deg, #0958d9, #1677FF);
          box-shadow: 0 5px 15px rgba(22, 119, 255, 0.4),
            inset 0 2px 4px rgba(255, 255, 255, 0.2),
            inset 0 -2px 4px rgba(30, 58, 138, 0.3);

          i {
            transform: scale(0.9);
          }
        }
      }
    }

    // 子菜单
    .menu-items {
      position: absolute;
      bottom: 70px;
      left: 8px;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 20px;
      pointer-events: none;
      opacity: 0;
      transform: translateY(20px);
      transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
      z-index: 121;

      .menu-item {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background: white;
        color: #64748b;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12),
          0 3px 8px rgba(0, 0, 0, 0.08),
          inset 0 1px 2px rgba(255, 255, 255, 0.5);
        cursor: pointer;
        transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        transform: scale(0.8) translateZ(0);
        backface-visibility: hidden;
        opacity: 0;
        overflow: hidden;
        pointer-events: none; // 默认禁用点击

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: radial-gradient(circle at center, rgba(99, 102, 241, 0.15), transparent 70%);
          border-radius: 50%;
          transform: scale(0);
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
          z-index: 0;
        }

        &::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), transparent 70%);
          pointer-events: none;
        }

        i {
          position: relative;
          z-index: 1;
          font-size: 20px;
          filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
          transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        &:hover {
          transform: translateY(-5px) scale(1.1) translateZ(0);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2),
            0 8px 15px rgba(0, 0, 0, 0.15),
            inset 0 1px 3px rgba(255, 255, 255, 0.7);
          color: #1677FF;

          &::before {
            transform: scale(1.5);
          }

          i {
            transform: scale(1.1) rotate(10deg);
          }
        }

        &:active {
          transform: scale(0.95) translateZ(0);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1),
            inset 0 1px 1px rgba(255, 255, 255, 0.4);

          i {
            transform: scale(0.9);
          }
        }

        &.active {
          background: rgba(22, 119, 255, 0.1);
          color: #1677FF;
          box-shadow: 0 8px 25px rgba(22, 119, 255, 0.25),
            0 4px 12px rgba(22, 119, 255, 0.15),
            inset 0 1px 2px rgba(255, 255, 255, 0.5);

          &::before {
            transform: scale(1);
            background: radial-gradient(circle at center, rgba(22, 119, 255, 0.3), rgba(22, 119, 255, 0.1));
          }
        }

        // 点赞按钮特殊样式
        &.like-button.active {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          box-shadow: 0 8px 25px rgba(239, 68, 68, 0.25),
            0 4px 12px rgba(239, 68, 68, 0.15),
            inset 0 1px 2px rgba(255, 255, 255, 0.5);

          &::before {
            background: radial-gradient(circle at center, rgba(239, 68, 68, 0.3), rgba(239, 68, 68, 0.1));
          }

          &:hover {
            color: #ef4444;
          }
        }

        // 收藏按钮特殊样式
        &.bookmark-button.active {
          background: rgba(245, 158, 11, 0.1);
          color: #f59e0b;
          box-shadow: 0 8px 25px rgba(245, 158, 11, 0.25),
            0 4px 12px rgba(245, 158, 11, 0.15),
            inset 0 1px 2px rgba(255, 255, 255, 0.5);

          &::before {
            background: radial-gradient(circle at center, rgba(245, 158, 11, 0.3), rgba(245, 158, 11, 0.1));
          }

          &:hover {
            color: #f59e0b;
          }
        }
      }
    }

    // 菜单背景
    .menu-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0);
      z-index: 110;
      pointer-events: auto;
      transition: background 0.4s ease, backdrop-filter 0.4s ease;
    }

    // 展开状态样式
    &.menu-expanded {
      .main-button {
        .button-inner {
          background: linear-gradient(145deg, #94a3b8, #64748b);
          box-shadow: 0 10px 25px rgba(100, 116, 139, 0.5),
            0 6px 12px rgba(100, 116, 139, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.3),
            inset 0 -2px 4px rgba(71, 85, 105, 0.3);

          i {
            transform: rotate(45deg);
          }

          &:hover {
            background: linear-gradient(145deg, #9ca3af, #71809a);
          }
        }
      }

      .menu-items {
        opacity: 1;
        transform: translateY(0);
        pointer-events: auto; // 展开时启用整个菜单的点击

        .menu-item {
          opacity: 1;
          transform: scale(1) translateZ(0);
          pointer-events: auto; // 展开时启用每个按钮的点击

          &:nth-child(1) {
            transition-delay: 0.05s;
            transform: translateY(-70px) translateZ(0);

            &:hover {
              transform: translateY(-75px) translateX(5px) scale(1.1) translateZ(0);
            }
          }

          &:nth-child(2) {
            transition-delay: 0.1s;
            transform: translateY(-140px) translateZ(0);

            &:hover {
              transform: translateY(-145px) translateX(5px) scale(1.1) translateZ(0);
            }
          }

          &:nth-child(3) {
            transition-delay: 0.15s;
            transform: translateY(-210px) translateZ(0);

            &:hover {
              transform: translateY(-215px) translateX(5px) scale(1.1) translateZ(0);
            }
          }

          &:nth-child(4) {
            transition-delay: 0.2s;
            transform: translateY(-280px) translateZ(0);

            &:hover {
              transform: translateY(-285px) translateX(5px) scale(1.1) translateZ(0);
            }
          }

          &:nth-child(5) {
            transition-delay: 0.25s;
            transform: translateY(-350px) translateZ(0);

            &:hover {
              transform: translateY(-355px) translateX(5px) scale(1.1) translateZ(0);
            }
          }

          &:nth-child(6) {
            transition-delay: 0.3s;
            transform: translateY(-420px) translateZ(0);

            &:hover {
              transform: translateY(-425px) translateX(5px) scale(1.1) translateZ(0);
            }
          }
        }
      }

      .menu-backdrop {
        background: rgba(15, 23, 42, 0.3);
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);
      }
    }

    // 媒体查询，小屏幕下显示
    @media (max-width: 768px) {
      display: flex;
      left: 16px;
      bottom: 16px;
    }

    // 动画效果增强
    .animate__fadeInUp {
      animation-name: customFadeInUp;
      animation-duration: 0.6s;
      animation-fill-mode: both;
    }

    .animate__fadeOut {
      animation-name: customFadeOut;
      animation-duration: 0.3s;
      animation-fill-mode: both;
    }

    @keyframes customFadeInUp {
      from {
        opacity: 0;
        transform: translate3d(0, 30px, 0);
      }

      to {
        opacity: 1;
        transform: translate3d(0, 0, 0);
      }
    }

    @keyframes customFadeOut {
      from {
        opacity: 1;
      }

      to {
        opacity: 0;
      }
    }
  }

  // 移动端目录抽屉
  .mobile-toc-drawer {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
   background: var(--el-bg-color);;
    z-index: 150;
    border-radius: 16px 16px 0 0;
    box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
    transform: translateY(100%);
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    max-height: 70vh;
    display: flex;
    flex-direction: column;

    &.drawer-open {
      transform: translateY(0);
    }

    .drawer-header {
      padding: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #eaeaea;

      .drawer-title {
        font-size: 16px;
        font-weight: 600;
        color: #1e293b;
      }

      .drawer-close {
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        background: #f1f5f9;
        cursor: pointer;

        i {
          font-size: 14px;
          color: #64748b;
        }
      }
    }

    .drawer-content {
      flex: 1;
      overflow-y: auto;
      padding: 10px 0;

      .mobile-toc-list {
        list-style: none;
        padding: 0 16px;
        margin: 0;

        .toc-item {
          padding: 12px 0;
          font-size: 14px;
          color: #64748b;
          cursor: pointer;
          border-bottom: 1px solid #f1f5f9;

          &:last-child {
            border-bottom: none;
          }

          &.toc-active {
            color: #1677FF;
            font-weight: 500;
          }

          &.toc-level-1 {
            font-weight: 500;
          }

          &.toc-level-2 {
            padding-left: 16px;
          }

          &.toc-level-3 {
            padding-left: 32px;
          }

          &.toc-level-4,
          &.toc-level-5,
          &.toc-level-6 {
            padding-left: 48px;
          }
        }
      }

      .toc-empty {
        padding: 30px 0;
        text-align: center;

        i {
          font-size: 24px;
          color: #cbd5e1;
          margin-bottom: 10px;
        }

        p {
          font-size: 14px;
          color: #64748b;
        }
      }
    }
  }

  // 移动端遮罩层
  .mobile-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.4);
    z-index: 140;
    animation: fadeIn 0.3s forwards;
  }

  // 动画关键帧
  @keyframes slideUp {
    from {
      transform: translateY(100%);
    }

    to {
      transform: translateY(0);
    }
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }

    100% {
      transform: rotate(360deg);
    }
  }

  @keyframes pulse {
    0% {
      transform: scale(1);
      opacity: 0.8;
    }

    50% {
      transform: scale(1.1);
      opacity: 1;
    }

    100% {
      transform: scale(1);
      opacity: 0.8;
    }
  }

  @keyframes shine {
    0% {
      filter: drop-shadow(0 1px 2px rgba(255, 215, 0, 0.3));
    }

    50% {
      filter: drop-shadow(0 2px 4px rgba(255, 215, 0, 0.6));
    }

    100% {
      filter: drop-shadow(0 1px 2px rgba(255, 215, 0, 0.3));
    }
  }

  @keyframes floatElement {
    0% {
      transform: translate(0, 0);
    }

    50% {
      transform: translate(10px, -10px);
    }

    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes pulseAvatar {
    0% {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1),
        0 0 0 4px rgba(255, 255, 255, 0.8),
        0 0 0 0 rgba(22, 119, 255, 0);
    }

    50% {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15),
        0 0 0 4px rgba(255, 255, 255, 0.9),
        0 0 0 8px rgba(22, 119, 255, 0);
    }

    100% {
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1),
        0 0 0 4px rgba(255, 255, 255, 0.8),
        0 0 0 0 rgba(22, 119, 255, 0);
    }
  }

  @keyframes slideInUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }

    to {
      transform: translateY(0);
      opacity: 1;
    }
  }

  @keyframes bounce {

    0%,
    100% {
      transform: translateY(0);
    }

    50% {
      transform: translateY(-8px);
    }
  }

  @keyframes float {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }

    50% {
      transform: translate(15px, -15px) rotate(5deg);
    }

    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }

  @keyframes gradientShift {
    0% {
      background-position: 0% 50%;
    }

    50% {
      background-position: 100% 50%;
    }

    100% {
      background-position: 0% 50%;
    }
  }

  @keyframes errorIconPulse {

    0%,
    100% {
      transform: scale(1) rotate(0deg);
      filter: drop-shadow(0 6px 12px rgba(239, 68, 68, 0.25));
    }

    25% {
      transform: scale(1.05) rotate(-3deg);
      filter: drop-shadow(0 8px 16px rgba(239, 68, 68, 0.35));
    }

    50% {
      transform: scale(1.1) rotate(0deg);
      filter: drop-shadow(0 10px 20px rgba(239, 68, 68, 0.45));
    }

    75% {
      transform: scale(1.05) rotate(3deg);
      filter: drop-shadow(0 8px 16px rgba(239, 68, 68, 0.35));
    }
  }

  @keyframes errorIconGlow {

    0%,
    100% {
      opacity: 0.4;
      transform: translate(-50%, -50%) scale(1.25);
    }

    50% {
      opacity: 0.8;
      transform: translate(-50%, -50%) scale(1.5);
    }
  }

  @keyframes errorTextFloat {

    0%,
    100% {
      transform: translateY(0);
      opacity: 1;
    }

    25% {
      transform: translateY(-2px);
      opacity: 0.95;
    }

    50% {
      transform: translateY(-5px);
      opacity: 0.9;
    }

    75% {
      transform: translateY(-2px);
      opacity: 0.95;
    }
  }

  @keyframes retryButtonSpin {
    0% {
      transform: rotate(0deg) scale(1);
    }

    50% {
      transform: rotate(180deg) scale(1.2);
    }

    100% {
      transform: rotate(360deg) scale(1);
    }
  }

  @keyframes ufoFloat {
    0% {
      transform: translate(-50%, 0) rotate(-5deg);
    }

    33% {
      transform: translate(-45%, -8px) rotate(0deg);
    }

    66% {
      transform: translate(-55%, -12px) rotate(5deg);
    }

    100% {
      transform: translate(-50%, 0) rotate(-5deg);
    }
  }

  @keyframes ufoLight {

    0%,
    100% {
      opacity: 0.5;
      transform: scale(0.8);
      box-shadow: 0 0 5px 2px rgba(64, 169, 255, 0.4);
    }

    50% {
      opacity: 0.9;
      transform: scale(1.1);
      box-shadow: 0 0 8px 4px rgba(64, 169, 255, 0.8);
    }
  }

  @keyframes ufoBeam {

    0%,
    100% {
      opacity: 0.2;
      height: 50px;
      filter: blur(4px);
    }

    50% {
      opacity: 0.5;
      height: 70px;
      filter: blur(6px);
    }
  }

  @keyframes astronautFloat {
    0% {
      transform: translate(0, 0) rotate(0deg);
    }

    25% {
      transform: translate(8px, -12px) rotate(5deg);
    }

    50% {
      transform: translate(15px, 0) rotate(0deg);
    }

    75% {
      transform: translate(8px, 12px) rotate(-5deg);
    }

    100% {
      transform: translate(0, 0) rotate(0deg);
    }
  }

  @keyframes astronautWave {

    0%,
    100% {
      transform: rotate(0deg);
    }

    25% {
      transform: rotate(15deg);
    }

    50% {
      transform: rotate(30deg);
    }

    75% {
      transform: rotate(15deg);
    }
  }

  @keyframes starTwinkle {

    0%,
    100% {
      opacity: 0.3;
      transform: scale(0.8);
      filter: blur(0.5px);
    }

    50% {
      opacity: 1;
      transform: scale(1.3);
      filter: blur(0px);
    }
  }

  @keyframes iconPulse {
    0% {
      transform: scale(1);
    }

    50% {
      transform: scale(1.2);
    }

    100% {
      transform: scale(1);
    }
  }
}

// 文章底部广告横幅样式
.article-footer-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--el-bg-color);
  box-shadow: 0 -4px 20px var(--el-box-shadow);
  z-index: 90;
  padding: 15px 0;
  transform: translateY(0);
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);

  &.hidden {
    transform: translateY(100%);
  }

  .banner-content {
    display: flex;
    align-items: center;
    gap: 20px;
    position: relative;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 15px;
      align-items: flex-start;

      .banner-image {
        margin: 0 auto;
      }
    }

    .banner-close {
      position: absolute;
      top: -5px;
      right: 0;
      width: 24px;
      height: 24px;
      border-radius: 50%;
      background: rgba(0, 0, 0, 0.05);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        background: rgba(0, 0, 0, 0.1);
        transform: rotate(90deg);
      }

      i {
        font-size: 12px;
        color: #64748b;
      }
    }

    .banner-image {
      width: 120px;
      height: 120px;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .banner-info {
      flex: 1;
      min-width: 0;

      .banner-title {
        font-size: 18px;
        font-weight: 600;
        color: #1e293b;
        margin-bottom: 6px;
      }

      .banner-description {
        font-size: 14px;
        color: #64748b;
        margin-bottom: 15px;
        line-height: 1.5;
      }

      .banner-actions {
        display: flex;
        align-items: center;
        gap: 20px;

        @media (max-width: 576px) {
          flex-direction: column;
          align-items: flex-start;
          gap: 15px;
        }

        .banner-cta {
          height: 40px;
          padding: 0 20px;
          background: linear-gradient(135deg, #ffd700, #ff9d00);
          color: white;
          border: none;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 8px;
          box-shadow: 0 4px 10px rgba(255, 157, 0, 0.3);

          &:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 15px rgba(255, 157, 0, 0.4);
          }

          &:active {
            transform: translateY(-1px);
          }

          i {
            font-size: 14px;
          }
        }

        .banner-users {
          display: flex;
          flex-direction: column;
          gap: 5px;

          .user-avatars {
            display: flex;
            align-items: center;

            .user-avatar {
              width: 30px;
              height: 30px;
              border-radius: 50%;
              overflow: hidden;
              border: 2px solid white;
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
              margin-right: -10px;

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
              }

              &.more {
                background: #f1f5f9;
                color: #64748b;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 600;
              }
            }
          }

          .user-text {
            font-size: 12px;
            color: #64748b;
          }
        }
      }
    }
  }
}



// 阅读进度指示器
.reading-progress-indicator {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: linear-gradient(to right, #1677FF, #40a9ff);
  z-index: 200;
  transition: width 0.1s ease;
  box-shadow: 0 1px 3px rgba(22, 119, 255, 0.3);
}

// 动画关键帧
@keyframes shimmer-flow {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }

  100% {
    transform: translateX(100%) rotate(45deg);
  }
}

// 相关文章区域样式增强
:deep(.article-related) {
  margin-top: 40px;

  .related-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid #eaeaea;

    .related-title {
      font-size: 18px;
      font-weight: 600;
      color: #1e293b;
      display: flex;
      align-items: center;
      gap: 8px;

      i {
        color: #1677FF;
      }
    }

    .view-more {
      font-size: 14px;
      color: #64748b;
      display: flex;
      align-items: center;
      gap: 4px;
      transition: all 0.3s ease;

      &:hover {
        color: #1677FF;
        transform: translateX(2px);
      }
    }
  }

  .related-list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;

    @media (max-width: 992px) {
      grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
      grid-template-columns: 1fr;
    }

    .related-item {
     background: var(--el-bg-color);;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      cursor: pointer;

      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);

        .item-image img {
          transform: scale(1.05);
        }

        .item-title {
          color: #1677FF;
        }
      }

      .item-image {
        height: 140px;
        overflow: hidden;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }
      }

      .item-info {
        padding: 15px;

        .item-title {
          font-size: 16px;
          font-weight: 500;
          color: #1e293b;
          margin-bottom: 8px;
          line-height: 1.4;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          transition: color 0.3s ease;
        }

        .item-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 12px;
          color: #94a3b8;

          .item-date {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .item-stats {
            display: flex;
            align-items: center;
            gap: 8px;

            span {
              display: flex;
              align-items: center;
              gap: 4px;

              i {
                font-size: 11px;
              }
            }
          }
        }
      }
    }
  }
}



// 动画关键帧
@keyframes shimmer-flow {
  0% {
    transform: translateX(-100%) rotate(45deg);
  }

  100% {
    transform: translateX(100%) rotate(45deg);
  }
}
</style>