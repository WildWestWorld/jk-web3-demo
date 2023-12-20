<template>
  <div>{{ showText }}</div>
  <button>创建钱包</button>
</template>

<script setup>
import { ref } from "vue";

const showText = ref("Hello Web3！");
</script>

<style lang="scss">
div {
  color: red;
}
</style>
