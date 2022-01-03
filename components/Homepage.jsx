import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import { ethers } from "ethers";
import "react-toastify/dist/ReactToastify.css";
import abi from "../utils/coffeePortal.json";
import { useForm } from "react-hook-form";

const Homepage = () => {
  // contract address
  const contractAddress = "0x6339C2911E6FFa607D2F9C34A20148301bdb7c94";

  // abi contract
  const contractABI = abi.abi;

  // States
  const [currentAccount, setCurrentAccount] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [allCoffee, setAllCoffee] = useState([]);

  // form hook
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    console.log("data:", data);
  };

  console.log(watch("example"));

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
  };

  // Check the authorization to access the wallet
  const checkIfWalletIsConnected = async () => {
    try {
      const { ethereum } = window;
      const accounts = await ethereum.request({ method: "eth_accounts" });

      if (accounts.length !== 0) {
        const account = accounts[0];
        setCurrentAccount(account);
        toast.success("🦄 Wallet is connected", toastConfigRight);
      } else {
        toast.warn(
          "Make sure you have a Metamask connected!",
          toastConfigRight
        );
      }
    } catch (error) {
      toast.error(`${error.message}`, toastConfigRight);
    }
  };

  // connect Wallet method
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
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
      if (ethereum) {
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
    } catch (error) {
      toast.error(`${error.message}`, toastConfigRight);
    }
  };

  const getAllCoffee = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        // provider, signer, coffeePortalContract
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const coffeePortalContract = new ethers.Contract(
          contractAddress,
          contractABI,
          signer
        );

        // Get the list of all the coffees
        const coffees = await coffeePortalContract.getAllCoffee();

        // need – address, message, name, timestamp in UI
        const cleanCoffee = coffees.map((coffee) => {
          return {
            address: coffee.giver,
            timestamp: new Date(coffee.timestamp * 1000),
            message: coffee.message,
            name: coffee.name,
          };
        });

        // saving clean coffee list in state
        setAllCoffee(cleanCoffee);
      } else {
        console.log("ethereum object doesn't exists!");
      }
    } catch (error) {
      toast.error(`${error.message}`, toastConfigRight);
    }
  };

  // React component – Render when connected to wallet
  const RenderWalletConnected = () => {
    const handleNameChange = (event) => {
      setName(event.target.value);
    };

    const handleMessageChange = (event) => {
      setMessage(event.target.value);
    };

    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white px-5 py-10 rounded-xl flex flex-col justify-center shadow-xl"
      >
        <div className="mb-4 text-left">
          <label
            className="block text-gray-700 text-base font-bold mb-2"
            htmlFor="name"
          >
            Name
          </label>
          <input
            value={name}
            onChange={handleNameChange}
            className="border rounded-md w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Name"
            required
            {...register("example")}
          />
        </div>

        <div className="mb-4 text-left">
          <label
            className="block text-gray-700 text-base font-bold mb-2"
            htmlFor="message"
          >
            Send the Creator a Message
          </label>

          <textarea
            value={message}
            onChange={handleMessageChange}
            className="form-textarea mt-1 block w-full py-2 px-3 border rounded-md text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
            placeholder="Your message"
            id="message"
            required
          ></textarea>
        </div>

        <div>
          <button
            className="bg-blue-500 active:bg-blue-600 text-center text-white font-bold py-2 w-full border border-blue-300 rounded-lg shadow-md hover:shadow-lg focus:outline-none focus:shadow-outline"
            onClick={buyCoffee}
          >
            Support $5
          </button>
        </div>
      </form>
    );
  };

  useEffect(() => {
    let coffeePortalContract;
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
          name,
        },
      ]);
    };

    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      coffeePortalContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );
      // todo:calling the NewCoffee event (Need to understand this)
      coffeePortalContract.on("NewCoffee", onNewCoffee);
    }

    return () => {
      if (coffeePortalContract) {
        coffeePortalContract.off("NewCoffee", onNewCoffee);
      }
    };
  }, []);

  return (
    <>
      <main className="flex flex-col border border-red-500 items-center justify-center w-full flex-1 text-center">
        <div className="flex flex-col sm:flex-row items-center">
          <p className="text-4xl sm:text-6xl text-gray-800 font-semibold drop-shadow ">
            Buy me a Coffee
          </p>
          <div className="px-4 py-2 bg-gray-800 border border-gray-700 mt-2 sm:mt-0 sm:ml-3 rounded-full shadow-md">
            <p className="text-sm sm:text-base text-white font-semibold">
              on Crypto
            </p>
          </div>
        </div>

        <div className=" w-2/3 sm:max-w-xs mt-8">
          {currentAccount ? (
            <RenderWalletConnected />
          ) : (
            <button
              onClick={connectWallet}
              className="px-6 py-3 mt-5 bg-blue-500 active:bg-blue-600 rounded-xl font-bold text-white shadow-md hover:shadow-lg"
            >
              Connect Wallet
            </button>
          )}
        </div>

        {allCoffee.map((coffee, index) => {
          return (
            <div className="border-l-2 mt-10" key={index}>
              <div className="transform transition cursor-pointer hover:-translate-y-2 ml-10 relative flex items-center px-6 py-4 bg-blue-800 text-white rounded mb-10 flex-col md:flex-row space-y-4 md:space-y-0">
                {/* <!-- Dot Following the Left Vertical Line --> */}
                <div className="w-5 h-5 bg-blue-600 absolute -left-10 transform -translate-x-2/4 rounded-full z-10 mt-2 md:mt-0"></div>

                {/* <!-- Line that connecting the box with the vertical line --> */}
                <div className="w-10 h-1 bg-green-300 absolute -left-10 z-0"></div>

                {/* <!-- Content that showing in the box --> */}
                <div className="flex-auto">
                  <h1 className="text-md">Supporter: {coffee.name}</h1>
                  <h1 className="text-md">Message: {coffee.message}</h1>
                  <h3>Address: {coffee.address}</h3>
                  <h1 className="text-md font-bold">
                    TimeStamp: {coffee.timestamp.toString()}
                  </h1>
                </div>
              </div>
            </div>
          );
        })}
      </main>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </>
  );
};

export default Homepage;
