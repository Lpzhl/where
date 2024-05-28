<!--Register.vue-->

<template>
  <div class="login-container">
    <h2>注册</h2>
    <div class="input-container">
      <input v-model="username" @input="validateUsername" placeholder="用户名" class="rounded-input" />
    </div>
    <div class="input-container">
      <input v-model="email" @input="validateEmail" placeholder="邮箱" class="rounded-input" />
      <div v-if="emailError" class="error">邮箱格式不正确</div>
    </div>
    <div class="input-container">
      <input v-model="password" @input="validatePassword" type="password" placeholder="密码" class="rounded-input" />
      <div v-if="passwordError" class="error">密码由10位组成包括数字和字母</div>
    </div>
    <div class="input-container">
      <input v-model="confirmPassword" @input="validateConfirmPassword" type="password" placeholder="确认密码" class="rounded-input" />
      <div v-if="passwordMismatch" class="error">两次密码不匹配</div>
    </div>
    <div class="input-container">
      <input v-model="verificationCode" @input="validateVerificationCode" placeholder="验证码" class="rounded-input6" />
      <button @click="getVerificationCode" class="rounded-button6">{{ isCountingDown ? `(${countdownText})` : '获取验证码' }}</button>
    </div>
    <button @click="register6" class="rounded-button">注册</button>
    <button @click="gotoLogin" class="rounded-button">返回登录</button>
  </div>
  <div class="background-image"></div>
  <div class="notification" :class="notificationType" v-if="showNotification">
    <span v-if="notificationType === 'success'">✔</span>
    <span v-if="notificationType === 'error'">✖</span>
    {{ notificationMessage }}
  </div>

</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import {sendVerificationCode} from "../../api/login";
import {register} from "../../api/login";
import '../../assets/css1/Register.css';


const router = useRouter();

const username = ref('');
const email = ref('');
const password = ref('');
const confirmPassword = ref('');
const verificationCode = ref('');

const isCountingDown = ref(false);
const countdown = ref(0);
const emailError = ref(false);
const passwordError = ref(false);
const passwordMismatch = ref(false);

const emailFormat = /^[\w-]+(\.[\w-]+)*@[\w-]+(\.[\w-]+)+$/;
const passwordFormat = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{10,}$/;

const showNotification = ref(false);
const notificationType = ref('');
const notificationMessage = ref('');

const showCustomNotification = (message, type = 'success') => {
  notificationType.value = type;
  notificationMessage.value = message;
  showNotification.value = true;

  setTimeout(() => {
    hideNotification();
  }, 1500);
};
const hideNotification = () => {
  showNotification.value = false;
}

const countdownText = computed(() => {
  return isCountingDown ? `${countdown.value}s` : '获取验证码';
});



const validateUsername = () => {
  if(password.value!==confirmPassword.value){
    passwordMismatch.value = true;
  }
};

const validateEmail = () => {
  if (!email.value.match(emailFormat)) {
    emailError.value = true;
    isCountingDown.value = false;
  } else {
    emailError.value = false;
  }
};

const validatePassword = () => {
  if (!password.value.match(passwordFormat)) {
    passwordError.value = true;
  } else {
    passwordError.value = false;
  }
};

const validateConfirmPassword = () => {
  if (password.value !== confirmPassword.value) {
    passwordMismatch.value = true;
  } else {
    passwordMismatch.value = false;
  }
};

const getVerificationCode = async () => {
  if (!isCountingDown.value && !emailError.value && email.value) {
    const response = await sendVerificationCode(email.value);

    if (response && response.code === 200) {
      // 验证码发送成功
      alert('验证码发送成功，请查看您的邮箱。');
      // 开始倒计时
      isCountingDown.value = true;
      countdown.value = 60;
      const timer = setInterval(() => {
        countdown.value -= 1;
        if (countdown.value === 0) {
          clearInterval(timer);
          isCountingDown.value = false;
        }
      }, 1000);
    } else {
      // 处理发送验证码错误（已在sendVerificationCode函数中处理）
    }
  } else {
    alert('请先填写有效的电子邮件地址并确保不在倒计时中点击。');
  }
};

const canRegister = computed(() => {
  return (
      username.value &&
      email.value &&
      password.value &&
      confirmPassword.value &&
      !emailError.value &&
      !passwordError.value &&
      !passwordMismatch.value
  );
});


const register6 = async () => {
  if (canRegister.value) {
    const response = await register(username.value, email.value, password.value, verificationCode.value);

    console.log('response',response)
    if (response && response.code === 200) {
      // 注册成功
      alert('注册成功！');
      router.push('/');
    } else {
      alert(response.data.message);
    }
  } else {
    alert('请在注册之前正确填写所有字段。');
  }
};



const gotoLogin = () => {
  router.push('/login');
};
</script>


<style scoped>
.error {
  color: red;
}
</style>


<style scoped>
</style>
