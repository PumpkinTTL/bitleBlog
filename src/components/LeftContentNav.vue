<template>
    <div class="left-content-wrap">
        <a-badge-ribbon text="hot">
            <div class="left-nav-item flex top-item">
                <CrownOutlined style="font-size: 16px; font-weight: 100;" />
                <span>综合服务</span>
            </div>
        </a-badge-ribbon>
        <!-- 循环 -->
        <div class="left-nav-item flex" v-for="(item, index ) in data" :key="index">
            <component :is="iconComponents(item.icon_name)"></component>
            <span>{{ item.label }}</span>   
        </div>
    </div>
</template>
<script lang="ts" setup>
import {
    CrownOutlined
} from '@ant-design/icons-vue';
import * as antIcons from '@ant-design/icons-vue';

import { PropType, defineProps, computed } from 'vue'
const props = defineProps({
    data: {
        type: Array as PropType<any>,
        default: []
    }
})

const iconComponents = computed(() => {
    const icons: { [key: string]: any } = antIcons;
    return (iconName: string) => icons[iconName];
});
</script>
<style lang="less" scoped>
.left-content-wrap {
    padding: 8px;
    border-radius: 4px;
    background-color: #fff;

    .top-item {
        border-bottom: 1px solid #eee;
    }

    .left-nav-item {
        align-items: center;
        padding: 17px;
        color: #515767;
        cursor: pointer;

        &:hover {
            background-color: #F7F8FA;
            color: #007FFF;
        }

        span:nth-child(2) {
            margin-left: 10px;
        }
    }
}
</style>