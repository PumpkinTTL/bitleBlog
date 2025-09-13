import { defineStore } from 'pinia';
import { ref, computed, watch } from 'vue';

export const useThemeStore = defineStore('theme', () => {
  // 暗色模式状态
  const isDark = ref(false);

  // 初始化主题
  const initTheme = () => {
    // 从localStorage读取保存的主题设置
    const savedTheme = localStorage.getItem('theme');
    
    if (savedTheme) {
      isDark.value = savedTheme === 'dark';
    } else {
      // 如果没有保存的设置，使用系统偏好
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    
    // 应用主题
    applyTheme();
  };

  // 应用主题到DOM
  const applyTheme = () => {
    const html = document.documentElement;
    
    if (isDark.value) {
      html.classList.add('dark');
      html.setAttribute('data-theme', 'dark');
    } else {
      html.classList.remove('dark');
      html.setAttribute('data-theme', 'light');
    }
  };

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value;
    applyTheme();
    
    // 保存到localStorage
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
  };

  // 设置主题
  const setTheme = (theme: 'light' | 'dark') => {
    isDark.value = theme === 'dark';
    applyTheme();
    
    // 保存到localStorage
    localStorage.setItem('theme', theme);
  };

  // 监听系统主题变化
  const watchSystemTheme = () => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    mediaQuery.addEventListener('change', (e) => {
      // 只有在用户没有手动设置主题时才跟随系统
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches;
        applyTheme();
      }
    });
  };

  // 计算属性
  const currentTheme = computed(() => isDark.value ? 'dark' : 'light');
  const themeIcon = computed(() => isDark.value ? 'fas fa-sun' : 'fas fa-moon');
  const themeText = computed(() => isDark.value ? '浅色模式' : '深色模式');

  // 监听isDark变化，确保DOM同步
  watch(isDark, () => {
    applyTheme();
  }, { immediate: false });

  return {
    // 状态
    isDark,
    
    // 计算属性
    currentTheme,
    themeIcon,
    themeText,
    
    // 方法
    initTheme,
    toggleTheme,
    setTheme,
    watchSystemTheme,
    applyTheme
  };
});
