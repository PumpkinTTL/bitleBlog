<template>
  <div class="category-nav">
    <div class="category-title">
      <h3>文章分类</h3>
      <div class="title-underline"></div>
    </div>
    <div class="category-list">
      <div 
        v-for="(category, index) in categories" 
        :key="category.id"
        :class="[
          'category-item',
          'animate__animated',
          'animate__fadeInLeft',
          { 'active': activeCategory === category.id }
        ]"
        :style="`animation-delay: ${0.05 + index * 0.05}s`" 
        @click="selectCategory(category.id)"
      >
        <div class="category-icon">
          <i class="ant-icon">
            <svg v-if="index === 0" viewBox="64 64 896 896" focusable="false" data-icon="appstore" aria-hidden="true"><path d="M464 144H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H212V212h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V160c0-8.8-7.2-16-16-16zm-52 268H612V212h200v200zM464 544H160c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H212V612h200v200zm452-268H560c-8.8 0-16 7.2-16 16v304c0 8.8 7.2 16 16 16h304c8.8 0 16-7.2 16-16V560c0-8.8-7.2-16-16-16zm-52 268H612V612h200v200z"></path></svg>
            <svg v-else-if="index === 1" viewBox="64 64 896 896" focusable="false" data-icon="code" aria-hidden="true"><path d="M516 673c0 4.4 3.4 8 7.5 8h185c4.1 0 7.5-3.6 7.5-8v-48c0-4.4-3.4-8-7.5-8h-185c-4.1 0-7.5 3.6-7.5 8v48zm-194.9 6.1l192-161c3.8-3.2 3.8-9.1 0-12.3l-192-160.9A7.95 7.95 0 00308 351v62.7c0 2.4 1 4.6 2.9 6.1L420.7 512l-109.8 92.2a8.1 8.1 0 00-2.9 6.1V673c0 6.8 7.9 10.5 13.1 6.1zM880 112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V144c0-17.7-14.3-32-32-32zm-40 728H184V184h656v656z"></path></svg>
            <svg v-else-if="index === 2" viewBox="64 64 896 896" focusable="false" data-icon="database" aria-hidden="true"><path d="M832 64H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-600 72h560v208H232V136zm560 480H232V408h560v208zm0 272H232V680h560v208zM304 240a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0zm0 272a40 40 0 1080 0 40 40 0 10-80 0z"></path></svg>
            <svg v-else-if="index === 3" viewBox="64 64 896 896" focusable="false" data-icon="mobile" aria-hidden="true"><path d="M744 62H280c-35.3 0-64 28.7-64 64v768c0 35.3 28.7 64 64 64h464c35.3 0 64-28.7 64-64V126c0-35.3-28.7-64-64-64zm-8 824H288V134h448v752zM472 784a40 40 0 1080 0 40 40 0 10-80 0z"></path></svg>
            <svg v-else-if="index === 4" viewBox="64 64 896 896" focusable="false" data-icon="tool" aria-hidden="true"><path d="M865.3 244.7c-.3-.3-61.1 59.8-182.1 180.6l-84.9-84.9 180.9-180.9c-95.2-57.3-217.5-42.6-296.8 36.7A244.42 244.42 0 00419 432l1.8 6.7-283.5 283.4c-6.2 6.2-6.2 16.4 0 22.6l141.4 141.4c6.2 6.2 16.4 6.2 22.6 0l283.3-283.3 6.7 1.8c83.7 22.3 173.6-.9 236-63.3 79.4-79.3 94.1-201.6 38-296.6z"></path></svg>
            <svg v-else-if="index === 5" viewBox="64 64 896 896" focusable="false" data-icon="rocket" aria-hidden="true"><path d="M864 736c0-111.6-65.4-208-160-252.9V317.3c0-15.1-5.3-29.7-15.1-41.2L536.5 95.4C530.1 87.8 521 84 512 84s-18.1 3.8-24.5 11.4L335.1 276.1a63.97 63.97 0 00-15.1 41.2v165.8C225.4 528 160 624.4 160 736h156.5c-2.3 7.2-3.5 15-3.5 23.8 0 22.1 7.6 43.7 21.4 60.8a97.2 97.2 0 0043.1 30.3c23.1 54 75.6 88.8 134.5 88.8 29.1 0 57.3-8.6 81.4-24.8 23.6-15.8 41.9-37.9 53-64a97 97 0 0043.1-30.3 97.52 97.52 0 0021.4-60.8c0-8.4-1.1-16.4-3.1-23.8H864zM762.3 621.4c9.4 14.6 17 30.3 22.5 46.6H700V558.7a211.6 211.6 0 0162.3 62.7zM388 483.1V318.8l124-147 124 147V668H388V483.1zM239.2 668c5.5-16.3 13.1-32 22.5-46.6 16.3-25.2 37.5-46.5 62.3-62.7V668h-84.8zm388.9 116.2c-5.2 3-11.2 4.2-17.1 3.4l-19.5-2.4-2.8 19.4c-5.4 37.9-38.4 66.5-76.7 66.5-38.3 0-71.3-28.6-76.7-66.5l-2.8-19.5-19.5 2.5a27.7 27.7 0 01-17.1-3.5c-8.7-5-14.1-14.3-14.1-24.4 0-10.6 5.9-19.4 14.6-23.8h231.3c8.8 4.5 14.6 13.3 14.6 23.8-.1 10.2-5.5 19.6-14.2 24.5zM464 400a48 48 0 1096 0 48 48 0 10-96 0z"></path></svg>
            <svg v-else-if="index === 6" viewBox="64 64 896 896" focusable="false" data-icon="api" aria-hidden="true"><path d="M917.7 148.8l-42.4-42.4c-1.6-1.6-3.6-2.3-5.7-2.3s-4.1.8-5.7 2.3l-76.1 76.1a199.27 199.27 0 00-112.1-34.3c-51.2 0-102.4 19.5-141.5 58.6L432.3 308.7a8.03 8.03 0 000 11.3L704 591.7c1.6 1.6 3.6 2.3 5.7 2.3 2 0 4.1-.8 5.7-2.3l101.9-101.9c68.9-69 77-175.7 24.3-253.5l76.1-76.1c3.1-3.2 3.1-8.3 0-11.4zM769.1 441.7l-59.4 59.4-186.8-186.8 59.4-59.4c24.9-24.9 58.1-38.7 93.4-38.7 35.3 0 68.4 13.7 93.4 38.7 24.9 24.9 38.7 58.1 38.7 93.4 0 35.3-13.8 68.4-38.7 93.4zm-190.2 105a8.03 8.03 0 00-11.3 0L501 613.3 410.7 523l66.7-66.7c3.1-3.1 3.1-8.2 0-11.3L441 408.6a8.03 8.03 0 00-11.3 0L363 475.3l-43-43a7.85 7.85 0 00-5.7-2.3c-2 0-4.1.8-5.7 2.3L206.8 534.2c-68.9 69-77 175.7-24.3 253.5l-76.1 76.1a8.03 8.03 0 000 11.3l42.4 42.4c1.6 1.6 3.6 2.3 5.7 2.3s4.1-.8 5.7-2.3l76.1-76.1c33.7 22.9 72.9 34.3 112.1 34.3 51.2 0 102.4-19.5 141.5-58.6l101.9-101.9c3.1-3.1 3.1-8.2 0-11.3l-43-43 66.7-66.7c3.1-3.1 3.1-8.2 0-11.3l-36.6-36.2zM441.7 769.1a131.32 131.32 0 01-93.4 38.7c-35.3 0-68.4-13.7-93.4-38.7a131.32 131.32 0 01-38.7-93.4c0-35.3 13.7-68.4 38.7-93.4l59.4-59.4 186.8 186.8-59.4 59.4z"></path></svg>
            <svg v-else viewBox="64 64 896 896" focusable="false" data-icon="folder" aria-hidden="true"><path d="M880 298.4H521L403.7 186.2a8.15 8.15 0 00-5.5-2.2H144c-17.7 0-32 14.3-32 32v592c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V330.4c0-17.7-14.3-32-32-32zM840 768H184V256h188.5l119.6 114.4H840V768z"></path></svg>
          </i>
        </div>
        <span class="category-name">{{ category.name }}</span>
        <div class="category-count">{{ category.count }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Category {
  id: number;
  name: string;
  icon: string;
  count: number;
}

const categories = ref<Category[]>([
  { id: 0, name: '全部', icon: 'el-icon-menu', count: 56 },
  { id: 1, name: '前端开发', icon: 'el-icon-monitor', count: 28 },
  { id: 2, name: '后端开发', icon: 'el-icon-cpu', count: 15 },
  { id: 3, name: '移动开发', icon: 'el-icon-mobile', count: 9 },
  { id: 4, name: '数据库', icon: 'el-icon-coin', count: 7 },
  { id: 5, name: '人工智能', icon: 'el-icon-magic-stick', count: 11 },
  { id: 6, name: '开发工具', icon: 'el-icon-tools', count: 8 },
  { id: 7, name: '编程语言', icon: 'el-icon-document', count: 18 }
]);

const activeCategory = ref(0);
const emit = defineEmits(['category-change']);

const selectCategory = (id: number) => {
  activeCategory.value = id;
  emit('category-change', id);
};

onMounted(() => {
  // 实际应用中，这里可以调用API获取分类数据
  console.log('CategoryNav component mounted');
});
</script>

<style lang="less" scoped>
.category-nav {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #eee;
  
  .category-title {
    margin-bottom: 15px;
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
  }
  
  .category-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  .category-item {
    display: flex;
    align-items: center;
    padding: 8px 10px;
    border-radius: 4px;
    cursor: pointer;
    transition: all 0.2s ease;
    background-color: #f9f9f9;
    
    &:hover {
      background-color: #f0f7ff;
    }
    
    &.active {
      background-color: #1677FF;
      color: white;
      
      .category-icon {
        color: white;
        
        i {
          color: white;
          
          svg {
            fill: white;
          }
        }
      }
      
      .category-name {
        color: white;
      }
      
      .category-count {
        background-color: rgba(255, 255, 255, 0.3);
        color: white;
      }
    }
    
    .category-icon {
      margin-right: 10px;
      color: #666;
      display: flex;
      
      i {
        font-size: 16px;
        
        svg {
          width: 1em;
          height: 1em;
        }
      }
    }
    
    .category-name {
      flex: 1;
      font-size: 14px;
      color: #333;
    }
    
    .category-count {
      background-color: #eee;
      color: #666;
      font-size: 12px;
      padding: 2px 8px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }
  }
}

@media (max-width: 768px) {
  .category-nav {
    padding: 12px;
    
    .category-title {
      margin-bottom: 12px;
    }
    
    .category-list {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 10px;
    }
    
    .category-item {
      flex-direction: column;
      padding: 8px 5px;
      text-align: center;
      
      .category-icon {
        margin-right: 0;
        margin-bottom: 5px;
      }
    }
  }
}

.ant-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style> 