// "use client"

// import { useState, useEffect } from "react";
// import { ethers } from "ethers";
// import SPTMarketABI from "../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
// import SPTMarket from "../../../hardhat/contractAddress.json";
// import Image from "next/image";


// function ItemPage({id} : {id: string}) {

//     type ItemInfoType = { // prompt とparams 以外の情報
//         _id : number,
//         tokenURI : string,
//         publisher : string,
//         owners : string[],
//         description : string,
//         model : string,
//         price : number,
//         isCanceled : boolean
//     }

//     const [item, setItem] = useState<ItemInfoType>();

//     useEffect(() => {
//         const fetchItemInfo = async () => {

//             const provider = new ethers.providers.Web3Provider(window.ethereum);
//             const signer = provider.getSigner();

//             const MARKET_ADDRESS = SPTMarket.address;
//             const market = new ethers.Contract(MARKET_ADDRESS, SPTMarketABI.abi, provider);


//             const itemInfo = await market.getSPTInfo(id);
//             console.log(itemInfo);
//             setItem(itemInfo);
//         };

//         fetchItemInfo();
//     }, []);

//     return (
//         <div>

//             {id}
//             <div>
//                 { item == null ? 
//                     <div></div>
//                     : <Image src={item.tokenURI} height={256} width={256} alt=""/>
//                 }
//             </div>
//         </div>
//     );
// }

// export default ItemPage;
