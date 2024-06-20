<template>
  <div class="payment-success">
    <h1>支付成功</h1>
    <p v-if="paymentInfo">
      <strong>订单号:</strong> {{ paymentInfo.outTradeNo }}<br>
      <strong>交易号:</strong> {{ paymentInfo.tradeNo }}<br>
      <strong>交易金额:</strong> {{ paymentInfo.totalAmount }} 元
    </p>
    <p v-else>正在获取支付信息...</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      paymentInfo: null,
    };
  },
  mounted() {
    fetch("http://121.41.107.127:8088/alipay/payment-success" + window.location.search)
        .then(response => response.json())
        .then(data => {
          this.paymentInfo = data;
        })
        .catch(error => {
          console.error('Error fetching payment info:', error);
        });
  }
};
</script>

<style>
.payment-success {
  text-align: center;
  margin-top: 50px;
}
</style>
