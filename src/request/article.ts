import Axios from ".";

// 获取文章列表
export const getArticleListR = (params: any) => {
    return Axios({
        method: 'GET',
        url: '/api/v1/article/getArticleList',
        params
    })
}

// 根据id查询文章详情
export const getArticleDetailR = (id: number) => {
    return Axios({
        method: 'GET',
        url: `/api/v1/article/selectArticleById`,
        params:{id}
    })
}

// 添加文章add
export const addArticleR = (data: any) => {
    return Axios({
        method: 'POST',
        url: '/api/v1/article/add',
        data
    })
}
