<template>
  <div class="bitle-notice-center">
    <div class="nc-header">
      <div class="filter-group" ref="filterGroupRef">
        <button 
          v-for="(tab, index) in tabs" 
          :key="tab.value" 
          :class="['filter-btn', { active: activeTab === tab.value }]" 
          :ref="el => { if (el) setTabRef(el, index) }"
          @click="changeTab(tab.value, $event)"
        >
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
        <div 
          v-for="(n, index) in noticeList" 
          :key="n.notice_id" 
          class="notice-item animate__animated" 
          :class="notificationAnimations[index] || 'animate__fadeInLeft'"
          :style="{ animationDelay: `${index * 0.07}s`, animationDuration: '0.6s', animationTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)' }"
          @click="viewDetail(n)"
        >
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
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { message } from 'ant-design-vue'
import { getClientNoticeList, getClientNoticeDetail, type ClientNotice } from '@/api/clientNotice'

const loading = ref(false), noticeList = ref<ClientNotice[]>([]), total = ref(0), currentPage = ref(1), pageSize = ref(10), searchText = ref(''), activeTab = ref<number | null>(null), detailVisible = ref(false), currentNotice = ref<ClientNotice | null>(null)
const filterGroupRef = ref<HTMLElement | null>(null)
const notificationAnimations = ref<string[]>([])
const tabs = computed(() => [{ label: '全部', value: null, icon: 'fas fa-th' }, { label: '系统', value: 1, icon: 'fas fa-cog' }, { label: '安全', value: 2, icon: 'fas fa-shield-alt' }, { label: '活动', value: 3, icon: 'fas fa-bullhorn' }, { label: '政策', value: 4, icon: 'fas fa-file-contract' }, { label: '其他', value: 5, icon: 'fas fa-ellipsis-h' }])
const tabRefs = ref<(HTMLElement | null)[]>([])
const totalPages = computed(() => Math.ceil(total.value / pageSize.value))
const loadNotices = async () => { 
  loading.value = true
  try { 
    const res = await getClientNoticeList({ 
      page: currentPage.value, 
      page_size: pageSize.value, 
      title: searchText.value || undefined, 
      category_type: activeTab.value || undefined 
    })
    
    if (res.code === 200) { 
      noticeList.value = res.data.data
      total.value = res.data.total
      
      // 生成动画序列
      await nextTick()
      generateNotificationAnimations()
    } else { 
      message.error(res.msg || '加载失败') 
    } 
  } catch (error: any) { 
    if (error?.response?.status !== 401) message.error('加载失败') 
  } finally { 
    loading.value = false 
  } 
}
const setTabRef = (el: HTMLElement | null, index: number) => {
  if (el) tabRefs.value[index] = el
}

const updateSliderPosition = async () => {
  if (!filterGroupRef.value || !tabRefs.value.length) return
  
  const activeIndex = tabs.value.findIndex(tab => tab.value === activeTab.value)
  const activeBtn = tabRefs.value[activeIndex]
  
  if (!activeBtn) {
    // 隐藏滑块如果没有激活按钮
    filterGroupRef.value.style.setProperty('--slider-opacity', '0')
    return
  }
  
  await nextTick()
  
  const groupRect = filterGroupRef.value.getBoundingClientRect()
  const btnRect = activeBtn.getBoundingClientRect()
  
  const left = btnRect.left - groupRect.left
  const width = btnRect.width
  
  // 更新CSS变量控制滑块位置
  filterGroupRef.value.style.setProperty('--slider-left', `${left}px`)
  filterGroupRef.value.style.setProperty('--slider-width', `${width}px`)
  filterGroupRef.value.style.setProperty('--slider-opacity', '1')
  filterGroupRef.value.style.setProperty('--slider-scale', '1')
}

const generateNotificationAnimations = () => {
  // 所有公告统一使用从左进入的动画，保证风格一致且平滑
  notificationAnimations.value = noticeList.value.map(() => 'animate__fadeInLeft')
}

const changeTab = async (v: number | null, event?: Event) => { 
  if (activeTab.value === v) return
  
  activeTab.value = v
  currentPage.value = 1
  
  // 更新滑块位置
  await updateSliderPosition()
  
  // 加载数据
  await loadNotices()
  
  // 重新生成动画
  generateNotificationAnimations()
}
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
// 监听activeTab变化更新滑块
watch(() => activeTab.value, () => {
  nextTick(() => updateSliderPosition())
}, { flush: 'post' })

onMounted(async () => {
  await loadNotices()
  await nextTick()

  // 初始生成统一动画
  generateNotificationAnimations()
  
  // 初始化滑块位置，等待DOM完全渲染
  const initSlider = () => {
    if (tabRefs.value.some(ref => ref && ref.offsetWidth > 0)) {
      updateSliderPosition()
    } else {
      // 如果DOM还没渲染完成，再等待一下
      setTimeout(initSlider, 50)
    }
  }
  
  setTimeout(initSlider, 100)
})
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
  gap: 4px;
  margin-bottom: 12px;
  flex-wrap: wrap;
  padding: 4px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-radius: 12px;
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.8);
  position: relative;
}

.filter-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: transparent;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
  color: #1e293b;
  font-size: 13px;
  font-weight: 600;
  position: relative;
  z-index: 1;
  
  i {
    font-size: 13px;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    color: #475569;
  }
  
  span {
    line-height: 1.3;
    transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
    color: #1e293b;
  }
  
  &:hover:not(.active) {
    color: #0f172a;
    transform: translateY(-1px) scale(1.02);
    
    i {
      color: var(--theme-primary);
      transform: scale(1.1) rotate(-5deg);
    }
    
    span {
      color: #0f172a;
    }
  }
  
  &.active {
    color: white;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px) scale(1.02);
    z-index: 2;
    
    i, span {
      color: white;
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
    }
  }
}

// 滑动背景指示器
.filter-group {
  --slider-left: 0px;
  --slider-width: 0px;
  --slider-opacity: 0;
  --slider-scale: 0.8;
  
  &::after {
    content: '';
    position: absolute;
    top: 4px;
    left: calc(4px + var(--slider-left));
    width: var(--slider-width);
    height: calc(100% - 8px);
    background: linear-gradient(135deg, #ef6310 0%, #f97316 50%, #fb923c 100%);
    border-radius: 8px;
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 0;
    box-shadow: 0 4px 16px rgba(239, 99, 16, 0.35), 0 2px 6px rgba(249, 115, 22, 0.2), inset 0 1px 0 rgba(255, 255, 255, 0.25);
    opacity: var(--slider-opacity);
    transform: scale(var(--slider-scale));
  }
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
    border-radius: 8px;
    background: var(--el-bg-color);
    font-size: 13px;
    color: var(--el-text-color-primary);
    outline: none;
    transition: all 0.25s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
    
    &:focus {
      border-color: var(--theme-primary);
      box-shadow: 0 0 0 3px rgba(239, 99, 16, 0.1), 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    
    &:hover {
      border-color: var(--el-border-color);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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

// 动画优化样式
.animate__animated {
  animation-duration: 0.6s;
  animation-fill-mode: both;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

.notice-item {
  padding: 18px 20px;
  border-radius: 12px;
  background: linear-gradient(135deg, #ffffff 0%, #fefefe 100%);
  border: 1px solid rgba(226, 232, 240, 0.8);
  box-shadow: 0 2px 8px rgba(100, 116, 139, 0.06), 0 1px 3px rgba(0, 0, 0, 0.03);
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  
  // 右上角装饰图标
  &::after {
    content: '\f0a1';
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    position: absolute;
    right: -10px;
    top: -10px;
    font-size: 80px;
    color: rgba(239, 99, 16, 0.03);
    pointer-events: none;
    transition: all 0.3s;
    transform: rotate(15deg);
  }
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 24px rgba(239, 99, 16, 0.12), 0 4px 12px rgba(100, 116, 139, 0.08);
    border-color: rgba(251, 146, 60, 0.4);
    background: linear-gradient(135deg, #fffbf7 0%, #fff7ed 100%);
    
    &::after {
      color: rgba(239, 99, 16, 0.08);
      transform: rotate(12deg) scale(1.05);
      right: -8px;
      top: -8px;
    }
    
    .title {
      color: var(--theme-primary);
    }
    
    .title-icon {
      transform: scale(1.1);
      color: #f97316;
    }
    
    .read-more {
      background: linear-gradient(135deg, #ef6310 0%, #f97316 50%, #fb923c 100%);
      color: white;
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(239, 99, 16, 0.35), 0 2px 6px rgba(249, 115, 22, 0.25);
      text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
      
      i {
        transform: translateX(3px);
      }
    }
    
    .tag-top {
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(251, 191, 36, 0.35);
    }
    
    .tag-urgent {
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(239, 68, 68, 0.35);
    }
    
    .tag-important {
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(59, 130, 246, 0.35);
    }
    
    .tag-category {
      transform: translateY(-1px);
      box-shadow: 0 3px 8px rgba(249, 115, 22, 0.35);
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
  font-size: 14px;
  color: var(--theme-primary);
  flex-shrink: 0;
  transition: all 0.2s;
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
  background: linear-gradient(135deg, #fbbf24 0%, #fcd34d 100%);
  color: #713f12;
  border: none;
  box-shadow: 0 2px 6px rgba(251, 191, 36, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  text-shadow: 0 1px 1px rgba(255, 255, 255, 0.3);
  font-weight: 700;
  transition: all 0.3s;
}

.tag-urgent {
  background: linear-gradient(135deg, #ef4444 0%, #f87171 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 6px rgba(239, 68, 68, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  text-shadow: 0 1px 2px rgba(153, 27, 27, 0.4);
  font-weight: 700;
  transition: all 0.3s;
}

.tag-important {
  background: linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  text-shadow: 0 1px 2px rgba(30, 64, 175, 0.4);
  font-weight: 700;
  transition: all 0.3s;
}

.tag-category {
  background: linear-gradient(135deg, #f97316 0%, #fb923c 100%);
  color: white;
  border: none;
  box-shadow: 0 2px 6px rgba(249, 115, 22, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.25);
  text-shadow: 0 1px 2px rgba(154, 52, 18, 0.4);
  font-weight: 700;
  transition: all 0.3s;
  
  &::before {
    content: '\f02b';
    font-family: 'Font Awesome 5 Free';
    font-weight: 900;
    margin-right: 4px;
    font-size: 10px;
  }
}


.time {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 10px;
  font-weight: 500;
  color: var(--el-text-color-secondary);
  
  &::before {
    content: '\f017';
    font-family: 'Font Awesome 5 Free';
    font-weight: 400;
    font-size: 10px;
    color: var(--el-text-color-placeholder);
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
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fb923c 0%, #fbbf6a 100%);
    color: #78350f;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 10px;
    font-weight: 700;
    object-fit: cover;
    flex-shrink: 0;
    transition: all 0.3s;
    border: 2px solid #fff;
    box-shadow: 0 2px 6px rgba(251, 146, 60, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
}

.read-more {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  font-weight: 700;
  color: #f97316;
  padding: 7px 14px;
  border-radius: 8px;
  background: linear-gradient(135deg, rgba(251, 146, 60, 0.12) 0%, rgba(253, 186, 116, 0.15) 100%);
  transition: all 0.3s;
  border: 1px solid rgba(251, 146, 60, 0.25);
  box-shadow: 0 2px 4px rgba(249, 115, 22, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.4);
  
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
    background: linear-gradient(135deg, #ef6310 0%, #f97316 50%, #fb923c 100%);
    color: white;
    border-color: transparent;
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(239, 99, 16, 0.35), 0 2px 6px rgba(249, 115, 22, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.25);
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
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
    background: var(--el-fill-color-light);
    border-color: var(--theme-primary-light-7);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
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
  background: linear-gradient(135deg, #ffffff 0%, #fafafa 100%);
  border-radius: 16px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 25px 60px rgba(100, 116, 139, 0.2), 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(226, 232, 240, 0.8);
  position: relative;
  
  // 顶部彩色装饰条
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, 
      #ef6310 0%, 
      #f97316 20%,
      #fb923c 40%,
      #fbbf24 60%,
      #fcd34d 80%,
      #fb923c 100%);
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
  .nc-header {
    padding: 12px 16px;
  }
  
  .filter-group {
    gap: 8px;
    margin-bottom: 10px;
  }
  
  .filter-btn {
    padding: 10px 14px;
    font-size: 14px;
    border-radius: 8px;
    
    span {
      display: none;
    }
    
    i {
      font-size: 16px;
      color: #475569;
    }
    
    &:hover:not(.active) {
      i {
        color: var(--theme-primary);
        transform: scale(1.1) rotate(-5deg);
      }
    }
  }
  
  .search-box input {
    max-width: 100%;
    padding: 11px 40px;
    font-size: 14px;
  }
  
  .nc-body {
    padding: 12px 16px;
  }
  
  .notice-item {
    padding: 16px;
    border-radius: 14px;
    
    &::after {
      font-size: 100px;
      right: -15px;
      top: -15px;
    }
  }
  
  .title-icon {
    font-size: 16px;
  }
  
  .title {
    font-size: 15px;
    font-weight: 700;
  }
  
  .tag {
    padding: 4px 10px;
    font-size: 11px;
    border-radius: 16px;
    
    i {
      font-size: 10px;
    }
  }
  
  .time {
    font-size: 11px;
    
    &::before {
      font-size: 11px;
    }
  }
  
  .excerpt {
    font-size: 13px;
    line-height: 1.6;
    margin-bottom: 10px;
  }
  
  .author {
    font-size: 12px;
    
    .avatar {
      width: 26px;
      height: 26px;
      font-size: 11px;
    }
  }
  
  .read-more {
    padding: 8px 14px;
    font-size: 12px;
    border-radius: 10px;
    
    i {
      font-size: 11px;
    }
  }
  
  .nc-footer {
    padding: 14px 16px;
    flex-wrap: wrap;
    gap: 10px;
    
    .total {
      width: 100%;
      text-align: center;
      order: -1;
      margin-bottom: 4px;
      font-size: 13px;
    }
  }
  
  .page-btn {
    width: 38px;
    height: 38px;
    font-size: 14px;
  }
  
  .page-num {
    font-size: 13px;
    min-width: 60px;
  }
  
  .page-size {
    padding: 8px 12px;
    font-size: 13px;
  }
  
  .modal-container {
    max-height: 85vh;
    border-radius: 12px;
    margin: 0 8px;
  }
  
  .modal-header {
    padding: 14px 16px;
    
    h2 {
      font-size: 15px;
    }
  }
  
  .modal-body {
    padding: 16px;
  }
  
  .modal-content {
    font-size: 14px;
  }
}
</style>
