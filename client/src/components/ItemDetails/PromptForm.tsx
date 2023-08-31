import PromptInputForm from "@/components/ItemDetails/PromptInputForm";
import ResizableDescriptionForm from "@/components/ItemDetails/ResizableDescriptionForm";
import PriceComponent from "@/components/ItemDetails/PriceComponent";
import ResizableParametersForm from "@/components/ItemDetails/ResizableParametersForm";
import BuyButton from "./BuyButton";
import ReviewButton from "./ReviewButton";

import { items_discriptions } from "@/lib/items_discriptions";

import { ethers, BigNumber } from "ethers";
import SPTMarketABI from "../../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../../hardhat/contractAddress.json";
import { UserStatus } from "@/utils/userStatus";

import { useEffect,useState, CSSProperties, useRef, FormEvent } from 'react';
import { useContext } from "react";
import { SPTContext } from "@/components/ItemDetails/ItemDetailPage";
import { networkInfo } from "@/lib/networkInfo";
import StarsComponent from "./StarsComponent";

export default function ItemDetailPageRight({id}:{id?:string}) {
    const [file, setFile] = useState(null);
    const [localURL, setLocalURL] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [buying, setBuying] = useState<boolean>(false);
    const [stars, setStars] = useState<number>(1);
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const [isOngoing, setIsOngoing] = useState<boolean>(false);
    const [numSales, setNumSales] = useState<number>(0);
    const [sumRate, setSumRate] = useState<number>(0);

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

    useEffect(() => {
        const fetchItems = async () => {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
        
            const MARKET_ADDRESS = SPTMarket.address;
            const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);

            const status : UserStatus = await market.connect(signer).getUserStatus(id);

            console.log("Status:", status);
            switch (status){
                case UserStatus.INITIAL:
                    break;
                
                case UserStatus.ONGOING:
                    setIsOwner(false); // = Contract function 
                    setIsOngoing(true);//= Contract function 
                    break;
                
                case UserStatus.OWNED:
                    setIsOwner(true);
                    setIsOngoing(false);
                    break;
                
                case UserStatus.PUBLISHED:
                    setIsOwner(true);
                    setIsOngoing(false);
                    break;
            }


            
            const itemInfo =  await market.getSPTInfo(id);
            setItems(itemInfo);

            setTokenURI(itemInfo.tokenURI);
            setDescription(itemInfo.description);
            setSelectedModel(itemInfo.model);
            setPrice(itemInfo.price.toString());
            setNumSales(itemInfo.numSales.toNumber()); // 何回売れたか
            setSumRate(itemInfo.sumRate.toNumber());  // トータルの星の数
        };

        fetchItems();
    }, [id, params, setDescription, setSumRate, setPrice, setNumSales, setSelectedModel, setTokenURI]);

    const handleSubmit = async (event:any)=>
    {
        setBuying(true);

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();

        const MARKET_ADDRESS = SPTMarket.address;
        const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);
        //Buy controll
        if(!isOwner && !isOngoing){
            try{
                const tx = await market.connect(signer).buySPT(id, {value: BigNumber.from(price)});
                await tx.wait();
                window.location.reload(); 
            }catch(e){
                setBuying(false);
                alert("Faild to buy, please try again.");
            }
        }else if(isOngoing){
            //market.connect(signer).reviewItem(id, stars);
            console.log("stars: ", stars);
            const tx = await market.connect(signer).reviewSPT(id, stars);
            await tx.wait();

            
            setIsOngoing(false);//test
            setIsOwner(true);//test
            window.location.reload(); 
        }
    }


    const ratingChange = (newRating : any)=>{
        console.log(newRating);
        setStars(newRating);
    }
    


    const HTML = items_discriptions.map((section, index: number) => {
        let tmp = 'buy';
        if(isOwner) tmp = 'owned';
        else if(isOngoing) tmp = 'ongoing';
        const pageType = tmp;

        if(section.pageType == pageType){
            return(
                    <div key={index}>
                        <div className="space-y-10">
                            <h1 className="text-4xl font-bold mb-8 ">{section.title}</h1>
                            <div>{section.title_Dscription}</div>

                            <div className="space-y-2">
                            <a className="font-bold">{section.items[0].name}</a>
                            <div className="text-gray-400">{section.items[0].description}</div>
                            <input type='text' disabled value={selectedModel ? selectedModel : "Loading data..."}  className="text-white font-mono bg-pbr-purple p-2 rounded-lg" />
                            </div>


                            <div className="space-y-2">
                            <a className="font-bold">{section.items[3].name}</a>
                            <div className="text-gray-400">{section.items[3].description}</div>
                            <ResizableDescriptionForm description={description}/>
                            </div>

                            <div className="space-y-2 mt-5">
                            <a className="font-bold mb-2">{section.items[4].name} ({networkInfo[0].symbol})</a>

                            <div className="text-gray-400">{section.items[4].description}</div>
                            <PriceComponent price={price} symbol={networkInfo[0].symbol} />
                            </div>

                            <div>
                                <div className="space-y-2 mt-5" >
                                    <StarsComponent isOngoing={isOngoing} ratingChange={ratingChange}  numSales={numSales} sumRate={sumRate}/>
                                </div>
                            </div>

                            <div hidden={!isOngoing}>
                                <div className="space-y-2 mt-5" >
                                    <ReviewButton buying={buying} handleSubmit={handleSubmit}/>
                                </div>
                            </div>
                              
                            <div hidden={isOwner||isOngoing}>
                                <div className="space-y-2 mt-5">
                                    <BuyButton buying={buying} handleSubmit={handleSubmit}/>
                                </div>
                            </div>
                            
                        </div>
                    </div>
            );
        }

    });

    return HTML;
}
