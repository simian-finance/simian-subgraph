import { Address, BigDecimal } from "@graphprotocol/graph-ts"
import { Contract } from './types/Contract/Contract'
import { Account } from './types/schema'
import { getTokenInstance } from "./token"
import { convertTokenToDecimal } from "./helpers"

export function updateSenderAccount(contract: Contract, sender: Address, transferAmount: BigDecimal) : void {
  let senderId = sender.toHexString()
  let account = Account.load(senderId)

  // The sender account can only send if they have received tokens, so this should never be null
  // Only case is ADDRESS_ZERO, which we can safely ignore
  if (account == null) {
    return
  }

  // Update the sender's balance
  account.balance = convertTokenToDecimal(contract.balanceOf(sender))
  account.save()
}

export function updateRecipientAccount(contract: Contract, recipient: Address, transferAmount: BigDecimal) : void {
  let recipientId = recipient.toHexString()
  let account = Account.load(recipientId)

  // If this the first transaction for this recipient, create a new account
  if (account == null) {
    account = new Account(recipientId)
    account.token = getTokenInstance().id
  }

  // Update the recipient's balance
  account.balance = convertTokenToDecimal(contract.balanceOf(recipient))
  account.save()
}
