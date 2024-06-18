<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="24">
        <el-select v-model="selectedPeriod" placeholder="Select Time Period" @change="fetchChartData">
          <el-option label="近一周" value="1week"></el-option>
          <el-option label="近两周" value="2weeks"></el-option>
          <el-option label="近一个月" value="1month"></el-option>
          <el-option label="近三个月" value="3months"></el-option>
          <el-option label="近六个月" value="6months"></el-option>
          <el-option label="近一年" value="1year"></el-option>
        </el-select>
      </el-col>
    </el-row>
    <v-chart :options="chartOptions" autoresize></v-chart>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import 'element-plus/dist/index.css';
import { ElRow, ElCol, ElSelect, ElOption } from 'element-plus';

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent]);

const selectedPeriod = ref('1week');
const chartOptions = ref({});

const fetchChartData = async () => {
  try {
    const response = await axios.get(`http://localhost:8088/order/getFlightOrderDetail`);
    const data = response.data;
    chartOptions.value = {
      title: {
        text: '酒店入住人数及金额统计',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      legend: {
        bottom: '10%',
        left: 'center'
      },
      series: [
        {
          name: '入住统计',
          type: 'pie',
          radius: '50%',
          data: data.map(item => ({
            name: item.hotelName,
            value: item.saleNum
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        {
          name: '销售金额统计',
          type: 'pie',
          radius: '30%',
          center: ['50%', '70%'],
          data: data.map(item => ({
            name: item.hotelName,
            value: item.saleAmount
          })),
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    };
  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

onMounted(fetchChartData);
watch(selectedPeriod, fetchChartData);
</script>
