<template>
    <div class="my-button-container">
        {{ text }}
    </div>
</template>
<script>
import { defineProps } from 'vue';
const props = defineProps({
    text: {
        default: '默认按钮'
    }
})
</script>
<style lang="less">
.my-button-container {
    border: 1px solid #B3D5FF;
    background-color: #F4F9FF;
    cursor: pointer;
    padding: 0 10px;
    color: #007FFF;
    margin-left: 20px;
    height: 32px;
    border-radius: 4px;
    line-height: 32px;
}
</style>