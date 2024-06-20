<template>
  <div style="margin-top: 200px">
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="chart-container">
          <h3>单人间订单额</h3>
          <v-chart :option="singleRoomOptions" style="width: 100%; height: 400px;"></v-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-container">
          <h3>双人间订单额</h3>
          <v-chart :option="doubleRoomOptions" style="width: 100%; height: 400px;"></v-chart>
        </div>
      </el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <div class="chart-container">
          <h3>套房订单额</h3>
          <v-chart :option="suiteOptions" style="width: 100%; height: 400px;"></v-chart>
        </div>
      </el-col>
      <el-col :span="12">
        <div class="chart-container">
          <h3>豪华套房订单额</h3>
          <v-chart :option="luxurySuiteOptions" style="width: 100%; height: 400px;"></v-chart>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import * as echarts from 'echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import VChart from 'vue-echarts'

use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent
])

const singleRoomOptions = ref({
  title: {
    text: '单人间订单额',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
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
      data: [
        { value: 1048, name: '单人间' },
        { value: 735, name: '双人间' },
        { value: 580, name: '套房' },
        { value: 484, name: '豪华套房' },
        { value: 300, name: '总统套房' }
      ],
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

const doubleRoomOptions = ref({
  title: {
    text: '双人间订单额',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
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
      data: [
        { value: 1048, name: '单人间' },
        { value: 735, name: '双人间' },
        { value: 580, name: '套房' },
        { value: 484, name: '豪华套房' },
        { value: 300, name: '总统套房' }
      ],
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

const suiteOptions = ref({
  title: {
    text: '套房订单额',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
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
      data: [
        { value: 1048, name: '单人间' },
        { value: 735, name: '双人间' },
        { value: 580, name: '套房' },
        { value: 484, name: '豪华套房' },
        { value: 300, name: '总统套房' }
      ],
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

const luxurySuiteOptions = ref({
  title: {
    text: '豪华套房订单额',
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
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
      data: [
        { value: 1048, name: '单人间' },
        { value: 735, name: '双人间' },
        { value: 580, name: '套房' },
        { value: 484, name: '豪华套房' },
        { value: 300, name: '总统套房' }
      ],
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
</script>

<style scoped>
.chart-container {
  padding: 20px;
  border: 1px solid #ebebeb;
  border-radius: 4px;
  background-color: #fff;
}
</style>
