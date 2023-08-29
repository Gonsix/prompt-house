import PromptInputForm from "@/components/ItemDetails/PromptInputForm";
import ResizableDescriptionForm from "@/components/ItemDetails/ResizableDescriptionForm";
import PriceComponent from "@/components/ItemDetails/PriceComponent";
import ResizableParametersForm from "@/components/ItemDetails/ResizableParametersForm";
import BuyButton from "./BuyButton";

import { items_discriptions } from "@/lib/items_discriptions";

import { ethers, BigNumber } from "ethers";
import SPTMarketABI from "../../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../../hardhat/contractAddress.json";

import { useEffect,useState, CSSProperties, useRef, FormEvent } from 'react';
import { useContext } from "react";
import { SPTContext } from "@/components/ItemDetails/ItemDetailPage";
import { networkInfo } from "@/lib/networkInfo";

export default function ItemDetailPageRight({id}:{id?:string}) {
    const [file, setFile] = useState(null);
    const [localURL, setLocalURL] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [buying, setBuying] = useState<boolean>(false);
    const {
        tokenURI, setTokenURI,
        prompt, setPrompt,
        params, setParams,
        description, setDescription,
        selectedModel, setSelectedModel,
        price, setPrice,
    } = useContext(SPTContext);

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
    const [isOwner, setIsOwner] = useState<boolean>(false);
    useEffect(() => {
        const fetchItems = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
        
            const MARKET_ADDRESS = SPTMarket.address;
            const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);
            let promptInfo;
            try{
                promptInfo = await market.connect(signer).showPromptParams(id);
                setPrompt(promptInfo.prompt);
                setParams(promptInfo.params);
                setIsOwner(true);

            }catch(e){
                setIsOwner(false);
            }
            
            const itemInfo =  await market.getSPTInfo(id);
            setItems(itemInfo);

            setTokenURI(itemInfo.tokenURI);
            setDescription(itemInfo.description);
            setSelectedModel(itemInfo.model);
            setPrice(itemInfo.price.toString());
            
        };

        fetchItems();
    }, [id, params, setDescription, setParams, setPrice, setPrompt, setSelectedModel, setTokenURI]);

    const handleSubmit = async (event:any)=>
    {
        setBuying(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const MARKET_ADDRESS = SPTMarket.address;
        const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);
        // console.log(price.toString());
        try{
            const tx = await market.connect(signer).buySPT(id, {value: BigNumber.from(price)});
            await tx.wait();
            window.location.reload(); 
        }catch(e){
            setBuying(false);
            alert("Faild to buy, please try again.");
        }

        
    }
    

    const HTML = items_discriptions.map((section) => {
        const pageType = isOwner? 'owned' : 'buy';
        if(section.pageType == pageType){
            return(
                    <div className="space-y-10">
                        <h1 className="text-4xl font-bold mb-8 ">{section.title}</h1>
                        <div>{section.title_Dscription}</div>

                        <div className="space-y-2">
                        <a className="font-bold">{section.items[0].name}</a>
                        <div className="text-gray-400">{section.items[0].description}</div>
                        <input type='text' disabled value={selectedModel ? selectedModel : "Loading data..."}  className="text-white font-mono bg-pbr-purple p-2 rounded-lg" />
                        </div>

                        <div className="space-y-2" hidden = {!isOwner}>
                        <a className="font-bold">{section.items[1].name}</a>
                        <div className="text-gray-400">{section.items[1].description}</div>
                        <PromptInputForm prompt={prompt} />
                        </div>

                        <div className="space-y-2" hidden = {!isOwner}>
                        <a className="font-bold">{section.items[2].name}</a>
                        <div className="text-gray-400">{section.items[2].description}</div>
                        <ResizableParametersForm params={params}/>
                        </div>

                        <div className="space-y-2">
                        <a className="font-bold">{section.items[3].name}</a>
                        <div className="text-gray-400">{section.items[3].description}</div>
                        <ResizableDescriptionForm description={description}/>
                        </div>

                        <div className="space-y-2 mt-5">
                        <a className="font-bold mb-2">{section.items[4].name} ({networkInfo[0].symbol})</a>
                        <PriceComponent price={price} symbol={networkInfo[0].symbol} />
                        </div>

                        <div className="space-y-2 mt-5">
                        <BuyButton buying={buying} isOwner={isOwner} handleSubmit={handleSubmit}/>
                        </div>
                    </div>
            );
        }

    });

    return HTML;
}