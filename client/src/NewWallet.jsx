import { useState } from "react";
import server from "./server";

function NewWallet({ wallets, setWallets }) {
  const [newWalletOwner, setNewWalletOwner] = useState("");
  const [balance, setBalance] = useState(null);

  async function createNewWallet(evt) {
    console.log(evt);
  }

  function onChangeOwner(evt) {
    const name = evt.target.value;
    setNewWalletOwner(name);
  }

  function onChangeBalance(evt) {
    const blanace = evt.target.value;
    setBalance(blanace);
  }

  async function createNewWallet() {
    if (newWalletOwner.length > 0) {
      const { data } = await server.post("/wallets", {
        name:
          newWalletOwner.slice(0, 1).toUpperCase() +
          newWalletOwner.slice(1, newWalletOwner.length).toLowerCase(),
        balance: balance,
      });
      setWallets(data);
      setNewWalletOwner("");
      setBalance(0);
    }
  }

  return (
    wallets && (
      <div className="app">
        <div className="container wallets">
          <h1>Available Wallets to use</h1>
          {wallets.map((wallet, index) => {
            return (
              <div className="infos" key={index}>
                <div>Owner⠀⠀⠀⠀⠀: {wallet.owner}</div>
                <div>Private Key⠀: {wallet.privateKey}</div>
                <div>Address ⠀⠀⠀: {wallet.address}</div>
                <div>Balanace⠀⠀ : {wallet.balance}</div>
              </div>
            );
          })}
          <div className="new-wallet">
            <label>
              <input
                placeholder="Jhon"
                value={newWalletOwner}
                onChange={onChangeOwner}
              ></input>
            </label>
            <label>
              <input
                placeholder="Balance"
                value={balance}
                onChange={onChangeBalance}
              ></input>
            </label>
            <input
              type="submit"
              className="button"
              value="New Wallet"
              onClick={(evt) => createNewWallet(evt)}
            />
          </div>
        </div>
      </div>
    )
  );
}

export default NewWallet;
