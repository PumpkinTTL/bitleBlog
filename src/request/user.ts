
import Axios from ".";
import { clearUserInfo } from "@/util/Auth";
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

// 请求密码重置（发送重置邮件）
export const requestPasswordResetR = (params: { email: string }) => {
    return Axios({
        method: 'POST',
        url: '/api/v1/user/requestPasswordReset',
        data: params
    })
}

// 验证重置Token是否有效
export const verifyResetTokenR = (params: { token: string }) => {
    return Axios({
        method: 'POST',
        url: '/api/v1/user/verifyResetToken',
        data: params
    })
}

// 重置密码
export const resetPasswordR = (params: { token: string; new_password: string }) => {
    return Axios({
        method: 'POST',
        url: '/api/v1/user/resetPassword',
        data: params
    })
}
