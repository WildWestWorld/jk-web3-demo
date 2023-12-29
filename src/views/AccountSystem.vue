<template>
  <h1>助记词</h1>
  <p>panic double van adapt rookie lock circle you violin odor island strong</p>
</template>

<script setup>
import { ref } from "vue";
import {generateMnemonic} from "bip39"


//创建助记词
const mnemonci = generateMnemonic();

console.log(mnemonci);
</script>
