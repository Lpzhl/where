<template>
  <!-- 添加房间类型按钮 -->
  <el-button type="primary" @click="openAddRoomlDialog">添加房间类型</el-button>

  <!--编辑酒店房间-->
  <el-dialog v-model="dialogVisible1" title="编辑房间类型">
    <el-form @submit.prevent="editNewSKU">
      <!-- 表单字段 -->
      <el-form-item label="房间名称">
        <el-input v-model="newSKU.name" placeholder="房间名称"></el-input>
      </el-form-item>
      <el-form-item label="床型">
        <el-select v-model="newSKU.bedtype" placeholder="请选择床型">
          <el-option label="大床" value="大床"></el-option>
          <el-option label="双床" value="双床"></el-option>
          <el-option label="单人床" value="单人床"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="早餐">
        <el-select v-model="newSKU.breakfast" placeholder="请选择床型">
          <el-option label="含早餐" value="含早餐"></el-option>
          <el-option label="不含早餐" value="不含早餐"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="房间介绍">
        <el-input type="textarea" v-model="newSKU.description" placeholder="房间详细"></el-input>
      </el-form-item>

      <el-form-item label="房间照片">
        <div v-for="(image, index) in newSKU.images" :key="index" style="display: inline-block; position: relative; margin-right: 10px;">
          <el-image
              style="width: 100px; height: 100px;"
              :src="image.imageUrl"
              fit="cover"
              :preview-src-list="newSKU.images.map(img => img.imageUrl)"
              @contextmenu.prevent="handleRightClick(index)">
          </el-image>
          <el-button v-if="selectedImageIndex === index" type="danger" size="small" style="position: absolute; top: 0; right: 0;" @click="deleteImage(image,index)">删除</el-button>
        </div>
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

        <el-dialog :visible.sync="dialogImageUrlVisible">
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form-item>
      <el-form-item label="原价">
        <el-input-number v-model="newSKU.originalprice" :min="0" label="原价"></el-input-number>
      </el-form-item>

      <el-form-item label="折后价">
        <el-input-number v-model="newSKU.discountprice" :min="0" label="折后价"></el-input-number>
      </el-form-item>
      <el-form-item label="库存">
        <el-input-number v-model="newSKU.availableRooms" :min="0" label="库存"></el-input-number>
      </el-form-item>
      <el-button type="primary" native-type="submit">确认添加</el-button>
    </el-form>
  </el-dialog>

  <!-- 添加房间 -->
  <el-dialog v-model="dialogVisible" title="添加房间类型">
    <el-form @submit.prevent="addNewSKU">
      <!-- 表单字段 -->
      <el-form-item label="房间名称">
        <el-input v-model="newSKU.name" placeholder="房间名称"></el-input>
      </el-form-item>
      <el-form-item label="床型">
        <el-select v-model="newSKU.bedtype" placeholder="请选择床型">
          <el-option label="大床" value="大床"></el-option>
          <el-option label="双床" value="双床"></el-option>
          <el-option label="单人床" value="单人床"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="早餐">
        <el-select v-model="newSKU.breakfast" placeholder="请选择床型">
          <el-option label="含早餐" value="含早餐"></el-option>
          <el-option label="不含早餐" value="不含早餐"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="原价">
        <el-input-number v-model="newSKU.originalprice" :min="0" label="原价"></el-input-number>
      </el-form-item>

      <el-form-item label="折后价">
        <el-input-number v-model="newSKU.discountprice" :min="0" label="折后价"></el-input-number>
      </el-form-item>
      <el-form-item label="库存">
        <el-input-number v-model="newSKU.availableRooms" :min="0" label="库存"></el-input-number>
      </el-form-item>
      <el-button type="primary" native-type="submit">确认添加</el-button>
    </el-form>
  </el-dialog>

  <!-- 房间类型列表 -->
  <el-table :data="roomSKUs" style="width: 100%">
    <el-table-column prop="sku" label="SKU"></el-table-column>
    <el-table-column prop="name" label="房间名称"></el-table-column>
    <el-table-column prop="bedtype" label="床型"></el-table-column>
    <el-table-column prop="breakfast" label="早餐"></el-table-column>
    <el-table-column prop="availableRooms" label="库存"></el-table-column>
    <el-table-column prop="originalprice" label="原价"></el-table-column>
    <el-table-column prop="discountprice" label="折后"></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button size="small" @click="editSKU(scope.row)">编辑</el-button>
        <el-button size="small" type="danger" @click="deleteSKU(scope.$index,scope.row)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup>
import {onMounted, ref} from 'vue';

import { useRoute } from 'vue-router';
import {addRoom, deleteRoom, deleteRoomImage,getRoomById, updateRoom} from "../../api/manger";
import {ElMessage, ElMessageBox} from "element-plus";
import axios from "axios";
const dialogImageUrl = ref('');
const dialogImageUrlVisible = ref(false);
const route = useRoute()



const hotelId3 = ref()

const hotels = ref([

])
const roomSKUs = ref([

]);
// 获取指定的房间信息
const fetchGetRoomType = async (roomTypeId) => {
  try {
    const response = await getRoomById(roomTypeId);
    if (response.data) {
      // ElMessage.success('操作成功');
      console.log('房间',response.data)
      roomSKUs.value = response.data
    } else {
      //  ElMessage.error('获取房间信息失败');
    }
  } catch (e) {
    // ElMessage.error('操作失败');
    console.error(e);
  }
};

const roomTypeId = ref();
const newSKU = ref({});
const selectedImageIndex = ref(-1);

const handleRightClick = (index) => {
  console.log(index)
  selectedImageIndex.value = index;
};


const deleteImage = async (image,index) => {
  console.log('删除的图片的id',image.imageId)
  // 向后端发送一个请求删除图片
  const response = await deleteRoomImage(image.imageId);
  if(response){
    ElMessage.success("图片删除成功")
    newSKU.value.images.splice(index, 1);
    selectedImageIndex.value = -1;
  }else{
    ElMessage.error("图片删除失败")
  }
};



const dialogVisible = ref(false);
const dialogVisible1 = ref(false);

const editNewSKU = async () =>{

  console.log('编辑逻辑')
  const roomData = { ...newSKU.value};
  console.log('房间信息',roomData)
  const respone = await updateRoom(roomData)
  uploadAllImages();
  if(respone){

  }

  newSKU.value = {};
  dialogVisible1.value = false;
  pendingFiles.value = [];
}


const addNewSKU = async () => {
    let hotelId = hotelId3.value
    console.log('酒店Id：',hotelId3.value)
    const roomData = { ...newSKU.value,sku: `RT${roomSKUs.value.length + 1}` ,hotelId  };
    try {
      // 调用 addRoom 函数，并传递房间数据
      console.log('房间',roomData)
      const response = await addRoom(roomData);
      console.log('添加房间的响应:', response);

      roomSKUs.value.push({ ...newSKU.value, sku: `RT${roomSKUs.value.length + 1}` });
      newSKU.value = {};
      dialogVisible.value = false;
    } catch (error) {
      console.error('添加房间失败:', error);
    }
};
const openAddRoomlDialog = () => {
  newSKU.value = [];
  dialogVisible.value = true;
};

const editSKU = (sku) => {
  pendingFiles.value = [];
  newSKU.value = {...sku};
  console.log('编辑',newSKU.value)
  roomTypeId.value = newSKU.value.roomTypeId
  dialogVisible1.value = true;
};

const uploadImage = async (file,roomTypeId) => {
  console.log(roomTypeId.value)
  const formData = new FormData();
  formData.append('file', file.raw);
  formData.append('roomType_id', roomTypeId.value);
  try {
    const response = await axios.post('http://localhost:8088/hotel/uploadRoom', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    fetchGetRoomType(hotelId3.value)
    return response.data;
  } catch (error) {
    console.error('上传失败:', error);
  }
};
const pendingFiles = ref([]);
const handlePictureCardPreview = file => {
  console.log('文件',file)
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

const uploadAllImages = async () => {
  for (let file of pendingFiles.value) {
    const response = await uploadImage(file,roomTypeId);
    console.log('上传图片结果:', response);
    if (response && response.data) {

    }
  }
  pendingFiles.value = [];
};
const handlePictureChange = (file, fileList) => {
  // 将新选择的文件添加到待上传列表
  if (file.status === 'ready') {
    pendingFiles.value.push(file);
  }
};
const handleRemove = file => {
  pendingFiles.value = [];
};
const deleteSKU = async (index, obj) => {
  console.log(obj.roomTypeId);
  // 弹出确认对话框
  ElMessageBox.confirm('确定要删除这个SKU吗？', '警告', {
    confirmButtonText: '确认',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(async () => {
        // 用户确认操作
        const response = await deleteRoom(obj.roomTypeId);
        if(response) {
          roomSKUs.value.splice(index, 1);
        }
      })
      .catch(() => {
        // 用户取消操作
        console.log('删除操作已取消');
      });
};



onMounted(() => {
  const hotelsDataString = route.query.hotels;
  if (hotelsDataString) {
    try {
      const hotelsData = JSON.parse(decodeURIComponent(hotelsDataString));

      hotelId3.value = hotelsData.hotelId

      console.log('信息详细',hotelsData.roomTypes);
      roomSKUs.value = hotelsData.roomTypes
      console.log('id',roomSKUs.value.roomTypeId)
      fetchGetRoomType(hotelId3.value)
    } catch (e) {
      console.error('解析 hotels 参数时出错:', e);
    }
  }
});
</script>
