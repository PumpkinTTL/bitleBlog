<template>
  <div class="python-demo">
    <h2>Python Backend Communication</h2>
    
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Test Connection</h5>
        <button class="btn btn-primary" @click="testConnection" :disabled="loading">
          {{ loading ? 'Loading...' : 'Test Connection' }}
        </button>
        <div v-if="message" class="alert alert-info mt-3">
          {{ message }}
        </div>
      </div>
    </div>
    
    <div class="card mb-3">
      <div class="card-body">
        <h5 class="card-title">Send Data to Python</h5>
        <div class="mb-3">
          <label for="dataInput" class="form-label">Data to send:</label>
          <textarea 
            id="dataInput" 
            v-model="dataToSend" 
            class="form-control" 
            rows="3"
            placeholder="{ &quot;name&quot;: &quot;value&quot; }"
          ></textarea>
        </div>
        <button class="btn btn-success" @click="sendData" :disabled="sendLoading">
          {{ sendLoading ? 'Sending...' : 'Send Data' }}
        </button>
        <div v-if="responseData" class="mt-3">
          <h6>Response:</h6>
          <pre class="bg-light p-3 rounded">{{ JSON.stringify(responseData, null, 2) }}</pre>
        </div>
      </div>
    </div>

    <div class="card">
      <div class="card-body">
        <h5 class="card-title">Ask 讯飞星火 AI</h5>
        <div class="mb-3">
          <label for="sparkInput" class="form-label">Your question:</label>
          <textarea 
            id="sparkInput" 
            v-model="sparkQuestion" 
            class="form-control" 
            rows="3"
            placeholder="Enter your question..."
          ></textarea>
        </div>
        <button class="btn btn-primary" @click="askSpark" :disabled="sparkLoading">
          {{ sparkLoading ? 'Asking...' : 'Ask AI' }}
        </button>
        <div v-if="sparkResponse" class="mt-3">
          <h6>AI Response:</h6>
          <div class="bg-light p-3 rounded ai-response">{{ sparkResponse }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import pythonApi from '../api/pythonApi';

export default defineComponent({
  name: 'PythonDemo',
  setup() {
    const message = ref('');
    const loading = ref(false);
    const dataToSend = ref('{\n  "name": "测试",\n  "value": 123\n}');
    const responseData = ref(null);
    const sendLoading = ref(false);
    const sparkQuestion = ref('');
    const sparkResponse = ref('');
    const sparkLoading = ref(false);

    const testConnection = async () => {
      loading.value = true;
      message.value = '';
      try {
        const response = await pythonApi.getHello();
        message.value = response.message || 'Connection successful!';
      } catch (error) {
        console.error('Error connecting to Python backend:', error);
        message.value = 'Error connecting to Python backend. Make sure it is running.';
      } finally {
        loading.value = false;
      }
    };

    const sendData = async () => {
      sendLoading.value = true;
      responseData.value = null;
      
      try {
        // 将输入框中的JSON字符串解析为对象
        const data = JSON.parse(dataToSend.value);
        const response = await pythonApi.sendData(data);
        responseData.value = response;
      } catch (error: any) {
        console.error('Error sending data:', error);
        responseData.value = { 
          error: true, 
          message: error.message || 'Error sending data'
        };
      } finally {
        sendLoading.value = false;
      }
    };

    const askSpark = async () => {
      if (!sparkQuestion.value.trim() || sparkLoading.value) return;
      
      sparkLoading.value = true;
      try {
        const response = await pythonApi.askSpark(sparkQuestion.value.trim());
        sparkResponse.value = response.answer;
      } catch (error: any) {
        console.error('Error asking Spark AI:', error);
        sparkResponse.value = `Error: ${error.message || 'Failed to get response from AI'}`;
      } finally {
        sparkLoading.value = false;
      }
    };

    return {
      message,
      loading,
      dataToSend,
      responseData,
      sendLoading,
      sparkQuestion,
      sparkResponse,
      sparkLoading,
      testConnection,
      sendData,
      askSpark
    };
  }
});
</script>

<style scoped>
.python-demo {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

pre, .ai-response {
  white-space: pre-wrap;
  word-break: break-word;
  max-height: 300px;
  overflow-y: auto;
}
</style> 