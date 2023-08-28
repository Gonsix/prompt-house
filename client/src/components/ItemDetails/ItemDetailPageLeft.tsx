"use client"
import Image, { StaticImageData } from 'next/image';
import { useContext } from "react";
import { useEffect, useState } from 'react';
import { SPTContext } from "@/components/ItemDetails/ItemDetailPage";

import { ethers } from "ethers";
import SPTMarketABI from "../../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../../hardhat/contractAddress.json";

export default function ItemDetailPageLeft({id}:{id:string}) {

    const {
        tokenURI, setTokenURI,
        prompt, setPrompt,
        params, setParams,
        description, setDescription,
        selectedModel, setSelectedModel,
        price, setPrice,
    } = useContext(SPTContext);

    return(
        <div className="my-8  rounded-lg">
                <Image 
                    src={tokenURI ? tokenURI : ""} 
                    alt="Selected File Preview"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="w-11/12 h-auto"                    
                />
        </div>
    )

}
