"use client"
import { ethers } from "ethers"
import { useState, createContext, useContext, ContextType } from "react";
import Upload from "@/components/Upload"
import Published from "@/components/PublishedItems"
import PromptForm from "@/components/PromptForm"
import React from "react";
import PriceComponent from "./PriceComponent";

// Context 増やす時
type SPTContextType = {
    prompt : string,
    setPrompt: (value: string) => void,
    params : string,
    setParams : (value: string) => void,
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


    const [prompt, setPrompt] = useState<string>('');
    const [params, setParams] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('Stable Diffution');
    const [description, setDescription] = useState<string>('');
    const [price, setPrice] = useState('');
    const [tokenURI, setTokenURI]  = useState<string>('');

    // Context 増やす時
    const SPTcontextValue = {
        prompt : prompt,
        setPrompt : setPrompt, 
        params : params,
        setParams : setParams,
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
    <div className="flex-grow flex-col">
        <SPTContext.Provider value={SPTcontextValue}>
            <div className="flex-grow flex">
                <div className="flex-grow">
                  <div className="flex flex-col">
                    <div className="fixed">
                      <Upload/> 
                    </div>
                    {/* <div>
                        <div>

                          <a className="font-bold mb-2">Price</a>
                          <PriceComponent/>
                        </div>
                    </div> */}

                  </div>
                </div>
                <div className="object-right flex-grow-col">
                <PromptForm />
                </div>
            </div>
        </SPTContext.Provider>

      <div className="">
        <Published/>
        <br/>
        <br/><br/><br/><br/><br/><br/><br/>
      </div>


      {/* <div>{selectedModel}</div> */}
      {/* <div>{description}</div>
      <div>{price}</div> */}
    </div>



    

  )
}
