 // http/index.js
import axios from "axios";
import { message } from 'ant-design-vue';
import { getLocalStorage, removeCookie, setLocalStorage, clearUserInfo } from "@/util/Auth";
import { createPinia } from 'pinia';
import { useStore } from "@/store";
const pinia = createPinia();
const store = useStore(pinia);
//创建axios的一个实例
const Axios = axios.create({
    baseURL: "/api", //接口统一域名
    timeout: 6000, //设置超时
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
    (config) => {
        // 配置请求头信息
        config.headers.appid = 202410051
        const refreshToken = localStorage.getItem("refreshToken");
        const accessToken = localStorage.getItem("accessToken");
        refreshToken && (config.headers.refreshToken = refreshToken);
        accessToken && (config.headers.accessToken = accessToken);
        // console.log(config.params);
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
        // 对请求错误做些什么
       
);

//响应拦截器
Axios.interceptors.response.use(
    (response: { data: any }) => {
        // 登录过期时
        if (response.data.status === 'TOKEN_ERROR') {
            message.warning(response.data.msg)
            // 终止promise 链
            Promise.reject(response)
        }
        //响应成功
        // 删除loading()
        setTimeout(loading, 0)
        return response.data;
    },
    (error: { response: { status: any } }) => {
        console.log(error.response.status);
        //响应错误
        if (error.response && error.response.status) {
            const status = error.response.status;
            switch (status) {
                case 400:
                    messageHint = '请求错误'
                    break;
                case 401:
                    messageHint = "请求错误";
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
                    messageHint = "HTTP版本不受支持";
                    break;
                default:
                    messageHint = "请求失败";
            }
            setTimeout(loading, 0)
            message.error(messageHint)
            return Promise.reject(error);
        }
        setTimeout(loading, 0)
        return Promise.reject(error);
    }
);

export default Axios;
