<template>
  <div class="theme-toggle" :class="{ 'dark-mode': isDarkMode }">
    <button 
      class="toggle-button" 
      @click="toggleTheme"
      :title="isDarkMode ? '切换到亮色模式' : '切换到暗色模式'"
    >
      <transition name="rotate" mode="out-in">
        <i class="ant-icon" v-if="!isDarkMode" key="sun">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="sun" aria-hidden="true">
            <path d="M512 870c-58.1 0-112.5-22.6-153.5-63.7-41-41-63.6-95.4-63.6-153.4.1-58.1 22.7-112.4 63.8-153.3C399.5 458.5 453.9 436 512 436c58.1 0 112.5 22.6 153.5 63.7 41 41 63.6 95.4 63.6 153.4s-22.6 112.4-63.6 153.4C624.5 847.4 570.1 870 512 870zm0-394c-97.2 0-176 78.8-176 176s78.8 176 176 176 176-78.8 176-176-78.8-176-176-176zm464-80h-104c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h104c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zm-421.3-41.6c2.8 3.4 7.9 3.8 11.3 1l14.5-12.1c3.4-2.8 3.8-7.9 1-11.3l-63.7-76.3c-2.9-3.4-7.9-3.8-11.3-1l-14.4 12.1c-3.4 2.8-3.8 7.9-1 11.3l63.6 76.3zm176.3-33.9l12.6-14c2.8-3.1 2.5-7.9-.6-10.7l-73.4-67c-3.1-2.8-7.9-2.6-10.7.6l-12.6 14c-2.8 3.1-2.5 7.9.6 10.7l73.4 67c3.1 2.8 7.9 2.6 10.7-.6zm-254.5 33.9c2.8 3.4 7.9 3.8 11.3 1l14.5-12.1c3.4-2.8 3.8-7.9 1-11.3L439.6 252c-2.8-3.4-7.9-3.8-11.3-1l-14.5 12.1c-3.4 2.8-3.8 7.9-1 11.3l63.6 76.3zM152 396h104c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H152c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8zm76 158.9c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v104c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8V554.9zm687.2 129.5L853 628.3c-3.1-2.8-7.9-2.6-10.7.6l-12.6 14c-2.8 3.1-2.5 7.9.6 10.7l63.5 57.9c3.1 2.8 7.9 2.6 10.7-.6l12.6-14c2.8-3.1 2.5-7.9-.6-10.7zm-45.4-401.1l-73.4-67c-3.1-2.8-7.9-2.6-10.7.6l-12.6 14c-2.8 3.1-2.5 7.9.6 10.7l73.4 67c3.1 2.8 7.9 2.6 10.7-.6l12.6-14c2.8-3.1 2.5-7.9-.6-10.7zM512 140c-23.8 0-43 19.2-43 43s19.2 43 43 43 43-19.2 43-43-19.2-43-43-43z"></path>
          </svg>
        </i>
        <i class="ant-icon" v-else key="moon">
          <svg viewBox="64 64 896 896" focusable="false" data-icon="moon" aria-hidden="true">
            <path d="M923 283.6a260.04 260.04 0 00-56.9-82.8 264.4 264.4 0 00-84-55.5A265.34 265.34 0 00679.7 125c-49.3 0-97.4 13.5-139.2 39-10 6.1-19.5 12.8-28.5 20.1-9-7.3-18.5-14-28.5-20.1-41.8-25.5-89.9-39-139.2-39-35.5 0-69.9 6.8-102.4 20.3-31.4 13-59.7 31.7-84 55.5a258.44 258.44 0 00-56.9 82.8c-13.9 32.3-21 66.6-21 101.9 0 33.3 6.8 68 20.3 103.3 11.3 29.5 27.5 60.1 48.2 91 32.8 48.9 77.9 99.9 133.9 151.6 92.8 85.7 184.7 144.9 188.6 147.3l23.7 15.2c10.5 6.7 24 6.7 34.5 0l23.7-15.2c3.9-2.5 95.7-61.6 188.6-147.3 56-51.7 101.1-102.7 133.9-151.6 20.7-30.9 37-61.5 48.2-91 13.5-35.3 20.3-70 20.3-103.3.1-35.3-7-69.6-20.9-101.9zM512 814.8S156 586.7 156 385.5C156 283.6 240.3 201 344.3 201c73.1 0 136.5 40.8 167.7 100.4C543.2 241.8 606.6 201 679.7 201c104 0 188.3 82.6 188.3 184.5 0 201.2-356 429.3-356 429.3z"></path>
          </svg>
        </i>
      </transition>
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';

const isDarkMode = ref(false);

const setDarkModeClass = (isDark: boolean) => {
  document.documentElement.classList.toggle('dark-theme', isDark);
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem('darkMode', isDarkMode.value.toString());
};

watch(isDarkMode, (newValue) => {
  setDarkModeClass(newValue);
});

onMounted(() => {
  // 强制使用亮色模式
  isDarkMode.value = false;
  localStorage.setItem('darkMode', 'false');
  setDarkModeClass(false);
});
</script>

<style lang="less" scoped>
.theme-toggle {
  position: fixed;
  bottom: 70px;
  right: 20px;
  z-index: 100;
  
  @media (max-width: 768px) {
    bottom: 60px;
    right: 15px;
  }
  
  .toggle-button {
    width: 38px;
    height: 38px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1677FF, #69b1ff);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: white;
    box-shadow: 0 2px 10px rgba(22, 119, 255, 0.25);
    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
    border: none;
    outline: none;
    
    &:hover {
      transform: scale(1.1);
      box-shadow: 0 4px 12px rgba(22, 119, 255, 0.3);
    }
    
    i {
      font-size: 20px;
      transition: transform 0.5s ease;
      
      svg {
        width: 1em;
        height: 1em;
      }
    }
  }
  
  &.dark-mode .toggle-button {
    background: linear-gradient(135deg, #0f1631, #1a2f6e);
  }
}

@media (max-width: 480px) {
  .theme-toggle {
    bottom: 55px;
    right: 12px;
    
    .toggle-button {
      width: 34px;
      height: 34px;
      
      i {
        font-size: 18px;
      }
    }
  }
}

.rotate-enter-active,
.rotate-leave-active {
  transition: opacity 0.3s, transform 0.5s;
}
.rotate-enter-from,
.rotate-leave-to {
  opacity: 0;
  transform: rotate(180deg);
}

.ant-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: currentColor;
}
</style> 