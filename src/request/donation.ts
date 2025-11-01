/**
 * 捐赠相关 API 请求
 */

import Axios from './index'
import type { 
  DonationFormData, 
  DonationResponse, 
  AddDonationResponseData,
  DonationRecord 
} from '@/types/donation'

/**
 * 添加捐赠记录
 * @param data 捐赠表单数据
 * @returns Promise<DonationResponse<AddDonationResponseData>>
 */
export const addDonationR = (data: DonationFormData) => {
  return Axios({
    method: 'POST',
    url: '/api/v1/donation/add',
    data
  }) as Promise<DonationResponse<AddDonationResponseData>>
}

/**
 * 查询我的捐赠记录
 * @param params 查询参数 { email?, iden?, user_id? }
 * @returns Promise<DonationResponse<DonationRecord[]>>
 */
export const queryDonationR = (params: {
  email?: string
  iden?: string
  user_id?: number
}) => {
  return Axios({
    method: 'GET',
    url: '/api/v1/donation/query',
    params
  }) as Promise<DonationResponse<DonationRecord[]>>
}

/**
 * 获取捐赠详情
 * @param id 捐赠记录ID
 * @returns Promise<DonationResponse<DonationRecord>>
 */
export const getDonationDetailR = (id: number) => {
  return Axios({
    method: 'GET',
    url: '/api/v1/donation/detail',
    params: { id }
  }) as Promise<DonationResponse<DonationRecord>>
}

