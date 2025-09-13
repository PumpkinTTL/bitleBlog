<template>
    <footer class="modern-footer">
        <!-- 装饰背景图形 -->
        <div class="footer-bg">
            <div class="bg-shape shape-1"></div>
            <div class="bg-shape shape-2"></div>
        </div>

        <div class="footer-container">
            <!-- 顶部区域：品牌和导航链接 -->
            <div class="footer-top">
                <!-- 品牌区 -->
                <div class="footer-brand">
                    <div class="logo">B</div>
                    <div class="brand-info">
                        <h2>Bitle Blog</h2>
                        <p>探索技术的深度，分享创意的无限可能</p>
                    </div>
                </div>

                <!-- 链接区域 - 优化为单行紧凑设计 -->
                <div class="footer-links-wrapper">
                    <div class="footer-links">
                        <div class="link-column">
                            <h4>内容导航</h4>
                            <div class="link-rows">
                                <a href="/">首页</a>
                                <a href="/blog">博客文章</a>
                                <a href="/tutorials">技术教程</a>
                                <a href="/resources">精选资源</a>
                                <a href="/tools">实用工具</a>
                            </div>
                        </div>

                        <div class="link-column">
                            <h4>社区</h4>
                            <div class="link-rows">
                                <a href="/events">活动日历</a>
                                <a href="/contributors">贡献者</a>
                                <a href="/showcase">作品展示</a>
                                <a href="/challenges">编程挑战</a>
                            </div>
                        </div>

                        <div class="link-column">
                            <h4>关于我们</h4>
                            <div class="link-rows">
                                <a href="/about">关于Bitle</a>
                                <a href="/team">团队介绍</a>
                                <a href="/careers">加入我们</a>
                                <a href="/contact">联系方式</a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 订阅区域 -->
            <div class="footer-subscribe">
                <h3>订阅获取最新资讯</h3>
                <div class="subscribe-form">
                    <el-input v-model="email" placeholder="您的邮箱地址" class="email-input" />
                    <el-button @click="subscribe" class="subscribe-btn">
                        订阅 <i class="fas fa-paper-plane"></i>
                    </el-button>
                </div>
            </div>

            <!-- 社交媒体和版权区域 -->
            <div class="footer-bottom">
                <div class="social-links">
                    <a href="#" class="social-link" aria-label="微信"><i class="fab fa-weixin"></i></a>
                    <a href="#" class="social-link" aria-label="GitHub"><i class="fab fa-github"></i></a>
                    <a href="#" class="social-link" aria-label="知乎"><i class="fab fa-zhihu"></i></a>
                    <a href="#" class="social-link" aria-label="Twitter"><i class="fab fa-twitter"></i></a>
                </div>
                
                <div class="footer-meta">
                    <div class="footer-nav">
                        <a href="/privacy">隐私政策</a>
                        <a href="/terms">使用条款</a>
                        <a href="/sitemap">网站地图</a>
                    </div>
                    
                    <div class="copyright">
                        <p>&copy; {{ new Date().getFullYear() }} Bitle Blog. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    </footer>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'

const email = ref('')

const subscribe = () => {
  if (!email.value) {
    ElMessage.warning('请输入您的邮箱地址')
    return
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.value)) {
    ElMessage.error('请输入有效的邮箱地址')
    return
  }
  
  ElMessage.success('订阅成功！感谢您的关注')
  email.value = ''
}
</script>

<style scoped>
.modern-footer {
  position: relative;
  margin-top: 60px;
  background: #f8faff;
  color: #333;
  overflow: hidden;
  border-top: 1px solid rgba(22, 119, 255, 0.1);
}

/* 简化背景装饰 */
.footer-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.bg-shape {
  position: absolute;
  border-radius: 50%;
  opacity: 0.05;
}

.shape-1 {
  width: 400px;
  height: 400px;
  background: #1677FF;
  top: -200px;
  right: -100px;
}

.shape-2 {
  width: 300px;
  height: 300px;
  background: #1677FF;
  bottom: -150px;
  left: -100px;
}

.footer-container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 40px 20px 20px;
  position: relative;
  z-index: 1;
}

/* 顶部区域 */
.footer-top {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 30px;
}

/* 品牌区 */
.footer-brand {
  display: flex;
  align-items: center;
  gap: 15px;
  max-width: 300px;
}

.logo {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, #1677FF, #69b4ff);
  color: white;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
  font-weight: bold;
  box-shadow: 0 8px 15px rgba(22, 119, 255, 0.2);
}

.brand-info h2 {
  margin: 0 0 4px;
  font-size: 20px;
  font-weight: 700;
  background: linear-gradient(135deg, #1677FF, #69b4ff);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.brand-info p {
  margin: 0;
  font-size: 13px;
  color: #666;
  max-width: 220px;
}

/* 链接区域 - 更紧凑的布局 */
.footer-links-wrapper {
  flex: 1;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 30px;
}

.link-column h4 {
  margin: 0 0 12px;
  font-size: 15px;
  font-weight: 600;
  color: #333;
  position: relative;
  padding-bottom: 8px;
  border-bottom: 2px solid rgba(22, 119, 255, 0.1);
}

.link-rows {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 16px;
}

.link-rows a {
  color: #666;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  flex-basis: calc(50% - 8px);
  position: relative;
  padding-left: 12px;
}

.link-rows a:before {
  content: "•";
  position: absolute;
  left: 0;
  color: #1677FF;
}

.link-rows a:hover {
  color: #1677FF;
}

/* 订阅区域 */
.footer-subscribe {
  background: rgba(22, 119, 255, 0.05);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 30px;
}

.footer-subscribe h3 {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.subscribe-form {
  display: flex;
  gap: 10px;
}

.email-input {
  flex: 1;
}

.email-input :deep(.el-input__wrapper) {
  border-radius: 6px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.subscribe-btn {
  background: linear-gradient(135deg, #1677FF, #69b4ff);
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0 20px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.subscribe-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 10px rgba(22, 119, 255, 0.3);
}

.subscribe-btn i {
  margin-left: 5px;
  font-size: 12px;
}

/* 底部区域 */
.footer-bottom {
  border-top: 1px solid rgba(22, 119, 255, 0.1);
  padding-top: 20px;
}

.social-links {
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 20px;
}

.social-link {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: #666;
  background: rgba(22, 119, 255, 0.1);
  transition: all 0.3s ease;
}

.social-link:hover {
  color: white;
  background: #1677FF;
  transform: translateY(-3px);
  box-shadow: 0 4px 8px rgba(22, 119, 255, 0.2);
}

.footer-meta {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 10px;
}

.footer-nav {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 15px;
}

.footer-nav a {
  color: #666;
  text-decoration: none;
  font-size: 13px;
  transition: color 0.2s ease;
}

.footer-nav a:hover {
  color: #1677FF;
}

.copyright p {
  margin: 0;
  font-size: 13px;
  color: #999;
}

/* 响应式设计 - 优化移动端布局 */
@media (max-width: 900px) {
  .footer-top {
    flex-direction: column;
  }
  
  .footer-brand {
    width: 100%;
    max-width: none;
    margin-bottom: 10px;
  }
  
  .footer-links {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }
  
  .subscribe-form {
    flex-direction: column;
    gap: 10px;
  }
}

@media (max-width: 576px) {
  .footer-links {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .link-rows a {
    flex-basis: 100%;
  }
  
  .footer-brand {
    flex-direction: row;
    text-align: left;
  }
}
</style>