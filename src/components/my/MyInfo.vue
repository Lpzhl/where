<template>
  <el-container style="margin-left: 100px">
    <el-row>
      <el-col :span="12">
        <div class="user-profile">
          <el-avatar :size="100" :src="userInfo.user.avatar"></el-avatar>
          <h2>{{ userInfo.user.nickname }}</h2>
          <el-button type="primary" @click="showProfileModal = true">修改个人信息</el-button>
        </div>
      </el-col>
      <el-col :span="21">
        <div class="contacts">
          <h3>我的联系人:</h3>
          <el-table :data="userInfo.contacts" stripe>
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="identityCardNumber" label="身份证号码"></el-table-column>
            <el-table-column prop="phoneNumber" label="电话号码"></el-table-column>
          </el-table>
          <el-button type="primary" @click="showModal = true">添加联系人</el-button>
        </div>
      </el-col>
    </el-row>
  </el-container>

  <el-dialog
      title="联系人信息"
      v-model="showModal"
      width="30%">
    <form @submit.prevent="submitContact">
      <el-form-item label="姓名:">
        <el-input v-model="addContactForm.name"></el-input>
      </el-form-item>
      <el-form-item label="身份证号码:">
        <el-input v-model="addContactForm.identityCardNumber"></el-input>
      </el-form-item>
      <el-form-item label="电话号码:">
        <el-input v-model="addContactForm.phoneNumber"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">提交</el-button>
      </el-form-item>
    </form>
  </el-dialog>

  <el-dialog
      title="修改个人信息"
      v-model="showProfileModal"
      width="30%">
    <form @submit.prevent="submitProfile">
      <el-form-item label="昵称:">
        <el-input v-model="editProfileForm.nickname"></el-input>
      </el-form-item>
      <el-form-item label="头像:">
        <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :before-upload="beforeAvatarUpload"
            :auto-upload="false"
            :on-change="handleAvatarChange">
          <img v-if="editProfileForm.avatar" :src="editProfileForm.avatar" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" native-type="submit">提交</el-button>
      </el-form-item>
    </form>
  </el-dialog>
</template>

<script setup>
import { ElContainer, ElRow, ElCol, ElAvatar, ElButton, ElTable, ElTableColumn, ElUpload } from 'element-plus';
import {computed, inject, onMounted, ref} from 'vue';
import { useUserStore } from '../../stores/userStore';
import { add, updateProfile } from "../../api/login";
import { fetchContactPeople6 } from "../../api/hotel";
const updateUserAvatar = inject('updateUserAvatar');

const userStore = useUserStore();
const userInfo = ref({
  user: {},
  contacts: []
});
const showModal = ref(false);
const showProfileModal = ref(false);
const addContactForm = ref({ name: '', identityCardNumber: '', phoneNumber: '' });
const editProfileForm = ref({ nickname: '', avatar: '' });
const selectedFile = ref(null);
const userInfo1 = computed(() => userStore.userInfo);


const submitContact = async () => {
  console.log('提交联系人:', addContactForm.value);
  const newContact = {
    name: addContactForm.value.name,
    phoneNumber: addContactForm.value.phoneNumber,
    identityCardNumber: addContactForm.value.identityCardNumber
  };
  console.log('newContact', newContact)
  userInfo.value.contacts.push(newContact);

  console.log('userInfo.value.contacts', userInfo.value.contacts)

  try {
    const userId = userInfo.value.user.id;
    const response = await add(newContact, userId);
    console.log(response)
  } catch (error) {
    console.error('Error saving contact:', error);
  }

  addContactForm.value = { name: '', identityCardNumber: '', phoneNumber: '' };
  showModal.value = false;
};

const submitProfile = async () => {
  console.log('提交个人信息:', editProfileForm.value);
  try {
    const userId = userInfo.value.user.id;
    const formData = new FormData();
    formData.append('file', selectedFile.value);
    formData.append('nickname', editProfileForm.value.nickname);

    const response = await updateProfile(userId, formData);
    userInfo.value.user.nickname = editProfileForm.value.nickname;
    userInfo.value.user.avatar = response.data.data;
    updateUserAvatar(response.data.data);
    userStore.setUser(userInfo.value.user)
  } catch (error) {
    console.error('更新失败:', error);
  }

  showProfileModal.value = false;
};
const handleAvatarChange = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    editProfileForm.value.avatar = e.target.result;
  };
  reader.readAsDataURL(file.raw);
  selectedFile.value = file.raw;
};
const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/jpeg');
  const isLt2M = file.size / 1024 / 1024 < 10;

  if (!isImage) {
    this.$message.error('上传头像图片只能是图片格式!');
  }
  if (!isLt2M) {
    this.$message.error('上传头像图片大小不能超过 10MB!');
  }
  return isImage && isLt2M;
};



onMounted(async () => {
  userInfo.value.user = userInfo1.value;
  editProfileForm.value.nickname = userInfo.value.user.nickname;
  editProfileForm.value.avatar = userInfo.value.user.avatar;

  const response = await fetchContactPeople6(userInfo.value.user.id);

  console.log('哈哈哈哈哈', userInfo.value.user.id)
  userInfo.value.contacts = response.data;

  userInfo.value.contacts = [...new Map(userInfo.value.contacts.concat(response.data).map(item => [item['contactId'], item])).values()];

  console.log(userInfo.value.contacts)
});
</script>

<style scoped>
.user-profile {
  text-align: center;
}
.contacts {
  padding: 20px;
}
.avatar-uploader {
  display: inline-block;
  width: 100px;
  height: 100px;
}
.avatar {
  width: 100%;
  height: 100%;
  display: block;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  line-height: 100px;
  text-align: center;
}
</style>
