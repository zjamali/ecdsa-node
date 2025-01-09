const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {
  genenrateWallet,
  verifyTransaction,
  recoverPublicKeyFromTransaction,
} = require("./scripts/crypto");
app.use(cors());
app.use(express.json());

const wallets = [
  {
    owner: "Alice",
    privateKey:
      "90e4fa0654606bd7cbf182f188d884881d1a2c8fbd6a006d9cb4188d2ca7f534",
    address:
      "025baeb3a3fe21b132327d30bfb9c253a113fc4ae913af00dbcd070c0a25d768c3",
  },
  {
    owner: "Bob",
    privateKey:
      "b162fad59c68613f32e99e58ad587a4eac666fcc4df69a35ee6067500f8972b8",
    address:
      "0344ac01d90724cd8f71c020f3e46d844bfff31613d235851a5c76d9ba761ab5f0",
  },
];

let balances = {
  "025baeb3a3fe21b132327d30bfb9c253a113fc4ae913af00dbcd070c0a25d768c3": 100,
  "0344ac01d90724cd8f71c020f3e46d844bfff31613d235851a5c76d9ba761ab5f0": 50,
};

app.get("/wallets", (req, res) => {
  const walletsWithBalance = wallets.map((wallet) => {
    return { ...wallet, balance: balances[wallet.address] };
  });
  res.send(walletsWithBalance);
});

app.post("/wallets", (req, res) => {
  const { name, balance } = req.body;
  const wallet = genenrateWallet();
  console.log("wallet : ", wallet);
  const newBalance = new Object();
  newBalance[wallet.address.toString()] = parseInt(balance);
  balances = {
    ...balances,
    ...newBalance,
  };
  console.log(balances);
  wallets.push({
    ...wallet,
    owner: name,
  });
  const walletsWithBalance = wallets.map((wallet) => {
    return { ...wallet, balance: balances[wallet.address] };
  });
  res.send(walletsWithBalance);
});

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { transaction, signature } = req.body;

  const { sender, recipient, amount } = transaction;
  const r = BigInt(signature.r["$bigint"]);
  const s = BigInt(signature.s["$bigint"]);
  const recovery = signature.recovery;

  console.log(
    "verifyTransaction : ",
    verifyTransaction({ r: r, s: s, recovery }, transaction, sender)
  );

  const senderPublicKey = recoverPublicKeyFromTransaction(
    { r: r, s: s, recovery },
    transaction
  );

  setInitialBalance(senderPublicKey);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
