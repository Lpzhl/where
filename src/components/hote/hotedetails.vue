<template>
  <div class="container">
    <div class="ttt">
      <div class="gallery">
        <h2>{{ hotelInfo.name }}</h2>
        <el-carousel :initial-index="0">
          <el-carousel-item v-for="image in hotelInfo.images" :key="image">
            <el-image :src="image.imageUrl" fit="contain"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="hotel-info">
<!--        <h4>装修时间：2018年07月</h4><br>
        <h4>开业时间：2018年04月</h4>-->
        <ul>
          <li>免费WIFI</li>
          <li>餐厅</li>
          <li>健身房</li>
          <li>游泳池</li>
          <li>接机服务</li>
          <li>会议室</li>
          <li>行李寄存</li>
        </ul>
      </div>
    </div>
  </div>

  <el-container>
    <el-header>
      <!-- 菜单栏 -->
      <el-tabs v-model="activeTab" style=" display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */">
        <el-tab-pane label="房型" name="rooms"></el-tab-pane>
        <el-tab-pane label="酒店信息" name="info"></el-tab-pane>
        <el-tab-pane label="交通" name="transport"></el-tab-pane>
        <el-tab-pane label="点评" name="reviews"></el-tab-pane>
      </el-tabs>
    </el-header>
    <el-main>
      <!-- 条件选择 -->
      <div v-if="activeTab === 'rooms'">
        <el-checkbox-group v-model="selectedConditions.bedtype">
          <el-checkbox label="大床">大床</el-checkbox>
          <el-checkbox label="双床">双床</el-checkbox>
          <el-checkbox label="单人床">单人床</el-checkbox>
        </el-checkbox-group>
        <el-checkbox-group v-model="selectedConditions.breakfast">
          <el-checkbox label="含早餐">含早餐</el-checkbox>
          <el-checkbox label="不含早餐">不含早餐</el-checkbox>
        </el-checkbox-group>
      </div>
      <!-- 房间信息 -->
      <el-table v-if="activeTab === 'rooms'" :data="filteredRooms" style="width: 100%">
        <el-table-column
            type="expand"
            label="详情"
        >
          <template #default="{ row }">

            <div v-for="(line, index) in row.description.split('\n')" :key="index" class="description-line">
              {{ line }}
            </div>

            <div class="image-hover-zoom">
              <el-image
                  v-for="imgObj in row.images"
                  :key="imgObj.imageId"
                  :src="imgObj.imageUrl"
                  style="width: 100px; height: 60px; margin-right: 10px"
                  fit="cover"
              />
            </div>

          </template>
        </el-table-column>

        <el-table-column property="image" label="图片">
          <template #default="{ row }">
            <el-image style="width: 100px; height: 60px" :src="row.images[0].imageUrl" fit="cover"></el-image>
          </template>
        </el-table-column>
        <el-table-column property="name" label="房型"></el-table-column>
        <el-table-column property="bedtype" label="床型"></el-table-column>
        <el-table-column property="breakfast" label="早餐"></el-table-column>
        <el-table-column property="discountprice" label="日均价">
          <template #default="{ row }">
            <el-tag type="danger">￥{{ row.discountprice }}</el-tag>
            <del>￥{{ row.originalprice }}</del>
          </template>
        </el-table-column>
        <el-table-column property="remainingRooms" label="剩余房间">
          <template #default="{ row }">
            {{ row.availableRooms }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="{ row }">
            <el-button v-if="row.availableRooms > 0" type="primary" @click="bookRoom(row)">预定</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 酒店信息 -->
      <div v-if="activeTab === 'info'" class="hotel-details">
          <div v-for="(line, index) in info.info.split('\n')" :key="index" class="description-line">

          {{ line }}
          </div>
      </div>

      <!-- 点评部分 -->
      <div v-if="activeTab === 'reviews'">
        <div v-for="review in reviews" :key="review.review.reviewId" class="review-item">
          <div class="review-header">
            <!-- 用户信息 -->
            <div class="user-info">
              <el-avatar :src="review.user.avatar"></el-avatar>
              <div class="user-details">
                <div class="user-name">{{ review.user.nickname }}</div>
                <div class="review-date">{{ formatDate(review.review.reviewDate) }}</div>
              </div>
            </div>
            <!-- 回复按钮 -->
            <button v-if="isReview === userInfo.id" class="reply-button" @click="showReplyInput(review.review.reviewId)">
              回复
            </button>
          </div>

          <!-- 评论内容 -->
          <div class="review-content">
            <p>{{ review.review.comment }}</p>
            <div v-if="review.imageUrls && review.imageUrls.length" class="review-images">
              <el-image
                  v-for="imageUrls in review.imageUrls"
                  :key="imageUrls"
                  :src="imageUrls"
                  class="review-image"
                  style="width: 150px; height: 200px; margin-right: 10px; cursor: pointer;"
                  fit="cover"
                  @click="openModal(imageUrls)"
              />
            </div>
          </div>
          <!-- 回复输入框 -->
          <div v-if="replyInputVisible[review.review.reviewId]" class="reply-input">
            <textarea v-model="replyContent[review.review.reviewId]" placeholder="输入回复..."></textarea>
            <button @click="submitReply(review.review.reviewId)">发送</button>
          </div>
          <!-- 显示二级评论（回复） -->
          <div v-if="review.childReviews && review.childReviews.length">
            <div v-for="reply in review.childReviews" :key="reply.id"  class="secondary-comments" >
              <!-- 显示回复内容 -->
              <p>酒店回复：{{ reply}}</p>
            </div>
          </div>
        </div>

      </div>


      <!-- 其他信息根据 activeTab 的值来决定显示 -->
    </el-main>
  </el-container>
  <!-- 图片模态窗口 -->
  <el-dialog :visible.sync="dialogVisible">
    <img :src="selectedImageUrl" style="width: 100%;" />
  </el-dialog>
</template>

<script setup>
import { ref ,computed,onMounted,reactive} from 'vue';
import { useRouter,useRoute} from 'vue-router';
import {getHotelById } from "../../api/hotel";
import {fetchReply, fetchReviews} from "../../api/review";
import {useUserStore} from "../../stores/userStore"

// 评论数组
const reviews = ref([
  {
    review: {
      reviewId: 1,
      comment: "非常好的酒店体验！",
    },
    user: {

    },
    childReviews: [],
  },
]);

const userStore = useUserStore()
let isReview = null;
let hotelId6 = null;
const userInfo = computed(()=>userStore.userInfo)
const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hour = date.getHours().toString().padStart(2, '0');
  const minute = date.getMinutes().toString().padStart(2, '0');
  return `${year}年${month}月${day}日 ${hour}:${minute}`;
};
const router = useRouter()
import {
  ElContainer, ElHeader, ElMain, ElTabs, ElTabPane,
  ElCheckboxGroup, ElCheckbox, ElTable, ElTableColumn, ElMessage
} from 'element-plus';

const activeTab = ref('rooms');
const selectedConditions = ref({
  bedtype: [],
  breakfast: [],
});

const images = ref([

]);


const rooms = ref([
  {

  },

]);

const replyInputVisible = reactive({});


// 回复内容的状态
const replyContent = ref({});


const showReplyInput = (reviewId) => {
  replyInputVisible[reviewId] = true;
  replyContent[reviewId] = '';
};


function initializeReviews() {
  reviews.value.forEach(review => {
    replyContent.value[review.review.reviewId] = '';
    replyInputVisible.value[review.review.reviewId] = false;
  });
}

// 提交回复的函数
const submitReply = async (reviewId) => {
  const content = replyContent.value[reviewId];
  if (!content) {
    ElMessage.error('回复内容不能为空');
    return;
  }

  // 发送回复到后端并等待响应
  const response = await fetchReply(reviewId, content,userInfo.value.id,hotelId6);
  if (response) {
    // 如果后端响应成功，更新前端评论列表
    const reviewIndex = reviews.value.findIndex(r => r.review.reviewId === reviewId);
    if (reviewIndex !== -1) {
      reviews.value[reviewIndex].childReviews.push(content);
      console.log('回复的信息', reviews.value[reviewIndex].childReviews);
    }
    // 清空回复输入框并隐藏
    replyContent.value[reviewId] = '';
    replyInputVisible.value[reviewId] = false;
  } else {
    // 处理错误情况
    ElMessage.error('回复失败');
  }
};


const info = ref({

  info:''
});
const hotelInfo = ref({
  hotelId:'',
  images,
  rooms,
  info,
  name,
});

console.log('hhhhhhhhhhhh',hotelInfo.value.images)
const filteredRooms = computed(() => {
  return rooms.value.filter((room) => {
    console.log('room',room)
    // 检查床型条件是否符合，如果selectedConditions.bedType为空，则不筛选该条件
    const bedTypeMatch = selectedConditions.value.bedtype.length === 0 ||
        selectedConditions.value.bedtype.includes(room.bedtype);
    // 检查早餐条件是否符合，如果selectedConditions.breakfast为空，则不筛选该条件
    const breakfastMatch = selectedConditions.value.breakfast.length === 0 ||
        selectedConditions.value.breakfast.includes(room.breakfast);
    // 两个条件都符合时，房间会被包含在筛选结果中
    return bedTypeMatch && breakfastMatch;
  });
});

const route = useRoute();
const dialogVisible = ref(false);
const selectedImageUrl = ref(null);

const openModal = (imageUrl) => {
  selectedImageUrl.value = imageUrl;
  dialogVisible.value = true;
};

onMounted(async () => {
  if (route.query.hotelData) {
    try {
      const hotelData = JSON.parse(route.query.hotelData);
      console.log('爱九八',hotelData)
      //这里应该是重新发送一个请求去获取最新的酒店信息 hotelId
      const hotelId = hotelData.hotelId;
      hotelId6 = hotelId;
      console.log(hotelData)
      isReview = hotelData.ownerId;

      console.log(isReview === userInfo.id)
      console.log('hhhhhhh',isReview)
      try {
        const response = await fetchReviews(hotelId);
        console.log('respone廖梓行',response)
        reviews.value = response.data;
      } catch (error) {
        console.error('评论获取失败:', error);
      }
      console.log('hotelData', hotelData)
/*      hotelInfo.value.images = hotelData.images;
      hotelInfo.value.rooms = hotelData.roomTypes;
      hotelInfo.value.info.info = hotelData.description;
      hotelInfo.value.name = hotelData.name;*/

      // 获取最新的酒店信息
      const response = await getHotelById(hotelId);
      console.log('张培灵',response)
      if (response) {
        // 更新酒店信息
        console.log('张培灵666',response[0].roomTypes)
        hotelInfo.value.hotelId = response[0].hotelId;
        hotelInfo.value.images= response[0].images;
        hotelInfo.value.rooms = response[0].roomTypes;
        hotelInfo.value.info.info = response[0].description;
        hotelInfo.value.name = response[0].name;
        console.log('更新酒店信息',response[0].images)
      }
    } catch (error) {
      console.error('错误信息:', error);
    }
  }
});

const bookRoom = (room) => {
  console.log('room',room)
  router.push({
    name: 'HotelBooking',
    query: {
      room: JSON.stringify(room),
      hotelName:hotelInfo.value.name
    }
  });
};



</script>


<style scoped>
.review-image {
  transition: transform 0.3s ease;
}

.review-image:hover {
  transform: scale(2); /* 根据需要调整放大倍数 */
}
.ttt {
  display: flex;
  background-color: rgb(245, 245, 245);
  margin-top: 90px;
}
.gallery {
  flex: 1;
  margin-left: 200px;
}
.hotel-info {
  flex: 1;
  margin-top: 50px;
  margin-left: 40px;
}
.hotel-info ul {
  list-style: none;
  padding: 0;
}
.hotel-info li {
  margin-bottom: 5px;
}
.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.secondary-comments {
  margin-top: 10px;

}
.description-line {
  border: 1px solid #ddd; /* 添加边框 */
  margin-bottom: 5px; /* 添加一些间隔 */
  padding: 5px; /* 添加内边距 */
}

/* 为奇数行和偶数行定义不同的颜色 */
.description-line:nth-child(odd) {
  background-color: #f9f9f9;
}

.secondary-comments {
  margin-top: 10px;
  background-color: #f0f0f0; /* 灰色背景 */
  border-radius: 10px; /* 圆角边框 */
  padding: 10px; /* 内部空间 */
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* 轻微的阴影，增加立体感 */
}


.description-line:nth-child(even) {
  background-color: #efefef;
}


.hotel-details {
  /* 样式细节 */
  max-width: 800px;
  margin: auto;
}

.hotel-details h3 {
  margin-top: 1em;
}

.hotel-details h4 {
  margin-top: 0.5em;
}

.hotel-details p {
  margin-bottom: 0.5em;
}

.review-item {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.user-info {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}

.user-info .el-avatar {
  margin-right: 10px;
}

.user-details .user-name {
  font-weight: bold;
}

.review-date {
  font-size: 0.85em;
  color: #888;
}

.hotel-rating {
  margin-bottom: 5px;
}

.review-content p {
  margin-bottom: 10px;
}

.review-images {
  display: flex;
}

</style>

