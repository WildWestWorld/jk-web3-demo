<template>
  <h1>账户信息:</h1>
  <van-divider />
  <p>地址:{{ address }}</p>
  <p>私钥:0xb1ac8f351906fc174e20d917768d1ad8159947d0706b82c53c8cb01d70aa2f3e</p>
  <p>余额:{{ mount }}</p>
  <van-divider />
  <h1>转账操作</h1>
  <van-divider />
  <van-button type="primary" @click="send">开始转账</van-button>
</template>

<script setup>
import { ref } from "vue";

// 导入Web3
import Web3 from "web3";

const showText = ref("Hello Web3！");
// Web3.givenProvider 默认是没有的
let web3Ins = new Web3(
  Web3.givenProvider ||
    "wss://goerli.infura.io/ws/v3/c0b3b16253fb4528962978ae6b6ed58b"
);

// // //创建账户
// const account = web3Ins.eth.accounts.create("123");

// console.warn(account.address);
// console.warn(account.privateKey);

const address = ref("0x15F67796B9df93C862826d7A9733f766b34C3E1b");

// //获取余额
const mount = ref(0);

web3Ins.eth.getBalance(address.value).then((res) => {
  console.log(res);
  mount.value = web3Ins.utils.fromWei(res, "ether");
});
console.error(mount);
//单位转换
const num1 = web3Ins.utils.toWei("0.3", "ether");
console.warn(num1);
// 1ehter = 10^18Wei
const num2 = web3Ins.utils.fromWei("3000000", "ether");
console.warn(num2);

// 转账操作

const send = async () => {
  //1.构建转账参数
  //获取账户交易次数
  const nonce = await web3Ins.eth.getTransactionCount(address.value);
  console.log(nonce);
};
</script>

<style lang="scss">
body {
  padding: 20px !important;
}
</style>
