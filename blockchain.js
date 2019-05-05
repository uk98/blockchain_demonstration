const SHA256 = require("crypto-js/sha256");
class Transactions{
    constructor(fromAddress, toAddress, amount){
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}
class Block
{
    constructor(timestamp, transactions, previoushash = '')
    {
        //this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previoushash = previoushash;
        this.hash = this.calculate_hash();
        this.nonce = 0;
    }
    calculate_hash()
    {
        //SHA256 Cryptography
        return SHA256( this.timestamp + this.previoushash + JSON.stringify(this.transactions) + this.nonce).toString();

    }
    mineNewBlock(difficulty)
    {
        while(this.hash.substring(0,difficulty) !== Array(difficulty + 1).join("0"))
        {
            this.nonce++;
            this.hash = this.calculate_hash();
        }
        console.log("New block has been mined with hash : "+ this.hash);
    }
    
}

class Blockchain
{
    constructor()
    {
        //genesis block
        this.chain = [this.create_genesis_block()];
        this.difficulty = 3;
        this.pendingTransactions = [];
        this.miningReward = 10;

    }
    create_genesis_block()
    {
        return new Block(0,"30/09/2018","First block","0");
    }
    getlatestBlock()
    {
        return this.chain[this.chain.length-1];
    }
    /*addBlock(newBlock) //new block object
    {
        newBlock.previoushash = this.getlatestBlock().hash; //hash of previous block
        //newBlock.hash = newBlock.calculate_hash(); //hash of current block
        newBlock.mineNewBlock(this.difficulty);
        this.chain.push(newBlock);
    }*/
    minePendingTransactions(miningRewardAddress){
        let block = new Block(Date.now(), this.pendingTransactions, this.getlatestBlock().hash);
        block.mineNewBlock(this.difficulty);
        console.log("Block mined successfully");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transactions(null, miningRewardAddress, this.miningReward)
        ];
    }
    createTransaction(transaction)
    {
        this.pendingTransactions.push(transaction);
    }
    getBalanceOfAddress(address){
        let balance = 0;
        for(const block of this.chain)
        {
            for(const trans of block.transactions)
            {
                if(trans.fromAddress === address )
                {
                    balance = balance - trans.amount;
                }
                if(trans.toAddress === address){
                    balance = balance + trans.amount;
                }
            }
        }
        return balance;
    }
    checkBlockValid()
    {
        for(let i=1; i<this.chain.length; i++)
        {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i-1];
            if(currentBlock.hash != currentBlock.calculate_hash())
            {
                return false;
            }
            if(currentBlock.previoushash != previousBlock.hash)
            {
                return false;
            }
        }
        return true;
    }

}
//creating new blocks
//let block1 = new Block(1,"01/10/2018",{mybalance : 10});
//let block2 = new Block(2,"01/10/2018",{mybalance : 50});
//let block3 = new Block(3,"22/01/2019",{mybalance : 100});

//creating blockchain
//let myBlockchain  = new Blockchain();
//console.log("the first block creation :");
//adding new blocks to blockchain
//myBlockchain.addBlock(block1);
//console.log("second block creation : ");
//myBlockchain.addBlock(block2);
//myBlockchain.addBlock(block3);
//console.log(JSON.stringify(myBlockchain,null,4));
//validation check of blocks
//console.log("Validation check for the blockchain before hacking :" +myBlockchain.checkBlockValid());
//myBlockchain.chain[2].data = { mybalance : 100 };
//console.log("Validation check for the blockchain after hacking :" +myBlockchain.checkBlockValid());

let ukcoin = new Blockchain();
transaction1 = new Transactions("U", "K", 100);
ukcoin.createTransaction(transaction1);
transaction2 = new Transactions("K","U", 30);
ukcoin.createTransaction(transaction2);
console.log("Mining started by the miner!!!!!!!");
ukcoin.minePendingTransactions("Z");
console.log("Balance for U is "+ukcoin.getBalanceOfAddress("U"));
console.log("Balance for K is "+ukcoin.getBalanceOfAddress("K"));
console.log("Balance for Z is "+ukcoin.getBalanceOfAddress("Z"));

console.log("Mining started again by the miner!!!!!!!");
ukcoin.minePendingTransactions("Z");
console.log("Balance for Z is "+ukcoin.getBalanceOfAddress("Z"));

