<template>
  <van-space>
    <van-button type="primary" @click="createWallet">创建钱包</van-button>
    <van-button type="primary">导入钱包</van-button>

    <van-dialog v-model:show="showDialog" title="请输入密码"></van-dialog>
  </van-space>
</template>

<script setup>
import { ref } from "vue";
const showDialog = ref(false);
const createWallet = () => {
  showDialog.value = true;
};
</script>
