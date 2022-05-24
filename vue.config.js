/* vue.config.js */
module.exports = {
  css: {
    loaderOptions: {
      sass: {
        implementation: require('sass')
      }
    }
  },

  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
}
