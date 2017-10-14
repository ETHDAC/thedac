

//jshint ignore: start

pragma solidity ^0.4.11;

import './Ownable.sol';
import './Project.sol';
import './TitleToken.sol';

contract DAC is Ownable {
  
  TitleToken public token;
  address[] public projects;
  
  uint256 public goal = 1000 ether;
  uint256 public balance = 500 ether;
  
  function DAC() {
    createProject('books for good');
    createProject('medical beds for all');
    createProject('end poverty');
    createProject('feed everyone');
    createProject('replant all trees ever');
    
    token = new TitleToken();
  }
  
  function () payable {
    
    /**************************************
    * 1) ETH -> WETH 2) WETH trade to SAI
    **************************************/
    
    //some SAI amount
    balance += msg.value;
    token.mint(msg.value, msg.sender);
  }
  
  function transfer(address _to, uint256 _title, uint256 _amount) onlyOwner {
    token.transfer(_to, _title, _amount);
  }
  
  function createProject(bytes32 _name) {
    projects.push(new Project(_name));
  }
  
  function getProjects() returns (address[]) { return projects; }
  
}



//jshint ignore: end