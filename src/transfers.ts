import { BigDecimal } from "@graphprotocol/graph-ts"
import { Transfer as TransferEvent } from './types/Contract/Contract'
import { Transfer } from './types/schema'
import { convertTokenToDecimal } from "./helpers"

let NINETY_FIVE_PERCENT = BigDecimal.fromString("0.95")
let FIVE_PERCENT = BigDecimal.fromString("0.05")

/* Records the transfer as a graph entity and returns it */
export function recordTransfer(event: TransferEvent): Transfer {
  // The ID will be the transaction hash since that is likely unique to each transfer
  let id = event.transaction.hash.toHexString()

  // Create transfer if it does not exist already
  let transfer = Transfer.load(id)
  if (transfer == null) {
    transfer = new Transfer(id)
  }

  // Set transaction and block metadata
  transfer.transaction = event.transaction.hash
  transfer.blockNumber = event.block.number
  transfer.blockHash = event.block.hash
  transfer.timestamp = event.block.timestamp

  // Get the sender, recipient, and amount transferred
  transfer.from = event.params.from
  transfer.to = event.params.to
  transfer.transferAmount = convertTokenToDecimal(event.params.value)

  // Determine original amount and fee amount
  transfer.amount = transfer.transferAmount.div(NINETY_FIVE_PERCENT)
  transfer.feeAmount = transfer.amount.times(FIVE_PERCENT)

  transfer.save()
  return transfer as Transfer
}
