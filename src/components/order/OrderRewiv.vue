<template>
  <div v-if="errorMessage" class="error-message">
    {{ errorMessage }}
  </div>
  <h2 style="margin-top: 150px;display: flex;justify-content: center">评价订单</h2>
  <h3 style="margin-top: 40px;display: flex;justify-content: center">{{booking.hotelName}}</h3>
  <div class="review-container">
    <el-form ref="reviewForm" :model="reviewData">
      <el-form-item label="星级评价">
        <el-rate v-model="reviewData.rating"></el-rate>
      </el-form-item>
      <el-form-item label="评价内容">
        <el-input type="textarea" v-model="reviewData.content"></el-input>
      </el-form-item>
      <el-form-item label="上传图片">
        <el-upload
            ref="uploadRef"
            list-type="picture-card"
            :on-preview="handlePictureCardPreview"
            :on-change="handlePictureChange"
            :auto-upload="false"
            multiple>
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitReview">提交评价</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import axios from "axios";
import {useRoute,useRouter} from "vue-router";

import { useUserStore } from '../../stores/userStore'

const router = useRouter()
const userStore = useUserStore()
let reviewId = ref()
const userInfo = computed(() => userStore.userInfo)
import { ElMessage } from 'element-plus';


const errorMessage = ref('');
console.log(userInfo.value)



const route = useRoute();
const hotelId = ref();

const booking = ref()



console.log('蒋跃庆',booking.value = JSON.parse(route.query.booking))
const reviewData = ref({
  hotel_id: booking.value.hotelId,
  user_id: userInfo.value.id,
  rating: 0,
  content: '',
  booking_id:booking.value.bookingId,
  images: []
});
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const pendingFiles = ref([]);
const handlePictureCardPreview = file => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};
const handlePictureChange = (file, fileList) => {
  // 将新选择的文件添加到待上传列表
  if (file.status === 'ready') {
    pendingFiles.value.push(file);
  }
};
/*const handlePictureChange = async (file, fileList) => {
  // 上传每个文件
  const response = await uploadImage(file);
  console.log(response)
  if (response && response.data) {
    reviewData.value.images.push(response.data);
  }
  if (file.status === 'ready' || file.status === 'success') {

  }
};*/




const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file.raw);
  formData.append('review_id', reviewId);
  console.log(reviewId)

  try {
    const response = await axios.post('http://121.41.107.127:8088/review/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('上传失败:', error);
  }
};

const uploadAllImages = async () => {
  for (let file of pendingFiles.value) {
    const response = await uploadImage(file);
    if (response && response.data) {
      reviewData.value.images.push(response.data);
    }
  }
  pendingFiles.value = [];
};


const submitReview = async () => {
  try {
    console.log(reviewData.value.content)
    // 发送非图片内容
    const reviewResponse = await axios.post('http://121.41.107.127:8088/review/createReview', {
      hotelId: booking.value.hotelId,
      userId: booking.value.userId,
      rating: reviewData.value.rating,
      comment: reviewData.value.content,
      bookingId:booking.value.bookingId
    });
    reviewId = reviewResponse.data.data;
    console.log(reviewId)
    if(reviewId){
      // 上传所有图片
      await uploadAllImages(reviewId);
    }

    ElMessage({
      message: '评论成功',
      type: 'success',
      duration: 1000,
    });

    setTimeout(()=>{
      router.push({ path: '/order' });

      window.close();
    },1000)

  } catch (error) {
    console.error('提交评价失败:', error);
  }
};
</script>


<style scoped>

.review-container{
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: center;
}
.image-preview {
  height: 100px;
  object-fit: cover;
}
</style>
