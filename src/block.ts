import { Address, ethereum } from '@graphprotocol/graph-ts'
import { Contract } from "./types/Contract/Contract"
import { Account } from "./types/schema"
import { getTokenInstance } from "./token"
import { convertTokenToDecimal } from "./helpers"

// This is invoked every block, after all event and call handlers
export function handleBlock(block: ethereum.Block ) : void {
  // Do  nothing
}

// This is invoked every block that has a call to the SIFI contract, after all event and call handlers
export function handleBlockWithContractCall(block: ethereum.Block ) : void {
  let token = getTokenInstance()

  token.accounts.forEach((accountId) => {
    let account = Account.load(accountId)
    if (account == null) {
      return
    }

    let address = Address.fromString(accountId)
    let contract = Contract.bind(address)

    // Update account balance from contract
    account.balance = convertTokenToDecimal(contract.balanceOf(address))
    account.save()
  })
}
