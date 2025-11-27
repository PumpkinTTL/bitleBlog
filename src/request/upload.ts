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