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
                <span class="author-name">
                    <UserOutlined /> {{ item.author }}
                </span>
                <span class="time">
                    <FieldTimeOutlined /> {{ item.date }}
                </span>
                <span class="view-count">
                    <EyeOutlined /> {{ item.views }}
                </span>
                <span class="comment-count">
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
        background-color: #fff;
        border-radius: 8px;
        padding: 16px;
        border: 1px solid #f0f0f0;
        cursor: pointer;
        transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.02);
        
        &:not(:first-child){
            margin-top: 12px;
        }
        
        &:hover {
            transform: translateY(-3px) scale(1.01);
            box-shadow: 0 4px 16px rgba(24, 144, 255, 0.12);
            border-color: rgba(24, 144, 255, 0.3);
            
            .title {
                color: #1890ff;
            }
            
            .list-item-cover img {
                transform: scale(1.05);
            }
        }
        // 封面
        .list-item-cover{
            transition: all .3s;
            width: 180px;
            height: 120px;
            flex-shrink: 0;
            border-radius: 6px;
            overflow: hidden;
            
        }
        img{
            transition: all .3s;
            width: 100%;
            height: 100%;
            object-fit: cover;
            
        }
                                // 内容
        .list-item-content{
            flex: 1;
            min-width: 0;
            margin-left: 20px;
            display: flex;
            flex-direction: column;
            gap: 8px;
            
            :deep(.ant-tag) {
                border: none !important;
                font-weight: 500;
                
                &.ant-tag-error {
                    background-color: #f5222d !important;
                    color: #ffffff !important;
                }
            }
            
                        // 标题
            .title{
                font-size: 18px;
                font-weight: 600;
                color: #262626;
                display: block;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
                max-width: 100%;
                transition: color 0.25s ease;
                line-height: 1.4;
                margin-top: 4px;
            }
            // 作者信息等
            .auth-info-time{
                font-size: 12px;
                color: rgb(136, 138, 138);
                display: flex;
                align-items: center;
                flex-wrap: wrap;
                gap: 12px;
                
                .author-name {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-weight: 500;
                    color: #595959;
                    transition: color 0.2s ease;
                    
                    &:hover {
                        color: #1890ff;
                    }
                }
                
                .time {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    color: #8c8c8c;
                    
                    :deep(.anticon) {
                        font-size: 11px;
                        color: #bfbfbf;
                    }
                }
                
                .view-count,
                .comment-count {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 3px 8px;
                    border-radius: 4px;
                    background: rgba(0, 0, 0, 0.02);
                    transition: all 0.2s ease;
                    font-weight: 500;
                    
                    &:hover {
                        background: rgba(24, 144, 255, 0.06);
                        color: #1890ff;
                        transform: translateY(-1px);
                    }
                }
                
                .view-count {
                    :deep(.anticon) {
                        color: #1890ff;
                        font-size: 12px;
                    }
                }
                
                .comment-count {
                    :deep(.anticon) {
                        color: #52c41a;
                        font-size: 12px;
                    }
                }
            }
            // 简介
            .list-item-intro{
                font-size: 14px;
                color: #8c8c8c;
                overflow: hidden;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-line-clamp: 2;
                -webkit-box-orient: vertical;
                line-height: 1.6;
                margin-bottom: 8px;
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