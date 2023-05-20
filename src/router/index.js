import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/views/Home'
import Chat from '@/views/Chat'
import Login from '@/views/Login'

Vue.use(Router)

export const constantRouterMap = [{
        path: '/',
        name: 'home',
        component: Home,
        meta: { title: '首页' }
    },
    {
        path: '/chat',
        name: 'chat',
        component: Chat,
        meta: { title: '聊天' }
    },
    {
        path: '/login',
        name: 'login',
        component: Login,
        meta: { title: '登录' }
    },
    {
        path: '*',
        redirect: '/404',
        hidden: true
    },
    // userRouter,
    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    }
];

const createRouter = () => new Router({
    mode: 'hash', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRouterMap
})

const router = createRouter()
export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

export default router