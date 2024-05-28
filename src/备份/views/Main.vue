<template>
  <div>

    <div class="background-image"></div>
    <div class="content">
    </div>
  </div>
</template>


<script>
export default {

};
</script>


<style scoped>
/* 样式可以根据需要自定义 */
.background-image {
  background-image: url('src/assets/image/刘洋老婆.jpg');
  background-size: cover;
  background-position: center;
  position: fixed; /* 让背景图片固定在视口中 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* 将背景图片放在最底层，以确保其他内容在上面 */
}
.toppp{
  color: #fff;
  font-size: 30px;
  margin-right: 600px;
}
.menu {
  list-style: none;
  padding: 0;
  margin: 0;
  background-color: transparent; /* 初始状态下透明 */
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 80px; /* 菜单高度 */
  transition: background-color 0.3s; /* 添加过渡效果 */

}

.menu-with-background {
  background-color: rgba(0, 0, 0, 0.7); /* 鼠标悬停时的背景颜色 */
  transition:all .3s ease-in-out;
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
  color: #fff; /* 菜单项文字颜色 */
  font-size: 20px; /* 菜单项文字大小 */
  margin: 0 10px; /* 调整菜单项之间的间距 */
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
  width: 50px; /* 根据需要调整头像的大小 */
  height: 50px;
  margin-right: 100px; /* 根据需要调整头像和按钮之间的间距 */
  margin-left: 40px;
  border-radius: 50%; /* 将头像设置为圆形 */
  transition: transform 0.5s; /* 添加旋转动画效果 */
}

.login-button {
  display: none;
  background-color: #007BFF; /* 登录按钮背景颜色 */
  color: #fff; /* 登录按钮文字颜色 */
  padding: 8px 16px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  position: absolute; /* 将登录按钮定位在头像下方 */
  top: 50px; /* 根据需要调整按钮位置 */
  left: 40%; /* 将按钮置于头像正下方 */
  transform: translateX(-50%); /* 居中按钮 */
}

.user-avatar:hover {
  transform: rotate(360deg); /* 鼠标悬停时旋转头像 */
}

.user-info:hover .login-button {
  display: block;
}

</style>
