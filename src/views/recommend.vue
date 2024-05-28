<!--recommend.vue-->
<script setup>
import {ref, watch} from 'vue'
import Banner from './banner.vue'

import Recommendlist from './recommend-list.vue'
import {searchHotels} from "../api/hotel";

const props = defineProps({
  formData: Object
});

console.log('recommend.vue',props.formData)
</script>


<template>
<div class="recommend">
    <div class="recommend-left">
        <h2>推荐酒店</h2>
      <Recommendlist :formData="props.formData" />
    </div>
    <div class="recommend-right">
        <Banner />
    </div>
</div>

</template>

<style scoped>

</style>
