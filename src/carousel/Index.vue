<!--
 * @Author: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @Date: 2022-11-02 09:45:29
 * @LastEditors: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @LastEditTime: 2022-11-09 18:20:53
 * @FilePath: \vitevue3app\src\components\Carousel\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
    <div class="carousel">
        <div class="main_box">
            <Carousel :list="list" :showPaging="true" :showPrevNext="true" >
                <template #default="props">
                    <div class="test_wraper">
                        <!-- 使用插槽参数'props'获取到index（当前索引） -->
                        <img :src="item.url" v-for="(item, index) in list[props.index]" :key="index">
                    </div>
                </template>
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
                    url: 'https://img2.baidu.com/it/u=3278253107,2341737719&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=333'
                },
                {
                    url: 'https://img0.baidu.com/it/u=2849356888,1057582530&fm=253&fmt=auto&app=120&f=JPEG?w=1280&h=800'
                },
                {
                    url: 'https://img2.baidu.com/it/u=3230847158,1659444054&fm=253&fmt=auto&app=138&f=JPEG?w=680&h=450'
                },
                {
                    url: 'https://img1.baidu.com/it/u=531975091,463469143&fm=253&fmt=auto&app=138&f=JPEG?w=650&h=420'
                }
            ],
            [
                {
                    url: 'https://img2.baidu.com/it/u=118491817,2038436641&fm=253&fmt=auto&app=120&f=JPEG?w=640&h=427'
                },
                {
                    url: 'https://img1.baidu.com/it/u=3333857250,3781813360&fm=253&fmt=auto&app=138&f=JPEG?w=400&h=284'
                },
                {
                    url: 'https://img1.baidu.com/it/u=2783575353,4077022718&fm=253&fmt=auto&app=120&f=JPEG?w=576&h=341'
                },
                {
                    url: 'https://img1.baidu.com/it/u=2488215275,963880749&fm=253&fmt=auto&app=120&f=JPEG?w=640&h=354'
                }
            ],
            [
                {
                    url: 'https://img2.baidu.com/it/u=499369819,2221530367&fm=253&fmt=auto&app=138&f=JPEG?w=499&h=333'
                },
                {
                    url: 'https://img0.baidu.com/it/u=1300300636,776021664&fm=253&fmt=auto&app=138&f=JPEG?w=750&h=500'
                },
                {
                    url: 'https://img0.baidu.com/it/u=3370479395,2363195704&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=260'
                },
                {
                    url: 'https://img2.baidu.com/it/u=1637698565,2926376444&fm=253&fmt=auto&app=138&f=JPEG?w=620&h=465'
                }
            ]
        ]
    });

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
        background-color: yellowgreen;

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
                width: 300px;
                height: 120px;
            }
        }
    }
}
</style>