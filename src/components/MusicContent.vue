<template>
    <div class="music-content-container">
        <div class="music-header">
            <a-auto-complete v-model:value="value" :dropdown-match-select-width="252" style="width: 100%;"
                :options="dataSource" @select="onSelect" @search="handleSearch">
                <template #option="item">
                    <div style="display: flex; justify-content: space-between">
                        <span>{{ item.count }} results</span>
                    </div>
                </template>
                <a-input-search size="mini" placeholder="搜索音乐"></a-input-search>
            </a-auto-complete>
        </div>
        <div class="music-list">
            <a-list item-layout="horizontal" :data-source="data">
                <template #renderItem="{ item }">
                    <a-list-item>
                        <a-list-item-meta description="黑夜问白天">
                            <template #title>
                                <a href="https://www.antdv.com/">{{ item.title }}</a>
                            </template>
                            <template #avatar>
                                <a-avatar
                                    src="https://d-ssl.dtstatic.com/uploads/item/202003/21/20200321190416_dwhit.thumb.400_0.jpg_webp" />
                            </template>
                        </a-list-item-meta>
                    </a-list-item>
                </template>
            </a-list>
        </div>
        <div class="musice-contor flex">
            <div class="music-controller-song-cover">
                <img width="40" height="40"
                    src="https://d-ssl.dtstatic.com/uploads/item/202003/21/20200321190416_dwhit.thumb.400_0.jpg_webp"
                    alt="">

            </div>
            <div class="progress-song-name">
                黑夜问白天
                <span style="float:right;">00:12/03:55</span>
                <a-progress :percent="30" size="small" />

            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
interface Option {
    query: string;
    category: string;
    value: string;
    count: number;
}
const value = ref('');
const dataSource = ref<Option[]>([]);
const onSelect = (value: string) => {
    console.log('onSelect', value);
};

const getRandomInt = (max: number, min = 0) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const searchResult = (query: string): Option[] => {
    return new Array(getRandomInt(5))
        .join('.')
        .split('.')
        .map((_item, idx) => ({
            query,
            category: `${query}${idx}`,
            value: `${query}${idx}`,
            count: getRandomInt(200, 100),
        }));
};
const handleSearch = (val: string) => {
    dataSource.value = val ? searchResult(val) : [];
};
interface DataItem {
    title: string;
}
const data: DataItem[] = [
    {
        title: '林俊杰',
    },
    {
        title: '林俊杰',
    },
    {
        title: '林俊杰',
    },
    {
        title: '林俊杰',
    },
];
</script>

<style scoped lang="less">
.music-content-container {
    padding: 10px;
}

.music-header {
    margin-top: 20px;
}

.music-list {
    margin-top: 20px;
}

.musice-contor {
    height: 65px;
    align-items: center;
    background-color: #FCFBFA;
    border-top: 1px solid #eee;
    padding-top: 5px;
    margin-top: 20px;
}

.progress-song-name {
    margin-left: 10px
}
</style>