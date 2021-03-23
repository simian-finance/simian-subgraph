import { Address, BigDecimal } from "@graphprotocol/graph-ts"
import { Contract } from '../types/Contract/Contract'
import { Account } from '../types/schema'
import { convertTokenToDecimal } from "../helpers"
import { DECIMAL_ZERO } from "../constants"

/* Updates the sender account and returns whether it reached a zero balance */
export function updateSenderAccount(contract: Contract, sender: Address, transferAmount: BigDecimal): boolean {
  let senderId = sender.toHexString()
  let account = Account.load(senderId)

  // The sender account can only send if they have received tokens, so this should never be null
  // Only case is ADDRESS_ZERO, which we can safely ignore
  if (account == null) {
    return false
  }

  // Update the raw balance, which is the amount of tokens purely from transfers (in/out)
  account.rawBalance = account.rawBalance.minus(transferAmount)

  // Update the actual balance from the contract (including reflection)
  account.balance = convertTokenToDecimal(contract.balanceOf(sender))
  account.save()

  return account.balance.le(DECIMAL_ZERO)
}

/* Updates the recipients account and returns whether it is a new holder */
export function updateRecipientAccount(contract: Contract, recipient: Address, transferAmount: BigDecimal): boolean {
  let recipientId = recipient.toHexString()
  let account = Account.load(recipientId)

  // If this the first transfer for this recipient, create a new account
  if (account == null) {
    account = new Account(recipientId)
    account.rawBalance = DECIMAL_ZERO
    account.balance = DECIMAL_ZERO
  }

  let previousBalance = account.balance

  // Update the raw balance, which is the amount of tokens purely from transfers (in/out)
  account.rawBalance = account.rawBalance.plus(transferAmount)

  // Update the actual balance from the contract (including reflection)
  account.balance = convertTokenToDecimal(contract.balanceOf(recipient))
  account.save()

  // Return whether the account is new holder or not
  return previousBalance.le(DECIMAL_ZERO) && account.balance.gt(DECIMAL_ZERO)
}
