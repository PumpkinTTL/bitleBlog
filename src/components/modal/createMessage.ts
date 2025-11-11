import { createVNode, render } from 'vue';
import MessageComponent from './Message.vue';
import type { MessageOptions, MessageInstance } from './types';

// 消息实例列表
const instances: Array<{ id: string; vnode: any; container: HTMLDivElement }> = [];

// 默认配置
const defaultOptions: Partial<MessageOptions> = {
  duration: 3000,
  closable: true,
  showIcon: true,
  type: 'info',
  borderRadius: 100
};

// 生成唯一ID
let seed = 0;
const generateId = (): string => {
  return `smart-message-${Date.now()}-${seed++}`;
};

// 计算偏移量（多个消息时的垂直堆叠位置）
const getOffset = (): number => {
  const gap = 12; // 消息之间的间距
  const containerTop = 20; // 容器顶部距离
  
  return instances.reduce((offset, instance) => {
    // 获取消息实例的实际高度
    const containerEl = instance.container.querySelector('.smart-message-container') as HTMLElement;
    if (containerEl) {
      const messageEl = containerEl.querySelector('.smart-message') as HTMLElement;
      if (messageEl) {
        return offset + messageEl.offsetHeight + gap;
      }
    }
    return offset + 60; // 默认高度
  }, containerTop);
};

/**
 * 创建消息实例
 */
export const createMessage = (options: MessageOptions): MessageInstance => {
  // 合并配置
  const props = { ...defaultOptions, ...options };
  
  // 不再调整 duration，每个消息独立计时
  
  // 生成唯一ID
  const id = generateId();
  
  // 创建容器
  const container = document.createElement('div');
  
  // 计算偏移量
  const offset = getOffset();
  
  // 关闭消息的回调
  const onClose = () => {
    console.log(`[${id}] 被要求关闭`);
    
    // 立即从 instances 移除，避免影响其他消息的位置计算
    const index = instances.findIndex(inst => inst.id === id);
    if (index !== -1) {
      instances.splice(index, 1);
      console.log(`[${id}] 从实例列表移除, 剩余: ${instances.length}`);
    }
    
    // 更新其他消息的位置
    updatePositions();
    
    // 触发关闭动画
    const component = vnode.component;
    if (component && component.exposed) {
      component.exposed.close();
    }
    
    // 调用用户的回调
    if (props.onClose) {
      props.onClose();
    }
  };
  
  // 销毁消息的回调（动画结束后）
  const onDestroy = () => {
    console.log(`[${id}] 动画结束，销毁 DOM`);
    
    // 从 DOM 中移除
    render(null, container);
    container.remove();
  };
  
  
  // 创建VNode
  const vnode = createVNode(MessageComponent, {
    id,
    content: props.content,
    type: props.type,
    duration: props.duration,
    closable: props.closable,
    customClass: props.customClass,
    showIcon: props.showIcon,
    borderRadius: props.borderRadius,
    offset,
    onClose,
    onDestroy
  });
  
  // 渲染到容器
  render(vnode, container);
  
  // 添加到body
  document.body.appendChild(container);
  
  // 保存实例
  const instance = {
    id,
    vnode,
    container
  };
  instances.push(instance);
  
  // 手动关闭方法
  const close = () => {
    // 调用 onClose 以保证走同一个逻辑
    onClose();
  };
  
  return {
    id,
    close
  };
};


/**
 * 更新所有消息的位置（当某个消息关闭后重新计算堆叠位置）
 */
const updatePositions = () => {
  const gap = 12;
  const containerTop = 20;
  
  let currentOffset = containerTop;
  
  instances.forEach(instance => {
    const component = instance.vnode.component;
    if (component && component.props) {
      // 更新组件的offset属性
      component.props.offset = currentOffset;
      
      // 累加偏移量
      const containerEl = instance.container.querySelector('.smart-message-container') as HTMLElement;
      if (containerEl) {
        const messageEl = containerEl.querySelector('.smart-message') as HTMLElement;
        if (messageEl) {
          currentOffset += messageEl.offsetHeight + gap;
        }
      }
    }
  });
};

/**
 * 关闭所有消息（级联关闭）
 */
export const closeAllMessages = (cascade = true) => {
  if (!cascade) {
    // 同时关闭
    for (let i = instances.length - 1; i >= 0; i--) {
      const instance = instances[i];
      const component = instance.vnode.component;
      if (component && component.exposed) {
        component.exposed.close();
      }
    }
  } else {
    // 级联关闭：一个接一个关闭
    closeMessagesSequentially();
  }
};

/**
 * 级联顺序关闭消息
 */
const closeMessagesSequentially = (index = instances.length - 1) => {
  if (index < 0 || instances.length === 0) return;
  
  const instance = instances[index];
  if (!instance) return;
  
  const component = instance.vnode.component;
  if (component && component.exposed) {
    component.exposed.close();
    
    // 延迟 150ms 后关闭下一个
    setTimeout(() => {
      closeMessagesSequentially(index - 1);
    }, 150);
  }
};
