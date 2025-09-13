import Axios from './index'

// 双Token登录接口
export interface LoginRequest {
  user_id: string
}

export interface RefreshTokenRequest {
  refresh_token: string
  user_id: string
}

export interface DeviceHeaders {
  'X-Fingerprint': string
  'X-Platform': string
  'X-Device-Id': string // 保留用于兼容性，但后端不再验证
}

// 双Token登录
export const dualTokenLogin = async (
  data: LoginRequest,
  headers: DeviceHeaders
): Promise<any> => {
  // 临时设置设备头信息到默认headers
  const originalHeaders = { ...Axios.defaults.headers.common }

  // 设置设备头信息
  Axios.defaults.headers.common['X-Fingerprint'] = headers['X-Fingerprint']
  Axios.defaults.headers.common['X-Platform'] = headers['X-Platform']
  Axios.defaults.headers.common['X-Device-Id'] = headers['X-Device-Id']

  try {
    const response = await Axios.post('/api/v2/user/login', data)
    return response as any // 你的axios已经返回了response.data
  } finally {
    // 恢复原始头信息
    Axios.defaults.headers.common = originalHeaders
  }
}

// 刷新Token
export const refreshToken = async (
  data: RefreshTokenRequest,
  headers: DeviceHeaders
): Promise<any> => {
  // 临时设置设备头信息到默认headers
  const originalHeaders = { ...Axios.defaults.headers.common }

  // 设置设备头信息
  Axios.defaults.headers.common['X-Fingerprint'] = headers['X-Fingerprint']
  Axios.defaults.headers.common['X-Platform'] = headers['X-Platform']
  Axios.defaults.headers.common['X-Device-Id'] = headers['X-Device-Id']

  try {
    const response = await Axios.post('/api/v2/user/refreshToken', data)
    return response as any // 你的axios已经返回了response.data
  } finally {
    // 恢复原始头信息
    Axios.defaults.headers.common = originalHeaders
  }
}

// 测试受保护的API
export const testProtectedApi = async (
  accessToken: string,
  refreshToken: string,
  headers: DeviceHeaders
): Promise<any> => {
  // 临时设置头信息
  const originalHeaders = { ...Axios.defaults.headers.common }

  // 设置所有需要的头信息
  Axios.defaults.headers.common['X-Fingerprint'] = headers['X-Fingerprint']
  Axios.defaults.headers.common['X-Platform'] = headers['X-Platform']
  Axios.defaults.headers.common['X-Device-Id'] = headers['X-Device-Id']
  Axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  Axios.defaults.headers.common['refreshToken'] = refreshToken

  try {
    const response = await Axios.get('/api/v2/user/info')
    return response as any // 你的axios已经返回了response.data
  } finally {
    // 恢复原始头信息
    Axios.defaults.headers.common = originalHeaders
  }
}

// 安全登出
export const logoutApi = async (
  userId: string,
  refreshToken: string,
  headers: DeviceHeaders
): Promise<any> => {
  // 临时设置头信息
  const originalHeaders = { ...Axios.defaults.headers.common }

  // 设置登出需要的头信息
  Axios.defaults.headers.common['X-Platform'] = headers['X-Platform']
  Axios.defaults.headers.common['refreshToken'] = refreshToken

  try {
    const response = await Axios.post('/api/v2/user/logout', {
      user_id: userId,
      refresh_token: refreshToken
    })
    return response as any
  } finally {
    // 恢复原始头信息
    Axios.defaults.headers.common = originalHeaders
  }
}

// 强制失效用户Token（管理员功能）
export const forceLogoutUserApi = async (
  targetUserId: string,
  platform?: string
): Promise<any> => {
  const response = await Axios.post('/api/v2/user/forceLogoutUser', {
    target_user_id: targetUserId,
    platform: platform
  })
  return response as any
}

// 测试token读取
export const testTokenApi = async (
  accessToken: string,
  refreshToken: string,
  headers: DeviceHeaders
): Promise<any> => {
  // 临时设置头信息
  const originalHeaders = { ...Axios.defaults.headers.common }

  // 设置所有需要的头信息
  Axios.defaults.headers.common['X-Fingerprint'] = headers['X-Fingerprint']
  Axios.defaults.headers.common['X-Platform'] = headers['X-Platform']
  Axios.defaults.headers.common['X-Device-Id'] = headers['X-Device-Id']
  Axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
  Axios.defaults.headers.common['refreshToken'] = refreshToken

  try {
    const response = await Axios.get('/api/v2/user/testToken')
    return response as any
  } finally {
    // 恢复原始头信息
    Axios.defaults.headers.common = originalHeaders
  }
}

// 生成设备信息
export const generateDeviceInfo = (): DeviceHeaders => {
  return {
    'X-Fingerprint': 'fp_' + Math.random().toString(36).substring(2, 18),
    'X-Platform': 'Web',
    'X-Device-Id': 'web-' + Math.random().toString(36).substring(2, 14) // 兼容性保留
  }
}

// Token存储工具
export class TokenStorage {
  private static ACCESS_TOKEN_KEY = 'dual_access_token'
  private static REFRESH_TOKEN_KEY = 'dual_refresh_token'
  private static DEVICE_INFO_KEY = 'dual_device_info'

  // 保存tokens
  static saveTokens(accessToken: string, refreshToken: string, deviceInfo: DeviceHeaders) {
    localStorage.setItem(this.ACCESS_TOKEN_KEY, accessToken)
    localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken)
    localStorage.setItem(this.DEVICE_INFO_KEY, JSON.stringify(deviceInfo))
  }

  // 获取access token
  static getAccessToken(): string | null {
    return localStorage.getItem(this.ACCESS_TOKEN_KEY)
  }

  // 获取refresh token
  static getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY)
  }

  // 获取设备信息
  static getDeviceInfo(): DeviceHeaders | null {
    const deviceInfo = localStorage.getItem(this.DEVICE_INFO_KEY)
    return deviceInfo ? JSON.parse(deviceInfo) : null
  }

  // 清除tokens
  static clearTokens() {
    localStorage.removeItem(this.ACCESS_TOKEN_KEY)
    localStorage.removeItem(this.REFRESH_TOKEN_KEY)
    localStorage.removeItem(this.DEVICE_INFO_KEY)
  }

  // 检查token是否存在
  static hasTokens(): boolean {
    return !!(this.getAccessToken() && this.getRefreshToken())
  }
}
