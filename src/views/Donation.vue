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

            <div class="channel-selection">
              <div v-for="channel in channels" :key="channel.key" class="channel-item" :class="{ active: selectedChannel === channel.key, disabled: channel.disabled }" @click="!channel.disabled && selectChannel(channel.key)">
                <div class="channel-icon" :style="{ color: channel.color }">
                  <i :class="channel.icon"></i>
                </div>
                <div class="channel-info">
                  <div class="channel-name">
                    {{ channel.label }}
                    <span v-if="channel.badge" class="channel-badge" :class="channel.badge.type">{{ channel.badge.text }}</span>
                  </div>
                  <div class="channel-desc">{{ channel.description }}</div>
                </div>
                <div class="channel-check">
                  <i class="fas fa-check-circle"></i>
                </div>
              </div>
            </div>

            <div class="donation-form">
              <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
                <!-- 二维码选择区域 - 常驻显示 -->
                <div class="qrcode-section">
                  <div class="qrcode-title">
                    <i class="fas fa-hand-holding-heart"></i>
                    <span>选择捐赠方式</span>
                  </div>
                  <el-row :gutter="12" class="qrcode-grid">
                    <el-col :xs="12" :sm="6" :md="6">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'cardkey' }" @click="selectChannel('cardkey')">
                        <div class="qrcode-container">
                          <div class="qrcode-image-wrapper">
                            <img :src="collectionCarkey" alt="卡密兑换" />
                          </div>
                          <div class="qrcode-tip">卡密兑换</div>
                          <span class="channel-badge recommend">推荐</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'crypto' }" @click="selectChannel('crypto')">
                        <div class="qrcode-container">
                          <div class="qrcode-image-wrapper">
                            <img :src="collectionTp" alt="USDT收款码" />
                          </div>
                          <div class="qrcode-tip">USDT (TRC20)</div>
                          <span class="channel-badge recommend">推荐</span>
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'alipay' }" @click="selectChannel('alipay')">
                        <div class="qrcode-container">
                          <div class="qrcode-image-wrapper">
                            <img :src="collectionAlipay" alt="支付宝收款码" />
                          </div>
                          <div class="qrcode-tip">支付宝</div>
                        </div>
                      </div>
                    </el-col>
                    <el-col :xs="12" :sm="6" :md="6">
                      <div class="qrcode-item" :class="{ active: selectedChannel === 'wechat' }" @click="selectChannel('wechat')">
                        <div class="qrcode-container">
                          <div class="qrcode-image-wrapper">
                            <img :src="collectionWechat" alt="微信收款码" />
                          </div>
                          <div class="qrcode-tip">微信支付</div>
                        </div>
                      </div>
                    </el-col>
                  </el-row>
                </div>

                <!-- 表单区域 - 根据选择显示不同内容 -->
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
                    <el-input-number v-model="formData.amount" :min="1" :max="99999" :precision="2" placeholder="请输入USDT金额" style="width: 100%" controls-position="right" />
                  </el-form-item>
                  <el-form-item label="交易哈希" prop="transaction_hash">
                    <el-input v-model="formData.transaction_hash" placeholder="请输入交易哈希值" clearable>
                      <template #prefix><i class="fas fa-hashtag"></i></template>
                    </el-input>
                  </el-form-item>
                </template>

                <template v-if="selectedChannel === 'wechat' || selectedChannel === 'alipay'">
                  <el-form-item label="捐赠金额" prop="amount">
                    <el-input-number v-model="formData.amount" :min="1" :max="99999" :precision="2" placeholder="请输入捐赠金额" style="width: 100%" controls-position="right" />
                  </el-form-item>
                  <el-form-item label="订单号" prop="order_no">
                    <el-input v-model="formData.order_no" placeholder="请输入支付订单号" clearable>
                      <template #prefix><i class="fas fa-receipt"></i></template>
                    </el-input>
                  </el-form-item>
                </template>

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
                        <el-input v-model="formData.remark" type="textarea" placeholder="留下您的祝福或建议" :rows="4" :maxlength="200" show-word-limit />
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

                <div class="form-actions">
                  <el-button type="primary" :loading="submitting" @click="handleSubmit" style="width: 100%">
                    <i class="fas fa-heart"></i>
                    <span>{{ submitting ? '提交中...' : '提交捐赠' }}</span>
                  </el-button>
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

    <CelebrationModal v-model:visible="showCelebration" :title="celebrationData.title" :message="celebrationData.message" :sub-message="celebrationData.subMessage" :details="celebrationData.details" :actions="celebrationData.actions" type="celebration" :show-confetti="true" @close="handleCelebrationClose" />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'
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
  { key: 'alipay' as DonationChannel, label: '支付宝', icon: 'fab fa-alipay', color: '#1677FF', description: '使用支付宝扫码支付' }
]

const formRef = ref<FormInstance>()
const selectedChannel = ref<DonationChannel>('cardkey')
const submitting = ref(false)
const showOptional = ref(false)

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
        { text: '查看记录', type: 'primary', icon: 'fas fa-list', handler: () => { showCelebration.value = false; ElMessage.info('捐赠记录功能开发中') } },
        { text: '继续捐赠', icon: 'fas fa-redo', handler: () => { showCelebration.value = false; formRef.value?.resetFields() } }
      ]

      showCelebration.value = true
      formRef.value?.resetFields()
      formData.channel = selectedChannel.value
    } else {
      ElMessage.error(response.message || '捐赠失败，请重试')
    }
  } catch (error: any) {
    console.error('捐赠提交失败:', error)
    if (error.errorFields) {
      ElMessage.warning('请完善表单信息')
    } else {
      ElMessage.error(error.message || '捐赠失败，请重试')
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
  min-height: 100vh;
  padding: 25px 0;
  background: var(--el-bg-color-page);

  .donation-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;

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
    padding: 12px 16px;
    margin-bottom: 20px;
    background: var(--el-fill-color-light);
    border-radius: 8px;

    .header-icon {
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
      border-radius: 8px;
      flex-shrink: 0;
      box-shadow: 0 2px 8px rgba(250, 112, 154, 0.3);
      position: relative;

      &::after {
        content: '';
        position: absolute;
        top: -2px;
        right: -2px;
        width: 8px;
        height: 8px;
        background: #fee140;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(254, 225, 64, 0.6);
      }

      i {
        color: #fff;
        font-size: 18px;
      }
    }

    .header-content {
      flex: 1;
      min-width: 0;

      .header-title {
        font-size: 15px;
        font-weight: 600;
        color: var(--el-text-color-primary);
        margin: 0 0 2px 0;
        line-height: 1.3;
      }

      .header-subtitle {
        font-size: 12px;
        color: var(--el-text-color-secondary);
        margin: 0;
        line-height: 1.4;
      }
    }
  }

  .animate-item {
    animation: smoothIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    opacity: 0;

    &:nth-child(2) { animation-delay: 0.1s; }
    &:nth-child(3) { animation-delay: 0.2s; }
    &:nth-child(4) { animation-delay: 0.3s; }
  }

  @keyframes smoothIn {
    0% { opacity: 0; transform: translateY(20px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  .form-card, .info-card {
    border-radius: 8px;
    box-shadow: var(--el-box-shadow-light);
    overflow: hidden;
    background: var(--el-bg-color);
    transition: box-shadow 0.3s ease;

    &:hover {
      box-shadow: var(--el-box-shadow);
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
          color: var(--el-color-primary);
        }
      }
    }

    :deep(.ant-card-body) {
      padding: 20px;
    }
  }

  .channel-selection {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 24px;

    @media (max-width: 640px) {
      grid-template-columns: 1fr;
    }

    .channel-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border: 1.5px solid var(--el-border-color);
      border-radius: 8px;
      cursor: pointer;
      transition: all 0.2s ease;
      background: var(--el-fill-color-light);

      &:hover {
        border-color: var(--el-color-primary);
        background: var(--el-bg-color);
        box-shadow: 0 2px 8px var(--el-color-primary-light-7);
      }

      &.active {
        border-color: var(--el-color-primary);
        background: var(--el-color-primary-light-9);
        box-shadow: 0 2px 8px var(--el-color-primary-light-7);

        .channel-check { opacity: 1; }
      }

      &.disabled {
        opacity: 0.6;
        cursor: not-allowed;
        
        &:hover {
          border-color: var(--el-border-color);
          background: var(--el-fill-color-light);
          box-shadow: none;
          transform: none;
        }
      }

      .channel-icon {
        width: 40px;
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 8px;
        background: var(--el-bg-color);
        flex-shrink: 0;

        i { font-size: 20px; }
      }

      .channel-info {
        flex: 1;
        min-width: 0;

        .channel-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--el-text-color-primary);
          margin-bottom: 2px;
          display: flex;
          align-items: center;
          gap: 6px;

          .channel-badge {
            display: inline-flex;
            align-items: center;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 10px;
            font-weight: 500;
            line-height: 1;
            white-space: nowrap;

            &.recommend {
              background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
              color: #fff;
              box-shadow: 0 1px 3px rgba(255, 107, 107, 0.3);
            }

            &.disabled {
              background: var(--el-fill-color);
              color: var(--el-text-color-secondary);
              border: 1px solid var(--el-border-color);
            }
          }
        }

        .channel-desc {
          font-size: 12px;
          color: var(--el-text-color-secondary);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .channel-check {
        color: var(--el-color-primary);
        font-size: 18px;
        opacity: 0;
        transition: opacity 0.2s ease;
      }
    }
  }

  .qrcode-section {
    margin-bottom: 20px;

    .qrcode-title {
      display: flex;
      align-items: center;
      gap: 6px;
      font-size: 14px;
      font-weight: 500;
      color: var(--el-text-color-primary);
      margin-bottom: 12px;

      i {
        color: var(--el-color-primary);
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

    .qrcode-item {
      cursor: pointer;
      position: relative;

      &.active .qrcode-container {
        border-color: var(--el-color-primary);
        box-shadow: 0 2px 12px var(--el-color-primary-light-7);
      }
    }

    .qrcode-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 12px;
      background: var(--el-fill-color-light);
      border: 2px solid var(--el-border-color);
      border-radius: 8px;
      height: 100%;
      position: relative;
      transition: all 0.3s ease;

      &:hover {
        transform: translateY(-2px);
        border-color: var(--el-color-primary-light-5);
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
      }

      .qrcode-image-wrapper {
        width: 100%;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        border-radius: 6px;
        margin-bottom: 8px;
        background: var(--el-bg-color);

        img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
        }
      }

      .qrcode-tip {
        font-size: 12px;
        font-weight: 500;
        color: var(--el-text-color-regular);
        text-align: center;
      }

      .channel-badge {
        position: absolute;
        top: 8px;
        right: 8px;
        padding: 2px 6px;
        border-radius: 4px;
        font-size: 10px;
        font-weight: 500;
        line-height: 1;
        white-space: nowrap;

        &.recommend {
          background: linear-gradient(135deg, #ff6b6b 0%, #ff8787 100%);
          color: #fff;
          box-shadow: 0 1px 3px rgba(255, 107, 107, 0.3);
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
        background: linear-gradient(135deg, rgba(64, 158, 255, 0.08) 0%, rgba(64, 158, 255, 0.12) 100%);
        border-color: rgba(64, 158, 255, 0.25);

        i {
          color: #409eff;
        }

        .badge-text .badge-value {
          color: #409eff;
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

      > i {
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

    :deep(.el-input__inner), :deep(.el-textarea__inner) {
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

        i { color: var(--el-color-primary); }
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

        &:hover {
          transform: translateY(-1px);
        }

        i { 
          margin-right: 6px;
        }
      }
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
      gap: 12px;

      .stat-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 14px;
        background: var(--el-fill-color-light);
        border-radius: 8px;
        transition: all 0.2s ease;

        &:hover {
          background: var(--el-fill-color);
          transform: translateY(-1px);
        }

        .stat-icon {
          width: 42px;
          height: 42px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          background: var(--el-color-primary);
          color: #fff;
          font-size: 20px;
        }

        .stat-info {
          flex: 1;

          .stat-value {
            font-size: 18px;
            font-weight: 700;
            color: var(--el-text-color-primary);
            margin-bottom: 2px;
          }

          .stat-label {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }
      }
    }
  }

  .guide-card {
    .guide-content {
      display: flex;
      flex-direction: column;
      gap: 12px;

      .guide-item {
        display: flex;
        gap: 10px;
        padding: 10px;
        background: var(--el-fill-color-light);
        border-radius: 6px;
        transition: all 0.2s ease;

        &:hover {
          background: var(--el-fill-color);
          transform: translateX(2px);
        }

        .guide-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 6px;
          background: var(--el-color-primary);
          color: #fff;
          font-size: 16px;
          flex-shrink: 0;
        }

        .guide-text {
          flex: 1;

          .guide-title {
            font-size: 14px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 2px;
          }

          .guide-desc {
            font-size: 12px;
            color: var(--el-text-color-regular);
            line-height: 1.4;
          }
        }
      }
    }
  }

  .recent-card {
    .recent-list {
      display: flex;
      flex-direction: column;
      gap: 10px;

      .recent-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 10px;
        background: var(--el-fill-color-light);
        border-radius: 6px;
        transition: all 0.2s ease;

        &:hover {
          background: var(--el-fill-color);
          transform: translateX(2px);
        }

        .recent-avatar {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: var(--el-color-primary);
          color: #fff;
          font-size: 18px;
          flex-shrink: 0;
        }

        .recent-info {
          flex: 1;
          min-width: 0;

          .recent-name {
            font-size: 13px;
            font-weight: 600;
            color: var(--el-text-color-primary);
            margin-bottom: 2px;
          }

          .recent-time {
            font-size: 12px;
            color: var(--el-text-color-secondary);
          }
        }

        .recent-amount {
          font-size: 15px;
          font-weight: 700;
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
