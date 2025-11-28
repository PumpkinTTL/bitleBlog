import { createRouter, createWebHistory, RouterOptions, Router, RouteRecordRaw } from 'vue-router'
import { KeepAlive, ref } from 'vue';
// const loadingTitle = ref('加载中...')
const routes: RouteRecordRaw[] = [
  {
    path: '/dual-token-test',
    name: 'DualTokenTest',
    component: () => import('@/components/DualTokenTest.vue'),
    meta: {
      title: '双Token登录测试',
      header: false,
      footer: false
    }
  },
  {
    path: '/api-test',
    name: 'ApiTest',
    component: () => import('@/components/ApiTest.vue'),
    meta: {
      title: 'API连接测试',
      header: false,
      footer: false
    }
  },
  {
    path: '/resource/upload',
    name: 'ResourceUpload',
    component: () => import('@/views/ResourceUpload.vue'),
    meta: {
      title: '资源上传',
      requiresAuth: true
    }
  },
  {
    path: '/redirect',
    name: 'LinkRedirect',
    component: () => import('@/views/LinkRedirectPage.vue'),
    meta: {
      title: '安全提示',
      header: false,
      footer: false
    }
  },
    { path: '/', redirect: '/index' ,
        meta: { 
            header:false,
            footer:true,
            e_class:"animate__animated animate__lightSpeedInLeft animate__faster",
            l_class:"animate__animated animate__fadeOutRight animate__faster"
        },
    },
    { path: '/login', name: 'login', component: () => import('@/views/Login.vue'),
        meta: { 
            header:false,
            footer:false,
           
        },
    },
    { path: '/resetPassword', name: 'resetPassword', component: () => import('@/views/ResetPassword.vue'),
        meta: { 
            header: false,
            footer: false,
            title: '重置密码'
        },
    },
    { path: '/premium', name: 'premium', component: () => import('@/views/Premium.vue'),
        meta: { 
            header:false,
            footer:true,
           
        },
    },
    { path: '/recomgoods', name: 'recomgoods', component: () => import('@/views/RecomGoods.vue'),
        meta: { 
            header:false,
            footer:true,
          
        },
    },
    { path: '/person', name: 'person', component: () => import('@/views/PersonCenterPage.vue'),
        meta: { 
            header:false,
            footer:true,
          
        },
    },
    { path: '/user', name: 'user', component: () => import('@/views/UserCenter.vue'),
        meta: { 
            header:false,
            footer:true,
          
        },
    },
    {
        path: '/user/:id', name: 'userProfile',
        component: () => import('@/views/UserProfile.vue'),
        meta: { 
            header: false,
            footer:true,
            title: '用户资料',
        },
    },
    {
        path: '/resources', name: 'resources',
        component: () => import('@/views/ResourcePage.vue'),
        meta: { 
            header:false,
            footer:true,
        },
    },
    
    {
        path: '/index', name: 'index',
        component: () => import('@/views/IndexV2.vue'),
        meta: { 
            header:false,
            footer: true,
           
        },
    },
    {
        path: '/write', name: 'write',
        component: () => import('@/views/WriterCenter.vue'),
        meta: { 
            header:false,
            footer:true,
            KeepAlive:false
           
        },
    },
    {
        path: '/home', name: 'home',
        component: () => import('@/views/Home.vue'),
        meta: { 
            header: false,
            footer:true,
          
        },
    },
    {
        path: '/data-statistics', name: 'dataStatistics',
        component: () => import('@/views/DataStatisticsPage.vue'),
        meta: { 
            header: false,
            footer: true,
        },
    },
    {
        path: '/tags/:slug?', name: 'tags',
        component: () => import('@/views/TagsPage.vue'),
        meta: { 
            header: false,
            footer: true,
        },
    },
    {
        path: '/about', name: 'about',
        component: () => import('@/views/AboutPage.vue'),
        meta: { 
            header: false,
            footer: true,
        },
    },
    {
        path: '/404', name: '404',
        component: () => import('@/views/404.vue'),
        meta: { 
            header:false,
            footer:true,

        },
    },
    {
        path: '/blogDetail/:id',
        name: 'BlogDetail',
        component: () => import('@/views/BlogDetail.vue'),
        meta: {
            title: '博客详情',
            header: false,
            footer: true,
            keepAlive: false,
            requireAuth: false
        }
    },
    {
        path: '/shop',
        name: 'shop',
        component: () => import('@/views/Shop.vue'),
        meta: {
            title: '商城',
            header: false,
            footer: true,
            requiresAuth: false
        }
    },
    {
        path: '/email-test',
        name: 'emailTest',
        component: () => import('@/views/EmailTest/EmailTest.vue'),
        meta: {
            title: '邮箱测试',
            header: false,
            footer: true
        }
    },
    {
        path: '/donation',
        name: 'donation',
        component: () => import('@/views/Donation.vue'),
        meta: {
            title: '捐赠支持',
            header: false,
            footer: true,
            requiresAuth: false
        }
    }
];

const options: RouterOptions = {
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
};

const router: Router = createRouter(options)

router.beforeEach((to, from, next) => {
    // 简化路由守卫，移除所有loading和阻塞
    if (!to.name) {
        return next('/404')
    }
    next()
})

// router.afterEach 可以用来更新标题
router.afterEach((to, from) => {
    // 更新页面标题
    if (to.meta?.title) {
        document.title = `${to.meta.title} - BitlEBlog`
    } else {
        document.title = 'BitlEBlog'
    }
})
export default router
