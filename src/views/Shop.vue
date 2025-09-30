<template>
  <div class="shop-page">
    <!-- 商城头部区域 -->
    <div class="shop-header animate__animated animate__fadeInDown">
      <div class="container">
        <div class="header-content">
          <div class="header-left">
            <h1 class="page-title">
              <i class="fas fa-store"></i>
              <span>精品商城</span>
            </h1>
            <p class="page-subtitle">发现优质数字产品，提升您的工作效率</p>
          </div>

          <div class="header-actions">
            <div class="search-box">
              <input v-model="searchKeyword" type="text" placeholder="搜索商品..." class="search-input"
                @keyup.enter="handleSearch">
              <button class="search-btn" @click="handleSearch">
                <i class="fas fa-search"></i>
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
    <!-- 占位区域 -->
    <div style="height:110px;"></div>
    <!-- 主体内容区域 -->
    <div class="shop-content">
      <div class="container">
        <div class="content-layout">
          <!-- 商品区域 -->
          <div class="main-content">
            <!-- 筛选结果提示和商品网格 -->
            <div class="results-header-container animate__animated animate__fadeIn">
              <div class="results-header">
                <!-- 第一行：分类和排序 -->
                <div class="header-top">
                  <div class="category-tabs">
                    <button v-for="category in categories" :key="category.id" class="category-tab"
                      :class="{ 'active': currentCategory === category.id }" @click="handleCategoryChange(category.id)">
                      <div class="tab-icon" :style="{ backgroundColor: category.color }">
                        <i :class="category.icon"></i>
                      </div>
                      <span class="tab-name">{{ category.name }}</span>
                      <span class="tab-count">{{ category.count }}</span>
                    </button>
                  </div>

                  <div class="sort-controls">
                    <span class="sort-label">
                      <i class="fas fa-sort-amount-down"></i>
                      <span>排序</span>
                    </span>
                    <div class="sort-dropdown" :class="{ 'active': sortDropdownOpen }">
                      <button class="sort-trigger" @click="toggleSortDropdown" @blur="closeSortDropdown">
                        <span class="current-sort">
                          <i :class="getCurrentSortIcon()"></i>
                          <span>{{ getCurrentSortLabel() }}</span>
                        </span>
                        <i class="fas fa-chevron-down dropdown-arrow" :class="{ 'rotated': sortDropdownOpen }"></i>
                      </button>

                      <div class="sort-menu" v-show="sortDropdownOpen">
                        <div class="sort-menu-header">
                          <i class="fas fa-filter"></i>
                          <span>选择排序方式</span>
                        </div>
                        <div class="sort-options">
                          <button v-for="option in sortOptions" :key="option.value" class="sort-option"
                            :class="{ 'active': currentSort === option.value }" @click="handleSortChange(option.value)">
                            <i :class="option.icon"></i>
                            <div class="option-content">
                              <span class="option-label">{{ option.label }}</span>
                              <span class="option-desc">{{ option.desc }}</span>
                            </div>
                            <i v-if="currentSort === option.value" class="fas fa-check option-check"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 第二行：筛选信息和快速筛选 -->
                <div class="header-bottom">
                  <div class="results-info">
                    <div class="results-count">
                      <i class="fas fa-search"></i>
                      <span class="count-text">共找到</span>
                      <span class="count-number">{{ filteredProducts.length }}</span>
                      <span class="count-text">款商品</span>
                    </div>
                    <span v-if="currentCategory !== 'all'" class="filter-tags">
                      <span class="filter-tag">
                        {{ getCategoryName(currentCategory) }}
                        <i class="fas fa-times" @click="handleCategoryChange('all')"></i>
                      </span>
                    </span>
                  </div>

                  <div class="quick-filters">
                    <button v-for="filter in quickFilters" :key="filter.key" class="quick-filter-btn"
                      :class="{ 'active': activeFilters.includes(filter.key) }" @click="toggleQuickFilter(filter.key)">
                      <i :class="filter.icon"></i>
                      <span>{{ filter.label }}</span>
                    </button>
                  </div>
                </div>
              </div>

              <!-- 商品网格 -->
              <div class="products-grid">
                <ProductCard v-for="(product, index) in paginatedProducts" :key="product.id" :product="product"
                  :animation-delay="index * 50" @product-click="handleProductClick"
                  @primary-action="handlePrimaryAction" @favorite="handleFavorite" @share="handleShare"
                  @tag-click="handleTagClick" class="product-item animate__animated animate__fadeInUp" />
              </div>
            </div>

            <!-- 加载更多 -->
            <div v-if="hasMoreProducts" class="load-more-container">
              <button class="load-more-btn" @click="loadMoreProducts">
                <i class="fas fa-plus"></i>
                <span>加载更多商品</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import ProductCard from '@/components/shop/ProductCard.vue'

// 接口定义
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
  rating: number
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

interface Category {
  id: string
  name: string
  icon: string
  color: string
  count: number
}

// 响应式数据
const loading = ref(false)
const searchKeyword = ref('')
const currentCategory = ref('all')
const currentSort = ref('popularity')
const activeFilters = ref<string[]>([])
const currentPage = ref(1)
const pageSize = ref(12)
const sortDropdownOpen = ref(false)

// 分类数据
const categories = ref<Category[]>([
  {
    id: 'all',
    name: '全部',
    icon: 'fas fa-th-large',
    color: '#64748b',
    count: 128
  },
  {
    id: 'dev-tools',
    name: '开发工具',
    icon: 'fas fa-code',
    color: '#1677FF',
    count: 32
  },
  {
    id: 'design',
    name: '设计资源',
    icon: 'fas fa-palette',
    color: '#8b5cf6',
    count: 24
  },
  {
    id: 'services',
    name: '在线服务',
    icon: 'fas fa-cloud',
    color: '#10b981',
    count: 18
  },
  {
    id: 'software',
    name: '软件许可',
    icon: 'fas fa-key',
    color: '#f59e0b',
    count: 28
  },
  {
    id: 'api',
    name: 'API接口',
    icon: 'fas fa-plug',
    color: '#06b6d4',
    count: 16
  },
  {
    id: 'resources',
    name: '数字资源',
    icon: 'fas fa-download',
    color: '#ef4444',
    count: 10
  }
])

// 计算属性
const filteredProducts = computed(() => {
  let filtered = [...products.value]

  // 分类筛选
  if (currentCategory.value !== 'all') {
    filtered = filtered.filter(product => product.category === currentCategory.value)
  }

  // 关键词搜索
  if (searchKeyword.value.trim()) {
    const keyword = searchKeyword.value.toLowerCase()
    filtered = filtered.filter(product =>
      product.name.toLowerCase().includes(keyword) ||
      product.description.toLowerCase().includes(keyword) ||
      product.tags?.some(tag => tag.toLowerCase().includes(keyword))
    )
  }

  // 快速筛选
  activeFilters.value.forEach(filter => {
    switch (filter) {
      case 'free':
        filtered = filtered.filter(product => product.price === 'free')
        break
      case 'featured':
        filtered = filtered.filter(product => product.featured)
        break
      case 'discount':
        filtered = filtered.filter(product => product.discount)
        break
      case 'new':
        // 假设7天内创建的为最新
        filtered = filtered.filter(product => {
          if (!product.createTime) return false
          const createDate = new Date(product.createTime)
          const sevenDaysAgo = new Date()
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
          return createDate > sevenDaysAgo
        })
        break
    }
  })

  // 排序
  filtered.sort((a, b) => {
    switch (currentSort.value) {
      case 'newest':
        return new Date(b.createTime || '').getTime() - new Date(a.createTime || '').getTime()
      case 'price-asc':
        return (typeof a.price === 'number' ? a.price : 0) - (typeof b.price === 'number' ? b.price : 0)
      case 'price-desc':
        return (typeof b.price === 'number' ? b.price : 0) - (typeof a.price === 'number' ? a.price : 0)
      case 'rating':
        return (b.rating || 0) - (a.rating || 0)
      case 'sales':
        return (b.sales || 0) - (a.sales || 0)
      case 'popularity':
      default:
        return (b.popularity || 0) - (a.popularity || 0)
    }
  })

  return filtered
})

const paginatedProducts = computed(() => {
  const start = 0
  const end = currentPage.value * pageSize.value
  return filteredProducts.value.slice(start, end)
})

const hasMoreProducts = computed(() => {
  return paginatedProducts.value.length < filteredProducts.value.length
})

// 商品数据
const products = ref<Product[]>([
  // 开发工具类
  {
    id: 1,
    name: 'VS Code 专业版',
    description: '强大的代码编辑器，支持丰富插件生态，提升开发效率',
    image: 'https://picsum.photos/id/1/300/200',
    price: 199,
    originalPrice: 299,
    unit: '年',
    rating: 4.9,
    tags: ['编辑器', '开发', 'IDE'],
    features: ['智能代码补全', '内置Git支持', '丰富插件生态', '多语言支持'],
    category: 'dev-tools',
    featured: true,
    discount: 7,
    createTime: '2024-01-15',
    sales: 1250,
    popularity: 95
  },
  {
    id: 2,
    name: 'JetBrains全家桶',
    description: '专业开发工具套装，涵盖各种编程语言和框架',
    image: 'https://picsum.photos/id/2/300/200',
    price: 899,
    originalPrice: 1299,
    unit: '年',
    rating: 4.8,
    tags: ['IDE', '开发套件', '专业'],
    features: ['IntelliJ IDEA', 'WebStorm', 'PyCharm', 'PhpStorm'],
    category: 'dev-tools',
    featured: true,
    discount: 3,
    createTime: '2024-01-10',
    sales: 850,
    popularity: 88
  },
  {
    id: 3,
    name: 'Postman Pro',
    description: 'API开发测试平台，团队协作的最佳选择',
    image: 'https://picsum.photos/id/3/300/200',
    price: 299,
    unit: '年',
    rating: 4.7,
    tags: ['API', '测试', '协作'],
    features: ['API测试', '团队协作', '自动化测试', '监控报告'],
    category: 'dev-tools',
    createTime: '2024-01-20',
    sales: 650,
    popularity: 82
  },

  // 设计资源类
  {
    id: 4,
    name: 'Adobe Creative Cloud',
    description: '全套创意设计软件，满足所有设计需求',
    image: 'https://picsum.photos/id/4/300/200',
    price: 688,
    unit: '月',
    rating: 4.9,
    tags: ['设计', 'Adobe', '创意'],
    features: ['Photoshop', 'Illustrator', 'After Effects', '云同步'],
    category: 'design',
    featured: true,
    createTime: '2024-01-05',
    sales: 2100,
    popularity: 98
  },
  {
    id: 5,
    name: 'Sketch专业版',
    description: 'Mac平台最受欢迎的UI设计工具',
    image: 'https://picsum.photos/id/5/300/200',
    price: 99,
    unit: '年',
    rating: 4.6,
    tags: ['UI设计', 'Mac', '界面'],
    features: ['矢量编辑', '原型设计', '团队协作', '插件生态'],
    category: 'design',
    createTime: '2024-01-18',
    sales: 420,
    popularity: 75
  },
  {
    id: 6,
    name: 'Figma Pro',
    description: '在线协作设计平台，团队设计的未来',
    image: 'https://picsum.photos/id/6/300/200',
    price: 144,
    unit: '年',
    rating: 4.8,
    tags: ['协作设计', '在线', '原型'],
    features: ['实时协作', '原型制作', '设计系统', '开发交接'],
    category: 'design',
    featured: true,
    createTime: '2024-01-12',
    sales: 980,
    popularity: 92
  },

  // 在线服务类
  {
    id: 7,
    name: 'GitHub Pro',
    description: '专业代码托管服务，私有仓库无限制',
    icon: 'fab fa-github',
    gradient: '#f1f5f9',
    price: 48,
    unit: '年',
    rating: 4.9,
    tags: ['代码托管', 'Git', '协作'],
    features: ['无限私有仓库', 'Actions CI/CD', '高级安全', '优先支持'],
    category: 'services',
    createTime: '2024-01-08',
    sales: 1500,
    popularity: 96
  },
  {
    id: 8,
    name: 'Vercel Pro',
    description: '现代Web应用部署平台，极速全球CDN',
    icon: 'fas fa-rocket',
    gradient: '#f1f5f9',
    price: 240,
    unit: '年',
    rating: 4.7,
    tags: ['部署', 'CDN', 'Serverless'],
    features: ['全球CDN', 'Serverless函数', '自动部署', '性能监控'],
    category: 'services',
    createTime: '2024-01-25',
    sales: 320,
    popularity: 78
  },

  // 软件许可类
  {
    id: 9,
    name: 'Microsoft Office 365',
    description: '完整办公软件套装，云端同步随时随地办公',
    icon: 'fas fa-file-alt',
    gradient: '#f1f5f9',
    price: 398,
    unit: '年',
    rating: 4.8,
    tags: ['办公', 'Microsoft', '云同步'],
    features: ['Word/Excel/PPT', '1TB OneDrive', 'Teams协作', '多设备同步'],
    category: 'software',
    featured: true,
    createTime: '2024-01-03',
    sales: 3200,
    popularity: 94
  },
  {
    id: 10,
    name: 'Windows 11 Pro',
    description: '最新Windows操作系统专业版，企业级功能',
    icon: 'fab fa-windows',
    gradient: '#f1f5f9',
    price: 1088,
    rating: 4.5,
    tags: ['操作系统', 'Windows', '专业版'],
    features: ['专业功能', '企业管理', '安全增强', '虚拟化支持'],
    category: 'software',
    createTime: '2024-01-01',
    sales: 680,
    popularity: 85
  },

  // API接口类
  {
    id: 11,
    name: 'OpenAI API额度',
    description: '人工智能API服务，支持ChatGPT和DALL-E',
    icon: 'fas fa-robot',
    gradient: '#f1f5f9',
    price: 100,
    tags: ['AI', 'API', 'ChatGPT'],
    features: ['GPT模型', '图像生成', '代码生成', '文本处理'],
    category: 'api',
    featured: true,
    createTime: '2024-01-22',
    sales: 890,
    popularity: 90
  },
  {
    id: 12,
    name: '高德地图API',
    description: '专业地图服务API，位置服务解决方案',
    icon: 'fas fa-map-marked-alt',
    gradient: '#f1f5f9',
    price: 199,
    tags: ['地图', 'API', '位置服务'],
    features: ['地图显示', '路线规划', '地点搜索', '位置定位'],
    category: 'api',
    createTime: '2024-01-14',
    sales: 240,
    popularity: 72
  },

  // 数字资源类
  {
    id: 13,
    name: '高质量图标库',
    description: '10000+精美矢量图标，设计师必备资源',
    icon: 'fas fa-icons',
    gradient: '#f1f5f9',
    price: 'free',
    rating: 4.6,
    tags: ['图标', '矢量', '免费'],
    features: ['矢量格式', '多种尺寸', '分类齐全', '商用授权'],
    category: 'resources',
    featured: true,
    createTime: '2024-01-28',
    sales: 5600,
    popularity: 87
  },
  {
    id: 14,
    name: '字体库合集',
    description: '500+精选字体，涵盖中英文各种风格',
    icon: 'fas fa-font',
    gradient: '#f1f5f9',
    price: 'free',
    rating: 4.4,
    tags: ['字体', '中文', '英文'],
    features: ['多种风格', '商用授权', '高质量', '定期更新'],
    category: 'resources',
    createTime: '2024-01-30',
    sales: 3200,
    popularity: 80
  }
])

// 排序选项
const sortOptions = ref([
  {
    label: '综合排序',
    value: 'popularity',
    icon: 'fas fa-fire',
    desc: '根据热度和综合评价排序'
  },
  {
    label: '最新上架',
    value: 'newest',
    icon: 'fas fa-clock',
    desc: '按商品上架时间排序'
  },
  {
    label: '价格从低到高',
    value: 'price-asc',
    icon: 'fas fa-sort-amount-up-alt',
    desc: '价格由低到高排列'
  },
  {
    label: '价格从高到低',
    value: 'price-desc',
    icon: 'fas fa-sort-amount-down-alt',
    desc: '价格由高到低排列'
  },
  {
    label: '评分最高',
    value: 'rating',
    icon: 'fas fa-star',
    desc: '按用户评分排序'
  },
  {
    label: '销量最高',
    value: 'sales',
    icon: 'fas fa-shopping-cart',
    desc: '按销售数量排序'
  }
])

// 快速筛选选项
const quickFilters = ref([
  { key: 'free', label: '免费', icon: 'fas fa-gift' },
  { key: 'featured', label: '精选', icon: 'fas fa-crown' },
  { key: 'discount', label: '特价', icon: 'fas fa-tag' },
  { key: 'new', label: '最新', icon: 'fas fa-star' }
])

// 工具函数
const getCategoryName = (categoryId: string): string => {
  const category = categories.value.find(cat => cat.id === categoryId)
  return category ? category.name : '全部'
}

// 事件处理函数
const handleSearch = () => {
  // 搜索逻辑已在computed中实现
  console.log('搜索:', searchKeyword.value)
}

const handleCategoryChange = (categoryId: string) => {
  currentCategory.value = categoryId
  currentPage.value = 1 // 重置分页
  console.log('分类切换:', categoryId)
}

const handleSortChange = (sortValue: string) => {
  currentSort.value = sortValue
  sortDropdownOpen.value = false
  console.log('排序改变:', sortValue)
}

// 下拉框控制方法
const toggleSortDropdown = () => {
  sortDropdownOpen.value = !sortDropdownOpen.value
}

const closeSortDropdown = () => {
  // 延迟关闭，等待点击事件先执行
  setTimeout(() => {
    sortDropdownOpen.value = false
  }, 150)
}

// 获取当前排序选项的信息
const getCurrentSortOption = () => {
  return sortOptions.value.find(option => option.value === currentSort.value) || sortOptions.value[0]
}

const getCurrentSortLabel = () => {
  return getCurrentSortOption().label
}

const getCurrentSortIcon = () => {
  return getCurrentSortOption().icon
}


const toggleQuickFilter = (filterKey: string) => {
  const index = activeFilters.value.indexOf(filterKey)
  if (index > -1) {
    activeFilters.value.splice(index, 1)
  } else {
    activeFilters.value.push(filterKey)
  }
  currentPage.value = 1 // 重置分页
  console.log('快速筛选:', activeFilters.value)
}

const loadMoreProducts = () => {
  currentPage.value += 1
  console.log('加载更多商品')
}

const handleTagClick = (tag: string) => {
  searchKeyword.value = tag
  console.log('标签点击:', tag)
}

const handleProductClick = (product: Product) => {
  console.log('商品点击:', product)
  ElMessage.info(`查看商品: ${product.name}`)
}

const handlePrimaryAction = (product: Product) => {
  console.log('主要操作:', product)
}

const handleSecondaryAction = (product: Product) => {
  console.log('次要操作:', product)
}

const handleFavorite = (product: Product, favorited: boolean) => {
  console.log('收藏操作:', product, favorited)
}

const handleShare = (product: Product) => {
  console.log('分享:', product)
}

// 模拟加载
onMounted(() => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 1000)
})
</script>

<style lang="less" scoped>
.shop-page {
  min-height: 100vh;
  background: var(--el-bg-color-page);

  .shop-header {
    background: var(--el-bg-color);
    padding: 20px 0;
    border-bottom: 1px solid #f1f5f9;
    width: 100%;
    position: fixed;
    z-index: 9999;

    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .header-content {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 40px;

      @media (max-width: 768px) {
        flex-direction: column;
        gap: 20px;
      }
    }

    .header-left {
      flex: 1;

      .page-title {
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 28px;
        font-weight: 700;
        margin-bottom: 8px;
        position: relative;

        // 渐变文字效果
        background: linear-gradient(135deg,
            var(--el-text-color-primary) 0%,
            rgba(139, 92, 246, 0.9) 100%);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        filter: drop-shadow(0 2px 4px rgba(139, 92, 246, 0.1));

        i {
          background: linear-gradient(135deg, rgba(255, 64, 255, 0.8), rgba(128, 0, 191, 0.9));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          color: transparent;
          font-size: 24px;
          filter: drop-shadow(0 2px 4px rgba(139, 92, 246, 0.2));
        }

        @media (max-width: 768px) {
          font-size: 24px;
          justify-content: center;

          i {
            font-size: 20px;
          }
        }
      }

      .page-subtitle {
        font-size: 16px;
        font-weight: 500;
        color: var(--el-text-color-regular);
        margin: 0;
        line-height: 1.6;
        letter-spacing: 0.2px;
        position: relative;

        // 添加微妙的背景装饰
        &::before {
          content: '';
          position: absolute;
          left: 0;
          bottom: -4px;
          width: 60px;
          height: 2px;
          background: linear-gradient(90deg,
              rgba(139, 92, 246, 0.6) 0%,
              rgba(196, 132, 252, 0.3) 100%);
          border-radius: 1px;
        }

        @media (max-width: 768px) {
          text-align: center;
          font-size: 14px;

          &::before {
            left: 50%;
            transform: translateX(-50%);
            width: 40px;
          }
        }
      }
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 16px;

      @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
      }
    }

    .search-box {
      position: relative;
      display: flex;

      .search-input {
        width: 300px;
        height: 42px;
        padding: 0 50px 0 16px;
        border: 2px solid rgba(139, 92, 246, 0.15);
        border-radius: 21px;
        background: linear-gradient(135deg,
            var(--el-bg-color) 0%,
            rgba(248, 250, 252, 0.9) 100%);
        font-size: 14px;
        font-weight: 500;
        outline: none;
        transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        box-shadow: 0 2px 8px rgba(139, 92, 246, 0.08);
        backdrop-filter: blur(8px);

        &:focus {
          border-color: rgba(139, 92, 246, 0.5);
          background: linear-gradient(135deg,
              rgba(139, 92, 246, 0.08) 0%,
              rgba(196, 132, 252, 0.12) 100%);
          box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2), 0 0 0 3px rgba(139, 92, 246, 0.1);
          transform: translateY(-1px);
        }

        &::placeholder {
          color: var(--el-text-color-placeholder);
          font-weight: 400;
        }

        @media (max-width: 576px) {
          width: 260px;
          height: 38px;
          font-size: 13px;
        }
      }

      .search-btn {
        position: absolute;
        right: 4px;
        top: 4px;
        width: 34px;
        height: 34px;
        border: none;
        border-radius: 50%;
        background: linear-gradient(135deg, rgba(255, 64, 255, 0.85), rgba(128, 0, 191, 0.85));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(128, 0, 191, 0.3);

        &:hover {
          background: linear-gradient(135deg, rgba(255, 64, 255, 1), rgba(128, 0, 191, 1));
          transform: scale(1.05) translateY(-1px);
          box-shadow: 0 4px 15px rgba(128, 0, 191, 0.4);
        }

        &:active {
          transform: scale(0.98);
        }
      }
    }
  }

  .shop-content {
    padding: 30px 0;

    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 20px;
    }

    .content-layout {
      width: 100%;
    }
  }

  .main-content {
    width: 100%;

    .results-header-container {
      position: sticky;
      top: 140px;
      z-index: 100;
      margin-bottom: 24px;
      background: linear-gradient(135deg,
          var(--el-bg-color) 0%,
          rgba(248, 250, 252, 0.98) 100%);
      backdrop-filter: blur(20px) saturate(180%);
      border-radius: 16px;
      border: 1px solid rgba(139, 92, 246, 0.08);
      box-shadow:
        0 8px 32px rgba(139, 92, 246, 0.08),
        0 1px 0 rgba(255, 255, 255, 0.8),
        inset 0 1px 0 rgba(255, 255, 255, 0.9);
      transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(90deg,
            transparent 0%,
            rgba(139, 92, 246, 0.03) 50%,
            transparent 100%);
        border-radius: 16px;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.3s ease;
      }

      &:hover::before {
        opacity: 1;
      }

      .results-header {
        padding: 20px;
        display: flex;
        flex-direction: column;
        gap: 16px;

        @media (max-width: 768px) {
          padding: 16px;
          gap: 14px;
        }

        .header-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;

          @media (max-width: 968px) {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }

          .category-tabs {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
            flex: 1;

            @media (max-width: 576px) {
              gap: 6px;
            }

            .category-tab {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 12px;
              border: 1px solid rgba(139, 92, 246, 0.12);
              border-radius: 10px;
              background: linear-gradient(135deg,
                  var(--el-bg-color) 0%,
                  rgba(248, 250, 252, 0.95) 100%);
              color: var(--el-text-color-regular);
              font-size: 13px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              backdrop-filter: blur(8px);
              white-space: nowrap;

              &:hover {
                border-color: #8b5cf6;
                background: linear-gradient(135deg,
                    rgba(139, 92, 246, 0.08) 0%,
                    rgba(196, 132, 252, 0.12) 100%);
                color: #6d28d9;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.2);

                .tab-count {
                  background: rgba(139, 92, 246, 0.15);
                  color: #6d28d9;
                }
              }

              &.active {
                background: linear-gradient(135deg, #8b5cf6, #a855f7);
                border-color: #8b5cf6;
                color: white;
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(139, 92, 246, 0.25);

                .tab-icon {
                  background-color: rgba(255, 255, 255, 0.2) !important;
                }

                .tab-count {
                  background: rgba(255, 255, 255, 0.2);
                  color: rgba(255, 255, 255, 0.9);
                }

                &:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
                }
              }

              .tab-icon {
                width: 20px;
                height: 20px;
                border-radius: 6px;
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 10px;
                opacity: 0.9;
                transition: all 0.3s ease;
              }

              .tab-name {
                font-weight: 600;

                @media (max-width: 576px) {
                  font-size: 12px;
                }
              }

              .tab-count {
                font-size: 11px;
                background: rgba(139, 92, 246, 0.1);
                color: #8b5cf6;
                padding: 2px 6px;
                border-radius: 6px;
                font-weight: 600;
                transition: all 0.3s ease;
              }
            }
          }

          .sort-controls {
            display: flex;
            align-items: center;
            gap: 12px;
            flex-shrink: 0;
            position: relative;

            .sort-label {
              display: flex;
              align-items: center;
              gap: 6px;
              font-size: 14px;
              color: var(--el-text-color-regular);
              font-weight: 600;
              white-space: nowrap;

              i {
                color: rgba(139, 92, 246, 0.8);
                font-size: 13px;
              }
            }

            .sort-dropdown {
              position: relative;

              .sort-trigger {
                display: flex;
                align-items: center;
                justify-content: space-between;
                gap: 12px;
                padding: 10px 16px;
                min-width: 180px;
                border: 2px solid rgba(139, 92, 246, 0.15);
                border-radius: 10px;
                background: linear-gradient(135deg,
                    var(--el-bg-color) 0%,
                    rgba(248, 250, 252, 0.9) 100%);
                color: var(--el-text-color-primary);
                font-size: 14px;
                font-weight: 600;
                cursor: pointer;
                outline: none;
                transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
                box-shadow: 0 2px 8px rgba(139, 92, 246, 0.08);
                backdrop-filter: blur(8px);

                .current-sort {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  flex: 1;

                  i {
                    color: rgba(139, 92, 246, 0.8);
                    font-size: 13px;
                  }
                }

                .dropdown-arrow {
                  color: rgba(139, 92, 246, 0.6);
                  font-size: 12px;
                  transition: transform 0.3s ease;

                  &.rotated {
                    transform: rotate(180deg);
                  }
                }

                &:hover {
                  background: linear-gradient(135deg,
                      rgba(139, 92, 246, 0.08) 0%,
                      rgba(196, 132, 252, 0.12) 100%);
                  border-color: rgba(139, 92, 246, 0.3);
                  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.15);
                  transform: translateY(-2px);
                }

                &:focus {
                  border-color: rgba(139, 92, 246, 0.5);
                  box-shadow: 0 4px 15px rgba(139, 92, 246, 0.2), 0 0 0 3px rgba(139, 92, 246, 0.1);
                }
              }

              .sort-menu {
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                margin-top: 8px;
                background: var(--el-bg-color);
                border: 2px solid rgba(139, 92, 246, 0.15);
                border-radius: 12px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(139, 92, 246, 0.1);
                backdrop-filter: blur(20px);
                z-index: 1000;
                overflow: hidden;
                animation: sortMenuFadeIn 0.3s ease;

                .sort-menu-header {
                  display: flex;
                  align-items: center;
                  gap: 8px;
                  padding: 12px 16px;
                  background: linear-gradient(135deg,
                      rgba(139, 92, 246, 0.05) 0%,
                      rgba(196, 132, 252, 0.08) 100%);
                  border-bottom: 1px solid rgba(139, 92, 246, 0.1);
                  font-size: 13px;
                  font-weight: 600;
                  color: var(--el-text-color-regular);

                  i {
                    color: rgba(139, 92, 246, 0.8);
                    font-size: 12px;
                  }
                }

                .sort-options {
                  padding: 8px;

                  .sort-option {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    width: 100%;
                    padding: 12px 12px;
                    margin-bottom: 4px;
                    border: none;
                    border-radius: 8px;
                    background: transparent;
                    color: var(--el-text-color-primary);
                    font-size: 14px;
                    cursor: pointer;
                    transition: all 0.3s ease;
                    position: relative;
                    overflow: hidden;

                    &:last-child {
                      margin-bottom: 0;
                    }

                    &::before {
                      content: '';
                      position: absolute;
                      top: 0;
                      left: -100%;
                      width: 100%;
                      height: 100%;
                      background: linear-gradient(90deg,
                          transparent 0%,
                          rgba(139, 92, 246, 0.1) 50%,
                          transparent 100%);
                      transition: left 0.5s ease;
                    }

                    >i {
                      color: rgba(139, 92, 246, 0.7);
                      font-size: 14px;
                      width: 16px;
                      flex-shrink: 0;
                    }

                    .option-content {
                      flex: 1;
                      text-align: left;

                      .option-label {
                        display: block;
                        font-weight: 500;
                        margin-bottom: 2px;
                      }

                      .option-desc {
                        display: block;
                        font-size: 12px;
                        color: var(--el-text-color-secondary);
                        opacity: 0.8;
                      }
                    }

                    .option-check {
                      color: #22c55e;
                      font-size: 14px;
                      opacity: 0;
                      transform: scale(0.8);
                      transition: all 0.3s ease;
                    }

                    &:hover {
                      background: rgba(139, 92, 246, 0.08);
                      color: var(--el-text-color-primary);
                      transform: translateX(4px);

                      &::before {
                        left: 100%;
                      }

                      >i {
                        color: rgba(139, 92, 246, 1);
                        transform: scale(1.1);
                      }

                      .option-desc {
                        opacity: 1;
                      }
                    }

                    &.active {
                      background: linear-gradient(135deg,
                          rgba(139, 92, 246, 0.15) 0%,
                          rgba(196, 132, 252, 0.12) 100%);
                      color: var(--el-text-color-primary);

                      >i {
                        color: #8b5cf6;
                        transform: scale(1.1);
                      }

                      .option-check {
                        opacity: 1;
                        transform: scale(1);
                      }

                      .option-desc {
                        color: var(--el-text-color-regular);
                        opacity: 1;
                      }
                    }
                  }
                }
              }
            }
          }

          @keyframes sortMenuFadeIn {
            from {
              opacity: 0;
              transform: translateY(-8px) scale(0.95);
            }

            to {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }
        }

        .header-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;

          @media (max-width: 768px) {
            flex-direction: column;
            align-items: stretch;
            gap: 12px;
          }

          .results-info {
            display: flex;
            align-items: center;
            gap: 12px;

            .results-count {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 16px;
              border-radius: 8px;
              font-size: 14px;
              font-weight: 600;
              background: linear-gradient(135deg,
                  rgba(139, 92, 246, 0.1) 0%,
                  rgba(196, 132, 252, 0.08) 100%);
              border: 1px solid rgba(139, 92, 246, 0.15);
              box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6);
              backdrop-filter: blur(8px);
              transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              position: relative;
              overflow: hidden;

              i {
                font-size: 12px;
                color: rgba(139, 92, 246, 0.8);
                opacity: 0.8;
              }

              .count-number {
                background: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
                background-size: 200% 100%;
                -webkit-background-clip: text;
                background-clip: text;
                -webkit-text-fill-color: transparent;
                color: transparent;
                font-weight: 700;
                animation: gradient-shift 3s ease-in-out infinite;
              }

              .count-text {
                color: var(--el-text-color-regular);
                font-weight: 500;
              }

              &::after {
                content: '';
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg,
                    transparent 0%,
                    rgba(139, 92, 246, 0.2) 50%,
                    transparent 100%);
                animation: shimmer 3s infinite;
              }

              &:hover {
                background: linear-gradient(135deg,
                    rgba(139, 92, 246, 0.15) 0%,
                    rgba(196, 132, 252, 0.12) 100%);
                border-color: rgba(139, 92, 246, 0.25);
                box-shadow: 0 4px 15px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.8);
                transform: translateY(-1px) scale(1.02);
              }
            }

            @keyframes gradient-shift {

              0%,
              100% {
                background-position: 200% center;
              }

              50% {
                background-position: 0% center;
              }
            }

            @keyframes shimmer {
              0% {
                left: -100%;
              }

              100% {
                left: 100%;
              }
            }

            .filter-tags {
              display: flex;
              gap: 6px;

              .filter-tag {
                display: flex;
                align-items: center;
                gap: 4px;
                padding: 4px 10px;
                background: linear-gradient(135deg,
                    rgba(139, 92, 246, 0.1) 0%,
                    rgba(196, 132, 252, 0.08) 100%);
                color: #8b5cf6;
                border-radius: 8px;
                font-size: 12px;
                font-weight: 500;
                border: 1px solid rgba(139, 92, 246, 0.15);
                backdrop-filter: blur(8px);

                i {
                  cursor: pointer;
                  opacity: 0.7;
                  font-size: 10px;
                  transition: all 0.3s ease;

                  &:hover {
                    opacity: 1;
                    transform: scale(1.1);
                  }
                }
              }
            }
          }

          .quick-filters {
            display: flex;
            gap: 8px;

            @media (max-width: 576px) {
              flex-wrap: wrap;
            }

            .quick-filter-btn {
              display: flex;
              align-items: center;
              gap: 5px;
              padding: 6px 12px;
              border: 1px solid rgba(139, 92, 246, 0.12);
              border-radius: 8px;
              background: linear-gradient(135deg,
                  var(--el-bg-color) 0%,
                  rgba(248, 250, 252, 0.9) 100%);
              color: var(--el-text-color-regular);
              font-size: 12px;
              font-weight: 500;
              cursor: pointer;
              transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
              backdrop-filter: blur(8px);

              &:hover {
                border-color: #8b5cf6;
                color: #8b5cf6;
                background: linear-gradient(135deg,
                    rgba(139, 92, 246, 0.05) 0%,
                    rgba(196, 132, 252, 0.08) 100%);
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(139, 92, 246, 0.15);
              }

              &.active {
                background: linear-gradient(135deg, #8b5cf6, #a855f7);
                border-color: #8b5cf6;
                color: white;
                transform: translateY(-1px);
                box-shadow: 0 6px 16px rgba(139, 92, 246, 0.25);

                &:hover {
                  transform: translateY(-2px);
                  box-shadow: 0 8px 20px rgba(139, 92, 246, 0.3);
                }
              }

              i {
                font-size: 11px;
              }
            }
          }
        }
      }

      .products-grid {
        padding: 0 20px 20px;
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
        gap: 20px;
        justify-content: start;

        @media (min-width: 1440px) {
          grid-template-columns: repeat(4, 1fr);
        }

        @media (max-width: 768px) {
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
          padding: 0 16px 16px;
        }

        @media (max-width: 480px) {
          grid-template-columns: 1fr;
          gap: 16px;
          padding: 0 16px 16px;
        }

        .product-item {
          width: 100%;
        }
      }
    }

    .load-more-container {
      display: flex;
      justify-content: center;
      margin-top: 40px;

      .load-more-btn {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 10px 20px;
        border: none;
        border-radius: 18px;
        background: var(--el-color-primary);
        color: white;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.3s ease;
        box-shadow: 0 2px 8px rgba(22, 119, 255, 0.2);

        &:hover {
          background: var(--el-color-primary-dark-2);
          box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
        }
      }
    }
  }
}

html.dark .shop-page {
  .shop-header {
    background: var(--el-bg-color);
    border-bottom-color: rgba(255, 255, 255, 0.08);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);

    .search-box {
      .search-input {
        background: rgba(55, 55, 58, 1) !important;
        color: rgba(255, 255, 255, 0.95) !important;
        border: 2px solid rgba(255, 255, 255, 0.12) !important;
        backdrop-filter: none !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;

        &:focus {
          background: rgba(68, 68, 71, 1) !important;
          border-color: rgba(139, 92, 246, 0.5) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3), 0 0 0 2px rgba(139, 92, 246, 0.3) !important;
          transform: translateY(-1px) !important;
        }

        &::placeholder {
          color: rgba(255, 255, 255, 0.6) !important;
        }
      }

      .search-btn {
        background: linear-gradient(135deg, rgba(255, 64, 255, 0.85), rgba(128, 0, 191, 0.85)) !important;
        box-shadow: 0 2px 8px rgba(128, 0, 191, 0.4) !important;

        &:hover {
          background: linear-gradient(135deg, rgba(255, 64, 255, 1), rgba(128, 0, 191, 1)) !important;
          box-shadow: 0 4px 15px rgba(128, 0, 191, 0.5) !important;
        }
      }
    }

    // 优化标题和副标题在暗色模式下的显示
    .page-title {
      background: linear-gradient(135deg,
          rgba(255, 255, 255, 0.95) 0%,
          rgba(139, 92, 246, 1) 100%) !important;
      background-size: 200% 100% !important;
      -webkit-background-clip: text !important;
      background-clip: text !important;
      -webkit-text-fill-color: transparent !important;
      color: transparent !important;
      filter: drop-shadow(0 2px 4px rgba(139, 92, 246, 0.3)) !important;

      i {
        background: linear-gradient(135deg, rgba(255, 64, 255, 1), rgba(168, 85, 247, 1)) !important;
        -webkit-background-clip: text !important;
        background-clip: text !important;
        -webkit-text-fill-color: transparent !important;
        color: transparent !important;
        filter: drop-shadow(0 2px 4px rgba(139, 92, 246, 0.4)) !important;
      }
    }

    .page-subtitle {
      color: rgba(255, 255, 255, 0.8) !important;

      &::before {
        background: linear-gradient(90deg,
            rgba(139, 92, 246, 0.8) 0%,
            rgba(196, 132, 252, 0.4) 100%) !important;
      }
    }
  }

  .results-header-container {
    // 彻底移除液态玻璃效果
    background: var(--el-bg-color) !important;
    backdrop-filter: none !important;
    border: 1px solid rgba(255, 255, 255, 0.08);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);

    // 移除所有::before和::after效果
    &::before {
      display: none !important;
    }

    &::after {
      display: none !important;
    }

    &:hover::before {
      display: none !important;
    }

    // 完全重写分类标签样式 - 扁平化无液态玻璃
    .category-tab {
      // 重置所有液态玻璃效果
      backdrop-filter: none !important;
      box-shadow: none !important;

      &:not(.active) {
        background: rgba(55, 55, 58, 1) !important;
        color: rgba(255, 255, 255, 0.9) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;

        &:hover {
          background: rgba(68, 68, 71, 1) !important;
          color: rgba(255, 255, 255, 1) !important;
          border-color: rgba(139, 92, 246, 0.5) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;

          .tab-count {
            background: rgba(139, 92, 246, 0.3) !important;
            color: rgba(255, 255, 255, 1) !important;
          }
        }

        .tab-count {
          background: rgba(139, 92, 246, 0.2) !important;
          color: rgba(139, 92, 246, 1) !important;
        }
      }

      // 激活状态保持原样，因为紫色渐变在暗色下是好看的
      &.active {
        background: linear-gradient(135deg, #8b5cf6, #a855f7) !important;
        border-color: #8b5cf6 !important;
        color: white !important;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3) !important;

        .tab-count {
          background: rgba(255, 255, 255, 0.25) !important;
          color: rgba(255, 255, 255, 0.95) !important;
        }
      }
    }

    // 完全重写快速筛选按钮样式
    .quick-filter-btn {
      backdrop-filter: none !important;
      box-shadow: none !important;

      &:not(.active) {
        background: rgba(55, 55, 58, 1) !important;
        color: rgba(255, 255, 255, 0.85) !important;
        border: 1px solid rgba(255, 255, 255, 0.1) !important;

        &:hover {
          background: rgba(68, 68, 71, 1) !important;
          color: rgba(255, 255, 255, 1) !important;
          border-color: rgba(139, 92, 246, 0.4) !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.25) !important;
        }
      }

      // 激活状态保持紫色渐变
      &.active {
        background: linear-gradient(135deg, #8b5cf6, #a855f7) !important;
        border-color: #8b5cf6 !important;
        color: white !important;
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3) !important;
      }
    }

    // 排序控件暗色模式
    .sort-controls {
      .sort-label {
        color: rgba(255, 255, 255, 0.9) !important;

        i {
          color: rgba(139, 92, 246, 1) !important;
        }
      }

      .sort-dropdown {
        .sort-trigger {
          background: rgba(55, 55, 58, 1) !important;
          color: rgba(255, 255, 255, 0.95) !important;
          border: 2px solid rgba(255, 255, 255, 0.12) !important;
          backdrop-filter: none !important;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;

          .current-sort i {
            color: rgba(139, 92, 246, 1) !important;
          }

          .dropdown-arrow {
            color: rgba(139, 92, 246, 0.8) !important;
          }

          &:hover {
            background: rgba(68, 68, 71, 1) !important;
            border-color: rgba(139, 92, 246, 0.5) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
            transform: translateY(-1px) !important;
          }

          &:focus {
            background: rgba(68, 68, 71, 1) !important;
            border-color: rgba(139, 92, 246, 0.7) !important;
            box-shadow: 0 6px 15px rgba(0, 0, 0, 0.4), 0 0 0 2px rgba(139, 92, 246, 0.3) !important;
            transform: translateY(-2px) !important;
          }
        }

        .sort-menu {
          background: rgba(28, 28, 30, 0.95) !important;
          border: 2px solid rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4), 0 2px 8px rgba(0, 0, 0, 0.3) !important;
          backdrop-filter: blur(20px) !important;

          .sort-menu-header {
            background: rgba(55, 55, 58, 0.8) !important;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;
            color: rgba(255, 255, 255, 0.9) !important;

            i {
              color: rgba(139, 92, 246, 1) !important;
            }
          }

          .sort-options {
            .sort-option {
              color: rgba(255, 255, 255, 0.95) !important;

              &::before {
                background: linear-gradient(90deg,
                    transparent 0%,
                    rgba(139, 92, 246, 0.2) 50%,
                    transparent 100%) !important;
              }

              >i {
                color: rgba(139, 92, 246, 0.8) !important;
              }

              .option-desc {
                color: rgba(255, 255, 255, 0.6) !important;
              }

              &:hover {
                background: rgba(139, 92, 246, 0.15) !important;
                color: rgba(255, 255, 255, 1) !important;

                >i {
                  color: rgba(139, 92, 246, 1) !important;
                }

                .option-desc {
                  color: rgba(255, 255, 255, 0.8) !important;
                }
              }

              &.active {
                background: rgba(139, 92, 246, 0.2) !important;
                color: rgba(255, 255, 255, 1) !important;

                >i {
                  color: #a855f7 !important;
                }

                .option-desc {
                  color: rgba(255, 255, 255, 0.9) !important;
                }
              }
            }
          }
        }
      }
    }

    // 商品数量显示暗色模式样式
    .results-info {
      .results-count {
        background: rgba(55, 55, 58, 1) !important;
        border: 1px solid rgba(255, 255, 255, 0.12) !important;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2) !important;
        backdrop-filter: none !important;

        i {
          color: rgba(139, 92, 246, 1) !important;
          opacity: 1 !important;
        }

        &::after {
          background: linear-gradient(90deg,
              transparent 0%,
              rgba(139, 92, 246, 0.3) 50%,
              transparent 100%) !important;
        }

        .count-text {
          color: rgba(255, 255, 255, 0.85) !important;
        }

        .count-number {
          background: linear-gradient(135deg, #a855f7 0%, #c084fc 100%) !important;
          background-size: 200% 100% !important;
          -webkit-background-clip: text !important;
          background-clip: text !important;
          -webkit-text-fill-color: transparent !important;
          color: transparent !important;
        }

        &:hover {
          background: rgba(68, 68, 71, 1) !important;
          border-color: rgba(139, 92, 246, 0.3) !important;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3) !important;
          transform: translateY(-1px) scale(1.02) !important;
        }
      }
    }

    // 修复"共找到"文字显示问题
    .results-info {
      .results-count {
        background: transparent !important;
        color: rgba(255, 255, 255, 0.95) !important;
        -webkit-background-clip: unset !important;
        background-clip: unset !important;
        -webkit-text-fill-color: rgba(255, 255, 255, 0.95) !important;
        filter: none !important;
        text-shadow: none !important;
      }

      .filter-tags .filter-tag {
        background: rgba(139, 92, 246, 0.25) !important;
        color: rgba(139, 92, 246, 1) !important;
        border-color: rgba(139, 92, 246, 0.4) !important;
        backdrop-filter: none !important;
        box-shadow: none !important;
      }
    }
  }
}
</style>
