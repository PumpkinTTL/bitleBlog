import { createMessage, closeAllMessages } from './createMessage';
import type { MessageAPI, MessageOptions, MessageInstance } from './types';
import type { App } from 'vue';

/**
 * SmartMessage API
 */
export const smartMessage: MessageAPI = {
  /**
   * 成功消息
   */
  success: (content: string, options = {}) => {
    return createMessage({
      content,
      type: 'success',
      ...options
    });
  },

  /**
   * 错误消息
   */
  error: (content: string, options = {}) => {
    return createMessage({
      content,
      type: 'error',
      ...options
    });
  },

  /**
   * 警告消息
   */
  warning: (content: string, options = {}) => {
    return createMessage({
      content,
      type: 'warning',
      ...options
    });
  },

  /**
   * 信息消息
   */
  info: (content: string, options = {}) => {
    return createMessage({
      content,
      type: 'info',
      ...options
    });
  },

  /**
   * 通用消息
   */
  open: (options: MessageOptions) => {
    return createMessage(options);
  }
};

/**
 * 关闭所有消息
 */
export const closeAll = closeAllMessages;

/**
 * Vue 插件（用于全局挂载）
 */
export const SmartMessagePlugin = {
  install(app: App) {
    // 挂载到全局属性
    app.config.globalProperties.$smartMessage = smartMessage;
    
    // 也可以通过 provide/inject 使用
    app.provide('smartMessage', smartMessage);
  }
};

// 默认导出
export default smartMessage;

// 导出类型
export type { MessageAPI, MessageOptions, MessageInstance } from './types';

/**
 * 使用示例：
 * 
 * 1. 直接导入使用：
 * ```ts
 * import { smartMessage } from '@/components/modal'
 * 
 * smartMessage.success('操作成功')
 * smartMessage.error('操作失败', { duration: 5000 })
 * smartMessage.warning('警告信息')
 * smartMessage.info('提示信息')
 * ```
 * 
 * 2. 安装插件后全局使用：
 * ```ts
 * // main.ts
 * import { SmartMessagePlugin } from '@/components/modal'
 * app.use(SmartMessagePlugin)
 * 
 * // 组件中
 * import { getCurrentInstance } from 'vue'
 * const { proxy } = getCurrentInstance()
 * proxy.$smartMessage.success('成功')
 * ```
 * 
 * 3. 手动控制：
 * ```ts
 * const instance = smartMessage.success('操作成功', { duration: 0 })
 * // 手动关闭
 * instance.close()
 * ```
 * 
 * 4. 关闭所有消息：
 * ```ts
 * import { closeAll } from '@/components/modal'
 * closeAll()
 * ```
 */
