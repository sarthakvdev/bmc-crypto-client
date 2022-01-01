import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";
import abi from "../utils/coffeePortal.json";

const Homepage = () => {
  // contract address
  const contractAddress = "";
  // abi contract
  const contractABI = abi.abi;

  const [currentAccount, setCurrentAccount] = useState("dd");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // All coffee
  const [allCoffee, setAllCoffee] = useState([]);

  const toastConfigRight = {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  };

  const toastConfigLeft = {
    position: "top-left",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  }

  // Check the authorization to access the wallet
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      const accounts = ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        toast.success("🦄 Wallet is connected", toastConfigRight);
      } else {
        toast.warn("Make sure you have a Metamask connected!", toastConfigRight);
      }
    } catch (error) {
      toast.error(`${error.message}`, toastConfigRight);
    }
    return ethereum ? true : false;
  };

  // connect Wallet method
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if(!ethereum) {
        toast.warn("Make sure your Metamask is connected!", toastConfigRight);
        return;
      }

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const buyCoffee = async () => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        // provider, signer, coffeePortalContract
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const coffeePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // get total coffee
        let count = await coffeePortalContract.getTotalCoffee();
        console.log("Retrieved Total Coffee:", count.toNumber());
        
        // executing acutal coffee Txn from smart contract
        const coffeeTxn = await coffeePortalContract.buyCoffee(
          message ? message : "Enjoy your Coffee!",
          name ? name : "Anonymous",
          ethers.utils.parseEther("0.001"),
          {
            gasLimit: 300000,
          }
        );

        console.log("Mining...", coffeeTxn.hash);

        toast.info("Sending funds for the coffee...", toastConfigLeft);
        await coffeeTxn.wait();

        console.log("Mined ––", coffeeTxn.hash);

        count = await coffeePortalContract.getTotalCoffee();
        console.log("Retrieved Total Coffee:", count.toNumber());

        setMessage("");
        setName("");

        toast.success("Coffee Purchased!", toastConfigLeft);
      } else {
        console.log("Ethereum object doesn't exists!");
      }
    } catch(error) {
      toast.error(`${error.message}`, toastConfigRight);
    }
  };

  const getAllCoffee = async () => {
    try {
      const { ethereum } = window;
      if(ethereum) {
        // provider, signer, coffeePortalContract
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const coffeePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        const coffees = await coffeePortalContract.getAllCoffee();

        // need – address, message, name, timestamp in UI
        const cleanCoffee = coffees.map((coffee) => {
          return {
            address: coffee.giver,
            timestamp: new Date(coffee.timestamp * 1000),
            message: coffee.message,
            name: coffee.name
          };
        });

        // saving clean coffee list in state
        setAllCoffee(cleanCoffee);
      } else {
        console.log("ethereum object doesn't exists!");
      }
    } catch(error) {
      toast.error(`${error.message}`, toastConfigRight);
    }
  }

  const RenderWalletConnected = () => (
    <form className="rounded-t-2xl sm:rounded-lg bg-white border border-black px-3 py-16 sm:py-8 flex flex-col justify-center sm:shadow-lg">
      <div className="mb-4 text-left">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="name"
        >
          Name
        </label>
        <input
          className="border border-black rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id="name"
          type="text"
          placeholder="Name"
          // onChange={handleOnNameChange}
          required
        />
      </div>

      <div className="mb-4 text-left">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor="message"
        >
          Send the Creator a Message
        </label>

        <textarea
          className="form-textarea mt-1 block w-full py-2 px-3 border border-black rounded text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          rows="3"
          placeholder="Message"
          id="message"
          // onChange={handleOnMessageChange}
          required
        ></textarea>
      </div>

      <div className="border">
        <button
          className="bg-blue-500 active:bg-blue-600 text-center text-white font-bold py-2 w-full rounded-md border border-black shadow-md hover:shadow-lg focus:outline-none focus:shadow-outline"
          onClick={buyCoffee}
        >
          Support $5
        </button>
      </div>
    </form>
  );

  const RenderWalletNotConnected = () => (
    <>
      <button className="px-6 py-2 mt-5 bg-blue-500 active:bg-blue-600 rounded-full font-bold text-white border-2 border-black shadow-md hover:shadow-lg">
        Connect Wallet
      </button>
    </>
  );

  useEffect(() => {
    let coffeePoralContract;
    getAllCoffee();
    checkIfWalletIsConnected();

    const onNewCoffee = (from, timestamp, message, name) => {
      console.log("New Coffee:", from, timestamp, message, name);
      setAllCoffee((prevState) => [
        ...prevState,
        {
          address: from,
          timestamp: new Date(timestamp * 1000),
          message,
          name
        },
      ]);
    };

    if(window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const coffeePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      coffeePortalContract.on("NewCoffee", onNewCoffee);
    }

    return () => {
      if (coffeePortalContract) {
        coffeePortalContract.off("NewCoffee", onNewCoffee);
      }
    };
  }, []);

  const handleOnMessageChange = (event) => {
    const { value } = event.target;
    setMessage(value);
  };

  const handleOnNameChange = (event) => {
    const { value } = event.target;
    setName(value);
  };

  return (
    <main className="relative flex flex-col justify-end sm:justify-center items-center w-full flex-1 text-center">
      <p className="text-2xl md:text-6xl text-blue-500 font-black">
        Buy me a Coffee
      </p>
      <p className="text-2xl md:text-4xl text-blue-500 font-black">
        (on Crypto)
      </p>
      <div className="sm:max-w-xs mt-8 w-full">
        {currentAccount ? (
          <RenderWalletConnected />
        ) : (
          <RenderWalletNotConnected />
        )}
      </div>
    </main>
  );
};

export default Homepage;
