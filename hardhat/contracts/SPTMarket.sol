// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


// SPT: Shareble Prompt Token
struct SPT {
    uint id;
    string tokenURI; 
    address publisher; // person who created the prompt.
    address[] owners;  // person who have an access to the prompt  // mapping (address => bool) isInOwners; // True if a person have an access to the prompt

    string prompt; // privateにされるべき
    string params; // privateにされるべき
    string description;
    string model;
    // float tempareture
    uint price;
    bool isCanceled;
}

contract SPTMarket {

    address private deployer;

    SPT[] private SPT_list; 
    using SafeMath for uint;
    mapping (address => uint[]) ownedSPTs; // 所有しているSPT一覧を格納。もしかしたら The graph で代用できる。
    mapping (address => uint[]) listedSPTs; // 

    event SPTUpdate(uint id, string tokenURI, address publisher, address[] owners, string prompt, string params,  string description, string model, uint price, bool isCanceled);


    modifier onlyOwners(uint id) {
        // bool isInOwnersFlg = false;
        // SPT storage item = SPT_list[id];

        // for(uint i = 0; i < item.owners.length; i++){
        //     if (msg.sender == item.owners[i]){
        //         isInOwnersFlg = true;
        //     }
        // }

        require(isInOwners(id) == true, "onlyOwners: Only owners can access to this method");
        _;
    }

    modifier onlyPublisher(uint id) {
        SPT storage item = SPT_list[id];
        require( item.publisher == msg.sender, "onlyPublisher: Only publisher can access to this method");
        _;
    }

    modifier onlyDeployer() {
        require( deployer == msg.sender, "onlyDeployer: Only deployer can access to this method");
        _;
    }

    constructor() {
        deployer = msg.sender;
    }

    function isInOwners(uint id) private view returns(bool isInOwnersFlg) {
        isInOwnersFlg = false;
        SPT storage item = SPT_list[id];

        for(uint i = 0; i < item.owners.length; i++){
            if (msg.sender == item.owners[i]){
                isInOwnersFlg = true;
            }
        }
        return isInOwnersFlg;
    }


    function createSPT(string memory tokenURI, string memory prompt, string memory params, string memory description, string memory model, uint price) public {
        require(price >= 0, "createSPT: price must be greater than or equals to 0");

        // mapping (address => bool) storage isInOwners;
        address[] memory owners;
        uint _id = SPT_list.length;
        SPT memory newSPT = SPT({
            id: _id,
            tokenURI: tokenURI,
            publisher: msg.sender,
            owners: owners,
            prompt: prompt,
            params: params,
            description: description,
            model: model,
            price: price,
            isCanceled: false
        });

        SPT_list.push(newSPT);
        emit SPTUpdate(_id, tokenURI, msg.sender, owners, prompt, params, description, model, price, false);
    }


    function showPromptParams(uint id) public view onlyOwners(id) returns(string memory prompt, string memory params)  {
        SPT storage item = SPT_list[id];
        return (item.prompt, item.params);
    }

    function buySPT(uint id) payable public {

        SPT storage item = SPT_list[id];
        require(msg.sender != item.publisher, "The publisher cannot buy the item");
        require(item.isCanceled == false, "buySPT: This item cannot be bought");
        require(msg.value == item.price, "buySPT: You don't match the price");

        item.owners.push(msg.sender);

        payable(item.publisher).transfer(item.price.mul(90).div(100));


        emit SPTUpdate(id, item.tokenURI, item.publisher, item.owners, item.prompt, item.params, item.description, item.model, item.price, item.isCanceled);
        // ownedSPTs[msg.sender].push(id);
    }



    function updateSPT(uint id, string memory tokenURI, string memory prompt, string memory params, string memory description, string memory model, uint price, bool isCanceled) public onlyPublisher(id) {
        SPT storage item = SPT_list[id];

        emit SPTUpdate(id, tokenURI, item.publisher, item.owners, prompt, params, description, model, price, isCanceled); // item. が付いているのは、変わらないやつ
    }

    // function getSPTInfo(uint _id) public view returns(
    //     uint id,
    //     string memory tokenURI,
    //     address publisher, // person who created the prompt.
    //     address[] memory owners,  // person who have an access to the prompt  // mapping (address => bool) isInOwners; // True if a person have an access to the prompt

    //     string memory prompt,
    //     string memory description,
    //     string memory model,
    //     // float tempareture
    //     uint price,
    //     bool isCanceled
    // )  {
    //     SPT storage item = SPT_list[_id];
    //     return (item.id, item.tokenURI, item.publisher, item.owners, item.prompt, item.description, item.model, item.price, item.isCanceled);
    //     // 配列の形で返る
    // }



    // function cancelList (uint id){ // updateSPT あるから、要らんかも
    //     SPT item = SPT_list[id];
    //     require(msg.sender == item.publisher, "cancelList: Only Publisher can cancel listing");
    // }




    function getPublishedSPTids() public view returns( uint[] memory ) {
        uint[] memory ids = new uint[](SPT_list.length);

        uint idx = 0;
        for(uint i=0; i < SPT_list.length; i++){
            if(SPT_list[i].publisher == msg.sender){
                ids[idx] = i;
                idx++;
            }
        }
        return ids;
    }

    function getOwnedSPTids() public view returns( uint[] memory ) {
        uint[] memory ids = new uint[](SPT_list.length);

        uint idx = 0;
        for(uint i=0; i < SPT_list.length; i++){
            if(isInOwners(i) == true){
                ids[idx] = i;
                idx++;
            }
        }
        return ids;
    }

    // これまでに出品されたSPTのうち、キャンセルされてない商品のid を返す
    function getListingSPT() public view returns( uint[] memory){
        uint[] memory ids = new uint[](SPT_list.length);

        uint idx = 0;
        for(uint i=0; i < SPT_list.length; i++){
            if(SPT_list[i].isCanceled == false){
                ids[idx] = i;
                idx++;
            }
        }
        return ids;
    }


    function getSPTInfo(uint _id) public view returns(  // フロント画面で表示させるのに必要な情報を返す prompt とparams は隠す
        uint id,
        string memory tokenURI,
        address publisher, // person who created the prompt.
        address[] memory owners,  // person who have an access to the prompt  // mapping (address => bool) isInOwners; // True if a person have an access to the prompt

        string memory description,
        string memory model,
        // float tempareture
        uint price,
        bool isCanceled
    ) {
        
        SPT storage item = SPT_list[_id];
        return (item.id, item.tokenURI, item.publisher, item.owners, item.description, item.model, item.price, item.isCanceled);
    }

    function getTokenURI(uint id) public view returns(string memory tokenURI) {
        SPT storage item = SPT_list[id];
        return item.tokenURI;
    }



    function getNumItems() public view returns(uint numItem){
        numItem = SPT_list.length;
        return numItem;
    }

    function checkFunds() public view onlyDeployer() returns (uint) {
        uint256 balance =  address(this).balance;
        return balance;        
    }

    function withdrawFunds() public onlyDeployer() {
        uint256 balance =  address(this).balance;
        require(balance > 0, "NFTMarket: balance is zero");
        payable(deployer).transfer(balance);
    }

}
