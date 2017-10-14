

//jshint ignore: start

pragma solidity ^0.4.11;

import './Ownable.sol';
import './Project.sol';

contract Project is Ownable {
  bytes32 public name;
  function Project(bytes32 _name) { name = _name; }
}



//jshint ignore: end