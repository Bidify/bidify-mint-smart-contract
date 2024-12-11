// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "./BidifyToken.sol";

contract BidifyFactory is Ownable {
    address public BIDIFY_ETH = 0x0dBe2B3C868d51329d4be934662261A0Bf8BA7cF;
    struct Collection {
        address platform;
        string name;
        string symbol;
    }
    mapping(address => Collection[]) public collectionOwned;
    constructor() {}

    function calculateCost(uint amount) public pure returns (uint cost) {
        if (amount < 10) cost = 3 * 1e13;
        else if (amount < 100) cost = 3 * 1e14;
        else cost = 6 * 1e14;
    }

    function mint(
        string memory uri,
        uint count,
        string memory collection,
        string memory symbol,
        address platform
    ) external payable {
        require(count <= 999, "Minting amount can't be over 999!");
        uint256 mintCost = calculateCost(count);
        require(msg.value >= mintCost, "Minting fee is lower than price");
        BidifyToken tokenAddress;
        if (platform == address(0)) {
            tokenAddress = createCollection(collection, symbol, msg.sender);
        } else {
            tokenAddress = BidifyToken(platform);
        }
        multipleMint(uri, count, tokenAddress);

        uint256 _cost = msg.value;
        (bool succeedOwner, ) = payable(BIDIFY_ETH).call{value: _cost}("");
        require(succeedOwner, "Failed to withdraw to the owner");
        _cost = 0;
    }

    function createCollection(
        string memory collection,
        string memory symbol,
        address user
    ) public returns (BidifyToken) {
        BidifyToken platform = new BidifyToken(collection, symbol);
        Collection memory created = Collection(
            address(platform),
            collection,
            symbol
        );
        collectionOwned[user].push(created);
        return platform;
    }
    function multipleMint(
        string memory uri,
        uint count,
        BidifyToken platform
    ) internal {
        for (uint i = 0; i < count; i++) {
            BidifyToken(platform).safeMint(msg.sender, uri);
        }
    }
    function getCollections() external view returns (Collection[] memory) {
        return collectionOwned[msg.sender];
    }

    function withdraw() external onlyOwner {
        uint256 amount = address(this).balance;
        (bool succeedOwner, ) = payable(msg.sender).call{value: amount}("");
        require(succeedOwner, "Failed to withdraw to the owner");
    }
}
