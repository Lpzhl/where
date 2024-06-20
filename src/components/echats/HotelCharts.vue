<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <div>
        <v-chart :option="lineChartOptions" style="width: 600px; height: 400px;"></v-chart>
      </div>
    </el-col>
    <el-col :span="12">
      <div>
        <v-chart :option="pieChartOptions" style="width: 600px; height: 400px;"></v-chart>
      </div>
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart, PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components'
import VChart from 'vue-echarts'
import 'element-plus/dist/index.css'
import { ElRow, ElCol } from 'element-plus'
import dayjs from 'dayjs'

use([
  CanvasRenderer,
  LineChart,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
])

const lineChartOptions = ref({
  title: {
    text: '按时间统计酒店订单额数据',
    top: 'bottom',
    left: 'center'
  },
  tooltip: {
    trigger: 'axis',
    formatter: params => {
      return params.map(param => {
        const { name, value, data } = param;
        return `
          <div>
            <strong>${param.seriesName}</strong><br/>
            日期: ${name}<br/>
            总销售金额: ${value}<br/>
            订单数量: ${data.saleNum}<br/>
            平均销售金额: ${data.avgSaleAmount}
          </div>
        `;
      }).join('');
    }
  },
  legend: {
    data: [],
    left: 'left'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: []
  },
  yAxis: {
    type: 'value'
  },
  series: []
})

const pieChartOptions = ref({
  title: {
    text: '酒店订单额占比',
    top: 'bottom',
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

const fetchHotelData = async () => {
  try {
    const response = await axios.get('http://121.41.107.127:8088/order/getOrderDetail')
    const data = response.data
    console.log(data)
    const groupedData = {}
    const totalAmountsByHotel = {}

    data.forEach(item => {
      const date = dayjs(item.paymentTime).format('YYYY-MM-DD')
      if (!groupedData[date]) {
        groupedData[date] = {}
      }
      if (!groupedData[date][item.hotelName]) {
        groupedData[date][item.hotelName] = {
          totalSaleAmount: 0,
          saleNum: 0,
          avgSaleAmount: 0
        }
      }
      groupedData[date][item.hotelName].totalSaleAmount += item.saleAmount
      groupedData[date][item.hotelName].saleNum += item.saleNum
      groupedData[date][item.hotelName].avgSaleAmount = groupedData[date][item.hotelName].totalSaleAmount / groupedData[date][item.hotelName].saleNum

      if (!totalAmountsByHotel[item.hotelName]) {
        totalAmountsByHotel[item.hotelName] = {
          totalSaleAmount: 0,
          saleNum: 0,
          avgSaleAmount: 0
        }
      }
      totalAmountsByHotel[item.hotelName].totalSaleAmount += item.saleAmount
      totalAmountsByHotel[item.hotelName].saleNum += item.saleNum
      totalAmountsByHotel[item.hotelName].avgSaleAmount = totalAmountsByHotel[item.hotelName].totalSaleAmount / totalAmountsByHotel[item.hotelName].saleNum
    })

    const dates = Object.keys(groupedData).sort()
    const hotelNames = Object.keys(totalAmountsByHotel)

    lineChartOptions.value.xAxis.data = dates
    lineChartOptions.value.legend.data = hotelNames
    lineChartOptions.value.series = hotelNames.map(hotelName => ({
      name: hotelName,
      type: 'line',
      data: dates.map(date => {
        const hotelData = groupedData[date][hotelName] || { totalSaleAmount: 0, saleNum: 0, avgSaleAmount: 0 }
        return {
          value: hotelData.totalSaleAmount,
          saleNum: hotelData.saleNum,
          avgSaleAmount: hotelData.avgSaleAmount
        }
      })
    }))

    pieChartOptions.value.series[0].data = hotelNames.map(hotelName => ({
      value: totalAmountsByHotel[hotelName].totalSaleAmount,
      name: hotelName,
      saleNum: totalAmountsByHotel[hotelName].saleNum,
      avgSaleAmount: totalAmountsByHotel[hotelName].avgSaleAmount
    }))
  } catch (error) {
    console.error('酒店数据获取失败:', error)
  }
}

onMounted(() => {
  fetchHotelData()
})
</script>
