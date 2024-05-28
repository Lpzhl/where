<template>
  <div class="forgot-password-container">
    <h2>找回密码</h2>
    <div class="input-container">
      <input v-model="email" @input="validateEmail" placeholder="邮箱" class="rounded-input" />
      <div v-if="emailError" class="error">邮箱格式不正确</div>
    </div>
    <div class="input-container">
      <input v-model="password" @input="validatePassword" type="password" placeholder="新密码" class="rounded-input" />
      <div v-if="passwordError" class="error">密码由10位组成包括数字和字母</div>
    </div>
    <div class="input-container">
      <input v-model="confirmPassword" @input="validateConfirmPassword" type="password" placeholder="确认新密码" class="rounded-input" />
      <div v-if="passwordMismatch" class="error">两次密码不匹配</div>
    </div>
    <div class="input-container">
      <input v-model="verificationCode" @input="validateVerificationCode" placeholder="验证码" class="rounded-input6" />
      <button @click="getVerificationCode" class="rounded-button6">{{ isCountingDown ? `(${countdownText})` : '获取验证码' }}</button>
    </div>
    <button @click="resetPassword6" class="rounded-button">找回密码</button>
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
import { sendVerificationCode } from "../../api/login";
import { resetPassword } from "../../api/login";
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
};

const router = useRouter();

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

const countdownText = computed(() => {
  return isCountingDown ? `${countdown.value}s` : '获取验证码';
});

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
      showCustomNotification('验证码发送成功，请查看您的邮箱', 'success');
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
    showCustomNotification('请先填写有效的电子邮件地址并确保不在倒计时中点击', 'error');
  }
};


const canResetPassword = computed(() => {
  return (
      email.value &&
      password.value &&
      confirmPassword.value &&
      !emailError.value &&
      !passwordError.value &&
      !passwordMismatch.value
  );
});

const resetPassword6 = async () => {
  if (canResetPassword.value) {
    const response = await resetPassword(email.value, password.value, verificationCode.value);

    console.log('response', response);
    if (response && response.code === 200) {
      // 密码重置成功
      showCustomNotification('密码已成功重置！', 'success');

      // 延迟2秒后跳转到登录页面
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    }
 else {
      alert(response.data.message);
    }
  } else {
    showCustomNotification('请在重置密码之前正确填写所有字段', 'error');

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
.forgot-password-container {
  width: 300px;
  margin: 130px auto 0;
  padding: 20px;
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  text-align: center;
}
.input-container {
  margin: 10px 0;
}
.rounded-input {
  width: 80%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.rounded-button {
  background-color: #007bff;
  color: #fff;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
.rounded-button6 {
  background-color: brown;
  color: #fff;
  padding: 5px 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
}
.rounded-input6{
  width: 50%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
}
.background-image {
  background-image: url('src/assets/image/图片2.jpg');
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.notification {
  position: fixed;
  top: 20%;
  left: 50%; /* 水平居中 */
  transform: translate(-50%, -50%); /* 居中定位 */
  padding: 10px;
  border-radius: 5px;
  font-size: 16px;
  color: #fff;
  transition: opacity 0.5s ease;
}

.notification.success {
  background-color: #4CAF50;
}

.notification.error {
  background-color: #f44336;
}
</style>
