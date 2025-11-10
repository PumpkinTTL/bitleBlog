<template>
  <Teleport to="body">
    <div 
      class="smart-message-container" 
      :class="{ 'is-leaving': !visible }"
      :style="{ top: offsetTop, position: visible ? 'fixed' : 'absolute' }"
    >
      <div
        :class="[
          'smart-message',
          `smart-message--${type}`,
          { 'is-visible': visible },
          customClass
        ]"
        :style="{ borderRadius: `${borderRadius}px` }"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
        @transitionend="onTransitionEnd"
      >
        <!-- 图标 -->
        <div v-if="showIcon" class="smart-message__icon">
          <component :is="iconComponent" />
        </div>

        <!-- 内容 -->
        <div class="smart-message__content">
          {{ content }}
        </div>

        <!-- 关闭按钮 -->
        <button
          v-if="closable"
          class="smart-message__close"
          @click="close"
          aria-label="关闭"
        >
        ×
      </button>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, h } from 'vue';
import type { MessageType } from './types';

// Props
interface Props {
  id: string;
  content: string;
  type?: MessageType;
  duration?: number;
  closable?: boolean;
  customClass?: string;
  showIcon?: boolean;
  offset?: number;
  borderRadius?: number;
}

const props = withDefaults(defineProps<Props>(), {
  type: 'info',
  duration: 3000,
  closable: true,
  showIcon: true,
  offset: 0,
  borderRadius: 100
});

// Emits
const emit = defineEmits<{
  close: [id: string];
  destroy: [id: string];
}>();

// 状态
const visible = ref(false);
const timer = ref<number | null>(null);

// 计算偏移量
const offsetTop = computed(() => `${props.offset}px`);

// 计算圆角
const borderRadius = computed(() => props.borderRadius);

// 图标组件映射
const iconComponent = computed(() => {
  const icons = {
    success: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      style: { width: '100%', height: '100%' }
    }, [
      h('path', {
        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z'
      })
    ]),
    error: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      style: { width: '100%', height: '100%' }
    }, [
      h('path', {
        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z'
      })
    ]),
    warning: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      style: { width: '100%', height: '100%' }
    }, [
      h('path', {
        d: 'M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z'
      })
    ]),
    info: () => h('svg', {
      xmlns: 'http://www.w3.org/2000/svg',
      viewBox: '0 0 24 24',
      fill: 'currentColor',
      style: { width: '100%', height: '100%' }
    }, [
      h('path', {
        d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z'
      })
    ])
  };
  
  return icons[props.type];
});

// 启动定时器
const startTimer = () => {
  if (props.duration > 0) {
    timer.value = window.setTimeout(() => {
      close();
    }, props.duration);
  }
};

// 清除定时器
const clearTimer = () => {
  if (timer.value) {
    clearTimeout(timer.value);
    timer.value = null;
  }
};

// 关闭消息
const close = () => {
  visible.value = false;
  emit('close', props.id);
};

// 过渡结束后触发销毁
const onTransitionEnd = () => {
  if (!visible.value) {
    emit('destroy', props.id);
  }
};

// 鼠标进入暂停定时器
const onMouseEnter = () => {
  clearTimer();
};

// 鼠标离开重启定时器
const onMouseLeave = () => {
  startTimer();
};

// 组件挂载后显示
onMounted(() => {
  // 使用 nextTick 和 setTimeout 确保 DOM 渲染后再触发动画
  nextTick(() => {
    setTimeout(() => {
      visible.value = true;
      startTimer();
    }, 10);
  });
});

// 暴露关闭方法
defineExpose({
  close
});
</script>

<style>
@import './modal.css';
</style>
