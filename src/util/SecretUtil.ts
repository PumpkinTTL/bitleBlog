import CryptoJS from 'crypto-js';
const aesKey = import.meta.env.VITE_AES_KEY
const secret = import.meta.env.VITE_SECRET_KEY
// sha256摘要
export function sha256(data: any) {
  return CryptoJS.SHA256(data).toString()
}

// 参数排序后转成字符串
export const objectToQueryString = (obj: any) => {
  const _appid = obj.appid
 
    obj.secret = secret;
  const paramsStr = Object.keys(obj)
      .sort() // 按字母顺序排序
        .map(key => `${key}=${obj[key]}`)
        .join('&');
  delete obj.secret;

        return paramsStr;
  }

// 根据密钥对摘要进行ecb加密
export function encryptECB(data: any) {
   // 使用固定的32字节密钥 (AES-256)
    const key = CryptoJS.enc.Utf8.parse(aesKey);  // 替换为你的32字节密钥

   // 使用 CryptoJS.AES.encrypt 加密数据
   const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(data), key, {
       mode: CryptoJS.mode.ECB,
       padding: CryptoJS.pad.Pkcs7
   });

   // 将加密后的字节数组转换为 Base64 编码字符串
   const base64Ciphertext = encrypted.toString();  // 使用默认的Base64编码输出
   return base64Ciphertext;
  }
// 根据长度生成随机字符串
export const randomString = (len: number) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = len; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)]
  return result
}