import {ZeroEx} from '0x.js';

const Web3 = require('web3');
const ZeroEx = require('0x.js').ZeroEx;
const BigNumber = require('bignumber.js');

// Infura Kovan provider
const provider = new Web3.providers.HttpProvider('https://kovan.infura.io')

// Instantiate 0x.js instance
const zeroEx = new ZeroEx(provider);

(async () => {

  // Number of decimals to use (for ETH and ZRX)
	const DECIMALS = 18;

  const NULL_ADDRESS = ZeroEx.NULL_ADDRESS;
  const WETH_ADDRESS = await zeroEx.etherToken.getContractAddressAsync();      // The wrapped ETH token contract
  const ZRX_ADDRESS  = await zeroEx.exchange.getZRXTokenAddressAsync();        // The ZRX token contract
	const EXCHANGE_ADDRESS   = await zeroEx.exchange.getContractAddressAsync();  // The Exchange.sol address (0x exchange smart contract)



}
