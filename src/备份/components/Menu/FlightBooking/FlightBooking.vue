<!--FlightBooking.vue-->
<template>
  <div class="search-module">

    <!-- 模块一     最上方的-->
    <div class="module1">
      <div class="module-header">
        <el-select v-model="tripType" placeholder="选择类型" @change="toggleRoundTrip" style="width: 100px; margin-right: 20px;" size="large">
          <el-option label="单程" value="oneWay"></el-option>
          <el-option label="往返" value="roundTrip"></el-option>
        </el-select>
        <el-input v-model="departure" placeholder="出发地" style="width: 150px; height: 40px;margin-right: 20px;"></el-input>
        <el-button @click="swapLocations" icon="" style="margin-right: 20px;" size="large">交换</el-button>
        <el-input v-model="destination" placeholder="目的地" style="width: 150px; margin-right: 20px;" size="large"></el-input>
        <el-date-picker v-model="departureDate" type="date" placeholder="出发时间" style="width: 150px; margin-right: 20px;" size="large" :min="currentDate"></el-date-picker>
        <el-date-picker v-model="returnDate" type="date" placeholder="返回时间" :disabled="tripType !== 'roundTrip'" style="width: 150px; margin-right: 20px;" size="large" :min="currentDate"></el-date-picker>
        <el-button type="default" style="width: 45px; color: #4CAF50;margin-right: 20px;" size="default">搜索</el-button>
      </div>
      <div class="background-image1"></div>

    </div>

    <el-carousel :interval="4000" arrow="always" style="max-width: 1060px; max-height: 120px;margin-left:250px;margin-top: 10px ">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <img :src="item.imageUrl" alt="轮播图" style="width: 100%; height: 100%;">
      </el-carousel-item>
    </el-carousel>

    <!-- 模块二-->

    <div class="head-calendar-scroll">
      <!-- 向左的箭头-->
      <button class="arrow-left" @click="scrollCalendar(-1)"></button>

      <div class="calendar-main">
        <transition name="fade" mode="out-in">
          <ul class="calendar-ul" :key="currentIndex">
            <li class="ttt" v-for="day in currentDays" :key="day.date">
              <span>{{ day.date }}</span>
              <br>
              <span class="bold">{{ day.price }}</span></li>
          </ul>
        </transition>
      </div>

      <!-- 向右的箭头-->
      <button class="arrow-right" @click="scrollCalendar(1)"></button>
      <!-- 查看日历按钮 -->
      <button class="aaa" @click="showCalendarPicker = !showCalendarPicker">查看日历</button>

      <!-- 日历选择器 -->
      <el-date-picker
          v-model="departureDate"
          type="date"
          :visible="showCalendarPicker"
          @change="onCalendarDateChange"
          style="display: none"
          format="yyyy-MM-dd"
      ></el-date-picker>
    </div>


    <div class="filters">
      <span class="label-title">筛选</span>
      <div class="flter-main">

        <div class="filters-group">
          <span class="filter-group-title">起飞时间</span>
          <div class="checkbox-lists">
        <span class="f-disabled check-label">
          <b class="icon-check"></b>
          <strong class="checkbox-label">凌晨 (00:00-05:59) </strong><!---->
        </span>
            <span class="enable check-label">
          <b class="icon-check"></b>
          <strong class="checkbox-label">上午（06:00-11:59) </strong><!---->
        </span>
            <span class="enable check-label">
          <b class="icon-check"></b>
          <strong class="checkbox-label">下午（12:00-17:59) </strong><!---->
        </span>
            <span class="enable check-label">
          <b class="icon-check"></b>
          <strong class="checkbox-label">晚上（18:00-23:59) </strong><!---->
        </span> <!---->
          </div>
        </div>

        <div class="filters-group">
          <span class="filter-group-title">航空公司</span>
          <div class="checkbox-lists">
        <span class="enable check-label">
          <b class="icon-check"></b>
          <strong class="checkbox-label">中国国际航空 </strong><!---->
        </span>
            <span class="enable check-label">
          <b class="icon-check"></b>
          <strong class="checkbox-label">海南航空 </strong><!---->
        </span>

          </div>
        </div>

        <div class="filters-group">
          <span class="filter-group-title">起飞机场</span>
          <div class="checkbox-lists">
        <span class="enable check-label">
          <b class="icon-check"></b>
          <strong class="checkbox-label">浦东机场 </strong><!---->
        </span>
            <span class="enable check-label">
          <b class="icon-check"></b>
          <strong class="checkbox-label">虹桥机场 </strong><!---->
        </span> <!---->
          </div>
        </div>


        <div class="filters-group">
          <span class="filter-group-title">降落机场</span>
          <div class="checkbox-lists">
        <span class="enable check-label">
          <b class="icon-check"></b>
          <strong class="checkbox-label">首都机场 </strong><!---->
        </span>
            <span class="enable check-label">
          <b class="icon-check"></b>
          <strong class="checkbox-label">大兴机场 </strong><!---->
        </span> <!---->
          </div>
        </div>
      </div>
    </div>


  </div>


</template>

<script setup>
import { ref, onMounted ,computed} from 'vue';
import { useRoute } from 'vue-router';

const carouselItems = ref([
  { imageUrl: 'src/assets/image/img_3.png' },
  { imageUrl: 'src/assets/image/img_2.png' },
  { imageUrl: 'src/assets/image/图片2.jpg' },
]);





const calendarDays = ref([
  { date: '11-11 周六', price: '¥1110' },
  { date: '11-12 周日', price: '¥1260' },
  { date: '11-13 周六', price: '¥1110' },
  { date: '11-14 周日', price: '¥1260' },
  { date: '11-15 周六', price: '¥1110' },
  { date: '11-16 周日', price: '¥1260' },
  { date: '11-17 周六', price: '¥1110' },
  { date: '11-18 周日', price: '¥1260' },
  { date: '11-19 周六', price: '¥1110' },
  { date: '11-20 周日', price: '¥1260' },
  { date: '11-21 周六', price: '¥1110' },
  { date: '11-22 周日', price: '¥1260' },
  { date: '11-23 周六', price: '¥1110' },
  { date: '11-24 周六', price: '¥1110' },
  { date: '11-25 周六', price: '¥1110' },
  { date: '11-20 周日', price: '¥1260' },
  { date: '11-21 周六', price: '¥1110' },
  { date: '11-22 周日', price: '¥1260' },
  { date: '11-23 周六', price: '¥1110' },
  { date: '11-24 周六', price: '¥1110' },
  { date: '11-25 周六', price: '¥1110' },

]);

const onCalendarDateChange =(date) => {

  console.log('Selected date:', date);

}

const currentIndex = ref(0);

const currentDays = computed(() => {
  const start = currentIndex.value * 7;
  const end = start + 7;
  return calendarDays.value.slice(start, end);
});

const scrollCalendar = (direction) => {
  const maxIndex = Math.floor((calendarDays.value.length - 1) / 7);

  if (direction === 1 && currentIndex.value < maxIndex) {
    currentIndex.value += 1;
  } else if (direction === -1 && currentIndex.value > 0) {
    currentIndex.value -= 1;
  }
};

const selectedDayIndex = ref(0);
const translateX = ref(0);
    const route = useRoute();
    const flightInfo = ref(null);
    const tripType = ref('oneWay');
/*    const currentDate = ref(new Date().toISOString().split('T')[0]);*/
    const currentDate = ref(new Date())
    const departureDate = ref(null);
    const departure = ref('');
    const destination = ref('');
    const returnDate = ref(currentDate.value);
    const showCalendarPicker  = ref(false)

    onMounted(() => {
      if (route.query.flightInfo) {
        flightInfo.value = JSON.parse(route.query.flightInfo);

        if (flightInfo.value && flightInfo.value.departureLocation) {
          tripType.value = flightInfo.value.tripType;
          departure.value = flightInfo.value.departureLocation;
          destination.value = flightInfo.value.destinationLocation;
          departureDate.value = flightInfo.value.currentDate;
          returnDate.value = flightInfo.value.returnDate;
        }
      }
    });

    const toggleRoundTrip = (value) => {
      if (value === 'oneWay') {
        returnDate.value = null;
      }
    };

    const swapLocations = () => {
      const temp = departure.value;
      departure.value = destination.value;
      destination.value = temp;
    };

</script>


<style lang="scss" scoped>
.dataListContainer{
  margin-left: 500px;
  margin-bottom: 500px;
}

.filters {
  background-color: #fff;
  width: 200px;
  padding: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-left: 250px;
  margin-top: 5px;
}

.label-title {
/*  color: #000;*/
  font-weight: bold;
  display: block;
  margin-bottom: 10px;
}

.flter-main {
  display: flex;
  flex-direction: column;
}

.filters-group {
  margin-bottom: 20px;
}

.filter-group-title {
/*  color: #000;*/
  font-weight: bold;
  margin-bottom: 10px;
}

.checkbox-lists {
  display: flex;
  flex-direction: column;
}

.check-label {
  margin-bottom: 5px;
}

.icon-check {
  margin-right: 5px;
  flex-direction: column;
}
.background-image1 {
  background-image: url('src/assets/image/图片2.jpg');
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.module1 {
/*  background-image: url('src/assets/image/趴在桌子的女孩.jpg');*/
  background-color: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 25, 0.7);
  padding: 30px;
  width: 65%;
  margin-left: 250px;

}

.module-header {
  padding: 20px;

  height: 40px;
}

.head-calendar-scroll {
  margin-top: 10px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 25, 0.7);
  background-color: white;
  margin-right: 230px;
}

.arrow-con {
  cursor: pointer;
}

.arrow-left,
.arrow-right {
  display: inline-block;
  width: 20px;
  height: 20px;
  color: black;
}

.calendar-main {
  overflow: hidden;
}

.calendar-ul {
  display: flex;
  transition: transform 0.3s ease;
}

li {
  list-style: none;
  text-align: center;
  margin: 0 10px;
  padding: 10px;
  cursor: pointer;
}

.selected {
  background-color: #e0e0e0;
}

.bold {
  font-weight: bold;
}




.head-calendar-scroll{
  display: flex;
  margin-left: 250px;
}

.arrow-con {
  cursor: pointer;
}

.arrow-left,
.arrow-right {
  width: 30px;
  height: 100px;
  color: black;
}



.calendar-main {
  display: flex;
  align-items: center;
}

.calendar-ul {
  display: flex;
  transition: transform 0.3s ease;
  margin-left: -40px;
}

li {
  list-style: none;
  margin: 0 10px;
  padding: 10px;
  cursor: pointer;
  border: 1px solid #007BFF;
  border-radius: 5px;
  width: 80px; /* 修改宽度为150像素，您可以根据需要调整 */
  height: 80px; /* 修改高度为150像素，您可以根据需要调整 */
}

.day-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bold {
  font-weight: bold;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
.aaa {
  width: 160px; /* 修改宽度为150像素，您可以根据需要调整 */
  height:100px; /* 修改高度为150像素，您可以根据需要调整 */
}

</style>