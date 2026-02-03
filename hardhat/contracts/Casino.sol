// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

interface IVault {
    function getBalance() external view returns (uint256);
    function payWinner(address winner, uint256 amount) external;
}
interface ILoyaltyToken {
    function mint(address to, uint256 amount) external;
}

contract Casino {
    address public owner;
    IVault public vault;
    ILoyaltyToken public token;
    mapping(address => bytes32) public commits;

    constructor(address _vault, address _token) {
        owner = msg.sender;
        vault = IVault(_vault);
        token = ILoyaltyToken(_token);
    }

    // Step 1: Player commits ETH
    function placeBet() external payable {
        require(msg.value > 0, "Bet some ETH");
        commits[msg.sender] = keccak256(abi.encodePacked(block.timestamp, msg.sender));
    }

    // Step 2: Player reveals and contract verifies
    function verifyAndMint(string memory clientSeed, string memory secretServerSeed) external {
        // Verification: Recreate the result hash on-chain
        bytes32 resultHash = keccak256(abi.encodePacked(clientSeed, secretServerSeed));
        uint256 result = uint256(resultHash) % 2; // 0 = Heads, 1 = Tails

        // Logic for winning (Simplified for example)
        bool won = (result == 0); 
        
        if (won) {
            token.mint(msg.sender, 10 * 10**18);
        }
        
        emit GameResolved(msg.sender, won, 10);
    }

    function verifySlots(string memory clientSeed, string memory secretServerSeed) external {
        bytes32 resultHash = keccak256(abi.encodePacked(clientSeed, secretServerSeed));
        
        // Extract 3 reel results from the same hash
        uint256 reel1 = uint256(resultHash) % 8;
        uint256 reel2 = (uint256(resultHash) / 8) % 8;
        uint256 reel3 = (uint256(resultHash) / 64) % 8;

        // Win condition: All three reels match
        if (reel1 == reel2 && reel2 == reel3) {
            token.mint(msg.sender, 100 * 10**18); // Big jackpot: 100 Tokens
        } else {
            token.mint(msg.sender, 1 * 10**18); // Consolation: 1 Token for playing
        }
        
        emit GameResolved(msg.sender, (reel1 == reel2 && reel2 == reel3), 100);
    }


    event GameResolved(address player, bool won, uint256 amountMinted);


    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }
}