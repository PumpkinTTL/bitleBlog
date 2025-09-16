<template>
  <div 
    class="product-card animate__animated animate__fadeIn"
    :style="animationStyle"
    @click="handleProductClick"
  >
    <!-- 商品徽章/标签 -->
    <div v-if="product.featured || product.discount || product.price === 'free'" class="product-badge" :class="badgeClass">
      <i :class="badgeIcon"></i>
      <span>{{ badgeText }}</span>
    </div>

    <!-- 商品图片区域 -->
    <div class="product-image">
      <div class="image-container">
        <div v-if="product.image" class="product-img">
          <img :src="product.image" :alt="product.name" />
        </div>
        <div v-else class="product-icon-placeholder" :style="{ background: product.gradient || '#f1f5f9' }">
          <i :class="product.icon || 'fas fa-cube'"></i>
        </div>
        
        <!-- 悬停覆盖层 -->
        <div class="product-overlay">
          <!-- 分享按钮在左上角 -->
          <button class="share-btn" @click.stop="handleShare">
            <i class="fas fa-share-alt"></i>
          </button>
          
          <!-- 主要操作按钮居中 -->
          <button class="primary-action-btn" @click.stop="handlePrimaryAction">
            <i :class="primaryActionIcon"></i>
            <span>{{ primaryActionText }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 商品信息区域 -->
    <div class="product-info">
      <!-- 商品标题 -->
      <div class="product-title">{{ product.name }}</div>
      
      <!-- 商品描述 -->
      <div class="product-description">{{ product.description }}</div>
      
      <!-- 商品特色标签 -->
      <div v-if="product.tags && product.tags.length" class="product-tags">
        <span 
          v-for="(tag, index) in displayTags" 
          :key="index" 
          class="tag-item"
          :class="getTagClass(index)"
          @click.stop="handleTagClick(tag)"
        >
          {{ tag }}
        </span>
      </div>
      
      <!-- 价格信息 -->
      <div class="product-price">
        <div class="price-main">
          <span v-if="product.price === 'free'" class="free-price">
            <i class="fas fa-gift"></i>
            免费
          </span>
          <template v-else>
            <span class="current-price">
              ¥{{ formatPrice(product.price) }}
            </span>
            <span v-if="product.unit" class="price-unit">/ {{ product.unit }}</span>
          </template>
        </div>
        <div v-if="product.originalPrice && product.price !== 'free'" class="price-original">
          <span class="original-price">¥{{ formatPrice(product.originalPrice) }}</span>
          <span v-if="product.discount" class="discount-text">省{{ product.discount }}折</span>
        </div>
      </div>
      
      <!-- 商品评分和销量 -->
      <div class="product-meta">
        <div v-if="product.rating" class="rating">
          <div class="stars">
            <i 
              v-for="star in 5" 
              :key="star" 
              class="star"
              :class="star <= Math.floor(product.rating) ? 'fas fa-star' : star <= product.rating ? 'fas fa-star-half-alt' : 'far fa-star'"
            ></i>
          </div>
          <span class="rating-text">{{ product.rating }}</span>
        </div>
        <div v-if="product.sales" class="sales">
          <i class="fas fa-shopping-cart"></i>
          <span>{{ formatNumber(product.sales) }}销量</span>
        </div>
      </div>
      
      <!-- 特性列表隐藏，保持紧凑布局 -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, defineProps, defineEmits, withDefaults } from 'vue'

// 定义商品接口
interface Product {
  id: number | string
  name: string
  description: string
  image?: string
  icon?: string
  color?: string
  gradient?: string
  price: string | number
  originalPrice?: string | number
  unit?: string
  rating?: number
  tags?: string[]
  features?: string[]
  category: string
  featured?: boolean
  discount?: number
  url?: string
  createTime?: string
  sales?: number
  popularity?: number
}

// 定义组件属性
interface Props {
  product: Product
  animationDelay?: number
  showFeatures?: boolean
  maxTags?: number
  maxFeatures?: number
}

const props = withDefaults(defineProps<Props>(), {
  animationDelay: 0,
  showFeatures: true,
  maxTags: 3,
  maxFeatures: 4
})

// 定义事件
const emit = defineEmits<{
  productClick: [product: Product]
  primaryAction: [product: Product]
  favorite: [product: Product, favorited: boolean]
  share: [product: Product]
  tagClick: [tag: string]
}>()

// 响应式状态
const isFavorited = ref(false)

// 计算属性
const animationStyle = computed(() => {
  return props.animationDelay ? { 'animation-delay': `${props.animationDelay}ms` } : {}
})

const badgeClass = computed(() => {
  if (props.product.price === 'free') return 'free-badge'
  if (props.product.featured) return 'featured-badge'
  if (props.product.discount) return 'discount-badge'
  return 'default-badge'
})

const badgeText = computed(() => {
  if (props.product.price === 'free') return '免费'
  if (props.product.featured) return '精选'
  if (props.product.discount) return `${props.product.discount}折`
  return '推荐'
})

const badgeIcon = computed(() => {
  if (props.product.price === 'free') return 'fas fa-gift'
  if (props.product.featured) return 'fas fa-crown'
  if (props.product.discount) return 'fas fa-tag'
  return 'fas fa-star'
})

const primaryActionText = computed(() => {
  return props.product.price === 'free' ? '立即下载' : '立即购买'
})

const primaryActionIcon = computed(() => {
  return props.product.price === 'free' ? 'fas fa-download' : 'fas fa-shopping-cart'
})

const displayTags = computed(() => {
  return props.product.tags?.slice(0, props.maxTags) || []
})

const displayFeatures = computed(() => {
  return props.product.features?.slice(0, props.maxFeatures) || []
})

// 工具函数
const formatPrice = (price: string | number): string => {
  if (typeof price === 'string') return price
  return price.toLocaleString()
}

const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return `${(num / 10000).toFixed(1)}万`
  }
  return num.toString()
}

const getTagClass = (index: number): string => {
  const classes = ['primary', 'success', 'warning', 'info', 'danger']
  return classes[index % classes.length]
}

// 事件处理函数
const handleProductClick = () => {
  emit('productClick', props.product)
}

const handlePrimaryAction = () => {
  emit('primaryAction', props.product)
}

const handleFavorite = () => {
  isFavorited.value = !isFavorited.value
  emit('favorite', props.product, isFavorited.value)
}

const handleShare = () => {
  emit('share', props.product)
}

const handleTagClick = (tag: string) => {
  emit('tagClick', tag)
}
</script>

<style lang="less" scoped>
.product-card {
  position: relative;
  background: var(--el-bg-color);
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.08);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid rgba(139, 92, 246, 0.1);
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 25px rgba(139, 92, 246, 0.15);
    border-color: rgba(139, 92, 246, 0.25);
    
    .product-image .product-overlay {
      opacity: 1;
      visibility: visible;
    }
    
    .product-image img {
      transform: scale(1.03);
    }
    
    .product-image .product-icon-placeholder i {
      transform: scale(1.05);
    }
  }
  
  // 商品徽章样式
  .product-badge {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 10;
    display: flex;
    align-items: center;
    gap: 4px;
    padding: 4px 8px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 500;
    transition: all 0.3s ease;
    
    &.free-badge {
      background: linear-gradient(135deg, rgba(5, 150, 105, 0.1), rgba(34, 197, 94, 0.08));
      color: #059669;
      border: 1px solid rgba(5, 150, 105, 0.15);
    }
    
    &.featured-badge {
      background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(168, 85, 247, 0.08));
      color: #8b5cf6;
      border: 1px solid rgba(139, 92, 246, 0.15);
    }
    
    &.discount-badge {
      background: linear-gradient(135deg, rgba(217, 70, 239, 0.1), rgba(236, 72, 153, 0.08));
      color: #d946ef;
      border: 1px solid rgba(217, 70, 239, 0.15);
    }
    
    &.default-badge {
      background: linear-gradient(135deg, rgba(168, 85, 247, 0.1), rgba(192, 132, 252, 0.08));
      color: #a855f7;
      border: 1px solid rgba(168, 85, 247, 0.15);
    }
  }
  
  // 商品图片区域
  .product-image {
    position: relative;
    height: 160px;
    overflow: hidden;
    
    .image-container {
      position: relative;
      width: 100%;
      height: 100%;
      
      .product-img {
        width: 100%;
        height: 100%;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
      }
      
      .product-icon-placeholder {
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f1f5f9;
        
        i {
          font-size: 32px;
          color: #64748b;
          opacity: 0.6;
          transition: all 0.3s ease;
        }
      }
    }
    
    // 悬停覆盖层 - 扁平化设计
    .product-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(15, 15, 15, 0.75);
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      visibility: hidden;
      transition: all 0.3s ease;
      
      // 分享按钮 - 在左上角
      .share-btn {
        position: absolute;
        top: 12px;
        left: 12px;
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 8px;
        background: rgba(55, 55, 58, 0.9);
        color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        border: 1px solid rgba(255, 255, 255, 0.15);
        
        i {
          font-size: 14px;
        }
        
        &:hover {
          background: rgba(139, 92, 246, 0.9);
          color: white;
          border-color: rgba(139, 92, 246, 0.5);
          transform: translateY(-1px) scale(1.05);
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
        }
      }
      
      // 主要操作按钮 - 居中（与博客详情页面保持一致）
      .primary-action-btn {
        height: 36px;
        padding: 0 18px;
        border: none;
        border-radius: 18px;
        font-weight: 500;
        font-size: 14px;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        background: linear-gradient(135deg, rgba(255, 64, 255, 0.85), rgba(128, 0, 191, 0.85));
        color: white;
        
        &:hover {
          background: linear-gradient(135deg, rgba(255, 64, 255, 1), rgba(128, 0, 191, 1));
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(128, 0, 191, 0.4);
        }
        
        &:active {
          transform: scale(0.98);
        }
      }
    }
  }
  
  // 商品信息区域
  .product-info {
    padding: 14px;
    
    .product-title {
      font-size: 14px;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 6px;
      line-height: 1.4;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 39px;
    }
    
    .product-description {
      font-size: 12px;
      color: #64748b;
      line-height: 1.4;
      margin-bottom: 10px;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
      height: 33px;
    }
    
    // 标签云
    .product-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
      margin-bottom: 12px;
      
      .tag-item {
        padding: 4px 8px;
        border-radius: 6px;
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: none;
        
        &.primary {
          background: #f1f5f9;
          color: #1677FF;
          border: 1px solid rgba(22, 119, 255, 0.15);
          
          &:hover {
            background: #e2e8f0;
            border-color: rgba(22, 119, 255, 0.25);
            transform: translateY(-1px);
          }
        }
        
        &.success {
          background: #f0fdf4;
          color: #059669;
          border: 1px solid rgba(5, 150, 105, 0.15);
          
          &:hover {
            background: #dcfce7;
            border-color: rgba(5, 150, 105, 0.25);
            transform: translateY(-1px);
          }
        }
        
        &.warning {
          background: #fffbeb;
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.15);
          
          &:hover {
            background: #fef3c7;
            border-color: rgba(245, 158, 11, 0.25);
            transform: translateY(-1px);
          }
        }
        
        &.info {
          background: #f0f9ff;
          color: #06b6d4;
          border: 1px solid rgba(6, 182, 212, 0.15);
          
          &:hover {
            background: #e0f2fe;
            border-color: rgba(6, 182, 212, 0.25);
            transform: translateY(-1px);
          }
        }
        
        &.danger {
          background: #fef2f2;
          color: #ef4444;
          border: 1px solid rgba(239, 68, 68, 0.15);
          
          &:hover {
            background: #fee2e2;
            border-color: rgba(239, 68, 68, 0.25);
            transform: translateY(-1px);
          }
        }
        
        &:hover {
          transform: translateY(-1px);
        }
      }
    }
    
    // 价格信息
    .product-price {
      margin-bottom: 12px;
      
      .price-main {
        display: flex;
        align-items: baseline;
        gap: 4px;
        margin-bottom: 4px;
        
        .free-price {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 16px;
          font-weight: 600;
          color: #059669;
          
          i {
            font-size: 14px;
          }
        }
        
        .current-price {
          font-size: 16px;
          font-weight: 600;
          color: #e65100;
          background: linear-gradient(135deg, #e65100 0%, #ff8a65 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
        }
        
        .price-unit {
          font-size: 12px;
          color: #64748b;
          font-weight: 500;
          margin-left: 2px;
        }
      }
      
      .price-original {
        display: flex;
        align-items: center;
        gap: 8px;
        
        .original-price {
          font-size: 14px;
          color: var(--el-text-color-placeholder);
          text-decoration: line-through;
        }
        
        .discount-text {
          font-size: 12px;
          color: #e65100;
          font-weight: 600;
          background: linear-gradient(135deg, #e65100 0%, #ff8a65 100%);
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      }
    }
    
    // 评分和销量
    .product-meta {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-bottom: 0;
      
      .rating {
        display: flex;
        align-items: center;
        gap: 6px;
        
        .stars {
          display: flex;
          gap: 1px;
          
          .star {
            font-size: 12px;
            
            &.fas.fa-star {
              color: #fbbf24;
            }
            
            &.fas.fa-star-half-alt {
              color: #fbbf24;
            }
            
            &.far.fa-star {
              color: #e2e8f0;
            }
          }
        }
        
        .rating-text {
          font-size: 12px;
          font-weight: 600;
          color: #64748b;
        }
      }
      
      .sales {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 11px;
        color: #94a3b8;
        
        i {
          font-size: 10px;
        }
      }
    }
    
    // 特性列表
    .product-features {
      .features-title {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 8px;
        
        i {
          color: var(--el-color-primary);
          font-size: 12px;
        }
      }
      
      .features-list {
        list-style: none;
        padding: 0;
        margin: 0;
        
        li {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 0;
          font-size: 13px;
          color: var(--el-text-color-regular);
          
          i {
            color: #22c55e;
            font-size: 10px;
            width: 12px;
            flex-shrink: 0;
          }
          
          span {
            line-height: 1.4;
          }
        }
      }
    }
  }
}

// 暗色模式适配 - 扁平化设计
html.dark .product-card {
  background: rgba(28, 28, 30, 1) !important;
  border-color: rgba(255, 255, 255, 0.08) !important;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
    
  &:hover {
    border-color: rgba(139, 92, 246, 0.4) !important;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3) !important;
  }
  
  // 商品信息在暗色模式下的文字颜色适配
  .product-info {
    .product-title {
      color: rgba(255, 255, 255, 0.95) !important;
    }
    
    .product-description {
      color: rgba(255, 255, 255, 0.7) !important;
    }
    
    .product-tags {
      .tag-item {
        &.primary {
          background: rgba(139, 92, 246, 0.2) !important;
          color: rgba(139, 92, 246, 1) !important;
          border: 1px solid rgba(139, 92, 246, 0.4) !important;
          
          &:hover {
            background: rgba(139, 92, 246, 0.3) !important;
            color: rgba(139, 92, 246, 1) !important;
            border-color: rgba(139, 92, 246, 0.6) !important;
          }
        }
        
        &.success {
          background: rgba(34, 197, 94, 0.2) !important;
          color: rgba(34, 197, 94, 1) !important;
          border: 1px solid rgba(34, 197, 94, 0.4) !important;
          
          &:hover {
            background: rgba(34, 197, 94, 0.3) !important;
            color: rgba(34, 197, 94, 1) !important;
            border-color: rgba(34, 197, 94, 0.6) !important;
          }
        }
        
        &.warning {
          background: rgba(245, 158, 11, 0.2) !important;
          color: rgba(245, 158, 11, 1) !important;
          border: 1px solid rgba(245, 158, 11, 0.4) !important;
          
          &:hover {
            background: rgba(245, 158, 11, 0.3) !important;
            color: rgba(245, 158, 11, 1) !important;
            border-color: rgba(245, 158, 11, 0.6) !important;
          }
        }
        
        &.info {
          background: rgba(6, 182, 212, 0.2) !important;
          color: rgba(6, 182, 212, 1) !important;
          border: 1px solid rgba(6, 182, 212, 0.4) !important;
          
          &:hover {
            background: rgba(6, 182, 212, 0.3) !important;
            color: rgba(6, 182, 212, 1) !important;
            border-color: rgba(6, 182, 212, 0.6) !important;
          }
        }
        
        &.danger {
          background: rgba(239, 68, 68, 0.2) !important;
          color: rgba(239, 68, 68, 1) !important;
          border: 1px solid rgba(239, 68, 68, 0.4) !important;
          
          &:hover {
            background: rgba(239, 68, 68, 0.3) !important;
            color: rgba(239, 68, 68, 1) !important;
            border-color: rgba(239, 68, 68, 0.6) !important;
          }
        }
      }
    }
    
    .product-meta {
      .rating {
        .rating-text {
          color: rgba(255, 255, 255, 0.8) !important;
        }
      }
      
      .sales {
        color: rgba(255, 255, 255, 0.6) !important;
      }
    }
  }
  
  .product-overlay {
    .share-btn {
      background: rgba(55, 55, 58, 0.95) !important;
      color: rgba(255, 255, 255, 0.9) !important;
      border: 1px solid rgba(255, 255, 255, 0.15) !important;
      
      &:hover {
        background: rgba(139, 92, 246, 0.9) !important;
        color: white !important;
        border-color: rgba(139, 92, 246, 0.6) !important;
      }
    }
    
    .primary-action-btn {
      background: linear-gradient(135deg, rgba(255, 64, 255, 0.85), rgba(128, 0, 191, 0.85)) !important;
      color: white !important;
      
      &:hover {
        background: linear-gradient(135deg, rgba(255, 64, 255, 1), rgba(128, 0, 191, 1)) !important;
        transform: translateY(-2px) !important;
        box-shadow: 0 4px 12px rgba(128, 0, 191, 0.4) !important;
      }
      
      &:active {
        transform: scale(0.98) !important;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .product-card {
    .product-image {
      height: 180px;
    }
    
    .product-info {
      padding: 16px;
      
      .product-title {
        font-size: 16px;
      }
      
      .product-price .price-main .current-price {
        font-size: 20px;
      }
    }
    
    // 价格在暗色模式下的适配
    .product-price {
      .price-main {
        .current-price {
          background: linear-gradient(135deg, #ff7043 0%, #ffab91 100%) !important;
          background-size: 200% 100% !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
      }
      
      .price-original {
        .discount-text {
          background: linear-gradient(135deg, #ff7043 0%, #ffab91 100%) !important;
          background-size: 200% 100% !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
        }
      }
    }
    
  }
}

@media (max-width: 480px) {
  .product-card {
    .product-image {
      height: 160px;
    }
    
    .product-info {
      padding: 12px;
      
      .product-title {
        font-size: 15px;
        margin-bottom: 6px;
      }
      
      .product-description {
        font-size: 13px;
        margin-bottom: 12px;
      }
      
      .product-tags {
        margin-bottom: 12px;
        gap: 4px;
        
        .tag-item {
          font-size: 10px;
          padding: 3px 6px;
        }
      }
      
      .product-meta {
        margin-bottom: 12px;
        
        .rating .rating-text {
          font-size: 12px;
        }
        
        .sales {
          font-size: 11px;
        }
      }
      
      .product-features {
        .features-title {
          font-size: 13px;
          margin-bottom: 6px;
        }
        
        .features-list li {
          font-size: 12px;
        }
      }
    }
  }
}
</style>
