// SPDX-License-Identifier: None
pragma solidity ^0.8.20;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721EnumerableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/security/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721BurnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/utils/CountersUpgradeable.sol";
import {Strings} from "@openzeppelin/contracts/utils/Strings.sol";

contract Moon42NFT is
    Initializable,
    ERC721Upgradeable,
    ERC721EnumerableUpgradeable,
    ERC721URIStorageUpgradeable,
    ERC721BurnableUpgradeable,
    PausableUpgradeable,
    AccessControlUpgradeable
{
    using AddressUpgradeable for address;
    using StringsUpgradeable for uint256;
    using CountersUpgradeable for CountersUpgradeable.Counter;

    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    CountersUpgradeable.Counter public tokenId;

    mapping(uint256 => uint256) public tokenType;
    // 0 = register
    // 1 = track

    mapping(uint256 => string) public campaignIds; // nftId => campaignId
    mapping(string => uint256[]) public campaignNfts; // campaignId => nftIds
    mapping(uint256 => string) public medalIds; // tokenId => medalId

    mapping(bytes => bool) public proofs;

    address public signer;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC721_init("moon42", "M42");
        __ERC721Enumerable_init();
        __Pausable_init();
        __AccessControl_init();
        __ERC721Burnable_init();

        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);

        _pause();
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function setSigner(address _signer) public onlyRole(PAUSER_ROLE) {
        signer = _signer;
    }

    function getSigner() public view returns (address) {
        return signer;
    }

    function safeMint(string memory campaignId, uint256 _tokenType, string memory medalId, string memory _tokenURI, bytes memory signature) public whenNotPaused {
        require(verify(msg.sender, campaignId, _tokenType, medalId, _tokenURI, signature), "signature do not match");
        require(proofs[signature] == false, "minted already");

        proofs[signature] = true;

        uint256 _tokenId = tokenId.current();

        tokenType[_tokenId] = _tokenType;
        campaignIds[_tokenId] = campaignId;
        medalIds[_tokenId] = medalId;
        campaignNfts[campaignId].push(_tokenId);

        tokenId.increment();
        _safeMint(msg.sender, _tokenId);
        _setTokenURI(_tokenId, _tokenURI);
    }

    function getMessageHash(address sender, string memory campaignId, uint256 _tokenType, string memory medalId, string memory _tokenURI) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(sender, campaignId, _tokenType, medalId, _tokenURI));
    }

    // https://solidity-by-example.org/signature/
    function verify(
        address sender,
        string memory campaignId,
        uint256 _tokenType,
        string memory medalId,
        string memory _tokenURI,
        bytes memory signature
    ) public view returns (bool) {
        bytes32 messageHash = getMessageHash(sender, campaignId, _tokenType, medalId, _tokenURI);
        bytes32 ethSignedMessageHash = getEthSignedMessageHash(messageHash);

        return recoverSigner(ethSignedMessageHash, signature) == signer;
    }

    function _beforeTokenTransfer(address from, address to, uint256 _tokenId, uint256 batchSize) internal override(ERC721Upgradeable, ERC721EnumerableUpgradeable) whenNotPaused {
        super._beforeTokenTransfer(from, to, _tokenId, batchSize);
    }

    function _burn(uint256 _tokenId) internal override(ERC721Upgradeable, ERC721URIStorageUpgradeable) {
        super._burn(_tokenId);
    }

    function tokenURI(uint256 _tokenId) public view override(ERC721Upgradeable, ERC721URIStorageUpgradeable) returns (string memory) {
        return super.tokenURI(_tokenId);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) public view override(ERC721Upgradeable, ERC721EnumerableUpgradeable, AccessControlUpgradeable, ERC721URIStorageUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }

    function getEthSignedMessageHash(bytes32 _messageHash) public pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", _messageHash));
    }

    function recoverSigner(bytes32 _ethSignedMessageHash, bytes memory _signature) public pure returns (address) {
        (bytes32 r, bytes32 s, uint8 v) = splitSignature(_signature);

        return ecrecover(_ethSignedMessageHash, v, r, s);
    }

    function splitSignature(bytes memory sig) public pure returns (bytes32 r, bytes32 s, uint8 v) {
        require(sig.length == 65, "invalid signature length");

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }
    }
}
