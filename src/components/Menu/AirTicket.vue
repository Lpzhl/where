<!--AirTicket.vue-->
<template>
  <div>
    <div class="image-container">
      <img src="../../assets/image/AirTicket/img.png" width="1550" style="z-index: -1;height: 350px">
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
          <input type="text" id="departure" v-model="departureLocation" @focus="handleInputFocus('departure')" >
          <button @click="swapLocations" class="hhh">对换</button>
          <input type="text" id="destination" v-model="destinationLocation" @focus="handleInputFocus('destination')" >
        </div>
      </div>

      <!-- 出发日期和返回日期 -->
      <div>
        <label for="departureDate">出发日期</label>
        <label for="returnDate" style="margin-left: 150px">返回日期</label>
        <div class="ttt">
          <input type="date" id="departureDate" :value="currentDate" @input="updateDepartureDate"   style="width: 160px; height: 30px;" :min="currentDate">
          <input type="date" id="returnDate" :value="returnDate" :disabled="tripType === 'oneWay'"  style="margin-left: 45px; width: 160px; height: 30px;" :min="currentDate">
        </div>
      </div>

      <!-- 搜索按钮 -->
      <div class="search-button-container">
        <button @click="searchFlights">搜索</button>
      </div>
    </div>

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
        <h4 style="margin-left: 450px;margin-top: 20px">{{ selectedCity }} 出发机票详情</h4>
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
import {ref, computed, onMounted, onUnmounted,watch} from 'vue';
import { ElRow, ElCol } from 'element-plus';
import { provide } from 'vue';
import {useRouter} from "vue-router";
import FlightBooking from "./FlightBooking/FlightBooking.vue";
const router = useRouter();



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

// 选择城市
const selectCity = (city) => {

  if (activeInput.value === 'departure') {
    departureLocation.value = city; // 更新出发地
  } else if (activeInput.value === 'destination') {
    destinationLocation.value = city; // 更新目的地
  }
  showCities.value = false; // 关闭地址选择框
};




// 数据
const tripType = ref('oneWay');
const departureLocation = ref('张家界');
const destinationLocation = ref('上海');
const currentDate = ref(new Date().toISOString().split('T')[0]);
const returnDate = ref(currentDate.value);
const hotCities = ['北京', '上海', '广州', '深圳', '重庆', '成都', '杭州', '南京', '武汉', '西安', '青岛', '长沙'];
const selectedCityIndex = ref('青岛');

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

showTicketDetails('青岛', 0);
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

  if (destinationLocation.value === departureLocation.value &&destinationLocation.value !== '') {
    alert('出发地和目的地不能相同！');
    destinationLocation.value = '';
    return;
  }

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
  margin-left: 200px;
  /* margin-bottom: 1400px; */
  margin-top: -150px;
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

</style>