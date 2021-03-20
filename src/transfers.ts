import { BigDecimal } from "@graphprotocol/graph-ts"
import { Transfer as TransferEvent } from './types/SimianToken/SimianToken'
import { Transfer } from './types/schema'
import { UNISWAP_V2_CONTRACT_ADDRESS, DECIMAL_ZERO } from "./constants"
import { convertTokenToDecimal } from "./helpers"

let NINETY_FIVE_PERCENT = BigDecimal.fromString("0.95")
let FIVE_PERCENT = BigDecimal.fromString("0.05")

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

  // Ideally we would build a list of exclusions and check dynamically
  // But for now, we'll just settle on hardcoding Uniswap's contract address
  transfer.feeExcluded = transfer.to.toHexString() == UNISWAP_V2_CONTRACT_ADDRESS
  transfer.transferAmount = convertTokenToDecimal(event.params.value)

  if (!transfer.feeExcluded) {
    // Calculate the original amount and fee amount
    transfer.amount = transfer.transferAmount.div(NINETY_FIVE_PERCENT)
    transfer.feeAmount = transfer.amount.times(FIVE_PERCENT)
  } else {
    // Excluded from fees
    transfer.amount = transfer.transferAmount
    transfer.feeAmount = DECIMAL_ZERO
  }

  transfer.save()
}