// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;


// SPT: Shareble Prompt Token
struct SPT {
    uint id;
    string tokenURI; 
    address publisher; // person who created the prompt.
    address[] owners;  // person who have an access to the prompt  // mapping (address => bool) isInOwners; // True if a person have an access to the prompt

    string prompt;
    string description;
    string model;
    // float tempareture
    uint price;
    bool isCanceled;
}

contract SPTMarket {

    SPT[] private SPT_list; 
    mapping (address => uint[]) ownedSPTs; // 所有しているSPT一覧を格納。もしかしたら The graph で代用できる。
    mapping (address => uint[]) listedSPTs; // 

    event SPTUpdate(uint id, string tokenURI, address publisher, address[] owners, string prompt, string description, string model, uint price, bool isCanceled);


    modifier onlyOwners(uint id) {
        bool isInOwnersFlg = false;
        SPT storage item = SPT_list[id];

        for(uint i = 0; i < item.owners.length; i++){
            if (msg.sender == item.owners[i]){
                isInOwnersFlg = true;
            }
        }
        require(isInOwnersFlg == true, "onlyOwners: Only owners can access to this method");
        _;
    }

    modifier onlyPublisher(uint id) {
        SPT storage item = SPT_list[id];
        require( item.publisher == msg.sender, "onlyPublisher: Only publisher can access to this method");
        _;
    }


    function createSPT(string memory tokenURI, string memory prompt, string memory description, string memory model, uint price) public {
        require(price >= 0, "createSPT: price must be greater than or equals to 0");

        // mapping (address => bool) storage isInOwners;
        address[] memory owners;
        uint _id = SPT_list.length;
        SPT memory newSPT = SPT({
            id: _id,
            tokenURI: tokenURI,
            publisher: msg.sender,
            owners: owners, // mapping は初期化できない？
            prompt: prompt,
            description: description,
            model: model,
            price: price,
            isCanceled: false
        });

        SPT_list.push(newSPT);
        emit SPTUpdate(_id, tokenURI, msg.sender, owners, prompt, description, model, price, false);
    }


    function showPrompt(uint id) public view onlyOwners(id) returns(string memory)  {
        SPT storage item = SPT_list[id];
        return item.prompt;
    }

    function buySPT(uint id) payable public {

        SPT storage item = SPT_list[id];
        require(msg.sender != item.publisher, "The publisher cannot buy the item");
        require(item.isCanceled == false, "buySPT: This item cannot be bought");
        require(msg.value == item.price, "buySPT: You don't match the price");

        item.owners.push(msg.sender);

        emit SPTUpdate(id, item.tokenURI, item.publisher, item.owners, item.prompt, item.description, item.model, item.price, item.isCanceled);
        // ownedSPTs[msg.sender].push(id);
    }



    function updateSPT(uint id, string memory tokenURI, string memory prompt, string memory description, string memory model, uint price, bool isCanceled) public {
        SPT storage item = SPT_list[id];
        require(msg.sender == item.publisher, "updateSPT: Only Publisher can update the listed SPT");

        emit SPTUpdate(id, tokenURI, item.publisher, item.owners, prompt, description, model, price, isCanceled); // item. が付いているのは、変わらないやつ
    }

    function getSPTInfo(uint _id) public view returns(
        uint id,
        string memory tokenURI,
        address publisher, // person who created the prompt.
        address[] memory owners,  // person who have an access to the prompt  // mapping (address => bool) isInOwners; // True if a person have an access to the prompt

        string memory prompt,
        string memory description,
        string memory model,
        // float tempareture
        uint price,
        bool isCanceled
    )  {
        SPT storage item = SPT_list[_id];
        return (item.id, item.tokenURI, item.publisher, item.owners, item.prompt, item.description, item.model, item.price, item.isCanceled);
        // 配列の形で返る
    }



    // function cancelList (uint id){ // updateSPT あるから、要らんかも
    //     SPT item = SPT_list[id];
    //     require(msg.sender == item.publisher, "cancelList: Only Publisher can cancel listing");
    // }

    // function withdraw(){}

}
