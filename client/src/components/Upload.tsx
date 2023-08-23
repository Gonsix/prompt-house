"use client"
import { useState, CSSProperties, useRef } from 'react';
import { NFTStorage } from 'nft.storage';
import { ipfsToHTTPS } from '@/utils';
import Image, { StaticImageData } from 'next/image';
import { useContext } from "react";
import { SPTContext } from "@/components/SellPage";

import { ethers } from "ethers";
import { Marketplace } from '@thirdweb-dev/sdk';
import SPTMarketABI from "../contracts/SPTMarket.json";

export default function Upload() {
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [localURL, setLocalURL] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    
    const {
        tokenURI, setTokenURI,
        prompt, setPrompt,
        description, setDescription,
        selectedModel, setSelectedModel,
        price, setPrice,
    } = useContext(SPTContext);
    setPrice("10"); // Temporary



    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if(!file){
            return;
        }

        setUploading(true);

        const client = new NFTStorage({token : process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY as string}); // ここにハードコードでも構わない
        const metadata = await client.store({
            name: "First Image",
            description: "",
            image: file
        });

        const uri = metadata.url;

        const metadataResponse = await fetch(ipfsToHTTPS(uri));
        if (metadataResponse.status != 200) return;
        const json = await metadataResponse.json();

        const imageURL = ipfsToHTTPS(json.image);
        
        console.log(imageURL);

        setTokenURI(imageURL); // すぐには更新されない

        setUploading(false);

        ////// ethers.js で createSPT //////
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const MARKET_ADDRESS = "0xB9089CFF3aDd184579F063b5e19E5178B039B555";
        const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);
        const tx = await market.connect(signer).createSPT(imageURL, prompt, description, selectedModel,price )
        const receipt = await tx.wait();
        
        console.log(receipt);

    }

    

    const handleChange = (event: any) => {

        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        // Create an object URL for the selected file
        const objectURL = URL.createObjectURL(selectedFile);
        setLocalURL(objectURL);
      };



    return(
        <div className="max-w-lg mx-auto my-8 p-6  rounded-lg">
            <form onSubmit={handleSubmit}>
                <div>
                    {/* <label className="text-gray-200 font-bold mb-2" htmlFor="file">
                        Choose a file to upload
                    </label> */}
                    <div
                    className={`relative ${!localURL? 'border-2 border-gray-400' : ""}  rounded-lg h-96 w-96 flex justify-center items-center`}
                    onClick={() => fileInputRef.current?.click()}>
                        <div className="absolute">
                            <div className="flex flex-col items-center">
                                <svg
                                    className="w-10 h-10 text-gray-400 group-hover:text-gray-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M15 19l-7-7 7-7"
                                    ></path>    
                                </svg>
                                <span className="text-gray-400 group-hover:text-gray-600 mt-2">
                                {!file && 'Select a file'}
                                
                                </span>
                            </div>

                        </div>
                        <input
                            type="file"
                            accept="image/png,image/jpeg, image/jpg"
                            className="h-full w-full opacity-0"
                            id="file"
                            onChange={handleChange}
                            ref={fileInputRef}
                            onClick={(e) => e.stopPropagation()} // イベントを受け取る競合を避けるため
                        />

                        {localURL && !tokenURI && (
                            <Image layout="fill" objectFit="cover" src={localURL} alt="Selected File Preview" />
                        )}
                    </div>

                </div>
                <button
                    type="submit"
                    className="mt-10 bg-gradient-to-br from-yellow-500 to-red-400 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:shadow-outline hover:from-yellow-400 hover:to-orange-400"
                    disabled={!file || uploading}
                >
                    {uploading ? 'Creating...' : 'Create'}
                </button>
            </form>

            {/* {localURL && !ipfsURL && (
                <div className="mt-8">
                    <p className="ext-gray-700 font-bold">Selected File Preview:</p>
                    <Image width="500" height="500" src={localURL} alt="Selected File Preview" />
                </div>
            )} */}
            
            {tokenURI&& (
                <div className="mt-8">
                    <p className="ext-gray-700 font-bold"> File Uploaded to IPFS:</p>
                    {/* <a 
                        href={ipfsURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700">
                        {ipfsURL}
                    </a> */}
                    <Image width="500" height="500" src={tokenURI} alt={tokenURI} ></Image>
                </div>
                
            )}
        </div>
    )

}

