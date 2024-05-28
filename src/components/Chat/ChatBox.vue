<!--ChatBox.vue-->
<template>
  <div v-if="message1" class="main-container">
    <div class="chat-container">
      <div class="chat-title">
        {{ currentUserId !== message1.chatRecordVOList[0].receiverId ? message1.chatRecordVOList[0].name : message1.chatRecordVOList[0].senderNickname }}
      </div>

      <el-card class="chat-card">
        <div class="message-container" ref="messageContainer">
          <div v-for="message in message1.chatRecordVOList" :key="message.id" class="message" :class="{ 'sent': isSentByCurrentUser(message), 'received': !isSentByCurrentUser(message) }">
            <div class="timestamp">{{ formatTimestamp(message.timestamp) }}</div>
            <div class="message-content">{{ message.messageContent }}</div>
          </div>
        </div>
      </el-card>
      <div class="send-container">
        <el-input v-model="newMessage" placeholder="输入消息..."></el-input>
        <el-button type="primary" @click="sendMessage">发送</el-button>
      </div>
    </div>
    <div class="right6666">
      <el-table :data="pagedOrders" @row-click="handleRowClick">
        <el-table-column prop="bookingId" label="订单ID"></el-table-column>
        <el-table-column prop="hotelName" label="产品名称"></el-table-column>
        <el-table-column prop="paymentTime" label="交易时间"></el-table-column>
        <el-table-column prop="totalPrice" label="价格"></el-table-column>
      </el-table>

      <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[6, 12, 18, 24]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="orders.length">
      </el-pagination>
    </div>
  </div>
  <div v-else>
    请选择一个信息聊天
  </div>
</template>

<script setup>
import { ElCard, ElInput, ElButton ,} from 'element-plus';
import {onMounted, ref, watch, onBeforeMount, onUnmounted, nextTick, computed} from 'vue';
import { useRoute } from 'vue-router';
import { defineProps } from 'vue';

import { useUserStore } from '../../stores/userStore';

import {getToken} from "../../utils/token-utils";
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import userOrders from "./UserOrders.vue";
import UserOrders from "./UserOrders.vue";
import {getAllBookings} from "../../api/hotel";

const userStore = useUserStore();
const userInfo = userStore.userInfo;
let currentUserId= null;
const route = useRoute();
const selectedMessageId = ref(null);


const messageContainer = ref(null);
const hotelId = ref('');

const name = ref('聊天室');
const newMessage = ref('');

const message1 = ref({});

currentUserId= userStore.userInfo.id;
message1.value=(JSON.parse(route.query.message));
console.log(message1.value)
let stompClient = null;
const orders = ref([]);
const currentPage = ref(1);
const pageSize = ref(6);


const pagedOrders = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return orders.value.slice(start, end);
});

const handleRowClick = (row) => {
  newMessage.value = `http://localhost:8088/hotel/bookingId=${row.bookingId}`
  console.log(`订单号 ${row.bookingId} 已填充到消息中`);
};

const handleCurrentChange = (newPage) => {
  currentPage.value = newPage;
};

const handleSizeChange = (newSize) => {
  pageSize.value = newSize;
  currentPage.value = 1; // 重置到第一页
};


// 用来提交给后端的表单数据
const message =ref({
  senderId:userInfo.id,
  receiverId:'',
  messageContent:'',
  orderId:'',
  hotelId:'',
  timestamp: new Date()
});

const messages = [

];
const isSentByCurrentUser = (message) => {
  return message.senderId === currentUserId;
};
const sendMessage = async () => {
  if (newMessage.value.trim() !== '') {
    const messageToSend = {
      ...message.value,
      messageContent: newMessage.value
    };
    console.log('发送的信息',messageToSend)
    // 将消息发送到后端
    if (stompClient && stompClient.connected) {
      stompClient.send('/app/hello', JSON.stringify(messageToSend));
    }
    try {
      message1.value.chatRecordVOList.push({
        id: Date.now(),
        messageContent: newMessage.value,
        senderId:userInfo.id,
        timestamp: new Date()
      });

      newMessage.value = '';
      await nextTick(() => {
        if (messageContainer.value) {
          messageContainer.value.scrollTop = messageContainer.value.scrollHeight;
        }
      });
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }
};

const formatTimestamp = (timestamp) => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

onMounted(() => {
  // 建立 SockJS 连接
  const socket = new SockJS('http://localhost:8088/websocket');
  stompClient = Stomp.over(socket);
  //  JWT 令牌存储在 localStorage 中
  const jwtToken = getToken();

  stompClient.connect({'Authorization': jwtToken}, frame => {
    // 订阅私人消息通道
    stompClient.subscribe('/user/queue/reply', (message) => {
      try {
        const receivedMessage = JSON.parse(message.body);
        console.log('收到消息',receivedMessage)
        message1.value.chatRecordVOList.push({
          id: Date.now(),
          messageContent: receivedMessage.messageContent,
          timestamp: new Date()
        });
      } catch (error) {
        console.error('错误:', error);
      }
    });
  });
});

onUnmounted(() => {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
});
onBeforeMount(() => {
  if (route.query.message) {
    try {
      currentUserId = userStore.userInfo.id;
      message1.value = JSON.parse(route.query.message);
      console.log(message1.value.chatRecordVOList[0].receiverNickname);
      hotelId.value = message1.value.chatRecordVOList[0].hotelId;
      console.log('酒店好好好',hotelId.value)
      message.value.hotelId = hotelId.value
      message.value.orderId = message1.value.chatRecordVOList[0].orderId
      if(message1.value.chatRecordVOList[0].receiverId===currentUserId){
        message.value.receiverId = message1.value.chatRecordVOList[0].senderId
      }else{
        message.value.receiverId = message1.value.chatRecordVOList[0].receiverId
      }

    } catch (e) {
      console.error('错误:', e);
    }
  }
});

let  id = null;

watch(() => route.query.message, (newMessage) => {
 // console.log('监听',newMessage)
  if (newMessage) {
    try {
      message1.value = JSON.parse(newMessage);
      hotelId.value = message1.value.chatRecordVOList[0].hotelId
      console.log('监听酒店Id',hotelId.value)
      orders.value = JSON.parse(route.query.orders)
    } catch (e) {
      console.error('错误:', e);
    }
  }
});
</script>

<style scoped>
.main-container {
  display: flex;
  justify-content: space-between;
}

.chat-container {
  width: 600px;
  margin-left: 200px;
  display: flex;
  flex-direction: column;
  margin-top: -30px;
  height: 600px;
}

.right6666 {
  margin-right: 300px;
  width: 700px;
}

.chat-card {
  display: flex;
  flex-direction: column;
  height: 600px;
  /*flex-grow: 1;*/
  overflow-y: auto;
  padding: 10px;
}
.chat-title {
  text-align: center;
  font-size: 1.2em;
  font-weight: bold;
  padding: 10px;
  border-bottom: 1px solid #ccc; /* 可选的底部边框 */
  margin-bottom: 10px; /* 和下方内容的间距 */
}
.message-content {
  word-break: break-word; /* 确保长文本能够换行 */
  padding: 10px; /* 添加内边距以使文本不会紧贴气泡边缘 */
  border-radius: 10px; /* 圆角 */
  display: inline-block; /* 使元素的宽度随内容变化 */
}
.orders-container {
  flex-basis: 300px; /* 指定订单容器的宽度 */
  /* 可以添加更多样式，如边框、内边距等 */
}

.message {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
}

.sent {
  background-color: #f0f9eb;
  margin-left: 200px;
  align-self: flex-end;
}

.received {
  background-color: #eef1f6;
  align-self: flex-start;
}

.message-content {
  max-width: 70%;
  word-break: break-word;
}
.message {
  position: relative; /* 为气泡添加定位基准 */
  max-width: 70%;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
}

.sent, .received {
  align-self: flex-start;
}

.sent {
  background-color: #f0f9eb;
  align-self: flex-end;
  text-align: -webkit-right;
}

.received {
  background-color: #eef1f6;
}


.sent::after {
  content: '';
  position: absolute;
  right: -10px;
  top: 10px;
  border: 5px solid transparent;
  border-left-color: #f0f9eb;
  border-right: 0;
}


.received::after {
  content: '';
  position: absolute;
  left: -10px;
  top: 10px;
  border: 5px solid transparent;
  border-right-color: #eef1f6;
  border-left: 0;
}

.send-container {
  display: flex;
  margin-top: 10px;
}

.send-container .el-input {
  flex-grow: 1;
  margin-right: 10px;
}
.timestamp {
  text-align: center;
  color: #888;
  font-size: 0.8em;
  margin-bottom: 5px;
}
</style>
