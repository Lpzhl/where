<!-- FlightBooking.vue -->
<template>
  <div class="head-calendar-scroll">
    <!-- 向左的箭头-->
    <button class="arrow-left" @click="scrollCalendar(-1)"></button>

    <div class="calendar-main">
      <transition name="fade" mode="out-in">
        <ul class="calendar-ul" :key="currentIndex">
          <li v-for="day in currentDays" :key="day.date">{{ day.date }} {{ day.price }}</li>
        </ul>
      </transition>
    </div>

    <!-- 向右的箭头-->
    <button class="arrow-right" @click="scrollCalendar(1)"></button>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';


const calendarDays = ref([
  { date: '11-11 周六', price: '¥1110' },
  { date: '11-12 周日', price: '¥1260' },
  { date: '11-13 周六', price: '¥1110' },
  { date: '11-14 周日', price: '¥1260' },
  { date: '11-15 周六', price: '¥1110' },
  { date: '11-16 周日', price: '¥1260' },
  { date: '11-17 周六', price: '¥1110' },
  { date: '11-18 周日', price: '¥1260' },
  { date: '11-19 周六', price: '¥1110' },
  { date: '11-20 周日', price: '¥1260' },
  { date: '11-21 周六', price: '¥1110' },
  { date: '11-22 周日', price: '¥1260' },
  { date: '11-23 周六', price: '¥1110' },
  { date: '11-24 周六', price: '¥1110' },
  { date: '11-25 周六', price: '¥1110' },
  { date: '11-20 周日', price: '¥1260' },
  { date: '11-21 周六', price: '¥1110' },
  { date: '11-22 周日', price: '¥1260' },
  { date: '11-23 周六', price: '¥1110' },
  { date: '11-24 周六', price: '¥1110' },
  { date: '11-25 周六', price: '¥1110' },

]);

const currentIndex = ref(0);

const currentDays = computed(() => {
  const start = currentIndex.value * 7;
  const end = start + 7;
  return calendarDays.value.slice(start, end);
});

const scrollCalendar = (direction) => {
  const maxIndex = Math.floor((calendarDays.value.length - 1) / 7);

  if (direction === 1 && currentIndex.value < maxIndex) {
    currentIndex.value += 1;
  } else if (direction === -1 && currentIndex.value > 0) {
    currentIndex.value -= 1;
  }
};
</script>


<style lang="scss" scoped>

.head-calendar-scroll{
  display: flex;
}

.arrow-con {
  cursor: pointer;
}

.arrow-left,
.arrow-right {
  width: 30px;
  height: 80px;
  color: black;
}



.calendar-main {
  display: flex;
  align-items: center;
}

.calendar-ul {
  display: flex;
  transition: transform 0.3s ease;
  margin-left: -40px;
}

li {
  list-style: none;
  margin: 0 10px;
  padding: 10px;
  cursor: pointer;
  border: 1px solid #007BFF;
  border-radius: 5px;
}

.day-info {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.bold {
  font-weight: bold;
}


.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>