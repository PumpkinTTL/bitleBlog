import { createApp } from 'vue'

import './style.css'
import 'element-plus/theme-chalk/dark/css-vars.css'
import '@/assets/style/main.less'

import App from './App.vue'
import router from './router'

import { createPinia } from 'pinia'
import { useThemeStore } from '@/stores/theme'

// 创建 Pinia 实例
const pinia = createPinia()
const app = createApp(App);
// 注册组件
import 'animate.css'

import motionPlugin from './plugins/motion';
// elementui 暗色模式
import 'element-plus/theme-chalk/dark/css-vars.css'

// Import Font Awesome
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';


library.add(fas);

// Register Font Awesome component globally
app.component('font-awesome-icon', FontAwesomeIcon);

app.use(router).use(pinia).use(motionPlugin)

// Import the animations CSS file
import './components/index/style/animations.css'

app.mount('#app')

// 初始化主题store
const themeStore = useThemeStore()
themeStore.initTheme()
themeStore.watchSystemTheme()
