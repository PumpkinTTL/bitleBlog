<template>
  <div class="quick-actions-card">
    <div class="card-header">
      <i class="fas fa-bolt"></i>
      <span>快捷操作</span>
    </div>

    <div class="actions-grid">
      <div 
        v-for="action in actions" 
        :key="action.id"
        class="action-item"
        :class="action.id"
        @click="handleAction(action)"
      >
        <div class="action-icon">
          <i :class="action.icon"></i>
        </div>
        <span class="action-label">{{ action.label }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Action {
  id: string
  label: string
  icon: string
  route?: string
}

interface Props {
  actions?: Action[]
}

const props = withDefaults(defineProps<Props>(), {
  actions: () => [
    {
      id: 'write',
      label: '写文章',
      icon: 'fas fa-pen-nib',
      route: '/write'
    },
    {
      id: 'upload',
      label: '上传资源',
      icon: 'fas fa-cloud-upload-alt',
      route: '/resource/upload'
    },
    {
      id: 'message',
      label: '消息',
      icon: 'fas fa-bell',
      route: '/notifications'
    },
    {
      id: 'analytics',
      label: '数据',
      icon: 'fas fa-chart-bar',
      route: '/analytics'
    },
    {
      id: 'favorites',
      label: '收藏',
      icon: 'fas fa-bookmark',
      route: '/favorites'
    },
    {
      id: 'settings',
      label: '设置',
      icon: 'fas fa-cog',
      route: '/settings'
    }
  ]
})

const emit = defineEmits<{
  action: [action: Action]
}>()

const handleAction = (action: Action) => {
  emit('action', action)
}
</script>

<style lang="less" scoped>
.quick-actions-card {
  background: var(--el-bg-color);
  border-radius: 8px;
  border: 1px solid var(--el-border-color-lighter);
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
    color: var(--theme-purple-primary);
    font-size: 13px;
  }

  span {
    font-size: 12px;
    font-weight: 600;
    color: var(--el-text-color-primary);
    font-family: 'OPPO Sans', sans-serif;
  }
}

.actions-grid {
  padding: 14px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 12px 8px;
  background: var(--el-fill-color-extra-light);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid var(--el-border-color-extra-light);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);

    .action-icon {
      transform: scale(1.1);
    }
  }

  &:active {
    transform: translateY(0);
  }

  // 各个按钮的颜色
  &.write .action-icon {
    background: linear-gradient(135deg, #fef3c7, #fde68a);
    color: #d97706;
  }

  &.upload .action-icon {
    background: linear-gradient(135deg, #dbeafe, #bfdbfe);
    color: #2563eb;
  }

  &.message .action-icon {
    background: linear-gradient(135deg, #fed7d7, #fbb6b6);
    color: #dc2626;
  }

  &.analytics .action-icon {
    background: linear-gradient(135deg, #d1fae5, #a7f3d0);
    color: #10b981;
  }

  &.favorites .action-icon {
    background: linear-gradient(135deg, #fce7f3, #fbcfe8);
    color: #ec4899;
  }

  &.settings .action-icon {
    background: linear-gradient(135deg, #e0e7ff, #c7d2fe);
    color: #6366f1;
  }
}

.action-icon {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  i {
    font-size: 16px;
  }
}

.action-label {
  font-size: 11px;
  color: var(--el-text-color-regular);
  font-weight: 500;
  text-align: center;
}

// 响应式
@media (max-width: 768px) {
  .actions-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
    padding: 12px;
  }

  .action-item {
    padding: 10px 6px;
  }

  .action-icon {
    width: 32px;
    height: 32px;

    i {
      font-size: 14px;
    }
  }

  .action-label {
    font-size: 10px;
  }
}
</style>
