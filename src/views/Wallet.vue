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
        "hospital uphold clerk tenant noble soap tide throw chef local off problem"
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

  <!-- accountList 账号列表 -->
  <div>
    <van-space direction="vertical">
      <van-cell
        :title="item.address"
        icon="user-o"
        v-for="item in walletInfoAddressFilter"
      >
        <template #right-icon>
          <van-button size="small">{{ item.balance }}</van-button>
        </template>
      </van-cell>
    </van-space>
  </div>
</template>

<script setup>
import { showNotify } from "vant";
import { ref } from "vue";

import * as bip39 from "bip39";
import { hdkey } from "ethereumjs-wallet";

import store2 from "store2";
import { onMounted } from "vue";
import { computed } from "vue";

import { Buffer } from "buffer";

// 导入Web3
import Web3 from "web3";
//生成serializedTx 生成链上的Tx
//Vite 需要安装依赖 //npm add node-stdlib-browser
// npm add -D vite-plugin-node-stdlib-browser
//   vite.config  配置nodePolyfills(),
import Tx from "ethereumjs-tx";

// Web3.givenProvider 默认是没有的
let web3Ins = new Web3(
  Web3.givenProvider ||
    "wss://goerli.infura.io/ws/v3/c0b3b16253fb4528962978ae6b6ed58b"
);

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
    const walletInfo = store2.get("walletInfo");
    if (walletInfo) {
      mnemonic.value = walletInfo[0]["mnemonic"];
      confirmMn();
    } else {
      //创建助记词
      mnemonic.value = bip39.generateMnemonic();

      showMn.value = true;
    }
    // mnemonic.value = walletInfo
    //   ? walletInfo[0]["mnemonic"]
    //   : bip39.generateMnemonic();
  }
};

const confirmSaveMnemonic = () => {
  showConfirmMnDialog.value = true;
};

const confirmMn = async () => {
  console.log(mnemonic.value);
  console.log(saveMn.value);
  showMn.value = false;
  const walletInfoSave = store2.get("walletInfo") || [];

  if (mnemonic.value !== saveMn.value && walletInfoSave.length == 0) {
    return;
  }

  //地址索引
  const addressIndex =
    walletInfoSave.length == 0 ? 0 : walletInfoSave.length + 1;

  //根据助记词创建种子
  const seed = await bip39.mnemonicToSeed(mnemonic.value);
  //根据种子创建钱包
  const hdWallet = hdkey.fromMasterSeed(seed);
  //根据钱包生成密钥对
  const keyPair = hdWallet.derivePath(`m/44'/60'/0'/${addressIndex}`);
  //密钥对获取钱包
  const wallet = keyPair.getWallet();

  //地址
  const lowerCaseAddress = wallet.getAddressString();
  //校验地址
  const checkSumAddress = wallet.getChecksumAddressString();
  //私钥
  const privateKey = wallet.getPrivateKey().toString("hex");
  //keyStore
  const keyStore = await wallet.toV3(password.value);
  const walletObj = {
    id: addressIndex,
    address: lowerCaseAddress,
    privateKey: privateKey,
    keyStore: keyStore,
    mnemonic: mnemonic.value,
    balance: 0,
  };
  walletInfoSave.push(walletObj);
  store2("walletInfo", walletInfoSave);
  console.log(walletInfoSave);
};

// 账号列表

// 账号列表变量
const walletInfoAccount = ref(store2.get("walletInfo") || []);

const walletInfoAddressFilter = computed(() => {
  walletInfoAccount.value.forEach(async (item) => {
    let originalAddress = item.address;
    //根据地址获取余额
    item.balance = await web3Ins.eth.getBalance(originalAddress);
    console.log(item.balance)
  });
  return walletInfoAccount.value;
});

onMounted(() => {
  console.log(walletInfoAccount);
});
</script>
