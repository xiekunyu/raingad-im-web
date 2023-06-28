import Manage from '@/views/Manage'
export default [
    {
        path: '/manage',
        name: 'manage',
        component: Manage,
        meta: { title: '管理' },
        icon: 'el-icon-s-tools',
        children: [
            {
                path: '/manage/index',
                name: 'index',
                component: () =>import ('@/views/manage/index.vue'),
                meta: { 
                    title: '概况',
                    icon: 'el-icon-data-line'
                }
            },
            {
                path: '/manage/setting',
                name: 'index',
                component: () =>import ('@/views/manage/setting.vue'),
                meta: { 
                    title: '设置',
                    icon: 'el-icon-setting'
                }
            },
            {
                path: '/manage/user',
                name: 'user',
                component: () =>import ('@/views/manage/user.vue'),
                meta: { 
                    title: '成员',
                    icon: 'el-icon-user'
                }
            },
            {
                path: '/manage/group',
                name: 'group',
                component: () =>import ('@/views/manage/group.vue'),
                meta: { 
                    title: '群聊',
                    icon: 'el-icon-chat-dot-square'
                }
            },
            {
                path: '/manage/files',
                name: 'files',
                component: () =>import ('@/views/manage/files.vue'),
                meta: { 
                    title: '文件',
                    icon: 'el-icon-folder-opened'
                }
            },
        ]
    }
];