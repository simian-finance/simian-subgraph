import { Address, BigDecimal } from "@graphprotocol/graph-ts"
import { SimianToken, Transfer as TransferEvent } from './types/SimianToken/SimianToken'
import { Transfer } from './types/schema'
import { getTokenInstance } from "./token"
import { updateRecipientAccount, updateSenderAccount } from "./accounts"
import { convertTokenToDecimal } from "./helpers"

let NINETY_FIVE_PERCENT = BigDecimal.fromString("0.95")
let FIVE_PERCENT = BigDecimal.fromString("0.05")

// Handles a Transfer event from the token contract
export function handleTransfer(event: TransferEvent) : void {
  // Bind the contract to the address that emitted the event
  let contract = SimianToken.bind(event.address)

  // The ID will be the transaction hash since that is likely unique to each transfer
  let id = event.transaction.hash.toHexString()

  let transfer = Transfer.load(id)
  if (transfer == null) {
    transfer = new Transfer(id)
    transfer.token = getTokenInstance().id
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

  updateSenderAccount(contract, transfer.from as Address, transfer.transferAmount)
  updateRecipientAccount(contract, transfer.to as Address, transfer.transferAmount)
}
