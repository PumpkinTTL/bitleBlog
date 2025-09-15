<template>
  <div class="blog-container">
    <el-row :gutter="16">
      <!-- 左侧导航栏 -->
      <el-col :xs="0" :sm="6" :md="5" :lg="4" :xl="4">
        <div class="left-sidebar animate-item" style="animation-delay: 0.1s;">
          <div class="sidebar-header">
            <span>分类导航</span>
          </div>
          <div v-if="loading" class="nav-section">
            <div v-for="i in 6" :key="i" class="nav-item skeleton">
              <div class="nav-icon skeleton-icon"></div>
              <div class="nav-text skeleton-text"></div>
              <div class="nav-count skeleton-count"></div>
            </div>
          </div>
          <div v-else class="nav-section">
            <div v-for="(item, index) in categoryList" :key="item.id"
              class="nav-item animate__animated animate__fadeInLeft" :class="{ active: index === activeCategory }"
              @click="setActiveCategory(item.id, index)" :style="{ animationDelay: `${0.15 + index * 0.03}s` }">
              <div class="nav-icon">
                <el-icon v-if="index === 0">
                  <HomeFilled />
                </el-icon>
                <el-icon v-else-if="index === 1">
                  <Grid />
                </el-icon>
                <el-icon v-else-if="index === 2">
                  <Monitor />
                </el-icon>
                <el-icon v-else-if="index === 3">
                  <Service />
                </el-icon>
                <el-icon v-else-if="index === 4">
                  <Setting />
                </el-icon>
                <el-icon v-else>
                  <Folder />
                </el-icon>
              </div>
              <span class="nav-text">{{ item.name }}</span>
              <!-- 个数标签 -->
              <div class="nav-count" v-if="item.count">{{ item.count }}</div>
            </div>
          </div>
          <div class="sidebar-divider"></div>
          <div class="sidebar-header secondary">
            <span>热门标签</span>
          </div>
          <div v-if="loading" class="tag-section">
            <div v-for="i in 5" :key="i" class="tag-item skeleton">
              <div class="tag-name skeleton-text"></div>
              <div class="tag-count skeleton-count"></div>
            </div>
          </div>
          <div v-else class="tag-section">
            <div class="tag-item animate__animated animate__fadeInLeft" v-for="(tag, index) in popularTags" :key="index"
              :style="{ animationDelay: `${0.15 + index * 0.03}s` }">
              <span class="tag-name"># {{ tag.name }}</span>
              <span class="tag-count">{{ tag.count }}</span>
            </div>
          </div>
          <div class="sidebar-footer">
            <div class="sidebar-actions">
              <button class="sidebar-btn">
                <el-icon>
                  <Plus />
                </el-icon>
                <span>创建分类</span>
              </button>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 中间内容区 -->
      <el-col :xs="24" :sm="18" :md="14" :lg="14" :xl="14">
        <div class="main-content animate-item" style="animation-delay: 0.2s;">
          <div class="category-nav animate-item" style="animation-delay: 0.25s;"> <!-- 子元素也使用 animate-item -->
            <div class="nav-tabs">
              <div class="tab active">推荐</div>
              <div class="tab">最新</div>
            </div>
          </div>
          <!-- 文章列表 -->
          <div class="article-list" v-loading="articlesLoading" element-loading-text="加载中..."
            element-loading-background="rgba(255, 255, 255, 0.7)"
            :initial="{ maxHeight: articlesLoading ? 0 : '1000px' }"
            :animate="{ maxHeight: articlesLoading ? 0 : '1000px' }" :transition="{ duration: 0.3 }">
            <transition mode="out-in" enter-active-class="animate__animated animate__zoomIn animate__faster"
              leave-active-class="animate__animated animate__zoomOut animate__faster">
              <div v-if="articlesLoading" key="skeleton" class="article-skeleton">
                <div v-for="i in 3" :key="i" class="article-item">
                  <div class="article-main">
                    <div class="article-header">
                      <div class="article-title-wrapper">
                        <div class="article-title skeleton"></div>
                        <div class="header-tags">
                          <span class="skeleton-tag"></span>
                          <span class="skeleton-tag"></span>
                        </div>
                      </div>
                    </div>
                    <div class="article-content">
                      <div class="article-preview skeleton"></div>
                      <div class="article-preview skeleton" style="width: 90%"></div>
                    </div>
                    <div class="article-footer">
                      <div class="article-meta">
                        <div class="skeleton-author">
                          <div class="skeleton-avatar"></div>
                          <div class="skeleton-name"></div>
                        </div>
                        <div class="meta-stats">
                          <div class="skeleton-meta"></div>
                          <div class="skeleton-meta"></div>
                          <div class="skeleton-meta"></div>
                          <div class="skeleton-meta"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="article-cover skeleton"></div>
                </div>
              </div>
              <!-- 空数据 -->
              <div v-else-if="!articlesLoading && articleList.length === 0" key="empty-state" class="animate__zoomIn">
                <el-empty description="暂无相关文章" />
              </div>
              <!-- 空数据占位 -->
              <div v-else key="article-items-wrapper">
                <div v-for="(item, index) in articleList" :key="item.id" class="article-item"
                  @click="handClickArticleTitle(item.id)">
                  <div class="article-main">
                    <div class="article-header">
                      <div class="article-title-wrapper">
                        <h3 class="article-title">{{ item.title }}</h3>
                        <div class="header-tags" v-if="item.is_top || item.is_recommend || item.is_original">
                          <span v-if="item.is_top" class="bitle-tag tag-top"><i
                              class="fas fa-map-marker-alt"></i>置顶</span>
                          <span v-if="item.is_recommend" class="bitle-tag tag-recommend"><i
                              class="fas fa-star"></i>推荐</span>
                          <span v-if="item.is_original" class="bitle-tag tag-original"><i
                              class="fas fa-pen-alt"></i>原创</span>
                          <span v-if="item.is_original" class="bitle-tag tag-article-vip"><i class="fas fa-star">
                            </i>VIP</span>
                        </div>
                      </div>
                    </div>
                    <div class="article-content">
                      <div class="article-preview" v-html="formatContent(item.content)"></div>
                    </div>
                    <div class="article-footer">
                      <div class="article-meta">
                        <div class="meta-item author">
                          <el-avatar :size="22" :src="item.author?.avatar"></el-avatar>
                          <span style="font-size: 12px; color:#282C34 ;">{{ item.author?.username || '匿名' }}</span>
                          <span v-if="item.author?.username=='南瓜头'" class="bitle-tag tag-vip"><i class="fas fa-crown"></i>超级会员</span>
                          <span v-if="item.author?.username=='南瓜头'" class="bitle-tag tag-member-crown"><i class="fas fa-crown"></i>皇冠会员</span>
                          <span v-else class="bitle-tag tag-member-basic"><i class="fas fa-snowflake"></i>流光会员</span>
                        </div>
                        <div class="meta-stats">
                          <div class="meta-item">
                            <el-icon><Clock /></el-icon>
                            <span>{{ formatDate(item.publish_time) }}</span>
                          </div>
                          <div class="meta-item">
                            <el-icon><View /></el-icon>
                            <span>{{ item.word_count }} 字</span>
                          </div>
                          <div class="meta-item">
                            <el-icon><Star /></el-icon>
                            <span>{{ item.likes_count }}</span>
                          </div>
                          <div class="meta-item">
                            <el-icon><ChatDotRound /></el-icon>
                            <span>{{ item.comments_count }}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="article-cover" v-if="item.cover_image">
                    <img :src="item.cover_image" alt="文章封面">
                  </div>
                </div>
              </div>
              <!-- 文章项end -->
            </transition>
          </div>
          <div v-if="!articlesLoading && articleList.length > 0"
            class="pagination-container  animate__animated animate__zoomIn">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[5, 10, 20, 30]"
              layout="total, sizes, prev, pager, next, jumper" :total="totalArticles" @size-change="handleSizeChange"
              @current-change="handleCurrentChange" background prev-text="上一页" next-text="下一页" :pager-count="5"
              size-change-text="条/页" total-text="共 {} 条" goto-text="前往" page-text="页" page-size-text="条/页" />
          </div>
        </div>
      </el-col>

      <!-- 右侧边栏 -->
      <el-col :xs="0" :sm="0" :md="5" :lg="6" :xl="6">
        <div class="right-sidebar animate-item" style="animation-delay: 0.3s;">
          <div class="login-card animate-item" style="animation-delay: 0.4s;">
            <template v-if="!store.isLogin">
              <div class="card-header">
                <el-icon class="site-logo">
                  <Promotion />
                </el-icon>
                <span>南瓜社区</span>
              </div>
              <div class="card-content">
                <div class="welcome-banner">
                  <el-icon class="welcome-icon">
                    <Avatar />
                  </el-icon>
                  <p>你好！欢迎来到南瓜社区</p>
                </div>
                <div class="login-options">
                  <button class="login-btn primary" @click="store.loginVisible = true">
                    <el-icon>
                      <UserFilled />
                    </el-icon>
                    <span>立即登录</span>
                  </button>
                  <button class="login-btn outlined" @click="store.loginVisible = true">
                    <el-icon>
                      <Plus />
                    </el-icon>
                    <span>免费注册</span>
                  </button>
                </div>
                <div class="social-login">
                  <div class="divider"><span>其他登录方式</span></div>
                  <div class="social-icons">
                    <div class="social-icon wechat"><el-icon>
                        <ChatDotSquare />
                      </el-icon></div>
                    <div class="social-icon weibo"><el-icon>
                        <StarFilled />
                      </el-icon></div>
                    <div class="social-icon github"><el-icon>
                        <Connection />
                      </el-icon></div>
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <div class="user-banner">
                <div class="banner-bg"></div>
                <div class="user-avatar-large">
                  <el-avatar :size="60"
                    :src="store.userInfo.avatar || 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'"></el-avatar>
                  <span v-if="store.userInfo.is_vip" class="vip-badge"><el-icon>
                      <Medal />
                    </el-icon></span>
                </div>
              </div>
              <div class="user-profile">
                <div class="user-header">
                  <div class="user-name">
                    <span class="text-member-crown">{{ store.userInfo.nickname || store.userInfo.username || '用户' }}</span>
                    <span class="bitle-tag tag-vip">超级会员</span>
                  </div>
                  <div class="user-bio">{{ store.userInfo.bio || "前端工程师 / UI设计师" }}</div>
                </div>
                <div class="user-activity">
                  <div class="activity-item">
                    <el-icon>
                      <Calendar />
                    </el-icon>
                    <span>已连续签到 <b>{{ store.userInfo.sign_days || 3 }}</b> 天</span>
                    <button class="sign-btn">签到</button>
                  </div>
                </div>
                <div class="user-stats">
                  <div class="stat-item">
                    <div class="stat-value">{{ store.userInfo.articles_count || 0 }}</div>
                    <div class="stat-label">文章</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ store.userInfo.followers_count || 0 }}</div>
                    <div class="stat-label">关注者</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ store.userInfo.likes_count || 0 }}</div>
                    <div class="stat-label">获赞</div>
                  </div>
                </div>
                <div class="user-actions">
                  <button class="action-btn write-btn">
                    <el-icon>
                      <Edit />
                    </el-icon>
                    <span>写文章</span>
                  </button>
                  <button class="action-btn profile-btn">
                    <el-icon>
                      <User />
                    </el-icon>
                    <span>个人主页</span>
                  </button>
                </div>
                <div class="recent-medals">
                  <div class="medals-header">我的勋章</div>
                  <div class="medals-list">
                    <div class="medal-item">
                      <el-icon class="medal-icon top">
                        <Trophy />
                      </el-icon>
                      <span>优质创作者</span>
                    </div>
                    <div class="medal-item">
                      <el-icon class="medal-icon year">
                        <Timer />
                      </el-icon>
                      <span>1周年</span>
                    </div>
                    <div class="medal-item">
                      <el-icon class="medal-icon active">
                        <Star />
                      </el-icon>
                      <span>活跃之星</span>
                    </div>
                  </div>
                </div>
              </div>
            </template>
          </div>
          <div class="author-rank animate-item" style="animation-delay: 0.5s;">
            <div class="rank-header">
              <span>🔥 作者榜</span>
              <a href="#" class="more">完整榜单 &gt;</a>
            </div>
            <div class="author-list">
              <div class="author-item" v-for="(author, index) in authorList" :key="index">
                <div class="author-avatar">
                  <img :src="author.avatar" alt="作者头像">
                </div>
                <div class="author-info">
                  <div class="author-name">{{ author.name }}</div>
                  <div class="author-desc">{{ author.desc }}</div>
                </div>
                <button class="follow-btn">+ 关注</button>
              </div>
            </div>
          </div>
          <div class="topic-recommend animate-item" style="animation-delay: 0.6s;">
            <div class="topic-header">
              <span>📌 推荐话题</span>
            </div>
            <div class="topic-list">
              <div class="topic-item" v-for="(topic, index) in topicList" :key="index">
                <div class="topic-name">{{ topic.name }}</div>
                <div class="topic-count">{{ topic.count }}篇文章</div>
              </div>
            </div>
          </div>
          <div class="ad-section animate-item" style="animation-delay: 0.7s;">
            <img
              src="https://p6-xtjj-sign.byteimg.com/tos-cn-i-73owjymdk6/6c8a0b6d4df746fc9b030a1edc8186c7~tplv-73owjymdk6-jj-mark-v1:0:0:0:0:5o6Y6YeR5oqA5pyv56S-5Yy6IEAgTW9tZW50:q75.awebp?rk3s=f64ab15b&x-expires=1743179370&x-signature=SLxibEACL2kr3n9F1%2BJEOWCu%2FRs%3D"
              alt="广告图片">
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from 'vue';
import { useRouter, useRoute } from "vue-router";
import { getArticleListR } from '@/request/article';
import { getCategoryListR } from '@/request/category';
import { ElMessage } from 'element-plus';
// 引入需要的Element Plus图标
import { 
  User, 
  UserFilled,
  Clock, 
  View, 
  Star,
  StarFilled,
  ChatDotRound,
  ChatDotSquare,
  Document, 
  Collection,
  Folder,
  Edit,
  Plus,
  Medal,
  Calendar,
  Promotion,
  Avatar,
  Trophy,
  Timer,
  Connection,
  HomeFilled,
  Grid,
  Monitor,
  Service,
  Setting
} from '@element-plus/icons-vue';
import '@/assets/style/tag.less'; // 导入自定义标签样式
import { useStore } from '@/store';


const router = useRouter();
const route = useRoute();
const store = useStore();

// 添加分页相关变量
const currentPage = ref(1);
const pageSize = ref(5);
const totalArticles = ref(0);
const allArticleCache = ref([]);
const isLoadingMore = ref(false);
const lastLoadedPage = ref(1);
// 分类参数
const params = ref({
  page: 1,
  pageSize: 10,
  parent_id: 0
});
// 文章参数
const articleParams: any = ref({
  page: 1,
  pageSize: 20,
  category_id: 0 // 默认为0，临时值
});
// 标签参数
const tagParams: any = ref({
  page: 1,
  pageSize: 10,
});
// 作者榜参数
const authorParams: any = ref({
  page: 1,
  pageSize: 3,
});
// 话题参数
const topicParams: any = ref({
  page: 1, 
  pageSize: 5,
});
// 是否为移动端
const isMobile = computed(() => {
  return window.innerWidth < 768;
});

// 分页处理函数
const handleSizeChange = (val) => {
  pageSize.value = val;
  updateDisplayArticles();
};

const handleCurrentChange = (val) => {
  currentPage.value = val;
  updateDisplayArticles();
  
  // 如果快到末尾了且有更多数据，提前加载
  const threshold = Math.ceil(allArticleCache.value.length / pageSize.value) - 1;
  if (currentPage.value >= threshold && !isLoadingMore.value) {
    loadMoreArticles();
  }
};

// 本地分页处理
const updateDisplayArticles = () => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  articleList.value = allArticleCache.value.slice(start, end);
};

// 加载更多文章
const loadMoreArticles = async () => {
  if (isLoadingMore.value) return;
  
  isLoadingMore.value = true;
  try {
    lastLoadedPage.value++;
    const articleRes = await getArticleListR({
      page: lastLoadedPage.value,
      pageSize: 20
    });
    
    if (articleRes && articleRes.data && articleRes.data.length > 0) {
      // 合并新数据并去重
      const newArticles = articleRes.data.filter(
        newItem => !allArticleCache.value.some(existingItem => existingItem.id === newItem.id)
      );
      
      allArticleCache.value = [...allArticleCache.value, ...newArticles];
      totalArticles.value = Math.max(totalArticles.value, allArticleCache.value.length);

      // 更新显示数据
      updateDisplayArticles();
    }
  } catch (error) {
    console.error('加载更多文章失败', error);
  } finally {
    isLoadingMore.value = false;
  }
};

let resizeTimeout = null;

onMounted(async () => {
  await initData();
  
  // 监听窗口大小变化以更新移动端状态
  window.addEventListener('resize', () => {
    // 使用防抖处理可以提高性能
    if (resizeTimeout) clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      // 更新移动端状态（已通过计算属性自动处理）
    }, 200);
  });
});

// 添加加载状态
const loading = ref(true);
const articlesLoading = ref(false);

// 初始化文章数据
const initArticle = async () => {
  try {
    articlesLoading.value = true;
    const articleRes = await getArticleListR(articleParams.value);
    
    if (articleRes && articleRes.data) {
      allArticleCache.value = articleRes.data;
      totalArticles.value = articleRes.total || allArticleCache.value.length;
      
      // 初始化显示数据
      updateDisplayArticles();
  
    }
  } catch (error) {
    console.error('获取文章数据失败', error);
    ElMessage.error('获取文章列表失败，请稍后重试');
  } finally {
    articlesLoading.value = false;
  }
};

// 初始化分类数据
const initCategory = async () => {
  try {
    const categoryRes = await getCategoryListR(params.value);
    
    if (categoryRes && categoryRes.data) {
      categoryList.value = categoryRes.data;
      // 更新文章参数中的分类ID，使用第一个分类的ID
      if (categoryList.value.length > 0) {
        articleParams.value.category_id = categoryList.value[0].id;
      }
    }
  } catch (error) {
    console.error('获取分类数据失败', error);
    ElMessage.error('获取分类导航失败，请稍后重试');
  }
};

// 初始化热门标签数据
const initPopularTags = async () => {
  try {
    // 模拟接口请求
    // 实际这里应该调用 getPopularTagsR(tagParams.value)
    ElMessage.info('热门标签接口尚未开发，使用默认数据');
    // 使用默认数据，实际开发中应该从接口获取
    setTimeout(() => {
      popularTags.value = [
        { name: 'Vue.js', count: 128 },
        { name: 'React', count: 98 },
        { name: 'TypeScript', count: 86 },
        { name: 'JavaScript', count: 76 },
        { name: 'Node.js', count: 65 },
      ];
    }, 300);
  } catch (error) {
    console.error('获取热门标签数据失败', error);
    ElMessage.error('获取热门标签失败，使用默认数据');
  }
};

// 初始化作者榜数据
const initAuthorRank = async () => {
  try {
    // 模拟接口请求
    // 实际这里应该调用 getAuthorRankR(authorParams.value)
    ElMessage.info('作者榜单接口尚未开发，使用默认数据');
    // 使用默认数据，实际开发中应该从接口获取
    setTimeout(() => {
      authorList.value = [
        {
          name: '程序员张三',
          desc: '资深前端开发工程师',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        },
        {
          name: '李四技术',
          desc: '全栈开发者，热爱分享',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        },
        {
          name: '王五学编程',
          desc: '5年经验的后端工程师',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        },
      ];
    }, 400);
  } catch (error) {
    console.error('获取作者榜数据失败', error);
    ElMessage.error('获取作者榜单失败，使用默认数据');
  }
};

// 初始化推荐话题数据
const initTopicList = async () => {
  try {
    // 模拟接口请求
    // 实际这里应该调用 getTopicListR(topicParams.value)
    ElMessage.info('推荐话题接口尚未开发，使用默认数据');
    // 使用默认数据，实际开发中应该从接口获取
    setTimeout(() => {
      topicList.value = [
        { name: 'Vue.js 3.0', count: 1254 },
        { name: 'TypeScript实战', count: 876 },
        { name: '前端性能优化', count: 632 },
        { name: 'React Hooks', count: 521 },
        { name: '微前端架构', count: 345 },
      ];
    }, 500);
  } catch (error) {
    console.error('获取推荐话题数据失败', error);
    ElMessage.error('获取推荐话题失败，使用默认数据');
  }
};

// 修改初始化数据函数
const initData = async () => {
  try {
    loading.value = true;
    
    // 先加载分类，确保分类ID可用
    await initCategory();
    
    // 再加载文章，此时分类ID已经设置好
    await initArticle();
    
    // 并行加载其他不相关的数据
    await Promise.allSettled([
      initPopularTags(),
      initAuthorRank(),
      initTopicList()
    ]);
    
  } catch (error) {
    console.error('初始化数据失败', error);
    ElMessage.error('数据加载失败，请刷新页面重试');
  } finally {
    loading.value = false;
  }
};

// 监听分页变化
watch([currentPage, pageSize], () => {
  updateDisplayArticles();
});

// 文章列表数据
const articleList = ref([]);

// 分类数据
const categoryList = ref([]);
const activeCategory = ref(0);

// 标签类型
// const tagTypes = ['', 'success', 'warning', 'danger', 'info']; // Removed: Unused variable

// 作者榜单数据 - 默认值作为备用
const authorList = ref([
  {
    name: '程序员张三',
    desc: '资深前端开发工程师',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    name: '李四技术',
    desc: '全栈开发者，热爱分享',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
  {
    name: '王五学编程',
    desc: '5年经验的后端工程师',
    avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
  },
]);

// 推荐话题数据 - 默认值作为备用
const topicList = ref([
  { name: 'Vue.js 3.0', count: 1254 },
  { name: 'TypeScript实战', count: 876 },
  { name: '前端性能优化', count: 632 },
  { name: 'React Hooks', count: 521 },
  { name: '微前端架构', count: 345 },
]);


// 分类标签数据
const categoryTabs = ref([
  { name: '推荐', active: true },
  { name: '最新', active: false }
]);

// 切换分类标签激活状态
const setActiveTab = (index: number) => {
  categoryTabs.value.forEach((tab, i) => {
    tab.active = i === index;
  });
};

// 格式化文章内容，提取前150个字符作为预览
const formatContent = (content: string) => {
  if (!content) return '';
  
  // 去除HTML标签，只保留纯文本
  const plainText = content.replace(/<[^>]+>/g, '');
  
  // 移除多余空格和换行
  const trimmedText = plainText.replace(/\s+/g, ' ').trim();
  
  // 返回前150个字符，如果超过则添加省略号
  if (trimmedText.length > 150) {
    return trimmedText.substring(0, 150) + '...';
  }
  
  return trimmedText;
};

// 时间格式化函数
const formatDate = (dateString: string) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 小于1天显示小时
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return `${hours}小时前`;
  }
  
  // 小于1周显示天数
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}天前`;
  }
  
  // 否则显示具体日期
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
};

// 点击文章标题处理
const handClickArticleTitle = (id: number) => {
  router.push({
    path: `/blogDetail/${id}`,
    query: { transition: 'slide-fade' }
  });
};

// 设置激活的分类
const setActiveCategory = (id, index) => {
  // 只改变激活状态，不刷新分类数据
  activeCategory.value = index;
  
  // 只更新文章筛选条件
  articleParams.value.category_id = id;
  articleParams.value.page = 1;
  currentPage.value = 1;
  
  // 清空当前文章列表
  allArticleCache.value = [];
  articleList.value = [];
  
  // 显示加载状态仅用于文章列表
  articlesLoading.value = true;

  // 直接调用API刷新文章数据
  getArticleListR(articleParams.value)
    .then(articleRes => {
      if (articleRes && articleRes.data) {
        allArticleCache.value = articleRes.data;
        totalArticles.value = articleRes.total || articleRes.data.length;
        
        // 使用 setTimeout 给过渡动画足够的时间
        setTimeout(() => { 
          updateDisplayArticles();
        }, 50);
        ElMessage.success('文章加载成功');
      } else if (articleRes) { // 处理数据为空的情况
        allArticleCache.value = [];
        totalArticles.value = 0;
        updateDisplayArticles();
      }
    })
    .catch(error => {
      console.error('按分类获取文章失败', error);
      ElMessage.error('获取文章失败，请稍后重试');
    })
    .finally(() => {
      articlesLoading.value = false;
    });
};

// 热门标签数据 - 默认值作为备用
const popularTags = ref([
  { name: 'Vue.js', count: 128 },
  { name: 'React', count: 98 },
  { name: 'TypeScript', count: 86 },
  { name: 'JavaScript', count: 76 },
  { name: 'Node.js', count: 65 },
  { name: 'CSS', count: 54 },
  { name: 'HTML', count: 48 },
  { name: 'Webpack', count: 42 },
  { name: 'Git', count: 38 },
  { name: 'Docker', count: 35 }
]);

// 可以在 onMounted 中也检查一下 ref 是否已正确挂载
// Removed: Empty onMounted hook
// onMounted(() => {
// 
// });
</script>

<style lang="less" scoped>
/* Removed: First .blog-container block (lines 635-640) as it's superseded by the one at line 1259 */
 .blog-container {
  font-family: 'OPPO Sans' !important;
  padding: 20px;
  margin: 0 auto;
  letter-spacing: 0.2px; /* 轻微增加字间距提高可读性 */
}

/* 左侧导航栏样式 */
.left-sidebar {
  background-color: #fff;
  border-radius: 4px;
  height: calc(100vh - 40px);
  position: sticky;
  top: 20px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  transition: all 0.3s ease;
  border: 1px solid rgba(235, 236, 240, 0.8);
  
  &:hover {
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  }
  
  .sidebar-header {
    padding: 16px 20px;
    font-size: 15px;
    font-weight: 600;
    color: #1d2129;
    border-bottom: 1px solid #f0f2f5;
    letter-spacing: 0.3px;
    
    &.secondary {
      border-bottom: none;
      
      font-size: 14px;
    }
  }
  
  .sidebar-divider {
    height: 1px;
    background: #f0f2f5;
    margin: 8px 0;
  }
  
  .nav-section {
    padding: 8px 0;
    flex: 0 0 auto;
    
    .nav-item {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      margin: 2px 8px;
      cursor: pointer;
      font-size: 14px;
      
      border-radius: 6px;
      transition: all 0.25s;
      position: relative;
      
      &:hover {
        background-color: #f5f6f7;
        color: #1e80ff;
      }
      
      &.active {
        color: #1e80ff;
        background-color: #e8f3ff;
        font-weight: 500;
      }
      
      .nav-icon {
        margin-right: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 24px;
        height: 24px;
        border-radius: 6px;
        background: linear-gradient(135deg, rgba(30, 128, 255, 0.1), rgba(30, 128, 255, 0.05));
        color: inherit;
        transition: all 0.25s;
        
        .el-icon {
          font-size: 16px;
        }
      }
      
      &.active .nav-icon {
        background: linear-gradient(135deg, #1e80ff, #4e9fff);
        color: white;
      }
      
            .nav-text {
        flex: 1;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .nav-count {
        font-size: 12px;
        color: #86909c;
        background: #f2f3f5;
        border-radius: 10px;
        padding: 2px 8px;
        min-width: 24px;
        text-align: center;
        transition: all 0.25s;
      }
      
      &:hover .nav-count {
        background: #e8f3ff;
        color: #1e80ff;
      }
      
      &.active .nav-count {
        background: rgba(255, 255, 255, 0.9);
        color: #1e80ff;
      }
    }
  }
  
  .tag-section {
    padding: 4px 16px 12px;
    flex: 1;
    overflow-y: auto;
    
    .tag-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      cursor: pointer;
      border-radius: 4px;
      transition: all 0.2s;
      
      &:hover {
        .tag-name {
          color: #1e80ff;
        }
      }
      
      .tag-name {
        font-size: 13px;
        
        transition: color 0.2s;
      }
      
      .tag-count {
        font-size: 12px;
        color: #86909c;
        background: #f2f3f5;
        border-radius: 10px;
        padding: 1px 6px;
        min-width: 20px;
        text-align: center;
      }
    }
  }
  
  .sidebar-footer {
    padding: 16px;
    border-top: 1px solid #f0f2f5;
    
    .sidebar-actions {
      .sidebar-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 36px;
        border-radius: 6px;
        border: 1px dashed #1e80ff;
        background: rgba(30, 128, 255, 0.05);
        color: #1e80ff;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s;
        gap: 6px;
        
        &:hover {
          background: rgba(30, 128, 255, 0.1);
        }
        
        .el-icon {
          font-size: 14px;
        }
      }
    }
  }
}

/* Removed: First .main-content block (lines 788-963) as it's superseded by the one at line 1270 */
/* This included the first definitions for .category-nav, .article-list, and .article-item */

/* Removed: First .pagination-container block (lines 965-978) as it's superseded by the one at line 1467 */

/* 右侧边栏样式 */
.right-sidebar {
  flex-shrink: 0;

  /* 所有卡片的通用样式 */
  .login-card, .author-rank, .topic-recommend, .ad-section {
    background-color: #fff;
    border-radius: 4px;
    padding: 16px;
    margin-bottom: 16px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  }

  /* 登录卡片 */
  .login-card {
    background: #ffffff;
    border-radius: 4px;
    padding: 0;
    margin-bottom: 18px;
    overflow: hidden;
    border: 1px solid rgba(235, 236, 240, 0.8);
    
    /* 未登录状态 */
    .card-header {
      padding: 16px 20px;
      display: flex;
      align-items: center;
      border-bottom: 1px solid #f0f2f5;
      
      .site-logo {
        color: #1e80ff;
        font-size: 24px;
        margin-right: 8px;
      }
      
      span {
        font-size: 16px;
        font-weight: 600;
        color: #1d2129;
      }
    }

    .card-content {
      padding: 20px;
      
      .welcome-banner {
        text-align: center;
        margin-bottom: 20px;
        
        .welcome-icon {
          font-size: 80px;
          margin-bottom: 12px;
          color: #1e80ff;
          background: #f2f7ff;
          width: 120px;
          height: 120px;
          border-radius: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 12px;
        }
        
        p {
          font-size: 14px;
          
        }
      }
      
      .login-options {
        display: flex;
        gap: 12px;
        margin-bottom: 20px;
        
        .login-btn {
          flex: 1;
          height: 38px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          transition: all 0.3s;
          
          .el-icon {
            font-size: 16px;
          }
          
          &.primary {
            background: #1e80ff;
            color: white;
            border: none;
            
            &:hover {
              background: #1671e6;
              box-shadow: 0 4px 12px rgba(30, 128, 255, 0.2);
            }
          }
          
          &.outlined {
            background: white;
            color: #1e80ff;
            border: 1px solid #1e80ff;
            
            &:hover {
              background: rgba(30, 128, 255, 0.05);
            }
          }
        }
      }
      
      .social-login {
        .divider {
          display: flex;
          align-items: center;
          color: #86909c;
          font-size: 12px;
          margin: 16px 0;
          
          &:before, &:after {
            content: '';
            flex: 1;
            border-top: 1px solid #e5e6eb;
          }
          
          span {
            padding: 0 10px;
          }
        }
        
        .social-icons {
          display: flex;
          justify-content: center;
          gap: 20px;
          
          .social-icon {
            width: 36px;
            height: 36px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
            color: white;
            
            .el-icon {
              font-size: 18px;
            }
            
            &:hover {
              transform: translateY(-5px) scale(1.15);
            }
            
            &.wechat {
              background: #07c160;
              
              &:hover {
                box-shadow: 0 4px 12px rgba(7, 193, 96, 0.3);
              }
            }
            
            &.weibo {
              background: #ff8200;
              
              &:hover {
                box-shadow: 0 4px 12px rgba(255, 130, 0, 0.3);
              }
            }
            
            &.github {
              background: #24292e;
              
              &:hover {
                box-shadow: 0 4px 12px rgba(36, 41, 46, 0.3);
              }
            }
          }
        }
      }
    }
    
    /* 已登录状态样式 */
    .user-banner {
      position: relative;
      height: 80px;
      
      .banner-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: linear-gradient(120deg, #1e80ff, #6368e7);
        z-index: 1;
      }
      
      .user-avatar-large {
        position: absolute;
        bottom: -30px;
        left: 50%;
        transform: translateX(-50%);
        z-index: 2;
        
        .el-avatar {
          border: 4px solid white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        
        .vip-badge {
          position: absolute;
          bottom: 0;
          right: 0;
          background: linear-gradient(135deg, #f5b914, #ffbd2e);
          border-radius: 50%;
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
          color: white;
          box-shadow: 0 2px 6px rgba(245, 185, 20, 0.3);
          
          .el-icon {
            font-size: 12px;
          }
        }
      }
    }

    .user-profile {
      padding: 40px 20px 20px;
      
      .user-header {
        text-align: center;
        margin-bottom: 16px;
        
        .user-name {
          font-size: 16px;
          font-weight: 600;
          color: #1d2129;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
          
          .bitle-tag {
            margin-left: 6px;
          }
        }
        
        .user-bio {
          font-size: 13px;
        }
      }
      
      .user-activity {
        background: #f8fafc;
        border-radius: 8px;
        padding: 12px 16px;
        margin-bottom: 16px;
        
        .activity-item {
          display: flex;
          align-items: center;
          font-size: 13px;
          
          
          .el-icon {
            color: #1e80ff;
            margin-right: 6px;
            font-size: 16px;
          }
          
          b {
            color: #1e80ff;
            font-weight: 600;
            margin: 0 2px;
          }
          
          .sign-btn {
            margin-left: auto;
            background: linear-gradient(90deg, #ff8f00, #ffad33);
            color: white;
            border: none;
            border-radius: 4px;
            padding: 4px 10px;
            font-size: 12px;
            cursor: pointer;
            transition: all 0.3s;
            
            &:hover {
              box-shadow: 0 2px 8px rgba(255, 143, 0, 0.3);
            }
          }
        }
      }
      
      .user-stats {
        display: flex;
        justify-content: space-around;
        padding: 12px 0;
        border-top: 1px solid #f0f2f5;
        border-bottom: 1px solid #f0f2f5;
        margin-bottom: 16px;
        
        .stat-item {
          flex: 1;
          text-align: center;
          padding: 0 8px;
          cursor: pointer;
          transition: all 0.2s;
          
          &:hover {
            transform: translateY(-4px) scale(1.05);
            
            .stat-value {
              color: #1e80ff;
            }
          }
          
          .stat-value {
            font-size: 16px;
            font-weight: 600;
            color: #1d2129;
            transition: color 0.2s;
          }
          
          .stat-label {
            font-size: 12px;
            color: #86909c;
            margin-top: 4px;
          }
        }
      }
      
      .user-actions {
        display: flex;
        justify-content: space-between;
        margin-bottom: 16px;
        gap: 10px;
        
        .action-btn {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 36px;
          border-radius: 8px;
          font-size: 14px;
          cursor: pointer;
          gap: 6px;
          transition: all 0.3s;
          
          .el-icon {
            font-size: 16px;
          }
        }
        
        .write-btn {
          background: #1e80ff;
          color: white;
          border: none;
          
          &:hover {
            background: #1671e6;
            box-shadow: 0 4px 12px rgba(30, 128, 255, 0.2);
          }
        }
        
        .profile-btn {
          background: #f2f3f5;
          
          border: none;
          
          &:hover {
            background: #e5e6eb;
          }
        }
      }
      
      .recent-medals {
        .medals-header {
          font-size: 14px;
          font-weight: 600;
          color: #1d2129;
          margin-bottom: 12px;
        }
        
        .medals-list {
          display: flex;
          gap: 12px;
          
          .medal-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
            transition: all 0.3s;
            
            .medal-icon {
              font-size: 24px;
              width: 40px;
              height: 40px;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              margin-bottom: 4px;
              color: white;
              
              &.top {
                background: linear-gradient(135deg, #ff5c00, #ff9a56);
              }
              
              &.year {
                background: linear-gradient(135deg, #1e80ff, #a6c8ff);
              }
              
              &.active {
                background: linear-gradient(135deg, #f5b914, #ffbd2e);
              }
            }
            
            span {
              font-size: 12px;
              color: #86909c;
            }
            
            &:hover {
              transform: translateY(-6px) scale(1.1);
              
              span {
                color: #1e80ff;
              }
            }
          }
        }
      }
    }
  }
.text-member-crown{
  font-size: 12px !important;
}
  /* 作者榜单和话题推荐的通用样式 */
  .author-rank, .topic-recommend {
    .rank-header, .topic-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
      font-size: 14px;
      font-weight: 500;
      color: #1d2129;
      
      .more {
        font-size: 13px;
        color: #8a919f;
        text-decoration: none;

        &:hover {
          color: #1e80ff;
        }
      }
    }
  }

  /* 作者榜单 */
  .author-rank {
    /* 作者列表 */
    .author-list {
      .author-item {
        display: flex;
        align-items: center;
        margin-bottom: 16px;
        padding-bottom: 16px;
        border-bottom: 1px solid #f1f1f1;

        &:last-child {
          margin-bottom: 0;
          padding-bottom: 0;
          border-bottom: none;
        }

        /* 作者头像 */
        .author-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 12px;
          background-color: #f4f5f5;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
        }

        /* 作者信息 */
        .author-info {
          flex: 1;
          margin-right: 12px;
          overflow: hidden;

          .author-name {
            font-size: 14px;
            color: #1d2129;
            margin-bottom: 4px;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .author-desc {
            font-size: 12px;
            color: #8a919f;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        /* 关注按钮 */
        .follow-btn {
          padding: 4px 8px;
          font-size: 12px;
          color: #1e80ff;
          background-color: rgba(30, 128, 255, 0.1);
          border: none;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s;
          white-space: nowrap;

          &:hover {
            background-color: rgba(30, 128, 255, 0.2);
          }
        }
      }
    }
  }

  /* 话题推荐 */
  .topic-recommend {
    /* 话题列表 */
    .topic-list {
      .topic-item {
        padding: 8px 0;
        border-bottom: 1px solid #f1f1f1;

        &:last-child {
          border-bottom: none;
        }

        .topic-name {
          font-size: 14px;
          color: #1d2129;
          margin-bottom: 4px;
          cursor: pointer;
          font-weight: 500;

          &:hover {
            color: #1e80ff;
          }
        }

        .topic-count {
          font-size: 12px;
          color: #8a919f;
        }
      }
    }
  }

  /* 广告区域 */
  .ad-section {
    img {
      width: 100%;
      border-radius: 4px;
      display: block;
    }
  }
}

/* 整体容器样式 */
.blog-container {
  padding: 20px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  letter-spacing: 0.2px; /* 轻微增加字间距提高可读性 */
  
  /* 移动端适配 */
  @media screen and (max-width: 599px) {
    padding: 10px;
  }
}

/* 中间内容区样式 */
.main-content {
  background-color: #fff;
  border-radius: 4px;
  
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  min-width: 0; /* 确保flex子项可以正确缩小 */
  overflow: hidden; /* 确保内容不溢出圆角边框 */

  /* 顶部分类导航 */
  .category-nav {
    border-bottom: 1px solid #f1f1f1;

    .nav-tabs {
      display: flex;
      height: 46px; /* 固定高度与图片一致 */

      .tab {
        padding: 0 16px;
        font-size: 14px;
        cursor: pointer;
        position: relative;
        color: #86909c;
        display: flex;
        align-items: center;
        height: 100%;

        &.active {
          color: #1e80ff;
          font-weight: 500;

          &::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background-color: #1e80ff;
          }
        }

        &:hover:not(.active) {
          color: #1d2129;
        }
      }
    }
  }

  /* 文章列表 */
  .article-list {
    padding: 16px 0;
    
    .article-item {
      display: flex;
      background: #fff;
      border-radius: 12px;
      margin-bottom: 20px;
      padding: 24px;
      box-shadow: 0 2px 12px rgba(0,0,0,0.06);
      transition: all 0.3s;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      gap: 24px;
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 6px 16px rgba(0,0,0,0.1);
      }
      
      // 右侧缩略图
      .article-cover {
        flex-shrink: 0;
        width: 220px;
        height: 140px;
        border-radius: 8px;
        overflow: hidden;
        align-self: center;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.5s;
        }
        
        &:hover img {
          transform: scale(1.05);
        }
      }
      
      // 左侧内容区
      .article-main {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        min-width: 0;
        
        // 上部分：标题和标签
        .article-header {
          margin-bottom: 10px;
          
          .article-title-wrapper {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 5px;
          }
          
          .article-title {
            font-size: 18px;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
            line-height: 1.4;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        
        // 中部分：描述内容
        .article-content {
          flex-grow: 1;
          
          .article-preview {
            font-size: 14px;
            
            line-height: 1.6;
            margin-bottom: 16px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
        }
        
        // 底部：标签和作者信息
        .article-footer {
          margin-top: auto;
          
          // 作者和统计信息
          .article-meta {
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            align-items: center;
            
            .meta-item {
              display: flex;
              align-items: center;
              gap: 4px;
              
              .el-icon {
                font-size: 14px;
                color: #86909c;
              }
            }
            
            .meta-item.author {
              margin-right: 12px;
              
              .el-avatar {
                margin-right: 6px;
                border: 1px solid rgba(0,0,0,0.05);
              }
              
              span {
                margin-right: 6px;
                
                font-weight: 500;
              }
            }
            
            .meta-stats {
              display: flex;
              align-items: center;
              gap: 12px;
              font-size: 13px;
              color: #86909c;
              flex-wrap: wrap;
              margin-top: 10px;
            }
          }
        }
      }
    }
    
    // 移动端适配
    @media (max-width: 767px) {
      padding: 12px 0;
      
      .article-item {
        flex-direction: column;
        padding: 16px;
        gap: 12px;
        
        .article-cover {
          width: 100%;
          height: 160px;
          order: -1; // 移动端将封面图放在最上方
          margin-bottom: 16px;
        }
        
        .article-main {
          .article-header {
            .article-title {
              font-size: 16px;
              margin-bottom: 6px;
            }
          }
          
          .article-content .article-preview {
            font-size: 14px;
          }
          
          .article-footer {
            .article-meta {
              flex-direction: column;
              align-items: flex-start;
              gap: 10px;
              
              .meta-item.author {
                width: 100%;
                margin-bottom: 4px;
              }
              
              .meta-stats {
                width: 100%;
                justify-content: space-between;
              }
            }
          }
        }
      }
    }
    
    // 适配小屏移动设备
    @media (max-width: 480px) {
      .article-item {
        padding: 12px;
        
        .article-cover {
          height: 140px;
        }
        
        .article-title {
          font-size: 15px;
        }
        
        .article-preview {
          font-size: 13px;
        }
        
        .article-meta {
          .meta-stats {
            font-size: 11px;
            
            .meta-item .el-icon {
              font-size: 12px;
            }
          }
        }
        
        /* 只保留布局相关样式 */
        .header-tags {
          margin-bottom: 6px;
        }
      }
    }
  }
}

/* 分页容器样式 */
.pagination-container {
  padding: 16px;
  display: flex;
  justify-content: center;
  
  @media screen and (max-width: 767px) {
    padding: 12px 8px;
    
    :deep(.el-pagination) {
      width: 100%;
      justify-content: center;
      flex-wrap: wrap;
      row-gap: 10px;
    }
  }
}

/* 动画基础样式 */
.animate-item {
  animation: smoothIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

@keyframes smoothIn {
  0% {
    opacity: 0;
    transform: scale(0.95) translateY(20px);
  }
  60% {
    opacity: 0.8;
    transform: scale(1.02) translateY(-5px);
  }
  100% {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* 为文章项添加悬停及过渡动画 */
.article-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* 为导航项添加过渡动画 */
.nav-item {
  transition: all 0.15s cubic-bezier(0.4, 0, 0.2, 1); /* 从 0.3s 改为 0.15s */
  
  &:hover {
  
  }
  
  .nav-icon {
    transition: all 0.15s ease; /* 从 0.3s 改为 0.15s */
    
    .el-icon {
      transition: transform 0.15s ease; /* 从 0.3s 改为 0.15s */
    }
  }
  
  &:hover .nav-icon {
    transform: scale(1.2);
    
    .el-icon {
      transform: rotate(15deg);
    }
  }
}

/* 修改滑入动画 */
@keyframes slideInRight {
  0% {
    opacity: 0;
    transform: translateX(-20px);
  }
  100% {
    opacity: 1;
    transform: translateX(0);
  }
}

/* 添加骨架屏样式 */
.skeleton {
  position: relative;
  overflow: hidden;
  background: #f5f6f7;
  border-radius: 4px;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 0.3) 50%,
      rgba(255, 255, 255, 0) 100%
    );
    animation: shimmer 1.5s infinite;
  }
}

.article-skeleton {
  .article-item {
    .article-title {
      height: 24px;
      margin-bottom: 12px;
      width: 90%;
    }
    
    .header-tags {
      display: flex;
      gap: 8px;
      margin-bottom: 16px;
      
      .skeleton-tag {
        height: 20px;
        width: 50px;
        border-radius: 4px;
        background: #f0f1f2;
      }
    }
    
    .article-preview {
      height: 16px;
      margin-bottom: 10px;
      width: 100%;
      
      &:last-child {
        margin-bottom: 20px;
      }
    }
    
    .article-meta {
      display: flex;
      justify-content: space-between;
      width: 100%;
      
      .skeleton-author {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .skeleton-avatar {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: #f0f1f2;
        }
        
        .skeleton-name {
          width: 80px;
          height: 14px;
          background: #f0f1f2;
          border-radius: 2px;
        }
      }
      
      .meta-stats {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 13px;
        color: #86909c;
        flex-wrap: wrap;
      }
    }
    
    .article-cover {
      height: 140px;
      width: 220px;
      border-radius: 8px;
    }
  }
}

@media (max-width: 767px) {
  .article-skeleton {
    .article-item {
      flex-direction: column;
      
      .article-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
        
        .skeleton-author {
          margin-bottom: 8px;
        }
        
        .meta-stats {
          width: 100%;
          justify-content: space-between;
        }
      }
      
      .article-cover {
        order: -1;
        width: 100%;
        height: 160px;
        margin-bottom: 16px;
      }
    }
  }
}

@keyframes shimmer {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

/* 移动端适配 */
@media (max-width: 767px) {
  .article-item {
    flex-direction: column;
    padding: 16px;
    
    .article-cover {
      width: 100%;
      height: 160px;
      order: -1; // 移动端将封面图放在最上方
      margin-bottom: 16px;
    }
    
    .article-meta {
      flex-direction: column;
      align-items: flex-start;
      
      .meta-item.author {
        width: 100%;
        margin-bottom: 8px;
      }
      
      .meta-stats {
        width: 100%;
        gap: 8px;
      }
    }

    .article-header {
      .article-title {
        font-size: 16px;
        margin-bottom: 6px;
      }
    }
    
    .article-content .article-preview {
      font-size: 14px;
    }
  }
}

/* 小屏幕适配 */
@media (max-width: 480px) {
  .article-item {
    padding: 12px;
    
    .article-cover {
      height: 140px;
    }
    
    .article-title {
      font-size: 15px;
    }
    
    .article-preview {
      font-size: 13px;
    }
    
    .article-meta {
      .meta-stats {
        font-size: 11px;
        
        .meta-item .el-icon {
          font-size: 12px;
        }
      }
    }
    
    /* 只保留布局相关样式 */
    .header-tags {
      margin-bottom: 6px;
    }
  }
}



</style>
    
    
