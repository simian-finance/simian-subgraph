import { ethereum, BigInt } from '@graphprotocol/graph-ts'
import { getTokenInstance } from "./token"
import { updateAccountBalances } from "./accounts"


// This is invoked every block, after all event and call handlers
export function handleBlock(block: ethereum.Block ) : void {
  // Do  nothing
}

// This is invoked every block that has a call to the SIFI contract, after all event and call handlers
export function handleBlockWithContractCall(block: ethereum.Block ) : void {
  let totalHolders = updateAccountBalances()

  // Update total counts
  let token = getTokenInstance()
  token.totalHolders = totalHolders
  token.totalTransfers = BigInt.fromI32(token.transfers.length)
  token.save()
}
