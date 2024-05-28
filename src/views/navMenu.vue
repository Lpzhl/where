<script setup>
import {ref} from 'vue'
const isCollapse = ref(true) 
import {
  Document,
  Menu as IconMenu,
  Location,
  Setting,
  Avatar,
  StarFilled,
} from '@element-plus/icons-vue'
// 动态加载不同的组件
// let asidelist = ref([
//     {id:1,title:'酒店',icon:StarFilled},
//     {id:2,title:'机票',icon:Location},
//     {id:3,title:'火车票',icon:Avatar},
//     {id:4,title:'旅游',icon:Location},
//     {id:5,title:'景点',icon:Document},
//     {id:6,title:'汽车票',icon:Setting},
//     {id:7,title:'船票',icon:Document},
//     {id:8,title:'门票',icon:Document},
// ])
// 引入第三方图标
let asidelist = ref([
    {id:1,title:'酒店',icon:'icon-jiudian'},
    {id:2,title:'机票',icon:'icon-lvxing'},
    {id:3,title:'火车票',icon:'icon-huoche'},
    {id:4,title:'旅游',icon:'icon-lvyou1'},
    {id:5,title:'景点',icon:'icon-jingdian'},
    {id:6,title:'汽车票',icon:'icon-tuijianqiche'},
    {id:7,title:'船票',icon:'icon-lunchuan'},
    {id:8,title:'门票',icon:'icon-menpiao'},
])
</script>

<template>
<el-aside width="200px" class="aside">
    <div class="aside-list">
        <el-menu
            default-active="2"
            class="el-menu-vertical-demo"
            :collapse="isCollapse"
            @open="handleOpen"
            @close="handleClose"
        >
            <el-radio-group v-model="isCollapse" style="margin-bottom: 20px">
                <el-radio-button :label="false" v-show="isCollapse">|||</el-radio-button>
                <el-radio-button :label="true" v-show="!isCollapse">|||</el-radio-button>
            </el-radio-group>
            <el-menu-item index="v.id" v-for="v in asidelist" :key="v.id">
                <!-- <el-icon><component :is="v.icon"></component></el-icon> -->
                <i class="iconfont" :class="v.icon"></i>
                <template #title>{{v.title}}</template>
            </el-menu-item>
        </el-menu>
    </div>
</el-aside>
</template>

<style scoped>

</style>
