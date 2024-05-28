<!--UserManger-->
<template>


  <div v-if="errorMessage" class="error-message">
    {{ errorMessage }}
  </div>

  <el-container style="margin-left: -180px">
    <el-main >
      <el-table :data="users" style="width:90%">


        <el-table-column label="头像">
          <template #default="scope">
            <el-avatar :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>

        <el-table-column prop="nickname" label="用户昵称"></el-table-column>

        <el-table-column prop="email" label="账号"></el-table-column>

        <el-table-column label="职务">
          <template #default="scope">
            <div v-for="role in scope.row.roles" :key="role.id" class="role-item" @mouseover="showCloseIcon = true" @mouseleave="showCloseIcon = false">
              {{ role.name }}
              <span class="close-icon" v-show="showCloseIcon" @click="handleRemoveRole(scope.row, role)">×</span>
            </div>
          </template>
        </el-table-column>


        <el-table-column label="操作">
          <template #default="scope">
            <div class="permission-actions">
              <el-button size="small" @click="handleAction('freeze', scope.row)" v-if="scope.row.isFrozen === false">冻结</el-button>
              <el-button size="small" @click="handleAction('unfreeze', scope.row)" v-else>解冻</el-button>
              <el-button size="small" @click="handleAction('appoint', scope.row)">职务分配</el-button>
            </div>
          </template>
        </el-table-column>


      </el-table>
    </el-main>
  </el-container>
  <el-dialog v-model="isAppointModalVisible">
    <el-form :model="selectedRole">
      <el-form-item label="职务">
        <el-select v-model="selectedRole.role" placeholder="请选择职务">
          <el-option
              v-for="role in RoleInfo"
              :key="role.id"
              :label="role.name"
              :value="role.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="isAppointModalVisible = false">取消</el-button>
      <el-button type="primary" @click="assignRole">任命</el-button>
    </span>
  </el-dialog>

</template>

<script setup>
import { ref, onMounted ,computed} from 'vue';
import {ElContainer, ElMain, ElTable, ElTableColumn, ElAvatar, ElMessageBox, ElMessage} from 'element-plus';
import {
  ElDialog,
  ElForm,
  ElFormItem,
  ElSelect,
  ElOption,
  ElButton
} from 'element-plus';
import {useUserStore} from '../../stores/userStore'
import {removeUserRole,assigUserRole, freezeUser, getAllUsers, getRoles, unfreezeUser} from "../../api/role";
import axios from "axios";
const errorMessage = ref('');
const userStore = useUserStore()

const isAppointModalVisible = ref(false);
const selectedRole = ref({ role: null });
const currentUser = ref(null);

const RoleInfo = ref([

]);



const showCloseIcon = ref(false);

const handleRemoveRole = async (user, role) => {

  const userId = user.id;
  const roleId = role.id;
  try {
    console.log(`移除用户 ${user.nickname} 的职务 ${role.name}`);

    console.log(userId)
    console.log(roleId)
    const response = await removeUserRole(userId, roleId)
    console.log(response);
    ElMessage.success('角色解雇成功');
    fetchUserData();
  } catch (error) {
    console.error('角色解雇失败:', error);
    ElMessage.error('角色解雇失败');
  }

};


const assignRole = async () => {
  const userId = currentUser.value.id;
  const roleId = selectedRole.value.role;
  console.log('roleId', roleId);
  try {
    const response = await assigUserRole(userId, roleId);
    console.log(response);
    ElMessage.success('角色分配成功');
    fetchUserData();
  } catch (error) {
    console.error('角色分配失败:', error);
    ElMessage.error('角色分配失败');
  }
  isAppointModalVisible.value = false;
  selectedRole.value.role = null;
};


const userInfo = computed(() =>userStore.userInfo)

const users = ref([

]);

const fetchUserData = async () => {
  const userId = userInfo.value.id;
  const userData = await getAllUsers(userId);
  console.log('获取道德用户信息：',userData)
  if (userData) {
    users.value = userData.data;
  }
};

const fetchRolesData = async () =>{
  const respone = await getRoles();
  if(respone){
    console.log('获取职务信息：',respone.data)
    RoleInfo.value = respone.data
    fetchUserData();
  }
}


const handleAction = async (actionType, user) => {
  if (actionType === 'freeze') {
    try {
      await ElMessageBox.confirm(`确定要冻结${user.nickname}吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      });
      console.log(`冻结用户：${user.nickname}`);
      const response = await freezeUser(user.id);
      if(response) {
        ElMessage({
          message: '冻结成功',
          type: 'success',
          duration: 1000,
        });
        fetchUserData();
      }
    } catch (error) {
      console.log('冻结操作已取消');
    }
  } else if (actionType === 'unfreeze') {
    console.log(`解冻用户：${user.nickname}`);
    const response = await unfreezeUser(user.id);
    if(response) {
      ElMessage({
        message: '解冻成功',
        type: 'success',
        duration: 1000,
      });
      fetchUserData();
    }

  } else if (actionType === 'appoint') {
    console.log(`任命用户：${user.nickname}`);
    currentUser.value = user;
    isAppointModalVisible.value = true;
  }
};

onMounted(() => {
  fetchUserData();
  fetchRolesData();
});





</script>

<style scoped>
.main-hhh {
  align-items: center;
  margin-left: 400px;
}

.custom-header-cell {
  padding-top: 5px;
  padding-bottom: 5px;

}
.permission-actions {
  display: flex;
  align-items: center;
}
.close-icon {
   cursor: pointer;

 }

.permission-actions .el-button {
  margin-left: 10px;
}
</style>
