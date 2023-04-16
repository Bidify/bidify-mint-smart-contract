// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BidifyToken.sol";

contract BidifyFactory {
    address public dev;
    address public admin;
    struct Collection {
        address platform;
        string name;
        string symbol;
    }
    mapping(address => Collection[]) public collectionOwned;
    // mapping(string => address) public collectionAddress;
    constructor() {
        dev = msg.sender;
        admin = msg.sender;
    }

    modifier onlyManager() {
        require(msg.sender == dev, "only admin!");
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
        }
        else {
            tokenAddress = BidifyToken(platform);
        }
        multipleMint(uri, count, tokenAddress);

        uint256 _cost = msg.value;
        uint256 ownerFee = _cost / 2;
        (bool succeedOwner, ) = payable(admin).call{value: ownerFee}("");
        require(succeedOwner, "Failed to withdraw to the owner");
        _cost -= ownerFee;
        (bool succeedDev, ) = payable(dev).call{value: _cost}("");
        require(succeedDev, "Failed to withdraw to the dev");
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
        }
    }
    function getCollections() external view returns(Collection[] memory) {
        return collectionOwned[msg.sender];
    }

    function setdev(address to) external onlyManager {
        dev = to;
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