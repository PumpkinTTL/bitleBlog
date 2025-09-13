<template>
  <div class="rankings-container">
    <div class="ranking-tabs">
      <div 
        class="rank-tab" 
        v-for="(tab, index) in rankingTabs" 
        :key="index"
        :class="{ active: activeRankTab === index }"
        @click="setActiveRankTab(index)"
      >
        <i :class="tab.icon"></i>
        <span>{{ tab.name }}</span>
      </div>
    </div>
    
    <div class="ranking-list">
      <a 
        href="#" 
        class="rank-item" 
        v-for="(item, index) in currentRankingList" 
        :key="index"
        @click.prevent="handleRankItemClick(item.url)"
      >
        <div class="rank-position" :class="{ 'top-rank': index < 3 }">
          {{ index + 1 }}
        </div>
        <div class="rank-content">
          <div class="rank-title">{{ item.title }}</div>
          <div class="rank-meta">
            <span class="rank-value">
              <i :class="rankingTabs[activeRankTab].metaIcon"></i>
              {{ item.value }}
            </span>
            <span class="rank-tag" v-if="item.tag">{{ item.tag }}</span>
          </div>
        </div>
      </a>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, defineProps, defineEmits } from 'vue';

// Define type for ranking item
interface RankingItem {
  title: string;
  value: string;
  tag: string;
  url: string;
}

// Define type for rankings data
interface RankingsData {
  [key: number]: RankingItem[];
}

const props = defineProps<{
  initialTab?: number; // Optional initial active tab
  rankingTabs: Array<{ name: string; icon: string; metaIcon: string }>;
  rankingsData: RankingsData;
}>();

const emit = defineEmits<{
  (e: 'rankItemClick', url: string): void;
}>();

// Active tab state - use prop value or default to 0
const activeRankTab = ref(props.initialTab !== undefined ? props.initialTab : 0);

// Computed property to get the current ranking list based on active tab
const currentRankingList = computed(() => {
  return props.rankingsData[activeRankTab.value] || [];
});

// Handle ranking tab change
const setActiveRankTab = (index: number) => {
  activeRankTab.value = index;
};

// Handle rank item click
const handleRankItemClick = (url: string) => {
  emit('rankItemClick', url);
};
</script>

<style lang="less" scoped>
.rankings-container {
  margin-top: 16px;
  
  .ranking-tabs {
    display: flex;
    gap: 8px;
    margin-bottom: 14px;
    
    .rank-tab {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 5px;
      padding: 8px 5px;
      background: rgba(22, 119, 255, 0.04);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.25s ease;
      border: 1px solid rgba(22, 119, 255, 0.05);
      position: relative;
      overflow: hidden;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        background: linear-gradient(to right, #1677FF, rgba(22, 119, 255, 0.3));
        transform: scaleX(0);
        transform-origin: left;
        transition: transform 0.25s ease;
      }
      
      i {
        font-size: 14px;
        color: #1677FF;
        transition: all 0.25s ease;
      }
      
      span {
        font-size: 10px;
        color: #666;
        white-space: nowrap;
        transition: all 0.25s ease;
      }
      
      &:hover {
        background: rgba(22, 119, 255, 0.08);
        transform: translateY(-2px);
        
        &::after {
          transform: scaleX(0.7);
        }
        
        i {
          transform: scale(1.1);
        }
        
        span {
          color: #1677FF;
        }
      }
      
      &.active {
        background: rgba(22, 119, 255, 0.12);
        border-color: rgba(22, 119, 255, 0.15);
        
        &::after {
          transform: scaleX(1);
        }
        
        i {
          transform: scale(1.1);
          color: #0958d9;
        }
        
        span {
          color: #0958d9;
          font-weight: 500;
        }
      }
    }
  }
  
  .ranking-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    
    .rank-item {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 10px;
      background: #fff;
      border-radius: 8px;
      text-decoration: none;
      transition: all 0.3s ease;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.02);
      border: 1px solid #f5f5f5;
      position: relative;
      overflow: hidden;
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 3px;
        height: 100%;
        background: linear-gradient(to bottom, rgba(22, 119, 255, 0.5), rgba(22, 119, 255, 0.1));
        opacity: 0;
        transition: opacity 0.3s ease;
      }
      
      &:hover {
        transform: translateX(5px);
        background: #f9faff;
        border-color: rgba(22, 119, 255, 0.1);
        
        &::before {
          opacity: 1;
        }
        
        .rank-position {
          transform: scale(1.1);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
          
          &.top-rank {
            box-shadow: 0 3px 8px rgba(22, 119, 255, 0.2);
          }
        }
        
        .rank-title {
          color: #1677FF;
        }
      }
      
      .rank-position {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 26px;
        height: 26px;
        background: #f0f0f0;
        color: #666;
        border-radius: 6px;
        font-size: 13px;
        font-weight: 600;
        flex-shrink: 0;
        transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        position: relative;
        
        &.top-rank {
          background: linear-gradient(135deg, #1677FF, #69b4ff);
          color: white;
          box-shadow: 0 2px 6px rgba(22, 119, 255, 0.2);
          
          &::after {
            content: '';
            position: absolute;
            top: -3px;
            right: -3px;
            width: 8px;
            height: 8px;
            background: #ff4d4f;
            border-radius: 50%;
            border: 1px solid white;
          }
        }
      }
      
      .rank-content {
        flex: 1;
        min-width: 0;
        
        .rank-title {
          font-size: 13px;
          color: #333;
          margin-bottom: 5px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          transition: color 0.3s ease;
        }
        
        .rank-meta {
          display: flex;
          align-items: center;
          gap: 8px;
          
          .rank-value {
            font-size: 10px;
            color: #666;
            display: flex;
            align-items: center;
            gap: 4px;
            
            i {
              font-size: 9px;
              color: #1677FF;
            }
          }
          
          .rank-tag {
            font-size: 9px;
            background: rgba(22, 119, 255, 0.1);
            color: #1677FF;
            padding: 1px 5px;
            border-radius: 4px;
          }
        }
      }
      
      // Special styling for top 3 items
      &:nth-child(1) .rank-position.top-rank {
        background: linear-gradient(135deg, #FFD700, #FFA500);
        color: #5d4037;
        
        &::after {
          background: #e53935;
        }
      }
      
      &:nth-child(2) .rank-position.top-rank {
        background: linear-gradient(135deg, #E0E0E0, #BDBDBD);
        color: #424242;
        
        &::after {
          background: #7B1FA2;
        }
      }
      
      &:nth-child(3) .rank-position.top-rank {
        background: linear-gradient(135deg, #D7CCC8, #A1887F);
        color: #3E2723;
        
        &::after {
          background: #EF6C00;
        }
      }
    }
  }
}
</style> 