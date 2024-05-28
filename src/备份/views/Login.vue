<!-- Login.vue -->
<template>
  <div class="login-container">
    <h2>登录</h2>
    <div class="input-container">
      <input v-model="account" placeholder="账号 " @input="validateAccount" class="rounded-input" />
    </div>
    <div class="input-container">
      <input v-model="password" type="password" placeholder="密码" @input="validatePassword" class="rounded-input" />
    </div>
    <router-link to="/find-password" style="border: none; text-decoration: none;">忘记密码?</router-link>

    <br>
    <button @click="handleLogin" class="rounded-button">登录</button>
    <button @click="register" class="rounded-button">注册</button>
  </div>
  <div class="background-image"></div>
</template>

<script setup>
import { ref ,inject} from 'vue';
import { useRouter } from 'vue-router';
import { login } from '../../api/login.js';
import '../../assets/css1/Login.css';
import { setToken } from '../../utils/token-utils.ts';

const account = ref('');
const password = ref('');
const accountError = ref(false);
const passwordError = ref(false);
// 使用 inject 获取 updateUserAvatar 函数
const updateUserAvatar = inject('updateUserAvatar');

/*const userFunctions = inject('userFunctions');
const updateUserAvatar = userFunctions.updateUserAvatar;*/

const userlogin = inject('setUserLoggedIn');

const router = useRouter();


const handleLogin = async () => {
  if (!account.value || !password.value) {
    alert('账号和密码不可为空');
  } else if (accountError.value || passwordError.value) {
    alert('账户或密码不正确');
  } else {
    const response = await login(account.value, password.value);
    if (response.data.code === 200) {
      alert(response.data.message);
      const newAvatar = response.data.data.user.avatar;
      // 调用 updateUserAvatar 函数来更新父组件的 userAvatar
/*      console.log(updateUserAvatar())*/
      updateUserAvatar(newAvatar);
      userlogin();

      // 登录成功后从后端获取到token
      const token = response.data.data.token;
      setToken(token);

      router.push('/AboutUs');
    } else {
      alert(response.data.message);
    }
  }
};


const register = () => {
  router.push('/register');
};
</script>



<style scoped>

</style>
