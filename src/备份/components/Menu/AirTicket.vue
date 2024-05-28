<!--AirTicket.vue-->
<template>
  <div>
    <div class="image-container">
      <img src="../../assets/image/AirTicket/img.png" width="1550" style="z-index: -1">
    </div>

    <div class="input-container">
      <!-- 单程和往返选择 -->
      <div>
        <input type="radio" id="oneWay" name="tripType" value="oneWay" v-model="tripType">
        <label for="oneWay">单程</label>
        <input type="radio" id="roundTrip" name="tripType" value="roundTrip" v-model="tripType">
        <label for="roundTrip">往返</label>
      </div>

      <!-- 出发地和目的地 -->
      <div>
        <label for="departure" style="">出发地</label>
        <label for="destination" style="margin-left: 200px">目的地</label>
        <div>
          <input type="text" id="departure" v-model="departureLocation">
          <button @click="swapLocations" class="hhh">对换</button>
          <input type="text" id="destination" v-model="destinationLocation">
        </div>
      </div>

      <!-- 出发日期和返回日期 -->
      <div>
        <label for="departureDate">出发日期</label>
        <label for="returnDate" style="margin-left: 185px">返回日期</label>
        <div class="ttt">
          <input type="date" id="departureDate" :value="currentDate" @input="updateDepartureDate" style="width: 160px; height: 30px;" :min="currentDate">
          <input type="date" id="returnDate" :value="returnDate" :disabled="tripType === 'oneWay'" style="margin-left: 85px; width: 160px; height: 30px;" :min="currentDate">
        </div>
      </div>

      <!-- 搜索按钮 -->
      <div class="search-button-container">
        <button @click="searchFlights">搜索</button>
      </div>
    </div>

    <div class="hot-cities">
      <!-- 特惠机票标题 -->
      <h2>特惠机票</h2>

      <!-- 热门城市 -->
      <span>热门城市: </span>
      <span
          v-for="(city, index) in hotCities"
          :key="index"
          @click="showTicketDetails(city,index)"
          :class="{ 'highlighted': selectedCity === city }"
          style="margin: 5px"
      >{{ city }} </span>

      <!-- 机票详情box -->
      <div class="ticket-details" v-if="selectedCity">
        <h4 style="margin-left: 450px">{{ selectedCity }} 出发机票详情</h4>
        <div class="ticket-container">
          <el-row :gutter="20">
            <el-col :span="8" v-for="(ticket, index) in filteredTickets" :key="index">
              <div class="ticket-item" @click="handleRowClick(ticket)">
                <span>{{ ticket.start }} -> {{ ticket.destination }}</span>
                <span>{{ ticket.date }}</span>
                <span class="ticket-price">{{ ticket.price }}</span>
              </div>
            </el-col>
          </el-row>
          <!-- 条件渲染：如果没有机票，则显示"空空如也" -->
          <div class="no-tickets" v-if="filteredTickets.length === 0">空空如也</div>
        </div>
      </div>

      </div>
    </div>

</template>


<script setup>
import { ref,computed } from 'vue';
import { ElRow, ElCol } from 'element-plus';
import { provide } from 'vue';
import {useRouter} from "vue-router";
import FlightBooking from "./FlightBooking/FlightBooking.vue";
const router = useRouter();

// 数据
const tripType = ref('oneWay');
const departureLocation = ref('张家界');
const destinationLocation = ref('上海');
const currentDate = ref(new Date().toISOString().split('T')[0]);
const returnDate = ref(currentDate.value);
const hotCities = ['北京', '上海', '广州', '深圳', '重庆', '成都', '杭州', '南京', '武汉', '西安', '青岛', '长沙'];
const selectedCityIndex = ref('北京');

const selectedCity = ref(null);

const filteredTickets = computed(() => {
  if (!selectedCity.value) return [];
  return ticketDetails.filter((ticket) => ticket.start === selectedCity.value);
});
const handleRowClick = (ticket) => {
  console.log('点击了行，行内容为:', ticket);
};

const ticketDetails = [
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  { start: '青岛', destination: '上海', date: '11-07', price: '¥350' },
  { start: '青岛', destination: '昆明', date: '11-07', price: '¥956' },
  // 添加更多机票信息
  { start: '北京', destination: '上海', date: '11-07', price: '¥400' },
  { start: '北京', destination: '深圳', date: '11-07', price: '¥600' },
  // 添加更多机票信息
];
// 方法
const showTicketDetails = (city,index) => {
  selectedCity.value = city;
  selectedCityIndex.value = index;
};

showTicketDetails('北京', 0);
// 方法
const swapLocations = () => {
  const temp = departureLocation.value;
  departureLocation.value = destinationLocation.value;
  destinationLocation.value = temp;
};

const updateDepartureDate = (event) => {
  currentDate.value = event.target.value;
};
const searchFlights = () => {
  const flightInfo = {
    tripType: tripType.value,
    departureLocation: departureLocation.value,
    destinationLocation: destinationLocation.value,
    currentDate: currentDate.value,
    returnDate: returnDate.value,
  };

  console.log('f',flightInfo)

  router.push({
    name: 'FlightBooking',
    query: { flightInfo: JSON.stringify(flightInfo) },
  });
};


</script>





<style lang="scss" scoped>
.hot-cities{
  margin-left: 220px;
  cursor: pointer;
  top: 200px;
}
.ticket-container {
  background-color: #fff; /* 背景颜色为白色 */
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2); /* 添加阴影效果 */
  height: 350px; /* 设置最大高度，内容溢出时启用垂直滚动 */
  padding: 20px;
  width: 1000px;
}

.ticket-item {
  transition: background-color 0.2s; /* 添加过渡效果 */
}

.ticket-item:hover {
  background-color: #888888; /* 鼠标悬停时的背景颜色 */
}

.no-tickets {
  margin-top: 200px;
  text-align: center;
  font-size: 18px;
  padding: 20px;
  color: #888;
}
.ticket-item {
  display: flex;
  justify-content: space-between;
  padding: 5px 0;
}

.ticket-price {
  color: red;;
}


.highlighted {
  background-color: yellow;
  padding: 5px;
  border-radius: 5px;
  margin: 2px;
  cursor: pointer;
}
   /* 在此添加样式，可以根据需要自定义外观 */
 .input-container {
   position: absolute;
   top: 30%;
   left: 15%;
   transform: translate(0, -50%);
   background: #f8f8f8;
   padding: 20px;
   border: 1px solid #ccc;
   width: 500px;
   border-radius: 10px;
   box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
 }

 /* 搜索按钮样式 */
 .search-button-container {
   margin-left: 190px;
   margin-top: 20px;
 }

#departure {
  width: 30%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

#destination {
  width: 30%;
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.hhh {
  margin: 0 20px;
}

</style>