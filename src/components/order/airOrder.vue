<template>
  <div class="flight-booking-container">
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="transparent"
        text-color="red"
        active-text-color="green"
    >
      <el-menu-item index="1">全部订单<el-badge :value="orderCounts.all" class="menu-badge" /></el-menu-item>
      <el-menu-item index="2">待支付<el-badge :value="orderCounts.pendingPayment" class="menu-badge" /></el-menu-item>
      <el-menu-item index="3">已过期<el-badge :value="orderCounts.expired" class="menu-badge" /></el-menu-item>
      <el-menu-item index="4">待评价<el-badge :value="orderCounts.pendingReview" class="menu-badge" /></el-menu-item>
    </el-menu>
    <el-table :data="filteredFlightData" style="width: 100%" border>
      <el-table-column label="航班信息">
        <template #default="{ row }">
          <div class="flight-info">
            <img src="https://file.40017.cn/appresource/image/pc/order/img_jp.jpg" class="flight-image">
            <div>
              <div class="flight-detail" style="  font-weight: bold; color: #000;">{{ row.departureAirport }} - {{ row.arrivalAirport }} ({{ row.flightNumber }})</div>
              <div class="flight-time">{{ formatTime(row.departureTime) }} - {{ formatTime(row.arrivalTime) }}</div>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column prop="bookingId" label="订单号"></el-table-column>
      <el-table-column prop="totalPrice" label="价格" :formatter="formatPrice"></el-table-column>
      <el-table-column prop="status" label="状态"></el-table-column>
      <el-table-column label="订单操作" width="180">
        <template #default="{ row }">
          <el-button type="primary" size="small" @click="viewOrder(row)">查看</el-button>
          <el-button
              v-if="shouldShowCancelButton(row)"
              type="danger"
              size="small"
              @click="cancelOrder(row)"
          >
            取消订单
          </el-button>
        </template>
      </el-table-column>
    </el-table>



  </div>
</template>

<script setup>
import { ref, computed ,onUnmounted,onBeforeMount} from 'vue'
import {ElMenu, ElMenuItem, ElBadge, ElTable, ElTableColumn, ElMessageBox, ElMessage} from 'element-plus'
import { useRoute ,useRouter} from 'vue-router'
import {useUserStore} from '../../stores/userStore'
import {cancelOrde, getAirBookingListsById} from "../../api/air";
const userStore = useUserStore();
const router = useRouter()
const userInfo = computed(()=>userStore.userInfo)

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

const route = useRoute()
const userId = computed(() => route.query.id)

console.log(userInfo.value)
const activeIndex = ref('1')
const allOrderData = ref([
  { imageUrl: 'http://localhost:8088/resources/上海_云和夜泊酒店4.jpg',hotelName: '北京裕龙御骊酒店', totalPrice: '￥100.00', bookingId: 'A0001', bookingStatus: '待支付' },
  { imageUrl: 'http://localhost:8088/resources/上海_云和夜泊酒店4.jpg', hotelName: '和颐至尚酒店', totalPrice: '￥200.00', bookingId: 'A0002', bookingStatus: '已支付' },
])
const shouldShowCancelButton = (row) =>{
  return row.status === '待支付';
}
const orderCounts = computed(() => {
  const counts = {
    all: AirBookingData .value.length,
    pendingPayment: AirBookingData .value.filter(order => order.status === '待支付').length,
    expired: AirBookingData .value.filter(order => order.status === '已过期').length,
    pendingReview: AirBookingData .value.filter(order => order.status === '待评价').length,
  };
  return counts;
})


const buy  = (row) =>{
  console.log(row)
}

const AirBookingData = ref([

    ]

)
const filteredFlightData = computed(() => {
  // 这里可以添加逻辑来基于 activeIndex 过滤订单数据
  switch (activeIndex.value) {
    case '2':
      return AirBookingData .value.filter(order => order.status === '待支付')
    case '4':
      return AirBookingData.value.filter(order => order.status === '待评价')
    case '3':
      return AirBookingData .value.filter(order => order.status === '已过期')
    case '1':
    default:
      return AirBookingData .value
  }
})

function handleSelect(index, indexPath) {
  activeIndex.value = index
}


//获取指定用户的所有机票订单
const AirBooking = async () => {
  console.log('666666666rfd',userInfo.value.id)
  const res = await getAirBookingListsById(userInfo.value.id);
  console.log('刷新数据', res);
  if (res) {
    AirBookingData.value = res.data;
  }
}

onBeforeMount(() => {
  AirBooking();
})
const viewOrder = (row) => {
  console.log(row)
  router.push({
    name:'airBookingDetail',
    query:{data:JSON.stringify(row)}
  })
}
const cancelOrder = async (row) => {
  console.log(row.bookingId);

  try {
    // 显示确认对话框
    await ElMessageBox.confirm('确定要取消这个订单吗？', '警告', {
      confirmButtonText: '确认',
      cancelButtonText: '取消',
      type: 'warning',
    });

    const response = await cancelOrde(row.bookingId);
    console.log(response);
    ElMessage.success('订单取消成功')
  } catch (error) {
    // 如果用户点击取消或者操作失败，这里会捕获到异常
    console.error("取消订单操作被取消或出错:", error);
  }
}

</script>

<style scoped>
.el-menu-demo {
  border-bottom: 2px solid black;
}

.flight-booking-container {
  margin: 20px;
}

.flight-info {
  display: flex;
  align-items: center;
}

.flight-image {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

.flight-detail, .flight-time {
  margin-bottom: 5px;
}

.el-table .cell {
  padding: 10px 0;
}

/* 响应式设计: 当屏幕宽度小于768px时 */
@media (max-width: 768px) {
  .flight-info {
    /* 在小屏幕上堆叠布局而不是行内布局 */
    flex-direction: column;
    align-items: flex-start;
  }

  .flight-image {
    /* 调整图片大小 */
    width: 40px;
    height: 40px;
  }

  .el-table .cell {
    /* 减少单元格内边距 */
    padding: 5px 0;
  }
}

/* 更小屏幕或手机 */
@media (max-width: 480px) {
  .flight-info {
    /* 在更小的屏幕上进一步调整布局 */
    flex-direction: column;
    align-items: flex-start;
  }

  .flight-detail, .flight-time {
    /* 减少字体大小 */
    font-size: 0.8em;
  }

  .el-table .cell {
    /* 进一步减少单元格内边距 */
    padding: 2px 0;
  }
}
</style>

