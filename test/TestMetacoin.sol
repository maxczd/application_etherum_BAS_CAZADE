pragma solidity ^0.4.2;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/Royalether.sol";

contract TestRoyalether {

  function testInitialBalanceUsingDeployedContract() {
    Royalether meta = Royalether(DeployedAddresses.Royalether());

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 Royalether initially");
  }

  function testInitialBalanceWithNewRoyalether() {
    Royalether meta = new Royalether();

    uint expected = 10000;

    Assert.equal(meta.getBalance(tx.origin), expected, "Owner should have 10000 Royalether initially");
  }

}
