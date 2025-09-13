<template>
  <div class="stats-showcase">
    <div class="stats-header">
      <h2 class="section-title">
        <el-icon><DataAnalysis /></el-icon>
        社区数据
      </h2>
      <p class="section-description">我们正在不断成长，感谢每一位贡献者的支持</p>
    </div>

    <div class="stats-grid">
      <div class="stat-card" v-for="(stat, index) in stats" :key="index">
        <div class="stat-icon" :style="{ background: stat.color }">
          <el-icon><component :is="stat.icon" /></el-icon>
        </div>
        <div class="stat-content">
          <div class="stat-counter">
            <span class="counter-value">{{ stat.displayValue }}</span>
            <span class="counter-suffix" v-if="stat.suffix">{{ stat.suffix }}</span>
          </div>
          <div class="stat-label">{{ stat.label }}</div>
          <div class="stat-meta">
            <div class="stat-description">{{ stat.description }}</div>
            
            <div class="stat-trend" v-if="stat.trend">
              <el-icon class="trend-icon" :class="stat.trend.type">
                <component :is="stat.trend.type === 'increase' ? 'ArrowUp' : 'ArrowDown'" />
              </el-icon>
              <span :class="stat.trend.type">{{ stat.trend.value }}</span>
              <span class="trend-period">{{ stat.trend.period }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { 
  DataAnalysis, 
  User, 
  Document, 
  ChatLineSquare, 
  View,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue';

// 统计数据
const statsData = [
  {
    icon: 'User',
    color: 'linear-gradient(45deg, #1e80ff, #3685fd)',
    value: 8642,
    suffix: '+',
    label: '注册用户',
    description: '来自全球各地的社区成员',
    trend: {
      type: 'increase',
      value: '12.8%',
      period: '近30天'
    }
  },
  {
    icon: 'Document',
    color: 'linear-gradient(45deg, #ff6a88, #ff9f8a)',
    value: 12500,
    suffix: '+',
    label: '文章总数',
    description: '包含各种技术领域的优质内容',
    trend: {
      type: 'increase',
      value: '8.3%',
      period: '近30天'
    }
  },
  {
    icon: 'ChatLineSquare',
    color: 'linear-gradient(45deg, #0bab64, #79d387)',
    value: 45328,
    suffix: '',
    label: '评论互动',
    description: '活跃的讨论与知识分享',
    trend: {
      type: 'increase',
      value: '15.6%',
      period: '近30天'
    }
  },
  {
    icon: 'View',
    color: 'linear-gradient(45deg, #ffd25f, #ffa940)',
    value: 6.8,
    suffix: 'M',
    label: '文章浏览量',
    description: '优质内容持续被发现',
    trend: {
      type: 'increase',
      value: '9.2%',
      period: '近30天'
    }
  }
];

// 用于显示的数据
const stats = ref(statsData.map(stat => ({
  ...stat,
  displayValue: 0
})));

// 执行数字增长动画
const animateCounter = (index, targetValue, duration = 2000) => {
  const stat = stats.value[index];
  const startValue = 0;
  const startTime = performance.now();
  
  // 对小数值特殊处理
  const isDecimal = !Number.isInteger(targetValue);
  const multiplier = isDecimal ? 10 : 1;
  const scaledTarget = isDecimal ? targetValue * multiplier : targetValue;
  
  const updateCounter = (timestamp) => {
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // 使用缓动函数使动画更自然
    const easedProgress = progress === 1 ? 1 : 1 - Math.pow(1 - progress, 3);
    
    let currentValue = Math.floor(startValue + (scaledTarget - startValue) * easedProgress);
    
    // 如果是小数，需要转换回小数形式
    if (isDecimal) {
      currentValue = currentValue / multiplier;
    }
    
    stats.value[index].displayValue = currentValue;
    
    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    } else {
      stats.value[index].displayValue = targetValue;
    }
  };
  
  requestAnimationFrame(updateCounter);
};

onMounted(() => {
  // 为每个统计数据启动动画，错开开始时间
  statsData.forEach((stat, index) => {
    setTimeout(() => {
      animateCounter(index, stat.value, 2000 + (index * 200));
    }, index * 150);
  });
});
</script>

<style scoped lang="less">
.stats-showcase {
  padding: 20px 0;
  
  .stats-header {
    text-align: center;
    margin-bottom: 20px;
    
    .section-title {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 17px;
      margin-bottom: 6px;
      color: #1d2129;
      font-weight: 600;
      letter-spacing: 0.3px;
      
      .el-icon {
        color: #1e80ff;
        margin-right: 8px;
        font-size: 18px;
      }
    }
    
    .section-description {
      color: #86909c;
      font-size: 13px;
      margin: 0;
      letter-spacing: 0.2px;
    }
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 12px;
    
    @media (max-width: 1200px) {
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
    }
    
    @media (max-width: 576px) {
      grid-template-columns: 1fr;
      gap: 8px;
    }
  }
  
  .stat-card {
    background: white;
    border-radius: 6px;
    padding: 14px;
    display: flex;
    align-items: flex-start;
    transition: all 0.2s ease;
    box-shadow: 0 1px 6px rgba(0, 0, 0, 0.03);
    border: 1px solid rgba(235, 238, 245, 0.8);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 3px 10px rgba(0, 0, 0, 0.04);
    }
    
    .stat-icon {
      width: 36px;
      height: 36px;
      border-radius: 6px;
      margin-right: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      
      .el-icon {
        font-size: 17px;
        color: white;
      }
    }
    
    .stat-content {
      flex: 1;
      min-width: 0;
      
      .stat-counter {
        font-size: 20px;
        font-weight: 700;
        color: #1d2129;
        margin-bottom: 1px;
        display: flex;
        align-items: baseline;
        letter-spacing: -0.2px;
        
        .counter-value {
          line-height: 1;
        }
        
        .counter-suffix {
          font-size: 14px;
          margin-left: 2px;
          color: #4e5969;
        }
      }
      
      .stat-label {
        font-size: 14px;
        font-weight: 600;
        color: #1d2129;
        margin-bottom: 4px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      
      .stat-meta {
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      
      .stat-description {
        font-size: 11px;
        color: #86909c;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
      }
      
      .stat-trend {
        display: flex;
        align-items: center;
        font-size: 10px;
        background-color: rgba(0, 0, 0, 0.02);
        padding: 2px 6px;
        border-radius: 10px;
        
        .trend-icon {
          margin-right: 2px;
          font-size: 10px;
        }
        
        .increase {
          color: #10b981;
        }
        
        .decrease {
          color: #ef4444;
        }
        
        .trend-period {
          margin-left: 2px;
          color: #8c8c8c;
          font-size: 9px;
        }
      }
    }
  }
  
  @media (max-width: 992px) {
    padding: 15px 0;
    
    .stats-header {
      margin-bottom: 16px;
      
      .section-description {
        font-size: 12px;
      }
    }
    
    .stat-card {
      padding: 12px;
      
      .stat-icon {
        width: 32px;
        height: 32px;
        margin-right: 10px;
        
        .el-icon {
          font-size: 15px;
        }
      }
      
      .stat-content {
        .stat-counter {
          font-size: 18px;
          
          .counter-suffix {
            font-size: 12px;
          }
        }
        
        .stat-label {
          font-size: 13px;
          margin-bottom: 3px;
        }
      }
    }
  }
  
  @media (max-width: 576px) {
    padding: 12px 0;
    
    .stats-header {
      margin-bottom: 14px;
      
      .section-title {
        font-size: 16px;
        
        .el-icon {
          font-size: 16px;
        }
      }
      
      .section-description {
        font-size: 11px;
      }
    }
    
    .stat-card {
      padding: 10px;
      
      .stat-icon {
        width: 28px;
        height: 28px;
        margin-right: 8px;
        
        .el-icon {
          font-size: 14px;
        }
      }
      
      .stat-content {
        .stat-counter {
          font-size: 16px;
          margin-bottom: 0;
          
          .counter-suffix {
            font-size: 11px;
          }
        }
        
        .stat-label {
          font-size: 12px;
          margin-bottom: 2px;
        }
        
        .stat-description {
          font-size: 10px;
        }
        
        .stat-trend {
          font-size: 9px;
          padding: 1px 4px;
          
          .trend-icon, .trend-period {
            font-size: 9px;
          }
        }
      }
    }
  }
}
</style> 