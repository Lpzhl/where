<script setup>
import {ref} from 'vue'
import { ArrowDown } from '@element-plus/icons-vue'
const activeName = ref('first')

let selected = ref(null)
let selectedPrice = ref(null) // 星级价格的选中值
let selectedFilters = ref({}) // 高级筛选的选中值，以键值对的形式存储

let topfilterlist = ref([
  {id:1,name:'first',label:'热门筛选',list:['天安门广场','王府井','北京大家']},
  {id:2,name:'second',label:'机场车站',list:['北京南站','北京西站','北京火车站']},
  {id:3,name:'third',label:'商业区',list:['三里屯','国贸地区','西直门']},
  {id:4,name:'fourth',label:'景点',list:['什刹海','前门大街','五道口']}
])
let pricelist = ref(['五星(钻级)','四星(钻级)','三星(钻级)'])
let filterlist = ref([
  {title:'早餐', selected: '选择早餐', list:['含早餐','单份早餐','多份早餐']},
  {title:'支付方式', selected: '选择支付方式', list:['在线付款','到店付款','闪住']},
  {title:'房型', selected: '选择房型', list:['双床房','三床房','单人床房','大床房','特大床房']},
  {title:'酒店设施', selected: '选择酒店设施', list:['免费停车','室内游泳','单人床房','大床房','特大床房']},
]);


const toggleSelection = (item) => {
  if (selected.value === item) {
    selected.value = null // 如果点击已选中的项目，则取消选中
  } else {
    selected.value = item // 设置选中的项目
  }
}

// 选择星级价格
const selectPrice = (price) => {
  selectedPrice.value = price
}

const selectFilter = (filterTitle, option) => {
  selectedFilters.value = {...selectedFilters.value, [filterTitle]: option};
  const filter = filterlist.value.find(f => f.title === filterTitle);
  if (filter) {
    filter.selected = option; // 更新选中的筛选项
  }
};


</script>

<template>
 <div class="topfilter">
    <div>
      <h4>位置区域</h4>
    </div>
   <div class="topfilter-tab">
     <el-tabs v-model="activeName" class="demo-tabs">
       <el-tab-pane :label="v.label" :name="v.name" v-for="v in topfilterlist" :key="v.id">
         <el-button
             v-for="(k, i) in v.list"
             :key="i"
             size="small"
             type="info"
             plain
             :class="{ selected: selected===k}"
             @click="toggleSelection(k)">
           {{ k }}
         </el-button>
       </el-tab-pane>
     </el-tabs>
   </div>
    <div>
      <h4>星级价格</h4>
    </div>
   <div class="topfilter-price">
     <el-button
         size="small"
         type="info"
         plain
         v-for="(v,i) in pricelist"
         :key="i"
         :class="{ selected: selectedPrice === v}"
         @click="selectPrice(v)">
       {{v}}
     </el-button>
   </div>
    <div>
      <h4>高级筛选</h4>
    </div>
   <div class="topfilter-filter">
     <el-dropdown v-for="(v,i) in filterlist" :key="i">
      <span class="el-dropdown-link">
        {{ v.selected }}
        <el-icon class="el-icon--right">
          <arrow-down />
        </el-icon>
      </span>
       <template #dropdown>
         <el-dropdown-menu>
           <el-dropdown-item
               v-for="(k,i) in v.list"
               :key="i"
               :class="{ selected: selectedFilters[v.title] === k}"
               @click="selectFilter(v.title, k)">
             {{k}}
           </el-dropdown-item>
         </el-dropdown-menu>
       </template>
     </el-dropdown>
   </div>

  </div>

</template>

<style scoped>
.selected {
  background-color: blue;
  color: white;
}
</style>
