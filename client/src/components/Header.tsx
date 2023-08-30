"use client"
import Link from "next/link"; 
import { usePathname } from "next/navigation"; // Sell ページにいるときにボタンにスポットライトを当てるため
import { ConnectWallet } from "@thirdweb-dev/react";
import Image from "next/image";


export default function Header() { 
  const pathname = usePathname();
  return (
    <header>
      <Link href="/" className="logo">
        {/* Hero icons */}
        {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#d584e0" className="w-6 h-6">
            <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
            <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198a2.29 2.29 0 00.091-.086L12 5.43z" />
        </svg> */}
        <Image src="/images/magic-house.png" height={32} width={32} alt="🏠" className="mx-1" ></Image>
        <h1 className="logoname"> PromptHouse</h1>
      </Link>
      <div className="search">
        <input type="text" name="searchPrompts" placeholder="Search Prompts" className="outline-none bg-pbr-purple flex-grow rounded-tl-md rounded-bl-md border-none px-4 py-1" />
        <button className="bg-white rounded-tr-md rounded-br-md h-full px-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-pbr-darkpurple">
            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
          </svg>
        </button>
      </div>


      <div className="navlinks ">
        <div className={`rounded-full ${pathname === "/sell" ? "bg-purple-400" : ""}`} >
        <Link href="/sell" className="flex gap-1 items-center group">
        <button >
          <span className={`flex gap-1 items-center group  `} >
            Sell
          </span>
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white group-[.active]:text-pbr-darkpurple">
            <path fillRule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg> */}
        </button>

        </Link>
        </div>
      </div>


      <div className="navlinks">
        <div className={`rounded-full ${pathname === "/owned" ? "bg-purple-400" : ""}`} >
        <Link href="/owned" className="flex gap-1 items-center group">
        <button >
          <span className={`flex gap-1 items-center group  `} >
            Owned
          </span>
          {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 text-white group-[.active]:text-pbr-darkpurple">
            <path fillRule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" />
          </svg> */}
        </button>

        </Link>
        </div>
      </div>

      <div className="w-52">
        <ConnectWallet theme="dark"/>
      </div>

    </header>
  )
}
