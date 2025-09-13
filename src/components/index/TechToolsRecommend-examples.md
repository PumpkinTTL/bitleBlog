# TechToolsRecommend 组件使用示例

## 基础用法（推荐）

```vue
<template>
  <TechToolsRecommend />
</template>
```

## 自定义标题和图标

```vue
<template>
  <TechToolsRecommend
    section-title="推荐资源"
    section-subtitle="精选学习资源"
    section-icon="fas fa-book"
  />
</template>
```

## 控制显示功能

```vue
<template>
  <TechToolsRecommend
    :show-categories="false"
    :show-rating="false"
    :show-more-button="false"
  />
</template>
```

## 自定义数据

```vue
<template>
  <TechToolsRecommend 
    :custom-categories="customCategories"
    :custom-tools="customTools"
    :max-items-per-category="6"
  />
</template>

<script setup>
const customCategories = [
  { id: 'ai', name: 'AI工具', icon: 'fas fa-robot' },
  { id: 'design', name: '设计', icon: 'fas fa-palette' }
];

const customTools = [
  {
    id: 1,
    name: 'ChatGPT',
    description: 'AI对话助手',
    icon: 'fas fa-comments',
    color: 'linear-gradient(135deg, #10A37F, #1A7F64)',
    type: 'free',
    rating: 4.8,
    url: 'https://chat.openai.com',
    category: 'ai'
  }
];
</script>
```

## 监听事件

```vue
<template>
  <TechToolsRecommend 
    @tool-click="handleToolClick"
    @category-change="handleCategoryChange"
    @more-click="handleMoreClick"
  />
</template>

<script setup>
const handleToolClick = (tool) => {
  console.log('点击工具:', tool);
  // 自定义处理逻辑
};

const handleCategoryChange = (categoryId) => {
  console.log('切换分类:', categoryId);
  // 统计或其他逻辑
};

const handleMoreClick = () => {
  console.log('查看更多');
  // 跳转到详情页
};
</script>
```

## 完整配置示例

```vue
<template>
  <TechToolsRecommend 
    section-title="开发工具箱"
    section-subtitle="提升开发效率的神器"
    section-icon="fas fa-toolbox"
    :show-categories="true"
    :show-rating="true"
    :show-category-tag="true"
    :show-more-button="true"
    more-button-text="探索更多工具"
    :max-items-per-category="5"
    default-category="frontend"
    card-style="gradient"
    :animation-delay="0.2"
    :custom-categories="categories"
    :custom-tools="tools"
    @tool-click="onToolClick"
    @category-change="onCategoryChange"
    @more-click="onMoreClick"
  />
</template>
```

## 主要 Props 说明

| 属性名 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| sectionTitle | String | '开发工具' | 组件标题 |
| sectionSubtitle | String | '精选开发者必备工具' | 组件副标题 |
| sectionIcon | String | 'fas fa-tools' | 标题图标 |
| showCategories | Boolean | true | 是否显示分类标签 |
| showRating | Boolean | true | 是否显示评分 |
| showMoreButton | Boolean | true | 是否显示更多按钮 |
| moreButtonText | String | '查看更多工具' | 更多按钮文本 |
| maxItemsPerCategory | Number | 4 | 每个分类最大显示数量 |
| defaultCategory | String | 'frontend' | 默认选中分类 |
| customCategories | Array | null | 自定义分类数据 |
| customTools | Array | null | 自定义工具数据 |

## 事件说明

| 事件名 | 参数 | 说明 |
|--------|------|------|
| tool-click | tool: Tool | 工具被点击时触发 |
| category-change | categoryId: string | 分类切换时触发 |
| more-click | - | 更多按钮被点击时触发 |

## 数据结构

### Tool 接口
```typescript
interface Tool {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  type: 'free' | 'paid' | 'open-source';
  rating: number;
  url: string;
  category: string;
}
```

### Category 接口
```typescript
interface Category {
  id: string;
  name: string;
  icon: string;
}
```
