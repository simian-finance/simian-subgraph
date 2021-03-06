import { Address } from "@graphprotocol/graph-ts/index"
import { Contract, Transfer as TransferEvent } from "./types/Contract/Contract"
import { getTokenInstance } from "./token"
import { updateRecipientAccount, updateSenderAccount } from "./accounts"
import { recordTransfer } from "./transfers"
import { convertTokenToDecimal } from "./helpers"
import { BURN_ADDRESS, CONTRACT_ADDRESS, DECIMAL_ZERO, INT_ONE } from "./constants"

/* Performed on every Transfer event emitted from the contract */
export function handleTransferEvent(event: TransferEvent): void {
  let token = getTokenInstance()
  let contract = Contract.bind(Address.fromString(CONTRACT_ADDRESS))

  // Ignore any transfers that have zero values
  let transferAmount = convertTokenToDecimal(event.params.value)
  if (transferAmount.le(DECIMAL_ZERO)) {
    return
  }

  // Record the transfer and increment total count
  let transfer = recordTransfer(event)
  token.totalTransfers = token.totalTransfers.plus(INT_ONE)

  // Update the sender and recipient balances
  let senderSentAll = updateSenderAccount(contract, transfer.from as Address, transfer.transferAmount)
  let isNewHolder = updateRecipientAccount(contract, transfer.to as Address, transfer.transferAmount)

  // If sender now has a zero balance, decrement the holder count
  if (senderSentAll) {
    token.totalHolders = token.totalHolders.minus(INT_ONE)
  }
  // If recipient is a new account, increment the holder count
  if (isNewHolder) {
    token.totalHolders = token.totalHolders.plus(INT_ONE)
  }

  // If recipient is the burn address, update the burn/supply counts
  if (transfer.to.toHexString() == BURN_ADDRESS) {
    token.totalBurned = token.totalBurned.plus(transferAmount)
    token.remainingSupply = token.totalSupply.minus(token.totalBurned)
  }

  // Update total fees accumulated from contract
  token.totalFees = convertTokenToDecimal(contract.totalFees())
  token.save()
}
