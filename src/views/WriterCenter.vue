<template>
  <div class="writer-center-container">
    <!-- 顶部导航 -->
    <div class="writer-header">
      <div class="header-container">
        <div class="left-section">
          <div class="back-button" @click="goBack">
            <i class="fas fa-arrow-left"></i>
          </div>
          <div class="page-title">{{ isEditMode ? '编辑文章' : '创建文章' }}</div>
        </div>
        <div class="right-section">
          <div class="article-status" :class="statusClass">
            <i class="fas" :class="statusIcon"></i>
            <span>{{ statusText }}</span>
          </div>
          <div class="action-buttons">
            <a-tooltip title="保存草稿">
              <a-button class="action-button" shape="circle" @click="saveDraft">
                <i class="fas fa-save"></i>
              </a-button>
            </a-tooltip>
            <a-tooltip :title="isPreview ? '编辑模式' : '预览模式'">
              <a-button class="action-button" shape="circle" @click="togglePreview">
                <i class="fas" :class="isPreview ? 'fa-edit' : 'fa-eye'"></i>
              </a-button>
            </a-tooltip>
            <a-button type="primary" class="publish-button" @click="showPublishModal">
              <i class="fas fa-paper-plane"></i>
              <span>发布</span>
            </a-button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 主体内容区 - 重构布局 -->
    <div class="writer-content">
      <!-- 编辑区 - 占满全屏 -->
      <div class="editor-container" :class="{'full-width': !showSettings}">
        <!-- 移除主编辑区的标题和副标题输入框，只在侧边栏保留 -->
        
        <!-- Markdown编辑器 - 占满所有空间 -->
        <div class="editor-wrapper animate__animated animate__fadeIn">
          <MdEditor 
            v-model="articleData.content"
            :toolbars="editorToolbars"
            @onUploadImg="onUploadImg"
            :theme="mdTheme"
            previewTheme="github"
            codeTheme="atom"
            v-model:preview="isPreview"
            :autoDetectCode="true"
            :showCodeRowNumber="true"
            @onChange="handleContentChange"
            class="custom-md-editor"
            :noMermaid="false"
            :noKatex="false"
            :scrollAuto="true"
            :syncScrollMode="['rightFollowLeft', 'leftFollowRight']"
            :codeStyleReverse="false"
            :tabWidth="2"
          />
        </div>
      </div>
      
      <!-- 侧边栏控制按钮 - 新设计 -->
      <div class="sidebar-toggle" :class="{'active': showSettings}" @click="toggleSettings">
        <i class="fas" :class="showSettings ? 'fa-chevron-right' : 'fa-chevron-left'"></i>
      </div>
      
      <!-- 侧边设置面板 - 不占用主体空间 -->
      <div class="settings-panel" :class="{'visible': showSettings}">
        <div class="panel-container">
          <!-- 设置面板头部 -->
          <div class="panel-header">
            <span>文章设置</span>
            <div class="toggle-button" @click="toggleSettings">
              <i class="fas fa-times"></i>
            </div>
          </div>
          
          <!-- 设置面板内容 -->
          <div class="panel-content">
            <!-- 文章标题和副标题 - 新增区块 -->
            <div class="setting-section animate__animated animate__fadeIn">
              <div class="section-header">
                <i class="fas fa-heading"></i>
                <span>文章标题</span>
              </div>
              
              <div class="setting-item">
                <div class="setting-label">标题</div>
                <a-input 
                  v-model:value="articleData.title" 
                  placeholder="请输入文章标题..." 
                  :maxLength="100"
                  showCount
                />
              </div>
              
              <div class="setting-item">
                <div class="setting-label">副标题</div>
                <a-input 
                  v-model:value="articleData.subtitle" 
                  placeholder="请输入副标题（选填）..." 
                  :maxLength="200"
                  showCount
                />
              </div>
            </div>
            
            <!-- 文章分类与标签 -->
            <div class="setting-section animate__animated animate__fadeIn">
              <div class="section-header">
                <i class="fas fa-layer-group"></i>
                <span>分类与标签</span>
              </div>
              
              <div class="setting-item">
                <div class="setting-label">文章分类</div>
                <a-select 
                  v-model:value="articleData.category_id" 
                  placeholder="选择分类"
                  style="width: 100%"
                  :loading="isLoading"
                >
                  <a-select-option v-for="category in categoryList" :key="category.id" :value="category.id">
                    <span class="category-option">
                      <i v-if="category.icon" :class="'fas ' + category.icon"></i>
                      {{ category.name }}
                    </span>
                  </a-select-option>
                </a-select>
              </div>
              
              <div class="setting-item">
                <div class="setting-label">文章标签</div>
                <a-select 
                  v-model:value="articleTags" 
                  mode="tags"
                  placeholder="输入标签，回车确认"
                  style="width: 100%"
                  :maxTagCount="5"
                  :maxTagTextLength="20"
                  :loading="isLoading"
                  :options="tagsList.map(tag => ({ value: tag.name, label: tag.name }))"
                  allowClear
                  @change="handleTagsChange"
                ></a-select>
                <div class="tip-text">最多可添加5个标签，每个标签最长20个字符</div>
              </div>
            </div>
            
            <!-- 文章属性 -->
            <div class="setting-section animate__animated animate__fadeIn" style="animation-delay: 0.1s">
              <div class="section-header">
                <i class="fas fa-cog"></i>
                <span>文章属性</span>
              </div>
              
              <div class="setting-item">
                <div class="setting-label">文章属性</div>
                <div class="setting-options">
                  <label class="checkbox-label">
                    <a-checkbox v-model:checked="articleData.is_original"></a-checkbox>
                    <span>原创内容</span>
                  </label>
                </div>
              </div>
              
              <div class="setting-item" v-if="!articleData.is_original">
                <div class="setting-label">原文链接</div>
                <a-input 
                  v-model:value="articleData.source_url" 
                  placeholder="请输入原文链接"
                  :maxLength="255"
                />
              </div>
              
              <div class="setting-item">
                <div class="setting-label">文章别名（URL友好）</div>
                <a-input 
                  v-model:value="articleData.slug" 
                  placeholder="文章URL别名，仅限英文、数字和连字符"
                  :maxLength="100"
                />
              </div>
            </div>
            
            <!-- SEO设置 -->
            <div class="setting-section animate__animated animate__fadeIn" style="animation-delay: 0.2s">
              <div class="section-header">
                <i class="fas fa-search"></i>
                <span>SEO设置</span>
              </div>
              
              <div class="setting-item">
                <div class="setting-label">SEO关键词</div>
                <a-input 
                  v-model:value="articleData.keywords" 
                  placeholder="SEO关键词，用逗号分隔"
                  :maxLength="100"
                />
              </div>
              
              <div class="setting-item">
                <div class="setting-label">文章摘要</div>
                <a-textarea 
                  v-model:value="articleData.description" 
                  placeholder="文章摘要，不填写则自动提取正文前150字"
                  :auto-size="{ minRows: 3, maxRows: 5 }"
                  :maxLength="255"
                  showCount
                />
              </div>
            </div>
            
            <!-- 封面图设置 -->
            <div class="setting-section animate__animated animate__fadeIn" style="animation-delay: 0.3s">
              <div class="section-header">
                <i class="fas fa-image"></i>
                <span>封面图设置</span>
              </div>
              
              <div class="setting-item">
                <div class="cover-upload-container">
                  <div 
                    v-if="!coverPreviewUrl" 
                    class="cover-upload-placeholder"
                    @click="selectCoverImage"
                  >
                    <i class="fas fa-image"></i>
                    <div class="upload-text">选择封面图</div>
                    <div class="upload-hint">点击选择图片文件</div>
                  </div>
                  
                  <div v-else class="cover-preview">
                    <img :src="coverPreviewUrl" alt="封面预览" class="cover-preview-image" />
                    <div class="cover-actions">
                      <a-button size="small" @click="selectCoverImage">
                        <i class="fas fa-edit"></i> 更换
                      </a-button>
                      <a-button size="small" danger @click="removeCoverImage">
                        <i class="fas fa-trash"></i> 删除
                      </a-button>
                    </div>
                  </div>
                </div>
                
                <input 
                  ref="coverInputRef" 
                  type="file" 
                  accept="image/*" 
                  @change="handleCoverSelect" 
                  style="display: none;"
                />
                
                <div class="tip-text">建议尺寸：1200 x 675 像素，最大2MB</div>
              </div>
            </div>
            
            <!-- 统计信息与AI辅助 -->
            <div class="setting-section animate__animated animate__fadeIn" style="animation-delay: 0.4s">
              <div class="section-header">
                <i class="fas fa-chart-bar"></i>
                <span>统计信息</span>
              </div>
              
              <div class="stats-panel">
                <div class="stat-item">
                  <div class="stat-value">{{ articleData.word_count || 0 }}</div>
                  <div class="stat-label">总字数</div>
                </div>
                <div class="stat-divider"></div>
                <div class="stat-item">
                  <div class="stat-value">{{ articleData.read_time || '< 1' }}</div>
                  <div class="stat-label">分钟阅读</div>
                </div>
              </div>
              
              <!-- AI助手按钮 - 紫色主题优化样式 -->
              <div class="setting-item">
                <a-button class="ai-button" block @click="generateAiSummary">
                  <div class="ai-button-content">
                    <i class="fas fa-robot"></i>
                    <span>AI 智能助手</span>
                  </div>
                </a-button>
              </div>
              
              <!-- 一键填充测试数据按钮 - 新增 -->
              <div class="setting-item">
                <a-button class="test-data-button" block @click="fillTestData">
                  <i class="fas fa-magic"></i>
                  <span>一键填充测试数据</span>
                </a-button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
      
      <!-- 移动端底部工具栏 -->
      <div class="mobile-toolbar" v-if="isMobile">
        <div class="toolbar-button" @click="toggleSettings">
          <i class="fas fa-cog"></i>
        </div>
        <div class="toolbar-button" @click="togglePreview">
          <i class="fas" :class="isPreview ? 'fa-edit' : 'fa-eye'"></i>
        </div>
        <div class="toolbar-button" @click="saveDraft">
          <i class="fas fa-save"></i>
        </div>
        <div class="toolbar-button fill-data" @click="fillTestData">
          <i class="fas fa-magic"></i>
        </div>
        <div class="toolbar-button purple" @click="generateAiSummary">
          <i class="fas fa-robot"></i>
        </div>
        <div class="toolbar-button primary" @click="showPublishModal">
          <i class="fas fa-paper-plane"></i>
        </div>
      </div>
    </div>

    <!-- 背景效果 -->
    <div class="background-effects">
      <div class="glow glow-1"></div>
      <div class="glow glow-2"></div>
      <div class="glow glow-3"></div>
    </div>
    
    <!-- 发布确认弹窗 -->
    <a-modal
      v-model:visible="publishModalVisible"
      title="发布文章"
      okText="确认发布"
      cancelText="取消"
      @ok="publishArticle"
      :width="420"
      centered
    >
      <div class="publish-confirm-content">
        <div class="confirm-icon">
          <i class="fas fa-paper-plane"></i>
        </div>
        <h3 class="confirm-title">确认发布文章</h3>
        <p class="confirm-message">文章发布后将对所有用户可见，确认要发布这篇文章吗？</p>
      </div>
    </a-modal>
    
    <!-- 图片预览弹窗 -->
    <a-modal
      v-model:visible="previewVisible"
      title="图片预览"
      :footer="null"
    >
      <img :src="previewImage" alt="预览图片" style="width: 100%;" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>

import { ref, reactive, computed, onMounted, onBeforeUnmount, watch,defineOptions } from 'vue';
defineOptions({
  name: 'WriterCenter',
});
import { useRouter, useRoute } from 'vue-router';
import { message, Modal } from 'ant-design-vue';
import { MdEditor, type ToolbarNames, type Themes } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import 'animate.css';
import { getCategoryListR } from '@/request/category';
import { generateSerialNumbers } from '@/util/NumUtil';
import { useStore } from '@/store';
import { addArticleR } from '@/request/article';
import { getCurrentTime } from '@/util/NumUtil';
import { uploadSingleFileR, uploadMultipleFilesR } from '@/request/upload';
const router = useRouter();
const route = useRoute();
const store = useStore(); 

// 是否是编辑模式
const isEditMode = computed(() => route.query.id !== undefined);

// 文章数据
const articleData = reactive({
  id: 0, // 将在初始化时使用generateSerialNumbers生成
  title: '',
  subtitle: '',
  content: '',
  html_content: '',
  ai_summary: '',
  cover_image: '',
  author_id: 1, // 暂时写死
  category_id: null as number | null,
  status: 0, // 0-草稿，1-发布，2-待审核，3-已下架
  is_top: false,
  is_recommend: false,
  is_original: true,
  source_url: '',
  slug: '',
  keywords: '',
  description: '',
  word_count: 0,
  read_time: 0,
  create_time: '',
  update_time: '',
});

// 编辑器状态
const isPreview = ref(false);
const mdTheme = ref<Themes>('light');
const autoSave = ref(true);
const lastSaved = ref(new Date());

// 文章标签（多选）
const articleTags = ref<string[]>([]);

// 封面图
const coverImageList = ref<any[]>([]);
const previewVisible = ref(false);
const previewImage = ref('');
const coverPreviewUrl = ref(''); // 封面图预览URL
const coverInputRef = ref<HTMLInputElement | null>(null); // 文件输入框引用
const selectedCoverFile = ref<File | null>(null); // 选中的封面文件

// 发布弹窗
const publishModalVisible = ref(false);

// 响应式设置
const isMobile = ref(false);
const showSettings = ref(true);

// 分类和标签数据
const categoryList = ref<any[]>([]); // 分类列表（parent_id = 0）
const tagsList = ref<any[]>([]); // 标签列表（parent_id != 0）
const selectedTagIds = ref<number[]>([]); // 选中的标签ID列表
const isLoading = ref(false); // 加载状态

// 计算属性
const statusText = computed(() => {
  const status = articleData.status;
  if (status === 0) return '草稿';
  if (status === 1) return '已发布';
  if (status === 2) return '待审核';
  if (status === 3) return '已下架';
  return '未知';
});

const statusClass = computed(() => {
  const status = articleData.status;
  if (status === 0) return 'status-draft';
  if (status === 1) return 'status-published';
  if (status === 2) return 'status-pending';
  if (status === 3) return 'status-archived';
  return '';
});

const statusIcon = computed(() => {
  const status = articleData.status;
  if (status === 0) return 'fa-edit';
  if (status === 1) return 'fa-check-circle';
  if (status === 2) return 'fa-clock';
  if (status === 3) return 'fa-archive';
  return 'fa-question-circle';
});

// 编辑器工具栏配置 - 强制包含预览相关工具栏
const editorToolbars = [
  'bold', 'italic', 'strikethrough', 'title', 'sub', 'sup', 'quote', 'unorderedList', 
  'orderedList', 'task', 'codeRow', 'code', 'link', 'image', 'table', 'mermaid', 'katex', 
  'revoke', 'next', 'save', 'prettier', 
  'preview', 'htmlPreview', 
  'catalog', 'pageFullscreen', 'fullscreen', 'outline', 'htmlCode','alignLeft',
  'alignCenter',
  'alignRight',
  'justify',
  'indent',
  'outdent',
  'header',
  'theme'
] as ToolbarNames[];

// 内容变化处理
const handleContentChange = () => {
  // 从内容中提取纯文本，计算字数
  const plainText = articleData.content.replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '');
  articleData.word_count = plainText.length;
  
  // 计算阅读时间
  articleData.read_time = Math.ceil(plainText.length / 400); // 假设中文阅读速度每分钟400字
  
  // 如果开启了自动保存，则每次内容变化后延迟保存
  if (autoSave.value) {
    debouncedSave();
  }
};

// 防抖保存
let saveTimeout: number | null = null;
const debouncedSave = () => {
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
  saveTimeout = window.setTimeout(() => {
    saveDraft();
  }, 3000); // 3秒后自动保存
};

// 返回上一页
const goBack = () => {
  Modal.confirm({
    title: '确认返回',
    content: '是否确认返回？未保存的内容将会丢失。',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      router.back();
    }
  });
};

// 切换预览模式 - 强制切换预览状态
const togglePreview = () => {
  // 显式切换预览状态
  isPreview.value = !isPreview.value;
  console.log('预览状态:', isPreview.value);
  
  // 强制触发编辑器重新渲染
  setTimeout(() => {
    const editorContent = document.querySelector('.md-editor-content');
    if (editorContent) {
      window.dispatchEvent(new Event('resize'));
    }
  }, 100);
};

// 切换设置面板
const toggleSettings = () => {
  showSettings.value = !showSettings.value;
};

// 确保预览区域可以滚动的重要样式调整
const fixScrollIssue = () => {
  setTimeout(() => {
    // 修复预览区域无法滚动的问题
    const previewWrapper = document.querySelector('.md-editor-preview-wrapper');
    const preview = document.querySelector('.md-editor-preview');
    if (previewWrapper && preview) {
      (previewWrapper as HTMLElement).style.overflow = 'auto';
      (preview as HTMLElement).style.height = 'auto';
      (preview as HTMLElement).style.minHeight = '100%';
      
      // 强制触发窗口resize事件，让编辑器重新计算布局
      window.dispatchEvent(new Event('resize'));
    }
  }, 200);
};

// 初始化分类和标签数据 - 修复API响应格式
const initCategoryAndTags = async () => {
  try {
    isLoading.value = true;
    const response: any = await getCategoryListR({});
    console.log('API响应:', response);
    
    // 根据Axios拦截器，返回的是response.data，格式：{data: [...], code: 200}
    if (response && response.code === 200 && response.data) {
      // 前端分类处理
      categoryList.value = response.data.filter((item: any) => item.parent_id === 0);
      tagsList.value = response.data.filter((item: any) => item.parent_id !== 0);
      console.log('分类加载成功:', categoryList.value);
      console.log('标签加载成功:', tagsList.value);
    } else {
      console.error('API响应格式错误:', response);
      message.error('获取分类和标签数据失败');
      // 提供默认数据
      categoryList.value = [
        { id: 1, name: '技术分享', parent_id: 0, icon: 'fa-code' },
        { id: 2, name: '生活随笔', parent_id: 0, icon: 'fa-heart' }
      ];
      tagsList.value = [
        { id: 3, name: 'Vue', parent_id: 1 },
        { id: 4, name: 'JavaScript', parent_id: 1 }
      ];
    }
  } catch (error) {
    console.error('获取分类和标签数据出错:', error);
    message.error('获取分类和标签数据出错');
    // 提供默认数据
    categoryList.value = [
      { id: 1, name: '技术分享', parent_id: 0, icon: 'fa-code' },
      { id: 2, name: '生活随笔', parent_id: 0, icon: 'fa-heart' }
    ];
    tagsList.value = [
      { id: 3, name: 'Vue', parent_id: 1 },
      { id: 4, name: 'JavaScript', parent_id: 1 }
    ];
  } finally {
    isLoading.value = false;
  }
};

// 生成唯一文章ID - 修复类型问题
const generateArticleId = (): number => {
  // 使用generateSerialNumbers生成5位数ID，确保返回数字类型
  const serialNumber = generateSerialNumbers();
  if (Array.isArray(serialNumber)) {
    // 如果返回数组，取第一个元素并转换为数字
    return parseInt(serialNumber[0], 10);
  }
  return typeof serialNumber === 'string' ? parseInt(serialNumber, 10) : serialNumber;
};

// 综合初始化函数
const initData = async () => {
  // 生成文章ID
  if (!isEditMode.value && articleData.id === 0) {
    articleData.id = generateArticleId();
    console.log('生成文章ID:', articleData.id);
  }
  
  // 加载分类和标签数据（只调用一次API）
  await initCategoryAndTags();
  
  // 如果是编辑模式，加载文章数据
  if (isEditMode.value) {
    // 获取文章ID
    const articleId = Number(route.query.id);
    if (articleId) {
      await loadArticleData(articleId);
    }
  }
};

// 加载文章数据（编辑模式）
const loadArticleData = async (articleId: number) => {
  try {
    isLoading.value = true;
    // 这里应该调用实际的API，现在使用模拟数据
    setTimeout(() => {
      Object.assign(articleData, {
        id: articleId,
        title: '示例文章标题',
        subtitle: '这是一个示例副标题',
        content: '# 示例文章内容\n\n这是一篇示例文章的内容。\n\n## 二级标题\n\n更多内容...\n\n```javascript\n// 这是一个代码块\nfunction example() {\n  console.log("Hello World");\n}\n```',
        category_id: 1,
        status: 0,
        is_original: true,
        keywords: 'Vue,示例,文章',
        description: '这是一篇示例文章的描述内容。',
        word_count: 100,
        read_time: 1,
        create_time: new Date().toISOString(),
        update_time: new Date().toISOString(),
      });
      
      // 初始化标签 - 从keywords或article_tags中获取
      articleTags.value = ['Vue', '示例'];
      
      // 初始化封面图
      initCoverImageList();
      
      isLoading.value = false;
    }, 500);
  } catch (error) {
    console.error('加载文章数据失败:', error);
    message.error('加载文章数据失败');
    isLoading.value = false;
  }
};

// 显示发布弹窗
const showPublishModal = () => {
  if (!articleData.title) {
    message.error('请先输入文章标题');
    return;
  }
  
  if (!articleData.content) {
    message.error('请先输入文章内容');
    return;
  }
  
  if (!articleData.category_id) {
    message.error('请选择文章分类');
    return;
  }
  
  publishModalVisible.value = true;
};

// 发布文章 - 修改标签数据格式
const publishArticle = async () => {
  try {
    // 确保article_id正确
    const article_id = articleData.id;
    
    // 修复store类型问题
    const userInfo = store.userInfo as any;
    articleData.author_id = userInfo?.id || 1;
    
    // 如果有选中的封面图，先上传
    if (selectedCoverFile.value) {
      const uploadedUrl = await uploadCoverImage();
      if (uploadedUrl) {
        articleData.cover_image = uploadedUrl;
      }
    }
    
    // 构建标签数据 [{article_id: xxx, category_id: xxx}]
    const tagsData = selectedTagIds.value.map(category_id => ({
      article_id,
      category_id
    }));
    
    // 构建提交的数据
    const submitData = {
      ...articleData,
      tags: tagsData // 正确的标签格式
    };
    submitData.create_time = getCurrentTime();
    submitData.update_time = getCurrentTime();
    
    const response: any = await addArticleR(submitData);
    if (response?.code === 200) {
      message.success('发布成功');
      publishModalVisible.value = false;
      // 可以跳转到文章详情页或列表页
    } else {
      message.error('发布失败');
    }
  } catch (error) {
    console.error('发布失败:', error);
    message.error('发布失败');
  } finally {
    publishModalVisible.value = false;
  }
};

// 保存草稿 - 修改标签数据格式
const saveDraft = () => {
  // 确保article_id正确
  const article_id = articleData.id;
  
  // 构建标签数据 [{article_id: xxx, category_id: xxx}]
  const tagsData = selectedTagIds.value.map(category_id => ({
    article_id,
    category_id
  }));
  
  // 构建提交的数据
  const submitData = {
    ...articleData,
    tags: tagsData // 正确的标签格式
  };
  
  // 实际应用中应该调用API
  console.log('保存草稿', submitData);
  lastSaved.value = new Date();
  message.success('保存成功');
};

// 生成AI摘要
const generateAiSummary = () => {
  if (!articleData.content) {
    message.error('请先输入文章内容');
    return;
  }
  
  // 模拟AI生成
  message.loading('正在生成AI摘要...', 1.5)
    .then(() => {
      // 模拟生成结果
      articleData.ai_summary = '这是通过AI技术自动生成的文章摘要，概括了文章的主要内容和价值点。实际应用中，可以通过调用AI API来生成更加智能的摘要内容。';
      articleData.description = articleData.ai_summary;
      message.success('AI摘要生成成功');
    });
};

// 上传图片处理 - 使用现有的上传API
const onUploadImg = async (files: File[], callback: (urls: string[]) => void) => {
  try {
    console.log('开始上传富文本图片:', files);
    
    const urls: string[] = [];
    
    // 逐个上传文件
    for (const file of files) {
      try {
        const response: any = await uploadSingleFileR(file);
        console.log('图片上传响应:', response);
        
        if (response.code === 200 && response.data && response.data.length > 0) {
          urls.push(response.data[0].url);
          console.log(`图片 ${file.name} 上传成功:`, response.data[0].url);
        } else {
          console.error(`图片 ${file.name} 上传失败:`, response.msg || '未知错误');
          message.error(`图片 ${file.name} 上传失败`);
        }
      } catch (error) {
        console.error(`图片 ${file.name} 上传出错:`, error);
        message.error(`图片 ${file.name} 上传出错`);
      }
    }
    
    if (urls.length > 0) {
      callback(urls);
      message.success(`成功上传 ${urls.length} 张图片`);
    } else {
      message.error('没有图片上传成功');
    }
  } catch (error) {
    console.error('图片上传出错:', error);
    message.error('图片上传出错');
  }
};

// 处理封面图预览
const handlePreview = (file: any) => {
  previewImage.value = file.url || file.thumbUrl;
  previewVisible.value = true;
};

// 处理封面图变更
const handleCoverChange = ({ fileList }: { fileList: any[] }) => {
  coverImageList.value = fileList;
  if (fileList.length > 0 && fileList[0].url) {
    articleData.cover_image = fileList[0].url;
  } else if (fileList.length > 0 && fileList[0].thumbUrl) {
    articleData.cover_image = fileList[0].thumbUrl;
  } else {
    articleData.cover_image = '';
  }
};

// 初始化封面图显示
const initCoverImageList = () => {
  if (articleData.cover_image) {
    coverImageList.value = [
      {
        uid: '-1',
        name: 'cover.jpg',
        status: 'done',
        url: articleData.cover_image,
      },
    ];
  } else {
    coverImageList.value = [];
  }
};

// 检测窗口尺寸
const checkIsMobile = () => {
  isMobile.value = window.innerWidth <= 768;
  // 在移动端默认不显示设置面板
  if (isMobile.value) {
    showSettings.value = false;
  }
};

// 组件挂载和卸载
onMounted(() => {
  // 检测屏幕尺寸
  checkIsMobile();
  window.addEventListener('resize', checkIsMobile);
  
  // 初始化数据
  initData();
  
  // 监听关闭页面事件，提示保存
  window.addEventListener('beforeunload', (e) => {
    e.preventDefault();
    e.returnValue = '';
  });
  
  // 修复预览区域滚动问题
  fixScrollIssue();
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile);
  window.removeEventListener('beforeunload', () => {});
  
  if (saveTimeout) {
    clearTimeout(saveTimeout);
  }
});

// 监听标签数组变化，更新keywords字段
watch(articleTags, (newTags: string[]) => {
  handleTagsChange(newTags);
});

// 处理标签选择变化
const handleTagsChange = (values: string[]) => {
  // 更新关键词
  articleData.keywords = values.join(',');
  
  // 根据标签名称找到对应的标签ID
  selectedTagIds.value = values.map(tagName => {
    const tag = tagsList.value.find(t => t.name === tagName);
    return tag ? tag.id : null;
  }).filter(id => id !== null) as number[];
  
  console.log('选中的标签IDs:', selectedTagIds.value);
};

// 一键填充测试数据
const fillTestData = () => {
  // 填充文章基本信息
  articleData.title = '探索Vue3与TypeScript的完美结合';
  articleData.subtitle = '现代前端开发的高效实践与最佳模式';
  
  // 确保有文章ID
  if (articleData.id === 0) {
    articleData.id = generateArticleId();
  }
  
  // 填充文章内容（恢复原始内容）
  articleData.content = `# 探索Vue3与TypeScript的完美结合

## 引言

Vue3的发布带来了许多令人兴奋的新特性，结合TypeScript使用更是如虎添翼。本文将探讨如何在实际项目中充分发挥Vue3和TypeScript的优势，打造类型安全、可维护性高的现代前端应用。

## Vue3的组合式API

组合式API（Composition API）是Vue3最引人注目的特性之一，它解决了Vue2中存在的一些问题：

\`\`\`typescript
// 使用组合式API的简单示例
import { ref, computed, watch, onMounted } from 'vue'

export default {
  setup() {
    // 响应式状态
    const count = ref(0)
    
    // 计算属性
    const doubleCount = computed(() => count.value * 2)
    
    // 方法
    function increment() {
      count.value++
    }
    
    // 生命周期钩子
    onMounted(() => {
      console.log('组件已挂载')
    })
    
    // 暴露给模板
    return {
      count,
      doubleCount,
      increment
    }
  }
}
\`\`\`

## TypeScript带来的优势

在Vue3项目中使用TypeScript能够带来以下优势：

1. **类型安全** - 在开发阶段捕获潜在错误
2. **更好的IDE支持** - 代码补全、类型检查、重构工具
3. **更清晰的文档** - 类型定义本身就是最好的文档
4. **更容易维护** - 特别是在大型项目中

## 实际项目中的最佳实践

### 定义类型

\`\`\`typescript
// 定义接口或类型
interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user' | 'guest';
}

// 在组件中使用
const user = ref<User | null>(null)
\`\`\`

### API调用

\`\`\`typescript
// 使用类型定义API响应
interface ApiResponse<T> {
  data: T;
  message: string;
  status: number;
}

async function fetchUsers(): Promise<ApiResponse<User[]>> {
  const response = await fetch('/api/users')
  return response.json()
}
\`\`\`

## 结论

Vue3和TypeScript的结合为前端开发带来了更强大的工具和更好的开发体验。通过合理运用这些技术，我们可以构建出更健壮、更易于维护的应用程序。

![Vue3 Logo](https://vuejs.org/images/logo.png)

> 技术栈的选择应该基于项目需求，而不是盲目追求热门技术。

*希望本文对你的Vue3+TypeScript开发之旅有所帮助！*
`;
  
  // 填充其他字段
  articleData.category_id = 1; // 技术分类
  
  // 设置标签并更新selectedTagIds
  articleTags.value = ['Vue', 'TypeScript', '前端开发', '教程'];
  handleTagsChange(articleTags.value);
  
  articleData.is_original = true;
  articleData.keywords = articleTags.value.join(',');
  articleData.description = '本文详细探讨了Vue3与TypeScript结合使用的各种优势和最佳实践，帮助开发者构建类型安全、可维护性高的现代前端应用。文章包含丰富的代码示例和实际项目中的应用模式。';
  
  // 计算字数和阅读时间
  handleContentChange();
  
  // 提示成功
  message.success('测试数据填充成功！');
};

// 选择封面图
const selectCoverImage = () => {
  coverInputRef.value?.click();
};

// 处理封面图选择
const handleCoverSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // 验证文件大小（2MB）
    if (file.size > 2 * 1024 * 1024) {
      message.error('图片大小不能超过2MB');
      return;
    }
    
    // 验证文件类型
    if (!file.type.startsWith('image/')) {
      message.error('请选择图片文件');
      return;
    }
    
    selectedCoverFile.value = file;
    coverPreviewUrl.value = URL.createObjectURL(file);
    
    // 清空文件输入框
    target.value = '';
  }
};

// 删除封面图
const removeCoverImage = () => {
  selectedCoverFile.value = null;
  coverPreviewUrl.value = '';
  if (coverPreviewUrl.value) {
    URL.revokeObjectURL(coverPreviewUrl.value);
  }
};

// 上传封面图到服务器
const uploadCoverImage = async (): Promise<string> => {
  if (!selectedCoverFile.value) {
    return '';
  }
  
  try {
    const response: any = await uploadSingleFileR(selectedCoverFile.value);
    console.log('封面图上传响应:', response);
    
    if (response.code === 200 && response.data && response.data.length > 0) {
      return response.data[0].url; // 返回上传后的图片URL
    } else {
      throw new Error(response.msg || '上传失败');
    }
  } catch (error) {
    console.error('封面图上传失败:', error);
    message.error('封面图上传失败');
    return '';
  }
};

// 测试上传功能
const runUploadTest = async () => {
  message.loading('正在测试上传功能...', 0);
  
  try {
    // 创建测试文件
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(0, 0, 100, 100);
      ctx.fillStyle = '#ffffff';
      ctx.font = '16px Arial';
      ctx.fillText('TEST', 30, 55);
    }
    
    // 转换为blob
    canvas.toBlob(async (blob) => {
      if (blob) {
        const testFile = new File([blob], 'test.png', { type: 'image/png' });
        
        try {
          const response: any = await uploadSingleFileR(testFile);
          console.log('上传测试结果:', response);
          
          message.destroy();
          if (response.code === 200) {
            message.success('上传测试成功！');
          } else {
            message.error('上传测试失败：' + (response.msg || '未知错误'));
          }
        } catch (error) {
          console.error('上传测试失败:', error);
          message.destroy();
          message.error('上传测试失败，请查看控制台日志');
        }
      }
    }, 'image/png');
  } catch (error) {
    message.destroy();
    message.error('上传测试失败，请查看控制台日志');
    console.error('上传测试失败:', error);
  }
};
</script>

<style lang="less" scoped>
.writer-center-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  position: relative;
  background-color: #f5f8fa;
  color: #262626;
  
  // 背景效果
  .background-effects {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    overflow: hidden;
    z-index: 0;
    
    .glow {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.3;
      
      &.glow-1 {
        top: -5%;
        right: -5%;
        width: 60%;
        height: 40%;
        background: radial-gradient(circle at center, rgba(24, 144, 255, 0.08), rgba(24, 144, 255, 0));
      }
      
      &.glow-2 {
        bottom: -10%;
        left: -10%;
        width: 70%;
        height: 50%;
        background: radial-gradient(circle at center, rgba(0, 194, 255, 0.05), rgba(0, 194, 255, 0));
      }
      
      &.glow-3 {
        top: 30%;
        left: 40%;
        width: 50%;
        height: 40%;
        background: radial-gradient(circle at center, rgba(124, 77, 255, 0.06), rgba(124, 77, 255, 0));
      }
    }
  }
  
  // 顶部导航 - 样式微调
  .writer-header {
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);
    padding: 0;
    position: sticky;
    top: 0;
    z-index: 100;
    height: 56px;
    display: flex;
    align-items: center;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    
    .header-container {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      padding: 0 20px;
      
      .left-section {
        display: flex;
        align-items: center;
        gap: 16px;
        
        .back-button {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: #f0f0f0;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          
          &:hover {
            background: #e6f7ff;
            color: #1890ff;
            transform: translateX(-3px);
          }
          
          &:active {
            transform: scale(0.95);
          }
          
          i {
            font-size: 16px;
          }
        }
        
        .page-title {
          font-size: 17px;
          font-weight: 500;
          color: #262626;
          position: relative;
          padding-left: 16px;
          
          &:before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            height: 18px;
            width: 3px;
            background: #1890ff;
            border-radius: 3px;
          }
        }
      }
      
      .right-section {
        display: flex;
        align-items: center;
        gap: 18px;
        
        .article-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 13px;
          padding: 4px 12px;
          border-radius: 20px;
          background: #f5f5f5;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
          
          &.status-draft {
            background: #fffbe6;
            color: #d48806;
            
            i {
              color: #d48806;
            }
          }
          
          &.status-published {
            background: #f6ffed;
            color: #52c41a;
            
            i {
              color: #52c41a;
            }
          }
          
          &.status-pending {
            background: #e6f7ff;
            color: #1890ff;
            
            i {
              color: #1890ff;
            }
          }
          
          &.status-archived {
            background: #f5f5f5;
            color: #8c8c8c;
            
            i {
              color: #8c8c8c;
            }
          }
        }
        
        .action-buttons {
          display: flex;
          align-items: center;
          gap: 10px;
          
          .action-button {
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #595959;
            border-color: #e0e0e0;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
            
            &:hover {
              color: #1890ff;
              border-color: #1890ff;
              transform: translateY(-2px);
              box-shadow: 0 3px 6px rgba(24, 144, 255, 0.12);
            }
            
            &:active {
              transform: scale(0.95);
            }
            
            i {
              font-size: 15px;
            }
          }
          
          .publish-button {
            height: 36px;
            border-radius: 8px;
            background: linear-gradient(135deg, #1890ff, #096dd9);
            color: white;
            border: none;
            padding: 0 20px;
            font-size: 14px;
            font-weight: 500;
            display: flex;
            align-items: center;
            gap: 8px;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            box-shadow: 0 2px 6px rgba(24, 144, 255, 0.15);
            
            &:hover {
              transform: translateY(-2px);
              box-shadow: 0 4px 12px rgba(24, 144, 255, 0.25);
            }
            
            &:active {
              transform: scale(0.97);
              background: linear-gradient(135deg, #1683e8, #0862c0);
            }
            
            i {
              font-size: 14px;
              margin-right: 4px;
            }
          }
        }
      }
    }
  }
  
  // 主体内容区 - 完全重构
  .writer-content {
    flex: 1;
    position: relative;
    overflow: hidden;
    z-index: 1;
    
    // 编辑器容器
    .editor-container {
      width: 100%;
      height: 100%;
      padding: 20px;
      overflow-y: auto;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      transition: all 0.3s ease;
      
      // 根据侧边栏状态调整宽度
      &.full-width {
        padding-right: 30px;
      }
      
      // 编辑器区域
      .editor-wrapper {
        flex: 1;
        border-radius: 12px;
        overflow: hidden;
        background: white;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
        transition: all 0.3s ease;
        width: 100%;
        height: 100%;
        
        &:hover {
          box-shadow: 0 3px 12px rgba(0, 0, 0, 0.08);
        }
        
        // 自定义编辑器样式
        .custom-md-editor {
          height: 100%;
          border: none;
          width: 100%;
          
          // 强制编辑器填满空间
          :deep(.md-editor) {
            width: 100% !important;
            height: 100% !important;
            max-width: none !important;
            border: none !important;
            box-shadow: none !important;
          }
          
          // 编辑器内容区域填满空间
          :deep(.md-editor-content) {
            width: 100% !important;
            height: calc(100% - 42px) !important;
          }
          
          // 恢复预览区域滚动功能
          :deep(.md-editor-preview-wrapper) {
            overflow: auto !important;
          }
          
          // 恢复编辑区域滚动功能
          :deep(.md-editor-input-wrapper) {
            overflow: auto !important;
          }
          
          // 移除可能干扰原生滚动的样式
          :deep(.md-editor-preview) {
            height: auto !important;
            min-height: 100% !important;
          }
          
          // 移除可能干扰原生滚动的样式
          :deep(.md-editor-input) {
            height: auto !important;
            min-height: 100% !important;
          }
        }
      }
    }
    
    // 侧边栏切换按钮 - 全新设计
    .sidebar-toggle {
      position: fixed;
      top: 50%;
      right: 0;
      transform: translateY(-50%);
      width: 28px;
      height: 80px;
      background: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px 0 0 8px;
      box-shadow: -2px 0 8px rgba(0, 0, 0, 0.08);
      cursor: pointer;
      z-index: 99;
      transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
      color: #8c8c8c;
      
      &:hover {
        color: #1890ff;
        box-shadow: -3px 0 12px rgba(0, 0, 0, 0.12);
        width: 32px;
      }
      
      &:active {
        transform: translateY(-50%) scale(0.95);
      }
      
      &.active {
        right: 320px;
        
        @media (max-width: 768px) {
          opacity: 0;
          pointer-events: none;
        }
      }
      
      i {
        font-size: 14px;
      }
    }
    
    // 侧边设置面板 - 不占用主体空间
    .settings-panel {
      position: fixed;
      top: 56px;
      right: -320px; // 默认隐藏
      width: 320px;
      height: calc(100vh - 56px);
      background: white;
      border-left: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: -3px 0 15px rgba(0, 0, 0, 0.08);
      z-index: 100;
      transition: all 0.35s cubic-bezier(0.23, 1, 0.32, 1);
      overflow: hidden;
      
      &.visible {
        right: 0; // 显示
      }
      
      .panel-container {
        height: 100%;
        display: flex;
        flex-direction: column;
        
        // 面板头部
        .panel-header {
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          border-bottom: 1px solid #f0f0f0;
          
          span {
            font-size: 16px;
            font-weight: 500;
            color: #262626;
          }
          
          // 关闭按钮
          .toggle-button {
            width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 6px;
            cursor: pointer;
            color: #8c8c8c;
            transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
            
            &:hover {
              background: #f5f5f5;
              color: #ff4d4f;
              transform: scale(1.05);
            }
            
            &:active {
              transform: scale(0.95);
            }
            
            i {
              font-size: 16px;
            }
          }
        }
        
        // 面板内容
        .panel-content {
          flex: 1;
          overflow-y: auto;
          overflow-x: hidden;
          padding: 16px;
          
          &::-webkit-scrollbar {
            width: 5px;
          }
          
          &::-webkit-scrollbar-thumb {
            background-color: rgba(0, 0, 0, 0.1);
            border-radius: 5px;
            
            &:hover {
              background-color: rgba(0, 0, 0, 0.2);
            }
          }
          
          // 设置区块
          .setting-section {
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 1px dashed rgba(0, 0, 0, 0.08);
            
            &:last-child {
              margin-bottom: 0;
              padding-bottom: 0;
              border-bottom: none;
            }
            
            // 区块标题
            .section-header {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-bottom: 16px;
              
              i {
                font-size: 15px;
                color: #1890ff;
                opacity: 0.9;
              }
              
              span {
                font-size: 15px;
                font-weight: 500;
                color: #262626;
              }
            }
            
            // 设置项
            .setting-item {
              margin-bottom: 16px;
              
              &:last-child {
                margin-bottom: 0;
              }
              
              .setting-label {
                font-size: 13px;
                color: #595959;
                margin-bottom: 8px;
              }
              
              .setting-options {
                display: flex;
                flex-direction: column;
                gap: 10px;
              }
              
              .checkbox-label {
                display: flex;
                align-items: center;
                gap: 8px;
                cursor: pointer;
                
                span {
                  font-size: 13px;
                  color: #595959;
                }
              }
              
              .upload-text {
                margin-top: 6px;
                color: #8c8c8c;
                font-size: 12px;
              }
              
              .tip-text {
                margin-top: 6px;
                color: #8c8c8c;
                font-size: 12px;
              }
            }
            
            // 统计信息面板
            .stats-panel {
              display: flex;
              justify-content: space-between;
              align-items: center;
              background: #f5f5f5;
              border-radius: 10px;
              padding: 14px;
              margin-bottom: 16px;
              transition: all 0.3s ease;
              
              &:hover {
                background: #f0f5ff;
              }
              
              .stat-item {
                text-align: center;
                flex: 1;
                
                .stat-value {
                  font-size: 18px;
                  font-weight: 500;
                  color: #1890ff;
                }
                
                .stat-label {
                  font-size: 12px;
                  color: #8c8c8c;
                  margin-top: 4px;
                }
              }
              
              .stat-divider {
                width: 1px;
                height: 30px;
                background: #e8e8e8;
              }
            }
            
            // AI按钮 - 设置紫色主题优化样式
            .ai-button {
              height: 44px;
              color: white;
              background: linear-gradient(135deg, #7c3aed, #4338ca);
              transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
              border-radius: 8px;
              font-weight: 500;
              position: relative;
              border: 1px solid rgba(125, 67, 232, 0.5);
              box-shadow: 0 2px 8px rgba(124, 58, 237, 0.25), inset 0 1px rgba(255, 255, 255, 0.1);
              overflow: hidden;
              
              // 内部内容居中
              .ai-button-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 8px;
                height: 100%;
                position: relative;
                z-index: 1;
              }
              
              // 发光效果
              &::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: linear-gradient(135deg, rgba(124, 58, 237, 0.5), rgba(67, 56, 202, 0.5));
                opacity: 0;
                transition: opacity 0.3s ease;
                border-radius: 7px;
              }
              
              i {
                font-size: 16px;
              }
              
              &:hover {
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(124, 58, 237, 0.3), inset 0 1px rgba(255, 255, 255, 0.15);
                
                &::before {
                  opacity: 0.4;
                }
              }
              
              &:active {
                transform: scale(0.98);
                box-shadow: 0 2px 4px rgba(124, 58, 237, 0.2);
              }
            }
            
            // 一键填充测试数据按钮样式
            .test-data-button {
              height: 40px;
              margin-top: 8px;
              display: flex;
              align-items: center;
              justify-content: center;
              gap: 8px;
              color: #595959;
              background: #f0f0f0;
              border: 1px solid #d9d9d9;
              transition: all 0.3s ease;
              border-radius: 8px;
              
              i {
                font-size: 14px;
                color: #7c3aed;
              }
              
              &:hover {
                color: #7c3aed;
                background: #f9f7ff;
                border-color: #d4c6fc;
              }
              
              &:active {
                background: #f5f0ff;
                transform: scale(0.98);
              }
            }
          }
        }
      }
    }
    
    // 移动端工具栏
    .mobile-toolbar {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      height: 64px;
      background: rgba(255, 255, 255, 0.98);
      box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.08);
      display: flex;
      justify-content: space-around;
      align-items: center;
      z-index: 100;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 0 10px;
      padding-bottom: env(safe-area-inset-bottom, 0); // 适配iPhone底部安全区域
      
      .toolbar-button {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #595959;
        border-radius: 14px;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        background: #f5f5f5;
        box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
        
        &:active {
          background: #f0f0f0;
          transform: scale(0.92);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
        }
        
        // 主要按钮样式
        &.primary {
          color: white;
          background: linear-gradient(135deg, #1890ff, #096dd9);
          box-shadow: 0 3px 8px rgba(24, 144, 255, 0.2);
          
          &:active {
            background: linear-gradient(135deg, #1683e8, #0862c0);
            box-shadow: 0 2px 4px rgba(24, 144, 255, 0.15);
          }
        }
        
        // 紫色系按钮样式
        &.purple {
          color: white;
          background: linear-gradient(135deg, #722ed1, #531dab);
          box-shadow: 0 3px 8px rgba(114, 46, 209, 0.2);
          
          &:active {
            background: linear-gradient(135deg, #6728bd, #4a1b97);
            box-shadow: 0 2px 4px rgba(114, 46, 209, 0.15);
          }
        }
        
        // 填充数据按钮特殊样式
        &.fill-data {
          color: white;
          background: linear-gradient(135deg, #9333ea, #7e22ce);
          box-shadow: 0 3px 8px rgba(147, 51, 234, 0.2);
          
          &:active {
            background: linear-gradient(135deg, #8b31d8, #7120bd);
            box-shadow: 0 2px 4px rgba(147, 51, 234, 0.15);
          }
        }
        
        i {
          font-size: 20px;
        }
      }
    }
  }
  
  // 发布确认弹窗样式
  .publish-confirm-content {
    text-align: center;
    padding: 20px 10px;
    
    .confirm-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      margin: 0 auto 16px;
      border-radius: 50%;
      background: linear-gradient(135deg, #1890ff, #096dd9);
      color: white;
      
      i {
        font-size: 24px;
      }
    }
    
    .confirm-title {
      margin: 0 0 12px 0;
      font-size: 18px;
      font-weight: 600;
      color: #262626;
    }
    
    .confirm-message {
      margin: 0;
      font-size: 14px;
      color: #595959;
      line-height: 1.5;
    }
  }
  
  // 封面图预览样式
  .cover-upload-container {
    .cover-upload-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 120px;
      border: 2px dashed #d9d9d9;
      border-radius: 8px;
      background-color: #fafafa;
      cursor: pointer;
      transition: all 0.3s ease;
      
      &:hover {
        border-color: #1890ff;
        background-color: #f0f9ff;
      }
      
      i {
        font-size: 24px;
        color: #bfbfbf;
        margin-bottom: 8px;
      }
      
      .upload-text {
        font-size: 14px;
        font-weight: 500;
        color: #595959;
        margin-bottom: 4px;
      }
      
      .upload-hint {
        font-size: 12px;
        color: #8c8c8c;
      }
    }
    
    .cover-preview {
      position: relative;
      border-radius: 8px;
      overflow: hidden;
      
      .cover-preview-image {
        width: 100%;
        height: 120px;
        object-fit: cover;
        display: block;
      }
      
      .cover-actions {
        position: absolute;
        top: 8px;
        right: 8px;
        display: flex;
        gap: 4px;
        opacity: 0;
        transition: opacity 0.3s ease;
        
        .ant-btn {
          padding: 4px 8px;
          height: auto;
          font-size: 12px;
          display: flex;
          align-items: center;
          gap: 4px;
        }
      }
      
      &:hover .cover-actions {
        opacity: 1;
      }
    }
  }
  
  // 自定义组件样式
  :deep(.ant-select-single:not(.ant-select-customize-input) .ant-select-selector) {
    height: 34px;
    padding: 0 12px;
    border-radius: 6px;
  }
  
  :deep(.ant-select:not(.ant-select-customize-input) .ant-select-selector) {
    border-radius: 6px;
  }
  
  :deep(.ant-upload.ant-upload-select-picture-card) {
    width: 90px;
    height: 90px;
    border-radius: 8px;
    border-color: #e0e0e0;
    transition: all 0.3s ease;
    
    &:hover {
      border-color: #1890ff;
    }
  }
  
  :deep(.ant-upload-list-picture-card-container) {
    width: 90px;
    height: 90px;
  }
  
  :deep(.ant-checkbox-wrapper) {
    font-size: 13px;
  }

  :deep(.ant-input) {
    border-radius: 6px;
    transition: all 0.3s ease;
    
    &:hover, &:focus {
      border-color: #1890ff;
    }
  }
  
  :deep(.ant-input-affix-wrapper) {
    border-radius: 6px;
  }
  
  // 响应式适配
  @media (max-width: 1200px) {
    .writer-content {
      .editor-container {
        padding: 16px;
      }
    }
  }
  
  @media (max-width: 768px) {
    .writer-header {
      height: 52px;
      
      .header-container {
        padding: 0 16px;
        
        .left-section {
          .page-title {
            font-size: 16px;
          }
          
          .back-button {
            width: 32px;
            height: 32px;
          }
        }
        
        .right-section {
          .article-status {
            display: none;
          }
          
          .action-buttons {
            gap: 8px;
            
            .action-button {
              width: 32px;
              height: 32px;
            }
            
            .publish-button {
              height: 32px;
              padding: 0 12px;
              
              span {
                display: none;
              }
              
              i {
                margin-right: 0;
              }
            }
          }
        }
      }
    }
    
    .writer-content {
      .editor-container {
        padding: 8px;
        padding-bottom: 70px;
        
        &.full-width {
          padding-right: 8px;
        }
        
        .editor-wrapper {
          border-radius: 6px;
          margin-top: 0;
        }
      }
      
      .settings-panel {
        width: 100%;
        max-width: 100%;
        right: -100%;
        
        &.visible {
          right: 0;
        }
      }
    }
    
    .mobile-toolbar {
      height: 56px;
      
      .toolbar-button {
        width: 40px;
        height: 40px;
      }
    }
  }
  
  // 动画效果
  .action-button, .publish-button, .toolbar-button {
    &:hover {
      animation: pulse 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  }
  
  @keyframes pulse {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.08);
    }
    100% {
      transform: scale(1);
    }
  }
}

// 自定义编辑器样式
.custom-md-editor {
  height: 100%;
  border: none;
  width: 100%;
  
  // 移动端编辑器样式优化
  @media (max-width: 768px) {
    :deep(.md-editor-toolbar) {
      padding: 4px 6px !important;
      
      .md-toolbar-item button {
        padding: 4px !important;
        margin: 0 1px !important;
      }
    }
    
    // 减小移动端下的内容区域内边距
    :deep(.md-editor-input-wrapper) .md-editor-input {
      padding: 10px !important; 
    }
    
    :deep(.md-editor-preview-wrapper) .md-editor-preview {
      padding: 10px 12px !important;
    }
    
    :deep(.md-editor-html-preview) {
      padding: 10px 12px !important;
    }
  }
}

// 侧边设置面板移动端优化
.settings-panel {
  @media (max-width: 768px) {
    .panel-content {
      padding: 12px;
      
      .setting-section {
        margin-bottom: 16px;
        padding-bottom: 16px;
        
        .setting-item {
          margin-bottom: 12px;
        }
      }
    }
  }
}

// 添加分类选项样式
.category-option {
  display: flex;
  align-items: center;
  gap: 8px;
  
  i {
    font-size: 14px;
    color: #1890ff;
  }
}

// 添加加载状态样式
:deep(.ant-select-loading) {
  .ant-select-arrow {
    color: #1890ff;
  }
}
</style>