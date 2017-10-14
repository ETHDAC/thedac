

//jshint ignore: start

pragma solidity ^0.4.11;

import './Ownable.sol';
import './SafeMath.sol';

contract TitleToken is Ownable {

  using SafeMath for uint256;

  /**************************************
  * Events
  **************************************/
  event Transfer(uint256 title, uint256 a, uint256 b, address addressA, address addressB);
  event Origin(uint256 title, address origin);

  //TitleToken Stuff
  uint256 public totalSupply;
  uint256 public titleCount;
  mapping(uint256 => Title) public titleData;

  struct Title {
    uint256 balance;
    address owner;
    bool active;
  }

  function balanceOf(uint256 _title) public constant returns (uint256) {
    return titleData[_title].balance;
  }

  function mint(uint256 _amount, address _to) onlyOwner {
    uint256 title = allocate(_amount, _to);
    Origin(title, _to);
    totalSupply += _amount;
  }

  function allocate(uint256 _amount, address _to) returns (uint256) {
    titleData[titleCount] = Title(_amount, _to, true);
    titleCount++;
    return titleCount - 1;
  }

  function transfer(address _to, uint256 _title, uint256 _amount) public returns (bool) {
    //check it's all good to transfer
    require(titleData[_title].active);
    require(_amount < titleData[_title].balance);
    address titleOwner = titleData[_title].owner;
    require(msg.sender == titleOwner || msg.sender == owner);

    //calc title split
    uint256 remainder = titleData[_title].balance;
    uint256 a = allocate(_amount, _to);
    uint256 b = allocate(remainder, titleOwner);

    //transfer titles
    Transfer(_title, a, b, _to, titleOwner);

    //invalidate this title
    titleData[_title].active = false;
  }

}



//jshint ignore: end
