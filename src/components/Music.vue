<template>
    <div class="music-container">
        <div class="music-icon-container">
            <img src="@/assets/images/music.png" alt="">

        </div>
    </div>
</template>
<script lang="ts" setup>
</script>
<style lang="less" scoped>
.music-container {
    position: fixed;
    top: 10px;
    right: 20px;
    cursor: pointer;

    .music-icon-container {
        position: relative;
        width: 40px;
        height: 40px;
        border-radius: 50%;

        img {
            width: 100%;
            height: 100%;
            animation: rotate360 5s linear infinite;
        }

    }
}

@keyframes rotate360 {
    from {
        transform: rotate(0deg);
    }

    to {
        transform: rotate(360deg);
    }
}
</style>