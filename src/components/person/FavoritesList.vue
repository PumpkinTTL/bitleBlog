<template>
  <div class="favorites-list-container animate__animated animate__fadeInLeft animate__faster">
    <div class="list-header">
      <div class="header-left">
        <i class="fas fa-heart"></i>
        <span class="header-title">我的收藏</span>
      </div>
      <div class="filter-tabs">
        <button 
          v-for="(type, index) in typeOptions" 
          :key="type.value"
          :class="['filter-tab animate__animated animate__zoomIn animate__faster', { active: filterType === type.value }]"
          :style="{ animationDelay: `${index * 0.05}s` }"
          @click="filterType = type.value"
        >
          <i :class="type.icon"></i>
          <span>{{ type.label }}</span>
        </button>
      </div>
    </div>

    <div v-if="filteredFavorites.length === 0" class="empty-state animate__animated animate__zoomIn">
      <i class="fas fa-heart-broken"></i>
      <p>暂无收藏</p>
      <span>快去收藏你喜欢的内容吧</span>
      <button class="browse-btn" @click="$emit('browse')">
        <i class="fas fa-compass"></i>
        去逛逛
      </button>
    </div>

    <div v-else class="favorites-list">
      <div 
        v-for="(favorite, index) in filteredFavorites" 
        :key="favorite.id"
        class="favorite-item animate__animated animate__fadeInUp animate__faster"
        :style="{ animationDelay: `${index * 0.06}s` }"
      >
        <div class="item-left" @click="$emit('view', favorite)">
          <div class="favorite-icon" :class="`type-${favorite.type}`">
            <i :class="getTypeIcon(favorite.type)"></i>
          </div>
          
          <div class="favorite-content">
            <div class="content-header">
              <h4 class="favorite-title">{{ favorite.title }}</h4>
              <span :class="['type-badge animate__animated animate__zoomIn animate__faster', `type-${favorite.type}`]" style="animation-delay: 0.1s">
                {{ getTypeText(favorite.type) }}
              </span>
            </div>
            
            <p class="favorite-desc">{{ favorite.description }}</p>
            
            <div class="favorite-meta">
              <span class="meta-item author animate__animated animate__zoomIn animate__faster" style="animation-delay: 0.15s">
                <i class="fas fa-user"></i>
                {{ favorite.author }}
              </span>
              <span class="meta-item time animate__animated animate__zoomIn animate__faster" style="animation-delay: 0.18s">
                <i class="fas fa-clock"></i>
                {{ formatDate(favorite.collectedAt) }}
              </span>
              <span class="meta-item views animate__animated animate__zoomIn animate__faster" v-if="favorite.stats" style="animation-delay: 0.21s">
                <i class="fas fa-eye"></i>
                {{ favorite.stats.views }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="favorite-actions">
          <button class="action-btn delete-btn" @click.stop="$emit('uncollect', favorite)">
            <i class="fas fa-heart-broken"></i>
          </button>
          <button class="action-btn share-btn" @click.stop="$emit('share', favorite)">
            <i class="fas fa-share-alt"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Favorite {
  id: number
  type: 'article' | 'resource' | 'video'
  title: string
  description: string
  author: string
  collectedAt: string
  stats?: {
    views: number
    likes?: number
  }
}

interface Props {
  favorites?: Favorite[]
}

const props = withDefaults(defineProps<Props>(), {
  favorites: () => [
    {
      id: 1,
      type: 'article',
      title: 'React Hooks 完全指南',
      description: '深入浅出讲解 React Hooks 的使用方法和最佳实践，包含大量实战案例...',
      author: '前端技术专家',
      collectedAt: '2024-01-12',
      stats: { views: 2345, likes: 156 }
    },
    {
      id: 2,
      type: 'resource',
      title: 'VS Code 插件精选合集',
      description: '精心整理的 VS Code 效率插件合集，涵盖代码编辑、调试、版本控制等多个方面...',
      author: '开发工具达人',
      collectedAt: '2024-01-10',
      stats: { views: 1567 }
    },
    {
      id: 3,
      type: 'video',
      title: 'Vue3 + Vite 项目实战',
      description: '从零开始搭建完整的 Vue3 + Vite 项目，涵盖路由、状态管理、接口请求等核心功能...',
      author: '技术视频UP主',
      collectedAt: '2024-01-08',
      stats: { views: 8923, likes: 456 }
    },
    {
      id: 4,
      type: 'article',
      title: 'TypeScript 类型体操实战',
      description: 'TypeScript 高级类型技巧，帮你写出更优雅的类型定义...',
      author: 'TS 爱好者',
      collectedAt: '2024-01-05',
      stats: { views: 1234 }
    }
  ]
})

const emit = defineEmits<{
  view: [favorite: Favorite]
  uncollect: [favorite: Favorite]
  share: [favorite: Favorite]
  browse: []
}>()

const filterType = ref<'all' | 'article' | 'resource' | 'video'>('all')

const typeOptions = [
  { label: '全部', value: 'all', icon: 'fas fa-th' },
  { label: '文章', value: 'article', icon: 'fas fa-file-alt' },
  { label: '资源', value: 'resource', icon: 'fas fa-download' },
  { label: '视频', value: 'video', icon: 'fas fa-video' }
]

const filteredFavorites = computed(() => {
  if (filterType.value === 'all') {
    return props.favorites
  }
  return props.favorites.filter(fav => fav.type === filterType.value)
})

const getTypeIcon = (type: string) => {
  const icons = {
    article: 'fas fa-file-alt',
    resource: 'fas fa-download',
    video: 'fas fa-video'
  }
  return icons[type as keyof typeof icons] || 'fas fa-star'
}

const getTypeColor = (type: string) => {
  const colors = {
    article: 'primary',
    resource: 'success',
    video: 'warning'
  }
  return colors[type as keyof typeof colors] || 'info'
}

const getTypeText = (type: string) => {
  const texts = {
    article: '文章',
    resource: '资源',
    video: '视频'
  }
  return texts[type as keyof typeof texts] || '其他'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style lang="less" scoped>
.favorites-list-container {
  padding: 20px;

  @media (max-width: 768px) {
    padding: 12px;
  }
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    margin-bottom: 16px;
  }
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 17px;
  font-weight: 600;
  position: relative;
  padding-left: 12px;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);
    width: 4px;
    height: 20px;
    background: linear-gradient(180deg, var(--theme-purple-primary), var(--theme-purple-secondary));
    border-radius: 2px;
  }

  i {
    font-size: 18px;
    background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  span {
    background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.filter-tabs {
  display: flex;
  gap: 8px;
  background: var(--el-fill-color-light);
  padding: 4px;
  border-radius: 8px;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: space-between;
  }

  .filter-tab {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    background: transparent;
    border: none;
    border-radius: 6px;
    font-size: 13px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    cursor: pointer;
    transition: all 0.3s ease;

    @media (max-width: 768px) {
      padding: 6px 12px;
      font-size: 12px;
      flex: 1;
      justify-content: center;

      span {
        display: none;
      }
    }

    i {
      font-size: 13px;

      @media (max-width: 768px) {
        font-size: 14px;
      }
    }

    &:hover {
      color: var(--theme-purple-primary);
      background: rgba(139, 92, 246, 0.1);
    }

    &.active {
      background: white;
      color: var(--theme-purple-primary);
      font-weight: 600;
      box-shadow: 0 2px 8px rgba(139, 92, 246, 0.15);
    }
  }
}

.empty-state {
  padding: 80px 20px;
  text-align: center;
  color: var(--el-text-color-secondary);

  i {
    font-size: 64px;
    opacity: 0.3;
    margin-bottom: 16px;
    color: var(--theme-purple-primary);
  }

  p {
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0 0 8px 0;
  }

  span {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    display: block;
    margin-bottom: 24px;
  }

  .browse-btn {
    padding: 10px 24px;
    background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 14px;
    font-weight: 500;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: all 0.3s ease;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.3);
    }

    &:active {
      transform: translateY(0);
    }
  }
}

.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.favorite-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: visible;

  @media (max-width: 768px) {
    padding: 10px;
    gap: 8px;
    flex-direction: column;
    align-items: flex-start;
  }

  &:hover {
    border-color: var(--theme-purple-primary);
    box-shadow: 0 4px 12px rgba(139, 92, 246, 0.12), 0 2px 4px rgba(0, 0, 0, 0.04);
    transform: translateY(-2px);

    .favorite-icon {
      transform: scale(1.05) rotate(-5deg);
    }

    .favorite-title {
      color: var(--theme-purple-primary);
    }
  }

  .item-left {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 12px;
    cursor: pointer;
    min-width: 0;

    @media (max-width: 768px) {
      width: 100%;
      gap: 8px;
    }
  }
}

.favorite-icon {
  width: 48px;
  height: 48px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;

  @media (max-width: 768px) {
    width: 44px;
    height: 44px;
    font-size: 16px;
  }

  i {
    position: relative;
    z-index: 1;
    filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.15));
  }

  &::after {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.2) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 1;
  }

  &.type-article {
    background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
    box-shadow: 0 2px 6px rgba(139, 92, 246, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  &.type-resource {
    background: linear-gradient(135deg, #10b981 0%, #34d399 100%);
    box-shadow: 0 2px 6px rgba(16, 185, 129, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }

  &.type-video {
    background: linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%);
    box-shadow: 0 2px 6px rgba(245, 158, 11, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.1);
  }
}

.favorite-content {
  flex: 1;
  min-width: 0;
}

.content-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.favorite-title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  transition: color 0.3s ease;

  @media (max-width: 768px) {
    font-size: 14px;
  }
}

.type-badge {
  padding: 4px 12px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 500;
  flex-shrink: 0;
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);

  &.type-article {
    background: rgba(139, 92, 246, 0.1);
    color: #8b5cf6;
    border: 1px solid rgba(139, 92, 246, 0.2);
  }

  &.type-resource {
    background: rgba(16, 185, 129, 0.1);
    color: #10b981;
    border: 1px solid rgba(16, 185, 129, 0.2);
  }

  &.type-video {
    background: rgba(245, 158, 11, 0.1);
    color: #f59e0b;
    border: 1px solid rgba(245, 158, 11, 0.2);
  }
}

.favorite-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  margin: 0 0 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    font-size: 12px;
    -webkit-line-clamp: 1;
    line-height: 1.4;
    margin: 0 0 8px 0;
  }
}

.favorite-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  row-gap: 8px;
  font-size: 11px;

  .meta-item {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s ease;
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);

    i {
      font-size: 10px;
      opacity: 0.9;
    }

    &.author {
      background: rgba(139, 92, 246, 0.08);
      color: #8b5cf6;
      border: 1px solid rgba(139, 92, 246, 0.15);
      
      i {
        color: #a78bfa;
      }
    }

    &.time {
      background: rgba(59, 130, 246, 0.08);
      color: #3b82f6;
      border: 1px solid rgba(59, 130, 246, 0.15);
      
      i {
        color: #60a5fa;
      }
    }

    &.views {
      background: rgba(16, 185, 129, 0.08);
      color: #10b981;
      border: 1px solid rgba(16, 185, 129, 0.15);
      
      i {
        color: #34d399;
      }
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
    }
  }
}

.favorite-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;

  @media (max-width: 768px) {
    width: 100%;
    justify-content: flex-end;
  }

  .action-btn {
    width: 36px;
    height: 36px;
    border: 1px solid var(--el-border-color-light);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--el-bg-color);
    color: var(--el-text-color-regular);
    cursor: pointer;
    transition: all 0.25s ease;
    font-size: 14px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }

    &:active {
      transform: translateY(0);
    }

    &.delete-btn:hover {
      background: linear-gradient(135deg, #fb7185, #f43f5e);
      border-color: #f43f5e;
      color: white;
    }

    &.share-btn:hover {
      background: linear-gradient(135deg, #60a5fa, #3b82f6);
      border-color: #3b82f6;
      color: white;
    }
  }
}
</style>
