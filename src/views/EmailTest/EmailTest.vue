<template>
  <div class="email-test-page">
    <div class="page-header">
      <h1 class="page-title">邮箱测试</h1>
      <p class="page-subtitle">测试邮件发送功能</p>
    </div>

    <div class="page-content">
      <el-card class="test-card">
        <template #header>
          <div class="card-header">
            <span>发送测试邮件</span>
          </div>
        </template>

        <el-form 
          ref="emailFormRef" 
          :model="emailForm" 
          :rules="emailRules" 
          label-width="100px"
          class="email-form"
        >
          <el-form-item label="收件人邮箱" prop="to">
            <el-input 
              v-model="emailForm.to" 
              placeholder="请输入收件人邮箱地址"
              clearable
            />
          </el-form-item>

          <el-form-item label="邮件主题" prop="subject">
            <el-input 
              v-model="emailForm.subject" 
              placeholder="请输入邮件主题"
              clearable
            />
          </el-form-item>

          <el-form-item label="邮件内容" prop="content">
            <el-input 
              v-model="emailForm.content" 
              type="textarea"
              :rows="6"
              placeholder="请输入邮件内容"
            />
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleSendTestEmail"
              :loading="sending"
              :disabled="sending"
            >
              {{ sending ? '发送中...' : '发送测试邮件' }}
            </el-button>
            <el-button @click="resetForm">重置</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card class="result-card" v-if="sendResult">
        <template #header>
          <div class="card-header">
            <span>发送结果</span>
          </div>
        </template>

        <div class="result-content">
          <el-alert 
            :type="sendResult.success ? 'success' : 'error'" 
            :closable="false"
          >
            <template #default>
              <div class="result-message">
                <p><strong>状态：</strong>{{ sendResult.success ? '发送成功' : '发送失败' }}</p>
                <p><strong>时间：</strong>{{ sendResult.timestamp }}</p>
                <p v-if="sendResult.message"><strong>信息：</strong>{{ sendResult.message }}</p>
              </div>
            </template>
          </el-alert>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { sendTestEmail as apiSendTestEmail, getEmailConfigStatus } from '@/request/email'

// 定义表单数据类型
interface EmailForm {
  to: string
  subject: string
  content: string
}

// 定义发送结果类型
interface SendResult {
  success: boolean
  message: string
  timestamp: string
}

// 定义邮件配置状态类型
interface EmailConfigStatus {
  isConfigured: boolean
  smtpServer: string
  port: number
  senderEmail: string
}

// 表单引用
const emailFormRef = ref<FormInstance>()

// 发送状态
const sending = ref(false)

// 发送结果
const sendResult = ref<SendResult | null>(null)

// 邮件配置状态
const emailConfigStatus = ref<EmailConfigStatus | null>(null)

// 表单数据
const emailForm = reactive<EmailForm>({
  to: '',
  subject: '测试邮件',
  content: '这是一封测试邮件，用于验证邮件发送功能是否正常。'
})

// 表单验证规则
const emailRules = reactive<FormRules>({
  to: [
    { required: true, message: '请输入收件人邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  subject: [
    { required: true, message: '请输入邮件主题', trigger: 'blur' }
  ],
  content: [
    { required: true, message: '请输入邮件内容', trigger: 'blur' }
  ]
})

// 获取邮件配置状态
const fetchEmailConfigStatus = async () => {
  try {
    const res: any = await getEmailConfigStatus()
    emailConfigStatus.value = res.data
  } catch (error) {
    console.error('获取邮件配置状态失败:', error)
  }
}

// 发送测试邮件
const handleSendTestEmail = async () => {
  if (!emailFormRef.value) return
  
  await emailFormRef.value.validate(async (valid) => {
    if (valid) {
      sending.value = true
      
      try {
        // 调用真实的API接口发送测试邮件
        const res: any = await apiSendTestEmail({
          to: emailForm.to,
          subject: emailForm.subject,
          content: emailForm.content
        })
        
        sendResult.value = {
          success: res.code === 200,
          message: res.msg || (res.code === 200 ? '邮件已成功发送至指定邮箱' : '邮件发送失败'),
          timestamp: new Date().toLocaleString('zh-CN')
        }
        
        if (res.code === 200) {
          ElMessage.success('测试邮件发送成功')
        } else {
          ElMessage.error('测试邮件发送失败: ' + (res.msg || '未知错误'))
        }
      } catch (error: any) {
        sendResult.value = {
          success: false,
          message: '邮件发送过程中发生错误: ' + (error.message || '未知错误'),
          timestamp: new Date().toLocaleString('zh-CN')
        }
        ElMessage.error('邮件发送失败')
      } finally {
        sending.value = false
      }
    } else {
      ElMessage.warning('请填写正确的表单信息')
    }
  })
}

// 重置表单
const resetForm = () => {
  emailFormRef.value?.resetFields()
  sendResult.value = null
}

// 组件挂载时获取邮件配置状态
onMounted(() => {
  fetchEmailConfigStatus()
})
</script>

<style lang="less" scoped>
.email-test-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
  
  .page-header {
    text-align: center;
    margin-bottom: 30px;
    
    .page-title {
      font-size: 28px;
      font-weight: 600;
      color: #333;
      margin-bottom: 10px;
    }
    
    .page-subtitle {
      font-size: 16px;
      color: #666;
    }
  }
  
  .page-content {
    .test-card {
      margin-bottom: 20px;
      
      .card-header {
        font-size: 18px;
        font-weight: 500;
      }
      
      .email-form {
        max-width: 600px;
      }
    }
    
    .result-card {
      .card-header {
        font-size: 18px;
        font-weight: 500;
      }
      
      .result-content {
        .result-message {
          p {
            margin: 8px 0;
            
            strong {
              color: #333;
            }
          }
        }
      }
    }
  }
}
</style>
