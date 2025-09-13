<template>
  <div class="resource-upload-container animate__animated animate__fadeIn">
    <div class="upload-header">
      <h2 class="animate__animated animate__fadeInDown">
        <i class="fas fa-cloud-upload-alt"></i> 资源上传中心
      </h2>
      <p class="animate__animated animate__fadeIn animate__delay-1s">轻松上传您的文件，支持多种格式</p>
    </div>
    
    <div class="upload-main">
      <!-- 文件类型选择区 -->
      <div class="file-type-selector animate__animated animate__fadeIn animate__delay-1s">
        <div class="type-title">选择文件类型</div>
        <div class="type-options">
          <div 
            v-for="(type, index) in fileTypes" 
            :key="index" 
            class="type-option" 
            :class="{ active: selectedFileType === type.value }"
            @click="selectedFileType = type.value"
            v-motion
            :initial="{ scale: 0.8, opacity: 0 }"
            :enter="{ scale: 1, opacity: 1, transition: { delay: 100 * index } }"
          >
            <i :class="type.icon"></i>
            <span>{{ type.label }}</span>
          </div>
        </div>
      </div>
      
      <!-- 文件拖拽上传区域 -->
      <a-upload-dragger
        v-model:fileList="fileList"
        name="file"
        :multiple="true"
        :before-upload="beforeUpload"
        @change="handleChange"
        :showUploadList="false"
        class="upload-area animate__animated animate__fadeIn animate__delay-2s"
      >
        <div class="upload-content">
          <div class="upload-icon-container" v-motion :initial="{ scale: 0.5 }" :enter="{ scale: 1, transition: { type: 'spring', stiffness: 300 } }">
            <i class="fas fa-cloud-upload-alt"></i>
          </div>
          <p class="upload-text">点击或拖拽文件到此处上传</p>
          <p class="upload-hint">支持单个或批量上传，最大10MB</p>
          <div class="supported-types">
            <span v-for="(ext, i) in supportedExtensions" :key="i" class="ext-tag">
              <i class="fas fa-check-circle"></i> {{ ext }}
            </span>
          </div>
        </div>
      </a-upload-dragger>
      
      <!-- 上传进度显示 -->
      <div class="upload-progress animate__animated animate__fadeIn" v-if="uploading">
        <div class="progress-status">
          <i :class="uploadStatusIcon"></i>
          <span>{{ uploadStatusText }}</span>
        </div>
        <a-progress 
          :percent="uploadPercent" 
          :status="uploadStatus" 
          :stroke-color="{ 
            '0%': '#108ee9', 
            '100%': '#87d068' 
          }"
          stroke-linecap="round"
        />
        <div class="progress-info">
          <span>{{ uploadedFiles }} 个文件</span>
          <span>{{ uploadedSize }} / {{ totalSize }}</span>
        </div>
      </div>
      
      <!-- 上传结果展示 -->
      <transition-group 
        name="list" 
        tag="div" 
        class="upload-result" 
        v-if="uploadResult.length > 0"
      >
        <div class="result-header" key="header">
          <h3><i class="fas fa-list-alt"></i> 上传结果</h3>
          <a-button 
            type="primary" 
            ghost 
            @click="clearResults"
            size="small"
            v-motion
            :initial="{ x: 20, opacity: 0 }"
            :enter="{ x: 0, opacity: 1 }"
          >
            <i class="fas fa-trash-alt"></i> 清空
          </a-button>
        </div>
        
        <div 
          class="result-item" 
          v-for="(item, index) in uploadResult" 
          :key="item.name + index"
          v-motion
          :initial="{ x: 50, opacity: 0 }"
          :enter="{ x: 0, opacity: 1, transition: { delay: 100 * index } }"
        >
          <div class="file-preview">
            <div class="file-icon">
              <i :class="getFileIcon(item.name)"></i>
            </div>
          </div>
          <div class="file-info">
            <div class="file-name-row">
              <span class="file-name">{{ item.name }}</span>
              <a-tag :color="getStatusColor(item.status)">
                <i :class="getStatusIcon(item.status)"></i>
                {{ getStatusText(item.status) }}
              </a-tag>
            </div>
            <div class="file-details">
              <span class="file-size">
                <i class="fas fa-hdd"></i> {{ formatFileSize(item.size) }}
              </span>
              <span class="file-date">
                <i class="fas fa-calendar-alt"></i> {{ getCurrentDate() }}
              </span>
              <a-button 
                v-if="item.status === 'done'" 
                type="link" 
                size="small"
                class="file-action"
              >
                <i class="fas fa-download"></i> 下载
              </a-button>
              <a-button 
                v-if="item.status === 'done'" 
                type="link" 
                size="small"
                class="file-action"
              >
                <i class="fas fa-share-alt"></i> 分享
              </a-button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, computed ,h } from 'vue';
import { message } from 'ant-design-vue';
import type { UploadChangeParam } from 'ant-design-vue';

type FileStatus = 'uploading' | 'done' | 'error';

interface UploadResult {
  name: string;
  size: number;
  status: FileStatus;
  url?: string;
  type?: string;
}

// 文件类型选项
const fileTypes = [
  { label: '全部', value: 'all', icon: 'fas fa-folder-open' },
  { label: '文档', value: 'document', icon: 'fas fa-file-alt' },
  { label: '图片', value: 'image', icon: 'fas fa-image' },
  { label: '音频', value: 'audio', icon: 'fas fa-music' },
  { label: '视频', value: 'video', icon: 'fas fa-video' },
  { label: '压缩包', value: 'archive', icon: 'fas fa-file-archive' }
];

// 支持的文件扩展名
const supportedExtensions = [
  'PDF', 'DOC', 'DOCX', 'XLS', 'XLSX', 'PPT',
  'JPG', 'PNG', 'GIF', 'MP3', 'MP4', 'ZIP'
];

const fileList = ref<any[]>([]);
const uploading = ref(false);
const uploadPercent = ref(0);
const uploadStatus = ref<'active' | 'exception' | 'normal' | 'success'>('active');
const uploadStatusText = ref('准备上传');
const uploadedSize = ref('0B');
const totalSize = ref('0B');
const uploadResult = ref<UploadResult[]>([]);
const selectedFileType = ref('all');
const uploadedFiles = ref(0);

// 计算状态图标
const uploadStatusIcon = computed(() => {
  if (uploadStatus.value === 'success') return 'fas fa-check-circle';
  if (uploadStatus.value === 'exception') return 'fas fa-exclamation-circle';
  return 'fas fa-spinner fa-spin';
});

// 上传前校验
const beforeUpload = (file: File) => {
  // 重置进度
  uploadPercent.value = 0;
  
  // 文件大小验证
  const isLt10M = file.size / 1024 / 1024 < 10;
  if (!isLt10M) {
    message.error({
      content: '文件大小不能超过10MB!',
      icon: () => h('i', { class: 'fas fa-exclamation-circle' })
    });
    return false;
  }
  
  // 计算总文件大小
  totalSize.value = formatFileSize(file.size);
  return true;
};

// 处理上传变化
const handleChange = (info: UploadChangeParam) => {
  if (info.file.status === 'uploading') {
    uploading.value = true;
    uploadStatusText.value = '上传中...';
    uploadedFiles.value = info.fileList.length;
    
    // 模拟上传进度
    let speed = Math.random() * 5 + 3; // 随机速度，更真实
    const interval = setInterval(() => {
      // 进度变化更自然
      if (uploadPercent.value < 30) {
        uploadPercent.value += speed;
      } else if (uploadPercent.value < 70) {
        uploadPercent.value += speed / 1.5;
      } else if (uploadPercent.value < 90) {
        uploadPercent.value += speed / 3;
      } else {
        uploadPercent.value += speed / 5;
      }
      
      // 更新已上传大小
      if (info.file.size) {
        uploadedSize.value = formatFileSize(info.file.size * (uploadPercent.value / 100));
      }
      
      if (uploadPercent.value >= 100) {
        clearInterval(interval);
        uploadStatus.value = 'success';
        uploadStatusText.value = '上传完成';
        uploadPercent.value = 100;
        
        // 延迟关闭进度条，更自然
        setTimeout(() => {
          uploading.value = false;
          
          // 添加上传结果
          uploadResult.value.unshift({
            name: info.file.name,
            size: info.file.size || 0,
            status: 'done',
            url: '#',
            type: getFileType(info.file.name)
          });
          
          message.success({
            content: '文件上传成功!',
            icon: () => h('i', { class: 'fas fa-check-circle' })
          });
        }, 800);
      }
    }, 200);
  } else if (info.file.status === 'error') {
    uploadStatus.value = 'exception';
    uploadStatusText.value = '上传失败';
    
    message.error({
      content: '文件上传失败，请重试!',
      icon: () => h('i', { class: 'fas fa-times-circle' })
    });
    
    // 添加失败结果
    uploadResult.value.unshift({
      name: info.file.name,
      size: info.file.size || 0,
      status: 'error'
    });
  }
};

// 获取文件类型
const getFileType = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  if (['pdf', 'doc', 'docx', 'txt', 'ppt', 'pptx', 'xls', 'xlsx'].includes(ext || '')) {
    return 'document';
  }
  if (['jpg', 'jpeg', 'png', 'gif', 'bmp', 'svg'].includes(ext || '')) {
    return 'image';
  }
  if (['mp3', 'wav', 'ogg', 'flac'].includes(ext || '')) {
    return 'audio';
  }
  if (['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv'].includes(ext || '')) {
    return 'video';
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext || '')) {
    return 'archive';
  }
  return 'other';
};

// 获取文件图标
const getFileIcon = (fileName: string) => {
  const ext = fileName.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'pdf': return 'fas fa-file-pdf';
    case 'doc': case 'docx': return 'fas fa-file-word';
    case 'xls': case 'xlsx': return 'fas fa-file-excel';
    case 'ppt': case 'pptx': return 'fas fa-file-powerpoint';
    case 'zip': case 'rar': case '7z': return 'fas fa-file-archive';
    case 'jpg': case 'jpeg': case 'png': case 'gif': return 'fas fa-file-image';
    case 'mp3': case 'wav': case 'ogg': return 'fas fa-file-audio';
    case 'mp4': case 'avi': case 'mov': case 'mkv': return 'fas fa-file-video';
    case 'txt': return 'fas fa-file-alt';
    default: return 'fas fa-file';
  }
};

// 获取状态图标
const getStatusIcon = (status: FileStatus) => {
  switch (status) {
    case 'done': return 'fas fa-check-circle';
    case 'error': return 'fas fa-times-circle';
    default: return 'fas fa-spinner fa-spin';
  }
};

// 获取状态文本
const getStatusText = (status: FileStatus) => {
  switch (status) {
    case 'done': return '上传成功';
    case 'error': return '上传失败';
    default: return '上传中';
  }
};

// 获取状态颜色
const getStatusColor = (status: FileStatus) => {
  switch (status) {
    case 'done': return 'success';
    case 'error': return 'error';
    default: return 'processing';
  }
};

// 格式化文件大小
const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + sizes[i];
};

// 获取当前日期
const getCurrentDate = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

// 清空结果
const clearResults = () => {
  uploadResult.value = [];
};
</script>

<style lang="less" scoped>
.resource-upload-container {
  padding: 24px;
  max-width: 900px;
  margin: 0 auto;
  
  .upload-header {
    margin-bottom: 32px;
    text-align: center;
    
    h2 {
      font-size: 28px;
      margin-bottom: 10px;
      color: #2c3e50;
      font-weight: 700;
      letter-spacing: 0.5px;
      display: inline-flex;
      align-items: center;
      
      i {
        margin-right: 12px;
        color: #3498db;
        font-size: 32px;
      }
    }
    
    p {
      color: #7f8c8d;
      font-size: 16px;
      letter-spacing: 0.3px;
    }
  }
  
  .upload-main {
    background: #fff;
    border-radius: 16px;
    padding: 30px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1);
    
    &:hover {
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.15);
    }
    
    // 文件类型选择区
    .file-type-selector {
      margin-bottom: 24px;
      
      .type-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 12px;
        color: #2c3e50;
      }
      
      .type-options {
        display: flex;
        flex-wrap: wrap;
        gap: 12px;
        
        .type-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 90px;
          height: 90px;
          border-radius: 16px;
          background: #f8f9fa;
          cursor: pointer;
          transition: all 0.3s ease;
          
          i {
            font-size: 24px;
            margin-bottom: 8px;
            color: #7f8c8d;
            transition: all 0.3s ease;
          }
          
          span {
            font-size: 14px;
            color: #7f8c8d;
            transition: all 0.3s ease;
          }
          
          &:hover {
            background: #e6f7ff;
            transform: translateY(-5px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.08);
            
            i, span {
              color: #1a73e8;
            }
          }
          
          &.active {
            background: #1a73e8;
            box-shadow: 0 5px 15px rgba(26, 115, 232, 0.2);
            transform: translateY(-5px);
            
            i, span {
              color: white;
            }
          }
        }
      }
    }
  }
  
  .upload-area {
    margin-top: 24px;
    padding: 48px 0;
    border: 3px dashed #e0e0e0;
    border-radius: 16px;
    background: #f8f9fa;
    background-image: radial-gradient(circle, #f0f0f0 1px, transparent 1px);
    background-size: 20px 20px;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      border-color: #1a73e8;
      background-color: #f0f7ff;
      transform: translateY(-5px);
      box-shadow: 0 10px 25px rgba(26, 115, 232, 0.15);
      
      .upload-icon-container i {
        transform: scale(1.1) translateY(-5px);
        color: #1a73e8;
      }
    }
    
    &:active {
      transform: translateY(0);
      box-shadow: 0 5px 15px rgba(26, 115, 232, 0.1);
    }
    
    .upload-content {
      text-align: center;
      
      .upload-icon-container {
        margin-bottom: 16px;
        
        i {
          font-size: 60px;
          color: #3498db;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      }
      
      .upload-text {
        font-size: 18px;
        margin-bottom: 8px;
        font-weight: 600;
        color: #2c3e50;
      }
      
      .upload-hint {
        color: #7f8c8d;
        font-size: 14px;
        margin-bottom: 16px;
      }
      
      .supported-types {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 8px;
        max-width: 80%;
        margin: 0 auto;
        
        .ext-tag {
          background: rgba(52, 152, 219, 0.1);
          border-radius: 12px;
          padding: 4px 10px;
          font-size: 12px;
          color: #3498db;
          display: inline-flex;
          align-items: center;
          
          i {
            font-size: 10px;
            margin-right: 4px;
          }
        }
      }
    }
  }
  
  .upload-progress {
    margin-top: 32px;
    padding: 20px;
    border-radius: 12px;
    background: #f8f9fa;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    
    .progress-status {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
      
      i {
        font-size: 18px;
        margin-right: 8px;
        color: #3498db;
      }
      
      span {
        font-size: 16px;
        font-weight: 500;
        color: #2c3e50;
      }
    }
    
    .progress-info {
      display: flex;
      justify-content: space-between;
      margin-top: 12px;
      color: #7f8c8d;
      font-size: 14px;
    }
  }
  
  .upload-result {
    margin-top: 32px;
    
    .result-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
      
      h3 {
        font-size: 20px;
        color: #2c3e50;
        font-weight: 600;
        display: flex;
        align-items: center;
        
        i {
          margin-right: 8px;
          color: #3498db;
        }
      }
    }
    
    .result-item {
      display: flex;
      margin: 16px 0;
      padding: 16px;
      border-radius: 12px;
      background: #f8f9fa;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
      transition: all 0.3s ease;
      
      &:hover {
        background: #f0f7ff;
        transform: translateY(-5px) translateX(5px);
        box-shadow: 0 8px 20px rgba(26, 115, 232, 0.12);
      }
      
      .file-preview {
        margin-right: 20px;
        
        .file-icon {
          width: 60px;
          height: 60px;
          border-radius: 12px;
          background: white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
          
          i {
            font-size: 28px;
            color: #3498db;
          }
        }
      }
      
      .file-info {
        flex: 1;
        
        .file-name-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 10px;
          
          .file-name {
            font-size: 16px;
            font-weight: 500;
            color: #2c3e50;
            max-width: 400px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        }
        
        .file-details {
          display: flex;
          flex-wrap: wrap;
          gap: 16px;
          color: #7f8c8d;
          font-size: 14px;
          
          span {
            display: flex;
            align-items: center;
            
            i {
              margin-right: 6px;
              font-size: 14px;
            }
          }
          
          .file-action {
            margin-left: auto;
            transition: all 0.2s ease;
            
            &:hover {
              transform: translateY(-2px);
            }
          }
        }
      }
    }
  }
}

// 列表动画
.list-enter-active,
.list-leave-active {
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

@media (max-width: 768px) {
  .resource-upload-container {
    padding: 16px;
    
    .upload-main {
      padding: 20px;
    }
    
    .upload-area {
      padding: 30px 0;
    }
    
    .file-type-selector {
      .type-options {
        gap: 8px;
        
        .type-option {
          width: 70px;
          height: 70px;
        }
      }
    }
    
    .result-item {
      flex-direction: column;
      
      .file-preview {
        margin-right: 0;
        margin-bottom: 16px;
      }
      
      .file-info {
        .file-name-row {
          flex-direction: column;
          align-items: flex-start;
          
          .file-name {
            margin-bottom: 8px;
            max-width: 100%;
          }
        }
        
        .file-details {
          flex-direction: column;
          gap: 8px;
        }
      }
    }
  }
}
</style>
