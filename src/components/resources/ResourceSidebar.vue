<template>
  <div class="resource-sidebar">
    <!-- 分类卡片 -->
    <div class="sidebar-card category-card">
      <div class="sidebar-card-header">
        <h3 class="card-title"><i class="fas fa-th-large"></i> 资源分类</h3>
        <a-button type="link" class="view-all">全部</a-button>
      </div>
      
      <div class="category-list">
        <div v-for="(category, index) in categories" :key="index" class="category-item"
          :class="{ 'active': activeCategory === category.name }" @click="onCategoryClick(category)">
          <div class="category-icon">
            <i :class="getCategoryIcon(category.name)"></i>
          </div>
          <div class="category-info">
            <span class="category-name">{{ category.name }}</span>
            <span class="category-count">{{ category.count }}</span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 热门资源卡片 -->
    <div class="sidebar-card hot-card">
      <div class="sidebar-card-header">
        <h3 class="card-title"><i class="fas fa-fire"></i> 热门资源</h3>
        <a-button type="link" class="view-all">更多</a-button>
      </div>
      
      <div class="hot-resources">
        <div v-for="(resource, index) in hotResources" :key="index" class="hot-resource-item"
          :class="{ 'top-item': index < 3 }" @click="onResourceClick(resource)">
          <div class="item-rank" :class="{ 'top3': index < 3 }">{{ index + 1 }}</div>
          <div class="item-content">
            <h4 class="item-title">{{ resource.title }}</h4>
            <div class="item-meta">
              <span class="downloads">
                <i class="fas fa-download"></i> {{ formatNumber(resource.downloads || 0) }}
              </span>
              <span v-if="resource.category" class="item-category">{{ resource.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 最新资源卡片 -->
    <div class="sidebar-card latest-card">
      <div class="sidebar-card-header">
        <h3 class="card-title"><i class="fas fa-clock"></i> 最新资源</h3>
        <a-button type="link" class="view-all">更多</a-button>
      </div>
      
      <div class="latest-resources">
        <div v-for="(resource, index) in latestResources" :key="index" class="latest-resource-item"
          :class="{ 'new-item': index === 0 }" @click="onResourceClick(resource)">
          <div class="item-date">
            <i class="fas fa-calendar-alt"></i> {{ formatDate(resource.date || '') }}
          </div>
          <div class="item-title">{{ resource.title }}</div>
        </div>
      </div>
    </div>
    
    <!-- 标签云卡片 -->
    <div class="sidebar-card tag-card">
      <div class="sidebar-card-header">
        <h3 class="card-title"><i class="fas fa-tags"></i> 热门标签</h3>
      </div>
      
      <div class="tag-cloud">
        <a-tag v-for="(tag, index) in popularTags" :key="index" :color="getTagColor(index)" class="tag-item"
          @click="onTagClick(tag)">
          {{ tag.name }}
        </a-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Resource {
  id?: number | string;
  title: string;
  downloads?: number;
  views?: number;
  date?: string;
  category?: string;
  [key: string]: any;
}

// 定义属性
const props = defineProps({
  hotResources: {
    type: Array as () => any[],
    default: () => []
  },
  latestResources: {
    type: Array as () => any[],
    default: () => []
  },
  categories: {
    type: Array as () => Array<{ name: string, count: number, icon?: string }>,
    default: () => []
  },
  activeCategory: {
    type: String,
    default: '全部'
  }
});

// 当前选中的分类 (移动端下拉框)
const selectedCategory = ref(props.activeCategory);

// 热门标签
const popularTags = [
  { name: 'Photoshop', count: 128 },
  { name: '安卓应用', count: 98 },
  { name: '教程', count: 87 },
  { name: '设计', count: 76 },
  { name: '壁纸', count: 65 },
  { name: '办公软件', count: 54 },
  { name: '游戏', count: 43 },
  { name: '视频剪辑', count: 42 },
  { name: '电子书', count: 38 },
  { name: '编程', count: 32 },
  { name: '素材', count: 29 },
  { name: '工具', count: 28 },
  { name: 'AI', count: 26 },
  { name: '音乐', count: 23 },
  { name: '图标', count: 18 },
];

// 定义事件
const emit = defineEmits(['resource-click', 'category-click', 'tag-click']);

// 获取分类图标
const getCategoryIcon = (name: string): string => {
  // 根据分类名称匹配默认图标
  const iconMap: Record<string, string> = {
    '全部': 'fas fa-th-large',
    '安卓软件': 'fab fa-android',
    'iOS软件': 'fab fa-apple',
    '电脑软件': 'fas fa-desktop',
    '黑科技网页': 'fas fa-globe',
    'PPT资源': 'fas fa-file-powerpoint',
    '设计素材': 'fas fa-paint-brush',
    '学习资料': 'fas fa-book',
    '工具': 'fas fa-tools',
    '软件': 'fas fa-laptop-code',
    '素材': 'fas fa-images',
    '教程': 'fas fa-graduation-cap',
    '娱乐': 'fas fa-gamepad',
    '音乐': 'fas fa-music',
    '视频': 'fas fa-video',
    '电子书': 'fas fa-book-open'
  };

  // 如果能通过名称匹配到图标
  if (name in iconMap) {
    return iconMap[name];
  }

  // 兜底图标
  return 'fas fa-folder';
};

// 处理资源点击
const onResourceClick = (resource: any) => {
  emit('resource-click', resource);
};

// 处理分类点击
const onCategoryClick = (category: any) => {
  selectedCategory.value = category.name;
  emit('category-click', category);
};

// 处理分类选择变更 (移动端)
const onCategorySelectChange = (value: string) => {
  const category = props.categories.find((cat: { name: string }) => cat.name === value);
  if (category) {
    emit('category-click', category);
  }
};

// 处理标签点击
const onTagClick = (tag: any) => {
  emit('tag-click', tag);
};

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// 格式化日期
const formatDate = (dateString: string): string => {
  if (!dateString) return '未知';

  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) {
    return diffDays === 1 ? '昨天' : `${diffDays}天前`;
  } else {
    return dateString.slice(5); // 只返回月-日部分
  }
};

// 获取标签颜色
const getTagColor = (index: number): string => {
  const colors = ['#1677FF', '#52c41a', '#fa8c16', '#722ed1', '#eb2f96', '#faad14', '#a0d911', '#1890ff', '#f5222d', '#13c2c2'];
  return colors[index % colors.length];
};
</script>

<style scoped lang="less">
.resource-sidebar {
  .mobile-category-selector {
    display: none;
    margin-bottom: 12px;
    
    @media (max-width: 767px) {
      display: block;
    }
  }
  
  .sidebar-card {
    background: white;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    margin-bottom: 16px;
    padding: 0;
    overflow: hidden;
    transition: all 0.25s ease;
    
    &:hover {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    }
    
    &:last-child {
      margin-bottom: 0;
    }
    
    .sidebar-card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px;
      border-bottom: 1px solid #f0f0f0;
      
      .card-title {
        margin: 0;
        font-size: 15px;
        font-weight: 600;
        color: var(--bTitleColor, #333);
        display: flex;
        align-items: center;
        
        i {
          color: #1677FF;
          margin-right: 8px;
        }
      }
      
      .view-all {
        font-size: 12px;
        padding: 0;
        height: auto;
        color: #1677FF;
      }
    }
    
    &.hot-card .sidebar-card-header .card-title i {
      color: #ff4d4f;
    }
    
    &.latest-card .sidebar-card-header .card-title i {
      color: #52c41a;
    }
    
    &.tag-card .sidebar-card-header .card-title i {
      color: #1677FF;
    }
  }
  
  .category-card {
    @media (max-width: 767px) {
      display: none;
    }
  }
  
  .category-list {
    padding: 4px;
    
    .category-item {
      display: flex;
      align-items: center;
      padding: 8px 10px;
      cursor: pointer;
      transition: all 0.2s;
      border-bottom: 1px solid rgba(0, 0, 0, 0.03);
      border-radius: 6px;
      margin: 2px 0;
      
      &:last-child {
        border-bottom: none;
      }
      
      &:hover,
      &.active {
        background: rgba(22, 119, 255, 0.05);
      }
      
      &.active {
        .category-icon {
          background: #1677FF;
          
          i {
            color: white;
          }
        }
        
        .category-name {
          color: #1677FF;
          font-weight: 500;
        }
      }
      
      .category-icon {
        width: 28px;
        height: 28px;
        border-radius: 6px;
        background: #e6f7ff;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 8px;
        transition: all 0.2s;
        box-shadow: 0 2px 6px rgba(22, 119, 255, 0.1);
        
        i {
          font-size: 14px;
          color: #1677FF;
        }
      }
      
      .category-info {
        flex: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .category-name {
          font-size: 13px;
          color: var(--bTitleColor, #333);
          transition: all 0.2s;
        }
        
        .category-count {
          font-size: 11px;
          color: #8c8c8c;
          background: #f5f5f5;
          padding: 1px 6px;
          border-radius: 10px;
        }
      }
    }
  }
  
  .hot-resources {
    padding: 6px 0;
    
    .hot-resource-item {
      display: flex;
      padding: 10px 12px;
      cursor: pointer;
      transition: all 0.25s ease;
      position: relative;
      
      &:hover {
        background: rgba(22, 119, 255, 0.03);
        
        .item-title {
          color: #1677FF;
        }

        .item-rank {
          transform: scale(1.08);
        }
      }

      &.top-item {
        &:nth-child(1) {
          background: linear-gradient(to right, rgba(22, 119, 255, 0.03), transparent);
        }

        &:nth-child(2) {
          background: linear-gradient(to right, rgba(22, 119, 255, 0.02), transparent);
        }

        &:nth-child(3) {
          background: linear-gradient(to right, rgba(22, 119, 255, 0.01), transparent);
        }
      }
      
      .item-rank {
        width: 24px;
        height: 24px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 12px;
        font-weight: 600;
        color: #8c8c8c;
        background: #f5f5f5;
        margin-right: 10px;
        transition: all 0.25s ease;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        
        &.top3 {
          color: white;
          font-weight: bold;
          
          &:nth-child(1) {
            background: linear-gradient(135deg, #1677FF, #4096ff);
            box-shadow: 0 2px 6px rgba(22, 119, 255, 0.25);
          }
          
          &:nth-child(2) {
            background: linear-gradient(135deg, #4096ff, #69b1ff);
            box-shadow: 0 2px 6px rgba(64, 150, 255, 0.2);
          }
          
          &:nth-child(3) {
            background: linear-gradient(135deg, #69b1ff, #91caff);
            box-shadow: 0 2px 6px rgba(105, 177, 255, 0.15);
          }
        }
      }
      
      .item-content {
        flex: 1;
        overflow: hidden;
        
        .item-title {
          font-size: 13px;
          color: var(--bTitleColor, #333);
          margin: 0 0 4px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: all 0.2s ease;
          font-weight: 500;
        }
        
        .item-meta {
          font-size: 11px;
          color: #8c8c8c;
          display: flex;
          align-items: center;
          gap: 8px;
          
          .downloads {
            display: flex;
            align-items: center;

            i {
              margin-right: 3px;
              color: #1677FF;
            }
          }

          .item-category {
            color: #1677FF;
            background: rgba(22, 119, 255, 0.1);
            padding: 1px 6px;
            border-radius: 10px;
            font-size: 10px;
          }
        }
      }
    }
  }
  
  .latest-resources {
    padding: 6px 0;
    
    .latest-resource-item {
      padding: 10px 12px;
      cursor: pointer;
      transition: all 0.2s;
      
      &:hover {
        background: rgba(22, 119, 255, 0.03);
        
        .item-title {
          color: #1677FF;
        }
      }

      &.new-item {
        .item-date {
          color: #52c41a;
          font-weight: 500;

          i {
            color: #52c41a;
          }
        }
      }
      
      .item-date {
        font-size: 11px;
        color: #8c8c8c;
        margin-bottom: 4px;
        display: flex;
        align-items: center;

        i {
          margin-right: 4px;
          font-size: 11px;
        }
      }
      
      .item-title {
        font-size: 13px;
        color: var(--bTitleColor, #333);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        transition: color 0.2s;
      }
    }
  }
  
  .tag-cloud {
    padding: 12px;
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    
    .tag-item {
      margin: 0;
      cursor: pointer;
      transition: all 0.2s;
      border-radius: 4px;
      font-size: 11px;
      padding: 0 4px;
      height: 20px;
      line-height: 20px;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
      }
    }
  }
}
</style> 
