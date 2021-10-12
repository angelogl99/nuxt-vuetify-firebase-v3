const pkg = require('./package')

module.exports = {
  mode: 'spa',
  target: 'static',
  ssr: false,

  
  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: '//fonts.googleapis.com/css?family=Roboto:400,500,700,400italic|Material+Icons'}
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  
  /*
  ** Global CSS
  */
  css: [
    { src: 'vue-material/dist/vue-material.min.css', lang:'css' },
    { src: '~/assets/theme.scss', lang:'scss' }
  ],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    { src: '~/plugins/vue-material'}
  ],

 /*
 ** Nuxt.js buildModules
 */
  buildModules: [
    '@nuxtjs/vuetify',
    // Doc: https://firebase.nuxtjs.org/guide/getting-started
    '@nuxtjs/firebase'
  ],
  firebase: {
    config: {
      apiKey: "AIzaSyDN3vJ-u0eGP6-5FIGJ8Aq_qPHCPNU-xrA",
      authDomain: "nuxtjs-blog-3.firebaseapp.com",
      projectId: "nuxtjs-blog-3",
      storageBucket: "nuxtjs-blog-3.appspot.com",
      messagingSenderId: "674972714200",
      appId: "1:674972714200:web:dd96e7ca30e6a35a6983ad"
    },
    services: {
      firestore: true // Just as example. Can be any other service.
    }
  },
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      
    }
  },
  generate: {
    fallback: true
  }
}
