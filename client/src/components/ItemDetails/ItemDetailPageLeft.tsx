"use client"
import Image, { StaticImageData } from 'next/image';
import { useContext } from "react";
import { useEffect, useState } from 'react';
import { SPTContext } from "@/components/ItemDetails/ItemDetailPage";

import { ethers } from "ethers";
import SPTMarketABI from "../../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../../hardhat/contractAddress.json";
import ReactStars from 'react-stars';

export default function ItemDetailPageLeft({id}:{id:string}) {

    const {
        tokenURI, setTokenURI,
        prompt, setPrompt,
        params, setParams,
        description, setDescription,
        selectedModel, setSelectedModel,
        price, setPrice,
        numSales, setNumSales,
        sumRate, setSumRate,
    } = useContext(SPTContext);

    return(
        <div className="my-8 space-y-4  rounded-lg">


                <Image 
                    src={tokenURI ? tokenURI : ""} 
                    alt="Selected File Preview"
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="w-11/12 h-auto"                    
                />
                 <div className='flex flex-row'>
                    <div className='flex'>
                    <ReactStars 
                        value={numSales === 0 ? 0 : sumRate/numSales}
                        count={5}
                        size={24}
                        half={false}
                        edit={false}
                
                        color2={'#ffd700'}/>

                    </div>
                    <div className=' text-lg align-middle mt-1.5 ml-1'>
                        ({numSales})
                    </div>
                </div>
        </div>
    )

}
