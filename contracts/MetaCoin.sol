pragma solidity ^0.4.2;

//import "./ConvertLib.sol";

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
