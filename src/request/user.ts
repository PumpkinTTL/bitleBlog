
import Axios from ".";
import { clearUserInfo } from "@/util/Auth";
// 用户登录
export const loginR = (params: any) => {
    // 根据action决定请求方式：验证码登录使用POST，密码登录使用GET
    const isCodeLogin = params.action === 'code'

    if (isCodeLogin) {
        // 验证码登录使用POST，参数放在data中
        return Axios({
            method: 'POST',
            url:'/api/v1/user/login',
            data: params
        })
    } else {
        // 密码登录使用GET，参数放在params中
        return Axios({
            method: 'GET',
            url:'/api/v1/user/login',
            params: params
        })
    }
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

// 发送邮箱验证码
export const sendEmailCodeR = (params: { email: string }) => {
    return Axios({
        method: 'POST',
        url: '/api/v1/user/sendEmailCode',
        data: params
    })
}

// ==================== V2版本API接口 ====================

// 1. 获取当前用户信息
export const getUserProfileR = () => {
    return Axios({
        method: 'GET',
        url: '/api/v2/user/profile'
    })
}

// 2. 更新用户资料
export const updateUserProfileR = (params: {
    nickname?: string;
    gender?: number;
    signature?: string;
    avatar?: string;
}) => {
    return Axios({
        method: 'POST',
        url: '/api/v2/user/update',
        data: params
    })
}

// 3. 检查用户名是否可用
export const checkUsernameR = (params: { username: string }) => {
    return Axios({
        method: 'POST',
        url: '/api/v2/user/checkUsername',
        data: params
    })
}

// 4. 检查邮箱是否可用
export const checkEmailR = (params: { email: string }) => {
    return Axios({
        method: 'POST',
        url: '/api/v2/user/checkEmail',
        data: params
    })
}

// 5. 获取会员状态
export const getUserMembershipR = () => {
    return Axios({
        method: 'GET',
        url: '/api/v2/user/membership'
    })
}

// 6. 退出登录
export const logoutV2R = () => {
    return Axios({
        method: 'POST',
        url: '/api/v2/user/logout'
    })
}

// 7. 注销账号
export const deleteUserAccountR = (params: {
    password: string;
    confirmation: string;
}) => {
    return Axios({
        method: 'POST',
        url: '/api/v2/user/delete',
        data: params
    })
}
