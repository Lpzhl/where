<template>
  <el-container style="margin-left: -400px">
    <el-aside width="200px">
      <!-- Sidebar content here -->
    </el-aside>
    <el-main>
      <el-button type="primary" @click="openAddHotelDialog">新增酒店</el-button>
      <el-dialog
          title="酒店信息"
          v-model="showAddHotelDialog"
          width="50%"
      >
        <el-form :model="hotelForm">
          <el-form-item label="酒店名称">
            <el-input v-model="hotelForm.name"></el-input>
          </el-form-item>
          <el-form-item label="酒店地址">
            <el-input v-model="hotelForm.address"></el-input>
          </el-form-item>
          <el-form-item label="联系电话">
            <el-input v-model="hotelForm.phoneNumber"></el-input>
          </el-form-item>
          <el-form-item label="酒店描述">
            <el-input type="textarea" v-model="hotelForm.description"></el-input>
          </el-form-item>
          <el-form-item label="房间数量">
            <el-input-number v-model="hotelForm.availableRooms" :min="1"></el-input-number>
          </el-form-item>
          <el-form-item label="交通信息">
            <el-input type="textarea" v-model="hotelForm.transport"></el-input>
          </el-form-item>
          <el-form-item label="标签">
            <el-select v-model="hotelForm.tag" multiple placeholder="请选择">
              <el-option
                  v-for="item in tag"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="酒店图片">
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
        </el-form>

        <span slot="footer" class="dialog-footer">
          <el-button @click="showAddHotelDialog = false">取消</el-button>
          <el-button type="primary" @click="submitHotelForm">确认</el-button>
        </span>
      </el-dialog>

      <el-dialog title="酒店图片管理" v-model="showHotelImagesDialog" width="50%">

        <div v-for="(imageObj, index) in hotel1.images" :key="imageObj.imageId" class="hotel-image-item">
          <el-image
              :style="{ width: imageObj.width + 'px', height: imageObj.height + 'px' }"
              :src="imageObj.imageUrl"
              fit="cover"
              @wheel="event => handleWheel(event, imageObj)">
          </el-image>
          <el-button type="danger" icon="el-icon-delete" @click="removeImage(imageObj)">删除</el-button>
        </div>

      </el-dialog>
      <el-select v-model="filterStatus" placeholder="请选择状态" @change="filterHotels">
        <el-option label="全部" value=""></el-option>
        <el-option label="正常" value="active"></el-option>
        <el-option label="已下架" value="inactive"></el-option>
      </el-select>

      <el-table :data="pagedHotels" style="cursor: pointer;">
        <el-table-column label="酒店图片">
          <template #default="scope">
            <el-image style="width: 100px; height: 100px" :src="scope.row.imageUrl" fit="cover"></el-image>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="酒店名称"></el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            {{ getStatus(scope.row) }}
          </template>
        </el-table-column>

        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" @click="editHotelInfo(scope.row)">编辑信息</el-button>
            <el-button size="small" @click="editHotelImages(scope.row)">编辑图片</el-button>
            <el-button size="small" type="danger" @click="deleteHotel(scope.row)">删除</el-button>
            <el-button size="small" type="danger" @click="toggleStatus(scope.row)">
              {{ scope.row.merchantDisabled ? '上架' : '下架' }}
            </el-button>
          </template>
        </el-table-column>


      </el-table>
      <el-pagination
          @current-change="handlePageChange"
          :current-page="currentPage"
          :page-size="pageSize"
          layout="total, prev, pager, next"
          :total="totalFilteredHotels">
      </el-pagination>

    </el-main>
  </el-container>
</template>

<script setup>
import {computed,onMounted, watch,ref} from 'vue';
import axios from "axios";
import {useUserStore} from '../../stores/userStore'
import {addHotel, getHotelsByOwnerId, removeHotel, removeHotelImage} from "../../api/manger";
import {ElMessage,ElMessageBox} from "element-plus";

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo)
const dialogImageUrl = ref('');
const dialogVisible = ref(false);
const dialogImageUrlVisible = ref(false);
const hotelId = ref();
const showHotelImagesDialog = ref(false)

const pendingFiles = ref([]);
const handlePictureCardPreview = file => {
  console.log('文件',file)
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
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
/*
const goToHotelDetails = (hotel) => {
  console.log('廖梓行', hotel);
  const hotelDataString = encodeURIComponent(JSON.stringify(hotel));
  const url = `http://121.41.107.127:5173/#/hotel-details?hotelData=${hotelDataString}`;
  window.open(url, '_blank');
};
*/

const onRowClick = (row) => {
  goToHotelDetails(row);
};



const handleWheel = (event, imageObj) => {
  const delta = event.deltaY || event.detail || event.wheelDelta;
  if (delta > 0) {
    imageObj.width *= 1.1;
    imageObj.height *= 1.1;
  } else {
    imageObj.width /= 1.1;
    imageObj.height /= 1.1;
  }
};
const filterStatus = ref(''); // 筛选状态
const filteredHotels = computed(() => {
  if (filterStatus.value === '') {
    return hotels.value;
  } else {
    return hotels.value.filter(hotel => {
      return filterStatus.value === 'active' ? !hotel.merchantDisabled : hotel.merchantDisabled;
    });
  }
});

// 过滤酒店
const filterHotels = () => {
  // 这个函数可以留空，因为 filteredHotels 是一个计算属性，会根据 filterStatus 自动更新
};
const hotel1 = ref({ images: [] });

const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file.raw);
  formData.append('hotel_id', hotelId.value);
  console.log( hotelId.value)

  try {
    const response = await axios.post('http://121.41.107.127:8088/hotel/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (error) {
    console.error('上传失败:', error);
  }
};
const showAddHotelDialog = ref(false);
const hotelForm = ref({
  hotelId:'',
  name: '',
  address: '',
  phoneNumber: '',
  description: '',
  availableRooms: 1,
  imageUrl:'',
  tag:'',
  images:[],
  transport: '',
  ownerId:userInfo.value.id,
  merchantDisabled:'',  // 用来商家下架
  adminDisabled:'',     // 用来管理员禁封
});

const fetchHotels = async () => {
  try {
    resetHotelForm()
    const ownerId = userInfo.value.id;
    let response = await getHotelsByOwnerId(ownerId);
    console.log('加载界面', response);

    // 检查 response 是否是一个响应对象，并提取数据部分
    let hotelsData = response.data ? response.data : response;

    // 现在 hotelsData 应该是一个数组，您可以安全地使用 map 方法
    hotelsData = hotelsData.map(hotel => {
      if (hotel.tag && typeof hotel.tag === 'string') {
        hotel.tag = hotel.tag.split(',');
      }
      return hotel;
    });

    console.log('转换后的酒店数据', hotelsData);
    hotels.value = hotelsData;
  } catch (error) {
    console.error('获取酒店信息时出错:', error);
  }
};

const removeImage = async (image) => {
  console.log('删除照片的id', image.imageId);
  console.log('删除照片的酒店id', image.hotelId);
  // 调用删除照片的函数
  try {
    const response = await removeHotelImage(image.imageId,image.hotelId);
    console.log('照片删除成功', response);
    fetchHotels();
  } catch (error) {
    console.error('照片删除失败', error);
  }
};


const hotels = ref([

]);

const tag = ref([
  { value: '豪华', label: '豪华' },
  { value: '经济', label: '经济' },
  { value: '市中心', label: '市中心' },
  {value: '停车场',label: '停车场'},
  {value: '健身室',label: '健身室'},
  {value: 'SPA',label: 'SPA'},
  {value: '桌球室',label: '桌球室'},
  {value: '闪住',label: '闪住'},
  {value: '行李寄存',label: '行李寄存'},
  {value: '酒吧',label: '酒吧'},
]);


const resetHotelForm = () => {
  hotelForm.value = {
    hotelId: '',
    name: '',
    address: '',
    phoneNumber: '',
    description: '',
    availableRooms: 1,
    tag: [],
    images: [],
    transport: '',
    ownerId: userInfo.value.id, // 保留当前用户的ID
  };
};

const uploadAllImages = async () => {
  for (let file of pendingFiles.value) {
    const response = await uploadImage(file);
    console.log('上传图片结果:', response);
    if (response && response.data) {
      let hotel = hotels.value.find(h => h.hotelId === hotelId.value);
      console.log('保存图片',hotel)
      if (hotel) {
        if (!hotel.images) {
          hotel.images = [];

        }

        hotel.images.push(response.data);
      }
    }
  }
  pendingFiles.value = [];
};
const openAddHotelDialog = () => {
  resetHotelForm(); // 清空表单
  showAddHotelDialog.value = true;
};


const submitHotelForm = () => {
  if (!hotelForm.value.name || !hotelForm.value.address || !hotelForm.value.phoneNumber) {
    ElMessage.error('请填写所有必填项');
    return;
  }
  // 创建一个新的对象
  const hotelData = {
    ...hotelForm.value,
    images: undefined,  // 排除图片信息
    tag: hotelForm.value.tag.join(',')
  };
  console.log(hotelData)
  addHotel(hotelData).then(response => {
    console.log(response.data);

    // 将字符串形式的tag转换为数组
    if (response.data.tag && typeof response.data.tag === 'string') {
      response.data.tag = response.data.tag.split(',');
    }
    hotelId.value = response.data.hotelId;
    console.log('哈哈哈哈',response.data)
    //hotels.value.push(response.data);
    uploadAllImages();
    fetchHotels();
    console.log(hotels.value)
    showAddHotelDialog.value = false;
    ElMessage.success('操作成功');
  }).catch(error => {
    console.error('添加酒店失败:', error);
    ElMessage.error('添加失败');
  });
};


const editHotelImages = (hotel) => {
  hotel1.value = hotel

  console.log('编辑',hotel1.value.images)
  showHotelImagesDialog.value = true;
};


const editHotelInfo = (hotel) => {
  resetHotelForm()
  console.log('编辑的酒店',hotel)
  console.log('前',hotelForm.value)
  // 将选中的酒店信息填充到表单中
  Object.assign(hotelForm.value, hotel);
  console.log('后',hotelForm.value)
  showAddHotelDialog.value = true;
};

const deleteHotel = async(hotel) => {

  console.log('删除的酒店信息：',hotel.hotelId)
  const response = await deleteHotelById(hotel.hotelId)
  if(response){

  }
};



onMounted(fetchHotels);


const currentPage = ref(1);
const pageSize = ref(6);


const totalFilteredHotels = computed(() => filteredHotels.value.length);

const pagedHotels = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize.value;
  const endIndex = startIndex + pageSize.value;
  return filteredHotels.value.slice(startIndex, endIndex);
});

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
};

watch(filterStatus, () => {
  currentPage.value = 1;
});

function getStatus(hotel) {
  return hotel.merchantDisabled ? '已下架' : '正常';
}

const toggleStatus = (hotel) => {
  console.log('操作酒店', hotel);

  // 确定消息框的文本内容
  const message = hotel.merchantDisabled ? `确定要上架 ${hotel.name} 吗？` : `确定要下架 ${hotel.name} 吗？`;
  const action = hotel.merchantDisabled ? '上架' : '下架';

  ElMessageBox.confirm(
      message,
      '确认信息',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
  ).then(() => {
    // 用户确认操作后的处理
    removeHotel(hotel.hotelId).then(() => {
      // 成功后的处理，例如更新hotel对象的状态
      hotel.merchantDisabled = !hotel.merchantDisabled;
      ElMessage.success(`${action}成功`);
    }).catch(error => {
      // 错误处理
      console.error(`${action}失败:`, error);
      ElMessage.error(`${action}失败`);
    });
  }).catch(() => {
    // 用户取消操作
    console.log('用户取消了操作');
  });
};

</script>

<style scoped>

</style>
