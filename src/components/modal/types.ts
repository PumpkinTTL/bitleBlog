/**
 * 消息类型
 */
export type MessageType = 'success' | 'error' | 'warning' | 'info';

/**
 * 消息配置选项
 */
export interface MessageOptions {
  /** 消息内容 */
  content: string;
  /** 消息类型 */
  type?: MessageType;
  /** 显示时长（毫秒），0 表社不自动关闭 */
  duration?: number;
  /** 是否可以手动关闭 */
  closable?: boolean;
  /** 关闭时的回调 */
  onClose?: () => void;
  /** 自定义类名 */
  customClass?: string;
  /** 是否显示图标 */
  showIcon?: boolean;
  /** 圆角大小（px），默认 100 */
  borderRadius?: number;
}

/**
 * 消息实例
 */
export interface MessageInstance {
  /** 唯一ID */
  id: string;
  /** 关闭消息 */
  close: () => void;
}

/**
 * 消息API
 */
export interface MessageAPI {
  /** 成功消息 */
  success: (content: string, options?: Omit<MessageOptions, 'type' | 'content'>) => MessageInstance;
  /** 错误消息 */
  error: (content: string, options?: Omit<MessageOptions, 'type' | 'content'>) => MessageInstance;
  /** 警告消息 */
  warning: (content: string, options?: Omit<MessageOptions, 'type' | 'content'>) => MessageInstance;
  /** 信息消息 */
  info: (content: string, options?: Omit<MessageOptions, 'type' | 'content'>) => MessageInstance;
  /** 通用消息 */
  open: (options: MessageOptions) => MessageInstance;
}
