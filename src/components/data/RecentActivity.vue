<template>
  <div class="recent-activity">
    <h3 class="activity-title">
      <i class="activity-icon"></i>
      最近活动
      <span class="activity-subtitle">博客最新更新和互动</span>
    </h3>
    
    <div class="activity-content">
      <!-- 活动过滤器 -->
      <div class="activity-filter animate-item" style="animation-delay: 0.1s">
        <div 
          v-for="filter in activityFilters" 
          :key="filter.type"
          class="filter-item"
          :class="{ active: currentFilter === filter.type }"
          @click="setFilter(filter.type)"
        >
          <span class="filter-icon"></span>
          <span class="filter-name">{{ filter.name }}</span>
        </div>
      </div>
      
      <!-- 活动时间线 -->
      <div class="activity-timeline">
        <div 
          v-for="(activity, index) in filteredActivities" 
          :key="index"
          class="timeline-item animate-item"
          :class="[getActivityTypeClass(activity.type)]"
          :style="{ 'animation-delay': `${0.2 + index * 0.1}s` }"
        >
          <div class="timeline-icon">
            <span class="dot"></span>
            <span class="line" v-if="index !== filteredActivities.length - 1"></span>
          </div>
          
          <div class="timeline-content">
            <div class="timeline-header">
              <span class="activity-time">{{ formatDate(activity.time) }}</span>
              <span v-if="activity.tags && activity.tags.length" class="activity-tags">
                <span 
                  v-for="tag in activity.tags.slice(0, 2)" 
                  :key="tag"
                  class="tag"
                >
                  {{ tag }}
                </span>
                <span v-if="activity.tags.length > 2" class="more-tags">+{{ activity.tags.length - 2 }}</span>
              </span>
            </div>
            
            <div class="timeline-body">
              <h4 class="activity-title-text" :title="activity.title">{{ activity.title }}</h4>
              <p class="activity-summary" v-if="activity.summary">{{ activity.summary }}</p>
              
              <div class="activity-meta" v-if="activity.meta">
                <span 
                  v-for="(value, key) in activity.meta" 
                  :key="key"
                  class="meta-item"
                >
                  <span class="meta-key">{{ formatMetaKey(key) }}</span>
                  <span class="meta-value">{{ value }}</span>
                </span>
              </div>
              
              <div class="activity-user" v-if="activity.user">
                <span class="user-avatar" :style="{ backgroundColor: getUserColor(activity.user) }">
                  {{ activity.user.charAt(0).toUpperCase() }}
                </span>
                <span class="user-name">{{ activity.user }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <!-- 空状态 -->
        <div class="empty-state animate-item" v-if="filteredActivities.length === 0">
          <div class="empty-icon"></div>
          <div class="empty-text">没有最近活动</div>
        </div>
        
        <!-- 加载更多 -->
        <div class="load-more animate-item" v-if="filteredActivities.length > 0">
          <button class="load-more-btn" @click="loadMore">
            <span class="btn-text">加载更多</span>
            <span class="btn-icon"></span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 筛选器
const activityFilters = [
  { type: 'all', name: '全部' },
  { type: 'post', name: '文章' },
  { type: 'comment', name: '评论' },
  { type: 'system', name: '系统' }
];

// 当前选择的筛选器
const currentFilter = ref('all');

// 活动数据
const activities = ref([
  {
    type: 'post',
    title: '深入了解Vue3的组合式API和响应式系统',
    summary: 'Vue3的组合式API是一种新的编写Vue组件的方式，它允许我们按照功能组织代码，而不是像选项式API那样按照选项组织代码...',
    time: '2023-05-10T09:34:21',
    user: '张小明',
    tags: ['Vue', 'JavaScript', '前端开发'],
    meta: {
      views: 432,
      comments: 18,
      likes: 76
    }
  },
  {
    type: 'comment',
    title: '评论了文章《TypeScript高级类型系统详解》',
    summary: '这篇文章很棒，特别是关于条件类型和映射类型的部分让我受益匪浅。我一直在项目中struggle如何正确使用这些高级类型，现在明白了！',
    time: '2023-05-09T17:23:45',
    user: '李小红',
    tags: ['TypeScript', '前端']
  },
  {
    type: 'system',
    title: '系统维护通知',
    summary: '为了提升用户体验和系统性能，我们将于5月7日凌晨2:00-4:00进行系统维护，期间网站可能无法访问，给您带来不便敬请谅解。',
    time: '2023-05-07T14:10:32'
  },
  {
    type: 'post',
    title: 'React性能优化最佳实践 - 从理论到实践的全面指南',
    summary: '随着React应用程序变得越来越复杂，性能优化成为前端开发者必须面对的挑战。本文将从理论和实践两个角度...',
    time: '2023-05-05T11:42:18',
    user: '王大壮',
    tags: ['React', 'JavaScript', '性能优化'],
    meta: {
      views: 768,
      comments: 32,
      likes: 124
    }
  },
  {
    type: 'comment',
    title: '评论了文章《从零开始构建Node.js后端服务》',
    summary: '作者对Express和Koa的比较非常到位，我一直在纠结使用哪个框架，这篇文章帮我做了决定。后面关于中间件的部分也非常精彩！',
    time: '2023-05-04T08:56:37',
    user: '陈思思',
    tags: ['Node.js', '后端']
  },
  {
    type: 'post',
    title: '使用TailwindCSS构建现代响应式UI - 从入门到精通',
    summary: 'TailwindCSS是一个功能类优先的CSS框架，它提供了低级实用程序类，可以帮助你快速构建自定义设计...',
    time: '2023-05-02T16:30:54',
    user: '刘洋',
    tags: ['CSS', 'TailwindCSS', '响应式设计'],
    meta: {
      views: 521,
      comments: 24,
      likes: 93
    }
  },
  {
    type: 'system',
    title: '新功能上线：博客标签云',
    summary: '我们很高兴地宣布，全新的博客标签云功能已经上线！现在您可以通过可视化的方式浏览所有标签，并快速找到感兴趣的内容。',
    time: '2023-05-01T10:15:27'
  },
  {
    type: 'comment',
    title: '评论了文章《GraphQL vs REST：何时使用何种API风格》',
    summary: '作为一个同时使用过两种API风格的开发者，我认为这篇文章对比非常公正。不过我想补充一点，在微服务架构中，GraphQL作为BFF层有着REST无法比拟的优势。',
    time: '2023-04-30T22:07:13',
    user: '赵小川',
    tags: ['GraphQL', 'REST', 'API']
  }
]);

// 根据筛选条件过滤活动
const filteredActivities = computed(() => {
  if (currentFilter.value === 'all') {
    return activities.value;
  }
  
  return activities.value.filter(activity => activity.type === currentFilter.value);
});

// 设置筛选条件
const setFilter = (type) => {
  currentFilter.value = type;
};

// 格式化日期
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 如果不到24小时，显示"x小时前"
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return hours > 0 ? `${hours}小时前` : '刚刚';
  }
  
  // 如果不到7天，显示"x天前"
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return `${days}天前`;
  }
  
  // 否则显示具体日期
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 获取用户头像颜色
const getUserColor = (username) => {
  const colors = [
    '#1677ff', '#13c2c2', '#52c41a', '#faad14', 
    '#eb2f96', '#722ed1', '#fa8c16', '#a0d911'
  ];
  
  // 简单的哈希函数，将用户名映射到颜色
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash + username.charCodeAt(i)) % colors.length;
  }
  
  return colors[hash];
};

// 格式化元数据键名
const formatMetaKey = (key) => {
  const map = {
    views: '浏览',
    comments: '评论',
    likes: '点赞'
  };
  
  return map[key] || key;
};

// 获取活动类型的CSS类名
const getActivityTypeClass = (type) => {
  return `activity-${type}`;
};

// 加载更多活动
const loadMore = () => {
  // 这里可以添加加载更多活动的逻辑
  console.log('加载更多活动');
};
</script>

<style scoped lang="less">
.recent-activity {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  .activity-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--bTitleColor, #333);
    margin: 0 0 20px;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &::before, &::after {
      content: '';
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.08), transparent);
      flex: 1;
    }
    
    &::before {
      margin-right: 15px;
    }
    
    &::after {
      margin-left: 15px;
    }
    
    .activity-subtitle {
      font-size: 12px;
      color: #aaa;
      font-weight: normal;
      margin-left: 8px;
    }
  }
  
  .activity-content {
    .activity-filter {
      display: flex;
      justify-content: center;
      margin-bottom: 20px;
      gap: 10px;
      
      .filter-item {
        padding: 6px 12px;
        border-radius: 16px;
        cursor: pointer;
        font-size: 14px;
        color: #666;
        background-color: #f5f5f5;
        transition: all 0.3s;
        
        &:hover {
          background-color: #e6f7ff;
          color: #1677ff;
        }
        
        &.active {
          background-color: #1677ff;
          color: white;
        }
      }
    }
    
    .activity-timeline {
      position: relative;
      
      .timeline-item {
        display: flex;
        margin-bottom: 20px;
        position: relative;
        
        .timeline-icon {
          position: relative;
          padding-right: 16px;
          
          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            display: block;
            margin-top: 10px;
          }
          
          .line {
            position: absolute;
            left: 5px;
            top: 20px;
            bottom: -20px;
            width: 2px;
            background-color: #f0f0f0;
          }
        }
        
        .timeline-content {
          flex: 1;
          min-width: 0; // 解决Flexbox子元素不尊重宽度限制的问题
          padding-bottom: 20px;
          
          .timeline-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 8px;
            
            .activity-time {
              font-size: 12px;
              color: #999;
            }
            
            .activity-tags {
              display: flex;
              align-items: center;
              gap: 4px;
              
              .tag {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 10px;
                font-size: 11px;
                background-color: #f0f0f0;
                color: #666;
                white-space: nowrap;
              }
              
              .more-tags {
                font-size: 11px;
                color: #999;
              }
            }
          }
          
          .timeline-body {
            background-color: #f9f9f9;
            padding: 12px;
            border-radius: 8px;
            position: relative;
            
            // 添加一个小三角，连接时间线
            &::before {
              content: '';
              position: absolute;
              left: -6px;
              top: 12px;
              width: 0;
              height: 0;
              border-style: solid;
              border-width: 6px 6px 6px 0;
              border-color: transparent #f9f9f9 transparent transparent;
            }
            
            .activity-title-text {
              font-size: 15px;
              font-weight: 600;
              color: var(--bTitleColor, #333);
              margin: 0 0 6px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              line-height: 1.4;
            }
            
            .activity-summary {
              font-size: 13px;
              color: #666;
              margin: 0 0 10px;
              line-height: 1.5;
              overflow: hidden;
              text-overflow: ellipsis;
              display: -webkit-box;
              -webkit-line-clamp: 2;
              -webkit-box-orient: vertical;
              word-break: break-word;
            }
            
            .activity-meta {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 8px;
              
              .meta-item {
                display: flex;
                align-items: center;
                font-size: 12px;
                
                .meta-key {
                  color: #999;
                  margin-right: 4px;
                }
                
                .meta-value {
                  color: #666;
                  font-weight: 500;
                }
              }
            }
            
            .activity-user {
              display: flex;
              align-items: center;
              
              .user-avatar {
                width: 20px;
                height: 20px;
                border-radius: 50%;
                background-color: #1677ff;
                color: white;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 12px;
                font-weight: 600;
                margin-right: 6px;
              }
              
              .user-name {
                font-size: 12px;
                color: #666;
                font-weight: 500;
              }
            }
          }
        }
        
        // 不同活动类型的样式
        &.activity-post {
          .timeline-icon .dot {
            background-color: #1677ff;
          }
          
          .timeline-body {
            border-left: 2px solid #1677ff;
          }
        }
        
        &.activity-comment {
          .timeline-icon .dot {
            background-color: #52c41a;
          }
          
          .timeline-body {
            border-left: 2px solid #52c41a;
          }
        }
        
        &.activity-system {
          .timeline-icon .dot {
            background-color: #faad14;
          }
          
          .timeline-body {
            border-left: 2px solid #faad14;
          }
        }
      }
      
      .empty-state {
        padding: 40px 0;
        text-align: center;
        
        .empty-icon {
          width: 60px;
          height: 60px;
          margin: 0 auto 16px;
          background-color: #f5f5f5;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          
          &::before {
            content: '!';
            font-size: 30px;
            color: #ccc;
          }
        }
        
        .empty-text {
          color: #999;
          font-size: 14px;
        }
      }
      
      .load-more {
        text-align: center;
        margin-top: 10px;
        
        .load-more-btn {
          background: transparent;
          border: 1px solid #e8e8e8;
          padding: 6px 16px;
          border-radius: 16px;
          font-size: 13px;
          color: #666;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          transition: all 0.3s;
          
          &:hover {
            border-color: #1677ff;
            color: #1677ff;
          }
          
          .btn-text {
            margin-right: 4px;
          }
          
          .btn-icon {
            display: inline-block;
            width: 12px;
            height: 12px;
            position: relative;
            
            &::before {
              content: '';
              position: absolute;
              left: 50%;
              top: 0;
              width: 2px;
              height: 8px;
              background-color: currentColor;
              transform: translateX(-50%);
            }
            
            &::after {
              content: '';
              position: absolute;
              left: 50%;
              top: 6px;
              width: 6px;
              height: 6px;
              border-right: 2px solid currentColor;
              border-bottom: 2px solid currentColor;
              transform: translateX(-50%) rotate(45deg);
            }
          }
        }
      }
    }
  }
  
  /* 动画样式 */
  .animate-item {
    animation: fadeSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(10px);
  }
  
  @keyframes fadeSlideIn {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style> 