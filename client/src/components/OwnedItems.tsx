"use client"
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import SPTMarketABI from "../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../hardhat/contractAddress.json";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/splide/css'; 

import ItemCard from "./ItemCard";


function OwnedItems() {

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

    const [ownedItems, setOwnedItems ]  = useState<ItemInfoType[]>([]);


    // SPTMarketContract から現在のマーケットに出品されているアイテムのid を取ってくる.

    useEffect(() => {
        const fetchOwnedItems = async () => {
    
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
        
            const MARKET_ADDRESS = SPTMarket.address;
            const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);

        
            let ownedItems_ids = await market.connect(signer).getOwnedSPTids();

            ownedItems_ids =  ownedItems_ids.filter( function(id : number){
                return id > 0;
              })

            const ownedItems = await Promise.all(ownedItems_ids.map(async (id: number)=>{
                const itemInfo =  await market.getSPTInfo(id);
                return itemInfo;
            }));
            setOwnedItems(ownedItems);
        };

        fetchOwnedItems();
    }, []);

    return (
        <div>
            <div className="mb-8">
                <div className="text-2xl font-bold" >Owned Items ({ownedItems.length})</div>

            </div>
            { ownedItems.length !== 0 ? 

            
            <Splide
            options={{
                autoplay: true,
                perPage : 6,
                interval: 3000
            }}>
            {ownedItems.reverse().map( (item : ItemInfoType, index: number)  => {

                return (
                    <SplideSlide key={index}>
                        <ItemCard src={item.tokenURI} id={item.id} />
                    </SplideSlide>          
                )
            })}

        </Splide> 
        : <div></div>
        }

        </div>
    );
}

export default OwnedItems;
