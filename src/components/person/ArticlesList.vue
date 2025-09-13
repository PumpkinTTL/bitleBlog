<template>
  <div class="articles-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container animate__animated animate__fadeIn">
      <div class="loading-spinner">
        <i class="fas fa-circle-notch fa-spin"></i>
      </div>
      <p>加载文章中...</p>
    </div>
    
    <!-- 文章列表为空时显示 -->
    <div v-else-if="articles.length === 0" class="empty-container animate__animated animate__fadeIn">
      <div class="empty-icon">
        <i class="fas fa-file-alt"></i>
      </div>
      <p class="empty-text">暂无文章</p>
      <p class="empty-subtext">开始创作，分享你的第一篇文章吧！</p>
      <button class="create-btn" @click="createArticle">
        <span class="icon-wrapper"><i class="fas fa-plus"></i></span>
        <span>写文章</span>
      </button>
    </div>
    
    <!-- 文章列表 -->
    <div v-else class="articles-list">
      <div 
        v-for="(article, index) in articles" 
        :key="article.id" 
        class="article-card animate__animated animate__fadeIn" 
        :style="{ animationDelay: index * 0.1 + 's' }"
      >
        <!-- 文章封面 -->
        <div class="article-cover" v-if="article.cover" @click="viewArticle(article.id)">
          <img :src="article.cover" :alt="article.title">
          <div class="cover-overlay">
            <div class="overlay-icon">
              <i class="fas fa-eye"></i>
            </div>
          </div>
        </div>
        
        <!-- 文章内容 -->
        <div class="article-content">
          <div class="article-header">
            <h3 class="article-title" @click="viewArticle(article.id)">
              {{ article.title }}
            </h3>
            
            <div class="article-tags">
              <span class="article-tag" v-if="article.isTop">
                <i class="fas fa-thumbtack"></i> 置顶
              </span>
              <span class="article-tag" v-if="article.isRecommend">
                <i class="fas fa-star"></i> 推荐
              </span>
              <span class="article-tag" v-if="article.isOriginal">
                <i class="fas fa-copyright"></i> 原创
              </span>
            </div>
          </div>
          
          <p class="article-brief">{{ article.brief }}</p>
          
          <div class="article-meta">
            <div class="meta-item">
              <span class="icon-wrapper"><i class="fas fa-calendar-alt"></i></span>
              <span>{{ formatDate(article.publishTime) }}</span>
            </div>
            <div class="meta-item">
              <span class="icon-wrapper"><i class="fas fa-eye"></i></span>
              <span>{{ article.views || 0 }} 阅读</span>
            </div>
            <div class="meta-item">
              <span class="icon-wrapper"><i class="fas fa-thumbs-up"></i></span>
              <span>{{ article.likes || 0 }} 点赞</span>
            </div>
            <div class="meta-item">
              <span class="icon-wrapper"><i class="fas fa-comment"></i></span>
              <span>{{ article.comments || 0 }} 评论</span>
            </div>
          </div>
          
          <div class="article-actions" v-if="showActions">
            <button class="action-btn edit-btn" @click="editArticle(article.id)">
              <span class="icon-wrapper"><i class="fas fa-edit"></i></span>
              <span>编辑</span>
            </button>
            <button class="action-btn delete-btn" @click="confirmDelete(article.id)">
              <span class="icon-wrapper"><i class="fas fa-trash"></i></span>
              <span>删除</span>
            </button>
            <button class="action-btn stats-btn">
              <span class="icon-wrapper"><i class="fas fa-chart-bar"></i></span>
              <span>统计</span>
            </button>
            <button class="action-btn share-btn">
              <span class="icon-wrapper"><i class="fas fa-share-alt"></i></span>
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 确认删除对话框 -->
    <el-dialog
      v-model="deleteDialogVisible"
      title="确认删除"
      width="400px"
      center
      destroy-on-close
    >
      <div class="delete-dialog-content">
        <div class="dialog-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <div class="dialog-message">
          <h4>确定要删除这篇文章吗？</h4>
          <p>此操作不可撤销，删除后文章将无法恢复。</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="dialog-btn cancel-btn" @click="deleteDialogVisible = false">
            <span class="icon-wrapper"><i class="fas fa-times"></i></span>
            <span>取消</span>
          </button>
          <button class="dialog-btn confirm-btn" @click="deleteArticle">
            <span class="icon-wrapper"><i class="fas fa-check"></i></span>
            <span>确认删除</span>
          </button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'

const router = useRouter()

interface Article {
  id: number;
  title: string;
  brief: string;
  cover?: string;
  publishTime: string;
  views?: number;
  likes?: number;
  comments?: number;
  isTop?: boolean;
  isRecommend?: boolean;
  isOriginal?: boolean;
}

// 定义组件属性
const props = defineProps({
  // 文章列表
  articles: {
    type: Array as () => Article[],
    default: () => []
  },
  // 是否显示操作按钮（编辑、删除）
  showActions: {
    type: Boolean,
    default: false
  },
  // 是否正在加载
  isLoading: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['delete', 'edit', 'create'])

// 删除对话框相关状态
const deleteDialogVisible = ref(false)
const currentDeleteId = ref<number | null>(null)

// 格式化日期
const formatDate = (dateStr: string) => {
  if (!dateStr) return '未知'
  
  // 简单的日期格式化，实际项目中应该使用日期格式化工具
  try {
    const date = new Date(dateStr)
    return date.toLocaleDateString()
  } catch (e) {
    return dateStr
  }
}

// 查看文章详情
const viewArticle = (id: number) => {
  router.push(`/article/${id}`)
}

// 编辑文章
const editArticle = (id: number) => {
  emit('edit', id)
}

// 创建文章
const createArticle = () => {
  emit('create')
}

// 确认删除
const confirmDelete = (id: number) => {
  currentDeleteId.value = id
  deleteDialogVisible.value = true
}

// 执行删除
const deleteArticle = () => {
  if (currentDeleteId.value !== null) {
    emit('delete', currentDeleteId.value)
    deleteDialogVisible.value = false
    ElMessage.success('文章已删除')
  }
}
</script>

<style lang="less" scoped>
// 变量定义
@primary-color: #1890ff;
@primary-dark: #096dd9;
@primary-light: #40a9ff;
@primary-bg: #e6f7ff;
@text-color: #333;
@text-secondary: #666;
@text-light: #999;
@border-color: #eaeaea;
@success-color: #52c41a;
@warning-color: #faad14;
@danger-color: #f5222d;
@card-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
@transition-time: 0.3s;

// 图标包装
.icon-wrapper {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 4px;
}

// 主容器
.articles-container {
  width: 100%;
}

// 加载状态
.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  
  .loading-spinner {
    font-size: 40px;
    color: @primary-color;
    margin-bottom: 16px;
    animation: spin 1.5s linear infinite;
  }
  
  p {
    color: @text-secondary;
    font-size: 16px;
  }
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

// 空状态
.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  
  .empty-icon {
    font-size: 60px;
    color: #d9d9d9;
    margin-bottom: 16px;
    opacity: 0.7;
  }
  
  .empty-text {
    color: @text-secondary;
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  .empty-subtext {
    color: @text-light;
    font-size: 14px;
    margin-bottom: 24px;
  }
  
  .create-btn {
    display: flex;
    align-items: center;
    padding: 10px 20px;
    background: linear-gradient(135deg, #1890ff, #096dd9);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 15px;
    cursor: pointer;
    transition: all @transition-time;
    box-shadow: 0 2px 6px rgba(24, 144, 255, 0.2);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
    }
  }
}

// 文章列表
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  // 文章卡片
  .article-card {
    display: flex;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: all @transition-time;
    animation-duration: 0.6s;
    border: 1px solid rgba(0, 0, 0, 0.03);
    position: relative;
    
    &:hover {
      box-shadow: @card-shadow;
      transform: translateY(-3px);
    }
    
    &::after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 4px;
      height: 0;
      background: linear-gradient(to bottom, @primary-color, @primary-light);
      transition: height 0.3s ease;
    }
    
    &:hover::after {
      height: 100%;
    }
    
    // 文章封面
    .article-cover {
      width: 220px;
      height: 160px;
      flex-shrink: 0;
      position: relative;
      overflow: hidden;
      cursor: pointer;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform @transition-time;
      }
      
      .cover-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity @transition-time;
        
        .overlay-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          color: @primary-color;
          font-size: 20px;
          transform: scale(0.8);
          transition: transform @transition-time;
        }
      }
      
      &:hover {
        img {
          transform: scale(1.05);
        }
        
        .cover-overlay {
          opacity: 1;
          
          .overlay-icon {
            transform: scale(1);
          }
        }
      }
    }
    
    // 文章内容
    .article-content {
      flex: 1;
      padding: 20px;
      display: flex;
      flex-direction: column;
      
      .article-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 12px;
        
        .article-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0;
          color: @text-color;
          cursor: pointer;
          transition: color @transition-time;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 1;
          -webkit-box-orient: vertical;
          max-width: 70%;
          
          &:hover {
            color: @primary-color;
          }
        }
        
        .article-tags {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          
          .article-tag {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 4px;
            background: #f0f0f0;
            color: @text-secondary;
            
            &:nth-child(1) {
              background: #e6f7ff;
              color: @primary-color;
            }
            
            &:nth-child(2) {
              background: #fff7e6;
              color: @warning-color;
            }
            
            &:nth-child(3) {
              background: #f6ffed;
              color: @success-color;
            }
          }
        }
      }
      
      .article-brief {
        font-size: 14px;
        color: @text-secondary;
        margin: 0 0 16px;
        line-height: 1.6;
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      
      .article-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 16px;
        
        .meta-item {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: @text-light;
          
          .icon-wrapper {
            color: @text-light;
          }
          
          &:hover {
            color: @primary-color;
            
            .icon-wrapper {
              color: @primary-color;
            }
          }
        }
      }
      
      .article-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        
        .action-btn {
          display: flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 13px;
          cursor: pointer;
          transition: all @transition-time;
          border: none;
          
          &.edit-btn {
            background: @primary-bg;
            color: @primary-color;
            
            &:hover {
              background: @primary-light;
              color: white;
              transform: translateY(-2px);
            }
          }
          
          &.delete-btn {
            background: #fff1f0;
            color: @danger-color;
            
            &:hover {
              background: @danger-color;
              color: white;
              transform: translateY(-2px);
            }
          }
          
          &.stats-btn {
            background: #f6ffed;
            color: @success-color;
            
            &:hover {
              background: @success-color;
              color: white;
              transform: translateY(-2px);
            }
          }
          
          &.share-btn {
            background: #fff7e6;
            color: @warning-color;
            
            &:hover {
              background: @warning-color;
              color: white;
              transform: translateY(-2px);
            }
          }
        }
      }
    }
  }
}

// 删除对话框
.delete-dialog-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
  
  .dialog-icon {
    font-size: 40px;
    color: @warning-color;
    margin-right: 20px;
  }
  
  .dialog-message {
    h4 {
      font-size: 18px;
      margin: 0 0 8px;
      color: @text-color;
    }
    
    p {
      font-size: 14px;
      margin: 0;
      color: @text-secondary;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
  
  .dialog-btn {
    display: flex;
    align-items: center;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 14px;
    cursor: pointer;
    transition: all @transition-time;
    border: none;
    
    &.cancel-btn {
      background: #f0f0f0;
      color: @text-secondary;
      
      &:hover {
        background: #e0e0e0;
      }
    }
    
    &.confirm-btn {
      background: @danger-color;
      color: white;
      
      &:hover {
        background: darken(@danger-color, 10%);
      }
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .articles-list {
    .article-card {
      flex-direction: column;
      
      .article-cover {
        width: 100%;
        height: 180px;
        order: -1;
      }
      
      .article-content {
        padding: 16px;
        
        .article-header {
          flex-direction: column;
          
          .article-title {
            font-size: 16px;
            margin-bottom: 10px;
            max-width: 100%;
          }
          
          .article-tags {
            margin-bottom: 10px;
          }
        }
        
        .article-brief {
          margin-bottom: 12px;
          -webkit-line-clamp: 3;
        }
        
        .article-meta {
          margin-bottom: 12px;
        }
      }
    }
  }
}
</style> 