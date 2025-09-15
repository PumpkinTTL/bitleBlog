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
              <input 
                v-model="searchKeyword" 
                type="text" 
                placeholder="搜索商品..."
                class="search-input"
                @keyup.enter="handleSearch"
              >
              <button class="search-btn" @click="handleSearch">
                <i class="fas fa-search"></i>
              </button>
            </div>
            
            <div class="view-controls">
              <button 
                class="view-btn" 
                :class="{ 'active': viewMode === 'grid' }"
                @click="handleViewModeChange('grid')"
              >
                <i class="fas fa-th-large"></i>
              </button>
              <button 
                class="view-btn" 
                :class="{ 'active': viewMode === 'list' }"
                @click="handleViewModeChange('list')"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主体内容区域 -->
    <div class="shop-content">
      <div class="container">
        <div class="content-layout">
          <!-- 侧边栏 -->
          <div class="sidebar">
            <div class="sidebar-container animate__animated animate__fadeInLeft">
              <!-- 分类筛选 -->
              <div class="filter-widget">
                <div class="widget-header">
                  <i class="fas fa-filter"></i>
                  <span>商品分类</span>
                </div>
                <div class="category-list">
                  <div 
                    v-for="category in categories" 
                    :key="category.id" 
                    class="category-item"
                    :class="{ 'active': currentCategory === category.id }"
                    @click="handleCategoryChange(category.id)"
                  >
                    <div class="category-icon" :style="{ background: category.color }">
                      <i :class="category.icon"></i>
                    </div>
                    <div class="category-info">
                      <span class="category-name">{{ category.name }}</span>
                      <span class="category-count">{{ category.count }}</span>
                    </div>
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
          <!-- 商品区域 -->
          <div class="main-content">
            <!-- 筛选结果提示 -->
            <div class="results-header animate__animated animate__fadeIn">
              <div class="results-left">
                <div class="results-info">
                  <span class="results-count">共找到 {{ filteredProducts.length }} 款商品</span>
                  <span v-if="currentCategory !== 'all'" class="filter-tags">
                    <span class="filter-tag">
                      {{ getCategoryName(currentCategory) }}
                      <i class="fas fa-times" @click="handleCategoryChange('all')"></i>
                    </span>
                  </span>
                </div>
                
                <div class="quick-filters">
                  <button 
                    v-for="filter in quickFilters" 
                    :key="filter.key" 
                    class="quick-filter-btn"
                    :class="{ 'active': activeFilters.includes(filter.key) }"
                    @click="toggleQuickFilter(filter.key)"
                  >
                    <i :class="filter.icon"></i>
                    <span>{{ filter.label }}</span>
                  </button>
                </div>
              </div>
              
              <div class="results-right">
                <div class="sort-controls">
                  <span class="sort-label">排序：</span>
                  <select 
                    v-model="currentSort" 
                    class="sort-select"
                    @change="handleSortChange(currentSort)"
                  >
                    <option 
                      v-for="option in sortOptions" 
                      :key="option.value" 
                      :value="option.value"
                    >
                      {{ option.label }}
                    </option>
                  </select>
                </div>
              </div>
            </div>
            
            <!-- 商品网格 -->
            <div class="products-grid" :class="{ 'list-view': viewMode === 'list' }">
              <ProductCard
                v-for="(product, index) in paginatedProducts"
                :key="product.id"
                :product="product"
                :animation-delay="index * 50"
                @product-click="handleProductClick"
                @primary-action="handlePrimaryAction"
                @favorite="handleFavorite"
                @share="handleShare"
                @tag-click="handleTagClick"
                class="product-item animate__animated animate__fadeInUp"
              />
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
const viewMode = ref<'grid' | 'list'>('grid')
const activeFilters = ref<string[]>([])
const currentPage = ref(1)
const pageSize = ref(12)

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
    icon: 'fas fa-code',
    gradient: '#f1f5f9',
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
    icon: 'fas fa-toolbox',
    gradient: '#f1f5f9',
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
    icon: 'fas fa-paper-plane',
    gradient: '#f1f5f9',
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
    icon: 'fas fa-paint-brush',
    gradient: '#f1f5f9',
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
    icon: 'fas fa-vector-square',
    gradient: '#f1f5f9',
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
    icon: 'fas fa-bezier-curve',
    gradient: '#f1f5f9',
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
  { label: '综合排序', value: 'popularity' },
  { label: '最新上架', value: 'newest' },
  { label: '价格从低到高', value: 'price-asc' },
  { label: '价格从高到低', value: 'price-desc' },
  { label: '评分最高', value: 'rating' },
  { label: '销量最高', value: 'sales' }
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
  console.log('排序改变:', sortValue)
}

const handleViewModeChange = (mode: 'grid' | 'list') => {
  viewMode.value = mode
  console.log('视图模式:', mode)
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
  
  // 商城头部
  .shop-header {
    background: var(--el-bg-color);
    padding: 20px 0;
    border-bottom: 1px solid #f1f5f9;
    
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
        gap: 10px;
        font-size: 24px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin-bottom: 6px;
        
        i {
          color: var(--el-color-primary);
          font-size: 20px;
        }
        
        @media (max-width: 768px) {
          font-size: 28px;
          justify-content: center;
        }
      }
      
      .page-subtitle {
        font-size: 16px;
        color: var(--el-text-color-regular);
        margin: 0;
        
        @media (max-width: 768px) {
          text-align: center;
          font-size: 14px;
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
        width: 280px;
        height: 36px;
        padding: 0 45px 0 14px;
        border: 1px solid #e2e8f0;
        border-radius: 18px;
        background: var(--el-bg-color);
        font-size: 14px;
        outline: none;
        transition: all 0.3s ease;
        
        &:focus {
          border-color: var(--el-color-primary);
          box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
        }
        
        &::placeholder {
          color: var(--el-text-color-placeholder);
        }
        
        @media (max-width: 576px) {
          width: 240px;
        }
      }
      
      .search-btn {
        position: absolute;
        right: 3px;
        top: 3px;
        width: 30px;
        height: 30px;
        border: none;
        border-radius: 50%;
        background: var(--el-color-primary);
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:hover {
          transform: scale(1.05);
          box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
        }
      }
    }
    
    .view-controls {
      display: flex;
      background: rgba(255, 255, 255, 0.6);
      backdrop-filter: blur(8px);
      border-radius: 12px;
      border: 0.5px solid rgba(0, 0, 0, 0.08);
      overflow: hidden;
      
      .view-btn {
        width: 40px;
        height: 40px;
        border: none;
        background: transparent;
        color: var(--el-text-color-regular);
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        
        &:hover {
          background: rgba(22, 119, 255, 0.1);
          color: var(--el-color-primary);
        }
        
        &.active {
          background: var(--el-color-primary);
          color: white;
        }
      }
    }
  }
  
  // 主体内容
  .shop-content {
    padding: 30px 0;
    
    .container {
      max-width: 1440px;
      margin: 0 auto;
      padding: 0 20px;
    }
    
    .content-layout {
      display: flex;
      gap: 30px;
      
      @media (max-width: 1024px) {
        flex-direction: column;
        gap: 20px;
      }
    }
  }
  
  // 侧边栏
  .sidebar {
    width: 280px;
    flex-shrink: 0;
    
    @media (max-width: 1024px) {
      width: 100%;
    }
    
    .sidebar-container {
      position: sticky;
      top: 30px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      
      @media (max-width: 1024px) {
        position: static;
        flex-direction: row;
        overflow-x: auto;
        gap: 16px;
        padding-bottom: 10px;
      }
      
      @media (max-width: 768px) {
        flex-direction: column;
      }
    }
  }
  
  // 筛选组件
  .filter-widget {
    background: var(--el-bg-color);
    border-radius: 12px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04);
    overflow: hidden;
    margin-bottom: 20px;
    
    @media (max-width: 1024px) {
      min-width: 250px;
    }
    
    .widget-header {
      padding: 15px;
      border-bottom: 1px solid #f1f5f9;
      display: flex;
      align-items: center;
      gap: 10px;
      font-size: 15px;
      font-weight: 600;
      color: #1e293b;
      
      i {
        font-size: 16px;
        color: #1677FF;
      }
    }
    
    .category-list {
      padding: 12px;
      
      .category-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 8px 0;
        border-bottom: 1px solid #f8fafc;
        cursor: pointer;
        transition: all 0.3s ease;
        
        &:last-child {
          border-bottom: none;
        }
        
        &:hover {
          transform: translateX(3px);
        }
        
        &.active {
          .category-name {
            color: #1677FF;
            font-weight: 600;
          }
        }
        
        .category-icon {
          width: 32px;
          height: 32px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 14px;
          opacity: 0.9;
        }
        
        .category-info {
          flex: 1;
          display: flex;
          justify-content: space-between;
          align-items: center;
          
          .category-name {
            font-size: 14px;
            font-weight: 500;
            color: #374151;
          }
          
          .category-count {
            font-size: 11px;
            color: #9ca3af;
            background: #f9fafb;
            padding: 2px 6px;
            border-radius: 4px;
            border: 1px solid #f3f4f6;
          }
        }
      }
    }
    
  }
  
  // 主内容区
  .main-content {
    flex: 1;
    min-width: 0;
    
    .results-header {
      background: var(--el-bg-color);
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
      padding: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 20px;
      
      @media (max-width: 768px) {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
        padding: 14px;
      }
      
      .results-left {
        display: flex;
        flex-direction: column;
        gap: 12px;
        flex: 1;
        
        .results-info {
          display: flex;
          align-items: center;
          gap: 12px;
          
          .results-count {
            font-size: 15px;
            font-weight: 600;
            color: #1e293b;
          }
          
          .filter-tags {
            display: flex;
            gap: 6px;
            
            .filter-tag {
              display: flex;
              align-items: center;
              gap: 4px;
              padding: 4px 8px;
              background: #f1f5f9;
              color: #1677FF;
              border-radius: 6px;
              font-size: 12px;
              font-weight: 500;
              border: 1px solid rgba(22, 119, 255, 0.1);
              
              i {
                cursor: pointer;
                opacity: 0.7;
                font-size: 10px;
                
                &:hover {
                  opacity: 1;
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
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            background: #ffffff;
            color: #64748b;
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.3s ease;
            
            &:hover {
              border-color: #1677FF;
              color: #1677FF;
              background: #f8faff;
            }
            
            &.active {
              background: #1677FF;
              border-color: #1677FF;
              color: white;
            }
            
            i {
              font-size: 11px;
            }
          }
        }
      }
      
      .results-right {
        display: flex;
        align-items: center;
        flex-shrink: 0;
        
        .sort-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .sort-label {
            font-size: 14px;
            color: #64748b;
            font-weight: 500;
            white-space: nowrap;
          }
          
          .sort-select {
            padding: 6px 10px;
            border: 1px solid #e2e8f0;
            border-radius: 6px;
            background: #ffffff;
            color: #1e293b;
            font-size: 13px;
            font-weight: 500;
            cursor: pointer;
            outline: none;
            transition: all 0.3s ease;
            min-width: 140px;
            
            &:hover {
              border-color: #1677FF;
            }
            
            &:focus {
              border-color: #1677FF;
              box-shadow: 0 0 0 3px rgba(22, 119, 255, 0.1);
            }
            
            option {
              padding: 8px;
              color: #1e293b;
              background: #ffffff;
            }
          }
        }
      }
    }
    
    .products-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, 280px);
      gap: 20px;
      justify-content: start;
      
      @media (max-width: 768px) {
        grid-template-columns: repeat(auto-fill, 260px);
        gap: 16px;
        justify-content: center;
      }
      
      @media (max-width: 480px) {
        grid-template-columns: 1fr;
        gap: 16px;
        justify-content: stretch;
      }
      
      &.list-view {
        grid-template-columns: 1fr;
        justify-content: stretch;
        
        .product-item {
          max-width: none;
        }
      }
      
      .product-item {
        width: 100%;
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

// 暗色模式适配
html.dark .shop-page {
  .shop-header {
    background: linear-gradient(135deg, 
      rgba(28, 28, 30, 0.95) 0%,
      rgba(44, 44, 46, 0.9) 100%
    );
    border-bottom-color: rgba(255, 255, 255, 0.08);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.4),
      0 1px 0 rgba(255, 255, 255, 0.05),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
  
  .filter-widget {
    background: rgba(28, 28, 30, 0.9);
    border-color: rgba(255, 255, 255, 0.06);
    box-shadow: 
      0 8px 32px rgba(0, 0, 0, 0.3),
      0 1px 0 rgba(255, 255, 255, 0.03),
      inset 0 1px 0 rgba(255, 255, 255, 0.06);
  }
}
</style>
