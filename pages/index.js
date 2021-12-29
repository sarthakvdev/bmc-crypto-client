import Head from "next/head";
import Footer from "../components/Footer";
import Homepage from "../components/Homepage";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Head>
        <title>BMC on Crypto</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Homepage />
      <Footer />
    </div>
  );
}
