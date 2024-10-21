// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract HelloWorldTask{
    address public owner;
    mapping (address => uint) public payments;
    event HelloWorld(string message);

    constructor(){
        owner = msg.sender;
    }

    function payForItem() public payable {
        payments[msg.sender] = msg.value;
        emit HelloWorld("Hello, World!");
    }

    function withdrowAll() public {
        address payable _to = payable(owner);
        address _thisContract = address(this);
        _to.transfer(_thisContract.balance);
    }
}