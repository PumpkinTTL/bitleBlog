<template>
  <div class="favorites-list-card">
    <div class="card-header">
      <h3 class="header-title">
        <i class="fas fa-heart"></i>
        我的收藏
      </h3>
      <div class="header-actions">
        <el-select v-model="filterType" size="small" style="width: 120px">
          <el-option label="全部" value="all" />
          <el-option label="文章" value="article" />
          <el-option label="资源" value="resource" />
          <el-option label="视频" value="video" />
        </el-select>
      </div>
    </div>

    <div v-if="filteredFavorites.length === 0" class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-heart-broken"></i>
      </div>
      <div class="empty-text">暂无收藏</div>
      <div class="empty-desc">快去收藏你喜欢的内容吧</div>
      <el-button type="primary" @click="$emit('browse')">
        <i class="fas fa-compass"></i>
        去逛逛
      </el-button>
    </div>

    <div v-else class="favorites-list">
      <div 
        v-for="(favorite, index) in filteredFavorites" 
        :key="favorite.id"
        class="favorite-item"
        :style="{ animationDelay: `${index * 0.05}s` }"
        @click="$emit('view', favorite)"
      >
        <div class="favorite-icon" :class="`type-${favorite.type}`">
          <i :class="getTypeIcon(favorite.type)"></i>
        </div>
        
        <div class="favorite-content">
          <div class="favorite-header">
            <h4 class="favorite-title">{{ favorite.title }}</h4>
            <el-tag :type="getTypeColor(favorite.type)" size="small">
              {{ getTypeText(favorite.type) }}
            </el-tag>
          </div>
          
          <p class="favorite-desc">{{ favorite.description }}</p>
          
          <div class="favorite-meta">
            <span class="meta-item">
              <i class="fas fa-user"></i>
              {{ favorite.author }}
            </span>
            <span class="meta-item">
              <i class="fas fa-clock"></i>
              收藏于 {{ formatDate(favorite.collectedAt) }}
            </span>
            <span class="meta-item" v-if="favorite.stats">
              <i class="fas fa-eye"></i>
              {{ favorite.stats.views }}
            </span>
          </div>
        </div>
        
        <div class="favorite-actions">
          <el-button 
            size="small" 
            text
            type="danger"
            @click.stop="$emit('uncollect', favorite)"
          >
            <i class="fas fa-heart-broken"></i>
          </el-button>
          <el-button 
            size="small" 
            text
            @click.stop="$emit('share', favorite)"
          >
            <i class="fas fa-share-alt"></i>
          </el-button>
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
.favorites-list-card {
  background: var(--el-bg-color);
  border-radius: 12px;
  border: 1px solid var(--el-border-color-lighter);
  overflow: hidden;
  animation: fadeIn 0.6s ease-out;
}

.card-header {
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
  background: var(--el-fill-color-extra-light);
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-title {
    margin: 0;
    font-size: 16px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    display: flex;
    align-items: center;
    gap: 8px;

    i {
      color: var(--theme-purple-primary);
      font-size: 18px;
    }
  }
}

.empty-state {
  padding: 60px 20px;
  text-align: center;

  .empty-icon {
    font-size: 64px;
    color: var(--el-text-color-placeholder);
    margin-bottom: 16px;
    opacity: 0.5;
    animation: heartbeat 2s ease-in-out infinite;
  }

  .empty-text {
    font-size: 18px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin-bottom: 8px;
  }

  .empty-desc {
    font-size: 14px;
    color: var(--el-text-color-secondary);
    margin-bottom: 24px;
  }
}

@keyframes heartbeat {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
}

.favorites-list {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 600px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: var(--el-fill-color-lighter);
    border-radius: 3px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--el-border-color);
    border-radius: 3px;

    &:hover {
      background: var(--el-border-color-dark);
    }
  }
}

.favorite-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px;
  background: var(--el-fill-color-lighter);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  animation: slideInRight 0.5s ease-out backwards;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: var(--theme-purple-primary);
    transform: scaleY(0);
    transition: transform 0.3s ease;
  }

  &:hover {
    background: var(--theme-orange-bg-1);
    border-color: var(--theme-orange-border-1);
    transform: translateX(8px);

    &::before {
      transform: scaleY(1);
    }

    .favorite-icon {
      transform: scale(1.15) rotate(360deg);
    }

    .favorite-title {
      color: var(--theme-purple-primary);
    }
  }
}

.favorite-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
  flex-shrink: 0;
  transition: all 0.5s ease;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  &.type-article {
    background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-light-3));
  }

  &.type-resource {
    background: linear-gradient(135deg, var(--theme-purple-light-3), var(--theme-purple-light-5));
  }

  &.type-video {
    background: linear-gradient(135deg, var(--theme-purple-light-5), var(--theme-purple-secondary));
  }
}

.favorite-content {
  flex: 1;
  min-width: 0;
}

.favorite-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 8px;
}

.favorite-title {
  font-size: 16px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  transition: color 0.3s ease;
}

.favorite-desc {
  font-size: 13px;
  color: var(--el-text-color-secondary);
  line-height: 1.5;
  margin: 0 0 10px 0;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.favorite-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  font-size: 12px;
  color: var(--el-text-color-placeholder);

  .meta-item {
    display: flex;
    align-items: center;
    gap: 4px;

    i {
      font-size: 11px;
    }
  }
}

.favorite-actions {
  display: flex;
  gap: 4px;
  flex-shrink: 0;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// 响应式
@media (max-width: 768px) {
  .favorites-list {
    padding: 16px;
    max-height: 480px;
  }

  .favorite-item {
    padding: 14px;
    gap: 12px;

    &:hover {
      transform: translateX(4px);
    }
  }

  .favorite-icon {
    width: 48px;
    height: 48px;
    font-size: 20px;
  }

  .favorite-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .favorite-title {
    font-size: 15px;
  }

  .favorite-desc {
    font-size: 12px;
  }

  .favorite-actions {
    position: static;
    margin-top: 8px;
  }
}
</style>
