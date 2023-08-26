"use client"
import { useState, CSSProperties, useRef } from 'react';
import { NFTStorage } from 'nft.storage';
import { ipfsToHTTPS } from '@/utils';
import Image from 'next/image';
import { useContext } from "react";
import { SPTContext } from "@/components/SellPage";


import { ethers} from "ethers";

import SPTMarketABI from "../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../hardhat/contractAddress.json";

export default function Upload() {
    
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState<boolean>(false);
    const [localURL, setLocalURL] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    
    const {
        tokenURI, setTokenURI,
        prompt, setPrompt,
        params, setParams,
        description, setDescription,
        selectedModel, setSelectedModel,
        price, setPrice,
    } = useContext(SPTContext);



    const handleSubmit = async (event: any) => {
        event.preventDefault();

        if(!file){
            return;
        }
        console.log("file", file);


        setUploading(true);

        const client = new NFTStorage({token : process.env.NEXT_PUBLIC_NFT_STORAGE_API_KEY as string}); // ここにハードコードでも構わない
        const metadata = await client.store({
            name: "SPT-Market-Image",
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

        const MARKET_ADDRESS = SPTMarket.address;
        const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);
        const tx = await market.connect(signer).createSPT(imageURL, prompt, params, description, selectedModel, ethers.utils.parseUnits(price))
        const receipt = await tx.wait();
        
        console.log(receipt);
        window.location.reload(); // リロードし直す

    }

    

    const handleChange = (event: any) => {

        const selectedFile = event.target.files[0];
        setFile(selectedFile);

        // Create an object URL for the selected file
        const objectURL = URL.createObjectURL(selectedFile);
        setLocalURL(objectURL);
      };



    return(
        <div className=" max-w-lg mx-auto my-8 p-6  rounded-lg">
            <form onSubmit={handleSubmit}>
                <div className="mb-8">
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
                
            </form>

{uploading 
                ? <button disabled type="submit" className="py-3  w-25 px-5 mr-2 text-sm font-medium text-gray-900 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-blue-700 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 inline-flex items-center">
                    <svg aria-hidden="true" role="status" className="inline w-4 h-4 mr-3 text-gray-200 animate-spin dark:text-gray-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                    <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="#1C64F2"/>
                    </svg>
                    Loading...
                </button>
                :<button
                    onClick={handleSubmit}
                    type="submit"
                    className="py-2.5  w-32 px-3 mr-2 text-xl font-medium bg-gradient-to-br  from-yellow-500 to-red-400 text-white  rounded-lg focus:outline-none focus:shadow-outline hover:from-yellow-400 hover:to-orange-400"
                    disabled={!file || !prompt || !description || !price }
                    >
                        {uploading ? 'Creating...' : 'Create'}    
                </button>

                }
        </div>
    )

}
