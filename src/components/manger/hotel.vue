<template>
  <div class="contact-service">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>Contact Customer Service</span>
      </div>

      <el-form :model="form" label-width="120px">
        <el-form-item label="Your Name">
          <el-input v-model="form.name"></el-input>
        </el-form-item>
        <el-form-item label="Email">
          <el-input v-model="form.email"></el-input>
        </el-form-item>
        <el-form-item label="Phone">
          <el-input v-model="form.phone"></el-input>
        </el-form-item>
        <el-form-item label="Issue Type">
          <el-select v-model="form.issueType" placeholder="Please select">
            <el-option label="Payment Issue" value="payment"></el-option>
            <el-option label="Booking Issue" value="booking"></el-option>
            <el-option label="Other" value="other"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="Message">
          <el-input type="textarea" v-model="form.message"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">Submit</el-button>
          <el-button @click="resetForm">Reset</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { ElCard, ElForm, ElFormItem, ElInput, ElButton, ElSelect, ElOption } from 'element-plus';

const form = ref({
  name: '',
  email: '',
  phone: '',
  issueType: '',
  message: ''
});

const submitForm = () => {
  console.log('Form Submitted:', form.value);

};

const resetForm = () => {
  form.value = {
    name: '',
    email: '',
    phone: '',
    issueType: '',
    message: ''
  };
};
</script>

<style scoped>
.contact-service {
  max-width: 600px;
  margin: 20px auto;
}

.box-card {
  padding: 20px;
}
</style>
