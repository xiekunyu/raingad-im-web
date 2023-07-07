import UserCardDetail from './userCard'

export default {
  install(Vue) {
    function user(user_id, options) {
      let _vm = this
      const el = new Vue({
        router: _vm.$router,
        store: _vm.$store,
        render(h) {
          return h(UserCardDetail, {
            on: {
              close: () => {
                el.$destroy()
                document.body.removeChild(el.$el)
              },
              editUser: data => {
                options.editDataCallbak && options.editDataCallbak(data);
                el.$destroy()
                document.body.removeChild(el.$el)
              }
            },
            props: {
              user_id,
              options
            },
          })
        },
      }).$mount()

      document.body.appendChild(el.$el)
    }

    Vue.prototype.$user = user
  },
}