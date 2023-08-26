"use client"
import Image, { StaticImageData } from 'next/image';
import { useContext } from "react";
import { useEffect, useState } from 'react';
import { SPTContext } from "@/components/BuyPage";

import { ethers } from "ethers";
import SPTMarketABI from "../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../hardhat/contractAddress.json";

export default function ShowImg({id}:{id:string}) {

    const {
        tokenURI, setTokenURI,
        prompt, setPrompt,
        params, setParams,
        description, setDescription,
        selectedModel, setSelectedModel,
        price, setPrice,
    } = useContext(SPTContext);

    type ItemInfoType = { // prompt とparams 以外の情報
        id : number,
        tokenURI : string,
        publisher : string,
        owners : string[],
        description : string,
        model : string,
        price : number,
        isCanceled : boolean
    }
    const [items, setItems ]  = useState<ItemInfoType[]>([]);



    useEffect(() => {
        const fetchItems = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
        
            const MARKET_ADDRESS = SPTMarket.address;
            const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);
            
            const itemInfo =  await market.getSPTInfo(id);

            setItems(itemInfo);
            

            setTokenURI(itemInfo.tokenURI);
            // setPrompt();
            // setParams();
            setDescription(itemInfo.description);
            setSelectedModel(itemInfo.model);
            setPrice(itemInfo.price.toString());
            
        };

        fetchItems();
    }, []);


    return(
        <div className=" rounded-lg">
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
