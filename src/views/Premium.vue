<template>
  <div class="premium-view">
    <div class="premium-container">
      <!-- 头部区域 -->
      <div class="premium-header">
        <h1>升级为Premium会员</h1>
        <p>解锁高级功能，获取独家资源，提升您的博客体验</p>
      </div>

      <!-- 套餐卡片选择 -->
      <div class="plan-cards">
        <div v-for="(plan, index) in plans" :key="index" class="plan-card"
          :class="{ active: selectedPlan === plan.id, popular: plan.popular }" @click="selectPlan(plan.id)">
          <div class="popular-tag" v-if="plan.popular">
            <i class="fas fa-star"></i> 最受欢迎
          </div>
          <div class="plan-icon">
            <i :class="plan.icon"></i>
          </div>
          <h3>{{ plan.name }}</h3>
          <div class="plan-price">
            <span class="amount">{{ plan.price }}</span>
            <span class="period">{{ plan.period }}</span>
          </div>
          <div class="discount-badge" v-if="plan.discount">
            <i class="fas fa-tag"></i> {{ plan.discount }}
          </div>
          <div class="discount-desc" v-if="plan.discountDesc">
            {{ plan.discountDesc }}
          </div>
          <ul class="plan-features">
            <li v-for="(feature, fIndex) in plan.features" :key="fIndex">
              <i class="fas fa-check-circle"></i> {{ feature }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 主内容区域 - 两栏布局 -->
      <div class="main-content">
        <!-- 左侧：支付区域 -->
        <div class="payment-section">
          <div class="section-header">
            <i class="fas fa-wallet"></i>
            <h2>选择支付方式</h2>
          </div>

          <!-- 套餐选择下拉框 -->
          <div class="payment-plan-select">
            <label for="payment-plan">选择套餐:</label>
            <select id="payment-plan" v-model="selectedPlan" class="plan-select">
              <option v-for="plan in plans" :key="plan.id" :value="plan.id">
                {{ plan.name }} - {{ plan.price }}{{ plan.period }} {{ plan.discount ? `(${plan.discount})` : '' }}
              </option>
            </select>
          </div>

          <div class="payment-methods">
            <div v-for="method in paymentMethods" :key="method.id" class="payment-method"
              :class="{ active: selectedPayment === method.id }" @click="selectPayment(method.id)">
              <div class="method-icon" :style="{ backgroundColor: method.color }">
                <i :class="method.icon"></i>
              </div>
              <div class="method-info">
                <h3>{{ method.name }}</h3>
                <p>{{ method.description }}</p>
              </div>
              <div class="method-recommended" v-if="method.recommended">推荐</div>
            </div>
          </div>

          <!-- 订单摘要 -->
          <div class="order-summary">
            <div class="summary-header">
              <i class="fas fa-clipboard-list"></i>
              <h3>订单摘要</h3>
            </div>

            <div class="summary-details">
              <div class="summary-row">
                <span>会员套餐</span>
                <span>{{ currentPlan.name }}</span>
              </div>
              <div class="summary-row">
                <span>原价</span>
                <span class="original-price">¥{{ currentPlan.originalPrice }}</span>
              </div>
              <div class="summary-row highlight">
                <span>应付金额</span>
                <span class="price">{{ currentPlan.price }}</span>
              </div>
              <div class="summary-row discount" v-if="currentPlan.discount">
                <span>优惠</span>
                <span>{{ currentPlan.discount }} · {{ currentPlan.discountDesc }}</span>
              </div>
              <div class="summary-row usdt" v-if="selectedPayment === 'usdt'">
                <span>USDT金额</span>
                <span>≈ {{ currentUSDTAmount }} USDT</span>
              </div>
            </div>

            <!-- 创建订单按钮 -->
            <div class="create-order">
              <a-button type="primary" :loading="orderLoading" block @click="createOrder" class="create-order-btn"
                v-if="!orderCreated">
                <i class="fas fa-check-circle"></i> 确认并创建订单
              </a-button>
            </div>
          </div>

          <!-- 支付详情区域 - 仅在创建订单后显示 -->
          <div v-if="orderCreated">
            <!-- 二维码 - 支付宝/微信 -->
            <div v-if="['alipay', 'wechat'].includes(selectedPayment)" class="qr-section">
              <div class="qr-container">
                <a-qrcode :value="paymentQRValue" :size="150"
                  :color="selectedPayment === 'alipay' ? '#1677ff' : '#07c160'" class="qr-code-component" />
                <p>请使用{{ selectedPayment === 'alipay' ? '支付宝' : '微信' }}扫码支付</p>

                <!-- 移动端唤起支付宝选项 -->
                <div v-if="isMobile && selectedPayment === 'alipay'" class="mobile-payment-option">
                  <a-button type="primary" @click="openAlipay" class="open-alipay-btn">
                    <i class="fab fa-alipay"></i> 打开支付宝支付
                  </a-button>
                </div>

                <div class="payment-status">
                  <div class="status-indicator"></div>
                  <span>等待支付...</span>
                </div>
              </div>
            </div>

            <!-- USDT支付详情 -->
            <div v-if="selectedPayment === 'usdt'" class="crypto-payment">
              <div class="wallet-info">
                <div class="wallet-qr-wrap">
                  <a-qrcode value="TY76sVbBku8sLk3eY8XzH5qg9dF2jK1lMn" :size="140" color="#26a17b"
                    class="qr-code-component" />
                  <div class="wallet-address-copy">
                    <div class="address">TY76sVbBku8sLk3eY8XzH5qg9dF2jK1lMn</div>
                    <a-button type="primary" size="small" class="copy-btn-inline" @click="copyAddress">
                      <template #icon><i class="fas fa-copy"></i></template>
                    </a-button>
                  </div>
                </div>

                <div class="wallet-details">
                  <div class="wallet-row">
                    <div class="row-label">
                      <i class="fas fa-coins"></i> 支付金额
                    </div>
                    <div class="amount-badge">{{ currentUSDTAmount }} USDT</div>
                  </div>

                  <div class="wallet-row">
                    <div class="row-label">
                      <i class="fas fa-network-wired"></i> 网络类型
                    </div>
                    <div class="network-type">TRC-20</div>
                  </div>

                  <!-- 交易Hash输入区域 -->
                  <div class="wallet-row">
                    <div class="row-label">
                      <i class="fas fa-hashtag"></i> 交易Hash
                    </div>
                    <a-input v-model:value="transactionHash" placeholder="若已完成转账请输入交易hash" />
                    <a-button 
                      type="primary" 
                      size="small" 
                      :loading="verifyingHash" 
                      @click="verifyTransaction"
                      :disabled="!transactionHash">
                      验证交易
                    </a-button>
                  </div>

                  <div class="wallet-tip">
                    <i class="fas fa-info-circle"></i>
                    <span>请确保使用TRC-20网络，若转账后系统未确认请输入交易hash手动提交</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <p class="secure-note">
            <i class="fas fa-shield-alt"></i> 安全支付保障 · 256位SSL加密
          </p>
        </div>

        <!-- 右侧：特权信息 -->
        <div class="benefits-section">
          <div class="section-header">
            <i class="fas fa-crown"></i>
            <h2>Premium会员特权</h2>
          </div>

          <div class="benefits-grid">
            <div v-for="(benefit, index) in benefits" :key="index" class="benefit-card">
              <div class="benefit-icon">
                <i :class="benefit.icon"></i>
              </div>
              <div class="benefit-content">
                <h3>{{ benefit.title }}</h3>
                <p>{{ benefit.description }}</p>
              </div>
            </div>

            <!-- 更多特权提示 -->
            <div class="benefit-card">
              <div class="benefit-icon">
                <i class="fas fa-magic"></i>
              </div>
              <div class="benefit-content">
                <h3>更多特权</h3>
                <p>更多会员特权正在开发中，敬请期待...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';

// 会员套餐
const plans = ref([
  {
    id: 'monthly',
    name: '月度会员',
    icon: 'fas fa-calendar-day',
    price: '¥15',
    originalPrice: 15,
    period: '/月',
    features: [
      '无限制资源下载',
      '全站广告屏蔽',
      '基础云存储空间',
      '标准客户支持'
    ],
    popular: false,
    discount: null,
    discountDesc: '标准价格'
  },
  {
    id: 'quarterly',
    name: '季度会员',
    icon: 'fas fa-calendar-week',
    price: '¥40',
    originalPrice: 45,  // 15 * 3
    period: '/季度',
    features: [
      '月度会员所有特权',
      '额外云存储空间',
      '高级搜索功能',
      '优先资源访问'
    ],
    popular: false,
    discount: '9折优惠',
    discountDesc: '比月付节省¥5'
  },
  {
    id: 'half_yearly',
    name: '半年会员',
    icon: 'fas fa-calendar',
    price: '¥72',
    originalPrice: 90,  // 15 * 6
    period: '/半年',
    features: [
      '季度会员所有特权',
      '专属资源优先体验',
      '更大云存储空间',
      '高级技术支持'
    ],
    popular: false,
    discount: '8折优惠',
    discountDesc: '比月付节省¥18'
  },
  {
    id: 'yearly',
    name: '年度会员',
    icon: 'fas fa-calendar-alt',
    price: '¥115',
    originalPrice: 180,  // 15 * 12
    period: '/年',
    features: [
      '半年会员所有特权',
      '独家资源库访问',
      '个性化定制选项',
      '24/7专属支持',
      '年度专属徽章'
    ],
    popular: true,
    discount: '6.4折特惠',
    discountDesc: '比月付节省¥65'
  }
]);

// 支付方式列表
const paymentMethods = ref([
  { 
    id: 'alipay', 
    name: '支付宝', 
    description: '扫码快捷支付',
    icon: 'fab fa-alipay',
    recommended: true,
    color: '#1677ff'
  },
  { 
    id: 'wechat', 
    name: '微信支付', 
    description: '扫码安全支付',
    icon: 'fab fa-weixin',
    recommended: false,
    color: '#07c160'
  },
  { 
    id: 'usdt', 
    name: 'USDT', 
    description: 'TRC-20加密货币',
    icon: 'fas fa-coins',
    recommended: true,
    color: '#26a17b'
  }
]);

// 会员特权
const benefits = ref([
  { 
    icon: 'fas fa-download', 
    title: '无限制下载',
    description: '无限下载所有资源，包括软件、模板和素材'
  },
  { 
    icon: 'fas fa-gem', 
    title: '独家资源',
    description: '访问Premium专属资源库，获取独家内容'
  },
  { 
    icon: 'fas fa-search', 
    title: '高级搜索',
    description: '使用高级筛选器精准定位所需资源'
  },
  { 
    icon: 'fas fa-cloud', 
    title: '云存储',
    description: '无限制保存您的资源收藏'
  },
  { 
    icon: 'fas fa-rocket', 
    title: '优先访问',
    description: '新资源优先体验，热门内容抢先下载'
  },
  { 
    icon: 'fas fa-user-cog', 
    title: '个性化',
    description: '自定义个人主页和阅读体验'
  },
  { 
    icon: 'fas fa-ad', 
    title: '无广告',
    description: '全站去除广告，享受纯净浏览体验'
  },
  { 
    icon: 'fas fa-headset', 
    title: '专属支持',
    description: '24/7专属客服支持，快速解决问题'
  }
]);

// 响应式数据
const selectedPlan = ref('half_yearly');  // 默认选中半年
const selectedPayment = ref('alipay');
const orderCreated = ref(false);
const orderLoading = ref(false);
const isMobile = ref(false);
const transactionHash = ref('');
const verifyingHash = ref(false);

// 计算平台是否是移动设备
const checkMobile = () => {
  isMobile.value = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// 在组件挂载时检查
checkMobile();

// 计算属性
const currentPlan = computed(() => {
  return plans.value.find(p => p.id === selectedPlan.value) || plans.value[2];
});

const currentPlanPrice = computed(() => {
  return parseInt(currentPlan.value.price.replace('¥', ''));
});

const currentUSDTAmount = computed(() => {
  // 使用固定汇率7:1
  return (currentPlanPrice.value / 7).toFixed(2);
});

// 生成支付二维码的值
const paymentQRValue = computed(() => {
  // 实际使用时应该是后端生成的支付链接
  const planId = currentPlan.value.id;
  const amount = currentPlanPrice.value;
  return `https://example.com/pay?plan=${planId}&amount=${amount}&method=${selectedPayment.value}`;
});

// 选择套餐
const selectPlan = (planId: string) => {
  selectedPlan.value = planId;
  // 重置订单状态
  orderCreated.value = false;
};

// 选择支付方式
const selectPayment = (methodId: string) => {
  selectedPayment.value = methodId;
  // 重置订单状态
  orderCreated.value = false;
};

// 创建订单
const createOrder = () => {
  orderLoading.value = true;
  
  // 模拟API请求
  setTimeout(() => {
    orderLoading.value = false;
    orderCreated.value = true;
    // 这里应该有实际的订单创建逻辑
  }, 800);
};

// 打开支付宝支付
const openAlipay = () => {
  // 实际项目中，这里应该跳转到真实的支付宝支付页面
  window.location.href = `alipays://platformapi/startapp?appId=20000067&url=${encodeURIComponent(paymentQRValue.value)}`;
};

// 复制钱包地址
const copyAddress = () => {
  const address = 'TY76sVbBku8sLk3eY8XzH5qg9dF2jK1lMn';
  navigator.clipboard.writeText(address)
    .then(() => {
      // 使用Ant Design Vue的消息提示
      // message.success('钱包地址已复制到剪贴板');
      alert('钱包地址已复制到剪贴板');
    })
    .catch(err => {
      console.error('复制失败:', err);
    });
};

// 添加验证交易的方法
const verifyTransaction = () => {
  if (!transactionHash.value) {
    alert('请输入交易Hash');
    return;
  }
  
  verifyingHash.value = true;
  
  // 模拟API请求
  setTimeout(() => {
    verifyingHash.value = false;
    alert('交易验证提交成功，我们将尽快处理您的请求');
    // 实际项目中这里应该有真正的验证逻辑
  }, 1000);
};
</script>

<style lang="less" scoped>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap');

// 定义颜色变量
@primary-gradient: linear-gradient(135deg, #FF61D2, #7366FF);
@secondary-gradient: linear-gradient(135deg, #BF5AE0, #A811DA);
@text-dark: #2b2d42;
@text-light: #8d99ae;
@border-color: #f0f2f5;
@success-color: #4ade80;
@bg-light: #f8f9ff;
@card-bg: #ffffff;
@alipay-color: #1677ff;
@wechat-color: #07c160;
@usdt-color: #26a17b;

// 混入
.box-shadow {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
}

.gradient-text {
  background: @primary-gradient;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.premium-view {
  min-height: 100vh;
  padding: 20px 0;
 font-family: 'Open Sans', sans-serif;
}

.premium-container {
  max-width: 1200px;
  width: 100%;
  padding: 0 15px;
  margin: 0 auto;
}

.premium-header {
  text-align: center;
  margin-bottom: 30px;
  
  h1 {
    font-size: 2rem;
    margin-bottom: 12px;
    .gradient-text;
    font-weight: 700;
  }
  
  p {
    font-size: 0.95rem;
    color: @text-light;
    max-width: 600px;
    margin: 0 auto;
  }
}

// 套餐卡片优化
.plan-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  padding: 0;
  width: 100%;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 15px;
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.plan-card {
  background: @card-bg;
  border-radius: 12px;
  padding: 20px 15px;
  position: relative;
  transition: all 0.3s ease;
  .box-shadow;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
  }
  
  &.active {
    background-image: linear-gradient(145deg, #ffffff, #f0f5ff);
    transform: translateY(-5px);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: @primary-gradient;
      border-radius: 12px 12px 0 0;
    }
  }
  
  &.popular {
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: @primary-gradient;
      border-radius: 12px 12px 0 0;
    }
  }
}

.popular-tag {
  position: absolute;
  top: -10px;
  left: 50%;
  transform: translateX(-50%);
  background: @secondary-gradient;
  color: white;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  
  i {
    margin-right: 4px;
    font-size: 0.7rem;
  }
}

.plan-icon {
  width: 45px;
  height: 45px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 12px;
  background: @primary-gradient;
  color: white;
  font-size: 1.2rem;
}

.plan-card h3 {
  text-align: center;
  font-size: 1.1rem;
  margin-bottom: 6px;
  color: @text-dark;
  font-weight: 600;
}

.plan-price {
  text-align: center;
  margin-bottom: 3px;
  
  .amount {
    font-size: 1.6rem;
    font-weight: 700;
    .gradient-text;
  }
  
  .period {
    font-size: 0.9rem;
    color: @text-light;
  }
}

.discount-badge {
  text-align: center;
  margin-bottom: 5px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #FF61D2;
  
  i {
    margin-right: 4px;
    font-size: 0.75rem;
  }
}

.discount-desc {
  text-align: center;
  margin-bottom: 10px;
  font-size: 0.8rem;
  color: @text-light;
}

.plan-features {
  list-style: none;
  padding: 0;
  margin: 10px 0 0;
  
  li {
    padding: 5px 0;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    font-size: 0.8rem;
    color: @text-dark;
    
    i {
      color: @success-color;
      font-size: 0.8rem;
      margin-top: 3px;
      flex-shrink: 0;
    }
  }
}

.main-content {
  display: flex;
  gap: 20px;
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
}

.payment-section,
.benefits-section {
  background: @card-bg;
  border-radius: 12px;
  padding: 20px;
  .box-shadow;
}

.payment-section {
  flex: 6;
}

.benefits-section {
  flex: 4;
}

// 支付部分套餐选择下拉框
.payment-plan-select {
  margin-bottom: 15px;
  background: @bg-light;
  padding: 12px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  
  label {
    font-weight: 600;
    color: @text-dark;
    margin-right: 10px;
    font-size: 0.9rem;
    white-space: nowrap;
  }
  
  .plan-select {
    flex: 1;
    padding: 8px 12px;
    border-radius: 8px;
    border: 1px solid @border-color;
    background-color: white;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.2s ease;
    
    &:focus {
      border-color: #7366FF;
      outline: none;
      box-shadow: 0 0 0 2px rgba(115, 102, 255, 0.2);
    }
  }
  
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
    
    label {
      margin-bottom: 8px;
    }
    
    .plan-select {
      width: 100%;
    }
  }
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  
  i {
    font-size: 1.2rem;
    .gradient-text;
  }
  
  h2 {
    font-size: 1.2rem;
    font-weight: 700;
    .gradient-text;
  }
}

.payment-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 15px;
}

.payment-method {
  flex: 1 0 calc(50% - 5px);
  min-width: 0;
  background: @bg-light;
  border-radius: 10px;
  padding: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  position: relative;
  cursor: pointer;
  transition: all 0.25s ease;
  
  @media (max-width: 480px) {
    flex: 1 0 100%;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
  
  &.active {
    background-color: #f0f5ff;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    
    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 3px;
      height: 100%;
      background: @primary-gradient;
      border-radius: 10px 0 0 10px;
    }
  }
}

.method-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.method-info {
  flex-grow: 1;
  min-width: 0;
  
  h3 {
    font-size: 0.95rem;
    font-weight: 600;
    margin-bottom: 2px;
    color: @text-dark;
  }
  
  p {
    font-size: 0.75rem;
    color: @text-light;
    margin: 0;
  }
}

.method-recommended {
  position: absolute;
  top: -8px;
  right: 8px;
  background: @primary-gradient;
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.order-summary {
  background: @bg-light;
  border-radius: 10px;
  padding: 12px;
  margin-bottom: 15px;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
  
  i {
    font-size: 1rem;
    .gradient-text;
  }
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    color: @text-dark;
  }
}

.summary-details {
  .summary-row {
    display: flex;
    justify-content: space-between;
    padding: 6px 0;
    font-size: 0.85rem;
    color: @text-dark;
    
    &:not(:last-child) {
      border-bottom: 1px dashed rgba(141, 153, 174, 0.2);
    }
    
    &.highlight {
      font-weight: 600;
      
      .price {
        font-size: 1.1rem;
        .gradient-text;
      }
    }
    
    &.usdt {
      color: @usdt-color;
      font-weight: 500;
    }
    
    &.discount {
      color: #FF61D2;
    }
    
    .original-price {
      text-decoration: line-through;
      color: @text-light;
    }
  }
}

// 创建订单按钮
.create-order {
  margin-top: 15px;
  
  .create-order-btn {
    height: 38px;
    font-weight: 600;
    background: @primary-gradient;
    border: none;
    
    i {
      margin-right: 6px;
    }
    
    &:hover {
      opacity: 0.9;
      background: @primary-gradient;
    }
  }
}

.qr-section {
  display: flex;
  justify-content: center;
  margin: 15px 0;
}

.qr-container {
  text-align: center;
  
  p {
    margin: 8px 0;
    font-size: 0.85rem;
    color: @text-light;
  }
}

.qr-code-component {
  margin: 0 auto;
}

// 移动端唤起支付选项
.mobile-payment-option {
  margin: 10px 0;
  
  .open-alipay-btn {
    background-color: @alipay-color;
    border-color: @alipay-color;
    
    i {
      margin-right: 6px;
    }
  }
}

.payment-status {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
  
  .status-indicator {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: #FFC107;
    position: relative;
    
    &:after {
      content: '';
      position: absolute;
      top: -4px;
      left: -4px;
      right: -4px;
      bottom: -4px;
      border-radius: 50%;
      background: rgba(255, 193, 7, 0.3);
      animation: pulse 1.5s infinite;
    }
  }
  
  span {
    font-size: 0.85rem;
    color: #FFC107;
    font-weight: 500;
  }
}

.crypto-payment {
  margin: 15px 0;
}

.wallet-info {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.wallet-qr-wrap {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  margin-bottom: 5px;
}

.wallet-address-copy {
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
  
  .address {
    background: #f5f5f5;
    padding: 8px;
    border-radius: 8px;
    font-family: monospace;
    font-size: 0.75rem;
    text-align: center;
    word-break: break-all;
    max-width: 200px;
    flex: 1;
  }
  
  .copy-btn-inline {
    padding: 0 8px;
    height: 28px;
    width: 28px;
  }
}

.wallet-details {
  width: 100%;
}

.wallet-row {
  margin-bottom: 10px;
  
  .row-label {
    display: flex;
    align-items: center;
    gap: 5px;
    margin-bottom: 5px;
    font-size: 0.85rem;
    font-weight: 600;
    color: @text-dark;
    
    i {
      color: @usdt-color;
    }
  }
}

.network-type {
  display: inline-block;
  background: rgba(38, 161, 123, 0.1);
  color: @usdt-color;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

.amount-badge {
  display: inline-block;
  background: @usdt-color;
  color: white;
  padding: 6px 12px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 0.85rem;
}

.wallet-tip {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  padding: 10px;
  background: rgba(38, 161, 123, 0.1);
  border-radius: 8px;
  margin-top: 5px;
  
  i {
    color: @usdt-color;
    font-size: 0.85rem;
    margin-top: 2px;
  }
  
  span {
    font-size: 0.75rem;
    color: @usdt-color;
    line-height: 1.4;
  }
}

.secure-note {
  text-align: center;
  font-size: 0.75rem;
  color: @text-light;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 10px;
  
  i {
    color: @success-color;
  }
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
  
  @media (min-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.benefit-card {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  padding: 10px;
  background: @bg-light;
  border-radius: 10px;
  transition: all 0.3s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
}

.benefit-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: @primary-gradient;
  color: white;
  font-size: 0.9rem;
  flex-shrink: 0;
}

.benefit-content {
  flex-grow: 1;
  min-width: 0;
  
  h3 {
    font-size: 0.85rem;
    margin: 0 0 2px;
    font-weight: 600;
    .gradient-text;
  }
  
  p {
    font-size: 0.7rem;
    color: @text-light;
    margin: 0;
    line-height: 1.3;
  }
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

@media (max-width: 768px) {
  .premium-header h1 {
    font-size: 1.6rem;
  }
  
  .payment-section,
  .benefits-section {
    padding: 15px;
  }
  
  .benefits-section {
    margin-top: 15px;
  }
}

@media (max-width: 480px) {
  .premium-container { 
    padding: 0 10px;
  }
  
  .premium-header h1 {
    font-size: 1.4rem;
  }
  
  .premium-header p {
    font-size: 0.85rem;
  }
  
  .section-header h2 {
    font-size: 1.1rem;
  }
}
</style>



