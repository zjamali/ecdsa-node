import { useState } from "react";
import server from "./server";
import { utf8ToBytes, toHex } from "ethereum-cryptography/utils.js";
import { keccak256 } from "ethereum-cryptography/keccak.js";
import { secp256k1 } from "ethereum-cryptography/secp256k1.js";

BigInt.prototype.toJSON = function () {
  return { $bigint: this.toString() };
};

function Transfer({
  address,
  setBalance,
  privateKey,
  signiture,
  setSigniture,
}) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const transaction = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
    };
    const hashedTransaction = hashMessage(JSON.stringify(transaction));
    const signedTransaction = signTransaction(hashedTransaction, privateKey);
    setSigniture(signedTransaction.s.toString());

    try {
      const {
        data: { balance },
      } = await server.post(`send`, {
        transaction,
        signature: signedTransaction,
      });
      setBalance(balance);
    } catch (ex) {
      alert(ex.response.data.message);
    }
  }

  function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
  }

  function signTransaction(hashedTransaction, privateKey) {
    return secp256k1.sign(hashedTransaction, privateKey);
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Signiture
        <input
          placeholder="Signiture"
          value={signiture}
          onChange={setValue(setSigniture)}
          disabled={true}
        ></input>
      </label>
      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
