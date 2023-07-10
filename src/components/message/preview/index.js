import Preview from './index.vue'

export default {
  install(Vue) {
    function preview(url, options) {
      let _vm = this
      const el = new Vue({
        router: _vm.$router,
        store: _vm.$store,
        render(h) {
          return h(Preview, {
            on: {
              close: () => {
                el.$destroy()
                document.body.removeChild(el.$el)
              }
            },
            props: {
              url,
              options
            },
          })
        },
      }).$mount()

      document.body.appendChild(el.$el)
    }

    Vue.prototype.$preview = preview
  },
}