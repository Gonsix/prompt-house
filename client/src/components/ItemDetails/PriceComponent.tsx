import React from "react";
import { useContext } from "react";
import { ethers } from "ethers";

const PriceComponent = ({price, symbol} : {price: string; symbol:string}) => {

  return (
    <div className="flex flex-row space-x-4">
      <input disabled value={price ? ethers.utils.formatEther(price) : "Loading data..."} type="text" className="w-300  p-2 border rounded bg-pbr-purple text-left" required/><br/>
      {symbol}
    </div>
  );
}
  
  export default PriceComponent;
