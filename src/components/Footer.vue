<template>
    <footer class="footer">
        <div class="w">
            <div class="footer-top">
                <a href="#" class="footer-link">卑鄙的南瓜头</a>
            </div>
            <div class="footer-middle">
                <p class="footer-disclaimer">
                    声明：本站所有资源均汇集于互联网供网友分享，仅供学习与交流，请下载后24小时内删除；
                    如果侵犯到你的权利，请及时联系我们删除资源
                    <a href="mailto:fenxmi@163.com" class="footer-email">weekseven@163.com</a>
                </p>
            </div>
            <div class="footer-bottom">
                <p>Copyright © 2024 南瓜头的博客 &nbsp; 湘ICP备2024002413号-1</p>
            </div>
        </div>
    </footer>
</template>
  
<script>
  export default {
    name: 'FooterComponent',
  };
  </script>
  
  <style scoped>
  .footer {
    background-color: #2f3b47; /* 深色背景 */
    color: #c0c0c0; /* 主文本颜色 */
    padding: 30px 20px;
    font-family: Arial, sans-serif;
  }
  
  .footer-top {
    margin-bottom: 15px;
    text-align: left; /* 居左对齐 */
  }
  
  .footer-link {
    color: #ffffff;
    text-decoration: none;
    font-size: 0.95rem; /* 小一点的字体 */
    font-weight: bold;
  }
  
  .footer-link:hover {
    text-decoration: underline;
  }
  
  .footer-middle {
    margin-bottom: 15px;
    text-align: left; /* 居左对齐 */
    line-height: 1.6;
  }
  
  .footer-disclaimer {
    color: #a0a0a0; /* 次级文本颜色，稍微比主文本暗 */
    margin: 0;
  }
  
  .footer-email {
    color: #ffffff; /* 突出显示的颜色 */
    text-decoration: underline;
  }
  
  .footer-bottom {
    font-size: 0.85rem; /* 更小的字体 */
    color: #8c8c8c; /* 暗色文本 */
    text-align: left; /* 居左对齐 */
  }
  
  .footer-bottom p {
    margin: 0;
  }
  </style>
  
