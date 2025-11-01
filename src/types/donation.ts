/**
 * 捐赠相关类型定义
 */

/**
 * 捐赠渠道枚举
 */
export enum DonationChannel {
  WECHAT = 'wechat',      // 微信支付
  ALIPAY = 'alipay',      // 支付宝
  CRYPTO = 'crypto',      // 加密货币
  CARDKEY = 'cardkey'     // 卡密兑换
}

/**
 * 捐赠状态枚举
 */
export enum DonationStatus {
  PENDING = 0,      // 待确认
  CONFIRMED = 1,    // 已确认
  COMPLETED = 2,    // 已完成
  CANCELLED = 3     // 已取消
}

/**
 * 加密货币类型
 */
export type CryptoType = 'USDT' | 'BTC' | 'ETH' | 'TRX'

/**
 * 加密货币网络
 */
export type CryptoNetwork = 'TRC20' | 'ERC20' | 'BEP20' | 'OMNI'

/**
 * 捐赠表单数据接口
 */
export interface DonationFormData {
  channel: DonationChannel                // 捐赠渠道
  donor_name?: string                     // 捐赠者姓名
  email?: string                          // 邮箱
  iden?: string                           // 唯一标识符
  amount?: number                         // 金额
  order_no?: string                       // 订单号（微信/支付宝）
  crypto_type?: CryptoType                // 加密货币类型
  crypto_network?: CryptoNetwork          // 加密货币网络
  transaction_hash?: string               // 交易哈希（加密货币）
  card_key_code?: string                  // 卡密码
  is_anonymous?: 0 | 1                    // 是否匿名 (0=否, 1=是)
  is_public?: 0 | 1                       // 是否公开 (0=否, 1=是)
  show_in_list?: 0 | 1                    // 是否显示在榜单 (0=否, 1=是)
  remark?: string                         // 备注
  message?: string                        // 留言
}

/**
 * 捐赠记录接口
 */
export interface DonationRecord {
  id: number                              // 记录ID
  donation_no: string                     // 捐赠编号
  donor_name: string                      // 捐赠者姓名
  email?: string                          // 邮箱
  amount: number                          // 金额
  channel: DonationChannel                // 捐赠渠道
  channel_text: string                    // 渠道文本
  status: DonationStatus                  // 状态
  status_text: string                     // 状态文本
  card_key_value?: number                 // 卡密价值
  card_key_code?: string                  // 卡密码（脱敏）
  create_time: string                     // 创建时间
  is_anonymous: 0 | 1                     // 是否匿名
  is_public: 0 | 1                        // 是否公开
  remark?: string                         // 备注
}

/**
 * 添加捐赠响应数据
 */
export interface AddDonationResponseData {
  id: number                              // 记录ID
  donation_no: string                     // 捐赠编号
  card_key_value?: number                 // 卡密价值
  status: DonationStatus                  // 状态
}

/**
 * API 响应接口
 */
export interface DonationResponse<T = any> {
  code: number                            // 状态码
  message: string                         // 消息
  data: T                                 // 数据
}

/**
 * 渠道配置接口
 */
export interface ChannelConfig {
  key: DonationChannel                    // 渠道key
  label: string                           // 渠道名称
  icon: string                            // 图标
  color: string                           // 主题色
  description: string                     // 描述
}

/**
 * 庆祝弹窗详情项接口
 */
export interface CelebrationDetail {
  label: string                           // 标签
  value: string                           // 值
  icon?: string                           // 图标
}

/**
 * 庆祝弹窗操作按钮接口
 */
export interface CelebrationAction {
  text: string                            // 按钮文本
  type?: 'primary' | 'default'            // 按钮类型
  icon?: string                           // 图标
  handler: () => void                     // 点击处理函数
}

