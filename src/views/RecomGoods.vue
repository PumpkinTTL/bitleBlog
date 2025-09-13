<template>
  <div class="recom-goods-container">
    <div class="page-header">
      <h1 class="page-title">精选推荐</h1>
      <p class="page-desc">为您精心挑选的优质商品</p>
    </div>

    <el-row :gutter="20">
      <!-- 左侧导航和推荐区域 -->
      <el-col :xs="24" :sm="24" :md="6" :lg="5" class="left-sidebar">
        <!-- 分类导航 -->
        <div class="sidebar-section category-nav">
          <div class="section-header">
            <h3 class="section-title">商品分类</h3>
          </div>
          <el-menu
            :default-active="activeCategory"
            class="category-menu"
            @select="handleCategorySelect"
          >
            <el-menu-item v-for="category in categories" :key="category.value" :index="category.value">
              <el-icon>
                <component :is="category.icon" v-if="category.icon" />
                <img v-else-if="category.imgIcon" :src="category.imgIcon" class="custom-icon" />
                <Goods v-else />
              </el-icon>
              <span>{{ category.label }}</span>
            </el-menu-item>
          </el-menu>
        </div>

        <!-- 热门推荐 -->
        <div class="sidebar-section hot-recommend">
          <div class="section-header">
            <h3 class="section-title">热门推荐</h3>
          </div>
          <div class="hot-item" v-for="item in hotRecommends" :key="item.id" @click="viewDetail(item.id)">
            <el-image :src="item.image" fit="cover" class="hot-item-img"></el-image>
            <div class="hot-item-info">
              <h4 class="hot-item-title">{{ item.title }}</h4>
              <p class="hot-item-price">¥{{ item.price.toFixed(2) }}</p>
            </div>
          </div>
        </div>

        <!-- 最近浏览 -->
        <div class="sidebar-section recent-view">
          <div class="section-header">
            <h3 class="section-title">最近浏览</h3>
          </div>
          <div class="recent-items">
            <div class="recent-item" v-for="item in recentViews" :key="item.id" @click="viewDetail(item.id)">
              <el-image :src="item.image" fit="cover" class="recent-item-img"></el-image>
              <p class="recent-item-title">{{ item.title }}</p>
            </div>
          </div>
        </div>
      </el-col>

      <!-- 右侧商品列表区域 -->
      <el-col :xs="24" :sm="24" :md="18" :lg="19" class="right-content">
        <!-- 筛选和排序工具栏 -->
        <div class="filter-toolbar">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12">
              <el-input
                v-model="searchKeyword"
                placeholder="搜索商品"
                prefix-icon="Search"
                clearable
                @input="handleSearch"
              />
            </el-col>
            <el-col :xs="24" :sm="12" class="sort-options">
              <el-radio-group v-model="sortOption" size="default" @change="handleSort">
                <el-radio-button label="newest">最新</el-radio-button>
                <el-radio-button label="popular">热门</el-radio-button>
                <el-radio-button label="price-asc">价格↑</el-radio-button>
                <el-radio-button label="price-desc">价格↓</el-radio-button>
              </el-radio-group>
            </el-col>
          </el-row>
        </div>

        <!-- 商品列表 -->
        <div class="goods-list">
          <el-row :gutter="20">
            <el-col :xs="24" :sm="12" :md="8" :lg="6" v-for="item in displayGoods" :key="item.id" class="goods-col">
              <el-card class="goods-card" shadow="hover" :body-style="{ padding: '0px' }">
                <div class="goods-img-container">
                  <el-image :src="item.image" fit="cover" class="goods-img" loading="lazy">
                    <template #error>
                      <div class="image-error">
                        <el-icon><Picture /></el-icon>
                      </div>
                    </template>
                  </el-image>
                </div>
                <div class="goods-info">
                  <h3 class="goods-title">{{ item.title }}</h3>
                  <p class="goods-desc">{{ item.description }}</p>
                  
                  <!-- 标签和折扣 -->
                  <div class="goods-tags">
                    <span class="goods-tag" v-if="item.tag">{{ item.tag }}</span>
                    <span class="goods-discount-tag" v-if="item.discount">{{ item.discount }}折</span>
                  </div>
                  
                  <div class="goods-price-row">
                    <span class="goods-price">¥{{ item.price.toFixed(2) }}</span>
                    <span class="goods-original-price" v-if="item.originalPrice">¥{{ item.originalPrice.toFixed(2) }}</span>
                  </div>
                  <div class="goods-meta">
                    <span class="goods-sales"><el-icon><ShoppingCart /></el-icon> {{ item.sales }}人已购</span>
                    <span class="goods-rating"><el-icon><Star /></el-icon> {{ item.rating }}</span>
                  </div>
                  <div class="goods-actions">
                    <el-button type="primary" size="small" @click="viewDetail(item.id)">查看详情</el-button>
                    <el-button type="danger" size="small" @click="addToCart(item)">加入购物车</el-button>
                  </div>
                </div>
              </el-card>
            </el-col>
          </el-row>

          <!-- 加载更多 -->
          <div class="load-more" v-if="hasMoreGoods">
            <el-button :loading="loading" @click="loadMore">加载更多</el-button>
          </div>
          <el-empty v-if="displayGoods.length === 0" description="暂无商品" />
        </div>
      </el-col>
    </el-row>

    <!-- 返回顶部 -->
    <el-backtop :right="20" :bottom="20" />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { 
  Search, ShoppingCart, Star, Picture, 
  Menu, Monitor, House, Handbag, Reading, Goods 
} from '@element-plus/icons-vue'

// 分类数据
const categories = [
  { label: '全部商品', value: 'all', icon: 'Menu' },
  { label: '数码产品', value: 'digital', icon: 'Monitor' },
  { label: '家居生活', value: 'home', icon: 'House' },
  { label: '服饰鞋包', value: 'clothing', icon: 'Handbag' },
  { label: '美妆个护', value: 'beauty', imgIcon: '@/assets/icons/pro_fanli.png' },
  { label: '图书文具', value: 'books', icon: 'Reading' }
]

// 状态变量
const activeCategory = ref('all')
const searchKeyword = ref('')
const sortOption = ref('newest')
const loading = ref(false)
const page = ref(1)
const pageSize = ref(8)
const hasMoreGoods = ref(true)

// 热门推荐数据
const hotRecommends = ref([
  {
    id: 101,
    title: '便携式蓝牙音箱',
    price: 199,
    image: 'https://via.placeholder.com/300x300?text=Speaker'
  },
  {
    id: 102,
    title: '防晒霜SPF50',
    price: 129,
    image: 'https://via.placeholder.com/300x300?text=Sunscreen'
  },
  {
    id: 103,
    title: '轻便运动鞋',
    price: 359,
    image: 'https://via.placeholder.com/300x300?text=Shoes'
  },
  {
    id: 104,
    title: '多肉植物套装',
    price: 99,
    image: 'https://via.placeholder.com/300x300?text=Plants'
  }
])

// 最近浏览数据
const recentViews = ref([
  {
    id: 201,
    title: '手工皮质钱包',
    image: 'https://via.placeholder.com/300x300?text=Wallet'
  },
  {
    id: 202,
    title: '便携咖啡杯',
    image: 'https://via.placeholder.com/300x300?text=Cup'
  },
  {
    id: 203,
    title: '智能手表',
    image: 'https://via.placeholder.com/300x300?text=Watch'
  }
])

// 模拟商品数据
const allGoods = ref([
  {
    id: 1,
    title: '高性能机械键盘',
    description: '87键青轴机械键盘，RGB背光，适合游戏和办公',
    price: 299,
    originalPrice: 399,
    image: 'https://via.placeholder.com/300x300?text=Keyboard',
    category: 'digital',
    tag: '热卖',
    discount: 7.5,
    sales: 1256,
    rating: 4.8
  },
  {
    id: 2,
    title: '人体工学办公椅',
    description: '可调节高度和靠背，舒适透气，缓解久坐疲劳',
    price: 899,
    originalPrice: 1299,
    image: 'https://via.placeholder.com/300x300?text=Chair',
    category: 'home',
    tag: '新品',
    discount: 6.9,
    sales: 568,
    rating: 4.7
  },
  {
    id: 3,
    title: '轻薄笔记本电脑',
    description: '13.3英寸全面屏，16GB内存，512GB固态硬盘',
    price: 5999,
    originalPrice: 6999,
    image: 'https://via.placeholder.com/300x300?text=Laptop',
    category: 'digital',
    tag: '限时',
    discount: 8.5,
    sales: 892,
    rating: 4.9
  },
  {
    id: 4,
    title: '纯棉休闲T恤',
    description: '100%纯棉面料，舒适透气，多色可选',
    price: 99,
    originalPrice: 129,
    image: 'https://via.placeholder.com/300x300?text=Tshirt',
    category: 'clothing',
    tag: '',
    discount: 7.7,
    sales: 2356,
    rating: 4.6
  },
  {
    id: 5,
    title: '保湿面霜套装',
    description: '深层滋养，补水保湿，适合干性肌肤',
    price: 199,
    originalPrice: 259,
    image: 'https://via.placeholder.com/300x300?text=Cream',
    category: 'beauty',
    tag: '爆款',
    discount: 7.7,
    sales: 1856,
    rating: 4.8
  },
  {
    id: 6,
    title: '畅销小说合集',
    description: '当代文学经典作品，精装硬壳，收藏版',
    price: 168,
    originalPrice: 198,
    image: 'https://via.placeholder.com/300x300?text=Books',
    category: 'books',
    tag: '',
    discount: 8.5,
    sales: 756,
    rating: 4.9
  },
  {
    id: 7,
    title: '智能手表',
    description: '心率监测，睡眠分析，50米防水，续航7天',
    price: 799,
    originalPrice: 999,
    image: 'https://via.placeholder.com/300x300?text=Watch',
    category: 'digital',
    tag: '热卖',
    discount: 8.0,
    sales: 1568,
    rating: 4.7
  },
  {
    id: 8,
    title: '多功能料理锅',
    description: '一锅多用，智能控温，易清洁，适合小家庭',
    price: 399,
    originalPrice: 599,
    image: 'https://via.placeholder.com/300x300?text=Pot',
    category: 'home',
    tag: '特价',
    discount: 6.7,
    sales: 986,
    rating: 4.6
  },
  {
    id: 9,
    title: '无线蓝牙耳机',
    description: '主动降噪，40小时续航，舒适佩戴',
    price: 499,
    originalPrice: 699,
    image: 'https://via.placeholder.com/300x300?text=Headphones',
    category: 'digital',
    tag: '新品',
    discount: 7.1,
    sales: 1245,
    rating: 4.8
  },
  {
    id: 10,
    title: '真丝睡衣套装',
    description: '100%桑蚕丝，柔软亲肤，优雅舒适',
    price: 599,
    originalPrice: 799,
    image: 'https://via.placeholder.com/300x300?text=Pajamas',
    category: 'clothing',
    tag: '',
    discount: 7.5,
    sales: 568,
    rating: 4.9
  },
  {
    id: 11,
    title: '精华液套装',
    description: '修复受损肌肤，提亮肤色，改善肤质',
    price: 399,
    originalPrice: 499,
    image: 'https://via.placeholder.com/300x300?text=Serum',
    category: 'beauty',
    tag: '热卖',
    discount: 8.0,
    sales: 2156,
    rating: 4.7
  },
  {
    id: 12,
    title: '创意笔记本文具套装',
    description: '高质量纸张，环保材质，送精美贴纸',
    price: 89,
    originalPrice: 119,
    image: 'https://via.placeholder.com/300x300?text=Notebook',
    category: 'books',
    tag: '',
    discount: 7.5,
    sales: 856,
    rating: 4.6
  }
])

// 过滤和排序后的商品
const filteredGoods = computed(() => {
  let result = [...allGoods.value]
  
  // 分类过滤
  if (activeCategory.value !== 'all') {
    result = result.filter(item => item.category === activeCategory.value)
  }
  
  // 关键词搜索
  if (searchKeyword.value) {
    const keyword = searchKeyword.value.toLowerCase()
    result = result.filter(item => 
      item.title.toLowerCase().includes(keyword) || 
      item.description.toLowerCase().includes(keyword)
    )
  }
  
  // 排序
  switch (sortOption.value) {
    case 'newest':
      result.sort((a, b) => b.id - a.id)
      break
    case 'popular':
      result.sort((a, b) => b.sales - a.sales)
      break
    case 'price-asc':
      result.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      result.sort((a, b) => b.price - a.price)
      break
  }
  
  return result
})

// 当前显示的商品
const displayGoods = computed(() => {
  return filteredGoods.value.slice(0, page.value * pageSize.value)
})

// 处理分类选择
const handleCategorySelect = (index) => {
  activeCategory.value = index
  page.value = 1
  checkHasMore()
}

// 处理分类变化
const handleCategoryChange = () => {
  page.value = 1
  checkHasMore()
}

// 处理搜索
const handleSearch = () => {
  page.value = 1
  checkHasMore()
}

// 处理排序
const handleSort = () => {
  page.value = 1
  checkHasMore()
}

// 加载更多
const loadMore = () => {
  loading.value = true
  setTimeout(() => {
    page.value++
    checkHasMore()
    loading.value = false
  }, 800)
}

// 检查是否还有更多商品
const checkHasMore = () => {
  hasMoreGoods.value = displayGoods.value.length < filteredGoods.value.length
}

// 查看商品详情
const viewDetail = (id) => {
  ElMessage.success(`查看商品详情：${id}`)
  // 这里可以添加路由跳转逻辑
}

// 添加到购物车
const addToCart = (item) => {
  ElMessage.success(`已将 ${item.title} 添加到购物车`)
  // 这里可以添加购物车逻辑
}

onMounted(() => {
  checkHasMore()
})
</script>

<style scoped>
.recom-goods-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 30px;
}

.page-title {
  font-size: 28px;
  color: #303133;
  margin-bottom: 10px;
}

.page-desc {
  font-size: 16px;
  color: #909399;
}

/* 左侧边栏样式 */
.left-sidebar {
  margin-bottom: 20px;
}

.sidebar-section {
  background-color: #fff;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.section-header {
  padding: 15px;
  border-bottom: 1px solid #f0f0f0;
}

.section-title {
  margin: 0;
  font-size: 16px;
  color: #303133;
  font-weight: 600;
}

.category-menu {
  border-right: none;
}

.custom-icon {
  width: 16px;
  height: 16px;
  vertical-align: middle;
}

.hot-item {
  display: flex;
  padding: 10px 15px;
  border-bottom: 1px solid #f0f0f0;
  cursor: pointer;
  transition: background-color 0.3s;
}

.hot-item:last-child {
  border-bottom: none;
}

.hot-item:hover {
  background-color: #f5f7fa;
}

.hot-item-img {
  width: 50px;
  height: 50px;
  border-radius: 4px;
  object-fit: cover;
  margin-right: 10px;
}

.hot-item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.hot-item-title {
  margin: 0;
  font-size: 14px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.hot-item-price {
  margin: 0;
  font-size: 14px;
  color: #f56c6c;
  font-weight: bold;
}

.recent-items {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}

.recent-item {
  width: 33.33%;
  padding: 5px;
  text-align: center;
  cursor: pointer;
}

.recent-item-img {
  width: 100%;
  height: 60px;
  border-radius: 4px;
  object-fit: cover;
  margin-bottom: 5px;
}

.recent-item-title {
  margin: 0;
  font-size: 12px;
  color: #606266;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 右侧内容区样式 */
.right-content {
  margin-bottom: 20px;
}

.filter-toolbar {
  background-color: #fff;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.sort-options {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
}

.goods-list {
  margin-bottom: 20px;
}

.goods-col {
  margin-bottom: 20px;
}

.goods-card {
  height: 100%;
  transition: all 0.3s;
  border-radius: 8px;
  overflow: hidden;
}

.goods-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
}

.goods-img-container {
  position: relative;
  height: 180px;
  overflow: hidden;
}

.goods-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s;
}

.goods-card:hover .goods-img {
  transform: scale(1.05);
}

.goods-info {
  padding: 15px;
}

.goods-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  margin: 0 0 8px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.goods-desc {
  font-size: 14px;
  color: #606266;
  margin-bottom: 10px;
  height: 40px;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.goods-tags {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
}

.goods-tag {
  display: inline-block;
  background-color: #ecf5ff;
  color: #409eff;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #d9ecff;
}

.goods-discount-tag {
  display: inline-block;
  background-color: #fff0f0;
  color: #f56c6c;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  border: 1px solid #ffdbdb;
}

.goods-price-row {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.goods-price {
  font-size: 18px;
  font-weight: bold;
  color: #f56c6c;
  margin-right: 8px;
}

.goods-original-price {
  font-size: 14px;
  color: #909399;
  text-decoration: line-through;
}

.goods-meta {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #909399;
  margin-bottom: 15px;
}

.goods-sales, .goods-rating {
  display: flex;
  align-items: center;
}

.goods-meta .el-icon {
  margin-right: 4px;
}

.goods-actions {
  display: flex;
  justify-content: space-between;
}

.load-more {
  text-align: center;
  margin-top: 20px;
}

.image-error {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f5f7fa;
  color: #909399;
  font-size: 30px;
}

/* 响应式调整 */
@media (max-width: 992px) {
  .sort-options {
    justify-content: flex-start;
  }
  
  .recent-item {
    width: 50%;
  }
}

@media (max-width: 768px) {
  .goods-actions {
    flex-direction: column;
    gap: 10px;
    align-items: stretch;
  }
  
  .goods-actions .el-button {
    width: 100%;
    margin-left: 0 !important;
    margin-right: 0 !important;
  }
}

@media (max-width: 576px) {
  .page-title {
    font-size: 24px;
  }
  
  .page-desc {
    font-size: 14px;
  }
  
  .filter-toolbar {
    padding: 10px;
  }
  
  .goods-img-container {
    height: 160px;
  }
}
</style>