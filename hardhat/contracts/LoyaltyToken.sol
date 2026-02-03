// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract LoyaltyToken is ERC20 {
    address public owner;
    address public casino;

    constructor() ERC20("LoyaltyToken", "CHIP") {
        owner = msg.sender;
    }
    function setCasino(address _casino) external onlyOwner {
        casino = _casino;
    }

    
    function mint(address to, uint256 amount) external onlyCasino {
        _mint(to, amount);
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    modifier onlyCasino() {
        require(msg.sender == casino, "Only casino can call this function");
        _;
    }
}