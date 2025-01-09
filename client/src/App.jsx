import Wallet from "./Wallet";
import Transfer from "./Transfer";
import "./App.scss";
import { useEffect, useState } from "react";
import server from "./server";
import NewWallet from "./NewWallet";

function App() {
  const [balance, setBalance] = useState(0);
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [wallets, setWallets] = useState([]);
  const [signiture, setSigniture] = useState("");

  async function getAvailableWallets() {
    const { data } = await server.get("/wallets");
    setWallets(data);
  }

  useEffect(() => {
    getAvailableWallets();
  }, [signiture]);

  return (
    <>
      <div className="app">
        <Wallet
          balance={balance}
          setBalance={setBalance}
          address={address}
          setAddress={setAddress}
          privateKey={privateKey}
          setPrivateKey={setPrivateKey}
          wallets={wallets}
        />
        <Transfer
          setBalance={setBalance}
          address={address}
          privateKey={privateKey}
          signiture={signiture}
          setSigniture={setSigniture}
        />
      </div>
      {wallets && <NewWallet wallets={wallets} setWallets={setWallets} />}
    </>
  );
}

export default App;
