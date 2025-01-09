const { toHex, utf8ToBytes} = require("ethereum-cryptography/utils.js");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const {keccak256} = require("ethereum-cryptography/keccak.js")

const privateKey = secp256k1.utils.randomPrivateKey();
console.log(toHex(privateKey));
console.log(toHex(secp256k1.getPublicKey(privateKey)));

function genenrateWallet() {
  const privateKey = secp256k1.utils.randomPrivateKey();
  return {
    privateKey: toHex(privateKey),
    address: toHex(secp256k1.getPublicKey(privateKey)),
  };
}

function verifyTransaction(signature, transaction, publicKey) {
  const hashTransaction = keccak256(utf8ToBytes(JSON.stringify(transaction)));
  return secp256k1.verify(signature, hashTransaction, publicKey);
}

function recoverPublicKeyFromTransaction(signature,transaction) {
  const sig = new secp256k1.Signature(signature.r,signature.s,signature.recovery)
  const data = JSON.stringify(transaction);
  const hash = keccak256(utf8ToBytes(data));
  const publicKey = sig.recoverPublicKey(hash).toHex();
  return publicKey;
}

module.exports = {
  genenrateWallet,
  verifyTransaction,
  recoverPublicKeyFromTransaction,
};
