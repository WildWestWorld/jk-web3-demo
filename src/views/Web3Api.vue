<template>
  <h1>账户信息:</h1>
  <van-divider />
  <p>地址:{{ address }}</p>
  <p>私钥:{{ privateKey }}</p>
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
//生成serializedTx 生成链上的Tx
//Vite 需要安装依赖 //npm add node-stdlib-browser
// npm add -D vite-plugin-node-stdlib-browser
//   vite.config  配置nodePolyfills(),
import Tx from "ethereumjs-tx";
import { collapseItemProps } from "vant";

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
const privateKey = ref(
  "0xb1ac8f351906fc174e20d917768d1ad8159947d0706b82c53c8cb01d70aa2f3e"
);

// //获取余额
const mount = ref(0);

web3Ins.eth.getBalance(address.value).then((res) => {
  // console.log(res);
  mount.value = web3Ins.utils.fromWei(res, "ether");
});
// console.error(mount);
//单位转换
const num1 = web3Ins.utils.toWei("0.3", "ether");
// console.warn(num1);
// 1ehter = 10^18Wei
const num2 = web3Ins.utils.fromWei("3000000", "ether");
// console.warn(num2);

// 转账操作
const send = async () => {
  //1.构建转账参数
  //获取账户交易次数
  const nonce = await web3Ins.eth.getTransactionCount(address.value);
  console.log(nonce);
  //获取预计转账的gas 费用
  const gasPrice = await web3Ins.eth.getGasPrice();
  console.warn(gasPrice);
  //转账金额 格式化，以Wei 为单位
  const value = web3Ins.utils.toWei("0.01", "ether");
  console.warn(value);

  //构建原始数据
  const rawTx = {
    from: address.value, //发送地址
    to: "0x15F67796B9df93C862826d7A9733f766b34C3E1b", //接受地址
    nonce: nonce, //当前交易次数
    gasPrice: gasPrice, //手续费
    value: value, //交易金额
    data: "0x0000", //使用的货币
  };

  //2.生成serializedTx 生成链上的Tx
  //得按照依赖 npm i ethereumjs-tx@1.3.7 必须是1.3.7 后续版本有坑

  //转化私钥
  //去除前面的私钥前面的0x
  let privateKeyFormat = privateKey.value.slice(2);
  privateKeyFormat = Buffer(privateKeyFormat, "hex");
  //gas估算
  const gas = await web3Ins.eth.estimateGas(rawTx);
  rawTx.gas = gas;

  //ethereumjs-tx" 实现私钥加密
  const tx = new Tx(rawTx);
  //传入私钥
  tx.sign(privateKeyFormat);
  //生成 serializedTx
  //加上0x
  const serializedTx = `0x${tx.serialize().toString("hex")}`;
  console.warn(serializedTx);
  //3.开始转账
  const trans = web3Ins.eth.sendSignedTransaction(serializedTx);
  //监听 发生交易事件
  //txid=发送的id 也就是交易的id值
  trans.on("transactionHash", (txid) => {
    console.log("交易ID：", txid);
    console.log(`https://goerli.etherscan.io/tx/${txid}`);
  });
  //监听节点确认事件 只要有节点确认就会触发
  trans.on("receipt", (res) => {
    console.log("第1节点确认", res);
  });
  // 每个节点去人都会触发
  trans.on('confirmation',(res)=>{
    console.log("第n个节点确认",res)
  })

};
</script>

<style lang="scss">
body {
  padding: 20px !important;
}
</style>
