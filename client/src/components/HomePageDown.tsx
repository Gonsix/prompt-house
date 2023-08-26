"use client"
import Image from 'next/image';
import React, { Component } from 'react';
import { useEffect, useState, createContext } from 'react';

import { ethers } from 'ethers';
import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/splide/css'; 

import ItemCard from './ItemCard';

import SPTMarketABI from "../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../hardhat/contractAddress.json";

export default function HomePageDown() {

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
    


    // SPTMarketContract から現在のマーケットに出品されているアイテムのid を取ってくる.

    useEffect(() => {
        const fetchItems = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
        
            const MARKET_ADDRESS = SPTMarket.address;
            const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);

        
            const listed_ids = await market.connect(signer).getListingSPT();

            const fetchedItems = await Promise.all(listed_ids.map(async (id: number)=>{
                const itemInfo =  await market.getSPTInfo(id);
                return itemInfo;
            }));
            setItems(fetchedItems);
        };

        fetchItems();
    }, []);


  
  return (
    <>
        <div className="text-2xl font-semibold mb-4 "> Newest Items</div>
        <Splide
            options={{
                autoplay: true,
                perPage : 6,
                interval: 3000
            }}>
            {items.reverse().map( (item : ItemInfoType, index: number)  => {

                return (
                    <SplideSlide key={index}>
                        <ItemCard src={item.tokenURI} id={item.id} />
                    </SplideSlide>          
                )
            })}

        </Splide>
    </>
    )
  }
  