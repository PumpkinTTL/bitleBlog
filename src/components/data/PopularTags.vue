<template>
  <div class="popular-tags">
    <h3 class="tags-title">
      <i class="tags-icon"></i>
      热门标签
      <span class="tags-subtitle">关注度最高的博客标签</span>
    </h3>
    
    <div class="tags-content">
      <!-- 搜索框 -->
      <div class="tags-search">
        <input 
          type="text" 
          placeholder="搜索标签..." 
          v-model="searchQuery"
          class="search-input"
        />
        <button class="search-button">
          <span class="search-icon"></span>
        </button>
      </div>
      
      <!-- 标签统计信息 -->
      <div class="tags-summary animate-item" style="animation-delay: 0.1s">
        <div class="summary-item">
          <div class="summary-value">{{ tags.length }}</div>
          <div class="summary-label">总标签</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">{{ totalTaggings }}</div>
          <div class="summary-label">总使用次数</div>
        </div>
        <div class="summary-item">
          <div class="summary-value">{{ avgUsage }}</div>
          <div class="summary-label">平均使用</div>
        </div>
      </div>
      
      <!-- 标签云 -->
      <div class="tags-cloud">
        <div 
          v-for="(tag, index) in filteredTags" 
          :key="tag.id"
          class="tag-item"
          :style="{
            '--tag-color': tag.color,
            '--tag-size': getTagSize(tag.count),
            '--tag-animdelay': `${0.05 * (index + 1)}s`
          }"
          @click="selectTag(tag)"
          @mouseenter="hoverTag(tag)"
          @mouseleave="leaveTag"
        >
          {{ tag.name }}
          <span class="tag-count">{{ tag.count }}</span>
        </div>
      </div>
      
      <!-- 选中标签的详情 -->
      <div class="selected-tag" v-if="selectedTag" :style="{ 'border-color': selectedTag.color }">
        <div class="tag-details">
          <div class="tag-header" :style="{ 'background-color': selectedTag.color }">
            <span class="tag-name">{{ selectedTag.name }}</span>
            <button class="close-button" @click="closeDetails">✕</button>
          </div>
          <div class="tag-stats">
            <div class="stat-item">
              <div class="stat-name">使用次数</div>
              <div class="stat-value">{{ selectedTag.count }}</div>
            </div>
            <div class="stat-item">
              <div class="stat-name">相关性</div>
              <div class="stat-value">{{ Math.round(selectedTag.count / maxCount * 100) }}%</div>
            </div>
            <div class="stat-item">
              <div class="stat-name">创建时间</div>
              <div class="stat-value">{{ selectedTag.created }}</div>
            </div>
          </div>
          <div class="tag-description">
            {{ selectedTag.description }}
          </div>
          <div class="tag-related">
            <div class="related-title">相关标签</div>
            <div class="related-tags">
              <a 
                v-for="related in selectedTag.related" 
                :key="related.id"
                class="related-tag"
                :style="{ 'border-color': related.color }"
                @click.stop="selectTag(getTagById(related.id))"
              >
                {{ related.name }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';

// 标签数据
const tags = ref([
  {
    id: 1,
    name: 'JavaScript',
    count: 345,
    color: '#f7df1e',
    created: '2021-03-15',
    description: 'JavaScript是一种高级的、解释型的编程语言，是一门基于原型、函数先行的语言，是一门多范式的语言，它支持面向对象编程，命令式编程，以及函数式编程。',
    related: [
      { id: 2, name: 'TypeScript', color: '#007acc' },
      { id: 3, name: 'Vue', color: '#42b883' },
      { id: 4, name: 'React', color: '#61dafb' }
    ]
  },
  {
    id: 2,
    name: 'TypeScript',
    count: 278,
    color: '#007acc',
    created: '2021-04-22',
    description: 'TypeScript是JavaScript的一个超集，扩展了JavaScript的语法，添加了静态类型检查，增强了代码的可维护性。',
    related: [
      { id: 1, name: 'JavaScript', color: '#f7df1e' },
      { id: 4, name: 'React', color: '#61dafb' },
      { id: 7, name: 'Angular', color: '#dd0031' }
    ]
  },
  {
    id: 3,
    name: 'Vue',
    count: 312,
    color: '#42b883',
    created: '2021-02-10',
    description: 'Vue是一套用于构建用户界面的渐进式框架，与其它大型框架不同的是，Vue 被设计为可以自底向上逐层应用。',
    related: [
      { id: 1, name: 'JavaScript', color: '#f7df1e' },
      { id: 5, name: 'Vuex', color: '#42b883' },
      { id: 8, name: 'Webpack', color: '#8dd6f9' }
    ]
  },
  {
    id: 4,
    name: 'React',
    count: 298,
    color: '#61dafb',
    created: '2021-03-05',
    description: 'React是一个用于构建用户界面的JavaScript库，主要用于构建UI，很多人认为 React 是 MVC 中的 V（视图）。',
    related: [
      { id: 1, name: 'JavaScript', color: '#f7df1e' },
      { id: 2, name: 'TypeScript', color: '#007acc' },
      { id: 6, name: 'Redux', color: '#764abc' }
    ]
  },
  {
    id: 5,
    name: 'Vuex',
    count: 186,
    color: '#42b883',
    created: '2021-05-18',
    description: 'Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。它采用集中式存储管理应用的所有组件的状态。',
    related: [
      { id: 3, name: 'Vue', color: '#42b883' },
      { id: 9, name: 'Pinia', color: '#ffd859' }
    ]
  },
  {
    id: 6,
    name: 'Redux',
    count: 165,
    color: '#764abc',
    created: '2021-06-02',
    description: 'Redux 是 JavaScript 状态容器，提供可预测化的状态管理。可以让你构建一致化的应用，运行于不同的环境，并且易于测试。',
    related: [
      { id: 4, name: 'React', color: '#61dafb' },
      { id: 10, name: 'MobX', color: '#ff9955' }
    ]
  },
  {
    id: 7,
    name: 'Angular',
    count: 203,
    color: '#dd0031',
    created: '2021-04-12',
    description: 'Angular 是一个由Google维护的开源JavaScript框架，可用来轻松构建Web、移动或桌面应用程序。',
    related: [
      { id: 2, name: 'TypeScript', color: '#007acc' },
      { id: 11, name: 'RxJS', color: '#d81b60' }
    ]
  },
  {
    id: 8,
    name: 'Webpack',
    count: 237,
    color: '#8dd6f9',
    created: '2021-03-25',
    description: 'Webpack 是一个现代 JavaScript 应用程序的静态模块打包器，它会递归地构建一个依赖关系图，然后将所有这些模块打包成一个或多个 bundle。',
    related: [
      { id: 12, name: 'Babel', color: '#f5da55' },
      { id: 13, name: 'Vite', color: '#646cff' }
    ]
  },
  {
    id: 9,
    name: 'Pinia',
    count: 124,
    color: '#ffd859',
    created: '2022-01-15',
    description: 'Pinia 是 Vue 的存储库，它允许您跨组件/页面共享状态，是 Vuex 的替代品。',
    related: [
      { id: 3, name: 'Vue', color: '#42b883' },
      { id: 5, name: 'Vuex', color: '#42b883' }
    ]
  },
  {
    id: 10,
    name: 'MobX',
    count: 97,
    color: '#ff9955',
    created: '2021-07-03',
    description: 'MobX 是一个身经百战的库，它通过运用透明的函数响应式编程使状态管理变得简单和可扩展。',
    related: [
      { id: 4, name: 'React', color: '#61dafb' },
      { id: 6, name: 'Redux', color: '#764abc' }
    ]
  },
  {
    id: 11,
    name: 'RxJS',
    count: 145,
    color: '#d81b60',
    created: '2021-05-27',
    description: 'RxJS 是使用 Observables 的响应式编程的库，它使编写异步或基于回调的代码更容易。',
    related: [
      { id: 7, name: 'Angular', color: '#dd0031' }
    ]
  },
  {
    id: 12,
    name: 'Babel',
    count: 189,
    color: '#f5da55',
    created: '2021-04-08',
    description: 'Babel 是一个 JavaScript 编译器，主要用于将 ECMAScript 2015+ 版本的代码转换为向后兼容的 JavaScript 语法。',
    related: [
      { id: 8, name: 'Webpack', color: '#8dd6f9' }
    ]
  },
  {
    id: 13,
    name: 'Vite',
    count: 156,
    color: '#646cff',
    created: '2022-02-10',
    description: 'Vite 是一种新型前端构建工具，能够显著提升前端开发体验。它由两部分组成：一个开发服务器和一套构建指令。',
    related: [
      { id: 8, name: 'Webpack', color: '#8dd6f9' },
      { id: 3, name: 'Vue', color: '#42b883' }
    ]
  },
  {
    id: 14,
    name: 'Node.js',
    count: 275,
    color: '#68a063',
    created: '2021-03-01',
    description: 'Node.js 是一个基于 Chrome V8 引擎的 JavaScript 运行时环境，可以在服务器端运行 JavaScript 代码。',
    related: [
      { id: 15, name: 'Express', color: '#000000' },
      { id: 1, name: 'JavaScript', color: '#f7df1e' }
    ]
  },
  {
    id: 15,
    name: 'Express',
    count: 212,
    color: '#000000',
    created: '2021-03-18',
    description: 'Express 是一个简洁而灵活的 Node.js Web 应用框架，提供了一系列强大特性帮助你创建各种 Web 应用。',
    related: [
      { id: 14, name: 'Node.js', color: '#68a063' }
    ]
  },
  {
    id: 16,
    name: 'Docker',
    count: 198,
    color: '#2496ed',
    created: '2021-06-15',
    description: 'Docker 是一个开源的应用容器引擎，开发者可以将他们的应用以及依赖包打包到一个轻量级、可移植的容器中。',
    related: [
      { id: 17, name: 'Kubernetes', color: '#326ce5' }
    ]
  },
  {
    id: 17,
    name: 'Kubernetes',
    count: 167,
    color: '#326ce5',
    created: '2021-07-22',
    description: 'Kubernetes 是一个开源的容器编排平台，用于自动化容器化应用程序的部署、扩展和管理。',
    related: [
      { id: 16, name: 'Docker', color: '#2496ed' }
    ]
  },
  {
    id: 18,
    name: 'GraphQL',
    count: 178,
    color: '#e535ab',
    created: '2021-08-05',
    description: 'GraphQL 是一种用于 API 的查询语言，并且是一个使用你的现有数据来完成这些查询的运行时。',
    related: [
      { id: 19, name: 'Apollo', color: '#311c87' },
      { id: 4, name: 'React', color: '#61dafb' }
    ]
  },
  {
    id: 19,
    name: 'Apollo',
    count: 134,
    color: '#311c87',
    created: '2021-09-14',
    description: 'Apollo 是一个用于构建 GraphQL 应用的全栈平台，它提供了客户端和服务器端的解决方案。',
    related: [
      { id: 18, name: 'GraphQL', color: '#e535ab' }
    ]
  },
  {
    id: 20,
    name: 'Git',
    count: 289,
    color: '#f05032',
    created: '2021-02-28',
    description: 'Git 是一个分布式版本控制系统，用于跟踪文件的变化，多人协作开发项目时可以共同维护源代码。',
    related: [
      { id: 21, name: 'GitHub', color: '#181717' }
    ]
  },
]);

// 搜索框内容
const searchQuery = ref('');

// 当前选中的标签
const selectedTag = ref(null);

// 计算最大使用次数
const maxCount = computed(() => {
  return Math.max(...tags.value.map(tag => tag.count));
});

// 计算总使用次数
const totalTaggings = computed(() => {
  return tags.value.reduce((sum, tag) => sum + tag.count, 0);
});

// 计算平均使用次数
const avgUsage = computed(() => {
  return Math.round(totalTaggings.value / tags.value.length);
});

// 根据搜索过滤标签
const filteredTags = computed(() => {
  if (!searchQuery.value) {
    return tags.value;
  }
  
  const query = searchQuery.value.toLowerCase();
  return tags.value.filter(tag => 
    tag.name.toLowerCase().includes(query)
  );
});

// 根据标签使用次数计算显示大小
const getTagSize = (count) => {
  // 将计数映射到1-2.2之间的值
  const normalized = 1 + (count / maxCount.value) * 1.2;
  return normalized + 'em';
};

// 根据ID获取标签数据
const getTagById = (id) => {
  return tags.value.find(tag => tag.id === id);
};

// 选中标签
const selectTag = (tag) => {
  selectedTag.value = tag;
};

// 鼠标悬停标签
const hoverTag = (tag) => {
  // 可以添加悬停效果
};

// 鼠标离开标签
const leaveTag = () => {
  // 可以移除悬停效果
};

// 关闭标签详情
const closeDetails = () => {
  selectedTag.value = null;
};

// 监听搜索，自动关闭详情面板
watch(searchQuery, () => {
  selectedTag.value = null;
});
</script>

<style scoped lang="less">
.popular-tags {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  .tags-title {
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
    
    .tags-subtitle {
      font-size: 12px;
      color: #aaa;
      font-weight: normal;
      margin-left: 8px;
    }
  }
  
  .tags-content {
    position: relative;
    
    .tags-search {
      margin-bottom: 15px;
      display: flex;
      
      .search-input {
        flex: 1;
        padding: 8px 12px;
        border: 1px solid #e8e8e8;
        border-radius: 4px 0 0 4px;
        font-size: 14px;
        outline: none;
        transition: border-color 0.3s;
        
        &:focus {
          border-color: var(--bPrimaryColor, #1890ff);
        }
      }
      
      .search-button {
        background-color: var(--bPrimaryColor, #1890ff);
        color: white;
        border: none;
        border-radius: 0 4px 4px 0;
        padding: 0 12px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        
        .search-icon {
          display: inline-block;
          width: 14px;
          height: 14px;
          position: relative;
          
          &::before {
            content: '';
            position: absolute;
            width: 10px;
            height: 10px;
            border: 2px solid white;
            border-radius: 50%;
            left: 0;
            top: 0;
          }
          
          &::after {
            content: '';
            position: absolute;
            width: 2px;
            height: 6px;
            background: white;
            transform: rotate(-45deg);
            right: 0;
            bottom: 0;
          }
        }
      }
    }
    
    .tags-summary {
      display: flex;
      margin-bottom: 20px;
      border-radius: 6px;
      background-color: #f7f9fc;
      padding: 10px;
      
      .summary-item {
        flex: 1;
        text-align: center;
        padding: 5px 10px;
        position: relative;
        
        &:not(:last-child)::after {
          content: '';
          position: absolute;
          right: 0;
          top: 25%;
          height: 50%;
          width: 1px;
          background-color: #e0e0e0;
        }
        
        .summary-value {
          font-size: 18px;
          font-weight: 600;
          color: var(--bPrimaryColor, #1890ff);
        }
        
        .summary-label {
          font-size: 12px;
          color: #888;
          margin-top: 2px;
        }
      }
    }
    
    .tags-cloud {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-bottom: 20px;
      
      .tag-item {
        display: inline-flex;
        align-items: center;
        padding: 4px 10px;
        border-radius: 15px;
        background-color: white;
        border: 1px solid #e8e8e8;
        font-size: var(--tag-size, 1em);
        cursor: pointer;
        color: #555;
        position: relative;
        overflow: hidden;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        animation: tagPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        animation-delay: var(--tag-animdelay, 0s);
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 3px;
          background-color: var(--tag-color, #1890ff);
        }
        
        &:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          transform: translateY(-2px);
        }
        
        .tag-count {
          font-size: 0.75em;
          background-color: var(--tag-color, #1890ff);
          color: white;
          border-radius: 10px;
          padding: 1px 6px;
          margin-left: 6px;
        }
      }
    }
    
    .selected-tag {
      margin-top: 20px;
      border: 2px solid var(--bPrimaryColor, #1890ff);
      border-radius: 8px;
      overflow: hidden;
      animation: slideUp 0.3s ease forwards;
      
      .tag-details {
        background-color: white;
        
        .tag-header {
          background-color: var(--bPrimaryColor, #1890ff);
          color: white;
          padding: 10px 15px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          
          .tag-name {
            font-size: 16px;
            font-weight: 600;
          }
          
          .close-button {
            border: none;
            background: transparent;
            color: white;
            cursor: pointer;
            font-size: 16px;
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            
            &:hover {
              background-color: rgba(255, 255, 255, 0.2);
            }
          }
        }
        
        .tag-stats {
          display: flex;
          padding: 12px 15px;
          border-bottom: 1px solid #f0f0f0;
          
          .stat-item {
            flex: 1;
            text-align: center;
            
            .stat-name {
              font-size: 12px;
              color: #888;
              margin-bottom: 4px;
            }
            
            .stat-value {
              font-size: 16px;
              font-weight: 600;
              color: #333;
            }
          }
        }
        
        .tag-description {
          padding: 15px;
          color: #666;
          line-height: 1.6;
          font-size: 14px;
          border-bottom: 1px solid #f0f0f0;
        }
        
        .tag-related {
          padding: 15px;
          
          .related-title {
            font-size: 14px;
            font-weight: 600;
            color: #333;
            margin-bottom: 10px;
          }
          
          .related-tags {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            
            .related-tag {
              display: inline-block;
              padding: 3px 8px;
              border-radius: 4px;
              font-size: 12px;
              border: 1px solid #e8e8e8;
              cursor: pointer;
              
              &:hover {
                background-color: #f7f7f7;
              }
            }
          }
        }
      }
    }
  }
  
  .animate-item {
    animation: smoothIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }
  
  @keyframes smoothIn {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  @keyframes tagPop {
    0% {
      opacity: 0;
      transform: scale(0.8);
    }
    70% {
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes slideUp {
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