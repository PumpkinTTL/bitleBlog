import Axios from '.';

// 上传配置参数
interface UploadOptions {
  user_id?: number;
  storage_type?: number; // 0-本地，1-阿里云OSS，2-七牛云，3-腾讯云COS
  bucket_name?: string;
  device_fingerprint?: string;
  remark?: string;
}

// 上传单个文件 - 基础方法
export const uploadSingleFileR = (file: File, options?: UploadOptions) => {
  const formData = new FormData();
  formData.append('file', file);

  // 添加可选参数
  if (options) {
    if (options.user_id) formData.append('user_id', options.user_id.toString());
    if (options.storage_type !== undefined) formData.append('storage_type', options.storage_type.toString());
    if (options.bucket_name) formData.append('bucket_name', options.bucket_name);
    if (options.device_fingerprint) formData.append('device_fingerprint', options.device_fingerprint);
    if (options.remark) formData.append('remark', options.remark);
  }

  return Axios({
    url: '/api/v1/upload/uploadFile',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 上传用户头像 - 封装方法
export const uploadUserAvatarR = (file: File, userId?: number) => {
  // 验证文件类型和大小
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/bmp', 'image/svg'];
  const maxSize = 8 * 1024 * 1024; // 8MB（根据文档限制）

  if (!validTypes.includes(file.type)) {
    return Promise.reject(new Error('请选择JPG/PNG/GIF等格式的图片文件'));
  }

  if (file.size > maxSize) {
    return Promise.reject(new Error('图片大小不能超过8MB'));
  }

  // 调用基础上传方法，添加头像特定的配置
  return uploadSingleFileR(file, {
    user_id: userId,
    storage_type: 0, // 默认本地存储
    remark: '用户头像上传'
  });
};

// 上传多个文件
export const uploadMultipleFilesR = (files: File[]) => {
  const formData = new FormData();
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file);
  });
  
  return Axios({
    url: '/api/v1/upload/uploadFiles',
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

// 检查上传API状态
export const checkUploadStatusR = () => {
  return Axios({
    url: '/api//v1/upload/status',
    method: 'GET',
  });
}; 