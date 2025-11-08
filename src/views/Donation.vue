<template>
  <div class="donation-page">
    <div class="donation-content">
      <div class="content-wrapper">
        <div class="donation-form-section animate__animated animate__fadeInUp animate__fast">
          <a-card :bordered="false" class="form-card">
            <div class="card-header-custom animate__animated animate__fadeIn animate__fast"
              style="animation-delay: 0.1s;">
              <div class="header-main">
                <div class="header-icon">
                  <i class="fas fa-hand-holding-heart"></i>
                </div>
                <div class="header-content">
                  <h2 class="header-title">
                    <span>支持我们</span>
                  </h2>
                  <p class="header-subtitle">您的支持是我们前进的动力</p>
                </div>
              </div>

              <div class="header-tips">
                <div class="tip-item">
                  <i class="fas fa-check-circle"></i>
                  <span>捐赠记录实时同步</span>
                </div>
                <div class="tip-item">
                  <i class="fas fa-shield-alt"></i>
                  <span>信息加密存储</span>
                </div>
                <div class="tip-item">
                  <i class="fas fa-heart"></i>
                  <span>用于项目发展</span>
                </div>
              </div>
            </div>
            
            <div class="form-and-sidebar-wrapper">
            <div class="donation-form">
              <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
                <!-- 步骤条 -->
                <StepForm class="animate__animated animate__fadeIn animate__fast" style="animation-delay: 0.2s;"
                  :active="currentStep" :steps="[
                    { title: '选择方式', description: stepDescriptions[0] },
                    { title: '必填信息', description: stepDescriptions[1] },
                    { title: '可选信息', description: stepDescriptions[2] },
                    { title: '完成', description: stepDescriptions[3] || '提交成功' }
                  ]" />

                <!-- 步骤1: 选择捐赠方式 -->
                <div v-show="currentStep === 0" class="qrcode-section">
                  <el-row :gutter="16" class="qrcode-grid">
                    <el-col :xs="12" :sm="6" :md="6" class="animate__animated animate__fadeInUp animate__fast"
                      style="animation-delay: 0.2s;">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'cardkey' }"
                        @click="selectChannel('cardkey')">
                        <div class="qrcode-container">
                          <a-qrcode :value="qrCodeUrls.cardkey" :size="qrSize" :bordered="false" />
                          <div class="qrcode-icon icon-cardkey">
                            <i class="fas fa-gift"></i>
                          </div>
                        </div>
                        <div class="qrcode-tip">
                          <a href="https://www.qianxun1688.com/links/1C9EDE0B" target="_blank" class="card-link"
                            @click.stop>
                            购买卡密
                          </a>
                        </div>
                        <span class="channel-badge recommend">推荐</span>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6" class="animate__animated animate__fadeInUp animate__fast"
                      style="animation-delay: 0.35s;">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'crypto' }"
                        @click="selectChannel('crypto')">
                        <span class="channel-badge-left crypto-badge">
                          <i class="fab fa-bitcoin"></i>
                          <span>加密货币</span>
                        </span>
                        <div class="qrcode-container">
                          <a-qrcode :value="qrCodeUrls.crypto" :size="qrSize" :bordered="false" />
                          <div class="qrcode-icon icon-crypto">
                            <i class="fab fa-bitcoin"></i>
                          </div>
                        </div>
                        <div class="qrcode-tip">USDT TRC-20</div>
                        <span class="channel-badge recommend">推荐</span>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6" class="animate__animated animate__fadeInUp animate__fast"
                      style="animation-delay: 0.5s;">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'alipay' }"
                        @click="selectChannel('alipay')">
                        <div class="qrcode-container">
                          <a-qrcode :value="qrCodeUrls.alipay" :size="qrSize" :bordered="false" />
                          <div class="qrcode-icon icon-alipay">
                            <i class="fab fa-alipay"></i>
                          </div>
                        </div>
                        <div class="qrcode-tip">支付宝支付</div>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6" class="animate__animated animate__fadeInUp animate__fast"
                      style="animation-delay: 0.65s;">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'wechat' }"
                        @click="selectChannel('wechat')">
                        <div class="qrcode-container">
                          <a-qrcode :value="qrCodeUrls.wechat" :size="qrSize" :bordered="false" />
                          <div class="qrcode-icon icon-wechat">
                            <i class="fab fa-weixin"></i>
                          </div>
                        </div>
                        <div class="qrcode-tip">微信扫码支付</div>
                      </div>
                    </el-col>
                  </el-row>
                  <div class="step-actions step-1">
                    <el-button type="primary" :disabled="!selectedChannel" @click="nextStep">
                      <span>下一步</span>
                      <i class="fas fa-chevron-right"></i>
                    </el-button>
                  </div>
                </div>

                <!-- 步骤2: 必填信息 -->
                <div v-show="currentStep === 1" class="form-step-section">
                  <div v-if="selectedChannel === 'cardkey'">
                    <el-form-item label="卡密码" prop="card_key_code">
                      <el-input v-model="formData.card_key_code" placeholder="请输入卡密码，格式：ABCD-1234-EFGH-5678" clearable>
                        <template #prefix><i class="fas fa-key"></i></template>
                      </el-input>
                    </el-form-item>
                  </div>

                  <div v-else-if="selectedChannel === 'crypto'">
                    <div class="crypto-info-tips">
                      <div class="crypto-badge">
                        <i class="fas fa-coins"></i>
                        <div class="badge-text">
                          <span class="badge-label">币种</span>
                          <span class="badge-value">USDT</span>
                        </div>
                      </div>
                      <div class="crypto-badge network">
                        <i class="fas fa-network-wired"></i>
                        <div class="badge-text">
                          <span class="badge-label">区块网络</span>
                          <span class="badge-value">TRC20</span>
                        </div>
                      </div>
                    </div>
                    <el-form-item label="捐赠金额" prop="amount">
                      <el-input-number v-model="formData.amount" :min="1" :max="99999" :precision="2"
                        placeholder="请输入USDT金额" style="width: 100%" controls-position="right" />
                    </el-form-item>
                    <el-form-item label="交易哈希" prop="transaction_hash">
                      <el-input v-model="formData.transaction_hash" placeholder="请输入交易哈希值" clearable>
                        <template #prefix><i class="fas fa-hashtag"></i></template>
                      </el-input>
                    </el-form-item>
                  </div>

                  <div v-else-if="selectedChannel === 'wechat' || selectedChannel === 'alipay'">
                    <el-form-item label="捐赠金额" prop="amount">
                      <el-input-number v-model="formData.amount" :min="1" :max="99999" :precision="2"
                        placeholder="请输入捐赠金额" style="width: 100%" controls-position="right" />
                    </el-form-item>
                    <el-form-item label="订单号" prop="order_no">
                      <el-input v-model="formData.order_no" placeholder="请输入支付订单号" clearable>
                        <template #prefix><i class="fas fa-receipt"></i></template>
                      </el-input>
                    </el-form-item>
                  </div>

                  <div class="step-actions">
                    <el-button @click="prevStep">
                      <i class="fas fa-chevron-left"></i>
                      <span>上一步</span>
                    </el-button>
                    <el-button type="primary" @click="nextStep">
                      <span>下一步</span>
                      <i class="fas fa-chevron-right"></i>
                    </el-button>
                  </div>
                </div>

                <!-- 步骤3: 可选信息 -->
                <div v-show="currentStep === 2" class="form-step-section">
                  <div class="optional-section">
                    <el-collapse-transition>
                      <div v-show="showOptional" class="optional-content">
                        <el-form-item prop="donor_name">
                          <template #label>
                            <span class="label-with-badge">
                              您的昵称
                              <span class="optional-badge">可选</span>
                            </span>
                          </template>
                          <el-input v-model="formData.donor_name" placeholder="如：小明、张三" clearable>
                            <template #prefix><i class="fas fa-user"></i></template>
                          </el-input>
                          <div class="field-tip">
                            <i class="fas fa-lightbulb"></i>
                            <span>填写后将在捐赠榜上显示您的昵称</span>
                          </div>
                        </el-form-item>

                        <el-form-item prop="email">
                          <template #label>
                            <span class="label-with-badge">
                              邮箱地址
                              <span class="optional-badge">可选</span>
                            </span>
                          </template>
                          <el-input v-model="formData.email" placeholder="用于接收捐赠记录" clearable>
                            <template #prefix><i class="fas fa-envelope"></i></template>
                          </el-input>
                          <div class="field-tip">
                            <i class="fas fa-lightbulb"></i>
                            <span>我们将发送捐赠凭证到您的邮箱</span>
                          </div>
                        </el-form-item>

                        <el-form-item prop="remark">
                          <template #label>
                            <span class="label-with-badge">
                              留言
                              <span class="optional-badge">可选</span>
                            </span>
                          </template>
                          <el-input v-model="formData.remark" type="textarea" placeholder="分享您的想法或祝福" :rows="3"
                            :maxlength="200" show-word-limit />
                          <div class="field-tip">
                            <i class="fas fa-lightbulb"></i>
                            <span>您的留言可能会在捐赠列表中展示</span>
                          </div>
                        </el-form-item>
                      </div>
                    </el-collapse-transition>
                  </div>

                  <div class="privacy-options">
                    <el-checkbox v-model="formData.is_anonymous" :true-label="1" :false-label="0">
                      <span class="option-label"><i class="fas fa-user-secret"></i>匿名捐赠</span>
                    </el-checkbox>
                    <el-checkbox v-model="formData.is_public" :true-label="1" :false-label="0">
                      <span class="option-label"><i class="fas fa-globe"></i>公开展示</span>
                    </el-checkbox>
                  </div>

                  <div class="step-actions">
                    <el-button @click="prevStep">
                      <i class="fas fa-chevron-left"></i>
                      <span>上一步</span>
                    </el-button>
                    <el-button type="primary" :loading="submitting" @click="handleSubmit">
                      <span>{{ submitting ? '提交中...' : '提交捐赠' }}</span>
                      <i v-if="!submitting" class="fas fa-paper-plane"></i>
                    </el-button>
                  </div>
                </div>
              </el-form>
            </div>
            
            <div class="donation-info-section">
          <!-- 统计卡片 -->
          <div class="sidebar-widget stats-widget">
            <div class="widget-header">
              <i class="fas fa-chart-line"></i>
              <span>捐赠数据</span>
            </div>
            <div class="stats-grid">
              <div class="stat-item animate__animated animate__zoomIn animate__fast" style="animation-delay: 0.2s;">
                <div class="stat-icon"
                  style="background: linear-gradient(135deg, rgba(22, 119, 255, 0.1), rgba(22, 119, 255, 0.2)); color: #1677ff;">
                  <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">1,234</div>
                  <div class="stat-label">支持者</div>
                </div>
              </div>
              <div class="stat-item animate__animated animate__zoomIn animate__fast" style="animation-delay: 0.35s;">
                <div class="stat-icon"
                  style="background: linear-gradient(135deg, rgba(82, 196, 26, 0.1), rgba(82, 196, 26, 0.2)); color: #52c41a;">
                  <i class="fas fa-coins"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">￥56,789</div>
                  <div class="stat-label">累计金额</div>
                </div>
              </div>
              <div class="stat-item animate__animated animate__zoomIn animate__fast" style="animation-delay: 0.5s;">
                <div class="stat-icon"
                  style="background: linear-gradient(135deg, rgba(250, 140, 22, 0.1), rgba(250, 140, 22, 0.2)); color: #fa8c16;">
                  <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">328</div>
                  <div class="stat-label">本月捐赠</div>
                </div>
              </div>
              <div class="stat-item animate__animated animate__zoomIn animate__fast" style="animation-delay: 0.65s;">
                <div class="stat-icon"
                  style="background: linear-gradient(135deg, rgba(114, 46, 209, 0.1), rgba(114, 46, 209, 0.2)); color: #722ed1;">
                  <i class="fas fa-trophy"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">¥1,888</div>
                  <div class="stat-label">最高单笔</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 捐赠榜/最近捐赠 - Tab切换 -->
          <div class="sidebar-widget activity-widget">
            <div class="activity-tabs">
              <div class="tab-item" :class="{ active: activeTab === 'ranking' }" @click="activeTab = 'ranking'">
                <i class="fas fa-crown"></i>
                <span>捐赠榜</span>
              </div>
              <div class="tab-item" :class="{ active: activeTab === 'recent' }" @click="activeTab = 'recent'">
                <i class="fas fa-history"></i>
                <span>最近捐赠</span>
              </div>
            </div>

            <div class="activity-content">
              <!-- 捐赠榜 -->
              <div v-show="activeTab === 'ranking'" class="ranking-list">
                <div v-for="(item, index) in topDonors" :key="item.id"
                  class="ranking-item animate__animated animate__fadeInLeft animate__fast"
                  :style="`animation-delay: ${index * 0.15}s;`">
                  <div class="ranking-badge" :class="`rank-${index + 1}`">
                    <span v-if="index < 3">
                      <i v-if="index === 0" class="fas fa-crown"></i>
                      <i v-else-if="index === 1" class="fas fa-medal"></i>
                      <i v-else class="fas fa-award"></i>
                    </span>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <div class="ranking-avatar" :class="{ anonymous: item.is_anonymous }">
                    <i v-if="item.is_anonymous" class="fas fa-user-secret"></i>
                    <span v-else>{{ item.name.charAt(0) }}</span>
                  </div>
                  <div class="ranking-info">
                    <div class="ranking-name">
                      {{ item.is_anonymous ? '匿名用户' : item.name }}
                      <i v-if="item.email" class="fas fa-envelope-circle-check" title="已留邮箱"></i>
                    </div>
                    <div class="ranking-channel">
                      <i v-if="item.channel === 'cardkey'" class="fas fa-key"></i>
                      <i v-else-if="item.channel === 'crypto'" class="fab fa-bitcoin"></i>
                      <i v-else-if="item.channel === 'alipay'" class="fab fa-alipay"></i>
                      <i v-else-if="item.channel === 'wechat'" class="fab fa-weixin"></i>
                      <span>{{ getChannelName(item.channel) }}</span>
                    </div>
                  </div>
                  <div class="ranking-amount">{{ item.channel === 'crypto' ? '$' : '¥' }}{{ item.amount }}</div>
                </div>
              </div>

              <!-- 最近捐赠 -->
              <div v-show="activeTab === 'recent'" class="recent-list">
                <div v-for="item in recentDonations" :key="item.id"
                  class="recent-item animate__animated animate__fadeInLeft animate__fast"
                  :style="`animation-delay: ${recentDonations.indexOf(item) * 0.15}s;`">
                  <div class="recent-avatar" :class="{ anonymous: item.is_anonymous }">
                    <i v-if="item.is_anonymous" class="fas fa-user-secret"></i>
                    <span v-else>{{ item.name.charAt(0) }}</span>
                  </div>
                  <div class="recent-info">
                    <div class="recent-name">
                      {{ item.is_anonymous ? '匿名用户' : item.name }}
                      <i v-if="item.email" class="fas fa-envelope-circle-check" title="已留邮箱"></i>
                    </div>
                    <div class="recent-meta">
                      <span class="recent-channel" :class="`channel-${item.channel}`">
                        <i v-if="item.channel === 'cardkey'" class="fas fa-key"></i>
                        <i v-else-if="item.channel === 'crypto'" class="fab fa-bitcoin"></i>
                        <i v-else-if="item.channel === 'alipay'" class="fab fa-alipay"></i>
                        <i v-else-if="item.channel === 'wechat'" class="fab fa-weixin"></i>
                      </span>
                      <span class="recent-time">
                        <i class="fas fa-clock"></i>
                        {{ item.time }}
                      </span>
                    </div>
                  </div>
                  <div class="recent-amount">{{ item.channel === 'crypto' ? '$' : '¥' }}{{ item.amount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
          </a-card>
        </div>
      </div>
    </div>

    <CelebrationModal v-model:visible="showCelebration" :title="celebrationData.title"
      :message="celebrationData.message" :sub-message="celebrationData.subMessage" :details="celebrationData.details"
      :actions="celebrationData.actions" type="celebration" :show-confetti="true" @close="handleCelebrationClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'element-plus'
import { addDonationR } from '@/request/donation'
import type { DonationChannel, DonationFormData, CelebrationDetail, CelebrationAction } from '@/types/donation'
import CelebrationModal from '@/components/common/CelebrationModal.vue'
import StepForm from '@/components/StepForm.vue'

// QR Code URLs for different payment methods
const qrCodeUrls = {
  alipay: 'https://qr.alipay.com/2m611879glsa53vvau4ux69',
  wechat: 'wxp://f2f0xVBAYEhdffGHmomPankQ6VnmvlDEBRIv9CmY0ZJbrQQ',
  crypto: 'TZfRzskyPjHCE8Kf3PjpfEE4RdVVV8H9Eu', // USDT TRC-20 address
  cardkey: 'https://www.qianxun1688.com/links/1C9EDE0B'
}

// Responsive QR code size
const windowWidth = ref(window.innerWidth)
const qrSize = computed(() => {
  if (windowWidth.value < 768) {
    return 130 // Mobile
  }
  return 170 // Desktop
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
}

onMounted(() => {
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const formRef = ref<FormInstance>()
const selectedChannel = ref<DonationChannel>('cardkey')
const submitting = ref(false)
const showOptional = ref(true)
const currentStep = ref(0)

const channelLabels: Record<string, string> = {
  cardkey: '卡密兑换',
  crypto: 'USDT(TRC20)',
  wechat: '微信支付',
  alipay: '支付宝'
}

const stepDescriptions = computed(() => [
  selectedChannel.value ? `当前选择：${channelLabels[selectedChannel.value]}` : '请选择一种捐赠方式',
  selectedChannel.value ? '填写必要的支付信息' : '等待选择方式',
  '填写个人信息（可选）'
])

const formData = reactive<Partial<DonationFormData>>({
  channel: 'cardkey' as DonationChannel,
  donor_name: '',
  email: '',
  amount: undefined,
  order_no: '',
  crypto_type: undefined,
  crypto_network: undefined,
  transaction_hash: '',
  card_key_code: '',
  is_anonymous: 0,
  is_public: 1,
  remark: ''
})

const formRules = computed(() => {
  const rules: any = {
    email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }]
  }

  if (selectedChannel.value === 'cardkey') {
    rules.card_key_code = [{ required: true, message: '请输入卡密码', trigger: 'blur' }]
  } else if (selectedChannel.value === 'crypto') {
    rules.amount = [
      { required: true, message: '请输入USDT金额', trigger: 'blur' }
    ]
    rules.transaction_hash = [
      { required: true, message: '请输入交易哈希', trigger: 'blur' }
    ]
  } else if (selectedChannel.value === 'wechat' || selectedChannel.value === 'alipay') {
    rules.amount = [{ required: true, message: '请输入捐赠金额', trigger: 'blur' }]
    rules.order_no = [{ required: true, message: '请输入订单号', trigger: 'blur' }]
  }

  return rules
})

const recentDonations = ref([
  { id: 1, name: '热心网友', amount: 100, time: '5分钟前', channel: 'wechat', is_anonymous: false, email: true },
  { id: 2, name: '张三', amount: 50, time: '1小时前', channel: 'alipay', is_anonymous: false, email: false },
  { id: 3, name: '匿名用户', amount: 200, time: '2小时前', channel: 'crypto', is_anonymous: true, email: false },
  { id: 4, name: '李四', amount: 88, time: '3小时前', channel: 'cardkey', is_anonymous: false, email: true },
  { id: 5, name: '王五', amount: 66, time: '5小时前', channel: 'wechat', is_anonymous: false, email: false }
])

const topDonors = ref([
  { id: 1, name: '张大豪', amount: 5888, channel: 'crypto', is_anonymous: false, email: true },
  { id: 2, name: '李大富', amount: 3666, channel: 'wechat', is_anonymous: false, email: false },
  { id: 3, name: '王大人', amount: 2888, channel: 'cardkey', is_anonymous: false, email: true },
  { id: 4, name: '匿名用户', amount: 1888, channel: 'alipay', is_anonymous: true, email: false },
  { id: 5, name: '刘女士', amount: 999, channel: 'wechat', is_anonymous: false, email: true }
])

const getChannelName = (channel: string) => {
  const names: Record<string, string> = {
    cardkey: '卡密',
    crypto: 'USDT',
    wechat: '微信',
    alipay: '支付宝'
  }
  return names[channel] || channel
}

const activeTab = ref<'ranking' | 'recent'>('ranking')

const showCelebration = ref(false)
const celebrationData = reactive<{ title: string; message: string; subMessage: string; details: CelebrationDetail[]; actions: CelebrationAction[] }>({
  title: '🎉 捐赠成功！',
  message: '星光不负赶路人',
  subMessage: '每一份温暖，都将点亮前行的灯火',
  details: [],
  actions: []
})

const selectChannel = (channel: DonationChannel) => {
  selectedChannel.value = channel
  formData.channel = channel
  formRef.value?.resetFields()
  formData.channel = channel
}

const nextStep = async () => {
  // 步骤0：只需要选择支付方式
  if (currentStep.value === 0) {
    if (!selectedChannel.value) {
      message.warning('请选择支付方式')
      return
    }
    currentStep.value++
    return
  }

  // 步骤1：验证必填字段
  if (currentStep.value === 1) {
    try {
      // 根据支付方式验证对应的必填字段
      const fieldsToValidate: string[] = []

      if (selectedChannel.value === 'cardkey') {
        fieldsToValidate.push('card_key_code')
      } else if (selectedChannel.value === 'crypto') {
        fieldsToValidate.push('amount', 'transaction_hash')
      } else if (selectedChannel.value === 'wechat' || selectedChannel.value === 'alipay') {
        fieldsToValidate.push('amount', 'order_no')
      }

      // 只验证必填字段
      await formRef.value?.validateField(fieldsToValidate)
      currentStep.value++
    } catch (error) {
      message.warning('请完善必填信息')
    }
    return
  }
}

const prevStep = () => {
  if (currentStep.value > 0) {
    currentStep.value--
  }
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    submitting.value = true

    const submitData: DonationFormData = {
      channel: selectedChannel.value,
      donor_name: formData.donor_name || '',
      email: formData.email,
      is_anonymous: formData.is_anonymous ? 1 : 0,
      is_public: formData.is_public ? 1 : 0,
      remark: formData.remark
    }

    if (selectedChannel.value === 'cardkey') {
      submitData.card_key_code = formData.card_key_code
    } else if (selectedChannel.value === 'wechat' || selectedChannel.value === 'alipay') {
      submitData.amount = formData.amount
      submitData.order_no = formData.order_no
    } else if (selectedChannel.value === 'crypto') {
      submitData.amount = formData.amount
      submitData.crypto_type = 'USDT'
      submitData.crypto_network = 'TRC20'
      submitData.transaction_hash = formData.transaction_hash
    }

    const response = await addDonationR(submitData)

    if (response.code === 200) {
      celebrationData.title = '🎉 捐赠成功！'
      celebrationData.message = '星光不负赶路人'
      celebrationData.subMessage = '每一份温暖，都将点亮前行的灯火'
      celebrationData.details = [
        { label: '捐赠编号', value: response.data.donation_no, icon: 'fas fa-hashtag' },
        { label: '捐赠金额', value: response.data.card_key_value ? `¥${response.data.card_key_value}` : `¥${formData.amount}`, icon: 'fas fa-coins' },
        { label: '捐赠状态', value: response.data.status === 0 ? '待确认' : '已确认', icon: 'fas fa-check-circle' }
      ]
      celebrationData.actions = [
        { text: '查看记录', type: 'primary', icon: 'fas fa-list', handler: () => { showCelebration.value = false; message.info('捐赠记录功能开发中') } },
        { text: '继续捐赠', icon: 'fas fa-redo', handler: () => { showCelebration.value = false; formRef.value?.resetFields() } }
      ]

      showCelebration.value = true
      formRef.value?.resetFields()
      formData.channel = selectedChannel.value
      // 重置步骤
      setTimeout(() => {
        currentStep.value = 0
      }, 2000)
    } else {
      message.error(response.message || '捐赠失败，请重试')
    }
  } catch (error: any) {
    console.error('捐赠提交失败:', error)
    if (error.errorFields) {
      message.warning('请完善表单信息')
    } else {
      message.error(error.message || '捐赠失败，请重试')
    }
  } finally {
    submitting.value = false
  }
}

const handleCelebrationClose = () => {
  showCelebration.value = false
}
</script>

<style scoped lang="less">
.donation-page {
  // 统一设计变量 - 直接使用全局 CSS 变量
  --theme-color: var(--theme-purple-primary);
  --theme-color-light-3: var(--theme-purple-light-3);
  --theme-color-light-5: var(--theme-purple-light-5);
  --theme-color-light-7: var(--theme-purple-light-7);
  --theme-color-light-9: var(--theme-purple-light-9);
  --theme-secondary: var(--theme-purple-secondary);
  --theme-accent: #3b82f6;

  // 统一间距 - 缩小
  --spacing-xs: 6px;
  --spacing-sm: 10px;
  --spacing-md: 14px;
  --spacing-lg: 20px;

  // 统一圆角
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 12px;

  // 统一字号 - 缩小
  --font-xs: 11px;
  --font-sm: 12px;
  --font-md: 13px;
  --font-lg: 14px;
  --font-xl: 16px;

  // 覆盖 Element Plus 全局主题色 - 直接使用全局 CSS 变量
  --el-color-primary: var(--theme-purple-primary);
  --el-color-primary-light-3: var(--theme-purple-light-3);
  --el-color-primary-light-5: var(--theme-purple-light-5);
  --el-color-primary-light-7: var(--theme-purple-light-7);
  --el-color-primary-light-8: var(--theme-purple-light-9);
  --el-color-primary-light-9: var(--theme-purple-light-9);
  --el-color-primary-dark-2: var(--theme-purple-primary);

  min-height: 100vh;
  padding: var(--spacing-md) 0;
  background: var(--el-bg-color-page);
  position: relative;
  overflow-x: hidden;

  &::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background:
      radial-gradient(circle at 20% 30%, var(--theme-orange-overlay) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, var(--theme-orange-bg-2) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }


  .donation-content {
    max-width: 1440px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    position: relative;
    z-index: 1;

    .content-wrapper {
      display: block;
    }
  }
  
  .form-and-sidebar-wrapper {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    
    @media (min-width: 1024px) {
      grid-template-columns: 1fr 320px;
      gap: 24px;
    }
  }

  .card-header-custom {
    padding: 20px;
    margin-bottom: var(--spacing-md);
    background: linear-gradient(135deg,
        var(--theme-orange-bg-2) 0%,
        var(--theme-orange-bg-1) 100%);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 12px;
    position: relative;
    overflow: hidden;

    .header-main {
      display: flex;
      align-items: center;
      gap: 14px;
      margin-bottom: 16px;

      .header-icon {
        width: 48px;
        height: 48px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(135deg,
            var(--el-color-primary) 0%,
            var(--theme-secondary) 100%);
        border-radius: 12px;
        flex-shrink: 0;
        box-shadow: 0 4px 12px var(--theme-orange-glow);
        position: relative;
        animation: iconPulse 3s ease-in-out infinite;

        &::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: inherit;
          border-radius: inherit;
          opacity: 0.2;
          z-index: -1;
        }

        i {
          color: #fff;
          font-size: 22px;
          animation: heartBeat 2s ease-in-out infinite;
        }
      }

      .header-content {
        flex: 1;
        min-width: 0;

        .header-title {
          font-size: 18px;
          font-weight: 700;
          background: linear-gradient(135deg,
              var(--el-color-primary) 0%,
              var(--theme-secondary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 4px 0;
          line-height: 1.3;
          letter-spacing: 0.5px;
        }

        .header-subtitle {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          margin: 0;
          line-height: 1.4;
          font-weight: 500;
        }
      }
    }

    .header-tips {
      display: flex;
      align-items: center;
      gap: 10px;
      flex-wrap: wrap;

      .tip-item {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 6px 14px;
        background: linear-gradient(135deg,
            var(--theme-orange-bg-3) 0%,
            var(--theme-orange-bg-2) 100%);
        border: 1.5px solid transparent;
        border-radius: 20px;
        position: relative;
        opacity: 0;
        animation: tipSlideIn 0.5s ease forwards;
        cursor: default;
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        overflow: hidden;

        &:nth-child(1) {
          animation-delay: 0.2s;
        }

        &:nth-child(2) {
          animation-delay: 0.35s;
        }

        &:nth-child(3) {
          animation-delay: 0.5s;
        }

        &::before {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: inherit;
          padding: 1.5px;
          background: linear-gradient(135deg,
              var(--el-color-primary-light-3),
              var(--theme-secondary));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.35s ease;
        }

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg,
              var(--theme-orange-border-3) 0%,
              var(--theme-orange-border-2) 100%);
          opacity: 0;
          transition: opacity 0.35s ease;
          z-index: 0;
        }

        i {
          color: var(--el-color-primary);
          font-size: 13px;
          flex-shrink: 0;
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 1;
        }

        span {
          font-size: 11px;
          font-weight: 600;
          color: var(--el-text-color-regular);
          line-height: 1.3;
          white-space: nowrap;
          transition: all 0.35s ease;
          position: relative;
          z-index: 1;
        }

        &:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 4px 16px var(--theme-orange-shadow);

          &::before {
            opacity: 1;
          }

          &::after {
            opacity: 1;
          }

          i {
            transform: scale(1.15) rotate(-10deg);
            color: var(--theme-secondary);
          }

          span {
            color: var(--el-color-primary);
            letter-spacing: 0.3px;
          }
        }
      }
    }
  }

  @keyframes tipSlideIn {
    0% {
      opacity: 0;
      transform: translateX(-20px);
    }

    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }

  @keyframes tabIconBounce {

    0%,
    100% {
      transform: scale(1);
    }

    25% {
      transform: scale(0.9) rotate(-5deg);
    }

    50% {
      transform: scale(1.1) rotate(5deg);
    }

    75% {
      transform: scale(1.05) rotate(-3deg);
    }
  }


  @keyframes iconPulse {

    0%,
    100% {
      transform: scale(1);
      box-shadow: 0 4px 12px var(--theme-orange-glow);
    }

    50% {
      transform: scale(1.05);
      box-shadow: 0 6px 20px var(--theme-orange-glow);
    }
  }

  @keyframes heartBeat {

    0%,
    100% {
      transform: scale(1);
    }

    10%,
    30% {
      transform: scale(1.1);
    }

    20%,
    40% {
      transform: scale(1);
    }
  }



  // 使用animate.css统一动画 - 快速流畅
  .animate__animated {
    --animate-duration: 0.5s;
  }


  .form-card,
  .info-card {
    border-radius: var(--radius-lg);
    overflow: hidden;
    background: var(--el-bg-color);
    border: 1px solid var(--el-border-color-lighter);
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03),
      0 0 1px rgba(0, 0, 0, 0.02);

    :deep(.ant-card-head) {
      background: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color);
      padding: var(--spacing-md) var(--spacing-lg);
      min-height: auto;

      .card-title {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        color: var(--el-text-color-primary);
        font-size: var(--font-lg);
        font-weight: 600;

        i {
          font-size: var(--font-xl);
          color: var(--theme-color);
        }
      }
    }

    :deep(.ant-card-body) {
      padding: 16px;
    }
  }


  .qrcode-section {
    margin-bottom: var(--spacing-md);

    .qrcode-grid {
      :deep(.el-col) {
        margin-bottom: 16px;

        @media (min-width: 768px) {
          margin-bottom: 0;
        }
      }
    }

      .qrcode-item {
        cursor: pointer;
        position: relative;
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 14px;
        background: var(--el-fill-color-blank);
        border: 2px solid var(--el-border-color-light);
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 12px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02);
        overflow: hidden;

        @media (max-width: 768px) {
          padding: 10px;
          border-radius: 10px;
        }

        &:hover {
          border-color: var(--el-color-primary-light-7);
          box-shadow: 0 6px 24px var(--theme-orange-border-2), 0 2px 8px var(--theme-orange-bg-3);
          transform: translateY(-4px);

          @media (max-width: 768px) {
            transform: translateY(-2px);
            box-shadow: 0 4px 16px var(--theme-orange-border-2);
          }
        }

        &.active {
          border-color: var(--el-color-primary);
          box-shadow: 0 6px 24px var(--theme-orange-shadow), 
                      0 2px 8px var(--theme-orange-border-2),
                      0 0 0 4px var(--theme-orange-bg-3);
          transform: translateY(-2px);
        }

      .qrcode-container {
        position: relative;
        display: inline-block;
        margin-bottom: 8px;
        line-height: 0;

        @media (max-width: 768px) {
          margin-bottom: 6px;
        }

        :deep(.ant-qrcode) {
          display: block;
          
          canvas {
            display: block !important;
          }
        }

        .qrcode-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
          pointer-events: none;

          i {
            font-size: 22px;
          }

          &.icon-alipay i {
            color: #1677ff;
          }

          &.icon-wechat i {
            color: #09bb07;
          }

          &.icon-crypto i {
            color: #f7931a;
          }

          &.icon-cardkey i {
            color: #ff6b35;
          }

          @media (max-width: 768px) {
            width: 24px;
            height: 24px;
            border-radius: 4px;

            i {
              font-size: 14px;
            }
          }
        }
      }

      .qrcode-tip {
        font-size: 11px;
        font-weight: 500;
        color: var(--el-text-color-regular);
        text-align: center;
        line-height: 1.4;
        margin-top: 2px;

        @media (max-width: 768px) {
          font-size: 10px;
          margin-top: 0;
        }

        .card-link {
          color: var(--el-color-primary);
          text-decoration: none;
          transition: all 0.2s ease;

          &:hover {
            color: var(--el-color-primary-light-3);
            text-decoration: underline;
          }
        }
      }

      .channel-badge.recommend {
        position: absolute;
        top: 6px;
        right: 6px;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 9px;
        font-weight: 600;
        line-height: 1;
        background: linear-gradient(135deg, #ff6b6b, #ff8787);
        color: #fff;
        box-shadow: 0 2px 4px rgba(255, 107, 107, 0.3);
      }

      .channel-badge-left {
        position: absolute;
        top: 6px;
        left: 6px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 2px 6px;
        border-radius: 10px;
        font-size: 9px;
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
        z-index: 2;
        box-shadow: 0 2px 4px var(--theme-orange-shadow);

        &.crypto-badge {
          background: var(--el-color-primary);
          color: #fff;

          i {
            font-size: 10px;
          }
        }
      }
    }
  }

  .crypto-info-tips {
    display: inline-flex;
    gap: 6px;
    margin-bottom: var(--spacing-sm);

    .crypto-badge {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      padding: 4px 8px;
      background: rgba(103, 194, 58, 0.08);
      border: 1px solid rgba(103, 194, 58, 0.15);
      border-radius: 12px;
      transition: all 0.2s ease;

      &:hover {
        transform: translateY(-1px);
        box-shadow: 0 2px 8px rgba(103, 194, 58, 0.2);
      }

      i {
        font-size: 11px;
        color: #67c23a;
        flex-shrink: 0;
      }

      .badge-text {
        display: flex;
        align-items: center;
        gap: 2px;

        .badge-label {
          font-size: 9px;
          color: var(--el-text-color-secondary);
        }

        .badge-value {
          font-size: 10px;
          font-weight: 600;
          color: #67c23a;
        }
      }

      &.network {
        background: var(--el-color-primary-light-9);
        border-color: var(--el-color-primary-light-5);

        i {
          color: var(--el-color-primary);
        }

        .badge-text .badge-value {
          color: var(--el-color-primary);
        }
      }
    }
  }

  .optional-section {
    margin-bottom: var(--spacing-sm);

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      background: var(--el-fill-color-light);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;

      &:hover {
        background: var(--el-fill-color);
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 10px;
        color: var(--el-text-color-regular);

        i {
          color: var(--el-color-info);
          font-size: 11px;
        }
      }

      >i {
        color: var(--el-text-color-secondary);
        font-size: 9px;
        transition: transform 0.2s ease;
      }
    }

    .optional-content {
      padding-top: 10px;
    }
  }

  .label-with-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;

    .optional-badge {
      display: inline-flex;
      align-items: center;
      padding: 2px 6px;
      font-size: 9px;
      font-weight: 500;
      color: var(--el-color-info);
      background: var(--el-color-info-light-9);
      border: 1px solid var(--el-color-info-light-7);
      border-radius: 3px;
      line-height: 1;
    }
  }

  .field-tip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin-top: 6px;
    padding: 3px 8px 3px 4px;
    background: linear-gradient(135deg,
        var(--theme-orange-bg-1) 0%,
        var(--theme-orange-bg-2) 100%);
    border-radius: 6px;
    font-size: 10px;
    color: rgba(0, 0, 0, 0.65);
    line-height: 1.4;
    transition: all 0.2s ease;

    &:hover {
      background: linear-gradient(135deg,
          var(--theme-orange-bg-3) 0%,
          var(--theme-orange-border-2) 100%);
    }

    i {
      color: var(--el-color-primary);
      font-size: 12px;
      flex-shrink: 0;
    }

    span {
      font-weight: 500;
    }
  }

  .privacy-notice {
    display: flex;
    align-items: center;
    gap: var(--spacing-sm);
    padding: var(--spacing-md);
    background: var(--el-color-info-light-9);
    border: 1.5px solid var(--el-color-info-light-5);
    border-left: 3px solid var(--el-color-info);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-md);
    font-size: var(--font-sm);
    color: var(--el-text-color-regular);

    i {
      color: var(--el-color-info);
      font-size: var(--font-lg);
      flex-shrink: 0;
    }

    span {
      line-height: 1.6;
    }
  }

  .donation-form {
    :deep(.el-form-item) {
      margin-bottom: var(--spacing-md);

      .el-form-item__error {
        position: relative;
        z-index: 1;
        font-size: var(--font-xs);
        padding-top: 6px;
        line-height: 1.5;
      }

      .el-form-item__content {
        line-height: normal;
      }
    }

    :deep(.el-form-item__label) {
      font-weight: 600;
      font-size: var(--font-xs);
      color: var(--el-text-color-primary);
      padding-bottom: 4px;
      margin-bottom: 6px;
      line-height: 1.5;
    }

    :deep(.el-input__wrapper) {
      background: var(--el-fill-color-blank);
      border: 1px solid var(--el-border-color);
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--el-border-color-hover);
      }

      &.is-focus {
        border-color: var(--el-color-primary);
        box-shadow: 0 0 0 2px var(--el-color-primary-light-9);
      }
    }

    :deep(.el-input__inner),
    :deep(.el-textarea__inner) {
      font-size: var(--font-xs);
      color: var(--el-text-color-primary);
    }

    :deep(.el-textarea__wrapper) {
      background: var(--el-fill-color-blank);
      border: 1px solid var(--el-border-color);
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
      padding: var(--spacing-sm);

      &:hover {
        border-color: var(--el-border-color-hover);
      }

      &.is-focus {
        border-color: var(--el-color-primary);
        box-shadow: 0 0 0 2px var(--el-color-primary-light-9);
      }
    }

    :deep(.el-input__prefix) {
      color: var(--el-text-color-placeholder);
    }

    :deep(.el-input-number) {
      width: 100%;

      .el-input__inner {
        text-align: left;
      }
    }

    .privacy-options {
      display: flex;
      gap: var(--spacing-md);
      margin-bottom: var(--spacing-md);
      padding: 10px;
      background: var(--el-fill-color-light);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: var(--radius-sm);

      :deep(.el-checkbox) {
        .el-checkbox__label {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          color: var(--el-text-color-regular);
          font-weight: 500;

          i {
            color: var(--el-color-primary);
            font-size: 11px;
          }
        }

        .el-checkbox__inner {
          width: 14px;
          height: 14px;
          border-radius: 3px;

          &::after {
            width: 3px;
            height: 6px;
            left: 4px;
            top: 1px;
          }
        }

        &.is-checked {
          .el-checkbox__inner {
            background: var(--el-color-primary);
            border-color: var(--el-color-primary);
          }
        }
      }
    }

    .step-actions {
      display: flex;
      justify-content: flex-end;
      gap: 10px;
      margin-top: 12px;

      :deep(.el-button) {
        height: 32px;
        font-size: 12px;
        font-weight: 500;
        border-radius: 6px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        padding: 0 16px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        position: relative;

        span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        i {
          font-size: 12px;
          line-height: 1;
          display: inline-flex;
          align-items: center;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        &.el-button--primary {
          background: var(--el-fill-color-light);
          border: 1px solid var(--el-border-color-lighter);
          color: var(--el-color-primary);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);

          &::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 6px;
            background: linear-gradient(135deg, var(--el-color-primary), var(--el-color-primary-light-3));
            opacity: 0;
            transition: opacity 0.3s ease;
            z-index: -1;
          }

          &:hover:not(:disabled) {
            border-color: transparent;
            color: #fff;
            transform: translateY(-2px);
            box-shadow: 0 4px 12px var(--theme-orange-shadow);

            &::after {
              opacity: 1;
            }

            i {
              transform: translateX(3px);
            }
          }

          &:active {
            transform: translateY(0);
          }

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
          }
        }

        &.el-button--default {
          background: var(--el-fill-color-blank);
          border: 1px solid var(--el-border-color-lighter);
          color: var(--el-text-color-regular);
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.04);

          &:hover {
            background: var(--el-fill-color-light);
            border-color: var(--el-border-color);
            color: var(--el-color-primary);

            i {
              transform: translateX(-3px);
            }
          }
        }
      }
    }
  }

  .donation-info-section {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .sidebar-widget {
    background: var(--el-bg-color);
    border-radius: var(--radius-md);
    padding: 14px;
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.03),
      0 0 1px rgba(0, 0, 0, 0.02);
    border: 1px solid var(--el-border-color-lighter);

    .widget-header {
      display: flex;
      align-items: center;
      gap: 6px;
      margin-bottom: 12px;
      padding-bottom: 8px;
      border-bottom: 1px solid var(--el-border-color-lighter);

      i {
        color: var(--el-color-primary);
        font-size: var(--font-md);
      }

      span {
        font-size: var(--font-md);
        font-weight: 600;
        color: var(--el-text-color-primary);
      }
    }
  }

  .stats-widget {
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 12px 14px;
        background: var(--el-fill-color-blank);
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px var(--theme-orange-border-2);

          .stat-icon {
            transform: scale(1.08);
          }
        }

        .stat-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          flex-shrink: 0;
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

          i {
            font-size: 16px;
          }
        }

        .stat-info {
          display: flex;
          flex-direction: column;
          gap: 2px;
          flex: 1;

          .stat-value {
            font-size: 16px;
            font-weight: normal;
            color: var(--el-text-color-primary);
            line-height: 1.3;
          }

          .stat-label {
            font-size: 11px;
            font-weight: normal;
            color: var(--el-text-color-secondary);
            line-height: 1;
          }
        }
      }
    }
  }


  .activity-widget {
    .activity-tabs {
      display: flex;
      gap: 6px;
      margin-bottom: 14px;
      padding: 4px;
      background: linear-gradient(135deg,
          var(--theme-orange-bg-2) 0%,
          var(--theme-orange-bg-1) 100%);
      border: 1px solid var(--theme-orange-border-2);
      border-radius: 10px;

      .tab-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        padding: 8px 12px;
        border-radius: 7px;
        font-size: 11px;
        font-weight: 600;
        color: var(--el-text-color-regular);
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        user-select: none;
        position: relative;

        i {
          font-size: 12px;
          transition: transform 0.3s ease;
        }

        &:hover:not(.active) {
          color: var(--el-color-primary);
          background: var(--theme-orange-bg-3);

          i {
            transform: scale(1.15);
          }
        }

        &.active {
          background: linear-gradient(135deg,
              var(--el-color-primary) 0%,
              var(--theme-secondary) 100%);
          color: #fff;
          box-shadow: 0 4px 12px var(--theme-orange-glow);

          i {
            animation: tabIconBounce 0.6s ease;
          }
        }
      }
    }

    .activity-content {
      min-height: 240px;
    }
  }

  .ranking-widget,
  .activity-widget {
    .ranking-list {
      .ranking-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        margin-bottom: 8px;
        border-radius: 10px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid var(--theme-orange-bg-3);
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          box-shadow: 0 4px 16px var(--theme-orange-border-2);
          border-color: var(--el-color-primary-light-7);

          .ranking-badge {
            transform: scale(1.08);
          }

          .ranking-avatar {
            transform: scale(1.05);
          }
        }

        .ranking-badge {
          width: 24px;
          height: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 10px;
          font-weight: 700;
          flex-shrink: 0;
          transition: transform 0.2s ease;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

          &.rank-1 {
            background: linear-gradient(135deg, var(--theme-purple-secondary), var(--theme-purple-primary));
            color: #fff;
            box-shadow: 0 4px 12px var(--theme-orange-glow);
          }

          &.rank-2 {
            background: linear-gradient(135deg, #cbd5e1, #94a3b8);
            color: #fff;
            box-shadow: 0 4px 12px rgba(148, 163, 184, 0.4);
          }

          &.rank-3 {
            background: linear-gradient(135deg, var(--theme-purple-light-3), var(--theme-purple-primary));
            color: #fff;
            box-shadow: 0 4px 12px var(--theme-orange-shadow);
          }

          &:not(.rank-1):not(.rank-2):not(.rank-3) {
            background: var(--el-fill-color);
            color: var(--el-text-color-secondary);
            box-shadow: none;
          }
        }

        .ranking-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg,
              var(--el-color-primary) 0%,
              var(--theme-secondary) 100%);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
          transition: transform 0.2s ease;
          box-shadow: 0 2px 8px var(--theme-orange-glow);

          &.anonymous {
            background: linear-gradient(135deg, #94a3b8, #64748b);

            i {
              font-size: 12px;
            }
          }
        }

        .ranking-info {
          flex: 1;
          min-width: 0;

          .ranking-name {
            font-size: 12px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 3px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;

            i.fa-envelope-circle-check {
              font-size: 11px;
              color: #52c41a;
              opacity: 0.8;
            }
          }

          .ranking-channel {
            display: flex;
            align-items: center;
            gap: 4px;
            font-size: 10px;
            font-weight: 500;
            color: var(--el-text-color-secondary);

            i {
              font-size: 10px;
              opacity: 0.7;

              &.fa-key {
                color: #722ed1;
              }

              &.fa-bitcoin {
                color: #f7931a;
              }

              &.fa-alipay {
                color: #1677ff;
              }

              &.fa-weixin {
                color: #07c160;
              }
            }
          }
        }

        .ranking-amount {
          font-size: 14px;
          font-weight: normal;
          background: linear-gradient(135deg,
              #f59e0b 0%,
              #ea580c 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          flex-shrink: 0;
          letter-spacing: 0.3px;
        }
      }
    }
  }

  .recent-widget,
  .activity-widget {
    .recent-list {
      .recent-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px 12px;
        margin-bottom: 8px;
        background: rgba(255, 255, 255, 0.9);
        border: 1px solid var(--theme-orange-bg-3);
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          box-shadow: 0 4px 16px var(--theme-orange-border-2);
          border-color: var(--el-color-primary-light-7);

          .recent-avatar {
            transform: scale(1.05);
          }
        }

        .recent-avatar {
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg,
              var(--el-color-primary) 0%,
              var(--theme-secondary) 100%);
          color: #fff;
          font-size: 11px;
          font-weight: 700;
          flex-shrink: 0;
          transition: transform 0.2s ease;
          box-shadow: 0 2px 8px var(--theme-orange-glow);

          &.anonymous {
            background: linear-gradient(135deg, #94a3b8, #64748b);

            i {
              font-size: 12px;
            }
          }
        }

        .recent-info {
          flex: 1;
          min-width: 0;

          .recent-name {
            font-size: 12px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 4px;

            i.fa-envelope-circle-check {
              font-size: 11px;
              color: #52c41a;
              opacity: 0.8;
            }
          }

          .recent-meta {
            display: flex;
            align-items: center;
            gap: 8px;

            .recent-channel {
              display: inline-flex;
              align-items: center;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 11px;
              transition: all 0.2s ease;

              i {
                font-size: 11px;
              }

              &.channel-cardkey {
                background: rgba(114, 46, 209, 0.08);
                color: #722ed1;
              }

              &.channel-crypto {
                background: rgba(247, 147, 26, 0.08);
                color: #f7931a;
              }

              &.channel-alipay {
                background: rgba(22, 119, 255, 0.08);
                color: #1677ff;
              }

              &.channel-wechat {
                background: rgba(7, 193, 96, 0.08);
                color: #07c160;
              }
            }

            .recent-time {
              display: inline-flex;
              align-items: center;
              gap: 3px;
              font-size: 10px;
              font-weight: 500;
              color: var(--el-text-color-secondary);

              i {
                font-size: 9px;
                opacity: 0.7;
              }
            }
          }
        }

        .recent-amount {
          font-size: 14px;
          font-weight: normal;
          background: linear-gradient(135deg,
              var(--theme-purple-secondary) 0%,
              var(--theme-purple-primary) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          flex-shrink: 0;
          letter-spacing: 0.3px;
        }
      }
    }
  }


  // ==================== 深色模式适配 ====================
  html.dark & {
    
    // 二维码容器深色模式 - 添加白色背景以便扫描
    .qrcode-container {
      background: #fff !important;
      padding: 8px !important;
      border-radius: 8px !important;
      
      :deep(.ant-qrcode) {
        canvas {
          background: #fff !important;
        }
      }
    }

    // 数据卡片深色模式
    .stats-widget .stats-grid .stat-item {
      background: rgba(30, 30, 40, 0.6);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);

      &:hover {
        box-shadow: 0 4px 12px var(--theme-orange-shadow);
      }
    }

    // Tab切换深色模式
    .activity-widget .activity-tabs {
      background: linear-gradient(135deg,
          var(--theme-orange-bg-3) 0%,
          var(--theme-orange-bg-2) 100%);
      border-color: var(--theme-orange-border-3);

      .tab-item:hover:not(.active) {
        background: var(--theme-orange-border-2);
      }
    }

    // 榜单卡片深色模式
    .ranking-widget .ranking-list .ranking-item,
    .activity-widget .ranking-list .ranking-item {
      background: linear-gradient(135deg,
          rgba(55, 65, 81, 0.5) 0%,
          rgba(31, 41, 55, 0.7) 100%);
      border-color: var(--theme-orange-border-3);

      &:hover {
        background: linear-gradient(135deg,
            rgba(55, 65, 81, 0.7) 0%,
            rgba(31, 41, 55, 0.9) 100%);
        border-color: var(--theme-orange-glow);
        box-shadow: 0 4px 16px var(--theme-orange-shadow);
      }
    }

    // 最近捐赠深色模式
    .recent-widget .recent-list .recent-item,
    .activity-widget .recent-list .recent-item {
      background: linear-gradient(135deg,
          rgba(55, 65, 81, 0.5) 0%,
          rgba(31, 41, 55, 0.7) 100%);
      border-color: var(--theme-orange-border-3);

      &:hover {
        background: linear-gradient(135deg,
            rgba(55, 65, 81, 0.7) 0%,
            rgba(31, 41, 55, 0.9) 100%);
        border-color: var(--theme-orange-glow);
        box-shadow: 0 4px 16px var(--theme-orange-shadow);
      }
    }
  }
}
</style>
