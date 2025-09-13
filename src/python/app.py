from flask import Flask, jsonify, request
from flask_cors import CORS
import os
from dotenv import load_dotenv
from xunfei_openai import get_spark_response

# 加载.env文件中的环境变量
load_dotenv()

app = Flask(__name__)
CORS(app)  # 启用CORS，允许Vue前端发送请求

@app.route('/api/hello', methods=['GET'])
def hello():
    return jsonify({
        'message': 'Hello from Flask!',
        'status': 'success'
    })

@app.route('/api/data', methods=['POST'])
def receive_data():
    data = request.json
    print(f"Received data: {data}")
    
    # 在这里处理从Vue发来的数据
    return jsonify({
        'message': 'Data received successfully',
        'received': data,
        'status': 'success'
    })

@app.route('/api/spark/chat', methods=['POST'])
def spark_chat():
    """
    讯飞星火API聊天端点 (单次对话)
    """
    data = request.json
    if not data or 'question' not in data:
        return jsonify({
            'error': '缺少问题参数',
            'status': 'error'
        }), 400
    
    question = data['question']
    response = get_spark_response(question)
    
    return jsonify({
        'answer': response,
        'status': 'success'
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)