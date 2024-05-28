<template>
  <div id="app">

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>
    <div class="countdown">
      <span v-if="isExpired">订单已过期</span>
      <span v-else>建议您在 {{ formattedCountdown }} 内完成付款，过期订单会自动取消哦</span>
    </div>

    <div v-if="bookingData" class="order-details">
      <div class="hotel-name">
        {{ bookingData.hotelName }}
        <span class="price">需支付：¥{{ bookingData.totalPrice }}</span>
      </div>

      <div class="room-details">
        {{ bookingData.hotelName }}------订单号：{{bookingData.bookingId}}
        <br>
        大床房A 1间
        <br>
        {{ formatDate(bookingData.checkInDate) }} ----- {{ formatDate(bookingData.checkOutDate) }}
      </div>

      <button class="confirm-button" @click="buy" :disabled="isExpired" >
        确认支付(还需支付¥{{ bookingData.totalPrice }})
      </button>

      <button class="confirm-button" @click="off" :disabled="isExpired">
        取消订单
      </button>
    </div>
  </div>
</template>


<script setup>

import { ref, onMounted, onUnmounted ,watch} from 'vue';
import { useRoute,useRouter } from 'vue-router';


const errorMessage = ref('');

import { ElMessage } from 'element-plus';

import {fetchOrderInfo ,handleExpiredBooking,offOrder} from '../../api/hotel'
const isExpired = ref(false);

const route = useRoute();
const bookingData = ref(null);
const bookingData1 = ref(null);
const totalSeconds = ref();
const formattedCountdown = ref('');

const router = useRouter()

// 解析从查询参数传来的数据
const updateBookingData = async () => {
  console.log('65656', route.query.bookingData)
  const data1 = route.query.bookingData;
  bookingData1.value = JSON.parse(data1);
  console.log('bookingData1',bookingData1.value)
  if (data1) {
    console.log("预定的id：",bookingData1.value.booking.bookingId)
    // 发送请求到后端获取订单信息和剩余时间
    const data = await fetchOrderInfo(bookingData1.value.booking.bookingId);
    console.log('RedisData',data.data)
    bookingData1.value = data.data;
    console.log('bookingData1.value',bookingData1.value)
   bookingData.value = bookingData1.value.booking;
   totalSeconds.value = Math.floor(bookingData1.value.remainingTime / 1000);
  }
};

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' };
  return new Date(dateString).toLocaleDateString('zh-CN', options);
}


let webSocket = null;

// 初始化WebSocket连接
const initWebSocket = () => {
  webSocket = new WebSocket('ws://localhost:8088/websocket');

  webSocket.onopen = function() {
    console.log('WebSocket Connected');
  };

  webSocket.onmessage = function(event) {
    const message = event.data;
    if (message.includes("支付成功")) {
      clearInterval(interval);
      isExpired.value = false;
      ElMessage({
        message: '支付成功',
        type: 'success',
        duration: 1000,
      });
    }
  };

  webSocket.onerror = function(error) {
    console.error('WebSocket Error:', error);
  };

  webSocket.onclose = function() {
    console.log('WebSocket Connection Closed');
  };
};

//支付
const buy = () => {
  /*setTimeout(() => {*/
  const orderType = 'hotel'; // 'hotel' 或 'flight'
    window.open(`http://localhost:8088/alipay/pay?orderName=${bookingData.value.hotelName}&orderId=${bookingData.value.bookingId}&totalPrice=${bookingData.value.totalPrice}&orderType=${orderType}`);
    window.close()
/*  }, 2000);*/
};

//取消订单
const off = async () => {
  try {
    const response = await offOrder(bookingData.value.bookingId);
    ElMessage({
      message: '订单已取消',
      type: 'success',
      duration: 1000,
    });
    // 在消息显示后关闭窗口
    setTimeout(() => {
      window.close();
    }, 1000);
  } catch (error) {
    console.error("取消订单出错:", error);

  }
};



async function processExpiredBooking() {
  try {

    const bookingId = bookingData.value.bookingId;
    await handleExpiredBooking(bookingId);
    console.log("订单已过期处理");
    // 在这里处理订单过期后的逻辑
  } catch (error) {
    console.error("处理订单过期出错:", error);
  }
}

onMounted(updateBookingData);

// 监听路由变化
watch(route, (newRoute) => {
  updateBookingData();
});



// 格式化时间显示
function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}分${remainingSeconds.toString().padStart(2, '0')}秒`;
}

let interval;

onMounted(() => {
  formattedCountdown.value = formatTime(totalSeconds.value);
  // 设置定时器
  const interval = setInterval(() => {
    if (totalSeconds.value > 0) {
      totalSeconds.value--;
      formattedCountdown.value = formatTime(totalSeconds.value);
    } else {
      clearInterval(interval); // 停止计时器
      isExpired.value = true; // 设置订单为已过期
      processExpiredBooking();
    }
  }, 1000);

});

onMounted(() => {
  updateBookingData();
  initWebSocket(); // 初始化WebSocket连接
});

onUnmounted(() => {
  clearInterval(interval);
  if (webSocket !== null) {
    webSocket.close();
  }
});
</script>

<style scoped>
#app{
  margin-top: 120px;
}
.countdown {
  background-color: #f2f2f2;
  padding: 10px;
  text-align: center;
}

.order-details {
  margin: 20px;
}

.hotel-name {
  font-size: 25px;
  font-weight: bold;
}

.price {
  float: right;
  color: red;
}

.room-details {
  margin-top: 10px; /* 在div的顶部添加间隔 */
}


.confirm-button {
  width: 100%;
  padding: 10px;
  background-color: blue;
  color: white;
  border: none;
  cursor: pointer;
  margin-top: 30px
}

</style>