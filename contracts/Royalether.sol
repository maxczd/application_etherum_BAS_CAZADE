pragma solidity ^0.4.2;

contract Royalether {

	mapping (address => uint) balances;
	event Transfer(address indexed _from, address indexed _to, uint256 _value);

	function Royalether() {
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

	function getBalance(address addr) constant returns(uint) {
		return balances[addr];
	}
}
