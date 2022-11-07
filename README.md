<!--
 * @Author: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @Date: 2022-11-03 10:58:17
 * @LastEditors: 西南开发二组蒋治坤 jiangzhikun@uino.com
 * @LastEditTime: 2022-11-07 13:01:30
 * @FilePath: \vue-carousel-slot\README.md
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

# 基于 vue3 的自定义内容横向轮播组件

## 通过插槽自定义内容轮播

- node 版本 12.22.0、14.17.5

## 可传参数

- `list` 轮播的数组，用于计算索引 【必传】
- `speed` 轮播的速度，单位：毫秒 默认 5 秒
- `showPrevNext` 是否显示两侧切换按钮 默认不显示
- `showPaging` 是否显示分页按钮 默认不显示
- `width` 轮播组件宽度 默认继承父元素宽度 默认 100%
- `height` 轮播组件高度 默认继承父元素高度 默认 100%
- `animationTime` 切换动画的时间 默认 0.5 秒

## 事件

- `changeIndex` 获取前轮播的索引（返回值：当前索引）

## 注意事项

- 轮播内容自行通过插槽传入，（！！！）插槽传参通过`index`暴露索引
- 轮播组件宽高默认继承组件的父元素宽高
- 分页按钮、两侧切换按钮的样式根据每个项目不同在组件内修改即可（该项目轮播分页按钮样式统一的情况下）
