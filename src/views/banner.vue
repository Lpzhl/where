<script setup>
import {ref} from 'vue'
let bannerlist = ref([
    {id:1,img_url:'banner-1.jpg'},
    {id:2,img_url:'banner-2.jpg'},
    {id:3,img_url:'banner-3.jpg'},
])
</script>

<template>
<div class="banner">
    <el-carousel height="620px">
        <el-carousel-item v-for="item in bannerlist" :key="item.id">
           <img :src="`/src/assets/images/${item.img_url}`" alt="">
        </el-carousel-item>
    </el-carousel>
</div>

</template>

<style scoped>

</style>
