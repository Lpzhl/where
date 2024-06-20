<template>
  <div class="chat-container">
    <div class="chat-title">
      <P>{{ name}}</P>
      客服小张
    </div>
    <el-card class="chat-card">
      <div class="message-container" ref="messageContainer">
        <div v-for="message in messages" :key="message.id" class="message" :class="{ 'sent': message.userType === 'me', 'received': message.userType !== 'me' }">
          <div class="timestamp">{{ formatTimestamp(message.timestamp) }}</div>
          <div class="message-content">{{ message.content }}</div>
        </div>
      </div>

    </el-card>
    <div class="send-container">
      <el-input v-model="newMessage" placeholder="输入消息..."></el-input>
      <el-button type="primary" @click="sendMessage">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick ,onMounted,onUnmounted} from 'vue';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
let stompClient = null;

import { useRoute } from 'vue-router';
const route = useRoute();
const booking = ref(null);
import {useUserStore} from '../../stores/userStore'
import {getHotelById, sendChatMessage} from "../../api/chat";
import {getToken} from "../../utils/token-utils";
const userStore = useUserStore();
const userInfo = userStore.userInfo
console.log(userInfo.id)
// 假设当前用户总是 'me'
const currentUserType = 'me';
const name = ref('');
const newMessage = ref('');
const messageContainer = ref(null);
const hotelId = ref('');


// 用来提交给后端的表单数据
const message =ref({
      senderId:userInfo.id,
      receiverId:'',
      userType: currentUserType,
      messageContent:'',
      orderId:'',
      hotelId:'',
      timestamp: new Date()
});


const messages = ref([

]);


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
     /* const response = await sendChatMessage(messageToSend);
      console.log('信息发送成功', response);
*/
      messages.value.push({
        id: Date.now(),
        content: newMessage.value,
        userType: currentUserType,
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


const getHotleByid =async (hotelid) => {
  const response = await getHotelById (hotelid)

  console.log(response.data)
  if(response.data){
    hotelId.value = response.data.hotelId
    message.value.hotelId = hotelId.value
    message.value.receiverId = response.data.ownerId
    console.log(hotelId.value)
  }
}

onMounted(() => {
  if (route.query.booking) {
    try {
      booking.value = JSON.parse(route.query.booking);
      name.value = booking.value.hotelName
      message.value.orderId = booking.value.bookingId
      console.log('接收:', booking.value);
    } catch (error) {
      console.error(error);
    }
  }
  getHotleByid(booking.value.hotelId);
  // 建立 SockJS 连接
  const socket = new SockJS('http://121.41.107.127:8088/websocket');
  stompClient = Stomp.over(socket);
  //  JWT 令牌存储在 localStorage 中
  const jwtToken = getToken();

  stompClient.connect({'Authorization': jwtToken}, frame => {
    // 订阅私人消息通道
    stompClient.subscribe('/user/queue/reply', (message) => {
      try {
        const receivedMessage = JSON.parse(message.body);
        messages.value.push({
          id: Date.now(),
          content: receivedMessage.messageContent, // 使用 JSON 对象的属性
          userType: 'received',
          timestamp: new Date()
        });
      } catch (error) {
        console.error('错误:', error);
      }
    });
  });
});
setTimeout(() => {
  messages.value.push({ id: Date.now(), content: '您好，我是客服，有什么可以帮您的吗？', type: 'received', timestamp: new Date() })
}, 500);

onUnmounted(() => {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
});
</script>

<style scoped>
.chat-container {
  max-width: 600px;
  margin: 20px auto;
  margin-top: 150px;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.chat-card {
  display: flex;
  flex-direction: column;
  height: 600px;
  flex-grow: 1;
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
