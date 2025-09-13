<template>
  <div class="site-stats-container">
    <div class="stats-wrapper">
      <div class="stats-item" v-for="(stat, index) in siteStats" :key="index">
        <div class="stat-content" :class="{ 'animate-item': enableAnimation }" :style="{ 'animation-delay': `${0.1 * (index + 1)}s` }">
          <div class="stat-icon" :style="{ background: stat.gradient, color: stat.color }">
            <el-icon><component :is="stat.icon" /></el-icon>
          </div>
          <div class="stat-info">
            <div class="stat-value">{{ stat.value }}</div>
            <div class="stat-label">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 数据趋势图 -->
    <div class="trend-chart animate-item" style="animation-delay: 0.5s;">
      <div class="trend-header">
        <h3 class="trend-title">数据增长趋势</h3>
        <div class="trend-legend">
          <span class="legend-item">
            <span class="legend-color" style="background-color: #1677ff"></span>
            <span>访问量</span>
          </span>
          <span class="legend-item">
            <span class="legend-color" style="background-color: #52c41a"></span>
            <span>文章数</span>
          </span>
        </div>
      </div>
      <div class="chart-container">
        <div class="chart-axis">
          <div class="y-axis">
            <div class="axis-line"></div>
            <div class="axis-label">100%</div>
            <div class="axis-label" style="bottom: 50%">50%</div>
            <div class="axis-label" style="bottom: 0">0%</div>
          </div>
          <div class="x-axis">
            <div class="axis-label">1月</div>
            <div class="axis-label">2月</div>
            <div class="axis-label">3月</div>
            <div class="axis-label">4月</div>
            <div class="axis-label">5月</div>
            <div class="axis-label">6月</div>
          </div>
        </div>
        <div class="chart-grid">
          <div class="grid-line" style="bottom: 25%"></div>
          <div class="grid-line" style="bottom: 50%"></div>
          <div class="grid-line" style="bottom: 75%"></div>
        </div>
        <div class="chart-bars">
          <div v-for="(item, index) in trendData" :key="index" class="chart-column">
            <div 
              class="chart-bar visitors animate-bar" 
              :style="{ 
                height: `${item.visitors}%`,
                'animation-delay': `${0.6 + index * 0.03}s`
              }"
              :title="`访问量: ${item.visitors}%`"
            ></div>
            <div 
              class="chart-bar articles animate-bar" 
              :style="{ 
                height: `${item.articles}%`,
                'animation-delay': `${0.7 + index * 0.03}s`
              }"
              :title="`文章数: ${item.articles}%`"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Reading, ChatLineRound, UserFilled, View, Download, Star, 
  TrendCharts, Timer, Notification, Connection
} from '@element-plus/icons-vue';

// 控制是否开启动画
const enableAnimation = ref(true);

// 网站统计数据
const siteStats = ref([
  { 
    label: "文章总数", 
    value: "2,345", 
    icon: Reading,
    color: "#1677ff",
    gradient: "linear-gradient(135deg, rgba(22, 119, 255, 0.1), rgba(22, 119, 255, 0.2))"
  },
  { 
    label: "用户数量", 
    value: "12,500+", 
    icon: UserFilled,
    color: "#722ed1",
    gradient: "linear-gradient(135deg, rgba(114, 46, 209, 0.1), rgba(114, 46, 209, 0.2))"
  },
  { 
    label: "总浏览量", 
    value: "1.2M+", 
    icon: View,
    color: "#13c2c2",
    gradient: "linear-gradient(135deg, rgba(19, 194, 194, 0.1), rgba(19, 194, 194, 0.2))"
  },
  { 
    label: "资源下载", 
    value: "426K", 
    icon: Download,
    color: "#fa8c16",
    gradient: "linear-gradient(135deg, rgba(250, 140, 22, 0.1), rgba(250, 140, 22, 0.2))"
  },
  { 
    label: "评论数", 
    value: "56,892", 
    icon: ChatLineRound,
    color: "#52c41a",
    gradient: "linear-gradient(135deg, rgba(82, 196, 26, 0.1), rgba(82, 196, 26, 0.2))"
  }
]);

// 趋势图数据
const trendData = ref(Array.from({ length: 30 }, () => ({
  visitors: Math.floor(20 + Math.random() * 60),
  articles: Math.floor(15 + Math.random() * 40)
})));
</script>

<style scoped lang="less">
.site-stats-container {
  width: 100%;
  background-color: #fff;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  .stats-wrapper {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-around;
    width: 100%;
    margin: 0 auto;
    gap: 15px;
    
    .stats-item {
      flex: 1;
      min-width: 140px;
      text-align: center;
      position: relative;
      background-color: rgba(250, 250, 250, 0.6);
      border-radius: 10px;
      padding: 15px 10px;
      transition: all 0.3s ease;
      overflow: hidden;
      border: 1px solid rgba(0, 0, 0, 0.03);
      
      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        width: 0;
        height: 3px;
        background: linear-gradient(90deg, transparent, rgba(24, 144, 255, 0.6), transparent);
        transition: width 0.6s ease;
      }
      
      &:hover {
        transform: translateY(-3px);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        background-color: rgba(255, 255, 255, 1);
        
        &::before {
          width: 100%;
        }
        
        .stat-icon {
          transform: rotate(10deg) scale(1.1);
        }
      }
      
      @media (max-width: 768px) {
        min-width: 120px;
        margin-bottom: 10px;
      }
      
      .stat-content {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
      }
      
      .stat-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 48px;
        height: 48px;
        border-radius: 12px;
        color: #1890ff;
        margin-bottom: 12px;
        transition: all 0.3s ease;
        
        .el-icon {
          font-size: 22px;
        }
      }
      
      .stat-info {
        .stat-value {
          font-size: 20px;
          font-weight: 700;
          color: var(--bTitleColor, #333);
          margin-bottom: 5px;
          
          @media (max-width: 768px) {
            font-size: 18px;
          }
        }
        
        .stat-label {
          font-size: 14px;
          color: var(--bDescColor, #666);
          font-weight: 500;
          
          @media (max-width: 768px) {
            font-size: 13px;
          }
        }
      }
    }
  }
  
  /* 趋势图 */
  .trend-chart {
    margin-top: 25px;
    padding-top: 20px;
    border-top: 1px dashed rgba(0, 0, 0, 0.06);
    
    .trend-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
      
      @media (max-width: 576px) {
        flex-direction: column;
        align-items: flex-start;
        gap: 10px;
      }
      
      .trend-title {
        font-size: 16px;
        font-weight: 600;
        color: var(--bTitleColor, #333);
        margin: 0;
      }
      
      .trend-legend {
        display: flex;
        gap: 15px;
        
        .legend-item {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          color: var(--bDescColor, #666);
          
          .legend-color {
            width: 10px;
            height: 10px;
            border-radius: 2px;
          }
        }
      }
    }
    
    .chart-container {
      height: 180px;
      position: relative;
      margin-top: 15px;
      padding: 0 5px 30px 30px;
      
      .chart-axis {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 1;
        pointer-events: none;
        
        .y-axis {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 30px;
          width: 30px;
          
          .axis-line {
            position: absolute;
            left: 29px;
            top: 0;
            bottom: 0;
            width: 1px;
            background-color: rgba(0, 0, 0, 0.09);
          }
          
          .axis-label {
            position: absolute;
            right: 5px;
            transform: translateY(50%);
            font-size: 11px;
            color: #999;
          }
        }
        
        .x-axis {
          position: absolute;
          left: 30px;
          right: 0;
          bottom: 0;
          height: 30px;
          display: flex;
          justify-content: space-between;
          
          .axis-label {
            font-size: 11px;
            color: #999;
            text-align: center;
          }
        }
      }
      
      .chart-grid {
        position: absolute;
        left: 30px;
        right: 0;
        top: 0;
        bottom: 30px;
        z-index: 1;
        pointer-events: none;
        
        .grid-line {
          position: absolute;
          left: 0;
          right: 0;
          height: 1px;
          background-color: rgba(0, 0, 0, 0.04);
        }
      }
      
      .chart-bars {
        position: absolute;
        left: 30px;
        right: 0;
        top: 0;
        bottom: 30px;
        display: flex;
        gap: 2px;
        z-index: 2;
        
        .chart-column {
          flex: 1;
          height: 100%;
          position: relative;
          
          .chart-bar {
            border-radius: 2px 2px 0 0;
            position: absolute;
            bottom: 0;
            transition: transform 0.3s;
            
            &.visitors {
              background-color: rgba(22, 119, 255, 0.7);
              width: 65%;
              left: 17.5%;
              z-index: 2;
            }
            
            &.articles {
              background-color: rgba(82, 196, 26, 0.7);
              width: 40%;
              left: 30%;
              z-index: 3;
            }
            
            &.animate-bar {
              animation: growUp 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
              transform-origin: bottom;
              transform: scaleY(0);
            }
            
            &:hover {
              transform: scaleX(1.2);
              z-index: 4;
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
      transform: scale(0.95) translateY(20px);
    }
    60% {
      opacity: 0.8;
      transform: scale(1.02) translateY(-5px);
    }
    100% {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
  
  @keyframes growUp {
    0% {
      transform: scaleY(0);
    }
    100% {
      transform: scaleY(1);
    }
  }
}
</style> 