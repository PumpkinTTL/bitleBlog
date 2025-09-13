/**
 * 生成不以0开头的随机编号
 * @param {number} [count=1] - 生成编号的次数（默认1次）
 * @param {number} [length=5] - 编号长度（默认5位）
 * @param {string} [prefix=''] - 编号前缀（默认无）
 * @returns {string|string[]} 生成的编号（单个返回字符串，多个返回数组）
 */
 export function generateSerialNumbers(count = 1, length = 5, prefix = '') {
    if (length < 1) throw new Error('长度必须大于0');
    
    // 生成首位非零的随机数（1-9开头）
    const firstDigit = Math.floor(Math.random() * 9) + 1;
    const remainingDigits = Math.floor(Math.random() * 10 ** (length - 1))
      .toString()
      .padStart(length - 1, '0');
    const startNum = Number(`${firstDigit}${remainingDigits}`);
  
    // 处理单个编号的情况
    if (count === 1) {
      return prefix + startNum.toString().padStart(length, '0');
    }
  
    // 处理多个编号的情况
    const numbers = [];
    for (let i = 0; i < count; i++) {
      numbers.push(prefix + (startNum + i).toString().padStart(length, '0'));
    }
    return numbers;
  }
  
// 返回时间
export function getCurrentTime(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，需要加1
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0'); // 24小时制
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 使用示例
