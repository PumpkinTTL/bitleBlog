<template>
    <div class="tags-page">
        <div class="page-header animate-item">
            <h1 class="page-title">标签<span class="highlight">云</span></h1>
            <p class="page-subtitle" v-if="!activeTag">发现各种主题的精彩内容</p>
            <p class="page-subtitle" v-else>当前标签：{{ activeTag }} ({{ tagArticlesCount }}篇文章)</p>
        </div>

        <div class="tags-container" v-if="!activeTag">
            <div class="tags-cloud">
                <router-link v-for="(tag, index) in allTags" :key="index" :to="`/tags/${tag.slug}`"
                    class="tag-item animate-item" :class="getTagSizeClass(tag.count)" :style="{ 
            '--tag-color': tag.color,
            'animation-delay': `${0.03 * (index % 20)}s`
          }">
                    {{ tag.name }}
                    <span class="tag-count">{{ tag.count }}</span>
                </router-link>
            </div>
        </div>

        <div class="tag-articles" v-else>
            <div class="tag-header">
                <div class="tag-info">
                    <div class="tag-badge" :style="{ backgroundColor: activeTagColor }">
                        {{ activeTag }}
                    </div>
                    <div class="tag-controls">
                        <el-button size="small" @click="$router.push('/tags')">
                            <el-icon>
                                <Back />
                            </el-icon>返回所有标签
                        </el-button>
                    </div>
                </div>
            </div>

            <div class="articles-list" v-if="tagArticles.length">
                <div v-for="(article, index) in tagArticles" :key="index" class="article-card animate-item"
                    :style="{ 'animation-delay': `${0.05 * (index + 1)}s` }"
                    @click="$router.push(`/blogDetail/${article.id}`)">
                    <div class="article-image" v-if="article.cover">
                        <img :src="article.cover" :alt="article.title" loading="lazy">
                    </div>
                    <div class="article-content">
                        <h3 class="article-title">{{ article.title }}</h3>
                        <p class="article-excerpt">{{ article.description }}</p>
                        <div class="article-meta">
                            <span class="meta-item">
                                <el-icon>
                                    <Calendar />
                                </el-icon>
                                {{ article.date }}
                            </span>
                            <span class="meta-item">
                                <el-icon>
                                    <View />
                                </el-icon>
                                {{ article.views }}
                            </span>
                            <span class="meta-item">
                                <el-icon>
                                    <ChatRound />
                                </el-icon>
                                {{ article.comments }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="empty-state" v-else>
                <el-empty description="暂无相关文章" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Back, Calendar, View, ChatRound } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

// 获取路由参数
const activeTag = computed(() => route.params.slug);

// 示例标签数据
const allTags = ref([
  { name: 'JavaScript', count: 145, slug: 'javascript', color: '#faad14' },
  { name: 'Vue.js', count: 128, slug: 'vuejs', color: '#52c41a' },
  { name: 'React', count: 112, slug: 'react', color: '#1890ff' },
  { name: 'Node.js', count: 89, slug: 'nodejs', color: '#13c2c2' },
  { name: 'CSS', count: 82, slug: 'css', color: '#722ed1' },
  { name: 'TypeScript', count: 76, slug: 'typescript', color: '#eb2f96' },
  { name: 'Python', count: 71, slug: 'python', color: '#fa8c16' },
  { name: '后端', count: 65, slug: 'backend', color: '#a0d911' },
  { name: '前端', count: 118, slug: 'frontend', color: '#1677ff' },
  { name: '数据库', count: 48, slug: 'database', color: '#9254de' },
  { name: 'AI', count: 42, slug: 'ai', color: '#f759ab' },
  { name: '工具', count: 38, slug: 'tools', color: '#fa541c' },
  { name: '编程语言', count: 34, slug: 'programming-languages', color: '#36cfc9' },
  { name: '教程', count: 29, slug: 'tutorials', color: '#597ef7' },
  { name: '开源', count: 27, slug: 'open-source', color: '#ff4d4f' },
  { name: 'HTML5', count: 62, slug: 'html5', color: '#ff7a45' },
  { name: 'Web开发', count: 74, slug: 'web-development', color: '#73d13d' },
  { name: '移动开发', count: 58, slug: 'mobile-development', color: '#ffa940' },
  { name: '设计模式', count: 41, slug: 'design-patterns', color: '#9254de' },
  { name: '算法', count: 39, slug: 'algorithms', color: '#ff4d4f' },
  { name: '测试', count: 36, slug: 'testing', color: '#40a9ff' },
  { name: 'Docker', count: 31, slug: 'docker', color: '#1890ff' },
  { name: 'Git', count: 53, slug: 'git', color: '#fa541c' },
  { name: '性能优化', count: 47, slug: 'performance', color: '#52c41a' },
  { name: '安全', count: 35, slug: 'security', color: '#f759ab' }
]);

// 示例文章数据
const tagArticles = ref([
  {
    id: 1,
    title: '深入理解JavaScript原型链',
    description: '本文详细解析JavaScript原型链的工作机制，以及如何利用原型链实现继承和代码复用。',
    date: '2023-12-15',
    views: 3245,
    comments: 48,
    cover: 'https://img.fenxmi.com/zb_users/upload/2023/04/202304291682764258140464.jpg'
  },
  {
    id: 2,
    title: 'ES6+新特性全面指南',
    description: '全面介绍ES6及更高版本中的新特性，包括箭头函数、解构赋值、Promise、async/await等。',
    date: '2023-11-28',
    views: 2890,
    comments: 36,
    cover: 'https://img.fenxmi.com/zb_users/upload/2024/04/202404291714403600329325.jpg'
  },
  {
    id: 3,
    title: 'JavaScript异步编程最佳实践',
    description: '探讨JavaScript中异步编程的各种模式和技巧，帮助你写出更优雅、更可维护的异步代码。',
    date: '2023-10-15',
    views: 2156,
    comments: 29,
    cover: 'https://img.fenxmi.com/zb_users/upload/2024/03/202403071709798193101533.webp'
  },
  {
    id: 4,
    title: '深入浅出JavaScript闭包',
    description: '通过简单易懂的例子和图解，帮助你理解JavaScript闭包的概念和应用场景。',
    date: '2023-09-22',
    views: 1987,
    comments: 26,
    cover: ''
  },
  {
    id: 5,
    title: 'JavaScript设计模式实战指南',
    description: '结合实际项目案例，介绍JavaScript中常用的设计模式，以及如何在项目中应用这些模式。',
    date: '2023-08-10',
    views: 1845,
    comments: 21,
    cover: 'https://www.freedidi.com/wp-content/uploads/2025/05/fafdefb96d20250508230405.webp'
  }
]);

// 当前激活标签的文章数量
const tagArticlesCount = computed(() => {
  const tag = allTags.value.find(t => t.slug === activeTag.value);
  return tag ? tag.count : 0;
});

// 当前激活标签的颜色
const activeTagColor = computed(() => {
  const tag = allTags.value.find(t => t.slug === activeTag.value);
  return tag ? tag.color : '#1890ff';
});

// 根据标签文章数量确定标签大小
const getTagSizeClass = (count) => {
  if (count >= 100) {
    return 'tag-size-xlarge';
  } else if (count >= 80) {
    return 'tag-size-large';
  } else if (count >= 50) {
    return 'tag-size-medium';
  } else if (count >= 30) {
    return 'tag-size-small';
  } else {
    return 'tag-size-xsmall';
  }
};

// 监听路由变化，加载对应标签的文章
watch(() => route.params.slug, (newSlug) => {
  if (newSlug) {
    // 这里可以添加获取特定标签文章的API调用
    console.log(`加载标签 ${newSlug} 的文章`);
  }
});

onMounted(() => {
  // 页面加载时的初始化操作
  if (activeTag.value) {
    // 加载特定标签的文章
    console.log(`初始加载标签 ${activeTag.value} 的文章`);
  }
});
</script>

<style scoped lang="less">
.tags-page {
  min-height: 100vh;
  padding: 20px 0 40px;
  max-width: 1200px;
  margin: 0 auto;
  
  .page-header {
    text-align: center;
    margin-bottom: 30px;
    padding: 0 16px;
    
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
  
  .tags-container {
    padding: 0 16px;
    
    .tags-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      justify-content: center;
      background-color: #fff;
      border-radius: 12px;
      padding: 30px;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
      
      .tag-item {
        display: inline-flex;
        align-items: center;
        padding: 5px 12px;
        border-radius: 16px;
        color: white;
        text-decoration: none;
        font-weight: 500;
        background-color: var(--tag-color, #1890ff);
        transition: all 0.2s ease;
        position: relative;
        overflow: hidden;
        
        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.1);
          transform: translateX(-100%);
          transition: transform 0.3s ease;
        }
        
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 3px 6px rgba(0, 0, 0, 0.1);
          
          &::before {
            transform: translateX(0);
          }
        }
        
        .tag-count {
          margin-left: 6px;
          font-size: 0.85em;
          opacity: 0.8;
          background: rgba(0, 0, 0, 0.15);
          padding: 1px 6px;
          border-radius: 10px;
        }
        
        &.tag-size-xlarge {
          font-size: 18px;
          padding: 6px 16px;
        }
        
        &.tag-size-large {
          font-size: 16px;
          padding: 5px 14px;
        }
        
        &.tag-size-medium {
          font-size: 14px;
          padding: 4px 12px;
        }
        
        &.tag-size-small {
          font-size: 13px;
          padding: 3px 10px;
        }
        
        &.tag-size-xsmall {
          font-size: 12px;
          padding: 2px 8px;
        }
      }
    }
  }
  
  .tag-articles {
    padding: 0 16px;
    
    .tag-header {
      margin-bottom: 20px;
      
      .tag-info {
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 15px;
        
        .tag-badge {
          display: inline-block;
          padding: 6px 16px;
          border-radius: 20px;
          color: white;
          font-weight: 600;
          font-size: 16px;
        }
      }
    }
    
    .articles-list {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
      gap: 20px;
      
      @media (max-width: 767px) {
        grid-template-columns: 1fr;
      }
      
      .article-card {
        background-color: #fff;
        border-radius: 12px;
        overflow: hidden;
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        cursor: pointer;
        
        &:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
        }
        
        .article-image {
          height: 180px;
          overflow: hidden;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.5s ease;
          }
          
          &:hover img {
            transform: scale(1.05);
          }
        }
        
        .article-content {
          padding: 16px;
          
          .article-title {
            font-size: 18px;
            font-weight: 600;
            color: var(--bTitleColor, #333);
            margin: 0 0 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
          }
          
          .article-excerpt {
            font-size: 14px;
            color: var(--bDescColor, #666);
            margin: 0 0 15px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
          }
          
          .article-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 12px;
            font-size: 13px;
            color: #999;
            
            .meta-item {
              display: flex;
              align-items: center;
              gap: 4px;
              
              .el-icon {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
    
    .empty-state {
      padding: 40px 0;
      text-align: center;
    }
  }
  
  /* 动画样式 */
  .animate-item {
    animation: smoothIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
    transform: translateY(20px);
  }
  
  @keyframes smoothIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
}
</style> 