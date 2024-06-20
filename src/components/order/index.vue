<template>
  <el-container style="overflow-x: hidden; margin-top: 100px;margin-left: 150px">
    <el-aside width="150px">
      <el-menu>
        <h1>
          个人主页
        </h1>
        <el-sub-menu  v-if="userInfo.isMerchant===0&&userInfo.roleId===0" index="1">
          <template #title >我的订单</template>
          <el-menu-item-group>
            <el-menu-item index="1-1" @click="goToAirOrders">机票订单</el-menu-item>
            <el-menu-item index="1-2" @click="goToHotelOrders">酒店订单</el-menu-item>
            <el-menu-item index="1-3" >火车票订单</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- 商家管理 Section -->
        <template v-if="userInfo.isMerchant">
          <el-sub-menu index="7">
            <template #title>商家管理</template>
            <el-menu-item-group>
              <el-menu-item index="7-1" @click="goToMangerHotel">酒店管理</el-menu-item>
              <el-menu-item index="7-2" @click="goToMangerRoom">房间管理</el-menu-item>
              <el-menu-item index="7-3" @click="goToMangerOrder">订单管理</el-menu-item>
              <el-menu-item v-if="userInfo.roleId" index="7-3" @click="goToAllOrder">销售额查看</el-menu-item>
              <el-menu-item v-else index="7-3" @click="goToHotelOrder">酒店销售额查看</el-menu-item>
            </el-menu-item-group>
          </el-sub-menu>
        </template>

        <el-menu-item index="2" v-if="userInfo.isMerchant||userInfo.roleId!==1">我的发票</el-menu-item>
        <el-menu-item index="3-4" @click="MyInfo">信息列表</el-menu-item>
        <el-sub-menu index="3"  v-if="userInfo.isMerchant||userInfo.roleId!==1">
          <template #title>个人中心</template>
          <el-menu-item-group>
            <el-menu-item index="3-1" @click="goToMyInfo">我的信息</el-menu-item>
            <el-menu-item index="3-2">我的收藏</el-menu-item>
            <el-menu-item index="3-3">我的评价</el-menu-item>
            <el-menu-item v-if="userInfo.isMerchant!==1"  index="3-4" @click="upda">入驻酒店</el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>
        <el-menu-item index="4"  v-if="userInfo.isMerchant||userInfo.roleId!==1">我的钱包</el-menu-item>
        <el-menu-item index="5"  v-if="userInfo.isMerchant||userInfo.roleId!==1">服务中心</el-menu-item>

        <el-sub-menu index="6">
          <template #title>我的管理</template>
          <el-menu-item-group>
            <el-menu-item
                v-for="permission in userPermissions"
                :key="permission.id"
                :index="`6-${permission.id}`"
                @click="() => handlePermissionClick(permission)"
            >
              {{ permission.name }}
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>


      </el-menu>
    </el-aside>
    <el-main style="margin-left: 0px">
      <router-view></router-view>
    </el-main>
  </el-container>
</template>

<script setup>
import { ElContainer, ElAside, ElMenu, ElMenuItem } from 'element-plus';
import { useRouter } from 'vue-router';
import {useUserStore} from "../../stores/userStore";
import { ref } from 'vue';
import {computed,onMounted} from "vue";
const router = useRouter();

const userPermissions = ref([]);

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

console.log('用户信息',userInfo.value)

import { getUserPermissions } from '../../api/login';

const fetchUserPermissions = async () => {
  const permissions = await getUserPermissions(userInfo.value.id);
  if (permissions) {
    console.log('角色权限:', permissions.data);
    userPermissions.value = permissions.data;
  }
};

const permissionActions = {
  '管理用户': () => router.push({ name: 'userManger' }),
  '查看订单': () => router.push({ name: 'orderManger' }),
  '审核酒店入驻': () => router.push({ name: 'MangeShen' }),
};


const handlePermissionClick = (permission) => {
  console.log("Clicked permission:", permission.name);

  const action = permissionActions[permission.name];
  if (action) {
    action();
  } else {
    console.log('无效:', permission.name);

  }
};

const goToMangerOrder = () =>{
  router.push({
    name : 'hotelBook',
    query: {

    }
  })
}
const goToAllOrder = () =>{
  router.push({
    name : 'allorderEchats',
    query: {

    }
  })
}

const goToHotelOrder = () =>{
  router.push({
    name : 'hotelcharts',
    query: {

    }
  })
}

const goToMangerHotel = () =>{
  router.push({
    name : 'hotelManger',
    query: {

    }
  })
}
const goToMangerRoom = () =>{
  router.push({
    name : 'hotelRoomManger',
    query: {

    }
  })
}

const upda = () =>{
  router.push({
    name : 'shengq',
    query: {
    }
  })
}


const goToMyInfo = () =>{
  router.push({
    name : 'myInfo',
    query: {
    }
  })
}



const MyInfo = () => {


  const route = router.resolve({
    name: 'MessageIndex',
    query: {

    }
  });

  window.open(route.href, '_blank');
}


const goToHotelOrders = () => {
  router.push({
    name: 'Ho',
    query:{ id: userInfo.value.id}
  });
};
const goToAirOrders = () => {
  router.push({
    name: 'airOrder',
    query:{id:userInfo.value.id}
  });
};

onMounted(() => {
  fetchUserPermissions()
})
</script>

<style>

</style>