"use client"

import ModelSelectComponent from "./ModelSelectComponent";
import PromptInputForm from "./PromptInputForm";
import ResizableDescriptionForm from "./ResizableDescriptionForm";
import PriceComponent from "./PriceComponent";
import ResizableParametersForm from "./ResizableParametersForm";
import {networkInfo} from '@/lib/networkInfo';

import { useState, CSSProperties, useRef } from 'react';
import { useContext } from "react";
import { SPTContext } from "@/components/SellPage";

export default function PromptForm() {
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

    return (
        <div className="space-y-10">
            <h1 className="text-4xl font-bold mb-8 ">Prompt Details</h1>
            <div> Tell us about the prompt you want to sell.</div>
            <div className="space-y-2">
                <a className="font-bold">Prompt Types</a>
                <div className="text-gray-400">Select the type of prompt you want to sell</div>
                <ModelSelectComponent />
            </div>


            <div className="space-y-2">
                <a className="font-bold">Description</a>
                <div className="text-gray-400">Describe what your prompt does to a potential buyer. A more detailed description will increase your sales.</div>
                <ResizableDescriptionForm />
            </div>

            <div className="space-y-2">
                <a className="font-bold">Prompt</a>
                <div className="text-gray-400">Please enter your prompt.</div>
                <PromptInputForm />
            </div>

            <div className="space-y-2">
                <a className="font-bold">Parameters</a>
                <div className="text-gray-400">Give a parameters info.</div>
                <ResizableParametersForm />
            </div>

            <div>
                <a className="font-bold mb-2">Price ({networkInfo[0].symbol})</a>
                <PriceComponent symbol={networkInfo[0].symbol}/>
            </div>
            
        </div>
        )
    }
    