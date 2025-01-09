import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";
import { toHex, hexToBytes } from "ethereum-cryptography/utils.js";
import { useEffect, useState } from "react";

function Wallet({
  address,
  setAddress,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
  wallets,
}) {
  const [owner, setOwner] = useState("");

  async function onChange(evt) {
    const privateKey = evt.target.value;
    setPrivateKey(privateKey);
    const addreesBytes = secp256k1.getPublicKey(hexToBytes(privateKey));
    const selectedWallet = wallets.filter(
      (wallet) => wallet.privateKey === privateKey
    )[0];
    setOwner(selectedWallet.owner);
    setAddress(toHex(addreesBytes));
  }

  async function getBalance(address) {
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  useEffect(() => {
    getBalance(address);
  }, [address]);

  return (
    <div className="container wallet">
      <h1> Wallet {owner} </h1>
      <label for="wallet-key">
        Private Key
        <input
          placeholder="Type a Private key, for example: 90e4fa0654606bd7cbf182f188d884881d1a2c8fbd6a006d9cb4188d2ca7f534"
          value={privateKey}
          onChange={onChange}
          id="wallet-key"
        ></input>
      </label>
      <label for="wallet-address">
        Wallet Addresse
        <input value={address} disabled={true} id="wallet-address"></input>
      </label>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
