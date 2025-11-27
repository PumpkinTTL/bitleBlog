<template>
  <div class="person-center-page">
    <!-- 主要内容区 -->
    <div class="page-container">
      <div class="content-wrapper">
        <!-- 第一行：个人信息 + 打卡 | 标签页 -->
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="8" :lg="6" :xl="6">
            <PersonInfoCard />
            <DailyCheckIn style="margin-top: 20px;" @checkIn="handleCheckIn" />
          </el-col>
          <el-col :xs="24" :sm="24" :md="16" :lg="18" :xl="18">
            <el-tabs v-model="activeTab" class="content-tabs">
          <el-tab-pane label="我的文章" name="articles">
            <ArticlesList
              @view="handleViewArticle"
              @edit="handleEditArticle"
              @delete="handleDeleteArticle"
              @create="handleCreateArticle"
            />
          </el-tab-pane>
          
          <el-tab-pane label="我的收藏" name="favorites">
            <FavoritesList
              @view="handleViewFavorite"
              @uncollect="handleUncollect"
              @share="handleShare"
              @browse="handleBrowse"
            />
          </el-tab-pane>
          
          <el-tab-pane label="账号设置" name="settings">
            <AccountSettings />
          </el-tab-pane>
        </el-tabs>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { smartMessage } from '@/components/modal'

// 获取smartMessage，优先使用全局属性，fallback到导入的函数
const getSmartMessage = () => {
  const instance = getCurrentInstance()
  return instance?.proxy?.$smartMessage || (window as any).$smartMessage || smartMessage
}

// 导入组件
import PersonInfoCard from '@/components/person/PersonInfoCard.vue'
import DailyCheckIn from '@/components/person/DailyCheckIn.vue'
import ArticlesList from '@/components/person/ArticlesList.vue'
import FavoritesList from '@/components/person/FavoritesList.vue'
import AccountSettings from '@/components/person/AccountSettings.vue'

const router = useRouter()
const store = useStore()
const activeTab = ref('articles')

// 文章相关事件
const handleViewArticle = (article: any) => {
  router.push(`/blogDetail/${article.id}`)
}

const handleEditArticle = (article: any) => {
  router.push(`/write?id=${article.id}`)
}

const handleDeleteArticle = (article: any) => {
  getSmartMessage().warning(`删除文章: ${article.title}`)
}

const handleCreateArticle = () => {
  router.push('/write')
}

// 收藏相关事件
const handleViewFavorite = (favorite: any) => {
  getSmartMessage().info(`查看收藏: ${favorite.title}`)
}

const handleUncollect = (favorite: any) => {
  getSmartMessage().success(`已取消收藏: ${favorite.title}`)
}

const handleShare = (favorite: any) => {
  getSmartMessage().info(`分享: ${favorite.title}`)
}

const handleBrowse = () => {
  router.push('/index')
}

// 打卡相关事件
const handleCheckIn = () => {
  getSmartMessage().success('打卡成功！获得 +5 积分')
}

// AccountSettings组件已经通过store.$patch直接更新store，不需要父组件处理
</script>

<style lang="less" scoped>
.person-center-page {
  min-height: 100vh;
  background: var(--el-bg-color-page);
}

.page-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 20px;
  animation: fadeIn 0.8s ease-out;

  @media (max-width: 768px) {
    padding: 16px 12px;
  }
}

// 内容包装器
.content-wrapper {
  animation: slideInUp 0.6s ease-out;
  
  @media (max-width: 768px) {
    animation: fadeIn 0.5s ease-out;
    
    // 移动端每个卡片间距
    :deep(.el-col) {
      margin-bottom: 20px;
      
      &:last-child {
        margin-bottom: 0;
      }
    }
  }
}

// 标签页样式
.content-tabs {
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
  overflow: hidden;
  
  :deep(.el-tabs__header) {
    margin: 0;
    padding: 0 20px;
    background: var(--el-fill-color-extra-light);
    border-bottom: 1px solid var(--el-border-color-extra-light);
  }

  :deep(.el-tabs__nav-wrap) {
    &::after {
      display: none;
    }
  }

  :deep(.el-tabs__item) {
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-regular);
    padding: 0 20px;
    height: 48px;
    line-height: 48px;
    transition: all 0.3s ease;

    &:hover {
      color: var(--theme-purple-primary);
    }

    &.is-active {
      color: var(--theme-purple-primary);
      font-weight: 600;
    }
  }

  :deep(.el-tabs__active-bar) {
    height: 2px;
    background: linear-gradient(90deg, var(--theme-purple-primary), var(--theme-purple-secondary));
    border-radius: 2px;
  }

  :deep(.el-tabs__content) {
    padding: 0;
  }

  :deep(.el-tab-pane) {
    animation: fadeIn 0.5s ease-out;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// 响应式调整
@media (max-width: 1200px) {
  .page-container {
    max-width: 100%;
  }
}

@media (max-width: 992px) {
  .content-tabs {
    :deep(.el-tabs__item) {
      padding: 0 16px;
      font-size: 14px;
    }
  }
}

@media (max-width: 768px) {
  .content-tabs {
    :deep(.el-tabs__header) {
      padding: 0 12px;
    }

    :deep(.el-tabs__item) {
      padding: 0 12px;
      height: 44px;
      line-height: 44px;
      font-size: 13px;
    }
  }
}
</style>
