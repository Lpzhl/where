<template>
  <el-table :data="applications" style="width: 100%">
    <el-table-column prop="applicantid" label="申请者ID"></el-table-column>
    <el-table-column prop="name" label="姓名"></el-table-column>
    <el-table-column prop="applicationimage" label="申请图片"></el-table-column>
    <el-table-column prop="contactphone" label="联系电话"></el-table-column>
    <el-table-column prop="identitycardnumber" label="身份证号码"></el-table-column>
    <el-table-column prop="status" label="状态"></el-table-column>
    <el-table-column label="操作">
      <template #default="scope">
        <el-button
            size="small"
            v-if="scope.row.status !== '已批准' && scope.row.status !== '已拒绝'"
            @click="approveApplication(scope.row)">
          批准
        </el-button>
        <el-button
            size="small"
            v-if="scope.row.status !== '已批准' && scope.row.status !== '已拒绝'"
            @click="rejectApplication(scope.row)">
          拒绝
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>


<script setup>
import { ref, onMounted } from 'vue';
import { ElTable, ElButton, ElTableColumn } from 'element-plus';
import { getApplications, updateApplicationStatus } from '../../api/sheng';
import axios from "axios"; // 请根据实际路径调整

const applications = ref([]);

const fetchApplications = async () => {
  try {
    const response = await getApplications();
    applications.value = response.data.data;
  } catch (error) {
    console.error('Error fetching applications:', error);
  }
};

const approveApplication = async (application) => {
  // 更新状态为 "批准"
  await updateApplicationStatus(application.id, '已批准');
  await fetchApplications();
};

const rejectApplication = async (application) => {
  // 更新状态为 "拒绝"
  await updateApplicationStatus(application.id, '已拒绝');
  await fetchApplications();
};

onMounted(fetchApplications);
</script>

<style scoped>

</style>