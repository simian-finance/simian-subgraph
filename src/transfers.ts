import { Address, BigDecimal } from "@graphprotocol/graph-ts"
import { SimianToken, Transfer as TransferEvent } from './types/SimianToken/SimianToken'
import { Transfer, Wallet } from './types/schema'
import { DECIMAL_ZERO } from "./constants"
import { convertTokenToDecimal } from "./helpers"

let NINETY_FIVE_PERCENT = BigDecimal.fromString("0.95")
let FIVE_PERCENT = BigDecimal.fromString("0.05")

// Handles a Transfer event from the token contract
export function handleTransfer(event: TransferEvent): void {
  // Bind the contract to the address that emitted the event
  const contract = SimianToken.bind(event.address)

  // The ID will be the transaction hash since that is likely unique to each transfer
  let id = event.transaction.hash.toHexString()

  let transfer = Transfer.load(id)
  if (transfer == null) {
    transfer = new Transfer(id)
  }

  transfer.transaction = event.transaction.hash
  transfer.blockNumber = event.block.number
  transfer.timestamp = event.block.timestamp

  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.transferAmount = convertTokenToDecimal(event.params.value)
  transfer.feeExcluded = false

  // Check if the transaction should be excluded from fees
  transfer.feeExcluded = contract.isExcluded(event.params.to)

  // If not excluded, calculate the original amount and fees
  // kat: TODO really? I read the contract as if the fees are always subtracted.
  //      imo the difference to not excluded accounts is that the reflection is not applied (contract line 320)
  if (!transfer.feeExcluded) {
    transfer.amount = transfer.transferAmount.div(NINETY_FIVE_PERCENT)
    transfer.feeAmount = transfer.amount.times(FIVE_PERCENT)
  } else {
    // Excluded from fees
    transfer.amount = transfer.transferAmount
    transfer.feeAmount = DECIMAL_ZERO
  }

  transfer.save()

  // now updating the wallets (sender and receiver) of this transfer
  _updateWallets(contract, transfer as Transfer)
}

function _updateWallets(contract: SimianToken, transfer: Transfer): void {

  _updateSender(transfer, contract)
  _updateReceiver(transfer, contract)

}

function _updateSender(transfer: Transfer, contract: SimianToken): void {
  const senderId = transfer.from.toHexString()

  const sender = Wallet.load(senderId)

  // the sender can only send if he has received tokens before, so this should never be null (except ADDRESS_ZERO)
  if (sender != null) {
    // the rawBalance contains all tokens that were ever transferred to this account
    // without taking the reflections into account
    sender.rawBalance = sender.rawBalance.minus(transfer.amount)

    // the balance is the official token balance (including reflections)
    sender.balance = convertTokenToDecimal(contract.balanceOf(Address.fromString(senderId)))

    // the earned fees are the actual balanc minus the raw transferred balance
    sender.earnedFees = sender.balance.minus(sender.rawBalance)

    sender.save()
  }

}

function _updateReceiver(transfer: Transfer, contract: SimianToken): void {
  const receiverId = transfer.to.toHexString()

  let receiver = Wallet.load(receiverId)

  // if this is the first transaction, then we generate an "empty" wallet
  if (receiver == null) {
    receiver = new Wallet(receiverId)
    receiver.rawBalance = DECIMAL_ZERO
  }
  receiver.rawBalance = receiver.rawBalance.plus(transfer.transferAmount)
  receiver.balance = convertTokenToDecimal(contract.balanceOf(Address.fromString(receiverId)))
  receiver.earnedFees = receiver.balance.minus(receiver.rawBalance)

  receiver.save()
}