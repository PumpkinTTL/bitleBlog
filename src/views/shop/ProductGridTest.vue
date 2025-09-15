<template>
  <div class="product-grid-test">
    <div class="container">
      <h2 class="page-title">商品展示网格测试</h2>
      
      <el-row :gutter="20">
        <el-col
          v-for="product in products"
          :key="product.id"
          :xs="24"
          :sm="12"
          :md="8"
          :lg="6"
          :xl="6"
          class="product-col"
        >
          <ProductCard
            :product="product"
            :animation-delay="50"
            @product-click="handleProductClick"
            @primary-action="handlePrimaryAction"
            @favorite="handleFavorite"
          />
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import ProductCard from '@/components/shop/ProductCard.vue'
import { ElRow, ElCol, ElMessage } from 'element-plus'

// 测试数据
const products = reactive([
  {
    id: 1,
    name: 'MacBook Pro 2024',
    description: '强劲性能，卓越体验',
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=300&fit=crop',
    price: 19999,
    originalPrice: 22999,
    unit: '台',
    rating: 4.8,
    category: '电脑',
    featured: true,
    discount: 13
  },
  {
    id: 2,
    name: 'iPhone 15 Pro',
    description: '钛金属设计，专业摄影',
    image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=300&fit=crop',
    price: 8999,
    originalPrice: 9999,
    unit: '台',
    rating: 4.9,
    category: '手机',
    featured: false,
    discount: 10
  },
  {
    id: 3,
    name: 'AirPods Pro',
    description: '主动降噪，完美音质',
    image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=300&fit=crop',
    price: 1999,
    unit: '副',
    rating: 4.7,
    category: '音频',
    featured: true
  },
  {
    id: 4,
    name: 'iPad Air',
    description: '轻薄便携，创作利器',
    image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400&h=300&fit=crop',
    price: 4399,
    originalPrice: 4899,
    unit: '台',
    rating: 4.6,
    category: '平板',
    discount: 10
  },
  {
    id: 5,
    name: 'Apple Watch',
    description: '健康助手，智能体验',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=300&fit=crop',
    price: 2999,
    unit: '只',
    rating: 4.5,
    category: '智能手表',
    featured: true
  },
  {
    id: 6,
    name: 'Mac Studio',
    description: '专业性能，无限可能',
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=300&fit=crop',
    price: 'free',
    rating: 4.8,
    category: '电脑',
    featured: false
  },
  {
    id: 7,
    name: 'HomePod mini',
    description: '智能音响，全屋音乐',
    image: 'https://images.unsplash.com/photo-1589492477829-5e65395b66cc?w=400&h=300&fit=crop',
    price: 749,
    unit: '台',
    rating: 4.4,
    category: '音频'
  },
  {
    id: 8,
    name: 'Magic Keyboard',
    description: '打字体验，无线自由',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=300&fit=crop',
    price: 1099,
    unit: '个',
    rating: 4.3,
    category: '配件',
    featured: true,
    discount: 15
  }
])

// 事件处理
const handleProductClick = (product: any) => {
  console.log('点击商品:', product)
  ElMessage.info(`查看商品: ${product.name}`)
}

const handlePrimaryAction = (product: any) => {
  console.log('主要操作:', product)
  ElMessage.success(
    product.price === 'free' ? `${product.name} 下载成功！` : `${product.name} 已添加到购物车`
  )
}

const handleFavorite = (product: any, favorited: boolean) => {
  console.log('收藏操作:', product, favorited)
  ElMessage.success(favorited ? '已添加到收藏' : '已取消收藏')
}
</script>

<style lang="less" scoped>
.product-grid-test {
  min-height: 100vh;
  background: var(--el-bg-color-page);
  padding: 20px 0;
  
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 20px;
    
    .page-title {
      font-size: 24px;
      font-weight: 600;
      color: var(--el-text-color-primary);
      text-align: center;
      margin-bottom: 40px;
    }
    
    .product-col {
      margin-bottom: 20px;
    }
  }
}

// 响应式调整
@media (max-width: 768px) {
  .product-grid-test {
    padding: 15px 0;
    
    .container {
      padding: 0 15px;
      
      .page-title {
        font-size: 20px;
        margin-bottom: 30px;
      }
      
      .product-col {
        margin-bottom: 15px;
      }
    }
  }
}
</style>
