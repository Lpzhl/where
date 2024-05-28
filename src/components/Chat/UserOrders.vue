<template>
  <el-table :data="pagedOrders">
    <el-table-column prop="bookingId" label="订单ID"></el-table-column>
    <el-table-column prop="hotelName" label="产品名称"></el-table-column>
    <el-table-column prop="paymentTime" label="数量"></el-table-column>
    <el-table-column prop="totalPrice" label="价格"></el-table-column>
  </el-table>

  <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="currentPage"
      :page-sizes="[6, 12, 18, 24]"
      :page-size="pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="orders.length">
  </el-pagination>
</template>


<script setup>
import { ref, onBeforeMount, computed } from 'vue';
import { useUserStore } from '../../stores/userStore';
import { getAllBookings } from "../../api/hotel";

const userStore = useUserStore();
const userInfo = userStore.userInfo;
const hotelId = ref(0); // 假定初始值

const props = defineProps({
  hotelId: Number
});

const orders = ref([]);
const currentPage = ref(1);
const pageSize = ref(6);

const loadOrders = async () => {
  const response = await getAllBookings(userInfo.id, props.hotelId);
  orders.value = response.data; // 假设后端返回了整个订单列表
};

const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return orders.value.slice(start, end);
});

onBeforeMount(loadOrders);

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 重置到第一页
};
</script>

<style scoped>
/* 添加您的样式 */
</style>

<style scoped>
/* 添加您的样式 */
</style>
