// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/utils/math/SafeMath.sol";


// SPT: Shareble Prompt Token
struct SPT {
    uint id;
    string tokenURI; 
    address publisher; // person who created the prompt.

    string promptHash; // privateにされるべき
    string params; // privateにされるべき
    string description;
    string model;
    // float tempareture
    uint price;
    uint numSales; // 何回売れたか
    uint sumRate;  // トータルの星の数
    bool isCanceled;
}

contract SPTMarket {

    address private deployer;

    SPT[] private SPT_list; 
    using SafeMath for uint;

    enum UserStatus { // 
        INITIAL,    // 無関係
        ONGOING,// 購入して、評価する前
        OWNED,  // 評価して、取引が完了した後
        PUBLISHED // ユーザーが出品者
    }
    mapping (address => mapping(uint => UserStatus)) userStatus; // this indicates the user state about the item of the Id

    event SPTUpdate(uint id, string tokenURI, address publisher, address[] owners, string prompt, string params,  string description, string model, uint price, bool isCanceled);


    // modifier onlyOwners(uint id) {

    //     require(isInOwners(id) == true, "onlyOwners: Only owners can access to this method");
    //     _;
    // }

    // modifier onlyPublisher(uint id) {
    //     SPT storage item = SPT_list[id];
    //     require( item.publisher == msg.sender, "onlyPublisher: Only publisher can access to this method");
    //     _;
    // }

    modifier onlyDeployer() {
        require( deployer == msg.sender, "onlyDeployer: Only deployer can access to this method");
        _;
    }

    constructor() {
        deployer = msg.sender;
    }

    // function isInOwners(uint id) private view returns(bool isInOwnersFlg) {
    //     isInOwnersFlg = false;
    //     SPT storage item = SPT_list[id];

    //     for(uint i = 0; i < item.owners.length; i++){
    //         if (msg.sender == item.owners[i]){
    //             isInOwnersFlg = true;
    //         }
    //     }
    //     return isInOwnersFlg;
    // }

    function getUserStatus(uint id) public view returns (UserStatus) {
        return userStatus[msg.sender][id];

    }

    function createSPT(string memory tokenURI, string memory promptHash, string memory params, string memory description, string memory model, uint price) public {
        require(price >= 0, "createSPT: price must be greater than or equals to 0");

        // mapping (address => bool) storage isInOwners;
        uint _id = SPT_list.length;
        SPT memory newSPT = SPT({
            id: _id,
            tokenURI: tokenURI,
            publisher: msg.sender,
            promptHash: promptHash,
            params: params,
            description: description,
            model: model,
            price: price,
            numSales : 0, // 何回売れたか
            sumRate : 0,  // トータルの星の数
            isCanceled: false
        });

        SPT_list.push(newSPT);
        // emit SPTUpdate(_id, tokenURI, msg.sender, owners, promptHash, params, description, model, price, false);
        userStatus[msg.sender][_id] = UserStatus.PUBLISHED;
    }


    function showPromptHash(uint id) public view returns(string memory prompt)  {
        SPT storage item = SPT_list[id];
        return item.promptHash;
    }

    function buySPT(uint id) payable public {

        SPT storage item = SPT_list[id];
        require(msg.sender != item.publisher, "The publisher cannot buy the item");
        require(item.isCanceled == false, "buySPT: This item cannot be bought");
        require(msg.value == item.price, "buySPT: You don't match the price");


        // payable(item.publisher).transfer(item.price.mul(90).div(100));

        userStatus[msg.sender][id] = UserStatus.ONGOING; 

        // emit SPTUpdate(id, item.tokenURI, item.publisher, item.owners, item.promptHash, item.params, item.description, item.model, item.price, item.isCanceled);
        // ownedSPTs[msg.sender].push(id);
    }

    function reviewSPT(uint id, uint rate) public { // 評価をして取引を完了させる
        SPT storage item = SPT_list[id];
        require(userStatus[msg.sender][id] == UserStatus.ONGOING, "reviewSPT: The user cannot review for this Item.");
        require(rate <= 5 && rate >=1, "reviewSPT: Argument value error, the value of rate must be 1 <= rate <= 5");

        uint commission_fee = (5-rate)*5; // 評価が高ければ高いほど、出品者へ還元される。0 〜 20 % のあいだ

        payable(item.publisher).transfer(item.price.mul(100-commission_fee).div(100));

        userStatus[msg.sender][id] = UserStatus.OWNED;

        item.numSales++;
        item.sumRate += rate;
    }



    // function updateSPT(uint id, string memory tokenURI, string memory prompt, string memory params, string memory description, string memory model, uint price, bool isCanceled) public {
    //     require(userStatus[msg.sender][id] == UserStatus.PUBLISHED, "onlyOwners: Only owners can access to this method");
    //     SPT storage item = SPT_list[id];

    //     emit SPTUpdate(id, tokenURI, item.publisher, item.owners, prompt, params, description, model, price, isCanceled); // item. が付いているのは、変わらないやつ
    // }




    // function cancelList (uint id){ // updateSPT あるから、要らんかも
    //     SPT item = SPT_list[id];
    //     require(msg.sender == item.publisher, "cancelList: Only Publisher can cancel listing");
    // }




    function getPublishedSPTids() public view returns( uint[] memory ) {
        uint[] memory ids = new uint[](SPT_list.length);

        uint idx = 0;
        for(uint i=0; i < SPT_list.length; i++){
            if(userStatus[msg.sender][i] == UserStatus.PUBLISHED){
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
            if(userStatus[msg.sender][i] == UserStatus.OWNED ){
                ids[idx] = i;
                idx++;
            }
        }
        return ids;
    }

    function getOnGoingSPTids() public view returns( uint[] memory ) {
        uint[] memory ids = new uint[](SPT_list.length);

        uint idx = 0;
        for(uint i=0; i < SPT_list.length; i++){
            if(userStatus[msg.sender][i] == UserStatus.ONGOING ){
                ids[idx] = i;
                idx++;
            }
        }
        return ids;
    }


    // On Going or Owned
    function getPurchasedSPTids() public view returns( uint[] memory ) {
        uint[] memory ids = new uint[](SPT_list.length);

        uint idx = 0;
        for(uint i=0; i < SPT_list.length; i++){
            if(userStatus[msg.sender][i] == UserStatus.ONGOING || userStatus[msg.sender][i] == UserStatus.OWNED ){
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

        string memory description,
        string memory model,
        // float tempareture
        uint price,
        uint numSales, // 何回売れたか
        uint sumRate,  // トータルの星の数

        bool isCanceled
    ) {
        
        SPT storage item = SPT_list[_id];
        return (item.id, item.tokenURI, item.publisher, item.description, item.model, item.price, item.numSales, item.sumRate, item.isCanceled);
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
