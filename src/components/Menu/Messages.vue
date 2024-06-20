<!--
<template>
  <div>
    <div class="background-image"></div>
    <h1>留言</h1>
  </div>
</template>

<script setup>

</script>

<style scoped>
.background-image {
  background-image: url('src/assets/image/img_3.png');
  background-size: cover;
  background-position: center;
  position: fixed; /* 让背景图片固定在视口中 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* 将背景图片放在最底层，以确保其他内容在上面 */
}
</style>-->

<template>
  <div style="margin-top: 100px">
    <el-container>
      <el-header>
        <el-input
            v-model="searchQuery"
            placeholder="请输入城市名称"
            @input="fetchCityData"
            clearable
        />
      </el-header>
      <el-main>
        <el-tabs v-if="cityData" v-model="activeTab">
          <el-tab-pane label="景点" name="attractions">
            <el-row :gutter="20" v-if="cityData.attractions.length">
              <el-col :span="8" v-for="attraction in cityData.attractions" :key="attraction.attractionId">
                <el-card :body-style="{ padding: '0px' }">
                  <img :src="attraction.image" class="image" />
                  <div style="padding: 14px;">
                    <span>{{ attraction.attractionName }}</span>
                    <div>{{ attraction.description }}</div>
                    <div class="bottom clearfix">
                      <el-tag>{{ attraction.openingHours }}</el-tag>
                      <el-tag>{{ attraction.ticketInfo }}</el-tag>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-empty v-else description="未找到景点"></el-empty>
          </el-tab-pane>
          <el-tab-pane label="餐馆" name="restaurants">
            <el-row :gutter="20" v-if="cityData.restaurants.length">
              <el-col :span="8" v-for="restaurant in cityData.restaurants" :key="restaurant.restaurantId">
                <el-card :body-style="{ padding: '0px' }">
                  <img :src="restaurant.image" class="image" />
                  <div style="padding: 14px;">
                    <span>{{ restaurant.restaurantName }}</span>
                    <div>{{ restaurant.description }}</div>
                    <div class="bottom clearfix">
                      <el-tag>{{ restaurant.recommendedDishes }}</el-tag>
                      <el-tag>{{ restaurant.address }}</el-tag>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-empty v-else description="未找到餐馆"></el-empty>
          </el-tab-pane>
          <el-tab-pane label="活动" name="events">
            <el-row :gutter="20" v-if="cityData.events.length">
              <el-col :span="8" v-for="event in cityData.events" :key="event.eventId">
                <el-card :body-style="{ padding: '0px' }">
                  <img :src="event.image" class="image" />
                  <div style="padding: 14px;">
                    <span>{{ event.eventName }}</span>
                    <div>{{ event.description }}</div>
                    <div class="bottom clearfix">
                      <el-tag>{{ event.eventTime }}</el-tag>
                      <el-tag>{{ event.location }}</el-tag>
                    </div>
                  </div>
                </el-card>
              </el-col>
            </el-row>
            <el-empty v-else description="未找到活动"></el-empty>
          </el-tab-pane>
        </el-tabs>
        <el-empty v-else description="请输入城市名称进行搜索"></el-empty>
      </el-main>
    </el-container>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const searchQuery = ref('');
const cityData = ref(null);
const activeTab = ref('attractions');

const fetchCityData = async () => {
  if (!searchQuery.value) {
    cityData.value = null;
    return;
  }

  try {
    const response = await axios.get(`http://121.41.107.127:8088/introduction/getIntroductionByCityName/${searchQuery.value}`);
    cityData.value = response.data.data
    console.log(cityData.value);
  } catch (error) {
    console.error('获取失败:', error);
    cityData.value = null;
  }
};

onMounted(() => {
  searchQuery.value = '北京'; // 设置默认城市名称
  fetchCityData();
});
</script>


<style scoped>
.image {
  width: 500px;
  height: 500px;
  display: block;
}
.el-card {
  margin-bottom: 20px;
}
.bottom {
  margin-top: 10px;
}
</style>
