<template>
    <div class="carousel_main" @mouseover="stopGroup" @mouseout="startGroup" :style="{'--width': width, '--height': height, '--timer': anTime + 's'}">
        <div class="slide_wraper">
            <!-- 轮播内容容器 -->
            <div :class="{['show_page_' + direction]: 1, moveNone: isFirst}" :key="showKey">
                <slot />
            </div>
            <div :class="{['move_page_' + direction]: 1, moveNone: isFirst}" :key="moveKey" v-if="moveShow">
                <slot />
            </div>
            <!-- 两侧切换按钮 -->
            <div class="slide_prev" v-show="showPrevNext" @click="changeCurrent('prev')">&lt;</div>
            <div class="slide_next" v-show="showPrevNext" @click="changeCurrent('next')">&gt;</div>
            <!-- 底部分页按钮 -->
            <div class="slide_pages" v-if="showPaging">
                <li class="slide_li_x" v-for="(item, index) in list" :key="index" @click="goCurrent(index, 'bom')">
                    <span class="slide_point_x" :class="{active: index === nowIndex}"></span>
                </li>
            </div>
        </div>
    </div>
</template>

<script lang='ts'>
import {
    reactive, toRefs, onMounted, onUnmounted
} from 'vue';

/**
 * 1、通过插槽传入轮播页签显示的内容
 * 2、通过[changeIndex]方法暴露轮播的索引，外部自行处理
 *  */

export default {
    emits: ['changeIndex'],
    props: {
    // 轮播数据数组
        list: {
            type: Array,
            default: []
        },
        // 轮播速度 单位：ms
        speed: {
            type: Number,
            default: 5000
        },
        // 是否显示两侧切换按钮
        showPrevNext: {
            type: Boolean,
            default: false
        },
        // 是否显示分页按钮
        showPaging: {
            type: Boolean,
            default: false
        },
        // 组件宽度
        width: {
            type: String,
            default: '100%'
        },
        // 组件宽度
        height: {
            type: String,
            default: '100%'
        }
    },
    setup(props: any, context: any) {
        let timer: any = null;
        let keyx: boolean = true; // 防抖
        const state: any = reactive({
            nowIndex: 0, // 当前轮播的索引
            isFirst: true, // 是否为第一次加载
            direction: 'left', // 控制切换方向 left向左，right向右
            isReady: true, // 用于外部停止轮播锁止
            showKey: 12345, // 显示插槽的key
            moveKey: 12345, // 移动插槽的key
            moveShow: false, // 移动插槽是否显示
            anTime: 2 // 切换动画的时间
        });

        // 获取下一页索引
        const nextIndex = (): number => {
            if (state.nowIndex === props.list.length - 1) return 0;
            return state.nowIndex + 1;
        };

        // 获取上一页索引
        const prevIndex = (): number => {
            if (state.nowIndex === 0) return props.list.length - 1;
            return state.nowIndex - 1;
        };

        // 处理方向
        const handleDirection = (index: number, from: string, direction?: string) => {
        // 显示移动的插槽
            state.moveShow = true;
            // 如果来源是next则直接改变direction
            // 如果来源是bom则计算direction
            if (from === 'bom') {
                if (index > state.nowIndex) state.direction = 'left';
                else if (index < state.nowIndex) state.direction = 'right';
                else state.direction = 'left';
            } else if (from === 'next') {
                state.direction = direction;
            }
            state.showKey = Date.now();
            state.moveKey = Date.now();
        };

        // 跳转页
        const goCurrent = (index: number, from: string, direction?: string) => {
            if (!state.isReady) return; // 锁止
            if (state.nowIndex === index) return; // 禁止点击同一索引
            if (state.isFirst) state.isFirst = false; // 解开第一次加载无动画的锁
            if (!keyx) return; // 防抖
            keyx = false;
            // 处理方向和动画更新
            handleDirection(index, from, direction);
            setTimeout(() => {
                state.nowIndex = index;
                // 通知父组件索引切换
                context.emit('changeIndex', index);
                setTimeout(() => {
                    keyx = true;
                    // 销毁移动插槽
                    state.moveShow = false;
                }, state.anTime * 1000);
            }, 10);
        };

        // 开始滚动
        const startGroup = () => {
            stopGroup();
            timer = setInterval(() => {
                goCurrent(nextIndex(), 'next', 'left');
            }, props.speed);
        };

        // 停止滚动
        const stopGroup = () => {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
        };

        // 两侧切换
        const changeCurrent = (type: string) => {
            if (!type || typeof type !== 'string') return;
            if (type === 'prev') goCurrent(prevIndex(), 'next', 'right');
            else if (type === 'next') goCurrent(nextIndex(), 'next', 'left');
            else return;
        };

        // 外部-开始滚动 恢复正常滚动，解锁
        const outStartGroup = () => {
            state.isReady = true;
            startGroup();
        };

        // 外部-停止滚动 注：此方法执行后，会锁定滚动，移出事件不会重新开始滚动
        const outStopGroup = () => {
            state.isReady = false;
            stopGroup();
        };

        onMounted(() => {
            startGroup();
        });

        onUnmounted(() => {
            if (timer) clearInterval(timer);
        });

        return {
            ...toRefs(state),
            goCurrent,
            startGroup,
            stopGroup,
            changeCurrent,
            outStopGroup,
            outStartGroup
        };
    }
};
</script>

<style lang="scss" scoped>
@keyframes showLeft {
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(0);
    }
}
@keyframes showRight {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(0);
    }
}

@keyframes moveLeft {
    0% {
        transform: translateX(0%);
    }
    100% {
        transform: translateX(-100%);
    }
}

@keyframes moveRight {
    0% {
        transform: translateX(0%);
    }
    100% {
        transform: translateX(100%);
    }
}


.carousel_main {
    width: var(--width);
    height: var(--height);
    position: relative;

    .slide_wraper {
        width: 100%;
        height: 100%;
        position: relative;
        // overflow: hidden;

        .show_page {

            &_left {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                animation: moveLeft var(--timer) linear;
            }

            &_right {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                animation: moveRight var(--timer) linear;
            }

            &_first {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
        }

        .move_page{
            &_left {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                animation: showLeft var(--timer) linear;
            }

            &_right {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                animation: showRight var(--timer) linear;
            }

            &_first {
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
            }
        }

        .moveNone {
            animation: none!important;
        }

        // 两侧切换按钮样式
        .slide {

            // 左侧样式
            &_prev {
                width: 30px;
                height: 40px;
                position: absolute;
                top: 45%;
                left: 0;
                text-align: center;
                line-height: 40px;
                color: #fff;
                font-size: 27px;
                cursor: pointer;
            }

            // 右侧样式
            &_next {
                width: 30px;
                height: 40px;
                position: absolute;
                top: 45%;
                right: 0;
                text-align: center;
                line-height: 40px;
                color: #fff;
                font-size: 27px;
                cursor: pointer;
            }
        }

        // 底部切换按钮样式
        .slide_pages {
            width: 100%;
            height: 12px;
            position: absolute;
            bottom: 37px;
            left: 0;
            display: flex;
            align-items: center;
            justify-content: center;

        .slide_li_x {
            display: inline-block;
            padding: 0 10px;
            cursor: pointer;
            color: #fff;
            font-size: 16px;

            .slide_point_x {
                // 分页按钮未激活样式
                display: inline-block;
                box-sizing: border-box;
                width: 12px;
                height: 12px;
                background: #5D9BC6;
                border-radius: 2px;

                // 分页按钮激活样式
                &.active {
                    background: #3D92FA;
                    border: 2px solid #9FCAFF;
                    border-radius: 2px;
                }
            }
        }
    }
    }
}
</style>
