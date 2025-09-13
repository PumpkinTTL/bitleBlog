import Axios from ".";

// 获取分类列表
export const getCategoryListR = (params: any) => {
    return Axios({
        method: 'GET',
        url: '/api/v1/category/selectCategoryAll',
        params
    })
}
