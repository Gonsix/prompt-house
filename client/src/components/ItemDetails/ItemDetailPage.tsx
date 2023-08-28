"use client"
import React from "react";
import { items_discriptions } from '@/lib/items_discriptions';
import { useState, createContext, useContext, ContextType } from "react";

import ItemDetailPageLeft from "@/components/ItemDetails/ItemDetailPageLeft";
import PromptForm from "@/components/ItemDetails/PromptForm";

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

function BuyPage({id} : {id : string}) {

    const [prompt, setPrompt] = useState<string>('');
    const [params, setParams] = useState<string>('');
    const [selectedModel, setSelectedModel] = useState<string>('');
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
        <SPTContext.Provider value={SPTcontextValue}>
            <div className="flex-grow-row flex">
                <div className="w-2/5">
                    <div className="space-y-10">
                        <ItemDetailPageLeft id={id} /> 
                    </div>
                </div>

                <div className="object-right w-3/5">
                    <PromptForm id={id} />
                </div>
            </div>
        </SPTContext.Provider>
    );
}

export default BuyPage;
