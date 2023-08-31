"use client"
import { useEffect, useState } from "react";
import { ethers } from "ethers";

import OwnedItems from "./OwnedItems";
import PublishedItems from "./PublishedItems";

import SPTMarketABI from "../../../hardhat/artifacts/contracts/SPTMarket.sol/SPTMarket.json";
import SPTMarket from "../../../hardhat/contractAddress.json";


function OwnedPage() {

    return (
        <div className="flex flex-col space-y-12">
            <div className="min-h-56 mb-4">
                <OwnedItems/>
            </div>
            <div className="min-h-56">
                <PublishedItems/>
            </div>

        </div>
    );
}

export default OwnedPage;
