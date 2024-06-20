<!--src/components/hote/HotelBooking.vue-->
<template>

  <div class="modal-content">
    <el-select v-model="selectedContact" placeholder="选择联系人" style="width: 100px">
      <el-option
          v-for="contact in contactPeople"
          :key="contact.contactId"
          :label="contact.name"
          :value="contact">
      </el-option>
    </el-select>

    <div v-if="errorMessage" class="error-message">
      {{ errorMessage }}
    </div>

    <form @submit.prevent="submitBooking">
      <div class="form-item">
        <h4>用户姓名</h4>
        <input v-model="bookingForm.customerName" type="text" placeholder="请输入用户姓名">
      </div>

      <div class="form-item">
        <h4>身份证</h4>
        <input v-model="bookingForm.identityCardNumber" type="text" placeholder="请输入身份证号码">
      </div>

      <div class="form-item">
        <h4>联系电话</h4>
        <input v-model="bookingForm.phoneNumber" type="text" placeholder="请输入联系电话">
      </div>

      <div class="form-item">
        <h4>入店日期</h4>
        <input v-model="bookingForm.checkInDate" type="date">
      </div>
      <div class="form-item">
        <h4>离店日期</h4>
        <input v-model="bookingForm.checkOutDate" type="date" >
      </div>
      <div class="form-item">
        <h4>适用人群</h4>
        <label>持中国身份证的居民，需持对应证件入住</label>
      </div>
      <div class="form-item1">
        <h4>房间数量</h4>
        <input v-model="bookingForm.roomNumber" type="number" placeholder="请输入房间数量" :min="1" > <label>剩余客房数量：</label><label>{{roomInfo.availableRooms }}</label>
      </div>

      <h4>总计:</h4>
      <p style="color: red;font-size: 20px">¥ {{ totalPrice }}</p>
      <button type="submit" class="submit-button">
        提交预订
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed,watch } from 'vue';
import { useRoute, useRouter} from 'vue-router';
import {submitBookingRequest,fetchContactPeople6,fetchHotel} from "../../api/hotel";

import { ElMessage } from 'element-plus';

import { useUserStore } from '../../stores/userStore';

const router = useRouter()

const errorMessage = ref('');  // 用于存储和显示错误信息
const userStore = useUserStore();


const contactPeople = ref([]);
const selectedContact = ref(null);

// 监听 selectedContact 的变化
watch(selectedContact, (newContact) => {
  if (newContact) {
    bookingForm.value.customerName = newContact.name;
    bookingForm.value.identityCardNumber = newContact.identityCardNumber;
    bookingForm.value.phoneNumber = newContact.phoneNumber;
  }
});

// 检查表单是否有效的计算属性
const isFormValid = computed(() => {
  return bookingForm.value.identityCardNumber &&
      bookingForm.value.customerName &&
      bookingForm.value.phoneNumber
});

// 访问用户信息和 token
const userInfo = userStore.userInfo;

console.log('userInfo',userInfo)

const token = userStore.token;
const roomInfo = ref({});
const hotel = ref({}); //酒店信息


const route = useRoute();
const showModal = ref(true);



const bookingForm = ref({
  userId:'',
  roomTypeId:'',
  hotelId:'',
  identityCardNumber: '',
  customerName: '',
  phoneNumber: '',
  hotelName:'',
  checkInDate: new Date().toISOString().split('T')[0],
  checkOutDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0],
  roomNumber:1,
  totalPrice:0,
  numberOfGuests:1,
  breakfast:'',
  bedtype:'',
  typeName:'',
  price:'',
});

const totalPrice = computed(() => {
  return bookingForm.value.roomNumber * roomInfo.value.discountprice;
});
onMounted(async () => {
  if(userInfo){
    const response = await fetchContactPeople6(userInfo.id);
    contactPeople.value = response.data
    console.log('contactPeople',contactPeople.value)
    if (route.query.room) {
      roomInfo.value = JSON.parse(route.query.room);
      const response1 = await fetchHotel(roomInfo.value.hotelId)
      bookingForm.value.hotelName = response1.data[0].name
      console.log('response1：',response1.data[0].name)
      console.log('roomInfo.value', roomInfo.value)
      bookingForm.value.userId = userInfo.id;
      bookingForm.value.hotelId = roomInfo.value.hotelId;
      bookingForm.value.roomTypeId = roomInfo.value.roomTypeId;
      console.log(bookingForm)
      console.log(roomInfo.value)
    }
  }else{
    window.location = "http://121.41.107.127:5173/#/login";
  }

});



onMounted(() => {
  if (route.query.room) {
    roomInfo.value = JSON.parse(route.query.room);
    bookingForm.value.Price = roomInfo.value.discountPrice;
    bookingForm.value.breakfast = roomInfo.value.breakfast;
    bookingForm.value.bedtype = roomInfo.value.bedtype;
    bookingForm.value.typeName = roomInfo.value.typeName;
    bookingForm.value.price = roomInfo.value.price;
  }

});

const submitBooking = async () => {
  if (!isFormValid.value) {
    ElMessage({
      message: '请填写所有必要的信息',
      type: 'error',
      duration: 1000,
    });
    return;
  }
  console.log('提交:', bookingForm.value);
  try {
    bookingForm.value.totalPrice = totalPrice.value;
    const response = await submitBookingRequest(bookingForm.value);
    console.log('预订结果:', response.data.data);
    ElMessage({
      message: response.data.message,
      type: 'success',
      duration: 1000,
    });
    if(response.data.message === '成功'){
      router.push({
        name: 'order',
        query: { bookingData: JSON.stringify(response.data.data) }
      });
    }
  } catch (error) {
    console.error('预订出错:', error);
    ElMessage({
      message: '预订出错，请稍后再试',
      type: 'error',
      duration: 1000,
    });
  }
};
</script>



<style scoped>
.container {
  padding: 20px;
}

.modal {
  display: block;
  position: fixed;
  z-index: 1;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.4);
}
.error-message {
  color: red;
  font-size: 20px;
}
.modal-content {
  background-color: #fefefe;
  margin: 15% auto;
  padding: 20px;
  border: 1px solid #888;
  width: 30%;
}

/*
.close {
  color: #aaa;
  float: right;
  font-size: 28px;
  font-weight: bold;
}

.close:hover,
.close:focus {
  color: black;
  text-decoration: none;
  cursor: pointer;
}
*/

.form-item {
  margin-bottom: 10px;
}
.form-item1 {
  margin-bottom: 10px;
  display: flex;
}

label {
  margin-bottom: 5px;
  display: block;
}

.submit-button {
  background-color: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.submit-button:hover {
  background-color: #45a049;
}
</style>
