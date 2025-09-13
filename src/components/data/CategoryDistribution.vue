<template>
  <div class="category-distribution">
    <h3 class="category-title">
      <i class="category-icon"></i>
      分类统计
      <span class="category-subtitle">文章分类分布情况</span>
    </h3>

    <div class="category-chart-container">
      <div class="chart-legend">
        <div class="legend-item animate-item" v-for="(category, index) in categories" :key="index"
          :style="{ 'animation-delay': `${0.1 * (index + 1)}s` }" @mouseenter="highlightSegment(index)"
          @mouseleave="resetHighlight">
          <div class="legend-color" :style="{ backgroundColor: category.color }"></div>
          <div class="legend-label">{{ category.name }}</div>
          <div class="legend-info">
            <div class="legend-value">{{ category.count }}</div>
            <div class="legend-percent">{{ getPercentage(category.count) }}%</div>
          </div>
          <div class="legend-bar">
            <div class="legend-progress" :style="{ 
              width: getPercentage(category.count) + '%',
              backgroundColor: category.color
            }"></div>
          </div>
        </div>
      </div>

      <div class="chart-visual">
        <div class="donut-chart" ref="donutChart">
          <div class="donut-hole"></div>
          <div class="donut-info">
            <div class="info-value">{{ totalArticles }}</div>
            <div class="info-label">篇文章</div>
          </div>
          <div v-for="(segment, index) in pieSegments" :key="index" class="donut-segment"
            :class="{ 'highlight': activeSegment === index }" :style="{
              '--start': segment.start + 'deg',
              '--end': segment.end + 'deg',
              '--bg': segment.color,
              'animation-delay': `${0.3 + index * 0.1}s`
            }" @mouseenter="highlightSegment(index)" @mouseleave="resetHighlight"></div>
          <div class="donut-tooltip" v-if="showTooltip" :style="tooltipStyle">
            <div class="tooltip-color" :style="{ backgroundColor: tooltipData.color }"></div>
            <div class="tooltip-content">
              <div class="tooltip-title">{{ tooltipData.name }}</div>
              <div class="tooltip-value">{{ tooltipData.count }} ({{ tooltipData.percent }}%)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 分类数据
const categories = ref([
  { name: '前端技术', count: 258, color: '#4096ff' },
  { name: '后端开发', count: 195, color: '#9254de' },
  { name: '人工智能', count: 124, color: '#f759ab' },
  { name: '移动开发', count: 147, color: '#faad14' },
  { name: '工具资源', count: 186, color: '#36cfc9' },
  { name: '其他分类', count: 89, color: '#73d13d' }
]);

// 文章总数
const totalArticles = computed(() => {
  return categories.value.reduce((sum, category) => sum + category.count, 0);
});

// 饼图交互相关
const activeSegment = ref(null);
const showTooltip = ref(false);
const tooltipData = ref({});
const tooltipStyle = ref({});
const donutChart = ref(null);

// 计算饼图的分段
const pieSegments = computed(() => {
  const total = totalArticles.value;
  let currentAngle = 0;
  
  return categories.value.map(category => {
    const percentage = category.count / total;
    const degrees = percentage * 360;
    
    const segment = {
      percentage: percentage,
      start: currentAngle,
      end: currentAngle + degrees,
      color: category.color
    };
    
    currentAngle += degrees;
    return segment;
  });
});

// 计算百分比
const getPercentage = (count) => {
  return Math.round((count / totalArticles.value) * 100);
};

// 高亮某个分段
const highlightSegment = (index) => {
  activeSegment.value = index;
  showTooltip.value = true;
  
  const category = categories.value[index];
  const percent = getPercentage(category.count);
  
  tooltipData.value = {
    name: category.name,
    count: category.count,
    percent: percent,
    color: category.color
  };
  
  // 计算饼图的中心点
  if (donutChart.value) {
    const chartRect = donutChart.value.getBoundingClientRect();
    const chartCenter = {
      x: chartRect.width / 2,
      y: chartRect.height / 2
    };
    
    // 计算段的中间角度
    const segment = pieSegments.value[index];
    const middleAngle = (segment.start + segment.end) / 2;
    const middleRad = (middleAngle - 90) * (Math.PI / 180);
    
    // 计算提示框位置
    const radius = chartRect.width * 0.35; // 半径的70%处
    const x = chartCenter.x + radius * Math.cos(middleRad);
    const y = chartCenter.y + radius * Math.sin(middleRad);
    
    tooltipStyle.value = {
      left: `${x}px`,
      top: `${y}px`,
      transform: 'translate(-50%, -50%)'
    };
  }
};

// 重置高亮
const resetHighlight = () => {
  activeSegment.value = null;
  showTooltip.value = false;
};

// 组件挂载后
onMounted(() => {
  // 避免在服务器端渲染时出错
  if (typeof window !== 'undefined') {
    // 开始动画效果
    setTimeout(() => {
      const segments = document.querySelectorAll('.donut-segment');
      segments.forEach(segment => {
        segment.classList.add('animate-segment');
      });
    }, 300);
  }
});
</script>

<style scoped lang="less">
.category-distribution {
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  .category-title {
    font-size: 16px;
    font-weight: 600;
    color: var(--bTitleColor, #333);
    margin: 0 0 20px;
    text-align: center;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &::before, &::after {
      content: '';
      height: 1px;
      background: linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.08), transparent);
      flex: 1;
    }
    
    &::before {
      margin-right: 15px;
    }
    
    &::after {
      margin-left: 15px;
    }
    
    .category-subtitle {
      font-size: 12px;
      color: #aaa;
      font-weight: normal;
      margin-left: 8px;
    }
  }
  
  .category-chart-container {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 30px;
    
    @media (max-width: 768px) {
      flex-direction: column-reverse;
    }
    
    .chart-legend {
      flex: 1;
      min-width: 220px;
      
      .legend-item {
        margin-bottom: 14px;
        cursor: pointer;
        padding: 8px;
        border-radius: 6px;
        transition: background-color 0.2s;
        
        &:hover {
          background-color: rgba(0, 0, 0, 0.02);
        }
        
        &:last-child {
          margin-bottom: 0;
        }
        
        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 2px;
          margin-right: 8px;
          display: inline-block;
          vertical-align: middle;
        }
        
        .legend-label {
          font-size: 14px;
          color: var(--bTitleColor, #333);
          display: inline-block;
          vertical-align: middle;
          margin-right: 10px;
          font-weight: 500;
        }
        
        .legend-info {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 4px 0;
          
          .legend-value {
            font-weight: 600;
            color: var(--bTitleColor, #333);
          }
          
          .legend-percent {
            color: #999;
            font-size: 13px;
          }
        }
        
        .legend-bar {
          height: 6px;
          background-color: #f0f0f0;
          border-radius: 3px;
          overflow: hidden;
          
          .legend-progress {
            height: 100%;
            border-radius: 3px;
            transition: width 1s ease;
          }
        }
      }
    }
    
    .chart-visual {
      flex: 1;
      display: flex;
      justify-content: center;
      align-items: center;
      
      .donut-chart {
        position: relative;
        width: 220px;
        height: 220px;
        border-radius: 50%;
        background-color: #f5f5f5;
        
        @media (max-width: 768px) {
          width: 180px;
          height: 180px;
        }
        
        .donut-hole {
          position: absolute;
          width: 60%;
          height: 60%;
          background-color: white;
          border-radius: 50%;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 5;
          box-shadow: inset 0 0 5px rgba(0,0,0,0.05);
        }
        
        .donut-info {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          z-index: 6;
          text-align: center;
          
          .info-value {
            font-size: 24px;
            font-weight: 700;
            color: var(--bTitleColor, #333);
          }
          
          .info-label {
            font-size: 12px;
            color: #999;
          }
        }
        
        .donut-segment {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          clip-path: polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 0%, 50% 0%);
          background: conic-gradient(
            var(--bg) var(--start),
            var(--bg) var(--end),
            transparent var(--end)
          );
          transform-origin: center;
          filter: drop-shadow(0 2px 3px rgba(0, 0, 0, 0.1));
          opacity: 0;
          transform: scale(0);
          transition: transform 0.3s, opacity 0.3s, filter 0.3s;
          
          &.animate-segment {
            animation: pieIn 0.7s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          }
          
          &.highlight {
            filter: drop-shadow(0 0 8px rgba(0, 0, 0, 0.2));
            transform: scale(1.03);
            z-index: 4;
          }
        }
        
        .donut-tooltip {
          position: absolute;
          background-color: white;
          border-radius: 6px;
          padding: 6px 10px;
          box-shadow: 0 3px 15px rgba(0, 0, 0, 0.15);
          display: flex;
          align-items: center;
          z-index: 10;
          pointer-events: none;
          
          .tooltip-color {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
          }
          
          .tooltip-content {
            .tooltip-title {
              font-size: 12px;
              font-weight: 600;
              color: #333;
            }
            
            .tooltip-value {
              font-size: 11px;
              color: #666;
            }
          }
        }
      }
    }
  }
  
  /* 动画样式 */
  .animate-item {
    animation: smoothIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;
  }
  
  @keyframes smoothIn {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
  
  @keyframes pieIn {
    0% {
      opacity: 0;
      transform: scale(0);
    }
    60% {
      opacity: 1;
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
}
</style> 