"use client"
import Image from 'next/image';
import React, { Component } from 'react';
import { useEffect } from 'react';

import { ethers } from 'ethers';
import { Splide, SplideSlide } from "@splidejs/react-splide";
import '@splidejs/splide/css'; 

import ItemCard from './ItemCard';

import SPTMarketABI from "../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../hardhat/contractAddress.json";

export default function HomePageDown() {

    const images = ["/images/1.png", "/images/2.png", "/images/3.png", "/images/4.jpeg", '/images/5.png', '/images/6.jpeg']
    const imgs = [
        'https://ipfs.io/ipfs/bafybeibk2jh3obnb2nsqhbhk3wgc…punk art, neo-figurative, anime, high quality.png',
        'https://ipfs.io/ipfs/bafybeicpj75ph2vlnyq73arw7zmq… camera, cyberpunk art, neo-figurative, anime.png'

    ]

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


    // const images = ["/images/1.png"]
    let items: any = [];

    // SPTMarketContract から現在のマーケットに出品されているアイテムのid を取ってくる.

    useEffect(() => {
        const fetchItems = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
        
            const MARKET_ADDRESS = SPTMarket.address;
            const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);
        
            const listed_ids = await market.connect(signer).getListingSPT();
            // console.log(listed_ids);

            listed_ids.map( async(id: number) => {
                const itemInfo = await market.getSPTInfo(id);
                // console.log(typeof itemInfo);
                items.push(itemInfo);
            })

            console.log("items", items);
            // console.log(items.length); // -> 0


            // items.map((item: any) => {
            //     console.log(item.tokenURI);
            // })
            // console.log(items[0]);
            // console.log(items.keys());
        };

        fetchItems();
    }, []);


  
  return (
    <>
        <Splide
            options={{
                autoplay: true,
                perPage : 5,
                interval: 3000
            }}>
            {imgs.map((src: string) => {
                return (
                    <SplideSlide>
                    {/* <Image src={src} alt={src} height={256} width={256}>         
                    </Image> */}
                    <ItemCard src={src} id={4} />
                    </SplideSlide>          
                )
            })}




        </Splide>
    </>
    )
  }
  