<template>
  <div class="daily-checkin-card">
    <!-- 卡片头部 -->
    <div class="card-header">
      <i class="fas fa-calendar-check"></i>
      <span>每日打卡</span>
    </div>

    <!-- 卡片内容 -->
    <div class="card-body">
      <!-- 连续打卡 -->
      <div class="streak-section">
        <div class="streak-badge">
          <i class="fas fa-fire"></i>
        </div>
        <div class="streak-info">
          <div class="streak-top">
            <div class="streak-number">{{ consecutiveDays }}</div>
            <div class="streak-tag" v-if="consecutiveDays >= 7">
              <i class="fas fa-trophy"></i>
              {{ getStreakLabel() }}
            </div>
          </div>
          <div class="streak-label">连续天数</div>
          <div class="streak-progress">
            <div class="progress-bar" :style="{ width: getProgressWidth() }"></div>
          </div>
        </div>
      </div>

      <!-- 统计信息 -->
      <div class="stats-row">
        <div class="stat-item">
          <i class="fas fa-calendar-alt"></i>
          <span>本月 {{ monthlyCheckins }} 次</span>
        </div>
        <div class="stat-divider"></div>
        <div class="stat-item">
          <i class="fas fa-chart-line"></i>
          <span>累计 {{ totalCheckins }} 次</span>
        </div>
      </div>

      <!-- 打卡按钮 -->
      <button 
        class="checkin-button" 
        :class="{ checked: isCheckedToday }"
        :disabled="isCheckedToday"
        @click="handleCheckIn"
      >
        <i :class="isCheckedToday ? 'fas fa-check-circle' : 'fas fa-hand-pointer'"></i>
        <span>{{ isCheckedToday ? '今日已打卡' : '立即打卡' }}</span>
      </button>

      <!-- 奖励提示 -->
      <div class="reward-hint">
        <i class="fas fa-gift"></i>
        <span>每日打卡可获得 5 积分 + 10 经验</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const consecutiveDays = ref(7)
const monthlyCheckins = ref(18)
const totalCheckins = ref(365)
const isCheckedToday = ref(false)

const emit = defineEmits<{
  checkIn: []
}>()

const getStreakLabel = () => {
  if (consecutiveDays.value >= 30) return '月度达人'
  if (consecutiveDays.value >= 21) return '坚持之星'
  if (consecutiveDays.value >= 14) return '进阶达人'
  if (consecutiveDays.value >= 7) return '初级达人'
  return ''
}

const getProgressWidth = () => {
  const target = consecutiveDays.value < 7 ? 7 : 
                 consecutiveDays.value < 14 ? 14 :
                 consecutiveDays.value < 21 ? 21 : 30
  const progress = Math.min((consecutiveDays.value / target) * 100, 100)
  return `${progress}%`
}

const handleCheckIn = () => {
  if (isCheckedToday.value) return
  
  isCheckedToday.value = true
  consecutiveDays.value++
  monthlyCheckins.value++
  totalCheckins.value++
  
  emit('checkIn')
}
</script>

<style lang="less" scoped>
.daily-checkin-card {
  background: var(--el-bg-color);
  border: 1px solid var(--el-border-color-lighter);
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  }
}

.card-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 10px;
  background: var(--el-fill-color-extra-light);
  border-bottom: 1px solid var(--el-border-color-extra-light);

  i {
    color: #f97316;
    font-size: 13px;
  }

  span {
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    font-family: 'OPPO Sans', sans-serif;
  }
}

.card-body {
  padding: 16px;
}

// 连续打卡
.streak-section {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 16px;
  margin-bottom: 14px;
  background: linear-gradient(135deg, rgba(254, 243, 199, 0.15), rgba(253, 230, 138, 0.15));
  border-radius: 8px;
  border: 1px solid rgba(251, 191, 36, 0.15);
  transition: all 0.3s ease;

  &:hover {
    background: linear-gradient(135deg, rgba(254, 243, 199, 0.25), rgba(253, 230, 138, 0.25));
    border-color: rgba(251, 191, 36, 0.25);
  }

  .streak-badge {
    position: relative;
    width: 56px;
    height: 56px;
    border-radius: 50%;
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 
      0 4px 16px rgba(245, 158, 11, 0.25),
      0 0 0 4px rgba(251, 191, 36, 0.1);
    flex-shrink: 0;
    transition: all 0.3s ease;

    &::before {
      content: '';
      position: absolute;
      inset: -6px;
      border-radius: 50%;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.2), transparent);
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    i {
      font-size: 26px;
      color: white;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.15));
      position: relative;
      z-index: 1;
    }
  }

  &:hover .streak-badge {
    transform: scale(1.05);
    box-shadow: 
      0 6px 20px rgba(245, 158, 11, 0.35),
      0 0 0 4px rgba(251, 191, 36, 0.15);

    &::before {
      opacity: 1;
    }
  }

  .streak-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;

    .streak-top {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .streak-number {
      font-size: 28px;
      font-weight: 700;
      color: var(--el-text-color-primary);
      font-family: 'Courier New', monospace;
      line-height: 1;
      background: linear-gradient(135deg, #f59e0b, #d97706);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }

    .streak-tag {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 3px 8px;
      font-size: 10px;
      font-weight: 600;
      color: #f59e0b;
      background: linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.15));
      border: 1px solid rgba(251, 191, 36, 0.3);
      border-radius: 12px;
      animation: tagPulse 2s ease-in-out infinite;

      i {
        font-size: 9px;
      }
    }

    .streak-label {
      font-size: 11px;
      color: var(--el-text-color-secondary);
      font-weight: 500;
      letter-spacing: 0.5px;
    }

    .streak-progress {
      width: 100%;
      height: 4px;
      background: rgba(0, 0, 0, 0.05);
      border-radius: 2px;
      overflow: hidden;
      margin-top: -2px;

      .progress-bar {
        height: 100%;
        background: linear-gradient(90deg, #fbbf24, #f59e0b);
        border-radius: 2px;
        transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
      }
    }
  }
}

@keyframes tagPulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.85;
    transform: scale(0.98);
  }
}

// 统计信息
.stats-row {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin-bottom: 14px;
  font-size: 11px;
  padding: 10px 0;

  .stat-item {
    display: flex;
    align-items: center;
    gap: 5px;
    transition: all 0.3s ease;

    &:first-child i {
      color: #10b981;
    }

    &:last-child i {
      color: #6366f1;
    }

    i {
      font-size: 12px;
    }

    span {
      color: var(--el-text-color-regular);
      font-weight: 500;
    }

    &:hover {
      transform: translateY(-1px);
    }
  }

  .stat-divider {
    width: 1px;
    height: 12px;
    background: var(--el-border-color);
  }
}

// 打卡按钮
.checkin-button {
  width: 100%;
  height: 36px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'OPPO Sans', sans-serif;
  margin-bottom: 10px;
  background: linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(245, 158, 11, 0.1));
  color: #d97706;
  border: 1.5px solid #fbbf24;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(251, 191, 36, 0.2), transparent);
    transition: left 0.5s ease;
  }

  i {
    font-size: 13px;
    position: relative;
    z-index: 1;
  }

  span {
    position: relative;
    z-index: 1;
  }

  &:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(251, 191, 36, 0.18), rgba(245, 158, 11, 0.18));
    border-color: #f59e0b;
    transform: translateY(-1px);
    box-shadow: 0 2px 8px rgba(251, 191, 36, 0.25);

    &::before {
      left: 100%;
    }
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &.checked {
    background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(5, 150, 105, 0.1));
    color: #059669;
    border-color: #10b981;
    cursor: not-allowed;

    &:hover {
      transform: none;
      box-shadow: none;
    }
  }

  &:disabled {
    opacity: 0.7;
  }
}

// 奖励提示
.reward-hint {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  font-size: 11px;
  color: var(--el-text-color-secondary);
  padding: 8px;
  text-align: center;

  i {
    color: #f59e0b;
    font-size: 12px;
  }

  span {
    font-weight: 500;
  }
}
</style>
