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
	const EXCHANGE_ADDRESS = await zeroEx.exchange.getContractAddressAsync();  // The Exchange.sol address (0x exchange smart contract)

  // Getting list of accounts
	const accounts =  await zeroEx.getAvailableAddressesAsync();
	console.log(accounts);

  const [makerAddress, takerAddress] = accounts;

	// Unlimited allowances to 0x contract for maker and taker
	const txHashAllowMaker = await zeroEx.token.setUnlimitedProxyAllowanceAsync(ZRX_ADDRESS,  makerAddress);
	await zeroEx.awaitTransactionMinedAsync(txHashAllowMaker);
	console.log('Maker Allowance Mined...');

	const txHashAllowTaker = await zeroEx.token.setUnlimitedProxyAllowanceAsync(WETH_ADDRESS, takerAddress);
	await zeroEx.awaitTransactionMinedAsync(txHashAllowTaker);
	console.log('takerFee Allowance Mined...');

  // Deposit WETH
  	const ethToConvert = ZeroEx.toBaseUnitAmount(new BigNumber(0.001), DECIMALS); // Number of ETH to convert to WETH

    const txHashWETH = zeroEx.etherToken.depositAsync(ethToConvert, takerAddress);
	  await zeroEx.awaitTransactionMinedAsync(txHashWETH);
	  console.log('ETH -> WETH Mined...');

})
