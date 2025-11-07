<template>
  <div class="bitle-notice-center">
    <div class="nc-header">
      <div class="filter-group">
        <button v-for="tab in tabs" :key="tab.value" :class="['filter-btn', { active: activeTab === tab.value }]" @click="changeTab(tab.value)">
          <i :class="tab.icon"></i><span>{{ tab.label }}</span>
        </button>
      </div>
      <div class="search-box">
        <i class="fas fa-search"></i>
        <input v-model="searchText" placeholder="搜索公告..." @input="handleSearch" />
        <i v-if="searchText" class="fas fa-times-circle" @click="clearSearch"></i>
      </div>
    </div>
    <div class="nc-body">
      <div v-if="loading" class="state"><i class="fas fa-spinner fa-spin"></i><span>加载中...</span></div>
      <div v-else-if="!noticeList.length" class="state"><i class="fas fa-inbox"></i><span>暂无公告</span></div>
      <div v-else class="notice-list">
        <div v-for="n in noticeList" :key="n.notice_id" class="notice-item" @click="viewDetail(n)">
          <div class="card-top">
            <div class="title-row">
              <i class="title-icon fas fa-bookmark"></i>
              <h3 class="title">{{ n.title }}</h3>
            </div>
            <div class="meta-row">
              <span v-if="n.is_top" class="tag tag-top"><i class="fas fa-thumbtack"></i>置顶</span>
              <span v-if="n.priority === 2" class="tag tag-urgent"><i class="fas fa-exclamation-circle"></i>紧急</span>
              <span v-else-if="n.priority === 1" class="tag tag-important"><i class="fas fa-star"></i>重要</span>
              <span class="tag tag-category">{{ n.category_type_text }}</span>
              <span class="time">{{ formatTime(n.publish_time) }}</span>
            </div>
          </div>
          <p class="excerpt">{{ getExcerpt(n.content) }}</p>
          <div class="card-bottom">
            <div v-if="n.publisher" class="author">
              <img v-if="n.publisher.avatar" :src="n.publisher.avatar" class="avatar" :alt="n.publisher.username" />
              <div v-else class="avatar">{{ n.publisher.username[0] }}</div>
              <span>{{ n.publisher.username }}</span>
            </div>
            <div class="read-more">
              <span>查看详情</span>
              <i class="fas fa-arrow-right"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-if="total > pageSize" class="nc-footer">
      <button class="page-btn" :disabled="currentPage === 1" @click="prevPage"><i class="fas fa-chevron-left"></i></button>
      <span class="page-num">{{ currentPage }} / {{ totalPages }}</span>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage"><i class="fas fa-chevron-right"></i></button>
      <select v-model.number="pageSize" @change="changePageSize" class="page-size">
        <option :value="10">10条/页</option><option :value="20">20条/页</option><option :value="50">50条/页</option>
      </select>
      <span class="total">共 {{ total }} 条</span>
    </div>
    <transition name="fade">
      <div v-if="detailVisible" class="modal-mask" @click.self="closeDetail">
        <div class="modal-container">
          <div class="modal-header">
            <h2>{{ currentNotice?.title }}</h2>
            <button @click="closeDetail"><i class="fas fa-times"></i></button>
          </div>
          <div class="modal-body" v-if="currentNotice">
            <div class="modal-tags">
              <span :class="['tag', 'tag-priority', `p${currentNotice.priority}`]">{{ currentNotice.priority_text }}</span>
              <span class="tag tag-category">{{ currentNotice.category_type_text }}</span>
            </div>
            <div class="modal-meta">
              <div v-if="currentNotice.publisher" class="author">
                <img v-if="currentNotice.publisher.avatar" :src="currentNotice.publisher.avatar" class="avatar" :alt="currentNotice.publisher.username" />
                <div v-else class="avatar">{{ currentNotice.publisher.username[0] }}</div>
                <span>{{ currentNotice.publisher.username }}</span>
              </div>
              <span class="time"><i class="fas fa-clock"></i>{{ formatTime(currentNotice.publish_time) }}</span>
            </div>
            <div class="modal-content" v-html="formatContent(currentNotice.content)"></div>
            <div v-if="currentNotice.expire_time" class="expire-tip">
              <i class="fas fa-info-circle"></i>有效期至 {{ formatTime(currentNotice.expire_time) }}
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import { getClientNoticeList, getClientNoticeDetail, type ClientNotice } from '@/api/clientNotice'

const loading = ref(false), noticeList = ref<ClientNotice[]>([]), total = ref(0), currentPage = ref(1), pageSize = ref(10), searchText = ref(''), activeTab = ref<number | null>(null), detailVisible = ref(false), currentNotice = ref<ClientNotice | null>(null)
const tabs = computed(() => [{ label: '全部', value: null, icon: 'fas fa-th' }, { label: '系统', value: 1, icon: 'fas fa-cog' }, { label: '安全', value: 2, icon: 'fas fa-shield-alt' }, { label: '活动', value: 3, icon: 'fas fa-bullhorn' }, { label: '政策', value: 4, icon: 'fas fa-file-contract' }, { label: '其他', value: 5, icon: 'fas fa-ellipsis-h' }])
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const loadNotices = async () => { loading.value = true; try { const res = await getClientNoticeList({ page: currentPage.value, page_size: pageSize.value, title: searchText.value || undefined, category_type: activeTab.value || undefined }); if (res.code === 200) { noticeList.value = res.data.data; total.value = res.data.total } else { message.error(res.msg || '加载失败') } } catch (error: any) { if (error?.response?.status !== 401) message.error('加载失败') } finally { loading.value = false } }
const changeTab = (v: number | null) => { activeTab.value = v; currentPage.value = 1; loadNotices() }
const handleSearch = () => { currentPage.value = 1; loadNotices() }
const clearSearch = () => { searchText.value = ''; handleSearch() }
const prevPage = () => { if (currentPage.value > 1) { currentPage.value--; loadNotices() } }
const nextPage = () => { if (currentPage.value < totalPages.value) { currentPage.value++; loadNotices() } }
const changePageSize = () => { currentPage.value = 1; loadNotices() }
const viewDetail = async (n: ClientNotice) => { try { const res = await getClientNoticeDetail(n.notice_id); if (res.code === 200) { currentNotice.value = res.data; detailVisible.value = true } else if (res.code === 403) { message.warning('无权查看') } else { message.error('加载失败') } } catch (error) { message.error('加载失败') } }
const closeDetail = () => { detailVisible.value = false }
const getExcerpt = (c: string, max = 70) => { const t = c.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); return t.length > max ? t.substring(0, max) + '...' : t }
const formatTime = (t: string) => { const d = new Date(t), n = new Date(), diff = n.getTime() - d.getTime(); if (diff < 3600000) { const m = Math.floor(diff / 60000); return m < 1 ? '刚刚' : `${m}分钟前` } if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`; if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`; return t.split(' ')[0] }
const formatContent = (c: string) => c.replace(/\n/g, '<br>')
onMounted(() => loadNotices())
</script>

<style scoped lang="less">
@import '@/assets/style/theme.less';

.bitle-notice-center {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--el-bg-color-page);
  position: relative;
}

.nc-header {
  padding: 16px 20px;
  background: var(--el-bg-color);
  position: relative;
  z-index: 1;
}

.filter-group {
  display: flex;
  gap: 6px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--el-text-color-regular);
  font-size: 12px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.06);
  position: relative;
  overflow: hidden;
  
  // 背景光效
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0;
    height: 0;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(239, 99, 16, 0.2) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: all 0.4s ease;
  }
  
  i {
    color: var(--theme-primary);
    font-size: 13px;
    transition: all 0.3s;
    position: relative;
    z-index: 1;
  }
  
  span {
    line-height: 1.3;
    position: relative;
    z-index: 1;
  }
  
  &:hover {
    transform: translateY(-2px) scale(1.02);
    box-shadow: 0 6px 16px rgba(239, 99, 16, 0.2);
    border-color: var(--theme-primary-light-3);
    
    &::before {
      width: 120px;
      height: 120px;
    }
    
    i {
      transform: scale(1.15) rotate(-5deg);
      color: var(--theme-primary);
    }
  }
  
  &.active {
    background: var(--theme-gradient-warm);
    color: white;
    border-color: transparent;
    box-shadow: 0 6px 20px rgba(239, 99, 16, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
    
    i, span {
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
    }
    
    i {
      animation: iconBounce 0.6s ease;
    }
  }
}

@keyframes iconBounce {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.search-box {
  position: relative;
  
  i {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    color: var(--el-text-color-placeholder);
    font-size: 13px;
    z-index: 1;
  }
  
  .fa-search {
    left: 12px;
    color: var(--theme-primary);
    opacity: 0.7;
  }
  
  .fa-times-circle {
    right: 12px;
    cursor: pointer;
    transition: all 0.3s;
    &:hover {
      color: var(--theme-primary);
      transform: rotate(90deg) scale(1.1);
    }
  }
  
  input {
    width: 100%;
    max-width: 360px;
    padding: 10px 40px;
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 20px;
    background: var(--el-bg-color);
    font-size: 13px;
    color: var(--el-text-color-primary);
    outline: none;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03), 0 0 1px rgba(0, 0, 0, 0.02);
    
    &:focus {
      border-color: var(--theme-primary);
      box-shadow: 0 4px 16px rgba(239, 99, 16, 0.2), 
                  0 2px 4px rgba(239, 99, 16, 0.15),
                  inset 0 1px 0 rgba(255, 255, 255, 0.5);
      transform: translateY(-1px);
    }
    
    &:hover {
      border-color: var(--theme-primary-light-5);
      box-shadow: 0 3px 12px rgba(239, 99, 16, 0.12);
    }
    
    &::placeholder {
      color: var(--el-text-color-placeholder);
    }
  }
}

.nc-body {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
  background: var(--el-bg-color);
  position: relative;
  z-index: 1;
}

.state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 70px 20px;
  color: var(--el-text-color-secondary);
  
  i {
    font-size: 48px;
    margin-bottom: 14px;
    opacity: 0.4;
  }
  
  span {
    font-size: 14px;
  }
}

.notice-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  position: relative;
}

.notice-item {
  padding: 16px 18px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #fffbf7 100%);
  border: 1px solid rgba(239, 99, 16, 0.1);
  box-shadow: 0 2px 8px rgba(239, 99, 16, 0.08);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  
  // 顶部装饰线
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--theme-gradient-warm);
    opacity: 0;
    transition: opacity 0.3s;
  }
  
  &::after {
    content: '\f0f3';
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 42px;
    color: rgba(239, 99, 16, 0.06);
    pointer-events: none;
    transition: all 0.4s;
  }
  
  &:hover {
    transform: translateY(-3px) scale(1.005);
    box-shadow: 0 12px 28px rgba(239, 99, 16, 0.2),
                0 4px 12px rgba(239, 99, 16, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.8);
    border-color: var(--theme-primary);
    
    &::before {
      opacity: 1;
    }
    
    &::after {
      color: rgba(239, 99, 16, 0.15);
      transform: translateY(-50%) rotate(8deg) scale(1.08);
    }
    
    .title {
      color: var(--theme-primary);
      text-shadow: 0 1px 2px rgba(239, 99, 16, 0.1);
    }
    
    .tag-category {
      transform: scale(1.08);
      box-shadow: 0 6px 16px rgba(239, 99, 16, 0.4);
    }
    
    .tag-top {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(245, 158, 11, 0.3);
    }
    
    .tag-urgent {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(239, 68, 68, 0.3);
    }
    
    .tag-important {
      transform: scale(1.05);
      box-shadow: 0 4px 8px rgba(59, 130, 246, 0.3);
    }
    
    .title-icon {
      transform: scale(1.15) rotate(-5deg);
      background: var(--theme-gradient-warm);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      filter: drop-shadow(0 2px 4px rgba(239, 99, 16, 0.3));
    }
    
    .read-more {
      background: var(--theme-gradient-warm);
      box-shadow: 0 6px 18px rgba(239, 99, 16, 0.45),
                  inset 0 1px 0 rgba(255, 255, 255, 0.3);
      transform: translateY(-2px) scale(1.05);
      
      i {
        transform: translateX(4px);
      }
    }
    
    .author .avatar {
      transform: scale(1.15);
      box-shadow: 0 4px 12px rgba(239, 99, 16, 0.4);
      border-color: var(--theme-primary);
    }
  }
}

.card-top {
  margin-bottom: 6px;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 7px;
}

.title-icon {
  font-size: 15px;
  background: var(--theme-gradient-warm);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  flex-shrink: 0;
  transition: all 0.3s;
  filter: drop-shadow(0 1px 2px rgba(239, 99, 16, 0.2));
}

.title {
  font-size: 14px;
  font-weight: 700;
  color: var(--el-text-color-primary);
  margin: 0;
  line-height: 1.4;
  transition: all 0.3s;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: 0.3px;
  flex: 1;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 3px;
  padding: 3px 8px;
  border-radius: 14px;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
  transition: all 0.3s;
  letter-spacing: 0.2px;
  
  i {
    font-size: 9px;
  }
}

.tag-top {
  background: linear-gradient(135deg, #f59e0b, #fb923c);
  color: white;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.25);
  border: none;
}

.tag-urgent {
  background: linear-gradient(135deg, #ef4444, #f87171);
  color: white;
  border: none;
  box-shadow: 0 2px 4px rgba(239, 68, 68, 0.25);
  animation: pulse-urgent 2s ease-in-out infinite;
}

.tag-important {
  background: linear-gradient(135deg, #3b82f6, #60a5fa);
  color: white;
  border: none;
  box-shadow: 0 2px 4px rgba(59, 130, 246, 0.25);
}

.tag-category {
  background: var(--theme-gradient-warm);
  color: white;
  box-shadow: 0 2px 6px rgba(239, 99, 16, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.2);
  border: none;
  font-weight: 700;
  
  &::before {
    content: '\f02b';
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    margin-right: 4px;
    font-size: 10px;
  }
}

@keyframes pulse-urgent {
  0%, 100% {
    box-shadow: 0 2px 4px rgba(239, 68, 68, 0.25);
  }
  50% {
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
  }
}

.time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 600;
  color: #6b7280;
  
  &::before {
    content: '\f017';
    font-family: 'Font Awesome 5 Free';
    font-weight: 400;
    font-size: 10px;
    background: var(--theme-gradient-warm);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
}

.excerpt {
  font-size: 12px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
  margin: 0 0 8px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  letter-spacing: 0.2px;
}

.card-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.author {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 11px;
  font-weight: 600;
  color: var(--el-text-color-regular);
  
  .avatar {
    width: 22px;
    height: 22px;
    border-radius: 50%;
    background: var(--theme-gradient-warm);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    object-fit: cover;
    flex-shrink: 0;
    box-shadow: 0 3px 8px rgba(239, 99, 16, 0.3),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
    transition: all 0.3s;
    border: 2px solid rgba(255, 255, 255, 0.9);
  }
}

.read-more {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  color: white;
  padding: 7px 14px;
  border-radius: 16px;
  background: var(--theme-gradient-warm);
  transition: all 0.3s;
  box-shadow: 0 3px 8px rgba(239, 99, 16, 0.3),
              inset 0 1px 0 rgba(255, 255, 255, 0.3);
  border: none;
  letter-spacing: 0.3px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  
  i {
    font-size: 10px;
    transition: transform 0.3s;
  }
}

.nc-footer {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 16px 20px;
  background: var(--el-bg-color);
  position: relative;
  z-index: 1;
}

.page-btn {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  color: var(--el-text-color-regular);
  font-size: 12px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  
  &:hover:not(:disabled) {
    background: var(--theme-gradient-warm);
    color: white;
    border-color: transparent;
    transform: translateY(-2px) scale(1.08);
    box-shadow: 0 6px 20px rgba(239, 99, 16, 0.4),
                inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
}

.page-num {
  font-size: 12px;
  color: var(--theme-primary);
  font-weight: 700;
  min-width: 50px;
  text-align: center;
}

.page-size {
  padding: 7px 12px;
  border-radius: 8px;
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  font-size: 12px;
  color: var(--el-text-color-regular);
  cursor: pointer;
  outline: none;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  
  &:hover,
  &:focus {
    background: linear-gradient(135deg, rgba(239, 99, 16, 0.08) 0%, rgba(239, 99, 16, 0.05) 100%);
    color: var(--theme-primary);
    border-color: var(--theme-primary-light-7);
    box-shadow: 0 4px 16px rgba(239, 99, 16, 0.25);
    transform: translateY(-1px);
  }
}

.total {
  font-size: 12px;
  color: var(--el-text-color-secondary);
}

.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 2000;
}

.modal-container {
  width: 100%;
  max-width: 720px;
  max-height: 82vh;
  background: var(--el-bg-color);
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 70px rgba(239, 99, 16, 0.25), 
              0 10px 30px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border: 1px solid rgba(239, 99, 16, 0.2);
  position: relative;
  
  // 顶部装饰条
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: var(--theme-gradient-warm);
    z-index: 10;
  }
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid var(--el-border-color-lighter);
  
  h2 {
    font-size: 16px;
    font-weight: 600;
    margin: 0;
    color: var(--el-text-color-primary);
    flex: 1;
  }
  
  button {
    width: 30px;
    height: 30px;
    border: none;
    border-radius: 6px;
    background: var(--el-fill-color-light);
    color: var(--el-text-color-regular);
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: var(--el-fill-color);
      color: var(--el-text-color-primary);
    }
  }
}

.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.modal-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 14px;
}

.modal-meta {
  display: flex;
  align-items: center;
  gap: 14px;
  padding-bottom: 14px;
  margin-bottom: 18px;
  border-bottom: 1px solid var(--el-border-color-extra-light);
  
  .author .avatar {
    width: 22px;
    height: 22px;
    font-size: 11px;
  }
}

.modal-content {
  font-size: 14px;
  line-height: 1.8;
  color: var(--el-text-color-primary);
  min-height: 100px;
}

.expire-tip {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 18px;
  padding: 10px 14px;
  border-radius: 8px;
  background: #fff3cd;
  color: #856404;
  font-size: 12px;
  border: 1px solid #ffeaa7;
  
  i {
    font-size: 13px;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
  .modal-container {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
  .modal-container {
    transform: scale(0.95) translateY(20px);
  }
}

@media (max-width: 768px) {
  .filter-btn span {
    display: none;
  }
  
  .search-box input {
    max-width: 100%;
  }
  
  .notice-item {
    padding: 12px;
  }
  
  .title {
    font-size: 14px;
  }
  
  .excerpt {
    font-size: 12px;
  }
  
  .nc-footer {
    flex-wrap: wrap;
    gap: 8px;
    
    .total {
      width: 100%;
      text-align: center;
    }
  }
  
  .modal-container {
    max-height: 85vh;
  }
}
</style>
