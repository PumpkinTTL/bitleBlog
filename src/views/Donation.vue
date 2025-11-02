<template>
  <div class="donation-page">
    <div class="donation-content">
      <div class="content-wrapper">
        <div class="donation-form-section animate-item">
          <a-card :bordered="false" class="form-card">
            <div class="card-header-custom">
              <div class="header-icon">
                <i class="fas fa-gift"></i>
              </div>
              <div class="header-content">
                <h2 class="header-title">支持我们的创作</h2>
                <p class="header-subtitle">您的每一份支持，都是我们持续创作的动力</p>
              </div>
            </div>

            <div class="donation-form">
              <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
                <!-- 步骤条 -->
                <div class="steps-section">
                  <el-steps :active="currentStep" finish-status="success" align-center>
                    <el-step title="选择方式" :description="stepDescriptions[0]" />
                    <el-step title="必填信息" :description="stepDescriptions[1]" />
                    <el-step title="可选信息" :description="stepDescriptions[2]" />
                  </el-steps>
                </div>

                <!-- 步骤1: 选择捐赠方式 -->
                <div v-show="currentStep === 0" class="qrcode-section">
                  <div class="qrcode-title">
                    <i class="fas fa-hand-holding-heart"></i>
                    <span>选择捐赠方式</span>
                  </div>
                  <el-row :gutter="16" class="qrcode-grid">
                    <el-col :xs="12" :sm="6" :md="6">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'cardkey' }"
                        @click="selectChannel('cardkey')">
                        <div class="qrcode-container">
                          <div class="qrcode-image-wrapper">
                            <img :src="collectionCarkey" alt="购买卡密" />
                          </div>
                          <div class="qrcode-tip">
                            <a href="https://www.qianxun1688.com/links/1C9EDE0B" target="_blank" class="card-link"
                              @click.stop>
                              购买卡密
                            </a>
                          </div>
                          <span class="channel-badge recommend">推荐</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'crypto' }"
                        @click="selectChannel('crypto')">
                        <div class="qrcode-container">
                          <span class="channel-badge-left crypto-badge">
                            <i class="fab fa-bitcoin"></i>
                            <span>加密货币</span>
                          </span>
                          <div class="qrcode-image-wrapper">
                            <img :src="collectionTp" alt="USDT收款码" />
                          </div>
                          <div class="qrcode-tip">USDT TRC-20</div>
                          <span class="channel-badge recommend">推荐</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'alipay' }"
                        @click="selectChannel('alipay')">
                        <div class="qrcode-container">
                          <div class="qrcode-image-wrapper">
                            <img :src="collectionAlipay" alt="支付宝收款码" />
                          </div>
                          <div class="qrcode-tip">支付宝支付</div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'wechat' }"
                        @click="selectChannel('wechat')">
                        <div class="qrcode-container">
                          <div class="qrcode-image-wrapper">
                            <img :src="collectionWechat" alt="微信收款码" />
                          </div>
                          <div class="qrcode-tip">微信扫码支付</div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                  <div class="step-actions">
                    <el-button type="primary" :disabled="!selectedChannel" @click="nextStep" style="width: 100%">
                      下一步
                    </el-button>
                  </div>
                </div>

                <!-- 步骤2: 必填信息 -->
                <div v-show="currentStep === 1" class="form-step-section">
                  <template v-if="selectedChannel === 'cardkey'">
                    <el-form-item label="卡密码" prop="card_key_code">
                      <el-input v-model="formData.card_key_code" placeholder="请输入卡密码，格式：ABCD-1234-EFGH-5678" clearable>
                        <template #prefix><i class="fas fa-key"></i></template>
                      </el-input>
                    </el-form-item>
                  </template>

                  <template v-else-if="selectedChannel === 'crypto'">
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
                  </template>

                  <template v-if="selectedChannel === 'wechat' || selectedChannel === 'alipay'">
                    <el-form-item label="捐赠金额" prop="amount">
                      <el-input-number v-model="formData.amount" :min="1" :max="99999" :precision="2"
                        placeholder="请输入捐赠金额" style="width: 100%" controls-position="right" />
                    </el-form-item>
                    <el-form-item label="订单号" prop="order_no">
                      <el-input v-model="formData.order_no" placeholder="请输入支付订单号" clearable>
                        <template #prefix><i class="fas fa-receipt"></i></template>
                      </el-input>
                    </el-form-item>
                  </template>

                  <div class="step-actions">
                    <el-button @click="prevStep">上一步</el-button>
                    <el-button type="primary" @click="nextStep" style="flex: 1">
                      下一步
                    </el-button>
                  </div>
                </div>

                <!-- 步骤3: 可选信息 -->
                <div v-show="currentStep === 2" class="form-step-section">
                  <div class="optional-section">
                    <div class="section-header" @click="showOptional = !showOptional">
                      <div class="header-left">
                        <i class="fas fa-shield-alt"></i>
                        <span>选填信息（我们尊重您的隐私）</span>
                      </div>
                      <i :class="showOptional ? 'fas fa-chevron-up' : 'fas fa-chevron-down'"></i>
                    </div>

                    <el-collapse-transition>
                      <div v-show="showOptional" class="optional-content">
                        <el-form-item label="您的昵称" prop="donor_name">
                          <el-input v-model="formData.donor_name" placeholder="留下您的网名或昵称" clearable>
                            <template #prefix><i class="fas fa-user"></i></template>
                          </el-input>
                        </el-form-item>

                        <el-form-item label="邮箱地址" prop="email">
                          <el-input v-model="formData.email" placeholder="用于接收捐赠记录" clearable>
                            <template #prefix><i class="fas fa-envelope"></i></template>
                          </el-input>
                        </el-form-item>

                        <el-form-item label="留言" prop="remark">
                          <el-input v-model="formData.remark" type="textarea" placeholder="留下您的祝福或建议" :rows="4"
                            :maxlength="200" show-word-limit />
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
                    <el-button @click="prevStep">上一步</el-button>
                    <el-button type="primary" :loading="submitting" @click="handleSubmit" style="flex: 1">
                      <i class="fas fa-heart"></i>
                      <span>{{ submitting ? '提交中...' : '提交捐赠' }}</span>
                    </el-button>
                  </div>
                </div>
              </el-form>
            </div>
          </a-card>
        </div>

        <div class="donation-info-section">
          <a-card :bordered="false" class="info-card stats-card animate-item">
            <template #title>
              <div class="card-title"><i class="fas fa-chart-line"></i><span>捐赠统计</span></div>
            </template>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-users"></i></div>
                <div class="stat-info">
                  <div class="stat-value">1,234</div>
                  <div class="stat-label">捐赠人数</div>
                </div>
              </div>
              <div class="stat-item">
                <div class="stat-icon"><i class="fas fa-coins"></i></div>
                <div class="stat-info">
                  <div class="stat-value">¥56,789</div>
                  <div class="stat-label">累计金额</div>
                </div>
              </div>
            </div>
          </a-card>

          <a-card :bordered="false" class="info-card guide-card animate-item">
            <template #title>
              <div class="card-title"><i class="fas fa-info-circle"></i><span>捐赠说明</span></div>
            </template>
            <div class="guide-content">
              <div class="guide-item">
                <div class="guide-icon"><i class="fas fa-check-circle"></i></div>
                <div class="guide-text">
                  <div class="guide-title">安全可靠</div>
                  <div class="guide-desc">所有捐赠记录都会被妥善保存</div>
                </div>
              </div>
              <div class="guide-item">
                <div class="guide-icon"><i class="fas fa-shield-alt"></i></div>
                <div class="guide-text">
                  <div class="guide-title">隐私保护</div>
                  <div class="guide-desc">您的个人信息将被严格保密</div>
                </div>
              </div>
              <div class="guide-item">
                <div class="guide-icon"><i class="fas fa-heart"></i></div>
                <div class="guide-text">
                  <div class="guide-title">感谢支持</div>
                  <div class="guide-desc">您的支持是我们前进的动力</div>
                </div>
              </div>
            </div>
          </a-card>

          <a-card :bordered="false" class="info-card recent-card animate-item">
            <template #title>
              <div class="card-title"><i class="fas fa-history"></i><span>最近捐赠</span></div>
            </template>
            <div class="recent-list">
              <div v-for="item in recentDonations" :key="item.id" class="recent-item">
                <div class="recent-avatar"><i class="fas fa-user-circle"></i></div>
                <div class="recent-info">
                  <div class="recent-name">{{ item.name }}</div>
                  <div class="recent-time">{{ item.time }}</div>
                </div>
                <div class="recent-amount">¥{{ item.amount }}</div>
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
import { ref, reactive, computed } from 'vue'
import { message } from 'ant-design-vue'
import type { FormInstance } from 'element-plus'
import { addDonationR } from '@/request/donation'
import type { DonationChannel, DonationFormData, CelebrationDetail, CelebrationAction } from '@/types/donation'
import CelebrationModal from '@/components/common/CelebrationModal.vue'
import collectionWechat from '@/assets/images/collection_wechat.jpg'
import collectionAlipay from '@/assets/images/collection_alipay.jpg'
import collectionTp from '@/assets/images/collection_tp.jpg'
import collectionCarkey from '@/assets/images/collection_carkey.png'

const channels = [
  { key: 'cardkey' as DonationChannel, label: '卡密兑换', icon: 'fas fa-key', color: '#FF6B6B', description: '使用卡密快速兑换', badge: { text: '推荐', type: 'recommend' } },
  { key: 'crypto' as DonationChannel, label: '加密货币', icon: 'fab fa-bitcoin', color: '#26A17B', description: '支持USDT(TRC20)', badge: { text: '推荐', type: 'recommend' } },
  { key: 'wechat' as DonationChannel, label: '微信支付', icon: 'fab fa-weixin', color: '#07C160', description: '使用微信扫码支付' },
  { key: 'alipay' as DonationChannel, label: '支付宝', icon: 'fab fa-alipay', color: '#8b5cf6', description: '使用支付宝扫码支付' }
]

const formRef = ref<FormInstance>()
const selectedChannel = ref<DonationChannel>('cardkey')
const submitting = ref(false)
const showOptional = ref(false)
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
  { id: 4, name: '李四', amount: 88, time: '3小时前' }
])

const showCelebration = ref(false)
const celebrationData = reactive<{ title: string; message: string; subMessage: string; details: CelebrationDetail[]; actions: CelebrationAction[] }>({
  title: '🎉 捐赠成功！',
  message: '感谢您的慷慨支持！',
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

const nextStep = () => {
  if (currentStep.value < 2) {
    currentStep.value++
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
  --theme-color: #8b5cf6;
  --theme-color-light-3: #a78bfa;
  --theme-color-light-5: #c4b5fd;
  --theme-color-light-7: #ddd6fe;
  --theme-color-light-9: #ede9fe;
  --theme-secondary: #d946ef;
  --theme-accent: #3b82f6;

  // 覆盖 Element Plus 全局主题色
  --el-color-primary: #8b5cf6;
  --el-color-primary-light-3: #a78bfa;
  --el-color-primary-light-5: #c4b5fd;
  --el-color-primary-light-7: #ddd6fe;
  --el-color-primary-light-8: #e9d5ff;
  --el-color-primary-light-9: #ede9fe;
  --el-color-primary-dark-2: #7c3aed;
  min-height: 100vh;
  padding: 25px 0;
  background: linear-gradient(135deg, #f5f3ff 0%, #faf5ff 50%, #f3f4f6 100%);
  position: relative;

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

  .donation-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
    position: relative;
    z-index: 1;

    .content-wrapper {
      display: grid;
      grid-template-columns: 1fr 360px;
      gap: 20px;

      @media (max-width: 1024px) {
        grid-template-columns: 1fr;
      }
    }
  }

  .card-header-custom {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 20px;
    margin-bottom: 24px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%);
    border-radius: 12px;
    border: 1px solid rgba(139, 92, 246, 0.1);
    position: relative;
    overflow: hidden;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%);
      pointer-events: none;
    }

    .header-icon {
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      border-radius: 12px;
      flex-shrink: 0;
      box-shadow: 0 4px 12px rgba(250, 112, 154, 0.3), 0 0 0 4px rgba(250, 112, 154, 0.1);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: -3px;
        right: -3px;
        width: 10px;
        height: 10px;
        background: #fee140;
        border-radius: 50%;
        box-shadow: 0 0 8px rgba(254, 225, 64, 0.8);
      }

      i {
        color: #fff;
        font-size: 22px;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
      }
    }
  }

    .header-content {
      flex: 1;
      min-width: 0;
      position: relative;
      z-index: 1;

      .header-title {
        font-size: 17px;
        font-weight: 700;
        background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin: 0 0 4px 0;
        line-height: 1.3;
      }

      .header-subtitle {
        font-size: 13px;
        color: var(--el-text-color-regular);
        margin: 0;
        line-height: 1.5;
      }
    }
  }

  @keyframes smoothIn {
    0% {
      opacity: 0;
      transform: translateY(20px);
    }

    100% {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-item {
    animation: smoothIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;

    &:nth-child(2) {
      animation-delay: 0.1s;
    }

    &:nth-child(3) {
      animation-delay: 0.2s;
    }

    &:nth-child(4) {
      animation-delay: 0.3s;
    }
  }

  .form-card,
  .info-card {
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(139, 92, 246, 0.08), 0 0 0 1px rgba(139, 92, 246, 0.05);
    overflow: hidden;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);

    &:hover {
      box-shadow: 0 8px 30px rgba(139, 92, 246, 0.12), 0 0 0 1px rgba(139, 92, 246, 0.1);
      transform: translateY(-2px);
    }

    :deep(.ant-card-head) {
      background: var(--el-bg-color);
      border-bottom: 1px solid var(--el-border-color);
      padding: 16px 20px;
      min-height: auto;

      .card-title {
        display: flex;
        align-items: center;
        gap: 8px;
        color: var(--el-text-color-primary);
        font-size: 16px;
        font-weight: 600;

        i {
          font-size: 18px;
          color: var(--theme-color);
        }
      }
    }

    :deep(.ant-card-body) {
      padding: 20px;
    }
  }

  .steps-section {
    margin-bottom: 28px;
    padding: 20px 24px;
    background: linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(217, 70, 239, 0.03) 100%);
    border-radius: 12px;
    border: 1px solid rgba(139, 92, 246, 0.08);

    :deep(.el-steps) {
      .el-step__head {
        .el-step__icon {
          width: 32px;
          height: 32px;
          font-size: 14px;
          border-width: 2px;
          transition: all 0.3s ease;
        }

        .el-step__line {
          top: 16px;
        }
      }

      .el-step__title {
        font-size: 14px;
        font-weight: 600;
        line-height: 32px;
      }

      .el-step__description {
        font-size: 12px;
        margin-top: 2px;
      }

      .el-step.is-process {
        .el-step__icon {
          box-shadow: 0 0 0 4px rgba(139, 92, 246, 0.1);
        }
      }
    }
  }

  .qrcode-section {
    margin-bottom: 24px;

    .qrcode-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      margin-bottom: 12px;

      i {
        color: var(--theme-color);
        font-size: 15px;
      }
    }

    .qrcode-grid {
      .qrcode-item {
        margin-bottom: 12px;

        @media (min-width: 768px) {
          margin-bottom: 0;
        }

        &:nth-child(n+3) {
          @media (max-width: 767px) {
            margin-bottom: 0;
          }
        }
      }
    }
  }

  .qrcode-item {
    cursor: pointer;
    position: relative;

    &.active .qrcode-container {
      border-color: var(--theme-color);
      box-shadow: 0 2px 12px var(--theme-color-light-7);
    }

    .qrcode-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 16px;
      background: linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(249, 250, 251, 0.9) 100%);
      border: 2px solid rgba(139, 92, 246, 0.1);
      border-radius: 12px;
      height: 100%;
      position: relative;
      transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: visible;

      &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, transparent 100%);
        opacity: 0;
        transition: opacity 0.4s ease;
        pointer-events: none;
      }

      &:hover {
        transform: translateY(-4px) scale(1.02);
        border-color: var(--theme-color);
        box-shadow: 0 8px 24px rgba(139, 92, 246, 0.15), 0 0 0 1px rgba(139, 92, 246, 0.1);

        &::before {
          opacity: 1;
        }
      }

      .qrcode-image-wrapper {
        width: 100%;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 10px;
        margin-bottom: 12px;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
        position: relative;
        transition: all 0.3s ease;

        &::after {
          content: '';
          position: absolute;
          inset: 0;
          border-radius: 10px;
          padding: 2px;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.2), rgba(217, 70, 239, 0.2));
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask-composite: xor;
          mask-composite: exclude;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          transition: transform 0.3s ease;
        }
      }

      &:hover .qrcode-image-wrapper {
        &::after {
          opacity: 1;
        }

        img {
          transform: scale(1.05);
        }
      }

      .qrcode-tip {
        font-size: 12px;
        font-weight: 500;
        color: var(--el-text-color-regular);
        text-align: center;
        position: relative;
        z-index: 10;

        .card-link {
          color: var(--theme-color);
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
          z-index: 10;
          pointer-events: auto;

          &:hover {
            color: var(--theme-color-light-3);
            text-decoration: underline;
          }
        }

        &.crypto-tip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;

          i {
            font-size: 12px;
            color: var(--el-color-success);
          }

          span {
            font-size: 12px;
            font-weight: 500;
            color: var(--el-text-color-regular);
          }
        }
      }

      .channel-badge {
        position: absolute;
        top: 10px;
        right: 10px;
        padding: 4px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
        z-index: 2;

        &.recommend {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(255, 107, 107, 0.4), 0 0 0 2px rgba(255, 107, 107, 0.1);
        }
      }

      .channel-badge-left {
        position: absolute;
        top: 10px;
        left: 10px;
        display: flex;
        align-items: center;
        gap: 4px;
        padding: 5px 10px;
        border-radius: 20px;
        font-size: 11px;
        font-weight: 600;
        line-height: 1;
        white-space: nowrap;
        z-index: 2;

        &.crypto-badge {
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          color: #fff;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4), 0 0 0 2px rgba(139, 92, 246, 0.1);

          i {
            font-size: 11px;
          }
        }
      }
    }
  }

  .qrcode-item {
    &.active {
      .qrcode-container {
        border-color: var(--theme-color);
        border-width: 3px;
        box-shadow: 0 8px 24px rgba(139, 92, 246, 0.2), 0 0 0 4px rgba(139, 92, 246, 0.1);
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%);

        &::before {
          opacity: 1;
        }
      }
    }
  }

  .crypto-info-tips {
    display: inline-flex;
    gap: 8px;
    margin-bottom: 16px;

    .crypto-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      padding: 4px 8px;
      background: linear-gradient(135deg, rgba(103, 194, 58, 0.08) 0%, rgba(103, 194, 58, 0.12) 100%);
      border: 1px solid rgba(103, 194, 58, 0.25);
      border-radius: 4px;

      i {
        font-size: 12px;
        color: #67c23a;
        flex-shrink: 0;
      }

      .badge-text {
        display: flex;
        align-items: center;
        gap: 3px;

        .badge-label {
          font-size: 11px;
          color: var(--el-text-color-secondary);
        }

        .badge-value {
          font-size: 12px;
          font-weight: 600;
          color: #67c23a;
        }
      }

      &.network {
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.08) 0%, rgba(139, 92, 246, 0.12) 100%);
        border-color: rgba(139, 92, 246, 0.25);

        i {
          color: #8b5cf6;
        }

        .badge-text .badge-value {
          color: #8b5cf6;
        }
      }
    }
  }

  .optional-section {
    margin-bottom: 18px;

    .section-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 12px;
      background: var(--el-fill-color-light);
      border-radius: 6px;
      cursor: pointer;
      transition: all 0.2s ease;
      user-select: none;

      &:hover {
        background: var(--el-fill-color);
      }

      .header-left {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 13px;
        color: var(--el-text-color-regular);

        i {
          color: var(--el-color-info);
          font-size: 14px;
        }
      }

      & > i {
        color: var(--el-text-color-secondary);
        font-size: 12px;
        transition: transform 0.2s ease;
      }
    }

    .optional-content {
      padding-top: 12px;
    }
  }

  .privacy-notice {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 12px;
    background: var(--el-color-info-light-9);
    border-left: 3px solid var(--el-color-info);
    border-radius: 4px;
    margin-bottom: 18px;
    font-size: 13px;
    color: var(--el-text-color-regular);

    i {
      color: var(--el-color-info);
      font-size: 14px;
    }
  }

  .donation-form {
    :deep(.el-form-item) {
      margin-bottom: 18px;

      .el-form-item__error {
        position: relative;
        z-index: 1;
      }
    }

    :deep(.el-form-item__label) {
      font-weight: 500;
      font-size: 14px;
      color: var(--el-text-color-primary);
      padding-bottom: 8px;
    }

    :deep(.el-input__inner),
    :deep(.el-textarea__inner) {
      border-radius: 6px;
      font-size: 14px;
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
      gap: 20px;
      margin-bottom: 20px;
      padding: 12px 14px;
      background: var(--el-fill-color-light);
      border-radius: 6px;

      .option-label {
        display: flex;
        align-items: center;
        gap: 6px;
        font-size: 13px;
        color: var(--el-text-color-regular);

        i {
          color: var(--theme-color);
        }
      }
    }

    .step-actions {
      display: flex;
      gap: 12px;
      margin-top: 28px;

      :deep(.el-button) {
        height: 44px;
        font-size: 15px;
        font-weight: 600;
        border-radius: 10px;
        transition: all 0.2s ease;

        &:hover {
          transform: translateY(-1px);
        }

        &:active {
          transform: translateY(0);
        }

        i {
          margin-right: 6px;
        }

        &.el-button--primary {
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          border: none;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);

          &:hover,
          &:focus {
            background: linear-gradient(135deg, #7c3aed 0%, #8b5cf6 100%);
            box-shadow: 0 4px 12px rgba(139, 92, 246, 0.35);
          }

          &:active {
            background: linear-gradient(135deg, #6d28d9 0%, #7c3aed 100%);
          }
        }
      }
    }

    .form-actions {
      margin-top: 20px;

      :deep(.el-button--primary) {
        height: 42px;
        font-size: 15px;
        font-weight: 600;
        border-radius: 6px;
        transition: all 0.3s ease;
        background-color: var(--theme-color);
        border-color: var(--theme-color);

        &:hover {
          transform: translateY(-1px);
          background-color: var(--theme-color-light-3);
          border-color: var(--theme-color-light-3);
        }

        &:focus {
          background-color: var(--theme-color);
          border-color: var(--theme-color);
        }

        &:active {
          background-color: var(--theme-color);
          border-color: var(--theme-color);
        }

        i {
          margin-right: 6px;
        }
      }
    }
  }

  .form-step-section {
    animation: fadeIn 0.3s ease;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }

    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .donation-info-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .stats-card {
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 14px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.03) 0%, rgba(217, 70, 239, 0.03) 100%);
        border: 1px solid rgba(139, 92, 246, 0.08);
        border-radius: 12px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        &:hover {
          border-color: rgba(139, 92, 246, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.1);

          &::before {
            opacity: 1;
          }

          .stat-icon {
            transform: scale(1.1) rotate(5deg);
          }
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          color: #fff;
          font-size: 22px;
          box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
          position: relative;
          z-index: 1;
        }

        .stat-info {
          flex: 1;
          position: relative;
          z-index: 1;

          .stat-value {
            font-size: 20px;
            font-weight: 700;
            background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
            margin-bottom: 4px;
          }

          .stat-label {
            font-size: 13px;
            color: var(--el-text-color-regular);
            font-weight: 500;
          }
        }
      }
    }
  }

  .guide-card {
    .guide-content {
      display: flex;
      flex-direction: column;
      gap: 14px;

      .guide-item {
        display: flex;
        gap: 12px;
        padding: 14px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.02) 0%, rgba(217, 70, 239, 0.02) 100%);
        border: 1px solid rgba(139, 92, 246, 0.06);
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        &:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%);
          border-color: rgba(139, 92, 246, 0.15);
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.08);

          &::before {
            transform: scaleY(1);
          }

          .guide-icon {
            transform: scale(1.1) rotate(5deg);
          }
        }

        .guide-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          color: #fff;
          font-size: 18px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
        }

        .guide-text {
          flex: 1;

          .guide-title {
            font-size: 15px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 4px;
          }

          .guide-desc {
            font-size: 13px;
            color: var(--el-text-color-regular);
            line-height: 1.5;
          }
        }
      }
    }
  }

  .recent-card {
    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .recent-item {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px;
        background: linear-gradient(135deg, rgba(139, 92, 246, 0.02) 0%, rgba(217, 70, 239, 0.02) 100%);
        border: 1px solid rgba(139, 92, 246, 0.06);
        border-radius: 10px;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        overflow: hidden;

        &::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          width: 3px;
          background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
          transform: scaleY(0);
          transition: transform 0.3s ease;
        }

        &:hover {
          background: linear-gradient(135deg, rgba(139, 92, 246, 0.05) 0%, rgba(217, 70, 239, 0.05) 100%);
          border-color: rgba(139, 92, 246, 0.15);
          transform: translateX(4px);
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.08);

          &::before {
            transform: scaleY(1);
          }

          .recent-avatar {
            transform: scale(1.1);
          }

          .recent-amount {
            transform: scale(1.05);
          }
        }

        .recent-avatar {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);
          color: #fff;
          font-size: 20px;
          flex-shrink: 0;
          box-shadow: 0 2px 8px rgba(139, 92, 246, 0.3);
          transition: all 0.3s ease;
        }

        .recent-info {
          flex: 1;
          min-width: 0;

          .recent-name {
            font-size: 14px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 3px;
          }

          .recent-time {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }

        .recent-amount {
          font-size: 16px;
          font-weight: 700;
          background: linear-gradient(135deg, #8b5cf6 0%, #d946ef 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          transition: all 0.3s ease;
        }
      }
    }
  
}
</style>
