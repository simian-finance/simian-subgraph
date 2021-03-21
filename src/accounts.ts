import { Address, BigInt, BigDecimal } from "@graphprotocol/graph-ts"
import { Contract } from './types/Contract/Contract'
import { Account } from './types/schema'
import { getTokenInstance } from "./token"
import { convertTokenToDecimal } from "./helpers"
import { INT_ZERO, INT_ONE, DECIMAL_ZERO } from "./constants"

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

export function updateAccountBalances() : BigInt {
  let token = getTokenInstance()

  var totalHolders = INT_ZERO

  token.accounts.forEach((accountId) => {
    let account = Account.load(accountId)
    if (account == null) {
      return
    }

    let address = Address.fromString(accountId)
    let contract = Contract.bind(address)

    // Update account balance from contract
    let prevBalance = account.balance
    account.balance = convertTokenToDecimal(contract.balanceOf(address))

    // Only save account if the balance has changed
    if (!account.balance.equals(prevBalance)) {
      account.save()
    }

    // If account balance greater than zero, increment the holder count
    if (account.balance.gt(DECIMAL_ZERO)) {
      totalHolders.plus(INT_ONE)
    }
  })

  return totalHolders
}