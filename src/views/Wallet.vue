<template>
  <van-space>
    <van-button type="primary" @click="createWallet">创建钱包</van-button>
    <van-button type="primary">导入钱包</van-button>
  </van-space>

  <template v-if="showMn">
    <van-button size="mini" @click="confirmSaveMnemonic">我已经保存</van-button>
    <p>
      {{
        mnemonic ||
        "target slush suspect faith route black cabbage document short mobile text lock"
      }}
    </p>
  </template>

  <van-dialog
    v-model:show="showDialog"
    title="请输入密码"
    show-cancel-button
    @confirm="confirmPassword"
  >
    <van-cell-group inset>
      <van-field
        v-model="password"
        label="密码："
        placeholder="请输入密码"
        type="password"
      ></van-field>
    </van-cell-group>
  </van-dialog>

  <van-dialog
    v-model:show="showConfirmMnDialog"
    title="请输入助记词"
    show-cancel-button
    @confirm="confirmMn"
  >
    <van-cell-group inset>
      <van-field
        v-model="saveMn"
        label="助记词："
        placeholder="请输入助记词"
      ></van-field>
    </van-cell-group>
  </van-dialog>
</template>

<script setup>
import { showNotify } from "vant";
import { ref } from "vue";

import * as bip39 from "bip39";

const showDialog = ref(false);
const username = ref("");
const password = ref("");
const mnemonic = ref("");

const showMn = ref(false);
const showConfirmMnDialog = ref(false);
const saveMn = ref("");


const createWallet = () => {
  showDialog.value = true;
};

const confirmPassword = () => {
  console.log(password.value);
  if (password.value == "") {
    showNotify({ type: "danger", message: "请输入密码" });
  } else {
    //创建助记词
    mnemonic.value = bip39.generateMnemonic();
    showMn.value = true;
  }
};

const confirmSaveMnemonic = () => {
  showConfirmMnDialog.value = true;
};


const confirmMn = () => {
    console.log(mnemonic.value)
    console.log(saveMn.value)

};
</script>
