"use client"
import { ethers } from "ethers"
import Upload from "@/components/Upload"
import OwnedPage from "@/components/OwnedPage"

export default function Owned() {

  const handleClick = async function () {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    console.log("already connected");

  }
  return (
    <div>
      <OwnedPage/>
    </div>
  )
}
