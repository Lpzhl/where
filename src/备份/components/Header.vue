<template>
  <header>
    <div class="menu">
      <div class="toppp">去哪儿の小破站</div>
      <ul class="menu-list">
        <li v-for="item in menuItems" :key="item" class="menu-item">
          <router-link :to="item === '首页' ? '/' : `/${displayItem(item)}`" class="menu-link">{{item.toLowerCase()}}</router-link>
        </li>
      </ul>
      <div class="user-info" @mouseover="showLoginButton = true" @mouseleave="showLoginButton = false">
        <div class="user-avatar-container">
          <img :src="'src/assets/image/' + userAvatar" alt="User Avatar" class="user-avatar" @mouseover="rotateAvatar" @mouseleave="resetAvatar" />
          <div v-if="isUserLoggedIn">
            <div class="button-column">
              <button @click="navigateToProfile" class="login-button">个人主页</button>
              <button @click="logout" class="login-button">退出</button>
              <br>
            </div>
          </div>
          <div v-else>
            <button @click="navigateToLogin" class="login-button">登录</button>
          </div>
        </div>
      </div>
    </div>
  </header>

</template>

<script>
import { ref, onMounted, provide } from 'vue';
import { useRouter } from 'vue-router';
import { getToken, removeToken } from '../utils/token-utils';
import { getUserInfo } from '../api/login';

export default {
  setup() {
    const userAvatar = ref('刘洋老婆.jpg');
    const isUserLoggedIn = ref(false);
    const menuItems = ["首页", "机票", "酒店", "火车票", "百宝箱", "攻略", "关于我们"];
    const showLoginButton = ref(false);

    const displayItem = (item) => {
      const englishNames = ["Home", "Records", "Likes", "Travel", "Treasure", "Messages", "AboutUs"];
      const index = menuItems.indexOf(item);
      return index !== -1 ? englishNames[index] : item;
    };

    // 在应用初始化时检查本地存储中是否存在token
    const token = getToken();

    console.log("token是什么：", token);

    if (token) {
      // 如果存在有效token，可以自动登录用户
      // 在这里可以调用后端接口验证token的有效性，获取用户信息
      // 如果token有效，根据获取到的用户信息自动登录
      getUserInfo(token).then((userInfoResponse) => {
        console.log('userInfoResponse', userInfoResponse)
        console.log(userInfoResponse.data)
        if (userInfoResponse.data.code === 200) {
          // 获取用户信息成功
          const user = userInfoResponse.data.data.loginUser; // 用户信息在data字段中
          userAvatar.value = user.avatar;
          setUserLoggedIn();

          router.push('/AboutUs');
        } else {
          // 获取用户信息失败
        }
      }).catch((error) => {
        // 获取用户信息请求出错
      });
    }

    // 函数来更新用户头像
    const updateUserAvatar = (newAvatar) => {
      console.log('newAvatar', newAvatar);
      userAvatar.value = newAvatar;
    };

    // 函数来表示用户已登录
    const setUserLoggedIn = () => {
      isUserLoggedIn.value = true;
    };

    // 函数来表示用户已退出登录
    const setUserLoggedOut = () => {
      isUserLoggedIn.value = false;
    };

    // 提供这些函数给子组件使用
    provide('updateUserAvatar', updateUserAvatar);
    provide('setUserLoggedIn', setUserLoggedIn);
    provide('setUserLoggedOut', setUserLoggedOut);

    const router = useRouter();

    return {
      userAvatar,
      isUserLoggedIn,
      displayItem,
      updateUserAvatar,
    };
  },

};
</script>


<style scoped>
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

.toppp {
  color: #fff;
  font-size: 30px;
  margin-right: 600px;
}

.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: transparent;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 80px;
  transition: background-color 0.3s;
}

header:hover {
  background-color: rgba(0, 0, 0, 0.7);
}

.menu-list {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
}

.menu-item {
  margin: 0;
  padding: 0;
}

.menu-link {
  text-decoration: none;
  color: #fff;
  font-size: 20px;
  margin: 0 10px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-avatar-container {
  display: flex;
  align-items: center;
  cursor: pointer;
  transform: rotate(0deg);
  transition: transform 0.3s ease;
}

.user-avatar {
  width: 50px;
  height: 50px;
  margin-right: 100px;
  margin-left: 40px;
  border-radius: 50%;
  transition: transform 0.5s;
}

.login-button {
  display: none;
  background-color: #007BFF;
  color: #fff;
  padding: 8px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute;
  top: 50px;
  left: 40%;
  transform: translateX(-50%);
}

.button-column {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.user-avatar:hover {
  transform: rotate(360deg);
}

.user-info:hover .login-button {
  display: block;
}
</style>