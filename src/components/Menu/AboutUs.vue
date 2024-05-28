<template>
  <div style="margin-top: 200px">
    <!-- 模块一 -->
    <div class="background-image-1">
      <p>这里~这里~♪</p>
      <p>网名 梓</p>
      <p>有了备案就是 实名制上网啦QAQ</p>
      <p>是一只还在求学路上的 大学生、个人博主</p>
    </div>

    <!-- 模块二 -->
    <div class="background-image-2">
      <p>追求</p>
      <p>源于</p>
      <p>乐趣·兴趣</p>
      <p class="animate-text">
        <span class="animate-group" style="color: red;">程序，</span>
        <span class="animate-group" style="color: green;">学习，</span>
        <span class="animate-group" style="color: blue;">生活，</span>
        <span class="animate-group" style="color: orange;">技术</span>
      </p>
    </div>

    <!-- 模块三 -->
    <div class="background-image-3">
      <p>吉首大学</p>
      <p>大二</p>
      <p>软件工程</p>
    </div>

  </div>
  <div class="background-image"></div>
</template>

<script setup>

</script>

<style scoped>
.background-image-1 {
  background-image: url('src/assets/image/图片2.jpg');
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 1;
  color: white; /* 设置字体颜色为黑色 */
  padding: 20px;
  font-size: 16px;
  text-align: center;
  font-weight: bold; /* 设置字体加粗 */
  border-radius: 20px;
  width: 60%;
  margin: 0 auto;
  margin-top: 20px;
}

.background-image-2 {
  background-image: url('src/assets/image/img_3.png');
  background-size: cover;
  background-position: center;
  position: relative;
  color: white; /* 设置字体颜色为黑色 */
  z-index: 1;
  padding: 20px;
  font-size: 16px;
  font-weight: bold; /* 设置字体加粗 */
  text-align: center;
  border-radius: 20px;
  width: 60%;
  margin: 0 auto;
  margin-top: 40px;
}

.background-image-3 {
  background-image: url('src/assets/image/img_4.png');
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 1;
  color: white;
  padding: 20px;
  font-size: 16px;
  text-align: center;
  font-weight: bold;
  border-radius: 20px;
  width: 60%;
  margin: 0 auto;
  margin-top: 60px;
}

.background-image-4 {
  background-image: url('src/assets/image/img_5.png');
  background-size: cover;
  background-position: center;
  position: relative;
  z-index: 1;
  color: white;
  padding: 20px;
  font-size: 16px;
  text-align: center;
  font-weight: bold;
  border-radius: 20px;
  width: 60%;
  margin: 0 auto;
  margin-top: 80px;
}
/* 共同背景图片样式 */
.background-image {
  background-image: url('src/assets/image/img_6.png');
  background-size: cover;
  background-position: center;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}
</style>
