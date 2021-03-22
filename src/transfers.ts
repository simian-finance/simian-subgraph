import { Address, BigDecimal } from "@graphprotocol/graph-ts"
import { Contract, Transfer as TransferEvent } from './types/Contract/Contract'
import { Transfer } from './types/schema'
import { getTokenInstance } from "./token"
import { updateRecipientAccount, updateSenderAccount } from "./accounts"
import { convertTokenToDecimal } from "./helpers"
import { INT_ONE } from "./constants"

let NINETY_FIVE_PERCENT = BigDecimal.fromString("0.95")
let FIVE_PERCENT = BigDecimal.fromString("0.05")

// Handles a Transfer event from the token contract
export function handleTransfer(event: TransferEvent) : void {
  // Bind the contract to the address that emitted the event
  let contract = Contract.bind(event.address)

  // The ID will be the transaction hash since that is likely unique to each transfer
  let id = event.transaction.hash.toHexString()

  let transfer = Transfer.load(id)
  if (transfer == null) {
    let token = getTokenInstance()

    // Create new transfer
    transfer = new Transfer(id)
    transfer.token = token.id

    // Increment total transfer count
    token.totalTransfers = token.totalTransfers.plus(INT_ONE)
    token.save()
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
