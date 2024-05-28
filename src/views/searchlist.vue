<!--searchlist.vue-->
<template>
    <div class="searchlist">
        <div class="searchlist-item">
            <div class="search-box">
                <label for="hotels-destination">目的地/酒店名称</label>
                <input type="text" id="hotels-destination" placeholder="北京" v-model="destination">
            </div>
        </div>
        <div class="searchlist-item">
            <div class="search-box">
                <label>入住时间/退房时间</label>
                <el-date-picker
                    v-model="dateRange"
                    type="daterange"
                    start-placeholder="入住"
                    end-placeholder="离店"
                    :default-time="defaultTime1"
                    />
            </div>
        </div>
        <div class="searchlist-item">
             <div class="search-box">
                <label for="room-guest">房间及住客</label>
                <input type="text" id="room-guest" placeholder="1间/1位">
            </div>
        </div>
        <div class="searchlist-item">
             <div class="search-box">
                <label for="keyword">关健词（选填）</label>
                <input type="text" id="keyword" placeholder="火车/酒店名称或区域" v-model="keyword">
            </div>
        </div>
        <div class="searchlist-item">
            <el-button type="primary" :icon="Search"></el-button>
        </div>
    </div>

</template>

<script setup>
import {ref, watch} from 'vue'
import {Search} from '@element-plus/icons-vue'
import { searchHotels } from '../api/hotel.js';

const props = defineProps({
  formData: Object
});

const destination = ref('')
const dateRange = ref('')
const keyword = ref('')

console.log('props.formData',props.formData)

watch(() => props.formData, (newVal) => {
  destination.value = newVal.destination || '';
  dateRange.value = [newVal.checkInDate || '', newVal.checkOutDate || ''];
  keyword.value = newVal.keyword || '';

  // 调用函数发送请求
  console.log('newVal',newVal)
  searchHotels(newVal);
}, { immediate: true });

</script>


<style scoped>

</style>
