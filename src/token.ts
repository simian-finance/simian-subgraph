import { Address } from '@graphprotocol/graph-ts'
import { Contract } from './types/Contract/Contract'
import { Token } from './types/schema'
import { convertTokenToDecimal } from "./helpers"
import { BURN_ADDRESS, CONTRACT_ADDRESS, DECIMAL_ZERO, INT_ZERO } from "./constants"

// Gets the singleton instance of the token entity
export function getTokenInstance() : Token {
  let contract = Contract.bind(Address.fromString(CONTRACT_ADDRESS))
  let token = Token.load(CONTRACT_ADDRESS)

  // If the token instance does not exist, create it (lazy-loaded)
  if (token == null) {
    token = new Token(CONTRACT_ADDRESS)
    token.name = contract.name()
    token.symbol = contract.symbol()
    token.decimals = contract.decimals()

    token.totalSupply = convertTokenToDecimal(contract.totalSupply())
    token.totalBurned = DECIMAL_ZERO
    token.remainingSupply = token.totalSupply

    token.totalHolders = INT_ZERO
    token.totalTransfers = INT_ZERO
    token.totalFees = DECIMAL_ZERO
    token.save()
  }

  return token as Token
}

export function updateTokenSupply() : void {
  let contract = Contract.bind(Address.fromString(CONTRACT_ADDRESS))
  let token = getTokenInstance()

  // Get the amount burned
  let burnAddress = Address.fromString(BURN_ADDRESS)
  let totalBurned = convertTokenToDecimal(contract.balanceOf(burnAddress))

  // Determine remaining supply from burned
  token.totalBurned = totalBurned
  token.remainingSupply = token.totalSupply.minus(totalBurned)

  // Update total fees
  token.totalFees = convertTokenToDecimal(contract.totalFees())
  token.save()
}
