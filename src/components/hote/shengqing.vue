<template>
  <el-form label-width="120px">
    <el-form-item label="姓名">
      <el-input v-model="applicationForm.contactPhone"></el-input>
    </el-form-item>
    <el-form-item label="联系电话">
      <el-input v-model="applicationForm.name"></el-input>
    </el-form-item>

    <el-form-item label="身份证号码">
      <el-input v-model="applicationForm.identityCardNumber"></el-input>
    </el-form-item>

    <el-form-item label="申请图片">
      <el-upload
          class="upload-demo"
          action="https://jsonplaceholder.typicode.com/posts/"
      :on-preview="handlePictureCardPreview"
      :on-remove="handleRemove"
      list-type="picture-card"
      :on-success="handleSuccess"
      :before-upload="beforeImageUpload"
      >
      <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog :visible.sync="dialogVisible">
        <img width="100%" :src="dialogImageUrl" alt="">
      </el-dialog>
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="submitForm">提交申请</el-button>
      <el-button @click="resetForm">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script setup>
import { ref } from 'vue';
import {ElForm, ElInput, ElButton, ElUpload, ElDialog, ElMessage} from 'element-plus';
import {useUserStore} from "../../stores/userStore";
import {shengq} from "../../api/sheng";
const userStore = useUserStore();
const userInfo = userStore.userInfo;

const applicationForm = ref({
  name:'',
  contactPhone: '',
  identityCardNumber: '',
  applicationImage: ''
});

const submitForm = async () => {
  console.log('提交的申请信息:', applicationForm.value);
  // 提交申请表单
  console.log(userInfo.id)
  const re = await shengq(userInfo.id, applicationForm.value)
  if(re){
    ElMessage.success('提交成功')
  }
};

const resetForm = () => {
  applicationForm.value = {
    name:'',
    contactPhone: '',
    identityCardNumber: '',
    applicationImage: ''
  };
};

const handleRemove = (file, fileList) => {
  console.log(file, fileList);
};

const handlePictureCardPreview = (file) => {
  dialogImageUrl.value = file.url;
  dialogVisible.value = true;
};

const handleSuccess = (res, file) => {
  applicationForm.value.applicationImage = file.url;
};

const beforeImageUpload = (file) => {

  return true;
};

const dialogImageUrl = ref('');
const dialogVisible = ref(false);
</script>

<style scoped>
.upload-demo i {
  font-size: 28px;
  color: #8c939d;
}
.upload-demo .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.upload-demo .el-upload:hover {
  border-color: #409eff;
}
</style>
