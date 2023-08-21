// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract SPTMarket {
    // SPT: Shareble Prompt Token
    struct SPT {
        uint id;
        address publisher; // person who created the prompt.
        address[] owners; //　person who have an access to the prompt
        string prompt;
        string description;
        string tokenURI; 
        string model;
        // float tempareture
        uint price;
        bool isCanceled;
    }

    SPT[] private SPT_list; 

    // for(item in SPT_list){
    //     if (msg.sender in item.owners){
    //     }
    // }

    mapping (address => uint[]) ownedList; // 所有しているSPT一覧を格納。もしかしたら The graph で代用できる。


    function createSPT(uint id, string memory tokenURI, string memory prompt, string memory description, string memory model, uint price) public {
        require(price >= 0, "createSPT: price must be greater than or equals to 0");
    }

    function buySPT(uint id){
        ownedList[msg.sender].append(id);
    }

    function updateSPT(uint id, string memory tokenURI, string memory prompt, string memory description, string memory model, uint price){

        require(msg.sender == item.publisher, "updateSPT: Only Publisher can update the listing SPT");
        
    }

    function cancelList (uint id){
        SPT item = SPT_list[id];
        require(msg.sender == item.publisher, "cancelList: Only Publisher can cancel listing");
    }

    function withdraw(){}

}
