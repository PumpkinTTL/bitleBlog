import Axios from ".";


// 根据文章id查询评论列表
export const getCommentsByArticleIdR = (articleId: number) => {
    return Axios({
        method: 'GET',
        url: `/api/v1/comment/getCommentsByArticleId`,
        params: { articleId }
    })
}
