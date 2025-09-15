<template>
  <div class="shop-container">
     商城界面
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { ElRow, ElCol, ElMessage } from 'element-plus'
import ShopBanner from '@/components/shop/ShopBanner.vue'
import ProductGrid from '@/components/shop/ProductGrid.vue'
import ShopSidebar from '@/components/shop/ShopSidebar.vue'

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

// 分类数据
const categories = ref<Category[]>([
  {
    id: 'all',
    name: '全部',
    icon: 'fas fa-th-large',
    color: 'linear-gradient(135deg, #667eea, #764ba2)',
    count: 128
  },
  {
    id: 'dev-tools',
    name: '开发工具',
    icon: 'fas fa-code',
    color: 'linear-gradient(135deg, #f093fb, #f5576c)',
    count: 32
  },
  {
    id: 'design',
    name: '设计资源',
    icon: 'fas fa-palette',
    color: 'linear-gradient(135deg, #4facfe, #00f2fe)',
    count: 24
  },
  {
    id: 'services',
    name: '在线服务',
    icon: 'fas fa-cloud',
    color: 'linear-gradient(135deg, #43e97b, #38f9d7)',
    count: 18
  },
  {
    id: 'software',
    name: '软件许可',
    icon: 'fas fa-key',
    color: 'linear-gradient(135deg, #fa709a, #fee140)',
    count: 28
  },
  {
    id: 'api',
    name: 'API接口',
    icon: 'fas fa-plug',
    color: 'linear-gradient(135deg, #a8edea, #fed6e3)',
    count: 16
  },
  {
    id: 'resources',
    name: '数字资源',
    icon: 'fas fa-download',
    color: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
    count: 10
  }
])

// 商品数据
const products = ref<Product[]>([
  // 开发工具类
  {
    id: 1,
    name: 'VS Code 专业版',
    description: '强大的代码编辑器，支持丰富插件生态，提升开发效率',
    icon: 'fas fa-code',
    gradient: 'linear-gradient(135deg, #007ACC, #005A9E)',
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
    gradient: 'linear-gradient(135deg, #000000, #434343)',
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
    gradient: 'linear-gradient(135deg, #FF6C37, #FF8C42)',
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
    gradient: 'linear-gradient(135deg, #FF0000, #CC0000)',
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
    gradient: 'linear-gradient(135deg, #FDB300, #FDCB01)',
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
    gradient: 'linear-gradient(135deg, #A259FF, #F24E1E)',
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
    gradient: 'linear-gradient(135deg, #333333, #24292e)',
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
    gradient: 'linear-gradient(135deg, #000000, #111111)',
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
    gradient: 'linear-gradient(135deg, #0078D4, #106EBE)',
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
    gradient: 'linear-gradient(135deg, #0078D4, #00BCF2)',
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
    gradient: 'linear-gradient(135deg, #10A37F, #1A7F64)',
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
    gradient: 'linear-gradient(135deg, #00A6FB, #0582CA)',
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
    gradient: 'linear-gradient(135deg, #4ECDC4, #44A08D)',
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
    gradient: 'linear-gradient(135deg, #667eea, #764ba2)',
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

// 事件处理函数
const handleSearch = (keyword: string) => {
  searchKeyword.value = keyword
  console.log('搜索:', keyword)
}

const handleCategoryChange = (categoryId: string) => {
  currentCategory.value = categoryId
  console.log('分类切换:', categoryId)
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

const handleSortChange = (sort: string) => {
  console.log('排序改变:', sort)
}

const handleViewModeChange = (mode: 'grid' | 'list') => {
  console.log('视图模式:', mode)
}

const handleResetFilters = () => {
  searchKeyword.value = ''
  currentCategory.value = 'all'
  console.log('重置筛选')
}

// 侧边栏事件处理
const handleNavClick = (item: any) => {
  console.log('导航点击:', item)
}

const handleSidebarProductClick = (product: Product) => {
  console.log('侧边栏商品点击:', product)
  handleProductClick(product)
}

const handlePromotionClick = (promotion: any) => {
  console.log('优惠活动点击:', promotion)
}

const handleHelpClick = (help: any) => {
  console.log('帮助点击:', help)
}

const handleContactService = () => {
  console.log('联系客服')
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
.shop-container {
  min-height: 100vh;
  
  .shop-main {
    max-width: 1440px;
    margin: 0 auto;
    padding: 24px 20px;

    .sidebar-container {
      position: sticky;
      top: 24px;
      
      @media (max-width: 768px) {
        position: static;
        margin-top: 20px;
      }
    }
  }

  // 响应式设计
  @media (max-width: 1480px) {
    .shop-main {
      padding: 24px 20px;
    }
  }

  @media (max-width: 768px) {
    .shop-main {
      padding: 20px 16px;
    }
  }

  @media (max-width: 480px) {
    .shop-main {
      padding: 16px 12px;
    }
  }
}

// 深色模式适配
.dark {
  .shop-container {
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%);
  }
}
</style>
