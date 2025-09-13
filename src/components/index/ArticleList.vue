<template>
  <div class="main-content animate-item" style="animation-delay: 0.15s;">
    <!-- Minimal Article Header -->
    <div class="minimal-article-header animate-item" style="animation-delay: 0.2s;">
      <!-- Compact Header Bar -->
      <div class="compact-header-bar">
        <div class="header-left">
          <!-- 简洁的头部，不显示多余文字 -->
        </div>

        <div class="header-right">
          <!-- 精美的搜索框 -->
          <div class="search-container">
            <div class="search-wrapper">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索文章..."
                size="default"
                class="search-input"
                @keyup.enter="handleSearch(searchKeyword)"
                clearable>
                <template #prefix>
                  <el-icon class="search-icon">
                    <Search />
                  </el-icon>
                </template>
              </el-input>
              <el-button
                type="primary"
                class="search-btn"
                @click="handleSearch(searchKeyword)"
                :icon="Search">
                搜索
              </el-button>
            </div>
          </div>

          <!-- 精美的筛选按钮 -->
          <div class="filter-container">
            <el-dropdown @command="handleFilterChange" trigger="click">
              <el-button class="filter-btn" :class="{ 'active': activeFilter !== 'all' }">
                <el-icon class="filter-icon">
                  <Filter />
                </el-icon>
                <span class="filter-text">{{ getFilterLabel(activeFilter) }}</span>
                <el-icon class="arrow-icon">
                  <ArrowDown />
                </el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu class="filter-dropdown-menu">
                  <el-dropdown-item
                    v-for="item in filterOptions"
                    :key="item.value"
                    :command="item.value"
                    :class="{ 'is-active': activeFilter === item.value }">
                    <div class="filter-option">
                      <el-icon class="option-icon">
                        <component :is="item.icon" />
                      </el-icon>
                      <span class="option-text">{{ item.label }}</span>
                      <el-icon v-if="activeFilter === item.value" class="check-icon">
                        <Check />
                      </el-icon>
                    </div>
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <!-- 精美的分类导航 -->
      <div class="category-navigation">
        <!-- 桌面端分类标签 -->
        <div class="desktop-categories">
          <div class="category-scroll-container">
            <div class="category-tags-wrapper" :class="{ 'collapsed': isCollapsed }">
              <a href="#"
                v-for="(category, index) in displayCategories"
                :key="category.id"
                :class="['category-chip', 'animate__animated', 'animate__fadeInUp', {'active': activeCategory === category.id}]"
                :style="{ 'animation-delay': `${index * 0.03}s` }"
                @click.prevent="handleCategoryChange(category.id)">
                <div class="chip-icon">
                  <font-awesome-icon :icon="getCategoryIconArray(category)" />
                </div>
                <span class="chip-label">{{ category.name }}</span>
                <div class="chip-badge" v-if="category.count">{{ category.count }}</div>
              </a>
              <!-- 展开/折叠按钮 -->
              <button
                v-if="categoryList.length > maxDisplayCategories"
                class="toggle-btn"
                @click="toggleCategories">
                <span class="toggle-text">{{ isCollapsed ? `展开全部 (${categoryList.length})` : '收起' }}</span>
                <el-icon class="toggle-icon" :class="{ 'rotated': !isCollapsed }">
                  <ArrowDown />
                </el-icon>
              </button>
            </div>
          </div>
        </div>

        <!-- 移动端分类选择器 -->
        <div class="mobile-categories">
          <el-select
            v-model="activeCategory"
            placeholder="选择分类"
            class="category-selector"
            @change="handleCategoryChange"
            popper-class="category-popper">
            <el-option
              v-for="category in categoryList"
              :key="category.id"
              :value="category.id"
              :label="category.name">
              <span class="option-wrapper">
                <font-awesome-icon :icon="getCategoryIconArray(category)" class="option-icon" />
                <span class="option-text">{{ category.name }}</span>
                <span v-if="category.count" class="option-count">({{ category.count }})</span>
              </span>
            </el-option>
          </el-select>
        </div>
      </div>
    </div>

    <!-- Article grid with beautiful cards -->
    <div class="article-list">
      <!-- 加载状态 -->
      <div v-if="isLoading" class="loading-container animate-item" style="animation-delay: 0.3s;">
        <div class="loading-spinner">
          <i class="fas fa-circle-notch fa-spin"></i>
        </div>
        <p>加载中...</p>
      </div>

      <!-- 文章列表为空时显示 -->
      <div v-else-if="articleList.length === 0" class="empty-container animate-item" style="animation-delay: 0.3s;">
        <i class="fas fa-inbox"></i>
        <p>暂无相关文章</p>
      </div>

      <div v-else class="articles">
        <!-- 文章项 - 使用服务器返回的数据但保持原始样式 -->
        <div class="article-card animate-item animate__animated animate__fadeInUp"
          v-for="(article, index) in articleList" :key="article.id"
          :class="{'featured-article': article.is_top === 1 || article.is_recommend === 1}"
          :style="`cursor: pointer; animation-delay: ${0.2 + index * 0.1}s;`" @click="navigateToBlogDetail(article.id)">
          <div class="card-badge" v-if="article.is_top === 1 || article.is_recommend === 1">
            <i class="fas fa-crown"></i>
            <span>推荐阅读</span>
          </div>
          <div class="article-content">
            <div class="article-header">
              <div class="header-tags">
                <span v-if="article.is_top === 1" class="bitle-tag tag-top"><i class="fas fa-thumbtack"></i>置顶</span>
                <span v-if="article.is_recommend === 1" class="bitle-tag tag-recommend"><i
                    class="fas fa-star"></i>推荐</span>
                <span v-if="article.is_original === 1" class="bitle-tag tag-original"><i
                    class="fas fa-copyright"></i>原创</span>
                <span
                  v-if="(article.favorites_count && article.favorites_count > 10) || (article.likes_count && article.likes_count > 100)"
                  class="bitle-tag tag-hot"><i class="fas fa-fire"></i>热门</span>
                <span v-if="article.category && article.category.slug === 'ruanjian'" class="bitle-tag tag-featured"><i
                    class="fas fa-award"></i>精华</span>
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

    <!-- 分页控件 - 使用 ElementUI Plus -->
    <div class="pagination-container animate-item" style="animation-delay: 0.8s;">
      <el-pagination size="small" v-model:current-page="currentPage" v-model:page-size="pageSize"
        :page-sizes="[3, 5, 10, 20]" :total="totalArticles" :layout="paginationLayout" background
        @size-change="handleSizeChange" @current-change="handlePageChange" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { message } from 'ant-design-vue';
import { Search, Filter, ArrowDown, Check, Document, Star, Clock, Promotion } from '@element-plus/icons-vue';
import { getArticleListR } from '@/request/article';
import { getCategoryListR } from '@/request/category';

// 定义类型
interface Article {
  id: number;
  title: string;
  subtitle?: string;
  content?: string;
  cover_image?: string;
  author_id?: number;
  category_id?: number;
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
    signature?: string;
    memberClass?: string;
    roles?: any[];
  };
  tags?: Array<{
    id: number;
    name: string;
  }>;
}

// 添加分类类型定义
interface Category {
  id: number;
  name: string;
  slug?: string;
  description?: string;
  parent_id?: number;
  icon?: string;
  count?: number;
  created_at?: string;
  updated_at?: string;
}

// 定义文章请求参数类型
interface ArticleParams {
  page: number;
  page_size: number;
  category_id?: number;
  author_id?: number;
  title?: string;
  start_date?: string;
  end_date?: string;
  sort?: string;
  order?: string;
  is_recommend?: number;
  is_top?: number;
}

// 响应式数据
const activeCategory = ref<number | null>(null);
const searchKeyword = ref('');
const activeFilter = ref('all');
const currentPage = ref(1);
const pageSize = ref(3); // 每页显示数量，默认20条
const totalArticles = ref(0);
const isLoading = ref(false);
const isCategoryLoading = ref(false);
const localArticles = ref<Article[]>([]); // 本地缓存的文章数据
const serverPage = ref(1); // 服务器页码

const articleList = ref<Article[]>([]);
const categoryList = ref<Category[]>([]);

// 筛选选项配置
const filterOptions = ref([
  { value: 'all', label: '全部文章', icon: Document },
  { value: 'recommended', label: '推荐文章', icon: Star },
  { value: 'latest', label: '最新发布', icon: Clock },
  { value: 'popular', label: '热门文章', icon: Promotion }
]);

// 响应式分页布局
const paginationLayout = ref('total, sizes, prev, pager, next, jumper');

// 文章请求参数
const articleParams = ref<ArticleParams>({
  page: 1,
  page_size: 20, // 服务器每次请求20条数据
  category_id: undefined,
  author_id: undefined,
  title: undefined,
  start_date: undefined,
  end_date: undefined,
  sort: undefined,
  order: undefined,
});

const router = useRouter();

// 获取文章数据 - 重构为支持本地分页
const initArticleData = async (params: ArticleParams): Promise<void> => {
  try {
    isLoading.value = true;

    // 重置本地数据
    localArticles.value = [];
    serverPage.value = 1;
    currentPage.value = 1;

    // 请求服务器数据，每次请求20条
    const serverParams = {
      ...params,
      page: 1,
      page_size: 20
    };

    const res = await getArticleListR(serverParams);

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
      localArticles.value = apiRes.data.list || [];
      totalArticles.value = apiRes.data.pagination.total || 0;

      // 直接设置第一页的文章列表
      const startIndex = (currentPage.value - 1) * pageSize.value;
      const endIndex = startIndex + pageSize.value;
      articleList.value = localArticles.value.slice(startIndex, endIndex);
    } else {
      message.error(apiRes?.msg || '获取文章列表失败');
      localArticles.value = [];
      articleList.value = [];
      totalArticles.value = 0;
    }
  } catch (error) {
    console.error('获取文章列表出错:', error);
    message.error('获取文章列表出错');
    localArticles.value = [];
    articleList.value = [];
    totalArticles.value = 0;
  } finally {
    isLoading.value = false;
  }
};

// 处理页码变化
const handlePageChange = (page: number): void => {
  currentPage.value = page;
  updateDisplayedArticles();
  // 滚动到顶部
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};

// 处理每页大小变化
const handleSizeChange = (size: number): void => {
  pageSize.value = size;
  currentPage.value = 1; // 重置到第一页
  updateDisplayedArticles();
};

// 更新显示的文章列表
const updateDisplayedArticles = async (): Promise<void> => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;

  // 检查是否需要加载更多服务器数据
  if (endIndex > localArticles.value.length && localArticles.value.length < totalArticles.value) {
    await loadMoreServerData();
  }

  // 从本地缓存中获取当前页的数据
  articleList.value = localArticles.value.slice(startIndex, endIndex);
};

// 加载更多服务器数据
const loadMoreServerData = async (): Promise<void> => {
  if (isLoading.value) return;

  isLoading.value = true;
  try {
    const params = {
      ...articleParams.value,
      page: serverPage.value + 1,
      page_size: 20 // 服务器每次请求20条
    };

    const response = await getArticleListR(params);

    // 根据API响应格式解析数据
    const apiRes = response as unknown as {
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
      const newArticles = apiRes.data.list || [];
      localArticles.value.push(...newArticles);
      serverPage.value += 1;
    }
  } catch (error) {
    console.error('加载更多文章失败:', error);
  } finally {
    isLoading.value = false;
  }
};

// 处理分类变化
const handleCategoryChange = (categoryId: number): void => {
  activeCategory.value = categoryId;

  // 设置分类ID参数
  articleParams.value.category_id = categoryId;
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

// 分类折叠相关
const isCollapsed = ref(true);
const maxDisplayCategories = 8;

// 显示的分类列表
const displayCategories = computed(() => {
  if (isCollapsed.value) {
    return categoryList.value.slice(0, maxDisplayCategories);
  }
  return categoryList.value;
});

// 切换分类展开/折叠
const toggleCategories = () => {
  isCollapsed.value = !isCollapsed.value;
};

// 标签类样式
const tagClasses = ['tag-recommend', 'tag-featured', 'tag-original', 'tag-remote', 'tag-hot'];

const getTagClass = (index: number): string => {
  return tagClasses[index % tagClasses.length];
};

// showTotal 函数已删除，使用 ElementUI Plus 默认格式

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

// 获取分类数据
const initCategoryData = async (): Promise<void> => {
  try {
    isCategoryLoading.value = true;
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
  } finally {
    isCategoryLoading.value = false;
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

// 添加跳转到文章详情页的方法
const navigateToBlogDetail = (articleId: number): void => {
  router.push({
    path: `/blogDetail/${articleId}`,
    query: { transition: 'slide-fade' }
  });
};

// 更新分页布局的方法
const updatePaginationLayout = (): void => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth <= 768) {
      paginationLayout.value = 'prev, pager, next'; // 移动端只显示核心功能
    } else {
      paginationLayout.value = 'total, sizes, prev, pager, next, jumper'; // 桌面端显示完整功能
    }
  }
};

// Lifecycle hooks
onMounted(async (): Promise<void> => {
  // 先获取分类数据，然后获取文章数据
  await initCategoryData();
  await initArticleData(articleParams.value);

  // 初始化分页布局
  updatePaginationLayout();

  // 监听窗口大小变化
  if (typeof window !== 'undefined') {
    window.addEventListener('resize', updatePaginationLayout);
  }
});
</script>

<style lang="less" scoped>
// Article list card - 现代化卡片设计
.main-content {
  background: var(--el-bg-color);
  border-radius: 12px; // 现代化圆角
  overflow: hidden;
  margin-top: 0;
  border: 1px solid var(--el-border-color-extra-light);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.03); // 适度的立体阴影
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;

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
    z-index: 1;
  }

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.05); // 适度增强阴影
    transform: translateY(-1px); // 轻微悬浮效果
    border-color: var(--el-color-primary-light-8);
  }

  @media (max-width: 767px) {
    border-radius: 8px; // 移动端适当减小圆角
  }
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
        align-items: stretch;
        gap: 16px;
        padding: 16px 18px;
      }

      @media (max-width: 480px) {
        padding: 12px 16px;
        gap: 12px;
      }



      .header-right {
        display: flex;
        align-items: center;
        gap: 12px;

        @media (max-width: 767px) {
          width: 100%;
          flex-wrap: wrap;
          gap: 12px;
        }

        @media (max-width: 480px) {
          gap: 8px;
        }

        // 精美的搜索容器
        .search-container {
          flex: 1;
          min-width: 0;

          @media (max-width: 767px) {
            flex: 1;
            min-width: 200px;
          }

          .search-wrapper {
            display: flex;
            align-items: center;
            gap: 8px;
            width: 100%;
            max-width: 320px;

            @media (max-width: 767px) {
              max-width: 100%;
            }

            .search-input {
              flex: 1;

              :deep(.el-input__wrapper) {
                background: var(--el-fill-color-blank);
                border: 1px solid var(--el-border-color-light);
                border-radius: 8px;
                box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
                transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
                height: 36px;

                &:hover {
                  border-color: var(--el-color-primary-light-7);
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
                }

                &.is-focus {
                  border-color: var(--el-color-primary);
                  box-shadow: 0 0 0 3px var(--el-color-primary-light-9);
                }

                .el-input__inner {
                  font-size: 14px;
                  color: var(--el-text-color-primary);
                  padding: 0 12px 0 0;

                  &::placeholder {
                    color: var(--el-text-color-placeholder);
                    font-size: 13px;
                  }
                }

                .el-input__prefix {
                  padding-left: 12px;

                  .search-icon {
                    color: var(--el-color-primary);
                    font-size: 16px;
                    transition: all 0.3s ease;
                  }
                }

                .el-input__suffix {
                  padding-right: 8px;
                }
              }
            }

            .search-btn {
              height: 36px;
              padding: 0 16px;
              border-radius: 8px;
              font-size: 13px;
              font-weight: 600;
              background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-dark-2));
              border: none;
              box-shadow: 0 2px 6px rgba(22, 119, 255, 0.3);
              transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
              flex-shrink: 0;

              &:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(22, 119, 255, 0.4);
              }

              &:active {
                transform: translateY(0);
              }
            }
          }
        }

        // 精美的筛选容器
        .filter-container {
          flex-shrink: 0;

          @media (max-width: 767px) {
            min-width: 100px;
          }

          .filter-btn {
            height: 36px;
            padding: 0 14px;
            border: 1px solid var(--el-border-color-light);
            border-radius: 8px;
            background: var(--el-fill-color-blank);
            color: var(--el-text-color-regular);
            font-size: 13px;
            font-weight: 500;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
            display: flex;
            align-items: center;
            gap: 6px;
            white-space: nowrap;

            @media (max-width: 480px) {
              padding: 0 10px;
              font-size: 12px;
              gap: 4px;
            }

            &:hover {
              border-color: var(--el-color-primary-light-7);
              background: var(--el-color-primary-light-9);
              color: var(--el-color-primary);
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
              transform: translateY(-1px);
            }

            &.active {
              border-color: var(--el-color-primary);
              background: var(--el-color-primary-light-9);
              color: var(--el-color-primary);
              box-shadow: 0 0 0 3px var(--el-color-primary-light-9);
            }

            .filter-icon {
              font-size: 14px;
              transition: all 0.3s ease;
            }

            .filter-text {
              font-weight: 500;
            }

            .arrow-icon {
              font-size: 12px;
              transition: all 0.3s ease;
            }

            &:hover .arrow-icon {
              transform: rotate(180deg);
            }
          }

          // 筛选下拉菜单样式
          :deep(.filter-dropdown-menu) {
            border-radius: 10px;
            box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12);
            border: 1px solid var(--el-border-color-extra-light);
            padding: 6px;

            .el-dropdown-menu__item {
              border-radius: 6px;
              margin: 2px 0;
              padding: 0;
              transition: all 0.3s ease;
              height: auto;
              line-height: normal;

              &:hover {
                background: var(--el-color-primary-light-9);
                color: var(--el-color-primary);
              }

              &.is-active {
                background: var(--el-color-primary-light-8);
                color: var(--el-color-primary);
              }
            }
          }
        }

        // 筛选选项样式
        .filter-option {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 12px;
          width: 100%;

          .option-icon {
            font-size: 14px;
            width: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }

          .option-text {
            flex: 1;
            font-size: 13px;
            font-weight: 500;
            line-height: 1.2;
          }

          .check-icon {
            font-size: 12px;
            color: var(--el-color-primary);
            flex-shrink: 0;
          }
        }
      }
    }

    // 精美的分类导航
    .category-navigation {
      padding: 0 24px 16px;

      @media (max-width: 768px) {
        padding: 0 18px 12px;
      }

      // 桌面端分类标签 - 紧凑网格布局
      .desktop-categories {
        @media (max-width: 768px) {
          display: none;
        }

        .category-scroll-container {
          .category-tags-wrapper {
            display: flex;
            flex-wrap: wrap;
            gap: 6px;
            padding: 4px 0;
            transition: all 0.3s ease;

            &.collapsed {
              max-height: 80px;
              overflow: hidden;
            }

            .toggle-btn {
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 6px 12px;
              background: var(--el-fill-color-light);
              border: 1px solid var(--el-border-color-light);
              border-radius: 16px;
              color: var(--el-text-color-regular);
              font-size: 12px;
              cursor: pointer;
              transition: all 0.3s ease;
              white-space: nowrap;
              height: 32px;

              &:hover {
                background: var(--el-color-primary-light-9);
                color: var(--el-color-primary);
                border-color: var(--el-color-primary-light-7);
              }

              .toggle-text {
                font-weight: 500;
              }

              .toggle-icon {
                font-size: 12px;
                transition: transform 0.3s ease;

                &.rotated {
                  transform: rotate(180deg);
                }
              }
            }
          }
        }
      }

      // 移动端分类选择器
      .mobile-categories {
        display: none;

        @media (max-width: 768px) {
          display: block;
        }

        .category-selector {
          width: 100%;

          :deep(.el-select__wrapper) {
            height: 38px;
            background: var(--el-fill-color-blank);
            border: 1px solid var(--el-border-color-light);
            border-radius: 8px;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
            transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);

            &:hover {
              border-color: var(--el-color-primary-light-7);
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
            }

            &.is-focused {
              border-color: var(--el-color-primary);
              box-shadow: 0 0 0 3px var(--el-color-primary-light-9);
            }

            .el-select__selected-item {
              color: var(--el-text-color-primary);
              font-size: 14px;
              font-weight: 500;
            }

            .el-select__placeholder {
              color: var(--el-text-color-placeholder);
              font-size: 13px;
            }

            .el-select__suffix {
              .el-icon {
                color: var(--el-color-primary);
                font-size: 14px;
              }
            }
          }
        }

        // 分类选项样式 - 使用全局样式确保生效
        :deep(.category-selector) {
          .el-input__wrapper {
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
          }
        }
      }
    }

    // 移动端分类选项样式 - 简化但有效的设计
    .option-wrapper {
      display: flex !important;
      align-items: center !important;
      gap: 10px !important;
      width: 100% !important;
      padding: 8px 0 !important;

      .option-icon {
        color: var(--el-color-primary) !important;
        font-size: 16px !important;
        flex-shrink: 0 !important;
        width: 20px !important;
        text-align: center !important;
      }

      .option-text {
        flex: 1 !important;
        font-size: 14px !important;
        font-weight: 500 !important;
        color: var(--el-text-color-primary) !important;
        line-height: 1.4 !important;
      }

      .option-count {
        background: var(--el-color-info-light-8) !important;
        color: var(--el-color-info) !important;
        font-size: 11px !important;
        font-weight: 600 !important;
        padding: 2px 6px !important;
        border-radius: 8px !important;
        flex-shrink: 0 !important;
      }
    }

      // 精致的分类标签样式
      .category-chip {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 12px;
        background: var(--el-fill-color-blank);
        border: 1px solid var(--el-border-color-light);
        border-radius: 6px;
        text-decoration: none;
        font-size: 13px;
        font-weight: 500;
        color: var(--el-text-color-regular);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        position: relative;
        overflow: hidden;
        height: 36px;
        white-space: nowrap;

        // 微妙的光泽效果
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

        .chip-icon {
          width: 18px;
          height: 18px;
          background: var(--el-color-primary-light-9);
          border-radius: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--el-color-primary);
          font-size: 10px;
          transition: all 0.3s ease;
          flex-shrink: 0;
        }

        .chip-label {
          color: var(--el-text-color-primary);
          font-weight: 500;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          line-height: 1.2;
        }

        .chip-badge {
          background: var(--el-color-info-light-8);
          color: var(--el-color-info);
          font-size: 10px;
          padding: 2px 5px;
          border-radius: 4px;
          font-weight: 600;
          min-width: 16px;
          text-align: center;
          line-height: 1;
          flex-shrink: 0;
        }

        &:hover {
          background: var(--el-color-primary-light-9);
          border-color: var(--el-color-primary-light-6);
          color: var(--el-color-primary);
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(22, 119, 255, 0.12);

          .chip-icon {
            background: var(--el-color-primary-light-7);
            color: var(--el-color-primary);
            transform: scale(1.05);
          }

          .chip-label {
            color: var(--el-color-primary);
          }

          .chip-badge {
            background: var(--el-color-primary-light-7);
            color: var(--el-color-primary);
          }
        }

        &.active {
          background: var(--el-color-primary);
          border-color: var(--el-color-primary);
          color: white;
          box-shadow: 0 2px 6px rgba(22, 119, 255, 0.25);

          .chip-icon {
            background: rgba(255, 255, 255, 0.15);
            color: white;
          }

          .chip-label {
            color: white;
            font-weight: 600;
          }

          .chip-badge {
            background: rgba(255, 255, 255, 0.15);
            color: white;
          }
        }
      }
    }

  // Article List - 精美紧凑设计
  .article-list {
    padding: 16px;

    @media (max-width: 767px) {
      padding: 12px;
    }

    .articles {
      display: flex;
      flex-direction: column;
      gap: 12px; // 紧凑间距

      @media (max-width: 767px) {
        gap: 10px; // 移动端更紧凑
      }

      .article-card {
        background: var(--el-bg-color);
        border-radius: 12px; // 适中圆角
        cursor: pointer;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        border: 1px solid var(--el-border-color-extra-light);
        position: relative;

        @media (max-width: 767px) {
          border-radius: 8px;
        }

        &.featured-article {
          background: linear-gradient(135deg,
            var(--el-bg-color) 0%,
            var(--el-color-primary-light-9) 100%
          );
          border: 1px solid var(--el-color-primary-light-8);
          box-shadow: 0 3px 10px rgba(22, 119, 255, 0.08);

          // 左侧简洁的渐变条
          &::after {
            content: '';
            position: absolute;
            left: 0;
            top: 12px;
            bottom: 12px;
            width: 3px;
            background: var(--el-color-primary);
            border-radius: 0 2px 2px 0;
          }

          .card-badge {
            display: flex;
            align-items: center;
            gap: 4px;
            background: var(--el-color-primary);
            padding: 3px 8px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 500;
            color: white;
          }
        }

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
          border-color: var(--el-color-primary-light-7);

          .article-title a {
            color: var(--el-color-primary);
          }

          .article-thumbnail {
            img {
              transform: scale(1.03);
            }
            .thumbnail-overlay {
              opacity: 1;
            }
          }
        }

        .card-badge { // 简洁徽章样式
          position: absolute;
          top: 12px;
          right: 12px;
          background: var(--el-color-primary);
          border-radius: 8px;
          padding: 4px 8px;
          color: white;
          font-size: 11px;
          font-weight: 600;
          display: flex;
          align-items: center;
          gap: 4px;
          z-index: 3;
          box-shadow: 0 2px 8px rgba(22, 119, 255, 0.2);

          i {
            font-size: 10px;
          }
        }

        .article-content {
          padding: 16px; // 紧凑内边距

          @media (max-width: 767px) {
            padding: 12px; // 移动端更紧凑
          }

          .article-header {
            margin-bottom: 12px; // 紧凑间距

            @media (max-width: 767px) {
              margin-bottom: 10px;
            }

            .header-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 4px; // 紧凑标签间距
              margin-bottom: 8px; // 紧凑底部间距

              @media (max-width: 640px) {
                gap: 3px;
                margin-bottom: 6px;

                // 移动端标签显示优化
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
              font-size: 16px; // 适中字体大小
              font-weight: 600; // 适中字重
              line-height: 1.3; // 紧凑行高
              margin: 0;
              display: block;

              @media (max-width: 767px) {
                font-size: 15px;
                line-height: 1.2;
              }

              a {
                color: var(--el-text-color-primary);
                text-decoration: none;
                transition: color 0.3s ease;

                &:hover {
                  color: var(--el-color-primary);
                }
              }
            }
          }

          .article-body {
            display: flex;
            gap: 12px; // 紧凑间距
            margin-bottom: 12px; // 紧凑底部间距

            @media (max-width: 640px) {
              flex-direction: row;
              gap: 10px;
              margin-bottom: 10px;
            }

            .article-text {
              flex: 1;
              min-width: 0;
              order: 1;

              @media (max-width: 640px) {
                order: 1;
              }

              .article-desc {
                font-size: 13px; // 紧凑字体大小
                color: var(--el-text-color-regular);
                line-height: 1.4; // 紧凑行高
                margin: 0 0 8px; // 紧凑底部间距
                display: -webkit-box;
                -webkit-line-clamp: 2; /* 显示2行 */
                line-clamp: 2;
                -webkit-box-orient: vertical;
                overflow: hidden;
                opacity: 0.9;

                @media (max-width: 768px) {
                  font-size: 12px;
                  line-height: 1.3;
                  margin: 0 0 6px;
                  -webkit-line-clamp: 1; /* 小屏幕显示1行 */
                  line-clamp: 1;
                }
              }

              .article-author {
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 4px; // 紧凑间距

                @media (max-width: 640px) {
                  gap: 3px;
                  flex-wrap: nowrap;
                }

                @media (max-width: 480px) {
                  gap: 2px;
                }

                // 头像大小优化
                :deep(.ant-avatar) {
                  @media (max-width: 640px) {
                    width: 18px !important;
                    height: 18px !important;
                    font-size: 11px !important;
                  }

                  @media (max-width: 480px) {
                    width: 16px !important;
                    height: 16px !important;
                    font-size: 10px !important;
                  }
                }

                .author-name {
                  margin: 0;
                  font-size: 11px; // 紧凑字体大小
                  font-weight: 500;
                  display: flex;
                  align-items: center;
                  gap: 2px;

                  @media (max-width: 767px) {
                    font-size: 10px;
                  }

                  i {
                    font-size: 10px;

                    @media (max-width: 767px) {
                      font-size: 9px;
                    }
                  }
                }

                .post-time {
                  color: var(--el-text-color-placeholder);
                  font-size: 11px; // 紧凑字体大小
                  display: flex;
                  align-items: center;
                  gap: 2px;

                  @media (max-width: 767px) {
                    font-size: 10px;
                  }

                  i {
                    font-size: 10px;

                    @media (max-width: 767px) {
                      font-size: 9px;
                    }
                  }
                }
              }
            }

            .article-thumbnail {
              width: 100px; // 紧凑宽度
              height: 75px; // 紧凑高度
              flex-shrink: 0;
              border-radius: 8px; // 适中圆角
              overflow: hidden;
              position: relative;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
              transition: all 0.3s ease;
              order: 2;
              border: 1px solid var(--el-border-color-extra-light);

              @media (max-width: 640px) {
                width: 80px; // 移动端紧凑宽度
                height: 60px; // 移动端紧凑高度
                order: 2;
                border-radius: 6px;
              }

              @media (max-width: 480px) {
                width: 70px; // 小屏幕紧凑大小
                height: 52px;
              }

              img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                transition: transform 0.3s ease;
              }


              .thumbnail-overlay {
                position: absolute;
                top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0, 0, 0, 0.4);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: all 0.3s ease;

                .read-more {
                  color: white;
                  font-size: 10px; // 紧凑字体大小
                  padding: 4px 8px; // 紧凑内边距
                  border-radius: 12px;
                  background: var(--el-color-primary);
                  display: flex;
                  align-items: center;
                  gap: 4px;
                  transform: translateY(4px);
                  transition: all 0.3s ease;
                  box-shadow: 0 2px 8px rgba(22, 119, 255, 0.3);

                  @media (max-width: 640px) {
                    font-size: 9px;
                    padding: 3px 6px;
                  }

                  i {
                    font-size: 9px;

                    @media (max-width: 640px) {
                      font-size: 8px;
                    }
                  }

                  &:hover {
                    transform: translateY(0);
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
            gap: 8px; // 紧凑间距
            padding-top: 12px; // 紧凑顶部内边距
            border-top: 1px solid var(--el-border-color-extra-light);
            margin-top: 6px;

            @media (max-width: 767px) {
              gap: 6px;
              padding-top: 10px;
            }

                        .article-meta {
              display: flex;
              align-items: center;
              flex-wrap: wrap;
              gap: 8px; // 紧凑间距

              @media (max-width: 767px) {
                gap: 6px;
              }

              .meta-item {
                color: var(--el-text-color-regular);
                font-size: 11px; // 紧凑字体大小
                display: flex;
                align-items: center;
                gap: 3px; // 紧凑间距
                opacity: 0.8;
                transition: all 0.2s ease;

                @media (max-width: 767px) {
                  font-size: 10px;
                  gap: 2px;
                }

                &:hover {
                  opacity: 1;
                  color: var(--el-color-primary);
                }

                i {
                  font-size: 10px; // 紧凑图标大小
                  color: var(--el-color-primary);
                  opacity: 0.7;

                  @media (max-width: 767px) {
                    font-size: 9px;
                  }
                }
              }
            }

            .bitle-tags {
              display: flex;
              flex-wrap: wrap;
              gap: 3px; // 紧凑标签间距

              @media (max-width: 640px) {
                gap: 2px;

                // 移动端底部标签优化
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
          }
        }
      }
    }

  
  }
  // Pagination - 响应式紧凑样式
  .pagination-container {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    padding: 16px 12px;
    border-top: 1px solid var(--el-border-color-extra-light);

    @media (max-width: 768px) {
      padding: 12px 8px;

      // 移动端分页按钮样式优化
      :deep(.el-pagination) {
        .el-pager {
          .number {
            min-width: 30px;
            height: 30px;
            font-size: 13px;
          }
        }

        .btn-prev,
        .btn-next {
          min-width: 30px;
          height: 30px;
          font-size: 13px;
        }
      }
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

// 紧凑标签样式
.bitle-tag {
  display: inline-flex;
  align-items: center;
  gap: 2px; // 紧凑间距
  padding: 2px 6px; // 紧凑内边距
  border-radius: 6px;
  font-size: 10px; // 紧凑字体
  font-weight: 500; // 适中字重
  color: white;
  transition: all 0.2s ease; // 更快动画
  cursor: pointer;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  @media (max-width: 767px) {
    padding: 1px 4px;
    font-size: 9px;
    gap: 1px;
    border-radius: 4px;
  }

  &.tag-top {
    background: #ff4d4f;
    &:hover {
      background: #ff7875;
      transform: translateY(-1px);
    }
  }

  &.tag-recommend {
    background: #1677ff;
    &:hover {
      background: #69b4ff;
      transform: translateY(-1px);
    }
  }

  &.tag-original {
    background: #13c2c2;
    &:hover {
      background: #36cfc9;
      transform: translateY(-1px);
    }
  }

  &.tag-hot {
    background: #fa8c16;
    &:hover {
      background: #ffd591;
      transform: translateY(-1px);
    }
  }

  &.tag-featured {
    background: #722ed1;
    &:hover {
      background: #b37feb;
      transform: translateY(-1px);
    }
  }

  i {
    font-size: 8px; // 紧凑图标

    @media (max-width: 767px) {
      font-size: 7px;
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

/* 自定义动画关键帧 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为文章项添加交错动画效果 */
.article-card {
  .article-header,
  .article-body,
  .article-footer {
    animation-fill-mode: both;
  }

  /* 悬浮时子元素动画 */
  &:hover {
    .article-header {
      transform: translateY(-2px);
      transition: transform 0.3s ease;
    }

    .article-body {
      .article-thumbnail img {
        transform: scale(1.05);
      }
    }

    .article-footer {
      .meta-item {
        transform: translateY(-1px);
        transition: transform 0.2s ease;
      }
    }
  }
}
</style>

<!-- 简洁紧凑的移动端下拉样式 -->
<style>
.category-popper {
  border-radius: 8px !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08) !important;
  border: 1px solid var(--el-border-color-light) !important;
  padding: 4px !important;
}

.category-popper .el-select-dropdown__item {
  padding: 0 !important;
  border-radius: 4px !important;
  margin: 2px 0 !important;
  height: auto !important;
  line-height: 1.4 !important;
}

.category-popper .el-select-dropdown__item:hover {
  background: var(--el-fill-color-light) !important;
}

.category-popper .option-wrapper {
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
  width: 100% !important;
  padding: 8px 12px !important;
}

.category-popper .option-icon {
  color: var(--el-color-primary) !important;
  font-size: 14px !important;
  flex-shrink: 0 !important;
  width: 16px !important;
  text-align: center !important;
}

.category-popper .option-text {
  flex: 1 !important;
  font-size: 14px !important;
  font-weight: 400 !important;
  color: var(--el-text-color-primary) !important;
  line-height: 1.4 !important;
}

.category-popper .option-count {
  color: var(--el-text-color-secondary) !important;
  font-size: 12px !important;
  flex-shrink: 0 !important;
}
</style>
