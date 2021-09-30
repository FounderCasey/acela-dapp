import { useState, useEffect } from "react";
import "./App.css";
import { ReactComponent as Icon } from "./assets/icon.svg";
import { ethers } from "ethers";
import Token from "./artifacts/contracts/Token.sol/Token.json";

const tokenAddress = "0xa6fedAf1699DbEba111389b5036024d67E3504eE";

function App() {
  const [userAccount, setUserAccount] = useState();
  const [amount, setAmount] = useState();
  const [totalBalance, setTotalBalance] = useState();
  const [loading, setLoading] = useState();

  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        console.log("Found an authorized account:", account);
        setUserAccount(account);
        getBalance();
      } else {
        console.log("No authorized account found");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setUserAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  async function getBalance() {
    if (window.ethereum) {
      try {
        const [account] = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const contract = new ethers.Contract(tokenAddress, Token.abi, provider);
        let balance = await contract.balanceOf(account);
        balance = parseInt(balance.toString());
        setTotalBalance(
          balance.toFixed(2).replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,")
        );
      } catch (err) {
        console.log(err.message);
      }
    }
  }

  async function sendCoins() {
    setLoading(true);
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(tokenAddress, Token.abi, signer);
        const transation = await contract.transfer(userAccount, amount);
        await transation.wait();
        console.log(`${amount} Coins successfully sent to ${userAccount}`);
      }
    } catch (err) {
      console.log(err.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    checkIfWalletIsConnected();
  });

  return (
    <div className="App">
      <nav>
        <Icon />
      </nav>
      <main>
        <h1>
          <Icon /> {totalBalance || "XX,XXX"}
        </h1>

        {!userAccount ? (
          <button className="waveButton slideup" onClick={connectWallet}>
            Connect Wallet
          </button>
        ) : (
          <>
            <label>Send ALA</label>

            <input
              type="text"
              onChange={(e) => setUserAccount(e.target.value)}
              placeholder="Wallet Address"
            />
            <input
              type="number"
              min="0"
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount"
            />
            <button onClick={sendCoins}>
              {!loading ? "" : <div className="spinner"></div>}
              {loading ? "Sending..." : "Send ALA"}
            </button>
          </>
        )}
      </main>
    </div>
  );
}

export default App;
