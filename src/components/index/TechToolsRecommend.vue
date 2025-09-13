<template>
  <div class="tech-tools-section animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.1s;">
    <!-- 美化的标题区域 -->
    <div class="section-header animate__animated animate__fadeInDown animate__faster" style="animation-delay: 0.2s;">
      <h3 class="section-title">
        <span class="title-icon">
          <i :class="sectionIcon"></i>
        </span>
        <span class="title-text">{{ sectionTitle }}</span>
        <span class="title-decoration"></span>
      </h3>
      <p class="section-subtitle">{{ sectionSubtitle }}</p>
    </div>

    <!-- 美化的工具列表 -->
    <div class="tools-list">
      <div
        class="tool-item animate__animated animate__fadeInRight animate__faster"
        v-for="(tool, index) in displayTools.slice(0, maxItemsPerCategory)"
        :key="tool.id"
        :style="`animation-delay: ${0.3 + index * 0.08}s`"
        @click="handleToolClick(tool)"
      >
        <!-- 工具图标 - 支持插槽 -->
        <div class="tool-icon" :style="{ background: tool.color }">
          <slot name="icon" :tool="tool">
            <i :class="tool.icon"></i>
          </slot>
        </div>

        <!-- 工具信息 -->
        <div class="tool-content">
          <h4 class="tool-name">{{ tool.name }}</h4>
          <p class="tool-description">{{ tool.description }}</p>
          <div class="tool-meta">
            <span class="tool-tag" :class="tool.type">{{ getTypeLabel(tool.type) }}</span>
          </div>
        </div>

        <!-- 外部链接指示器 -->
        <div class="external-link">
          <i class="fas fa-external-link-alt"></i>
        </div>
      </div>
    </div>

    <!-- 更多工具按钮 -->
    <div class="more-tools animate__animated animate__fadeInUp animate__faster" style="animation-delay: 0.6s;" v-if="showMoreButton">
      <el-button type="primary" size="small" @click="handleMoreTools" class="more-btn">
        <i class="fas fa-plus"></i>
        {{ moreButtonText }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts" name="TechToolsRecommend">
import { ref, computed } from 'vue';
import { ElButton } from 'element-plus';

// 定义工具接口
interface Tool {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  type: 'free' | 'paid' | 'open-source';
  rating: number;
  url: string;
  category: string;
}

// 删除分类接口

// 定义Props接口 - 简化版
interface Props {
  // 基础配置
  sectionTitle?: string;
  sectionSubtitle?: string;
  sectionIcon?: string;

  // 显示控制
  showMoreButton?: boolean;

  // 自定义文本
  moreButtonText?: string;

  // 数据配置
  maxItemsPerCategory?: number;

  // 自定义数据
  customTools?: Tool[];
}

// 定义Props默认值
const props = withDefaults(defineProps<Props>(), {
  sectionTitle: '开发工具',
  sectionSubtitle: '精选开发者必备工具',
  sectionIcon: 'fas fa-tools',
  showMoreButton: true,
  moreButtonText: '查看更多工具',
  maxItemsPerCategory: 6
});

// 定义事件
const emit = defineEmits<{
  toolClick: [tool: Tool];
  moreClick: [];
}>();

// 删除分类相关代码

// 默认工具数据
const defaultTools: Tool[] = [
  // 前端工具
  {
    id: 1,
    name: 'VS Code',
    description: '强大的代码编辑器，支持丰富插件生态',
    icon: 'fas fa-code',
    color: 'linear-gradient(135deg, #007ACC, #005A9E)',
    type: 'free',
    rating: 4.9,
    url: 'https://code.visualstudio.com',
    category: 'frontend'
  },
  {
    id: 2,
    name: 'Vue DevTools',
    description: 'Vue.js 官方调试工具，开发必备',
    icon: 'fab fa-vuejs',
    color: 'linear-gradient(135deg, #4FC08D, #42B883)',
    type: 'free',
    rating: 4.8,
    url: 'https://devtools.vuejs.org',
    category: 'frontend'
  },
  {
    id: 3,
    name: 'Vite',
    description: '极速前端构建工具，开发体验极佳',
    icon: 'fas fa-bolt',
    color: 'linear-gradient(135deg, #646CFF, #747BFF)',
    type: 'open-source',
    rating: 4.7,
    url: 'https://vitejs.dev',
    category: 'frontend'
  },
  {
    id: 8,
    name: 'Chrome DevTools',
    description: '浏览器开发者工具，前端调试神器',
    icon: 'fab fa-chrome',
    color: 'linear-gradient(135deg, #4285F4, #34A853)',
    type: 'free',
    rating: 4.9,
    url: 'https://developer.chrome.com/docs/devtools',
    category: 'frontend'
  },
  // 后端工具
  {
    id: 4,
    name: 'Postman',
    description: 'API 开发测试平台，接口调试首选',
    icon: 'fas fa-paper-plane',
    color: 'linear-gradient(135deg, #FF6C37, #FF8C42)',
    type: 'free',
    rating: 4.6,
    url: 'https://postman.com',
    category: 'backend'
  },
  {
    id: 5,
    name: 'Docker',
    description: '容器化部署平台，简化应用部署',
    icon: 'fab fa-docker',
    color: 'linear-gradient(135deg, #2496ED, #0DB7ED)',
    type: 'open-source',
    rating: 4.8,
    url: 'https://docker.com',
    category: 'backend'
  },
  {
    id: 9,
    name: 'Redis',
    description: '高性能内存数据库，缓存首选',
    icon: 'fas fa-database',
    color: 'linear-gradient(135deg, #DC382D, #B32821)',
    type: 'open-source',
    rating: 4.7,
    url: 'https://redis.io',
    category: 'backend'
  },
  {
    id: 10,
    name: 'MongoDB',
    description: '文档型数据库，灵活易用',
    icon: 'fas fa-leaf',
    color: 'linear-gradient(135deg, #47A248, #3F8F40)',
    type: 'open-source',
    rating: 4.5,
    url: 'https://mongodb.com',
    category: 'backend'
  },
  // 设计工具
  {
    id: 6,
    name: 'Figma',
    description: '协作式设计工具，团队设计首选',
    icon: 'fab fa-figma',
    color: 'linear-gradient(135deg, #F24E1E, #FF7262)',
    type: 'free',
    rating: 4.9,
    url: 'https://figma.com',
    category: 'design'
  },
  {
    id: 11,
    name: 'Adobe XD',
    description: 'Adobe 出品的UI/UX设计工具',
    icon: 'fab fa-adobe',
    color: 'linear-gradient(135deg, #FF61F6, #FF26F0)',
    type: 'paid',
    rating: 4.4,
    url: 'https://adobe.com/products/xd',
    category: 'design'
  },
  {
    id: 12,
    name: 'Sketch',
    description: 'Mac 平台经典设计工具',
    icon: 'fas fa-pencil-ruler',
    color: 'linear-gradient(135deg, #FDB300, #FFCC02)',
    type: 'paid',
    rating: 4.3,
    url: 'https://sketch.com',
    category: 'design'
  },
  {
    id: 13,
    name: 'Canva',
    description: '在线设计平台，模板丰富',
    icon: 'fas fa-paint-brush',
    color: 'linear-gradient(135deg, #00C4CC, #7B68EE)',
    type: 'free',
    rating: 4.6,
    url: 'https://canva.com',
    category: 'design'
  },
  // 运维工具
  {
    id: 7,
    name: 'Nginx',
    description: '高性能 Web 服务器，负载均衡利器',
    icon: 'fas fa-server',
    color: 'linear-gradient(135deg, #009639, #00A651)',
    type: 'open-source',
    rating: 4.7,
    url: 'https://nginx.org',
    category: 'devops'
  },
  {
    id: 14,
    name: 'Jenkins',
    description: '持续集成/持续部署平台',
    icon: 'fas fa-cogs',
    color: 'linear-gradient(135deg, #D33833, #335061)',
    type: 'open-source',
    rating: 4.2,
    url: 'https://jenkins.io',
    category: 'devops'
  },
  {
    id: 15,
    name: 'Kubernetes',
    description: '容器编排平台，云原生首选',
    icon: 'fas fa-dharmachakra',
    color: 'linear-gradient(135deg, #326CE5, #1A73E8)',
    type: 'open-source',
    rating: 4.6,
    url: 'https://kubernetes.io',
    category: 'devops'
  },
  {
    id: 16,
    name: 'Prometheus',
    description: '监控告警系统，运维必备',
    icon: 'fas fa-chart-line',
    color: 'linear-gradient(135deg, #E6522C, #FF6B35)',
    type: 'open-source',
    rating: 4.5,
    url: 'https://prometheus.io',
    category: 'devops'
  }
];

// 显示的工具数据（支持自定义）
const displayTools = computed(() => {
  return props.customTools || defaultTools;
});

// 获取类型标签
const getTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'free': '免费',
    'paid': '付费',
    'open-source': '开源'
  };
  return labels[type] || '未知';
};

// 处理工具点击
const handleToolClick = (tool: Tool): void => {
  emit('toolClick', tool);
  // 默认行为：打开链接
  if (tool.url) {
    window.open(tool.url, '_blank');
  }
};

// 处理更多工具
const handleMoreTools = (): void => {
  emit('moreClick');
};
</script>

<style lang="less" scoped>
.tech-tools-section {
  background: var(--el-bg-color);
  border-radius: 12px; // 增加圆角
  padding: 20px;
  margin-bottom: 20px;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  border: 1px solid var(--el-border-color-extra-light);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.06); // 添加立体阴影
  position: relative;
  overflow: hidden;

  // 添加微妙的光泽效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.6), transparent);
    opacity: 0.8;
  }

  &:hover {
    border-color: var(--el-color-primary-light-8);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08), 0 2px 6px rgba(0, 0, 0, 0.1);
    transform: translateY(-2px); // 悬浮效果
  }
}

// 超紧凑的标题区域
.section-header {
  margin-bottom: 12px;

  .section-title {
    font-size: 14px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin: 0 0 3px;
    display: flex;
    align-items: center;
    gap: 6px;
    position: relative;

    .title-icon {
      width: 18px;
      height: 18px;
      background: var(--el-color-primary-light-9);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: var(--el-color-primary);
      font-size: 9px;
      flex-shrink: 0;
      transition: all 0.3s ease;

      &:hover {
        background: var(--el-color-primary-light-8);
        transform: scale(1.05);
      }
    }

    .title-text {
      font-weight: 600;
    }

    .title-decoration {
      flex: 1;
      height: 1px;
      background: linear-gradient(90deg, var(--el-border-color-lighter) 0%, transparent 100%);
      margin-left: 6px;
    }
  }

  .section-subtitle {
    font-size: 10px;
    color: var(--el-text-color-secondary);
    margin: 0;
    margin-left: 24px;
    font-weight: 400;
  }
}

// 删除分类标签样式

// 超紧凑的工具列表
.tools-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 12px;
}

.tool-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px;
  background: var(--el-fill-color-lighter);
  border-radius: 10px; // 增加圆角
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  border: 1px solid var(--el-border-color-extra-light);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03); // 添加轻微阴影

  &:hover {
    background: var(--el-fill-color-light);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    border-color: var(--el-color-primary-light-8);

    .tool-name {
      color: var(--el-color-primary);
    }

    .tool-icon {
      transform: scale(1.08);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    }

    .external-link {
      opacity: 1;
      transform: translateX(0);
    }
  }

  &:active {
    transform: translateY(-1px);
  }
}

// 现代化工具图标 - 支持插槽
.tool-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px; // 增加圆角
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.12); // 增强阴影
  overflow: hidden;

  // 图标样式
  i {
    position: relative;
    z-index: 2;
  }

  // 图片样式
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 6px;
  }

  // 自定义内容样式
  > * {
    max-width: 100%;
    max-height: 100%;
  }
}

// 超紧凑的工具内容
.tool-content {
  flex: 1;
  min-width: 0;

  .tool-name {
    font-size: 12px;
    font-weight: 500;
    color: var(--el-text-color-primary);
    margin: 0 0 3px;
    transition: color 0.3s ease;
    line-height: 1.2;
  }

  .tool-description {
    font-size: 10px;
    color: var(--el-text-color-secondary);
    margin: 0 0 4px;
    line-height: 1.3;
    opacity: 0.9;
  }

  .tool-meta {
    display: flex;
    align-items: center;
    gap: 6px;

    .tool-tag {
      font-size: 8px;
      padding: 1px 5px;
      border-radius: 8px;
      font-weight: 500;

      &.free {
        background: var(--el-color-success-light-9);
        color: var(--el-color-success);
      }

      &.paid {
        background: var(--el-color-warning-light-9);
        color: var(--el-color-warning);
      }

      &.open-source {
        background: var(--el-color-info-light-9);
        color: var(--el-color-info);
      }
    }
  }
}

// 超紧凑的外部链接指示器
.external-link {
  color: var(--el-text-color-placeholder);
  font-size: 9px;
  opacity: 0;
  transform: translateX(-3px);
  transition: all 0.3s ease;
  flex-shrink: 0;
}

// 超紧凑的更多工具按钮
.more-tools {
  text-align: center;

  .more-btn {
    font-size: 11px;
    height: 28px;
    padding: 0 12px;
    border-radius: 14px;
    transition: all 0.3s ease;

    i {
      font-size: 9px;
      margin-right: 3px;
    }

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 3px 8px var(--el-color-primary-light-8);
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .tech-tools-section {
    padding: 12px;
    border-radius: 4px;
  }

  .section-header {
    margin-bottom: 10px;

    .section-title {
      font-size: 13px;
      gap: 5px;

      .title-icon {
        width: 16px;
        height: 16px;
        font-size: 8px;
      }
    }

    .section-subtitle {
      font-size: 9px;
      margin-left: 21px;
    }
  }

  .tools-list {
    gap: 5px;
    margin-bottom: 10px;
  }

  .tool-item {
    padding: 8px;
    gap: 8px;
    border-radius: 4px;
  }

  .tool-icon {
    width: 24px;
    height: 24px;
    font-size: 10px;
    border-radius: 4px;
  }

  .tool-content {
    .tool-name {
      font-size: 11px;
      margin-bottom: 2px;
    }

    .tool-description {
      font-size: 9px;
      margin-bottom: 3px;
    }

    .tool-meta {
      gap: 4px;

      .tool-tag {
        font-size: 7px;
        padding: 1px 4px;
        border-radius: 6px;
      }
    }
  }

  .external-link {
    font-size: 8px;
  }

  .more-tools {
    .more-btn {
      height: 26px;
      font-size: 10px;
      padding: 0 10px;
      border-radius: 13px;

      i {
        font-size: 8px;
        margin-right: 2px;
      }
    }
  }
}
</style>
