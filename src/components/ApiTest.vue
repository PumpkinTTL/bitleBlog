<template>
  <div class="api-test">
    <h2>API连接测试</h2>
    
    <div class="test-section">
      <h3>1. 基础连接测试</h3>
      <button @click="testConnection" :disabled="loading">
        {{ loading ? '测试中...' : '测试后端连接' }}
      </button>
      
      <div v-if="connectionResult" class="result">
        <h4>连接结果:</h4>
        <pre>{{ connectionResult }}</pre>
      </div>
    </div>

    <div class="test-section">
      <h3>2. 双Token登录测试</h3>
      <div class="form-group">
        <label>用户ID:</label>
        <input v-model="userId" placeholder="输入用户ID" />
      </div>
      <button @click="testLogin" :disabled="loginLoading">
        {{ loginLoading ? '登录中...' : '测试登录' }}
      </button>
      
      <div v-if="loginResult" class="result">
        <h4>登录结果:</h4>
        <pre>{{ loginResult }}</pre>
      </div>
    </div>

    <div class="logs">
      <h3>请求日志</h3>
      <div class="log-container">
        <div v-for="(log, index) in logs" :key="index" class="log-item">
          <span class="log-time">{{ log.time }}</span>
          <span class="log-message">{{ log.message }}</span>
        </div>
      </div>
      <button @click="clearLogs">清空日志</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import Axios from '@/request/index'

const loading = ref(false)
const loginLoading = ref(false)
const connectionResult = ref('')
const loginResult = ref('')
const userId = ref('12345')
const logs = ref<Array<{time: string, message: string}>>([])

const addLog = (message: string) => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message
  })
}

const clearLogs = () => {
  logs.value = []
}

// 测试基础连接
const testConnection = async () => {
  loading.value = true
  addLog('开始测试后端连接...')
  
  try {
    // 先测试一个简单的接口
    const response = await Axios.get('/v1/user/selectUserInfoById?id=1')
    connectionResult.value = JSON.stringify(response, null, 2)
    addLog('后端连接成功')
  } catch (error: any) {
    connectionResult.value = `连接失败: ${error.message}`
    addLog(`连接失败: ${error.message}`)
  } finally {
    loading.value = false
  }
}

// 测试双token登录
const testLogin = async () => {
  if (!userId.value) {
    addLog('请输入用户ID')
    return
  }

  loginLoading.value = true
  addLog('开始测试双token登录...')
  
  try {
    // 设置设备头信息
    const originalHeaders = { ...Axios.defaults.headers.common }
    Axios.defaults.headers.common['X-Fingerprint'] = 'fp_test_' + Date.now()
    Axios.defaults.headers.common['X-Platform'] = 'Web'
    
    const response = await Axios.post('/v2/user/login', {
      user_id: userId.value
    })
    
    loginResult.value = JSON.stringify(response, null, 2)
    addLog('双token登录测试完成')
    
    // 恢复原始头信息
    Axios.defaults.headers.common = originalHeaders
    
  } catch (error: any) {
    loginResult.value = `登录失败: ${error.message}`
    addLog(`登录失败: ${error.message}`)
  } finally {
    loginLoading.value = false
  }
}
</script>

<style scoped>
.api-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.test-section {
  background: white;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

button {
  background: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.result {
  margin-top: 15px;
  padding: 15px;
  background: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
}

.result pre {
  white-space: pre-wrap;
  word-break: break-all;
  margin: 0;
  font-size: 12px;
}

.logs {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
  background: #f8f9fa;
}

.log-item {
  padding: 5px;
  margin-bottom: 5px;
  border-bottom: 1px solid #eee;
}

.log-time {
  font-weight: bold;
  margin-right: 10px;
  color: #666;
}
</style>
