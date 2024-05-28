<template>
  <div id="container" ref="mapContainer" style="width: 100%; height: 100%;"></div>
</template>

<script>
import { onMounted, ref } from "vue";
import AMapLoader from "@amap/amap-jsapi-loader";

export default {
  setup() {
    const mapContainer = ref(null);

    onMounted(() => {
      AMapLoader.load({
        key: "b6410e83e964cfac1e7d0514bb7d0fb4", // 您的高德地图开发者 Key
        version: "2.0", // JS API 的版本
        AMapSecurityConfig: {
          securityJsCode: "0457224fde0f5f7a4ddc51092ed614ad",
        },
      })
          .then((AMap) => {
            new AMap.Map(mapContainer.value, {
              resizeEnable: true,
              center: [116.397428, 39.90923],
              zoom: 13,
            });
          })
          .catch((e) => {
            console.error(e); // 加载错误提示
          });
    });

    return { mapContainer };
  },
};
</script>

<style>
#container {
  width: 100%;
  height: 100%;
}
</style>
