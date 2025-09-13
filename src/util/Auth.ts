import { useStore } from "@/store";
import Cookies from "js-cookie";
// const store = useStore();
// 设置cookie
export const setCookie = (key: string, value: string, timeOUt: any) => {
  Cookies.set(key, value, { expires: timeOUt });
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

// 清除清除用户登录信息
export const clearUserInfo = () => {
  localStorage.removeItem('refreshToken')
  localStorage.removeItem('accessToken')
  localStorage.removeItem('userInfo')
}

// 清楚store中的用户信息
// export const clearStoreUserInfo = () => {
//   store.$dispatch((state:any) => {
//     state.userInfo = undefined
//   })
// }
