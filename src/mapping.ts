import { TransferCall } from './types/SimianToken/SimianToken'
import { Transfer } from './types/schema'
import {BigDecimal} from "@graphprotocol/graph-ts"
import { convertTokenToDecimal } from "./helpers"

const FIVE_PERCENT = BigDecimal.fromString("0.05")

// Handles a Transfer event from the token contract
export function handleTransfer(call: TransferCall): void {
  // The ID will be the transaction hash since that is likely unique to each transfer
  const id = call.transaction.hash.toHexString()

  let transfer = Transfer.load(id)
  if (transfer == null) {
    transfer = new Transfer(id)
  }

  transfer.transaction = call.transaction.hash
  transfer.blockNumber = call.block.number.toI32()
  transfer.timestamp = call.block.timestamp.toI32()

  transfer.from = call.from
  transfer.to = call.inputs.recipient

  // Calculate the original amount, fee amount, and net transfer amount
  transfer.amount = convertTokenToDecimal(call.inputs.amount)
  transfer.feeAmount = transfer.amount.times(FIVE_PERCENT)
  transfer.transferAmount = transfer.amount.minus(transfer.feeAmount)

  transfer.save()
}
