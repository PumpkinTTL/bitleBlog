<template>
  <div class="theme-switcher" :class="{ 'theme-switcher-dark': isDark }">
    <div class="theme-toggle" @click="toggleTheme">
      <div class="toggle-track">
        <div class="toggle-icon light-icon">
          <el-icon><Sunny /></el-icon>
        </div>
        <div class="toggle-icon dark-icon">
          <el-icon><Moon /></el-icon>
        </div>
      </div>
      <div class="toggle-thumb" :class="{ 'toggle-thumb-dark': isDark }"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';
import { Sunny, Moon } from '@element-plus/icons-vue';

// Props
const props = defineProps({
  // 默认主题
  defaultTheme: {
    type: String,
    default: 'light', // 'light' 或 'dark'
    validator: (value) => ['light', 'dark'].includes(value)
  }
});

// Emits
const emit = defineEmits(['theme-change']);

// 当前主题状态
const isDark = ref(props.defaultTheme === 'dark');

// 在localStorage中保存的主题key
const THEME_KEY = 'bitle-theme-mode';

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value;
};

// 应用主题到DOM
const applyTheme = (dark) => {
  if (dark) {
    document.documentElement.classList.add('dark');
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem(THEME_KEY, 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.setAttribute('data-theme', 'light');
    localStorage.setItem(THEME_KEY, 'light');
  }
  
  // 触发主题变更事件
  emit('theme-change', dark ? 'dark' : 'light');
};

// 监听主题变化并应用
watch(isDark, (newVal) => {
  applyTheme(newVal);
});

// 组件加载时初始化主题
onMounted(() => {
  // 从localStorage中读取用户偏好
  const savedTheme = localStorage.getItem(THEME_KEY);
  
  if (savedTheme) {
    // 如果有保存的主题偏好，使用它
    isDark.value = savedTheme === 'dark';
  } else {
    // 如果没有保存的偏好，尝试使用系统偏好
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    isDark.value = prefersDark;
    
    // 监听系统主题变化
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // 只有当用户没有手动设置过主题时，才跟随系统变化
      if (!localStorage.getItem(THEME_KEY)) {
        isDark.value = e.matches;
      }
    });
  }
  
  // 应用初始主题
  applyTheme(isDark.value);
});
</script>

<style scoped lang="less">
.theme-switcher {
  display: inline-block;
  
  .theme-toggle {
    position: relative;
    width: 60px;
    height: 28px;
    background-color: transparent;
    border-radius: 30px;
    padding: 0;
    cursor: pointer;
    transition: all 0.2s ease;
    overflow: hidden;
    
    .toggle-track {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: #f0f3f9;
      border-radius: 30px;
      border: 1px solid #e0e0e0;
      transition: background-color 0.2s ease, border-color 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 5px;
      
      .toggle-icon {
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 18px;
        height: 18px;
        z-index: 1;
        transition: color 0.2s ease;
      }
      
      .light-icon {
        color: #f1c40f;
      }
      
      .dark-icon {
        color: #a9b1d6;
      }
    }
    
    .toggle-thumb {
      position: absolute;
      top: 3px;
      left: 3px;
      width: 22px;
      height: 22px;
      background-color: white;
      border-radius: 50%;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      transition: transform 0.25s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      z-index: 2;
      
      &.toggle-thumb-dark {
        transform: translateX(32px);
      }
    }
  }
  
  &.theme-switcher-dark {
    .toggle-track {
      background-color: #2c3e50;
      border-color: #34495e;
    }
    
    .toggle-thumb {
      background-color: #485fc7;
    }
  }
}

@media (max-width: 767px) {
  .theme-switcher {
    .theme-toggle {
      width: 50px;
      height: 24px;
      
      .toggle-thumb {
        width: 18px;
        height: 18px;
        
        &.toggle-thumb-dark {
          transform: translateX(26px);
        }
      }
      
      .toggle-track {
        .toggle-icon {
          font-size: 12px;
          width: 16px;
          height: 16px;
        }
      }
    }
  }
}
</style> 