
<template>
  <div class="chat-container">
    <div class="messages">
      <div v-for="(msg, index) in messages" :key="index" class="message">
        {{ msg }}
      </div>
    </div>
    <div class="input-area">
      <input v-model="message" type="text" placeholder="输入消息" />
      <button @click="sendMessage">发送消息</button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import SockJS from 'sockjs-client';
import Stomp from 'webstomp-client';
import {getToken} from "../../utils/token-utils";

let stompClient = null;
const message = ref("");
const messages = ref([]);



onUnmounted(() => {
  if (stompClient !== null) {
    stompClient.disconnect();
  }
});

const sendMessage = () => {
  if (message.value.trim()) {
    const messageObject = { text: message.value, receiverId: 3 };
    const messageString = JSON.stringify(messageObject);
    stompClient.send("/app/hello", messageString);
    message.value = "";
  }
};

onMounted(() => {
  const socket = new SockJS('http://localhost:8088/websocket');
  stompClient = Stomp.over(socket);

  //  JWT 令牌存储在 localStorage 中
  const jwtToken = getToken();

  stompClient.connect({'Authorization': jwtToken}, frame => {
    stompClient.subscribe('/user/queue/reply', (message) => {
      console.log('接收到的信息:', message.body); // 打印出消息内容进行检查
      try {
        const receivedMessage = JSON.parse(message.body);
        messages.value.push(receivedMessage.text);
      } catch (error) {
        console.error('Error parsing JSON:', error);
      }
    });
  }, error => {
    console.error('Connection error:', error);
  });

});

</script>

<style>
.chat-container {
  margin: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 10px;
  margin-top: 200px;
}

.messages {
  margin-bottom: 20px;
  max-height: 300px;
  overflow-y: auto;
}

.message {
  padding: 10px;
  margin: 5px;
  background: #f0f0f0;
  border-radius: 5px;
}

.input-area {
  display: flex;
}

.input-area input {
  flex-grow: 1;
  padding: 10px;
  margin-right: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.input-area button {
  padding: 10px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}

.input-area button:hover {
  background-color: #0056b3;
}
</style>




