<template>
  <el-carousel interval="5000" height="200px">
    <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
      <img :src="item.image" :alt="item.altText" style="width: 100%; height: 100%;">
    </el-carousel-item>
  </el-carousel>
</template>

<script setup>
import { ref } from 'vue';

const carouselItems = ref([
  { image: "src/assets/images/banner-1.jpg", altText: "Image 1" },
  { image: "src/assets/images/banner-2.jpg", altText: "Image 2" },
  { image: "src/assets/images/banner-3.jpg", altText: "Image 3" },
]);
</script>

<style scoped>
/* 添加你的自定义样式 */
</style>
