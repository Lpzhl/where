<!--Hote.vue-->
<template>
  <div>
    <div class="image-container">
      <img src="../../assets/image/Hote/img_10.png" width="1535" style="z-index: -1;height: 400px">
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
                v-model="destination"
                @focus="showCities = true"
            />
          </td>
        </tr>
        <tr>
          <td>入住日期</td>
          <td><input type="date" class="input-field" v-model="checkInDate"></td>
          <td>离店日期</td>
          <td><input type="date" class="input-field" v-model="checkOutDate"></td>
        </tr>
        <tr>
          <td>关键词</td>
          <td><input type="text" class="input-field" placeholder="位置、酒店名、品牌" v-model="keyword"></td>
        </tr>
        <tr>
          <button class="search-button66" @click="showIndexPage1">搜索</button>
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

<script setup>
import { ref,computed} from 'vue';
import { useRouter } from 'vue-router';

  const router = useRouter();


const destination = ref('北京');
const currentDate = ref(new Date())
const checkInDate = ref(new Date().toISOString().split('T')[0]);
const checkOutDate = ref(new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0]);
const keyword = ref('');

const showIndexPage1 = () => {
  console.log('destination',destination.value)
  console.log('checkInDate',checkInDate.value)
  console.log('checkOutDate',checkOutDate.value)
  console.log('keyword',keyword.value)
  router.push({
    name: 'index',
    query: {
        destination: destination.value,
        checkInDate: checkInDate.value,
        checkOutDate: checkOutDate.value,
        keyword: keyword.value,
      }
  });
};


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
        destinationInput.value = "";
      } else {
        console.log(city)
        // 否则，更新输入框的值为选择的城市
        destinationInput.value = city;
      }

      // 更新高亮的城市
      highlightedCity.value = index;
    };

    const highlightCategory = (index) => {
      toggleHighlight('category', index);
    };
    const cityData = ref({
      hot:['北京','上海','广州','深圳' ,'成都' ,'杭州', '武汉' ,'西安', '重庆'
        ,'青岛','长沙','南京','厦门','昆明','大连','天津','郑州','三亚','济南','福州'],
      ABCDEF:{
        A:['阿勒泰','阿克苏','鞍山','安庆','安顺','阿拉善左','中国澳门','阿里','阿拉善右','阿尔山'],
        B:['巴中','百色','包头','毕节','北海','北京','博乐','保山','白城','布尔津','白山','巴彦淖尔'],
        C:['昌都','承德','常德','长春','朝阳','赤峰','长治','重庆','长沙','成都','沧源','常州','池州'],
        D:['大同','达州','稻城','丹东','迪庆','大连','大理','敦煌','东营','大庆','德令哈'],
        E:['鄂尔多斯','额济纳旗','恩施','二连浩特'],
        F:['福州','阜阳','抚远','富蕴','佛山']
      },
      GHIJ:{
        G:['广州','果洛','格尔木','广元','固原','中国高雄','赣州','贵阳','桂林'],
        H:['红原','海口','河池','邯郸','黑河','呼和浩特','合肥','杭州','淮安','怀化','海拉尔','哈密','衡阳','哈尔滨','和田','花土沟','中国花莲','霍林郭勒','惠州','汉中','黄山','呼伦贝尔','菏泽'],
        J:['中国嘉义','景德镇','加格达奇','嘉峪关','井冈山','金昌','九江','荆门','佳木斯','济宁','锦州','建三江','鸡西','九寨沟','中国金门','揭阳','济南','荆州'],
      },
      KLMN:{
        K:['库车','康定','喀什','凯里','昆明','库尔勒','克拉玛依'],
        L:['黎平','澜沧','龙岩','临汾','兰州','丽江','荔波','吕梁','临沧','陇南','六盘水','拉萨','洛阳','连云港','临沂','柳州','泸州','林芝'],
        M:['芒市','牡丹江','中国马祖','绵阳','梅州','中国马公','满洲里','漠河'],
        N:['南昌','中国南竿','南充','宁波','南京','宁蒗','南宁','南阳','南通'],
      },
      PQRSTUVW:{
        P:['攀枝花','普洱'],
        Q:['琼海','秦皇岛','祁连','且末','庆阳','黔江','泉州','衢州','齐齐哈尔','青岛'],
        R:['日照','日喀则','若羌'],
        S:['神农架','莎车','上海','沈阳','石河子','石家庄','上饶','三明','三亚','深圳','十堰','邵阳','松原'],
        T:['台州','中国台中','塔城','腾冲','铜仁','通辽','天水','吐鲁番','通化','中国台南','中国台北','天津','中国台东','唐山','太原'],
        W:['五大连池','乌兰浩特','乌兰察布','乌鲁木齐','潍坊','威海','文山','温州','乌海','武汉','武夷山','无锡','梧州','万州','乌拉特中','巫山','武隆','芜湖'],
      },
      XYZ:{
        X:['兴义','夏河','中国香港','西双版纳','新源','西安','忻州','信阳','襄阳','西昌','锡林浩特','厦门','西宁','徐州'],
        Y:['延安','银川','伊春','永州','榆林','宜宾','运城','宜春','宜昌','伊宁','义乌','营口','延吉','烟台','盐城','扬州','玉树玉','林岳阳','永州'],
        Z:['郑州','张家界','舟山','扎兰屯','张掖','昭通','湛江','中卫','张家口','珠海','遵义']
      }
    });

    const selectedCity = ref('');
    const showCities = ref(false);
    const currentCategory = ref('hot');
    const currentCities = computed(() => {
      if (currentCategory.value.length === 1) {
        return cityData.value[currentCategory.value];
      } else {
        return Object.values(cityData.value[currentCategory.value]).flat();
      }
    });

    function selectCategory(category) {
      currentCategory.value = category;
      // 调整当前城市列表显示逻辑
      currentCities.value = Object.values(cityData.value[category]).flat();
    }

    function selectCity(city) {
      destinationInput.value = city;
      showCities.value = false;
    }
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
  top: 30%;
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

.city-list {
  display: flex;
  flex-wrap: wrap;
  max-width: 370px;
}
.city-list button {
  flex: 0 0 calc(100%/6 - 10px); /* 设置按钮占据行宽的六分之一，减去间隔 */
  margin-bottom: 10px; /* 为按钮底部添加间隔 */

}
.cities-dropdown {
  position: absolute;
  z-index: 10;
  background-color: white;
  border: 1px solid #ddd;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.menu-bar button {
  background: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.menu-bar button.active {
  color: #f00; /* 激活状态的颜色 */
  border-bottom: 2px solid #f00; /* 下划线表示活动状态 */
}
.city-list button {
  display: block;
  padding: 5px 10px;
  text-align: left;
  background: none;
  border: none;
  width: 100%;
  cursor: pointer;
}

.city-list button:hover {
  background-color: #f0f0f0;
}

</style>

