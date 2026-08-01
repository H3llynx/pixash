import { createApp } from 'vue';
import App from './App.vue';
import { i18n } from './features/language/config/i18n.ts';
import router from './router/router';
import './styles/base.css';

createApp(App)
    .use(i18n)
    .use(router)
    .mount('#app')
