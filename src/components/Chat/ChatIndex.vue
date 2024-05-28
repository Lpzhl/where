<!--ChatIndex.vue-->
<template>
  <div class="app-container">
    <MessageList @select-message="handleSelectMessage" />
    <ChatBox :selected-message="selectedMessage" />
  </div>
</template>

<script setup>

import { ref } from 'vue';
import MessageList from './MessageList.vue';
import ChatBox from './ChatBox.vue';

const selectedMessage = ref(null);

const handleSelectMessage = (message) => {
  console.log("Selected message:", message);
  selectedMessage.value = message;
};

</script>

<style scoped>

.app-container {
  display: flex;
  margin-top: 100px;
}

.left-panel {
  flex: 1;
  max-width: 100px; /* 或者您希望的宽度 */
}

.right-panel {
  flex: 2;
}
</style>