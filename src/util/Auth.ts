import Cookies from "js-cookie";

// ==================== 新的单Token管理函数 ====================

/**
 * Token数据结构
 */
export interface TokenData {
  token: string;        // JWT Token
  expires: number;      // 过期时间戳（毫秒）
  id?: number;          // 用户ID
  username?: string;    // 用户名
  nickname?: string;    // 昵称
  avatar?: string;      // 头像
  email?: string;       // 邮箱
  roles?: string[];     // 角色标识符数组
  permissions?: string[]; // 权限数组
  [key: string]: any;   // 其他用户信息
}

/**
 * 获取Token数据（优先从Cookie读取，其次从localStorage）
 * @returns TokenData | null
 */
export const getToken = (): TokenData | null => {
  try {
    // 1. 尝试从Cookie读取（直接存的token字符串）
    const cookieToken = Cookies.get('Authorization');
    if (cookieToken) {
      // Cookie中直接存的是token字符串，需要从localStorage获取完整信息
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const fullData = JSON.parse(userInfo);
        // 合并Cookie中的token和localStorage中的用户信息
        return {
          ...fullData,
          token: cookieToken  // 直接使用Cookie中的token字符串
        };
      }
      // 如果没有userInfo，只返回token
      return { token: cookieToken, expires: 0 };
    }

    // 2. Cookie不存在，尝试从localStorage读取
    const localToken = localStorage.getItem('userInfo');
    if (localToken) {
      const tokenData = JSON.parse(localToken);
      if (tokenData?.token && tokenData?.expires) {
        return tokenData;
      }
    }

    return null;
  } catch (error) {
    console.error('[Auth] 获取Token失败:', error);
    return null;
  }
};

/**
 * 保存Token数据（同时保存到Cookie和localStorage）
 * @param tokenData Token数据
 */
export const setToken = (tokenData: TokenData): void => {
  try {
    // 1. 保存到Cookie（直接保存token字符串，不要JSON.stringify）
    // 计算Cookie过期天数（毫秒转天）
    const expiresInDays = (tokenData.expires - Date.now()) / (24 * 60 * 60 * 1000);
    
    Cookies.set('Authorization', tokenData.token, {
      expires: expiresInDays > 0 ? expiresInDays : 1/48, // 最少保存30分钟
      path: '/',
      sameSite: 'Lax'
    });

    // 2. 保存完整用户信息到localStorage（保持项目原有习惯：userInfo）
    localStorage.setItem('userInfo', JSON.stringify(tokenData));
    
    console.log('[Auth] Token已保存，过期时间:', new Date(tokenData.expires));
  } catch (error) {
    console.error('[Auth] 保存Token失败:', error);
  }
};

/**
 * 清除Token数据（Cookie + localStorage）
 */
export const removeToken = (): void => {
  try {
    // 清除Cookie（包括新旧两个名称）
    Cookies.remove('Authorization', { path: '/' });
    Cookies.remove('authorized-token', { path: '/' }); // 清除旧的cookie名称

    // 清除localStorage（保持项目原有习惯：userInfo）
    localStorage.removeItem('userInfo');

    console.log('[Auth] Token已清除');
  } catch (error) {
    console.error('[Auth] 清除Token失败:', error);
  }
};

// ==================== 旧的Cookie管理函数（兼容保留） ====================

// 设置cookie
export const setCookie = (key: string, value: string, timeOUt: any) => {
  Cookies.set(key, value, { 
    expires: timeOUt,
    path: '/',
    sameSite: 'Lax'
  });
}

// 获取cookie
export const getCookie = (key: string) => {
  return Cookies.get(key);
}
// 删除cookkie

export const removeCookie = (key: string) => {
  return Cookies.remove(key);
}


// 设置本地存储
export const setLocalStorage = (key: string, value: string) => {
  localStorage.setItem(key, value);
}
// 获取本地存储
export const getLocalStorage = (key: string) => {
  return localStorage.getItem(key);
}

// 保存用户信息
export const saveUserInfo = (userInfo: any) => {
  setLocalStorage("userInfo", JSON.stringify(userInfo));
}
// 清楚全部本地缓存
export const clearLocalStorage = () => {
  localStorage.clear();
}

// 清除用户登录信息（统一使用新的removeToken）
export const clearUserInfo = () => {
  // 调用新的removeToken函数
  removeToken()

  // 清除旧的localStorage字段（兼容性）
  localStorage.removeItem('isLogin')
  localStorage.removeItem('loginCredentials')

  console.log('已清除所有登录信息（localStorage + cookie）')
}

