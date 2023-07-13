import router from './router'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css' // Progress 进度条样式
import {
    Message
} from 'element-ui'
import {
    getAuth
} from '@/utils/auth' // 验权
import lockr from 'lockr'
const whiteList = ['/login','/register'] // 不重定向白名单
router.beforeEach((to, from, next) => {
    if (to.meta.disabled) {
        next(false)
        return
    }
    NProgress.start()
        /** 请求头包含授权信息 并且 页面必须授权 直接进入 */
    if (getAuth()) {
        let demon=lockr.get('globalConfig').demon_mode;
        let toPath='';
        if(demon){//如果不是演示模式，就需要直接跳转到聊天页面
            toPath='/demo';
        }
        if (whiteList.includes(to.path) || (to.path=='/' && toPath)) {
            next({
                path: toPath
            })
            NProgress.done()

        }else if(to.path.indexOf('manage') !== -1){
            let userInfo=lockr.get('UserInfo');
            // 如果是管理员或者演示模式，就可以进入管理页面
            if((userInfo && userInfo.role>0) || demon){
                next()
            }else{
                Message.error('您没有权限访问该页面');
                next(false)
                NProgress.done()
            }
        }else {
            next()
        }
    } else {
        if (whiteList.indexOf(to.path) !== -1) {
            next()
        } else {
            next(`/login`) // 否则全部重定向到登录页
            NProgress.done()
        }
    }
})

router.afterEach(() => {
    NProgress.done() // 结束Progress
})

router.onError((error) => {
    const pattern = /Loading chunk (\d)+ failed/g
    const isChunkLoadFailed = error.message.match(pattern)
    const targetPath = router.history.pending.fullPath
    if (isChunkLoadFailed) {
        router.replace(targetPath)
    }
})