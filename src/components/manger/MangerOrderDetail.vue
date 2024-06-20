<template>
  <div class="order-container">
    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div class="order-header">
    <p style="color: black;font-weight: bold">已支付 RMB{{ orignialPrice }}</p>
      <p v-if="remainingAmount>0" style="color: red; font-weight: bold">
        {{ remainingAmount <= 0 ? '还需支付 RMB0' : `还需支付 RMB${remainingAmount}` }}
      </p>
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
      <template v-if="!editCheckInDate">
        <p>入离日期：{{ formatDate1(orderData.checkInDate) }} 到 {{ formatDate1(orderData.checkOutDate) }}，共{{ totalNights }}晚</p>
        <p>最晚到店：{{ formatDate1(orderData.checkInDate) }}</p>
        <p>房  量：{{ orderData.roomNumber }}间</p>
      </template>
      <template v-else>
        <label v-if="!editCheckInDate" for="checkInDate">入住日期：</label>
        <input v-else id="checkInDate" type="date" v-model="editedCheckInDate" :placeholder="formatDate1(orderData.checkInDate)">
        <label v-if="!editCheckOutDate" for="checkOutDate">离店日期：</label>
        <input v-else id="checkOutDate" type="date" v-model="editedCheckOutDate" :placeholder="formatDate1(orderData.checkOutDate)">
        <label v-if="!editRoomNumber" for="roomNumber">房  量：</label>
        <input v-else id="roomNumber" type="number" v-model="editedRoomNumber" :placeholder="orderData.roomNumber">
      </template>
    </div>

    <div class="contact-info">
      <h3>联系人信息</h3>
      <template v-if="!editCustomerName">
        <p>入 住 人：{{ orderData.customerName }}</p>
        <p>联系方式：{{ orderData.phoneNumber }}</p>
      </template>
      <template v-else>
        <label v-if="!editCustomerName" for="customerName">入住人：</label>
        <input v-else id="customerName" type="text" v-model="editedCustomerName" :placeholder="orderData.customerName">
        <label v-if="!editPhoneNumber" for="phoneNumber">联系方式：</label>
        <input v-else id="phoneNumber" type="text" v-model="editedPhoneNumber" :placeholder="orderData.phoneNumber">
      </template>
    </div>


    <div class="order-actions">
      <el-button v-if="orderData.bookingStatus!=='已过期'" type="primary" @click="editOrder">修改订单</el-button>
      <el-button v-if="orderData.bookingStatus!=='已过期'" type="primary" @click="saveOrder">保存</el-button>
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed, onUnmounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import axios from "axios";
const route = useRoute();
const router = useRouter();

let interval;
const bookingData = ref(null);
const bookingData1 = ref(null);
const totalSeconds = ref();
const formattedCountdown = ref('');

const errorMessage = ref('');  // 用于存储和显示错误信息
const orderData = ref({

});

let remainingAmount =ref(0);

const orignialPrice = ref() // 原价
// 计算还需支付的金额

// 计算入离日期之间的总晚数
const totalNights = computed(() => {
  const checkInDate = new Date(orderData.value.checkInDate);
  const checkOutDate = new Date(orderData.value.checkOutDate);
  const timeDiff = checkOutDate - checkInDate;
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const nights = Math.floor(timeDiff / oneDayInMilliseconds);
  return nights;
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
      orignialPrice.value = orderData.value.totalPrice
    } catch (e) {
      console.error('Error parsing orderData:', e);
    }
  }
});

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
}
// 计算还需支付的金额的函数
const calculateRemainingAmount = () => {
  const totalPrice = orderData.value.totalPrice || 0;
  const roomNumber = editedRoomNumber.value || orderData.value.roomNumber || 0;
  const checkInDate = new Date(editedCheckInDate.value || orderData.value.checkInDate);
  const checkOutDate = new Date(editedCheckOutDate.value || orderData.value.checkOutDate);
  const timeDiff = checkOutDate - checkInDate;
  const oneDayInMilliseconds = 24 * 60 * 60 * 1000;
  const nights = Math.floor(timeDiff / oneDayInMilliseconds);
  const newTotalPrice = roomNumber * nights * orderData.value.price;
  return newTotalPrice - totalPrice;
};
// 格式化时间显示
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds.toString().padStart(2, '0')}秒`;
}

// 编辑状态变量
const editCheckInDate = ref(false);
const editCheckOutDate = ref(false)
const editRoomNumber = ref(false);
const editCustomerName = ref(false);
const editPhoneNumber = ref(false);

// 编辑时的临时数据
const editedCheckInDate = ref('');
const editedCheckOutDate = ref('');
const editedRoomNumber = ref('');
const editedCustomerName = ref('');
const editedPhoneNumber = ref('');

// 当点击 "修改订单" 时切换编辑状态
const editOrder = () => {
  editCheckInDate.value = true;
  editCheckOutDate.value = true;
  editRoomNumber.value = true;
  editCustomerName.value = true;
  editPhoneNumber.value = true;
  editedCheckInDate.value =orderData.value.checkInDate ;
  editedCheckOutDate.value = orderData.value.checkOutDate;
  editedRoomNumber.value = orderData.value.roomNumber;
  editedCustomerName.value = orderData.value.customerName ;
  editedPhoneNumber.value = orderData.value.phoneNumber;
};

// 保存修改后的订单信息
const saveOrder = () => {
  // 将编辑后的数据保存到 orderData 中，然后退出编辑状态
  orderData.value.checkInDate = editedCheckInDate.value;
  orderData.value.checkOutDate = editedCheckOutDate.value;
  orderData.value.roomNumber = editedRoomNumber.value;
  orderData.value.customerName = editedCustomerName.value;
  orderData.value.phoneNumber = editedPhoneNumber.value;

  // 重新计算还需要支付的金额
  remainingAmount.value = calculateRemainingAmount();
  orderData.value.totalPrice = remainingAmount.value
  // 退出编辑状态
  editCheckInDate.value = false;
  editCheckOutDate.value = false;
  editRoomNumber.value = false;
  editCustomerName.value = false;
  editPhoneNumber.value = false;
  console.log('更新之后的表单数据：',orderData.value)
  // 把表单数据发送给后端更新订单信息
  // 发送 POST 请求给后端更新订单信息
  axios.post('http://121.41.107.127:8088/hotel/updateBooking', orderData.value)
      .then(response => {
        // 处理成功响应
        console.log('订单更新成功', response.data);
      })
      .catch(error => {
        // 处理错误
        console.error('订单更新失败', error);
      });
};
onMounted(() => {
  formattedCountdown.value = formatTime(totalSeconds.value);
  // 设置定时器
  const interval = setInterval(() => {
    if (totalSeconds.value > 0) {
      totalSeconds.value--;
      formattedCountdown.value = formatTime(totalSeconds.value);
    } else {
      clearInterval(interval);
    }
  }, 1000);

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


