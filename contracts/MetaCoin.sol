pragma solidity ^0.4.2;

//import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoin {

	mapping (address => uint) balances;
	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	function MetaCoin() {
		balances[tx.origin] = 10000;
	}

	function sendCoin(address[] receiver, uint amount) returns(bool sufficient) {
		if (balances[msg.sender] < amount) return false;
		balances[msg.sender] -= amount;
		var result = amount/receiver.length;
		for(uint i = 0; i<receiver.length; i++){
			balances[receiver[i]] += result;
			Transfer(msg.sender, receiver[i], result);
			getBalance(receiver[i]);
		}
		return true;
	}

	/*function getBalanceInEth(address addr) constant returns(uint){
		return ConvertLib.convert(getBalance(addr),2);
	}*/

	function getBalance(address addr) constant returns(uint) {
		return balances[addr];
	}
}
