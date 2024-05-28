<template>
  <div class="order-container">
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div class="countdown">
      <span v-if=" orderData.bookingStatus ==='待支付' ">建议您在 {{ formattedCountdown }} 内完成付款，过期订单会自动取消哦</span>
    </div>
    <div class="order-header">
      <h1>订单号：{{ orderData.bookingId }} ({{ formatDate2(orderData.paymentTime) }} 预订)</h1>
      <p style="color:red;">订单状态：{{ orderData.bookingStatus }}</p>
      <p style="color: black;font-weight: bold">本单总额 RMB{{ orderData.totalPrice }}</p>
      <!-- 时间线 - 根据实际需求和数据动态生成 -->
      <p style="color:#ee9900;">{{ addMinutesToDate(orderData.paymentTime, 30) }} 您的订单已取消，您可以通过我们重新预订；若您已支付，所支付的房费将退还至原支付账户</p>
      <p>{{ formatDate2(orderData.paymentTime) }} 您提交了订单，请等待系统审核；请您在下单后30分钟内完成支付，过时系统将自动取消</p>
    </div>
    <div class="hotel-info">
      <h2>{{ orderData.hotelName }}</h2>
      <P>床型：{{orderData.bedtype}}</P>
      <p>单价：{{orderData.price}}</p>
      <p>早餐：{{orderData.breakfast}}</p>
      <p>前台电话：{{ orderData.phoneNumber }}</p>

    </div>
    <div class="booking-info">
      <h3>入住信息</h3>
      <p>入离日期：{{ formatDate1(orderData.checkInDate) }} 到 {{ formatDate1(orderData.checkOutDate) }}，共1晚</p>
      <p>最晚到店：{{ formatDate1(orderData.checkInDate) }}</p>
      <p>房  量：{{ orderData.roomNumber }}间</p>
      <!-- 房型、餐食等信息 - 根据实际数据添加 -->
    </div>
    <div class="contact-info">
      <h3>联系人信息</h3>
      <p>入 住 人：{{ orderData.customerName }}</p>
      <p>联系方式：{{ orderData.phoneNumber }}</p>
    </div>

    <div class="order-actions">
      <el-button type="danger" @click="deleteOrder">删除订单</el-button>

      <el-button v-if="orderData.bookingStatus === '待支付'" type="primary" @click="proceedToPayment">去支付</el-button>
      <el-button v-else-if="orderData.bookingStatus === '待评价'" type="primary" @click="leaveReview">评价</el-button>
      <el-button v-else-if="orderData.bookingStatus === '已过期'" type="primary" @click="rebook">再次预定</el-button>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, watch, onUnmounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
const route = useRoute();
const router = useRouter();
import {deleteOrder1} from '../../api/hotel'
import { ElMessage } from 'element-plus';


const errorMessage = ref('');
const orderData = ref({

});
const formatDate2 = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}年${month}月${day}日 ${hour}:${minute}`;
};

const formatDate1 = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}年${month}月${day}日`;
};

const addMinutesToDate = (dateStr, minutes) => {
  const date = new Date(dateStr);
  date.setMinutes(date.getMinutes() + minutes);
  return formatDate2(date);
};
onMounted(() => {

  if (route.query.orderData && typeof route.query.orderData === 'string') {
    try {
      orderData.value = JSON.parse(route.query.orderData);
    } catch (e) {
      console.error('Error parsing orderData:', e);
    }
  }
});



import { ElMessageBox } from 'element-plus';

const deleteOrder = async () => {
  try {
    await ElMessageBox.confirm('确定要删除这个订单吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    });
    console.log('删除订单');
    const response = await deleteOrder1(orderData.value.bookingId);
    console.log(response);
    if (response && response.data) {
      ElMessage({
        message: '订单删除成功',
        type: 'success',
        duration: 1000,
      });

      // 设置一个1秒的延时，然后跳转
      setTimeout(() => {
        router.push({ path: '/order' });
         window.close();
      }, 1000);
    } else {
      // 可以在这里处理失败的情况
    }
  } catch (error) {
    if (error.type !== 'cancel') {
      // 错误处理
    }
  }
};

const proceedToPayment = () => {
  const orderType = 'hotel';
  window.open(`http://localhost:8088/alipay/pay?orderName=${orderData.value.hotelName}&orderId=${orderData.value.bookingId}&totalPrice=${orderData.value.totalPrice}&orderType=${orderType}`);
};


const leaveReview = () => {
  console.log(orderData.value.bookingId)
  router.push({
    path: '/OrderReview',
    query:{
      booking: JSON.stringify(orderData.value)
    }
  });
};

const rebook = () => {
  console.log(orderData.value.bookingId)
};

import {fetchOrderInfo ,handleExpiredBooking,offOrder} from '../../api/hotel'
const isExpired = ref(false);  //标记是否过期

const bookingData = ref(null);
const bookingData1 = ref(null);
const totalSeconds = ref();
const formattedCountdown = ref('');



const updateBookingData = async () => {
    console.log("预定的id：",orderData.value.bookingId)

    const data = await fetchOrderInfo(orderData.value.bookingId);
    console.log('RedisData',data.data)
    bookingData1.value = data.data;
    console.log('bookingData1.value',bookingData1.value)
    bookingData.value = bookingData1.value.booking;
    totalSeconds.value = Math.floor(bookingData1.value.remainingTime / 1000);
};

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
}


async function processExpiredBooking() {
  try {

    const bookingId = bookingData.value.bookingId;
    await handleExpiredBooking(bookingId);
    console.log("订单已过期处理");

  } catch (error) {
    console.error("处理订单过期出错:", error);
  }
}

onMounted(updateBookingData);


watch(route, (newRoute) => {
  updateBookingData();
});




function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds.toString().padStart(2, '0')}秒`;
}

let interval;

onMounted(() => {
  formattedCountdown.value = formatTime(totalSeconds.value);

  const interval = setInterval(() => {
    if (totalSeconds.value > 0) {
      totalSeconds.value--;
      formattedCountdown.value = formatTime(totalSeconds.value);
    } else {
      clearInterval(interval);
      isExpired.value = true;
      processExpiredBooking();
    }
  }, 1000);

});

onMounted(() => {
  updateBookingData();
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style scoped>
.order-container {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
  font-family: Arial, sans-serif;
  margin-top: 150px;
}

.order-header, .hotel-info, .booking-info, .contact-info {
  margin-bottom: 20px;
}

.order-header h1 {
  font-size: 24px;
  margin-bottom: 10px;
  color: #333;
}

.order-header p {
  font-size: 16px;
  color: #555;
  line-height: 1.5;
}

.hotel-info h2, .booking-info h3, .contact-info h3 {
  font-size: 20px;
  margin-bottom: 10px;
  color: #333;
}

.hotel-info p, .booking-info p, .contact-info p {
  font-size: 16px;
  color: #555;
  line-height: 1.5;
}

.order-actions{
  margin-left: 270px;
}
</style>


