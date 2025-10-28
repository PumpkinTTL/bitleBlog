<template>
    <div class="login-container">
        <div class="login-header">
            系统登录
        </div>
        <a-form style="margin-top: 20px;" :model="formState" name="basic" autocomplete="off" @finish="onFinish"
            @finishFailed="onFinishFailed">
            <a-form-item name="account" :rules="[{ required: true, message: '请输入账号' }]">
                <a-input v-model:value="formState.account" placeholder="输入账号">
                    <template #prefix>
                        <user-outlined />
                    </template>
                </a-input>
            </a-form-item>
            <!-- <a-form-item name="account" :rules="[{ required: true, message: '请输入邮箱' }]">
                <a-input v-model:value="formState.account" placeholder="请输入邮箱" suffix="获取验证码">
                    <template #prefix>
                        <user-outlined />
                    </template>
                </a-input> -->
            <!-- </a-form-item> -->
            <a-form-item name="password" :rules="[{ required: true, message: '请输入密码' }]">
                <a-input-password v-model:value="formState.password" placeholder="请输入密码">
                    <template #prefix>
                        <UnlockOutlined />
                    </template>
                </a-input-password>
            </a-form-item>

            <!-- 记住密码和忘记密码 -->
            <a-form-item name="password">
                <a-checkbox value="1" name="type">记住密码</a-checkbox>
                <span style="float: right; color: #1777FF;font-size: 12px;">忘记密码?</span>
            </a-form-item>
            <a-form-item>
                <a-button block type="primary" html-type="submit">立即登录</a-button>
            </a-form-item>
            <!-- 没有账号立即注册 -->
            <div class="nohas-account-wrap">
                没有账号? &nbsp; <span style="font-size: 12px; color: #1777FF;">立即注册</span>
            </div>
            <a-divider>其他方式登录</a-divider>

            <!-- 三个登录方式 -->
            <div class="login-method-list-wrap" style="text-align: center;">
                <img width="32" src="@/assets/images/wechat_icon.png" alt="">
                <img width="32" style="margin: 0 15px;" src="@/assets/images/qq_icon.png" alt="">
                <img width="32" src="@/assets/images/weibo.png" alt="">
            </div>
        </a-form>
    </div>
</template>
<script lang="ts" setup>
import { reactive } from 'vue';
import { message } from 'ant-design-vue';
import { loginR } from '@/request/user';
import { useStore } from '@/store'
import {
    UserOutlined,
    UnlockOutlined ,
    AppstoreAddOutlined
} from '@ant-design/icons-vue';
import { saveUserInfo, setLocalStorage, setToken } from '@/util/Auth';

interface FormState {
  account: string;
  password: string;
    action: string
  remember: boolean;
}
const store = useStore()
const formState = reactive<FormState>({
  account: '',
  password: '',
    action: 'pwd',
    remember: true,
});
const onFinish = async (values: any) => {
    values.action = 'pwd'
    // const loading = message.loading('请稍后..', 0);
    const res = await loginR(values) as any
    // setTimeout(loading, 0)
    if (res.code != 200) return message.warning(res.msg)

    const userInfo = res.data

    // 更新store（后端已返回包含premium等字段的完整用户信息）
    store.$patch((state: any) => {
        state.showLoginModal = false
        state.userInfo = userInfo
        state.isLogin = true
    })

    // 提取角色和权限
    const roles = userInfo.roles?.map((r: any) => r.iden) || []
    const permissions: string[] = []
    userInfo.roles?.forEach((role: any) => {
      role.permissions?.forEach((perm: any) => {
        if (perm.name && !permissions.includes(perm.name)) {
          permissions.push(perm.name)
        }
      })
    })

    // 构建Token数据结构
    const tokenData = {
      token: res.token,
      expires: res.expireTime * 1000, // 后端返回秒级时间戳，转换为毫秒
      id: userInfo.id,
      username: userInfo.username,
      nickname: userInfo.nickname,
      avatar: userInfo.avatar,
      email: userInfo.email,
      roles: roles,
      permissions: permissions,
      // 保存完整的用户信息
      ...userInfo
    }

    // 使用新的单Token管理：同时保存到Authorization cookie和userInfo localStorage
    setToken(tokenData)

    // 保存用户信息到localStorage（兼容旧代码）
    saveUserInfo(userInfo)

    // 兼容旧的localStorage字段
    setLocalStorage('isLogin', 'true')

    // 调试日志：显示premium状态
    console.log('[Login] 登录成功，用户premium状态:', userInfo.premium)
    console.log('[Login] Token过期时间:', new Date(tokenData.expires))

    message.success('登录成功')
};

const onFinishFailed = (errorInfo: any) => {
  console.log('Failed:', errorInfo);
};
</script>
<style lang="less">
.login-container {
    color: #303131 !important;
}
.login-header{
    height: 40px;
    line-height: 40px;
    font-size: 22px;
    text-align: center;
   
}
</style>