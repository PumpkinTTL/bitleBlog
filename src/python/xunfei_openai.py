from openai import OpenAI
import os
from dotenv import load_dotenv
import logging
import requests

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# 加载环境变量
load_dotenv()

def get_spark_response(prompt):
    """
    使用OpenAI SDK调用讯飞星火API
    
    Args:
        prompt: 用户问题
        
    Returns:
        星火API的回答
    """
    try:
        # 从环境变量获取API密钥
        api_key = os.getenv("XUNFEI_API_PASSWORD")
        
        if not api_key:
            logger.error("未设置 XUNFEI_API_PASSWORD 环境变量")
            return "错误: 请在.env文件中设置XUNFEI_API_PASSWORD"
        
        logger.info(f"使用API密钥: {api_key[:4]}...{api_key[-4:] if len(api_key) > 8 else ''}")
        
        # 创建OpenAI客户端，连接到讯飞星火API
        client = OpenAI(
            api_key=api_key,
            base_url="https://spark-api-open.xf-yun.com/v1/",
            timeout=30.0
        )
        
        # 发送请求
        logger.info(f"发送请求到星火API: {prompt[:30]}...")
        completion = client.chat.completions.create(
            model="Lite",  # 指定请求Spark Lite版本
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ]
        )
        
        # 返回响应
        logger.info("成功收到星火API响应")
        return completion.choices[0].message.content
        
    except requests.exceptions.ConnectionError as ce:
        logger.error(f"网络连接错误: {ce}")
        return f"网络连接错误: 无法连接到讯飞星火API服务器，请检查网络连接和防火墙设置"
    except Exception as e:
        logger.error(f"调用星火API时出错: {e}")
        return f"调用星火API时出错: {str(e)}"

# 测试
if __name__ == "__main__":
    question = "说一个程序员才懂的笑话"
    response = get_spark_response(question)
    print(f"问题: {question}")
    print(f"回答: {response}") 