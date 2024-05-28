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

      <el-menu-item
          v-for="(orders, hotelId) in hotelOrders"
          :key="hotelId"
          :index="hotelId.toString()">
        {{ getHotelName(hotelId) }}
<!--        <el-badge v-if="orders.length>0" :value="orders.length" class="menu-badge" />-->
      </el-menu-item>

    </el-menu>

    <el-table :data="pagedOrderData">
      <el-table-column prop="bookingId" label="订单编号"></el-table-column>
      <el-table-column prop="totalPrice" label="订单金额"></el-table-column>
      <el-table-column prop="bookingStatus" label="订单状态"></el-table-column>
      <el-table-column label="订单操作">
        <template #default="{ row }">
          <el-button
              type="primary"
              @click="viewOrder(row)"
              v-if="row.bookingStatus === '待评价'">
            修改订单
          </el-button>
          <el-button
              type="primary"
              @click="viewOrder(row)"
              v-if="row.bookingStatus !== '待评价'">
            查看
          </el-button>

        </template>
      </el-table-column>
    </el-table>
    <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-size="pageSize"
        :total="totalOrders"

        layout="total, prev, pager, next, jumper"
    >
    </el-pagination>
  </div>

</template>
<script setup>
import {computed, onMounted, ref,watch} from 'vue';
import {useRouter} from 'vue-router';
import {getHotelIdByUserId, getHotelNameById} from '../../api/manger';
import {useUserStore} from "../../stores/userStore";

const router = useRouter();
const userStore = useUserStore();
const userInfo = computed(() => userStore.userInfo);
const activeIndex = ref('1');
const hotelOrders = ref({});

const viewOrder = (row) => {
  router.push({
    name: 'mangerOrderdet',
    query: {
      orderData: JSON.stringify(row)
    }
  });
};

const filteredOrderData = computed(() => {
  return hotelOrders.value[activeIndex.value] || [];
});

function handleSelect(index, indexPath) {
  activeIndex.value = index;
}

const hotelNames = ref({});

onMounted(async () => {
  const response = await getHotelIdByUserId(userInfo.value.id);
  if (response && response.data) {
    hotelOrders.value = response.data;
    await fetchAllHotelNames();
  }
});

const fetchAllHotelNames = async () => {
  const hotelIds = Object.keys(hotelOrders.value);
  await Promise.all(hotelIds.map(async (id) => {
    const name = await getHotelNameById(id);
    hotelNames.value[id] = name;
  }));
};

const getHotelName = (hotelId) => {
  return hotelNames.value[hotelId] || 'Loading...';
};
const currentPage = ref(1);
const pageSize = ref(10);
const totalOrders = computed(() => {
  const orders = hotelOrders.value[activeIndex.value] || [];
  console.log('Total Orders:', orders.length);
  return orders.length;
});

const pagedOrderData = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return (hotelOrders.value[activeIndex.value] || []).slice(startIndex, endIndex);
});

const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

watch(activeIndex, () => {

  currentPage.value = 1;
});
</script>
