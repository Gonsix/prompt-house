"use client"
import { ethers } from "ethers"
import Upload from "@/components/Upload"

export default function Owned() {

  const handleClick = async function () {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log("already connected");

  }
  return (
    <div>
      Owned Page
      <div>
        {/* <Upload/> */}
      </div>
    </div>
  )
}
