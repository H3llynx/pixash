import { createApp } from 'vue'
import App from './App.vue'
import { i18n } from './config/i18n'
import router from './router/router'
import './styles/base.css'

createApp(App)
    .use(i18n)
    .use(router)
    .mount('#app')
