<template>
  <div>{{ showText }}</div>
  <button>创建钱包</button>
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

//创建账户
const account = web3Ins.eth.accounts.create("123");

console.warn(account.address);
console.warn(account.privateKey);

//获取余额
const mount = web3Ins.eth.getBalance(account.address);
console.error(mount);
</script>

<style lang="scss">
div {
  color: red;
}
</style>
