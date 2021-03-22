import { Address, ethereum } from '@graphprotocol/graph-ts'
import { Contract } from "./types/Contract/Contract"
import { getTokenInstance } from "./token"
import { updateAccountBalances } from "./accounts"
import { convertTokenToDecimal } from "./helpers"
import { BURN_ADDRESS, CONTRACT_ADDRESS } from "./constants"

// This is invoked every block, after all event and call handlers
export function handleBlock(block: ethereum.Block ) : void {

}

// This is invoked every block that has a call to the SIFI contract, after all event and call handlers
export function handleBlockWithContractCall(block: ethereum.Block ) : void {
  let contract = Contract.bind(Address.fromString(CONTRACT_ADDRESS))
  let token = getTokenInstance()

  // Get the amount burned
  let burnAddress = Address.fromString(BURN_ADDRESS)
  let totalBurned = convertTokenToDecimal(contract.balanceOf(burnAddress))

  // Determine remaining supply from burned
  token.totalBurned = totalBurned
  token.remainingSupply = token.totalSupply.minus(totalBurned)
  token.save()

  updateAccountBalances()
}
