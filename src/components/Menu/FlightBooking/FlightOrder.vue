<template>
  <div class="main-container">
    <el-row>
      <el-col :span="12">
        <div class="passenger-info">
          <h2 style="margin-bottom: 30px">乘机人信息 - 总数: {{ passengers.length }}</h2>
          <el-form label-position="right" label-width="100px">
            <div v-for="(passenger, index) in passengers" :key="index" class="passenger-group">
              <el-form-item label="姓名">
                <el-input v-model="passenger.name"></el-input>
              </el-form-item>
              <el-form-item label="身份证">
                <el-input v-model="passenger.identityCardNumber"></el-input>
              </el-form-item>
              <el-form-item label="手机号码">
                <el-input v-model="passenger.phoneNumber"></el-input>
              </el-form-item>
              <el-button type="text" class="delete-button" @click="removePassenger(index)">
                删除
              </el-button>
            </div>
            <el-button type="primary" @click="addPassenger">新增乘机人</el-button>
          </el-form>
        </div>
      </el-col>
      <el-col :span="12">
<!--        <div class="flight-info">
          <h2>机票信息</h2>
          <div>日期：{{ flight.date }}</div>
          <div>航空公司：{{ flight.airline }}</div>
          <div>航班号：{{ flight.flightNumber }}</div>
          <div>座位类型：{{ flight.seatType }}</div>
          <div>出发时间：{{ flight.departureTime }}</div>
          <div>出发机场：{{ flight.departureAirport }}</div>
          <div>到达时间：{{ flight.arrivalTime }}</div>
          <div>到达机场：{{ flight.arrivalAirport }}</div>
          <div>订单总额：{{ flight.totalAmount }}</div>
        </div>-->
        <div class="flight-container">
          <el-row :gutter="20">
            <el-col :span="6">
<!--              <div class="date">{{ flight.date }} (周五)</div>-->
              <div class="date">{{  formattedDepartureDate(flightInfo .departureTime) }}(周五)</div>
            </el-col>
            <el-col :span="18">
              <div class="flight-detail">
                <div class="flight-number">
<!--                  {{ flight.airline }} {{ flight.flightNumber }} {{ flight.seatType }}-->
                  {{ airlinesInfo.name}} {{ flightInfo.flightNumber }} {{ seatInfo.type }}
                </div>
                <el-row align="middle" type="flex">
                  <el-col :span="9">
                    <div class="time">{{ formattedDepartureTime(flightInfo.departureTime) }}</div>
                    <div class="airport">{{ flightInfo.departureAirport }}</div>
                  </el-col>
                  <el-col :span="6">
                    <div class="duration">
                      <i class="el-icon-arrow-right"></i> {{ flightDuration }}
                    </div>
                  </el-col>
                  <el-col :span="9">
                    <div class="time">{{ formattedDepartureTime(flightInfo.arrivalTime) }}</div>
                    <div class="airport">{{ flightInfo.arrivalAirport }}</div>
                  </el-col>
                </el-row>
                <div class="flight-options">
                  退改签规则 | 行李规则 | 延误赔付
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
        <!-- 订单费用模块 -->
        <div class="order-summary">
          <div class="order-total">
            <span>订单总额</span>
            <span class="total-price">￥{{ totalPrice  }}</span>
          </div>
          <el-button type="danger" class="pay-button" @click="handlePayment">提交订单</el-button>
        </div>
      </el-col>
    </el-row>
  </div>

</template>

<script setup>
import {computed, onBeforeMount, reactive, ref} from 'vue';
import {useRoute,useRouter} from 'vue-router';
import {useUserStore} from '../../../stores/userStore'
import {bookingAir} from "../../../api/air";

const userStore = useUserStore();
const userInfo =  computed(()=>userStore.userInfo)

const router = useRouter()
const route = useRoute();

const flightInfo = ref('');
const seatInfo = ref('');
const airlinesInfo = ref('')
let time = null;
let time2 = null;
onBeforeMount(() => {
  if (route.query.flight) {
    flightInfo.value = JSON.parse(route.query.flight);
  }
  if (route.query.seat) {
    seatInfo.value = JSON.parse(route.query.seat);
  }if(route.query.airlines){
    airlinesInfo.value = JSON.parse(route.query.airlines)
  }
  console.log('机票信息',flightInfo.value.departureTime)
  console.log('机票信息',formattedDepartureTime(flightInfo.value.departureTime))
  time = formattedDepartureTime1(flightInfo.value.departureTime);
  time2 = formattedDepartureTime1(flightInfo.value.arrivalTime);
  console.log(time)
  console.log(time2)
  console.log('座位信息',seatInfo.value)
  console.log('航空公司信息',airlinesInfo.value)
});

// 计算订单总价格
const totalPrice = computed(() => {
  return passengers.length * seatInfo.value.price;
});

function formattedDepartureTime(departureTime) {
  const time = new Date(departureTime);
  const hours = String(time.getUTCHours()).padStart(2, '0');
  const minutes = String(time.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
function formattedDepartureTime1(departureTime) {
  const time = new Date(departureTime);
  const hours = String(time.getUTCHours()).padStart(2, '0');
  const minutes = String(time.getUTCMinutes()).padStart(2, '0');
  const mss = String(time.getSeconds()).padStart(2, '0');
  return `${hours}:${minutes}:${mss}`;
}

const passengers = reactive([
  { name: '张三', identityCardNumber: '1234567890', phoneNumber: '13800000000' },
  { name: '李四', identityCardNumber: '0987654321',  phoneNumber: '13911111111' },
]);


const flightDuration = computed(() => {
  const departureTime = time;
  const arrivalTime = time2;
  console.log('time',time)
  console.log('time2',time2)
  // 将时间字符串转换为分钟数
  function timeToMinutes(timeString) {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 60 + minutes + seconds / 60;
  }

  const minutesDeparture = timeToMinutes(departureTime);
  const minutesArrival = timeToMinutes(arrivalTime);

  // 计算飞行时间的分钟差异
  const minutesDifference = minutesArrival - minutesDeparture;

  // 将分钟差异转换为小时和分钟
  const hours = Math.floor(minutesDifference / 60);
  const remainingMinutes = minutesDifference % 60;
  console.log('hours',hours)
  console.log('remainingMinutes',remainingMinutes)

  return `${hours}小时${remainingMinutes}分钟`;
});

// 提交给后端的表单数据
const FromData = ref({
  passengers:passengers, // 乘机人信息
  flightInfo:flightInfo.value, // 航班信息
  seatInfo:seatInfo.value,   // 座位信息
  userId: userInfo.value.id, // 预定人id
  price:''
});

// 处理支付的方法
const handlePayment = async () => {
  FromData.value.seatInfo = seatInfo.value
  FromData.value.passengers = passengers
  FromData.value.price = totalPrice;
  FromData.value.flightInfo = flightInfo.value
  FromData.value.id = userInfo.value.id
  console.log('执行支付流程...');
  try {
    // 提交表单数据给后端保存
   const response = await bookingAir(FromData.value);
    console.log('支付成功，响应:',response.data.data);

    await router.push({
      name: 'sumOrder',
      query: {booking: JSON.stringify(response.data.data)}
    });
  } catch (error) {
    console.error('支付失败:', error);
  }
};

const removePassenger = (index) => {
  passengers.splice(index, 1);
};

function formattedDepartureDate(departureTime) {
  const departureDate = new Date(departureTime);

  const month = String(departureDate.getMonth() + 1).padStart(2, '0');
  const day = String(departureDate.getDate()).padStart(2, '0');
  return `${month}-${day}`;
}
// 添加乘客的方法
const addPassenger = () => {
  passengers.push({ name: '', idCard: '', phone: '' });
};
</script>

<style scoped>
.main-container {
/*  background-color: #969896; !* 整个容器的背景色 *!*/

}
.passenger-info {
  margin-left: 200px;
  background-color: white;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
  max-width: 60%; /* 调整最大宽度为35% */
  min-width: 300px; /* 设置最小宽度 */
}

.flight-info {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 10px;
  padding: 20px;
  margin: 10px;
  max-width: 60%;
  min-width: 300px;
}
.passenger-info, .flight-info {
  background-color: white;
  border: 1px solid #eee;
  border-radius: 10px; /* 设置圆角边框 */
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 150px;

}
.passenger-info, .flight-info {
  border: 1px solid #eee;
  padding: 20px;
  margin-bottom: 20px;
  margin-top: 150px;
}
.passenger-group:not(:last-child) {
  border-bottom: 1px solid black;
  padding-bottom: 15px;
  margin-bottom: 15px;
}
.passenger-group {
  position: relative;
}

.delete-button {
  position: absolute;
  top: 0;
  right: 0;
  display: none;
  color: red;
}

.passenger-group:hover .delete-button {
  display: block;
}
.flight-container {
  background-color: #f5f5f5;
  border-radius: 8px;
  padding: 15px;
  margin-top: 150px;
  margin-right: 100px;
}

.date {
  font-size: 18px;
  color: #333;
}

.flight-detail {
  border-left: 3px solid teal;
  padding-left: 15px;
}

.flight-number {
  color: #666;
  font-size: 16px;
  margin-bottom: 8px;
}

.time {
  font-size: 24px;
  font-weight: bold;
  color: #333;
}

.airport {
  color: #666;
}

.duration {
/*  text-align: center;*/
  color: #666;
}

.flight-options {
  margin-top: 8px;
  color: teal;
  cursor: pointer;
}

.el-icon-arrow-right {
  font-size: 20px;
  margin: 0 5px;
}
.order-total {
  display: flex;
  justify-content: space-between;
  font-size: 18px;
  font-weight: bold;
  margin-right: 500px;
}


.pay-button {
  margin-top: 10px;
  width: 50%;
}
</style>
