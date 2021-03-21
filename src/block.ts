import { ethereum } from '@graphprotocol/graph-ts'

// This is invoked every block, after all event and call handlers
export function handleBlock(block: ethereum.Block ) : void {
  // Do  nothing
}

// This is invoked every block that has a call to the SIFI contract, after all event and call handlers
export function handleBlockWithContractCall(block: ethereum.Block ) : void {
  // Do nothing
}
