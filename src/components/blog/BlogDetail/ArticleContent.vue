<template>
  <div class="article-content-wrapper">
    <!-- 文章内容区 -->
    <div class="article-content animate__animated animate__fadeIn">
      <!-- 文章正文 - 使用md-editor预览组件 -->
      <div class="content-body">
        <MdPreview
          :modelValue="processedContent"
          :theme="isDark ? 'dark' : 'light'"
          previewTheme="default"
          :codeTheme="isDark ? 'github-dark' : 'github'"
          class="custom-md-preview"
          :showCodeRowNumber="true"
          :previewOnly="true"
          :autoFoldCode="false"
        />
      </div>
      
      <!-- 文章底部标签和分类信息 -->
      <div class="content-footer">
        <!-- 标签列表 -->
        <div class="article-tags" v-if="article.tags && article.tags.length > 0">
          <div class="tags-title">
            <i class="fas fa-tags"></i>
            <span>文章标签</span>
          </div>
          <div class="tags-list">
            <a 
              v-for="(tag, index) in article.tags" 
              :key="index" 
              :class="['tag-item', getTagClass(index)]"
              :style="getTagStyle(index)"
              href="#"
              @click.prevent="handleTagClick(tag.id, tag.name)"
            >
              <i class="fas fa-tag"></i>
              {{ tag.name }}
            </a>
          </div>
        </div>
        
        <!-- 版权声明 -->
        <div class="copyright-notice animate__animated animate__fadeInUp" style="animation-delay: 0.3s;">
          <div class="notice-icon animate__animated animate__zoomIn" style="animation-delay: 0.4s;">
            <i class="fas fa-copyright"></i>
          </div>
          <div class="notice-content">
            <div class="notice-title animate__animated animate__fadeInLeft" style="animation-delay: 0.5s;">版权声明</div>
            <div class="notice-text animate__animated animate__fadeInLeft" style="animation-delay: 0.6s;">
              本文由 {{ article.author?.username || article.author?.nickname || '匿名作者' }}
              {{ article.is_original === 1 ? '原创发布' : '编辑整理' }}，如需转载请注明来源。
              发布时间: {{ formatDate(article.publish_time) }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import { message } from 'ant-design-vue';
import { MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/preview.css';
import { useThemeStore } from '@/stores/theme';

// 定义文章和标签的类型
interface Tag {
  id: number;
  name: string;
}

interface Author {
  id?: number;
  username?: string;
  nickname?: string;
}

interface Article {
  id?: number;
  title?: string;
  content?: string;
  publish_time?: string;
  is_original?: number;
  author?: Author;
  tags?: Tag[];
}

// 定义属性和事件
const props = defineProps<{
  article: Article;
}>();

const emit = defineEmits(['tag-click']);

// 使用主题store
const themeStore = useThemeStore();

// 主题检测 - 使用Pinia store
const isDark = computed(() => themeStore.isDark);

// 处理文章内容，增加样式和格式化
const processedContent = computed(() => {
  if (!props.article.content) return '';

  // 这里可以添加内容处理逻辑，例如高亮代码块、处理图片链接等
  return props.article.content;
});

// 格式化日期
const formatDate = (dateString?: string): string => {
  if (!dateString) return '';
  
  // 尝试转换为Date对象
  const date = new Date(dateString);
  
  // 检查日期是否有效
  if (isNaN(date.getTime())) {
    return dateString.split(' ')[0]; // 如果转换失败，返回原始日期的日期部分
  }
  
  // 格式化为 "YYYY-MM-DD"
  return date.toISOString().split('T')[0];
};

// 获取标签样式类
const getTagClass = (index: number): string => {
  const classes = ['tag-primary', 'tag-success', 'tag-warning', 'tag-danger', 'tag-info'];
  return classes[index % classes.length];
};

// 获取标签样式
const getTagStyle = (index: number) => {
  const colors = [
    'linear-gradient(45deg, #1677ff, #69b4ff)',
    'linear-gradient(45deg, #52c41a, #95de64)',
    'linear-gradient(45deg, #722ed1, #b37feb)',
    'linear-gradient(45deg, #13c2c2, #87e8de)',
    'linear-gradient(45deg, #fa8c16, #ffd591)'
  ];
  
  return {
    background: colors[index % colors.length]
  };
};

// 标签点击事件
const handleTagClick = (tagId: number, tagName: string) => {
  emit('tag-click', { id: tagId, name: tagName });
  message.info(`查看标签: ${tagName}`);
};
</script>

<style lang="less" scoped>
// 修复md-editor-v3暗色模式背景不协调问题
:deep(.custom-md-preview) {
  // 暗色模式下覆盖md-editor-v3的背景色
  html.dark & {
    background-color: var(--el-bg-color) !important;

    // 修复代码块背景
    .md-editor-preview-wrapper {
      background-color: var(--el-bg-color) !important;
    }

    // 修复预览区域背景
    .md-editor-preview {
      background-color: var(--el-bg-color) !important;
      color: var(--el-text-color-primary) !important;
    }

    // 修复代码块背景色协调
    pre {
      background-color: var(--el-fill-color-darker) !important;
    }

    // 修复行内代码背景
    code:not(pre code) {
      background-color: var(--el-fill-color-light) !important;
      color: var(--el-text-color-primary) !important;
    }

    // 修复表格背景
    table {
      background-color: var(--el-bg-color) !important;

      th, td {
        background-color: var(--el-bg-color) !important;
        border-color: var(--el-border-color) !important;
      }

      thead th {
        background-color: var(--el-fill-color-lighter) !important;
      }
    }

    // 修复引用块背景
    blockquote {
      background-color: var(--el-fill-color-lighter) !important;
      border-left-color: var(--el-color-primary) !important;
    }
  }
}

.article-content-wrapper {
  position: relative;
  display: flex;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
  
  .article-content {
    flex: 1;
    min-width: 0;
    padding: 0 0 30px;
    
    .content-body {
      margin-bottom: 40px;
      // md-editor预览组件的样式覆盖
      :deep(.md-editor-preview) {
        padding: 0;
        background: transparent;

        .md-editor-preview-wrapper {
          padding: 0;

          .md-editor-preview-content {
            font-size: 16px;
            line-height: 1.8;
            color: var(--el-text-color-primary);

            h1, h2, h3, h4, h5, h6 {
              color: var(--el-text-color-primary);
              margin-top: 30px;
              margin-bottom: 16px;
            }

            h2 {
              font-size: 24px;
              font-weight: 600;
              padding-bottom: 10px;
              border-bottom: 1px solid var(--el-border-color-light);
            }

            h3 {
              font-size: 20px;
              font-weight: 600;
            }

            p {
              margin: 16px 0;
              color: var(--el-text-color-regular);
            }

            a {
              color: var(--el-color-primary);
              text-decoration: none;
              border-bottom: 1px dashed var(--el-color-primary);
              transition: all 0.3s ease;

              &:hover {
                border-bottom: 1px solid var(--el-color-primary);
              }
            }

            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 20px 0;
              box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
            }

            blockquote {
              border-left: 4px solid var(--el-color-primary);
              padding: 12px 20px;
              margin: 20px 0;
              background: var(--el-fill-color-lighter);
              border-radius: 0 8px 8px 0;
              color: var(--el-text-color-regular);

              p {
                margin: 0;
              }
            }

            code {
              background: var(--el-fill-color-light);
              color: var(--el-text-color-primary);
              padding: 2px 6px;
              border-radius: 3px;
              font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
              font-size: 85%;
            }

            pre {
              background: var(--el-fill-color-lighter);
              border-radius: 8px;
              padding: 16px;
              overflow: auto;
              margin: 20px 0;
              border: 1px solid var(--el-border-color-light);

              code {
                background: transparent;
                padding: 0;
                border-radius: 0;
                font-size: 14px;
                color: var(--el-text-color-regular);
              }
            }

            ul, ol {
              padding-left: 20px;
              margin: 16px 0;

              li {
                margin: 8px 0;
                color: var(--el-text-color-regular);
              }
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
              border: 1px solid var(--el-border-color-light);

              th, td {
                border: 1px solid var(--el-border-color-light);
                padding: 8px 12px;
                text-align: left;
              }

              th {
                background: var(--el-fill-color-lighter);
                font-weight: 600;
                color: var(--el-text-color-primary);
              }

              td {
                color: var(--el-text-color-regular);
              }

              tr:nth-child(even) {
                background: var(--el-fill-color-extra-light);
              }
            }
          }
        }
      }
    }
    
    .content-footer {
      margin-top: 30px;
      
      .article-tags {
        margin-bottom: 20px;
        
        .tags-title {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
          font-size: 16px;
          font-weight: 600;
          color: #1e293b;
          
          i {
            color: #1677FF;
          }
        }
        
        .tags-list {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          
          .tag-item {
            display: inline-flex;
            align-items: center;
            padding: 6px 12px;
            border-radius: 20px;
            color: white;
            font-size: 13px;
            gap: 6px;
            text-decoration: none;
            transition: all 0.3s ease;
            
            i {
              font-size: 12px;
            }
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 3px 8px rgba(0, 0, 0, 0.1);
            }
          }
        }
      }
      
      .copyright-notice {
        display: flex;
        gap: 16px;
        background: var(--el-fill-color-lighter);
        border-radius: 8px;
        padding: 16px;
        border: 1px solid var(--el-border-color-lighter);

        .notice-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: var(--el-color-primary-light-9);
          border-radius: 50%;
          color: var(--el-color-primary);
          font-size: 18px;
          flex-shrink: 0;
        }

        .notice-content {
          flex: 1;

          .notice-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 6px;
          }

          .notice-text {
            font-size: 14px;
            color: var(--el-text-color-regular);
            line-height: 1.6;
          }
        }
      }
    }
  }
}
</style> 