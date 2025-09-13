import request from '@/request/index'

// 发送测试邮件接口
export const sendTestEmail = (data: {
  to: string
  subject: string
  content: string
}) => {
  return request({
    url: '/api/email/test',
    method: 'post',
    data
  })
}

// 邮箱格式验证接口
export const validateEmail = (email: string) => {
  return request({
    url: '/api/email/validate',
    method: 'post',
    data: { email }
  })
}

// 获取邮件服务器配置状态
export const getEmailConfigStatus = () => {
  return request({
    url: '/api/email/config-status',
    method: 'get'
  })
}
