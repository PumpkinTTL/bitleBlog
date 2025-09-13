<template>
  <div class="digital-store">
    <div class="w">
      <!-- 主内容容器 - 统一包装减少分割 -->
      <el-card class="main-container" shadow="never" :body-style="{ padding: '32px' }">
        <!-- 快速导航 -->
        <div class="quick-nav-section animate__animated animate__fadeInUp animate__faster">
          <h3 class="section-title">
            <i class="fas fa-compass"></i>
            快速导航
          </h3>
          <div class="nav-grid">
            <div class="nav-item animate__animated animate__zoomIn animate__faster" 
                 v-for="(nav, index) in quickNavs" 
                 :key="index"
                 :style="`animation-delay: ${index * 0.05}s`">
              <div class="nav-icon" :style="`background: ${nav.color}20; color: ${nav.color}`">
                <i :class="nav.icon"></i>
              </div>
              <div class="nav-content">
                <span class="nav-label">{{ nav.label }}</span>
                <span class="nav-count">{{ nav.count }}</span>
              </div>
              <i class="fas fa-chevron-right nav-arrow"></i>
            </div>
          </div>
        </div>

        <!-- 分割线 -->
        <el-divider></el-divider>

        <!-- 精选商品 -->
        <div class="featured-section">
          <div class="section-header animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.2s;">
            <h3 class="section-title">
              <i class="fas fa-star"></i>
              精选商品
            </h3>
            <div class="filter-tabs">
              <el-tag v-for="(tab, index) in filterTabs" :key="index" 
                      :type="index === 0 ? 'primary' : ''" 
                      :effect="index === 0 ? 'dark' : 'plain'"
                      size="small">
                {{ tab }}
              </el-tag>
            </div>
          </div>

          <div class="products-grid">
            <div class="product-card animate__animated animate__fadeInUp animate__faster" 
                 v-for="(product, index) in featuredProducts" 
                 :key="index"
                 :style="`animation-delay: ${0.3 + index * 0.05}s`">
              <div class="product-image">
                <img :src="product.image" :alt="product.name">
                <div class="product-badge" v-if="product.badge">
                  <el-tag :type="product.badge === 'HOT' ? 'danger' : 'success'" size="small">
                    {{ product.badge }}
                  </el-tag>
                </div>
                <div class="product-overlay">
                  <el-button type="primary" size="small" round>立即购买</el-button>
                </div>
              </div>
              <div class="product-info">
                <el-tag size="small" type="info" effect="plain">{{ product.category }}</el-tag>
                <h4 class="product-name">{{ product.name }}</h4>
                <div class="product-meta">
                  <div class="rating">
                    <i class="fas fa-star"></i>
                    <span>{{ product.rating }}</span>
                  </div>
                  <div class="sales">{{ product.sales }}销量</div>
                </div>
                <div class="product-price">
                  <span class="current-price">¥{{ product.price }}</span>
                  <span class="original-price" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 分割线 -->
        <el-divider></el-divider>

        <!-- 分类导航 -->
        <div class="categories-section">
          <h3 class="section-title animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.5s;">
            <i class="fas fa-th-large"></i>
            商品分类
          </h3>
          <div class="categories-grid">
            <div class="category-item animate__animated animate__zoomIn animate__faster" 
                 v-for="(category, index) in categories" 
                 :key="index"
                 :style="`animation-delay: ${0.6 + index * 0.05}s`">
              <div class="category-icon" :style="`background: ${category.color}20; color: ${category.color}`">
                <i :class="category.icon"></i>
              </div>
              <div class="category-info">
                <h4 class="category-name">{{ category.name }}</h4>
                <span class="category-count">{{ category.count }}件商品</span>
              </div>
              <i class="fas fa-chevron-right category-arrow"></i>
            </div>
          </div>
        </div>

        <!-- 分割线 -->
        <el-divider></el-divider>

        <!-- 商品列表 -->
        <div class="products-section">
          <div class="section-header animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.8s;">
            <h3 class="section-title">
              <i class="fas fa-fire"></i>
              热销商品
            </h3>
            <div class="sort-controls">
              <el-select v-model="sortValue" placeholder="排序方式" size="small" style="width: 120px">
                <el-option label="综合排序" value="default"></el-option>
                <el-option label="价格升序" value="price_asc"></el-option>
                <el-option label="价格降序" value="price_desc"></el-option>
                <el-option label="销量优先" value="sales"></el-option>
              </el-select>
            </div>
          </div>

          <div class="products-list">
            <div class="product-item animate__animated animate__fadeInUp animate__faster" 
                 v-for="(product, index) in allProducts" 
                 :key="index"
                 :style="`animation-delay: ${0.9 + index * 0.03}s`">
              <div class="product-thumb">
                <img :src="product.image" :alt="product.name">
                <div class="thumb-overlay">
                  <i class="fas fa-eye"></i>
                </div>
              </div>
              <div class="product-details">
                <div class="product-header">
                  <el-tag size="small" type="info" effect="plain">{{ product.category }}</el-tag>
                  <div class="product-rating">
                    <i class="fas fa-star"></i>
                    <span>{{ product.rating }}</span>
                  </div>
                </div>
                <h4 class="product-title">{{ product.name }}</h4>
                <p class="product-desc">{{ product.desc }}</p>
                <div class="product-footer">
                  <div class="price-info">
                    <span class="price">¥{{ product.price }}</span>
                    <span class="original" v-if="product.originalPrice">¥{{ product.originalPrice }}</span>
                  </div>
                  <div class="product-actions">
                    <el-button size="small" circle>
                      <i class="fas fa-heart"></i>
                    </el-button>
                    <el-button type="primary" size="small" circle>
                      <i class="fas fa-shopping-cart"></i>
                    </el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 服务保障 - 独立卡片但与主内容连贯 -->
      <el-card class="services-card animate__animated animate__fadeInUp animate__faster" 
               style="animation-delay: 1.2s; margin-top: 20px;" 
               shadow="never"
               :body-style="{ padding: '24px' }">
        <template #header>
          <div class="services-header">
            <h3 class="section-title">
              <i class="fas fa-shield-alt"></i>
              服务保障
            </h3>
          </div>
        </template>
        <div class="services-container">
          <div class="service-item" v-for="(service, index) in services" :key="index">
            <div class="service-icon">
              <i :class="service.icon"></i>
            </div>
            <div class="service-content">
              <span class="service-title">{{ service.title }}</span>
              <span class="service-desc">{{ service.desc }}</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

// 排序值
const sortValue = ref('default');

// 筛选标签
const filterTabs = ref(['热门', '最新', '优惠']);

// 快速导航
const quickNavs = ref([
  { icon: 'fas fa-code', label: '开发工具', count: '1.2k+', color: '#409eff' },
  { icon: 'fas fa-palette', label: '设计素材', count: '2.5k+', color: '#67c23a' },
  { icon: 'fas fa-graduation-cap', label: '在线课程', count: '856', color: '#e6a23c' },
  { icon: 'fas fa-mobile-alt', label: '移动应用', count: '643', color: '#f56c6c' }
]);

// 精选商品
const featuredProducts = ref([
  {
    name: 'AI设计助手Pro',
    category: '设计工具',
    price: 299,
    originalPrice: 399,
    rating: 4.9,
    sales: '2.1k',
    image: 'https://via.placeholder.com/280x160/409eff/ffffff?text=AI+Design',
    badge: 'HOT'
  },
  {
    name: 'Vue3组件库',
    category: '开发框架',
    price: 199,
    rating: 5.0,
    sales: '1.8k',
    image: 'https://via.placeholder.com/280x160/67c23a/ffffff?text=Vue3+UI',
    badge: 'NEW'
  },
  {
    name: '图标素材包',
    category: 'UI素材',
    price: 89,
    originalPrice: 129,
    rating: 4.8,
    sales: '3.2k',
    image: 'https://via.placeholder.com/280x160/e6a23c/ffffff?text=Icons'
  }
]);

// 分类数据
const categories = ref([
  { name: '开发工具', icon: 'fas fa-laptop-code', count: 1250, color: '#409eff' },
  { name: '设计素材', icon: 'fas fa-paint-brush', count: 2340, color: '#67c23a' },
  { name: '教程课程', icon: 'fas fa-book', count: 890, color: '#e6a23c' },
  { name: '移动应用', icon: 'fas fa-mobile-alt', count: 670, color: '#f56c6c' },
  { name: '插件扩展', icon: 'fas fa-plug', count: 780, color: '#909399' },
  { name: '模板主题', icon: 'fas fa-th-large', count: 560, color: '#606266' }
]);

// 所有商品
const allProducts = ref([
  {
    name: 'React管理后台模板',
    category: '后台模板',
    desc: '基于React18的现代化管理后台模板，包含完整的权限系统',
    price: 259,
    originalPrice: 299,
    rating: 4.8,
    image: 'https://via.placeholder.com/100x75/409eff/ffffff?text=React'
  },
  {
    name: '3D图标设计包',
    category: 'UI素材',
    desc: '精美的3D风格图标设计资源包，包含500+常用图标',
    price: 159,
    rating: 4.9,
    image: 'https://via.placeholder.com/100x75/67c23a/ffffff?text=3D'
  },
  {
    name: 'Node.js开发教程',
    category: '在线课程',
    desc: '从零开始学习Node.js后端开发，包含实战项目',
    price: 399,
    rating: 5.0,
    image: 'https://via.placeholder.com/100x75/e6a23c/ffffff?text=Node'
  },
  {
    name: '响应式网站模板',
    category: '网站模板',
    desc: '现代化响应式企业网站模板，适配各种设备',
    price: 189,
    originalPrice: 229,
    rating: 4.7,
    image: 'https://via.placeholder.com/100x75/f56c6c/ffffff?text=Web'
  }
]);

// 服务保障
const services = ref([
  { icon: 'fas fa-shield-alt', title: '正版保证', desc: '官方授权正版资源' },
  { icon: 'fas fa-download', title: '即时下载', desc: '购买后立即获取' },
  { icon: 'fas fa-sync-alt', title: '免费更新', desc: '终身免费更新' },
  { icon: 'fas fa-headset', title: '客服支持', desc: '7×24小时在线' }
]);
</script>

<style lang="less" scoped>
// 通用容器
.w {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.digital-store {
  min-height: 100vh;
  background: var(--el-bg-color-page);
  padding: 24px 0;
}

// 主容器 - 统一背景减少分割
.main-container {
  border-radius: 12px;
  margin-bottom: 0;
}

.services-card {
  border-radius: 12px;
}

// 区域内部间距
.quick-nav-section, .featured-section, .categories-section, .products-section {
  margin-bottom: 32px;
  
  &:last-child {
    margin-bottom: 0;
  }
}

// 通用标题
.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--el-text-color-primary);
  margin: 0 0 20px;
  display: flex;
  align-items: center;
  gap: 8px;

  i {
    font-size: 16px;
    color: var(--el-color-primary);
  }
}

// 通用区域头部
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .filter-tabs {
    display: flex;
    gap: 8px;
  }
}

// 快速导航
.nav-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: var(--el-fill-color-lighter);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--el-fill-color-light);
      transform: translateY(-2px);

      .nav-arrow {
        transform: translateX(4px);
        color: var(--el-color-primary);
      }
    }

    .nav-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }

    .nav-content {
      flex: 1;

      .nav-label {
        display: block;
        font-size: 14px;
        color: var(--el-text-color-primary);
        font-weight: 600;
        margin-bottom: 2px;
      }

      .nav-count {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }

    .nav-arrow {
      color: var(--el-text-color-placeholder);
      font-size: 12px;
      transition: all 0.2s ease;
    }
  }
}

// 精选商品
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;

  .product-card {
    background: var(--el-fill-color-lighter);
    border-radius: 8px;
    overflow: hidden;
    transition: all 0.2s ease;

    &:hover {
      background: var(--el-fill-color-light);
      transform: translateY(-2px);
    }

    .product-image {
      position: relative;
      height: 160px;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.2s ease;
      }

      .product-badge {
        position: absolute;
        top: 8px;
        left: 8px;
      }

      .product-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease;
      }

      &:hover {
        img {
          transform: scale(1.05);
        }

        .product-overlay {
          opacity: 1;
        }
      }
    }

    .product-info {
      padding: 16px;

      .product-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 8px 0;
        line-height: 1.3;
      }

      .product-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 12px;

        .rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--el-text-color-secondary);

          i {
            color: #ffd700;
            font-size: 11px;
          }
        }

        .sales {
          font-size: 11px;
          color: var(--el-text-color-placeholder);
        }
      }

      .product-price {
        .current-price {
          font-size: 16px;
          font-weight: 700;
          color: var(--el-color-danger);
        }

        .original-price {
          font-size: 12px;
          color: var(--el-text-color-placeholder);
          text-decoration: line-through;
          margin-left: 6px;
        }
      }
    }
  }
}

// 分类导航
.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;

  .category-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px;
    background: var(--el-fill-color-lighter);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: var(--el-fill-color-light);
      transform: translateY(-1px);

      .category-arrow {
        transform: translateX(3px);
        color: var(--el-color-primary);
      }
    }

    .category-icon {
      width: 32px;
      height: 32px;
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      flex-shrink: 0;
    }

    .category-info {
      flex: 1;

      .category-name {
        font-size: 14px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 2px;
      }

      .category-count {
        font-size: 11px;
        color: var(--el-text-color-secondary);
      }
    }

    .category-arrow {
      color: var(--el-text-color-placeholder);
      font-size: 12px;
      transition: all 0.2s ease;
    }
  }
}

// 商品列表
.products-list {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .product-item {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: var(--el-fill-color-lighter);
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
      background: var(--el-fill-color-light);
      transform: translateY(-1px);
    }

    .product-thumb {
      position: relative;
      width: 100px;
      height: 75px;
      border-radius: 6px;
      overflow: hidden;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .thumb-overlay {
        position: absolute;
        inset: 0;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transition: opacity 0.2s ease;
        color: white;
        font-size: 14px;
      }

      &:hover .thumb-overlay {
        opacity: 1;
      }
    }

    .product-details {
      flex: 1;
      min-width: 0;

      .product-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 6px;

        .product-rating {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          color: var(--el-text-color-secondary);

          i {
            color: #ffd700;
            font-size: 11px;
          }
        }
      }

      .product-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 6px;
        line-height: 1.3;
      }

      .product-desc {
        font-size: 13px;
        color: var(--el-text-color-regular);
        margin: 0 0 12px;
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .product-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .price-info {
          .price {
            font-size: 16px;
            font-weight: 700;
            color: var(--el-color-danger);
          }

          .original {
            font-size: 12px;
            color: var(--el-text-color-placeholder);
            text-decoration: line-through;
            margin-left: 6px;
          }
        }

        .product-actions {
          display: flex;
          gap: 8px;
        }
      }
    }
  }
}

// 服务保障
.services-header {
  .section-title {
    margin: 0;
  }
}

.services-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 20px;

  .service-item {
    display: flex;
    align-items: center;
    gap: 12px;

    .service-icon {
      width: 32px;
      height: 32px;
      background: var(--el-color-primary-light-9);
      border-radius: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-color-primary);
      font-size: 14px;
      flex-shrink: 0;
    }

    .service-content {
      display: flex;
      flex-direction: column;
      gap: 2px;

      .service-title {
        font-size: 13px;
        font-weight: 600;
        color: var(--el-text-color-primary);
      }

      .service-desc {
        font-size: 12px;
        color: var(--el-text-color-secondary);
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .w {
    padding: 0 16px;
  }

  .digital-store {
    padding: 16px 0;
  }

  .nav-grid,
  .products-grid,
  .categories-grid {
    grid-template-columns: 1fr;
  }

  .section-header {
    flex-direction: column;
    gap: 12px;
    align-items: flex-start;
  }

  .product-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;

    .product-thumb {
      width: 100%;
      height: 120px;
    }
  }

  .services-container {
    grid-template-columns: 1fr;
    gap: 12px;
  }
}
</style>