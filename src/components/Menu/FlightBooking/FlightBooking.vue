<!--FlightBooking.vue-->
<template>
  <div class="background-image1"></div>
  <div class="search-module">

    <!-- 模块一     最上方的-->
    <div class="module1">
      <div class="module-header">
        <el-select v-model="tripType" placeholder="选择类型" @change="toggleRoundTrip" style="width: 100px; margin-right: 20px;" size="large">
          <el-option label="单程" value="oneWay"></el-option>
          <el-option label="往返" value="roundTrip"></el-option>
        </el-select>
        <el-input
            v-model="departure"
            placeholder="出发地"
            style="width: 150px; height: 40px; margin-right: 20px;"
            @focus="handleInputFocus('departure')"
        ></el-input>

        <div class="cities-dropdown" v-if="showCities">
          <div class="menu-bar">
            <button
                v-for="(cities, category) in cityData"
                :key="category"
                :class="{ 'active': currentCategory === category }"
                @click="selectCategory(category)"
            >
              {{ category }}
            </button>
          </div>
          <div class="city-list">
            <button v-for="city in currentCities" :key="city" @click="selectCity(city)">
              {{ city }}
            </button>
          </div>
        </div>
        <el-button @click="swapLocations" icon="" style="margin-right: 20px;" size="large">交换</el-button>
        <el-input
            v-model="destination"
            placeholder="目的地"
            style="width: 150px; margin-right: 20px;"
            size="large"
            @focus="handleInputFocus('destination')"
        ></el-input>
        <el-date-picker v-model="departureDate" type="date" placeholder="出发时间" style="width: 150px; margin-right: 20px;" size="large" :min="currentDate"></el-date-picker>
        <el-date-picker v-model="returnDate" type="date" placeholder="返回时间" :disabled="tripType !== 'roundTrip'" style="width: 150px; margin-right: 20px;" size="large" :min="currentDate"></el-date-picker>
        <el-button type="default" style="width: 45px; color: #4CAF50;margin-right: 20px;" size="default" @click="handleSearch">搜索</el-button>
      </div>

    </div>

    <el-carousel :interval="4000" arrow="always" style="max-width: 1060px; max-height: 120px;margin-left:250px;margin-top: 10px ">
      <el-carousel-item v-for="(item, index) in carouselItems" :key="index">
        <img :src="item.imageUrl" alt="轮播图" style="width: 100%; height: 100%;">
      </el-carousel-item>
    </el-carousel>

<!--    &lt;!&ndash; 模块二&ndash;&gt;

    <div class="head-calendar-scroll">
      &lt;!&ndash; 向左的箭头&ndash;&gt;
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

      &lt;!&ndash; 向右的箭头&ndash;&gt;
      <button class="arrow-right" @click="scrollCalendar(1)"></button>
      &lt;!&ndash; 查看日历按钮 &ndash;&gt;
      <button class="aaa" @click="showCalendarPicker = !showCalendarPicker">查看日历</button>

      &lt;!&ndash; 日历选择器 &ndash;&gt;
      <el-date-picker
          v-model="departureDate"
          type="date"
          :visible="showCalendarPicker"
          @change="onCalendarDateChange"
          style="display: none"
          format="yyyy-MM-dd"
      ></el-date-picker>
    </div>-->


    <div style="color: white">
      <el-select v-model="selectedAirline" placeholder="选择航空公司" style="margin-left: 250px;width: 100px;">
        <el-option
            v-for="flight in flights"
            :key="flight.airlines.airlineId"
            :label="flight.airlines.name"
            :value="flight.airlines.name"
            style="width: 80%;height: 50%"
        ></el-option>
      </el-select>


    <el-select v-model="selectedDepartPort" placeholder="选择出发机场" style="width: 100px;margin-left: 10px">
      <el-option
          v-for="flight in flights"
          :key="flight.flights.aircraftId"
          :label="flight.flights.departureAirport"
          :value="flight.flights.departureAirport"
      ></el-option>
    </el-select>
        <span style="font-size: 18px;color: black;margin-left: 200px">{{ departure }}   -------->{{ destination }} </span>
  </div>
    <div class="air-items">
      <div v-for="flight in filteredFlights" :key="flight.id" class="air-item">
        <div class="air-info">
          <div class="air-item-left">
            <span>
              <img :src="flight.flights.airplaneImageUrl" style="width: 100px; height: 50px;">
            </span>
            <div class="airline">
              <div class="airline-name">
<!--                {{flight.name}}-->
                {{flight.airlines.name}}
              </div>
              <div class="airline-NoAndType">
                <span class="airline-No">{{flight.flights.flightNumber }}</span>
<!--                <span class="airline-Type">{{flight.Type}}</span>-->
              </div>
            </div>
          </div>
          <div class="air-item-middle">
            <div class="depart-box">
              <div class="time">{{formatTime(flight.flights.departureTime)}}</div>
              <div class="airport">{{flight.flights.departureAirport }}</div>
            </div>
            <div class="1or2">-----</div>
            <div class="arrive-box">
              <div class="time">{{formatTime(flight.flights.arrivalTime)}}</div>
              <div class="airport">{{flight.flights.arrivalAirport}}</div>
            </div>
            <div class="air-item-right">
              <div class="air-price">
                ￥{{flight.price}}
              </div>
              <el-button class="bookTicket" @click="toggleSeats(flight.id)">预定</el-button>
            </div>
          </div>
          </div>


        <!-- 座位 -->
        <el-collapse-transition>
          <div v-if="expandedItem===(flight.id)">
            <!-- 表头 -->
            <div class="flight-seats-header" style="width: 70%; display: flex; justify-content: space-between;margin-left: 300px">
              <div style="margin-left: 70px">类型</div>
              <div style="margin-left: 150px">编号</div>
              <div style="margin-left: 130px">数量</div>
              <div style="margin-left: -100px;margin-right: -100px">价格</div>
              <div style="margin-right: 100px">操作</div>
            </div>

            <!-- 座位信息 -->
            <div class="flight-seats" v-for="seat in flight.flights.airSeatsList">
              <div class="seats-header" style="width: 100%; height: 20px;"></div>
              <div class="seat" style="display: flex; justify-content: space-between; padding: 10px 0;">
                <!-- <div class="seat-agent">{{seat.agent}}</div> -->
                <div class="seat-type">{{seat.type}}</div> <!-- 类型 -->
                <div class="seat-sign">{{seat.no}}</div>   <!-- 编号 -->
                <div class="seat-sign">{{seat.num}}</div>  <!-- 数量 -->
                <div class="seat-price">￥{{seat.price}}</div> <!-- 价格 -->
                <el-button class="seat-bookBtn" @click="buy(flight.flights,seat,flight.airlines)">预定</el-button>
              </div>
            </div>

          </div>
        </el-collapse-transition>


      </div>

    </div>



  </div>


</template>

<script setup>
import {computed, onMounted, onUnmounted, ref} from 'vue';
import {useRoute,useRouter} from 'vue-router';
import {searchAir} from "../../../api/air";
import {useUserStore} from "../../../stores/userStore"
import {} from "vue-router"

const router = useRouter();
const userStore = useUserStore()

const userInfo = computed(()=>userStore.userInfo)

const cityData = ref({
  hot:['北京','上海','广州','深圳' ,'成都' ,'杭州', '武汉' ,'西安', '重庆'
    ,'青岛','长沙','南京','厦门','昆明','大连','天津','郑州','三亚','济南','福州'],
  ABCDEF:{
    A:['阿勒泰','阿克苏','鞍山','安庆','安顺','阿拉善左','中国澳门','阿里','阿拉善右','阿尔山'],
    B:['巴中','百色','包头','毕节','北海','北京','博乐','保山','白城','布尔津','白山','巴彦淖尔'],
    C:['昌都','承德','常德','长春','朝阳','赤峰','长治','重庆','长沙','成都','沧源','常州','池州'],
    D:['大同','达州','稻城','丹东','迪庆','大连','大理','敦煌','东营','大庆','德令哈'],
    E:['鄂尔多斯','额济纳旗','恩施','二连浩特'],
    F:['福州','阜阳','抚远','富蕴','佛山']
  },
  GHIJ:{
    G:['广州','果洛','格尔木','广元','固原','中国高雄','赣州','贵阳','桂林'],
    H:['红原','海口','河池','邯郸','黑河','呼和浩特','合肥','杭州','淮安','怀化','海拉尔','哈密','衡阳','哈尔滨','和田','花土沟','中国花莲','霍林郭勒','惠州','汉中','黄山','呼伦贝尔','菏泽'],
    J:['中国嘉义','景德镇','加格达奇','嘉峪关','井冈山','金昌','九江','荆门','佳木斯','济宁','锦州','建三江','鸡西','九寨沟','中国金门','揭阳','济南','荆州'],
  },
  KLMN:{
    K:['库车','康定','喀什','凯里','昆明','库尔勒','克拉玛依'],
    L:['黎平','澜沧','龙岩','临汾','兰州','丽江','荔波','吕梁','临沧','陇南','六盘水','拉萨','洛阳','连云港','临沂','柳州','泸州','林芝'],
    M:['芒市','牡丹江','中国马祖','绵阳','梅州','中国马公','满洲里','漠河'],
    N:['南昌','中国南竿','南充','宁波','南京','宁蒗','南宁','南阳','南通'],
  },
  PQRSTUVW:{
    P:['攀枝花','普洱'],
    Q:['琼海','秦皇岛','祁连','且末','庆阳','黔江','泉州','衢州','齐齐哈尔','青岛'],
    R:['日照','日喀则','若羌'],
    S:['神农架','莎车','上海','沈阳','石河子','石家庄','上饶','三明','三亚','深圳','十堰','邵阳','松原'],
    T:['台州','中国台中','塔城','腾冲','铜仁','通辽','天水','吐鲁番','通化','中国台南','中国台北','天津','中国台东','唐山','太原'],
    W:['五大连池','乌兰浩特','乌兰察布','乌鲁木齐','潍坊','威海','文山','温州','乌海','武汉','武夷山','无锡','梧州','万州','乌拉特中','巫山','武隆','芜湖'],
  },
  XYZ:{
    X:['兴义','夏河','中国香港','西双版纳','新源','西安','忻州','信阳','襄阳','西昌','锡林浩特','厦门','西宁','徐州'],
    Y:['延安','银川','伊春','永州','榆林','宜宾','运城','宜春','宜昌','伊宁','义乌','营口','延吉','烟台','盐城','扬州','玉树玉','林岳阳','永州'],
    Z:['郑州','张家界','舟山','扎兰屯','张掖','昭通','湛江','中卫','张家口','珠海','遵义']
  }
});

const showCities = ref(false);
const currentCategory = ref('hot');
const currentCities = computed(() => {
  if (currentCategory.value.length === 1) {
    return cityData.value[currentCategory.value];
  } else {
    return Object.values(cityData.value[currentCategory.value]).flat();
  }
});

function selectCategory(category) {
  currentCategory.value = category;
  // 调整当前城市列表显示逻辑
  currentCities.value = Object.values(cityData.value[category]).flat();
}

const activeInput = ref(''); // 新状态变量，用于追踪当前激活的输入框

// 当任一输入框获得焦点时调用
const handleInputFocus = (input) => {
  activeInput.value = input; // 设置当前激活的输入框
  showCities.value = true; // 显示地址选择框
};

// 预定机票订单
const buy = (flight, seat,airlines) => {
  console.log('机票信息', flight);
  console.log('座位信息', seat);
  console.log('航空公司',airlines)
  router.push({
    name: 'flightOrder',
    query: { flight: JSON.stringify(flight), seat: JSON.stringify(seat),airlines: JSON.stringify(airlines)}
  });
};


// 选择城市
const selectCity = (city) => {
  if (activeInput.value === 'departure') {
    departure.value = city; // 更新出发地
  } else if (activeInput.value === 'destination') {
    destination.value = city; // 更新目的地
  }
  showCities.value = false; // 关闭地址选择框
};

const formatTime = (timeStr)=> {
  const date = new Date(timeStr);
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const seconds = date.getSeconds();
  const ampm = hours >= 12 ? '下午' : '上午';

  hours = hours % 12;
  hours = hours ? hours : 12; // 小时为0时转换为12

  return `${ampm}${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')} `;
}


const carouselItems = ref([
  { imageUrl: 'src/assets/image/img_3.png' },
  { imageUrl: 'src/assets/image/img_2.png' },
  { imageUrl: 'src/assets/image/图片2.jpg' },
]);

// 全局点击事件处理函数，用于关闭下拉菜单
const closeDropdown = (event) => {
  // 检查点击事件是否发生在下拉菜单或输入框外部
  if (!event.target.closest('.cities-dropdown') && !event.target.closest('.el-input')) {
    showCities.value = false;
  }
};

// 挂载时添加事件监听器
onMounted(() => {
  document.addEventListener('click', closeDropdown);
});

// 卸载时移除事件监听器
onUnmounted(() => {
  document.removeEventListener('click', closeDropdown);
  //
});
/*  {
    id: 1,
    name: '南方航空',
    No: 'A123',
    Type: '类型1',
    departTime: '上午10:00',
    departPort: '机场A',
    arriveTime: '下午12:00',
    arrivePort: '机场B',
    price: 500,
    airlineImage: 'https://pic.c-ctrip.com/fltcommon/index/airline/GX.png',
    seats: [
      { agent: '代理商1', type: 'A类型', sign: 'A1', price: 50 },
      { agent: '代理商2', type: 'B类型', sign: 'B1', price: 60 },
      { agent: '代理商2', type: 'B类型', sign: 'B1', price: 60 },
      { agent: '代理商2', type: 'B类型', sign: 'B1', price: 60 },
    ],
  },
  {
    id: 2,
    name: '东方航空',
    No: 'B456',
    Type: '类型2',
    departTime: '上午11:30',
    departPort: '机场C',
    arriveTime: '下午1:30',
    arrivePort: '机场D',
    price: 600,
    airlineImage: 'https://pic.c-ctrip.com/AssetCatalog/airline/32/ZH.png',
    seats: [
      { agent: '代理商3', type: 'C类型', sign: 'C1', price: 70 },
      { agent: '代理商4', type: 'D类型', sign: 'D1', price: 80 },
    ],
  },
  {
    id: 3,
    name: '深圳航空',
    No: 'C789',
    Type: '类型3',
    departTime: '下午2:00',
    departPort: '机场E',
    arriveTime: '下午4:30',
    arrivePort: '机场F',
    price: 750,
    airlineImage: 'https://pic.c-ctrip.com/AssetCatalog/airline/32/MU.png',
    seats: [
      { agent: '代理商5', type: 'E类型', sign: 'E1', price: 90 },
      { agent: '代理商6', type: 'F类型', sign: 'F1', price: 100 },
    ],
  },
  {
    id: 4,
    name: '西部航空',
    No: 'D012',
    Type: '类型4',
    departTime: '下午5:00',
    departPort: '机场G',
    arriveTime: '晚上7:30',
    arrivePort: '机场H',
    price: 800,
    airlineImage: 'https://pic.c-ctrip.com/AssetCatalog/airline/32/CZ.png',
    seats: [
      { agent: '代理商7', type: 'G类型', sign: 'G1', price: 110 },
      { agent: '代理商8', type: 'H类型', sign: 'H1', price: 120 },
    ],
  },*/
const expandedItem = ref(null);
const flights = ref( [

])

const selectedAirline = ref();
const selectedDepartPort = ref();


const filteredFlights = computed(() => {
  let filtered = flights.value;

  if (selectedAirline.value) {
    filtered = filtered.filter((flight) =>
        flight.airlines && flight.airlines.name === selectedAirline.value);
  }

  if (selectedDepartPort.value) {
    filtered = filtered.filter((flight) =>
        flight.flights && flight.flights.departureAirport === selectedDepartPort.value);
  }

  return filtered;
});

const toggleSeats = (flightId) => {
  expandedItem.value = expandedItem.value === flightId ? null : flightId;
};


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


const handleSearch = async () => {
  try {
    const requestData = {
      tripType: tripType.value,
      departure: departure.value,
      destination: destination.value,
      departureDate: new Date(departureDate.value).toISOString().split('T')[0],
      returnDate: new Date(returnDate.value).toISOString().split('T')[0],
    };
    /*
    const addOneDay = (dateString) => {
  const date = new Date(dateString);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
};

const requestData = {
  tripType: tripType.value,
  departure: departure.value,
  destination: destination.value,
  departureDate: addOneDay(departureDate.value),
  returnDate: addOneDay(returnDate.value),
};

     */

    console.log('机票信息',requestData.departureDate)
    const searchResults = await searchAir(requestData);
    console.log('搜索结果:', searchResults);
    flights.value = searchResults.data
    console.log(flights.value)
  } catch (error) {
    console.error('搜索机票时发生错误:', error);
  }
};

</script>


<style scoped>

.air-item {
  margin-bottom: 10px;
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}

.air-info:hover {
  background-color: #eaeaea;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.3);
}




.air-info {
  display: flex;
  justify-content: space-between;
  margin-left: 250px;
  margin-right: 230px;
  border: 2px solid black;
  padding: 10px;
}


.air-item-middle,
.air-item-right {
  flex: 1;
  margin-right: 10px;
}

.air-item-left {
  display: flex;
}


.air-item-right {
  margin-left: 580px;
  display: flex;
  align-items: center;
  position: absolute;
}

.air-item-middle{
  margin-left: 200px;
}

.air-items {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.air-item-middle {
  display: flex;
  gap: 20px;
  position: absolute;
  left: 368px;
}

.time {
  font-size: 32px;
}
.airline-name{
  color: black;
  font-weight: bold;
}
.airport {
  font-size: 10px;
  text-align: center;
}


.air-price {
  display: flex;
  align-items: center;
  justify-content: center;
  color: #0086f6;
  line-height: 26px;
  font-size: 30px;
}

.bookTicket{
  width: auto;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 600;
  background-image: linear-gradient(90deg,#409eff,#0086f6);
  color: #fff;
  margin-left: 20px;
}

/*座位预定*/
.seats {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.seat {
  background: white;
  padding: 20px 30px;
  display: flex;
  border-radius: 7px;
  box-shadow: 0px 2px 3px 0px #d1dbe5;
  align-items: center;
  position: relative;
  margin-left: 250px;
  margin-right: 230px
}

.seat-agent {
  font-size: 18px;
}

.seat-type {
  margin-left: 120px;
  font-size: 16px;
  color: #666;
  font-weight: 600;
}

.seat-sign {
  margin-left: 107px;
  color: #409eff;
  font-weight: 800;
}



.seat-price {
  position: absolute;
  right: 100px;
  font-size: 19px;
  font-weight: 700;
  color: #409eff;
}

button.el-button.el-button--small.seat-bookBtn {
  position: absolute;
  right: 26px;
  width: auto;
  height: 32px;
  line-height: 32px;
  font-size: 14px;
  font-weight: 600;
  background-image: linear-gradient(90deg,#409eff,#0086f6);
  color: #fff;
  margin-left: 20px;
}

.airline-NoAndType {
  display: flex;
  gap: 10px;
}
.city-list {
  display: flex;
  flex-wrap: wrap;
  max-width: 370px;
}
.city-list button {
  flex: 0 0 calc(100%/6 - 10px); /* 设置按钮占据行宽的六分之一，减去间隔 */
  margin-bottom: 10px; /* 为按钮底部添加间隔 */

}
.cities-dropdown {
  position: absolute;
  z-index: 10;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.menu-bar button {
  background: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.menu-bar button.active {
  color: #f00; /* 激活状态的颜色 */
  border-bottom: 2px solid #f00; /* 下划线表示活动状态 */
}
.city-list button {
  display: block;
  padding: 5px 10px;
  text-align: left;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
}

.city-list button:hover {
  background-color: #f0f0f0;
}

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
/*  background-image: url('src/assets/image/logo.png');*/
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
/*  background-image: url('src/assets/image/logo.png');*/
  background-color: #ffffff;
  background-size: cover;
  background-position: center;
  box-shadow: 0 2px 4px rgba(0, 0, 25, 0.7);
  padding: 30px;
/*  width: 68%;*/
  width: 1060px;
  margin-left: 250px;
  margin-top: 90px
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