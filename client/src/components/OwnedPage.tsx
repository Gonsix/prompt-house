"use client"
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import OwnedItems from "./OwnedItems";
import PublishedItems from "./PublishedItems";

import SPTMarketABI from "../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../hardhat/contractAddress.json";


function OwnedPage() {




    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-grow h-1/3">
                <OwnedItems/>
            </div>
            <div className="flex flex-grow h-2/3">
                <PublishedItems/>
            </div>

        </div>
    );
}

export default OwnedPage;
