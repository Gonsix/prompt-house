"use client"
import { ethers } from "ethers"
import { useState, createContext, useContext, ContextType } from "react";
import Upload from "@/components/Upload"
import Published from "@/components/Published"
import PromptForm from "@/components/PromptForm"
import React from "react";

// Context 増やす時
type SPTContextType = {
    prompt : string,
    setPrompt: (value: string) => void,
    selectedModel: string,
    setSelectedModel : (value: string) => void,
    description: string,
    setDescription : (value: string) => void,
    price: string,
    setPrice : (value: string) => void,
    tokenURI : string,
    setTokenURI : (value: string) => void
  }

export const SPTContext = createContext({} as SPTContextType) ;



export default function SellPage() {

  // const handleClick = async function () {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);
  //   const signer = provider.getSigner();
  //   console.log("already connected");

  // }
  const [prompt, setPrompt] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('Stable Diffution');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState('');
    const [tokenURI, setTokenURI]  = useState<string>('');

    // Context 増やす時
    const SPTcontextValue = {
        prompt : prompt,
        setPrompt : setPrompt, 
        selectedModel : selectedModel,
        setSelectedModel : setSelectedModel,
        description : description,
        setDescription : setDescription,
        price : price,
        setPrice : setPrice,
        tokenURI : tokenURI,
        setTokenURI: setTokenURI
    };


  return (
    <div className="h-screen flex flex-col">
        <SPTContext.Provider value={SPTcontextValue}>
            <div className="flex-grow flex">
                <div className="flex-grow">
                <Upload/>
                </div>
                <div className="flex-grow">
                <PromptForm />
                </div>
            </div>
        </SPTContext.Provider>



      <div className="flex-grow">
        <Published/>
      </div>

      <div>{selectedModel}</div>
      {/* <div>{description}</div>
      <div>{price}</div> */}
    </div>



    

  )
}
