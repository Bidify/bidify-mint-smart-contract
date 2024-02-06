// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BidifyToken.sol";

contract BidifyFactory {
    address public admin;
    struct Collection {
        address platform;
        string name;
        string symbol;
    }
    mapping(address => Collection[]) public collectionOwned;
    // mapping(string => address) public collectionAddress;

    event MintTokenAddress(BidifyToken tokenAddress);
    event MultiPleMintProcess(string uri, uint count, BidifyToken platform);
    event CreatedCollection(string collection, string symbol, address caller, BidifyToken tokenAddress);


    constructor() {
        admin = msg.sender;
    }

    modifier onlyManager() {
        require(msg.sender == admin, "only admin!");
        _;
    }
    // event CollectionCreated(string name, string symbol, address indexed createdBy);

    function calculateCost(uint amount) public pure returns(uint cost) {
        if(amount < 10) cost = 1e14;
        else if(amount < 100) cost = 1e15;
        else cost = 1e16;
    }

    function mint(string memory uri, uint count, string memory collection, string memory symbol, address platform) external payable {
        require(count <= 500, "Minting amount can't be over 500!");
        uint256 mintCost = calculateCost(count);
        require(msg.value >= mintCost, "Minting fee is lower than price");
        BidifyToken tokenAddress;
        if(platform == address(0)) {
            tokenAddress = createCollection(collection, symbol, msg.sender);
            emit CreatedCollection(collection, symbol, msg.sender, tokenAddress);
        }
        else {
            tokenAddress = BidifyToken(platform);
        }
        emit MintTokenAddress(tokenAddress);
        multipleMint(uri, count, tokenAddress);

        uint256 _cost = msg.value;
        (bool succeedOwner, ) = payable(admin).call{value: _cost}("");
        require(succeedOwner, "Failed to withdraw to the owner");
        _cost = 0;
    }
    
    function createCollection(string memory collection, string memory symbol, address user) internal returns(BidifyToken) {
        BidifyToken platform = new BidifyToken(collection, symbol);
        Collection memory created = Collection(address(platform), collection, symbol);
        collectionOwned[user].push(created);
        // emit CollectionCreated(collection, symbol, user);
        return platform;
    }
    function multipleMint(string memory uri, uint count, BidifyToken platform) internal {
        for(uint i = 0; i < count; i ++) {
            BidifyToken(platform).safeMint(msg.sender, uri);
            emit MultiPleMintProcess(uri, count, platform); //emit progress info
        }
    }
    function getCollections() external view returns(Collection[] memory) {
        return collectionOwned[msg.sender];
    }

    function setAdmin(address to) external onlyManager {
        admin = to;
    }

    function withdraw() external onlyManager {
        uint256 amount = address(this).balance;
        (bool succeedOwner, ) = payable(msg.sender).call{value: amount}("");
        require(succeedOwner, "Failed to withdraw to the owner");
    }
}