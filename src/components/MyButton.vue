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
    border: 1px solid #86efac;
    background-color: #ecfdf5;
    cursor: pointer;
    padding: 0 10px;
    color: #059669;
    margin-left: 20px;
    height: 32px;
    border-radius: 6px;
    line-height: 32px;
    transition: all 0.2s ease;
    
    &:hover {
        border-color: #059669;
        background-color: #d1fae5;
        color: #047857;
    }
}
</style>