
import Axios from ".";
import { useStore } from "@/store";
import { clearUserInfo } from "@/util/Auth";
const store = useStore()
// 用户登录
export const loginR = (params: any) => {
    return Axios({
        method:'GET',
        url:'/api/v1/user/login',
        params
    })
}
// 根据id查询用户信息
export const selectUserInfoByIdR = (params: any) => {
    return Axios({
        method:'POST',
        url: '/api/v1/user/selectUserInfoById',
        params
    })
}

// 检测登录状态
export const checkUserLoginR = async (targetUid: any) => {
    return Axios({
        method: 'POST',
        url: '/api/v1/user/selectUserInfoById',
        params: {
            targetUid
        }
    })
}

// 退出登录清楚本地信息
export const logoutR = () => {
    return Axios({
        method: 'PUT',
        url: '/api/v1/user/outLogin',
       
    })
}
