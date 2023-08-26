import React from "react";
import { useContext } from "react";
import { SPTContext } from "@/components/BuyPage";
import { ethers } from "ethers";


const PriceComponent = () => {
  const { price, setPrice } = useContext(SPTContext);

  return (
    <div className="flex flex-row space-x-4">
      <input disabled value={price ? ethers.utils.formatEther(price) : "Loading data..."} type="text" className="w-300  p-2 border rounded bg-pbr-purple text-left" required/><br/>
    </div>
  );
}
  
  export default PriceComponent;
