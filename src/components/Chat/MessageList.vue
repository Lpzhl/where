<!--MessageList.vue-->
<template>
  <div class="container">
    <el-menu class="message-list">
      <el-menu-item
          v-for="booking in messages"
          :key="booking.chatRecordVOList[0].id"
          @click="selectMessage(booking.chatRecordVOList[0].id)"
          :class="{ 'selected': selectedBookingId === booking.chatRecordVOList[0].id }"
          class="booking-item"
      >
        <!-- Flexbox 容器 -->
        <div class="flex-container">
          <!-- 头像 -->
          <img
              :src="currentUserId === booking.chatRecordVOList[0].senderId
          ? booking.chatRecordVOList[0].receiverAvatarUrl
          : booking.chatRecordVOList[0].senderAvatarUrl"
              alt="Avatar"
              class="avatar-img"
          >
          <!-- 名字 -->
          <span class="hotel-name">
    {{ currentUserId === booking.chatRecordVOList[0].senderId
              ? booking.chatRecordVOList[0].hotelName
              :booking.chatRecordVOList[0].senderNickname }}

  </span>
          <span>----订单号：{{ booking.chatRecordVOList[0].id}}</span>

          <span v-if="booking.unreadCount > 0" class="unread-badge">{{ booking.unreadCount }}</span>
        </div>

      </el-menu-item>
    </el-menu>
    <router-view class="router-view"/>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMenu, ElMenuItem } from 'element-plus';
import { useUserStore } from '../../stores/userStore';
import { getChatMessagesByUserId } from "../../api/chat";
import {getAllBookings} from "../../api/hotel";
const selectedBookingId = ref(null);
const userStore = useUserStore();
const userInfo = userStore.userInfo;
let currentUserId= null;
const messages = ref([]);

const fetchUserMessages = async () => {
  try {
    currentUserId= userStore.userInfo.id;
    const response = await getChatMessagesByUserId(currentUserId);
    messages.value = response.data;
    console.log(messages.value[0].chatRecordVOList[0].id)
  } catch (error) {
    console.error('无法获取聊天信息:', error);
  }
};

const router = useRouter();


const selectMessage = async (index) => {
  const selectedMessage = messages.value.find(m => m.chatRecordVOList.some(msg => msg.id === index));
  selectedBookingId.value = index;
  console.log('选择的信息：', selectedMessage);
  const response = await getAllBookings(userInfo.id, selectedMessage.chatRecordVOList[0].hotelId);
  console.log('数据', response.data)
  // 更新查询参数并重新加载数据
  router.push({
    name: 'ChatBox',
    query: {
      message: JSON.stringify(selectedMessage),
      orders: JSON.stringify(response.data)

    }
  }).then(() => {

    fetchUserMessages();
  });
};




onMounted(fetchUserMessages);
</script>


<style scoped>
.message-list {
  width: 300px;
  overflow-y: auto;

}

.flex-container {
  display: flex;
  align-items: center; /* 垂直居中 */
}

.avatar-img {
  width: 40px; /* 或你需要的尺寸 */
  height: 40px;
  border-radius: 50%; /* 圆形头像 */
  margin-right: 10px; /* 头像和名字之间的间距 */
}
.container {
  display: flex;
  margin-top: 120px;
}

.message-list {
  min-width: 100px; /* 最小宽度 */
}

.router-view {
  flex-grow: 1;
}
.selected {
  background-color: #b3d4fc;
}

</style>
