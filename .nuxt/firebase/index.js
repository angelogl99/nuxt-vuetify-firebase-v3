import createApp from './app.js'

import firestoreService from './service.firestore.js'

const appConfig = {"apiKey":"AIzaSyDN3vJ-u0eGP6-5FIGJ8Aq_qPHCPNU-xrA","authDomain":"nuxtjs-blog-3.firebaseapp.com","projectId":"nuxtjs-blog-3","storageBucket":"nuxtjs-blog-3.appspot.com","messagingSenderId":"674972714200","appId":"1:674972714200:web:dd96e7ca30e6a35a6983ad"}

export default async (ctx, inject) => {
  const { firebase, session } = await createApp(appConfig, ctx)

  let servicePromises = []

  if (process.server) {
    servicePromises = [
      firestoreService(session, firebase, ctx, inject),

    ]
  }

  if (process.client) {
    servicePromises = [
      firestoreService(session, firebase, ctx, inject),

    ]
  }

  const [
    firestore
  ] = await Promise.all(servicePromises)

  const fire = {
    firestore: firestore
  }

    inject('fireModule', firebase)
    ctx.$fireModule = firebase

  inject('fire', fire)
  ctx.$fire = fire
}

function forceInject (ctx, inject, key, value) {
  inject(key, value)
  const injectKey = '$' + key
  ctx[injectKey] = value
  if (typeof window !== "undefined" && window.$nuxt) {
  // If clause makes sure it's only run when ready() is called in a component, not in a plugin.
    window.$nuxt.$options[injectKey] = value
  }
}