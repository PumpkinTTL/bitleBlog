<template>
  <div class="blog-page">
    <div class="page-container">
      <!-- 左侧边栏 -->
      <div class="left-sidebar" :class="{'mobile-open': isMobileMenuOpen}">
        <!-- 移动端头部 -->
        <div class="mobile-sidebar-header">
          <div class="header-logo">
            <i class="fas fa-layer-group"></i>
            <span>BitlEBlog</span>
          </div>
          <div class="mobile-close-btn" @click="toggleMobileMenu">
            <i class="fas fa-times"></i>
          </div>
        </div>

        <!-- 关于本站 -->
        <div class="sidebar-section">
          <h3 class="section-title">
            <i class="fas fa-info-circle"></i>
            关于本站
          </h3>
          <div class="about-author">
            <div class="site-info-header">
              <div class="site-logo">
                <i class="fas fa-code-branch"></i>
              </div>
              <div class="site-header-info">
                <h4 class="author-name">南瓜<span class="dot"></span><span class="gold-text">技术小站 <i class="fas fa-crown"></i></span></h4>
                <div class="site-meta">
                  <span class="site-badge"><i class="fas fa-calendar-day"></i> 2023年创立</span>
                  <span class="site-badge gold"><i class="fas fa-award"></i> 优质博客</span>
                </div>
              </div>
            </div>

            <p class="author-bio">一个专注于分享Web开发前沿、实用技术和深度思考的独立博客。探索、学习、共同成长。</p>

            <div class="site-stats">
              <div class="stat-item">
                <div class="stat-value">234</div>
                <div class="stat-label">总文章</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">56</div>
                <div class="stat-label">技术专题</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">1.2k</div>
                <div class="stat-label">总阅读量</div>
              </div>
            </div>

            <div class="site-features">
              <div class="feature-item">
                <i class="fas fa-laptop-code"></i>
                <span>前沿技术分享</span>
                <div class="feature-badge"><i class="fas fa-check"></i></div>
              </div>
              <div class="feature-item">
                <i class="fas fa-project-diagram"></i>
                <span>最佳实践案例</span>
                <div class="feature-badge"><i class="fas fa-star"></i></div>
              </div>
              <div class="feature-item">
                <i class="fas fa-graduation-cap"></i>
                <span>深度技术教程</span>
                <div class="feature-badge"><i class="fas fa-check"></i></div>
              </div>
            </div>

            <div class="author-socials">
              <a href="#" target="_blank" title="本站源码"><i class="fab fa-github"></i></a>
              <a href="#" target="_blank" title="RSS订阅"><i class="fas fa-rss"></i></a>
              <a href="#" target="_blank" title="联系我们"><i class="fas fa-envelope"></i></a>
              <a href="#" target="_blank" title="给我点赞"><i class="fas fa-heart"></i></a>
            </div>
          </div>
        </div>

        <!-- 本月热门 -->
        <div class="sidebar-section">
          <h3 class="section-title">
            <i class="fas fa-fire"></i>
            本月热门
          </h3>
          <div class="monthly-hot-articles-list">
            <a v-for="(article, index) in monthlyHotArticles" :key="index"
               class="hot-article-item" @click.prevent="navigateToBlogDetail(article.id)">
              <div class="hot-rank-wrapper">
                <div class="hot-rank-badge" :class="`rank-${index + 1}`">
                  <span class="rank-number">{{ index + 1 }}</span>
                  <span class="rank-crown" v-if="index === 0"><i class="fas fa-crown"></i></span>
                  <span class="rank-medal" v-else-if="index === 1"><i class="fas fa-medal"></i></span>
                  <span class="rank-award" v-else-if="index === 2"><i class="fas fa-award"></i></span>
                </div>
              </div>
              <div class="hot-article-content">
                <div class="hot-title-row">
                  <span class="hot-title">{{ article.title }}</span>
                  <span class="hot-trend" v-if="index < 3"><i class="fas fa-arrow-trend-up"></i></span>
                </div>
                <div class="hot-meta">
                  <span class="hot-views"><i class="fas fa-eye"></i> {{ article.views }}</span>
                  <span class="hot-date"><i class="fas fa-clock"></i> 3天前</span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>

      <!-- 主内容区域 -->
      <div class="main-area">
        <div class="main-content">
          <!-- 文章头部 -->
          <div class="minimal-article-header">
            <div class="compact-header-bar">
              <div class="header-left">
                <h2 class="section-title">
                  <i class="fas fa-newspaper"></i>
                  <span>最新文章</span>
                  <span class="article-count">{{ totalArticles }}</span>
                </h2>
              </div>

              <div class="header-right">
                <div class="search-box">
                  <el-input
                    v-model="searchKeyword"
                    placeholder="搜索文章..."
                    class="search-input"
                    @keyup.enter="handleSearch(searchKeyword)"
                  >
                    <template #prefix>
                      <el-icon><Search /></el-icon>
                    </template>
                    <template #append>
                        <el-button type="primary" @click="handleSearch(searchKeyword)">搜索</el-button>
                      </template>
                    </el-input>
                </div>

                <div class="filter-dropdown">
                  <el-dropdown @command="handleFilterChange">
                    <el-button class="filter-btn">
                      <el-icon><Filter /></el-icon>
                      <span>筛选</span>
                      <el-icon><ArrowDown /></el-icon>
                    </el-button>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item command="all">全部文章</el-dropdown-item>
                        <el-dropdown-item command="recommended">推荐文章</el-dropdown-item>
                        <el-dropdown-item command="latest">最新发布</el-dropdown-item>
                        <el-dropdown-item command="popular">热门文章</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>

            <!-- 分类导航 -->
            <div class="inline-categories">
              <!-- 桌面端分类 -->
              <div class="desktop-categories">
                <a v-for="(category, index) in categoryList" :key="index"
                   :class="['category-tag', {'active': activeCategory === index}]"
                   @click.prevent="handleCategoryChange(index)">
                  <font-awesome-icon :icon="getCategoryIconArray(category)" />
                  <span>{{ category.name }}</span>
                  <span class="tag-count">{{ category.count }}</span>
                </a>
              </div>

              <!-- 移动端分类选择器 -->
              <div class="mobile-category-selector">
                <el-select v-model="activeCategory" placeholder="选择分类" @change="handleCategoryChange">
                  <el-option v-for="(category, index) in categoryList" :key="index"
                             :label="category.name" :value="index">
                    <div class="option-content">
                      <div class="option-icon">
                        <font-awesome-icon :icon="getCategoryIconArray(category)" />
                      </div>
                      <span class="option-name">{{ category.name }}</span>
                    </div>
                  </el-option>
                </el-select>
              </div>
            </div>
          </div>

          <!-- 文章列表 -->
          <div class="article-list">
            <!-- 加载状态 -->
            <div v-if="isLoading" class="loading-container">
              <div class="loading-spinner">
                <i class="fas fa-circle-notch fa-spin"></i>
              </div>
              <p>加载中...</p>
            </div>

            <!-- 空状态 -->
            <div v-else-if="articleList.length === 0" class="empty-container">
              <i class="fas fa-inbox"></i>
              <p>暂无相关文章</p>
            </div>

            <div v-else class="articles">
              <!-- 文章项 - 使用服务器返回的数据但保持原始样式 -->
              <div class="article-card animate-item" v-for="(article, index) in articleList" :key="article.id"
                :class="{'featured-article': article.is_top === 1 || article.is_recommend === 1}"
                :style="`cursor: pointer; animation-delay: ${0.2 + index * 0.1}s;`"
                @click="navigateToBlogDetail(article.id)">
                <div class="card-badge" v-if="article.is_top === 1 || article.is_recommend === 1">
                  <i class="fas fa-crown"></i>
                  <span>推荐阅读</span>
                </div>
                <div class="article-content">
                  <div class="article-header">
                    <div class="header-tags">
                      <span v-if="article.is_top === 1" class="bitle-tag tag-top"><i
                          class="fas fa-thumbtack"></i>置顶</span>
                      <span v-if="article.is_recommend === 1" class="bitle-tag tag-recommend"><i
                          class="fas fa-star"></i>推荐</span>
                      <span v-if="article.is_original === 1" class="bitle-tag tag-original"><i
                          class="fas fa-copyright"></i>原创</span>
                      <span
                        v-if="(article.favorites_count && article.favorites_count > 10) || (article.likes_count && article.likes_count > 100)"
                        class="bitle-tag tag-hot"><i class="fas fa-fire"></i>热门</span>
                      <span v-if="article.category && article.category.slug === 'ruanjian'"
                        class="bitle-tag tag-featured"><i class="fas fa-award"></i>精华</span>
                    </div>

                    <h3 class="article-title">
                      <a href="#">{{ article.title }}</a>
                    </h3>
                  </div>

                  <div class="article-body">
                    <div class="article-text">
                      <p class="article-desc">{{ article.content || article.description || article.subtitle }}</p>

                      <div class="article-author">
                        <a-avatar :size="24" :src="article.author?.avatar" />
                        <span class="author-name" :class="getAuthorClass(article.author)">
                          {{ article.author?.username || article.author?.nickname }}
                          <!-- <span v-if="isSuperAdmin(article.author)" class="tag-super-admin">
                            <i class="fas fa-crown"></i>
                          </span> -->
                          <i v-if="isGoldMember(article.author)" class="fas fa-crown gold-icon"></i>
                        </span>
                        <span class="post-time">
                          <i class="far fa-calendar-alt"></i>
                          {{ formatDate(article.publish_time) }}
                        </span>
                      </div>
                    </div>

                    <div class="article-thumbnail" v-if="article.cover_image">
                      <img :src="article.cover_image" :alt="article.title">
                      <div class="thumbnail-overlay">
                        <div class="read-more"><i class="fas fa-book-open"></i> 阅读全文</div>
                      </div>
                    </div>
                  </div>

                  <div class="article-footer">
                    <div class="article-meta">
                      <div class="meta-item">
                        <i class="fas fa-eye"></i>
                        {{ article.read_time ? `预计${article.read_time}分钟阅读` : (article.word_count ?
                        formatReadCount(article.word_count) : '0') + ' 阅读' }}
                      </div>
                      <div class="meta-item">
                        <i class="fas fa-thumbs-up"></i>
                        {{ article.likes_count || 0 }} 点赞
                      </div>
                      <div class="meta-item">
                        <i class="fas fa-comment"></i>
                        {{ article.comments_count || 0 }} 评论
                      </div>
                    </div>
                    <div class="bitle-tags">
                      <!-- <span v-if="article.category" class="bitle-tag">
                        <i class="fas fa-folder"></i> {{ article.category.name }}
                      </span> -->
                      <span v-for="(tag, tagIndex) in article.tags" :key="tagIndex"
                        :class="['bitle-tag', getTagClass(tagIndex)]" :style="getTagStyle(tagIndex)">
                        <i class="fas fa-tag"></i> {{ tag.name }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 分页控件更新 -->
          <div class="pagination-container animate-item" style="animation-delay: 0.8s;">
            <a-pagination v-model:current="currentPage" :total="totalArticles" :pageSize="articleParams.page_size"
              show-quick-jumper :show-total="showTotal" @change="handlePageChange" />
          </div>
        </div>
      </div>

      <!-- Right sidebar content -->
      <!-- <RightSidebar 
        class="right-sidebar animate-item" 
        style="animation-delay: 0.2s;"
        :is-mobile-view="isMobileMenuOpen"
        @post-click="handleRightSidebarPostClick"
        @topic-click="handleRightSidebarTopicClick"
        @subscribe="handleRightSidebarSubscribe"
        @cta-click="handleRightSidebarCTAClick"
      /> -->
    </div>

    <!-- Floating menu button for mobile -->
    <div class="mobile-menu-toggle animate-item" :class="{'active': isMobileMenuOpen}" style="animation-delay: 1.2s;"
      @click="toggleMobileMenu">
      <i class="fas fa-bars"></i>
    </div>

    <BackToTop class="animate-item" style="animation-delay: 1.5s;" />

    <!-- Overlay for mobile menu -->
    <div class="mobile-overlay" v-if="isMobileMenuOpen" @click="toggleMobileMenu"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { BackToTop } from '@/components/index';
import { message } from 'ant-design-vue';
import { Search, Filter, ArrowDown } from '@element-plus/icons-vue';
import { getArticleListR } from '@/request/article';
import { getCategoryListR } from '@/request/category';

// 类型定义
interface Article {
  id: number;
  title: string;
  subtitle?: string;
  content?: string;
  cover_image?: string;
  is_top?: number;
  is_recommend?: number;
  is_original?: number;
  favorites_count?: number;
  likes_count?: number;
  comments_count?: number;
  read_time?: number;
  word_count?: number;
  publish_time?: string;
  description?: string;
  category?: {
    id: number;
    name: string;
    slug: string;
  };
  author?: {
    id: number;
    username: string;
    nickname?: string;
    avatar?: string;
    roles?: any[];
  };
  tags?: Array<{
    id: number;
    name: string;
  }>;
}

interface Category {
  id: number;
  name: string;
  icon?: string;
  count?: number;
}




interface ArticleParams {
  page: number;
  page_size: number;
  category_id?: number;
  title?: string;
  is_recommend?: number;
  is_top?: number;
}

// 响应式变量
const activeCategory = ref(0);
const searchKeyword = ref('');
const isMobileMenuOpen = ref(false);
const activeFilter = ref('all');
const currentPage = ref(1);
const totalArticles = ref(0);
const isLoading = ref(false);
const articleList = ref<Article[]>([]);
const categoryList = ref<Category[]>([]);

// 文章请求参数
const articleParams = ref<ArticleParams>({
  page: 1,
  page_size: 10,
});

// 热门文章数据
const monthlyHotArticles = ref([
  { title: '深入理解 Vite 核心构建原理', views: '2.5k', id: 101 },
  { title: 'Vue 3 + TypeScript 项目最佳实践', views: '1.9k', id: 102 },
  { title: '现代 CSS 布局解决方案：Grid vs Flexbox', views: '1.6k', id: 103 },
  { title: '如何优化 Web 应用的首次加载速度', views: '1.2k', id: 104 },
  { title: '前端工程化：从入门到进阶', views: '980', id: 105 }
]);



// 获取文章数据
const initArticleData = async (params: ArticleParams): Promise<void> => {
  try {
    isLoading.value = true;
    const res = await getArticleListR(params);

    // 根据新的API响应格式解析数据
    const apiRes = res as unknown as {
      code: number;
      msg: string;
      data: {
        list: any[];
        pagination: {
          total: number;
          current: number;
          page_size: number;
          pages: number;
        };
      };
    };

    if (apiRes && apiRes.code === 200) {
      articleList.value = apiRes.data.list || [];
      totalArticles.value = apiRes.data.pagination.total || 0;
      currentPage.value = apiRes.data.pagination.current || 1;
    } else {
      message.error(apiRes?.msg || '获取文章列表失败');
    }
  } catch (error) {
    console.error('获取文章列表出错:', error);
    message.error('获取文章列表出错');
  } finally {
    isLoading.value = false;
  }
};

// 处理分页变化
const handlePageChange = (page: number, pageSize: number): void => {
  articleParams.value.page = page;
  articleParams.value.page_size = pageSize;
  initArticleData(articleParams.value);
  // 滚动到顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 处理分类变化
const handleCategoryChange = (index: number): void => {
  activeCategory.value = index;

  // 如果选择"全部文章"，则不传递category_id参数
  articleParams.value.category_id = index === 0 ? undefined : categoryList.value[index]?.id;
  articleParams.value.page = 1; // 切换分类时重置为第一页
  initArticleData(articleParams.value);
};



// 处理搜索
const handleSearch = (value: string): void => {
  articleParams.value.title = value || searchKeyword.value;
  articleParams.value.page = 1; // 搜索时重置为第一页
  initArticleData(articleParams.value);
  message.info(`搜索: ${value || searchKeyword.value}`);
};

// 处理筛选
const handleFilterChange = (command: string): void => {
  activeFilter.value = command;
  articleParams.value.page = 1; // 筛选时重置为第一页

  // 根据筛选类型设置参数
  switch (command) {
    case 'all':
      delete articleParams.value.is_recommend;
      delete articleParams.value.is_top;
      break;
    case 'recommended':
      articleParams.value.is_recommend = 1;
      delete articleParams.value.is_top;
      break;
    case 'latest':
      delete articleParams.value.is_recommend;
      delete articleParams.value.is_top;
      // 可以添加按时间排序的参数
      break;
    case 'popular':
      delete articleParams.value.is_recommend;
      articleParams.value.is_top = 1;
      break;
  }

  initArticleData(articleParams.value);
  message.info(`筛选: ${getFilterLabel(command)}`);
};

// 获取筛选标签
const getFilterLabel = (command: string): string => {
  const labels: Record<string, string> = {
    all: '全部文章',
    recommended: '推荐文章',
    latest: '最新发布',
    popular: '热门文章'
  };
  return labels[command] || '全部文章';
};

// 标签类样式
const tagClasses = ['tag-recommend', 'tag-featured', 'tag-original', 'tag-remote', 'tag-hot'];

const getTagClass = (index: number): string => {
  return tagClasses[index % tagClasses.length];
};

// 分页总数显示格式
const showTotal = (total: number): string => {
  return `共 ${total} 篇文章`;
};

// Toggle mobile menu function
const toggleMobileMenu = (): void => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// 生命周期
onMounted(async (): Promise<void> => {
  await initCategoryData();
  await initArticleData(articleParams.value);
});



// 辅助函数部分
// 为Author添加辅助函数
const getAuthorClass = (author: any): string => {
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

const isGoldMember = (author: any): boolean => {
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

// 格式化日期
const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return '';
  // 只返回日期部分
  return dateString.split(' ')[0];
};

// 格式化阅读计数
const formatReadCount = (count: number | undefined): string => {
  if (!count) return '0';
  if (count > 1000) {
    return (count / 1000).toFixed(1) + 'k';
  }
  return count.toString();
};

// Tag background colors for regular tags
const tagColors = [
  'linear-gradient(45deg, #1677ff, #69b4ff)',
  'linear-gradient(45deg, #52c41a, #95de64)',
  'linear-gradient(45deg, #722ed1, #b37feb)',
  'linear-gradient(45deg, #13c2c2, #87e8de)',
  'linear-gradient(45deg, #fa8c16, #ffd591)'
];

const getTagStyle = (index: number) => {
  return {
    background: tagColors[index % tagColors.length]
  };
};

// 添加判断超级管理员的辅助函数




// 获取分类数据
const initCategoryData = async (): Promise<void> => {
  try {
    const res = await getCategoryListR({});
    
    // 根据新的API响应格式解析数据
    const apiRes = res as unknown as {
      code: number;
      msg: string;
      data: {
        list: any[];
        pagination: {
          total: number;
          current: number;
          page_size: number;
        };
      };
    };

    if (apiRes && apiRes.code === 200) {
      // 添加"全部文章"选项
      const allCategory: Category = {
        id: 0,
        name: '全部文章',
        icon: 'fas fa-th-large',
        count: apiRes.data.pagination.total || 0
      };

      // 确保每个分类有图标，如果没有则设置默认图标
      const processedCategories = apiRes.data.list.map(category => {
        if (!category.icon) {
          // 根据分类ID选择一个图标
          const icons = [
            'fas fa-code',
            'fas fa-server',
            'fas fa-mobile-alt',
            'fas fa-database',
            'fas fa-wrench',
            'fas fa-sitemap',
            'fas fa-robot',
            'fas fa-laptop-code',
            'fas fa-project-diagram'
          ];
          category.icon = icons[category.id % icons.length];
        }
        return category;
      });
      
      // 将全部分类选项放在最前面
      categoryList.value = [allCategory, ...processedCategories];
    } else {
      message.error(apiRes?.msg || '获取分类列表失败');
    }
  } catch (error) {
    console.error('获取分类列表出错:', error);
    message.error('获取分类列表出错');
  }
};

// 简化函数，直接使用图标名
const getCategoryIconArray = (category: Category): [string, string] => {
  // 如果有图标名称
  if (category.icon) {
    // 如果图标包含完整前缀（如 'fas fa-xxx'）则提取图标名
    if (category.icon.includes(' ')) {
      const parts = category.icon.split(' ');
      return ['fas', parts[1].replace('fa-', '')];
    }
    
    // 如果图标以 'fa-' 开头，则移除前缀
    if (category.icon.startsWith('fa-')) {
      return ['fas', category.icon.substring(3)];
    }
    
    // 否则直接使用图标名
    return ['fas', category.icon];
  }
  
  // 如果没有图标，则根据分类ID使用默认图标
  if (category.id === 0) { // 全部文章分类
    return ['fas', 'border-all'];
  }
  
  // 其他分类的默认图标
  const defaultIcons = [
    'code',
    'server',
    'mobile-alt',
    'database',
    'wrench',
    'sitemap',
    'robot',
    'laptop-code',
    'project-diagram'
  ];
  
  return ['fas', defaultIcons[(category.id || 0) % defaultIcons.length]];
};



// 路由和导航
const router = useRouter();
const navigateToBlogDetail = (articleId: number): void => {
  router.push(`/blogDetail/${articleId}`);
};

</script>

<style lang="less" scoped>
.blog-page {
  min-height: 100vh;
  padding: 20px 0 40px;
  // 页面容器
  .page-container {
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 16px;
    display: flex;
    gap: 24px;

    @media (max-width: 992px) {
      flex-direction: column;
      padding: 0 12px;
      gap: 16px;
    }
  }

  // 左侧边栏
  .left-sidebar {
    width: 280px;
    flex-shrink: 0;
    position: sticky;
    top: 15px;

    @media (max-width: 992px) {
      position: fixed;
      top: 0;
      left: -300px;
      height: 100vh;
      width: 280px;
      background: var(--el-bg-color);
      box-shadow: 5px 0 15px rgba(0, 0, 0, 0.1);
      z-index: 1000;
      overflow-y: auto;
      transition: left 0.3s ease;

      &.mobile-open {
        left: 0;
      }
    }

    // 移动端头部
    .mobile-sidebar-header {
      display: none;
      padding: 15px;
      background: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color-lighter);

      @media (max-width: 992px) {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      .header-logo {
        display: flex;
        align-items: center;
        gap: 8px;

        i {
          font-size: 20px;
          color: var(--el-color-primary);
        }

        span {
          font-size: 18px;
          font-weight: 600;
          color: var(--el-color-primary);
        }
      }

      .mobile-close-btn {
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: var(--el-fill-color-light);
        border-radius: 6px;
        cursor: pointer;

        &:hover {
          background: var(--el-color-primary-light-9);
        }
      }
    }

    .sidebar-section {
      background: var(--el-bg-color);
      padding: 16px;
      margin-bottom: 16px;
      border-radius: 8px;
      border: 1px solid var(--el-border-color-lighter);

      .section-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 12px;
        display: flex;
        align-items: center;
        gap: 8px;

        i {
          font-size: 14px;
          color: var(--el-color-primary);
        }
      }
      
      // Popular tags styling
      .popular-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        
        .tag-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 10px;
          background: rgba(22, 119, 255, 0.05);
          border-radius: 4px;
          color: #555;
          font-size: 13px;
          transition: all 0.2s ease;
          text-decoration: none;
          width: calc(50% - 4px);
          
          .tag-count {
            background: rgba(22, 119, 255, 0.1);
            color: #1677FF;
            border-radius: 10px;
            padding: 1px 6px;
            font-size: 11px;
            min-width: 20px;
            text-align: center;
          }
          
          &:hover {
            background: rgba(22, 119, 255, 0.1);
            color: #1677FF;
            transform: translateY(-2px);
          }
        }
      }
      
      // Archives list styling
      .archives-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        
        .archive-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 0;
          color: #555;
          font-size: 14px;
          transition: all 0.2s;
          text-decoration: none;
          border-bottom: 1px dashed #f0f0f0;
          
          &:last-child {
            border-bottom: none;
          }
          
          .archive-count {
            background: #f9fbfd;
            color: #666;
            border-radius: 10px;
            padding: 2px 8px;
            font-size: 12px;
            min-width: 24px;
            text-align: center;
            transition: all 0.2s;
          }
          
          &:hover {
            color: #1677FF;
            padding-left: 5px;
            
            .archive-count {
              background: rgba(22, 119, 255, 0.1);
              color: #1677FF;
            }
          }
        }
      }

      // About the Author section styling
      .about-author {
        text-align: center;
        padding-top: 18px;

        .author-avatar {
          width: 80px;
          height: 80px;
          border-radius: 12px;
          overflow: hidden;
          margin: 0 auto 20px;
          box-shadow: 0 4px 10px rgba(0,0,0,0.07), 0 2px 6px rgba(0,0,0,0.05);
          border: none;
          transition: transform 0.3s ease, box-shadow 0.3s ease;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          &:hover {
            transform: translateY(-3px) scale(1.05);
            box-shadow: 0 6px 15px rgba(0,0,0,0.1), 0 3px 8px rgba(0,0,0,0.07);
          }
        }

        .author-name {
          font-size: 18px;
          font-weight: 700;
          color: #2c3e50;
          margin-bottom: 10px;
          cursor: pointer;
         
        }

        .author-bio {
          position: relative;
          padding: 10px 15px;
          background: rgba(22, 119, 255, 0.03);
          border-radius: 10px;
          border-left: 3px solid rgba(22, 119, 255, 0.15);
          font-size: 12px;
          line-height: 1.6;
          margin: 0 0 12px;
          color: #4a5568;
          text-align: left;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          
          &::before {
            content: '"';
            position: absolute;
            top: 3px;
            left: 5px;
            font-size: 20px;
            line-height: 1;
            color: rgba(22, 119, 255, 0.15);
            font-family: serif;
            z-index: 0;
          }
          
          &::after {
            content: '"';
            position: absolute;
            bottom: -2px;
            right: 6px;
            font-size: 20px;
            line-height: 1;
            color: rgba(22, 119, 255, 0.15);
            font-family: serif;
            z-index: 0;
          }
        }

        .author-socials {
          display: flex;
          justify-content: center;
          gap: 12px;

          a {
            color: #1677FF;
            font-size: 18px;
            width: 38px;
            height: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: rgba(22, 119, 255, 0.07);
            transition: color 0.25s ease, transform 0.25s ease, background-color 0.25s ease, box-shadow 0.25s ease;

            &:hover {
              color: #fff;
              transform: translateY(-2px) scale(1.12);
              background-color: #1677FF;
              box-shadow: 0 2px 8px rgba(22, 119, 255, 0.3);
            }
          }
        }
        
        // New styles for the enhanced about-author section
        .site-info-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 12px;
          background: linear-gradient(to right, rgba(22, 119, 255, 0.02), rgba(255, 255, 255, 0));
          border-radius: 12px;
          padding: 10px 12px 10px 10px;
          
          .site-logo {
            position: relative;
            width: 48px;
            height: 48px;
            flex-shrink: 0;
            
            .logo-icon {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: linear-gradient(145deg, #2677fa, #1677FF);
              border-radius: 10px;
              box-shadow: 0 3px 10px rgba(22, 119, 255, 0.2);
              position: relative;
              overflow: hidden;
              border: 1px solid rgba(255, 255, 255, 0.15);
              
              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 45%;
                background: linear-gradient(to bottom, rgba(255,255,255,0.25), rgba(255,255,255,0));
                z-index: 1;
                border-radius: 10px 10px 0 0;
              }
              
              &::after {
                content: '';
                position: absolute;
                left: -50%;
                top: -50%;
                width: 200%;
                height: 200%;
                background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 70%);
                animation: gentlePulse 3s ease-in-out infinite alternate;
              }
              
              @keyframes gentlePulse {
                0% { opacity: 0.3; transform: scale(0.8); }
                100% { opacity: 0.7; transform: scale(1.05); }
              }
              
              i {
                font-size: 22px;
                color: #fff;
                position: relative;
                z-index: 2;
                text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
              }
            }
          }
          
          .site-header-info {
            flex: 1;
            text-align: left;
            
            .author-name {
              margin: 0 0 8px;
              font-size: 16px;
              font-weight: 700;
              color: #1e293b;
              text-align: left;
              position: relative;
              display: flex;
              align-items: center;
              
              .dot {
                display: inline-block;
                width: 4px;
                height: 4px;
                border-radius: 50%;
                background-color: #1677FF;
                margin: 0 8px;
                position: relative;
                
                &::before, &::after {
                  content: '';
                  position: absolute;
                  width: 12px;
                  height: 1px;
                  background: linear-gradient(to right, rgba(22, 119, 255, 0.5), rgba(22, 119, 255, 0));
                  top: 50%;
                }
                
                &::before {
                  left: -14px;
                  transform: translateY(-50%);
                }
                
                &::after {
                  right: -14px;
                  transform: translateY(-50%);
                }
              }
              
              .gold-text {
                background: linear-gradient(45deg, #FFD700, #FFA500);
                -webkit-background-clip: text;
                background-clip: text;
                color: transparent;
                font-weight: 700;
                letter-spacing: 0.5px;
                position: relative;
                display: flex;
                align-items: center;
                gap: 4px;
                
                i {
                  font-size: 12px;
                  background: inherit;
                  -webkit-background-clip: text;
                  background-clip: text;
                  color: transparent;
                  filter: drop-shadow(0px 1px 1px rgba(0, 0, 0, 0.2));
                }
                
                &::after {
                  content: '';
                  position: absolute;
                  left: 0;
                  bottom: -2px;
                  width: 100%;
                  height: 2px;
                  background: linear-gradient(to right, rgba(255, 215, 0, 0.7), rgba(255, 165, 0, 0.3));
                  border-radius: 2px;
                  transform-origin: left;
                  transform: scaleX(0.6);
                  transition: transform 0.3s ease;
                }
                
                &:hover::after {
                  transform: scaleX(1);
                }
              }
            }
            
            .site-meta {
              display: flex;
              flex-wrap: wrap;
              gap: 8px;
              
              .site-badge {
                font-size: 10px;
                background: rgba(22, 119, 255, 0.08);
                color: #1677FF;
                padding: 2px 8px;
                border-radius: 12px;
                display: inline-flex;
                align-items: center;
                gap: 4px;
                box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
                border: 1px solid rgba(22, 119, 255, 0.05);
                
                i {
                  font-size: 9px;
                }
                
                &.gold {
                  background: linear-gradient(135deg, rgba(255, 215, 0, 0.15), rgba(255, 215, 0, 0.05));
                  color: #BB8A00;
                  border: 1px solid rgba(255, 215, 0, 0.15);
                  padding: 2px 8px;
                  box-shadow: 0 1px 3px rgba(218, 165, 32, 0.1);
                  margin-left: 1px;
                  
                  i {
                    color: #D4A017;
                  }
                }
              }
            }
          }
        }
        
        .site-stats {
          display: flex;
          justify-content: space-between;
          padding: 10px 8px;
          margin: 0 0 12px;
          background: linear-gradient(to right, rgba(22, 119, 255, 0.03), rgba(22, 119, 255, 0.05), rgba(22, 119, 255, 0.03));
          border-radius: 10px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
          
          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 2px 0;
            position: relative;
            width: calc(100% / 3);
            
            &::after {
              content: '';
              position: absolute;
              right: 0;
              top: 50%;
              transform: translateY(-50%);
              width: 1px;
              height: 60%;
              background: linear-gradient(to bottom, transparent, rgba(22, 119, 255, 0.1), transparent);
            }
            
            &:last-child::after {
              display: none;
            }
            
            .stat-value {
              font-size: 16px;
              font-weight: 700;
              color: #1677FF;
              line-height: 1;
              margin-bottom: 5px;
            }
            
            .stat-label {
              font-size: 10px;
              color: #64748b;
            }
          }
        }
        
        .site-features {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 12px;
          
          .feature-item {
            display: flex;
            align-items: center;
            padding: 7px 10px;
            background: var(--el-bg-color);
            border-radius: 6px;
            transition: all 0.25s ease;
            cursor: default;
            position: relative;
            overflow: hidden;
            border: 1px solid rgba(22, 119, 255, 0.05);
            
            &::before {
              content: '';
              position: absolute;
              left: 0;
              top: 0;
              height: 100%;
              width: 3px;
              background: linear-gradient(to bottom, #1677FF, rgba(22, 119, 255, 0.3));
              opacity: 0.6;
              border-radius: 0 2px 2px 0;
              transition: all 0.25s ease;
            }
            
            i {
              font-size: 13px;
              color: #fff;
              background: linear-gradient(135deg, #1677FF, #40a9ff);
              width: 24px;
              height: 24px;
              display: flex;
              align-items: center;
              justify-content: center;
              border-radius: 6px;
              box-shadow: 0 2px 5px rgba(22, 119, 255, 0.15);
              margin-right: 10px;
              flex-shrink: 0;
            }
            
            span {
              font-size: 12.5px;
              color: #4a5568;
              font-weight: 500;
              flex: 1;
            }
            
            .feature-badge {
              display: flex;
              align-items: center;
              justify-content: center;
              width: 16px;
              height: 16px;
              border-radius: 50%;
              background: rgba(22, 119, 255, 0.08);
              color: #1677FF;
              font-size: 8px;
              margin-left: 6px;
            }
            
            &:hover {
              transform: translateX(4px);
              background: rgba(22, 119, 255, 0.04);
              border-color: rgba(22, 119, 255, 0.1);
              
              &::before {
                opacity: 1;
                width: 5px;
              }
              
              i {
                transform: scale(1.08);
              }
              
              span {
                color: #1677FF;
              }
            }
          }
        }
        
        .author-socials {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-top: 2px;
          
          a {
            color: #1677FF;
            font-size: 15px;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background-color: rgba(22, 119, 255, 0.05);
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
            position: relative;
            box-shadow: 0 1px 3px rgba(0,0,0,0.03);
            border: 1px solid rgba(22, 119, 255, 0.08);
            
            &::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: radial-gradient(circle at center, rgba(255, 255, 255, 0.8), transparent);
              opacity: 0;
              transition: opacity 0.3s ease;
              pointer-events: none;
              border-radius: 50%;
            }

            &:hover {
              color: #fff;
              transform: translateY(-3px);
              background-color: #1677FF;
              box-shadow: 0 3px 8px rgba(22, 119, 255, 0.25);
              
              &::after {
                opacity: 0.2;
              }
            }
            
            &.github-link:hover {
              background-color: #333;
            }
            
            &.rss-link:hover {
              background-color: #f26522;
            }
            
            &.email-link:hover {
              background-color: #2c9e58;
            }
            
            &.like-link:hover {
              background-color: #ff4d4f;
            }
          }
        }
      }

      // Recent Comments section styling
      .recent-comments-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 12px;

        .comment-item {
          display: flex;
          gap: 15px;
          align-items: flex-start;
          padding: 12px;
          border-bottom: 1px solid #f0f0f0;
          transition: background-color 0.25s ease, border-left-color 0.25s ease;
          border-radius: 8px;
          border-left: 3px solid transparent;

          &:last-child {
            border-bottom: none;
            padding-bottom: 12px;
          }
          
          &:hover {
            background-color: #f9faff;
            border-left-color: #1677FF;
          }

          .comment-avatar {
            width: 42px;
            height: 42px;
            border-radius: 50%;
            overflow: hidden;
            flex-shrink: 0;
            border: 1px solid #eee;

            img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
          }

          .comment-content {
            flex: 1;
            min-width: 0;

            .comment-author {
              font-size: 14.5px;
              font-weight: 600;
              color: #1677FF;
              display: block;
              margin-bottom: 6px;
            }

            .comment-text {
              font-size: 13.8px;
              color: #4a4a4a;
              line-height: 1.55;
              margin: 0;
              
              a {
                color: inherit;
                text-decoration: none;
                transition: color 0.2s ease;
                
                &:hover {
                  color: #1677FF;
                  text-decoration: underline;
                }
              }
            }
          }
        }
      }

      // Monthly Hot Articles section styling
      .monthly-hot-articles-list {
        display: flex;
        flex-direction: column;
        gap: 12px;
        margin-top: 16px;

        .hot-article-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 12px;
          border-radius: 10px;
          text-decoration: none;
                 background: var(--el-bg-color);;
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
          position: relative;
          overflow: hidden;
          border: 1px solid #f0f0f5;
          
          &::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 100%;
            background: linear-gradient(to right, rgba(22, 119, 255, 0.02), rgba(22, 119, 255, 0.0));
            opacity: 0;
            transition: opacity 0.3s ease;
            pointer-events: none;
          }
          
          &:hover {
            transform: translateY(-4px);
            box-shadow: 0 8px 15px rgba(0, 0, 0, 0.05), 0 3px 5px rgba(0, 0, 0, 0.02);
            border-color: #e6f0ff;
            
            &::before {
              opacity: 1;
            }
            
            .hot-rank-badge {
              transform: translateZ(10px);
              box-shadow: 0 5px 15px rgba(0, 0, 0, 0.15);
              
              &.rank-1 {
                box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
              }
              
              &.rank-2 {
                box-shadow: 0 5px 15px rgba(192, 192, 192, 0.3);
              }
              
              &.rank-3 {
                box-shadow: 0 5px 15px rgba(205, 127, 50, 0.3);
              }
            }
            
            .hot-title-row .hot-title {
              color: #1677FF;
              transform: translateX(2px);
            }
            
            .hot-meta {
              transform: translateX(2px);
              .hot-views, .hot-date {
                color: #1677FF;
              }
            }
            
            .hot-rank-glow {
              opacity: 0.7;
              transform: translate(-50%, -50%) scale(1.2);
            }
          }
          
          .hot-rank-wrapper {
            position: relative;
            width: 46px;
            height: 46px;
            display: flex;
            align-items: center;
            justify-content: center;
            perspective: 600px;
            
            .hot-rank-glow {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%) scale(0.8);
              width: 70px;
              height: 70px;
              border-radius: 50%;
              background: radial-gradient(circle, rgba(22, 119, 255, 0.2) 0%, rgba(22, 119, 255, 0) 70%);
              pointer-events: none;
              opacity: 0.3;
              transition: all 0.3s ease;
              z-index: 0;
            }
            
            .hot-rank-badge {
              position: relative;
              z-index: 2;
              width: 36px;
              height: 36px;
              border-radius: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              font-size: 16px;
              font-weight: 700;
              color: white;
              background: #1677FF;
              box-shadow: 0 2px 10px rgba(22, 119, 255, 0.2);
              transform: translateZ(0);
              transform-style: preserve-3d;
              transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
              
              &::before {
                content: '';
                position: absolute;
                inset: 0;
                border-radius: 8px;
                box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.2);
                z-index: 3;
              }
              
              .rank-number {
                position: relative;
                z-index: 2;
              }
              
              .rank-crown, .rank-medal, .rank-award {
                position: absolute;
                top: -9px;
                right: -9px;
                width: 16px;
                height: 16px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 8px;
                color: #fff;
                background: #ff4d4f;
                box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
                z-index: 3;
              }
              
              &.rank-1 {
                background: linear-gradient(135deg, #ffd700, #FFC107);
                color: #5d4037;
                box-shadow: 0 2px 10px rgba(255, 215, 0, 0.4);
                
                .rank-crown {
                  background: #d32f2f;
                }
              }
              
              &.rank-2 {
                background: linear-gradient(135deg, #E0E0E0, #BDBDBD);
                color: #424242;
                box-shadow: 0 2px 10px rgba(192, 192, 192, 0.4);
                
                .rank-medal {
                  background: #7B1FA2;
                }
              }
              
              &.rank-3 {
                background: linear-gradient(135deg, #D7CCC8, #A1887F);
                color: #3E2723;
                box-shadow: 0 2px 10px rgba(205, 127, 50, 0.4);
                
                .rank-award {
                  background: #EF6C00;
                }
              }
            }
          }
          
          .hot-article-content {
            flex: 1;
            min-width: 0;
            display: flex;
            flex-direction: column;
            gap: 5px;
            
            .hot-title-row {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .hot-title {
                font-size: 14px;
                font-weight: 600;
                color: #333;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                transition: all 0.3s ease;
              }
              
              .hot-trend {
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                color: #ff4d4f;
                font-weight: bold;
                
                i {
                  animation: pulse 1.5s infinite;
                }
                
                @keyframes pulse {
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
            }
            
            .hot-meta {
              display: flex;
              align-items: center;
              gap: 10px;
              transition: all 0.3s ease;
              
              .hot-views, .hot-date {
                font-size: 12px;
                color: #888;
                display: flex;
                align-items: center;
                gap: 4px;
                transition: color 0.3s ease;
                
                i {
                  font-size: 11px;
                }
              }
            }
          }
          
          // First item with special treatment
          &:first-child {
            background: linear-gradient(to right, rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.01));
            border-color: rgba(255, 215, 0, 0.2);
            
            &::after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 3px;
              height: 100%;
              background: linear-gradient(to bottom, #ffd700, #FFC107);
              border-radius: 0 2px 2px 0;
            }
            
            .hot-rank-wrapper .hot-rank-glow {
              background: radial-gradient(circle, rgba(255, 215, 0, 0.2) 0%, rgba(255, 215, 0, 0) 70%);
            }
            
            .hot-title-row .hot-title {
              font-weight: 700;
            }
          }
          
          // Second item with special treatment
          &:nth-child(2) {
            background: linear-gradient(to right, rgba(192, 192, 192, 0.05), rgba(192, 192, 192, 0.01));
            
            .hot-rank-wrapper .hot-rank-glow {
              background: radial-gradient(circle, rgba(192, 192, 192, 0.2) 0%, rgba(192, 192, 192, 0) 70%);
            }
          }
          
          // Third item with special treatment
          &:nth-child(3) {
            background: linear-gradient(to right, rgba(205, 127, 50, 0.05), rgba(205, 127, 50, 0.01));
            
            .hot-rank-wrapper .hot-rank-glow {
              background: radial-gradient(circle, rgba(205, 127, 50, 0.2) 0%, rgba(205, 127, 50, 0) 70%);
            }
          }
        }
      }

      // Featured Articles section styling
      .featured-articles-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-top: 12px;

        .featured-article-item {
          display: flex;
          align-items: center;
          gap: 12px;
          color: #333;
          font-size: 13.8px;
          text-decoration: none;
          padding: 8px 10px;
          border-radius: 6px;
          transition: color 0.2s ease, transform 0.2s ease, background-color 0.2s ease;
          line-height: 1.55;

          .article-dot {
            width: 8px;
            height: 8px;
            background-color: #1677FF;
            border-radius: 50%;
            flex-shrink: 0;
            transition: all 0.25s ease;
          }

          &:hover {
            color: #1677FF;
            transform: translateX(5px);
            background-color: rgba(22, 119, 255, 0.06);

            .article-dot {
              background-color: #0056b3;
              transform: scale(1.25);
              box-shadow: 0 0 6px rgba(22, 119, 255, 0.7);
            }
          }
        }
      }
    }
  }
  
  // Main content area
  .main-area {
    flex: 1;
    min-width: 0;
    
    @media (max-width: 992px) {
      width: 100%;
    }
  }
  
  // Article list card
  .main-content {
    background: var(--el-bg-color);
    border-radius: 14px;
    overflow: hidden;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
    margin-top: 0;
    transition: box-shadow 0.3s ease;
    border: 1px solid var(--el-border-color-lighter);
    
    &:hover {
      box-shadow: 0 3px 15px rgba(0, 0, 0, 0.06), 0 1px 5px rgba(0, 0, 0, 0.03);
    }

    // Minimal Article Header
    .minimal-article-header {
      background: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color-lighter);

      .compact-header-bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;

        @media (max-width: 767px) {
          flex-direction: column;
          gap: 12px;
          padding: 12px 18px;
        }

        .header-left {
          .section-info {
            .section-title {
              display: flex;
              align-items: center;
              gap: 10px;
              font-size: 18px;
              font-weight: 600;
              color: #1e293b;
              margin: 0;

              i {
                color: #1890ff;
                font-size: 16px;
              }

              .article-count {
                background: linear-gradient(135deg, #1890ff, #40a9ff);
                color: white;
                font-size: 12px;
                font-weight: 500;
                padding: 2px 8px;
                border-radius: 12px;
                margin-left: 4px;
              }
            }
          }
        }

        .header-right {
          display: flex;
          align-items: center;
          gap: 12px;

          @media (max-width: 767px) {
            width: 100%;
            justify-content: space-between;
          }

          .search-box {
            /* 搜索框容器 - 精确控制宽度防止溢出 */
            .integrated-search {
              width: 260px;
              max-width: 100%;

              @media (max-width: 767px) {
                width: 220px;
              }

              @media (max-width: 480px) {
                width: 180px;
              }

              .search-input {
                width: 100%;

                :deep(.el-input-group) {
                  display: flex;
                  width: 100%;
                }

                :deep(.el-input__wrapper) {
                  flex: 1;
                  border-radius: var(--el-border-radius-base) 0 0 var(--el-border-radius-base);
                  border: 1px solid var(--el-border-color);
                  border-right: none;
                  background: var(--el-fill-color-lighter);
                  height: 36px;
                  padding: 0;
                  transition: all var(--el-transition-duration);
                  box-shadow: none;

                  &:hover {
                    border-color: var(--el-color-primary-light-3);
                    background: var(--el-fill-color);
                  }

                  &.is-focus {
                    border-color: var(--el-color-primary);
                    box-shadow: none;
                  }

                  .el-input__inner {
                    background: transparent;
                    border: none;
                    font-size: 14px;
                    color: var(--el-text-color-primary);
                    height: 100%;
                    padding: 0 8px 0 12px;

                    &::placeholder {
                      color: var(--el-text-color-placeholder);
                    }
                  }

                  .el-input__prefix {
                    padding-left: 12px;

                    .search-prefix-icon {
                      color: var(--el-text-color-regular);
                      font-size: 14px;
                    }
                  }
                }

                :deep(.el-input-group__append) {
                  padding: 0;
                  border: 1px solid var(--el-color-primary);
                  border-left: none;
                  background: var(--el-color-primary);
                  border-radius: 0 var(--el-border-radius-base) var(--el-border-radius-base) 0;

                  .search-append-btn {
                    height: 34px;
                    border: none;
                    border-radius: 0;
                    margin: 0;
                    font-size: 13px;
                    font-weight: 500;
                    padding: 0 12px;
                    background: var(--el-color-primary);
                    color: white;
                    box-shadow: none;

                    &:hover {
                      background: var(--el-color-primary-dark-2);
                    }

                    &:active {
                      background: var(--el-color-primary-dark-2);
                    }

                    &:focus {
                      box-shadow: none;
                      outline: none;
                    }
                  }
                }
              }
            }
          }

          .filter-dropdown {
            .filter-btn {
              border: 1px solid var(--el-border-color);
              border-radius: var(--el-border-radius-base);
              background: var(--el-fill-color-lighter);
              color: var(--el-text-color-regular);
              font-size: 14px;
              height: 36px;
              padding: 0 12px;
              transition: all var(--el-transition-duration);

              &:hover {
                border-color: var(--el-color-primary-light-3);
                background: var(--el-fill-color);
                color: var(--el-color-primary);
              }

              .el-icon {
                font-size: 14px;
              }

              span {
                margin: 0 4px;
              }
            }
          }
        }
      }

      .inline-categories {
        padding: 0 24px 12px;

        @media (max-width: 768px) {
          padding: 0 18px 8px;
        }

        /* 桌面端分类展示 */
        .desktop-categories {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          gap: 8px;
          padding: 4px 0;

          @media (max-width: 1200px) {
            grid-template-columns: repeat(auto-fit, minmax(110px, 1fr));
            gap: 6px;
          }

          @media (max-width: 768px) {
            display: none; /* 移动端隐藏桌面版分类 */
          }
        }

        /* 移动端分类选择器 */
        .mobile-category-selector {
          display: none;

          @media (max-width: 768px) {
            display: block;
            padding: 0 2px;
          }

          .category-select {
            width: 100%;

            :deep(.el-select__wrapper) {
              height: 40px;
              background: var(--el-fill-color-lighter);
              border: 1px solid var(--el-border-color);
              border-radius: var(--el-border-radius-base);
              transition: all var(--el-transition-duration);

              &:hover {
                border-color: var(--el-color-primary-light-3);
                background: var(--el-fill-color);
              }

              &.is-focused {
                border-color: var(--el-color-primary);
                box-shadow: 0 0 0 2px var(--el-color-primary-light-9);
              }

              .el-select__selected-item {
                color: var(--el-text-color-primary);
                font-size: 14px;
                font-weight: 500;
              }

              .el-select__placeholder {
                color: var(--el-text-color-placeholder);
                font-size: 14px;
              }

              .el-select__suffix {
                .el-icon {
                  color: var(--el-text-color-regular);
                  font-size: 14px;
                }
              }
            }
          }
            font-size: 14px;
            transition: all var(--el-transition-duration);

            &:hover {
              background: var(--el-fill-color);
              border-color: var(--el-color-primary-light-3);
            }

            .arrow-icon {
              transition: transform var(--el-transition-duration);
            }

            &:active .arrow-icon {
              transform: rotate(180deg);
            }
          }
        }

        /* 桌面端分类标签样式 */
        .desktop-categories .category-tag {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          padding: 6px 10px;
          background: var(--el-fill-color-lighter);
          border: 1px solid var(--el-border-color);
          border-radius: var(--el-border-radius-base);
          text-decoration: none;
          transition: all var(--el-transition-duration);
          font-size: 12px;
          min-height: 32px;
          text-align: center;
          cursor: pointer;
          position: relative;
          overflow: hidden;

          /* 子元素样式 */
          .tag-icon {
            font-size: 11px;
            color: var(--el-text-color-regular);
            flex-shrink: 0;
            transition: all var(--el-transition-duration);
          }

          .tag-name {
            color: var(--el-text-color-primary);
            font-weight: 500;
            flex: 1;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            transition: all var(--el-transition-duration);
          }

          .tag-count {
            background: var(--el-fill-color);
            color: var(--el-text-color-secondary);
            font-size: 10px;
            font-weight: 600;
            padding: 1px 4px;
            border-radius: 8px;
            min-width: 16px;
            text-align: center;
            flex-shrink: 0;
            transition: all var(--el-transition-duration);
          }

          /* 只在桌面端启用悬停效果 */
          @media (hover: hover) and (pointer: fine) {
            &:hover:not(.active) {
              background: var(--el-fill-color);
              border-color: var(--el-color-primary-light-3);
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

              .tag-icon {
                color: var(--el-color-primary-light-3);
              }

              .tag-name {
                color: var(--el-color-primary);
              }

              .tag-count {
                background: var(--el-color-primary-light-9);
                color: var(--el-color-primary);
              }
            }
          }

          &.active {
            background: var(--el-color-primary-light-9);
            border-color: var(--el-color-primary);
            color: var(--el-color-primary);
            transform: translateY(-1px);
            box-shadow: 0 2px 8px rgba(24, 144, 255, 0.2);

            .tag-icon {
              color: var(--el-color-primary);
            }

            .tag-name {
              color: var(--el-color-primary);
            }

            .tag-count {
              background: var(--el-color-primary);
              color: var(--el-color-white);
            }
          }
        }
      }

      /* 移动端分类弹窗样式 */
      :deep(.mobile-category-dialog) {
        z-index: 9999 !important;

        .el-overlay {
          z-index: 9998 !important;
        }

        .el-dialog {
          z-index: 9999 !important;
        }

        .el-dialog__header {
          padding: 16px 20px;
          border-bottom: 1px solid var(--el-border-color-lighter);
        }

        .el-dialog__body {
          padding: 20px;
        }

        .el-dialog__footer {
          padding: 16px 20px;
          border-top: 1px solid var(--el-border-color-lighter);
        }

        .mobile-category-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;

          @media (max-width: 480px) {
            grid-template-columns: 1fr;
            gap: 8px;
          }

          .mobile-category-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px;
            background: var(--el-fill-color-lighter);
            border: 1px solid var(--el-border-color);
            border-radius: var(--el-border-radius-base);
            cursor: pointer;
            transition: all var(--el-transition-duration);

            &:active {
              transform: scale(0.98);
            }

            &.active {
              background: var(--el-color-primary-light-9);
              border-color: var(--el-color-primary);
              color: var(--el-color-primary);

              .category-icon {
                color: var(--el-color-primary);
              }

              .category-count {
                background: var(--el-color-primary);
                color: var(--el-color-white);
              }
            }

            .category-icon {
              font-size: 16px;
              color: var(--el-text-color-regular);
              flex-shrink: 0;
            }

            .category-name {
              flex: 1;
              font-size: 14px;
              font-weight: 500;
              color: var(--el-text-color-primary);
            }

            .category-count {
              background: var(--el-fill-color);
              color: var(--el-text-color-secondary);
              font-size: 12px;
              font-weight: 600;
              padding: 4px 8px;
              border-radius: 12px;
              min-width: 24px;
              text-align: center;
            }
          }
        }
          }

            &:hover {
              border-color: var(--el-border-color);
              background: var(--el-bg-color);
              transform: translateY(-1px);
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

              .tag-icon {
                color: #1890ff;
              }

              .tag-name {
                color: #1890ff;
              }
            }

            &.active {
              background: #1890ff;
              border-color: #1890ff;
              color: white;

              .tag-icon,
              .tag-name {
                color: white;
              }

              .tag-count {
                background: rgba(255, 255, 255, 0.2);
                color: white;
              }
            }
          }
        }
      

    /* 移动端分类选择器下拉选项样式 - 使用更强的选择器 */
    :deep(.el-select-dropdown.mobile-category-popper) {
      border-radius: 12px !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
      border: 1px solid var(--el-border-color-lighter) !important;
      overflow: hidden !important;
      padding: 8px 0 !important;

      .el-select-dropdown__item {
        padding: 16px 20px !important;
        margin: 4px 8px !important;
        border-radius: 8px !important;
        transition: all 0.3s ease !important;
        border: 1px solid transparent !important;
        background: transparent !important;

        &:first-child {
          margin-top: 8px !important;
        }

        &:last-child {
          margin-bottom: 8px !important;
        }
      }
    }

    /* 移动端分类选项内容样式 */
    :deep(.mobile-category-popper .el-select-dropdown__item .option-content) {
      display: flex !important;
      align-items: center !important;
      gap: 12px !important;
      width: 100% !important;

      .option-icon {
        font-size: 16px !important;
        color: var(--el-color-primary) !important;
        width: 20px !important;
        height: 20px !important;
        display: flex !important;
        align-items: center !important;
        justify-content: center !important;
        background: var(--el-color-primary-light-9) !important;
        border-radius: 6px !important;
        transition: all 0.3s ease !important;
        flex-shrink: 0 !important;
      }

      .option-name {
        flex: 1 !important;
        font-size: 15px !important;
        color: var(--el-text-color-primary) !important;
        font-weight: 500 !important;
        line-height: 1.4 !important;
        text-align: left !important;
      }
    }

    /* 移动端分类选项悬停效果 */
    :deep(.mobile-category-popper .el-select-dropdown__item:hover) {
      background: var(--el-color-primary-light-9) !important;
      border-color: var(--el-color-primary-light-7) !important;
      transform: translateY(-1px) !important;

      .option-content {
        .option-icon {
          background: var(--el-color-primary) !important;
          color: white !important;
          transform: scale(1.1) !important;
        }

        .option-name {
          color: var(--el-color-primary) !important;
        }
      }
    }

    /* 移动端分类选项选中效果 */
    :deep(.mobile-category-popper .el-select-dropdown__item.is-selected) {
      background: var(--el-color-primary-light-8) !important;
      border-color: var(--el-color-primary) !important;

      .option-content {
        .option-icon {
          background: var(--el-color-primary) !important;
          color: white !important;
          box-shadow: 0 2px 8px rgba(64, 158, 255, 0.3) !important;
        }

        .option-name {
          color: var(--el-color-primary) !important;
          font-weight: 600 !important;
        }
      }
    }

    // Animation keyframes
    @keyframes float {
      0%, 100% {
        transform: translateY(0px) rotate(0deg);
      }
      50% {
        transform: translateY(-20px) rotate(5deg);
      }
    }

    @keyframes slideInUp {
      from {
        opacity: 0;
        transform: translateY(30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    // Article List - 优化为扁平紧凑设计
    .article-list {
      padding: 16px;

      @media (max-width: 767px) {
        padding: 12px;
      }

      .articles {
        display: flex;
        flex-direction: column;
        gap: 8px; // 减少间距

        @media (max-width: 767px) {
          gap: 6px; // 移动端进一步减少间距
        }

        .article-card {
          background: var(--el-bg-color);
          border-radius: 6px; // 减少圆角
          cursor: pointer;
          overflow: hidden;
          box-shadow: none; // 移除阴影
          transition: all 0.2s ease; // 减少动画时间
          border: 1px solid var(--el-border-color-lighter);
          position: relative;

          @media (max-width: 767px) {
            border-radius: 4px; // 移动端更小的圆角
          }

          // 移除装饰性底部条

          &.featured-article {
            border-left: 2px solid var(--el-color-primary); // 减少边框宽度
            background: var(--el-bg-color); // 移除渐变背景

            .card-badge {
              display: flex;
              align-items: center;
              gap: 4px;
              background: var(--el-color-primary);
              padding: 2px 6px; // 减少内边距
              box-shadow: none; // 移除阴影
              border-radius: 3px;
              font-size: 11px;
            }
          }

          &:hover {
            transform: none; // 移除悬浮效果
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05); // 轻微阴影
            border-color: var(--el-color-primary-light-7);

            .article-title a {
              color: var(--el-color-primary);
            }

            // 移除复杂的图片变换效果
            .article-thumbnail {
              img {
                transform: none;
              }
              .thumbnail-overlay {
                opacity: 0.8;
              }
            }
          }
          
          .card-badge { // 简化徽章样式
            position: absolute;
            top: 8px;
            right: 8px;
            background: var(--el-color-primary);
            border-radius: 3px;
            padding: 2px 6px;
            color: white;
            font-size: 11px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 3px;
            z-index: 2;

            i { font-size: 10px; }
          }

          .article-content {
            padding: 12px; // 减少内边距

            @media (max-width: 767px) {
              padding: 10px; // 移动端进一步减少内边距
            }

            .article-header {
              margin-bottom: 8px; // 减少间距

              @media (max-width: 767px) {
                margin-bottom: 6px; // 移动端进一步减少间距
              }

              .header-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px; // 减少标签间距
                margin-bottom: 6px; // 减少底部间距

                @media (max-width: 640px) {
                  gap: 3px; // 移动端进一步减少标签间距
                  margin-bottom: 3px; // 移动端进一步减少底部间距

                  // 移动端标签显示优化 - 只显示最重要的标签
                  .bitle-tag {
                    &:nth-child(n+3) {
                      display: none; // 移动端只显示前2个标签
                    }
                  }
                }

                @media (max-width: 480px) {
                  .bitle-tag {
                    &:nth-child(n+2) {
                      display: none; // 小屏幕只显示第1个标签
                    }
                  }
                }
              }

              .article-title {
                font-size: 16px; // 减少字体大小
                font-weight: 600;
                line-height: 1.3; // 减少行高
                margin: 0;
                display: block; // 改为块级元素，移除装饰条
                position: relative;

                @media (max-width: 767px) {
                  font-size: 15px; // 移动端进一步减少字体大小
                  line-height: 1.25;
                }

                // 移除装饰性左侧条

                a {
                  color: var(--el-text-color-primary);
                  text-decoration: none;
                  transition: color 0.2s ease;

                  // 移除下划线效果
                }
              }
            }
            
            .article-body {
              display: flex;
              gap: 12px; // 减少间距
              margin-bottom: 8px; // 减少底部间距

              @media (max-width: 640px) {
                flex-direction: row; // 移动端保持横向布局
                gap: 8px; // 移动端适中间距
                margin-bottom: 6px;
              }

              .article-text {
                flex: 1;
                min-width: 0;
                order: 1; // 确保文字内容在左侧

                @media (max-width: 640px) {
                  order: 1; // 移动端文字内容在左侧
                }

                .article-desc {
                  font-size: 13px; // 减少字体大小
                  color: var(--el-text-color-regular);
                  line-height: 1.4; // 减少行高
                  margin: 0 0 8px; // 减少底部间距
                  display: -webkit-box;
                  -webkit-line-clamp: 2; /* 减少到2行 */
                  line-clamp: 2;
                  -webkit-box-orient: vertical;
                  overflow: hidden;

                  @media (max-width: 640px) {
                    font-size: 12px; // 移动端进一步减少字体大小
                    line-height: 1.3;
                    margin: 0 0 4px; // 进一步减少间距
                    -webkit-line-clamp: 2; /* 移动端显示2行，充分利用空间 */
                    line-clamp: 2;
                  }

                  @media (max-width: 480px) {
                    font-size: 11px; // 小屏幕进一步减少
                    line-height: 1.25;
                    -webkit-line-clamp: 1; /* 极小屏幕只显示1行 */
                    line-clamp: 1;
                  }
                }

                .article-author {
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                  gap: 6px; // 减少间距

                  @media (max-width: 640px) {
                    gap: 4px; // 移动端进一步减少间距
                    flex-wrap: nowrap; // 移动端不换行，保持紧凑
                  }

                  @media (max-width: 480px) {
                    gap: 3px; // 小屏幕进一步减少间距
                  }

                  // 移动端头像大小优化
                  :deep(.ant-avatar) {
                    @media (max-width: 640px) {
                      width: 20px !important;
                      height: 20px !important;
                      font-size: 12px !important;
                    }

                    @media (max-width: 480px) {
                      width: 18px !important;
                      height: 18px !important;
                      font-size: 11px !important;
                    }
                  }

                  .author-name {
                    margin: 0;
                    font-size: 12px; // 减少字体大小
                    font-weight: 500;
                    display: flex;
                    align-items: center;
                    gap: 3px;

                    @media (max-width: 767px) {
                      font-size: 11px; // 移动端进一步减少字体大小
                    }

                    i {
                      font-size: 11px;

                      @media (max-width: 767px) {
                        font-size: 10px;
                      }
                    }
                  }

                  .post-time {
                    color: var(--el-text-color-placeholder);
                    font-size: 12px; // 减少字体大小
                    display: flex;
                    align-items: center;
                    gap: 3px;

                    @media (max-width: 767px) {
                      font-size: 11px; // 移动端进一步减少字体大小
                    }

                    i {
                      font-size: 11px;

                      @media (max-width: 767px) {
                        font-size: 10px;
                      }
                    }
                  }
                }
              }
            
              .article-thumbnail {
                width: 100px; // 减少宽度
                height: 70px; // 减少高度
                flex-shrink: 0;
                border-radius: 4px; // 减少圆角
                overflow: hidden;
                position: relative;
                box-shadow: none; // 移除阴影
                transition: none; // 移除变换效果
                order: 2; // 确保图片在右侧

                @media (max-width: 640px) {
                  width: 80px; // 移动端适中宽度，保持横向布局
                  height: 60px; // 移动端适中高度
                  order: 2; // 确保在移动端图片也在右侧
                }

                @media (max-width: 480px) {
                  width: 70px; // 小屏幕进一步减少
                  height: 50px;
                }

                img {
                  width: 100%;
                  height: 100%;
                  object-fit: cover;
                  transition: none; // 移除变换效果
                }

                .thumbnail-overlay {
                  position: absolute;
                  top: 0; left: 0; right: 0; bottom: 0;
                  background: rgba(0,0,0,0.3); // 简化背景
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  opacity: 0;
                  transition: opacity 0.2s ease;

                  .read-more {
                    color: white;
                    font-size: 11px; // 减少字体大小
                    padding: 4px 8px; // 减少内边距
                    border-radius: 12px; // 减少圆角
                    background: var(--el-color-primary);
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    transform: none; // 移除变换效果
                    transition: background 0.2s ease;

                    @media (max-width: 640px) {
                      font-size: 10px; // 移动端进一步减少字体
                      padding: 3px 6px;
                    }

                    i {
                      font-size: 10px;

                      @media (max-width: 640px) {
                        font-size: 9px;
                      }
                    }
                  }
                }
              }
            }
            
            .article-footer {
              display: flex;
              justify-content: space-between;
              align-items: center;
              flex-wrap: wrap;
              gap: 8px; // 减少间距
              padding-top: 8px; // 减少顶部内边距
              border-top: 1px solid var(--el-border-color-lighter);

              @media (max-width: 767px) {
                gap: 6px; // 移动端进一步减少间距
                padding-top: 6px;
              }

              .article-meta {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 8px; // 减少间距

                @media (max-width: 767px) {
                  gap: 6px; // 移动端进一步减少间距
                }

                .meta-item {
                  color: var(--el-text-color-placeholder);
                  font-size: 12px; // 减少字体大小
                  display: flex;
                  align-items: center;
                  gap: 3px; // 减少间距

                  @media (max-width: 767px) {
                    font-size: 11px; // 移动端进一步减少字体大小
                    gap: 2px;
                  }

                  i {
                    font-size: 11px; // 减少图标大小
                    color: var(--el-text-color-placeholder);

                    @media (max-width: 767px) {
                      font-size: 10px; // 移动端进一步减少图标大小
                    }
                  }
                }
              }

              .bitle-tags {
                display: flex;
                flex-wrap: wrap;
                gap: 4px; // 减少标签间距

                @media (max-width: 640px) {
                  gap: 3px; // 移动端进一步减少标签间距

                  // 移动端底部标签优化 - 限制显示数量
                  .bitle-tag {
                    &:nth-child(n+4) {
                      display: none; // 移动端只显示前3个标签
                    }
                  }
                }

                @media (max-width: 480px) {
                  .bitle-tag {
                    &:nth-child(n+3) {
                      display: none; // 小屏幕只显示前2个标签
                    }
                  }
                }
              }
            }
          }
        }
      }
      
      // Pagination
      .pagination-container {
        margin-top: 35px;
        padding: 15px 0;
        text-align: center;
        border-top: 1px solid #f0f0f0;
        
        :deep(.ant-pagination) {
          display: flex;
          justify-content: center;
          gap: 8px;
        }
        
        :deep(.ant-pagination-item) {
          border-radius: 4px;
          margin: 0;
          transition: all 0.2s ease;
          
          &:hover {
            border-color: #1677FF;
            transform: translateY(-2px);
            a { color: #1677FF; }
          }
          
          &.ant-pagination-item-active {
            border-color: #1677FF;
            background: #1677FF;
            font-weight: 600;
            transform: translateY(-2px);
            box-shadow: 0 2px 5px rgba(22,119,255,0.3);
            a { color: white; }
            &:hover a { color: white; }
          }
        }
        
        :deep(.ant-pagination-prev), :deep(.ant-pagination-next) {
          margin: 0;
          button { 
            border-radius: 4px; 
            &:hover {
              border-color: #1677FF;
              color: #1677FF;
            }
          }
        }
        
        :deep(.ant-pagination-options) {
          margin-left: 8px;
        }
        
        :deep(.ant-pagination-options-quick-jumper) {
          margin-right: 0;
          input { 
            border-radius: 4px;
            &:hover, &:focus {
              border-color: #1677FF;
            }
          }
        }
      }
    }
  

  /* Mobile menu toggle button (already styled partially if user kept it from before, ensure complete) */
  .mobile-menu-toggle {
    display: none; // Hidden by default, shown via media query
    position: fixed;
    bottom: 25px;
    right: 15px; // Common placement
    width: 45px;
    height: 45px;
    background: #1677FF;
    color: white;
    align-items: center;
    justify-content: center;
    border-radius: 8px; // Softer radius
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    cursor: pointer;
    z-index: 1001; // Above mobile overlay if it's 1000 or 999
    border: none;
    transition: all 0.3s ease;
    
    i {
      font-size: 20px;
      transition: transform 0.3s ease;
    }
    
    &:hover {
      background: #0958d9; // Darker blue on hover
      transform: translateY(-2px);
    }

    &.active { // When menu is open
        background: #ff4d4f; // Example: change color when active
        i {
            transform: rotate(90deg); // Example: animate icon
        }
    }
    
    @media (max-width: 992px) { // Show on mobile
      display: flex;
    }
  }
  
  // Mobile overlay (ensure it's after mobile-menu-toggle if z-index matters)
  .mobile-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 999;
    animation: fadeIn 0.25s ease;
    backdrop-filter: blur(2px);
  }
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }


/* Rankings section styling */
.rankings-container {
  margin-top: 16px;
  
  .ranking-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
    
    .rank-tab {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding: 8px 5px;
      background: rgba(22, 119, 255, 0.04);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.25s ease;
      border: 1px solid rgba(22, 119, 255, 0.05);
      position: relative;
      overflow: hidden;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(to right, #1677FF, rgba(22, 119, 255, 0.3));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.25s ease;
      }
      
      i {
        font-size: 14px;
        color: #1677FF;
        transition: all 0.25s ease;
      }
      
      span {
        font-size: 10px;
        color: #666;
        white-space: nowrap;
        transition: all 0.25s ease;
      }
      
      &:hover {
        background: rgba(22, 119, 255, 0.08);
        transform: translateY(-2px);
        
        &::after {
          transform: scaleX(0.7);
        }
        
        i {
          transform: scale(1.1);
        }
        
        span {
          color: #1677FF;
        }
      }
      
      &.active {
        background: rgba(22, 119, 255, 0.12);
        border-color: rgba(22, 119, 255, 0.15);
        
        &::after {
          transform: scaleX(1);
        }
        
        i {
          transform: scale(1.1);
          color: #0958d9;
        }
        
        span {
          color: #0958d9;
          font-weight: 500;
        }
      }
    }
  }
  
  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .rank-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
             background: var(--el-bg-color);;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      border: 1px solid #f5f5f5;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(to bottom, rgba(22, 119, 255, 0.5), rgba(22, 119, 255, 0.1));
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      &:hover {
        transform: translateX(5px);
        background: #f9faff;
        border-color: rgba(22, 119, 255, 0.1);
        
        &::before {
          opacity: 1;
        }
        
        .rank-position {
          transform: scale(1.1);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
          
          &.top-rank {
            box-shadow: 0 3px 8px rgba(22, 119, 255, 0.2);
          }
        }
        
        .rank-title {
          color: #1677FF;
        }
      }
      
      .rank-position {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        background: #f0f0f0;
        color: #666;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        flex-shrink: 0;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        
        &.top-rank {
          background: linear-gradient(135deg, #1677FF, #69b4ff);
          color: white;
          box-shadow: 0 2px 6px rgba(22, 119, 255, 0.2);
          
          &::after {
            content: '';
            position: absolute;
            top: -3px;
            right: -3px;
            width: 8px;
            height: 8px;
            background: #ff4d4f;
            border-radius: 50%;
            border: 1px solid white;
          }
        }
      }
      
      .rank-content {
        flex: 1;
        min-width: 0;
        
        .rank-title {
          font-size: 13px;
          color: #333;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.3s ease;
        }
        
        .rank-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .rank-value {
            font-size: 10px;
            color: #666;
            display: flex;
            align-items: center;
            gap: 4px;
            
            i {
              font-size: 9px;
              color: #1677FF;
            }
          }
          
          .rank-tag {
            font-size: 9px;
            background: rgba(22, 119, 255, 0.1);
            color: #1677FF;
            padding: 1px 5px;
            border-radius: 4px;
          }
        }
      }
      
      // Special styling for top 3 items
      &:nth-child(1) .rank-position.top-rank {
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #5d4037;
        
        &::after {
          background: #e53935;
        }
      }
      
      &:nth-child(2) .rank-position.top-rank {
        background: linear-gradient(135deg, #E0E0E0, #BDBDBD);
        color: #424242;
        
        &::after {
          background: #7B1FA2;
        }
      }
      
      &:nth-child(3) .rank-position.top-rank {
        background: linear-gradient(135deg, #D7CCC8, #A1887F);
        color: #3E2723;
        
        &::after {
          background: #EF6C00;
        }
      }
    }
  }
}

// 右侧栏主要内容的样式
.right-sidebar {
  display: flex;
  flex-direction: column;
  width: 260px;
  
  @media (max-width: 1200px) {
    width: 230px;
  }
  
  @media (max-width: 992px) {
    order: 3; // 在移动端将右侧栏放置在最底部
    width: 100%;
  }
  
  @media (max-width: 768px) {
    width: 100%;
  }
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  width: 100%;
  
  .loading-spinner {
    font-size: 32px;
    color: #1677FF;
    margin-bottom: 16px;
    animation: rotate 1.5s linear infinite;
  }
  
  p {
    font-size: 14px;
    color: #666;
  }
  
  @keyframes rotate {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  background: #f9fbfd;
  border-radius: 8px;
  border: 1px dashed #e0e0e0;
  width: 100%;
  
  i {
    font-size: 42px;
    color: #d0d0d0;
    margin-bottom: 16px;
  }
  
  p {
    font-size: 15px;
    color: #999;
  }
}

.author-name {
  margin: 0;
  font-size: 13px;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 4px;
  
  i.gold-icon {
    font-size: 12px;
    color: #FFD700;
    text-shadow: 0 1px 1px rgba(0,0,0,0.15);
  }
  i.super-admin-icon {
    font-size: 12px;
    color: #8000bf;
    text-shadow: 0 1px 1px rgba(0,0,0,0.15);
  }
  &.text-member-gold {
    background: linear-gradient(45deg, #FFD700, #FFA500);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
    font-weight: 700;
  }
}

.pagination-container {
  margin-top: 35px;
  padding: 15px 0;
  text-align: center;
  border-top: 1px solid #f0f0f0;
  
  :deep(.ant-pagination) {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  
  :deep(.ant-pagination-item) {
    border-radius: 4px;
    margin: 0;
    transition: all 0.2s ease;
    
    &:hover {
      border-color: #1677FF;
      transform: translateY(-2px);
      a { color: #1677FF; }
    }
    
    &.ant-pagination-item-active {
      border-color: #1677FF;
      background: #1677FF;
      font-weight: 600;
      transform: translateY(-2px);
      box-shadow: 0 2px 5px rgba(22,119,255,0.3);
      a { color: white; }
      &:hover a { color: white; }
    }
  }
  
  :deep(.ant-pagination-prev), :deep(.ant-pagination-next) {
    margin: 0;
    button { 
      border-radius: 4px; 
      &:hover {
        border-color: #1677FF;
        color: #1677FF;
      }
    }
  }
  
  :deep(.ant-pagination-options) {
    margin-left: 8px;
  }
  
  :deep(.ant-pagination-options-quick-jumper) {
    margin-right: 0;
    input { 
      border-radius: 4px;
      &:hover, &:focus {
        border-color: #1677FF;
      }
    }
  }
}

/* 移动端专用优化样式 */
@media (max-width: 640px) {
  .article-card {
    // 移动端文章卡片整体优化
    .article-content {
      .article-body {
        // 确保移动端图片和文字的完美对齐
        align-items: flex-start;

        .article-text {
          // 文字区域充分利用空间
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 60px; // 确保与图片高度匹配
        }

        .article-thumbnail {
          // 图片区域固定在右侧
          margin-left: auto;
          flex-shrink: 0;
        }
      }

      .article-footer {
        // 移动端底部信息更紧凑
        .article-meta {
          // 元信息在移动端只显示最重要的
          .meta-item {
            &:nth-child(n+3) {
              display: none; // 只显示前2个元信息
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .article-card {
    .article-content {
      .article-footer {
        .article-meta {
          .meta-item {
            &:nth-child(n+2) {
              display: none; // 小屏幕只显示第1个元信息
            }
          }
        }
      }
    }
  }
}

/* 暗色模式样式已统一在 App.vue 中管理 */

</style>