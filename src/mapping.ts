import { BigDecimal } from "@graphprotocol/graph-ts"
import { Transfer as TransferEvent } from './types/SimianToken/SimianToken'
import { Transfer } from './types/schema'
import { convertTokenToDecimal } from "./helpers"

const NINETY_FIVE_PERCENT = BigDecimal.fromString("0.95")
const FIVE_PERCENT = BigDecimal.fromString("0.05")

// Handles a Transfer event from the token contract
export function handleTransfer(event: TransferEvent): void {
  // The ID will be the transaction hash since that is likely unique to each transfer
  const id = event.transaction.hash.toHexString()

  let transfer = Transfer.load(id)
  if (transfer == null) {
    transfer = new Transfer(id)
  }

  transfer.transaction = event.transaction.hash
  transfer.blockNumber = event.block.number
  transfer.timestamp = event.block.timestamp

  transfer.from = event.params.from
  transfer.to = event.params.to

  // Calculate the original amount, fee amount, and net transfer amount
  transfer.transferAmount = convertTokenToDecimal(event.params.value)
  transfer.amount = transfer.transferAmount.div(NINETY_FIVE_PERCENT)
  transfer.feeAmount = transfer.amount.times(FIVE_PERCENT)

  transfer.save()
}
