import { ethereum } from '@graphprotocol/graph-ts'
import { updateTokenSupply } from "./token"
import { updateAccountBalances } from "./accounts"

// This is invoked every block, after all event and call handlers
export function handleBlock(block: ethereum.Block ) : void {
  updateTokenSupply()
  updateAccountBalances()
}
