<template>
  <div class="donation-page">
    <!-- 背景装饰 -->
    <div class="bg-decorations">
      <!-- 左侧装饰 -->
      <div class="decoration-left">
        <!-- 星星 -->
        <div class="star-icon" style="top: 8%; left: 8%;">★</div>
        <div class="star-icon" style="top: 15%; left: 5%;">★</div>
        <div class="star-icon" style="top: 28%; left: 10%;">★</div>
        <div class="star-icon" style="top: 38%; left: 4%;">★</div>
        <div class="star-icon" style="top: 52%; left: 9%;">★</div>
        <div class="star-icon" style="top: 63%; left: 6%;">★</div>
        <div class="star-icon" style="top: 75%; left: 7%;">★</div>
        <div class="star-icon" style="top: 88%; left: 5%;">★</div>
        <div class="star-icon" style="top: 12%; left: 3%;">✦</div>
        <div class="star-icon" style="top: 22%; left: 11%;">✦</div>
        <div class="star-icon" style="top: 45%; left: 3%;">✦</div>
        <div class="star-icon" style="top: 68%; left: 11%;">✦</div>
        <div class="star-icon" style="top: 82%; left: 10%;">✦</div>
        <div class="star-icon" style="top: 92%; left: 8%;">✦</div>
        
        <!-- FontAwesome图标 -->
        <div class="fa-icon" style="top: 10%; left: 6%;"><i class="fas fa-heart"></i></div>
        <div class="fa-icon" style="top: 25%; left: 7%;"><i class="fas fa-gift"></i></div>
        <div class="fa-icon" style="top: 40%; left: 8%;"><i class="fas fa-gem"></i></div>
        <div class="fa-icon" style="top: 55%; left: 5%;"><i class="fas fa-star"></i></div>
        <div class="fa-icon" style="top: 70%; left: 9%;"><i class="fas fa-hand-holding-usd"></i></div>
        <div class="fa-icon" style="top: 85%; left: 7%;"><i class="fas fa-trophy"></i></div>
        <div class="fa-icon" style="top: 95%; left: 4%;"><i class="fas fa-crown"></i></div>
      </div>
      
      <!-- 右侧装饰 -->
      <div class="decoration-right">
        <!-- 星星 -->
        <div class="star-icon" style="top: 6%; right: 7%;">★</div>
        <div class="star-icon" style="top: 18%; right: 10%;">★</div>
        <div class="star-icon" style="top: 32%; right: 5%;">★</div>
        <div class="star-icon" style="top: 43%; right: 9%;">★</div>
        <div class="star-icon" style="top: 58%; right: 6%;">★</div>
        <div class="star-icon" style="top: 70%; right: 11%;">★</div>
        <div class="star-icon" style="top: 80%; right: 7%;">★</div>
        <div class="star-icon" style="top: 91%; right: 9%;">★</div>
        <div class="star-icon" style="top: 10%; right: 4%;">✦</div>
        <div class="star-icon" style="top: 25%; right: 3%;">✦</div>
        <div class="star-icon" style="top: 48%; right: 12%;">✦</div>
        <div class="star-icon" style="top: 64%; right: 4%;">✦</div>
        <div class="star-icon" style="top: 76%; right: 3%;">✦</div>
        <div class="star-icon" style="top: 95%; right: 6%;">✦</div>
        
        <!-- FontAwesome图标 -->
        <div class="fa-icon" style="top: 8%; right: 8%;"><i class="fas fa-coins"></i></div>
        <div class="fa-icon" style="top: 22%; right: 6%;"><i class="fas fa-hand-holding-heart"></i></div>
        <div class="fa-icon" style="top: 38%; right: 7%;"><i class="fas fa-certificate"></i></div>
        <div class="fa-icon" style="top: 53%; right: 8%;"><i class="fas fa-sparkles"></i></div>
        <div class="fa-icon" style="top: 68%; right: 5%;"><i class="fas fa-donate"></i></div>
        <div class="fa-icon" style="top: 83%; right: 10%;"><i class="fas fa-medal"></i></div>
        <div class="fa-icon" style="top: 97%; right: 7%;"><i class="fas fa-award"></i></div>
      </div>
      
      <!-- 背景光晕 -->
      <div class="bg-glow bg-glow-left"></div>
      <div class="bg-glow bg-glow-right"></div>
    </div>
    
    <div class="donation-content">
      <div class="content-wrapper">
        <div class="donation-form-section animate__animated animate__fadeInUp animate__fast">
          <a-card :bordered="false" class="form-card">
            <div class="card-header-custom animate__animated animate__fadeIn animate__fast" style="animation-delay: 0.1s;">
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

            <div class="donation-form">
              <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
                <!-- 步骤条 -->
                <StepForm class="animate__animated animate__fadeIn animate__fast" style="animation-delay: 0.2s;"
                  :active="currentStep" 
                  :steps="[
                    { title: '选择方式', description: stepDescriptions[0] },
                    { title: '必填信息', description: stepDescriptions[1] },
                    { title: '可选信息', description: stepDescriptions[2] },
                    { title: '完成', description: stepDescriptions[3] || '提交成功' }
                  ]"
                />

                <!-- 步骤1: 选择捐赠方式 -->
                <div v-show="currentStep === 0" class="qrcode-section">
                    <el-row :gutter="16" class="qrcode-grid">
                    <el-col :xs="12" :sm="6" :md="6" class="animate__animated animate__fadeInUp animate__fast" style="animation-delay: 0.3s;">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'cardkey' }"
                        @click="selectChannel('cardkey')">
                        <img :src="collectionCarkey" alt="购买卡密" />
                        <div class="qrcode-tip">
                          <a href="https://www.qianxun1688.com/links/1C9EDE0B" target="_blank" class="card-link"
                            @click.stop>
                            购买卡密
                          </a>
                        </div>
                        <span class="channel-badge recommend">推荐</span>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6" class="animate__animated animate__fadeInUp animate__fast" style="animation-delay: 0.4s;">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'crypto' }"
                        @click="selectChannel('crypto')">
                        <span class="channel-badge-left crypto-badge">
                          <i class="fab fa-bitcoin"></i>
                          <span>加密货币</span>
                        </span>
                        <img :src="collectionTp" alt="USDT收款码" />
                        <div class="qrcode-tip">USDT TRC-20</div>
                        <span class="channel-badge recommend">推荐</span>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6" class="animate__animated animate__fadeInUp animate__fast" style="animation-delay: 0.5s;">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'alipay' }"
                        @click="selectChannel('alipay')">
                        <img :src="collectionAlipay" alt="支付宝收款码" />
                        <div class="qrcode-tip">支付宝支付</div>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6" class="animate__animated animate__fadeInUp animate__fast" style="animation-delay: 0.6s;">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'wechat' }"
                        @click="selectChannel('wechat')">
                        <img :src="collectionWechat" alt="微信收款码" />
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
          </a-card>
        </div>

        <div class="donation-info-section">
          <!-- 统计卡片 -->
          <div class="sidebar-widget stats-widget animate__animated animate__fadeInUp animate__fast" style="animation-delay: 0.15s;">
            <div class="widget-header">
              <i class="fas fa-chart-line"></i>
              <span>捐赠数据</span>
            </div>
            <div class="stats-grid">
              <div class="stat-item animate__animated animate__zoomIn animate__fast" style="animation-delay: 0.25s;">
                <div class="stat-icon" style="background: linear-gradient(135deg, rgba(22, 119, 255, 0.1), rgba(22, 119, 255, 0.2)); color: #1677ff;">
                  <i class="fas fa-users"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">1,234</div>
                  <div class="stat-label">支持者</div>
                </div>
              </div>
              <div class="stat-item animate__animated animate__zoomIn animate__fast" style="animation-delay: 0.35s;">
                <div class="stat-icon" style="background: linear-gradient(135deg, rgba(82, 196, 26, 0.1), rgba(82, 196, 26, 0.2)); color: #52c41a;">
                  <i class="fas fa-coins"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">¥56,789</div>
                  <div class="stat-label">累计金额</div>
                </div>
              </div>
              <div class="stat-item animate__animated animate__zoomIn animate__fast" style="animation-delay: 0.45s;">
                <div class="stat-icon" style="background: linear-gradient(135deg, rgba(250, 140, 22, 0.1), rgba(250, 140, 22, 0.2)); color: #fa8c16;">
                  <i class="fas fa-calendar-check"></i>
                </div>
                <div class="stat-info">
                  <div class="stat-value">328</div>
                  <div class="stat-label">本月捐赠</div>
                </div>
              </div>
              <div class="stat-item animate__animated animate__zoomIn animate__fast" style="animation-delay: 0.55s;">
                <div class="stat-icon" style="background: linear-gradient(135deg, rgba(114, 46, 209, 0.1), rgba(114, 46, 209, 0.2)); color: #722ed1;">
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
          <div class="sidebar-widget activity-widget animate__animated animate__fadeInUp animate__fast" style="animation-delay: 0.3s;">
            <div class="activity-tabs">
              <div 
                class="tab-item" 
                :class="{ active: activeTab === 'ranking' }"
                @click="activeTab = 'ranking'"
              >
                <i class="fas fa-crown"></i>
                <span>捐赠榜</span>
              </div>
              <div 
                class="tab-item" 
                :class="{ active: activeTab === 'recent' }"
                @click="activeTab = 'recent'"
              >
                <i class="fas fa-history"></i>
                <span>最近捐赠</span>
              </div>
            </div>

            <div class="activity-content">
              <!-- 捐赠榜 -->
              <div v-show="activeTab === 'ranking'" class="ranking-list">
              <div v-for="(item, index) in topDonors" :key="item.id" class="ranking-item animate__animated animate__fadeInLeft animate__fast" :style="`animation-delay: ${0.4 + index * 0.1}s;`">
                  <div class="ranking-badge" :class="`rank-${index + 1}`">
                    <span v-if="index < 3">
                      <i v-if="index === 0" class="fas fa-crown"></i>
                      <i v-else-if="index === 1" class="fas fa-medal"></i>
                      <i v-else class="fas fa-award"></i>
                    </span>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <div class="ranking-avatar">{{ item.name.charAt(0) }}</div>
                  <div class="ranking-info">
                    <div class="ranking-name">{{ item.name }}</div>
                    <div class="ranking-count">{{ item.count }}次捐赠</div>
                  </div>
                  <div class="ranking-amount">¥{{ item.amount }}</div>
                </div>
              </div>

              <!-- 最近捐赠 -->
              <div v-show="activeTab === 'recent'" class="recent-list">
                <div v-for="item in recentDonations" :key="item.id" class="recent-item animate__animated animate__fadeInLeft animate__fast" :style="`animation-delay: ${0.4 + recentDonations.indexOf(item) * 0.1}s;`">
                  <div class="recent-dot"></div>
                  <div class="recent-avatar">{{ item.name.charAt(0) }}</div>
                  <div class="recent-info">
                    <div class="recent-name">{{ item.name }}</div>
                    <div class="recent-time">
                      <i class="fas fa-clock"></i>
                      {{ item.time }}
                    </div>
                  </div>
                  <div class="recent-amount">¥{{ item.amount }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <CelebrationModal v-model:visible="showCelebration" :title="celebrationData.title"
      :message="celebrationData.message" :sub-message="celebrationData.subMessage" :details="celebrationData.details"
      :actions="celebrationData.actions" type="celebration" :show-confetti="true" @close="handleCelebrationClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'element-plus'
import { addDonationR } from '@/request/donation'
import type { DonationChannel, DonationFormData, CelebrationDetail, CelebrationAction } from '@/types/donation'
import CelebrationModal from '@/components/common/CelebrationModal.vue'
import StepForm from '@/components/StepForm.vue'
import collectionWechat from '@/assets/images/collection_wechat.jpg'
import collectionAlipay from '@/assets/images/collection_alipay.jpg'
import collectionTp from '@/assets/images/collection_tp.jpg'
import collectionCarkey from '@/assets/images/collection_carkey.png'

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
  { id: 1, name: '热心网友', amount: 100, time: '5分钟前' },
  { id: 2, name: '张三', amount: 50, time: '1小时前' },
  { id: 3, name: '匿名用户', amount: 200, time: '2小时前' },
  { id: 4, name: '李四', amount: 88, time: '3小时前' },
  { id: 5, name: '王五', amount: 66, time: '5小时前' }
])

const topDonors = ref([
  { id: 1, name: '张大豪', amount: 5888, count: 12 },
  { id: 2, name: '李大富', amount: 3666, count: 8 },
  { id: 3, name: '王大人', amount: 2888, count: 6 },
  { id: 4, name: '赵先生', amount: 1888, count: 5 },
  { id: 5, name: '刘女士', amount: 999, count: 3 }
])

const activeTab = ref<'ranking' | 'recent'>('ranking')

const showCelebration = ref(false)
const celebrationData = reactive<{ title: string; message: string; subMessage: string; details: CelebrationDetail[]; actions: CelebrationAction[] }>({
  title: '🎉 捐赠成功！',
  message: '感谢您的慰慨支持！',
  subMessage: '您的每一份心意都是我们前进的动力',
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
      celebrationData.message = '感谢您的慷慨支持！'
      celebrationData.subMessage = '您的每一份心意都是我们前进的动力'
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
  // 统一设计变量
  --theme-color: #8b5cf6;
  --theme-color-light-3: #a78bfa;
  --theme-color-light-5: #c4b5fd;
  --theme-color-light-7: #ddd6fe;
  --theme-color-light-9: #ede9fe;
  --theme-secondary: #d946ef;
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

  // 覆盖 Element Plus 全局主题色
  --el-color-primary: #8b5cf6;
  --el-color-primary-light-3: #a78bfa;
  --el-color-primary-light-5: #c4b5fd;
  --el-color-primary-light-7: #ddd6fe;
  --el-color-primary-light-8: #e9d5ff;
  --el-color-primary-light-9: #ede9fe;
  --el-color-primary-dark-2: #7c3aed;

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
      radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.08) 0%, transparent 50%),
      radial-gradient(circle at 80% 70%, rgba(217, 70, 239, 0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  // 背景装饰容器
  .bg-decorations {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 0;
    overflow: hidden;
  }
  
  // 左右侧装饰容器
  .decoration-left,
  .decoration-right {
    position: absolute;
    top: 0;
    width: 15%;
    height: 100%;
    
    @media (max-width: 1024px) {
      width: 10%;
    }
    
    @media (max-width: 768px) {
      width: 8%;
    }
  }
  
  .decoration-left {
    left: 0;
  }
  
  .decoration-right {
    right: 0;
  }
  
  // 星星装饰
  .star-icon {
    position: absolute;
    font-size: 20px;
    color: #fbbf24;
    opacity: 0.3;
    text-shadow: 0 0 8px rgba(251, 191, 36, 0.5);
    
    @media (max-width: 768px) {
      font-size: 14px;
      opacity: 0.2;
    }
  }
  
  // FontAwesome图标装饰
  .fa-icon {
    position: absolute;
    font-size: 22px;
    opacity: 0.15;
    
    i {
      color: var(--el-color-primary);
      text-shadow: 0 0 10px rgba(139, 92, 246, 0.3);
    }
    
    @media (max-width: 768px) {
      font-size: 16px;
      opacity: 0.1;
    }
  }
  
  // 背景光晕
  .bg-glow {
    position: absolute;
    width: 400px;
    height: 600px;
    border-radius: 50%;
    opacity: 0.4;
    
    &.bg-glow-left {
      top: 20%;
      left: -100px;
      background: radial-gradient(circle, rgba(139, 92, 246, 0.08) 0%, transparent 60%);
    }
    
    &.bg-glow-right {
      bottom: 20%;
      right: -100px;
      background: radial-gradient(circle, rgba(217, 70, 239, 0.06) 0%, transparent 60%);
    }
    
    @media (max-width: 768px) {
      opacity: 0.2;
    }
  }

  .donation-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 var(--spacing-md);
    position: relative;
    z-index: 1;

    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr;
      gap: 16px;

      @media (min-width: 1024px) {
        grid-template-columns: 1fr 320px;
      }
      
      @media (max-width: 1023px) {
        gap: 20px;
      }
    }
  }

  .card-header-custom {
    padding: 20px;
    margin-bottom: var(--spacing-md);
    background: linear-gradient(135deg, 
      rgba(139, 92, 246, 0.05) 0%, 
      rgba(217, 70, 239, 0.03) 100%);
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
        box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
        position: relative;
        animation: iconPulse 3s ease-in-out infinite;

        &::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: inherit;
          border-radius: inherit;
          opacity: 0.3;
          filter: blur(8px);
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
          rgba(139, 92, 246, 0.08) 0%, 
          rgba(217, 70, 239, 0.05) 100%);
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
            rgba(139, 92, 246, 0.15) 0%, 
            rgba(217, 70, 239, 0.1) 100%);
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
          box-shadow: 0 4px 16px rgba(139, 92, 246, 0.2);

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

  @keyframes iconPulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
    }
  }

  @keyframes heartBeat {
    0%, 100% {
      transform: scale(1);
    }
    10%, 30% {
      transform: scale(1.1);
    }
    20%, 40% {
      transform: scale(1);
    }
  }

  @keyframes sparkle {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.2);
    }
  }

  @keyframes twinkle {
    0%, 100% {
      opacity: 0.3;
      transform: scale(1) rotate(0deg);
    }
    50% {
      opacity: 1;
      transform: scale(1.15) rotate(10deg);
    }
  }

  @keyframes badgePulse {
    0%, 100% {
      transform: scale(1);
      box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4);
    }
    50% {
      transform: scale(1.05);
      box-shadow: 0 3px 12px rgba(255, 107, 107, 0.6);
    }
  }

  @keyframes badgeFloat {
    0%, 100% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(-2px);
    }
  }

  @keyframes badgeBounce {
    0%, 100% {
      transform: scale(1);
    }
    25% {
      transform: scale(1.1) rotate(-5deg);
    }
    75% {
      transform: scale(1.1) rotate(5deg);
    }
  }

  @keyframes badgeShake {
    0%, 100% {
      transform: translateX(0);
    }
    25% {
      transform: translateX(-2px);
    }
    75% {
      transform: translateX(2px);
    }
  }

  @keyframes coinSpin {
    0% {
      transform: rotateY(0deg);
    }
    100% {
      transform: rotateY(360deg);
    }
  }

  @keyframes float1 {
    0%, 100% {
      transform: translate(0, 0) rotate(0deg);
    }
    33% {
      transform: translate(30px, -30px) rotate(120deg);
    }
    66% {
      transform: translate(-20px, 20px) rotate(240deg);
    }
  }

  @keyframes float2 {
    0%, 100% {
      transform: translate(0, 0) scale(1);
      opacity: 0.3;
    }
    50% {
      transform: translate(-40px, 40px) scale(1.2);
      opacity: 0.6;
    }
  }

  @keyframes float3 {
    0%, 100% {
      transform: translate(0, 0);
      opacity: 0.2;
    }
    50% {
      transform: translate(20px, -50px);
      opacity: 0.5;
    }
  }

  @keyframes rotate1 {
    0% {
      transform: rotate(45deg);
      opacity: 0.1;
    }
    50% {
      opacity: 0.2;
    }
    100% {
      transform: rotate(405deg);
      opacity: 0.1;
    }
  }

  @keyframes pulse2 {
    0%, 100% {
      transform: scale(1);
      opacity: 0.08;
    }
    50% {
      transform: scale(1.3);
      opacity: 0.15;
    }
  }

  @keyframes pulse3 {
    0%, 100% {
      transform: scale(1);
      opacity: 0.2;
    }
    50% {
      transform: scale(1.15);
      opacity: 0.4;
    }
  }

  // 已删除所有不再使用的装饰动画关键帧

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
      .qrcode-item {
        margin-bottom: 12px;

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
        padding: 16px;
        background: var(--el-fill-color-blank);
        border: 1.5px solid var(--el-border-color);
        border-radius: var(--radius-md);
        height: 100%;
        transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.02);
        will-change: transform;
        
        @media (max-width: 768px) {
          transition: all 0.2s ease;
        }

      &:hover {
        border-color: var(--el-color-primary-light-3);
        box-shadow: 0 4px 16px rgba(139, 92, 246, 0.15);
        transform: translateY(-3px) scale(1.02);

        .channel-badge.recommend {
          animation: badgeBounce 0.6s ease-in-out;
        }

        .channel-badge-left.crypto-badge {
          animation: badgeShake 0.6s ease-in-out;
        }
        
        @media (max-width: 768px) {
          transform: translateY(-2px);
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
        }
      }

      &.active {
        border-color: var(--el-color-primary);
        border-width: 2px;
        box-shadow: 0 4px 20px rgba(139, 92, 246, 0.25), 0 0 0 3px var(--el-color-primary-light-9);
        transform: translateY(-2px);
      }

      img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: contain;
        border-radius: 4px;
        margin-bottom: 6px;
        background: var(--el-fill-color-light);
        padding: 4px;
      }

      .qrcode-tip {
        font-size: 10px;
        font-weight: 500;
        color: var(--el-text-color-regular);
        text-align: center;
        line-height: 1.3;

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
        animation: badgePulse 2s ease-in-out infinite;
        will-change: transform;
        
        @media (max-width: 768px) {
          animation: none;
        }
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
        box-shadow: 0 2px 4px rgba(139, 92, 246, 0.2);
        animation: badgeFloat 3s ease-in-out infinite;
        will-change: transform;
        
        @media (max-width: 768px) {
          animation: none;
        }

        &.crypto-badge {
          background: var(--el-color-primary);
          color: #fff;

          i {
            font-size: 10px;
            animation: coinSpin 4s linear infinite;
            
            @media (max-width: 768px) {
              animation: none;
            }
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
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 6px;
    padding: 6px 8px;
    background: var(--el-color-primary-light-9);
    border-radius: 4px;
    font-size: 10px;
    color: var(--el-text-color-secondary);
    line-height: 1.4;
    
    i {
      color: var(--el-color-primary-light-5);
      font-size: 11px;
      flex-shrink: 0;
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
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.25);

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
      gap: 8px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 10px;
        background: var(--el-fill-color-light);
        border: 1px solid var(--el-border-color-lighter);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;

        &:hover {
          background: var(--el-fill-color);
          box-shadow: var(--el-box-shadow-light);
        }

        .stat-icon {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-sm);
          flex-shrink: 0;

          i {
            font-size: 15px;
          }
        }

        .stat-info {
          flex: 1;
          min-width: 0;

          .stat-value {
            font-size: var(--font-md);
            font-weight: 700;
            color: var(--el-text-color-primary);
            margin-bottom: 2px;
            line-height: 1.2;
          }

          .stat-label {
            font-size: 10px;
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
      gap: 4px;
      margin-bottom: 12px;
      padding: 3px;
      background: var(--el-fill-color-light);
      border: 1px solid var(--el-border-color-lighter);
      border-radius: var(--radius-sm);

      .tab-item {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
        padding: 6px 10px;
        border-radius: 4px;
        font-size: var(--font-xs);
        font-weight: 500;
        color: var(--el-text-color-regular);
        cursor: pointer;
        transition: all 0.2s ease;
        user-select: none;

        i {
          font-size: 11px;
        }

        &:hover:not(.active) {
          color: var(--el-color-primary);
        }

        &.active {
          background: var(--el-color-primary);
          color: #fff;
          font-weight: 600;
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
        gap: 8px;
        padding: 8px;
        margin-bottom: 6px;
        border-radius: var(--radius-sm);
        background: var(--el-fill-color-light);
        border: 1px solid var(--el-border-color-lighter);
        transition: all 0.2s ease;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          background: var(--el-fill-color);
          box-shadow: var(--el-box-shadow-light);
        }

        .ranking-badge {
          width: 20px;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          font-size: 9px;
          font-weight: 600;
          flex-shrink: 0;

          &.rank-1 {
            background: #fbbf24;
            color: #fff;
          }

          &.rank-2 {
            background: #94a3b8;
            color: #fff;
          }

          &.rank-3 {
            background: #f97316;
            color: #fff;
          }

          &:not(.rank-1):not(.rank-2):not(.rank-3) {
            background: var(--el-fill-color);
            color: var(--el-text-color-secondary);
          }
        }

        .ranking-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: var(--el-color-primary);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .ranking-info {
          flex: 1;
          min-width: 0;

          .ranking-name {
            font-size: var(--font-xs);
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .ranking-count {
            font-size: 9px;
            color: var(--el-text-color-secondary);
          }
        }

        .ranking-amount {
          font-size: var(--font-xs);
          font-weight: 700;
          color: var(--theme-color);
          flex-shrink: 0;
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
        gap: 8px;
        padding: 8px;
        margin-bottom: 6px;
        background: rgba(255, 255, 255, 0.5);
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255, 255, 255, 0.6);
        border-radius: var(--radius-sm);
        transition: all 0.2s ease;

        &:last-child {
          margin-bottom: 0;
        }

        &:hover {
          background: rgba(255, 255, 255, 0.75);
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.1);
        }

        .recent-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: var(--theme-color);
          flex-shrink: 0;
          opacity: 0.5;
        }

        .recent-avatar {
          width: 22px;
          height: 22px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--theme-color);
          color: #fff;
          font-size: 10px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .recent-info {
          flex: 1;
          min-width: 0;

          .recent-name {
            font-size: var(--font-xs);
            font-weight: 500;
            color: var(--el-text-color-primary);
            margin-bottom: 2px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .recent-time {
            display: flex;
            align-items: center;
            gap: 3px;
            font-size: 9px;
            color: var(--el-text-color-secondary);

            i {
              font-size: 8px;
              opacity: 0.7;
            }
          }
        }

        .recent-amount {
          font-size: var(--font-xs);
          font-weight: 700;
          color: var(--theme-color);
          flex-shrink: 0;
        }
      }
    }
  }

}
</style>
