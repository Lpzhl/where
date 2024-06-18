<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <div>
        <v-chart :option="hotelChartOptions" style="width: 600px; height: 400px;"></v-chart>
      </div>
    </el-col>
    <el-col :span="12">
      <div>
        <v-chart :option="flightChartOptions" style="width: 600px; height: 400px;"></v-chart>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import 'element-plus/dist/index.css'
import { ElRow, ElCol } from 'element-plus'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

const hotelChartOptions = ref({
  title: {
    text: '酒店订单额数据',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: params => {
      const { name, value, data } = params;
      return `
        <div>
          <strong>${name}</strong><br/>
          总销售金额: ${value}<br/>
          订单数量: ${data.saleNum}<br/>
          平均销售金额: ${data.avgSaleAmount}
        </div>
      `;
    }
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '订单额',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

const flightChartOptions = ref({
  title: {
    text: '机票订单额数据',
    left: 'center'
  },
  tooltip: {
    trigger: 'item',
    formatter: params => {
      const { name, value, data } = params;
      return `
        <div>
          <strong>${name}</strong><br/>
          航班次数: ${data.flightCount}<br/>
          总价钱: ${value}<br/>
          平均票价: ${data.flightAveragePrice}
        </div>
      `;
    }
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '订单额',
      type: 'pie',
      radius: '50%',
      data: [],
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      }
    }
  ]
})

const fetchHotelData = async () => {
  try {
    const response = await axios.get('http://localhost:8088/order/getOrderDetail')
    const data = response.data.map(item => ({
      value: item.saleAmount,
      name: item.hotelName,
      saleNum: item.saleNum,
      avgSaleAmount: item.avgSaleAmount
    }))
    hotelChartOptions.value.series[0].data = data
  } catch (error) {
    console.error('酒店数据获取失败:', error)
  }
}

const fetchFlightData = async () => {
  try {
    const response = await axios.get('http://localhost:8088/order/getFlightOrderDetail')
    const data = response.data.map(item => ({
      value: item.flightTotalPrice,
      name: item.flightCompany,
      flightCount: item.flightCount,
      flightAveragePrice: item.flightAveragePrice
    }))
    flightChartOptions.value.series[0].data = data
  } catch (error) {
    console.error('机票数据获取失败:', error)
  }
}

onMounted(() => {
  fetchHotelData()
  fetchFlightData()
})
</script>

