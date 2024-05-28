<template>
  <div class="payment-container">
    <el-alert
        :closable="false"
        type="warning"
        show-icon
    >
      建议您在 {{ countdown }} 内完成付款，过期订单会自动取消哦
    </el-alert>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>支付信息</span>
        <span class="header-amount">需支付: ¥{{ bookingData.totalPrice }}</span>
      </div>

      <div class="payment-detail">
<!--        <div>上海-北京</div>-->
        <div>
          {{ bookingData.departureAirport }} - {{ bookingData.arrivalAirport}}
          {{ formattedDate(bookingData.departureTime) }} 周五 {{ formattedDepartureTime(bookingData.arrivalTime) }}
        </div>
        <div class="payment-method">
          <el-radio-group v-model="paymentMethod">
            <el-radio label="微信支付">微信支付</el-radio>
            <el-radio label="支付宝">支付宝</el-radio>
          </el-radio-group>
        </div>
        <el-button type="primary" @click="submitPayment">确认支付(需支付 ¥{{ bookingData.totalPrice }})</el-button>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { reactive,ref ,onMounted,onBeforeMount,onUnmounted} from 'vue';
import {useRoute} from "vue-router";
import {getAirBookingById} from "../../../api/air";
const route = useRoute()
const paymentMethod = ref('微信支付');

function formattedDate(dateString) {
  const date = new Date(dateString);
  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, '0');
  const day = String(date.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}


function formattedDepartureTime(departureTime) {
  const time = new Date(departureTime);
  const hours = String(time.getUTCHours()).padStart(2, '0');
  const minutes = String(time.getUTCMinutes()).padStart(2, '0');
  return `${hours}:${minutes}`;
}
let bookingData = ref({

})

let orderTime = null;//订单倒计时     毫秒

const totalAmount = 770;

const submitPayment = () => {
  console.log('支付方式:', paymentMethod.value);
  console.log('支付金额:', totalAmount);
  const orderType = 'flight'; // 'hotel' 或 'flight'
  window.open(`http://localhost:8089/alipay/pay?orderName=${bookingData.value.arrivalAirport}&orderId=${bookingData.value.bookingId}&totalPrice=${bookingData.value.totalPrice}&orderType=${orderType}`);
};
onBeforeMount(()=>{
  if(route.query.booking) {
    console.log(JSON.parse(route.query.booking))
    const res = JSON.parse(route.query.booking)
    console.log(res.ticketBookings)
    bookingData.value = res.ticketBookings
    orderTime = res.countdownMinutes
    console.log('倒计时',orderTime)
    console.log(bookingData.value)
  }
})
let countdown = ref('');

const getAirBookingData = async () => {
  const res = await getAirBookingById(bookingData.value.bookingId)
  console.log('获取到的机票信息',res)
  bookingData.value = res.data.ticketBookings;

  startCountdown(res.data.countdownMinutes);
}

function startCountdown(duration) {
  let remainingTime = duration;
  countdown.value = formatTime(remainingTime);

  const intervalId = setInterval(() => {
    remainingTime -= 1000;
    countdown.value = formatTime(remainingTime);

    if (remainingTime <= 0) {
      clearInterval(intervalId);
      countdown.value = '00:00';

    }
  }, 1000);

  // 清理函数，在组件销毁时清除间隔
  onUnmounted(() => {
    clearInterval(intervalId);
  });
}

// 将毫秒转换成分秒格式
function formatTime(milliseconds) {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const seconds = (totalSeconds % 60).toString().padStart(2, '0');
  return `${minutes}:${seconds}`;
}
onMounted(()=>{
  getAirBookingData()
})
onBeforeMount(() => {
  if (route.query.booking) {
    const res = JSON.parse(route.query.booking);
    bookingData.value = res.ticketBookings;

    startCountdown(res.countdownMinutes);
  }

});
</script>

<style scoped>
.payment-container {
  padding: 30px;
  margin-top: 150px;
  margin-left: 200px;
  margin-right: 200px;
}

.box-card {
  margin-bottom: 20px;
}

.header-amount {
  float: right;
  color: #f56c6c;
}

.payment-detail {
  font-size: 16px;
  line-height: 2;
}

.payment-method {
  margin: 20px 0;
}

.el-radio-group {
  margin-bottom: 10px;
}

.el-button {
  width: 100%;
  height: 40px;
}
</style>
