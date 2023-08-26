"use client"
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import SPTMarketABI from "../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../hardhat/contractAddress.json";

import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/splide/css'; 

import ItemCard from "./ItemCard";

export default function PublishedItems() {


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

  const [publishedItems, setPublishedItems ]  = useState<ItemInfoType[]>([]);
      


  // SPTMarketContract から現在のマーケットに出品されているアイテムのid を取ってくる.

  useEffect(() => {
      const fetchPublishedItems = async () => {
          const provider = new ethers.providers.Web3Provider(window.ethereum);
          const signer = provider.getSigner();
        
          const MARKET_ADDRESS = SPTMarket.address;
          const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);

      
          let publishedItems_ids : number[] = await market.connect(signer).getPublishedSPTids();
          // ゼロのid は削除
          publishedItems_ids =  publishedItems_ids.filter( function(id : number){
            return id > 0;
          })

          const publishedItems = await Promise.all(publishedItems_ids.map(async (id: number)=>{
              const itemInfo =  await market.getSPTInfo(id);
              return itemInfo;
          }));
          setPublishedItems(publishedItems);
      };

      fetchPublishedItems();
  }, []);


  return (
    <div>
        <div className="mb-8">
            <div className="text-2xl font-bold" >Published Items ({publishedItems.length})</div>
        </div>
        { publishedItems.length !== 0 ? 
        <Splide
            options={{
                autoplay: true,
                perPage : 5,
                interval: 3000
            }}>
            {publishedItems.reverse().map( (item : ItemInfoType, index: number)  => {

                return (
                    <SplideSlide key={index}>
                        <ItemCard src={item.tokenURI} id={item.id} height={256} width={256} />
                    </SplideSlide>          
                )
            })}

        </Splide>
        : <div></div>
        }
    </div>
  )
}
