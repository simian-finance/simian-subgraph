import { BigDecimal } from "@graphprotocol/graph-ts"
import { Transfer as TransferEvent } from './types/SimianToken/SimianToken'
import { Transfer } from './types/schema'
import { convertTokenToDecimal } from "./helpers"

let NINETY_FIVE_PERCENT = BigDecimal.fromString("0.95")
let FIVE_PERCENT = BigDecimal.fromString("0.05")

// Handles a Transfer event from the token contract
export function handleTransfer(event: TransferEvent) : void {
  // The ID will be the transaction hash since that is likely unique to each transfer
  let id = event.transaction.hash.toHexString()

  let transfer = Transfer.load(id)
  if (transfer == null) {
    transfer = new Transfer(id)
  }

  // Set transaction info
  transfer.transaction = event.transaction.hash
  transfer.blockNumber = event.block.number
  transfer.timestamp = event.block.timestamp

  // Get sender, recipient, and transferred amount from event
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.transferAmount = convertTokenToDecimal(event.params.value)

  // Determine original amount and fee amount
  transfer.amount = transfer.transferAmount.div(NINETY_FIVE_PERCENT)
  transfer.feeAmount = transfer.amount.times(FIVE_PERCENT)

  transfer.save()
}

/*function _updateSender(contract: SimianToken, transfer: Transfer) : void {
  let senderId = transfer.from.toHexString()
  let sender = Wallet.load(senderId)

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

function _updateReceiver(contract: SimianToken, transfer: Transfer) : void {
  let receiverId = transfer.to.toHexString()
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
}*/
