<template>
  <view class="app">
    <slot />
  </view>
</template>

<script setup>
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";

onLaunch(() => {
  console.log("懒觉王比赛 App Launch");
});

onShow(() => {
  console.log("懒觉王比赛 App Show");
});

onHide(() => {
  console.log("懒觉王比赛 App Hide");
});
</script>

<style lang="scss">
/* 全局样式 */
@import "@/uni.scss";

/* 每个页面公共css */
page {
  background-color: #1a1a2e;
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}
</style>
