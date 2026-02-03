// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract Vault {
    address public owner;
    address public casino;
    constructor() {
        owner = msg.sender;
    }

    function depositHouseFunds() external payable onlyOwner {
    }
    function setCasino(address _casino) external onlyOwner {
        casino = _casino;
    }
    function withdrawHouseFunds(uint256 amount) external onlyOwner {
        require(address(this).balance >= amount, "Insufficient contract balance");
        payable(owner).transfer(amount);
    }


    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }
    function payWinner(address winner, uint256 amount) external onlyCasino {
        require(address(this).balance >= amount, "Insufficient funds in vault");
        payable(winner).transfer(amount);
    }


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
    modifier onlyCasino() {
        require(msg.sender == casino, "Only casino contract can call this function");
        _;
    }
}