<template>
  <div class="agreement-container">
    <!-- 公告部分 -->
    <a-alert message="重要公告" description="请仔细阅读以下用户协议，继续使用本平台即代表您已同意该协议。" type="info" show-icon class="announcement" />

    <!-- 用户协议部分 -->
    <a-collapse :default-active-key="['1', '2', '3', '4', '5']" class="agreement-collapse">
      <a-collapse-panel header="1. 使用条款" key="1">
        <p>在使用本平台时，您必须遵守所有适用的法律法规。禁止使用平台进行任何非法或未授权的活动。</p>
      </a-collapse-panel>
      <a-collapse-panel header="2. 账户安全" key="2">
        <p>您有责任保护自己的账户安全，确保您的密码不会被泄露。如果您的账户信息被泄露或有任何可疑活动，请立即通知我们。</p>
      </a-collapse-panel>
      <a-collapse-panel header="3. 用户隐私" key="3">
        <p>我们会保护您的隐私，除非有法律要求，我们不会泄露您的个人信息。您可以查看我们的隐私政策以了解更多详细内容。</p>
      </a-collapse-panel>
      <a-collapse-panel header="4. 责任限制" key="4">
        <p>本平台对于因不可抗力导致的服务中断、数据丢失等情况不承担责任。用户需理解并接受这些风险。</p>
      </a-collapse-panel>
      <a-collapse-panel header="5. 协议变更" key="5">
        <p>本协议条款可能随时进行修改，修改后的条款将立即生效。请定期查看本页面以了解最新的协议内容。</p>
      </a-collapse-panel>
    </a-collapse>

    <!-- 同意或拒绝操作 -->
    <div class="agreement-actions">
      <a-button type="primary" @click="agreeToTerms">我已阅读并同意</a-button>
      <a-button type="default" @click="declineTerms">不同意</a-button>
    </div>
  </div>
</template>
  
  <script setup>
  import { ref } from 'vue';
  import { Alert, Collapse, Button, message } from 'ant-design-vue';
  
  // 用户点击 "同意" 按钮
  const agreeToTerms = () => {
    message.success('感谢您同意用户协议');
    // 此处可添加更多逻辑，比如提交用户同意的信息或跳转页面
  };
  
  // 用户点击 "不同意" 按钮
  const declineTerms = () => {
    message.error('您未同意用户协议，操作将被限制');
    // 可以根据需求进行处理，如退出当前流程或限制访问
  };
  </script>
  
  <style scoped>
  .agreement-container {
    padding: 24px;
    background-color: #fff;
    max-width: 800px;
    margin: 0 auto;
  }
  
  .announcement {
    margin-bottom: 16px;
  }
  
  .agreement-collapse {
    margin-bottom: 24px;
  }
  
  .agreement-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
  </style>
  