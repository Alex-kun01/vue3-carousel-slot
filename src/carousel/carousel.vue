<template>
    <div class="carousel_main" @mouseover="stopGroup" @mouseout="startGroup" :style="{'--width': width, '--height': height, '--timer': animationTime + 's'}">
        <!-- 轮播内容容器 -->
        <div class="slide_wraper">
            <!--插槽1-->
            <div class="slot_wraper" 
            v-if="slot1Show"
            :class="{
                ['out_' + ( groupType === 'transverse' ? direction : (direction === 'left' ? 'top' : 'bottom'))]: isMoveSlot,
                ['in_' + ( groupType === 'transverse' ? direction : (direction === 'left' ? 'top' : 'bottom'))]: !isMoveSlot,
                moveNone: animationLock }"
            >
                <slot :index="getSlotIndex('slot1')" />
            </div>
            <!--插槽2-->
            <div
            v-if="slot2Show"
            class="slot_wraper"
            :class="{
                ['out_' + ( groupType === 'transverse' ? direction : (direction === 'left' ? 'top' : 'bottom'))]: !isMoveSlot,
                ['in_' + ( groupType === 'transverse' ? direction : (direction === 'left' ? 'top' : 'bottom'))]: isMoveSlot,
                moveNone: animationLock}"
            >
                <slot :index="getSlotIndex('slot2')" />
            </div>
            <!-- 两侧切换按钮 -->
            <div class="slide_prev" v-show="showPrevNext && groupType !== 'vertical'" @click="changeCurrent('prev')">&lt;</div>
            <div class="slide_next" v-show="showPrevNext && groupType !== 'vertical'" @click="changeCurrent('next')">&gt;</div>
            <!-- 底部分页按钮 -->
            <div class="slide_pages" :class="{[groupType]: 1}" v-if="showPaging && list.length > 1">
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

export default {
    emits: ['changeIndex'],
    props: {
    // 轮播数据数组
        list: {
            type: Array,
            default: []
        },
        // 滚动类型 ransverse横向 vertical竖向 
        groupType: {
            type: String,
            default: 'transverse'
        },
        // 轮播速度 单位：ms
        speed: {
            type: Number,
            default: 5000
        },
        // 切换动画的时间
        animationTime: {
            type: Number,
            default: 0.5
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
    setup(props: any, context) {
        let timer: any = null;
        let keyx: boolean = true; // 防抖
        const state: any = reactive({
            asyncIndex: 0, // 异步索引
            nowIndex: 0, // 当前实时索引（同步）
            animationLock: true, // 是否为第一次加载
            direction: 'left', // 控制切换方向 left向左，right向右
            isReady: true, // 用于外部停止轮播锁止
            isMoveSlot: true, // 插槽1是否为【移出插槽】 两个插槽轮流当做【移出插槽】，true插槽1为【移出插槽】；false插槽2为【移出插槽】
            slot1Show: true, // 插槽1是否显示
            slot2Show: false, // 插槽2是否显示
        });

        // 获取下一页索引
        const nextIndex = (): number => {
            if (state.asyncIndex === props.list.length - 1) return 0;
            return state.asyncIndex + 1;
        };

        // 获取上一页索引
        const prevIndex = (): number => {
            if (state.asyncIndex === 0) return props.list.length - 1;
            return state.asyncIndex - 1;
        };

        // 处理方向
        const handleDirection = (index: number, from: string, direction?: string) => {
            // 如果来源是next则直接改变direction
            // 如果来源是bom则计算direction
            if (from === 'bom') {
                if (index > state.asyncIndex) state.direction = 'left';
                else if (index < state.asyncIndex) state.direction = 'right';
                else state.direction = 'left';
            } else if (from === 'next') {
                state.direction = direction;
            }
        };

        // 处理切换【移出插槽】逻辑
        const handleSwitchSlot = (index: number) => {
            // 插槽1是【移出插槽】
            if (state.isMoveSlot) {
                state.slot1Show = false; // 先隐藏掉插槽1
                state.animationLock = true; // 打开动画锁
                state.isMoveSlot = false; // 更改【移出插槽】 false：插槽2为【移出插槽】
            }else {
                // 插槽2是【移出插槽】
                state.slot2Show = false;
                state.animationLock = true;
                state.isMoveSlot = true;
            }

            // 更新索引
            state.asyncIndex = index;

            // 一轮防抖结束
            keyx = true;
        }

        // 跳转页
        const goCurrent = (index: number, from: string, direction?: string) => {
            // 禁止条件
            if (!state.isReady) return; // 外部锁止
            if (state.asyncIndex === index) return; // 禁止点击同一索引

            // 防抖
            if (!keyx) return;
            keyx = false;

            // 处理轮播方向
            handleDirection(index, from, direction);

            // 更新当前（实时索引）
            state.nowIndex = index;
            context.emit('changeIndex', index)

            // 打开动画锁
            state.animationLock = false;
            
            // 判断当前谁是【移出插槽】
            // 插槽1是【移出插槽】
            if (state.isMoveSlot) state.slot2Show = true;
            // 插槽2是【移出插槽】
            else state.slot1Show = true;
            
            // 移动结束
            setTimeout(() => {
                setTimeout(() => {
                    handleSwitchSlot(index);
                }, props.animationTime * 1000 - 50);
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

        const getSlotIndex = (slot: string) => {
            if (slot === 'slot1') {
                // 插槽1 且插槽1为【移出插槽】 则返回 旧索引
                if (!state.isMoveSlot) return state.nowIndex;
                // 新索引
                else return state.asyncIndex;
            }else {
                // 插槽2 且插槽2为【移出插槽】 则返回 旧索引
                if (state.isMoveSlot) return state.nowIndex;
                // 新索引
                else return state.asyncIndex;
            }
        }

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
            outStartGroup,
            getSlotIndex
        };
    }
};
</script>

<style lang="scss" scoped>

// 移出 ---------------------------------------------------------------

// 【移出插槽】【左移】动画
@keyframes outLeftx1 {
    0% {}
    100% {
        transform: translateX(-100%);
    }
}

// 【移出插槽】【右移】动画
@keyframes outRightx1 {
    0% {}
    100% {
        transform: translateX(100%);
    }
}

// 【移出插槽】【上移】动画
@keyframes outTopx1 {
    0% {}
    100% {
        transform: translateY(100%);
    }
}

// 【移出插槽】【下移】动画
@keyframes outBottomtx1 {
    0% {}
    100% {
        transform: translateY(-100%);
    }
}

//  ------------------------------------------------------------------

// 移入---------------------------------------------------------------

// 【移入插槽】 【左移】动画
@keyframes inLeftx1 {
    0% {
        transform: translateX(100%);
    }
    100% {
        transform: translateX(0); 
    }
}

// 【移入插槽】 【右移】动画
@keyframes inRightx1 {
    0% {
        transform: translateX(-100%);
    }
    100% {
        transform: translateX(0); 
    }
}

// 【移入插槽】 【上移】动画
@keyframes inTopx1 {
    0% {
        transform: translateY(-100%);
    }
    100% {
        transform: translateY(0); 
    }
}

// 【移入插槽】 【下移】动画
@keyframes inBottomx1 {
    0% {
        transform: translateY(100%);
    }
    100% {
        transform: translateY(0); 
    }
}

// ------------------------------------------------------------------

.carousel_main {
    width: var(--width);
    height: var(--height);
    position: relative;

    .slide_wraper {
        width: 100%;
        height: 100%;
        position: relative;
        overflow: hidden;

        // 插槽容器
        .slot_wraper {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;

            // 左【移出插槽】
            &.out_left {
                animation: outLeftx1 var(--timer) linear;
            }
            // 右【移出插槽】
            &.out_right {
                animation: outRightx1 var(--timer) linear;
            }

            // 上【移出插槽】
            &.out_top {
                animation: outTopx1 var(--timer) linear;
            }

            // 下【移出插槽】
            &.out_bottom {
                animation: outBottomtx1 var(--timer) linear;
            }

            
            // 左【移入插槽】
            &.in_left {
                animation: inLeftx1 var(--timer) linear;
            }

            // 右【移入插槽】
            &.in_right {
                animation: inRightx1 var(--timer) linear;
            }

            // 上【移入插槽】
            &.in_top {
                animation: inTopx1 var(--timer) linear;
            }

            // 下【移入插槽】
            &.in_bottom {
                animation: inBottomx1 var(--timer) linear;
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
            position: absolute;

            // 横向分页
            &.transverse {
                width: 100%;
                height: 14px;
                display: flex;
                align-items: center;
                justify-content: center;
                bottom: 20px;
                left: 0;
            }

            // 竖向分页
            &.vertical {
                width: 14px;
                height: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                flex-direction: column;
                top: 0;
                right: 10px;
            }

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
                width: 14px;
                height: 14px;
                background: #079eac;
                border-radius: 2px;

                // 分页按钮激活样式
                &.active {
                    background: rgb(242, 0, 0);
                    border-radius: 2px;
                }
            }
        }
    }
    }
}
</style>
