<template>
  <el-container style="margin-left: 100px">
    <el-row>
      <el-col :span="12">
        <div class="user-profile">
          <el-avatar :size="100" :src="userInfo.user.avatar"></el-avatar>
          <h2>{{ userInfo.user.nickname }}</h2>
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
</template>

<script setup>
import { ElContainer, ElRow, ElCol, ElAvatar, ElButton, ElTable, ElTableColumn } from 'element-plus';
import { computed, onMounted, ref } from 'vue';
import { useUserStore } from '../../stores/userStore';
import {add} from "../../api/login";
import {fetchContactPeople6} from "../../api/hotel";

const userStore = useUserStore();
const userInfo = ref({
  user: {},
  contacts: [
  ]
});
const showModal = ref(false);
const addContactForm = ref({ name: '', identityCardNumber: '', phoneNumber: '' });

const userInfo1 = computed(() => userStore.userInfo);

const submitContact = async () => {
  console.log('提交联系人:', addContactForm.value);
  const newContact = {
    name: addContactForm.value.name,
    phoneNumber: addContactForm.value.phoneNumber,
    identityCardNumber: addContactForm.value.identityCardNumber
  };
  console.log('newContact',newContact)
  userInfo.value.contacts.push(newContact);

  console.log('userInfo.value.contacts',userInfo.value.contacts)

  try {
    const userId = userInfo.value.user.id;
    const respone = await add(newContact, userId);
    console.log(respone)
  } catch (error) {
    console.error('Error saving contact:', error);
  }

  addContactForm.value = { name: '', identityCardNumber: '', phoneNumber: '' };
  showModal.value = false;
};

onMounted(async () => {
  userInfo.value.user = userInfo1.value;

  const response = await fetchContactPeople6(userInfo.value.user.id);

  console.log('哈哈哈哈哈',userInfo.value.user.id)
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

</style>
