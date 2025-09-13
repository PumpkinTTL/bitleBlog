<template>
  <div class="favorites-container">
    <!-- 加载状态 -->
    <div v-if="isLoading" class="loading-container animate__animated animate__fadeIn">
      <div class="loading-spinner">
        <i class="fas fa-circle-notch fa-spin"></i>
      </div>
      <p>加载收藏中...</p>
    </div>
    
    <!-- 收藏列表为空时显示 -->
    <div v-else-if="favorites.length === 0" class="empty-container animate__animated animate__fadeIn">
      <div class="empty-icon">
        <i class="fas fa-heart"></i>
      </div>
      <p class="empty-text">暂无收藏</p>
      <p class="empty-subtext">浏览更多内容，收藏你喜欢的文章和资源</p>
      <button class="browse-btn" @click="browseContent">
        <span class="icon-wrapper"><i class="fas fa-compass"></i></span>
        <span>去浏览</span>
      </button>
    </div>
    
    <!-- 收藏列表 -->
    <div v-else class="favorites-list">
      <div 
        v-for="(item, index) in favorites" 
        :key="item.id" 
        class="favorite-card animate__animated animate__fadeIn" 
        :style="{ animationDelay: index * 0.1 + 's' }"
      >
        <!-- 收藏类型标签 -->
        <div class="type-badge" :class="getTypeClass(item.type)">
          <span class="icon-wrapper"><i :class="getTypeIcon(item.type)"></i></span>
          <span>{{ item.type }}</span>
        </div>
        
        <!-- 收藏封面 -->
        <div class="favorite-cover" v-if="item.cover" @click="viewItem(item)">
          <img :src="item.cover" :alt="item.title">
          <div class="cover-overlay">
            <div class="overlay-icon">
              <i class="fas fa-eye"></i>
            </div>
          </div>
        </div>
        
        <!-- 收藏内容 -->
        <div class="favorite-content">
          <h3 class="favorite-title" @click="viewItem(item)">
            {{ item.title }}
          </h3>
          
          <p class="favorite-brief">{{ item.brief }}</p>
          
          <div class="favorite-meta">
            <div class="meta-item author">
              <span class="icon-wrapper"><i class="fas fa-user"></i></span>
              <span>{{ item.author }}</span>
            </div>
            <div class="meta-item date">
              <span class="icon-wrapper"><i class="fas fa-calendar-alt"></i></span>
              <span>{{ formatDate(item.collectTime) }}</span>
            </div>
          </div>
          
          <div class="favorite-actions">
            <button class="action-btn view-btn" @click="viewItem(item)">
              <span class="icon-wrapper"><i class="fas fa-eye"></i></span>
              <span>查看</span>
            </button>
            <button class="action-btn remove-btn" @click="confirmRemove(item.id)">
              <span class="icon-wrapper"><i class="fas fa-heart-broken"></i></span>
              <span>取消收藏</span>
            </button>
            <button class="action-btn share-btn">
              <span class="icon-wrapper"><i class="fas fa-share-alt"></i></span>
              <span>分享</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 确认取消收藏对话框 -->
    <el-dialog
      v-model="removeDialogVisible"
      title="取消收藏"
      width="400px"
      center
      destroy-on-close
    >
      <div class="remove-dialog-content">
        <div class="dialog-icon">
          <i class="fas fa-heart-broken"></i>
        </div>
        <div class="dialog-message">
          <h4>确定要取消收藏该内容吗？</h4>
          <p>取消后可以随时重新收藏。</p>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <button class="dialog-btn cancel-btn" @click="removeDialogVisible = false">
            <span class="icon-wrapper"><i class="fas fa-times"></i></span>
            <span>取消</span>
          </button>
          <button class="dialog-btn confirm-btn" @click="removeFromFavorites">
            <span class="icon-wrapper"><i class="fas fa-check"></i></span>
            <span>确认取消</span>
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

interface FavoriteItem {
  id: number;
  type: string;
  title: string;
  brief: string;
  author: string;
  cover?: string;
  collectTime: string;
  sourceId: number;
}

// 定义组件属性
const props = defineProps({
  // 收藏列表
  favorites: {
    type: Array as () => FavoriteItem[],
    default: () => []
  },
  // 是否正在加载
  isLoading: {
    type: Boolean,
    default: false
  }
})

// 定义事件
const emit = defineEmits(['remove'])

// 取消收藏对话框相关状态
const removeDialogVisible = ref(false)
const currentRemoveId = ref<number | null>(null)

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

// 获取类型图标
const getTypeIcon = (type: string) => {
  const iconMap: Record<string, string> = {
    '文章': 'fas fa-file-alt',
    '资源': 'fas fa-download',
    '视频': 'fas fa-video',
    '问答': 'fas fa-question-circle',
    '课程': 'fas fa-graduation-cap'
  }
  return iconMap[type] || 'fas fa-bookmark'
}

// 获取类型样式
const getTypeClass = (type: string) => {
  const classMap: Record<string, string> = {
    '文章': 'type-article',
    '资源': 'type-resource',
    '视频': 'type-video',
    '问答': 'type-qa',
    '课程': 'type-course'
  }
  return classMap[type] || ''
}

// 查看收藏项目
const viewItem = (item: FavoriteItem) => {
  // 根据不同类型的收藏项目，跳转到不同的页面
  switch (item.type) {
    case '文章':
      router.push(`/article/${item.sourceId}`)
      break
    case '资源':
      router.push(`/resource/${item.sourceId}`)
      break
    case '视频':
      router.push(`/video/${item.sourceId}`)
      break
    default:
      router.push(`/detail/${item.sourceId}`)
  }
}

// 浏览内容
const browseContent = () => {
  router.push('/')
}

// 确认取消收藏
const confirmRemove = (id: number) => {
  currentRemoveId.value = id
  removeDialogVisible.value = true
}

// 执行取消收藏
const removeFromFavorites = () => {
  if (currentRemoveId.value !== null) {
    emit('remove', currentRemoveId.value)
    removeDialogVisible.value = false
    ElMessage.success('已取消收藏')
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
.favorites-container {
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
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0% { transform: scale(1); opacity: 0.7; }
    50% { transform: scale(1.1); opacity: 0.9; }
    100% { transform: scale(1); opacity: 0.7; }
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
  
  .browse-btn {
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

// 收藏列表
.favorites-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
  
  // 收藏卡片
  .favorite-card {
    display: flex;
    background: white;
    border-radius: 16px;
    overflow: hidden;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
    transition: all @transition-time;
    animation-duration: 0.6s;
    position: relative;
    border: 1px solid rgba(0, 0, 0, 0.03);
    
    &:hover {
      box-shadow: @card-shadow;
      transform: translateY(-3px);
    }
    
    // 类型标签
    .type-badge {
      position: absolute;
      top: 12px;
      left: 12px;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 12px;
      color: white;
      font-weight: 500;
      display: flex;
      align-items: center;
      z-index: 2;
      box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
      backdrop-filter: blur(4px);
      transition: all 0.3s;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
      }
      
      &.type-article {
        background: linear-gradient(135deg, #1890ff, #096dd9);
      }
      
      &.type-resource {
        background: linear-gradient(135deg, #52c41a, #237804);
      }
      
      &.type-video {
        background: linear-gradient(135deg, #fa8c16, #d46b08);
      }
      
      &.type-qa {
        background: linear-gradient(135deg, #722ed1, #391085);
      }
      
      &.type-course {
        background: linear-gradient(135deg, #eb2f96, #c41d7f);
      }
    }
    
    // 收藏封面
    .favorite-cover {
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
    
    // 收藏内容
    .favorite-content {
      flex: 1;
      padding: 20px;
      display: flex;
      flex-direction: column;
      position: relative;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        right: 0;
        width: 50px;
        height: 50px;
        background: radial-gradient(circle at top right, rgba(24, 144, 255, 0.05), transparent 70%);
        border-top-right-radius: 16px;
      }
      
      .favorite-title {
        font-size: 18px;
        font-weight: 600;
        margin: 0 0 12px;
        color: @text-color;
        cursor: pointer;
        transition: color @transition-time;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        
        &:hover {
          color: @primary-color;
        }
      }
      
      .favorite-brief {
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
        background: linear-gradient(to bottom, @text-secondary, @text-secondary);
        background-clip: text;
        -webkit-background-clip: text;
      }
      
      .favorite-meta {
        display: flex;
        flex-wrap: wrap;
        gap: 16px;
        margin-bottom: 16px;
        
        .meta-item {
          display: flex;
          align-items: center;
          font-size: 13px;
          color: @text-light;
          transition: all 0.3s;
          
          &:hover {
            transform: translateY(-1px);
          }
          
          &.author {
            color: @primary-color;
            font-weight: 500;
            
            .icon-wrapper {
              color: @primary-light;
            }
          }
          
          .icon-wrapper {
            color: @text-light;
          }
        }
      }
      
      .favorite-actions {
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
          
          &.view-btn {
            background: @primary-bg;
            color: @primary-color;
            
            &:hover {
              background: @primary-light;
              color: white;
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(24, 144, 255, 0.2);
            }
          }
          
          &.remove-btn {
            background: #fff1f0;
            color: @danger-color;
            
            &:hover {
              background: @danger-color;
              color: white;
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(245, 34, 45, 0.2);
            }
          }
          
          &.share-btn {
            background: #fff7e6;
            color: @warning-color;
            
            &:hover {
              background: @warning-color;
              color: white;
              transform: translateY(-2px);
              box-shadow: 0 4px 8px rgba(250, 173, 20, 0.2);
            }
          }
        }
      }
    }
  }
}

// 删除对话框
.remove-dialog-content {
  display: flex;
  align-items: center;
  padding: 10px 0;
  
  .dialog-icon {
    font-size: 40px;
    color: @danger-color;
    margin-right: 20px;
    animation: heartBeat 1.5s infinite;
  }
  
  @keyframes heartBeat {
    0% { transform: scale(1); }
    14% { transform: scale(1.1); }
    28% { transform: scale(1); }
    42% { transform: scale(1.1); }
    70% { transform: scale(1); }
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
  .favorites-list {
    .favorite-card {
      flex-direction: column;
      
      .favorite-cover {
        width: 100%;
        height: 180px;
        order: -1;
      }
      
      .favorite-content {
        padding: 16px;
        
        .favorite-title {
          font-size: 16px;
          margin-bottom: 10px;
        }
        
        .favorite-brief {
          margin-bottom: 12px;
          -webkit-line-clamp: 3;
        }
        
        .favorite-meta {
          margin-bottom: 12px;
        }
      }
      
      .type-badge {
        top: 12px;
        left: 12px;
      }
    }
  }
}
</style> 