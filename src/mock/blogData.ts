/**
 * 博客详情页模拟数据
 */

// 模拟文章详情数据
export const mockArticleDetail = {
  id: 1234,
  title: 'Vue3与TypeScript实战指南：打造高性能Web应用',
  subtitle: '从入门到精通的完整教程，带你掌握现代前端开发的核心技术',
  cover_image: 'https://picsum.photos/id/1/1200/630',
  publish_time: new Date().toISOString(),
  views: 8765,
  comments_count: 142,
  likes_count: 325,
  favorites_count: 187,
  read_time: 15, // 分钟
  is_top: 1,
  is_recommend: 1,
  is_original: 1,
  content: `
# Vue3与TypeScript实战指南

## 引言

在当今快速发展的前端领域，Vue3和TypeScript的结合已经成为构建现代Web应用的强大组合。本文将深入探讨如何利用Vue3的Composition API与TypeScript的类型系统，创建出高性能、可维护的前端应用。

## 为什么选择Vue3和TypeScript？

Vue3带来了许多重大改进，包括更好的性能、更小的包体积以及全新的Composition API。而TypeScript则为JavaScript增加了静态类型检查，帮助开发者在编译时发现潜在问题，提高代码质量和可维护性。

### Vue3的核心优势

- **更小的包体积**：Vue3的核心代码经过了重写，比Vue2小约41%
- **Composition API**：提供更灵活的代码组织方式，便于逻辑复用
- **更好的TypeScript支持**：Vue3是用TypeScript编写的，提供了一流的类型推断
- **Teleport、Fragments、Suspense等新特性**：解决了Vue2中的一些常见痛点

### TypeScript带来的好处

- **类型安全**：在编译时捕获类型错误，减少运行时错误
- **智能提示**：IDE可以提供更准确的代码补全和文档提示
- **更好的重构体验**：变量和函数引用可以被可靠地追踪和重命名
- **更清晰的API文档**：类型定义本身就是最好的文档

## 环境搭建

首先，让我们来设置一个Vue3+TypeScript的开发环境。使用Vue CLI是最简单的方式：

\`\`\`bash
npm install -g @vue/cli
vue create my-vue3-ts-app
\`\`\`

在项目创建过程中，选择手动设置，并确保选中了TypeScript和Vue3。

另外，我们还可以使用更现代的Vite来创建项目：

\`\`\`bash
npm create vite@latest my-vue3-ts-app -- --template vue-ts
\`\`\`

## Composition API基础

Vue3的Composition API是一种全新的组织组件逻辑的方式，它允许我们根据功能而非生命周期来组织代码，使组件的逻辑更加清晰和可复用。

### setup函数

setup函数是Composition API的入口点，它在组件被创建之前执行，比created生命周期钩子还要早。

\`\`\`typescript
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const count = ref(0);
    
    function increment() {
      count.value++;
    }
    
    return {
      count,
      increment
    };
  }
});
\`\`\`

### 响应式系统

Vue3提供了多种创建响应式状态的方法：

- **ref**：适用于基本类型
- **reactive**：适用于对象
- **computed**：创建计算属性
- **watch/watchEffect**：观察响应式状态的变化

下面是一个综合使用这些API的例子：

\`\`\`typescript
import { defineComponent, ref, reactive, computed, watch, watchEffect } from 'vue';

interface User {
  name: string;
  age: number;
}

export default defineComponent({
  setup() {
    // ref用于基本类型
    const count = ref<number>(0);
    
    // reactive用于对象
    const user = reactive<User>({
      name: 'John',
      age: 30
    });
    
    // computed计算属性
    const doubleCount = computed(() => count.value * 2);
    
    // watch观察特定响应式引用
    watch(count, (newValue, oldValue) => {
      console.log(\`Count changed from \${oldValue} to \${newValue}\`);
    });
    
    // watchEffect自动追踪依赖
    watchEffect(() => {
      console.log(\`User name is \${user.name}, age is \${user.age}\`);
      console.log(\`Count is \${count.value}\`);
    });
    
    function increment() {
      count.value++;
    }
    
    function updateUser(name: string, age: number) {
      user.name = name;
      user.age = age;
    }
    
    return {
      count,
      user,
      doubleCount,
      increment,
      updateUser
    };
  }
});
\`\`\`

## TypeScript与Vue3的结合

Vue3与TypeScript的结合非常自然，因为Vue3本身就是用TypeScript编写的。下面我们将探讨如何在Vue3组件中正确使用TypeScript。

### defineComponent

一定要使用defineComponent函数包装组件，这样TypeScript才能正确推断组件选项中的类型：

\`\`\`typescript
import { defineComponent } from 'vue';

export default defineComponent({
  // TypeScript现在可以推断出props的类型了
  props: {
    message: String,
    count: Number
  },
  setup(props) {
    // props被正确地类型化了
    const capitalized = props.message.toUpperCase();
    
    return {
      capitalized
    };
  }
});
\`\`\`

### Props类型定义

为了更精确地定义props类型，我们可以使用PropType：

\`\`\`typescript
import { defineComponent, PropType } from 'vue';

interface Todo {
  id: number;
  title: string;
  completed: boolean;
}

export default defineComponent({
  props: {
    todo: {
      type: Object as PropType<Todo>,
      required: true
    },
    todos: {
      type: Array as PropType<Todo[]>,
      default: () => []
    }
  },
  setup(props) {
    // 现在TypeScript知道props.todo是Todo类型
    console.log(props.todo.title);
    
    return {};
  }
});
\`\`\`

### 事件类型定义

对于事件，我们可以使用defineEmits和泛型来定义：

\`\`\`typescript
import { defineComponent, defineEmits } from 'vue';

export default defineComponent({
  setup(props, { emit }) {
    // 定义emit事件类型
    const emit = defineEmits<{
      (e: 'update', id: number, value: string): void;
      (e: 'delete', id: number): void;
    }>();
    
    function updateItem(id: number, value: string) {
      emit('update', id, value);
    }
    
    function deleteItem(id: number) {
      emit('delete', id);
    }
    
    return {
      updateItem,
      deleteItem
    };
  }
});
\`\`\`

## 高级特性：组件逻辑复用

Composition API的最大优势之一是能够轻松实现逻辑复用。让我们看看如何创建和使用可复用的组合式函数（Composables）。

### 创建Composable

一个用于管理计数器的组合式函数：

\`\`\`typescript
// useCounter.ts
import { ref, Ref } from 'vue';

export function useCounter(initialValue: number = 0) {
  const count: Ref<number> = ref(initialValue);
  
  function increment() {
    count.value++;
  }
  
  function decrement() {
    count.value--;
  }
  
  function reset() {
    count.value = initialValue;
  }
  
  return {
    count,
    increment,
    decrement,
    reset
  };
}
\`\`\`

### 使用Composable

现在我们可以在任何组件中轻松使用这个计数器逻辑：

\`\`\`typescript
import { defineComponent } from 'vue';
import { useCounter } from './composables/useCounter';

export default defineComponent({
  setup() {
    // 使用计数器逻辑
    const { count, increment, decrement, reset } = useCounter(10);
    
    return {
      count,
      increment,
      decrement,
      reset
    };
  }
});
\`\`\`

这种方式使得代码组织更加清晰，而且逻辑可以轻松地在不同组件之间复用。

## 性能优化技巧

Vue3已经比Vue2有了显著的性能提升，但我们仍可以通过一些技巧进一步优化应用性能。

### 1. 使用v-memo减少不必要的重渲染

\`\`\`html
<template>
  <div v-for="item in list" :key="item.id" v-memo="[item.id, item.updated]">
    {{ item.name }}
  </div>
</template>
\`\`\`

只有当item.id或item.updated变化时，才会重新渲染对应的div。

### 2. 懒加载组件

\`\`\`typescript
import { defineAsyncComponent } from 'vue';

const AsyncComponent = defineAsyncComponent(() => 
  import('./components/HeavyComponent.vue')
);
\`\`\`

### 3. 虚拟列表

对于长列表，使用虚拟滚动可以显著提高性能：

\`\`\`typescript
import { defineComponent } from 'vue';
import VirtualList from 'vue-virtual-scroll-list';

export default defineComponent({
  components: {
    VirtualList
  },
  setup() {
    const longList = Array(10000).fill(0).map((_, i) => ({
      id: i,
      text: \`Item \${i}\`
    }));
    
    return {
      longList
    };
  }
});
\`\`\`

## 最佳实践

在使用Vue3和TypeScript开发时，遵循以下最佳实践可以让你的代码更加健壮和可维护：

1. **使用script setup语法**：Vue3.2引入的script setup语法可以让组件代码更加简洁
2. **集中管理状态**：对于大型应用，使用Pinia或Vuex进行状态管理
3. **按功能组织代码**：利用Composition API按功能而非生命周期组织代码
4. **严格的TypeScript配置**：在tsconfig.json中启用strict模式
5. **使用ESLint和Prettier**：保持代码风格一致性
6. **单元测试**：使用Vitest或Jest对组件和功能进行测试

## 结语

Vue3和TypeScript的结合为前端开发带来了前所未有的开发体验和代码质量保障。通过本文介绍的各种技术和最佳实践，你应该已经掌握了使用这两种技术构建高性能、可维护Web应用的关键知识。无论是小型项目还是大型企业级应用，Vue3+TypeScript都是一个值得考虑的强大组合。

希望本文对你有所帮助，祝你在前端开发之路上取得更大的成功！
  `,
  author: {
    id: 42,
    username: '前端大师',
    avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&n=42',
    bio: '资深前端工程师，热爱分享Vue和TypeScript相关知识',
    verified: true
  },
  category: {
    id: 3,
    name: '前端开发',
    slug: 'frontend-development'
  },
  tags: [
    { id: 7, name: 'Vue.js', slug: 'vuejs' },
    { id: 8, name: 'TypeScript', slug: 'typescript' },
    { id: 9, name: '前端框架', slug: 'frontend-frameworks' },
    { id: 10, name: '性能优化', slug: 'performance-optimization' }
  ]
};

// 模拟评论数据
export const mockComments = [
  {
    id: 1,
    content: '这篇文章写得非常好，内容详实，对我很有帮助！',
    created_at: new Date(Date.now() - 3600000).toISOString(),
    author: {
      id: 101,
      username: '前端探索者',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&n=101',
      isVerified: true
    },
    likes: 12,
    replies: [
      {
        id: 11,
        content: '我也觉得很棒，尤其是关于性能优化的部分。',
        created_at: new Date(Date.now() - 1800000).toISOString(),
        author: {
          id: 102,
          username: '编程小白',
          avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&n=102'
        },
        likes: 3
      }
    ]
  },
  {
    id: 2,
    content: '文章中关于异步编程的部分解释得很清晰，但我对Promise链式调用还有些疑问，能否进一步解释一下？',
    created_at: new Date(Date.now() - 86400000).toISOString(),
    author: {
      id: 103,
      username: 'JS学习者',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&n=103',
      badge: '高级会员'
    },
    likes: 8
  },
  {
    id: 3,
    content: '非常喜欢文章中关于Composition API的讲解，比官方文档更容易理解！',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    author: {
      id: 104,
      username: 'Vue爱好者',
      avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&n=104'
    },
    likes: 15,
    replies: [
      {
        id: 31,
        content: '确实，特别是组合式函数的例子很实用。',
        created_at: new Date(Date.now() - 4 * 86400000).toISOString(),
        author: {
          id: 105,
          username: '代码艺术家',
          avatar: 'https://xsgames.co/randomusers/avatar.php?g=female&n=105'
        },
        likes: 7
      },
      {
        id: 32,
        content: '我正在将团队的项目从Vue2迁移到Vue3，这篇文章给了我很多启发。',
        created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
        author: {
          id: 106,
          username: '技术主管',
          avatar: 'https://xsgames.co/randomusers/avatar.php?g=male&n=106',
          badge: '技术专家'
        },
        likes: 9
      }
    ]
  }
];

// 模拟相关文章数据
export const mockRelatedArticles = [
  {
    id: 201,
    title: 'Vue3组合式API最佳实践',
    cover_image: 'https://picsum.photos/id/201/300/200',
    views: 1235,
    publish_time: new Date(Date.now() - 5 * 86400000).toISOString()
  },
  {
    id: 202,
    title: 'TypeScript高级类型体操实战',
    cover_image: 'https://picsum.photos/id/202/300/200',
    views: 986,
    publish_time: new Date(Date.now() - 10 * 86400000).toISOString()
  },
  {
    id: 203,
    title: '前端构建工具对比：Vite vs Webpack',
    cover_image: 'https://picsum.photos/id/203/300/200',
    views: 754,
    publish_time: new Date(Date.now() - 15 * 86400000).toISOString()
  },
  {
    id: 204,
    title: '深入理解Vue3响应式系统',
    cover_image: 'https://picsum.photos/id/204/300/200',
    views: 1302,
    publish_time: new Date(Date.now() - 8 * 86400000).toISOString()
  }
];

// 模拟热门文章数据
export const mockPopularArticles = [
  {
    id: 301,
    title: '2023前端技术趋势与未来展望',
    views: 3452,
    comments_count: 78
  },
  {
    id: 302,
    title: 'JavaScript性能优化实战指南',
    views: 2986,
    comments_count: 64
  },
  {
    id: 303,
    title: 'React Hooks最佳实践与常见陷阱',
    views: 2547,
    comments_count: 52
  },
  {
    id: 304,
    title: '现代CSS布局技巧：Grid与Flexbox实战',
    views: 2134,
    comments_count: 47
  },
  {
    id: 305,
    title: 'Node.js微服务架构设计模式',
    views: 1876,
    comments_count: 39
  }
];

// 模拟作者统计数据
export const mockAuthorStats = {
  articles: 42,
  followers: 1256,
  likes: 3689
}; 