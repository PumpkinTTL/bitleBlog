<template>
  <div class="resource-grid">
    <!-- 资源列表 -->
    <a-spin :spinning="loading">
      <div v-if="resources.length > 0">
        <div class="grid-container">
          <div v-for="(resource, index) in resources" :key="resource.id || index"
            class="resource-card animate__animated animate__fadeInUp" :class="{ 'featured': resource.featured }"
            :style="{'animation-delay': `${index * 0.05}s`}">
            <div class="card-inner">
              <div class="card-cover" @click="onDetailsClick(resource)">
                <img class="cover-image" :src="resource.imageUrl" :onerror="'this.src=\'' + defaultImage + '\''" />
                <div class="card-overlay">
                  <div class="card-actions">
                    <a-button shape="circle" class="view-btn" @click.stop="onDetailsClick(resource)">
                      <i class="fas fa-search"></i>
                    </a-button>
                  </div>
                </div>

                <div class="card-badges">
                  <div v-if="resource.featured" class="badge featured">
                    <i class="fas fa-crown"></i> 精选
                  </div>
                  <div v-if="resource.isNew" class="badge new">
                    <i class="fas fa-star"></i> 新上线
                  </div>
                  <div v-if="resource.isHot" class="badge hot">
                    <i class="fas fa-fire"></i> 热门
                  </div>
                  <div v-if="resource.isPremium" class="badge premium">
                    <i class="fas fa-gem"></i> Premium
                  </div>
                </div>

                <div class="card-platform">
                  {{ resource.platform }}
                </div>
              </div>

              <div class="card-content">
                <div class="content-header">
                  <h3 class="card-title" @click="onDetailsClick(resource)">
                    {{ resource.title }}
                  </h3>

                  <div class="card-category">
                    {{ resource.category }}
                  </div>
                </div>

                <div class="card-stats">
                  <div class="stat-item">
                    <i class="fas fa-download"></i> {{ formatNumber(resource.downloads) }}
                  </div>
                  <div class="stat-item">
                    <i class="fas fa-eye"></i> {{ formatNumber(resource.views) }}
                  </div>
                  <div class="stat-item">
                    <i class="fas fa-calendar-alt"></i> {{ formatDate(resource.date) }}
                  </div>
                </div>

                <div class="card-tags">
                  <a-tag v-for="(tag, tagIndex) in resource.tags.slice(0, 3)" :key="tagIndex" color="processing">
                    {{ tag }}
                  </a-tag>
                </div>

                <div class="card-footer">
                  <a-button type="primary" class="action-button" @click="onDetailsClick(resource)">
                    <i class="fas fa-search"></i> 查看
                  </a-button>

                  <div class="footer-actions">
                    <a-tooltip title="收藏">
                      <a-button shape="circle" class="footer-action-btn">
                        <i class="far fa-heart"></i>
                      </a-button>
                    </a-tooltip>

                    <a-tooltip title="分享">
                      <a-button shape="circle" class="footer-action-btn">
                        <i class="fas fa-share-alt"></i>
                      </a-button>
                    </a-tooltip>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination">
          <a-pagination v-model:current="currentPage" :total="total" :pageSize="pageSize"
            :pageSizeOptions="['8', '16', '24', '32']" showSizeChanger @change="onPageChange"
            @showSizeChange="onSizeChange" />
        </div>
      </div>

      <!-- 无数据展示 -->
      <a-empty v-else description="暂无符合条件的资源" />
    </a-spin>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';

// 定义属性
const props = defineProps({
  resources: {
    type: Array,
    default: () => []
  },
  loading: {
    type: Boolean,
    default: false
  },
  total: {
    type: Number,
    default: 0
  }
});

// 当前页码
const currentPage = ref(1);
// 每页显示数量
const pageSize = ref(16);

// 定义事件
const emit = defineEmits(['download', 'details', 'page-change', 'size-change']);

// 添加默认图片
const defaultImage = '/src/assets/image.png';

// 下载点击事件
const onDownloadClick = (resource: any) => {
  emit('download', resource);
};

// 详情点击事件
const onDetailsClick = (resource: any) => {
  emit('details', resource);
};

// 页码改变事件
const onPageChange = (page: number, pageSize: number) => {
  currentPage.value = page;
  emit('page-change', { page, pageSize });
};

// 每页条数改变事件
const onSizeChange = (current: number, size: number) => {
  pageSize.value = size;
  emit('size-change', { page: current, pageSize: size });
};

// 格式化数字
const formatNumber = (num: number): string => {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + 'w';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'k';
  }
  return num.toString();
};

// 格式化日期
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - date.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays <= 7) {
    return diffDays === 1 ? '昨天' : `${diffDays}天前`;
  } else {
    return dateString.slice(5); // 只返回月-日部分
  }
};
</script>

<style scoped lang="less">
.resource-grid {
  .grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 12px;
    margin-bottom: 20px;
    
    @media (max-width: 767px) {
      grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
      gap: 10px;
    }
  }
  
  .resource-card {
    position: relative;
    transition: all 0.3s ease;
    width: 100%;
    
    &.featured {
      .card-cover {
        height: 150px;
        
        @media (max-width: 767px) {
          height: 120px;
        }
      }
    }
    
    .card-inner {
      height: 100%;
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      transition: all 0.3s ease;
      display: flex;
      flex-direction: column;
      width: 100%;
      
      &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
        
        .card-cover {
          .card-overlay {
            opacity: 1;
          }
        }
      }
    }
    
    .card-cover {
      position: relative;
      cursor: pointer;
      width: 100%;
      height: 150px;
      overflow: hidden;
      flex-shrink: 0;
      background: #fff;
      display: flex;
      align-items: center;
      justify-content: center;
      
      @media (max-width: 767px) {
        height: 120px;
      }
      
      img {
        &[src$="image.png"] {
          width: 100px;
          height: 100px;
          object-fit: contain;
          
          @media (max-width: 767px) {
            width: 80px;
            height: 80px;
          }
        }
        
        &:not([src$="image.png"]) {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          display: block;
        }
      }
      
      .card-overlay {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.4);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        .card-actions {
          display: flex;
          gap: 10px;
          
          .view-btn {
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
            background: white;
            border: none;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
            color: #1677FF;
            
            @media (max-width: 767px) {
              width: 30px;
              height: 30px;
            }
            
            i {
              font-size: 14px;
              
              @media (max-width: 767px) {
                font-size: 12px;
              }
            }
            
            &:hover {
              transform: scale(1.1);
            }
          }
        }
      }
      
      .card-badges {
        position: absolute;
        top: 6px;
        left: 6px;
        display: flex;
        flex-direction: column;
        gap: 4px;
        
        .badge {
          padding: 2px 6px;
          border-radius: 4px;
          font-size: 10px;
          font-weight: 500;
          color: white;
          display: flex;
          align-items: center;
          
          i {
            margin-right: 3px;
            font-size: 8px;
          }
          
          &.featured {
            background: linear-gradient(45deg, #ff9a00, #ff6a00);
          }
          
          &.new {
            background: linear-gradient(45deg, #1677FF, #69b4ff);
          }
          
          &.hot {
            background: linear-gradient(45deg, #f5222d, #ff7875);
          }
          
          &.premium {
            background: linear-gradient(45deg, #da2eef, #8a2be2);
            box-shadow: 0 2px 8px rgba(138, 43, 226, 0.3);
          }
        }
      }
      
      .card-platform {
        position: absolute;
        bottom: 6px;
        right: 6px;
        background: rgba(0, 0, 0, 0.6);
        color: white;
        border-radius: 4px;
        padding: 1px 5px;
        font-size: 10px;
      }
    }
    
    .card-content {
      flex: 1;
      padding: 10px;
      display: flex;
      flex-direction: column;
      
      @media (max-width: 767px) {
        padding: 8px;
      }
      
      .content-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 8px;
        
        .card-title {
          flex: 1;
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
          color: var(--bTitleColor, #333);
          cursor: pointer;
          transition: color 0.2s;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          max-height: 39px;
          
          @media (max-width: 767px) {
            font-size: 13px;
            max-height: 36px;
          }
          
          &:hover {
            color: #1677FF;
          }
        }
        
        .card-category {
          flex-shrink: 0;
          background: rgba(22, 119, 255, 0.1);
          color: #1677FF;
          font-size: 10px;
          padding: 1px 5px;
          border-radius: 4px;
          margin-left: 6px;
          
          @media (max-width: 767px) {
            margin-left: 4px;
          }
        }
      }
      
      .card-stats {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 8px;
        
        .stat-item {
          font-size: 10px;
          color: var(--bDescColor, #666);
          display: flex;
          align-items: center;
          
          i {
            margin-right: 3px;
            font-size: 10px;
            color: #8c8c8c;
          }
        }
      }
      
      .card-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 4px;
        margin-bottom: 10px;
        
        :deep(.ant-tag) {
          margin: 0;
          border-radius: 4px;
          font-size: 10px;
          padding: 0 4px;
          line-height: 16px;
          height: 16px;
        }
      }
      
      .card-footer {
        margin-top: auto;
        display: flex;
        justify-content: space-between;
        align-items: center;
        
        .action-button {
          flex: 1;
          border-radius: 6px;
          height: 30px;
          font-size: 12px;
          font-weight: 500;
          transition: all 0.2s;
          
          @media (max-width: 767px) {
            height: 28px;
            font-size: 11px;
          }
          
          i {
            margin-right: 3px;
          }
          
          &:hover {
            transform: translateY(-2px);
            box-shadow: 0 3px 6px rgba(22, 119, 255, 0.2);
          }
        }
        
        .footer-actions {
          display: flex;
          gap: 6px;
          margin-left: 8px;
          
          .footer-action-btn {
            width: 24px;
            height: 24px;
            font-size: 11px;
            border: none;
            background: #f5f5f5;
            transition: all 0.2s;
            
            @media (max-width: 767px) {
              width: 22px;
              height: 22px;
              font-size: 10px;
            }
            
            &:hover {
              color: #1677FF;
              background: #e6f7ff;
            }
          }
        }
      }
    }
  }
  
  .pagination {
    text-align: center;
    margin-top: 20px;
    
    :deep(.ant-pagination-item-active) {
      border-color: #1677FF;
      
      a {
        color: #1677FF;
      }
    }
    
    @media (max-width: 767px) {
      :deep(.ant-pagination-options) {
        display: none;
      }
    }
  }
}
</style> 