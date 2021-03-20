import { TransferCall } from './types/SimianToken/SimianToken'
import { Transfer } from './types/schema'
import {BigDecimal} from "@graphprotocol/graph-ts";

const FIVE_PERCENT = BigDecimal.fromString("0.05")

// Handles a Transfer event from the token contract
export function handleTransfer(call: TransferCall): void {
  // The ID will be the transaction hash since that is likely unique to each transfer
  const id = call.transaction.hash.toHexString()

  let transfer = Transfer.load(id)
  if (transfer == null) {
    transfer = new Transfer(id)
  }

  transfer.blockNumber = call.block.number
  transfer.timestamp = call.block.timestamp

  transfer.from = call.from
  transfer.to = call.inputs.recipient

  transfer.amount = call.inputs.amount.toBigDecimal()
  transfer.feeAmount = transfer.amount.times(FIVE_PERCENT)
  transfer.transferAmount = transfer.amount.minus(transfer.feeAmount)

  transfer.save()
}
