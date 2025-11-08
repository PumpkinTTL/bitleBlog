 // http/index.js
import axios from "axios";
import { message } from 'ant-design-vue';
import { getToken } from "@/util/Auth";
import { tokenManager } from "@/util/tokenManager";
import { isWhitelisted, requiresAuth } from "@/config/requestConfig";
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

Axios.interceptors.request.use(
    async (config) => {
        // 配置请求头信息
        config.headers.appid = 202410051
        
        // 检查是否是白名单接口（使用配置文件）
        const isWhiteListed = isWhitelisted(config.url || '');
        
        if (!isWhiteListed) {
            // 检查是否是必须登录的接口（使用配置文件）
            const needsAuth = requiresAuth(config.url || '');
            
            // 尝试获取Token
            const tokenData = getToken();
            
            if (tokenData?.token) {
                // 有Token，检查并续签
                try {
                    const isTokenValid = await tokenManager.checkAndRefreshToken();
                    if (!isTokenValid) {
                        console.warn('[Request] Token已过期');
                        // 如果是必须登录的接口，阻止请求
                        if (needsAuth) {
                            return Promise.reject(new Error('Token invalid, login required'));
                        }
                        // 否则继续请求（公开接口）
                    } else {
                        // Token有效，添加到请求头
                        config.headers.Authorization = `Bearer ${tokenData.token}`;
                        console.log('[Request] 发送请求，Token:', tokenData.token.substring(0, 20) + '...');
                    }
                } catch (error) {
                    console.error('[Request] Token检查失败:', error);
                    // 如果是必须登录的接口，阻止请求
                    if (needsAuth) {
                        return Promise.reject(error);
                    }
                    // 否则继续请求（公开接口）
                }
            } else {
                // 没有Token
                if (needsAuth) {
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
            
            // 清除登录状态 - 异步处理避免阻塞
            Promise.all([
                import('@/util/Auth'),
                import('@/store')
            ]).then(([{ removeToken }, { useStore }]) => {
                removeToken();
                try {
                    const store = useStore();
                    store.$patch((state: any) => {
                        state.isLogin = false;
                        state.userInfo = null;
                    });
                    console.log('[Response] TOKEN_ERROR - 已清除登录状态');
                } catch (err) {
                    console.error('[Response] 更新store失败:', err);
                }
            }).catch(error => {
                console.error('[Response] 清除登录状态失败:', error);
            });
            
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
                    
                    // 清除登录状态 - 异步处理避免阻塞
                    Promise.all([
                        import('@/util/Auth'),
                        import('@/store')
                    ]).then(([{ removeToken }, { useStore }]) => {
                        removeToken();
                        try {
                            const store = useStore();
                            store.$patch((state: any) => {
                                state.isLogin = false;
                                state.userInfo = null;
                            });
                            console.log('[Response] 401 - 已清除登录状态');
                        } catch (err) {
                            console.error('[Response] 更新store失败:', err);
                        }
                    }).catch(error => {
                        console.error('[Response] 清除登录状态失败:', error);
                    });
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
