<template>
  <!-- 酒店信息展示 -->
  <div>
    <el-row :gutter="20">
      <!-- 使用v-for遍历分页后的酒店信息 -->
      <el-col :span="6" v-for="(item, index) in pagedItems" :key="index" @click="">
        <div class="image-container">
          <!-- 酒店图片 -->
          <img :src="item.image" alt="Item Image" style="width: 500px; height: 200px" />
          <!-- 酒店名称 -->
          <div class="name">{{ item.name }}</div>
        </div>
      </el-col>
    </el-row>

    <!-- 自定义分页控件 -->
    <div class="custom-pagination">
      <!-- 上一页按钮 -->
      <button @click="prevPage" :disabled="currentPage === 1">上一页</button>
      <!-- 当前页数 -->
      <span>{{ currentPage }}</span>
      <!-- 下一页按钮 -->
      <button @click="nextPage" :disabled="currentPage === totalPages">下一页</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const userStore = useUserStore();
const userInfo = userStore.userInfo;
const router = useRouter();

// 酒店信息数组
const items = ref([
  { image: 'http://121.41.107.127:8088/resources/廖梓行.jpg', name: '国际大酒店' },
  { image: 'http://121.41.107.127:8088/resources/廖梓行.jpg', name: '国际大酒店' },
]);

// 当前页数和每页显示项数
const currentPage = ref(1);
const pageSize = ref(8);

// 计算属性，根据当前页和每页项数截取酒店信息数组
const pagedItems = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = currentPage.value * pageSize.value;
  return items.value.slice(start, end);
});

// 计算总页数
const totalPages = computed(() => Math.ceil(items.value.length / pageSize.value));

// 上一页按钮点击事件
const prevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value -= 1;
  }
};

// 下一页按钮点击事件
const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value += 1;
  }
};

</script>
