# TechToolsRecommend 插槽使用示例

## 1. 默认使用（图标）

```vue
<template>
  <TechToolsRecommend />
</template>
```

## 2. 使用图片替换图标

```vue
<template>
  <TechToolsRecommend :custom-tools="toolsWithImages">
    <template #icon="{ tool }">
      <img :src="tool.image" :alt="tool.name" />
    </template>
  </TechToolsRecommend>
</template>

<script setup>
const toolsWithImages = [
  {
    id: 1,
    name: 'VS Code',
    description: '强大的代码编辑器',
    image: '/images/vscode.png', // 图片路径
    color: 'linear-gradient(135deg, #007ACC, #005A9E)',
    type: 'free',
    rating: 4.9,
    url: 'https://code.visualstudio.com',
    category: 'frontend'
  }
];
</script>
```

## 3. 混合使用图标和图片

```vue
<template>
  <TechToolsRecommend :custom-tools="mixedTools">
    <template #icon="{ tool }">
      <!-- 如果有图片就显示图片，否则显示图标 -->
      <img v-if="tool.image" :src="tool.image" :alt="tool.name" />
      <i v-else :class="tool.icon"></i>
    </template>
  </TechToolsRecommend>
</template>
```

## 4. 使用自定义 div 元素

```vue
<template>
  <TechToolsRecommend :custom-tools="customTools">
    <template #icon="{ tool }">
      <div class="custom-icon" :style="{ background: tool.gradient }">
        {{ tool.shortName }}
      </div>
    </template>
  </TechToolsRecommend>
</template>

<style scoped>
.custom-icon {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  font-weight: bold;
  color: white;
  border-radius: 6px;
}
</style>
```

## 5. 商品推荐示例

```vue
<template>
  <TechToolsRecommend 
    section-title="精选商品"
    section-subtitle="优质商品推荐"
    section-icon="fas fa-shopping-cart"
    :custom-tools="products"
  >
    <template #icon="{ tool }">
      <!-- 商品可以使用图片或图标 -->
      <img v-if="tool.productImage" :src="tool.productImage" :alt="tool.name" />
      <div v-else class="product-icon">
        <i :class="tool.icon"></i>
        <span class="price">{{ tool.price }}</span>
      </div>
    </template>
  </TechToolsRecommend>
</template>

<script setup>
const products = [
  {
    id: 1,
    name: '联通流量卡',
    description: '大流量不限速，全国通用',
    icon: 'fas fa-sim-card',
    productImage: '/images/unicom-card.jpg', // 商品图片
    color: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
    type: 'paid',
    rating: 4.8,
    url: 'https://example.com/unicom-card',
    category: 'telecom',
    price: '¥19/月'
  }
];
</script>

<style scoped>
.product-icon {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.price {
  position: absolute;
  bottom: -2px;
  right: -2px;
  font-size: 6px;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  padding: 1px 2px;
  border-radius: 2px;
}
</style>
```

## 6. 带徽章的图标

```vue
<template>
  <TechToolsRecommend :custom-tools="toolsWithBadge">
    <template #icon="{ tool }">
      <div class="icon-with-badge">
        <i :class="tool.icon"></i>
        <span v-if="tool.badge" class="badge">{{ tool.badge }}</span>
      </div>
    </template>
  </TechToolsRecommend>
</template>

<style scoped>
.icon-with-badge {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #ff4757;
  color: white;
  font-size: 6px;
  padding: 1px 3px;
  border-radius: 8px;
  min-width: 8px;
  text-align: center;
}
</style>
```

## 插槽参数说明

插槽接收一个 `tool` 参数，包含当前工具/商品的所有信息：

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
  // 自定义字段
  image?: string;
  productImage?: string;
  price?: string;
  badge?: string;
  shortName?: string;
  // ... 其他自定义字段
}
```

## 样式约束

插槽内容会被限制在 28x28px 的容器内：

- 图片会自动适配容器大小（object-fit: cover）
- 自定义元素的最大宽高为 100%
- 容器有 6px 的圆角和轻微阴影
- 支持 overflow: hidden

## 最佳实践

1. **图片优化**：使用适当尺寸的图片（建议 56x56px 或更高分辨率）
2. **备用方案**：为图片提供图标备用方案
3. **一致性**：保持同一组件内图标风格的一致性
4. **可访问性**：为图片添加 alt 属性
5. **性能**：避免在插槽中使用过于复杂的元素
