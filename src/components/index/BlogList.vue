<template>
  <div class="blog-list">
    <div class="list-header">
      <div class="list-title">
        <h2>最新文章</h2>
        <div class="title-underline"></div>
      </div>
      <div class="list-tabs">
        <div 
          v-for="(tab, index) in tabs" 
          :key="index"
          class="tab"
          :class="{ active: activeTab === index }"
          @click="setActiveTab(index)"
        >
          <span>{{ tab }}</span>
        </div>
      </div>
    </div>
    
    <transition-group 
      name="post-list"
      tag="div" 
      class="posts-container"
    >
      <div 
        v-for="(post, index) in displayPosts" 
        :key="post.id"
        class="post-item animate__animated animate__fadeInUp"
        :style="`animation-delay: ${0.1 + index * 0.1}s`"
        @click="navigateToPost(post.id)"
      >
        <div class="post-image">
          <img :src="post.cover" alt="文章封面">
          <div class="post-badge" v-if="post.isTop">
            <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="pushpin" aria-hidden="true"><path d="M878.3 392.1L631.9 145.7c-6.5-6.5-15-9.7-23.5-9.7s-17 3.2-23.5 9.7L423.8 306.9c-12.2-1.4-24.5-2-36.8-2-73.2 0-146.4 24.1-206.5 72.3a33.23 33.23 0 00-2.7 49.4l181.7 181.7-215.4 215.2a15.8 15.8 0 00-4.6 9.8l-3.4 37.2c-.9 9.4 6.6 17.4 15.9 17.4.5 0 1 0 1.5-.1l37.2-3.4c3.7-.3 7.2-2 9.8-4.6l215.4-215.4 181.7 181.7c6.5 6.5 15 9.7 23.5 9.7 9.7 0 19.3-4.2 25.9-12.4 56.3-70.3 79.7-158.3 70.2-243.4l161.1-161.1c12.9-12.8 12.9-33.8 0-46.8zM666.2 549.3l-24.5 24.5 3.8 44.4a274.42 274.42 0 01-37.1 148.2L379.5 537.3c43.7-22.6 90.3-34.5 137.9-36.7l44.4 3.8 24.5-24.5c15.4-15.4 39.8-18.7 58.2-10.4l-34.5-34.5a238.7 238.7 0 00-58.4-48.2l35.8-35.8-61.5-61.4L439.8 373l36.7 36.7a238.42 238.42 0 00-48.2 58.4l-34.5 34.5c8.5-18.5 4.9-43.1-10.4-58.4l-24.5-24.5 3.8-44.4c-25.7-3-85.9 5.1-156.9 47.6L379.5 250c41.2-33.3 89.9-55.3 142.2-63.2l-26.8 26.8c-12.9 12.9-12.9 33.9 0 46.8 12.9 12.9 33.9 12.9 46.8 0l26.8-26.8c-8.3 52.6-29.8 101.6-63.2 142.9L332.8 602.9c42.5-71.1 50.6-131.4 47.6-156.9l-44.4 3.8-24.5-24.5c-15.4-15.4-39.8-18.7-58.4-10.4l34.5-34.5a238.7 238.7 0 0058.4-48.2l36.7 36.7 83.8-83.8-61.5-61.4-35.8 35.8a239.35 239.35 0 00-48.2-58.4l-34.5-34.5c8.4-18.6 4.8-43.1-10.4-58.5l-24.5-24.5 3.8-44.4c-50.4-4.3-121 7.7-188.8 54.6l143 143a480.85 480.85 0 00-51.9 63.5l-38.4-38.4c-12.9-12.9-33.9-12.9-46.8 0-12.9 12.9-12.9 33.9 0 46.8l38.4 38.4a481.26 481.26 0 00-63.5 51.9l-143-143c-46.9 67.7-58.9 138.3-54.6 188.8l44.4-3.8 24.5 24.5c15.4 15.4 39.8 18.7 58.4 10.4l-34.5 34.5a238.35 238.35 0 00-58.4 48.2l-36.7-36.7-83.8 83.8 61.5 61.4 35.8-35.8c14.1 17.3 30.7 33.9 48.2 48.2l34.5 34.5c-8.4 18.6-4.8 43.1 10.4 58.4l24.5 24.5-3.8 44.4c50.4 4.3 121-7.7 188.8-54.6L666.2 549.3zm-134.4-7.7L420.7 430.5c1.5 82.9-26.8 161.2-69.2 219l162.3 162.3c58.1-42.4 136.4-70.6 219-69.2l-201-201z"></path></svg></i>
            置顶
          </div>
          <div class="post-badges">
            <span v-if="post.isRecommend" class="badge recommend">推荐</span>
            <span v-if="post.isOriginal" class="badge original">原创</span>
          </div>
        </div>
        <div class="post-content">
          <h3 class="post-title">{{ post.title }}</h3>
          <p class="post-excerpt">{{ post.excerpt }}</p>
          
          <div class="post-meta">
            <div class="meta-item category">
              <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="tag" aria-hidden="true"><path d="M938 458.8l-29.6-312.6c-1.5-16.2-14.4-29-30.6-30.6L565.2 86h-.4c-3.2 0-5.7 1-7.6 2.9L88.9 557.2a9.96 9.96 0 000 14.1l363.8 363.8c1.9 1.9 4.4 2.9 7.1 2.9s5.2-1 7.1-2.9l468.3-468.3c2-2.1 3-5 2.8-8zM459.7 834.7L189.3 564.3 589 164.6 836 188l23.4 247-399.7 399.7zM680 256c-48.5 0-88 39.5-88 88s39.5 88 88 88 88-39.5 88-88-39.5-88-88-88zm0 120c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"></path></svg></i>
              <span>{{ post.category }}</span>
            </div>
            <div class="meta-item date">
              <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="clock-circle" aria-hidden="true"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"></path><path d="M686.7 638.6L544.1 535.5V288c0-4.4-3.6-8-8-8H488c-4.4 0-8 3.6-8 8v275.4c0 2.6 1.2 5 3.3 6.5l165.4 120.6c3.6 2.6 8.6 1.8 11.2-1.7l28.6-39c2.6-3.7 1.8-8.7-1.8-11.2z"></path></svg></i>
              <span>{{ formatDate(post.publishTime) }}</span>
            </div>
          </div>
          
          <div class="post-footer">
            <div class="author">
              <img :src="post.author.avatar" alt="作者头像">
              <span>{{ post.author.name }}</span>
            </div>
            <div class="stats">
              <div class="stat-item views">
                <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="eye" aria-hidden="true"><path d="M942.2 486.2C847.4 286.5 704.1 186 512 186c-192.2 0-335.4 100.5-430.2 300.3a60.3 60.3 0 000 51.5C176.6 737.5 319.9 838 512 838c192.2 0 335.4-100.5 430.2-300.3 7.7-16.2 7.7-35 0-51.5zM512 766c-161.3 0-279.4-81.8-362.7-254C232.6 339.8 350.7 258 512 258c161.3 0 279.4 81.8 362.7 254C791.5 684.2 673.4 766 512 766zm-4-430c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm0 288c-61.9 0-112-50.1-112-112s50.1-112 112-112 112 50.1 112 112-50.1 112-112 112z"></path></svg></i>
                <span>{{ post.views }}</span>
              </div>
              <div class="stat-item likes">
                <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="like" aria-hidden="true"><path d="M885.9 533.7c16.8-22.2 26.1-49.4 26.1-77.7 0-44.9-25.1-87.4-65.5-111.1a67.67 67.67 0 00-34.3-9.3H572.4l6-122.9c1.4-29.7-9.1-57.9-29.5-79.4A106.62 106.62 0 00471 99.9c-52 0-98 35-111.8 85.1l-85.9 311H144c-17.7 0-32 14.3-32 32v364c0 17.7 14.3 32 32 32h601.3c9.2 0 18.2-1.8 26.5-5.4 47.6-20.3 78.3-66.8 78.3-118.4 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7 0-12.6-1.8-25-5.4-37 16.8-22.2 26.1-49.4 26.1-77.7-.2-12.6-2-25.1-5.6-37.1zM184 852V568h81v284h-81zm636.4-353l-21.9 19 13.9 25.4a56.2 56.2 0 016.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 016.9 27.3c0 16.5-7.2 32.2-19.6 43l-21.9 19 13.9 25.4a56.2 56.2 0 016.9 27.3c0 22.4-13.2 42.6-33.6 51.8H329V564.8l99.5-360.5a44.1 44.1 0 0142.2-32.3c7.6 0 15.1 2.2 21.1 6.7 9.9 7.4 15.2 18.6 14.6 30.5l-9.6 198.4h314.4C829 418.5 840 436.9 840 456c0 16.5-7.2 32.1-19.6 43z"></path></svg></i>
                <span>{{ post.likes }}</span>
              </div>
              <div class="stat-item comments">
                <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="message" aria-hidden="true"><path d="M464 512a48 48 0 1096 0 48 48 0 10-96 0zm200 0a48 48 0 1096 0 48 48 0 10-96 0zm-400 0a48 48 0 1096 0 48 48 0 10-96 0zm661.2-173.6c-22.6-53.7-55-101.9-96.3-143.3a444.35 444.35 0 00-143.3-96.3C630.6 75.7 572.2 64 512 64h-2c-60.6.3-119.3 12.3-174.5 35.9a445.35 445.35 0 00-142 96.5c-40.9 41.3-73 89.3-95.2 142.8-23 55.4-34.6 114.3-34.3 174.9A449.4 449.4 0 00112 714v152a46 46 0 0046 46h152.1A449.4 449.4 0 00510 960h2.1c59.9 0 118-11.6 172.7-34.3a444.48 444.48 0 00142.8-95.2c41.3-40.9 73.8-88.7 96.5-142 23.6-55.2 35.6-113.9 35.9-174.5.3-60.9-11.5-120-34.8-175.6zm-151.1 438C704 845.8 611 884 512 884h-1.7c-60.3-.3-120.2-15.3-173.1-43.5l-8.4-4.5H188V695.2l-4.5-8.4C155.3 633.9 140.3 574 140 513.7c-.4-99.7 37.7-193.3 107.6-263.8 69.8-70.5 163.1-109.5 262.8-109.9h1.7c50 0 98.5 9.7 144.2 28.9 44.6 18.7 84.6 45.6 119 80 34.3 34.3 61.3 74.4 80 119 19.4 46.2 29.1 95.2 28.9 145.8-.6 99.6-39.7 192.9-110.1 262.7z"></path></svg></i>
                <span>{{ post.comments }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition-group>
    
    <div class="load-more" v-if="hasMorePosts">
      <button @click="loadMore" :disabled="loading">
        <i class="ant-icon" :class="{ 'loading': loading }">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="sync" aria-hidden="true"><path d="M168 504.2c1-43.7 10-86.1 26.9-126 17.3-41 42.1-77.7 73.7-109.4S337 212.3 378 195c42.4-17.9 87.4-27 133.9-27s91.5 9.1 133.8 27A341.5 341.5 0 01755 268.8c9.9 9.9 19.2 20.4 27.8 31.4l-60.2 47a8 8 0 003 14.1l175.7 43c5 1.2 9.9-2.6 9.9-7.7l.8-180.9c0-6.7-7.7-10.5-12.9-6.3l-56.4 44.1C765.8 155.1 646.2 92 511.8 92 282.7 92 96.3 275.6 92 503.8a8 8 0 008 8.2h60c4.4 0 7.9-3.5 8-7.8zm756 7.8h-60c-4.4 0-7.9 3.5-8 7.8-1 43.7-10 86.1-26.9 126-17.3 41-42.1 77.8-73.7 109.4A342.45 342.45 0 01512.1 856a342.24 342.24 0 01-243.2-100.8c-9.9-9.9-19.2-20.4-27.8-31.4l60.2-47a8 8 0 00-3-14.1l-175.7-43c-5-1.2-9.9 2.6-9.9 7.7l-.7 181c0 6.7 7.7 10.5 12.9 6.3l56.4-44.1C258.2 868.9 377.8 932 512.2 932c229.2 0 415.5-183.7 419.8-411.8a8 8 0 00-8-8.2z"></path></svg>
        </i>
        <span>{{ loading ? '加载中...' : '加载更多' }}</span>
      </button>
    </div>
    
    <div class="empty-state" v-if="!loading && displayPosts.length === 0">
      <div class="empty-icon">
        <i class="ant-icon"><svg viewBox="64 64 896 896" focusable="false" data-icon="file-text" aria-hidden="true"><path d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0042 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z"></path></svg></i>
      </div>
      <div class="empty-text">没有找到相关文章</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

interface Author {
  id: number;
  name: string;
  avatar: string;
}

interface Post {
  id: number;
  title: string;
  excerpt: string;
  cover: string;
  category: string;
  publishTime: string;
  views: number;
  likes: number;
  comments: number;
  isTop: boolean;
  isRecommend: boolean;
  isOriginal: boolean;
  author: Author;
  tags?: string[];
}

// Add search keyword prop
const props = defineProps({
  category: {
    type: Number,
    default: 0
  },
  keyword: {
    type: String,
    default: ''
  }
});

const posts = ref<Post[]>([
  {
    id: 1,
    title: '如何使用Vue 3构建高性能Web应用',
    excerpt: 'Vue 3带来了许多新特性，如Composition API、Teleport组件、片段等。本文将介绍如何利用这些新特性构建高性能的Web应用。',
    cover: '/src/assets/images/blog1.jpg',
    category: '前端开发',
    publishTime: '2023-10-20',
    views: 1856,
    likes: 124,
    comments: 32,
    isTop: true,
    isRecommend: true,
    isOriginal: true,
    author: {
      id: 1,
      name: '南瓜头',
      avatar: '/src/assets/images/avatar1.jpg'
    }
  },
  {
    id: 2,
    title: 'TypeScript高级类型与类型操作技巧',
    excerpt: '本文将深入探讨TypeScript的高级类型系统，包括条件类型、映射类型、类型推断等，帮助你更好地利用TypeScript提升代码质量。',
    cover: '/src/assets/images/blog2.jpg',
    category: '编程语言',
    publishTime: '2023-10-18',
    views: 1352,
    likes: 98,
    comments: 24,
    isTop: false,
    isRecommend: true,
    isOriginal: true,
    author: {
      id: 2,
      name: '技术小达人',
      avatar: '/src/assets/images/avatar2.jpg'
    }
  },
  {
    id: 3,
    title: 'Node.js微服务架构设计与实践',
    excerpt: '微服务架构已成为构建大型应用的流行方式，本文将介绍如何使用Node.js设计和实现微服务架构，包括服务发现、API网关等。',
    cover: '/src/assets/images/blog3.jpg',
    category: '后端开发',
    publishTime: '2023-10-15',
    views: 1245,
    likes: 82,
    comments: 18,
    isTop: false,
    isRecommend: false,
    isOriginal: false,
    author: {
      id: 3,
      name: '后端工程师',
      avatar: '/src/assets/images/avatar3.jpg'
    }
  },
  {
    id: 4,
    title: 'Docker容器化应用部署最佳实践',
    excerpt: 'Docker已成为应用部署的标准工具，本文将分享Docker容器化应用部署的最佳实践，帮助你构建更高效、更可靠的部署流程。',
    cover: '/src/assets/images/blog4.jpg',
    category: '开发工具',
    publishTime: '2023-10-12',
    views: 986,
    likes: 64,
    comments: 15,
    isTop: false,
    isRecommend: true,
    isOriginal: true,
    author: {
      id: 4,
      name: '运维专家',
      avatar: '/src/assets/images/avatar4.jpg'
    }
  },
  {
    id: 5,
    title: 'React Hooks深入解析与实战应用',
    excerpt: 'React Hooks是React 16.8引入的新特性，它允许你在不编写类组件的情况下使用状态和其他React特性。本文将深入解析React Hooks的工作原理和实战应用。',
    cover: '/src/assets/images/blog5.jpg',
    category: '前端开发',
    publishTime: '2023-10-10',
    views: 1420,
    likes: 105,
    comments: 28,
    isTop: false,
    isRecommend: false,
    isOriginal: true,
    author: {
      id: 5,
      name: 'React达人',
      avatar: '/src/assets/images/avatar5.jpg'
    }
  }
]);

// 定义Tab页签
const tabs = ref(['全部', '最新', '热门', '推荐']);
const activeTab = ref(0);
const pageSize = ref(5);
const currentPage = ref(1);
const loading = ref(false);

// 设置激活的Tab
const setActiveTab = (index: number) => {
  activeTab.value = index;
  // 重置分页，重新加载数据
  currentPage.value = 1;
};

// Update filteredPosts computed property to filter by keyword as well
const filteredPosts = computed(() => {
  let result = [...posts.value];
  
  // Filter by category if a specific category is selected
  if (props.category > 0) {
    // Match category names based on category ID
    const categoryNames = ['全部', '前端开发', '后端开发', '编程语言', '开发工具'];
    const selectedCategory = categoryNames[props.category] || '';
    
    if (selectedCategory !== '全部') {
      result = result.filter(post => post.category === selectedCategory);
    }
  }
  
  // Filter by search keyword if provided
  if (props.keyword) {
    const keyword = props.keyword.toLowerCase();
    result = result.filter(post => 
      post.title.toLowerCase().includes(keyword) || 
      post.excerpt.toLowerCase().includes(keyword) ||
      post.category.toLowerCase().includes(keyword) ||
      (post.tags && Array.isArray(post.tags) && post.tags.some((tag: string) => tag.toLowerCase().includes(keyword)))
    );
  }
  
  if (activeTab.value === 1) { // 最新
    result.sort((a, b) => new Date(b.publishTime).getTime() - new Date(a.publishTime).getTime());
  } else if (activeTab.value === 2) { // 热门
    result.sort((a, b) => b.views - a.views);
  } else if (activeTab.value === 3) { // 推荐
    result = result.filter(post => post.isRecommend);
  }
  
  return result;
});

// 显示的文章列表
const displayPosts = computed(() => {
  return filteredPosts.value.slice(0, currentPage.value * pageSize.value);
});

// 是否有更多文章
const hasMorePosts = computed(() => {
  return displayPosts.value.length < filteredPosts.value.length;
});

// 加载更多文章
const loadMore = () => {
  if (loading.value) return;
  
  loading.value = true;
  
  // 模拟API请求延迟
  setTimeout(() => {
    currentPage.value++;
    loading.value = false;
  }, 800);
};

// 格式化日期函数
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
};

// 导航到博客文章详情页
const navigateToPost = (id: number) => {
  router.push(`/post/${id}`);
};

// Add watch for keyword changes
watch(() => props.keyword, () => {
  currentPage.value = 1;
});

// 当Tab变化时重置
watch(activeTab, () => {
  currentPage.value = 1;
});

onMounted(() => {
  // 实际应用中，这里可以调用API获取文章数据
  console.log('BlogList component mounted');
});
</script>

<style lang="less" scoped>
.blog-list {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #eee;
  
  .list-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .list-title {
      h2 {
        font-size: 16px;
        font-weight: 600;
        color: #333;
        margin: 0;
      }
    }
    
    .list-tabs {
      display: flex;
      gap: 10px;
      
      .tab {
        cursor: pointer;
        padding: 5px 12px;
        border-radius: 4px;
        font-size: 14px;
        color: #666;
        background-color: #f9f9f9;
        transition: all 0.2s ease;
        
        &:hover {
          background-color: #f0f7ff;
          color: #1677FF;
        }
        
        &.active {
          background-color: #1677FF;
          color: white;
        }
      }
    }
  }
  
  .posts-container {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .post-item {
    display: flex;
    gap: 15px;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.2s ease;
    border: 1px solid #eee;
    padding: 0;
    background-color: #fff;
    
    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
      border-color: #e6f4ff;
      
      .post-title {
        color: #1677FF;
      }
    }
    
    .post-image {
      flex: 0 0 150px;
      height: 100px;
      position: relative;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
      }
      
      .post-badge {
        position: absolute;
        top: 5px;
        left: 5px;
        background-color: #ff7a45;
        color: white;
        padding: 2px 6px;
        border-radius: 2px;
        font-size: 12px;
        font-weight: 500;
        z-index: 2;
      }
      
      .post-badges {
        position: absolute;
        top: 5px;
        right: 5px;
        display: flex;
        flex-direction: column;
        gap: 5px;
        z-index: 2;
        
        .badge {
          font-size: 12px;
          padding: 2px 6px;
          border-radius: 2px;
          color: white;
          font-weight: 500;
          
          &.recommend {
            background-color: #1677FF;
          }
          
          &.original {
            background-color: #52c41a;
          }
        }
      }
    }
    
    .post-content {
      flex: 1;
      padding: 10px 15px;
      display: flex;
      flex-direction: column;
      
      .post-title {
        font-size: 16px;
        font-weight: 600;
        line-height: 1.4;
        margin-bottom: 8px;
        color: #333;
        transition: color 0.2s ease;
      }
      
      .post-excerpt {
        color: #666;
        font-size: 14px;
        line-height: 1.5;
        margin-bottom: 10px;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .post-meta {
        display: flex;
        gap: 15px;
        margin-bottom: 10px;
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: #888;
          
          &.category {
            color: #1677FF;
          }
          
          i {
            font-size: 14px;
          }
        }
      }
      
      .post-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: auto;
        
        .author {
          display: flex;
          align-items: center;
          gap: 8px;
          
          img {
            width: 24px;
            height: 24px;
            border-radius: 50%;
            object-fit: cover;
          }
          
          span {
            font-size: 13px;
            color: #555;
          }
        }
        
        .stats {
          display: flex;
          gap: 12px;
          
          .stat-item {
            display: flex;
            align-items: center;
            gap: 5px;
            color: #888;
            font-size: 13px;
            
            &:hover {
              color: #1677FF;
            }
          }
        }
      }
    }
  }
  
  .load-more {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    
    button {
      border: none;
      background-color: #f9f9f9;
      color: #666;
      font-size: 14px;
      font-weight: 500;
      padding: 8px 20px;
      border-radius: 4px;
      cursor: pointer;
      transition: all 0.2s ease;
      
      &:hover:not(:disabled) {
        background-color: #1677FF;
        color: white;
      }
      
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
  
  .empty-state {
    padding: 30px 0;
    text-align: center;
    color: #999;
    font-size: 14px;
  }
}

@media (max-width: 768px) {
  .blog-list {
    padding: 12px;
    
    .list-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 10px;
      margin-bottom: 15px;
    }
    
    .post-item {
      gap: 12px;
      
      .post-image {
        flex: 0 0 100px;
      }
      
      .post-content {
        padding: 8px 10px;
        
        .post-title {
          font-size: 15px;
          margin-bottom: 5px;
        }
        
        .post-excerpt {
          font-size: 13px;
          margin-bottom: 8px;
          -webkit-line-clamp: 1;
        }
        
        .post-meta {
          gap: 10px;
          margin-bottom: 8px;
          
          .meta-item {
            font-size: 12px;
            
            &.date {
              display: none;
            }
          }
        }
        
        .post-footer {
          .author {
            gap: 5px;
            
            img {
              width: 20px;
              height: 20px;
            }
            
            span {
              font-size: 12px;
            }
          }
          
          .stats {
            gap: 8px;
            
            .stat-item {
              font-size: 12px;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .post-excerpt {
    display: none !important;
  }
  
  .post-item .post-content {
    .author span {
      display: none;
    }
  }
}

.ant-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style> 