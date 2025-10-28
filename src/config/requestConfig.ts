/**
 * 请求拦截器配置
 * 
 * 用于管理API接口的认证策略
 */

/**
 * 接口认证策略枚举
 */
export enum AuthStrategy {
  /** 公开接口 - 不需要Token */
  PUBLIC = 'PUBLIC',
  /** 可选认证 - 有Token则携带，没有也能访问 */
  OPTIONAL = 'OPTIONAL',
  /** 必须认证 - 必须有有效Token才能访问 */
  REQUIRED = 'REQUIRED'
}

/**
 * 白名单接口配置（不需要Token检查的接口）
 * 
 * 这些接口会跳过Token检查逻辑，直接放行
 */
export const whiteList: string[] = [
  // ============ 认证相关 ============
  '/api/v1/user/login',        // 用户登录
  '/api/v1/auth/refresh',      // Token续签
  '/api/v1/user/register',     // 用户注册（如果有）
  
  // ============ 公开接口 ============
  '/api/v1/article/getArticleList',      // 获取文章列表（公开）
  '/api/v1/article/selectArticleById',   // 获取文章详情（公开）
  '/api/v1/category/selectCategoryAll',  // 获取分类列表（公开）
  '/api/v1/tag/selectTagAll',            // 获取标签列表（公开）
  '/api/v1/comment/getCommentList',      // 获取评论列表（公开）
]

/**
 * 必须登录才能访问的接口模式
 * 
 * 使用字符串匹配，支持模糊匹配
 * 如果请求URL包含这些模式之一，则必须提供有效Token
 */
export const requireAuthPatterns: string[] = [
  // ============ 文章管理 ============
  '/api/v1/article/add',        // 发布文章
  '/api/v1/article/update',     // 更新文章
  '/api/v1/article/delete',     // 删除文章
  '/api/v1/article/like',       // 点赞文章
  '/api/v1/article/collect',    // 收藏文章
  
  // ============ 评论管理 ============
  '/api/v1/comment/add',        // 发表评论
  '/api/v1/comment/delete',     // 删除评论
  '/api/v1/comment/like',       // 点赞评论
  
  // ============ 用户管理 ============
  '/api/v1/user/update',        // 更新用户信息
  '/api/v1/user/updatePassword', // 修改密码
  '/api/v1/user/follow',        // 关注用户
  '/api/v1/user/unfollow',      // 取消关注
  
  // ============ 订单管理 ============
  '/api/v1/order/create',       // 创建订单
  '/api/v1/order/cancel',       // 取消订单
  '/api/v1/order/pay',          // 支付订单
]

/**
 * 检查接口是否在白名单中
 * @param url 请求URL
 * @returns 是否在白名单中
 */
export function isWhitelisted(url: string): boolean {
  return whiteList.some(pattern => url.includes(pattern))
}

/**
 * 检查接口是否需要强制认证
 * @param url 请求URL
 * @returns 是否需要强制认证
 */
export function requiresAuth(url: string): boolean {
  return requireAuthPatterns.some(pattern => url.includes(pattern))
}

/**
 * 获取接口的认证策略
 * @param url 请求URL
 * @returns 认证策略
 */
export function getAuthStrategy(url: string): AuthStrategy {
  // 白名单接口 - 公开访问
  if (isWhitelisted(url)) {
    return AuthStrategy.PUBLIC
  }
  
  // 强制认证接口
  if (requiresAuth(url)) {
    return AuthStrategy.REQUIRED
  }
  
  // 默认：可选认证（有Token就带上，没有也能访问）
  return AuthStrategy.OPTIONAL
}

/**
 * 请求拦截器配置导出
 */
export default {
  whiteList,
  requireAuthPatterns,
  AuthStrategy,
  isWhitelisted,
  requiresAuth,
  getAuthStrategy
}

