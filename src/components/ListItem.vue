<template>
    <div class="list-item-container flex" v-for="item in datas" :key="item.id">
        <!-- 封面start -->
        <div class="list-item-cover">
            <img class="img-fluid" :src="item.imgUrl" alt="">
        </div>
        <!-- 封面end -->

        <!-- 内容主题start -->
        <div class="list-item-content">
            <!-- 标签 -->
            <a-tag :bordered="false" color="error">置顶</a-tag>
            <!-- 标题 -->
            <span class="title"> {{ item.title }}</span>
            <!-- 时间访客浏览量 -->
            <div class="auth-info-time">
                <UserOutlined /> {{ item.author }}
                <span class="time" style="margin: 0 20px;">
                    <FieldTimeOutlined /> {{ item.date }}
                </span>
                <span class="view-count">
                    <EyeOutlined /> {{ item.views }}
                </span>
                <span style="margin-left: 10px;" class="comment-count">
                    <CommentOutlined /> {{ item.comments }}
                </span>
            </div>
            <!-- 标题 -->
            <div class="list-item-intro">
                {{ item.content }}
            </div>
        </div>
        <!-- 内容主体end -->
    </div>
</template>
<script setup lang="ts">
import { defineProps,onMounted,ref,PropType } from 'vue';
const props = defineProps({
    datas: Array as PropType<any[]>,
    default: []
});

import {
    UserOutlined,
    EyeOutlined,
    FieldTimeOutlined,
    CommentOutlined
} from '@ant-design/icons-vue';



onMounted(()=>{
  
    
})
</script>
<style lang="less" scoped>
    .list-item-container{
            box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                /* 阴影效果 */
        cursor: pointer;
        padding: 10px;
        &:not(:first-child){
            margin-top: 15px;
        }
        border-bottom: 1px solid #eee;
        background-color: #fff;
        padding: 10px;
        // 封面
        .list-item-cover{
            transition: all .3s;
            min-height: 100%;
            
        }
        img{
            transition: all .3s;
            // height: 100%;
            
        }
                                // 内容
        .list-item-content{
            flex: 1;
            margin-left: 20px;
            .auth-info-time{
                margin-top: 10px;
            }
                        // 标题
            .title{
                font-size: 16px;
                color: #353535;
            }
            // 作者信息等
            .auth-info-time{
                font-size: 14px;
                color: rgb(136, 138, 138);
            }
            // 简介
            .list-item-intro{
                font-size: 14px;
                margin-top: 15px;
                color: rgb(136, 138, 138);
            }
                }

    }

    // 适配布局
    /* 基础样式，适用于桌面端 */


/* 平板端样式 */
@media only screen and (max-width: 768px) {
   
 
}

/* 移动端样式 */
@media only screen and (max-width: 480px) {
    .list-item-cover{
        img{
         
            object-fit: cover;
            object-position: bottom;
            width: 50%;
            height: 100%;
        }
    }
   
}

/* 大屏幕样式（桌面端大屏） */
@media only screen and (min-width: 1024px) {
   
}

</style>