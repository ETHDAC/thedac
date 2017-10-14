

//jshint ignore: start

pragma solidity ^0.4.11;

import './Ownable.sol';
import './Project.sol';
import './TitleToken.sol';

contract DAC is Ownable {
  
  TitleToken public token;
  address[] public projects;
  
  uint256 public goal;
  uint256 public balance;
  
  function () payable {
    
    /**************************************
    * 1) ETH -> WETH 2) WETH trade to SAI
    **************************************/
    
    //some SAI amount
    balance += 1000000;
    token.mint(1000000, msg.sender);
  }
  
  function transfer(address _to, uint256 _title, uint256 _amount) onlyOwner {
    token.transfer(_to, _title, _amount);
  }
  
  function createToken() {
    token = new TitleToken();
  }
  
  function createProject(bytes32 _name) {
    projects.push(new Project(_name));
  }
  
  function getProjects() returns (address[]) { return projects; }
  
  
  
}



//jshint ignore: end