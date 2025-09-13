import Axios from ".";

// 查询所有类别
export const selectTypeAllR = (params: any) => {
    return Axios({
        method:'GET',
        url: '/api/v1/Type/selectTypeAll',
        params
    })
}
// 根据id查询用户信息
export const selectUserInfoByIdR = (params: any) => {
    return Axios({
        method:'POST',
        url: '/api/v1/Type/selectUserInfoById',
        data: params
    })
}