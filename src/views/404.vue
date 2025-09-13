<template>
    <a-row type="flex" justify="center" align="middle" style="min-height: 100vh;">
        <a-result status="404" title="404" sub-title="对不起，您访问的页面不存在">
            <template #extra>
                <a-button type="primary" @click="goHome">回到首页</a-button>
            </template>
        </a-result>
    </a-row>
</template>
<script lang="ts" setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() {
    router.replace('/')
}
</script>

<style>
/* 可以根据需要添加额外的样式 */
</style>