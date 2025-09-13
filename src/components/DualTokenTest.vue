<template>
  <div class="dual-token-test">
    <div class="container">
      <h2>双Token登录测试</h2>

      <!-- 设备信息配置 -->
      <div class="device-config">
        <h3>设备信息配置</h3>
        <div class="form-group">
          <label>设备指纹:</label>
          <input v-model="deviceInfo.fingerprint" placeholder="设备指纹" />
        </div>
        <div class="form-group">
          <label>平台:</label>
          <select v-model="deviceInfo.platform">
            <option value="Web">Web</option>
            <option value="iOS">iOS</option>
            <option value="Android">Android</option>
          </select>
        </div>

      </div>

      <!-- 登录测试 -->
      <div class="login-section">
        <h3>登录测试</h3>
        <div class="form-group">
          <label>用户ID:</label>
          <input v-model="loginForm.userId" placeholder="输入用户ID" />
        </div>
        <button @click="login" :disabled="loading" class="btn-primary">
          {{ loading ? '登录中...' : '登录' }}
        </button>
      </div>

      <!-- Token信息显示 -->
      <div class="token-info" v-if="tokens.accessToken">
        <h3>Token信息</h3>
        <div class="token-item">
          <label>Access Token:</label>
          <textarea readonly :value="tokens.accessToken"></textarea>
        </div>
        <div class="token-item">
          <label>Refresh Token:</label>
          <textarea readonly :value="tokens.refreshToken"></textarea>
        </div>
        <div class="token-item">
          <label>过期时间:</label>
          <span>{{ tokens.expiresIn }}秒</span>
        </div>
      </div>

      <!-- 刷新Token测试 -->
      <div class="refresh-section" v-if="tokens.refreshToken">
        <h3>刷新Token测试</h3>
        <div class="button-group">
          <button @click="refreshToken" :disabled="refreshLoading" class="btn-secondary">
            {{ refreshLoading ? '刷新中...' : '刷新AccessToken' }}
          </button>
          <button @click="clearTokens" class="btn-warning">
            清除所有Token
          </button>
          <button @click="logout" :disabled="logoutLoading" class="btn-danger">
            {{ logoutLoading ? '登出中...' : '安全登出' }}
          </button>
        </div>
      </div>

      <!-- 测试API调用 -->
      <div class="api-test" v-if="tokens.accessToken">
        <h3>API测试</h3>
        <div class="button-group">
          <button @click="testTokenRead" :disabled="apiLoading" class="btn-info">
            {{ apiLoading ? '测试中...' : '测试Token读取' }}
          </button>
          <button @click="testApi" :disabled="apiLoading" class="btn-info">
            {{ apiLoading ? '测试中...' : '测试受保护的API' }}
          </button>
        </div>
      </div>

      <!-- 日志显示 -->
      <div class="logs">
        <h3>操作日志</h3>
        <div class="log-container">
          <div v-for="(log, index) in logs" :key="index" :class="['log-item', log.type]">
            <span class="log-time">{{ log.time }}</span>
            <span class="log-message">{{ log.message }}</span>
          </div>
        </div>
        <button @click="clearLogs" class="btn-clear">清空日志</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  dualTokenLogin,
  refreshToken as refreshTokenApi,
  testProtectedApi,
  testTokenApi,
  logoutApi,
  generateDeviceInfo as generateDeviceHeaders,
  TokenStorage,
  type DeviceHeaders
} from '@/request/dualTokenApi'

// 响应式数据
const loading = ref(false)
const refreshLoading = ref(false)
const apiLoading = ref(false)
const logoutLoading = ref(false)

const deviceInfo = ref({
  fingerprint: '',
  platform: 'Web'
})

const loginForm = ref({
  userId: ''
})

const tokens = ref({
  accessToken: '',
  refreshToken: '',
  expiresIn: 0
})

const logs = ref<Array<{time: string, message: string, type: string}>>([])

// 生成设备信息
const generateDeviceInfo = () => {
  const headers = generateDeviceHeaders()
  deviceInfo.value.fingerprint = headers['X-Fingerprint']
  deviceInfo.value.platform = headers['X-Platform']
}

// 添加日志
const addLog = (message: string, type: string = 'info') => {
  logs.value.unshift({
    time: new Date().toLocaleTimeString(),
    message,
    type
  })
}

// 清空日志
const clearLogs = () => {
  logs.value = []
}

// 清除所有Token
const clearTokens = () => {
  tokens.value.accessToken = ''
  tokens.value.refreshToken = ''
  tokens.value.expiresIn = 0
  TokenStorage.clearTokens()
  addLog('所有Token已清除', 'info')
}

// 获取请求头
const getHeaders = (): DeviceHeaders => {
  return {
    'X-Fingerprint': deviceInfo.value.fingerprint,
    'X-Platform': deviceInfo.value.platform as 'Web' | 'iOS' | 'Android',
    'X-Device-Id': 'web-browser-' + Math.random().toString(36).substring(2, 10) // 临时生成
  }
}

// 登录
const login = async () => {
  if (!loginForm.value.userId) {
    addLog('请输入用户ID', 'error')
    return
  }

  loading.value = true
  try {
    const response = await dualTokenLogin({
      user_id: loginForm.value.userId
    }, getHeaders())

    // 你的axios已经在响应拦截器中返回了response.data，所以response就是后端数据
    if (response.code === 200) {
      tokens.value.accessToken = response.data.access_token
      tokens.value.refreshToken = response.data.refresh_token
      tokens.value.expiresIn = response.data.expires_in

      // 保存到本地存储
      TokenStorage.saveTokens(
        response.data.access_token,
        response.data.refresh_token,
        getHeaders()
      )

      addLog('登录成功', 'success')
    } else {
      addLog(`登录失败: ${response.msg}`, 'error')
    }
  } catch (error: any) {
    addLog(`登录异常: ${error.message}`, 'error')
  } finally {
    loading.value = false
  }
}

// 刷新Token
const refreshToken = async () => {
  refreshLoading.value = true
  try {
    const response = await refreshTokenApi({
      refresh_token: tokens.value.refreshToken,
      user_id: loginForm.value.userId
    }, getHeaders())

    // response就是后端返回的数据
    if (response.code === 200) {
      tokens.value.accessToken = response.data.access_token
      tokens.value.expiresIn = response.data.expires_in

      // 更新本地存储
      TokenStorage.saveTokens(
        response.data.access_token,
        tokens.value.refreshToken,
        getHeaders()
      )

      addLog('Token刷新成功', 'success')
    } else {
      addLog(`Token刷新失败: ${response.msg}`, 'error')
    }
  } catch (error: any) {
    addLog(`Token刷新异常: ${error.message}`, 'error')
  } finally {
    refreshLoading.value = false
  }
}

// 测试Token读取
const testTokenRead = async () => {
  apiLoading.value = true
  try {
    const response = await testTokenApi(
      tokens.value.accessToken,
      tokens.value.refreshToken,
      getHeaders()
    )

    if (response.code === 200) {
      addLog('Token读取测试成功', 'success')
      console.log('Token读取结果:', response.data)
    } else {
      addLog(`Token读取失败: ${response.msg}`, 'error')
    }
  } catch (error: any) {
    addLog(`Token读取异常: ${error.message}`, 'error')
  } finally {
    apiLoading.value = false
  }
}

// 测试API
const testApi = async () => {
  apiLoading.value = true
  try {
    const response = await testProtectedApi(
      tokens.value.accessToken,
      tokens.value.refreshToken,
      getHeaders()
    )

    // response就是后端返回的数据
    if (response.code === 200) {
      addLog('API调用成功', 'success')
    } else {
      addLog(`API调用失败: ${response.msg}`, 'error')
    }
  } catch (error: any) {
    addLog(`API调用异常: ${error.message}`, 'error')
  } finally {
    apiLoading.value = false
  }
}

// 安全登出
const logout = async () => {
  if (!tokens.value.refreshToken || !loginForm.value.userId) {
    addLog('没有可登出的会话', 'error')
    return
  }

  logoutLoading.value = true
  try {
    const response = await logoutApi(
      loginForm.value.userId,
      tokens.value.refreshToken,
      getHeaders()
    )

    if (response.code === 200) {
      // 清除本地token
      clearTokens()
      addLog('安全登出成功', 'success')
    } else {
      addLog(`登出失败: ${response.msg}`, 'error')
    }

  } catch (error: any) {
    addLog(`登出异常: ${error.message}`, 'error')
  } finally {
    logoutLoading.value = false
  }
}

// 组件挂载时生成设备信息
onMounted(() => {
  generateDeviceInfo()
  addLog('页面加载完成，设备信息已生成', 'info')
})
</script>

<style scoped>
.dual-token-test {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.container {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
}

h2, h3 {
  color: #333;
  margin-bottom: 15px;
}

.device-config, .login-section, .token-info, .refresh-section, .api-test, .logs {
  background: white;
  padding: 15px;
  margin-bottom: 20px;
  border-radius: 6px;
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

.form-group input, .form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.token-item {
  margin-bottom: 10px;
}

.token-item textarea {
  width: 100%;
  height: 60px;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
}

.btn-primary, .btn-secondary, .btn-info, .btn-clear, .btn-warning, .btn-danger {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-right: 10px;
}

.btn-primary { background: #007bff; color: white; }
.btn-secondary { background: #6c757d; color: white; }
.btn-info { background: #17a2b8; color: white; }
.btn-clear { background: #dc3545; color: white; }
.btn-warning { background: #ffc107; color: #212529; }
.btn-danger { background: #dc3545; color: white; }

.button-group {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn-primary:disabled, .btn-secondary:disabled, .btn-info:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.log-container {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ddd;
  padding: 10px;
  margin-bottom: 10px;
}

.log-item {
  padding: 5px;
  margin-bottom: 5px;
  border-radius: 3px;
}

.log-item.success { background: #d4edda; color: #155724; }
.log-item.error { background: #f8d7da; color: #721c24; }
.log-item.info { background: #d1ecf1; color: #0c5460; }

.log-time {
  font-weight: bold;
  margin-right: 10px;
}
</style>
