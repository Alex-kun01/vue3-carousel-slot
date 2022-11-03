/*
 * @Author: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @Date: 2022-11-03 10:58:16
 * @LastEditors: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @LastEditTime: 2022-11-03 11:01:27
 * @FilePath: \vue-carousel-slot\src\main.ts
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { createApp } from 'vue';
import App from './App.vue';
import './assets/globle.css';
import router from './route';


declare global {
    interface Window {
        uino: any
    }
}

window.uino = {
    app: '',
    map: '',
    earthEvent: '',
}

const app = createApp(App);
app.use(router);
app.mount('#app');
