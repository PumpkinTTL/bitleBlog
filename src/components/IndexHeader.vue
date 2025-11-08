<template>
    <!-- 个人中心抽屉 -->
    <a-drawer v-model:open="showPersonCenter" title="个人中心"  placement="right">
        <PersonCnter></PersonCnter>
    </a-drawer>
    <!-- 头部抽屉 -->
    <a-drawer title="导航菜单" @close="showTopDrawer = false" placement="top" :open="showTopDrawer">
        <template #extra>
        </template>
        导航菜单
    </a-drawer>
    <!-- 头部导航 -->
    <div class="index-header-container flex">
        <!-- 版心 -->
        <div class="w">
            <a-row style="align-items: center;" :gutter="16">
                <!-- 移动端导航按钮按钮start-->
                <a-col :xs="4" :sm="4" :md="2" :lg="0" :xl="0">
                    <div class="mobile-nav-icon-wrap" @click="showTopDrawer = true" v-show="showMobileNavIcon">
                        <UnorderedListOutlined style="font-size: 28px;" />
                    </div>
                </a-col>
                <!-- 移动端导航按钮按钮end-->
                <!-- logo部分start -->
                <a-col :span="2" :xs="0" :sm="0" :md="0" :lg="2" :xl="3">
                    <div class="logo-wrap">
                        <h1>
                            <a title="南瓜头的博客" href="#"></a>
                        </h1>
                    </div>
                </a-col>
                <!-- logo部分end -->
                <!-- 导航文字部分start -->
                <a-col :span="7" :xs="0" :sm="0" :md="0" :lg="7" :xl="7">
                    <div class="index-header-text-nav-wrap flex">
                        <div @click="handHeaderTextNavItems(item)" class="index-header-text-nav-item"
                            v-for="(item, index) in textNavData" :key="index">
                            {{ item }}
                        </div>
                    </div>
                </a-col>
                <!-- 导航文字部分end -->
                <!-- 搜索框部分start -->
                <a-col :xs="12" :sm="12" :md="18" :lg="12" :xl="8">
                    <div class="index-header-search-wrap">
                        <a-auto-complete style="width: 100%;" :size="size" v-model:value="searchValue"
                            class="certain-category-search" popup-class-name="certain-category-search-dropdown"
                            :dropdown-match-select-width="500" :options="searchOption">
                            <template #option="item">
                                <template v-if="item.options">
                                    <span>
                                        {{ item.value }}
                                        <a style="float: right" href="https://www.google.com/search?q=antd"
                                            target="_blank" rel="noopener noreferrer">
                                            more
                                        </a>
                                    </span>
                                </template>
                                <template v-else-if="item.value === 'all'">
                                    <a href="https://www.google.com/search?q=ant-design-vue" target="_blank"
                                        rel="noopener noreferrer">
                                        View all results
                                    </a>
                                </template>
                                <template v-else>
                                    <div style="display: flex; justify-content: space-between">
                                        {{ item.value }}
                                        <span>
                                            <UserOutlined />
                                            {{ item.count }}
                                        </span>
                                    </div>
                                </template>
                            </template>
                            <a-input-search placeholder="输入搜索内容" :size="size"></a-input-search>
                        </a-auto-complete>
                    </div>
                </a-col>
                <!-- 搜索框部分end -->
                <!-- 创作中心按钮 start -->
                <a-col :xs="0" :sm="0" :md="0" :lg="3" :xl="3">
                    <div v-show="!showMobileNavIcon" class="wirte-center-wrap">
                        <a-button @click="handWriterCenter" type="primary">
                            <template #icon>
                                <FormOutlined />
                            </template>
                            创作中心
                        </a-button>
                    </div>
                </a-col>
                <!-- 创作中心按钮 end -->
                <!-- 导航文字部分start -->
                <!-- <div class="index-header-text-nav-wrap flex">
                    <div class="index-header-text-nav-item" v-for="(item, index) in rightTextNavData" :key="index">
                        {{ item }}
                    </div>
                </div> -->
                <!-- 导航文字部分end -->
                <!-- 登陆中心start -->
                <a-col :xs="8" :sm="8" :md="4" :lg="2" :xl="3">
                    <div v-if="store.userInfo == undefined" class="login-btns-wrap">
                        <span @click="login"> 登陆 | 注册</span>
                    </div>
                    <!-- 登陆中心end -->
                    <!-- 用户中心信息start -->
                    <div v-else class="userinfo-wrap">
                        <a-avatar :src="store.userInfo.avatar" style="margin-right: 10px;"
                            :size="{ xs: 24, sm: 32, md: 32, lg: 32, xl: 32, xxl: 32 }">
                            <template #icon>
                                <AntDesignOutlined />
                            </template>
                        </a-avatar>
                        <a-dropdown>
                            <a class="ant-dropdown-link" @click.prevent>
                                <span class="userinfo-nickname">{{store.userInfo.username}}</span>
                                <DownOutlined />
                            </a>
                            <template #overlay>
                                <a-menu>
                                    <a-menu-item>
                                        <a @click.prevent="personCenter" href="javascript:;">个人中心</a>
                                    </a-menu-item>
                                    <a-menu-item>
                                        <a @click.prevent="outLogin" href="javascript:;">退出登录</a>
                                    </a-menu-item>
                                </a-menu>
                            </template>
                        </a-dropdown>
                    </div>
                </a-col>
                <!-- 用户中心end -->
            </a-row>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { AntDesignOutlined, DownOutlined, UserOutlined, UnorderedListOutlined, FormOutlined } from '@ant-design/icons-vue';
import { ref, reactive, onMounted, watchEffect } from 'vue'
import { useRouter } from 'vue-router'
import { loginR, selectUserInfoByIdR } from '@/request/user'
import { useStore } from '@/store';
import { objectToQueryString, randomString, encryptECB, sha256 } from '@/util/SecretUtil';
import PersonCnter from './PersonCenter.vue';


const textNavData = ref(['Android软件', '电脑软件', 'TV电视软件', '流量卡'])
const rightTextNavData = ref(['关于本站', '贡献者', '支持一下'])
const router = useRouter()
const store = useStore()
const size = ref('middle')
const searchValue = ref('')
// 搜索框宽度
// 是否显示移动端导航按钮
const showMobileNavIcon = ref(true)
const showPersonCenter = ref(false)
const showTopDrawer = ref(false)
// 当前窗口的尺寸
const currentWidth = ref(0)
const currentHeight = ref(0)
const isLogin = ref(false)
const searchOption = ref([
    {
        value: 'Libraries',
        options: [
            {
                value: 'AntDesignVue',
                count: 10000,
            },
            {
                value: 'AntDesignVue UI',
                count: 10600,
            },
        ],
    },
    {
        value: 'Solutions',
        options: [
            {
                value: 'AntDesignVue UI FAQ',
                count: 60100,
            },
            {
                value: 'AntDesignVue FAQ',
                count: 30010,
            },
        ],
    },
    {
        value: 'Articles',
        options: [
            {
                value: 'AntDesignVue design language',
                count: 100000,
            },
        ],
    },
    {
        value: 'all',
    },
])

// 计算窗口样式

watchEffect(() => {

})
// 页面挂载
onMounted(() => {
    // 监听窗口变化
    listenerWindowSize()
  
})

// 监听窗口变化
function listenerWindowSize() {
    // 初始化窗口数据
    initWindow()
    //     超小屏幕(手机，小于768px):设置宽度为100%
    // 小屏幕(平板，大于等于768px):设置宽度为750px
    // 中等屏幕(桌面显示器，大于等于992px):宽度设置为970px
    // 大屏幕(大桌面显示器，大于等于1200px):宽度设置为1170px
    window.addEventListener('resize', (_e: any) => {
        currentWidth.value = window.innerWidth
        currentHeight.value = window.innerHeight
        console.log('窗口已调整大小，新的宽度是:', currentWidth.value, '新的高度是:', currentHeight.value);
        modWindowConfig()
    })

}

// 初始化设备尺寸 
function initWindow() {
    currentWidth.value = window.innerWidth;
    currentHeight.value = window.innerHeight;
    modWindowConfig()
}

function modWindowConfig() {
    if (currentWidth.value < 768) {
        showMobileNavIcon.value = true
    }
    if (currentWidth.value > 992) {
        showMobileNavIcon.value = false
    }
}

// 监听头部文字导航菜单项
function handHeaderTextNavItems(item: any) {
    switch (item) {
        case '前端':
            alert(`点击了${item}`)
            break
    }
}

function handWriterCenter() {
    router.push('/write')
}
// 监听登录
async function login() {
   
    store.$patch((state:any) => {
        state.showLoginModal = true
    })
    // const data = await loginR({});
}
async function outLogin() {
    // 使用新的清除方法
    const { removeToken } = await import('@/util/Auth');
    removeToken();
    
    // 清除旧的localStorage字段（兼容）
    localStorage.removeItem('isLogin')
    localStorage.removeItem('loginCredentials')
    
    // 清除store中的用户状态
    store.$patch((state: any) => {
        state.isLogin = false
        state.userInfo = null
    })
    
    // 重新加载页面
    window.location.reload()
}

// 打开个人中心
async function personCenter() {

    // 生成参数
    const params: any = {
        targetUid: store.userInfo.id,
        currentId: store.userInfo.id,
        timestamp: Math.round(Date.now() / 1000),
        nonce: randomString(5),
       
    }
    // 参数排序
    const sortParams = objectToQueryString(params)
    // 生成摘要
    const _sha256 = sha256(sortParams)
    console.log(sortParams);
    console.log(_sha256);
    // 生成签名
    const sign = encryptECB(_sha256)
    console.log('sign:', sign);
    params.sign = sign
    // params.appid = 202410051
    const res = await selectUserInfoByIdR(params)
    console.log(res);
    showPersonCenter.value = true
}
</script>
<style lang="less" scoped>
.index-header-container {
    font-size: 14px;
    align-items: center;
    height: 80px;
    background-color: #fff;
    padding: 0 10px;

    .w {
        align-items: center;
    }

    // logo部分start
    .logo-wrap {
        background-size: cover;
        h1 {
            margin: 0;
            padding: 0;

            a {
                display: block;
                background: url('https://lf3-cdn-tos.bytescm.com/obj/static/xitu_juejin_web/e08da34488b114bd4c665ba2fa520a31.svg') no-repeat center;
                font-size: 0;
                width: 110px;
                height: 60px;
                background-size: contain;
            }
        }
    }

    // logo部end
    // 文字导航start
    .index-header-text-nav-wrap {
        color: #515767;
        .index-header-text-nav-item {
            cursor: pointer;
            padding: 0 10px;
        }
    }

    // 文字导航end
    // 搜索框start
    .index-header-search-wrap {
       
    }

    .wirte-center-wrap {
        margin-left: 20px
    }

    // 登陆注册区域
    .login-btns-wrap {
        border: 1px solid #B3D5FF;
        background-color: #F4F9FF;
        cursor: pointer;
        padding: 0 10px;
        text-align: center;
        color: #007FFF;
        margin-left: 20px;
        height: 32px;
        border-radius: 4px;
        line-height: 32px;

    }

    // 已登录用户 信息
    .userinfo-wrap{
        cursor: pointer;
        margin-left: 15px;
        span{
            color: #FFAE60;
        }
    }
}


/* 响应式样式start */
/* 手机样式，例如屏幕宽度小于 600px */
@media screen and (max-width: 767px) {
    .index-header-container {
        width: 100%;
    }

    // 搜索框
    .index-header-search-wrap {
        flex: 1;
        margin: auto;
    }

    .index-header-text-nav-wrap {
        display: none
    }

    // 移动端导航按钮 
    .mobile-nav-icon-wrap {
        margin: auto;
        width: 60px;
    }
}

/* 平板样式，例如屏幕宽度在 600px 到 959px 之间 */
@media screen and (min-width: 768px) and (max-width: 959px) {
    .index-header-container {
        width: 100%;
    }

    // 搜索框
    .index-header-search-wrap {
        // flex: 1;
        
        margin: auto;
    }

    .index-header-text-nav-wrap {
        display: none
    }

    // 移动端导航按钮 
    .mobile-nav-icon-wrap {
        text-align: right;
        margin: auto;
        width: 60px;
    }

}

/* 电脑样式，例如屏幕宽度大于或等于 960px */
@media screen and (min-width: 960px) {}

/* 响应式样式end*/
</style>