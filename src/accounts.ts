import { Address, BigDecimal } from "@graphprotocol/graph-ts"
import { SimianToken } from './types/SimianToken/SimianToken'
import { Account } from './types/schema'
import { DECIMAL_ZERO } from "./constants"
import { convertTokenToDecimal } from "./helpers"

export function updateSenderAccount(contract: SimianToken, sender: Address, transferAmount: BigDecimal) : void {
  let senderId = sender.toHexString()
  let account = Account.load(senderId)

  // The sender account can only send if they have received tokens, so this should never be null
  // Only case is ADDRESS_ZERO, which we can safely ignore
  if (account == null) {
    return
  }

  // Raw balance includes all the sent/received tokens
  account.rawBalance = account.rawBalance.minus(transferAmount)
  // Balance is the official token balance (including reflection)
  account.balance = convertTokenToDecimal(contract.balanceOf(sender))
  // Earned fees are the actual balance minus the raw balance
  account.earnedFees = account.balance.minus(account.rawBalance)

  account.save()
}

export function updateRecipientAccount(contract: SimianToken, recipient: Address, transferAmount: BigDecimal) : void {
  let recipientId = recipient.toHexString()
  let account = Account.load(recipientId)

  // If this the first transaction for this recipient, create a new account
  if (account == null) {
    account = new Account(recipientId)
    account.rawBalance = DECIMAL_ZERO
  }

  // Raw balance includes all the sent/received tokens
  account.rawBalance = account.rawBalance.plus(transferAmount)
  // Balance is the official token balance (including reflection)
  account.balance = convertTokenToDecimal(contract.balanceOf(recipient))
  // Earned fees are the actual balance minus the raw balance
  account.earnedFees = account.balance.minus(account.rawBalance)

  account.save()
}
