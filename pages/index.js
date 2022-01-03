import Head from "next/head";
import Footer from "../components/Footer";
import Homepage from "../components/Homepage";

export default function Home() {
  return (
    <div className="flex flex-col bg-gray-50 items-center justify-center min-h-screen bg-main-blues bg-cover">
      <Head>
        <title>BMC on Crypto</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Homepage />
      <Footer />
    </div>
  );
}
