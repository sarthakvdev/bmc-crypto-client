import Link from "next/link";

const Footer = () => {
  const creator = "sarthak verma";
  const link = "https://twitter.com/0xSarthak";

  return (
    <footer className="flex items-center left-0 right-0 bottom-0 justify-center w-full h-24">
      <p className="mr-2">made by</p>
      <Link href={link}>
        <a className="font-bold hover:underline" target="_blank">{creator}</a>
      </Link>
    </footer>
  );
};

export default Footer;
