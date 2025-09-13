<template>
  <a-modal v-model:visible="visibleValue" :title="null" :footer="null" :width="800" :destroyOnClose="true"
    :maskClosable="true" class="resource-detail-modal">
    <div class="modal-content" v-if="resource && resource.id">
      <div class="modal-header">
        <div class="resource-cover" :style="{ backgroundImage: `url(${resource.imageUrl})` }">
          <div class="resource-badges">
            <div v-if="resource.isHot" class="badge hot">
              <i class="fas fa-fire"></i> 热门
            </div>
            <div v-if="resource.isNew" class="badge new">
              <i class="fas fa-star"></i> 新上线
            </div>
            <div v-if="resource.isPremium" class="badge premium">
              <i class="fas fa-gem"></i> Premium
            </div>
          </div>
        </div>

        <div class="resource-primary-info">
          <h1 class="resource-title">{{ resource.title }}</h1>

          <div class="resource-meta">
            <div class="meta-item category">
              <span class="item-label">分类</span>
              <span class="item-value">{{ resource.category }}</span>
            </div>
            <div class="meta-item platform">
              <span class="item-label">平台</span>
              <span class="item-value">{{ resource.platform }}</span>
            </div>
            <div class="meta-item author">
              <span class="item-label">作者</span>
              <span class="item-value">{{ resource.author }}</span>
            </div>
            <div class="meta-item date">
              <span class="item-label">发布日期</span>
              <span class="item-value">{{ resource.date }}</span>
            </div>
          </div>

          <div class="resource-tags">
            <a-tag v-for="(tag, index) in resource.tags" :key="index" color="processing" class="tag-item">
              {{ tag }}
            </a-tag>
          </div>

          <div class="resource-actions">
            <a-button type="primary" class="download-btn" :class="{'premium-btn': resource.isPremium}" @click="canDownloadPremium ? onDownload(resource) : showLoginTip()" :disabled="resource.isPremium && !userIsPremium">
              <i class="fas fa-download"></i> 
              <span v-if="resource.isPremium">Premium快速下载</span>
              <span v-else>立即下载</span>
            </a-button>

            <div class="secondary-actions">
              <a-button shape="circle" class="action-btn" @click="onCollect(resource)">
                <i class="fas fa-heart"></i>
              </a-button>
              <a-button shape="circle" class="action-btn" @click="onShare(resource)">
                <i class="fas fa-share-alt"></i>
              </a-button>
              <a-button shape="circle" class="action-btn">
                <i class="fas fa-thumbs-up"></i>
              </a-button>
            </div>
          </div>

          <div class="resource-stats">
            <div class="stat-item">
              <i class="fas fa-download"></i>
              <span class="stat-value">{{ formatNumber(resource.downloads) }}</span>
              <span class="stat-label">下载次数</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-eye"></i>
              <span class="stat-value">{{ formatNumber(resource.views) }}</span>
              <span class="stat-label">查看次数</span>
            </div>
            <div class="stat-item">
              <i class="fas fa-heart"></i>
              <span class="stat-value">{{ formatNumber(resource.likes || 0) }}</span>
              <span class="stat-label">收藏次数</span>
            </div>
          </div>
        </div>
      </div>

      <div class="modal-body">
        <a-tabs default-active-key="1" size="large" class="detail-tabs">
          <a-tab-pane key="1" tab="资源详情">
            <div class="detail-content" v-html="resource.content"></div>

            <div class="screen-shots" v-if="resource.screenshots && resource.screenshots.length">
              <h3 class="section-title">资源截图</h3>
              <div class="screenshots-wrapper">
                <div v-for="(screenshot, index) in resource.screenshots" :key="index" class="screenshot-item">
                  <img :src="screenshot" :alt="`screenshot-${index}`" />
                </div>
              </div>
            </div>

            <div class="specifications">
              <h3 class="section-title">资源规格</h3>
              <a-descriptions :column="{ xxl: 3, xl: 3, lg: 3, md: 2, sm: 2, xs: 1 }" bordered size="small">
                <a-descriptions-item label="资源大小">18.5 MB</a-descriptions-item>
                <a-descriptions-item label="版本">v{{ resource.version || '1.0.0' }}</a-descriptions-item>
                <a-descriptions-item label="文件格式">{{ resource.format || 'ZIP/RAR' }}</a-descriptions-item>
                <a-descriptions-item label="更新日期">{{ resource.updateDate || resource.date }}</a-descriptions-item>
                <a-descriptions-item label="支持语言">简体中文/英文</a-descriptions-item>
                <a-descriptions-item label="运行环境">{{ resource.environment || resource.platform }}</a-descriptions-item>
              </a-descriptions>
            </div>
          </a-tab-pane>

          <a-tab-pane key="2" tab="下载地址">
            <div class="download-options">
              <!-- Premium资源但用户不是Premium会员时显示锁定提示 -->
              <div v-if="resource.isPremium && !userIsPremium" class="premium-lock-container">
                <div class="lock-icon">
                  <i class="fas fa-lock"></i>
                </div>
                <h3 class="lock-title">Premium专享资源</h3>
                <p class="lock-desc">此资源需要Premium会员才能下载</p>
                <a-button type="primary" class="unlock-btn" @click="goToPremium">
                  <i class="fas fa-crown"></i> 立即升级Premium
                </a-button>
                <p class="premium-benefits">
                  升级Premium会员即可解锁所有资源、去除广告并获得更多特权！
                </p>
              </div>
              
              <!-- 用户可以访问下载选项时显示 -->
              <template v-else>
                <div class="option-title">
                  <i class="fas fa-cloud-download-alt"></i> 选择下载方式
                </div>
                
                <!-- 快速下载链接 -->
              <div class="download-option-item primary">
                <div class="option-info">
                  <div class="option-name">
                      <i class="fas fa-bolt"></i> 快速下载链接
                  </div>
                  <div class="option-desc">
                      <span v-if="resource.isPremium" class="premium-tag">
                        <i class="fas fa-gem"></i> Premium专享通道
                      </span>
                      <span v-else>高速稳定，无需等待</span>
                  </div>
                    <div class="extract-code">
                      <span class="code-label">提取码：</span>
                      <span class="code-value">btle</span>
                      <a-tooltip title="复制提取码">
                        <a-button type="link" size="small" class="copy-btn" @click="copyCode('btle')">
                          <i class="fas fa-copy"></i>
                        </a-button>
                      </a-tooltip>
                </div>
                  </div>
                  <a-button type="primary" @click="onRedirect(resource, 'direct')" size="middle">
                    <i class="fas fa-external-link-alt"></i> 前往下载
                </a-button>
              </div>

                <!-- 夸克网盘 -->
              <div class="download-option-item">
                <div class="option-info">
                  <div class="option-name">
                      <i class="fas fa-cloud-download-alt"></i> 夸克网盘
                  </div>
                  <div class="option-desc">
                      速度稳定，支持多线程下载
                  </div>
                    <div class="extract-code">
                      <span class="code-label">提取码：</span>
                      <span class="code-value">quark6688</span>
                      <a-tooltip title="复制提取码">
                        <a-button type="link" size="small" class="copy-btn" @click="copyCode('quark6688')">
                          <i class="fas fa-copy"></i>
                        </a-button>
                      </a-tooltip>
                </div>
                  </div>
                  <a-button @click="onRedirect(resource, 'quark')" size="middle">
                    <i class="fas fa-external-link-alt"></i> 前往下载
                </a-button>
              </div>

                <!-- 百度云网盘 -->
              <div class="download-option-item">
                <div class="option-info">
                  <div class="option-name">
                      <i class="fas fa-cloud-upload-alt"></i> 百度云网盘
                  </div>
                  <div class="option-desc">
                      空间大，稳定可靠
                  </div>
                    <div class="extract-code">
                      <span class="code-label">提取码：</span>
                      <span class="code-value">btleb</span>
                      <a-tooltip title="复制提取码">
                        <a-button type="link" size="small" class="copy-btn" @click="copyCode('btleb')">
                          <i class="fas fa-copy"></i>
                        </a-button>
                      </a-tooltip>
                </div>
                  </div>
                  <a-button @click="onRedirect(resource, 'baidu')" size="middle">
                    <i class="fas fa-external-link-alt"></i> 前往下载
                </a-button>
              </div>

              <div class="download-notice">
                <i class="fas fa-info-circle"></i> 下载说明：本站所有资源仅供学习交流使用，请在下载后24小时内删除。若喜欢该资源，请支持正版。
              </div>
              </template>
            </div>
          </a-tab-pane>

          <a-tab-pane key="3" tab="相关资源">
            <div class="related-resources">
              <div class="resource-list">
                <div v-for="i in 4" :key="i" class="related-resource-item">
                  <div class="item-cover" :style="{ backgroundImage: `url(${resource.imageUrl})` }">
                    <div class="item-overlay">
                      <a-button shape="circle" class="preview-btn">
                        <i class="fas fa-search"></i>
                      </a-button>
                    </div>
                    <div v-if="i === 1" class="item-badge premium">
                      <i class="fas fa-gem"></i> Premium
                    </div>
                    <div v-else-if="i === 2" class="item-badge hot">
                      <i class="fas fa-fire"></i> 热门
                    </div>
                  </div>
                  <div class="item-info">
                    <div class="item-title">{{ `与"${resource.title}"相关的资源 ${i}` }}</div>
                    <div class="item-meta">
                      <span class="item-downloads">
                        <i class="fas fa-download"></i> 2.{{ i }}k
                      </span>
                      <span class="item-date">2024-05-{{ 10+i }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a-tab-pane>
        </a-tabs>
      </div>
    </div>
  </a-modal>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { message } from 'ant-design-vue';
import { useRouter } from 'vue-router';
import { useStore } from '@/store';

// 定义属性
const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  },
  resource: {
    type: Object,
    default: () => ({})
  }
});

// 定义事件
const emit = defineEmits(['update:visible', 'download', 'collect', 'share']);

// 计算属性，用于双向绑定visible
const visibleValue = computed({
  get: () => props.visible,
  set: (value) => emit('update:visible', value)
});

// 使用router
const router = useRouter();

// 获取用户状态
const store = useStore();
const userIsPremium = computed(() => {
  // 检查store.userInfo是否存在且有premium属性
  if (!store.userInfo) return false;
  // 如果userInfo是对象类型，尝试访问premium属性
  return !!((store.userInfo as any)?.premium);
});

// 判断用户是否可以下载Premium资源
const canDownloadPremium = computed(() => {
  return userIsPremium.value || !props.resource?.isPremium;
});

// 登录提示
const showLoginTip = () => {
  if (!store.userInfo) {
    message.warning('请先登录后再使用此功能');
    // 可以跳转到登录页
    // router.push('/login');
  } else {
    message.warning('此资源需要Premium会员才能快速下载，请升级会员');
    // 可以跳转到会员购买页
    // router.push('/premium');
  }
};

// 关闭模态框
const closeModal = () => {
  visibleValue.value = false;
};

// 下载资源
const onDownload = (resource: any) => {
  // 使用中转页进行跳转
  router.push({
    path: '/redirect',
    query: {
      to: encodeURIComponent(`https://example.com/download/direct/${resource.id}`),
      name: resource.title || '未命名资源'
    }
  });
};

// 重定向到下载链接
const onRedirect = (resource: any, type: string = 'direct') => {
  // 基于不同的下载类型设置不同的链接
  let link = '';
  
  switch(type) {
    case 'direct':
      link = `https://example.com/download/direct/${resource.id}`;
      break;
    case 'quark':
      link = `https://example.com/download/quark/${resource.id}`;
      break;
    case 'baidu':
      link = `https://example.com/download/baidu/${resource.id}`;
      break;
    default:
      link = `https://example.com/download/${resource.id}`;
  }
  
  // 使用中转页进行跳转
  router.push({
    path: '/redirect',
    query: {
      to: encodeURIComponent(link),
      name: resource.title || '未命名资源'
    }
  });
};

// 复制下载链接
const onCopyLink = (resource: any, type: string = 'direct') => {
  // 基于不同的下载类型设置不同的链接
  let link = '';
  
  switch(type) {
    case 'direct':
      link = `https://example.com/download/direct/${resource.id}`;
      break;
    case 'quark':
      link = `https://example.com/download/quark/${resource.id}`;
      break;
    case 'baidu':
      link = `https://example.com/download/baidu/${resource.id}`;
      break;
    default:
      link = `https://example.com/download/${resource.id}`;
  }
  
  // 复制链接到剪贴板
  navigator.clipboard.writeText(link).then(() => {
    message.success('下载链接已复制到剪贴板');
  }).catch(() => {
    message.error('复制失败，请手动复制');
  });
};

// 复制提取码
const copyCode = (code: string) => {
  navigator.clipboard.writeText(code).then(() => {
    message.success('提取码已复制到剪贴板');
  }).catch(() => {
    message.error('复制失败，请手动复制');
  });
};

// 收藏资源
const onCollect = (resource: any) => {
  emit('collect', resource);
};

// 分享资源
const onShare = (resource: any) => {
  emit('share', resource);
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

// 跳转到Premium会员页面
const goToPremium = () => {
  router.push('/premium');
};
</script>

<style scoped lang="less">
.resource-detail-modal {
font-family: 'OPPO Sans';
  :deep(.ant-modal-content) {
    padding: 0;
    overflow: hidden;
    border-radius: 8px;
  }
  
  :deep(.ant-modal-body) {
    padding: 0;
  }
  
  .modal-content {
    position: relative;
    
    .modal-header {
      display: flex;
      background: #fff;
      
      @media (max-width: 767px) {
        flex-direction: column;
      }
      
      .resource-cover {
        width: 260px;
        height: 260px;
        background-size: cover;
        background-position: center;
        position: relative;
        flex-shrink: 0;
        
        @media (max-width: 991px) {
          width: 220px;
          height: 220px;
        }
        
        @media (max-width: 767px) {
          width: 100%;
          height: 160px;
        }
        
        .resource-badges {
          position: absolute;
          top: 10px;
          left: 10px;
          display: flex;
          flex-direction: column;
          gap: 5px;
          
          .badge {
            padding: 2px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: 500;
            color: white;
            display: flex;
            align-items: center;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
            
            i {
              margin-right: 3px;
              font-size: 9px;
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
      }
      
      .resource-primary-info {
        flex: 1;
        padding: 16px;
        display: flex;
        flex-direction: column;
        
        @media (max-width: 767px) {
          padding: 12px;
        }
        
        .resource-title {
          font-size: 20px;
          font-weight: 600;
          margin: 0 0 14px;
          color: var(--bTitleColor, #333);
          
          @media (max-width: 991px) {
            font-size: 18px;
            margin-bottom: 12px;
          }
          
          @media (max-width: 767px) {
            font-size: 16px;
            margin-bottom: 10px;
          }
        }
        
        .resource-meta {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
          gap: 10px;
          margin-bottom: 14px;
          
          @media (max-width: 767px) {
            grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
            gap: 8px;
            margin-bottom: 10px;
          }
          
          .meta-item {
            display: flex;
            flex-direction: column;
            
            .item-label {
              font-size: 11px;
              color: #8c8c8c;
              margin-bottom: 2px;
            }
            
            .item-value {
              font-size: 12px;
              font-weight: 500;
              color: var(--bTitleColor, #333);
            }
          }
        }
        
        .resource-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 5px;
          margin-bottom: 16px;
          
          @media (max-width: 767px) {
            margin-bottom: 12px;
          }
          
          .tag-item {
            margin: 0;
            border-radius: 4px;
            font-size: 11px;
            padding: 0 5px;
            height: 20px;
            line-height: 20px;
          }
        }
        
        .resource-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
          
          @media (max-width: 767px) {
            margin-bottom: 12px;
          }
          
          .download-btn {
            height: 38px;
            font-size: 14px;
            font-weight: 600;
            padding: 0 18px;
            border-radius: 6px;
            background: linear-gradient(45deg, #1677FF, #4dabff);
            border: none;
            box-shadow: 0 4px 12px rgba(22, 119, 255, 0.25);
            
            @media (max-width: 767px) {
              height: 36px;
              font-size: 13px;
              padding: 0 16px;
            }
            
            i {
              margin-right: 6px;
              
              @media (max-width: 767px) {
                margin-right: 4px;
              }
            }
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 6px 16px rgba(22, 119, 255, 0.35);
              background: linear-gradient(45deg, #0d6efd, #3e9fff);
            }
            
            &[disabled] {
              position: relative;
              cursor: not-allowed;
              background: #f5f5f5;
              color: rgba(0, 0, 0, 0.5);
              border: 1px solid #d9d9d9;
              box-shadow: none;
              
              &:hover {
                transform: none;
                background: #f5f5f5;
              }
              
              i {
                color: rgba(0, 0, 0, 0.5);
              }
            }
            
            &.premium-btn {
              background: linear-gradient(45deg, #7718ca, #da2eef);
              box-shadow: 0 4px 12px rgba(138, 43, 226, 0.25);
              color: white;
              
              &:hover {
                background: linear-gradient(45deg, #6b14b8, #c01de0);
                box-shadow: 0 6px 16px rgba(138, 43, 226, 0.35);
              }
              
              &[disabled] {
                background: #f5f5f5;
                color: rgba(0, 0, 0, 0.5);
                border: 1px solid #d9d9d9;
                box-shadow: none;
                
                &:hover {
                  transform: none;
                  background: #f5f5f5;
                }
                
                &::after {
                  content: '需要会员';
                  position: absolute;
                  right: -5px;
                  top: -5px;
                  background: #ff4d4f;
                  color: white;
                  font-size: 10px;
                  padding: 1px 5px;
                  border-radius: 4px;
                  transform: none;
                  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                  z-index: 2;
                }
              }
            }
          }
          
          .secondary-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            
            .action-btn {
              width: 38px;
              height: 38px;
              font-size: 14px;
              box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
              border: none;
              transition: all 0.3s;
              color: #666;
              
              @media (max-width: 767px) {
                width: 36px;
              height: 36px;
              font-size: 13px;
              }
              
              &:hover {
                transform: translateY(-2px);
                color: #1677FF;
                background: #e6f7ff;
                box-shadow: 0 4px 8px rgba(22, 119, 255, 0.15);
              }
            }
          }
        }
        
        .resource-stats {
          display: flex;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: auto;
          padding-top: 14px;
          border-top: 1px solid #f0f0f0;
          
          @media (max-width: 767px) {
            gap: 10px;
            padding-top: 10px;
          }
          
          .stat-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            min-width: 60px;
            
            i {
              font-size: 18px;
              color: #1677FF;
              margin-bottom: 3px;
              
              @media (max-width: 767px) {
                font-size: 16px;
                margin-bottom: 2px;
              }
            }
            
            .stat-value {
              font-size: 14px;
              font-weight: 600;
              color: var(--bTitleColor, #333);
              margin-bottom: 2px;
              
              @media (max-width: 767px) {
                font-size: 13px;
                margin-bottom: 1px;
              }
            }
            
            .stat-label {
              font-size: 10px;
              color: #8c8c8c;
            }
          }
        }
      }
    }
    
    .modal-body {
      padding: 0;
      
      .detail-tabs {
        :deep(.ant-tabs-nav) {
          margin: 0;
          padding: 0 16px;
          background: #f5f7fa;
        }
        
        :deep(.ant-tabs-tab) {
          padding: 8px 0;
          font-size: 14px;
          
          @media (max-width: 767px) {
            font-size: 13px;
            padding: 6px 0;
            margin: 0 10px 0 0;
          }
          
          &.ant-tabs-tab-active .ant-tabs-tab-btn {
            color: #1677FF;
            font-weight: 500;
          }
        }
        
        :deep(.ant-tabs-ink-bar) {
          background: #1677FF;
        }
        
        :deep(.ant-tabs-content-holder) {
          padding: 16px;
          
          @media (max-width: 767px) {
            padding: 12px;
          }
        }
      }
      
      .detail-content {
        line-height: 1.6;
        margin-bottom: 20px;
        color: var(--bDescColor, #666);
        font-size: 14px;
        background: #fcfcfc;
        padding: 15px;
        border-radius: 6px;
        border: 1px solid #f0f0f0;
        position: relative;
        
        @media (max-width: 767px) {
          font-size: 13px;
          margin-bottom: 16px;
          padding: 12px;
        }
        
        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(to bottom, #1677FF, #69b4ff);
          border-radius: 3px 0 0 3px;
        }
        
        p {
          margin-bottom: 10px;
          
          &:last-child {
            margin-bottom: 0;
          }
        }
      }
      
      .section-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--bTitleColor, #333);
        margin: 0 0 10px;
        padding-left: 8px;
        border-left: 3px solid #1677FF;
        
        @media (max-width: 767px) {
          font-size: 14px;
          margin: 0 0 8px;
        }
      }
      
      .screenshots-wrapper {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
        gap: 10px;
        margin-bottom: 20px;
        
        @media (max-width: 767px) {
          grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
          gap: 8px;
          margin-bottom: 16px;
        }
        
        .screenshot-item {
          border-radius: 4px;
          overflow: hidden;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
          
          img {
            width: 100%;
            height: auto;
            display: block;
          }
        }
      }
      
      .specifications {
        margin-bottom: 20px;
        
        @media (max-width: 767px) {
          margin-bottom: 16px;
        }
        
        :deep(.ant-descriptions-item-label) {
          width: 80px;
          background: #fafafa;
          font-size: 13px;
          
          @media (max-width: 767px) {
            font-size: 12px;
          }
        }
        
        :deep(.ant-descriptions-item-content) {
          font-size: 13px;
          
          @media (max-width: 767px) {
            font-size: 12px;
          }
        }
      }
      
      .download-options {
        .option-title {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 18px;
          display: flex;
          align-items: center;
          
          i {
            color: #1677FF;
            margin-right: 10px;
            font-size: 16px;
          }
        }
        
        .download-options-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          
          @media (max-width: 991px) {
            grid-template-columns: 1fr;
          }
        }
        
        .download-option-item {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          padding: 16px;
          border-radius: 10px;
          border: 1px solid #f0f0f0;
          margin-bottom: 14px;
          transition: all 0.3s ease;
          background: #fcfcfc;
          position: relative;
          box-sizing: border-box;
          width: 100%;
          overflow: hidden;
          
          @media (max-width: 767px) {
            flex-direction: column;
            align-items: flex-start;
            padding: 12px;
            gap: 12px;
          }
          
          &:hover {
            box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
            border-color: #e6e6e6;
            transform: translateY(-2px);
          }
          
          &.primary {
            background: linear-gradient(135deg, #f0f7ff 0%, #ffffff 100%);
            border: 1px solid rgba(22, 119, 255, 0.15);
            
            &:hover {
              background: linear-gradient(135deg, #ebf5ff 0%, #ffffff 100%);
              border-color: rgba(22, 119, 255, 0.25);
            }
            
            .option-name {
              color: #1677FF;
              
              i {
                color: #1677FF;
              }
            }
          }
          
          .option-info {
            flex: 1;
            min-width: 0;
            width: calc(100% - 120px);
            box-sizing: border-box;
            overflow: hidden;
            
            @media (max-width: 767px) {
              width: 100%;
            }
            
            .option-name {
              font-size: 16px;
              font-weight: 600;
              color: var(--bTitleColor, #333);
              margin-bottom: 6px;
              white-space: nowrap;
              overflow: hidden;
              text-overflow: ellipsis;
              
              @media (max-width: 767px) {
                font-size: 15px;
              }
              
              i {
                color: #1677FF;
                margin-right: 8px;
              }
            }
            
            .option-desc {
              font-size: 12px;
              color: #8c8c8c;
              margin-bottom: 8px;
              
              .premium-tag {
                color: #da2eef;
                font-weight: 500;
                background: rgba(218, 46, 239, 0.1);
                padding: 2px 6px;
                border-radius: 4px;
                display: inline-flex;
                align-items: center;
                
                i {
                  margin-right: 3px;
                }
              }
            }
            
            .extract-code {
              display: flex;
              align-items: center;
              font-size: 12px;
              background: rgba(22, 119, 255, 0.05);
              padding: 5px 8px;
              border-radius: 4px;
              border: 1px solid rgba(22, 119, 255, 0.1);
              box-sizing: border-box;
              overflow: hidden;
              width: fit-content;
              max-width: 100%;
              
              @media (max-width: 767px) {
                width: 100%;
              }
              
              .code-label {
                color: #666;
                margin-right: 4px;
                white-space: nowrap;
                flex-shrink: 0;
              }
              
              .code-value {
                color: #1677FF;
                font-weight: 500;
                font-family: monospace;
                letter-spacing: 0.5px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                min-width: 0;
                flex: 1;
              }
              
              .copy-btn {
                padding: 0;
                margin-left: 6px;
                height: auto;
                flex-shrink: 0;
                min-width: auto;
                width: auto;
                
                i {
                  font-size: 12px;
                  color: #1677FF;
                }
                
                &:hover i {
                  color: #0d6efd;
                }
              }
            }
          }
          
          .ant-btn {
            flex-shrink: 0;
            min-width: 100px;
            background: #1677FF;
            border: none;
            box-shadow: 0 2px 6px rgba(22, 119, 255, 0.2);
            transition: all 0.3s;
            font-weight: 500;
            height: 36px;
            
            @media (max-width: 767px) {
              width: 100%;
              margin-top: 0;
            }
            
            i {
              margin-right: 5px;
            }
            
            &:hover {
              background: #0d6efd;
              box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
              transform: translateY(-1px);
            }
            
            &:not([type="primary"]) {
              background: white;
              color: #1677FF;
              border: 1px solid #d9d9d9;
              
              &:hover {
                border-color: #1677FF;
                color: #1677FF;
              }
            }
          }
        }
        
        .download-notice {
          padding: 14px 16px;
          background: #fffbe6;
          border-radius: 8px;
          border: 1px solid #ffe58f;
          font-size: 12px;
          color: #8c8c8c;
          margin-top: 20px;
          
          @media (max-width: 767px) {
            margin-top: 15px;
            padding: 12px 14px;
          }
          
          i {
            color: #faad14;
            margin-right: 6px;
          }
        }
      }
      
      .related-resources {
        .resource-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
          gap: 12px;
          
          @media (max-width: 767px) {
            grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
            gap: 10px;
          }
          
          .related-resource-item {
            border-radius: 6px;
            overflow: hidden;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
            transition: all 0.2s;
            cursor: pointer;
            
            &:hover {
              transform: translateY(-4px);
              box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
              
              .item-overlay {
                opacity: 1;
              }
            }
            
            .item-cover {
              height: 100px;
              background-size: cover;
              background-position: center;
              position: relative;
              
              @media (max-width: 767px) {
                height: 90px;
              }
              
              .item-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.5);
                display: flex;
                align-items: center;
                justify-content: center;
                opacity: 0;
                transition: all 0.3s ease;
                
                .preview-btn {
                  width: 32px;
                  height: 32px;
                  background: white;
                  color: #1677FF;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  border: none;
                  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15);
                  
                  @media (max-width: 767px) {
                    width: 28px;
                    height: 28px;
                  }
                  
                  &:hover {
                    transform: scale(1.1);
                  }
                  
                  i {
                    font-size: 14px;
                    
                    @media (max-width: 767px) {
                      font-size: 12px;
                    }
                  }
                }
              }
              
              .item-badge {
                position: absolute;
                top: 6px;
                left: 6px;
                padding: 1px 5px;
                border-radius: 4px;
                font-size: 10px;
                font-weight: 500;
                color: white;
                display: flex;
                align-items: center;
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
                
                i {
                  margin-right: 2px;
                  font-size: 8px;
                }
                
                &.premium {
                  background: linear-gradient(45deg, #da2eef, #8a2be2);
                }
                
                &.hot {
                  background: linear-gradient(45deg, #f5222d, #ff7875);
                }
              }
            }
            
            .item-info {
              padding: 8px 10px;
              background: white;
              
              @media (max-width: 767px) {
                padding: 6px 8px;
              }
              
              .item-title {
                font-size: 13px;
                font-weight: 500;
                margin-bottom: 6px;
                color: var(--bTitleColor, #333);
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                height: 36px;
                line-height: 1.4;
                
                @media (max-width: 767px) {
                  font-size: 12px;
                  height: 34px;
                  margin-bottom: 4px;
                }
                
                &:hover {
                  color: #1677FF;
                }
              }
              
              .item-meta {
                display: flex;
                justify-content: space-between;
                align-items: center;
                font-size: 11px;
                color: #8c8c8c;
                
                @media (max-width: 767px) {
                  font-size: 10px;
                }
                
                .item-downloads {
                  i {
                  margin-right: 3px;
                    color: #1677FF;
                }
              }
            }
          }
        }
      }
      }
    }
  }
        }
        
.premium-lock-container {
            display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  text-align: center;
  background: linear-gradient(135deg, #f9f0ff 0%, #f5f5ff 100%);
  border-radius: 12px;
  border: 1px dashed #da2eef;
  
  .lock-icon {
    width: 70px;
    height: 70px;
    background: linear-gradient(45deg, #da2eef, #8a2be2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 20px;
    box-shadow: 0 5px 15px rgba(138, 43, 226, 0.2);
    
    i {
      font-size: 28px;
      color: white;
    }
            }
            
  .lock-title {
    font-size: 22px;
    font-weight: 600;
    color: #333;
    margin-bottom: 10px;
    background: linear-gradient(90deg, #da2eef, #8a2be2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  
  .lock-desc {
    font-size: 15px;
    color: #666;
    margin-bottom: 25px;
  }
  
  .unlock-btn {
    height: 40px;
    padding: 0 25px;
    font-size: 15px;
                  font-weight: 500;
    background: linear-gradient(45deg, #da2eef, #8a2be2);
    border: none;
    border-radius: 6px;
    box-shadow: 0 5px 15px rgba(138, 43, 226, 0.25);
    margin-bottom: 15px;
    
    &:hover {
      background: linear-gradient(45deg, #c01de0, #7718ca);
      transform: translateY(-2px);
      box-shadow: 0 7px 18px rgba(138, 43, 226, 0.3);
    }
    
    i {
      margin-right: 6px;
                }
              }
              
  .premium-benefits {
                font-size: 13px;
    color: #888;
    max-width: 320px;
                line-height: 1.5;
  }
}
</style>