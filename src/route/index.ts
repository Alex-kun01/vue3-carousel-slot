import { createRouter, createWebHashHistory } from 'vue-router';
import Carousel from '../carousel/Index.vue';

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: "carousel",
            component: Carousel,
        },
    ],
})

export default router;
