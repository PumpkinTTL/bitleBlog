import axios from 'axios';

// 创建一个axios实例，专门用于与Python Flask后端通信
const pythonApi = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器
pythonApi.interceptors.request.use(
  (config) => {
    // 可以在这里添加认证信息等
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 响应拦截器
pythonApi.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API请求错误:', error);
    return Promise.reject(error);
  }
);

// API方法
export default {
  // 测试连接
  getHello() {
    return pythonApi.get('/hello');
  },
  
  // 发送数据到Python后端
  sendData(data: any) {
    return pythonApi.post('/data', data);
  },

  // 发送问题到星火API
  askSpark(question: string) {
    return pythonApi.post('/spark/chat', { question });
  }
};