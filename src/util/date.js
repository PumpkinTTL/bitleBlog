/**
 * 日期格式化工具函数
 * @param {string|Date} date 日期对象或日期字符串
 * @param {string} fmt 格式化模式，默认为 'yyyy-MM-dd'
 * @returns {string} 格式化后的日期字符串
 */
export function formatDate(date, fmt = 'yyyy-MM-dd') {
  if (!date) {
    return '未知';
  }

  // 如果传入的是字符串，尝试转换为Date对象
  if (typeof date === 'string') {
    // 处理IOS下的兼容问题，将'-'替换为'/'
    date = date.replace(/-/g, '/');
    date = new Date(date);
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '无效日期';
  }

  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    'S': date.getMilliseconds() // 毫秒
  };

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
  }

  for (const k in o) {
    if (new RegExp('(' + k + ')').test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length)
      );
    }
  }
  return fmt;
}

/**
 * 获取相对时间描述，如"刚刚"、"5分钟前"等
 * @param {string|Date} date 日期对象或日期字符串
 * @returns {string} 相对时间描述
 */
export function getRelativeTime(date) {
  if (!date) {
    return '未知';
  }

  // 如果传入的是字符串，尝试转换为Date对象
  if (typeof date === 'string') {
    // 处理IOS下的兼容问题，将'-'替换为'/'
    date = date.replace(/-/g, '/');
    date = new Date(date);
  }

  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return '无效日期';
  }

  const now = new Date();
  const diff = now.getTime() - date.getTime();
  
  // 时间差的单位换算
  const minute = 1000 * 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  // 计算时间差对应的时间单位数
  const diffMinute = Math.floor(diff / minute);
  const diffHour = Math.floor(diff / hour);
  const diffDay = Math.floor(diff / day);
  const diffWeek = Math.floor(diff / week);
  const diffMonth = Math.floor(diff / month);
  const diffYear = Math.floor(diff / year);
  
  // 根据时间差返回相应的文本描述
  if (diff < minute) {
    return '刚刚';
  } else if (diff < hour) {
    return `${diffMinute}分钟前`;
  } else if (diff < day) {
    return `${diffHour}小时前`;
  } else if (diff < week) {
    return `${diffDay}天前`;
  } else if (diff < month) {
    return `${diffWeek}周前`;
  } else if (diff < year) {
    return `${diffMonth}个月前`;
  } else {
    return `${diffYear}年前`;
  }
}

export default {
  formatDate,
  getRelativeTime
}; 