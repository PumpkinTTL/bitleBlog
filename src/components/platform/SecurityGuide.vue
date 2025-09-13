<template>
  <div class="security-guide-content">
    <div class="guide-header">
      <div class="guide-icon">
        <i class="fas fa-shield-alt"></i>
      </div>
      <div class="header-text">
        <h2 class="guide-title">保护您的账号安全</h2>
        <p class="guide-greeting">亲爱的用户，</p>
      </div>
    </div>
    
    <p class="guide-intro">
      在您注册本平台账号时，我们特别提醒您注意以下账户安全准则。这些建议将帮助您有效防范社会工程学攻击（社工攻击），保护您的个人信息和数字资产安全。
    </p>
    
    <div class="guide-card">
      <div class="card-header">
        <span class="card-emoji">🔒</span>
        <h3>账号注册安全准则</h3>
      </div>
      
      <div class="guide-section">
        <h4><i class="fas fa-user-shield"></i> 用户名设置原则</h4>
        <ul>
          <li>避免使用个人信息（如姓名、生日、身份证号）</li>
          <li>不要重复使用其他平台的相同用户名</li>
          <li>建议组合字母、数字和符号（如：User_2024!）</li>
        </ul>
      </div>
      
      <div class="guide-section">
        <h4><i class="fas fa-key"></i> 密码安全要求</h4>
        <div class="password-strength-meter">
          <div class="strength-level weak">弱</div>
          <div class="strength-level medium">中</div>
          <div class="strength-level strong">强</div>
        </div>
        <ul>
          <li>长度至少12位，包含大小写字母、数字和特殊符号</li>
          <li>避免使用：
            <ul>
              <li><span class="highlight-danger">连续或重复字符</span>（如123456、aaaaaa）</li>
              <li><span class="highlight-danger">常见单词或短语</span>（如password、admin）</li>
              <li><span class="highlight-danger">个人信息</span>（如手机号、生日）</li>
            </ul>
          </li>
          <li><span class="highlight-success">推荐</span>使用密码管理器生成和保存</li>
        </ul>
      </div>
      
      <div class="guide-section">
        <h4><i class="fas fa-user-secret"></i> 防范社工攻击特别提醒</h4>
        <div class="alert-box">
          <i class="fas fa-exclamation-triangle"></i>
          <p>社会工程学攻击是指攻击者通过人际交往和欺骗手段获取信息，而非技术手段</p>
        </div>
        <p>社会工程学攻击者可能通过以下方式尝试获取您的账户信息：</p>
        <ul class="attack-methods">
          <li>
            <i class="fas fa-headset"></i>
            伪装成平台客服索要账号密码
          </li>
          <li>
            <i class="fas fa-fish"></i>
            发送钓鱼邮件/链接诱导您输入信息
          </li>
          <li>
            <i class="fas fa-search"></i>
            通过社交平台搜集您的个人信息组合密码
          </li>
        </ul>
      </div>
    </div>
    
    <div class="guide-card">
      <div class="card-header">
        <span class="card-emoji">🛡️</span>
        <h3>账户保护建议</h3>
      </div>
      
      <div class="protection-grid">
        <div class="protection-item">
          <div class="protection-icon">
            <i class="fas fa-mobile-alt"></i>
          </div>
          <div class="protection-content">
            <h4>启用双重认证（2FA）</h4>
            <p>建议绑定认证APP（如Google Authenticator）而非短信验证</p>
          </div>
        </div>
        
        <div class="protection-item">
          <div class="protection-icon">
            <i class="fas fa-history"></i>
          </div>
          <div class="protection-content">
            <h4>定期检查登录记录</h4>
            <p>发现异常登录立即修改密码并联系客服</p>
          </div>
        </div>
        
        <div class="protection-item">
          <div class="protection-icon">
            <i class="fas fa-exclamation-triangle"></i>
          </div>
          <div class="protection-content">
            <h4>警惕可疑请求</h4>
            <p>本平台工作人员永远不会通过任何方式索要您的密码</p>
          </div>
        </div>
        
        <div class="protection-item">
          <div class="protection-icon">
            <i class="fas fa-sync-alt"></i>
          </div>
          <div class="protection-content">
            <h4>密码更新策略</h4>
            <ul>
              <li>每3-6个月更换一次密码</li>
              <li>不同平台使用不同密码</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    
    <div class="guide-card emergency-card">
      <div class="card-header">
        <span class="card-emoji">🆘</span>
        <h3>如果发生账户异常</h3>
      </div>
      
      <div class="guide-section no-border">
        <div class="emergency-steps">
          <div class="step">
            <div class="step-number">1</div>
            <div class="step-content">立即通过官方渠道修改密码</div>
          </div>
          <div class="step">
            <div class="step-number">2</div>
            <div class="step-content">检查并解除异常绑定信息</div>
          </div>
          <div class="step">
            <div class="step-number">3</div>
            <div class="step-content">联系客服冻结账户</div>
          </div>
        </div>
      </div>
    </div>
    
    <p class="guide-conclusion">我们始终将您的账户安全放在首位。通过遵循这些简单的安全措施，您可以有效保护自己的数字身份免受侵害。</p>
    
    <p class="guide-signature">安全团队 敬上</p>
  </div>
</template>

<script setup>
// 没有需要导出的props和方法
</script>

<style scoped>
.security-guide-content {
  color: #333;
  font-size: 14px;
  line-height: 1.6;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
}

.guide-header {
  display: flex;
  align-items: flex-start;
  margin-bottom: 24px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.08), rgba(64, 158, 255, 0.02));
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03);
  position: relative;
  overflow: hidden;
}

.guide-header::before {
  content: '';
  position: absolute;
  top: -20px;
  right: -20px;
  width: 100px;
  height: 100px;
  background: radial-gradient(circle, rgba(64, 158, 255, 0.15), rgba(64, 158, 255, 0));
  border-radius: 50%;
}

.guide-icon {
  width: 60px;
  height: 60px;
  border-radius: 16px;
  background: linear-gradient(135deg, #409EFF, #1677ff);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 20px;
  box-shadow: 0 6px 12px rgba(22, 119, 255, 0.25);
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.guide-icon::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 40%;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px 16px 0 0;
}

.guide-icon i {
  color: white;
  font-size: 26px;
  position: relative;
  z-index: 1;
  filter: drop-shadow(0 2px 2px rgba(0, 0, 0, 0.2));
}

.header-text {
  flex: 1;
}

.guide-title {
  font-size: 22px;
  font-weight: 600;
  color: #1677ff;
  margin: 0 0 8px;
  line-height: 1.3;
}

.guide-greeting {
  font-style: italic;
  color: #666;
  margin: 0;
  font-size: 15px;
}

.guide-intro {
  background: rgba(64, 158, 255, 0.05);
  border-left: 3px solid #409EFF;
  padding: 16px 20px;
  border-radius: 6px;
  margin-bottom: 30px;
  color: #506784;
  font-size: 15px;
  position: relative;
}

.guide-intro::before {
  content: '"';
  position: absolute;
  left: 8px;
  top: 0;
  font-size: 38px;
  color: rgba(64, 158, 255, 0.15);
  font-family: Georgia, serif;
}

.guide-card {
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  border: 1px solid #ebeef5;
  margin-bottom: 30px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.guide-card:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.card-header {
  background: linear-gradient(to right, rgba(64, 158, 255, 0.08), rgba(64, 158, 255, 0.01));
  padding: 16px 20px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #ebeef5;
}

.card-emoji {
  font-size: 26px;
  margin-right: 14px;
  display: inline-block;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}

.card-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 18px;
  font-weight: 600;
}

.guide-section {
  padding: 20px;
  border-bottom: 1px solid #ebeef5;
}

.guide-section.no-border {
  border-bottom: none;
}

.guide-section h4 {
  color: #1e293b;
  margin-top: 0;
  margin-bottom: 16px;
  font-size: 16px;
  display: flex;
  align-items: center;
  font-weight: 600;
}

.guide-section h4 i {
  color: #409EFF;
  margin-right: 10px;
  font-size: 16px;
}

.guide-section ul {
  padding-left: 20px;
  margin: 12px 0;
  list-style-type: none;
}

.guide-section ul li {
  margin-bottom: 8px;
  position: relative;
  padding-left: 20px;
}

.guide-section ul li::before {
  content: '•';
  color: #409EFF;
  font-weight: bold;
  font-size: 18px;
  position: absolute;
  left: 0;
  top: -2px;
}

.guide-section ul ul {
  margin: 8px 0;
}

.password-strength-meter {
  display: flex;
  margin: 15px 0;
  border-radius: 6px;
  overflow: hidden;
  width: 100%;
}

.strength-level {
  flex: 1;
  text-align: center;
  padding: 6px 0;
  font-size: 13px;
  font-weight: 500;
  color: white;
}

.strength-level.weak {
  background-color: #f56c6c;
}

.strength-level.medium {
  background-color: #e6a23c;
}

.strength-level.strong {
  background-color: #67c23a;
}

.highlight-danger {
  color: #f56c6c;
  font-weight: 500;
}

.highlight-success {
  color: #67c23a;
  font-weight: 500;
}

.alert-box {
  background-color: rgba(230, 162, 60, 0.1);
  border-radius: 6px;
  padding: 12px 16px;
  margin: 15px 0;
  display: flex;
  align-items: center;
}

.alert-box i {
  color: #e6a23c;
  font-size: 18px;
  margin-right: 12px;
  flex-shrink: 0;
}

.alert-box p {
  margin: 0;
  color: #8a6d3b;
  font-size: 14px;
}

.attack-methods {
  margin-top: 15px !important;
}

.attack-methods li {
  display: flex;
  align-items: center;
  padding: 8px 12px !important;
  background-color: rgba(64, 158, 255, 0.03);
  border-radius: 6px;
  margin-bottom: 10px !important;
  border-left: 2px solid #409EFF;
  transform: none;
}

.attack-methods li::before {
  display: none;
}

.attack-methods li i {
  font-size: 16px;
  color: #409EFF;
  margin-right: 12px;
}

.protection-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  padding: 20px;
}

.protection-item {
  display: flex;
  align-items: flex-start;
  padding: 16px;
  background-color: rgba(64, 158, 255, 0.03);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.protection-item:hover {
  background-color: rgba(64, 158, 255, 0.06);
  transform: translateY(-2px);
}

.protection-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(64, 158, 255, 0.1), rgba(64, 158, 255, 0.2));
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 14px;
  flex-shrink: 0;
}

.protection-icon i {
  font-size: 18px;
  color: #409EFF;
}

.protection-content h4 {
  margin: 0 0 8px !important;
  font-size: 15px !important;
}

.protection-content p, .protection-content ul {
  margin: 0;
  color: #506784;
  font-size: 13px;
}

.protection-content ul {
  padding-left: 18px;
}

.emergency-card {
  border-color: rgba(245, 108, 108, 0.2);
}

.emergency-card .card-header {
  background: linear-gradient(to right, rgba(245, 108, 108, 0.08), rgba(245, 108, 108, 0.01));
}

.emergency-steps {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin: 10px 0;
}

.step {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background-color: rgba(245, 108, 108, 0.05);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.step:hover {
  background-color: rgba(245, 108, 108, 0.1);
}

.step-number {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: #f56c6c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 14px;
  flex-shrink: 0;
}

.step-content {
  font-size: 14px;
  color: #5d4037;
}

.guide-conclusion {
  background: rgba(64, 158, 255, 0.05);
  border-radius: 8px;
  padding: 16px 20px;
  margin-top: 30px;
  margin-bottom: 25px;
  color: #1e293b;
  font-weight: 500;
  font-size: 15px;
  border-left: 3px solid #409EFF;
  line-height: 1.6;
}

.guide-signature {
  text-align: right;
  font-weight: 500;
  color: #1e293b;
  margin-top: 20px;
  font-size: 15px;
  font-style: italic;
}

@media (max-width: 768px) {
  .guide-header {
    flex-direction: column;
    align-items: center;
    text-align: center;
    padding: 16px;
  }
  
  .guide-icon {
    margin-bottom: 16px;
    margin-right: 0;
  }
  
  .protection-grid {
    grid-template-columns: 1fr;
    gap: 15px;
    padding: 15px;
  }
  
  .guide-section {
    padding: 15px;
  }
}
</style> 