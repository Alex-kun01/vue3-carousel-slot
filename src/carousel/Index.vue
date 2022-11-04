<template>
    <div class="carousel">
        <div class="main_box">
            <Carousel :list="list" @changeIndex="changeIndex" :showPaging="true" :showPrevNext="true" >
                <div class="test_wraper" :class="{['item' + slideIndex]: 1}">
                    <img :src="item.url" alt="" v-for="(item, index) in list[slideIndex]" :key="index">
                </div>
            </Carousel>
        </div>
    </div>
</template>

<script lang='ts'>
import { reactive, toRefs } from 'vue';
import Carousel from './Carousel.vue';

export default {
 components: {
    Carousel
 },
 setup() {
    const state: any = reactive({
        slideIndex: 0,
        list: [
            [
                {
                    url: 'https://img0.baidu.com/it/u=2849356888,1057582530&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800'
                },
                {
                    url: 'https://img0.baidu.com/it/u=2849356888,1057582530&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800'
                },
                {
                    url: 'https://img0.baidu.com/it/u=2849356888,1057582530&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800'
                },
                {
                    url: 'https://img0.baidu.com/it/u=2849356888,1057582530&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800'
                }
            ],
            [
                {
                    url: 'https://img1.baidu.com/it/u=2783575353,4077022718&fm=253&fmt=auto&app=120&f=JPEG?w=576&h=341'
                },
                {
                    url: 'https://img1.baidu.com/it/u=2783575353,4077022718&fm=253&fmt=auto&app=120&f=JPEG?w=576&h=341'
                },
                {
                    url: 'https://img1.baidu.com/it/u=2783575353,4077022718&fm=253&fmt=auto&app=120&f=JPEG?w=576&h=341'
                },
                {
                    url: 'https://img1.baidu.com/it/u=2783575353,4077022718&fm=253&fmt=auto&app=120&f=JPEG?w=576&h=341'
                }
            ],
            [
                {
                    url: 'https://img0.baidu.com/it/u=1300300636,776021664&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500'
                },
                {
                    url: 'https://img0.baidu.com/it/u=1300300636,776021664&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500'
                },
                {
                    url: 'https://img0.baidu.com/it/u=1300300636,776021664&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500'
                },
                {
                    url: 'https://img0.baidu.com/it/u=1300300636,776021664&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500'
                }
            ]
        ]
    });

    // 更新索引
    const changeIndex = (index: number) => {
        state.slideIndex = index;
    }

   return {
    ...toRefs(state),
    changeIndex
   }
 },
}
</script>
<style lang="scss" scoped>
.carousel {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .main_box {
        width: 800px;
        height: 400px;
        background-color: orange;

        .test_wraper {
            width: 100%;
            height: 100%;
            color: red;
            font-size: 50px;
            text-align: center;
            line-height: 300px;
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: space-around;
            
            img {
                width: 380px;
                height: 170px;
            }
        }
    }
}
</style>