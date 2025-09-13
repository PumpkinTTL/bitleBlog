<template>
  <div class="resource-page">


    <div class="page-container">
      <!-- 页面头部 - 使用跟宫格相似的动画 -->
      <div class="page-header animate-item" style="animation-delay: 0.1s;">
        <h1 class="page-title">探索资源<span class="highlight">世界</span></h1>
        <p class="page-subtitle">发现、下载、分享高质量的资源</p>
      </div>

      <!-- 搜索和筛选组件 -->
      <div class="animate-item" style="animation-delay: 0.2s;">
        <ResourceHeader :categories="categoryNames" @search="handleSearch" @filter="handleFilter" @sort="handleSort" />
      </div>

      <!-- 主要内容区域 -->
      <div class="main-content">
        <!-- 移动端优先显示资源列表 -->
        <template v-if="isMobile">
          <!-- 内容区域 - 原本的资源宫格已有动画 -->
          <div class="content-container animate-item" style="animation-delay: 0.2s;">
            <!-- 资源列表 -->
            <ResourceGrid :resources="enhancedResources" :loading="loading" :total="total" @download="handleDownload"
              @details="handleDetails" @page-change="handlePageChange" @size-change="handleSizeChange" />
          </div>

          <!-- 左侧边栏 - 在移动端放到下面 -->
          <div class="sidebar-container animate-item" style="animation-delay: 0.3s;">
            <ResourceSidebar :hot-resources="hotResources" :latest-resources="latestResources"
              :categories="resourceCategories" :active-category="activeTag" @resource-click="handleResourceClick"
              @category-click="handleCategoryClick" @tag-click="handleTagClick" />
          </div>
        </template>

        <!-- 桌面端保持原顺序 -->
        <template v-else>
          <!-- 左侧边栏 -->
          <div class="sidebar-container animate-item" style="animation-delay: 0.3s;">
            <ResourceSidebar :hot-resources="hotResources" :latest-resources="latestResources"
              :categories="resourceCategories" :active-category="activeTag" @resource-click="handleResourceClick"
              @category-click="handleCategoryClick" @tag-click="handleTagClick" />
          </div>

          <!-- 内容区域 - 原本的资源宫格已有动画 -->
          <div class="content-container animate-item" style="animation-delay: 0.3s;">
            <!-- 资源列表 -->
            <ResourceGrid :resources="enhancedResources" :loading="loading" :total="total" @download="handleDownload"
              @details="handleDetails" @page-change="handlePageChange" @size-change="handleSizeChange" />
          </div>
        </template>
      </div>
    </div>

    <!-- 资源详情弹窗 -->
    <ResourceModal v-model:visible="modalVisible" :resource="selectedResource" @download="handleDownloadInModal"
      @collect="handleCollect" @share="handleShare" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, onBeforeMount } from 'vue';
import { message } from 'ant-design-vue';

// 导入组件 - 即使有lint错误，这些导入在Vue 3 setup语法糖中仍然有效
import ResourceHeader from '@/components/resources/ResourceHeader.vue';
import ResourceGrid from '@/components/resources/ResourceGrid.vue';
import ResourceSidebar from '@/components/resources/ResourceSidebar.vue';
import ResourceModal from '@/components/resources/ResourceModal.vue';

// 资源类型定义
interface ResourceTag {
  name: string;
  count: number;
  icon: string;
}

interface ResourceItem {
  id: number;
  title: string;
  description: string;
  category: string;
  platform: string;
  date: string;
  author: string;
  downloads: number;
  views: number;
  tags: string[];
  imageUrl: string;
  content: string;
  rating?: number;
  featured?: boolean;
  isNew?: boolean;
  isHot?: boolean;
  isPremium?: boolean;
}

// 移动端检测
const isMobile = ref(false);
// 加载状态
const loading = ref(false);
// 模态框可见性
const modalVisible = ref(false);
// 搜索关键词
const searchKeyword = ref('');
// 筛选标签
const activeTag = ref('全部');
// 当前排序方式
const currentSort = ref('newest');
// 当前页面
const currentPage = ref(1);
// 每页大小
const pageSize = ref(16);
// 总资源数
const total = ref(100);
// 选中的资源
const selectedResource = ref<ResourceItem | {}>({});

// 示例数据 - 实际项目中应该从API获取
const resourcesData = ref<ResourceItem[]>([
  {
    id: 1,
    title: 'Adobe Photoshop 2024 完整破解版',
    description: '全球顶级图像处理软件，支持图层、蒙版、通道、滤镜等功能。',
    category: '电脑软件',
    platform: 'Windows',
    date: '2024-05-15',
    author: '设计资源库',
        downloads: 15420,
    views: 25680,
    tags: ['设计软件', 'Adobe', '图像处理'],
    imageUrl: 'https://www.freedidi.com/wp-content/uploads/2025/05/fafdefb96d20250508230405.webp',
    content: '<p>Adobe Photoshop是全球最受欢迎的图像编辑软件之一，拥有强大的编辑功能和灵活的工作流程。</p><p>该版本包含所有最新功能，并已完美激活，可无限期使用。</p>',
    featured: true,
    isPremium: true
  },
  {
    id: 2,
    title: '抖音去水印专业版APK',
    description: '一键下载抖音、快手等短视频平台无水印视频，支持批量下载。',
    category: '安卓软件',
    platform: '安卓',
    date: '2024-05-12',
    author: '安卓应用库',
    downloads: 45280,
    views: 68900,
    tags: ['短视频', '工具', '去水印'],
    imageUrl: 'https://img.fenxmi.com/zb_users/upload/2023/04/202304291682764258140464.jpg',
    content: '<p>抖音去水印专业版是一款功能强大的视频下载工具，可以一键下载抖音、快手、微视等各大短视频平台的无水印视频。</p><p>支持批量下载，自动保存，操作简单便捷。</p>',
    isHot: true
  },
  {
    id: 3,
    title: 'Office 2024 专业增强版',
    description: 'Microsoft Office全套办公软件，包含Word, Excel, PowerPoint等组件。',
    category: '电脑软件',
    platform: 'Windows',
    date: '2024-05-10',
    author: '办公软件库',
    downloads: 32150,
    views: 45200,
    tags: ['Office', '办公', 'Microsoft'],
    imageUrl: 'https://img.fenxmi.com/zb_users/upload/2024/04/202404291714403600329325.jpg',
    content: '<p>Microsoft Office 2024专业增强版包含了最新版本的Word, Excel, PowerPoint, Outlook等组件。</p><p>已完成激活，支持自动更新，完全兼容Windows 10/11系统。</p>',
    isPremium: true
  },
  {
    id: 4,
    title: 'iPA Library - iOS破解应用合集',
    description: '超过1000款iOS付费应用破解版，支持直接安装无需越狱。',
    category: 'iOS软件',
    platform: 'iOS',
    date: '2024-05-08',
    author: 'iOS资源站',
    downloads: 28760,
    views: 42300,
    tags: ['iOS', 'iPA', '破解应用'],
    imageUrl: 'https://img.fenxmi.com/zb_users/upload/2024/03/202403071709798193101533.webp',
    content: '<p>iPA Library是一个包含超过1000款iOS付费应用破解版的合集，所有应用都经过严格测试，确保可以正常运行。</p><p>支持直接安装，无需越狱，兼容iOS 14-17系统。</p>',
    isNew: true,
    isPremium: true
  },
  {
    id: 5,
    title: '2024年高质量PPT模板合集',
    description: '包含商务、教育、营销等多种风格的PPT模板，总计500套。',
    category: 'PPT资源',
    platform: '全部平台',
    date: '2024-05-05',
    author: 'PPT设计工作室',
    downloads: 18950,
    views: 29600,
    tags: ['PPT', '模板', '设计'],
    imageUrl: 'https://img.fenxmi.com/zb_users/upload/2024/05/202405051714889752111845.webp',
    content: '<p>这个合集包含了2024年最新的500套高质量PPT模板，涵盖商务、教育、营销、科技等多种风格。</p><p>所有模板均为PPTX格式，支持PowerPoint 2013及以上版本。</p>'
  },
  {
    id: 6,
    title: 'ChatGPT高级账号共享',
    description: 'ChatGPT Plus账号共享服务，无需魔法上网，支持GPT-4模型。',
    category: '黑科技网页',
    platform: '全部平台',
    date: '2024-05-03',
    author: 'AI工具库',
    downloads: 35680,
    views: 62400,
    tags: ['AI', 'ChatGPT', '工具'],
    imageUrl: 'https://img.fenxmi.com/zb_users/upload/2023/12/202312081702008746473200.png',
    content: '<p>提供ChatGPT Plus账号共享服务，支持GPT-4模型，每月100次对话额度。</p><p>无需魔法上网，支持中文对话，响应速度快，使用简单方便。</p>',
    featured: true,
    isHot: true,
    isPremium: true
  },
  {
    id: 7,
    title: 'After Effects 2024特效插件合集',
    description: '包含50款专业AE特效插件，支持视频合成、粒子效果、色彩校正等。',
    category: '电脑软件',
    platform: 'Windows',
    date: '2024-04-28',
    author: '视频后期资源站',
    downloads: 12680,
    views: 21500,
    tags: ['AE插件', '特效', '视频编辑'],
    imageUrl: 'https://www.freedidi.com/wp-content/uploads/2025/05/fafdefb96d20250508230405.webp',
    content: '<p>这个合集包含了50款专业After Effects特效插件，涵盖视频合成、粒子效果、色彩校正、文字动画等多个方面。</p><p>所有插件均已破解激活，支持AE 2022-2024版本。</p>'
  },
  {
    id: 8,
    title: '高清4K壁纸合集',
    description: '超过10000张4K分辨率壁纸，包含风景、人物、动漫、抽象等题材。',
    category: '设计素材',
    platform: '全部平台',
    date: '2024-04-25',
    author: '壁纸库',
    downloads: 56280,
    views: 92400,
    tags: ['壁纸', '4K', '素材'],
    imageUrl: 'https://img.fenxmi.com/zb_users/upload/2023/04/202304081680947253819210.png',
    content: '<p>这个合集包含了超过10000张4K分辨率（3840x2160或更高）壁纸，题材涵盖风景、人物、动漫、抽象艺术等多个方面。</p><p>所有壁纸均为无水印高清原图，适合各种设备使用。</p>',
    isNew: true
  }
]);

// 资源分类
const resourceCategories = ref<ResourceTag[]>([
  { name: '安卓软件', count: 125, icon: 'fas fa-android' },
  { name: 'iOS软件', count: 98, icon: 'fas fa-apple' },
  { name: '电脑软件', count: 210, icon: 'fas fa-desktop' },
  { name: '黑科技网页', count: 65, icon: 'fas fa-globe' },
  { name: 'PPT资源', count: 87, icon: 'fas fa-file-powerpoint' },
  { name: '设计素材', count: 156, icon: 'fas fa-paint-brush' },
  { name: '学习资料', count: 112, icon: 'fas fa-book' }
]);

// 提取分类名称数组用于Header组件
const categoryNames = computed(() => {
  return ['全部', ...resourceCategories.value.map(cat => cat.name)];
});

// 热门资源
const hotResources = computed(() => {
  return resourcesData.value
    .sort((a, b) => b.downloads - a.downloads)
    .slice(0, 5)
    .map(item => ({
      id: item.id,
      title: item.title,
      downloads: item.downloads,
      imageUrl: item.imageUrl,
      category: item.category
    }));
});

// 最新资源
const latestResources = computed(() => {
  return [...resourcesData.value]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)
    .map(item => ({
      id: item.id,
      title: item.title,
      date: item.date
    }));
});

// 增强资源数据
const enhancedResources = computed(() => {
  let result = [...resourcesData.value];
  
  // 按标签筛选
  if (activeTag.value !== '全部') {
    result = result.filter(item => item.category === activeTag.value);
  }
  
  // 按搜索关键词筛选
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase();
    result = result.filter(item => 
      item.title.toLowerCase().includes(keyword) || 
      item.description.toLowerCase().includes(keyword) ||
      item.tags.some(tag => tag.toLowerCase().includes(keyword))
    );
  }
  
  // 根据排序方式排序
  switch (currentSort.value) {
    case 'newest':
      result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      break;
    case 'hot':
      result.sort((a, b) => b.views - a.views);
      break;
    case 'downloads':
      result.sort((a, b) => b.downloads - a.downloads);
      break;
    case 'rating':
      // 假设有评分字段，这里只是示例
      result.sort((a, b) => (b.rating || 5) - (a.rating || 5));
      break;
  }
  
  // 标记热门和新资源
  const now = new Date();
  result = result.map(item => {
    // 新资源标记 - 7天内发布的
    const isNew = !item.isNew ? new Date(item.date).getTime() > now.getTime() - 7 * 24 * 60 * 60 * 1000 : item.isNew;
    
    // 热门资源标记 - 下载量超过30000
    const isHot = !item.isHot ? item.downloads > 30000 : item.isHot;
    
    return {
      ...item,
      isNew,
      isHot
    };
  });
  
  return result;
});

// 页面加载前检查是否为移动端
onBeforeMount(() => {
  isMobile.value = window.innerWidth < 768;
  
  window.addEventListener('resize', () => {
    isMobile.value = window.innerWidth < 768;
  });
});

// 页面加载时获取资源数据
onMounted(() => {
  // 模拟请求数据
  loading.value = true;
  setTimeout(() => {
    loading.value = false;
  }, 1000);
});

// 搜索事件处理
const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword;
  currentPage.value = 1;
};

// 标签筛选事件处理
const handleFilter = (tag: string) => {
  activeTag.value = tag;
  currentPage.value = 1;
};

// 排序事件处理
const handleSort = (sortType: string) => {
  currentSort.value = sortType;
};

// 点击资源下载事件
const handleDownload = (resource: ResourceItem) => {
  message.success(`开始下载: ${resource.title}`);
  // 这里可以实现实际的下载逻辑
};

// 点击资源详情事件
const handleDetails = (resource: ResourceItem) => {
  selectedResource.value = resource;
  modalVisible.value = true;
};

// 点击标签事件
const handleTagClick = (tag: { name: string }) => {
  searchKeyword.value = tag.name;
};

// 点击热门/最新资源事件
const handleResourceClick = (resource: { id: number }) => {
  // 查找完整的资源信息
  const fullResource = resourcesData.value.find(item => item.id === resource.id);
  if (fullResource) {
    selectedResource.value = fullResource;
    modalVisible.value = true;
  }
};

// 点击分类事件
const handleCategoryClick = (category: ResourceTag) => {
  activeTag.value = category.name;
  currentPage.value = 1;
};

// 分页事件处理
const handlePageChange = ({ page, pageSize: size }: { page: number, pageSize: number }) => {
  currentPage.value = page;
  pageSize.value = size;
  // 这里可以请求对应页面的数据
};

// 每页大小改变事件处理
const handleSizeChange = ({ page, pageSize: size }: { page: number, pageSize: number }) => {
  currentPage.value = page;
  pageSize.value = size;
  // 这里可以请求对应页面的数据
};

// 模态框中的下载事件
const handleDownloadInModal = (resource: ResourceItem) => {
  message.success(`开始下载: ${resource.title}`);
  // 这里可以实现实际的下载逻辑
};

// 收藏资源事件
const handleCollect = (resource: ResourceItem) => {
  message.success(`已收藏: ${resource.title}`);
  // 这里可以实现实际的收藏逻辑
};

// 分享资源事件
const handleShare = (resource: ResourceItem) => {
  message.success(`已复制分享链接: ${resource.title}`);
  // 这里可以实现实际的分享逻辑
};
</script>

<style scoped lang="less">
.resource-page {
  position: relative;
  min-height: 100vh;
  padding: 20px 0;
  // 删除背景样式
  // background: linear-gradient(135deg, #f9f9f9 0%, #f0f5ff 100%);
  overflow: hidden;
  
  @media (max-width: 767px) {
    padding: 20px 0 40px;
  }
  
  // 删除装饰部分样式
  /* .page-decoration {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 0;
    overflow: hidden;
    pointer-events: none;
    
    .decoration-circle {
      position: absolute;
      border-radius: 50%;
      
      &.circle-1 {
        top: -200px;
        right: -200px;
        width: 500px;
        height: 500px;
        background: linear-gradient(45deg, rgba(22, 119, 255, 0.05) 0%, rgba(22, 119, 255, 0.1) 100%);
      }
      
      &.circle-2 {
        bottom: -150px;
        left: -150px;
        width: 400px;
        height: 400px;
        background: linear-gradient(45deg, rgba(22, 119, 255, 0.1) 0%, rgba(22, 119, 255, 0.05) 100%);
      }
      
      &.circle-3 {
        top: 50%;
        left: 50%;
        width: 300px;
        height: 300px;
        transform: translate(-50%, -50%);
        background: radial-gradient(circle, rgba(22, 119, 255, 0.03) 0%, rgba(22, 119, 255, 0) 70%);
      }
    }
  } */
  
  .page-container {
    position: relative;
    z-index: 1;
    max-width: 1280px;
    margin: 0 auto;
    padding: 0 16px;
    
    @media (max-width: 767px) {
      padding: 0 12px;
    }
  }
  
  .page-header {
    text-align: center;
    margin-bottom: 30px;
    
    .page-title {
      font-size: 34px;
      font-weight: 700;
      color: var(--bTitleColor, #333);
      margin-bottom: 12px;
      
      .highlight {
        position: relative;
        color: #1677FF;
        z-index: 1;
        
        &::after {
          content: '';
          position: absolute;
          bottom: 5px;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(45deg, rgba(22, 119, 255, 0.2) 0%, rgba(22, 119, 255, 0.1) 100%);
          z-index: -1;
          border-radius: 4px;
        }
      }
      
      @media (max-width: 767px) {
        font-size: 26px;
      }
    }
    
    .page-subtitle {
      font-size: 16px;
      color: var(--bDescColor, #666);
      
      @media (max-width: 767px) {
        font-size: 14px;
      }
    }
  }
  
  .main-content {
    display: flex;
    gap: 18px;
    
    @media (max-width: 767px) {
      flex-direction: column;
      gap: 14px;
    }
    
    .sidebar-container {
      width: 280px;
      flex-shrink: 0;
      
      @media (max-width: 767px) {
        width: 100%;
        margin-bottom: 16px;
      }
      
      &.sidebar-hidden {
        display: none;
      }
    }
    
    .content-container {
      flex: 1;
    }
  }
  
  /* 与资源宫格一致的动画效果 */
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
}
</style>
