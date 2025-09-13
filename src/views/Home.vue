<template>
  <div class="index-container">
    <IndexHeader></IndexHeader>
    <!-- 内容区域 -->
    <div class="content-container">
      <div class="w">
        <a-row :gutter="16">
          <!-- 左边导航的内容 -->
          <a-col :xs="0" :sm="0" :md="4" :lg="4" :xl="4">
            <div class="left-content-container">
              <LeftContentNav class="animate__animated"
                :class="{ animate__zoomIn: animateZoomIn, shadow: animateZoomIn }" :data="leftNavDatas">
              </LeftContentNav>
            </div>
          </a-col>
          <!-- 中间内容start -->
          <a-col :xs="24" :sm="24" :md="24" :lg="14" :xl="14">
            <div class="center-content-container">
              <ListItem :datas="listItemsData" class="animate__animated" :class="{ animate__zoomIn: animateZoomIn }">
              </ListItem>
            </div>
          </a-col>
          <!-- 中间内容end -->
          <!-- 右边内容start -->
          <a-col :xs="0" :sm="0" :md="0" :lg="6" :xl="6">
            <div class="right-content-container">
              <!--          <Gasvg iconClass="icon-60" :style="{width:30,height:30}" icon="icon-fuwuqi"></Gasvg>-->
              <!-- <Gasvg iconClass="icon-60" icon="icon-fuwuqi"></Gasvg>
          右边
          <el-badge :value="12" class="item">
            <el-button>comments</el-button>
          </el-badge> -->
              <!-- 公告内容 -->
              <div class="right-notice-container">
                <a-card title="本站公告" :bordered="false">
                  <p class="notice-item" v-for="item in 4" :key="item">
                    <i style="color: #999;margin-right: 5px;">{{ item }}</i>.
                    <span>无法解析本站的解决方法</span>
                  </p>
                </a-card>
              </div>
              <div style="margin-top: 20px;" class="right-types-container">
                <a-card title="功能分类" :bordered="false">
                  <a-tag class="func-item" color="default">PC软件</a-tag>
                  <a-tag class="func-item" color="default">安卓软件</a-tag>
                  <a-tag class="func-item" color="default">教程大纲</a-tag>
                  <a-tag class="func-item" color="default">TV软件</a-tag>
                  <a-tag class="func-item" color="default">实用工具</a-tag>
                  <a-tag class="func-item" color="default">iOS应用</a-tag>
                  <a-tag class="func-item" color="default">开发文档</a-tag>
                  <a-tag class="func-item" color="default">常见问题</a-tag>
                  <a-tag class="func-item" color="default">优惠活动</a-tag>
                  <a-tag class="func-item" color="default">用户反馈</a-tag>
                  <a-tag class="func-item" color="default">系统维护</a-tag>
                  <a-tag class="func-item" color="default">更新日志</a-tag>
                  <a-tag class="func-item" color="default">权限设置</a-tag>
                  <a-tag class="func-item" color="default">插件管理</a-tag>
                  <a-tag class="func-item" color="default">主题切换</a-tag>
                  <a-tag class="func-item" color="default">数据备份</a-tag>
                  <a-tag class="func-item" color="default">功能预告</a-tag>
                  <a-tag class="func-item" color="default">隐私政策</a-tag>
                  <a-tag class="func-item" color="default">用户协议</a-tag>
                  <a-tag class="func-item" color="default">帮助中心</a-tag>
                </a-card>
              </div>
              <div class="right-hot-artice-container">
                <a-card title="热门文章" :bordered="false" :head-style="{borderBottom:'1px solid #f0f0f0',padding:'16px 20px'}" :body-style="{padding:'16px 20px'}">
                  <div class="article-item" v-for="item in 4" :key="item">
                    <div class="article-image">
                      <img src="https://img.fenxmi.com/zb_users/upload/2024/05/202405061715006422541316.webp" alt="文章封面" />
                    </div>
                    <div class="article-content">
                      <h4 class="article-title">无法解析本站的解决方法</h4>
                      <div class="article-meta">
                        <span class="date">2024-05-08</span>
                        <span class="views">
                          <i class="fas fa-eye"></i> 5678
                        </span>
                      </div>
                    </div>
                  </div>
                </a-card>
              </div>
            </div>
          </a-col>
          <!-- 右边内容end -->
        </a-row>
      </div>
      <!-- 底部 -->
      <Footer></Footer>
    </div>
  </div>
</template>
<script lang="ts" setup>
// 引入组件start
import IndexHeader from '@/components/IndexHeader.vue';
import LeftContentNav from '@/components/LeftContentNav.vue'
import Gasvg from '@/components/Gasvg.vue'
import ListItem from '@/components/ListItem.vue';

// 引入组件end
import { selectTypeAllR } from '@/request/Type'
import {useStore} from '@/store';
import {ref, onMounted} from 'vue'
import Footer from '@/components/Footer.vue';
// 推荐数据列表
const recommendDataList = ref([])
// 左边导航列表数据
const leftNavDatas = ref([])
const activeKey = ref('1')
const store = useStore()
const animateZoomIn = ref(false)
onMounted(() => {
  initDataTypes({})
})
const listItemsData = ref([{
      id: 2233,
      title: '【限时福利】新用户注册送10G流量',
  tag: ['活动', '新用户', '流量', '免费'],
      author: '某运营商',
      date: '2024-05-08',
      views: 567890,
      imgUrl:'https://img.fenxmi.com/zb_users/upload/2024/05/202405061715006422541316.webp',

      comments: 2345,
      content: '现在注册我们的APP，即可免费获得10G流量，活动截止日期为2024年5月31日。'
    },
    {
      id: 1,
      title: '[分享迷独家] 百万流量人不要犹豫流量卡 白给领取',
      tag: ['推荐', '置顶', '正规流量卡', '大流量', '不限速', '低资费'],
      author: '分享迷的小伙伴',
      date: '2024-05-06',
      views: 1123400,
      comments: 41245,
      imgUrl:'https://img.fenxmi.com/zb_users/upload/2023/12/202312081702008746473200.png',
      content: '分享迷近期推出价格特别香的流量卡，多种套餐可选，最低100G/月9元，充值即可。快，不要等，点击链接即可领取。拿到卡了，需要充值并且实名才能使用。'
    },
    
    {
      id: 3,
      title: '【学生专享】校园网流量翻倍',
      tag: ['学生', '校园网', '流量', '优惠'],
      author: '校园网运营商',
      date: '2024-05-05',
      views: 987654,
      imgUrl:'https://img.fenxmi.com/zb_users/upload/2023/04/202304081680947253819210.png',

      comments: 3456,
      content: '学生用户专享，校园网流量翻倍，畅享高速网络。'
    },
    {
      id: 4,
      title: '【夜间福利】夜间流量免费送',
      tag: ['夜间', '流量', '免费'],
      author: '某运营商',
      date: '2024-05-07',
      views: 876543,
        imgUrl: 'https://img.fenxmi.com/zb_users/upload/2021/07/202107221626929510370599.png',
      comments: 2345,
      content: '每天晚上12点到早上6点，夜间流量免费送，畅快刷剧追剧。'
    }
  ])
async function initDataTypes(params:any) {
    const res = await selectTypeAllR(params)
    console.log(res)
  leftNavDatas.value = res.data
  animateZoomIn.value = true
  
  

  
}
</script>
<style lang="less" scoped>
.ant-tabs-nav{
  background-color: #fff !important;
}
.content-container {
  margin-top: 25px;
  .left-content-container {
    // width: 180px;
    // box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* 阴影效果 */
  }

  .center-content-container {
    // flex: 1;
    border-radius: 4px;
    

  }

  .right-content-container {
    // width: 260px;
    // background-color: #fff;
    // margin-left: 25px;
    border-radius: 4px;
    .article-item {
  display: flex;
  padding: 12px 0;
  transition: all 0.2s ease;
  cursor: pointer;
  
  &:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
  }
  
  &:hover {
    background-color: #f9f9f9;
    border-radius: 8px;
    padding: 12px;
  }
  
  .article-image {
    width: 80px;
    height: 80px;
    border-radius: 10px;
    overflow: hidden;
    margin-right: 16px;
    flex-shrink: 0;
    transition: all 0.3s ease;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .article-content {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    
    .article-title {
      font-size: 0.9rem;
      font-weight: 500;
      color: #333;
      margin: 0;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    
    .article-meta {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .date, .views {
        font-size: 0.75rem;
        color: #999;
        display: flex;
        align-items: center;
        
        i {
          margin-right: 4px;
          font-size: 0.7rem;
        }
      }
    }
  }
}
    .func-item{
      margin-top: 10px;
    }
    .right-hot-artice-container{
      margin-top: 20px;
    }
  }
}

.icon-60 {
  width: 60px;
  height: 60px;
  vertical-align: middle;
}


</style>