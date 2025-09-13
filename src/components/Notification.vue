<template>
  <transition name="notification-fade">
    <div v-if="isVisible" class="notification-container" :class="{ 'notification-collapsed': isCollapsed }">
      <div class="notification-header">
        <div class="notification-title">
          <el-icon class="notification-icon"><Bell /></el-icon>
          <span>{{ title }}</span>
        </div>
        <div class="notification-actions">
          <el-button v-if="!isCollapsed" type="text" @click="toggleCollapse" class="collapse-btn">
            <el-icon><ArrowUp /></el-icon>
          </el-button>
          <el-button v-else type="text" @click="toggleCollapse" class="collapse-btn">
            <el-icon><ArrowDown /></el-icon>
          </el-button>
          <el-button type="text" @click="closeNotification" class="close-btn">
            <el-icon><Close /></el-icon>
          </el-button>
        </div>
      </div>
      
      <div v-if="!isCollapsed" class="notification-content">
        <div v-if="activeNotification" class="notification-message">
          <div class="message-header">
            <span class="message-type" :class="activeNotification.type">
              {{ getTypeLabel(activeNotification.type) }}
            </span>
            <span class="message-date">{{ formatDate(activeNotification.date) }}</span>
          </div>
          <div class="message-body" v-html="activeNotification.message"></div>
          
          <div v-if="activeNotification.actions && activeNotification.actions.length" class="message-actions">
            <el-button 
              v-for="(action, index) in activeNotification.actions" 
              :key="index"
              :type="action.type || 'primary'"
              :link="action.link || false"
              size="small"
              @click="handleAction(action)"
            >
              {{ action.label }}
            </el-button>
          </div>
        </div>
        
        <div class="notification-navigation">
          <div class="nav-dots">
            <span 
              v-for="(item, index) in notifications" 
              :key="index" 
              class="nav-dot"
              :class="{ active: currentIndex === index }"
              @click="setActiveNotification(index)"
            ></span>
          </div>
          
          <div class="navigation-buttons">
            <el-button 
              v-if="notifications.length > 1" 
              type="text" 
              :disabled="currentIndex === 0"
              @click="prevNotification"
            >
              <el-icon><ArrowLeft /></el-icon>
            </el-button>
            <el-button 
              v-if="notifications.length > 1" 
              type="text" 
              :disabled="currentIndex === notifications.length - 1"
              @click="nextNotification"
            >
              <el-icon><ArrowRight /></el-icon>
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessageBox } from 'element-plus';
import { 
  Bell, 
  Close, 
  ArrowUp, 
  ArrowDown, 
  ArrowLeft, 
  ArrowRight
} from '@element-plus/icons-vue';

const router = useRouter();

// 通知状态
const isVisible = ref(true);
const isCollapsed = ref(false);
const currentIndex = ref(0);

// 标题
const title = ref('系统通知');

// 示例通知数据
const notifications = ref([
  {
    id: 1,
    type: 'announcement',
    title: '社区新功能上线',
    message: '我们很高兴地宣布，<strong>文章协作功能</strong>已经上线！现在您可以邀请其他作者一起编辑文章了。',
    date: new Date('2023-11-28'),
    isRead: false,
    actions: [
      { 
        label: '了解详情', 
        type: 'primary', 
        link: true,
        handler: 'navigate',
        path: '/announcements/new-features'
      }
    ]
  },
  {
    id: 2,
    type: 'system',
    title: '系统维护通知',
    message: '系统将于<span style="color: #ff4d4f">2023年12月5日 03:00-05:00</span>进行例行维护，届时网站将暂时无法访问。给您带来不便，敬请谅解。',
    date: new Date('2023-12-01'),
    isRead: false,
    actions: []
  },
  {
    id: 3,
    type: 'update',
    title: '新版本发布',
    message: '我们的移动端应用 v2.3.0 已经发布！包含多项性能优化和界面改进。立即更新体验全新功能。',
    date: new Date('2023-11-25'),
    isRead: false,
    actions: [
      { 
        label: '立即更新', 
        type: 'success',
        handler: 'downloadApp'
      },
      { 
        label: '稍后提醒', 
        type: 'info',
        handler: 'remindLater'
      }
    ]
  }
]);

// 计算当前活动的通知
const activeNotification = computed(() => {
  return notifications.value[currentIndex.value];
});

// 控制通知显示/隐藏
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

const closeNotification = () => {
  isVisible.value = false;
  
  // 可以添加逻辑，将当前通知标记为已读
  if (activeNotification.value) {
    activeNotification.value.isRead = true;
  }
  
  // 可以将已读状态保存到本地存储
  const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
  if (activeNotification.value && !readNotifications.includes(activeNotification.value.id)) {
    readNotifications.push(activeNotification.value.id);
    localStorage.setItem('readNotifications', JSON.stringify(readNotifications));
  }
};

// 导航到上一条/下一条通知
const prevNotification = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--;
  }
};

const nextNotification = () => {
  if (currentIndex.value < notifications.value.length - 1) {
    currentIndex.value++;
  }
};

// 设置当前活动的通知
const setActiveNotification = (index) => {
  currentIndex.value = index;
};

// 根据通知类型获取显示标签
const getTypeLabel = (type) => {
  const types = {
    'announcement': '公告',
    'system': '系统',
    'update': '更新',
    'promotion': '活动',
    'news': '新闻'
  };
  
  return types[type] || '通知';
};

// 格式化日期
const formatDate = (date) => {
  if (!date) return '';
  
  if (typeof date === 'string') {
    date = new Date(date);
  }
  
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24));
  
  if (diff === 0) {
    return '今天';
  } else if (diff === 1) {
    return '昨天';
  } else if (diff < 7) {
    return `${diff}天前`;
  } else {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  }
};

// 处理通知操作
const handleAction = (action) => {
  if (!action.handler) return;
  
  switch (action.handler) {
    case 'navigate':
      if (action.path) {
        router.push(action.path);
      }
      break;
    
    case 'downloadApp':
      window.open('https://your-app-download-url.com', '_blank');
      break;
      
    case 'remindLater':
      // 关闭当前通知，稍后再显示
      closeNotification();
      
      // 可以设置一个计时器，稍后再次显示通知
      setTimeout(() => {
        isVisible.value = true;
      }, 3600000); // 1小时后再提醒
      break;
      
    case 'openModal':
      // 打开一个模态窗口
      ElMessageBox.alert(
        action.content || '详细信息',
        action.title || '详情',
        {
          confirmButtonText: '确定',
          type: action.modalType || 'info',
        }
      );
      break;
      
    default:
      // 如果handler是一个函数，直接调用
      if (typeof action.handler === 'function') {
        action.handler();
      }
      break;
  }
};

// 检查是否有未读通知并显示
onMounted(() => {
  // 可以从本地存储中读取已读通知
  const readNotifications = JSON.parse(localStorage.getItem('readNotifications') || '[]');
  
  // 过滤出未读通知
  const unreadNotifications = notifications.value.filter(notification => 
    !readNotifications.includes(notification.id)
  );
  
  // 如果没有未读通知，默认折叠
  if (unreadNotifications.length === 0) {
    isCollapsed.value = true;
  }
  
  // 设置第一条未读通知为活动通知
  if (unreadNotifications.length > 0) {
    const firstUnreadIndex = notifications.value.findIndex(
      notification => notification.id === unreadNotifications[0].id
    );
    
    if (firstUnreadIndex !== -1) {
      currentIndex.value = firstUnreadIndex;
    }
  }
});
</script>

<style scoped lang="less">
.notification-container {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 400px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
  z-index: 1000;
  overflow: hidden;
  transition: all 0.3s ease;
  
  &.notification-collapsed {
    width: 300px;
  }
  
  @media (max-width: 767px) {
    width: calc(100% - 40px);
    max-width: 400px;
    bottom: 10px;
    right: 10px;
    
    &.notification-collapsed {
      width: calc(100% - 40px);
      max-width: 300px;
    }
  }
}

.notification-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: linear-gradient(135deg, #1e80ff, #6366f1);
  color: white;
}

.notification-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
  
  .notification-icon {
    font-size: 18px;
  }
}

.notification-actions {
  display: flex;
  align-items: center;
  
  .el-button {
    padding: 4px;
    color: white;
    
    &:hover {
      color: rgba(255, 255, 255, 0.8);
    }
  }
}

.notification-content {
  padding: 16px;
  max-height: 300px;
  overflow-y: auto;
}

.notification-message {
  .message-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    
    .message-type {
      font-size: 13px;
      font-weight: 600;
      padding: 2px 8px;
      border-radius: 4px;
      
      &.announcement {
        background-color: #e6f7ff;
        color: #1890ff;
      }
      
      &.system {
        background-color: #fff2e8;
        color: #fa8c16;
      }
      
      &.update {
        background-color: #f6ffed;
        color: #52c41a;
      }
      
      &.promotion {
        background-color: #fff0f6;
        color: #eb2f96;
      }
      
      &.news {
        background-color: #f9f0ff;
        color: #722ed1;
      }
    }
    
    .message-date {
      font-size: 12px;
      color: #8c8c8c;
    }
  }
  
  .message-body {
    font-size: 14px;
    line-height: 1.6;
    color: #333;
    margin-bottom: 16px;
  }
  
  .message-actions {
    display: flex;
    gap: 8px;
    margin-top: 12px;
  }
}

.notification-navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
  padding-top: 10px;
  border-top: 1px solid #f0f0f0;
  
  .nav-dots {
    display: flex;
    gap: 6px;
    
    .nav-dot {
      width: 8px;
      height: 8px;
      background-color: #d9d9d9;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s;
      
      &.active {
        background-color: #1e80ff;
        transform: scale(1.2);
      }
      
      &:hover:not(.active) {
        background-color: #bfbfbf;
      }
    }
  }
  
  .navigation-buttons {
    display: flex;
    gap: 8px;
    
    .el-button {
      padding: 4px;
    }
  }
}

// 过渡动画
.notification-fade-enter-active,
.notification-fade-leave-active {
  transition: all 0.3s;
}

.notification-fade-enter-from,
.notification-fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style> 