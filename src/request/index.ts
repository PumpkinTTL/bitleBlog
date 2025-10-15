 // http/index.js
import axios from "axios";
import { message } from 'ant-design-vue';
import { getToken } from "@/util/Auth";
import { tokenManager } from "@/util/tokenManager";
import { createPinia } from 'pinia';
import { useStore } from "@/store";
const pinia = createPinia();
const store = useStore(pinia);
//创建axios的一个实例
const Axios = axios.create({
    baseURL: "/api", //接口统一域名
    timeout: 6000, //设置超时
    withCredentials: true, // 允许携带cookie
    headers: {
        "Content-Type": "application/json;charset=UTF-8;",
    },
});


//当前客户端的请求数量
let requestCount: number = 0;
let messageHint: any = undefined;
//请求拦截器
let loading: any = undefined;

// 白名单 - 不需要检查Token的接口（登录和续签）
const whiteList = ['/api/v1/user/login', '/api/v1/auth/refresh'];

// 必须登录才能访问的接口模式（可根据项目调整）
const requireAuthPatterns = [
    '/api/v1/article/add',
    '/api/v1/article/update',
    '/api/v1/article/delete',
    '/api/v1/user/update',
    '/api/v1/comment/add'
    // 添加其他需要登录的接口模式
];

Axios.interceptors.request.use(
    async (config) => {
        // 配置请求头信息
        config.headers.appid = 202410051
        
        // 检查是否是白名单接口（登录、续签）
        const isWhiteListed = whiteList.some(url => config.url?.includes(url));
        
        if (!isWhiteListed) {
            // 检查是否是必须登录的接口
            const requiresAuth = requireAuthPatterns.some(pattern => config.url?.includes(pattern));
            
            // 尝试获取Token
            const tokenData = getToken();
            
            if (tokenData?.token) {
                // 有Token，检查并续签
                try {
                    const isTokenValid = await tokenManager.checkAndRefreshToken();
                    if (!isTokenValid) {
                        console.warn('[Request] Token已过期');
                        // 如果是必须登录的接口，阻止请求
                        if (requiresAuth) {
                            return Promise.reject(new Error('Token invalid, login required'));
                        }
                        // 否则继续请求（公开接口）
                    } else {
                        // Token有效，添加到请求头
                        config.headers.Authorization = `Bearer ${tokenData.token}`;
                    }
                } catch (error) {
                    console.error('[Request] Token检查失败:', error);
                    // 如果是必须登录的接口，阻止请求
                    if (requiresAuth) {
                        return Promise.reject(error);
                    }
                    // 否则继续请求（公开接口）
                }
            } else {
                // 没有Token
                if (requiresAuth) {
                    // 必须登录的接口，阻止请求
                    console.warn('[Request] 访问受保护的接口需要登录');
                    return Promise.reject(new Error('Login required'));
                }
                // 公开接口，允许无Token访问
                console.info('[Request] 访问公开接口，无需Token');
            }
        }
        
        //若请求方式为post，则将data参数转为JSON字符串
        if (config.method === "POST") {
            config.data = JSON.stringify(config.data);
        }
        // loading条 
        // loading = message.loading('请稍后...', 0)
        return config;
    },
    (error: any) =>{
        Promise.reject(error)
    }
);

//响应拦截器
Axios.interceptors.response.use(
    (response: { data: any }) => {
        // 登录过期时
        if (response.data.status === 'TOKEN_ERROR') {
            message.warning(response.data.msg)
            // 终止promise 链
            return Promise.reject(response)
        }
        //响应成功
        // 删除loading()
        setTimeout(loading, 0)
        return response.data;
    },
    (error: any) => {
        //响应错误
        console.error('[Response Error]', error);
        
        // 检查是否有响应对象
        if (error.response && error.response.status) {
            const status = error.response.status;
            switch (status) {
                case 400:
                    messageHint = '请求错误'
                    break;
                case 401:
                    messageHint = "认证失败，请重新登录";
                    break;
                case 404:
                    messageHint = "请求地址出错";
                    break;
                case 408:
                    messageHint = "请求超时";
                    break;
                case 500:
                    messageHint = "服务器内部错误,请稍后重试!";
                    break;
                case 501:
                    messageHint = "服务未实现!";
                    break;
                case 502:
                    messageHint = "网关错误!";
                    break;
                case 503:
                    messageHint = "服务不可用!";
                    break;
                case 504:
                    messageHint = "网关超时!";
                    break;
                case 505:
                    messageHint = "HTTP版本不支持";
                    break;
                default:
                    messageHint = "请求失败";
            }
            setTimeout(loading, 0)
            message.error(messageHint)
        } else if (error.message) {
            // 没有response对象，可能是网络错误或请求被取消
            if (error.message === 'Token invalid, login required' || error.message === 'Login required') {
                // Token错误，不显示错误消息（tokenManager已处理）
                console.warn('[Response] 需要登录');
            } else {
                console.error('[Response] 请求错误:', error.message);
            }
            setTimeout(loading, 0)
        }
        
        return Promise.reject(error);
    }
);

export default Axios;
