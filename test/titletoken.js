

//jshint ignore: start

const TitleToken = artifacts.require("./TitleToken.sol");

/**************************************
* Helpers
**************************************/
const promisify = (inner) => new Promise((resolve, reject) =>
  inner((err, res) => {
    if (err) { reject(err) }
    resolve(res);
  })
);
const getBalance = (account, at) => promisify(cb => web3.eth.getBalance(account, at, cb));
const timeout = ms => new Promise(res => setTimeout(res, ms))

/**************************************
* Contract
**************************************/
contract('TitleToken', function(accounts) {
  
  let token;
  const owner = accounts[0];
  const rand1 = accounts[1];
  const rand2 = accounts[2];
  const rand3 = accounts[3];
  const mill = 1000000;
  
  it('TitleToken should be deployed', async function() {
    token = await TitleToken.deployed();
    assert(token !== undefined, 'TitleToken is undefined');
  });
  
  it('TitleToken should be owned', async function() {
    const o = await token.owner.call();
    assert(o === owner, 'TitleToken is not owned by owner');
  });
  
  it('Owner should mint some and transfer to rand1', async function() {
    const tx = await token.mint(mill, rand1);
    
    console.log(tx.logs[0].args);
    
    const totalSupply = (await token.totalSupply.call()).toNumber();
    assert(totalSupply === mill, 'totalSupply wrong');
    
    const balance = (await token.balanceOf.call(0)).toNumber();
    assert(balance === mill, 'balance wrong');
  });
  
  it('Portion of title can be transferred', async function() {
    const tx = await token.transfer(rand2, 0, mill / 2, { from: rand1 });
    
    console.log(tx.logs[0].args);
  });
  
  it('Portion of portion can be transferred', async function() {
    const tx = await token.transfer(rand3, 1, mill / 4, { from: rand2 });

    console.log(tx.logs[0].args);
  });
  
  
});

//jshint ignore: end
