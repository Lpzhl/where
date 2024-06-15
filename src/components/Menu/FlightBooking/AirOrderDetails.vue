<template>
  <div class="order-container">
    <el-card class="info-card">
      <h3>订单信息</h3>
      <p>订单号: OTGBLCBWH100XJ502189</p>
      <p style="color: red;font-weight: bold;font-size: 20px">支付金额: ¥{{ orderDetails.totalPrice }}</p>
      <p>预订时间: {{ formatDate(orderDetails.bookingDate)}}</p>
    </el-card>

    <el-card class="flight-card">
      <h3>{{ flightDetails.departCity }} - {{flightDetails.arrivaCity}}</h3>
      <p>{{ formatDate2(orderDetails.departureTime) }}</p>
      <p>{{ flightDetails.airline }} {{ orderDetails.flightNumber }} {{ flightDetails.aircraft }}</p>
      <p>{{ formatDate1(orderDetails.departureTime) }} {{ orderDetails.departureAirport }} - {{ formatDate1(orderDetails.arrivalTime) }} {{ orderDetails.arrivalAirport }}</p>
    </el-card>

    <el-card>
    <el-table :data="passengerTableData" style="width: 100%">
      <el-table-column prop="name" label="姓名"></el-table-column>
      <el-table-column prop="identityCard" label="身份证"></el-table-column>
      <el-table-column prop="phone" label="电话号码"></el-table-column>
    </el-table>
    </el-card>

    <div class="contact-info">
      <el-card class="info-card">
      <h3>联系人</h3>
      <p>姓名: {{ contactDetails.name }}</p>
      <p>手机号码: {{ contactDetails.phone }}</p>
      </el-card>
    </div>
    <el-button v-if=" orderDetails.status === '待支付'" type="primary" @click="proceedToPayment">去支付</el-button>
    <el-button v-else-if=" orderDetails.status === '待评价'" type="primary" @click="leaveReview">评价</el-button>
    <el-button v-else-if=" orderDetails.status === '已过期'" type="primary" @click="rebook">再次预定</el-button>
  </div>
</template>

<script setup>
import { ref,onBeforeMount} from 'vue';
import {useRouter,useRoute} from "vue-router";
import {fetchContactPeople6} from "../../../api/hotel";
import {getb} from "../../../api/air";

const route = useRoute()


// 模拟订单详情数据
const orderDetails = ref({
  orderNumber: 'OTGBLCBWH100XJ502189',
  amount: 1080,
  bookingTime: '2023-12-23 21:08:34'
});
const formatDate2 = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day} ${hour}:${minute}`;
};
const formatDate1 = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${hour}:${minute}`;
};

// 模拟航班详情数据
const flightDetails = ref({
  airline:'',
  aircraft:'',
  departCity:'',
  arrivaCity:''
});
// 模拟乘机人表格数据
const passengerTableData = ref([

]);

const leaveReview =() =>{
  console.log('取消订单',orderDetails.value.bookingId)
}

const proceedToPayment =() =>{
  const orderType = 'flight'; // 'hotel' 或 'flight'
  window.open(`http://localhost:8088/alipay/pay?orderName=${orderDetails.value.arrivalAirport}&orderId=${orderDetails.value.bookingId}&totalPrice=${orderDetails.value.totalPrice}&orderType=${orderType}`);
}
const update = async () => {
  const response = await getb(orderDetails.value.flightId,orderDetails.value.bookingId);
  console.log(response)
  flightDetails.value.airline = response.airline.name
  flightDetails.value.aircraft = response.aircrafts.model
  flightDetails.value.departCity = response.departureAirport.city
  flightDetails.value.arrivaCity = response.arrivalAirport.city
  contactDetails.value.name = response.passengersList[0].name
  contactDetails.value.phone = response.passengersList[0].phoneNumber
  response.passengersList.forEach(passenger => {
    passengerTableData.value.push({
      passengerId: passenger.passengerId,
      bookingId: passenger.bookingId,
      userId: passenger.userId,
      name: passenger.name,
      identityCard: passenger.identityCardNumber,
      phone:passenger.phoneNumber
    });
  });
}


// 模拟联系人信息数据
const contactDetails = ref({
  name: '',
  phone: ''
});

onBeforeMount(()=>{
  const re = JSON.parse(route.query.data)

  if(re){
    console.log(re)
    orderDetails.value = re
  }
  update()
})
</script>

<style scoped>
.order-container {
  padding: 20px;
  background-color: #fff;
  border-radius: 4px;
  margin: 20px auto;
  max-width: 800px;
  margin-top: 150px;
}

.order-header h3, .flight-detail h3, .passenger-info h3, .contact-info h3 {
  margin-bottom: 10px;
  color: #333;
}

.order-header p, .flight-detail p, .passenger-info p, .contact-info p {
  margin-bottom: 5px;
}

.order-header strong {
  color: #f56c6c;
}

.flight-detail .el-tag {
  margin-right: 10px;
}

.contact-info h3 {
  margin-top: 20px;
  font-size: 20px;
  color: #333;
}

.contact-info p {
  font-size: 16px;
  color: #666;
}
</style>
