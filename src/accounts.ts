import { Address, BigDecimal } from "@graphprotocol/graph-ts"
import { Contract } from './types/Contract/Contract'
import { Account } from './types/schema'
import { getTokenInstance } from "./token"
import { convertTokenToDecimal } from "./helpers"
import { DECIMAL_ZERO, INT_ONE } from "./constants"

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

  // If account balance has reached zero, decrement holder count
  if (account.balance.le(DECIMAL_ZERO)) {
    let token = getTokenInstance()
    token.totalHolders = token.totalHolders.minus(INT_ONE)
    token.save()
  }
}

export function updateRecipientAccount(contract: Contract, recipient: Address, transferAmount: BigDecimal) : void {
  let recipientId = recipient.toHexString()
  let account = Account.load(recipientId)

  // If this the first transaction for this recipient, create a new account
  if (account == null) {
    let token = getTokenInstance()

    // Create the empty account
    account = new Account(recipientId)
    account.token = token.id

    // Increment the total number of holders (if received more than zero tokens)
    if (transferAmount.gt(DECIMAL_ZERO)) {
      token.totalHolders = token.totalHolders.plus(INT_ONE)
      token.save()
    }
  }

  // Update the recipient's balance
  account.balance = convertTokenToDecimal(contract.balanceOf(recipient))
  account.save()
}

export function updateAccountBalances() : void {
  let token = getTokenInstance()

  token.accounts.forEach((accountId) => {
    let address = Address.fromString(accountId)
    let contract = Contract.bind(address)

    // Determine account balance from contract
    let currentBalance = convertTokenToDecimal(contract.balanceOf(address))

    // If the account balance is zero, skip this account
    // This is to avoid fetching and updating empty accounts (they are not earning fees)
    if (currentBalance.le(DECIMAL_ZERO)) {
      return
    }

    // Update the account balance and save the account
    let account = Account.load(accountId)
    if (account != null) {
      account.balance = currentBalance
      account.save()
    }
  })
}