<template>
  <h1>助记词</h1>
  <p>{{ mnemonciSave }}</p>

  <h1>路径</h1>
  <p>m/44'/60/0'/0'/0/0</p>

  <h1>账号地址</h1>
  <p>0x1e1c929da25b99f2a7c3a4f4c8de6151719e0678</p>

  <h1>账号私钥</h1>
  <p>840ef006deb7e8ad84b2166e5598d4691786ff59d505650a4043d6fab6cd7af8</p>
</template>

<script setup>
import { ref } from "vue";
import { generateMnemonic, mnemonicToSeed } from "bip39";
import ethwallet, { hdkey } from "ethereumjs-wallet";
import { onMounted } from "vue";
import Web3 from "web3";
import { Buffer } from "buffer";

onMounted(() => {
  genMnemonic();
});
//创建助记词
// const mnemonci = generateMnemonic();
// console.log(mnemonci);

const mnemonciSave = ref(
  "panic double van adapt rookie lock circle you violin odor island strong"
);

//根据助记词 生成 秘钥对
const genMnemonic = async () => {
  //获取种子
  const seed = await mnemonicToSeed(mnemonciSave.value);
  console.log(seed);
  const hdWallet = hdkey.fromMasterSeed(seed);
  //m/purpse'/coin_type'/account'/change/address_index
  const keypair = hdWallet.derivePath("m/44'/60/0'/0'/0/0");
  console.log(keypair);

  //获取私钥
  //根据秘钥对 获取钱包对象
  const wallet = keypair.getWallet();
  console.log(wallet);

  //根据钱包对象获取钱包地址
  const lowerCaseAddress = wallet.getAddressString();
  console.log("lowerCaseAddress", lowerCaseAddress);
  //根据钱包对象获取钱包校验地址
  const checkAddress = wallet.getChecksumAddressString();
  console.log("checkAddress", checkAddress);
  //获取私钥
  const privateKey = wallet.getPrivateKey().toString("hex");
  const privateKeyFormat = wallet.getPrivateKey();

  console.log("privateKey", privateKey);

  // 根据私钥+密码 获取 keystore
  //1.web3js
  let web3Ins = new Web3(
    Web3.givenProvider ||
      "wss://goerli.infura.io/ws/v3/c0b3b16253fb4528962978ae6b6ed58b"
  );
  const keyStore = await web3Ins.eth.accounts.encrypt(
    privateKeyFormat,
    "111111"
  );

  console.warn(keyStore);

  //通过keyStore获取私钥
  const res = await web3Ins.eth.accounts.decrypt(keyStore, "111111");
  console.log(res);

  //wallet
  //2.wallet对象 + 密码 获取keysotre
  const walletKeyStore = await wallet.toV3("111111");
  // console.warn(walletKeyStore);
  //从keyStore获取钱包
  const walletFromKeyStore = await ethwallet.fromV3(walletKeyStore, "111111");
  console.warn(walletFromKeyStore);
  //钱包获取私钥
  const key = walletFromKeyStore.getPrivateKey().toString("hex");
  console.warn(key);

  //复制私钥
  const privateKeySame = Buffer(privateKey, "hex");
  //私钥获取钱包
  const walletSame = ethwallet.fromPrivateKey(privateKeySame);
  //钱包获取地址
  const lowerCaseAddressFromWalletSame = walletSame.getAddressString();
  console.error(lowerCaseAddressFromWalletSame);
};
</script>
