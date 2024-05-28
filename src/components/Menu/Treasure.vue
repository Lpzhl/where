<template>
  <div>
    <div class="background-image"></div>
    <h1>工具</h1>
  </div>
</template>

<script setup>

</script>

<style scoped>
.background-image {
  background-image: url('src/assets/image/趴在桌子的女孩.jpg');
  background-size: cover;
  background-position: center;
  position: fixed; /* 让背景图片固定在视口中 */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1; /* 将背景图片放在最底层，以确保其他内容在上面 */
}
</style>
