<template>
  <div>
    <div class="image-container">
      <img src="../../assets/image/Hote/img_10.png" width="1535" style="z-index: -1">
    </div>
    <div class="info-table">
      <table>
        <tr>
          <td>目的地</td>
          <td>
            <input
                type="text"
                class="input-field"
                placeholder="输入目的地"
                ref="destinationInput"
            />
          </td>
        </tr>
        <tr>
          <td>入住日期</td>
          <td><input type="date" class="input-field" value="2023-11-03"></td>
          <td>离店日期</td>
          <td><input type="date" class="input-field" value="2023-11-03"></td>
        </tr>
        <tr>
          <td>关键词</td>
          <td><input type="text" class="input-field" placeholder="位置、酒店名、品牌"></td>
        </tr>
        <tr>
          <td><button class="search-button66">搜索</button></td>
        </tr>
      </table>
    </div>


    <div class="hotel-recommendation">
      <h3>酒店推荐</h3>
      <span>入住城市：</span>
      <span
          :class="{ highlighted: highlightedCity === null }"
          @click="highlightCity(null)"
          style=" cursor: pointer;"
      >
      全部
    </span>
      <span
          v-for="(city, index) in cities"
          :key="index"
          :class="{ highlighted: index === highlightedCity }"
          style="  cursor: pointer;"
          @click="highlightCity(index, city)"
      >
      {{ city }}
    </span>

      <br /><br />
      <span>酒店类别：</span>
      <span
          :class="{ highlighted: highlightedCategory === null }"
          style=" cursor: pointer;"
          @click="highlightCategory(null)"
      >
      全部
    </span>
      <span
          v-for="(category, index) in categories"
          :key="index"
          :class="{ highlighted: index === highlightedCategory }"
          style=" cursor: pointer;"
          @click="highlightCategory(index)"
      >
      {{ category }}
    </span>

      <h3 class="discounted-hotels">特惠酒店</h3>
      <div class="hotel-info">
        <table v-if="filteredHotelInfo.length" class="hotel-list">
          <tr>
      <span v-for="(hotel, index) in filteredHotelInfo">
        <td>
          <div class="hotel-item">
            <img :src="hotel.image" alt="Hotel Image" class="hotel-image" style="max-width: 300px; max-height: 300px;  border-radius: 10px;">
            <br>
            <span>
              {{ hotel.name }}
            </span>
            <br>
            <div>
            <span :class="{
              'red-text': hotel.rating > 4,
              'blue-text': hotel.rating >= 3 && hotel.rating <= 4,
              'black-text': hotel.rating < 3,
            }"  style="text-align: left">
              {{ hotel.rating }} 分 |
              <template v-if="hotel.rating > 4">
                超棒
              </template>
              <template v-else-if="hotel.rating >= 3 && hotel.rating <= 4">
                一般
              </template>
              <template v-else>
                普通
              </template>
            </span >
             <span  style="margin-left: 140px">¥99起</span>
              <!--              <e style="font-size: 10px">起</e>-->
            </div>

          </div>
        </td>
        <!-- 在每四个td后创建新的行 -->
        <br v-if="(index + 1) % 4 === 0">
      </span>
          </tr>
        </table>
        <div v-else class="empty-state">
          <p class="black-text bold-text center-text">空空如也</p>
        </div>
      </div>

      <h3 class="discounted-hotels">高星酒店</h3>

      <div class="hotel-info">
        <table v-if="filteredHotelInfo.length" class="hotel-list">
          <tr>
      <span v-for="(hotel, index) in filteredHotelInfo">
        <td>
          <div class="hotel-item">
            <img :src="hotel.image" alt="Hotel Image" class="hotel-image" style="max-width: 300px; max-height: 300px;  border-radius: 10px;">
            <br>
            <span>
              {{ hotel.name }}
            </span>
            <br>
            <span :class="{
              'red-text': hotel.rating > 4,
              'blue-text': hotel.rating >= 3 && hotel.rating <= 4,
              'black-text': hotel.rating < 3
            }">
              {{ hotel.rating }} 分
              <template v-if="hotel.rating > 4">
                超棒
              </template>
              <template v-else-if="hotel.rating >= 3 && hotel.rating <= 4">
                一般
              </template>
              <template v-else>
                普通
              </template>
            </span>
            <span style="margin-left: 140px">¥9999起</span>
          </div>
        </td>
        <!-- 在每四个td后创建新的行 -->
        <br v-if="(index + 1) % 4 === 0">
      </span>
          </tr>
        </table>
        <div v-else class="empty-state">
          <p class="black-text bold-text center-text">空空如也</p>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { ref,computed} from 'vue';

export default {
  setup() {
    const highlightedCity = ref(null); // 存储当前高亮的城市的索引
    const highlightedCategory = ref(null); // 存储当前高亮的酒店类别的索引

    const destinationInput = ref(null);

    const cities = ref(["北京", "上海", "广州", "深圳", "成都","厦门","长沙","呼和浩特","乌鲁木齐","三亚"]);
    const categories = ref(["如家", "七天酒店", "汉庭", "IU酒店","情侣酒店"]);
    const hotelInfoArray = ref([
      { name: '逆时光公寓(成都东站店)', rating: 4.2, image: 'src/assets/image/Hote/bed/img.png',Locations:'北京',type:'如家'},
      { name: '易斯特公寓(成都东站西广场店)', rating: 3.5, image: 'src/assets/image/Hote/bed/img_2.png',Locations:'上海',type:'七天酒店'},
      { name: '成都云玺·铂悦套房酒店公寓(春熙路店)', rating: 4.2, image: 'src/assets/image/Hote/bed/img_3.png',Locations:'深圳',type:'情侣酒店'},
      { name: '宜都酒店(成都神仙树店)', rating: 1.5, image: 'src/assets/image/Hote/bed/img_4.png',Locations:'长沙',type:'汉庭'},
      { name: '籽博酒店(春熙路太古里店)', rating: 4.2, image: 'src/assets/image/Hote/bed/img_5.png',Locations:'厦门',type:'汉庭'},
      { name: '如家酒店·neo(成都春熙路玉沙店)', rating: 4.5, image: 'src/assets/image/Hote/bed/img_6.png',Locations:'上海',type:'汉庭'},
      { name: '成都图奇公寓', rating: 3.2, image: 'src/assets/image/Hote/bed/img_7.png',Locations:'北京',type:'情侣酒店'},
      { name: '成都熙熙里套房公寓', rating: 4.2, image: 'src/assets/image/Hote/bed/img_8.png',Locations:'北京',type:'七天酒店'},


    ]);

    const toggleHighlight = (type, index) => {
      if (type === 'city') {
        highlightedCity.value = index;
      } else if (type === 'category') {
        highlightedCategory.value = index;
      }
    };

    const filteredHotelInfo = computed(() => {
      // 根据高亮的城市和酒店类型筛选酒店信息
      const selectedCity = highlightedCity.value;
      const selectedCategory = highlightedCategory.value;

      if (selectedCity === null && selectedCategory === null) {
        // 没有选择城市和酒店类型，返回所有酒店信息
        return hotelInfoArray.value;
      }

      return hotelInfoArray.value.filter((hotel) => {
        const cityMatch = selectedCity === null || cities.value[selectedCity] === hotel.Locations;
        const categoryMatch = selectedCategory === null || categories.value[selectedCategory] === hotel.type;
        return cityMatch && categoryMatch;
      });
    });

    const highlightCity = (index, city) => {
      if (index === null) {
        // 如果选择了“全部”，将输入框重置为空
        destinationInput.value.value = "";
      } else {
        console.log(city)
        // 否则，更新输入框的值为选择的城市
        destinationInput.value.value = city;
      }

      // 更新高亮的城市
      highlightedCity.value = index;
    };

    const highlightCategory = (index) => {
      toggleHighlight('category', index);
    };

    return {
      highlightedCity,
      highlightedCategory,
      cities,
      categories,
      hotelInfoArray,
      toggleHighlight,
      filteredHotelInfo,
      highlightCity,
      highlightCategory,
      destinationInput,
    };
  }
};
</script>





<style scoped>

.discounted-hotels {
  border-bottom: 2px solid blue; /* 添加下划线 */
}

.empty-state {
  border: 2px solid #000; /* 添加边框样式 */
  padding: 10px; /* 添加内边距 */
  text-align: center;
  width: 100%; /* 设置宽度以充满父容器 */
  box-sizing: border-box; /* 让边框包含在宽度内 */
}

.center-text {
  text-align: center;
}

.bold-text {
  font-weight: bold;
}

.black-text {
  color: black;
}



.red-text{
  color:red;
}
.blue-text{
  color:blue;
}

.hotel-image {
  max-width: 200px;
  max-height: 200px;
}

.hotel-recommendation span {
  margin-right: 10px;
}

.hotel-recommendation{
  margin-left: 170px;
}

/*.image-container {
  position: relative;
  display: inline-block;
}*/

.search-button66 {
  padding: 10px 20px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  font-weight: bold;
}

.search-button66:hover {
  background: #0056b3;
}

.info-table {
  position: absolute;
  top: 35%;
  left: 10%;
  transform: translate(0, -50%);
  background: white;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  z-index: 1;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}



td {
  padding:10px;
}

.input-field {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px 0;
}

input[type="date"] {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin: 5px 0;
}

.highlighted {
  padding: 5px 10px;
  background: yellow; /* 设置背景色为黄色 */
  border-radius: 10px; /* 设置圆角边框 */
  display: inline-block;
}



</style>

