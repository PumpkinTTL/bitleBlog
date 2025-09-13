<template>
  <div class="article-comments animate__animated animate__fadeIn">
    <div class="section-header animate__animated animate__fadeInUp" style="animation-delay: 0.1s;">
      <div class="section-title animate__animated animate__fadeInLeft" style="animation-delay: 0.2s;">
        <i class="fas fa-comments"></i>
        <span>文章评论</span>
        <span class="comment-count animate__animated animate__bounceIn" style="animation-delay: 0.4s;">({{ comments.length }})</span>
      </div>
      <div class="comment-sort animate__animated animate__fadeInRight" style="animation-delay: 0.3s;">
        <a-dropdown :trigger="['click']">
          <a class="sort-button" @click.prevent>
            <span>{{ sortText }}</span>
            <i class="fas fa-sort"></i>
          </a>
          <template #overlay>
            <a-menu @click="handleSortChange">
              <a-menu-item key="newest">最新</a-menu-item>
              <a-menu-item key="oldest">最早</a-menu-item>
              <a-menu-item key="popular">最热</a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
    
    <!-- 评论输入框 -->
    <div class="comment-form animate__animated animate__fadeInUp" style="animation-delay: 0.5s;">
      <a-form :model="commentForm" @finish="submitComment">
        <div class="form-header animate__animated animate__fadeInLeft" style="animation-delay: 0.6s;">
          <a-avatar :size="40" :src="currentUser.avatar" class="animate__animated animate__zoomIn" style="animation-delay: 0.7s;" />
          <div class="user-info">
            <div class="user-name animate__animated animate__fadeInUp" style="animation-delay: 0.8s;">{{ currentUser.username || '登录后发表评论' }}</div>
            <div class="login-prompt animate__animated animate__fadeInUp" style="animation-delay: 0.9s;" v-if="!currentUser.username">
              <a @click="handleLogin">登录</a> 或
              <a @click="handleRegister">注册</a>
            </div>
          </div>
        </div>
        
        <a-form-item>
          <a-textarea 
            v-model:value="commentForm.content" 
            placeholder="写下你的评论..." 
            :rows="4" 
            :disabled="!currentUser.username"
          />
        </a-form-item>
        
        <div class="form-actions">
          <a-button 
            type="primary" 
            html-type="submit" 
            :disabled="!currentUser.username || !commentForm.content"
          >
            发表评论
          </a-button>
        </div>
      </a-form>
    </div>
    
    <!-- 评论列表 -->
    <div class="comments-container">
      <div v-if="comments.length === 0" class="empty-comments">
        <div class="empty-icon">
          <i class="fas fa-comments"></i>
        </div>
        <div class="empty-text">暂无评论，成为第一个评论的人吧！</div>
      </div>
      
      <div v-else class="comment-list">
        <div
          v-for="(comment, index) in displayedComments"
          :key="comment.id"
          class="comment-item animate__animated animate__fadeInUp"
          :class="{'highlighted': comment.highlighted}"
          :style="`animation-delay: ${index * 0.1}s;`"
        >
          <div class="comment-avatar">
            <a-avatar :size="44" :src="comment.author.avatar" />
          </div>
          
          <div class="comment-content">
            <div class="comment-header">
              <div class="comment-author">
                <span class="author-name" :class="getAuthorClass(comment.author)">
                  {{ comment.author.username }}
                  <i v-if="isAuthorVerified(comment.author)" class="fas fa-check-circle verified-icon"></i>
                </span>
                <span class="author-badge" v-if="comment.author.badge">{{ comment.author.badge }}</span>
              </div>
              
              <div class="comment-meta">
                <span class="comment-time">{{ formatDate(comment.created_at) }}</span>
                <span class="comment-floor">#{{ comments.length - index }}</span>
              </div>
            </div>
            
            <div class="comment-body">
              <div class="comment-text" v-html="processCommentText(comment.content)"></div>
              
              <div class="comment-actions">
                <div class="action-item" @click="handleLikeComment(comment)">
                  <i class="fas" :class="[comment.isLiked ? 'fa-thumbs-up' : 'fa-thumbs-up', comment.isLiked ? 'liked' : '']"></i>
                  <span>{{ comment.likes || 0 }}</span>
                </div>
                
                <div class="action-item" @click="handleReplyComment(comment)">
                  <i class="fas fa-reply"></i>
                  <span>回复</span>
                </div>
                
                <div class="action-item" v-if="canDeleteComment(comment)">
                  <i class="fas fa-trash-alt"></i>
                  <span>删除</span>
                </div>
              </div>
            </div>
            
            <!-- 回复列表 -->
            <div class="reply-list" v-if="comment.replies && comment.replies.length > 0">
              <div 
                v-for="reply in comment.replies" 
                :key="reply.id" 
                class="reply-item"
              >
                <div class="reply-avatar">
                  <a-avatar :size="32" :src="reply.author.avatar" />
                </div>
                
                <div class="reply-content">
                  <div class="reply-header">
                    <div class="reply-author">
                      <span class="author-name" :class="getAuthorClass(reply.author)">
                        {{ reply.author.username }}
                      </span>
                      <span class="reply-to" v-if="reply.reply_to">
                        回复 <span class="reply-to-name">@{{ reply.reply_to }}</span>
                      </span>
                    </div>
                    
                    <div class="reply-meta">
                      <span class="reply-time">{{ formatDate(reply.created_at) }}</span>
                    </div>
                  </div>
                  
                  <div class="reply-body">
                    <div class="reply-text">{{ reply.content }}</div>
                    
                    <div class="reply-actions">
                      <div class="action-item" @click="handleLikeReply(reply)">
                        <i class="fas" :class="[reply.isLiked ? 'fa-thumbs-up' : 'fa-thumbs-up', reply.isLiked ? 'liked' : '']"></i>
                        <span>{{ reply.likes || 0 }}</span>
                      </div>
                      
                      <div class="action-item" @click="handleReplyToReply(comment.id, reply)">
                        <i class="fas fa-reply"></i>
                        <span>回复</span>
                      </div>
                    </div>
                  </div>
                  
                  <!-- 嵌套回复 -->
                  <div class="nested-replies" v-if="reply.childReplies && reply.childReplies.length > 0 && reply.showChildReplies">
                    <div 
                      v-for="childReply in reply.childReplies" 
                      :key="childReply.id" 
                      class="nested-reply-item"
                    >
                      <div class="reply-avatar">
                        <a-avatar :size="28" :src="childReply.author.avatar" />
                      </div>
                      
                      <div class="reply-content">
                        <div class="reply-header">
                          <div class="reply-author">
                            <span class="author-name" :class="getAuthorClass(childReply.author)">
                              {{ childReply.author.username }}
                            </span>
                            <span class="reply-to" v-if="childReply.reply_to">
                              回复 <span class="reply-to-name">@{{ childReply.reply_to }}</span>
                            </span>
                          </div>
                          
                          <div class="reply-meta">
                            <span class="reply-time">{{ formatDate(childReply.created_at) }}</span>
                          </div>
                        </div>
                        
                        <div class="reply-body">
                          <div class="reply-text">{{ childReply.content }}</div>
                          
                          <div class="reply-actions">
                            <div class="action-item" @click="handleLikeReply(childReply)">
                              <i class="fas" :class="[childReply.isLiked ? 'fa-thumbs-up' : 'fa-thumbs-up', childReply.isLiked ? 'liked' : '']"></i>
                              <span>{{ childReply.likes || 0 }}</span>
                            </div>
                            
                            <div class="action-item" @click="handleReplyToReply(comment.id, childReply)">
                              <i class="fas fa-reply"></i>
                              <span>回复</span>
                            </div>
                          </div>
                        </div>
                        
                        <!-- 如果还有更深层的嵌套回复，可以在这里递归 -->
                        <!-- 实际项目中需要限制嵌套深度，避免性能问题 -->
                      </div>
                    </div>
                    
                    <!-- 子回复加载更多按钮 -->
                    <div class="load-more-replies" v-if="reply.hasMoreReplies">
                      <a-button type="link" size="small" :loading="reply.loadingChildReplies" @click="loadMoreNestedReplies(comment.id, reply)">
                        加载更多回复 <i class="fas fa-angle-down"></i>
                      </a-button>
                    </div>
                  </div>
                  
                  <!-- 展开/收起嵌套回复按钮 -->
                  <div class="toggle-nested-replies" v-if="reply.childReplies && reply.childReplies.length > 0">
                    <a-button type="link" size="small" @click="toggleNestedReplies(reply)">
                      <template v-if="!reply.showChildReplies">
                        查看 {{ reply.childReplies.length }} 条回复 <i class="fas fa-angle-down"></i>
                      </template>
                      <template v-else>
                        收起回复 <i class="fas fa-angle-up"></i>
                      </template>
                    </a-button>
                  </div>
                  
                  <!-- 加载嵌套回复按钮 -->
                  <div class="load-nested-replies" v-else-if="reply.hasMoreReplies && !reply.childReplies">
                    <a-button type="link" size="small" :loading="reply.loadingChildReplies" @click="loadNestedReplies(comment.id, reply)">
                      查看回复 <i class="fas fa-angle-down"></i>
                    </a-button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- 回复输入框 -->
            <div class="reply-form" v-if="replyingTo === comment.id">
              <a-form :model="replyForm" @finish="submitReply(comment.id)">
                <a-form-item>
                  <a-textarea 
                    v-model:value="replyForm.content" 
                    placeholder="回复评论..." 
                    :rows="2"
                    :disabled="!currentUser.username"
                  />
                </a-form-item>
                
                <div class="form-actions">
                  <a-button type="default" size="small" @click="cancelReply">取消</a-button>
                  <a-button 
                    type="primary" 
                    size="small" 
                    html-type="submit"
                    :disabled="!currentUser.username || !replyForm.content"
                  >
                    回复
                  </a-button>
                </div>
              </a-form>
            </div>
          </div>
        </div>
      </div>
      
      <!-- 加载更多按钮 -->
      <div class="load-more" v-if="comments.length > displayLimit">
        <a-button type="link" @click="loadMoreComments">
          <template v-if="displayLimit < comments.length">
            查看更多评论 ({{ comments.length - displayLimit }}条) <i class="fas fa-angle-down"></i>
          </template>
          <template v-else>
            收起评论 <i class="fas fa-angle-up"></i>
          </template>
        </a-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, ref, computed } from 'vue';
import { message } from 'ant-design-vue';

// 定义评论类型
interface CommentAuthor {
  id: number;
  username: string;
  avatar?: string;
  badge?: string;
  roles?: any[];
  isVerified?: boolean;
}

interface Reply {
  id: number;
  content: string;
  created_at: string;
  author: CommentAuthor;
  reply_to?: string;
  likes?: number;
  isLiked?: boolean;
  hasMoreReplies?: boolean; // 是否有更多回复
  childReplies?: Reply[]; // 子回复数组
  showChildReplies?: boolean; // 是否显示子回复
  loadingChildReplies?: boolean; // 是否正在加载子回复
}

interface Comment {
  id: number;
  content: string;
  created_at: string;
  author: CommentAuthor;
  replies?: Reply[];
  likes?: number;
  isLiked?: boolean;
  highlighted?: boolean;
}

// 定义属性
const props = defineProps<{
  articleId: number;
  comments: Comment[];
}>();

// 定义事件
const emit = defineEmits(['login', 'register', 'comment-added', 'reply-added']);

// 状态变量
const commentForm = ref({
  content: ''
});

const replyForm = ref({
  content: '',
  replyToUsername: ''
});

const sortBy = ref('newest'); // 排序方式：newest, oldest, popular
const displayLimit = ref(5); // 默认显示的评论数量
const replyingTo = ref<number | null>(null);

// 模拟当前用户信息
const currentUser = ref({
  id: 0,
  username: '',
  avatar: 'https://gravatar.com/avatar/default?s=200&d=mp'
});

// 计算属性：排序文本
const sortText = computed(() => {
  switch (sortBy.value) {
    case 'newest': return '最新';
    case 'oldest': return '最早';
    case 'popular': return '最热';
    default: return '最新';
  }
});

// 计算属性：排序后的评论列表
const sortedComments = computed(() => {
  const sorted = [...props.comments];
  
  switch (sortBy.value) {
    case 'newest':
      return sorted.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    case 'popular':
      return sorted.sort((a, b) => (b.likes || 0) - (a.likes || 0));
    default:
      return sorted;
  }
});

// 计算属性：显示的评论列表
const displayedComments = computed(() => {
  return sortedComments.value.slice(0, displayLimit.value > sortedComments.value.length ? sortedComments.value.length : displayLimit.value);
});

// 格式化日期
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffSeconds < 60) {
    return '刚刚';
  } else if (diffSeconds < 3600) {
    return Math.floor(diffSeconds / 60) + '分钟前';
  } else if (diffSeconds < 86400) {
    return Math.floor(diffSeconds / 3600) + '小时前';
  } else if (diffSeconds < 604800) {
    return Math.floor(diffSeconds / 86400) + '天前';
  } else {
    return date.toISOString().split('T')[0]; // YYYY-MM-DD
  }
};

// 处理评论文本，将@用户名高亮显示
const processCommentText = (text: string): string => {
  // 将 @username 替换为带有样式的HTML
  return text.replace(/@(\w+)/g, '<span class="mention">@$1</span>');
};

// 获取作者的样式类
const getAuthorClass = (author: CommentAuthor): string => {
  if (!author) return '';
  
  // 如果有roles数组，则查找show_weight最高的角色
  if (author.roles && author.roles.length > 0) {
    // 按show_weight降序排序
    const sortedRoles = [...author.roles].sort((a, b) => b.show_weight - a.show_weight);
    const highestRole = sortedRoles[0];
    
    // 根据最高权重角色名称返回对应的样式
    const roleName = highestRole.name.toLowerCase();
    
    // 角色名称与样式对应关系
    if (roleName.includes('超级管理员')) return 'text-super-admin';
    if (roleName.includes('管理员')) return 'text-admin';
    if (roleName.includes('超级会员')) return 'text-member-crown';
    if (roleName.includes('金牌会员') || roleName.includes('黄金会员')) return 'text-member-gold';
    if (roleName.includes('铂金会员')) return 'text-member-platinum';
    if (roleName.includes('钻石会员')) return 'text-member-diamond';
    if (roleName.includes('白银会员') || roleName.includes('银牌会员')) return 'text-member-silver';
    if (roleName.includes('青铜会员') || roleName.includes('铜牌会员')) return 'text-member-bronze';
    if (roleName.includes('会员')) return 'text-member-basic';
  }
  
  // 回退到ID逻辑
  const id = author.id || 0;
  if (id % 5 === 0) return 'text-member-gold';
  if (id % 4 === 0) return 'text-member-diamond';
  if (id % 3 === 0) return 'text-member-platinum';
  if (id % 2 === 0) return 'text-member-silver';
  return '';
};

// 检查作者是否已认证
const isAuthorVerified = (author: CommentAuthor): boolean => {
  return author.isVerified || false;
};

// 检查是否可以删除评论
const canDeleteComment = (comment: Comment): boolean => {
  // 当前用户是评论作者或管理员
  return currentUser.value.id === comment.author.id;
};

// 处理排序改变
const handleSortChange = (e: any) => {
  sortBy.value = e.key;
};

// 提交评论
const submitComment = () => {
  if (!currentUser.value.username) {
    message.warning('请先登录');
    return;
  }
  
  if (!commentForm.value.content.trim()) {
    message.warning('评论内容不能为空');
    return;
  }
  
  // 这里应该调用API提交评论
  message.success('评论提交成功');
  
  // 模拟添加评论
  const newComment = {
    id: Date.now(),
    content: commentForm.value.content,
    created_at: new Date().toISOString(),
    author: {
      id: currentUser.value.id,
      username: currentUser.value.username,
      avatar: currentUser.value.avatar
    },
    replies: [],
    likes: 0,
    isLiked: false,
    highlighted: true
  };
  
  emit('comment-added', newComment);
  
  // 重置表单
  commentForm.value.content = '';
};

// 处理评论点赞
const handleLikeComment = (comment: Comment) => {
  if (!currentUser.value.username) {
    message.warning('请先登录');
    return;
  }
  
  // 模拟点赞
  comment.isLiked = !comment.isLiked;
  comment.likes = (comment.likes || 0) + (comment.isLiked ? 1 : -1);
  
  message.success(comment.isLiked ? '点赞成功' : '取消点赞');
};

// 处理回复评论
const handleReplyComment = (comment: Comment) => {
  if (!currentUser.value.username) {
    message.warning('请先登录');
    return;
  }
  
  // 设置当前正在回复的评论ID
  replyingTo.value = comment.id;
  replyForm.value.replyToUsername = '';
  replyForm.value.content = '';
};

// 处理回复的点赞
const handleLikeReply = (reply: Reply) => {
  if (!currentUser.value.username) {
    message.warning('请先登录');
    return;
  }
  
  // 模拟点赞
  reply.isLiked = !reply.isLiked;
  reply.likes = (reply.likes || 0) + (reply.isLiked ? 1 : -1);
  
  message.success(reply.isLiked ? '点赞成功' : '取消点赞');
};

// 处理回复中的回复
const handleReplyToReply = (commentId: number, reply: Reply) => {
  if (!currentUser.value.username) {
    message.warning('请先登录');
    return;
  }
  
  // 设置当前正在回复的评论ID和用户名
  replyingTo.value = commentId;
  replyForm.value.replyToUsername = reply.author.username;
  replyForm.value.content = `@${reply.author.username} `;
};

// 提交回复
const submitReply = (commentId: number) => {
  if (!currentUser.value.username) {
    message.warning('请先登录');
    return;
  }
  
  if (!replyForm.value.content.trim()) {
    message.warning('回复内容不能为空');
    return;
  }
  
  // 这里应该调用API提交回复
  message.success('回复提交成功');
  
  // 构造回复对象
  const newReply = {
    id: Date.now(),
    content: replyForm.value.content,
    created_at: new Date().toISOString(),
    author: {
      id: currentUser.value.id,
      username: currentUser.value.username,
      avatar: currentUser.value.avatar
    },
    reply_to: replyForm.value.replyToUsername || undefined,
    likes: 0,
    isLiked: false
  };
  
  // 发送回复添加事件
  emit('reply-added', { commentId, reply: newReply });
  
  // 重置表单并关闭回复框
  replyForm.value.content = '';
  replyForm.value.replyToUsername = '';
  replyingTo.value = null;
};

// 取消回复
const cancelReply = () => {
  replyingTo.value = null;
  replyForm.value.content = '';
  replyForm.value.replyToUsername = '';
};

// 加载更多评论
const loadMoreComments = () => {
  if (displayLimit.value < props.comments.length) {
    displayLimit.value = props.comments.length;
  } else {
    displayLimit.value = 5;
  }
};

// 登录/注册处理
const handleLogin = () => {
  emit('login');
};

const handleRegister = () => {
  emit('register');
};

// 切换显示/隐藏嵌套回复
const toggleNestedReplies = (reply: Reply) => {
  reply.showChildReplies = !reply.showChildReplies;
};

// 加载嵌套回复
const loadNestedReplies = async (commentId: number, reply: Reply) => {
  if (!reply.childReplies) {
    reply.childReplies = [];
  }
  
  if (reply.loadingChildReplies) return;
  
  reply.loadingChildReplies = true;
  
  try {
    // 这里应该调用API获取嵌套回复
    // const response = await api.getNestedReplies(reply.id);
    // reply.childReplies = response.data;
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    reply.childReplies = [
      {
        id: Date.now() + 1,
        content: `这是回复 ${reply.id} 的嵌套回复 1`,
        created_at: new Date().toISOString(),
        author: {
          id: 1001,
          username: '嵌套用户1',
          avatar: 'https://gravatar.com/avatar/1001?s=200&d=mp'
        },
        reply_to: reply.author.username,
        likes: 3,
        isLiked: false
      },
      {
        id: Date.now() + 2,
        content: `这是回复 ${reply.id} 的嵌套回复 2`,
        created_at: new Date().toISOString(),
        author: {
          id: 1002,
          username: '嵌套用户2',
          avatar: 'https://gravatar.com/avatar/1002?s=200&d=mp'
        },
        reply_to: reply.author.username,
        likes: 1,
        isLiked: false,
        hasMoreReplies: true // 示例：这个嵌套回复还有更深层的回复
      }
    ];
    
    // 模拟是否还有更多回复
    reply.hasMoreReplies = reply.id % 2 === 0;
    reply.showChildReplies = true;
    
  } catch (error) {
    console.error('加载嵌套回复失败:', error);
    message.error('加载嵌套回复失败，请稍后重试');
  } finally {
    reply.loadingChildReplies = false;
  }
};

// 加载更多嵌套回复
const loadMoreNestedReplies = async (commentId: number, reply: Reply) => {
  if (reply.loadingChildReplies) return;
  
  reply.loadingChildReplies = true;
  
  try {
    // 这里应该调用API获取更多嵌套回复
    // const response = await api.getMoreNestedReplies(reply.id, reply.childReplies.length);
    // const moreReplies = response.data;
    // reply.childReplies = [...reply.childReplies, ...moreReplies];
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // 模拟数据
    const moreReplies = [
      {
        id: Date.now() + 3,
        content: `这是加载的更多嵌套回复 1`,
        created_at: new Date().toISOString(),
        author: {
          id: 1003,
          username: '更多嵌套用户1',
          avatar: 'https://gravatar.com/avatar/1003?s=200&d=mp'
        },
        reply_to: reply.author.username,
        likes: 0,
        isLiked: false
      },
      {
        id: Date.now() + 4,
        content: `这是加载的更多嵌套回复 2`,
        created_at: new Date().toISOString(),
        author: {
          id: 1004,
          username: '更多嵌套用户2',
          avatar: 'https://gravatar.com/avatar/1004?s=200&d=mp'
        },
        reply_to: '嵌套用户1', // 回复嵌套用户1
        likes: 2,
        isLiked: false
      }
    ];
    
    if (reply.childReplies) {
      reply.childReplies = [...reply.childReplies, ...moreReplies];
    } else {
      reply.childReplies = moreReplies;
    }
    
    // 示例：如果加载了足够多的回复，就没有更多了
    if (reply.childReplies && reply.childReplies.length >= 4) {
      reply.hasMoreReplies = false;
    }
    
  } catch (error) {
    console.error('加载更多嵌套回复失败:', error);
    message.error('加载更多嵌套回复失败，请稍后重试');
  } finally {
    reply.loadingChildReplies = false;
  }
};
</script>

<style lang="less" scoped>
.article-comments {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 1px solid #eaecef;
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    
    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      display: flex;
      align-items: center;
      gap: 10px;

      i {
        font-size: 16px;
        color: var(--el-color-primary);
        width: 32px;
        height: 32px;
        background: var(--el-color-primary-light-9);
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .comment-count {
        font-size: 14px;
        font-weight: normal;
        color: var(--el-text-color-regular);
      }
    }
    
    .comment-sort {
      .sort-button {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        color: var(--el-text-color-regular);
        cursor: pointer;
        padding: 4px 8px;
        border-radius: 4px;
        transition: all 0.3s ease;

        &:hover {
          background: var(--el-color-primary-light-9);
          color: var(--el-color-primary);
        }
        
        i {
          font-size: 12px;
        }
      }
    }
  }
  
  .comment-form {
    margin-bottom: 30px;
    background: var(--el-fill-color-lighter);
    border-radius: 8px;
    padding: 16px;
    
    .form-header {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 12px;
      
      .user-info {
        display: flex;
        flex-direction: column;
        
        .user-name {
          font-size: 15px;
          font-weight: 500;
          color: var(--el-text-color-primary);
        }

        .login-prompt {
          font-size: 13px;
          color: var(--el-text-color-regular);

          a {
            color: var(--el-color-primary);
            cursor: pointer;

            &:hover {
              text-decoration: underline;
            }
          }
        }
      }
    }
    
    :deep(.ant-form-item) {
      margin-bottom: 12px;
    }
    
    .form-actions {
      display: flex;
      justify-content: flex-end;
    }
  }
  
  .comments-container {
    .empty-comments {
      padding: 40px 0;
      text-align: center;
      background: var(--el-fill-color-lighter);
      border-radius: 8px;
      
      .empty-icon {
        font-size: 36px;
        color: var(--el-text-color-placeholder);
        margin-bottom: 15px;
      }

      .empty-text {
        font-size: 15px;
        color: var(--el-text-color-regular);
      }
    }
    
    .comment-list {
      display: flex;
      flex-direction: column;
      gap: 20px;
      
      .comment-item {
        display: flex;
        gap: 16px;
        padding: 16px;
        border-radius: 8px;
        background: var(--el-bg-color);
        border: 1px solid var(--el-border-color-lighter);
        transition: all 0.3s ease;

        &.highlighted {
          background: var(--el-color-primary-light-9);
          border-color: var(--el-color-primary-light-7);
          box-shadow: 0 2px 8px var(--el-color-primary-light-8);
          
          &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 0;
            height: 100%;
            width: 3px;
            background: var(--el-color-primary);
            border-radius: 3px 0 0 3px;
          }
        }
        
        &:hover {
          box-shadow: 0 3px 10px rgba(0, 0, 0, 0.05);
          border-color: #e6f0ff;
        }
        
        .comment-avatar {
          flex-shrink: 0;
        }
        
        .comment-content {
          flex: 1;
          min-width: 0;
          
          .comment-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            
            .comment-author {
              display: flex;
              align-items: center;
              gap: 8px;
              
              .author-name {
                font-size: 15px;
                font-weight: 600;
                color: var(--el-text-color-primary);
                display: flex;
                align-items: center;
                gap: 4px;

                .verified-icon {
                  font-size: 12px;
                  color: var(--el-color-primary);
                }
                
                &.text-member-gold {
                  background: linear-gradient(45deg, #FFD700, #FFA500);
                  -webkit-background-clip: text;
                  background-clip: text;
                  color: transparent;
                  font-weight: 700;
                }
                
                &.text-super-admin {
                  background: linear-gradient(45deg, #8E44AD, #9B59B6);
                  -webkit-background-clip: text;
                  background-clip: text;
                  color: transparent;
                  font-weight: 700;
                }
              }
              
              .author-badge {
                padding: 2px 6px;
                background: var(--el-color-primary-light-9);
                color: var(--el-color-primary);
                border-radius: 4px;
                font-size: 12px;
              }
            }
            
            .comment-meta {
              display: flex;
              align-items: center;
              gap: 12px;
              font-size: 13px;
              color: var(--el-text-color-placeholder);
              
              .comment-floor {
                background: var(--el-fill-color-light);
                padding: 2px 6px;
                border-radius: 4px;
              }
            }
          }
          
          .comment-body {
            .comment-text {
              font-size: 14px;
              line-height: 1.6;
              color: var(--el-text-color-primary);
              margin-bottom: 12px;

              :deep(.mention) {
                color: var(--el-color-primary);
                font-weight: 500;
              }
            }
            
            .comment-actions {
              display: flex;
              gap: 16px;
              margin-bottom: 16px;
              
              .action-item {
                display: flex;
                align-items: center;
                gap: 6px;
                font-size: 13px;
                color: var(--el-text-color-regular);
                cursor: pointer;

                &:hover {
                  color: var(--el-color-primary);
                }

                i {
                  font-size: 14px;

                  &.liked {
                    color: var(--el-color-primary);
                  }
                }
              }
            }
          }
          
          .reply-list {
            padding: 12px;
            background: var(--el-fill-color-lighter);
            border-radius: 8px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-bottom: 16px;
            border: 1px solid var(--el-border-color-lighter);
            
            .reply-item {
              display: flex;
              gap: 12px;
              
              .reply-avatar {
                flex-shrink: 0;
              }
              
              .reply-content {
                flex: 1;
                min-width: 0;
                
                .reply-header {
                  display: flex;
                  justify-content: space-between;
                  align-items: flex-start;
                  margin-bottom: 6px;
                  
                  .reply-author {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 14px;
                    
                    .author-name {
                      font-weight: 600;
                      color: #1e293b;
                      
                      &.text-member-gold {
                        background: linear-gradient(45deg, #FFD700, #FFA500);
                        -webkit-background-clip: text;
                        background-clip: text;
                        color: transparent;
                      }
                    }
                    
                    .reply-to {
                      color: #64748b;
                      
                      .reply-to-name {
                        color: #1677FF;
                      }
                    }
                  }
                  
                  .reply-meta {
                    font-size: 12px;
                    color: #94a3b8;
                  }
                }
                
                .reply-body {
                  .reply-text {
                    font-size: 14px;
                    line-height: 1.6;
                    color: #334155;
                    margin-bottom: 8px;
                  }
                  
                  .reply-actions {
                    display: flex;
                    gap: 12px;
                    
                    .action-item {
                      display: flex;
                      align-items: center;
                      gap: 4px;
                      font-size: 12px;
                      color: #64748b;
                      cursor: pointer;
                      
                      &:hover {
                        color: #1677FF;
                      }
                      
                      i {
                        font-size: 12px;
                        
                        &.liked {
                          color: #1677FF;
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          
          .reply-form {
            padding: 12px;
            background: var(--el-fill-color-lighter);
            border-radius: 8px;
            border: 1px solid var(--el-border-color-lighter);
            
            .form-actions {
              display: flex;
              justify-content: flex-end;
              gap: 8px;
            }
          }
        }
      }
    }
    
    .load-more {
      text-align: center;
      margin-top: 20px;
      
      button {
        color: #1677FF;
        
        i {
          margin-left: 4px;
          transition: transform 0.3s ease;
        }
        
        &:hover i {
          transform: translateY(2px);
        }
      }
    }
  }
}

.nested-replies {
  margin-top: 10px;
  padding: 8px;
  background: rgba(248, 250, 252, 0.6);
  border-radius: 6px;
  border-left: 2px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  .nested-reply-item {
    display: flex;
    gap: 8px;
    
    .reply-avatar {
      flex-shrink: 0;
    }
    
    .reply-content {
      flex: 1;
      min-width: 0;
      
      .reply-header {
        margin-bottom: 4px;
        
        .author-name {
          font-size: 13px;
        }
        
        .reply-meta {
          font-size: 11px;
        }
      }
      
      .reply-body {
        .reply-text {
          font-size: 13px;
          margin-bottom: 6px;
        }
        
        .reply-actions {
          .action-item {
            font-size: 11px;
            
            i {
              font-size: 11px;
            }
          }
        }
      }
    }
  }
  
  .load-more-replies {
    text-align: center;
    margin-top: 6px;
    
    button {
      font-size: 12px;
      height: 24px;
      padding: 0 6px;
    }
  }
}

.toggle-nested-replies, .load-nested-replies {
  margin-top: 6px;
  
  button {
    font-size: 12px;
    height: 24px;
    padding: 0 6px;
    color: #64748b;
    
    &:hover {
      color: #1677FF;
    }
    
    i {
      margin-left: 4px;
      transition: transform 0.3s ease;
    }
    
    &:hover i {
      transform: translateY(2px);
    }
  }
}
</style> 