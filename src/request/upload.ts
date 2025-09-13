import Axios from '.';

// 上传单个文件
export const uploadSingleFileR = (file: File) => {
  const formData = new FormData();
  formData.append('file', file);
  
  return Axios({
    url: '/api//v1/upload/uploadFile',
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
    url: '/v1/upload/status',
    method: 'GET',
  });
}; 