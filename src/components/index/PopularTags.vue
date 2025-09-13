<template>
  <div class="popular-tags">
    <div class="tags-title">
      <h3>热门标签</h3>
      <div class="title-underline"></div>
    </div>
    <div class="tags-cloud">
      <div 
        v-for="(tag, index) in tags" 
        :key="tag.id"
        class="tag-item"
        :class="`animate__animated animate__fadeIn`"
        :style="`animation-delay: ${0.1 + index * 0.03}s`"
        @click="onTagClick(tag.id)"
      >
        <span class="tag-name"># {{ tag.name }}</span>
        <span class="tag-count">{{ tag.count }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';

interface Tag {
  id: number;
  name: string;
  count: number;
}

const tags = ref<Tag[]>([
  { id: 1, name: 'Vue', count: 42 },
  { id: 2, name: 'React', count: 38 },
  { id: 3, name: 'TypeScript', count: 35 },
  { id: 4, name: 'JavaScript', count: 56 },
  { id: 5, name: 'Node.js', count: 29 },
  { id: 6, name: 'CSS', count: 31 },
  { id: 7, name: 'HTML', count: 27 },
  { id: 8, name: 'Python', count: 24 },
  { id: 9, name: 'Java', count: 19 },
  { id: 10, name: 'Spring', count: 15 },
  { id: 11, name: 'Docker', count: 18 },
  { id: 12, name: 'Git', count: 21 }
]);

const emit = defineEmits(['tag-click']);

const onTagClick = (id: number) => {
  emit('tag-click', id);
};

onMounted(() => {
  // 实际应用中，这里可以调用API获取标签数据
  console.log('PopularTags component mounted');
});
</script>

<style lang="less" scoped>
.popular-tags {
  background-color: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  padding: 15px;
  margin-bottom: 20px;
  border: 1px solid #eee;
  
  .tags-title {
    margin-bottom: 15px;
    
    h3 {
      font-size: 16px;
      font-weight: 600;
      color: #333;
      margin: 0;
    }
  }
  
  .tags-cloud {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .tag-item {
    display: inline-flex;
    align-items: center;
    background-color: #f9f9f9;
    border-radius: 4px;
    padding: 6px 10px;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:hover {
      background-color: #f0f7ff;
      color: #1677FF;
    }
    
    .tag-name {
      font-size: 14px;
      color: #333;
    }
    
    .tag-count {
      margin-left: 5px;
      background-color: #eee;
      color: #666;
      font-size: 12px;
      padding: 1px 6px;
      border-radius: 10px;
      min-width: 20px;
      text-align: center;
    }
  }
}

@media (max-width: 768px) {
  .popular-tags {
    padding: 12px;
    
    .tags-title {
      margin-bottom: 12px;
    }
    
    .tags-cloud {
      gap: 8px;
    }
    
    .tag-item {
      padding: 5px 8px;
      
      .tag-name {
        font-size: 13px;
      }
      
      .tag-count {
        font-size: 11px;
        padding: 1px 5px;
      }
    }
  }
}
</style> 