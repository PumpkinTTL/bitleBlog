<template>
  <div class="articles-list-container animate__animated animate__fadeInLeft animate__faster">
    <div class="list-header">
      <button class="btn-create animate__animated animate__zoomIn animate__faster" @click="$emit('create')">
        <i class="fas fa-pen-nib"></i>
        <span>新建文章</span>
      </button>
      <div class="header-right">
        <div class="filter-tabs">
          <button 
            v-for="(status, index) in statusOptions" 
            :key="status.value"
            :class="['filter-tab animate__animated animate__zoomIn animate__faster', { active: filterStatus === status.value }]"
            :style="{ animationDelay: `${index * 0.05}s` }"
            @click="filterStatus = status.value"
          >
            {{ status.label }}
          </button>
        </div>
        <span class="total-count">{{ filteredArticles.length }} 篇</span>
      </div>
    </div>

    <div v-if="paginatedArticles.length === 0" class="empty-state animate__animated animate__zoomIn">
      <i class="fas fa-inbox"></i>
      <p>暂无文章</p>
    </div>

    <div v-else class="articles-list">
      <div 
        v-for="(article, index) in paginatedArticles" 
        :key="article.id"
        class="article-item animate__animated animate__fadeInUp animate__faster"
        :style="{ animationDelay: `${index * 0.06}s` }"
      >
        <div class="item-aside">
          <div class="item-cover" v-if="article.cover">
            <span :class="['status-badge animate__animated animate__zoomIn animate__faster', article.status]" style="animation-delay: 0.1s">
              {{ getStatusText(article.status) }}
            </span>
            <img :src="article.cover" :alt="article.title" />
          </div>
        </div>
        <div class="item-main">
          <div class="item-header">
            <h4 class="item-title">{{ article.title }}</h4>
          </div>
          <div class="item-meta">
            <span class="meta-item date animate__animated animate__zoomIn animate__faster" style="animation-delay: 0.15s">
              <i class="fas fa-calendar-day"></i>
              {{ formatDate(article.createdAt) }}
            </span>
            <span class="meta-divider"></span>
            <span class="meta-item views animate__animated animate__zoomIn animate__faster" style="animation-delay: 0.18s">
              <i class="fas fa-eye"></i>
              {{ article.views }}
            </span>
            <span class="meta-divider"></span>
            <span class="meta-item comments animate__animated animate__zoomIn animate__faster" style="animation-delay: 0.21s">
              <i class="fas fa-comment"></i>
              {{ article.comments }}
            </span>
            <span class="meta-divider" v-if="article.tags.length"></span>
            <span class="meta-item tags animate__animated animate__zoomIn animate__faster" v-if="article.tags.length" style="animation-delay: 0.24s">
              <i class="fas fa-tags"></i>
              {{ article.tags.slice(0, 2).join(', ') }}
            </span>
          </div>
          <div class="item-actions">
            <button class="action-btn" @click.stop="$emit('view', article)">
              <i class="fas fa-eye"></i>
            </button>
            <button class="action-btn" @click.stop="$emit('edit', article)">
              <i class="fas fa-edit"></i>
            </button>
            <button class="action-btn" @click.stop="$emit('delete', article)">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="list-pagination" v-if="totalPages > 1">
      <button class="page-btn animate__animated animate__zoomIn animate__faster" :disabled="currentPage === 1" @click="currentPage--">
        <i class="fas fa-chevron-left"></i>
      </button>
      <div class="page-numbers">
        <button 
          v-for="(page, index) in visiblePages" 
          :key="page"
          :class="['page-num animate__animated animate__zoomIn animate__faster', { active: page === currentPage }]"
          :style="{ animationDelay: `${index * 0.03}s` }"
          @click="currentPage = page"
        >
          {{ page }}
        </button>
      </div>
      <button class="page-btn animate__animated animate__zoomIn animate__faster" :disabled="currentPage === totalPages" @click="currentPage++" style="animation-delay: 0.15s">
        <i class="fas fa-chevron-right"></i>
      </button>
      <div class="page-size">
        <select v-model="pageSize">
          <option :value="10">10 条/页</option>
          <option :value="20">20 条/页</option>
          <option :value="50">50 条/页</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface Article {
  id: number
  title: string
  excerpt: string
  cover?: string
  status: 'published' | 'draft'
  views: number
  likes: number
  comments: number
  tags: string[]
  createdAt: string
}

interface Props {
  articles?: Article[]
}

const props = withDefaults(defineProps<Props>(), {
  articles: () => [
    {
      id: 1,
      title: 'Vue 3 Composition API 深度解析',
      excerpt: '详细介绍 Vue 3 Composition API 的使用方法和最佳实践，帮助你快速上手新特性...',
      cover: 'https://picsum.photos/400/250?random=1',
      status: 'published',
      views: 1234,
      likes: 89,
      comments: 23,
      tags: ['Vue3', 'Composition API', '前端'],
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      title: 'TypeScript 高级类型实战指南',
      excerpt: 'TypeScript 高级类型的实际应用场景和技巧分享，提升代码质量和开发效率...',
      cover: 'https://picsum.photos/400/250?random=2',
      status: 'published',
      views: 892,
      likes: 56,
      comments: 12,
      tags: ['TypeScript', '类型系统', '实战'],
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      title: 'Vite 构建优化完全指南',
      excerpt: '从零开始优化 Vite 项目的构建性能，包括代码分割、懒加载、缓存策略等...',
      cover: 'https://picsum.photos/400/250?random=3',
      status: 'draft',
      views: 0,
      likes: 0,
      comments: 0,
      tags: ['Vite', '性能优化', '构建工具'],
      createdAt: '2024-01-14'
    },
    {
      id: 4,
      title: 'Pinia 状态管理最佳实践',
      excerpt: '探索 Pinia 在大型项目中的应用模式，包括模块化、持久化、性能优化等...',
      cover: 'https://picsum.photos/400/250?random=4',
      status: 'published',
      views: 567,
      likes: 34,
      comments: 8,
      tags: ['Pinia', '状态管理', 'Vue'],
      createdAt: '2024-01-08'
    }
  ]
})

const emit = defineEmits<{
  view: [article: Article]
  edit: [article: Article]
  delete: [article: Article]
  create: []
}>()

const statusOptions = [
  { label: '全部', value: 'all' },
  { label: '已发布', value: 'published' },
  { label: '草稿', value: 'draft' }
]

const filterStatus = ref<'all' | 'published' | 'draft'>('all')
const currentPage = ref(1)
const pageSize = ref(10)

const filteredArticles = computed(() => {
  if (filterStatus.value === 'all') {
    return props.articles
  }
  return props.articles.filter(article => article.status === filterStatus.value)
})

const paginatedArticles = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredArticles.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredArticles.value.length / pageSize.value))

const visiblePages = computed(() => {
  const pages: number[] = []
  const total = totalPages.value
  const current = currentPage.value
  
  if (total <= 7) {
    for (let i = 1; i <= total; i++) pages.push(i)
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) pages.push(i)
    } else if (current >= total - 3) {
      for (let i = total - 4; i <= total; i++) pages.push(i)
    } else {
      for (let i = current - 2; i <= current + 2; i++) pages.push(i)
    }
  }
  
  return pages
})

const getStatusType = (status: string) => {
  return status === 'published' ? 'success' : 'info'
}

const getStatusText = (status: string) => {
  return status === 'published' ? '已发布' : '草稿'
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('zh-CN')
}
</script>

<style lang="less" scoped>
.articles-list-container {
  padding: 20px;

  @media (max-width: 768px) {
    padding: 12px;
  }
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  flex-wrap: wrap;
  gap: 12px;

  @media (max-width: 768px) {
    margin-bottom: 12px;
  }

  .btn-create {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: var(--theme-orange-bg-2);
    color: var(--theme-purple-primary);
    border: 1.5px solid var(--theme-orange-border-2);
    border-radius: 8px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    font-family: 'OPPO Sans', sans-serif;
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: var(--theme-orange-overlay);
      transform: translate(-50%, -50%);
      transition: width 0.6s ease, height 0.6s ease;
    }

    i, span {
      position: relative;
      z-index: 1;
    }

    i {
      font-size: 13px;
      transition: transform 0.3s ease;
    }

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px var(--theme-orange-shadow);
      border-color: var(--theme-purple-primary);

      &::before {
        width: 300px;
        height: 300px;
      }

      i {
        transform: scale(1.1) rotate(-5deg);
      }
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px var(--theme-orange-shadow);
    }

    @media (max-width: 768px) {
      padding: 8px 16px;
      font-size: 12px;
      
      i {
        font-size: 12px;
      }
      
      span {
        display: none;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 16px;

    .filter-tabs {
      display: flex;
      gap: 4px;
      background: var(--el-fill-color-light);
      padding: 4px;
      border-radius: 6px;

      .filter-tab {
        padding: 6px 14px;
        background: transparent;
        border: none;
        border-radius: 4px;
        font-size: 12px;
        font-weight: 500;
        color: var(--el-text-color-regular);
        cursor: pointer;
        transition: all 0.2s ease;

        &:hover {
          color: var(--theme-purple-primary);
        }

        &.active {
          background: white;
          color: var(--theme-purple-primary);
          font-weight: 600;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
        }
      }
    }

    .total-count {
      font-size: 12px;
      color: var(--el-text-color-secondary);
      font-weight: 500;
    }

    @media (max-width: 768px) {
      width: 100%;
      justify-content: space-between;

      .filter-tabs .filter-tab {
        padding: 4px 10px;
        font-size: 11px;
      }

      .total-count {
        font-size: 11px;
      }
    }
  }
}

.empty-state {
  padding: 60px 20px;
  text-align: center;
  color: var(--el-text-color-secondary);

  i {
    font-size: 48px;
    opacity: 0.3;
    margin-bottom: 12px;
  }

  p {
    font-size: 14px;
    margin: 0;
  }
}

.articles-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.article-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
  padding: 18px 20px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 12px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: visible;
  isolation: isolate;


  &:hover {
    border-color: var(--theme-purple-primary);
    background: var(--el-fill-color-blank);
    box-shadow: 0 8px 24px rgba(139, 92, 246, 0.12), 0 4px 8px rgba(0, 0, 0, 0.04);
    transform: translateY(-4px) scale(1.01);

    .item-title {
      color: var(--theme-purple-primary);
    }

    .item-cover {
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
      
      img {
        transform: scale(1.08);
      }
    }

    .status-badge {
      transform: scale(1.05);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
  }

  @media (max-width: 768px) {
    padding: 10px;
    flex-direction: row;
    gap: 10px;
    align-items: flex-start;

    &:hover {
      transform: none;
    }

    .item-main {
      order: 2;
      flex: 1;
      min-width: 0;
    }

    .item-aside {
      order: 1;
      flex-shrink: 0;
    }
  }

  .item-main {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    z-index: 3;

    @media (max-width: 768px) {
      gap: 6px;
    }
  }

  .item-header {
    display: flex;
    align-items: center;
  }

  .item-title {
    flex: 1;
    font-size: 15px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    margin: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    transition: all 0.3s ease;
    line-height: 1.5;

    @media (max-width: 768px) {
      font-size: 13px;
      line-height: 1.4;
      white-space: normal;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      margin-bottom: 4px;
    }
  }

  .status-badge {
    position: absolute;
    top: 0;
    right: 0;
    padding: 5px 12px;
    font-size: 11px;
    font-weight: 500;
    display: inline-flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-radius: 0 8px 0 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    z-index: 2;

    @media (max-width: 768px) {
      padding: 4px 8px;
      font-size: 10px;
      gap: 3px;
      border-radius: 0 10px 0 8px;

      &::before {
        width: 4px;
        height: 4px;
      }
    }
    
    &::before {
      content: '';
      width: 6px;
      height: 6px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    
    &.published {
      background: rgba(236, 253, 245, 0.95);
      color: #059669;
      border: 1px solid rgba(16, 185, 129, 0.2);
      
      &::before {
        background: #10b981;
        box-shadow: 0 0 6px rgba(16, 185, 129, 0.6);
      }
    }

    &.draft {
      background: rgba(254, 252, 232, 0.95);
      color: #d97706;
      border: 1px solid rgba(245, 158, 11, 0.2);
      
      &::before {
        background: #f59e0b;
        box-shadow: 0 0 6px rgba(245, 158, 11, 0.6);
      }
    }
  }

  .item-meta {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    font-size: 11px;
    color: var(--el-text-color-secondary);

    @media (max-width: 768px) {
      gap: 4px;
      row-gap: 6px;
      margin-top: 2px;
    }

    .meta-item {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      border-radius: 4px;
      transition: all 0.2s ease;
      font-size: 11px;
      font-weight: 500;
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);

      @media (max-width: 768px) {
        padding: 2px 6px;
        font-size: 10px;
        gap: 3px;

        i {
          font-size: 10px;
        }
      }

      i {
        font-size: 11px;
        opacity: 0.9;
      }

      &.date {
        background: rgba(236, 253, 245, 0.6);
        color: #047857;
        border: 1px solid rgba(167, 243, 208, 0.3);
        
        i {
          color: #10b981;
        }
      }

      &.views {
        background: rgba(239, 246, 255, 0.6);
        color: #1e40af;
        border: 1px solid rgba(191, 219, 254, 0.3);
        
        i {
          color: #3b82f6;
        }
      }

      &.comments {
        background: rgba(255, 247, 237, 0.6);
        color: #c2410c;
        border: 1px solid rgba(254, 215, 170, 0.3);
        
        i {
          color: #f97316;
        }
      }

      &.tags {
        background: rgba(250, 245, 255, 0.6);
        color: #7e22ce;
        border: 1px solid rgba(233, 213, 255, 0.3);
        
        i {
          color: #a855f7;
        }
      }
      
      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
      }
    }

    .meta-divider {
      display: none;
    }
  }

  .item-aside {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    gap: 16px;
    position: relative;
    z-index: 3;

    @media (max-width: 768px) {
      flex-direction: column;
      gap: 8px;
      align-items: flex-end;
    }
  }

  .item-cover {
    width: 100px;
    height: 70px;
    border-radius: 8px;
    overflow: hidden;
    background: var(--el-fill-color);
    flex-shrink: 0;
    box-shadow: 0 0 0 1px var(--el-border-color-lighter);
    position: relative;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    @media (max-width: 768px) {
      width: 90px;
      height: 90px;
      border-radius: 10px;
    }

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(59, 130, 246, 0.05), rgba(139, 92, 246, 0.03));
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      position: relative;
      z-index: 1;
    }
  }

  .article-item:hover .item-cover::after {
    opacity: 1;
  }

  .item-actions {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.7);
    display: flex;
    gap: 12px;
    opacity: 0;
    pointer-events: none;
    transition: all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
    z-index: 999;

    @media (max-width: 768px) {
      gap: 10px;
    }
  }

  &:hover .item-actions {
    opacity: 1;
    pointer-events: auto;
    transform: translate(-50%, -50%) scale(1);
    .action-btn {
      width: 44px;
      height: 44px;
      border: none;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.25s ease;
      font-size: 16px;
      background: white;
      color: var(--theme-purple-primary);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
      flex-shrink: 0;

      @media (max-width: 768px) {
        width: 40px;
        height: 40px;
        font-size: 14px;
      }

      &:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
      }

      &:active {
        transform: scale(0.95);
      }

      &:nth-child(1):hover {
        background: linear-gradient(135deg, #8b5cf6, #6366f1);
        color: white;
      }

      &:nth-child(2):hover {
        background: linear-gradient(135deg, #60a5fa, #3b82f6);
        color: white;
      }

      &:nth-child(3):hover {
        background: linear-gradient(135deg, #fb7185, #f43f5e);
        color: white;
      }
    }
  }
}

.list-pagination {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid var(--el-border-color-extra-light);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    margin-top: 16px;
    padding-top: 12px;
    gap: 6px;
  }

  .page-btn, .page-num {
    width: 32px;
    height: 32px;
    border: 1px solid var(--el-border-color);
    background: var(--el-bg-color);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
    font-size: 13px;
    color: var(--el-text-color-regular);

    @media (max-width: 768px) {
      width: 28px;
      height: 28px;
      font-size: 12px;
    }

    &:hover:not(:disabled) {
      border-color: var(--theme-purple-primary);
      color: var(--theme-purple-primary);
    }

    &:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }

    &.active {
      background: linear-gradient(135deg, var(--theme-purple-primary), var(--theme-purple-secondary));
      color: white;
      border-color: transparent;
      font-weight: 600;
    }
  }

  .page-numbers {
    display: flex;
    gap: 4px;
  }

  .page-size {
    margin-left: 12px;

    @media (max-width: 768px) {
      width: 100%;
      margin: 8px 0 0 0;
      display: flex;
      justify-content: center;
    }

    select {
      padding: 6px 10px;
      border: 1px solid var(--el-border-color);
      border-radius: 6px;
      background: var(--el-bg-color);
      color: var(--el-text-color-regular);
      font-size: 12px;
      cursor: pointer;
      transition: all 0.2s ease;

      @media (max-width: 768px) {
        padding: 5px 8px;
        font-size: 11px;
      }

      &:hover {
        border-color: var(--theme-purple-primary);
      }

      &:focus {
        outline: none;
        border-color: var(--theme-purple-primary);
      }
    }
  }
}

// 动画关键帧
@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  25% {
    transform: translateY(-6px);
  }
  50% {
    transform: translateY(0);
  }
  75% {
    transform: translateY(-3px);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.2);
  }
}
</style>
