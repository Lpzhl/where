<template>
  <div>
    <el-menu
        :default-active="activeIndex"
        class="el-menu-demo"
        mode="horizontal"
        @select="handleSelect"
        background-color="transparent"
        text-color="red"
        active-text-color="green"
    >
      <el-menu-item index="1">
        全部订单
        <el-badge v-if="orderCounts.all > 0" :value="orderCounts.all" class="menu-badge" />
      </el-menu-item>
      <el-menu-item index="2">
        待支付
        <el-badge v-if="orderCounts.pendingPayment > 0" :value="orderCounts.pendingPayment" class="menu-badge" />
      </el-menu-item>
      <el-menu-item index="3">
        已过期
        <el-badge v-if="orderCounts.expired > 0" :value="orderCounts.expired" class="menu-badge" />
      </el-menu-item>
      <el-menu-item index="4">
        待评价
        <el-badge v-if="orderCounts.pendingReview > 0" :value="orderCounts.pendingReview" class="menu-badge" />
      </el-menu-item>
    </el-menu>

    <el-table :data="filteredOrderData">
      <el-table-column label="产品">
        <template #default="{ row }">
          <img :src="row.imageUrl" class="product-image" alt="产品图片" />
          <h4>{{ row.hotelName }}</h4>
        </template>
      </el-table-column>
      <el-table-column prop="totalPrice" label="订单金额"></el-table-column>
      <el-table-column prop="bookingId" label="订单编号"></el-table-column>
      <el-table-column prop="bookingStatus" label="订单状态">
        <template #default="{ row }">
          <span style="color: black;
    font-weight: bold;">{{ row.bookingStatus }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单操作">
        <template #default="{ row }">
          <el-button type="primary" @click="buy(row)">查看订单</el-button>
          <el-button type="primary" @click="contact(row)">联系客服</el-button>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>


<script setup>
import { ref, computed,onMounted } from 'vue'
import { useRouter } from 'vue-router';
import { ElMenu, ElMenuItem, ElBadge, ElTable, ElTableColumn } from 'element-plus'
import {useUserStore} from "../../stores/userStore";
import {getUserOrders} from "../../api/hotel"

const router = useRouter();

const userStore = useUserStore()

const userInfo = computed(() => userStore.userInfo)

console.log(userInfo.value.id)

const orderCounts = computed(() => {
  const counts = {
    all: allOrderData.value.length,
    pendingPayment: allOrderData.value.filter(order => order.bookingStatus === '待支付').length,
    expired: allOrderData.value.filter(order => order.bookingStatus === '已过期').length,
    pendingReview: allOrderData.value.filter(order => order.bookingStatus === '待评价').length,
  };
  return counts;
})

const activeIndex = ref('1')
const allOrderData = ref([
  { imageUrl: 'http://localhost:8088/resources/上海_云和夜泊酒店4.jpg',hotelName: '北京裕龙御骊酒店', totalPrice: '￥100.00', bookingId: 'A0001', bookingStatus: '待支付' },
  { imageUrl: 'http://localhost:8088/resources/上海_云和夜泊酒店4.jpg', hotelName: '和颐至尚酒店', totalPrice: '￥200.00', bookingId: 'A0002', bookingStatus: '已支付' },
  { imageUrl: 'http://localhost:8088/resources/上海_云和夜泊酒店4.jpg',hotelName: '北京京伦饭店', totalPrice: '￥300.00', bookingId: 'A0003', bookingStatus: '待评价' },
  { imageUrl: 'http://localhost:8088/resources/北京裕龙御骊酒店1.jpg',hotelName: '乐家服务式酒店', totalPrice: '￥400.00', bookingId: 'A0004', bookingStatus: '已过期' },
  { imageUrl: 'http://localhost:8088/resources/北京裕龙御骊酒店1.jpg', hotelName: '情趣酒店', totalPrice: '￥7700.00', bookingId: 'A0004', bookingStatus: '已过期'},
  { imageUrl: 'http://localhost:8088/resources/北京裕龙御骊酒店1.jpg',hotelName: '北京远航国际酒店', totalPrice: '￥600.00', bookingId: 'A0004', bookingStatus: '已过期' },
  { imageUrl: 'http://localhost:8088/resources/北京裕龙御骊酒店1.jpg',hotelName: '王府井永光酒店', totalPrice: '￥500.00', bookingId: 'A0004', bookingStatus: '已过期' },
])



const buy = (row) => {
  console.log('655',row);
  console.log(userInfo.value.id);
  router.push({
    name:'Orderdet',
    query:{
      orderData: JSON.stringify(row)
    }
  })
};

const contact = (row) => {
  console.log('联系客服', row);
  const bookingDataString = encodeURIComponent(JSON.stringify(row));
  const url = `http://localhost:5173/#/chat?booking=${bookingDataString}`;
  window.open(url, '_blank');
};


const filteredOrderData = computed(() => {
  // 这里可以添加逻辑来基于 activeIndex 过滤订单数据
  switch (activeIndex.value) {
    case '2':
      return allOrderData.value.filter(order => order.bookingStatus === '待支付')
    case '4':
      return allOrderData.value.filter(order => order.bookingStatus === '待评价')
    case '3':
      return allOrderData.value.filter(order => order.bookingStatus === '已过期')
    case '1':
    default:
      return allOrderData.value
  }
})

function handleSelect(index, indexPath) {
  activeIndex.value = index

}

// 当组件挂载后执行
onMounted(() => {
  // 检查用户信息是否存在，然后获取订单信息
  if (userInfo.value && userInfo.value.id) {
    getUserOrders(userInfo.value.id)
        .then(response => {
          console.log('Orders:', response.data.data);
          allOrderData.value = response.data.data;
        })
        .catch(error => {
          console.error('错误:', error);
        });
  }
});
</script>

<style scoped>
.el-menu-demo {
  border-bottom: 2px solid black;
}

.product-image {
  width: 500px;
  height: auto;
  margin-right: 10px;
  vertical-align: middle;
}
</style>
