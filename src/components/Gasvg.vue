<template>
    <svg :style="iconStyle" :class="iconClass" aria-hidden="true">
        <use :xlink:href="iconName" :fill="color"></use>
    </svg>
</template>

<script setup lang="ts">
import '@/assets/font/iconfont.js'
// 定义属性
import { computed } from "vue";

const props = defineProps({
    // 图标名,必填
    icon: {
        type: String,
        required: true
    },
    // 图标class
    iconClass: {
        type: String,
        default: 'icon' //默认值
    },
    // 图标颜色
    color: {
        type: String,
        default: ''
    },
    // 行内样式动态设置大小 覆盖iconClass中的大小
    iconStyle: {
        type: Object,
        default: () => ({
        }),
        required: false
    }

})
// 图标拼接 #
const iconName = computed(() => {
    return `#${props.icon}`
})
</script>
<style scoped lang="less">
.icon {
    width: 30px;
    height: 30px;
    vertical-align: middle;
    fill: currentColor;
    overflow: hidden;
}
</style>