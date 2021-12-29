import { useState } from "react";

const Homepage = () => {
  const [currentAccount, setCurrentAccount] = useState("dd");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  // connectWallet method
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      console.log(ethereum);
    } catch (error) {
      console.log(error);
    }
  };

  const RenderWalletConnected = () => (
    <form className="rounded-lg bg-white border border-black px-3 py-8 flex flex-col justify-center shadow-lg">
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

      <div className="text-right">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-center text-white font-bold py-2 px-4 rounded-md border border-black shadow-md hover:shadow-lg focus:outline-none focus:shadow-outline"
          // onClick={buyCoffee}
        >
          Support $5
        </button>
      </div>
    </form>
  );

  const RenderWalletNotConnected = () => (
    <button className="px-4 py-2 bg-blue-500 active:bg-blue-600 rounded-md font-bold text-white border border-black shadow-md hover:shadow-lg">
      Connect Wallet
    </button>
  );

  return (
    <main className="flex flex-col justify-center items-center w-full flex-1 px-20 text-center">
      <p className="text-3xl md:text-6xl text-blue-500 font-black">Buy me a Coffee</p>
      <p className="text-2xl md:text-4xl text-blue-500 font-black">(on Crypto)</p>
      <div className="max-w-xs mt-8 w-full">
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
