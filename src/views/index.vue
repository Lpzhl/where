<!--index.vue-->
<script setup>

import HeaderNav from "./headerNav.vue";
import Searchlist from "./searchlist.vue";
import Topfilter from "./topfilter.vue";
import NavMenu from "./navMenu.vue";
import RecommendList from "./recommend.vue";

import {useRoute} from "vue-router";

const route = useRoute();

const formData = route.query;

console.log(formData)
</script>

<template>
  <div class="common-layout">
    <div class="main-content">
      <el-container>
        <!-- 左侧导航栏 -->
        <!-- <NavMenu /> -->
        <el-container>
          <!-- 头部 -->
<!--          <el-header>
            &lt;!&ndash; <HeaderNav/> &ndash;&gt;
          </el-header>-->
          <el-main>
            <Searchlist :formData = "formData"/>
            <Topfilter />
            <!-- 推荐酒店 -->
            <RecommendList :formData = "formData"/>
          </el-main>
        </el-container>
      </el-container>
    </div>
  </div>
</template>


<style scoped>

</style>
