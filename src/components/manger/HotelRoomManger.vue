<template>
  <el-row :gutter="20">
    <el-col :span="6" v-for="(item, index) in  pagedItems" :key="index" @click="goto(item)">
      <div class="image-container">
        <img :src="item.imageUrl" alt="Item Image" style="width: 500px;height: 200px"/>
        <div class="name">{{ item.name }}</div>
      </div>
    </el-col>
  </el-row>

  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-size="pageSize"
      :total="items.length"
      layout="total, prev, pager, next, jumper"
  >
  </el-pagination>
</template>

<script setup>
import {ref, computed, onMounted} from 'vue';

import {useRouter} from 'vue-router'

import {useUserStore} from '../../stores/userStore'
import {getHotelsByOwnerId} from "../../api/manger";
const userStore = useUserStore();
const userInfo = userStore.userInfo

console.log(userInfo)
const router = useRouter();


const items = ref([
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://localhost:8088/resources/廖梓行.jpg', name: '国际大酒店' },

]);
const currentPage = ref(1);
const pageSize = ref(8);

const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  return hotels.value.slice(start, end);
});

const handleCurrentChange = (val) => {
  currentPage.value = val;
};

const handleSizeChange = (val) => {
  pageSize.value = val;
};

const hotels = ref([

]);


const goto= (v)=>{
  console.log(v)
  const hotelDataString = encodeURIComponent(JSON.stringify(v));
  router.push({
    name:'hotelRoomDet',
    query:{
      hotels:hotelDataString
    }
  })
}
const fetchHotels = async () => {
  try {
    const ownerId = userInfo.id;
    let response = await getHotelsByOwnerId(ownerId);
    console.log('加载界面', response);

    let hotelsData = response.data ? response.data : response;

    hotelsData = hotelsData.map(hotel => {
      if (hotel.tag && typeof hotel.tag === 'string') {
        hotel.tag = hotel.tag.split(',');
      }
      return hotel;
    });

    console.log('转换后的酒店数据', hotelsData);
    hotels.value = hotelsData;
  } catch (error) {
    console.error('获取酒店信息时出错:', error);
  }
};

onMounted(() => {
  fetchHotels()
});

</script>

<style scoped>
.image-container img {
  width: 100%;
  height: auto;
  border-radius: 10px;
  transition: transform 0.3s ease; /* 平滑过渡效果 */
  cursor: pointer;
}

.image-container img:hover {
  transform: scale(1.1); /* 鼠标悬停时放大到110% */
}
.name {
  text-align: center;
  margin-top: 10px;
  margin-bottom: 10px;
  color: black;
  font-weight: bold;
}
</style>
