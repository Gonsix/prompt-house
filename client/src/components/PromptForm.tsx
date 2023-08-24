"use client"

import ModelSelectComponent from "./ModelSelectComponent";
import PromptInputForm from "./PromptInputForm";
import ResizableDescriptionForm from "./ResizableDescriptionForm";
import PriceComponent from "./PriceComponent";
import { useState } from "react";

export default function PromptForm() {

    
    return (
        <div className="space-y-8">
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

            <div>
                <a className="font-bold mb-2">Price</a>
                <PriceComponent/>
            </div>
        
        </div>
        )
    }
    